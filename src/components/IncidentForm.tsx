import React, { useState } from 'react';
import { IncidentReport, VitalSigns } from '../types';
import { HOSPITALS_KORAT, AMBULANCE_UNITS } from '../data/initialData';
import { getLiveTimeString } from '../utils/formatters';

interface IncidentFormProps {
  report: IncidentReport;
  onChange: (updated: IncidentReport) => void;
  openSections: {
    sec1: boolean;
    sec2: boolean;
    sec3: boolean;
    sec4: boolean;
  };
  onToggleSection: (key: 'sec1' | 'sec2' | 'sec3' | 'sec4') => void;
  onShowToast: (title: string, desc: string, icon?: string) => void;
  onOpenIdScanner: (tab?: 'camera' | 'card_reader') => void;
}

export const IncidentForm: React.FC<IncidentFormProps> = ({
  report,
  onChange,
  openSections,
  onToggleSection,
  onShowToast,
  onOpenIdScanner,
}) => {
  const [showExtraVitals, setShowExtraVitals] = useState(false);

  const updateField = <K extends keyof IncidentReport>(field: K, value: IncidentReport[K]) => {
    onChange({
      ...report,
      [field]: value,
    });
  };

  const updateVitals = <K extends keyof VitalSigns>(field: K, value: string) => {
    onChange({
      ...report,
      vitals: {
        ...report.vitals,
        [field]: value,
      },
    });
  };

  const handleLiveTime = () => {
    const liveTime = getLiveTimeString();
    updateField('timestamp', liveTime);
    onShowToast('อัปเดตเวลาสดแล้ว', `ดึงเวลาปัจจุบัน ${liveTime} เรียบร้อย`, 'schedule');
  };

  const handleAppendSymptom = (tag: string) => {
    const current = report.symptoms.trim();
    if (!current || current === '-') {
      updateField('symptoms', `มีอาการ ${tag}`);
    } else {
      updateField('symptoms', `${current} ${tag}`);
    }
  };

  // Browser Geolocation API to auto-fill location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      onShowToast('ไม่รองรับ GPS', 'เบราว์เซอร์ไม่รองรับ Geolocation', 'warning');
      return;
    }
    onShowToast('กำลังตรวจหาพิกัด GPS...', 'ค้นหาตำแหน่งดาวเทียมปัจจุบัน', 'satellite_alt');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `พิกัด GPS: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
        const currentLoc = report.location.trim();
        const updated = currentLoc ? `${currentLoc} (${coords})` : coords;
        updateField('location', updated);
        onShowToast('ระบุพิกัดสำเร็จ', coords, 'my_location');
      },
      (err) => {
        onShowToast('ระบุพิกัดไม่สำเร็จ', err.message || 'โปรดอนุญาตสิทธิ์เข้าถึงตำแหน่ง', 'error');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* SECTION 1: Station & Dispatch Timing */}
      <div className="accordion-item rounded-xl bg-[#1c1b1b] border border-[#2e2423] shadow-sm overflow-hidden transition-all duration-200">
        <div
          className="cursor-pointer px-4 md:px-5 py-3.5 bg-[#211f1f] border-b border-[#2e2423] flex items-center justify-between select-none hover:bg-[#252323] transition-colors"
          onClick={() => onToggleSection('sec1')}
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-5 rounded-full bg-[#ffb3ad] inline-block"></span>
            <span className="font-label-tactical text-[11px] text-[#ffb3ad] font-bold uppercase tracking-widest">
              PART 01
            </span>
            <h3 className="font-headline-md text-base md:text-lg text-[#e6e1e1] font-semibold tracking-tight">
              ข้อมูลจุดตรวจการณ์ & เวลาออกเหตุ
            </h3>
            <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded bg-[#2b2a29] text-[#e4beba] font-label-tactical text-[11px]">
              3 ฟิลด์
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#e4beba] font-label-tactical text-[11px] hidden sm:inline">
              {openSections.sec1 ? 'ย่อ' : 'ขยาย'}
            </span>
            <span
              className={`material-symbols-outlined text-[#ffb3ad] text-[20px] transition-transform duration-200 ${
                openSections.sec1 ? 'rotate-0' : 'rotate-180'
              }`}
            >
              expand_less
            </span>
          </div>
        </div>

        {openSections.sec1 && (
          <div className="p-4 md:p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
              <div className="md:col-span-6 flex flex-col gap-1">
                <label className="font-label-tactical text-[11px] text-[#e4beba] font-semibold uppercase">
                  จุดตรวจการณ์ / สังกัด
                </label>
                <div className="h-12 px-3 rounded-lg bg-[#0f0e0e] border border-[#2e2423] text-[#e6e1e1] flex items-center font-body-md text-sm shadow-inner focus-within:border-[#ffb3ad]">
                  <span className="material-symbols-outlined text-[#ffb3ad] text-[18px] mr-2">
                    location_on
                  </span>
                  <input
                    className="w-full bg-transparent text-[#e6e1e1] focus:outline-none font-body-md text-sm"
                    value={report.station}
                    onChange={(e) => updateField('station', e.target.value)}
                    type="text"
                    placeholder="ระบุจุดตรวจการณ์"
                  />
                </div>
              </div>

              <div className="md:col-span-3 flex flex-col gap-1">
                <label className="font-label-tactical text-[11px] text-[#e4beba] font-semibold uppercase">
                  ลำดับเคสประจำวัน
                </label>
                <div className="h-12 px-3 rounded-lg bg-[#0f0e0e] border border-[#2e2423] text-[#e6e1e1] flex items-center font-label-tactical text-sm shadow-inner focus-within:border-[#ffb95f]">
                  <span className="text-[#ffb95f] font-bold mr-1">#</span>
                  <input
                    className="w-full bg-transparent text-[#ffb95f] focus:outline-none font-bold font-label-tactical"
                    value={report.caseId}
                    onChange={(e) => updateField('caseId', e.target.value)}
                    type="text"
                    placeholder="เคสที่ ..."
                  />
                </div>
              </div>

              <div className="md:col-span-3 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="font-label-tactical text-[11px] text-[#e4beba] font-semibold uppercase">
                    เวลา ว.4
                  </label>
                  <button
                    onClick={handleLiveTime}
                    className="text-[#ffb3ad] hover:text-white font-label-tactical text-[11px] flex items-center gap-0.5 transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[13px]">timer</span>
                    ดึงสด
                  </button>
                </div>
                <div className="h-12 px-3 rounded-lg bg-[#0f0e0e] border border-[#2e2423] text-[#e6e1e1] flex items-center font-label-tactical text-sm shadow-inner focus-within:border-[#4cd7f6]">
                  <input
                    className="w-full bg-transparent text-[#4cd7f6] focus:outline-none font-bold font-label-tactical"
                    value={report.timestamp}
                    onChange={(e) => updateField('timestamp', e.target.value)}
                    type="text"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: Ambulance & Incident Scene */}
      <div className="accordion-item rounded-xl bg-[#1c1b1b] border border-[#2e2423] shadow-sm overflow-hidden transition-all duration-200">
        <div
          className="cursor-pointer px-4 md:px-5 py-3.5 bg-[#211f1f] border-b border-[#2e2423] flex items-center justify-between select-none hover:bg-[#252323] transition-colors"
          onClick={() => onToggleSection('sec2')}
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-5 rounded-full bg-[#ffb95f] inline-block"></span>
            <span className="font-label-tactical text-[11px] text-[#ffb95f] font-bold uppercase tracking-widest">
              PART 02
            </span>
            <h3 className="font-headline-md text-base md:text-lg text-[#e6e1e1] font-semibold tracking-tight">
              ข้อมูลรถพยาบาล & สถานที่เกิดเหตุ
            </h3>
            <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded bg-[#2b2a29] text-[#e4beba] font-label-tactical text-[11px]">
              3 ฟิลด์
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#e4beba] font-label-tactical text-[11px] hidden sm:inline">
              {openSections.sec2 ? 'ย่อ' : 'ขยาย'}
            </span>
            <span
              className={`material-symbols-outlined text-[#ffb95f] text-[20px] transition-transform duration-200 ${
                openSections.sec2 ? 'rotate-0' : 'rotate-180'
              }`}
            >
              expand_less
            </span>
          </div>
        </div>

        {openSections.sec2 && (
          <div className="p-4 md:p-5 space-y-3.5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
              <div className="md:col-span-4 flex flex-col gap-1">
                <label className="font-label-tactical text-[11px] text-[#e4beba] font-semibold uppercase">
                  รหัสรถพยาบาลออกเหตุ
                </label>
                <div className="h-12 px-3 rounded-lg bg-[#0f0e0e] border border-[#2e2423] text-[#e6e1e1] flex items-center shadow-inner focus-within:border-[#ffb95f]">
                  <span className="material-symbols-outlined text-[#ffb95f] text-[18px] mr-2">
                    ambulance
                  </span>
                  <input
                    className="w-full bg-transparent text-[#e6e1e1] focus:outline-none font-body-md text-sm"
                    value={report.unit}
                    onChange={(e) => updateField('unit', e.target.value)}
                    type="text"
                    list="ambulance-list"
                  />
                  <datalist id="ambulance-list">
                    {AMBULANCE_UNITS.map((u) => (
                      <option key={u} value={u} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="md:col-span-8 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="font-label-tactical text-[11px] text-[#e4beba] font-semibold uppercase">
                    อาการเบื้องต้นที่รับแจ้ง
                  </label>
                  <span className="font-label-tactical text-[11px] text-[#4cd7f6]">
                    คลิกแท็กด่วนด้านล่าง
                  </span>
                </div>
                <div className="h-12 px-3 rounded-lg bg-[#0f0e0e] border border-[#2e2423] text-[#e6e1e1] flex items-center shadow-inner focus-within:border-[#ff5451]">
                  <span className="material-symbols-outlined text-[#ff5451] text-[18px] mr-2">
                    emergency
                  </span>
                  <input
                    className="w-full bg-transparent text-[#e6e1e1] focus:outline-none font-body-md text-sm font-medium"
                    value={report.symptoms}
                    onChange={(e) => updateField('symptoms', e.target.value)}
                    type="text"
                    placeholder="ระบุอาการ..."
                  />
                </div>
              </div>
            </div>

            {/* Quick symptom tags */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="font-label-tactical text-[11px] text-[#e4beba] mr-1">
                แท็กด่วน:
              </span>
              <button
                onClick={() => handleAppendSymptom('ไข้หนาวสั่น')}
                className="px-2.5 py-1 rounded-full bg-[#363434] hover:bg-[#3a3939] text-[#e6e1e1] font-body-sm text-xs transition-colors border border-[#443837]"
                type="button"
              >
                🌡️ ไข้สูง
              </button>
              <button
                onClick={() => handleAppendSymptom('ปวดท้องรุนแรง')}
                className="px-2.5 py-1 rounded-full bg-[#363434] hover:bg-[#3a3939] text-[#e6e1e1] font-body-sm text-xs transition-colors border border-[#443837]"
                type="button"
              >
                ⚡ ปวดท้องรุนแรง
              </button>
              <button
                onClick={() => handleAppendSymptom('หายใจเหนื่อยหอบ')}
                className="px-2.5 py-1 rounded-full bg-[#363434] hover:bg-[#3a3939] text-[#e6e1e1] font-body-sm text-xs transition-colors border border-[#443837]"
                type="button"
              >
                🫁 หายใจเหนื่อย
              </button>
              <button
                onClick={() => handleAppendSymptom('เป็นลม วิงเวียนศีรษะ')}
                className="px-2.5 py-1 rounded-full bg-[#363434] hover:bg-[#3a3939] text-[#e6e1e1] font-body-sm text-xs transition-colors border border-[#443837]"
                type="button"
              >
                💫 เป็นลม/เวียนหัว
              </button>
              <button
                onClick={() => handleAppendSymptom('หมดสติ ปลุกไม่ตื่น')}
                className="px-2.5 py-1 rounded-full bg-[#93000a] hover:bg-[#b91a24] text-[#ffdad6] font-body-sm text-xs transition-colors font-bold border border-[#c0392b]"
                type="button"
              >
                ⚠️ หมดสติ
              </button>
              <button
                onClick={() => handleAppendSymptom('ว.40 มีแผลถลอก/ปวดฟกช้ำ')}
                className="px-2.5 py-1 rounded-full bg-[#363434] hover:bg-[#3a3939] text-[#ffb95f] font-body-sm text-xs transition-colors border border-[#443837]"
                type="button"
              >
                💥 รถชน/ถลอก
              </button>
            </div>

            {/* Location with GPS pin button */}
            <div className="flex flex-col gap-1 pt-1">
              <div className="flex items-center justify-between">
                <label className="font-label-tactical text-[11px] text-[#e4beba] font-semibold uppercase">
                  สถานที่เกิดเหตุ / จุดอ้างอิง
                </label>
                <button
                  onClick={handleGetCurrentLocation}
                  className="text-[#4cd7f6] hover:text-white font-label-tactical text-[11px] flex items-center gap-1 transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[14px]">my_location</span>
                  ดึงพิกัด GPS สด
                </button>
              </div>
              <div className="p-3 rounded-lg bg-[#0f0e0e] border border-[#2e2423] text-[#e6e1e1] shadow-inner flex items-start gap-2 focus-within:border-[#ffb3ad]">
                <span className="material-symbols-outlined text-[#ffb3ad] text-[20px] mt-0.5 flex-shrink-0">
                  pin_drop
                </span>
                <textarea
                  className="w-full bg-transparent text-[#e6e1e1] focus:outline-none font-body-md text-sm resize-none"
                  value={report.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  rows={2}
                  placeholder="ระบุชื่อซอย ถนน จุดสังเกต หรือร้านค้าใกล้เคียง..."
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: Patient Information & Vitals */}
      <div className="accordion-item rounded-xl bg-[#1c1b1b] border border-[#2e2423] shadow-sm overflow-hidden transition-all duration-200">
        <div
          className="cursor-pointer px-4 md:px-5 py-3.5 bg-[#211f1f] border-b border-[#2e2423] flex items-center justify-between select-none hover:bg-[#252323] transition-colors"
          onClick={() => onToggleSection('sec3')}
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-5 rounded-full bg-[#4cd7f6] inline-block"></span>
            <span className="font-label-tactical text-[11px] text-[#4cd7f6] font-bold uppercase tracking-widest">
              PART 03
            </span>
            <h3 className="font-headline-md text-base md:text-lg text-[#e6e1e1] font-semibold tracking-tight">
              ข้อมูลผู้ป่วย & สัญญาณชีพ (Vital Signs)
            </h3>
            <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded bg-[#2b2a29] text-[#e4beba] font-label-tactical text-[11px]">
              8 ฟิลด์
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#e4beba] font-label-tactical text-[11px] hidden sm:inline">
              {openSections.sec3 ? 'ย่อ' : 'ขยาย'}
            </span>
            <span
              className={`material-symbols-outlined text-[#4cd7f6] text-[20px] transition-transform duration-200 ${
                openSections.sec3 ? 'rotate-0' : 'rotate-180'
              }`}
            >
              expand_less
            </span>
          </div>
        </div>

        {openSections.sec3 && (
          <div className="p-4 md:p-5 space-y-3.5">
            {/* Quick Auto-Fill Action Bar: Camera Scan & Smart Card Reader */}
            <div className="p-3 rounded-xl bg-[#211f1f] border border-[#3e3433] flex flex-wrap items-center justify-between gap-2.5 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">
                  badge
                </span>
                <span className="font-label-tactical text-xs text-[#e6e1e1] font-bold">
                  กรอกข้อมูลอัตโนมัติจากบัตรประชาชน:
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => onOpenIdScanner('camera')}
                  className="h-8 md:h-9 px-3 rounded-lg bg-[#ff5451] hover:bg-[#ff8885] text-[#5c0008] font-label-tactical text-[11px] font-bold flex items-center gap-1.5 transition-colors shadow"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                  <span>ถ่ายรูปบัตร (AI Scan)</span>
                </button>
                <button
                  onClick={() => onOpenIdScanner('card_reader')}
                  className="h-8 md:h-9 px-3 rounded-lg bg-[#4cd7f6] hover:bg-[#38bdf8] text-[#003640] font-label-tactical text-[11px] font-bold flex items-center gap-1.5 transition-colors shadow"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">memory</span>
                  <span>เสียบบัตร (Smart Card)</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
              <div className="md:col-span-3 flex flex-col gap-1">
                <label className="font-label-tactical text-[11px] text-[#e4beba] font-semibold uppercase">
                  เพศ & จำนวน
                </label>
                <div className="h-12 px-3 rounded-lg bg-[#0f0e0e] border border-[#2e2423] text-[#e6e1e1] flex items-center shadow-inner focus-within:border-[#4cd7f6]">
                  <input
                    className="w-full bg-transparent text-[#e6e1e1] focus:outline-none font-body-md text-sm"
                    value={report.genderCount}
                    onChange={(e) => updateField('genderCount', e.target.value)}
                    type="text"
                    placeholder="เช่น หญิง 1 ราย"
                  />
                </div>
              </div>

              <div className="md:col-span-6 flex flex-col gap-1">
                <label className="font-label-tactical text-[11px] text-[#e4beba] font-semibold uppercase">
                  ชื่อ - นามสกุล ผู้ป่วย
                </label>
                <div className="h-12 px-3 rounded-lg bg-[#0f0e0e] border border-[#2e2423] text-[#e6e1e1] flex items-center shadow-inner focus-within:border-[#4cd7f6]">
                  <span className="material-symbols-outlined text-[#e4beba] text-[18px] mr-2">
                    person
                  </span>
                  <input
                    className="w-full bg-transparent text-[#e6e1e1] focus:outline-none font-body-md text-sm font-medium"
                    value={report.patientName}
                    onChange={(e) => updateField('patientName', e.target.value)}
                    type="text"
                    placeholder="ระบุชื่อ-นามสกุล..."
                  />
                </div>
              </div>

              <div className="md:col-span-3 flex flex-col gap-1">
                <label className="font-label-tactical text-[11px] text-[#e4beba] font-semibold uppercase">
                  อายุ
                </label>
                <div className="h-12 px-3 rounded-lg bg-[#0f0e0e] border border-[#2e2423] text-[#e6e1e1] flex items-center shadow-inner focus-within:border-[#4cd7f6]">
                  <input
                    className="w-full bg-transparent text-[#e6e1e1] focus:outline-none font-body-md text-sm"
                    value={report.patientAge}
                    onChange={(e) => updateField('patientAge', e.target.value)}
                    type="text"
                    placeholder="เช่น 59 ปี"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-tactical text-[11px] text-[#e4beba] font-semibold uppercase">
                ที่อยู่ตามบัตรประชาชน
              </label>
              <div className="h-12 px-3 rounded-lg bg-[#0f0e0e] border border-[#2e2423] text-[#e6e1e1] flex items-center shadow-inner focus-within:border-[#4cd7f6]">
                <span className="material-symbols-outlined text-[#e4beba] text-[18px] mr-2">
                  home
                </span>
                <input
                  className="w-full bg-transparent text-[#e6e1e1] focus:outline-none font-body-md text-sm"
                  value={report.patientAddress}
                  onChange={(e) => updateField('patientAddress', e.target.value)}
                  type="text"
                  placeholder="ระบุบ้านเลขที่ หมู่ ตำบล อำเภอ..."
                />
              </div>
            </div>

            {/* Tactical Vital Signs Matrix */}
            <div className="p-3.5 rounded-xl bg-[#0f0e0e] border border-[#2e2423] shadow-inner space-y-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-label-tactical text-[11px] text-[#4cd7f6] uppercase flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-[15px]">monitor_heart</span>
                  สัญญาณชีพ ณ จุดเกิดเหตุ (VITAL SIGNS)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowExtraVitals(!showExtraVitals)}
                    className="text-[#ffb95f] hover:text-white font-label-tactical text-[10px] underline"
                    type="button"
                  >
                    {showExtraVitals ? '- ซ่อน GCS/DTX' : '+ เพิ่ม GCS/DTX'}
                  </button>
                  <span className="font-label-tactical text-[11px] text-[#e4beba]">
                    บันทึกตรวจแรกพบ
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {/* BP */}
                <div className="bg-[#211f1f] border border-[#2e2423] p-2.5 rounded-lg flex flex-col justify-between">
                  <span className="font-label-tactical text-[10px] text-[#e4beba]">BP (ความดัน)</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <input
                      className="w-full bg-transparent text-[#ffb95f] font-label-tactical text-base font-bold focus:outline-none text-left"
                      value={report.vitals.bp}
                      onChange={(e) => updateVitals('bp', e.target.value)}
                      type="text"
                      placeholder="120/80"
                    />
                    <span className="font-label-tactical text-[10px] text-[#e4beba]">mmHg</span>
                  </div>
                </div>

                {/* PR */}
                <div className="bg-[#211f1f] border border-[#2e2423] p-2.5 rounded-lg flex flex-col justify-between">
                  <span className="font-label-tactical text-[10px] text-[#e4beba]">PR (ชีพจร)</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <input
                      className="w-full bg-transparent text-[#4cd7f6] font-label-tactical text-base font-bold focus:outline-none text-left"
                      value={report.vitals.pr}
                      onChange={(e) => updateVitals('pr', e.target.value)}
                      type="text"
                      placeholder="80"
                    />
                    <span className="font-label-tactical text-[10px] text-[#e4beba]">bpm</span>
                  </div>
                </div>

                {/* SpO2 */}
                <div className="bg-[#211f1f] border border-[#2e2423] p-2.5 rounded-lg flex flex-col justify-between">
                  <span className="font-label-tactical text-[10px] text-[#e4beba]">SpO2 (ออกซิเจน)</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <input
                      className="w-full bg-transparent text-[#e6e1e1] font-label-tactical text-base font-bold focus:outline-none text-left"
                      value={report.vitals.spo2}
                      onChange={(e) => updateVitals('spo2', e.target.value)}
                      type="text"
                      placeholder="98"
                    />
                    <span className="font-label-tactical text-[10px] text-[#e4beba]">%</span>
                  </div>
                </div>

                {/* Temp */}
                <div className="bg-[#211f1f] border border-[#2e2423] p-2.5 rounded-lg flex flex-col justify-between">
                  <span className="font-label-tactical text-[10px] text-[#e4beba]">Temp (อุณหภูมิ)</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <input
                      className="w-full bg-transparent text-[#ffb3ad] font-label-tactical text-base font-bold focus:outline-none text-left"
                      value={report.vitals.temp}
                      onChange={(e) => updateVitals('temp', e.target.value)}
                      type="text"
                      placeholder="37.0"
                    />
                    <span className="font-label-tactical text-[10px] text-[#e4beba]">°C</span>
                  </div>
                </div>
              </div>

              {/* Optional GCS and DTX metrics */}
              {showExtraVitals && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#2e2423]">
                  <div className="bg-[#211f1f] border border-[#2e2423] p-2.5 rounded-lg flex flex-col justify-between">
                    <span className="font-label-tactical text-[10px] text-[#e4beba]">GCS (Glasgow Coma)</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <input
                        className="w-full bg-transparent text-[#ffb95f] font-label-tactical text-sm font-bold focus:outline-none text-left"
                        value={report.vitals.gcs || ''}
                        onChange={(e) => updateVitals('gcs', e.target.value)}
                        type="text"
                        placeholder="E4V5M6 (15)"
                      />
                    </div>
                  </div>
                  <div className="bg-[#211f1f] border border-[#2e2423] p-2.5 rounded-lg flex flex-col justify-between">
                    <span className="font-label-tactical text-[10px] text-[#e4beba]">DTX (ระดับน้ำตาล)</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <input
                        className="w-full bg-transparent text-[#4cd7f6] font-label-tactical text-sm font-bold focus:outline-none text-left"
                        value={report.vitals.dtx || ''}
                        onChange={(e) => updateVitals('dtx', e.target.value)}
                        type="text"
                        placeholder="110 mg/dL"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: Hospital Destination & Rescue Crew */}
      <div className="accordion-item rounded-xl bg-[#1c1b1b] border border-[#2e2423] shadow-sm overflow-hidden transition-all duration-200">
        <div
          className="cursor-pointer px-4 md:px-5 py-3.5 bg-[#211f1f] border-b border-[#2e2423] flex items-center justify-between select-none hover:bg-[#252323] transition-colors"
          onClick={() => onToggleSection('sec4')}
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-5 rounded-full bg-[#ff5451] inline-block"></span>
            <span className="font-label-tactical text-[11px] text-[#ff5451] font-bold uppercase tracking-widest">
              PART 04
            </span>
            <h3 className="font-headline-md text-base md:text-lg text-[#e6e1e1] font-semibold tracking-tight">
              การนำส่ง รพ. & กำลังพลออก ว.4
            </h3>
            <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded bg-[#2b2a29] text-[#e4beba] font-label-tactical text-[11px]">
              3 ฟิลด์
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#e4beba] font-label-tactical text-[11px] hidden sm:inline">
              {openSections.sec4 ? 'ย่อ' : 'ขยาย'}
            </span>
            <span
              className={`material-symbols-outlined text-[#ff5451] text-[20px] transition-transform duration-200 ${
                openSections.sec4 ? 'rotate-0' : 'rotate-180'
              }`}
            >
              expand_less
            </span>
          </div>
        </div>

        {openSections.sec4 && (
          <div className="p-4 md:p-5 space-y-3.5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
              <div className="md:col-span-6 flex flex-col gap-1">
                <label className="font-label-tactical text-[11px] text-[#e4beba] font-semibold uppercase">
                  โรงพยาบาลที่นำส่งปลายทาง
                </label>
                <div className="h-12 px-3 rounded-lg bg-[#0f0e0e] border border-[#2e2423] text-[#e6e1e1] flex items-center shadow-inner focus-within:border-[#4cd7f6]">
                  <span className="material-symbols-outlined text-[#4cd7f6] text-[18px] mr-2">
                    local_hospital
                  </span>
                  <input
                    className="w-full bg-transparent text-[#e6e1e1] focus:outline-none font-body-md text-sm font-semibold"
                    value={report.hospital}
                    onChange={(e) => updateField('hospital', e.target.value)}
                    type="text"
                    list="hospital-list"
                    placeholder="เลือกหรือพิมพ์ชื่อ รพ."
                  />
                  <datalist id="hospital-list">
                    {HOSPITALS_KORAT.map((h) => (
                      <option key={h} value={h} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="md:col-span-6 flex flex-col gap-1">
                <label className="font-label-tactical text-[11px] text-[#e4beba] font-semibold uppercase">
                  รหัสกำลังพลปฏิบัติหน้าที่ ว.4
                </label>
                <div className="h-12 px-3 rounded-lg bg-[#0f0e0e] border border-[#2e2423] text-[#e6e1e1] flex items-center shadow-inner focus-within:border-[#ffb95f]">
                  <span className="material-symbols-outlined text-[#ffb95f] text-[18px] mr-2">
                    badge
                  </span>
                  <input
                    className="w-full bg-transparent text-[#ffb95f] focus:outline-none font-label-tactical text-xs font-bold"
                    value={report.crew}
                    onChange={(e) => updateField('crew', e.target.value)}
                    type="text"
                    placeholder="เช่น พบ.32, พบ.34, ข้างสภ.220"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-tactical text-[11px] text-[#e4beba] font-semibold uppercase">
                หมายเหตุเพิ่มเติม / เหตุการณ์พิเศษ ณ จุดเกิดเหตุ
              </label>
              <div className="p-3 rounded-lg bg-[#0f0e0e] border border-[#2e2423] text-[#e6e1e1] shadow-inner focus-within:border-[#ff5451]">
                <textarea
                  className="w-full bg-transparent text-[#e6e1e1] focus:outline-none font-body-md text-sm resize-none"
                  value={report.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="ระบุการให้การช่วยเหลือเพิ่มเติม เช่น ให้ออกซิเจน Cannula 3 LPM หรือ ปฐมพยาบาลห้ามเลือด..."
                  rows={2}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
