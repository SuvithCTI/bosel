import React, { useRef, useState } from 'react';
import { ArrowLeft, Download, Printer, Loader2 } from 'lucide-react';
import { exportPdfFromElement } from '../utils/pdfExport';
import { getStudentPhotoUrl, getStudentRegisterNumber } from '../pages/AdminDashboard';

export default function StudentAdmissionFormView({ student, onClose }) {
  const formRef = useRef(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!student) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!formRef.current || isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    try {
      const regNo = getStudentRegisterNumber(student);
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

  const studentPhoto = getStudentPhotoUrl(student);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-start py-4 px-2 sm:px-4">
      {/* Print stylesheet override */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-admission-form, #printable-admission-form * {
            visibility: visible !important;
          }
          #printable-admission-form {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 15mm !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Top Controls Toolbar (Sticky Header) */}
      <div className="no-print w-full max-w-[860px] bg-[#0c234b] text-white px-3 sm:px-4 py-2.5 rounded-xl shadow-xl flex items-center justify-between gap-2 sm:gap-3 sticky top-2 z-30 border border-amber-400/40 mb-3">
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
            className="px-3 sm:px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 rounded-lg text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
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
            className="px-3 sm:px-3.5 py-1.5 bg-[#163e7c] hover:bg-[#1f54a6] active:scale-95 text-white rounded-lg text-xs font-black transition flex items-center gap-1.5 border border-white/20 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Canvas */}
      <div
        id="printable-admission-form"
        ref={formRef}
        className="w-full max-w-[860px] bg-white text-slate-900 shadow-2xl rounded-none border border-slate-300 p-6 sm:p-8 font-sans text-xs leading-normal select-text mb-8"
      >
        {/* Header Strip */}
        <div className="flex items-center justify-between gap-4 border-b pb-3 border-slate-200">
          {/* Left Emblem */}
          <div className="w-20 h-20 shrink-0 flex items-center justify-center">
            <img
              src="/bsel_logo.jpg"
              alt="B★SEL Logo"
              className="w-18 h-18 object-contain"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>

          {/* Center Institution Banner */}
          <div className="flex-1 text-center">
            <div className="bg-[#0c234b] text-white font-extrabold text-sm sm:text-base tracking-wider py-1.5 px-3 uppercase rounded-xs">
              BOARD OF SKILLS AND EDUCATIONAL LEARNING
            </div>
            <div className="text-red-700 font-bold text-[10.5px] mt-1 tracking-wide">
              HEAD OFFICE | TENKASI | TAMIL NADU | INDIA | 9865219131 | bsel.mindsparc@gmail.com
            </div>
            <div className="text-[8.5px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
              AN INITIATIVE OF
            </div>
            <div className="text-[#0c234b] font-black text-xs sm:text-sm tracking-widest uppercase font-serif">
              RISING STARS VISION FOUNDATION
            </div>
          </div>

          {/* Right Emblem */}
          <div className="w-20 h-20 shrink-0 flex items-center justify-center">
            <img
              src="/rising_stars_white_bg.png"
              alt="Rising Stars Vision Foundation"
              className="w-18 h-18 object-contain"
              onError={(e) => {
                e.currentTarget.src = '/rising_stars_original.jpg';
              }}
            />
          </div>
        </div>

        {/* Title Ribbon */}
        <div className="bg-[#122e60] text-white font-black text-xs sm:text-sm uppercase tracking-widest text-center py-1 rounded-xs my-2.5">
          ADMISSION FORM
        </div>

        {/* Metadata Summary Grid with Photo */}
        <div className="grid grid-cols-12 gap-4 pb-3 border-b border-slate-200 items-stretch">
          <div className="col-span-9 grid grid-cols-2 gap-x-6 gap-y-2 text-[11px]">
            <div className="border-b border-slate-100 pb-1.5 flex flex-col justify-end">
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                ADMISSION NO.
              </span>
              <span className="font-extrabold text-slate-900 font-mono text-xs">
                {getStudentRegisterNumber(student)}
              </span>
            </div>

            <div className="border-b border-slate-100 pb-1.5 flex flex-col justify-end">
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                STUDENT SERIAL NO.
              </span>
              <span className="font-extrabold text-slate-900 font-mono text-xs">
                {student.userId || student.studentSerialNo || 'BSEL27-003'}
              </span>
            </div>

            <div className="border-b border-slate-100 pb-1.5 flex flex-col justify-end">
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                DATE
              </span>
              <span className="font-bold text-slate-800">
                {student.date || student.enrolmentDate || '2026-10-09'}
              </span>
            </div>

            <div className="border-b border-slate-100 pb-1.5 flex flex-col justify-end">
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                COURSE NAME
              </span>
              <span className="font-bold text-slate-800">
                {student.program || student.courseName || 'Handwriting'}
              </span>
            </div>

            <div className="border-b border-slate-100 pb-1.5 flex flex-col justify-end">
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                STUDY CENTRE TYPE
              </span>
              <span className="font-bold text-slate-800">
                {student.studyCentreType || (student.branch?.toLowerCase().includes('school') ? 'School' : 'Academy')}
              </span>
            </div>

            <div className="border-b border-slate-100 pb-1.5 flex flex-col justify-end">
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                STUDENT AADHAAR NUMBER
              </span>
              <span className="font-bold text-slate-800 font-mono">
                {student.aadhaar || student.aadhaarNumber || 'XXXX XXXX 2323'}
              </span>
            </div>

            <div className="col-span-2 pt-1 flex flex-col justify-end">
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                SCHOOL / BRANCH
              </span>
              <span className="font-extrabold text-[#0c234b]">
                {student.branch || student.institution || 'Aim 4 Life'}
              </span>
            </div>
          </div>

          {/* Student Photo */}
          <div className="col-span-3 flex justify-end items-start pt-1">
            <div className="w-28 h-36 border-2 border-slate-300 p-0.5 bg-slate-50 rounded-xs shadow-xs overflow-hidden flex items-center justify-center">
              <img
                src={studentPhoto}
                alt={student.studentName || 'Student Photo'}
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>

        {/* SECTION 1: STUDENT DETAILS */}
        <div className="mt-3">
          <div className="bg-slate-100 px-3 py-1.5 text-[11px] font-black text-slate-800 border-l-4 border-red-600 uppercase tracking-wider">
            1. STUDENT DETAILS
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-3 p-3.5 text-[11px] border-b border-slate-100">
            <div>
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                STUDENT NAME
              </span>
              <span className="font-extrabold text-slate-900 text-xs">
                {student.studentName || student.name || 'shanju'}
              </span>
            </div>

            <div>
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                DATE OF BIRTH / AGE
              </span>
              <span className="font-bold text-slate-800">
                {student.dob ? `${student.dob} / ${student.age || '10'}` : (student.age ? `${student.age} Years` : '2016-05-28 / 10')}
              </span>
            </div>

            <div>
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                FATHER / GUARDIAN NAME
              </span>
              <span className="font-bold text-slate-800">
                {student.parentName || 'Not provided'}
              </span>
            </div>

            <div>
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                GENDER
              </span>
              <span className="font-bold text-slate-800">
                {student.gender || 'Male'}
              </span>
            </div>

            <div className="col-span-2">
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                CLASS / GRADE
              </span>
              <span className="font-bold text-slate-800">
                {student.grade || student.classGrade || 'Not provided'}
              </span>
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

            <div>
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                RELATIVE NUMBER
              </span>
              <span className="font-bold text-slate-800">
                {student.relativeNumber || 'Not provided'}
              </span>
            </div>

            <div>
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                EMAIL ADDRESS
              </span>
              <span className="font-bold text-slate-800">
                {student.email || 'Not provided'}
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
      </div>
    </div>
  );
}
