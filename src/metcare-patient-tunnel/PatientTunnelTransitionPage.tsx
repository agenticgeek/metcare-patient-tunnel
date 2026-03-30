import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import metcareLogo from '../../assets/Sigle_Fond_BeigeS_HD.svg';
import { patientCopy } from './copy';
import './patientTunnel.css';
import { PATIENT_TUNNEL_ROUTES } from './routes';
import { PATIENT_TUNNEL_STORAGE_KEYS } from './storageKeys';
import { PatientPrimaryButton, PatientTunnelDecor } from './PatientTunnelShared';

export default function PatientTunnelTransitionPage() {
  const navigate = useNavigate();
  const c = patientCopy.transition;
  const hasForm1 =
    typeof window !== 'undefined' && sessionStorage.getItem(PATIENT_TUNNEL_STORAGE_KEYS.form1);

  return (
    <div className="patient-tunnel-root flex min-h-screen items-center justify-center px-5 py-16 md:px-10">
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="patient-tunnel-glass relative z-10 w-full max-w-xl rounded-2xl border border-cherry/10 p-6 text-center shadow-lg md:p-10"
      >
        <img src={metcareLogo} alt="" className="mx-auto mb-5 h-16 w-16 object-cover" width={64} height={64} />
        <h1 className="mb-4 text-2xl font-semibold leading-tight text-cherry md:text-4xl">{c.title}</h1>
        <p className="mb-5 text-sm font-light leading-relaxed text-cherry/82 md:text-base">{c.body}</p>
        <div className="mb-5 rounded-xl border border-cherry/10 bg-snow/85 p-4 text-left text-sm font-light leading-relaxed text-cherry/88 md:text-base">
          {c.prompt}
        </div>
        <p className="mb-8 text-xs uppercase tracking-[0.16em] text-cherry/55">{c.notice}</p>
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
          <PatientPrimaryButton onClick={() => navigate(PATIENT_TUNNEL_ROUTES.profile)} className="sm:!w-auto">
            <span>{c.cta}</span>
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </PatientPrimaryButton>
          <PatientPrimaryButton
            variant="outline"
            onClick={() => navigate(PATIENT_TUNNEL_ROUTES.home)}
            className="sm:!w-auto"
          >
            {c.skip}
          </PatientPrimaryButton>
        </div>
        {!hasForm1 && (
          <p className="mt-6 text-sm font-light text-cherry/55">{patientCopy.ui.noSession}</p>
        )}
      </motion.div>
    </div>
  );
}
