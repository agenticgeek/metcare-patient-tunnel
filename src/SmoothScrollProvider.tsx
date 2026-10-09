import Lenis from 'lenis';
import { type ReactNode, useEffect } from 'react';
import { setLenisInstance } from './lenisControl';

type SmoothScrollProviderProps = {
  children: ReactNode;
};

/**
 * Lenis smooth scroll — pairs with `html.lenis` styles in index.css.
 */
export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      autoRaf: true,
    });
    document.documentElement.classList.add('lenis');
    setLenisInstance(lenis);
    return () => {
      setLenisInstance(null);
      lenis.destroy();
      document.documentElement.classList.remove('lenis');
    };
  }, []);

  return children;
}
