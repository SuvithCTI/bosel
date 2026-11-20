import React, { useRef, useState, useEffect } from 'react';
import {
  ArrowLeft,
  Download,
  Printer,
  Loader2,
  Upload,
  Building2,
  Image as ImageIcon,
  X,
  PenTool,
} from 'lucide-react';

import { exportPdfFromElement } from '../utils/pdfExport';
import {
  getStudentPhotoUrl,
  getStudentRegisterNumber,
  getStudentScopeKey,
  readStudentCustomHeader,
  saveStudentCustomHeader,
  readStudentCustomSignature,
  saveStudentCustomSignature,
} from '../utils/studentDataHelpers';
import { getCoursePrefix, getActiveSession } from '../utils/authStorage';
import { getSavedMarksheet, getGrade } from '../utils/marksheetStorage';
import MarksheetTemplate from './MarksheetTemplate';

// ============================================================
// WATERMARK SETTINGS
// ============================================================

const WATERMARK_TEXT = 'B★SEL';
const WATERMARK_LOGO_SRC = '/bsel_logo.png';

const TILE_COLS = 16;
const TILE_ROWS = 48;
const TILE_FONT_SIZE = 11;
const TILE_OPACITY = 0.08;

const CENTER_OPACITY = 0.09;

// Default header values (right-side block of the marksheet)
const DEFAULT_SCHOOL_SUBTITLE = 'VISION FOUNDATION';
const DEFAULT_SCHOOL_MOTTO = 'EDUCATION · EMPOWERMENT · EXCELLENCE';

// ============================================================
// REMARK SETTINGS (based on overall percentage)
// ============================================================

const REMARK_RULES = [
  { min: 90, text: 'Exceptional Performance. Keep shining!' },
  { min: 75, text: 'Brilliant effort! Aiming for A+ next time.' },
  { min: 60, text: 'Great job! A little more focus and you will reach the top.' },
  { min: 40, text: "Don't give up, regular practice is the key to success." },
];

const REMARK_FALLBACK = "Don't worry, every expert was once a beginner.";

const getRemark = (pct) => {
  const n = Number(pct);
  const rule = REMARK_RULES.find((r) => n >= r.min);
  return rule ? rule.text : REMARK_FALLBACK;
};

// ============================================================
// COURSE SUBJECT MODULES
// ============================================================

const DEMO_MARKS = [96, 98, 94, 97, 95];

const COURSE_RULES = [
  [['html'], [
    'HTML5 Semantic Structure & Tags',
    'Forms, Input Validation & Tables',
    'Hyperlinks, Layouts & Media Tags',
    'Responsive Architecture & Web DOM',
    'Live Web Project & Viva Voce',
  ]],
  [['css'], [
    'CSS Syntax, Selectors & Cascade',
    'Box Model, Margins & Padding',
    'Flexbox & CSS Grid Page Layouts',
    'Media Queries & Responsive UI',
    'Web Styling Portfolio & Viva',
  ]],
  [['python'], [
    'Python Syntax & Data Types',
    'Control Flow & Conditional Logic',
    'Functions, Loops & String Handling',
    'Data Structures & Problem Solving',
    'Python Code Project & Viva Voce',
  ]],
  [['comput'], [
    'Computer Architecture & Hardware',
    'Operating Systems & File Handling',
    'Internet Security & Cyber Safety',
    'Keyboarding & Speed Typing Drills',
    'IT Application Lab & Viva Voce',
  ]],
  [['office', 'ms'], [
    'MS Word Document Formatting',
    'MS Excel Formulas & Data Charts',
    'MS PowerPoint Slide Design',
    'Office Automation & Productivity',
    'Applied Office Project & Viva',
  ]],
  [['photo'], [
    'Interface, Layers & Selection Tools',
    'Photo Retouching & Color Grading',
    'Masking & Creative Composition',
    'Banner, Poster & Graphic Design',
    'Design Portfolio Review & Viva',
  ]],
  [['canva'], [
    'Visual Design Hierarchy & Layouts',
    'Typography & Color Harmony',
    'Brand Kits & Social Media Assets',
    'Poster, Flyer & Presentation Deck',
    'Design Portfolio Assessment',
  ]],
  [['ai', 'artificial'], [
    'Fundamentals of Artificial Intelligence',
    'Prompt Engineering & Generative AI',
    'AI Multimedia & Visual Synthesis',
    'Digital Ethics & Fact Verification',
    'Applied AI Capstone Project & Viva',
  ]],
  [['handwrit', 'calligraph'], [
    'Basic Letter Formation & Slant',
    'Cursive Flow & Ligature Joins',
    'Word Spacing & Line Proportions',
    'Speed Transcription Under Clock',
    'Spotless Notebook Presentation',
  ]],
  [['art', 'draw'], [
    'Freehand Sketching & Line Contour',
    'Colour Theory & Shading Gradients',
    'Thematic Creative Composition',
    'Object, Perspective & Still Life',
    'Art Portfolio & Viva Voce',
  ]],
  [['phonic', 'read'], [
    '42 Core Phonemes & Letter Sounds',
    'CVC Word Blending & Segmenting',
    'Digraphs, Diphthongs & Sight Words',
    'Oral Reading Fluency & Expression',
    'Reading Comprehension & Viva',
  ]],
  [['memory', 'mnemon'], [
    'Cognitive Concentration & Focus',
    'Number Pegs & Mnemonic Systems',
    'Memory Palace (Method of Loci)',
    'Speed Face & Name Retention Drills',
    'Memory Olympiad Practical Exam',
  ]],
  [['dance', 'bharatanatyam'], [
    'Adavus & Basic Footwork Drills',
    'Asamyutta & Samyutta Hastas (Mudras)',
    'Rhythm, Tala & Laya Precision',
    'Abhinaya, Facial Expression & Posture',
    'Recital Performance & Guru Viva',
  ]],
  [['language', 'speak'], [
    'Phonetics, Accent & Enunciation',
    'Grammar Foundations & Sentences',
    'Vocabulary & Contextual Phrases',
    'Public Speaking & Extempore Drills',
    'Conversational Fluency & Viva',
  ]],
  [['athletic', 'sport'], [
    'Physical Conditioning & Warm-up',
    'Sprint Technique & Cadence Drills',
    'Agility, Balance & Coordination',
    'Cardio Stamina & Field Endurance',
    'Athletic Track Benchmark Exam',
  ]],
];

