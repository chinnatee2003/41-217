import React, { useState } from 'react';
import { IncidentReport, ShiftStats } from '../types';
import { generateLineReport } from '../utils/formatters';

interface LineConsoleProps {
  report: IncidentReport;
  stats: ShiftStats;
  onCopySuccess: () => void;
  onOpenLine: () => void;
  onPrintRunSheet: () => void;
  onSaveCaseToLog: () => void;
}

export const LineConsole: React.FC<LineConsoleProps> = ({
  report,
  stats,
  onCopySuccess,
  onOpenLine,
  onPrintRunSheet,
  onSaveCaseToLog,
}) => {
  const [copiedEffect, setCopiedEffect] = useState(false);
  const formattedText = generateLineReport(report);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(formattedText)
      .then(() => {
        setCopiedEffect(true);
        onCopySuccess();
        setTimeout(() => setCopiedEffect(false), 800);
      })
      .catch(() => {
        // Fallback for older environments or strict iframes
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
      <div className="rounded-xl bg-[#1c1b1b] border border-[#2e2423] shadow-xl overflow-hidden flex flex-col">
        {/* LINE Header Strip */}
        <div className="px-4 py-3 bg-[#211f1f] border-b border-[#2e2423] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#06C755] flex items-center justify-center font-bold text-white text-[12px] shadow-sm tracking-tighter">
              LINE
            </div>
            <div className="flex flex-col">
              <span className="font-headline-md text-sm md:text-base text-[#e6e1e1] font-bold leading-tight">
                กลุ่มกู้ภัย ฮุก 31 โพธิ์กลาง
              </span>
              <span className="font-label-tactical text-[11px] text-[#4cd7f6]">
                ว.8 DISPATCH BROADCAST FEED
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#06C755] animate-ping"></span>
            <span className="font-label-tactical text-[11px] text-[#e4beba]">
              LIVE PREVIEW
            </span>
          </div>
        </div>

        {/* LINE Chat Interior */}
        <div className="p-4 bg-[#0f0e0e] min-h-[380px] max-h-[520px] overflow-y-auto space-y-3">
          <div className="flex items-start gap-2.5">
            {/* Avatar 31 */}
            <div className="w-8 h-8 rounded-full bg-[#ff5451] text-[#5c0008] flex items-center justify-center font-label-tactical text-xs font-bold flex-shrink-0 mt-1 shadow-sm">
              31
            </div>

            <div className="flex flex-col max-w-[94%]">
              <span className="font-label-tactical text-[11px] text-[#e4beba] mb-1 ml-1">
                จุดข้าง สภ.โพธิ์กลาง (ว.8 Relay)
              </span>

              {/* Tactical Message Bubble */}
              <div className="p-3.5 rounded-xl rounded-tl-xs bg-[#2b2a29] border border-[#3e3433] text-[#e6e1e1] shadow-md select-text relative group">
                <pre className="font-label-tactical text-xs md:text-[13px] leading-relaxed whitespace-pre-wrap font-medium break-words text-[#e6e1e1]">
                  {formattedText}
                </pre>
                <div className="mt-2.5 pt-1.5 border-t border-[#3a302f] flex items-center justify-between text-[#e4beba] font-label-tactical text-[11px] opacity-80">
                  <span>ฮุก 31 นครราชสีมา</span>
                  <span>{report.timestamp || '15:46 น.'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Actions Hub */}
        <div className="p-4 bg-[#211f1f] border-t border-[#2e2423] space-y-2.5">
          {/* Quick Copy Button (Primary Hero Target) */}
          <button
            onClick={handleCopy}
            className={`w-full h-14 rounded-xl font-headline-md text-base md:text-lg font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] ${
              copiedEffect
                ? 'bg-[#049f43] text-white scale-[0.99] ring-2 ring-[#06C755]'
                : 'bg-[#06C755] hover:bg-[#05b34c] text-white'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">
              {copiedEffect ? 'done_all' : 'content_copy'}
            </span>
            <span>
              {copiedEffect ? 'คัดลอกข้อความสำเร็จแล้ว!' : 'คัดลอกข้อความลง LINE (คลิกเดียว)'}
            </span>
          </button>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onOpenLine}
              className="h-11 px-2.5 rounded-lg bg-[#363434] hover:bg-[#3a3939] text-[#e6e1e1] font-label-tactical text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors border border-[#443837]"
              type="button"
            >
              <span className="material-symbols-outlined text-[#06C755] text-[18px]">
                send
              </span>
              <span>เปิดแอป LINE</span>
            </button>

            <button
              onClick={onPrintRunSheet}
              className="h-11 px-2.5 rounded-lg bg-[#363434] hover:bg-[#3a3939] text-[#4cd7f6] font-label-tactical text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors border border-[#443837]"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>พิมพ์ใบรายงาน EMS</span>
            </button>
          </div>

          {/* Quick save button to save current incident to daily log */}
          <button
            onClick={onSaveCaseToLog}
            className="w-full h-9 rounded-lg bg-[#2b2a29] hover:bg-[#323030] text-[#ffb95f] hover:text-white font-label-tactical text-xs flex items-center justify-center gap-1.5 transition-colors border border-[#3e3433]"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">bookmark_added</span>
            <span>บันทึกเคสนี้เข้าสถิติเวรประจำวัน</span>
          </button>
        </div>
      </div>

      {/* Shift Live Counter Widget */}
      <div className="rounded-xl bg-[#1c1b1b] border border-[#2e2423] p-4 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="font-label-tactical text-[11px] text-[#e4beba] uppercase flex items-center gap-1 font-semibold">
            <span className="material-symbols-outlined text-[#ffb95f] text-[16px]">
              analytics
            </span>
            สถิติเคสเวรวันนี้ (สภ.โพธิ์กลาง)
          </span>
          <span className="font-label-tactical text-xs text-[#4cd7f6] font-bold">
            รวม {stats.total} เคส
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-lg bg-[#0f0e0e] border border-[#2e2423]">
            <div className="font-headline-md text-xl md:text-2xl text-[#4cd7f6] font-bold tabular-nums">
              {stats.illness}
            </div>
            <div className="font-label-tactical text-[11px] text-[#e4beba] mt-0.5">
              ว.8 ป่วย
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#0f0e0e] border border-[#2e2423]">
            <div className="font-headline-md text-xl md:text-2xl text-[#ffb95f] font-bold tabular-nums">
              {stats.accident}
            </div>
            <div className="font-label-tactical text-[11px] text-[#e4beba] mt-0.5">
              ว.40 รถชน
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#0f0e0e] border border-[#2e2423]">
            <div className="font-headline-md text-xl md:text-2xl text-[#ff5451] font-bold tabular-nums">
              {stats.cpr}
            </div>
            <div className="font-label-tactical text-[11px] text-[#e4beba] mt-0.5">
              CPR วิกฤต
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
