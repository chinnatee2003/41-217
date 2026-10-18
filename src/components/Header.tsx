import React, { useState, useEffect } from 'react';
import { TabType, ThemeMode } from '../types';
import { HOOK31_LOGO_URL } from '../data/initialData';
import { getLiveClockString } from '../utils/formatters';

interface HeaderProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onOpenShareModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  theme,
  onThemeChange,
  onOpenShareModal,
}) => {
  const [clock, setClock] = useState(getLiveClockString());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setClock(getLiveClockString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#141313]/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.6)] border-b border-[#2e2423]">
      <div className="h-20 w-full px-4 md:px-6 flex items-center justify-between gap-3">
        {/* Brand & Station Identity */}
        <div className="flex items-center gap-3 min-w-0">
          <img
            alt="Hook 31 EMS Emblem"
            className="h-9 md:h-10 w-auto object-contain flex-shrink-0 drop-shadow"
            src={HOOK31_LOGO_URL}
            onError={(e) => {
              // fallback if external network fails
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="flex flex-col truncate">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-label-tactical text-[11px] text-[#ffb3ad] font-bold uppercase tracking-wider">
                HOOK 31 EMS RESCUE UNIT
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#2b2a29] text-[#4cd7f6] font-label-tactical text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] inline-block animate-pulse mr-1"></span>
                ระบบพร้อม ว.4 (ONLINE)
              </span>
            </div>
            <span className="font-headline-md text-[16px] md:text-[18px] text-[#e6e1e1] font-semibold tracking-tight truncate">
              ฮุก 31 จุดข้าง สภ.โพธิ์กลาง | ศูนย์วิทยุ นครราชสีมา
            </span>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden xl:flex items-center gap-2">
          <button
            onClick={() => onTabChange('report')}
            className={`px-3 py-1.5 transition-colors font-headline-md font-bold text-sm rounded-lg flex items-center gap-1.5 ${
              currentTab === 'report'
                ? 'bg-[#ff5451] text-[#5c0008] shadow'
                : 'text-[#e4beba] hover:bg-[#2b2a29] hover:text-[#e6e1e1]'
            }`}
          >
            <span>📋</span>
            <span>บันทึกรายงาน ว.8</span>
          </button>

          <button
            onClick={() => onTabChange('stats')}
            className={`px-3 py-1.5 transition-colors font-headline-md font-semibold text-sm rounded-lg flex items-center gap-1.5 ${
              currentTab === 'stats'
                ? 'bg-[#ff5451] text-[#5c0008] shadow'
                : 'text-[#e4beba] hover:bg-[#2b2a29] hover:text-[#e6e1e1]'
            }`}
          >
            <span>📊</span>
            <span>สถิติเคสประจำวัน</span>
          </button>

          <button
            onClick={() => onTabChange('pwa')}
            className={`px-3 py-1.5 transition-colors font-headline-md font-semibold text-sm rounded-lg flex items-center gap-1.5 ${
              currentTab === 'pwa'
                ? 'bg-[#ff5451] text-[#5c0008] shadow'
                : 'text-[#e4beba] hover:bg-[#2b2a29] hover:text-[#e6e1e1]'
            }`}
          >
            <span>📲</span>
            <span>วิธีติดตั้งแอปลงเครื่อง (PWA)</span>
          </button>

          <button
            onClick={onOpenShareModal}
            className={`px-3 py-1.5 transition-colors font-headline-md font-semibold text-sm rounded-lg flex items-center gap-1.5 ${
              currentTab === 'share'
                ? 'bg-[#ff5451] text-[#5c0008] shadow'
                : 'text-[#e4beba] hover:bg-[#2b2a29] hover:text-[#e6e1e1]'
            }`}
          >
            <span>🔗</span>
            <span>แชร์ระบบ (QR / LINE)</span>
          </button>
        </nav>

        {/* Right Tools: Clock, Theme, Profile */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          {/* Tactical UTC+7 Clock */}
          <div className="hidden md:flex items-center bg-[#1c1b1b] border border-[#2e2423] px-3 py-1 rounded-lg">
            <span className="font-label-tactical text-xs text-[#ffb95f] font-bold tracking-widest tabular-nums">
              {clock}
            </span>
          </div>

          {/* Primary Day/Night Mode Switcher */}
          <div className="hidden sm:flex items-center bg-[#1c1b1b] border border-[#2e2423] rounded-lg p-1 gap-1 shadow-sm">
            <button
              onClick={() => onThemeChange('day')}
              className={`px-2.5 py-1 rounded-md font-headline-md text-xs font-bold flex items-center gap-1.5 transition-all ${
                theme === 'day'
                  ? 'bg-amber-400 text-slate-900 shadow-md ring-1 ring-amber-500'
                  : 'text-[#e4beba] hover:text-white hover:bg-[#2b2a29]'
              }`}
              title="สลับเป็นโหมดกลางวัน (สว่าง สบายตา อ่านง่าย)"
              type="button"
            >
              <span>☀️</span>
              <span>กลางวัน</span>
            </button>

            <button
              onClick={() => onThemeChange(theme === 'day' ? 'red' : theme)}
              className={`px-2.5 py-1 rounded-md font-headline-md text-xs font-bold flex items-center gap-1.5 transition-all ${
                theme !== 'day'
                  ? 'bg-[#ff5451] text-[#5c0008] shadow-md ring-1 ring-[#ff8885]'
                  : 'text-[#e4beba] hover:text-white hover:bg-[#2b2a29]'
              }`}
              title="สลับเป็นโหมดกลางคืน (ถนอมสายตา)"
              type="button"
            >
              <span>🌙</span>
              <span>กลางคืน</span>
            </button>

            {/* Tactical Sub-theme selector when in Night Mode */}
            {theme !== 'day' && (
              <div className="flex items-center pl-1 border-l border-[#2e2423] gap-1">
                <button
                  onClick={() => onThemeChange('red')}
                  className={`px-1.5 py-0.5 rounded font-label-tactical text-[10px] ${
                    theme === 'red' ? 'bg-[#ff5451] text-[#5c0008] font-bold' : 'text-[#e4beba]'
                  }`}
                  title="แสงสีแดง (Night Red)"
                  type="button"
                >
                  🔴 RED
                </button>
                <button
                  onClick={() => onThemeChange('hq')}
                  className={`px-1.5 py-0.5 rounded font-label-tactical text-[10px] ${
                    theme === 'hq' ? 'bg-[#2b2a29] text-[#4cd7f6] font-bold' : 'text-[#e4beba]'
                  }`}
                  title="ศูนย์ HQ (Night Slate)"
                  type="button"
                >
                  🏢 HQ
                </button>
                <button
                  onClick={() => onThemeChange('contrast')}
                  className={`px-1.5 py-0.5 rounded font-label-tactical text-[10px] ${
                    theme === 'contrast' ? 'bg-white text-black font-bold' : 'text-[#e4beba]'
                  }`}
                  title="คอนทราสต์จัด (OLED)"
                  type="button"
                >
                  ⚡ OLED
                </button>
              </div>
            )}
          </div>

          {/* User profile / Call sign */}
          <div
            className="w-8 h-8 rounded-full bg-[#ffb3ad] flex items-center justify-center flex-shrink-0 shadow cursor-pointer text-[#68000a] font-bold text-xs"
            title="พลขับ/เจ้าหน้าที่ ว.4 ประจำเวร"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-1.5 rounded-lg bg-[#211f1f] text-[#e4beba] hover:text-white"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-[20px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#1c1b1b] border-t border-[#2e2423] p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between pb-2 border-b border-[#2e2423]">
            <span className="font-label-tactical text-xs text-[#ffb95f] font-bold">
              {clock}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => onThemeChange('day')}
                className={`px-2 py-0.5 rounded text-[11px] font-label-tactical font-bold ${
                  theme === 'day' ? 'bg-amber-400 text-slate-900' : 'text-zinc-400'
                }`}
              >
                DAY
              </button>
              <button
                onClick={() => onThemeChange('hq')}
                className={`px-2 py-0.5 rounded text-[11px] font-label-tactical ${
                  theme === 'hq' ? 'bg-[#2b2a29] text-[#4cd7f6]' : 'text-zinc-400'
                }`}
              >
                HQ
              </button>
              <button
                onClick={() => onThemeChange('red')}
                className={`px-2 py-0.5 rounded text-[11px] font-label-tactical ${
                  theme === 'red' ? 'bg-[#ff5451] text-[#5c0008]' : 'text-zinc-400'
                }`}
              >
                RED
              </button>
              <button
                onClick={() => onThemeChange('contrast')}
                className={`px-2 py-0.5 rounded text-[11px] font-label-tactical ${
                  theme === 'contrast' ? 'bg-white text-black' : 'text-zinc-400'
                }`}
              >
                OLED
              </button>
            </div>
          </div>
          <button
            onClick={() => {
              onTabChange('report');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg font-headline-md font-semibold text-sm ${
              currentTab === 'report' ? 'bg-[#ff5451] text-[#5c0008]' : 'text-white'
            }`}
          >
            📋 บันทึกรายงาน ว.8
          </button>
          <button
            onClick={() => {
              onTabChange('stats');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg font-headline-md font-semibold text-sm ${
              currentTab === 'stats' ? 'bg-[#ff5451] text-[#5c0008]' : 'text-white'
            }`}
          >
            📊 สถิติเคสประจำวัน
          </button>
          <button
            onClick={() => {
              onTabChange('pwa');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg font-headline-md font-semibold text-sm ${
              currentTab === 'pwa' ? 'bg-[#ff5451] text-[#5c0008]' : 'text-white'
            }`}
          >
            📲 วิธีติดตั้งแอปลงเครื่อง (PWA)
          </button>
          <button
            onClick={() => {
              onOpenShareModal();
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg font-headline-md font-semibold text-sm ${
              currentTab === 'share' ? 'bg-[#ff5451] text-[#5c0008]' : 'text-white'
            }`}
          >
            🔗 แชร์ระบบ (QR / LINE)
          </button>
        </div>
      )}
    </header>
  );
};
