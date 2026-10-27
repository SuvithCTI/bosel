import React, { useRef, useState } from 'react';
import { Upload, Download, Loader2, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function Certificate({
  studentName = '',
  courseName = 'Abacus',
  programPrefix = 'MINDSPARC',
  level = 'Level 1',
  grade = 'B',
  duration = '6 Months',
  registrationNo = 'AB27-001',
  certificateNo = 'BSEL/ABACUS/L1/0007',
  centreName = 'test branch',
  centreCode = '546454',
  centreAddress = 'second street, surandai,keelasurandai,tenkasi',
  issueDate = '05-10-2026',
  studentPhoto = null,
  certificateType = 'COMPETITION',
  onPhotoUpload = null,
  showControls = true,
  className = ''
}) {
  const certificateRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const displayCourseUpper = (courseName || 'ABACUS').toUpperCase();
  const fullCourseTitle = programPrefix 
    ? `${programPrefix.toUpperCase()} - ${displayCourseUpper}`
    : displayCourseUpper;

  const handleDownloadPdf = async () => {
    if (!certificateRef.current || isDownloadingPdf) return;
    setIsDownloadingPdf(true);
    try {
      const element = certificateRef.current;
      
      // High-resolution rasterization for razor-sharp vector/font quality in PDF
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#fcfbf7'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      // A4 Landscape dimensions in mm: 297mm width, 210mm height
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

      const safeStudent = (studentName || 'Candidate').trim().replace(/[^a-zA-Z0-9]/g, '_');
      const safeCourse = (courseName || 'Skill').trim().replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `BSEL_${safeCourse}_Certificate_${safeStudent}.pdf`;

      // Direct download trigger via Blob URL
      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
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
        <div className="w-full max-w-[1020px] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-3 bg-slate-900/95 text-white p-3 rounded-2xl shadow-xl border border-slate-700 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <div className="text-xs font-semibold text-slate-200 truncate">
              Official B★SEL Certificate: <strong className="text-amber-400 capitalize">{studentName || 'Candidate Name'}</strong> — <span className="text-amber-300 font-bold uppercase">{courseName}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
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
      <div className="w-full max-w-[1020px] mb-2 px-1 flex items-center justify-between text-[11px] text-slate-600 font-semibold sm:hidden print:hidden">
        <span className="flex items-center gap-1 text-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Tip: Rotate phone to landscape for full preview</span>
        </span>
      </div>

      {/* =========================================================================
          PURE VECTOR / HTML / SVG CERTIFICATE TEMPLATE
          Faithful, pixel-aligned reproduction of Board of Skills and Educational Learning Certificate
          ========================================================================= */}
      <div className="w-full max-w-[1020px]">
        <div 
          ref={certificateRef}
          id="printable-certificate"
          className="relative bg-[#fcfbf7] text-[#0c234b] shadow-2xl select-none certificate-container overflow-hidden rounded-xl sm:rounded-none w-full"
          style={{
            aspectRatio: '1.414 / 1', // Standard A4 Landscape
          boxSizing: 'border-box',
          backgroundImage: 'radial-gradient(ellipse at center, #ffffff 0%, #faf8f0 70%, #f3ebdc 100%)'
        }}
      >
        {/* ================= 1. OUTER DEEP NAVY BORDER & GOLD FRETWORK ================= */}
        <div className="absolute inset-0 border-[12px] sm:border-[16px] md:border-[20px] border-[#081d3d] pointer-events-none z-20">
          {/* Top border gold meander fretwork */}
          <div 
            className="absolute -top-[12px] sm:-top-[16px] md:-top-[20px] left-0 right-0 h-[12px] sm:h-[16px] md:h-[20px] opacity-40"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h24v24H0V0zm2 2v20h20V2H2zm2 2h16v16H4V4zm2 2v12h12V6H6zm2 2h8v8H8V8zm2 2v4h4v-4h-4z' fill='%23d4af37' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat-x'
            }}
          />
          {/* Bottom border gold meander fretwork */}
          <div 
            className="absolute -bottom-[12px] sm:-bottom-[16px] md:-bottom-[20px] left-0 right-0 h-[12px] sm:h-[16px] md:h-[20px] opacity-40"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h24v24H0V0zm2 2v20h20V2H2zm2 2h16v16H4V4zm2 2v12h12V6H6zm2 2h8v8H8V8zm2 2v4h4v-4h-4z' fill='%23d4af37' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat-x'
            }}
          />
          {/* Left border gold meander fretwork */}
          <div 
            className="absolute top-0 bottom-0 -left-[12px] sm:-left-[16px] md:-left-[20px] w-[12px] sm:w-[16px] md:w-[20px] opacity-40"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h24v24H0V0zm2 2v20h20V2H2zm2 2h16v16H4V4zm2 2v12h12V6H6zm2 2h8v8H8V8zm2 2v4h4v-4h-4z' fill='%23d4af37' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat-y'
            }}
          />
          {/* Right border gold meander fretwork */}
          <div 
            className="absolute top-0 bottom-0 -right-[12px] sm:-right-[16px] md:-right-[20px] w-[12px] sm:w-[16px] md:w-[20px] opacity-40"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h24v24H0V0zm2 2v20h20V2H2zm2 2h16v16H4V4zm2 2v12h12V6H6zm2 2h8v8H8V8zm2 2v4h4v-4h-4z' fill='%23d4af37' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat-y'
            }}
          />
        </div>

        {/* 4 Corner Medallions (Dark Navy Square with Gold Star Rosette) */}
        {/* Top-Left */}
        <div className="absolute top-0 left-0 w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13 bg-[#081d3d] border-2 border-amber-400 z-30 flex items-center justify-center shadow-md">
          <svg viewBox="0 0 40 40" className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 text-amber-400" fill="currentColor">
            <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
            <polygon points="20,4 23,15 34,12 25,20 34,28 23,25 20,36 17,25 6,28 15,20 6,12 17,15" fill="#f59e0b" />
            <circle cx="20" cy="20" r="3.5" fill="#081d3d" stroke="#f59e0b" strokeWidth="1" />
          </svg>
        </div>

        {/* Top-Right */}
        <div className="absolute top-0 right-0 w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13 bg-[#081d3d] border-2 border-amber-400 z-30 flex items-center justify-center shadow-md">
          <svg viewBox="0 0 40 40" className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 text-amber-400" fill="currentColor">
            <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
            <polygon points="20,4 23,15 34,12 25,20 34,28 23,25 20,36 17,25 6,28 15,20 6,12 17,15" fill="#f59e0b" />
            <circle cx="20" cy="20" r="3.5" fill="#081d3d" stroke="#f59e0b" strokeWidth="1" />
          </svg>
        </div>

        {/* Bottom-Left */}
        <div className="absolute bottom-0 left-0 w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13 bg-[#081d3d] border-2 border-amber-400 z-30 flex items-center justify-center shadow-md">
          <svg viewBox="0 0 40 40" className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 text-amber-400" fill="currentColor">
            <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
            <polygon points="20,4 23,15 34,12 25,20 34,28 23,25 20,36 17,25 6,28 15,20 6,12 17,15" fill="#f59e0b" />
            <circle cx="20" cy="20" r="3.5" fill="#081d3d" stroke="#f59e0b" strokeWidth="1" />
          </svg>
        </div>

        {/* Bottom-Right */}
        <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13 bg-[#081d3d] border-2 border-amber-400 z-30 flex items-center justify-center shadow-md">
          <svg viewBox="0 0 40 40" className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 text-amber-400" fill="currentColor">
            <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
            <polygon points="20,4 23,15 34,12 25,20 34,28 23,25 20,36 17,25 6,28 15,20 6,12 17,15" fill="#f59e0b" />
            <circle cx="20" cy="20" r="3.5" fill="#081d3d" stroke="#f59e0b" strokeWidth="1" />
          </svg>
        </div>

        {/* Inner Gold Frame with Diamond Corner Finials */}
        <div className="absolute inset-[15px] sm:inset-[20px] md:inset-[25px] border border-[#c59b27] pointer-events-none z-10">
          {/* Corner decorative diamond accents */}
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#c59b27] rotate-45"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#c59b27] rotate-45"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#c59b27] rotate-45"></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#c59b27] rotate-45"></div>

          {/* Side vertical/horizontal finials matching the original */}
          <div className="absolute left-2 top-8 bottom-8 w-[1px] bg-[#c59b27]/30 flex flex-col justify-between items-center">
            <div className="w-1.5 h-1.5 bg-[#c59b27] rotate-45"></div>
            <div className="w-1.5 h-1.5 bg-[#c59b27] rotate-45"></div>
          </div>
          <div className="absolute right-2 top-8 bottom-8 w-[1px] bg-[#c59b27]/30 flex flex-col justify-between items-center">
            <div className="w-1.5 h-1.5 bg-[#c59b27] rotate-45"></div>
            <div className="w-1.5 h-1.5 bg-[#c59b27] rotate-45"></div>
          </div>
        </div>

        {/* Extremely Subtle Background Guilloche Radial Starburst */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.025] z-0">
          <svg viewBox="0 0 600 600" className="w-[520px] h-[520px] text-amber-900" fill="none" stroke="currentColor">
            <circle cx="300" cy="300" r="280" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="300" cy="300" r="240" strokeWidth="1" />
            <circle cx="300" cy="300" r="200" strokeWidth="1.5" strokeDasharray="2 2" />
            <circle cx="300" cy="300" r="140" strokeWidth="1" />
            {[...Array(36)].map((_, i) => (
              <line 
                key={i} 
                x1="300" 
                y1="300" 
                x2={300 + 280 * Math.cos((i * 10 * Math.PI) / 180)} 
                y2={300 + 280 * Math.sin((i * 10 * Math.PI) / 180)} 
                strokeWidth="0.75" 
              />
            ))}
          </svg>
        </div>

        {/* ================= 2. CERTIFICATE CONTENT (FLEX COLUMN) ================= */}
        <div className="relative z-10 w-full h-full px-6 sm:px-9 md:px-12 pt-3 sm:pt-4 pb-4 sm:pb-5 flex flex-col justify-between">
          
          {/* ----- SECTION A: TOP HEADER & CONTACT STRIP ----- */}
          <div>
            <div className="flex items-center justify-between gap-2 px-1 sm:px-2 pt-1">
              {/* Left: B★SEL Logo */}
              <div className="flex flex-col text-left">
                <div 
                  className="font-extrabold tracking-widest text-[#0c234b] flex items-center gap-1 leading-none"
                  style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(18px, 2.5vw, 28px)' }}
                >
                  <span>B</span>
                  <span className="text-amber-500 font-black text-xl sm:text-2xl">★</span>
                  <span>SEL</span>
                </div>
                <span className="text-[6px] sm:text-[7.5px] md:text-[8px] font-bold uppercase tracking-wider text-[#0c234b] mt-1">
                  BOARD OF SKILLS AND EDUCATIONAL LEARNING
                </span>
              </div>

              {/* Center: Official Navy Plaque */}
              <div className="bg-[#0b2146] text-white px-3 sm:px-5 md:px-7 py-1 sm:py-1.5 rounded-lg border-2 border-[#c59b27] shadow-md text-center relative shrink-0">
                <div className="absolute inset-[2px] border border-[#c59b27]/60 rounded-md pointer-events-none"></div>
                <div 
                  className="font-extrabold tracking-wider leading-tight text-white uppercase"
                  style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(7.5px, 0.95vw, 11px)' }}
                >
                  BOARD OF SKILLS AND
                </div>
                <div 
                  className="font-extrabold tracking-wider leading-tight text-white uppercase"
                  style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(7.5px, 0.95vw, 11px)' }}
                >
                  EDUCATIONAL LEARNING
                </div>
                <div className="text-[6.5px] sm:text-[8px] md:text-[9px] font-bold tracking-widest text-amber-300 mt-0.5">
                  ( B SEL )
                </div>
              </div>

              {/* Right: Rising Stars Vision Foundation */}
              <div className="flex flex-col items-end text-right">
                <div 
                  className="font-black text-[#0c234b] tracking-wider uppercase leading-tight"
                  style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(8.5px, 1.1vw, 12px)' }}
                >
                  RISING STARS
                </div>
                <div className="text-[7.5px] sm:text-[9px] md:text-[10px] font-bold text-amber-600 tracking-wider uppercase leading-tight">
                  VISION FOUNDATION
                </div>
                <div className="text-[5px] sm:text-[6px] md:text-[6.5px] font-semibold text-slate-500 tracking-widest uppercase mt-0.5">
                  EDUCATION | EMPOWERMENT | EXCELLENCE
                </div>
              </div>
            </div>

            {/* Sub-Header Contact Bar */}
            <div className="mt-1.5 bg-[#0b2146] text-white py-0.5 px-3 border-y border-[#c59b27] flex items-center justify-between text-[6.5px] sm:text-[7.5px] md:text-[8.5px] font-medium tracking-wide">
              <span className="flex items-center gap-1">
                <span className="text-amber-400">★</span> HEAD OFFICE: TENKASI, TAMIL NADU, INDIA
              </span>
              <span className="flex items-center gap-1 font-mono">
                <span className="text-amber-400">☎</span> 9865219131
              </span>
              <span className="flex items-center gap-1">
                <span className="text-amber-400">✉</span> bsel.mindsparc@gmail.com
              </span>
            </div>
          </div>

          {/* ----- SECTION B: TITLE (GUARANTEED SINGLE LINE WITH DIAMOND FINIALS) ----- */}
          <div className="my-0.5">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <div className="h-[1px] w-8 sm:w-16 md:w-20 bg-[#c59b27] relative shrink">
                <div className="absolute right-0 -top-[3px] w-1.5 h-1.5 bg-[#c59b27] rotate-45"></div>
              </div>
              <h2 
                className="font-black uppercase text-[#0c234b] tracking-[0.16em] whitespace-nowrap select-none"
                style={{ 
                  fontFamily: "'Cinzel', serif", 
                  fontSize: 'clamp(13px, 1.85vw, 21px)',
                  letterSpacing: '0.15em'
                }}
              >
                CERTIFICATE OF {certificateType}
              </h2>
              <div className="h-[1px] w-8 sm:w-16 md:w-20 bg-[#c59b27] relative shrink">
                <div className="absolute left-0 -top-[3px] w-1.5 h-1.5 bg-[#c59b27] rotate-45"></div>
              </div>
            </div>
          </div>

          {/* ----- SECTION C: MIDDLE ROW (PHOTO ON LEFT, CANDIDATE DETAILS IN CENTER, QR ON RIGHT) ----- */}
          <div className="flex items-center justify-between gap-2 sm:gap-4 my-0.5 px-1 sm:px-2">
            
            {/* 1. LEFT: STUDENT PHOTO BOX (Opposite to Name) */}
            <div className="shrink-0 flex flex-col items-center">
              <div 
                onClick={() => onPhotoUpload && fileInputRef.current?.click()}
                className={`w-[66px] h-[82px] sm:w-[76px] sm:h-[96px] md:w-[88px] md:h-[110px] bg-amber-50/40 border-2 border-[#c59b27] rounded-xs p-1 flex flex-col items-center justify-center relative overflow-hidden shadow-2xs ${
                  onPhotoUpload ? 'cursor-pointer hover:border-amber-500 transition' : ''
                }`}
                title={onPhotoUpload ? 'Click to upload/change photo' : 'Student Photo Box'}
              >
                <div className="absolute inset-[2px] border border-[#c59b27]/40 pointer-events-none"></div>
                {studentPhoto ? (
                  <img 
                    src={studentPhoto} 
                    alt="Student" 
                    className="w-full h-full object-cover rounded-xs"
                  />
                ) : (
                  <div className="text-center p-1 select-none">
                    <span className="block text-[7px] sm:text-[8px] md:text-[9px] font-bold text-amber-900/60 uppercase tracking-widest leading-tight">
                      STUDENT
                    </span>
                    <span className="block text-[7px] sm:text-[8px] md:text-[9px] font-bold text-amber-900/60 uppercase tracking-widest leading-tight">
                      PHOTO
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 2. CENTER: CANDIDATE NAME, COURSE & DETAILS */}
            <div className="flex-1 text-center px-1">
              
              <p 
                className="italic text-[#475569] tracking-wide mb-0.5"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(9px, 1.15vw, 13px)' }}
              >
                This certificate is proudly presented to
              </p>

              {/* Recipient Name in Delicate Calligraphy Script */}
              <div className="my-0.5 relative py-1 px-4 sm:px-8 rounded-sm bg-gradient-to-r from-transparent via-[#f5edd8]/60 to-transparent border-y border-[#d4af37]/35 max-w-lg mx-auto">
                <div 
                  className="font-cursive capitalize select-none text-[#0c234b] leading-tight"
                  style={{ 
                    fontFamily: "'Great Vibes', cursive",
                    fontSize: 'clamp(30px, 4.2vw, 50px)',
                    fontWeight: 400
                  }}
                >
                  {studentName || 'Candidate Name'}
                </div>

                <div 
                  className="italic text-slate-600 leading-none mt-0.5"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(8px, 1vw, 11px)' }}
                >
                  has successfully completed
                </div>

                {/* Course Title */}
                <div 
                  className="font-extrabold uppercase tracking-wider text-[#8b6528] mt-1"
                  style={{ fontFamily: "'Cinzel', 'Outfit', sans-serif", fontSize: 'clamp(11px, 1.45vw, 16px)' }}
                >
                  {fullCourseTitle}
                </div>

                {/* Level Pill */}
                <div className="inline-block bg-[#0b2146] text-amber-300 font-bold px-3 py-0.5 rounded-sm text-[7px] sm:text-[8px] md:text-[9px] uppercase tracking-wider border border-amber-400/50 shadow-2xs mt-1">
                  {level || 'LEVEL 1'}
                </div>
              </div>

              {/* Fulfillment Text */}
              <p className="text-[6.5px] sm:text-[8px] md:text-[9px] text-slate-700 max-w-xl mx-auto leading-tight mt-1 font-medium">
                and has fulfilled the prescribed requirements for the successful completion of {level || 'Level 1'} of the programme with a grade of <strong className="text-slate-900 font-black">{grade || 'B'}</strong>.
              </p>
            </div>

            {/* 3. RIGHT: QR CODE BOX (Opposite to Name) */}
            <div className="shrink-0 flex flex-col items-center">
              <div className="w-[66px] h-[66px] sm:w-[76px] sm:h-[76px] md:w-[88px] md:h-[88px] bg-white border-2 border-[#c59b27] rounded-xs p-1 flex items-center justify-center relative shadow-2xs">
                <div className="absolute inset-[2px] border border-[#c59b27]/40 pointer-events-none"></div>
                {/* Scalable High-Precision Vector QR Code */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#0c234b]">
                  <rect x="5" y="5" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="5" />
                  <rect x="12" y="12" width="14" height="14" fill="currentColor" />

                  <rect x="67" y="5" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="5" />
                  <rect x="74" y="12" width="14" height="14" fill="currentColor" />

                  <rect x="5" y="67" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="5" />
                  <rect x="12" y="74" width="14" height="14" fill="currentColor" />

                  <rect x="42" y="8" width="6" height="6" fill="currentColor" />
                  <rect x="52" y="15" width="6" height="6" fill="currentColor" />
                  <rect x="40" y="24" width="6" height="6" fill="currentColor" />
                  <rect x="50" y="32" width="6" height="6" fill="currentColor" />

                  <rect x="8" y="42" width="6" height="6" fill="currentColor" />
                  <rect x="18" y="48" width="6" height="6" fill="currentColor" />
                  <rect x="28" y="40" width="6" height="6" fill="currentColor" />

                  <rect x="42" y="44" width="16" height="16" fill="currentColor" />
                  <rect x="45" y="47" width="10" height="10" fill="#ffffff" />
                  <rect x="48" y="50" width="4" height="4" fill="currentColor" />

                  <rect x="68" y="42" width="6" height="6" fill="currentColor" />
                  <rect x="78" y="48" width="6" height="6" fill="currentColor" />
                  <rect x="86" y="40" width="6" height="6" fill="currentColor" />

                  <rect x="42" y="68" width="6" height="6" fill="currentColor" />
                  <rect x="52" y="76" width="6" height="6" fill="currentColor" />
                  <rect x="40" y="84" width="6" height="6" fill="currentColor" />

                  <rect x="68" y="68" width="8" height="8" fill="currentColor" />
                  <rect x="82" y="72" width="8" height="8" fill="currentColor" />
                  <rect x="72" y="82" width="8" height="8" fill="currentColor" />
                  <rect x="84" y="84" width="8" height="8" fill="currentColor" />
                </svg>
              </div>
            </div>

          </div>

          {/* ----- SECTION D: 2-COLUMN INFORMATION TABLE (84% WIDTH, CENTERED) ----- */}
          <div className="w-[84%] mx-auto border border-[#c59b27] bg-white/85 rounded-xs shadow-2xs text-[6.5px] sm:text-[7.5px] md:text-[8.5px] px-3 sm:px-4 py-1.5 my-0.5">
            <div className="grid grid-cols-2 divide-x divide-[#c59b27]/60">
              
              {/* Left Column with perfectly aligned colons */}
              <div className="pr-3 sm:pr-4 space-y-0.5">
                <div className="flex items-baseline">
                  <span className="w-24 sm:w-28 md:w-32 shrink-0 font-medium text-slate-600">Registration No.</span>
                  <span className="font-bold text-slate-900">: {registrationNo}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="w-24 sm:w-28 md:w-32 shrink-0 font-medium text-slate-600">Certificate No.</span>
                  <span className="font-bold text-slate-900">: {certificateNo}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="w-24 sm:w-28 md:w-32 shrink-0 font-medium text-slate-600">Course</span>
                  <span className="font-bold text-slate-900 capitalize">: {courseName}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="w-24 sm:w-28 md:w-32 shrink-0 font-medium text-slate-600">Level</span>
                  <span className="font-bold text-slate-900">: {level}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="w-24 sm:w-28 md:w-32 shrink-0 font-medium text-slate-600">Duration</span>
                  <span className="font-bold text-slate-900">: {duration}</span>
                </div>
              </div>

              {/* Right Column with perfectly aligned colons */}
              <div className="pl-3 sm:pr-2 space-y-0.5">
                <div className="flex items-baseline">
                  <span className="w-32 sm:w-38 md:w-44 shrink-0 font-medium text-slate-600">Study / Examination Centre</span>
                  <span className="font-bold text-slate-900 truncate">: {centreName}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="w-32 sm:w-38 md:w-44 shrink-0 font-medium text-slate-600">Centre Code</span>
                  <span className="font-bold text-slate-900">: {centreCode}</span>
                </div>
                <div className="flex items-start">
                  <span className="w-32 sm:w-38 md:w-44 shrink-0 font-medium text-slate-600">Centre Address</span>
                  <span className="font-bold text-slate-900 leading-tight">
                    : {centreAddress}
                  </span>
                </div>
                <div className="flex items-baseline">
                  <span className="w-32 sm:w-38 md:w-44 shrink-0 font-medium text-slate-600">Date of Issue</span>
                  <span className="font-bold text-slate-900">: {issueDate}</span>
                </div>
              </div>

            </div>
          </div>

          {/* ----- SECTION E: SIGNATURES, GOLD MEDALLION SEAL & 4 BADGES ----- */}
          <div className="pt-0.5 pb-0.5">
            <div className="flex items-end justify-between px-3 sm:px-6 md:px-8">
              
              {/* Left Signatory: Centre Director (Realistic Cursive Ink Signature) */}
              <div className="text-center w-36 sm:w-44">
                <div className="h-6 sm:h-7 md:h-8 flex items-center justify-center">
                  <svg viewBox="0 0 160 50" className="w-28 sm:w-32 h-full text-slate-800">
                    <path 
                      d="M15 35 C 20 20, 25 10, 32 15 C 38 20, 30 40, 20 42 C 15 42, 28 35, 45 32 C 55 30, 65 34, 75 32 C 85 30, 95 32, 105 28 C 115 25, 125 32, 135 25 C 145 20, 150 15, 140 28 C 130 38, 50 48, 25 45" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                    <text x="50" y="30" fontFamily="'Great Vibes', cursive" fontSize="26" fill="currentColor">Sankar</text>
                  </svg>
                </div>
                {/* Gold-accented signature divider line */}
                <div className="relative w-full my-0.5">
                  <div className="w-full h-[1.5px] bg-[#c59b27]"></div>
                  <div className="absolute left-1/2 -top-[3px] -translate-x-1/2 w-1.5 h-1.5 bg-[#c59b27] rotate-45"></div>
                </div>
                <div className="text-[7.5px] sm:text-[9px] md:text-[10px] font-bold text-[#0c234b]">
                  Centre Director
                </div>
                <div className="text-[5.5px] sm:text-[6.5px] md:text-[7.5px] text-slate-500 capitalize">
                  {centreName || 'test branch'}
                </div>
              </div>

              {/* Center: Gold Star Rosette Seal & Circular Badges */}
              <div className="flex flex-col items-center">
                {/* 16-point Gold Rosette Embossed Seal */}
                <div className="relative w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 flex items-center justify-center -mb-0.5">
                  {/* Ribbon tails hanging below seal */}
                  <div className="absolute top-5 sm:top-6 w-7 sm:w-9 md:w-10 flex justify-between z-0">
                    <div className="w-3 sm:w-3.5 h-3.5 sm:h-4.5 bg-gradient-to-b from-amber-600 to-amber-700 rotate-[18deg] origin-top border-b-2 border-r border-amber-900 shadow-sm"
                         style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)' }}></div>
                    <div className="w-3 sm:w-3.5 h-3.5 sm:h-4.5 bg-gradient-to-b from-amber-600 to-amber-700 -rotate-[18deg] origin-top border-b-2 border-l border-amber-900 shadow-sm"
                         style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)' }}></div>
                  </div>

                  {/* Golden Rosette Disk */}
                  <div className="relative z-10 w-full h-full rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-0.5 shadow-lg border border-amber-200 flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 p-0.5 flex items-center justify-center">
                      <div className="w-full h-full rounded-full bg-[#0b2146] border border-amber-300 flex flex-col items-center justify-center text-center p-0.5">
                        <span className="text-[5px] sm:text-[6px] md:text-[6.5px] text-amber-300 font-extrabold uppercase tracking-wider leading-none">
                          ★ B★SEL ★
                        </span>
                        <span className="text-[3.5px] sm:text-[4.5px] md:text-[5px] text-white font-bold uppercase tracking-widest mt-0.5">
                          SEAL
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4 Official Verification Circular Badges in a Row */}
                <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5">
                  {/* Badge 1: ISO Certified */}
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 rounded-full bg-white border border-slate-300 p-0.5 shadow-2xs flex items-center justify-center" title="ISO 9001:2015 Quality Certified">
                    <svg viewBox="0 0 20 20" className="w-full h-full text-sky-700 fill-current">
                      <circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      <text x="10" y="11" textAnchor="middle" fontSize="5" fontWeight="bold">ISO</text>
                      <text x="10" y="15" textAnchor="middle" fontSize="3.5">9001</text>
                    </svg>
                  </div>

                  {/* Badge 2: Skill Assured */}
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 rounded-full bg-white border border-emerald-300 p-0.5 shadow-2xs flex items-center justify-center" title="Quality Skill Assured">
                    <svg viewBox="0 0 20 20" className="w-full h-full text-emerald-600 fill-current">
                      <circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="1 1" />
                      <path d="M6 10l3 3 5-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>

                  {/* Badge 3: B★SEL Registered Crest */}
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 rounded-full bg-[#0b2146] border border-amber-400 p-0.5 shadow-2xs flex items-center justify-center text-amber-300" title="B★SEL Registered Board">
                    <svg viewBox="0 0 20 20" className="w-full h-full text-amber-300 fill-current">
                      <polygon points="10,2 12,7 18,7 13,11 15,16 10,13 5,16 7,11 2,7 8,7" />
                    </svg>
                  </div>

                  {/* Badge 4: Govt/National Emblem */}
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 rounded-full bg-white border border-amber-400 p-0.5 shadow-2xs flex items-center justify-center" title="Govt Registered Emblem">
                    <svg viewBox="0 0 20 20" className="w-full h-full text-amber-700 fill-current">
                      <circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="10" cy="10" r="3" fill="currentColor" />
                      <line x1="10" y1="2" x2="10" y2="18" stroke="currentColor" strokeWidth="1" />
                      <line x1="2" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Right Signatory: Authorized Signatory (Realistic Cursive Ink Signature) */}
              <div className="text-center w-36 sm:w-44">
                <div className="h-6 sm:h-7 md:h-8 flex items-center justify-center">
                  <svg viewBox="0 0 160 50" className="w-28 sm:w-32 h-full text-slate-800">
                    <path 
                      d="M20 40 L 32 10 L 44 40 M 24 28 L 40 28 C 45 28, 52 35, 60 30 C 68 25, 68 40, 75 32 C 85 25, 92 38, 102 30 C 110 24, 118 36, 128 32 C 138 28, 148 20, 155 35" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                    <text x="45" y="32" fontFamily="'Great Vibes', cursive" fontSize="26" fill="currentColor">Ashwini</text>
                  </svg>
                </div>
                {/* Gold-accented signature divider line */}
                <div className="relative w-full my-0.5">
                  <div className="w-full h-[1.5px] bg-[#c59b27]"></div>
                  <div className="absolute left-1/2 -top-[3px] -translate-x-1/2 w-1.5 h-1.5 bg-[#c59b27] rotate-45"></div>
                </div>
                <div className="text-[7.5px] sm:text-[9px] md:text-[10px] font-bold text-[#0c234b]">
                  Authorized Signatory
                </div>
                <div className="text-[5.5px] sm:text-[6.5px] md:text-[7.5px] text-slate-500">
                  Board of Skills and Educational Learning
                </div>
              </div>

            </div>
          </div>

        </div>
        </div>
      </div>
    </div>
  );
}