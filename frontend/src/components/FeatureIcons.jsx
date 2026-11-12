import React from 'react';

export function IsoShieldIcon({ className = "w-14 h-14" }) {
  return (
    <div className={`relative shrink-0 select-none ${className}`}>
      <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="shieldGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="30%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
          <linearGradient id="shieldBlue" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="50%" stopColor="#0F2B5C" />
            <stop offset="100%" stopColor="#0B1A36" />
          </linearGradient>
          <linearGradient id="shieldCheck" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <filter id="shadowFilter" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#000000" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Outer Gold Shield Rim */}
        <path 
          d="M40 6C22 6 12 11 12 24C12 48 24 66 40 74C56 66 68 48 68 24C68 11 58 6 40 6Z" 
          fill="url(#shieldGold)" 
          stroke="#FBBF24" 
          strokeWidth="1.5"
          filter="url(#shadowFilter)"
        />

        {/* Inner Bevel Border */}
        <path 
          d="M40 9C24 9 15 13.5 15 25C15 46 26 63 40 70C54 63 65 46 65 25C65 13.5 56 9 40 9Z" 
          fill="#D97706" 
          opacity="0.9"
        />

        {/* Inner Deep Royal Blue Field */}
        <path 
          d="M40 12C26 12 18 16 18 26C18 45 28 60 40 67C52 60 62 45 62 26C62 16 54 12 40 12Z" 
          fill="url(#shieldBlue)" 
          stroke="#FDE68A" 
          strokeWidth="1"
        />

        {/* Top 3 Golden Stars */}
        <polygon points="40,16 41.5,20 46,20 42.5,22.5 44,27 40,24 36,27 37.5,22.5 34,20 38.5,20" fill="#FBBF24" stroke="#78350F" strokeWidth="0.5" />
        <polygon points="30,19 31,22 34.5,22 31.8,24 33,27 30,25 27,27 28.2,24 25.5,22 29,22" fill="#FDE68A" opacity="0.9" />
        <polygon points="50,19 51,22 54.5,22 51.8,24 53,27 50,25 47,27 48.2,24 45.5,22 49,22" fill="#FDE68A" opacity="0.9" />

        {/* Center Green Verification Disc */}
        <circle cx="40" cy="38" r="14" fill="#047857" stroke="#34D399" strokeWidth="1.5" />
        <circle cx="40" cy="38" r="11.5" fill="url(#shieldCheck)" />

        {/* White Checkmark */}
        <path d="M33 38L38 43L48 33" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Bottom Gold Ribbon Banner */}
        <path d="M18 52H62L57 60H23L18 52Z" fill="url(#shieldGold)" stroke="#78350F" strokeWidth="0.8" />
        <text x="40" y="58" textAnchor="middle" fill="#0F2B5C" fontSize="6.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">
          ISO 9001
        </text>
      </svg>
    </div>
  );
}

