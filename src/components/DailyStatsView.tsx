import React, { useState } from 'react';
import { IncidentReport, ShiftStats } from '../types';
import { generateLineReport } from '../utils/formatters';

interface DailyStatsViewProps {
  cases: IncidentReport[];
  stats: ShiftStats;
  onSelectCase: (c: IncidentReport) => void;
  onShowToast: (title: string, desc: string, icon?: string) => void;
}

export const DailyStatsView: React.FC<DailyStatsViewProps> = ({
  cases,
  stats,
  onSelectCase,
  onShowToast,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [previewCase, setPreviewCase] = useState<IncidentReport | null>(null);

  const filteredCases = cases.filter((c) => {
    const matchesFilter =
      filterType === 'all' ? true : c.incidentType === filterType;
    const matchesSearch =
      !searchTerm ||
      c.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.symptoms.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCopySingleCase = (c: IncidentReport) => {
    const text = generateLineReport(c);
    navigator.clipboard.writeText(text).then(() => {
      onShowToast('คัดลอกเคสแล้ว', `เคส ${c.caseId} ถูกคัดลอกลงคลิปบอร์ดแล้ว`, 'content_copy');
    });
  };

  const handleExportCsv = () => {
    const headers = [
      'ลำดับเคส',
      'เวลา',
      'ประเภท',
      'รถพยาบาล',
      'อาการ',
      'สถานที่',
      'ผู้ป่วย',
      'อายุ',
      'BP',
      'PR',
      'SpO2',
      'Temp',
      'โรงพยาบาล',
      'กำลังพล',
    ];
    const rows = cases.map((c) => [
      `"${c.caseId}"`,
      `"${c.timestamp}"`,
      `"${c.incidentType}"`,
      `"${c.unit}"`,
      `"${c.symptoms.replace(/"/g, '""')}"`,
      `"${c.location.replace(/"/g, '""')}"`,
      `"${c.patientName.replace(/"/g, '""')}"`,
      `"${c.patientAge}"`,
      `"${c.vitals.bp}"`,
      `"${c.vitals.pr}"`,
      `"${c.vitals.spo2}"`,
      `"${c.vitals.temp}"`,
      `"${c.hospital}"`,
      `"${c.crew.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `hook31-shift-summary-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('ส่งออก CSV สำเร็จ', 'ดาวน์โหลดไฟล์สรุปเวรประจำวันเรียบร้อย', 'download');
  };

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 md:px-6 py-6 space-y-6">
      {/* Top Banner & KPI Stat Cards */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#1c1b1b] border border-[#2e2423] p-5 rounded-xl shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-full bg-[#ffb95f] inline-block"></span>
            <h2 className="font-headline-md text-xl md:text-2xl font-bold text-[#e6e1e1]">
              สถิติการออกเหตุประจำวัน | สภ.โพธิ์กลาง
            </h2>
          </div>
          <p className="font-body-md text-xs md:text-sm text-[#e4beba] mt-1">
            สรุปยอดรายงาน ว.8 ประจำเวร วันที่ {cases[0]?.dateStr || 'วันนี้'} ศูนย์วิทยุ ฮุก 31 นครราชสีมา
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleExportCsv}
            className="h-10 px-4 rounded-lg bg-[#2b2a29] hover:bg-[#363434] text-[#4cd7f6] font-label-tactical text-xs font-semibold flex items-center justify-center gap-2 border border-[#3e3433] transition-colors shadow"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>ส่งออกตาราง CSV</span>
          </button>
        </div>
      </div>

      {/* KPI 4-Card Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Total */}
        <div className="p-4 rounded-xl bg-[#1c1b1b] border border-[#2e2423] shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-tactical text-xs text-[#e4beba] uppercase">
              ยอดรวมเคสทั้งหมด
            </span>
            <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">
              checklist
            </span>
          </div>
          <div className="font-headline-md text-3xl font-bold text-[#e6e1e1] mt-2 tabular-nums">
            {stats.total}
          </div>
          <div className="text-[11px] font-label-tactical text-[#4cd7f6] mt-1">
            เคสในผลัดเวรวันนี้
          </div>
        </div>

        {/* Illness */}
        <div className="p-4 rounded-xl bg-[#1c1b1b] border border-[#2e2423] shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-tactical text-xs text-[#e4beba] uppercase">
              ว.8 เจ็บป่วยทั่วไป
            </span>
            <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">
              medical_services
            </span>
          </div>
          <div className="font-headline-md text-3xl font-bold text-[#4cd7f6] mt-2 tabular-nums">
            {stats.illness}
          </div>
          <div className="text-[11px] font-label-tactical text-[#e4beba] mt-1">
            {stats.total ? Math.round((stats.illness / stats.total) * 100) : 0}% ของเคสทั้งหมด
          </div>
        </div>

        {/* Traffic accident */}
        <div className="p-4 rounded-xl bg-[#1c1b1b] border border-[#2e2423] shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-tactical text-xs text-[#e4beba] uppercase">
              ว.40 อุบัติเหตุจราจร
            </span>
            <span className="material-symbols-outlined text-[#ffb95f] text-[20px]">
              car_crash
            </span>
          </div>
          <div className="font-headline-md text-3xl font-bold text-[#ffb95f] mt-2 tabular-nums">
            {stats.accident}
          </div>
          <div className="text-[11px] font-label-tactical text-[#e4beba] mt-1">
            {stats.total ? Math.round((stats.accident / stats.total) * 100) : 0}% ของเคสทั้งหมด
          </div>
        </div>

        {/* CPR / Critical */}
        <div className="p-4 rounded-xl bg-[#1c1b1b] border border-[#2e2423] shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-tactical text-xs text-[#e4beba] uppercase">
              CPR / ฉุกเฉินวิกฤต
            </span>
            <span className="material-symbols-outlined text-[#ff5451] text-[20px]">
              e911_emergency
            </span>
          </div>
          <div className="font-headline-md text-3xl font-bold text-[#ff5451] mt-2 tabular-nums">
            {stats.cpr}
          </div>
          <div className="text-[11px] font-label-tactical text-[#ffb3ad] mt-1">
            เคสระดับสีแดง (ALS)
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#1c1b1b] border border-[#2e2423] p-4 rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm">
        {/* Category Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg font-label-tactical text-xs transition-colors whitespace-nowrap ${
              filterType === 'all'
                ? 'bg-[#ff5451] text-[#5c0008] font-bold shadow'
                : 'bg-[#2b2a29] text-[#e4beba] hover:text-white'
            }`}
          >
            ทั้งหมด ({cases.length})
          </button>
          <button
            onClick={() => setFilterType('illness')}
            className={`px-3 py-1.5 rounded-lg font-label-tactical text-xs transition-colors whitespace-nowrap ${
              filterType === 'illness'
                ? 'bg-[#4cd7f6] text-[#003640] font-bold shadow'
                : 'bg-[#2b2a29] text-[#e4beba] hover:text-white'
            }`}
          >
            ว.8 ป่วย ({stats.illness})
          </button>
          <button
            onClick={() => setFilterType('accident')}
            className={`px-3 py-1.5 rounded-lg font-label-tactical text-xs transition-colors whitespace-nowrap ${
              filterType === 'accident'
                ? 'bg-[#ffb95f] text-[#472a00] font-bold shadow'
                : 'bg-[#2b2a29] text-[#e4beba] hover:text-white'
            }`}
          >
            ว.40 อุบัติเหตุ ({stats.accident})
          </button>
          <button
            onClick={() => setFilterType('cpr')}
            className={`px-3 py-1.5 rounded-lg font-label-tactical text-xs transition-colors whitespace-nowrap ${
              filterType === 'cpr'
                ? 'bg-[#ff5451] text-[#5c0008] font-bold shadow'
                : 'bg-[#2b2a29] text-[#e4beba] hover:text-white'
            }`}
          >
            CPR วิกฤต ({stats.cpr})
          </button>
        </div>

        {/* Search input */}
        <div className="h-10 px-3 rounded-lg bg-[#0f0e0e] border border-[#2e2423] text-[#e6e1e1] flex items-center min-w-[260px] shadow-inner focus-within:border-[#ffb3ad]">
          <span className="material-symbols-outlined text-[#e4beba] text-[18px] mr-2">
            search
          </span>
          <input
            className="w-full bg-transparent text-sm focus:outline-none placeholder-[#888]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาเคส, ชื่อ, สถานที่..."
            type="text"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-[#e4beba] hover:text-white ml-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Case List Table / Cards */}
      <div className="bg-[#1c1b1b] border border-[#2e2423] rounded-xl overflow-hidden shadow">
        <div className="px-5 py-3.5 bg-[#211f1f] border-b border-[#2e2423] flex items-center justify-between">
          <span className="font-headline-md text-sm md:text-base font-bold text-[#e6e1e1]">
            บันทึกการออกเหตุ ({filteredCases.length} รายการ)
          </span>
          <span className="font-label-tactical text-[11px] text-[#e4beba]">
            คลิกที่เคสเพื่อโหลดฟอร์ม หรือดูรายละเอียด
          </span>
        </div>

        <div className="divide-y divide-[#2e2423] overflow-x-auto">
          {filteredCases.length === 0 ? (
            <div className="p-8 text-center text-[#e4beba] font-body-md text-sm">
              ไม่พบข้อมูลเคสที่ตรงกับเงื่อนไขการค้นหา
            </div>
          ) : (
            filteredCases.map((c) => (
              <div
                key={c.id}
                className="p-4 hover:bg-[#252323] transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-3"
              >
                {/* Left case snippet */}
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-label-tactical text-xs font-bold flex-shrink-0 mt-0.5 ${
                      c.incidentType === 'cpr'
                        ? 'bg-[#93000a] text-[#ffdad6]'
                        : c.incidentType === 'accident'
                        ? 'bg-[#ffb95f]/20 text-[#ffb95f]'
                        : 'bg-[#4cd7f6]/20 text-[#4cd7f6]'
                    }`}
                  >
                    {c.caseId.replace(/[^0-9]/g, '') || '#'}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-headline-md font-bold text-sm text-[#e6e1e1]">
                        {c.caseId}
                      </span>
                      <span className="font-label-tactical text-[11px] text-[#4cd7f6] bg-[#0f0e0e] px-2 py-0.5 rounded border border-[#2e2423]">
                        {c.timestamp}
                      </span>
                      <span className="font-label-tactical text-[11px] text-[#ffb95f]">
                        {c.unit}
                      </span>
                    </div>

                    <div className="text-xs text-[#ffdad6] font-medium">
                      ⚠️ {c.symptoms}
                    </div>

                    <div className="text-[11px] text-[#e4beba] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] text-[#ffb3ad]">
                        pin_drop
                      </span>
                      <span className="truncate max-w-md">{c.location}</span>
                    </div>

                    {c.patientName && (
                      <div className="text-[11px] text-[#e4beba]">
                        👤 {c.patientName} ({c.patientAge || '-'}) | Vital: BP {c.vitals.bp} PR{' '}
                        {c.vitals.pr} SpO2 {c.vitals.spo2}%
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-2 flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#2e2423]">
                  <button
                    onClick={() => handleCopySingleCase(c)}
                    className="h-8 px-2.5 rounded bg-[#06C755]/20 hover:bg-[#06C755] text-[#06C755] hover:text-white font-label-tactical text-[11px] flex items-center gap-1 transition-colors border border-[#06C755]/40"
                    title="คัดลอกข้อความ LINE ของเคสนี้"
                  >
                    <span className="material-symbols-outlined text-[15px]">content_copy</span>
                    <span>LINE</span>
                  </button>

                  <button
                    onClick={() => setPreviewCase(c)}
                    className="h-8 px-2.5 rounded bg-[#2b2a29] hover:bg-[#363434] text-[#e4beba] hover:text-white font-label-tactical text-[11px] flex items-center gap-1 transition-colors border border-[#3e3433]"
                  >
                    <span className="material-symbols-outlined text-[15px]">visibility</span>
                    <span>ดูรายละเอียด</span>
                  </button>

                  <button
                    onClick={() => onSelectCase(c)}
                    className="h-8 px-3 rounded bg-[#ff5451] hover:bg-[#ff8885] text-[#5c0008] font-label-tactical text-[11px] font-bold flex items-center gap-1 transition-colors shadow"
                  >
                    <span className="material-symbols-outlined text-[15px]">edit</span>
                    <span>โหลดลงฟอร์ม</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Case Preview Detail Modal */}
      {previewCase && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#1c1b1b] border border-[#2e2423] rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2e2423] pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4cd7f6] text-[22px]">
                  assignment
                </span>
                <span className="font-headline-md font-bold text-base text-[#e6e1e1]">
                  รายละเอียด {previewCase.caseId} ({previewCase.timestamp})
                </span>
              </div>
              <button
                onClick={() => setPreviewCase(null)}
                className="p-1 rounded text-[#e4beba] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-[#0f0e0e] rounded-lg border border-[#2e2423]">
              <pre className="font-label-tactical text-xs leading-relaxed whitespace-pre-wrap text-[#e6e1e1]">
                {generateLineReport(previewCase)}
              </pre>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleCopySingleCase(previewCase)}
                className="h-9 px-3 rounded-lg bg-[#06C755] text-white font-label-tactical text-xs font-bold flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
                <span>คัดลอกข้อความ LINE</span>
              </button>
              <button
                onClick={() => {
                  onSelectCase(previewCase);
                  setPreviewCase(null);
                }}
                className="h-9 px-3 rounded-lg bg-[#ff5451] text-[#5c0008] font-label-tactical text-xs font-bold flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
                <span>แก้ไขในแบบฟอร์ม</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
