import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ChevronLeft } from 'lucide-react';
import { patientCopy } from './copy';
import './patientTunnel.css';
import { PATIENT_TUNNEL_ROUTES } from './routes';
import { PatientPrimaryButton, PatientTunnelDecor } from './PatientTunnelShared';
import { useLanguage } from './i18n';
import LanguageSwitcher from './LanguageSwitcher';

export default function PatientTunnelTransitionPage() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const c = patientCopy[lang].transition;

  return (
    <div className="patient-tunnel-root flex min-h-screen flex-col items-center justify-center px-5 py-24 md:px-10">
      <PatientTunnelDecor />
      <LanguageSwitcher />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="patient-tunnel-glass max-w-2xl rounded-[3rem] border border-white/20 p-10 text-center shadow-[0_32px_128px_-16px_rgba(43,21,23,0.15)] md:p-16"
      >
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
          className="mx-auto mb-10 flex h-20 w-20 items-center justify-center rounded-full bg-cherry text-snow shadow-xl shadow-cherry/30"
        >
          <CheckCircle2 className="h-10 w-10" />
        </motion.div>

        <h1 className="mb-6 font-heading text-3xl font-semibold leading-tight text-cherry md:text-5xl">
          {c.title}
        </h1>
        
        <p className="mx-auto mb-10 max-w-md text-lg font-light italic leading-relaxed text-cherry/70 md:text-xl">
          {c.body}
        </p>

        <div className="mb-12 h-[1px] w-24 bg-cherry/10 mx-auto" />

        <div className="space-y-8">
           <p className="text-sm font-light leading-relaxed text-cherry/80 md:text-base">
             {c.prompt}
           </p>
           
           <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <PatientPrimaryButton 
                onClick={() => navigate(PATIENT_TUNNEL_ROUTES.profile)} 
                className="!px-12 !py-5 !text-lg shadow-2xl shadow-cherry/20"
              >
                {c.cta}
                <ArrowRight className="h-5 w-5 ml-2" />
              </PatientPrimaryButton>
              
              <button
                onClick={() => navigate(PATIENT_TUNNEL_ROUTES.home)}
                className="group flex items-center justify-center gap-2 px-8 py-5 text-sm font-bold tracking-[0.2em] text-cherry/40 transition-colors hover:text-cherry"
              >
                {c.skip}
                <motion.span 
                  animate={{ x: [0, 4, 0] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  →
                </motion.span>
              </button>
           </div>
           
           <p className="text-[0.65rem] font-medium tracking-[0.2em] text-cherry/30 uppercase italic">
             {c.notice}
           </p>
        </div>
      </motion.div>
      
      <button
        onClick={() => navigate(PATIENT_TUNNEL_ROUTES.home)}
        className="mt-12 group flex items-center gap-3 text-sm font-bold tracking-[0.25em] text-cherry/40 transition-colors hover:text-cherry"
      >
        <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
        {c.backHome}
      </button>
    </div>
  );
}
