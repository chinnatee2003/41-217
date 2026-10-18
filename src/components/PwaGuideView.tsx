import React, { useState, useEffect } from 'react';

interface PwaGuideViewProps {
  onBackToReport: () => void;
  onShowToast: (title: string, desc: string, icon?: string) => void;
}

export const PwaGuideView: React.FC<PwaGuideViewProps> = ({
  onBackToReport,
  onShowToast,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if running as standalone
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        onShowToast('ติดตั้งแอพสำเร็จแล้ว', 'ไอคอน ฮุก 31 ถูกเพิ่มลงหน้าจอหลักแล้ว', 'check_circle');
      }
      setDeferredPrompt(null);
    } else {
      onShowToast(
        'การติดตั้งด้วยตนเอง',
        'โปรดทำตามขั้นตอนแนะนำด้านล่าง (แตะที่เมนูเบราว์เซอร์ แล้วเลือก เพิ่มลงหน้าจอโฮม)',
        'info'
      );
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-[#1c1b1b] border border-[#2e2423] p-5 rounded-xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-full bg-[#4cd7f6] inline-block"></span>
            <h2 className="font-headline-md text-xl md:text-2xl font-bold text-[#e6e1e1]">
              วิธีติดตั้งแอปลงเครื่องมือถือ / แท็บเล็ตประจำรถ (PWA)
            </h2>
          </div>
          <p className="font-body-md text-xs md:text-sm text-[#e4beba] mt-1">
            ติดตั้งเป็นแอปเต็มหน้าจอ (Standalone) ใช้งานสะดวกรวดเร็วบนรถพยาบาล ไม่ต้องเปิด Browser ซ้ำ
          </p>
        </div>

        <div className="flex items-center gap-2">
          {deferredPrompt ? (
            <button
              onClick={handleInstallClick}
              className="h-11 px-5 rounded-lg bg-[#4cd7f6] hover:bg-[#38bdf8] text-[#003640] font-headline-md text-sm font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">download</span>
              <span>กดติดตั้งลงเครื่องทันที</span>
            </button>
          ) : (
            <button
              onClick={onBackToReport}
              className="h-10 px-4 rounded-lg bg-[#ff5451] hover:bg-[#ff8885] text-[#5c0008] font-headline-md text-xs font-bold flex items-center gap-1.5 transition-colors shadow"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">edit_note</span>
              <span>กลับสู่หน้าบันทึก ว.8</span>
            </button>
          )}
        </div>
      </div>

      {isInstalled && (
        <div className="p-4 bg-[#06C755]/15 border border-[#06C755]/40 rounded-xl flex items-center gap-3 text-white">
          <span className="material-symbols-outlined text-[#06C755] text-[24px]">
            verified
          </span>
          <div className="text-sm">
            <span className="font-bold">ระบบกำลังทำงานในโหมด Standalone PWA</span>
            <p className="text-xs text-[#e4beba]">
              สามารถใช้งานแบบเต็มจอและเปิดได้ทันทีจากหน้าจอโฮมของอุปกรณ์
            </p>
          </div>
        </div>
      )}

      {/* 2 OS Cards: Android & iOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Android Chrome Instructions */}
        <div className="bg-[#1c1b1b] border border-[#2e2423] rounded-xl p-5 shadow space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#2e2423]">
            <span className="material-symbols-outlined text-[#06C755] text-[28px]">
              android
            </span>
            <div>
              <h3 className="font-headline-md text-lg font-bold text-[#e6e1e1]">
                สำหรับ Android (Google Chrome)
              </h3>
              <span className="font-label-tactical text-[11px] text-[#4cd7f6]">
                แท็บเล็ตติดรถพยาบาล หรือมือถือแอนดรอยด์
              </span>
            </div>
          </div>

          <ol className="space-y-3 text-sm text-[#e4beba] list-decimal list-inside font-body-md">
            <li className="leading-relaxed">
              เปิดลิงก์ระบบบนเบราว์เซอร์ <span className="text-white font-semibold">Google Chrome</span>
            </li>
            <li className="leading-relaxed">
              กดที่ไอคอน <span className="text-white font-semibold">จุดไข่ปลา 3 จุด (⋮)</span> บริเวณมุมบนขวาสุดของหน้าจอ
            </li>
            <li className="leading-relaxed">
              เลือกเมนู <span className="text-[#ffb95f] font-semibold">"เพิ่มลงในหน้าจอหลัก"</span> หรือ{' '}
              <span className="text-[#4cd7f6] font-semibold">"ติดตั้งแอปพลิเคชัน" (Install app)</span>
            </li>
            <li className="leading-relaxed">
              กดยืนยัน <span className="text-white font-semibold">"ติดตั้ง"</span> ไอคอนกู้ภัย ฮุก 31 จะไปปรากฏบนหน้าจอหลักทันที
            </li>
          </ol>

          <div className="p-3 bg-[#0f0e0e] border border-[#2e2423] rounded-lg text-xs text-[#e4beba]">
            💡 <strong className="text-white">ข้อดี:</strong> ใช้งานได้แบบเต็มจอ 100% ไม่มีแถบ URL มาบดบัง และโหลดข้อมูลเร็วแม้สัญญาณเน็ต 4G/5G อ่อน
          </div>
        </div>

        {/* iOS Safari Instructions */}
        <div className="bg-[#1c1b1b] border border-[#2e2423] rounded-xl p-5 shadow space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#2e2423]">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[28px]">
              phone_iphone
            </span>
            <div>
              <h3 className="font-headline-md text-lg font-bold text-[#e6e1e1]">
                สำหรับ iPhone & iPad (Apple Safari)
              </h3>
              <span className="font-label-tactical text-[11px] text-[#ffb95f]">
                ระบบปฏิบัติการ iOS / iPadOS
              </span>
            </div>
          </div>

          <ol className="space-y-3 text-sm text-[#e4beba] list-decimal list-inside font-body-md">
            <li className="leading-relaxed">
              เปิดระบบด้วยเบราว์เซอร์ <span className="text-white font-semibold">Safari</span> (ไม่แนะนำให้เปิดใน LINE Browser)
            </li>
            <li className="leading-relaxed">
              แตะที่ปุ่ม <span className="text-white font-semibold">แชร์ (Share)</span> รูปสี่เหลี่ยมที่มีลูกศรชี้ขึ้น ที่แถบด้านล่าง
            </li>
            <li className="leading-relaxed">
              เลื่อนลงมาแล้วเลือก <span className="text-[#ffb95f] font-semibold">"เพิ่มไปยังหน้าจอโฮม" (Add to Home Screen)</span>
            </li>
            <li className="leading-relaxed">
              แตะปุ่ม <span className="text-white font-semibold">"เพิ่ม" (Add)</span> ที่มุมบนขวา เพื่อเสร็จสิ้น
            </li>
          </ol>

          <div className="p-3 bg-[#0f0e0e] border border-[#2e2423] rounded-lg text-xs text-[#e4beba]">
            💡 <strong className="text-white">แนะนำ:</strong> ตั้งค่าให้เป็นแอปหลักสำหรับผลัดเวรเพื่อกดปุ่มเดียวเปิดใช้งานในสถานการณ์ฉุกเฉินได้ทันที
          </div>
        </div>
      </div>
    </div>
  );
};
