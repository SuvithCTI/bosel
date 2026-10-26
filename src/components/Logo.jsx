import React from 'react';

export default function Logo({ size = 'default', lightText = false, showTagline = true, onClick }) {
  // size: 'small', 'default', 'large'
  const isSmall = size === 'small';
  const isLarge = size === 'large';

  return (
    <div 
      className={`inline-flex items-center gap-2 sm:gap-3 select-none ${onClick ? 'cursor-pointer group' : ''}`}
      onClick={onClick}
    >
      {/* Official B★SEL Crest Emblem */}
      <div className={`relative flex items-center justify-center shrink-0 bg-white rounded-lg p-0.5 shadow-sm border border-amber-300/60 overflow-hidden ${
        isSmall 
          ? 'w-8 h-8 sm:w-9 sm:h-9' 
          : isLarge 
          ? 'w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20' 
          : 'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14'
      }`}>
        <img 
          src="/bsel_logo.jpg" 
          alt="B★SEL Official Logo"
          className="w-full h-full object-contain"
          loading="eager"
        />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col text-left leading-tight min-w-0">
        <div className={`font-extrabold tracking-wider flex items-center gap-1 font-heading ${
          isSmall ? 'text-base sm:text-lg' : isLarge ? 'text-2xl md:text-3xl' : 'text-lg sm:text-xl'
        } ${lightText ? 'text-white' : 'text-slate-900'}`}>
          <span className="tracking-widest">B</span>
          <span className="text-amber-400 font-bold inline-block drop-shadow-sm text-[1.15em] -translate-y-[1px]">★</span>
          <span className="tracking-widest">SEL</span>
        </div>

        {showTagline && (
          <span className={`text-[9px] sm:text-[10px] md:text-xs font-medium tracking-normal truncate max-w-[190px] sm:max-w-none ${
            lightText ? 'text-slate-200' : 'text-slate-600'
          }`}>
            Board of Skills and Educational Learning
          </span>
        )}

        {isLarge && (
          <span className="text-[10px] sm:text-[11px] font-bold text-amber-500 tracking-widest uppercase mt-0.5">
            Learn ★ Grow ★ Achieve • Est. 2016
          </span>
        )}
      </div>
    </div>
  );
}
