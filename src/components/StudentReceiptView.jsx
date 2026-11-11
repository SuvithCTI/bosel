
import React, { useRef, useState } from 'react';
import {
  ArrowLeft,
  Download,
  Printer,
  Loader2
} from 'lucide-react';

import { exportPdfFromElement } from '../utils/pdfExport';
import { getStudentRegisterNumber } from '../utils/studentDataHelpers';

function numberToWords(amount) {
  const n = parseInt(String(amount).replace(/\D/g, ''), 10);

  if (isNaN(n) || n === 0) return 'Zero Rupees Only';

  const words = {
    350: 'Three Hundred and Fifty Rupees Only',
    400: 'Four Hundred Rupees Only',
    450: 'Four Hundred and Fifty Rupees Only',
    500: 'Five Hundred Rupees Only',
    600: 'Six Hundred Rupees Only',
    1000: 'One Thousand Rupees Only',
    1200: 'One Thousand Two Hundred Rupees Only',
    1500: 'One Thousand Five Hundred Rupees Only'
  };

  return words[n] || `${n} Rupees Only`;
}

export default function StudentReceiptView({ student, onClose }) {
  const receiptRef = useRef(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!student) return null;

  const regNo = getStudentRegisterNumber(student);

  const cleanId =
    String(student.userId || '').replace(/\D/g, '').slice(-5) || '90436';

  const receiptNumber =
    student.receiptRefNo || `BSEL/REC/2026/${cleanId}`;

  const receiptDate =
    student.enrolmentDate || student.date || '05/11/2026';

  const courseName =
    student.program || student.courseName || 'Phonics & Spoken English';

  const batchLevel =
    student.grade || 'Grade 3 (Age 7 to 8)';

  const admissionNo =
    regNo || student.userId || 'PH26-001';

  const rawFee =
    String(student.feeAmount || '450').replace(/\D/g, '') || '450';

  const amountNumeric = `${rawFee} /-`;
  const amountWords = numberToWords(rawFee);

  // PRINT RECEIPT
  const handlePrint = () => {
    window.print();
  };

  // DOWNLOAD RECEIPT PDF
  const handleDownloadPdf = async () => {
    if (!receiptRef.current || isGeneratingPdf) return;

    setIsGeneratingPdf(true);

    try {
      const filename = `${regNo}_${student.studentName || 'Student'}_Fee_Receipt.pdf`;

      await exportPdfFromElement(receiptRef.current, {
        filename,
        orientation: 'landscape',
        margin: 8,
        backgroundColor: '#ffffff',
        scale: 3
      });
    } catch (err) {
      console.error('Receipt PDF Generation failed:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-[9999]
        overflow-y-auto overflow-x-hidden
        bg-slate-950/85 backdrop-blur-sm
        flex flex-col items-center
        px-2 py-3 sm:px-4 sm:py-4
      "
    >

      {/* PRINT STYLES */}
      <style>{`
        @media print {

          @page {
            size: A4 landscape;
            margin: 8mm;
          }

          html,
          body {
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            background: white !important;
          }

          body * {
            visibility: hidden !important;
          }

          #printable-course-fee-receipt,
          #printable-course-fee-receipt * {
            visibility: visible !important;
          }

          #printable-course-fee-receipt {
            position: absolute !important;

            left: 0 !important;
            top: 0 !important;

            width: 100% !important;
            max-width: none !important;

            height: auto !important;
            aspect-ratio: 1024 / 343 !important;

            margin: 0 !important;
            padding: 0 !important;

            transform: none !important;

            overflow: hidden !important;

            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;

            background: white !important;

            page-break-inside: avoid !important;
            break-inside: avoid !important;

            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          #printable-course-fee-receipt img {
            display: block !important;
            width: 100% !important;
            height: 100% !important;
            object-fit: fill !important;
          }

          .no-print {
            display: none !important;
            visibility: hidden !important;
          }
        }
      `}</style>


      {/* TOP TOOLBAR */}
      <div
        className="
          no-print
          w-full max-w-[1024px]
          bg-[#081d3d] text-white
          px-3 sm:px-4 py-2.5
          rounded-xl shadow-xl
          flex flex-wrap items-center justify-between
          gap-2 sm:gap-3
          sticky top-0 z-30
          border border-amber-400/40
          mb-4 shrink-0
        "
      >

        {/* BACK BUTTON */}
        <button
          type="button"
          onClick={onClose}
          className="
            px-3 sm:px-3.5 py-2
            bg-white/10 hover:bg-white/20
            active:scale-95
            text-white rounded-lg
            text-xs sm:text-sm font-bold
            transition flex items-center gap-1.5
            cursor-pointer shrink-0
          "
        >
          <ArrowLeft className="w-4 h-4" />

          <span className="hidden sm:inline">
            Back to student list
          </span>

          <span className="sm:hidden">
            Back
          </span>
        </button>


        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-2 shrink-0">

          {/* DOWNLOAD PDF */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="
              px-3 sm:px-4 py-2
              bg-amber-400 hover:bg-amber-300
              active:scale-95
              text-slate-950 rounded-lg
              text-xs sm:text-sm font-black
              transition flex items-center gap-1.5
              shadow-sm cursor-pointer
              disabled:opacity-50
            "
          >
            {isGeneratingPdf ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
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
              px-3 sm:px-4 py-2
              bg-sky-600 hover:bg-sky-500
              active:scale-95
              text-white rounded-lg
              text-xs sm:text-sm font-black
              transition flex items-center gap-1.5
              border border-white/20
              cursor-pointer
            "
          >
            <Printer className="w-4 h-4" />

            <span>
              Print
            </span>
          </button>

        </div>
      </div>


      {/* RECEIPT PREVIEW CONTAINER */}
      <div className="w-full flex justify-center items-start pb-6">

        <div
          id="printable-course-fee-receipt"
          ref={receiptRef}
          className="
            relative
            block
            w-full
            max-w-[1024px]
            bg-white
            shadow-2xl
            rounded-sm
            overflow-hidden
            select-text
            mx-auto
            border border-slate-300
            shrink-0
          "
          style={{
            aspectRatio: '1024 / 343',
            fontFamily: "'Segoe UI', Arial, Helvetica, sans-serif"
          }}
        >

          {/* BACKGROUND RECEIPT TEMPLATE */}
          <img
            src="/receipt_template.jpg"
            alt="B★SEL Course Fee Receipt"
            draggable="false"
            className="
              absolute inset-0
              w-full h-full
              object-fill
              block
              select-none
              pointer-events-none
            "
          />


          {/* DYNAMIC DATA OVERLAY */}
          <div
            className="
              absolute inset-0
              pointer-events-none
              select-text
              text-[#081d3d]
              font-bold
            "
          >

            {/* 1. RECEIPT NUMBER */}
            <div
              className="
                absolute font-mono font-black
                text-slate-950 truncate
                -translate-y-1/2
                flex items-center
              "
              style={{
                left: '14.65%',
                top: '36.2%',
                width: '24.5%',
                height: '6.5%',
                fontSize: 'clamp(9px, 1.35vw, 15px)'
              }}
            >
              <span className="tracking-wide">
                {receiptNumber}
              </span>
            </div>


            {/* 2. DATE */}
            <div
              className="
                absolute font-mono font-bold
                text-slate-950 truncate
                -translate-y-1/2
                flex items-center
              "
              style={{
                left: '64%',
                top: '36.2%',
                width: '16%',
                height: '6.5%',
                fontSize: 'clamp(9px, 1.35vw, 15px)'
              }}
            >
              <span className="tracking-wider">
                {receiptDate}
              </span>
            </div>


            {/* 3. STUDENT NAME */}
            <div
              className="
                absolute font-extrabold
                text-slate-950 capitalize truncate
                -translate-y-1/2
                flex items-center
              "
              style={{
                left: '16.6%',
                top: '47.2%',
                width: '24%',
                height: '6.5%',
                fontSize: 'clamp(9px, 1.35vw, 15px)'
              }}
            >
              <span>
                {student.studentName || 'Student Name'}
              </span>
            </div>


            {/* 4. COURSE NAME */}
            <div
              className="
                absolute font-bold
                text-slate-950 truncate
                -translate-y-1/2
                flex items-center
              "
              style={{
                left: '55.2%',
                top: '47.2%',
                width: '25%',
                height: '6.5%',
                fontSize: 'clamp(8px, 1.3vw, 14.5px)'
              }}
            >
              <span>
                {courseName}
              </span>
            </div>


            {/* 5. BATCH / LEVEL */}
            <div
              className="
                absolute font-bold
                text-amber-900 truncate
                -translate-y-1/2
                flex items-center uppercase
              "
              style={{
                left: '15.2%',
                top: '58.4%',
                width: '25%',
                height: '6.5%',
                fontSize: 'clamp(8px, 1.25vw, 14px)'
              }}
            >
              <span>
                {batchLevel}
              </span>
            </div>


            {/* 6. ADMISSION NUMBER */}
            <div
              className="
                absolute font-mono font-black
                text-sky-950 truncate
                -translate-y-1/2
                flex items-center
              "
              style={{
                left: '60.6%',
                top: '58.4%',
                width: '19.5%',
                height: '6.5%',
                fontSize: 'clamp(9px, 1.35vw, 15px)'
              }}
            >
              <span className="tracking-wider">
                {admissionNo}
              </span>
            </div>


            {/* 7. AMOUNT IN NUMBERS */}
            <div
              className="
                absolute font-mono font-black
                text-[#081d3d]
                flex items-center justify-center
                -translate-y-1/2
                tracking-wider
              "
              style={{
                left: '18.36%',
                top: '71.5%',
                width: '15.33%',
                height: '10.2%',
                fontSize: 'clamp(10px, 1.7vw, 19px)'
              }}
            >
              <span>
                {amountNumeric}
              </span>
            </div>


            {/* 8. AMOUNT IN WORDS */}
            <div
              className="
                absolute font-semibold
                text-slate-800 italic truncate
                -translate-y-1/2
                flex items-center
              "
              style={{
                left: '49%',
                top: '71.5%',
                width: '31.2%',
                height: '8.5%',
                fontSize: 'clamp(8px, 1.22vw, 13.5px)'
              }}
            >
              <span className="capitalize">
                {amountWords}
              </span>
            </div>

          </div>
        </div>
      </div>


      {/* MOBILE PREVIEW INFORMATION */}
      <div
        className="
          no-print
          text-center text-slate-300
          text-[10px] sm:text-xs
          pb-3
        "
      >
        B★SEL Course Fee Receipt • Preview
      </div>

    </div>
  );
}
