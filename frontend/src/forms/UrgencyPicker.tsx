// Urgency Level Picker Component
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { URGENCY_OPTIONS, IntakeData } from '../../../../shared/types';

interface UrgencyPickerProps {
  value: IntakeData['urgencyLevel'];
  onChange: (value: IntakeData['urgencyLevel']) => void;
}

export const UrgencyPicker: React.FC<UrgencyPickerProps> = ({
  value,
  onChange,
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>
      Urgency Level<Text style={styles.required}> *</Text>
    </Text>
    <View style={styles.urgencyContainer}>
      {URGENCY_OPTIONS.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.urgencyButton,
            value === option && styles.urgencyButtonActive,
          ]}
          onPress={() => onChange(option)}
        >
          <Text
            style={[
              styles.urgencyText,
              value === option && styles.urgencyTextActive,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  required: {
    color: '#E74C3C',
  },
  urgencyContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  urgencyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  urgencyButtonActive: {
    backgroundColor: '#3498DB',
    borderColor: '#3498DB',
  },
  urgencyText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  urgencyTextActive: {
    color: '#FFFFFF',
  },
});
