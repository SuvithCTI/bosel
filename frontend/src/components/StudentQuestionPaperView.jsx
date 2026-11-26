import React, { useRef, useState, useEffect } from 'react';
import {
  ArrowLeft,
  Download,
  Printer,
  Loader2,
  Edit3,
  RotateCcw,
  Save,
  BookOpen,
  CheckCircle2,
  Unlock,
  Shuffle,
  Upload,
  FileText,
  X,
  ExternalLink,
  Paperclip,
  Trash2,
  FileUp,
  FileQuestion,
  Eye,
  Plus,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import { exportPdfFromElement, triggerDirectPdfDownload } from '../utils/pdfExport';
import {
  getStudentRegisterNumber,
  getStudentPhotoUrl,
  generateCertificateNo,
  getCourseSubjectTitle,
  getStudentScopeKey,
  readStudentUploadedQuestions,
  saveStudentUploadedQuestions,
} from '../utils/studentDataHelpers';
import QuestionPaperCoverPage from './QuestionPaperCoverPage';

// Paper types printed on the question paper
export const PAPER_TYPES = ['A', 'B', 'C', 'D', 'E'];

// Random pick (used by the "Random Type" button)
const randomPaperType = () =>
  PAPER_TYPES[Math.floor(Math.random() * PAPER_TYPES.length)];

// Maintained for backward compatibility with external imports
export const DEFAULT_ABACUS_SUMS = [
  { id: 's1', label: 'S1', nums: [2, 8, -7, 5], ans: 8 },
  { id: 's2', label: 'S2', nums: [3, 5, 7, -8], ans: 7 },
  { id: 's3', label: 'S3', nums: [6, 3, 9, -9], ans: 9 },
  { id: 's4', label: 'S4', nums: [1, 8, 1, -1], ans: 9 },
  { id: 's5', label: 'S5', nums: [9, 7, -1, -6], ans: 9 },
  { id: 's6', label: 'S6', nums: [2, 5, 5, -8], ans: 4 },
  { id: 's7', label: 'S7', nums: [6, 4, -9, 3], ans: 4 },
  { id: 's8', label: 'S8', nums: [9, 1, -3, 2], ans: 9 },
  { id: 's9', label: 'S9', nums: [6, 5, -2, 7], ans: 16 },
  { id: 's10', label: 'S10', nums: [2, 8, -4, -1], ans: 5 },
  { id: 's11', label: 'S11', nums: [9, 5, 6, -5], ans: 15 },
  { id: 's12', label: 'S12', nums: [9, 1, -6, 8], ans: 12 },
  { id: 's13', label: 'S13', nums: [8, 3, -5, 2], ans: 8 },
  { id: 's14', label: 'S14', nums: [7, 4, -9, 6], ans: 8 },
  { id: 's15', label: 'S15', nums: [6, -1, 5, -9], ans: 1 },
  { id: 's16', label: 'S16', nums: [1, 3, 6, -7], ans: 3 },
  { id: 's17', label: 'S17', nums: [9, 2, -7, -3], ans: 1 },
  { id: 's18', label: 'S18', nums: [6, 5, 2, -9], ans: 4 },
  { id: 's19', label: 'S19', nums: [8, 2, -9, 7], ans: 8 },
  { id: 's20', label: 'S20', nums: [7, 4, -4, 3], ans: 10 },
  { id: 's21', label: 'S21', nums: [4, 6, -2, 7], ans: 15 },
  { id: 's22', label: 'S22', nums: [9, 8, 3, -4], ans: 16 },
  { id: 's23', label: 'S23', nums: [4, 8, 7, -6], ans: 13 },
  { id: 's24', label: 'S24', nums: [4, 9, -3, -7], ans: 3 },
  { id: 's25', label: 'S25', nums: [9, 8, -7, -6], ans: 4 },
  { id: 's26', label: 'S26', nums: [83, 6, -7], ans: 82 },
  { id: 's27', label: 'S27', nums: [74, 6, -7], ans: 73 },
  { id: 's28', label: 'S28', nums: [43, -5, 2], ans: 40 },
  { id: 's29', label: 'S29', nums: [28, 3, -4], ans: 27 },
  { id: 's30', label: 'S30', nums: [67, -8, -2], ans: 57 },
  { id: 's31', label: 'S31', nums: [88, 3, -5], ans: 86 },
  { id: 's32', label: 'S32', nums: [14, 5, -6], ans: 13 },
  { id: 's33', label: 'S33', nums: [12, 7, 1], ans: 20 },
  { id: 's34', label: 'S34', nums: [24, -3, 6], ans: 27 },
  { id: 's35', label: 'S35', nums: [27, -8, -2], ans: 17 },
  { id: 's36', label: 'S36', nums: [38, 3, -5], ans: 36 },
  { id: 's37', label: 'S37', nums: [14, -5, -3], ans: 6 },
  { id: 's38', label: 'S38', nums: [34, 5, -7, -8], ans: 24 },
  { id: 's39', label: 'S39', nums: [73, -4, -8, -5], ans: 56 },
  { id: 's40', label: 'S40', nums: [48, -7, 3, -2], ans: 42 },
  { id: 's41', label: 'S41', nums: [23, 8, 7, 4], ans: 42 },
  { id: 's42', label: 'S42', nums: [13, 7, 8, -9], ans: 19 },
  { id: 's43', label: 'S43', nums: [25, -6, 8, -2], ans: 25 },
  { id: 's44', label: 'S44', nums: [13, -4, -8, 2], ans: 3 },
  { id: 's45', label: 'S45', nums: [23, -5, 8, 3], ans: 29 },
  { id: 's46', label: 'S46', nums: [37, -6, 2, 5], ans: 38 },
  { id: 's47', label: 'S47', nums: [24, -3, 7, -2], ans: 26 },
  { id: 's48', label: 'S48', nums: [34, -1, -5, -7], ans: 21 },
  { id: 's49', label: 'S49', nums: [96, -5, -5, -9], ans: 77 },
  { id: 's50', label: 'S50', nums: [87, -6, -5, -8], ans: 68 },
];

export const DEFAULT_SUBJECT_MODULES = [
  { id: 1, name: 'Abacus Operations', max: 100, assessment: 100, marks: 96, pct: '96%' },
  { id: 2, name: 'Mental Arithmetic', max: 100, assessment: 100, marks: 98, pct: '98%' },
  { id: 3, name: 'Abacus Calculation', max: 100, assessment: 100, marks: 94, pct: '94%' },
  { id: 4, name: 'Rapid Calculation', max: 100, assessment: 100, marks: 97, pct: '97%' },
  { id: 5, name: 'Numerical Proficiency', max: 100, assessment: 100, marks: 95, pct: '95%' }
];

// Stable pick per student (same student always gets the same type)
export const typeFromSeed = (seed) => {
  let h = 0;
  for (const ch of String(seed || 'bsel')) {
    h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  }
  return PAPER_TYPES[h % PAPER_TYPES.length];
};

const buildDefaultDetails = (student, regNoOverride) => {
  const regNo = regNoOverride || (student ? getStudentRegisterNumber(student) : 'AB26-004, HW22-001');
  const pType = student?.paperType || student?.examCategory || (student?.category && ['A', 'B', 'C', 'D', 'E'].includes(student.category) ? student.category : 'A');

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
    studentName: student?.studentName || student?.name || 'DEMO 1326',
    parentName: student?.parentName || student?.fatherName || student?.motherName || 'Father',
    dob: student?.dob || student?.dateOfBirth || '2016-11-13',
    age: student?.age || '',
    gender: student?.gender || 'Male',
    studentClass: student?.studentClass || student?.classGrade || '',
    studentStage: student?.studentStage || '',
    phone: student?.phone || student?.mobile || '',
    alternatePhone: student?.alternatePhone || student?.alternativePhone || '',
    aadhaar: student?.aadharNumber || student?.aadhaarNumber || student?.aadhaar || '',
    address: student?.address || '',
    village: student?.village || '',
    city: student?.city || '',
    district: student?.district || '',
    pincode: student?.pincode || student?.pinCode || '',
    course,
    level,
    duration,
    school,
    branchName,
    branchSubtitle: 'VISION FOUNDATION',
    branchTagline: 'EDUCATION • EMPOWERMENT • EXCEL',
    category: pType,
    paperType: pType,
    testBookletTitle: 'LEVEL EXAMINATION - TEST BOOKLET',
    paperCode: subjectTitle,
    programBrand: 'BSEL MindSparc™',
    subjectTitle,
    ribbonTitle: 'TEST BOOKLET',
  };
};

