import React, { useEffect } from 'react';
import { X, Clock, Users, Award, BookOpen } from 'lucide-react';
import ProgramIcon from './ProgramIcons';

export default function ProgramModal({ program, onClose }) {
  // Lock background scroll when modal is open
  useEffect(() => {
    if (program) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [program]);

  if (!program) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className={`p-4 sm:p-6 bg-gradient-to-r ${program.themeColor} text-white relative`}>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 bg-black/25 hover:bg-black/40 text-white rounded-full p-1.5 sm:p-2 transition cursor-pointer active:scale-95 z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 sm:gap-4 pr-8 sm:pr-10">
            {program.image ? (
              <img 
                src={program.image} 
                alt={program.name} 
                className="w-12 h-12 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-xl object-cover border-2 border-white/60 shadow-md shrink-0" 
              />
            ) : (
              <ProgramIcon type={program.iconType} className="w-11 h-11 sm:w-16 sm:h-16 bg-white/95 shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-2xl md:text-3xl font-black font-heading text-white tracking-wide leading-tight">
                {program.name}
              </h3>
              <p className="text-white/95 text-[11px] sm:text-sm mt-0.5 font-semibold line-clamp-2 leading-snug">
                {program.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-3.5 sm:p-6 max-h-[80vh] sm:max-h-[75vh] overflow-y-auto overscroll-contain space-y-4 sm:space-y-6 text-slate-700">
          
          {/* Key Quick Facts */}
          <div className="grid grid-cols-3 gap-1 sm:gap-3 bg-slate-50 p-2 sm:p-3.5 rounded-xl border border-slate-200 text-center">
            <div className="flex flex-col items-center justify-center p-1">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-800 mb-1" />
              <span className="text-[9px] sm:text-[11px] text-slate-600 uppercase font-black tracking-wider">Age Group</span>
              <span className="text-[11px] sm:text-sm font-black text-slate-950 leading-tight block mt-0.5">{program.ageGroup}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-1 border-x border-slate-200">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-800 mb-1" />
              <span className="text-[9px] sm:text-[11px] text-slate-600 uppercase font-black tracking-wider">Levels</span>
              <span className="text-[11px] sm:text-sm font-black text-slate-950 leading-tight block mt-0.5">{program.levels}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-1">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-800 mb-1" />
              <span className="text-[9px] sm:text-[11px] text-slate-600 uppercase font-black tracking-wider">Duration</span>
              <span className="text-[11px] sm:text-sm font-black text-slate-950 leading-tight block mt-0.5">{program.duration}</span>
            </div>
          </div>

          {/* About This Program */}
          <div>
            <h4 className="text-xs sm:text-base font-black text-black uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-800 shrink-0" />
              <span>About This Program</span>
            </h4>
            <p className="text-slate-800 text-xs sm:text-sm leading-relaxed font-semibold">
              {program.description}
            </p>
          </div>

          {/* Curriculum Roadmap */}
          {program.curriculum && program.curriculum.length > 0 && (
            <div>
              <h4 className="text-xs sm:text-base font-black text-black uppercase tracking-wider mb-2">
                Syllabus Structure
              </h4>
              <ul className="space-y-2">
                {program.curriculum.map((level, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-slate-900 flex items-start gap-2.5 bg-slate-50 hover:bg-slate-100/80 p-2.5 sm:p-3 rounded-xl border border-slate-200 font-bold transition-colors">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#0F2B5C] !text-white font-black text-[10px] sm:text-xs flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-slate-900 leading-snug block">{typeof level === 'string' ? level : level.title}</span>
                      {typeof level === 'object' && level.topics && (
                        <ul className="mt-1.5 space-y-1 pl-1 font-normal text-slate-700">
                          {level.topics.map((t, tIdx) => (
                            <li key={tIdx} className="flex items-start gap-1.5 text-xs">
                              <span className="text-sky-600 font-bold shrink-0 mt-0.5">•</span>
                              <span>{typeof t === 'string' ? t.replace(/^(\d+[\.\)]\s*|Level\s+\d+:\s*)/i, '') : t}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-4 sm:px-6 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <span className="text-[11px] text-center sm:text-left">Official Syllabus of Board of Skills and Educational Learning</span>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 font-bold cursor-pointer transition shadow-xs active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
