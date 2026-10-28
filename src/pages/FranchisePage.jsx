import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Phone, 
  Send, 
  Check, 
  BookOpen, 
  GraduationCap, 
  Layers, 
  Compass, 
  ClipboardCheck, 
  Award, 
  Megaphone,
  UserCheck,
  Building,
  School,
  Sparkles,
  Store,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Users,
  Trophy,
  ArrowUpRight
} from 'lucide-react';
import franchiseHeroBg from '../assets/franchise-hero-bg.jpg';

/* =========================================================================
   REAL-TIME BRAND LOGOS FOR PARTNER CATEGORIES
   ========================================================================= */
const EducationProfessionalsLogo = () => (
  <svg viewBox="0 0 64 64" className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 drop-shadow-md shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ep-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1E40AF" />
        <stop offset="1" stopColor="#0F172A" />
      </linearGradient>
      <linearGradient id="ep-gold" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDE047" />
        <stop offset="1" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="ep-cap" x1="10" y1="20" x2="54" y2="35" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38BDF8" />
        <stop offset="1" stopColor="#1D4ED8" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="18" fill="url(#ep-bg)" />
    <circle cx="32" cy="32" r="27" stroke="url(#ep-gold)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
    <path d="M16 46C22 43 28 44 32 47C36 44 42 43 48 46V35C42 32 36 33 32 36C28 33 22 32 16 35V46Z" fill="#F8FAFC" />
    <path d="M32 36V47" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M32 15L14 24L32 33L50 24L32 15Z" fill="url(#ep-cap)" />
    <path d="M22 28.5V36C22 39 26.5 41.5 32 41.5C37.5 41.5 42 39 42 36V28.5L32 33.5L22 28.5Z" fill="#1E3A8A" />
    <path d="M44 26V35L42 37" stroke="url(#ep-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="42" cy="38" r="2" fill="url(#ep-gold)" />
    <polygon points="32,9 33.5,13 37,13 34,15.5 35,19 32,17 29,19 30,15.5 27,13 30.5,13" fill="url(#ep-gold)" />
  </svg>
);

const TrainersTutorsLogo = () => (
  <svg viewBox="0 0 64 64" className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 drop-shadow-md shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="tt-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop stopColor="#059669" />
        <stop offset="1" stopColor="#064E3B" />
      </linearGradient>
      <linearGradient id="tt-gold" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FBBF24" />
        <stop offset="1" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="18" fill="url(#tt-bg)" />
    <circle cx="32" cy="32" r="26" stroke="#34D399" strokeWidth="1" opacity="0.4" />
    <circle cx="32" cy="22" r="8" fill="#FDE047" />
    <path d="M19 46C19 38 24.5 34 32 34C39.5 34 45 38 45 46H19Z" fill="#E2E8F0" />
    <circle cx="44" cy="42" r="9" fill="url(#tt-gold)" />
    <path d="M41 42L43 44L47 40" stroke="#78350F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="13" y="16" width="7" height="18" rx="2" fill="#A7F3D0" />
    <circle cx="16.5" cy="21" r="1.5" fill="#047857" />
    <circle cx="16.5" cy="26" r="1.5" fill="#047857" />
    <circle cx="16.5" cy="31" r="1.5" fill="#047857" />
  </svg>
);

const ExistingLearningCentresLogo = () => (
  <svg viewBox="0 0 64 64" className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 drop-shadow-md shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="elc-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop stopColor="#EA580C" />
        <stop offset="1" stopColor="#7C2D12" />
      </linearGradient>
      <linearGradient id="elc-roof" x1="16" y1="20" x2="48" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDE047" />
        <stop offset="1" stopColor="#F97316" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="18" fill="url(#elc-bg)" />
    <rect x="18" y="24" width="28" height="26" rx="3" fill="#FFF7ED" />
    <polygon points="32,13 14,24 50,24" fill="url(#elc-roof)" />
    <line x1="32" y1="13" x2="32" y2="8" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M32 8L39 10.5L32 13V8Z" fill="#FDE047" />
    <rect x="22" y="27" width="5" height="5" rx="1" fill="#EA580C" />
    <rect x="37" y="27" width="5" height="5" rx="1" fill="#EA580C" />
    <rect x="22" y="34" width="5" height="5" rx="1" fill="#EA580C" />
    <rect x="37" y="34" width="5" height="5" rx="1" fill="#EA580C" />
    <path d="M29 50V40C29 38.5 30.5 37 32 37C33.5 37 35 38.5 35 40V50H29Z" fill="#C2410C" />
    <circle cx="33.5" cy="44" r="0.8" fill="#FEF08A" />
  </svg>
);

const EducationalInstitutionsLogo = () => (
  <svg viewBox="0 0 64 64" className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 drop-shadow-md shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ei-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop stopColor="#7E22CE" />
        <stop offset="1" stopColor="#3B0764" />
      </linearGradient>
      <linearGradient id="ei-pillar" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F3E8FF" />
        <stop offset="1" stopColor="#D8B4FE" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="18" fill="url(#ei-bg)" />
    <polygon points="32,12 16,21 48,21" fill="#FAF5FF" />
    <circle cx="32" cy="18" r="2.5" fill="#E9D5FF" stroke="#6B21A8" strokeWidth="0.8" />
    <rect x="16" y="21" width="32" height="3" rx="1" fill="#E9D5FF" />
    <rect x="18" y="24" width="4" height="20" rx="1" fill="url(#ei-pillar)" />
    <rect x="25" y="24" width="4" height="20" rx="1" fill="url(#ei-pillar)" />
    <rect x="35" y="24" width="4" height="20" rx="1" fill="url(#ei-pillar)" />
    <rect x="42" y="24" width="4" height="20" rx="1" fill="url(#ei-pillar)" />
    <rect x="14" y="44" width="36" height="3" rx="1" fill="#E9D5FF" />
    <rect x="12" y="47" width="40" height="3" rx="1" fill="#FAF5FF" />
    <circle cx="32" cy="34" r="4" fill="#FDE047" />
    <polygon points="32,31 33,33.5 35.5,33.5 33.5,35 34.5,37.5 32,36 29.5,37.5 30.5,35 28.5,33.5 31,33.5" fill="#7E22CE" />
  </svg>
);

const IndividualsSkillLogo = () => (
  <svg viewBox="0 0 64 64" className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 drop-shadow-md shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="is-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E11D48" />
        <stop offset="1" stopColor="#881337" />
      </linearGradient>
      <linearGradient id="is-star" x1="16" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDE047" />
        <stop offset="1" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="18" fill="url(#is-bg)" />
    <circle cx="32" cy="32" r="26" stroke="#FDA4AF" strokeWidth="1" strokeDasharray="4 2" opacity="0.5" />
    <path d="M32 14L35.5 26.5L48 30L35.5 33.5L32 46L28.5 33.5L16 30L28.5 26.5L32 14Z" fill="url(#is-star)" />
    <circle cx="32" cy="30" r="4.5" fill="#FFF1F2" />
    <circle cx="46" cy="18" r="2.5" fill="#FDE047" />
    <circle cx="18" cy="44" r="2" fill="#FDE047" />
    <polygon points="45,42 47,46 51,46 48,48 49,52 45,50 41,52 42,48 39,46 43,46" fill="#FDE047" />
    <path d="M20 50C25 45 39 45 44 50" stroke="#FFE4E6" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function FranchisePage({ setActivePage }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    district: '',
    state: '',
    profession: '',
    experience: '',
    interestedProgram: '',
    operatesCenter: '',
    partnershipType: '',
    message: ''
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showFullTerms, setShowFullTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState('');

  const whoCanPartner = [
    { 
      title: 'Education Professionals', 
      desc: 'School teachers, academic leaders, and educators seeking structured enrichment curricula.',
      Logo: EducationProfessionalsLogo,
      theme: {
        cardBg: 'bg-gradient-to-b from-blue-50/90 via-white to-blue-50/30',
        borderColor: 'border-2 border-blue-200 hover:border-blue-500 hover:shadow-blue-500/15',
        titleHover: 'group-hover:text-blue-950',
        accentText: 'text-blue-700',
        checkColor: 'text-blue-600',
        divider: 'border-blue-100'
      }
    },
    { 
      title: 'Trainers & Tutors', 
      desc: 'Private tutors, subject coaches, and instructors adding certified skill courses to their roster.',
      Logo: TrainersTutorsLogo,
      theme: {
        cardBg: 'bg-gradient-to-b from-emerald-50/90 via-white to-emerald-50/30',
        borderColor: 'border-2 border-emerald-200 hover:border-emerald-500 hover:shadow-emerald-500/15',
        titleHover: 'group-hover:text-emerald-950',
        accentText: 'text-emerald-700',
        checkColor: 'text-emerald-600',
        divider: 'border-emerald-100'
      }
    },
    { 
      title: 'Existing Learning Centres', 
      desc: 'Tuition centres, preschools, and hobby academies diversifying their student offerings.',
      Logo: ExistingLearningCentresLogo,
      theme: {
        cardBg: 'bg-gradient-to-b from-amber-50/90 via-white to-amber-50/30',
        borderColor: 'border-2 border-amber-300 hover:border-amber-500 hover:shadow-amber-500/15',
        titleHover: 'group-hover:text-amber-950',
        accentText: 'text-amber-800',
        checkColor: 'text-amber-600',
        divider: 'border-amber-100'
      }
    },
    { 
      title: 'Educational Institutions', 
      desc: 'K-12 schools, matriculation boards, and community institutions introducing club modules.',
      Logo: EducationalInstitutionsLogo,
      theme: {
        cardBg: 'bg-gradient-to-b from-purple-50/90 via-white to-purple-50/30',
        borderColor: 'border-2 border-purple-200 hover:border-purple-500 hover:shadow-purple-500/15',
        titleHover: 'group-hover:text-purple-950',
        accentText: 'text-purple-700',
        checkColor: 'text-purple-600',
        divider: 'border-purple-100'
      }
    },
    { 
      title: 'Individuals interested in Skill Development', 
      desc: 'Passionate homemakers, graduates, and entrepreneurs ready to launch their own learning centre.',
      Logo: IndividualsSkillLogo,
      theme: {
        cardBg: 'bg-gradient-to-b from-rose-50/90 via-white to-rose-50/30',
        borderColor: 'border-2 border-rose-200 hover:border-rose-500 hover:shadow-rose-500/15',
        titleHover: 'group-hover:text-rose-950',
        accentText: 'text-rose-700',
        checkColor: 'text-rose-600',
        divider: 'border-rose-100'
      }
    }
  ];

  const partnershipSteps = [
    { 
      step: '01', 
      name: 'Training', 
      tag: 'Faculty Certification',
      icon: GraduationCap,
      description: 'Comprehensive pedagogy training & syllabus masterclasses to certify your centre instructors.',
      highlights: ['Pedagogy Masterclasses', 'Faculty Evaluation', 'Teacher Toolkit'],
      theme: {
        cardBg: 'bg-gradient-to-b from-blue-100/75 via-blue-50/40 to-white',
        borderColor: 'border-2 border-blue-300 hover:border-blue-500 hover:shadow-blue-500/20',
        topAccent: 'border-t-4 border-t-blue-600',
        tagBg: 'text-blue-900 bg-blue-200/80 border border-blue-300',
        titleHover: 'group-hover:text-blue-950',
        accentText: 'text-blue-700',
        divider: 'border-blue-200/80'
      }
    },
    { 
      step: '02', 
      name: 'Setup', 
      tag: 'Branding & Starter Kits',
      icon: Store,
      description: 'Dispatch of student workbooks, branded flex banners, tools, and operational centre starter kits.',
      highlights: ['Classroom Banners', 'Starter Books & Tools', 'Centre Guidelines'],
      theme: {
        cardBg: 'bg-gradient-to-b from-emerald-100/75 via-emerald-50/40 to-white',
        borderColor: 'border-2 border-emerald-300 hover:border-emerald-500 hover:shadow-emerald-500/20',
        topAccent: 'border-t-4 border-t-emerald-600',
        tagBg: 'text-emerald-950 bg-emerald-200/80 border border-emerald-300',
        titleHover: 'group-hover:text-emerald-950',
        accentText: 'text-emerald-700',
        divider: 'border-emerald-200/80'
      }
    },
    { 
      step: '03', 
      name: 'Program Delivery', 
      tag: 'Classroom Delivery',
      icon: Users,
      description: 'Conducting structured weekly student batches with guided practice drills and academic mentoring.',
      highlights: ['Level-by-Level Syllabus', 'Weekly Practice Batches', 'Student Progress Logs'],
      theme: {
        cardBg: 'bg-gradient-to-b from-amber-100/85 via-amber-50/50 to-white',
        borderColor: 'border-2 border-amber-400 hover:border-amber-600 hover:shadow-amber-500/25',
        topAccent: 'border-t-4 border-t-amber-500',
        tagBg: 'text-amber-950 bg-amber-200/90 border border-amber-400',
        titleHover: 'group-hover:text-amber-950',
        accentText: 'text-amber-800',
        divider: 'border-amber-200/80'
      }
    },
    { 
      step: '04', 
      name: 'Assessment', 
      tag: 'Examinations & Competitions',
      icon: ClipboardCheck,
      description: 'Standardized level-end evaluations, question papers, and direct entry into State & National Talent Hunts.',
      highlights: ['Benchmark Test Papers', 'Level Evaluation Rubrics', 'Competition Entry'],
      theme: {
        cardBg: 'bg-gradient-to-b from-purple-100/75 via-purple-50/40 to-white',
        borderColor: 'border-2 border-purple-300 hover:border-purple-500 hover:shadow-purple-500/20',
        topAccent: 'border-t-4 border-t-purple-600',
        tagBg: 'text-purple-950 bg-purple-200/80 border border-purple-300',
        titleHover: 'group-hover:text-purple-950',
        accentText: 'text-purple-700',
        divider: 'border-purple-200/80'
      }
    },
    { 
      step: '05', 
      name: 'Certification', 
      tag: 'Official Credentials',
      icon: Award,
      description: 'Awarding tamper-evident, QR-coded B⭐SEL certificates with 24/7 digital verification backing.',
      highlights: ['QR-Coded Certificates', 'Digital Verification URL', 'Student Convocation'],
      theme: {
        cardBg: 'bg-gradient-to-b from-rose-100/75 via-rose-50/40 to-white',
        borderColor: 'border-2 border-rose-300 hover:border-rose-500 hover:shadow-rose-500/20',
        topAccent: 'border-t-4 border-t-rose-600',
        tagBg: 'text-rose-950 bg-rose-200/80 border border-rose-300',
        titleHover: 'group-hover:text-rose-950',
        accentText: 'text-rose-700',
        divider: 'border-rose-200/80'
      }
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreedToTerms) {
      alert('Please read and agree to the B★SEL Franchise Partnership Rules & Terms before submitting.');
      return;
    }

    const newRefId = `BSEL-FRN-${Math.floor(100000 + Math.random() * 900000)}`;
    setRefId(newRefId);

    try {
      const raw = localStorage.getItem('bsel_franchise_leads') || '[]';
      const existing = JSON.parse(raw);
      const lead = {
        refId: newRefId,
        ...formData,
        agreedToTerms: true,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'New Franchise Lead'
      };
      localStorage.setItem('bsel_franchise_leads', JSON.stringify([lead, ...existing]));
    } catch {
      // LocalStorage fallback
    }

    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setAgreedToTerms(false);
    setShowFullTerms(false);
    setFormData({
      name: '',
      phone: '',
      email: '',
      city: '',
      district: '',
      state: '',
      profession: '',
      experience: '',
      interestedProgram: '',
      operatesCenter: '',
      partnershipType: '',
      message: ''
    });
  };

  const scrollToApply = () => {
    const el = document.getElementById('apply-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden">
      
      {/* =========================================================================
          1. HERO SECTION: Franchise & Partnership (100% Full Viewport on Desktop)
         ========================================================================= */}
      <section className="relative bg-white text-slate-900 py-12 sm:py-20 lg:py-0 lg:min-h-[calc(100vh-80px)] flex flex-col justify-center border-b border-slate-200 overflow-hidden">
        
        {/* Background Image of Real Modern Learning Centre */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img 
            src={franchiseHeroBg} 
            alt="B⭐SEL Learning Centre" 
            className="w-full h-full object-cover object-center filter saturate-[1.2] brightness-[0.98]" 
          />
          {/* Soft white overlay to keep text 100% readable while making the background image richly visible */}
          <div className="absolute inset-0 bg-white/40 sm:bg-white/35" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-white/80" />
        </div>

        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-4 sm:space-y-6 lg:space-y-8">
            
            <p className="text-[#0F2B5C] text-xs sm:text-sm md:text-base font-black uppercase tracking-widest">
              Franchise & Partnership
            </p>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black font-heading tracking-tight text-slate-900 leading-[1.25] sm:leading-[1.15] max-w-5xl mx-auto">
              Build Your Learning Centre With{' '}
              <span className="text-[#0F2B5C] whitespace-nowrap">
                B<span className="text-amber-500">⭐</span>SEL
              </span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base lg:text-xl font-medium leading-relaxed sm:leading-loose max-w-3xl lg:max-w-4xl mx-auto px-1 sm:px-0">
              B⭐SEL provides franchise opportunities for individuals and education professionals interested in offering structured skill-development programs in their area.
            </p>

            <div className="pt-2 sm:pt-4 flex items-center justify-center w-full">
              <button
                type="button"
                onClick={scrollToApply}
                className="w-full sm:w-auto px-6 sm:px-11 py-3.5 sm:py-4.5 rounded-xl sm:rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-slate-950 font-black text-sm sm:text-lg transition-all shadow-lg hover:shadow-2xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Start Your Partnership Journey</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

          </div>
        </div>
      </section>


      {/* =========================================================================
          2. WHO CAN BECOME A PARTNER?
         ========================================================================= */}
      <section className="py-10 sm:py-16 lg:py-20 bg-white border-b border-slate-200">
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
          
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-1.5 sm:space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading text-slate-900">
              Who Can Become a Partner?
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm font-medium px-2">
              Flexible partnership pathways designed for individual tutors, institutions, and entrepreneurs
            </p>
          </div>

          <div className="w-full max-w-7xl xl:max-w-[1600px] mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-4 lg:gap-5">
              {whoCanPartner.map((item, idx) => {
                const LogoComp = item.Logo;
                const { theme } = item;
                const isLast = idx === 4;
                return (
                  <div
                    key={idx}
                    className={`${theme.cardBg} ${isLast ? 'col-span-2 lg:col-span-1' : 'col-span-1'} p-3.5 sm:p-5 lg:p-7 rounded-2xl sm:rounded-3xl ${theme.borderColor} shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group h-full`}
                  >
                    <div>
                      <div className="mb-2.5 sm:mb-4 flex items-center justify-start group-hover:scale-105 transition-transform duration-300">
                        <LogoComp />
                      </div>
                      
                      <h3 className={`text-xs sm:text-base lg:text-lg font-black text-slate-900 ${theme.titleHover} leading-snug`}>
                        {item.title}
                      </h3>

                      <p className="text-[11px] sm:text-xs text-slate-600 mt-1 sm:mt-1.5 font-medium leading-normal sm:leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div className={`pt-2.5 mt-2.5 sm:pt-3.5 sm:mt-3.5 border-t ${theme.divider} flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-bold ${theme.accentText}`}>
                      <CheckCircle2 className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${theme.checkColor} shrink-0`} />
                      <span className="truncate">Full Support Included</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
          3. PARTNERSHIP MODEL (FULL-WIDTH MULTI-COLOUR CARDS WITH REAL-TIME LOGOS)
         ========================================================================= */}
      <section className="py-10 sm:py-16 lg:py-24 bg-slate-50/70 border-b border-slate-200">
        <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-10 xl:px-12">
          
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14 space-y-2 sm:space-y-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading text-slate-900">
              Partnership Model
            </h2>
            <p className="text-slate-700 text-xs sm:text-sm lg:text-base font-medium max-w-2xl mx-auto leading-relaxed px-2">
              B⭐SEL provides the required academic and program support to help partners establish and deliver the programs effectively.
            </p>
          </div>

          {/* 5-Step Process Cards with Expanded Width, Multi-Colours & Rich Real-Time Logos */}
          <div className="w-full max-w-7xl xl:max-w-[1600px] mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-4 lg:gap-5 xl:gap-6">
              {partnershipSteps.map((stepItem, idx) => {
                const { theme } = stepItem;
                const isLast = idx === 4;
                return (
                  <div
                    key={idx}
                    className={`${theme.cardBg} ${theme.topAccent} ${isLast ? 'col-span-2 lg:col-span-1' : 'col-span-1'} p-3.5 sm:p-5 lg:p-7 rounded-2xl sm:rounded-3xl ${theme.borderColor} shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group h-full relative`}
                  >
                    <div>
                      {/* Tag pill */}
                      <div className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${theme.tagBg} inline-block px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg mb-2 sm:mb-3 shadow-2xs leading-none`}>
                        {stepItem.tag}
                      </div>

                      {/* Step Name */}
                      <h3 className={`text-xs sm:text-lg lg:text-xl font-black text-slate-900 leading-snug ${theme.titleHover}`}>
                        {stepItem.name}
                      </h3>

                      {/* Description */}
                      <p className="text-[11px] sm:text-xs text-slate-600 mt-1 sm:mt-2 font-medium leading-normal sm:leading-relaxed">
                        {stepItem.description}
                      </p>

                      {/* Highlights Pill List */}
                      <div className={`mt-2.5 pt-2.5 sm:mt-3.5 sm:pt-3.5 border-t ${theme.divider} space-y-1 sm:space-y-1.5`}>
                        {stepItem.highlights.map((hl, hlIdx) => (
                          <div key={hlIdx} className="flex items-start gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-semibold text-slate-700">
                            <CheckCircle2 className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 mt-0.5 ${theme.accentText}`} />
                            <span className="leading-tight">{hl}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
          4. FRANCHISE ENQUIRY CARD (MATCHING USER REFERENCE SCREENSHOT)
         ========================================================================= */}
      <section id="apply-form" className="py-8 sm:py-14 lg:py-20 bg-white scroll-mt-16">
        <div className="w-full max-w-[1700px] mx-auto px-3.5 sm:px-6 lg:px-12">
          
          <div className="max-w-5xl lg:max-w-6xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#0F2B5C] via-[#143B7A] to-[#1E4D99] text-white p-5 sm:p-8 lg:p-10 relative shrink-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0">
                  <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </span>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-amber-300">
                  Franchise & Institutional Partnership
                </span>
              </div>

              <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black font-heading text-white leading-tight">
                Interested in Becoming a B<span className="text-amber-400">★</span>SEL Partner?
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-sky-200 mt-1.5 leading-relaxed font-semibold max-w-4xl">
                Start your B<span className="text-amber-400">★</span>SEL partnership journey — establish an authorized learning center, school tie-up, or training academy.
              </p>
            </div>

            {/* Form Container */}
            <div className="p-3.5 sm:p-8 lg:p-12 space-y-3 sm:space-y-6 text-slate-700">
              
              {submitted ? (
                <div className="text-center py-6 sm:py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <div>
                    <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">
                      Enquiry Submitted Successfully
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-950 mt-1">
                      Thank You, {formData.name || 'Partner'}!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed max-w-md mx-auto font-medium">
                      Your franchise application has been assigned Reference ID: <strong className="font-mono text-emerald-800 font-bold">{refId}</strong>. You have agreed to B★SEL's Partner Guidelines & Code of Conduct. Our Regional Expansion Officer will contact you within 24 working hours.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2 text-left text-slate-800 font-semibold max-w-lg mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="flex justify-between border-b sm:border-b-0 pb-1 sm:pb-0">
                        <span className="text-slate-500">Applicant:</span>
                        <strong className="text-black truncate">{formData.name}</strong>
                      </div>
                      <div className="flex justify-between border-b sm:border-b-0 pb-1 sm:pb-0">
                        <span className="text-slate-500">Mobile:</span>
                        <strong className="text-black">{formData.phone}</strong>
                      </div>
                      <div className="flex justify-between border-b sm:border-b-0 pb-1 sm:pb-0">
                        <span className="text-slate-500">City / District:</span>
                        <strong className="text-black">{formData.city}, {formData.district}</strong>
                      </div>
                      <div className="flex justify-between border-b sm:border-b-0 pb-1 sm:pb-0">
                        <span className="text-slate-500">State:</span>
                        <strong className="text-black">{formData.state}</strong>
                      </div>
                      <div className="flex justify-between col-span-1 sm:col-span-2 border-t pt-1.5">
                        <span className="text-slate-500">Partnership Model:</span>
                        <strong className="text-black text-right">{formData.partnershipType || 'Authorized Franchise'}</strong>
                      </div>
                      {formData.interestedProgram && (
                        <div className="flex justify-between col-span-1 sm:col-span-2">
                          <span className="text-slate-500">Interested Program:</span>
                          <strong className="text-black text-right">{formData.interestedProgram}</strong>
                        </div>
                      )}
                      <div className="flex justify-between col-span-1 sm:col-span-2 border-t pt-1 text-emerald-800 font-bold">
                        <span>Terms & Conditions:</span>
                        <span>✓ Accepted & Agreed</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/919840012345?text=Hello%20BSEL%20Team,%20I%20have%20submitted%20my%20Franchise%20Enquiry%20(Ref:%20${refId}).`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md flex items-center justify-center gap-2"
                    >
                      <span>Connect on WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer"
                    >
                      Submit Another Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Form Subheader */}
                  <div>
                    <span className="text-xs sm:text-sm font-black text-[#F05A28] uppercase tracking-wider block">
                      Franchise Enquiry
                    </span>
                    <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 font-semibold">
                      Start your B★SEL partnership journey. Fill in your details below:
                    </p>
                  </div>

                  {/* 12-Field Form - Compact 2-Col on Mobile */}
                  <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3.5 text-xs font-bold">
                    
                    {/* Full Name & Mobile Number (2-Col on Mobile) */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                      <div>
                        <label className="block text-slate-800 text-[11px] sm:text-xs font-black mb-0.5 sm:mb-1 truncate">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-2.5 sm:px-3.5 py-2 sm:py-3 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-[#F05A28] focus:border-transparent focus:outline-hidden transition shadow-2xs text-base sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-800 text-[11px] sm:text-xs font-black mb-0.5 sm:mb-1 truncate">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-2.5 sm:px-3.5 py-2 sm:py-3 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-[#F05A28] focus:border-transparent focus:outline-hidden transition shadow-2xs text-base sm:text-sm"
                        />
                      </div>
                    </div>

                    {/* Email Address & City (2-Col on Mobile) */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                      <div>
                        <label className="block text-slate-800 text-[11px] sm:text-xs font-black mb-0.5 sm:mb-1 truncate">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-2.5 sm:px-3.5 py-2 sm:py-3 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-[#F05A28] focus:border-transparent focus:outline-hidden transition shadow-2xs text-base sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-800 text-[11px] sm:text-xs font-black mb-0.5 sm:mb-1 truncate">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-2.5 sm:px-3.5 py-2 sm:py-3 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-[#F05A28] focus:border-transparent focus:outline-hidden transition shadow-2xs text-base sm:text-sm"
                        />
                      </div>
                    </div>

                    {/* District & State (2-Col on Mobile) */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                      <div>
                        <label className="block text-slate-800 text-[11px] sm:text-xs font-black mb-0.5 sm:mb-1 truncate">
                          District *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.district}
                          onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                          className="w-full px-2.5 sm:px-3.5 py-2 sm:py-3 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-[#F05A28] focus:border-transparent focus:outline-hidden transition shadow-2xs text-base sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-800 text-[11px] sm:text-xs font-black mb-0.5 sm:mb-1 truncate">
                          State *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full px-2.5 sm:px-3.5 py-2 sm:py-3 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-[#F05A28] focus:border-transparent focus:outline-hidden transition shadow-2xs text-base sm:text-sm"
                        />
                      </div>
                    </div>

                    {/* Current Profession & Experience (2-Col on Mobile) */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                      <div>
                        <label className="block text-slate-800 text-[11px] sm:text-xs font-black mb-0.5 sm:mb-1 truncate">
                          Current Profession
                        </label>
                        <input
                          type="text"
                          value={formData.profession}
                          onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                          className="w-full px-2.5 sm:px-3.5 py-2 sm:py-3 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-[#F05A28] focus:border-transparent focus:outline-hidden transition shadow-2xs text-base sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-800 text-[11px] sm:text-xs font-black mb-0.5 sm:mb-1 truncate">
                          Experience
                        </label>
                        <input
                          type="text"
                          value={formData.experience}
                          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                          className="w-full px-2.5 sm:px-3.5 py-2 sm:py-3 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-[#F05A28] focus:border-transparent focus:outline-hidden transition shadow-2xs text-base sm:text-sm"
                        />
                      </div>
                    </div>

                    {/* Interested Program & Operates Center (2-Col on Mobile) */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                      <div>
                        <label className="block text-slate-800 text-[11px] sm:text-xs font-black mb-0.5 sm:mb-1 truncate">
                          Interested Program
                        </label>
                        <select
                          value={formData.interestedProgram}
                          onChange={(e) => setFormData({ ...formData, interestedProgram: e.target.value })}
                          className="w-full px-2 sm:px-3.5 py-2 sm:py-3 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-[#F05A28] focus:border-transparent focus:outline-hidden transition shadow-2xs text-base sm:text-sm"
                        >
                          <option value="">Choose program</option>
                          <option value="Abacus Speed Arithmetic">Abacus Speed Arithmetic</option>
                          <option value="Handwriting Excellence">Handwriting Excellence & Calligraphy</option>
                          <option value="Phonics & Early Literacy">Phonics & Early Literacy</option>
                          <option value="Drawing & Creative Art">Drawing & Creative Art</option>
                          <option value="Language Speaking">Language Speaking & Spoken English</option>
                          <option value="Athletics & Fitness">Athletics & Physical Fitness</option>
                          <option value="Dance & Classical Arts">Dance & Classical Arts</option>
                          <option value="All Programs (Multi-Skill Centre)">All Programs (Multi-Skill Centre)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-800 text-[11px] sm:text-xs font-black mb-0.5 sm:mb-1 truncate">
                          <span className="sm:hidden">Own a Centre?</span>
                          <span className="hidden sm:inline">Do you currently operate a centre?</span>
                        </label>
                        <select
                          value={formData.operatesCenter}
                          onChange={(e) => setFormData({ ...formData, operatesCenter: e.target.value })}
                          className="w-full px-2 sm:px-3.5 py-2 sm:py-3 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-[#F05A28] focus:border-transparent focus:outline-hidden transition shadow-2xs text-base sm:text-sm"
                        >
                          <option value="">Choose</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                    </div>

                    {/* Preferred Partnership Type */}
                    <div>
                      <label className="block text-slate-800 text-[11px] sm:text-xs font-black mb-0.5 sm:mb-1">
                        Preferred Partnership Type
                      </label>
                      <select
                        value={formData.partnershipType}
                        onChange={(e) => setFormData({ ...formData, partnershipType: e.target.value })}
                        className="w-full px-2.5 sm:px-3.5 py-2 sm:py-3 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-[#F05A28] focus:border-transparent focus:outline-hidden transition shadow-2xs text-base sm:text-sm"
                      >
                        <option value="">Choose a partnership type</option>
                        <option value="Authorized Learning Center Franchise">Authorized Learning Center Franchise</option>
                        <option value="School Campus In-House Skill Tie-Up">School Campus In-House Skill Tie-Up</option>
                        <option value="Teacher Training Certification (TTC)">Teacher Training Certification (TTC)</option>
                        <option value="Regional Examination / Competition Centre">Regional Examination & Competition Centre</option>
                        <option value="Individual Certified Instructor">Individual Certified Instructor</option>
                      </select>
                    </div>

                    {/* Message / Enquiry */}
                    <div>
                      <label className="block text-slate-800 text-[11px] sm:text-xs font-black mb-0.5 sm:mb-1">
                        Message / Enquiry
                      </label>
                      <textarea
                        rows="2"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-2.5 sm:px-3.5 py-2 sm:py-3 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-[#F05A28] focus:border-transparent focus:outline-hidden resize-none transition shadow-2xs text-base sm:text-sm"
                      />
                    </div>

                    {/* Rules & Guidelines (2-Col on Mobile) */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 space-y-2 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-xs font-black uppercase text-slate-900 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F05A28]" />
                          <span>Rules & Guidelines to Become a B★SEL Partner</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowFullTerms(!showFullTerms)}
                          className="text-[10px] sm:text-[11px] font-bold text-[#F05A28] hover:text-[#D9481A] flex items-center gap-0.5 cursor-pointer"
                        >
                          <span>{showFullTerms ? 'Hide' : 'Read Full Terms'}</span>
                          {showFullTerms ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-[9px] sm:text-[11px] text-slate-700">
                        <div className="flex items-start gap-1 p-1.5 sm:p-2 rounded-lg bg-white border border-slate-200 leading-tight">
                          <span className="text-emerald-600 font-black">✓</span>
                          <span><strong>Applicants:</strong> Teachers, Tutors, Academies & Schools.</span>
                        </div>
                        <div className="flex items-start gap-1 p-1.5 sm:p-2 rounded-lg bg-white border border-slate-200 leading-tight">
                          <span className="text-emerald-600 font-black">✓</span>
                          <span><strong>Space:</strong> Min 200–500 sq.ft or campus space.</span>
                        </div>
                        <div className="flex items-start gap-1 p-1.5 sm:p-2 rounded-lg bg-white border border-slate-200 leading-tight">
                          <span className="text-emerald-600 font-black">✓</span>
                          <span><strong>Training:</strong> Mandatory B★SEL TTC completion.</span>
                        </div>
                        <div className="flex items-start gap-1 p-1.5 sm:p-2 rounded-lg bg-white border border-slate-200 leading-tight">
                          <span className="text-emerald-600 font-black">✓</span>
                          <span><strong>Curriculum:</strong> Official kits & genuine materials only.</span>
                        </div>
                      </div>

                      {showFullTerms && (
                        <div className="pt-2 mt-2 border-t border-slate-200 space-y-1.5 text-[10px] sm:text-[11px] text-slate-600 font-normal leading-relaxed animate-in fade-in duration-200">
                          <h5 className="font-black text-slate-900 text-[11px] sm:text-xs uppercase tracking-wide">
                            Terms and Conditions & Code of Conduct
                          </h5>
                          <ol className="list-decimal pl-4 space-y-1 font-medium">
                            <li>
                              <strong>Territorial Authorization:</strong> Franchise rights are granted strictly for the designated city/district address and cannot be transferred without written approval from the B★SEL Central Secretariat.
                            </li>
                            <li>
                              <strong>Curriculum & Branding Standard:</strong> The partner agrees to use only official Board syllabus, standardized grade levels, registered brand marks, and genuine student kits.
                            </li>
                            <li>
                              <strong>Teacher Training Certification (TTC):</strong> All instructors must be formally trained and certified by B★SEL Master Trainers prior to commencing student batches.
                            </li>
                            <li>
                              <strong>Assessment & Certification Integrity:</strong> Level completion examinations and competitions must be conducted transparently as per board schedules with verifiable QR-coded certificates issued through central records.
                            </li>
                            <li>
                              <strong>Transparent Fee Norms:</strong> Center operators agree to uphold fair academic standards, transparent student fee guidelines, and maintain student safety and professional decorum.
                            </li>
                            <li>
                              <strong>Comprehensive Support (The B★SEL Toolkit):</strong> The Board provides ongoing academic guidance, instructor refreshers, event participation access, and promotional assistance to all authorized centers.
                            </li>
                          </ol>
                        </div>
                      )}
                    </div>

                    {/* Terms Checkbox */}
                    <div className="pt-0.5">
                      <label 
                        className={`flex items-start gap-2 p-2.5 sm:p-3 rounded-lg sm:rounded-xl border transition cursor-pointer select-none ${
                          agreedToTerms 
                            ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300' 
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          required
                          checked={agreedToTerms}
                          onChange={(e) => setAgreedToTerms(e.target.checked)}
                          className="mt-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-slate-300 text-[#F05A28] focus:ring-[#F05A28] cursor-pointer shrink-0"
                        />
                        <span className="text-[10px] sm:text-xs text-slate-800 font-bold leading-tight sm:leading-snug">
                          I agree to the <button type="button" onClick={(e) => { e.stopPropagation(); setShowFullTerms(!showFullTerms); }} className="text-[#F05A28] underline font-black hover:text-[#D9481A]">B★SEL Franchise Partnership Rules & Terms</button> and confirm quality standards. *
                        </span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-1">
                      <button
                        type="submit"
                        disabled={!agreedToTerms}
                        className={`w-full py-3 sm:py-3.5 px-5 sm:px-6 rounded-lg sm:rounded-xl text-xs sm:text-sm font-black transition cursor-pointer shadow-md flex items-center justify-center gap-2 min-h-[42px] sm:min-h-[46px] ${
                          agreedToTerms 
                            ? 'bg-[#F05A28] hover:bg-[#D9481A] active:scale-[0.99] text-white hover:shadow-lg' 
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300 shadow-none'
                        }`}
                      >
                        <span>Submit Enquiry</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </button>

                      {!agreedToTerms && (
                        <p className="text-[9px] sm:text-[11px] text-amber-800/90 text-center font-bold mt-1 flex items-center justify-center gap-1">
                          <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 shrink-0" />
                          <span>Please check the Terms & Conditions box above to enable submission.</span>
                        </p>
                      )}
                    </div>

                  </form>
                </>
              )}

            </div>

            {/* Bottom Footer Strip */}
            <div className="bg-slate-50 border-t border-slate-200 px-4 sm:px-10 py-3.5 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4 text-xs sm:text-sm text-slate-500 font-medium text-center sm:text-left">
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>ISO 9001:2015 Certified Board</span>
              </div>
              <span className="text-slate-600 font-semibold">
                Chennai Central Secretariat
              </span>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
