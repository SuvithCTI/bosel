import React, { useState } from 'react';
import { 
  X, 
  Store, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  Building2, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  BookOpen,
  Users,
  FileText,
  Check,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';

export default function FranchiseModal({ isOpen, onClose }) {
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

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreedToTerms) {
      alert('Please read and agree to the B★SEL Franchise Partnership Rules & Terms before submitting.');
      return;
    }

    const newRefId = `BSEL-FRN-${Math.floor(100000 + Math.random() * 900000)}`;
    setRefId(newRefId);

    // Save lead to local storage so admin can view
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
      // ignore
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
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 select-none"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-2xl sm:rounded-3xl max-w-2xl sm:max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh] sm:max-h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#0F2B5C] via-[#143B7A] to-[#1E4D99] text-white p-4 sm:p-6 relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-1.5 transition cursor-pointer z-10 active:scale-95"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2 pr-8">
            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0">
              <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-amber-300 truncate">
              Franchise & Institutional Partnership
            </span>
          </div>

          <h3 className="text-lg sm:text-2xl md:text-3xl font-black font-heading text-white leading-tight">
            Interested in Becoming a B<span className="text-amber-400">★</span>SEL Partner?
          </h3>
          <p className="text-xs sm:text-sm text-sky-200 mt-1 leading-relaxed font-semibold">
            Start your B<span className="text-amber-400">★</span>SEL partnership journey — establish an authorized learning center, school tie-up, or training academy.
          </p>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-4 sm:space-y-5 text-slate-700">
          {submitted ? (
            <div className="text-center py-6 sm:py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">
                  Enquiry Submitted Successfully
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-slate-950 mt-1">
                  Thank You, {formData.name || 'Partner'}!
                </h4>
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

              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-8 bg-[#0F2B5C] hover:bg-[#18458F] text-white py-3 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer shadow-md active:scale-95"
              >
                Done & Close
              </button>
            </div>
          ) : (
            <>
              {/* Form Section Header */}
              <div>
                <span className="text-xs sm:text-sm font-black text-[#F05A28] uppercase tracking-wider block">
                  Franchise Enquiry
                </span>
                <p className="text-xs text-slate-600 mt-0.5 font-semibold">
                  Start your B★SEL partnership journey. Fill in your details below:
                </p>
              </div>

              {/* Exact 12-Field Reference Form */}
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5 text-xs font-bold">
                {/* 1. Full Name & 2. Mobile Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-800 text-[11px] sm:text-xs font-black mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-[#F05A28] focus:border-transparent focus:outline-none transition shadow-2xs text-base sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 text-[11px] sm:text-xs font-black mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-[#F05A28] focus:border-transparent focus:outline-none transition shadow-2xs text-base sm:text-sm"
                    />
                  </div>
                </div>

                {/* 3. Email Address & 4. City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-800 text-[11px] sm:text-xs font-black mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-[#F05A28] focus:border-transparent focus:outline-none transition shadow-2xs text-base sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 text-[11px] sm:text-xs font-black mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-[#F05A28] focus:border-transparent focus:outline-none transition shadow-2xs text-base sm:text-sm"
                    />
                  </div>
                </div>

                {/* 5. District & 6. State */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-800 text-[11px] sm:text-xs font-black mb-1">
                      District *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-[#F05A28] focus:border-transparent focus:outline-none transition shadow-2xs text-base sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 text-[11px] sm:text-xs font-black mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-[#F05A28] focus:border-transparent focus:outline-none transition shadow-2xs text-base sm:text-sm"
                    />
                  </div>
                </div>

                {/* 7. Current Profession & 8. Educational / Training Experience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-800 text-[11px] sm:text-xs font-black mb-1">
                      Current Profession / Occupation
                    </label>
                    <input
                      type="text"
                      value={formData.profession}
                      onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-[#F05A28] focus:border-transparent focus:outline-none transition shadow-2xs text-base sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 text-[11px] sm:text-xs font-black mb-1">
                      Educational / Training Experience
                    </label>
                    <input
                      type="text"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-[#F05A28] focus:border-transparent focus:outline-none transition shadow-2xs text-base sm:text-sm"
                    />
                  </div>
                </div>

                {/* 9. Interested Program & 10. Do you currently operate a learning centre? */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-800 text-[11px] sm:text-xs font-black mb-1">
                      Interested Program
                    </label>
                    <select
                      value={formData.interestedProgram}
                      onChange={(e) => setFormData({ ...formData, interestedProgram: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-[#F05A28] focus:border-transparent focus:outline-none transition shadow-2xs text-base sm:text-sm"
                    >
                      <option value="">Choose a program</option>
                      <option value="Abacus Speed Arithmetic">Abacus Speed Arithmetic</option>
                      <option value="Drawing & Creative Art">Drawing & Creative Art</option>
                      <option value="Handwriting Excellence">Handwriting Excellence & Calligraphy</option>
                      <option value="Language Speaking">Language Speaking & Spoken English</option>
                      <option value="Athletics & Fitness">Athletics & Physical Fitness</option>
                      <option value="Colour Management">Colour Management & Fine Arts</option>
                      <option value="Dance & Classical Arts">Dance & Classical Arts</option>
                      <option value="Phonics & Early Literacy">Phonics & Early Literacy</option>
                      <option value="All Programs (Multi-Skill Centre)">All Programs (Multi-Skill Centre)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-800 text-[11px] sm:text-xs font-black mb-1">
                      Do you currently operate a learning centre?
                    </label>
                    <select
                      value={formData.operatesCenter}
                      onChange={(e) => setFormData({ ...formData, operatesCenter: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-[#F05A28] focus:border-transparent focus:outline-none transition shadow-2xs text-base sm:text-sm"
                    >
                      <option value="">Choose an answer</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                {/* 11. Preferred Partnership Type */}
                <div>
                  <label className="block text-slate-800 text-[11px] sm:text-xs font-black mb-1">
                    Preferred Partnership Type
                  </label>
                  <select
                    value={formData.partnershipType}
                    onChange={(e) => setFormData({ ...formData, partnershipType: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-[#F05A28] focus:border-transparent focus:outline-none transition shadow-2xs text-base sm:text-sm"
                  >
                    <option value="">Choose a partnership type</option>
                    <option value="Authorized Learning Center Franchise">Authorized Learning Center Franchise</option>
                    <option value="School Campus In-House Skill Tie-Up">School Campus In-House Skill Tie-Up</option>
                    <option value="Teacher Training Certification (TTC)">Teacher Training Certification (TTC)</option>
                    <option value="Regional Examination / Competition Centre">Regional Examination & Competition Centre</option>
                    <option value="Individual Certified Instructor">Individual Certified Instructor</option>
                  </select>
                </div>

                {/* 12. Message / Enquiry */}
                <div>
                  <label className="block text-slate-800 text-[11px] sm:text-xs font-black mb-1">
                    Message / Enquiry
                  </label>
                  <textarea
                    rows="2"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-[#F05A28] focus:border-transparent focus:outline-none resize-none transition shadow-2xs text-base sm:text-sm"
                  />
                </div>

                {/* =========================================================================
                    RULES & CRITERIA TO BECOME A B★SEL FRANCHISE / PARTNER (THE B★SEL TOOLKIT)
                   ========================================================================= */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 sm:p-4 space-y-2.5 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] sm:text-xs font-black uppercase text-slate-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#F05A28]" />
                      <span>Rules & Guidelines to Become a B★SEL Partner</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowFullTerms(!showFullTerms)}
                      className="text-[10px] sm:text-[11px] font-bold text-[#F05A28] hover:text-[#D9481A] flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>{showFullTerms ? 'Hide Details' : 'Read Full Terms'}</span>
                      {showFullTerms ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Summary Rules Pills */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] sm:text-[11px] text-slate-700">
                    <div className="flex items-start gap-1.5 p-2 rounded-lg bg-white border border-slate-200">
                      <span className="text-emerald-600 font-black">✓</span>
                      <span><strong>Eligible Applicants:</strong> Teachers, Tutors, Academy Owners & Schools.</span>
                    </div>
                    <div className="flex items-start gap-1.5 p-2 rounded-lg bg-white border border-slate-200">
                      <span className="text-emerald-600 font-black">✓</span>
                      <span><strong>Infrastructure:</strong> Minimum 200–500 sq.ft or institutional campus space.</span>
                    </div>
                    <div className="flex items-start gap-1.5 p-2 rounded-lg bg-white border border-slate-200">
                      <span className="text-emerald-600 font-black">✓</span>
                      <span><strong>Instructor Training:</strong> Mandatory completion of B★SEL TTC program.</span>
                    </div>
                    <div className="flex items-start gap-1.5 p-2 rounded-lg bg-white border border-slate-200">
                      <span className="text-emerald-600 font-black">✓</span>
                      <span><strong>Curriculum Integrity:</strong> Use only official kits & authentic materials.</span>
                    </div>
                  </div>

                  {/* Expandable Detailed Terms & Conditions */}
                  {showFullTerms && (
                    <div className="pt-2.5 mt-2 border-t border-slate-200 space-y-2 text-[11px] text-slate-600 font-normal leading-relaxed animate-in fade-in duration-200">
                      <h5 className="font-black text-slate-900 text-xs uppercase tracking-wide">
                        Terms and Conditions & Code of Conduct
                      </h5>
                      <ol className="list-decimal pl-4 space-y-1.5 font-medium">
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

                {/* =========================================================================
                    MANDATORY TERMS CHECKBOX BEFORE SUBMISSION
                   ========================================================================= */}
                <div className="pt-1">
                  <label 
                    className={`flex items-start gap-2.5 p-3 rounded-xl border transition cursor-pointer select-none ${
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
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#F05A28] focus:ring-[#F05A28] cursor-pointer shrink-0"
                    />
                    <span className="text-[11px] sm:text-xs text-slate-800 font-bold leading-snug">
                      I have read, understood, and agree to the <button type="button" onClick={(e) => { e.stopPropagation(); setShowFullTerms(!showFullTerms); }} className="text-[#F05A28] underline font-black hover:text-[#D9481A]">B★SEL Franchise Partnership Rules, Terms & Conditions</button> and confirm our readiness to maintain quality training standards. *
                    </span>
                  </label>
                </div>

                {/* 13. Submit Button (Enabled Only Upon Agreeing to Terms) */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={!agreedToTerms}
                    className={`w-full py-3.5 px-6 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer shadow-md flex items-center justify-center gap-2 min-h-[46px] ${
                      agreedToTerms 
                        ? 'bg-[#F05A28] hover:bg-[#D9481A] active:scale-[0.99] text-white hover:shadow-lg' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300 shadow-none'
                    }`}
                  >
                    <span>Submit Enquiry</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>

                  {!agreedToTerms && (
                    <p className="text-[10px] sm:text-[11px] text-amber-800/90 text-center font-bold mt-1.5 flex items-center justify-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Please check the Terms & Conditions box above to enable enquiry submission.</span>
                    </p>
                  )}
                </div>
              </form>
            </>
          )}
        </div>

        {/* Footer Info */}
        <div className="bg-slate-50 px-4 sm:px-6 py-3 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 font-semibold shrink-0">
          <span className="flex items-center gap-1 text-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ISO 9001:2015 Certified Board
          </span>
          <span>Chennai Central Secretariat</span>
        </div>
      </div>
    </div>
  );
}
