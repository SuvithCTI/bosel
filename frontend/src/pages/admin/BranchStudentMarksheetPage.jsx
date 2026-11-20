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
const PRINT_ROOT_ID = 'bsel-print-root';

// ------------------------------------------------
// ASSESSMENT RULES
// Each subject: 4 weekly revision tests (avg = Assessment, out of 40)
// + final exam out of 100, converted to 60.
// Subject total = Assessment + converted exam = out of 100.
// ------------------------------------------------

const REVISION_COUNT = 4;
const REVISION_MAX = 40;        // each weekly revision test is out of 40
const ASSESSMENT_MAX = 40;      // average of the 4 revisions
const EXAM_MAX = 100;           // final exam is marked out of 100
const EXAM_CONVERTED_MAX = 60;  // final exam is converted to 60
const SUBJECT_MAX = ASSESSMENT_MAX + EXAM_CONVERTED_MAX; // 100

const STAGES = [
  { key: 'rev1', type: 'revision', index: 0, tab: 'Rev 1', short: 'Rev 1', label: 'Week 1 - Revision 1' },
  { key: 'rev2', type: 'revision', index: 1, tab: 'Rev 2', short: 'Rev 2', label: 'Week 2 - Revision 2' },
  { key: 'rev3', type: 'revision', index: 2, tab: 'Rev 3', short: 'Rev 3', label: 'Week 3 - Revision 3' },
  { key: 'rev4', type: 'revision', index: 3, tab: 'Rev 4', short: 'Rev 4', label: 'Week 4 - Revision 4' },
  { key: 'exam', type: 'exam', index: null, tab: 'Exam', short: 'Exam', label: 'Week 5 - Final Exam' },
];

const REV_STAGES = STAGES.filter((s) => s.type === 'revision');
const EXAM_STAGE = STAGES.find((s) => s.type === 'exam');
const DEFAULT_STAGE = 'rev1';

// Columns shown for each subject in the Entered Students table
const SUB_SUB_HEADS = ['R1', 'R2', 'R3', 'R4', 'Avg /40', 'Total /100'];
const SUB_COLS = SUB_SUB_HEADS.length;

// ------------------------------------------------
// SESSION LIST STORAGE (survives page switches, cleared by Reset)
// ------------------------------------------------

const sessionKeyFor = (branch) => `bsel_marks_session_${branch || 'default'}`;
const stageKeyFor = (branch) => `bsel_marks_stage_${branch || 'default'}`;

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

const readStage = (branch) => {
  try {
    const value = sessionStorage.getItem(stageKeyFor(branch));
    return STAGES.some((s) => s.key === value) ? value : DEFAULT_STAGE;
  } catch {
    return DEFAULT_STAGE;
  }
};

