import React from 'react';

interface Hook31LogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
}

export const Hook31Logo: React.FC<Hook31LogoProps> = ({
  className = 'w-10 h-10',
  size,
  showText = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 320 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-contain filter drop-shadow-sm select-none"
        style={size ? { width: size, height: size } : undefined}
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="goldRayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE066" />
            <stop offset="50%" stopColor="#F5B700" />
            <stop offset="100%" stopColor="#D48B00" />
          </linearGradient>

          <linearGradient id="blueRayGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#102A43" />
            <stop offset="100%" stopColor="#0B1A2C" />
          </linearGradient>

          <linearGradient id="redFlameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#B30006" />
            <stop offset="60%" stopColor="#E60000" />
            <stop offset="100%" stopColor="#FF3333" />
          </linearGradient>

          <linearGradient id="wreathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F7B3E" />
            <stop offset="60%" stopColor="#0B5D2E" />
            <stop offset="100%" stopColor="#063D1E" />
          </linearGradient>

          <filter id="badgeShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* 1. TOP GOLDEN RADIATING SUNBURST RAYS (15 Golden + Navy Rays Arching Upward) */}
        <g id="sunburstRays">
          {/* Ray 1 (Far Left) */}
          <polygon points="50,185 160,115 75,150" fill="#102A43" />
          <polygon points="50,185 160,115 65,165" fill="url(#goldRayGrad)" stroke="#B37D00" strokeWidth="0.8" />
          
          {/* Ray 2 */}
          <polygon points="65,150 160,115 90,125" fill="#102A43" />
          <polygon points="65,150 160,115 80,135" fill="url(#goldRayGrad)" stroke="#B37D00" strokeWidth="0.8" />

          {/* Ray 3 */}
          <polygon points="82,120 160,115 110,100" fill="#102A43" />
          <polygon points="82,120 160,115 95,108" fill="url(#goldRayGrad)" stroke="#B37D00" strokeWidth="0.8" />

          {/* Ray 4 */}
          <polygon points="102,95 160,115 130,85" fill="#102A43" />
          <polygon points="102,95 160,115 115,88" fill="url(#goldRayGrad)" stroke="#B37D00" strokeWidth="0.8" />

          {/* Ray 5 */}
          <polygon points="125,75 160,115 145,70" fill="#102A43" />
          <polygon points="125,75 160,115 135,72" fill="url(#goldRayGrad)" stroke="#B37D00" strokeWidth="0.8" />

          {/* Ray 6 (Left Center) */}
          <polygon points="145,62 160,115 155,58" fill="#102A43" />
          <polygon points="145,62 160,115 150,60" fill="url(#goldRayGrad)" stroke="#B37D00" strokeWidth="0.8" />

          {/* Ray 7 (Top Apex Crown / Spire) */}
          <polygon points="155,45 160,115 165,45" fill="url(#goldRayGrad)" stroke="#B37D00" strokeWidth="0.8" />

          {/* Ray 8 (Right Center) */}
          <polygon points="175,62 160,115 165,58" fill="#102A43" />
          <polygon points="175,62 160,115 170,60" fill="url(#goldRayGrad)" stroke="#B37D00" strokeWidth="0.8" />

          {/* Ray 9 */}
          <polygon points="195,75 160,115 175,70" fill="#102A43" />
          <polygon points="195,75 160,115 185,72" fill="url(#goldRayGrad)" stroke="#B37D00" strokeWidth="0.8" />

          {/* Ray 10 */}
          <polygon points="218,95 160,115 190,85" fill="#102A43" />
          <polygon points="218,95 160,115 205,88" fill="url(#goldRayGrad)" stroke="#B37D00" strokeWidth="0.8" />

          {/* Ray 11 */}
          <polygon points="238,120 160,115 210,100" fill="#102A43" />
          <polygon points="238,120 160,115 225,108" fill="url(#goldRayGrad)" stroke="#B37D00" strokeWidth="0.8" />

          {/* Ray 12 */}
          <polygon points="255,150 160,115 230,125" fill="#102A43" />
          <polygon points="255,150 160,115 240,135" fill="url(#goldRayGrad)" stroke="#B37D00" strokeWidth="0.8" />

          {/* Ray 13 (Far Right) */}
          <polygon points="270,185 160,115 245,150" fill="#102A43" />
          <polygon points="270,185 160,115 255,165" fill="url(#goldRayGrad)" stroke="#B37D00" strokeWidth="0.8" />
        </g>

        {/* 2. SACRED FLAME / UNALOME STUPA EMBLEM (Red Center Top) */}
        <g id="sacredCrown">
          {/* Spire tip */}
          <path
            d="M160,70 L158,88 Q152,90 152,97 Q152,106 160,108 Q168,106 168,97 Q168,90 162,88 Z"
            fill="url(#redFlameGrad)"
          />
          {/* Flame aura rings */}
          <path
            d="M160,110 C140,110 135,124 135,134 C135,145 145,150 160,150 C175,150 185,145 185,134 C185,124 180,110 160,110 Z"
            fill="none"
            stroke="#D60000"
            strokeWidth="5"
          />
          {/* Inner flame eye */}
          <ellipse cx="160" cy="133" rx="10" ry="7" fill="url(#redFlameGrad)" />
          {/* Tiered base */}
          <path d="M145,95 L175,95 L170,102 L150,102 Z" fill="#D60000" />
          <path d="M148,87 L172,87 L168,92 L152,92 Z" fill="#D60000" />
        </g>

        {/* 3. UPPER THAI ARCH TEXT */}
        <path id="thaiTextPath" d="M 68,198 A 108,105 0 0,1 252,198" fill="none" />
        <text className="font-sans font-bold" fontSize="13" fill="#0C1B33" letterSpacing="0.6">
          <textPath href="#thaiTextPath" startOffset="50%" textAnchor="middle">
            มูลนิธิ พุทธธรรม 31 นครราชสีมา  พ่งไล้จับเก่าเซียวเกาะ
          </textPath>
        </text>

        {/* 4. LARGE RED CHINESE CHARACTER "佛" (Fo - Buddha / Dharma) */}
        <g id="chineseFo" transform="translate(108, 192)">
          {/* Left Radicals (Person Radical 亻) */}
          <path
            d="M 28,12 C 22,22 14,34 5,42 C 8,45 12,47 16,45 C 22,37 29,26 34,16 Z"
            fill="url(#redFlameGrad)"
          />
          <path
            d="M 22,35 L 29,38 C 29,52 28,78 28,95 C 28,102 24,103 21,102 C 18,90 20,60 21,35 Z"
            fill="url(#redFlameGrad)"
          />

          {/* Right Component (弗) */}
          {/* Top curve */}
          <path
            d="M 37,20 C 47,19 66,17 76,16 C 82,15 85,18 84,24 C 83,28 77,29 70,30 L 48,31 L 46,38 C 55,37 68,36 78,35 C 84,35 87,38 86,44 C 85,50 78,51 68,52 L 44,53 L 42,65 C 56,64 72,63 85,62 C 92,62 94,66 93,72 C 91,78 84,79 74,80 L 40,82 C 38,96 35,103 28,106 C 26,104 25,99 28,92 L 31,82 L 34,22 Z"
            fill="url(#redFlameGrad)"
          />
          {/* Vertical downstroke left */}
          <path
            d="M 52,8 L 60,9 C 58,40 57,75 55,108 C 55,115 50,115 48,110 C 46,75 48,40 52,8 Z"
            fill="url(#redFlameGrad)"
          />
          {/* Vertical downstroke right */}
          <path
            d="M 76,6 L 85,8 C 82,45 80,80 78,115 C 77,122 72,122 70,117 C 68,80 72,45 76,6 Z"
            fill="url(#redFlameGrad)"
          />
        </g>

        {/* 5. LOWER CHINESE BANNER / MOTTO TEXT */}
        <path id="chineseTextPath" d="M 88,272 A 80,80 0 0,0 232,272" fill="none" />
        <text className="font-serif font-bold" fontSize="12" fill="#0C1B33" letterSpacing="1.2">
          <textPath href="#chineseTextPath" startOffset="50%" textAnchor="middle">
            昭逢九十天蓬重善喜佛如同
          </textPath>
        </text>

        {/* 6. GREEN LAUREL / LOTUS PETAL WREATH (Both sides) */}
        <g id="wreathLeft" fill="url(#wreathGrad)" stroke="#063D1E" strokeWidth="0.7">
          {/* Left branch leaves cascading down to center */}
          <path d="M 62,200 C 42,210 38,225 50,232 C 58,222 62,210 62,200 Z" />
          <path d="M 50,225 C 32,238 30,255 42,262 C 50,250 52,238 50,225 Z" />
          <path d="M 42,255 C 28,270 28,290 40,296 C 47,282 48,268 42,255 Z" />
          <path d="M 42,290 C 30,305 32,325 45,330 C 51,316 50,302 42,290 Z" />
          <path d="M 50,325 C 40,340 45,360 60,364 C 64,350 60,336 50,325 Z" />
          <path d="M 65,355 C 58,370 70,385 88,386 C 88,372 80,360 65,355 Z" />
          <path d="M 88,380 C 85,392 102,402 120,400 C 117,388 106,380 88,380 Z" />
        </g>

        <g id="wreathRight" fill="url(#wreathGrad)" stroke="#063D1E" strokeWidth="0.7">
          {/* Right branch leaves cascading down to center */}
          <path d="M 258,200 C 278,210 282,225 270,232 C 262,222 258,210 258,200 Z" />
          <path d="M 270,225 C 288,238 290,255 278,262 C 270,250 268,238 270,225 Z" />
          <path d="M 278,255 C 292,270 292,290 280,296 C 273,282 272,268 278,255 Z" />
          <path d="M 278,290 C 290,305 288,325 275,330 C 269,316 270,302 278,290 Z" />
          <path d="M 270,325 C 280,340 275,360 260,364 C 256,350 260,336 270,325 Z" />
          <path d="M 255,355 C 262,370 250,385 232,386 C 232,372 240,360 255,355 Z" />
          <path d="M 232,380 C 235,392 218,402 200,400 C 203,388 214,380 232,380 Z" />
        </g>

        {/* 7. BOTTOM CENTRAL SHIELD & "ฮุก 31" ROUND EMBLEM */}
        <g id="hook31Badge" filter="url(#badgeShadow)">
          {/* Gold Wing Ribbons beneath */}
          <path
            d="M 120,380 C 105,385 100,398 115,402 C 130,400 145,390 150,385 Z"
            fill="url(#goldRayGrad)"
            stroke="#B37D00"
            strokeWidth="0.8"
          />
          <path
            d="M 200,380 C 215,385 220,398 205,402 C 190,400 175,390 170,385 Z"
            fill="url(#goldRayGrad)"
            stroke="#B37D00"
            strokeWidth="0.8"
          />

          {/* Red circular seal */}
          <circle cx="160" cy="355" r="32" fill="#D60000" stroke="#FFFFFF" strokeWidth="3" />
          <circle cx="160" cy="355" r="29" fill="none" stroke="#FFE066" strokeWidth="1.2" />

          {/* Text: "ฮุก" on top line */}
          <text
            x="160"
            y="348"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="18"
            fontWeight="bold"
            fontFamily="'Sarabun', 'Work Sans', sans-serif"
            letterSpacing="1"
          >
            ฮุก
          </text>

          {/* Text: "31" on bottom line */}
          <text
            x="160"
            y="373"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="22"
            fontWeight="900"
            fontFamily="'JetBrains Mono', 'Space Grotesk', sans-serif"
            letterSpacing="0.5"
          >
            31
          </text>
        </g>
      </svg>

      {showText && (
        <div className="flex flex-col text-left">
          <span className="font-bold text-sm leading-tight text-[#e6e1e1]">
            มูลนิธิพุทธธรรม 31
          </span>
          <span className="text-[11px] text-[#4cd7f6] font-medium leading-tight">
            นครราชสีมา (ฮุก 31)
          </span>
        </div>
      )}
    </div>
  );
};
