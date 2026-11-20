import student1Img from '../assets/programs/student1.jpg';
import student2Img from '../assets/programs/student2.jpg';
import student3Img from '../assets/programs/student3.jpg';
import student4Img from '../assets/programs/student4.jpg';
import student5Img from '../assets/programs/student5.jpg';
import student6Img from '../assets/programs/student6.jpg';
import { getSavedMarksheet } from './marksheetStorage';

export const SAMPLE_STUDENT_PHOTOS = [
  student1Img,
  student2Img,
  student3Img,
  student4Img,
  student5Img,
  student6Img
];

export const getStudentPhotoUrl = (student, index = 0) => {
  if (!student) return SAMPLE_STUDENT_PHOTOS[Math.abs(index) % SAMPLE_STUDENT_PHOTOS.length];
  const url = student.photo_url || student.photoUrl || student.studentPhoto || student.photo;
  if (url && typeof url === 'string' && url.trim().length > 0) return url.trim();
  return SAMPLE_STUDENT_PHOTOS[Math.abs(index) % SAMPLE_STUDENT_PHOTOS.length];
};

export const getStudentRegisterNumber = (student) => {
  if (!student) return 'AB26-001';
  if (student.admissionNo && student.admissionNo !== 'Not provided' && !student.admissionNo.startsWith('BSEL-STU-')) {
    return student.admissionNo;
  }
  if (student.registerNumber && student.registerNumber !== 'Not provided' && !student.registerNumber.startsWith('BSEL-STU-')) {
    return student.registerNumber;
  }
  if (student.registrationNo && student.registrationNo !== 'Not provided' && !student.registrationNo.startsWith('BSEL-STU-')) {
    return student.registrationNo;
  }
  const course = (student.program || student.courseName || 'Abacus Speed Arithmetic').toLowerCase();
  const prefix = course.includes('abacus') ? 'AB' :
                 course.includes('handwriting') ? 'HW' :
                 course.includes('phonics') ? 'PH' :
                 course.includes('vedic') ? 'VM' :
                 course.includes('calligraphy') ? 'CG' :
                 course.includes('art') || course.includes('draw') ? 'DR' :
                 course.includes('html') ? 'HT' :
                 course.includes('css') ? 'CS' :
                 course.includes('python') ? 'PY' :
                 course.includes('office') || course.includes('ms') ? 'MS' :
                 course.includes('canva') ? 'CV' :
                 course.includes('photo') ? 'PS' :
                 course.includes('dance') || course.includes('bharatanatyam') ? 'BN' :
                 course.includes('memory') ? 'MM' :
                 course.includes('comput') ? 'CM' :
                 course.includes('ai') ? 'AI' : 'AB';
  const digits = String(student.userId || '').replace(/\D/g, '').slice(-3) || '001';
  return `${prefix}26-${digits}`;
};

export const generateCertificateNo = (student, courseName, level) => {
  if (student?.certificateNo && !student.certificateNo.includes('BSEL/AB/11/0001') && !student.certificateNo.includes('BSEL/ABACUS/L1/0007')) {
    return student.certificateNo;
  }
  if (student?.results?.[0]?.certificateNo) {
    return student.results[0].certificateNo;
  }
  const course = (courseName || student?.program || student?.courseName || 'Abacus').toLowerCase();
  const prefix = course.includes('abacus') ? 'AB' :
                 course.includes('handwriting') ? 'HW' :
                 course.includes('phonics') ? 'PH' :
                 course.includes('vedic') ? 'VM' :
                 course.includes('calligraphy') ? 'CG' :
                 course.includes('art') || course.includes('draw') ? 'DR' :
                 course.includes('html') ? 'HT' :
                 course.includes('css') ? 'CS' :
                 course.includes('python') ? 'PY' :
                 course.includes('office') || course.includes('ms') ? 'MS' :
                 course.includes('canva') ? 'CV' :
                 course.includes('photo') ? 'PS' :
                 course.includes('dance') || course.includes('bharatanatyam') ? 'BN' :
                 course.includes('memory') ? 'MM' :
                 course.includes('comput') ? 'CM' :
                 course.includes('ai') ? 'AI' : 'AB';
  const rawLvl = String(level || student?.grade || student?.level || '1');
  const lvlNum = rawLvl.replace(/\D/g, '') || '1';
  const regNo = getStudentRegisterNumber(student);
  const regDigits = String(regNo || student?.userId || '').replace(/\D/g, '');
  const seqDigits = regDigits ? String(parseInt(regDigits.slice(-3), 10) || 1).padStart(4, '0') : '0001';
  return `BSEL/${prefix}/L${lvlNum}/${seqDigits}`;
};

