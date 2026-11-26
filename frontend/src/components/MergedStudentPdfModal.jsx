import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, Download, Printer, Loader2, CheckCircle2, AlertCircle, FileDown, Users, FileText, Award } from 'lucide-react';
import Certificate from './Certificate';
import OfficialMarksheetView from './OfficialMarksheetView';
import {
  exportMergedLandscapeAndPortraitPdf,
  exportPdfFromElement,
  triggerDirectPdfDownload,
  svgElementToCanvas
} from '../utils/pdfExport';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';

/**
 * MergedStudentPdfModal
 *
 * Supports single student or batch student Certificate & Marksheet merge,
 * individual marksheet download/print, and individual certificate download/print.
 * Renders all candidates deterministically in DOM for zero-delay multi-page export.
 */
export default function MergedStudentPdfModal({
  data,
  onClose,
  showToast
}) {
  // Normalize data.students array
  const rawList = data?.students || (data?.student ? [data] : []);
  const students = rawList.filter(Boolean);

  const [activeIndex, setActiveIndex] = useState(0);
  const [viewFilter, setViewFilter] = useState(
    data?.initialView || (data?.downloadMode === 'marksheet' ? 'marksheet' : data?.downloadMode === 'certificate' ? 'certificate' : 'all')
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentStep, setCurrentStep] = useState('Preparing templates...');
  const [progressText, setProgressText] = useState('');

  const currentStudentPackage = students[activeIndex] || students[0];

  // Helper to get DOM elements for a student index
  const getStudentElements = (idx) => {
    const certWrap = document.getElementById(`cert-student-${idx}`);
    const msWrap = document.getElementById(`marksheet-student-${idx}`);

    const certEl = certWrap?.querySelector('#printable-certificate') || certWrap;
    const certSvg = certWrap?.querySelector('#printable-certificate-svg') || certWrap?.querySelector('svg');
    const msEl = msWrap?.querySelector('#printable-marksheet-sheet') || msWrap;
    const msSvg = msWrap?.querySelector('#printable-marksheet-svg') || msWrap?.querySelector('svg');

    return { certWrap, certEl, certSvg, msEl, msSvg };
  };

  // Download a single student's PDF (merged, marksheet only, or certificate only)
  const handleDownloadSingle = async (pkg = currentStudentPackage, mode = 'merged') => {
    if (!pkg) return;
    setIsGenerating(true);
    setErrorMessage(null);
    setDownloadSuccess(false);

    try {
      const idx = students.indexOf(pkg) >= 0 ? students.indexOf(pkg) : activeIndex;
      setCurrentStep(`Preparing ${pkg.student?.studentName || 'Student'}...`);

      if (document.fonts?.ready) {
        try {
          await document.fonts.ready;
        } catch {
          // ignore font warning
        }
      }

      await new Promise(resolve => setTimeout(resolve, 300));

      const { certEl, certSvg, msEl, msSvg } = getStudentElements(idx);

      if (mode === 'certificate') {
        if (!certEl && !certSvg) throw new Error('Could not locate Certificate container in DOM.');
        setCurrentStep(`Rendering Certificate for ${pkg.student?.studentName}...`);
        await exportPdfFromElement(certSvg || certEl, {
          orientation: 'landscape',
          filename: `BSEL_Certificate_${pkg.student?.studentName || 'Student'}.pdf`,
          scale: 2.5
        });
        if (showToast) showToast(`Downloaded Certificate for ${pkg.student?.studentName || 'Student'}!`);
      } else if (mode === 'marksheet') {
        if (!msEl && !msSvg) throw new Error('Could not locate Marksheet container in DOM.');
        setCurrentStep(`Rendering Marksheet for ${pkg.student?.studentName}...`);
        await exportPdfFromElement(msSvg || msEl, {
          orientation: 'portrait',
          filename: `BSEL_Marksheet_${pkg.student?.studentName || 'Student'}.pdf`,
          scale: 2.5
        });
        if (showToast) showToast(`Downloaded Marksheet for ${pkg.student?.studentName || 'Student'}!`);
      } else {
        if ((!certEl && !certSvg) || (!msEl && !msSvg)) {
          throw new Error('Both Certificate and Marksheet must be present in DOM.');
        }

        setCurrentStep(`Rendering Certificate & Marksheet for ${pkg.student?.studentName}...`);

        await exportMergedLandscapeAndPortraitPdf({
          page1Element: certSvg || certEl,
          page2Element: msSvg || msEl,
          filename: pkg.filename || `BSEL_Merged_Certificate_Marksheet_${pkg.student?.studentName || 'Student'}.pdf`,
          page1Scale: 2.5,
          page2Scale: 2.5
        });

        if (showToast) {
          showToast(`Downloaded merged PDF for ${pkg.student?.studentName || 'Student'}!`);
        }
      }

      setDownloadSuccess(true);
      setCurrentStep('Download complete!');
    } catch (err) {
      console.error('Single PDF Export Failed:', err);
      setErrorMessage(err.message || 'Error generating PDF.');
      if (showToast) {
        showToast('PDF Generation failed: ' + (err.message || 'Error'));
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Download all selected students in a single master combined PDF
  // mode: 'merged' (both) | 'marksheet' (only marksheets) | 'certificate' (only certificates)
  const handleDownloadCombinedMasterPdf = async (mode = 'merged') => {
    if (isGenerating || students.length === 0) return;
    setIsGenerating(true);
    setErrorMessage(null);
    setDownloadSuccess(false);

    try {
      if (document.fonts?.ready) {
        try {
          await document.fonts.ready;
        } catch {
          // ignore font warning
        }
      }

      await new Promise(resolve => setTimeout(resolve, 350));

      const isInitialLandscape = mode === 'certificate' || mode === 'merged';
      const pdf = new jsPDF({
        orientation: isInitialLandscape ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      for (let i = 0; i < students.length; i++) {
        const pkg = students[i];
        setCurrentStep(`Processing ${i + 1}/${students.length}: ${pkg.student?.studentName}...`);
        setProgressText(`${i + 1}/${students.length}`);

        const { certEl, certSvg, msEl, msSvg } = getStudentElements(i);

        // 1. Capture Certificate (Landscape)
        if (mode === 'merged' || mode === 'certificate') {
          if (!certEl && !certSvg) {
            throw new Error(`Could not locate Certificate element for ${pkg.student?.studentName}`);
          }

          let certCanvas = null;
          if (certSvg) {
            try {
              certCanvas = await svgElementToCanvas(certSvg, 2.5);
            } catch (e) {
              console.warn('svgElementToCanvas fallback to html2canvas', e);
            }
          }

          if (!certCanvas && certEl) {
            certCanvas = await html2canvas(certEl, {
              scale: 2.5,
              useCORS: true,
              allowTaint: false,
              logging: false,
              scrollX: 0,
              scrollY: 0,
              windowWidth: 1050,
              backgroundColor: '#ffffff',
              onclone: (_doc, el) => {
                const cert = el.id === 'printable-certificate' ? el : el.querySelector?.('#printable-certificate');
                if (cert) {
                  cert.style.width = '1024px';
                  cert.style.maxWidth = '1024px';
                  cert.style.margin = '0 auto';
                }
              }
            });
          }

          let certImgData;
          let certFmt = 'JPEG';
          try {
            certImgData = certCanvas.toDataURL('image/jpeg', 0.98);
          } catch {
            certImgData = certCanvas.toDataURL('image/png');
            certFmt = 'PNG';
          }

          // Add Certificate page (Landscape)
          if (i > 0) {
            pdf.addPage('a4', 'landscape');
          }
          const p1W = pdf.internal.pageSize.getWidth();
          const p1H = pdf.internal.pageSize.getHeight();
          const cAspect = certCanvas.width / certCanvas.height;
          let cw = p1W;
          let ch = p1W / cAspect;
          if (ch > p1H) {
            ch = p1H;
            cw = p1H * cAspect;
          }
          pdf.addImage(certImgData, certFmt, (p1W - cw) / 2, (p1H - ch) / 2, cw, ch, undefined, 'FAST');
        }

        // 2. Capture Marksheet (Portrait)
        if (mode === 'merged' || mode === 'marksheet') {
          if (!msEl && !msSvg) {
            throw new Error(`Could not locate Marksheet element for ${pkg.student?.studentName}`);
          }

          let msCanvas = null;
          if (msSvg) {
            try {
              msCanvas = await svgElementToCanvas(msSvg, 2.5);
            } catch (e) {
              console.warn('svgElementToCanvas marksheet fallback to html2canvas', e);
            }
          }

          if (!msCanvas && msEl) {
            msCanvas = await html2canvas(msEl, {
              scale: 2.5,
              useCORS: true,
              allowTaint: false,
              logging: false,
              scrollX: 0,
              scrollY: 0,
              windowWidth: 1024,
              backgroundColor: '#ffffff',
              onclone: (_doc, el) => {
                const ms = el.id === 'printable-marksheet-sheet' ? el : el.querySelector?.('#printable-marksheet-sheet');
                if (ms) {
                  ms.style.width = '724px';
                  ms.style.maxWidth = '724px';
                  ms.style.height = '1024px';
                  ms.style.minHeight = '1024px';
                  ms.style.maxHeight = '1024px';
                  ms.style.aspectRatio = '724 / 1024';
                  ms.style.overflow = 'visible';
                  ms.style.margin = '0 auto';
                }
              }
            });
          }

          let msImgData;
          let msFmt = 'JPEG';
          try {
            msImgData = msCanvas.toDataURL('image/jpeg', 0.98);
          } catch {
            msImgData = msCanvas.toDataURL('image/png');
            msFmt = 'PNG';
          }

          // Add Marksheet page (Portrait)
          if (mode === 'marksheet') {
            if (i > 0) {
              pdf.addPage('a4', 'portrait');
            }
          } else {
            // mode === 'merged'
            pdf.addPage('a4', 'portrait');
          }

          const p2W = pdf.internal.pageSize.getWidth();
          const p2H = pdf.internal.pageSize.getHeight();
          const msMargin = 0;
          const availW = p2W - msMargin * 2;
          const availH = p2H - msMargin * 2;
          const mAspect = msCanvas.width / msCanvas.height;
          let mw = availW;
          let mh = availW / mAspect;
          if (mh > availH) {
            mh = availH;
            mw = availH * mAspect;
          }
          pdf.addImage(msImgData, msFmt, msMargin + (availW - mw) / 2, msMargin + (availH - mh) / 2, mw, mh, undefined, 'FAST');
        }
      }

      const masterFilename = mode === 'certificate'
        ? `BSEL_Certificates_${students.length}_Candidates.pdf`
        : mode === 'marksheet'
        ? `BSEL_Marksheets_${students.length}_Candidates.pdf`
        : `BSEL_Combined_Student_Records_${students.length}_Students.pdf`;

      triggerDirectPdfDownload(pdf, masterFilename);

      setDownloadSuccess(true);
      setCurrentStep('Download complete!');
      if (showToast) {
        showToast(
          mode === 'certificate'
            ? `Downloaded certificates PDF for ${students.length} candidates!`
            : mode === 'marksheet'
            ? `Downloaded marksheets PDF for ${students.length} candidates!`
            : `Downloaded combined master PDF with ${students.length * 2} pages!`
        );
      }
    } catch (err) {
      console.error('Master PDF generation failed:', err);
      setErrorMessage(err.message || 'Error generating PDF.');
      if (showToast) {
        showToast('PDF error: ' + (err.message || 'Error'));
      }
    } finally {
      setIsGenerating(false);
      setProgressText('');
    }
  };

  // If autoDownload is requested, trigger download after templates mount
  useEffect(() => {
    if (data?.autoDownload) {
      const mode = data?.downloadMode || 'merged';
      const timer = setTimeout(() => {
        if (students.length === 1) {
          handleDownloadSingle(students[0], mode);
        } else {
          handleDownloadCombinedMasterPdf(mode);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [data?.autoDownload, data?.downloadMode]);

  // If autoPrint is requested, trigger print after templates mount
  useEffect(() => {
    if (data?.autoPrint) {
      const timer = setTimeout(() => {
        window.print();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [data?.autoPrint]);

  const handlePrint = () => {
    window.print();
  };

  if (!students.length || !currentStudentPackage) return null;

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-start py-4 px-2 sm:px-4">
      {/* Print Stylesheet */}
      <style>{`
        @media print {
          @page {
            size: ${viewFilter === 'certificate' ? 'A4 landscape' : 'A4 portrait'};
            margin: 0;
          }

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            background: #ffffff !important;
            overflow: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body * {
            visibility: hidden !important;
          }

          #merged-print-container,
          #merged-print-container * {
            visibility: visible !important;
          }

          #merged-print-container {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
          }

          .merged-student-wrapper {
            margin: 0 !important;
            padding: 0 !important;
            display: block !important;
            position: relative !important;
            left: auto !important;
            top: auto !important;
            opacity: 1 !important;
          }

          .merged-cert-page {
            page-break-before: auto !important;
            break-before: auto !important;
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            display: block !important;
            width: 100% !important;
            max-width: ${viewFilter === 'certificate' ? '297mm' : '210mm'} !important;
            height: auto !important;
            max-height: ${viewFilter === 'certificate' ? '210mm' : '150mm'} !important;
            display: block !important;
            background: white !important;
            padding: 4mm 0 !important;
            margin: 0 auto !important;
            box-shadow: none !important;
            border: none !important;
            box-sizing: border-box !important;
          }

          .merged-cert-page #printable-certificate {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            width: 100% !important;
            max-width: ${viewFilter === 'certificate' ? '285mm' : '195mm'} !important;
            height: auto !important;
            max-height: ${viewFilter === 'certificate' ? '196mm' : '138mm'} !important;
            display: block !important;
            margin: 0 auto !important;
            box-sizing: border-box !important;
          }

          .merged-cert-page svg {
            width: 100% !important;
            height: auto !important;
            max-height: ${viewFilter === 'certificate' ? '196mm' : '138mm'} !important;
            object-fit: contain !important;
            display: block !important;
            margin: 0 auto !important;
          }

          .merged-marksheet-page {
            page-break-before: ${viewFilter === 'marksheet' ? 'auto' : 'always'} !important;
            break-before: ${viewFilter === 'marksheet' ? 'auto' : 'page'} !important;
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            display: block !important;
            width: 100% !important;
            max-width: 210mm !important;
            height: auto !important;
            max-height: 297mm !important;
            background: white !important;
            padding: 4mm 0 !important;
            margin: 0 auto !important;
            box-shadow: none !important;
            border: none !important;
            box-sizing: border-box !important;
          }

          .merged-marksheet-page #printable-marksheet-sheet {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            width: 182mm !important;
            max-width: 182mm !important;
            height: 257mm !important;
            max-height: 257mm !important;
            aspect-ratio: 724 / 1024 !important;
            margin: 0 auto !important;
            overflow: visible !important;
            box-sizing: border-box !important;
            display: block !important;
          }

          .merged-marksheet-page #printable-marksheet-sheet svg {
            width: 100% !important;
            height: 100% !important;
            max-height: 100% !important;
            object-fit: contain !important;
            display: block !important;
          }

          ${viewFilter === 'certificate' ? '.merged-marksheet-page { display: none !important; }' : ''}
          ${viewFilter === 'marksheet' ? '.merged-cert-page { display: none !important; }' : ''}

          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Top Controls Toolbar */}
      <div className="no-print w-full max-w-[1020px] bg-[#0c234b] text-white px-4 py-3 rounded-2xl shadow-xl flex flex-col gap-3 mb-4 sticky top-2 z-30 border border-amber-400/40">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to student list</span>
            </button>

            <div className="text-xs font-semibold text-slate-200 truncate">
              {students.length === 1 ? (
                <>
                  Student: <strong className="text-amber-400">{currentStudentPackage.student?.studentName}</strong> • <span className="text-sky-300 font-bold uppercase">{currentStudentPackage.student?.program || currentStudentPackage.student?.courseName || 'Abacus'}</span>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-black text-[11px] border border-amber-400/30">
                    <Users className="w-3 h-3" />
                    <span>{students.length} Candidates Selected</span>
                  </span>
                  <span className="text-slate-300 text-[11px] hidden md:inline">
                    Viewing: <strong className="text-white">{currentStudentPackage.student?.studentName}</strong> ({activeIndex + 1}/{students.length})
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 flex-wrap">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setViewFilter('all')}
                className={`px-2 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                  viewFilter === 'all' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                Both
              </button>
              <button
                type="button"
                onClick={() => setViewFilter('certificate')}
                className={`px-2 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                  viewFilter === 'certificate' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                Certificate
              </button>
              <button
                type="button"
                onClick={() => setViewFilter('marksheet')}
                className={`px-2 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                  viewFilter === 'marksheet' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                Marksheet
              </button>
            </div>

            {/* Status indicator */}
            {isGenerating ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-lg text-xs font-bold">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{progressText ? `${currentStep} (${progressText})` : currentStep}</span>
              </div>
            ) : downloadSuccess ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-lg text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Download Complete!</span>
              </div>
            ) : null}

            {/* Download Merged PDF */}
            <button
              type="button"
              onClick={students.length === 1 ? () => handleDownloadSingle(currentStudentPackage, 'merged') : () => handleDownloadCombinedMasterPdf('merged')}
              disabled={isGenerating}
              className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-lg text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
              title="Download Certificate & Marksheet merged in 1 PDF"
            >
              <Download className="w-3.5 h-3.5 text-emerald-200" />
              <span>{students.length === 1 ? 'Download Merged PDF' : `Download Merged (${students.length})`}</span>
            </button>

            {/* Download Marksheet(s) Separately */}
            <button
              type="button"
              onClick={students.length === 1 ? () => handleDownloadSingle(currentStudentPackage, 'marksheet') : () => handleDownloadCombinedMasterPdf('marksheet')}
              disabled={isGenerating}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black rounded-lg text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
              title="Download official marksheet(s) separately"
            >
              <FileText className="w-3.5 h-3.5 text-slate-950" />
              <span>{students.length === 1 ? 'Marksheet PDF' : `Marksheet (${students.length})`}</span>
            </button>

            {/* Download Certificate(s) Separately */}
            <button
              type="button"
              onClick={students.length === 1 ? () => handleDownloadSingle(currentStudentPackage, 'certificate') : () => handleDownloadCombinedMasterPdf('certificate')}
              disabled={isGenerating}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-black rounded-lg text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
              title="Download official certificate(s) separately"
            >
              <Award className="w-3.5 h-3.5 text-amber-200" />
              <span>{students.length === 1 ? 'Certificate PDF' : `Certificate (${students.length})`}</span>
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#163e7c] hover:bg-[#1f54a6] text-white rounded-lg text-xs font-black transition flex items-center gap-1.5 border border-white/20 cursor-pointer"
              title="Print active view"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print {viewFilter === 'all' ? 'Merged' : (viewFilter === 'marksheet' ? 'Marksheet' : 'Certificate')}</span>
            </button>
          </div>
        </div>

        {/* Multi-student navigation pills (when multiple selected) */}
        {students.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-white/10 text-xs">
            <span className="text-[11px] font-bold text-amber-300 shrink-0">Switch Preview:</span>
            {students.map((pkg, idx) => (
              <button
                key={pkg.student?.userId || pkg.student?.id || idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition shrink-0 cursor-pointer flex items-center gap-1 ${
                  activeIndex === idx
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                <span>{idx + 1}. {pkg.student?.studentName || 'Student'}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error Banner if any */}
      {errorMessage && (
        <div className="no-print w-full max-w-[1020px] mb-3 p-3 bg-rose-500/20 border border-rose-500/50 rounded-xl text-rose-200 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>Error generating PDF: {errorMessage}. You can click above to retry.</span>
        </div>
      )}

      {/* 
        Scrollable Document Container
        All candidate templates are rendered in DOM:
        - Only active candidate is displayed on screen
        - In print mode, all candidates are printed in sequential pages
        - Can be reliably captured by html2canvas / svgElementToCanvas
      */}
      <div id="merged-print-container" className="w-full max-w-[1020px] pb-12">
        {students.map((pkg, idx) => {
          const isScreenActive = idx === activeIndex;

          return (
            <div
              key={pkg.student?.userId || pkg.student?.id || idx}
              className={`merged-student-wrapper ${isScreenActive ? 'block space-y-6' : 'space-y-6'}`}
              style={
                isScreenActive
                  ? {}
                  : {
                      position: 'fixed',
                      left: '-99999px',
                      top: '0',
                      opacity: 0,
                      pointerEvents: 'none',
                    }
              }
            >
              {/* Page 1 Card: Landscape Certificate */}
              <div
                className={`merged-cert-page bg-slate-900/40 p-3 sm:p-5 rounded-2xl border border-amber-400/30 shadow-2xl ${
                  viewFilter !== 'all' && viewFilter !== 'certificate' ? 'hidden' : ''
                }`}
              >
                <div className="no-print flex items-center justify-between mb-2 text-xs font-black text-amber-300 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <FileDown className="w-4 h-4" />
                    <span>Page 1: Official Board Certificate (Landscape A4)</span>
                  </span>
                  <span className="text-slate-400 text-[11px] font-medium lowercase">
                    297 × 210 mm • {pkg.student?.studentName}
                  </span>
                </div>

                <div id={`cert-student-${idx}`} className="w-full flex justify-center overflow-x-auto">
                  <Certificate {...pkg.certData} showControls={false} disablePrintStyle={true} />
                </div>
              </div>

              {/* Page 2 Card: Portrait Marksheet */}
              <div
                className={`merged-marksheet-page bg-slate-900/40 p-3 sm:p-5 rounded-2xl border border-sky-400/30 shadow-2xl ${
                  viewFilter !== 'all' && viewFilter !== 'marksheet' ? 'hidden' : ''
                }`}
              >
                <div className="no-print flex items-center justify-between mb-2 text-xs font-black text-sky-300 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <FileDown className="w-4 h-4" />
                    <span>Page 2: Official Marksheet & Grade Card (Portrait A4)</span>
                  </span>
                  <span className="text-slate-400 text-[11px] font-medium lowercase">
                    210 × 297 mm • {pkg.student?.studentName}
                  </span>
                </div>

                <div id={`marksheet-student-${idx}`} className="w-full flex justify-center overflow-x-auto">
                  <div className="w-full max-w-[724px]">
                    <OfficialMarksheetView
                      student={pkg.marksheetData}
                      standalone={true}
                      defaultShowMarks={true}
                      hideDownloadAndPrint={true}
                      disablePrintStyle={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
