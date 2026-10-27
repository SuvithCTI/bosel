import React, { useState } from 'react';
import { PROGRAMS_DATA } from '../data/programsData';
import ProgramModal from '../components/ProgramModal';
import { 
  BookOpen, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  GraduationCap
} from 'lucide-react';

export default function ProgramsPage() {
  const [selectedProgram, setSelectedProgram] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-10 md:py-12">
      <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-10 space-y-6 sm:space-y-8">
        
        {/* Page Banner Header - Matches Brand Theme */}
        <div className="bg-gradient-to-r from-[#0F2B5C] via-[#143B7A] to-[#1E4D99] rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-2.5 sm:space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-amber-300 text-xs font-black uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>Certified Skill Curriculum</span>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-heading text-white tracking-tight">
              Academic & Skill Programs
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm md:text-base leading-relaxed">
              Explore our structured learning pathways designed by educational experts to build calculation speed, creative mastery, language fluency, and athletic discipline.
            </p>
          </div>
          
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 bg-radial from-white to-transparent pointer-events-none" />
        </div>

        {/* =========================================================================
            6 PROGRAMS SECTION (REPLICATED FROM HOME PAGE WITH SAME FONTS & THEME)
           ========================================================================= */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-200 text-slate-800">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-5 sm:pb-6 border-b border-slate-100 gap-3">
            <div>
              <span className="text-xs md:text-sm font-extrabold text-sky-700 tracking-widest uppercase">
                Our Programs
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-black font-heading tracking-tight mt-1">
                Explore Your Potential
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-slate-700 mt-1 max-w-2xl font-semibold">
                Discover six structured programs designed to develop cognitive speed, fine art mastery, and lifelong confidence.
              </p>
            </div>
            <span className="text-[11px] sm:text-xs text-slate-900 font-extrabold bg-slate-100 px-3 py-1.5 rounded-full self-start md:self-auto border border-slate-300">
              Click any course to inspect syllabus & details
            </span>
          </div>

          {/* Grid of 6 Programs (2 Columns on Mobile, 3 Columns on Desktop) */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6 mt-6">
            {PROGRAMS_DATA.map((prog) => (
              <div
                key={prog.id}
                onClick={() => setSelectedProgram(prog)}
                className="group relative bg-white hover:bg-slate-50/70 rounded-xl sm:rounded-2xl border border-slate-200 sm:border-2 hover:border-sky-500 hover:shadow-xl active:scale-[0.98] transition-all duration-200 cursor-pointer overflow-hidden flex flex-col text-left"
              >
                {/* Course Photography Container */}
                <div className="relative aspect-[3/2] w-full overflow-hidden bg-slate-100">
                  <img
                    src={prog.image}
                    alt={prog.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Program Card Body */}
                <div className="p-2.5 sm:p-5 flex-1 flex flex-col justify-between space-y-1.5 sm:space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-black text-xs sm:text-xl text-black font-heading group-hover:text-sky-700 transition truncate">
                        {prog.name}
                      </h3>
                      <span className="text-[10px] sm:text-xs font-black text-sky-800 shrink-0 group-hover:translate-x-0.5 transition-transform">
                        Details →
                      </span>
                    </div>

                    <p className="text-[10px] sm:text-sm text-slate-800 mt-1 sm:mt-2 leading-tight sm:leading-relaxed font-semibold line-clamp-2 sm:line-clamp-none">
                      {prog.tagline}
                    </p>
                  </div>

                  {/* Footer Details */}
                  <div className="pt-1.5 sm:pt-2 border-t border-slate-100 sm:border-slate-200 flex items-center justify-between text-[10px] sm:text-xs text-slate-900 font-bold">
                    <span className="text-slate-900 truncate">
                      {prog.levels}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-700 shrink-0 border border-sky-100">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">Standardized Syllabus</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Step-by-step grade levels mapped to age cognitive abilities from foundation to mastery.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 shrink-0 border border-amber-100">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">Recognized Certification</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Official certificates with verifiable QR codes issued upon completing level assessments.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 shrink-0 border border-emerald-100">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">Expert Master Trainers</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Trained and certified instructors delivering engaging hands-on classroom experiences.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Program Details Modal */}
      {selectedProgram && (
        <ProgramModal
          program={selectedProgram}
          onClose={() => setSelectedProgram(null)}
        />
      )}
    </div>
  );
}
