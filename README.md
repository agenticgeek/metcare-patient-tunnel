# Metcare Masterclass

This project now runs the Metcare sister landing experience as the main application.

## Run locally




1. Install dependencies with `npm install`
2. Start the dev server with `npm run dev`
3. Build for production with `npm run build`

## Meta tracking

Meta Pixel (`src/utils/metaPixel.ts`) plus the Conversions API relay (`api/meta/capi.ts`, a Vercel Function). PageView, ViewContent, InitiateCheckout (form opened) and Lead (after the form webhook succeeds) fire from both the Pixel and CAPI with the same event id, so Meta dedupes them. Environment variables (see `.env.example`):

- `VITE_META_PIXEL_ID`: Pixel id, read at build time (redeploy after changing). Falls back to the live id `1884233725563718`.
- `META_PIXEL_ID`: dataset id for CAPI (server). Falls back to `VITE_META_PIXEL_ID`, then the live id.
- `META_CAPI_ACCESS_TOKEN`: CAPI token (server only). If it's missing, `/api/meta/capi` returns 503 and the page is unaffected.
- `META_TEST_EVENT_CODE`: optional, for Events Manager test events.
