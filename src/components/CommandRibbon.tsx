import React from 'react';

interface CommandRibbonProps {
  onApplyTemplate: (type: 'illness' | 'accident' | 'cpr') => void;
  onToggleAllSections: (expand: boolean) => void;
  onOpenResetModal: () => void;
}

export const CommandRibbon: React.FC<CommandRibbonProps> = ({
  onApplyTemplate,
  onToggleAllSections,
  onOpenResetModal,
}) => {
  return (
    <div className="w-full bg-[#1c1b1b] border-b border-[#2e2423] px-4 md:px-6 py-2.5 shadow-md">
      <div className="max-w-[1720px] mx-auto flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
        {/* Preset Quick Triage Templates */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0 scrollbar-none">
          <span className="font-label-tactical text-[11px] text-[#e4beba] uppercase tracking-wider whitespace-nowrap flex items-center gap-1 mr-1">
            <span className="material-symbols-outlined text-[15px] text-[#ffb3ad]">bolt</span>
            เทมเพลตด่วน:
          </span>

          <button
            onClick={() => onApplyTemplate('illness')}
            className="h-10 px-3.5 rounded-lg bg-[#363434] text-[#e6e1e1] hover:bg-[#3a3939] flex items-center gap-2 font-label-tactical text-xs font-semibold transition-all active:scale-95 shadow-sm whitespace-nowrap border border-[#443837]"
            type="button"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#4cd7f6] inline-block"></span>
            <span>ว.8 ป่วยทั่วไป</span>
          </button>

          <button
            onClick={() => onApplyTemplate('accident')}
            className="h-10 px-3.5 rounded-lg bg-[#363434] text-[#e6e1e1] hover:bg-[#3a3939] flex items-center gap-2 font-label-tactical text-xs font-semibold transition-all active:scale-95 shadow-sm whitespace-nowrap border border-[#443837]"
            type="button"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffb95f] inline-block"></span>
            <span>ว.40 อุบัติเหตุ</span>
          </button>

          <button
            onClick={() => onApplyTemplate('cpr')}
            className="h-10 px-3.5 rounded-lg bg-[#ff5451] text-[#5c0008] font-label-tactical text-xs flex items-center gap-2 transition-all active:scale-95 shadow-sm animate-pulse whitespace-nowrap border border-[#ff8885]"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">e911_emergency</span>
            <span className="font-bold">CPR / วิกฤตหมดสติ</span>
          </button>
        </div>

        {/* Action Operations: Collapse / Expand All & Reset Form */}
        <div className="flex items-center gap-2 flex-wrap xl:justify-end">
          <div className="flex items-center bg-[#211f1f] rounded-lg p-1 border border-[#362e2d] shadow-sm gap-1">
            <button
              onClick={() => onToggleAllSections(false)}
              className="h-8 md:h-9 px-3 rounded text-[#e4beba] hover:text-[#e6e1e1] hover:bg-[#2b2a29] transition-colors font-label-tactical text-xs font-semibold flex items-center gap-1.5"
              title="ซ่อนรายละเอียดเพื่อดูภาพรวม"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px] text-amber-400">unfold_less</span>
              <span>พับปิดทุกหัวข้อ</span>
            </button>
            <span className="text-[#362e2d]">|</span>
            <button
              onClick={() => onToggleAllSections(true)}
              className="h-8 md:h-9 px-3 rounded text-[#e4beba] hover:text-[#e6e1e1] hover:bg-[#2b2a29] transition-colors font-label-tactical text-xs font-semibold flex items-center gap-1.5"
              title="กางออกทั้งหมด"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">unfold_more</span>
              <span>ขยายเปิดทุกหัวข้อ</span>
            </button>
          </div>

          <button
            onClick={onOpenResetModal}
            className="h-9 md:h-10 px-3.5 rounded-lg bg-[#93000a] text-[#ffdad6] hover:bg-[#690005] transition-all font-label-tactical text-xs font-bold flex items-center gap-2 shadow-md active:scale-95 border border-[#c0392b]"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
            <span>ล้างข้อมูลทั้งหมด (คีย์เคสใหม่)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
