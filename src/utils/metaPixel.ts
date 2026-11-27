import { DEFAULT_META_PIXEL_ID } from './metaConfig';
import { newEventId, readCookie, sendCapi, type CapiEventName, type CapiUser } from './metaCapi';

type FbqStub = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  push?: unknown;
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    fbq?: FbqStub;
    _fbq?: unknown;
  }
}

export type PixelEventData = Record<string, unknown>;

/** Pixel / dataset id: VITE_META_PIXEL_ID overrides the id that is live today. */
export const META_PIXEL_ID =
  ((import.meta.env.VITE_META_PIXEL_ID as string | undefined) ?? '').trim() || DEFAULT_META_PIXEL_ID;

const INITIATE_CHECKOUT_KEY = 'metcare-meta-initiate-checkout-v1';
const LEAD_FIRED_KEY = 'metcare-meta-lead-event-id-v1';

let initialized = false;
let lastPagePath: string | null = null;

// CAPI calls wait (briefly) for fbevents.js so the `_fbp` cookie it sets can be sent
// along; they are flushed on load, on error (ad blocker) or after a timeout.
let capiReady = false;
const pendingCapi: Array<() => void> = [];

function flushCapi() {
  if (capiReady) return;
  capiReady = true;
  pendingCapi.splice(0).forEach((send) => send());
}

function queueCapi(
  eventName: CapiEventName,
  eventId: string,
  options?: { customData?: Record<string, unknown>; user?: CapiUser },
) {
  const send = () => sendCapi(eventName, eventId, options);
  if (capiReady) send();
  else pendingCapi.push(send);
}

const fbq = (...args: unknown[]) => {
  if (!initialized || typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  window.fbq(...args);
};

/** Standard Meta Pixel base code, run from JS so the id can come from the env. */
function loadPixelScript() {
  if (window.fbq) {
    flushCapi();
    return;
  }
  const n = function (this: unknown) {
    // eslint-disable-next-line prefer-rest-params
    n.callMethod ? n.callMethod.apply(n, arguments as unknown as unknown[]) : n.queue!.push(arguments);
  } as FbqStub;
  window.fbq = n;
  if (!window._fbq) window._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = '2.0';
  n.queue = [];

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  script.onload = () => {
    // fbevents sets `_fbp` once it has processed the queued `init`; give it a moment.
    let tries = 0;
    const wait = () => {
      if (readCookie('_fbp') || tries++ >= 10) flushCapi();
      else window.setTimeout(wait, 150);
    };
    wait();
  };
  script.onerror = flushCapi;
  const first = document.getElementsByTagName('script')[0];
  if (first?.parentNode) first.parentNode.insertBefore(script, first);
  else document.head.appendChild(script);
  window.setTimeout(flushCapi, 4000);
}

function firePageView() {
  const eventID = newEventId();
  fbq('track', 'PageView', {}, { eventID });
  queueCapi('PageView', eventID);
}

/**
 * Loads the Pixel, inits it and fires the first PageView (with an eventID that is also
 * sent to CAPI). Call once, before the app renders. No-op without a pixel id.
 */
export function initMetaPixel() {
  if (initialized || typeof window === 'undefined' || !META_PIXEL_ID) return;
  initialized = true;
  loadPixelScript();
  fbq('init', META_PIXEL_ID);
  lastPagePath = window.location.pathname;
  firePageView();
}

/**
 * Client-side route change. Redirects (`<Navigate replace>`) only update the current
 * path so an old URL redirecting to `/` doesn't count two PageViews.
 */
export function trackRouteChange(pathname: string, isRedirect: boolean) {
  if (!initialized || pathname === lastPagePath) return;
  lastPagePath = pathname;
  if (!isRedirect) firePageView();
}

export const trackPageView = () => {
  if (initialized) firePageView();
};

export const trackViewContent = (content_name: string) => {
  if (!initialized) return;
  const eventID = newEventId();
  const params = { content_name };
  fbq('track', 'ViewContent', params, { eventID });
  queueCapi('ViewContent', eventID, { customData: params });
};

/** Patient form opened. Once per session. */
export const trackInitiateCheckout = (content_name: string) => {
  if (!initialized) return;
  try {
    if (sessionStorage.getItem(INITIATE_CHECKOUT_KEY)) return;
    sessionStorage.setItem(INITIATE_CHECKOUT_KEY, '1');
  } catch {
    // Storage disabled: fail open.
  }
  const eventID = newEventId();
  const params = { content_name };
  fbq('track', 'InitiateCheckout', params, { eventID });
  queueCapi('InitiateCheckout', eventID, { customData: params });
};

/**
 * Lead: call ONLY once the form webhook has accepted the submission. `eventID` is
 * generated per submission; the sessionStorage guard stops the same submission from
 * being counted twice. User data goes to CAPI only (hashed server-side), never to fbq.
 */
export const trackLead = (content_name: string, eventID: string, user?: CapiUser) => {
  if (!initialized) return;
  try {
    if (sessionStorage.getItem(LEAD_FIRED_KEY) === eventID) return;
    sessionStorage.setItem(LEAD_FIRED_KEY, eventID);
  } catch {
    // Storage disabled: fail open.
  }
  const params = { content_name };
  fbq('track', 'Lead', params, { eventID });
  queueCapi('Lead', eventID, { customData: params, user });
};

export const trackCustom = (eventName: string, data?: PixelEventData) =>
  fbq('trackCustom', eventName, data ?? {});

export { newEventId };
