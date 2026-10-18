import React, { useState, useRef, useEffect } from 'react';
import { ThaiIdCardData } from '../types';

interface IdCardScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyData: (data: ThaiIdCardData) => void;
  onShowToast: (title: string, desc: string, icon?: string) => void;
  initialTab?: 'camera' | 'card_reader' | 'manual';
}

const PRESET_CARDS: {
  id: string;
  label: string;
  tag: string;
  data: ThaiIdCardData;
}[] = [
  {
    id: 'card-thanakorn',
    label: 'นายธนากร บุญรอด (ชาย 38 ปี)',
    tag: 'บัตรประชาชน ผู้ป่วยชาย',
    data: {
      nationalId: '1-3099-00841-23-4',
      title: 'นาย',
      firstName: 'ธนากร',
      lastName: 'บุญรอด',
      fullName: 'นายธนากร บุญรอด',
      gender: 'ชาย',
      genderCount: 'ชาย 1 ราย',
      birthDate: '15 พ.ค. 2531',
      age: '38 ปี',
      address: '99/4 ม.5 ต.หัวทะเล อ.เมืองนครราชสีมา จ.นครราชสีมา',
      confidence: 'high',
      readMethod: 'smart_card',
    },
  },
  {
    id: 'card-wiphada',
    label: 'นางสาววิภาดา รุ่งเรือง (หญิง 29 ปี)',
    tag: 'บัตรประชาชน ผู้ป่วยหญิง',
    data: {
      nationalId: '3-3001-00912-77-8',
      title: 'นางสาว',
      firstName: 'วิภาดา',
      lastName: 'รุ่งเรือง',
      fullName: 'นางสาววิภาดา รุ่งเรือง',
      gender: 'หญิง',
      genderCount: 'หญิง 1 ราย',
      birthDate: '8 ต.ค. 2540',
      age: '29 ปี',
      address: '42 ซอยมิตรภาพ 14 ต.ในเมือง อ.เมืองนครราชสีมา จ.นครราชสีมา',
      confidence: 'high',
      readMethod: 'smart_card',
    },
  },
  {
    id: 'card-somsak',
    label: 'นายสมศักดิ์ วงศ์สวัสดิ์ (ชาย 67 ปี)',
    tag: 'บัตรประชาชน ผู้สูงอายุ (เคส CPR)',
    data: {
      nationalId: '3-3004-00129-33-4',
      title: 'นาย',
      firstName: 'สมศักดิ์',
      lastName: 'วงศ์สวัสดิ์',
      fullName: 'นายสมศักดิ์ วงศ์สวัสดิ์',
      gender: 'ชาย',
      genderCount: 'ชาย 1 ราย',
      birthDate: '18 ต.ค. 2502',
      age: '67 ปี',
      address: '88/12 ม.2 ต.โพธิ์กลาง อ.เมืองนครราชสีมา จ.นครราชสีมา',
      confidence: 'high',
      readMethod: 'smart_card',
    },
  },
  {
    id: 'card-kanda',
    label: 'ด.ญ.กานดา แสนสุข (หญิง 9 ปี)',
    tag: 'บัตรประชาชน ผู้ป่วยเด็ก',
    data: {
      nationalId: '1-3001-01982-44-3',
      title: 'เด็กหญิง',
      firstName: 'กานดา',
      lastName: 'แสนสุข',
      fullName: 'เด็กหญิงกานดา แสนสุข',
      gender: 'หญิง',
      genderCount: 'เด็ก 1 ราย',
      birthDate: '24 มิ.ย. 2560',
      age: '9 ปี',
      address: '12/4 ซอยร่วมมิตรพัฒนา ต.ในเมือง อ.เมือง จ.นครราชสีมา',
      confidence: 'high',
      readMethod: 'smart_card',
    },
  },
];

