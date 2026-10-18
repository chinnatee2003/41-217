import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0f0e0e] border-t border-[#2e2423] shadow-[0_-1px_6px_rgba(0,0,0,0.5)] mt-auto no-print">
      <div className="w-full px-4 md:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 font-label-tactical text-[11px] text-[#e4beba] flex-wrap justify-center md:justify-start">
          <span>
            หน่วยกู้ชีพ-กู้ภัย มูลนิธิพุทธธรรม 31 นครราชสีมา (ฮุก 31) จุดบริการประชาชน สภ.โพธิ์กลาง
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="text-[#ffb95f]">
            ความถี่วิทยุ 168.275 MHz / 168.775 MHz
          </span>
        </div>

        <div className="flex items-center gap-3 font-label-tactical text-[11px] text-[#e4beba]">
          <span>ว.8 DISPATCH LINE BOT v2.4</span>
          <span className="text-[#4cd7f6] font-bold">ENCRYPTED FIELD RELAY</span>
        </div>
      </div>
    </footer>
  );
};
