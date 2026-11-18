import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  UserRound,
  BookOpen,
  Save,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  RotateCcw,
  Pencil,
  X,
  Download,
  FileText,
  Printer,
  Loader2,
  ClipboardList,
  Eye,
  Trash2,
} from 'lucide-react';

import OfficialMarksheetView, {
  getCourseSubjectModules,
} from '../../components/OfficialMarksheetView';
import {
  normalize,
  getStudentCourse,
  getStudentKey,
  getGrade,
  getSavedMarksheet,
  readMarksheets,
  writeMarksheets,
} from '../../utils/marksheetStorage';
import { exportPdfFromElement } from '../../utils/pdfExport';

const PLACEHOLDER_ROWS = 3;
const MIN_SUBJECT_COLS = 5;
const NAVY = '#0b2a55';
const GOLD = '#b8892f';
const PRINT_ROOT_ID = 'bsel-print-root';

// A4 landscape printable width with 8mm margins is about 1060px at 96dpi.
// The export frame uses this width so it fills the page with no right-hand gap.
const EXPORT_WIDTH = 1060;
const CELL_BORDER = `1.2px solid ${NAVY}`;
const FRAME_BORDER = 3;
const FRAME_PAD = 4;
const GOLD_BORDER = 1;
const INNER_PAD = 16;

// ------------------------------------------------
// SESSION LIST STORAGE (survives page switches, cleared by Reset)
// ------------------------------------------------

const sessionKeyFor = (branch) => `bsel_marks_session_${branch || 'default'}`;

const readSession = (branch) => {
  try {
    const raw = sessionStorage.getItem(sessionKeyFor(branch));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeSession = (branch, records) => {
  try {
    sessionStorage.setItem(sessionKeyFor(branch), JSON.stringify(records));
  } catch (err) {
    console.error('Unable to store session list:', err);
  }
};

// Keep the stored snapshot small: drop photo data
const snapshotStudent = (st) => {
  const { photoUrl, photo, imageUrl, ...rest } = st || {};
  return rest;
};

// ------------------------------------------------
// HELPERS
// ------------------------------------------------

const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[ch]));

