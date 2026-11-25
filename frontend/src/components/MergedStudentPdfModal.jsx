import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, Download, Printer, Loader2, CheckCircle2, AlertCircle, FileDown, Users, FileText, Award } from 'lucide-react';
import Certificate from './Certificate';
import OfficialMarksheetView from './OfficialMarksheetView';
import { exportMergedLandscapeAndPortraitPdf, exportPdfFromElement, triggerDirectPdfDownload } from '../utils/pdfExport';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';

const XLINK_NS = 'http://www.w3.org/1999/xlink';

// Loads an image element. useCors is only needed when reading the remote URL directly.
const loadImageEl = (src, useCors) =>
  new Promise((resolve, reject) => {
    const el = new Image();
    if (useCors) el.crossOrigin = 'anonymous';
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error('Image load failed'));
    el.src = src;
  });

// Redraws a decoded image as a PNG data URL so html2canvas can always draw it
const drawImageAsPng = (img) => {
  const maxSide = 1200;
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  if (!w || !h) throw new Error('Image has no size');

  const scale = Math.min(1, maxSide / Math.max(w, h));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(w * scale));
  canvas.height = Math.max(1, Math.round(h * scale));

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/png');
};

// Converts a remote or local image URL into a PNG data URL.
// Returns the original URL if every route fails.
const imageUrlToPngDataUrl = async (url) => {
  if (!url || url.startsWith('data:')) return url;

  // Attempt 1: fetch the bytes, then decode them from a blob URL
  try {
    const res = await fetch(url, { mode: 'cors', cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    try {
      const img = await loadImageEl(objectUrl, false);
      return drawImageAsPng(img);
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  } catch (fetchErr) {
    console.warn('Fetch route failed for', url, fetchErr.message);
  }

  // Attempt 2: load through an <img> with crossOrigin, then draw to canvas
  try {
    const img = await loadImageEl(url, true);
    return drawImageAsPng(img);
  } catch (imgErr) {
    console.error('Could not inline image for merged PDF:', url, imgErr.message);
    return url;
  }
};

// Replaces every <image> href inside the root with a PNG data URL.
// Returns a function that restores the original attributes.
const inlineSvgImages = async (root) => {
  if (!root) return () => {};

  const images = Array.from(root.querySelectorAll('image'));
  const originals = images.map((el) => ({
    el,
    href: el.getAttribute('href'),
    xlink: el.getAttributeNS(XLINK_NS, 'href'),
  }));

  await Promise.all(
    originals.map(async ({ el, href, xlink }) => {
      const source = href || xlink;
      if (!source) return;
      const dataUrl = await imageUrlToPngDataUrl(source);
      if (dataUrl && dataUrl !== source) {
        el.setAttribute('href', dataUrl);
        el.setAttributeNS(XLINK_NS, 'xlink:href', dataUrl);
      }
    })
  );

  return () => {
    originals.forEach(({ el, href, xlink }) => {
      if (href === null) el.removeAttribute('href');
      else el.setAttribute('href', href);
      if (xlink === null || xlink === '') el.removeAttributeNS(XLINK_NS, 'href');
      else el.setAttributeNS(XLINK_NS, 'xlink:href', xlink);
    });
  };
};

/**
 * MergedStudentPdfModal
 *
 * Supports single student or batch student Certificate & Marksheet merge.
 * Previews the selected student's Landscape Certificate (Page 1) and
 * Portrait Marksheet (Page 2) in normal DOM flow, with instant multi-page PDF download.
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
  const [viewFilter, setViewFilter] = useState(data?.initialView || (data?.downloadMode === 'marksheet' ? 'marksheet' : data?.downloadMode === 'certificate' ? 'certificate' : 'all'));
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentStep, setCurrentStep] = useState('Preparing templates...');
  const [progressText, setProgressText] = useState('');

  const certContainerRef = useRef(null);
  const marksheetContainerRef = useRef(null);

  const currentStudentPackage = students[activeIndex] || students[0];

  // Download current previewed student's PDF (merged, marksheet only, or certificate only)
  const handleDownloadSingle = async (pkg = currentStudentPackage, mode = 'merged') => {
    if (!pkg) return;
    setIsGenerating(true);
    setErrorMessage(null);
    setDownloadSuccess(false);

    let restoreCert = null;
    let restoreMs = null;

    try {
      setCurrentStep(`Preparing ${pkg.student?.studentName || 'Student'}...`);
      if (document.fonts?.ready) {
        try {
          await document.fonts.ready;
        } catch {
          // ignore font warning
        }
      }

      await new Promise(resolve => setTimeout(resolve, 350));

      const certEl = certContainerRef.current?.querySelector('#printable-certificate') || certContainerRef.current;
      const msEl = marksheetContainerRef.current?.querySelector('#printable-marksheet-sheet') || marksheetContainerRef.current;

      if (mode === 'certificate') {
        if (!certEl) throw new Error('Could not locate Certificate canvas container in DOM.');
        setCurrentStep(`Rendering Certificate for ${pkg.student?.studentName}...`);
        await exportPdfFromElement(certEl, {
          orientation: 'landscape',
          filename: `BSEL_Certificate_${pkg.student?.studentName || 'Student'}.pdf`,
          scale: 2.5
        });
        if (showToast) showToast(`Downloaded Certificate for ${pkg.student?.studentName || 'Student'}!`);
      } else if (mode === 'marksheet') {
        if (!msEl) throw new Error('Could not locate Marksheet canvas container in DOM.');
        setCurrentStep(`Rendering Marksheet for ${pkg.student?.studentName}...`);
        await exportPdfFromElement(msEl, {
          orientation: 'portrait',
          filename: `BSEL_Marksheet_${pkg.student?.studentName || 'Student'}.pdf`,
          scale: 2.5
        });
        if (showToast) showToast(`Downloaded Marksheet for ${pkg.student?.studentName || 'Student'}!`);
      } else {
        if (!certEl || !msEl) {
          throw new Error('Could not locate Certificate or Marksheet canvas container in DOM.');
        }

        setCurrentStep(`Rendering Certificate & Marksheet for ${pkg.student?.studentName}...`);

        await exportMergedLandscapeAndPortraitPdf({
          page1Element: certEl,
          page2Element: msEl,
          filename: pkg.filename || `BSEL_Merged_Certificate_Marksheet_${pkg.student?.studentName || 'Student'}.pdf`,
          page1Scale: 2,
          page2Scale: 2
        });

        if (showToast) {
          showToast(`Downloaded merged PDF for ${pkg.student?.studentName || 'Student'}!`);
        }
      }

      setCurrentStep(`Preparing photos for ${pkg.student?.studentName}...`);
      restoreCert = await inlineSvgImages(certEl);
      restoreMs = await inlineSvgImages(msEl);

      setCurrentStep(`Rendering Certificate & Marksheet for ${pkg.student?.studentName}...`);

      await exportMergedLandscapeAndPortraitPdf({
        page1Element: certEl,
        page2Element: msEl,
        filename: pkg.filename || `BSEL_Merged_Certificate_Marksheet_${pkg.student?.studentName || 'Student'}.pdf`,
        page1Scale: 2,
        page2Scale: 2
      });

      setDownloadSuccess(true);
      setCurrentStep('Download complete!');
    } catch (err) {
      console.error('Single PDF Export Failed:', err);
      setErrorMessage(err.message || 'Error generating PDF.');
      if (showToast) {
        showToast('PDF Generation failed: ' + (err.message || 'Error'));
      }
    } finally {
      if (restoreCert) restoreCert();
      if (restoreMs) restoreMs();
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
      const isInitialLandscape = mode === 'certificate' || mode === 'merged';
      const pdf = new jsPDF({
        orientation: isInitialLandscape ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      for (let i = 0; i < students.length; i++) {
        const pkg = students[i];
        setActiveIndex(i);
        setCurrentStep(`Processing candidate ${i + 1} of ${students.length}: ${pkg.student?.studentName}...`);
        setProgressText(`${i + 1}/${students.length}`);

        await new Promise(resolve => setTimeout(resolve, 450));

        const certEl = certContainerRef.current?.querySelector('#printable-certificate') || certContainerRef.current;
        const msEl = marksheetContainerRef.current?.querySelector('#printable-marksheet-sheet') || marksheetContainerRef.current;

        // 1. Capture Certificate (Landscape)
        if (mode === 'merged' || mode === 'certificate') {
          if (!certEl) {
            throw new Error(`Could not locate Certificate canvas for ${pkg.student?.studentName}`);
          }
        if (!certEl || !msEl) {
          throw new Error(`Could not locate canvas elements for ${pkg.student?.studentName}`);
        }

        // Replace remote photos and logos with data URLs before capture
        const restoreCert = await inlineSvgImages(certEl);
        const restoreMs = await inlineSvgImages(msEl);

        let certCanvas;
        let msCanvas;

        try {
          // 1. Capture Certificate (Landscape)
          certCanvas = await html2canvas(certEl, {
            scale: 2.5,
            useCORS: true,
            allowTaint: false,
            logging: false,
            scrollX: 0,
            scrollY: 0,
            windowWidth: 1050,
            backgroundColor: '#ffffff',
            onclone: (_clonedDoc, clonedEl) => {
              const cert = clonedEl.id === 'printable-certificate' ? clonedEl : clonedEl.querySelector?.('#printable-certificate');
              if (cert) {
                cert.style.width = '1024px';
                cert.style.maxWidth = '1024px';
                cert.style.margin = '0 auto';
              }
            }
          });

          // 2. Capture Marksheet (Portrait)
          msCanvas = await html2canvas(msEl, {
            scale: 2.5,
            useCORS: true,
            allowTaint: false,
            logging: false,
            scrollX: 0,
            scrollY: 0,
            windowWidth: 1024,
            backgroundColor: '#ffffff',
            onclone: (_clonedDoc, clonedEl) => {
              const ms = clonedEl.id === 'printable-marksheet-sheet' ? clonedEl : clonedEl.querySelector?.('#printable-marksheet-sheet');
              if (ms) {
                ms.style.width = '724px';
                ms.style.maxWidth = '724px';
                ms.style.aspectRatio = '724 / 1024';
                ms.style.margin = '0 auto';
              }
            }
          });
        } finally {
          restoreCert();
          restoreMs();
        }

          const certCanvas = await html2canvas(certEl, {
            scale: 2.5,
            useCORS: true,
            allowTaint: false,
            logging: false,
            scrollX: 0,
            scrollY: 0,
            windowWidth: 1050,
            backgroundColor: '#ffffff',
            onclone: (_clonedDoc, clonedEl) => {
              const cert = clonedEl.id === 'printable-certificate' ? clonedEl : clonedEl.querySelector?.('#printable-certificate');
              if (cert) {
                cert.style.width = '1024px';
                cert.style.maxWidth = '1024px';
                cert.style.margin = '0 auto';
              }
            }
          });

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
          if (!msEl) {
            throw new Error(`Could not locate Marksheet canvas for ${pkg.student?.studentName}`);
          }

          const msCanvas = await html2canvas(msEl, {
            scale: 2.5,
            useCORS: true,
            allowTaint: false,
            logging: false,
            scrollX: 0,
            scrollY: 0,
            windowWidth: 1024,
            backgroundColor: '#ffffff',
            onclone: (_clonedDoc, clonedEl) => {
              const ms = clonedEl.id === 'printable-marksheet-sheet' ? clonedEl : clonedEl.querySelector?.('#printable-marksheet-sheet');
              if (ms) {
                ms.style.width = '724px';
                ms.style.maxWidth = '724px';
                ms.style.aspectRatio = '724 / 1024';
                ms.style.margin = '0 auto';
              }
            }
          });
        let msImgData;
        let msFmt = 'JPEG';
        try {
          msImgData = msCanvas.toDataURL('image/jpeg', 0.98);
        } catch {
          msImgData = msCanvas.toDataURL('image/png');
          msFmt = 'PNG';
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
      }, 650);
      return () => clearTimeout(timer);
    }
  }, [data?.autoDownload, data?.downloadMode]);

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
            size: A4 portrait;
            margin: 0;
          }
          @page landscape-sheet {
            size: A4 landscape;
            margin: 0;
          }
          @page portrait-sheet {
            size: A4 portrait;
            margin: 0;
          }

          body * {
            visibility: hidden !important;
          }
          #merged-print-container, #merged-print-container * {
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

          .merged-cert-page {
            page: landscape-sheet !important;
            page-break-after: always !important;
            break-after: page !important;
            width: 100vw !important;
            height: 100vh !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }

          .merged-cert-page #printable-certificate {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            max-height: 100% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            margin: 0 auto !important;
          }

          .merged-cert-page #printable-certificate svg {
            width: 100% !important;
            height: auto !important;
            max-height: 98vh !important;
            object-fit: contain !important;
          }

          .merged-marksheet-page {
            page: portrait-sheet !important;
            page-break-before: always !important;
            break-before: page !important;
            width: 100vw !important;
            min-height: 100vh !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }

          .merged-marksheet-page #printable-marksheet-sheet {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            width: 100% !important;
            max-width: 724px !important;
            aspect-ratio: 724 / 1024 !important;
            margin: 0 auto !important;
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
                  Merged PDF: <strong className="text-amber-400">{currentStudentPackage.student?.studentName}</strong> • <span className="text-sky-300 font-bold uppercase">{currentStudentPackage.student?.program || 'Abacus'}</span>
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
              <span>{students.length === 1 ? 'Download Merged PDF' : `Merged (${students.length})`}</span>
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
              <span>{students.length === 1 ? 'Download Marksheet' : `Marksheet (${students.length})`}</span>
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
              <span>{students.length === 1 ? 'Download Certificate' : `Certificate (${students.length})`}</span>
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#163e7c] hover:bg-[#1f54a6] text-white rounded-lg text-xs font-black transition flex items-center gap-1.5 border border-white/20 cursor-pointer"
              title="Print active view"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Multi-student navigation pills (when multiple selected) */}
        {students.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-white/10 text-xs">
            <span className="text-[11px] font-bold text-amber-300 shrink-0">Switch Preview:</span>
            {students.map((pkg, idx) => (
              <button
                key={pkg.student?.userId || idx}
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
          <span>Error generating PDF: {errorMessage}. You can click "Download Merged PDF" above to retry.</span>
        </div>
      )}

      {/* 
        Scrollable Document Preview Canvas 
        Both documents are rendered live in normal in-flow DOM.
      */}
      <div id="merged-print-container" className="w-full max-w-[1020px] space-y-6 pb-12">
        {/* Page 1 Card: Landscape Certificate */}
        {(viewFilter === 'all' || viewFilter === 'certificate') && (
          <div className="merged-cert-page bg-slate-900/40 p-3 sm:p-5 rounded-2xl border border-amber-400/30 shadow-2xl">
            <div className="no-print flex items-center justify-between mb-2 text-xs font-black text-amber-300 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <FileDown className="w-4 h-4" />
                <span>Page 1: Official Board Certificate (Landscape A4)</span>
              </span>
              <span className="text-slate-400 text-[11px] font-medium lowercase">297 × 210 mm • {currentStudentPackage.student?.studentName}</span>
            </div>

            <div ref={certContainerRef} className="w-full flex justify-center overflow-x-auto">
              <Certificate {...currentStudentPackage.certData} showControls={false} />
            </div>
          </div>
        )}

        {/* Page 2 Card: Portrait Marksheet */}
        {(viewFilter === 'all' || viewFilter === 'marksheet') && (
          <div className="merged-marksheet-page bg-slate-900/40 p-3 sm:p-5 rounded-2xl border border-sky-400/30 shadow-2xl">
            <div className="no-print flex items-center justify-between mb-2 text-xs font-black text-sky-300 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <FileDown className="w-4 h-4" />
                <span>Page 2: Official Marksheet & Grade Card (Portrait A4)</span>
              </span>
              <span className="text-slate-400 text-[11px] font-medium lowercase">210 × 297 mm • {currentStudentPackage.student?.studentName}</span>
            </div>

            <div ref={marksheetContainerRef} className="w-full flex justify-center overflow-x-auto">
              <div className="w-full max-w-[724px]">
                <OfficialMarksheetView student={currentStudentPackage.marksheetData} standalone={true} defaultShowMarks={true} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}