import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const DOMAIN_LABELS: Record<string, string> = {
  general: 'General',
  logistics: 'Logistics',
  healthcare: 'Healthcare',
  finance: 'Finance',
  saas: 'SaaS',
  manufacturing: 'Manufacturing',
  public: 'Public Sector',
  other: 'Other',
};

const DIAGNOSIS_EXPLANATIONS: Record<string, string> = {
  ownership_ambiguity: "This diagnosis is used when responsibility for steps or decisions is unclear, leading to work being passed without clear ownership or follow-through.",
  decision_rights_unclear: "This diagnosis appears when it is not explicit who has authority to approve, reject, or prioritize work, causing delays and rework.",
  queue_opacity: "This diagnosis indicates that work waits in queues without clear visibility, SLAs, or ownership, resulting in repeated status checks.",
  artifact_mismatch: "This diagnosis is used when required documents or inputs are missing, incomplete, or inconsistent, preventing work from progressing.",
  exception_handling_undefined: "This diagnosis applies when off-plan situations are handled ad hoc instead of through a defined exception path.",
  duplicate_tracking: "This diagnosis indicates that the same information is tracked in multiple places, increasing reconciliation effort and errors.",
  context_switching_overload: "This diagnosis is used when work is fragmented across channels, causing frequent interruptions and reduced focus."
};

interface ReportContent {
  summary: string;
  handoffMap: string[];
  frictionPoints: string[];
  decisionRights: string[];
  stopDoing: string[];
  next7DayExperiment: string[];
}

interface EvidenceItem {
  field: string;
  snippet: string;
  tag: string;
}

interface DiagnosisResult {
  primaryTag: string;
  secondaryTags: string[];
  confidence?: number;
  evidence?: EvidenceItem[];
}

interface IntakeData {
  companyName: string;
  workflowName: string;
  workflowDescription: string;
  rolesInvolved: string;
  toolsUsed: string;
  whereItGetsStuck: string;
  desiredOutcome: string;
  urgencyLevel: string;
  domain: string;
  contactEmail: string;
}

interface SavedReport {
  id: string;
  reportId: string;
  intake: IntakeData;
  extraction: Record<string, any>;
  diagnosis: DiagnosisResult;
  report: ReportContent;
  createdAt: string;
  pdfUrl: string | null;
}

const getConfidenceLevel = (confidence: number): { label: string; color: string } => {
  if (confidence >= 0.75) {
    return { label: 'High', color: '#27AE60' };
  } else if (confidence >= 0.56) {
    return { label: 'Medium', color: '#F39C12' };
  }
  return { label: 'Low', color: '#E74C3C' };
};

const formatFieldName = (field: string): string => {
  const fieldLabels: Record<string, string> = {
    whereItGetsStuck: 'Where It Gets Stuck',
    workflowDescription: 'Workflow Description',
    toolsUsed: 'Tools Used',
    desiredOutcome: 'Desired Outcome',
  };
  return fieldLabels[field] || field;
};

