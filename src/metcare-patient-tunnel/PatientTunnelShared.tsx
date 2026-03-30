import { motion, useScroll, useSpring } from 'motion/react';
import type { AriaAttributes, ReactNode } from 'react';

export function PatientTunnelDecor() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <>
      <div className="patient-tunnel-bg-mesh" aria-hidden />
      <svg className="patient-tunnel-grain" aria-hidden>
        <filter id="patientTunnelNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#patientTunnelNoise)" />
      </svg>
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
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'solid' | 'outline';
  type?: 'button' | 'submit';
}) {
  const base =
    'patient-tunnel-cta relative inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 text-center text-sm font-semibold tracking-wide transition-colors sm:w-auto sm:px-8 sm:py-4 sm:text-base';
  if (variant === 'outline') {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`${base} border-2 border-cherry bg-transparent text-cherry hover:bg-cherry/5 ${className}`}
      >
        {children}
      </button>
    );
  }
  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`patient-tunnel-shimmer overflow-hidden rounded-none border-0 bg-cherry text-snow hover:bg-cherry/92 ${base} ${className}`}
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
  'aria-label': ariaLabel,
}: {
  id?: string;
  label?: string;
  children: ReactNode;
  className?: string;
  tone?: 'snow' | 'beige' | 'cherry';
} & Partial<Pick<AriaAttributes, 'aria-label'>>) {
  const tones = {
    snow: 'bg-snow/90',
    beige: 'bg-beige/35',
    cherry: 'bg-cherry text-snow',
  };

  return (
    <section id={id} aria-label={ariaLabel} className={`px-5 py-14 md:px-10 md:py-20 ${tones[tone]} ${className}`}>
      <div className="mx-auto max-w-3xl">
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