const ABACUS_SUBJECTS = [
  'Abacus Operations & Bead Technique',
  'Small Friend & Big Friend Formulas',
  'Mental Arithmetic & Visual Anzan',
  'Rapid Multi-Row Calculation Drills',
  'Speed Arithmetic Accuracy & Viva',
];

// Each subject: Max 100 = Assessment 40 (average of 4 revision tests) + Exam 60 (final exam converted)
export const SUBJECT_COUNT = 5;
export const SUBJECT_MAX = 100;
export const REVISION_COUNT = 4;
export const REVISION_MAX = 40;
export const ASSESSMENT_MAX = 40;
export const EXAM_CONVERTED_MAX = 60;
export const TOTAL_MAX = 100;

export const rowPercent = (row) => {
  if (!row || row.marks === null || row.marks === undefined || !row.max) return null;
  const m = Number(row.marks);
  const mx = Number(row.max);
  if (!Number.isFinite(m) || !Number.isFinite(mx) || mx <= 0) return null;
  return (m / mx) * 100;
};

export const computeResult = (subjects = [], revisions = []) => {
  const numRevs = (revisions || []).map((r) => (r === '' || r === null || r === undefined ? null : Number(r)));
  const revFilled = numRevs.filter((r) => r !== null && Number.isFinite(r));
  const assessment = revFilled.length === REVISION_COUNT
    ? Math.round((revFilled.reduce((acc, v) => acc + v, 0) / REVISION_COUNT) * 100) / 100
    : (revFilled.length > 0 ? Math.round((revFilled.reduce((acc, v) => acc + v, 0) / revFilled.length) * 100) / 100 : null);

  const numSubs = (subjects || []).map((s) => (s === '' || s === null || s === undefined ? null : Number(s)));
  const subFilled = numSubs.filter((s) => s !== null && Number.isFinite(s));
  const examAvg = subFilled.length > 0
    ? subFilled.reduce((acc, v) => acc + v, 0) / subFilled.length
    : null;
  const examConverted = examAvg !== null ? Math.round(((examAvg * EXAM_CONVERTED_MAX) / 100) * 100) / 100 : null;

  const totalMarks = (assessment !== null && examConverted !== null)
    ? Math.round((assessment + examConverted) * 100) / 100
    : null;
  const percentage = totalMarks !== null ? totalMarks : null;

  const totalInputs = SUBJECT_COUNT + REVISION_COUNT;
  const filledCount = subFilled.length + revFilled.length;

  return {
    assessment,
    examConverted,
    totalMarks,
    percentage,
    revisions: numRevs,
    complete: filledCount === totalInputs,
    filled: filledCount,
    total: totalInputs
  };
};

export const getCourseSubjectModules = (courseName = '') => {
  const c = String(courseName).toLowerCase();
  const rule = COURSE_RULES.find(([keys]) => keys.some((k) => c.includes(k)));
  const names = rule ? rule[1] : ABACUS_SUBJECTS;

  return names.map((name, i) => ({
    id: i + 1,
    name,
    max: 100,
    assessment: 40,
    marks: DEMO_MARKS[i],
    pct: `${DEMO_MARKS[i]}%`,
  }));
};

// ============================================================
// HELPERS
// ============================================================

// Returns the first value that is a non-empty string
const firstText = (...values) =>
  values.find((v) => typeof v === 'string' && v.trim()) || '';

// Formats any number to exactly 2 decimals; returns '-' for empty values
const fmt2 = (v) => {
  if (v === null || v === undefined || v === '') return '-';
  const n = Number(v);
  return Number.isFinite(n) ? n.toFixed(2) : String(v);
};

// ============================================================
// WATERMARK LAYER
// ============================================================

const FRAME_CLIP = { x: 24, y: 24, width: 676, height: 976 };

