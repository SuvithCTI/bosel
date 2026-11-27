import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  FileSpreadsheet,
  X,
  ExternalLink,
  Sparkles,
  Users,
  ChevronDown,
  Building,
  GraduationCap,
  HardDrive,
  Phone,
  School,
  Printer,
  BookOpen,
  Layers,
  Loader2,
  FileDown
} from 'lucide-react';
import html2canvas from 'html2canvas-pro';

import StudentAvatar from '../../components/StudentAvatar';
import QuestionPaperCoverPage from '../../components/QuestionPaperCoverPage';
import StudentWorksheetView from '../../components/StudentWorksheetView';
import { api } from '../../services/api';
import {
  getStudentWorksheets,
  saveStudentWorksheetSlot,
  deleteStudentWorksheetSlot,
  getBranchWorksheetStats
} from '../../utils/worksheetStorage';
import {
  getStudentScopeKey,
  getStudentRegisterNumber,
  generateCertificateNo,
  getCourseSubjectTitle
} from '../../utils/studentDataHelpers';
import { ACADEMIC_STAGES, getAcademicStageFromAge } from '../../utils/academicStages';

function getStudentCategory(student) {
  if (!student) return 'Branch';
  const cat = String(student.admissionCategory || student.category || student.channel || '').trim().toLowerCase();
  if (cat === 'school') return 'School';
  if (cat === 'academy' || cat === 'franchise') return 'Academy';
  if (cat === 'branch' || cat === 'individual' || cat === 'direct') return 'Branch';
  if (student.schoolId) return 'School';
  if (student.franchiseId) return 'Academy';
  if (cat.includes('school')) return 'School';
  if (cat.includes('franchise') || cat.includes('academy')) return 'Academy';
  return 'Branch';
}

