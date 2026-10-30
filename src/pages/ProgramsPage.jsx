import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  Users, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  GraduationCap, 
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  Lock,
  CreditCard,
  QrCode,
  Building2,
  ShieldCheck,
  Loader2,
  Printer,
  Ticket,
  Calendar,
  MapPin,
  School,
  Check
} from 'lucide-react';
import ProgramIcon from '../components/ProgramIcons';

// Images for 14 programs
import abacusImg from '../assets/programs/abacus.jpg';
import handwritingImg from '../assets/programs/handwriting.jpg';
import phonicsImg from '../assets/programs/phonics.jpg';
import drawingArtImg from '../assets/programs/drawing-art.jpg';
import memoryImg from '../assets/programs/memory.jpg';
import danceImg from '../assets/programs/dance.jpg';
import msofficeImg from '../assets/programs/msoffice.jpg';
import htmlImg from '../assets/programs/html.png';
import cssImg from '../assets/programs/css.png';
import pythonImg from '../assets/programs/python.png';
import computerImg from '../assets/programs/computer.png';
import photoshopImg from '../assets/programs/photoshop.png';
import aiImg from '../assets/programs/ai.jpg';
import canvaImg from '../assets/programs/canva.png';

// Comprehensive dataset for 14 programs across Skill Development and Digital & Technology
import { getStoredCourses } from '../data/coursesData';

