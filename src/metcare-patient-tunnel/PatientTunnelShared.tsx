import { motion, useScroll, useSpring } from 'motion/react';
import type { AriaAttributes, ReactNode } from 'react';

export function PatientTunnelDecor() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <>
      <div className="patient-tunnel-bg-mesh" aria-hidden />
      <div className="patient-tunnel-grain" aria-hidden>
        <svg width="100%" height="100%" style={{ filter: 'contrast(150%) brightness(1000%)' }}>
          <filter id="patientTunnelNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="1" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#patientTunnelNoise)" opacity="0.05" />
        </svg>
      </div>
      <motion.div
        className="fixed left-0 right-0 top-0 z-50 h-[2px] origin-left bg-cherry"
        style={{ scaleX }}
        aria-hidden
      />
    </>
  );
}

export function PatientPrimaryButton({
  children,
  onClick,
  className = '',
  variant = 'solid',
  type = 'button',
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'solid' | 'outline';
  type?: 'button' | 'submit';
  disabled?: boolean;
}) {
  const base =
    'patient-tunnel-cta relative inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 text-center text-sm font-semibold tracking-wide transition-colors sm:w-auto sm:px-8 sm:py-4 sm:text-base';
  
  if (variant === 'outline') {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${base} border-2 border-cherry bg-transparent text-cherry hover:bg-cherry/5 ${className} ${disabled ? 'opacity-30' : ''}`}
      >
        {children}
      </button>
    );
  }
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={`patient-tunnel-shimmer overflow-hidden rounded-none border-0 bg-cherry text-snow hover:bg-cherry/92 ${base} ${className} ${disabled ? 'opacity-30' : ''}`}
    >
      {children}
    </motion.button>
  );
}

export function PatientSection({
  id,
  label,
  children,
  className = '',
  tone = 'snow',
  maxWidth = '3xl',
  'aria-label': ariaLabel,
}: {
  id?: string;
  label?: string;
  children: ReactNode;
  className?: string;
  tone?: 'snow' | 'beige' | 'cherry';
  maxWidth?: '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'none';
} & Partial<Pick<AriaAttributes, 'aria-label'>>) {
  const tones = {
    snow: 'bg-snow/90',
    beige: 'bg-beige/35',
    cherry: 'bg-cherry text-snow',
  };

  const maxWidths: Record<string, string> = {
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    'none': 'max-w-none',
  };

  return (
    <section id={id} aria-label={ariaLabel} className={`px-5 py-14 md:px-10 md:py-20 ${tones[tone]} ${className}`} style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}>
      <div className={`mx-auto ${maxWidths[maxWidth]}`}>
        {label ? (
          <h2
            className={`patient-tunnel-section-label mb-4 text-balance ${tone === 'cherry' ? 'text-snow/70' : ''}`}
          >
            {label}
          </h2>
        ) : null}
        {children}
      </div>
    </section>
  );
}

export function PatientFeatureCard({
  label,
  title,
  children,
  className = '',
}: {
  label?: string;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`patient-tunnel-glass group relative overflow-hidden rounded-2xl border border-cherry/10 p-6 shadow-md transition-all hover:shadow-xl ${className}`}
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-beige/10 transition-transform group-hover:scale-150" />
      {label && (
        <span className="patient-tunnel-section-label mb-3 block text-[0.6rem] text-cherry/50">
          {label}
        </span>
      )}
      {title && <h3 className="mb-3 font-heading text-lg font-semibold text-cherry">{title}</h3>}
      <div className="relative z-10 text-sm font-light leading-relaxed text-cherry/80 md:text-base">
        {children}
      </div>
    </motion.div>
  );
}

export function PatientStepItem({
  number,
  title,
  children,
  isLast = false,
}: {
  number: number;
  title: string;
  children: ReactNode;
  isLast?: boolean;
}) {
  return (
    <div className="relative flex gap-6 pb-10">
      {!isLast && (
        <div className="absolute left-[19px] top-10 h-[calc(100%-20px)] w-[1px] bg-gradient-to-b from-cherry/20 to-transparent" />
      )}
      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cherry text-sm font-semibold text-snow shadow-lg shadow-cherry/20">
        {number}
      </div>
      <div>
        <h4 className="mb-2 font-heading text-base font-semibold text-cherry md:text-lg">{title}</h4>
        <div className="text-sm font-light leading-relaxed text-cherry/70 md:text-base">
          {children}
        </div>
      </div>
    </div>
  );
}
