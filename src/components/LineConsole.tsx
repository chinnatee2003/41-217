import React, { useState } from 'react';
import { IncidentReport, SectionVisibility, ShiftStats } from '../types';
import { generateLineReport } from '../utils/formatters';

interface LineConsoleProps {
  report: IncidentReport;
  visibility: SectionVisibility;
  stats: ShiftStats;
  onCopySuccess: () => void;
  onOpenLine: () => void;
  onPrintRunSheet: () => void;
  onDownloadPdf: () => void;
  onSaveCaseToLog: () => void;
  onNewReport: () => void;
}

export const LineConsole: React.FC<LineConsoleProps> = ({
  report,
  visibility,
  onCopySuccess,
  onOpenLine,
  onPrintRunSheet,
  onDownloadPdf,
  onSaveCaseToLog,
  onNewReport,
}) => {
  const [copiedEffect, setCopiedEffect] = useState(false);
  const formattedText = generateLineReport(report, visibility, false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(formattedText)
      .then(() => {
        setCopiedEffect(true);
        onCopySuccess();
        setTimeout(() => setCopiedEffect(false), 800);
      })
      .catch(() => {
        const textArea = document.createElement('textarea');
        textArea.value = formattedText;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          setCopiedEffect(true);
          onCopySuccess();
          setTimeout(() => setCopiedEffect(false), 800);
        } catch {
          // ignore
        }
        document.body.removeChild(textArea);
      });
  };

  return (
    <div className="flex flex-col gap-4 lg:sticky lg:top-24">
      {/* LINE Bubble Card Simulator */}
      <div className="rounded-xl bg-[#191415] border border-[#3b1215] shadow-xl overflow-hidden flex flex-col">
        {/* LINE Header Strip */}
        <div className="px-4 py-3 bg-[#241315] border-b border-[#3b1215] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#06C755] flex items-center justify-center font-bold text-white text-[12px] shadow-sm tracking-tighter">
              LINE
            </div>
            <div className="flex flex-col">
              <span className="font-headline-md text-sm md:text-base text-white font-bold leading-tight">
                กลุ่มกู้ภัย ฮุก 31 นครราชสีมา
              </span>
              <span className="font-label-tactical text-[11px] text-[#ff8885]">
                ตัวอย่างข้อความพร้อมส่ง (LIVE LINE PREVIEW)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#06C755] animate-ping"></span>
            <span className="text-[11px] font-bold text-[#06C755]">พร้อมส่ง</span>
          </div>
        </div>

        {/* LINE Chat Interior */}
        <div className="p-4 bg-[#110c0d] min-h-[360px] max-h-[500px] overflow-y-auto space-y-3">
          <div className="flex items-start gap-2.5">
            {/* Avatar 31 */}
            <div className="w-8 h-8 rounded-full bg-[#ff5451] text-[#4a0005] flex items-center justify-center text-xs font-black flex-shrink-0 mt-1 shadow-sm">
              31
            </div>

            <div className="flex flex-col max-w-[94%]">
              <span className="text-[11px] text-[#e4beba] mb-1 ml-1">
                {report.station || 'จุดบริการ ฮุก 31 นครราชสีมา'}
              </span>

              {/* Message Bubble */}
              <div className="p-3.5 rounded-xl rounded-tl-xs bg-[#221618] border border-[#3b1c20] text-white shadow-md select-text relative">
                <pre className="font-sans text-xs md:text-[13px] leading-relaxed whitespace-pre-wrap font-normal break-words text-slate-100">
                  {formattedText}
                </pre>
                <div className="mt-2.5 pt-1.5 border-t border-[#3b1c20] flex items-center justify-between text-[#e4beba] text-[11px] opacity-80">
                  <span>มูลนิธิพุทธธรรม 31 นครราชสีมา</span>
                  <span>{report.timestamp || 'เวลาปัจจุบัน'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls Footer */}
        <div className="p-3.5 bg-[#1f1214] border-t border-[#3b1215] flex flex-col gap-2">
          {/* Main Action: คัดลอกข้อความ */}
          <button
            type="button"
            onClick={handleCopy}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] ${
              copiedEffect
                ? 'bg-emerald-500 text-white scale-100'
                : 'bg-[#06C755] hover:bg-[#05b34c] text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {copiedEffect ? 'check' : 'content_copy'}
            </span>
            <span>{copiedEffect ? 'คัดลอกข้อความเรียบร้อยแล้ว!' : 'คัดลอกข้อความส่งเข้า LINE'}</span>
          </button>

          {/* Secondary Actions Grid */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onOpenLine}
              className="py-2 px-3 rounded-lg bg-[#251517] hover:bg-[#341b1e] border border-[#3b1215] text-[#ffdad6] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-[#06C755]">chat</span>
              <span>เปิดแอป LINE</span>
            </button>

            <button
              type="button"
              onClick={onDownloadPdf}
              className="py-2 px-3 rounded-lg bg-[#0284c7]/20 hover:bg-[#0284c7]/30 border border-[#0284c7]/40 text-[#7dd3fc] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
              <span>ดาวน์โหลด PDF</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onPrintRunSheet}
              className="py-2 px-3 rounded-lg bg-[#251517] hover:bg-[#341b1e] border border-[#3b1215] text-[#ffdad6] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-amber-400">print</span>
              <span>พิมพ์ใบ Run Sheet A4</span>
            </button>

            <button
              type="button"
              onClick={onNewReport}
              className="py-2 px-3 rounded-lg bg-[#3b1215] hover:bg-[#521a1e] border border-[#ff5451]/50 text-[#ffb3ad] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-[#ff5451]">restart_alt</span>
              <span>เริ่มเคสใหม่</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onSaveCaseToLog}
            className="w-full py-1.5 text-center text-xs text-[#e4beba] hover:text-white flex items-center justify-center gap-1 mt-0.5"
          >
            <span className="material-symbols-outlined text-[15px]">bookmark</span>
            <span>บันทึกเข้าประวัติเคสประจำวัน</span>
          </button>
        </div>
      </div>
    </div>
  );
};
