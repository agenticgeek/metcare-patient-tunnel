import { motion } from 'motion/react';
import { useLanguage } from './i18n';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="fixed right-4 top-4 z-[120] flex items-center gap-1 rounded-full border border-white/20 bg-white/40 p-1 shadow-xl backdrop-blur-2xl md:right-12 md:top-12">
      <button
        onClick={() => setLang('fr')}
        className={`px-3 py-1 text-[0.6rem] font-bold tracking-widest transition-all rounded-full ${
          lang === 'fr' 
            ? 'bg-cherry text-snow shadow-lg shadow-cherry/20' 
            : 'text-cherry/40 hover:text-cherry hover:bg-white/40'
        }`}
      >
        FR
      </button>
      <button
        onClick={() => setLang('en')}
        className={`px-3 py-1 text-[0.6rem] font-bold tracking-widest transition-all rounded-full ${
          lang === 'en' 
            ? 'bg-cherry text-snow shadow-lg shadow-cherry/20' 
            : 'text-cherry/40 hover:text-cherry hover:bg-white/40'
        }`}
      >
        EN
      </button>
    </div>
  );
}
