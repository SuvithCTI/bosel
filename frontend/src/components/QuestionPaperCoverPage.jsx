import React, { useRef, useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import bselLogo from '../assets/bsel_logo.png';
import centerSeal from '../assets/cert_center_gold_emblem.png';
import risingStarsSeal from '../assets/rising-stars-seal.png';
import msmeLogo from '../assets/msme-logo.png';
import iafLogo from '../assets/iaf-logo.png';
import isoLogo from '../assets/iso-9001-logo.png';
import {
  getStudentPhotoUrl,
  getStudentRegisterNumber,
  generateCertificateNo,
  getCourseSubjectTitle,
  getStudentScopeKey,
  readStudentCustomSignature,
  saveStudentCustomSignature,
  readStudentCustomHeader,
  saveStudentCustomHeader,
} from '../utils/studentDataHelpers';

// Official Board Seal & Authorized Signature from user uploaded artifact
const officialSealSignSrc = '/@fs/C:/Users/MANIMEGALAI/.gemini/antigravity/brain/7f8cf84b-c588-4933-90a4-412508568aab/.user_uploaded/media_1795088488947_c7047164.jpg';

const DETAIL_ROWS = [
  { field: 'regNo', label: 'Registration No.' },
  { field: 'certNo', label: 'Certificate No.' },
  { field: 'studentName', label: 'Student Name' },
  { field: 'parentName', label: 'Parent / Guardian' },
  { field: 'dob', label: 'Date of Birth / Age' },
  { field: 'genderClass', label: 'Gender & Class' },
  { field: 'courseLevel', label: 'Course & Level' },
  { field: 'duration', label: 'Duration' },
  { field: 'school', label: 'School / Exam Centre' },
  { field: 'phone', label: 'Contact Number' },
];

// Clean, professional typography for numbers, registration details, codes and tables
const NUMBER_FONT_STYLE = {
  fontFamily: "Arial, 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
  fontVariantNumeric: 'tabular-nums lining-nums',
  letterSpacing: '0.015em',
};

export default function QuestionPaperCoverPage({
  student,
  details = {},
  editMode = false,
  onDetailChange = () => {},
}) {
  const photoUrl = student ? getStudentPhotoUrl(student) : (details.photoUrl || null);
  const paperType = details.paperType || details.category || 'A';

  // Manual Principal / Center Director Signature state & scoping
  const signInputRef = useRef(null);
  const branchLogoInputRef = useRef(null);
  const scopeKey = getStudentScopeKey(student || details.student || details);

  const [directorSign, setDirectorSign] = useState(() => {
    return details.directorSign || readStudentCustomSignature(scopeKey) || null;
  });

  const [customBranchLogo, setCustomBranchLogo] = useState(() => {
    return details.branchLogo || readStudentCustomHeader(scopeKey)?.logo || null;
  });

  useEffect(() => {
    const saved = details.directorSign || readStudentCustomSignature(scopeKey);
    setDirectorSign(saved || null);
  }, [scopeKey, details.directorSign]);

  useEffect(() => {
    const savedLogo = details.branchLogo || readStudentCustomHeader(scopeKey)?.logo;
    setCustomBranchLogo(savedLogo || null);
  }, [scopeKey, details.branchLogo]);

  useEffect(() => {
    const handleSignUpdate = (e) => {
      if (e.detail?.scopeKey === scopeKey) {
        setDirectorSign(e.detail.signature || null);
      }
    };
    const handleHeaderUpdate = (e) => {
      if (e.detail?.scopeKey === scopeKey) {
        if (e.detail?.data?.logo !== undefined) {
          setCustomBranchLogo(e.detail.data.logo || null);
        }
      }
    };
    window.addEventListener('bsel_student_custom_signature_updated', handleSignUpdate);
    window.addEventListener('bsel_student_custom_header_updated', handleHeaderUpdate);
    return () => {
      window.removeEventListener('bsel_student_custom_signature_updated', handleSignUpdate);
      window.removeEventListener('bsel_student_custom_header_updated', handleHeaderUpdate);
    };
  }, [scopeKey]);

  const handleSignUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please choose an image file (PNG, JPG, etc.) for the Principal Signature.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        setDirectorSign(dataUrl);
        saveStudentCustomSignature(scopeKey, dataUrl);
        onDetailChange('directorSign', dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveSign = (e) => {
    e.stopPropagation();
    setDirectorSign(null);
    saveStudentCustomSignature(scopeKey, null);
    onDetailChange('directorSign', null);
    if (signInputRef.current) {
      signInputRef.current.value = '';
    }
  };

  const handleBranchLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please choose an image file (PNG, JPG, SVG, etc.) for the branch logo.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        setCustomBranchLogo(dataUrl);
        const prevHeader = readStudentCustomHeader(scopeKey) || {};
        saveStudentCustomHeader(scopeKey, { ...prevHeader, logo: dataUrl });
        onDetailChange('branchLogo', dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBranchLogo = (e) => {
    e.stopPropagation();
    setCustomBranchLogo(null);
    const prevHeader = readStudentCustomHeader(scopeKey) || {};
    saveStudentCustomHeader(scopeKey, { ...prevHeader, logo: null });
    onDetailChange('branchLogo', null);
    if (branchLogoInputRef.current) {
      branchLogoInputRef.current.value = '';
    }
  };

  // 1. Course & Level from details or student admission
  const courseDisplay =
    details.course ||
    student?.program ||
    student?.courseName ||
    student?.course ||
    'ABACUS SPEED ARITHMETIC';

  const levelDisplay =
    details.level ||
    student?.grade ||
    student?.courseLevel ||
    student?.level ||
    'LEVEL 1';

  const courseLevelDisplay = `${courseDisplay} - ${levelDisplay}`;

  // 2. Admission / Registration Number
  const regNoDisplay =
    details.regNo ||
    (student ? getStudentRegisterNumber(student) : null) ||
    student?.registrationNo ||
    student?.registerNumber ||
    student?.admissionNo ||
    'AB26-004, HW22-001';

  // 3. Certificate Number (real student cert or dynamically generated)
  const certNoDisplay =
    details.certNo ||
    student?.certificateNo ||
    (student ? generateCertificateNo(student, courseDisplay, levelDisplay) : null) ||
    'BSEL/AB/11/0001';

  // 4. Student Name
  const studentNameDisplay =
    details.studentName ||
    student?.studentName ||
    student?.name ||
    'DEMO 1326';

  // 5. Parent / Guardian Name (Father or Mother)
  const parentNameDisplay =
    details.parentName ||
    student?.parentName ||
    student?.fatherName ||
    student?.motherName ||
    'Father';

  // 6. Date of Birth & Age
  const rawDob = details.dob || student?.dob || student?.dateOfBirth || '2016-11-13';
  const ageDisplay = details.age || student?.age || '';
  const dobDisplay = rawDob;
  const dobAgeDisplay = ageDisplay ? `${dobDisplay} (Age: ${ageDisplay} Yrs)` : dobDisplay;

  // 7. Gender & Class
  const genderDisplay = details.gender || student?.gender || 'Male';
  const classDisplay = details.studentClass || student?.studentClass || student?.grade || student?.classGrade || '';
  const stageDisplay = details.studentStage || student?.studentStage || '';
  const genderClassDisplay = classDisplay
    ? `${genderDisplay} | ${classDisplay}${stageDisplay ? ` (${stageDisplay})` : ''}`
    : genderDisplay;

  // 8. Duration
  const durationDisplay =
    details.duration ||
    student?.duration ||
    student?.courseDuration ||
    '6 Months';

  // 9. School / Exam Centre
  const schoolDisplay =
    details.school ||
    details.branch ||
    student?.branch ||
    student?.school ||
    student?.institution ||
    'Tenkasi';

  // 10. Contact Number
  const phoneDisplay = details.phone || student?.phone || student?.mobile || '';

  // Branch Name, Subtitle, Tagline and Logo for right header
  const branchNameDisplay =
    details.branchName ||
    (student?.branch ? student.branch.replace(/\s+Branch$/i, '').toUpperCase() : 'RISING STARS');
  const branchSubtitleDisplay = details.branchSubtitle || 'VISION FOUNDATION';
  const branchTaglineDisplay = details.branchTagline || 'EDUCATION • EMPOWERMENT • EXCEL';
  const branchLogoDisplay = customBranchLogo || details.branchLogo || risingStarsSeal;
  const hasCustomBranchLogo = Boolean(customBranchLogo || details.branchLogo);

  // Section 3: MindSparc, Subject Title & Ribbon Banner (Dynamically matched to course & editable)
  const programBrandDisplay = details.programBrand || 'BSEL MindSparc™';
  const subjectTitleDisplay = details.subjectTitle || getCourseSubjectTitle(courseDisplay);
  const ribbonTitleDisplay = details.ribbonTitle || 'TEST BOOKLET';

  const handleCategoryCycle = () => {
    const list = ['A', 'B', 'C', 'D', 'E'];
    const currIdx = list.indexOf(paperType);
    const nextType = list[(currIdx + 1) % list.length];
    onDetailChange('paperType', nextType);
  };

  const renderFieldValue = (field) => {
    if (field === 'courseLevel') {
      if (editMode) {
        return (
          <div className="flex items-center gap-1 w-full" style={NUMBER_FONT_STYLE}>
            <input
              type="text"
              value={details.course ?? courseDisplay}
              onChange={(e) => onDetailChange('course', e.target.value)}
              className="w-2/3 border-b border-sky-400 bg-sky-50 px-1 py-0.5 text-[11px] sm:text-[12px] font-bold text-slate-900 outline-none"
              style={NUMBER_FONT_STYLE}
              placeholder="Course"
            />
            <span>-</span>
            <input
              type="text"
              value={details.level ?? levelDisplay}
              onChange={(e) => onDetailChange('level', e.target.value)}
              className="w-1/3 border-b border-sky-400 bg-sky-50 px-1 py-0.5 text-[11px] sm:text-[12px] font-bold text-slate-900 outline-none"
              style={NUMBER_FONT_STYLE}
              placeholder="Level"
            />
          </div>
        );
      }
      return <span className="font-bold text-slate-950 tracking-normal font-sans" style={NUMBER_FONT_STYLE}>{courseLevelDisplay}</span>;
    }

    if (field === 'dob') {
      if (editMode) {
        return (
          <div className="flex items-center gap-1 w-full" style={NUMBER_FONT_STYLE}>
            <input
              type="text"
              value={details.dob ?? dobDisplay}
              onChange={(e) => onDetailChange('dob', e.target.value)}
              className="w-2/3 border-b border-sky-400 bg-sky-50 px-1 py-0.5 text-[11px] sm:text-[12px] font-bold text-slate-900 outline-none"
              style={NUMBER_FONT_STYLE}
              placeholder="YYYY-MM-DD"
            />
            <span>Age:</span>
            <input
              type="text"
              value={details.age ?? ageDisplay}
              onChange={(e) => onDetailChange('age', e.target.value)}
              className="w-1/3 border-b border-sky-400 bg-sky-50 px-1 py-0.5 text-[11px] sm:text-[12px] font-bold text-slate-900 outline-none"
              style={NUMBER_FONT_STYLE}
              placeholder="Age"
            />
          </div>
        );
      }
      return <span className="font-bold text-slate-950 tracking-normal font-sans" style={NUMBER_FONT_STYLE}>{dobAgeDisplay}</span>;
    }

    if (field === 'genderClass') {
      if (editMode) {
        return (
          <div className="flex items-center gap-1 w-full" style={NUMBER_FONT_STYLE}>
            <input
              type="text"
              value={details.gender ?? genderDisplay}
              onChange={(e) => onDetailChange('gender', e.target.value)}
              className="w-1/3 border-b border-sky-400 bg-sky-50 px-1 py-0.5 text-[11px] sm:text-[12px] font-bold text-slate-900 outline-none"
              style={NUMBER_FONT_STYLE}
              placeholder="Gender"
            />
            <span>|</span>
            <input
              type="text"
              value={details.studentClass ?? classDisplay}
              onChange={(e) => onDetailChange('studentClass', e.target.value)}
              className="w-2/3 border-b border-sky-400 bg-sky-50 px-1 py-0.5 text-[11px] sm:text-[12px] font-bold text-slate-900 outline-none"
              style={NUMBER_FONT_STYLE}
              placeholder="Class / Grade (Stage)"
            />
          </div>
        );
      }
      return <span className="font-bold text-slate-950 tracking-normal font-sans" style={NUMBER_FONT_STYLE}>{genderClassDisplay}</span>;
    }

    const fieldMap = {
      regNo: regNoDisplay,
      certNo: certNoDisplay,
      studentName: studentNameDisplay,
      parentName: parentNameDisplay,
      duration: durationDisplay,
      school: schoolDisplay,
      phone: phoneDisplay,
    };

    if (editMode) {
      return (
        <input
          type="text"
          value={details[field] ?? fieldMap[field] ?? ''}
          onChange={(e) => onDetailChange(field, e.target.value)}
          className="w-full border-b border-sky-400 bg-sky-50 px-1 py-0.5 text-[11px] sm:text-[12px] font-bold text-slate-900 outline-none"
          style={NUMBER_FONT_STYLE}
        />
      );
    }

    return (
      <span className="font-bold text-slate-950 tracking-normal font-sans" style={NUMBER_FONT_STYLE}>
        {fieldMap[field]}
      </span>
    );
  };

  return (
    <div
      className="relative mx-auto w-[724px] max-w-[724px] bg-white text-slate-950 shadow-2xl p-4 sm:p-5 box-border select-text font-serif shrink-0"
      style={{
        minHeight: '1024px',
        fontFamily: "'Times New Roman', Times, Georgia, serif",
        touchAction: 'pan-y'
      }}
    >
      {/* Outer Double Frame: Dark Blue Border with Corner Rectangles */}
      <div className="relative w-full h-full border-[2.5px] border-[#0c2d58] p-1 box-border">
        <div className="relative w-full h-full border border-[#0c2d58] p-3 flex flex-col justify-between box-border">

          {/* Decorative Gold Corner Brackets matching the reference sheet */}
          <div className="absolute top-1 left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-[#b8892f] pointer-events-none" />
          <div className="absolute top-1 right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-[#b8892f] pointer-events-none" />
          <div className="absolute bottom-1 left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-[#b8892f] pointer-events-none" />
          <div className="absolute bottom-1 right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-[#b8892f] pointer-events-none" />

          {/* =========================================================================
              1. TOP HEADER: BSEL (LEFT) | CENTER GOLD SEAL | BRANCH & LOGO (RIGHT)
              ========================================================================= */}
          <div className="grid grid-cols-[1fr_80px_1fr] items-center gap-2 pb-2.5 border-b border-[#0c2d58] min-h-[96px] w-full">
            {/* Left Corner: BSEL Logo, Name & Tagline */}
            <div className="min-w-0 flex items-center justify-start gap-2 sm:gap-2.5">
              <img
                src={bselLogo}
                alt="B★SEL Official Crest Logo"
                className="w-16 h-18 sm:w-18 sm:h-20 object-contain shrink-0 drop-shadow-xs"
              />
              <div className="min-w-0 leading-tight flex flex-col items-center text-center justify-center">
                {/* 1st line: B★SEL (Center Aligned, Enlarged) */}
                <div className="flex items-center justify-center gap-1 mb-0.5 w-full">
                  <span className="text-3xl sm:text-4xl font-black text-[#0c2d58] tracking-wider leading-none font-sans text-center">
                    B<span className="text-amber-500 font-sans">★</span>SEL
                  </span>
                </div>
                {/* 2nd line: LEARN ★ GROW ★ ACHIEVE (Enlarged) */}
                <p className="text-[10px] sm:text-[11px] font-bold text-amber-600 tracking-widest uppercase whitespace-nowrap text-center">
                  LEARN <span className="text-amber-500">★</span> GROW <span className="text-amber-500">★</span> ACHIEVE
                </p>
                {/* 3rd line: BOARD OF SKILLS AND EDUCATIONAL LEARNING (Enlarged) */}
                <p className="text-[9px] sm:text-[10px] font-black text-slate-900 uppercase tracking-tight whitespace-nowrap mt-0.5 text-center leading-tight">
                  BOARD OF SKILLS AND EDUCATIONAL LEARNING
                </p>
              </div>
            </div>

            {/* Center: Gold Lion Crest Seal - Dedicated Centered Column (No Overlap) */}
            <div className="w-[80px] shrink-0 flex items-center justify-center">
              <img
                src={centerSeal}
                alt="Official Gold Emblem"
                className="w-15 h-15 sm:w-17 sm:h-17 object-contain drop-shadow-xs"
              />
            </div>

            {/* Right Side: Branch Name, Tagline & Respective Logo */}
            <div className="min-w-0 flex items-center justify-end gap-2 sm:gap-2.5">
              {/* Hidden file input for manual branch logo upload */}
              <input
                ref={branchLogoInputRef}
                type="file"
                accept="image/*"
                onChange={handleBranchLogoUpload}
                className="hidden"
              />

              {editMode ? (
                <div className="flex flex-col items-center gap-0.5 min-w-0 text-center">
                  <input
                    type="text"
                    value={details.branchName ?? branchNameDisplay}
                    onChange={(e) => onDetailChange('branchName', e.target.value)}
                    className="text-center border-b border-sky-400 bg-sky-50 px-1 py-0.5 text-base font-black text-[#0c2d58] outline-none max-w-[160px]"
                    placeholder="Branch Name"
                  />
                  <input
                    type="text"
                    value={details.branchSubtitle ?? branchSubtitleDisplay}
                    onChange={(e) => onDetailChange('branchSubtitle', e.target.value)}
                    className="text-center border-b border-sky-400 bg-sky-50 px-1 py-0.5 text-[10.5px] font-bold text-[#0c2d58] outline-none max-w-[160px]"
                    placeholder="Subtitle"
                  />
                  <input
                    type="text"
                    value={details.branchTagline ?? branchTaglineDisplay}
                    onChange={(e) => onDetailChange('branchTagline', e.target.value)}
                    className="text-center border-b border-sky-400 bg-sky-50 px-1 py-0.5 text-[9px] font-bold text-slate-600 outline-none max-w-[160px]"
                    placeholder="Tagline"
                  />
                  <button
                    type="button"
                    onClick={() => branchLogoInputRef.current?.click()}
                    className="no-print mt-1 cursor-pointer text-[8px] font-bold text-sky-700 bg-sky-100 hover:bg-sky-200 px-1.5 py-0.5 rounded flex items-center gap-1 transition shadow-2xs"
                    title="Click to manually upload branch logo"
                  >
                    <Upload className="w-2.5 h-2.5" />
                    Change Logo
                  </button>
                </div>
              ) : (
                <div className="min-w-0 leading-tight flex flex-col items-center text-center justify-center">
                  <h2 className="text-lg sm:text-xl font-black text-[#0c2d58] uppercase tracking-wide leading-none font-sans whitespace-nowrap text-center">
                    {branchNameDisplay}
                  </h2>
                  <p className="text-[11px] sm:text-[12px] font-black text-[#0c2d58] uppercase tracking-wider mt-0.5 font-sans whitespace-nowrap text-center">
                    {branchSubtitleDisplay}
                  </p>
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-600 uppercase tracking-tight mt-0.5 font-sans whitespace-nowrap text-center">
                    {branchTaglineDisplay}
                  </p>
                </div>
              )}

              {/* Right Top Corner Logo with manual upload & reset */}
              <div
                className="relative group shrink-0 cursor-pointer"
                onClick={() => branchLogoInputRef.current?.click()}
                title="Click to manually upload / change branch logo"
              >
                <img
                  src={branchLogoDisplay}
                  alt={`${branchNameDisplay} Crest`}
                  className="w-14 h-14 sm:w-16 sm:h-16 object-contain shrink-0 drop-shadow-xs transition-transform group-hover:scale-105"
                />

                {/* Hover / Edit Overlay (Hidden during print) */}
                <div className="no-print absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded">
                  <span className="text-[7.5px] font-bold text-white bg-sky-700/90 px-1 py-0.5 rounded shadow-2xs flex items-center gap-0.5 pointer-events-none">
                    <Upload className="w-2.5 h-2.5" />
                    Upload
                  </span>
                </div>

                {/* Reset / Clear button if a custom logo was uploaded */}
                {hasCustomBranchLogo && (
                  <button
                    type="button"
                    onClick={handleRemoveBranchLogo}
                    className="no-print absolute -top-1.5 -right-1.5 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-xs cursor-pointer z-10"
                    title="Reset to default logo"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* =========================================================================
              2. NAVY BANNER 1: LEVEL EXAMINATION - TEST BOOKLET (TEXT LENGTH BACKGROUND)
              ========================================================================= */}
          <div className="mt-2 flex justify-center w-full">
            <div
              className="py-1 px-5 text-center rounded-2xs shadow-xs"
              style={{ backgroundColor: '#0c2d58', color: '#ffffff' }}
            >
              <span
                className="text-xs sm:text-[13px] font-black uppercase tracking-[0.16em] font-sans !text-white whitespace-nowrap block"
                style={{ color: '#ffffff' }}
              >
                LEVEL EXAMINATION - TEST BOOKLET
              </span>
            </div>
          </div>

          {/* =========================================================================
              3. MINDSPARC ABACUS & CATEGORY BADGE ROW (EDITABLE & PIXEL-MATCHED)
              ========================================================================= */}
          <div className="relative py-2 flex items-center justify-between border-b border-slate-300 min-h-[82px]">
            {/* Left spacer matching right badges width so title is perfectly centered */}
            <div className="w-[116px] shrink-0" />

            {/* Center: Title + Ribbon (Editable) */}
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              {editMode ? (
                <input
                  type="text"
                  value={details.programBrand ?? programBrandDisplay}
                  onChange={(e) => onDetailChange('programBrand', e.target.value)}
                  className="border-b border-sky-400 bg-sky-50 px-2 py-0.5 text-center text-xs font-semibold text-slate-800 outline-none max-w-[170px]"
                  placeholder="Program Brand"
                />
              ) : (
                <span className="text-[11px] sm:text-xs font-semibold text-slate-700 font-sans tracking-wide">
                  {programBrandDisplay}
                </span>
              )}

              {/* Main Course Title with Gold Arched Highlights */}
              <div className="relative my-0.5">
                {editMode ? (
                  <input
                    type="text"
                    value={details.subjectTitle ?? subjectTitleDisplay}
                    onChange={(e) => onDetailChange('subjectTitle', e.target.value)}
                    className="border-b border-sky-400 bg-sky-50 px-2 py-0.5 text-center text-2xl sm:text-3xl font-black text-[#0c2d58] outline-none max-w-[220px]"
                    placeholder="Subject Title"
                  />
                ) : (
                  <div className="relative">
                    {/* Top gold curved arc highlight */}
                    <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-4/5 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                    <span className="text-2xl sm:text-3xl font-black text-[#0c2d58] tracking-wider leading-none font-sans block px-2">
                      {subjectTitleDisplay}
                    </span>
                    {/* Bottom gold curved arc highlight */}
                    <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4/5 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                  </div>
                )}
              </div>

              {/* Swallowtail Ribbon Banner matching reference image */}
              <div
                className="relative mt-1 text-[10px] sm:text-[10.5px] font-black uppercase tracking-widest px-8 py-0.5 shadow-xs font-sans !text-white"
                style={{
                  clipPath: 'polygon(0% 0%, 100% 0%, calc(100% - 7px) 50%, 100% 100%, 0% 100%, 7px 50%)',
                  backgroundColor: '#0c2d58',
                  color: '#ffffff',
                }}
              >
                {editMode ? (
                  <input
                    type="text"
                    value={details.ribbonTitle ?? ribbonTitleDisplay}
                    onChange={(e) => onDetailChange('ribbonTitle', e.target.value)}
                    className="bg-transparent border-b border-white text-center text-[10px] sm:text-[10.5px] font-black uppercase text-white outline-none max-w-[130px] !text-white"
                    style={{ color: '#ffffff' }}
                    placeholder="Ribbon Label"
                  />
                ) : (
                  <span>{ribbonTitleDisplay}</span>
                )}
              </div>
            </div>

            {/* Right badges: Square "TEST BOOKLET" with CATEGORY label + Tall Category "A" Card */}
            <div className="flex items-center gap-2.5 shrink-0 pr-1 w-[116px] justify-end">
              {/* Square Box with Circular Navy TEST BOOKLET + CATEGORY label below */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-11 h-11 sm:w-12 sm:h-12 border border-[#0c2d58] bg-white rounded-2xs flex items-center justify-center p-0.5 shadow-2xs">
                  <div
                    className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-full flex flex-col items-center justify-center text-center p-0.5 leading-none font-sans shrink-0 !text-white"
                    style={{ backgroundColor: '#0c2d58', color: '#ffffff' }}
                  >
                    <span className="text-[7px] sm:text-[7.5px] font-black tracking-wider uppercase !text-white" style={{ color: '#ffffff' }}>TEST</span>
                    <span className="text-[6px] sm:text-[6.5px] font-black tracking-wider uppercase mt-0.5 !text-white" style={{ color: '#ffffff' }}>BOOKLET</span>
                  </div>
                </div>
                <span className="text-[7.5px] sm:text-[8px] font-black uppercase tracking-wider text-[#0c2d58] mt-0.5 font-sans">
                  CATEGORY
                </span>
              </div>

              {/* Tall Double-Bordered Category Card with Blue Circle (Clickable & Editable) */}
              <div className="flex flex-col items-center shrink-0">
                <div
                  onClick={handleCategoryCycle}
                  className="w-12 h-15 sm:w-13 sm:h-16 border border-[#0c2d58] bg-white p-0.5 flex items-center justify-center shrink-0 shadow-xs cursor-pointer group hover:border-amber-500 transition rounded-2xs"
                  title="Click to cycle Category (A, B, C, D, E)"
                >
                  <div className="w-full h-full border border-[#c59b27] bg-[#fbfbfb] flex items-center justify-center p-1">
                    <div className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-full bg-[#0284c7] text-white flex items-center justify-center font-sans font-black text-lg sm:text-xl shadow-inner group-hover:scale-105 transition-transform select-none">
                      {paperType}
                    </div>
                  </div>
                </div>
                {editMode && (
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {['A', 'B', 'C', 'D', 'E'].map((typeOption) => (
                      <button
                        key={typeOption}
                        type="button"
                        onClick={() => onDetailChange('paperType', typeOption)}
                        className={`text-[7px] font-black px-0.5 rounded cursor-pointer ${
                          paperType === typeOption
                            ? 'bg-[#0c2d58] text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {typeOption}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* =========================================================================
              4. NAVY BANNER 2: STUDENT & EXAM DETAILS (TEXT LENGTH BACKGROUND)
              ========================================================================= */}
          <div className="mt-2 flex justify-center w-full">
            <div
              className="py-1 px-5 text-center rounded-2xs shadow-xs"
              style={{ backgroundColor: '#0c2d58', color: '#ffffff' }}
            >
              <span
                className="text-xs sm:text-[12.5px] font-black uppercase tracking-[0.16em] font-sans !text-white whitespace-nowrap block"
                style={{ color: '#ffffff' }}
              >
                STUDENT &amp; EXAM DETAILS
              </span>
            </div>
          </div>

          {/* =========================================================================
              5. STUDENT DETAILS 2-COLUMN GRID + PHOTO
              ========================================================================= */}
          <div className="mt-2 flex items-start justify-between gap-3 px-1 py-1">
            {/* Left: 10 Admission Data Rows */}
            <div className="flex-1 space-y-1 sm:space-y-1.5 text-xs sm:text-[12px] font-sans" style={NUMBER_FONT_STYLE}>
              {DETAIL_ROWS.map(({ field, label }) => (
                <div key={field} className="grid grid-cols-[165px_12px_1fr] items-center">
                  <span className="font-bold text-slate-900" style={NUMBER_FONT_STYLE}>{label}</span>
                  <span className="font-bold text-slate-900 text-center">:</span>
                  <div className="min-w-0 pr-1">
                    {renderFieldValue(field)}
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Passport Photo Box with Gold Border & Light Sky Fill */}
            <div className="w-28 h-36 sm:w-32 sm:h-40 border border-[#0c2d58] bg-[#d9effc] p-1 flex items-center justify-center shrink-0 shadow-md rounded-xs">
              <div className="w-full h-full border border-[#c59b27] bg-[#eaf5fc] flex items-center justify-center overflow-hidden">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={studentNameDisplay}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-2 text-sky-800">
                    <svg className="w-9 h-9 text-sky-600 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-[8px] font-bold uppercase tracking-wider leading-tight">
                      Student Photo
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* =========================================================================
              6. NAVY BANNER 3: ASSESSMENT & EVALUATION
              ========================================================================= */}
          <div
            className="mt-2 py-1 px-3 text-center rounded-2xs shadow-xs"
            style={{ backgroundColor: '#0c2d58', color: '#ffffff' }}
          >
            <div
              className="text-xs sm:text-[12.5px] font-black uppercase tracking-[0.16em] font-sans !text-white"
              style={{ color: '#ffffff' }}
            >
              ASSESSMENT &amp; EVALUATION
            </div>
          </div>

          {/* =========================================================================
              7. ASSESSMENT & EVALUATION TABLE (NAVY HEADER, 5 ROWS + SUMMARY ROW)
              ========================================================================= */}
          <div className="mt-1 border border-[#0c2d58] overflow-hidden text-xs">
            <table className="w-full border-collapse text-center">
              <thead>
                <tr
                  className="font-bold text-[11px] sm:text-xs font-sans"
                  style={{ backgroundColor: '#0c2d58', color: '#ffffff' }}
                >
                  <th className="border-r border-white/40 py-1.5 px-1.5 w-[8%] !text-white" style={{ color: '#ffffff' }}>S.No.</th>
                  <th className="border-r border-white/40 py-1.5 px-2 text-center w-[44%] !text-white" style={{ color: '#ffffff' }}>Subject/Module</th>
                  <th className="border-r border-white/40 py-1.5 px-2 w-[16%] !text-white" style={{ color: '#ffffff' }}>Max Marks</th>
                  <th className="border-r border-white/40 py-1.5 px-2 w-[16%] !text-white" style={{ color: '#ffffff' }}>Marks Obtained</th>
                  <th className="py-1.5 px-2 w-[16%] !text-white" style={{ color: '#ffffff' }}>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((rowNum) => (
                  <tr key={rowNum} className="border-b border-[#0c2d58] h-6 sm:h-7 text-[11px]">
                    <td className="border-r border-[#0c2d58] font-bold text-slate-900 bg-white" style={NUMBER_FONT_STYLE}>
                      {rowNum}
                    </td>
                    <td className="border-r border-[#0c2d58] px-2 text-left bg-white"></td>
                    <td className="border-r border-[#0c2d58] px-1 bg-white"></td>
                    <td className="border-r border-[#0c2d58] px-1 bg-white"></td>
                    <td className="px-1 bg-white"></td>
                  </tr>
                ))}
                {/* Total Marks & Summary Row */}
                <tr className="bg-white font-bold text-slate-950 text-[11px] sm:text-xs border-t-2 border-[#0c2d58] h-6 sm:h-7">
                  <td colSpan={2} className="border-r border-[#0c2d58] px-3 text-right font-black uppercase tracking-wider font-sans">
                    TOTAL MARKS
                  </td>
                  <td className="border-r border-[#0c2d58] px-2 bg-white"></td>
                  <td className="border-r border-[#0c2d58] px-2 font-black uppercase tracking-wider font-sans bg-white">
                    PERCENTAGE
                  </td>
                  <td className="px-2 font-black uppercase tracking-wider font-sans bg-white">
                    GRADE
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* =========================================================================
              8. REMARKS & GENERAL INSTRUCTIONS (SIDE-BY-SIDE)
              ========================================================================= */}
          <div className="mt-2 grid grid-cols-[28%_1fr] gap-2 items-stretch">
            {/* Left: Remarks Box */}
            <div className="border border-[#0c2d58] flex flex-col justify-between rounded-xs overflow-hidden">
              <div
                className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-center font-sans !text-white"
                style={{ backgroundColor: '#0c2d58', color: '#ffffff' }}
              >
                REMARKS
              </div>
              <div className="flex-1 min-h-[50px] p-2 flex items-center justify-center">
                {/* Blank space for evaluator marks */}
              </div>
              <div className="p-1 text-center border-t border-slate-200 bg-white">
                <span className="text-[8px] font-bold text-[#a83232] italic font-serif">
                  (Results not officially certified)
                </span>
              </div>
            </div>

            {/* Right: Gen. Instructions Box */}
            <div className="border border-[#0c2d58] p-2 rounded-xs flex flex-col justify-between bg-white">
              <div>
                <h3 className="text-[10px] sm:text-[10.5px] font-black text-[#0c2d58] uppercase tracking-wide border-b border-slate-200 pb-0.5 font-sans">
                  GEN. INSTRUCTIONS
                </h3>
                <ol className="list-decimal list-inside text-[8.5px] sm:text-[9.5px] text-slate-800 font-medium space-y-0.5 mt-1 leading-snug" style={NUMBER_FONT_STYLE}>
                  <li>Rule points must be observed strictly during several exam sections.</li>
                  <li>Answers must be written clearly on the provided paper.</li>
                  <li>Do not overwrite or make double markings on test sums.</li>
                  <li>Complete each section within the allotted 10 minutes duration.</li>
                  <li>Submit this question paper and booklet back to the invigilator before leaving hall.</li>
                </ol>
              </div>
              <div className="mt-1 pt-1 border-t border-slate-200 text-center">
                <p className="text-[7.5px] font-black text-slate-800 tracking-wider uppercase font-sans">
                  REGISTERED UNDER MINISTRY OF MSME, GOVT. OF INDIA
                </p>
              </div>
            </div>
          </div>

          {/* =========================================================================
              9. FOOTER: SEALS, REGISTRATION ACCREDITATIONS & SIGNATURES
              ========================================================================= */}
          <div className="mt-2 pt-2 border-t border-slate-300 flex items-end justify-between text-xs px-1">
            {/* Left: Center Director / Principal with manual signature upload */}
            <div className="flex flex-col items-center text-center w-[30%]">
              <input
                ref={signInputRef}
                type="file"
                accept="image/*"
                onChange={handleSignUpload}
                className="hidden"
              />

              <div className="h-16 sm:h-20 w-full flex items-end justify-center mb-1 relative group">
                {directorSign ? (
                  <div className="relative flex items-end justify-center h-full w-full">
                    <img
                      src={directorSign}
                      alt="Center Director / Principal Signature"
                      className="max-h-full max-w-[150px] sm:max-w-[170px] object-contain object-bottom select-none mix-blend-multiply drop-shadow-xs"
                    />
                    {/* Hover controls in browser preview to replace or delete */}
                    <div className="no-print absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white/95 border border-slate-300 rounded-md shadow-xs p-0.5">
                      <button
                        type="button"
                        onClick={() => signInputRef.current?.click()}
                        className="p-1 hover:bg-sky-50 text-sky-700 rounded transition cursor-pointer"
                        title="Change Principal Signature"
                      >
                        <Upload className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveSign}
                        className="p-1 hover:bg-rose-50 text-rose-700 rounded transition cursor-pointer"
                        title="Remove Signature"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => signInputRef.current?.click()}
                    className="no-print cursor-pointer border border-dashed border-sky-400 bg-sky-50/80 hover:bg-sky-100 text-sky-800 rounded px-2.5 py-1.5 flex flex-col items-center justify-center gap-0.5 transition shadow-2xs group"
                    title="Click to manually upload Center Director / Principal Signature image"
                  >
                    <Upload className="w-3.5 h-3.5 text-sky-600 group-hover:scale-110 transition-transform" />
                    <span className="text-[8px] sm:text-[8.5px] font-black uppercase tracking-wider">
                      Upload Sign
                    </span>
                  </button>
                )}
              </div>

              <div className="w-full border-b border-slate-700 pb-0.5 mb-1" />
              <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-900 leading-tight">
                Center Director / Principal
              </span>
            </div>

            {/* Center: MSME, IAF, ISO Logos + Tamil Nadu Trust Accreditation */}
            <div className="flex flex-col items-center justify-center text-center w-[34%] pb-0.5">
              <div className="flex items-center justify-center gap-2 mb-1">
                <img src={msmeLogo} alt="MSME" className="h-5 sm:h-6 object-contain" />
                <img src={iafLogo} alt="IAF" className="h-6 sm:h-7 object-contain" />
                <img src={isoLogo} alt="ISO 9001" className="h-6 sm:h-7 object-contain" />
              </div>
              <p className="text-[7.5px] sm:text-[8px] font-black uppercase tracking-tight text-[#0c2d58] font-sans">
                REGISTERED UNDER GOVT. OF TAMIL NADU (REGS. TRUST)
              </p>
            </div>

            {/* Right: Official Board Seal & Authorized Signature (Enlarged) */}
            <div className="flex flex-col items-center text-center w-[38%]">
              <div className="h-20 sm:h-24 w-full flex items-end justify-center mb-1">
                <img
                  src="/bsel_authorized_seal_signature.jpg"
                  alt="Board of Skills and Educational Learning Official Seal & Authorized Signature"
                  className="max-h-full max-w-[220px] sm:max-w-[250px] object-contain object-bottom select-none mix-blend-multiply drop-shadow-xs"
                  onError={(e) => {
                    e.currentTarget.src = officialSealSignSrc;
                  }}
                />
              </div>
              <div className="w-full border-b border-slate-700 pb-0.5 mb-1" />
              <span className="text-[10px] sm:text-[10.5px] font-black text-slate-900 uppercase tracking-wide font-sans leading-tight">
                AUTHORIZED SIGNATURE
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
