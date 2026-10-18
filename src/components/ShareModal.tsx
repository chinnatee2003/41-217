import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (title: string, desc: string, icon?: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const appUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    if (isOpen && appUrl) {
      QRCode.toDataURL(appUrl, {
        width: 260,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Failed to generate QR', err));
    }
  }, [isOpen, appUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl).then(() => {
      onShowToast('คัดลอกลิงก์แล้ว', 'ส่งต่อให้เพื่อนร่วมเวรทาง LINE หรือเบราว์เซอร์ได้ทันที', 'link');
    });
  };

  const handleShareLine = () => {
    const text = encodeURIComponent(
      `🚒 ฮุก 31 นครราชสีมา จุดข้าง สภ.โพธิ์กลาง | ระบบบันทึกรายงาน ว.8 กู้ชีพ-กู้ภัย\nเข้าใช้งานระบบได้ที่: ${appUrl}`
    );
    window.open(`https://line.me/R/msg/text/?${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1c1b1b] border border-[#2e2423] rounded-xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[#2e2423] pb-3">
          <div className="flex items-center gap-2 text-[#4cd7f6]">
            <span className="material-symbols-outlined text-[24px]">qr_code_2</span>
            <h3 className="font-headline-md text-lg text-[#e6e1e1] font-bold">
              แชร์ระบบ (QR Code / LINE)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#e4beba] hover:text-white hover:bg-[#2b2a29]"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <p className="font-body-md text-xs text-[#e4beba]">
          สแกนด้วยสมาร์ทโฟนของอาสาสมัคร หรือกล้องมือถือในรถพยาบาล เพื่อเปิดใช้งานระบบคีย์ ว.8 แบบไม่ต้องลงโปรแกรม
        </p>

        {/* QR Display Card */}
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-inner mx-auto">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="QR Code for Hook 31 EMS App"
              className="w-48 h-48 object-contain"
            />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-slate-400 font-mono text-xs">
              กำลังสร้าง QR Code...
            </div>
          )}
          <span className="text-[11px] text-slate-500 font-mono mt-1 font-semibold">
            สแกนเพื่อเปิดใช้งานบนมือถือ
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleShareLine}
            className="w-full h-11 rounded-lg bg-[#06C755] hover:bg-[#05b34c] text-white font-headline-md text-sm font-bold flex items-center justify-center gap-2 shadow transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
            <span>แชร์ลิงก์เข้ากลุ่มแชท LINE</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full h-10 rounded-lg bg-[#2b2a29] hover:bg-[#363434] text-[#e6e1e1] font-label-tactical text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-[#3e3433]"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">content_copy</span>
            <span>คัดลอก URL ของระบบ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
