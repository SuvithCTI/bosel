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
  RotateCcw,
  Pencil,
  X
} from 'lucide-react';

import { getCourseSubjectModules } from '../../components/OfficialMarksheetView';
import {
  normalize,
  getStudentCourse,
  getStudentKey,
  getGrade,
  getSavedMarksheet,
  readMarksheets,
  writeMarksheets
} from '../../utils/marksheetStorage';

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
  // SEARCH STUDENT
  // ------------------------------------------------

  const handleSearch = (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');
    setStudent(null);
    setSubjects([]);
    setMarks({});
    setSavedData(null);
    setIsEditing(false);

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

    setStudent(foundStudent);
    setSubjects(studentSubjects);

    // Load existing marks for this student + enrolled course (if any)
    const existing = getSavedMarksheet(foundStudent);
    const initialMarks = {};

    studentSubjects.forEach((subject) => {
      initialMarks[subject.id] = existing?.marks?.[subject.id] ?? '';
    });

    setMarks(initialMarks);
    if (existing) setSavedData(existing);
  };

  // ------------------------------------------------
  // ADD / EDIT MARKS
  // ------------------------------------------------

  const handleAddMarks = () => {
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

    const courseName = getStudentCourse(student);

    const marksheet = {
      studentId: student.userId,
      studentName: student.studentName,
      registerNumber: student.registerNumber || student.registrationNo || '',
      branch: activeBranch,
      course: courseName,
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
      const allMarksheets = readMarksheets();
      allMarksheets[getStudentKey(student)] = marksheet;
      writeMarksheets(allMarksheets);

      setSavedData(marksheet);
      setIsEditing(false);
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

  // ------------------------------------------------
  // NEXT STUDENT
  // ------------------------------------------------

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

  // ------------------------------------------------
  // UI
  // ------------------------------------------------

  return (
    <div className="space-y-5 animate-in fade-in duration-200">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>

          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-950">
              Student Marksheet
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Examination results management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-sky-50 border border-sky-100 rounded-xl w-fit">
          <GraduationCap className="w-4 h-4 text-sky-700" />
          <span className="text-xs font-bold text-sky-900">{activeBranch}</span>
        </div>

      </div>

      {/* SEARCH CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-sky-100 text-[#0c234b] rounded-xl flex items-center justify-center">
            <Search className="w-5 h-5" />
          </div>

          <div>
            <h2 className="text-sm font-black text-slate-950">Search Student</h2>
            <p className="text-[11px] text-slate-500">
              Enter Student ID or Registration Number.
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Student ID / Register Number"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none text-sm font-medium focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#0c234b] hover:bg-[#173d70] text-white text-xs font-black flex items-center justify-center gap-2 transition"
          >
            <Search className="w-4 h-4" />
            Search Student
          </button>

        </form>

        {error && (
          <div className="mt-3 flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

      </div>

      {/* STUDENT DETAILS */}
      {student && (
        <>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

              <div className="flex items-center gap-3 min-w-0">

                <div className="w-12 h-12 shrink-0 rounded-2xl bg-sky-100 text-[#0c234b] flex items-center justify-center">
                  <UserRound className="w-6 h-6" />
                </div>

                <div className="min-w-0">
                  <h2 className="text-base font-black text-slate-950 capitalize">
                    {student.studentName}
                  </h2>

                  <p className="text-xs text-slate-500 mt-1">
                    Student ID:{' '}
                    <strong className="text-sky-800">{student.userId}</strong>
                  </p>
                </div>

              </div>

              <div className="flex items-center flex-wrap gap-2">

                {savedData && (
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Marks Saved
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleNextStudent}
                  className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Next Student
                </button>

              </div>

            </div>

            {/* DETAILS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">

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
                value={getStudentCourse(student) || 'Not available'}
              />

              <InfoCard
                label="Grade / Level"
                value={student.grade || 'Not available'}
              />

              <InfoCard label="Branch" value={activeBranch} />

            </div>

          </div>

          {/* MARKSHEET CARD */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            {/* CARD HEADER */}
            <div className="p-4 sm:p-5 border-b border-slate-100">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>

                  <div>
                    <h2 className="text-sm font-black text-slate-950">
                      Subject-wise Marks
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      {subjects.length} subjects in{' '}
                      {getStudentCourse(student) || 'this course'}
                    </p>
                  </div>
                </div>

                {!isEditing ? (
                  <button
                    type="button"
                    onClick={handleAddMarks}
                    className="w-full sm:w-auto min-w-[140px] px-5 py-3 rounded-xl bg-[#0c234b] hover:bg-[#173d70] text-white text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    {savedData ? (
                      <>
                        <Pencil className="w-4 h-4" />
                        Edit Marks
                      </>
                    ) : (
                      <>
                        <ClipboardList className="w-4 h-4" />
                        Add Marks
                      </>
                    )}
                  </button>
                ) : (
                  <div className="w-full sm:w-auto px-4 py-3 rounded-xl bg-sky-50 border border-sky-100 text-sky-800 text-xs font-bold flex items-center justify-center gap-2">
                    <Pencil className="w-4 h-4" />
                    Marks Editing Enabled
                  </div>
                )}

              </div>
            </div>

            {isEditing || savedData ? (
              <>
                {/* SUBJECT TABLE */}
                <div className="overflow-x-auto">

                  <table className="w-full text-left min-w-[600px]">

                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-5 py-3 text-[10px] uppercase tracking-wider font-black text-slate-500">
                          S.No
                        </th>
                        <th className="px-5 py-3 text-[10px] uppercase tracking-wider font-black text-slate-500">
                          Subject Name
                        </th>
                        <th className="px-5 py-3 text-[10px] uppercase tracking-wider font-black text-slate-500">
                          Maximum Marks
                        </th>
                        <th className="px-5 py-3 text-[10px] uppercase tracking-wider font-black text-slate-500">
                          Obtained Marks
                        </th>
                        <th className="px-5 py-3 text-[10px] uppercase tracking-wider font-black text-slate-500">
                          Grade
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">

                      {subjects.map((subject, index) => {
                        const entered = marks[subject.id];

                        const subjectPercentage =
                          entered !== '' && entered !== undefined
                            ? (Number(entered) / subject.max) * 100
                            : null;

                        return (
                          <tr key={subject.id} className="hover:bg-slate-50/70">

                            <td className="px-5 py-4 text-xs font-bold text-slate-500">
                              {index + 1}
                            </td>

                            <td className="px-5 py-4">
                              <div className="text-xs font-bold text-slate-900">
                                {subject.name}
                              </div>
                            </td>

                            <td className="px-5 py-4 text-xs font-bold text-slate-600">
                              {subject.max}
                            </td>

                            <td className="px-5 py-4">
                              {isEditing ? (
                                <input
                                  type="number"
                                  min="0"
                                  max={subject.max}
                                  step="1"
                                  value={entered ?? ''}
                                  onChange={(e) =>
                                    handleMarkChange(subject.id, e.target.value)
                                  }
                                  placeholder="Enter marks"
                                  className="w-28 px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold outline-none focus:ring-2 focus:ring-sky-500"
                                />
                              ) : (
                                <span className="text-xs font-black text-slate-900">
                                  {entered !== '' && entered !== undefined
                                    ? entered
                                    : '-'}
                                </span>
                              )}
                            </td>

                            <td className="px-5 py-4">
                              <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 text-[10px] font-black">
                                {subjectPercentage !== null
                                  ? getGrade(subjectPercentage)
                                  : '-'}
                              </span>
                            </td>

                          </tr>
                        );
                      })}

                    </tbody>

                  </table>

                </div>

                {/* TOTAL MARKS */}
                <div className="p-5 border-t border-slate-100 bg-slate-50/70">

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

                    <div className="bg-white rounded-xl border border-slate-200 p-3">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">
                        Total Marks
                      </span>
                      <div className="text-xl font-black text-slate-950 mt-1">
                        {totalObtained}
                        <span className="text-xs text-slate-400">
                          {' '}/ {totalMaximum}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-3">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">
                        Percentage
                      </span>
                      <div className="text-xl font-black text-sky-800 mt-1">
                        {percentage.toFixed(2)}%
                      </div>
                    </div>

                    <div className="col-span-2 sm:col-span-1 bg-white rounded-xl border border-slate-200 p-3">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">
                        Overall Grade
                      </span>
                      <div className="text-xl font-black text-amber-600 mt-1">
                        {allMarksEntered
                          ? getGrade(percentage)
                          : savedData?.overallGrade || '-'}
                      </div>
                    </div>

                  </div>

                  {/* SAVE BUTTONS */}
                  {isEditing && (
                    <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">

                      <button
                        type="button"
                        onClick={handleCancelEditing}
                        className="px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-black hover:bg-slate-100 flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveMarks}
                        className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-[#0c234b] text-xs font-black flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save Student Marks
                      </button>

                    </div>
                  )}

                  {/* LAST UPDATED */}
                  {!isEditing && savedData && (
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      Last updated:{' '}
                      {new Date(savedData.updatedAt).toLocaleString('en-IN')}
                    </div>
                  )}

                </div>
              </>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">
                Click <strong>Add Marks</strong> to enter marks for{' '}
                <strong className="text-slate-800">
                  {getStudentCourse(student) || 'the enrolled course'}
                </strong>
                .
              </div>
            )}

          </div>

        </>
      )}

      {/* EMPTY STATE */}
      {!student && !error && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center">

          <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-sky-800" />
          </div>

          <h3 className="text-sm font-black text-slate-900">
            Search for a Student
          </h3>

          <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
            Enter the student's ID or registration number above to
            view their enrolled course and enter examination marks.
          </p>

        </div>
      )}

    </div>
  );
}

// ------------------------------------------------
// REUSABLE STUDENT INFORMATION CARD
// ------------------------------------------------

function InfoCard({ label, value }) {
  return (
    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 min-w-0">

      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </div>

      <div className="text-xs font-black text-slate-900 mt-1 break-words">
        {value}
      </div>

    </div>
  );
}