export function CertificateMedalIcon({ className = "w-14 h-14" }) {
  return (
    <div className={`relative shrink-0 select-none ${className}`}>
      <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="medalRibbonRed" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#991B1B" />
            <stop offset="30%" stopColor="#DC2626" />
            <stop offset="50%" stopColor="#F87171" />
            <stop offset="70%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
          <linearGradient id="medalRibbonBlue" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
          <linearGradient id="medalGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="30%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>
          <radialGradient id="goldRadial" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#FEF9C3" />
            <stop offset="40%" stopColor="#FBBF24" />
            <stop offset="80%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </radialGradient>
        </defs>

        {/* Folded Satin Ribbon Hanging */}
        {/* Left Ribbon tail */}
        <path d="M26 8L20 44L28 40L36 44L33 8H26Z" fill="url(#medalRibbonRed)" stroke="#7F1D1D" strokeWidth="0.8" />
        <path d="M29 8V40" stroke="#FBBF24" strokeWidth="1.5" />

        {/* Right Ribbon tail */}
        <path d="M47 8L44 44L52 40L60 44L54 8H47Z" fill="url(#medalRibbonBlue)" stroke="#1E3A8A" strokeWidth="0.8" />
        <path d="M51 8V40" stroke="#FBBF24" strokeWidth="1.5" />

        {/* Big 3D Golden Medallion */}
        <circle cx="40" cy="46" r="22" fill="url(#medalGold)" stroke="#78350F" strokeWidth="1.5" />
        
        {/* Decorative Scalloped Medallion Ring */}
        <circle cx="40" cy="46" r="19" fill="url(#goldRadial)" stroke="#FDE68A" strokeWidth="1.5" strokeDasharray="3 1.5" />
        <circle cx="40" cy="46" r="15" fill="#D97706" />
        <circle cx="40" cy="46" r="14" fill="url(#goldRadial)" />

        {/* Laurel Wreath Engraving */}
        <path d="M30 46C30 40 34 35 40 35C46 35 50 40 50 46C50 52 46 56 40 56C34 56 30 52 30 46Z" fill="none" stroke="#78350F" strokeWidth="1" strokeDasharray="2 2" />

        {/* 3D Golden Star in Center */}
        <polygon 
          points="40,36 42.5,42.5 49,43 44,47.5 45.5,54 40,50.5 34.5,54 36,47.5 31,43 37.5,42.5" 
          fill="#FFFBEB" 
          stroke="#78350F" 
          strokeWidth="1" 
        />
        <polygon points="40,36 42.5,42.5 40,50.5 37.5,42.5" fill="#FEF08A" />
        <polygon points="40,50.5 45.5,54 44,47.5" fill="#B45309" />
        <polygon points="40,50.5 34.5,54 36,47.5" fill="#B45309" />

        {/* Ribbon Pin at Top */}
        <rect x="22" y="6" width="36" height="4" rx="2" fill="url(#medalGold)" stroke="#78350F" strokeWidth="0.8" />
      </svg>
    </div>
  );
}

export function SchoolPartnershipIcon({ className = "w-14 h-14" }) {
  return (
    <div className={`relative shrink-0 select-none ${className}`}>
      <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="schoolRoof" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#065F46" />
          </linearGradient>
          <linearGradient id="schoolWall" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ECFDF5" />
            <stop offset="50%" stopColor="#D1FAE5" />
            <stop offset="100%" stopColor="#A7F3D0" />
          </linearGradient>
          <linearGradient id="capGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>

        {/* School Building Base / Steps */}
        <rect x="10" y="66" width="60" height="5" rx="1.5" fill="#065F46" />
        <rect x="14" y="62" width="52" height="4" rx="1" fill="#059669" />

        {/* Building Main Body */}
        <rect x="18" y="32" width="44" height="30" fill="url(#schoolWall)" stroke="#047857" strokeWidth="1.5" />

        {/* 4 Classical Pillars */}
        <rect x="22" y="36" width="4.5" height="26" rx="1" fill="#FFFFFF" stroke="#047857" strokeWidth="1" />
        <rect x="31" y="36" width="4.5" height="26" rx="1" fill="#FFFFFF" stroke="#047857" strokeWidth="1" />
        <rect x="44.5" y="36" width="4.5" height="26" rx="1" fill="#FFFFFF" stroke="#047857" strokeWidth="1" />
        <rect x="53.5" y="36" width="4.5" height="26" rx="1" fill="#FFFFFF" stroke="#047857" strokeWidth="1" />

        {/* Arch Doorway in Center */}
        <path d="M37 62V48C37 46 38.5 44 40 44C41.5 44 43 46 43 48V62H37Z" fill="#047857" />

        {/* Pediment / Triangular Roof */}
        <polygon points="40,16 12,32 68,32" fill="url(#schoolRoof)" stroke="#065F46" strokeWidth="1.5" />

        {/* Clock in Pediment */}
        <circle cx="40" cy="26" r="4.5" fill="#FFFFFF" stroke="#047857" strokeWidth="1" />
        <polyline points="40,23.5 40,26 42,26" stroke="#047857" strokeWidth="1" strokeLinecap="round" />

        {/* Floating 3D Graduation Cap on Top-Right */}
        <g transform="translate(18, -4)">
          <polygon points="34,14 48,9 62,14 48,19" fill="#0F2B5C" stroke="#0B1A36" strokeWidth="1" />
          <polygon points="40,16.5 48,19 56,16.5 56,21 48,24 40,21" fill="#1E3A8A" />
          {/* Golden Tassel */}
          <circle cx="48" cy="14" r="1.5" fill="url(#capGold)" />
          <path d="M48 14L55 20L56 25" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Zero-Cost Ribbon Badge */}
        <rect x="25" y="4" width="30" height="8" rx="4" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
        <text x="40" y="10" textAnchor="middle" fill="#78350F" fontSize="5.5" fontWeight="900" fontFamily="sans-serif">
          100% TIE-UP
        </text>
      </svg>
    </div>
  );
}

