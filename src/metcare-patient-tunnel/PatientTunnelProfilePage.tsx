import { motion } from 'motion/react';
import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import metcareLogo from '../../assets/Sigle_Fond_BeigeS_HD.svg';
import {
  patientCopy,
  patientForm2AccompagnementOptions,
  patientForm2AideMaintenantOptions,
  patientForm2QuandOptions,
  patientForm2SentimentOptions,
  patientForm2SiPasEncoreOptions,
  patientForm2TechnologieOptions,
  type PatientForm1Data,
  type PatientForm2Data,
} from './copy';
import { submitPatientForm2ToWebhook } from './patientForm2Webhook';
import './patientTunnel.css';
import { PATIENT_TUNNEL_ROUTES } from './routes';
import { PATIENT_TUNNEL_STORAGE_KEYS } from './storageKeys';
import { PatientPrimaryButton, PatientTunnelDecor } from './PatientTunnelShared';

const initialForm: PatientForm2Data = {
  quandIntervention: '',
  siPasEncore: '',
  technologieConnue: '',
  technologieDetail: '',
  commentVousSentez: [],
  aideMaintenant: [],
  accompagnementSouhaite: '',
};

function readForm1(): PatientForm1Data | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(PATIENT_TUNNEL_STORAGE_KEYS.form1);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PatientForm1Data;
  } catch {
    return null;
  }
}

