import { AnimatePresence, motion } from 'motion/react';
import { X, ChevronRight, ChevronLeft, ChevronDown, CheckCircle2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import {
  PhoneInput,
  defaultCountries,
  parseCountry,
  FlagImage,
  type ParsedCountry,
  type PhoneInputRefType,
} from 'react-international-phone';
import 'react-international-phone/style.css';
import { isValidPhoneNumber, type CountryCode } from 'libphonenumber-js';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
} from 'react';
import {
  patientCopy,
  getPatientForm1AideOptions,
  getPatientForm1InterventionOptions,
  getPatientForm1TypeOptions,
  type PatientForm1Data,
} from './copy';
import { submitPatientForm1ToWebhook } from './patientForm1Webhook';
import { exceedsMaxNationalDigits } from './phoneLimits';
import { PatientPrimaryButton } from './PatientTunnelShared';
import { useLanguage } from './i18n';
import { trackCustom, trackLead } from '../utils/metaPixel';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PatientForm1Data) => void;
  sourceCta?: string;
};

const initialForm: PatientForm1Data = {
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  telephoneIso2: '',
  ville: '',
  dateIntervention: '',
  pays: '',
  paysIso2: '',
  interventionRealisee: '',
  typesIntervention: [],
  aideAujourdhui: [],
};

const PHONE_PREFERRED_COUNTRIES: Record<'fr' | 'en' | 'es', string[]> = {
  es: ['es', 'mx', 'ar', 'co', 'cl', 'pe', 'us', 'fr', 'gb'],
  en: ['gb', 'us', 'fr', 'es', 'ca', 'au'],
  fr: ['fr', 'be', 'ch', 'ca', 'us', 'gb', 'es'],
};

/** Time window (ms) during which consecutive keystrokes in the country dropdown form one dial-code query. */
const DIAL_CODE_TYPEAHEAD_WINDOW_MS = 1000;

/**
 * National digits of a phone string (formatted or E.164) for the given dial code.
 * Returns null when the digits don't start with that dial code (e.g. the user is
 * typing a different "+xx" prefix to switch country) so no cap is applied.
 */
function nationalDigitsFor(phone: string, dialCode: string): string | null {
  const digits = phone.replace(/\D/g, '');
  if (!dialCode || !digits.startsWith(dialCode)) return null;
  return digits.slice(dialCode.length);
}

/**
 * True when the digits exceed the country's mobile/landline maximum (not libphonenumber's
 * general possible lengths, which include rare number types and over-accept e.g. PK 12 vs 10).
 */
function isNationalNumberTooLong(nationalDigits: string, iso2: string): boolean {
  if (!nationalDigits || !iso2) return false;
  return exceedsMaxNationalDigits(nationalDigits, iso2.toUpperCase());
}

/** Find a country by dial code (exact first, then prefix), preferred countries taking priority. */
function findCountryByDialCode(digits: string, preferred: string[]): ParsedCountry | undefined {
  const all = defaultCountries.map(parseCountry);
  const ordered = [
    ...preferred
      .map((iso2) => all.find((c) => c.iso2 === iso2))
      .filter((c): c is ParsedCountry => Boolean(c)),
    ...all.filter((c) => !preferred.includes(c.iso2)),
  ];
  return (
    ordered.find((c) => c.dialCode === digits) ??
    ordered.find((c) => c.dialCode.startsWith(digits))
  );
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 15, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4 } }
};

