/**
 * Generates a unique, standardized civic report ID for FixNear.
 * Format: FX-YYYYMMDD-XXXX (e.g. FX-20261002-4821)
 */
export function generateReportId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `FX-${year}${month}${day}-${randomSuffix}`;
}
