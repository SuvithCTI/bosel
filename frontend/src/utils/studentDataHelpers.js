import student1Img from '../assets/programs/student1.jpg';
import student2Img from '../assets/programs/student2.jpg';
import student3Img from '../assets/programs/student3.jpg';
import student4Img from '../assets/programs/student4.jpg';
import student5Img from '../assets/programs/student5.jpg';
import student6Img from '../assets/programs/student6.jpg';
import { getSavedMarksheet, getGrade } from './marksheetStorage';
export { resolveBranchDetails } from './branchAuthStorage';

export const isValidGrade = (val) => {
  if (!val) return false;
  const s = String(val).trim().toUpperCase();
  if (s === 'ADMITTED' || s.includes('ADMIT')) return false;
  if (s.startsWith('LEVEL') || s.startsWith('GRADE ') || s.startsWith('CLASS') || s.startsWith('STANDARD')) return false;
  if (s.includes('PASS') || s.includes('FAIL') || s.includes('PENDING')) return false;
  return /^(A\+|A|B\+|B|C\+|C|D|O)$/i.test(s) || s.includes('OUTSTANDING') || s.includes('EXCELLENT');
};

export const cleanGrade = (val) => {
  if (!val) return '';
  const s = String(val).trim().toUpperCase();
  if (s.includes('A+')) return 'A+';
  if (s.includes('B+')) return 'B+';
  if (s.includes('C+')) return 'C+';
  if (s === 'A' || s.includes('EXCELLENT')) return 'A';
  if (s === 'B') return 'B';
  if (s === 'C') return 'C';
  if (s === 'D') return 'D';
  if (s === 'O' || s.includes('OUTSTANDING')) return 'A+';
  const match = s.match(/[A-D]\+?/);
  return match ? match[0] : '';
};

/**
 * Resolves the academic letter grade (A+, A, B+, B, C, D) strictly from the student's marksheet.
 * If marks have not been updated or the student is only admitted, returns null (no grade).
 */
export const resolveStudentGrade = (student, explicitGrade = '') => {
  let studentObj = student;
  if (typeof student === 'string') {
    studentObj = { userId: student, registerNumber: student, registrationNo: student, studentName: student };
  }

  if (studentObj) {
    try {
      const savedSheet = getSavedMarksheet(studentObj);
      if (savedSheet) {
        if (savedSheet.overallGrade && isValidGrade(savedSheet.overallGrade)) {
          return cleanGrade(savedSheet.overallGrade);
        }
        if (savedSheet.percentage !== undefined && savedSheet.percentage !== null && savedSheet.percentage !== '') {
          const pct = Number(savedSheet.percentage);
          if (!isNaN(pct)) {
            return getGrade(pct);
          }
        }
        if (Array.isArray(savedSheet.subjects) && savedSheet.subjects.length > 0) {
          const validMarks = savedSheet.subjects.filter((s) => typeof s.marks === 'number' && !isNaN(s.marks));
          if (validMarks.length > 0) {
            const total = validMarks.reduce((sum, s) => sum + s.marks, 0);
            const max = validMarks.reduce((sum, s) => sum + (s.max || 100), 0);
            if (max > 0) {
              return getGrade((total / max) * 100);
            }
          }
        }
      }
    } catch {}

    // Check registered users for updated user grade
    if (typeof window !== 'undefined') {
      try {
        const rawUsers = localStorage.getItem('bsel_registered_users');
        if (rawUsers) {
          const users = JSON.parse(rawUsers);
          const sIds = [
            studentObj.userId,
            studentObj.registerNumber,
            studentObj.registrationNo,
            studentObj.admissionNo,
            studentObj.id,
          ].map((s) => String(s || '').trim().toLowerCase()).filter(Boolean);
          const sName = String(studentObj.studentName || studentObj.name || '').trim().toLowerCase();
          const matchedUser = users.find((u) => {
            if (!u) return false;
            const uIds = [u.userId, u.registerNumber, u.registrationNo, u.admissionNo, u.id].map((s) => String(s || '').trim().toLowerCase()).filter(Boolean);
            const idMatch = sIds.some((id) => uIds.includes(id));
            const nameMatch = sName && (String(u.studentName || u.name || '').trim().toLowerCase() === sName);
            return idMatch || nameMatch;
          });
          if (matchedUser) {
            if (matchedUser.percentage !== undefined && matchedUser.percentage !== null && matchedUser.percentage !== '') {
              const p = Number(matchedUser.percentage);
              if (!isNaN(p)) return getGrade(p);
            }
            if (matchedUser.grade && isValidGrade(matchedUser.grade)) {
              return cleanGrade(matchedUser.grade);
            }
          }
        }
      } catch {}
    }

    // Check student's own results array if present
    if (Array.isArray(studentObj.results) && studentObj.results.length > 0) {
      const res = studentObj.results[0];
      const g = res.grade || res.rank;
      if (g && isValidGrade(g)) {
        return cleanGrade(g);
      }
    }

    // Check student.marksheet or student.marksheetGrade
    if (studentObj.marksheet?.overallGrade && isValidGrade(studentObj.marksheet.overallGrade)) {
      return cleanGrade(studentObj.marksheet.overallGrade);
    }

    if (studentObj.grade && isValidGrade(studentObj.grade)) {
      return cleanGrade(studentObj.grade);
    }
  }

  // Explicit grade passed in (if valid letter grade and not dummy/admitted)
  if (explicitGrade && isValidGrade(explicitGrade)) {
    return cleanGrade(explicitGrade);
  }

  return null;
};

