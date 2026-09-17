import { Metadata } from 'libphonenumber-js/core';
import type { CountryCode } from 'libphonenumber-js';
import metadata from 'libphonenumber-js/metadata.max.json';

/**
 * The runtime `Metadata` / `NumberingPlan` objects expose `hasCountry`, `type()` and
 * `nationalPrefix()`, but the shipped `.d.ts` (1.13.x) only declares a subset, so the
 * members we rely on are described here and the instance is cast once.
 */
type NumberTypeInfo = { possibleLengths(): number[] };
type NumberingPlanRuntime = {
  possibleLengths(): number[];
  nationalPrefix(): string | undefined;
  type(t: 'MOBILE' | 'FIXED_LINE'): NumberTypeInfo | undefined;
};
type MetadataRuntime = {
  hasCountry(iso: string): boolean;
  selectNumberingPlan(iso: CountryCode): void;
  numberingPlan?: NumberingPlanRuntime;
};

const meta = new Metadata(metadata) as unknown as MetadataRuntime;

function planFor(iso: string): NumberingPlanRuntime | undefined {
  if (!meta.hasCountry(iso)) return undefined;
  meta.selectNumberingPlan(iso as CountryCode);
  return meta.numberingPlan;
}

/**
 * Maximum national-number length for real mobile / landline numbers of a country.
 * libphonenumber's general "possible lengths" include rare number types (pagers, VoIP,
 * premium...), so e.g. Pakistan would accept 12 digits when a phone is 10. Falls back to
 * the general possible lengths when the plan lists no mobile/landline type, and to 15
 * (E.164 max) for unknown countries.
 */
export function maxNationalDigits(iso: string): number {
  const plan = planFor(iso);
  if (!plan) return 15;
  const lengths = (['MOBILE', 'FIXED_LINE'] as const).flatMap(
    (t) => plan.type(t)?.possibleLengths() ?? []
  );
  return lengths.length ? Math.max(...lengths) : Math.max(...plan.possibleLengths());
}

function nationalPrefixOf(iso: string): string | undefined {
  const np = planFor(iso)?.nationalPrefix();
  return typeof np === 'string' && np.length > 0 ? np : undefined;
}

/** More digits than the country's mobile/landline numbers allow (a leading trunk prefix like FR/PK/GB "0" is not counted). */
export function exceedsMaxNationalDigits(nationalDigits: string, iso: string): boolean {
  let d = nationalDigits.replace(/\D/g, '');
  const np = nationalPrefixOf(iso);
  if (np && d.startsWith(np) && d.length > np.length) d = d.slice(np.length);
  return d.length > maxNationalDigits(iso);
}
