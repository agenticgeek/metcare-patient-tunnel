// Browser-side helper for the Meta Conversions API relay (/api/meta/capi).
// Always pair with the Pixel call using the same `eventId` so Meta dedupes.

export type CapiEventName = 'PageView' | 'ViewContent' | 'InitiateCheckout' | 'Lead';

/** Raw PII from the form; the server relay normalises + SHA-256 hashes it. */
export type CapiUser = {
  email?: string;
  /** E.164 (+33612345678) when available. */
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  zip?: string;
  /** ISO 3166-1 alpha-2. */
  country?: string;
};

export function newEventId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

const FBC_KEY = 'metcare-meta-fbc-v1';

/**
 * `fbc` built from `?fbclid=` when the Pixel hasn't set `_fbc` (blocked or not loaded yet).
 * Kept for the session because the SPA drops the query string on navigation (e.g. the
 * Lead fires after the form has moved the visitor to /demande).
 */
function fbcFromClickId(): string | undefined {
  const fbclid = new URLSearchParams(window.location.search).get('fbclid');
  try {
    const stored = sessionStorage.getItem(FBC_KEY);
    if (fbclid && !stored?.endsWith(`.${fbclid}`)) {
      const fbc = `fb.1.${Date.now()}.${fbclid}`;
      sessionStorage.setItem(FBC_KEY, fbc);
      return fbc;
    }
    return stored || undefined;
  } catch {
    return fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined;
  }
}

/** Fire-and-forget POST to the CAPI relay. Never throws. */
export function sendCapi(
  eventName: CapiEventName,
  eventId: string,
  options?: { customData?: Record<string, unknown>; user?: CapiUser },
): void {
  if (typeof window === 'undefined') return;
  try {
    const fbc = readCookie('_fbc') || fbcFromClickId();
    void fetch('/api/meta/capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        eventName,
        eventId,
        eventSourceUrl: window.location.href,
        fbp: readCookie('_fbp'),
        fbc,
        customData: options?.customData,
        user: options?.user,
      }),
    }).catch(() => {});
  } catch {
    // Tracking must never break the page.
  }
}
