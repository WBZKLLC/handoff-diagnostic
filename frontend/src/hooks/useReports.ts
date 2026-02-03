// Custom hook for managing reports
import { useState, useCallback } from 'react';
import { api, ApiError } from '../services/api';
import { ReportListItem, SavedReport } from '../../../../shared/types';

export const useReports = () => {
  const [reports, setReports] = useState<ReportListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getReports();
      setReports(data);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to fetch reports';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { reports, loading, error, fetchReports };
};

export const useReportDetail = () => {
  const [report, setReport] = useState<SavedReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async (reportId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getReport(reportId);
      setReport(data);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to fetch report';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { report, loading, error, fetchReport };
};
