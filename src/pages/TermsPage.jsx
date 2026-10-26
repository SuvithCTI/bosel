import React, { useEffect } from 'react';
import { 
  FileCheck2, 
  Scale, 
  Award, 
  AlertTriangle, 
  CreditCard, 
  BookOpen, 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin,
  CheckCircle2
} from 'lucide-react';

export default function TermsPage({ setActivePage }) {
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
                Terms & Conditions
              </h1>
              <p className="text-slate-100 text-sm md:text-base leading-relaxed font-medium">
                Please read these terms and conditions carefully before registering for examinations, skill programs, championships, or affiliate partnerships with the Board of Skills and Educational Learning (B★SEL).
              </p>
              <div className="pt-2 text-xs text-sky-200 font-semibold flex items-center gap-3">
                <span>Effective Date: 1st January 2026</span>
                <span>•</span>
                <span>Document ID: BSEL-TNC-REG-2026</span>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 bg-radial from-white to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Clauses List */}
        <div className="space-y-6">

          {/* Section 1 */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0F2B5C] flex items-center justify-center font-black shrink-0">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-amber-600 uppercase tracking-wider block">Article 1.0</span>
                <h2 className="text-xl font-black text-black">Institutional Authority & Binding Acceptance</h2>
              </div>
            </div>
            <p className="text-black text-sm md:text-base font-semibold leading-relaxed">
              By submitting an online application, registering a candidate through an affiliated school or study centre, or paying exam fees, the candidate and their legal guardian agree to be bound by the bye-laws, evaluation standards, and code of conduct formulated by the <strong>Board of Skills and Educational Learning (B★SEL)</strong>.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0F2B5C] flex items-center justify-center font-black shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-amber-600 uppercase tracking-wider block">Article 2.0</span>
                <h2 className="text-xl font-black text-black">Candidate Eligibility & Enrollment Rules</h2>
              </div>
            </div>
            <p className="text-black text-sm md:text-base font-semibold leading-relaxed">
              Candidates must strictly comply with program-specific prerequisites and age criteria:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-bold text-black">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                <span><strong>Abacus & Mental Arithmetic:</strong> Open to school students aged 5 to 14 years across Levels 1 through 8.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                <span><strong>Drawing & Fine Arts:</strong> Open to Sub-Junior, Junior, and Senior categories. Authentic original work mandatory.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                <span><strong>Handwriting & Calligraphy:</strong> Standardized ruled assessment sheets provided by B★SEL must be utilized.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                <span><strong>Dance & Performing Arts:</strong> Traditional attire, audio tracks, and standard time limit compliance are mandatory.</span>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0F2B5C] flex items-center justify-center font-black shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-amber-600 uppercase tracking-wider block">Article 3.0</span>
                <h2 className="text-xl font-black text-black">Examination Decorum & Anti-Malpractice Rules</h2>
              </div>
            </div>
            <ul className="list-disc pl-6 space-y-2 text-sm md:text-base font-semibold text-black">
              <li>Candidates must report to designated examination halls at least 30 minutes prior to test commencement with a valid B★SEL Hall Ticket.</li>
              <li>Calculators, unauthorized electronic gadgets, or smart devices are strictly prohibited in Abacus and Speed Mathematics venues.</li>
              <li>Any form of impersonation, copying, or plagiarism will lead to immediate candidate disqualification and notification to their parent school.</li>
              <li>The decisions of appointed Chief Examiners, Jurors, and Evaluation Panels are final and non-negotiable.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0F2B5C] flex items-center justify-center font-black shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-amber-600 uppercase tracking-wider block">Article 4.0</span>
                <h2 className="text-xl font-black text-black">Fee Payments, Kit Deliveries & Cancellation Policy</h2>
              </div>
            </div>
            <p className="text-black text-sm md:text-base font-semibold leading-relaxed">
              Examination fees, syllabus material kits, and competition entry dues are non-refundable once the candidate hall ticket or assessment kit has been dispatched. In the unforeseen event of natural calamities or unavoidable venue rescheduling by the Board, fees will be credited toward the rescheduled examination date.
            </p>
          </section>

          {/* Section 5 */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0F2B5C] flex items-center justify-center font-black shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-amber-600 uppercase tracking-wider block">Article 5.0</span>
                <h2 className="text-xl font-black text-black">Certification & Digital Verification Standards</h2>
              </div>
            </div>
            <p className="text-black text-sm md:text-base font-semibold leading-relaxed">
              Official B★SEL certificates are issued with unique alphanumeric serial numbers, embossed emblems, and verification hashes. Re-issuance of lost certificates requires written submission by the centre coordinator along with the stipulated duplicate processing charge.
            </p>
          </section>

          {/* Section 6 */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0F2B5C] flex items-center justify-center font-black shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-amber-600 uppercase tracking-wider block">Article 6.0</span>
                <h2 className="text-xl font-black text-black">Legal Jurisdiction</h2>
              </div>
            </div>
            <p className="text-black text-sm md:text-base font-semibold leading-relaxed">
              All disputes, legal claims, or operational disagreements arising under these terms shall be subject to the exclusive jurisdiction of the competent courts of law in <strong>Chennai, Tamil Nadu, India</strong>.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs md:text-sm font-bold text-black">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0F2B5C] shrink-0" />
                <span>B★SEL Legal Cell, T. Nagar, Chennai</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#0F2B5C] shrink-0" />
                <span>+91 98400 12345 / 044-2456 7890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0F2B5C] shrink-0" />
                <span>legal@besellearning.org</span>
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