export function BrainGrowthIcon({ className = "w-14 h-14" }) {
  return (
    <div className={`relative shrink-0 select-none ${className}`}>
      <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="brainLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
          <linearGradient id="brainRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="50%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#7E22CE" />
          </linearGradient>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Brain Glowing Aura */}
        <circle cx="40" cy="40" r="32" fill="url(#centerGlow)" opacity="0.3" />

        {/* LEFT HEMISPHERE (LOGICAL / MATH / SPEED) */}
        <g>
          {/* Main left lobes */}
          <path 
            d="M38 16C31 16 26 19 23 23C19 21 14 25 14 30C12 32 10 36 10 41C10 48 15 54 20 57C20 62 25 66 31 66C34 66 37 64 38 62V16Z" 
            fill="url(#brainLeft)" 
            stroke="#1E40AF" 
            strokeWidth="1.5" 
          />
          {/* Left brain gyri / circuit lines */}
          <path d="M19 32C24 33 28 30 32 30" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
          <path d="M16 43C22 41 26 47 34 45" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
          <path d="M22 55C26 53 30 57 37 54" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
          
          {/* Math & Logic symbols */}
          <circle cx="28" cy="22" r="2.5" fill="#60A5FA" />
          <text x="21" y="27" fill="#FFFFFF" fontSize="6" fontWeight="bold">+</text>
          <text x="14" y="52" fill="#FFFFFF" fontSize="6" fontWeight="bold">÷</text>
          <text x="28" y="38" fill="#FDE68A" fontSize="7" fontWeight="bold">∑</text>
        </g>

        {/* RIGHT HEMISPHERE (CREATIVE / ART / RHYTHM) */}
        <g>
          {/* Main right lobes */}
          <path 
            d="M42 16C49 16 54 19 57 23C61 21 66 25 66 30C68 32 70 36 70 41C70 48 65 54 60 57C60 62 55 66 49 66C46 66 43 64 42 62V16Z" 
            fill="url(#brainRight)" 
            stroke="#6B21A8" 
            strokeWidth="1.5" 
          />
          {/* Right brain gyri / flow lines */}
          <path d="M61 32C56 33 52 30 48 30" stroke="#F472B6" strokeWidth="2" strokeLinecap="round" />
          <path d="M64 43C58 41 54 47 46 45" stroke="#F472B6" strokeWidth="2" strokeLinecap="round" />
          <path d="M58 55C54 53 50 57 43 54" stroke="#F472B6" strokeWidth="2" strokeLinecap="round" />

          {/* Art & Creative sparks */}
          <circle cx="58" cy="26" r="2" fill="#FBBF24" />
          <circle cx="63" cy="37" r="1.5" fill="#34D399" />
          <circle cx="53" cy="53" r="2" fill="#F43F5E" />

          {/* Music & Sparkle icons */}
          <path d="M52 23L56 21V26" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="52" cy="25" r="1.5" fill="#FFFFFF" />
          <polygon points="56,36 57.5,39 60,39 58,41 59,43.5 56,42 53,43.5 54,41 52,39 54.5,39" fill="#FDE68A" />
        </g>

        {/* Center Synaptic Bridge Glowing Energy Beam */}
        <rect x="38" y="18" width="4" height="44" rx="2" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1" />
        <circle cx="40" cy="28" r="3" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="1" />
        <circle cx="40" cy="40" r="3.5" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="1.2" />
        <circle cx="40" cy="52" r="3" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="1" />
      </svg>
    </div>
  );
}
