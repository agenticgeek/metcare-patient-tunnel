/**
 * Landing-page CTAs that open Form 1.
 *
 * Naming convention
 * - id:    snake_case, stable machine key (never translated, safe for filters/automations)
 * - label: CTA name sent as `sourceCta`. Fixed French for the hero CTAs; `echange_offert` sends
 *          the translated button text and `opportunite_card` sends its code string (as before).
 */
export const PATIENT_TUNNEL_CTA_SOURCES = {
  expert_peri_operatoire: { id: 'expert_peri_operatoire', label: 'expert du péri-opératoire' },
  guide_patient: { id: 'guide_patient', label: 'guide patient' },
  echange_offert: { id: 'echange_offert', label: 'Je bénéficie de mon échange offert' },
  opportunite_card: { id: 'opportunite_card', label: 'opportunite_card' },
} as const;

export type PatientTunnelCtaSourceId = keyof typeof PATIENT_TUNNEL_CTA_SOURCES;

export type PatientTunnelCtaSource = (typeof PATIENT_TUNNEL_CTA_SOURCES)[PatientTunnelCtaSourceId];

/** Webhook form name: "<funnel> - <form> - <cta label>". */
export function buildFormName(formNumber: 1 | 2, source?: PatientTunnelCtaSource | null): string {
  const base = `Patient Tunnel - Form ${formNumber}`;
  return source ? `${base} - ${source.label}` : base;
}
