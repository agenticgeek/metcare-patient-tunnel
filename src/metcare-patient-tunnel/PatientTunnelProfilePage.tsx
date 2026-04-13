import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, CheckCircle2, Sparkles } from 'lucide-react';
import metcareLogo from '../../assets/Sigle_Fond_BeigeS_HD.svg';
import {
  patientCopy,
  getPatientForm2AccompagnementOptions,
  getPatientForm2AideMaintenantOptions,
  getPatientForm2QuandOptions,
  getPatientForm2SentimentOptions,
  getPatientForm2SiPasEncoreOptions,
  getPatientForm2TechnologieOptions,
  type PatientForm1Data,
  type PatientForm2Data,
} from './copy';
import { submitPatientForm2ToWebhook } from './patientForm2Webhook';
import './patientTunnel.css';
import { PATIENT_TUNNEL_ROUTES } from './routes';
import { PATIENT_TUNNEL_STORAGE_KEYS } from './storageKeys';
import { PatientPrimaryButton, PatientTunnelDecor } from './PatientTunnelShared';
import { useLanguage } from './i18n';
import LanguageSwitcher from './LanguageSwitcher';
import { trackCustom, trackViewContent } from '../utils/metaPixel';

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

const staggerStep = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { staggerChildren: 0.1 } 
  },
  exit: { 
    opacity: 0, 
    x: -30,
    transition: { duration: 0.3 }
  }
};

const itemReveal = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5 } }
};

function MouseSpotlight() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <motion.div 
      className="glow-spotlight hidden lg:block"
      animate={{ 
        x: mousePos.x - 300, 
        y: mousePos.y - 300 
      }}
      transition={{ type: 'spring', damping: 30, stiffness: 150, mass: 0.5 }}
    />
  );
}

