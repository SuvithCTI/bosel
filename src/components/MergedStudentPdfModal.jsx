import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, Download, Printer, Loader2, CheckCircle2, AlertCircle, FileDown, Users } from 'lucide-react';
import Certificate from './Certificate';
import OfficialMarksheetView from './OfficialMarksheetView';
import { exportMergedLandscapeAndPortraitPdf, triggerDirectPdfDownload } from '../utils/pdfExport';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentStep, setCurrentStep] = useState('Preparing templates...');
  const [progressText, setProgressText] = useState('');

  const certContainerRef = useRef(null);
  const marksheetContainerRef = useRef(null);

  const currentStudentPackage = students[activeIndex] || students[0];

  // Download current previewed student's 2-page PDF
  const handleDownloadSingle = async (pkg = currentStudentPackage) => {
    if (!pkg) return;
    setIsGenerating(true);
    setErrorMessage(null);
    setDownloadSuccess(false);

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

      setDownloadSuccess(true);
      setCurrentStep('Download complete!');
      if (showToast) {
        showToast(`Downloaded merged PDF for ${pkg.student?.studentName || 'Student'}!`);
      }
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
  const handleDownloadCombinedMasterPdf = async () => {
    if (isGenerating || students.length === 0) return;
    setIsGenerating(true);
    setErrorMessage(null);
    setDownloadSuccess(false);

    try {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      for (let i = 0; i < students.length; i++) {
        const pkg = students[i];
        setActiveIndex(i);
        setCurrentStep(`Adding candidate ${i + 1} of ${students.length}: ${pkg.student?.studentName}...`);
        setProgressText(`${i + 1}/${students.length}`);

        await new Promise(resolve => setTimeout(resolve, 500));

        const certEl = certContainerRef.current?.querySelector('#printable-certificate') || certContainerRef.current;
        const msEl = marksheetContainerRef.current?.querySelector('#printable-marksheet-sheet') || marksheetContainerRef.current;

        if (!certEl || !msEl) {
          throw new Error(`Could not locate canvas elements for ${pkg.student?.studentName}`);
        }

        // 1. Capture Certificate (Landscape)
        const certCanvas = await html2canvas(certEl, {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          logging: false,
          scrollX: 0,
          scrollY: 0,
          windowWidth: 1050,
          backgroundColor: '#fcfbf7'
        });

        let certImgData;
        let certFmt = 'JPEG';
        try {
          certImgData = certCanvas.toDataURL('image/jpeg', 0.95);
        } catch {
          certImgData = certCanvas.toDataURL('image/png');
          certFmt = 'PNG';
        }

        // 2. Capture Marksheet (Portrait)
        const msCanvas = await html2canvas(msEl, {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          logging: false,
          scrollX: 0,
          scrollY: 0,
          windowWidth: 750,
          backgroundColor: '#ffffff'
        });

        let msImgData;
        let msFmt = 'JPEG';
        try {
          msImgData = msCanvas.toDataURL('image/jpeg', 0.95);
        } catch {
          msImgData = msCanvas.toDataURL('image/png');
          msFmt = 'PNG';
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

        // Add Marksheet page (Portrait)
        pdf.addPage('a4', 'portrait');
        const p2W = pdf.internal.pageSize.getWidth();
        const p2H = pdf.internal.pageSize.getHeight();
        const msMargin = 6;
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

      const masterFilename = `BSEL_Combined_Student_Records_${students.length}_Students.pdf`;
      triggerDirectPdfDownload(pdf, masterFilename);

      setDownloadSuccess(true);
      setCurrentStep('Combined PDF downloaded!');
      if (showToast) {
        showToast(`Downloaded combined master PDF with ${students.length * 2} pages!`);
      }
    } catch (err) {
      console.error('Master PDF generation failed:', err);
      setErrorMessage(err.message || 'Error generating master combined PDF.');
      if (showToast) {
        showToast('Combined PDF error: ' + (err.message || 'Error'));
      }
    } finally {
      setIsGenerating(false);
      setProgressText('');
    }
  };

  // If autoDownload is requested (e.g. from 'Download merged PDF'), trigger download after templates mount
  useEffect(() => {
    if (data?.autoDownload) {
      const timer = setTimeout(() => {
        if (students.length === 1) {
          handleDownloadSingle(students[0]);
        } else {
          handleDownloadCombinedMasterPdf();
        }
      }, 650);
      return () => clearTimeout(timer);
    }
  }, [data?.autoDownload]);

  const handlePrint = () => {
    window.print();
  };

  if (!students.length || !currentStudentPackage) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-start py-4 px-2 sm:px-4">
      {/* Print Stylesheet */}
      <style>{`
        @media print {
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
          .page-break {
            page-break-before: always !important;
            break-before: page !important;
          }
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

            {/* Single Merged Download Button */}
            <button
              type="button"
              onClick={students.length === 1 ? () => handleDownloadSingle(currentStudentPackage) : handleDownloadCombinedMasterPdf}
              disabled={isGenerating}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-lg text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
              title={students.length === 1 ? "Download Certificate & Marksheet as a single merged PDF file" : "Merge all selected candidates into a single combined multi-page PDF"}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-200" />
                  <span>{progressText ? `Generating (${progressText})...` : 'Generating PDF...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-emerald-200" />
                  <span>
                    {students.length === 1 ? 'Download Merged PDF' : `Download Merged PDF (${students.length} Candidates)`}
                  </span>
                </>
              )}
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-2 bg-[#163e7c] hover:bg-[#1f54a6] text-white rounded-lg text-xs font-black transition flex items-center gap-1.5 border border-white/20 cursor-pointer"
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
        <div className="bg-slate-900/40 p-3 sm:p-5 rounded-2xl border border-amber-400/30 shadow-2xl">
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

        {/* Page 2 Card: Portrait Marksheet */}
        <div className="bg-slate-900/40 p-3 sm:p-5 rounded-2xl border border-sky-400/30 shadow-2xl page-break">
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
      </div>
    </div>
  );
}
