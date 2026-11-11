import React, { useRef, useState } from 'react';
import {
  ArrowLeft,
  Download,
  Printer,
  Loader2,
  Edit3,
  RotateCcw,
  Eye,
  EyeOff,
  Calculator,
  Sparkles,
  Save,
  BookOpen,
  CheckCircle2,
  Unlock,
} from 'lucide-react';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import { exportPdfFromElement, triggerDirectPdfDownload } from '../utils/pdfExport';
import { getStudentPhotoUrl, getStudentRegisterNumber } from '../utils/studentDataHelpers';

// 50 official Abacus Operation problems from official B★SEL test booklet template
export const DEFAULT_ABACUS_SUMS = [
  // Section A1: S1 to S12 (1-digit additions/subtractions)
  { id: 's1', label: 'S1', nums: [2, 8, -7, 5], ans: 8 },
  { id: 's2', label: 'S2', nums: [3, 5, 7, -8], ans: 7 },
  { id: 's3', label: 'S3', nums: [6, 3, 9, -9], ans: 9 },
  { id: 's4', label: 'S4', nums: [1, 8, 1, -1], ans: 9 },
  { id: 's5', label: 'S5', nums: [9, 7, -1, -6], ans: 9 },
  { id: 's6', label: 'S6', nums: [2, 5, 5, -8], ans: 4 },
  { id: 's7', label: 'S7', nums: [6, 4, -9, 3], ans: 4 },
  { id: 's8', label: 'S8', nums: [9, 1, -3, 2], ans: 9 },
  { id: 's9', label: 'S9', nums: [6, 5, -2, 7], ans: 16 },
  { id: 's10', label: 'S10', nums: [2, 8, -4, -1], ans: 5 },
  { id: 's11', label: 'S11', nums: [9, 5, 6, -5], ans: 15 },
  { id: 's12', label: 'S12', nums: [9, 1, -6, 8], ans: 12 },

  // Section A1: S13 to S25 (1-digit additions/subtractions)
  { id: 's13', label: 'S13', nums: [8, 3, -5, 2], ans: 8 },
  { id: 's14', label: 'S14', nums: [7, 4, -9, 6], ans: 8 },
  { id: 's15', label: 'S15', nums: [6, -1, 5, -9], ans: 1 },
  { id: 's16', label: 'S16', nums: [1, 3, 6, -7], ans: 3 },
  { id: 's17', label: 'S17', nums: [9, 2, -7, -3], ans: 1 },
  { id: 's18', label: 'S18', nums: [6, 5, 2, -9], ans: 4 },
  { id: 's19', label: 'S19', nums: [8, 2, -9, 7], ans: 8 },
  { id: 's20', label: 'S20', nums: [7, 4, -4, 3], ans: 10 },
  { id: 's21', label: 'S21', nums: [4, 6, -2, 7], ans: 15 },
  { id: 's22', label: 'S22', nums: [9, 8, 3, -4], ans: 16 },
  { id: 's23', label: 'S23', nums: [4, 8, 7, -6], ans: 13 },
  { id: 's24', label: 'S24', nums: [4, 9, -3, -7], ans: 3 },
  { id: 's25', label: 'S25', nums: [9, 8, -7, -6], ans: 4 },

  // Section A2: S26 to S37 (2-digit additions/subtractions)
  { id: 's26', label: 'S26', nums: [83, 6, -7], ans: 82 },
  { id: 's27', label: 'S27', nums: [74, 6, -7], ans: 73 },
  { id: 's28', label: 'S28', nums: [43, -5, 2], ans: 40 },
  { id: 's29', label: 'S29', nums: [28, 3, -4], ans: 27 },
  { id: 's30', label: 'S30', nums: [67, -8, -2], ans: 57 },
  { id: 's31', label: 'S31', nums: [88, 3, -5], ans: 86 },
  { id: 's32', label: 'S32', nums: [14, 5, -6], ans: 13 },
  { id: 's33', label: 'S33', nums: [12, 7, 1], ans: 20 },
  { id: 's34', label: 'S34', nums: [24, -3, 6], ans: 27 },
  { id: 's35', label: 'S35', nums: [27, -8, -2], ans: 17 },
  { id: 's36', label: 'S36', nums: [38, 3, -5], ans: 36 },
  { id: 's37', label: 'S37', nums: [14, -5, -3], ans: 6 },

  // Section A2: S38 to S50 (2-digit additions/subtractions)
  { id: 's38', label: 'S38', nums: [34, 5, -7, -8], ans: 24 },
  { id: 's39', label: 'S39', nums: [73, -4, -8, -5], ans: 56 },
  { id: 's40', label: 'S40', nums: [48, -7, 3, -2], ans: 42 },
  { id: 's41', label: 'S41', nums: [23, 8, 7, 4], ans: 42 },
  { id: 's42', label: 'S42', nums: [13, 7, 8, -9], ans: 19 },
  { id: 's43', label: 'S43', nums: [25, -6, 8, -2], ans: 25 },
  { id: 's44', label: 'S44', nums: [13, -4, -8, 2], ans: 3 },
  { id: 's45', label: 'S45', nums: [23, -5, 8, 3], ans: 29 },
  { id: 's46', label: 'S46', nums: [37, -6, 2, 5], ans: 38 },
  { id: 's47', label: 'S47', nums: [24, -3, 7, -2], ans: 26 },
  { id: 's48', label: 'S48', nums: [34, -1, -5, -7], ans: 21 },
  { id: 's49', label: 'S49', nums: [96, -5, -5, -9], ans: 77 },
  { id: 's50', label: 'S50', nums: [87, -6, -5, -8], ans: 68 },
];

