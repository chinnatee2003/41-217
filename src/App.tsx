import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { QuickTopicsBar } from './components/QuickTopicsBar';
import { IncidentForm } from './components/IncidentForm';
import { LineConsole } from './components/LineConsole';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PrintRunSheetModal } from './components/PrintRunSheetModal';
import { PreviewReportModal } from './components/PreviewReportModal';
import { SettingsModal } from './components/SettingsModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { AddQuickTopicModal } from './components/AddQuickTopicModal';
import { Footer } from './components/Footer';
import {
  IncidentReport,
  SectionVisibility,
  ShiftStats,
  QuickTopic,
  ThemeMode,
} from './types';
import {
  INITIAL_EMPTY_REPORT,
  DEFAULT_VISIBILITY,
  PRESET_TOPICS,
  RADIO_FREQUENCY,
} from './data/initialData';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>('red');

  // Active form report: 100% BLANK by default
  const [report, setReport] = useState<IncidentReport>(INITIAL_EMPTY_REPORT);

  // Section visibility toggles
  const [visibility, setVisibility] = useState<SectionVisibility>(DEFAULT_VISIBILITY);

  // Quick topics list (presets + custom saved in browser localStorage)
  const [topics, setTopics] = useState<QuickTopic[]>(() => {
    try {
      const saved = localStorage.getItem('hook31_custom_topics');
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...PRESET_TOPICS, ...parsed];
      }
    } catch {
      // ignore
    }
    return PRESET_TOPICS;
  });

  // Shift logged cases (local only)
  const [cases, setCases] = useState<IncidentReport[]>(() => {
    try {
      const saved = localStorage.getItem('hook31_logged_cases');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Modals state
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [addTopicModalOpen, setAddTopicModalOpen] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<{
    show: boolean;
    title: string;
    desc: string;
    icon: string;
  }>({
    show: false,
    title: '',
    desc: '',
    icon: 'check_circle',
  });

  // Calculate real shift stats from logged cases (Zero mock fake numbers)
  const stats: ShiftStats = {
    total: cases.length,
    illness: cases.filter((c) => c.incidentType === 'illness').length,
    accident: cases.filter((c) => c.incidentType === 'accident').length,
    cpr: cases.filter((c) => c.incidentType === 'cpr').length,
    other: cases.filter((c) => c.incidentType === 'other').length,
  };

  // Sync theme
  useEffect(() => {
    document.body.className = `theme-${theme}`;
    if (theme === 'day') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  // Persist custom topics
  const handleAddCustomTopic = (newTopic: QuickTopic) => {
    const updated = [...topics, newTopic];
    setTopics(updated);
    try {
      const customOnly = updated.filter((t) => t.isCustom);
      localStorage.setItem('hook31_custom_topics', JSON.stringify(customOnly));
    } catch {
      // ignore
    }
  };

  const handleDeleteCustomTopic = (id: string) => {
    const updated = topics.filter((t) => t.id !== id);
    setTopics(updated);
    try {
      const customOnly = updated.filter((t) => t.isCustom);
      localStorage.setItem('hook31_custom_topics', JSON.stringify(customOnly));
    } catch {
      // ignore
    }
    showToast('ลบหัวข้อแล้ว', 'ลบตัวเลือกด่วนออกจากระบบเรียบร้อย', 'delete');
  };

  const showToast = (title: string, desc: string, icon = 'check_circle') => {
    setToast({
      show: true,
      title,
      desc,
      icon,
    });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3200);
  };

  // Section Visibility Handlers
  const handleToggleVisibility = (key: keyof SectionVisibility) => {
    setVisibility((prev) => {
      const nextVal = !prev[key];
      showToast(
        nextVal ? 'เปิดแสดงหัวข้อ' : 'ปิดซ่อนหัวข้อ',
        nextVal ? 'หัวข้อนี้จะปรากฏในรายงาน' : 'ซ่อนหัวข้อนี้จากรายงาน LINE & PDF',
        nextVal ? 'visibility' : 'visibility_off'
      );
      return {
        ...prev,
        [key]: nextVal,
      };
    });
  };

  const handleShowAllSections = () => {
    const allTrue: SectionVisibility = Object.keys(DEFAULT_VISIBILITY).reduce(
      (acc, key) => {
        acc[key as keyof SectionVisibility] = true;
        return acc;
      },
      {} as SectionVisibility
    );
    setVisibility(allTrue);
    showToast('เปิดทุกหัวข้อแล้ว', 'แสดงรายละเอียดทั้งหมดในรายงาน', 'unfold_more');
  };

  const handleHideOptionalSections = () => {
    setVisibility((prev) => ({
      ...prev,
      vitals: false,
      policeStation: false,
      officerName: false,
      notes: false,
      caseId: false,
    }));
    showToast('ซ่อนหัวข้อเสริมแล้ว', 'เหลือเฉพาะหัวข้อรายงานด่วน', 'unfold_less');
  };

  // Apply Quick Topic
  const handleSelectTopic = (topic: QuickTopic) => {
    setReport((prev) => ({
      ...prev,
      incidentType: topic.incidentType,
      symptoms: topic.symptoms,
      unit: topic.unit || prev.unit,
      hospital: topic.hospital || prev.hospital,
    }));
    showToast(`เลือกหัวข้อ: ${topic.title}`, topic.symptoms, 'bolt');
  };

  // Form Reset / New Report
  const handleConfirmReset = () => {
    setReport({
      ...INITIAL_EMPTY_REPORT,
      id: `case-${Date.now()}`,
    });
    setResetModalOpen(false);
    showToast('ล้างข้อมูลเรียบร้อยแล้ว', 'แบบฟอร์มว่างเปล่า พร้อมสำหรับคีย์เคสใหม่', 'restart_alt');
  };

  // Save Case to Local Log
  const handleSaveCaseToLog = () => {
    if (!report.symptoms && !report.patientName && !report.location) {
      showToast('ฟอร์มยังว่างอยู่', 'กรุณากรอกข้อมูลอย่างน้อย 1 รายการก่อนบันทึก', 'warning');
      return;
    }
    const newCase: IncidentReport = {
      ...report,
      id: report.id || `case-${Date.now()}`,
      createdAt: Date.now(),
    };
    const updated = [newCase, ...cases];
    setCases(updated);
    try {
      localStorage.setItem('hook31_logged_cases', JSON.stringify(updated));
    } catch {
      // ignore
    }
    showToast('บันทึกเคสสำเร็จ', 'เก็บประวัติไว้ในเครื่องเรียบร้อย (ไม่ส่งภายนอก)', 'bookmark_added');
  };

  // Copy success toast
  const handleCopySuccess = () => {
    showToast(
      'คัดลอกข้อความ ว.8 สำเร็จ!',
      'นำไปวางลงในห้องแชท LINE กลุ่มกู้ภัยได้ทันที',
      'content_copy'
    );
  };

  // Open LINE app
  const handleOpenLine = () => {
    handleCopySuccess();
    setTimeout(() => {
      window.open('https://line.me/R/', '_blank');
    }, 350);
  };

  // Trigger PDF Download (Opens print preview styled specifically for A4 PDF saving)
  const handleDownloadPdf = () => {
    setPrintModalOpen(true);
    showToast(
      'เปิดหน้าต่างบันทึก PDF',
      'ในหน้าต่างสั่งพิมพ์ ให้เลือกเครื่องพิมพ์เป็น "บันทึกเป็น PDF" (Save as PDF)',
      'picture_as_pdf'
    );
  };

  const handlePrintReport = () => {
    setPrintModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#120a0b] text-slate-100 flex flex-col font-sans selection:bg-[#ff5451] selection:text-white">
      {/* Top Fixed Header with all required action buttons */}
      <Header
        theme={theme}
        onThemeChange={setTheme}
        onNewReport={() => setResetModalOpen(true)}
        onOpenPreview={() => setPreviewModalOpen(true)}
        onCopyText={handleCopySuccess}
        onDownloadPdf={handleDownloadPdf}
        onPrintReport={handlePrintReport}
        onOpenSettings={() => setSettingsModalOpen(true)}
      />

      {/* Main Container */}
      <main className="w-full pt-16 flex-1 flex flex-col">
        {/* Quick Topics & Radio Frequency Action Bar */}
        <QuickTopicsBar
          topics={topics}
          onSelectTopic={handleSelectTopic}
          onOpenAddModal={() => setAddTopicModalOpen(true)}
          onDeleteCustomTopic={handleDeleteCustomTopic}
        />

        {/* Notice of 100% Free / Client-Side privacy */}
        <div className="bg-[#1f1013] border-b border-[#3b1215] px-4 py-1.5 text-center text-[11px] text-[#e4beba]">
          <span className="text-[#06C755] font-bold">● ทำงานในเบราว์เซอร์ 100% ฟรี</span>
          <span className="mx-2">|</span>
          <span>ความถี่วิทยุหลัก: <strong className="text-white">{RADIO_FREQUENCY}</strong></span>
          <span className="mx-2 hidden sm:inline">|</span>
          <span className="hidden sm:inline">ไม่ส่งข้อมูลผู้ป่วยไปภายนอก</span>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-5 py-4 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT COLUMN: Field Dispatch Form (7 cols) */}
            <div className="lg:col-span-7 xl:col-span-7">
              <IncidentForm
                report={report}
                onChange={setReport}
                visibility={visibility}
                onToggleVisibility={handleToggleVisibility}
                onShowAllSections={handleShowAllSections}
                onHideOptionalSections={handleHideOptionalSections}
                onShowToast={showToast}
              />
            </div>

            {/* RIGHT COLUMN: Sticky Live LINE Output (5 cols) */}
            <div className="lg:col-span-5 xl:col-span-5">
              <LineConsole
                report={report}
                visibility={visibility}
                stats={stats}
                onCopySuccess={handleCopySuccess}
                onOpenLine={handleOpenLine}
                onPrintRunSheet={handlePrintReport}
                onDownloadPdf={handleDownloadPdf}
                onSaveCaseToLog={handleSaveCaseToLog}
                onNewReport={() => setResetModalOpen(true)}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Ergonomic Bottom Toolbar (Doesn't block form) */}
      <MobileBottomNav
        onNewReport={() => setResetModalOpen(true)}
        onOpenPreview={() => setPreviewModalOpen(true)}
        onCopyText={handleCopySuccess}
        onDownloadPdf={handleDownloadPdf}
        onPrintReport={handlePrintReport}
      />

      {/* Footer */}
      <Footer />

      {/* Reset Confirmation Dialog */}
      <ResetConfirmModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />

      {/* Full Preview Modal */}
      <PreviewReportModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        report={report}
        visibility={visibility}
        onCopyText={handleCopySuccess}
        onDownloadPdf={handleDownloadPdf}
        onPrintReport={handlePrintReport}
      />

      {/* EMS Run Sheet Print & PDF Modal */}
      <PrintRunSheetModal
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        report={report}
        visibility={visibility}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        customTopics={topics.filter((t) => t.isCustom)}
        onDeleteCustomTopic={handleDeleteCustomTopic}
        onOpenAddTopicModal={() => setAddTopicModalOpen(true)}
        visibility={visibility}
        onToggleVisibility={handleToggleVisibility}
        onShowAllSections={handleShowAllSections}
        onHideOptionalSections={handleHideOptionalSections}
        onShowToast={showToast}
      />

      {/* Add Custom Quick Topic Modal */}
      <AddQuickTopicModal
        isOpen={addTopicModalOpen}
        onClose={() => setAddTopicModalOpen(false)}
        onAddTopic={handleAddCustomTopic}
        onShowToast={showToast}
      />

      {/* Toast Notification Container */}
      <div
        className={`fixed bottom-16 md:bottom-6 right-4 sm:right-6 z-50 transition-all duration-300 pointer-events-none ${
          toast.show
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-10 opacity-0 scale-95'
        }`}
      >
        <div className="px-4 py-3 rounded-xl bg-[#221214] border border-[#ff5451]/50 text-white shadow-2xl flex items-center gap-3">
          <span className="material-symbols-outlined text-[#06C755] text-[22px]">
            {toast.icon}
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white">
              {toast.title}
            </span>
            <span className="text-[11px] text-[#e4beba]">
              {toast.desc}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
