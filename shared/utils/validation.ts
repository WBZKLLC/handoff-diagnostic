// Validation utilities
import { IntakeData, IntakeFormErrors, REQUIRED_INTAKE_FIELDS } from '../types/intake';

export const validateEmail = (email: string): boolean => {
  if (!email) return true; // Optional field
  return email.includes('@') && email.includes('.');
};

export const validateIntakeForm = (data: IntakeData): IntakeFormErrors => {
  const errors: IntakeFormErrors = {};

  REQUIRED_INTAKE_FIELDS.forEach((field) => {
    const value = data[field];
    if (!value || (typeof value === 'string' && !value.trim())) {
      errors[field] = 'This field is required';
    }
  });

  if (data.contactEmail && !validateEmail(data.contactEmail)) {
    errors.contactEmail = 'Please enter a valid email';
  }

  return errors;
};

export const hasErrors = (errors: IntakeFormErrors): boolean => {
  return Object.keys(errors).length > 0;
};
