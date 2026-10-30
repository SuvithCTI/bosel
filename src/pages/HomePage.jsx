import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Calendar, 
  School,
  Ticket
} from 'lucide-react';
import { PROGRAMS_DATA, DIGITAL_PROGRAMS_DATA } from '../data/programsData';
import { getStoredEvents } from '../data/eventsData';
import { getStoredCourses } from '../data/coursesData';
import heroIllustration from '../assets/hero-cropped.png';
import { 
  IsoShieldIcon, 
  CertificateMedalIcon, 
  SchoolPartnershipIcon, 
  BrainGrowthIcon 
} from '../components/FeatureIcons';

export default function HomePage({ setActivePage, onSelectProgram }) {
  const [eventsList, setEventsList] = useState(() => getStoredEvents());
  const [coursesList, setCoursesList] = useState(() => getStoredCourses());

  useEffect(() => {
    const handleEventsUpdate = () => setEventsList(getStoredEvents());
    const handleCoursesUpdate = () => setCoursesList(getStoredCourses());

    window.addEventListener('bsel_events_updated', handleEventsUpdate);
    window.addEventListener('bsel_courses_updated', handleCoursesUpdate);
    window.addEventListener('storage', handleEventsUpdate);
    window.addEventListener('storage', handleCoursesUpdate);

    return () => {
      window.removeEventListener('bsel_events_updated', handleEventsUpdate);
      window.removeEventListener('bsel_courses_updated', handleCoursesUpdate);
      window.removeEventListener('storage', handleEventsUpdate);
      window.removeEventListener('storage', handleCoursesUpdate);
    };
  }, []);

  const isSkill = (p) => {
    const cat = (p.category || '').toLowerCase();
    return cat === 'skill' || cat.includes('skill') || cat.includes('art') || cat.includes('creative') || cat.includes('language');
  };

  const skillPrograms = coursesList.filter(p => isSkill(p));
  const digitalPrograms = coursesList.filter(p => !isSkill(p));

  const filteredEvents = eventsList;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =========================================================================
          HERO SECTION (RESPONSIVE & MOBILE-OPTIMIZED)
         ========================================================================= */}
      <section className="relative bg-white text-slate-800 border-b border-slate-200 overflow-hidden py-8 sm:py-12 md:py-16">
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Hero Content (Below Image on Mobile, Left Column on Desktop) */}
            <div className="order-2 lg:order-1 lg:col-span-6 xl:col-span-5 space-y-4 sm:space-y-6 text-center lg:text-left">
              {/* Title */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-heading text-[#0F2B5C] tracking-tight leading-[1.1]">
                <span className="italic block font-serif">Learn. Create.</span>
                <span className="italic block font-serif text-amber-500">Excel.</span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-xl md:text-2xl text-slate-900 font-extrabold leading-snug">
                Discover your talents and build essential life skills.
              </p>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-800 font-semibold leading-relaxed max-w-xl mx-auto lg:mx-0">
                Empowering school children with fundamental life skills, mathematical speed, artistic flair, and cultural discipline through structured training and national-level competitions.
              </p>

              {/* Action Buttons: Stack on mobile, side-by-side on tablet/desktop */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <button
                  onClick={() => {
                    const el = document.getElementById('programs-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl sm:rounded-full bg-[#0F2B5C] hover:bg-[#163B7A] active:scale-[0.98] text-white text-sm sm:text-base font-black transition shadow-md hover:shadow-xl border border-sky-400/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explore Programs</span>
                </button>

                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('open_admission_modal'));
                    }
                  }}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl sm:rounded-full bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-slate-950 text-sm sm:text-base font-black transition shadow-md hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <School className="w-4 h-4 text-slate-950" />
                  <span>Admission Form</span>
                </button>
              </div>
            </div>

            {/* Hero Illustration (Top on Mobile, Right Column on Desktop) */}
            <div className="order-1 lg:order-2 lg:col-span-6 xl:col-span-7 flex items-center justify-center lg:justify-end">
              <img 
                src={heroIllustration} 
                alt="Learn. Create. Excel. - B★SEL Skill Development" 
                className="w-full max-w-[340px] sm:max-w-[480px] md:max-w-[620px] lg:max-w-[850px] xl:max-w-[950px] h-auto object-contain select-none drop-shadow-sm"
                loading="eager"
              />
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          PROGRAMS SECTION: OFFICIAL CURRICULUM
         ========================================================================= */}
      <section id="programs-section" className="relative bg-gradient-to-b from-[#0F2B5C] via-[#143B7A] to-[#1E4D99] text-white py-12 md:py-20 overflow-hidden">
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        {/* Glow accents */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-10 relative z-10">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-slate-200/80 text-slate-800">
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
                  Discover our premier structured programs designed to develop cognitive speed, fine art mastery, and lifelong confidence.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActivePage('programs');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-black text-sky-800 hover:text-white bg-sky-50 hover:bg-sky-700 border border-sky-300 px-4 py-2.5 sm:py-2 rounded-full self-stretch md:self-auto transition-all cursor-pointer shadow-xs active:scale-95 group"
              >
                <span>Explore All 6 Skill Programs</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Scoped CSS for Card Glitter Border */}
            <style>{`
              @keyframes glitterBorder {
                0% {
                  background-position: 0% 50%;
                }
                50% {
                  background-position: 100% 50%;
                }
                100% {
                  background-position: 0% 50%;
                }
              }
            `}</style>

            {/* Grid of 3 Programs with Glitter Shimmer Border */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-8">
              {(skillPrograms.length > 0 ? skillPrograms : PROGRAMS_DATA).slice(0, 3).map((prog) => (
                <div
                  key={prog.id}
                  onClick={() => onSelectProgram(prog)}
                  className="relative p-[3px] rounded-2xl sm:rounded-3xl cursor-pointer group transition-all duration-300 hover:-translate-y-2"
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #fef08a, #38bdf8, #ffffff, #fbbf24, #f59e0b)',
                    backgroundSize: '300% 300%',
                    animation: 'glitterBorder 4s ease infinite',
                    boxShadow: '0 0 16px rgba(245, 158, 11, 0.35), 0 8px 24px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  {/* Card Inner Content */}
                  <div className="relative bg-white rounded-[13px] sm:rounded-[21px] overflow-hidden flex flex-col text-left h-full group-hover:bg-slate-50/70 transition-colors">
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
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="font-black text-base sm:text-xl text-black font-heading group-hover:text-sky-700 transition truncate">
                            {prog.name}
                          </h3>
                          <span className="text-xs font-black text-sky-800 shrink-0 group-hover:translate-x-1 transition-transform">
                            Details →
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-800 mt-1.5 leading-relaxed font-semibold">
                          {prog.tagline}
                        </p>
                      </div>

                      {/* Footer Details */}
                      <div className="pt-2 border-t border-slate-100 sm:border-slate-200 flex items-center justify-between text-xs text-slate-900 font-bold">
                        <span className="text-slate-900 truncate">
                          {prog.levels}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* =========================================================================
                DIGITAL SKILLS (3 FEATURED MODERN DIGITAL COURSES)
               ========================================================================= */}
            <div className="mt-10 sm:mt-14 pt-8 sm:pt-10 border-t border-slate-200/80">
              {/* Digital Skills Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between pb-5 sm:pb-6 border-b border-slate-100 gap-3">
                <div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-black font-heading tracking-tight">
                    Empowering Digital Skills
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-slate-700 mt-1 max-w-2xl font-semibold">
                    Equip learners with modern programming logic, intelligent artificial intelligence tools, and creative digital design.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActivePage('programs');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-black text-sky-800 hover:text-white bg-sky-50 hover:bg-sky-700 border border-sky-300 px-4 py-2.5 sm:py-2 rounded-full self-stretch md:self-auto transition-all cursor-pointer shadow-xs active:scale-95 group"
                >
                  <span>Explore All 8 Tech Programs</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Grid of 3 Digital Skills Cards with Glitter Shimmer Border */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-8">
                {(digitalPrograms.length > 0 ? digitalPrograms : DIGITAL_PROGRAMS_DATA).slice(0, 3).map((prog) => (
                  <div
                    key={prog.id}
                    onClick={() => onSelectProgram(prog)}
                    className="relative p-[3px] rounded-2xl sm:rounded-3xl cursor-pointer group transition-all duration-300 hover:-translate-y-2"
                    style={{
                      background: 'linear-gradient(135deg, #38bdf8, #818cf8, #c084fc, #ffffff, #60a5fa, #38bdf8)',
                      backgroundSize: '300% 300%',
                      animation: 'glitterBorder 4s ease infinite',
                      boxShadow: '0 0 16px rgba(56, 189, 248, 0.35), 0 8px 24px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    {/* Card Inner Content */}
                    <div className="relative bg-white rounded-[13px] sm:rounded-[21px] overflow-hidden flex flex-col text-left h-full group-hover:bg-slate-50/70 transition-colors">
                      {/* Course Photography Container */}
                      <div className="relative aspect-[3/2] w-full overflow-hidden bg-slate-100">
                        <img
                          src={prog.image}
                          alt={prog.name}
                          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>

                      {/* Program Card Body */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <h3 className="font-black text-base sm:text-xl text-black font-heading group-hover:text-sky-700 transition truncate">
                              {prog.name}
                            </h3>
                            <span className="text-xs font-black text-sky-800 shrink-0 group-hover:translate-x-1 transition-transform">
                              Details →
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm text-slate-800 mt-1.5 leading-relaxed font-semibold">
                            {prog.tagline}
                          </p>
                        </div>

                        {/* Footer Details */}
                        <div className="pt-2 border-t border-slate-100 sm:border-slate-200 flex items-center justify-between text-xs text-slate-900 font-bold">
                          <span className="text-slate-900 truncate">
                            {prog.levels}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Decorative divider */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none z-10">
          <svg className="relative block w-full h-6 sm:h-10 md:h-12 text-slate-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0 C150,90 350,-40 500,40 C650,120 900,10 1200,50 L1200,120 L0,120 Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* =========================================================================
          NOTIFICATIONS: UPCOMING EVENTS & REGISTRATION
         ========================================================================= */}
      <section className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-10 py-10 md:py-16">
        <div className="text-center mb-6 sm:mb-8">
          <span className="text-sky-700 font-extrabold text-xs md:text-sm tracking-widest uppercase inline-block mb-1">
            NOTIFICATIONS
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 font-heading tracking-tight">
            Upcoming Events & Registration
          </h2>
          <p className="text-slate-700 text-xs sm:text-sm max-w-2xl mx-auto mt-1.5 font-semibold">
            Register your student or school team for official B★SEL regional championships, Olympiads, and skill grade assessments.
          </p>
        </div>

        {/* 1. MOBILE RESPONSIVE CARD VIEW (< 640px) */}
        <div className="block sm:hidden space-y-3">
          {filteredEvents.map((evt) => (
            <div
              key={evt.sNo}
              onClick={() => {
                setActivePage('events');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm active:bg-sky-50 transition cursor-pointer space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-black px-2 py-0.5 rounded bg-sky-100 text-sky-900 font-mono">
                  #{evt.sNo} • {evt.category}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  <Calendar className="w-3 h-3 text-slate-600" />
                  <span>{evt.date}</span>
                </span>
              </div>

              <h3 className="font-black text-slate-950 text-sm leading-snug">
                {evt.eventName}
              </h3>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                <span className="text-emerald-800 font-extrabold">Fee: {evt.fee}</span>
                <span className="text-sky-800 font-bold flex items-center gap-1">
                  <span>View on Events Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 2. DESKTOP / TABLET TABLE VIEW (>= 640px) */}
        <div className="hidden sm:block bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0F2B5C] text-white text-xs md:text-sm font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4 md:px-6 w-16 text-center border-r border-sky-800/50">S.NO</th>
                  <th className="py-3.5 px-4 md:px-6">NAME OF THE POST AND EVENTS</th>
                  <th className="py-3.5 px-4 md:px-6 w-36 text-center border-l border-sky-800/50">DATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs md:text-sm">
                {filteredEvents.map((evt) => (
                  <tr 
                    key={evt.sNo} 
                    onClick={() => {
                      setActivePage('events');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:bg-sky-50 transition-colors cursor-pointer group"
                    title="Click to view on Events page"
                  >
                    <td className="py-4 px-4 md:px-6 text-center font-black text-slate-950 bg-slate-50/50 group-hover:bg-sky-100/50">
                      {evt.sNo}
                    </td>
                    <td className="py-4 px-4 md:px-6">
                      <div className="font-black text-slate-950 flex items-center justify-between gap-2 flex-wrap text-sm md:text-base group-hover:text-sky-800 transition">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span>{evt.eventName}</span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 opacity-80 group-hover:opacity-100 transition">
                          <span>Register Online</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                      <div className="text-xs text-slate-900 mt-1 flex items-center gap-3 flex-wrap font-medium">
                        <span>Category: <strong className="text-slate-950 font-bold">{evt.category}</strong></span>
                        <span>•</span>
                        <span>Fee: <strong className="text-emerald-800 font-bold">{evt.fee}</strong></span>
                      </div>
                    </td>
                    <td className="py-4 px-4 md:px-6 text-center font-bold text-slate-950">
                      <div className="inline-flex items-center gap-1.5 bg-slate-100 group-hover:bg-sky-100 px-3 py-1 rounded-md text-xs border border-slate-200 transition">
                        <Calendar className="w-3.5 h-3.5 text-slate-700" />
                        <span>{evt.date}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* View All Events CTA */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-600 font-medium">
              Showing official notifications and state competition schedules.
            </span>
            <button
              onClick={() => {
                setActivePage('events');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[#0F2B5C] hover:text-sky-700 font-bold flex items-center gap-1 underline underline-offset-4 cursor-pointer"
            >
              <span>View All Upcoming Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile View All CTA */}
        <div className="mt-3 block sm:hidden">
          <button
            onClick={() => {
              setActivePage('events');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full py-3 bg-[#0F2B5C] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow"
          >
            <Ticket className="w-3.5 h-3.5 text-amber-400" />
            <span>View All Events & Download Hall Slips</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* =========================================================================
          KEY ADVANTAGES / WHY CHOOSE B★SEL
         ========================================================================= */}
      <section className="bg-white py-12 md:py-20 border-y border-slate-200">
        <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="text-xs font-black text-sky-800 tracking-wider uppercase">Educational Excellence</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-black font-heading mt-1">
              Why Partner with B★SEL?
            </h2>
            <p className="text-xs sm:text-base text-slate-700 mt-2 font-semibold">
              We bridge academic school learning with indispensable foundational cognitive and creative life skills.
            </p>
          </div>

          {/* 2 Columns on Mobile View, 4 Columns on Large Screens */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {/* Card 1: ISO Certified Standard (Sky/Blue) */}
            <div className="bg-sky-50/80 hover:bg-sky-50 p-4 sm:p-7 rounded-xl sm:rounded-2xl border-2 border-sky-200/90 hover:border-sky-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="mb-2.5 sm:mb-4">
                  <IsoShieldIcon className="w-10 h-10 sm:w-14 sm:h-14" />
                </div>
                <h3 className="font-black text-slate-950 text-xs sm:text-lg mb-1 sm:mb-1.5 font-heading">
                  ISO Certified Standard
                </h3>
                <p className="text-[10px] sm:text-sm text-slate-800 leading-snug sm:leading-relaxed font-semibold">
                  Standardized curriculum vetted by veteran educators, adhering to strict pedagogical benchmarks.
                </p>
              </div>
            </div>

            {/* Card 2: Recognized Certificates (Amber/Gold) */}
            <div className="bg-amber-50/80 hover:bg-amber-50 p-4 sm:p-7 rounded-xl sm:rounded-2xl border-2 border-amber-200/90 hover:border-amber-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="mb-2.5 sm:mb-4">
                  <CertificateMedalIcon className="w-10 h-10 sm:w-14 sm:h-14" />
                </div>
                <h3 className="font-black text-slate-950 text-xs sm:text-lg mb-1 sm:mb-1.5 font-heading">
                  Recognized Certificates
                </h3>
                <p className="text-[10px] sm:text-sm text-slate-800 leading-snug sm:leading-relaxed font-semibold">
                  Govt. recognized skill grades and Olympiad medals that enrich students' academic portfolios.
                </p>
              </div>
            </div>

            {/* Card 3: Zero-Cost School Tie-Up (Emerald/Green) */}
            <div className="bg-emerald-50/80 hover:bg-emerald-50 p-4 sm:p-7 rounded-xl sm:rounded-2xl border-2 border-emerald-200/90 hover:border-emerald-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="mb-2.5 sm:mb-4">
                  <SchoolPartnershipIcon className="w-10 h-10 sm:w-14 sm:h-14" />
                </div>
                <h3 className="font-black text-slate-950 text-xs sm:text-lg mb-1 sm:mb-1.5 font-heading">
                  Zero-Cost School Tie-Up
                </h3>
                <p className="text-[10px] sm:text-sm text-slate-800 leading-snug sm:leading-relaxed font-semibold">
                  Turnkey integration for schools with certified master trainers and study kit supply.
                </p>
              </div>
            </div>

            {/* Card 4: Holistic Brain Growth (Purple/Indigo) */}
            <div className="bg-purple-50/80 hover:bg-purple-50 p-4 sm:p-7 rounded-xl sm:rounded-2xl border-2 border-purple-200/90 hover:border-purple-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="mb-2.5 sm:mb-4">
                  <BrainGrowthIcon className="w-10 h-10 sm:w-14 sm:h-14" />
                </div>
                <h3 className="font-black text-slate-950 text-xs sm:text-lg mb-1 sm:mb-1.5 font-heading">
                  Holistic Brain Growth
                </h3>
                <p className="text-[10px] sm:text-sm text-slate-800 leading-snug sm:leading-relaxed font-semibold">
                  Synchronized development of mathematical logic, artistic creativity, and cultural grace.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
