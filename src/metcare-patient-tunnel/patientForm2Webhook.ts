import type { PatientForm2Data } from './copy';

/** LeadConnector / HighLevel webhook — override with VITE_PATIENT_TUNNEL_FORM2_WEBHOOK_URL if needed. */
const DEFAULT_FORM2_WEBHOOK_URL =
  'https://services.leadconnectorhq.com/hooks/wyUmeJ4hWFpaeLK0H0Xe/webhook-trigger/c2b7c4ff-b050-4caa-a35f-cb32f063165f';

const WEBHOOK_URL =
  (import.meta.env.VITE_PATIENT_TUNNEL_FORM2_WEBHOOK_URL as string | undefined)?.trim() ||
  DEFAULT_FORM2_WEBHOOK_URL;

export type PatientForm2WebhookMeta = {
  /** Email collected on Form 1 (modal), passed through for LeadConnector matching. */
  emailFromForm1?: string;
};

export function submitPatientForm2ToWebhook(
  data: PatientForm2Data,
  meta: PatientForm2WebhookMeta = {}
): void {
  const email = (meta.emailFromForm1 ?? '').trim();

  const payload = {
    formId: 'questionare',
    email,
    emailFromForm1: email,
    ...data,
    commentVousSentezText: data.commentVousSentez.join(', '),
    aideMaintenantText: data.aideMaintenant.join(', '),
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    submittedAt: new Date().toISOString(),
  };

  void fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  }).catch((err) => {
    console.warn('[Patient tunnel form 2] Webhook request failed:', err);
  });
}
