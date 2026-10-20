import { IncidentReport, SectionVisibility, QuickTopic } from '../types';

export const RADIO_FREQUENCY = '173.475 MHz';
export const FOUNDATION_NAME = 'มูลนิธิพุทธธรรม 31 นครราชสีมา (ฮุก 31)';
export const HOOK31_LOGO_URL = '/hook31_logo.svg';

// Strict Rule: When opening the app for the first time, it MUST be an empty blank form.
// No mock patient names, no mock case ID, no pre-filled timestamp or symptoms.
export const INITIAL_EMPTY_REPORT: IncidentReport = {
  id: '',
  station: 'จุดข้าง สภ.โพธิ์กลาง ฮุก 31',
  caseId: '',
  timestamp: '',
  dateStr: '',
  unit: '',
  symptoms: '',
  incidentType: 'accident',
  location: '',
  genderCount: '',
  patientName: '',
  patientAge: '',
  patientAddress: '',
  vitals: {
    bp: '',
    pr: '',
    spo2: '',
    temp: '',
    gcs: '',
    dtx: '',
  },
  hospital: '',
  policeStation: '',
  officerName: '',
  crew: '',
  vehicles: [],
  notes: '',
  createdAt: 0,
};

// Strict Rule: No sample reports in history initially
export const SAMPLE_CASES: IncidentReport[] = [];

// Default visibility configuration: all sections enabled by default
export const DEFAULT_VISIBILITY: SectionVisibility = {
  station: true,
  dateTime: true,
  caseId: true,
  unit: true,
  incidentType: true,
  symptoms: true,
  location: true,
  patientInfo: true,
  patientAddress: true,
  vitals: true,
  hospital: true,
  policeStation: true,
  officerName: true,
  crew: true,
  vehicles: true,
  notes: true,
};

export const HOSPITALS_KORAT = [
  'รพ.เทพรัตน์นครราชสีมา',
  'รพ.มหาราชนครราชสีมา',
  'รพ.ค่ายสุรนารี',
  'รพ.มหาวิทยาลัยเทคโนโลยีสุรนารี (มทส.)',
  'รพ.กรุงเทพราชสีมา',
  'รพ.เซนต์แมรี่',
  'รพ.ป.แพทย์ 1',
  'รพ.ป.แพทย์ 2',
  'ไม่ประสงค์ไป รพ. (เซ็นปฏิเสธการรักษา/ไม่ประสงค์ ว.25)',
];

export const SERVICE_STATIONS = [
  'จุดข้าง สภ.โพธิ์กลาง ฮุก 31',
  'จุดศูนย์วิทยุ ฮุก 31 นครราชสีมา',
  'จุดบริการ จอหอ ฮุก 31',
  'จุดบริการ หัวทะเล ฮุก 31',
  'จุดบริการ สุรนารี/เซฟวัน ฮุก 31',
  'จุดบริการ ตลาดแค ฮุก 31',
  'จุดบริการ ปักธงชัย ฮุก 31',
  'จุดบริการ โชคชัย ฮุก 31',
  'จุดบริการ สีคิ้ว ฮุก 31',
  'จุดบริการ พิมาย ฮุก 31',
];

export const AMBULANCE_UNITS = [
  'รถพยาบาลคันที่ 11',
  'รถพยาบาลคันที่ 05',
  'รถพยาบาลคันที่ 18',
  'รถพยาบาลคันที่ 22',
  'รถพยาบาลคันที่ 34',
  'รถกู้ชีพ คันที่ 01',
  'รถอุปกรณ์/ตัดถ่าง 01',
  'รถตรวจการณ์ ฮุก 31',
];

export const POLICE_STATIONS = [
  'สภ.โพธิ์กลาง',
  'สภ.เมืองนครราชสีมา',
  'สภ.จอหอ',
  'สภ.ปักธงชัย',
  'สภ.โชคชัย',
  'สภ.สูงเนิน',
  'สภ.ขามทะเลสอ',
];

export const VEHICLE_TYPES = [
  'รถจักรยานยนต์ (จยย.)',
  'รถยนต์เก๋ง',
  'รถกระบะ / ปิคอัพ',
  'รถบรรทุก 6-10 ล้อ',
  'รถบรรทุกพ่วง / เทรลเลอร์',
  'รถตู้โดยสาร',
  'รถโดยสารประจำทาง',
  'รถจักรยาน',
  'รถซาเล้ง / พ่วงข้าง',
  'อื่นๆ',
];