export default function ProgramsPage() {
  const [courses, setCourses] = useState(() => getStoredCourses());
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'skill' | 'digital'

  useEffect(() => {
    const handleCoursesUpdate = () => {
      setCourses(getStoredCourses());
    };
    window.addEventListener('bsel_courses_updated', handleCoursesUpdate);
    window.addEventListener('storage', handleCoursesUpdate);
    return () => {
      window.removeEventListener('bsel_courses_updated', handleCoursesUpdate);
      window.removeEventListener('storage', handleCoursesUpdate);
    };
  }, []);

  // Sync selectedProgram if course data was edited in Admin Page
  useEffect(() => {
    if (selectedProgram) {
      const refreshed = courses.find(c => c.id === selectedProgram.id);
      if (refreshed) {
        setSelectedProgram(refreshed);
      }
    }
  }, [courses]);

  const isSkill = (p) => {
    const cat = (p.category || '').toLowerCase();
    return cat === 'skill' || cat.includes('skill') || cat.includes('art') || cat.includes('creative') || cat.includes('language');
  };

  // Programs categorized into two distinct sections (live updated from Admin Page)
  const skillPrograms = courses.filter(p => isSkill(p));
  const digitalPrograms = courses.filter(p => !isSkill(p));

  // Shared Card Renderer for both sections
  const renderProgramCard = (prog) => (
    <div
      key={prog.id}
      onClick={() => setSelectedProgram(prog)}
      className="relative p-[2px] sm:p-[3px] rounded-xl sm:rounded-3xl cursor-pointer group transition-all duration-300 hover:-translate-y-1.5 active:scale-[0.98] flex flex-col h-full"
      style={{
        background: 'linear-gradient(135deg, #f59e0b, #fef08a, #38bdf8, #ffffff, #fbbf24, #f59e0b)',
        backgroundSize: '300% 300%',
        animation: 'glitterBorder 4s ease infinite',
        boxShadow: '0 0 14px rgba(245, 158, 11, 0.25), 0 4px 14px rgba(0, 0, 0, 0.06)'
      }}
      title={`Click to view ${prog.name} syllabus & details`}
    >
      {/* Card Inner Content */}
      <div className="relative bg-white rounded-[10px] sm:rounded-[21px] overflow-hidden flex flex-col text-left h-full group-hover:bg-slate-50/70 transition-colors">
        {/* Course Photography Container */}
        <div className="relative aspect-[4/3] sm:aspect-[3/2] w-full overflow-hidden bg-slate-100">
          <img
            src={prog.image}
            alt={prog.name}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${prog.imagePosition || 'object-center'}`}
            loading="lazy"
          />
          {/* Age Group Badge over Photo */}
          <span className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 bg-slate-950/75 backdrop-blur-xs text-white text-[9px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md shadow-xs">
            {prog.ageGroup}
          </span>
        </div>

        {/* Program Card Body */}
        <div className="p-2.5 sm:p-5 flex-1 flex flex-col justify-between space-y-1 sm:space-y-3">
          <div>
            <div className="flex items-start justify-between gap-1">
              <h3 
                className="font-black text-xs sm:text-lg md:text-xl text-black font-heading group-hover:text-sky-700 transition leading-tight line-clamp-1"
              >
                {prog.name}
              </h3>
            </div>

            <p className="text-[11px] sm:text-sm text-slate-700 mt-0.5 sm:mt-1.5 leading-snug sm:leading-relaxed font-semibold line-clamp-2">
              {prog.tagline}
            </p>
          </div>

          {/* Footer Details */}
          <div className="pt-1.5 sm:pt-2 border-t border-slate-100 sm:border-slate-200 flex items-center justify-between text-[10px] sm:text-xs text-slate-900 font-bold">
            <span className="text-slate-600 truncate max-w-[65%] sm:max-w-none text-[10px] sm:text-xs">
              {prog.levels.includes('(') ? prog.levels.split('(')[0].trim() : prog.levels}
            </span>
            <span className="text-sky-700 text-[10px] sm:text-xs font-black shrink-0 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              <span>View</span>
              <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Right-side drawer registration state
  const [registeringProgram, setRegisteringProgram] = useState(null);
  const [regStep, setRegStep] = useState('form'); // 'form' | 'payment' | 'processing' | 'success'
  
  // Registration form fields
  const [regForm, setRegForm] = useState({
    studentName: '',
    dob: '',
    parentName: '',
    phone: '',
    email: '',
    schoolName: '',
    city: '',
    selectedLevel: 'Level 1'
  });

  // Payment method & details
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Lock background body scroll when either syllabus modal or registration drawer is open
  useEffect(() => {
    if (selectedProgram || registeringProgram) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProgram, registeringProgram]);
  
  // Confirmed registration receipt state
  const [confirmationData, setConfirmationData] = useState(null);

  // Open official admission form for a given program
  const handleOpenRegister = (program) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open_admission_modal', {
        detail: {
          program: program.name,
          fee: program.fee || '₹450'
        }
      }));
    }
  };

  const handleCloseRegister = () => {
    setRegisteringProgram(null);
    setRegStep('form');
  };

  // Step 1: Submit Registration Form -> Go to Payment Gateway
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setRegStep('payment');
  };

  // Step 2: Trigger Payment Gateway Processing
  const handleProcessPayment = () => {
    setRegStep('processing');
    const randomTxn = `TXN-UPI-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const randomRegNo = `BSEL-REG-${Math.floor(100000 + Math.random() * 900000)}`;
    const today = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    setTimeout(() => {
      const receipt = {
        registrationNo: randomRegNo,
        transactionId: randomTxn,
        studentName: regForm.studentName,
        parentName: regForm.parentName,
        phone: regForm.phone,
        email: regForm.email,
        schoolName: regForm.schoolName,
        city: regForm.city,
        programName: registeringProgram.name,
        level: regForm.selectedLevel,
        feePaid: registeringProgram.fee,
        date: today,
        paymentMethod: paymentMethod.toUpperCase()
      };

      setConfirmationData(receipt);

      // Persist in localStorage so it reflects across student profile
      try {
        const studentRecord = {
          studentName: regForm.studentName,
          courseName: registeringProgram.name,
          programPrefix: 'MINDSPARC',
          level: regForm.selectedLevel,
          grade: 'A',
          duration: registeringProgram.duration,
          registrationNo: randomRegNo,
          certificateNo: `BSEL/${registeringProgram.name.toUpperCase().replace(/\s+/g, '')}/L1/1001`,
          centreName: regForm.schoolName || 'B★SEL Training Center',
          centreCode: '546454',
          centreAddress: `${regForm.city || 'Chennai'}, Tamil Nadu`,
          issueDate: today,
          certificateType: 'CURRICULUM ENROLLMENT',
          transactionId: randomTxn,
          feePaid: registeringProgram.fee
        };
        localStorage.setItem('bsel_registered_student', JSON.stringify(studentRecord));
      } catch {
        // ignore
      }

      setRegStep('success');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-4 sm:py-8 md:py-12 relative overflow-x-hidden">
      <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-10 space-y-4 sm:space-y-8">
        
        {/* =========================================================================
            COMPACT PROGRAMS PAGE HEADER (NO HERO BG, REDUCED SIZE)
           ========================================================================= */}
        <div className="py-1.5 sm:py-3 text-center max-w-2xl mx-auto space-y-1 sm:space-y-1.5">
          {/* Title - Reduced Size with Elegant Typography */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-heading text-[#0F2B5C] tracking-tight leading-tight">
            <span>Academic & </span>
            <span className="italic font-serif text-amber-500">Skill Programs</span>
          </h1>

          {/* Description - Compact & Short */}
          <p className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed max-w-xl mx-auto px-2">
            Explore our 14 structured learning pathways across Skill Development and Digital Technology.
          </p>
        </div>

        {/* =========================================================================
            PROGRAMS SECTION (ALL 14 PROGRAMS WITH DIRECT REGISTER ACTION & SYLLABUS)
           ========================================================================= */}
        <div id="programs-grid-section" className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-6 md:p-8 shadow-sm border border-slate-200 text-slate-800 space-y-6 sm:space-y-12">
          {/* Main Section Header */}
          <div className="pb-3.5 sm:pb-6 border-b border-slate-100 flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
            <div>
              <span className="text-[10px] sm:text-xs font-extrabold text-sky-700 tracking-widest uppercase">
                Our Programs
              </span>
              <h2 className="text-base sm:text-lg md:text-xl font-black text-black font-heading tracking-tight mt-0.5">
                Explore Your Potential
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-2xl font-semibold">
                Discover 14 structured programs designed to develop cognitive speed, fine art mastery, rhythm, computer literacy, coding, and lifelong confidence.
              </p>
            </div>

            {/* Quick Navigation Anchor Links - 2 balanced columns on mobile */}
            <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
              <a
                href="#skill-development"
                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-full text-center text-xs sm:text-sm font-black bg-[#0F2B5C] hover:bg-[#163875] text-white transition shadow-xs cursor-pointer active:scale-95 flex items-center justify-center gap-1 sm:gap-1.5"
              >
                <span className="truncate">Skill Dev (6)</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400 rotate-90 shrink-0" />
              </a>
              <a
                href="#digital-technology"
                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-full text-center text-xs sm:text-sm font-black bg-slate-100 hover:bg-slate-200 text-slate-800 transition shadow-xs cursor-pointer active:scale-95 flex items-center justify-center gap-1 sm:gap-1.5 border border-slate-200"
              >
                <span className="truncate">Digital & Tech (8)</span>
                <ArrowRight className="w-3.5 h-3.5 text-sky-700 rotate-90 shrink-0" />
              </a>
            </div>
          </div>

          {/* Scoped CSS for Card Glitter Shimmer Border */}
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

          {/* =========================================================================
              PART 1: SKILL DEVELOPMENT PROGRAMS (6)
             ========================================================================= */}
          <div id="skill-development" className="scroll-mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 pb-2.5 sm:pb-3 mb-3.5 sm:mb-6 border-b border-amber-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] sm:text-xs font-black uppercase tracking-wider">
                    Category 1
                  </span>
                  <h3 className="text-base sm:text-2xl font-black text-slate-900 font-heading tracking-tight">
                    Skill Development <span className="text-amber-600 font-bold">({skillPrograms.length})</span>
                  </h3>
                </div>
                <p className="text-[11px] sm:text-sm text-slate-600 mt-0.5 sm:mt-1 font-medium">
                  Foundational cognitive speed, mental arithmetic, fine arts, reading fluency, and cultural dance.
                </p>
              </div>
            </div>

            {/* Grid of 6 Skill Programs - 2 Col on Mobile */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6 lg:gap-8">
              {skillPrograms.map(renderProgramCard)}
            </div>
          </div>

          {/* =========================================================================
              PART 2: DIGITAL & TECHNOLOGY PROGRAMS (8)
             ========================================================================= */}
          <div id="digital-technology" className="scroll-mt-6 pt-5 sm:pt-8 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 pb-2.5 sm:pb-3 mb-3.5 sm:mb-6 border-b border-sky-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-900 text-[10px] sm:text-xs font-black uppercase tracking-wider">
                    Category 2
                  </span>
                  <h3 className="text-base sm:text-2xl font-black text-slate-900 font-heading tracking-tight">
                    Digital & Technology <span className="text-sky-700 font-bold">({digitalPrograms.length})</span>
                  </h3>
                </div>
                <p className="text-[11px] sm:text-sm text-slate-600 mt-0.5 sm:mt-1 font-medium">
                  Essential modern computing, office productivity, web development, coding logic, and creative design tools.
                </p>
              </div>
            </div>

            {/* Grid of 8 Digital Programs - 2 Col on Mobile */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6 lg:gap-8">
              {digitalPrograms.map(renderProgramCard)}
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 pt-1 sm:pt-2">
          {/* Card 1: Mint / Green (Structured Syllabus) */}
          <div className="bg-[#F2FAF6] rounded-xl sm:rounded-2xl p-3 sm:p-4 border-2 border-[#86EFAC] shadow-xs flex flex-col justify-between h-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white border border-[#6EE7B7] text-[#059669] flex items-center justify-center shrink-0 shadow-xs">
                  <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                </div>
                <h4 className="text-xs sm:text-base font-black text-slate-900 font-heading tracking-tight">
                  Standardized Syllabus
                </h4>
              </div>

              <p className="text-[11px] sm:text-xs text-slate-700 leading-relaxed font-semibold">
                Step-by-step grade levels mapped to age cognitive abilities from foundation to mastery.
              </p>
            </div>

            <div className="pt-2 mt-2 sm:mt-3 border-t border-[#A7F3D0]/80 flex items-center justify-between text-[10px] sm:text-[11px]">
              <span className="text-[#047857] font-bold">Practical Training</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
            </div>
          </div>

          {/* Card 2: Warm Amber / Yellow (Recognized Certification) */}
          <div className="bg-[#FFFDF0] rounded-xl sm:rounded-2xl p-3 sm:p-4 border-2 border-[#FDE047] shadow-xs flex flex-col justify-between h-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white border border-[#FCD34D] text-[#D97706] flex items-center justify-center shrink-0 shadow-xs">
                  <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                </div>
                <h4 className="text-xs sm:text-base font-black text-slate-900 font-heading tracking-tight">
                  Recognized Certification
                </h4>
              </div>

              <p className="text-[11px] sm:text-xs text-slate-700 leading-relaxed font-semibold">
                Official certificates with verifiable QR codes issued upon completing level assessments.
              </p>
            </div>

            <div className="pt-2 mt-2 sm:mt-3 border-t border-[#FDE047]/80 flex items-center justify-between text-[10px] sm:text-[11px]">
              <span className="text-[#B45309] font-bold">Practical Training</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
            </div>
          </div>

          {/* Card 3: Rose / Pink (Expert Master Trainers) */}
          <div className="bg-[#FFF5F6] rounded-xl sm:rounded-2xl p-3 sm:p-4 border-2 border-[#FDA4AF] shadow-xs flex flex-col justify-between h-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white border border-[#FDA4AF] text-[#E11D48] flex items-center justify-center shrink-0 shadow-xs">
                  <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                </div>
                <h4 className="text-xs sm:text-base font-black text-slate-900 font-heading tracking-tight">
                  Expert Master Trainers
                </h4>
              </div>

              <p className="text-[11px] sm:text-xs text-slate-700 leading-relaxed font-semibold">
                Trained and certified instructors delivering engaging hands-on classroom experiences.
              </p>
            </div>

            <div className="pt-2 mt-2 sm:mt-3 border-t border-[#FDA4AF]/80 flex items-center justify-between text-[10px] sm:text-[11px]">
              <span className="text-[#BE123C] font-bold">Practical Training</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
            </div>
          </div>
        </div>

      </div>

      {/* =========================================================================
          DETAILED SYLLABUS MODAL (CENTER POPUP)
         ========================================================================= */}
      {selectedProgram && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4"
          onClick={() => setSelectedProgram(null)}
        >
          <div 
            className="relative bg-white rounded-2xl sm:rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh] sm:max-h-[90vh] my-auto overscroll-contain"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Banner */}
            <div className={`p-3.5 sm:p-6 bg-gradient-to-r ${selectedProgram.themeColor} text-white relative shrink-0`}>
              <button
                type="button"
                onClick={() => setSelectedProgram(null)}
                className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 bg-black/25 hover:bg-black/40 text-white rounded-full p-1.5 sm:p-2 transition cursor-pointer active:scale-95 z-10"
                aria-label="Close"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="flex items-center gap-2.5 sm:gap-4 pr-7 sm:pr-8">
                <img 
                  src={selectedProgram.image} 
                  alt={selectedProgram.name} 
                  className={`w-12 h-12 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-xl object-cover border-2 border-white/60 shadow-md shrink-0 ${selectedProgram.imagePosition || 'object-center'}`} 
                />
                <div className="min-w-0">
                  <h3 className="text-base sm:text-2xl md:text-3xl font-black font-heading text-white tracking-wide truncate">
                    {selectedProgram.name}
                  </h3>
                  <p className="text-white/95 text-[11px] sm:text-sm mt-0.5 font-semibold line-clamp-2">
                    {selectedProgram.tagline}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-3.5 sm:p-6 flex-1 overflow-y-auto overscroll-contain space-y-4 sm:space-y-5 text-slate-700">
              
              {/* Quick Facts */}
              <div className="grid grid-cols-3 gap-1 sm:gap-3 bg-slate-50 p-2 sm:p-3.5 rounded-xl border border-slate-300 text-center">
                <div className="flex flex-col items-center p-0.5 sm:p-1">
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-800 mb-0.5 sm:mb-1" />
                  <span className="text-[9px] sm:text-[11px] text-slate-600 uppercase font-black">Age Group</span>
                  <span className="text-xs sm:text-sm font-black text-slate-950 truncate max-w-full">{selectedProgram.ageGroup}</span>
                </div>
                <div className="flex flex-col items-center p-0.5 sm:p-1 border-x border-slate-300">
                  <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-800 mb-0.5 sm:mb-1" />
                  <span className="text-[9px] sm:text-[11px] text-slate-600 uppercase font-black">Levels</span>
                  <span className="text-xs sm:text-sm font-black text-slate-950 truncate max-w-full">{selectedProgram.levels}</span>
                </div>
                <div className="flex flex-col items-center p-0.5 sm:p-1">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-800 mb-0.5 sm:mb-1" />
                  <span className="text-[9px] sm:text-[11px] text-slate-600 uppercase font-black">Duration</span>
                  <span className="text-xs sm:text-sm font-black text-slate-950 truncate max-w-full">{selectedProgram.duration}</span>
                </div>
              </div>

              {/* About This Program */}
              <div>
                <h4 className="text-xs sm:text-sm font-black text-black uppercase tracking-wider mb-1 sm:mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-800 shrink-0" />
                  <span>About This Program</span>
                </h4>
                <p className="text-slate-800 text-xs sm:text-sm leading-relaxed font-semibold">
                  {selectedProgram.description}
                </p>
              </div>

              {/* Informative Syllabus Structure */}
              {selectedProgram.curriculum && selectedProgram.curriculum.length > 0 && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2 sm:mb-2.5">
                    <h4 className="text-xs sm:text-sm font-black text-black uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0F2B5C] shrink-0" />
                      <span>Syllabus Structure</span>
                    </h4>
                    <span className="text-[10px] sm:text-[11px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200 w-fit">
                      Step-by-Step Milestones
                    </span>
                  </div>

                  <div className="space-y-2 sm:space-y-2.5">
                    {selectedProgram.curriculum.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="bg-slate-50 hover:bg-slate-100/80 p-2.5 sm:p-3.5 rounded-xl border border-slate-200 transition text-left"
                      >
                        <div className="flex items-start gap-2 sm:gap-2.5">
                          <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#0F2B5C] text-white font-black text-[10px] sm:text-xs flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                            {idx + 1}
                          </span>
                          <div className="flex-1">
                            <h5 className="font-black text-xs sm:text-sm text-slate-950 leading-snug">
                              {typeof item === 'string' ? item : item.title}
                            </h5>
                            
                            {typeof item === 'object' && item.topics && (
                              <ul className="mt-1.5 sm:mt-2 space-y-1 pl-0.5 sm:pl-1">
                                {item.topics.map((topic, tIdx) => (
                                  <li key={tIdx} className="text-[11px] sm:text-xs text-slate-700 flex items-start gap-1.5 sm:gap-2 font-medium">
                                    <span className="text-sky-600 font-bold shrink-0 mt-0.5">•</span>
                                    <span>{typeof topic === 'string' ? topic.replace(/^(\d+[\.\)]\s*|Level\s+\d+:\s*)/i, '') : topic}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Outcomes */}
              {selectedProgram.outcomes && selectedProgram.outcomes.length > 0 && (
                <div className="pt-2 border-t border-slate-200">
                  <h4 className="text-xs sm:text-sm font-black text-black uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
                    <span>Key Learning Outcomes</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                    {selectedProgram.outcomes.map((outcome, oIdx) => (
                      <div key={oIdx} className="flex items-start gap-2 p-2 rounded-lg bg-emerald-50/60 border border-emerald-100 text-[11px] sm:text-xs text-slate-800 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fee & Enrollment Box (At the end of Details) */}
              <div className="pt-2 sm:pt-3 border-t border-slate-200">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4">
                  <span className="text-[9px] sm:text-[10px] uppercase font-black text-slate-500 tracking-wider block">
                    Course Fee & Official Kit
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 mt-1">
                    <span className="text-xl sm:text-3xl font-black text-emerald-700 font-heading">
                      {selectedProgram.fee}
                    </span>
                    <span className="text-[11px] sm:text-sm text-slate-600 font-medium">
                      (Includes student workbook kit, assessment fee & official certificate)
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-100 px-3.5 sm:px-6 py-2.5 sm:py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
              <span className="text-[11px] sm:text-xs text-slate-600 text-center sm:text-left font-medium hidden sm:block">
                Official Syllabus of Board of Skills and Educational Learning
              </span>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedProgram(null)}
                  className="flex-1 sm:flex-none px-4 py-2.5 sm:py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs sm:text-sm transition cursor-pointer shadow-xs active:scale-95 text-center min-h-[42px]"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const prog = selectedProgram;
                    setSelectedProgram(null);
                    handleOpenRegister(prog);
                  }}
                  className="flex-1 sm:flex-none px-4 py-2.5 sm:py-2 rounded-xl bg-[#0F2B5C] hover:bg-[#163875] text-white font-black text-xs sm:text-sm transition cursor-pointer shadow-sm active:scale-95 flex items-center justify-center gap-1.5 min-h-[42px]"
                >
                  <span>Proceed to Admission Form</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          RIGHT-SIDE SLIDE-OVER DRAWER: REGISTRATION & PAYMENT GATEWAY + DETAILS
         ========================================================================= */}
      {registeringProgram && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
            onClick={handleCloseRegister}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 overscroll-contain">
            <div 
              className="w-screen max-w-full sm:max-w-xl bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300 z-50 text-slate-800 h-full overscroll-contain"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Top Header Banner */}
              <div className={`p-3.5 sm:p-5 bg-gradient-to-r ${registeringProgram.themeColor} text-white relative shrink-0`}>
                <div className="flex items-center justify-between pr-8">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <img 
                      src={registeringProgram.image} 
                      alt={registeringProgram.name} 
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover border-2 border-white/60 shadow-md shrink-0 ${registeringProgram.imagePosition || 'object-center'}`} 
                    />
                    <div>
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white/80 block">
                        Online Enrollment
                      </span>
                      <h3 className="text-sm sm:text-xl font-black font-heading text-white truncate max-w-[200px] sm:max-w-[280px]">
                        {registeringProgram.name}
                      </h3>
                      <span className="text-[11px] sm:text-xs font-semibold text-white/90">
                        {registeringProgram.levels} • {registeringProgram.ageGroup}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCloseRegister}
                  className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 bg-black/25 hover:bg-black/40 text-white rounded-full p-1.5 transition cursor-pointer active:scale-95 z-10"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Stepper Tabs */}
                <div className="grid grid-cols-3 gap-1 sm:gap-2 mt-3 pt-2.5 border-t border-white/20 text-center text-[11px] sm:text-xs font-black">
                  <div className={`pb-1 border-b-2 ${regStep === 'form' ? 'border-amber-400 text-amber-300' : 'border-transparent text-white/70'}`}>
                    1. Candidate
                  </div>
                  <div className={`pb-1 border-b-2 ${regStep === 'payment' || regStep === 'processing' ? 'border-amber-400 text-amber-300' : 'border-transparent text-white/70'}`}>
                    2. Payment
                  </div>
                  <div className={`pb-1 border-b-2 ${regStep === 'success' ? 'border-amber-400 text-amber-300' : 'border-transparent text-white/70'}`}>
                    3. Receipt
                  </div>
                </div>
              </div>

              {/* Drawer Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto overscroll-contain p-3.5 sm:p-6 space-y-4 sm:space-y-5">
                
                {/* =========================================================================
                    STEP 1: REGISTRATION FORM & RIGHT-SIDE COURSE DETAILS
                   ========================================================================= */}
                {regStep === 'form' && (
                  <form onSubmit={handleFormSubmit} className="space-y-3.5 sm:space-y-4">
                    {/* Course Summary Card */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 sm:p-3.5 space-y-1.5 sm:space-y-2">
                      <div className="flex items-center justify-between text-[11px] sm:text-xs">
                        <span className="font-bold text-slate-600">Selected Discipline:</span>
                        <span className="font-black text-slate-900">{registeringProgram.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] sm:text-xs">
                        <span className="font-bold text-slate-600">Curriculum Structure:</span>
                        <span className="font-black text-slate-900">{registeringProgram.levels}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] sm:text-xs">
                        <span className="font-bold text-slate-600">Target Age Group:</span>
                        <span className="font-black text-slate-900">{registeringProgram.ageGroup}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] sm:text-xs pt-1.5 border-t border-slate-200">
                        <span className="font-black text-slate-800">Total Admission / Assessment Fee:</span>
                        <span className="font-black text-emerald-700 text-sm">{registeringProgram.fee}</span>
                      </div>
                    </div>

                    <div className="space-y-2.5 sm:space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-sky-700" />
                        <span>Candidate Information</span>
                      </h4>

                      <div>
                        <label className="block text-xs font-black text-slate-900 mb-1">
                          Student Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={regForm.studentName}
                          onChange={(e) => setRegForm({...regForm, studentName: e.target.value})}
                          className="w-full h-10 px-3 text-base sm:text-sm text-slate-950 font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                        <div>
                          <label className="block text-[11px] sm:text-xs font-black text-slate-900 mb-0.5 sm:mb-1 truncate">
                            Date of Birth *
                          </label>
                          <input
                            type="date"
                            required
                            value={regForm.dob}
                            onChange={(e) => setRegForm({...regForm, dob: e.target.value})}
                            className="w-full h-9 sm:h-10 px-2 sm:px-3 text-base sm:text-sm text-slate-950 font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] sm:text-xs font-black text-slate-900 mb-0.5 sm:mb-1 truncate">
                            Starting Level *
                          </label>
                          <select
                            value={regForm.selectedLevel}
                            onChange={(e) => setRegForm({...regForm, selectedLevel: e.target.value})}
                            className="w-full h-9 sm:h-10 px-2 sm:px-2.5 text-base sm:text-sm text-slate-950 font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white truncate"
                          >
                            {registeringProgram.curriculum.map((c, i) => (
                              <option key={i} value={typeof c === 'string' ? c.split(':')[0] : c.title.split(':')[0]}>
                                {typeof c === 'string' ? c.split(':')[0] : c.title.split(':')[0]}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                        <div>
                          <label className="block text-[11px] sm:text-xs font-black text-slate-900 mb-0.5 sm:mb-1 truncate">
                            Parent / Guardian *
                          </label>
                          <input
                            type="text"
                            required
                            value={regForm.parentName}
                            onChange={(e) => setRegForm({...regForm, parentName: e.target.value})}
                            className="w-full h-9 sm:h-10 px-2 sm:px-3 text-base sm:text-sm text-slate-950 font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] sm:text-xs font-black text-slate-900 mb-0.5 sm:mb-1 truncate">
                            WhatsApp / Mobile *
                          </label>
                          <input
                            type="tel"
                            required
                            value={regForm.phone}
                            onChange={(e) => setRegForm({...regForm, phone: e.target.value})}
                            className="w-full h-9 sm:h-10 px-2 sm:px-3 text-base sm:text-sm text-slate-950 font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                        <div>
                          <label className="block text-[11px] sm:text-xs font-black text-slate-900 mb-0.5 sm:mb-1 truncate">
                            School / Academy *
                          </label>
                          <input
                            type="text"
                            required
                            value={regForm.schoolName}
                            onChange={(e) => setRegForm({...regForm, schoolName: e.target.value})}
                            className="w-full h-9 sm:h-10 px-2 sm:px-3 text-base sm:text-sm text-slate-950 font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] sm:text-xs font-black text-slate-900 mb-0.5 sm:mb-1 truncate">
                            City / Town *
                          </label>
                          <input
                            type="text"
                            required
                            value={regForm.city}
                            onChange={(e) => setRegForm({...regForm, city: e.target.value})}
                            className="w-full h-9 sm:h-10 px-2 sm:px-3 text-base sm:text-sm text-slate-950 font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-900 mb-1">
                          Email Address (Optional)
                        </label>
                        <input
                          type="email"
                          value={regForm.email}
                          onChange={(e) => setRegForm({...regForm, email: e.target.value})}
                          className="w-full h-10 px-3 text-base sm:text-sm text-slate-950 font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full bg-[#0F2B5C] hover:bg-[#163875] text-white py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer active:scale-[0.99] min-h-[46px]"
                      >
                        <Lock className="w-4 h-4 text-amber-400" />
                        <span>Proceed to Payment ({registeringProgram.fee})</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}

                {/* =========================================================================
                    STEP 2: PAYMENT GATEWAY INTERFACE
                   ========================================================================= */}
                {regStep === 'payment' && (
                  <div className="space-y-3.5 sm:space-y-4">
                    <button
                      type="button"
                      onClick={() => setRegStep('form')}
                      className="text-xs font-black text-sky-800 hover:text-sky-950 flex items-center gap-1 cursor-pointer mb-1 py-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Candidate Information</span>
                    </button>

                    {/* Order Summary Box */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 sm:p-4">
                      <div className="flex items-center justify-between pb-2 sm:pb-2.5 border-b border-slate-200">
                        <div>
                          <span className="text-[9px] sm:text-[10px] font-black uppercase text-slate-500 tracking-wider block">
                            Enrolling in Program
                          </span>
                          <h4 className="text-sm sm:text-base font-black text-slate-900">{registeringProgram.name}</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 block">Total Payable</span>
                          <span className="text-xl sm:text-2xl font-black text-emerald-700 font-heading">{registeringProgram.fee}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2.5 text-[11px] sm:text-xs">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Student Name:</span>
                          <strong className="text-slate-900 font-bold truncate block">{regForm.studentName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Selected Stage:</span>
                          <strong className="text-slate-900 font-bold">{regForm.selectedLevel}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Parent:</span>
                          <strong className="text-slate-900 font-bold">{regForm.parentName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Contact:</span>
                          <strong className="text-slate-900 font-bold">{regForm.phone}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method Selector */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
                        Select Payment Option
                      </label>
                      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('upi')}
                          className={`p-2 sm:p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-0.5 sm:gap-1 active:scale-95 ${
                            paymentMethod === 'upi'
                              ? 'border-sky-600 bg-sky-50 text-sky-900 ring-2 ring-sky-500/20 font-black'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" />
                          <span className="text-[11px] sm:text-xs font-bold">UPI / QR</span>
                          <span className="text-[8px] sm:text-[9px] text-emerald-700 font-black bg-emerald-100 px-1 rounded">Instant</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('card')}
                          className={`p-2 sm:p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-0.5 sm:gap-1 active:scale-95 ${
                            paymentMethod === 'card'
                              ? 'border-sky-600 bg-sky-50 text-sky-900 ring-2 ring-sky-500/20 font-black'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" />
                          <span className="text-[11px] sm:text-xs font-bold">Debit / Card</span>
                          <span className="text-[8px] sm:text-[9px] text-slate-500">RuPay/Visa</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('netbanking')}
                          className={`p-2 sm:p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-0.5 sm:gap-1 active:scale-95 ${
                            paymentMethod === 'netbanking'
                              ? 'border-sky-600 bg-sky-50 text-sky-900 ring-2 ring-sky-500/20 font-black'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" />
                          <span className="text-[11px] sm:text-xs font-bold">Net Banking</span>
                          <span className="text-[8px] sm:text-[9px] text-slate-500">All Banks</span>
                        </button>
                      </div>
                    </div>

                    {/* Method Details Input */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 sm:p-4">
                      {paymentMethod === 'upi' && (
                        <div className="space-y-3 text-center">
                          <div className="bg-white p-2.5 sm:p-3 rounded-xl border-2 border-slate-300 inline-block shadow-xs">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-slate-950 rounded-lg p-2 flex flex-col items-center justify-center text-white mx-auto">
                              <QrCode className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
                              <span className="text-[8px] sm:text-[9px] font-mono mt-1 text-slate-300">BSEL-{registeringProgram.id.toUpperCase()}</span>
                            </div>
                          </div>
                          <p className="text-[11px] sm:text-xs text-slate-600 font-semibold">
                            Scan with PhonePe, Google Pay, Paytm, or enter your VPA / UPI ID below:
                          </p>
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="w-full h-10 px-3 text-center font-mono text-base sm:text-sm border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                          />
                        </div>
                      )}

                      {paymentMethod === 'card' && (
                        <div className="space-y-2.5 sm:space-y-3">
                          <div>
                            <label className="block text-[11px] font-black text-slate-800 mb-1">Card Number</label>
                            <input
                              type="text"
                              maxLength="19"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              className="w-full h-10 px-3 font-mono text-base sm:text-sm border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-black text-slate-800 mb-1">Expiry (MM/YY)</label>
                              <input
                                type="text"
                                maxLength="5"
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                                className="w-full h-10 px-3 text-center font-mono text-base sm:text-sm border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-black text-slate-800 mb-1">CVV</label>
                              <input
                                type="password"
                                maxLength="3"
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value)}
                                className="w-full h-10 px-3 text-center font-mono text-base sm:text-sm border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[11px] font-black text-slate-800 mb-1">Cardholder Name</label>
                            <input
                              type="text"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                              className="w-full h-10 px-3 text-base sm:text-sm border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                            />
                          </div>
                        </div>
                      )}

                      {paymentMethod === 'netbanking' && (
                        <div className="space-y-3">
                          <label className="block text-[11px] font-black text-slate-800 mb-1">Select Bank</label>
                          <select
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                            className="w-full h-10 px-3 text-base sm:text-sm border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                          >
                            <option>HDFC Bank</option>
                            <option>State Bank of India (SBI)</option>
                            <option>ICICI Bank</option>
                            <option>Axis Bank</option>
                            <option>Punjab National Bank</option>
                            <option>Kotak Mahindra Bank</option>
                            <option>Canara Bank</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleProcessPayment}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white py-3 sm:py-3.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer min-h-[46px]"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-200" />
                        <span>Pay {registeringProgram.fee} & Complete Registration</span>
                      </button>
                      <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500 font-semibold mt-2 text-center">
                        <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>256-bit Encrypted SSL Gateway • Official B★SEL Receipt</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* =========================================================================
                    STEP 3: PROCESSING SIMULATION
                   ========================================================================= */}
                {regStep === 'processing' && (
                  <div className="py-12 sm:py-16 text-center space-y-3 sm:space-y-4">
                    <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-sky-700 animate-spin mx-auto" />
                    <div>
                      <h4 className="text-sm sm:text-base font-black text-slate-900">Processing Your Enrollment</h4>
                      <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                        Connecting to B★SEL Education Gateway. Please do not close this window or refresh the page...
                      </p>
                    </div>
                  </div>
                )}

                {/* =========================================================================
                    STEP 4: REGISTRATION RECEIPT & CONFIRMATION SLIP
                   ========================================================================= */}
                {regStep === 'success' && confirmationData && (
                  <div className="space-y-3.5 sm:space-y-4">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 sm:p-4 text-center space-y-1 sm:space-y-1.5">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                        <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
                      </div>
                      <h4 className="text-base sm:text-lg font-black text-emerald-950 font-heading">Enrollment Confirmed!</h4>
                      <p className="text-xs text-emerald-800 font-medium">
                        Student successfully registered in official B★SEL academic records.
                      </p>
                    </div>

                    {/* Printable Receipt Card */}
                    <div id="enrollment-receipt" className="bg-white border-2 border-slate-300 rounded-2xl p-3.5 sm:p-4 space-y-3 sm:space-y-3.5 shadow-sm">
                      <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b-2 border-slate-100">
                        <div>
                          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-sky-800 block">Board of Skills & Educational Learning</span>
                          <h5 className="text-xs sm:text-sm font-black text-slate-900">Official Enrollment Slip</h5>
                        </div>
                        <span className="text-[11px] sm:text-xs font-mono font-bold bg-sky-100 text-sky-900 px-2 py-0.5 rounded">
                          {confirmationData.registrationNo}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-500 text-[10px] block">Candidate Name:</span>
                          <strong className="text-slate-900 font-bold">{confirmationData.studentName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block">Program:</span>
                          <strong className="text-slate-900 font-bold">{confirmationData.programName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block">Starting Stage:</span>
                          <strong className="text-slate-900 font-bold">{confirmationData.level}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block">Parent / Guardian:</span>
                          <strong className="text-slate-900 font-bold">{confirmationData.parentName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block">Contact Number:</span>
                          <strong className="text-slate-900 font-bold">{confirmationData.phone}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block">Institution / City:</span>
                          <strong className="text-slate-900 font-bold truncate block">{confirmationData.schoolName}, {confirmationData.city}</strong>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Transaction Reference:</span>
                          <span className="font-mono font-bold text-slate-800 text-[10px] sm:text-[11px]">{confirmationData.transactionId}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block">Amount Paid:</span>
                          <span className="font-black text-emerald-700 text-sm sm:text-base">{confirmationData.feePaid}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="w-full sm:flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 py-2.5 sm:py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-300 min-h-[42px]"
                      >
                        <Printer className="w-4 h-4 text-slate-700" />
                        <span>Print Enrollment Slip</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCloseRegister}
                        className="w-full sm:flex-1 bg-[#0F2B5C] hover:bg-[#163875] text-white py-2.5 sm:py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer min-h-[42px]"
                      >
                        <span>Done & Close</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
