import React, { useRef, useState } from 'react';
import { ArrowLeft, Download, Printer, Loader2, Calendar, MapPin, Ticket, Trophy, CheckCircle2 } from 'lucide-react';
import { exportPdfFromElement } from '../utils/pdfExport';
import { getStudentPhotoUrl, getStudentRegisterNumber } from '../utils/studentDataHelpers';

export default function StudentEventRegView({ student, onClose }) {
  const cardRef = useRef(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!student) return null;

  const regNo = getStudentRegisterNumber(student);
  const studentPhoto = getStudentPhotoUrl(student);
  const cleanId = String(student.userId || '').replace(/\D/g, '').slice(-4) || '1042';

  // Find or generate event registration data
  const defaultEvent = (student.events && student.events.length > 0)
    ? student.events[0]
    : {
        name: `${student.program || 'Skill Development'} State Championship 2026`,
        date: '15 Nov 2026',
        status: 'Hall Ticket Issued',
        seat: 'Hall A / Bench 14',
        venue: `${student.branch || 'B★SEL Erode Center'} Examination Hall`
      };

  const [selectedEvent] = useState(defaultEvent);

  const eventRollNo = selectedEvent.rollNo || `EVT-${cleanId}-${regNo.replace(/\D/g, '') || '01'}`;
  const eventDate = selectedEvent.date || '15 Nov 2026';
  const eventVenue = selectedEvent.venue || `${student.branch || 'B★SEL Regional Examination Centre'}, Tamil Nadu`;
  const eventSeat = selectedEvent.seat || 'Hall A / Desk 08';

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!cardRef.current || isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    try {
      const filename = `${regNo}_${student.studentName || 'Student'}_Event_Registration_Slip.pdf`;
      await exportPdfFromElement(cardRef.current, {
        filename,
        orientation: 'portrait',
        margin: 8,
        backgroundColor: '#ffffff',
        scale: 2.5
      });
    } catch (err) {
      console.error('Event Pass PDF Generation failed:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-start py-4 px-2 sm:px-4">
      {/* Print stylesheet override */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-event-pass, #printable-event-pass * {
            visibility: visible !important;
          }
          #printable-event-pass {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 10mm !important;
            box-shadow: none !important;
            border: 2px solid #581c87 !important;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Top Controls Toolbar */}
      <div className="no-print w-full max-w-[760px] bg-[#2e1065] text-white px-3 sm:px-4 py-2.5 rounded-xl shadow-xl flex items-center justify-between gap-2 sm:gap-3 sticky top-2 z-30 border border-purple-400/40 mb-3">
        <button
          type="button"
          onClick={onClose}
          className="px-3 sm:px-3.5 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Back to student list</span>
          <span className="xs:hidden">Back</span>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-3 sm:px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 rounded-lg text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isGeneratingPdf ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{isGeneratingPdf ? 'Generating...' : 'Download PDF'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3 sm:px-3.5 py-1.5 bg-purple-700 hover:bg-purple-600 active:scale-95 text-white rounded-lg text-xs font-black transition flex items-center gap-1.5 border border-white/20 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Slip</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Canvas */}
      <div
        id="printable-event-pass"
        ref={cardRef}
        className="w-full max-w-[760px] bg-white text-slate-900 shadow-2xl rounded-none border-2 border-purple-900 p-6 sm:p-8 font-sans text-xs leading-normal select-text mb-8 relative"
      >
        {/* Header Strip */}
        <div className="flex items-center justify-between gap-4 border-b-2 border-purple-900 pb-3">
          <div className="w-18 h-18 shrink-0 flex items-center justify-center">
            <img
              src="/bsel_logo.jpg"
              alt="B★SEL Logo"
              className="w-16 h-16 object-contain"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>

          <div className="flex-1 text-center">
            <div className="bg-[#2e1065] text-white font-extrabold text-sm sm:text-base tracking-wider py-1 px-3 uppercase rounded-xs">
              BOARD OF SKILLS AND EDUCATIONAL LEARNING
            </div>
            <div className="text-purple-900 font-black text-xs sm:text-sm mt-1 uppercase tracking-wide">
              ANNUAL STATE CHAMPIONSHIPS & COMPETITION BOARD
            </div>
            <div className="text-[8.5px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
              OFFICIAL EVENT REGISTRATION PASS & CANDIDATE ADMIT CARD
            </div>
          </div>

          <div className="w-18 h-18 shrink-0 flex items-center justify-center">
            <img
              src="/rising_stars_white_bg.png"
              alt="Rising Stars"
              className="w-16 h-16 object-contain"
              onError={(e) => {
                e.currentTarget.src = '/rising_stars_original.jpg';
              }}
            />
          </div>
        </div>

        {/* Competition Banner */}
        <div className="mt-3 bg-linear-to-r from-purple-900 via-indigo-900 to-purple-900 text-white p-3 rounded-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-300" />
            <div>
              <div className="text-[10px] text-purple-200 uppercase font-bold tracking-wider">REGISTERED COMPETITION / EVENT</div>
              <div className="font-black text-sm text-white tracking-wide">{selectedEvent.name}</div>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-amber-400 text-slate-950 font-black text-[10px] uppercase rounded-full tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-purple-950" />
            CONFIRMED
          </span>
        </div>

        {/* Student Identification & Photo Grid */}
        <div className="mt-4 grid grid-cols-12 gap-4 pb-4 border-b border-slate-200 items-center">
          <div className="col-span-9 grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">CANDIDATE NAME</span>
              <strong className="text-slate-950 text-sm capitalize">{student.studentName || 'Student Name'}</strong>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">EVENT ROLL / PASS NO</span>
              <span className="font-mono font-black text-sm text-purple-900">{eventRollNo}</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">REGISTRATION NUMBER</span>
              <span className="font-mono font-bold text-xs text-slate-800">{regNo}</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">COURSE & COMPETITION LEVEL</span>
              <span className="font-bold text-amber-800">{student.program || student.courseName || 'Phonics & Spoken English'} • {student.grade || 'Grade 3'}</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PARENT / GUARDIAN CONTACT</span>
              <span className="font-semibold text-slate-800">{student.parentName || 'Guardian'} ({student.phone || '9043646417'})</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SPONSORING BRANCH / SCHOOL</span>
              <span className="font-bold text-slate-900">{student.branch || student.institution || 'B★SEL Erode Center'}</span>
            </div>
          </div>

          {/* Student Photo */}
          <div className="col-span-3 flex flex-col items-center justify-center">
            <div className="w-24 h-28 border-2 border-purple-900 rounded-sm overflow-hidden bg-slate-100 shadow-sm">
              <img
                src={studentPhoto}
                alt={student.studentName}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <span className="text-[9px] text-purple-900 font-bold uppercase mt-1 tracking-wider">Candidate Photo</span>
          </div>
        </div>

        {/* Examination Day Schedule & Venue Details */}
        <div className="mt-4 grid grid-cols-3 gap-3 bg-purple-50/70 border border-purple-200 rounded-xs p-3 text-xs">
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-purple-700 mt-0.5 shrink-0" />
            <div>
              <span className="text-[9.5px] font-black uppercase text-purple-900 tracking-wider block">Event Date & Time</span>
              <span className="font-bold text-slate-900 block">{eventDate}</span>
              <span className="text-[10px] text-slate-600">Reporting: 09:00 AM • Exam: 09:30 AM</span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Ticket className="w-4 h-4 text-purple-700 mt-0.5 shrink-0" />
            <div>
              <span className="text-[9.5px] font-black uppercase text-purple-900 tracking-wider block">Assigned Hall & Desk</span>
              <span className="font-bold text-slate-900 block">{eventSeat}</span>
              <span className="text-[10px] text-emerald-800 font-bold">Entry Gate: Main Examination Wing</span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-purple-700 mt-0.5 shrink-0" />
            <div>
              <span className="text-[9.5px] font-black uppercase text-purple-900 tracking-wider block">Reporting Center Venue</span>
              <span className="font-bold text-slate-900 block truncate">{eventVenue}</span>
              <span className="text-[10px] text-slate-600">State Examination Directorate</span>
            </div>
          </div>
        </div>

        {/* Candidate Rules & Instructions */}
        <div className="mt-4 border border-slate-300 rounded-xs p-3 bg-white">
          <div className="text-[10px] font-black uppercase text-purple-950 tracking-wider mb-1 flex items-center gap-1.5">
            <span>Official Examination Instructions</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-[10px] text-slate-700">
            <li>Candidates must produce this printed Admit Pass along with their School/Centre ID badge at the gate.</li>
            <li>Use HB pencils and authorized standard calculation tools (e.g. Abacus tool for abacus rounds).</li>
            <li>Parents and guardians are requested to wait in designated auditorium pavilions during test hours.</li>
            <li>Official evaluation scores and State Olympiad ranks will be released on the central B★SEL portal.</li>
          </ul>
        </div>

        {/* Verification, Barcode & Signatures */}
        <div className="mt-6 pt-4 border-t border-slate-200 grid grid-cols-3 gap-4 items-end text-center">
          <div className="flex flex-col items-center">
            <div className="font-mono text-xs tracking-widest bg-slate-100 px-3 py-1 border border-slate-300 font-bold">
              ||| | ||||| | || ||||| ||
            </div>
            <span className="font-mono text-[9px] text-slate-500 mt-0.5">{eventRollNo}</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="h-6 flex items-end justify-center">
              <span className="font-serif italic font-bold text-xs text-purple-950">B★SEL Examination Seal</span>
            </div>
            <div className="w-28 border-b-2 border-slate-400 mb-1"></div>
            <span className="text-[9px] text-slate-500 uppercase font-bold">Regional Centre Head</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="h-6 flex items-end justify-center">
              <span className="font-serif italic font-bold text-xs text-purple-950">Dr. K. S. Sundaram</span>
            </div>
            <div className="w-32 border-b-2 border-slate-400 mb-1"></div>
            <span className="text-[9px] text-slate-500 uppercase font-bold">Controller of Examinations</span>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-4 pt-2 border-t border-slate-200 text-center text-[8.5px] text-slate-400">
          Board of Skills and Educational Learning (B★SEL) • Central Competition Desk • www.bselskill.in
        </div>
      </div>
    </div>
  );
}
