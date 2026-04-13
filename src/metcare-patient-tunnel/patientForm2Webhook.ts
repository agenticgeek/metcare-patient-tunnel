import type { PatientForm2Data } from './copy';

/**
 * Form 2 questionnaire webhook payload shape:
 *
 * 1) User already had / scheduled surgery (Form 1 ≠ “project only”) — only `quandIntervention` is sent:
 * {
 *   "formId": "questionare",
 *   "email": "lea@example.com",
 *   "emailFromForm1": "lea@example.com",
 *   "interventionRealiseeFromForm1": "Oui",
 *   "interventionEstProjet": false,
 *   "quandIntervention": "Moins de 7 jours",
 *   "technologieConnue": "Oui",
 *   "technologieDetail": "VASER",
 *   "commentVousSentez": ["Stressée"],
 *   "aideMaintenant": ["Être accompagnée"],
 *   "accompagnementSouhaite": "Près de chez moi",
 *   "commentVousSentezText": "Stressée",
 *   "aideMaintenantText": "Être accompagnée",
 *   "pageUrl": "https://…",
 *   "submittedAt": "2026-04-13T…"
 * }
 * (`siPasEncore` is omitted — it was not asked.)
 *
 * 2) Surgery still a project (Form 1 = “Non, c'est en projet” / “No, it's a project”) — only `siPasEncore` is sent:
 * {
 *   … same top fields …,
 *   "interventionRealiseeFromForm1": "Non, c'est en projet",
 *   "interventionEstProjet": true,
 *   "siPasEncore": "1 à 3 mois",
 *   … rest …
 * }
 * (`quandIntervention` is omitted — it was not asked.)
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

function isInterventionProjectOnly(interventionRealisee: string | undefined): boolean {
  return (
    interventionRealisee === "Non, c'est en projet" || interventionRealisee === "No, it's a project"
  );
}

export function submitPatientForm2ToWebhook(
  data: PatientForm2Data,
  meta: PatientForm2WebhookMeta = {}
): void {
  const email = (meta.emailFromForm1 ?? '').trim();
  const fromForm1 = (meta.interventionRealiseeFromForm1 ?? '').trim();
  const interventionEstProjet =
    fromForm1.length > 0
      ? isInterventionProjectOnly(fromForm1)
      : Boolean(data.siPasEncore.trim());

  const { quandIntervention, siPasEncore, ...rest } = data;
  const timingFields = interventionEstProjet
    ? { siPasEncore: siPasEncore.trim() }
    : { quandIntervention: quandIntervention.trim() };

  const payload = {
    formId: 'questionare',
    email,
    emailFromForm1: email,
    interventionRealiseeFromForm1: fromForm1,
    interventionEstProjet,
    ...rest,
    ...timingFields,
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
