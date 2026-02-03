// Report Types
import { IntakeData } from './intake';

export interface ReportContent {
  summary: string;
  handoffMap: string[];
  frictionPoints: string[];
  decisionRights: string[];
  stopDoing: string[];
  next7DayExperiment: string[];
}

export interface ReportResponse {
  reportId: string;
  createdAt: string;
  report: ReportContent;
  pdfUrl: string | null;
}

export interface SavedReport {
  id: string;
  reportId: string;
  intake: IntakeData;
  report: ReportContent;
  createdAt: string;
  pdfUrl: string | null;
}

export interface ReportListItem {
  id: string;
  workflowName: string;
  createdAt: string;
}

export interface SaveReportPayload {
  reportId: string;
  intake: IntakeData;
  report: ReportContent;
  createdAt: string;
  pdfUrl: string | null;
}