export default function PatientTunnelFormModal({ isOpen, onClose, onSubmit, sourceCta }: Props) {
  const { lang } = useLanguage();
  const copy = patientCopy[lang].form1;
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<PatientForm1Data>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [phoneDialCode, setPhoneDialCode] = useState('');
  const phoneInputRef = useRef<PhoneInputRefType>(null);
  /** Mirror of the selected phone country for the native listener (fallback if the ref lacks `state`). */
  const phoneCountryRef = useRef<{ iso2: string; dialCode: string } | null>(null);
  const dialCodeTypeaheadRef = useRef<{ value: string; at: number }>({ value: '', at: 0 });
  const phonePreferredCountries = PHONE_PREFERRED_COUNTRIES[lang];

  // Hard cap: refuse digits beyond the maximum national-number length of the selected country.
  // Listens to the native (bubbling, cancelable) `beforeinput` event on the phone wrapper so the
  // library never sees the excess. Covers typing, paste and drop; an over-long paste is trimmed
  // to the digits that still fit. The wrapper is mounted together with <PhoneInput>, so a callback
  // ref (rather than an effect) attaches the listener exactly when step 3 appears.
  const onPhoneBeforeInput = useCallback((e: Event) => {
    const ev = e as InputEvent;
    const el = ev.target;
    if (!(el instanceof HTMLInputElement)) return;
    if (el !== phoneInputRef.current && !el.classList.contains('react-international-phone-input')) return;
    if (!ev.inputType?.startsWith('insert') || ev.inputType.includes('Composition')) return;
    const inserted = ev.data ?? ev.dataTransfer?.getData('text/plain') ?? '';
    const insertedDigits = inserted.replace(/\D/g, '');
    if (!insertedDigits) return;
    const country = phoneInputRef.current?.state?.country ?? phoneCountryRef.current;
    if (!country) return;

    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? start;
    const fits = (text: string) => {
      const next = el.value.slice(0, start) + text + el.value.slice(end);
      const national = nationalDigitsFor(next, country.dialCode);
      return national === null || !isNationalNumberTooLong(national, country.iso2);
    };
    if (fits(inserted)) return;

    ev.preventDefault();
    // Multi-digit insert (paste/drop): keep the leading digits that still fit.
    let keep = insertedDigits.length - 1;
    while (keep > 0 && !fits(insertedDigits.slice(0, keep))) keep -= 1;
    if (keep > 0) {
      const text = insertedDigits.slice(0, keep);
      el.setRangeText(text, start, end, 'end');
      el.dispatchEvent(
        new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text })
      );
    }
  }, []);

  const phoneWrapNodeRef = useRef<HTMLDivElement | null>(null);
  const phoneWrapRef = useCallback(
    (node: HTMLDivElement | null) => {
      phoneWrapNodeRef.current?.removeEventListener('beforeinput', onPhoneBeforeInput);
      phoneWrapNodeRef.current = node;
      node?.addEventListener('beforeinput', onPhoneBeforeInput);
    },
    [onPhoneBeforeInput]
  );

  // Country dropdown: the library only offers type-to-jump on the (English) country name.
  // Add type-to-jump on the dial code ("+92" / "92") so the country can be found either way.
  const handlePhoneWrapKeyDownCapture = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    if (!target?.closest?.('.react-international-phone-country-selector-dropdown')) return;
    if (e.altKey || e.ctrlKey || e.metaKey || !/^[\d+]$/.test(e.key)) return;
    const now = Date.now();
    const prev = dialCodeTypeaheadRef.current;
    const value = (now - prev.at > DIAL_CODE_TYPEAHEAD_WINDOW_MS ? '' : prev.value) + e.key;
    dialCodeTypeaheadRef.current = { value, at: now };
    const digits = value.replace(/\D/g, '');
    if (!digits) return;
    const match = findCountryByDialCode(digits, phonePreferredCountries);
    if (match) phoneInputRef.current?.setCountry(match.iso2);
  };

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setForm(initialForm);
      setSubmitted(false);
      setPhoneDialCode('');
      return;
    }

    // Meta Pixel: Track AssessmentStarted when modal opens
    trackCustom('AssessmentStarted', {
      name: lang === 'fr' ? 'Patient Tunnel Form 1 (FR)' : lang === 'en' ? 'Patient Tunnel Form 1 (EN)' : 'Patient Tunnel Form 1 (ES)',
      sourceCta,
    });

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen, lang, sourceCta]);

  const steps = [
    { title: copy.title, fields: ['interventionRealisee', 'typesIntervention'] },
    { title: lang === 'fr' ? 'Vos besoins' : lang === 'en' ? 'Your needs' : 'Tus necesidades', fields: ['aideAujourdhui'] },
    { title: lang === 'fr' ? 'Vos coordonnées' : lang === 'en' ? 'Your contact info' : 'Tu información de contacto', fields: ['nom', 'prenom', 'email', 'telephone', 'ville', 'dateIntervention', 'pays'] },
  ];

  const phoneDigits = form.telephone.replace(/\D/g, '');
  const nationalPhoneDigits =
    phoneDialCode && phoneDigits.startsWith(phoneDialCode)
      ? phoneDigits.slice(phoneDialCode.length)
      : phoneDigits;
  const isPhoneValid =
    nationalPhoneDigits.length > 0 &&
    isValidPhoneNumber(form.telephone, form.telephoneIso2.toUpperCase() as CountryCode);
  const showPhoneError = nationalPhoneDigits.length > 0 && !isPhoneValid;

  const canGoNext = useMemo(() => {
    if (step === 1) return form.interventionRealisee && form.typesIntervention.length > 0;

    if (step === 2) return form.aideAujourdhui.length > 0;

    if (step === 3) {
      return (
        form.nom.trim() &&
        form.prenom.trim() &&
        /\S+@\S+\.\S+/.test(form.email) &&
        isPhoneValid &&
        form.ville.trim() &&
        form.dateIntervention.trim() &&
        form.pays.trim()
      );
    }

    return false;
  }, [step, form]);


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (step < 3) {
       setStep(s => s + 1);
       return;
    }
    setSubmitted(true);
    if (!canGoNext) return;

    // Meta Pixel: Track Lead on form submission
    trackLead(
      lang === 'fr'
        ? 'Patient Tunnel – Form 1 (FR)'
        : lang === 'en'
        ? 'Patient Tunnel – Form 1 (EN)'
        : 'Patient Tunnel – Form 1 (ES)'
    );

    submitPatientForm1ToWebhook(form, { sourceCta });
    onSubmit(form);
    onClose();
  };

  const toggleArr = (field: 'typesIntervention' | 'aideAujourdhui', value: string) => {
    setForm((c) => {
      const set = new Set(c[field]);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      return { ...c, [field]: [...set] };
    });
  };

  const interventionOptions = getPatientForm1InterventionOptions(lang);
  const typeOptions = getPatientForm1TypeOptions(lang);
  const aideOptions = getPatientForm1AideOptions(lang);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-cherry/40 backdrop-blur-xl"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 32, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, y: 24, filter: 'blur(10px)' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[1001] flex items-center justify-center overflow-x-hidden p-4 sm:p-6"
          >
            <div
              className="patient-tunnel-glass relative flex h-auto max-h-[min(750px,calc(100dvh-2rem))] w-full min-w-0 max-w-4xl flex-col overflow-hidden rounded-[2.5rem] border border-white/20 shadow-2xl shadow-cherry/30"
              data-lenis-prevent
            >
              {/* Header */}
              <div className="relative border-b border-cherry/10 bg-white/30 px-6 py-8 md:px-10">
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-cherry/5 text-cherry/40 transition-all hover:bg-cherry/10 hover:text-cherry"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-4 mb-3">
                   <div className="flex gap-1.5">
                      {[1, 2, 3].map(s => (
                        <motion.div 
                          key={s} 
                          initial={false}
                          animate={{ 
                            width: s === step ? 32 : 8,
                            backgroundColor: s <= step ? 'rgba(43, 21, 23, 1)' : 'rgba(43, 21, 23, 0.1)'
                          }}
                          className="h-1 rounded-full transition-all duration-500" 
                        />
                      ))}
                   </div>
                   <span className="text-[0.6rem] font-bold tracking-[0.2em] text-cherry/40 uppercase">{lang === 'fr' ? 'ÉTAPE' : lang === 'en' ? 'STEP' : 'PASO'} {step}/3</span>
                </div>
                <motion.h2 
                  key={step}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-semibold text-cherry md:text-3xl"
                >
                  {steps[step - 1].title}
                </motion.h2>
              </div>

              {/* Form Content */}
              <form
                onSubmit={handleSubmit}
                className="flex flex-col flex-1 min-h-0 overflow-y-auto"
              >
                <div className="px-6 py-8 md:px-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    exit={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="min-w-0 flex-1 space-y-8"
                  >
                    {step === 1 && (
                      <>
                        <motion.div variants={staggerItem} className="space-y-4">
                           <p className="patient-tunnel-section-label text-cherry/60">{copy.fields.intervention}</p>
                           <div className="flex flex-wrap gap-3">
                              {interventionOptions.map(opt => (
                                <SelectButton
                                  key={opt}
                                  selected={form.interventionRealisee === opt}
                                  onClick={() => setForm(c => ({ ...c, interventionRealisee: opt }))}
                                  label={opt}
                                />
                              ))}
                           </div>
                        </motion.div>
                        <motion.div variants={staggerItem} className="space-y-4">
                           <p className="patient-tunnel-section-label text-cherry/60">{copy.fields.typeIntervention}</p>
                           <div className="grid gap-3 sm:grid-cols-2">
                              {typeOptions.map(opt => (
                                <SelectButton
                                  key={opt}
                                  selected={form.typesIntervention.includes(opt)}
                                  onClick={() => toggleArr('typesIntervention', opt)}
                                  label={opt}
                                  multi
                                />
                              ))}
                           </div>
                        </motion.div>
                      </>
                    )}

                    {step === 2 && (
                      <motion.div variants={staggerContainer} className="space-y-6">
                         <motion.p variants={staggerItem} className="text-lg font-light italic text-cherry/80 md:text-xl">{copy.fields.aide}</motion.p>
                         <motion.div variants={staggerItem} className="grid gap-4 sm:grid-cols-2">
                            {aideOptions.map(opt => (
                              <SelectButton
                                key={opt}
                                selected={form.aideAujourdhui.includes(opt)}
                                onClick={() => toggleArr('aideAujourdhui', opt)}
                                label={opt}
                                multi
                                large
                              />
                            ))}
                         </motion.div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div variants={staggerContainer} className="grid gap-x-6 gap-y-8 pb-48 sm:grid-cols-2">
                        <motion.div variants={staggerItem}>
                          <ModernInput
                            label={copy.fields.prenom}
                            value={form.prenom}
                            onChange={(v) => setForm(c => ({ ...c, prenom: v }))}
                          />
                        </motion.div>
                        <motion.div variants={staggerItem} style={{ position: 'relative', zIndex: 5 }}>
                          <ModernInput
                            label={copy.fields.nom}
                            value={form.nom}
                            onChange={(v) => setForm(c => ({ ...c, nom: v }))}
                          />
                        </motion.div>
                        <motion.div variants={staggerItem} style={{ position: 'relative', zIndex: 4 }}>
                          <ModernInput
                            label={copy.fields.email}
                            type="email"
                            value={form.email}
                            onChange={(v) => setForm(c => ({ ...c, email: v }))}
                          />
                        </motion.div>
                        <motion.div variants={staggerItem} className="min-w-0" style={{ position: 'relative', zIndex: 20 }}>
                          <label className="block space-y-2">
                            <span className="text-[0.6rem] font-bold tracking-[0.2em] text-cherry/50 uppercase ml-1">
                              {copy.fields.telephone}
                            </span>
                            <div
                              ref={phoneWrapRef}
                              className="patient-tunnel-phone-wrap"
                              onKeyDownCapture={handlePhoneWrapKeyDownCapture}
                            >
                              <PhoneInput
                                key={lang}
                                ref={phoneInputRef}
                                defaultCountry={lang === 'fr' ? 'fr' : lang === 'en' ? 'gb' : 'es'}
                                value={form.telephone}
                                onChange={(phone, meta) => {
                                  phoneCountryRef.current = {
                                    iso2: meta.country.iso2,
                                    dialCode: meta.country.dialCode,
                                  };
                                  setPhoneDialCode(meta.country.dialCode);
                                  setForm((c) => ({
                                    ...c,
                                    telephone: phone,
                                    telephoneIso2: meta.country.iso2,
                                  }));
                                }}
                                preferredCountries={phonePreferredCountries}
                                inputClassName={`!font-medium !text-cherry placeholder:text-cherry/30 ${
                                  showPhoneError ? '!border-red-500' : ''
                                }`}
                                countrySelectorStyleProps={{
                                  buttonClassName:
                                    '!border-cherry/10 !bg-white/40 hover:!bg-white/60',
                                }}
                              />
                            </div>
                            {showPhoneError && (
                              <span className="mt-1 mb-3 block text-xs font-medium leading-relaxed text-red-500 ml-1">
                                {lang === 'fr' ? 'Numéro invalide pour le pays sélectionné' : lang === 'en' ? 'Invalid number for the selected country' : 'Número inválido para el país seleccionado'}
                              </span>
                            )}
                          </label>
                        </motion.div>
                        <motion.div variants={staggerItem} style={{ position: 'relative', zIndex: 3 }}>
                          <ModernInput
                            label={copy.fields.ville}
                            value={form.ville}
                            onChange={(v) => setForm(c => ({ ...c, ville: v }))}
                          />
                        </motion.div>
                        <motion.div variants={staggerItem} style={{ position: 'relative', zIndex: 2 }}>
                          <ModernInput
                            label={copy.fields.dateIntervention}
                            type="date"
                            value={form.dateIntervention}
                            onChange={(v) => setForm(c => ({ ...c, dateIntervention: v }))}
                          />
                        </motion.div>
                        <motion.div variants={staggerItem} className="sm:col-span-2" style={{ position: 'relative', zIndex: 1 }}>
                          <SearchableCountryField
                            label={copy.fields.pays}
                            value={form.pays}
                            onChange={(label, iso2) =>
                              setForm((c) => ({ ...c, pays: label, paysIso2: iso2 }))
                            }
                            lang={lang}
                          />
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col gap-4 border-t border-cherry/10 px-6 py-8 md:px-10 sm:flex-row sm:justify-between">
                   <button
                     type="button"
                     onClick={() => step > 1 ? setStep(s => s - 1) : onClose()}
                     className="group flex items-center justify-center gap-2 text-sm font-semibold tracking-widest text-cherry/40 transition-colors hover:text-cherry"
                   >
                     {step > 1 ? <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> : null}
                     {step > 1 ? (lang === 'fr' ? 'RETOUR' : lang === 'en' ? 'BACK' : 'ATRÁS') : (lang === 'fr' ? 'ANNULER' : lang === 'en' ? 'CANCEL' : 'CANCELAR')}
                   </button>
                   <PatientPrimaryButton 
                    type="submit" 
                    disabled={!canGoNext}
                    className="!w-full sm:!w-auto !px-12 !py-4 transition-all !rounded-full shadow-xl shadow-cherry/20"
                   >
                     {step === 3 ? copy.submit : (lang === 'fr' ? 'CONTINUER' : lang === 'en' ? 'CONTINUE' : 'CONTINUAR')}
                     {step < 3 && <ChevronRight className="h-4 w-4 ml-2" />}
                   </PatientPrimaryButton>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function stripDiacritics(s: string) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function useFixedDropdownPosition(
  anchorRef: RefObject<HTMLDivElement | null>,
  open: boolean
) {
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const update = useCallback(() => {
    const el = anchorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ top: r.bottom + 4, left: r.left, width: r.width });
  }, [anchorRef]);
  useEffect(() => {
    if (!open) return;
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, update]);
  return pos;
}

