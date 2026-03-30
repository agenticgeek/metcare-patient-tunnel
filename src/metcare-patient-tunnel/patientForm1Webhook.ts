import type { PatientForm1Data } from './copy';

const WEBHOOK_URL = import.meta.env.VITE_PATIENT_TUNNEL_FORM1_WEBHOOK_URL as string | undefined;

type WebhookMeta = {
  sourceCta?: string;
};

/**
 * POSTs Form 1 when VITE_PATIENT_TUNNEL_FORM1_WEBHOOK_URL is set. No-op otherwise.
 */
export function submitPatientForm1ToWebhook(data: PatientForm1Data, meta: WebhookMeta): void {
  if (!WEBHOOK_URL?.trim()) return;

  const payload = {
    formId: 'patient_tunnel_form_1',
    nom: data.nom.trim(),
    prenom: data.prenom.trim(),
    email: data.email.trim(),
    telephone: data.telephone.trim(),
    pays: data.pays.trim(),
    ville: data.ville.trim(),
    codePostal: data.codePostal.trim(),
    interventionRealisee: data.interventionRealisee,
    typesIntervention: data.typesIntervention,
    typesInterventionText: data.typesIntervention.join(', '),
    aideAujourdhui: data.aideAujourdhui,
    aideAujourdhuiText: data.aideAujourdhui.join(', '),
    sourceCta: meta.sourceCta ?? '',
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    submittedAt: new Date().toISOString(),
  };

  void fetch(WEBHOOK_URL.trim(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  }).catch((err) => {
    console.warn('[Patient tunnel form 1] Webhook request failed:', err);
  });
}
