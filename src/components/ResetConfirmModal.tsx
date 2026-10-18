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
      <div className="w-full max-w-md bg-[#211f1f] border border-[#3e3433] rounded-xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 text-[#ff5451]">
          <div className="w-10 h-10 rounded-full bg-[#93000a] text-[#ffdad6] flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[24px]">warning</span>
          </div>
          <div>
            <h4 className="font-headline-md text-lg text-[#e6e1e1] font-bold">
              ยืนยันล้างข้อมูลทั้งหมด?
            </h4>
            <span className="font-label-tactical text-[11px] text-[#e4beba]">
              คีย์เคสใหม่ / รีเซ็ตฟอร์ม
            </span>
          </div>
        </div>

        <p className="font-body-md text-sm text-[#e4beba] leading-relaxed">
          ระบบจะทำการเคลียร์ข้อมูลในทุกช่อง และรีเซ็ตข้อความ LINE Preview เพื่อเตรียมพร้อมสำหรับพิมพ์เหตุการณ์ใหม่ (ข้อมูลประวัติเคสที่บันทึกไว้จะไม่สูญหาย)
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            className="h-10 px-4 rounded-lg bg-[#2b2a29] text-[#e6e1e1] hover:bg-[#363434] font-label-tactical text-xs transition-colors border border-[#3e3433]"
            onClick={onClose}
            type="button"
          >
            ยกเลิก
          </button>
          <button
            className="h-10 px-4 rounded-lg bg-[#ff5451] text-[#5c0008] hover:bg-[#ff8885] font-label-tactical text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
            onClick={onConfirm}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
            <span>ล้างทันที</span>
          </button>
        </div>
      </div>
    </div>
  );
};
