import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  Building2,
  MessageSquare,
  Store,
  GraduationCap
} from 'lucide-react';
import FranchiseModal from '../components/FranchiseModal';
import AdmissionModal from '../components/AdmissionModal';

export default function ContactPage({ setActivePage }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Enquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showFranchiseModal, setShowFranchiseModal] = useState(false);
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRefId = `BSEL-ENQ-${Math.floor(100000 + Math.random() * 900000)}`;
    setRefId(newRefId);
    try {
      const raw = localStorage.getItem('bsel_general_enquiries') || '[]';
      const existing = JSON.parse(raw);
      const enquiry = {
        refId: newRefId,
        ...formData,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'New'
      };
      localStorage.setItem('bsel_general_enquiries', JSON.stringify([enquiry, ...existing]));
    } catch {
      // ignore
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setRefId('');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'General Enquiry',
      message: ''
    });
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
                    <span className="text-slate-900">Board of Skills and Educational Learning (B★SEL)<br />No.1161 ,Muthu Pragathi Complex, South Mount Road, Tirunelveli, Town-627006</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 shrink-0 border border-amber-100">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-slate-950 block text-sm font-extrabold">Phone Helpline</strong>
                    <span className="text-slate-900 font-bold">+91 9655319131</span>
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

            {/* Quick Action Buttons */}
            <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {/* Franchise Form */}
                <button
                  type="button"
                  onClick={() => setShowFranchiseModal(true)}
                  title="Franchise Application Form"
                  aria-label="Franchise Form"
                  className="py-3 px-3 rounded-xl bg-amber-50/70 border-2 border-amber-300 hover:border-amber-500 hover:bg-amber-400 text-amber-900 hover:text-slate-950 transition flex items-center justify-center gap-2 shadow-2xs hover:shadow-xs cursor-pointer group text-center w-full"
                >
                  <Store className="w-5 h-5 group-hover:scale-110 transition-transform shrink-0 text-amber-700 group-hover:text-slate-950" />
                  <span className="text-xs sm:text-sm font-black tracking-wide leading-none text-slate-800 group-hover:text-slate-950">
                    Franchise Form
                  </span>
                </button>

                {/* Admission Form */}
                <button
                  type="button"
                  onClick={() => setShowAdmissionModal(true)}
                  title="Student Admission Form"
                  aria-label="Admission Form"
                  className="py-3 px-3 rounded-xl bg-sky-50/70 border-2 border-sky-300 hover:border-sky-500 hover:bg-[#0F2B5C] text-sky-900 hover:text-white transition flex items-center justify-center gap-2 shadow-2xs hover:shadow-xs cursor-pointer group text-center w-full"
                >
                  <GraduationCap className="w-5 h-5 group-hover:scale-110 transition-transform shrink-0 text-sky-700 group-hover:text-white" />
                  <span className="text-xs sm:text-sm font-black tracking-wide leading-none text-slate-800 group-hover:text-white">
                    Admission Form
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: General Enquiry Form */}
          <div id="general-enquiry-form" className="lg:col-span-7 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 scroll-mt-24">
            <div className="mb-6">
              <span className="text-xs font-black text-sky-700 uppercase tracking-wider">Get in Touch</span>
              <h2 className="text-2xl font-black font-heading text-slate-950 mt-1">
                General Enquiry
              </h2>
              <p className="text-xs text-slate-900 mt-1 font-semibold">
                Have questions regarding our academic programs, partner affiliations, state competitions, or center facilities? Send us your message below.
              </p>
            </div>

            {submitted ? (
              <div className="bg-white border-2 border-emerald-500/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-lg animate-in fade-in zoom-in-95 duration-200">
                {/* Status Header */}
                <div className="text-center space-y-2">
                  <div className="inline-flex p-3 rounded-2xl bg-emerald-100 text-emerald-700 mb-1">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <span className="inline-block text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full">
                    Enquiry Submitted Successfully
                  </span>
                  <h3 className="text-2xl font-black font-heading text-slate-950">
                    Thank You for Contacting B★SEL!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 max-w-lg mx-auto font-medium">
                    Your enquiry has been registered with Reference ID:{' '}
                    <strong className="font-mono text-emerald-800 font-bold text-base">{refId}</strong>.
                    Our academic support team will review your query and get back to you within 24 working hours.
                  </p>
                </div>

                {/* Summary Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2.5">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block border-b border-slate-200 pb-1.5">
                    Enquiry Details
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Name</span>
                      <strong className="text-slate-900 font-bold">{formData.name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Subject</span>
                      <strong className="text-slate-900 font-bold">{formData.subject}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Email Address</span>
                      <strong className="text-slate-900 font-bold truncate block">{formData.email}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Phone Number</span>
                      <strong className="text-slate-900 font-bold">{formData.phone}</strong>
                    </div>
                    {formData.message && (
                      <div className="sm:col-span-2">
                        <span className="text-slate-500 block text-[10px]">Message</span>
                        <p className="text-slate-800 font-medium italic mt-0.5">"{formData.message}"</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="py-3 px-6 rounded-xl bg-[#0F2B5C] hover:bg-[#18458F] text-white text-xs sm:text-sm font-black transition cursor-pointer shadow-md hover:shadow-lg"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-black text-black mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-base sm:text-sm text-black font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                {/* Email Address & Phone Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-black mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm text-black font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Subject / Purpose of Enquiry */}
                <div>
                  <label className="block text-xs font-black text-black mb-1">
                    Enquiry Subject *
                  </label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-base sm:text-sm text-black font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                  >
                    <option value="General Enquiry">General Enquiry</option>
                    <option value="Courses & Programs">Courses & Program Details (Abacus, Phonics, Art, Handwriting)</option>
                    <option value="School Affiliation / Tie-Up">School Affiliation & Partnership Tie-Up</option>
                    <option value="State & National Competitions">Competitions, Hall Tickets & Exam Centers</option>
                    <option value="Certificate Verification">Certificate Verification & Accreditation</option>
                    <option value="Franchise & Training Center">Franchise & Learning Center Authorization</option>
                    <option value="Other Assistance">Other Assistance</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-black text-black mb-1">
                    Your Message / Query *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-base sm:text-sm text-black font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0F2B5C] hover:bg-[#18458F] active:scale-[0.99] text-white py-3.5 rounded-xl font-black text-sm transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit General Enquiry</span>
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

      {/* Franchise Enquiry Popup Modal */}
      <FranchiseModal 
        isOpen={showFranchiseModal} 
        onClose={() => setShowFranchiseModal(false)} 
      />

      {/* Admission Enquiry Popup Modal */}
      <AdmissionModal 
        isOpen={showAdmissionModal} 
        onClose={() => setShowAdmissionModal(false)} 
        setActivePage={setActivePage}
      />
    </div>
  );
}
