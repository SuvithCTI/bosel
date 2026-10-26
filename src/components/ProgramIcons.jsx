import React from 'react';

export default function ProgramIcon({ type, className = "w-10 h-10" }) {
  switch (type) {
    case 'abacus':
      // Abacus frame with beads in green tones
      return (
        <div className={`rounded-xl bg-emerald-100/90 border border-emerald-300 p-2 flex items-center justify-center shadow-sm ${className}`}>
          <svg viewBox="0 0 48 48" className="w-full h-full" fill="none" stroke="currentColor">
            {/* Outer wooden frame */}
            <rect x="6" y="8" width="36" height="32" rx="4" fill="#059669" stroke="#047857" strokeWidth="2" />
            <rect x="9" y="11" width="30" height="26" rx="2" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
            {/* Center beam separator */}
            <line x1="9" y1="20" x2="39" y2="20" stroke="#047857" strokeWidth="2.5" />
            {/* Vertical rods */}
            <line x1="15" y1="11" x2="15" y2="37" stroke="#9CA3AF" strokeWidth="1.5" />
            <line x1="21" y1="11" x2="21" y2="37" stroke="#9CA3AF" strokeWidth="1.5" />
            <line x1="27" y1="11" x2="27" y2="37" stroke="#9CA3AF" strokeWidth="1.5" />
            <line x1="33" y1="11" x2="33" y2="37" stroke="#9CA3AF" strokeWidth="1.5" />
            {/* Upper beads (value 5) */}
            <ellipse cx="15" cy="15" rx="3" ry="2" fill="#047857" />
            <ellipse cx="21" cy="17" rx="3" ry="2" fill="#10B981" />
            <ellipse cx="27" cy="15" rx="3" ry="2" fill="#047857" />
            <ellipse cx="33" cy="17" rx="3" ry="2" fill="#10B981" />
            {/* Lower beads (value 1) */}
            <ellipse cx="15" cy="24" rx="3" ry="2" fill="#10B981" />
            <ellipse cx="15" cy="29" rx="3" ry="2" fill="#047857" />
            <ellipse cx="21" cy="26" rx="3" ry="2" fill="#047857" />
            <ellipse cx="27" cy="23" rx="3" ry="2" fill="#10B981" />
            <ellipse cx="27" cy="28" rx="3" ry="2" fill="#047857" />
            <ellipse cx="33" cy="31" rx="3" ry="2" fill="#10B981" />
          </svg>
        </div>
      );

    case 'drawing':
    case 'drawing-art':
      // Blue artist palette with paints and brush
      return (
        <div className={`rounded-xl bg-sky-100/90 border border-sky-300 p-2 flex items-center justify-center shadow-sm ${className}`}>
          <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
            <path 
              d="M24 8C14 8 6 15 6 25C6 32 10 38 18 39C20 39.2 21 38 21 36.5C21 35.2 20.2 34 20.2 32.5C20.2 29.5 22.8 27.5 26 27.5H28C35.5 27.5 42 22 42 16C42 11.5 34 8 24 8Z" 
              fill="#0284C7" 
              stroke="#0369A1" 
              strokeWidth="2"
            />
            {/* Thumb hole */}
            <ellipse cx="34" cy="21" rx="3" ry="2.2" fill="#E0F2FE" />
            {/* Color paint dots */}
            <circle cx="15" cy="18" r="3" fill="#FBBF24" />
            <circle cx="21" cy="14" r="3" fill="#EF4444" />
            <circle cx="28" cy="14" r="3" fill="#22C55E" />
            <circle cx="13" cy="27" r="3" fill="#A855F7" />
            {/* Paint brush resting */}
            <path d="M26 38L39 25" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M38 26L41 23" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'handwriting':
      // Orange writing pen / fountain nib with paper
      return (
        <div className={`rounded-xl bg-amber-100/90 border border-amber-300 p-2 flex items-center justify-center shadow-sm ${className}`}>
          <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
            {/* Paper sheet backing */}
            <rect x="8" y="8" width="32" height="32" rx="4" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
            <line x1="14" y1="16" x2="26" y2="16" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
            <line x1="14" y1="22" x2="34" y2="22" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
            <line x1="14" y1="28" x2="30" y2="28" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
            {/* Pen nib slant */}
            <path d="M36 12L39 15L24 33L19 34L20 29L36 12Z" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
            <circle cx="23" cy="30" r="1" fill="#FFFFFF" />
            <path d="M21 32L17 37C19 37.5 22 36.5 24 35" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'language-speaking':
      // Indigo / Purple microphone with sound waves & speech balloon
      return (
        <div className={`rounded-xl bg-indigo-100/90 border border-indigo-300 p-2 flex items-center justify-center shadow-sm ${className}`}>
          <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
            {/* Speech bubble behind */}
            <path d="M8 12C8 9.8 9.8 8 12 8H36C38.2 8 40 9.8 40 12V24C40 26.2 38.2 28 36 28H18L10 34V28H12C9.8 28 8 26.2 8 24V12Z" fill="#E0E7FF" stroke="#6366F1" strokeWidth="1.5" />
            {/* Vintage studio microphone */}
            <rect x="20" y="11" width="8" height="14" rx="4" fill="#4F46E5" stroke="#3730A3" strokeWidth="1.5" />
            <line x1="20" y1="16" x2="28" y2="16" stroke="#C7D2FE" strokeWidth="1" />
            <line x1="20" y1="20" x2="28" y2="20" stroke="#C7D2FE" strokeWidth="1" />
            {/* U-cradle & stand */}
            <path d="M17 19C17 23.5 20.1 27 24 27C27.9 27 31 23.5 31 19" stroke="#4338CA" strokeWidth="2" strokeLinecap="round" />
            <line x1="24" y1="27" x2="24" y2="35" stroke="#4338CA" strokeWidth="2" />
            <line x1="18" y1="35" x2="30" y2="35" stroke="#4338CA" strokeWidth="2.5" strokeLinecap="round" />
            {/* Sound waves */}
            <path d="M13 15C12 17.5 12 20.5 13 23" stroke="#818CF8" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M35 15C36 17.5 36 20.5 35 23" stroke="#818CF8" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'athletics':
      // Dynamic runner / athletic hurdles track in orange/red
      return (
        <div className={`rounded-xl bg-orange-100/90 border border-orange-300 p-2 flex items-center justify-center shadow-sm ${className}`}>
          <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
            {/* Track curve lines */}
            <path d="M6 38C16 35 32 35 42 38" stroke="#FB923C" strokeWidth="2" strokeLinecap="round" />
            <path d="M8 42C18 39 30 39 40 42" stroke="#FDBA74" strokeWidth="1.5" strokeLinecap="round" />
            {/* Runner head */}
            <circle cx="28" cy="11" r="3.5" fill="#EA580C" />
            {/* Dynamic sprinting runner body */}
            <path 
              d="M26 16L22 22L15 20L13 23L19 25L23 23L25 28L18 34L20 37L28 31L27 25L32 23L36 26L38 23L33 19L27 16H26Z" 
              fill="#C2410C" 
            />
            {/* Speed motion lines */}
            <line x1="9" y1="14" x2="16" y2="14" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="7" y1="18" x2="13" y2="18" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="10" y1="22" x2="14" y2="22" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'colour-management':
      // Multi-tone color harmony wheel / fan swatches in vibrant rainbow colors
      return (
        <div className={`rounded-xl bg-pink-100/90 border border-pink-300 p-2 flex items-center justify-center shadow-sm ${className}`}>
          <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
            {/* Color fan swatches spreading out */}
            <path d="M24 38L12 24C10 20 14 16 18 18L24 38Z" fill="#F43F5E" />
            <path d="M24 38L18 18C20 14 26 14 28 17L24 38Z" fill="#FB923C" />
            <path d="M24 38L28 17C32 15 36 19 34 23L24 38Z" fill="#FACC15" />
            <path d="M24 38L34 23C38 26 36 32 31 34L24 38Z" fill="#22C55E" />
            <path d="M24 38L31 34C28 37 24 38 24 38Z" fill="#0EA5E9" />
            {/* Pivot rivet */}
            <circle cx="24" cy="38" r="3.5" fill="#BE185D" stroke="#FFFFFF" strokeWidth="1.5" />
            {/* Droplet prism */}
            <path d="M24 6C24 6 29 11 29 13C29 15.8 26.8 18 24 18C21.2 18 19 15.8 19 13C19 11 24 6 24 6Z" fill="#A855F7" />
          </svg>
        </div>
      );

    case 'western-dance':
      // Purple dancing figure silhouette
      return (
        <div className={`rounded-xl bg-purple-100/90 border border-purple-300 p-2 flex items-center justify-center shadow-sm ${className}`}>
          <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
            <circle cx="24" cy="11" r="3.5" fill="#7E22CE" />
            <path 
              d="M24 16C23 18 20 22 17 21C15 20.5 13 23 15 24C18 25.5 22 22 23 20L24 26L18 35C17 36.5 19 38 20.5 37L25 30L29 37C30.5 38 32.5 37 32 35L27 26L31 22C34 23.5 36 21 34 20C31 18.5 27 18 24 16Z" 
              fill="#7E22CE" 
            />
            <circle cx="11" cy="14" r="1.5" fill="#A855F7" />
            <path d="M11 14V9L15 8V13" stroke="#A855F7" strokeWidth="1.2" />
            <circle cx="37" cy="12" r="1.5" fill="#A855F7" />
            <path d="M37 12V7L41 6V11" stroke="#A855F7" strokeWidth="1.2" />
          </svg>
        </div>
      );

    case 'phonics':
      // Pink/Red book with ABC letters
      return (
        <div className={`rounded-xl bg-rose-100/90 border border-rose-300 p-2 flex items-center justify-center shadow-sm ${className}`}>
          <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
            <path 
              d="M7 14C14 11 23 13 24 16C25 13 34 11 41 14V34C34 31 25 33 24 36C23 33 14 31 7 34V14Z" 
              fill="#E11D48" 
              stroke="#BE123C" 
              strokeWidth="2" 
            />
            <path d="M9 16C15 13.5 22 15 23 17V33C22 31 15 29.5 9 32V16Z" fill="#FFE4E6" />
            <path d="M39 16C33 13.5 26 15 25 17V33C26 31 33 29.5 39 32V16Z" fill="#FFE4E6" />
            <text x="24" y="27" textAnchor="middle" fill="#BE123C" fontSize="9" fontWeight="900" fontFamily="sans-serif">ABC</text>
          </svg>
        </div>
      );

    case 'bharatanatyam':
      // Amber/Gold classical dancer silhouette in aramandi pose
      return (
        <div className={`rounded-xl bg-amber-100/90 border border-amber-300 p-2 flex items-center justify-center shadow-sm ${className}`}>
          <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
            <path d="M22 8L24 6L26 8H22Z" fill="#B45309" />
            <circle cx="24" cy="11" r="3.2" fill="#D97706" />
            <path 
              d="M24 15L17 19C15 20 14 17 16 16L22 14L26 14L32 16C34 17 33 20 31 19L24 15Z" 
              fill="#B45309" 
            />
            <path d="M22 15H26L25 24H23L22 15Z" fill="#D97706" />
            <path 
              d="M24 24L14 31C13 33 15 35 17 34L24 30L31 34C33 35 35 33 34 31L24 24Z" 
              fill="#F59E0B" 
              stroke="#B45309" 
              strokeWidth="1.2" 
            />
            <line x1="24" y1="24" x2="19" y2="33" stroke="#92400E" strokeWidth="1" />
            <line x1="24" y1="24" x2="24" y2="33" stroke="#92400E" strokeWidth="1" />
            <line x1="24" y1="24" x2="29" y2="33" stroke="#92400E" strokeWidth="1" />
            <path d="M19 34L17 39H21" stroke="#B45309" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M29 34L31 39H27" stroke="#B45309" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
      );

    default:
      return null;
  }
}
