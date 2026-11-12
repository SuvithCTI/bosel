import React, { useMemo, useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Phone,
  CheckCircle2,
  Clock,
  GraduationCap,
  Receipt,
  Ticket,
  FileSpreadsheet,
  Edit3,
  Trash2
} from 'lucide-react';
import CompactSelect from '../../components/CompactSelect';
import StudentAvatar from '../../components/StudentAvatar';

export default function AdminBranchStudentsPage({
  activeBranch = 'Concern Branch',
  branchStudents = [],
  branchStudentSearch = '',
  setBranchStudentSearch = () => {},
  setShowAddStudentModal = () => {},
  setViewingAdmissionStudent = () => {},
  handleOpenMarksheet,
  handleOpenCertForStudent,
  handleOpenReceiptForStudent,
  handleOpenEventRegForStudent,
  handleOpenQuestionPaperForStudent,
  setEditingStudent,
  handleDeleteStudent
}) {
  // Course filter state
  const [branchCourseFilter, setBranchCourseFilter] = useState('All');

  // List of courses for filtering
  const allCourses = useMemo(() => [
    { value: 'All', label: 'All Courses' },
    { value: 'Abacus', label: 'Abacus Speed Arithmetic' },
    { value: 'Handwriting', label: 'Handwriting & Calligraphy' },
    { value: 'Phonics', label: 'Phonics & Language Syntax' },
    { value: 'Drawing', label: 'Drawing & Art' },
    { value: 'Memory', label: 'Memory Challenge & Brain Training' },
    { value: 'Bharatanatyam', label: 'Classical Dance (Bharatanatyam)' },
    { value: 'MS Office', label: 'MS Office (Word, Excel, PowerPoint)' },
    { value: 'HTML', label: 'HTML5 Web Architecture' },
    { value: 'CSS', label: 'CSS3 Interactive Design' },
    { value: 'Python', label: 'Python for Young Coders' },
    { value: 'Computer', label: 'Computer Fundamentals & OS' },
    { value: 'Photoshop', label: 'Photoshop & Creative Suite' },
    { value: 'AI', label: 'AI & Prompt Engineering' },
    { value: 'Canva', label: 'Canva Graphic Design' },
    { value: 'Spoken English', label: 'Language & Public Speaking' },
    { value: 'Athletics', label: 'Athletics & Physical Conditioning' }
  ], []);

  // Branch options locked/scoped to the active concern branch
  const branchOptions = useMemo(() => [
    { value: activeBranch || 'Branch', label: activeBranch || 'Branch' }
  ], [activeBranch]);

  // Filter students based on course (search is handled upstream or fallback here)
  const filteredStudents = useMemo(() => {
    return (branchStudents || []).filter(student => {
      // Course filter
      if (branchCourseFilter && branchCourseFilter !== 'All') {
        const prog = (student.program || student.courseName || '').toLowerCase();
        if (!prog.includes(branchCourseFilter.toLowerCase())) return false;
      }
      return true;
    });
  }, [branchStudents, branchCourseFilter]);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header & Filter Controls */}
      <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-600" />
              <span>Central Student Registration Monitor</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitoring all student enrollments under <span className="font-bold text-sky-700">{activeBranch}</span>, fee status, and official B★SEL register numbers.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setShowAddStudentModal(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Student</span>
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1 items-center">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={branchStudentSearch}
              onChange={(e) => setBranchStudentSearch(e.target.value)}
              placeholder="Search candidate, ID, phone..."
              className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:border-sky-500 focus:ring-1 focus:ring-sky-100 outline-none bg-slate-50/50 hover:bg-white focus:bg-white transition"
            />
          </div>

          {/* Branch Filter (Scoped to active branch) */}
          <CompactSelect
            value={activeBranch}
            onChange={() => {}}
            options={branchOptions}
            placeholder={activeBranch || "Branch"}
            maxHeight="max-h-48"
          />

          {/* Course Filter */}
          <CompactSelect
            value={branchCourseFilter}
            onChange={setBranchCourseFilter}
            options={allCourses}
            placeholder="All Courses"
            maxHeight="max-h-48"
          />
        </div>
      </div>

      {/* Students Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead className="bg-[#081d3d] text-white uppercase text-[10px] tracking-wider font-black">
              <tr>
                <th className="py-3 px-4">Student Details</th>
                <th className="py-3 px-3">Parent & Contact</th>
                <th className="py-3 px-3">Branch</th>
                <th className="py-3 px-3">Course & Level</th>
                <th className="py-3 px-3">Fee Status</th>
                <th className="py-3 px-4 text-center">Documents</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No students currently enrolled matching your criteria under {activeBranch}.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, idx) => {
                  const isPaid = student.feePaymentType === 'Paid' || student.feePaymentType === 'Pay Now';
                  return (
                    <tr key={student.userId || idx} className="hover:bg-slate-50/80 transition">
                      {/* Student Details */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <StudentAvatar
                            student={student}
                            index={idx}
                            className="w-9 h-9"
                            onClick={() => setViewingAdmissionStudent(student)}
                            title={`View Admission Form for ${student.studentName || 'Student'}`}
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 capitalize text-xs">
                                {student.studentName || 'Student Name'}
                              </span>
                              {setEditingStudent && (
                                <button
                                  type="button"
                                  onClick={() => setEditingStudent(student)}
                                  className="text-slate-400 hover:text-sky-700 transition"
                                  title="Edit Student"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                              )}
                              {handleDeleteStudent && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteStudent(student.userId, student.studentName)}
                                  className="text-slate-400 hover:text-rose-600 transition"
                                  title="Delete Student"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <span className="font-bold text-sky-700">{student.registerNumber || student.userId}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Parent & Contact */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="text-slate-800 font-semibold">{student.parentName || student.fatherName || 'Guardian'}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>{student.phone || '98400 00000'}</span>
                        </div>
                      </td>

                      {/* Branch */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                          {student.branch || student.institution || activeBranch || 'Branch'}
                        </span>
                      </td>

                      {/* Course & Level */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{student.program || student.courseName || 'Course'}</div>
                        <div className="text-[10px] font-black text-amber-700 mt-0.5 uppercase tracking-wide">
                          {student.grade || student.studentClass || 'Level 1'}
                        </div>
                      </td>

                      {/* Fee Status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          isPaid
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {isPaid ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-amber-600" />}
                          <span>{student.feeAmount || '₹500'} • {isPaid ? 'PAID' : 'PENDING'}</span>
                        </span>
                      </td>

                      {/* Documents Actions (2x2 grid matching Screenshot) */}
                      <td className="py-3 px-3 text-center">
                        <div className="grid grid-cols-2 gap-1.5 w-[210px] mx-auto">
                          <button
                            type="button"
                            onClick={() => setViewingAdmissionStudent(student)}
                            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 hover:border-emerald-300 font-bold rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap"
                            title="View Admission Form"
                          >
                            <GraduationCap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Admission</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenReceiptForStudent?.(student)}
                            className="px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 hover:border-sky-300 font-bold rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap"
                            title="View Fee Receipt"
                          >
                            <Receipt className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                            <span>Receipt</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEventRegForStudent?.(student)}
                            className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 hover:border-purple-300 font-bold rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap"
                            title="View Event Registration"
                          >
                            <Ticket className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                            <span>Event</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenQuestionPaperForStudent?.(student)}
                            className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 hover:border-amber-300 font-bold rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap"
                            title="View Question Paper"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>Qn Paper</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