const getRemarkText = (pct) => {
  const n = Number(pct);
  if (n >= 90) return 'Exceptional Performance. Keep shining!';
  if (n >= 75) return 'Brilliant effort! Aiming for A+ next time.';
  if (n >= 60) return 'Great job! A little more focus and you will reach the top.';
  if (n >= 40) return "Don't give up, regular practice is the key to success.";
  return "Don't worry, every expert was once a beginner.";
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${day}-${month}-${d.getFullYear()}`;
};

const todayStamp = () => new Date().toISOString().slice(0, 10);

const safeBranchName = (branch) =>
  String(branch || 'Branch').replace(/[^a-zA-Z0-9]/g, '_');

// Builds the marksheet body (single-student Word download)
const buildSheetBody = (student, sheet) => {
  const regNo = sheet.registerNumber || student.registerNumber || student.registrationNo || '-';
  const name = student.studentName || '-';
  const parent = student.parentName || student.fatherName || '-';
  const dob = student.dob || student.dateOfBirth || '-';
  const course = sheet.course || getStudentCourse(student) || '-';
  const level = student.level || student.courseLevel || '-';
  const duration = student.duration || student.courseDuration || '-';
  const school = student.branch || student.school || student.centreName || sheet.branch || '-';
  const address = student.address || student.centreAddress || student.district || '-';
  const issue = formatDate(student.enrolmentDate || student.issueDate || sheet.updatedAt);

  const subjectRows = (sheet.subjects || [])
    .map((s, i) => {
      const pct = Math.round(((Number(s.marks) || 0) / (Number(s.max) || 100)) * 100);
      return `
        <tr>
          <td class="c">${i + 1}</td>
          <td>${escapeHtml(s.name)}</td>
          <td class="c">${escapeHtml(s.max)}</td>
          <td class="c">${escapeHtml(s.marks)}</td>
          <td class="c">${pct}%</td>
          <td class="c">${getGrade(pct)}</td>
        </tr>`;
    })
    .join('');

  const pctValue = Number(sheet.percentage) || 0;

  return `
  <div class="brand">
    <h1>B★SEL</h1>
    <p>BOARD OF SKILLS AND EDUCATIONAL LEARNING</p>
    <p>${escapeHtml(school)}</p>
  </div>

  <div class="band">GRADE CARD / RESULT SHEET</div>
  <div class="band">STUDENT &amp; COURSE DETAILS</div>
  <table>
    <tr><td class="label">Registration No.</td><td>${escapeHtml(regNo)}</td></tr>
    <tr><td class="label">Student Name</td><td>${escapeHtml(name)}</td></tr>
    <tr><td class="label">Parent / Guardian</td><td>${escapeHtml(parent)}</td></tr>
    <tr><td class="label">Date of Birth</td><td>${escapeHtml(dob)}</td></tr>
    <tr><td class="label">Course</td><td>${escapeHtml(course)}</td></tr>
    <tr><td class="label">Level</td><td>${escapeHtml(level)}</td></tr>
    <tr><td class="label">Duration</td><td>${escapeHtml(duration)}</td></tr>
    <tr><td class="label">School / Exam Centre</td><td>${escapeHtml(school)}</td></tr>
    <tr><td class="label">Address</td><td>${escapeHtml(address)}</td></tr>
  </table>

  <div class="band">SUBJECTS &amp; MARKS OBTAINED</div>
  <table>
    <tr>
      <th>S.No.</th><th>Subject / Module</th><th>Max Marks</th>
      <th>Marks Obtained</th><th>Percentage</th><th>Grade</th>
    </tr>
    ${subjectRows}
    <tr class="total">
      <td colspan="2" class="c">TOTAL</td>
      <td class="c">${escapeHtml(sheet.totalMaximum)}</td>
      <td class="c">${escapeHtml(sheet.totalMarks)}</td>
      <td class="c">${pctValue.toFixed(2)}%</td>
      <td class="c">${escapeHtml(sheet.overallGrade)}</td>
    </tr>
  </table>

  <p class="remark">"${escapeHtml(getRemarkText(pctValue))}"</p>

  <table>
    <tr>
      <td class="label">Date of Issue</td><td>${escapeHtml(issue)}</td>
    </tr>
  </table>

  <p class="sign">Center Director / Principal: ______________________</p>`;
};

const wordDocShell = (title, orientation, bodyHtml) => `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)}</title>
  <style>
    @page { size: A4 ${orientation}; margin: 1.2cm; }
    body { font-family: 'Times New Roman', Times, serif; color: ${NAVY}; font-size: 11pt; }
    .brand { text-align: center; }
    .brand h1 { font-size: 22pt; margin: 0; color: ${NAVY}; }
    .brand p { margin: 2px 0; font-size: 9pt; letter-spacing: 1px; }
    .band { background: ${NAVY}; color: #ffffff; text-align: center; font-weight: bold; padding: 4px; margin-top: 10px; }
    table { border-collapse: collapse; width: 100%; margin-top: 6px; }
    td, th { border: 1px solid ${NAVY}; padding: 5px 6px; font-size: 10pt; }
    th { background: ${NAVY}; color: #ffffff; }
    tr.zebra td { background: #f4f8fc; }
    .c { text-align: center; }
    .label { width: 28%; font-weight: bold; }
    .total td { font-weight: bold; background: #d4eefa; }
    .remark { margin-top: 10px; font-style: italic; font-weight: bold; }
    .sign { margin-top: 40px; }
  </style>
</head>
<body>
  ${bodyHtml}
</body>
</html>`;

// Single marksheet Word file
const buildWordHtml = (student, sheet) =>
  wordDocShell(
    `BSEL Marksheet - ${student.studentName || ''}`,
    'portrait',
    `<div>${buildSheetBody(student, sheet)}</div>`
  );

// Table Word file (matches the Entered Students table)
const buildTableWordHtml = (records, subjectColCount, branch) => {
  const headerSubs = Array.from({ length: subjectColCount })
    .map((_, i) => `<th>Sub ${i + 1}</th>`)
    .join('');

  const rows = records
    .map((rec, idx) => {
      const subCells = Array.from({ length: subjectColCount })
        .map((_, i) => `<td class="c">${escapeHtml(rec.saved.subjects?.[i]?.marks ?? '-')}</td>`)
        .join('');
      const zebra = idx % 2 === 1 ? ' class="zebra"' : '';
      return `
        <tr${zebra}>
          <td class="c">${idx + 1}</td>
          <td>${escapeHtml(rec.student.studentName || '-')}</td>
          <td class="c">${escapeHtml(rec.student.userId || '-')}</td>
          ${subCells}
          <td class="c"><b>${escapeHtml(rec.saved.totalMarks)}/${escapeHtml(rec.saved.totalMaximum)}</b></td>
          <td class="c">${escapeHtml(rec.saved.percentage)}%</td>
          <td class="c">${escapeHtml(rec.saved.overallGrade)}</td>
        </tr>`;
    })
    .join('');

  const body = `
    <div class="brand">
      <h1>B★SEL</h1>
      <p>BOARD OF SKILLS AND EDUCATIONAL LEARNING</p>
      <p>${escapeHtml(branch)}</p>
    </div>
    <div class="band">STUDENT MARKS &amp; REVISION TEST DASHBOARD</div>
    <table>
      <tr>
        <th>S.No</th><th>Student Name</th><th>Student ID</th>
        ${headerSubs}
        <th>Total</th><th>%</th><th>Grade</th>
      </tr>
      ${rows}
    </table>
    <p style="margin-top:8px;font-size:9pt;">Generated on ${escapeHtml(formatDate(new Date().toISOString()))}</p>`;

  return wordDocShell(`BSEL Marks Table - ${branch || ''}`, 'landscape', body);
};

// ------------------------------------------------
// PROFESSIONAL TABLE VIEW (used for Table PDF and Print Table)
// Full-width frame. Every cell has a solid navy grid line.
// ------------------------------------------------

const exportCell = {
  border: CELL_BORDER,
  padding: '6px 4px',
  fontSize: '12px',
  textAlign: 'center',
  color: NAVY,
  verticalAlign: 'middle',
  overflow: 'hidden',
};

const exportHead = {
  border: CELL_BORDER,
  padding: '7px 4px',
  fontSize: '12px',
  fontWeight: 700,
  textAlign: 'center',
  background: NAVY,
  color: '#ffffff',
  overflow: 'hidden',
};

const TableExportView = ({ records, subjectColCount, branch }) => {
  const todayText = formatDate(new Date().toISOString());

  // Column shares in %. Subject columns share whatever is left.
  const FIXED = { sno: 5, name: 16, id: 16, total: 9, pct: 7, grade: 6 };
  const fixedTotal = Object.values(FIXED).reduce((a, b) => a + b, 0);
  const subPct = (100 - fixedTotal) / Math.max(subjectColCount, 1);

  return (
    <div
      style={{
        width: `${EXPORT_WIDTH}px`,
        background: '#ffffff',
        boxSizing: 'border-box',
        fontFamily: "'Times New Roman', Times, serif",
        color: NAVY,
      }}
    >
      {/* Navy outer frame */}
      <div
        style={{
          border: `${FRAME_BORDER}px solid ${NAVY}`,
          padding: `${FRAME_PAD}px`,
          boxSizing: 'border-box',
        }}
      >
        {/* Gold inner rule */}
        <div
          style={{
            border: `${GOLD_BORDER}px solid ${GOLD}`,
            padding: `14px ${INNER_PAD}px 12px`,
            boxSizing: 'border-box',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <div style={{ fontSize: '26px', fontWeight: 900, lineHeight: 1.1 }}>
              B<span style={{ color: GOLD }}>★</span>SEL
            </div>
            <div style={{ fontSize: '11px', letterSpacing: '1.2px', fontWeight: 700 }}>
              BOARD OF SKILLS AND EDUCATIONAL LEARNING
            </div>
            <div style={{ fontSize: '12px', marginTop: '3px', fontWeight: 700 }}>{branch}</div>
          </div>

          {/* Title band */}
          <div
            style={{
              background: NAVY,
              color: '#ffffff',
              textAlign: 'center',
              fontWeight: 'bold',
              padding: '7px',
              fontSize: '14px',
              letterSpacing: '0.5px',
              boxSizing: 'border-box',
            }}
          >
            STUDENT MARKS &amp; REVISION TEST DASHBOARD
          </div>

          {/* Table: full width, fixed layout, outer border 2px */}
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              tableLayout: 'fixed',
              marginTop: '8px',
              border: `2px solid ${NAVY}`,
            }}
          >
            <colgroup>
              <col style={{ width: `${FIXED.sno}%` }} />
              <col style={{ width: `${FIXED.name}%` }} />
              <col style={{ width: `${FIXED.id}%` }} />
              {Array.from({ length: subjectColCount }).map((_, i) => (
                <col key={i} style={{ width: `${subPct}%` }} />
              ))}
              <col style={{ width: `${FIXED.total}%` }} />
              <col style={{ width: `${FIXED.pct}%` }} />
              <col style={{ width: `${FIXED.grade}%` }} />
            </colgroup>

            <thead>
              <tr>
                <th style={exportHead}>S.No</th>
                <th style={{ ...exportHead, textAlign: 'left' }}>Student Name</th>
                <th style={exportHead}>Student ID</th>
                {Array.from({ length: subjectColCount }).map((_, i) => (
                  <th key={i} style={exportHead}>Sub {i + 1}</th>
                ))}
                <th style={exportHead}>Total</th>
                <th style={exportHead}>%</th>
                <th style={exportHead}>Grade</th>
              </tr>
            </thead>

            <tbody>
              {records.map((rec, idx) => {
                const rowBg = idx % 2 === 1 ? '#f4f8fc' : '#ffffff';
                return (
                  <tr key={rec.key} style={{ background: rowBg, pageBreakInside: 'avoid' }}>
                    <td style={exportCell}>{idx + 1}</td>
                    <td
                      style={{
                        ...exportCell,
                        textAlign: 'left',
                        fontWeight: 700,
                        textTransform: 'capitalize',
                        wordBreak: 'break-word',
                      }}
                    >
                      {rec.student.studentName}
                    </td>
                    <td style={{ ...exportCell, wordBreak: 'break-all' }}>{rec.student.userId}</td>
                    {Array.from({ length: subjectColCount }).map((_, i) => (
                      <td key={i} style={exportCell}>
                        {rec.saved.subjects?.[i]?.marks ?? '-'}
                      </td>
                    ))}
                    <td style={{ ...exportCell, fontWeight: 700 }}>
                      {rec.saved.totalMarks}/{rec.saved.totalMaximum}
                    </td>
                    <td style={exportCell}>{rec.saved.percentage}%</td>
                    <td style={{ ...exportCell, fontWeight: 700 }}>{rec.saved.overallGrade}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginTop: '26px',
              fontSize: '11px',
            }}
          >
            <div>Generated on {todayText}</div>
            <div
              style={{
                borderTop: `1px solid ${NAVY}`,
                width: '220px',
                paddingTop: '4px',
                fontWeight: 700,
                textAlign: 'center',
              }}
            >
              Center Director / Principal
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------
// MAIN PAGE
// ------------------------------------------------

export default function BranchStudentMarksheetPage({
  activeBranch,
  branchStudents = [],
  onBack,
}) {
  const [searchId, setSearchId] = useState('');
  const [student, setStudent] = useState(null);

  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState({});
  const [savedData, setSavedData] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Session list: restored from sessionStorage so it survives page switches
  const [sessionRecords, setSessionRecords] = useState(() => readSession(activeBranch));

  // Single-student preview popup (null = closed)
  const [previewRecord, setPreviewRecord] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState('');

  // Table export actions
  const [isExportingTable, setIsExportingTable] = useState(false);
  const [bulkError, setBulkError] = useState('');

  const previewWrapRef = useRef(null);
  const tableExportRef = useRef(null);

  useEffect(() => {
    writeSession(activeBranch, sessionRecords);
  }, [sessionRecords, activeBranch]);

  // ------------------------------------------------
  // SUBJECT INITIALIZATION (from the enrolled course)
  // ------------------------------------------------

  const prepareSubjects = (studentData) => {
    const modules = getCourseSubjectModules(getStudentCourse(studentData)) || [];

    return modules.map((subject, index) => ({
      id: String(subject.id || index + 1),
      name: subject.name || `Subject ${index + 1}`,
      max: Number(subject.max) || 100,
      assessment: Number(subject.assessment) || Number(subject.max) || 100,
    }));
  };

  // ------------------------------------------------
  // CURRENT ENTRY HELPERS
  // ------------------------------------------------

  const clearCurrent = () => {
    setStudent(null);
    setSubjects([]);
    setMarks({});
    setSavedData(null);
    setIsEditing(false);
    setExportError('');
  };

  const loadIntoView = (studentData, existing) => {
    const studentSubjects = prepareSubjects(studentData);
    const initialMarks = {};

    studentSubjects.forEach((subject) => {
      initialMarks[subject.id] = existing?.marks?.[subject.id] ?? '';
    });

    setStudent(studentData);
    setSubjects(studentSubjects);
    setMarks(initialMarks);
    setSavedData(existing || null);
    setIsEditing(false);
    setExportError('');
  };

  // ------------------------------------------------
  // SEARCH STUDENT
  // ------------------------------------------------

  const handleSearch = (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');
    clearCurrent();

    const query = normalize(searchId);

    if (!query) {
      setError('Please enter a Student ID or Register Number.');
      return;
    }

    const foundStudent = branchStudents.find((st) => {
      return (
        normalize(st.userId) === query ||
        normalize(st.registerNumber) === query ||
        normalize(st.registrationNo) === query
      );
    });

    if (!foundStudent) {
      setError('Student not found in this branch. Please check the Student ID.');
      return;
    }

    const studentSubjects = prepareSubjects(foundStudent);

    if (!studentSubjects.length) {
      setError(
        'No subjects are configured for this student course. Please check the course subject configuration.'
      );
      return;
    }

    loadIntoView(foundStudent, getSavedMarksheet(foundStudent));
  };

  // ------------------------------------------------
  // EDIT / MARK CHANGE
  // ------------------------------------------------

  const handleEditMarks = () => {
    if (!student) return;
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleMarkChange = (subjectId, value) => {
    if (value !== '' && !/^\d+$/.test(value)) return;

    setMarks((previous) => ({
      ...previous,
      [subjectId]: value,
    }));
  };

  // ------------------------------------------------
  // CALCULATIONS
  // ------------------------------------------------

  const totalMaximum = subjects.reduce((total, subject) => total + subject.max, 0);

  const totalObtained = subjects.reduce(
    (total, subject) => total + (Number(marks[subject.id]) || 0),
    0
  );

  const percentage = totalMaximum > 0 ? (totalObtained / totalMaximum) * 100 : 0;

  const allMarksEntered =
    subjects.length > 0 &&
    subjects.every(
      (subject) => marks[subject.id] !== '' && marks[subject.id] !== undefined
    );

  // ------------------------------------------------
  // SAVE MARKS
  // ------------------------------------------------

  const handleSaveMarks = () => {
    setError('');
    setSuccess('');

    if (!student) return;

    const incompleteSubject = subjects.find(
      (subject) => marks[subject.id] === '' || marks[subject.id] === undefined
    );

    if (incompleteSubject) {
      setError(`Please enter marks for ${incompleteSubject.name}.`);
      return;
    }

    const invalidSubject = subjects.find((subject) => {
      const value = Number(marks[subject.id]);
      return !Number.isFinite(value) || value < 0 || value > subject.max;
    });

    if (invalidSubject) {
      setError(`${invalidSubject.name}: Marks cannot exceed ${invalidSubject.max}.`);
      return;
    }

    const totalMarks = subjects.reduce(
      (total, subject) => total + Number(marks[subject.id]),
      0
    );

    const maxMarks = subjects.reduce((total, subject) => total + subject.max, 0);

    const calculatedPercentage =
      maxMarks > 0 ? Number(((totalMarks / maxMarks) * 100).toFixed(2)) : 0;

    const marksheet = {
      studentId: student.userId,
      studentName: student.studentName,
      registerNumber: student.registerNumber || student.registrationNo || '',
      branch: activeBranch,
      course: getStudentCourse(student),
      grade: student.grade || '',
      subjects: subjects.map((subject) => ({
        ...subject,
        marks: Number(marks[subject.id]),
      })),
      marks: Object.fromEntries(
        subjects.map((subject) => [subject.id, Number(marks[subject.id])])
      ),
      totalMarks,
      totalMaximum: maxMarks,
      percentage: calculatedPercentage.toFixed(2),
      overallGrade: getGrade(calculatedPercentage),
      updatedAt: new Date().toISOString(),
    };

    try {
      const allMarksheets = readMarksheets();
      const key = getStudentKey(student);
      allMarksheets[key] = marksheet;
      writeMarksheets(allMarksheets);

      setSavedData(marksheet);
      setIsEditing(false);

      setSessionRecords((prev) => {
        const record = { key, student: snapshotStudent(student), saved: marksheet };
        const exists = prev.some((r) => r.key === key);
        return exists
          ? prev.map((r) => (r.key === key ? record : r))
          : [...prev, record];
      });

      setSuccess('Student marks saved successfully!');
    } catch (saveError) {
      console.error('Unable to save student marks:', saveError);
      setError('Unable to save marks. Please try again.');
    }
  };

  // ------------------------------------------------
  // CANCEL EDITING
  // ------------------------------------------------

  const handleCancelEditing = () => {
    setIsEditing(false);
    setError('');

    const restored = {};
    subjects.forEach((subject) => {
      restored[subject.id] = savedData?.marks?.[subject.id] ?? '';
    });
    setMarks(restored);
  };

  // ------------------------------------------------
  // OPEN A STUDENT FROM THE LIST (loads into entry area)
  // ------------------------------------------------

  const handleOpenRecord = (record) => {
    setError('');
    setSuccess('');
    setSearchId(String(record.student.userId || ''));

    const live =
      branchStudents.find((st) => getStudentKey(st) === record.key) || record.student;
    loadIntoView(live, record.saved);
  };

  // ------------------------------------------------
  // PREVIEW POPUP (single marksheet)
  // ------------------------------------------------

  const resolveStudentFor = (record) =>
    branchStudents.find((st) => getStudentKey(st) === record.key) || record.student;

  const openPreview = (record) => {
    setExportError('');
    setPreviewRecord({
      key: record.key,
      student: resolveStudentFor(record),
      saved: record.saved,
    });
  };

  const openPreviewForCurrent = () => {
    if (!student || !savedData) return;
    openPreview({ key: getStudentKey(student), student, saved: savedData });
  };

  const closePreview = () => {
    setPreviewRecord(null);
    setExportError('');
  };

  // ------------------------------------------------
  // FILE NAMES / DOWNLOAD HELPERS
  // ------------------------------------------------

  const getSafeFileName = (st) => {
    const name = (st?.studentName || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
    const reg = String(st?.registerNumber || st?.registrationNo || st?.userId || 'NA')
      .replace(/[^a-zA-Z0-9]/g, '_');
    return `BSEL_Marksheet_${reg}_${name}`;
  };

  const downloadBlob = (html, filename) => {
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // ------------------------------------------------
  // PRINT HELPER: sets page size for this print only
  // ------------------------------------------------

  const printWithPage = ({ size, margin, bodyClass }) => {
    const styleEl = document.createElement('style');
    styleEl.id = 'bsel-print-page-size';
    styleEl.textContent = `@page { size: ${size}; margin: ${margin}; }`;
    document.head.appendChild(styleEl);
    document.body.classList.add(bodyClass);

    const cleanup = () => {
      document.body.classList.remove(bodyClass);
      document.getElementById('bsel-print-page-size')?.remove();
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);

    setTimeout(() => window.print(), 50);
  };

  // ------------------------------------------------
  // SINGLE MARKSHEET: PDF / WORD / PRINT (from preview popup)
  // ------------------------------------------------

  const handleExportPdf = async () => {
    if (!previewWrapRef.current || isExporting || !previewRecord) return;

    setIsExporting(true);
    setExportError('');

    try {
      await exportPdfFromElement(previewWrapRef.current, {
        filename: `${getSafeFileName(previewRecord.student)}.pdf`,
        orientation: 'portrait',
        margin: 0,
        backgroundColor: '#ffffff',
        scale: 2.5,
      });
    } catch (err) {
      console.error('PDF export failed:', err);
      setExportError('Unable to download PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportWord = () => {
    if (!previewRecord) return;

    try {
      const html = buildWordHtml(previewRecord.student, previewRecord.saved);
      downloadBlob(html, `${getSafeFileName(previewRecord.student)}.doc`);
      setExportError('');
    } catch (err) {
      console.error('Word export failed:', err);
      setExportError('Unable to download Word file. Please try again.');
    }
  };

  const handlePrint = () => {
    setExportError('');
    printWithPage({ size: 'A4 portrait', margin: '0', bodyClass: 'bsel-print-single' });
  };

  // ------------------------------------------------
  // TABLE: PDF / WORD / PRINT (entered students table only)
  // ------------------------------------------------

  const tableFileBase = () =>
    `BSEL_Marks_Table_${safeBranchName(activeBranch)}_${todayStamp()}`;

  const handleDownloadTablePdf = async () => {
    if (!tableExportRef.current || isExportingTable || sessionRecords.length === 0) return;

    setIsExportingTable(true);
    setBulkError('');

    try {
      await exportPdfFromElement(tableExportRef.current, {
        filename: `${tableFileBase()}.pdf`,
        orientation: 'landscape',
        margin: 0,
        backgroundColor: '#ffffff',
        scale: 2.5,
      });
    } catch (err) {
      console.error('Table PDF export failed:', err);
      setBulkError('Unable to download the table PDF. Please try again.');
    } finally {
      setIsExportingTable(false);
    }
  };

  const handleDownloadTableWord = () => {
    if (sessionRecords.length === 0) return;

    try {
      const html = buildTableWordHtml(sessionRecords, subjectColCount, activeBranch);
      downloadBlob(html, `${tableFileBase()}.doc`);
      setBulkError('');
    } catch (err) {
      console.error('Table Word export failed:', err);
      setBulkError('Unable to download the table Word file. Please try again.');
    }
  };

  const handlePrintTable = () => {
    if (sessionRecords.length === 0) return;

    setBulkError('');
    printWithPage({ size: 'A4 landscape', margin: '8mm', bodyClass: 'bsel-print-table' });
  };

  // ------------------------------------------------
  // DELETE ONE STUDENT FROM THE LIST
  // ------------------------------------------------

  const handleDeleteRecord = (record) => {
    const ok = window.confirm(
      `Remove ${record.student.studentName || 'this student'} from the list?`
    );
    if (!ok) return;

    setSessionRecords((prev) => prev.filter((r) => r.key !== record.key));

    if (student && getStudentKey(student) === record.key) {
      setSearchId('');
      clearCurrent();
      setSuccess('');
    }

    if (previewRecord && previewRecord.key === record.key) {
      closePreview();
    }
  };

  // ------------------------------------------------
  // NEXT STUDENT (clears only the current entry)
  // ------------------------------------------------

  const handleNextStudent = () => {
    setSearchId('');
    clearCurrent();
    setError('');
    setSuccess('');
  };

  // ------------------------------------------------
  // RESET (erases the whole list, nothing else)
  // ------------------------------------------------

  const handleReset = () => {
    if (sessionRecords.length > 0) {
      const ok = window.confirm(
        'Erase all students from this list? Saved marks stay in storage, but the list will be cleared.'
      );
      if (!ok) return;
    }

    setSearchId('');
    setSessionRecords([]);
    setPreviewRecord(null);
    clearCurrent();
    setError('');
    setSuccess('');
    setBulkError('');
    writeSession(activeBranch, []);
  };

  // ------------------------------------------------
  // UI
  // ------------------------------------------------

  const dash = '—';
  const canPreviewCurrent = Boolean(student && savedData && !isEditing);
  const hasList = sessionRecords.length > 0;

  const subjectColCount = Math.max(
    MIN_SUBJECT_COLS,
    ...sessionRecords.map((r) => r.saved?.subjects?.length || 0)
  );

  const renderMarkInput = (subject) => {
    const entered = marks[subject.id];
    return (
      <input
        type="number"
        min="0"
        max={subject.max}
        step="1"
        value={entered ?? ''}
        onChange={(e) => handleMarkChange(subject.id, e.target.value)}
        placeholder="Enter"
        className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold outline-none focus:ring-2 focus:ring-sky-500"
      />
    );
  };

  const renderGradeBadge = (subject) => {
    const entered = marks[subject.id];
    const hasValue = entered !== '' && entered !== undefined;
    const subjectPercentage = hasValue ? (Number(entered) / subject.max) * 100 : null;
    return (
      <span className="px-1.5 sm:px-2 py-0.5 rounded-lg bg-sky-50 text-sky-800 text-[10px] font-black">
        {subjectPercentage !== null ? getGrade(subjectPercentage) : '-'}
      </span>
    );
  };

  // Off-screen copy used for PDF capture and table printing.
  // Rendered directly under <body> so the app layout cannot squeeze it.
  const printTableNode = hasList ? (
    <div
      id={PRINT_ROOT_ID}
      ref={tableExportRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: '-10000px',
        top: 0,
        width: `${EXPORT_WIDTH}px`,
        background: '#ffffff',
      }}
    >
      <TableExportView
        records={sessionRecords}
        subjectColCount={subjectColCount}
        branch={activeBranch}
      />
    </div>
  ) : null;

  return (
    <div className="space-y-2 animate-in fade-in duration-200">
      <style>{`
        @media print {
          /* Single marksheet: print only the marksheet */
          body.bsel-print-single * { visibility: hidden !important; }
          body.bsel-print-single #marksheet-print-area,
          body.bsel-print-single #marksheet-print-area * { visibility: visible !important; }
          body.bsel-print-single #marksheet-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Table: print only the table root, full width of the landscape page */
          body.bsel-print-table * { visibility: hidden !important; }
          body.bsel-print-table #${PRINT_ROOT_ID},
          body.bsel-print-table #${PRINT_ROOT_ID} * { visibility: visible !important; }
          body.bsel-print-table #${PRINT_ROOT_ID} {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          body.bsel-print-table #${PRINT_ROOT_ID},
          body.bsel-print-table #${PRINT_ROOT_ID} * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .no-print { display: none !important; }
        }
      `}</style>

      {/* TOP BAR */}
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <div className="min-w-0">
          <h1 className="text-sm sm:text-base font-black text-slate-950 leading-tight">
            Student Marksheet
          </h1>
          <p className="text-[10px] sm:text-[11px] text-slate-500 leading-tight truncate">
            Examination results management
          </p>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-sky-50 border border-sky-100 rounded-xl shrink-0">
          <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-700" />
          <span className="text-[10px] sm:text-xs font-bold text-sky-900">{activeBranch}</span>
        </div>
      </div>

      {/* ============================================
          ENTRY SECTION
      ============================================ */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* SEARCH */}
        <div className="p-2 sm:p-3 border-b border-slate-100">
          <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-xl mx-auto">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Student ID / Register Number"
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 rounded-xl border border-slate-200 outline-none text-xs sm:text-sm font-medium focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <button
              type="submit"
              className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl bg-[#0c234b] hover:bg-[#173d70] text-white text-[10px] sm:text-xs font-black flex items-center justify-center gap-1.5 sm:gap-2 transition shrink-0"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Search Student</span>
              <span className="sm:hidden">Search</span>
            </button>
          </form>

          {error && (
            <div className="mt-2 max-w-xl mx-auto flex items-start gap-2 p-2 rounded-xl bg-red-50 border border-red-100 text-red-700 text-[10px] sm:text-xs font-bold">
              <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mt-2 max-w-xl mx-auto flex items-center gap-2 p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] sm:text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}
        </div>

        {/* STUDENT DETAILS */}
        <div className="p-2 sm:p-3 border-b border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <StudentPhoto student={student} />

            <div className="min-w-0 flex-1">
              <h2 className="text-xs sm:text-sm font-black text-slate-950 capitalize truncate">
                {student ? student.studentName : 'No student selected'}
              </h2>

              <p className="text-[10px] sm:text-xs text-slate-500 truncate">
                Student ID:{' '}
                <strong className="text-sky-800">{student ? student.userId : dash}</strong>
              </p>

              <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 mt-1 sm:mt-1.5">
                {savedData && (
                  <span className="px-1.5 sm:px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 text-[9px] sm:text-[10px] font-black flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Marks Saved
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleNextStudent}
                  disabled={!student && !searchId}
                  className="px-2 sm:px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  Next Student
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 min-w-0">
            <InfoCard
              label="Register Number"
              value={
                student
                  ? student.registerNumber || student.registrationNo || 'Not available'
                  : dash
              }
            />
            <InfoCard
              label="Enrolled Course"
              value={student ? getStudentCourse(student) || 'Not available' : dash}
            />
            <InfoCard
              label="Grade / Level"
              value={student ? student.grade || 'Not available' : dash}
            />
            <InfoCard label="Branch" value={activeBranch} />
          </div>
        </div>

        {/* MARKS HEADER */}
        <div className="px-2 sm:px-3 py-2 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-black text-slate-950 leading-tight">
                Subject-wise Marks
              </h2>
              <p className="text-[9px] sm:text-[11px] text-slate-500 leading-tight truncate">
                {student
                  ? `${subjects.length} subjects in ${getStudentCourse(student) || 'this course'}`
                  : 'Search a student to load their course subjects'}
              </p>
            </div>
          </div>

          <div className="flex gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={openPreviewForCurrent}
              disabled={!canPreviewCurrent}
              title={
                !savedData
                  ? 'Save marks first to preview the marksheet'
                  : isEditing
                    ? 'Save or cancel editing to preview'
                    : 'Preview official marksheet'
              }
              className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-white border border-slate-300 text-[#0c234b] text-[10px] sm:text-xs font-black flex items-center gap-1 sm:gap-1.5 hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Preview
            </button>

            {!isEditing ? (
              <button
                type="button"
                onClick={handleEditMarks}
                disabled={!student}
                className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg bg-[#0c234b] hover:bg-[#173d70] text-white text-[10px] sm:text-xs font-black flex items-center gap-1 sm:gap-1.5 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                {savedData ? 'Edit Marks' : 'Add Marks'}
              </button>
            ) : (
              <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-sky-50 border border-sky-100 text-sky-800 text-[10px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5">
                <Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                Editing
              </div>
            )}
          </div>
        </div>

        {/* MOBILE: SUBJECT CARDS */}
        <div className="sm:hidden p-2 space-y-2">
          {subjects.length === 0 &&
            Array.from({ length: PLACEHOLDER_ROWS }).map((_, index) => (
              <div key={`ph-m-${index}`} className="p-2 rounded-xl border border-slate-100 text-slate-300 text-xs font-bold">
                {index + 1}. {dash}
              </div>
            ))}

          {subjects.map((subject, index) => (
            <div key={subject.id} className="p-2 rounded-xl border border-slate-200 bg-white">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] font-black text-slate-900 leading-snug">
                  {index + 1}. {subject.name}
                </p>
                {renderGradeBadge(subject)}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <span className="block text-[9px] font-bold uppercase text-slate-400">Max</span>
                  <span className="text-xs font-bold text-slate-600">{subject.max}</span>
                </div>
                <div>
                  <span className="block text-[9px] font-bold uppercase text-slate-400">Obtained</span>
                  {isEditing ? (
                    renderMarkInput(subject)
                  ) : (
                    <span className="text-xs font-black text-slate-900">
                      {marks[subject.id] !== '' && marks[subject.id] !== undefined
                        ? marks[subject.id]
                        : '-'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP / TABLET: SUBJECT TABLE */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 sm:px-4 py-1.5 border border-slate-300 text-[10px] uppercase tracking-wider font-black text-slate-500">S.No</th>
                <th className="px-3 sm:px-4 py-1.5 border border-slate-300 text-[10px] uppercase tracking-wider font-black text-slate-500">Subject Name</th>
                <th className="px-3 sm:px-4 py-1.5 border border-slate-300 text-[10px] uppercase tracking-wider font-black text-slate-500">Maximum Marks</th>
                <th className="px-3 sm:px-4 py-1.5 border border-slate-300 text-[10px] uppercase tracking-wider font-black text-slate-500">Obtained Marks</th>
                <th className="px-3 sm:px-4 py-1.5 border border-slate-300 text-[10px] uppercase tracking-wider font-black text-slate-500">Grade</th>
              </tr>
            </thead>

            <tbody>
              {subjects.length === 0 &&
                Array.from({ length: PLACEHOLDER_ROWS }).map((_, index) => (
                  <tr key={`placeholder-${index}`} className="text-slate-300">
                    <td className="px-3 sm:px-4 py-1.5 border border-slate-200 text-xs font-bold">{index + 1}</td>
                    <td className="px-3 sm:px-4 py-1.5 border border-slate-200 text-xs font-bold">{dash}</td>
                    <td className="px-3 sm:px-4 py-1.5 border border-slate-200 text-xs font-bold">{dash}</td>
                    <td className="px-3 sm:px-4 py-1.5 border border-slate-200 text-xs font-bold">{dash}</td>
                    <td className="px-3 sm:px-4 py-1.5 border border-slate-200 text-xs font-bold">{dash}</td>
                  </tr>
                ))}

              {subjects.map((subject, index) => {
                const entered = marks[subject.id];
                const hasValue = entered !== '' && entered !== undefined;

                return (
                  <tr key={subject.id} className="hover:bg-slate-50/70">
                    <td className="px-3 sm:px-4 py-1.5 border border-slate-200 text-xs font-bold text-slate-500">{index + 1}</td>
                    <td className="px-3 sm:px-4 py-1.5 border border-slate-200 text-xs font-bold text-slate-900">{subject.name}</td>
                    <td className="px-3 sm:px-4 py-1.5 border border-slate-200 text-xs font-bold text-slate-600">{subject.max}</td>
                    <td className="px-3 sm:px-4 py-1.5 border border-slate-200">
                      {isEditing ? (
                        <div className="w-24">{renderMarkInput(subject)}</div>
                      ) : (
                        <span className="text-xs font-black text-slate-900">
                          {hasValue ? entered : '-'}
                        </span>
                      )}
                    </td>
                    <td className="px-3 sm:px-4 py-1.5 border border-slate-200">{renderGradeBadge(subject)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* TOTALS + ACTIONS */}
        <div className="p-2 sm:p-3 border-t border-slate-100 bg-slate-50/70 flex flex-col lg:flex-row lg:items-center justify-between gap-2">
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 flex-1">
            <div className="bg-white rounded-lg border border-slate-200 px-2 sm:px-3 py-1 sm:py-1.5 min-w-0">
              <span className="block text-[8px] sm:text-[10px] text-slate-500 font-bold uppercase truncate">
                Total Marks
              </span>
              <div className="text-xs sm:text-sm font-black text-slate-950 leading-tight truncate">
                {student ? totalObtained : dash}
                <span className="text-[10px] sm:text-xs text-slate-400"> / {student ? totalMaximum : dash}</span>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 px-2 sm:px-3 py-1 sm:py-1.5 min-w-0">
              <span className="block text-[8px] sm:text-[10px] text-slate-500 font-bold uppercase truncate">
                Percentage
              </span>
              <div className="text-xs sm:text-sm font-black text-sky-800 leading-tight truncate">
                {allMarksEntered
                  ? `${percentage.toFixed(2)}%`
                  : savedData
                    ? `${savedData.percentage}%`
                    : '-'}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 px-2 sm:px-3 py-1 sm:py-1.5 min-w-0">
              <span className="block text-[8px] sm:text-[10px] text-slate-500 font-bold uppercase truncate">
                Overall Grade
              </span>
              <div className="text-xs sm:text-sm font-black text-amber-600 leading-tight">
                {allMarksEntered ? getGrade(percentage) : savedData?.overallGrade || '-'}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="grid grid-cols-2 sm:flex gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCancelEditing}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-[10px] sm:text-xs font-black hover:bg-slate-100 flex items-center justify-center gap-1.5 sm:gap-2"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveMarks}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-[#0c234b] text-[10px] sm:text-xs font-black flex items-center justify-center gap-1.5 sm:gap-2"
              >
                <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Save Marks
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ============================================
          ENTERED STUDENTS TABLE (persists until Reset)
      ============================================ */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-2 sm:px-3 py-2 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center">
              <ClipboardList className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-black text-slate-950 leading-tight">
                Entered Students
              </h2>
              <p className="text-[9px] sm:text-[11px] text-slate-500 leading-tight truncate">
                {sessionRecords.length} student(s) · tap a row to edit · download the table below
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDownloadTablePdf}
              disabled={!hasList || isExportingTable}
              className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] sm:text-xs font-black flex items-center justify-center gap-1 sm:gap-1.5 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isExportingTable ? (
                <Loader2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin" />
              ) : (
                <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              )}
              {isExportingTable ? 'Working...' : 'Table PDF'}
            </button>

            <button
              type="button"
              onClick={handleDownloadTableWord}
              disabled={!hasList}
              className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-[#163e7c] hover:bg-[#1f54a6] text-white text-[10px] sm:text-xs font-black flex items-center justify-center gap-1 sm:gap-1.5 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Table Word
            </button>

            <button
              type="button"
              onClick={handlePrintTable}
              disabled={!hasList}
              className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-white border border-slate-300 text-[#0c234b] text-[10px] sm:text-xs font-black flex items-center justify-center gap-1 sm:gap-1.5 hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Printer className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Print Table
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[10px] sm:text-xs font-black flex items-center justify-center gap-1 sm:gap-1.5 transition"
            >
              <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Reset
            </button>
          </div>
        </div>

        {bulkError && (
          <div className="mx-2 sm:mx-3 mt-2 flex items-start gap-2 p-2 rounded-xl bg-red-50 border border-red-100 text-red-700 text-[10px] sm:text-xs font-bold">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{bulkError}</span>
          </div>
        )}

        {/* MOBILE: CARDS */}
        <div className="sm:hidden p-2 space-y-2">
          {sessionRecords.length === 0 &&
            Array.from({ length: PLACEHOLDER_ROWS }).map((_, index) => (
              <div key={`sm-ph-${index}`} className="p-2 rounded-xl border border-slate-100 text-slate-300 text-xs font-bold">
                {index + 1}. {dash}
              </div>
            ))}

          {sessionRecords.map((rec, idx) => (
            <div
              key={rec.key}
              className="p-2 rounded-xl border border-slate-200 bg-white"
            >
              <button
                type="button"
                onClick={() => handleOpenRecord(rec)}
                className="w-full text-left"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[11px] font-black text-slate-900 capitalize truncate">
                      {idx + 1}. {rec.student.studentName}
                    </p>
                    <p className="text-[9px] text-slate-500 truncate">ID: {rec.student.userId}</p>
                  </div>
                  <span className="px-1.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-black shrink-0">
                    {rec.saved.overallGrade}
                  </span>
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-bold">
                  <span className="text-slate-500">
                    Total: <strong className="text-slate-900">{rec.saved.totalMarks}/{rec.saved.totalMaximum}</strong>
                  </span>
                  <span className="text-sky-800">{rec.saved.percentage}%</span>
                </div>
              </button>

              <div className="grid grid-cols-2 gap-1.5 mt-2">
                <button
                  type="button"
                  onClick={() => openPreview(rec)}
                  className="px-2 py-1 rounded-lg bg-white border border-slate-300 text-[#0c234b] text-[10px] font-black flex items-center justify-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  Preview
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteRecord(rec)}
                  className="px-2 py-1 rounded-lg bg-red-50 border border-red-100 text-red-700 text-[10px] font-black flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP / TABLET: TABLE */}
        <div className="hidden sm:block overflow-x-auto p-2">
          <table className="w-full text-center min-w-[720px] border-collapse border border-slate-300">
            <thead className="bg-[#0b2a55] text-white">
              <tr>
                <th className="px-2 py-2 border border-slate-600 text-[10px] font-black uppercase tracking-wider">S.No</th>
                <th className="px-2 py-2 border border-slate-600 text-[10px] font-black uppercase tracking-wider text-left">Student Name</th>
                <th className="px-2 py-2 border border-slate-600 text-[10px] font-black uppercase tracking-wider">Student ID</th>
                {Array.from({ length: subjectColCount }).map((_, i) => (
                  <th key={i} className="px-2 py-2 border border-slate-600 text-[10px] font-black uppercase tracking-wider">
                    Sub {i + 1}
                  </th>
                ))}
                <th className="px-2 py-2 border border-slate-600 text-[10px] font-black uppercase tracking-wider">Total</th>
                <th className="px-2 py-2 border border-slate-600 text-[10px] font-black uppercase tracking-wider">%</th>
                <th className="px-2 py-2 border border-slate-600 text-[10px] font-black uppercase tracking-wider">Grade</th>
                <th className="px-2 py-2 border border-slate-600 text-[10px] font-black uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody>
              {sessionRecords.length === 0 &&
                Array.from({ length: PLACEHOLDER_ROWS }).map((_, index) => (
                  <tr key={`ph-${index}`} className="text-slate-300 text-xs font-bold">
                    <td className="px-2 py-1.5 border border-slate-200">{index + 1}</td>
                    <td className="px-2 py-1.5 border border-slate-200 text-left">{dash}</td>
                    <td className="px-2 py-1.5 border border-slate-200">{dash}</td>
                    {Array.from({ length: subjectColCount }).map((_, i) => (
                      <td key={i} className="px-2 py-1.5 border border-slate-200">{dash}</td>
                    ))}
                    <td className="px-2 py-1.5 border border-slate-200">{dash}</td>
                    <td className="px-2 py-1.5 border border-slate-200">{dash}</td>
                    <td className="px-2 py-1.5 border border-slate-200">{dash}</td>
                    <td className="px-2 py-1.5 border border-slate-200">{dash}</td>
                  </tr>
                ))}

              {sessionRecords.map((rec, idx) => (
                <tr
                  key={rec.key}
                  onClick={() => handleOpenRecord(rec)}
                  className="cursor-pointer hover:bg-sky-50/60 text-xs font-bold text-slate-800"
                >
                  <td className="px-2 py-1.5 border border-slate-300 text-slate-500">{idx + 1}</td>
                  <td className="px-2 py-1.5 border border-slate-300 text-left capitalize text-slate-900 max-w-[180px] break-words">
                    {rec.student.studentName}
                  </td>
                  <td className="px-2 py-1.5 border border-slate-300">{rec.student.userId}</td>
                  {Array.from({ length: subjectColCount }).map((_, i) => (
                    <td
                      key={i}
                      className="px-2 py-1.5 border border-slate-300"
                      title={rec.saved.subjects?.[i]?.name || ''}
                    >
                      {rec.saved.subjects?.[i]?.marks ?? '-'}
                    </td>
                  ))}
                  <td className="px-2 py-1.5 border border-slate-300 font-black whitespace-nowrap">
                    {rec.saved.totalMarks}/{rec.saved.totalMaximum}
                  </td>
                  <td className="px-2 py-1.5 border border-slate-300 text-sky-800">{rec.saved.percentage}%</td>
                  <td className="px-2 py-1.5 border border-slate-300">
                    <span className="px-1.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-black">
                      {rec.saved.overallGrade}
                    </span>
                  </td>
                  <td className="px-2 py-1.5 border border-slate-300">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openPreview(rec);
                        }}
                        className="px-2 py-1 rounded-lg bg-white border border-slate-300 text-[#0c234b] text-[10px] font-black flex items-center gap-1 hover:bg-slate-50"
                      >
                        <Eye className="w-3 h-3" />
                        Preview
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRecord(rec);
                        }}
                        className="px-2 py-1 rounded-lg bg-red-50 border border-red-100 text-red-700 text-[10px] font-black flex items-center gap-1 hover:bg-red-100"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRINT / PDF TABLE: rendered directly under <body> via portal */}
      {printTableNode && typeof document !== 'undefined'
        ? createPortal(printTableNode, document.body)
        : null}

      {/* ============================================
          PREVIEW POPUP (single marksheet, opens only on Preview)
      ============================================ */}
      {previewRecord && (
        <div
          className="fixed inset-0 z-[160] flex items-start justify-center bg-slate-900/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto no-print-overlay"
          onClick={closePreview}
        >
          <div
            className="w-full max-w-[760px] bg-white rounded-2xl shadow-2xl border border-slate-200 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-3 py-2 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 no-print">
              <div className="min-w-0">
                <h2 className="text-xs sm:text-sm font-black text-slate-950">Marksheet Preview</h2>
                <p className="text-[9px] sm:text-[11px] text-slate-500 truncate capitalize">
                  {previewRecord.student.studentName} · ID {previewRecord.student.userId} · {previewRecord.saved.percentage}% · Grade {previewRecord.saved.overallGrade}
                </p>
              </div>

              <button
                type="button"
                onClick={closePreview}
                className="self-end sm:self-auto p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-3 py-2 border-b border-slate-100 grid grid-cols-3 gap-1.5 no-print">
              <button
                type="button"
                onClick={handleExportPdf}
                disabled={isExporting}
                className="px-2 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] sm:text-xs font-black flex items-center justify-center gap-1.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                {isExporting ? 'Downloading...' : 'Download PDF'}
              </button>

              <button
                type="button"
                onClick={handleExportWord}
                className="px-2 py-1.5 rounded-lg bg-[#163e7c] hover:bg-[#1f54a6] text-white text-[10px] sm:text-xs font-black flex items-center justify-center gap-1.5 transition"
              >
                <FileText className="w-3.5 h-3.5" />
                Download Word
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-[#0c234b] text-[10px] sm:text-xs font-black flex items-center justify-center gap-1.5 hover:bg-slate-50 transition"
              >
                <Printer className="w-3.5 h-3.5" />
                Print
              </button>
            </div>

            {exportError && (
              <div className="no-print mx-3 mt-2 flex items-start gap-2 p-2 rounded-xl bg-red-50 border border-red-100 text-red-700 text-[10px] sm:text-xs font-bold">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{exportError}</span>
              </div>
            )}

            <div className="p-2 sm:p-3 bg-slate-50/50">
              <div
                id="marksheet-print-area"
                ref={previewWrapRef}
                className="w-full max-w-[724px] mx-auto overflow-hidden bg-white"
              >
                <OfficialMarksheetView
                  key={`${previewRecord.key}-${previewRecord.saved.updatedAt}`}
                  student={previewRecord.student}
                  defaultShowMarks
                  standalone
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------
// REUSABLE STUDENT INFORMATION CARD (compact)
// ------------------------------------------------

function InfoCard({ label, value }) {
  return (
    <div className="px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-lg bg-slate-50 border border-slate-100 min-w-0">
      <div className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-tight truncate">
        {label}
      </div>
      <div className="text-[10px] sm:text-xs font-black text-slate-900 mt-0.5 truncate">
        {value}
      </div>
    </div>
  );
}

// ------------------------------------------------
// STUDENT PHOTO (falls back to an icon if missing or broken)
// ------------------------------------------------

function StudentPhoto({ student }) {
  const [failed, setFailed] = useState(false);

  const photoUrl = student?.photoUrl || student?.photo || student?.imageUrl || '';

  useEffect(() => {
    setFailed(false);
  }, [photoUrl]);

  if (!photoUrl || failed) {
    return (
      <div className="w-11 h-11 sm:w-16 sm:h-16 shrink-0 rounded-xl bg-sky-100 text-[#0c234b] flex items-center justify-center">
        <UserRound className="w-5 h-5 sm:w-7 sm:h-7" />
      </div>
    );
  }

  return (
    <img
      src={photoUrl}
      alt={student?.studentName || 'Student'}
      onError={() => setFailed(true)}
      className="w-11 h-11 sm:w-16 sm:h-16 shrink-0 rounded-xl object-cover border border-slate-200 bg-slate-50"
    />
  );
}