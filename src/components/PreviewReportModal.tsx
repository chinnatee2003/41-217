import React, { useState } from 'react';
import { IncidentReport, SectionVisibility } from '../types';
import { generateLineReport } from '../utils/formatters';

interface PreviewReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: IncidentReport;
  visibility: SectionVisibility;
  onCopyText: () => void;
  onDownloadPdf: () => void;
  onPrintReport: () => void;
}

export const PreviewReportModal: React.FC<PreviewReportModalProps> = ({
  isOpen,
  onClose,
  report,
  visibility,
  onCopyText,
  onDownloadPdf,
  onPrintReport,
}) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const formattedText = generateLineReport(report, visibility, false);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedText).then(() => {
      setCopied(true);
      onCopyText();
      setTimeout(() => setCopied(false), 1200);
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#1c1214] border border-[#3b1215] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] my-auto overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#251315] border-b border-[#3b1215] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sky-400 text-[22px]">
              visibility
            </span>
            <span className="font-headline-md text-sm sm:text-base text-white font-bold">
              ตัวอย่างรายงานฉบับสมบูรณ์ (Preview)
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#2b2a29] text-[#e4beba] hover:text-white hover:bg-[#383635] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 bg-[#110c0d]">
          <div className="p-4 rounded-xl bg-[#1f1315] border border-[#3b1c20] text-slate-100 select-text">
            <pre className="font-sans text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
              {formattedText}
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 bg-[#251315] border-t border-[#3b1215] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#06C755] hover:bg-[#05b34c] text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอกข้อความ LINE'}</span>
            </button>

            <button
              onClick={onDownloadPdf}
              className="px-3 py-1.5 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
              <span>โหลด PDF</span>
            </button>

            <button
              onClick={onPrintReport}
              className="px-3 py-1.5 rounded-lg bg-[#2b2a29] hover:bg-[#383635] text-white border border-[#3e3433] text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>พิมพ์</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-[#e4beba] hover:text-white"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