function getCategoryBadge(student) {
  const category = getStudentCategory(student);
  if (category === 'School') {
    return { label: 'School', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  }
  if (category === 'Academy') {
    return { label: 'Academy', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
  }
  return { label: 'Branch', bg: 'bg-sky-50 text-sky-700 border-sky-200' };
}

function getStudentAcademicCategory(student) {
  if (!student) {
    return {
      className: 'Class 1',
      stage: 'SUB-JUNIOR (Class 1)',
      level: 'Level 1',
      levelNum: 1,
      classBadgeClass: 'bg-amber-50 text-amber-900 border-amber-300',
      levelBadgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300'
    };
  }

  const gradeStr = String(student.grade || student.level || '').trim();

  // 1. Detect Level
  let level = '';
  let levelNum = null;
  const rawToCheck = [
    student.level,
    student.courseLevel,
    student.grade,
    Array.isArray(student.selectedCourses) ? student.selectedCourses.map(c => c?.level).join(' ') : '',
    student.courseName,
    student.program
  ].filter(Boolean).join(' ');

  const levelMatch = rawToCheck.match(/(?:Level|Lvl|L|Module|Stage)\s*(\d+)/i);
  if (levelMatch) {
    levelNum = parseInt(levelMatch[1], 10);
    level = `Level ${levelNum}`;
  } else {
    level = 'Level 1';
    levelNum = 1;
  }

  // 2. Match exact Academic Stage from ACADEMIC_STAGES
  let matchedStage = null;

  if (student.studentStage) {
    matchedStage = ACADEMIC_STAGES.find(s => s.stage === student.studentStage || s.label?.toLowerCase() === student.studentStage?.toLowerCase());
    if (!matchedStage) {
      const stLower = student.studentStage.toLowerCase();
      for (let i = 12; i >= 1; i--) {
        if (stLower.includes(`class ${i}`)) {
          matchedStage = ACADEMIC_STAGES.find(s => s.className === `Class ${i}`);
          if (matchedStage) break;
        }
      }
    }
  }

  if (!matchedStage && (student.studentClass || student.standard || student.className)) {
    const cls = (student.studentClass || student.standard || student.className).toLowerCase();
    matchedStage = ACADEMIC_STAGES.find(s => s.className?.toLowerCase() === cls || s.stage?.toLowerCase().includes(cls));
  }

  if (!matchedStage && gradeStr) {
    const gLower = gradeStr.toLowerCase();
    for (let i = 12; i >= 1; i--) {
      if (gLower.includes(String(i))) {
        matchedStage = ACADEMIC_STAGES.find(s => s.className === `Class ${i}`);
        if (matchedStage) break;
      }
    }
  }

  if (!matchedStage && student.age) {
    const ageStage = getAcademicStageFromAge(student.age);
    if (ageStage?.stage) {
      matchedStage = ACADEMIC_STAGES.find(s => s.stage === ageStage.stage);
    }
  }

  if (!matchedStage) {
    matchedStage = ACADEMIC_STAGES[0];
  }

  const className = matchedStage?.className || 'Class 1';
  const stage = matchedStage?.stage || 'SUB-JUNIOR (Class 1)';

  // 3. Class Badge Color Style
  let classBadgeClass = 'bg-blue-50 text-blue-900 border-blue-200';
  if (stage.includes('MASTER')) {
    classBadgeClass = 'bg-purple-100 text-purple-900 border-purple-300';
  } else if (stage.includes('SUPER SENIOR')) {
    classBadgeClass = 'bg-rose-50 text-rose-800 border-rose-300';
  } else if (stage.includes('SENIOR')) {
    classBadgeClass = 'bg-teal-50 text-teal-800 border-teal-300';
  } else if (stage.includes('JUNIOR') && !stage.includes('SUB')) {
    classBadgeClass = 'bg-blue-50 text-blue-800 border-blue-300';
  } else {
    classBadgeClass = 'bg-amber-50 text-amber-900 border-amber-300';
  }

  // 4. Level Badge Color Style
  let levelBadgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-300';
  if (levelNum === 1) levelBadgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-300';
  else if (levelNum === 2) levelBadgeClass = 'bg-sky-50 text-sky-800 border-sky-300';
  else if (levelNum === 3) levelBadgeClass = 'bg-indigo-50 text-indigo-800 border-indigo-300';
  else if (levelNum === 4) levelBadgeClass = 'bg-purple-50 text-purple-800 border-purple-300';
  else levelBadgeClass = 'bg-amber-50 text-amber-900 border-amber-300';

  return {
    className,
    stage,
    level,
    levelNum,
    classBadgeClass,
    levelBadgeClass
  };
}

// Builds the exact candidate front page details (100% matched to QuestionPaperCoverPage)
function buildWorksheetDetails(student, slotNum = 1) {
  const regNo = student ? getStudentRegisterNumber(student) : 'AB26-004';
  const pType =
    student?.paperType ||
    student?.examCategory ||
    (student?.category && ['A', 'B', 'C', 'D', 'E'].includes(student.category) ? student.category : 'A');

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
    parentName: student?.parentName || student?.fatherName || student?.motherName || 'Father / Guardian',
    dob: student?.dob || student?.dateOfBirth || '',
    age: student?.age || '',
    gender: student?.gender || 'Male',
    studentClass: student?.studentClass || student?.classGrade || student?.standard || '',
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
    testBookletTitle: 'LEVEL EXAMINATION - TEST BOOKLET',
    paperCode: subjectTitle,
    programBrand: 'BSEL MindSparc™',
    subjectTitle,
    ribbonTitle: 'TEST BOOKLET',
  };
}

export default function AdminBranchWorksheetPage({
  activeBranch = 'Tenkasi Regional Branch',
  branchStudents = [],
  showToast = () => {}
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Complete', 'Partial', 'Pending'
  const [courseFilter, setCourseFilter] = useState('All');
  const [previewFile, setPreviewFile] = useState(null); // { name, url, type, studentName, title, student, details, slotNum, allFiles }
  const [viewingWorksheetData, setViewingWorksheetData] = useState(null); // { student, slot }
  const [previewMode, setPreviewMode] = useState('booklet'); // 'booklet' (front page + worksheet), 'cover' (front page only), 'worksheet' (file only)
  const [uploadingState, setUploadingState] = useState({}); // { `${scopeKey}_${slot}`: boolean }
  const [refreshKey, setRefreshKey] = useState(0);
  const [isMerging, setIsMerging] = useState(false);
  const coverPageRef = useRef(null);

  // Converts dataUrl to Uint8Array safely
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

  // Merges the Front Page (Page 1) + uploaded worksheet file(s) into one single PDF and downloads it
  const mergeAndDownloadPdf = async (student, targetFiles = [], outputFileName = 'Worksheet_Booklet.pdf') => {
    setIsMerging(true);
    showToast('Preparing front page and merging worksheets into PDF...');

    try {
      const coverElem = coverPageRef.current;
      if (!coverElem) throw new Error('Cover page element not found.');

      // 1. Render Cover Page (Question Paper Front Page) to high-res PNG
      const canvas = await html2canvas(coverElem, {
        scale: 2.0,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#ffffff',
        ignoreElements: (el) => el.classList?.contains('no-print') || el.classList?.contains('print:hidden'),
        onclone: (clonedDoc, clonedEl) => {
          clonedEl.style.transform = 'none';
          clonedEl.style.margin = '0 auto';
        }
      });

      const coverDataUrl = canvas.toDataURL('image/png');
      const coverBytes = dataUrlToUint8Array(coverDataUrl) || (await fetch(coverDataUrl).then((r) => r.arrayBuffer()));

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

      // 3. Append each target worksheet file
      for (const fileItem of targetFiles) {
        const fileUrl = fileItem.url || fileItem.fileUrl;
        const fileName = fileItem.name || fileItem.fileName || '';
        const fileType = fileItem.type || fileItem.fileType || '';
        if (!fileUrl) continue;

        const isPdf = fileType.includes('pdf') || fileName.toLowerCase().endsWith('.pdf') || fileUrl.toLowerCase().includes('.pdf');
        const isImg = fileType.startsWith('image/') || fileName.match(/\.(png|jpe?g|webp|gif|bmp)$/i) || fileUrl.match(/\.(png|jpe?g|webp|gif|bmp)$/i);

        if (isPdf) {
          try {
            const pdfBytes = dataUrlToUint8Array(fileUrl) || (await fetch(fileUrl).then((r) => r.arrayBuffer()));
            const donorDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
            const donorPageIndices = donorDoc.getPageIndices();
            const copiedPages = await mergedDoc.copyPages(donorDoc, donorPageIndices);
            copiedPages.forEach((donorPage) => {
              mergedDoc.addPage(donorPage);
            });
          } catch (pdfErr) {
            console.warn('Could not load PDF file directly:', pdfErr);
          }
        } else if (isImg) {
          try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = fileUrl;
            await new Promise((resolve, reject) => {
              if (img.complete) resolve();
              else {
                img.onload = resolve;
                img.onerror = reject;
              }
            });

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
            console.warn('Could not embed image:', imgErr);
          }
        }
      }

      const mergedBytes = await mergedDoc.save();
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = outputFileName;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
      }, 1000);

      showToast(`Merged PDF downloaded: ${outputFileName}`);
    } catch (err) {
      console.error('Merge PDF error:', err);
      showToast(`Merge failed: ${err.message || 'Please try again'}`);
    } finally {
      setIsMerging(false);
    }
  };

  // Downloads only the Front Page as a crisp standalone A4 PDF
  const downloadFrontPagePdf = async (student, outputFileName = 'Front_Page.pdf') => {
    setIsMerging(true);
    showToast('Generating Front Page PDF...');
    try {
      const coverElem = coverPageRef.current;
      if (!coverElem) throw new Error('Cover page element not found.');

      const canvas = await html2canvas(coverElem, {
        scale: 2.0,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#ffffff',
        ignoreElements: (el) => el.classList?.contains('no-print') || el.classList?.contains('print:hidden'),
        onclone: (clonedDoc, clonedEl) => {
          clonedEl.style.transform = 'none';
          clonedEl.style.margin = '0 auto';
        }
      });

      const coverDataUrl = canvas.toDataURL('image/png');
      const coverBytes = dataUrlToUint8Array(coverDataUrl) || (await fetch(coverDataUrl).then((r) => r.arrayBuffer()));

      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.create();

      const a4W = 595.28;
      const a4H = 841.89;
      const coverImage = await doc.embedPng(coverBytes);
      const coverPage = doc.addPage([a4W, a4H]);

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

      const bytes = await doc.save();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = outputFileName;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
      }, 1000);

      showToast(`Front Page PDF downloaded: ${outputFileName}`);
    } catch (err) {
      console.error('Front Page PDF error:', err);
      showToast(`Failed to generate Front Page PDF: ${err.message || 'Error'}`);
    } finally {
      setIsMerging(false);
    }
  };

  // Listen to external worksheet updates
  useEffect(() => {
    const handleUpdate = () => {
      setRefreshKey((k) => k + 1);
    };
    window.addEventListener('bsel_worksheets_updated', handleUpdate);
    return () => window.removeEventListener('bsel_worksheets_updated', handleUpdate);
  }, []);

  // Listen to Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setPreviewFile(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute stats across current branch students
  const stats = useMemo(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const _dep = refreshKey;
    return getBranchWorksheetStats(branchStudents);
  }, [branchStudents, refreshKey]);

  // Unique list of courses for filtering
  const availableCourses = useMemo(() => {
    const set = new Set();
    branchStudents.forEach((s) => {
      const c = s.course || s.courseName || s.program;
      if (c && typeof c === 'string') set.add(c.trim());
    });
    return Array.from(set).sort();
  }, [branchStudents]);

  // Filter students based on search, course, and worksheet upload status
  const filteredStudents = useMemo(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const _dep = refreshKey;
    return branchStudents.filter((student) => {
      const scopeKey = getStudentScopeKey(student);
      const slots = getStudentWorksheets(scopeKey);
      const uploadedCount = slots.filter((s) => s.file && s.file.url).length;

      // Status filter
      if (statusFilter === 'Complete' && uploadedCount !== 4) return false;
      if (statusFilter === 'Partial' && (uploadedCount === 0 || uploadedCount === 4)) return false;
      if (statusFilter === 'Pending' && uploadedCount > 0) return false;

      // Course filter
      if (courseFilter !== 'All') {
        const c = student.course || student.courseName || student.program || '';
        if (c.toLowerCase() !== courseFilter.toLowerCase()) return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const name = (student.studentName || student.name || '').toLowerCase();
        const reg = (student.registerNumber || student.registrationNo || student.admissionNo || '').toLowerCase();
        const id = (student.userId || student.id || '').toLowerCase();
        const phone = (student.phone || '').toLowerCase();
        const course = (student.course || student.courseName || student.program || '').toLowerCase();

        return (
          name.includes(term) ||
          reg.includes(term) ||
          id.includes(term) ||
          phone.includes(term) ||
          course.includes(term)
        );
      }

      return true;
    });
  }, [branchStudents, searchTerm, statusFilter, courseFilter, refreshKey]);

  // Handle single file upload for a student's slot
  const handleFileUpload = async (student, slotNumber, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset input value so same file can be re-uploaded if replaced
    event.target.value = '';

    const scopeKey = getStudentScopeKey(student);
    const uploadKey = `${scopeKey}_${slotNumber}`;

    // Validate size (10MB)
    const MAX_MB = 10;
    if (file.size > MAX_MB * 1024 * 1024) {
      showToast(`File is too large. Maximum size is ${MAX_MB}MB.`);
      return;
    }

    setUploadingState((prev) => ({ ...prev, [uploadKey]: true }));
    showToast(`Uploading Worksheet ${slotNumber} for ${student.studentName || 'student'}...`);

    try {
      // Upload using universal API (saves to Amazon S3 or local storage fallback)
      const uploadRes = await api.uploadFile(file, 'worksheets');

      if (uploadRes && (uploadRes.url || uploadRes.key)) {
        const fileUrl = uploadRes.url || `/api/upload/file/${uploadRes.key}`;
        const formattedSize = file.size > 1024 * 1024
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
            minute: '2-digit'
          }),
          storage: uploadRes.storage || 'cloud'
        };

        saveStudentWorksheetSlot(scopeKey, slotNumber, fileData);
        setRefreshKey((k) => k + 1);
        showToast(`Worksheet ${slotNumber} uploaded successfully!`);
      } else {
        throw new Error('Upload did not return a valid URL.');
      }
    } catch (err) {
      console.error('[Worksheet Upload Error]:', err);
      showToast(`Upload failed: ${err.message || 'Please try again.'}`);
    } finally {
      setUploadingState((prev) => ({ ...prev, [uploadKey]: false }));
    }
  };

  // Handle worksheet delete
  const handleDeleteWorksheet = (student, slotNumber, fileName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${fileName || `Worksheet ${slotNumber}`}" for ${student.studentName || 'this student'}?`
    );
    if (!confirmDelete) return;

    const scopeKey = getStudentScopeKey(student);
    deleteStudentWorksheetSlot(scopeKey, slotNumber);
    setRefreshKey((k) => k + 1);
    showToast(`Worksheet ${slotNumber} removed.`);
  };

  return (
    <div className="space-y-5">
      {/* =========================================================================
          PAGE HEADER BANNER
          ========================================================================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0c234b] via-[#11326c] to-[#1a448d] p-5 sm:p-7 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>Practise Worksheet Management</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 font-medium max-w-2xl leading-relaxed">
              Upload and manage up to <strong className="text-amber-300">4 practise worksheets</strong> per student for homework, revisions, and assessment preparation.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setRefreshKey((k) => k + 1)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 px-3.5 py-2 text-xs font-bold text-white transition cursor-pointer border border-white/15"
              title="Refresh Worksheets"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* =========================================================================
          SEARCH & FILTER TOOLBAR
          ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3 sm:p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student by name, registration no, course, or mobile..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0c234b]/20 focus:border-[#0c234b]"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
            {['All', 'Complete', 'Partial', 'Pending'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#0c234b] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === 'All' ? 'All Status' : st === 'Complete' ? '4/4 Done' : st === 'Partial' ? '1-3 Done' : '0 Done'}
              </button>
            ))}
          </div>

          {/* Course Dropdown */}
          {availableCourses.length > 0 && (
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0c234b]/20 cursor-pointer"
            >
              <option value="All">All Courses</option>
              {availableCourses.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* =========================================================================
          STUDENTS & WORKSHEETS LIST
          ========================================================================= */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
            <FileSpreadsheet className="w-7 h-7" />
          </div>
          <h3 className="text-base font-black text-slate-800">No students found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'All' || courseFilter !== 'All'
              ? 'Try adjusting your search criteria or clearing filters to view students.'
              : `There are currently no students registered under ${activeBranch}.`}
          </p>
          {(searchTerm || statusFilter !== 'All' || courseFilter !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setCourseFilter('All');
              }}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
            >
              Reset All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
              Showing {filteredStudents.length} {filteredStudents.length === 1 ? 'Student' : 'Students'}
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              4 File Slots per Student
            </span>
          </div>

          {filteredStudents.map((student) => {
            const scopeKey = getStudentScopeKey(student);
            const slots = getStudentWorksheets(scopeKey);
            const uploadedCount = slots.filter((s) => s.file && s.file.url).length;
            const regNo = student.registerNumber || student.registrationNo || student.admissionNo || 'N/A';
            const courseName = student.course || student.courseName || student.program || 'Course Not Assigned';
            const parentName = student.parentName || student.fatherName || 'Guardian';
            const phoneNo = student.mobile || student.phone || '';
            const categoryBadge = getCategoryBadge(student);
            const academicCat = getStudentAcademicCategory(student);
            const institutionName = (student.schoolName || student.franchiseName || student.institution || '').trim();
            const hasInstitutionName = institutionName &&
              !institutionName.toLowerCase().includes('regional branch') &&
              !institutionName.toLowerCase().endsWith(' branch') &&
              institutionName.toLowerCase() !== (student.branch || '').toLowerCase();

            return (
              <div
                key={scopeKey || student.userId || student.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-xs transition duration-200 p-3.5 sm:p-4"
              >
                {/* 1 Line: Left Student Details, Right 4 Worksheets */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
                  {/* Left: Student Details */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <StudentAvatar
                      src={student.photoUrl || student.photo || student.studentPhoto}
                      initials={(student.studentName || student.name || 'S').trim().charAt(0).toUpperCase()}
                      className="w-11 h-11 ring-2 ring-amber-300 text-sm font-black shadow-xs shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-slate-900 capitalize text-sm">
                          {student.studentName || student.name || 'Student Name'}
                        </h4>
                        <span className="font-bold text-sky-700 font-mono text-xs bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200 shrink-0">
                          {regNo}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5 flex-wrap">
                        <span className="text-blue-900 font-bold">{courseName}</span>
                        {academicCat.level && (
                          <>
                            <span>•</span>
                            <span className="text-slate-600 font-semibold">{academicCat.level}</span>
                          </>
                        )}
                        {phoneNo && (
                          <>
                            <span>•</span>
                            <span className="text-slate-500 font-medium">Ph: {phoneNo}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: 4 Worksheets */}
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
                    {slots.map((slotItem) => {
                      const slotNum = slotItem.slot;
                      const file = slotItem.file;
                      const uploadKey = `${scopeKey}_${slotNum}`;
                      const isUploading = uploadingState[uploadKey];

                      if (isUploading) {
                        return (
                          <div
                            key={slotNum}
                            className="px-3 py-1.5 bg-slate-100 text-slate-700 border border-slate-200 font-bold rounded-lg text-xs inline-flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin shrink-0" />
                            <span>Uploading {slotNum}...</span>
                          </div>
                        );
                      }

                      if (file && file.url) {
                        return (
                          <div
                            key={slotNum}
                            className="inline-flex items-center bg-emerald-50 border border-emerald-300 rounded-lg shadow-xs overflow-hidden"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setViewingWorksheetData({ student, slot: slotNum });
                              }}
                              className="px-2.5 py-1.5 text-emerald-950 hover:bg-emerald-100/70 font-bold text-xs transition cursor-pointer inline-flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-95"
                              title={`View ${file.name || `Worksheet ${slotNum}`} (Front Page + Practice Paper)`}
                            >
                              <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>Worksheet {slotNum}</span>
                            </button>
                            <div className="h-4 w-px bg-emerald-200" />
                            <label
                              className="p-1.5 text-emerald-700 hover:text-emerald-950 hover:bg-emerald-100/70 transition cursor-pointer"
                              title={`Replace Worksheet ${slotNum}`}
                            >
                              <input
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
                                className="hidden"
                                onChange={(e) => handleFileUpload(student, slotNum, e)}
                              />
                              <Upload className="w-3.5 h-3.5" />
                            </label>
                            <div className="h-4 w-px bg-emerald-200" />
                            <button
                              type="button"
                              onClick={() => handleDeleteWorksheet(student, slotNum, file.name)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                              title={`Delete Worksheet ${slotNum}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      }

                      {/* Empty Slot Button: Styled as small as Event & Qn Paper buttons */}
                      return (
                        <div key={slotNum} className="inline-flex items-center bg-amber-50 border border-amber-200 hover:border-amber-300 rounded-lg shadow-xs overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setViewingWorksheetData({ student, slot: slotNum })}
                            className="px-2.5 py-1.5 text-amber-900 hover:bg-amber-100/70 font-bold text-xs transition cursor-pointer inline-flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-95"
                            title={`Open Worksheet ${slotNum} (Front Page + Upload Area)`}
                          >
                            <FileCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>Worksheet {slotNum}</span>
                          </button>
                          <div className="h-4 w-px bg-amber-200" />
                          <label
                            className="p-1.5 text-amber-700 hover:text-amber-950 hover:bg-amber-100/70 transition cursor-pointer"
                            title={`Direct Upload File for Worksheet ${slotNum}`}
                          >
                            <input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
                              className="hidden"
                              onChange={(e) => handleFileUpload(student, slotNum, e)}
                            />
                            <Upload className="w-3.5 h-3.5" />
                          </label>
                        </div>
                      );
                    })}

                    {/* Merge All & Download button if at least 1 worksheet uploaded */}
                    {uploadedCount > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setViewingWorksheetData({ student, slot: 1 });
                        }}
                        className="px-2.5 py-1.5 bg-[#0c234b] hover:bg-[#153a78] active:scale-95 text-white font-bold rounded-lg text-xs transition cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap"
                        title={`Merge Front Page + ${uploadedCount} Uploaded Worksheets into single PDF`}
                      >
                        <FileDown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Merge & Download ({uploadedCount})</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          WORKSHEET BOOKLET PREVIEW MODAL (WITH EXACT QUESTION PAPER FRONT PAGE)
          ========================================================================= */}
      {previewFile && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/85 backdrop-blur-xs p-2 sm:p-4 select-none animate-fadeIn"
          onClick={() => setPreviewFile(null)}
        >
          {/* Print stylesheet for Worksheet Booklet */}
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

          <div 
            className="bg-white rounded-2xl w-full max-w-5xl max-h-[96vh] flex flex-col shadow-2xl overflow-hidden border border-slate-300 relative animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="no-print flex flex-col md:flex-row md:items-center justify-between px-4 sm:px-6 py-3.5 bg-gradient-to-r from-[#081d3d] via-[#0c234b] to-[#143B7A] text-white shrink-0 shadow-md gap-3">
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm sm:text-base font-black text-white truncate">
                      {previewFile.title} • {previewFile.studentName}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[10px] font-black uppercase tracking-wider shrink-0">
                      Booklet Preview
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium truncate mt-0.5">
                    Reg No: <strong className="text-amber-300 font-mono">{previewFile.details?.regNo || 'N/A'}</strong>
                    {previewFile.name && previewFile.name !== 'Front Page' && (
                      <span> • File: {previewFile.name}</span>
                    )}
                  </p>
                </div>
              </div>

              {/* View Switcher Tabs & Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap justify-between md:justify-end shrink-0">
                {previewFile.url && (
                  <div className="flex items-center bg-white/10 p-1 rounded-xl text-xs font-bold border border-white/15">
                    <button
                      type="button"
                      onClick={() => setPreviewMode('booklet')}
                      className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                        previewMode === 'booklet'
                          ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                          : 'text-slate-200 hover:text-white'
                      }`}
                    >
                      Full Booklet
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode('cover')}
                      className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                        previewMode === 'cover'
                          ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                          : 'text-slate-200 hover:text-white'
                      }`}
                    >
                      Front Page Only
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode('worksheet')}
                      className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                        previewMode === 'worksheet'
                          ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                          : 'text-slate-200 hover:text-white'
                      }`}
                    >
                      Worksheet File
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Download Front Page as Standalone PDF */}
                  <button
                    type="button"
                    disabled={isMerging}
                    onClick={() => {
                      const regNo = previewFile.details?.regNo || 'BSEL';
                      const cleanName = (previewFile.studentName || 'Student').replace(/\s+/g, '_');
                      downloadFrontPagePdf(previewFile.student, `${regNo}_${cleanName}_Front_Page.pdf`);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold transition cursor-pointer border border-white/20 disabled:opacity-50"
                    title="Download candidate Front Page as PDF"
                  >
                    {isMerging ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
                    ) : (
                      <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                    )}
                    <span className="hidden sm:inline">Front Page PDF</span>
                  </button>

                  {/* Merge Front Page + Worksheet File(s) into Single PDF and Download */}
                  {previewFile.url && (
                    <button
                      type="button"
                      disabled={isMerging}
                      onClick={() => {
                        const regNo = previewFile.details?.regNo || 'BSEL';
                        const cleanName = (previewFile.studentName || 'Student').replace(/\s+/g, '_');
                        const slotTitle = previewFile.title?.replace(/\s+/g, '_') || 'Worksheet';
                        const targetFiles = previewFile.allFiles && previewFile.allFiles.length > 0
                          ? previewFile.allFiles
                          : [{ url: previewFile.url, name: previewFile.name, type: previewFile.type }];
                        mergeAndDownloadPdf(previewFile.student, targetFiles, `${regNo}_${cleanName}_${slotTitle}_Merged.pdf`);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 text-xs font-black transition cursor-pointer shadow-sm disabled:opacity-50"
                      title="Merge Front Page + Worksheet into a single PDF document and download"
                    >
                      {isMerging ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                      ) : (
                        <FileDown className="w-3.5 h-3.5" />
                      )}
                      <span>Merge & Download PDF</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold transition cursor-pointer border border-white/20"
                    title="Print Booklet (Page 1: Front Page, Page 2+: Worksheet)"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-300" />
                    <span className="hidden sm:inline">Print</span>
                  </button>

                  {previewFile.url && (
                    <>
                      <a
                        href={previewFile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold transition cursor-pointer border border-white/20"
                        title="Open raw file in new tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                        <span className="hidden sm:inline">New Tab</span>
                      </a>
                      <a
                        href={previewFile.url}
                        download={previewFile.name}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold transition cursor-pointer border border-white/20"
                        title="Download Raw File"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Download</span>
                      </a>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => setPreviewFile(null)}
                    className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-rose-600 active:scale-95 text-white transition cursor-pointer"
                    title="Close Preview (Esc)"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Body: Scrollable Document with Front Page + Worksheet File */}
            <div className="flex-1 overflow-y-auto bg-slate-200/80 p-3 sm:p-6 flex flex-col items-center justify-start min-h-[400px]">
              <div className="printable-worksheet-booklet w-full flex flex-col items-center">
                
                {/* PAGE 1: EXACT QUESTION PAPER FRONT PAGE */}
                <div
                  ref={coverPageRef}
                  className={`print-page-1 print-page-break w-[724px] max-w-[724px] bg-white rounded-t-xl shadow-2xl border border-slate-300 overflow-hidden ${
                    previewMode === 'worksheet' ? 'hidden' : 'block'
                  }`}
                >
                  <QuestionPaperCoverPage
                    student={previewFile.student}
                    details={previewFile.details || {}}
                  />
                </div>

                {/* BOOKLET PERFORATION DIVIDER (Only when showing booklet with attached file) */}
                {previewMode === 'booklet' && previewFile.url && (
                  <div className="no-print w-[724px] max-w-[724px] bg-slate-100 py-2.5 px-4 border-t-2 border-b-2 border-dashed border-slate-300 flex items-center justify-between text-slate-800">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-sky-700" />
                      <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                        Worksheet Practice Questions Section
                      </span>
                    </div>
                    <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full text-[10px] font-black border border-amber-300">
                      {previewFile.title} • {previewFile.name}
                    </span>
                  </div>
                )}

                {/* PAGE 2+: WORKSHEET FILE SECTION */}
                {(previewMode === 'booklet' || previewMode === 'worksheet') && previewFile.url && (
                  <div className={`w-[724px] max-w-[724px] bg-white border border-slate-300 p-4 shadow-2xl ${
                    previewMode === 'booklet' ? 'rounded-b-xl border-t-0' : 'rounded-xl'
                  }`}>
                    {previewFile.url?.endsWith('.pdf') || previewFile.type?.includes('pdf') || previewFile.url?.includes('application/pdf') ? (
                      <iframe
                        src={previewFile.url}
                        title="Worksheet PDF Preview"
                        className="w-full h-[750px] rounded-lg border border-slate-300 shadow-xs bg-white"
                      />
                    ) : previewFile.type?.startsWith('image/') || previewFile.url?.match(/\.(jpeg|jpg|png|webp|gif|bmp)$/i) || previewFile.name?.match(/\.(jpeg|jpg|png|webp|gif|bmp)$/i) ? (
                      <div className="w-full flex flex-col items-center justify-start">
                        <img
                          src={previewFile.url}
                          alt={previewFile.name}
                          className="max-w-full h-auto rounded-lg shadow-md border border-slate-200 bg-white object-contain"
                        />
                      </div>
                    ) : (
                      <div className="text-center p-8 bg-slate-50 rounded-xl border border-slate-200">
                        <FileText className="w-12 h-12 text-blue-700 mx-auto mb-2" />
                        <h4 className="text-sm font-black text-slate-900">{previewFile.name}</h4>
                        <p className="text-xs text-slate-500 mt-1 mb-4">
                          This file is attached as the worksheet practice paper.
                        </p>
                        <a
                          href={previewFile.url}
                          download={previewFile.name}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0c234b] text-white text-xs font-bold"
                        >
                          <Download className="w-3.5 h-3.5 text-amber-400" />
                          <span>Download File</span>
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Full Booklet Worksheet View (Exact Front Page + Worksheet Upload/Merge) */}
      {viewingWorksheetData && (
        <StudentWorksheetView
          student={viewingWorksheetData.student}
          initialSlot={viewingWorksheetData.slot || 1}
          onClose={() => setViewingWorksheetData(null)}
        />
      )}
    </div>
  );
}
