import React from 'react';
import { IncidentReport, SectionVisibility } from '../types';
import { HOOK31_LOGO_URL, RADIO_FREQUENCY } from '../data/initialData';

interface PrintRunSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: IncidentReport;
  visibility: SectionVisibility;
}

export const PrintRunSheetModal: React.FC<PrintRunSheetModalProps> = ({
  isOpen,
  onClose,
  report,
  visibility,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-[#1c1214] border border-[#3b1215] rounded-2xl shadow-2xl flex flex-col max-h-[92vh] my-auto overflow-hidden">
        {/* Modal Controls Header (Hidden during actual print) */}
        <div className="px-5 py-3.5 bg-[#251315] border-b border-[#3b1215] flex items-center justify-between no-print">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#ff5451] text-[24px]">
              print
            </span>
            <div>
              <span className="font-headline-md text-sm sm:text-base text-white font-bold block">
                พิมพ์ / ดาวน์โหลด PDF ใบรายงาน EMS (Run Sheet)
              </span>
              <span className="text-[11px] text-[#e4beba]">
                แบบฟอร์มมาตรฐานขนาด A4 รองรับภาษาไทย 100% (สามารถเลือกบันทึกเป็น PDF ได้)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-[#06C755] hover:bg-[#05b34c] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow"
              type="button"
            >
              <span className="material-symbols-outlined text-[17px]">print</span>
              <span>สั่งพิมพ์ / บันทึก PDF</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#2b2a29] text-[#e4beba] hover:text-white hover:bg-[#383635] flex items-center justify-center transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Printable Paper Area (Styled as clean white medical sheet) */}
        <div className="p-4 sm:p-6 overflow-y-auto bg-neutral-900 flex justify-center">
          <div className="w-full max-w-3xl bg-white text-slate-900 p-6 sm:p-8 rounded shadow-2xl border border-slate-300 font-sans print-area">
            {/* Sheet Header */}
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3 mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={HOOK31_LOGO_URL}
                  alt="Hook 31"
                  className="w-16 h-16 object-contain flex-shrink-0"
                />
                <div>
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 uppercase">
                    มูลนิธิพุทธธรรม 31 นครราชสีมา (ฮุก 31)
                  </h2>
                  <p className="text-xs font-semibold text-slate-700">
                    หน่วยกู้ชีพ-กู้ภัย • ศูนย์วิทยุสื่อสาร นครราชสีมา (ความถี่ {RADIO_FREQUENCY})
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    ใบรายงานการปฏิบัติการแพทย์ฉุกเฉินและกู้ภัยเบื้องต้น (EMS FIELD RUN SHEET)
                  </p>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                {visibility.caseId && report.caseId && (
                  <div className="inline-block bg-slate-900 text-white font-mono font-bold px-2 py-0.5 text-xs rounded mb-1">
                    {report.caseId}
                  </div>
                )}
                {visibility.dateTime && (
                  <>
                    <div className="text-xs text-slate-600 font-mono">
                      วันที่: {report.dateStr || '-'}
                    </div>
                    <div className="text-xs text-slate-600 font-mono">
                      เวลา ว.4: {report.timestamp || '-'}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Station and Unit info */}
            {(visibility.station || visibility.unit || visibility.crew) && (
              <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                <div className="border border-slate-300 p-2.5 rounded bg-slate-50">
                  <span className="font-bold text-slate-600 block text-[10px] uppercase">
                    จุดบริการ / รถพยาบาล
                  </span>
                  <span className="font-semibold text-slate-900">
                    {[
                      visibility.station && report.station,
                      visibility.unit && report.unit,
                    ]
                      .filter(Boolean)
                      .join(' | ') || '-'}
                  </span>
                </div>

                <div className="border border-slate-300 p-2.5 rounded bg-slate-50">
                  <span className="font-bold text-slate-600 block text-[10px] uppercase">
                    เจ้าหน้าที่ปฏิบัติหน้าที่ ว.4
                  </span>
                  <span className="font-semibold text-slate-900">
                    {visibility.crew ? report.crew || '-' : '-'}
                  </span>
                </div>
              </div>
            )}

            {/* Incident Details & Location */}
            {(visibility.symptoms || visibility.location) && (
              <div className="border border-slate-300 p-3 rounded text-xs space-y-2 mb-3 bg-white">
                {visibility.symptoms && (
                  <div>
                    <span className="font-bold text-slate-700">อาการ/เหตุการณ์ที่รับแจ้ง: </span>
                    <span className="font-semibold text-red-600">
                      {report.symptoms || 'ไม่ได้ระบุ'}
                    </span>
                  </div>
                )}
                {visibility.location && (
                  <div>
                    <span className="font-bold text-slate-700">สถานที่เกิดเหตุ / จุดอ้างอิง: </span>
                    <span className="text-slate-800">{report.location || 'ไม่ได้ระบุ'}</span>
                  </div>
                )}
              </div>
            )}

            {/* Vehicles Involved (Accident cases) */}
            {visibility.vehicles && report.vehicles && report.vehicles.length > 0 && (
              <div className="border border-slate-300 p-3 rounded text-xs space-y-2 mb-3 bg-slate-50">
                <div className="font-bold text-slate-800 border-b border-slate-200 pb-1 flex items-center justify-between">
                  <span>ข้อมูลยานพาหนะคู่กรณีที่เกิดเหตุ</span>
                  <span className="text-[11px] font-normal text-slate-500">
                    ({report.vehicles.length} คัน)
                  </span>
                </div>
                <div className="space-y-1.5 pt-1">
                  {report.vehicles.map((v, i) => (
                    <div
                      key={v.id || i}
                      className="p-2 rounded bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-1 text-[11px]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center">
                          {v.order || i + 1}
                        </span>
                        <span className="font-bold text-slate-900">
                          คันที่ {v.order || i + 1}:
                        </span>
                        <span>{v.type || 'ยานพาหนะ'}</span>
                        {v.brandModel && (
                          <span className="font-semibold text-slate-800">{v.brandModel}</span>
                        )}
                        {v.color && <span>({v.color})</span>}
                        {v.plateNumber && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 font-mono font-bold text-slate-900 border border-slate-300">
                            {v.plateNumber}
                          </span>
                        )}
                      </div>
                      {(v.driverName || v.damageDesc) && (
                        <div className="text-slate-600 text-[10px]">
                          {v.driverName && <span>ผู้ขับขี่: {v.driverName} </span>}
                          {v.damageDesc && <span>[{v.damageDesc}]</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Patient Profile */}
            {(visibility.patientInfo || visibility.patientAddress) && (
              <div className="border border-slate-300 p-3 rounded text-xs space-y-2 mb-3 bg-white">
                <div className="font-bold text-slate-800 border-b border-slate-200 pb-1">
                  ข้อมูลผู้บาดเจ็บ / ผู้ป่วย
                </div>
                {visibility.patientInfo && (
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-slate-500">เพศ/จำนวน: </span>
                      <span className="font-medium text-slate-900">
                        {report.genderCount || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">ชื่อ-สกุล: </span>
                      <span className="font-bold text-slate-900">{report.patientName || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">อายุ: </span>
                      <span className="font-medium text-slate-900">
                        {report.patientAge || '-'}
                      </span>
                    </div>
                  </div>
                )}
                {visibility.patientAddress && (
                  <div>
                    <span className="text-slate-500">ที่อยู่: </span>
                    <span className="text-slate-800">{report.patientAddress || '-'}</span>
                  </div>
                )}
              </div>
            )}

            {/* Vitals Signs */}
            {visibility.vitals && (
              <div className="border border-slate-300 p-3 rounded text-xs mb-3 bg-white">
                <div className="font-bold text-slate-800 mb-2 border-b border-slate-200 pb-1">
                  สัญญาณชีพแรกรับ (INITIAL VITAL SIGNS)
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-slate-50 border border-slate-200 p-2 rounded">
                    <div className="text-[10px] text-slate-500 font-bold">BP (ความดัน)</div>
                    <div className="font-mono font-bold text-sm text-slate-900">
                      {report.vitals?.bp || '-'}
                    </div>
                    <div className="text-[9px] text-slate-400">mmHg</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2 rounded">
                    <div className="text-[10px] text-slate-500 font-bold">PR (ชีพจร)</div>
                    <div className="font-mono font-bold text-sm text-slate-900">
                      {report.vitals?.pr || '-'}
                    </div>
                    <div className="text-[9px] text-slate-400">bpm</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2 rounded">
                    <div className="text-[10px] text-slate-500 font-bold">SpO2 (ออกซิเจน)</div>
                    <div className="font-mono font-bold text-sm text-slate-900">
                      {report.vitals?.spo2 || '-'}%
                    </div>
                    <div className="text-[9px] text-slate-400">room air</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2 rounded">
                    <div className="text-[10px] text-slate-500 font-bold">Temp (อุณหภูมิ)</div>
                    <div className="font-mono font-bold text-sm text-slate-900">
                      {report.vitals?.temp || '-'}
                    </div>
                    <div className="text-[9px] text-slate-400">°C</div>
                  </div>
                </div>

                {(report.vitals?.gcs || report.vitals?.dtx) && (
                  <div className="grid grid-cols-2 gap-2 mt-2 text-center">
                    {report.vitals?.gcs && (
                      <div className="bg-slate-50 p-1.5 rounded border border-slate-200 text-[11px]">
                        <span className="font-bold text-slate-600">GCS: </span>
                        <span className="font-mono font-bold text-slate-900">
                          {report.vitals.gcs}
                        </span>
                      </div>
                    )}
                    {report.vitals?.dtx && (
                      <div className="bg-slate-50 p-1.5 rounded border border-slate-200 text-[11px]">
                        <span className="font-bold text-slate-600">DTX: </span>
                        <span className="font-mono font-bold text-slate-900">
                          {report.vitals.dtx}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Destination, Police, Notes */}
            <div className="border border-slate-300 p-3 rounded text-xs space-y-2 mb-4 bg-white">
              {visibility.notes && (
                <div>
                  <span className="font-bold text-slate-700">
                    การปฐมพยาบาล / การดูแล ณ จุดเกิดเหตุ:
                  </span>
                  <p className="mt-1 text-slate-800 leading-relaxed bg-slate-50 p-2 rounded border border-slate-200">
                    {report.notes || 'ให้การช่วยเหลือปฐมพยาบาลเบื้องต้น นำส่ง รพ.'}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                {visibility.hospital && (
                  <div>
                    <span className="font-bold text-slate-700">โรงพยาบาลปลายทาง: </span>
                    <span className="font-bold text-blue-700">{report.hospital || '-'}</span>
                  </div>
                )}
                {(visibility.policeStation || visibility.officerName) && (
                  <div>
                    <span className="font-bold text-slate-700">ท้องที่ตำรวจ/ร้อยเวร: </span>
                    <span className="text-slate-800">
                      {[report.policeStation, report.officerName].filter(Boolean).join(' ') || '-'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Signature Area */}
            <div className="grid grid-cols-2 gap-8 text-xs pt-4 border-t-2 border-slate-300">
              <div className="text-center space-y-1">
                <div className="h-10 border-b border-dashed border-slate-400"></div>
                <div className="text-slate-700 font-semibold">ลงชื่อ ผู้รายงาน / หัวหน้าชุด ว.4</div>
                <div className="text-[10px] font-mono text-slate-500">
                  ({report.crew?.split(',')[0] || 'เจ้าหน้าที่ ว.4'})
                </div>
              </div>
              <div className="text-center space-y-1">
                <div className="h-10 border-b border-dashed border-slate-400"></div>
                <div className="text-slate-700 font-semibold">
                  ลงชื่อ พยาบาล / เจ้าหน้าที่ผู้รับผู้ป่วย
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  ห้องอุบัติเหตุ-ฉุกเฉิน (ER)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
