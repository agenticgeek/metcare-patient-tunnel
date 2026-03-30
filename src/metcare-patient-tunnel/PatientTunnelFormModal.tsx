import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  patientCopy,
  patientForm1AideOptions,
  patientForm1InterventionOptions,
  patientForm1TypeOptions,
  type PatientForm1Data,
} from './copy';
import { submitPatientForm1ToWebhook } from './patientForm1Webhook';
import { PatientPrimaryButton } from './PatientTunnelShared';

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
  pays: '',
  ville: '',
  codePostal: '',
  interventionRealisee: '',
  typesIntervention: [],
  aideAujourdhui: [],
};

export default function PatientTunnelFormModal({ isOpen, onClose, onSubmit, sourceCta }: Props) {
  const copy = patientCopy.form1;
  const [form, setForm] = useState<PatientForm1Data>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setForm(initialForm);
      setSubmitted(false);
    }
  }, [isOpen]);

  const isValid = useMemo(() => {
    return Boolean(
      form.nom.trim() &&
        form.prenom.trim() &&
        /\S+@\S+\.\S+/.test(form.email) &&
        form.telephone.trim() &&
        form.pays.trim() &&
        form.interventionRealisee &&
        form.typesIntervention.length > 0 &&
        form.aideAujourdhui.length > 0
    );
  }, [form]);

  const toggleArr = (field: 'typesIntervention' | 'aideAujourdhui', value: string) => {
    setForm((c) => {
      const set = new Set(c[field]);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      return { ...c, [field]: [...set] };
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid) return;
    submitPatientForm1ToWebhook(form, { sourceCta });
    onSubmit(form);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-cherry/45 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 16 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-3 sm:p-4"
          >
            <div
              className="patient-tunnel-glass relative max-h-[min(92dvh,900px)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-cherry/10"
              onClick={(ev) => ev.stopPropagation()}
            >
              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-cherry/8 text-cherry/60 hover:bg-cherry/12"
                aria-label="Fermer le formulaire"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="border-b border-cherry/10 px-5 py-7 pr-14 md:px-8">
                <h2 className="mb-3 text-xl font-semibold text-cherry md:text-3xl">{copy.title}</h2>
                <p className="text-sm font-light leading-relaxed text-cherry/80 md:text-base">
                  {copy.intro}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 px-5 py-6 md:space-y-7 md:px-8 md:py-8">
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField
                    label={copy.fields.nom}
                    value={form.nom}
                    onChange={(v) => setForm((c) => ({ ...c, nom: v }))}
                    invalid={submitted && !form.nom.trim()}
                  />
                  <InputField
                    label={copy.fields.prenom}
                    value={form.prenom}
                    onChange={(v) => setForm((c) => ({ ...c, prenom: v }))}
                    invalid={submitted && !form.prenom.trim()}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField
                    label={copy.fields.email}
                    type="email"
                    value={form.email}
                    onChange={(v) => setForm((c) => ({ ...c, email: v }))}
                    invalid={submitted && !/\S+@\S+\.\S+/.test(form.email)}
                  />
                  <InputField
                    label={copy.fields.telephone}
                    type="tel"
                    value={form.telephone}
                    onChange={(v) => setForm((c) => ({ ...c, telephone: v }))}
                    invalid={submitted && !form.telephone.trim()}
                  />
                </div>
                <InputField
                  label={copy.fields.pays}
                  value={form.pays}
                  onChange={(v) => setForm((c) => ({ ...c, pays: v }))}
                  invalid={submitted && !form.pays.trim()}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField
                    label={copy.fields.ville}
                    value={form.ville}
                    onChange={(v) => setForm((c) => ({ ...c, ville: v }))}
                    invalid={false}
                  />
                  <InputField
                    label={copy.fields.codePostal}
                    value={form.codePostal}
                    onChange={(v) => setForm((c) => ({ ...c, codePostal: v }))}
                    invalid={false}
                  />
                </div>

                <RadioGroup
                  name="intervention-realisee"
                  label={copy.fields.intervention}
                  options={[...patientForm1InterventionOptions]}
                  value={form.interventionRealisee}
                  onChange={(v) => setForm((c) => ({ ...c, interventionRealisee: v }))}
                  invalid={submitted && !form.interventionRealisee}
                />

                <CheckboxGroup
                  label={copy.fields.typeIntervention}
                  options={[...patientForm1TypeOptions]}
                  values={form.typesIntervention}
                  onToggle={(v) => toggleArr('typesIntervention', v)}
                  invalid={submitted && form.typesIntervention.length === 0}
                />

                <CheckboxGroup
                  label={copy.fields.aide}
                  options={[...patientForm1AideOptions]}
                  values={form.aideAujourdhui}
                  onToggle={(v) => toggleArr('aideAujourdhui', v)}
                  invalid={submitted && form.aideAujourdhui.length === 0}
                />

                <div className="border-t border-cherry/10 pt-5">
                  <PatientPrimaryButton type="submit" className="w-full sm:w-full">
                    {copy.submit}
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

function InputField({
  label,
  value,
  onChange,
  invalid,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  invalid: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="patient-tunnel-section-label mb-1.5 block text-[0.65rem] tracking-[0.18em]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border bg-beige/50 px-3 py-2.5 text-sm text-cherry outline-none placeholder:text-cherry/35 focus:border-cherry focus:bg-snow/90 md:text-base ${
          invalid ? 'border-red-400' : 'border-cherry/10'
        }`}
      />
    </label>
  );
}

function CheckboxGroup({
  label,
  options,
  values,
  onToggle,
  invalid,
}: {
  label: string;
  options: readonly string[];
  values: string[];
  onToggle: (v: string) => void;
  invalid: boolean;
}) {
  return (
    <fieldset>
      <legend className="patient-tunnel-section-label mb-2 block text-[0.65rem] tracking-[0.18em]">
        {label}
      </legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((opt) => {
          const checked = values.includes(opt);
          return (
            <label
              key={opt}
              className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                checked
                  ? 'border-cherry bg-cherry text-snow'
                  : invalid
                    ? 'border-red-300 bg-snow/90 text-cherry'
                    : 'border-cherry/10 bg-snow/90 text-cherry/90'
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(opt)}
                className="h-4 w-4 accent-cherry"
              />
              <span>{opt}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function RadioGroup({
  name,
  label,
  options,
  value,
  onChange,
  invalid,
}: {
  name: string;
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  invalid: boolean;
}) {
  return (
    <fieldset>
      <legend className="patient-tunnel-section-label mb-2 block text-[0.65rem] tracking-[0.18em]">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const checked = value === opt;
          return (
            <label
              key={opt}
              className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm ${
                checked
                  ? 'border-cherry bg-cherry text-snow'
                  : invalid
                    ? 'border-red-300 bg-snow/90 text-cherry'
                    : 'border-cherry/12 bg-snow/90 text-cherry/88'
              }`}
            >
              <input
                type="radio"
                name={name}
                checked={checked}
                onChange={() => onChange(opt)}
                className="h-4 w-4 accent-cherry"
              />
              <span>{opt}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
