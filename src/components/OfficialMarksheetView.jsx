import React, { useRef, useState } from 'react';
import {
  ArrowLeft,
  Download,
  Printer,
  Loader2,
  Upload, Building2, Image as ImageIcon, X, PenTool,
} from 'lucide-react';

import { exportPdfFromElement } from '../utils/pdfExport';
import {
  getStudentPhotoUrl,
  getStudentRegisterNumber,
} from '../utils/studentDataHelpers';
import { getCoursePrefix } from '../utils/authStorage';
import marksheetOfficialTemplate from '../assets/marksheet_official_template.jpg';

// ============================================================
// COURSE SUBJECT MODULES
// ============================================================

export const getCourseSubjectModules = (courseName = '') => {
  const c = courseName.toLowerCase();

  // 1. HTML5 & Web Development
  if (c.includes('html')) {
    return [
      { id: 1, name: 'HTML5 Semantic Structure & Tags', max: 100, assessment: 100, practical: 100, marks: 96, pct: '96%' },
      { id: 2, name: 'Forms, Input Validation & Tables', max: 100, assessment: 100, practical: 100, marks: 98, pct: '98%' },
      { id: 3, name: 'Hyperlinks, Layouts & Media Tags', max: 100, assessment: 100, practical: 100, marks: 94, pct: '94%' },
      { id: 4, name: 'Responsive Architecture & Web DOM', max: 100, assessment: 100, practical: 100, marks: 97, pct: '97%' },
      { id: 5, name: 'Live Web Project & Viva Voce', max: 100, assessment: 100, practical: 100, marks: 95, pct: '95%' },
    ];
  }

  // 2. CSS3 & Styling
  if (c.includes('css')) {
    return [
      { id: 1, name: 'CSS Syntax, Selectors & Cascade', max: 100, assessment: 100, practical: 100, marks: 96, pct: '96%' },
      { id: 2, name: 'Box Model, Margins & Padding', max: 100, assessment: 100, practical: 100, marks: 98, pct: '98%' },
      { id: 3, name: 'Flexbox & CSS Grid Page Layouts', max: 100, assessment: 100, practical: 100, marks: 94, pct: '94%' },
      { id: 4, name: 'Media Queries & Responsive UI', max: 100, assessment: 100, practical: 100, marks: 97, pct: '97%' },
      { id: 5, name: 'Web Styling Portfolio & Viva', max: 100, assessment: 100, practical: 100, marks: 95, pct: '95%' },
    ];
  }

  // 3. Python Programming
  if (c.includes('python')) {
    return [
      { id: 1, name: 'Python Syntax & Data Types', max: 100, assessment: 100, practical: 100, marks: 96, pct: '96%' },
      { id: 2, name: 'Control Flow & Conditional Logic', max: 100, assessment: 100, practical: 100, marks: 98, pct: '98%' },
      { id: 3, name: 'Functions, Loops & String Handling', max: 100, assessment: 100, practical: 100, marks: 94, pct: '94%' },
      { id: 4, name: 'Data Structures & Problem Solving', max: 100, assessment: 100, practical: 100, marks: 97, pct: '97%' },
      { id: 5, name: 'Python Code Project & Viva Voce', max: 100, assessment: 100, practical: 100, marks: 95, pct: '95%' },
    ];
  }

  // 4. Computer Fundamentals
  if (c.includes('comput')) {
    return [
      { id: 1, name: 'Computer Architecture & Hardware', max: 100, assessment: 100, practical: 100, marks: 96, pct: '96%' },
      { id: 2, name: 'Operating Systems & File Handling', max: 100, assessment: 100, practical: 100, marks: 98, pct: '98%' },
      { id: 3, name: 'Internet Security & Cyber Safety', max: 100, assessment: 100, practical: 100, marks: 94, pct: '94%' },
      { id: 4, name: 'Keyboarding & Speed Typing Drills', max: 100, assessment: 100, practical: 100, marks: 97, pct: '97%' },
      { id: 5, name: 'IT Application Lab & Viva Voce', max: 100, assessment: 100, practical: 100, marks: 95, pct: '95%' },
    ];
  }

  // 5. MS Office
  if (c.includes('office') || c.includes('ms')) {
    return [
      { id: 1, name: 'MS Word Document Formatting', max: 100, assessment: 100, practical: 100, marks: 96, pct: '96%' },
      { id: 2, name: 'MS Excel Formulas & Data Charts', max: 100, assessment: 100, practical: 100, marks: 98, pct: '98%' },
      { id: 3, name: 'MS PowerPoint Slide Design', max: 100, assessment: 100, practical: 100, marks: 94, pct: '94%' },
      { id: 4, name: 'Office Automation & Productivity', max: 100, assessment: 100, practical: 100, marks: 97, pct: '97%' },
      { id: 5, name: 'Applied Office Project & Viva', max: 100, assessment: 100, practical: 100, marks: 95, pct: '95%' },
    ];
  }

  // 6. Photoshop
  if (c.includes('photo')) {
    return [
      { id: 1, name: 'Interface, Layers & Selection Tools', max: 100, assessment: 100, practical: 100, marks: 96, pct: '96%' },
      { id: 2, name: 'Photo Retouching & Color Grading', max: 100, assessment: 100, practical: 100, marks: 98, pct: '98%' },
      { id: 3, name: 'Masking & Creative Composition', max: 100, assessment: 100, practical: 100, marks: 94, pct: '94%' },
      { id: 4, name: 'Banner, Poster & Graphic Design', max: 100, assessment: 100, practical: 100, marks: 97, pct: '97%' },
      { id: 5, name: 'Design Portfolio Review & Viva', max: 100, assessment: 100, practical: 100, marks: 95, pct: '95%' },
    ];
  }

  // 7. Canva Graphic Design
  if (c.includes('canva')) {
    return [
      { id: 1, name: 'Visual Design Hierarchy & Layouts', max: 100, assessment: 100, practical: 100, marks: 96, pct: '96%' },
      { id: 2, name: 'Typography & Color Harmony', max: 100, assessment: 100, practical: 100, marks: 98, pct: '98%' },
      { id: 3, name: 'Brand Kits & Social Media Assets', max: 100, assessment: 100, practical: 100, marks: 94, pct: '94%' },
      { id: 4, name: 'Poster, Flyer & Presentation Deck', max: 100, assessment: 100, practical: 100, marks: 97, pct: '97%' },
      { id: 5, name: 'Design Portfolio Assessment', max: 100, assessment: 100, practical: 100, marks: 95, pct: '95%' },
    ];
  }

  // 8. AI & Digital Skills
  if (c.includes('ai') || c.includes('artificial')) {
    return [
      { id: 1, name: 'Fundamentals of Artificial Intelligence', max: 100, assessment: 100, practical: 100, marks: 96, pct: '96%' },
      { id: 2, name: 'Prompt Engineering & Generative AI', max: 100, assessment: 100, practical: 100, marks: 98, pct: '98%' },
      { id: 3, name: 'AI Multimedia & Visual Synthesis', max: 100, assessment: 100, practical: 100, marks: 94, pct: '94%' },
      { id: 4, name: 'Digital Ethics & Fact Verification', max: 100, assessment: 100, practical: 100, marks: 97, pct: '97%' },
      { id: 5, name: 'Applied AI Capstone Project & Viva', max: 100, assessment: 100, practical: 100, marks: 95, pct: '95%' },
    ];
  }

  // 9. Handwriting & Calligraphy
  if (c.includes('handwrit') || c.includes('calligraph')) {
    return [
      { id: 1, name: 'Basic Letter Formation & Slant', max: 100, assessment: 100, practical: 100, marks: 96, pct: '96%' },
      { id: 2, name: 'Cursive Flow & Ligature Joins', max: 100, assessment: 100, practical: 100, marks: 98, pct: '98%' },
      { id: 3, name: 'Word Spacing & Line Proportions', max: 100, assessment: 100, practical: 100, marks: 94, pct: '94%' },
      { id: 4, name: 'Speed Transcription Under Clock', max: 100, assessment: 100, practical: 100, marks: 97, pct: '97%' },
      { id: 5, name: 'Spotless Notebook Presentation', max: 100, assessment: 100, practical: 100, marks: 95, pct: '95%' },
    ];
  }

  // 10. Drawing & Visual Arts
  if (c.includes('art') || c.includes('draw')) {
    return [
      { id: 1, name: 'Freehand Sketching & Line Contour', max: 100, assessment: 100, practical: 100, marks: 96, pct: '96%' },
      { id: 2, name: 'Colour Theory & Shading Gradients', max: 100, assessment: 100, practical: 100, marks: 98, pct: '98%' },
      { id: 3, name: 'Thematic Creative Composition', max: 100, assessment: 100, practical: 100, marks: 94, pct: '94%' },
      { id: 4, name: 'Object, Perspective & Still Life', max: 100, assessment: 100, practical: 100, marks: 97, pct: '97%' },
      { id: 5, name: 'Art Portfolio & Viva Voce', max: 100, assessment: 100, practical: 100, marks: 95, pct: '95%' },
    ];
  }

  // 11. Phonics & Reading
  if (c.includes('phonic') || c.includes('read')) {
    return [
      { id: 1, name: '42 Core Phonemes & Letter Sounds', max: 100, assessment: 100, practical: 100, marks: 96, pct: '96%' },
      { id: 2, name: 'CVC Word Blending & Segmenting', max: 100, assessment: 100, practical: 100, marks: 98, pct: '98%' },
      { id: 3, name: 'Digraphs, Diphthongs & Sight Words', max: 100, assessment: 100, practical: 100, marks: 94, pct: '94%' },
      { id: 4, name: 'Oral Reading Fluency & Expression', max: 100, assessment: 100, practical: 100, marks: 97, pct: '97%' },
      { id: 5, name: 'Reading Comprehension & Viva', max: 100, assessment: 100, practical: 100, marks: 95, pct: '95%' },
    ];
  }

  // 12. Memory Challenge
  if (c.includes('memory') || c.includes('mnemon')) {
    return [
      { id: 1, name: 'Cognitive Concentration & Focus', max: 100, assessment: 100, practical: 100, marks: 96, pct: '96%' },
      { id: 2, name: 'Number Pegs & Mnemonic Systems', max: 100, assessment: 100, practical: 100, marks: 98, pct: '98%' },
      { id: 3, name: 'Memory Palace (Method of Loci)', max: 100, assessment: 100, practical: 100, marks: 94, pct: '94%' },
      { id: 4, name: 'Speed Face & Name Retention Drills', max: 100, assessment: 100, practical: 100, marks: 97, pct: '97%' },
      { id: 5, name: 'Memory Olympiad Practical Exam', max: 100, assessment: 100, practical: 100, marks: 95, pct: '95%' },
    ];
  }

  // 13. Classical Dance / Bharatanatyam
  if (c.includes('dance') || c.includes('bharatanatyam')) {
    return [
      { id: 1, name: 'Adavus & Basic Footwork Drills', max: 100, assessment: 100, practical: 100, marks: 96, pct: '96%' },
      { id: 2, name: 'Asamyutta & Samyutta Hastas (Mudras)', max: 100, assessment: 100, practical: 100, marks: 98, pct: '98%' },
      { id: 3, name: 'Rhythm, Tala & Laya Precision', max: 100, assessment: 100, practical: 100, marks: 94, pct: '94%' },
      { id: 4, name: 'Abhinaya, Facial Expression & Posture', max: 100, assessment: 100, practical: 100, marks: 97, pct: '97%' },
      { id: 5, name: 'Recital Performance & Guru Viva', max: 100, assessment: 100, practical: 100, marks: 95, pct: '95%' },
    ];
  }

  // 14. Language & Speaking
  if (c.includes('language') || c.includes('speak')) {
    return [
      { id: 1, name: 'Phonetics, Accent & Enunciation', max: 100, assessment: 100, practical: 100, marks: 96, pct: '96%' },
      { id: 2, name: 'Grammar Foundations & Sentences', max: 100, assessment: 100, practical: 100, marks: 98, pct: '98%' },
      { id: 3, name: 'Vocabulary & Contextual Phrases', max: 100, assessment: 100, practical: 100, marks: 94, pct: '94%' },
      { id: 4, name: 'Public Speaking & Extempore Drills', max: 100, assessment: 100, practical: 100, marks: 97, pct: '97%' },
      { id: 5, name: 'Conversational Fluency & Viva', max: 100, assessment: 100, practical: 100, marks: 95, pct: '95%' },
    ];
  }

  // 15. Athletics & Sports
  if (c.includes('athletic') || c.includes('sport')) {
    return [
      { id: 1, name: 'Physical Conditioning & Warm-up', max: 100, assessment: 100, practical: 100, marks: 96, pct: '96%' },
      { id: 2, name: 'Sprint Technique & Cadence Drills', max: 100, assessment: 100, practical: 100, marks: 98, pct: '98%' },
      { id: 3, name: 'Agility, Balance & Coordination', max: 100, assessment: 100, practical: 100, marks: 94, pct: '94%' },
      { id: 4, name: 'Cardio Stamina & Field Endurance', max: 100, assessment: 100, practical: 100, marks: 97, pct: '97%' },
      { id: 5, name: 'Athletic Track Benchmark Exam', max: 100, assessment: 100, practical: 100, marks: 95, pct: '95%' },
    ];
  }

  // 16. Default: Abacus Speed Arithmetic
  return [
    { id: 1, name: 'Abacus Operations & Bead Technique', max: 100, assessment: 100, practical: 100, marks: 96, pct: '96%' },
    { id: 2, name: 'Small Friend & Big Friend Formulas', max: 100, assessment: 100, practical: 100, marks: 98, pct: '98%' },
    { id: 3, name: 'Mental Arithmetic & Visual Anzan', max: 100, assessment: 100, practical: 100, marks: 94, pct: '94%' },
    { id: 4, name: 'Rapid Multi-Row Calculation Drills', max: 100, assessment: 100, practical: 100, marks: 97, pct: '97%' },
    { id: 5, name: 'Speed Arithmetic Accuracy & Viva', max: 100, assessment: 100, practical: 100, marks: 95, pct: '95%' },
  ];
};

