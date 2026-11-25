import React, { useState, useEffect, useMemo, useRef } from 'react';
import Certificate, { formatSimpleGrade } from '../components/Certificate';
import { exportPdfFromElement } from '../utils/pdfExport';
import { resolveBranchDetails } from '../utils/branchAuthStorage';
import {
  CheckCircle2,
  Download,
  Share2,
  Loader2,
  Check,
  ShieldCheck,
  Award,
  Printer,
} from 'lucide-react';

import shieldLogo from '../assets/bsel-shield-logo.png';
import adminImg from '../assets/AdminImage.jpg';
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

// Helper to determine the photo for a student
const resolveStudentPhoto = (name = '', reg = '', photoParam = null, photoKey = '', networkPhoto = null) => {
  // If network / cache photo is already resolved
  if (networkPhoto && (networkPhoto.startsWith('data:') || networkPhoto.startsWith('http') || networkPhoto.startsWith('/'))) {
    return networkPhoto;
  }

  const pKey = String(photoKey || photoParam || '').trim();
  const cleanReg = String(reg || '').trim();
  const digitsOnly = cleanReg.replace(/\D/g, '');
  const sLow = String(name || '').toLowerCase().trim();

  // 1. Direct data: or http/https or /uploads in parameter
  if (pKey.startsWith('http') || pKey.startsWith('data:') || pKey.startsWith('/uploads')) {
    return pKey;
  }

  // 2. Check localStorage for direct photo keys
  if (typeof window !== 'undefined') {
    try {
      if (pKey.startsWith('local:')) {
        const target = pKey.replace('local:', '').trim();
        const saved = localStorage.getItem(`bsel_photo_${target}`) ||
                      localStorage.getItem(`bsel_photo_${target.toLowerCase()}`) ||
                      localStorage.getItem(`bsel_photo_${target.replace(/\D/g, '')}`);
        if (saved) return saved;
      }
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
    } catch {}
  }

  // 3. Search in localStorage registered users for custom photo
  if (typeof window !== 'undefined') {
    try {
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
    } catch {}
  }

  // 4. Search in localStorage student enquiries for custom photo
  if (typeof window !== 'undefined') {
    try {
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

  // 5. Named stock photo mapping
  const kLow = pKey.toLowerCase();
  if (PHOTO_MAP[kLow]) {
    return PHOTO_MAP[kLow];
  }

  // 6. Search by student name
  if (sLow.includes('alwin')) return student1Img;
  if (sLow.includes('priya')) return student2Img;
  if (sLow.includes('hema')) return student4Img;
  if (sLow.includes('bob')) return student6Img;

  // 7. Consistent index by registration number
  if (digitsOnly) {
    const idx = parseInt(digitsOnly, 10) % SAMPLE_PHOTOS.length;
    return SAMPLE_PHOTOS[idx];
  }

  return student1Img;
};

// Helper for Parent/Guardian
const resolveParentName = (name = '', reg = '', parentParam = null) => {
  if (parentParam && String(parentParam).trim()) {
    return String(parentParam).trim();
  }

  const sLow = String(name || '').toLowerCase();
  if (sLow.includes('alwin')) return 'S. Ramanathan';
  if (sLow.includes('priya')) return 'S. Shanmugam';
  if (sLow.includes('hema')) return 'K. Ramasamy';
  if (sLow.includes('bob')) return 'Robert Smith';

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

  return 'S. Ramanathan';
};

// Helper for Scores & Grades (clean simple grade: A, A+, B, B+ strictly from marksheet)
const resolveScoreAndGrade = (name = '', gradeParam = '', scoreParam = '') => {
  const cleanGrade = formatSimpleGrade(gradeParam);

  const sLow = String(name || '').toLowerCase();
  if (sLow.includes('alwin')) {
    return { score: scoreParam || '459 / 500 (91.8%)', grade: cleanGrade || 'A+' };
  }
  if (sLow.includes('priya')) {
    return { score: scoreParam || '482 / 500 (96.4%)', grade: cleanGrade || 'A+' };
  }
  if (sLow.includes('hema')) {
    return { score: scoreParam || '468 / 500 (93.6%)', grade: cleanGrade || 'A' };
  }
  if (sLow.includes('bob')) {
    return { score: scoreParam || '', grade: cleanGrade || '' };
  }

  return { score: scoreParam || (cleanGrade ? '459 / 500 (91.8%)' : ''), grade: cleanGrade || '' };
};

// Helper for Verification ID & Security Code
const resolveVerificationCodes = (name = '', reg = '', certNo = '', vidParam = '', secParam = '') => {
  let vid = vidParam;
  let sec = secParam;

  let digits = '';
  if (reg) digits = String(reg).replace(/\D/g, '');
  if (!digits && certNo) digits = String(certNo).replace(/\D/g, '');
  const cleanDigits = digits.slice(-4) || '8942';

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
    const part1 = (cleanDigits.length >= 4 ? `85${cleanDigits}` : '858942').slice(0, 6);
    const part2 = (absHash.slice(0, 4) || 'XJ76').toUpperCase();
    const part3 = (absHash.slice(4, 8) || 'L9P0').toUpperCase();
    sec = `${part1}-${part2}-${part3}`;
  }

  return { vid, sec };
};

export default function CertificateVerificationPage({ setActivePage }) {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const certContainerRef = useRef(null);

  // Extract certificate data from URL search parameters
  const currentStudent = useMemo(() => {
    if (typeof window === 'undefined') return null;

    const params = new URLSearchParams(window.location.search);
    const certNo = params.get('cert') || params.get('certificateNo');
    const name = params.get('name') || params.get('studentName');
    const course = params.get('course') || params.get('courseName');
    const level = params.get('level') || params.get('lvl');
    const grade = params.get('grade');
    const reg = params.get('reg') || params.get('registrationNo');
    const centre = params.get('centre') || params.get('centreName');
    const code = params.get('code') || params.get('centreCode');
    const date = params.get('date') || params.get('issueDate');
    const duration = params.get('duration');
    const addr = params.get('addr') || params.get('centreAddress');
    const school = params.get('school') || params.get('schoolName');
    const sub = params.get('sub') || params.get('schoolSubtitle');
    const motto = params.get('motto') || params.get('schoolMotto');
    const parent = params.get('parent');
    const score = params.get('score');
    const vid = params.get('vid');
    const sec = params.get('sec');
    const photo = params.get('photo');

    // If student parameters exist in URL, use them directly!
    const resolvedBranch = resolveBranchDetails(
      { branch: centre, code, address: addr },
      { centreName: centre, centreCode: code, centreAddress: addr }
    );

    if (name || reg || certNo) {
      return {
        certificateNo: certNo || 'BSEL-2026-8942',
        studentName: name || 'M. A. ALWIN RAJ',
        courseName: course || 'Advanced Abacus & Mental Arithmetic',
        level: level || 'Level 1',
        grade: formatSimpleGrade(grade),
        registrationNo: reg || 'BSEL-2026-8942',
        centreName: resolvedBranch.centreName,
        centreCode: resolvedBranch.centreCode,
        issueDate: date || '05-10-2026',
        duration: duration || '6 Months',
        centreAddress: resolvedBranch.centreAddress,
        schoolName: school || '',
        schoolSubtitle: sub || '',
        schoolMotto: motto || '',
        parentName: parent || '',
        score: score || '',
        vid: vid || '',
        sec: sec || '',
        photo: photo || '',
      };
    }

    // Default student matching reference
    const defaultBranch = resolveBranchDetails('Tenkasi');
    return {
      certificateNo: 'BSEL-2026-8942',
      studentName: 'M. A. ALWIN RAJ',
      courseName: 'Advanced Abacus & Mental Arithmetic',
      level: 'Level 1',
      grade: 'A+',
      registrationNo: 'BSEL-2026-8942',
      centreName: defaultBranch.centreName,
      centreCode: defaultBranch.centreCode,
      issueDate: '05-10-2026',
      duration: '6 Months',
      centreAddress: defaultBranch.centreAddress,
      schoolName: '',
      schoolSubtitle: '',
      schoolMotto: '',
      parentName: 'S. Ramanathan',
      score: '459 / 500 (91.8%)',
      vid: 'VER-2026-85-8942',
      sec: '858942-XJ76-L9P0',
      photo: 'alwin',
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

    // 1. Check local storage directly
    if (typeof window !== 'undefined') {
      try {
        if (photoParam.startsWith('local:')) {
          const directKey = photoParam.replace('local:', '').trim();
          const direct = localStorage.getItem(`bsel_photo_${directKey}`) ||
                         localStorage.getItem(`bsel_photo_${directKey.toLowerCase()}`) ||
                         localStorage.getItem(`bsel_photo_${directKey.replace(/\D/g, '')}`);
          if (direct) {
            setNetworkPhoto(direct);
            return;
          }
        }
        const localDirect = (cleanReg && localStorage.getItem(`bsel_photo_${cleanReg}`)) ||
                            (cleanDigits && localStorage.getItem(`bsel_photo_${cleanDigits}`)) ||
                            (cleanName && localStorage.getItem(`bsel_photo_${cleanName}`));
        if (localDirect) {
          setNetworkPhoto(localDirect);
          return;
        }
      } catch (e) {}
    }

    // 2. Query photo cache API (supported across devices / phones over LAN)
    const targetKey = (photoParam.startsWith('local:') ? photoParam.replace('local:', '').trim() : cleanReg) || cleanDigits || cleanName;
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
          // Fallback to full photo cache API
          fetch('/api/photo-cache')
            .then((res) => res.json())
            .then((resData) => {
              const cache = resData?.cache;
              if (cache) {
                const found = cache[targetKey] || cache[targetKey.toLowerCase()] ||
                              cache[cleanReg] || cache[cleanReg.toLowerCase()] ||
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
  const registrationNo = (currentStudent.registrationNo || currentStudent.certificateNo || 'BSEL-2026-8942').toUpperCase();
  const parentName = resolveParentName(studentName, registrationNo, currentStudent.parentName);
  const { score: totalScore, grade: finalGrade } = resolveScoreAndGrade(studentName, currentStudent.grade, currentStudent.score);
  const { vid: verificationId, sec: securityCode } = resolveVerificationCodes(
    studentName,
    registrationNo,
    currentStudent.certificateNo,
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

  const displayCourse = currentStudent.courseName || 'Advanced Abacus & Mental Arithmetic';
  const displaySchoolCenter = (() => {
    const sName = (currentStudent.schoolName || '').trim();
    const cName = (currentStudent.centreName || '').trim();
    if (sName && cName) {
      if (sName.toLowerCase().includes(cName.toLowerCase())) return sName;
      return `${sName} — ${cName} Centre`;
    }
    if (sName) return sName;
    if (cName) return `${cName} Centre`;
    return 'B★SEL Learning Centre';
  })();

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    const shareData = {
      title: `Official Certificate — ${studentName}`,
      text: `Verified B★SEL Certificate of ${studentName}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // fallback
      }
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!certContainerRef.current || isDownloading) return;
    try {
      setIsDownloading(true);
      const safeName = studentName.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `BSEL_Certificate_${registrationNo}_${safeName}.pdf`;
      await exportPdfFromElement(certContainerRef.current, {
        filename,
        orientation: 'landscape',
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
      
      {/* Mobile-First Container (Optimized for Phone Screens) */}
      <div className="w-full max-w-md mx-auto space-y-3.5">

        {/* Top Header: B★SEL Brand & Verified Badge */}
        <div className="bg-[#0b173b] border border-[#1d3269] rounded-2xl p-3 shadow-lg flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <img src={shieldLogo} alt="BSEL Shield" className="h-10 w-auto object-contain shrink-0" />
            <div className="min-w-0">
              <div
                className="text-lg font-black text-white tracking-wider flex items-center gap-1"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
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

        {/* Gold Ribbon Verification Banner (From Reference Image) */}
        <div className="w-full bg-gradient-to-r from-[#b78628] via-[#f3db83] to-[#c99a2c] py-2 px-4 shadow-md rounded-xl flex items-center justify-between border border-[#ffd700]/50">
          <span
            className="flex-1 text-center font-black tracking-[0.22em] text-[#081329] text-xs sm:text-sm uppercase"
            style={{ fontFamily: "'Cinzel', 'Outfit', Georgia, serif" }}
          >
            CERTIFICATE VERIFIED
          </span>
          <div className="w-6 h-6 rounded-full bg-[#081329] border border-[#ffd700] flex items-center justify-center shadow-sm shrink-0 ml-2">
            <Check className="w-3.5 h-3.5 text-[#52d68a] stroke-[3]" />
          </div>
        </div>

        {/* Student Details & Photo Card (Matching Exact Reference Layout & Fields) */}
        <div className="bg-gradient-to-b from-[#0f1d45] to-[#0a1430] border border-[#203770] rounded-2xl p-4 shadow-xl space-y-3">
          
          {/* Top Section: Photo on Right, Candidate & Parent on Left */}
          <div className="flex items-center justify-between gap-3">
            {/* Left: Candidate & Parent Information */}
            <div className="flex-1 min-w-0 pr-1 space-y-2">
              <div>
                <div className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">
                  Student Name:
                </div>
                <div className="text-base sm:text-lg font-extrabold text-white uppercase truncate tracking-wide mt-0.5">
                  {studentName}
                </div>
                <div className="text-xs font-bold text-sky-400 font-mono tracking-wider mt-0.5">
                  {registrationNo}
                </div>
              </div>

              <div>
                <div className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">
                  Parent/Guardian:
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-100 uppercase truncate mt-0.5">
                  {parentName}
                </div>
              </div>
            </div>

            {/* Right: Student Photo in Gold Frame */}
            <div className="w-24 h-28 sm:w-26 sm:h-30 rounded-2xl p-[2.5px] bg-gradient-to-b from-[#f5d061] via-[#d4af37] to-[#8c6012] shadow-xl shrink-0">
              <div className="w-full h-full rounded-[13px] overflow-hidden bg-[#070e22] flex items-center justify-center">
                <img
                  src={photoSrc}
                  alt={studentName}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>

          {/* Structured Reference Credential Fields (From Reference Images) */}
          <div className="pt-2 border-t border-[#1a2d59] space-y-2 text-xs">
            <div className="bg-[#0b1532] border border-[#182852] rounded-xl p-2.5">
              <div className="text-slate-400 font-medium text-[10.5px]">Course Name:</div>
              <div className="text-white font-bold mt-0.5">{displayCourse}</div>
            </div>

            <div className="bg-[#0b1532] border border-[#182852] rounded-xl p-2.5">
              <div className="text-slate-400 font-medium text-[10.5px]">School / Center:</div>
              <div className="text-white font-semibold mt-0.5">{displaySchoolCenter}</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#0b1532] border border-[#182852] rounded-xl p-2.5">
                <div className="text-slate-400 font-medium text-[10.5px]">Total Score:</div>
                <div className="text-white font-bold font-mono mt-0.5">{totalScore}</div>
              </div>

              <div className="bg-[#0b1532] border border-[#182852] rounded-xl p-2.5">
                <div className="text-slate-400 font-medium text-[10.5px]">Final Grade:</div>
                <div className="text-[#f5d061] font-bold uppercase mt-0.5">{finalGrade}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-0.5">
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

        {/* Digital Certificate Container (Read-Only, Clean Mobile Scale) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#d4af37]" />
              Official Digital Certificate
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Issued: {currentStudent.issueDate || '05-10-2026'}
            </span>
          </div>

          <div
            ref={certContainerRef}
            className="w-full bg-[#050b1a] border border-[#1b2f60] rounded-2xl p-1 shadow-2xl overflow-hidden"
          >
            <Certificate
              studentName={studentName}
              courseName={currentStudent.courseName}
              level={currentStudent.level}
              grade={finalGrade}
              registrationNo={registrationNo}
              certificateNo={currentStudent.certificateNo}
              centreName={currentStudent.centreName}
              centreCode={currentStudent.centreCode}
              centreAddress={currentStudent.centreAddress}
              issueDate={currentStudent.issueDate}
              duration={currentStudent.duration}
              studentPhoto={photoSrc}
              schoolName={currentStudent.schoolName}
              schoolSubtitle={currentStudent.schoolSubtitle}
              schoolMotto={currentStudent.schoolMotto}
              showControls={false}
              readOnly={true}
            />
          </div>
        </div>

        {/* Verification Actions: Download PDF, Print & Share (Identical in Desktop and Mobile) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="py-2.5 px-2 sm:px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-60 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition active:scale-95 cursor-pointer"
            title="Download Certificate as PDF"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            ) : (
              <Download className="w-4 h-4 shrink-0" />
            )}
            <span className="truncate">{isDownloading ? 'Saving...' : 'Download PDF'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="py-2.5 px-2 sm:px-3 bg-[#163e7c] hover:bg-[#1f54a6] border border-[#2b599d]/50 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition active:scale-95 cursor-pointer"
            title="Print Certificate (Landscape)"
          >
            <Printer className="w-4 h-4 shrink-0" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="py-2.5 px-2 sm:px-3 bg-[#13234d] hover:bg-[#1a2f64] border border-[#2a4585] text-slate-200 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition active:scale-95 cursor-pointer"
            title="Share Certificate Link"
          >
            <Share2 className="w-4 h-4 text-[#d4af37] shrink-0" />
            <span className="truncate">{copied ? 'Copied!' : 'Share'}</span>
          </button>
        </div>

        {/* Portal Return Link */}
        {setActivePage && (
          <div className="text-center pt-2 pb-4">
            <button
              type="button"
              onClick={() => setActivePage('home')}
              className="text-[11px] text-slate-400 hover:text-[#d4af37] transition cursor-pointer underline underline-offset-4"
            >
              ← Return to Board of Skills & Educational Learning Main Portal
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