export const SAMPLE_STUDENT_PHOTOS = [
  student1Img,
  student2Img,
  student3Img,
  student4Img,
  student5Img,
  student6Img
];

export const getStudentPhotoUrl = (student, index = 0) => {
  const samplePhoto = SAMPLE_STUDENT_PHOTOS[Math.abs(index) % SAMPLE_STUDENT_PHOTOS.length];
  if (!student) return samplePhoto;
  let url = student.photo_url || student.photoUrl || student.studentPhoto || student.photo;
  if (url && typeof url === 'string' && url.trim().length > 0) {
    let clean = url.trim();
    if (clean.includes('suvith-bsel-storage')) {
      clean = clean.replace(/suvith-bsel-storage/g, 'bsel-mindsparc');
    }
    return clean;
  }
  return samplePhoto;
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
  if (c.includes('COGNITIVE') || c.includes('MEMORY')) return 'COGNITIVE';
  if (c.includes('HANDWRITING')) return 'HANDWRITING';
  if (c.includes('CALLIGRAPHY')) return 'CALLIGRAPHY';
  if (c.includes('PHONICS')) return 'PHONICS';
  if (c.includes('VEDIC')) return 'VEDIC MATHS';
  if (c.includes('DRAWING') || c.includes('FINE ART') || c.includes('ART')) return 'DRAWING';
  if (c.includes('PYTHON') || c.includes('CODING')) return 'PYTHON CODING';
  if (c.includes('AI') || c.includes('ARTIFICIAL')) return 'ARTIFICIAL INTELLIGENCE';
  if (c.includes('BHARATANATYAM') || c.includes('DANCE')) return 'BHARATANATYAM';
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
    // 1. If currently in a Franchise session, that Franchise's custom branding applies to all certificates and marksheets
    if (typeof window !== 'undefined') {
      try {
        const sessionRaw = sessionStorage.getItem('bsel_active_session') || localStorage.getItem('bsel_active_session');
        if (sessionRaw) {
          const session = JSON.parse(sessionRaw);
          if (session && (session.role === 'Franchise' || session.role === 'School' || session.schoolRole === 'School')) {
            const fcId = session.franchiseId || session.schoolId || session.id || session.name;
            const fcBranding = localStorage.getItem(`bsel_franchise_branding_${fcId}`) || 
                               sessionStorage.getItem(`bsel_franchise_branding_${fcId}`) || 
                               localStorage.getItem(`bsel_school_branding_${fcId}`) || 
                               sessionStorage.getItem(`bsel_school_branding_${fcId}`) || 
                               localStorage.getItem(`bsel_franchise_branding_${session.id}`) || 
                               sessionStorage.getItem(`bsel_franchise_branding_${session.id}`) || 
                               localStorage.getItem(`bsel_school_branding_${session.id}`) || 
                               sessionStorage.getItem(`bsel_school_branding_${session.id}`) || 
                               localStorage.getItem(`bsel_franchise_branding_${session.name}`) ||
                               sessionStorage.getItem(`bsel_franchise_branding_${session.name}`) ||
                               localStorage.getItem(`bsel_school_branding_${session.name}`) ||
                               sessionStorage.getItem(`bsel_school_branding_${session.name}`);
            if (fcBranding) {
              const parsed = JSON.parse(fcBranding);
              if (parsed && (parsed.name || parsed.schoolName || parsed.logo !== undefined)) {
                return {
                  name: parsed.schoolName || parsed.name || session.schoolName || session.name,
                  subtitle: parsed.subtitle || session.subtitle || 'VISION FOUNDATION',
                  motto: parsed.motto || session.motto || 'EDUCATION • EMPOWERMENT • EXCELLENCE',
                  logo: parsed.logo !== undefined ? parsed.logo : (session.logo || null)
                };
              }
            }
            if (session.schoolName || session.logo !== undefined) {
              return {
                name: session.schoolName || session.name,
                subtitle: session.subtitle || 'VISION FOUNDATION',
                motto: session.motto || 'EDUCATION • EMPOWERMENT • EXCELLENCE',
                logo: session.logo || null
              };
            }
          }
        }
      } catch (_) {}
    }

    // 2. Otherwise check student-scoped override
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

    // Fallback to global branch customization
    const globalHeader = localStorage.getItem('bsel_certificate_school_header');
    if (globalHeader) {
      try {
        return JSON.parse(globalHeader);
      } catch (_) {}
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

    // If active session is Franchise, keep franchise branding synchronized
    if (typeof window !== 'undefined') {
      try {
        const sessionRaw = sessionStorage.getItem('bsel_active_session') || localStorage.getItem('bsel_active_session');
        if (sessionRaw) {
          const session = JSON.parse(sessionRaw);
          if (session && session.role === 'Franchise') {
            const fcId = session.franchiseId || session.id || session.name;
            const fcBrandingRaw = localStorage.getItem(`bsel_franchise_branding_${fcId}`);
            const currentFc = fcBrandingRaw ? JSON.parse(fcBrandingRaw) : {};
            const updatedFc = {
              ...currentFc,
              schoolName: data.name || data.schoolName || currentFc.schoolName,
              name: data.name || currentFc.name,
              subtitle: data.subtitle !== undefined ? data.subtitle : currentFc.subtitle,
              motto: data.motto !== undefined ? data.motto : currentFc.motto,
              logo: data.logo !== undefined ? data.logo : currentFc.logo
            };
            localStorage.setItem(`bsel_franchise_branding_${fcId}`, JSON.stringify(updatedFc));
            localStorage.setItem(`bsel_franchise_branding_${session.name}`, JSON.stringify(updatedFc));
            sessionStorage.setItem('bsel_active_session', JSON.stringify({ ...session, ...updatedFc }));
            window.dispatchEvent(new CustomEvent('bsel_franchise_branding_updated', {
              detail: { franchiseId: fcId, branding: updatedFc }
            }));
          }
        }
      } catch (_) {}
    }

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
    // 1. If currently in a Franchise session, that Franchise's custom signature applies
    if (typeof window !== 'undefined') {
      try {
        const sessionRaw = sessionStorage.getItem('bsel_active_session') || localStorage.getItem('bsel_active_session');
        if (sessionRaw) {
          const session = JSON.parse(sessionRaw);
          if (session && (session.role === 'Franchise' || session.role === 'School' || session.schoolRole === 'School')) {
            const fcId = session.franchiseId || session.schoolId || session.id || session.name;
            const fcBranding = localStorage.getItem(`bsel_franchise_branding_${fcId}`) || 
                               sessionStorage.getItem(`bsel_franchise_branding_${fcId}`) || 
                               localStorage.getItem(`bsel_school_branding_${fcId}`) || 
                               sessionStorage.getItem(`bsel_school_branding_${fcId}`) || 
                               localStorage.getItem(`bsel_franchise_branding_${session.id}`) || 
                               sessionStorage.getItem(`bsel_franchise_branding_${session.id}`) || 
                               localStorage.getItem(`bsel_school_branding_${session.id}`) || 
                               sessionStorage.getItem(`bsel_school_branding_${session.id}`) || 
                               localStorage.getItem(`bsel_franchise_branding_${session.name}`) ||
                               sessionStorage.getItem(`bsel_franchise_branding_${session.name}`) ||
                               localStorage.getItem(`bsel_school_branding_${session.name}`) ||
                               sessionStorage.getItem(`bsel_school_branding_${session.name}`);
            if (fcBranding) {
              const parsed = JSON.parse(fcBranding);
              if (parsed && (parsed.signature !== undefined || parsed.directorSignature !== undefined)) {
                return parsed.signature !== undefined ? parsed.signature : parsed.directorSignature;
              }
            }
            if (session.signature !== undefined || session.directorSignature !== undefined) {
              return session.signature !== undefined ? session.signature : session.directorSignature;
            }
          }
        }
      } catch (_) {}
    }

    // 2. Otherwise check student-scoped override
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

    // Fallback to global branch signature
    const globalSign = localStorage.getItem('bsel_certificate_director_signature');
    if (globalSign) {
      return globalSign;
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

    // If active session is Franchise, keep franchise signature synchronized
    if (typeof window !== 'undefined') {
      try {
        const sessionRaw = sessionStorage.getItem('bsel_active_session') || localStorage.getItem('bsel_active_session');
        if (sessionRaw) {
          const session = JSON.parse(sessionRaw);
          if (session && session.role === 'Franchise') {
            const fcId = session.franchiseId || session.id || session.name;
            const fcBrandingRaw = localStorage.getItem(`bsel_franchise_branding_${fcId}`);
            const currentFc = fcBrandingRaw ? JSON.parse(fcBrandingRaw) : {};
            const updatedFc = {
              ...currentFc,
              signature: dataUrl,
              directorSignature: dataUrl
            };
            localStorage.setItem(`bsel_franchise_branding_${fcId}`, JSON.stringify(updatedFc));
            localStorage.setItem(`bsel_franchise_branding_${session.name}`, JSON.stringify(updatedFc));
            sessionStorage.setItem('bsel_active_session', JSON.stringify({ ...session, ...updatedFc }));
            window.dispatchEvent(new CustomEvent('bsel_franchise_branding_updated', {
              detail: { franchiseId: fcId, branding: updatedFc }
            }));
          }
        }
      } catch (_) {}
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
  if (typeof window !== 'undefined' && window.__BSEL_QUESTIONS_CACHE__?.[scopeKey]) {
    return window.__BSEL_QUESTIONS_CACHE__[scopeKey];
  }
  try {
    const key = `bsel_student_questions_file_${scopeKey}`;
    let saved = localStorage.getItem(key);
    if (!saved && typeof sessionStorage !== 'undefined') {
      saved = sessionStorage.getItem(key);
    }
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.length > 0 ? parsed : null;
      }
      if (parsed && typeof parsed === 'object') {
        return [parsed];
      }
    }
  } catch (e) {
    console.warn('Failed to read student uploaded questions:', e);
  }
  return null;
};

export const saveStudentUploadedQuestions = (scopeKey, fileData) => {
  if (!scopeKey) return;
  const key = `bsel_student_questions_file_${scopeKey}`;

  // Always keep in window cache so in-memory access never fails
  if (typeof window !== 'undefined') {
    window.__BSEL_QUESTIONS_CACHE__ = window.__BSEL_QUESTIONS_CACHE__ || {};
    if (fileData && (Array.isArray(fileData) ? fileData.length > 0 : true)) {
      window.__BSEL_QUESTIONS_CACHE__[scopeKey] = fileData;
    } else {
      delete window.__BSEL_QUESTIONS_CACHE__[scopeKey];
    }
  }

  try {
    if (fileData && (Array.isArray(fileData) ? fileData.length > 0 : true)) {
      const serialized = JSON.stringify(fileData);
      try {
        localStorage.setItem(key, serialized);
      } catch (quotaErr) {
        console.warn('LocalStorage quota exceeded for question file, saving in sessionStorage:', quotaErr);
        try {
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem(key, serialized);
          }
        } catch (_) {}
      }
    } else {
      try { localStorage.removeItem(key); } catch (_) {}
      try { if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(key); } catch (_) {}
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bsel_student_questions_updated', {
        detail: { scopeKey, fileData }
      }));
    }
  } catch (e) {
    console.warn('Failed to save student uploaded questions:', e);
  }
};

