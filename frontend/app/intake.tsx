import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const URGENCY_OPTIONS = ['Low', 'Medium', 'High'];

const DOMAIN_OPTIONS = [
  { value: 'general', label: 'General' },
  { value: 'logistics', label: 'Logistics' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'saas', label: 'SaaS' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'public', label: 'Public Sector' },
  { value: 'other', label: 'Other' },
];

interface FormData {
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

interface FormErrors {
  [key: string]: string;
}

export default function IntakeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showDomainPicker, setShowDomainPicker] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    workflowName: '',
    workflowDescription: '',
    rolesInvolved: '',
    toolsUsed: '',
    whereItGetsStuck: '',
    desiredOutcome: '',
    urgencyLevel: 'Medium',
    domain: 'general',
    contactEmail: '',
  });

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const requiredFields: (keyof FormData)[] = [
      'companyName',
      'workflowName',
      'workflowDescription',
      'rolesInvolved',
      'toolsUsed',
      'whereItGetsStuck',
      'desiredOutcome',
      'domain',
    ];

    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = 'This field is required';
      }
    });

    if (formData.contactEmail && !formData.contactEmail.includes('@')) {
      newErrors.contactEmail = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/intake`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate report');
      }

      const result = await response.json();
      
      // Navigate to report screen with data
      router.push({
        pathname: '/report',
        params: {
          reportData: JSON.stringify(result),
          intakeData: JSON.stringify(formData),
        },
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const getDomainLabel = (value: string) => {
    return DOMAIN_OPTIONS.find(d => d.value === value)?.label || value;
  };

  const renderInput = (
    label: string,
    field: keyof FormData,
    placeholder: string,
    multiline = false,
    optional = false
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        {label}
        {!optional && <Text style={styles.required}> *</Text>}
      </Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          errors[field] ? styles.inputError : null,
        ]}
        placeholder={placeholder}
        placeholderTextColor="#95A5A6"
        value={formData[field]}
        onChangeText={(text) => updateField(field, text)}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
      {errors[field] ? (
        <Text style={styles.errorText}>{errors[field]}</Text>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#2C3E50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Workflow Intake</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Domain Picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Domain<Text style={styles.required}> *</Text>
            </Text>
            <TouchableOpacity
              style={[
                styles.pickerButton,
                errors.domain ? styles.inputError : null,
              ]}
              onPress={() => setShowDomainPicker(true)}
            >
              <Text style={styles.pickerButtonText}>
                {getDomainLabel(formData.domain)}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#7F8C8D" />
            </TouchableOpacity>
            {errors.domain ? (
              <Text style={styles.errorText}>{errors.domain}</Text>
            ) : null}
          </View>

          {renderInput('Company Name', 'companyName', 'Enter your company name')}
          {renderInput('Workflow Name', 'workflowName', 'e.g., Client Onboarding')}
          {renderInput(
            'Workflow Description',
            'workflowDescription',
            'Describe what this workflow does and its purpose...',
            true
          )}
          {renderInput(
            'Roles Involved',
            'rolesInvolved',
            'e.g., Sales Rep, Account Manager, Implementation Lead',
            true
          )}
          {renderInput(
            'Tools Used',
            'toolsUsed',
            'e.g., Salesforce, Slack, Notion, Google Sheets',
            true
          )}
          {renderInput(
            'Where It Gets Stuck',
            'whereItGetsStuck',
            'Describe where delays, confusion, or friction typically occur...',
            true
          )}
          {renderInput(
            'Desired Outcome',
            'desiredOutcome',
            'What would success look like? What do you want to achieve?',
            true
          )}

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
                    formData.urgencyLevel === option && styles.urgencyButtonActive,
                  ]}
                  onPress={() => updateField('urgencyLevel', option)}
                >
                  <Text
                    style={[
                      styles.urgencyText,
                      formData.urgencyLevel === option && styles.urgencyTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {renderInput(
            'Contact Email',
            'contactEmail',
            'your@email.com',
            false,
            true
          )}

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Ionicons name="analytics-outline" size={24} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Generate Report</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>

        {/* Domain Picker Modal */}
        <Modal
          visible={showDomainPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowDomainPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Domain</Text>
                <TouchableOpacity
                  onPress={() => setShowDomainPicker(false)}
                  style={styles.modalCloseButton}
                >
                  <Ionicons name="close" size={24} color="#2C3E50" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={DOMAIN_OPTIONS}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.domainOption,
                      formData.domain === item.value && styles.domainOptionActive,
                    ]}
                    onPress={() => {
                      updateField('domain', item.value);
                      setShowDomainPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.domainOptionText,
                        formData.domain === item.value && styles.domainOptionTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {formData.domain === item.value && (
                      <Ionicons name="checkmark" size={22} color="#3498DB" />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  flex: {
    flex: 1,
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
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2C3E50',
  },
  multilineInput: {
    minHeight: 100,
    paddingTop: 14,
  },
  inputError: {
    borderColor: '#E74C3C',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 13,
    marginTop: 4,
  },
  pickerButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#2C3E50',
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
  submitButton: {
    backgroundColor: '#27AE60',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 12,
    shadowColor: '#27AE60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    backgroundColor: '#95A5A6',
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  modalCloseButton: {
    padding: 4,
  },
  domainOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  domainOptionActive: {
    backgroundColor: '#EBF5FB',
  },
  domainOptionText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  domainOptionTextActive: {
    color: '#3498DB',
    fontWeight: '600',
  },
});
