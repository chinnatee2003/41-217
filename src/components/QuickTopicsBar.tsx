import React, { useState } from 'react';
import { QuickTopic, IncidentReport } from '../types';

interface QuickTopicsBarProps {
  topics: QuickTopic[];
  onSelectTopic: (topic: QuickTopic) => void;
  onOpenAddModal: () => void;
  onDeleteCustomTopic?: (id: string) => void;
}

export const QuickTopicsBar: React.FC<QuickTopicsBarProps> = ({
  topics,
  onSelectTopic,
  onOpenAddModal,
  onDeleteCustomTopic,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const categories = [
    { id: 'all', label: 'ทั้งหมด', icon: 'grid_view' },
    { id: 'accident', label: '💥 อุบัติเหตุ', icon: 'car_crash' },
    { id: 'illness', label: '🫀 ผู้ป่วย', icon: 'medical_services' },
    { id: 'cpr', label: '⚡ CPR', icon: 'e911_emergency' },
    { id: 'rescue', label: '🚒 กู้ภัย', icon: 'handyman' },
    { id: 'custom', label: '⭐ ที่เพิ่มเอง', icon: 'star' },
  ];

  const filteredTopics = topics.filter((t) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'custom') return t.isCustom;
    return t.category === selectedCategory;
  });

  return (
    <div className="w-full bg-[#1c1b1b] border-b border-[#2e2423] shadow-md transition-all duration-200">
      <div className="max-w-[1720px] mx-auto px-4 md:px-6 py-2">
        {/* Top bar with Radio Frequency info and Header toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-[#2a2423]">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#251a1a] border border-[#ff5451]/40 text-[#ffb3ad] shadow-sm">
              <span className="material-symbols-outlined text-[16px] text-[#ff5451] animate-pulse">
                radio
              </span>
              <span className="font-label-tactical text-xs font-bold text-white">
                ความถี่วิทยุสื่อสาร: 173.475 MHz
              </span>
              <span className="text-[10px] text-[#4cd7f6] font-semibold hidden md:inline">
                (ข่ายวิทยุ มูลนิธิพุทธธรรม 31 โคราช)
              </span>
            </div>

            <div className="h-4 w-px bg-[#362e2d] hidden sm:block"></div>

            <span className="font-label-tactical text-xs text-[#e4beba] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#ffb95f]">
                electric_bolt
              </span>
              หัวข้อด่วน (Quick Topics):
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* The requested ADD QUICK OPTION BUTTON */}
            <button
              type="button"
              onClick={onOpenAddModal}
              className="h-8 md:h-9 px-3 rounded-lg bg-[#ff5451] hover:bg-[#ff8885] text-[#5c0008] font-label-tactical text-xs font-bold flex items-center gap-1.5 transition-all shadow active:scale-95 border border-[#ff8885]"
              title="เพิ่มตัวเลือกด่วน / บันทึกเคสประจำจุดใหม่"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>＋ เพิ่มตัวเลือกด่วน</span>
            </button>

            {/* Collapse / Expand Topics Bar */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 px-2.5 rounded-lg bg-[#2b2a29] hover:bg-[#383635] text-[#e4beba] hover:text-white transition-colors font-label-tactical text-xs flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isExpanded ? 'expand_less' : 'expand_more'}
              </span>
              <span className="hidden sm:inline">{isExpanded ? 'ย่อแถบ' : 'ขยายแถบ'}</span>
            </button>
          </div>
        </div>

        {/* Collapsible Topics Selector */}
        {isExpanded && (
          <div className="pt-2.5 flex flex-col gap-2">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => {
                const count =
                  cat.id === 'all'
                    ? topics.length
                    : cat.id === 'custom'
                    ? topics.filter((t) => t.isCustom).length
                    : topics.filter((t) => t.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`h-7 px-2.5 rounded-md font-label-tactical text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      selectedCategory === cat.id
                        ? 'bg-[#4cd7f6] text-[#003640] shadow'
                        : 'bg-[#252323] hover:bg-[#2e2a29] text-[#e4beba] border border-[#362e2d]'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`px-1 py-0.2 rounded-full text-[9px] ${
                        selectedCategory === cat.id
                          ? 'bg-[#003640] text-[#4cd7f6]'
                          : 'bg-[#181616] text-[#a89f9e]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Topic Chips */}
            <div className="flex flex-wrap items-center gap-1.5 max-h-36 overflow-y-auto pr-1">
              {filteredTopics.map((topic) => {
                const isCPR = topic.category === 'cpr';
                const isCustom = topic.isCustom;

                return (
                  <div key={topic.id} className="relative group inline-flex items-center">
                    <button
                      type="button"
                      onClick={() => onSelectTopic(topic)}
                      className={`h-8 px-2.5 rounded-lg font-label-tactical text-[11px] font-semibold transition-all flex items-center gap-1.5 active:scale-95 shadow-sm border ${
                        isCPR
                          ? 'bg-[#93000a] hover:bg-[#b91a24] text-[#ffdad6] border-[#ff5451] animate-pulse'
                          : isCustom
                          ? 'bg-[#2d2218] hover:bg-[#3d2f21] text-[#ffb95f] border-[#8a5d2a]'
                          : 'bg-[#2b2a29] hover:bg-[#383635] text-[#e6e1e1] hover:text-white border-[#3e3433]'
                      }`}
                      title={topic.symptoms}
                    >
                      {topic.badge && (
                        <span className="text-[10px] opacity-90">{topic.badge}</span>
                      )}
                      <span>{topic.title}</span>
                    </button>

                    {/* Delete button for user-added custom topics */}
                    {isCustom && onDeleteCustomTopic && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`ลบตัวเลือกด่วน "${topic.title}" ใช่หรือไม่?`)) {
                            onDeleteCustomTopic(topic.id);
                          }
                        }}
                        className="ml-0.5 w-5 h-5 rounded-full bg-[#3b1212] hover:bg-[#ff5451] text-[#ffdad6] hover:text-[#5c0008] text-[10px] flex items-center justify-center transition-colors"
                        title="ลบตัวเลือกนี้"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                );
              })}

              {filteredTopics.length === 0 && (
                <div className="py-2 text-xs text-[#a89f9e] italic flex items-center gap-1.5">
                  <span>ยังไม่มีหัวข้อในหมวดนี้</span>
                  <button
                    type="button"
                    onClick={onOpenAddModal}
                    className="text-[#4cd7f6] underline hover:text-[#7ce5ff]"
                  >
                    คลิกที่นี่เพื่อเพิ่มตัวเลือกด่วน
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
