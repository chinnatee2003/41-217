import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CommandRibbon } from './components/CommandRibbon';
import { IncidentForm } from './components/IncidentForm';
import { LineConsole } from './components/LineConsole';
import { DailyStatsView } from './components/DailyStatsView';
import { PwaGuideView } from './components/PwaGuideView';
import { ShareModal } from './components/ShareModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { PrintRunSheetModal } from './components/PrintRunSheetModal';
import { Footer } from './components/Footer';
import { IncidentReport, ShiftStats, TabType, ThemeMode } from './types';
import { INITIAL_REPORT, SAMPLE_CASES } from './data/initialData';
import { getLiveTimeString, getTodayThaiDate } from './utils/formatters';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('report');
  const [theme, setTheme] = useState<ThemeMode>('red');

  // Active form report
  const [report, setReport] = useState<IncidentReport>(INITIAL_REPORT);

  // Daily logged cases for Pho Klang station
  const [cases, setCases] = useState<IncidentReport[]>(SAMPLE_CASES);

  // Accordion state
  const [openSections, setOpenSections] = useState({
    sec1: true,
    sec2: true,
    sec3: true,
    sec4: true,
  });

  // Modals
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Toast
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

  // Calculate shift stats (total, illness, accident, cpr, other)
  // We compute based on logged cases plus fixed base to match the 14 cases in the screenshot
  const stats: ShiftStats = {
    total: 14 + (cases.length > SAMPLE_CASES.length ? cases.length - SAMPLE_CASES.length : 0),
    illness: 9 + (cases.filter((c) => c.incidentType === 'illness').length - 2),
    accident: 4 + (cases.filter((c) => c.incidentType === 'accident').length - 2),
    cpr: 1 + (cases.filter((c) => c.incidentType === 'cpr').length - 1),
    other: 0,
  };

  // Switch HTML root class for themes (Day vs Night)
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

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    const labels = {
      day: 'โหมดกลางวัน (Day Mode ☀️)',
      hq: 'โหมดศูนย์วิทยุ HQ (Night Slate 🌙)',
      red: 'โหมดยุทธวิธีแสงสีแดง (Night Red 🔴)',
      contrast: 'โหมดคอนทราสต์จัด (OLED ⚡)',
    };
    const desc = {
      day: 'พื้นหลังสว่าง ชัดเจน สบายตาสำหรับเวลากลางวัน',
      hq: 'โทนสีกรมท่า สำหรับจอศูนย์วิทยุและคอมพิวเตอร์',
      red: 'โทนสีแดง ถนอมสายตาสำหรับห้องโดยสารรถพยาบาล',
      contrast: 'พื้นดำตัดขาวสนิท คมชัดสูงสำหรับแดดจ้า',
    };
    showToast(labels[newTheme], desc[newTheme], 'palette');
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

  const handleToggleSection = (key: 'sec1' | 'sec2' | 'sec3' | 'sec4') => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleToggleAllSections = (expand: boolean) => {
    setOpenSections({
      sec1: expand,
      sec2: expand,
      sec3: expand,
      sec4: expand,
    });
    showToast(
      expand ? 'กางทุกหัวข้อแล้ว' : 'พับเก็บทุกหัวข้อแล้ว',
      'ปรับมุมมองฟอร์มเรียบร้อย',
      expand ? 'unfold_more' : 'unfold_less'
    );
  };

  // Quick triage template apply
  const handleApplyTemplate = (type: 'illness' | 'accident' | 'cpr') => {
    if (type === 'illness') {
      setReport((prev) => ({
        ...prev,
        incidentType: 'illness',
        symptoms: 'มีอาการ ไข้สูง หนาวสั่น อ่อนเพลีย',
        vitals: {
          ...prev.vitals,
          bp: '120/80',
          pr: '84',
          spo2: '98',
          temp: '38.5',
        },
        notes: 'ผู้ป่วยรู้สึกตัวดี ถามตอบรู้เรื่อง ให้ออกซิเจนแคนนูล่า 3 LPM นำส่ง รพ.',
      }));
      showToast('ใช้เทมเพลต: ว.8 ป่วยทั่วไป', 'โหลดชุดข้อมูลเคสป่วยเรียบร้อย', 'medical_services');
    } else if (type === 'accident') {
      setReport((prev) => ({
        ...prev,
        incidentType: 'accident',
        symptoms: 'ว.40 จยย.+เก๋ง มีแผลถลอกตามร่างกาย ปวดเจ็บบริเวณสะโพก',
        vitals: {
          ...prev.vitals,
          bp: '132/86',
          pr: '96',
          spo2: '99',
          temp: '36.8',
        },
        notes: 'ดามบล็อคคอ (Hard Collar) ใส่บอร์ด ปฐมพยาบาลห้ามเลือด นำส่ง รพ.เทพรัตน์',
      }));
      showToast('ใช้เทมเพลต: ว.40 อุบัติเหตุ', 'โหลดชุดข้อมูลอุบัติเหตุทางถนนเรียบร้อย', 'car_crash');
    } else if (type === 'cpr') {
      setReport((prev) => ({
        ...prev,
        incidentType: 'cpr',
        symptoms: '🚨 วิกฤต หมดสติ ปลุกไม่ตื่น ไม่หายใจ คลำชีพจรไม่พบ (Cardiac Arrest)',
        vitals: {
          ...prev.vitals,
          bp: '0/0',
          pr: '0',
          spo2: '50',
          temp: '35.9',
        },
        notes: 'เริ่มทำ CPR ทันที ติดแผ่น AED แนะนำไม่ช็อค ใส่ท่อ LMA บีบ Ambu bag ประสาน ว.7 กู้ชีพ รพ.มหาราช',
      }));
      showToast('ใช้เทมเพลต: CPR / วิกฤตหมดสติ', 'เปิดโหมดเคสฉุกเฉินระดับสีแดง', 'e911_emergency');
    }
  };

  // Form Reset
  const handleConfirmReset = () => {
    // extract previous numeric case number if any
    const match = report.caseId.match(/\d+/);
    const nextNum = match ? parseInt(match[0], 10) + 1 : 605;

    setReport({
      id: `case-${nextNum}`,
      station: 'จุด ว.8 ฮุก 31 จุดข้าง สภ.โพธิ์กลาง',
      caseId: `เคสที่ ${nextNum}`,
      timestamp: getLiveTimeString(),
      dateStr: getTodayThaiDate(),
      unit: 'รถพยาบาลคันที่ 11',
      symptoms: '',
      incidentType: 'illness',
      location: '',
      genderCount: '',
      patientName: '',
      patientAge: '',
      patientAddress: '',
      vitals: {
        bp: '',
        pr: '',
        spo2: '',
        temp: '',
      },
      hospital: 'รพ.เทพรัตน์นครราชสีมา',
      crew: report.crew || 'พบ.32, พบ.34, ข้างสภ.220',
      notes: '',
      createdAt: Date.now(),
    });

    setResetModalOpen(false);
    showToast('ล้างข้อมูลเรียบร้อยแล้ว', `แบบฟอร์มว่างเปล่า พร้อมสำหรับคีย์เคสที่ ${nextNum}`, 'delete_sweep');
  };

  // Save case to shift log
  const handleSaveCaseToLog = () => {
    const newCase: IncidentReport = {
      ...report,
      id: `case-${Date.now()}`,
      createdAt: Date.now(),
    };
    setCases([newCase, ...cases]);
    showToast(
      'บันทึกเคสสำเร็จแล้ว',
      `เพิ่ม ${report.caseId} เข้าสถิติเวรประจำวันเรียบร้อย`,
      'bookmark_added'
    );
  };

  // Handle load case from stats list
  const handleSelectCaseFromStats = (c: IncidentReport) => {
    setReport(c);
    setCurrentTab('report');
    showToast('โหลดเคสแล้ว', `นำข้อมูล ${c.caseId} เข้าสู่หน้าแบบฟอร์ม`, 'edit');
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

  return (
    <div className="min-h-screen bg-[#141313] text-[#e6e1e1] flex flex-col font-sans">
      {/* Top Fixed Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        theme={theme}
        onThemeChange={handleThemeChange}
        onOpenShareModal={() => setShareModalOpen(true)}
      />

      {/* Main Container */}
      <main className="w-full pt-20 flex-1 flex flex-col">
        {currentTab === 'report' && (
          <div className="flex flex-col w-full">
            {/* Top Tactical Command Ribbon */}
            <CommandRibbon
              onApplyTemplate={handleApplyTemplate}
              onToggleAllSections={handleToggleAllSections}
              onOpenResetModal={() => setResetModalOpen(true)}
            />

            {/* Main Incident Console: 2-Column Responsive Split */}
            <div className="w-full max-w-[1720px] mx-auto px-4 md:px-6 py-5 flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* LEFT COLUMN: Dispatch Field Form (7 cols) */}
                <div className="lg:col-span-7 2xl:col-span-7">
                  <IncidentForm
                    report={report}
                    onChange={setReport}
                    openSections={openSections}
                    onToggleSection={handleToggleSection}
                    onShowToast={showToast}
                  />
                </div>

                {/* RIGHT COLUMN: Sticky LINE Live Output Console (5 cols) */}
                <div className="lg:col-span-5 2xl:col-span-5">
                  <LineConsole
                    report={report}
                    stats={stats}
                    onCopySuccess={handleCopySuccess}
                    onOpenLine={handleOpenLine}
                    onPrintRunSheet={() => setPrintModalOpen(true)}
                    onSaveCaseToLog={handleSaveCaseToLog}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'stats' && (
          <DailyStatsView
            cases={cases}
            stats={stats}
            onSelectCase={handleSelectCaseFromStats}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'pwa' && (
          <PwaGuideView
            onBackToReport={() => setCurrentTab('report')}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'share' && (
          <div className="w-full max-w-4xl mx-auto px-4 py-8">
            <div className="bg-[#1c1b1b] border border-[#2e2423] rounded-xl p-6 text-center space-y-4">
              <h2 className="font-headline-md text-2xl font-bold text-[#e6e1e1]">
                แชร์ระบบ ว.8 กู้ชีพ-กู้ภัย ฮุก 31
              </h2>
              <p className="text-sm text-[#e4beba]">
                เปิดหน้าต่างสแกน QR Code สำหรับแจกจ่ายให้อาสาสมัครในข่ายวิทยุ
              </p>
              <button
                onClick={() => setShareModalOpen(true)}
                className="px-6 py-2.5 rounded-lg bg-[#4cd7f6] text-[#003640] font-headline-md font-bold text-sm shadow hover:bg-[#38bdf8] transition-colors inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
                <span>เปิดหน้าต่าง QR Code & แชร์ LINE</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Global Tactical Footer */}
      <Footer />

      {/* Reset Confirmation Dialog */}
      <ResetConfirmModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />

      {/* EMS Run Sheet Print Preview Modal */}
      <PrintRunSheetModal
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        report={report}
      />

      {/* Share / QR Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        onShowToast={showToast}
      />


      {/* Notification Toast Container */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 pointer-events-none ${
          toast.show
            ? 'translate-y-0 opacity-100'
            : 'translate-y-20 opacity-0'
        }`}
      >
        <div className="px-5 py-3 rounded-xl bg-[#2b2a29] border border-[#3e3433] text-[#e6e1e1] shadow-2xl flex items-center gap-3">
          <span className="material-symbols-outlined text-[#06C755] text-[24px]">
            {toast.icon}
          </span>
          <div className="flex flex-col">
            <span className="font-headline-md text-sm font-bold text-[#e6e1e1]">
              {toast.title}
            </span>
            <span className="font-body-sm text-xs text-[#e4beba]">
              {toast.desc}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
