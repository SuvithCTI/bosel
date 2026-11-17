import React, { useRef, useState, useMemo } from 'react';
import {
  ArrowLeft,
  Download,
  Printer,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Users,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import { getStudentRegisterNumber } from '../utils/studentDataHelpers';
import { DEFAULT_ABACUS_SUMS, PAPER_TYPES } from './StudentQuestionPaperView';

// Stable pick per student (same student always gets the same paper type)
const typeFromSeed = (seed) => {
  let h = 0;
  for (const ch of String(seed || 'bsel')) {
    h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  }
  return PAPER_TYPES[h % PAPER_TYPES.length];
};

const buildStudentDetails = (student) => {
  const regNo = getStudentRegisterNumber(student);
  const paperType = typeFromSeed(regNo || student?.userId || student?.id || 'default');
  return {
    student,
    regNo: regNo || student?.userId || 'BSEL-AB-1024',
    studentName: student?.studentName || student?.name || 'Student Name',
    parentName: student?.parentName || student?.fatherName || 'Guardian',
    course: student?.program || student?.courseName || 'Abacus Speed Arithmetic',
    level: student?.grade || student?.studentClass || 'Level 1',
    branch: student?.branch || student?.school || 'Tenkasi Branch',
    paperType,
    paperCode: `D36-0${(PAPER_TYPES.indexOf(paperType) % 5) + 1}`,
    maxMarks1: '25',
    maxMarks2: '25',
    timeAllowed1: '10 Mins',
    timeAllowed2: '10 Mins',
    section1Title: 'S1-ABACUS OPERATIONS',
    section1Instruction: 'Instructions: Use the Abacus kit to calculate. Write answers in the boxes.',
    section2Title: 'S1-ABACUS OPERATIONS',
    section2Instruction: 'Instructions: Use the Abacus kit to calculate. Write answers in the boxes.',
  };
};

/**
 * Single Student Question Paper Page Component
 */
function SingleQuestionPaperPage({
  details,
  showAnswerKey = false,
  innerRef,
  className = ''
}) {
  const table1Sums = DEFAULT_ABACUS_SUMS.slice(0, 12);
  const table2Sums = DEFAULT_ABACUS_SUMS.slice(12, 25);
  const table3Sums = DEFAULT_ABACUS_SUMS.slice(25, 37);
  const table4Sums = DEFAULT_ABACUS_SUMS.slice(37, 50);

  return (
    <div
      ref={innerRef}
      className={`print-page-2 relative block w-full max-w-[720px] bg-white shadow-xl rounded-sm select-text text-slate-900 border border-slate-300 p-3 sm:p-4 mx-auto font-sans text-xs ${className}`}
      style={{ fontFamily: "'Segoe UI', Arial, Helvetica, sans-serif" }}
    >
      {/* Outer Deep Navy Border */}
      <div className="border-[3px] border-[#0c234b] p-2.5 sm:p-3 relative">

        {/* 1. PLAYFUL HEADER WITH CARTOON MOTIFS & TEST B★SEL CREST */}
        <div className="relative w-full border-b-2 border-[#0c234b] pb-2 overflow-hidden bg-gradient-to-b from-sky-100/70 via-sky-50/40 to-white pt-1 px-2 rounded-t-xs">
          <div className="flex items-center justify-between gap-2">
            {/* Left: Kite & Airplane Illustration */}
            <div className="flex items-center gap-1.5 opacity-90">
              <svg className="w-8 h-8 text-amber-500" viewBox="0 0 40 40" fill="currentColor">
                <polygon points="20,2 35,20 20,38 5,20" fill="#f59e0b" />
                <line x1="5" y1="20" x2="35" y2="20" stroke="#b45309" strokeWidth="1" />
                <line x1="20" y1="2" x2="20" y2="38" stroke="#b45309" strokeWidth="1" />
                <path d="M20,38 Q15,42 22,46" stroke="#b45309" strokeWidth="1" fill="none" />
              </svg>
              <svg className="w-6 h-6 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
              </svg>
            </div>

            {/* Center: TEST B★SEL Emblem */}
            <div className="flex flex-col items-center text-center">
              <h1 className="text-base sm:text-lg font-black text-[#0c234b] tracking-widest font-serif leading-none">
                TEST
              </h1>
              <span className="text-[7.5px] font-black uppercase text-slate-600 tracking-wider">
                BOARD OF SKILLS AND EDUCATIONAL LEARNING
              </span>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0c234b] text-white text-[9px] font-black tracking-widest mt-0.5">
                ★ B★SEL ★
              </div>
            </div>

            {/* Right: Sun, Paper Type box & Roll box */}
            <div className="flex items-center gap-1.5 opacity-90">
              <svg className="w-8 h-8 text-amber-400" viewBox="0 0 36 36" fill="currentColor">
                <circle cx="18" cy="18" r="9" fill="#f59e0b" />
                <path d="M18 2v4M18 30v4M2 18h4M30 18h4M6.7 6.7l2.8 2.8M26.5 26.5l2.8 2.8M6.7 29.3l2.8-2.8M26.5 9.5l2.8-2.8" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
              </svg>

              {/* TYPE box (A / B / C / D / E) */}
              <div className="w-9 h-10 border-2 border-[#0c234b] bg-amber-300 rounded-sm flex flex-col items-center justify-center shadow-xs">
                <span className="text-[6px] font-black uppercase text-[#0c234b] leading-none">Type</span>
                <span className="text-lg font-black text-[#0c234b] leading-none mt-0.5">
                  {details.paperType}
                </span>
              </div>

              <div className="w-7 h-9 border-2 border-dashed border-sky-400 rounded-sm flex items-center justify-center text-[7px] font-black text-sky-800 bg-white/80">
                ROLL
              </div>
            </div>
          </div>

          {/* 2. STUDENT DETAILS BAR */}
          <div className="mt-1.5 flex items-center justify-between bg-white border border-[#0c234b] rounded-full px-3 py-1 shadow-xs text-[10px] font-bold text-slate-800 flex-wrap gap-1">
            <div className="flex items-center gap-1">
              <span className="bg-[#0c234b] text-white text-[8.5px] px-2 py-0.5 rounded-full uppercase font-black">
                Student Details
              </span>
              <span className="font-black text-[#0c234b] ml-1">
                {details.studentName}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[9.5px]">
              <span>Reg: <strong className="font-mono font-black">{details.regNo}</strong></span>
              <span>Level: <strong>{String(details.level).split(' ')[0] || 'L1'}</strong></span>
              <span>Type: <strong className="text-[#0c234b] font-black">{details.paperType}</strong></span>
              <span className="bg-[#0c234b] text-amber-300 font-black px-2 py-0.5 rounded-full text-[8px]">
                B★SEL
              </span>
            </div>
          </div>
        </div>

        {/* Main Body with Vertical Left Sidebar Ribbon */}
        <div className="relative flex gap-2 mt-2">
          {/* Left Vertical Ribbon */}
          <div className="flex flex-col items-center justify-start gap-1.5 pt-6 shrink-0 w-5">
            {['B', '★', 'S', 'E', 'L'].map((char, i) => (
              <div
                key={i}
                className="w-4 h-4 bg-slate-950 text-white rounded-xs flex items-center justify-center text-[9px] font-black shadow-xs"
              >
                {char}
              </div>
            ))}
          </div>

          {/* Question Tables Container */}
          <div className="flex-1 space-y-3 min-w-0">

            {/* SECTION 1: S1 - ABACUS OPERATIONS (1-DIGIT SUMS) */}
            <div className="space-y-1">
              <div className="text-center">
                <h3 className="text-xs font-black uppercase text-[#0c234b] underline tracking-wider">
                  {details.section1Title}
                </h3>
                <p className="text-[9px] text-slate-700 italic font-semibold">
                  "{details.section1Instruction}"
                </p>
              </div>

              {/* Blue Title Banner */}
              <div className="bg-[#0c234b] text-white flex items-center justify-between px-2 py-0.5 text-[9px] font-black tracking-wider uppercase rounded-xs">
                <span>B★SEL-L1</span>
                <span>MAX MARK[{details.maxMarks1}]: -[1]:</span>
                <span className="text-amber-300">ALL THE BEST</span>
                <span>*Time: {details.timeAllowed1}*</span>
                <span className="bg-white text-[#0c234b] px-1 rounded-xs">A1</span>
              </div>

              {/* Table 1: S1 to S12 */}
              <div className="overflow-x-auto border border-[#0c234b]">
                <table className="w-full border-collapse text-center text-[10px]">
                  <thead>
                    <tr className="bg-sky-50 border-b border-[#0c234b]">
                      {table1Sums.map((s) => (
                        <th
                          key={s.id}
                          className="border-r border-slate-300 py-1 font-black text-[#0c234b] w-[8.33%]"
                        >
                          {s.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[0, 1, 2, 3].map((rowIdx) => (
                      <tr
                        key={rowIdx}
                        className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-sky-50/40'}
                      >
                        {table1Sums.map((s) => (
                          <td
                            key={s.id}
                            className="border-r border-slate-200 py-0.5 px-0.5 font-bold text-slate-900 border-b border-dashed border-slate-200"
                          >
                            {s.nums[rowIdx] ?? ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {/* Answer Row */}
                    <tr className="bg-white border-t-2 border-[#0c234b]">
                      {table1Sums.map((s) => (
                        <td
                          key={s.id}
                          className="border-r border-slate-300 py-1 px-0.5 font-black text-rose-600 bg-rose-50/30"
                        >
                          {showAnswerKey ? (
                            s.ans
                          ) : (
                            <div className="h-4 border border-dashed border-slate-300 rounded-xs" />
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Table 2: S13 to S25 */}
              <div className="overflow-x-auto border border-[#0c234b] mt-1.5">
                <table className="w-full border-collapse text-center text-[10px]">
                  <thead>
                    <tr className="bg-sky-50 border-b border-[#0c234b]">
                      {table2Sums.map((s) => (
                        <th
                          key={s.id}
                          className="border-r border-slate-300 py-1 font-black text-[#0c234b] w-[7.69%]"
                        >
                          {s.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[0, 1, 2, 3].map((rowIdx) => (
                      <tr
                        key={rowIdx}
                        className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-sky-50/40'}
                      >
                        {table2Sums.map((s) => (
                          <td
                            key={s.id}
                            className="border-r border-slate-200 py-0.5 px-0.5 font-bold text-slate-900 border-b border-dashed border-slate-200"
                          >
                            {s.nums[rowIdx] ?? ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {/* Answer Row */}
                    <tr className="bg-white border-t-2 border-[#0c234b]">
                      {table2Sums.map((s) => (
                        <td
                          key={s.id}
                          className="border-r border-slate-300 py-1 px-0.5 font-black text-rose-600 bg-rose-50/30"
                        >
                          {showAnswerKey ? (
                            s.ans
                          ) : (
                            <div className="h-4 border border-dashed border-slate-300 rounded-xs" />
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 2: S1 - ABACUS OPERATIONS (2-DIGIT SUMS) */}
            <div className="space-y-1 pt-1 border-t border-slate-300">
              <div className="text-center">
                <h3 className="text-xs font-black uppercase text-[#0c234b] underline tracking-wider">
                  {details.section2Title}
                </h3>
                <p className="text-[9px] text-slate-700 italic font-semibold">
                  "{details.section2Instruction}"
                </p>
              </div>

              {/* Blue Title Banner */}
              <div className="bg-[#0c234b] text-white flex items-center justify-between px-2 py-0.5 text-[9px] font-black tracking-wider uppercase rounded-xs">
                <span>B★SEL-L1</span>
                <span>MAX MARK[{details.maxMarks2}]: -[1]:</span>
                <span className="text-amber-300">ALL THE BEST</span>
                <span>*Time: {details.timeAllowed2}*</span>
                <span className="bg-white text-[#0c234b] px-1 rounded-xs">A2</span>
              </div>

              {/* Table 3: S26 to S37 (2-digit) */}
              <div className="overflow-x-auto border border-[#0c234b]">
                <table className="w-full border-collapse text-center text-[10px]">
                  <thead>
                    <tr className="bg-sky-50 border-b border-[#0c234b]">
                      {table3Sums.map((s) => (
                        <th
                          key={s.id}
                          className="border-r border-slate-300 py-1 font-black text-[#0c234b] w-[8.33%]"
                        >
                          {s.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[0, 1, 2].map((rowIdx) => (
                      <tr
                        key={rowIdx}
                        className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-sky-50/40'}
                      >
                        {table3Sums.map((s) => (
                          <td
                            key={s.id}
                            className="border-r border-slate-200 py-0.5 px-0.5 font-bold text-slate-900 border-b border-dashed border-slate-200"
                          >
                            {s.nums[rowIdx] ?? ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {/* Answer Row */}
                    <tr className="bg-white border-t-2 border-[#0c234b]">
                      {table3Sums.map((s) => (
                        <td
                          key={s.id}
                          className="border-r border-slate-300 py-1 px-0.5 font-black text-rose-600 bg-rose-50/30"
                        >
                          {showAnswerKey ? (
                            s.ans
                          ) : (
                            <div className="h-4 border border-dashed border-slate-300 rounded-xs" />
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Table 4: S38 to S50 (2-digit) */}
              <div className="overflow-x-auto border border-[#0c234b] mt-1.5">
                <table className="w-full border-collapse text-center text-[10px]">
                  <thead>
                    <tr className="bg-sky-50 border-b border-[#0c234b]">
                      {table4Sums.map((s) => (
                        <th
                          key={s.id}
                          className="border-r border-slate-300 py-1 font-black text-[#0c234b] w-[7.69%]"
                        >
                          {s.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[0, 1, 2, 3].map((rowIdx) => (
                      <tr
                        key={rowIdx}
                        className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-sky-50/40'}
                      >
                        {table4Sums.map((s) => (
                          <td
                            key={s.id}
                            className="border-r border-slate-200 py-0.5 px-0.5 font-bold text-slate-900 border-b border-dashed border-slate-200"
                          >
                            {s.nums[rowIdx] ?? ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {/* Answer Row */}
                    <tr className="bg-white border-t-2 border-[#0c234b]">
                      {table4Sums.map((s) => (
                        <td
                          key={s.id}
                          className="border-r border-slate-300 py-1 px-0.5 font-black text-rose-600 bg-rose-50/30"
                        >
                          {showAnswerKey ? (
                            s.ans
                          ) : (
                            <div className="h-4 border border-dashed border-slate-300 rounded-xs" />
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>

        {/* 3. SIGNATURES & TEST CODE FOOTER */}
        <div className="mt-4 pt-3 border-t border-slate-300 flex items-end justify-between text-[9px] font-bold text-slate-700 px-4">
          <div className="text-center w-36">
            <div className="w-full border-b border-slate-400 pb-3 mb-1" />
            <span>Examiner's Signature</span>
          </div>

          <div className="text-center">
            <div className="w-24 border-b border-slate-400 pb-3 mb-1" />
            <span>Remarks</span>
          </div>

          <div className="text-center w-36">
            <div className="w-full border-b border-slate-400 pb-3 mb-1" />
            <span>Invigilator Signature</span>
          </div>
        </div>

        {/* Center Code (paper code + type) */}
        <div className="mt-2 text-center text-[10px] font-black text-slate-900 tracking-wider flex items-center justify-center gap-2">
          <span>{details.paperCode}</span>
          <span className="bg-[#0c234b] text-amber-300 px-2 py-0.5 rounded-full text-[9px]">
            TYPE {details.paperType}
          </span>
        </div>

      </div>
    </div>
  );
}

/**
 * MergedQuestionPaperModal
 *
 * Dedicated modal for batch merging ONLY Question Papers for selected branch students.
 */
export default function MergedQuestionPaperModal({
  data,
  onClose,
  showToast
}) {
  const students = useMemo(() => {
    return (data?.students || (data?.student ? [data.student] : [])).filter(Boolean);
  }, [data]);

  const branchName = data?.branch || 'Branch';

  const [activeIndex, setActiveIndex] = useState(0);
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const previewPageRef = useRef(null);
  const multiPrintContainerRef = useRef(null);

  const currentStudent = students[activeIndex] || students[0];
  const currentDetails = useMemo(() => {
    return currentStudent ? buildStudentDetails(currentStudent) : null;
  }, [currentStudent]);

  const allStudentDetails = useMemo(() => {
    return students.map((s) => buildStudentDetails(s));
  }, [students]);

  // Handle direct print
  const handlePrint = () => {
    window.print();
  };

  // Download combined multi-student Question Paper PDF
  const handleDownloadMergedPdf = async () => {
    if (isGenerating || students.length === 0) return;
    setIsGenerating(true);
    setErrorMessage(null);
    setDownloadSuccess(false);

    try {
      if (document.fonts?.ready) {
        try {
          await document.fonts.ready;
        } catch {
          // ignore font warning
        }
      }

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const container = multiPrintContainerRef.current;
      if (!container) {
        throw new Error('Print container not available.');
      }

      const pageElements = container.querySelectorAll('.batch-qp-page');

      for (let i = 0; i < pageElements.length; i++) {
        const studentInfo = allStudentDetails[i];
        setCurrentStep(`Rendering Question Paper ${i + 1} of ${pageElements.length}: ${studentInfo.studentName}...`);

        await new Promise((r) => setTimeout(r, 120));

        const canvas = await html2canvas(pageElements[i], {
          scale: 2.2,
          useCORS: true,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        if (i > 0) {
          pdf.addPage('a4', 'portrait');
        }

        const margin = 8;
        const availW = 210 - margin * 2;
        const availH = 297 - margin * 2;
        const aspect = canvas.width / canvas.height;
        let renderW = availW;
        let renderH = availW / aspect;
        if (renderH > availH) {
          renderH = availH;
          renderW = availH * aspect;
        }
        const posX = (210 - renderW) / 2;
        const posY = (297 - renderH) / 2;

        pdf.addImage(imgData, 'JPEG', posX, posY, renderW, renderH, undefined, 'FAST');
      }

      const safeBranch = branchName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
      const dateStr = new Date().toISOString().slice(0, 10);
      const filename = `BSEL_Merged_Question_Papers_${safeBranch}_${dateStr}.pdf`;

      setCurrentStep('Finalizing Merged PDF...');
      pdf.save(filename);

      setDownloadSuccess(true);
      setCurrentStep('Download complete!');
      if (showToast) {
        showToast(`Successfully downloaded merged Question Papers (${students.length} students)!`);
      }
    } catch (err) {
      console.error('Merged Question Paper PDF Generation Error:', err);
      setErrorMessage(err.message || 'Error generating PDF.');
      if (showToast) {
        showToast('PDF Generation failed: ' + (err.message || 'Error'));
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex flex-col p-2 sm:p-4 text-slate-900 animate-in fade-in duration-200">
      {/* Top Bar Header */}
      <div className="sticky top-0 z-30 max-w-6xl w-full mx-auto bg-slate-900 text-white rounded-2xl p-3 sm:p-4 mb-4 border border-slate-700/60 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left: Close & Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-xl transition cursor-pointer"
            title="Back to Students Roster"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-amber-400" />
              <h1 className="text-sm sm:text-base font-black tracking-wide text-white">
                Merged Question Papers ({students.length} Students)
              </h1>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                Question Paper Only
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Official Examination Papers merged for <strong className="text-sky-300">{branchName}</strong>
            </p>
          </div>
        </div>

        {/* Center: Candidate Switcher */}
        {students.length > 1 && (
          <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 rounded-xl px-2.5 py-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
              disabled={activeIndex === 0}
              className="p-1 hover:bg-slate-700 rounded text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Previous Candidate"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-amber-300 min-w-[120px] text-center">
              Candidate {activeIndex + 1} of {students.length}
            </span>
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => Math.min(students.length - 1, prev + 1))}
              disabled={activeIndex === students.length - 1}
              className="p-1 hover:bg-slate-700 rounded text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Next Candidate"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap sm:flex-nowrap">
          {/* Answer Key Toggle */}
          <button
            type="button"
            onClick={() => setShowAnswerKey((prev) => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
              showAnswerKey
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-white/10 text-slate-300 border-white/10 hover:bg-white/15'
            }`}
            title="Toggle answer key visibility"
          >
            {showAnswerKey ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showAnswerKey ? 'Answer Key ON' : 'Blank Test Paper'}</span>
          </button>

          {/* Print Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-white/10 cursor-pointer"
            title="Print Question Papers"
          >
            <Printer className="w-3.5 h-3.5 text-sky-400" />
            <span>Print</span>
          </button>

          {/* Download Merged PDF Button */}
          <button
            type="button"
            onClick={handleDownloadMergedPdf}
            disabled={isGenerating}
            className="px-4 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-95 text-slate-950 font-black rounded-xl text-xs transition flex items-center gap-1.5 shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span>{isGenerating ? 'Merging PDF...' : `Download Merged PDF (${students.length})`}</span>
          </button>
        </div>
      </div>

      {/* Progress / Status Banner */}
      {isGenerating && (
        <div className="max-w-6xl w-full mx-auto mb-4 bg-sky-900/90 text-white p-3 rounded-xl border border-sky-500/40 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2 text-xs font-bold">
            <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
            <span>{currentStep || 'Generating merged question paper PDF...'}</span>
          </div>
          <span className="text-xs font-mono font-bold text-amber-300">High-DPI Portrait A4</span>
        </div>
      )}

      {downloadSuccess && (
        <div className="max-w-6xl w-full mx-auto mb-4 bg-emerald-900/90 text-white p-3 rounded-xl border border-emerald-500/40 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Successfully downloaded merged Question Papers PDF!</span>
          </div>
          <button
            type="button"
            onClick={() => setDownloadSuccess(false)}
            className="text-[11px] underline text-emerald-200 hover:text-white cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="max-w-6xl w-full mx-auto mb-4 bg-rose-900/90 text-white p-3 rounded-xl border border-rose-500/40 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2 text-xs font-bold">
            <AlertCircle className="w-4 h-4 text-rose-300" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-[11px] underline text-rose-200 hover:text-white cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Preview Container */}
      <div className="flex-1 max-w-6xl w-full mx-auto flex flex-col items-center justify-start pb-8">
        {currentDetails && (
          <div className="w-full flex flex-col items-center">
            {/* Quick Candidate Header Pill */}
            <div className="mb-3 px-3 py-1 bg-white/90 border border-slate-300 rounded-full text-xs font-black text-[#0c234b] shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Previewing: {currentDetails.studentName}</span>
              <span className="text-slate-400">|</span>
              <span className="font-mono text-sky-700">{currentDetails.regNo}</span>
              <span className="text-slate-400">|</span>
              <span>Type {currentDetails.paperType}</span>
            </div>

            {/* Single Preview Component */}
            <SingleQuestionPaperPage
              details={currentDetails}
              showAnswerKey={showAnswerKey}
              innerRef={previewPageRef}
            />
          </div>
        )}
      </div>

      {/* Hidden Multi-Print Container for Sequential Canvas Rendering & Direct Printing */}
      <div
        ref={multiPrintContainerRef}
        className="printable-merged-qp opacity-0 pointer-events-none fixed -top-[10000px] left-0 w-[724px]"
      >
        {allStudentDetails.map((details, idx) => (
          <div
            key={details.student?.userId || idx}
            className="batch-qp-page qp-page-break mb-8 bg-white"
          >
            <SingleQuestionPaperPage
              details={details}
              showAnswerKey={showAnswerKey}
            />
          </div>
        ))}
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .printable-merged-qp, .printable-merged-qp * {
            visibility: visible !important;
          }
          .printable-merged-qp {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            opacity: 1 !important;
            pointer-events: auto !important;
          }
          .qp-page-break {
            page-break-after: always !important;
            break-after: page !important;
            margin-bottom: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
