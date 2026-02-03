import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface ReportContent {
  summary: string;
  handoffMap: string[];
  frictionPoints: string[];
  decisionRights: string[];
  stopDoing: string[];
  next7DayExperiment: string[];
}

interface ReportData {
  reportId: string;
  createdAt: string;
  report: ReportContent;
  pdfUrl: string | null;
}

export default function ReportScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const reportData: ReportData = params.reportData
    ? JSON.parse(params.reportData as string)
    : null;
  const intakeData = params.intakeData
    ? JSON.parse(params.intakeData as string)
    : null;

  if (!reportData || !intakeData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#E74C3C" />
          <Text style={styles.errorText}>No report data available</Text>
          <TouchableOpacity
            style={styles.backHomeButton}
            onPress={() => router.replace('/')}
          >
            <Text style={styles.backHomeText}>Go Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/reports/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportId: reportData.reportId,
          intake: intakeData,
          report: reportData.report,
          createdAt: reportData.createdAt,
          pdfUrl: reportData.pdfUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save report');
      }

      setSaved(true);
      Alert.alert('Success', 'Report saved successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save report');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPdf = () => {
    if (reportData.pdfUrl) {
      // Would open PDF in browser/viewer
      Alert.alert('PDF Download', 'PDF download will be available in Phase 2');
    }
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Diagnostic Report</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.workflowBadge}>
          <Ionicons name="business-outline" size={18} color="#3498DB" />
          <Text style={styles.workflowName}>{intakeData.workflowName}</Text>
          <Text style={styles.companyName}>at {intakeData.companyName}</Text>
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
          <TouchableOpacity
            style={[
              styles.saveButton,
              saved && styles.savedButton,
              saving && styles.buttonDisabled,
            ]}
            onPress={handleSave}
            disabled={saving || saved}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Ionicons
                  name={saved ? 'checkmark-circle' : 'save-outline'}
                  size={22}
                  color="#FFFFFF"
                />
                <Text style={styles.saveButtonText}>
                  {saved ? 'Saved' : 'Save Report'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {reportData.pdfUrl && (
            <TouchableOpacity
              style={styles.pdfButton}
              onPress={handleDownloadPdf}
            >
              <Ionicons name="download-outline" size={22} color="#3498DB" />
              <Text style={styles.pdfButtonText}>Download PDF</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.newButton}
            onPress={() => router.replace('/')}
          >
            <Ionicons name="add-circle-outline" size={22} color="#2C3E50" />
            <Text style={styles.newButtonText}>Start Another</Text>
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
  workflowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF5FB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 20,
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
  saveButton: {
    backgroundColor: '#27AE60',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 10,
  },
  savedButton: {
    backgroundColor: '#95A5A6',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: '#7F8C8D',
    marginTop: 16,
    marginBottom: 24,
  },
  backHomeButton: {
    backgroundColor: '#3498DB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backHomeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
