import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  FileCheck2, 
  FileText, 
  UserCheck, 
  Database, 
  Lock, 
  Eye, 
  CheckCircle2, 
  BookOpen, 
  AlertTriangle, 
  CreditCard, 
  Award, 
  Scale, 
  MapPin, 
  Phone, 
  Mail
} from 'lucide-react';

export default function LegalModal({ isOpen, onClose, initialTab = 'privacy' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overscroll-contain">
      
      {/* Backdrop Click Listener */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 overscroll-contain">
        
        {/* Sticky Header with Title and Close Button */}
        <div className="bg-[#0A1B36] text-white px-5 sm:px-8 py-4 sm:py-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs uppercase tracking-widest font-black text-amber-300">
                Official Compliance
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black font-heading text-white">
              B⭐SEL Legal Documentation
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Switcher */}
        <div className="bg-slate-100 p-2 sm:p-3 border-b border-slate-200 flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-[#0F2B5C] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${activeTab === 'privacy' ? 'text-amber-400' : 'text-slate-500'}`} />
            <span>Privacy Policy</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-[#0F2B5C] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <FileCheck2 className={`w-4 h-4 ${activeTab === 'terms' ? 'text-amber-400' : 'text-slate-500'}`} />
            <span>Terms & Conditions</span>
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-8 space-y-6 text-slate-900 selection:bg-amber-400 selection:text-slate-950">
          
          {/* =========================================================================
              TAB 1: PRIVACY POLICY
             ========================================================================= */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Summary Card */}
              <div className="bg-gradient-to-r from-[#0F2B5C] via-[#143B7A] to-[#1E4D99] rounded-2xl p-5 sm:p-7 text-white shadow-md">
                <div className="space-y-2">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-300/30">
                    BSEL-POL-PRIV-2026
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black font-heading text-white">
                    Privacy Policy & Student Data Integrity
                  </h3>
                  <p className="text-slate-100 text-xs sm:text-sm leading-relaxed">
                    Board of Skills and Educational Learning (B⭐SEL) is committed to protecting the privacy, personal records, and examination integrity of all enrolled students, partner schools, parents, and examination candidates.
                  </p>
                  <div className="pt-2 text-[11px] text-sky-200 font-semibold flex items-center gap-2">
                    <span>Last Updated: October 2026</span>
                    <span>•</span>
                    <span>Approved by Directorate</span>
                  </div>
                </div>
              </div>

              {/* Clause 1 */}
              <section className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0F2B5C] flex items-center justify-center font-black shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider block">Clause 1.0</span>
                    <h4 className="text-base sm:text-lg font-black text-slate-900">Scope and Application</h4>
                  </div>
                </div>
                <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">
                  This Privacy Policy applies to all services provided by the <strong>Board of Skills and Educational Learning (B⭐SEL)</strong>, including offline school examinations, skill talent hunts (Abacus, Drawing, Handwriting, Bharatanatyam, Spoken English, Athletics), student admission enquiry forms, digital portal logins, and verified online certificate issuances.
                </p>
              </section>

              {/* Clause 2 */}
              <section className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0F2B5C] flex items-center justify-center font-black shrink-0">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider block">Clause 2.0</span>
                    <h4 className="text-base sm:text-lg font-black text-slate-900">Information We Collect</h4>
                  </div>
                </div>
                <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">
                  When students or institutional coordinators register for courses or competitive events, B⭐SEL collects the following necessary student identification details:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm font-semibold text-slate-800">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Student Full Name, Date of Birth, Age & Standard/Grade</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Parent/Guardian Contact Number, Email & Address</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>School/Affiliated Centre Name, District, and State</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Event Registration Details, Roll Numbers & Hall Tickets</span>
                  </div>
                </div>
              </section>

              {/* Clause 3 */}
              <section className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0F2B5C] flex items-center justify-center font-black shrink-0">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider block">Clause 3.0</span>
                    <h4 className="text-base sm:text-lg font-black text-slate-900">Purpose of Data Processing</h4>
                  </div>
                </div>
                <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">
                  The collected information is used solely for academic, administrative, and certification operations:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm font-medium text-slate-700">
                  <li>Generating genuine tamper-evident B⭐SEL certificates with unique registration serial numbers.</li>
                  <li>Compiling merit rankings, score sheets, and distributing medals and awards to qualified candidates.</li>
                  <li>Sending registration receipts, exam venue instructions, and schedules via SMS, WhatsApp, and official email.</li>
                  <li>Verification of student credentials by schools, colleges, and authorized inspection authorities.</li>
                </ul>
              </section>

              {/* Clause 4 */}
              <section className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0F2B5C] flex items-center justify-center font-black shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider block">Clause 4.0</span>
                    <h4 className="text-base sm:text-lg font-black text-slate-900">No Commercial Sale of Student Data</h4>
                  </div>
                </div>
                <div className="p-3 sm:p-4 bg-emerald-50 rounded-xl border border-emerald-300 text-emerald-950 font-bold text-xs sm:text-sm">
                  <strong>Strict Guarantee:</strong> B⭐SEL strictly forbids the sale, lease, or commercial sharing of any student, school, or parent contact details to telemarketers, commercial advertisers, or third-party coaching vendors.
                </div>
              </section>

              {/* Clause 5 */}
              <section className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0F2B5C] flex items-center justify-center font-black shrink-0">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider block">Clause 5.0</span>
                    <h4 className="text-base sm:text-lg font-black text-slate-900">Data Security & Storage Standards</h4>
                  </div>
                </div>
                <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">
                  All digital student records are maintained in secure databases protected by industry-standard encryption, SSL communication protocols, and restricted administrative role-based access. Physical examination papers and evaluation rubrics are safely stored in institutional archives.
                </p>
              </section>

              {/* Clause 6 & Contact */}
              <section className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0F2B5C] flex items-center justify-center font-black shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider block">Clause 6.0</span>
                    <h4 className="text-base sm:text-lg font-black text-slate-900">Grievance Redressal & Contact Official</h4>
                  </div>
                </div>
                <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">
                  If parents, school principals, or students wish to inspect, update, or correct any academic profile records or have queries regarding this policy, please reach out to our Grievance Desk:
                </p>
                <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold text-slate-800">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#0F2B5C] shrink-0" />
                    <span>Chennai, Tamil Nadu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#0F2B5C] shrink-0" />
                    <span>+91 98400 12345</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#0F2B5C] shrink-0" />
                    <span className="truncate">privacy@besellearning.org</span>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* =========================================================================
              TAB 2: TERMS & CONDITIONS
             ========================================================================= */}
          {activeTab === 'terms' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Summary Card */}
              <div className="bg-gradient-to-r from-[#0F2B5C] via-[#143B7A] to-[#1E4D99] rounded-2xl p-5 sm:p-7 text-white shadow-md">
                <div className="space-y-2">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-300/30">
                    BSEL-TNC-REG-2026
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black font-heading text-white">
                    Terms & Conditions of Service & Examination
                  </h3>
                  <p className="text-slate-100 text-xs sm:text-sm leading-relaxed">
                    Please read these terms and conditions carefully before registering for examinations, skill programs, championships, or affiliate partnerships with the Board of Skills and Educational Learning (B⭐SEL).
                  </p>
                  <div className="pt-2 text-[11px] text-sky-200 font-semibold flex items-center gap-2">
                    <span>Effective Date: 1st January 2026</span>
                    <span>•</span>
                    <span>Enforced Nationwide</span>
                  </div>
                </div>
              </div>

              {/* Section 1 */}
              <section className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0F2B5C] flex items-center justify-center font-black shrink-0">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider block">Article 1.0</span>
                    <h4 className="text-base sm:text-lg font-black text-slate-900">Institutional Authority & Binding Acceptance</h4>
                  </div>
                </div>
                <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">
                  By submitting an online application, registering a candidate through an affiliated school or study centre, or paying exam fees, the candidate and their legal guardian agree to be bound by the bye-laws, evaluation standards, and code of conduct formulated by the <strong>Board of Skills and Educational Learning (B⭐SEL)</strong>.
                </p>
              </section>

              {/* Section 2 */}
              <section className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0F2B5C] flex items-center justify-center font-black shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider block">Article 2.0</span>
                    <h4 className="text-base sm:text-lg font-black text-slate-900">Candidate Eligibility & Enrollment Rules</h4>
                  </div>
                </div>
                <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">
                  Candidates must strictly comply with program-specific prerequisites and age criteria:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm font-semibold text-slate-800">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span><strong>Abacus & Mental Math:</strong> School students aged 5 to 14 years across Levels 1 to 8.</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span><strong>Drawing & Fine Arts:</strong> Sub-Junior, Junior, and Senior categories. Authentic original work mandatory.</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span><strong>Handwriting:</strong> Standardized ruled assessment sheets provided by B⭐SEL must be utilized.</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span><strong>Dance & Performing Arts:</strong> Traditional attire, audio tracks, and time limits compliance mandatory.</span>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0F2B5C] flex items-center justify-center font-black shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider block">Article 3.0</span>
                    <h4 className="text-base sm:text-lg font-black text-slate-900">Examination Decorum & Anti-Malpractice Rules</h4>
                  </div>
                </div>
                <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm font-medium text-slate-700">
                  <li>Candidates must report to designated examination halls at least 30 minutes prior to test commencement with a valid B⭐SEL Hall Ticket.</li>
                  <li>Calculators, unauthorized electronic gadgets, or smart devices are strictly prohibited in Abacus venues.</li>
                  <li>Any form of impersonation, copying, or plagiarism will lead to immediate candidate disqualification.</li>
                  <li>The decisions of appointed Chief Examiners, Jurors, and Evaluation Panels are final and non-negotiable.</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0F2B5C] flex items-center justify-center font-black shrink-0">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider block">Article 4.0</span>
                    <h4 className="text-base sm:text-lg font-black text-slate-900">Fee Payments & Cancellation Policy</h4>
                  </div>
                </div>
                <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">
                  Examination fees, syllabus material kits, and competition entry dues are non-refundable once the candidate hall ticket or assessment kit has been dispatched. In the event of venue rescheduling by the Board, fees will be credited toward the rescheduled examination date.
                </p>
              </section>

              {/* Section 5 */}
              <section className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0F2B5C] flex items-center justify-center font-black shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider block">Article 5.0</span>
                    <h4 className="text-base sm:text-lg font-black text-slate-900">Certification & Digital Verification Standards</h4>
                  </div>
                </div>
                <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">
                  Official B⭐SEL certificates are issued with unique alphanumeric serial numbers, embossed emblems, and verification hashes. Re-issuance of lost certificates requires written submission by the centre coordinator along with duplicate processing verification.
                </p>
              </section>

              {/* Section 6 */}
              <section className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0F2B5C] flex items-center justify-center font-black shrink-0">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider block">Article 6.0</span>
                    <h4 className="text-base sm:text-lg font-black text-slate-900">Legal Jurisdiction & Grievance Cell</h4>
                  </div>
                </div>
                <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">
                  All disputes, legal claims, or operational disagreements arising under these terms shall be subject to the exclusive jurisdiction of the competent courts of law in <strong>Chennai, Tamil Nadu, India</strong>.
                </p>
                <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold text-slate-800">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#0F2B5C] shrink-0" />
                    <span>Chennai, Tamil Nadu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#0F2B5C] shrink-0" />
                    <span>+91 98400 12345</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#0F2B5C] shrink-0" />
                    <span className="truncate">legal@besellearning.org</span>
                  </div>
                </div>
              </section>
            </div>
          )}

        </div>

        {/* Modal Bottom Action Bar */}
        <div className="bg-slate-50 px-5 sm:px-8 py-3 sm:py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Official B⭐SEL Governance & Examination Policy</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'privacy' ? 'terms' : 'privacy')}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold transition cursor-pointer text-center"
            >
              Switch to {activeTab === 'privacy' ? 'Terms & Conditions' : 'Privacy Policy'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-[#0F2B5C] hover:bg-[#153a7a] text-white font-bold transition cursor-pointer text-center"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
