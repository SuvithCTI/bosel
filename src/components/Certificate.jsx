import React, { useRef, useState } from 'react';
import { Upload, Download, Loader2, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import risingStarsEmblem from '../assets/rising_stars_emblem.png';

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

        {/* 4 Corner Medallions (Dark Navy Square with Gold Floral Rosette) */}
        {/* Top-Left */}
        <div className="absolute top-0 left-0 w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13 bg-[#081d3d] border-2 border-[#c59b27] z-30 flex items-center justify-center shadow-md">
          <svg viewBox="0 0 40 40" className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 text-[#c59b27]" fill="none" stroke="currentColor">
            <circle cx="20" cy="20" r="17.5" strokeWidth="1.5" />
            <circle cx="20" cy="20" r="14.5" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
            <circle cx="20" cy="20" r="12" strokeWidth="1" />
            <g fill="#c59b27" stroke="none">
              <path d="M20,8 C22,12 22,14 20,16 C18,14 18,12 20,8 Z" />
              <path d="M20,32 C22,28 22,26 20,24 C18,26 18,28 20,32 Z" />
              <path d="M8,20 C12,22 14,22 16,20 C14,18 12,18 8,20 Z" />
              <path d="M32,20 C28,22 26,22 24,20 C26,18 28,18 32,20 Z" />
              <path d="M11.5,11.5 C14.5,13.5 15.5,15 14.5,16 C13.5,15.5 12,14.5 11.5,11.5 Z" />
              <path d="M28.5,11.5 C25.5,13.5 24.5,15 25.5,16 C26.5,15.5 28,14.5 28.5,11.5 Z" />
              <path d="M11.5,28.5 C14.5,26.5 15.5,25 14.5,24 C13.5,24.5 12,25.5 11.5,28.5 Z" />
              <path d="M28.5,28.5 C25.5,26.5 24.5,25 25.5,24 C26.5,24.5 28,25.5 28.5,28.5 Z" />
            </g>
            <circle cx="20" cy="20" r="4.5" fill="#081d3d" stroke="#c59b27" strokeWidth="1.2" />
            <circle cx="20" cy="20" r="2" fill="#c59b27" />
          </svg>
        </div>

        {/* Top-Right */}
        <div className="absolute top-0 right-0 w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13 bg-[#081d3d] border-2 border-[#c59b27] z-30 flex items-center justify-center shadow-md">
          <svg viewBox="0 0 40 40" className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 text-[#c59b27]" fill="none" stroke="currentColor">
            <circle cx="20" cy="20" r="17.5" strokeWidth="1.5" />
            <circle cx="20" cy="20" r="14.5" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
            <circle cx="20" cy="20" r="12" strokeWidth="1" />
            <g fill="#c59b27" stroke="none">
              <path d="M20,8 C22,12 22,14 20,16 C18,14 18,12 20,8 Z" />
              <path d="M20,32 C22,28 22,26 20,24 C18,26 18,28 20,32 Z" />
              <path d="M8,20 C12,22 14,22 16,20 C14,18 12,18 8,20 Z" />
              <path d="M32,20 C28,22 26,22 24,20 C26,18 28,18 32,20 Z" />
              <path d="M11.5,11.5 C14.5,13.5 15.5,15 14.5,16 C13.5,15.5 12,14.5 11.5,11.5 Z" />
              <path d="M28.5,11.5 C25.5,13.5 24.5,15 25.5,16 C26.5,15.5 28,14.5 28.5,11.5 Z" />
              <path d="M11.5,28.5 C14.5,26.5 15.5,25 14.5,24 C13.5,24.5 12,25.5 11.5,28.5 Z" />
              <path d="M28.5,28.5 C25.5,26.5 24.5,25 25.5,24 C26.5,24.5 28,25.5 28.5,28.5 Z" />
            </g>
            <circle cx="20" cy="20" r="4.5" fill="#081d3d" stroke="#c59b27" strokeWidth="1.2" />
            <circle cx="20" cy="20" r="2" fill="#c59b27" />
          </svg>
        </div>

        {/* Bottom-Left */}
        <div className="absolute bottom-0 left-0 w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13 bg-[#081d3d] border-2 border-[#c59b27] z-30 flex items-center justify-center shadow-md">
          <svg viewBox="0 0 40 40" className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 text-[#c59b27]" fill="none" stroke="currentColor">
            <circle cx="20" cy="20" r="17.5" strokeWidth="1.5" />
            <circle cx="20" cy="20" r="14.5" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
            <circle cx="20" cy="20" r="12" strokeWidth="1" />
            <g fill="#c59b27" stroke="none">
              <path d="M20,8 C22,12 22,14 20,16 C18,14 18,12 20,8 Z" />
              <path d="M20,32 C22,28 22,26 20,24 C18,26 18,28 20,32 Z" />
              <path d="M8,20 C12,22 14,22 16,20 C14,18 12,18 8,20 Z" />
              <path d="M32,20 C28,22 26,22 24,20 C26,18 28,18 32,20 Z" />
              <path d="M11.5,11.5 C14.5,13.5 15.5,15 14.5,16 C13.5,15.5 12,14.5 11.5,11.5 Z" />
              <path d="M28.5,11.5 C25.5,13.5 24.5,15 25.5,16 C26.5,15.5 28,14.5 28.5,11.5 Z" />
              <path d="M11.5,28.5 C14.5,26.5 15.5,25 14.5,24 C13.5,24.5 12,25.5 11.5,28.5 Z" />
              <path d="M28.5,28.5 C25.5,26.5 24.5,25 25.5,24 C26.5,24.5 28,25.5 28.5,28.5 Z" />
            </g>
            <circle cx="20" cy="20" r="4.5" fill="#081d3d" stroke="#c59b27" strokeWidth="1.2" />
            <circle cx="20" cy="20" r="2" fill="#c59b27" />
          </svg>
        </div>

        {/* Bottom-Right */}
        <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13 bg-[#081d3d] border-2 border-[#c59b27] z-30 flex items-center justify-center shadow-md">
          <svg viewBox="0 0 40 40" className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 text-[#c59b27]" fill="none" stroke="currentColor">
            <circle cx="20" cy="20" r="17.5" strokeWidth="1.5" />
            <circle cx="20" cy="20" r="14.5" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
            <circle cx="20" cy="20" r="12" strokeWidth="1" />
            <g fill="#c59b27" stroke="none">
              <path d="M20,8 C22,12 22,14 20,16 C18,14 18,12 20,8 Z" />
              <path d="M20,32 C22,28 22,26 20,24 C18,26 18,28 20,32 Z" />
              <path d="M8,20 C12,22 14,22 16,20 C14,18 12,18 8,20 Z" />
              <path d="M32,20 C28,22 26,22 24,20 C26,18 28,18 32,20 Z" />
              <path d="M11.5,11.5 C14.5,13.5 15.5,15 14.5,16 C13.5,15.5 12,14.5 11.5,11.5 Z" />
              <path d="M28.5,11.5 C25.5,13.5 24.5,15 25.5,16 C26.5,15.5 28,14.5 28.5,11.5 Z" />
              <path d="M11.5,28.5 C14.5,26.5 15.5,25 14.5,24 C13.5,24.5 12,25.5 11.5,28.5 Z" />
              <path d="M28.5,28.5 C25.5,26.5 24.5,25 25.5,24 C26.5,24.5 28,25.5 28.5,28.5 Z" />
            </g>
            <circle cx="20" cy="20" r="4.5" fill="#081d3d" stroke="#c59b27" strokeWidth="1.2" />
            <circle cx="20" cy="20" r="2" fill="#c59b27" />
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

        {/* Background Guilloche Radial Starburst Centered behind Recipient Block */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.045] z-0">
          <svg viewBox="0 0 600 600" className="w-[520px] h-[520px] text-amber-800" fill="none" stroke="currentColor">
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
          
          {/* ----- SECTION A: TOP HEADER & CONTACT STRIP (Faithful to Official Spec) ----- */}
          <div className="w-full">
            {/* Top Accent Line with Delicate Golden Pins */}
            <div className="relative w-full flex items-center justify-between mb-0.5 px-2 sm:px-4 opacity-80 pointer-events-none select-none">
              {/* Left Pin above B★SEL */}
              <div className="flex items-center gap-0.5 pl-8 sm:pl-12">
                <div className="h-[1px] w-8 sm:w-14 bg-[#c59b27]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#c59b27]"></div>
              </div>

              {/* Right Pin above Rising Stars */}
              <div className="flex items-center gap-0.5 pr-8 sm:pr-12">
                <div className="w-1.5 h-1.5 rounded-full bg-[#c59b27]"></div>
                <div className="h-[1px] w-8 sm:w-14 bg-[#c59b27]"></div>
              </div>
            </div>

            {/* Main Logos & Plaque Row */}
            <div className="flex items-center justify-between gap-1 sm:gap-2 px-1 sm:px-2 pt-0.5">
              
              {/* 1. LEFT: B★SEL Official Typography */}
              <div className="flex flex-col text-left justify-center shrink-0 select-none">
                <div 
                  className="font-extrabold tracking-widest text-[#0c234b] flex items-center gap-0.5 sm:gap-1 leading-none"
                  style={{ fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif", fontSize: 'clamp(20px, 2.7vw, 32px)' }}
                >
                  <span className="font-bold">B</span>
                  <span className="text-[#c59b27] font-black text-[1.15em] inline-block -translate-y-[1px]">★</span>
                  <span className="font-bold">SEL</span>
                </div>
                <span 
                  className="text-[5.5px] sm:text-[7px] md:text-[8px] font-bold uppercase tracking-[0.06em] text-[#0c234b] mt-1 whitespace-nowrap"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  BOARD OF SKILLS AND EDUCATIONAL LEARNING
                </span>
              </div>

              {/* 2. CENTER: Official Deep Navy Plaque with Double Gold Border */}
              <div className="relative shrink-0 mx-1 sm:mx-2 my-0.5 bg-[#081d3d] text-white px-3 sm:px-6 md:px-8 py-1.5 sm:py-2 rounded-xl border-2 border-[#c59b27] shadow-[0_3px_10px_rgba(8,29,61,0.25)] text-center min-w-[190px] sm:min-w-[270px] md:min-w-[340px]">
                {/* Inner Thin Gold Inset Frame */}
                <div className="absolute inset-[2.5px] border border-[#c59b27]/85 rounded-[9px] pointer-events-none"></div>
                
                <div 
                  className="font-extrabold tracking-[0.14em] leading-tight text-white uppercase select-none"
                  style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(7.5px, 1.05vw, 12px)' }}
                >
                  BOARD OF SKILLS AND
                </div>
                <div 
                  className="font-extrabold tracking-[0.14em] leading-tight text-white uppercase mt-0.5 select-none"
                  style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(7.5px, 1.05vw, 12px)' }}
                >
                  EDUCATIONAL LEARNING
                </div>
                <div 
                  className="font-extrabold tracking-[0.2em] text-[#f0bc4e] mt-0.5 uppercase select-none"
                  style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(6.5px, 0.9vw, 10px)' }}
                >
                  ( B SEL )
                </div>
              </div>

              {/* 3. RIGHT: Rising Stars Vision Foundation Official Emblem & Typography */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 text-left shrink-0 select-none">
                {/* Official Rising Stars Emblem */}
                <img 
                  src={risingStarsEmblem} 
                  alt="Rising Stars Vision Foundation" 
                  className="h-10 sm:h-12 md:h-14 w-auto object-contain shrink-0 drop-shadow-xs"
                  loading="eager"
                />

                <div className="flex flex-col text-left justify-center">
                  <div 
                    className="font-extrabold text-[#0c234b] tracking-[0.08em] uppercase leading-none whitespace-nowrap"
                    style={{ fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif", fontSize: 'clamp(10px, 1.35vw, 15px)' }}
                  >
                    RISING STARS
                  </div>
                  <div 
                    className="font-bold text-[#0c234b] tracking-[0.06em] uppercase leading-tight mt-0.5 whitespace-nowrap"
                    style={{ fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif", fontSize: 'clamp(7.5px, 1vw, 11px)' }}
                  >
                    VISION FOUNDATION
                  </div>
                  <div 
                    className="font-bold text-[#b88628] tracking-[0.12em] uppercase mt-0.5 whitespace-nowrap"
                    style={{ fontFamily: "'Cinzel', 'Outfit', sans-serif", fontSize: 'clamp(5px, 0.68vw, 7.5px)' }}
                  >
                    EDUCATION &nbsp;|&nbsp; EMPOWERMENT &nbsp;|&nbsp; EXCELLENCE
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Header Contact Bar with Pure Gold Dividers & Warm Gold Typography */}
            <div className="mt-1.5 sm:mt-2 bg-[#081d3d] text-[#f0bc4e] py-1 px-3 sm:px-4 border-y-[1.5px] border-[#c59b27] flex items-center justify-between text-[6.5px] sm:text-[7.5px] md:text-[8.5px] font-bold tracking-wider select-none shadow-xs">
              
              {/* Item 1: Head Office */}
              <div className="flex items-center gap-1.5 flex-1 justify-center sm:justify-start">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f0bc4e] shrink-0"></span>
                <span className="uppercase tracking-[0.08em] whitespace-nowrap">
                  HEAD OFFICE: TENKASI, TAMIL NADU, INDIA
                </span>
              </div>

              {/* Vertical Gold Divider 1 */}
              <div className="h-3 sm:h-3.5 w-[1px] bg-[#c59b27] mx-2 shrink-0"></div>

              {/* Item 2: Phone */}
              <div className="flex items-center gap-1.5 shrink-0 justify-center">
                {/* Telephone Icon */}
                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#f0bc4e] shrink-0 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.44-5.15-3.75-6.59-6.59l1.97-1.57c.28-.28.37-.68.25-1.02A11.36 11.36 0 018.57 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.62c0-.55-.45-1-1-1z"/>
                </svg>
                <span className="tracking-[0.1em] font-mono">9865219131</span>
              </div>

              {/* Vertical Gold Divider 2 */}
              <div className="h-3 sm:h-3.5 w-[1px] bg-[#c59b27] mx-2 shrink-0"></div>

              {/* Item 3: Email */}
              <div className="flex items-center gap-1.5 flex-1 justify-center sm:justify-end">
                {/* Envelope Icon */}
                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#f0bc4e] shrink-0 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <span className="tracking-[0.05em] font-medium lowercase">bsel.mindsparc@gmail.com</span>
              </div>
            </div>
          </div>

          {/* ----- SECTION B: TITLE (DOUBLE GOLD FLANKING LINES & DIAMOND FINIALS) ----- */}
          <div className="my-1 sm:my-1.5">
            <div className="flex items-center justify-center gap-2 sm:gap-4 select-none">
              {/* Left Double Gold Line with Diamond Tip */}
              <div className="flex items-center gap-1 shrink">
                <div className="flex flex-col gap-[3px]">
                  <div className="h-[1px] w-10 sm:w-20 md:w-28 bg-[#c59b27]"></div>
                  <div className="h-[1px] w-10 sm:w-20 md:w-28 bg-[#c59b27]"></div>
                </div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#c59b27] rotate-45 shrink-0"></div>
              </div>

              {/* Title Text */}
              <h2 
                className="font-black uppercase text-[#0c234b] tracking-[0.16em] whitespace-nowrap select-none"
                style={{ 
                  fontFamily: "'Cinzel', serif", 
                  fontSize: 'clamp(14px, 2.1vw, 24px)',
                  letterSpacing: '0.15em'
                }}
              >
                CERTIFICATE OF {certificateType}
              </h2>

              {/* Right Double Gold Line with Diamond Tip */}
              <div className="flex items-center gap-1 shrink">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#c59b27] rotate-45 shrink-0"></div>
                <div className="flex flex-col gap-[3px]">
                  <div className="h-[1px] w-10 sm:w-20 md:w-28 bg-[#c59b27]"></div>
                  <div className="h-[1px] w-10 sm:w-20 md:w-28 bg-[#c59b27]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* ----- SECTION C: MIDDLE ROW (PHOTO ON LEFT, CANDIDATE DETAILS IN CENTER, QR ON RIGHT) ----- */}
          <div className="flex items-center justify-between gap-2 sm:gap-4 my-0.5 sm:my-1 px-1 sm:px-2 relative">
            
            {/* 1. LEFT: STUDENT PHOTO BOX (Double Border: Gold Outer + Navy Inner) */}
            <div className="shrink-0 flex flex-col items-center">
              <div 
                onClick={() => onPhotoUpload && fileInputRef.current?.click()}
                className={`w-[70px] h-[88px] sm:w-[82px] sm:h-[104px] md:w-[94px] md:h-[120px] bg-[#faf7ee] border-2 border-[#c59b27] p-[3px] rounded-xs flex flex-col items-center justify-center relative shadow-xs ${
                  onPhotoUpload ? 'cursor-pointer hover:border-amber-500 transition' : ''
                }`}
                title={onPhotoUpload ? 'Click to upload/change photo' : 'Student Photo Box'}
              >
                {/* Inner Navy Border Frame */}
                <div className="w-full h-full border border-[#0c234b] rounded-2xs flex flex-col items-center justify-center overflow-hidden bg-[#faf7ee]">
                  {studentPhoto ? (
                    <img 
                      src={studentPhoto} 
                      alt="Student" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-1 select-none flex flex-col items-center justify-center">
                      <span className="block text-[6.5px] sm:text-[7.5px] md:text-[8.5px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
                        STUDENT
                      </span>
                      <span className="block text-[6.5px] sm:text-[7.5px] md:text-[8.5px] font-bold text-slate-400 uppercase tracking-widest leading-tight mt-0.5">
                        PHOTO
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. CENTER: CANDIDATE NAME, COURSE & DETAILS */}
            <div className="flex-1 text-center px-1 max-w-xl mx-auto flex flex-col items-center justify-center">
              
              {/* Introduction Line */}
              <p 
                className="italic text-slate-600 tracking-wide mb-0.5 select-none"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(9.5px, 1.2vw, 13.5px)' }}
              >
                This certificate is proudly presented to
              </p>

              {/* Recipient Name in Elegant Italic Serif */}
              <div className="my-0.5 select-none w-full">
                <div 
                  className="capitalize text-[#0c234b] leading-tight font-serif italic"
                  style={{ 
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 'clamp(26px, 3.8vw, 46px)',
                    fontWeight: 600,
                    fontStyle: 'italic',
                    letterSpacing: '0.02em'
                  }}
                >
                  {studentName || 'Candidate Name'}
                </div>

                {/* Delicate Underline Ornament with Gold Central Medallion */}
                <div className="flex items-center justify-center my-0.5 w-full max-w-[280px] sm:max-w-[340px] md:max-w-[400px] mx-auto">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#c59b27] to-[#c59b27]"></div>
                  <div className="mx-2 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#c59b27]" fill="currentColor">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="1.5 1.5" />
                      <polygon points="12,4 14,10 20,12 14,14 12,20 10,14 4,12 10,10" fill="#c59b27" />
                      <circle cx="12" cy="12" r="2.5" fill="#faf7ee" stroke="#c59b27" strokeWidth="0.8" />
                    </svg>
                  </div>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#c59b27] to-[#c59b27]"></div>
                </div>
              </div>

              {/* "has successfully completed" Line */}
              <div 
                className="italic text-slate-600 leading-none mt-0.5 select-none"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(8.5px, 1.05vw, 12px)' }}
              >
                has successfully completed
              </div>

              {/* Course Title in Rich Golden Bronze */}
              <div 
                className="font-black uppercase tracking-[0.14em] text-[#967228] mt-1 select-none"
                style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(13px, 1.75vw, 22px)' }}
              >
                {fullCourseTitle}
              </div>

              {/* Level Capsule Badge with Flanking Gold Line Accents */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 my-1 select-none">
                {/* Left Pin Accent */}
                <div className="h-[1px] w-8 sm:w-14 md:w-18 bg-[#c59b27] relative">
                  <div className="absolute right-0 -top-[2.5px] w-1.5 h-1.5 bg-[#c59b27] rotate-45"></div>
                </div>

                {/* Navy Capsule Pill */}
                <div className="bg-[#081d3d] text-[#f0bc4e] font-extrabold px-5 sm:px-7 py-0.5 rounded-full text-[7.5px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.2em] border border-[#c59b27]/80 shadow-xs">
                  {level || 'LEVEL 1'}
                </div>

                {/* Right Pin Accent */}
                <div className="h-[1px] w-8 sm:w-14 md:w-18 bg-[#c59b27] relative">
                  <div className="absolute left-0 -top-[2.5px] w-1.5 h-1.5 bg-[#c59b27] rotate-45"></div>
                </div>
              </div>

              {/* Fulfillment Text */}
              <p 
                className="text-slate-700 max-w-xl mx-auto leading-relaxed mt-0.5 font-normal select-none"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(7.5px, 0.95vw, 11px)' }}
              >
                and has fulfilled the prescribed requirements for the successful completion of <strong className="font-bold text-[#0c234b]">{level || 'Level 1'}</strong> of the programme with a grade of <strong className="font-bold text-[#0c234b]">{grade || 'B'}</strong>.
              </p>
            </div>

            {/* 3. RIGHT: QR CODE BOX (Gold Framed White Box with Authentic Vector QR) */}
            <div className="shrink-0 flex flex-col items-center">
              <div className="w-[70px] h-[70px] sm:w-[82px] sm:h-[82px] md:w-[94px] md:h-[94px] bg-white border-2 border-[#c59b27] p-1.5 rounded-xs flex items-center justify-center relative shadow-xs">
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

          {/* ----- SECTION D: 2-COLUMN INFORMATION TABLE WITH CENTRAL DIAMOND DIVIDER ----- */}
          <div className="w-[88%] sm:w-[86%] md:w-[84%] mx-auto border border-[#c59b27] bg-[#fdfbf7]/95 rounded-xs shadow-2xs text-[6.5px] sm:text-[7.5px] md:text-[8.5px] px-3 sm:px-5 py-2 my-0.5 sm:my-1 select-none">
            <div className="grid grid-cols-2 relative">
              
              {/* Left Column with perfectly aligned colons */}
              <div className="pr-3 sm:pr-5 space-y-0.5 sm:space-y-1">
                <div className="flex items-baseline">
                  <span className="w-24 sm:w-28 md:w-32 shrink-0 font-bold text-[#0c234b]">Registration No.</span>
                  <span className="font-semibold text-slate-800">: {registrationNo}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="w-24 sm:w-28 md:w-32 shrink-0 font-bold text-[#0c234b]">Certificate No.</span>
                  <span className="font-semibold text-slate-800">: {certificateNo}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="w-24 sm:w-28 md:w-32 shrink-0 font-bold text-[#0c234b]">Course</span>
                  <span className="font-semibold text-slate-800 capitalize">: {courseName}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="w-24 sm:w-28 md:w-32 shrink-0 font-bold text-[#0c234b]">Level</span>
                  <span className="font-semibold text-slate-800">: {level}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="w-24 sm:w-28 md:w-32 shrink-0 font-bold text-[#0c234b]">Duration</span>
                  <span className="font-semibold text-slate-800">: {duration}</span>
                </div>
              </div>

              {/* Vertical Gold Divider with Central Diamond Finial */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-[#c59b27]/70 flex items-center justify-center">
                <div className="w-2 h-2 bg-[#c59b27] rotate-45 shadow-xs"></div>
              </div>

              {/* Right Column with perfectly aligned colons */}
              <div className="pl-3 sm:pl-5 space-y-0.5 sm:space-y-1">
                <div className="flex items-baseline">
                  <span className="w-34 sm:w-40 md:w-46 shrink-0 font-bold text-[#0c234b]">Study / Examination Centre</span>
                  <span className="font-semibold text-slate-800 truncate">: {centreName}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="w-34 sm:w-40 md:w-46 shrink-0 font-bold text-[#0c234b]">Centre Code</span>
                  <span className="font-semibold text-slate-800">: {centreCode}</span>
                </div>
                <div className="flex items-start">
                  <span className="w-34 sm:w-40 md:w-46 shrink-0 font-bold text-[#0c234b]">Centre Address</span>
                  <span className="font-semibold text-slate-800 leading-tight">
                    : {centreAddress}
                  </span>
                </div>
                <div className="flex items-baseline pt-0.5">
                  <span className="w-34 sm:w-40 md:w-46 shrink-0 font-bold text-[#0c234b]">Date of Issue</span>
                  <span className="font-semibold text-slate-800">: {issueDate}</span>
                </div>
              </div>

            </div>
          </div>

          {/* ----- SECTION E: PURE VECTOR CODE: SIGNATURES, GOLD MEDALLION SEAL & 4 BADGES ----- */}
          <div className="pt-0.5 pb-0.5 w-full">
            <div className="flex items-end justify-between px-3 sm:px-6 md:px-8">
              
              {/* Left Signatory: Centre Director (100% Vector SVG Signature) */}
              <div className="text-center w-36 sm:w-44 md:w-48 flex flex-col items-center">
                {/* Pure Vector Signature: Sankar */}
                <div className="h-7 sm:h-9 md:h-10 flex items-end justify-center mb-0.5">
                  <svg viewBox="0 0 113 42" className="h-full w-auto text-slate-900 fill-current select-none filter drop-shadow-2xs">
                    <path d="M 41 37 L 39 39 L 37 39 L 35 41 L 33 41 L 35 41 L 36 40 L 39 40 L 44 37 Z M 7 37 L 4 41 L 6 41 Z M 14 33 L 12 35 L 10 35 L 12 35 Z M 60 32 L 58 34 L 53 35 L 57 35 L 59 33 L 62 32 Z M 25 28 L 23 29 L 21 31 L 19 31 L 21 31 L 22 30 L 27 29 Z M 20 13 L 19 16 L 20 18 L 22 18 L 24 20 L 32 21 L 36 23 L 38 25 L 40 28 L 40 30 L 37 33 L 37 34 L 35 36 L 33 37 L 31 37 L 28 40 L 26 41 L 23 41 L 26 41 L 30 40 L 33 38 L 36 36 L 43 30 L 46 31 L 53 29 L 51 26 L 48 25 L 46 27 L 43 27 L 40 24 L 37 22 L 34 22 L 26 18 L 23 18 L 21 16 L 22 13 Z M 27 9 L 25 10 L 24 12 L 26 11 L 29 9 Z M 76 6 L 75 8 L 74 10 L 73 14 L 70 20 L 68 22 L 68 23 L 67 24 L 65 25 L 63 25 L 61 24 L 55 26 L 55 28 L 59 28 L 61 26 L 64 27 L 65 26 L 68 27 L 66 31 L 69 31 L 69 28 L 71 26 L 78 26 L 84 24 L 86 24 L 87 25 L 89 25 L 91 23 L 93 22 L 96 23 L 96 24 L 101 25 L 103 24 L 101 24 L 100 23 L 97 22 L 97 20 L 93 19 L 93 21 L 91 23 L 89 23 L 87 21 L 84 21 L 82 22 L 78 25 L 73 24 L 74 22 L 75 21 L 78 20 L 77 17 L 74 16 L 74 14 L 79 7 L 80 5 L 80 3 Z M 42 2 L 39 3 L 37 4 L 35 6 L 32 7 L 35 7 L 40 4 L 43 4 L 47 2 L 49 5 L 43 10 L 46 9 L 50 5 L 49 2 L 48 2 Z" />
                  </svg>
                </div>
                {/* Gold-accented signature divider line with central diamond */}
                <div className="relative w-full my-0.5 sm:my-1">
                  <div className="w-full h-[1.5px] bg-[#c59b27]"></div>
                  <div className="absolute left-1/2 -top-[3.5px] -translate-x-1/2 w-2 h-2 bg-[#c59b27] rotate-45 shadow-xs"></div>
                </div>
                <div 
                  className="font-bold text-[#0c234b] leading-tight select-none uppercase tracking-[0.06em]"
                  style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(8px, 1.1vw, 12px)' }}
                >
                  Centre Director
                </div>
                <div className="text-[6px] sm:text-[7.5px] md:text-[8.5px] text-slate-500 capitalize select-none mt-0.5 font-medium">
                  {centreName || 'MGHSS'}
                </div>
              </div>

              {/* Center: Official Gold Ribbon Seal & 4 Accreditation Badges (100% Vector Code) */}
              <div className="flex flex-col items-center justify-end select-none px-2">
                {/* Official Gold Rosette Ribbon Medal */}
                <div className="relative flex flex-col items-center -mb-1">
                  <svg viewBox="0 0 100 120" className="w-14 h-17 sm:w-16 sm:h-19 md:w-20 md:h-24 select-none filter drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="sealGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="25%" stopColor="#d4af37" />
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="75%" stopColor="#b45309" />
                        <stop offset="100%" stopColor="#fef08a" />
                      </linearGradient>
                      <path id="sealArcTop" d="M 23 42 A 27 27 0 0 1 77 42" fill="none" />
                      <path id="sealArcBot" d="M 33 46 A 17 17 0 0 0 67 46" fill="none" />
                    </defs>

                    {/* Navy Ribbon Tails */}
                    <g>
                      <path d="M40 50 L28 92 L40 85 L48 92 L46 50 Z" fill="#081d3d" stroke="#c59b27" strokeWidth="1" />
                      <path d="M34 52 L30 87 L37 83 L40 52 Z" fill="#0c234b" />
                      
                      <path d="M60 50 L52 92 L60 85 L72 92 L62 50 Z" fill="#081d3d" stroke="#c59b27" strokeWidth="1" />
                      <path d="M62 52 L65 83 L70 87 L66 52 Z" fill="#0c234b" />
                    </g>

                    {/* 32-Scallop Golden Medal Rim */}
                    <polygon 
                      points="88.0,42.0 84.8,45.4 87.3,49.4 83.5,52.2 85.1,56.5 80.9,58.5 81.6,63.1 77.1,64.2 76.9,68.9 72.2,69.1 71.1,73.6 66.5,72.9 64.5,77.1 60.2,75.5 57.4,79.3 53.4,76.8 50.0,80.0 46.6,76.8 42.6,79.3 39.8,75.5 35.5,77.1 33.5,72.9 28.9,73.6 27.8,69.1 23.1,68.9 22.9,64.2 18.4,63.1 19.1,58.5 14.9,56.5 16.5,52.2 12.7,49.4 15.2,45.4 12.0,42.0 15.2,38.6 12.7,34.6 16.5,31.8 14.9,27.5 19.1,25.5 18.4,20.9 22.9,19.8 23.1,15.1 27.8,14.9 28.9,10.4 33.5,11.1 35.5,6.9 39.8,8.5 42.6,4.7 46.6,7.2 50.0,4.0 53.4,7.2 57.4,4.7 60.2,8.5 64.5,6.9 66.5,11.1 71.1,10.4 72.2,14.9 76.9,15.1 77.1,19.8 81.6,20.9 80.9,25.5 85.1,27.5 83.5,31.8 87.3,34.6 84.8,38.6" 
                      fill="url(#sealGoldGrad)" 
                      stroke="#92400e" 
                      strokeWidth="0.8" 
                    />

                    {/* Concentric Gold Rings */}
                    <circle cx="50" cy="42" r="32" fill="#d97706" stroke="#fde047" strokeWidth="0.8" />
                    <circle cx="50" cy="42" r="30" fill="none" stroke="#78350f" strokeWidth="0.5" />

                    {/* Top Arc Inscription */}
                    <text fill="#ffffff" fontSize="3.6" fontFamily="'Cinzel', serif" fontWeight="800" letterSpacing="0.04em">
                      <textPath href="#sealArcTop" startOffset="50%" textAnchor="middle">
                        BOARD OF SKILLS AND EDUCATIONAL LEARNING
                      </textPath>
                    </text>

                    {/* Deep Navy Inner Core */}
                    <circle cx="50" cy="42" r="21" fill="#081d3d" stroke="#fef08a" strokeWidth="1.2" />
                    <circle cx="50" cy="42" r="19" fill="none" stroke="#d4af37" strokeWidth="0.6" strokeDasharray="1.2 1.2" />

                    {/* Central Gold Star */}
                    <polygon 
                      points="50,28 52.2,34 58.5,34 53.5,38 55.5,44 50,40.5 44.5,44 46.5,38 41.5,34 47.8,34" 
                      fill="#facc15" 
                      stroke="#ca8a04" 
                      strokeWidth="0.4" 
                    />

                    {/* BSEL Centered Text */}
                    <text x="50" y="49" textAnchor="middle" fill="#ffffff" fontFamily="'Cinzel', serif" fontWeight="800" fontSize="6.5" letterSpacing="0.08em">
                      BSEL
                    </text>

                    {/* Bottom Arc Inscription */}
                    <text fill="#fde047" fontSize="2.8" fontWeight="bold">
                      <textPath href="#sealArcBot" startOffset="50%" textAnchor="middle">
                        LEARN • GROW • ACHIEVE
                      </textPath>
                    </text>
                  </svg>
                </div>

                {/* 4 Official Verification Circular Badges in a Row (100% Vector Code) */}
                <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5">
                  {/* Badge 1: ISO 9001 Quality Certified */}
                  <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-white border border-[#c59b27] shadow-2xs flex items-center justify-center p-0.5">
                    <svg viewBox="0 0 30 30" className="w-full h-full">
                      <circle cx="15" cy="15" r="13.5" fill="#ffffff" stroke="#c59b27" strokeWidth="1" />
                      <circle cx="15" cy="15" r="11" fill="none" stroke="#0284c7" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
                      <text x="15" y="13" textAnchor="middle" fontSize="5.5" fontWeight="900" fill="#0369a1">ISO</text>
                      <text x="15" y="20" textAnchor="middle" fontSize="4.5" fontWeight="bold" fill="#0369a1">9001</text>
                    </svg>
                  </div>

                  {/* Badge 2: Skill Mission / Accreditation */}
                  <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-white border border-[#c59b27] shadow-2xs flex items-center justify-center p-0.5">
                    <svg viewBox="0 0 30 30" className="w-full h-full">
                      <circle cx="15" cy="15" r="13.5" fill="#ffffff" stroke="#c59b27" strokeWidth="1" />
                      <path d="M 5 15 A 10 10 0 0 1 25 15" fill="none" stroke="#16a34a" strokeWidth="2.5" />
                      <path d="M 5 15 A 10 10 0 0 0 25 15" fill="none" stroke="#db2777" strokeWidth="2.5" />
                      <text x="15" y="14" textAnchor="middle" fontSize="3.8" fontWeight="bold" fill="#15803d">SKILL</text>
                      <text x="15" y="19" textAnchor="middle" fontSize="3.2" fontWeight="bold" fill="#081d3d">INDIA</text>
                    </svg>
                  </div>

                  {/* Badge 3: B★SEL Registered Board Stamp */}
                  <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-white border border-[#0284c7] shadow-2xs flex items-center justify-center p-0.5">
                    <svg viewBox="0 0 30 30" className="w-full h-full">
                      <circle cx="15" cy="15" r="13.5" fill="#ffffff" stroke="#0284c7" strokeWidth="1" />
                      <circle cx="15" cy="15" r="11" fill="none" stroke="#0369a1" strokeWidth="0.6" strokeDasharray="1.2 1.2" />
                      <text x="15" y="17" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#0369a1" fontFamily="'Cinzel', serif">B★SEL</text>
                    </svg>
                  </div>

                  {/* Badge 4: Government Recognition Emblem (MSME / Ashoka Emblem) */}
                  <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-white border border-[#c59b27] shadow-2xs flex items-center justify-center p-0.5">
                    <svg viewBox="0 0 30 30" className="w-full h-full text-[#92400e]">
                      <circle cx="15" cy="15" r="13.5" fill="#ffffff" stroke="#c59b27" strokeWidth="1" />
                      <path d="M12 6 C12 4 18 4 18 6 L19 12 L11 12 Z" fill="#b45309" />
                      <circle cx="15" cy="14" r="2.5" fill="none" stroke="#b45309" strokeWidth="0.8" />
                      <rect x="9" y="18" width="12" height="2" fill="#b45309" />
                      <text x="15" y="24" textAnchor="middle" fontSize="3" fontWeight="900" fill="#78350f">MSME</text>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Right Signatory: Authorized Signatory (100% Vector SVG Signature) */}
              <div className="text-center w-36 sm:w-44 md:w-48 flex flex-col items-center">
                {/* Pure Vector Signature: Ashwin */}
                <div className="h-7 sm:h-9 md:h-10 flex items-end justify-center mb-0.5">
                  <svg viewBox="0 0 145 55" className="h-full w-auto text-slate-900 fill-current select-none filter drop-shadow-2xs">
                    <path d="M 121 33 L 120 34 L 117 34 L 113 36 L 111 37 L 115 37 L 120 34 L 124 33 Z M 103 18 L 102 21 L 97 23 L 97 19 L 95 18 L 92 19 L 90 21 L 88 19 L 85 24 L 83 26 L 83 20 L 83 18 L 80 20 L 80 23 L 81 24 L 81 27 L 84 27 L 86 24 L 88 26 L 88 28 L 90 27 L 90 25 L 91 23 L 92 21 L 94 20 L 96 22 L 95 24 L 96 26 L 99 26 L 102 23 L 104 25 L 103 31 L 104 32 L 104 37 L 101 40 L 99 41 L 93 41 L 87 42 L 85 43 L 85 45 L 91 44 L 94 43 L 97 41 L 100 40 L 102 40 L 104 42 L 104 52 L 104 54 L 106 54 L 105 41 L 108 38 L 105 35 L 105 17 Z M 39 3 L 38 5 L 34 12 L 34 14 L 31 17 L 29 17 L 27 15 L 28 7 L 28 4 L 26 5 L 25 7 L 24 9 L 24 11 L 23 13 L 22 15 L 18 22 L 15 25 L 14 28 L 9 33 L 7 34 L 1 33 L 1 29 L 2 27 L 5 23 L 9 21 L 11 21 L 8 21 L 6 21 L 4 22 L 2 24 L 1 26 L 0 28 L 1 35 L 3 36 L 6 36 L 11 33 L 14 30 L 17 26 L 20 21 L 23 14 L 25 12 L 25 19 L 24 19 L 22 21 L 22 24 L 25 26 L 26 30 L 29 25 L 31 21 L 32 19 L 35 20 L 34 22 L 37 24 L 36 26 L 37 30 L 42 31 L 46 31 L 49 28 L 51 23 L 53 25 L 54 28 L 56 28 L 61 26 L 65 28 L 68 25 L 71 28 L 73 28 L 75 26 L 77 22 L 77 20 L 76 18 L 74 17 L 73 20 L 75 23 L 72 26 L 69 23 L 68 20 L 65 24 L 65 25 L 62 25 L 62 23 L 61 21 L 59 20 L 58 23 L 55 25 L 52 22 L 51 22 L 49 20 L 50 14 L 56 9 L 57 7 L 57 5 L 53 2 L 51 3 L 48 5 L 47 7 L 46 9 L 45 17 L 43 17 L 39 18 L 39 12 L 41 6 L 41 2 Z M 48 26 L 44 30 L 43 27 Z M 44 18 L 47 18 L 46 23 L 43 24 L 43 25 L 41 27 L 40 25 L 39 24 L 39 21 L 42 18 Z M 36 12 L 34 17 L 34 14 Z M 51 4 L 54 4 L 56 7 L 55 9 L 50 13 L 48 10 L 49 6 Z" />
                  </svg>
                </div>
                {/* Gold-accented signature divider line with central diamond */}
                <div className="relative w-full my-0.5 sm:my-1">
                  <div className="w-full h-[1.5px] bg-[#c59b27]"></div>
                  <div className="absolute left-1/2 -top-[3.5px] -translate-x-1/2 w-2 h-2 bg-[#c59b27] rotate-45 shadow-xs"></div>
                </div>
                <div 
                  className="font-bold text-[#0c234b] leading-tight select-none uppercase tracking-[0.06em]"
                  style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(8px, 1.1vw, 12px)' }}
                >
                  Authorized Signatory
                </div>
                <div className="text-[6px] sm:text-[7.5px] md:text-[8.5px] text-slate-500 select-none mt-0.5 font-medium">
                  Board of Skills and Educational Learning
                </div>
              </div>

            </div>

            {/* Bottom Delicate Framing Accent Line with Pins */}
            <div className="relative w-full flex items-center justify-between mt-1 px-2 sm:px-4 opacity-80 pointer-events-none select-none">
              {/* Left Pin */}
              <div className="flex items-center gap-0.5 pl-8 sm:pl-12">
                <div className="h-[1px] w-8 sm:w-14 bg-[#c59b27]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#c59b27]"></div>
              </div>

              {/* Right Pin */}
              <div className="flex items-center gap-0.5 pr-8 sm:pr-12">
                <div className="w-1.5 h-1.5 rounded-full bg-[#c59b27]"></div>
                <div className="h-[1px] w-8 sm:w-14 bg-[#c59b27]"></div>
              </div>
            </div>
          </div>

        </div>
        </div>
      </div>
    </div>
  );
}