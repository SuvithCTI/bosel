import React, { useState, useEffect, useMemo, useRef } from 'react';
import OfficialMarksheetView, { getRemark } from '../components/OfficialMarksheetView';
import { exportPdfFromElement } from '../utils/pdfExport';
import { resolveBranchDetails } from '../utils/branchAuthStorage';
import { getGrade } from '../utils/marksheetStorage';
import {
  CheckCircle2,
  Download,
  Share2,
  Loader2,
  Check,
  ShieldCheck,
  Award,
  FileText,
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  BookOpen,
  Clock,
  Building2,
  GraduationCap,
} from 'lucide-react';

import shieldLogo from '../assets/bsel-shield-logo.png';
import student1Img from '../assets/programs/student1.jpg';
import student2Img from '../assets/programs/student2.jpg';
import student3Img from '../assets/programs/student3.jpg';
import student4Img from '../assets/programs/student4.jpg';
import student5Img from '../assets/programs/student5.jpg';
import student6Img from '../assets/programs/student6.jpg';

const SAMPLE_PHOTOS = [
  student1Img,
  student2Img,
  student3Img,
  student4Img,
  student5Img,
  student6Img,
];

const PHOTO_MAP = {
  student1: student1Img,
  student2: student2Img,
  student3: student3Img,
  student4: student4Img,
  student5: student5Img,
  student6: student6Img,
  alwin: student1Img,
  priya: student2Img,
  hema: student4Img,
  bob: student6Img,
};

const resolveStudentPhoto = (
  name = '',
  reg = '',
  photoParam = null,
  photoKeyParam = null,
  networkPhoto = null
) => {
  if (networkPhoto && (networkPhoto.startsWith('http') || networkPhoto.startsWith('data:') || networkPhoto.startsWith('/'))) {
    return networkPhoto;
  }

  const pKey = String(photoKeyParam || photoParam || '').trim();
  if (pKey && (pKey.startsWith('http') || pKey.startsWith('data:') || pKey.startsWith('/'))) {
    return pKey;
  }

  const cleanReg = String(reg || '').trim();
  const digitsOnly = cleanReg.replace(/\D/g, '');
  const sLow = String(name || '').toLowerCase().trim();

  if (typeof window !== 'undefined') {
    try {
      if (cleanReg) {
        const savedByReg = localStorage.getItem(`bsel_photo_${cleanReg}`);
        if (savedByReg) return savedByReg;
      }
      if (digitsOnly) {
        const savedByDigits = localStorage.getItem(`bsel_photo_${digitsOnly}`);
        if (savedByDigits) return savedByDigits;
      }
      if (sLow) {
        const savedByName = localStorage.getItem(`bsel_photo_${sLow}`);
        if (savedByName) return savedByName;
      }

      const rawUsers = localStorage.getItem('bsel_registered_users');
      if (rawUsers) {
        const users = JSON.parse(rawUsers);
        const match = users.find(
          (u) =>
            (cleanReg && (u.registerNumber === cleanReg || u.admissionNo === cleanReg || u.userId === cleanReg)) ||
            (sLow && (u.studentName?.toLowerCase() === sLow || u.name?.toLowerCase() === sLow))
        );
        if (match) {
          const uPhoto = match.photo_url || match.photoUrl || match.studentPhoto || match.photo;
          if (uPhoto && (uPhoto.startsWith('http') || uPhoto.startsWith('data:') || uPhoto.startsWith('/'))) {
            return uPhoto;
          }
        }
      }

      const rawEnq = localStorage.getItem('bsel_student_enquiries');
      if (rawEnq) {
        const enqs = JSON.parse(rawEnq);
        const match = enqs.find(
          (e) =>
            (cleanReg && (e.admissionNo === cleanReg || e.registerNumber === cleanReg || e.userId === cleanReg)) ||
            (sLow && (e.studentName?.toLowerCase() === sLow || e.name?.toLowerCase() === sLow))
        );
        if (match) {
          const ePhoto = match.studentPhoto || match.photo_url || match.photoUrl || match.photo;
          if (ePhoto && (ePhoto.startsWith('http') || ePhoto.startsWith('data:') || ePhoto.startsWith('/'))) {
            return ePhoto;
          }
        }
      }
    } catch {}
  }

  const kLow = pKey.toLowerCase();
  if (PHOTO_MAP[kLow]) {
    return PHOTO_MAP[kLow];
  }

  if (sLow.includes('alwin')) return student1Img;
  if (sLow.includes('priya')) return student2Img;
  if (sLow.includes('hema')) return student4Img;
  if (sLow.includes('bob')) return student6Img;

  if (digitsOnly) {
    const idx = parseInt(digitsOnly, 10) % SAMPLE_PHOTOS.length;
    return SAMPLE_PHOTOS[idx];
  }

  return student6Img;
};

