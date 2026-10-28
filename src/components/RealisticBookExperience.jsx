import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, 
  Target, 
  RotateCcw, 
  Star, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  BookOpen,
  Award
} from 'lucide-react';
import openBookImg from '../assets/open-book-realistic.png';

export default function RealisticBookExperience({ autoPlay = true, className = '' }) {
  // Animation stages: 'opening' (0) -> 'flipping' (1, 2, 3, 4) -> 'popup' (5)
  const [stage, setStage] = useState(0); 
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const pagesData = [
    {
      num: 1,
      title: "Mental Agility & Arithmetic",
      chapter: "Chapter I: Neural Agility",
      desc: "Empowering young minds with bead visualization, rapid mental arithmetic, and photographic memory retention.",
      highlight: "Abacus & Speed Math",
      quote: "Numbers transform into intuition through bead mastery and mental calculation.",
      tag: "Speed • Memory • Focus"
    },
    {
      num: 2,
      title: "Penmanship & Fine Motor Arts",
      chapter: "Chapter II: Visual Arts",
      desc: "Cultivating cursive handwriting grace, fine motor muscle control, and foundational sketching expression.",
      highlight: "Handwriting & Drawing",
      quote: "Every stroke of the pen cultivates discipline, elegance, and creative pride.",
      tag: "Fluidity • Fine Motor • Aesthetics"
    },
    {
      num: 3,
      title: "Language Fluency & Classical Arts",
      chapter: "Chapter III: Classical Heritage",
      desc: "Instilling phonetic decoding clarity alongside classical Bharatanatyam rhythm, mudras, and cultural expression.",
      highlight: "Phonics & Classical Dance",
      quote: "Bridging phonetic articulation with centuries of cultural rhythm and classical grace.",
      tag: "Phonics • Rhythm • Tradition"
    },
    {
      num: 4,
      title: "Olympiads & Life Leadership",
      chapter: "Chapter IV: Character & Merit",
      desc: "Benchmarking student milestones through national Olympiads while instilling self-belief, discipline, and leadership.",
      highlight: "Olympiads & Life Skills",
      quote: "Preparing confident young minds equipped with character, merit, and intellect.",
      tag: "Olympiads • Merit • Leadership"
    }
  ];

  // Automatic sequenced playback
  useEffect(() => {
    if (!isPlaying) return;

    if (stage === 0) {
      // Opening transition: 1.4s
      const timer = setTimeout(() => setStage(1), 1400);
      return () => clearTimeout(timer);
    } else if (stage >= 1 && stage <= 4) {
      // Flip through pages: 1.2s per leaf
      const timer = setTimeout(() => {
        setStage((prev) => prev + 1);
      }, 1250);
      return () => clearTimeout(timer);
    }
  }, [stage, isPlaying]);

  const handleReplay = () => {
    setStage(0);
    setIsPlaying(true);
  };

  const isFinalSpread = stage >= 5;

  return (
    <section className={`relative w-full overflow-hidden bg-gradient-to-b from-[#061327] via-[#091e3e] to-[#040e1d] text-white py-8 sm:py-14 px-3 sm:px-6 select-none ${className}`}>
      
      {/* Ambient Backdrop Lighting / Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(30,64,175,0.22)_0%,transparent_65%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(217,119,6,0.12)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-between gap-6 z-10">

        {/* =========================================================================
            1. TYPOGRAPHY OVERLAYS ("VISION" & "MISSION") WITH BOUNCY SPRING ENTRANCE
           ========================================================================= */}
        <div className="w-full text-center min-h-[110px] sm:min-h-[130px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {isFinalSpread ? (
              /* Popped-up Vision & Mission Header with spring physics */
              <motion.div
                key="popup-header"
                initial={{ opacity: 0, y: -30, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 160, 
                  damping: 14,
                  mass: 0.8
                }}
                className="space-y-2 max-w-3xl mx-auto"
              >
                {/* Gold Crest Pill */}
                <motion.div 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring' }}
                  className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 border border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.35)]"
                >
                  <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-amber-200">
                    B★SEL Academic Charter • Final Spread
                  </span>
                  <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
                </motion.div>

                {/* Primary Heading */}
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-heading text-white tracking-wide drop-shadow-md">
                  Our Vision & Mission
                </h2>

                {/* Floating summary chips */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="flex flex-wrap items-center justify-center gap-2.5 pt-1 text-xs"
                >
                  <span className="inline-flex items-center gap-1.5 bg-sky-950/90 border border-sky-400/50 text-sky-200 px-3.5 py-1 rounded-full shadow-md">
                    <Compass className="w-3.5 h-3.5 text-sky-400" />
                    <span><strong>Vision:</strong> Empowering Every Learner with Skills & Confidence</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-amber-950/90 border border-amber-400/50 text-amber-200 px-3.5 py-1 rounded-full shadow-md">
                    <Target className="w-3.5 h-3.5 text-amber-400" />
                    <span><strong>Mission:</strong> Structured Practice, Master Training & Assessment</span>
                  </span>
                </motion.div>
              </motion.div>
            ) : stage === 0 ? (
              /* Opening stage header */
              <motion.div
                key="opening-header"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-1.5"
              >
                <span className="inline-block text-[10px] sm:text-xs font-black uppercase tracking-widest text-amber-300 bg-amber-400/20 px-3 py-0.5 rounded-full border border-amber-400/40">
                  Institutional Charter
                </span>
                <h2 className="text-xl sm:text-3xl font-black font-heading text-white">
                  Opening the Academic Charter
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm">
                  Laying flat in landscape reading orientation...
                </p>
              </motion.div>
            ) : (
              /* Flipping pages header */
              <motion.div
                key={`flipping-header-${stage}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="space-y-1.5"
              >
                <span className="inline-block text-[10px] sm:text-xs font-black uppercase tracking-widest text-sky-300 bg-sky-500/20 px-3 py-0.5 rounded-full border border-sky-400/40">
                  Sequential Page Flipping ({stage}/4)
                </span>
                <h2 className="text-xl sm:text-3xl font-black font-heading text-white">
                  Turning to Academic Principles
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm">
                  Reviewing foundational curricula before unveiling Vision & Mission...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* =========================================================================
            2. REALISTIC 3D LANDSCAPE OPEN BOOK CANVAS (16:9 / 2.3:1)
           ========================================================================= */}
        <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center my-2" style={{ perspective: '2000px' }}>
          
          <motion.div
            initial={{ rotateX: 20, scale: 0.92, opacity: 0.8 }}
            animate={{ 
              rotateX: isFinalSpread ? 0 : stage === 0 ? 14 : 0, 
              scale: isFinalSpread ? 1.02 : 1.0,
              opacity: 1
            }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative w-full aspect-[986/430] min-h-[300px] sm:min-h-[380px] md:min-h-[420px] flex items-center justify-center filter drop-shadow-[0_28px_50px_rgba(0,0,0,0.85)]"
          >
            {/* The Pristine Defringed Open Book Photographic Asset */}
            <img 
              src={openBookImg} 
              alt="Realistic Landscape Open Book" 
              className="w-full h-full object-contain pointer-events-none select-none"
            />

            {/* -------------------------------------------------------------
                A. STAGE 0: INITIAL OPENING (PREFACE PRINTED ON PARCHMENT)
               ------------------------------------------------------------- */}
            {stage === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none"
              >
                {/* Left Page: Classical Preface */}
                <div 
                  className="absolute left-[15%] right-[56%] top-[14%] bottom-[40%] flex flex-col justify-between text-[#24160a] overflow-hidden"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
                    mixBlendMode: 'multiply',
                    transform: 'rotate(1deg)'
                  }}
                >
                  <div className="flex items-center justify-between pb-1 border-b border-[#24160a]/25 text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-bold text-[#5c3a21]">
                    <span>The Charter</span>
                    <span>Preface</span>
                  </div>

                  <div className="space-y-1 my-auto">
                    <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#5c3a21] font-bold block">
                      Introduction
                    </span>
                    <h4 className="text-sm sm:text-base md:text-xl font-black leading-tight text-[#1a0e05]">
                      B★SEL Academic Charter
                    </h4>
                    <p className="text-[10px] sm:text-xs leading-relaxed italic text-[#382313] line-clamp-3">
                      "A dedicated foundation committed to cognitive excellence, creative expression, and lifelong character building."
                    </p>
                  </div>

                  <div className="pt-1 border-t border-[#24160a]/20 flex items-center justify-between text-[8px] sm:text-[9px] text-[#5c3a21] font-semibold">
                    <span>Opening leaves...</span>
                    <span>Folio 01</span>
                  </div>
                </div>

                {/* Right Page: Curriculum Index */}
                <div 
                  className="absolute left-[56%] right-[15%] top-[14%] bottom-[40%] flex flex-col justify-between text-[#24160a] overflow-hidden"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
                    mixBlendMode: 'multiply',
                    transform: 'rotate(-1deg)'
                  }}
                >
                  <div className="flex items-center justify-between pb-1 border-b border-[#24160a]/25 text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-bold text-[#5c3a21]">
                    <span>Curriculum</span>
                    <span>Folio Index</span>
                  </div>

                  <div className="space-y-1.5 my-auto text-[9px] sm:text-[11px] font-medium text-[#24160a]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-amber-800 font-bold">I.</span>
                      <span>Arithmetic & Brain Agility</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-amber-800 font-bold">II.</span>
                      <span>Penmanship & Visual Arts</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-amber-800 font-bold">III.</span>
                      <span>Phonics & Classical Traditions</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-amber-800 font-bold">IV.</span>
                      <span>Olympiads & Life Leadership</span>
                    </div>
                  </div>

                  <div className="pt-1 border-t border-[#24160a]/20 flex items-center justify-between text-[8px] sm:text-[9px] text-[#5c3a21] font-semibold">
                    <span>B★SEL Charter</span>
                    <span>Folio 02</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* -------------------------------------------------------------
                B. STAGES 1 TO 4: AUTOMATIC 3D SEQUENTIAL PAGE FLIPPING
               ------------------------------------------------------------- */}
            {stage >= 1 && stage <= 4 && (
              <div className="absolute inset-0 pointer-events-none">
                {(() => {
                  const cur = pagesData[stage - 1];

                  return (
                    <>
                      {/* Left Page (Active Settled Chapter) */}
                      <motion.div 
                        key={`left-page-${stage}`}
                        initial={{ opacity: 0.4 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute left-[15%] right-[56%] top-[14%] bottom-[40%] flex flex-col justify-between text-[#24160a] overflow-hidden"
                        style={{
                          fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
                          mixBlendMode: 'multiply',
                          transform: 'rotate(1deg)'
                        }}
                      >
                        <div className="flex items-center justify-between pb-1 border-b border-[#24160a]/25 text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-bold text-[#5c3a21]">
                          <span>{cur.chapter}</span>
                          <span>Page {cur.num * 2 - 1}</span>
                        </div>

                        <div className="space-y-1 my-auto">
                          <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#5c3a21] font-bold block">
                            {cur.highlight}
                          </span>
                          <h4 className="text-sm sm:text-base md:text-xl font-black leading-tight text-[#1a0e05]">
                            {cur.title}
                          </h4>
                          <p className="text-[10px] sm:text-xs leading-relaxed italic text-[#382313] line-clamp-2">
                            "{cur.quote}"
                          </p>
                          <p className="text-[9px] sm:text-[10px] text-[#422916] line-clamp-2">
                            {cur.desc}
                          </p>
                        </div>

                        <div className="pt-1 border-t border-[#24160a]/20 flex items-center justify-between text-[8px] sm:text-[9px] text-[#5c3a21] font-semibold">
                          <span>{cur.tag}</span>
                          <span>Folio 0{cur.num}</span>
                        </div>
                      </motion.div>

                      {/* Right Flipping 3D Leaf */}
                      <motion.div
                        key={`flipping-leaf-${stage}`}
                        initial={{ rotateY: 0 }}
                        animate={{ rotateY: -130 }}
                        transition={{ duration: 1.15, ease: [0.25, 1, 0.5, 1] }}
                        style={{
                          transformOrigin: 'left center',
                          fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif"
                        }}
                        className="absolute left-[56%] right-[15%] top-[14%] bottom-[40%] bg-gradient-to-r from-[#f5edd7] via-[#f7f0df] to-[#eee2c6] rounded-r-lg border border-[#24160a]/20 p-2 sm:p-3 flex flex-col justify-between text-[#24160a] shadow-[-10px_0_20px_rgba(0,0,0,0.22)]"
                      >
                        <div className="flex items-center justify-between pb-1 border-b border-[#24160a]/20 text-[8px] sm:text-[9px] uppercase tracking-widest font-bold text-[#5c3a21]">
                          <span>Flipping Leaf {cur.num}/4</span>
                          <span>Page {cur.num * 2}</span>
                        </div>

                        <div className="text-center my-auto space-y-1">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#24160a]/10 text-[#24160a] flex items-center justify-center mx-auto text-xs sm:text-sm font-black font-mono border border-[#24160a]/25 shadow-inner">
                            {cur.num}
                          </div>
                          <h5 className="text-xs sm:text-sm font-bold text-[#1a0e05] leading-tight">
                            {cur.title}
                          </h5>
                          <span className="inline-block text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#24160a]/10 text-[#382313]">
                            Turning leaf...
                          </span>
                        </div>

                        <div className="pt-1 border-t border-[#24160a]/15 text-center text-[8px] sm:text-[9px] text-[#5c3a21] italic">
                          {stage === 4 ? "Unveiling Vision & Mission next..." : "Turning page..."}
                        </div>
                      </motion.div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* -------------------------------------------------------------
                C. STAGE 5: FINAL SPREAD WITH VISION & MISSION PRINTED IN PAGES
               ------------------------------------------------------------- */}
            {isFinalSpread && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 pointer-events-none"
              >
                {/* Left Page: OUR VISION (Printed into parchment) */}
                <div 
                  className="absolute left-[15%] right-[56%] top-[14%] bottom-[40%] flex flex-col justify-between text-[#24160a] overflow-hidden"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
                    mixBlendMode: 'multiply',
                    transform: 'rotate(1deg)'
                  }}
                >
                  <div className="flex items-center justify-between pb-1 border-b border-[#24160a]/25 text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-bold text-[#5c3a21]">
                    <span>Aspirational Horizon</span>
                    <span>Folio 01</span>
                  </div>

                  <div className="space-y-1.5 my-auto">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#0F2B5C] text-amber-300 flex items-center justify-center text-[10px] font-black shadow-xs">
                        ★
                      </span>
                      <h3 className="text-base sm:text-xl md:text-2xl font-black text-[#0F2B5C] tracking-tight">
                        Our Vision
                      </h3>
                    </div>

                    <div className="pl-2 border-l-2 border-[#0F2B5C]/60 py-0.5">
                      <p className="text-[11px] sm:text-xs md:text-sm leading-relaxed font-bold italic text-[#1a0e05]">
                        "To empower every learner with essential skills, confidence, and creativity for a brighter future."
                      </p>
                    </div>

                    <div className="space-y-0.5 text-[9px] sm:text-[10px] font-semibold text-[#382313]">
                      <div>✦ Nurturing innate talent & creative curiosity</div>
                      <div>✦ Cultivating lifelong self-confidence</div>
                    </div>
                  </div>

                  <div className="pt-1 border-t border-[#24160a]/20 flex items-center justify-between text-[8px] sm:text-[9px] text-[#5c3a21] font-semibold">
                    <span>B★SEL Charter</span>
                    <span>Page 07</span>
                  </div>
                </div>

                {/* Right Page: OUR MISSION (Printed into parchment) */}
                <div 
                  className="absolute left-[56%] right-[15%] top-[14%] bottom-[40%] flex flex-col justify-between text-[#24160a] overflow-hidden"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
                    mixBlendMode: 'multiply',
                    transform: 'rotate(-1deg)'
                  }}
                >
                  <div className="flex items-center justify-between pb-1 border-b border-[#24160a]/25 text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-bold text-[#5c3a21]">
                    <span>Actionable Purpose</span>
                    <span>Folio 02</span>
                  </div>

                  <div className="space-y-1.5 my-auto">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-black shadow-xs">
                        ★
                      </span>
                      <h3 className="text-base sm:text-xl md:text-2xl font-black text-[#693d11] tracking-tight">
                        Our Mission
                      </h3>
                    </div>

                    <div className="pl-2 border-l-2 border-amber-600/60 py-0.5">
                      <p className="text-[11px] sm:text-xs md:text-sm leading-relaxed font-bold italic text-[#1a0e05]">
                        "To deliver structured, practical, and engaging learning programs through quality training, continuous practice, and meaningful assessment."
                      </p>
                    </div>

                    <div className="space-y-0.5 text-[9px] sm:text-[10px] font-semibold text-[#382313]">
                      <div>✦ Practical training & continuous exercises</div>
                      <div>✦ Continuous assessment & milestones</div>
                    </div>
                  </div>

                  <div className="pt-1 border-t border-[#24160a]/20 flex items-center justify-between text-[8px] sm:text-[9px] text-[#5c3a21] font-semibold">
                    <span>B★SEL Charter</span>
                    <span>Page 08</span>
                  </div>
                </div>

                {/* Center Spine 3D Elevated Medallion */}
                <motion.div 
                  initial={{ scale: 0, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 180, delay: 0.2 }}
                  className="absolute left-1/2 top-[30%] -translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 p-[2px] z-40 flex items-center justify-center shadow-[0_12px_25px_rgba(0,0,0,0.5),0_0_20px_rgba(245,158,11,0.4)] pointer-events-none"
                >
                  <div className="w-full h-full rounded-full bg-[#0F2B5C] flex flex-col items-center justify-center text-amber-300">
                    <Star className="w-3.5 h-3.5 fill-amber-300" />
                    <span className="text-[7px] font-black uppercase tracking-widest">B★SEL</span>
                  </div>
                </motion.div>
              </motion.div>
            )}

          </motion.div>
        </div>

        {/* =========================================================================
            3. INTERACTIVE CONTROLS & TIMELINE STATUS
           ========================================================================= */}
        <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-2.5 pt-2">
          
          {/* Phase Pill Indicators */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
            <button
              onClick={() => { setIsPlaying(false); setStage(0); }}
              className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold transition cursor-pointer border ${
                stage === 0 
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md' 
                  : 'bg-white/10 hover:bg-white/20 text-slate-300 border-white/20'
              }`}
            >
              Opening Spread
            </button>
            {[1, 2, 3, 4].map((page) => (
              <button
                key={page}
                onClick={() => { setIsPlaying(false); setStage(page); }}
                className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold transition cursor-pointer border ${
                  stage === page 
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md' 
                    : 'bg-white/10 hover:bg-white/20 text-slate-300 border-white/20'
                }`}
              >
                Page {page}
              </button>
            ))}
            <button
              onClick={() => { setIsPlaying(false); setStage(5); }}
              className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold transition cursor-pointer border ${
                isFinalSpread 
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md ring-2 ring-amber-300/40' 
                  : 'bg-white/10 hover:bg-white/20 text-slate-300 border-white/20'
              }`}
            >
              Vision & Mission ★
            </button>
          </div>

          {/* Replay Button & Progress Indicator */}
          <div className="flex items-center gap-4 text-xs text-slate-300">
            <button
              onClick={handleReplay}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-1.5 rounded-full transition shadow-md hover:shadow-lg cursor-pointer text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay Animation</span>
            </button>
            
            <span className="font-mono text-slate-400">
              {stage === 0 ? "Stage: Opened" : stage <= 4 ? `Flipping: Page ${stage} of 4` : "Status: Vision & Mission Active"}
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
