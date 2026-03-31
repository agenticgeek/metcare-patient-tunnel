import { AnimatePresence, motion } from 'motion/react';
import { X, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  patientCopy,
  getPatientForm1AideOptions,
  getPatientForm1InterventionOptions,
  getPatientForm1TypeOptions,
  type PatientForm1Data,
} from './copy';
import { submitPatientForm1ToWebhook } from './patientForm1Webhook';
import { PatientPrimaryButton } from './PatientTunnelShared';
import { useLanguage } from './i18n';

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
  const { lang } = useLanguage();
  const copy = patientCopy[lang].form1;
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<PatientForm1Data>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setForm(initialForm);
      setSubmitted(false);
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const steps = [
    { title: lang === 'fr' ? 'Votre situation' : 'Your situation', fields: ['interventionRealisee', 'typesIntervention'] },
    { title: lang === 'fr' ? 'Vos besoins' : 'Your needs', fields: ['aideAujourdhui'] },
    { title: lang === 'fr' ? 'Vos coordonnées' : 'Your contact info', fields: ['nom', 'prenom', 'email', 'telephone', 'pays'] },
  ];

  const canGoNext = useMemo(() => {
    if (step === 1) return form.interventionRealisee && form.typesIntervention.length > 0;
    if (step === 2) return form.aideAujourdhui.length > 0;
    if (step === 3) return form.nom.trim() && form.prenom.trim() && /\S+@\S+\.\S+/.test(form.email) && form.telephone.trim() && form.pays.trim();
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
            initial={{ opacity: 0, scale: 0.95, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            className="fixed inset-0 z-[1001] flex items-center justify-center p-4 sm:p-6"
          >
            <div className="patient-tunnel-glass relative flex h-full max-h-[750px] w-full max-w-2xl flex-col overflow-hidden rounded-[2.5rem] border border-white/20 shadow-2xl shadow-cherry/30">
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
                        <div 
                          key={s} 
                          className={`h-1 w-8 rounded-full transition-all duration-500 ${s <= step ? 'bg-cherry' : 'bg-cherry/10'}`} 
                        />
                      ))}
                   </div>
                   <span className="text-[0.6rem] font-bold tracking-[0.2em] text-cherry/40 uppercase">{lang === 'fr' ? 'ÉTAPE' : 'STEP'} {step}/3</span>
                </div>
                <h2 className="text-2xl font-semibold text-cherry md:text-3xl">{steps[step - 1].title}</h2>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto px-6 py-8 md:px-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="flex-1 space-y-8"
                  >
                    {step === 1 && (
                      <>
                        <div className="space-y-4">
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
                        </div>
                        <div className="space-y-4">
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
                        </div>
                      </>
                    )}

                    {step === 2 && (
                      <div className="space-y-6">
                         <p className="text-lg font-light italic text-cherry/80 md:text-xl">{copy.fields.aide}</p>
                         <div className="grid gap-4 sm:grid-cols-2">
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
                         </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="grid gap-6 sm:grid-cols-2">
                        <ModernInput
                          label={copy.fields.prenom}
                          value={form.prenom}
                          onChange={(v) => setForm(c => ({ ...c, prenom: v }))}
                        />
                        <ModernInput
                          label={copy.fields.nom}
                          value={form.nom}
                          onChange={(v) => setForm(c => ({ ...c, nom: v }))}
                        />
                        <ModernInput
                          label={copy.fields.email}
                          type="email"
                          value={form.email}
                          onChange={(v) => setForm(c => ({ ...c, email: v }))}
                        />
                        <ModernInput
                          label={copy.fields.telephone}
                          type="tel"
                          value={form.telephone}
                          onChange={(v) => setForm(c => ({ ...c, telephone: v }))}
                        />
                        <ModernInput
                          label={copy.fields.pays}
                          value={form.pays}
                          className="sm:col-span-2"
                          onChange={(v) => setForm(c => ({ ...c, pays: v }))}
                        />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Footer Actions */}
                <div className="mt-10 flex flex-col gap-4 border-t border-cherry/10 pt-8 sm:flex-row sm:justify-between">
                   <button
                     type="button"
                     onClick={() => step > 1 ? setStep(s => s - 1) : onClose()}
                     className="flex items-center justify-center gap-2 text-sm font-semibold tracking-widest text-cherry/40 transition-colors hover:text-cherry"
                   >
                     {step > 1 ? <ChevronLeft className="h-4 w-4" /> : null}
                     {step > 1 ? (lang === 'fr' ? 'RETOUR' : 'BACK') : (lang === 'fr' ? 'ANNULER' : 'CANCEL')}
                   </button>
                   <PatientPrimaryButton 
                    type="submit" 
                    disabled={!canGoNext}
                    className="!w-full sm:!w-auto !px-12 !py-4 transition-all"
                   >
                     {step === 3 ? copy.submit : (lang === 'fr' ? 'CONTINUER' : 'CONTINUE')}
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

function SelectButton({ label, selected, onClick, multi = false, large = false }: { label: string, selected: boolean, onClick: () => void, multi?: boolean, large?: boolean, key?: any }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center justify-between gap-4 rounded-2xl border px-5 transition-all duration-300 ${large ? 'py-5' : 'py-4'} ${
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
    </button>
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