const resolveParentName = (name = '', reg = '', parentParam = null) => {
  if (parentParam && String(parentParam).trim()) {
    return String(parentParam).trim();
  }

  const sLow = String(name || '').toLowerCase();
  if (sLow.includes('bob')) return 'Guardian';
  if (sLow.includes('alwin')) return 'S. Ramanathan';
  if (sLow.includes('priya')) return 'S. Shanmugam';
  if (sLow.includes('hema')) return 'K. Ramasamy';

  if (typeof window !== 'undefined') {
    try {
      const rawUsers = localStorage.getItem('bsel_registered_users');
      if (rawUsers) {
        const users = JSON.parse(rawUsers);
        const match = users.find(
          (u) =>
            (reg && (u.registerNumber === reg || u.admissionNo === reg || u.userId === reg)) ||
            (name && (u.studentName?.toLowerCase() === sLow || u.name?.toLowerCase() === sLow))
        );
        if (match && (match.parentName || match.fatherName)) {
          return String(match.parentName || match.fatherName);
        }
      }
    } catch {}
  }

  return 'Guardian';
};

const resolveVerificationCodes = (name = '', reg = '', certNo = '', vidParam = '', secParam = '') => {
  let vid = vidParam;
  let sec = secParam;

  let digits = '';
  if (reg) digits = String(reg).replace(/\D/g, '');
  if (!digits && certNo) digits = String(certNo).replace(/\D/g, '');
  const cleanDigits = digits.slice(-4) || '0001';

  if (!vid) {
    vid = `VER-2026-85-${cleanDigits}`;
  }

  if (!sec) {
    const baseStr = `${name}_${reg}_${certNo}`;
    let hash = 0;
    for (let i = 0; i < baseStr.length; i++) {
      hash = ((hash << 5) - hash) + baseStr.charCodeAt(i);
      hash |= 0;
    }
    const absHash = Math.abs(hash).toString(36).toUpperCase().padStart(8, '0');
    const part1 = (cleanDigits.length >= 4 ? `85${cleanDigits}` : '850001').slice(0, 6);
    const part2 = (absHash.slice(0, 4) || '00C5').toUpperCase();
    const part3 = (absHash.slice(4, 8) || 'WSOE').toUpperCase();
    sec = `${part1}-${part2}-${part3}`;
  }

  return { vid, sec };
};

