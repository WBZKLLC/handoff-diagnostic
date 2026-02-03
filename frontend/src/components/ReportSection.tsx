// Reusable Report Section Component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ReportSectionProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  items: string[];
  color: string;
}

export const ReportSection: React.FC<ReportSectionProps> = ({
  icon,
  title,
  items,
  color,
}) => (
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

interface SummarySectionProps {
  summary: string;
}

export const SummarySection: React.FC<SummarySectionProps> = ({ summary }) => (
  <View style={styles.summarySection}>
    <View style={styles.summaryHeader}>
      <Ionicons name="document-text-outline" size={22} color="#3498DB" />
      <Text style={styles.summaryTitle}>Summary</Text>
    </View>
    <Text style={styles.summaryText}>{summary}</Text>
  </View>
);

const styles = StyleSheet.create({
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
});
