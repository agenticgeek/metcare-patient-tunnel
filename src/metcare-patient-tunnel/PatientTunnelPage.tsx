import { motion } from 'motion/react';
import { useEffect, useState, ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, PhoneCall, ShieldCheck } from 'lucide-react';
import metcareLogo from '../../assets/Sigle_Fond_BeigeS_HD.svg';
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

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

/**
 * Intelligent component to split text by slashes into stylized tags
 */
function TextWithTags({ text, className = "", tagClassName = "" }: { text: string; className?: string; tagClassName?: string }) {
  if (!text.includes('/')) return <p className={className}>{text}</p>;

  // Split by the first occurrence of ":" if it exists to keep the intro separate
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
          <span 
            key={i} 
            className={`inline-block px-3 py-1.5 rounded-lg bg-cherry/5 border border-cherry/10 text-[0.65rem] font-bold tracking-wider text-cherry/80 uppercase ${tagClassName}`}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function PatientTunnelPage() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [activeCta, setActiveCta] = useState<string>();

  const c = patientCopy[lang];

  useEffect(() => {
    document.title = c.meta.title;
  }, [c.meta.title]);

  const openForm = (cta: string) => {
    setActiveCta(cta);
    setShowForm(true);
  };

  const handleForm1 = (data: PatientForm1Data) => {
    sessionStorage.setItem(PATIENT_TUNNEL_STORAGE_KEYS.form1, JSON.stringify(data));
    navigate(PATIENT_TUNNEL_ROUTES.transition);
  };

  return (
    <div className="patient-tunnel-root selection:bg-cherry/10 selection:text-cherry">
      <PatientTunnelDecor />
      <LanguageSwitcher />

      <PatientTunnelFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleForm1}
        sourceCta={activeCta}
      />

      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed left-5 top-5 z-[100] flex items-center gap-4 rounded-full border border-white/20 bg-white/40 px-4 py-2.5 shadow-xl backdrop-blur-2xl md:left-12 md:top-12"
      >
        <Link to={PATIENT_TUNNEL_ROUTES.home} className="group flex items-center gap-4">
          <img src={metcareLogo} alt="METCARE" className="h-11 w-11 scale-95 rounded-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-[360deg]" width={44} height={44} />
          <div className="flex flex-col border-l border-cherry/10 pl-4">
            <span className="text-[0.55rem] font-bold tracking-[0.4em] text-cherry/40 uppercase">{lang === 'fr' ? 'ÉTABLI EN 2009' : 'ESTABLISHED 2009'}</span>
            <span className="text-[0.85rem] font-bold tracking-[0.2em] text-cherry">METCARE®</span>
          </div>
        </Link>
      </motion.nav>

      {/* Hero Section */}
      <section className="patient-tunnel-hero-aurora relative flex min-h-screen flex-col items-center justify-center px-6 text-center md:px-12 lg:px-24">
        <motion.div
          className="relative z-10 w-full max-w-[1400px]"
          initial="hidden"
          animate="show"
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="mb-10 flex justify-center">
             <span className="rounded-full bg-cherry/5 border border-cherry/5 px-6 py-2 text-[0.65rem] font-bold tracking-[0.35em] text-cherry/60 uppercase">
                {c.meta.title}
             </span>
          </motion.div>
          
          <motion.div variants={fadeUp} className="relative">
             <span className="text-stroke-cherry absolute -top-10 -left-4 select-none text-6xl font-bold opacity-10 md:text-8xl lg:text-[10rem]">METCARE</span>
             <h1 className="relative mb-10 text-balance text-4xl font-semibold leading-[0.95] tracking-tight text-cherry sm:text-6xl md:mb-12 md:text-7xl lg:text-[5.5rem]">
               {c.hero.headline}
             </h1>
          </motion.div>
          
          <motion.p
            variants={fadeUp}
            className="mx-auto mb-10 max-w-2xl text-base font-light leading-relaxed text-cherry/70 md:mb-16 md:text-lg lg:text-xl"
          >
            {c.hero.body}
          </motion.p>
          
          <motion.div variants={fadeUp} className="flex flex-col items-center gap-8 sm:flex-row sm:justify-center">
            <PatientPrimaryButton onClick={() => openForm(c.hero.ctaEchange)} className="!px-12 !py-5 !text-lg !rounded-full shadow-2xl shadow-cherry/25 group overflow-hidden">
               <span className="relative z-10">{c.hero.ctaEchange}</span>
            </PatientPrimaryButton>
            <button 
              onClick={() => openForm(c.hero.ctaGuide)}
              className="group flex flex-col items-center gap-1 text-[0.7rem] font-bold tracking-[0.3em] text-cherry/40 uppercase transition-all hover:text-cherry"
            >
              <span>{c.hero.ctaGuide}</span>
              <div className="h-[2px] w-8 bg-cherry/20 transition-all group-hover:w-full group-hover:bg-cherry" />
            </button>
          </motion.div>
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
      <PatientSection label={c.sections.repere.label} tone="beige" maxWidth="none" className="relative !py-32 overflow-hidden">
        <div className="editorial-grid max-w-[1400px] mx-auto">
          <div className="col-span-12 lg:col-span-5 mb-16 lg:mb-0">
             <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
                <span className="mb-6 inline-block text-[0.6rem] font-bold tracking-[0.4em] text-cherry/30 uppercase italic">{lang === 'fr' ? 'REPOS & SÉRÉNITÉ' : 'REST & SERENITY'}</span>
                <h2 className="mb-8 text-4xl font-semibold leading-[1.1] text-cherry md:text-6xl lg:text-[4.5rem]">
                  {lang === 'fr' ? 'Votre sérénité' : 'Your serenity'}<br/><span className="italic font-light">{lang === 'fr' ? 'commence' : 'begins'}</span> {lang === 'fr' ? 'ici.' : 'here.'}
                </h2>
                <TextWithTags 
                  text={c.sections.repere.body} 
                  className="text-lg font-light leading-relaxed text-cherry/70 md:text-xl lg:max-w-md"
                />
             </motion.div>
          </div>
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-8 md:flex-row md:items-start lg:pl-12">
             <motion.div 
               whileInView={{ y: [-20, 0], opacity: [0, 1] }} 
               viewport={{ once: true }}
               className="patient-tunnel-glass animate-float-subtle flex-1 rounded-[3rem] p-10 shadow-2xl md:mt-24"
             >
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-cherry text-snow shadow-lg shadow-cherry/20">
                   <span className="text-xs font-bold tracking-widest">01</span>
                </div>
                <h3 className="mb-6 font-heading text-2xl font-semibold text-cherry uppercase tracking-tight">{lang === 'fr' ? 'Savoir quoi observer' : 'Know what to observe'}</h3>
                <p className="text-base font-light leading-relaxed text-cherry/70">{lang === 'fr' ? 'Comprendre les signaux de votre corps pour vous repérer avec confiance dans chaque étape de votre évolution.' : 'Understand your body\'s signals to navigate with confidence through every stage of your progress.'}</p>
             </motion.div>
             <motion.div 
               whileInView={{ y: [40, 0], opacity: [0, 1] }} 
               viewport={{ once: true }}
               className="patient-tunnel-glass animate-float-delayed flex-1 rounded-[3rem] p-10 shadow-2xl border-cherry/5 bg-white/60"
             >
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-cherry/10 text-cherry shadow-lg">
                   <span className="text-xs font-bold tracking-widest">02</span>
                </div>
                <h3 className="mb-6 font-heading text-2xl font-semibold text-cherry uppercase tracking-tight">{lang === 'fr' ? 'Ne plus rester seule' : 'No longer stay alone'}</h3>
                <TextWithTags 
                  text={c.sections.normal.body} 
                  className="text-base font-light leading-relaxed text-cherry/70"
                />
             </motion.div>
          </div>
        </div>
      </PatientSection>

      {/* Editorial Mosaic for Expertise */}
      <PatientSection label={c.sections.expertise.label} maxWidth="none" className="!py-32">
        <div className="grid gap-6 md:grid-cols-12 md:grid-rows-6 md:h-[1000px] max-w-[1400px] mx-auto">
          {/* Main Statement Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-8 md:row-span-3 flex flex-col justify-center p-10 lg:p-16 patient-tunnel-glass rounded-[4rem] border-none bg-white/50"
          >
             <h3 className="mb-6 text-4xl font-semibold leading-tight text-cherry md:text-5xl lg:text-6xl">{lang === 'fr' ? 'La sécurité' : 'Safety'}<br/>{lang === 'fr' ? 'avant tout.' : 'first.'}</h3>
             <p className="max-w-lg text-base font-light leading-relaxed text-cherry/70 md:text-lg">
               {lang === 'fr' 
                 ? 'Un cadre structuré, sécurisé et personnalisé pour chaque patiente, où qu\'elle soit. Notre approche combine expertise médicale et soutien émotionnel.'
                 : 'A structured, secure, and personalized framework for every patient, wherever they are. Our approach combines medical expertise and emotional support.'}
             </p>
          </motion.div>
          
          {/* Label Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-4 md:row-span-4 bg-cherry rounded-[3rem] p-10 flex flex-col justify-between"
          >
             <div className="space-y-6">
                <span className="text-[0.65rem] font-bold tracking-[0.4em] text-snow/40 uppercase">{lang === 'fr' ? 'LE LABEL PRIVÉ' : 'THE PRIVATE LABEL'}</span>
                <h4 className="text-3xl font-semibold text-snow leading-tight tracking-tight">Safety Patient®</h4>
                <p className="text-sm font-light leading-relaxed text-snow/60">{c.sections.safety.body}</p>
             </div>
             <div className="pt-10 border-t border-snow/10">
                <p className="text-[0.65rem] font-bold tracking-[0.2em] text-snow/80 uppercase mb-4 italic">{lang === 'fr' ? 'PROTECTION GARANTIE' : 'GUARANTEED PROTECTION'}</p>
             </div>
          </motion.div>

          {/* Stat/Network Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-5 md:row-span-3 patient-tunnel-glass rounded-[3rem] p-10 flex flex-col justify-center border-beige/40 bg-beige/10"
          >
             <span className="text-[4rem] font-bold text-cherry/10 absolute top-4 right-8 select-none">17y</span>
             <h4 className="text-2xl font-semibold text-cherry mb-4">{c.sections.conciergerie.label}</h4>
             <p className="text-sm font-light leading-relaxed text-cherry/70">{c.sections.conciergerie.body}</p>
          </motion.div>

          {/* Partner Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-3 md:row-span-3 bg-white/40 rounded-[3rem] p-10 border border-cherry/5 flex flex-col items-center justify-center text-center"
          >
             <span className="text-4xl font-bold text-cherry mb-2">+8000</span>
             <span className="text-[0.6rem] font-bold tracking-[0.3em] text-cherry/40 uppercase">{lang === 'fr' ? 'Patients par an' : 'Patients per year'}</span>
          </motion.div>
          
          {/* Expertise List Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-4 md:row-span-2 patient-tunnel-glass rounded-[3rem] p-10 flex items-center justify-between"
          >
             <TextWithTags 
               text={c.sections.expertise.body} 
               className="text-sm font-light leading-relaxed text-cherry/70 italic max-w-[85%]" 
             />
             <div className="h-10 w-10 flex-shrink-0 rounded-full border border-cherry/10 flex items-center justify-center text-cherry/20">→</div >
          </motion.div>
        </div>
      </PatientSection>

      {/* Visual Journey: High-End Interactive Flow */}
      <PatientSection label={c.sections.parcours.label} tone="beige" maxWidth="none" className="relative !py-40 overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.03]">
           <span className="text-[20rem] font-bold tracking-tighter whitespace-nowrap text-cherry uppercase">{lang === 'fr' ? 'PARCOURS' : 'JOURNEY'}</span>
        </div>

        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="text-center mb-32">
             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-4xl font-semibold text-cherry md:text-6xl mb-8 tracking-tight">{c.sections.parcours.intro}</h2>
                <div className="flex items-center justify-center gap-4">
                   <div className="h-[1px] w-12 bg-cherry/20" />
                   <p className="text-[0.7rem] font-bold tracking-[0.5em] text-cherry/40 uppercase italic">{lang === 'fr' ? 'LE PROTOCOLE D\'EXCELLENCE' : 'THE EXCELLENCE PROTOCOL'}</p>
                   <div className="h-[1px] w-12 bg-cherry/20" />
                </div>
             </motion.div>
          </div>
          
          <div className="relative space-y-32">
             {/* Central Connecting Spine */}
             <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[1px] bg-gradient-to-b from-cherry/20 via-cherry/10 to-transparent hidden md:block" />
             
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
      <PatientSection label={c.sections.solutions.label} maxWidth="none" className="!py-32 overflow-hidden">
        <div className="flex flex-col md:flex-row gap-8 max-w-[1400px] mx-auto overflow-x-auto pb-12 snap-x px-4 no-scrollbar">
           <SolutionCard 
              label="PROTOCOL" 
              title="Signature Recovery Protocol" 
              body={lang === 'fr' ? 'Une approche structurée pour optimiser votre rétablissement après chaque type d\'intervention.' : 'A structured approach to optimize your recovery after each type of intervention.'}
           />
           <SolutionCard 
              label={lang === 'fr' ? 'ACCOMPAGNEMENT' : 'ACCOMPANIMENT'} 
              title={lang === 'fr' ? 'Accompagnement Personnalisé & E-book' : 'Personalized Accompaniment & E-book'} 
              body={lang === 'fr' ? 'Un guide complet de 148 pages et une écoute active tout au long de votre parcours de guérison.' : 'A complete 148-page guide and active listening throughout your healing journey.'}
           />
           <SolutionCard 
              label={lang === 'fr' ? 'OPPORTUNITÉ' : 'OPPORTUNITY'} 
              title={lang === 'fr' ? 'Soins encadrés (Paris / Régions)' : 'Supervised Care (Paris / Regions)'} 
              body={c.sections.opportunite.body}
              accent
           />
        </div>
      </PatientSection>

      {/* Final Portal */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 overflow-hidden bg-cherry rounded-t-[5rem] lg:rounded-t-[8rem]">
        <div className="absolute inset-0 pointer-events-none opacity-30">
           <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-full bg-[radial-gradient(circle_at_center,_var(--color-beige)_0%,_transparent_70%)] opacity-20" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 text-center max-w-4xl"
        >
          <span className="inline-block text-[0.6rem] font-bold tracking-[0.5em] text-snow/40 uppercase mb-8">{lang === 'fr' ? 'DISPONIBILITÉ IMMÉDIATE' : 'IMMEDIATE AVAILABILITY'}</span>
          <h2 className="mb-10 text-4xl font-semibold text-snow md:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
            {lang === 'fr' ? 'Prête à vous faire' : 'Ready to be'}<br/><span className="italic font-light">{lang === 'fr' ? 'accompagner' : 'accompanied'}</span> ?
          </h2>
          <p className="mx-auto mb-16 max-w-xl text-base font-light text-snow/50 md:text-lg italic text-balance">
             {c.sections.final.body}
          </p>
          <PatientPrimaryButton 
            variant="outline" 
            className="!border-snow !text-snow !px-16 !py-6 !text-lg !rounded-full hover:!bg-snow hover:!text-cherry transition-all shadow-2xl"
            onClick={() => openForm(c.sections.final.cta)}
          >
            {c.sections.final.cta}
          </PatientPrimaryButton>
        </motion.div>
      </section>

      <footer className="bg-cherry px-6 py-16 text-center border-t border-snow/5">
        <div className="flex flex-col items-center gap-10">
           <img src={metcareLogo} alt="METCARE" className="h-16 w-16" />
           <div className="h-[1px] w-32 bg-snow/10" />
           <div className="flex flex-col gap-2">
              <p className="patient-tunnel-section-label !text-snow/30 !text-[0.6rem] !tracking-[0.5em]">METCARE® ESTHETIQUE • DEPUIS 2009</p>
              <p className="text-snow/15 text-[0.5rem] tracking-[0.2em] uppercase">PARIS • LONDRES • DUBAI • GENÈVE</p>
           </div>
        </div>
      </footer>
    </div>
  );
}