export default function StudentQuestionPaperView({ student, onClose }) {
  const page1Ref = useRef(null);
  const questionsFileInputRef = useRef(null);
  const attachedQuestionsRef = useRef(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const regNo = getStudentRegisterNumber(student);
  const storageKey = `bsel_custom_qp_${regNo || student?.id || 'default'}`;
  const scopeKey = getStudentScopeKey(student);

  // 1. Uploaded questions files state (scoped to student, supports multiple files)
  const normalizeFiles = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'object') return [val];
    return [];
  };

  const [uploadedFiles, setUploadedFiles] = useState(() => {
    return normalizeFiles(readStudentUploadedQuestions(scopeKey));
  });

  const [activeFileIndex, setActiveFileIndex] = useState(0);

  useEffect(() => {
    const saved = normalizeFiles(readStudentUploadedQuestions(scopeKey));
    setUploadedFiles(saved);
    setActiveFileIndex(0);
  }, [scopeKey]);

  useEffect(() => {
    const handleQuestionsUpdate = (e) => {
      if (e.detail?.scopeKey === scopeKey) {
        setUploadedFiles(normalizeFiles(e.detail?.fileData));
      }
    };
    window.addEventListener('bsel_student_questions_updated', handleQuestionsUpdate);
    return () => window.removeEventListener('bsel_student_questions_updated', handleQuestionsUpdate);
  }, [scopeKey]);

  // 2. Student & Exam Meta State
  const [studentDetails, setStudentDetails] = useState(() => {
    const defaults = buildDefaultDetails(student, regNo);
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.studentDetails) {
          const isStaleDemo =
            parsed.studentDetails.studentName === 'DEMO 1326' &&
            student?.studentName &&
            student.studentName !== 'DEMO 1326';
          if (!isStaleDemo) {
            return { ...defaults, ...parsed.studentDetails };
          }
        }
      }
    } catch {
      // ignore
    }
    return defaults;
  });

  // Synchronize student details dynamically whenever student changes
  useEffect(() => {
    if (student) {
      const defaults = buildDefaultDetails(student, regNo);
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.studentDetails) {
            const isStaleDemo =
              parsed.studentDetails.studentName === 'DEMO 1326' &&
              student.studentName &&
              student.studentName !== 'DEMO 1326';
            if (!isStaleDemo) {
              setStudentDetails({ ...defaults, ...parsed.studentDetails });
              return;
            }
          }
        }
      } catch {
        // ignore
      }
      setStudentDetails(defaults);
    }
  }, [
    student?.id,
    student?.userId,
    student?.admissionNo,
    student?.registerNumber,
    student?.studentName,
    student?.name,
    student?.program,
    student?.courseName,
    student?.grade,
    student?.level,
    student?.branch,
    storageKey,
  ]);

  // Handler to update student details
  const updateDetail = (field, val) => {
    setStudentDetails((prev) => ({ ...prev, [field]: val }));
  };

  // Set paper type directly (A-E)
  const setPaperType = (type) => {
    updateDetail('paperType', type);
  };

  // Pick a random paper type
  const handleRandomType = () => {
    updateDetail('paperType', randomPaperType());
  };

  // Save changes to localStorage
  const handleSave = () => {
    try {
      const payload = { studentDetails };
      localStorage.setItem(storageKey, JSON.stringify(payload));
      showTempMsg('All question paper changes saved successfully!');
    } catch (e) {
      console.error('Save failed:', e);
      showTempMsg('Could not save changes. Please try again.');
    }
  };

  // Reset to template default
  const handleReset = () => {
    if (!window.confirm('Reset all changes back to original student admission data?')) return;
    localStorage.removeItem(storageKey);
    setStudentDetails(buildDefaultDetails(student, regNo));
    showTempMsg('Reset to original admission details.');
  };

  // Mobile responsive zoom & scale calculation
  const [windowWidth, setWindowWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1024));
  const combinedBookletRef = useRef(null);
  const [measuredCombinedHeight, setMeasuredCombinedHeight] = useState(1100);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!combinedBookletRef.current) return;
    const updateH = () => {
      if (combinedBookletRef.current?.offsetHeight) {
        setMeasuredCombinedHeight(combinedBookletRef.current.offsetHeight);
      }
    };
    updateH();
    const ro = new ResizeObserver(updateH);
    ro.observe(combinedBookletRef.current);
    return () => ro.disconnect();
  }, [uploadedFiles, isEditMode, activeFileIndex]);

  const isMobileScreen = windowWidth < 768;
  const targetDocWidth = 724;
  const availableDocWidth = Math.max(300, windowWidth - (isMobileScreen ? 16 : 32));
  const docScale = windowWidth < 760 ? Math.min(1, Math.max(0.35, availableDocWidth / targetDocWidth)) : 1;

  const showTempMsg = (msg) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const [isPrinting, setIsPrinting] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState('merged'); // 'merged' | 'raw'
  const mergedBlobUrlRef = useRef(null);

  // Helper to convert dataUrl to Uint8Array safely without fetch overhead
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
      console.warn('dataUrlToUint8Array conversion error:', e);
    }
    return null;
  };

  // Generates a unified merged PDF Blob containing Page 1 (Cover Page) + all pages from uploaded documents (PDF / Images)
  const generateMergedPdfBlob = async () => {
    if (!page1Ref.current) return null;

    try {
      // 1. Render Page 1 (Question Paper Cover Page) to high-resolution PNG
      const canvas = await html2canvas(page1Ref.current, {
        scale: 2.0,
        useCORS: true,
        allowTaint: false,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 1024,
        backgroundColor: '#ffffff',
        ignoreElements: (el) => el.classList?.contains('no-print') || el.classList?.contains('print:hidden'),
        onclone: (clonedDoc, clonedEl) => {
          clonedEl.style.transform = 'none';
          clonedEl.style.margin = '0 auto';
          let p = clonedEl.parentElement;
          while (p) {
            if (p.style) {
              p.style.transform = 'none';
              p.style.height = 'auto';
            }
            p = p.parentElement;
          }
        }
      });

      let page1DataUrl = null;
      try {
        page1DataUrl = canvas.toDataURL('image/png');
      } catch (_) {
        page1DataUrl = canvas.toDataURL('image/jpeg', 0.95);
      }

      const page1Bytes = dataUrlToUint8Array(page1DataUrl) || (await fetch(page1DataUrl).then((r) => r.arrayBuffer()));

      // 2. Initialize PDFDocument from pdf-lib (dynamic import for reliable loading and code-splitting)
      const { PDFDocument } = await import('pdf-lib');
      const mergedDoc = await PDFDocument.create();

      // Standard A4 dimensions in PDF points: 595.28 x 841.89
      const a4W = 595.28;
      const a4H = 841.89;
      const page1Image = await mergedDoc.embedPng(page1Bytes);
      const coverPage = mergedDoc.addPage([a4W, a4H]);

      const margin = 14;
      const availW = a4W - margin * 2;
      const availH = a4H - margin * 2;
      const aspect = page1Image.width / page1Image.height;
      let rW = availW;
      let rH = availW / aspect;
      if (rH > availH) {
        rH = availH;
        rW = availH * aspect;
      }
      const posX = (a4W - rW) / 2;
      const posY = (a4H - rH) / 2;

      coverPage.drawImage(page1Image, {
        x: posX,
        y: posY,
        width: rW,
        height: rH,
      });

      // 3. Append uploaded documents (PDFs or Images)
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        if (!file?.dataUrl) continue;

        const isPdf = file.fileType?.includes('pdf') || file.fileName?.toLowerCase().endsWith('.pdf');
        const isImage = file.fileType?.startsWith('image/') || file.fileName?.match(/\.(png|jpe?g|webp|gif|bmp|svg)$/i);

        if (isPdf) {
          try {
            const pdfBytes = dataUrlToUint8Array(file.dataUrl) || (await fetch(file.dataUrl).then((r) => r.arrayBuffer()));
            const donorDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
            const donorPageIndices = donorDoc.getPageIndices();
            const copiedPages = await mergedDoc.copyPages(donorDoc, donorPageIndices);
            copiedPages.forEach((donorPage) => {
              mergedDoc.addPage(donorPage);
            });
          } catch (pdfErr) {
            console.warn('Could not merge uploaded PDF document directly:', pdfErr);
          }
        } else if (isImage) {
          try {
            const img = new Image();
            img.src = file.dataUrl;
            await new Promise((resolve, reject) => {
              if (img.complete) resolve();
              else {
                img.onload = resolve;
                img.onerror = reject;
              }
            });

            // Draw onto canvas to normalize to PNG format
            const offscreen = document.createElement('canvas');
            offscreen.width = img.naturalWidth || 800;
            offscreen.height = img.naturalHeight || 1100;
            const ctx = offscreen.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const normalizedPng = offscreen.toDataURL('image/png');
            const imgBytes = dataUrlToUint8Array(normalizedPng) || (await fetch(normalizedPng).then((r) => r.arrayBuffer()));
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
            console.warn('Could not embed uploaded image:', imgErr);
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

  // PDF Export - merges Question Paper 1st page + uploaded document(s) into one single PDF
  const handleDownloadPdf = async () => {
    if (isGeneratingPdf || !page1Ref.current) return;
    setIsGeneratingPdf(true);

    try {
      showTempMsg('Merging question paper with uploaded document...');
      const mergedBlob = await generateMergedPdfBlob();
      if (!mergedBlob) throw new Error('Could not create merged PDF.');

      const filename = `${studentDetails.regNo}_${studentDetails.studentName.replace(/\s+/g, '_')}_Combined_Question_Paper.pdf`;
      const blobUrl = URL.createObjectURL(mergedBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 4000);
      showTempMsg('Merged question paper PDF downloaded successfully!');
    } catch (err) {
      console.error('PDF export error:', err);
      // Fallback to exportPdfFromElement
      try {
        const filename = `${studentDetails.regNo}_${studentDetails.studentName.replace(/\s+/g, '_')}_BSEL_Question_Paper.pdf`;
        await exportPdfFromElement(page1Ref.current, {
          filename,
          orientation: 'portrait',
          margin: 5,
          scale: 2.2,
        });
        showTempMsg('Exported question paper cover page.');
      } catch {
        showTempMsg('Could not export PDF. Please try printing.');
      }
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Print handler - prints merged document (Page 1 + uploaded PDF / images)
  const handlePrint = async () => {
    if (uploadedFiles.length === 0) {
      window.print();
      return;
    }

    setIsPrinting(true);
    showTempMsg('Preparing merged question paper for printing...');
    try {
      const mergedBlob = await generateMergedPdfBlob();
      if (!mergedBlob) {
        window.print();
        return;
      }

      const blobUrl = URL.createObjectURL(mergedBlob);
      const printIframe = document.createElement('iframe');
      printIframe.style.position = 'fixed';
      printIframe.style.top = '-9999px';
      printIframe.style.left = '-9999px';
      printIframe.style.width = '1px';
      printIframe.style.height = '1px';
      printIframe.style.border = 'none';
      printIframe.src = blobUrl;
      document.body.appendChild(printIframe);

      printIframe.onload = () => {
        setTimeout(() => {
          try {
            printIframe.contentWindow?.focus();
            printIframe.contentWindow?.print();
          } catch (printErr) {
            console.warn('Iframe print failed, opening popup print window:', printErr);
            const win = window.open(blobUrl, '_blank');
            win?.focus();
            win?.print();
          }
          setTimeout(() => {
            document.body.removeChild(printIframe);
            URL.revokeObjectURL(blobUrl);
          }, 60000);
        }, 400);
      };
    } catch (err) {
      console.error('Print generation failed:', err);
      window.print();
    } finally {
      setIsPrinting(false);
    }
  };

  // Live merged PDF preview generator: compiles Page 1 + uploaded files into a single preview starting from 1st page
  useEffect(() => {
    let isCancelled = false;

    const createPreview = async () => {
      if (uploadedFiles.length === 0 || !page1Ref.current) {
        if (mergedBlobUrlRef.current) {
          URL.revokeObjectURL(mergedBlobUrlRef.current);
          mergedBlobUrlRef.current = null;
        }
        setMergedPdfUrl(null);
        return;
      }

      setIsGeneratingPreview(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 200));
        const blob = await generateMergedPdfBlob();
        if (blob && !isCancelled) {
          if (mergedBlobUrlRef.current) {
            URL.revokeObjectURL(mergedBlobUrlRef.current);
          }
          const url = URL.createObjectURL(blob);
          mergedBlobUrlRef.current = url;
          setMergedPdfUrl(url);
        }
      } catch (err) {
        console.error('Error generating merged preview:', err);
      } finally {
        if (!isCancelled) {
          setIsGeneratingPreview(false);
        }
      }
    };

    createPreview();

    return () => {
      isCancelled = true;
    };
  }, [
    uploadedFiles,
    activeFileIndex,
    studentDetails.paperType,
    studentDetails.studentName,
    studentDetails.regNo,
    studentDetails.course,
    studentDetails.level,
  ]);

  useEffect(() => {
    return () => {
      if (mergedBlobUrlRef.current) {
        URL.revokeObjectURL(mergedBlobUrlRef.current);
      }
    };
  }, []);

  // Handler to upload one or multiple questions files (PDF, Doc, Image) for the respective student
  const handleUploadQuestionsFile = async (e) => {
    const fileList = Array.from(e.target.files || []);
    if (fileList.length === 0) return;

    // Check individual file size limit (10MB)
    const oversized = fileList.filter(f => f.size > 10 * 1024 * 1024);
    if (oversized.length > 0) {
      alert(`The following file(s) exceed 10 MB limit:\n${oversized.map(f => f.name).join('\n')}\nPlease choose files under 10 MB.`);
      return;
    }

    const readFileAsync = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          const formattedSize = file.size > 1024 * 1024
            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
            : `${Math.round(file.size / 1024)} KB`;

          resolve({
            id: `qf_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
            fileName: file.name,
            fileType: file.type || 'application/octet-stream',
            fileSize: formattedSize,
            dataUrl,
            uploadedAt: new Date().toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    try {
      const newItems = await Promise.all(fileList.map(readFileAsync));
      const combined = [...uploadedFiles, ...newItems];

      // Update state first so files are immediately loaded and visible
      setUploadedFiles(combined);
      setActiveFileIndex(combined.length - newItems.length);

      // Persist to storage safely
      try {
        saveStudentUploadedQuestions(scopeKey, combined);
      } catch (storageErr) {
        console.warn('Persistent storage warning (kept in memory):', storageErr);
      }

      showTempMsg(`${newItems.length} question paper file(s) uploaded successfully!`);
      setTimeout(() => {
        attachedQuestionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 150);
    } catch (err) {
      console.error('File reading error:', err);
      alert('Could not read the selected file(s). Please try choosing another file.');
    } finally {
      if (questionsFileInputRef.current) {
        questionsFileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveSingleFile = (indexToRemove) => {
    const targetFile = uploadedFiles[indexToRemove];
    if (!targetFile) return;
    if (!window.confirm(`Remove "${targetFile.fileName}" from ${studentDetails.studentName}'s uploaded question papers?`)) return;

    const updated = uploadedFiles.filter((_, idx) => idx !== indexToRemove);
    saveStudentUploadedQuestions(scopeKey, updated.length > 0 ? updated : null);
    setUploadedFiles(updated);
    if (activeFileIndex >= updated.length) {
      setActiveFileIndex(Math.max(0, updated.length - 1));
    }
    showTempMsg(`Removed "${targetFile.fileName}".`);
  };

  const handleRemoveAllQuestionsFiles = () => {
    if (!window.confirm(`Remove all (${uploadedFiles.length}) uploaded question paper files for ${studentDetails.studentName}?`)) return;
    saveStudentUploadedQuestions(scopeKey, null);
    setUploadedFiles([]);
    setActiveFileIndex(0);
    showTempMsg('All uploaded questions files removed.');
    if (questionsFileInputRef.current) {
      questionsFileInputRef.current.value = '';
    }
  };

  const handleDownloadSingleFile = (fileItem) => {
    const target = fileItem || uploadedFiles[activeFileIndex];
    if (!target?.dataUrl) return;
    const a = document.createElement('a');
    a.href = target.dataUrl;
    a.download = target.fileName || `${studentDetails.regNo}_questions`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleViewSingleFileFullscreen = (fileItem) => {
    if (previewMode === 'merged' && mergedPdfUrl) {
      const win = window.open(mergedPdfUrl, '_blank');
      win?.focus();
      return;
    }
    const target = fileItem || uploadedFiles[activeFileIndex];
    if (!target?.dataUrl) return;
    const win = window.open();
    if (win) {
      win.document.write(
        `<title>${target.fileName} - ${studentDetails.studentName}</title>` +
        (target.fileType?.startsWith('image/')
          ? `<body style="margin:0;background:#0f172a;display:flex;align-items:center;justify-content:center;min-height:100vh;"><img src="${target.dataUrl}" style="max-width:98vw;max-height:98vh;object-fit:contain;box-shadow:0 10px 30px rgba(0,0,0,0.5);border-radius:6px;" /></body>`
          : `<iframe src="${target.dataUrl}" frameborder="0" style="border:0; position:fixed; top:0; left:0; width:100%; height:100%;" allowfullscreen></iframe>`)
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-[99999] isolate overflow-y-auto overscroll-contain bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-start py-3 px-2 sm:px-4"
      style={{
        height: '100dvh',
        maxHeight: '100dvh',
        touchAction: 'pan-y',
        WebkitOverflowScrolling: 'touch',
        overscrollBehaviorY: 'contain'
      }}
    >
      {/* Hidden file input for manual questions upload (supports multiple files) */}
      <input
        ref={questionsFileInputRef}
        type="file"
        multiple
        accept="application/pdf,image/png,image/jpeg,image/webp,image/*,.pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
        onClick={(e) => {
          e.target.value = '';
        }}
        onChange={handleUploadQuestionsFile}
        className="hidden"
      />

      {/* Print stylesheet - prints combined booklet */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .printable-booklet, .printable-booklet * {
            visibility: visible !important;
          }
          .printable-booklet {
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

      {/* =========================================================================
          TOP ACTION TOOLBAR
          ========================================================================= */}
      <div className="no-print w-full max-w-[840px] bg-[#0c234b] text-white px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sticky top-2 z-[100000] border border-amber-400/40 mb-3">
        {/* Row 1 on mobile / Left on desktop: Back button & Title */}
        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
              title="Close and return"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-300" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-1.5 text-xs font-black min-w-0">
              <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="truncate max-w-[170px] sm:max-w-[260px] text-white">
                {studentDetails.testBookletTitle}
              </span>
            </div>
          </div>
        </div>

        {/* Row 2 on mobile / Right on desktop: Action Buttons */}
        <div className="flex items-center justify-between sm:justify-end gap-1.5 flex-wrap">
          {/* UPLOAD QUESTIONS BUTTON - ALWAYS PROMINENT AND WORKING */}
          <button
            type="button"
            onClick={() => questionsFileInputRef.current?.click()}
            className="px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 active:scale-95 text-white rounded-lg text-xs font-black transition flex items-center gap-1.5 shadow-md cursor-pointer border border-sky-300/40"
            title="Upload or attach question papers (PDF, Images, Word Docs)"
          >
            <FileUp className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="text-[11px] sm:text-xs">
              {uploadedFiles.length > 0 ? '+ Upload More' : 'Upload Questions'}
            </span>
          </button>

          {/* Files badge if files exist */}
          {uploadedFiles.length > 0 && (
            <div className="flex items-center gap-1 bg-amber-400 text-slate-950 px-2 py-1 rounded-lg text-xs font-black shadow-md border border-amber-300">
              <Paperclip className="w-3.5 h-3.5 text-slate-900 shrink-0" />
              <span className="truncate max-w-[80px] sm:max-w-[120px]" title={uploadedFiles[activeFileIndex]?.fileName || 'Question Papers'}>
                {uploadedFiles.length === 1 ? '1 File' : `${uploadedFiles.length} Files`}
              </span>
              <button
                type="button"
                onClick={() => {
                  attachedQuestionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }}
                className="px-1.5 py-0.5 bg-slate-950 hover:bg-slate-800 text-amber-300 rounded text-[10px] font-bold cursor-pointer transition flex items-center gap-0.5"
                title="View attached questions"
              >
                <Eye className="w-2.5 h-2.5" />
                <span className="hidden sm:inline">View</span>
              </button>
              <button
                type="button"
                onClick={handleRemoveAllQuestionsFiles}
                className="p-1 hover:bg-rose-100 text-rose-800 rounded cursor-pointer transition"
                title="Clear all uploaded files"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Edit Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1 cursor-pointer ${
              isEditMode
                ? 'bg-rose-500 hover:bg-rose-600 text-white ring-2 ring-rose-300'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
            title="Toggle Edit Mode"
          >
            {isEditMode ? <Unlock className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span className="text-[11px] sm:text-xs">{isEditMode ? 'Editing' : 'Edit'}</span>
          </button>

          {/* Download PDF */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf || isPrinting}
            className="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 rounded-lg text-xs font-black transition flex items-center gap-1 shadow-sm cursor-pointer disabled:opacity-50"
            title="Download Merged Question Paper as PDF (Cover Page + Uploaded Documents)"
          >
            {isGeneratingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span>PDF</span>
          </button>

          {/* Print */}
          <button
            type="button"
            onClick={handlePrint}
            disabled={isPrinting || isGeneratingPdf}
            className="p-1.5 bg-white/15 hover:bg-white/25 active:scale-95 text-white rounded-lg transition cursor-pointer disabled:opacity-50"
            title="Print Merged Question Paper (Cover Page + Uploaded Documents)"
          >
            {isPrinting ? <Loader2 className="w-4 h-4 animate-spin text-amber-300" /> : <Printer className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* =========================================================================
          EDIT CONTROLS BANNER (VISIBLE WHEN EDIT MODE IS ACTIVE)
          ========================================================================= */}
      {isEditMode && (
        <div className="no-print w-full max-w-[840px] bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 px-3.5 py-2 rounded-xl shadow-lg border border-amber-300 flex items-center justify-between gap-2 mb-3 flex-wrap animate-in fade-in duration-150">
          <div className="flex items-center gap-2 text-xs font-black">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            <span>Super Admin Edit Mode:</span>
            <span className="font-semibold text-slate-900 hidden sm:inline">
              Click any field on the paper or branch logo to edit in-place.
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Paper Type selector */}
            <div className="flex items-center gap-1 bg-white/70 rounded px-1 py-0.5">
              <span className="text-[10px] font-black text-slate-900 mr-0.5">TYPE:</span>
              {PAPER_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setPaperType(t)}
                  className={`w-6 h-6 rounded text-[11px] font-black transition cursor-pointer ${
                    studentDetails.paperType === t
                      ? 'bg-slate-950 text-amber-300 shadow-xs'
                      : 'bg-white text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
              <button
                type="button"
                onClick={handleRandomType}
                className="ml-0.5 px-1.5 h-6 rounded bg-white hover:bg-slate-100 text-slate-950 text-[10px] font-black flex items-center gap-0.5 cursor-pointer"
                title="Pick a random paper type"
              >
                <Shuffle className="w-3 h-3 text-amber-700" />
                <span>Random</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-white rounded text-[11px] font-black transition flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <Save className="w-3 h-3 text-emerald-400" />
              <span>Save Changes</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-2 py-1 bg-rose-700 hover:bg-rose-800 text-white rounded text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
              title="Reset to default template"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {saveSuccessMsg && (
        <div className="no-print fixed top-16 z-50 bg-emerald-600 text-white text-xs font-black px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-emerald-300 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* =========================================================================
          PRINTABLE & VIEWABLE COMBINED QUESTION PAPER BOOKLET
          ========================================================================= */}
      <div
        className="printable-booklet w-full flex justify-center pb-12"
        style={{
          touchAction: 'pan-y',
          WebkitOverflowScrolling: 'touch',
          minHeight: docScale < 1 ? `${Math.ceil(measuredCombinedHeight * docScale) + 40}px` : 'auto',
        }}
      >
        <div
          style={{
            width: `${targetDocWidth}px`,
            minWidth: `${targetDocWidth}px`,
            transform: docScale < 1 ? `scale(${docScale})` : 'none',
            transformOrigin: 'top center',
            marginBottom: docScale < 1 ? `-${Math.round(measuredCombinedHeight * (1 - docScale))}px` : 0,
            transition: 'transform 0.15s ease-out',
            touchAction: 'pan-y',
          }}
        >
          <div
            ref={combinedBookletRef}
            className="w-[724px] max-w-[724px] mx-auto bg-white rounded-xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col"
            style={{ touchAction: 'pan-y' }}
          >
            {/* PAGE 1: TEST BOOKLET COVER PAGE */}
            <div
              ref={page1Ref}
              className="print-page-1 print-page-break relative block w-[724px] max-w-[724px] mx-auto"
            >
              <QuestionPaperCoverPage
                student={student}
                details={studentDetails}
                editMode={isEditMode}
                onDetailChange={updateDetail}
              />
            </div>

            {/* SEAMLESS BOOKLET CONNECTION / PERFORATION DIVIDER */}
            <div className="no-print relative w-full bg-slate-100 py-2.5 px-4 border-t-2 border-b-2 border-dashed border-slate-300 flex items-center justify-between text-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-700" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-900 font-sans">
                  Question Paper & Exam Questions Section
                </span>
                {uploadedFiles.length > 0 && (
                  <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full text-[10px] font-black border border-amber-300 font-sans">
                    {uploadedFiles.length} Page{uploadedFiles.length > 1 ? 's' : ''} Attached
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => questionsFileInputRef.current?.click()}
                  className="px-2.5 py-1 bg-[#0c234b] hover:bg-[#123068] text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer shadow-xs active:scale-95 font-sans"
                >
                  <Plus className="w-3 h-3 text-amber-400" />
                  <span>{uploadedFiles.length > 0 ? 'Add More' : 'Upload Questions'}</span>
                </button>
                {uploadedFiles.length > 1 && (
                  <button
                    type="button"
                    onClick={handleRemoveAllQuestionsFiles}
                    className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer font-sans"
                    title="Remove all uploaded questions"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>

            {/* ATTACHED QUESTIONS FILE SECTION (COMBINED DIRECTLY INSIDE BOOKLET) */}
            <div 
              ref={attachedQuestionsRef}
              className="w-full bg-white p-4 sm:p-5"
            >
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold shrink-0">
              <FileQuestion className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5 flex-wrap">
                <span>Uploaded Question Papers</span>
                {uploadedFiles.length > 0 && (
                  <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full text-[10px] font-black border border-amber-300">
                    {uploadedFiles.length} File{uploadedFiles.length > 1 ? 's' : ''}
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Reg: {studentDetails.regNo} • {studentDetails.studentName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => questionsFileInputRef.current?.click()}
              className="px-3 py-1.5 bg-[#0c234b] hover:bg-[#123068] text-white rounded-lg text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>{uploadedFiles.length > 0 ? 'Add More Files' : 'Upload Questions'}</span>
            </button>

            {uploadedFiles.length > 1 && (
              <button
                type="button"
                onClick={handleRemoveAllQuestionsFiles}
                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                title="Remove all files"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
          </div>
        </div>

        {uploadedFiles.length > 0 ? (
          <div className="space-y-3 mt-3.5">
            {/* MULTI-FILE TAB SELECTOR */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 sm:p-2.5">
              <div className="flex items-center justify-between mb-1.5 px-1 text-[11px] font-bold text-slate-600">
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-sky-600" />
                  <span>Attached Files (Click to switch preview):</span>
                </span>
                <span>{activeFileIndex + 1} of {uploadedFiles.length} selected</span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {uploadedFiles.map((f, idx) => {
                  const isActive = idx === activeFileIndex;
                  return (
                    <div
                      key={f.id || idx}
                      onClick={() => setActiveFileIndex(idx)}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 border select-none ${
                        isActive
                          ? 'bg-[#0c234b] text-white border-amber-400 shadow-sm ring-2 ring-amber-400/40'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
                      }`}
                    >
                      <FileText className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                      <span className="truncate max-w-[110px] sm:max-w-[150px]" title={f.fileName}>
                        {idx + 1}. {f.fileName}
                      </span>
                      <span className={`text-[9.5px] px-1 py-0.2 rounded font-medium ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {f.fileSize}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveSingleFile(idx);
                        }}
                        className={`p-0.5 rounded-full hover:bg-rose-600 hover:text-white transition ${
                          isActive ? 'text-slate-300' : 'text-slate-400'
                        }`}
                        title="Delete this file"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ACTIVE FILE TOOLBAR */}
            {uploadedFiles[activeFileIndex] && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-900 truncate" title={uploadedFiles[activeFileIndex].fileName}>
                      {uploadedFiles[activeFileIndex].fileName}
                    </p>
                    <p className="text-[10.5px] text-slate-500 font-medium mt-0.5">
                      Size: {uploadedFiles[activeFileIndex].fileSize} • Uploaded: {uploadedFiles[activeFileIndex].uploadedAt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0 flex-wrap">
                  {uploadedFiles.length > 1 && (
                    <div className="flex items-center bg-white border border-slate-300 rounded-lg p-0.5 mr-1">
                      <button
                        type="button"
                        disabled={activeFileIndex === 0}
                        onClick={() => setActiveFileIndex(prev => Math.max(0, prev - 1))}
                        className="p-1 text-slate-700 hover:text-slate-950 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition"
                        title="Previous File"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-[10px] font-bold px-1.5 text-slate-600">
                        {activeFileIndex + 1}/{uploadedFiles.length}
                      </span>
                      <button
                        type="button"
                        disabled={activeFileIndex === uploadedFiles.length - 1}
                        onClick={() => setActiveFileIndex(prev => Math.min(uploadedFiles.length - 1, prev + 1))}
                        className="p-1 text-slate-700 hover:text-slate-950 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition"
                        title="Next File"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleViewSingleFileFullscreen(uploadedFiles[activeFileIndex])}
                    className="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                    title={previewMode === 'merged' ? 'Open merged booklet starting from 1st page in new tab' : 'Open file in new window / tab'}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Fullscreen</span>
                  </button>

                  <button
                    type="button"
                    onClick={previewMode === 'merged' ? handleDownloadPdf : () => handleDownloadSingleFile(uploadedFiles[activeFileIndex])}
                    className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                    title={previewMode === 'merged' ? 'Download merged PDF starting from 1st page' : 'Download active file'}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveSingleFile(activeFileIndex)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition cursor-pointer"
                    title="Remove this file"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* LIVE AUTOMATIC EMBEDDED PREVIEW (STARTS FROM 1ST PAGE) */}
            {uploadedFiles[activeFileIndex] && (
              <div className="border border-slate-300 rounded-xl overflow-hidden bg-slate-900/5 shadow-sm">
                <div className="bg-[#0c234b] text-white text-xs font-bold px-3.5 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-amber-300">
                      <Eye className="w-3.5 h-3.5" />
                      <span>
                        {previewMode === 'merged'
                          ? 'Previewing Merged Booklet (From 1st Page)'
                          : `Previewing Uploaded File (${activeFileIndex + 1} of ${uploadedFiles.length})`}
                      </span>
                    </span>
                    {previewMode === 'merged' && (
                      <span className="bg-emerald-500/25 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full text-[10px] font-black">
                        Cover Page + Upload Merged
                      </span>
                    )}
                  </div>

                  {/* Switcher: Merged (Cover + Upload) vs Raw Uploaded File */}
                  <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-lg text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setPreviewMode('merged')}
                      className={`px-2 py-1 rounded transition cursor-pointer ${
                        previewMode === 'merged'
                          ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      Merged (From 1st Page)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode('raw')}
                      className={`px-2 py-1 rounded transition cursor-pointer ${
                        previewMode === 'raw'
                          ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      Uploaded File Only
                    </button>
                  </div>
                </div>

                <div className="p-2 sm:p-3 flex items-center justify-center bg-slate-50 min-h-[450px]">
                  {previewMode === 'merged' && mergedPdfUrl ? (
                    <div className="w-full h-[700px] bg-white border border-slate-200 rounded-lg overflow-hidden shadow-inner">
                      <iframe
                        src={`${mergedPdfUrl}#toolbar=1&navpanes=0&page=1`}
                        title="Merged Question Paper Booklet"
                        className="w-full h-full border-0"
                      />
                    </div>
                  ) : uploadedFiles[activeFileIndex]?.fileType?.startsWith('image/') || uploadedFiles[activeFileIndex]?.fileName?.match(/\.(png|jpe?g|webp|gif|bmp|svg)$/i) ? (
                    <div className="w-full flex flex-col items-center justify-center bg-white border border-slate-200 rounded-lg p-2.5 shadow-inner">
                      {isGeneratingPreview && (
                        <div className="w-full bg-amber-50 text-amber-900 border border-amber-200 rounded px-3 py-1 mb-2 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                          <span>Compiling 1st page merged preview...</span>
                        </div>
                      )}
                      <img
                        src={uploadedFiles[activeFileIndex].dataUrl}
                        alt={uploadedFiles[activeFileIndex].fileName}
                        className="max-h-[750px] w-auto max-w-full object-contain rounded"
                      />
                    </div>
                  ) : uploadedFiles[activeFileIndex]?.fileType?.includes('pdf') || uploadedFiles[activeFileIndex]?.fileName?.endsWith('.pdf') ? (
                    <div className="w-full h-[650px] bg-white border border-slate-200 rounded-lg overflow-hidden shadow-inner flex flex-col">
                      {isGeneratingPreview && (
                        <div className="w-full bg-amber-50 text-amber-900 border-b border-amber-200 px-3 py-1 text-xs font-bold flex items-center gap-1.5 animate-pulse shrink-0">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                          <span>Compiling 1st page merged preview...</span>
                        </div>
                      )}
                      <iframe
                        src={`${uploadedFiles[activeFileIndex].dataUrl}#toolbar=1&navpanes=0`}
                        title={uploadedFiles[activeFileIndex].fileName}
                        className="w-full h-full border-0 flex-1"
                      />
                    </div>
                  ) : (
                    <div className="w-full py-10 px-4 flex flex-col items-center justify-center text-center bg-white border border-slate-200 rounded-lg">
                      <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-3 shadow-xs">
                        <FileText className="w-7 h-7" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">
                        {uploadedFiles[activeFileIndex]?.fileName}
                      </h4>
                      <p className="text-xs text-slate-500 max-w-sm mb-4">
                        Word document attached. Click below to view or download.
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleViewSingleFileFullscreen(uploadedFiles[activeFileIndex])}
                          className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Open Document</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadSingleFile(uploadedFiles[activeFileIndex])}
                          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={() => questionsFileInputRef.current?.click()}
            className="no-print mt-2 border-2 border-dashed border-sky-300 hover:border-sky-500 bg-sky-50/50 hover:bg-sky-50 rounded-xl p-6 text-center cursor-pointer transition group"
          >
            <Upload className="w-8 h-8 text-sky-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-black text-slate-800 uppercase tracking-wide">
              Click to upload question papers for <span className="font-black text-sky-900">{studentDetails.studentName}</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-1 max-w-md mx-auto">
              Supports selecting multiple files at once (PDF, Word Documents, Images) up to 10 MB each.
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0c234b] text-white rounded-lg text-xs font-bold shadow-xs group-hover:bg-[#123068]">
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Select Files to Attach</span>
            </div>
          </div>
        )}

        {/* Print-only: Uploaded Question Sheets */}
        {uploadedFiles.map((file, idx) => {
          const isImage = file.fileType?.startsWith('image/') || file.fileName?.match(/\.(png|jpe?g|webp|gif|bmp|svg)$/i);
          if (!isImage || !file.dataUrl) return null;
          return (
            <div key={file.id || idx} className="hidden print:block print-page-break p-4 w-[724px] mx-auto bg-white text-center">
              <div className="border-b border-slate-300 pb-2 mb-3 flex items-center justify-between text-xs font-bold text-slate-700">
                <span>{studentDetails.testBookletTitle} • {studentDetails.regNo}</span>
                <span>Question Paper Sheet {idx + 1} of {uploadedFiles.length}</span>
              </div>
              <img
                src={file.dataUrl}
                alt={file.fileName}
                className="w-full h-auto max-h-[960px] object-contain mx-auto"
              />
            </div>
          );
        })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