export const DEFAULT_SUBJECT_MODULES = [
  { id: 1, name: 'Abacus Operations', max: 100, assessment: 100, marks: 96, pct: '96%' },
  { id: 2, name: 'Mental Arithmetic', max: 100, assessment: 100, marks: 98, pct: '98%' },
  { id: 3, name: 'Abacus Calculation', max: 100, assessment: 100, marks: 94, pct: '94%' },
  { id: 4, name: 'Rapid Calculation', max: 100, assessment: 100, marks: 97, pct: '97%' },
  { id: 5, name: 'Numerical Proficiency', max: 100, assessment: 100, marks: 95, pct: '95%' }
];

export default function StudentQuestionPaperView({ student, onClose }) {
  const page1Ref = useRef(null);
  const page2Ref = useRef(null);

  const [activeTab, setActiveTab] = useState('both'); // 'both', 'page1', 'page2'
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAnswerKey, setShowAnswerKey] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const regNo = getStudentRegisterNumber(student);
  const storageKey = `bsel_custom_qp_${regNo || student?.id || 'default'}`;

  // 1. Student & Exam Meta State
  const [studentDetails, setStudentDetails] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.studentDetails) return parsed.studentDetails;
      }
    } catch {
      // ignore
    }

    return {
      regNo: regNo || 'BSEL-AB-1024',
      certNo: student?.certificateNo || `BSEL/ABACUS/L1/${(regNo || '1024').slice(-4)}`,
      studentName: student?.studentName || student?.name || 'A. MOHAMED IRFAN',
      parentName: student?.parentName || student?.fatherName || 'M. ABDUL HAMEED',
      dob: student?.dob || student?.dateOfBirth || '2016-05-28',
      course: student?.program || student?.courseName || 'Abacus Speed Arithmetic',
      level: student?.grade || 'Level 1 (Sub-Junior / Age 5-7)',
      duration: student?.duration || student?.courseDuration || '6 Months',
      school: student?.branch || student?.school || 'Tenkasi Regional Branch',
      address: student?.address || 'Tenkasi, Tamil Nadu',
      category: 'E',
      testBookletTitle: 'B★SEL-D36 LEVEL 1 TEST -CAT-E-MM',
      paperCode: 'D36-01',
      maxMarks1: '25',
      maxMarks2: '25',
      timeAllowed1: '10 Mins',
      timeAllowed2: '10 Mins',
      section1Title: 'S1-ABACUS OPERATIONS',
      section1Instruction: 'Instructions: Use the Abacus kit to calculate. Write answers in the boxes.',
      section2Title: 'S1-ABACUS OPERATIONS',
      section2Instruction: 'Instructions: Use the Abacus kit to calculate. Write answers in the boxes.',
      remarks: 'Outstanding computational speed and accuracy in Abacus Level 1.',
      dateOfIssue: '31 Oct 2026',
    };
  });

  // 2. Page 1 Subjects & Marks State
  const [subjects, setSubjects] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.subjects) return parsed.subjects;
      }
    } catch {
      // ignore
    }
    return DEFAULT_SUBJECT_MODULES;
  });

  // 3. Page 2 Abacus Sums State (S1 to S50)
  const [abacusSums, setAbacusSums] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.abacusSums) return parsed.abacusSums;
      }
    } catch {
      // ignore
    }
    return DEFAULT_ABACUS_SUMS;
  });

  const photoUrl = getStudentPhotoUrl(student);

  // Derived Totals
  const totalMax = subjects.reduce((sum, s) => sum + Number(s.max || 0), 0);
  const totalObtained = subjects.reduce((sum, s) => sum + Number(s.marks || 0), 0);
  const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) : '0.0';
  const overallGrade =
    percentage >= 85 ? 'A+' : percentage >= 75 ? 'A' : percentage >= 60 ? 'B' : percentage >= 40 ? 'C' : 'F';

  // Handler to update student details
  const updateDetail = (field, val) => {
    setStudentDetails((prev) => ({ ...prev, [field]: val }));
  };

  // Handler to update subject marks
  const updateSubject = (id, field, val) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const updated = { ...s, [field]: val };
        if (field === 'marks' || field === 'max') {
          const m = Number(field === 'marks' ? val : s.marks) || 0;
          const mx = Number(field === 'max' ? val : s.max) || 100;
          updated.pct = `${Math.round((m / (mx || 1)) * 100)}%`;
        }
        return updated;
      })
    );
  };

  // Handler to update a single number inside a sum problem
  const updateSumNumber = (sumId, numIdx, val) => {
    setAbacusSums((prev) =>
      prev.map((item) => {
        if (item.id !== sumId) return item;
        const newNums = [...item.nums];
        newNums[numIdx] = Number(val) || 0;
        const autoAns = newNums.reduce((acc, curr) => acc + curr, 0);
        return {
          ...item,
          nums: newNums,
          ans: autoAns,
        };
      })
    );
  };

  // Handler to manually update an answer
  const updateSumAnswer = (sumId, val) => {
    setAbacusSums((prev) =>
      prev.map((item) => (item.id === sumId ? { ...item, ans: Number(val) || 0 } : item))
    );
  };

  // Auto-calculate all 50 sums answers from their numbers
  const autoCalculateAllAnswers = () => {
    setAbacusSums((prev) =>
      prev.map((item) => {
        const correctAns = item.nums.reduce((acc, curr) => acc + curr, 0);
        return { ...item, ans: correctAns };
      })
    );
    showTempMsg('All 50 Abacus answers re-calculated successfully!');
  };

  // Generate random sums for test creation
  const generateRandomSums = () => {
    if (!window.confirm('Generate fresh random Abacus sums for this test paper?')) return;
    setAbacusSums((prev) =>
      prev.map((item, idx) => {
        if (idx < 25) {
          const n1 = Math.floor(Math.random() * 8) + 2;
          const n2 = Math.floor(Math.random() * 8) + 1;
          const n3 = -(Math.floor(Math.random() * Math.min(n1 + n2 - 1, 8)) + 1);
          const n4 = Math.floor(Math.random() * 8) + 1;
          const nums = [n1, n2, n3, n4];
          return { ...item, nums, ans: nums.reduce((a, b) => a + b, 0) };
        } else {
          const n1 = Math.floor(Math.random() * 70) + 15;
          const n2 = Math.floor(Math.random() * 8) + 1;
          const n3 = -(Math.floor(Math.random() * 7) + 1);
          const nums = [n1, n2, n3];
          return { ...item, nums, ans: nums.reduce((a, b) => a + b, 0) };
        }
      })
    );
    showTempMsg('Generated fresh random test problems!');
  };

  // Save changes to localStorage
  const handleSave = () => {
    try {
      const payload = { studentDetails, subjects, abacusSums };
      localStorage.setItem(storageKey, JSON.stringify(payload));
      showTempMsg('All changes saved successfully!');
    } catch (e) {
      console.error('Save failed:', e);
    }
  };

  // Reset to template default
  const handleReset = () => {
    if (!window.confirm('Reset all changes back to the original Word template?')) return;
    localStorage.removeItem(storageKey);
    setSubjects(DEFAULT_SUBJECT_MODULES);
    setAbacusSums(DEFAULT_ABACUS_SUMS);
    setStudentDetails({
      regNo: regNo || 'BSEL-AB-1024',
      certNo: student?.certificateNo || `BSEL/ABACUS/L1/${(regNo || '1024').slice(-4)}`,
      studentName: student?.studentName || student?.name || 'A. MOHAMED IRFAN',
      parentName: student?.parentName || student?.fatherName || 'M. ABDUL HAMEED',
      dob: student?.dob || student?.dateOfBirth || '2016-05-28',
      course: student?.program || student?.courseName || 'Abacus Speed Arithmetic',
      level: student?.grade || 'Level 1 (Sub-Junior / Age 5-7)',
      duration: student?.duration || student?.courseDuration || '6 Months',
      school: student?.branch || student?.school || 'Tenkasi Regional Branch',
      address: student?.address || 'Tenkasi, Tamil Nadu',
      category: 'E',
      testBookletTitle: 'B★SEL-D36 LEVEL 1 TEST -CAT-E-MM',
      paperCode: 'D36-01',
      maxMarks1: '25',
      maxMarks2: '25',
      timeAllowed1: '10 Mins',
      timeAllowed2: '10 Mins',
      section1Title: 'S1-ABACUS OPERATIONS',
      section1Instruction: 'Instructions: Use the Abacus kit to calculate. Write answers in the boxes.',
      section2Title: 'S1-ABACUS OPERATIONS',
      section2Instruction: 'Instructions: Use the Abacus kit to calculate. Write answers in the boxes.',
      remarks: 'Outstanding computational speed and accuracy in Abacus Level 1.',
      dateOfIssue: '31 Oct 2026',
    });
    showTempMsg('Reset to original template values.');
  };

  const showTempMsg = (msg) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  // PDF Export
  const handleDownloadPdf = async () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);

    try {
      const filename = `${studentDetails.regNo}_${studentDetails.studentName.replace(/\s+/g, '_')}_BSEL_Test_Booklet.pdf`;

      if (activeTab === 'page1' && page1Ref.current) {
        await exportPdfFromElement(page1Ref.current, {
          filename,
          orientation: 'portrait',
          margin: 6,
          scale: 2.2,
        });
      } else if (activeTab === 'page2' && page2Ref.current) {
        await exportPdfFromElement(page2Ref.current, {
          filename,
          orientation: 'portrait',
          margin: 6,
          scale: 2.2,
        });
      } else if (page1Ref.current && page2Ref.current) {
        // Multi-page PDF for both pages
        const p1Canvas = await html2canvas(page1Ref.current, {
          scale: 2.2,
          useCORS: true,
          backgroundColor: '#ffffff',
        });
        const p2Canvas = await html2canvas(page2Ref.current, {
          scale: 2.2,
          useCORS: true,
          backgroundColor: '#ffffff',
        });

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
          compress: true,
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 5;
        const availW = pageWidth - margin * 2;
        const availH = pageHeight - margin * 2;

        // Render Page 1
        const p1Aspect = p1Canvas.width / p1Canvas.height;
        let r1W = availW;
        let r1H = availW / p1Aspect;
        if (r1H > availH) {
          r1H = availH;
          r1W = availH * p1Aspect;
        }
        const x1 = margin + (availW - r1W) / 2;
        const y1 = margin + (availH - r1H) / 2;
        pdf.addImage(
          p1Canvas.toDataURL('image/jpeg', 0.95),
          'JPEG',
          x1,
          y1,
          r1W,
          r1H,
          undefined,
          'FAST'
        );

        // Render Page 2
        pdf.addPage('a4', 'portrait');
        const p2Aspect = p2Canvas.width / p2Canvas.height;
        let r2W = availW;
        let r2H = availW / p2Aspect;
        if (r2H > availH) {
          r2H = availH;
          r2W = availH * p2Aspect;
        }
        const x2 = margin + (availW - r2W) / 2;
        const y2 = margin + (availH - r2H) / 2;
        pdf.addImage(
          p2Canvas.toDataURL('image/jpeg', 0.95),
          'JPEG',
          x2,
          y2,
          r2W,
          r2H,
          undefined,
          'FAST'
        );

        triggerDirectPdfDownload(pdf, filename);
      }
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Partition sums for tables
  const table1Sums = abacusSums.slice(0, 12); // S1 - S12
  const table2Sums = abacusSums.slice(12, 25); // S13 - S25
  const table3Sums = abacusSums.slice(25, 37); // S26 - S37
  const table4Sums = abacusSums.slice(37, 50); // S38 - S50

  return (
<div
  className="fixed inset-0 z-[99999] isolate overflow-y-auto bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-start py-3 px-2 sm:px-4"
  style={{ minHeight: '100dvh' }}
>      {/* Print stylesheet */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .printable-booklet, .printable-booklet * {
            visibility: visible !important;
          }
          .printable-booklet {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            background: white !important;
          }
          .page-break-after-always {
            page-break-after: always !important;
            break-after: page !important;
            margin-bottom: 0 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* =========================================================================
          TOP ACTION TOOLBAR
          ========================================================================= */}
<div className="no-print w-full max-w-[840px] bg-[#0c234b] text-white px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-2xl flex flex-wrap items-center justify-between gap-2 sticky top-2 z-[100000] border border-amber-400/40 mb-3">        {/* Left: Back button & Title */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs font-black">
            <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="truncate max-w-[140px] sm:max-w-[200px] text-white">
              {studentDetails.testBookletTitle}
            </span>
          </div>
        </div>

        {/* Center: Tabs */}
        <div className="flex items-center bg-black/25 p-0.5 rounded-lg text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('both')}
            className={`px-2 py-1 rounded-md transition ${
              activeTab === 'both' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-slate-200 hover:text-white'
            }`}
          >
            Both Pages
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('page1')}
            className={`px-2 py-1 rounded-md transition ${
              activeTab === 'page1' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-slate-200 hover:text-white'
            }`}
          >
            Page 1: Grade Card
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('page2')}
            className={`px-2 py-1 rounded-md transition ${
              activeTab === 'page2' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-slate-200 hover:text-white'
            }`}
          >
            Page 2: Question Paper
          </button>
        </div>

        {/* Right: Super Admin Edit Toggle, Answers, PDF & Print */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Edit Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1 cursor-pointer ${
              isEditMode
                ? 'bg-rose-500 hover:bg-rose-600 text-white ring-2 ring-rose-300'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
            title="Toggle Super Admin Edit Mode"
          >
            {isEditMode ? <Unlock className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditMode ? 'Editing Active' : 'Edit Template'}</span>
          </button>

          {/* Answer Key Toggle */}
          <button
            type="button"
            onClick={() => setShowAnswerKey(!showAnswerKey)}
            className={`px-2 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              showAnswerKey ? 'bg-sky-500/30 text-sky-200 border border-sky-400/50' : 'bg-white/10 text-slate-300 hover:text-white'
            }`}
            title="Toggle Red Answers vs Blank Student Boxes"
          >
            {showAnswerKey ? <Eye className="w-3.5 h-3.5 text-amber-300" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{showAnswerKey ? 'Answers: ON' : 'Answers: OFF'}</span>
          </button>

          {/* Download PDF */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 rounded-lg text-xs font-black transition flex items-center gap-1 shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isGeneratingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isGeneratingPdf ? 'Exporting...' : 'PDF'}</span>
          </button>

          {/* Print */}
          <button
            type="button"
            onClick={handlePrint}
            className="p-1.5 bg-white/15 hover:bg-white/25 active:scale-95 text-white rounded-lg transition cursor-pointer"
            title="Print Question Paper"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          SUPER ADMIN EDIT CONTROLS BANNER (VISIBLE WHEN EDIT MODE IS ACTIVE)
          ========================================================================= */}
      {isEditMode && (
        <div className="no-print w-full max-w-[840px] bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 px-3.5 py-2 rounded-xl shadow-lg border border-amber-300 flex items-center justify-between gap-2 mb-3 flex-wrap animate-in fade-in duration-150">
          <div className="flex items-center gap-2 text-xs font-black">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            <span>Super Admin Edit Mode:</span>
            <span className="font-semibold text-slate-900 hidden sm:inline">
              Click any field or number to edit in-place.
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={autoCalculateAllAnswers}
              className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-950 rounded text-[11px] font-black transition flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <Calculator className="w-3 h-3 text-sky-700" />
              <span>Auto-Calculate</span>
            </button>

            <button
              type="button"
              onClick={generateRandomSums}
              className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-950 rounded text-[11px] font-black transition flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-700" />
              <span>Randomize Sums</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-white rounded text-[11px] font-black transition flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <Save className="w-3 h-3 text-emerald-400" />
              <span>Save Changes</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-2 py-1 bg-rose-700 hover:bg-rose-800 text-white rounded text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
              title="Reset to default template"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {saveSuccessMsg && (
        <div className="no-print fixed top-16 z-50 bg-emerald-600 text-white text-xs font-black px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-emerald-300 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* =========================================================================
          PRINTABLE & VIEWABLE TEST BOOKLET CONTAINER
          ========================================================================= */}
      <div className="printable-booklet w-full flex flex-col items-center gap-6">

        {/* =========================================================================
            PAGE 1: STUDENT & EXAM DETAILS + GRADE CARD / RESULT SHEET
            ========================================================================= */}
        {(activeTab === 'both' || activeTab === 'page1') && (
          <div
            ref={page1Ref}
            className="print-page-1 page-break-after-always relative block w-full max-w-[720px] bg-white shadow-2xl rounded-sm select-text text-slate-900 border border-slate-300 p-4 sm:p-5 mx-auto font-sans text-xs"
            style={{
              fontFamily: "'Segoe UI', Arial, Helvetica, sans-serif",
            }}
          >
            {/* Double Border Frame around Page 1 */}
            <div className="border-4 border-double border-[#0c234b] p-3 sm:p-4">

              {/* 1. TOP HEADER LOGOS & CREST */}
              <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#0c234b] gap-2">
                {/* B★SEL Logo */}
                <div className="flex flex-col items-center text-center max-w-[130px]">
                  <img
                    src="/bsel_logo.png"
                    alt="B★SEL Logo"
                    className="h-10 sm:h-12 w-auto object-contain"
                  />
                  <span className="text-[8px] font-black uppercase tracking-wider text-[#0c234b] mt-0.5 leading-tight">
                    BOARD OF SKILLS AND EDUCATIONAL LEARNING
                  </span>
                </div>

                {/* Center Rising Stars Vision Foundation */}
                <div className="flex flex-col items-center text-center px-1">
                  <img
                    src="/rising_stars_white_bg.png"
                    alt="Rising Stars Vision Foundation"
                    className="h-10 sm:h-12 w-auto object-contain"
                  />
                  <h2 className="text-[11px] sm:text-[13px] font-black text-[#0c234b] tracking-wider uppercase mt-0.5">
                    RISING STARS VISION FOUNDATION
                  </h2>
                  <span className="text-[8px] font-bold text-amber-700 tracking-widest uppercase">
                    EDUCATION • EMPOWERMENT • EXCELLENCE
                  </span>
                </div>

                {/* Right Seal */}
                <div className="flex flex-col items-center text-center max-w-[100px]">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-amber-600 flex flex-col items-center justify-center p-0.5 text-center text-[#0c234b]">
                    <span className="text-[7px] font-black uppercase">TRUST</span>
                    <span className="text-[9px] font-black">REGD</span>
                    <span className="text-[6.5px] font-bold">TN/MSME</span>
                  </div>
                </div>
              </div>

              {/* 2. SECTION 1: STUDENT & EXAM DETAILS */}
              <div className="mt-2.5">
                <div className="bg-[#0c234b] text-white py-1 px-3 text-center text-xs font-black tracking-widest uppercase rounded-xs">
                  STUDENT & EXAM DETAILS
                </div>

                <div className="grid grid-cols-12 gap-2 mt-2 pt-1">
                  {/* Left Column: Student Details Key-Values */}
                  <div className="col-span-8 sm:col-span-9 space-y-1 text-[11px]">
                    {[
                      { label: 'Registration No.', field: 'regNo' },
                      { label: 'Certificate No.', field: 'certNo' },
                      { label: 'Student Name', field: 'studentName', bold: true },
                      { label: 'Parent / Guardian', field: 'parentName' },
                      { label: 'Date of Birth', field: 'dob' },
                      { label: 'Course', field: 'course', bold: true },
                      { label: 'Level', field: 'level' },
                      { label: 'Duration', field: 'duration' },
                      { label: 'School / Exam Centre', field: 'school', bold: true },
                      { label: 'Address', field: 'address' },
                    ].map((row) => (
                      <div key={row.field} className="flex items-center text-[10.5px]">
                        <span className="w-36 font-bold text-slate-800 shrink-0">
                          {row.label}
                        </span>
                        <span className="font-bold text-slate-600 mr-2 shrink-0">:</span>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={studentDetails[row.field]}
                            onChange={(e) => updateDetail(row.field, e.target.value)}
                            className="flex-1 px-1.5 py-0.5 border border-sky-400 bg-sky-50 font-bold text-slate-900 rounded text-[10.5px] focus:outline-none focus:ring-1 focus:ring-sky-500"
                          />
                        ) : (
                          <span
                            className={`font-semibold text-slate-950 truncate ${
                              row.bold ? 'font-black text-[#0c234b]' : ''
                            }`}
                          >
                            {studentDetails[row.field]}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Right Column: MindSpark Booklet Badge + Category + Student Photo */}
                  <div className="col-span-4 sm:col-span-3 flex flex-col items-center justify-between gap-1.5 pl-2 border-l border-slate-200">
                    {/* BSEL MindSpark ABACUS TEST BOOKLET logo badge */}
                    <div className="border border-sky-300 bg-sky-50 px-2 py-1 rounded text-center w-full">
                      <span className="text-[7.5px] font-black uppercase text-sky-900 block leading-tight">
                        BSEL MindSpark
                      </span>
                      <span className="text-[9.5px] font-black text-[#0c234b] block">
                        ABACUS
                      </span>
                      <span className="text-[7px] font-bold text-amber-700 uppercase block tracking-wider">
                        TEST BOOKLET
                      </span>
                    </div>

                    {/* Category Box */}
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-10 h-10 bg-[#0c234b] text-white rounded-md flex items-center justify-center border-2 border-amber-400 shadow-xs">
                        {isEditMode ? (
                          <input
                            type="text"
                            maxLength={2}
                            value={studentDetails.category}
                            onChange={(e) => updateDetail('category', e.target.value.toUpperCase())}
                            className="w-8 text-center bg-transparent font-black text-amber-300 text-lg uppercase outline-none"
                          />
                        ) : (
                          <span className="text-xl font-black text-amber-300">
                            {studentDetails.category}
                          </span>
                        )}
                      </div>
                      <span className="text-[7.5px] font-black uppercase tracking-wider text-slate-700 mt-0.5">
                        CATEGORY
                      </span>
                    </div>

                    {/* Passport Photo Box */}
                    <div className="w-20 h-24 sm:w-22 sm:h-26 border-2 border-dashed border-slate-400 bg-slate-50 flex items-center justify-center overflow-hidden rounded-xs p-0.5 shadow-xs">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt="Student"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[8px] font-bold text-slate-400 text-center uppercase p-1">
                          Passport Photo
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. SECTION 2: GRADE CARD / RESULT SHEET */}
              <div className="mt-3">
                <div className="bg-[#0c234b] text-white py-1 px-3 text-center text-xs font-black tracking-widest uppercase rounded-xs">
                  GRADE CARD / RESULT SHEET
                </div>

                <div className="bg-slate-100 text-[#0c234b] py-0.5 px-2 text-center text-[10px] font-black uppercase tracking-wider border-x border-[#0c234b] mt-0.5">
                  SUBJECTS & MARKS OBTAINED
                </div>

                {/* Table of Marks */}
                <table className="w-full border-collapse border border-[#0c234b] text-[10.5px] text-center mt-0.5">
                  <thead>
                    <tr className="bg-[#0c234b] text-white font-black text-[10px]">
                      <th className="border border-[#0c234b] py-1 px-1.5 w-10">S.No.</th>
                      <th className="border border-[#0c234b] py-1 px-2 text-left">Subject / Module</th>
                      <th className="border border-[#0c234b] py-1 px-1.5 w-20">Max Marks</th>
                      <th className="border border-[#0c234b] py-1 px-1.5 w-20">Assessment</th>
                      <th className="border border-[#0c234b] py-1 px-1.5 w-24">Marks Obtained</th>
                      <th className="border border-[#0c234b] py-1 px-1.5 w-20">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((sub, idx) => (
                      <tr
                        key={sub.id}
                        className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                      >
                        <td className="border border-slate-300 py-1 font-bold">{sub.id}</td>
                        <td className="border border-slate-300 py-1 px-2 text-left font-bold text-slate-900">
                          {isEditMode ? (
                            <input
                              type="text"
                              value={sub.name}
                              onChange={(e) => updateSubject(sub.id, 'name', e.target.value)}
                              className="w-full px-1 border border-sky-400 rounded bg-sky-50 text-[10.5px]"
                            />
                          ) : (
                            sub.name
                          )}
                        </td>
                        <td className="border border-slate-300 py-1 font-semibold">
                          {isEditMode ? (
                            <input
                              type="number"
                              value={sub.max}
                              onChange={(e) => updateSubject(sub.id, 'max', e.target.value)}
                              className="w-12 text-center border border-sky-400 rounded bg-sky-50 text-[10.5px]"
                            />
                          ) : (
                            sub.max
                          )}
                        </td>
                        <td className="border border-slate-300 py-1 font-semibold">
                          {isEditMode ? (
                            <input
                              type="number"
                              value={sub.assessment}
                              onChange={(e) => updateSubject(sub.id, 'assessment', e.target.value)}
                              className="w-12 text-center border border-sky-400 rounded bg-sky-50 text-[10.5px]"
                            />
                          ) : (
                            sub.assessment
                          )}
                        </td>
                        <td className="border border-slate-300 py-1 font-black text-[#0c234b]">
                          {isEditMode ? (
                            <input
                              type="number"
                              value={sub.marks}
                              onChange={(e) => updateSubject(sub.id, 'marks', e.target.value)}
                              className="w-14 text-center border border-sky-400 rounded bg-sky-50 font-black text-[10.5px]"
                            />
                          ) : (
                            sub.marks
                          )}
                        </td>
                        <td className="border border-slate-300 py-1 font-black text-emerald-700">
                          {sub.pct}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Grade Scale Note */}
                <div className="text-[7.5px] sm:text-[8px] text-slate-600 text-center py-1 border-b border-slate-300 italic">
                  Grade Details: 85-100% A+ (Excellent) &nbsp; 75-84% A (Very Good) &nbsp; 60-74% B (Good) &nbsp; 40-59% C (Satisfactory) &nbsp; Below 40% F (Failure)
                </div>

                {/* Summary Row */}
                <div className="grid grid-cols-12 gap-2 mt-1.5 text-center text-xs">
                  <div className="col-span-3 border border-[#0c234b] py-1 bg-slate-50">
                    <span className="block text-[8px] font-bold uppercase text-slate-500">Total Marks</span>
                    <strong className="text-[11px] font-black text-slate-900">{totalMax}</strong>
                  </div>
                  <div className="col-span-3 border border-[#0c234b] py-1 bg-slate-50">
                    <span className="block text-[8px] font-bold uppercase text-slate-500">Marks Obtained</span>
                    <strong className="text-[11px] font-black text-[#0c234b]">{totalObtained}</strong>
                  </div>
                  <div className="col-span-3 border border-[#0c234b] py-1 bg-slate-50">
                    <span className="block text-[8px] font-bold uppercase text-slate-500">Percentage</span>
                    <strong className="text-[11px] font-black text-emerald-700">{percentage}%</strong>
                  </div>
                  <div className="col-span-3 border border-[#0c234b] py-1 bg-[#0c234b] text-white">
                    <span className="block text-[8px] font-bold uppercase text-amber-300">Grade</span>
                    <strong className="text-sm font-black text-amber-300">{overallGrade}</strong>
                  </div>
                </div>

                {/* Remarks & Date of Issue */}
                <div className="grid grid-cols-12 gap-2 mt-2">
                  <div className="col-span-8 border border-slate-300 p-1.5 rounded-xs bg-slate-50/50 flex flex-col justify-between">
                    <div className="flex items-center gap-1 text-[9px] font-bold text-amber-700 uppercase">
                      <span>★</span>
                      <span>Remarks</span>
                    </div>
                    {isEditMode ? (
                      <textarea
                        rows={2}
                        value={studentDetails.remarks}
                        onChange={(e) => updateDetail('remarks', e.target.value)}
                        className="w-full mt-1 p-1 text-[10px] border border-sky-400 bg-sky-50 rounded"
                      />
                    ) : (
                      <p className="text-[10px] font-semibold text-slate-800 italic mt-0.5">
                        "{studentDetails.remarks}"
                      </p>
                    )}
                  </div>

                  <div className="col-span-4 border border-slate-300 p-1.5 rounded-xs bg-slate-50/50 flex flex-col justify-between">
                    <span className="text-[8px] font-bold uppercase text-slate-500">Date of Issue</span>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={studentDetails.dateOfIssue}
                        onChange={(e) => updateDetail('dateOfIssue', e.target.value)}
                        className="w-full text-[10px] font-bold p-0.5 border border-sky-400 bg-sky-50 rounded"
                      />
                    ) : (
                      <strong className="text-[10.5px] font-black text-slate-900 mt-1 block">
                        {studentDetails.dateOfIssue}
                      </strong>
                    )}
                  </div>
                </div>

                {/* Signatures & Seals Footer */}
                <div className="mt-4 pt-3 flex items-end justify-between text-[8px] text-center gap-2">
                  <div className="w-36 flex flex-col items-center">
                    <div className="w-full border-b border-slate-400 pb-4 mb-1" />
                    <span className="font-bold text-slate-800">Center Director / Principal</span>
                  </div>

                  <div className="flex flex-col items-center text-[7.5px] font-bold text-slate-600">
                    <span className="uppercase tracking-wider">REGISTERED UNDER MINISTRY OF MSME, GOVT. OF INDIA</span>
                    <span className="uppercase tracking-wider text-amber-800 mt-0.5">REGISTERED UNDER GOVT. OF TAMIL NADU (REGD. TRUST)</span>
                  </div>

                  <div className="w-36 flex flex-col items-center">
                    <div className="w-12 h-6 border border-emerald-600 rounded-sm mb-1 text-[7px] text-emerald-700 flex items-center justify-center font-bold">
                      VERIFIED
                    </div>
                    <div className="w-full border-b border-slate-400 mb-1" />
                    <span className="font-bold text-slate-800">Authorized Signature</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            PAGE 2: S1 - ABACUS OPERATIONS (50 SUMS QUESTION PAPER)
            ========================================================================= */}
        {(activeTab === 'both' || activeTab === 'page2') && (
          <div
            ref={page2Ref}
            className="print-page-2 relative block w-full max-w-[720px] bg-white shadow-2xl rounded-sm select-text text-slate-900 border border-slate-300 p-3 sm:p-4 mx-auto font-sans text-xs"
            style={{
              fontFamily: "'Segoe UI', Arial, Helvetica, sans-serif",
            }}
          >
            {/* Outer Deep Navy Border */}
            <div className="border-[3px] border-[#0c234b] p-2.5 sm:p-3 relative">

              {/* 1. PLAYFUL HEADER WITH CARTOON MOTIFS & TEST B★SEL CREST */}
              <div className="relative w-full border-b-2 border-[#0c234b] pb-2 overflow-hidden bg-gradient-to-b from-sky-100/70 via-sky-50/40 to-white pt-1 px-2 rounded-t-xs">
                {/* SVG Playful Illustrations (Sun, Clouds, Mascot, Kites, Kids) */}
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

                  {/* Right: Sun & Mascot Illustration */}
                  <div className="flex items-center gap-1.5 opacity-90">
                    <svg className="w-8 h-8 text-amber-400" viewBox="0 0 36 36" fill="currentColor">
                      <circle cx="18" cy="18" r="9" fill="#f59e0b" />
                      <path d="M18 2v4M18 30v4M2 18h4M30 18h4M6.7 6.7l2.8 2.8M26.5 26.5l2.8 2.8M6.7 29.3l2.8-2.8M26.5 9.5l2.8-2.8" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
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
                      {studentDetails.studentName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[9.5px]">
                    <span>Reg: <strong className="font-mono font-black">{studentDetails.regNo}</strong></span>
                    <span>Level: <strong>{studentDetails.level.split(' ')[0] || 'L1'}</strong></span>
                    <span className="bg-[#0c234b] text-amber-300 font-black px-2 py-0.5 rounded-full text-[8px]">
                      B★SEL
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Body with Vertical Left Sidebar Ribbon */}
              <div className="relative flex gap-2 mt-2">
                {/* Left Vertical Ribbon: B * S E L in black boxes */}
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

                  {/* -------------------------------------------------------------
                      SECTION 1: S1 - ABACUS OPERATIONS (1-DIGIT SUMS)
                      ------------------------------------------------------------- */}
                  <div className="space-y-1">
                    {/* Header Banner */}
                    <div className="text-center">
                      <h3 className="text-xs font-black uppercase text-[#0c234b] underline tracking-wider">
                        {isEditMode ? (
                          <input
                            type="text"
                            value={studentDetails.section1Title}
                            onChange={(e) => updateDetail('section1Title', e.target.value)}
                            className="text-center border border-sky-400 bg-sky-50 px-2 py-0.5 rounded text-xs font-black"
                          />
                        ) : (
                          studentDetails.section1Title
                        )}
                      </h3>
                      <p className="text-[9px] text-slate-700 italic font-semibold">
                        "{studentDetails.section1Instruction}"
                      </p>
                    </div>

                    {/* Blue Title Banner */}
                    <div className="bg-[#0c234b] text-white flex items-center justify-between px-2 py-0.5 text-[9px] font-black tracking-wider uppercase rounded-xs">
                      <span>B★SEL-L1</span>
                      <span>MAX MARK[{studentDetails.maxMarks1}]: -[1]:</span>
                      <span className="text-amber-300">ALL THE BEST</span>
                      <span>*Time: {studentDetails.timeAllowed1}*</span>
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
                                  {isEditMode ? (
                                    <input
                                      type="number"
                                      value={s.nums[rowIdx] ?? ''}
                                      onChange={(e) => updateSumNumber(s.id, rowIdx, e.target.value)}
                                      className="w-full text-center border border-sky-300 bg-sky-50 rounded text-[9.5px] p-0 font-bold"
                                    />
                                  ) : (
                                    s.nums[rowIdx] ?? ''
                                  )}
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
                                  isEditMode ? (
                                    <input
                                      type="number"
                                      value={s.ans}
                                      onChange={(e) => updateSumAnswer(s.id, e.target.value)}
                                      className="w-full text-center font-black text-rose-600 border border-rose-300 rounded text-[10px] p-0"
                                    />
                                  ) : (
                                    s.ans
                                  )
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
                                  {isEditMode ? (
                                    <input
                                      type="number"
                                      value={s.nums[rowIdx] ?? ''}
                                      onChange={(e) => updateSumNumber(s.id, rowIdx, e.target.value)}
                                      className="w-full text-center border border-sky-300 bg-sky-50 rounded text-[9.5px] p-0 font-bold"
                                    />
                                  ) : (
                                    s.nums[rowIdx] ?? ''
                                  )}
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
                                  isEditMode ? (
                                    <input
                                      type="number"
                                      value={s.ans}
                                      onChange={(e) => updateSumAnswer(s.id, e.target.value)}
                                      className="w-full text-center font-black text-rose-600 border border-rose-300 rounded text-[10px] p-0"
                                    />
                                  ) : (
                                    s.ans
                                  )
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

                  {/* -------------------------------------------------------------
                      SECTION 2: S1 - ABACUS OPERATIONS (2-DIGIT SUMS)
                      ------------------------------------------------------------- */}
                  <div className="space-y-1 pt-1 border-t border-slate-300">
                    {/* Header Banner */}
                    <div className="text-center">
                      <h3 className="text-xs font-black uppercase text-[#0c234b] underline tracking-wider">
                        {isEditMode ? (
                          <input
                            type="text"
                            value={studentDetails.section2Title}
                            onChange={(e) => updateDetail('section2Title', e.target.value)}
                            className="text-center border border-sky-400 bg-sky-50 px-2 py-0.5 rounded text-xs font-black"
                          />
                        ) : (
                          studentDetails.section2Title
                        )}
                      </h3>
                      <p className="text-[9px] text-slate-700 italic font-semibold">
                        "{studentDetails.section2Instruction}"
                      </p>
                    </div>

                    {/* Blue Title Banner */}
                    <div className="bg-[#0c234b] text-white flex items-center justify-between px-2 py-0.5 text-[9px] font-black tracking-wider uppercase rounded-xs">
                      <span>B★SEL-L1</span>
                      <span>MAX MARK[{studentDetails.maxMarks2}]: -[1]:</span>
                      <span className="text-amber-300">ALL THE BEST</span>
                      <span>*Time: {studentDetails.timeAllowed2}*</span>
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
                                  {isEditMode ? (
                                    <input
                                      type="number"
                                      value={s.nums[rowIdx] ?? ''}
                                      onChange={(e) => updateSumNumber(s.id, rowIdx, e.target.value)}
                                      className="w-full text-center border border-sky-300 bg-sky-50 rounded text-[9.5px] p-0 font-bold"
                                    />
                                  ) : (
                                    s.nums[rowIdx] ?? ''
                                  )}
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
                                  isEditMode ? (
                                    <input
                                      type="number"
                                      value={s.ans}
                                      onChange={(e) => updateSumAnswer(s.id, e.target.value)}
                                      className="w-full text-center font-black text-rose-600 border border-rose-300 rounded text-[10px] p-0"
                                    />
                                  ) : (
                                    s.ans
                                  )
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
                                  {isEditMode ? (
                                    <input
                                      type="number"
                                      value={s.nums[rowIdx] ?? ''}
                                      onChange={(e) => updateSumNumber(s.id, rowIdx, e.target.value)}
                                      className="w-full text-center border border-sky-300 bg-sky-50 rounded text-[9.5px] p-0 font-bold"
                                    />
                                  ) : (
                                    s.nums[rowIdx] ?? ''
                                  )}
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
                                  isEditMode ? (
                                    <input
                                      type="number"
                                      value={s.ans}
                                      onChange={(e) => updateSumAnswer(s.id, e.target.value)}
                                      className="w-full text-center font-black text-rose-600 border border-rose-300 rounded text-[10px] p-0"
                                    />
                                  ) : (
                                    s.ans
                                  )
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

              {/* Center Code */}
              <div className="mt-2 text-center text-[10px] font-black text-slate-900 tracking-wider">
                {isEditMode ? (
                  <input
                    type="text"
                    value={studentDetails.paperCode}
                    onChange={(e) => updateDetail('paperCode', e.target.value)}
                    className="text-center border border-sky-400 rounded px-2 py-0.5 font-black text-[10px]"
                  />
                ) : (
                  studentDetails.paperCode
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
