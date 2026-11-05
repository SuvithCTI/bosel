import React, { useRef, useState } from 'react';
import { ArrowLeft, Download, Printer, Loader2 } from 'lucide-react';
import { exportPdfFromElement } from '../utils/pdfExport';
import { getStudentRegisterNumber } from '../utils/studentDataHelpers';

function numberToWords(amount) {
  const n = parseInt(String(amount).replace(/\D/g, ''), 10);
  if (isNaN(n) || n === 0) return 'Four Hundred and Fifty Rupees Only';
  if (n === 450) return 'Four Hundred and Fifty Rupees Only';
  if (n === 400) return 'Four Hundred Rupees Only';
  if (n === 500) return 'Five Hundred Rupees Only';
  if (n === 350) return 'Three Hundred and Fifty Rupees Only';
  if (n === 600) return 'Six Hundred Rupees Only';
  if (n === 1000) return 'One Thousand Rupees Only';
  if (n === 1200) return 'One Thousand Two Hundred Rupees Only';
  if (n === 1500) return 'One Thousand Five Hundred Rupees Only';
  return `${n} Rupees Only`;
}

export default function StudentReceiptView({ student, onClose }) {
  const receiptRef = useRef(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!student) return null;

  const regNo = getStudentRegisterNumber(student);
  const cleanId = String(student.userId || '').replace(/\D/g, '').slice(-5) || '90436';
  const receiptNumber = student.receiptRefNo || `BSEL/REC/2026/${cleanId}`;
  const receiptDate = student.enrolmentDate || student.date || '05/11/2026';
  const courseName = student.program || student.courseName || 'Phonics & Spoken English';
  const batchLevel = student.grade || 'Grade 3 (Age 7 to 8)';
  const admissionNo = regNo || student.userId || 'PH26-001';
  const rawFee = String(student.feeAmount || '450').replace(/\D/g, '') || '450';
  const amountNumeric = `${rawFee} /-`;
  const amountWords = numberToWords(rawFee);

  const handlePrint = () => {
    window.print();
  };

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
        scale: 2.5
      });
    } catch (err) {
      console.error('Receipt PDF Generation failed:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-start py-4 px-2 sm:px-4">
      {/* Print stylesheet override */}
      <style>{`
        @media print {
          @page {
            size: landscape;
            margin: 6mm;
          }
          body * {
            visibility: hidden !important;
          }
          #printable-course-fee-receipt, #printable-course-fee-receipt * {
            visibility: visible !important;
          }
          #printable-course-fee-receipt {
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 100% !important;
            max-width: 1024px !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: transparent !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Top Controls Toolbar */}
      <div className="no-print w-full max-w-[1024px] bg-[#081d3d] text-white px-3 sm:px-4 py-2.5 rounded-xl shadow-xl flex items-center justify-between gap-2 sm:gap-3 sticky top-2 z-30 border border-amber-400/40 mb-3">
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
            className="px-3 sm:px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 active:scale-95 text-white rounded-lg text-xs font-black transition flex items-center gap-1.5 border border-white/20 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      {/* Exact Receipt Sheet Canvas */}
      <div
        id="printable-course-fee-receipt"
        ref={receiptRef}
        className="relative block w-full max-w-[1024px] bg-white shadow-2xl rounded-sm overflow-hidden select-text mx-auto border border-slate-300"
        style={{
          aspectRatio: '1024 / 343',
          fontFamily: "'Segoe UI', Arial, Helvetica, sans-serif"
        }}
      >
        {/* Background Image Template */}
        <img
          src="/receipt_template.jpg"
          alt="B★SEL Course Fee Receipt"
          className="w-full h-auto block select-none pointer-events-none"
        />

        {/* Dynamic Data Overlay Container */}
        <div className="absolute inset-0 pointer-events-none select-text text-[#081d3d] font-bold">

          {/* 1. Receipt No. */}
          <div
            className="absolute font-mono font-black text-slate-950 truncate -translate-y-1/2 flex items-center"
            style={{
              left: '14.65%',
              top: '36.2%',
              width: '24.5%',
              height: '6.5%',
              fontSize: 'clamp(10px, 1.35vw, 15px)'
            }}
          >
            <span className="tracking-wide">{receiptNumber}</span>
          </div>

          {/* 2. Date */}
          <div
            className="absolute font-mono font-bold text-slate-950 truncate -translate-y-1/2 flex items-center"
            style={{
              left: '64.0%',
              top: '36.2%',
              width: '16.0%',
              height: '6.5%',
              fontSize: 'clamp(10px, 1.35vw, 15px)'
            }}
          >
            <span className="tracking-wider">{receiptDate}</span>
          </div>

          {/* 3. Student Name */}
          <div
            className="absolute font-extrabold text-slate-950 capitalize truncate -translate-y-1/2 flex items-center"
            style={{
              left: '16.6%',
              top: '47.2%',
              width: '24.0%',
              height: '6.5%',
              fontSize: 'clamp(10px, 1.35vw, 15px)'
            }}
          >
            <span>{student.studentName || 'Student Name'}</span>
          </div>

          {/* 4. Course */}
          <div
            className="absolute font-bold text-slate-950 truncate -translate-y-1/2 flex items-center"
            style={{
              left: '55.2%',
              top: '47.2%',
              width: '25.0%',
              height: '6.5%',
              fontSize: 'clamp(10px, 1.3vw, 14.5px)'
            }}
          >
            <span>{courseName}</span>
          </div>

          {/* 5. Batch / Level */}
          <div
            className="absolute font-bold text-amber-900 truncate -translate-y-1/2 flex items-center uppercase"
            style={{
              left: '15.2%',
              top: '58.4%',
              width: '25.0%',
              height: '6.5%',
              fontSize: 'clamp(9.5px, 1.25vw, 14px)'
            }}
          >
            <span>{batchLevel}</span>
          </div>

          {/* 6. Admission No. */}
          <div
            className="absolute font-mono font-black text-sky-950 truncate -translate-y-1/2 flex items-center"
            style={{
              left: '60.6%',
              top: '58.4%',
              width: '19.5%',
              height: '6.5%',
              fontSize: 'clamp(10px, 1.35vw, 15px)'
            }}
          >
            <span className="tracking-wider">{admissionNo}</span>
          </div>

          {/* 7. Amount Numerical Box */}
          <div
            className="absolute font-mono font-black text-[#081d3d] flex items-center justify-center -translate-y-1/2 tracking-wider"
            style={{
              left: '18.36%',
              top: '71.5%',
              width: '15.33%',
              height: '10.2%',
              fontSize: 'clamp(12px, 1.7vw, 19px)'
            }}
          >
            <span>{amountNumeric}</span>
          </div>

          {/* 8. Rupees in Words */}
          <div
            className="absolute font-semibold text-slate-800 italic truncate -translate-y-1/2 flex items-center"
            style={{
              left: '49.0%',
              top: '71.5%',
              width: '31.2%',
              height: '8.5%',
              fontSize: 'clamp(9.5px, 1.22vw, 13.5px)'
            }}
          >
            <span className="capitalize">{amountWords}</span>
          </div>




        </div>
      </div>
    </div>
  );
}