export const PRESET_TOPICS: QuickTopic[] = [
  {
    id: 't-acc-moto-slip',
    category: 'accident',
    title: 'จยย. ล้มเอง',
    badge: 'ว.40',
    symptoms: 'ว.40 รถจักรยานยนต์ล้มเอง มีแผลถลอกตามร่างกาย รู้สึกตัวดี',
    incidentType: 'accident',
  },
  {
    id: 't-acc-car-crash',
    category: 'accident',
    title: 'จยย. ชน รถเก๋ง/กระบะ',
    badge: 'ว.40',
    symptoms: 'ว.40 รถจักรยานยนต์เฉี่ยวชนกับรถยนต์ มีผู้ได้รับบาดเจ็บ ปวดเจ็บสะโพกและแขนขา',
    incidentType: 'accident',
  },
  {
    id: 't-acc-car-car',
    category: 'accident',
    title: 'รถยนต์ ชนท้าย/ประสานงา',
    badge: 'ว.40',
    symptoms: 'ว.40 รถยนต์ชนท้าย กีดขวางการจราจร มีผู้บาดเจ็บแน่นหน้าอก',
    incidentType: 'accident',
  },
  {
    id: 't-acc-pedestrian',
    category: 'accident',
    title: 'รถชนคนเดินเท้า',
    badge: 'ว.40',
    symptoms: 'ว.40 รถเฉี่ยวชนคนข้ามถนน มีแผลฉีกขาด ศีรษะแตก',
    incidentType: 'accident',
  },
  {
    id: 't-cpr-arrest',
    category: 'cpr',
    title: 'วิกฤต CPR หมดสติ',
    badge: 'ฉุกเฉินแดง',
    symptoms: '🚨 วิกฤต หมดสติ ปลุกไม่ตื่น ไม่หายใจ คลำชีพจรไม่พบ (Cardiac Arrest)',
    incidentType: 'cpr',
  },
  {
    id: 't-ill-fever',
    category: 'illness',
    title: 'ไข้สูง หนาวสั่น',
    badge: 'ผู้ป่วย',
    symptoms: 'มีอาการ ไข้สูง หนาวสั่น อ่อนเพลีย รับประทานอาหารไม่ได้',
    incidentType: 'illness',
  },
  {
    id: 't-ill-dyspnea',
    category: 'illness',
    title: 'เหนื่อยหอบ หายใจลำบาก',
    badge: 'ผู้ป่วย',
    symptoms: 'มีอาการ หายใจเหนื่อยหอบ แน่นหน้าอก หายใจมีเสียงหวีด',
    incidentType: 'illness',
  },
  {
    id: 't-ill-syncope',
    category: 'illness',
    title: 'วูบหมดสติ ชั่วขณะ',
    badge: 'ผู้ป่วย',
    symptoms: 'มีอาการ วูบเป็นลมหมดสติชั่วขณะ หน้ามืด เหงื่อแตก รู้สึกตัวดีแล้ว',
    incidentType: 'illness',
  },
  {
    id: 't-ill-stroke',
    category: 'illness',
    title: 'สงสัย Stroke แขนขาอ่อนแรง',
    badge: 'Fast Track',
    symptoms: 'มีอาการ ปากเบี้ยว พูดไม่ชัด แขนขาซีกหนึ่งอ่อนแรง (สงสัย Stroke)',
    incidentType: 'illness',
  },
  {
    id: 't-res-snake',
    category: 'rescue',
    title: 'จับสัตว์เลื้อยคลาน / งูเข้าบ้าน',
    badge: 'กู้ภัย',
    symptoms: 'ขอความช่วยเหลือจับงูเข้าบ้านเรือนประชาชน ดำเนินการจับและนำไปปล่อยคืนสู่ธรรมชาติ',
    incidentType: 'other',
  },
];

export const APP_LEGAL_DISCLAIMER =
  'การใช้งานแอปไม่มีค่า API หรือค่าฐานข้อมูล ทำงานภายในเบราว์เซอร์ 100% ไม่ส่งข้อมูลผู้ป่วยไปยังเซิร์ฟเวอร์ภายนอก แต่การเผยแพร่เว็บบนอินเทอร์เน็ตอาจขึ้นอยู่กับบริการ Hosting ที่เลือก และต้องตรวจสอบเงื่อนไขของบริการนั้น ห้ามรับประกันว่าบริการภายนอกทุกชนิดฟรีตลอดไป';
