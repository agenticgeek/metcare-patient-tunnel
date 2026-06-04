import type { PatientForm2Data } from './copy';

/**
 * Form 2 questionnaire webhook payload shape:
 * {
 *   “formId”: “questionare”,
 *   “email”: “lea@example.com”,
 *   “emailFromForm1”: “lea@example.com”,
 *   “interventionRealiseeFromForm1”: “Oui”,
 *   “ville1”: “Paris”,
 *   “ville2”: “Lyon”,
 *   “ville3”: “”,
 *   “technologieConnue”: “Oui”,
 *   “technologieDetail”: “VASER”,
 *   “commentVousSentez”: [“Stressée”],
 *   “aideMaintenant”: [“Être accompagnée”],
 *   “accompagnementSouhaite”: “Près de chez moi”,
 *   “commentVousSentezText”: “Stressée”,
 *   “aideMaintenantText”: “Être accompagnée”,
 *   “pageUrl”: “https://…”,
 *   “submittedAt”: “2026-04-13T…”
 * }
 */

/** LeadConnector / HighLevel webhook — override with VITE_PATIENT_TUNNEL_FORM2_WEBHOOK_URL if needed. */
const DEFAULT_FORM2_WEBHOOK_URL =
  'https://services.leadconnectorhq.com/hooks/wyUmeJ4hWFpaeLK0H0Xe/webhook-trigger/c2b7c4ff-b050-4caa-a35f-cb32f063165f';

const WEBHOOK_URL =
  (import.meta.env.VITE_PATIENT_TUNNEL_FORM2_WEBHOOK_URL as string | undefined)?.trim() ||
  DEFAULT_FORM2_WEBHOOK_URL;

export type PatientForm2WebhookMeta = {
  /** Email collected on Form 1 (modal), passed through for LeadConnector matching. */
  emailFromForm1?: string;
  /** Raw Form 1 answer for “intervention déjà réalisée / projet” — used to document which Form 2 timing field applies. */
  interventionRealiseeFromForm1?: string;
};


export function submitPatientForm2ToWebhook(
  data: PatientForm2Data,
  meta: PatientForm2WebhookMeta = {}
): void {
  const email = (meta.emailFromForm1 ?? '').trim();
  const fromForm1 = (meta.interventionRealiseeFromForm1 ?? '').trim();

  const payload = {
    formId: 'questionare',
    email,
    emailFromForm1: email,
    interventionRealiseeFromForm1: fromForm1,
    ville1: data.ville1.trim(),
    ville2: data.ville2.trim(),
    ville3: data.ville3.trim(),
    technologieConnue: data.technologieConnue,
    technologieDetail: data.technologieDetail,
    commentVousSentez: data.commentVousSentez,
    aideMaintenant: data.aideMaintenant,
    accompagnementSouhaite: data.accompagnementSouhaite,
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
