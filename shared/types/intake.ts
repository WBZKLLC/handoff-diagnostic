// Intake Form Types
export interface IntakeData {
  companyName: string;
  workflowName: string;
  workflowDescription: string;
  rolesInvolved: string;
  toolsUsed: string;
  whereItGetsStuck: string;
  desiredOutcome: string;
  urgencyLevel: 'Low' | 'Medium' | 'High';
  contactEmail?: string;
}

export interface IntakeFormErrors {
  [key: string]: string;
}

export const URGENCY_OPTIONS: IntakeData['urgencyLevel'][] = ['Low', 'Medium', 'High'];

export const REQUIRED_INTAKE_FIELDS: (keyof IntakeData)[] = [
  'companyName',
  'workflowName',
  'workflowDescription',
  'rolesInvolved',
  'toolsUsed',
  'whereItGetsStuck',
  'desiredOutcome',
];
