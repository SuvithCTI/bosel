import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  UserRound,
  BookOpen,
  ClipboardList,
  Save,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Calendar,
  RotateCcw
} from 'lucide-react';

import { getMarksheetSubjects } from '../../utils/studentDataHelpers';

const STORAGE_KEY = 'bsel_student_marksheets';

const getSavedMarksheets = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

const getStudentId = (student) =>
  String(student?.userId || '').trim().toLowerCase();

const getGrade = (marks, max) => {
  if (!max) return '-';

  const percentage = (Number(marks) / Number(max)) * 100;

  if (percentage >= 95) return 'A+';
  if (percentage >= 85) return 'A';
  if (percentage >= 75) return 'B+';
  if (percentage >= 65) return 'B';
  if (percentage >= 50) return 'C';

  return 'D';
};

export default function BranchStudentMarksheetPage({
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Search student using Student ID or Register Number
  const handleSearch = (e) => {
    e?.preventDefault();

    setError('');
    setSuccess('');
    setStudent(null);
    setSubjects([]);
    setMarks({});
    setSavedData(null);
    setIsEditing(false);

    const query = searchId.trim().toLowerCase();

    if (!query) {
      setError('Please enter a Student ID or Register Number.');
      return;
    }

    const foundStudent = branchStudents.find((st) => {
      const userId = String(st.userId || '').trim().toLowerCase();
      const registerNumber = String(st.registerNumber || '').trim().toLowerCase();
      const registrationNo = String(st.registrationNo || '').trim().toLowerCase();

      return (
        userId === query ||
        registerNumber === query ||
        registrationNo === query
      );
    });

    if (!foundStudent) {
      setError(
        'Student not found in your branch. Please check the Student ID.'
      );
      return;
    }

    setStudent(foundStudent);

    const courseName =
      foundStudent.program ||
      foundStudent.courseName ||
      'Abacus Speed Arithmetic';

    const studentSubjects = getMarksheetSubjects(foundStudent).map(
      (subject, index) => ({
        id: String(subject.id || index + 1),
        name: subject.name,
        max: Number(subject.max) || 100,
        min: Number(subject.min) || 0
      })
    );

    setSubjects(studentSubjects);

    // Retrieve previously saved marks
    const allMarksheets = getSavedMarksheets();
    const existing = allMarksheets[getStudentId(foundStudent)];

    if (
      existing &&
      String(existing.branch || '').toLowerCase() ===
        String(activeBranch || '').toLowerCase() &&
      existing.course === courseName
    ) {
      setSavedData(existing);

      const existingMarks = {};

      studentSubjects.forEach((subject) => {
        existingMarks[subject.id] =
          existing.marks?.[subject.id] ?? '';
      });

      setMarks(existingMarks);
    } else {
      const initialMarks = {};

      studentSubjects.forEach((subject) => {
        initialMarks[subject.id] = '';
      });

      setMarks(initialMarks);
    }
  };

  // Start adding or editing marks
  const handleAddMarks = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  // Handle individual subject marks
  const handleMarkChange = (subjectId, value) => {
    if (value !== '' && !/^\d+$/.test(value)) return;

    setMarks((prev) => ({
      ...prev,
      [subjectId]: value
    }));
  };

  // Save student marks
  const handleSaveMarks = () => {
    setError('');
    setSuccess('');

    if (!student) return;

    const incomplete = subjects.find(
      (subject) =>
        marks[subject.id] === '' ||
        marks[subject.id] === undefined
    );

    if (incomplete) {
      setError(`Please enter marks for ${incomplete.name}.`);
      return;
    }

    const invalidSubject = subjects.find((subject) => {
      const value = Number(marks[subject.id]);

      return (
        !Number.isFinite(value) ||
        value < 0 ||
        value > subject.max
      );
    });

    if (invalidSubject) {
      setError(
        `Marks for ${invalidSubject.name} cannot exceed ${invalidSubject.max}.`
      );
      return;
    }

    const totalMarks = subjects.reduce(
      (sum, subject) => sum + Number(marks[subject.id]),
      0
    );

    const totalMaximum = subjects.reduce(
      (sum, subject) => sum + subject.max,
      0
    );

    const percentage =
      totalMaximum > 0
        ? ((totalMarks / totalMaximum) * 100).toFixed(2)
        : '0.00';

    const marksheet = {
      studentId: student.userId,
      registerNumber:
        student.registerNumber ||
        student.registrationNo ||
        '',
      studentName: student.studentName,
      branch: activeBranch,
      course:
        student.program ||
        student.courseName ||
        'Abacus Speed Arithmetic',
      marks: { ...marks },
      totalMarks,
      totalMaximum,
      percentage,
      overallGrade: getGrade(totalMarks, totalMaximum),
      updatedAt: new Date().toISOString()
    };

    try {
      const allMarksheets = getSavedMarksheets();

      allMarksheets[getStudentId(student)] = marksheet;

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(allMarksheets)
      );

      setSavedData(marksheet);
      setIsEditing(false);
      setSuccess('Student marks saved successfully!');
    } catch (err) {
      console.error('Error saving marks:', err);
      setError('Unable to save marks. Please try again.');
    }
  };

  // Reset and search another student
  const handleNextStudent = () => {
    setSearchId('');
    setStudent(null);
    setSubjects([]);
    setMarks({});
    setSavedData(null);
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setError('');

    if (savedData) {
      setMarks({ ...savedData.marks });
    } else {
      const emptyMarks = {};

      subjects.forEach((subject) => {
        emptyMarks[subject.id] = '';
      });

      setMarks(emptyMarks);
    }
  };

  const totalMarks = subjects.reduce(
    (sum, subject) => sum + (Number(marks[subject.id]) || 0),
    0
  );

  const totalMaximum = subjects.reduce(
    (sum, subject) => sum + subject.max,
    0
  );

  const percentage =
    totalMaximum > 0
      ? ((totalMarks / totalMaximum) * 100).toFixed(1)
      : '0.0';

  const allMarksEntered =
    subjects.length > 0 &&
    subjects.every(
      (subject) =>
        marks[subject.id] !== '' &&
        marks[subject.id] !== undefined
    );

  return (
    <div className="w-full min-w-0 space-y-3 sm:space-y-5 animate-in fade-in duration-200">

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50 sm:h-10 sm:w-10"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4 text-slate-700 sm:h-5 sm:w-5" />
          </button>

          <div className="min-w-0">
            <h1 className="text-base font-black text-slate-950 sm:text-xl">
              Student Marksheet
            </h1>

            <p className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">
              Manage examination results for {activeBranch}
            </p>
          </div>
        </div>

        <div className="flex w-fit max-w-full items-center gap-2 rounded-xl border border-sky-100 bg-sky-50 px-3 py-2">
          <GraduationCap className="h-4 w-4 shrink-0 text-sky-700" />

          <span className="break-words text-[10px] font-bold text-sky-900 sm:text-xs">
            {activeBranch}
          </span>
        </div>
      </div>

      {/* Student Search */}
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-5">

        <div className="mb-3 flex items-center gap-2.5 sm:mb-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-800 sm:h-9 sm:w-9">
            <Search className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <h2 className="text-xs font-black text-slate-950 sm:text-sm">
              Search Student
            </h2>

            <p className="text-[10px] text-slate-500 sm:text-[11px]">
              Enter the student's ID or registration number.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSearch}
          className="flex min-w-0 flex-col gap-2 sm:flex-row"
        >
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Student ID / Register Number"
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-xs font-medium outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 sm:py-3 sm:pl-10 sm:pr-4 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0c234b] px-4 py-2.5 text-xs font-black text-white transition hover:bg-[#173d70] sm:w-auto sm:px-6 sm:py-3"
          >
            <Search className="h-4 w-4" />
            Search Student
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-2.5 text-xs font-bold text-red-700 sm:p-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="min-w-0 break-words">{error}</span>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-2.5 text-xs font-bold text-emerald-700 sm:p-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="min-w-0 break-words">{success}</span>
          </div>
        )}
      </div>

      {/* Student Information */}
      {student && (
        <>
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-5">

            {/* Student Header */}
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">

              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-[#0c234b] sm:h-12 sm:w-12 sm:rounded-2xl">
                  <UserRound className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>

                <div className="min-w-0">
                  <h2 className="break-words text-sm font-black capitalize text-slate-950 sm:text-base">
                    {student.studentName || 'Student Name'}
                  </h2>

                  <p className="mt-1 break-all text-[10px] text-slate-500 sm:text-xs">
                    Student ID:{' '}
                    <span className="font-bold text-sky-800">
                      {student.userId || 'Not available'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {savedData && (
                  <span className="flex items-center gap-1 rounded-lg border border-emerald-100 bg-emerald-50 px-2.5 py-1.5 text-[10px] font-black text-emerald-700">
                    <CheckCircle2 className="h-3 w-3" />
                    Marks Saved
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleNextStudent}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-bold text-slate-700 transition hover:bg-slate-200 sm:px-3 sm:py-2 sm:text-xs"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Next Student
                </button>
              </div>
            </div>

            {/* Student Details Cards */}
            <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-3 lg:grid-cols-4">

              <InfoCard
                label="Register Number"
                value={
                  student.registerNumber ||
                  student.registrationNo ||
                  'Not available'
                }
              />

              <InfoCard
                label="Enrolled Course"
                value={
                  student.program ||
                  student.courseName ||
                  'Not available'
                }
              />

              <InfoCard
                label="Grade / Level"
                value={student.grade || 'Not available'}
              />

              <InfoCard
                label="Branch"
                value={student.branch || activeBranch}
              />

            </div>
          </div>

          {/* Marks Entry */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:rounded-2xl">

            {/* Marks Header */}
            <div className="flex flex-col gap-3 border-b border-slate-100 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-5">

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800 sm:h-9 sm:w-9">
                  <BookOpen className="h-4 w-4" />
                </div>

                <div>
                  <h2 className="text-xs font-black text-slate-950 sm:text-sm">
                    Subject-wise Marks
                  </h2>

                  <p className="text-[10px] text-slate-500 sm:text-[11px]">
                    {subjects.length} subjects available for this course
                  </p>
                </div>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  onClick={handleAddMarks}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0c234b] px-4 py-2.5 text-xs font-black text-white transition hover:bg-[#173d70] sm:w-auto sm:py-2.5"
                >
                  <ClipboardList className="h-4 w-4" />
                  {savedData ? 'Edit Marks' : 'Add Marks'}
                </button>
              )}
            </div>

            {/* Mobile Subject Cards */}
            <div className="space-y-2.5 p-3 sm:hidden">
              {subjects.map((subject, index) => (
                <div
                  key={subject.id}
                  className="space-y-2.5 rounded-xl border border-slate-200 bg-white p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Subject {index + 1}
                      </p>

                      <h3 className="break-words text-xs font-bold leading-snug text-slate-900">
                        {subject.name}
                      </h3>
                    </div>

                    <span className="shrink-0 rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
                      Max: {subject.max}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">

                    {/* Obtained Marks */}
                    <div className="min-w-0">
                      <label className="mb-1 block text-[9px] font-bold uppercase tracking-wide text-slate-400">
                        Obtained Marks
                      </label>

                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          max={subject.max}
                          value={marks[subject.id] ?? ''}
                          onChange={(e) =>
                            handleMarkChange(subject.id, e.target.value)
                          }
                          placeholder="Enter marks"
                          className="w-full min-w-0 rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-bold outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                        />
                      ) : (
                        <div className="rounded-lg bg-slate-50 px-2.5 py-2 text-xs font-black text-slate-900">
                          {marks[subject.id] ?? '-'}
                        </div>
                      )}
                    </div>

                    {/* Grade */}
                    <div className="min-w-0">
                      <span className="mb-1 block text-[9px] font-bold uppercase tracking-wide text-slate-400">
                        Grade
                      </span>

                      <div className="rounded-lg bg-sky-50 px-2.5 py-2 text-xs font-black text-sky-800">
                        {marks[subject.id] !== '' &&
                        marks[subject.id] !== undefined
                          ? getGrade(marks[subject.id], subject.max)
                          : '-'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop / Tablet Subject Table */}
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full min-w-[620px] text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-[9px] font-black uppercase tracking-wider text-slate-500 lg:px-5 lg:text-[10px]">
                      S.No
                    </th>

                    <th className="px-4 py-3 text-[9px] font-black uppercase tracking-wider text-slate-500 lg:px-5 lg:text-[10px]">
                      Subject Name
                    </th>

                    <th className="px-4 py-3 text-[9px] font-black uppercase tracking-wider text-slate-500 lg:px-5 lg:text-[10px]">
                      Maximum Marks
                    </th>

                    <th className="px-4 py-3 text-[9px] font-black uppercase tracking-wider text-slate-500 lg:px-5 lg:text-[10px]">
                      Obtained Marks
                    </th>

                    <th className="px-4 py-3 text-[9px] font-black uppercase tracking-wider text-slate-500 lg:px-5 lg:text-[10px]">
                      Grade
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {subjects.map((subject, index) => (
                    <tr
                      key={subject.id}
                      className="transition hover:bg-slate-50/70"
                    >
                      <td className="px-4 py-3 text-[11px] font-bold text-slate-500 lg:px-5 lg:py-4 lg:text-xs">
                        {index + 1}
                      </td>

                      <td className="px-4 py-3 lg:px-5 lg:py-4">
                        <div className="text-[11px] font-bold text-slate-900 lg:text-xs">
                          {subject.name}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-[11px] font-bold text-slate-600 lg:px-5 lg:py-4 lg:text-xs">
                        {subject.max}
                      </td>

                      <td className="px-4 py-3 lg:px-5 lg:py-4">
                        {isEditing ? (
                          <input
                            type="number"
                            min="0"
                            max={subject.max}
                            value={marks[subject.id] ?? ''}
                            onChange={(e) =>
                              handleMarkChange(subject.id, e.target.value)
                            }
                            placeholder="Enter marks"
                            className="w-24 rounded-lg border border-slate-200 px-2.5 py-2 text-[11px] font-bold outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 lg:w-28 lg:text-xs"
                          />
                        ) : (
                          <span className="text-[11px] font-black text-slate-900 lg:text-xs">
                            {marks[subject.id] ?? '-'}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 lg:px-5 lg:py-4">
                        <span className="rounded-lg bg-sky-50 px-2 py-1 text-[9px] font-black text-sky-800 lg:text-[10px]">
                          {marks[subject.id] !== '' &&
                          marks[subject.id] !== undefined
                            ? getGrade(marks[subject.id], subject.max)
                            : '-'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total and Percentage */}
            <div className="border-t border-slate-100 bg-slate-50/70 p-3 sm:p-5">

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">

                {/* Total Marks */}
                <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-2.5 sm:p-3">
                  <span className="text-[9px] font-bold uppercase tracking-wide text-slate-500 sm:text-[10px]">
                    Total Marks
                  </span>

                  <div className="mt-1 text-lg font-black text-slate-950 sm:text-xl">
                    {totalMarks}
                    <span className="text-xs font-bold text-slate-400">
                      {' '}/ {totalMaximum}
                    </span>
                  </div>
                </div>

                {/* Percentage */}
                <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-2.5 sm:p-3">
                  <span className="text-[9px] font-bold uppercase tracking-wide text-slate-500 sm:text-[10px]">
                    Percentage
                  </span>

                  <div className="mt-1 text-lg font-black text-sky-800 sm:text-xl">
                    {percentage}%
                  </div>
                </div>

                {/* Overall Grade */}
                <div className="col-span-2 min-w-0 rounded-xl border border-slate-200 bg-white p-2.5 sm:col-span-1 sm:p-3">
                  <span className="text-[9px] font-bold uppercase tracking-wide text-slate-500 sm:text-[10px]">
                    Overall Grade
                  </span>

                  <div className="mt-1 text-lg font-black text-amber-600 sm:text-xl">
                    {allMarksEntered
                      ? getGrade(totalMarks, totalMaximum)
                      : savedData?.overallGrade || '-'}
                  </div>
                </div>

              </div>

              {/* Save Actions */}
              {isEditing && (
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 transition hover:bg-slate-100 sm:w-auto sm:px-5 sm:py-3"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveMarks}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-black text-[#0c234b] transition hover:bg-amber-500 sm:w-auto sm:px-5 sm:py-3"
                  >
                    <Save className="h-4 w-4" />
                    Save Student Marks
                  </button>

                </div>
              )}

              {/* Last Updated */}
              {!isEditing && savedData && (
                <div className="mt-4 flex items-start gap-2 break-words text-[10px] text-slate-500 sm:text-[11px]">
                  <Calendar className="mt-0.5 h-3.5 w-3.5 shrink-0" />

                  <span>
                    Last updated:{' '}
                    {savedData.updatedAt
                      ? new Date(savedData.updatedAt).toLocaleString('en-IN')
                      : 'Not available'}
                  </span>
                </div>
              )}

            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {!student && !error && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center sm:rounded-2xl sm:p-10">

          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 sm:h-16 sm:w-16">
            <GraduationCap className="h-6 w-6 text-sky-800 sm:h-8 sm:w-8" />
          </div>

          <h3 className="text-sm font-black text-slate-900">
            Search for a Student
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-[11px] leading-relaxed text-slate-500 sm:text-xs">
            Enter the student's ID or registration number above to view
            their enrolled course and enter examination marks.
          </p>
        </div>
      )}

    </div>
  );
}

// Student Information Card
function InfoCard({ label, value }) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50 p-2.5 sm:p-3">
      <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:text-[10px]">
        {label}
      </div>

      <div className="mt-1 break-words text-[10px] font-black leading-snug text-slate-900 sm:text-xs">
        {value}
      </div>
    </div>
  );
}