import { createHash } from 'node:crypto';

// Meta Conversions API relay (Vercel Function, Node.js runtime). Receives events from
// the browser, adds the server-only data (client IP, user agent, access token), hashes
// PII and forwards to the Graph API. The browser Pixel uses the same `event_id`, so
// Meta dedupes the two copies of each event.

// Pixel id live on recovery.metcare.fr today; env vars override it.
const DEFAULT_META_PIXEL_ID = '1884233725563718';
const API_VERSION = 'v21.0';

const ALLOWED_EVENTS = new Set([
  'PageView',
  'ViewContent',
  'InitiateCheckout',
  'Lead',
  'CompleteRegistration',
  'Schedule',
  'Contact',
]);

type Body = {
  eventName?: string;
  eventId?: string;
  eventSourceUrl?: string;
  fbp?: string;
  fbc?: string;
  customData?: Record<string, unknown>;
  user?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    city?: string;
    zip?: string;
    country?: string;
  };
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');

function hashed(value: unknown, normalise: (v: string) => string) {
  const v = typeof value === 'string' ? normalise(value) : '';
  return v ? [sha256(v)] : undefined;
}

const lowerTrim = (v: string) => v.trim().toLowerCase();
// Meta: city lowercase without spaces/punctuation; zip lowercase without spaces.
const normaliseCity = (v: string) => v.trim().toLowerCase().replace(/[\s\p{P}\p{S}]+/gu, '');
const normaliseZip = (v: string) => v.trim().toLowerCase().replace(/\s+/g, '');
// Phone: digits only, country code included (the form sends E.164).
const normalisePhone = (v: string) => {
  const digits = v.replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 15 ? digits : '';
};
const normaliseCountry = (v: string) => {
  const c = v.trim().toLowerCase();
  return /^[a-z]{2}$/.test(c) ? c : '';
};

export async function POST(request: Request): Promise<Response> {
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN?.trim();
  if (!accessToken) {
    return json({ ok: false, error: 'capi_not_configured' }, 503);
  }
  const pixelId =
    process.env.META_PIXEL_ID?.trim() ||
    process.env.VITE_META_PIXEL_ID?.trim() ||
    DEFAULT_META_PIXEL_ID;
  const testEventCode = process.env.META_TEST_EVENT_CODE?.trim();

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return json({ ok: false, error: 'bad_json' }, 400);
  }
  if (!body || typeof body.eventName !== 'string' || !ALLOWED_EVENTS.has(body.eventName) || !body.eventId) {
    return json({ ok: false, error: 'bad_event' }, 400);
  }

  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || undefined;
  const user = body.user ?? {};

  const userData: Record<string, unknown> = {
    em: hashed(user.email, lowerTrim),
    ph: hashed(user.phone, normalisePhone),
    fn: hashed(user.firstName, lowerTrim),
    ln: hashed(user.lastName, lowerTrim),
    ct: hashed(user.city, normaliseCity),
    zp: hashed(user.zip, normaliseZip),
    country: hashed(user.country, normaliseCountry),
    client_ip_address: ip,
    client_user_agent: request.headers.get('user-agent') || undefined,
    fbp: body.fbp || undefined,
    fbc: body.fbc || undefined,
  };

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: body.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: String(body.eventId),
        event_source_url: body.eventSourceUrl,
        action_source: 'website',
        user_data: userData,
        custom_data: body.customData,
      },
    ],
  };
  if (testEventCode) payload.test_event_code = testEventCode;

  try {
    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(accessToken)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );
    const result = (await res.json().catch(() => ({}))) as { events_received?: number };
    if (!res.ok) {
      console.error('Meta CAPI error:', JSON.stringify(result));
      return json({ ok: false, error: 'meta_error' }, 502);
    }
    return json({ ok: true, events_received: result.events_received });
  } catch (error) {
    console.error('Meta CAPI request failed:', error instanceof Error ? error.message : 'unknown');
    return json({ ok: false, error: 'network' }, 502);
  }
}
