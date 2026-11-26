import React, { useRef, useState, useEffect } from 'react';
import QRCode from 'qrcode';

import { Upload, Download, Loader2, Building2, Image as ImageIcon, X, PenTool, Printer } from 'lucide-react';

import { exportPdfFromElement } from '../utils/pdfExport';

import { getCoursePrefix } from '../utils/authStorage';
import { resolveBranchDetails } from '../utils/branchAuthStorage';
import { getSavedMarksheet, getGrade } from '../utils/marksheetStorage';
import {
  getStudentScopeKey,
  readStudentCustomHeader,
  saveStudentCustomHeader,
  readStudentCustomSignature,
  saveStudentCustomSignature,
  SAMPLE_STUDENT_PHOTOS,
  resolveStudentGrade,
} from '../utils/studentDataHelpers';

import shieldLogo from '../assets/bsel-shield-logo.png';

import lionSeal from '../assets/rising-stars-seal.png';

import msmeLogo from '../assets/msme-logo.png';

import iafLogo from '../assets/iaf-logo.png';

import isoLogo from '../assets/iso-9001-logo.png';
import authSignSeal from '../assets/authorized-signature-seal.png';

const NAVY = '#13427a';

const GOLD = '#c9a227';

export const formatSimpleGrade = (val) => {
  if (!val) return '';
  const s = String(val).trim().toUpperCase();
  if (s === 'ADMITTED' || s.includes('ADMIT')) return '';
  if (s.startsWith('LEVEL') || s.startsWith('GRADE ') || s.startsWith('CLASS') || s.startsWith('STANDARD')) return '';
  if (s.includes('PASS') || s.includes('FAIL') || s.includes('PENDING')) return '';
  if (s.includes('A+')) return 'A+';
  if (s.includes('B+')) return 'B+';
  if (s.includes('C+')) return 'C+';
  if (s.includes('OUTSTANDING') || s.includes('(O)')) return 'A+';
  if (s.includes('EXCELLENT')) return 'A';
  if (s.includes('VERY GOOD')) return 'B+';
  if (s === 'A' || s === 'B' || s === 'C' || s === 'D') return s;
  const match = s.match(/[A-D]\+?/);
  return match ? match[0] : '';
};

export const derivePhotoKey = (photoInput, studentName = '', regNo = '') => {
  const pStr = String(photoInput || '');
  if (pStr.includes('student1')) return 'student1';
  if (pStr.includes('student2')) return 'student2';
  if (pStr.includes('student3')) return 'student3';
  if (pStr.includes('student4')) return 'student4';
  if (pStr.includes('student5')) return 'student5';
  if (pStr.includes('student6')) return 'student6';

  if (pStr.startsWith('http://') || pStr.startsWith('https://') || pStr.startsWith('/uploads/')) {
    return pStr;
  }

  // Handle custom uploaded photo (base64 data URL, blob, or long image string)
  if (pStr.startsWith('data:') || pStr.startsWith('blob:') || pStr.length > 50) {
    const cleanReg = String(regNo || '').trim();
    const cleanName = String(studentName || '').toLowerCase().trim();
    const key = cleanReg || cleanName || 'custom';
    if (typeof window !== 'undefined') {
      try {
        if (cleanReg) localStorage.setItem(`bsel_photo_${cleanReg}`, pStr);
        if (cleanName) localStorage.setItem(`bsel_photo_${cleanName}`, pStr);
        const digits = cleanReg.replace(/\D/g, '');
        if (digits) localStorage.setItem(`bsel_photo_${digits}`, pStr);
      } catch (e) {}
    }
    return `local:${key}`;
  }

  const sLow = String(studentName || '').toLowerCase();
  if (sLow.includes('alwin')) return 'student1';
  if (sLow.includes('priya')) return 'student2';
  if (sLow.includes('hema')) return 'student4';
  if (sLow.includes('bob')) return 'student6';

  const digits = String(regNo || '').replace(/\D/g, '');
  if (digits) {
    const idx = parseInt(digits, 10) % 6;
    return `student${idx + 1}`;
  }

  return 'student1';
};

export const getStudentVerificationMeta = (studentName = '', registrationNo = '', certificateNo = '', student = null, rawGrade = 'A', photoInput = null) => {
  // Verification ID
  let digits = '';
  if (registrationNo) digits = String(registrationNo).replace(/\D/g, '');
  if (!digits && certificateNo) digits = String(certificateNo).replace(/\D/g, '');
  const cleanDigits = (digits.slice(-4) || '8942');
  const vid = `VER-2026-85-${cleanDigits}`;

  // Deterministic 14-char security code e.g. "858942-XJ76-L9P0"
  const baseStr = `${studentName || ''}_${registrationNo || ''}_${certificateNo || ''}`;
  let hash = 0;
  for (let i = 0; i < baseStr.length; i++) {
    hash = ((hash << 5) - hash) + baseStr.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash).toString(36).toUpperCase().padStart(8, '0');
  const part1 = (cleanDigits.length >= 4 ? `85${cleanDigits}` : '858942').slice(0, 6);
  const part2 = (absHash.slice(0, 4) || 'XJ76').toUpperCase();
  const part3 = (absHash.slice(4, 8) || 'L9P0').toUpperCase();
  const sec = `${part1}-${part2}-${part3}`;

  // Parent / Guardian
  let parent = student?.parentName || student?.fatherName || '';
  if (!parent && typeof window !== 'undefined') {
    try {
      const rawUsers = localStorage.getItem('bsel_registered_users');
      if (rawUsers) {
        const users = JSON.parse(rawUsers);
        const u = users.find(x => 
          (registrationNo && (x.registerNumber === registrationNo || x.admissionNo === registrationNo || x.userId === registrationNo)) ||
          (studentName && (x.studentName?.toLowerCase() === studentName.toLowerCase() || x.name?.toLowerCase() === studentName.toLowerCase()))
        );
        if (u) parent = u.parentName || u.fatherName;
      }
    } catch {}
  }
  if (!parent) {
    const sLow = String(studentName || '').toLowerCase();
    if (sLow.includes('alwin')) parent = 'S. RAMANATHAN';
    else if (sLow.includes('priya')) parent = 'S. SHANMUGAM';
    else if (sLow.includes('hema')) parent = 'K. RAMASAMY';
    else if (sLow.includes('bob')) parent = 'ROBERT SMITH';
    else parent = 'S. RAMANATHAN';
  }

  const effectiveStudent = student || {
    studentName,
    name: studentName,
    registrationNo,
    registerNumber: registrationNo,
    admissionNo: registrationNo,
    userId: registrationNo,
    certificateNo,
  };

  // Score & Final Grade (strictly clean grades: A, A+, B, B+, C, D from student marksheet)
  let savedSheet = null;
  try {
    savedSheet = getSavedMarksheet(effectiveStudent);
  } catch {}

  const resolvedMarksheetGrade = resolveStudentGrade(effectiveStudent, rawGrade);
  let gradeText = resolvedMarksheetGrade || '';
  let score = '';

  if (savedSheet) {
    const total = savedSheet.totalMarks ?? 0;
    const max = savedSheet.totalMaximum || (Array.isArray(savedSheet.subjects) ? savedSheet.subjects.length * 100 : 500);
    const pct = savedSheet.percentage !== null && savedSheet.percentage !== undefined
      ? savedSheet.percentage
      : (max > 0 ? Math.round((total / max) * 100) : 0);
    score = `${total} / ${max} (${pct}%)`;
    gradeText = savedSheet.overallGrade || getGrade(Number(pct) || 0);
  } else if (resolvedMarksheetGrade) {
    const sLow = String(studentName || '').toLowerCase();
    if (sLow.includes('alwin')) {
      score = '459 / 500 (91.8%)';
      gradeText = resolvedMarksheetGrade || 'A+';
    } else if (sLow.includes('priya')) {
      score = '482 / 500 (96.4%)';
      gradeText = resolvedMarksheetGrade || 'A+';
    } else if (sLow.includes('hema')) {
      score = '468 / 500 (93.6%)';
      gradeText = resolvedMarksheetGrade || 'A';
    } else {
      score = '';
      gradeText = resolvedMarksheetGrade;
    }
  }

  // Photo Key (Strict 1-to-1 matching with certificate display)
  let resolvedPhoto = photoInput || student?.studentPhoto || student?.photo || student?.photo_url || null;
  if (!resolvedPhoto && typeof window !== 'undefined') {
    try {
      const cleanReg = String(registrationNo || '').trim();
      const sLow = String(studentName || '').toLowerCase().trim();
      if (cleanReg) {
        resolvedPhoto = localStorage.getItem(`bsel_photo_${cleanReg}`) || localStorage.getItem(`bsel_photo_${cleanReg.replace(/\D/g, '')}`);
      }
      if (!resolvedPhoto && sLow) {
        resolvedPhoto = localStorage.getItem(`bsel_photo_${sLow}`);
      }
      if (!resolvedPhoto) {
        const rawUsers = localStorage.getItem('bsel_registered_users');
        if (rawUsers) {
          const users = JSON.parse(rawUsers);
          const u = users.find(x => 
            (cleanReg && (x.registerNumber === cleanReg || x.admissionNo === cleanReg || x.userId === cleanReg)) ||
            (sLow && (x.studentName?.toLowerCase() === sLow || x.name?.toLowerCase() === sLow))
          );
          if (u) resolvedPhoto = u.studentPhoto || u.photo_url || u.photoUrl || u.photo;
        }
      }
    } catch {}
  }
  const photoKey = derivePhotoKey(resolvedPhoto, studentName, registrationNo);

  return { vid, sec, parent, score, gradeText, photoKey, resolvedPhoto };
};

