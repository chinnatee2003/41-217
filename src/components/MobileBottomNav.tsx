import React from 'react';

interface MobileBottomNavProps {
  onNewReport: () => void;
  onOpenPreview: () => void;
  onCopyText: () => void;
  onDownloadPdf: () => void;
  onPrintReport: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onNewReport,
  onOpenPreview,
  onCopyText,
  onDownloadPdf,
  onPrintReport,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#160b0c]/95 border-t border-[#3b1215] backdrop-blur-md px-3 py-2 shadow-2xl">
      <div className="grid grid-cols-5 gap-1.5 max-w-md mx-auto items-center">
        {/* เริ่มเคสใหม่ */}
        <button
          type="button"
          onClick={onNewReport}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-lg text-[#ffb3ad] active:bg-[#3b1215] transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px] text-[#ff5451]">
            restart_alt
          </span>
          <span className="text-[10px] font-medium mt-0.5 whitespace-nowrap">เคสใหม่</span>
        </button>

        {/* ดูตัวอย่าง */}
        <button
          type="button"
          onClick={onOpenPreview}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-lg text-slate-200 active:bg-slate-800 transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px] text-sky-400">
            visibility
          </span>
          <span className="text-[10px] font-medium mt-0.5 whitespace-nowrap">ตัวอย่าง</span>
        </button>

        {/* คัดลอก LINE (Primary CTA button in middle) */}
        <button
          type="button"
          onClick={onCopyText}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-[#06C755] text-white shadow-md active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[22px]">content_copy</span>
          <span className="text-[10px] font-bold mt-0.5 whitespace-nowrap">คัดลอก LINE</span>
        </button>

        {/* ดาวน์โหลด PDF */}
        <button
          type="button"
          onClick={onDownloadPdf}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-lg text-sky-200 active:bg-sky-950 transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px] text-[#38bdf8]">
            picture_as_pdf
          </span>
          <span className="text-[10px] font-medium mt-0.5 whitespace-nowrap">โหลด PDF</span>
        </button>

        {/* พิมพ์รายงาน */}
        <button
          type="button"
          onClick={onPrintReport}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-lg text-amber-200 active:bg-neutral-800 transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px] text-amber-400">
            print
          </span>
          <span className="text-[10px] font-medium mt-0.5 whitespace-nowrap">พิมพ์ A4</span>
        </button>
      </div>
    </div>
  );
};
