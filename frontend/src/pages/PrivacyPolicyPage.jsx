import React, { useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  UserCheck, 
  Eye, 
  Database, 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin,
  CheckCircle2
} from 'lucide-react';

export default function PrivacyPolicyPage({ setActivePage }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10 md:py-16 text-black">
      <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation & Header */}
        <div>
          <button
            onClick={() => setActivePage('home')}
            className="inline-flex items-center gap-2 text-xs font-black text-[#0F2B5C] bg-white border border-slate-300 hover:bg-slate-100 px-4 py-2 rounded-xl transition shadow-sm mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="bg-gradient-to-r from-[#0F2B5C] via-[#143B7A] to-[#1E4D99] rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-3xl space-y-3">
              <h1 className="text-3xl md:text-5xl font-black font-heading text-white tracking-tight">
                Privacy Policy
              </h1>
              <p className="text-slate-100 text-sm md:text-base leading-relaxed font-medium">
                Board of Skills and Educational Learning (B★SEL) is committed to protecting the privacy, personal records, and examination integrity of all enrolled students, partner schools, parents, and examination candidates.
              </p>
              <div className="pt-2 text-xs text-sky-200 font-semibold flex items-center gap-3">
                <span>Last Updated: October 2026</span>
                <span>•</span>
                <span>Document ID: BSEL-POL-PRIV-2026</span>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 bg-radial from-white to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Core Policy Clauses */}
        <div className="space-y-6">

          {/* Clause 1 */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0F2B5C] flex items-center justify-center font-black shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-amber-600 uppercase tracking-wider block">Clause 1.0</span>
                <h2 className="text-xl font-black text-black">Scope and Application</h2>
              </div>
            </div>
            <p className="text-black text-sm md:text-base font-semibold leading-relaxed">
              This Privacy Policy applies to all services provided by the <strong>Board of Skills and Educational Learning (B★SEL)</strong>, including offline school examinations, skill talent hunts (Abacus, Drawing, Handwriting, Bharatanatyam, Western Dance, Spoken English, Athletics), student admission enquiry forms, digital portal logins, and verified online certificate issuances.
            </p>
          </section>

          {/* Clause 2 */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0F2B5C] flex items-center justify-center font-black shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-amber-600 uppercase tracking-wider block">Clause 2.0</span>
                <h2 className="text-xl font-black text-black">Information We Collect</h2>
              </div>
            </div>
            <p className="text-black text-sm md:text-base font-semibold leading-relaxed">
              When students or institutional coordinators register for courses or competitive events, B★SEL collects the following necessary student identification details:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-bold text-black">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                <span>Student Full Name, Date of Birth, Age & Standard/Grade</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                <span>Parent/Guardian Contact Number, Email & Residential Address</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                <span>School/Affiliated Centre Name, District, and State</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                <span>Event Registration Details, Roll Numbers & Hall Tickets</span>
              </div>
            </div>
          </section>

          {/* Clause 3 */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0F2B5C] flex items-center justify-center font-black shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-amber-600 uppercase tracking-wider block">Clause 3.0</span>
                <h2 className="text-xl font-black text-black">Purpose of Data Processing</h2>
              </div>
            </div>
            <p className="text-black text-sm md:text-base font-semibold leading-relaxed">
              The collected information is used solely for academic, administrative, and certification operations:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm md:text-base font-semibold text-black">
              <li>Generating genuine tamper-evident B★SEL certificates with unique registration serial numbers.</li>
              <li>Compiling merit rankings, score sheets, and distributing medals and awards to qualified candidates.</li>
              <li>Sending registration receipts, exam venue instructions, and schedules via SMS, WhatsApp, and official email.</li>
              <li>Verification of student credentials by schools, colleges, and authorized inspection authorities.</li>
            </ul>
          </section>

          {/* Clause 4 */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0F2B5C] flex items-center justify-center font-black shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-amber-600 uppercase tracking-wider block">Clause 4.0</span>
                <h2 className="text-xl font-black text-black">No Commercial Sale of Student Data</h2>
              </div>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-300 text-emerald-950 font-bold text-sm md:text-base">
              <strong>Strict Guarantee:</strong> B★SEL strictly forbids the sale, lease, or commercial sharing of any student, school, or parent contact details to telemarketers, commercial advertisers, or third-party coaching vendors.
            </div>
          </section>

          {/* Clause 5 */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0F2B5C] flex items-center justify-center font-black shrink-0">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-amber-600 uppercase tracking-wider block">Clause 5.0</span>
                <h2 className="text-xl font-black text-black">Data Security & Storage Standards</h2>
              </div>
            </div>
            <p className="text-black text-sm md:text-base font-semibold leading-relaxed">
              All digital student records are maintained in secure databases protected by industry-standard encryption, SSL communication protocols, and restricted administrative role-based access. Physical examination papers and evaluation rubrics are safely stored in institutional archives.
            </p>
          </section>

          {/* Clause 6 & Contact */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0F2B5C] flex items-center justify-center font-black shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-amber-600 uppercase tracking-wider block">Clause 6.0</span>
                <h2 className="text-xl font-black text-black">Grievance Redressal & Contact Official</h2>
              </div>
            </div>
            <p className="text-black text-sm md:text-base font-semibold leading-relaxed">
              If parents, school principals, or students wish to inspect, update, or correct any academic profile records or have queries regarding this policy, please reach out to our Grievance Desk:
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs md:text-sm font-bold text-black">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0F2B5C] shrink-0" />
                <span>B★SEL Central Bhavan, Gandhi Salai, Chennai</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#0F2B5C] shrink-0" />
                <span>+91 98400 12345 / 044-2456 7890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0F2B5C] shrink-0" />
                <span>privacy@besellearning.org</span>
              </div>
            </div>
          </section>

        </div>

        {/* Back to Home CTA */}
        <div className="text-center pt-4">
          <button
            onClick={() => setActivePage('home')}
            className="bg-[#0F2B5C] hover:bg-[#18458F] text-white font-black px-6 py-3 rounded-xl transition shadow-md inline-flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to B★SEL Home Page</span>
          </button>
        </div>

      </div>
    </div>
  );
}
