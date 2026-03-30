import type { PatientForm2Data } from './copy';

const WEBHOOK_URL = import.meta.env.VITE_PATIENT_TUNNEL_FORM2_WEBHOOK_URL as string | undefined;

export function submitPatientForm2ToWebhook(data: PatientForm2Data): void {
  if (!WEBHOOK_URL?.trim()) return;

  const payload = {
    formId: 'patient_tunnel_form_2',
    ...data,
    commentVousSentezText: data.commentVousSentez.join(', '),
    aideMaintenantText: data.aideMaintenant.join(', '),
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    submittedAt: new Date().toISOString(),
  };

  void fetch(WEBHOOK_URL.trim(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  }).catch((err) => {
    console.warn('[Patient tunnel form 2] Webhook request failed:', err);
  });
}
