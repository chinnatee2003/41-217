import React from 'react';
import { ThemeMode } from '../types';
import { Hook31Logo } from './Hook31Logo';
import { RADIO_FREQUENCY } from '../data/initialData';

interface HeaderProps {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onNewReport: () => void;
  onOpenPreview: () => void;
  onCopyText: () => void;
  onDownloadPdf: () => void;
  onPrintReport: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onThemeChange,
  onNewReport,
  onOpenPreview,
  onCopyText,
  onDownloadPdf,
  onPrintReport,
  onOpenSettings,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#160b0c]/95 border-b border-[#3b1215] shadow-lg backdrop-blur-md">
      <div className="max-w-[1720px] mx-auto px-3 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
        {/* Brand & Radio Frequency Identity */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex-shrink-0 relative">
            <Hook31Logo className="w-10 h-10 sm:w-11 sm:h-11 drop-shadow-md" />
          </div>
          <div className="flex flex-col truncate">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-headline-md text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1.5 truncate">
                <span>🚒</span>
                <span>รายงาน ฮุก 31 นครราชสีมา</span>
              </h1>
              {/* Radio Frequency Badge: 173.475 MHz */}
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#2d0f11] border border-[#ff5451]/60 text-[#ffb3ad] text-[11px] font-bold shadow-sm whitespace-nowrap">
                <span className="material-symbols-outlined text-[13px] text-[#ff5451] animate-pulse">
                  radio
                </span>
                <span>{RADIO_FREQUENCY}</span>
              </div>
            </div>
            <p className="text-[11px] text-[#e4beba] truncate">
              ศูนย์วิทยุและจุดบริการกู้ชีพ-กู้ภัย • ระบบฟรี 100% ปลอดภัยในเบราว์เซอร์
            </p>
          </div>
        </div>

        {/* Action Buttons Toolbar (Desktop & Tablet) */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* สร้างรายงานใหม่ / เริ่มเคสใหม่ */}
          <button
            type="button"
            onClick={onNewReport}
            className="h-9 px-3 rounded-lg bg-[#3b1215] hover:bg-[#521a1e] text-[#ffdad6] border border-[#ff5451]/40 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            title="ล้างข้อมูลและเริ่มต้นเคสใหม่"
          >
            <span className="material-symbols-outlined text-[16px] text-[#ff5451]">
              restart_alt
            </span>
            <span className="hidden sm:inline">เริ่มเคสใหม่</span>
            <span className="sm:hidden">เคสใหม่</span>
          </button>

          {/* ดูตัวอย่างรายงาน */}
          <button
            type="button"
            onClick={onOpenPreview}
            className="h-9 px-3 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-slate-100 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            title="ดูตัวอย่างรายงานฉบับสมบูรณ์"
          >
            <span className="material-symbols-outlined text-[16px] text-sky-400">
              visibility
            </span>
            <span className="hidden md:inline">ดูตัวอย่างรายงาน</span>
            <span className="md:hidden">ตัวอย่าง</span>
          </button>

          {/* คัดลอกข้อความ */}
          <button
            type="button"
            onClick={onCopyText}
            className="h-9 px-3.5 rounded-lg bg-[#06C755] hover:bg-[#05b34c] text-white text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            title="คัดลอกข้อความสำหรับส่งเข้า LINE"
          >
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
            <span className="hidden sm:inline">คัดลอกข้อความ</span>
            <span className="sm:hidden">คัดลอก</span>
          </button>

          {/* ดาวน์โหลด PDF */}
          <button
            type="button"
            onClick={onDownloadPdf}
            className="h-9 px-3 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            title="ดาวน์โหลดหรือบันทึกเป็นไฟล์ PDF"
          >
            <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
            <span className="hidden md:inline">ดาวน์โหลด PDF</span>
            <span className="md:hidden">PDF</span>
          </button>

          {/* พิมพ์รายงาน */}
          <button
            type="button"
            onClick={onPrintReport}
            className="h-9 px-3 rounded-lg bg-[#2b2a29] hover:bg-[#383635] text-[#e6e1e1] border border-[#3e3433] text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            title="พิมพ์รายงานใบนำส่ง Run Sheet A4"
          >
            <span className="material-symbols-outlined text-[16px] text-amber-400">print</span>
            <span className="hidden lg:inline">พิมพ์รายงาน</span>
          </button>

          {/* ตั้งค่ารายการ */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="h-9 px-2.5 rounded-lg bg-[#2b2a29] hover:bg-[#383635] text-[#e4beba] hover:text-white border border-[#3e3433] text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 shadow-sm"
            title="ตั้งค่าจุดบริการ รถพยาบาล และหัวข้อด่วน"
          >
            <span className="material-symbols-outlined text-[16px]">settings</span>
            <span className="hidden xl:inline">ตั้งค่ารายการ</span>
          </button>

          {/* Theme switcher */}
          <button
            type="button"
            onClick={() => onThemeChange(theme === 'day' ? 'red' : 'day')}
            className="h-9 px-2.5 rounded-lg bg-[#211f1f] border border-[#3e3433] text-xs font-semibold flex items-center gap-1 text-[#e6e1e1] hover:bg-[#2b2a29] transition-colors"
            title="สลับโหมดกลางวัน / แสงแดงกลางคืน"
          >
            <span className="text-[15px]">{theme === 'day' ? '☀️' : '🔴'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
