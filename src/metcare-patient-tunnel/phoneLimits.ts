/**
 * Per-country phone length rules, shared by every phone field in the app.
 *
 * The cap is the longest real MOBILE / FIXED_LINE national number for the
 * country (libphonenumber "max" metadata). libphonenumber's *general* possible
 * lengths also include pagers, VoIP, premium numbers, etc. (e.g. Pakistan
 * would allow 12 digits when real phones have 10), so we do not use those.
 *
 * A leading national trunk prefix (the "0" in FR/BE/GB/PK…, "1" in US/CA,
 * "8" in RU) is allowed on top of the cap, so France accepts 06 12 34 56 78
 * (10 typed digits) or +33 6 12 34 56 78 (9 national digits), and nothing longer.
 */
import { Metadata } from "libphonenumber-js/core";
import { getCountryCallingCode, isValidPhoneNumber, type CountryCode } from "libphonenumber-js/max";
import metadata from "libphonenumber-js/metadata.max.json";

// libphonenumber-js ships these members at runtime but leaves them out of its
// public typings, so we describe the slice we rely on here.
type NumberingPlanInternals = {
  possibleLengths(): number[];
  nationalPrefix(): string | number | undefined;
  type(type: "MOBILE" | "FIXED_LINE"): { possibleLengths(): number[] } | undefined;
};

type MetadataInternals = {
  hasCountry(country: string): boolean;
  selectNumberingPlan(country: CountryCode): void;
  numberingPlan?: NumberingPlanInternals;
};

const meta = new Metadata(metadata) as unknown as MetadataInternals;

/** E.164 ceiling, used for countries the metadata does not know. */
const FALLBACK_MAX_DIGITS = 15;

function selectPlan(iso: string | undefined): NumberingPlanInternals | undefined {
  if (!iso || !meta.hasCountry(iso)) return undefined;
  meta.selectNumberingPlan(iso as CountryCode);
  return meta.numberingPlan;
}

/** Longest national number (without trunk prefix) a real mobile or landline can have in `iso`. */
export function maxNationalDigits(iso: string | undefined): number {
  const plan = selectPlan(iso);
  if (!plan) return FALLBACK_MAX_DIGITS;
  const lengths = (["MOBILE", "FIXED_LINE"] as const).flatMap(
    (t) => plan.type(t)?.possibleLengths() ?? [],
  );
  if (lengths.length) return Math.max(...lengths);
  const general = plan.possibleLengths();
  return general.length ? Math.max(...general) : FALLBACK_MAX_DIGITS;
}

/** The country's trunk prefix ("0" for FR), or undefined when it has none. */
export function nationalPrefixOf(iso: string | undefined): string | undefined {
  const np = selectPlan(iso)?.nationalPrefix();
  return typeof np === "string" && np.length > 0 ? np : undefined;
}

/**
 * Options for the length checks.
 * `international: true` means the digits follow a "+<calling code>" (e.g. the
 * part after "+33"). A trunk prefix never belongs there, so every digit counts
 * against the limit: France allows exactly 9 digits after +33.
 */
export type PhoneLengthOptions = { international?: boolean };

/** Strip a leading trunk prefix, if present, from a string of national digits. */
function withoutTrunkPrefix(digits: string, iso: string | undefined): string {
  const np = nationalPrefixOf(iso);
  return np && digits.startsWith(np) && digits.length > np.length ? digits.slice(np.length) : digits;
}

/**
 * True when `nationalDigits` (what the user typed after the dial code, any
 * formatting allowed) has more digits than the country allows. In national
 * format a leading trunk prefix is not counted (FR "06 12 34 56 78" is OK);
 * with `{ international: true }` every digit counts.
 */
export function exceedsMaxNationalDigits(
  nationalDigits: string,
  iso: string | undefined,
  opts: PhoneLengthOptions = {},
): boolean {
  const digits = nationalDigits.replace(/\D/g, "");
  const d = opts.international ? digits : withoutTrunkPrefix(digits, iso);
  return d.length > maxNationalDigits(iso);
}

/**
 * Trim a national-number string down to the country's limit. In national
 * format a leading trunk prefix is kept on top of the limit; with
 * `{ international: true }` it is not. Use on paste and when the selected
 * country changes.
 */
export function clampNationalDigits(
  nationalDigits: string,
  iso: string | undefined,
  opts: PhoneLengthOptions = {},
): string {
  const digits = nationalDigits.replace(/\D/g, "");
  const np = nationalPrefixOf(iso);
  const hasTrunk = !opts.international && !!np && digits.startsWith(np) && digits.length > np.length;
  const max = maxNationalDigits(iso) + (hasTrunk ? np!.length : 0);
  return digits.slice(0, max);
}

/**
 * Decides whether an edit to an *international* phone field ("+33 6 12…")
 * should be blocked. `nextText` is the field's prospective text, `inserted`
 * the inserted text, `iso` the country the field currently resolves to.
 *
 * Never blocks while the user is (re)typing a dial code: an insert containing
 * "+", a text whose "+…" prefix is not this country's calling code, or an
 * empty national part all pass through.
 */
export function phoneInsertOverflows(nextText: string, inserted: string, iso: string | undefined): boolean {
  if (inserted.includes("+") || !iso || !meta.hasCountry(iso)) return false;
  const digits = nextText.replace(/\D/g, "");
  if (!digits) return false;

  let national = digits;
  const international = nextText.trimStart().startsWith("+");
  if (international) {
    const callingCode = getCountryCallingCode(iso as CountryCode);
    if (!digits.startsWith(callingCode)) return false;
    national = digits.slice(callingCode.length);
  }

  if (!national) return false;
  return exceedsMaxNationalDigits(national, iso, { international });
}

/**
 * Submit-time check: the number must be a real, correctly sized number for
 * the selected country. `value` may be E.164 ("+33612345678") or national
 * ("06 12 34 56 78") when `iso` is given.
 */
export function isValidPhoneForCountry(value: string | undefined, iso: string | undefined): boolean {
  if (!value) return false;
  const v = value.trim();
  try {
    return v.startsWith("+")
      ? isValidPhoneNumber(v)
      : !!iso && isValidPhoneNumber(v, iso as CountryCode);
  } catch {
    return false;
  }
}
