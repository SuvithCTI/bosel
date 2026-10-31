import React, { useRef, useState } from 'react';
import { ArrowLeft, Download, Printer, Loader2 } from 'lucide-react';
import { exportPdfFromElement } from '../utils/pdfExport';
import { getStudentPhotoUrl, getStudentRegisterNumber } from '../pages/AdminDashboard';

// Course-specific 5 modules matching official B★SEL curriculum
export const getCourseSubjectModules = (courseName = '') => {
  const c = courseName.toLowerCase();

  if (c.includes('handwrit')) {
    return [
      { id: 1, name: 'Basic Letter Formation & Slant', max: 100, practical: 100, marks: 96, pct: '96%' },
      { id: 2, name: 'Cursive Flow & Speed Drills', max: 100, practical: 100, marks: 98, pct: '98%' },
      { id: 3, name: 'Word Spacing & Proportions', max: 100, practical: 100, marks: 94, pct: '94%' },
      { id: 4, name: 'Rapid Transcription Test', max: 100, practical: 100, marks: 97, pct: '97%' },
      { id: 5, name: 'Notebook Presentation & Exam', max: 100, practical: 100, marks: 95, pct: '95%' }
    ];
  }

  if (c.includes('art') || c.includes('draw')) {
    return [
      { id: 1, name: 'Freehand Drawing & Sketching', max: 100, practical: 100, marks: 96, pct: '96%' },
      { id: 2, name: 'Colour Theory & Shading Techniques', max: 100, practical: 100, marks: 98, pct: '98%' },
      { id: 3, name: 'Creative Composition & Theme', max: 100, practical: 100, marks: 94, pct: '94%' },
      { id: 4, name: 'Object & Perspective Drawing', max: 100, practical: 100, marks: 97, pct: '97%' },
      { id: 5, name: 'Art Portfolio & Viva Voce', max: 100, practical: 100, marks: 95, pct: '95%' }
    ];
  }

  if (c.includes('python') || c.includes('code') || c.includes('comput')) {
    return [
      { id: 1, name: 'Computer Fundamentals & Logic', max: 100, practical: 100, marks: 96, pct: '96%' },
      { id: 2, name: 'Programming Syntax & Functions', max: 100, practical: 100, marks: 98, pct: '98%' },
      { id: 3, name: 'Data Structures & Problem Solving', max: 100, practical: 100, marks: 94, pct: '94%' },
      { id: 4, name: 'Software Development Lab', max: 100, practical: 100, marks: 97, pct: '97%' },
      { id: 5, name: 'Technical Viva & Project Evaluation', max: 100, practical: 100, marks: 95, pct: '95%' }
    ];
  }

  // Default: Abacus Speed Arithmetic (matches exact template text)
  return [
    { id: 1, name: 'Abacus Operations', max: 100, practical: 100, marks: 96, pct: '96%' },
    { id: 2, name: 'Mental Arithmetic', max: 100, practical: 100, marks: 98, pct: '98%' },
    { id: 3, name: 'Abacus Calculation', max: 100, practical: 100, marks: 94, pct: '94%' },
    { id: 4, name: 'Rapid Calculation', max: 100, practical: 100, marks: 97, pct: '97%' },
    { id: 5, name: 'Numerical Proficiency', max: 100, practical: 100, marks: 95, pct: '95%' }
  ];
};

