import React, { useRef, useState, useEffect } from 'react';
import { Upload, Download, Loader2, Building2, ChevronDown, ChevronUp, Image as ImageIcon, X, PenTool } from 'lucide-react';
import { exportPdfFromElement } from '../utils/pdfExport';
import { getCoursePrefix } from '../utils/authStorage';
import certificateTemplate from '../assets/certificate_official_template.jpg';

export default function Certificate({
  studentName = '',
  courseName = 'Abacus',
  programPrefix = '',
  level = 'Level 1',
  grade = 'A',
  duration = '6 Months',
  registrationNo = 'DR26-001',
  certificateNo = 'BSEL/DR/L1/0001',
  centreName = 'Tenkasi',
  centreCode = '545454',
  centreAddress = 'Podanur',
  issueDate = '05-10-2026',
  studentPhoto = null,
  certificateType = 'COMPLETION',
  onPhotoUpload = null,
  showControls = true,
  showUploadPhoto = false,
  className = '',
  schoolName = '',
  schoolSubtitle = '',
  schoolMotto = '',
  schoolLogo = null,
  onSchoolLogoUpload = null,
  directorSignature = null,
  onDirectorSignatureUpload = null
}) {
  const certificateRef = useRef(null);
  const fileInputRef = useRef(null);
  const schoolLogoInputRef = useRef(null);
  const directorSignInputRef = useRef(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // Director / Principal Signature state with localStorage persistence
  const [customDirectorSign, setCustomDirectorSign] = useState(() => {
    if (directorSignature) return directorSignature;
    try {
      const saved = localStorage.getItem('bsel_certificate_director_signature');
      if (saved) return saved;
    } catch (_) {}
    return null;
  });

  useEffect(() => {
    if (directorSignature) setCustomDirectorSign(directorSignature);
  }, [directorSignature]);

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
        if (onDirectorSignatureUpload) {
          onDirectorSignatureUpload(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveDirectorSign = () => {
    setCustomDirectorSign(null);
    try {
      localStorage.removeItem('bsel_certificate_director_signature');
    } catch (_) {}
    if (onDirectorSignatureUpload) {
      onDirectorSignatureUpload(null);
    }
  };

  // Load saved school details from localStorage or props
  const [customSchoolName, setCustomSchoolName] = useState(() => {
    if (schoolName) return schoolName;
    try {
      const saved = localStorage.getItem('bsel_certificate_school_header');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name) return parsed.name;
      }
    } catch {}
    return centreName ? `${centreName.toUpperCase()}` : 'RISING STARS';
  });

  const [customSchoolSubtitle, setCustomSchoolSubtitle] = useState(() => {
    if (schoolSubtitle) return schoolSubtitle;
    try {
      const saved = localStorage.getItem('bsel_certificate_school_header');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.subtitle) return parsed.subtitle;
      }
    } catch {}
    return 'VISION FOUNDATION';
  });

  const [customSchoolMotto, setCustomSchoolMotto] = useState(() => {
    if (schoolMotto) return schoolMotto;
    try {
      const saved = localStorage.getItem('bsel_certificate_school_header');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.motto) return parsed.motto;
      }
    } catch {}
    return 'EDUCATION • EMPOWERMENT • EXCELLENCE';
  });

  const [customSchoolLogo, setCustomSchoolLogo] = useState(() => {
    if (schoolLogo) return schoolLogo;
    try {
      const saved = localStorage.getItem('bsel_certificate_school_header');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.logo) return parsed.logo;
      }
    } catch {}
    return null;
  });

  // Sync state if props change
  useEffect(() => {
    if (schoolName) setCustomSchoolName(schoolName);
  }, [schoolName]);

  useEffect(() => {
    if (schoolSubtitle) setCustomSchoolSubtitle(schoolSubtitle);
  }, [schoolSubtitle]);

  useEffect(() => {
    if (schoolMotto) setCustomSchoolMotto(schoolMotto);
  }, [schoolMotto]);

  useEffect(() => {
    if (schoolLogo) setCustomSchoolLogo(schoolLogo);
  }, [schoolLogo]);

  // Persist customized school details to localStorage
  const handleSaveSchoolDetails = (name, subtitle, motto, logo) => {
    try {
      localStorage.setItem('bsel_certificate_school_header', JSON.stringify({
        name,
        subtitle,
        motto,
        logo
      }));
    } catch (e) {
      console.warn('Failed to persist school header to localStorage:', e);
    }
  };

  const handleSchoolLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        setCustomSchoolLogo(dataUrl);
        handleSaveSchoolDetails(customSchoolName, customSchoolSubtitle, customSchoolMotto, dataUrl);
        if (onSchoolLogoUpload) {
          onSchoolLogoUpload(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Clean custom course name without any forced 'MindSparc' prefix
  const rawCourse = courseName || 'ABACUS';
  const displayCourseUpper = rawCourse
    .replace(/^Mindsparc\s*[-–:]*\s*/i, '')
    .trim()
    .toUpperCase();

  // Clean Level & Grade formatting (stripping stray colons and admission statuses)
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
  const coursePrefix = getCoursePrefix(displayCourseUpper);
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

  // Dynamic font sizing scaled proportionally (1024/724) to match OfficialMarksheetView's exact visual dimensions
  const getSchoolNameFontSize = (text) => {
    const len = (text || '').trim().length;
    if (len <= 7) return 'clamp(26px, 5.8vw, 46px)';
    if (len <= 10) return 'clamp(23px, 5.1vw, 39px)';
    if (len <= 13) return 'clamp(20px, 4.4vw, 34px)';
    if (len <= 16) return 'clamp(17px, 3.8vw, 29px)';
    if (len <= 20) return 'clamp(15px, 3.3vw, 25px)';
    return 'clamp(13px, 2.9vw, 22px)';
  };

  const getSchoolSubtitleFontSize = (text) => {
    const len = (text || '').trim().length;
    if (len <= 12) return 'clamp(13px, 2.8vw, 22px)';
    if (len <= 18) return 'clamp(11.5px, 2.4vw, 19px)';
    return 'clamp(10.5px, 2.1vw, 16px)';
  };

  const getSchoolMottoFontSize = (text) => {
    const len = (text || '').trim().length;
    if (len <= 16) return 'clamp(9.5px, 1.9vw, 15px)';
    if (len <= 22) return 'clamp(8.5px, 1.7vw, 13.5px)';
    return 'clamp(8px, 1.5vw, 12px)';
  };

  const handleDownloadPdf = async () => {
    if (!certificateRef.current || isDownloadingPdf) return;
    setIsDownloadingPdf(true);
    try {
      const safeStudent = (studentName || 'Candidate').trim().replace(/[^a-zA-Z0-9]/g, '_');
      const safeCourse = (displayCourseUpper || 'Course').trim().replace(/[^a-zA-Z0-9]/g, '_');
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
      {/* Hidden file inputs for programmatic triggers */}
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
      {showUploadPhoto && (
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />
      )}

      {/* Top Controls Toolbar: Action buttons visible for Branch Admin */}
      {showControls && (
        <div className="w-full max-w-[1024px] mb-3 bg-slate-900/95 text-white p-2.5 sm:p-3 rounded-2xl shadow-xl border border-slate-700 print:hidden flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <div className="text-xs font-semibold text-slate-200 truncate">
              Official B★SEL Certificate: <strong className="text-amber-400 capitalize">{studentName || 'Candidate Name'}</strong> — <span className="text-amber-300 font-bold uppercase">{displayCourseUpper}</span>
            </div>
          </div>

          {/* Action buttons: Customize Form & Download PDF */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(true)}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-black rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              title="Open Certificate Customization Form (School Details, Logo & Principal Signature)"
            >
              <PenTool className="w-3.5 h-3.5 text-slate-950" />
              <span>Customize Certificate</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-60 text-white font-black rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
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

      {/* Pop-up Customization Form Modal */}
      {isFormModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-4 print:hidden animate-in fade-in duration-150"
          onClick={() => setIsFormModalOpen(false)}
        >
          <div 
            className="bg-slate-900 border border-slate-700 rounded-2xl p-4 sm:p-6 max-w-xl w-full shadow-2xl text-white flex flex-col gap-4 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto"
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
                    Certificate Customization Form
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Edit school details, logo, and principal signature
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-3.5 text-xs">
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
                  className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-serif uppercase tracking-wider text-xs focus:outline-none focus:border-amber-400 font-black text-sm"
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
                  className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-sans uppercase tracking-widest text-xs focus:outline-none focus:border-amber-400 font-bold"
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
                  placeholder="e.g. EDUCATION • EMPOWERMENT • EXCELLENCE"
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

      {/* Mobile Rotational Tip Badge */}
      <div className="w-full max-w-[1024px] mb-2 px-1 flex items-center justify-between text-[11px] text-slate-600 font-semibold sm:hidden print:hidden">
        <span className="text-slate-700">
          Tip: Rotate phone to landscape for full preview
        </span>
      </div>

      {/* =========================================================================
          OFFICIAL HIGH-RESOLUTION CERTIFICATE CANVAS
          Rendered using the user's custom template background with dynamic editable overlays
          ========================================================================= */}
      <div className="w-full max-w-[1024px]">
        <div 
          ref={certificateRef}
          id="printable-certificate"
          className="relative bg-white text-[#13427a] shadow-2xl select-none certificate-container overflow-hidden w-full font-serif"
          style={{
            aspectRatio: '1024 / 723',
            boxSizing: 'border-box',
            backgroundImage: `url(${certificateTemplate})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center'
          }}
        >
          {/* ===================================================================
              TOP-RIGHT CORNER: SCHOOL DETAILS & CUSTOM LOGO
              - Separated into distinct containers so text is 100% centered in its given area
              - School details dead-centered between Center Medallion and Right School Logo
              - Guaranteed NO '...' truncation with adaptive font scaling
              =================================================================== */}
          {/* Top-Right School Text Details (Dead-centered between Central Medallion and Right School Logo) */}
          <div 
            onClick={() => setIsFormModalOpen(true)}
            className="absolute flex flex-col items-center justify-center text-center select-none cursor-pointer hover:ring-1 hover:ring-amber-400/50 rounded-md transition px-1"
            style={{
              top: '2.8%',
              left: '55.3%',
              right: '12.5%',
              height: '17.1%'
            }}
            title="Click to open Certificate Customization Form"
          >
            {/* Line 1: School Name (Heavy Bold weight 900, sized cleanly, never truncating with '...') */}
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
                  textShadow: '0 0.5px 1px rgba(19, 66, 122, 0.2)'
                }}
              >
                {customSchoolName}
              </div>
            )}

            {/* Line 2: Subtitle (Heavy Bold weight 800) */}
            {customSchoolSubtitle && (
              <div 
                className="uppercase mt-0.5 text-center w-full whitespace-nowrap"
                style={{
                  color: '#13427a',
                  fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800,
                  fontSize: getSchoolSubtitleFontSize(customSchoolSubtitle),
                  letterSpacing: (customSchoolSubtitle || '').trim().length > 18 ? '0.05em' : '0.09em',
                  lineHeight: 1.05
                }}
              >
                {customSchoolSubtitle}
              </div>
            )}

            {/* Line 3: Motto / Tagline (Bold weight 700) */}
            {customSchoolMotto && (
              <div 
                className="uppercase mt-0.5 text-center w-full whitespace-nowrap"
                style={{
                  color: '#13427a',
                  fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: getSchoolMottoFontSize(customSchoolMotto),
                  letterSpacing: '0.07em',
                  lineHeight: 1.05
                }}
              >
                {customSchoolMotto}
              </div>
            )}
          </div>

          {/* Extreme Right Corner: School Logo Container (Standalone, perfectly positioned) */}
          <div 
            onClick={() => setIsFormModalOpen(true)}
            className="absolute flex items-center justify-center select-none cursor-pointer rounded-md overflow-hidden hover:ring-1 hover:ring-amber-400/50 transition"
            style={{
              top: '5.2%',
              right: '3.5%',
              width: '8.4%',
              height: '11.9%'
            }}
            title="Click to open Certificate Customization Form (School Logo)"
          >
            {customSchoolLogo ? (
              <img 
                src={customSchoolLogo} 
                alt={customSchoolName || 'School Logo'} 
                className="w-full h-full object-contain drop-shadow-sm" 
              />
            ) : (
              <div className="w-full h-full border border-dashed border-[#13427a]/30 hover:border-amber-500/80 bg-white/40 flex flex-col items-center justify-center p-1 text-center transition group/slot print:hidden">
                <ImageIcon className="w-5 h-5 text-[#13427a]/40 group-hover/slot:text-amber-500 mb-1" />
                <span className="text-[7px] font-bold text-[#13427a]/60 uppercase leading-tight font-sans">
                  School Logo
                </span>
              </div>
            )}
          </div>

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
                  <circle cx="50" cy="50" r="39" fill="none" stroke="#13427a" strokeWidth="1.2" />
                  <circle cx="50" cy="34" r="34" fill="#13427a" />
                  <path d="M50 24 L53.5 35 L65 35 L55.8 41.8 L59.3 52.8 L50 46 L40.7 52.8 L44.2 41.8 L35 35 L46.5 35 Z" fill="#c59b27" />
                  <path d="M42 58 Q50 63 58 58" stroke="#c59b27" strokeWidth="2" fill="none" />
                </svg>
                <span className="text-[6.5px] sm:text-[7.5px] font-black uppercase tracking-[0.14em] text-[#13427a] mt-1 font-serif leading-none">
                  B★SEL SEAL
                </span>
                <span className="text-[5px] sm:text-[6px] font-bold uppercase tracking-wider text-[#967228] mt-0.5 leading-none">
                  OFFICIAL
                </span>

                {onPhotoUpload && (
                  <div className="absolute inset-0 bg-[#13427a]/85 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-1 print:hidden">
                    <Upload className="w-4 h-4 text-amber-400 mb-0.5" />
                    <span className="text-[7px] font-black uppercase tracking-wider text-amber-200">Upload</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2. DYNAMIC CANDIDATE NAME (Resting directly above the underline at y: 40.8%) */}
          <div 
            className="absolute -translate-x-1/2 -translate-y-full text-center select-none"
            style={{
              top: '40.8%',
              left: '50.0%',
              width: '60%',
              fontFamily: "'Playfair Display', Georgia, serif"
            }}
          >
            <span 
              className="capitalize text-[#13427a] font-serif font-bold italic block truncate px-2"
              style={{
                fontSize: 'clamp(20px, 3.0vw, 36px)',
                letterSpacing: '0.025em',
                lineHeight: 1.1,
                textShadow: '0 1px 1px rgba(19, 66, 122, 0.08)'
              }}
            >
              {studentName || 'Candidate Name'}
            </span>
          </div>

          {/* 3. DYNAMIC COURSE TITLE (Rendered cleanly above the hexagon badge, aligned a little up at y: 45.0%) */}
          <div 
            className="absolute -translate-x-1/2 flex items-center justify-center font-bold tracking-[0.09em] uppercase text-center select-none"
            style={{
              top: '45.0%',
              left: '50.0%',
              maxWidth: '680px',
              width: 'auto',
              fontSize: 'clamp(12px, 1.65vw, 17px)',
              fontFamily: "'Cinzel', Georgia, serif",
              lineHeight: 1.2
            }}
          >
            <span className="text-[#13427a] font-black tracking-wider">{displayCourseUpper}</span>
          </div>

          {/* 4. LEVEL (Perfectly Centered Inside the Gold Hexagon Badge at exact y: 51.7% / 373.5px) */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-center font-black uppercase text-[#13427a] select-none pointer-events-none"
            style={{
              top: '51.7%',
              left: '50.0%',
              maxWidth: '320px',
              width: 'max-content',
              fontSize: 'clamp(10px, 1.4vw, 13.5px)',
              letterSpacing: '0.14em',
              fontFamily: "'Cinzel', Georgia, serif",
              lineHeight: 1
            }}
          >
            <span className="text-[#13427a] font-black">{formattedLevel}</span>
          </div>

          {/* =========================================================================
              5. DETAILS GRID / TABLE (LEFT & RIGHT COLUMNS)
              Rendered in classic 'Times New Roman' with perfect column-by-column alignment
              - Labels, colons (:), and dynamic values are all aligned in vertical columns
              - Fits inside the official template's double-border box
              ========================================================================= */}
          <div
            className="absolute flex items-center justify-between select-none pointer-events-none"
            style={{
              top: '60.6%',
              left: '1.2%',
              width: '97.6%',
              height: '17.7%',
              fontFamily: "'Times New Roman', Times, serif",
              color: '#13427a',
              fontSize: 'clamp(8.5px, 1.2vw, 12.5px)',
              lineHeight: 1.2
            }}
          >
            {/* --- LEFT COLUMN (5 Rows) --- */}
            <div className="w-[48.5%] h-full flex flex-col justify-between py-2.5 pl-4 pr-2">
              {/* Row 1: Registration No */}
              <div className="grid grid-cols-[34%_4%_62%] items-center">
                <span className="font-bold whitespace-nowrap">Registration No</span>
                <span className="font-bold text-center">:</span>
                <span className="font-bold truncate pl-1">{registrationNo || 'REG-001'}</span>
              </div>

              {/* Row 2: Certificate No */}
              <div className="grid grid-cols-[34%_4%_62%] items-center">
                <span className="font-bold whitespace-nowrap">Certificate No</span>
                <span className="font-bold text-center">:</span>
                <span className="font-bold truncate pl-1">{displayCertNo}</span>
              </div>

              {/* Row 3: Course */}
              <div className="grid grid-cols-[34%_4%_62%] items-center">
                <span className="font-bold whitespace-nowrap">Course</span>
                <span className="font-bold text-center">:</span>
                <span className="font-bold truncate pl-1 uppercase">{displayCourseUpper}</span>
              </div>

              {/* Row 4: Level */}
              <div className="grid grid-cols-[34%_4%_62%] items-center">
                <span className="font-bold whitespace-nowrap">Level</span>
                <span className="font-bold text-center">:</span>
                <span className="font-bold truncate pl-1 capitalize">{level || 'Level 1'}</span>
              </div>

              {/* Row 5: Duration */}
              <div className="grid grid-cols-[34%_4%_62%] items-center">
                <span className="font-bold whitespace-nowrap">Duration</span>
                <span className="font-bold text-center">:</span>
                <span className="font-bold truncate pl-1 capitalize">{duration || '6 Months'}</span>
              </div>
            </div>

            {/* --- RIGHT COLUMN (5 Rows) --- */}
            <div className="w-[48.5%] h-full flex flex-col justify-between py-2.5 pl-3 pr-4">
              {/* Row 1: School / Examination Centre */}
              <div className="grid grid-cols-[48%_4%_48%] items-center">
                <span className="font-bold whitespace-nowrap">School / Examination Centre</span>
                <span className="font-bold text-center">:</span>
                <span className="font-bold truncate pl-1 capitalize">{centreName || 'Tenkasi Regional Branch'}</span>
              </div>

              {/* Row 2: Code */}
              <div className="grid grid-cols-[48%_4%_48%] items-center">
                <span className="font-bold whitespace-nowrap">Code</span>
                <span className="font-bold text-center">:</span>
                <span className="font-bold truncate pl-1">{centreCode || '101'}</span>
              </div>

              {/* Row 3: Address */}
              <div className="grid grid-cols-[48%_4%_48%] items-center">
                <span className="font-bold whitespace-nowrap">Address</span>
                <span className="font-bold text-center">:</span>
                <span className="font-bold truncate pl-1 capitalize">{addressLine1 || 'Branch Address'}</span>
              </div>

              {/* Row 4: Address Line 2 (or blank) */}
              <div className="grid grid-cols-[48%_4%_48%] items-center min-h-[1em]">
                {addressLine2 ? (
                  <>
                    <span></span>
                    <span></span>
                    <span className="font-bold truncate pl-1 capitalize">{addressLine2}</span>
                  </>
                ) : (
                  <span></span>
                )}
              </div>

              {/* Row 5: Date of Issue */}
              <div className="grid grid-cols-[48%_4%_48%] items-center">
                <span className="font-bold whitespace-nowrap">Date of Issue</span>
                <span className="font-bold text-center">:</span>
                <span className="font-bold truncate pl-1">{issueDate || '12/11/2026'}</span>
              </div>
            </div>
          </div>

          {/* 6. CENTER DIRECTOR / PRINCIPAL SIGNATURE (Centered directly above "Center Director / Principal") */}
          <div 
            onClick={() => setIsFormModalOpen(true)}
            className="absolute flex items-end justify-center select-none cursor-pointer group/sign hover:ring-1 hover:ring-amber-400/50 rounded transition"
            style={{
              top: '91.0%',
              left: '16.1%',
              width: '16.0%',
              height: '8.0%',
              transform: 'translate(-50%, -100%)'
            }}
            title="Click to open form & manage Principal signature"
          >
            {customDirectorSign ? (
              <div className="relative h-full w-full flex items-end justify-center">
                <img 
                  src={customDirectorSign} 
                  alt="Center Director / Principal Signature" 
                  className="max-h-full max-w-full object-contain drop-shadow-2xs" 
                />
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
              </div>
            ) : (
              <div className="w-full h-full border border-dashed border-[#13427a]/30 hover:border-amber-500/80 bg-white/40 rounded flex flex-col items-center justify-center p-1 text-center transition print:hidden">
                <PenTool className="w-3.5 h-3.5 text-[#13427a]/40 group-hover/sign:text-amber-500 mb-0.5" />
                <span className="text-[6.5px] font-bold text-[#13427a]/60 uppercase leading-none font-sans">
                  Principal Sign
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
