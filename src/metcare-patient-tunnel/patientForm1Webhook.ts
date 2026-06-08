import type { PatientForm1Data } from './copy';

/** LeadConnector / HighLevel webhook — override with VITE_PATIENT_TUNNEL_FORM1_WEBHOOK_URL if needed. */
const DEFAULT_FORM1_WEBHOOK_URL =
  'https://services.leadconnectorhq.com/hooks/wyUmeJ4hWFpaeLK0H0Xe/webhook-trigger/a3f802ec-a10f-4a6a-bc23-0cdb2a37f7f4';

const WEBHOOK_URL =
  (import.meta.env.VITE_PATIENT_TUNNEL_FORM1_WEBHOOK_URL as string | undefined)?.trim() ||
  DEFAULT_FORM1_WEBHOOK_URL;

type WebhookMeta = {
  sourceCta?: string;
};

/**
 * POSTs Form 1 JSON payload to the configured webhook (LeadConnector by default).
 */
export function submitPatientForm1ToWebhook(data: PatientForm1Data, meta: WebhookMeta): void {
  const form: PatientForm1Data = {
    nom: data.nom.trim(),
    prenom: data.prenom.trim(),
    email: data.email.trim(),
    telephone: data.telephone.trim(),
    ville: data.ville.trim(),
    dateIntervention: data.dateIntervention,
    pays: data.pays.trim(),
    interventionRealisee: data.interventionRealisee,
    typesIntervention: [...data.typesIntervention],
    aideAujourdhui: [...data.aideAujourdhui],
  };

  /** Single JSON object: all form fields (flat) + derived text + submission context for LeadConnector. */
  const payload = {
    formId: 'patient_tunnel_form_1',
    ...form,
    typesInterventionText: form.typesIntervention.join(', '),
    aideAujourdhuiText: form.aideAujourdhui.join(', '),
    sourceCta: meta.sourceCta ?? '',
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    submittedAt: new Date().toISOString(),
  };

  void fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  }).catch((err) => {
    console.warn('[Patient tunnel form 1] Webhook request failed:', err);
  });
}
