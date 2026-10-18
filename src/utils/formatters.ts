import { IncidentReport } from '../types';

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
  return `${h}:${m}:${s} UTC+7`;
}

export function generateLineReport(data: Partial<IncidentReport>): string {
  const station = data.station?.trim() || 'จุด ว.8 ฮุก 31 จุดข้าง สภ.โพธิ์กลาง';
  const caseId = data.caseId?.trim() || '-';
  const timestamp = data.timestamp?.trim() || getLiveTimeString();
  const dateStr = data.dateStr?.trim() || getTodayThaiDate();
  const unit = data.unit?.trim() || '-';
  const symptoms = data.symptoms?.trim() || '-';
  const location = data.location?.trim() || '-';

  const genderCount = data.genderCount?.trim() || '';
  const patientName = data.patientName?.trim() || '';
  const patientAge = data.patientAge?.trim() || '';

  let patientLine = '-';
  if (genderCount || patientName || patientAge) {
    const parts: string[] = [];
    if (genderCount) parts.push(genderCount);
    if (patientName) parts.push(`ชื่อ ${patientName}`);
    if (patientAge) parts.push(`อายุ ${patientAge}`);
    patientLine = parts.join(' ');
  }

  const address = data.patientAddress?.trim() || '-';

  const bp = data.vitals?.bp?.trim() || '-';
  const pr = data.vitals?.pr?.trim() || '-';
  const spo2 = data.vitals?.spo2?.trim() || '-';
  const temp = data.vitals?.temp?.trim();
  const gcs = data.vitals?.gcs?.trim();
  const dtx = data.vitals?.dtx?.trim();

  let vitalsLine = `BP ${bp} | PR ${pr} | SpO2 ${spo2}%`;
  if (temp) {
    vitalsLine += ` | Temp ${temp}°C`;
  }
  if (gcs) {
    vitalsLine += ` | GCS ${gcs}`;
  }
  if (dtx) {
    vitalsLine += ` | DTX ${dtx}`;
  }

  const hospital = data.hospital?.trim() || '-';
  const crew = data.crew?.trim() || '-';
  const notes = data.notes?.trim();

  let output = `🚒 รายงาน ว.8 ฮุก 31 นครราชสีมา
📍 ${station}
📅 ประจำวันที่: ${dateStr} | เวลา: ${timestamp}
🔢 ลำดับเคส: ${caseId}
🚑 รถพยาบาล: ${unit}
⚠️ อาการ: ${symptoms}
📌 สถานที่: ${location}
👤 ผู้ป่วย: ${patientLine}
🏠 ที่อยู่: ${address}
🩺 Vital Signs: ${vitalsLine}
🏥 นำส่ง: ${hospital}
👨‍🚒 กำลังพล ว.4: ${crew}`;

  if (notes) {
    output += `\n📝 หมายเหตุ: ${notes}`;
  }

  return output;
}