export const getCourseSubjectTitle = (courseName) => {
  if (!courseName) return 'ABACUS';
  const c = String(courseName).toUpperCase();
  if (c.includes('HANDWRITING')) return 'HANDWRITING';
  if (c.includes('CALLIGRAPHY')) return 'CALLIGRAPHY';
  if (c.includes('PHONICS')) return 'PHONICS';
  if (c.includes('VEDIC')) return 'VEDIC MATHS';
  if (c.includes('DRAWING') || c.includes('ART')) return 'DRAWING';
  if (c.includes('PYTHON') || c.includes('CODING')) return 'PYTHON CODING';
  if (c.includes('OFFICE') || c.includes('EXCEL')) return 'MS OFFICE';
  if (c.includes('HTML')) return 'HTML5';
  if (c.includes('CSS')) return 'CSS3';
  if (c.includes('ABACUS')) return 'ABACUS';
  return c.split(' ')[0] || 'ABACUS';
};

export const getMarksheetSubjects = (student) => {
  const saved = getSavedMarksheet(student);
  if (saved && Array.isArray(saved.subjects) && saved.subjects.length > 0) {
    return saved.subjects.map((s, index) => ({
      ...s,
      id: s.id || index + 1,
      max: Number(s.max) || 100,
      assessment: Number(s.assessment ?? s.max) || 100,
      practical: Number(s.practical ?? s.max) || 100,
      marks: Number(s.marks) || 0,
      pct: `${Math.round(((Number(s.marks) || 0) / (Number(s.max) || 100)) * 100)}%`
    }));
  }

  const course = (student?.program || student?.courseName || '').toLowerCase();
  
  if (course.includes('html')) {
    return [
      { id: 1, name: 'HTML5 Semantic Structure & Tags', max: 100, assessment: 100, practical: 100, marks: 96, pct: '96%' },
      { id: 2, name: 'Forms, Input Validation & Tables', max: 100, assessment: 100, practical: 100, marks: 98, pct: '98%' },
      { id: 3, name: 'Hyperlinks, Layouts & Media Tags', max: 100, assessment: 100, practical: 100, marks: 94, pct: '94%' },
      { id: 4, name: 'Responsive Architecture & Web DOM', max: 100, assessment: 100, practical: 100, marks: 97, pct: '97%' },
      { id: 5, name: 'Live Web Project & Viva Voce', max: 100, assessment: 100, practical: 100, marks: 95, pct: '95%' }
    ];
  }

  if (course.includes('css')) {
    return [
      { id: 1, name: 'CSS Syntax, Selectors & Cascade', max: 100, assessment: 100, practical: 100, marks: 96, pct: '96%' },
      { id: 2, name: 'Box Model, Margins & Padding', max: 100, assessment: 100, practical: 100, marks: 98, pct: '98%' },
      { id: 3, name: 'Flexbox & CSS Grid Page Layouts', max: 100, assessment: 100, practical: 100, marks: 94, pct: '94%' },
      { id: 4, name: 'Media Queries & Responsive UI', max: 100, assessment: 100, practical: 100, marks: 97, pct: '97%' },
      { id: 5, name: 'Web Styling Portfolio & Viva', max: 100, assessment: 100, practical: 100, marks: 95, pct: '95%' }
    ];
  }

  if (course.includes('art') || course.includes('draw')) {
    return [
      { id: 1, name: 'Freehand Sketching & Line Contour', max: 100, assessment: 100, practical: 100, marks: 96, pct: '96%' },
      { id: 2, name: 'Colour Theory & Shading Gradients', max: 100, assessment: 100, practical: 100, marks: 98, pct: '98%' },
      { id: 3, name: 'Thematic Creative Composition', max: 100, assessment: 100, practical: 100, marks: 94, pct: '94%' },
      { id: 4, name: 'Object, Perspective & Still Life', max: 100, assessment: 100, practical: 100, marks: 97, pct: '97%' },
      { id: 5, name: 'Art Portfolio & Viva Voce', max: 100, assessment: 100, practical: 100, marks: 95, pct: '95%' }
    ];
  }

  if (course.includes('python')) {
    return [
      { id: 1, name: 'Python Syntax & Data Types', max: 100, assessment: 100, practical: 100, marks: 96, pct: '96%' },
      { id: 2, name: 'Control Flow & Conditional Logic', max: 100, assessment: 100, practical: 100, marks: 98, pct: '98%' },
      { id: 3, name: 'Functions, Loops & String Handling', max: 100, assessment: 100, practical: 100, marks: 94, pct: '94%' },
      { id: 4, name: 'Data Structures & Problem Solving', max: 100, assessment: 100, practical: 100, marks: 97, pct: '97%' },
      { id: 5, name: 'Python Code Project & Viva Voce', max: 100, assessment: 100, practical: 100, marks: 95, pct: '95%' }
    ];
  }

  if (course.includes('comput')) {
    return [
      { id: 1, name: 'Computer Architecture & Hardware', max: 100, assessment: 100, practical: 100, marks: 96, pct: '96%' },
      { id: 2, name: 'Operating Systems & File Handling', max: 100, assessment: 100, practical: 100, marks: 98, pct: '98%' },
      { id: 3, name: 'Internet Security & Cyber Safety', max: 100, assessment: 100, practical: 100, marks: 94, pct: '94%' },
      { id: 4, name: 'Keyboarding & Speed Typing Drills', max: 100, assessment: 100, practical: 100, marks: 97, pct: '97%' },
      { id: 5, name: 'IT Application Lab & Viva Voce', max: 100, assessment: 100, practical: 100, marks: 95, pct: '95%' }
    ];
  }

  if (course.includes('office') || course.includes('ms')) {
    return [
      { id: 1, name: 'MS Word Document Formatting', max: 100, assessment: 100, practical: 100, marks: 96, pct: '96%' },
      { id: 2, name: 'MS Excel Formulas & Data Charts', max: 100, assessment: 100, practical: 100, marks: 98, pct: '98%' },
      { id: 3, name: 'MS PowerPoint Slide Design', max: 100, assessment: 100, practical: 100, marks: 94, pct: '94%' },
      { id: 4, name: 'Office Automation & Productivity', max: 100, assessment: 100, practical: 100, marks: 97, pct: '97%' },
      { id: 5, name: 'Applied Office Project & Viva', max: 100, assessment: 100, practical: 100, marks: 95, pct: '95%' }
    ];
  }

  if (course.includes('handwrit') || course.includes('calligraph')) {
    return [
      { id: 1, name: 'Basic Letter Formation & Slant', max: 100, assessment: 100, practical: 100, marks: 96, pct: '96%' },
      { id: 2, name: 'Cursive Flow & Ligature Joins', max: 100, assessment: 100, practical: 100, marks: 98, pct: '98%' },
      { id: 3, name: 'Word Spacing & Line Proportions', max: 100, assessment: 100, practical: 100, marks: 94, pct: '94%' },
      { id: 4, name: 'Speed Transcription Under Clock', max: 100, assessment: 100, practical: 100, marks: 97, pct: '97%' },
      { id: 5, name: 'Spotless Notebook Presentation', max: 100, assessment: 100, practical: 100, marks: 95, pct: '95%' }
    ];
  }

  // Default: Abacus Speed Arithmetic
  return [
    { id: 1, name: 'Abacus Operations & Bead Technique', max: 100, assessment: 100, practical: 100, marks: 96, pct: '96%' },
    { id: 2, name: 'Small Friend & Big Friend Formulas', max: 100, assessment: 100, practical: 100, marks: 98, pct: '98%' },
    { id: 3, name: 'Mental Arithmetic & Visual Anzan', max: 100, assessment: 100, practical: 100, marks: 94, pct: '94%' },
    { id: 4, name: 'Rapid Multi-Row Calculation Drills', max: 100, assessment: 100, practical: 100, marks: 97, pct: '97%' },
    { id: 5, name: 'Speed Arithmetic Accuracy & Viva', max: 100, assessment: 100, practical: 100, marks: 95, pct: '95%' }
  ];
};