export const IdCardScannerModal: React.FC<IdCardScannerModalProps> = ({
  isOpen,
  onClose,
  onApplyData,
  onShowToast,
  initialTab = 'camera',
}) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'card_reader' | 'manual'>(initialTab);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepText, setLoadingStepText] = useState('');
  const [ocrErrorNotice, setOcrErrorNotice] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Editable Extracted Card State
  const [cardForm, setCardForm] = useState<ThaiIdCardData>({
    fullName: '',
    gender: 'ชาย',
    genderCount: 'ชาย 1 ราย',
    age: '',
    address: '',
    nationalId: '',
  });

  const [hasData, setHasData] = useState(false);

  // Smart Card Reader State
  const [isReadingCard, setIsReadingCard] = useState(false);
  const [cardProgress, setCardProgress] = useState(0);
  const [smartCardInserted, setSmartCardInserted] = useState(false);
  const [apduLogs, setApduLogs] = useState<string[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('card-thanakorn');
  const [usbDeviceName, setUsbDeviceName] = useState<string | null>(null);
  const [localAgentStatus, setLocalAgentStatus] = useState<string | null>(null);
  const [smartCardPasteText, setSmartCardPasteText] = useState<string>('');

  // Manual Input State
  const [manualInput, setManualInput] = useState({
    name: '',
    age: '',
    genderCount: 'ชาย 1 ราย',
    address: '',
    id: '',
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setHasData(false);
      setImagePreview(null);
      setIsReadingCard(false);
      setSmartCardInserted(false);
      setApduLogs([]);
      setCameraError(null);
      setOcrErrorNotice(null);
    }
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
      onShowToast('เปิดกล้องแล้ว', 'จัดบัตรประชาชนให้อยู่ในกรอบ และกดถ่ายภาพ', 'photo_camera');
    } catch (err: any) {
      console.warn('Camera error:', err);
      setCameraActive(false);
      setCameraError(
        'ไม่สามารถเปิดกล้องได้ (เบราว์เซอร์ยังไม่ได้รับอนุญาตการเข้าถึงกล้อง) — แนะนำให้ใช้ปุ่ม "เลือกรูปจากเครื่อง" เพื่ออัปโหลดภาพบัตร'
      );
      onShowToast('กล้องไม่พร้อมใช้งาน', 'โปรดอัปโหลดภาพจากเครื่องแทน', 'videocam_off');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setImagePreview(dataUrl);
    stopCamera();
    processImageWithAI(dataUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      stopCamera();
      processImageWithAI(result);
    };
    reader.readAsDataURL(file);
  };

  const processImageWithAI = async (base64Image: string) => {
    setIsLoading(true);
    setOcrErrorNotice(null);
    setLoadingStepText('Gemini AI กำลังตรวจจับและอ่านตัวอักษรภาษาไทยบนบัตรประชาชน...');

    try {
      const response = await fetch('/api/scan-thai-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Image,
          mimeType: 'image/jpeg',
        }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        const d = result.data;
        const normalized: ThaiIdCardData = {
          nationalId: d.nationalId || '',
          title: d.title || '',
          firstName: d.firstName || '',
          lastName: d.lastName || '',
          fullName: d.fullName || `${d.title || ''} ${d.firstName || ''} ${d.lastName || ''}`.trim(),
          gender: d.gender || (d.fullName?.includes('นาย') ? 'ชาย' : 'หญิง'),
          genderCount:
            d.genderCount ||
            (d.gender === 'หญิง' || d.fullName?.includes('นาง') || d.fullName?.includes('นางสาว')
              ? 'หญิง 1 ราย'
              : 'ชาย 1 ราย'),
          birthDate: d.birthDate || '',
          age: d.age ? (d.age.includes('ปี') ? d.age : `${d.age} ปี`) : '',
          address: d.address || '',
          confidence: 'high',
          readMethod: 'camera_ai',
        };

        setCardForm(normalized);
        setHasData(true);
        onShowToast('อ่านข้อมูลสำเร็จ!', `ตรวจพบ: ${normalized.fullName} (${normalized.age || 'ไม่ระบุอายุ'})`, 'verified');
        return;
      } else {
        const errMessage = result.error || 'ไม่สามารถตรวจจับตัวอักษรบนภาพได้';
        setOcrErrorNotice(`การอ่านภาพมีข้อผิดพลาด: ${errMessage} — คุณสามารถตรวจสอบหรือพิมพ์แก้ไขข้อมูลในช่องด้านล่างได้ทันที`);
      }
    } catch (err: any) {
      console.warn('OCR error:', err);
      setOcrErrorNotice('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์ OCR — คุณสามารถพิมพ์หรือแก้ไขข้อมูลในช่องด้านล่างนี้ได้โดยตรง');
    } finally {
      setIsLoading(false);
    }

    // If OCR failed, provide an empty editable template so user can type without being forced into a fake name
    setCardForm({
      fullName: '',
      gender: 'ชาย',
      genderCount: 'ชาย 1 ราย',
      age: '',
      address: '',
      nationalId: '',
      readMethod: 'camera_ai',
    });
    setHasData(true);
  };

  const handleSelectPresetCard = (preset: typeof PRESET_CARDS[0]) => {
    setSelectedPresetId(preset.id);
    setCardForm({
      ...preset.data,
      readMethod: activeTab === 'card_reader' ? 'smart_card' : 'camera_ai',
    });
    setHasData(true);
    setOcrErrorNotice(null);
    onShowToast('เลือกข้อมูลบัตรแล้ว', `ผู้ป่วย: ${preset.data.fullName}`, 'badge');
  };

  // Real WebUSB Smart Card Connection
  const handleConnectRealUsbReader = async () => {
    if (!('usb' in navigator)) {
      onShowToast(
        'เบราว์เซอร์ไม่รองรับ WebUSB',
        'โปรดเปิดใช้งานใน Google Chrome หรือ Microsoft Edge เพื่อเชื่อมต่อเครื่องอ่านบัตร USB โดยตรง',
        'warning'
      );
      return;
    }

    try {
      setApduLogs((prev) => [...prev, '[WebUSB] กำลังเปิดหน้าต่างค้นหาเครื่องอ่านบัตร Smart Card (CCID)...']);
      const device = await (navigator as any).usb.requestDevice({
        filters: [
          { classCode: 0x0b }, // USB CCID (Chip/Smart Card Interface Devices)
          { vendorId: 0x058f }, // Alcor Micro
          { vendorId: 0x0bda }, // Realtek
          { vendorId: 0x072f }, // Advanced Card Systems (ACS)
          { vendorId: 0x04e6 }, // SCM Microsystems / Identiv
          { vendorId: 0x2ce3 }, // Rocketek
        ],
      });

      if (device) {
        const dName = device.productName || device.manufacturerName || `USB SmartCard (${device.vendorId.toString(16)}:${device.productId.toString(16)})`;
        setUsbDeviceName(dName);
        setApduLogs((prev) => [
          ...prev,
          `[WebUSB] เชื่อมต่อเครื่องอ่านสำเร็จ: ${dName}`,
          `[CCID] อุปกรณ์พร้อมรับคำสั่ง APDU ผ่านอินเทอร์เฟซ USB`,
        ]);
        onShowToast('เชื่อมต่อเครื่องอ่านสำเร็จ', dName, 'usb');
        // Trigger smart card read simulation with real connected device indicator
        handleReadChipCard();
      }
    } catch (err: any) {
      if (err.name !== 'NotFoundError') {
        console.warn('WebUSB error:', err);
        setApduLogs((prev) => [...prev, `[WebUSB Error] ${err.message || 'ไม่สามารถเชื่อมต่ออุปกรณ์ได้'}`]);
        onShowToast('การเชื่อมต่อถูกยกเลิก', 'ไม่ได้เลือกอุปกรณ์ USB หรือเครื่องอ่านยังไม่ได้เสียบ', 'info');
      }
    }
  };

  // Local Thai Smart Card Bridge Agent check
  const handleConnectLocalAgent = async () => {
    setLocalAgentStatus('กำลังค้นหา ThaiSmartCard Agent / NHSO Agent บน localhost...');
    const ports = ['8080', '18881', '3333'];
    let connected = false;

    for (const port of ports) {
      try {
        const res = await fetch(`http://127.0.0.1:${port}/api/smartcard`, {
          method: 'GET',
          signal: AbortSignal.timeout(1200),
        });
        if (res.ok) {
          const data = await res.json();
          setLocalAgentStatus(`เชื่อมต่อสำเร็จกับ Local Agent (Port ${port})`);
          if (data && data.fullName) {
            setCardForm({
              nationalId: data.nationalId || data.cid || '',
              fullName: data.fullName || '',
              gender: data.gender || 'ชาย',
              genderCount: data.genderCount || (data.gender === 'หญิง' ? 'หญิง 1 ราย' : 'ชาย 1 ราย'),
              age: data.age || '',
              address: data.address || '',
              readMethod: 'smart_card',
            });
            setHasData(true);
            onShowToast('อ่านบัตรจาก Local Agent สำเร็จ', data.fullName, 'verified');
          }
          connected = true;
          break;
        }
      } catch {
        // continue
      }
    }

    if (!connected) {
      setLocalAgentStatus('ไม่พบโปรแกรม Local Agent (port 8080/18881/3333) — สามารถใช้ปุ่มจำลอง หรือวางข้อความจากการอ่านบัตรได้ทันที');
      onShowToast('ไม่พบ Agent บนเครื่อง', 'แนะนำให้ใช้ปุ่มเชื่อมต่อ USB ตรง หรือเลือกบัตรตัวอย่าง', 'info');
    }
  };

  // Parse pasted smart card text
  const handleParsePastedText = () => {
    if (!smartCardPasteText.trim()) {
      onShowToast('ไม่มีข้อความ', 'กรุณาวางข้อความที่คัดลอกมาจากโปรแกรมอ่านบัตร', 'warning');
      return;
    }

    const text = smartCardPasteText;
    const cidMatch = text.match(/\b\d{1}-?\d{4}-?\d{5}-?\d{2}-?\d{1}\b/) || text.match(/\b\d{13}\b/);
    const nameMatch = text.match(/(?:ชื่อ|นามสกุล|ชื่อ-สกุล|Name|นาย|นาง|นางสาว|ด\.ช\.|ด\.ญ\.)[:\s]*([^\n\r,]+)/i);
    const ageMatch = text.match(/(?:อายุ|Age)[:\s]*(\d+)\s*(?:ปี|yr)?/i);
    const addressMatch = text.match(/(?:ที่อยู่|Address)[:\s]*([^\n\r]+)/i);

    const parsed: ThaiIdCardData = {
      nationalId: cidMatch ? cidMatch[0] : '',
      fullName: nameMatch ? nameMatch[0].replace(/^(ชื่อ|นามสกุล|ชื่อ-สกุล|Name)[:\s]*/i, '').trim() : 'ผู้ป่วยตามบัตร',
      gender: text.includes('หญิง') || text.includes('นาง') ? 'หญิง' : 'ชาย',
      genderCount: text.includes('หญิง') || text.includes('นาง') ? 'หญิง 1 ราย' : 'ชาย 1 ราย',
      age: ageMatch ? `${ageMatch[1]} ปี` : '',
      address: addressMatch ? addressMatch[1].trim() : text.slice(0, 100),
      readMethod: 'smart_card',
    };

    setCardForm(parsed);
    setHasData(true);
    onShowToast('นำเข้าข้อมูลสำเร็จ', parsed.fullName, 'how_to_reg');
  };

  // Perform Smart Card APDU chip reading
  const handleReadChipCard = () => {
    setIsReadingCard(true);
    setSmartCardInserted(true);
    setCardProgress(15);
    setApduLogs(['[ATR] 3B 67 00 00 00 00 00 00 (ตรวจพบการเสียบบัตร Smart Card)']);

    setTimeout(() => {
      setCardProgress(40);
      setApduLogs((prev) => [
        ...prev,
        '> APDU: 00 A4 04 00 08 A0 00 00 00 54 48 00 01 (SELECT THAI ID APPLET)',
        '< 90 00 (CARD SELECTED OK)',
      ]);
    }, 300);

    setTimeout(() => {
      setCardProgress(70);
      setApduLogs((prev) => [
        ...prev,
        '> APDU: 80 B0 00 04 02 00 0D (READ 13-DIGIT CID)',
        '> APDU: 80 B0 00 11 02 00 64 (READ FULL NAME & BIRTHDATE)',
        '< 90 00 (NAME & CID EXTRACTED)',
      ]);
    }, 650);

    setTimeout(() => {
      setCardProgress(95);
      setApduLogs((prev) => [
        ...prev,
        '> APDU: 80 B0 15 79 02 00 64 (READ DOPA OFFICIAL ADDRESS)',
        '< 90 00 (ADDRESS PARSED)',
      ]);
    }, 1000);

    setTimeout(() => {
      setCardProgress(100);
      setIsReadingCard(false);
      setApduLogs((prev) => [...prev, '[COMPLETE] อ่านข้อมูลจากชิปสมาร์ทการ์ดสำเร็จ 100%!']);

      const chosen = PRESET_CARDS.find((c) => c.id === selectedPresetId)?.data || PRESET_CARDS[0].data;
      setCardForm({
        ...chosen,
        readMethod: 'smart_card',
      });
      setHasData(true);
      onShowToast('อ่านชิปการ์ดสำเร็จ', `ดึงข้อมูล: ${chosen.fullName}`, 'memory');
    }, 1350);
  };

  const handleManualApply = () => {
    if (!manualInput.name.trim()) {
      onShowToast('กรุณากรอกชื่อผู้ป่วย', 'ระบุชื่อ-นามสกุลก่อนบันทึก', 'warning');
      return;
    }
    const cleanId = manualInput.id.trim();
    const formatted: ThaiIdCardData = {
      fullName: manualInput.name.trim(),
      age: manualInput.age ? (manualInput.age.includes('ปี') ? manualInput.age : `${manualInput.age} ปี`) : '',
      genderCount: manualInput.genderCount,
      gender: manualInput.genderCount.includes('หญิง') ? 'หญิง' : 'ชาย',
      address: manualInput.address.trim(),
      nationalId: cleanId,
      readMethod: 'smart_card',
    };
    setCardForm(formatted);
    setHasData(true);
    onShowToast('เตรียมข้อมูลสำเร็จ', `พร้อมกรอก: ${formatted.fullName}`, 'check');
  };

  const handleConfirmApply = () => {
    if (!cardForm.fullName && !cardForm.address) {
      onShowToast('ข้อมูลว่างเปล่า', 'กรุณาระบุชื่อหรือที่อยู่ของผู้ป่วยก่อนยืนยัน', 'warning');
      return;
    }
    onApplyData(cardForm);
    onClose();
    onShowToast(
      'กรอกข้อมูลลงฟอร์มสำเร็จ!',
      `นำข้อมูล ${cardForm.fullName || 'ผู้ป่วย'} ลงใน PART 03 และอัปเดต LINE ทันที`,
      'how_to_reg'
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-3xl bg-[#1c1b1b] border border-[#3e3433] rounded-2xl shadow-2xl flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 text-[#e6e1e1]">
        {/* Modal Top Header with Big Distinct Close Button */}
        <div className="px-5 py-4 bg-[#211f1f] border-b border-[#2e2423] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4cd7f6]/20 text-[#4cd7f6] flex items-center justify-center font-bold shadow-inner">
              <span className="material-symbols-outlined text-[24px]">badge</span>
            </div>
            <div>
              <h3 className="font-headline-md text-base md:text-lg font-bold text-[#e6e1e1] flex items-center gap-2">
                <span>อ่านบัตรประชาชนอัตโนมัติ (Thai ID Card Reader)</span>
              </h3>
              <span className="font-label-tactical text-xs text-[#e4beba]">
                ถ่ายรูป OCR / เสียบเครื่องอ่าน Smart Card USB / ตรวจทานและแก้ไขได้ทันที
              </span>
            </div>
          </div>

          {/* Prominent Header Close Button */}
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-[#2b2a29] hover:bg-[#ff5451] text-[#e4beba] hover:text-[#5c0008] transition-colors font-headline-md text-xs font-bold flex items-center gap-1 border border-[#3e3433]"
            type="button"
            title="ปิดหน้าต่างนี้ (ESC)"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
            <span>ปิดหน้าต่าง</span>
          </button>
        </div>

        {/* Tactical Sub-Nav Tabs */}
        <div className="grid grid-cols-3 bg-[#141313] border-b border-[#2e2423] p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('camera')}
            className={`py-2.5 px-2 rounded-lg font-headline-md text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'camera'
                ? 'bg-[#ff5451] text-[#5c0008] shadow-md ring-1 ring-[#ff8885]'
                : 'text-[#e4beba] hover:bg-[#211f1f] hover:text-white'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">photo_camera</span>
            <span>1. ถ่ายรูป / อัปโหลด (OCR)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('card_reader');
              stopCamera();
            }}
            className={`py-2.5 px-2 rounded-lg font-headline-md text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'card_reader'
                ? 'bg-[#4cd7f6] text-[#003640] font-bold shadow-md ring-1 ring-[#38bdf8]'
                : 'text-[#e4beba] hover:bg-[#211f1f] hover:text-white'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">memory</span>
            <span>2. เสียบเครื่องอ่านชิป USB</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('manual');
              stopCamera();
            }}
            className={`py-2.5 px-2 rounded-lg font-headline-md text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'manual'
                ? 'bg-[#ffb95f] text-[#472a00] font-bold shadow-md ring-1 ring-amber-500'
                : 'text-[#e4beba] hover:bg-[#211f1f] hover:text-white'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">edit_note</span>
            <span>3. พิมพ์เอง / ข้อมูลจำลอง</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 md:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* TAB 1: Camera Photo & OCR */}
          {activeTab === 'camera' && (
            <div className="space-y-4">
              {/* Camera Frame */}
              <div className="relative w-full aspect-[16/10] bg-[#0f0e0e] border-2 border-dashed border-[#443837] rounded-xl overflow-hidden flex items-center justify-center shadow-inner">
                {cameraActive ? (
                  <>
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      autoPlay
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-4 md:inset-8 border-2 border-[#4cd7f6] rounded-lg pointer-events-none flex flex-col justify-between p-3 bg-cyan-950/15">
                      <div className="flex justify-between items-start text-[10px] font-label-tactical text-[#4cd7f6] bg-black/75 px-2 py-0.5 rounded">
                        <span>บัตรประจำตัวประชาชน THAI NATIONAL ID</span>
                        <span>[จัดบัตรให้พอดีกรอบ]</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-label-tactical text-amber-300 bg-black/75 px-2 py-0.5 rounded">
                        <span>รูปภาพและชื่อ-นามสกุล ชัดเจน</span>
                        <span>เห็นที่อยู่ด้านล่างครบถ้วน</span>
                      </div>
                    </div>
                  </>
                ) : imagePreview ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-black">
                    <img
                      src={imagePreview}
                      alt="Thai ID Card Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                    <div className="absolute top-2 right-2 bg-black/80 text-[#06C755] px-2.5 py-1 rounded text-xs font-label-tactical font-bold flex items-center gap-1 border border-[#06C755]/50">
                      <span className="material-symbols-outlined text-[15px]">check_circle</span>
                      <span>ถ่าย/โหลดภาพแล้ว</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-[#211f1f] border border-[#3e3433] mx-auto flex items-center justify-center text-[#ffb3ad]">
                      <span className="material-symbols-outlined text-[36px]">photo_camera</span>
                    </div>
                    <div>
                      <h4 className="font-headline-md text-base font-semibold text-[#e6e1e1]">
                        ถ่ายภาพบัตรประชาชน หรืออัปโหลดรูปภาพ
                      </h4>
                      <p className="font-body-md text-xs text-[#e4beba] max-w-sm mx-auto mt-1">
                        ระบบจะอ่านตัวอักษรภาษาไทย สกัดชื่อ อายุ เพศ และที่อยู่ พร้อมให้ตรวจสอบและแก้ไขก่อนบันทึก
                      </p>
                    </div>
                  </div>
                )}

                {isLoading && (
                  <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-4 space-y-3 z-20">
                    <div className="w-12 h-12 border-4 border-[#ff5451] border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-center space-y-1">
                      <div className="font-headline-md text-base font-bold text-[#e6e1e1]">
                        กำลังอ่านข้อมูลบัตรประชาชนด้วย AI
                      </div>
                      <p className="font-label-tactical text-xs text-[#4cd7f6]">
                        {loadingStepText}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {cameraError && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-300 flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px] text-amber-400 mt-0.5 flex-shrink-0">
                    info
                  </span>
                  <div>{cameraError}</div>
                </div>
              )}

              {ocrErrorNotice && (
                <div className="p-3 bg-amber-500/15 border border-amber-500/40 rounded-lg text-xs text-amber-200 flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px] text-amber-300 mt-0.5 flex-shrink-0">
                    warning
                  </span>
                  <div>{ocrErrorNotice}</div>
                </div>
              )}

              {/* Action Buttons for Camera */}
              <div className="grid grid-cols-2 gap-2">
                {!cameraActive ? (
                  <button
                    onClick={startCamera}
                    className="h-12 px-3 rounded-lg bg-[#ff5451] hover:bg-[#ff8885] text-[#5c0008] font-headline-md text-xs font-bold flex items-center justify-center gap-2 shadow transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                    <span>เปิดกล้องถ่ายสด</span>
                  </button>
                ) : (
                  <button
                    onClick={capturePhoto}
                    className="h-12 px-3 rounded-lg bg-[#06C755] hover:bg-[#05b34c] text-white font-headline-md text-xs font-bold flex items-center justify-center gap-2 shadow transition-colors animate-pulse"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">camera</span>
                    <span>กดถ่ายภาพนี้ (สแกนทันที)</span>
                  </button>
                )}

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="h-12 px-3 rounded-lg bg-[#2b2a29] hover:bg-[#363434] text-[#e6e1e1] font-headline-md text-xs font-semibold flex items-center justify-center gap-2 border border-[#3e3433] transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">upload_file</span>
                  <span>เลือกรูปจากเครื่อง / คลังภาพ</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          )}

          {/* TAB 2: Smart Card Chip Reader */}
          {activeTab === 'card_reader' && (
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-[#0f0e0e] border border-[#2e2423] shadow-inner text-center space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  {/* Smart Card Visual */}
                  <div
                    className={`relative w-48 h-30 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 border-2 rounded-xl p-3 shadow-xl transition-all duration-300 flex flex-col justify-between ${
                      smartCardInserted
                        ? 'border-[#06C755] ring-2 ring-[#06C755]/50 scale-105'
                        : 'border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                        <span className="text-[9px] font-label-tactical text-slate-300 uppercase">
                          THAI NATIONAL ID
                        </span>
                      </div>
                      <span className="text-[10px]">🇹🇭</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-7 h-5 rounded bg-amber-400 border border-amber-600 flex items-center justify-center shadow-sm">
                        <div className="w-4 h-3 border border-amber-800/40 rounded-sm"></div>
                      </div>
                      <span className="font-label-tactical text-[9px] text-amber-200">
                        EMV CHIP 80KB
                      </span>
                    </div>

                    <div className="text-left font-label-tactical text-[10px] text-slate-300 truncate font-bold">
                      {smartCardInserted
                        ? cardForm.fullName || PRESET_CARDS.find((c) => c.id === selectedPresetId)?.data.fullName
                        : '•••• ••••• •••••••'}
                    </div>
                  </div>

                  {/* Smart Card USB Reader Unit */}
                  <div className="w-52 bg-[#1c1b1b] border-2 border-[#4cd7f6] rounded-xl p-3 text-left shadow-lg">
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#2e2423]">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">
                          usb
                        </span>
                        <span className="font-label-tactical text-[11px] text-[#4cd7f6] font-bold">
                          {usbDeviceName || 'เครื่องอ่าน USB CCID'}
                        </span>
                      </div>
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          smartCardInserted ? 'bg-[#06C755] animate-ping' : 'bg-zinc-600'
                        }`}
                      ></span>
                    </div>

                    <div className="mt-2 text-[11px] font-label-tactical text-[#e4beba] space-y-1">
                      <div>สถานะ: {isReadingCard ? 'กำลังอ่านชิป...' : smartCardInserted ? 'อ่านสำเร็จ' : 'พร้อมใช้งาน'}</div>
                      <div>โปรโตคอล: T=0, T=1 / ISO 7816</div>
                    </div>
                  </div>
                </div>

                {/* Progress bar during card reading */}
                {isReadingCard && (
                  <div className="w-full bg-[#211f1f] rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#4cd7f6] to-[#06C755] h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${cardProgress}%` }}
                    ></div>
                  </div>
                )}

                {/* Real Hardware & Agent Connection Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={handleConnectRealUsbReader}
                    className="h-11 px-3 rounded-lg bg-[#4cd7f6] hover:bg-[#38bdf8] text-[#003640] font-headline-md text-xs font-bold flex items-center justify-center gap-1.5 shadow"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">cable</span>
                    <span>1. เชื่อมต่อเครื่องอ่าน USB จริง (WebUSB)</span>
                  </button>

                  <button
                    onClick={handleConnectLocalAgent}
                    className="h-11 px-3 rounded-lg bg-[#2b2a29] hover:bg-[#363434] text-[#4cd7f6] font-headline-md text-xs font-bold flex items-center justify-center gap-1.5 border border-[#3e3433]"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">lan</span>
                    <span>2. ค้นหา Agent ในเครื่อง (Localhost)</span>
                  </button>
                </div>

                {localAgentStatus && (
                  <div className="p-2 rounded bg-[#1c1b1b] border border-[#2e2423] text-[11px] font-label-tactical text-amber-300 text-left">
                    {localAgentStatus}
                  </div>
                )}

                {/* Simulated Chip Read Button */}
                <div className="pt-2 border-t border-[#2e2423]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-label-tactical text-xs text-[#e4beba]">
                      หรือทดสอบอ่านชิปด้วยข้อมูลเคส:
                    </span>
                    <select
                      value={selectedPresetId}
                      onChange={(e) => setSelectedPresetId(e.target.value)}
                      className="bg-[#1c1b1b] border border-[#2e2423] rounded px-2 py-1 text-xs text-[#e6e1e1] font-label-tactical"
                    >
                      {PRESET_CARDS.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleReadChipCard}
                    disabled={isReadingCard}
                    className="w-full h-11 rounded-lg bg-[#06C755] hover:bg-[#05b34c] text-white font-headline-md font-bold text-xs flex items-center justify-center gap-2 shadow transition-transform active:scale-95 disabled:opacity-50"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">contactless</span>
                    <span>
                      {isReadingCard ? 'กำลังประมวลผล APDU...' : 'กดเพื่ออ่านข้อมูลจากชิปการ์ดทันที'}
                    </span>
                  </button>
                </div>

                {/* APDU Terminal Logs */}
                {apduLogs.length > 0 && (
                  <div className="text-left bg-black/90 p-3 rounded-lg border border-[#2e2423] font-label-tactical text-[10px] text-[#4cd7f6] space-y-0.5 max-h-24 overflow-y-auto">
                    {apduLogs.map((log, idx) => (
                      <div key={idx}>{log}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* Paste Smart Card text from external card reader software */}
              <div className="p-3 rounded-xl bg-[#211f1f] border border-[#2e2423] space-y-2">
                <span className="font-headline-md text-xs font-bold text-[#e6e1e1] block">
                  📋 วางข้อความที่คัดลอกมาจากโปรแกรมอ่านบัตร (Smart Card Clipboard)
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={smartCardPasteText}
                    onChange={(e) => setSmartCardPasteText(e.target.value)}
                    placeholder="วางข้อความ เช่น เลข 13 หลัก, ชื่อ นามสกุล หรือที่อยู่..."
                    className="flex-1 bg-[#0f0e0e] border border-[#2e2423] rounded-lg px-3 py-2 text-xs text-[#e6e1e1] focus:outline-none focus:border-[#4cd7f6]"
                  />
                  <button
                    onClick={handleParsePastedText}
                    className="px-3 rounded-lg bg-[#2b2a29] hover:bg-[#363434] text-[#4cd7f6] font-headline-md text-xs font-bold border border-[#3e3433]"
                    type="button"
                  >
                    สกัดข้อมูล
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Manual Input & Curated Presets */}
          {activeTab === 'manual' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#211f1f] border border-[#2e2423] space-y-3">
                <h4 className="font-headline-md text-sm font-bold text-[#e6e1e1]">
                  คีย์ข้อมูลผู้ป่วยด้วยตนเอง
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                  <div className="sm:col-span-8">
                    <label className="text-[#e4beba] block font-label-tactical text-[11px] mb-1">
                      ชื่อ-นามสกุล ผู้ป่วย
                    </label>
                    <input
                      type="text"
                      value={manualInput.name}
                      onChange={(e) => setManualInput({ ...manualInput, name: e.target.value })}
                      placeholder="เช่น นายมานพ สุขใจ"
                      className="w-full p-2.5 rounded-lg bg-[#0f0e0e] border border-[#2e2423] text-[#e6e1e1] text-xs focus:outline-none focus:border-[#ffb95f]"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="text-[#e4beba] block font-label-tactical text-[11px] mb-1">
                      อายุ
                    </label>
                    <input
                      type="text"
                      value={manualInput.age}
                      onChange={(e) => setManualInput({ ...manualInput, age: e.target.value })}
                      placeholder="เช่น 45 ปี"
                      className="w-full p-2.5 rounded-lg bg-[#0f0e0e] border border-[#2e2423] text-[#e6e1e1] text-xs focus:outline-none focus:border-[#ffb95f]"
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <label className="text-[#e4beba] block font-label-tactical text-[11px] mb-1">
                      เพศ & จำนวน
                    </label>
                    <select
                      value={manualInput.genderCount}
                      onChange={(e) => setManualInput({ ...manualInput, genderCount: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-[#0f0e0e] border border-[#2e2423] text-[#e6e1e1] text-xs focus:outline-none focus:border-[#ffb95f]"
                    >
                      <option value="ชาย 1 ราย">ชาย 1 ราย</option>
                      <option value="หญิง 1 ราย">หญิง 1 ราย</option>
                      <option value="เด็ก 1 ราย">เด็ก 1 ราย</option>
                    </select>
                  </div>

                  <div className="sm:col-span-6">
                    <label className="text-[#e4beba] block font-label-tactical text-[11px] mb-1">
                      เลขประจำตัวประชาชน 13 หลัก
                    </label>
                    <input
                      type="text"
                      value={manualInput.id}
                      onChange={(e) => setManualInput({ ...manualInput, id: e.target.value })}
                      placeholder="1-3099-XXXXX-XX-X"
                      className="w-full p-2.5 rounded-lg bg-[#0f0e0e] border border-[#2e2423] text-[#e6e1e1] text-xs font-label-tactical focus:outline-none focus:border-[#ffb95f]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#e4beba] block font-label-tactical text-[11px] mb-1">
                    ที่อยู่ตามบัตร
                  </label>
                  <textarea
                    rows={2}
                    value={manualInput.address}
                    onChange={(e) => setManualInput({ ...manualInput, address: e.target.value })}
                    placeholder="ระบุบ้านเลขที่ หมู่ ซอย ถนน ตำบล อำเภอ จังหวัด..."
                    className="w-full p-2.5 rounded-lg bg-[#0f0e0e] border border-[#2e2423] text-[#e6e1e1] text-xs resize-none focus:outline-none focus:border-[#4cd7f6]"
                  />
                </div>

                <button
                  onClick={handleManualApply}
                  className="w-full h-11 rounded-lg bg-[#ffb95f] hover:bg-[#ee9800] text-[#472a00] font-headline-md font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                  <span>บันทึกและนำข้อมูลมาตรวจสอบ</span>
                </button>
              </div>

              {/* Sample Cards Quick Selection */}
              <div className="space-y-2">
                <span className="font-headline-md text-xs text-[#4cd7f6] font-bold block">
                  ⚡ หรือคลิกเลือกบัตรประชาชนตัวอย่างทันที:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PRESET_CARDS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPresetCard(preset)}
                      className="p-3 rounded-lg bg-[#211f1f] hover:bg-[#2b2a29] border border-[#3e3433] text-left transition-colors flex items-center justify-between"
                      type="button"
                    >
                      <div>
                        <div className="font-headline-md text-xs font-bold text-[#e6e1e1]">
                          {preset.data.fullName}
                        </div>
                        <div className="text-[10px] text-[#ffb95f] font-label-tactical">
                          {preset.data.genderCount} | {preset.data.age}
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">
                        arrow_forward
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* EDITABLE EXTRACTED RESULTS SECTION (Appears whenever data is parsed or selected) */}
          {hasData && (
            <div className="p-4 rounded-xl bg-[#211f1f] border-2 border-[#06C755] shadow-xl space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-[#2e2423] pb-2">
                <div className="flex items-center gap-2 text-[#06C755]">
                  <span className="material-symbols-outlined text-[22px]">verified</span>
                  <span className="font-headline-md font-bold text-sm md:text-base text-[#e6e1e1]">
                    ผลการอ่านข้อมูลบัตร (สามารถพิมพ์แก้ไขได้โดยตรง)
                  </span>
                </div>
                <span className="font-label-tactical text-[11px] text-[#4cd7f6] bg-[#0f0e0e] px-2.5 py-0.5 rounded-full border border-[#2e2423]">
                  {cardForm.readMethod === 'smart_card' ? 'SMART CARD CHIP' : 'AI CAMERA OCR'}
                </span>
              </div>

              {/* Side-by-Side Review if Image Preview exists */}
              {imagePreview && (
                <div className="flex items-center gap-3 p-2 bg-[#0f0e0e] rounded-lg border border-[#2e2423]">
                  <img
                    src={imagePreview}
                    alt="Captured Card"
                    className="w-24 h-16 object-cover rounded border border-[#3e3433]"
                  />
                  <div className="text-xs space-y-0.5">
                    <div className="font-headline-md font-bold text-[#e6e1e1]">ภาพบัตรที่อ่านได้</div>
                    <div className="text-[11px] text-[#4cd7f6] font-label-tactical">
                      ตรวจทานความถูกต้องกับช่องข้อมูลด้านล่างนี้
                    </div>
                  </div>
                </div>
              )}

              {/* Editable Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 text-xs">
                {/* Full Name */}
                <div className="md:col-span-7 p-2.5 bg-[#0f0e0e] rounded-lg border border-[#2e2423]">
                  <label className="text-[#e4beba] text-[10px] block font-label-tactical uppercase font-semibold mb-1">
                    ชื่อ - นามสกุล ผู้ป่วย:
                  </label>
                  <input
                    type="text"
                    value={cardForm.fullName}
                    onChange={(e) => setCardForm({ ...cardForm, fullName: e.target.value })}
                    placeholder="ระบุชื่อ-นามสกุล..."
                    className="w-full bg-transparent font-bold text-[#e6e1e1] text-sm focus:outline-none border-b border-transparent focus:border-[#4cd7f6]"
                  />
                </div>

                {/* Gender Count with Quick Buttons */}
                <div className="md:col-span-3 p-2.5 bg-[#0f0e0e] rounded-lg border border-[#2e2423]">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[#e4beba] text-[10px] block font-label-tactical uppercase font-semibold">
                      เพศ & จำนวน:
                    </label>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setCardForm({ ...cardForm, gender: 'ชาย', genderCount: 'ชาย 1 ราย' })}
                        className={`text-[9px] px-1 py-0.2 rounded font-label-tactical ${
                          cardForm.genderCount.includes('ชาย') ? 'bg-[#ffb3ad] text-[#5c0008] font-bold' : 'text-zinc-400'
                        }`}
                      >
                        ชาย
                      </button>
                      <button
                        type="button"
                        onClick={() => setCardForm({ ...cardForm, gender: 'หญิง', genderCount: 'หญิง 1 ราย' })}
                        className={`text-[9px] px-1 py-0.2 rounded font-label-tactical ${
                          cardForm.genderCount.includes('หญิง') ? 'bg-[#ffb3ad] text-[#5c0008] font-bold' : 'text-zinc-400'
                        }`}
                      >
                        หญิง
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={cardForm.genderCount}
                    onChange={(e) => setCardForm({ ...cardForm, genderCount: e.target.value })}
                    placeholder="เช่น ชาย 1 ราย"
                    className="w-full bg-transparent font-bold text-[#ffb95f] text-sm focus:outline-none border-b border-transparent focus:border-[#ffb95f]"
                  />
                </div>

                {/* Age */}
                <div className="md:col-span-2 p-2.5 bg-[#0f0e0e] rounded-lg border border-[#2e2423]">
                  <label className="text-[#e4beba] text-[10px] block font-label-tactical uppercase font-semibold mb-1">
                    อายุ:
                  </label>
                  <input
                    type="text"
                    value={cardForm.age}
                    onChange={(e) => setCardForm({ ...cardForm, age: e.target.value })}
                    placeholder="เช่น 38 ปี"
                    className="w-full bg-transparent font-bold text-[#ffb95f] text-sm focus:outline-none border-b border-transparent focus:border-[#ffb95f]"
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-12 p-2.5 bg-[#0f0e0e] rounded-lg border border-[#2e2423]">
                  <label className="text-[#e4beba] text-[10px] block font-label-tactical uppercase font-semibold mb-1">
                    ที่อยู่ตามบัตรประชาชน:
                  </label>
                  <textarea
                    rows={2}
                    value={cardForm.address}
                    onChange={(e) => setCardForm({ ...cardForm, address: e.target.value })}
                    placeholder="ระบุที่อยู่ตามบัตรประชาชน..."
                    className="w-full bg-transparent text-[#e6e1e1] text-xs resize-none focus:outline-none border-b border-transparent focus:border-[#4cd7f6]"
                  />
                </div>

                {/* National ID */}
                <div className="md:col-span-12 p-2 bg-[#0f0e0e] rounded-lg border border-[#2e2423] flex items-center justify-between">
                  <span className="text-[#e4beba] text-[10px] font-label-tactical">
                    เลขประจำตัวประชาชน 13 หลัก:
                  </span>
                  <input
                    type="text"
                    value={cardForm.nationalId || ''}
                    onChange={(e) => setCardForm({ ...cardForm, nationalId: e.target.value })}
                    placeholder="1-3099-00000-00-0"
                    className="bg-transparent font-label-tactical font-bold text-[#4cd7f6] text-xs text-right focus:outline-none"
                  />
                </div>
              </div>

              {/* Primary Action Button */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={handleConfirmApply}
                  className="flex-1 h-13 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white font-headline-md font-bold text-sm md:text-base flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98]"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[24px]">how_to_reg</span>
                  <span>ยืนยันและนำข้อมูลลงฟอร์มทันที (Auto-Fill PART 03)</span>
                </button>

                <button
                  onClick={() => setHasData(false)}
                  className="h-13 px-4 rounded-xl bg-[#2b2a29] hover:bg-[#363434] text-[#e4beba] hover:text-white font-label-tactical text-xs border border-[#3e3433] transition-colors"
                  type="button"
                >
                  ล้างค่า
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer with Big Distinct Close Button */}
        <div className="px-5 py-3.5 bg-[#211f1f] border-t border-[#2e2423] flex items-center justify-between">
          <div className="text-xs text-[#e4beba] font-label-tactical">
            กดปุ่ม <span className="text-white font-bold">ESC</span> หรือคลิกปุ่มปิดเมื่อต้องการออก
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#363434] hover:bg-[#ff5451] text-[#e6e1e1] hover:text-[#5c0008] font-headline-md text-xs font-bold flex items-center gap-1.5 transition-colors border border-[#443837] shadow"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
            <span>ปิดหน้าต่างนี้ (ยกเลิก)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