// ============================================================
// OFFICIAL MARKSHEET COMPONENT
// ============================================================

export default function OfficialMarksheetView({
  student,
  onClose,
  standalone = false,
  defaultShowMarks = false,
}) {
  const sheetRef = useRef(null);
  const fileInputRef = useRef(null);

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showMarks, setShowMarks] = useState(defaultShowMarks);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);

  const schoolLogoInputRef = useRef(null);
  const directorSignInputRef = useRef(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const [customDirectorSign, setCustomDirectorSign] = useState(() => {
    try {
      const saved = localStorage.getItem('bsel_certificate_director_signature');
      if (saved) return saved;
    } catch (_) {}
    return null;
  });

  const [customSchoolName, setCustomSchoolName] = useState(() => {
    try {
      const saved = localStorage.getItem('bsel_certificate_school_header');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name) return parsed.name;
      }
    } catch (_) {}
    return 'RISING STARS';
  });

  const [customSchoolSubtitle, setCustomSchoolSubtitle] = useState(() => {
    try {
      const saved = localStorage.getItem('bsel_certificate_school_header');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.subtitle) return parsed.subtitle;
      }
    } catch (_) {}
    return 'VISION FOUNDATION';
  });

  const [customSchoolMotto, setCustomSchoolMotto] = useState(() => {
    try {
      const saved = localStorage.getItem('bsel_certificate_school_header');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.motto) return parsed.motto;
      }
    } catch (_) {}
    return 'EDUCATION • EMPOWERMENT • EXCELLENCE';
  });

  const [customSchoolLogo, setCustomSchoolLogo] = useState(() => {
    try {
      const saved = localStorage.getItem('bsel_certificate_school_header');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.logo) return parsed.logo;
      }
    } catch (_) {}
    return null;
  });

  const handleSaveSchoolDetails = (name, subtitle, motto, logo) => {
    try {
      localStorage.setItem(
        'bsel_certificate_school_header',
        JSON.stringify({ name, subtitle, motto, logo })
      );
    } catch (_) {}
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
        try {
          localStorage.setItem('bsel_certificate_director_signature', dataUrl);
        } catch (_) {}
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveDirectorSign = () => {
    setCustomDirectorSign(null);
    try {
      localStorage.removeItem('bsel_certificate_director_signature');
    } catch (_) {}
  };

  const getSchoolNameFontSize = (text) => {
    const len = (text || '').trim().length;
    if (len <= 7) return 'clamp(20px, 4.2vw, 33px)';
    if (len <= 10) return 'clamp(17.5px, 3.7vw, 28px)';
    if (len <= 13) return 'clamp(15px, 3.2vw, 24px)';
    if (len <= 16) return 'clamp(13px, 2.75vw, 20.5px)';
    if (len <= 20) return 'clamp(11.5px, 2.4vw, 18px)';
    return 'clamp(10px, 2.1vw, 15.5px)';
  };

  const getSchoolSubtitleFontSize = (text) => {
    const len = (text || '').trim().length;
    if (len <= 12) return 'clamp(10px, 2.0vw, 15.5px)';
    if (len <= 18) return 'clamp(9px, 1.75vw, 13.5px)';
    return 'clamp(8px, 1.5vw, 11.5px)';
  };

  const getSchoolMottoFontSize = (text) => {
    const len = (text || '').trim().length;
    if (len <= 16) return 'clamp(7px, 1.35vw, 10.5px)';
    if (len <= 22) return 'clamp(6.5px, 1.2vw, 9.5px)';
    return 'clamp(6px, 1.05vw, 8.5px)';
  };

  if (!student) return null;

  // ----------------------------------------------------------
  // STUDENT DATA
  // ----------------------------------------------------------

  const courseName = student.program || student.courseName || 'Abacus';

  let subjects = getCourseSubjectModules(courseName);

  if (Array.isArray(student.subjects) && student.subjects.length === 5) {
    const firstSub = (student.subjects[0]?.name || '').toLowerCase();
    const cLower = courseName.toLowerCase();

    const isMismatch =
      (!cLower.includes('abacus') && firstSub.includes('abacus')) ||
      (cLower.includes('html') && !firstSub.includes('html')) ||
      (cLower.includes('css') && !firstSub.includes('css')) ||
      (cLower.includes('python') && !firstSub.includes('python'));

    if (!isMismatch) {
      subjects = student.subjects;
    }
  }

  const totalMax = subjects.reduce(
    (sum, s) => sum + (Number(s.max) || 100),
    0
  );

  const totalMarks = subjects.reduce(
    (sum, s) => sum + (Number(s.marks) || 95),
    0
  );

  const percentage = totalMax
    ? ((totalMarks / totalMax) * 100).toFixed(1)
    : '0.0';

  const overallGrade =
    Number(percentage) >= 95
      ? 'A+'
      : Number(percentage) >= 85
        ? 'A'
        : 'B+';

  const regNo =
    getStudentRegisterNumber(student) ||
    student.registrationNo ||
    'AB27-001';

  // Certificate number
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
    'Test Branch';

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

    // Allow selecting the same image again
    e.target.value = '';
  };

  const handleDownloadPdf = async () => {
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

  // Exact vertical row positions for the official template
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
        backgroundImage: `url(${marksheetOfficialTemplate})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        fontFamily: "'Times New Roman', Times, serif",
      }}
    >

      {/* =====================================================
          0. TOP-RIGHT SCHOOL HEADER (LINE 1, 2, 3) & SCHOOL LOGO
      ===================================================== */}

      <div
        onClick={() => !standalone && setIsFormModalOpen(true)}
        className={`absolute flex flex-col items-center justify-center text-center select-none px-0.5 ${
          standalone ? '' : 'cursor-pointer hover:ring-1 hover:ring-amber-400/50 rounded-md transition'
        }`}
        style={{
          top: '2.7%',
          left: '55.4%',
          right: '13.5%',
          height: '9.1%',
        }}
        title={standalone ? '' : 'Click to customize School Name, Logo & Principal Signature'}
      >
        {customSchoolName && (
          <div
            className="tracking-normal uppercase text-center w-full whitespace-nowrap"
            style={{
              color: '#13427a',
              fontFamily: "'Cinzel', 'Outfit', 'Plus Jakarta Sans', sans-serif",
              fontWeight: 900,
              fontSize: getSchoolNameFontSize(customSchoolName),
              letterSpacing: (customSchoolName || '').trim().length > 13 ? '-0.02em' : '0.02em',
              lineHeight: 1.02,
              textShadow: '0 0.5px 1px rgba(19, 66, 122, 0.2)',
            }}
          >
            {customSchoolName}
          </div>
        )}

        {customSchoolSubtitle && (
          <div
            className="uppercase mt-0.5 text-center w-full whitespace-nowrap"
            style={{
              color: '#13427a',
              fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: getSchoolSubtitleFontSize(customSchoolSubtitle),
              letterSpacing: (customSchoolSubtitle || '').trim().length > 18 ? '0.05em' : '0.09em',
              lineHeight: 1.05,
            }}
          >
            {customSchoolSubtitle}
          </div>
        )}

        {customSchoolMotto && (
          <div
            className="uppercase mt-0.5 text-center w-full whitespace-nowrap"
            style={{
              color: '#13427a',
              fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: getSchoolMottoFontSize(customSchoolMotto),
              letterSpacing: '0.07em',
              lineHeight: 1.05,
            }}
          >
            {customSchoolMotto}
          </div>
        )}
      </div>

      {/* Extreme Right Corner: School Logo Container */}
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
          <div className="w-full h-full border border-dashed border-[#13427a]/30 hover:border-amber-500/80 bg-white/40 flex flex-col items-center justify-center p-0.5 text-center transition group/slot print:hidden">
            <ImageIcon className="w-3.5 h-3.5 text-[#13427a]/40 group-hover/slot:text-amber-500 mb-0.5" />
            <span className="text-[5.5px] font-bold text-[#13427a]/60 uppercase leading-tight font-sans">
              Logo
            </span>
          </div>
        ) : null}
      </div>

      {/* =====================================================
          1. STUDENT & COURSE DETAILS
      ===================================================== */}

      {/* Registration Number */}
      <div
        className="absolute font-bold text-[#081d3d] text-[10px] sm:text-[12.5px] -translate-y-1/2 truncate"
        style={{
          left: '29.8%',
          top: '17.72%',
          maxWidth: '32.5%',
          fontFamily: "'Times New Roman', Times, serif",
          lineHeight: 1,
        }}
      >
        {regNo}
      </div>

      {/* Certificate Number */}
      <div
        className="absolute font-bold text-[#081d3d] text-[10px] sm:text-[12.5px] -translate-y-1/2 truncate"
        style={{
          left: '29.8%',
          top: '20.31%',
          maxWidth: '32.5%',
          fontFamily: "'Times New Roman', Times, serif",
          lineHeight: 1,
        }}
      >
        {certNo}
      </div>

      {/* Student Name */}
      <div
        className="absolute font-bold text-[#081d3d] uppercase text-[10.5px] sm:text-[13px] -translate-y-1/2 truncate"
        style={{
          left: '29.8%',
          top: '22.90%',
          maxWidth: '32.5%',
          fontFamily: "'Times New Roman', Times, serif",
          lineHeight: 1,
        }}
      >
        {studentName}
      </div>

      {/* Parent / Guardian */}
      <div
        className="absolute font-bold text-[#081d3d] capitalize text-[10px] sm:text-[12.5px] -translate-y-1/2 truncate"
        style={{
          left: '29.8%',
          top: '25.49%',
          maxWidth: '32.5%',
          fontFamily: "'Times New Roman', Times, serif",
          lineHeight: 1,
        }}
      >
        {parentName}
      </div>

      {/* Date of Birth */}
      <div
        className="absolute font-bold text-[#081d3d] text-[10px] sm:text-[12.5px] -translate-y-1/2 truncate"
        style={{
          left: '29.8%',
          top: '28.08%',
          maxWidth: '32.5%',
          fontFamily: "'Times New Roman', Times, serif",
          lineHeight: 1,
        }}
      >
        {dob}
      </div>

      {/* Course */}
      <div
        className="absolute font-bold text-[#081d3d] capitalize text-[10px] sm:text-[12.5px] -translate-y-1/2 truncate"
        style={{
          left: '29.8%',
          top: '30.66%',
          maxWidth: '32.5%',
          fontFamily: "'Times New Roman', Times, serif",
          lineHeight: 1,
        }}
      >
        {courseName}
      </div>

      {/* Level */}
      <div
        className="absolute font-bold text-[#081d3d] capitalize text-[10px] sm:text-[12.5px] -translate-y-1/2 truncate"
        style={{
          left: '29.8%',
          top: '33.25%',
          maxWidth: '32.5%',
          fontFamily: "'Times New Roman', Times, serif",
          lineHeight: 1,
        }}
      >
        {level}
      </div>

      {/* Duration */}
      <div
        className="absolute font-bold text-[#081d3d] capitalize text-[10px] sm:text-[12.5px] -translate-y-1/2 truncate"
        style={{
          left: '29.8%',
          top: '35.84%',
          maxWidth: '32.5%',
          fontFamily: "'Times New Roman', Times, serif",
          lineHeight: 1,
        }}
      >
        {duration}
      </div>

      {/* School / Exam Centre */}
      <div
        className="absolute font-bold text-[#081d3d] capitalize text-[10px] sm:text-[12px] -translate-y-1/2 truncate"
        style={{
          left: '29.8%',
          top: '38.43%',
          maxWidth: '32.5%',
          fontFamily: "'Times New Roman', Times, serif",
          lineHeight: 1,
        }}
      >
        {school}
      </div>

      {/* Address */}
      <div
        className="absolute font-bold text-[#081d3d] capitalize text-[9.5px] sm:text-[11.5px] -translate-y-1/2 truncate"
        style={{
          left: '29.8%',
          top: '41.02%',
          maxWidth: '32.5%',
          fontFamily: "'Times New Roman', Times, serif",
          lineHeight: 1,
        }}
      >
        {address}
      </div>

      {/* =====================================================
          3. STUDENT PHOTO
      ===================================================== */}

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

        {/* Change Photo Overlay */}
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

      {/* Hidden Photo Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handlePhotoUpload}
      />

      {/* =====================================================
          4. SUBJECT MARKS TABLE
      ===================================================== */}

      {showMarks &&
        subjects.slice(0, 5).map((sub, idx) => {
          const topY = tableRowPositions[idx];

          return (
            <React.Fragment key={sub.id || idx}>

              {/* Subject / Module */}
              <div
                className="
                  absolute
                  font-bold
                  text-[#081d3d]
                  text-[9.5px]
                  sm:text-[11.5px]
                  truncate
                  -translate-y-1/2
                "
                style={{
                  left: '13.0%',
                  top: topY,
                  maxWidth: '27.5%',
                  fontFamily: "'Times New Roman', Times, serif",
                  lineHeight: 1,
                }}
              >
                {sub.name}
              </div>

              {/* Max Marks */}
              <div
                className="
                  absolute
                  font-bold
                  text-[#081d3d]
                  text-[10px]
                  sm:text-[12.5px]
                  -translate-x-1/2
                  -translate-y-1/2
                  text-center
                "
                style={{
                  left: '46.41%',
                  top: topY,
                  fontFamily: "'Times New Roman', Times, serif",
                  lineHeight: 1,
                }}
              >
                {sub.max}
              </div>

              {/* Assessment */}
              <div
                className="
                  absolute
                  font-bold
                  text-[#081d3d]
                  text-[10px]
                  sm:text-[12.5px]
                  -translate-x-1/2
                  -translate-y-1/2
                  text-center
                "
                style={{
                  left: '61.40%',
                  top: topY,
                  fontFamily: "'Times New Roman', Times, serif",
                  lineHeight: 1,
                }}
              >
                {sub.assessment || sub.practical}
              </div>

              {/* Marks Obtained */}
              <div
                className="
                  absolute
                  font-black
                  text-[#081d3d]
                  text-[10.5px]
                  sm:text-[13px]
                  -translate-x-1/2
                  -translate-y-1/2
                  text-center
                "
                style={{
                  left: '76.31%',
                  top: topY,
                  fontFamily: "'Times New Roman', Times, serif",
                  lineHeight: 1,
                }}
              >
                {sub.marks}
              </div>

              {/* Percentage */}
              <div
                className="
                  absolute
                  font-bold
                  text-[#081d3d]
                  text-[10px]
                  sm:text-[12.5px]
                  -translate-x-1/2
                  -translate-y-1/2
                  text-center
                "
                style={{
                  left: '89.36%',
                  top: topY,
                  fontFamily: "'Times New Roman', Times, serif",
                  lineHeight: 1,
                }}
              >
                {sub.pct ||
                  `${Math.round(
                    ((Number(sub.marks) || 0) /
                      (Number(sub.max) || 100)) *
                      100
                  )}%`}
              </div>

            </React.Fragment>
          );
        })}

      {/* =====================================================
          5. SUMMARY SECTION
      ===================================================== */}

      {showMarks && (
        <>
          {/* Total Marks */}
          <div
            className="
              absolute
              font-black
              text-[#081d3d]
              text-xs
              sm:text-base
              -translate-x-1/2
              -translate-y-1/2
              text-center
            "
            style={{
              left: '18.51%',
              top: '79.54%',
              fontFamily: "'Times New Roman', Times, serif",
              lineHeight: 1,
            }}
          >
            {totalMax}
          </div>

          {/* Marks Obtained */}
          <div
            className="
              absolute
              font-black
              text-[#081d3d]
              text-xs
              sm:text-base
              -translate-x-1/2
              -translate-y-1/2
              text-center
            "
            style={{
              left: '39.43%',
              top: '79.54%',
              fontFamily: "'Times New Roman', Times, serif",
              lineHeight: 1,
            }}
          >
            {totalMarks}
          </div>

          {/* Percentage */}
          <div
            className="
              absolute
              font-black
              text-[#081d3d]
              text-xs
              sm:text-base
              -translate-x-1/2
              -translate-y-1/2
              text-center
            "
            style={{
              left: '60.36%',
              top: '79.54%',
              fontFamily: "'Times New Roman', Times, serif",
              lineHeight: 1,
            }}
          >
            {percentage}%
          </div>

          {/* Grade */}
          <div
            className="
              absolute
              font-black
              text-[#b45309]
              text-sm
              sm:text-xl
              -translate-x-1/2
              -translate-y-1/2
              text-center
            "
            style={{
              left: '83.29%',
              top: '79.54%',
              fontFamily: "'Times New Roman', Times, serif",
              lineHeight: 1,
            }}
          >
            {overallGrade}
          </div>
        </>
      )}

      {/* =====================================================
          6. DATE OF ISSUE
      ===================================================== */}

      {showMarks && (
        <div
          className="
            absolute
            font-bold
            text-[#081d3d]
            text-[10px]
            sm:text-[12.5px]
            -translate-x-1/2
            -translate-y-1/2
            text-center
            whitespace-nowrap
          "
          style={{
            left: '83.43%',
            top: '85.55%',
            fontFamily: "'Times New Roman', Times, serif",
            lineHeight: 1,
          }}
        >
          {issueDate}
        </div>
      )}

      {/* =====================================================
          7. CENTER DIRECTOR / PRINCIPAL SIGNATURE (Uploadable PNG/JPG)
      ===================================================== */}

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

      {/* =====================================================
          PRINT & RESPONSIVE STYLES
      ===================================================== */}

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

          #printable-marksheet-sheet,
          #printable-marksheet-sheet * {
            visibility: visible !important;
          }

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

        /* Mobile toolbar */
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

      {/* =====================================================
          TOP TOOLBAR
      ===================================================== */}

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

        {/* Back Button */}
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

        {/* Action Buttons */}
        <div className="
          marksheet-action-buttons
          flex
          items-center
          justify-end
          gap-2
          w-full
          sm:w-auto
        ">

          {/* Customize Marksheet Form */}
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

          {/* Download PDF */}
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

          {/* Print */}
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

        </div>
      </div>

      {/* Hidden file inputs for School Logo & Principal Signature */}
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

      {/* Pop-up Customization Form Modal */}
      {isFormModalOpen && (
        <div
          className="fixed inset-0 z-[170] flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-4 print:hidden"
          onClick={() => setIsFormModalOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl p-4 sm:p-6 max-w-xl w-full shadow-2xl text-white flex flex-col gap-4 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
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

            {/* Form Fields */}
            <div className="flex flex-col gap-3.5">
              {/* Line 1 */}
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

              {/* Line 2 */}
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

              {/* Line 3 */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-300 flex justify-between">
                  <span>Line 3: Motto / Tagline <span className="text-amber-400 font-bold">(Max 30 chars, Small)</span></span>
                  <span className="text-amber-400 font-bold">{customSchoolMotto.length}/30</span>
                </label>
                <input
                  type="text"
                  value={customSchoolMotto}
                  maxLength={30}
                  placeholder="e.g. EDUCATION ? EMPOWERMENT ? EXCELLENCE"
                  onChange={(e) => {
                    const v = e.target.value;
                    setCustomSchoolMotto(v);
                    handleSaveSchoolDetails(customSchoolName, customSchoolSubtitle, v, customSchoolLogo);
                  }}
                  className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-sans uppercase tracking-wider text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Uploads Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                {/* School Logo */}
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

                {/* Principal Signature */}
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

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition cursor-pointer shadow-md"
              >
                Save & Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          MARKSHEET PREVIEW
      ===================================================== */}

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