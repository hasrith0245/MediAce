export interface Symptom {
  code: string;
  name: string;
  category: string;
}

// FIX: Added SymptomSelection type, which extends Symptom with severity and duration, for use in the detailed symptom form.
export interface SymptomSelection extends Symptom {
  severity: number;
  duration: string;
}

// Represents the simplified patient context for the triage form
export interface Patient {
  age: number;
  gender: 'male' | 'female' | 'other';
  allergies: string;
  medical_history: string;
}

export interface ConditionResult {
  condition_id: string;
  name: string;
  confidence: number;
}

export interface TriageResult {
  triage_id: string;
  report_id: string;
  top_conditions: ConditionResult[];
  severity_level: 'mild' | 'moderate' | 'severe';
  urgency: 'Routine' | 'Urgent' | 'Emergency';
  recommendations: string[];
  safety_flags: string[];
  confidence_level: 'Low' | 'Medium' | 'High';
}

export enum DiagnosisView {
  WIZARD,
  RESULT,
  APPOINTMENT,
  SAVE_RECORD,
}

export interface ConditionKnowledge {
  condition_id: string;
  name: string;
  category: string;
  symptoms: { code: string; weight: number }[];
  severity_level: string;
  recommendations: string[];
  emergency_triggers: string[];
}

// Represents a full, persistent patient record
export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email: string;
  allergies: string;
  conditions: string;
  treatments: string;
  currentSymptoms: string;
  reports: File[];
  lastVisit: string;
}

// MediScan specific types
export interface MatchingMedication {
    name: string;
    dosage: string;
    instructions: string;
    notes: string;
}

export interface UnprescribedMedication {
    identifiedName: string;
    notes: string;
}

export interface MediScanResult {
    matchingMedications: MatchingMedication[];
    unprescribedMedications: UnprescribedMedication[];
    missingMedications: string[];
    summary: string;
}

export interface MedicationImage {
    id: string;
    dataUrl: string;
}

export interface Appointment {
  id: string;
  type: 'teleconsult' | 'clinic';
  date: string;
  time: string;
  reportName?: string;
}

export interface ClinicResult {
  id: number;
  name: string;
  lat: number;
  lon: number;
  distance: number;
}