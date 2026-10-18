import React from 'react';
import { IncidentReport } from '../types';
import { HOOK31_LOGO_URL } from '../data/initialData';

interface PrintRunSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: IncidentReport;
}

export const PrintRunSheetModal: React.FC<PrintRunSheetModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-[#1c1b1b] border border-[#2e2423] rounded-xl shadow-2xl flex flex-col max-h-[90vh] my-auto">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-[#211f1f] border-b border-[#2e2423] flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[22px]">
              description
            </span>
            <span className="font-headline-md text-base text-[#e6e1e1] font-bold">
              ตัวอย่างแบบฟอร์มพิมพ์ใบรายงาน EMS (Run Sheet)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg bg-[#4cd7f6] hover:bg-[#38bdf8] text-[#003640] font-headline-md text-sm font-bold flex items-center gap-1.5 transition-colors shadow"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>สั่งพิมพ์ทันที</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#e4beba] hover:text-white hover:bg-[#2b2a29]"
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>
        </div>

        {/* Printable Paper Area (Styled as white medical sheet) */}
        <div className="p-6 overflow-y-auto bg-neutral-900 flex justify-center">
          <div className="w-full max-w-2xl bg-white text-slate-900 p-8 rounded shadow-lg border border-slate-300 font-sans print-area">
            {/* Sheet Header */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={HOOK31_LOGO_URL}
                  alt="Hook 31"
                  className="w-14 h-14 object-contain"
                />
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-slate-900 uppercase">
                    มูลนิธิพุทธธรรม 31 นครราชสีมา (ฮุก 31)
                  </h2>
                  <p className="text-xs font-semibold text-slate-700">
                    หน่วยกู้ชีพ-กู้ภัย จุดบริการประชาชน สภ.โพธิ์กลาง | ศูนย์วิทยุ นครราชสีมา
                  </p>
                  <p className="text-[11px] text-slate-500">
                    ใบรายงานการปฏิบัติการแพทย์ฉุกเฉินเบื้องต้น (EMS FIELD RUN SHEET)
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-block bg-slate-900 text-white font-mono font-bold px-2 py-0.5 text-xs rounded">
                  {report.caseId || 'เคสที่ -'}
                </div>
                <div className="text-xs text-slate-600 mt-1 font-mono">
                  วันที่: {report.dateStr}
                </div>
                <div className="text-xs text-slate-600 font-mono">
                  เวลา ว.4: {report.timestamp}
                </div>
              </div>
            </div>

            {/* Field Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs mb-4">
              <div className="border border-slate-300 p-2.5 rounded">
                <span className="font-bold text-slate-600 block text-[10px] uppercase">
                  จุดตรวจการณ์ / รถพยาบาล
                </span>
                <span className="font-semibold text-slate-900">
                  {report.station} | {report.unit}
                </span>
              </div>
              <div className="border border-slate-300 p-2.5 rounded">
                <span className="font-bold text-slate-600 block text-[10px] uppercase">
                  กำลังพลปฏิบัติหน้าที่ ว.4
                </span>
                <span className="font-semibold text-slate-900">
                  {report.crew || '-'}
                </span>
              </div>
            </div>

            {/* Incident Details */}
            <div className="border border-slate-300 p-3 rounded text-xs space-y-2 mb-4">
              <div>
                <span className="font-bold text-slate-700">อาการเบื้องต้นที่รับแจ้ง: </span>
                <span className="font-semibold text-red-600">{report.symptoms}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">สถานที่เกิดเหตุ / จุดอ้างอิง: </span>
                <span>{report.location}</span>
              </div>
            </div>

            {/* Patient Profile */}
            <div className="border border-slate-300 p-3 rounded text-xs space-y-2 mb-4">
              <div className="font-bold text-slate-800 border-b border-slate-200 pb-1">
                ข้อมูลผู้บาดเจ็บ / ผู้ป่วย
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-slate-500">เพศ/จำนวน: </span>
                  <span className="font-medium">{report.genderCount || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500">ชื่อ-สกุล: </span>
                  <span className="font-bold text-slate-900">{report.patientName || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500">อายุ: </span>
                  <span className="font-medium">{report.patientAge || '-'}</span>
                </div>
              </div>
              <div>
                <span className="text-slate-500">ที่อยู่: </span>
                <span>{report.patientAddress || '-'}</span>
              </div>
            </div>

            {/* Vitals Matrix */}
            <div className="border border-slate-300 p-3 rounded text-xs mb-4">
              <div className="font-bold text-slate-800 mb-2 border-b border-slate-200 pb-1">
                สัญญาณชีพแรกรับ (INITIAL VITAL SIGNS)
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-slate-100 p-2 rounded">
                  <div className="text-[10px] text-slate-500 font-bold">BP (ความดัน)</div>
                  <div className="font-mono font-bold text-sm text-slate-900">
                    {report.vitals.bp || '-'}
                  </div>
                  <div className="text-[9px] text-slate-400">mmHg</div>
                </div>
                <div className="bg-slate-100 p-2 rounded">
                  <div className="text-[10px] text-slate-500 font-bold">PR (ชีพจร)</div>
                  <div className="font-mono font-bold text-sm text-slate-900">
                    {report.vitals.pr || '-'}
                  </div>
                  <div className="text-[9px] text-slate-400">bpm</div>
                </div>
                <div className="bg-slate-100 p-2 rounded">
                  <div className="text-[10px] text-slate-500 font-bold">SpO2 (ออกซิเจน)</div>
                  <div className="font-mono font-bold text-sm text-slate-900">
                    {report.vitals.spo2 || '-'}%
                  </div>
                  <div className="text-[9px] text-slate-400">in room air</div>
                </div>
                <div className="bg-slate-100 p-2 rounded">
                  <div className="text-[10px] text-slate-500 font-bold">Temp (อุณหภูมิ)</div>
                  <div className="font-mono font-bold text-sm text-slate-900">
                    {report.vitals.temp || '-'}
                  </div>
                  <div className="text-[9px] text-slate-400">°C</div>
                </div>
              </div>
            </div>

            {/* Treatment Notes & Destination */}
            <div className="border border-slate-300 p-3 rounded text-xs space-y-2 mb-6">
              <div>
                <span className="font-bold text-slate-700">การปฐมพยาบาล / การดูแล ณ จุดเกิดเหตุ: </span>
                <p className="mt-1 text-slate-800 leading-relaxed bg-slate-50 p-2 rounded border border-slate-200">
                  {report.notes || 'ให้การช่วยเหลือปฐมพยาบาลเบื้องต้น นำส่ง รพ.'}
                </p>
              </div>
              <div className="pt-1">
                <span className="font-bold text-slate-700">โรงพยาบาลปลายทาง: </span>
                <span className="font-bold text-blue-700">{report.hospital}</span>
              </div>
            </div>

            {/* Signature Area */}
            <div className="grid grid-cols-2 gap-8 text-xs pt-4 border-t border-slate-300">
              <div className="text-center space-y-1">
                <div className="h-10 border-b border-dashed border-slate-400"></div>
                <div className="text-slate-600">ลงชื่อ ผู้รายงาน / หัวหน้าชุดปฏิบัติการ</div>
                <div className="text-[10px] font-mono text-slate-400">({report.crew.split(',')[0] || 'เจ้าหน้าที่ ว.4'})</div>
              </div>
              <div className="text-center space-y-1">
                <div className="h-10 border-b border-dashed border-slate-400"></div>
                <div className="text-slate-600">ลงชื่อ พยาบาล / แพทย์ผู้รับผู้ป่วย</div>
                <div className="text-[10px] font-mono text-slate-400">ห้องอุบัติเหตุ-ฉุกเฉิน (ER)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
