import React, { useState } from 'react';
import { QuickTopic } from '../types';
import { HOSPITALS_KORAT, AMBULANCE_UNITS } from '../data/initialData';

interface AddQuickTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTopic: (topic: QuickTopic) => void;
  onShowToast: (title: string, desc: string, icon?: string) => void;
}

export const AddQuickTopicModal: React.FC<AddQuickTopicModalProps> = ({
  isOpen,
  onClose,
  onAddTopic,
  onShowToast,
}) => {
  const [title, setTitle] = useState('');
  const [badge, setBadge] = useState('');
  const [category, setCategory] = useState<'accident' | 'illness' | 'cpr' | 'rescue' | 'custom'>('custom');
  const [symptoms, setSymptoms] = useState('');
  const [unit, setUnit] = useState(AMBULANCE_UNITS[0]);
  const [hospital, setHospital] = useState(HOSPITALS_KORAT[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      onShowToast('กรุณากรอกชื่อหัวข้อ', 'ต้องระบุชื่อหัวข้อด่วนเพื่อใช้เป็นปุ่มกด', 'warning');
      return;
    }

    let incidentType: 'accident' | 'illness' | 'cpr' | 'other' = 'other';
    if (category === 'accident') incidentType = 'accident';
    else if (category === 'illness') incidentType = 'illness';
    else if (category === 'cpr') incidentType = 'cpr';

    const newTopic: QuickTopic = {
      id: `custom-qt-${Date.now()}`,
      title: title.trim(),
      badge: badge.trim() || '⭐ พิเศษ',
      category,
      symptoms: symptoms.trim() || title.trim(),
      incidentType,
      unit,
      hospital,
      isCustom: true,
    };

    onAddTopic(newTopic);
    onShowToast('เพิ่มตัวเลือกด่วนสำเร็จ!', `เพิ่มปุ่ม "${newTopic.title}" เข้าสู่คลังหัวข้อด่วนแล้ว`, 'bookmark_added');

    // Reset
    setTitle('');
    setBadge('');
    setSymptoms('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#1c1b1b] border border-[#ff5451]/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-[#251f1f] border-b border-[#2e2423] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#ff5451] flex items-center justify-center text-[#5c0008] shadow">
              <span className="material-symbols-outlined text-[20px]">add_task</span>
            </div>
            <div>
              <h3 className="font-headline-md text-base font-bold text-[#e6e1e1]">
                เพิ่มตัวเลือกด่วน / บันทึกหัวข้อประจำจุด
              </h3>
              <p className="font-body-sm text-xs text-[#e4beba]">
                สร้างปุ่มลัดเพื่อกรอกข้อมูล ว.8 เคสที่เกิดขึ้นบ่อยใน 1 คลิก
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#2b2a29] text-[#e4beba] hover:text-white hover:bg-[#383635] flex items-center justify-center transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Topic Title */}
          <div className="flex flex-col gap-1">
            <label className="font-label-tactical text-xs text-[#e4beba] font-semibold">
              ชื่อหัวข้อด่วน <span className="text-[#ff5451]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น รถคว่ำถนนมิตรภาพ, จมน้ำ, สัตว์มีพิษกัด"
              className="h-11 px-3.5 rounded-lg bg-[#0f0e0e] border border-[#3e3433] text-[#e6e1e1] text-sm focus:outline-none focus:border-[#4cd7f6]"
            />
          </div>

          {/* Badge & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-label-tactical text-xs text-[#e4beba] font-semibold">
                ข้อความย่อ / ไอคอนปุ่ม
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="เช่น 🚨 รถคว่ำ หรือ 🏊 จมน้ำ"
                className="h-11 px-3.5 rounded-lg bg-[#0f0e0e] border border-[#3e3433] text-[#e6e1e1] text-sm focus:outline-none focus:border-[#4cd7f6]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-tactical text-xs text-[#e4beba] font-semibold">
                หมวดหมู่อุบัติเหตุ/เหตุการณ์
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="h-11 px-3.5 rounded-lg bg-[#0f0e0e] border border-[#3e3433] text-[#e6e1e1] text-sm focus:outline-none focus:border-[#4cd7f6]"
              >
                <option value="accident">💥 อุบัติเหตุจราจร (ว.40)</option>
                <option value="illness">🫀 ผู้ป่วยฉุกเฉิน (EMS)</option>
                <option value="cpr">⚡ วิกฤต CPR / หมดสติ</option>
                <option value="rescue">🚒 กู้ภัย / ช่วยเหลือประชาชน</option>
                <option value="custom">⭐ เคสประจำจุดพิเศษ</option>
              </select>
            </div>
          </div>

          {/* Symptoms / Details preset */}
          <div className="flex flex-col gap-1">
            <label className="font-label-tactical text-xs text-[#e4beba] font-semibold">
              อาการเริ่มต้น / ข้อความ ว.40 อัตโนมัติ
            </label>
            <textarea
              rows={3}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="ระบุข้อความอาการหรือรายละเอียดที่ต้องการให้กรอกลงฟอร์มอัตโนมัติ..."
              className="p-3 rounded-lg bg-[#0f0e0e] border border-[#3e3433] text-[#e6e1e1] text-sm focus:outline-none focus:border-[#4cd7f6] resize-none"
            />
          </div>

          {/* Unit & Hospital presets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-label-tactical text-xs text-[#e4beba] font-semibold">
                หน่วย / รถพยาบาลประจำ
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="h-10 px-3 rounded-lg bg-[#0f0e0e] border border-[#3e3433] text-[#e6e1e1] text-xs focus:outline-none"
              >
                {AMBULANCE_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-tactical text-xs text-[#e4beba] font-semibold">
                โรงพยาบาลนำส่งหลัก
              </label>
              <select
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                className="h-10 px-3 rounded-lg bg-[#0f0e0e] border border-[#3e3433] text-[#e6e1e1] text-xs focus:outline-none"
              >
                {HOSPITALS_KORAT.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#2e2423] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-[#2b2a29] hover:bg-[#383635] text-[#e4beba] text-xs font-semibold font-label-tactical transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#ff5451] hover:bg-[#ff8885] text-[#5c0008] text-xs font-bold font-label-tactical transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>บันทึกตัวเลือกด่วน</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
