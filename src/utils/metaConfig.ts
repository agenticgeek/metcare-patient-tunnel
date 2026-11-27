/**
 * Meta Pixel / dataset id that is live on recovery.metcare.fr today. It is only the
 * fallback: `VITE_META_PIXEL_ID` (build time) overrides it. Kept in a file with no
 * `import.meta.env` access so vite.config.ts can import it too.
 */
export const DEFAULT_META_PIXEL_ID = '1884233725563718';