/**
 * Uniquely identifies a student for scoping document customizations
 * (School name, subtitle, motto, logo, principal signature) to prevent cross-student leakage.
 */
export const getStudentScopeKey = (studentOrData) => {
  if (!studentOrData) return 'default';
  if (typeof studentOrData === 'string') {
    const s = studentOrData.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    return s || 'default';
  }

  const hasName = Boolean(studentOrData.studentName || studentOrData.name);
  const hasRealAdmission = Boolean(studentOrData.admissionNo && studentOrData.admissionNo !== 'DR26-001');
  const hasRealId = Boolean(studentOrData.studentId || studentOrData.id || studentOrData._id || studentOrData.userId);

  if (!hasName && !hasRealAdmission && !hasRealId && (!studentOrData.registrationNo || studentOrData.registrationNo === 'DR26-001' || studentOrData.registrationNo === 'AB27-001')) {
    return 'default';
  }

  const raw =
    studentOrData.admissionNo ||
    studentOrData.studentId ||
    studentOrData.registerNumber ||
    studentOrData.registrationNo ||
    studentOrData.id ||
    studentOrData._id ||
    studentOrData.userId ||
    studentOrData.studentName ||
    studentOrData.name ||
    '';

  const clean = String(raw).trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  return clean || 'default';
};

