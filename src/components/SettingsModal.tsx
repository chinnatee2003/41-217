import React, { useState } from 'react';
import { QuickTopic, SectionVisibility } from '../types';
import {
  SERVICE_STATIONS,
  AMBULANCE_UNITS,
  HOSPITALS_KORAT,
  RADIO_FREQUENCY,
  APP_LEGAL_DISCLAIMER,
} from '../data/initialData';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customTopics: QuickTopic[];
  onDeleteCustomTopic: (id: string) => void;
  onOpenAddTopicModal: () => void;
  visibility: SectionVisibility;
  onToggleVisibility: (key: keyof SectionVisibility) => void;
  onShowAllSections: () => void;
  onHideOptionalSections: () => void;
  onShowToast: (title: string, desc: string, icon?: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  customTopics,
  onDeleteCustomTopic,
  onOpenAddTopicModal,
  visibility,
  onToggleVisibility,
  onShowAllSections,
  onHideOptionalSections,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'visibility' | 'presets' | 'info'>('visibility');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#1c1214] border border-[#3b1215] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] my-auto overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#251315] border-b border-[#3b1215] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff5451] text-[22px]">
              settings
            </span>
            <div>
              <span className="font-headline-md text-base text-white font-bold block">
                ตั้งค่ารายการ & ข้อกำหนดระบบ
              </span>
              <span className="text-[11px] text-[#e4beba]">
                ปรับแต่งการแสดงผลหัวข้อ และข้อมูลประจำจุดบริการ
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#2b2a29] text-[#e4beba] hover:text-white hover:bg-[#383635] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#3b1215] bg-[#1a0f11] px-4 pt-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('visibility')}
            className={`pb-2 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'visibility'
                ? 'border-[#ff5451] text-[#ffdad6]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            เปิด–ปิดหัวข้อรายงาน
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`pb-2 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'presets'
                ? 'border-[#ff5451] text-[#ffdad6]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            หัวข้อด่วน & ข้อมูลประจำ
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`pb-2 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'info'
                ? 'border-[#ff5451] text-[#ffdad6]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            เงื่อนไขความปลอดภัย 100%
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 bg-[#110c0d] flex-1">
          {activeTab === 'visibility' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#2d181b]">
                <span className="text-xs text-[#e4beba]">
                  เลือกสวิตช์เปิด-ปิดหัวข้อที่จะปรากฏในรายงาน LINE และเอกสาร PDF
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={onShowAllSections}
                    className="text-[11px] px-2 py-0.5 rounded bg-[#2e1719] text-[#06C755] border border-[#06C755]/30 font-bold"
                  >
                    เปิดหมด
                  </button>
                  <button
                    type="button"
                    onClick={onHideOptionalSections}
                    className="text-[11px] px-2 py-0.5 rounded bg-[#211f1f] text-amber-300 border border-[#3e3433]"
                  >
                    ซ่อนส่วนเสริม
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { key: 'station', label: 'จุดบริการ' },
                  { key: 'dateTime', label: 'วันและเวลา' },
                  { key: 'caseId', label: 'เลขเคส' },
                  { key: 'unit', label: 'รถพยาบาล/กู้ชีพ' },
                  { key: 'incidentType', label: 'ประเภทเหตุการณ์' },
                  { key: 'symptoms', label: 'อาการ/เหตุการณ์' },
                  { key: 'location', label: 'สถานที่เกิดเหตุ' },
                  { key: 'vehicles', label: 'รายละเอียดรถที่เกิดเหตุ (คันที่ 1-2-3...)' },
                  { key: 'patientInfo', label: 'ข้อมูลผู้ป่วย (เพศ/ชื่อ/อายุ)' },
                  { key: 'patientAddress', label: 'ที่อยู่ผู้ป่วย' },
                  { key: 'vitals', label: 'สัญญาณชีพ Vital Signs' },
                  { key: 'hospital', label: 'โรงพยาบาลปลายทาง' },
                  { key: 'policeStation', label: 'สถานีตำรวจ' },
                  { key: 'officerName', label: 'ร้อยเวร' },
                  { key: 'crew', label: 'เจ้าหน้าที่ปฏิบัติการ ว.4' },
                  { key: 'notes', label: 'รายละเอียดเพิ่มเติม/การปฐมพยาบาล' },
                ].map(({ key, label }) => {
                  const isVis = visibility[key as keyof SectionVisibility];
                  return (
                    <div
                      key={key}
                      onClick={() => onToggleVisibility(key as keyof SectionVisibility)}
                      className="p-2.5 rounded-xl bg-[#1d1214] border border-[#36191c] flex items-center justify-between cursor-pointer hover:bg-[#281518] transition-colors"
                    >
                      <span className="text-xs text-slate-200">{label}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isVis
                            ? 'bg-[#06C755]/20 text-[#06C755] border border-[#06C755]/40'
                            : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        }`}
                      >
                        {isVis ? 'แสดง' : 'ซ่อน'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'presets' && (
            <div className="space-y-4">
              {/* Radio frequency */}
              <div className="p-3 rounded-xl bg-[#201013] border border-[#ff5451]/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    ความถี่วิทยุสื่อสารประจำมูลนิธิ
                  </span>
                  <span className="text-[11px] text-[#e4beba]">
                    ข่ายหลัก มูลนิธิพุทธธรรม 31 นครราชสีมา
                  </span>
                </div>
                <span className="text-sm font-mono font-bold text-[#ffdad6] px-2.5 py-1 rounded bg-[#3b1215] border border-[#ff5451]/40">
                  {RADIO_FREQUENCY}
                </span>
              </div>

              {/* Custom Topics list */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">
                    หัวข้อด่วนที่เพิ่มเอง ({customTopics.length} รายการ)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAddTopicModal();
                    }}
                    className="text-xs text-[#ff5451] font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>+ เพิ่มหัวข้อใหม่</span>
                  </button>
                </div>

                {customTopics.length === 0 ? (
                  <p className="text-xs text-neutral-500 italic p-3 rounded-lg bg-[#181112]">
                    ยังไม่มีหัวข้อที่เพิ่มเอง สามารถกด "+ เพิ่มตัวเลือกด่วน" ที่แถบด้านบน
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {customTopics.map((ct) => (
                      <div
                        key={ct.id}
                        className="p-2 rounded-lg bg-[#181112] border border-[#2e1719] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">
                            {ct.badge || 'พิเศษ'}
                          </span>
                          <span className="font-semibold text-white">{ct.title}</span>
                          <span className="text-neutral-400 text-[11px] hidden sm:inline">
                            ({ct.symptoms})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onDeleteCustomTopic(ct.id)}
                          className="text-red-400 hover:text-red-300 text-xs px-2 py-0.5"
                        >
                          ลบ
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Station list reference */}
              <div>
                <span className="text-xs font-bold text-white block mb-1.5">
                  จุดบริการในเครือข่ายฮุก 31 โคราช
                </span>
                <div className="flex flex-wrap gap-1">
                  {SERVICE_STATIONS.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#1c1214] text-neutral-300 border border-[#30171a]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'info' && (
            <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-[#1f1214] border border-[#ff5451]/30 space-y-2">
                <span className="font-bold text-white text-sm block flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#06C755] text-[18px]">
                    verified_user
                  </span>
                  <span>ความปลอดภัย & ความเป็นส่วนตัว 100%</span>
                </span>
                <p className="text-slate-300">
                  แอปพลิเคชันนี้ทำงานภายในเว็บเบราว์เซอร์ของท่าน 100% (Client-Side Only)
                  ไม่มีการส่งข้อมูลชื่อผู้ป่วย อาการ บัตร หรือข้อมูลเหตุการณ์ใดๆ
                  ไปยังฐานข้อมูลภายนอกหรือเซิร์ฟเวอร์
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#161213] border border-[#2e2224] space-y-2">
                <span className="font-bold text-white text-sm block flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-amber-400 text-[18px]">
                    info
                  </span>
                  <span>ข้อจำกัดและเงื่อนไขการใช้งาน</span>
                </span>
                <p className="text-neutral-300 italic">{APP_LEGAL_DISCLAIMER}</p>
              </div>

              <div className="p-3 rounded-lg bg-[#141212] text-[11px] text-neutral-400 space-y-1">
                <div>• ไม่ใช้ฐานข้อมูล (Database-free)</div>
                <div>• ไม่ต้องสมัครสมาชิก / ไม่มีรหัสผ่าน</div>
                <div>• ฟรี 100% ไม่มีค่าบริการ API</div>
                <div>• รองรับการพิมพ์ Run Sheet A4 และส่งข้อความ LINE โดยตรง</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#251315] border-t border-[#3b1215] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#3b1215] hover:bg-[#521a1e] text-[#ffdad6] text-xs font-semibold"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
