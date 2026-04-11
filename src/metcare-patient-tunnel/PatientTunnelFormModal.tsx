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
  ville: '',
  dateIntervention: '',
  pays: '',
  interventionRealisee: '',
  typesIntervention: [],
  aideAujourdhui: [],
};

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

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setForm(initialForm);
      setSubmitted(false);
      return;
    }

    // Meta Pixel: Track AssessmentStarted when modal opens
    trackCustom('AssessmentStarted', {
      name: lang === 'fr' ? 'Patient Tunnel Form 1 (FR)' : 'Patient Tunnel Form 1 (EN)',
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
    { title: lang === 'fr' ? 'Vos besoins' : 'Your needs', fields: ['aideAujourdhui'] },
    { title: lang === 'fr' ? 'Vos coordonnées' : 'Your contact info', fields: ['nom', 'prenom', 'email', 'telephone', 'ville', 'dateIntervention', 'pays'] },
  ];

  const canGoNext = useMemo(() => {
    if (step === 1) return form.interventionRealisee && form.typesIntervention.length > 0;
    if (step === 2) return form.aideAujourdhui.length > 0;
    if (step === 3) return form.nom.trim() && form.prenom.trim() && /\S+@\S+\.\S+/.test(form.email) && form.telephone.trim() && form.ville.trim() && form.dateIntervention.trim() && form.pays.trim();
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
        : 'Patient Tunnel – Form 1 (EN)'
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
                   <span className="text-[0.6rem] font-bold tracking-[0.2em] text-cherry/40 uppercase">{lang === 'fr' ? 'ÉTAPE' : 'STEP'} {step}/3</span>
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
              <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto px-6 py-8 md:px-10 no-scrollbar">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    exit={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="flex-1 space-y-8"
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
                      <motion.div variants={staggerContainer} className="grid gap-6 sm:grid-cols-2">
                        <motion.div variants={staggerItem}>
                          <ModernInput
                            label={copy.fields.prenom}
                            value={form.prenom}
                            onChange={(v) => setForm(c => ({ ...c, prenom: v }))}
                          />
                        </motion.div>
                        <motion.div variants={staggerItem}>
                          <ModernInput
                            label={copy.fields.nom}
                            value={form.nom}
                            onChange={(v) => setForm(c => ({ ...c, nom: v }))}
                          />
                        </motion.div>
                        <motion.div variants={staggerItem}>
                          <ModernInput
                            label={copy.fields.email}
                            type="email"
                            value={form.email}
                            onChange={(v) => setForm(c => ({ ...c, email: v }))}
                          />
                        </motion.div>
                        <motion.div variants={staggerItem}>
                          <ModernInput
                            label={copy.fields.telephone}
                            type="tel"
                            value={form.telephone}
                            onChange={(v) => setForm(c => ({ ...c, telephone: v }))}
                          />
                        </motion.div>
                        <motion.div variants={staggerItem}>
                          <ModernInput
                            label={copy.fields.ville}
                            value={form.ville}
                            onChange={(v) => setForm(c => ({ ...c, ville: v }))}
                          />
                        </motion.div>
                        <motion.div variants={staggerItem}>
                          <ModernInput
                            label={copy.fields.dateIntervention}
                            type="date"
                            value={form.dateIntervention}
                            onChange={(v) => setForm(c => ({ ...c, dateIntervention: v }))}
                          />
                        </motion.div>
                        <motion.div variants={staggerItem} className="sm:col-span-2">
                          <ModernInput
                            label={copy.fields.pays}
                            value={form.pays}
                            onChange={(v) => setForm(c => ({ ...c, pays: v }))}
                          />
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Footer Actions */}
                <div className="mt-10 flex flex-col gap-4 border-t border-cherry/10 pt-8 sm:flex-row sm:justify-between">
                   <button
                     type="button"
                     onClick={() => step > 1 ? setStep(s => s - 1) : onClose()}
                     className="group flex items-center justify-center gap-2 text-sm font-semibold tracking-widest text-cherry/40 transition-colors hover:text-cherry"
                   >
                     {step > 1 ? <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> : null}
                     {step > 1 ? (lang === 'fr' ? 'RETOUR' : 'BACK') : (lang === 'fr' ? 'ANNULER' : 'CANCEL')}
                   </button>
                   <PatientPrimaryButton 
                    type="submit" 
                    disabled={!canGoNext}
                    className="!w-full sm:!w-auto !px-12 !py-4 transition-all !rounded-full shadow-xl shadow-cherry/20"
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
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
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
