import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Search,
  UserRound,
  BookOpen,
  Save,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Calendar,
  RotateCcw,
  Pencil,
  Eye,
  X
} from 'lucide-react';

import OfficialMarksheetView, {
  getCourseSubjectModules
} from '../../components/OfficialMarksheetView';
import {
  normalize,
  getStudentCourse,
  getStudentKey,
  getGrade,
  getSavedMarksheet,
  readMarksheets,
  writeMarksheets,
  saveStudentMarksheet
} from '../../utils/marksheetStorage';

const PLACEHOLDER_ROWS = 3;

export default function StaffStudentMarksheetPage({
  activeBranch,
  branchStudents = [],
  onBack
}) {
  const [searchId, setSearchId] = useState('');
  const [student, setStudent] = useState(null);

  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState({});
  const [savedData, setSavedData] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ------------------------------------------------
  // SUBJECT INITIALIZATION (from the enrolled course)
  // ------------------------------------------------

  const prepareSubjects = (studentData) => {
    const modules = getCourseSubjectModules(getStudentCourse(studentData)) || [];

    return modules.map((subject, index) => ({
      id: String(subject.id || index + 1),
      name: subject.name || `Subject ${index + 1}`,
      max: Number(subject.max) || 100,
      assessment: Number(subject.assessment) || Number(subject.max) || 100
    }));
  };

  // ------------------------------------------------
  // CLEAR STUDENT DATA (template stays on screen)
  // ------------------------------------------------

  const clearStudentData = () => {
    setStudent(null);
    setSubjects([]);
    setMarks({});
    setSavedData(null);
    setIsEditing(false);
    setShowPreview(false);
  };

  // ------------------------------------------------
  // SEARCH STUDENT (fills the template with their data)
  // ------------------------------------------------

  const handleSearch = (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');
    clearStudentData();

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

    // Existing saved marks (if any) fill the template, otherwise blanks
    const existing = getSavedMarksheet(foundStudent);
    const initialMarks = {};

    studentSubjects.forEach((subject) => {
      initialMarks[subject.id] = existing?.marks?.[subject.id] ?? '';
    });

    setStudent(foundStudent);
    setSubjects(studentSubjects);
    setMarks(initialMarks);
    setSavedData(existing || null);
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
    if (value !== '' && !/^\d+$/.test(value)) {
      return;
    }

    setMarks((previous) => ({
      ...previous,
      [subjectId]: value
    }));
  };

  // ------------------------------------------------
  // CALCULATIONS
  // ------------------------------------------------

  const totalMaximum = subjects.reduce(
    (total, subject) => total + subject.max,
    0
  );

  const totalObtained = subjects.reduce(
    (total, subject) => total + (Number(marks[subject.id]) || 0),
    0
  );

  const percentage =
    totalMaximum > 0 ? (totalObtained / totalMaximum) * 100 : 0;

  const allMarksEntered =
    subjects.length > 0 &&
    subjects.every(
      (subject) =>
        marks[subject.id] !== '' && marks[subject.id] !== undefined
    );

  // ------------------------------------------------
  // SAVE MARKS
  // ------------------------------------------------

  const handleSaveMarks = () => {
    setError('');
    setSuccess('');

    if (!student) return;

    const incompleteSubject = subjects.find(
      (subject) =>
        marks[subject.id] === '' || marks[subject.id] === undefined
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
      setError(
        `${invalidSubject.name}: Marks cannot exceed ${invalidSubject.max}.`
      );
      return;
    }

    const totalMarks = subjects.reduce(
      (total, subject) => total + Number(marks[subject.id]),
      0
    );

    const maxMarks = subjects.reduce(
      (total, subject) => total + subject.max,
      0
    );

    const calculatedPercentage =
      maxMarks > 0 ? Number(((totalMarks / maxMarks) * 100).toFixed(2)) : 0;

    const marksheet = {
      studentId: student.userId || student.id || student.admissionNo || student.registerNumber,
      userId: student.userId || student.id || student.admissionNo || student.registerNumber,
      studentName: student.studentName || student.name,
      name: student.studentName || student.name,
      admissionNo: student.admissionNo || student.registerNumber || '',
      registerNumber: student.registerNumber || student.registrationNo || student.admissionNo || '',
      registrationNo: student.registrationNo || student.registerNumber || student.admissionNo || '',
      phone: student.phone || student.mobile || '',
      mobile: student.phone || student.mobile || '',
      branch: student.branch || student.institution || activeBranch,
      course: getStudentCourse(student),
      grade: student.grade || '',
      subjects: subjects.map((subject) => ({
        ...subject,
        marks: Number(marks[subject.id])
      })),
      marks: Object.fromEntries(
        subjects.map((subject) => [subject.id, Number(marks[subject.id])])
      ),
      totalMarks,
      totalMaximum: maxMarks,
      percentage: calculatedPercentage.toFixed(2),
      overallGrade: getGrade(calculatedPercentage),
      updatedAt: new Date().toISOString()
    };

    try {
      saveStudentMarksheet(student, marksheet);

      setSavedData(marksheet);
      setIsEditing(false);
      setSuccess('Student marks saved successfully! Visible across marksheets and Branch Admin.');
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
  // NEXT STUDENT (clears student, keeps template)
  // ------------------------------------------------

  const handleNextStudent = () => {
    setSearchId('');
    clearStudentData();
    setError('');
    setSuccess('');
  };

  // ------------------------------------------------
  // UI
  // ------------------------------------------------

  const dash = '—';

  return (
    <div className="space-y-2 animate-in fade-in duration-200">

      {/* TOP BAR */}
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-black text-slate-950 leading-tight">
              Student Marksheet
            </h1>
            <p className="text-[10px] sm:text-[11px] text-slate-500 leading-tight truncate">
              Examination results management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-sky-50 border border-sky-100 rounded-xl shrink-0">
          <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-700" />
          <span className="text-[10px] sm:text-xs font-bold text-sky-900">{activeBranch}</span>
        </div>
      </div>

      {/* SINGLE BOX */}
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

        {/* STUDENT DETAILS: photo + identity on left, info cards on right */}
        <div className="p-2 sm:p-3 border-b border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">

          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <StudentPhoto student={student} />

            <div className="min-w-0 flex-1">
              <h2 className="text-xs sm:text-sm font-black text-slate-950 capitalize truncate">
                {student ? student.studentName : 'No student selected'}
              </h2>

              <p className="text-[10px] sm:text-xs text-slate-500">
                Student ID:{' '}
                <strong className="text-sky-800">
                  {student ? student.userId : dash}
                </strong>
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

        {/* MARKSHEET HEADER */}
        <div className="px-2 sm:px-3 py-2 border-b border-slate-100 flex items-center justify-between gap-2">
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
              onClick={() => setShowPreview(true)}
              disabled={!savedData || isEditing}
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

        {/* SUBJECT TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-2 sm:px-4 py-1 sm:py-1.5 text-[9px] sm:text-[10px] uppercase tracking-wider font-black text-slate-500">S.No</th>
                <th className="px-2 sm:px-4 py-1 sm:py-1.5 text-[9px] sm:text-[10px] uppercase tracking-wider font-black text-slate-500">Subject Name</th>
                <th className="px-2 sm:px-4 py-1 sm:py-1.5 text-[9px] sm:text-[10px] uppercase tracking-wider font-black text-slate-500">Maximum Marks</th>
                <th className="px-2 sm:px-4 py-1 sm:py-1.5 text-[9px] sm:text-[10px] uppercase tracking-wider font-black text-slate-500">Obtained Marks</th>
                <th className="px-2 sm:px-4 py-1 sm:py-1.5 text-[9px] sm:text-[10px] uppercase tracking-wider font-black text-slate-500">Grade</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {subjects.length === 0 &&
                Array.from({ length: PLACEHOLDER_ROWS }).map((_, index) => (
                  <tr key={`placeholder-${index}`} className="text-slate-300">
                    <td className="px-2 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold">{index + 1}</td>
                    <td className="px-2 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold">{dash}</td>
                    <td className="px-2 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold">{dash}</td>
                    <td className="px-2 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold">{dash}</td>
                    <td className="px-2 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold">{dash}</td>
                  </tr>
                ))}

              {subjects.map((subject, index) => {
                const entered = marks[subject.id];
                const hasValue = entered !== '' && entered !== undefined;
                const subjectPercentage = hasValue
                  ? (Number(entered) / subject.max) * 100
                  : null;

                return (
                  <tr key={subject.id} className="hover:bg-slate-50/70">
                    <td className="px-2 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold text-slate-500">{index + 1}</td>
                    <td className="px-2 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold text-slate-900">{subject.name}</td>
                    <td className="px-2 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold text-slate-600">{subject.max}</td>
                    <td className="px-2 sm:px-4 py-1 sm:py-1.5">
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          max={subject.max}
                          step="1"
                          value={entered ?? ''}
                          onChange={(e) => handleMarkChange(subject.id, e.target.value)}
                          placeholder="Enter marks"
                          className="w-20 sm:w-24 px-2 sm:px-2.5 py-1 rounded-lg border border-slate-200 text-[10px] sm:text-xs font-bold outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      ) : (
                        <span className="text-[10px] sm:text-xs font-black text-slate-900">
                          {hasValue ? entered : '-'}
                        </span>
                      )}
                    </td>
                    <td className="px-2 sm:px-4 py-1 sm:py-1.5">
                      <span className="px-1.5 sm:px-2 py-0.5 rounded-lg bg-sky-50 text-sky-800 text-[9px] sm:text-[10px] font-black">
                        {subjectPercentage !== null ? getGrade(subjectPercentage) : '-'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* TOTALS + ACTIONS */}
        <div className="p-2 sm:p-3 border-t border-slate-100 bg-slate-50/70 flex flex-col lg:flex-row lg:items-center justify-between gap-2">

          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 flex-1">
            <div className="bg-white rounded-lg border border-slate-200 px-2 sm:px-3 py-1 sm:py-1.5">
              <span className="block text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase">Total Marks</span>
              <div className="text-xs sm:text-sm font-black text-slate-950 leading-tight">
                {student ? totalObtained : dash}
                <span className="text-[10px] sm:text-xs text-slate-400"> / {student ? totalMaximum : dash}</span>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 px-2 sm:px-3 py-1 sm:py-1.5">
              <span className="block text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase">Percentage</span>
              <div className="text-xs sm:text-sm font-black text-sky-800 leading-tight">
                {allMarksEntered
                  ? `${percentage.toFixed(2)}%`
                  : savedData
                    ? `${savedData.percentage}%`
                    : '-'}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 px-2 sm:px-3 py-1 sm:py-1.5">
              <span className="block text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase">Overall Grade</span>
              <div className="text-xs sm:text-sm font-black text-amber-600 leading-tight">
                {allMarksEntered
                  ? getGrade(percentage)
                  : savedData?.overallGrade || '-'}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-1.5 sm:gap-2 shrink-0">
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

      {/* PREVIEW (official marksheet with saved marks) */}
      {showPreview && student && savedData && (
        <OfficialMarksheetView
          student={student}
          defaultShowMarks
          onClose={() => setShowPreview(false)}
        />
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
      <div className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-tight">
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

  // Change these field names if your student record stores the photo differently
  const photoUrl = student?.photoUrl || student?.photo || student?.imageUrl || '';

  // Reset the failed state when a different student is loaded
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