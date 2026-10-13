import { generateReportId } from './reportId';

export type IssueCategory =
  | 'Pothole'
  | 'Streetlight'
  | 'Garbage'
  | 'Water Leakage'
  | 'Drainage'
  | 'Road Damage'
  | 'Public Toilet'
  | 'Traffic Signal'
  | 'Public Space'
  | 'Other';

export type IssuePriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type IssueStatus =
  | 'Reported'
  | 'Under Review'
  | 'Verified'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved';

export interface CivicReport {
  id: string; // e.g. "FX-20261002-4821"
  title: string;
  category: IssueCategory;
  description: string;
  location: string;
  priority: IssuePriority;
  status: IssueStatus;
  createdAt: string; // ISO 8601 string
  imageUrl?: string;
}

const STORAGE_KEY = 'fixnear_reports';

/**
 * Retrieves all locally saved reports from LocalStorage.
 * Handles corrupt JSON gracefully.
 */
export function getReports(): CivicReport[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Error reading reports from LocalStorage:', err);
    return [];
  }
}

/**
 * Saves a new report to LocalStorage.
 * Auto-assigns ID, timestamp, and initial 'Reported' status.
 */
export function saveReport(
  reportInput: Omit<CivicReport, 'id' | 'createdAt' | 'status'> & { id?: string }
): CivicReport {
  const reports = getReports();
  const newReport: CivicReport = {
    ...reportInput,
    id: reportInput.id || generateReportId(),
    createdAt: new Date().toISOString(),
    status: 'Reported',
  };

  const updatedReports = [newReport, ...reports];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReports));
  } catch (err) {
    console.error('Error saving report to LocalStorage:', err);
  }

  return newReport;
}

/**
 * Retrieves a single report by its unique ID (case-insensitive check).
 */
export function getReportById(id: string): CivicReport | null {
  if (!id) return null;
  const reports = getReports();
  const trimmed = id.trim().toUpperCase();
  const match = reports.find(
    (report) => report.id.toUpperCase() === trimmed
  );
  return match || null;
}

/**
 * Deletes a report by ID from LocalStorage.
 */
export function deleteReport(id: string): boolean {
  try {
    const reports = getReports();
    const filtered = reports.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.error('Error deleting report:', err);
    return false;
  }
}