function EditorialStep({ number, title, side, body }: { number: string, title: string, side: 'left' | 'right', body: string, isLast?: boolean }) {
  return (
    <div className={`relative flex flex-col md:flex-row items-center gap-16 ${side === 'right' ? 'md:flex-row-reverse' : ''}`}>
       <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, x: side === 'left' ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-6 max-w-sm group"
          >
             <div className="relative inline-block">
                <span className="text-[6rem] font-bold text-cherry/12 select-none leading-none transition-colors group-hover:text-cherry/20">{number}</span>
             </div>
             <div>
                <h4 className="text-2xl font-semibold text-cherry leading-tight mb-3 uppercase tracking-tight">{title}</h4>
                <TextWithTags text={body} className="text-base font-light leading-relaxed text-cherry/60" />
             </div>
          </motion.div>
       </div>
       
       <div className="relative z-10 hidden md:flex h-6 w-6 items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-cherry/20" />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-cherry/10" 
          />
       </div>
       
       <div className="flex-1 hidden md:block" />
    </div>
  );
}

function SolutionCard({ label, title, body, accent = false }: { label: string, title: string, body: string, accent?: boolean }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className={`relative min-w-[300px] md:min-w-[380px] snap-center aspect-[4/5] rounded-[3rem] p-10 flex flex-col justify-between overflow-hidden transition-all duration-500 ${
        accent ? 'bg-cherry text-snow' : 'patient-tunnel-glass border-none bg-white/40'
      }`}
    >
      <div className="space-y-4 relative z-10">
         <span className={`text-[0.55rem] font-bold tracking-[0.4em] uppercase ${accent ? 'text-snow/40' : 'text-cherry/40'}`}>{label}</span>
         <h4 className="text-2xl font-semibold leading-tight tracking-tight">{title}</h4>
      </div>
      <TextWithTags 
        text={body} 
        className={`text-sm font-light leading-relaxed relative z-10 ${accent ? 'text-snow/60' : 'text-cherry/60'}`} 
      />
      <div className={`absolute -right-20 -bottom-20 h-64 w-64 rounded-full opacity-10 transition-transform duration-700 group-hover:scale-110 ${accent ? 'bg-white' : 'bg-cherry'}`} />
    </motion.div>
  );
}
