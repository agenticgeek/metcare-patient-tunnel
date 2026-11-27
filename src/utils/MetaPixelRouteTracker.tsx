import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { trackRouteChange } from './metaPixel';

/** Fires a Meta PageView on client-side route changes (the first one comes from initMetaPixel). */
export default function MetaPixelRouteTracker() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    trackRouteChange(pathname, navigationType === 'REPLACE');
  }, [pathname, navigationType]);

  return null;
}
