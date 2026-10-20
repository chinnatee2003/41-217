import React, { useState } from 'react';
import { IncidentReport, SectionVisibility, VehicleInfo, VitalSigns } from '../types';
import {
  HOSPITALS_KORAT,
  AMBULANCE_UNITS,
  SERVICE_STATIONS,
  POLICE_STATIONS,
  VEHICLE_TYPES,
} from '../data/initialData';
import { getLiveTimeString, getTodayThaiDate } from '../utils/formatters';

interface IncidentFormProps {
  report: IncidentReport;
  onChange: (updated: IncidentReport) => void;
  visibility: SectionVisibility;
  onToggleVisibility: (key: keyof SectionVisibility) => void;
  onShowAllSections: () => void;
  onHideOptionalSections: () => void;
  onShowToast: (title: string, desc: string, icon?: string) => void;
}

export const IncidentForm: React.FC<IncidentFormProps> = ({
  report,
  onChange,
  visibility,
  onToggleVisibility,
  onShowAllSections,
  onHideOptionalSections,
  onShowToast,
}) => {
  // Collapsible section accordions state
  const [collapsed, setCollapsed] = useState<{ [key: string]: boolean }>({
    secEvent: false,
    secLocation: false,
    secVehicles: false,
    secPatient: false,
    secVitals: false,
    secDestination: false,
  });

  const toggleAccordion = (key: string) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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

  // Quick Helpers
  const handleSetCurrentTime = () => {
    const t = getLiveTimeString();
    updateField('timestamp', t);
    onShowToast('ใส่วันและเวลาแล้ว', `บันทึกเวลา ${t} เรียบร้อย`, 'schedule');
  };

  const handleSetTodayDate = () => {
    const d = getTodayThaiDate();
    updateField('dateStr', d);
    onShowToast('ใส่วันที่แล้ว', `ประจำวันที่ ${d}`, 'today');
  };

  const handleAppendSymptom = (text: string) => {
    const cur = report.symptoms.trim();
    if (!cur) {
      updateField('symptoms', text);
    } else {
      updateField('symptoms', `${cur} ${text}`);
    }
  };

  // Vehicle Management for Accidents
  const handleAddVehicle = () => {
    const nextOrder = (report.vehicles?.length || 0) + 1;
    const newVeh: VehicleInfo = {
      id: `veh-${Date.now()}-${nextOrder}`,
      order: nextOrder,
      type: nextOrder === 1 ? 'รถจักรยานยนต์ (จยย.)' : 'รถยนต์เก๋ง',
      brandModel: '',
      color: '',
      plateNumber: '',
      driverName: '',
      damageDesc: '',
    };
    updateField('vehicles', [...(report.vehicles || []), newVeh]);
    onShowToast(`เพิ่มรถคันที่ ${nextOrder} แล้ว`, 'กรอกข้อมูลยี่ห้อ ทะเบียน และผู้ขับขี่', 'directions_car');
  };

  const handleUpdateVehicle = (index: number, updated: Partial<VehicleInfo>) => {
    const list = [...(report.vehicles || [])];
    list[index] = { ...list[index], ...updated };
    updateField('vehicles', list);
  };

  const handleRemoveVehicle = (index: number) => {
    const list = (report.vehicles || []).filter((_, i) => i !== index);
    // Re-index order
    const reordered = list.map((v, i) => ({ ...v, order: i + 1 }));
    updateField('vehicles', reordered);
    onShowToast('ลบรายการรถแล้ว', 'ปรับลำดับรถเรียบร้อย', 'delete');
  };

  // GPS Geolocation
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      onShowToast('ไม่รองรับ GPS', 'เบราว์เซอร์ไม่รองรับ Geolocation', 'warning');
      return;
    }
    onShowToast('กำลังดึงพิกัด GPS...', 'ค้นหาตำแหน่งดาวเทียมปัจจุบัน', 'satellite_alt');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `พิกัด GPS: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
        const cur = report.location.trim();
        const updated = cur ? `${cur} (${coords})` : coords;
        updateField('location', updated);
        onShowToast('ดึงพิกัดสำเร็จ', coords, 'my_location');
      },
      (err) => {
        onShowToast('ดึงพิกัดไม่สำเร็จ', err.message || 'โปรดอนุญาตสิทธิ์เข้าถึงตำแหน่ง', 'error');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Switch Toggle Helper Component
  const RenderVisibilityToggle = ({
    sectionKey,
    label,
  }: {
    sectionKey: keyof SectionVisibility;
    label: string;
  }) => {
    const isVisible = visibility[sectionKey];
    return (
      <div className="flex items-center justify-between gap-2 py-1 px-2 rounded-lg bg-[#181112] border border-[#2e1719] mb-2">
        <span className="text-xs font-medium text-[#e4beba] flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[15px] text-[#ff8885]">toggle_on</span>
          <span>{label}</span>
        </span>
        <button
          type="button"
          onClick={() => onToggleVisibility(sectionKey)}
          className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-all flex items-center gap-1 ${
            isVisible
              ? 'bg-[#06C755]/20 text-[#06C755] border border-[#06C755]/50'
              : 'bg-[#2b2a29] text-neutral-400 border border-[#3e3433]'
          }`}
          title="คลิกเพื่อสลับการแสดงผลในรายงาน"
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isVisible ? 'bg-[#06C755] animate-pulse' : 'bg-neutral-500'
            }`}
          ></span>
          <span>{isVisible ? 'แสดงในรายงาน' : 'ไม่แสดงในรายงาน'}</span>
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 pb-20 md:pb-6">
      {/* GLOBAL SECTION VISIBILITY MANAGEMENT BAR */}
      <div className="p-3 rounded-xl bg-[#1c1214] border border-[#3b1215] flex flex-wrap items-center justify-between gap-2.5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ff8885] text-[20px]">
            tune
          </span>
          <div>
            <span className="text-xs font-bold text-white block">
              ระบบเปิด–ปิดการแสดงผลหัวข้อ (Section Controls)
            </span>
            <span className="text-[11px] text-[#e4beba]">
              หัวข้อที่ปิดจะไม่แสดงในข้อความ LINE และ PDF ทันที (ข้อมูลไม่สูญหาย)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onShowAllSections}
            className="h-8 px-2.5 rounded-lg bg-[#2e1719] hover:bg-[#451e22] text-[#ffdad6] border border-[#ff5451]/30 text-xs font-semibold flex items-center gap-1 transition-all active:scale-95"
            title="แสดงทุกหัวข้อทั้งหมดในรายงาน"
          >
            <span className="material-symbols-outlined text-[15px] text-[#06C755]">check_circle</span>
            <span>แสดงทุกหัวข้อ</span>
          </button>

          <button
            type="button"
            onClick={onHideOptionalSections}
            className="h-8 px-2.5 rounded-lg bg-[#211f1f] hover:bg-[#2b2a29] text-[#e4beba] border border-[#3e3433] text-xs font-semibold flex items-center gap-1 transition-all active:scale-95"
            title="ซ่อนหัวข้อที่ไม่จำเป็น (เช่น ท้องที่ตำรวจ, ร้อยเวร, Vital Signs)"
          >
            <span className="material-symbols-outlined text-[15px] text-amber-400">visibility_off</span>
            <span>ซ่อนหัวข้อที่ไม่จำเป็น</span>
          </button>
        </div>
      </div>

      {/* CARD 1: ข้อมูลเหตุการณ์ และจุดบริการ (INCIDENT OVERVIEW) */}
      <div className="rounded-xl bg-[#191415] border border-[#361a1d] shadow-md overflow-hidden">
        <div
          onClick={() => toggleAccordion('secEvent')}
          className="px-4 py-3 bg-[#221315] border-b border-[#361a1d] flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff5451] text-[20px]">
              emergency
            </span>
            <span className="font-headline-md text-sm font-bold text-white">
              ส่วนที่ 1: ข้อมูลเหตุการณ์ & วันเวลา
            </span>
          </div>
          <span className="material-symbols-outlined text-[#e4beba] text-[20px]">
            {collapsed.secEvent ? 'expand_more' : 'expand_less'}
          </span>
        </div>

        {!collapsed.secEvent && (
          <div className="p-4 space-y-4">
            {/* Toggles for Section 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              <RenderVisibilityToggle sectionKey="station" label="จุดบริการ" />
              <RenderVisibilityToggle sectionKey="dateTime" label="วันและเวลา" />
              <RenderVisibilityToggle sectionKey="caseId" label="เลขเคส" />
              <RenderVisibilityToggle sectionKey="unit" label="รถพยาบาล/กู้ชีพ" />
              <RenderVisibilityToggle sectionKey="incidentType" label="ประเภทเหตุการณ์" />
              <RenderVisibilityToggle sectionKey="symptoms" label="อาการ/เหตุการณ์" />
            </div>

            {/* Incident Type Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#e4beba] flex items-center gap-1">
                <span>ประเภทเหตุการณ์</span>
                {!visibility.incidentType && (
                  <span className="text-[10px] text-neutral-400">(ปิดในรายงาน)</span>
                )}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'accident', label: '💥 ว.40 อุบัติเหตุ', color: 'border-orange-500' },
                  { id: 'illness', label: '🫀 ผู้ป่วยทั่วไป', color: 'border-sky-500' },
                  { id: 'cpr', label: '⚡ CPR วิกฤต', color: 'border-red-600' },
                  { id: 'other', label: '🚒 กู้ภัย/ช่วยเหลือ', color: 'border-emerald-500' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => updateField('incidentType', t.id as any)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all active:scale-95 ${
                      report.incidentType === t.id
                        ? 'bg-[#ff5451] text-[#400005] border-[#ff8885] shadow-md font-extrabold'
                        : 'bg-[#211f1f] text-[#e4beba] border-[#362e2d] hover:bg-[#2b2a29]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Station & Unit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#e4beba]">จุดบริการ / ศูนย์วิทยุ</label>
                <div className="relative">
                  <input
                    type="text"
                    value={report.station}
                    onChange={(e) => updateField('station', e.target.value)}
                    placeholder="เช่น จุดข้าง สภ.โพธิ์กลาง ฮุก 31"
                    className="w-full h-10 px-3 rounded-lg bg-[#141313] border border-[#3e3433] text-white text-xs focus:border-[#ff5451] focus:outline-none"
                  />
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {SERVICE_STATIONS.slice(0, 3).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => updateField('station', st)}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#252323] text-[#e4beba] hover:text-white border border-[#362e2d]"
                      >
                        {st.replace(' ฮุก 31', '')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#e4beba]">รถพยาบาล / รหัสรถกู้ชีพ</label>
                <input
                  type="text"
                  value={report.unit}
                  onChange={(e) => updateField('unit', e.target.value)}
                  placeholder="เช่น รถพยาบาลคันที่ 11, รถกู้ชีพ 05"
                  className="w-full h-10 px-3 rounded-lg bg-[#141313] border border-[#3e3433] text-white text-xs focus:border-[#ff5451] focus:outline-none"
                />
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {AMBULANCE_UNITS.slice(0, 4).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => updateField('unit', u)}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#252323] text-[#e4beba] hover:text-white border border-[#362e2d]"
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Case ID, Date, and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#e4beba]">เลขลำดับเคส (Case ID)</label>
                <input
                  type="text"
                  value={report.caseId}
                  onChange={(e) => updateField('caseId', e.target.value)}
                  placeholder="เช่น เคสที่ 01 หรือ เว้นว่าง"
                  className="w-full h-10 px-3 rounded-lg bg-[#141313] border border-[#3e3433] text-white text-xs focus:border-[#ff5451] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#e4beba]">ประจำวันที่</label>
                  <button
                    type="button"
                    onClick={handleSetTodayDate}
                    className="text-[11px] text-[#4cd7f6] hover:underline"
                  >
                    + ใส่วันนี้
                  </button>
                </div>
                <input
                  type="text"
                  value={report.dateStr}
                  onChange={(e) => updateField('dateStr', e.target.value)}
                  placeholder="เช่น 20 ต.ค. 2569"
                  className="w-full h-10 px-3 rounded-lg bg-[#141313] border border-[#3e3433] text-white text-xs focus:border-[#ff5451] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#e4beba]">เวลาที่รับแจ้ง / เวลา ว.4</label>
                  <button
                    type="button"
                    onClick={handleSetCurrentTime}
                    className="text-[11px] text-[#ff5451] font-semibold hover:underline"
                  >
                    + เวลาสดตอนนี้
                  </button>
                </div>
                <input
                  type="text"
                  value={report.timestamp}
                  onChange={(e) => updateField('timestamp', e.target.value)}
                  placeholder="เช่น 14:30 น."
                  className="w-full h-10 px-3 rounded-lg bg-[#141313] border border-[#3e3433] text-white text-xs focus:border-[#ff5451] focus:outline-none"
                />
              </div>
            </div>

            {/* Symptoms / Incident Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#e4beba]">
                อาการที่รับแจ้ง / รายละเอียดเหตุการณ์
              </label>
              <textarea
                rows={2}
                value={report.symptoms}
                onChange={(e) => updateField('symptoms', e.target.value)}
                placeholder="ระบุอาการ เช่น ว.40 จยย.ชนกับรถเก๋ง มีแผลถลอก หรือ ไข้สูงหนาวสั่น..."
                className="w-full p-2.5 rounded-lg bg-[#141313] border border-[#3e3433] text-white text-xs focus:border-[#ff5451] focus:outline-none leading-relaxed"
              />
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-[10px] text-neutral-400">คำด่วน:</span>
                {[
                  'ว.40 จยย.ล้มเอง',
                  'ว.40 จยย.+เก๋ง',
                  'มีแผลถลอกตามร่างกาย',
                  'ปวดเจ็บสะโพก',
                  'ศีรษะแตก เลือดไหล',
                  'หมดสติ ปลุกไม่ตื่น',
                  'แน่นหน้าอก หายใจลำบาก',
                  'แผลฉีกขาด',
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAppendSymptom(tag)}
                    className="text-[10px] px-2 py-0.5 rounded bg-[#252323] hover:bg-[#333030] text-[#ffdad6] border border-[#3e3433] active:scale-95"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CARD 2: สถานที่เกิดเหตุ (LOCATION) */}
      <div className="rounded-xl bg-[#191415] border border-[#361a1d] shadow-md overflow-hidden">
        <div
          onClick={() => toggleAccordion('secLocation')}
          className="px-4 py-3 bg-[#221315] border-b border-[#361a1d] flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffb95f] text-[20px]">
              place
            </span>
            <span className="font-headline-md text-sm font-bold text-white">
              ส่วนที่ 2: สถานที่เกิดเหตุ & จุดอ้างอิง
            </span>
          </div>
          <span className="material-symbols-outlined text-[#e4beba] text-[20px]">
            {collapsed.secLocation ? 'expand_more' : 'expand_less'}
          </span>
        </div>

        {!collapsed.secLocation && (
          <div className="p-4 space-y-3">
            <RenderVisibilityToggle sectionKey="location" label="สถานที่เกิดเหตุ" />

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#e4beba]">
                  สถานที่เกิดเหตุ / จุดสังเกตใกล้เคียง
                </label>
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  className="px-2.5 py-1 rounded-md bg-[#251f1f] border border-[#ff5451]/50 text-[#ffb3ad] hover:text-white text-[11px] font-semibold flex items-center gap-1 active:scale-95"
                >
                  <span className="material-symbols-outlined text-[14px] text-[#ff5451]">
                    my_location
                  </span>
                  <span>ดึงพิกัด GPS อัตโนมัติ</span>
                </button>
              </div>
              <textarea
                rows={2}
                value={report.location}
                onChange={(e) => updateField('location', e.target.value)}
                placeholder="เช่น ถนนมิตรภาพ ขาเข้า หน้าตลาดเซฟวัน ต.ในเมือง อ.เมือง จ.นครราชสีมา"
                className="w-full p-2.5 rounded-lg bg-[#141313] border border-[#3e3433] text-white text-xs focus:border-[#ff5451] focus:outline-none"
              />
              <div className="flex flex-wrap gap-1">
                {[
                  'หน้าตลาดเซฟวัน',
                  'สี่แยกปักธงชัย',
                  'หน้าโลตัสหัวทะเล',
                  'ถนนมิตรภาพ',
                  'ถนนสืบศิริ',
                  'สามแยกปัก',
                  'หน้า รพ.มหาราช',
                ].map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => updateField('location', loc)}
                    className="text-[10px] px-2 py-0.5 rounded bg-[#252323] text-[#e4beba] hover:text-white border border-[#362e2d]"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CARD 3: รายละเอียดอุบัติเหตุทางรถ (VEHICLES INVOLVED: คันที่ 1-2-3...) */}
      <div className="rounded-xl bg-[#191415] border border-[#361a1d] shadow-md overflow-hidden">
        <div
          onClick={() => toggleAccordion('secVehicles')}
          className="px-4 py-3 bg-[#221315] border-b border-[#361a1d] flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#38bdf8] text-[20px]">
              directions_car
            </span>
            <div className="flex items-center gap-2">
              <span className="font-headline-md text-sm font-bold text-white">
                ส่วนที่ 3: ข้อมูลยานพาหนะคู่กรณี (คันที่ 1, 2, 3...)
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#38bdf8]/20 text-[#38bdf8]">
                {report.vehicles?.length || 0} คัน
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#e4beba] text-[20px]">
            {collapsed.secVehicles ? 'expand_more' : 'expand_less'}
          </span>
        </div>

        {!collapsed.secVehicles && (
          <div className="p-4 space-y-4">
            <RenderVisibilityToggle sectionKey="vehicles" label="รายละเอียดข้อมูลรถที่เกิดเหตุ" />

            <div className="flex items-center justify-between">
              <span className="text-xs text-[#e4beba]">
                กรณีเกิดอุบัติเหตุ สามารถเพิ่มข้อมูลรถคู่กรณีได้ไม่จำกัด (คันที่ 1, 2, 3...)
              </span>
              <button
                type="button"
                onClick={handleAddVehicle}
                className="h-8 px-3 rounded-lg bg-[#38bdf8] hover:bg-[#0284c7] text-[#002f3c] font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>+ เพิ่มรถคันถัดไป</span>
              </button>
            </div>

            {/* List of Vehicles */}
            <div className="space-y-3">
              {(report.vehicles || []).map((veh, idx) => (
                <div
                  key={veh.id || idx}
                  className="p-3.5 rounded-xl bg-[#141212] border border-[#3a2f30] space-y-3 relative group"
                >
                  <div className="flex items-center justify-between border-b border-[#2d2526] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#ff5451] text-[#4a0005] font-extrabold text-xs flex items-center justify-center">
                        {veh.order || idx + 1}
                      </span>
                      <span className="font-bold text-xs text-white">
                        รถคันที่ {veh.order || idx + 1}
                      </span>
                      <span className="text-[11px] text-sky-400 font-medium">
                        [{veh.type || 'ไม่ระบุประเภท'}]
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveVehicle(idx)}
                      className="px-2 py-0.5 rounded bg-[#3b1212] hover:bg-[#ff5451] text-[#ffdad6] hover:text-[#5c0008] text-[11px] font-semibold flex items-center gap-1 transition-colors"
                      title="ลบรถคันนี้"
                    >
                      <span className="material-symbols-outlined text-[14px]">delete</span>
                      <span>ลบคันนี้</span>
                    </button>
                  </div>

                  {/* Vehicle Type Presets */}
                  <div className="flex flex-wrap gap-1">
                    {VEHICLE_TYPES.slice(0, 6).map((vt) => (
                      <button
                        key={vt}
                        type="button"
                        onClick={() => handleUpdateVehicle(idx, { type: vt })}
                        className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                          veh.type === vt
                            ? 'bg-[#38bdf8] text-[#002f3c] border-[#38bdf8] font-bold'
                            : 'bg-[#211f1f] text-[#e4beba] border-[#362e2d] hover:text-white'
                        }`}
                      >
                        {vt}
                      </button>
                    ))}
                  </div>

                  {/* Vehicle Fields Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] text-[#e4beba]">ยี่ห้อ / รุ่น</label>
                      <input
                        type="text"
                        value={veh.brandModel}
                        onChange={(e) => handleUpdateVehicle(idx, { brandModel: e.target.value })}
                        placeholder="เช่น Honda Wave 110i, Isuzu D-Max"
                        className="w-full h-8 px-2.5 rounded bg-[#1e1b1b] border border-[#3e3433] text-white text-xs focus:border-[#38bdf8] focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] text-[#e4beba]">สีตัวรถ</label>
                      <input
                        type="text"
                        value={veh.color}
                        onChange={(e) => handleUpdateVehicle(idx, { color: e.target.value })}
                        placeholder="เช่น สีดำ-แดง, สีขาว"
                        className="w-full h-8 px-2.5 rounded bg-[#1e1b1b] border border-[#3e3433] text-white text-xs focus:border-[#38bdf8] focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] text-[#e4beba]">หมายเลขทะเบียน & จังหวัด</label>
                      <input
                        type="text"
                        value={veh.plateNumber}
                        onChange={(e) => handleUpdateVehicle(idx, { plateNumber: e.target.value })}
                        placeholder="เช่น 1กข 1234 นม."
                        className="w-full h-8 px-2.5 rounded bg-[#1e1b1b] border border-[#3e3433] text-white text-xs focus:border-[#38bdf8] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] text-[#e4beba]">ผู้ขับขี่ / ผู้ครอบครอง</label>
                      <input
                        type="text"
                        value={veh.driverName || ''}
                        onChange={(e) => handleUpdateVehicle(idx, { driverName: e.target.value })}
                        placeholder="เช่น นาย ก. (บาดเจ็บนำส่ง รพ.) หรือ ไม่ทราบนาม"
                        className="w-full h-8 px-2.5 rounded bg-[#1e1b1b] border border-[#3e3433] text-white text-xs focus:border-[#38bdf8] focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] text-[#e4beba]">สภาพความเสียหาย</label>
                      <input
                        type="text"
                        value={veh.damageDesc || ''}
                        onChange={(e) => handleUpdateVehicle(idx, { damageDesc: e.target.value })}
                        placeholder="เช่น ด้านหน้าพังยับเยิน, ล้อหน้าคด, แฮนด์หัก"
                        className="w-full h-8 px-2.5 rounded bg-[#1e1b1b] border border-[#3e3433] text-white text-xs focus:border-[#38bdf8] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {(!report.vehicles || report.vehicles.length === 0) && (
                <div className="p-4 rounded-xl border border-dashed border-[#3a2f30] text-center space-y-2">
                  <span className="material-symbols-outlined text-[28px] text-neutral-500 block">
                    no_crash
                  </span>
                  <p className="text-xs text-[#a89f9e]">
                    ยังไม่มีข้อมูลยานพาหนะ (หากเป็นเคสอุบัติเหตุทางรถ กดปุ่มด้านล่างเพื่อเพิ่มข้อมูลรถคันที่ 1, 2, 3...)
                  </p>
                  <button
                    type="button"
                    onClick={handleAddVehicle}
                    className="px-3.5 py-1.5 rounded-lg bg-[#251f1f] hover:bg-[#32292a] text-[#ffdad6] border border-[#ff5451]/40 text-xs font-semibold inline-flex items-center gap-1.5 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#ff5451]">add_circle</span>
                    <span>+ เพิ่มรถคันที่ 1</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CARD 4: ข้อมูลผู้ป่วย / ผู้บาดเจ็บ (PATIENT PROFILE) */}
      <div className="rounded-xl bg-[#191415] border border-[#361a1d] shadow-md overflow-hidden">
        <div
          onClick={() => toggleAccordion('secPatient')}
          className="px-4 py-3 bg-[#221315] border-b border-[#361a1d] flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">
              person
            </span>
            <span className="font-headline-md text-sm font-bold text-white">
              ส่วนที่ 4: ข้อมูลผู้ป่วย & ที่อยู่
            </span>
          </div>
          <span className="material-symbols-outlined text-[#e4beba] text-[20px]">
            {collapsed.secPatient ? 'expand_more' : 'expand_less'}
          </span>
        </div>

        {!collapsed.secPatient && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <RenderVisibilityToggle sectionKey="patientInfo" label="ข้อมูลผู้ป่วย (เพศ/ชื่อ/อายุ)" />
              <RenderVisibilityToggle sectionKey="patientAddress" label="ที่อยู่ผู้ป่วย" />
            </div>

            {/* Quick Presets for Demographics */}
            <div className="flex flex-wrap items-center gap-1.5 pb-1">
              <span className="text-[10px] text-neutral-400 font-semibold">ทางลัดเพศ:</span>
              {[
                { label: 'ชาย 1 ราย', val: 'ชาย 1 ราย' },
                { label: 'หญิง 1 ราย', val: 'หญิง 1 ราย' },
                { label: 'ชาย 2 ราย', val: 'ชาย 2 ราย' },
                { label: 'หญิง 2 ราย', val: 'หญิง 2 ราย' },
                { label: 'ไม่ทราบชื่อ/ไร้สติ', val: 'ไม่ทราบชื่อ-สกุล' },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    if (p.val === 'ไม่ทราบชื่อ-สกุล') {
                      updateField('patientName', 'ไม่ทราบนาม');
                    } else {
                      updateField('genderCount', p.val);
                    }
                  }}
                  className="text-[10px] px-2 py-0.5 rounded bg-[#252323] hover:bg-[#333030] text-[#ffdad6] border border-[#3e3433] active:scale-95"
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-4 flex flex-col gap-1">
                <label className="text-xs font-bold text-[#e4beba]">เพศ และ จำนวนราย</label>
                <input
                  type="text"
                  value={report.genderCount}
                  onChange={(e) => updateField('genderCount', e.target.value)}
                  placeholder="เช่น ชาย 1 ราย"
                  className="w-full h-10 px-3 rounded-lg bg-[#141313] border border-[#3e3433] text-white text-xs focus:border-[#4cd7f6] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-5 flex flex-col gap-1">
                <label className="text-xs font-bold text-[#e4beba]">ชื่อ-นามสกุล ผู้ป่วย</label>
                <input
                  type="text"
                  value={report.patientName}
                  onChange={(e) => updateField('patientName', e.target.value)}
                  placeholder="เช่น นายสมชาย ใจดี หรือ เว้นว่าง"
                  className="w-full h-10 px-3 rounded-lg bg-[#141313] border border-[#3e3433] text-white text-xs focus:border-[#4cd7f6] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-3 flex flex-col gap-1">
                <label className="text-xs font-bold text-[#e4beba]">อายุ</label>
                <input
                  type="text"
                  value={report.patientAge}
                  onChange={(e) => updateField('patientAge', e.target.value)}
                  placeholder="เช่น 35 ปี"
                  className="w-full h-10 px-3 rounded-lg bg-[#141313] border border-[#3e3433] text-white text-xs focus:border-[#4cd7f6] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#e4beba]">ที่อยู่ตามบัตร / ที่อยู่ปัจจุบัน</label>
              <textarea
                rows={2}
                value={report.patientAddress}
                onChange={(e) => updateField('patientAddress', e.target.value)}
                placeholder="เช่น 123 ม.4 ต.โพธิ์กลาง อ.เมือง จ.นครราชสีมา (หรือเว้นว่างถ้าไม่ทราบ)"
                className="w-full p-2.5 rounded-lg bg-[#141313] border border-[#3e3433] text-white text-xs focus:border-[#4cd7f6] focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* CARD 5: สัญญาณชีพ (VITAL SIGNS) */}
      <div className="rounded-xl bg-[#191415] border border-[#361a1d] shadow-md overflow-hidden">
        <div
          onClick={() => toggleAccordion('secVitals')}
          className="px-4 py-3 bg-[#221315] border-b border-[#361a1d] flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#06C755] text-[20px]">
              vital_signs
            </span>
            <span className="font-headline-md text-sm font-bold text-white">
              ส่วนที่ 5: สัญญาณชีพ (Vital Signs)
            </span>
          </div>
          <span className="material-symbols-outlined text-[#e4beba] text-[20px]">
            {collapsed.secVitals ? 'expand_more' : 'expand_less'}
          </span>
        </div>

        {!collapsed.secVitals && (
          <div className="p-4 space-y-4">
            <RenderVisibilityToggle sectionKey="vitals" label="สัญญาณชีพ Vital Signs" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* BP */}
              <div className="flex flex-col gap-1 p-2 rounded-lg bg-[#141313] border border-[#3e3433]">
                <label className="text-[11px] font-bold text-[#e4beba]">BP (ความดัน)</label>
                <input
                  type="text"
                  value={report.vitals?.bp || ''}
                  onChange={(e) => updateVitals('bp', e.target.value)}
                  placeholder="เช่น 120/80"
                  className="w-full h-8 px-2 rounded bg-[#1c1b1b] border border-[#2b2a29] text-white text-xs font-mono focus:outline-none"
                />
                <span className="text-[9px] text-neutral-400">mmHg</span>
              </div>

              {/* PR */}
              <div className="flex flex-col gap-1 p-2 rounded-lg bg-[#141313] border border-[#3e3433]">
                <label className="text-[11px] font-bold text-[#e4beba]">PR (ชีพจร)</label>
                <input
                  type="text"
                  value={report.vitals?.pr || ''}
                  onChange={(e) => updateVitals('pr', e.target.value)}
                  placeholder="เช่น 84"
                  className="w-full h-8 px-2 rounded bg-[#1c1b1b] border border-[#2b2a29] text-white text-xs font-mono focus:outline-none"
                />
                <span className="text-[9px] text-neutral-400">bpm</span>
              </div>

              {/* SpO2 */}
              <div className="flex flex-col gap-1 p-2 rounded-lg bg-[#141313] border border-[#3e3433]">
                <label className="text-[11px] font-bold text-[#e4beba]">SpO2 (ออกซิเจน)</label>
                <input
                  type="text"
                  value={report.vitals?.spo2 || ''}
                  onChange={(e) => updateVitals('spo2', e.target.value)}
                  placeholder="เช่น 98"
                  className="w-full h-8 px-2 rounded bg-[#1c1b1b] border border-[#2b2a29] text-white text-xs font-mono focus:outline-none"
                />
                <span className="text-[9px] text-neutral-400">% in room air</span>
              </div>

              {/* Temp */}
              <div className="flex flex-col gap-1 p-2 rounded-lg bg-[#141313] border border-[#3e3433]">
                <label className="text-[11px] font-bold text-[#e4beba]">Temp (อุณหภูมิ)</label>
                <input
                  type="text"
                  value={report.vitals?.temp || ''}
                  onChange={(e) => updateVitals('temp', e.target.value)}
                  placeholder="เช่น 36.8"
                  className="w-full h-8 px-2 rounded bg-[#1c1b1b] border border-[#2b2a29] text-white text-xs font-mono focus:outline-none"
                />
                <span className="text-[9px] text-neutral-400">°C</span>
              </div>
            </div>

            {/* Extra vitals: GCS & DTX */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-medium text-[#e4beba]">
                  GCS (ระดับความรู้สึกตัว)
                </label>
                <input
                  type="text"
                  value={report.vitals?.gcs || ''}
                  onChange={(e) => updateVitals('gcs', e.target.value)}
                  placeholder="เช่น E4V5M6 (15)"
                  className="w-full h-8 px-2.5 rounded bg-[#141313] border border-[#3e3433] text-white text-xs font-mono focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-medium text-[#e4beba]">
                  DTX (ระดับน้ำตาลปลายนิ้ว)
                </label>
                <input
                  type="text"
                  value={report.vitals?.dtx || ''}
                  onChange={(e) => updateVitals('dtx', e.target.value)}
                  placeholder="เช่น 110 mg/dL"
                  className="w-full h-8 px-2.5 rounded bg-[#141313] border border-[#3e3433] text-white text-xs font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CARD 6: โรงพยาบาลปลายทาง, สถานีตำรวจ, เจ้าหน้าที่ & หมายเหตุ */}
      <div className="rounded-xl bg-[#191415] border border-[#361a1d] shadow-md overflow-hidden">
        <div
          onClick={() => toggleAccordion('secDestination')}
          className="px-4 py-3 bg-[#221315] border-b border-[#361a1d] flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff5451] text-[20px]">
              local_hospital
            </span>
            <span className="font-headline-md text-sm font-bold text-white">
              ส่วนที่ 6: รพ.ปลายทาง, สภ., จนท.ปฏิบัติการ & หมายเหตุ
            </span>
          </div>
          <span className="material-symbols-outlined text-[#e4beba] text-[20px]">
            {collapsed.secDestination ? 'expand_more' : 'expand_less'}
          </span>
        </div>

        {!collapsed.secDestination && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <RenderVisibilityToggle sectionKey="hospital" label="รพ.ปลายทาง" />
              <RenderVisibilityToggle sectionKey="policeStation" label="สถานีตำรวจ" />
              <RenderVisibilityToggle sectionKey="officerName" label="ร้อยเวร" />
              <RenderVisibilityToggle sectionKey="crew" label="เจ้าหน้าที่/กำลังพล" />
              <RenderVisibilityToggle sectionKey="notes" label="รายละเอียดเพิ่มเติม" />
            </div>

            {/* Destination Hospital */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#e4beba]">โรงพยาบาลปลายทาง (นำส่ง)</label>
              <input
                type="text"
                value={report.hospital}
                onChange={(e) => updateField('hospital', e.target.value)}
                placeholder="เช่น รพ.เทพรัตน์นครราชสีมา, รพ.มหาราช"
                className="w-full h-10 px-3 rounded-lg bg-[#141313] border border-[#3e3433] text-white text-xs focus:border-[#ff5451] focus:outline-none"
              />
              <div className="flex flex-wrap gap-1 mt-1">
                {HOSPITALS_KORAT.slice(0, 5).map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => updateField('hospital', h)}
                    className="text-[10px] px-2 py-0.5 rounded bg-[#252323] text-[#e4beba] hover:text-white border border-[#362e2d]"
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            {/* Police Station & Officer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#e4beba]">ท้องที่สถานีตำรวจ (สภ.)</label>
                <input
                  type="text"
                  value={report.policeStation}
                  onChange={(e) => updateField('policeStation', e.target.value)}
                  placeholder="เช่น สภ.โพธิ์กลาง, สภ.เมืองนครราชสีมา"
                  className="w-full h-10 px-3 rounded-lg bg-[#141313] border border-[#3e3433] text-white text-xs focus:border-[#ff5451] focus:outline-none"
                />
                <div className="flex flex-wrap gap-1 mt-1">
                  {POLICE_STATIONS.slice(0, 3).map((ps) => (
                    <button
                      key={ps}
                      type="button"
                      onClick={() => updateField('policeStation', ps)}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#252323] text-[#e4beba] hover:text-white border border-[#362e2d]"
                    >
                      {ps}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#e4beba]">ร้อยเวรเจ้าของคดี / ร้อยเวร ว.30</label>
                <input
                  type="text"
                  value={report.officerName}
                  onChange={(e) => updateField('officerName', e.target.value)}
                  placeholder="เช่น ร.ต.อ.สมศักดิ์ หรือ เว้นว่าง"
                  className="w-full h-10 px-3 rounded-lg bg-[#141313] border border-[#3e3433] text-white text-xs focus:border-[#ff5451] focus:outline-none"
                />
              </div>
            </div>

            {/* Crew / Responders */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#e4beba]">
                เจ้าหน้าที่กู้ชีพ-กู้ภัย / กำลังพลปฏิบัติหน้าที่ ว.4
              </label>
              <input
                type="text"
                value={report.crew}
                onChange={(e) => updateField('crew', e.target.value)}
                placeholder="เช่น พบ.32, พบ.34, ข้างสภ.220"
                className="w-full h-10 px-3 rounded-lg bg-[#141313] border border-[#3e3433] text-white text-xs focus:border-[#ff5451] focus:outline-none"
              />
            </div>

            {/* Notes / First Aid Actions */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#e4beba]">
                การปฐมพยาบาลเบื้องต้น / รายละเอียดการช่วยเหลือเพิ่มเติม
              </label>
              <textarea
                rows={2}
                value={report.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="เช่น ดามคอ ดามขา ห้ามเลือด ให้ออกซิเจนแคนนูล่า นำส่งห้องฉุกเฉินเป็นที่เรียบร้อย..."
                className="w-full p-2.5 rounded-lg bg-[#141313] border border-[#3e3433] text-white text-xs focus:border-[#ff5451] focus:outline-none"
              />
              <div className="flex flex-wrap gap-1 mt-1">
                {[
                  'ทำแผล ปฐมพยาบาลเบื้องต้น นำส่ง รพ.',
                  'ดามบล็อคคอ (Hard Collar) ใส่บอร์ด นำส่ง รพ.',
                  'ให้ออกซิเจนแคนนูล่า 3 LPM นำส่ง รพ.',
                  'ผู้บาดเจ็บรู้สึกตัวดี ปฏิเสธไป รพ.',
                ].map((note) => (
                  <button
                    key={note}
                    type="button"
                    onClick={() => updateField('notes', note)}
                    className="text-[10px] px-2 py-0.5 rounded bg-[#252323] text-[#e4beba] hover:text-white border border-[#362e2d]"
                  >
                    {note}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
