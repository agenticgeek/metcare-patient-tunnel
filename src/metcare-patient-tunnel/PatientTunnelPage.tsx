import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import metcareLogo from '../../assets/Sigle_Fond_BeigeS_HD.svg';
import { patientCopy, type PatientForm1Data } from './copy';
import PatientTunnelFormModal from './PatientTunnelFormModal';
import './patientTunnel.css';
import { PATIENT_TUNNEL_ROUTES } from './routes';
import { PATIENT_TUNNEL_STORAGE_KEYS } from './storageKeys';
import { PatientPrimaryButton, PatientSection, PatientTunnelDecor } from './PatientTunnelShared';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

export default function PatientTunnelPage() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [activeCta, setActiveCta] = useState<string>();

  useEffect(() => {
    document.title = patientCopy.meta.title;
  }, []);

  const openForm = (cta: string) => {
    setActiveCta(cta);
    setShowForm(true);
  };

  const handleForm1 = (data: PatientForm1Data) => {
    sessionStorage.setItem(PATIENT_TUNNEL_STORAGE_KEYS.form1, JSON.stringify(data));
    navigate(PATIENT_TUNNEL_ROUTES.transition);
  };

  const c = patientCopy;

  return (
    <div className="patient-tunnel-root">
      <PatientTunnelDecor />

      <PatientTunnelFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleForm1}
        sourceCta={activeCta}
      />

      <Link
        to={PATIENT_TUNNEL_ROUTES.home}
        className="fixed left-3 top-3 z-40 flex items-center gap-2 rounded-full border border-cherry/12 bg-snow/90 px-2 py-1.5 shadow-sm backdrop-blur md:left-5 md:top-5"
        aria-label="METCARE"
      >
        <img src={metcareLogo} alt="" className="h-9 w-9 rounded-full object-cover" width={36} height={36} />
        <span className="hidden pr-2 text-xs font-semibold tracking-[0.14em] text-cherry sm:inline">
          METCARE®
        </span>
      </Link>

      {/* Section 1 — HERO: sticky CTA on small screens keeps primary CTA in view */}
      <section className="patient-tunnel-hero-bg flex min-h-[100dvh] flex-col md:min-h-0">
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-4 pt-20 md:block md:overflow-visible md:px-10 md:pb-16 md:pt-24">
          <motion.div
            className="mx-auto flex w-full max-w-3xl flex-1 flex-col md:flex-none"
            initial="hidden"
            animate="show"
            variants={stagger}
          >
            <motion.h1
              variants={fadeUp}
              className="mb-4 text-balance text-2xl font-semibold leading-tight tracking-tight text-cherry sm:text-3xl md:mb-6 md:text-4xl lg:text-5xl"
            >
              {c.hero.headline}
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mb-6 flex-1 text-sm font-light leading-relaxed text-cherry/88 md:mb-10 md:flex-none md:text-lg"
            >
              {c.hero.body}
            </motion.p>
            <motion.div variants={fadeUp} className="hidden md:block">
              <PatientPrimaryButton onClick={() => openForm(c.hero.ctaEchange)}>
                {c.hero.ctaEchange}
              </PatientPrimaryButton>
            </motion.div>
          </motion.div>
        </div>
        <div className="patient-tunnel-sticky-cta shrink-0 border-t border-cherry/10 bg-snow/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-snow/88 md:hidden">
          <PatientPrimaryButton className="w-full" onClick={() => openForm(c.hero.ctaEchange)}>
            {c.hero.ctaEchange}
          </PatientPrimaryButton>
        </div>
      </section>

      <PatientSection label={c.sections.repere.label} tone="beige">
        <p className="text-base font-light leading-relaxed text-cherry/88 md:text-lg">
          {c.sections.repere.body}
        </p>
        <div className="mt-8">
          <PatientPrimaryButton onClick={() => openForm(c.hero.ctaGuide)}>
            {c.hero.ctaGuide}
          </PatientPrimaryButton>
        </div>
      </PatientSection>

      <PatientSection label={c.sections.normal.label}>
        <p className="text-base font-light leading-relaxed text-cherry/88 md:text-lg">
          {c.sections.normal.body}
        </p>
      </PatientSection>

      <PatientSection label={c.sections.safety.label} tone="beige">
        <p className="text-base font-light leading-relaxed text-cherry/88 md:text-lg">
          {c.sections.safety.body}
        </p>
      </PatientSection>

      <PatientSection label={c.sections.expertise.label}>
        <p className="text-base font-light leading-relaxed text-cherry/88 md:text-lg">
          {c.sections.expertise.body}
        </p>
      </PatientSection>

      <PatientSection label={c.sections.conciergerie.label} tone="beige">
        <p className="mb-8 text-base font-light leading-relaxed text-cherry/88 md:text-lg">
          {c.sections.conciergerie.body}
        </p>
        <PatientPrimaryButton onClick={() => openForm(c.sections.conciergerie.cta)}>
          {c.sections.conciergerie.cta}
        </PatientPrimaryButton>
      </PatientSection>

      <PatientSection label={c.sections.echange.label}>
        <p className="mb-8 text-base font-light leading-relaxed text-cherry/88 md:text-lg">
          {c.sections.echange.body}
        </p>
        <PatientPrimaryButton onClick={() => openForm(c.sections.echange.cta)}>
          {c.sections.echange.cta}
        </PatientPrimaryButton>
      </PatientSection>

      <PatientSection label={c.sections.parcours.label} tone="beige">
        <p className="mb-6 text-lg font-light text-cherry md:text-xl">{c.sections.parcours.intro}</p>
        <ol className="mb-6 space-y-4">
          {c.sections.parcours.steps.map((step, i) => (
            <li key={step} className="flex gap-3 text-base font-light leading-relaxed text-cherry/88">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cherry/10 text-sm font-semibold text-cherry">
                {i + 1}
              </span>
              <span className="pt-1">{step}</span>
            </li>
          ))}
        </ol>
        <p className="text-base font-medium text-cherry">{c.sections.parcours.outro}</p>
      </PatientSection>

      <PatientSection label={c.sections.solutions.label}>
        <p className="text-base font-light leading-relaxed text-cherry/88 md:text-lg">
          {c.sections.solutions.body}
        </p>
      </PatientSection>

      <PatientSection label={c.sections.opportunite.label} tone="beige">
        <p className="text-base font-light leading-relaxed text-cherry/88 md:text-lg">
          {c.sections.opportunite.body}
        </p>
      </PatientSection>

      <PatientSection label={c.sections.bonEndroit.label}>
        <p className="text-base font-light leading-relaxed text-cherry/88 md:text-lg">
          {c.sections.bonEndroit.body}
        </p>
      </PatientSection>

      <PatientSection
        id="patient-tunnel-form-anchor"
        tone="cherry"
        className="rounded-t-3xl"
        aria-label="Parlons de votre situation"
      >
        <p className="mb-8 text-base font-light leading-relaxed text-snow/90 md:text-lg">
          {c.sections.final.body}
        </p>
        <PatientPrimaryButton
          variant="outline"
          className="!border-snow !text-snow hover:!bg-snow/10"
          onClick={() => openForm(c.sections.final.cta)}
        >
          {c.sections.final.cta}
        </PatientPrimaryButton>
      </PatientSection>

      <footer className="border-t border-cherry/10 bg-snow px-5 py-10 text-center md:px-10">
        <p className="patient-tunnel-section-label text-cherry/50">METCARE®</p>
      </footer>
    </div>
  );
}