export const buildVerificationUrl = (data = {}, forceLocal = false) => {
  let origin = 'https://besellearning.org';
  if (typeof window !== 'undefined') {
    const hn = window.location.hostname;
    if (forceLocal) {
      origin = window.location.origin;
    } else if (hn === 'localhost' || hn === '127.0.0.1' || hn.startsWith('192.168.') || hn.startsWith('10.')) {
      // Local network testing on mobile phone via Wi-Fi: use LAN IP 192.168.0.7
      const port = window.location.port ? `:${window.location.port}` : '';
      origin = `http://192.168.0.7${port}`;
    } else {
      origin = window.location.origin;
    }
  }

  const p = new URLSearchParams();
  if (data.certificateNo) p.set('cert', data.certificateNo);
  if (data.studentName) p.set('name', data.studentName);
  if (data.courseName) p.set('course', data.courseName);
  if (data.level) p.set('level', data.level);
  if (data.grade) p.set('grade', data.grade);
  if (data.registrationNo) p.set('reg', data.registrationNo);
  if (data.centreName) p.set('centre', data.centreName);
  if (data.centreCode) p.set('code', data.centreCode);
  if (data.issueDate) p.set('date', data.issueDate);
  if (data.duration) p.set('duration', data.duration);
  if (data.centreAddress) p.set('addr', data.centreAddress);
  if (data.schoolName) p.set('school', data.schoolName);
  if (data.schoolSubtitle) p.set('sub', data.schoolSubtitle);
  if (data.schoolMotto) p.set('motto', data.schoolMotto);
  if (data.parentName) p.set('parent', data.parentName);
  if (data.score) p.set('score', data.score);
  if (data.vid) p.set('vid', data.vid);
  if (data.sec) p.set('sec', data.sec);
  if (data.photoKey) p.set('photo', data.photoKey);

  return `${origin}/verify?${p.toString()}`;
};

const formatAddress = (addr, maxLine1 = 35) => {
  if (!addr) return { line1: 'Tenkasi, Tamil Nadu', line2: '' };
  const cleaned = addr.replace(/\s+/g, ' ').replace(/,([^\s])/g, ', $1').trim();
  const titleCased = cleaned
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  if (titleCased.length <= maxLine1) {
    return { line1: titleCased, line2: '' };
  }

  const parts = titleCased.split(',').map((p) => p.trim()).filter(Boolean);
  if (parts.length > 1) {
    let line1 = '';
    let splitIdx = 0;
    for (let i = 0; i < parts.length; i++) {
      const candidate = line1 ? `${line1}, ${parts[i]}` : parts[i];
      if (candidate.length <= maxLine1 || !line1) {
        line1 = candidate;
        splitIdx = i + 1;
      } else {
        break;
      }
    }
    let line2 = parts.slice(splitIdx).join(', ');
    if (line2 && !line1.endsWith(',')) {
      line1 += ',';
    }
    return { line1, line2 };
  }

  const words = titleCased.split(' ');
  let line1 = '';
  let splitIdx = 0;
  for (let i = 0; i < words.length; i++) {
    const candidate = line1 ? `${line1} ${words[i]}` : words[i];
    if (candidate.length <= maxLine1 || !line1) {
      line1 = candidate;
      splitIdx = i + 1;
    } else {
      break;
    }
  }
  const line2 = words.slice(splitIdx).join(' ');
  return { line1, line2 };
};

const formatSingleLineAddress = (addr) => {
  if (!addr) return 'Tenkasi, Tamil Nadu';
  const cleaned = addr.replace(/,([^\s])/g, ', $1').trim();
  return cleaned
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
};

