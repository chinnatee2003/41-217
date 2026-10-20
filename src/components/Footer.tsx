import React from 'react';
import { RADIO_FREQUENCY, APP_LEGAL_DISCLAIMER } from '../data/initialData';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#120a0b] border-t border-[#3b1215] mt-auto no-print">
      <div className="max-w-[1720px] mx-auto px-4 md:px-6 py-4 flex flex-col gap-2.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#e4beba]">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span className="font-semibold text-white">
              หน่วยกู้ชีพ-กู้ภัย มูลนิธิพุทธธรรม 31 นครราชสีมา (ฮุก 31)
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="text-[#ff8885] font-bold">
              ความถี่วิทยุสื่อสาร: {RADIO_FREQUENCY}
            </span>
          </div>

          <div className="text-[11px] text-neutral-400">
            ระบบฟรี 100% · ทำงานในเบราว์เซอร์ · ไม่ใช้ฐานข้อมูล
          </div>
        </div>

        <div className="text-[11px] text-neutral-400 border-t border-[#261013] pt-2 text-center sm:text-left leading-relaxed">
          <span className="text-neutral-300 font-semibold">ข้อแจ้งเตือน: </span>
          {APP_LEGAL_DISCLAIMER}
        </div>
      </div>
    </footer>
  );
};
