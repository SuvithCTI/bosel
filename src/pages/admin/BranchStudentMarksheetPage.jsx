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
  Award,
  RotateCcw,
  FileText
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
      const userId = String(st.userId || '').toLowerCase();
      const registerNumber = String(st.registerNumber || '').toLowerCase();
      const registrationNo = String(st.registrationNo || '').toLowerCase();

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

    // Get subjects according to the student's enrolled course
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
      existing.branch?.toLowerCase() === activeBranch?.toLowerCase() &&
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
    if (value !== '' && (!/^\d+$/.test(value))) return;

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

    const percentage = (
      (totalMarks / totalMaximum) *
      100
    ).toFixed(2);

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

  const allMarksEntered = subjects.length > 0 &&
    subjects.every(
      (subject) =>
        marks[subject.id] !== '' &&
        marks[subject.id] !== undefined
    );

  return (
    <div className="space-y-3 sm:space-y-5 animate-in fade-in duration-200 min-w-0">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
          </button>

          <div>
            <h1 className="text-base sm:text-xl font-black text-slate-950">
              Student Marksheet
            </h1>

            <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">
              Manage examination results for {activeBranch}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-sky-50 border border-sky-100 rounded-xl w-fit">
          <BuildingIcon />
          <span className="text-[10px] sm:text-xs font-bold text-sky-900">
            {activeBranch}
          </span>
        </div>
      </div>

      {/* Student Search */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-3 sm:p-5">

        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-sky-100 text-sky-800 rounded-xl flex items-center justify-center">
            <Search className="w-4 h-4" />
          </div>

          <div>
            <h2 className="text-xs sm:text-sm font-black text-slate-950">
              Search Student
            </h2>

            <p className="text-[10px] sm:text-[11px] text-slate-500">
              Enter the student's ID or registration number.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Student ID / Register Number"
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 outline-none text-xs sm:text-sm font-medium focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>

          <button
            type="submit"
            className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#0c234b] hover:bg-[#173d70] text-white text-xs font-black flex items-center justify-center gap-2 transition"
          >
            <Search className="w-4 h-4" />
            Search Student
          </button>
        </form>

        {error && (
          <div className="mt-3 flex items-start gap-2 p-2.5 sm:p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="mt-3 flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {success}
          </div>
        )}
      </div>

      {/* Student Information */}
      {student && (
        <>
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-3 sm:p-5">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-sky-100 text-[#0c234b] flex items-center justify-center">
                  <UserRound className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                <div>
                  <h2 className="text-sm sm:text-base font-black text-slate-950 capitalize break-words">
                    {student.studentName}
                  </h2>

                  <p className="text-[10px] sm:text-xs text-slate-500 mt-1 break-all">
                    Student ID:{' '}
                    <span className="font-bold text-sky-800">
                      {student.userId}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {savedData && (
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Marks Saved
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleNextStudent}
                  className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Next Student
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mt-3 sm:mt-5">

              <InfoCard
                label="Register Number"
                value={student.registerNumber || student.registrationNo || 'Not available'}
              />

              <InfoCard
                label="Enrolled Course"
                value={student.program || student.courseName || 'Not available'}
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
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="p-3 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>

                <div>
                  <h2 className="text-xs sm:text-sm font-black text-slate-950">
                    Subject-wise Marks
                  </h2>

                  <p className="text-[10px] sm:text-[11px] text-slate-500">
                    {subjects.length} subjects available for this course
                  </p>
                </div>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  onClick={handleAddMarks}
                  className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#0c234b] hover:bg-[#173d70] text-white text-xs font-black flex items-center justify-center gap-2"
                >
                  <ClipboardList className="w-4 h-4" />
                  {savedData ? 'Edit Marks' : 'Add Marks'}
                </button>
              )}

            </div>

            {/* Subject List: compact cards on mobile, table on larger screens */}
            <div className="sm:hidden p-3 space-y-2.5">
              {subjects.map((subject, index) => (
                <div
                  key={subject.id}
                  className="rounded-xl border border-slate-200 bg-white p-3 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Subject {index + 1}
                      </p>
                      <h3 className="text-xs font-bold text-slate-900 leading-snug break-words">
                        {subject.name}
                      </h3>
                    </div>
                    <span className="shrink-0 rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
                      Max: {subject.max}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="min-w-0">
                      <label className="block mb-1 text-[9px] font-bold uppercase text-slate-400">
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
                          className="w-full min-w-0 px-2.5 py-2 rounded-lg border border-slate-200 text-xs font-bold outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      ) : (
                        <div className="rounded-lg bg-slate-50 px-2.5 py-2 text-xs font-black text-slate-900">
                          {marks[subject.id] ?? '-'}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <span className="block mb-1 text-[9px] font-bold uppercase text-slate-400">
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

            {/* Desktop/tablet subject table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left min-w-[620px]">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 lg:px-5 py-3 text-[9px] lg:text-[10px] uppercase tracking-wider font-black text-slate-500">S.No</th>
                    <th className="px-4 lg:px-5 py-3 text-[9px] lg:text-[10px] uppercase tracking-wider font-black text-slate-500">Subject Name</th>
                    <th className="px-4 lg:px-5 py-3 text-[9px] lg:text-[10px] uppercase tracking-wider font-black text-slate-500">Maximum Marks</th>
                    <th className="px-4 lg:px-5 py-3 text-[9px] lg:text-[10px] uppercase tracking-wider font-black text-slate-500">Obtained Marks</th>
                    <th className="px-4 lg:px-5 py-3 text-[9px] lg:text-[10px] uppercase tracking-wider font-black text-slate-500">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subjects.map((subject, index) => (
                    <tr key={subject.id} className="hover:bg-slate-50/70">
                      <td className="px-4 lg:px-5 py-3 lg:py-4 text-[11px] lg:text-xs font-bold text-slate-500">
                        {index + 1}
                      </td>
                      <td className="px-4 lg:px-5 py-3 lg:py-4">
                        <div className="text-[11px] lg:text-xs font-bold text-slate-900">
                          {subject.name}
                        </div>
                      </td>
                      <td className="px-4 lg:px-5 py-3 lg:py-4 text-[11px] lg:text-xs font-bold text-slate-600">
                        {subject.max}
                      </td>
                      <td className="px-4 lg:px-5 py-3 lg:py-4">
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
                            className="w-24 lg:w-28 px-2.5 py-2 rounded-lg border border-slate-200 text-[11px] lg:text-xs font-bold outline-none focus:ring-2 focus:ring-sky-500"
                          />
                        ) : (
                          <span className="text-[11px] lg:text-xs font-black text-slate-900">
                            {marks[subject.id] ?? '-'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 lg:px-5 py-3 lg:py-4">
                        <span className="px-2 py-1 rounded-lg bg-sky-50 text-sky-800 text-[9px] lg:text-[10px] font-black">
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
            <div className="p-3 sm:p-5 border-t border-slate-100 bg-slate-50/70">

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">

                <div className="bg-white rounded-xl border border-slate-200 p-2.5 sm:p-3 min-w-0">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">
                    Total Marks
                  </span>

                  <div className="text-lg sm:text-xl font-black text-slate-950 mt-1">
                    {totalMarks}
                    <span className="text-xs text-slate-400">
                      {' '}/ {totalMaximum}
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-2.5 sm:p-3 min-w-0">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">
                    Percentage
                  </span>

                  <div className="text-lg sm:text-xl font-black text-sky-800 mt-1">
                    {percentage}%
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1 bg-white rounded-xl border border-slate-200 p-3">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">
                    Overall Grade
                  </span>

                  <div className="text-lg sm:text-xl font-black text-amber-600 mt-1">
                    {allMarksEntered
                      ? getGrade(totalMarks, totalMaximum)
                      : savedData?.overallGrade || '-'}
                  </div>
                </div>

              </div>

              {/* Save Actions */}
              {isEditing && (
                <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">

                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);

                      if (savedData) {
                        setMarks({ ...savedData.marks });
                      } else {
                        const emptyMarks = {};
                        subjects.forEach((s) => {
                          emptyMarks[s.id] = '';
                        });
                        setMarks(emptyMarks);
                      }

                      setError('');
                    }}
                    className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-black hover:bg-slate-100"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveMarks}
                    className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-[#0c234b] text-xs font-black flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Student Marks
                  </button>

                </div>
              )}

              {!isEditing && savedData && (
                <div className="mt-4 flex items-start gap-2 text-[10px] sm:text-[11px] text-slate-500 break-words">
                  <Calendar className="w-3.5 h-3.5" />
                  Last updated:{' '}
                  {new Date(savedData.updatedAt).toLocaleString('en-IN')}
                </div>
              )}

            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {!student && !error && (
        <div className="bg-white rounded-xl sm:rounded-2xl border border-dashed border-slate-300 p-6 sm:p-10 text-center">

          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-sky-800" />
          </div>

          <h3 className="text-sm font-black text-slate-900">
            Search for a Student
          </h3>

          <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
            Enter the student's ID or registration number above to view
            their enrolled course and enter examination marks.
          </p>
        </div>
      )}

    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-100 min-w-0">
      <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </div>

      <div className="text-[11px] sm:text-xs font-black text-slate-900 mt-1 break-words">
        {value}
      </div>
    </div>
  );
}

function BuildingIcon() {
  return (
    <GraduationCap className="w-4 h-4 text-sky-700" />
  );
}