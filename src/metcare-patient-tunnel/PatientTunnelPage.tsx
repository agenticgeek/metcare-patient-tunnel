import { motion, useScroll, useTransform } from 'motion/react';
import { useEffect, useState, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import metcareLogo from '../../assets/Sigle_Fond_BeigeS_HD.svg';
import heroImage from '../../assets/image1.jpg';
import repereSectionImage from '../../assets/image2.JPG';
import expertiseSectionImage from '../../assets/image3.png';
import bonEndroitSectionImage from '../../assets/image4.jpg';
import solutionCardImage1 from '../../assets/1.jpg';
import solutionCardImage2 from '../../assets/2.jpg';
import solutionCardImage3 from '../../assets/3.jpg';
import safetyPatientLogo from '../../assets/Safety patient Blanc .png';
import { patientCopy, type PatientForm1Data } from './copy';
import PatientTunnelFormModal from './PatientTunnelFormModal';
import './patientTunnel.css';
import { PATIENT_TUNNEL_ROUTES } from './routes';
import { PATIENT_TUNNEL_STORAGE_KEYS } from './storageKeys';
import {
  PatientPrimaryButton,
  PatientSection,
  PatientTunnelDecor,
} from './PatientTunnelShared';
import { useLanguage } from './i18n';
import LanguageSwitcher from './LanguageSwitcher';
import { trackViewContent, trackCustom } from '../utils/metaPixel';

const fadeUp = {
  hidden: { opacity: 0, y: 60, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
};

/**
 * Intelligent component to split text by slashes into stylized tags
 */
function TextWithTags({ text, className = "", tagClassName = "" }: { text: string; className?: string; tagClassName?: string }) {
  if (!text.includes('/')) return <p className={className}>{text}</p>;

  const hasIntro = text.includes(':');
  let intro = "";
  let listPart = text;

  if (hasIntro) {
    const splitIndex = text.indexOf(':');
    intro = text.substring(0, splitIndex + 1);
    listPart = text.substring(splitIndex + 1);
  }

  const tags = listPart.split('/').map(t => t.trim()).filter(Boolean);

  return (
    <div className={className}>
      {intro && <p className="mb-4">{intro}</p>}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className={`inline-block px-3 py-1.5 rounded-lg bg-cherry/5 border border-cherry/10 text-[0.65rem] font-bold tracking-wider text-cherry/80 uppercase ${tagClassName}`}
          >
            {tag}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

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

const HERO_HIGHLIGHT_PHRASES: Record<string, string[]> = {
  fr: ['Changer.', 'Se transformer.', 'Se retrouver.'],
  en: ['To change.', 'To transform.', 'To find themselves.'],
};

function HeroBodyText({ body, ctaLabel, onCtaClick }: { body: string; ctaLabel?: string; onCtaClick?: () => void }) {
  const langKey = Object.keys(HERO_HIGHLIGHT_PHRASES).find(k =>
    HERO_HIGHLIGHT_PHRASES[k].every(p => body.includes(p))
  );
  if (!langKey) return <>{body}</>;

  const phrases = HERO_HIGHLIGHT_PHRASES[langKey];
  const fullPhrase = phrases.join(' ');
  const [before, after] = body.split(fullPhrase);

  return (
    <>
      {ctaLabel && onCtaClick && (
        <motion.div variants={fadeUp} className="mb-6 flex flex-col items-start">
          <PatientPrimaryButton onClick={onCtaClick} className="px-8! py-4! text-base! rounded-full! shadow-xl shadow-cherry/25 group overflow-hidden">
            <span className="relative z-10">{ctaLabel}</span>
          </PatientPrimaryButton>
        </motion.div>
      )}
      <ul className="my-3 space-y-1.5">
        {phrases.map(phrase => (
          <li key={phrase} className="flex items-center gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cherry">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span>{phrase}</span>
          </li>
        ))}
      </ul>
      {after.trim().split('\n')[0] && (
        <p className="mb-6 leading-relaxed font-semibold text-cherry">{after.trim().split('\n')[0]}</p>
      )}
      <ul className="my-6 space-y-2.5">
        {after.trim().split('\n').slice(1).map((line, i) => {
          const lines = after.trim().split('\n');
          const isLastLine = i === lines.slice(1).length - 1;
          if (isLastLine) {
            return <p key={i} className="mb-4 leading-relaxed font-semibold text-cherry">{line}</p>;
          }
          return (
            <li key={i} className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cherry/20 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cherry"></span>
              </span>
              <span className="leading-relaxed">{line}</span>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default function PatientTunnelPage() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [activeCta, setActiveCta] = useState<string>();

  const { scrollYProgress } = useScroll();
  const parcoursX = useTransform(scrollYProgress, [0.4, 0.8], [100, -100]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const c = patientCopy[lang];

  useEffect(() => {
    document.title = c.meta.title;
    trackViewContent(lang === 'fr' ? 'Landing – Patient Tunnel (FR)' : 'Landing – Patient Tunnel (EN)');
  }, [c.meta.title, lang]);

  const openForm = (cta: string) => {
    trackCustom('CTAClick', { cta, page: 'patient_tunnel_landing' });
    setActiveCta(cta);
    setShowForm(true);
  };

  const handleForm1 = (data: PatientForm1Data) => {
    sessionStorage.setItem(PATIENT_TUNNEL_STORAGE_KEYS.form1, JSON.stringify(data));
    navigate(PATIENT_TUNNEL_ROUTES.transition);
  };

  return (
    <div className="patient-tunnel-root selection:bg-cherry/10 selection:text-cherry overflow-x-hidden">
      <PatientTunnelDecor />
      {/* Desktop / tablet: separate language switcher in top-right */}
      <LanguageSwitcher />
      <MouseSpotlight />

      <PatientTunnelFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleForm1}
        sourceCta={activeCta}
      />

      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed left-4 top-4 z-[100] w-fit rounded-2xl border border-white/20 bg-white/60 px-2.5 py-2 shadow-xl backdrop-blur-2xl md:left-12 md:top-12 md:rounded-full md:px-4 md:py-2.5"
      >
        <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:gap-3">
          <Link
            to={PATIENT_TUNNEL_ROUTES.home}
            className="group flex items-center gap-2"
          >
            <img
              src={metcareLogo}
              alt="METCARE"
              className="h-7 w-7 scale-95 rounded-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-360 md:h-11 md:w-11"
              width={44}
              height={44}
            />
            <div className="flex flex-col border-l border-cherry/10 pl-2 md:pl-4">
              <span className="hidden text-[0.5rem] font-bold tracking-[0.4em] text-cherry/40 uppercase md:block">
                {lang === 'fr' ? 'ÉTABLI EN 2009' : 'ESTABLISHED 2009'}
              </span>
              <span className="text-[0.7rem] font-bold tracking-[0.2em] text-cherry md:text-[0.85rem]">
                METCARE®
              </span>
            </div>
          </Link>
          <a
            href="https://masterclass.metcare.fr/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-cherry/20 bg-white/50 px-3 py-1 text-[0.55rem] font-bold tracking-[0.12em] text-cherry uppercase shadow-sm transition-all hover:bg-cherry hover:text-snow hover:border-cherry text-center"
          >
            Metcare MasterClass
          </a>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="patient-tunnel-hero-aurora relative flex flex-col items-center justify-center px-6 pt-28 pb-16 md:min-h-screen md:px-12 md:pt-40 md:pb-0 lg:px-24">
        <motion.div
          className="relative z-10 w-full max-w-[1400px]"
          initial="hidden"
          animate="show"
          variants={stagger}
        >
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left Column: Content */}
            <div className="order-1 text-left lg:order-first">
              <motion.div variants={fadeUp} className="mb-8 flex justify-start">
                <span className="rounded-full border border-cherry/5 bg-cherry/5 px-6 py-2 text-[0.65rem] font-bold tracking-[0.35em] text-cherry/60 uppercase">
                  {c.meta.title}
                </span>
              </motion.div>

              <motion.div variants={fadeUp} className="relative">
                <h1 className="relative mb-8 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-cherry sm:text-6xl md:mb-10 md:text-7xl lg:text-[5rem]">
                  {c.hero.headline}
                </h1>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mb-10 max-w-xl text-base font-light leading-relaxed text-cherry/70 text-justify whitespace-pre-line md:mb-14 md:text-lg lg:text-xl"
              >
                <HeroBodyText body={c.hero.body} ctaLabel={c.hero.ctaExpert} onCtaClick={() => openForm(c.hero.ctaExpert)} />
              </motion.div>

              {/* Image for Mobile (only visible on small/medium screens, hidden on lg) */}
              <motion.div
                variants={fadeUp}
                className="relative mb-12 block lg:hidden"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] border border-white/20 bg-cherry/5 shadow-xl shadow-cherry/10">
                  <img
                    src={heroImage}
                    alt=""
                    className="h-full w-full object-cover object-[center_20%] scale-105"
                    loading="eager"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-cherry/10 to-transparent pointer-events-none" />
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-col items-start gap-8 sm:flex-row sm:items-center">
                <PatientPrimaryButton onClick={() => openForm(c.hero.ctaGuide)} className="px-12! py-5! text-lg! rounded-full! shadow-2xl shadow-cherry/25 group overflow-hidden">
                  <span className="relative z-10">{c.hero.ctaGuide}</span>
                </PatientPrimaryButton>
              </motion.div>
            </div>

            {/* Right Column: Image (Desktop) / Hidden on Mobile */}
            <motion.div
              variants={fadeUp}
              className="relative hidden lg:block"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[3rem] border border-white/20 bg-cherry/5 shadow-2xl shadow-cherry/15 md:rounded-[4rem]">
                <img
                  src={heroImage}
                  alt={lang === 'fr' ? 'Accompagnement METCARE après intervention' : 'METCARE post-surgery support'}
                  className="h-full w-full object-cover object-[center_20%] scale-105"
                  width={5464}
                  height={6271}
                  loading="eager"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-linear-to-t from-cherry/10 to-transparent pointer-events-none" />
              </div>

              {/* Decorative elements */}
              <div className="absolute -right-6 -top-6 -z-10 h-32 w-32 rounded-full bg-beige/30 blur-3xl" />
              <div className="absolute -left-10 -bottom-10 -z-10 h-48 w-48 rounded-full bg-cherry/5 blur-3xl" />
            </motion.div>
          </div>
        </motion.div>

        <div className="patient-tunnel-aurora" aria-hidden="true">
          <span className="a1"></span>
          <span className="a2"></span>
          <span className="a3"></span>
          <span className="a4"></span>
        </div>
        <div className="patient-tunnel-hero-depth" aria-hidden="true"></div>
      </section>

      {/* Editorial Split-Screen Section */}
      <PatientSection label={c.sections.repere.label} tone="beige" maxWidth="none" className="relative py-14! md:py-32! overflow-hidden">
        <div className="editorial-grid max-w-[1400px] mx-auto">
          <div className="col-span-12 lg:col-span-5 mb-16 lg:mb-0">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
              <span className="mb-6 inline-block text-[0.6rem] font-bold tracking-[0.4em] text-cherry/30 uppercase italic">{lang === 'fr' ? 'REPOS & SÉRÉNITÉ' : 'REST & SERENITY'}</span>
              <h2 className="mb-8 text-4xl font-semibold leading-[1.1] text-cherry md:text-6xl lg:text-[4.5rem]">
                {lang === 'fr' ? 'Votre sérénité' : 'Your serenity'}<br /><span className="italic font-light">{lang === 'fr' ? 'commence' : 'begins'}</span> {lang === 'fr' ? 'ici.' : 'here.'}
              </h2>
              <TextWithTags
                text={c.sections.repere.body}
                className="text-lg font-light leading-relaxed text-cherry/70 md:text-xl lg:max-w-md"
              />
            </motion.div>
          </div>
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-8 md:flex-row md:items-start lg:pl-12">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="patient-tunnel-glass animate-float-subtle perspective-1000 rotate-3d-hover flex-1 rounded-[3rem] p-10 shadow-2xl md:mt-24"
            >
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-cherry text-snow shadow-lg shadow-cherry/20">
                <span className="text-xs font-bold tracking-widest">01</span>
              </div>
              <h3 className="mb-6 font-heading text-2xl font-semibold text-cherry uppercase tracking-tight">{lang === 'fr' ? 'Savoir quoi observer' : 'Know what to observe'}</h3>
              <p className="text-base font-light leading-relaxed text-cherry/70">{lang === 'fr' ? 'Comprendre les signaux de votre corps pour vous repérer avec confiance dans chaque étape de votre évolution.' : 'Understand your body\'s signals to navigate with confidence through every stage of your progress.'}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="patient-tunnel-glass animate-float-delayed perspective-1000 rotate-3d-hover flex-1 rounded-[3rem] p-10 shadow-2xl border-cherry/5 bg-white/60"
            >
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-cherry/10 text-cherry shadow-lg">
                <span className="text-xs font-bold tracking-widest">02</span>
              </div>
              <h3 className="mb-6 font-heading text-2xl font-semibold text-cherry uppercase tracking-tight">{lang === 'fr' ? 'Ne plus rester seule' : 'No longer stay alone'}</h3>
              <div className="space-y-3 text-base font-light leading-relaxed text-cherry/70">
                <p className="text-sm">{c.sections.normal.intro}</p>
                <div className="flex flex-wrap gap-2">
                  {c.sections.normal.tags1.map((tag: string, i: number) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="inline-block px-3 py-1.5 rounded-lg bg-cherry/5 border border-cherry/10 text-[0.65rem] font-bold tracking-wider text-cherry/80 uppercase"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
                <p className="text-sm">{c.sections.normal.bridge}</p>
                <div className="flex flex-wrap gap-2">
                  {c.sections.normal.tags2.map((tag: string, i: number) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="inline-block px-3 py-1.5 rounded-lg bg-cherry/5 border border-cherry/10 text-[0.65rem] font-bold tracking-wider text-cherry/80 uppercase"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
                <p className="text-sm">{c.sections.normal.outro}</p>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-16 w-full max-w-[1400px] md:mt-24"
        >
          <div className="w-full overflow-hidden rounded-[2rem] border border-cherry/10 shadow-2xl shadow-cherry/10 md:rounded-4xl">
            <img
              src={repereSectionImage}
              alt={
                lang === 'fr'
                  ? 'Ambiance repos et sérénité METCARE'
                  : 'METCARE rest and serenity'
              }
              className="block h-auto w-full"
              width={8569}
              height={5713}
              loading="lazy"
              decoding="async"
            />
          </div>
        </motion.div>
      </PatientSection>

      {/* Editorial Mosaic for Expertise */}
      <PatientSection label={c.sections.expertise.label} maxWidth="none" className="py-14! md:py-32!">
        <div className="grid gap-6 md:grid-cols-12 md:grid-rows-6 md:h-[1000px] max-w-[1400px] mx-auto">
          {/* Main Statement Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="md:col-span-8 md:row-span-3 flex flex-col justify-center p-10 lg:p-16 patient-tunnel-glass rounded-[4rem] border-none bg-white/50"
          >
            <h3 className="mb-6 text-4xl font-semibold leading-tight text-cherry md:text-5xl lg:text-6xl">{lang === 'fr' ? 'La sécurité' : 'Safety'}<br />{lang === 'fr' ? 'avant tout.' : 'first.'}</h3>
            <p className="max-w-lg text-base font-light leading-relaxed text-cherry/70 md:text-lg">
              {lang === 'fr'
                ? 'Un cadre structuré, sécurisé et personnalisé pour chaque patiente, où qu\'elle soit. Notre approche combine expertise médicale et soutien émotionnel.'
                : 'A structured, secure, and personalized framework for every patient, wherever they are. Our approach combines medical expertise and emotional support.'}
            </p>
          </motion.div>

          {/* Label Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="md:col-span-4 md:row-span-4 bg-cherry rounded-[3rem] p-10 flex flex-col justify-start group overflow-hidden"
          >
            <div className="space-y-6 relative z-10">
              <span className="text-[0.65rem] font-bold tracking-[0.4em] text-snow/40 uppercase">{lang === 'fr' ? 'LE LABEL PRIVÉ' : 'THE PRIVATE LABEL'}</span>
              <h4 className="text-3xl font-semibold text-snow leading-tight tracking-tight">Safety Patient®</h4>
              <p className="text-sm font-light leading-relaxed text-snow/60">{c.sections.safety.body}</p>
            </div>
            <motion.div
              className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/5"
              whileHover={{ scale: 2 }}
              transition={{ duration: 1 }}
            />
            <div className="mt-auto pt-6 pb-18 relative z-10 flex justify-center items-end">
              <img src={safetyPatientLogo} alt="Safety Patient®" className="h-40 w-auto object-contain" />
            </div>
          </motion.div>

          {/* Stat/Network Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="md:col-span-5 md:row-span-3 patient-tunnel-glass rounded-[3rem] p-10 flex flex-col justify-center border-beige/40 bg-beige/10 overflow-hidden"
          >
            <span className="text-[4rem] font-bold text-cherry/5 absolute top-4 right-8 select-none">17y</span>
            <h4 className="text-2xl font-semibold text-cherry mb-4">{c.sections.conciergerie.label}</h4>
            <p className="text-sm font-light leading-relaxed text-cherry/70">{c.sections.conciergerie.body}</p>
          </motion.div>

          {/* Partner Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="md:col-span-3 md:row-span-3 bg-white/40 rounded-[3rem] p-10 border border-cherry/5 flex flex-col items-center justify-center text-center"
          >
            <motion.span
              className="text-4xl font-bold text-cherry mb-2"
              whileInView={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, delay: 1 }}
            >
              +8000
            </motion.span>
            <span className="text-[0.6rem] font-bold tracking-[0.3em] text-cherry/40 uppercase">{lang === 'fr' ? 'Patients par an' : 'Patients per year'}</span>
          </motion.div>

          {/* Expertise List Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="md:col-span-4 md:row-span-2 patient-tunnel-glass rounded-[3rem] p-10 flex items-center"
          >
            <TextWithTags
              text={c.sections.expertise.body}
              className="text-sm font-light leading-relaxed text-cherry/70 italic"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-12 w-full max-w-[1400px] md:mt-16"
        >
          <div className="w-full overflow-hidden rounded-[2rem] border border-cherry/10 shadow-2xl shadow-cherry/10 md:rounded-4xl">
            <img
              src={expertiseSectionImage}
              alt={
                lang === 'fr'
                  ? 'Réseau et expertise METCARE'
                  : 'METCARE network and expertise'
              }
              className="block h-auto w-full"
              width={2816}
              height={1536}
              loading="lazy"
              decoding="async"
            />
          </div>
        </motion.div>
      </PatientSection>

      <PatientSection label={c.sections.echange.label} tone="beige" maxWidth="none" className="py-14! md:py-24! overflow-hidden">
        <div className="relative mx-auto max-w-6xl">
          {/* Decorative 15min background element */}
          <div className="pointer-events-none absolute -right-12 -top-20 select-none opacity-[0.04]">
            <span className="text-[12rem] font-bold tracking-tighter text-cherry md:text-[18rem]">15min</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="patient-tunnel-glass relative overflow-hidden rounded-[4rem] border-none bg-white/40 p-8 md:p-16"
          >
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <span className="inline-block rounded-full bg-cherry/5 px-4 py-1.5 text-[0.6rem] font-bold tracking-[0.2em] text-cherry/60 uppercase">
                    {lang === 'fr' ? 'Échange Gratuit' : 'Free Exchange'}
                  </span>
                  <h3 className="text-3xl font-semibold leading-tight text-cherry md:text-4xl lg:text-5xl">
                    {c.sections.echange.intro}
                  </h3>
                </div>

                <div className="space-y-4">
                  {c.sections.echange.bullets.map((bullet, i) => (
                    <motion.div
                      key={bullet}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="flex items-center gap-4 text-cherry/80"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cherry text-snow shadow-lg shadow-cherry/10">
                        <span className="text-xs">✓</span>
                      </div>
                      <span className="text-base font-light md:text-lg">{bullet}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="relative space-y-10 lg:pl-12">
                <div className="absolute left-0 top-0 hidden h-full w-px bg-linear-to-b from-cherry/20 via-cherry/5 to-transparent lg:block" />

                <div className="space-y-6">
                  <TextWithTags
                    text={c.sections.echange.followup}
                    className="text-base font-light leading-relaxed text-cherry/70 md:text-xl italic"
                  />
                  <div className="rounded-2xl bg-beige/20 p-6 border border-beige/30">
                    <p className="text-xs font-bold tracking-widest text-cherry/40 uppercase mb-2">
                      {lang === 'fr' ? 'Priorité Patient' : 'Patient Priority'}
                    </p>
                    <p className="text-sm font-medium text-cherry/80">
                      {lang === 'fr' ? 'Un moment d\'écoute privilégié, sans aucune pression commerciale.' : 'A privileged moment of listening, without any commercial pressure.'}
                    </p>
                  </div>
                </div>

                <PatientPrimaryButton
                  onClick={() => openForm(c.sections.echange.cta)}
                  className="w-full! px-12! py-6! text-lg! rounded-full! shadow-2xl shadow-cherry/20 hover:scale-105 transition-transform"
                >
                  {c.sections.echange.cta}
                </PatientPrimaryButton>
              </div>
            </div>
          </motion.div>
        </div>
      </PatientSection>

      {/* Visual Journey */}
      <PatientSection label={c.sections.parcours.label} tone="beige" maxWidth="none" className="relative pt-14! pb-10! md:py-40! overflow-hidden">
        {/* Background Decorative Element with Scroll Parallax */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.015] md:opacity-[0.03]"
          style={{ x: parcoursX }}
        >
          <span className="text-[10rem] md:text-[20rem] font-bold tracking-tighter whitespace-nowrap text-cherry uppercase">{lang === 'fr' ? 'PARCOURS' : 'JOURNEY'}</span>
        </motion.div>

        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="text-center mb-20 md:mb-32">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-6xl font-semibold text-cherry mb-6 md:mb-8 tracking-tight">{c.sections.parcours.intro}</h2>
            </motion.div>
          </div>

          <div className="relative space-y-20 md:space-y-32">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-px bg-linear-to-b from-cherry/20 via-cherry/10 to-transparent hidden md:block" />

            <EditorialStep
              number="01"
              title={lang === 'fr' ? 'Partage de situation' : 'Situation Sharing'}
              side="left"
              body={c.sections.parcours.steps[0]}
            />
            <EditorialStep
              number="02"
              title={lang === 'fr' ? 'Échange personnalisé' : 'Personalized Exchange'}
              side="right"
              body={c.sections.parcours.steps[1]}
            />
            <EditorialStep
              number="03"
              title={lang === 'fr' ? 'Orientation & Solutions' : 'Orientation & Solutions'}
              side="left"
              body={c.sections.parcours.steps[2]}
              isLast
            />
          </div>
        </div>
      </PatientSection>

      {/* Solutions Gallery */}
      <PatientSection maxWidth="none" className="py-32! overflow-hidden">
        <div className="px-4 mb-10 max-w-[1400px] mx-auto">
          <h2 className="text-3xl md:text-6xl font-semibold text-cherry tracking-tight">{c.sections.solutions.label}</h2>
        </div>
        <div className="flex flex-col md:flex-row gap-8 max-w-[1400px] mx-auto overflow-x-auto pb-12 snap-x px-4 no-scrollbar">
          <SolutionCard
            label={c.sections.opportunite.label}
            title={c.sections.opportunite.title}
            body={c.sections.opportunite.body}
            imageSrc={solutionCardImage3}
            imageAlt={lang === 'fr' ? 'Réseau international d\'experts METCARE' : 'METCARE international expert network'}
            accent
            ctaLabel={lang === 'fr' ? 'Prendre contact avec un expert proche de chez moi' : 'Get in touch with an expert near me'}
            onCtaClick={() => openForm('opportunite_card')}
          />
          <SolutionCard
            label={lang === 'fr' ? "Le protocole d'excellence" : "The excellence protocol"}
            title="Signature Recovery Protocol"
            body={lang === 'fr' ? 'Une approche structurée pour optimiser votre rétablissement après chaque type d\'intervention.' : 'A structured approach to optimize your recovery after each type of intervention.'}
            imageSrc={solutionCardImage1}
            imageAlt={lang === 'fr' ? 'Signature Recovery Protocol' : 'Signature Recovery Protocol'}
            href="https://myesthetictravel.com/les-incontournables/#signature-recovery-protocol"
            ctaLabel={lang === 'fr' ? 'Découvrir' : 'Discover'}
          />
          <SolutionCard
            label={lang === 'fr' ? 'ACCOMPAGNEMENT' : 'ACCOMPANIMENT'}
            title={lang === 'fr' ? 'Accompagnement Personnalisé & E-book' : 'Personalized Accompaniment & E-book'}
            body={lang === 'fr' ? 'Un guide complet de 148 pages et une écoute active tout au long de votre parcours de guérison.' : 'A complete 148-page guide and active listening throughout your healing journey.'}
            imageSrc={solutionCardImage2}
            imageAlt={lang === 'fr' ? 'Accompagnement personnalisé et e-book' : 'Personalized accompaniment and e-book'}
            href="https://myesthetictravel.com/les-incontournables/#e-book"
            ctaLabel={lang === 'fr' ? 'Découvrir' : 'Discover'}
          />
        </div>
      </PatientSection>

      <PatientSection label={c.sections.bonEndroit.label} tone="snow" maxWidth="none" className="py-32! md:py-48! relative overflow-hidden bg-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] bg-beige/10 blur-[120px] rounded-full" />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative z-10 mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <h3 className="text-2xl font-light italic leading-relaxed text-cherry/80 md:text-4xl lg:text-5xl">
                « {c.sections.bonEndroit.intro} »
              </h3>
              <div className="h-px w-24 bg-cherry/20 mx-auto" />
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {c.sections.bonEndroit.bullets.map((bullet, i) => (
                <motion.div
                  key={bullet}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="space-y-4"
                >
                  <span className="text-[0.65rem] font-bold tracking-[0.3em] text-cherry/30 uppercase italic">
                    {lang === 'fr' ? 'Ressenti' : 'Feeling'} 0{i + 1}
                  </span>
                  <p className="text-lg font-medium text-cherry leading-tight">{bullet}</p>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl md:text-2xl font-semibold tracking-tight text-cherry pt-8"
            >
              {c.sections.bonEndroit.followup}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.72, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto w-full max-w-4xl pt-6 md:pt-8"
            >
              <img
                src={bonEndroitSectionImage}
                alt={
                  lang === 'fr'
                    ? 'Accompagnement et écoute METCARE'
                    : 'METCARE listening and support'
                }
                className="h-auto w-full max-h-[min(62vh,520px)] rounded-[2rem] border border-cherry/10 object-cover shadow-2xl shadow-cherry/10 md:max-h-[min(66vh,580px)] md:rounded-4xl"
                width={5714}
                height={3810}
                loading="lazy"
                decoding="async"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </PatientSection>

      {/* Final Portal */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-start px-6 pt-20 pb-24 md:pt-28 md:pb-40 overflow-hidden bg-cherry rounded-t-[5rem] lg:rounded-t-[8rem]">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-full bg-[radial-gradient(circle_at_center,var(--color-beige)_0%,transparent_70%)] opacity-20"
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center max-w-4xl"
        >
          <span className="inline-block text-[0.85rem] font-bold tracking-[0.4em] text-snow/40 uppercase mb-10">{c.sections.final.label}</span>
          <h2 className="mb-10 text-2xl font-semibold text-snow md:text-4xl lg:text-5xl leading-tight tracking-tight">
            {c.sections.final.intro}
          </h2>
          <div className="mx-auto mb-16 max-w-2xl space-y-4 text-left">
            {c.sections.final.body.map((para, i) => (
              <p key={i} className="text-sm font-light text-snow/60 md:text-base leading-relaxed">
                {para}
              </p>
            ))}
          </div>
          <a
            href="https://myesthetictravel.com/les-incontournables/#accompagnement"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-snow text-snow px-10 py-5 text-base rounded-full hover:bg-snow hover:text-cherry transition-all shadow-2xl font-semibold tracking-wide"
          >
            {c.sections.final.cta}
          </a>
        </motion.div>
      </section>

      <footer className="bg-cherry px-6 py-16 text-center border-t border-snow/5">
        <div className="flex flex-col items-center gap-10">
          <Link to={PATIENT_TUNNEL_ROUTES.home} className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
            <img src={metcareLogo} alt="METCARE" className="h-8 w-8 rounded-full" />
            <span className="text-xs font-bold tracking-[0.3em] text-snow uppercase">METCARE®</span>
          </Link>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-[0.6rem] font-bold tracking-[0.2em] text-snow/30 uppercase">
            <a href="#" className="hover:text-snow transition-colors">{lang === 'fr' ? 'Mentions Légales' : 'Legal Mentions'}</a>
            <a href="#" className="hover:text-snow transition-colors">{lang === 'fr' ? 'Confidentialité' : 'Privacy'}</a>
            <a href="#" className="hover:text-snow transition-colors">{lang === 'fr' ? 'Contact' : 'Contact'}</a>
          </div>

          <p className="text-[0.65rem] tracking-[0.1em] text-snow/60 uppercase">
            © {new Date().getFullYear()} METCARE. {lang === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}
          </p>
        </div>
      </footer>
    </div>
  );
}

function EditorialStep({ number, title, body, side, isLast = false }: { number: string, title: string, body: string, side: 'left' | 'right', isLast?: boolean }) {
  return (
    <div className={`flex flex-col md:flex-row items-center gap-8 md:gap-20 ${side === 'right' ? 'md:flex-row-reverse' : ''}`}>
      <div className="flex-1 w-full">
        <motion.div
          initial={{ opacity: 0, x: side === 'left' ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className={`patient-tunnel-glass p-8 md:p-12 rounded-[3rem] border-none bg-white/40 group hover:bg-white/60 transition-colors duration-500 ${side === 'right' ? 'text-right' : 'text-left'}`}
        >
          <div className={`flex flex-col ${side === 'right' ? 'items-end' : 'items-start'}`}>
            <span className="text-[4rem] md:text-[6rem] font-bold text-cherry/5 leading-none mb-4 group-hover:text-cherry/10 transition-colors">{number}</span>
            <h4 className="text-xl md:text-2xl font-semibold text-cherry leading-tight mb-3 uppercase tracking-tight group-hover:translate-x-2 transition-transform">{title}</h4>
            <TextWithTags text={body} className="text-sm md:text-base font-light leading-relaxed text-cherry/60" />
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 hidden md:flex h-6 w-6 items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-cherry/20" />
        <motion.div
          animate={{ scale: [1, 2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-cherry/10"
        />
      </div>

      <div className="flex-1 hidden md:block" />
    </div>
  );
}

function SolutionCard({
  label,
  title,
  body,
  accent = false,
  imageSrc,
  imageAlt = '',
  href,
  ctaLabel,
  onCtaClick,
}: {
  label: string;
  title: string;
  body: string | string[];
  accent?: boolean;
  imageSrc: string;
  imageAlt?: string;
  href?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
}) {
  const cardClass = `group relative flex min-h-[520px] min-w-[300px] snap-center flex-col justify-between overflow-hidden rounded-[3rem] p-8 shadow-xl transition-all duration-500 md:min-h-[580px] md:min-w-[380px] md:p-10 ${accent ? 'bg-cherry text-snow' : 'patient-tunnel-glass border-none bg-white/40'}`;
  const motionProps = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    whileHover: { y: -15, scale: 1.02 },
    transition: { duration: 0.6 },
    className: cardClass,
  };
  const inner = (
    <>
      <div className="relative z-10 shrink-0 space-y-4">
        <span className={`text-[0.55rem] font-bold tracking-[0.4em] uppercase ${accent ? 'text-snow/40' : 'text-cherry/40'}`}>{label}</span>
        <h4 className="text-xl font-semibold leading-tight tracking-tight md:text-2xl">{title}</h4>
      </div>
      <div className={`relative z-10 my-4 w-full shrink-0 overflow-hidden rounded-2xl md:my-5 ${accent ? 'border border-snow/15' : 'border border-cherry/10'} aspect-[3/4] max-h-[min(72vh,440px)] md:max-h-[min(58vh,420px)]`}>
        <img
          src={imageSrc}
          alt={imageAlt}
          className="h-full w-full object-cover object-[center_30%] scale-[1.22] motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-[1.26] md:scale-[1.14] md:object-[center_34%]"
          loading="lazy"
          decoding="async"
          sizes="(max-width: 768px) 92vw, 400px"
        />
      </div>
      {Array.isArray(body)
        ? <div className="relative z-10 shrink-0 space-y-3">
            {body.map((p, i) =>
              i === 0 && accent
                ? <p key={i} className="text-xl font-semibold leading-snug text-snow md:text-2xl">{p}</p>
                : <p key={i} className={`text-sm font-light leading-relaxed ${accent ? 'text-snow/60' : 'text-cherry/60'}`}>{p}</p>
            )}
          </div>
        : <TextWithTags text={body} className={`relative z-10 shrink-0 text-sm font-light leading-relaxed ${accent ? 'text-snow/60' : 'text-cherry/60'}`} />
      }
      {ctaLabel && (
        onCtaClick
          ? <button
              type="button"
              onClick={onCtaClick}
              className="relative z-10 mt-5 w-full rounded-full border border-snow/30 bg-snow/15 px-5 py-3.5 text-[0.7rem] font-bold tracking-[0.12em] text-snow uppercase transition-all hover:bg-snow/25 hover:border-snow/50"
            >
              {ctaLabel}
            </button>
          : <span className={`relative z-10 mt-5 flex w-full items-center justify-center rounded-full border px-5 py-3.5 text-[0.7rem] font-bold tracking-[0.12em] uppercase transition-all ${accent ? 'border-snow/30 bg-snow/15 text-snow hover:bg-snow/25 hover:border-snow/50' : 'border-cherry/20 bg-cherry/5 text-cherry hover:bg-cherry/10 hover:border-cherry/40'}`}>
              {ctaLabel}
            </span>
      )}
      <motion.div className={`pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full opacity-10 ${accent ? 'bg-white' : 'bg-cherry'}`} whileHover={{ scale: 1.2, opacity: 0.2 }} />
    </>
  );
  if (href) {
    return <motion.a {...motionProps} href={href} target="_blank" rel="noopener noreferrer">{inner}</motion.a>;
  }
  return <motion.div {...motionProps}>{inner}</motion.div>;
}
