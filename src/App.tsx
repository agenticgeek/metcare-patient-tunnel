import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import faviconLogo from '../assets/Sigle_Fond_BeigeS_HD.svg';
import PatientTunnelPage from './metcare-patient-tunnel/PatientTunnelPage';
import PatientTunnelProfilePage from './metcare-patient-tunnel/PatientTunnelProfilePage';
import PatientTunnelTransitionPage from './metcare-patient-tunnel/PatientTunnelTransitionPage';
import { LanguageProvider } from './metcare-patient-tunnel/i18n';

function AppRoutes() {
  return (
    <LanguageProvider>
      <Routes>
        
        <Route path="/" element={<PatientTunnelPage />} />
        <Route path="/demande" element={<PatientTunnelTransitionPage />} />
        <Route path="/profil" element={<PatientTunnelProfilePage />} />
        <Route path="/landingpage2" element={<Navigate to="/" replace />} />
        <Route path="/landingpage2/demande" element={<Navigate to="/demande" replace />} />
        <Route path="/landingpage2/profil" element={<Navigate to="/profil" replace />} />
        <Route path="/masterclass-metcare" element={<Navigate to="/" replace />} />
        <Route path="/masterclass-metcare/demande" element={<Navigate to="/demande" replace />} />
        <Route path="/masterclass-metcare/profil" element={<Navigate to="/profil" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </LanguageProvider>
  );
}

export default function App() {
  useEffect(() => {
    document.title = 'Metcare Patient Tunnel';
    const faviconLinks = [
      { rel: 'icon', type: 'image/svg+xml' },
      { rel: 'shortcut icon', type: 'image/svg+xml' },
      { rel: 'apple-touch-icon' },
    ];

    faviconLinks.forEach(({ rel, type }) => {
      let link = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        document.head.appendChild(link);
      }

      if (type) {
        link.type = type;
      }

      link.href = faviconLogo;
    });
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
