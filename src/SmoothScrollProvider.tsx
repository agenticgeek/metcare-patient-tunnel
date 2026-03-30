import Lenis from 'lenis';
import { type ReactNode, useEffect } from 'react';

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
    return () => {
      lenis.destroy();
      document.documentElement.classList.remove('lenis');
    };
  }, []);

  return children;
}