// Tiled watermark (behind the template) plus the centre emblem.
// The tiles are masked out around the emblem with a soft fade, so the emblem sits on a clean background.
function BselWatermark() {
  const PAGE_W = 724;
  const PAGE_H = 1024;
  const cellW = PAGE_W / TILE_COLS;
  const cellH = PAGE_H / TILE_ROWS;

  // Straight grid: every row and column lines up
  const tiles = [];
  for (let r = 0; r < TILE_ROWS; r++) {
    for (let c = 0; c < TILE_COLS; c++) {
      tiles.push({
        key: `${r}-${c}`,
        x: c * cellW + cellW / 2,
        y: r * cellH + cellH / 2,
      });
    }
  }

  const EMBLEM_SIZE = 362;
  const EMBLEM_X = PAGE_W / 2 - EMBLEM_SIZE / 2;
  const EMBLEM_Y = PAGE_H / 2 - EMBLEM_SIZE / 2;

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      style={{ zIndex: 2 }}
    >
      <svg
        viewBox={`0 0 ${PAGE_W} ${PAGE_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <clipPath id="bsel-watermark-clip">
            <rect
              x={FRAME_CLIP.x}
              y={FRAME_CLIP.y}
              width={FRAME_CLIP.width}
              height={FRAME_CLIP.height}
            />
          </clipPath>

          {/* Soft radial fade: black = hide tiles (centre), white = show tiles (edges) */}
          <radialGradient id="bsel-emblem-fade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="black" />
            <stop offset="72%" stopColor="black" />
            <stop offset="100%" stopColor="white" />
          </radialGradient>

          <mask id="bsel-watermark-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={PAGE_W} height={PAGE_H}>
            <rect x="0" y="0" width={PAGE_W} height={PAGE_H} fill="white" />
            <rect
              x={EMBLEM_X}
              y={EMBLEM_Y}
              width={EMBLEM_SIZE}
              height={EMBLEM_SIZE}
              fill="url(#bsel-emblem-fade)"
            />
          </mask>
        </defs>

        <g clipPath="url(#bsel-watermark-clip)">
          <g mask="url(#bsel-watermark-mask)">
            {tiles.map((t) => (
              <text
                key={t.key}
                x={t.x}
                y={t.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily="'Times New Roman', Times, serif"
                fontWeight="700"
                fontSize={TILE_FONT_SIZE}
                fill="#0b2a55"
                fillOpacity={TILE_OPACITY}
              >
                {WATERMARK_TEXT}
              </text>
            ))}
          </g>
        </g>

        {/* Centre emblem: drawn last, on the clean area */}
        <image
          href={WATERMARK_LOGO_SRC}
          x={EMBLEM_X}
          y={EMBLEM_Y}
          width={EMBLEM_SIZE}
          height={EMBLEM_SIZE}
          opacity={CENTER_OPACITY}
          preserveAspectRatio="xMidYMid meet"
        />
      </svg>
    </div>
  );
}

// ============================================================
// OFFICIAL MARKSHEET COMPONENT
// ============================================================

export default function OfficialMarksheetView({
  student,
  onClose,
  standalone = false,
  defaultShowMarks = false,
  hideMarks = false,
  paperType = null,
  hideDownloadAndPrint = false,
}) {
  const sessionUser = getActiveSession();
  const isStaff = sessionUser?.role === 'Staff' || hideDownloadAndPrint;
  const sheetRef = useRef(null);
  const fileInputRef = useRef(null);

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showMarksFlag] = useState(defaultShowMarks);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);

  const schoolLogoInputRef = useRef(null);
  const directorSignInputRef = useRef(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const scopeKey = getStudentScopeKey(student);

  const defaultBranch =
    student?.branch ||
    student?.school ||
    student?.centreName ||
    student?.institution ||
    'RISING STARS';

  const defaultBranchName = String(defaultBranch).toUpperCase();

  // Resolves branding: student-level values first, then saved per-student values, then defaults
  const readBranding = () => {
    const saved = readStudentCustomHeader(scopeKey) || {};
    return {
      name: firstText(student?.schoolName, saved.name) || defaultBranchName,
      subtitle: firstText(student?.schoolSubtitle, saved.subtitle) || DEFAULT_SCHOOL_SUBTITLE,
      motto: firstText(student?.schoolMotto, saved.motto) || DEFAULT_SCHOOL_MOTTO,
      logo: student?.schoolLogo ?? saved.logo ?? null,
      sign:
        student?.directorSignature ??
        student?.signature ??
        readStudentCustomSignature(scopeKey) ??
        null,
    };
  };

  const [customDirectorSign, setCustomDirectorSign] = useState(() => readBranding().sign);
  const [customSchoolName, setCustomSchoolName] = useState(() => readBranding().name);
  const [customSchoolSubtitle, setCustomSchoolSubtitle] = useState(() => readBranding().subtitle);
  const [customSchoolMotto, setCustomSchoolMotto] = useState(() => readBranding().motto);
  const [customSchoolLogo, setCustomSchoolLogo] = useState(() => readBranding().logo);

  // Re-sync whenever student / scopeKey changes (prevent cross-student leakage)
  useEffect(() => {
    const b = readBranding();
    setCustomSchoolName(b.name);
    setCustomSchoolSubtitle(b.subtitle);
    setCustomSchoolMotto(b.motto);
    setCustomSchoolLogo(b.logo);
    setCustomDirectorSign(b.sign);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    scopeKey,
    defaultBranchName,
    student?.schoolName,
    student?.schoolSubtitle,
    student?.schoolMotto,
    student?.schoolLogo,
    student?.directorSignature,
  ]);

  // Live updates: franchise/school branding (shared) and per-student header/signature
  useEffect(() => {
    const handleFranchiseBrandingUpdate = (e) => {
      const fb = e.detail?.branding || e.detail?.franchise;
      if (fb) {
        if (fb.schoolName) setCustomSchoolName(fb.schoolName);
        if (fb.subtitle) setCustomSchoolSubtitle(fb.subtitle);
        if (fb.motto) setCustomSchoolMotto(fb.motto);
        if (fb.logo !== undefined) setCustomSchoolLogo(fb.logo);
        if (fb.signature !== undefined) setCustomDirectorSign(fb.signature);
      }
    };

    const handleHeaderUpdate = (e) => {
      if (e.detail?.scopeKey === scopeKey) {
        const d = e.detail.data;
        if (d?.name !== undefined) setCustomSchoolName(d.name);
        if (d?.subtitle !== undefined) setCustomSchoolSubtitle(d.subtitle);
        if (d?.motto !== undefined) setCustomSchoolMotto(d.motto);
        if (d?.logo !== undefined) setCustomSchoolLogo(d.logo);
      }
    };

    const handleSignUpdate = (e) => {
      if (e.detail?.scopeKey === scopeKey) {
        setCustomDirectorSign(e.detail.signature || null);
      }
    };

    window.addEventListener('bsel_franchise_branding_updated', handleFranchiseBrandingUpdate);
    window.addEventListener('bsel_school_branding_updated', handleFranchiseBrandingUpdate);
    window.addEventListener('bsel_student_custom_header_updated', handleHeaderUpdate);
    window.addEventListener('bsel_student_custom_signature_updated', handleSignUpdate);
    return () => {
      window.removeEventListener('bsel_franchise_branding_updated', handleFranchiseBrandingUpdate);
      window.removeEventListener('bsel_school_branding_updated', handleFranchiseBrandingUpdate);
      window.removeEventListener('bsel_student_custom_header_updated', handleHeaderUpdate);
      window.removeEventListener('bsel_student_custom_signature_updated', handleSignUpdate);
    };
  }, [scopeKey]);

  const handleSaveSchoolDetails = (name, subtitle, motto, logo) => {
    saveStudentCustomHeader(scopeKey, { name, subtitle, motto, logo });
  };

  const handleSchoolLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        setCustomSchoolLogo(dataUrl);
        handleSaveSchoolDetails(customSchoolName, customSchoolSubtitle, customSchoolMotto, dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDirectorSignChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        setCustomDirectorSign(dataUrl);
        saveStudentCustomSignature(scopeKey, dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveDirectorSign = () => {
    setCustomDirectorSign(null);
    saveStudentCustomSignature(scopeKey, null);
  };

  if (!student) return null;

  // ----------------------------------------------------------
  // STUDENT DATA
  // ----------------------------------------------------------

  const courseName = student.program || student.courseName || 'Abacus';

  const savedSheet = getSavedMarksheet(student);

  // Marks show only when the final result is complete (or when explicitly asked for)
  const showMarks = !hideMarks && (showMarksFlag || Boolean(savedSheet?.complete));

  const subjects = savedSheet?.subjects?.length
    ? savedSheet.subjects
    : getCourseSubjectModules(courseName);

  const totalMax = subjects.reduce(
    (sum, s) => sum + (Number(s.max) || 100),
    0
  );

  const totalMarks = subjects.reduce(
    (sum, s) => sum + (Number(s.marks) || 0),
    0
  );

  const percentage = totalMax
    ? ((totalMarks / totalMax) * 100).toFixed(2)
    : '0.00';

  const overallGrade = getGrade(Number(percentage));

  const remarkText = getRemark(percentage);

  const regNo =
    getStudentRegisterNumber(student) ||
    student.registrationNo ||
    'AB27-001';

  const coursePrefix = getCoursePrefix(courseName);
  const level = student.level || student.courseLevel || 'Level 1';

  const cleanLevel = String(level).replace(/\D/g, '') || '1';
  const regDigits = String(regNo).replace(/\D/g, '');

  const seqDigits = regDigits
    ? String(parseInt(regDigits.slice(-3), 10) || 1).padStart(4, '0')
    : '0001';

  let certNo = student.certificateNo;

  if (
    !certNo ||
    certNo === 'BSEL/ABACUS/L1/0007' ||
    (
      coursePrefix !== 'AB' &&
      (
        certNo.includes('ABACUS') ||
        certNo.includes('BSEL/AB/')
      )
    )
  ) {
    certNo = `BSEL/${coursePrefix}/L${cleanLevel}/${seqDigits}`;
  }

  const studentName = student.studentName || 'Candidate Name';
  const parentName = student.parentName || student.fatherName || 'Guardian';
  const dob = student.dob || student.dateOfBirth || '2016-05-28';
  const duration = student.duration || student.courseDuration || '6 Months';

  const school =
    student.branch ||
    student.school ||
    student.centreName ||
    student.institution ||
    'Tenkasi Branch';

  const address =
    student.address ||
    student.centreAddress ||
    student.district ||
    'Tenkasi, Tamil Nadu';

  const photoUrl = uploadedPhoto || getStudentPhotoUrl(student);

  // ----------------------------------------------------------
  // DATE FORMAT
  // ----------------------------------------------------------

  const formatIssueDate = (dateStr) => {
    if (!dateStr) return '05-10-2026';

    const d = new Date(dateStr);

    if (isNaN(d.getTime())) return dateStr;

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');

    return `${day}-${month}-${d.getFullYear()}`;
  };

  const issueDate = formatIssueDate(
    student.enrolmentDate ||
    student.issueDate ||
    '05-10-2026'
  );

  // ----------------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------------

  const handlePrint = () => {
    if (isStaff) return;
    window.print();
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      setUploadedPhoto(event.target.result);
    };

    reader.readAsDataURL(file);

    e.target.value = '';
  };

  const handleDownloadPdf = async () => {
    if (isStaff) return;
    if (!sheetRef.current || isGeneratingPdf) return;

    setIsGeneratingPdf(true);

    try {
      const safeName = studentName.replace(/[^a-zA-Z0-9]/g, '_');

      const filename = `BSEL_Marksheet_${regNo}_${safeName}.pdf`;

      await exportPdfFromElement(sheetRef.current, {
        filename,
        orientation: 'portrait',
        margin: 0,
        backgroundColor: '#ffffff',
        scale: 2.5,
      });
    } catch (err) {
      console.error('PDF Generation failed:', err);
      alert('Unable to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const tableRowPositions = [
    '54.59%',
    '58.15%',
    '61.67%',
    '65.23%',
    '68.80%',
  ];

  // ==========================================================
  // MARKSHEET TEMPLATE
  // ==========================================================

  const sheetCanvas = (
    <div
      id="printable-marksheet-sheet"
      ref={sheetRef}
      className={`
        relative
        w-full
        max-w-[724px]
        bg-white
        ${standalone ? 'shadow-none' : 'shadow-2xl'}
        rounded-none
        select-text
        text-[#081d3d]
        border
        border-slate-300
        mx-auto
        overflow-hidden
      `}
      style={{
        aspectRatio: '724 / 1024',
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
        fontFamily: "'Times New Roman', Times, serif",
        containerType: 'inline-size',
      }}
    >

      {/* Vector template (zIndex 1 inside the template); draws the header text from the customised values */}
      <MarksheetTemplate
        remark={showMarks ? remarkText : null}
        rightHeading={{
          title: customSchoolName,
          subtitle: customSchoolSubtitle,
          tagline: customSchoolMotto,
        }}
      />

      {/* Full-page BSEL watermark (zIndex 0, under the template) */}
      <BselWatermark />

      {/* PAPER TYPE BOX (A / B / C / D / E) */}
      {paperType && (
        <div
          className="absolute flex flex-col items-center justify-center border-2 border-[#0b2a55] bg-amber-300 rounded-sm shadow-sm"
          style={{
            left: '84.5%',
            top: '13.2%',
            width: '8.8%',
            height: '4.6%',
            zIndex: 1,
          }}
          title="Paper Type"
        >
          <span
            className="text-[7px] font-black uppercase text-[#0b2a55] leading-none"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            Type
          </span>
          <span
            className="text-[14px] font-black text-[#0b2a55] leading-none mt-0.5"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            {paperType}
          </span>
        </div>
      )}

      {/* 0. TOP-RIGHT HEADER CLICK AREA (text is drawn by the template) */}
      <div
        onClick={() => !standalone && setIsFormModalOpen(true)}
        className={`absolute select-none ${
          standalone ? '' : 'cursor-pointer hover:ring-1 hover:ring-amber-400/50 rounded-md transition'
        }`}
        style={{
          top: '2.7%',
          left: '55.4%',
          right: '13.5%',
          height: '9.1%',
          zIndex: 1,
        }}
        title={standalone ? '' : 'Click to customize School Name, Logo & Principal Signature'}
      />

      {/* School Logo Container */}
      <div
        onClick={() => !standalone && setIsFormModalOpen(true)}
        className={`absolute flex items-center justify-center select-none rounded-md overflow-hidden ${
          standalone ? '' : 'cursor-pointer hover:ring-1 hover:ring-amber-400/50 transition'
        }`}
        style={{
          top: '4.3%',
          right: '5.2%',
          width: '8.2%',
          height: '6.2%',
          zIndex: 1,
        }}
        title={standalone ? '' : 'Click to upload/change School Logo'}
      >
        {customSchoolLogo ? (
          <img
            src={customSchoolLogo}
            alt={customSchoolName || 'School Logo'}
            className="w-full h-full object-contain drop-shadow-sm"
          />
        ) : !standalone ? (
          <div className="w-full h-full border border-dashed border-[#0b2a55]/30 hover:border-amber-500/80 bg-white/40 flex flex-col items-center justify-center p-0.5 text-center transition group/slot print:hidden">
            <ImageIcon className="w-3.5 h-3.5 text-[#0b2a55]/60 group-hover/slot:text-amber-500 mb-0.5" />
            <span className="text-[5.5px] font-bold text-[#0b2a55] uppercase leading-tight font-sans">
              Logo
            </span>
          </div>
        ) : null}
      </div>

      {/* 1. STUDENT & COURSE DETAILS */}
      {[
        { value: regNo, top: 17.72, cls: '' },
        { value: certNo, top: 20.31, cls: '' },
        { value: studentName, top: 22.9, cls: 'uppercase' },
        { value: parentName, top: 25.49, cls: 'capitalize' },
        { value: dob, top: 28.08, cls: '' },
        { value: courseName, top: 30.66, cls: 'capitalize' },
        { value: level, top: 33.25, cls: 'capitalize' },
        { value: duration, top: 35.84, cls: 'capitalize' },
        { value: school, top: 38.43, cls: 'capitalize' },
        { value: address, top: 41.02, cls: 'capitalize' },
      ].map((row, i) => (
        <div
          key={i}
          className={`absolute font-bold text-black -translate-y-1/2 truncate ${row.cls}`}
          style={{
            left: '29.8%',
            top: `${row.top}%`,
            maxWidth: '32.5%',
            fontFamily: "'Times New Roman', Times, serif",
            fontSize: '2.07cqw',
            lineHeight: 1,
            color: '#000000',
            textRendering: 'geometricPrecision',
            zIndex: 1,
          }}
        >
          {row.value}
        </div>
      ))}

      {/* STUDENT PHOTO */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="
          absolute
          overflow-hidden
          bg-white
          flex
          items-center
          justify-center
          cursor-pointer
          pointer-events-auto
          group
          shadow-2xs
        "
        style={{
          left: '77.0%',
          top: '22.9%',
          width: '14.2%',
          height: '11.5%',
          zIndex: 1,
        }}
        title="Click to upload/change photo"
      >
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={studentName}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="
            w-full
            h-full
            flex
            flex-col
            items-center
            justify-center
            bg-gradient-to-b
            from-[#faf6ec]
            to-[#f2e9d2]
            p-1
            select-none
            text-center
          ">
            <svg
              viewBox="0 0 100 100"
              className="w-7 h-7 text-[#c59b27] drop-shadow-2xs"
            >
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="#c59b27"
                strokeWidth="2.5"
                strokeDasharray="4 2"
              />
              <circle
                cx="50"
                cy="50"
                r="39"
                fill="none"
                stroke="#081d3d"
                strokeWidth="1.2"
              />
              <circle cx="50" cy="50" r="34" fill="#081d3d" />
              <path
                d="M50 24 L53.5 35 L65 35 L55.8 41.8 L59.3 52.8 L50 46 L40.7 52.8 L44.2 41.8 L35 35 L46.5 35 Z"
                fill="#c59b27"
              />
              <path
                d="M42 58 Q50 63 58 58"
                stroke="#c59b27"
                strokeWidth="2"
                fill="none"
              />
            </svg>

            <span className="
              text-[6px]
              font-black
              uppercase
              tracking-[0.14em]
              text-[#081d3d]
              mt-0.5
              font-serif
              leading-none
            ">
              B★SEL SEAL
            </span>

            <span className="
              text-[5px]
              font-bold
              uppercase
              tracking-wider
              text-[#967228]
              mt-0.5
              leading-none
            ">
              OFFICIAL
            </span>
          </div>
        )}

        <div className="
          absolute
          inset-0
          bg-[#081d3d]/80
          text-white
          opacity-0
          group-hover:opacity-100
          transition-opacity
          flex
          flex-col
          items-center
          justify-center
          p-1
          no-print
        ">
          <Upload className="w-3.5 h-3.5 text-amber-400 mb-0.5" />
          <span className="
            text-[6.5px]
            font-black
            uppercase
            tracking-wider
            text-amber-200
          ">
            Change Photo
          </span>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handlePhotoUpload}
      />

      {/* SUBJECT MARKS TABLE (hidden until the final result is complete) */}
      {showMarks &&
        subjects.slice(0, 5).map((sub, idx) => {
          const topY = tableRowPositions[idx];

          return (
            <React.Fragment key={sub.id || idx}>
              <div
                className="absolute font-bold text-[#081d3d] text-[9.5px] sm:text-[11.5px] truncate -translate-y-1/2"
                style={{
                  left: '13.0%',
                  top: topY,
                  maxWidth: '47.5%',
                  fontFamily: "'Times New Roman', Times, serif",
                  lineHeight: 1,
                  zIndex: 1,
                }}
              >
                {sub.name}
              </div>

              <div
                className="absolute font-bold text-[#081d3d] text-[10px] sm:text-[12.5px] -translate-x-1/2 -translate-y-1/2 text-center"
                style={{
                  left: '65.40%',
                  top: topY,
                  fontFamily: "'Times New Roman', Times, serif",
                  lineHeight: 1,
                  zIndex: 1,
                }}
              >
                {fmt2(sub.max)}
              </div>

              <div
                className="absolute font-bold text-[#081d3d] text-[10px] sm:text-[12.5px] -translate-x-1/2 -translate-y-1/2 text-center"
                style={{
                  left: '73.82%',
                  top: topY,
                  fontFamily: "'Times New Roman', Times, serif",
                  lineHeight: 1,
                  zIndex: 1,
                }}
              >
                {fmt2(sub.assessment)}
              </div>

              <div
                className="absolute font-black text-[#081d3d] text-[10.5px] sm:text-[13px] -translate-x-1/2 -translate-y-1/2 text-center"
                style={{
                  left: '82.25%',
                  top: topY,
                  fontFamily: "'Times New Roman', Times, serif",
                  lineHeight: 1,
                  zIndex: 1,
                }}
              >
                {fmt2(sub.exam)}
              </div>

              <div
                className="absolute font-bold text-[#081d3d] text-[10px] sm:text-[12.5px] -translate-x-1/2 -translate-y-1/2 text-center"
                style={{
                  left: '90.68%',
                  top: topY,
                  fontFamily: "'Times New Roman', Times, serif",
                  lineHeight: 1,
                  zIndex: 1,
                }}
              >
                {sub.marks !== null && sub.marks !== undefined ? `${fmt2(sub.marks)}%` : '-'}
              </div>
            </React.Fragment>
          );
        })}

      {/* SUMMARY SECTION */}
      {showMarks && (
        <>
          <div
            className="absolute font-black text-[#081d3d] text-xs sm:text-base -translate-x-1/2 -translate-y-1/2 text-center"
            style={{
              left: '18.51%',
              top: '79.54%',
              fontFamily: "'Times New Roman', Times, serif",
              lineHeight: 1,
              zIndex: 1,
            }}
          >
            {fmt2(totalMax)}
          </div>

          <div
            className="absolute font-black text-[#081d3d] text-xs sm:text-base -translate-x-1/2 -translate-y-1/2 text-center"
            style={{
              left: '39.43%',
              top: '79.54%',
              fontFamily: "'Times New Roman', Times, serif",
              lineHeight: 1,
              zIndex: 1,
            }}
          >
            {fmt2(totalMarks)}
          </div>

          <div
            className="absolute font-black text-[#081d3d] text-xs sm:text-base -translate-x-1/2 -translate-y-1/2 text-center"
            style={{
              left: '60.36%',
              top: '79.54%',
              fontFamily: "'Times New Roman', Times, serif",
              lineHeight: 1,
              zIndex: 1,
            }}
          >
            {percentage}%
          </div>

          <div
            className="absolute font-black text-[#b45309] text-sm sm:text-xl -translate-x-1/2 -translate-y-1/2 text-center"
            style={{
              left: '83.29%',
              top: '79.54%',
              fontFamily: "'Times New Roman', Times, serif",
              lineHeight: 1,
              zIndex: 1,
            }}
          >
            {overallGrade}
          </div>
        </>
      )}

      {/* DATE OF ISSUE */}
      {showMarks && (
        <div
          className="absolute font-bold text-[#081d3d] text-[10px] sm:text-[12.5px] -translate-x-1/2 -translate-y-1/2 text-center whitespace-nowrap"
          style={{
            left: '83.43%',
            top: '85.55%',
            fontFamily: "'Times New Roman', Times, serif",
            lineHeight: 1,
            zIndex: 1,
          }}
        >
          {issueDate}
        </div>
      )}

      {/* PRINCIPAL SIGNATURE */}
      <div
        onClick={() => !standalone && setIsFormModalOpen(true)}
        className={`absolute flex items-end justify-center select-none ${
          standalone ? '' : 'cursor-pointer group/sign hover:ring-1 hover:ring-amber-400/50 rounded transition'
        }`}
        style={{
          top: '94.0%',
          left: '18.44%',
          width: '16.0%',
          height: '5.5%',
          transform: 'translate(-50%, -100%)',
          zIndex: 1,
        }}
        title={standalone ? '' : 'Click to open form & manage Principal signature'}
      >
        {customDirectorSign ? (
          <div className="relative h-full w-full flex items-end justify-center">
            <img
              src={customDirectorSign}
              alt="Center Director / Principal Signature"
              className="max-h-full max-w-full object-contain drop-shadow-2xs"
            />
            {!standalone && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveDirectorSign();
                }}
                className="absolute -top-1.5 -right-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full p-0.5 opacity-0 group-hover/sign:opacity-100 transition shadow-sm print:hidden"
                title="Remove Signature"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ) : !standalone ? (
          <div className="w-full h-full border border-dashed border-[#081d3d]/30 hover:border-amber-500/80 bg-white/40 flex items-center justify-center gap-1 px-1 transition print:hidden">
            <PenTool className="w-2.5 h-2.5 text-[#081d3d]/45 shrink-0" />
            <span className="text-[6.5px] font-bold text-[#081d3d]/60 uppercase leading-none">
              Upload Sign
            </span>
          </div>
        ) : null}
      </div>

    </div>
  );

  // ==========================================================
  // STANDALONE VIEW
  // ==========================================================

  if (standalone) {
    return sheetCanvas;
  }

  // ==========================================================
  // RESPONSIVE PREVIEW + TOOLBAR
  // ==========================================================

  return (
    <div className="
      fixed
      inset-0
      z-[150]
      overflow-y-auto
      overflow-x-hidden
      bg-slate-900/85
      backdrop-blur-sm
      flex
      flex-col
      items-center
      justify-start
      p-2
      sm:p-4
    ">

      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            background: #ffffff !important;
            overflow: visible !important;
          }

          body * {
            visibility: hidden !important;
          }

          ${isStaff ? `
          #printable-marksheet-sheet,
          #printable-marksheet-sheet * {
            visibility: hidden !important;
            display: none !important;
          }
          ` : `
          #printable-marksheet-sheet,
          #printable-marksheet-sheet * {
            visibility: visible !important;
          }
          `}

          #printable-marksheet-sheet {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            max-width: none !important;
            aspect-ratio: 724 / 1024 !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            overflow: hidden !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .no-print {
            display: none !important;
          }
        }

        @media (max-width: 640px) {
          .marksheet-toolbar {
            border-radius: 10px;
            padding: 10px;
            gap: 10px;
          }

          .marksheet-toolbar button {
            min-height: 36px;
            justify-content: center;
            white-space: nowrap;
          }

          .marksheet-action-buttons {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            width: 100%;
            gap: 6px;
          }

          .marksheet-action-buttons button {
            padding-left: 5px;
            padding-right: 5px;
            font-size: 10px;
          }
        }

        @media (max-width: 380px) {
          .marksheet-toolbar {
            padding: 8px;
          }

          .marksheet-action-buttons {
            gap: 4px;
          }

          .marksheet-action-buttons button {
            font-size: 9px;
            gap: 3px;
          }
        }
      `}</style>

      <div className="
        no-print
        marksheet-toolbar
        w-full
        max-w-[724px]
        bg-[#0c234b]
        text-white
        px-3
        sm:px-4
        py-3
        rounded-xl
        shadow-lg
        flex
        flex-col
        sm:flex-row
        sm:items-center
        sm:justify-between
        gap-3
        mb-3
        sticky
        top-1
        sm:top-2
        z-20
        border
        border-amber-400/40
      ">

        <button
          type="button"
          onClick={onClose}
          className="
            w-full
            sm:w-auto
            px-3
            py-2
            bg-white/10
            hover:bg-white/20
            text-white
            rounded-lg
            text-xs
            sm:text-sm
            font-bold
            transition
            flex
            items-center
            justify-center
            sm:justify-start
            gap-2
            cursor-pointer
          "
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Back to Student Details</span>
        </button>

        <div className="
          marksheet-action-buttons
          flex
          items-center
          justify-end
          gap-2
          w-full
          sm:w-auto
        ">
          {!isStaff ? (
            <>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(true)}
                className="
                  flex-1
                  sm:flex-none
                  px-2
                  sm:px-3
                  py-2
                  bg-amber-500/20
                  hover:bg-amber-500/30
                  text-amber-300
                  rounded-lg
                  text-[10px]
                  sm:text-xs
                  font-bold
                  transition
                  flex
                  items-center
                  justify-center
                  gap-1
                  border
                  border-amber-400/40
                  cursor-pointer
                "
                title="Customize School Name, Logo & Principal Signature"
              >
                <PenTool className="w-3.5 h-3.5 shrink-0" />
                <span>Customize</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="
                  flex-1
                  sm:flex-none
                  px-2
                  sm:px-3.5
                  py-2
                  bg-amber-500
                  hover:bg-amber-400
                  text-slate-950
                  rounded-lg
                  text-[10px]
                  sm:text-xs
                  font-black
                  transition
                  flex
                  items-center
                  justify-center
                  gap-1
                  shadow-sm
                  cursor-pointer
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                {isGeneratingPdf ? (
                  <Loader2 className="w-3.5 h-3.5 shrink-0 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5 shrink-0" />
                )}

                <span className="sm:hidden">
                  {isGeneratingPdf ? 'Saving' : 'PDF'}
                </span>

                <span className="hidden sm:inline">
                  {isGeneratingPdf ? 'Downloading...' : 'Download PDF'}
                </span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="
                  flex-1
                  sm:flex-none
                  px-2
                  sm:px-3.5
                  py-2
                  bg-[#163e7c]
                  hover:bg-[#1f54a6]
                  text-white
                  rounded-lg
                  text-[10px]
                  sm:text-xs
                  font-black
                  transition
                  flex
                  items-center
                  justify-center
                  gap-1
                  border
                  border-white/20
                  cursor-pointer
                "
              >
                <Printer className="w-3.5 h-3.5 shrink-0" />
                <span>Print</span>
              </button>
            </>
          ) : (
            <div className="px-3 py-1.5 bg-amber-400/15 border border-amber-400/30 rounded-lg text-[10px] sm:text-xs font-bold text-amber-200">
              Staff Evaluation View
            </div>
          )}
        </div>
      </div>

      <input
        type="file"
        ref={schoolLogoInputRef}
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
        onChange={handleSchoolLogoChange}
      />
      <input
        type="file"
        ref={directorSignInputRef}
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
        onChange={handleDirectorSignChange}
      />

      {isFormModalOpen && (
        <div
          className="fixed inset-0 z-[170] flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-4 print:hidden"
          onClick={() => setIsFormModalOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl p-4 sm:p-6 max-w-xl w-full shadow-2xl text-white flex flex-col gap-4 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Marksheet Customization Form
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Update branch details, school logo & principal signature
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-300 flex justify-between">
                  <span>Line 1: School / Branch Name <span className="text-amber-400 font-bold">(Max 20 chars, Big & Bold)</span></span>
                  <span className="text-amber-400 font-bold">{customSchoolName.length}/20</span>
                </label>
                <input
                  type="text"
                  value={customSchoolName}
                  maxLength={20}
                  placeholder="e.g. RISING STARS"
                  onChange={(e) => {
                    const v = e.target.value;
                    setCustomSchoolName(v);
                    handleSaveSchoolDetails(v, customSchoolSubtitle, customSchoolMotto, customSchoolLogo);
                  }}
                  className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-serif uppercase tracking-wider text-sm font-black focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-300 flex justify-between">
                  <span>Line 2: Subtitle / Division <span className="text-amber-400 font-bold">(Max 25 chars, Medium)</span></span>
                  <span className="text-amber-400 font-bold">{customSchoolSubtitle.length}/25</span>
                </label>
                <input
                  type="text"
                  value={customSchoolSubtitle}
                  maxLength={25}
                  placeholder="e.g. VISION FOUNDATION"
                  onChange={(e) => {
                    const v = e.target.value;
                    setCustomSchoolSubtitle(v);
                    handleSaveSchoolDetails(customSchoolName, v, customSchoolMotto, customSchoolLogo);
                  }}
                  className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-sans uppercase tracking-widest text-xs font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-300 flex justify-between">
                  <span>Line 3: Motto / Tagline <span className="text-amber-400 font-bold">(Max 30 chars, Small)</span></span>
                  <span className="text-amber-400 font-bold">{customSchoolMotto.length}/30</span>
                </label>
                <input
                  type="text"
                  value={customSchoolMotto}
                  maxLength={30}
                  placeholder="e.g. EDUCATION · EMPOWERMENT · EXCELLENCE"
                  onChange={(e) => {
                    const v = e.target.value;
                    setCustomSchoolMotto(v);
                    handleSaveSchoolDetails(customSchoolName, customSchoolSubtitle, v, customSchoolLogo);
                  }}
                  className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-sans uppercase tracking-wider text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl flex flex-col gap-2">
                  <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    School Logo (PNG, JPG)
                  </span>
                  <div className="flex items-center gap-3">
                    {customSchoolLogo ? (
                      <div className="w-12 h-12 bg-white/10 rounded-lg p-1 border border-slate-700 shrink-0">
                        <img src={customSchoolLogo} alt="Logo" className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 border border-dashed border-slate-700 rounded-lg flex items-center justify-center shrink-0 text-slate-500">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                    <div className="flex flex-col gap-1 flex-1">
                      <button
                        type="button"
                        onClick={() => schoolLogoInputRef.current?.click()}
                        className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition cursor-pointer text-center"
                      >
                        {customSchoolLogo ? 'Change Logo' : 'Upload Logo'}
                      </button>
                      {customSchoolLogo && (
                        <button
                          type="button"
                          onClick={() => {
                            setCustomSchoolLogo(null);
                            handleSaveSchoolDetails(customSchoolName, customSchoolSubtitle, customSchoolMotto, null);
                          }}
                          className="text-[10px] text-red-400 hover:underline cursor-pointer text-left"
                        >
                          Remove Logo
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl flex flex-col gap-2">
                  <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <PenTool className="w-3.5 h-3.5 text-sky-400" />
                    Principal Signature (PNG, JPG)
                  </span>
                  <div className="flex items-center gap-3">
                    {customDirectorSign ? (
                      <div className="w-12 h-12 bg-white/10 rounded-lg p-1 border border-slate-700 shrink-0 flex items-center justify-center">
                        <img src={customDirectorSign} alt="Signature" className="max-h-full max-w-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 border border-dashed border-slate-700 rounded-lg flex items-center justify-center shrink-0 text-slate-500">
                        <PenTool className="w-5 h-5" />
                      </div>
                    )}
                    <div className="flex flex-col gap-1 flex-1">
                      <button
                        type="button"
                        onClick={() => directorSignInputRef.current?.click()}
                        className="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-xs transition cursor-pointer text-center"
                      >
                        {customDirectorSign ? 'Change Signature' : 'Upload Signature'}
                      </button>
                      {customDirectorSign && (
                        <button
                          type="button"
                          onClick={handleRemoveDirectorSign}
                          className="text-[10px] text-red-400 hover:underline cursor-pointer text-left"
                        >
                          Remove Signature
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  handleSaveSchoolDetails(customSchoolName, customSchoolSubtitle, customSchoolMotto, customSchoolLogo);
                  setIsFormModalOpen(false);
                }}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition cursor-pointer shadow-md"
              >
                Save & Done
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="
        w-full
        max-w-[724px]
        flex
        justify-center
        items-start
        mx-auto
        pb-4
      ">
        <div className="w-full">
          {sheetCanvas}
        </div>
      </div>

    </div>
  );
}