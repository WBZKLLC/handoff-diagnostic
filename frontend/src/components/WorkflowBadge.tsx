// Workflow Badge Component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WorkflowBadgeProps {
  workflowName: string;
  companyName: string;
}

export const WorkflowBadge: React.FC<WorkflowBadgeProps> = ({
  workflowName,
  companyName,
}) => (
  <View style={styles.workflowBadge}>
    <Ionicons name="business-outline" size={18} color="#3498DB" />
    <Text style={styles.workflowName}>{workflowName}</Text>
    <Text style={styles.companyName}>at {companyName}</Text>
  </View>
);

const styles = StyleSheet.create({
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
});