export const readStudentCustomHeader = (scopeKey) => {
  if (!scopeKey) return null;
  try {
    const key = `bsel_cert_school_header_${scopeKey}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
    // Backward compatibility: If Sethu ('bn26-001') was customized before scoping, seed from legacy global header
    if (scopeKey === 'bn26-001') {
      const legacy = localStorage.getItem('bsel_certificate_school_header');
      if (legacy) {
        try {
          const parsed = JSON.parse(legacy);
          if (parsed && (parsed.name || parsed.subtitle || parsed.motto || parsed.logo)) {
            localStorage.setItem(key, legacy);
            return parsed;
          }
        } catch (_) {}
      }
    }
  } catch (e) {
    console.warn('Failed to read student custom header:', e);
  }
  return null;
};

export const saveStudentCustomHeader = (scopeKey, data) => {
  if (!scopeKey) return;
  try {
    const key = `bsel_cert_school_header_${scopeKey}`;
    localStorage.setItem(key, JSON.stringify(data));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bsel_student_custom_header_updated', {
        detail: { scopeKey, data }
      }));
    }
  } catch (e) {
    console.warn('Failed to save student custom header:', e);
  }
};

export const readStudentCustomSignature = (scopeKey) => {
  if (!scopeKey) return null;
  try {
    const key = `bsel_cert_principal_signature_${scopeKey}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      return saved;
    }
    // Backward compatibility: If Sethu ('bn26-001') was customized before scoping, seed from legacy global signature
    if (scopeKey === 'bn26-001') {
      const legacySign = localStorage.getItem('bsel_certificate_director_signature');
      if (legacySign) {
        localStorage.setItem(key, legacySign);
        return legacySign;
      }
    }
  } catch (e) {
    console.warn('Failed to read student custom signature:', e);
  }
  return null;
};

export const saveStudentCustomSignature = (scopeKey, dataUrl) => {
  if (!scopeKey) return;
  try {
    const key = `bsel_cert_principal_signature_${scopeKey}`;
    if (dataUrl) {
      localStorage.setItem(key, dataUrl);
    } else {
      localStorage.removeItem(key);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bsel_student_custom_signature_updated', {
        detail: { scopeKey, signature: dataUrl }
      }));
    }
  } catch (e) {
    console.warn('Failed to save student custom signature:', e);
  }
};

/**
 * Manages custom question paper file uploads (PDF, DOCX, Images, etc.)
 * scoped per student so questions can easily be uploaded for respective students.
 */
export const readStudentUploadedQuestions = (scopeKey) => {
  if (!scopeKey) return null;
  try {
    const key = `bsel_student_questions_file_${scopeKey}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to read student uploaded questions:', e);
  }
  return null;
};

export const saveStudentUploadedQuestions = (scopeKey, fileData) => {
  if (!scopeKey) return;
  try {
    const key = `bsel_student_questions_file_${scopeKey}`;
    if (fileData) {
      localStorage.setItem(key, JSON.stringify(fileData));
    } else {
      localStorage.removeItem(key);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bsel_student_questions_updated', {
        detail: { scopeKey, fileData }
      }));
    }
  } catch (e) {
    console.warn('Failed to save student uploaded questions:', e);
    throw e;
  }
};
