export type ThemeMode = 'red' | 'navy' | 'day' | 'contrast';

export type TabType = 'report' | 'stats' | 'pwa' | 'preview';

export interface VitalSigns {
  bp: string;      // e.g. "124/82"
  pr: string;      // e.g. "88"
  spo2: string;    // e.g. "97"
  temp: string;    // e.g. "38.2"
  gcs?: string;    // e.g. "E4V5M6 (15)"
  dtx?: string;    // e.g. "110 mg/dL"
}

export interface VehicleInfo {
  id: string;
  order: number;       // 1, 2, 3...
  type: string;        // เช่น รถจักรยานยนต์, รถยนต์เก๋ง, รถกระบะ, รถบรรทุก, จักรยาน, รถตู้, อื่นๆ
  brandModel: string;  // เช่น Honda Wave, Toyota Hilux Revo
  color: string;       // เช่น สีดำ-แดง, สีขาว, สีบรอนซ์เงิน
  plateNumber: string; // เช่น 1กข 1234 นครราชสีมา
  driverName?: string; // ผู้ขับขี่ / ผู้บาดเจ็บ
  damageDesc?: string; // ความเสียหายเบื้องต้น
}

export interface SectionVisibility {
  station: boolean;        // จุดบริการ
  dateTime: boolean;       // วันและเวลา
  caseId: boolean;         // เลขเคส
  unit: boolean;           // รถพยาบาล
  incidentType: boolean;   // ประเภทเหตุการณ์
  symptoms: boolean;       // ข้อมูลเหตุการณ์ / อาการ
  location: boolean;       // สถานที่เกิดเหตุ
  patientInfo: boolean;    // ข้อมูลผู้ป่วย (เพศ/จำนวน, ชื่อ, อายุ)
  patientAddress: boolean; // ที่อยู่ผู้ป่วย
  vitals: boolean;         // Vital Signs
  hospital: boolean;       // โรงพยาบาลปลายทาง
  policeStation: boolean;  // สถานีตำรวจ
  officerName: boolean;    // ร้อยเวร
  crew: boolean;           // เจ้าหน้าที่
  vehicles: boolean;       // รายละเอียดอุบัติเหตุทางรถ (ข้อมูลรถ คันที่ 1, 2, 3...)
  notes: boolean;          // รายละเอียดเพิ่มเติม / การปฐมพยาบาล
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
  policeStation: string;
  officerName: string;
  crew: string;
  vehicles: VehicleInfo[];
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
