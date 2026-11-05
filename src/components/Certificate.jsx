import React, { useRef, useState } from 'react';
import { Upload, Download, Loader2 } from 'lucide-react';
import { exportPdfFromElement } from '../utils/pdfExport';
import { getCoursePrefix } from '../utils/authStorage';
import certificateTemplate from '../assets/certificate_official_template.jpg';

export default function Certificate({
  studentName = '',
  courseName = 'Abacus',
  programPrefix = 'MindSparc',
  level = 'Level 1',
  grade = 'B',
  duration = '6 Months',
  registrationNo = 'AB27-001',
  certificateNo = 'BSEL/ABACUS/L1/0007',
  centreName = 'Central Branch',
  centreCode = '546454',
  centreAddress = 'Tenkasi, Tamil Nadu',
  issueDate = '05-10-2026',
  studentPhoto = null,
  certificateType = 'COMPLETION',
  onPhotoUpload = null,
  showControls = true,
  showUploadPhoto = false,
  className = ''
}) {
  const certificateRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const displayCourseUpper = (courseName || 'ABACUS').toUpperCase();

  // Clean Level & Grade formatting (stripping stray colons, and excluding admission statuses like ADMITTED)
  const rawLevel = (level || 'Level 1').trim();
  const cleanLevel = rawLevel.replace(/^[:\s-]+/, '').trim();
  const formattedLevel = cleanLevel.toUpperCase();

  const rawGrade = (grade || '').trim();
  const cleanGrade = rawGrade.replace(/^[:\s-]+/, '').trim().toUpperCase();
  const isExcludedGrade = !cleanGrade || 
    cleanGrade === 'ADMITTED' || 
    cleanGrade === 'GRADE ADMITTED' || 
    cleanGrade.includes('ADMIT') ||
    cleanGrade === 'ENROLLED' ||
    cleanGrade === 'PENDING';

  const formattedGrade = !isExcludedGrade
    ? cleanGrade.startsWith('GRADE')
      ? cleanGrade
      : `GRADE ${cleanGrade}`
    : '';

  // Intelligent Certificate Number calculation matching course prefix and registration
  const coursePrefix = getCoursePrefix(courseName);
  const regDigits = String(registrationNo).replace(/\D/g, '');
  const seqDigits = regDigits ? String(parseInt(regDigits.slice(-3), 10) || 1).padStart(4, '0') : '0001';
  const cleanLvlDigits = cleanLevel.replace(/\D/g, '') || '1';

  let displayCertNo = certificateNo;
  if (!displayCertNo || displayCertNo === 'BSEL/ABACUS/L1/0007' || (coursePrefix !== 'AB' && (displayCertNo.includes('ABACUS') || displayCertNo.includes('BSEL/AB/')))) {
    displayCertNo = `BSEL/${coursePrefix}/L${cleanLvlDigits}/${seqDigits}`;
  }

  // Address formatting helper: formats in Title Case and splits gracefully across rows 3 and 4
  const formatAddress = (addr) => {
    if (!addr) return { line1: 'Tenkasi, Tamil Nadu', line2: '' };
    const cleaned = addr.replace(/,([^\s])/g, ', $1').trim();
    const words = cleaned.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    const titleCased = words.join(' ');
    const parts = titleCased.split(', ');
    if (parts.length >= 2 && titleCased.length > 20) {
      const mid = Math.ceil(parts.length / 2);
      return {
        line1: parts.slice(0, mid).join(', ') + ',',
        line2: parts.slice(mid).join(', ')
      };
    }
    return { line1: titleCased, line2: '' };
  };
  const { line1: addressLine1, line2: addressLine2 } = formatAddress(centreAddress);

  const handleDownloadPdf = async () => {
    if (!certificateRef.current || isDownloadingPdf) return;
    setIsDownloadingPdf(true);
    try {
      const safeStudent = (studentName || 'Candidate').trim().replace(/[^a-zA-Z0-9]/g, '_');
      const safeCourse = (courseName || 'Skill').trim().replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `BSEL_${safeCourse}_Certificate_${safeStudent}.pdf`;

      await exportPdfFromElement(certificateRef.current, {
        filename: fileName,
        orientation: 'landscape',
        margin: 0,
        backgroundColor: '#ffffff',
        scale: 3
      });
    } catch (err) {
      console.error('Direct PDF Generation failed:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onPhotoUpload) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onPhotoUpload(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`flex flex-col items-center certificate-wrapper w-full ${className}`}>
      {/* Top Controls Toolbar */}
      {showControls && (
        <div className="w-full max-w-[1024px] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-3 bg-slate-900/95 text-white p-3 rounded-2xl shadow-xl border border-slate-700 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <div className="text-xs font-semibold text-slate-200 truncate">
              Official B★SEL Certificate: <strong className="text-amber-400 capitalize">{studentName || 'Candidate Name'}</strong> — <span className="text-amber-300 font-bold uppercase">{courseName}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {showUploadPhoto && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 border border-white/20 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-sky-400" />
                  <span>{studentPhoto ? 'Change Photo' : 'Upload Photo'}</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-60 text-white font-black rounded-lg text-xs sm:text-sm transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
            >
              {isDownloadingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Mobile Rotational Tip Badge */}
      <div className="w-full max-w-[1024px] mb-2 px-1 flex items-center justify-between text-[11px] text-slate-600 font-semibold sm:hidden print:hidden">
        <span className="text-slate-700">
          Tip: Rotate phone to landscape for full preview
        </span>
      </div>

      {/* =========================================================================
          OFFICIAL HIGH-RESOLUTION CERTIFICATE CANVAS
          Faithful, pixel-aligned reproduction using the official template background
          ========================================================================= */}
      <div className="w-full max-w-[1024px]">
        <div 
          ref={certificateRef}
          id="printable-certificate"
          className="relative bg-white text-[#0c234b] shadow-2xl select-none certificate-container overflow-hidden rounded-xl sm:rounded-none w-full"
          style={{
            aspectRatio: '1024 / 723',
            boxSizing: 'border-box',
            backgroundImage: `url(${certificateTemplate})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center'
          }}
        >
          {/* 1. STUDENT PHOTO (Placed in Left Frame: x: 4.8%, y: 34.0%, w: 10.2%, h: 16.7%) */}
          <div 
            onClick={() => onPhotoUpload && fileInputRef.current?.click()}
            className={`absolute overflow-hidden flex items-center justify-center bg-[#fbf9f2] ${
              onPhotoUpload ? 'cursor-pointer hover:opacity-95' : ''
            }`}
            style={{
              top: '34.0%',
              left: '4.8%',
              width: '10.2%',
              height: '16.7%'
            }}
            title={onPhotoUpload ? 'Click to upload/change photo' : 'Student Photo'}
          >
            {studentPhoto ? (
              <img 
                src={studentPhoto} 
                alt={studentName || 'Student'} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#faf6ec] to-[#f2e9d2] p-1 select-none relative group text-center">
                <svg viewBox="0 0 100 100" className="w-10 h-10 text-[#c59b27] drop-shadow-2xs">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="#c59b27" strokeWidth="2.5" strokeDasharray="4 2" />
                  <circle cx="50" cy="50" r="39" fill="none" stroke="#081d3d" strokeWidth="1.2" />
                  <circle cx="50" cy="50" r="34" fill="#081d3d" />
                  <path d="M50 24 L53.5 35 L65 35 L55.8 41.8 L59.3 52.8 L50 46 L40.7 52.8 L44.2 41.8 L35 35 L46.5 35 Z" fill="#c59b27" />
                  <path d="M42 58 Q50 63 58 58" stroke="#c59b27" strokeWidth="2" fill="none" />
                </svg>
                <span className="text-[6.5px] sm:text-[7.5px] font-black uppercase tracking-[0.14em] text-[#081d3d] mt-1 font-serif leading-none">
                  B★SEL SEAL
                </span>
                <span className="text-[5px] sm:text-[6px] font-bold uppercase tracking-wider text-[#967228] mt-0.5 leading-none">
                  OFFICIAL
                </span>

                {onPhotoUpload && (
                  <div className="absolute inset-0 bg-[#081d3d]/85 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-1 print:hidden">
                    <Upload className="w-4 h-4 text-amber-400 mb-0.5" />
                    <span className="text-[7px] font-black uppercase tracking-wider text-amber-200">Upload</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2. DYNAMIC CANDIDATE NAME (Resting directly above the underline at y: 41.2% / 298px) */}
          <div 
            className="absolute -translate-x-1/2 -translate-y-full text-center select-none"
            style={{
              top: '40.6%',
              left: '50.0%',
              width: '60%',
              fontFamily: "'Playfair Display', Georgia, serif"
            }}
          >
            <span 
              className="capitalize text-[#081d3d] font-serif font-bold italic block truncate px-2"
              style={{
                fontSize: 'clamp(20px, 3.0vw, 36px)',
                letterSpacing: '0.025em',
                lineHeight: 1.1,
                textShadow: '0 1px 1px rgba(8, 29, 61, 0.08)'
              }}
            >
              {studentName || 'Candidate Name'}
            </span>
          </div>

          {/* 3. DYNAMIC COURSE TITLE (Rendered cleanly without background boxes or prefixes) */}
          <div 
            className="absolute -translate-x-1/2 flex items-center justify-center font-bold tracking-[0.08em] uppercase text-center select-none"
            style={{
              top: '46.0%',
              left: '50.0%',
              maxWidth: '680px',
              width: 'auto',
              fontSize: 'clamp(12px, 1.65vw, 18px)',
              fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif",
              lineHeight: 1.2
            }}
          >
            <span className="text-[#081d3d] font-black tracking-wider">{displayCourseUpper}</span>
          </div>

          {/* 4. LEVEL & GRADE / SPECIALIZATION BADGE (Freed from fixed-width hexagon box) */}
          <div 
            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-center font-black uppercase text-[#081d3d] select-none pointer-events-none"
            style={{
              top: '51.8%',
              left: '50.0%',
              maxWidth: '680px',
              width: 'max-content',
              fontSize: 'clamp(9.5px, 1.35vw, 14px)',
              letterSpacing: '0.09em',
              fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif",
              lineHeight: 1.2
            }}
          >
            <span className="text-[#081d3d] font-black">{formattedLevel}</span>
            {formattedGrade && (
              <>
                <span className="mx-2 text-[#967228] font-black">•</span>
                <span className="text-[#967228] font-black">{formattedGrade}</span>
              </>
            )}
          </div>

          {/* 5. HIGH-CONTRAST VERIFICATION QR CODE (Placed in Right Frame: x: 85.5%, y: 36.8%) */}
          <div 
            className="absolute overflow-hidden p-1 bg-white flex items-center justify-center"
            style={{
              top: '36.8%',
              left: '85.5%',
              width: '7.8%',
              height: '11.0%'
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full text-[#081d3d] fill-current">
              {/* QR Corner Anchor 1: Top-Left */}
              <rect x="5" y="5" width="28" height="28" fill="#081d3d" />
              <rect x="9" y="9" width="20" height="20" fill="#ffffff" />
              <rect x="13" y="13" width="12" height="12" fill="#081d3d" />
              {/* QR Corner Anchor 2: Top-Right */}
              <rect x="67" y="5" width="28" height="28" fill="#081d3d" />
              <rect x="71" y="9" width="20" height="20" fill="#ffffff" />
              <rect x="75" y="13" width="12" height="12" fill="#081d3d" />
              {/* QR Corner Anchor 3: Bottom-Left */}
              <rect x="5" y="67" width="28" height="28" fill="#081d3d" />
              <rect x="9" y="71" width="20" height="20" fill="#ffffff" />
              <rect x="13" y="75" width="12" height="12" fill="#081d3d" />
              {/* Data pixels matrix */}
              <rect x="38" y="8" width="6" height="6" />
              <rect x="48" y="14" width="6" height="6" />
              <rect x="56" y="8" width="6" height="6" />
              <rect x="38" y="24" width="6" height="6" />
              <rect x="48" y="28" width="6" height="6" />
              <rect x="56" y="22" width="6" height="6" />
              <rect x="8" y="38" width="6" height="6" />
              <rect x="18" y="46" width="6" height="6" />
              <rect x="26" y="38" width="6" height="6" />
              <rect x="38" y="38" width="8" height="8" fill="#c59b27" />
              <rect x="48" y="46" width="6" height="6" />
              <rect x="58" y="38" width="6" height="6" />
              <rect x="68" y="46" width="6" height="6" />
              <rect x="78" y="38" width="6" height="6" />
              <rect x="86" y="46" width="6" height="6" />
              <rect x="38" y="58" width="6" height="6" />
              <rect x="48" y="66" width="6" height="6" />
              <rect x="58" y="58" width="6" height="6" />
              <rect x="68" y="66" width="6" height="6" />
              <rect x="78" y="58" width="6" height="6" />
              <rect x="86" y="68" width="6" height="6" />
              <rect x="38" y="78" width="6" height="6" />
              <rect x="48" y="86" width="6" height="6" />
              <rect x="58" y="78" width="6" height="6" />
              <rect x="68" y="86" width="6" height="6" />
              <rect x="78" y="78" width="6" height="6" />
              <rect x="88" y="86" width="6" height="6" />
            </svg>
          </div>

          {/* =========================================================================
              6. DETAILS GRID / TABLE (LEFT & RIGHT COLUMNS)
              Rendered in classic 'Times New Roman' with perfect row-by-row baseline alignment
              Colons: Left x=214px (20.9%), Right x=766px (74.8%)
              Start x: Left 22.6% (gap: 17.4px), Right 76.5% (gap: 17.3px)
              Row Y Centers:
              Row 1: 64.3%, Row 2: 67.3%, Row 3: 70.2%, Row 4: 73.2%, Row 5: 76.2%
              ========================================================================= */}
          
          {/* --- LEFT COLUMN VALUES --- */}
          {/* Row 1: Registration No */}
          <div 
            className="absolute font-bold text-[#081d3d] select-none truncate flex items-center"
            style={{
              top: '64.3%',
              left: '22.6%',
              width: '26.5%',
              maxWidth: '26.5%',
              transform: 'translateY(-50%)',
              fontFamily: "'Times New Roman', Times, serif",
              fontSize: 'clamp(9px, 1.25vw, 13px)',
              letterSpacing: '0.02em',
              lineHeight: 1
            }}
          >
            {registrationNo || 'AB27-001'}
          </div>

          {/* Row 2: Certificate No */}
          <div 
            className="absolute font-bold text-[#081d3d] select-none truncate flex items-center"
            style={{
              top: '67.3%',
              left: '22.6%',
              width: '26.5%',
              maxWidth: '26.5%',
              transform: 'translateY(-50%)',
              fontFamily: "'Times New Roman', Times, serif",
              fontSize: 'clamp(9px, 1.25vw, 13px)',
              letterSpacing: '0.02em',
              lineHeight: 1
            }}
          >
            {displayCertNo}
          </div>

          {/* Row 3: Course */}
          <div 
            className="absolute font-bold text-[#081d3d] select-none truncate capitalize flex items-center"
            style={{
              top: '70.2%',
              left: '22.6%',
              width: '26.5%',
              maxWidth: '26.5%',
              transform: 'translateY(-50%)',
              fontFamily: "'Times New Roman', Times, serif",
              fontSize: 'clamp(9px, 1.25vw, 13px)',
              letterSpacing: '0.02em',
              lineHeight: 1
            }}
          >
            {courseName || 'Abacus'}
          </div>

          {/* Row 4: Level */}
          <div 
            className="absolute font-bold text-[#081d3d] select-none truncate capitalize flex items-center"
            style={{
              top: '73.2%',
              left: '22.6%',
              width: '26.5%',
              maxWidth: '26.5%',
              transform: 'translateY(-50%)',
              fontFamily: "'Times New Roman', Times, serif",
              fontSize: 'clamp(9px, 1.25vw, 13px)',
              letterSpacing: '0.02em',
              lineHeight: 1
            }}
          >
            {level || 'Level 1'}
          </div>

          {/* Row 5: Duration */}
          <div 
            className="absolute font-bold text-[#081d3d] select-none truncate capitalize flex items-center"
            style={{
              top: '76.2%',
              left: '22.6%',
              width: '26.5%',
              maxWidth: '26.5%',
              transform: 'translateY(-50%)',
              fontFamily: "'Times New Roman', Times, serif",
              fontSize: 'clamp(9px, 1.25vw, 13px)',
              letterSpacing: '0.02em',
              lineHeight: 1
            }}
          >
            {duration || '6 Months'}
          </div>

          {/* --- RIGHT COLUMN VALUES --- */}
          {/* Row 1: School / Examination Centre */}
          <div 
            className="absolute font-bold text-[#081d3d] select-none truncate capitalize flex items-center"
            style={{
              top: '64.3%',
              left: '76.5%',
              width: '16.5%',
              maxWidth: '16.5%',
              transform: 'translateY(-50%)',
              fontFamily: "'Times New Roman', Times, serif",
              fontSize: 'clamp(9px, 1.25vw, 13px)',
              letterSpacing: '0.02em',
              lineHeight: 1
            }}
          >
            {centreName || 'Central Branch'}
          </div>

          {/* Row 2: Code */}
          <div 
            className="absolute font-bold text-[#081d3d] select-none truncate flex items-center"
            style={{
              top: '67.3%',
              left: '76.5%',
              width: '16.5%',
              maxWidth: '16.5%',
              transform: 'translateY(-50%)',
              fontFamily: "'Times New Roman', Times, serif",
              fontSize: 'clamp(9px, 1.25vw, 13px)',
              letterSpacing: '0.02em',
              lineHeight: 1
            }}
          >
            {centreCode || '546454'}
          </div>

          {/* Row 3: Address Line 1 */}
          <div 
            className="absolute font-bold text-[#081d3d] select-none truncate capitalize flex items-center"
            style={{
              top: '70.2%',
              left: '76.5%',
              width: '16.5%',
              maxWidth: '16.5%',
              transform: 'translateY(-50%)',
              fontFamily: "'Times New Roman', Times, serif",
              fontSize: 'clamp(8.5px, 1.2vw, 12.5px)',
              letterSpacing: '0.02em',
              lineHeight: 1
            }}
          >
            {addressLine1}
          </div>

          {/* Row 4: Address Line 2 (graceful wrapping into blank Row 4 area on the right!) */}
          {addressLine2 && (
            <div 
              className="absolute font-bold text-[#081d3d] select-none truncate capitalize flex items-center"
              style={{
                top: '73.2%',
                left: '76.5%',
                width: '16.5%',
                maxWidth: '16.5%',
                transform: 'translateY(-50%)',
                fontFamily: "'Times New Roman', Times, serif",
                fontSize: 'clamp(8.5px, 1.2vw, 12.5px)',
                letterSpacing: '0.02em',
                lineHeight: 1
              }}
            >
              {addressLine2}
            </div>
          )}

          {/* Row 5: Date of Issue */}
          <div 
            className="absolute font-bold text-[#081d3d] select-none truncate flex items-center"
            style={{
              top: '76.2%',
              left: '76.5%',
              width: '16.5%',
              maxWidth: '16.5%',
              transform: 'translateY(-50%)',
              fontFamily: "'Times New Roman', Times, serif",
              fontSize: 'clamp(9px, 1.25vw, 13px)',
              letterSpacing: '0.02em',
              lineHeight: 1
            }}
          >
            {issueDate || '05-10-2026'}
          </div>

          {/* 7. CENTER DIRECTOR / PRINCIPAL SIGNATURE (Centered directly above "Center Director / Principal") */}
          <div 
            className="absolute flex items-end justify-center select-none pointer-events-none"
            style={{
              top: '91.0%',
              left: '16.1%',
              width: '13.0%',
              height: '6.0%',
              transform: 'translate(-50%, -100%)'
            }}
          >
            <svg viewBox="0 0 113 42" className="h-full w-auto text-[#081d3d] fill-current drop-shadow-2xs">
              <path d="M 41 37 L 39 39 L 37 39 L 35 41 L 33 41 L 35 41 L 36 40 L 39 40 L 44 37 Z M 7 37 L 4 41 L 6 41 Z M 14 33 L 12 35 L 10 35 L 12 35 Z M 60 32 L 58 34 L 53 35 L 57 35 L 59 33 L 62 32 Z M 25 28 L 23 29 L 21 31 L 19 31 L 21 31 L 22 30 L 27 29 Z M 20 13 L 19 16 L 20 18 L 22 18 L 24 20 L 32 21 L 36 23 L 38 25 L 40 28 L 40 30 L 37 33 L 37 34 L 35 36 L 33 37 L 31 37 L 28 40 L 26 41 L 23 41 L 26 41 L 30 40 L 33 38 L 36 36 L 43 30 L 46 31 L 53 29 L 51 26 L 48 25 L 46 27 L 43 27 L 40 24 L 37 22 L 34 22 L 26 18 L 23 18 L 21 16 L 22 13 Z M 27 9 L 25 10 L 24 12 L 26 11 L 29 9 Z M 76 6 L 75 8 L 74 10 L 73 14 L 70 20 L 68 22 L 68 23 L 67 24 L 65 25 L 63 25 L 61 24 L 55 26 L 55 28 L 59 28 L 61 26 L 64 27 L 65 26 L 68 27 L 66 31 L 69 31 L 69 28 L 71 26 L 78 26 L 84 24 L 86 24 L 87 25 L 89 25 L 91 23 L 93 22 L 96 23 L 96 24 L 101 25 L 103 24 L 101 24 L 100 23 L 97 22 L 97 20 L 93 19 L 93 21 L 91 23 L 89 23 L 87 21 L 84 21 L 82 22 L 78 25 L 73 24 L 74 22 L 75 21 L 78 20 L 77 17 L 74 16 L 74 14 L 79 7 L 80 5 L 80 3 Z M 42 2 L 39 3 L 37 4 L 35 6 L 32 7 L 35 7 L 40 4 L 43 4 L 47 2 L 49 5 L 43 10 L 46 9 L 50 5 L 49 2 L 48 2 Z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
