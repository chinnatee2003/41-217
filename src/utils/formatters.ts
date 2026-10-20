import { IncidentReport, SectionVisibility } from '../types';

export function getTodayThaiDate(): string {
  const now = new Date();
  const months = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];
  const thaiYear = now.getFullYear() + 543;
  return `${now.getDate()} ${months[now.getMonth()]} ${thaiYear}`;
}

export function getLiveTimeString(): string {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  return `${h}:${m} น.`;
}

export function getLiveClockString(): string {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s} น.`;
}

/**
 * Generates formatted text report for LINE sharing.
 * Strictly respects section visibility toggles and empty-field filtering.
 */
export function generateLineReport(
  data: Partial<IncidentReport>,
  visibility?: SectionVisibility,
  showUnspecified: boolean = false
): string {
  const lines: string[] = ['🚒 รายงาน ว.8 ฮุก 31 นครราชสีมา'];

  const shouldShow = (key: keyof SectionVisibility, value?: string | any[]): boolean => {
    // If visibility map provided and turned OFF, do not show
    if (visibility && visibility[key] === false) {
      return false;
    }
    // If empty
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return showUnspecified;
    }
    if (Array.isArray(value) && value.length === 0) {
      return false;
    }
    return true;
  };

  // 1. Station
  if (shouldShow('station', data.station)) {
    lines.push(`📍 ${data.station?.trim() || 'ไม่ได้ระบุจุดบริการ'}`);
  }

  // 2. Date & Time
  if (visibility?.dateTime !== false) {
    const d = data.dateStr?.trim();
    const t = data.timestamp?.trim();
    if (d || t) {
      const parts: string[] = [];
      if (d) parts.push(`ประจำวันที่: ${d}`);
      if (t) parts.push(`เวลา: ${t}`);
      lines.push(`📅 ${parts.join(' | ')}`);
    } else if (showUnspecified) {
      lines.push('📅 วันที่/เวลา: ไม่ได้ระบุ');
    }
  }

  // 3. Case ID
  if (shouldShow('caseId', data.caseId)) {
    lines.push(`🔢 ลำดับเคส: ${data.caseId?.trim() || 'ไม่ได้ระบุ'}`);
  }

  // 4. Ambulance Unit
  if (shouldShow('unit', data.unit)) {
    lines.push(`🚑 รถพยาบาล/กู้ชีพ: ${data.unit?.trim() || 'ไม่ได้ระบุ'}`);
  }

  // 5. Incident Type & Symptoms
  if (shouldShow('symptoms', data.symptoms)) {
    lines.push(`⚠️ อาการ/เหตุการณ์: ${data.symptoms?.trim() || 'ไม่ได้ระบุ'}`);
  }

  // 6. Location
  if (shouldShow('location', data.location)) {
    lines.push(`📌 สถานที่เกิดเหตุ: ${data.location?.trim() || 'ไม่ได้ระบุ'}`);
  }

  // 7. Vehicles Involved (for accidents)
  if (visibility?.vehicles !== false && data.vehicles && data.vehicles.length > 0) {
    lines.push('🚗 ข้อมูลยานพาหนะที่เกิดเหตุ:');
    data.vehicles.forEach((veh, idx) => {
      const parts: string[] = [];
      if (veh.type) parts.push(veh.type);
      if (veh.brandModel) parts.push(veh.brandModel);
      if (veh.color) parts.push(veh.color);
      if (veh.plateNumber) parts.push(`ทะเบียน ${veh.plateNumber}`);
      if (veh.driverName) parts.push(`ผู้ขับขี่: ${veh.driverName}`);
      if (veh.damageDesc) parts.push(`(${veh.damageDesc})`);

      lines.push(`   • คันที่ ${veh.order || idx + 1}: ${parts.join(' ') || 'ไม่มีรายละเอียด'}`);
    });
  }

  // 8. Patient Details
  if (visibility?.patientInfo !== false) {
    const gc = data.genderCount?.trim();
    const name = data.patientName?.trim();
    const age = data.patientAge?.trim();

    if (gc || name || age) {
      const parts: string[] = [];
      if (gc) parts.push(gc);
      if (name) parts.push(`ชื่อ ${name}`);
      if (age) parts.push(`อายุ ${age}`);
      lines.push(`👤 ข้อมูลผู้ป่วย: ${parts.join(' ')}`);
    } else if (showUnspecified) {
      lines.push('👤 ข้อมูลผู้ป่วย: ไม่ได้ระบุ');
    }
  }

  // 9. Patient Address
  if (shouldShow('patientAddress', data.patientAddress)) {
    lines.push(`🏠 ที่อยู่: ${data.patientAddress?.trim() || 'ไม่ได้ระบุ'}`);
  }

  // 10. Vital Signs
  if (visibility?.vitals !== false) {
    const v = data.vitals;
    if (v && (v.bp?.trim() || v.pr?.trim() || v.spo2?.trim() || v.temp?.trim() || v.gcs?.trim() || v.dtx?.trim())) {
      const vParts: string[] = [];
      if (v.bp?.trim()) vParts.push(`BP ${v.bp.trim()}`);
      if (v.pr?.trim()) vParts.push(`PR ${v.pr.trim()} bpm`);
      if (v.spo2?.trim()) vParts.push(`SpO2 ${v.spo2.trim()}%`);
      if (v.temp?.trim()) vParts.push(`Temp ${v.temp.trim()}°C`);
      if (v.gcs?.trim()) vParts.push(`GCS ${v.gcs.trim()}`);
      if (v.dtx?.trim()) vParts.push(`DTX ${v.dtx.trim()}`);
      lines.push(`🩺 สัญญาณชีพ: ${vParts.join(' | ')}`);
    } else if (showUnspecified) {
      lines.push('🩺 สัญญาณชีพ: ไม่ได้ระบุ');
    }
  }

  // 11. Destination Hospital
  if (shouldShow('hospital', data.hospital)) {
    lines.push(`🏥 โรงพยาบาลปลายทาง: ${data.hospital?.trim() || 'ไม่ได้ระบุ'}`);
  }

  // 12. Police Station & Officer
  if (visibility?.policeStation !== false || visibility?.officerName !== false) {
    const ps = data.policeStation?.trim();
    const off = data.officerName?.trim();
    if (ps || off) {
      const parts: string[] = [];
      if (ps && visibility?.policeStation !== false) parts.push(`สภ. ${ps}`);
      if (off && visibility?.officerName !== false) parts.push(`ร้อยเวร: ${off}`);
      lines.push(`👮 ท้องที่ตำรวจ: ${parts.join(' | ')}`);
    }
  }

  // 13. Responders / Crew
  if (shouldShow('crew', data.crew)) {
    lines.push(`👨‍🚒 เจ้าหน้าที่ปฏิบัติการ ว.4: ${data.crew?.trim() || 'ไม่ได้ระบุ'}`);
  }

  // 14. Additional Notes
  if (shouldShow('notes', data.notes)) {
    lines.push(`📝 รายละเอียด/การปฐมพยาบาล: ${data.notes?.trim() || 'ไม่ได้ระบุ'}`);
  }

  return lines.join('\n');
}