const formatCourseTitle = (course) => {
  if (!course) return 'Abacus';
  const clean = course.replace(/^Mindsparc\s*[-–:]*\s*/i, '').trim();
  return clean
    .split(/\s+/)
    .map((word) => {
      const wLower = word.toLowerCase();
      if (wLower === '&') return '&';
      if (/^[0-9]+[a-zA-Z]*$/.test(word)) return word.toUpperCase();
      if (/^html[0-9]*$/i.test(word)) return word.toUpperCase();
      if (wLower === 'ai') return 'AI';
      if (wLower === 'ui' || wLower === 'ux') return word.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};

const buildStudentAddressLines = (student, centreAddress, registrationNo, studentName, studentId) => {
  let matched = student || null;

  if (!matched?.village && !matched?.district) {
    try {
      const rawEnq = localStorage.getItem('bsel_student_enquiries');
      if (rawEnq) {
        const enqs = JSON.parse(rawEnq);
        const found = enqs.find((e) =>
          (registrationNo && (e.admissionNo === registrationNo || e.registerNumber === registrationNo || e.userId === registrationNo)) ||
          (studentId && (e.id === studentId || e.userId === studentId || e.admissionNo === studentId)) ||
          (studentName && e.studentName?.toLowerCase() === studentName.toLowerCase())
        );
        if (found) matched = { ...found, ...matched };
      }
    } catch {}
  }

  if (!matched?.village && !matched?.district) {
    try {
      const rawUsers = localStorage.getItem('bsel_registered_users');
      if (rawUsers) {
        const users = JSON.parse(rawUsers);
        const found = users.find((u) =>
          (registrationNo && (u.admissionNo === registrationNo || u.registerNumber === registrationNo || u.id === registrationNo)) ||
          (studentName && (u.studentName?.toLowerCase() === studentName.toLowerCase() || u.name?.toLowerCase() === studentName.toLowerCase()))
        );
        if (found) matched = { ...found, ...matched };
      }
    } catch {}
  }

  if (matched) {
    const addr = (matched.address || '').trim();
    const locality = (matched.village || matched.city || '').trim();
    const district = (matched.district || '').trim();
    const pin = (matched.pincode || matched.pinCode || matched.pin || '').trim();

    const hasStructured = locality || district || pin;
    if (hasStructured && addr && addr !== 'Not provided') {
      const allTokens = [];
      addr.split(',').forEach((p) => {
        const t = p.trim();
        if (t && t !== 'Not provided') allTokens.push(t);
      });

      if (locality && locality !== 'Not provided' && !allTokens.some((t) => t.toLowerCase().includes(locality.toLowerCase()))) {
        allTokens.push(locality);
      }

      const distPin = [];
      if (district && district !== 'Not provided') distPin.push(district);
      if (pin && pin !== 'Not provided') distPin.push(pin);
      if (distPin.length > 0) {
        allTokens.push(distPin.length === 2 ? `${distPin[0]} / ${distPin[1]}` : distPin.join(' '));
      }

      let l1 = '';
      let splitIdx = 0;
      for (let i = 0; i < allTokens.length; i++) {
        const candidate = l1 ? `${l1}, ${allTokens[i]}` : allTokens[i];
        if (candidate.length <= 35 || !l1) {
          l1 = candidate;
          splitIdx = i + 1;
        } else {
          break;
        }
      }

      let l2 = '';
      for (let i = splitIdx; i < allTokens.length; i++) {
        const candidate = l2 ? `${l2}, ${allTokens[i]}` : allTokens[i];
        if (candidate.length <= 35 || !l2) {
          l2 = candidate;
        } else {
          break;
        }
      }

      if (l2 && !l1.endsWith(',')) {
        l1 += ',';
      }

      return { line1: l1, line2: l2 };
    }
  }

  const fallback = matched?.address || centreAddress || 'Tenkasi, Tamil Nadu';
  return formatAddress(fallback);
};

const readFileAsDataUrl = (file, cb) => {

  const reader = new FileReader();

  reader.onload = (e) => cb(e.target.result);

  reader.readAsDataURL(file);

};

export default function Certificate({

  studentName = '',

  courseName = 'Abacus',

  level = 'Level 1',

  grade = '',

  duration = '6 Months',

  registrationNo = 'DR26-001',

  certificateNo = '',

  centreName = 'Tenkasi',

  centreCode = 'BSEL-BR-101',

  centreAddress = 'Second Street, Surandai, Keelasurandai, Tenkasi - 627859',

  issueDate = '05-10-2026',

  studentPhoto = null,

  certificateType = 'Certificate of Completion',

  onPhotoUpload = null,

  showControls = true,

  readOnly = false,

  className = '',

  schoolName = '',

  schoolSubtitle = '',

  schoolMotto = '',

  schoolLogo = null,

  onSchoolLogoUpload = null,

  directorSignature = null,

  onDirectorSignatureUpload = null,

  studentId = null,

  admissionNo = null,

  student = null,

  disablePrintStyle = false,

}) {

  const isEditable = !readOnly && showControls;

  const wrapperRef = useRef(null);

  const photoInputRef = useRef(null);

  const logoInputRef = useRef(null);

  const signInputRef = useRef(null);

  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // ----- Student-scoped key derivation -----
  const scopeKey = getStudentScopeKey(student || {
    studentId,
    admissionNo,
    registrationNo,
    studentName,
  });

  // ----- School header (name / subtitle / motto / logo), student-scoped & persisted -----
  const savedHeader = readStudentCustomHeader(scopeKey);
  const savedSign = readStudentCustomSignature(scopeKey);

  const defaultName = (schoolName && schoolName.trim()) ? schoolName : (savedHeader?.name || (centreName ? centreName.toUpperCase() : 'RISING STARS'));
  const defaultSub = (schoolSubtitle && schoolSubtitle.trim()) ? schoolSubtitle : (savedHeader?.subtitle || 'VISION FOUNDATION');
  const defaultMotto = (schoolMotto && schoolMotto.trim()) ? schoolMotto : (savedHeader?.motto || 'EDUCATION • EMPOWERMENT • EXCELLENCE');
  const defaultLogo = (schoolLogo !== undefined && schoolLogo !== null) ? schoolLogo : (savedHeader?.logo || null);
  const defaultSign = (directorSignature !== undefined && directorSignature !== null) ? directorSignature : (savedSign !== null ? savedSign : null);

  const [headerName, setHeaderName] = useState(defaultName);
  const [headerSubtitle, setHeaderSubtitle] = useState(defaultSub);
  const [headerMotto, setHeaderMotto] = useState(defaultMotto);
  const [headerLogo, setHeaderLogo] = useState(defaultLogo);
  const [directorSign, setDirectorSign] = useState(defaultSign);

  // Sync state whenever the student / scopeKey changes (prevent cross-student leakage)
  useEffect(() => {
    const customH = readStudentCustomHeader(scopeKey);
    const customS = readStudentCustomSignature(scopeKey);

    const baseName = (schoolName && schoolName.trim()) ? schoolName : (customH?.name !== undefined ? customH.name : (centreName ? centreName.toUpperCase() : 'RISING STARS'));
    const baseSub = (schoolSubtitle && schoolSubtitle.trim()) ? schoolSubtitle : (customH?.subtitle !== undefined ? customH.subtitle : 'VISION FOUNDATION');
    const baseMotto = (schoolMotto && schoolMotto.trim()) ? schoolMotto : (customH?.motto !== undefined ? customH.motto : 'EDUCATION • EMPOWERMENT • EXCELLENCE');
    const baseLogo = (schoolLogo !== undefined && schoolLogo !== null) ? schoolLogo : (customH?.logo !== undefined ? customH.logo : null);
    const baseSign = (directorSignature !== undefined && directorSignature !== null) ? directorSignature : (customS !== null ? customS : null);

    setHeaderName(baseName);
    setHeaderSubtitle(baseSub);
    setHeaderMotto(baseMotto);
    setHeaderLogo(baseLogo);
    setDirectorSign(baseSign);
  }, [scopeKey, schoolName, schoolSubtitle, schoolMotto, schoolLogo, centreName, directorSignature]);

  // Real-time synchronization across Certificate and Marksheet for the same student or franchise
  useEffect(() => {
    const handleFranchiseBrandingUpdate = (e) => {
      const fb = e.detail?.branding || e.detail?.franchise;
      if (fb) {
        if (fb.schoolName) setHeaderName(fb.schoolName);
        if (fb.subtitle) setHeaderSubtitle(fb.subtitle);
        if (fb.motto) setHeaderMotto(fb.motto);
        if (fb.logo !== undefined) setHeaderLogo(fb.logo);
        if (fb.signature !== undefined) setDirectorSign(fb.signature);
      }
    };
    window.addEventListener('bsel_franchise_branding_updated', handleFranchiseBrandingUpdate);
    window.addEventListener('bsel_school_branding_updated', handleFranchiseBrandingUpdate);
    return () => {
      window.removeEventListener('bsel_franchise_branding_updated', handleFranchiseBrandingUpdate);
      window.removeEventListener('bsel_school_branding_updated', handleFranchiseBrandingUpdate);
    };
  }, []);

  useEffect(() => {
    const handleHeaderUpdate = (e) => {
      if (e.detail?.scopeKey === scopeKey) {
        const d = e.detail.data;
        if (d?.name !== undefined) setHeaderName(d.name);
        if (d?.subtitle !== undefined) setHeaderSubtitle(d.subtitle);
        if (d?.motto !== undefined) setHeaderMotto(d.motto);
        if (d?.logo !== undefined) setHeaderLogo(d.logo);
      }
    };
    const handleSignUpdate = (e) => {
      if (e.detail?.scopeKey === scopeKey) {
        setDirectorSign(e.detail.signature || null);
      }
    };
    window.addEventListener('bsel_student_custom_header_updated', handleHeaderUpdate);
    window.addEventListener('bsel_student_custom_signature_updated', handleSignUpdate);
    return () => {
      window.removeEventListener('bsel_student_custom_header_updated', handleHeaderUpdate);
      window.removeEventListener('bsel_student_custom_signature_updated', handleSignUpdate);
    };
  }, [scopeKey]);

  const saveHeader = (next = {}) => {
    const payload = {
      name: headerName,
      subtitle: headerSubtitle,
      motto: headerMotto,
      logo: headerLogo,
      ...next,
    };
    saveStudentCustomHeader(scopeKey, payload);
  };

  // ----- Derived certificate values -----

  const courseUpper = (courseName || 'ABACUS')

    .replace(/^Mindsparc\s*[-–:]*\s*/i, '')

    .trim()

    .toUpperCase();

  const cleanLevel = (level || 'Level 1').trim().replace(/^[:\s-]+/, '').trim();

  const levelDigits = cleanLevel.replace(/\D/g, '') || '1';

  const coursePrefix = getCoursePrefix(courseUpper);

  const regDigits = String(registrationNo).replace(/\D/g, '');

  const seqDigits = regDigits ? String(parseInt(regDigits.slice(-3), 10) || 1).padStart(4, '0') : '0001';

  let displayCertNo = certificateNo;

  if (!displayCertNo || (coursePrefix !== 'AB' && (displayCertNo.includes('ABACUS') || displayCertNo.includes('BSEL/AB/')))) {

    displayCertNo = `BSEL/${coursePrefix}/L${levelDigits}/${seqDigits}`;

  }

  const [marksheetGradeVersion, setMarksheetGradeVersion] = React.useState(0);
  useEffect(() => {
    const handleMarksUpdate = () => setMarksheetGradeVersion((v) => v + 1);
    window.addEventListener('bsel_marksheets_updated', handleMarksUpdate);
    window.addEventListener('bsel_users_updated', handleMarksUpdate);
    window.addEventListener('storage', handleMarksUpdate);
    return () => {
      window.removeEventListener('bsel_marksheets_updated', handleMarksUpdate);
      window.removeEventListener('bsel_users_updated', handleMarksUpdate);
      window.removeEventListener('storage', handleMarksUpdate);
    };
  }, []);

  const effectiveStudent = React.useMemo(() => {
    return student || {
      studentName,
      name: studentName,
      registrationNo,
      registerNumber: registrationNo,
      admissionNo: registrationNo,
      userId: registrationNo,
      certificateNo: displayCertNo,
      courseName,
      program: courseName,
    };
  }, [student, studentName, registrationNo, displayCertNo, courseName]);

  const displayGrade = React.useMemo(() => {
    return resolveStudentGrade(effectiveStudent, grade);
  }, [effectiveStudent, grade, marksheetGradeVersion]);

  // Resolve consistent student photo
  const displayPhoto = React.useMemo(() => {
    if (studentPhoto) return studentPhoto;
    if (student?.photo_url || student?.photoUrl || student?.studentPhoto || student?.photo) {
      return student.photo_url || student.photoUrl || student.studentPhoto || student.photo;
    }
    const sLow = String(studentName || '').toLowerCase();
    if (sLow.includes('alwin')) return SAMPLE_STUDENT_PHOTOS[0];
    if (sLow.includes('priya')) return SAMPLE_STUDENT_PHOTOS[1];
    if (sLow.includes('hema')) return SAMPLE_STUDENT_PHOTOS[3];
    if (sLow.includes('bob')) return SAMPLE_STUDENT_PHOTOS[5];
    const digits = String(registrationNo || '').replace(/\D/g, '');
    if (digits) {
      const idx = parseInt(digits, 10) % SAMPLE_STUDENT_PHOTOS.length;
      return SAMPLE_STUDENT_PHOTOS[idx];
    }
    return SAMPLE_STUDENT_PHOTOS[0];
  }, [studentPhoto, student, studentName, registrationNo]);

  const resolvedBranch = React.useMemo(() => {
    return resolveBranchDetails(student || { centreName, centreCode, centreAddress }, {
      centreName,
      centreCode,
      centreAddress
    });
  }, [student, centreName, centreCode, centreAddress]);

  const activeCentreName = resolvedBranch.centreName;
  const activeCentreCode = resolvedBranch.centreCode;
  const activeCentreAddress = resolvedBranch.centreAddress;

  const addrLines = React.useMemo(() => {
    return formatAddress(activeCentreAddress);
  }, [activeCentreAddress]);

  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

  useEffect(() => {
    let isMounted = true;
    const meta = getStudentVerificationMeta(
      studentName,
      registrationNo,
      displayCertNo,
      student || effectiveStudent,
      displayGrade,
      displayPhoto
    );

    // Sync student photo for local and cross-device QR scanning
    const activePhoto = displayPhoto || meta.resolvedPhoto;
    if (activePhoto && (activePhoto.startsWith('data:') || activePhoto.startsWith('http') || activePhoto.startsWith('/'))) {
      const cleanReg = String(registrationNo || '').trim();
      const cleanName = String(studentName || '').trim();
      try {
        if (cleanReg) localStorage.setItem(`bsel_photo_${cleanReg}`, activePhoto);
        if (cleanName) localStorage.setItem(`bsel_photo_${cleanName.toLowerCase()}`, activePhoto);
        const digits = cleanReg.replace(/\D/g, '');
        if (digits) localStorage.setItem(`bsel_photo_${digits}`, activePhoto);
      } catch (e) {}

      if (typeof window !== 'undefined' && typeof fetch === 'function') {
        fetch('/api/photo-cache', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key: cleanReg || cleanName,
            reg: registrationNo,
            name: studentName,
            photo: activePhoto,
          }),
        }).catch(() => {});
      }
    }

    const url = buildVerificationUrl({
      certificateNo: displayCertNo,
      studentName,
      courseName,
      level: cleanLevel,
      grade: displayGrade,
      registrationNo,
      centreName: activeCentreName,
      centreCode: activeCentreCode,
      issueDate,
      duration,
      centreAddress: activeCentreAddress,
      schoolName: headerName,
      schoolSubtitle: headerSubtitle,
      schoolMotto: headerMotto,
      parentName: meta.parent,
      score: meta.score,
      vid: meta.vid,
      sec: meta.sec,
      photoKey: meta.photoKey,
    });

    QRCode.toDataURL(
      url,
      {
        width: 260,
        margin: 1,
        color: {
          dark: '#0a254c',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      },
      (err, dataUrl) => {
        if (!err && isMounted) {
          setQrCodeDataUrl(dataUrl);
        }
      }
    );

    return () => {
      isMounted = false;
    };
  }, [
    displayCertNo,
    studentName,
    courseName,
    cleanLevel,
    displayGrade,
    registrationNo,
    activeCentreName,
    activeCentreCode,
    issueDate,
    duration,
    activeCentreAddress,
    headerName,
    headerSubtitle,
    headerMotto,
    student,
    effectiveStudent,
    marksheetGradeVersion,
  ]);

  const courseDisplay = formatCourseTitle(courseName || 'Abacus');

  const leftRows = [
    { label: 'Registration No', value: registrationNo },
    { label: 'Certificate No', value: displayCertNo },
    { label: 'Course', value: courseDisplay },
    { label: 'Level', value: cleanLevel },
    { label: 'Duration', value: duration },
  ];

  const rightRows = [
    { label: 'Centre', value: activeCentreName },
    { label: 'Code', value: activeCentreCode },
    { label: 'Address', value: addrLines.line1 },
    { label: null, value: addrLines.line2 || '' },
    { label: 'Date of Issue', value: issueDate },
  ];

  const formatCertificateTitle = (type) => {
    if (!type) return 'Certificate of Completion';
    const trimmed = String(type).trim();
    if (/^certificate\s+of/i.test(trimmed)) {
      return trimmed
        .split(' ')
        .map((w, i) => (i === 1 && w.toLowerCase() === 'of') ? 'of' : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
    }
    const cleanWord = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    return `Certificate of ${cleanWord}`;
  };

  const displayCertTitle = formatCertificateTitle(certificateType);

  const courseFontSize =
    courseUpper.length > 25 ? 16 :
    courseUpper.length > 18 ? 18 : 20.5;

  // ----- Handlers -----

  const handleDownloadPdf = async () => {

    if (!wrapperRef.current || isDownloadingPdf) return;

    setIsDownloadingPdf(true);

    try {

      const safeStudent = (studentName || 'Candidate').trim().replace(/[^a-zA-Z0-9]/g, '_');

      const safeCourse = (courseUpper || 'Course').replace(/[^a-zA-Z0-9]/g, '_');

      await exportPdfFromElement(wrapperRef.current, {

        filename: `BSEL_${safeCourse}_Certificate_${safeStudent}.pdf`,

        orientation: 'landscape',

        margin: 0,

        backgroundColor: '#ffffff',

        scale: 3,

      });

    } catch (err) {

      console.error('PDF generation failed:', err);

    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLogoFile = (e) => {

    const file = e.target.files?.[0];

    if (!file) return;

    readFileAsDataUrl(file, (url) => {

      setHeaderLogo(url);

      saveHeader({ logo: url });

      onSchoolLogoUpload?.(url);

    });

  };

  const handleSignFile = (e) => {

    const file = e.target.files?.[0];

    if (!file) return;

    readFileAsDataUrl(file, (url) => {

      setDirectorSign(url);

      saveStudentCustomSignature(scopeKey, url);

      onDirectorSignatureUpload?.(url);

    });

  };

  const removeSignature = () => {

    setDirectorSign(null);

    saveStudentCustomSignature(scopeKey, null);

    onDirectorSignatureUpload?.(null);

  };

  const handlePhotoFile = (e) => {

    const file = e.target.files?.[0];

    if (file && onPhotoUpload) readFileAsDataUrl(file, onPhotoUpload);

  };

  // ----- Render -----

  return (

    <div className={`flex flex-col items-center w-full ${className}`}>

      <input type="file" ref={logoInputRef} accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleLogoFile} />

      <input type="file" ref={signInputRef} accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleSignFile} />

      {onPhotoUpload && (

        <input type="file" ref={photoInputRef} accept="image/*" className="hidden" onChange={handlePhotoFile} />

      )}

      {showControls && (
        <div className="w-full max-w-[1024px] mb-3 bg-[#0b173b]/95 text-white p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-xl border border-[#1d3269] print:hidden flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3">
          <div className="text-[11px] sm:text-xs font-semibold text-slate-200 truncate">
            Official B★SEL Certificate: <strong className="text-amber-400 capitalize">{studentName || 'Candidate Name'}</strong> — <span className="text-amber-300 font-bold uppercase">{courseUpper}</span>
          </div>

          <div className="grid grid-cols-3 sm:flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(true)}
              className="px-2 sm:px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-[10px] sm:text-xs font-bold transition flex items-center justify-center gap-1 border border-amber-400/40 cursor-pointer shadow-sm active:scale-95"
              title="Customize School Name, Logo & Authorized Signature"
            >
              <PenTool className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Customize</span>
              <span className="sm:hidden">Customize</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="px-2 sm:px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-[10px] sm:text-xs font-black transition flex items-center justify-center gap-1 shadow-sm cursor-pointer disabled:opacity-50 active:scale-95"
              title="Download Certificate PDF"
            >
              {isDownloadingPdf ? (
                <Loader2 className="w-3.5 h-3.5 shrink-0 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 shrink-0" />
              )}
              <span className="hidden sm:inline">
                {isDownloadingPdf ? 'Generating PDF...' : 'Download PDF'}
              </span>
              <span className="sm:hidden">
                {isDownloadingPdf ? 'Saving...' : 'Download PDF'}
              </span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-2 sm:px-3.5 py-2 bg-[#163e7c] hover:bg-[#1f54a6] text-white rounded-lg text-[10px] sm:text-xs font-black transition flex items-center justify-center gap-1 shadow-sm border border-[#2b599d]/50 cursor-pointer active:scale-95"
              title="Print Certificate (Landscape)"
            >
              <Printer className="w-3.5 h-3.5 shrink-0" />
              <span>Print</span>
            </button>
          </div>
        </div>
      )}

      {isEditable && isFormModalOpen && (

        <div

          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 print:hidden"

          onClick={() => setIsFormModalOpen(false)}

        >

          <div

            className="bg-slate-900 border border-slate-700 rounded-2xl p-4 sm:p-6 max-w-xl w-full text-white flex flex-col gap-4 max-h-[92vh] overflow-y-auto"

            onClick={(e) => e.stopPropagation()}

          >

            <div className="flex items-center justify-between border-b border-slate-700 pb-3">

              <div className="flex items-center gap-2.5">

                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">

                  <Building2 className="w-4 h-4" />

                </div>

                <div>

                  <h3 className="text-sm sm:text-base font-bold">Certificate Customization Form</h3>

                  <p className="text-[11px] text-slate-400">Edit school details, logo, and principal signature</p>

                </div>

              </div>

              <button type="button" onClick={() => setIsFormModalOpen(false)} className="text-slate-400 hover:text-white p-1" aria-label="Close">

                <X className="w-5 h-5" />

              </button>

            </div>

            <div className="flex flex-col gap-3.5 text-xs">

              <label className="flex flex-col gap-1">

                <span className="text-[11px] font-semibold text-slate-300">Line 1: School / Branch Name <span className="text-amber-400 font-bold">(Max 12)</span></span>
                <input
                  type="text"
                  value={headerName}
                  maxLength={12}

                  onChange={(e) => {
                    const val = e.target.value.slice(0, 12);
                    setHeaderName(val);
                    saveHeader({ name: val });
                  }}

                  className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white uppercase font-bold focus:outline-none focus:border-amber-400"

                />

              </label>

              <label className="flex flex-col gap-1">

                <span className="text-[11px] font-semibold text-slate-300">Line 2: Subtitle / Division <span className="text-amber-400 font-bold">(Max 22)</span></span>
                <input
                  type="text"
                  value={headerSubtitle}
                  maxLength={22}

                  onChange={(e) => { setHeaderSubtitle(e.target.value); saveHeader({ subtitle: e.target.value }); }}

                  className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white uppercase focus:outline-none focus:border-amber-400"

                />

              </label>

              <label className="flex flex-col gap-1">

                <span className="text-[11px] font-semibold text-slate-300">Line 3: Motto / Tagline <span className="text-amber-400 font-bold">(Max 30)</span></span>
                <input
                  type="text"
                  value={headerMotto}
                  maxLength={30}

                  onChange={(e) => { setHeaderMotto(e.target.value); saveHeader({ motto: e.target.value }); }}

                  className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white uppercase focus:outline-none focus:border-amber-400"

                />

              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">

                <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl flex flex-col gap-2">

                  <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">

                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" /> School Logo (top right)

                  </span>

                  <div className="flex items-center gap-3">

                    <div className="w-12 h-12 bg-white/10 rounded-lg p-1 border border-slate-700 shrink-0 flex items-center justify-center">

                      {headerLogo ? <img src={headerLogo} alt="Logo" className="max-h-full max-w-full object-contain" /> : <ImageIcon className="w-5 h-5 text-slate-500" />}

                    </div>

                    <div className="flex flex-col gap-1">

                      <button type="button" onClick={() => logoInputRef.current?.click()} className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs">

                        {headerLogo ? 'Change Logo' : 'Upload Logo'}

                      </button>

                      {headerLogo && (

                        <button type="button" onClick={() => { setHeaderLogo(null); saveHeader({ logo: null }); }} className="text-[10px] text-red-400 hover:underline text-left">

                          Remove Logo

                        </button>

                      )}

                    </div>

                  </div>

                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl flex flex-col gap-2">

                  <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">

                    <PenTool className="w-3.5 h-3.5 text-sky-400" /> Principal Signature

                  </span>

                  <div className="flex items-center gap-3">

                    <div className="w-12 h-12 bg-white/10 rounded-lg p-1 border border-slate-700 shrink-0 flex items-center justify-center">

                      {directorSign ? <img src={directorSign} alt="Signature" className="max-h-full max-w-full object-contain" /> : <PenTool className="w-5 h-5 text-slate-500" />}

                    </div>

                    <div className="flex flex-col gap-1">

                      <button type="button" onClick={() => signInputRef.current?.click()} className="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-xs">

                        {directorSign ? 'Change Signature' : 'Upload Signature'}

                      </button>

                      {directorSign && (

                        <button type="button" onClick={removeSignature} className="text-[10px] text-red-400 hover:underline text-left">

                          Remove Signature

                        </button>

                      )}

                    </div>

                  </div>

                </div>

              </div>

            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">

              <button
                type="button"
                onClick={() => {
                  saveHeader({ name: headerName, subtitle: headerSubtitle, motto: headerMotto, logo: headerLogo });
                  setIsFormModalOpen(false);
                }}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition cursor-pointer shadow-md"
              >

                Save & Done

              </button>

            </div>

          </div>

        </div>

      )}

      {/* ===== Print Styles for Clean A4 Landscape Isolation ===== */}
      {!disablePrintStyle && (
        <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: #ffffff !important;
            overflow: visible !important;
          }

          body * {
            visibility: hidden !important;
          }

          #printable-certificate,
          #printable-certificate * {
            visibility: visible !important;
          }

          #printable-certificate {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            max-width: none !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            overflow: hidden !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          #printable-certificate-svg {
            width: 100% !important;
            height: 100% !important;
            display: block !important;
          }
        }
        `}</style>
      )}

      {/* ===== Certificate (vector, print-ready) ===== */}

      <div ref={wrapperRef} id="printable-certificate" className="w-full max-w-[1024px]">

        <svg
          id="printable-certificate-svg"
          viewBox="-23 -17 1070 757"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block bg-white shadow-2xl print:shadow-none"
        >

          <defs>

            <linearGradient id="bsel-gold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f7e29a" />
              <stop offset="50%" stopColor={GOLD} />
              <stop offset="100%" stopColor="#8a6a12" />
            </linearGradient>

            <linearGradient id="bsel-ribbon-bg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a3973" />
              <stop offset="25%" stopColor="#083063" />
              <stop offset="70%" stopColor="#05244d" />
              <stop offset="100%" stopColor="#031938" />
            </linearGradient>

            <linearGradient id="bsel-gold-trim" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#b88b20" />
              <stop offset="15%" stopColor="#fdf0b0" />
              <stop offset="35%" stopColor="#cfa533" />
              <stop offset="50%" stopColor="#fff8cf" />
              <stop offset="65%" stopColor="#cfa533" />
              <stop offset="85%" stopColor="#fdf0b0" />
              <stop offset="100%" stopColor="#a37617" />
            </linearGradient>

            <linearGradient id="bsel-gold-text" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff8d6" />
              <stop offset="30%" stopColor="#fde088" />
              <stop offset="70%" stopColor="#eabf4e" />
              <stop offset="100%" stopColor="#b8891f" />
            </linearGradient>

            <filter id="bsel-text-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="0.8" floodColor="#010710" floodOpacity="0.85" />
            </filter>

            <pattern id="bsel-wm" width="62" height="22" patternUnits="userSpaceOnUse">
              <text x="31" y="16" textAnchor="middle" fontFamily="Georgia, serif" fontSize="12.5" fontWeight="700" fill={NAVY} fillOpacity="0.08">B★SEL</text>
            </pattern>

            <pattern id="bsel-strip" x="24" y="134" width="88" height="22" patternUnits="userSpaceOnUse">
              <text x="44" y="15.5" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="800" fill="#ebd287" letterSpacing="0.8">B ★ S E L</text>
            </pattern>

          </defs>

          {/* Background and borders with elegant outer white margin */}

          <rect x="-23" y="-17" width="1070" height="757" fill="#fff" />

          <rect x="6" y="6" width="1012" height="711" fill="url(#bsel-wm)" />

          <rect x="6" y="6" width="1012" height="711" fill="none" stroke={NAVY} strokeWidth="10" />

          <rect x="24" y="24" width="976" height="675" fill="none" stroke={GOLD} strokeWidth="1.5" />

          {[[24, 14], [1000, 14], [24, 689], [1000, 689]].map(([x, y], i) => (

            <polygon key={i} points={`${x},${y} ${x + 8},${y + 10} ${x},${y + 20} ${x - 8},${y + 10}`} fill={GOLD} />

          ))}

          {/* Header: logos */}
          <image
            href={shieldLogo}
            xlinkHref={shieldLogo}
            x="30"
            y="32"
            width="120"
            height="92"
            preserveAspectRatio="xMidYMid meet"
          />
          <image
            href={lionSeal}
            xlinkHref={lionSeal}
            x="464"
            y="35"
            width="96"
            height="88"
            preserveAspectRatio="xMidYMid meet"
          />

          {/* Header: Left Side (3 lines left-aligned) */}
          <text
            x="168"
            y="74"
            textAnchor="start"
            fontFamily="'Cinzel', 'Outfit', 'Plus Jakarta Sans', Georgia, 'Times New Roman', serif"
            fontWeight="900"
            fontSize="42"
            fill={NAVY}
            letterSpacing="2"
          >
            B <tspan fill={GOLD}>★</tspan> SEL
          </text>

          <text
            x="168"
            y="97"
            textAnchor="start"
            fontFamily="'Cinzel', 'Outfit', 'Plus Jakarta Sans', Georgia, 'Times New Roman', serif"
            fontWeight="800"
            fontSize="13.5"
            fill={NAVY}
            letterSpacing="3.2"
          >
            LEARN • GROW • ACHIEVE
          </text>

          <text
            x="168"
            y="117"
            textAnchor="start"
            fontFamily="'Cinzel', 'Outfit', 'Plus Jakarta Sans', Georgia, 'Times New Roman', serif"
            fontWeight="700"
            fontSize="9.5"
            letterSpacing="0.6"
            fill={NAVY}
          >
            BOARD OF SKILLS AND EDUCATIONAL LEARNING
          </text>

          {/* Top-Right Header: School Details & Logo (Clickable to customize) */}
          <g
            onClick={() => isEditable && setIsFormModalOpen(true)}
            style={{ cursor: isEditable ? 'pointer' : 'default' }}
            title={isEditable ? "Click to customize School Details & Logo" : undefined}
          >
            {/* School / Branch Name (Line 1: fontSize 31) */}
            {headerName && (
              <text
                x={headerLogo ? "722" : "740"}
                y="76"
                textAnchor="middle"
                fontFamily="'Cinzel', 'Outfit', 'Plus Jakarta Sans', Georgia, 'Times New Roman', serif"
                fontWeight="900"
                fontSize="31"
                fill={NAVY}
                letterSpacing="2"
              >
                {(headerName || '').slice(0, 12).toUpperCase()}
              </text>
            )}

            {/* Subtitle / Division (Line 2: exactly matching left side size 13.5 and letterSpacing 3.2) */}
            {headerSubtitle && (
              <text
                x={headerLogo ? "722" : "740"}
                y="98"
                textAnchor="middle"
                fontFamily="'Cinzel', 'Outfit', 'Plus Jakarta Sans', Georgia, 'Times New Roman', serif"
                fontWeight="800"
                fontSize="13.5"
                fill={NAVY}
                letterSpacing="3.2"
              >
                {headerSubtitle.toUpperCase()}
              </text>
            )}

            {/* Motto / Tagline (Line 3: exactly matching left side size 10 and letterSpacing 0.8) */}
            {headerMotto && (
              <text
                x={headerLogo ? "722" : "740"}
                y="117"
                textAnchor="middle"
                fontFamily="'Cinzel', 'Outfit', 'Plus Jakarta Sans', Georgia, 'Times New Roman', serif"
                fontWeight="700"
                fontSize="10"
                fill={NAVY}
                letterSpacing="0.8"
              >
                {headerMotto.toUpperCase()}
              </text>
            )}

            {/* School Logo */}
            {headerLogo ? (
              <image
                href={headerLogo}
                xlinkHref={headerLogo}
                x="888"
                y="30"
                width="98"
                height="98"
                preserveAspectRatio="xMidYMid meet"
              />
            ) : isEditable ? (
              <g className="print:hidden">
                <rect
                  x="890"
                  y="32"
                  width="94"
                  height="94"
                  rx="8"
                  fill="#f8fafc"
                  stroke="#cbd5e1"
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                />
                <text
                  x="937"
                  y="76"
                  textAnchor="middle"
                  fontFamily="Arial, sans-serif"
                  fontSize="11"
                  fontWeight="700"
                  fill="#64748b"
                >
                  + LOGO
                </text>
                <text
                  x="937"
                  y="92"
                  textAnchor="middle"
                  fontFamily="Arial, sans-serif"
                  fontSize="8"
                  fill="#94a3b8"
                >
                  (Click to edit)
                </text>
              </g>
            ) : null}
          </g>

          {/* Blue accent stripe */}
          <rect x="24" y="134" width="976" height="22" fill="#0b2a55" stroke={GOLD} strokeWidth="1.5" />
          <rect x="24" y="134" width="976" height="22" fill="url(#bsel-strip)" />

          {/* Title ribbon */}
          {/* Left Swallowtail Tail */}
          <polygon
            points="196,174 240,174 240,224 196,224 220,199"
            fill="url(#bsel-ribbon-bg)"
          />
          {/* Left Tail Gold Trim */}
          <line x1="196" y1="174" x2="238" y2="174" stroke="url(#bsel-gold-trim)" strokeWidth="2.5" strokeLinecap="round" />
          <polyline
            points="196,174 220,199 196,224"
            fill="none"
            stroke="url(#bsel-gold-trim)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <line x1="196" y1="224" x2="238" y2="224" stroke="url(#bsel-gold-trim)" strokeWidth="2.5" strokeLinecap="round" />

          {/* Right Swallowtail Tail */}
          <polygon
            points="784,174 832,174 808,199 832,224 784,224"
            fill="url(#bsel-ribbon-bg)"
          />
          {/* Right Tail Gold Trim */}
          <line x1="784" y1="174" x2="832" y2="174" stroke="url(#bsel-gold-trim)" strokeWidth="2.5" strokeLinecap="round" />
          <polyline
            points="832,174 808,199 832,224"
            fill="none"
            stroke="url(#bsel-gold-trim)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <line x1="784" y1="224" x2="832" y2="224" stroke="url(#bsel-gold-trim)" strokeWidth="2.5" strokeLinecap="round" />

          {/* 3D Under-fold Shadows */}
          <polygon points="236,217 236,224 219,217" fill="#020a14" />
          <polygon points="788,217 788,224 805,217" fill="#020a14" />

          {/* Front Banner Body */}
          <rect
            x="236"
            y="165"
            width="552"
            height="52"
            fill="url(#bsel-ribbon-bg)"
          />

          {/* Front Banner Top and Bottom Gold Bars */}
          <rect x="236" y="165" width="552" height="3" fill="url(#bsel-gold-trim)" />
          <rect x="236" y="214" width="552" height="3" fill="url(#bsel-gold-trim)" />

          {/* Ribbon Text */}
          <text
            x="512"
            y="203"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontWeight="700"
            fontSize="35"
            fill="url(#bsel-gold-text)"
            filter="url(#bsel-text-shadow)"
            letterSpacing="0.6"
          >
            {displayCertTitle}
          </text>

          <text
            x="512"
            y="244"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontWeight="700"
            fontSize="16"
            letterSpacing="3"
            fill="#09254c"
          >
            THIS IS TO CERTIFY THAT
          </text>

          {/* Student photo (click to upload when onPhotoUpload is provided) */}

          <g onClick={() => isEditable && onPhotoUpload && photoInputRef.current?.click()} style={{ cursor: isEditable && onPhotoUpload ? 'pointer' : 'default' }}>

            <rect x="38" y="238" width="118" height="132" fill="#fff" stroke={GOLD} strokeWidth="5" />

            <rect x="46" y="246" width="102" height="116" fill="#fbf9f2" stroke={NAVY} strokeWidth="2.5" />

            {displayPhoto && (
              <image
                href={displayPhoto}
                xlinkHref={displayPhoto}
                x="46"
                y="246"
                width="102"
                height="116"
                preserveAspectRatio="xMidYMid slice"
              />
            )}

          </g>

          {/* Grade box below student photo - box is always kept; grade calculated from student marksheet when marks entered */}
          <g>
            <rect
              x="46"
              y="382"
              width="102"
              height="28"
              rx="6"
              fill="#ffffff"
              stroke={GOLD}
              strokeWidth="1.8"
            />
            {displayGrade && (
              <text
                x="97"
                y="400"
                textAnchor="middle"
                fontFamily="'Cinzel', 'Outfit', Georgia, serif"
                fontWeight="800"
                fontSize="11.5"
                letterSpacing="1.2"
                fill={NAVY}
              >
                GRADE : {String(displayGrade).replace(/^grade\s*:?\s*/i, '').trim()}
              </text>
            )}
          </g>

          {/* Right: Unique Dynamic QR Code container (exact matching yellow/gold box border) */}
          <g
            style={{ cursor: 'pointer' }}
            title="Click to open digital verification preview"
            onClick={(e) => {
              e.stopPropagation();
              if (typeof window !== 'undefined') {
                const meta = getStudentVerificationMeta(
                  studentName,
                  registrationNo,
                  displayCertNo,
                  student || effectiveStudent,
                  displayGrade,
                  displayPhoto
                );
                const targetUrl = buildVerificationUrl({
                  certificateNo: displayCertNo,
                  studentName,
                  courseName,
                  level,
                  grade: displayGrade,
                  registrationNo,
                  centreName: activeCentreName,
                  centreCode: activeCentreCode,
                  issueDate,
                  duration,
                  centreAddress: activeCentreAddress,
                  schoolName,
                  schoolSubtitle,
                  schoolMotto,
                  parentName: meta.parent,
                  score: meta.score,
                  vid: meta.vid,
                  sec: meta.sec,
                  photoKey: meta.photoKey,
                }, true);
                window.open(targetUrl, '_blank');
              }
            }}
          >
            <rect x="868" y="238" width="118" height="132" fill="#fff" stroke={GOLD} strokeWidth="5" />
            <rect x="876" y="246" width="102" height="116" fill="#ffffff" stroke={NAVY} strokeWidth="2.5" />
            {qrCodeDataUrl && (
              <image
                href={qrCodeDataUrl}
                xlinkHref={qrCodeDataUrl}
                x="882"
                y="250"
                width="90"
                height="90"
                preserveAspectRatio="xMidYMid meet"
              />
            )}
            <text
              x="927"
              y="353"
              textAnchor="middle"
              fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif"
              fontWeight="800"
              fontSize="8"
              fill={NAVY}
              letterSpacing="0.8"
            >
              SCAN TO VERIFY
            </text>
          </g>

          {/* Candidate name */}

          <text
            x="512"
            y="282"
            textAnchor="middle"
            fontFamily="Georgia, serif"
            fontStyle="italic"
            fontWeight="700"
            fontSize={studentName && studentName.length > 22 ? (studentName.length > 30 ? '19' : '21') : '24'}
            fill={NAVY}
          >
            {studentName || 'Candidate Name'}
          </text>

          <line x1="261" y1="295" x2="763" y2="295" stroke={NAVY} strokeWidth="1.8" />

          <text
            x="512"
            y="318"
            textAnchor="middle"
            fontFamily="Georgia, serif"
            fontStyle="italic"
            fontWeight="600"
            fontSize="15"
            fill={NAVY}
          >
            has successfully completed
          </text>

          {/* Enrolled Subject / Course Name */}
          <text
            x="512"
            y="346"
            textAnchor="middle"
            fontFamily="'Cinzel', 'Outfit', Georgia, serif"
            fontWeight="900"
            fontSize={courseFontSize}
            letterSpacing="2.5"
            fill={NAVY}
          >
            {courseUpper}
          </text>

          {/* Level hexagon badge (compact size with gold border) */}

          <polygon points="345,375 420,373 420,377" fill={GOLD} />

          <polygon points="604,373 679,375 604,377" fill={GOLD} />

          <polygon points="432,375 447,361 577,361 592,375 577,389 447,389" fill="#fff" stroke={GOLD} strokeWidth="1.8" />

          <text x="512" y="379.5" textAnchor="middle" fontFamily="'Cinzel', Georgia, serif" fontWeight="800" fontSize="12" letterSpacing="2" fill={NAVY}>

            {cleanLevel.toUpperCase()}

          </text>

          <text x="512" y="413" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700" fontSize="13" fill={NAVY}>

            and has fulfilled the prescribed requirements for the successful completion of the programme.

          </text>

          {/* Details box */}

          <rect x="63" y="436" width="891" height="128" fill="none" stroke={NAVY} strokeWidth="2.5" />

          <line x1="512" y1="451" x2="512" y2="553" stroke={GOLD} strokeWidth="3" />

          <polygon points="512,490 519,498 512,506 505,498" fill={GOLD} />

          <g fontFamily="'Times New Roman', Times, serif" fontWeight="700" fontSize="15" fill={NAVY}>

            {leftRows.map((row, i) => {
              const y = [464, 485, 507, 528, 550][i];
              const isCourse = row.label === 'Course';
              const valLen = row.value ? String(row.value).length : 0;
              return (
                <g key={i}>
                  {row.label && <text x="82" y={y}>{row.label}</text>}
                  {row.label && <text x="213" y={y} textAnchor="middle">:</text>}
                  <text
                    x="232"
                    y={y}
                    {...(valLen > 35
                      ? {
                          textLength: '265',
                          lengthAdjust: 'spacing',
                        }
                      : {})}
                  >
                    {row.value}
                  </text>
                </g>
              );
            })}

            {rightRows.map((row, i) => {
              const y = [464, 485, 507, 528, 550][i];
              return (
                <g key={i}>
                  {row.label && <text x="533" y={y}>{row.label}</text>}
                  {row.label && <text x="664" y={y} textAnchor="middle">:</text>}
                  {row.value && (
                    <text
                      x="683"
                      y={y}
                      {...(row.value.length > 35
                        ? {
                            textLength: '260',
                            lengthAdjust: 'spacing',
                          }
                        : {})}
                    >
                      {row.value}
                    </text>
                  )}
                </g>
              );
            })}

          </g>

          {/* Footer */}

          <line x1="41" y1="577" x2="976" y2="577" stroke={GOLD} strokeWidth="1.5" />

          <image href={msmeLogo} xlinkHref={msmeLogo} x="406" y="595" width="40" height="46" preserveAspectRatio="xMidYMid meet" />

          <image href={iafLogo} xlinkHref={iafLogo} x="476" y="596" width="68" height="44" preserveAspectRatio="xMidYMid meet" />

          <image href={isoLogo} xlinkHref={isoLogo} x="574" y="595" width="44" height="46" preserveAspectRatio="xMidYMid meet" />

          <text x="512" y="664" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="8.5" letterSpacing="0.2" fill={NAVY}>
            REGISTERED UNDER MINISTRY OF MSME, GOVT. OF INDIA
          </text>

          <text x="512" y="675" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="8" fill={GOLD}>
            ★
          </text>

          <text x="512" y="686" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="8.5" letterSpacing="0.2" fill={NAVY}>
            REGISTERED UNDER GOVT. OF TAMIL NADU (REGD. TRUST)
          </text>

          {/* Signatures */}
          {directorSign ? (
            <g
              onClick={() => isEditable && setIsFormModalOpen(true)}
              style={{ cursor: isEditable ? 'pointer' : 'default' }}
              title={isEditable ? "Click to manage Principal Signature" : undefined}
            >
              <image
                href={directorSign}
                xlinkHref={directorSign}
                x="63"
                y="604"
                width="165"
                height="70"
                preserveAspectRatio="xMidYMax meet"
              />
            </g>
          ) : isEditable ? (
            <g
              onClick={() => signInputRef.current?.click()}
              style={{ cursor: 'pointer' }}
              className="print:hidden"
              title="Click to upload Principal Signature"
            >
              <rect
                x="63"
                y="624"
                width="160"
                height="46"
                rx="6"
                fill="#f8fafc"
                stroke="#cbd5e1"
                strokeWidth="1.2"
                strokeDasharray="4 3"
              />
              <text
                x="143"
                y="652"
                textAnchor="middle"
                fontFamily="Arial, sans-serif"
                fontSize="10"
                fontWeight="700"
                fill="#64748b"
              >
                + Principal Sign
              </text>
            </g>
          ) : null}

          <text x="63" y="687" fontFamily="Georgia, serif" fontSize="17" fill={NAVY}>Center Director / Principal</text>

          {/* Official Authorized Signature & Watermark Stamp */}
          <image
            href={authSignSeal}
            xlinkHref={authSignSeal}
            x="765"
            y="594"
            width="195"
            height="82"
            preserveAspectRatio="xMidYMax meet"
          />

          <text x="955" y="687" textAnchor="end" fontFamily="Georgia, serif" fontSize="17" fill={NAVY}>Authorized Signature</text>

        </svg>

      </div>

    </div>

  );

}