export default function PatientTunnelProfilePage() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const form1 = useMemo(() => readForm1(), []);
  /** Form 1 stores the label in the language active at submit; compare both locales so switching language here does not show the wrong question. */
  const projetSeulement =
    form1?.interventionRealisee === "Non, c'est en projet" ||
    form1?.interventionRealisee === "No, it's a project";

  const copy = patientCopy[lang].form2;
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<PatientForm2Data>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone] = useState(false);

  // Meta Pixel: Track ViewContent on page load
  useMemo(() => {
    trackViewContent(
      lang === 'fr'
        ? 'Patient Tunnel – Profile (FR)'
        : 'Patient Tunnel – Profile (EN)'
    );
  }, [lang]);

  const canGoNext = useMemo(() => {
    if (step === 1) return projetSeulement ? form.siPasEncore : form.quandIntervention;
    if (step === 2) return form.technologieConnue && (form.technologieConnue !== (lang === 'fr' ? 'Oui' : 'Yes') || form.technologieDetail.trim());
    if (step === 3) return form.commentVousSentez.length > 0 && form.aideMaintenant.length > 0 && form.accompagnementSouhaite;
    return false;
  }, [step, form, projetSeulement, lang]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(s => s + 1);
      return;
    }
    setSubmitted(true);
    if (!canGoNext) return;
    sessionStorage.setItem(PATIENT_TUNNEL_STORAGE_KEYS.form2, JSON.stringify(form));
    const form1AtSubmit = readForm1();
    submitPatientForm2ToWebhook(form, {
      emailFromForm1: form1AtSubmit?.email?.trim() ?? '',
      interventionRealiseeFromForm1: form1AtSubmit?.interventionRealisee ?? '',
    });
    // Meta Pixel: Track custom event on form completion
    trackCustom('AssessmentStep', {
      step: 2,
      total: 2,
      funnel: 'patient_tunnel',
    });
    setDone(true);
  };

  const toggleArr = (field: 'commentVousSentez' | 'aideMaintenant', value: string) => {
    setForm((c) => {
      const set = new Set(c[field]);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      return { ...c, [field]: [...set] };
    });
  };

  if (done) {
    return (
      <div className="patient-tunnel-root flex min-h-screen items-center justify-center p-6 text-center overflow-hidden">
        <PatientTunnelDecor />
        <LanguageSwitcher />
        <MouseSpotlight />
        
        <div className="absolute inset-0 pointer-events-none">
           {[...Array(12)].map((_, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, scale: 0 }}
               animate={{ 
                 opacity: [0, 0.2, 0], 
                 scale: [0, 1, 0],
                 x: (Math.random() - 0.5) * 500,
                 y: (Math.random() - 0.5) * 500
               }}
               transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
               className="absolute left-1/2 top-1/2 h-4 w-4 rounded-full bg-cherry/20 blur-sm"
             />
           ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="patient-tunnel-glass max-w-xl rounded-[3rem] p-12 shadow-2xl relative z-10"
        >
          <motion.div 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 150 }}
            className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-cherry text-snow shadow-xl shadow-cherry/20"
          >
             <CheckCircle2 className="h-12 w-12" />
          </motion.div>
          <h1 className="mb-6 font-heading text-3xl font-semibold text-cherry md:text-5xl">{lang === 'fr' ? 'Profil complété.' : 'Profile completed.'}</h1>
          <p className="mb-10 text-lg font-light italic leading-relaxed text-cherry/70 md:text-xl">
             {copy.thankYou}
          </p>
          <PatientPrimaryButton onClick={() => navigate(PATIENT_TUNNEL_ROUTES.home)} className="!px-12 !py-5 !text-lg !rounded-full">
             {copy.bookCta}
          </PatientPrimaryButton>
        </motion.div>
      </div>
    );
  }

  const quandOptions = getPatientForm2QuandOptions(lang);
  const siPasEncoreOptions = getPatientForm2SiPasEncoreOptions(lang);
  const technologieOptions = getPatientForm2TechnologieOptions(lang);
  const sentimentOptions = getPatientForm2SentimentOptions(lang);
  const aideMaintenantOptions = getPatientForm2AideMaintenantOptions(lang);
  const accompagnementOptions = getPatientForm2AccompagnementOptions(lang);

  return (
    <div className="patient-tunnel-root min-h-screen px-5 py-12 pb-24 md:px-10 md:py-20 overflow-x-hidden">
      <PatientTunnelDecor />
      <LanguageSwitcher />
      <MouseSpotlight />
      
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed left-5 top-5 z-40 flex items-center gap-3 rounded-full border border-white/20 bg-white/40 px-3 py-2 shadow-xl backdrop-blur-xl md:left-10 md:top-10"
      >
        <Link to={PATIENT_TUNNEL_ROUTES.home} className="flex items-center gap-3">
          <img src={metcareLogo} alt="Logo" className="h-10 w-10 rounded-full object-cover" width={40} height={40} />
          <span className="pr-2 text-[0.65rem] font-bold tracking-[0.25em] text-cherry uppercase">METCARE®</span>
        </Link>
      </motion.div>

      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
           <div className="mb-6 flex justify-center gap-2">
              {[1, 2, 3].map(s => (
                <motion.div 
                  key={s} 
                  initial={false}
                  animate={{ 
                    width: s === step ? 48 : 12,
                    backgroundColor: s <= step ? 'rgba(43, 21, 23, 1)' : 'rgba(43, 21, 23, 0.1)'
                  }}
                  className="h-1.5 rounded-full transition-all duration-700" 
                />
              ))}
           </div>
           <motion.div
             key={step}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="mb-4 inline-flex items-center gap-2 rounded-full border border-cherry/10 bg-cherry/5 px-4 py-1.5"
           >
             <span className="flex h-4 w-4 items-center justify-center rounded-full bg-cherry text-[0.5rem] font-bold text-snow">
               {step}
             </span>
             <span className="text-[0.55rem] font-bold tracking-[0.2em] text-cherry/40 uppercase">
               /3
             </span>
             <span className="h-3 w-px bg-cherry/20" />
             <span className="text-[0.55rem] font-bold tracking-[0.18em] text-cherry/60 uppercase">
               {lang === 'fr' ? 'CONCIERGERIE ESTHÉTIQUE INTERNATIONALE' : 'INTERNATIONAL AESTHETIC CONCIERGE'}
             </span>
           </motion.div>
           <h1 className="mt-4 font-heading text-3xl font-semibold text-cherry md:text-5xl">{copy.title}</h1>
           <p className="mt-4 text-sm font-light leading-relaxed text-cherry/70 md:text-base">{copy.intro}</p>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={staggerStep}
              initial="hidden"
              animate="show"
              exit="exit"
              className="patient-tunnel-glass space-y-12 rounded-[2.5rem] border border-white/20 p-8 shadow-2xl shadow-cherry/10 md:p-12"
            >
              {step === 1 && (
                 <div className="space-y-8 text-center">
                    <motion.h2 variants={itemReveal} className="text-xl font-medium text-cherry/80 md:text-2xl">
                       {projetSeulement ? copy.fields.siPasEncore : copy.fields.quand}
                    </motion.h2>
                    <motion.div variants={itemReveal} className="grid gap-4 sm:grid-cols-2">
                       {(projetSeulement ? siPasEncoreOptions : quandOptions).map(opt => (
                         <ProfileSelectCard
                            key={opt}
                            label={opt}
                            selected={(projetSeulement ? form.siPasEncore : form.quandIntervention) === opt}
                            onClick={() => setForm(c => ({ 
                               ...c, 
                               [projetSeulement ? 'siPasEncore' : 'quandIntervention']: opt 
                            }))}
                         />
                       ))}
                    </motion.div>
                 </div>
              )}

              {step === 2 && (
                 <div className="space-y-10 text-center">
                    <motion.h2 variants={itemReveal} className="text-xl font-medium text-cherry/80 md:text-2xl">
                       {copy.fields.technologie}
                    </motion.h2>
                    <motion.div variants={itemReveal} className="flex flex-wrap justify-center gap-4">
                       {technologieOptions.map(opt => (
                         <ProfileSelectCard
                            key={opt}
                            label={opt}
                            className="min-w-[120px]"
                            selected={form.technologieConnue === opt}
                            onClick={() => setForm(c => ({ ...c, technologieConnue: opt }))}
                         />
                       ))}
                    </motion.div>
                    
                    {form.technologieConnue === (lang === 'fr' ? 'Oui' : 'Yes') && (
                       <motion.div 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="mx-auto max-w-md space-y-4"
                       >
                          <label className="text-[0.65rem] font-bold tracking-[0.25em] text-cherry/50 uppercase">
                            {copy.fields.technologieDetail}
                          </label>
                          <input
                             type="text"
                             value={form.technologieDetail}
                             onChange={(e) => setForm(c => ({ ...c, technologieDetail: e.target.value }))}
                             placeholder={lang === 'fr' ? "Ex: J-Plasma, VASER, Renuvion..." : "Ex: J-Plasma, VASER, Renuvion..."}
                             className="w-full rounded-2xl border border-cherry/10 bg-white/40 px-6 py-4 text-center text-lg font-medium text-cherry outline-none focus:border-cherry focus:bg-white/80 focus:shadow-xl transition-all"
                          />
                       </motion.div>
                    )}
                 </div>
              )}

              {step === 3 && (
                 <div className="space-y-12">
                    <div className="space-y-6">
                       <motion.h2 variants={itemReveal} className="text-center text-xl font-medium text-cherry/80 md:text-2xl">
                          {copy.fields.sentiment}
                       </motion.h2>
                       <motion.div variants={itemReveal} className="grid gap-3 sm:grid-cols-2">
                          {sentimentOptions.map(opt => (
                            <ProfileSelectCard
                               key={opt}
                               label={opt}
                               small
                               selected={form.commentVousSentez.includes(opt)}
                               onClick={() => toggleArr('commentVousSentez', opt)}
                            />
                          ))}
                       </motion.div>
                    </div>

                    <div className="space-y-6">
                       <motion.h2 variants={itemReveal} className="text-center text-xl font-medium text-cherry/80 md:text-2xl">
                          {copy.fields.aideMaintenant}
                       </motion.h2>
                       <motion.div variants={itemReveal} className="grid gap-3 sm:grid-cols-2">
                          {aideMaintenantOptions.map(opt => (
                            <ProfileSelectCard
                               key={opt}
                               label={opt}
                               small
                               selected={form.aideMaintenant.includes(opt)}
                               onClick={() => toggleArr('aideMaintenant', opt)}
                            />
                          ))}
                       </motion.div>
                    </div>

                    <div className="space-y-6">
                       <motion.h2 variants={itemReveal} className="text-center text-xl font-medium text-cherry/80 md:text-2xl">
                          {copy.fields.accompagnement}
                       </motion.h2>
                       <motion.div variants={itemReveal} className="flex flex-wrap justify-center gap-4">
                          {accompagnementOptions.map(opt => (
                            <ProfileSelectCard
                               key={opt}
                               label={opt}
                               selected={form.accompagnementSouhaite === opt}
                               onClick={() => setForm(c => ({ ...c, accompagnementSouhaite: opt }))}
                            />
                          ))}
                       </motion.div>
                    </div>
                 </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
             <button
               type="button"
               onClick={() => step > 1 ? setStep(s => s - 1) : navigate(PATIENT_TUNNEL_ROUTES.home)}
               className="group flex items-center gap-3 text-sm font-bold tracking-[0.25em] text-cherry/40 transition-colors hover:text-cherry"
             >
               <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
               {step > 1 ? (lang === 'fr' ? 'PRÉCÉDENT' : 'PREVIOUS') : (lang === 'fr' ? 'RETOUR' : 'BACK')}
             </button>
             
             <div className="flex flex-col gap-4 sm:flex-row">
               <button 
                 type="button"
                 onClick={() => navigate(PATIENT_TUNNEL_ROUTES.home)}
                 className="px-6 py-2 text-[0.6rem] font-bold tracking-[0.25em] text-cherry/30 uppercase transition-colors hover:text-cherry/60"
               >
                 {lang === 'fr' ? 'Passer cette étape' : 'Skip this step'}
               </button>
               <PatientPrimaryButton 
                 type="submit" 
                 disabled={!canGoNext}
                 className="!px-16 !py-5 !text-lg shadow-2xl transition-all"
               >
                 {step === 3 ? copy.submit : (lang === 'fr' ? 'ÉTAPE SUIVANTE' : 'NEXT STEP')}
                 {step < 3 && <ChevronRight className="h-5 w-5 ml-2" />}
                 {step === 3 && <Sparkles className="h-5 w-5 ml-2" />}
               </PatientPrimaryButton>
             </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProfileSelectCard({ label, selected, onClick, small = false, className = '' }: { label: string, selected: boolean, onClick: () => void, small?: boolean, className?: string, key?: any }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border transition-all duration-500 ${small ? 'px-4 py-3' : 'px-8 py-5'} ${
        selected 
          ? 'border-cherry bg-cherry text-snow shadow-xl' 
          : 'border-cherry/10 bg-white/40 text-cherry hover:border-cherry/30 hover:bg-white/60'
      } ${className}`}
    >
      <div className={`absolute -right-4 -top-4 h-12 w-12 rounded-full transition-transform duration-700 ${
        selected ? 'bg-white/10 scale-150' : 'bg-cherry/5 scale-0'
      }`} />
      <span className={`relative z-10 font-medium ${small ? 'text-sm' : 'text-base md:text-lg'}`}>{label}</span>
    </button>
  );
}
