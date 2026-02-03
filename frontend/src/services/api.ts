// API Service - centralized API calls
import { IntakeData, ReportResponse, ReportListItem, SavedReport, SaveReportPayload } from '../../../../shared/types';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.detail || 'An error occurred',
      response.status
    );
  }
  return response.json();
};

export const api = {
  // Generate a diagnostic report from intake data
  async generateReport(intake: IntakeData): Promise<ReportResponse> {
    const response = await fetch(`${BACKEND_URL}/api/intake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(intake),
    });
    return handleResponse<ReportResponse>(response);
  },

  // Save a report to the database
  async saveReport(payload: SaveReportPayload): Promise<{ ok: boolean }> {
    const response = await fetch(`${BACKEND_URL}/api/reports/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<{ ok: boolean }>(response);
  },

  // Get list of all saved reports
  async getReports(): Promise<ReportListItem[]> {
    const response = await fetch(`${BACKEND_URL}/api/reports`);
    return handleResponse<ReportListItem[]>(response);
  },

  // Get a single report by ID
  async getReport(reportId: string): Promise<SavedReport> {
    const response = await fetch(`${BACKEND_URL}/api/reports/${reportId}`);
    return handleResponse<SavedReport>(response);
  },
};

export { ApiError };