export default function OfficialMarksheetView({ student, onClose }) {
  const sheetRef = useRef(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showMarks, setShowMarks] = useState(false);

  if (!student) return null;

  const courseName = student.program || student.courseName || 'Abacus Speed Arithmetic';
  const isAbacus = courseName.toLowerCase().includes('abacus');
  const subjects = getCourseSubjectModules(courseName);

  const totalMax = subjects.reduce((sum, s) => sum + s.max, 0);
  const totalMarks = subjects.reduce((sum, s) => sum + s.marks, 0);
  const percentage = ((totalMarks / totalMax) * 100).toFixed(1);
  const overallGrade = percentage >= 95 ? 'A+' : percentage >= 85 ? 'A' : 'B+';
  const regNo = getStudentRegisterNumber(student);
  const serialNo = student.registrationNo || student.serialNo || student.userId || 'BSEL27-003';
  const photoUrl = getStudentPhotoUrl(student);

  // Format date of issue (e.g. 31 Oct 2026 or 31-10-2026)
  const formatIssueDate = (dateStr) => {
    if (!dateStr) return '31 Oct 2026';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };
  const issueDate = formatIssueDate(student.enrolmentDate || new Date());

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!sheetRef.current || isGeneratingPdf) return;
    setIsGeneratingPdf(true);

    try {
      const filename = `${regNo}_${student.studentName || 'Student'}_Grade_Card_Marksheet.pdf`;
      await exportPdfFromElement(sheetRef.current, {
        filename,
        orientation: 'portrait',
        margin: 6,
        backgroundColor: '#ffffff',
        scale: 2.5
      });
    } catch (err) {
      console.error('PDF Generation failed:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Verified table row Y centers in percentage:
  const rowPositions = ['55.62%', '59.28%', '62.94%', '66.60%', '70.26%'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/85 backdrop-blur-xs flex flex-col items-center justify-start py-4 px-2 sm:px-4">
      {/* Print stylesheet override */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-marksheet-sheet, #printable-marksheet-sheet * {
            visibility: visible !important;
          }
          #printable-marksheet-sheet {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Top Controls Toolbar */}
      <div className="no-print w-full max-w-[682px] bg-[#0c234b] text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center justify-between gap-3 mb-3 sticky top-2 z-20 border border-amber-400/40">
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to student list</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowMarks(prev => !prev)}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-white/20"
            title="Toggle marks display on/off"
          >
            <span>{showMarks ? 'Remove Marks' : 'Show Marks'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isGeneratingPdf ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{isGeneratingPdf ? 'Downloading...' : 'Download PDF'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-[#163e7c] hover:bg-[#1f54a6] text-white rounded-lg text-xs font-black transition flex items-center gap-1.5 border border-white/20 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* 
        Marksheet Sheet Canvas:
        The wrapper is a block container shrink-wrapped around the in-flow template image.
        This guarantees 100% exact pixel-for-pixel alignment across any screen size, zoom, or print!
      */}
      <div
        id="printable-marksheet-sheet"
        ref={sheetRef}
        className="relative block w-full max-w-[682px] bg-white shadow-2xl rounded-none select-text text-slate-900 border border-slate-300 mx-auto"
        style={{
          fontFamily: "'Segoe UI', Arial, Helvetica, sans-serif"
        }}
      >
        {/* Official Background Template Canvas - In Normal Flow */}
        <img
          src="/marksheet_template_clean_2x.png"
          alt="B★SEL Official Marksheet Template"
          className="w-full h-auto block select-none pointer-events-none"
        />

        {/* =========================================================================
            DYNAMIC OVERLAYS (100% bound to image bounds)
            ========================================================================= */}
        <div className="absolute inset-0 pointer-events-none">
          
          {/* 1. Student Details (Left Column - aligned right of the colons at 28.01%) */}
          
          {/* Registration No. */}
          <div
            className="absolute font-black text-slate-950 tracking-wider font-mono text-[10.5px] sm:text-[13px] -translate-y-1/2"
            style={{ left: '28.01%', top: '21.19%' }}
          >
            {regNo}
          </div>

          {/* Serial No. */}
          <div
            className="absolute font-black text-slate-800 tracking-wider font-mono text-[10px] sm:text-[12px] -translate-y-1/2"
            style={{ left: '28.01%', top: '23.93%' }}
          >
            {serialNo}
          </div>

          {/* Student Name */}
          <div
            className="absolute font-black text-slate-950 uppercase tracking-wide text-[10.5px] sm:text-[13px] -translate-y-1/2"
            style={{ left: '28.01%', top: '26.56%' }}
          >
            {student.studentName || 'Student Name'}
          </div>

          {/* Parent / Guardian */}
          <div
            className="absolute font-bold text-slate-800 text-[10px] sm:text-[12px] -translate-y-1/2"
            style={{ left: '28.01%', top: '29.20%' }}
          >
            {student.parentName || student.fatherName || 'Guardian'}
          </div>

          {/* Date of Birth */}
          <div
            className="absolute font-bold text-slate-800 text-[10px] sm:text-[12px] -translate-y-1/2"
            style={{ left: '28.01%', top: '31.84%' }}
          >
            {student.dob || student.dateOfBirth || '2016-05-28 / 10'}
          </div>

          {/* Course */}
          <div
            className="absolute font-black text-[#0c234b] text-[10.5px] sm:text-[12.5px] -translate-y-1/2"
            style={{ left: '28.01%', top: '34.57%' }}
          >
            {courseName}
          </div>

          {/* Duration */}
          <div
            className="absolute font-bold text-slate-800 text-[10px] sm:text-[12px] -translate-y-1/2"
            style={{ left: '28.01%', top: '37.21%' }}
          >
            {student.duration || student.courseDuration || '6 Months'}
          </div>

          {/* School / Exam Centre */}
          <div
            className="absolute font-black text-slate-900 text-[9.5px] sm:text-[11.5px] -translate-y-1/2"
            style={{ left: '28.01%', top: '39.84%' }}
          >
            {student.branch || student.school || student.institution || 'Tenkasi Regional Branch'}
          </div>

          {/* Address */}
          <div
            className="absolute font-bold text-slate-700 text-[9px] sm:text-[11px] truncate max-w-[50%] -translate-y-1/2"
            style={{ left: '28.01%', top: '42.58%' }}
          >
            {student.address || student.district || 'Tenkasi, Tamil Nadu'}
          </div>

          {/* 2. QR Code Box (Inside the square frame at left: 64.96%, top: 27.44%) */}
          <div
            className="absolute bg-white flex items-center justify-center overflow-hidden p-0.5"
            style={{
              left: '64.96%',
              top: '27.44%',
              width: '11.58%',
              height: '7.71%'
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full text-[#0c234b]">
              <rect x="0" y="0" width="100" height="100" fill="white" />
              {/* Outer corner squares */}
              <rect x="8" y="8" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="6" />
              <rect x="16" y="16" width="12" height="12" fill="currentColor" />
              <rect x="64" y="8" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="6" />
              <rect x="72" y="16" width="12" height="12" fill="currentColor" />
              <rect x="8" y="64" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="6" />
              <rect x="16" y="72" width="12" height="12" fill="currentColor" />
              {/* QR Pattern dots */}
              <rect x="42" y="10" width="8" height="8" fill="currentColor" />
              <rect x="52" y="18" width="8" height="8" fill="currentColor" />
              <rect x="42" y="26" width="8" height="8" fill="currentColor" />
              <rect x="10" y="42" width="8" height="8" fill="currentColor" />
              <rect x="22" y="46" width="8" height="8" fill="currentColor" />
              <rect x="34" y="42" width="8" height="8" fill="currentColor" />
              <rect x="46" y="42" width="14" height="14" fill="currentColor" />
              <rect x="66" y="42" width="8" height="8" fill="currentColor" />
              <rect x="78" y="48" width="8" height="8" fill="currentColor" />
              <rect x="42" y="64" width="8" height="8" fill="currentColor" />
              <rect x="52" y="72" width="8" height="8" fill="currentColor" />
              <rect x="64" y="64" width="10" height="10" fill="currentColor" />
              <rect x="80" y="72" width="8" height="8" fill="currentColor" />
              <rect x="64" y="82" width="8" height="8" fill="currentColor" />
              <rect x="42" y="82" width="12" height="8" fill="currentColor" />
            </svg>
          </div>

          {/* 3. Student Photo Box (Inside the golden frame at left: 79.18%, top: 25.10%) */}
          <div
            className="absolute overflow-hidden bg-white"
            style={{
              left: '79.18%',
              top: '25.10%',
              width: '16.13%',
              height: '12.40%'
            }}
          >
            <img
              src={photoUrl}
              alt={student.studentName}
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* 4. Table Marks Rows */}
          {subjects.map((sub, idx) => {
            const topY = rowPositions[idx];
            return (
              <React.Fragment key={sub.id}>
                {/* Subject Name (rendered only when showMarks is true) */}
                {showMarks && (
                  <div
                    className="absolute font-bold text-slate-900 text-[8.5px] sm:text-[11px] truncate max-w-[21%] -translate-y-1/2"
                    style={{ left: '12.61%', top: topY }}
                  >
                    {sub.name}
                  </div>
                )}

                {/* Marks Columns (Rendered only when showMarks is true) */}
                {showMarks && (
                  <>
                    {/* Max Marks (Column Center: 42.38%) */}
                    <div
                      className="absolute font-semibold text-slate-800 text-[9.5px] sm:text-[12px] -translate-x-1/2 -translate-y-1/2 text-center"
                      style={{ left: '42.38%', top: topY }}
                    >
                      {sub.max}
                    </div>

                    {/* Practical (Column Center: 57.62%) */}
                    <div
                      className="absolute font-semibold text-slate-800 text-[9.5px] sm:text-[12px] -translate-x-1/2 -translate-y-1/2 text-center"
                      style={{ left: '57.62%', top: topY }}
                    >
                      {sub.practical}
                    </div>

                    {/* Marks Obtained (Column Center: 72.87%) */}
                    <div
                      className="absolute font-black text-[#0c234b] text-[10px] sm:text-[13px] -translate-x-1/2 -translate-y-1/2 text-center"
                      style={{ left: '72.87%', top: topY }}
                    >
                      {sub.marks}
                    </div>

                    {/* Percentage (Column Center: 88.12%) */}
                    <div
                      className="absolute font-bold text-slate-900 text-[9.5px] sm:text-[12px] -translate-x-1/2 -translate-y-1/2 text-center"
                      style={{ left: '88.12%', top: topY }}
                    >
                      {sub.pct}
                    </div>
                  </>
                )}
              </React.Fragment>
            );
          })}

          {/* 5. Summary Section (Center Y: 79.05% - Rendered only when showMarks is true) */}
          {showMarks && (
            <>
              {/* Total Marks (Column Center: 15.47%) */}
              <div
                className="absolute font-black text-slate-950 text-xs sm:text-base -translate-x-1/2 -translate-y-1/2 text-center"
                style={{ left: '15.47%', top: '79.05%' }}
              >
                {totalMax}
              </div>

              {/* Marks Obtained (Column Center: 38.49%) */}
              <div
                className="absolute font-black text-[#0c234b] text-xs sm:text-base -translate-x-1/2 -translate-y-1/2 text-center"
                style={{ left: '38.49%', top: '79.05%' }}
              >
                {totalMarks}
              </div>

              {/* Percentage (Column Center: 61.51%) */}
              <div
                className="absolute font-black text-emerald-800 text-xs sm:text-base -translate-x-1/2 -translate-y-1/2 text-center"
                style={{ left: '61.51%', top: '79.05%' }}
              >
                {percentage}%
              </div>

              {/* Grade (Box Center: 86.36%) */}
              <div
                className="absolute font-black text-[#b45309] text-sm sm:text-xl -translate-x-1/2 -translate-y-1/2 text-center"
                style={{ left: '86.36%', top: '79.05%' }}
              >
                {overallGrade}
              </div>
            </>
          )}

          {/* 6. Date of Issue (Box Center: 86.36%, Top: 85.20% - Rendered only when showMarks is true) */}
          {showMarks && (
            <div
              className="absolute font-black text-slate-900 font-mono text-[9px] sm:text-[11.5px] -translate-x-1/2 -translate-y-1/2 text-center whitespace-nowrap"
              style={{ left: '86.36%', top: '85.20%' }}
            >
              {issueDate}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