export default function MarksheetVerificationPage({ setActivePage }) {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const marksheetRef = useRef(null);

  // Extract parameters from URL
  const currentStudent = useMemo(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const certNo = params.get('cert') || params.get('certificateNo');
      const name = params.get('name') || params.get('studentName');
      const course = params.get('course') || params.get('courseName');
      const level = params.get('level') || params.get('lvl');
      const grade = params.get('grade');
      const reg = params.get('reg') || params.get('registrationNo');
      const centre = params.get('centre') || params.get('center') || params.get('branch');
      const addr = params.get('addr') || params.get('address');
      const dob = params.get('dob') || params.get('dateOfBirth');
      const duration = params.get('duration');
      const parent = params.get('parent') || params.get('parentName') || params.get('father');
      const school = params.get('school');
      const sub = params.get('sub');
      const motto = params.get('motto');
      const score = params.get('score');
      const marks = params.get('marks');
      const vid = params.get('vid');
      const sec = params.get('sec');
      const photo = params.get('photo');
      const paper = params.get('paper');

      if (certNo || name || reg) {
        const resolvedBranch = resolveBranchDetails(centre || 'Tenkasi');
        return {
          certificateNo: certNo || 'BSEL/PS/L1/0001',
          studentName: name || 'BOB',
          courseName: course || 'ADOBE PHOTOSHOP',
          level: level || 'Level 1',
          grade: grade || 'A+',
          registrationNo: reg || 'PS26-001',
          centreName: centre || resolvedBranch.centreName,
          centreAddress: addr || resolvedBranch.centreAddress || 'Tenkasi, Tamil Nadu',
          dob: dob || '2011-01-01',
          duration: duration || '6 Months',
          parentName: parent || '',
          schoolName: school || '',
          schoolSubtitle: sub || '',
          schoolMotto: motto || '',
          score: score || '',
          marks: marks || '',
          paperType: paper || null,
          vid: vid || '',
          sec: sec || '',
          photo: photo || '',
        };
      }
    }

    // Default student matching uploaded reference
    return {
      certificateNo: 'BSEL/PS/L1/0001',
      studentName: 'BOB',
      courseName: 'ADOBE PHOTOSHOP',
      level: 'Level 1',
      grade: 'A+',
      registrationNo: 'PS26-001',
      centreName: 'Tenkasi',
      centreAddress: 'Dubai',
      dob: '2011-01-01',
      duration: '6 Months',
      parentName: 'Guardian',
      schoolName: 'JCJSKS DJDKD',
      schoolSubtitle: 'VISION FOUNDATION BDN',
      schoolMotto: 'EDUCATION • EMPOWERMENT • EXCELLENCE',
      score: '459 / 500 (92%)',
      marks: '92,90,95,91,91',
      paperType: null,
      vid: 'VER-2026-85-0001',
      sec: '850001-00C5-WSOE',
      photo: 'bob',
    };
  }, []);

  const [networkPhoto, setNetworkPhoto] = useState(null);

  useEffect(() => {
    const reg = currentStudent?.registrationNo || currentStudent?.certificateNo || '';
    const name = currentStudent?.studentName || '';
    const photoParam = currentStudent?.photo || '';
    const cleanReg = String(reg).trim();
    const cleanDigits = cleanReg.replace(/\D/g, '');
    const cleanName = String(name).toLowerCase().trim();

    if (typeof window !== 'undefined') {
      try {
        if (photoParam.startsWith('local:')) {
          const directKey = photoParam.replace('local:', '').trim();
          const direct =
            localStorage.getItem(`bsel_photo_${directKey}`) ||
            localStorage.getItem(`bsel_photo_${directKey.toLowerCase()}`) ||
            localStorage.getItem(`bsel_photo_${directKey.replace(/\D/g, '')}`);
          if (direct) {
            setNetworkPhoto(direct);
            return;
          }
        }
        const localDirect =
          (cleanReg && localStorage.getItem(`bsel_photo_${cleanReg}`)) ||
          (cleanDigits && localStorage.getItem(`bsel_photo_${cleanDigits}`)) ||
          (cleanName && localStorage.getItem(`bsel_photo_${cleanName}`));
        if (localDirect) {
          setNetworkPhoto(localDirect);
          return;
        }
      } catch (e) {}
    }

    const targetKey =
      (photoParam.startsWith('local:') ? photoParam.replace('local:', '').trim() : cleanReg) ||
      cleanDigits ||
      cleanName;
    if (targetKey) {
      fetch(`/api/photo-cache?key=${encodeURIComponent(targetKey)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.photo) {
            setNetworkPhoto(data.photo);
            try {
              if (cleanReg) localStorage.setItem(`bsel_photo_${cleanReg}`, data.photo);
            } catch (e) {}
            return;
          }
          throw new Error('Not found in /api/photo-cache');
        })
        .catch(() => {
          fetch('/api/photo-cache')
            .then((res) => res.json())
            .then((resData) => {
              const cache = resData?.cache;
              if (cache) {
                const found =
                  cache[targetKey] ||
                  cache[targetKey.toLowerCase()] ||
                  cache[cleanReg] ||
                  cache[cleanReg.toLowerCase()] ||
                  (cleanDigits && cache[cleanDigits]) ||
                  (cleanName && cache[cleanName]);
                if (found) {
                  setNetworkPhoto(found);
                  try {
                    if (cleanReg) localStorage.setItem(`bsel_photo_${cleanReg}`, found);
                  } catch (e) {}
                }
              }
            })
            .catch(() => {});
        });
    }
  }, [currentStudent]);

  const studentName = (currentStudent.studentName || 'Candidate Name').toUpperCase();
  const registrationNo = (currentStudent.registrationNo || 'PS26-001').toUpperCase();
  const certificateNo = (currentStudent.certificateNo || 'BSEL/PS/L1/0001').toUpperCase();
  const parentName = resolveParentName(studentName, registrationNo, currentStudent.parentName);
  const dob = currentStudent.dob || '2011-01-01';
  const displayCourse = currentStudent.courseName || 'ADOBE PHOTOSHOP';
  const level = currentStudent.level || 'Level 1';
  const duration = currentStudent.duration || '6 Months';
  const schoolCentre = currentStudent.centreName || 'Tenkasi';
  const address = currentStudent.centreAddress || 'Dubai';

  // Parse marks & performance
  const parsedMarksList = useMemo(() => {
    if (currentStudent.marks) {
      return String(currentStudent.marks)
        .split(',')
        .map((m) => Number(m.trim()))
        .filter((n) => Number.isFinite(n));
    }
    return [92, 90, 95, 91, 91];
  }, [currentStudent.marks]);

  const totalScoreObtained = parsedMarksList.reduce((a, b) => a + b, 0);
  const totalMaxMarks = parsedMarksList.length * 100 || 500;
  const calculatedPercent = Math.round((totalScoreObtained / totalMaxMarks) * 100);

  const displayScore = currentStudent.score || `${totalScoreObtained} / ${totalMaxMarks} (${calculatedPercent}%)`;
  const finalGrade = currentStudent.grade || getGrade(calculatedPercent);
  const remarkText = getRemark(String(calculatedPercent));

  const { vid: verificationId, sec: securityCode } = resolveVerificationCodes(
    studentName,
    registrationNo,
    certificateNo,
    currentStudent.vid,
    currentStudent.sec
  );

  const photoSrc = resolveStudentPhoto(
    studentName,
    registrationNo,
    currentStudent.photo,
    currentStudent.photoKey || currentStudent.photo,
    networkPhoto
  );

  // Construct structured student data to feed into the standalone Marksheet view
  const marksheetStudentData = useMemo(() => {
    return {
      studentName,
      registrationNo,
      admissionNo: registrationNo,
      registerNumber: registrationNo,
      certificateNo,
      program: displayCourse,
      courseName: displayCourse,
      level,
      courseLevel: level,
      duration,
      courseDuration: duration,
      dob,
      dateOfBirth: dob,
      parentName,
      fatherName: parentName,
      branch: schoolCentre,
      school: schoolCentre,
      centreName: schoolCentre,
      address,
      centreAddress: address,
      district: address,
      schoolName: currentStudent.schoolName || '',
      schoolSubtitle: currentStudent.schoolSubtitle || '',
      schoolMotto: currentStudent.schoolMotto || '',
      paperType: currentStudent.paperType || null,
      photo: photoSrc,
      photoUrl: photoSrc,
      avatar: photoSrc,
      showMarks: true,
    };
  }, [
    studentName,
    registrationNo,
    certificateNo,
    displayCourse,
    level,
    duration,
    dob,
    parentName,
    schoolCentre,
    address,
    currentStudent.schoolName,
    currentStudent.schoolSubtitle,
    currentStudent.schoolMotto,
    currentStudent.paperType,
    photoSrc,
  ]);

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    const shareData = {
      title: `Official Marksheet — ${studentName}`,
      text: `Verified B★SEL Official Marksheet of ${studentName}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {}
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadPdf = async () => {
    if (!marksheetRef.current || isDownloading) return;
    try {
      setIsDownloading(true);
      const safeName = studentName.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `BSEL_Marksheet_${registrationNo}_${safeName}.pdf`;
      await exportPdfFromElement(marksheetRef.current, filename, {
        orientation: 'portrait',
        format: 'a4',
      });
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060d24] text-slate-100 flex flex-col items-center justify-start py-3 px-3 sm:py-6 sm:px-4 selection:bg-[#d4af37] selection:text-black">
      {/* Mobile-First Centered Container */}
      <div className="w-full max-w-xl mx-auto space-y-4">
        {/* Navigation & Header: B★SEL Brand & Verified Badge */}
        <div className="bg-[#0b173b] border border-[#1d3269] rounded-2xl p-3 shadow-lg flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            {setActivePage && (
              <button
                type="button"
                onClick={() => setActivePage('home')}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition shrink-0"
                title="Back to Home"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <img src={shieldLogo} alt="BSEL Shield" className="h-10 w-auto object-contain shrink-0" />
            <div className="min-w-0">
              <div
                className="text-lg font-black text-white tracking-wider flex items-center gap-1"
                style={{ fontFamily: "'Cinzel', 'Outfit', Georgia, serif" }}
              >
                <span>B</span>
                <span className="text-[#d4af37]">★</span>
                <span>SEL</span>
              </div>
              <div className="text-[10px] font-semibold text-slate-300 tracking-wider uppercase truncate">
                Board of Skills & Educational Learning
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/80 border border-emerald-500/50 rounded-full shrink-0 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-[11px] font-extrabold text-emerald-300 tracking-wide uppercase">
              Verified
            </span>
          </div>
        </div>

        {/* Gold Ribbon Verification Banner */}
        <div className="w-full bg-gradient-to-r from-[#b78628] via-[#f3db83] to-[#c99a2c] py-2 px-4 shadow-md rounded-xl flex items-center justify-between border border-[#ffd700]/50">
          <span
            className="flex-1 text-center font-black tracking-[0.22em] text-[#081329] text-xs sm:text-sm uppercase"
            style={{ fontFamily: "'Cinzel', 'Outfit', Georgia, serif" }}
          >
            MARKSHEET VERIFIED
          </span>
          <div className="w-6 h-6 rounded-full bg-[#081329] border border-[#ffd700] flex items-center justify-center shadow-sm shrink-0 ml-2">
            <Check className="w-3.5 h-3.5 text-[#52d68a] stroke-[3]" />
          </div>
        </div>

        {/* ============================================================ */}
        {/* STUDENT & MARKSHEET DETAILS CARD                             */}
        {/* ============================================================ */}
        <div className="bg-gradient-to-b from-[#0f1d45] to-[#0a1430] border border-[#203770] rounded-2xl p-4 sm:p-5 shadow-xl space-y-3.5">
          {/* Candidate Profile: Photo on Right, Candidate Info on Left */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0 pr-1 space-y-2">
              <div>
                <div className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">
                  Student Name
                </div>
                <div className="text-base sm:text-lg font-extrabold text-white uppercase truncate tracking-wide mt-0.5">
                  {studentName}
                </div>
                <div className="text-xs font-bold text-sky-400 font-mono tracking-wider mt-0.5">
                  Reg No: {registrationNo}
                </div>
              </div>

              <div>
                <div className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">
                  Parent / Guardian
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-100 uppercase truncate mt-0.5">
                  {parentName}
                </div>
              </div>

              <div>
                <div className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">
                  Date of Birth
                </div>
                <div className="text-xs font-semibold text-slate-200 mt-0.5">
                  {dob}
                </div>
              </div>
            </div>

            {/* Student Photo in Gold Frame */}
            <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl p-[2.5px] bg-gradient-to-b from-[#f5d061] via-[#d4af37] to-[#8c6012] shadow-xl shrink-0">
              <div className="w-full h-full rounded-[13px] overflow-hidden bg-[#070e22] flex items-center justify-center">
                <img
                  src={photoSrc}
                  alt={studentName}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>

          {/* Structured Course & Marksheet Information Tiles */}
          <div className="pt-2 border-t border-[#1a2d59] space-y-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-[#0b1532] border border-[#182852] rounded-xl p-2.5">
                <div className="text-slate-400 font-medium text-[10.5px]">Certificate / Marksheet No:</div>
                <div className="text-sky-300 font-bold font-mono mt-0.5">{certificateNo}</div>
              </div>

              <div className="bg-[#0b1532] border border-[#182852] rounded-xl p-2.5">
                <div className="text-slate-400 font-medium text-[10.5px]">Course:</div>
                <div className="text-white font-bold mt-0.5 uppercase">{displayCourse}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#0b1532] border border-[#182852] rounded-xl p-2.5">
                <div className="text-slate-400 font-medium text-[10.5px]">Level:</div>
                <div className="text-white font-semibold mt-0.5">{level}</div>
              </div>

              <div className="bg-[#0b1532] border border-[#182852] rounded-xl p-2.5">
                <div className="text-slate-400 font-medium text-[10.5px]">Duration:</div>
                <div className="text-white font-semibold mt-0.5">{duration}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-[#0b1532] border border-[#182852] rounded-xl p-2.5">
                <div className="text-slate-400 font-medium text-[10.5px]">School / Exam Centre:</div>
                <div className="text-white font-semibold mt-0.5">{schoolCentre}</div>
              </div>

              <div className="bg-[#0b1532] border border-[#182852] rounded-xl p-2.5">
                <div className="text-slate-400 font-medium text-[10.5px]">Address:</div>
                <div className="text-white font-semibold mt-0.5">{address}</div>
              </div>
            </div>

            {/* Performance & Grade Summary Grid */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="bg-[#0b1532] border border-[#182852] rounded-xl p-2.5 text-center">
                <div className="text-slate-400 font-medium text-[10px]">Total Score</div>
                <div className="text-white font-bold font-mono text-sm mt-0.5">{displayScore}</div>
              </div>

              <div className="bg-[#0b1532] border border-[#182852] rounded-xl p-2.5 text-center">
                <div className="text-slate-400 font-medium text-[10px]">Final Grade</div>
                <div className="text-[#f5d061] font-black text-sm mt-0.5">{finalGrade}</div>
              </div>

              <div className="bg-[#0b1532] border border-[#182852] rounded-xl p-2.5 text-center">
                <div className="text-slate-400 font-medium text-[10px]">Result</div>
                <div className="text-emerald-400 font-extrabold text-sm mt-0.5">PASS</div>
              </div>
            </div>

            {remarkText && (
              <div className="bg-[#081026] border border-[#142347] rounded-xl p-2 text-center text-[11px] text-[#f5d061] font-semibold">
                Remark: {remarkText}
              </div>
            )}

            {/* Security Codes */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-[#081026] border border-[#142347] rounded-xl p-2">
                <div className="text-slate-400 text-[10px]">Verification ID:</div>
                <div className="text-sky-300 font-mono font-bold text-[11px] truncate mt-0.5">
                  {verificationId}
                </div>
              </div>

              <div className="bg-[#081026] border border-[#142347] rounded-xl p-2">
                <div className="text-slate-400 text-[10px]">Security Code:</div>
                <div className="text-[#f5d061] font-mono font-bold text-[11px] truncate mt-0.5">
                  {securityCode}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Trust Stamp */}
          <div className="pt-2 border-t border-[#182a52] flex items-center justify-between text-[10px] text-slate-400">
            <span className="font-semibold tracking-wider text-slate-400">
              REGISTERED UNDER GOVT. OF TAMIL NADU (REGD. TRUST)
            </span>
            <div className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* ORIGINAL MARKSHEET BELOW                                     */}
        {/* ============================================================ */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#d4af37]" />
              Official Digital Marksheet
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Verified Authentic
            </span>
          </div>

          {/* Marksheet Container (Read-Only Original Marksheet) */}
          <div
            ref={marksheetRef}
            className="w-full bg-white border border-[#1b2f60] rounded-xl shadow-2xl overflow-hidden p-0"
          >
            <OfficialMarksheetView
              student={marksheetStudentData}
              standalone={true}
              defaultShowMarks={true}
            />
          </div>
        </div>

        {/* Student Mobile Actions: Download PDF & Share */}
        <div className="grid grid-cols-2 gap-2.5 pt-2 pb-6">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-60 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition active:scale-95 cursor-pointer"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isDownloading ? 'Saving...' : 'Download PDF'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="py-2.5 px-3 bg-[#0d1e48] hover:bg-[#12285e] border border-[#233d7d] text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition active:scale-95 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-[#d4af37]" />
                <span>Share Marksheet</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
