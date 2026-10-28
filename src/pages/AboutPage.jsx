import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  Compass, 
  Target,
  Building2, 
  Award, 
  School, 
  Calendar, 
  CheckCircle2, 
  Quote, 
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import ProgramIcon from '../components/ProgramIcons';
import visionMissionBg from '../assets/vision-mission-bg.jpg';

export default function AboutPage({ setActivePage }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNav = (page) => {
    if (typeof setActivePage === 'function') {
      setActivePage(page);
    } else if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('page', page);
      window.history.pushState({}, '', url);
      window.dispatchEvent(new Event('popstate'));
      window.location.hash = page;
    }
  };

  const programs = [
    {
      id: 'abacus',
      title: 'Abacus',
      type: 'abacus',
      desc: 'Structured mental arithmetic and bead calculations that boost speed, memory, and cognitive agility.',
      badge: 'Mental Arithmetic',
      bgClass: 'bg-emerald-50/80 hover:bg-emerald-50 border-emerald-200/90 hover:border-emerald-400',
      badgeClass: 'text-emerald-800 bg-emerald-100/90 border-emerald-300',
      footerBorder: 'border-emerald-200/80',
      footerText: 'text-emerald-900'
    },
    {
      id: 'handwriting',
      title: 'Handwriting',
      type: 'handwriting',
      desc: 'Ergonomic penmanship techniques that refine letter formation, line discipline, and writing fluidity.',
      badge: 'Penmanship & Flow',
      bgClass: 'bg-amber-50/80 hover:bg-amber-50 border-amber-200/90 hover:border-amber-400',
      badgeClass: 'text-amber-800 bg-amber-100/90 border-amber-300',
      footerBorder: 'border-amber-200/80',
      footerText: 'text-amber-900'
    },
    {
      id: 'phonics',
      title: 'Phonics',
      type: 'phonics',
      desc: 'Systematic phonetic decoding, sound blending, and pronunciation training for confident reading.',
      badge: 'Reading Fluency',
      bgClass: 'bg-rose-50/80 hover:bg-rose-50 border-rose-200/90 hover:border-rose-400',
      badgeClass: 'text-rose-800 bg-rose-100/90 border-rose-300',
      footerBorder: 'border-rose-200/80',
      footerText: 'text-rose-900'
    },
    {
      id: 'drawing',
      title: 'Drawing',
      type: 'drawing',
      desc: 'Creative visual expression, fine motor refinement, and foundational principles of sketching and art.',
      badge: 'Visual Arts',
      bgClass: 'bg-sky-50/80 hover:bg-sky-50 border-sky-200/90 hover:border-sky-400',
      badgeClass: 'text-sky-800 bg-sky-100/90 border-sky-300',
      footerBorder: 'border-sky-200/80',
      footerText: 'text-sky-900'
    },
    {
      id: 'bharatanatyam',
      title: 'Bharatanatyam',
      type: 'bharatanatyam',
      desc: 'Classical Indian dance cultivating rhythm, expressive storytelling, posture, and cultural grace.',
      badge: 'Classical Arts',
      bgClass: 'bg-purple-50/80 hover:bg-purple-50 border-purple-200/90 hover:border-purple-400',
      badgeClass: 'text-purple-800 bg-purple-100/90 border-purple-300',
      footerBorder: 'border-purple-200/80',
      footerText: 'text-purple-900'
    }
  ];

  const founderStats = [
    {
      value: '10+',
      label: 'Years of Experience',
      subtext: 'In skill development & curriculum delivery'
    },
    {
      value: '30+',
      label: 'School Engagements',
      subtext: 'Collaborations & educational initiatives'
    },
    {
      value: '7 Years',
      label: 'Continuous Association',
      subtext: 'With a single premier partner school'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      
      {/* =========================================================================
          1. ABOUT B⭐SEL (HERO SECTION - FITTED TO 100% DESKTOP SCREEN)
         ========================================================================= */}
      <section className="relative bg-white border-b border-slate-200 overflow-hidden py-8 sm:py-12 lg:py-0 lg:min-h-[calc(100vh-80px)] flex flex-col justify-center">
        {/* Clearly visible decorative background watermark */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center select-none overflow-hidden z-0">
          <span 
            className="text-[85px] xs:text-[120px] sm:text-[200px] lg:text-[260px] xl:text-[300px] font-black uppercase text-slate-300/70 leading-none select-none whitespace-nowrap"
            style={{ 
              fontFamily: "'Cinzel', serif",
              letterSpacing: '0.06em'
            }}
          >
            B<span className="text-amber-400/50">★</span>SEL
          </span>
        </div>

        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10 py-6 lg:py-12 my-auto">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 lg:space-y-9">
            

            {/* Main Heading as Specified */}
            <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black font-heading text-[#0F2B5C] tracking-tight leading-[1.2] sm:leading-[1.25]">
              Board of Skills and{' '}
              <span className="font-serif italic text-amber-500 block sm:inline">
                Educational Learning
              </span>
            </h1>

            {/* Content Specified in Section 1 - Generous Line Spacing & Readable Size */}
            <p className="text-sm xs:text-base sm:text-lg lg:text-xl text-slate-800 font-semibold leading-relaxed sm:leading-[2.1] lg:leading-[2.2] max-w-3xl lg:max-w-4xl mx-auto">
              B⭐SEL is an education-focused organization dedicated to developing students' academic, creative, and digital skills. Through structured programs, practical activities, expert instruction, and continuous practice, we create meaningful learning opportunities that help students build confidence and essential life skills.
            </p>

            {/* Quick Feature Badges with Balanced Padding */}
            <div className="pt-3 sm:pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm">
              <span className="inline-flex items-center gap-2 bg-slate-100/90 border border-slate-200/90 px-3.5 sm:px-4 py-2 rounded-xl text-slate-800 font-bold shadow-xs">
                <span className="text-emerald-600">●</span> Structured Programs
              </span>
              <span className="inline-flex items-center gap-2 bg-slate-100/90 border border-slate-200/90 px-3.5 sm:px-4 py-2 rounded-xl text-slate-800 font-bold shadow-xs">
                <span className="text-amber-500">★</span> Expert Instruction
              </span>
              <span className="inline-flex items-center gap-2 bg-slate-100/90 border border-slate-200/90 px-3.5 sm:px-4 py-2 rounded-xl text-slate-800 font-bold shadow-xs">
                <span className="text-sky-600">■</span> Continuous Practice
              </span>
            </div>

          </div>
        </div>
      </section>


      {/* =========================================================================
          2. WHAT WE DO (5 PROGRAM CARDS WITH ICONS)
         ========================================================================= */}
      <section id="what-we-do" className="py-12 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-2">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-heading text-slate-900">
              What We Do
            </h2>
            <p className="text-slate-800 text-sm sm:text-base font-semibold leading-relaxed max-w-2xl mx-auto">
              Our skill-development programs help students strengthen their abilities through guided learning, hands-on activities, and regular practice.
            </p>
          </div>

          {/* 5 Clean, Attractive Program Cards Filled with Light Colors - 2 columns on mobile */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 xs:gap-3.5 sm:gap-6 max-w-7xl mx-auto">
            {programs.map((item) => (
              <div 
                key={item.id}
                className={`${item.bgClass} ${item.id === 'bharatanatyam' ? 'hidden sm:flex' : 'flex'} p-3 xs:p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex-col justify-between group`}
              >
                <div className="space-y-2 sm:space-y-3">
                  <div className="w-9 h-9 sm:w-12 sm:h-12 flex items-center justify-center transition-transform group-hover:scale-110">
                    <ProgramIcon type={item.type} className="w-9 h-9 sm:w-12 sm:h-12" />
                  </div>
                  <div className={`inline-block px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider border ${item.badgeClass}`}>
                    {item.badge}
                  </div>
                  <h3 className="text-sm xs:text-base sm:text-lg font-black text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[11px] xs:text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className={`mt-3 sm:mt-5 pt-2 sm:pt-3 border-t ${item.footerBorder} flex items-center justify-between text-[10px] sm:text-[11px] font-bold ${item.footerText}`}>
                  <span className="truncate pr-1">Practical Training</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* =========================================================================
          3 & 4. OUR VISION & OUR MISSION (SEPARATE VISUALLY APPEALING CARDS)
         ========================================================================= */}
      {/* =========================================================================
          3 & 4. OUR VISION & OUR MISSION (SEPARATE VISUALLY APPEALING CARDS)
         ========================================================================= */}
      <section 
        className="py-14 sm:py-24 relative overflow-hidden border-b border-slate-200 bg-[#081d3d] text-white"
        style={{
          backgroundImage: `url(${visionMissionBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Balanced overlay so the classroom learning background is clearly visible */}
        <div className="absolute inset-0 bg-[#081d3d]/72 backdrop-blur-[1px] pointer-events-none" />

        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10 text-white">
          
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-2">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-heading text-white">
              Our Vision & Mission
            </h2>
            <p className="text-slate-200 text-sm sm:text-base font-semibold">
              The foundational pillars steering B⭐SEL's commitment to student excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl lg:max-w-7xl mx-auto">
            
            {/* Vision Card - No icons */}
            <div className="bg-white/95 backdrop-blur-md p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border-2 border-sky-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 relative overflow-hidden flex flex-col justify-between text-slate-900">
              <div className="space-y-3 relative z-10">
                <div className="text-xs font-black uppercase tracking-wider text-sky-800">
                  Aspirational Horizon
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                  Our Vision
                </h3>
                {/* Vision Content Specified in Section 3 */}
                <p 
                  className="text-base sm:text-lg text-slate-800 leading-relaxed font-semibold italic pt-1"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  "To empower every learner with essential skills, confidence, and creativity for a brighter future."
                </p>
              </div>

              <div className="pt-6 border-t border-sky-100 mt-6 flex items-center text-xs font-bold text-[#0F2B5C]">
                <span>Nurturing talent, confidence, and self-belief</span>
              </div>
            </div>

            {/* Mission Card - No icons */}
            <div className="bg-white/95 backdrop-blur-md p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border-2 border-amber-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 relative overflow-hidden flex flex-col justify-between text-slate-900">
              <div className="space-y-3 relative z-10">
                <div className="text-xs font-black uppercase tracking-wider text-amber-800">
                  Practical Purpose
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                  Our Mission
                </h3>
                {/* Mission Content Specified in Section 4 */}
                <p 
                  className="text-base sm:text-lg text-slate-800 leading-relaxed font-semibold italic pt-1"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  "To deliver structured, practical, and engaging learning programs through quality training, continuous practice, and meaningful assessment."
                </p>
              </div>

              <div className="pt-6 border-t border-amber-100 mt-6 flex items-center text-xs font-bold text-amber-900">
                <span>Hands-on practice, expert training, and assessment</span>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* =========================================================================
          5. MEET OUR FOUNDER (PROFILE & 3 STATISTICS HIGHLIGHTS)
         ========================================================================= */}
      <section className="py-12 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-2">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-heading text-slate-900">
              Meet Our Founder
            </h2>
            <p className="text-slate-700 text-sm sm:text-base font-semibold">
              The educator, visionary, and guiding force behind B⭐SEL's learning ecosystem.
            </p>
          </div>

          {/* Founder Profile Card */}
          <div className="max-w-6xl lg:max-w-7xl mx-auto bg-white border-2 border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 shadow-md hover:shadow-xl transition relative overflow-hidden">
            <Quote className="absolute top-6 right-6 w-20 h-20 text-slate-100 pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              
              {/* Profile Image / Badge Column */}
              <div className="md:col-span-5 lg:col-span-4 flex flex-col items-center text-center">
                <div className="relative w-52 h-52 xs:w-60 xs:h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 mx-auto rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-[#081d3d] via-[#0F2B5C] to-[#1e4d99] p-2 sm:p-2.5 shadow-2xl border-2 sm:border-3 border-amber-400">
                  
                  {/* Founder photo if available, with graceful fallback */}
                  {!imgError ? (
                    <img 
                      src="/founder.jpg" 
                      alt="Master M. A. Alwin Raj" 
                      className="w-full h-full object-cover rounded-2xl"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-[#0b2146] flex flex-col items-center justify-center text-white p-6 sm:p-8">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-amber-400/20 border-2 border-amber-400/50 flex items-center justify-center text-amber-300 font-black text-2xl sm:text-3xl mb-3 shadow-inner">
                        AR
                      </div>
                      <span className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-widest">
                        Master
                      </span>
                      <span className="text-base sm:text-xl font-black text-white mt-1">
                        M. A. Alwin Raj
                      </span>
                      <span className="text-xs sm:text-sm font-mono text-slate-300 mt-1">
                        BSc, DECE, ADCTT
                      </span>
                    </div>
                  )}
                </div>

                {/* Name & Qualifications Mobile View Support */}
                <div className="mt-4 md:hidden">
                  <h3 className="text-xl font-black text-[#0F2B5C]">
                    Master M. A. Alwin Raj
                  </h3>
                  <div 
                    className="text-xs font-mono font-bold text-amber-700 mt-0.5"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    BSc, DECE, ADCTT
                  </div>
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-1">
                    Founder & Director, B⭐SEL
                  </div>
                </div>
              </div>

              {/* Founder Narrative Column */}
              <div className="md:col-span-7 lg:col-span-8 space-y-4 text-left">
                
                <div className="hidden md:block">
                  <h3 className="text-2xl sm:text-3xl font-black text-[#0F2B5C] font-heading">
                    Master M. A. Alwin Raj
                  </h3>
                  <div 
                    className="text-sm font-bold text-slate-600 mt-1"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    Qualifications: <span className="font-mono text-amber-800 font-extrabold">BSc, DECE, ADCTT</span>
                  </div>
                </div>

                {/* Biography Specified in Section 5 */}
                <div className="space-y-3 text-slate-800 text-sm sm:text-base leading-relaxed font-medium">
                  <p>
                    Master M. A. Alwin Raj brings over 10 years of experience in skill development and has engaged with more than 30 schools. He has built lasting relationships with educational institutions, including a continuous seven-year association with one school.
                  </p>
                  <p>
                    He has participated in and conducted student competitions, supported school annual-day programs, and remains committed to creating structured, engaging, and meaningful learning opportunities for students.
                  </p>
                </div>

                {/* Founder Signoff in Great Vibes */}
                <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-3 border-t border-slate-100 text-center sm:text-left">
                  <div className="space-y-0.5">
                    <div 
                      className="text-3xl sm:text-4xl text-[#0c234b] font-cursive select-none"
                      style={{ fontFamily: "'Great Vibes', cursive" }}
                    >
                      Alwin Raj
                    </div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Master M. A. Alwin Raj • Founder & Director
                    </div>
                  </div>

                  <div className="px-3 py-1 bg-slate-100 rounded-lg text-slate-700 text-xs font-mono font-bold border border-slate-200">
                    B⭐SEL Directorate
                  </div>
                </div>

              </div>

            </div>

            {/* Experience Highlights (3 Attractive Statistics Cards Specified in Section 5) */}
            <div className="mt-8 pt-8 border-t border-slate-200">
              {/* Scoped Keyframes for Continuous Looped Shining Border */}
              <style>{`
                @keyframes shineBorderLoop {
                  from {
                    transform: translate(-50%, -50%) rotate(0deg);
                  }
                  to {
                    transform: translate(-50%, -50%) rotate(360deg);
                  }
                }
              `}</style>

              <div className="text-center mb-4">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Founder Experience Highlights
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {founderStats.map((stat, idx) => (
                  <div 
                    key={idx}
                    className="relative p-[2.5px] rounded-2xl overflow-hidden shadow-[0_0_12px_rgba(245,158,11,0.2)] hover:shadow-[0_0_24px_rgba(245,158,11,0.45)] hover:-translate-y-1 transition-all duration-300 group [isolation:isolate]"
                  >
                    {/* Rotating shining light beam continuously looping around the border */}
                    <div 
                      className="absolute pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity"
                      style={{
                        width: '260%',
                        aspectRatio: '1 / 1',
                        left: '50%',
                        top: '50%',
                        background: 'conic-gradient(from 0deg, transparent 0deg 210deg, #d97706 245deg, #f59e0b 280deg, #fef08a 320deg, #ffffff 345deg, #f59e0b 360deg)',
                        animation: 'shineBorderLoop 3.5s linear infinite',
                        animationDelay: `${idx * 1.1}s`,
                      }}
                    />

                    {/* Underlying warm amber border guide */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-amber-300/70 pointer-events-none" />

                    {/* Card Inner Content */}
                    <div className="relative z-10 bg-amber-50/90 backdrop-blur-xs rounded-[13.5px] p-4 sm:p-5 text-center flex flex-col justify-center h-full">
                      <div 
                        className="text-3xl sm:text-4xl font-black text-[#0F2B5C] leading-none"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                      >
                        {stat.value}
                      </div>
                      <div className="text-xs sm:text-sm font-black text-slate-900 mt-2">
                        {stat.label}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-700 mt-1">
                        {stat.subtext}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>


    </div>
  );
}


