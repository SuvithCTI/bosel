
import React, { useRef, useState } from 'react';
import {
  ArrowLeft,
  Download,
  Printer,
  Loader2
} from 'lucide-react';

import { exportPdfFromElement } from '../utils/pdfExport';

import {
  getStudentPhotoUrl,
  getStudentRegisterNumber
} from '../utils/studentDataHelpers';

export default function StudentAdmissionFormView({ student, onClose }) {
  const formRef = useRef(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!student) return null;

  const studentPhoto = getStudentPhotoUrl(student);
  const regNo = getStudentRegisterNumber(student);

  const handleDownloadPdf = async () => {
    if (!formRef.current || isGeneratingPdf) return;

    setIsGeneratingPdf(true);

    try {
      const filename = `${regNo}_${student.studentName || 'Student'}_Admission_Form.pdf`;

      await exportPdfFromElement(formRef.current, {
        filename,
        orientation: 'portrait',
        margin: 8,
        backgroundColor: '#ffffff',
        scale: 2.5
      });
    } catch (err) {
      console.error('PDF Generation failed:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const Field = ({ label, children, className = '' }) => (
    <div className={`min-w-0 ${className}`}>
      <span className="form-label">{label}</span>
      <span className="form-value">{children || 'Not provided'}</span>
    </div>
  );

  const Section = ({ title, children, className = '' }) => (
    <section className={`mt-3 ${className}`}>
      <div className="section-heading">{title}</div>
      <div className="section-content">
        {children}
      </div>
    </section>
  );

  return (
    <div
      id="admission-form-overlay"
      className="
        fixed inset-0 z-[99999]
        h-[100dvh] w-full
        overflow-y-auto overflow-x-hidden
        overscroll-contain
        bg-slate-950/85
        backdrop-blur-sm
        flex flex-col items-center
        px-2 sm:px-4
        py-2 sm:py-4
      "
      style={{
        WebkitOverflowScrolling: 'touch'
      }}
    >

      {/* ==========================================
          RESPONSIVE AND PRINT STYLES
      ========================================== */}

      <style>{`

        #admission-form-overlay {
          scrollbar-width: thin;
        }

        #admission-preview-container {
          width: 100%;
          max-width: 860px;
          margin: 0 auto;
        }

        #printable-admission-form {
          width: 100%;
          box-sizing: border-box;
          background: #ffffff;
        }

        #printable-admission-form img {
          max-width: 100%;
        }

        .form-label {
          display: block;
          font-size: 9px;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.045em;
          margin-bottom: 3px;
          line-height: 1.4;
        }

        .form-value {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: #1e293b;
          line-height: 1.5;
          overflow-wrap: anywhere;
        }

        .section-heading {
          background: #f1f5f9;
          padding: 7px 12px;
          font-size: 11px;
          font-weight: 900;
          color: #1e293b;
          border-left: 4px solid #dc2626;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .section-content {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          column-gap: 24px;
          row-gap: 13px;
          padding: 14px;
          border-bottom: 1px solid #f1f5f9;
        }

        @media screen and (max-width: 640px) {

          #admission-preview-container {
            width: 100%;
          }

          #printable-admission-form {
            padding: 13px !important;
            font-size: 10px;
            border-radius: 4px;
          }

          #printable-admission-form .admission-header-logo {
            width: 42px !important;
            height: 42px !important;
          }

          #printable-admission-form .admission-photo {
            width: 70px !important;
            height: 94px !important;
          }

          #printable-admission-form .form-label {
            font-size: 7.5px;
            margin-bottom: 2px;
          }

          #printable-admission-form .form-value {
            font-size: 9px;
            line-height: 1.4;
          }

          #printable-admission-form .section-heading {
            font-size: 9px;
            padding: 6px 8px;
          }

          #printable-admission-form .section-content {
            column-gap: 12px;
            row-gap: 10px;
            padding: 10px 7px;
          }

          #printable-admission-form .admission-header-title {
            font-size: 9px !important;
            line-height: 1.3;
          }

          #printable-admission-form .admission-header-address {
            font-size: 6px !important;
            line-height: 1.4;
          }

          #printable-admission-form .admission-foundation {
            font-size: 7px !important;
          }

          #printable-admission-form .admission-form-title {
            font-size: 10px !important;
            padding: 6px;
          }

          #printable-admission-form .signature-section {
            gap: 12px;
            padding-top: 35px;
            font-size: 8px;
          }

        }

        @media screen and (max-width: 380px) {

          #printable-admission-form {
            padding: 9px !important;
          }

          #printable-admission-form .admission-header-logo {
            width: 34px !important;
            height: 34px !important;
          }

          #printable-admission-form .form-value {
            font-size: 8px;
          }

          #printable-admission-form .form-label {
            font-size: 7px;
          }

          #printable-admission-form .section-content {
            column-gap: 8px;
            padding: 8px 5px;
          }

          #printable-admission-form .admission-photo {
            width: 62px !important;
            height: 84px !important;
          }

        }

        @media print {

          @page {
            size: A4 portrait;
            margin: 8mm;
          }

          html,
          body {
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            background: #ffffff !important;
          }

          body * {
            visibility: hidden !important;
          }

          #printable-admission-form,
          #printable-admission-form * {
            visibility: visible !important;
          }

          #admission-form-overlay {
            position: static !important;
            display: block !important;
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
            backdrop-filter: none !important;
          }

          #admission-preview-container {
            display: block !important;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
          }

          #printable-admission-form {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            display: block !important;
            width: 100% !important;
            max-width: none !important;
            height: auto !important;
            min-height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            background: white !important;
            transform: none !important;
          }

          .no-print {
            display: none !important;
            visibility: hidden !important;
          }

          img {
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }

          .section-heading,
          .bg-slate-50,
          .bg-amber-50 {
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }

        }

      `}</style>


      {/* ==========================================
          STICKY TOP TOOLBAR
      ========================================== */}

      <div
        className="
          no-print
          sticky top-0
          z-50
          w-full max-w-[860px]
          shrink-0
          bg-[#0c234b]
          text-white
          px-2.5 sm:px-4
          py-2 sm:py-2.5
          rounded-xl
          shadow-xl
          flex items-center justify-between
          gap-2
          border border-amber-400/40
          mb-3
        "
      >

        {/* BACK BUTTON */}

        <button
          type="button"
          onClick={onClose}
          className="
            px-2.5 sm:px-3.5
            py-2
            bg-white/10
            hover:bg-white/20
            active:scale-95
            text-white
            rounded-lg
            text-[10px] sm:text-xs
            font-bold
            transition
            flex items-center
            gap-1.5
            cursor-pointer
            shrink-0
          "
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />

          <span className="hidden sm:inline">
            Back to student list
          </span>

          <span className="sm:hidden">
            Back
          </span>
        </button>


        {/* ACTION BUTTONS */}

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

          {/* DOWNLOAD */}

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="
              px-2.5 sm:px-3.5
              py-2
              bg-amber-500
              hover:bg-amber-400
              active:scale-95
              text-slate-950
              rounded-lg
              text-[10px] sm:text-xs
              font-black
              transition
              flex items-center
              gap-1.5
              shadow-sm
              cursor-pointer
              disabled:opacity-50
              disabled:cursor-not-allowed
              whitespace-nowrap
            "
          >

            {isGeneratingPdf ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}

            <span>
              {isGeneratingPdf ? 'Generating...' : 'Download PDF'}
            </span>

          </button>


          {/* PRINT */}

          <button
            type="button"
            onClick={handlePrint}
            className="
              px-2.5 sm:px-3.5
              py-2
              bg-[#163e7c]
              hover:bg-[#1f54a6]
              active:scale-95
              text-white
              rounded-lg
              text-[10px] sm:text-xs
              font-black
              transition
              flex items-center
              gap-1.5
              border border-white/20
              cursor-pointer
              whitespace-nowrap
            "
          >

            <Printer className="w-3.5 h-3.5" />

            <span>Print</span>

          </button>

        </div>

      </div>


      {/* ==========================================
          ADMISSION FORM PREVIEW
      ========================================== */}

      <div
        id="admission-preview-container"
        className="relative shrink-0 pb-8"
      >

        <div
          id="printable-admission-form"
          ref={formRef}
          className="
            w-full
            max-w-[860px]
            bg-white
            text-slate-900
            shadow-2xl
            rounded-sm
            border border-slate-300
            p-5 sm:p-8
            font-sans
            text-xs
            leading-normal
            select-text
          "
        >

          {/* ======================================
              HEADER
          ====================================== */}

          <div className="
            flex items-center justify-between
            gap-2 sm:gap-4
            border-b
            pb-3
            border-slate-200
          ">

            {/* LEFT LOGO */}

            <div className="
              admission-header-logo
              w-16 sm:w-20
              h-16 sm:h-20
              shrink-0
              flex items-center justify-center
            ">

              <img
                src="/bsel_logo.jpg"
                alt="BSEL Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>


            {/* INSTITUTION DETAILS */}

            <div className="flex-1 text-center min-w-0">

              <div className="
                admission-header-title
                bg-[#0c234b]
                text-white
                font-extrabold
                text-[10px] sm:text-base
                tracking-wide
                py-1.5
                px-1 sm:px-3
                uppercase
                rounded-sm
              ">
                BOARD OF SKILLS AND EDUCATIONAL LEARNING
              </div>

              <div className="
                admission-header-address
                text-red-700
                font-bold
                text-[7px] sm:text-[10.5px]
                mt-1
                tracking-wide
              ">
                HEAD OFFICE | TENKASI | TAMIL NADU | INDIA | 9865219131 | bsel.mindsparc@gmail.com
              </div>

              <div className="
                text-[7px] sm:text-[8.5px]
                font-bold
                text-slate-500
                uppercase
                tracking-widest
                mt-0.5
              ">
                AN INITIATIVE OF
              </div>

              <div className="
                admission-foundation
                text-[#0c234b]
                font-black
                text-[9px] sm:text-sm
                tracking-wider
                uppercase
                font-serif
              ">
                RISING STARS VISION FOUNDATION
              </div>

            </div>


            {/* RIGHT LOGO */}

            <div className="
              admission-header-logo
              w-16 sm:w-20
              h-16 sm:h-20
              shrink-0
              flex items-center justify-center
            ">

              <img
                src="/rising_stars_white_bg.png"
                alt="Rising Stars Vision Foundation"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/rising_stars_original.jpg';
                }}
              />

            </div>

          </div>


          {/* ======================================
              FORM TITLE
          ====================================== */}

          <div className="
            admission-form-title
            bg-[#122e60]
            text-white
            font-black
            text-xs sm:text-sm
            uppercase
            tracking-widest
            text-center
            py-1.5
            rounded-sm
            my-2.5
          ">
            ADMISSION FORM
          </div>


          {/* ======================================
              ADMISSION SUMMARY
          ====================================== */}

          <div className="
            grid grid-cols-12
            gap-2 sm:gap-4
            pb-3
            border-b border-slate-200
            items-start
          ">

            {/* SUMMARY FIELDS */}

            <div className="
              col-span-9
              grid grid-cols-2
              gap-x-3 sm:gap-x-6
              gap-y-2
              text-[10px] sm:text-[11px]
            ">

              <Field label="ADMISSION NO.">
                <span className="font-extrabold font-mono">
                  {regNo}
                </span>
              </Field>

              <Field label="STUDENT SERIAL NO.">
                <span className="font-extrabold font-mono">
                  {student.userId || student.studentSerialNo || 'BSEL27-003'}
                </span>
              </Field>

              <Field label="DATE">
                {student.date || student.enrolmentDate || '2026-10-09'}
              </Field>

              <Field label="COURSE NAME">
                {student.program || student.courseName || 'Handwriting'}
              </Field>

              <Field label="STUDY CENTRE TYPE">
                {student.studyCentreType ||
                  (student.branch?.toLowerCase().includes('school')
                    ? 'School'
                    : 'Academy')}
              </Field>

              <Field label="STUDENT AADHAAR NUMBER">
                {student.aadhaar || student.aadhaarNumber || 'XXXX XXXX 2323'}
              </Field>

              <Field label="SCHOOL / BRANCH" className="col-span-2">
                <span className="font-extrabold text-[#0c234b]">
                  {student.branch || student.institution || 'Aim 4 Life'}
                </span>
              </Field>

            </div>


            {/* STUDENT PHOTO */}

            <div className="
              col-span-3
              flex justify-end
              items-start
              pt-1
            ">

              <div className="
                admission-photo
                w-20 sm:w-28
                h-28 sm:h-36
                border-2
                border-slate-300
                p-0.5
                bg-slate-50
                rounded-sm
                shadow-sm
                overflow-hidden
                flex items-center justify-center
              ">

                <img
                  src={studentPhoto}
                  alt={student.studentName || 'Student Photo'}
                  className="w-full h-full object-cover object-top"
                />

              </div>

            </div>

          </div>


          {/* ======================================
              SECTION 1 - STUDENT DETAILS
          ====================================== */}

          <Section title="1. STUDENT DETAILS">

            <Field label="STUDENT NAME">
              <span className="font-extrabold text-slate-900">
                {student.studentName || student.name || 'Not provided'}
              </span>
            </Field>

            <Field label="DATE OF BIRTH / AGE">
              {student.dob
                ? `${student.dob} / ${student.age || ''}`
                : student.age
                  ? `${student.age} Years`
                  : 'Not provided'}
            </Field>

            <Field label="FATHER OR MOTHER NAME">
              {student.parentName || student.fatherName || 'Not provided'}
            </Field>

            <Field label="GENDER">
              {student.gender || 'Not provided'}
            </Field>

            <Field label="CLASS / GRADE" className="col-span-2">
              {student.studentClass || student.grade || student.classGrade || 'Not provided'}
            </Field>

            {student.studentStage && (
              <div className="
                col-span-2
                bg-amber-50
                border border-amber-200
                rounded-lg
                p-2
                flex flex-wrap
                items-center justify-between
                gap-2
              ">

                <span className="
                  text-[9px]
                  font-black
                  text-amber-900
                  uppercase
                  tracking-wider
                ">
                  ACADEMIC STAGE
                </span>

                <span className="font-extrabold text-amber-950 text-[10px]">
                  At the {student.studentStage} stage
                  {student.studentClass ? ` (${student.studentClass})` : ''}
                </span>

              </div>
            )}

          </Section>


          {/* ======================================
              SECTION 2 - CONTACT INFORMATION
          ====================================== */}

          <Section title="2. CONTACT INFORMATION">

            <Field label="MOBILE NUMBER">
              <span className="font-mono">
                {student.phone || 'Not provided'}
              </span>
            </Field>

            <Field label="ALTERNATE NUMBER">
              <span className="font-mono">
                {student.alternatePhone || 'Not provided'}
              </span>
            </Field>

            <Field label="RELATIVE NUMBER">
              {student.relativeNumber || 'Not provided'}
            </Field>

            <Field label="EMAIL ADDRESS">
              {student.email || 'Not provided'}
            </Field>

          </Section>


          {/* ======================================
              SECTION 3 - PERMANENT ADDRESS
          ====================================== */}

          <Section title="3. PERMANENT ADDRESS">

            <Field label="ADDRESS" className="col-span-2">
              {student.address || 'Not provided'}
            </Field>

            <Field label="VILLAGE / CITY">
              {student.village || student.city || 'Not provided'}
            </Field>

            <Field label="DISTRICT / PIN">
              {student.district || 'Not provided'}
              {' / '}
              {student.pincode || student.pin || 'Not provided'}
            </Field>

          </Section>


          {/* ======================================
              SECTION 4 - COURSE INFORMATION
          ====================================== */}

          <Section title="4. COURSE INFORMATION">

            <Field label="COURSE DURATION">
              {student.duration || student.courseDuration || 'Not provided'}
            </Field>

            <Field label="COURSE LEVEL">
              {student.grade || student.courseLevel || 'Not provided'}
            </Field>

            <Field label="ADMISSION FEE">
              {student.feeAmount || student.admissionFee || 'Not provided'}
            </Field>

            <Field label="PAYMENT TIMING">
              {student.paymentTiming ||
                (student.feePaymentType === 'Pay Now' ||
                student.feePaymentType === 'Paid'
                  ? 'Immediate'
                  : 'Later')}
            </Field>

            <Field label="PAYMENT MODE">
              {student.paymentMode || 'Not provided'}
            </Field>

            <Field label="RECEIPT / REFERENCE NO.">
              {student.receiptRefNo || student.referenceNo || 'Not provided'}
            </Field>

            <Field label="PAYMENT SCREENSHOT">
              {student.paymentScreenshot ? 'Uploaded' : 'Not provided'}
            </Field>

            <Field label="ADDITIONAL PROGRAMS">
              {student.additionalPrograms || 'Not provided'}
            </Field>

            <Field label="OTHER PROGRAM" className="col-span-2">
              {student.otherProgram || 'Not provided'}
            </Field>

          </Section>


          {/* ======================================
              SECTION 5 - DECLARATION
          ====================================== */}

          <div className="
            mt-3
            border border-slate-300
            rounded-sm
            p-3 sm:p-3.5
            bg-slate-50/50
            text-[10px] sm:text-[11px]
            space-y-1.5
          ">

            <div className="font-extrabold text-slate-900 mb-1">
              5. DECLARATION
            </div>

            <p className="text-slate-700">
              I hereby declare that all the information provided is true and correct.
            </p>

            <p className="text-slate-700">
              I agree to abide by the institute's rules and regulations.
            </p>

            <div className="font-bold text-slate-900 pt-1.5">

              Guardian declaration:

              <span className="text-emerald-700 ml-1">
                Accepted
              </span>

            </div>

          </div>


          {/* ======================================
              OFFICE USE ONLY
          ====================================== */}

          <div className="mt-3">

            <div className="section-heading">
              FOR OFFICE USE ONLY
            </div>


            {/* SIGNATURES */}

            <div className="
              signature-section
              flex items-end justify-between
              gap-4
              pt-12
              px-2 sm:px-4
              text-[9px] sm:text-xs
            ">

              <div className="
                border-t border-slate-400
                pt-1.5
                w-40 sm:w-44
                text-center
                font-bold
                text-slate-700
              ">
                Parent / Guardian Signature
              </div>


              <div className="
                border-t border-slate-400
                pt-1.5
                w-40 sm:w-44
                text-center
                font-bold
                text-slate-700
              ">
                Approved By
              </div>

            </div>


            {/* FOOTER */}

            <div className="
              text-[8px] sm:text-[9px]
              text-slate-400
              text-right
              mt-6
              italic
              border-t border-slate-100
              pt-2
            ">

              Generated from the B★SEL admission record •{' '}
              {student.enrolmentDate ||
                new Date().toISOString().replace('T', ' ').slice(0, 19)}

            </div>

          </div>

        </div>


        {/* SECTION 2: CONTACT INFORMATION */}
        <div className="mt-3">
          <div className="bg-slate-100 px-3 py-1.5 text-[11px] font-black text-slate-800 border-l-4 border-red-600 uppercase tracking-wider">
            2. CONTACT INFORMATION
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-3 p-3.5 text-[11px] border-b border-slate-100">
            <div>
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                MOBILE NUMBER
              </span>
              <span className="font-bold text-slate-900 font-mono">
                {student.phone || '9898989898'}
              </span>
            </div>

            <div>
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                ALTERNATE NUMBER
              </span>
              <span className="font-bold text-slate-900 font-mono">
                {student.alternatePhone || student.phone || '9898989898'}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 3: PERMANENT ADDRESS */}
        <div className="mt-3">
          <div className="bg-slate-100 px-3 py-1.5 text-[11px] font-black text-slate-800 border-l-4 border-red-600 uppercase tracking-wider">
            3. PERMANENT ADDRESS
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-3 p-3.5 text-[11px] border-b border-slate-100">
            <div className="col-span-2">
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                ADDRESS
              </span>
              <span className="font-bold text-slate-800">
                {student.address || 'address sample'}
              </span>
            </div>

            <div>
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                VILLAGE / CITY
              </span>
              <span className="font-bold text-slate-800">
                {student.village || student.city || 'keelasurandai, surandai'}
              </span>
            </div>

            <div>
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                DISTRICT / PIN
              </span>
              <span className="font-bold text-slate-800">
                {student.district || 'Tenkasi'} / {student.pincode || student.pin || '627859'}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 4: COURSE INFORMATION */}
        <div className="mt-3">
          <div className="bg-slate-100 px-3 py-1.5 text-[11px] font-black text-slate-800 border-l-4 border-red-600 uppercase tracking-wider">
            4. COURSE INFORMATION
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-3 p-3.5 text-[11px] border-b border-slate-100">
            <div>
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                COURSE DURATION
              </span>
              <span className="font-bold text-slate-800">
                {student.duration || student.courseDuration || '6 Months'}
              </span>
            </div>

            <div>
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                COURSE LEVEL
              </span>
              <span className="font-bold text-slate-800">
                {student.grade || student.courseLevel || 'Level 1'}
              </span>
            </div>

            <div>
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                ADMISSION FEE
              </span>
              <span className="font-bold text-slate-800">
                {student.feeAmount || student.admissionFee || 'Not provided'}
              </span>
            </div>

            <div>
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                PAYMENT TIMING
              </span>
              <span className="font-bold text-slate-800">
                {student.paymentTiming || (student.feePaymentType === 'Pay Now' || student.feePaymentType === 'Paid' ? 'Immediate' : 'Later')}
              </span>
            </div>

            <div>
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                PAYMENT MODE
              </span>
              <span className="font-bold text-slate-800">
                {student.paymentMode || 'Not provided'}
              </span>
            </div>

            <div>
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                RECEIPT / REFERENCE NO.
              </span>
              <span className="font-bold text-slate-800 font-mono">
                {student.receiptRefNo || student.referenceNo || 'Not provided'}
              </span>
            </div>

            <div>
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                PAYMENT SCREENSHOT
              </span>
              <span className="font-bold text-slate-800">
                {student.paymentScreenshot ? 'Uploaded' : 'Not provided'}
              </span>
            </div>

            <div>
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                ADDITIONAL PROGRAMS
              </span>
              <span className="font-bold text-slate-800">
                {student.additionalPrograms || 'Other'}
              </span>
            </div>

            <div className="col-span-2">
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                OTHER PROGRAM
              </span>
              <span className="font-bold text-slate-800">
                {student.otherProgram || 'sample'}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 5: DECLARATION */}
        <div className="mt-3 border border-slate-300 rounded-xs p-3.5 bg-slate-50/50 text-[11px] space-y-1">
          <div className="font-extrabold text-slate-900 mb-1">
            5. Declaration
          </div>
          <p className="text-slate-700">
            I hereby declare that all the information provided is true and correct.
          </p>
          <p className="text-slate-700">
            I agree to abide by the institute's rules and regulations.
          </p>
          <div className="font-bold text-slate-900 pt-1.5">
            Guardian declaration: <span className="text-emerald-700">Accepted</span>
          </div>
        </div>

        {/* FOR OFFICE USE ONLY */}
        <div className="mt-3">
          <div className="bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-800 border-l-4 border-red-600 uppercase tracking-wider">
            FOR OFFICE USE ONLY
          </div>

          <div className="flex items-end justify-between pt-10 px-4 text-xs">
            <div className="border-t border-slate-400 pt-1.5 w-44 text-center font-bold text-slate-700">
              Parent / Guardian Signature
            </div>

            <div className="border-t border-slate-400 pt-1.5 w-44 text-center font-bold text-slate-700">
              Approved By
            </div>
          </div>

          <div className="text-[9px] text-slate-400 text-right mt-4 italic">
            Generated from the B★SEL admission record • {student.enrolmentDate || new Date().toISOString().replace('T', ' ').slice(0, 19)}
          </div>
        </div>
=======

      </div>

    </div>
  );
}
