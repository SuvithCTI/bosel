import React, { useRef, useState, useEffect } from 'react';
import {
  ArrowLeft,
  Download,
  Printer,
  Loader2,
  BookOpen,
  CheckCircle2,
  Upload,
  FileText,
  X,
  ExternalLink,
  Trash2,
  FileCheck,
  Eye,
  Plus,
  ChevronLeft,
  ChevronRight,
  Layers,
  FileDown,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import html2canvas from 'html2canvas-pro';

import QuestionPaperCoverPage from './QuestionPaperCoverPage';
import {
  getStudentWorksheets,
  saveStudentWorksheetSlot,
  deleteStudentWorksheetSlot,
} from '../utils/worksheetStorage';
import {
  getStudentRegisterNumber,
  generateCertificateNo,
  getCourseSubjectTitle,
  getStudentScopeKey,
} from '../utils/studentDataHelpers';
import { api } from '../services/api';

// Builds candidate details for the cover page (100% matched to QuestionPaperCoverPage)
export const buildWorksheetDetails = (student, slotNum = 1) => {
  const regNo = student ? getStudentRegisterNumber(student) : 'AB26-004';
  const pType =
    student?.paperType ||
    student?.examCategory ||
    (student?.category && ['A', 'B', 'C', 'D', 'E'].includes(student.category)
      ? student.category
      : 'A');

  const course =
    student?.program ||
    student?.courseName ||
    student?.course ||
    'ABACUS SPEED ARITHMETIC';

  const level =
    student?.grade ||
    student?.level ||
    student?.courseLevel ||
    'LEVEL 1';

  const duration =
    student?.duration ||
    student?.courseDuration ||
    '6 Months';

  const school =
    student?.branch ||
    student?.school ||
    student?.institution ||
    student?.studyCenter ||
    'Tenkasi';

  const branchName = student?.branch
    ? student.branch.replace(/\s+Branch$/i, '').toUpperCase()
    : 'RISING STARS';

  const certNo =
    student?.certificateNo ||
    (student ? generateCertificateNo(student, course, level) : null) ||
    'BSEL/AB/11/0001';

  const subjectTitle = getCourseSubjectTitle(course);

  return {
    regNo,
    certNo,
    studentName: student?.studentName || student?.name || 'Student Name',
    parentName:
      student?.parentName ||
      student?.fatherName ||
      student?.motherName ||
      'Father / Guardian',
    dob: student?.dob || student?.dateOfBirth || '',
    age: student?.age || '',
    gender: student?.gender || 'Male',
    studentClass:
      student?.studentClass ||
      student?.classGrade ||
      student?.standard ||
      '',
    studentStage: student?.studentStage || '',
    phone: student?.phone || student?.mobile || '',
    alternatePhone: student?.alternatePhone || student?.alternativePhone || '',
    course,
    level,
    duration,
    school,
    branchName,
    branchSubtitle: 'VISION FOUNDATION',
    branchTagline: 'EDUCATION • EMPOWERMENT • EXCEL',
    category: pType,
    paperType: pType,
    testBookletTitle: 'PRACTISE WORKSHEET - TEST BOOKLET',
    paperCode: subjectTitle,
    programBrand: 'BSEL MindSparc™',
    subjectTitle,
    ribbonTitle: 'TEST BOOKLET',
  };
};

export default function StudentWorksheetView({
  student,
  initialSlot = 1,
  onClose,
}) {
  const page1Ref = useRef(null);
  const fileInputRef = useRef(null);

  const [activeSlot, setActiveSlot] = useState(initialSlot || 1);
  const [previewMode, setPreviewMode] = useState('booklet'); // 'booklet', 'cover', 'worksheet'
  const [isMerging, setIsMerging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const scopeKey = getStudentScopeKey(student);
  const slots = getStudentWorksheets(scopeKey);
  const currentSlotData = slots.find((s) => s.slot === activeSlot) || {
    slot: activeSlot,
    file: null,
  };
  const activeFile = currentSlotData.file;

  const studentDetails = buildWorksheetDetails(student, activeSlot);

  // Responsive scaling (matches StudentQuestionPaperView)
  const targetDocWidth = 724;
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const availableDocWidth = Math.max(320, windowWidth - 32);
  const docScale =
    windowWidth < 760
      ? Math.min(1, Math.max(0.4, availableDocWidth / targetDocWidth))
      : 1;

  const showTempMsg = (msg) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(''), 3500);
  };

  // Convert dataUrl to Uint8Array safely
  const dataUrlToUint8Array = (dataUrl) => {
    try {
      const base64Index = dataUrl.indexOf(';base64,');
      if (base64Index !== -1) {
        const base64 = dataUrl.substring(base64Index + 8);
        const binaryStr = atob(base64);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        return bytes;
      }
    } catch (e) {
      console.warn('dataUrlToUint8Array error:', e);
    }
    return null;
  };

  // Handle direct file upload for active slot
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    const MAX_MB = 10;
    if (file.size > MAX_MB * 1024 * 1024) {
      showTempMsg(`File too large. Maximum size is ${MAX_MB}MB.`);
      return;
    }

    setIsUploading(true);
    showTempMsg(`Uploading Worksheet ${activeSlot}...`);

    try {
      const uploadRes = await api.uploadFile(file, 'worksheets');
      if (uploadRes && (uploadRes.url || uploadRes.key)) {
        const fileUrl = uploadRes.url || `/api/upload/file/${uploadRes.key}`;
        const formattedSize =
          file.size > 1024 * 1024
            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
            : `${Math.round(file.size / 1024)} KB`;

        const fileData = {
          name: file.name,
          url: fileUrl,
          size: formattedSize,
          type: file.type || 'application/pdf',
          uploadedAt: new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          storage: uploadRes.storage || 'cloud',
        };

        saveStudentWorksheetSlot(scopeKey, activeSlot, fileData);
        setRefreshKey((k) => k + 1);
        showTempMsg(`Worksheet ${activeSlot} uploaded successfully!`);
      } else {
        throw new Error('Upload did not return a valid URL.');
      }
    } catch (err) {
      console.error('Worksheet upload error:', err);
      showTempMsg(`Upload failed: ${err.message || 'Please try again'}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle slot file deletion
  const handleDeleteSlotFile = () => {
    if (!activeFile) return;
    const ok = window.confirm(
      `Delete Worksheet ${activeSlot} (${activeFile.name}) for ${studentDetails.studentName}?`
    );
    if (!ok) return;

    deleteStudentWorksheetSlot(scopeKey, activeSlot);
    setRefreshKey((k) => k + 1);
    showTempMsg(`Worksheet ${activeSlot} removed.`);
  };

  // Generates combined PDF blob (Cover Page + attached file)
  const generateMergedPdfBlob = async (targetFiles = []) => {
    if (!page1Ref.current) return null;

    try {
      // 1. Render Cover Page (Question Paper Front Page)
      const canvas = await html2canvas(page1Ref.current, {
        scale: 2.0,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#ffffff',
        ignoreElements: (el) =>
          el.classList?.contains('no-print') ||
          el.classList?.contains('print:hidden'),
        onclone: (clonedDoc, clonedEl) => {
          clonedEl.style.transform = 'none';
          clonedEl.style.margin = '0 auto';
        },
      });

      const coverDataUrl = canvas.toDataURL('image/png');
      const coverBytes =
        dataUrlToUint8Array(coverDataUrl) ||
        (await fetch(coverDataUrl).then((r) => r.arrayBuffer()));

      // 2. Initialize PDFDocument from pdf-lib
      const { PDFDocument } = await import('pdf-lib');
      const mergedDoc = await PDFDocument.create();

      const a4W = 595.28;
      const a4H = 841.89;
      const coverImage = await mergedDoc.embedPng(coverBytes);
      const coverPage = mergedDoc.addPage([a4W, a4H]);

      const margin = 14;
      const availW = a4W - margin * 2;
      const availH = a4H - margin * 2;
      const aspect = coverImage.width / coverImage.height;
      let rW = availW;
      let rH = availW / aspect;
      if (rH > availH) {
        rH = availH;
        rW = availH * aspect;
      }
      const posX = (a4W - rW) / 2;
      const posY = (a4H - rH) / 2;

      coverPage.drawImage(coverImage, {
        x: posX,
        y: posY,
        width: rW,
        height: rH,
      });

      // 3. Append target file(s)
      for (const f of targetFiles) {
        if (!f?.url) continue;
        const isPdf =
          f.type?.includes('pdf') ||
          f.name?.toLowerCase().endsWith('.pdf') ||
          f.url?.toLowerCase().includes('.pdf');
        const isImg =
          f.type?.startsWith('image/') ||
          f.name?.match(/\.(png|jpe?g|webp|gif|bmp)$/i) ||
          f.url?.match(/\.(png|jpe?g|webp|gif|bmp)$/i);

        if (isPdf) {
          try {
            const pdfBytes =
              dataUrlToUint8Array(f.url) ||
              (await fetch(f.url).then((r) => r.arrayBuffer()));
            const donorDoc = await PDFDocument.load(pdfBytes, {
              ignoreEncryption: true,
            });
            const copiedPages = await mergedDoc.copyPages(
              donorDoc,
              donorDoc.getPageIndices()
            );
            copiedPages.forEach((p) => mergedDoc.addPage(p));
          } catch (pdfErr) {
            console.warn('PDF donor copy error:', pdfErr);
          }
        } else if (isImg) {
          try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = f.url;
            await new Promise((res, rej) => {
              if (img.complete) res();
              else {
                img.onload = res;
                img.onerror = rej;
              }
            });

            const offscreen = document.createElement('canvas');
            offscreen.width = img.naturalWidth || 800;
            offscreen.height = img.naturalHeight || 1100;
            const ctx = offscreen.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const normPng = offscreen.toDataURL('image/png');
            const imgBytes =
              dataUrlToUint8Array(normPng) ||
              (await fetch(normPng).then((r) => r.arrayBuffer()));
            const embeddedImg = await mergedDoc.embedPng(imgBytes);

            const imgPage = mergedDoc.addPage([a4W, a4H]);
            const imgAspect = embeddedImg.width / embeddedImg.height;
            let imgW = availW;
            let imgH = availW / imgAspect;
            if (imgH > availH) {
              imgH = availH;
              imgW = availH * imgAspect;
            }
            const imgX = (a4W - imgW) / 2;
            const imgY = (a4H - imgH) / 2;

            imgPage.drawImage(embeddedImg, {
              x: imgX,
              y: imgY,
              width: imgW,
              height: imgH,
            });
          } catch (imgErr) {
            console.warn('Image embed error:', imgErr);
          }
        }
      }

      const mergedBytes = await mergedDoc.save();
      return new Blob([mergedBytes], { type: 'application/pdf' });
    } catch (err) {
      console.error('generateMergedPdfBlob error:', err);
      return null;
    }
  };

  // Merge & Download PDF
  const handleMergeAndDownload = async () => {
    setIsMerging(true);
    showTempMsg('Generating merged PDF (Front Page + Worksheet)...');

    const targetFiles = activeFile ? [activeFile] : [];
    const cleanName = (studentDetails.studentName || 'Student').replace(
      /\s+/g,
      '_'
    );
    const fileName = `${studentDetails.regNo}_${cleanName}_Worksheet_${activeSlot}_Merged.pdf`;

    try {
      const blob = await generateMergedPdfBlob(targetFiles);
      if (!blob) throw new Error('Could not create PDF.');

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 1000);
      showTempMsg(`Downloaded: ${fileName}`);
    } catch (err) {
      console.error('Merge download error:', err);
      showTempMsg(`Failed: ${err.message || 'Error'}`);
    } finally {
      setIsMerging(false);
    }
  };

  // Merge ALL uploaded worksheets + Front Page
  const handleMergeAllWorksheets = async () => {
    const uploadedList = slots.filter((s) => s.file && s.file.url).map((s) => s.file);
    if (uploadedList.length === 0) {
      showTempMsg('No worksheets uploaded yet.');
      return;
    }

    setIsMerging(true);
    showTempMsg(`Merging Front Page + all ${uploadedList.length} worksheets...`);

    const cleanName = (studentDetails.studentName || 'Student').replace(
      /\s+/g,
      '_'
    );
    const fileName = `${studentDetails.regNo}_${cleanName}_All_Worksheets_Booklet.pdf`;

    try {
      const blob = await generateMergedPdfBlob(uploadedList);
      if (!blob) throw new Error('Could not create merged PDF.');

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 1000);
      showTempMsg(`Downloaded: ${fileName}`);
    } catch (err) {
      console.error('Merge all error:', err);
      showTempMsg(`Failed: ${err.message || 'Error'}`);
    } finally {
      setIsMerging(false);
    }
  };

  // Download Front Page Only
  const handleDownloadFrontPage = async () => {
    setIsMerging(true);
    showTempMsg('Generating Front Page PDF...');
    const cleanName = (studentDetails.studentName || 'Student').replace(
      /\s+/g,
      '_'
    );
    const fileName = `${studentDetails.regNo}_${cleanName}_Front_Page.pdf`;

    try {
      const blob = await generateMergedPdfBlob([]);
      if (!blob) throw new Error('Could not create Front Page PDF.');

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 1000);
      showTempMsg(`Downloaded: ${fileName}`);
    } catch (err) {
      console.error('Front page PDF error:', err);
      showTempMsg(`Failed: ${err.message || 'Error'}`);
    } finally {
      setIsMerging(false);
    }
  };

  // Print Booklet
  const handlePrint = async () => {
    showTempMsg('Preparing document for print...');
    try {
      window.print();
    } catch (e) {
      console.error('Print error:', e);
    }
  };

  const uploadedCount = slots.filter((s) => s.file && s.file.url).length;

  return (
    <div className="fixed inset-0 z-[150] bg-slate-900/90 backdrop-blur-xs overflow-y-auto flex flex-col items-center p-2 sm:p-4 select-none animate-fadeIn">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Print Stylesheet */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .printable-worksheet-booklet, .printable-worksheet-booklet * {
            visibility: visible !important;
          }
          .printable-worksheet-booklet {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            background: white !important;
          }
          .print-page-break {
            page-break-after: always !important;
            break-after: page !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Toast Feedback */}
      {statusMsg && (
        <div className="no-print fixed top-16 z-[160] bg-emerald-600 text-white text-xs font-black px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-emerald-300 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* =========================================================================
          TOP ACTION TOOLBAR (Identical in structure to Question Paper)
          ========================================================================= */}
      <div className="no-print w-full max-w-[840px] bg-[#0c234b] text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sticky top-2 z-[100] border border-amber-400/40 mb-3">
        {/* Left: Back button & Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0 border border-white/15"
            title="Close and return"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-300" />
            <span>Back</span>
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-white truncate">
                {studentDetails.studentName}
              </span>
              <span className="font-mono text-xs text-amber-300 font-bold bg-white/10 px-1.5 py-0.2 rounded border border-white/15 shrink-0">
                {studentDetails.regNo}
              </span>
            </div>
            <p className="text-[10px] text-slate-300 truncate">
              {studentDetails.course} • {studentDetails.level}
            </p>
          </div>
        </div>

        {/* Center: Slot Switcher Pills (Worksheet 1, 2, 3, 4) */}
        <div className="flex items-center bg-white/10 p-0.5 rounded-xl border border-white/15 self-start sm:self-auto shrink-0">
          {[1, 2, 3, 4].map((slotNum) => {
            const slotItem = slots.find((s) => s.slot === slotNum);
            const hasFile = Boolean(slotItem?.file?.url);
            const isActive = slotNum === activeSlot;
            return (
              <button
                key={slotNum}
                type="button"
                onClick={() => {
                  setActiveSlot(slotNum);
                  setPreviewMode('booklet');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>WS {slotNum}</span>
                {hasFile && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? 'bg-slate-950' : 'bg-emerald-400'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-1.5 flex-wrap shrink-0">
          {/* Upload Button */}
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 active:scale-95 text-white rounded-lg text-xs font-black transition flex items-center gap-1.5 shadow-md cursor-pointer border border-sky-300/40 disabled:opacity-50"
            title={`Upload or replace file for Worksheet ${activeSlot}`}
          >
            {isUploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5 text-amber-300" />
            )}
            <span>{activeFile ? 'Replace File' : 'Upload'}</span>
          </button>

          {/* Merge & Download PDF */}
          <button
            type="button"
            disabled={isMerging}
            onClick={handleMergeAndDownload}
            className="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 rounded-lg text-xs font-black transition flex items-center gap-1 shadow-sm cursor-pointer disabled:opacity-50"
            title="Download merged PDF (Front Page + Worksheet)"
          >
            {isMerging ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileDown className="w-3.5 h-3.5" />
            )}
            <span>Merge PDF</span>
          </button>

          {/* Front Page PDF */}
          <button
            type="button"
            disabled={isMerging}
            onClick={handleDownloadFrontPage}
            className="px-2 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-white/20"
            title="Download Front Page only as PDF"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Front Page</span>
          </button>

          {/* Print */}
          <button
            type="button"
            onClick={handlePrint}
            className="p-1.5 bg-white/15 hover:bg-white/25 active:scale-95 text-white rounded-lg transition cursor-pointer border border-white/20"
            title="Print Worksheet Booklet (Front Page + Attached Worksheet)"
          >
            <Printer className="w-4 h-4 text-amber-300" />
          </button>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 bg-white/10 hover:bg-rose-600 active:scale-95 text-white rounded-lg transition cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          BATCH BANNER (If multiple worksheets uploaded, allow 1-click merge all)
          ========================================================================= */}
      {uploadedCount > 1 && (
        <div className="no-print w-full max-w-[840px] bg-gradient-to-r from-amber-500/20 via-sky-500/20 to-indigo-500/20 border border-amber-400/30 text-white px-3.5 py-1.5 rounded-xl shadow-xs flex items-center justify-between gap-2 mb-3 text-xs">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-200">
              <strong className="text-amber-300 font-bold">
                {uploadedCount} of 4 worksheets
              </strong>{' '}
              uploaded for this student.
            </span>
          </div>
          <button
            type="button"
            disabled={isMerging}
            onClick={handleMergeAllWorksheets}
            className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-lg text-[11px] transition cursor-pointer active:scale-95 shadow-xs flex items-center gap-1 disabled:opacity-50"
          >
            <Download className="w-3 h-3" />
            <span>Download All ({uploadedCount}) Merged Booklet</span>
          </button>
        </div>
      )}

      {/* =========================================================================
          BOOKLET CONTAINER: PAGE 1 (FRONT PAGE) + PAGE 2 (WORKSHEET FILE / UPLOAD)
          ========================================================================= */}
      <div
        className="printable-worksheet-booklet w-full flex justify-center pb-12"
        style={{
          touchAction: 'pan-y',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div
          style={{
            width: `${targetDocWidth}px`,
            minWidth: `${targetDocWidth}px`,
            transform: docScale < 1 ? `scale(${docScale})` : 'none',
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
            touchAction: 'pan-y',
          }}
        >
          <div className="w-[724px] max-w-[724px] mx-auto bg-white rounded-xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col">
            {/* PAGE 1: EXACT QUESTION PAPER FRONT PAGE */}
            <div
              ref={page1Ref}
              className="print-page-1 print-page-break relative block w-[724px] max-w-[724px] mx-auto bg-white"
            >
              <QuestionPaperCoverPage
                student={student}
                details={studentDetails}
              />
            </div>

            {/* PERFORATION / SEAMLESS SECTION DIVIDER */}
            <div className="no-print relative w-full bg-slate-100 py-2.5 px-4 border-t-2 border-b-2 border-dashed border-slate-300 flex items-center justify-between text-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-700" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-900 font-sans">
                  Practise Worksheet Section: Worksheet {activeSlot}
                </span>
                {activeFile && (
                  <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full text-[10px] font-black border border-emerald-300 font-sans">
                    File Attached
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 bg-[#0c234b] hover:bg-[#123068] text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer shadow-xs active:scale-95 font-sans"
                >
                  <Plus className="w-3 h-3 text-amber-400" />
                  <span>{activeFile ? 'Change File' : 'Upload File'}</span>
                </button>
                {activeFile && (
                  <button
                    type="button"
                    onClick={handleDeleteSlotFile}
                    className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer font-sans"
                    title="Remove this worksheet file"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>

            {/* PAGE 2+: WORKSHEET FILE SECTION / UPLOAD DROPZONE */}
            <div className="w-full bg-white p-4 sm:p-5">
              {activeFile && activeFile.url ? (
                <div className="space-y-3">
                  {/* File Info Bar */}
                  <div className="no-print p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p
                          className="text-xs font-black text-slate-900 truncate"
                          title={activeFile.name}
                        >
                          {activeFile.name}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                          Size: {activeFile.size} • Uploaded:{' '}
                          {activeFile.uploadedAt}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={activeFile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                        title="Open file in new tab"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Fullscreen</span>
                      </a>
                      <a
                        href={activeFile.url}
                        download={activeFile.name}
                        className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                        title="Download raw file"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </a>
                    </div>
                  </div>

                  {/* Embedded File Preview */}
                  <div className="border border-slate-300 rounded-xl overflow-hidden bg-slate-50 shadow-sm">
                    {activeFile.url?.endsWith('.pdf') ||
                    activeFile.type?.includes('pdf') ||
                    activeFile.url?.includes('application/pdf') ? (
                      <iframe
                        src={activeFile.url}
                        title={`Worksheet ${activeSlot} PDF`}
                        className="w-full h-[750px] bg-white"
                      />
                    ) : activeFile.type?.startsWith('image/') ||
                      activeFile.url?.match(
                        /\.(jpeg|jpg|png|webp|gif|bmp)$/i
                      ) ||
                      activeFile.name?.match(
                        /\.(jpeg|jpg|png|webp|gif|bmp)$/i
                      ) ? (
                      <div className="w-full flex flex-col items-center justify-start p-2 bg-slate-100">
                        <img
                          src={activeFile.url}
                          alt={activeFile.name}
                          className="max-w-full h-auto rounded-lg shadow-md border border-slate-200 bg-white object-contain"
                        />
                      </div>
                    ) : (
                      <div className="text-center p-8 bg-slate-50 rounded-xl">
                        <FileText className="w-12 h-12 text-blue-700 mx-auto mb-2" />
                        <h4 className="text-sm font-black text-slate-900">
                          {activeFile.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 mb-4">
                          Document is ready. Click below to download.
                        </p>
                        <a
                          href={activeFile.url}
                          download={activeFile.name}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0c234b] text-white text-xs font-bold"
                        >
                          <Download className="w-3.5 h-3.5 text-amber-400" />
                          <span>Download File</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Empty Slot: Clean Upload Dropzone right underneath Page 1 */
                <div className="no-print border-2 border-dashed border-slate-300 hover:border-amber-400 bg-slate-50 hover:bg-amber-50/30 rounded-2xl p-8 text-center transition cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3 shadow-xs">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900">
                    Upload Worksheet {activeSlot}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                    Click here or browse to attach a PDF or image worksheet for{' '}
                    <strong className="text-slate-800">
                      {studentDetails.studentName}
                    </strong>
                    . It will attach directly behind the Front Page.
                  </p>
                  <button
                    type="button"
                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0c234b] hover:bg-[#143B7A] text-white text-xs font-black transition shadow-sm active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    <span>Choose Worksheet File</span>
                  </button>
                  <p className="text-[10px] text-slate-400 mt-2">
                    Supports PDF, PNG, JPG, JPEG up to 10MB
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
