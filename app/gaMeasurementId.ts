/** GA4 measurement IDs only (`G-XXXXXXXX`). Reject anything else before interpolating into scripts. */
const GA_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]+$/i;

export function resolveGaMeasurementId(raw: string | undefined): string | null {
  if (raw === undefined) return null;
  const trimmed = raw.trim();
  if (trimmed === "" || !GA_MEASUREMENT_ID_PATTERN.test(trimmed)) return null;
  return trimmed;
}
