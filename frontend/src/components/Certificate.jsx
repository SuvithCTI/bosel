import React, { useRef, useState, useEffect } from 'react';

import { Upload, Download, Loader2, Building2, Image as ImageIcon, X, PenTool } from 'lucide-react';

import { exportPdfFromElement } from '../utils/pdfExport';

import { getCoursePrefix } from '../utils/authStorage';

import shieldLogo from '../assets/bsel-shield-logo.png';

import lionSeal from '../assets/rising-stars-seal.png';

import msmeLogo from '../assets/msme-logo.png';

import iafLogo from '../assets/iaf-logo.png';

import isoLogo from '../assets/iso-9001-logo.png';
import authSignSeal from '../assets/authorized-signature-seal.png';

const NAVY = '#13427a';

const GOLD = '#c9a227';

const KEY_SIGN = 'bsel_certificate_director_signature';

const KEY_HEADER = 'bsel_certificate_school_header';

const readHeader = () => {

  try {

    return JSON.parse(localStorage.getItem(KEY_HEADER) || '{}');

  } catch {

    return {};

  }

};

const readSignature = () => {

  try {

    return localStorage.getItem(KEY_SIGN) || null;

  } catch {

    return null;

  }

};

const formatAddress = (addr) => {

  if (!addr) return { line1: 'Tenkasi, Tamil Nadu', line2: '' };

  const cleaned = addr.replace(/,([^\s])/g, ', $1').trim();

  const titleCased = cleaned

    .split(' ')

    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())

    .join(' ');

  const parts = titleCased.split(', ');

  if (parts.length >= 2 && titleCased.length > 20) {

    const mid = Math.ceil(parts.length / 2);

    return {

      line1: parts.slice(0, mid).join(', ') + ',',

      line2: parts.slice(mid).join(', '),

    };

  }

  return { line1: titleCased, line2: '' };

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

  duration = '6 Months',

  registrationNo = 'DR26-001',

  certificateNo = '',

  centreName = 'Tenkasi',

  centreCode = '545454',

  centreAddress = 'Podanur',

  issueDate = '05-10-2026',

  studentPhoto = null,

  certificateType = 'Certificate of Completion',

  onPhotoUpload = null,

  showControls = true,

  className = '',

  schoolName = '',

  schoolSubtitle = '',

  schoolMotto = '',

  schoolLogo = null,

  onSchoolLogoUpload = null,

  directorSignature = null,

  onDirectorSignatureUpload = null,

}) {

  const wrapperRef = useRef(null);

  const photoInputRef = useRef(null);

  const logoInputRef = useRef(null);

  const signInputRef = useRef(null);

  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // ----- School header (name / subtitle / motto / logo), persisted -----

  const saved = readHeader();

  const [headerName, setHeaderName] = useState(schoolName || saved.name || centreName?.toUpperCase() || 'RISING STARS');

  const [headerSubtitle, setHeaderSubtitle] = useState(schoolSubtitle || saved.subtitle || 'VISION FOUNDATION');

  const [headerMotto, setHeaderMotto] = useState(schoolMotto || saved.motto || 'EDUCATION • EMPOWERMENT • EXCELLENCE');

  const [headerLogo, setHeaderLogo] = useState(schoolLogo || saved.logo || null);

  // ----- Principal signature, persisted -----

  const [directorSign, setDirectorSign] = useState(directorSignature || readSignature());

  useEffect(() => { if (schoolName) setHeaderName(schoolName); }, [schoolName]);

  useEffect(() => { if (schoolSubtitle) setHeaderSubtitle(schoolSubtitle); }, [schoolSubtitle]);

  useEffect(() => { if (schoolMotto) setHeaderMotto(schoolMotto); }, [schoolMotto]);

  useEffect(() => { if (schoolLogo) setHeaderLogo(schoolLogo); }, [schoolLogo]);

  useEffect(() => { if (directorSignature) setDirectorSign(directorSignature); }, [directorSignature]);

  const saveHeader = (next) => {

    try {

      localStorage.setItem(KEY_HEADER, JSON.stringify({

        name: headerName, subtitle: headerSubtitle, motto: headerMotto, logo: headerLogo, ...next,

      }));

    } catch (e) {

      console.warn('Could not persist certificate header:', e);

    }

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

  const { line1: addr1, line2: addr2 } = formatAddress(centreAddress);

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

  const nameFontSize =
    headerName.length <= 8 ? 32 :
    headerName.length <= 12 ? 28 : 24.5;

  const subtitleFontSize =
    headerSubtitle.length <= 12 ? 20 :
    headerSubtitle.length <= 17 ? 18 :
    headerSubtitle.length <= 22 ? 16.5 : 15;

  const mottoFontSize =
    headerMotto.length <= 18 ? 15 :
    headerMotto.length <= 24 ? 13.5 :
    headerMotto.length <= 30 ? 12 : 11;

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

      try { localStorage.setItem(KEY_SIGN, url); } catch {}

      onDirectorSignatureUpload?.(url);

    });

  };

  const removeSignature = () => {

    setDirectorSign(null);

    try { localStorage.removeItem(KEY_SIGN); } catch {}

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

        <div className="w-full max-w-[1024px] mb-3 bg-slate-900/95 text-white p-2.5 sm:p-3 rounded-2xl shadow-xl border border-slate-700 print:hidden flex items-center justify-between gap-3">

          <div className="text-xs font-semibold text-slate-200 truncate">

            Official B★SEL Certificate: <strong className="text-amber-400 capitalize">{studentName || 'Candidate Name'}</strong> — <span className="text-amber-300 font-bold uppercase">{courseUpper}</span>

          </div>

          <div className="flex items-center gap-2 shrink-0">

            <button

              type="button"

              onClick={() => setIsFormModalOpen(true)}

              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"

            >

              <PenTool className="w-3.5 h-3.5" />

              <span>Customize Certificate</span>

            </button>

            <button

              type="button"

              onClick={handleDownloadPdf}

              disabled={isDownloadingPdf}

              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-black rounded-xl text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"

            >

              {isDownloadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}

              <span>{isDownloadingPdf ? 'Generating PDF...' : 'Download PDF'}</span>

            </button>

          </div>

        </div>

      )}

      {isFormModalOpen && (

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

                <span className="text-[11px] font-semibold text-slate-300">Line 1: School / Branch Name <span className="text-amber-400 font-bold">(Max 16)</span></span>
                <input
                  type="text"
                  value={headerName}
                  maxLength={16}

                  onChange={(e) => { setHeaderName(e.target.value); saveHeader({ name: e.target.value }); }}

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

              <button type="button" onClick={() => setIsFormModalOpen(false)} className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm">

                Save & Done

              </button>

            </div>

          </div>

        </div>

      )}

      {/* ===== Certificate (vector, print-ready) ===== */}

      <div ref={wrapperRef} className="w-full max-w-[1024px]">

        <svg viewBox="0 0 1024 723" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block bg-white shadow-2xl print:shadow-none">

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

            <pattern id="bsel-wm" width="60" height="30" patternUnits="userSpaceOnUse">
              <text x="4" y="18" fontFamily="Georgia, serif" fontSize="12" fontWeight="700" fill={NAVY} fillOpacity="0.07">B★SEL</text>
            </pattern>

            <pattern id="bsel-strip" x="24" y="137" width="46" height="12" patternUnits="userSpaceOnUse">
              <text x="23" y="9" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="7.5" fontWeight="800" fill="#ffffff" letterSpacing="0.5">B★SEL</text>
            </pattern>

            <pattern id="bsel-strip" x="24" y="137" width="46" height="12" patternUnits="userSpaceOnUse">
              <text x="23" y="9" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="7.5" fontWeight="800" fill="#ffffff" letterSpacing="0.5">B★SEL</text>
            </pattern>

          </defs>

          {/* Background and borders */}

          <rect width="1024" height="723" fill="#fff" />

          <rect width="1024" height="723" fill="url(#bsel-wm)" />

          <rect x="6" y="6" width="1012" height="711" fill="none" stroke={NAVY} strokeWidth="10" />

          <rect x="24" y="24" width="976" height="675" fill="none" stroke={GOLD} strokeWidth="1.5" />

          {[[24, 14], [1000, 14], [24, 689], [1000, 689]].map(([x, y], i) => (

            <polygon key={i} points={`${x},${y} ${x + 8},${y + 10} ${x},${y + 20} ${x - 8},${y + 10}`} fill={GOLD} />

          ))}

          {/* Header: logos */}
          <image
            href={shieldLogo}
            x="30"
            y="32"
            width="120"
            height="92"
            preserveAspectRatio="xMidYMid meet"
          />
          <image
            href={lionSeal}
            x="464"
            y="35"
            width="96"
            height="88"
            preserveAspectRatio="xMidYMid meet"
          />

          {/* Header: wordmark */}
          <text x="274" y="52" textAnchor="middle" fontFamily="Georgia, serif" fontSize="12.5" fill={NAVY}>
            Presents through its educational initiative
          </text>
          <g>
            <text x="216" y="106" textAnchor="end" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="900" fontSize="56" fill={NAVY}>
              B
            </text>
            <polygon
              points="242.5,70.0 246.8,82.5 260.1,82.8 249.5,90.8 253.4,103.5 242.5,95.9 231.6,103.5 235.5,90.8 224.9,82.8 238.2,82.5"
              fill="url(#bsel-gold)"
              stroke={GOLD}
              strokeWidth="0.5"
            />
            <text x="269" y="106" textAnchor="start" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="900" fontSize="56" fill={NAVY} letterSpacing="1">
              SEL
            </text>
          </g>
          <text x="278" y="125" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="10.5" letterSpacing="0.2" fill={NAVY}>
            BOARD OF SKILLS AND EDUCATIONAL LEARNING
          </text>

          {/* Top-Right Header: School Details & Logo (Clickable to customize) */}
          <g
            onClick={() => setIsFormModalOpen(true)}
            style={{ cursor: 'pointer' }}
            title="Click to customize School Details & Logo"
          >
            {/* School / Branch Name (Top at big size for 15 chars) */}
            {headerName && (
              <text
                x={headerLogo ? "722" : "740"}
                y="58"
                textAnchor="middle"
                fontFamily="'Cinzel', 'Outfit', 'Plus Jakarta Sans', Georgia, 'Times New Roman', serif"
                fontWeight="900"
                fontSize={nameFontSize}
                fill={NAVY}
                letterSpacing={headerName.length > 12 ? "0" : "0.5"}
              >
                {headerName.toUpperCase()}
              </text>
            )}

            {/* Subtitle / Division (Fixed for 22 chars) */}
            {headerSubtitle && (
              <text
                x={headerLogo ? "722" : "740"}
                y="84"
                textAnchor="middle"
                fontFamily="'Outfit', 'Plus Jakarta Sans', Arial, sans-serif"
                fontWeight="800"
                fontSize={subtitleFontSize}
                fill={NAVY}
                letterSpacing={headerSubtitle.length > 18 ? "0.3" : "0.8"}
              >
                {headerSubtitle.toUpperCase()}
              </text>
            )}

            {/* Motto / Tagline (Fixed for 30 chars) */}
            {headerMotto && (
              <text
                x={headerLogo ? "722" : "740"}
                y="109"
                textAnchor="middle"
                fontFamily="'Outfit', 'Plus Jakarta Sans', Arial, sans-serif"
                fontWeight="700"
                fontSize={mottoFontSize}
                fill={NAVY}
                letterSpacing={headerMotto.length > 25 ? "0.2" : "0.5"}
              >
                {headerMotto.toUpperCase()}
              </text>
            )}

            {/* School Logo */}
            {headerLogo ? (
              <image
                href={headerLogo}
                x="888"
                y="30"
                width="98"
                height="98"
                preserveAspectRatio="xMidYMid meet"
              />
            ) : (
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
            )}
          </g>

          {/* Blue accent stripe */}
          <rect x="24" y="137" width="976" height="12" fill="#0d2f5c" stroke={GOLD} strokeWidth="0.8" />
          <rect x="24" y="137" width="976" height="12" fill="url(#bsel-strip)" />

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
            fontSize="17.5"
            letterSpacing="3.5"
            fill="#09254c"
          >
            THIS IS TO CERTIFY THAT
          </text>

          {/* Student photo (click to upload when onPhotoUpload is provided) */}

          <g onClick={() => onPhotoUpload && photoInputRef.current?.click()} style={{ cursor: onPhotoUpload ? 'pointer' : 'default' }}>

            <rect x="38" y="238" width="118" height="132" fill="#fff" stroke={GOLD} strokeWidth="5" />

            <rect x="46" y="246" width="102" height="116" fill="#fbf9f2" stroke={NAVY} strokeWidth="2.5" />

            {studentPhoto && <image href={studentPhoto} x="46" y="246" width="102" height="116" preserveAspectRatio="xMidYMid slice" />}

          </g>

          {/* Candidate name */}

          <text x="512" y="288" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="700" fontSize="30" fill={NAVY}>

            {studentName || 'Candidate Name'}

          </text>

          <line x1="261" y1="295" x2="763" y2="295" stroke={NAVY} strokeWidth="2" />

          <text x="512" y="317" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700" fontSize="19" fill={NAVY}>

            has successfully completed

          </text>

          {/* Level hexagon badge */}

          <polygon points="313,372 382,368 382,376" fill={GOLD} />

          <polygon points="642,368 710,372 642,376" fill={GOLD} />

          <polygon points="394,372 414,350 612,350 632,372 612,394 414,394" fill="#fff" stroke={GOLD} strokeWidth="4" />

          <text x="513" y="378" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700" fontSize="14" letterSpacing="2" fill={NAVY}>

            {cleanLevel.toUpperCase()}

          </text>

          <text x="512" y="413" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700" fontSize="13.5" fill={NAVY}>

            and has fulfilled the prescribed requirements for the successful completion of the programme.

          </text>

          {/* Details box */}

          <rect x="63" y="436" width="891" height="128" fill="none" stroke={NAVY} strokeWidth="2.5" />

          <line x1="512" y1="451" x2="512" y2="553" stroke={GOLD} strokeWidth="3" />

          <polygon points="512,490 519,498 512,506 505,498" fill={GOLD} />

          <g fontFamily="'Times New Roman', Times, serif" fontWeight="700" fontSize="15" fill={NAVY}>

            {[

              ['Registration No', registrationNo],

              ['Certificate No', displayCertNo],

              ['Course', courseUpper],

              ['Level', cleanLevel],

              ['Duration', duration],

            ].map(([label, value], i) => {

              const y = [464, 485, 507, 528, 550][i];

              return (

                <g key={label}>

                  <text x="82" y={y}>{label}</text>

                  <text x="213" y={y} textAnchor="middle">:</text>

                  <text x="232" y={y}>{value}</text>

                </g>

              );

            })}

            {[

              ['School / Examination Centre', centreName],

              ['Code', centreCode],

              ['Address', addr1],

              [null, addr2],

              ['Date of Issue', issueDate],

            ].map(([label, value], i) => {

              const y = [464, 485, 507, 528, 550][i];

              return (

                <g key={i}>

                  {label && <text x="533" y={y}>{label}</text>}

                  {label && <text x="763" y={y} textAnchor="middle">:</text>}

                  <text x="783" y={y}>{value}</text>

                </g>

              );

            })}

          </g>

          {/* Footer */}

          <line x1="41" y1="577" x2="976" y2="577" stroke={GOLD} strokeWidth="1.5" />

          <text x="512" y="592" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="11" fill={NAVY}>

            REGISTERED UNDER MINISTRY OF MSME, GOVT. OF INDIA

          </text>

          <text x="441" y="603" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8.5" fill={NAVY}>Registered Under</text>

          <text x="566" y="603" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8.5" fill={NAVY}>Authorized Affiliates</text>

          <image href={msmeLogo} x="410" y="606" width="54" height="60" preserveAspectRatio="xMidYMid meet" />

          <image href={iafLogo} x="478" y="614" width="70" height="43" preserveAspectRatio="xMidYMid meet" />

          <image href={isoLogo} x="566" y="608" width="48" height="48" preserveAspectRatio="xMidYMid meet" />

          <text x="512" y="688" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="11" fill={NAVY}>

            REGISTERED UNDER GOVT. OF TAMIL NADU (REGD. TRUST)

          </text>

          {/* Signatures */}
          {directorSign ? (
            <g
              onClick={() => setIsFormModalOpen(true)}
              style={{ cursor: 'pointer' }}
              title="Click to manage Principal Signature"
            >
              <image
                href={directorSign}
                x="63"
                y="598"
                width="160"
                height="68"
                preserveAspectRatio="xMidYMax meet"
              />
            </g>
          ) : (
            <g
              onClick={() => signInputRef.current?.click()}
              style={{ cursor: 'pointer' }}
              className="print:hidden"
              title="Click to upload Principal Signature"
            >
              <rect
                x="63"
                y="615"
                width="150"
                height="45"
                rx="6"
                fill="#f8fafc"
                stroke="#cbd5e1"
                strokeWidth="1.2"
                strokeDasharray="4 3"
              />
              <text
                x="138"
                y="642"
                textAnchor="middle"
                fontFamily="Arial, sans-serif"
                fontSize="10"
                fontWeight="700"
                fill="#64748b"
              >
                + Principal Sign
              </text>
            </g>
          )}

          <text x="63" y="675" fontFamily="Georgia, serif" fontSize="17" fill={NAVY}>Center Director / Principal</text>

          {/* Official Authorized Signature & Watermark Stamp */}
          <image
            href={authSignSeal}
            x="825"
            y="598"
            width="135"
            height="70"
            preserveAspectRatio="xMidYMax meet"
          />

          <text x="955" y="675" textAnchor="end" fontFamily="Georgia, serif" fontSize="17" fill={NAVY}>Authorized Signature</text>

        </svg>

      </div>

    </div>

  );

}