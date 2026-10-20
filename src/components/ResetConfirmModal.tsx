import React from 'react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1f1315] border border-[#3b1215] rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-3 text-[#ff5451]">
          <div className="w-10 h-10 rounded-xl bg-[#3b1215] text-[#ffdad6] border border-[#ff5451]/50 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[24px] text-[#ff5451]">restart_alt</span>
          </div>
          <div>
            <h4 className="font-headline-md text-base sm:text-lg text-white font-bold">
              สร้างรายงานใหม่ / เริ่มเคสใหม่?
            </h4>
            <span className="text-[11px] text-[#e4beba]">
              เปิดฟอร์มว่างเปล่า 100% สำหรับเคสถัดไป
            </span>
          </div>
        </div>

        <p className="text-xs text-[#e4beba] leading-relaxed">
          ระบบจะทำการล้างข้อมูลในทุกช่องของเคสปัจจุบันให้ว่างเปล่า พร้อมสำหรับเริ่มกรอกเคสใหม่ทันที
          (หากต้องการบันทึกประวัติไว้ก่อน กรุณากดปุ่มบันทึกประวัติก่อนกดยืนยัน)
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            className="h-9 px-4 rounded-lg bg-[#2b2a29] text-[#e6e1e1] hover:bg-[#383635] text-xs transition-colors border border-[#3e3433]"
            onClick={onClose}
            type="button"
          >
            ยกเลิก
          </button>
          <button
            className="h-9 px-4 rounded-lg bg-[#ff5451] text-[#400005] hover:bg-[#ff8885] text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
            onClick={onConfirm}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span>ยืนยันเริ่มเคสใหม่</span>
          </button>
        </div>
      </div>
    </div>
  );
};