export const getBranchScopeKey = (branchName) => {
  if (!branchName) return 'default';
  return String(branchName).trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_') || 'default';
};

export const readBranchCustomHeader = (branchName) => {
  const branchKey = getBranchScopeKey(branchName);
  try {
    const key = `bsel_branch_custom_header_${branchKey}`;
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  try {
    const legacy = localStorage.getItem('bsel_certificate_school_header');
    if (legacy) return JSON.parse(legacy);
  } catch (_) {}
  return null;
};

export const saveBranchCustomHeader = (branchName, data) => {
  const branchKey = getBranchScopeKey(branchName);
  try {
    const key = `bsel_branch_custom_header_${branchKey}`;
    localStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem('bsel_certificate_school_header', JSON.stringify(data));
    localStorage.setItem('bsel_cert_school_header_default', JSON.stringify(data));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bsel_branch_custom_header_updated', {
        detail: { branchKey, branchName, data }
      }));
      window.dispatchEvent(new CustomEvent('bsel_student_custom_header_updated', {
        detail: { scopeKey: 'default', data }
      }));
    }
  } catch (e) {
    console.warn('Failed to save branch custom header:', e);
  }
};

export const readBranchCustomSignature = (branchName) => {
  const branchKey = getBranchScopeKey(branchName);
  try {
    const key = `bsel_branch_custom_signature_${branchKey}`;
    const saved = localStorage.getItem(key);
    if (saved) return saved;
  } catch (_) {}
  try {
    const legacySign = localStorage.getItem('bsel_certificate_director_signature');
    if (legacySign) return legacySign;
  } catch (_) {}
  return null;
};

export const saveBranchCustomSignature = (branchName, dataUrl) => {
  const branchKey = getBranchScopeKey(branchName);
  try {
    const key = `bsel_branch_custom_signature_${branchKey}`;
    if (dataUrl) {
      localStorage.setItem(key, dataUrl);
      localStorage.setItem('bsel_certificate_director_signature', dataUrl);
      localStorage.setItem('bsel_cert_principal_signature_default', dataUrl);
    } else {
      localStorage.removeItem(key);
      localStorage.removeItem('bsel_certificate_director_signature');
      localStorage.removeItem('bsel_cert_principal_signature_default');
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bsel_branch_custom_signature_updated', {
        detail: { branchKey, branchName, signature: dataUrl }
      }));
      window.dispatchEvent(new CustomEvent('bsel_student_custom_signature_updated', {
        detail: { scopeKey: 'default', signature: dataUrl }
      }));
    }
  } catch (e) {
    console.warn('Failed to save branch custom signature:', e);
  }
};