export default function ReportDetailScreen() {
  const router = useRouter();
  const { reportId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<SavedReport | null>(null);
  const [evidenceExpanded, setEvidenceExpanded] = useState(false);
  const [whyExpanded, setWhyExpanded] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [reportId]);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/reports/${reportId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch report');
      }
      const data = await response.json();
      setReportData(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    if (reportData?.pdfUrl) {
      Alert.alert('PDF Download', 'PDF download will be available in Phase 2');
    }
  };

  const formatTag = (tag: string) => {
    return tag
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const renderSection = (
    icon: keyof typeof Ionicons.glyphMap,
    title: string,
    items: string[],
    color: string
  ) => (
    <View style={styles.section}>
      <View style={[styles.sectionHeader, { borderLeftColor: color }]}>
        <Ionicons name={icon} size={22} color={color} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionContent}>
        {items.map((item, index) => (
          <View key={index} style={styles.bulletItem}>
            <View style={[styles.bullet, { backgroundColor: color }]} />
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderEvidence = () => {
    const evidence = reportData?.diagnosis?.evidence || [];
    if (evidence.length === 0) return null;

    return (
      <View style={styles.evidenceSection}>
        <TouchableOpacity
          style={styles.evidenceHeader}
          onPress={() => setEvidenceExpanded(!evidenceExpanded)}
          activeOpacity={0.7}
        >
          <View style={styles.evidenceHeaderLeft}>
            <Ionicons name="search-outline" size={20} color="#7F8C8D" />
            <Text style={styles.evidenceTitle}>Evidence</Text>
            <View style={styles.evidenceCount}>
              <Text style={styles.evidenceCountText}>{evidence.length}</Text>
            </View>
          </View>
          <Ionicons
            name={evidenceExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#7F8C8D"
          />
        </TouchableOpacity>

        {evidenceExpanded && (
          <View style={styles.evidenceContent}>
            {evidence.map((item, index) => (
              <View key={index} style={styles.evidenceItem}>
                <Text style={styles.evidenceField}>
                  {formatFieldName(item.field)}
                </Text>
                <Text style={styles.evidenceSnippet}>"{item.snippet}"</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#2C3E50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498DB" />
          <Text style={styles.loadingText}>Loading report...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !reportData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#2C3E50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#E74C3C" />
          <Text style={styles.errorTitle}>Error Loading Report</Text>
          <Text style={styles.errorText}>{error || 'Report not found'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchReport}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const confidenceInfo = getConfidenceLevel(reportData.diagnosis?.confidence || 0.5);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.workflowBadge}>
          <Ionicons name="business-outline" size={18} color="#3498DB" />
          <Text style={styles.workflowName}>{reportData.intake.workflowName}</Text>
          <Text style={styles.companyName}>at {reportData.intake.companyName}</Text>
        </View>

        {/* Domain, Diagnosis & Confidence Badges */}
        <View style={styles.metaBadges}>
          {reportData.intake.domain && (
            <View style={styles.domainBadge}>
              <Ionicons name="layers-outline" size={16} color="#9B59B6" />
              <Text style={styles.domainText}>
                {DOMAIN_LABELS[reportData.intake.domain] || reportData.intake.domain}
              </Text>
            </View>
          )}
          {reportData.diagnosis?.primaryTag && (
            <View style={styles.diagnosisBadge}>
              <Ionicons name="pulse-outline" size={16} color="#E67E22" />
              <Text style={styles.diagnosisText}>
                {formatTag(reportData.diagnosis.primaryTag)}
              </Text>
            </View>
          )}
          {reportData.diagnosis?.confidence !== undefined && (
            <View style={[styles.confidenceBadge, { backgroundColor: confidenceInfo.color + '20' }]}>
              <Ionicons name="analytics-outline" size={16} color={confidenceInfo.color} />
              <Text style={[styles.confidenceText, { color: confidenceInfo.color }]}>
                {confidenceInfo.label} ({Math.round(reportData.diagnosis.confidence * 100)}%)
              </Text>
            </View>
          )}
        </View>

        {/* Why this diagnosis? */}
        {reportData.diagnosis?.primaryTag && DIAGNOSIS_EXPLANATIONS[reportData.diagnosis.primaryTag] && (
          <View style={styles.whyDiagnosisContainer}>
            <TouchableOpacity
              style={styles.whyDiagnosisButton}
              onPress={() => setWhyExpanded(!whyExpanded)}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="help-circle-outline" 
                size={16} 
                color="#7F8C8D" 
              />
              <Text style={styles.whyDiagnosisText}>Why this diagnosis?</Text>
              <Ionicons
                name={whyExpanded ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#7F8C8D"
              />
            </TouchableOpacity>
            {whyExpanded && (
              <View style={styles.whyDiagnosisPanel}>
                <Text style={styles.whyDiagnosisExplanation}>
                  {DIAGNOSIS_EXPLANATIONS[reportData.diagnosis.primaryTag]}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Evidence Section */}
        {renderEvidence()}

        <View style={styles.metaInfo}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={16} color="#7F8C8D" />
            <Text style={styles.metaText}>
              {new Date(reportData.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="flag-outline" size={16} color="#7F8C8D" />
            <Text style={styles.metaText}>Urgency: {reportData.intake.urgencyLevel}</Text>
          </View>
        </View>

        {/* Summary Section */}
        <View style={styles.summarySection}>
          <View style={styles.summaryHeader}>
            <Ionicons name="document-text-outline" size={22} color="#3498DB" />
            <Text style={styles.summaryTitle}>Summary</Text>
          </View>
          <Text style={styles.summaryText}>{reportData.report.summary}</Text>
        </View>

        {renderSection(
          'git-network-outline',
          'Handoff Map',
          reportData.report.handoffMap,
          '#9B59B6'
        )}

        {renderSection(
          'warning-outline',
          'Friction Points',
          reportData.report.frictionPoints,
          '#E74C3C'
        )}

        {renderSection(
          'people-outline',
          'Decision Rights Clarifier',
          reportData.report.decisionRights,
          '#F39C12'
        )}

        {renderSection(
          'close-circle-outline',
          'Stop-Doing List',
          reportData.report.stopDoing,
          '#95A5A6'
        )}

        {renderSection(
          'rocket-outline',
          'Next 7-Day Experiment',
          reportData.report.next7DayExperiment,
          '#27AE60'
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {reportData.pdfUrl && (
            <TouchableOpacity style={styles.pdfButton} onPress={handleDownloadPdf}>
              <Ionicons name="download-outline" size={22} color="#3498DB" />
              <Text style={styles.pdfButtonText}>Download PDF</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.newButton}
            onPress={() => router.replace('/')}
          >
            <Ionicons name="home-outline" size={22} color="#2C3E50" />
            <Text style={styles.newButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#7F8C8D',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3498DB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  workflowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF5FB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 8,
  },
  workflowName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  companyName: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  metaBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  domainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4ECF7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  domainText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9B59B6',
  },
  diagnosisBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF2E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  diagnosisText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#E67E22',
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: '500',
  },
  whyDiagnosisContainer: {
    marginBottom: 16,
  },
  whyDiagnosisButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  whyDiagnosisText: {
    fontSize: 13,
    color: '#7F8C8D',
    textDecorationLine: 'underline',
  },
  whyDiagnosisPanel: {
    backgroundColor: '#FFF9E6',
    borderRadius: 10,
    padding: 14,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#F39C12',
  },
  whyDiagnosisExplanation: {
    fontSize: 14,
    color: '#5D6D7E',
    lineHeight: 22,
  },
  evidenceSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  evidenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  evidenceHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  evidenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  evidenceCount: {
    backgroundColor: '#3498DB',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  evidenceCountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  evidenceContent: {
    padding: 16,
  },
  evidenceItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  evidenceField: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7F8C8D',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  evidenceSnippet: {
    fontSize: 14,
    color: '#5D6D7E',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  metaInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: '#7F8C8D',
  },
  summarySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2C3E50',
  },
  summaryText: {
    fontSize: 15,
    color: '#5D6D7E',
    lineHeight: 24,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderLeftWidth: 4,
    backgroundColor: '#FAFAFA',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  sectionContent: {
    padding: 16,
    paddingTop: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 7,
    marginRight: 12,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    color: '#5D6D7E',
    lineHeight: 22,
  },
  actionButtons: {
    marginTop: 8,
    gap: 12,
  },
  pdfButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 10,
    borderWidth: 2,
    borderColor: '#3498DB',
  },
  pdfButtonText: {
    color: '#3498DB',
    fontSize: 16,
    fontWeight: '600',
  },
  newButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  newButtonText: {
    color: '#2C3E50',
    fontSize: 16,
    fontWeight: '600',
  },
});
