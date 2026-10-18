export type ThemeMode = 'red' | 'day' | 'hq' | 'contrast';

export type TabType = 'report' | 'stats' | 'pwa' | 'share';

export interface VitalSigns {
  bp: string;      // e.g. "124/82"
  pr: string;      // e.g. "88"
  spo2: string;    // e.g. "97"
  temp: string;    // e.g. "38.2"
  gcs?: string;    // e.g. "E4V5M6 (15)"
  dtx?: string;    // e.g. "110 mg/dL"
}


export interface QuickTopic {
  id: string;
  category: 'accident' | 'illness' | 'cpr' | 'rescue' | 'custom';
  title: string;
  badge?: string;
  symptoms: string;
  locationHint?: string;
  incidentType: 'accident' | 'illness' | 'cpr' | 'other';
  unit?: string;
  hospital?: string;
  isCustom?: boolean;
}

export interface IncidentReport {
  id: string;
  station: string;
  caseId: string;
  timestamp: string;
  dateStr: string;
  unit: string;
  symptoms: string;
  incidentType: 'illness' | 'accident' | 'cpr' | 'other';
  location: string;
  genderCount: string;
  patientName: string;
  patientAge: string;
  patientAddress: string;
  vitals: VitalSigns;
  hospital: string;
  crew: string;
  notes: string;
  createdAt: number;
}

export interface ShiftStats {
  total: number;
  illness: number;
  accident: number;
  cpr: number;
  other: number;
}