function buildCountryOptions(lang: 'fr' | 'en' | 'es') {
  const regionNames = new Intl.DisplayNames([lang === 'fr' ? 'fr' : lang === 'en' ? 'en' : 'es'], { type: 'region' });
  return defaultCountries
    .map((row) => {
      const c = parseCountry(row);
      let label: string;
      try {
        label = regionNames.of(c.iso2.toUpperCase()) ?? c.name;
      } catch {
        label = c.name;
      }
      return { iso2: c.iso2, label };
    })
    .sort((a, b) =>
      a.label.localeCompare(b.label, lang === 'fr' ? 'fr' : lang === 'en' ? 'en' : 'es', { sensitivity: 'base' })
    );
}

function SearchableCountryField({
  label,
  value,
  onChange,
  lang,
}: {
  label: string;
  value: string;
  onChange: (label: string, iso2: string) => void;
  lang: 'fr' | 'en' | 'es';
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const anchorRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const options = useMemo(() => buildCountryOptions(lang), [lang]);
  const filtered = useMemo(() => {
    const q = stripDiacritics(query.trim().toLowerCase());
    if (!q) return options;
    return options.filter((o) =>
      stripDiacritics(o.label.toLowerCase()).includes(q)
    );
  }, [options, query]);
  const pos = useFixedDropdownPosition(anchorRef, open);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    const t = window.setTimeout(() => searchInputRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const placeholder = lang === 'fr' ? 'Sélectionnez un pays' : lang === 'en' ? 'Select a country' : 'Selecciona un país';
  const searchPlaceholder =
    lang === 'fr' ? 'Rechercher un pays…' : lang === 'en' ? 'Search country…' : 'Buscar país…';

  return (
    <label className="block space-y-2">
      <span className="text-[0.6rem] font-bold tracking-[0.2em] text-cherry/50 uppercase ml-1">
        {label}
      </span>
      <div ref={anchorRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-3 rounded-2xl border border-cherry/10 bg-white/40 px-5 py-3.5 text-left text-base font-medium text-cherry outline-none transition-all focus:border-cherry focus:bg-white/80 focus:shadow-inner"
        >
          <span className={value ? 'text-cherry' : 'text-cherry/30'}>
            {value || placeholder}
          </span>
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-cherry/40 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>
        {open &&
          createPortal(
            <>
              <button
                type="button"
                aria-label={lang === 'fr' ? 'Fermer' : lang === 'en' ? 'Close' : 'Cerrar'}
                className="fixed inset-0 z-[1098] cursor-default bg-transparent"
                onClick={() => setOpen(false)}
              />
              <div
                role="listbox"
                className="fixed z-[1099] flex max-h-[min(280px,45vh)] flex-col overflow-hidden rounded-2xl border border-cherry/10 bg-white/95 shadow-xl backdrop-blur-md"
                style={{
                  top: pos.top,
                  left: pos.left,
                  width: pos.width,
                }}
              >
                <div className="border-b border-cherry/10 p-2">
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full rounded-xl border border-cherry/10 bg-white/80 px-3 py-2 text-sm text-cherry outline-none placeholder:text-cherry/35 focus:border-cherry/25"
                  />
                </div>
                <ul className="overflow-y-auto p-1">
                  {filtered.map((opt) => (
                    <li key={opt.iso2}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={value === opt.label}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-cherry hover:bg-cherry/5"
                        onClick={() => {
                          onChange(opt.label, opt.iso2);
                          setOpen(false);
                        }}
                      >
                        <FlagImage iso2={opt.iso2} size={20} />
                        <span className="min-w-0 flex-1 truncate">{opt.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                {filtered.length === 0 && (
                  <p className="px-3 py-4 text-center text-sm text-cherry/45">
                    {lang === 'fr' ? 'Aucun pays trouvé.' : lang === 'en' ? 'No country found.' : 'Ningún país encontrado.'}
                  </p>
                )}
              </div>
            </>,
            document.body
          )}
      </div>
    </label>
  );
}

function SelectButton({ label, selected, onClick, multi = false, large = false }: { label: string, selected: boolean, onClick: () => void, multi?: boolean, large?: boolean, key?: any }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      onClick={onClick}
      className={`relative overflow-hidden flex items-center justify-between gap-4 rounded-2xl border px-5 transition-all duration-300 ${large ? 'py-5' : 'py-4'} ${
        selected 
          ? 'border-cherry bg-cherry text-snow shadow-lg shadow-cherry/20' 
          : 'border-cherry/10 bg-white/40 text-cherry hover:border-cherry/30 hover:bg-white/60'
      } ${large ? 'w-full' : 'flex-1 min-w-[140px]'}`}
    >
      <span className="text-sm font-medium tracking-tight md:text-base">{label}</span>
      {multi && (
        <div className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
          selected ? 'border-snow bg-snow text-cherry' : 'border-cherry/20 bg-transparent'
        }`}>
          {selected && <CheckCircle2 className="h-4 w-4" />}
        </div>
      )}
      <motion.div 
        initial={false}
        animate={{ scale: selected ? 1 : 0 }}
        className="absolute -right-4 -top-4 h-12 w-12 rounded-full bg-white/10"
      />
    </motion.button>
  );
}

function ModernInput({ label, value, onChange, type = 'text', className = '' }: { label: string, value: string, onChange: (v: string) => void, type?: string, className?: string }) {
  return (
    <label className={`block space-y-2 ${className}`}>
      <span className="text-[0.6rem] font-bold tracking-[0.2em] text-cherry/50 uppercase ml-1">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-cherry/10 bg-white/40 px-5 py-3.5 text-base font-medium text-cherry outline-none transition-all placeholder:text-cherry/30 focus:border-cherry focus:bg-white/80 focus:shadow-inner"
      />
    </label>
  );
}
