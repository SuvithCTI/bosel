import React, { useRef, useState } from 'react';
import {
  ArrowLeft,
  Download,
  Printer,
  Loader2,
  Calendar,
  MapPin,
  Ticket,
  Trophy,
  CheckCircle2,
} from 'lucide-react';

import { exportPdfFromElement } from '../utils/pdfExport';
import {
  getStudentPhotoUrl,
  getStudentRegisterNumber,
} from '../utils/studentDataHelpers';

export default function StudentEventRegView({ student, onClose }) {
  const cardRef = useRef(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!student) return null;

  const regNo = getStudentRegisterNumber(student);
  const studentPhoto = getStudentPhotoUrl(student);

  const cleanId =
    String(student.userId || '').replace(/\D/g, '').slice(-4) || '1042';

  const selectedEvent =
    student.events && student.events.length > 0
      ? student.events[0]
      : {
          name: `${student.program || 'Skill Development'} State Championship 2026`,
          date: '15 Nov 2026',
          status: 'Hall Ticket Issued',
          seat: 'Hall A / Bench 14',
          venue: `${student.branch || 'B★SEL Erode Center'} Examination Hall`,
        };

  const eventRollNo =
    selectedEvent.rollNo ||
    `EVT-${cleanId}-${regNo.replace(/\D/g, '') || '01'}`;

  const eventDate = selectedEvent.date || '15 Nov 2026';

  const eventVenue =
    selectedEvent.venue ||
    `${student.branch || 'B★SEL Regional Examination Centre'}, Tamil Nadu`;

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
        scale: 2.5,
      });
    } catch (err) {
      console.error('Event Pass PDF Generation failed:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        flex flex-col items-center
        overflow-y-auto overflow-x-hidden
        bg-slate-900/85
        backdrop-blur-sm
        px-2 py-2
        sm:px-4 sm:py-5
      "
    >
      <style>{`
        /* General responsive improvements */

        #printable-event-pass {
          box-sizing: border-box;
        }

        #printable-event-pass * {
          box-sizing: border-box;
        }

        @media (max-width: 640px) {
          #printable-event-pass {
            font-size: 10px;
            line-height: 1.45;
          }

          #printable-event-pass .event-header-title {
            font-size: 11px;
          }

          #printable-event-pass .event-section-label {
            font-size: 8px;
          }

          #printable-event-pass .event-student-name {
            font-size: 12px;
          }

          #printable-event-pass .event-info-value {
            font-size: 10px;
            overflow-wrap: anywhere;
          }
        }

        @media (max-width: 380px) {
          #printable-event-pass {
            padding: 10px !important;
          }

          .event-toolbar-label {
            display: none;
          }

          .event-toolbar-button {
            padding-left: 10px !important;
            padding-right: 10px !important;
          }
        }

        /* PRINT STYLES */

        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm;
          }

          html,
          body,
          #root {
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
            background: white !important;
          }

          body * {
            visibility: hidden !important;
          }

          #printable-event-pass,
          #printable-event-pass * {
            visibility: visible !important;
          }

          #printable-event-pass {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;

            display: block !important;

            width: 100% !important;
            max-width: none !important;

            height: auto !important;
            min-height: 0 !important;

            margin: 0 !important;
            padding: 6mm !important;

            border: 1px solid #581c87 !important;
            border-radius: 0 !important;

            box-shadow: none !important;
            background: white !important;

            overflow: visible !important;
            transform: none !important;

            box-sizing: border-box !important;
            color: #0f172a !important;

            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          #printable-event-pass img {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .no-print {
            display: none !important;
            visibility: hidden !important;
          }

          .print-break-inside {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      {/* TOP TOOLBAR */}
      <div
        className="
          no-print
          sticky top-0 z-30
          w-full max-w-[760px]
          shrink-0
          flex items-center justify-between
          gap-2
          rounded-xl
          border border-purple-400/40
          bg-[#2e1065]
          px-2.5 py-2
          sm:px-4 sm:py-2.5
          text-white
          shadow-xl
          mb-3 sm:mb-4
        "
      >
        <button
          type="button"
          onClick={onClose}
          className="
            event-toolbar-button
            flex shrink-0 items-center gap-1.5
            rounded-lg
            bg-white/10
            px-2.5 py-2
            text-[10px] sm:text-xs
            font-bold
            text-white
            transition
            hover:bg-white/20
            active:scale-95
            cursor-pointer
          "
        >
          <ArrowLeft className="w-4 h-4" />

          <span className="event-toolbar-label hidden sm:inline">
            Back to student list
          </span>

          <span className="sm:hidden">Back</span>
        </button>

        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">

          {/* DOWNLOAD PDF */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="
              event-toolbar-button
              flex items-center justify-center gap-1.5
              rounded-lg
              bg-amber-400
              px-2.5 py-2
              text-[10px] sm:text-xs
              font-black
              text-slate-950
              shadow-sm
              transition
              hover:bg-amber-300
              active:scale-95
              disabled:opacity-50
              cursor-pointer
            "
          >
            {isGeneratingPdf ? (
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            ) : (
              <Download className="w-4 h-4 shrink-0" />
            )}

            <span className="whitespace-nowrap">
              <span className="hidden sm:inline">
                {isGeneratingPdf ? 'Generating...' : 'Download PDF'}
              </span>
              <span className="sm:hidden">
                {isGeneratingPdf ? 'Wait...' : 'PDF'}
              </span>
            </span>
          </button>

          {/* PRINT */}
          <button
            type="button"
            onClick={handlePrint}
            className="
              event-toolbar-button
              flex items-center justify-center gap-1.5
              rounded-lg
              border border-white/20
              bg-purple-700
              px-2.5 py-2
              text-[10px] sm:text-xs
              font-black
              text-white
              transition
              hover:bg-purple-600
              active:scale-95
              cursor-pointer
            "
          >
            <Printer className="w-4 h-4 shrink-0" />

            <span className="whitespace-nowrap">
              <span className="hidden sm:inline">Print Slip</span>
              <span className="sm:hidden">Print</span>
            </span>
          </button>

        </div>
      </div>

      {/* EVENT REGISTRATION DOCUMENT */}
      <div
        id="printable-event-pass"
        ref={cardRef}
        className="
          relative
          mb-5
          w-full max-w-[760px]
          shrink-0
          rounded-sm
          border-2 border-purple-900
          bg-white
          p-3
          text-xs
          leading-normal
          text-slate-900
          shadow-2xl
          font-sans
          select-text
          sm:p-5
          md:p-8
        "
      >

        {/* HEADER */}
        <div
          className="
            flex flex-col
            items-center
            justify-between
            gap-2
            border-b-2 border-purple-900
            pb-3
            sm:flex-row
            sm:gap-3
          "
        >
          {/* LEFT LOGO */}
          <div
            className="
              flex h-12 w-12 shrink-0
              items-center justify-center
              sm:h-[72px] sm:w-[72px]
            "
          >
            <img
              src="/bsel_logo.jpg"
              alt="B★SEL Logo"
              className="h-full w-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          {/* INSTITUTION DETAILS */}
          <div className="w-full min-w-0 flex-1 text-center">

            <div
              className="
                event-header-title
                rounded-sm
                bg-[#2e1065]
                px-2 py-2
                text-[10px]
                font-extrabold
                uppercase
                tracking-wide
                text-white
                sm:px-3
                sm:text-sm
              "
            >
              BOARD OF SKILLS AND EDUCATIONAL LEARNING
            </div>

            <div
              className="
                mt-2
                text-[10px]
                font-black
                uppercase
                tracking-wide
                text-purple-900
                sm:text-sm
              "
            >
              ANNUAL STATE CHAMPIONSHIPS & COMPETITION BOARD
            </div>

            <div
              className="
                mt-1
                text-[7px]
                font-bold
                uppercase
                tracking-wider
                text-slate-500
                sm:text-[9px]
              "
            >
              OFFICIAL EVENT REGISTRATION PASS & CANDIDATE ADMIT CARD
            </div>

          </div>

          {/* RIGHT LOGO */}
          <div
            className="
              flex h-12 w-12 shrink-0
              items-center justify-center
              sm:h-[72px] sm:w-[72px]
            "
          >
            <img
              src="/rising_stars_white_bg.png"
              alt="Rising Stars"
              className="h-full w-full object-contain"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/rising_stars_original.jpg';
              }}
            />
          </div>
        </div>

        {/* COMPETITION BANNER */}
        <div
          className="
            print-break-inside
            mt-3 sm:mt-4
            flex flex-col
            items-start justify-between
            gap-2
            rounded-sm
            bg-gradient-to-r
            from-purple-900
            via-indigo-900
            to-purple-900
            p-2.5
            text-white
            sm:flex-row sm:items-center sm:p-3
          "
        >
          <div className="flex min-w-0 items-center gap-2">

            <Trophy className="h-5 w-5 shrink-0 text-amber-300" />

            <div className="min-w-0">

              <div
                className="
                  event-section-label
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-purple-200
                  sm:text-[9px]
                "
              >
                REGISTERED COMPETITION / EVENT
              </div>

              <div
                className="
                  break-words
                  text-xs
                  font-black
                  tracking-wide
                  text-white
                  sm:text-sm
                "
              >
                {selectedEvent.name}
              </div>

            </div>
          </div>

          <span
            className="
              flex shrink-0 items-center gap-1
              rounded-full
              bg-amber-400
              px-2.5 py-1
              text-[9px]
              font-black
              uppercase
              tracking-wider
              text-slate-950
              sm:text-[10px]
            "
          >
            <CheckCircle2 className="h-3 w-3 text-purple-950" />
            CONFIRMED
          </span>

        </div>

        {/* STUDENT DETAILS + PHOTO */}
        <div
          className="
            print-break-inside
            mt-3 sm:mt-4
            grid grid-cols-1
            items-start
            gap-3
            border-b border-slate-200
            pb-3 sm:gap-4 sm:pb-4
            sm:grid-cols-12
          "
        >
          {/* STUDENT INFORMATION */}
          <div
            className="
              order-2
              grid grid-cols-2
              gap-x-3 gap-y-3
              text-xs
              sm:order-1
              sm:col-span-9
              sm:gap-x-6 sm:gap-y-3
            "
          >

            <div className="min-w-0">
              <span
                className="
                  event-section-label
                  block
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-400
                  sm:text-[9px]
                "
              >
                CANDIDATE NAME
              </span>

              <strong
                className="
                  event-student-name
                  break-words
                  text-xs
                  font-bold
                  capitalize
                  text-slate-950
                  sm:text-sm
                "
              >
                {student.studentName || 'Student Name'}
              </strong>
            </div>

            <div className="min-w-0">
              <span
                className="
                  event-section-label
                  block
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-400
                  sm:text-[9px]
                "
              >
                EVENT ROLL / PASS NO
              </span>

              <span
                className="
                  event-info-value
                  break-all
                  font-mono
                  text-xs
                  font-black
                  text-purple-900
                  sm:text-sm
                "
              >
                {eventRollNo}
              </span>
            </div>

            <div className="min-w-0">
              <span
                className="
                  event-section-label
                  block
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-400
                  sm:text-[9px]
                "
              >
                REGISTRATION NUMBER
              </span>

              <span className="event-info-value break-words font-mono text-[10px] font-bold text-slate-800 sm:text-xs">
                {regNo}
              </span>
            </div>

            <div className="min-w-0">
              <span
                className="
                  event-section-label
                  block
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-400
                  sm:text-[9px]
                "
              >
                COURSE & COMPETITION LEVEL
              </span>

              <span className="event-info-value break-words text-[10px] font-bold text-amber-800 sm:text-xs">
                {student.program || student.courseName || 'Phonics & Spoken English'}
                {' • '}
                {student.grade || 'Grade 3'}
              </span>
            </div>

            <div className="min-w-0">
              <span
                className="
                  event-section-label
                  block
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-400
                  sm:text-[9px]
                "
              >
                PARENT / GUARDIAN CONTACT
              </span>

              <span className="event-info-value break-words text-[10px] font-semibold text-slate-800 sm:text-xs">
                {student.parentName || 'Guardian'}
                {' ('}
                {student.phone || '9043646417'}
                {')'}
              </span>
            </div>

            <div className="min-w-0">
              <span
                className="
                  event-section-label
                  block
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-400
                  sm:text-[9px]
                "
              >
                SPONSORING BRANCH / SCHOOL
              </span>

              <span className="event-info-value break-words text-[10px] font-bold text-slate-900 sm:text-xs">
                {student.branch || student.institution || 'B★SEL Erode Center'}
              </span>
            </div>

          </div>

          {/* STUDENT PHOTO */}
          <div
            className="
              order-1
              flex items-center justify-center gap-3
              sm:order-2
              sm:col-span-3
              sm:flex-col
            "
          >
            <div
              className="
                h-24 w-20
                overflow-hidden
                rounded-sm
                border-2 border-purple-900
                bg-slate-100
                shadow-sm
                sm:h-28 sm:w-24
              "
            >
              {studentPhoto ? (
                <img
                  src={studentPhoto}
                  alt={student.studentName || 'Student'}
                  className="h-full w-full object-cover object-top"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-black text-purple-900">
                  {(student.studentName || 'S').charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <span
              className="
                text-[8px]
                font-bold
                uppercase
                tracking-wider
                text-purple-900
                sm:mt-1 sm:text-[9px]
              "
            >
              Candidate Photo
            </span>
          </div>

        </div>

        {/* EVENT SCHEDULE AND VENUE */}
        <div
          className="
            print-break-inside
            mt-3 sm:mt-4
            grid grid-cols-1
            gap-2
            rounded-sm
            border border-purple-200
            bg-purple-50
            p-2.5
            text-xs
            sm:grid-cols-3
            sm:gap-3 sm:p-3
          "
        >

          {/* DATE */}
          <div className="flex min-w-0 items-start gap-2">

            <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-purple-700" />

            <div className="min-w-0">

              <span
                className="
                  event-section-label
                  block
                  text-[8px]
                  font-black
                  uppercase
                  tracking-wider
                  text-purple-900
                  sm:text-[9px]
                "
              >
                Event Date & Time
              </span>

              <span className="event-info-value block text-[10px] font-bold text-slate-900 sm:text-xs">
                {eventDate}
              </span>

              <span className="block text-[9px] text-slate-600 sm:text-[10px]">
                Reporting: 09:00 AM • Exam: 09:30 AM
              </span>

            </div>
          </div>

          {/* HALL */}
          <div className="flex min-w-0 items-start gap-2">

            <Ticket className="mt-0.5 h-4 w-4 shrink-0 text-purple-700" />

            <div className="min-w-0">

              <span
                className="
                  event-section-label
                  block
                  text-[8px]
                  font-black
                  uppercase
                  tracking-wider
                  text-purple-900
                  sm:text-[9px]
                "
              >
                Assigned Hall & Desk
              </span>

              <span className="event-info-value block break-words text-[10px] font-bold text-slate-900 sm:text-xs">
                {eventSeat}
              </span>

              <span className="block text-[9px] font-bold text-emerald-800 sm:text-[10px]">
                Entry Gate: Main Examination Wing
              </span>

            </div>
          </div>

          {/* VENUE */}
          <div className="flex min-w-0 items-start gap-2">

            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-purple-700" />

            <div className="min-w-0">

              <span
                className="
                  event-section-label
                  block
                  text-[8px]
                  font-black
                  uppercase
                  tracking-wider
                  text-purple-900
                  sm:text-[9px]
                "
              >
                Reporting Center Venue
              </span>

              <span className="event-info-value block break-words text-[10px] font-bold text-slate-900 sm:text-xs">
                {eventVenue}
              </span>

              <span className="block text-[9px] text-slate-600 sm:text-[10px]">
                State Examination Directorate
              </span>

            </div>
          </div>

        </div>

        {/* EXAMINATION INSTRUCTIONS */}
        <div
          className="
            print-break-inside
            mt-3 sm:mt-4
            rounded-sm
            border border-slate-300
            bg-white
            p-2.5 sm:p-3
          "
        >
          <div
            className="
              mb-2
              text-[9px]
              font-black
              uppercase
              tracking-wider
              text-purple-950
              sm:text-[10px]
            "
          >
            Official Examination Instructions
          </div>

          <ul
            className="
              list-inside
              list-disc
              space-y-1.5
              text-[9px]
              leading-relaxed
              text-slate-700
              sm:text-[10px]
            "
          >
            <li>
              Candidates must produce this printed Admit Pass along with their School/Centre ID badge at the gate.
            </li>

            <li>
              Use HB pencils and authorized standard calculation tools (e.g. Abacus tool for abacus rounds).
            </li>

            <li>
              Parents and guardians are requested to wait in designated auditorium pavilions during test hours.
            </li>

            <li>
              Official evaluation scores and State Olympiad ranks will be released on the central B★SEL portal.
            </li>
          </ul>
        </div>

        {/* VERIFICATION AND SIGNATURES */}
        <div
          className="
            print-break-inside
            mt-4 sm:mt-6
            grid grid-cols-1
            items-end
            gap-4
            border-t border-slate-200
            pt-3 sm:grid-cols-3 sm:gap-5 sm:pt-4
            text-center
          "
        >

          {/* BARCODE */}
          <div className="flex flex-col items-center">

            <div
              className="
                border border-slate-300
                bg-slate-100
                px-3 py-1
                font-mono
                text-xs
                font-bold
                tracking-widest
              "
            >
              ||| | ||||| | || ||||| ||
            </div>

            <span className="mt-1 font-mono text-[8px] text-slate-500 sm:text-[9px]">
              {eventRollNo}
            </span>

          </div>

          {/* REGIONAL HEAD */}
          <div className="flex flex-col items-center">

            <div className="flex h-6 items-end justify-center">
              <span className="font-serif text-[10px] font-bold italic text-purple-950 sm:text-xs">
                B★SEL Examination Seal
              </span>
            </div>

            <div className="mb-1 w-28 border-b-2 border-slate-400" />

            <span className="text-[8px] font-bold uppercase text-slate-500 sm:text-[9px]">
              Regional Centre Head
            </span>

          </div>

          {/* CONTROLLER */}
          <div className="flex flex-col items-center">

            <div className="flex h-6 items-end justify-center">
              <span className="font-serif text-[10px] font-bold italic text-purple-950 sm:text-xs">
                Dr. K. S. Sundaram
              </span>
            </div>

            <div className="mb-1 w-32 border-b-2 border-slate-400" />

            <span className="text-[8px] font-bold uppercase text-slate-500 sm:text-[9px]">
              Controller of Examinations
            </span>

          </div>

        </div>

        {/* FOOTER */}
        <div
          className="
            mt-3
            border-t border-slate-200
            pt-3
            text-center
            text-[7px]
            text-slate-400
            sm:mt-4 sm:text-[8px]
          "
        >
          Board of Skills and Educational Learning (B★SEL)
          {' • '}
          Central Competition Desk
          {' • '}
          www.bselskill.in
        </div>

      </div>
    </div>
  );
}