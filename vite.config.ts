import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import {DEFAULT_META_PIXEL_ID} from './src/utils/metaConfig';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  const metaPixelId = (env.VITE_META_PIXEL_ID || '').trim() || DEFAULT_META_PIXEL_ID;
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        // Same pixel id as src/utils/metaPixel.ts, for the <noscript> fallback in index.html.
        name: 'meta-pixel-noscript',
        transformIndexHtml: (html) => html.replace(/__META_PIXEL_ID__/g, metaPixelId),
      },
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
