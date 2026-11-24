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
import {
  getStudentRegisterNumber,
  getStudentPhotoUrl,
  generateCertificateNo,
  getCourseSubjectTitle,
} from '../utils/studentDataHelpers';
import { DEFAULT_ABACUS_SUMS, PAPER_TYPES } from './StudentQuestionPaperView';
import QuestionPaperCoverPage from './QuestionPaperCoverPage';

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

  const course =
    student?.program ||
    student?.courseName ||
    student?.course ||
    'ABACUS SPEED ARITHMETIC';

  const level =
    student?.grade ||
    student?.level ||
    student?.courseLevel ||
    'LEVEL 1';

  const duration =
    student?.duration ||
    student?.courseDuration ||
    '6 Months';

  const school =
    student?.branch ||
    student?.school ||
    student?.institution ||
    student?.studyCenter ||
    'Tenkasi';

  const branchName = student?.branch
    ? student.branch.replace(/\s+Branch$/i, '').toUpperCase()
    : 'RISING STARS';

  const certNo =
    student?.certificateNo ||
    (student ? generateCertificateNo(student, course, level) : null) ||
    'BSEL/AB/11/0001';

  const subjectTitle = getCourseSubjectTitle(course);

  return {
    student,
    regNo: regNo || student?.registrationNo || student?.registerNumber || 'AB26-004, HW22-001',
    certNo,
    studentName: student?.studentName || student?.name || 'Student Name',
    parentName: student?.parentName || student?.fatherName || student?.motherName || 'Father',
    dob: student?.dob || student?.dateOfBirth || '2016-11-13',
    age: student?.age || '',
    gender: student?.gender || 'Male',
    studentClass: student?.studentClass || student?.classGrade || '',
    studentStage: student?.studentStage || '',
    phone: student?.phone || student?.mobile || '',
    alternatePhone: student?.alternatePhone || student?.alternativePhone || '',
    aadhaar: student?.aadharNumber || student?.aadhaarNumber || student?.aadhaar || '',
    address: student?.address || '',
    village: student?.village || '',
    city: student?.city || '',
    district: student?.district || '',
    pincode: student?.pincode || student?.pinCode || '',
    course,
    level,
    duration,
    school,
    branch: school,
    branchName,
    branchSubtitle: 'VISION FOUNDATION',
    branchTagline: 'EDUCATION • EMPOWERMENT • EXCEL',
    paperType,
    paperCode: subjectTitle,
    programBrand: 'BSEL MindSparc™',
    subjectTitle,
    ribbonTitle: 'TEST BOOKLET',
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
 * MergedQuestionPaperModal
 *
 * Dedicated modal for batch merging Question Papers (Page 1 Booklet) for selected branch students.
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

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
        const studentInfo = allStudentDetails[i] || allStudentDetails[0];
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
            {/* Quick Candidate Header Pill & Page Mode Switcher */}
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
              <div className="px-3 py-1 bg-white/90 border border-slate-300 rounded-full text-xs font-black text-[#0c234b] shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Previewing: {currentDetails.studentName}</span>
                <span className="text-slate-400">|</span>
                <span className="font-mono text-sky-700">{currentDetails.regNo}</span>
                <span className="text-slate-400">|</span>
                <span>Type {currentDetails.paperType}</span>
              </div>

            </div>

            {/* Candidate Booklet Content (1st Page Only) */}
            <div className="w-full flex flex-col items-center overflow-x-auto pb-4">
              <div className="w-[724px] shrink-0">
                <QuestionPaperCoverPage
                  student={currentDetails.student}
                  details={currentDetails}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden Multi-Print Container for Sequential Canvas Rendering & Direct Printing (Page 1 per candidate) */}
      <div
        ref={multiPrintContainerRef}
        className="printable-merged-qp opacity-0 pointer-events-none fixed -top-[10000px] left-0 w-[724px]"
      >
        {allStudentDetails.map((details, idx) => (
          <div key={details.student?.userId || idx} className="batch-qp-page qp-page-break mb-8 bg-white">
            <QuestionPaperCoverPage
              student={details.student}
              details={details}
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
