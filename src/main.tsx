import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import SmoothScrollProvider from './SmoothScrollProvider.tsx';
import './index.css';
import { initMetaPixel } from './utils/metaPixel';

// Meta Pixel init + first PageView (eventID shared with the Conversions API).
initMetaPixel();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SmoothScrollProvider>
      <App />
    </SmoothScrollProvider>
  </StrictMode>,
);