const writeStage = (branch, key) => {
  try {
    sessionStorage.setItem(stageKeyFor(branch), key);
  } catch {
    // ignore storage errors
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

const round2 = (n) => Math.round(n * 100) / 100;

const toNumberOrNull = (v) => {
  if (v === '' || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

// Input text for an entry field ('' when empty)
const toInput = (v) => (v === null || v === undefined ? '' : String(v));

// Display value ('-' when empty)
const dv = (v, suffix = '') =>
  v === null || v === undefined || v === '' ? '-' : `${v}${suffix}`;

const totalCell = (saved) =>
  saved?.complete ? `${saved.totalMarks}/${saved.totalMaximum}` : '-';

const pctCell = (saved) => (saved?.complete ? `${saved.percentage}%` : '-');

// The 6 values shown for one subject in the Entered Students table:
// R1, R2, R3, R4, Avg (out of 40), Total (out of 100)
const subjectCells = (saved, i) => {
  const s = saved?.subjects?.[i];
  return [
    ...Array.from({ length: REVISION_COUNT }, (_, k) => s?.revisions?.[k] ?? null),
    s?.assessment ?? null,
    s?.marks ?? null,
  ];
};

const getStage = (key) => STAGES.find((s) => s.key === key) || STAGES[0];
const stageMax = (stage) => (stage.type === 'exam' ? EXAM_MAX : REVISION_MAX);
const stageValue = (entry, stage) =>
  stage.type === 'exam' ? entry?.exam : entry?.revisions?.[stage.index];

const emptyEntry = () => ({
  revisions: Array(REVISION_COUNT).fill(''),
  exam: '',
});

// Builds one subject's result from its revision and exam entries
const computeSubjectResult = (meta, entry) => {
  const revisions = (entry?.revisions || []).map(toNumberOrNull);
  while (revisions.length < REVISION_COUNT) revisions.push(null);

  const assessment = revisions.every((r) => r !== null)
    ? round2(revisions.reduce((t, r) => t + r, 0) / REVISION_COUNT)
    : null;

  const exam = toNumberOrNull(entry?.exam);
  const examConverted =
    exam !== null ? round2((exam * EXAM_CONVERTED_MAX) / EXAM_MAX) : null;

  const marks =
    assessment !== null && examConverted !== null
      ? round2(assessment + examConverted)
      : null;

  return {
    id: meta.id,
    name: meta.name,
    max: SUBJECT_MAX,
    assessment,
    assessmentMax: ASSESSMENT_MAX,
    revisions,
    exam,
    examMax: EXAM_MAX,
    examConverted,
    examConvertedMax: EXAM_CONVERTED_MAX,
    marks,
  };
};

// Plain-language progress for a list row
const describeProgress = (results) => {
  if (results.length && results.every((r) => r.marks !== null)) return 'Complete';
  for (let i = 0; i < REVISION_COUNT; i++) {
    if (!results.every((r) => r.revisions[i] !== null)) {
      return `Pending: Week ${i + 1} revision`;
    }
  }
  return 'Pending: Week 5 final exam';
};

// Entry fields rebuilt from a saved marksheet
const entriesFromSaved = (saved, metas) =>
  Object.fromEntries(
    metas.map((meta) => {
      const s = saved?.subjects?.find((x) => String(x.id) === String(meta.id));
      return [
        meta.id,
        {
          revisions: Array.from({ length: REVISION_COUNT }, (_, i) =>
            toInput(s?.revisions?.[i])
          ),
          exam: toInput(s?.exam),
        },
      ];
    })
  );

const getSubjectMetas = (student) =>
  getCourseSubjectModules(getStudentCourse(student) || '').map((subject, index) => ({
    id: String(subject.id || index + 1),
    name: subject.name || `Subject ${index + 1}`,
  }));

// ------------------------------------------------
// WORD EXPORT (single marksheet)
// ------------------------------------------------

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
      const grade = s.marks === null || s.marks === undefined ? '-' : getGrade(s.marks);
      return `
        <tr>
          <td class="c">${i + 1}</td>
          <td>${escapeHtml(s.name)}</td>
          <td class="c">${escapeHtml(dv(s.max))}</td>
          <td class="c">${escapeHtml(dv(s.assessment))} / ${ASSESSMENT_MAX}</td>
          <td class="c">${escapeHtml(dv(s.examConverted))} / ${EXAM_CONVERTED_MAX}</td>
          <td class="c">${escapeHtml(dv(s.marks))}</td>
          <td class="c">${dv(s.marks, '%')}</td>
          <td class="c">${escapeHtml(grade)}</td>
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
      <th>Assessment (/40)</th><th>Exam (/60)</th>
      <th>Marks Obtained</th><th>Percentage</th><th>Grade</th>
    </tr>
    ${subjectRows}
    <tr class="total">
      <td colspan="2" class="c">TOTAL</td>
      <td class="c">${escapeHtml(dv(sheet.totalMaximum))}</td>
      <td class="c" colspan="2">-</td>
      <td class="c">${escapeHtml(dv(sheet.totalMarks))}</td>
      <td class="c">${escapeHtml(sheet.complete ? `${pctValue.toFixed(2)}%` : '-')}</td>
      <td class="c">${escapeHtml(dv(sheet.overallGrade))}</td>
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

const buildWordHtml = (student, sheet) =>
  wordDocShell(
    `BSEL Marksheet - ${student.studentName || ''}`,
    'portrait',
    `<div>${buildSheetBody(student, sheet)}</div>`
  );

// Table Word file (matches the Entered Students table)
const buildTableWordHtml = (records, subjectColCount, branch) => {
  const subHead1 = Array.from({ length: subjectColCount })
    .map((_, i) => `<th colspan="${SUB_COLS}">Sub ${i + 1}</th>`)
    .join('');

  const subHead2 = Array.from({ length: subjectColCount })
    .map(() => SUB_SUB_HEADS.map((h) => `<th>${escapeHtml(h)}</th>`).join(''))
    .join('');

  const rows = records
    .map((rec, idx) => {
      const subCells = Array.from({ length: subjectColCount })
        .map((_, i) =>
          subjectCells(rec.saved, i)
            .map((v) => `<td class="c">${escapeHtml(dv(v))}</td>`)
            .join('')
        )
        .join('');
      const zebra = idx % 2 === 1 ? ' class="zebra"' : '';
      return `
        <tr${zebra}>
          <td class="c">${idx + 1}</td>
          <td>${escapeHtml(rec.student.studentName || '-')}</td>
          <td class="c">${escapeHtml(rec.student.userId || '-')}</td>
          ${subCells}
          <td class="c"><b>${escapeHtml(totalCell(rec.saved))}</b></td>
          <td class="c">${escapeHtml(pctCell(rec.saved))}</td>
          <td class="c">${escapeHtml(dv(rec.saved.overallGrade))}</td>
          <td class="c">${escapeHtml(rec.saved.status || '-')}</td>
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
        <th rowspan="2">S.No</th><th rowspan="2">Student Name</th><th rowspan="2">Student ID</th>
        ${subHead1}
        <th rowspan="2">Total</th><th rowspan="2">%</th><th rowspan="2">Grade</th><th rowspan="2">Status</th>
      </tr>
      <tr>${subHead2}</tr>
      ${rows}
    </table>
    <p style="margin-top:8px;font-size:9pt;">Generated on ${escapeHtml(formatDate(new Date().toISOString()))}</p>`;

  return wordDocShell(`BSEL Marks Table - ${branch || ''}`, 'landscape', body);
};

// ------------------------------------------------
// PROFESSIONAL TABLE VIEW (Table PDF and Print Table)
// Sized for A4 landscape with 8mm margins (about 1062px of printable width).
// ------------------------------------------------

const EXPORT_WIDTH = 1060;
const FRAME_BORDER = 3;
const FRAME_PAD = 4;
const GOLD = '#b8892f';
const GOLD_BORDER = 1;
const INNER_PAD = 16;

// Usable width inside the frames and padding
const TABLE_INNER_WIDTH =
  EXPORT_WIDTH - 2 * (FRAME_BORDER + FRAME_PAD + GOLD_BORDER + INNER_PAD);

// Line weights: thin for cells, heavier for subject groups and the outer edge
const CELL_LINE = `1px solid ${NAVY}`;
const GROUP_LINE = `2px solid ${NAVY}`;
const OUTER_LINE = `2.5px solid ${NAVY}`;

// Column widths in px for the fixed columns
const FIXED_COLS = { sno: 26, name: 118, id: 74, total: 58, pct: 46, grade: 40 };

// Column widths in px for each subject: R1..R4, Avg, Tot
const SUB_WIDTHS = [20, 20, 20, 20, 25, 25];
const EXPORT_SUB_HEADS = ['R1', 'R2', 'R3', 'R4', 'Avg', 'Tot'];

const cellStyle = (extra = {}) => ({
  border: CELL_LINE,
  padding: '4px 1px',
  fontSize: '8.5px',
  lineHeight: 1.2,
  textAlign: 'center',
  color: NAVY,
  verticalAlign: 'middle',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  ...extra,
});

const headStyle = (extra = {}) => ({
  border: CELL_LINE,
  padding: '4px 1px',
  fontSize: '8px',
  fontWeight: 700,
  textAlign: 'center',
  background: NAVY,
  color: '#ffffff',
  verticalAlign: 'middle',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  ...extra,
});

const TableExportView = ({ records, subjectColCount, branch }) => {
  const todayText = formatDate(new Date().toISOString());
  const subs = Math.max(subjectColCount, 1);

  // Shrink subject columns only if there are more subjects than fit
  const fixedSum = Object.values(FIXED_COLS).reduce((a, b) => a + b, 0);
  const subBase = SUB_WIDTHS.reduce((a, b) => a + b, 0);
  const available = TABLE_INNER_WIDTH - fixedSum;
  const scale = Math.min(1, available / (subs * subBase));
  const subWidths = SUB_WIDTHS.map((w) => w * scale);

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
      {/* Outer navy frame */}
      <div
        style={{
          border: `${FRAME_BORDER}px solid ${NAVY}`,
          padding: `${FRAME_PAD}px`,
          boxSizing: 'border-box',
        }}
      >
        {/* Inner gold frame */}
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

          {/* Marks table */}
          <table
            style={{
              width: `${TABLE_INNER_WIDTH}px`,
              borderCollapse: 'collapse',
              tableLayout: 'fixed',
              marginTop: '8px',
              border: OUTER_LINE,
            }}
          >
            <colgroup>
              <col style={{ width: `${FIXED_COLS.sno}px` }} />
              <col style={{ width: `${FIXED_COLS.name}px` }} />
              <col style={{ width: `${FIXED_COLS.id}px` }} />
              {Array.from({ length: subs }).map((_, i) =>
                subWidths.map((w, k) => (
                  <col key={`${i}-${k}`} style={{ width: `${w}px` }} />
                ))
              )}
              <col style={{ width: `${FIXED_COLS.total}px` }} />
              <col style={{ width: `${FIXED_COLS.pct}px` }} />
              <col style={{ width: `${FIXED_COLS.grade}px` }} />
            </colgroup>

            <thead>
              <tr>
                <th rowSpan={2} style={headStyle()}>S.No</th>
                <th rowSpan={2} style={headStyle({ textAlign: 'left', paddingLeft: '4px' })}>
                  Student Name
                </th>
                <th rowSpan={2} style={headStyle()}>Student ID</th>
                {Array.from({ length: subs }).map((_, i) => (
                  <th
                    key={i}
                    colSpan={EXPORT_SUB_HEADS.length}
                    style={headStyle({ borderLeft: GROUP_LINE, borderRight: GROUP_LINE, fontSize: '9px' })}
                  >
                    Sub {i + 1}
                  </th>
                ))}
                <th rowSpan={2} style={headStyle({ borderLeft: GROUP_LINE })}>Total</th>
                <th rowSpan={2} style={headStyle()}>%</th>
                <th rowSpan={2} style={headStyle()}>Grade</th>
              </tr>
              <tr>
                {Array.from({ length: subs }).map((_, i) =>
                  EXPORT_SUB_HEADS.map((h, k) => (
                    <th
                      key={`${i}-${k}`}
                      style={headStyle({
                        fontSize: '7.5px',
                        borderLeft: k === 0 ? GROUP_LINE : CELL_LINE,
                        borderRight: k === EXPORT_SUB_HEADS.length - 1 ? GROUP_LINE : CELL_LINE,
                        background: k >= 4 ? '#163e7c' : NAVY,
                      })}
                    >
                      {h}
                    </th>
                  ))
                )}
              </tr>
            </thead>

            <tbody>
              {records.map((rec, idx) => {
                const rowBg = idx % 2 === 1 ? '#f4f8fc' : '#ffffff';
                return (
                  <tr key={rec.key} style={{ background: rowBg, pageBreakInside: 'avoid' }}>
                    <td style={cellStyle()}>{idx + 1}</td>
                    <td
                      style={cellStyle({
                        textAlign: 'left',
                        paddingLeft: '4px',
                        fontWeight: 700,
                        textTransform: 'capitalize',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        fontSize: '9px',
                      })}
                    >
                      {rec.student.studentName}
                    </td>
                    <td style={cellStyle({ wordBreak: 'break-all' })}>{rec.student.userId}</td>

                    {Array.from({ length: subs }).map((_, i) =>
                      subjectCells(rec.saved, i).map((v, k) => (
                        <td
                          key={`${i}-${k}`}
                          style={cellStyle({
                            fontWeight: k >= 4 ? 700 : 400,
                            borderLeft: k === 0 ? GROUP_LINE : CELL_LINE,
                            borderRight: k === EXPORT_SUB_HEADS.length - 1 ? GROUP_LINE : CELL_LINE,
                          })}
                        >
                          {dv(v)}
                        </td>
                      ))
                    )}

                    <td style={cellStyle({ fontWeight: 700, borderLeft: GROUP_LINE })}>
                      {totalCell(rec.saved)}
                    </td>
                    <td style={cellStyle()}>{pctCell(rec.saved)}</td>
                    <td style={cellStyle({ fontWeight: 700 })}>{dv(rec.saved.overallGrade)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Legend and signature */}
          <div style={{ marginTop: '6px', fontSize: '9px', color: NAVY }}>
            R1–R4 = weekly revision tests (/40 each) · Avg = average of the four revisions (/40) ·
            Tot = Avg + final exam converted to /60 (/100)
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginTop: '22px',
              fontSize: '10px',
            }}
          >
            <div>Generated on {todayText}</div>
            <div
              style={{
                borderTop: `1px solid ${NAVY}`,
                width: '200px',
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
  const [entries, setEntries] = useState({});
  const [savedData, setSavedData] = useState(null);

  // Which weekly test is being entered right now
  const [activeStage, setActiveStage] = useState(() => readStage(activeBranch));

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [sessionRecords, setSessionRecords] = useState(() => readSession(activeBranch));

  const [previewRecord, setPreviewRecord] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState('');

  const [isExportingTable, setIsExportingTable] = useState(false);
  const [bulkError, setBulkError] = useState('');

  const previewWrapRef = useRef(null);
  const tableExportRef = useRef(null);

  useEffect(() => {
    writeSession(activeBranch, sessionRecords);
  }, [sessionRecords, activeBranch]);

  useEffect(() => {
    writeStage(activeBranch, activeStage);
  }, [activeStage, activeBranch]);

  // ------------------------------------------------
  // CURRENT RESULTS (live, from the entry fields)
  // ------------------------------------------------

  const results = subjects.map((meta) =>
    computeSubjectResult(meta, entries[meta.id] || emptyEntry())
  );
  const completedSubjects = results.filter((r) => r.marks !== null).length;
  const allComplete = results.length > 0 && completedSubjects === results.length;
  const totalMaximum = results.reduce((t, r) => t + r.max, 0);
  const totalMarks = round2(results.reduce((t, r) => t + (r.marks ?? 0), 0));
  const percentage = totalMaximum > 0 ? round2((totalMarks / totalMaximum) * 100) : 0;

  // ------------------------------------------------
  // LOAD / CLEAR CURRENT STUDENT
  // ------------------------------------------------

  const clearCurrent = () => {
    setStudent(null);
    setSubjects([]);
    setEntries({});
    setSavedData(null);
    setIsEditing(false);
    setExportError('');
  };

  const loadIntoView = (studentData, existing) => {
    const metas = getSubjectMetas(studentData);
    setStudent(studentData);
    setSubjects(metas);
    setEntries(entriesFromSaved(existing, metas));
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

    if (!getSubjectMetas(foundStudent).length) {
      setError(
        'No subjects are configured for this student course. Please check the course subject configuration.'
      );
      return;
    }

    loadIntoView(foundStudent, getSavedMarksheet(foundStudent));
  };

  // ------------------------------------------------
  // STAGE SELECTION
  // ------------------------------------------------

  const handleStageChange = (key) => {
    if (key === activeStage) return;

    // Switching weeks while editing discards unsaved typing
    if (isEditing) {
      setEntries(entriesFromSaved(savedData, subjects));
      setIsEditing(false);
    }

    setActiveStage(key);
    setError('');
    setSuccess('');
  };

  // ------------------------------------------------
  // EDIT / ENTRY CHANGE
  // ------------------------------------------------

  const handleEditMarks = () => {
    if (!student) return;
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleEntryChange = (subjectId, stage, value) => {
    if (value !== '' && !/^\d+$/.test(value)) return;

    setEntries((prev) => {
      const current = prev[subjectId] || emptyEntry();
      const next =
        stage.type === 'exam'
          ? { ...current, exam: value }
          : {
              ...current,
              revisions: current.revisions.map((v, i) => (i === stage.index ? value : v)),
            };
      return { ...prev, [subjectId]: next };
    });
  };

  // Cell for one subject and one test: input for the active test while editing, otherwise the value
  const renderStageCell = (meta, r, stage, wide = false) => {
    if (isEditing && stage.key === activeStage) {
      const entry = entries[meta.id] || emptyEntry();
      return (
        <input
          type="text"
          inputMode="numeric"
          value={toInput(stageValue(entry, stage))}
          onChange={(e) => handleEntryChange(meta.id, stage, e.target.value)}
          placeholder="0"
          className={`${wide ? 'w-full min-w-0' : 'w-16'} px-1.5 py-1 rounded-lg border border-slate-200 text-xs font-bold text-center outline-none focus:ring-2 focus:ring-sky-500`}
        />
      );
    }

    const value = stage.type === 'exam' ? r.exam : r.revisions[stage.index];
    return <span className="text-xs font-black text-slate-900">{dv(value)}</span>;
  };

  const renderGradeBadge = (r) => (
    <span className="px-1.5 sm:px-2 py-0.5 rounded-lg bg-sky-50 text-sky-800 text-[10px] font-black">
      {r.marks !== null ? getGrade(r.marks) : '-'}
    </span>
  );

  // ------------------------------------------------
  // SAVE MARKS (saves only the selected weekly test)
  // ------------------------------------------------

  const handleSaveMarks = () => {
    setError('');
    setSuccess('');

    if (!student) return;

    const stage = getStage(activeStage);
    const max = stageMax(stage);

    const missing = subjects.find((meta) => {
      const value = stageValue(entries[meta.id] || emptyEntry(), stage);
      return value === '' || value === undefined || value === null;
    });

    if (missing) {
      setError(`Please enter ${stage.label} marks for ${missing.name}.`);
      return;
    }

    const invalid = subjects.find((meta) => {
      const n = Number(stageValue(entries[meta.id], stage));
      return !Number.isFinite(n) || n < 0 || n > max;
    });

    if (invalid) {
      setError(`${invalid.name}: ${stage.label} marks must be between 0 and ${max}.`);
      return;
    }

    // Keep the other weeks' saved values, replace only the selected test
    const baseEntries = entriesFromSaved(savedData, subjects);
    const merged = {};
    subjects.forEach((meta) => {
      const base = baseEntries[meta.id];
      const current = entries[meta.id] || emptyEntry();
      merged[meta.id] =
        stage.type === 'exam'
          ? { revisions: base.revisions, exam: current.exam }
          : {
              revisions: base.revisions.map((v, i) =>
                i === stage.index ? current.revisions[i] : v
              ),
              exam: base.exam,
            };
    });

    const newResults = subjects.map((meta) => computeSubjectResult(meta, merged[meta.id]));
    const complete = newResults.every((r) => r.marks !== null);
    const maxTotal = newResults.reduce((t, r) => t + r.max, 0);
    const marksTotal = complete ? round2(newResults.reduce((t, r) => t + r.marks, 0)) : null;
    const pct = complete ? round2((marksTotal / maxTotal) * 100) : null;

    const key = getStudentKey(student);

    const marksheet = {
      studentId: student.userId,
      studentName: student.studentName,
      registerNumber: student.registerNumber || student.registrationNo || '',
      branch: activeBranch,
      course: getStudentCourse(student),
      grade: student.grade || '',
      subjects: newResults,
      complete,
      status: describeProgress(newResults),
      lastStage: stage.key,
      totalMarks: marksTotal,
      totalMaximum: maxTotal,
      percentage: pct !== null ? pct.toFixed(2) : null,
      overallGrade: pct !== null ? getGrade(pct) : null,
      updatedAt: new Date().toISOString(),
    };

    try {
      const allMarksheets = readMarksheets();
      allMarksheets[key] = marksheet;
      writeMarksheets(allMarksheets);

      setSavedData(marksheet);
      setEntries(entriesFromSaved(marksheet, subjects));
      setIsEditing(false);

      setSessionRecords((prev) => {
        const record = { key, student: snapshotStudent(student), saved: marksheet };
        const exists = prev.some((r) => r.key === key);
        return exists
          ? prev.map((r) => (r.key === key ? record : r))
          : [...prev, record];
      });

      setSuccess(
        complete
          ? `Final result completed and saved for ${student.studentName}.`
          : `${stage.label} marks saved for ${student.studentName}.`
      );
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
    setEntries(entriesFromSaved(savedData, subjects));
  };

  // ------------------------------------------------
  // OPEN A STUDENT FROM THE LIST
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
    if (!record.saved?.complete) return;
    setExportError('');
    setPreviewRecord({
      key: record.key,
      student: resolveStudentFor(record),
      saved: record.saved,
    });
  };

  const openPreviewForCurrent = () => {
    if (!student || !savedData?.complete) return;
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
  // PRINT HELPER
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
  // SINGLE MARKSHEET: PDF / WORD / PRINT
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
  // TABLE: PDF / WORD / PRINT
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
  // NEXT STUDENT
  // ------------------------------------------------

  const handleNextStudent = () => {
    setSearchId('');
    clearCurrent();
    setError('');
    setSuccess('');
  };

  // ------------------------------------------------
  // RESET (erases the whole list)
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
  const canPreviewCurrent = Boolean(student && savedData?.complete && !isEditing);
  const hasList = sessionRecords.length > 0;
  const currentStage = getStage(activeStage);

  const subjectColCount = Math.max(
    MIN_SUBJECT_COLS,
    ...sessionRecords.map((r) => r.saved?.subjects?.length || 0)
  );

  // Fixed columns before and after the subject groups (S.No, Name, ID, Total, %, Grade, Status, Actions)
  const LIST_FIXED_COLS = 8;
  const listColCount = LIST_FIXED_COLS + subjectColCount * SUB_COLS;

  const thCls =
    'px-2 sm:px-3 py-1.5 border border-slate-300 text-[10px] uppercase tracking-wider font-black text-slate-500 text-center whitespace-nowrap';
  const tdCls = 'px-2 sm:px-3 py-1.5 border border-slate-200 text-center';
  const stageHeadCls = (key) => (activeStage === key ? ' bg-amber-100 text-amber-900' : '');
  const stageCellCls = (key) => (activeStage === key ? ' bg-amber-50/70' : '');

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

    /* Table print: remove the whole app from layout so no blank pages are created */
    body.bsel-print-table {
      height: auto !important;
      overflow: visible !important;
      margin: 0 !important;
      padding: 0 !important;
      background: #ffffff !important;
    }
    body.bsel-print-table #root {
      display: none !important;
    }
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
            Weekly revision tests and final exam
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
                  savedData.complete ? (
                    <span className="px-1.5 sm:px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 text-[9px] sm:text-[10px] font-black flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Result Complete
                    </span>
                  ) : (
                    <span className="px-1.5 sm:px-2 py-0.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-[9px] sm:text-[10px] font-black">
                      {savedData.status || 'Partly Saved'}
                    </span>
                  )
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
                !savedData?.complete
                  ? 'Complete all weeks and the final exam to preview'
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
                {savedData ? `Enter ${currentStage.short}` : 'Add Marks'}
              </button>
            ) : (
              <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-sky-50 border border-sky-100 text-sky-800 text-[10px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5">
                <Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                Editing {currentStage.short}
              </div>
            )}
          </div>
        </div>

        {/* WEEK / TEST SELECTOR */}
        <div className="px-2 sm:px-3 py-2 border-b border-slate-100 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-black uppercase text-slate-500 mr-1">Entering:</span>
          {STAGES.map((stage) => {
            const active = stage.key === activeStage;
            return (
              <button
                key={stage.key}
                type="button"
                onClick={() => handleStageChange(stage.key)}
                className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-black border transition ${
                  active
                    ? 'bg-amber-400 border-amber-500 text-[#0c234b]'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {stage.tab}
              </button>
            );
          })}
        </div>

        {/* MOBILE: SUBJECT CARDS */}
        <div className="sm:hidden p-2 space-y-2">
          {subjects.length === 0 &&
            Array.from({ length: PLACEHOLDER_ROWS }).map((_, index) => (
              <div key={`ph-m-${index}`} className="p-2 rounded-xl border border-slate-100 text-slate-300 text-xs font-bold">
                {index + 1}. {dash}
              </div>
            ))}

          {subjects.map((meta, index) => {
            const r = results[index];
            return (
              <div key={meta.id} className="p-2 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11px] font-black text-slate-900 leading-snug">
                    {index + 1}. {meta.name}
                  </p>
                  {renderGradeBadge(r)}
                </div>

                <div className="grid grid-cols-5 gap-1 mt-2">
                  {STAGES.map((stage) => (
                    <div
                      key={stage.key}
                      className={`rounded-lg p-1 ${
                        activeStage === stage.key ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50'
                      }`}
                    >
                      <span className="block text-[8px] font-bold uppercase text-slate-400 leading-tight">
                        {stage.short}
                      </span>
                      {renderStageCell(meta, r, stage, true)}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-4 gap-1.5 mt-2 text-[10px] font-bold">
                  <div>
                    <span className="block text-[8px] uppercase text-slate-400">Avg /40</span>
                    <span className="text-slate-900">{dv(r.assessment)}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase text-slate-400">Exam /60</span>
                    <span className="text-slate-900">{dv(r.examConverted)}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase text-slate-400">Total /100</span>
                    <span className="text-slate-900">{dv(r.marks)}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase text-slate-400">%</span>
                    <span className="text-sky-800">{dv(r.marks, '%')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* DESKTOP / TABLET: SUBJECT TABLE */}
        <div 
          className="hidden sm:block overflow-x-auto no-scrollbar admin-table-container"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <table className="w-full text-left border-collapse min-w-[860px]">
            <thead className="bg-slate-50">
              <tr>
                <th className={thCls}>S.No</th>
                <th className={`${thCls} text-left`}>Subject</th>
                {REV_STAGES.map((stage) => (
                  <th key={stage.key} className={`${thCls}${stageHeadCls(stage.key)}`}>
                    {stage.short} /40
                  </th>
                ))}
                <th className={thCls}>Avg /40</th>
                <th className={`${thCls}${stageHeadCls(EXAM_STAGE.key)}`}>Exam /100</th>
                <th className={thCls}>Exam /60</th>
                <th className={thCls}>Total /100</th>
                <th className={thCls}>%</th>
                <th className={thCls}>Grade</th>
              </tr>
            </thead>

            <tbody>
              {subjects.length === 0 &&
                Array.from({ length: PLACEHOLDER_ROWS }).map((_, index) => (
                  <tr key={`placeholder-${index}`} className="text-slate-300">
                    {Array.from({ length: 11 }).map((__, i) => (
                      <td key={i} className={tdCls + ' text-xs font-bold'}>
                        {i === 0 ? index + 1 : dash}
                      </td>
                    ))}
                  </tr>
                ))}

              {subjects.map((meta, index) => {
                const r = results[index];
                return (
                  <tr key={meta.id} className="hover:bg-slate-50/70">
                    <td className={`${tdCls} text-xs font-bold text-slate-500`}>{index + 1}</td>
                    <td className={`${tdCls} text-left text-xs font-bold text-slate-900`}>{meta.name}</td>
                    {REV_STAGES.map((stage) => (
                      <td key={stage.key} className={`${tdCls}${stageCellCls(stage.key)}`}>
                        {renderStageCell(meta, r, stage)}
                      </td>
                    ))}
                    <td className={`${tdCls} text-xs font-bold text-slate-900`}>{dv(r.assessment)}</td>
                    <td className={`${tdCls}${stageCellCls(EXAM_STAGE.key)}`}>
                      {renderStageCell(meta, r, EXAM_STAGE)}
                    </td>
                    <td className={`${tdCls} text-xs font-bold text-slate-900`}>{dv(r.examConverted)}</td>
                    <td className={`${tdCls} text-xs font-black text-slate-950`}>{dv(r.marks)}</td>
                    <td className={`${tdCls} text-xs font-bold text-sky-800`}>{dv(r.marks, '%')}</td>
                    <td className={tdCls}>{renderGradeBadge(r)}</td>
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
                {!student
                  ? dash
                  : allComplete
                    ? <>{totalMarks}<span className="text-[10px] sm:text-xs text-slate-400"> / {totalMaximum}</span></>
                    : <span className="text-[10px] sm:text-xs text-slate-500">{completedSubjects}/{subjects.length} subjects done</span>}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 px-2 sm:px-3 py-1 sm:py-1.5 min-w-0">
              <span className="block text-[8px] sm:text-[10px] text-slate-500 font-bold uppercase truncate">
                Percentage
              </span>
              <div className="text-xs sm:text-sm font-black text-sky-800 leading-tight truncate">
                {student && allComplete ? `${percentage.toFixed(2)}%` : dash}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 px-2 sm:px-3 py-1 sm:py-1.5 min-w-0">
              <span className="block text-[8px] sm:text-[10px] text-slate-500 font-bold uppercase truncate">
                Overall Grade
              </span>
              <div className="text-xs sm:text-sm font-black text-amber-600 leading-tight">
                {student && allComplete ? getGrade(percentage) : dash}
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
                Save {currentStage.short}
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
            <div key={rec.key} className="p-2 rounded-xl border border-slate-200 bg-white">
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
                  {rec.saved.complete ? (
                    <span className="px-1.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-black shrink-0">
                      {rec.saved.overallGrade}
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded-lg bg-amber-50 text-amber-700 text-[9px] font-black shrink-0">
                      Pending
                    </span>
                  )}
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-bold">
                  <span className="text-slate-500">
                    Total: <strong className="text-slate-900">{totalCell(rec.saved)}</strong>
                  </span>
                  <span className="text-sky-800">{pctCell(rec.saved)}</span>
                </div>
                {!rec.saved.complete && (
                  <p className="text-[9px] font-bold text-amber-700 mt-1">{rec.saved.status}</p>
                )}
              </button>

              <div className="grid grid-cols-2 gap-1.5 mt-2">
                <button
                  type="button"
                  onClick={() => openPreview(rec)}
                  disabled={!rec.saved.complete}
                  className="px-2 py-1 rounded-lg bg-white border border-slate-300 text-[#0c234b] text-[10px] font-black flex items-center justify-center gap-1 disabled:opacity-40"
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

        {/* DESKTOP / TABLET: TABLE (scrolls sideways; revision columns per subject) */}
        <div 
          className="hidden sm:block overflow-x-auto p-2 no-scrollbar admin-table-container"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <table className="w-full text-center min-w-[1100px] border-collapse border border-slate-300">
            <thead className="bg-[#0b2a55] text-white">
              <tr>
                <th rowSpan={2} className="px-2 py-2 border border-slate-600 text-[10px] font-black uppercase tracking-wider">S.No</th>
                <th rowSpan={2} className="px-2 py-2 border border-slate-600 text-[10px] font-black uppercase tracking-wider text-left">Student Name</th>
                <th rowSpan={2} className="px-2 py-2 border border-slate-600 text-[10px] font-black uppercase tracking-wider">Student ID</th>
                {Array.from({ length: subjectColCount }).map((_, i) => (
                  <th
                    key={i}
                    colSpan={SUB_COLS}
                    className="px-2 py-2 border border-slate-600 text-[10px] font-black uppercase tracking-wider"
                    title={sessionRecords.find((r) => r.saved?.subjects?.[i])?.saved.subjects[i].name || ''}
                  >
                    Sub {i + 1}
                  </th>
                ))}
                <th rowSpan={2} className="px-2 py-2 border border-slate-600 text-[10px] font-black uppercase tracking-wider">Total</th>
                <th rowSpan={2} className="px-2 py-2 border border-slate-600 text-[10px] font-black uppercase tracking-wider">%</th>
                <th rowSpan={2} className="px-2 py-2 border border-slate-600 text-[10px] font-black uppercase tracking-wider">Grade</th>
                <th rowSpan={2} className="px-2 py-2 border border-slate-600 text-[10px] font-black uppercase tracking-wider">Status</th>
                <th rowSpan={2} className="px-2 py-2 border border-slate-600 text-[10px] font-black uppercase tracking-wider">Actions</th>
              </tr>
              <tr>
                {Array.from({ length: subjectColCount }).map((_, i) =>
                  SUB_SUB_HEADS.map((h, k) => (
                    <th
                      key={`${i}-${k}`}
                      className={`px-1.5 py-1.5 border border-slate-600 text-[9px] font-black uppercase tracking-wider ${
                        k >= 4 ? 'bg-[#163e7c]' : ''
                      }`}
                    >
                      {h}
                    </th>
                  ))
                )}
              </tr>
            </thead>

            <tbody>
              {sessionRecords.length === 0 &&
                Array.from({ length: PLACEHOLDER_ROWS }).map((_, index) => (
                  <tr key={`ph-${index}`} className="text-slate-300 text-xs font-bold">
                    {Array.from({ length: listColCount }).map((__, i) => (
                      <td key={i} className="px-2 py-1.5 border border-slate-200">
                        {i === 0 ? index + 1 : dash}
                      </td>
                    ))}
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
                  {Array.from({ length: subjectColCount }).map((_, i) =>
                    subjectCells(rec.saved, i).map((v, k) => (
                      <td
                        key={`${i}-${k}`}
                        className={`px-1.5 py-1.5 border border-slate-300 ${
                          k >= 4 ? 'font-black text-slate-950' : ''
                        }`}
                      >
                        {dv(v)}
                      </td>
                    ))
                  )}
                  <td className="px-2 py-1.5 border border-slate-300 font-black whitespace-nowrap">
                    {totalCell(rec.saved)}
                  </td>
                  <td className="px-2 py-1.5 border border-slate-300 text-sky-800">{pctCell(rec.saved)}</td>
                  <td className="px-2 py-1.5 border border-slate-300">
                    {rec.saved.complete ? (
                      <span className="px-1.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-black">
                        {rec.saved.overallGrade}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-2 py-1.5 border border-slate-300 text-[10px] font-black">
                    <span className={rec.saved.complete ? 'text-emerald-700' : 'text-amber-700'}>
                      {rec.saved.complete ? 'Complete' : rec.saved.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-2 py-1.5 border border-slate-300">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        disabled={!rec.saved.complete}
                        onClick={(e) => {
                          e.stopPropagation();
                          openPreview(rec);
                        }}
                        className="px-2 py-1 rounded-lg bg-white border border-slate-300 text-[#0c234b] text-[10px] font-black flex items-center gap-1 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
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
          PREVIEW POPUP (single marksheet, complete results only)
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