export default function PatientTunnelProfilePage() {
  const navigate = useNavigate();
  const form1 = useMemo(() => readForm1(), []);
  const projetSeulement = form1?.interventionRealisee === "Non, c'est en projet";

  const copy = patientCopy.form2;
  const [form, setForm] = useState<PatientForm2Data>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone] = useState(false);

  const isValid = useMemo(() => {
    const timingOk = projetSeulement
      ? Boolean(form.siPasEncore)
      : Boolean(form.quandIntervention);
    const techOk =
      form.technologieConnue !== 'Oui' ||
      (form.technologieConnue === 'Oui' && form.technologieDetail.trim().length > 0);
    return Boolean(
      timingOk &&
        form.technologieConnue &&
        techOk &&
        form.commentVousSentez.length > 0 &&
        form.aideMaintenant.length > 0 &&
        form.accompagnementSouhaite
    );
  }, [form, projetSeulement]);

  const toggleArr = (field: 'commentVousSentez' | 'aideMaintenant', value: string) => {
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
    sessionStorage.setItem(PATIENT_TUNNEL_STORAGE_KEYS.form2, JSON.stringify(form));
    submitPatientForm2ToWebhook(form);
    setDone(true);
  };

  return (
    <div className="patient-tunnel-root px-5 py-16 pb-24 md:px-10 md:py-20">
      <PatientTunnelDecor />
      <Link
        to={PATIENT_TUNNEL_ROUTES.home}
        className="fixed left-3 top-3 z-40 flex items-center gap-2 rounded-full border border-cherry/12 bg-snow/90 px-2 py-1.5 shadow-sm backdrop-blur md:left-5 md:top-5"
        aria-label={patientCopy.transition.backHome}
      >
        <img src={metcareLogo} alt="" className="h-9 w-9 rounded-full object-cover" width={36} height={36} />
        <span className="hidden pr-2 text-xs font-semibold tracking-[0.14em] text-cherry sm:inline">
          METCARE®
        </span>
      </Link>

      <div className="relative z-10 mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="patient-tunnel-glass rounded-2xl border border-cherry/10 p-6 shadow-lg md:p-10"
        >
          <h1 className="mb-3 text-2xl font-semibold text-cherry md:text-4xl">{copy.title}</h1>
          <p className="mb-8 text-sm font-light leading-relaxed text-cherry/80 md:text-base">
            {copy.intro}
          </p>

          {!done ? (
            <form onSubmit={handleSubmit} className="space-y-7">
              {!projetSeulement && (
                <RadioBlock
                  name="quand-intervention"
                  label={copy.fields.quand}
                  options={[...patientForm2QuandOptions]}
                  value={form.quandIntervention}
                  onChange={(v) => setForm((c) => ({ ...c, quandIntervention: v }))}
                  invalid={submitted && !form.quandIntervention}
                />
              )}

              {projetSeulement && (
                <RadioBlock
                  name="si-pas-encore"
                  label={copy.fields.siPasEncore}
                  options={[...patientForm2SiPasEncoreOptions]}
                  value={form.siPasEncore}
                  onChange={(v) => setForm((c) => ({ ...c, siPasEncore: v }))}
                  invalid={submitted && !form.siPasEncore}
                />
              )}

              <RadioBlock
                name="technologie"
                label={copy.fields.technologie}
                options={[...patientForm2TechnologieOptions]}
                value={form.technologieConnue}
                onChange={(v) => setForm((c) => ({ ...c, technologieConnue: v }))}
                invalid={submitted && !form.technologieConnue}
              />

              {form.technologieConnue === 'Oui' && (
                <label className="block">
                  <span className="patient-tunnel-section-label mb-1.5 block text-[0.65rem] tracking-[0.18em]">
                    {copy.fields.technologieDetail}
                  </span>
                  <input
                    type="text"
                    value={form.technologieDetail}
                    onChange={(e) => setForm((c) => ({ ...c, technologieDetail: e.target.value }))}
                    placeholder="J-Plasma, Renuvion, VASER, Quantum RF…"
                    className={`w-full rounded-xl border bg-beige/50 px-3 py-2.5 text-sm text-cherry outline-none focus:border-cherry focus:bg-snow/90 md:text-base ${
                      submitted && !form.technologieDetail.trim() ? 'border-red-400' : 'border-cherry/10'
                    }`}
                  />
                </label>
              )}

              <CheckboxBlock
                label={copy.fields.sentiment}
                options={[...patientForm2SentimentOptions]}
                values={form.commentVousSentez}
                onToggle={(v) => toggleArr('commentVousSentez', v)}
                invalid={submitted && form.commentVousSentez.length === 0}
              />

              <CheckboxBlock
                label={copy.fields.aideMaintenant}
                options={[...patientForm2AideMaintenantOptions]}
                values={form.aideMaintenant}
                onToggle={(v) => toggleArr('aideMaintenant', v)}
                invalid={submitted && form.aideMaintenant.length === 0}
              />

              <RadioBlock
                name="accompagnement"
                label={copy.fields.accompagnement}
                options={[...patientForm2AccompagnementOptions]}
                value={form.accompagnementSouhaite}
                onChange={(v) => setForm((c) => ({ ...c, accompagnementSouhaite: v }))}
                invalid={submitted && !form.accompagnementSouhaite}
              />

              <div className="flex flex-col gap-3 border-t border-cherry/10 pt-6 sm:flex-row sm:flex-wrap sm:justify-between">
                <PatientPrimaryButton
                  type="button"
                  variant="outline"
                  onClick={() => navigate(PATIENT_TUNNEL_ROUTES.home)}
                  className="sm:!w-auto"
                >
                  {patientCopy.transition.skip}
                </PatientPrimaryButton>
                <PatientPrimaryButton type="submit" className="sm:!w-auto">
                  {copy.submit}
                </PatientPrimaryButton>
              </div>
            </form>
          ) : (
            <div className="rounded-xl border border-cherry/10 bg-snow/80 p-6 text-center">
              <p className="mb-6 text-base font-light leading-relaxed text-cherry/88">{copy.thankYou}</p>
              <PatientPrimaryButton onClick={() => navigate(PATIENT_TUNNEL_ROUTES.home)}>
                {patientCopy.transition.backHome}
              </PatientPrimaryButton>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function RadioBlock({
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
      <legend className="patient-tunnel-section-label mb-2 text-[0.65rem] tracking-[0.18em]">
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

function CheckboxBlock({
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
      <legend className="patient-tunnel-section-label mb-2 text-[0.65rem] tracking-[0.18em]">
        {label}
      </legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((opt) => {
          const checked = values.includes(opt);
          return (
            <label
              key={opt}
              className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm ${
                checked
                  ? 'border-cherry bg-cherry text-snow'
                  : invalid
                    ? 'border-red-300 bg-snow/90 text-cherry'
                    : 'border-cherry/10 bg-snow/90 text-cherry/88'
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
