import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  Copy,
  Check,
  ArrowRight,
  Lock,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  Building2,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import { registerStudentAccount } from '../utils/authStorage';

const TAMIL_NADU_DISTRICTS = [
  'Ariyalur',
  'Chengalpattu',
  'Chennai',
  'Coimbatore',
  'Cuddalore',
  'Dharmapuri',
  'Dindigul',
  'Erode',
  'Kallakurichi',
  'Kanchipuram',
  'Kanyakumari',
  'Karur',
  'Krishnagiri',
  'Madurai',
  'Mayiladuthurai',
  'Nagapattinam',
  'Namakkal',
  'Nilgiris',
  'Perambalur',
  'Pudukkottai',
  'Ramanathapuram',
  'Ranipet',
  'Salem',
  'Sivaganga',
  'Tenkasi',
  'Thanjavur',
  'Theni',
  'Thoothukudi',
  'Tiruchirappalli (Trichy)',
  'Tirunelveli',
  'Tirupathur',
  'Tiruppur',
  'Tiruvallur',
  'Tiruvannamalai',
  'Tiruvarur',
  'Vellore',
  'Viluppuram',
  'Virudhunagar',
  'Other District / State'
];

export default function ContactPage({ setActivePage }) {
  const [formData, setFormData] = useState({
    name: '',
    parentName: '',
    email: '',
    phone: '',
    grade: '',
    program: 'Abacus Speed Arithmetic',
    district: '',
    address: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [createdAccount, setCreatedAccount] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
  const [districtSearch, setDistrictSearch] = useState('');
  const [districtError, setDistrictError] = useState(false);
  const districtDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (districtDropdownRef.current && !districtDropdownRef.current.contains(event.target)) {
        setDistrictDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredDistricts = TAMIL_NADU_DISTRICTS.filter((d) =>
    d.toLowerCase().includes(districtSearch.toLowerCase().trim())
  );

  const handleCopy = (text, fieldName) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2500);
    }
  };

  const scrollToEnquiryForm = () => {
    if (submitted) {
      setSubmitted(false);
      setCreatedAccount(null);
      setDistrictError(false);
    }
    const el = document.getElementById('admission-enquiry-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const firstInput = el.querySelector('input');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 450);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.district) {
      setDistrictError(true);
      if (districtDropdownRef.current) {
        districtDropdownRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    setDistrictError(false);
    const account = registerStudentAccount(formData);
    setCreatedAccount(account);
    setSubmitted(true);
  };

  const faqs = [
    {
      q: 'How does a school affiliate with B★SEL for Skill Development courses?',
      a: 'Schools can partner with B★SEL under our zero-upfront investment model. We provide certified trainers for Abacus, Handwriting, Phonics, and Arts, complete textbook kits, term-end grading examinations, and trophies. Simply submit the inquiry form above or call our institutional desk.'
    },
    {
      q: 'Can individual teachers or academy owners start a B★SEL Learning Center?',
      a: 'Yes! B★SEL offers authorized franchise center rights with comprehensive Teacher Training (TTC), student kits, branding materials, and access to the regional Olympiad network.'
    },
    {
      q: 'How can parents register their children directly for open state competitions?',
      a: 'Parents can view the schedule on our Events page and click "Register" on any open competition. Hall slips are issued instantly and can be printed directly.'
    },
    {
      q: 'How do students and employers verify official B★SEL certificates?',
      a: 'All certificates issued by the Board of Skills and Educational Learning contain a unique QR code and Roll ID. Certificates can also be verified by logging into our Student Portal with the Registration ID.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12">
      <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-10 space-y-10">

        {/* Banner */}
        <div className="bg-gradient-to-r from-[#0F2B5C] via-[#143B7A] to-[#1E4D99] rounded-3xl p-6 md:p-10 text-white shadow-xl">
          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl md:text-5xl font-black font-heading text-white tracking-tight">
              Contact & Affiliation Desk
            </h1>
            <p className="text-slate-200 text-sm md:text-base leading-relaxed">
              Have questions about student registrations, school partnership tie-ups, franchise academies, or upcoming state championships? Reach out to our academic team.
            </p>
          </div>
        </div>

        {/* Grid: Contact Info & Interactive Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Quick Contact Cards */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
              <h2 className="text-lg font-extrabold text-slate-900 font-heading border-b border-slate-100 pb-3">
                National Secretariat
              </h2>

              <div className="space-y-4 text-xs md:text-sm text-slate-900 font-medium">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-50 text-sky-700 shrink-0 border border-sky-100">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-slate-950 block text-sm font-extrabold">Headquarters</strong>
                    <span className="text-slate-900">Board of Skills and Educational Learning (B★SEL)<br />No. 42, Skill Tower, Gandhi Salai, T. Nagar, Chennai - 600017</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 shrink-0 border border-amber-100">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-slate-950 block text-sm font-extrabold">Phone Helpline</strong>
                    <span className="text-slate-900 font-bold">+91 9876543210</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 shrink-0 border border-emerald-100">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-slate-950 block text-sm font-extrabold">Official Email</strong>
                    <span className="text-slate-900">support@besellearning.org<br />affiliations@besellearning.org</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 shrink-0 border border-purple-100">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-slate-950 block text-sm font-extrabold">Office Timings</strong>
                    <span className="text-slate-900">Monday to Saturday: 9:00 AM - 6:30 PM<br />Sunday: Closed (Available for on-site events)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons in Gap */}
            <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-slate-200">
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                {/* 1. Franchise */}
                <a
                  href="tel:+919840012345"
                  title="Franchise (+91 98400 12345)"
                  aria-label="Franchise"
                  className="py-3 px-2 rounded-xl bg-amber-50/50 border-2 border-amber-200/80 hover:border-amber-400 hover:bg-amber-400 text-amber-800 hover:text-slate-950 transition flex flex-col items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs cursor-pointer group text-center"
                >
                  <Building2 className="w-5 h-5 group-hover:scale-110 transition-transform shrink-0" />
                  <span className="text-[11px] sm:text-xs font-black tracking-wide leading-none text-slate-800 group-hover:text-slate-950">
                    Franchise
                  </span>
                </a>

                {/* 2. Program */}
                <button
                  type="button"
                  onClick={() => {
                    if (setActivePage) {
                      setActivePage('programs');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  title="Programs"
                  aria-label="Programs"
                  className="py-3 px-2 rounded-xl bg-sky-50/50 border-2 border-sky-200/80 hover:border-sky-500 hover:bg-sky-600 text-sky-800 hover:text-white transition flex flex-col items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs cursor-pointer group text-center"
                >
                  <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform shrink-0" />
                  <span className="text-[11px] sm:text-xs font-black tracking-wide leading-none text-slate-800 group-hover:text-white">
                    Programs
                  </span>
                </button>

                {/* 3. Enquiry */}
                <button
                  type="button"
                  onClick={scrollToEnquiryForm}
                  title="Admission Enquiry"
                  aria-label="Admission Enquiry"
                  className="py-3 px-2 rounded-xl bg-emerald-50/50 border-2 border-emerald-200/80 hover:border-emerald-500 hover:bg-emerald-600 text-emerald-800 hover:text-white transition flex flex-col items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs cursor-pointer group text-center"
                >
                  <HelpCircle className="w-5 h-5 group-hover:scale-110 transition-transform shrink-0" />
                  <span className="text-[11px] sm:text-xs font-black tracking-wide leading-none text-slate-800 group-hover:text-white">
                    Enquiry
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Admission Enquiry Form */}
          <div id="admission-enquiry-form" className="lg:col-span-7 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 scroll-mt-24">
            <div className="mb-6">
              <span className="text-xs font-black text-sky-700 uppercase tracking-wider">Student Enrolment</span>
              <h2 className="text-2xl font-black font-heading text-slate-950 mt-1">
                Admission Enquiry
              </h2>
              <p className="text-xs text-slate-900 mt-1 font-semibold">
                Please fill in the student and parent details below to enquire about admissions, course batches, and center locations.
              </p>
            </div>

            {submitted && createdAccount ? (
              <div className="bg-white border-2 border-emerald-500/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-lg animate-in fade-in zoom-in-95 duration-200">
                {/* Status Header */}
                <div className="text-center space-y-2">
                  <div className="inline-flex p-3 rounded-2xl bg-emerald-100 text-emerald-700 mb-1">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <span className="inline-block text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full">
                    Enrolment & Admission Enquiry Registered
                  </span>
                  <h3 className="text-2xl font-black font-heading text-slate-950">
                    Student Account Created!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                    Admission enquiry for <strong className="text-slate-900 font-extrabold">{createdAccount.studentName}</strong> has been logged. An official login account has been generated for accessing the student portal.
                  </p>
                </div>

                {/* Important Notice */}
                <div className="bg-amber-50 border-l-4 border-amber-500 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900">
                  <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-black text-amber-950 text-xs sm:text-sm">Important: Exclusive Login Access</strong>
                    <span>You can <strong>ONLY log in using this specific User ID and Password</strong>. Please write them down or copy them now to access your results, hall tickets, and e-certificates.</span>
                  </div>
                </div>

                {/* Credentials Showcase Box */}
                <div className="bg-gradient-to-br from-[#0F2B5C] via-[#143B7A] to-[#1E4D99] rounded-2xl p-5 sm:p-6 text-white space-y-4 shadow-md">
                  <div className="flex items-center justify-between border-b border-white/15 pb-3">
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-5 h-5 text-amber-400" />
                      <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-300">
                        Your Official Portal Credentials
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(`User ID: ${createdAccount.userId}\nPassword: ${createdAccount.password}`, 'all')}
                      className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white flex items-center gap-1.5 transition cursor-pointer"
                    >
                      {copiedField === 'all' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300">Copied Both!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Both</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* User ID Box */}
                    <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl p-3.5 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-200">
                          Assigned User ID
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(createdAccount.userId, 'id')}
                          className="text-[11px] font-bold text-amber-300 hover:text-white flex items-center gap-1 transition cursor-pointer"
                        >
                          {copiedField === 'id' ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-300">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="font-mono text-base sm:text-lg font-black text-white tracking-wider">
                        {createdAccount.userId}
                      </div>
                    </div>

                    {/* Password Box */}
                    <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl p-3.5 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-200">
                          Password (Mobile Number)
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-white/70 hover:text-white transition cursor-pointer"
                            title={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopy(createdAccount.password, 'password')}
                            className="text-[11px] font-bold text-amber-300 hover:text-white flex items-center gap-1 transition cursor-pointer"
                          >
                            {copiedField === 'password' ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-300">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="font-mono text-base sm:text-lg font-black text-amber-300 tracking-wider">
                        {showPassword ? createdAccount.password : '••••••••'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enrolment Details Summary */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block">
                    Registered Details Summary
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-slate-700">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Student Name</span>
                      <strong className="text-slate-900 font-bold">{createdAccount.studentName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Enrolled Program</span>
                      <strong className="text-slate-900 font-bold">{createdAccount.program}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Class / Grade</span>
                      <strong className="text-slate-900 font-bold">{createdAccount.grade}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Parent's Name</span>
                      <strong className="text-slate-900 font-bold">{createdAccount.parentName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">District</span>
                      <strong className="text-slate-900 font-bold">{createdAccount.district || 'Not Specified'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Phone Number</span>
                      <strong className="text-slate-900 font-bold">{createdAccount.phone}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Email ID</span>
                      <strong className="text-slate-900 font-bold truncate block">{createdAccount.email}</strong>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  {setActivePage && (
                    <button
                      type="button"
                      onClick={() => setActivePage('login')}
                      className="w-full sm:flex-1 py-3 px-5 bg-[#0F2B5C] hover:bg-[#18458F] text-white text-xs sm:text-sm font-black rounded-xl transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
                    >
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span>Proceed to Student Login Portal</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setCreatedAccount(null);
                      setDistrictError(false);
                      setFormData({
                        name: '',
                        parentName: '',
                        email: '',
                        phone: '',
                        grade: '',
                        program: 'Abacus Speed Arithmetic',
                        district: '',
                        address: ''
                      });
                    }}
                    className="w-full sm:w-auto py-3 px-5 border-2 border-slate-300 text-slate-800 hover:bg-slate-100 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer"
                  >
                    Submit Another Admission Enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name & Parent's Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-black mb-1">
                      Student Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. R. Ananya"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm text-black font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-black mb-1">
                      Parent's Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. S. Ramanathan"
                      value={formData.parentName}
                      onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm text-black font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email ID & Phone Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-black mb-1">
                      Email ID *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. parent@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm text-black font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-black mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 98401 23456"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm text-black font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Grade & Program */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-black mb-1">
                      Grade / Class (Upto 14 Years) *
                    </label>
                    <select
                      required
                      value={formData.grade}
                      onChange={(e) => setFormData({...formData, grade: e.target.value})}
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm text-black font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                    >
                      <option value="">Select Grade / Class (Upto 14 Years)</option>
                      <option value="Kindergarten (Age 3 to 5)">Kindergarten (Pre-KG / LKG / UKG - Age 3 to 5 Years)</option>
                      <option value="Grade 1 (Age 5 to 6)">Grade 1 (Age 5 to 6 Years)</option>
                      <option value="Grade 2 (Age 6 to 7)">Grade 2 (Age 6 to 7 Years)</option>
                      <option value="Grade 3 (Age 7 to 8)">Grade 3 (Age 7 to 8 Years)</option>
                      <option value="Grade 4 (Age 8 to 9)">Grade 4 (Age 8 to 9 Years)</option>
                      <option value="Grade 5 (Age 9 to 10)">Grade 5 (Age 9 to 10 Years)</option>
                      <option value="Grade 6 (Age 10 to 11)">Grade 6 (Age 10 to 11 Years)</option>
                      <option value="Grade 7 (Age 11 to 12)">Grade 7 (Age 11 to 12 Years)</option>
                      <option value="Grade 8 (Age 12 to 13)">Grade 8 (Age 12 to 13 Years)</option>
                      <option value="Grade 9 (Age 13 to 14 - Upto 14 Yrs)">Grade 9 (Age 13 to 14 Years - Upto 14 Yrs)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-black mb-1">
                      Program *
                    </label>
                    <select
                      required
                      value={formData.program}
                      onChange={(e) => setFormData({...formData, program: e.target.value})}
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm text-black font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                    >
                      <option value="Abacus Speed Arithmetic">Abacus Speed Arithmetic</option>
                      <option value="Drawing & Fine Arts">Drawing & Fine Arts</option>
                      <option value="Handwriting Improvement">Handwriting Improvement</option>
                      <option value="Bharatanatyam Classical Dance">Bharatanatyam Classical Dance</option>
                      <option value="Western Dance">Western Dance</option>
                      <option value="Phonics & Spoken English">Phonics & Spoken English</option>
                      <option value="Vedic Mathematics">Vedic Mathematics</option>
                    </select>
                  </div>
                </div>

                {/* District */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative" ref={districtDropdownRef}>
                    <label className="block text-xs font-black text-black mb-1">
                      District *
                    </label>

                    {/* Trigger Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setDistrictDropdownOpen(!districtDropdownOpen);
                        setDistrictSearch('');
                        if (districtError) setDistrictError(false);
                      }}
                      className={`w-full px-3.5 py-2.5 text-base sm:text-sm font-semibold border-2 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white text-left flex items-center justify-between transition cursor-pointer ${
                        districtError ? 'border-rose-500 ring-2 ring-rose-200' : 'border-slate-300'
                      }`}
                    >
                      <span className={formData.district ? 'text-black font-semibold' : 'text-slate-400 font-normal'}>
                        {formData.district || 'Select District'}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${districtDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {districtError && (
                      <p className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1">
                        Please select a district
                      </p>
                    )}

                    {/* Small Compact Dropdown Menu */}
                    {districtDropdownOpen && (
                      <div className="absolute z-30 mt-1 w-full bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
                        {/* Quick filter search */}
                        <div className="p-2 border-b border-slate-100 bg-slate-50">
                          <input
                            type="text"
                            placeholder="Type to filter district..."
                            value={districtSearch}
                            onChange={(e) => setDistrictSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
                            autoFocus
                          />
                        </div>

                        {/* Scrollable list with small compact max-height */}
                        <div className="max-h-48 overflow-y-auto p-1 divide-y divide-slate-50">
                          {filteredDistricts.length > 0 ? (
                            filteredDistricts.map((dist) => {
                              const isSelected = formData.district === dist;
                              return (
                                <button
                                  key={dist}
                                  type="button"
                                  onClick={() => {
                                    setFormData({ ...formData, district: dist });
                                    setDistrictError(false);
                                    setDistrictDropdownOpen(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-between cursor-pointer ${
                                    isSelected
                                      ? 'bg-sky-50 text-sky-900 font-bold'
                                      : 'text-slate-700 hover:bg-slate-100'
                                  }`}
                                >
                                  <span>{dist}</span>
                                  {isSelected && <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />}
                                </button>
                              );
                            })
                          ) : (
                            <div className="p-3 text-center text-xs text-slate-400">
                              No district matching "{districtSearch}"
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-black text-black mb-1">
                    Address *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Enter complete residential address with city, state & pincode..."
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-3.5 py-2.5 text-base sm:text-sm text-black font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0F2B5C] hover:bg-[#18458F] active:scale-[0.99] text-white py-3.5 rounded-xl font-black text-sm transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Admission Enquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">Common Inquiries</span>
            <h3 className="text-2xl font-black font-heading text-slate-900 mt-1">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = expandedFaq === index;
              return (
                <div 
                  key={index}
                  className="border border-slate-200 rounded-xl overflow-hidden transition"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : index)}
                    className="w-full p-4 text-left font-bold text-xs md:text-sm text-slate-800 flex items-center justify-between gap-4 hover:bg-slate-50 transition"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-sky-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-xs md:text-sm text-slate-600 leading-relaxed bg-slate-50/50 border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
