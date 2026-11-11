import React, { useMemo } from 'react';
import { getStoredCourses } from '../../data/coursesData';
import { getStoredSchools } from '../../data/schoolsData';
import { getAllDistrictBranches } from '../../data/districtsData';
import CompactSelect from '../../components/CompactSelect';
import {
  Users,
  FileDown,
  Plus,
  Search,
  Phone,
  CheckCircle2,
  Clock,
  GraduationCap,
  FileText,
  Award,
  Receipt,
  Ticket,
  FileSpreadsheet
} from 'lucide-react';
import StudentAvatar from '../../components/StudentAvatar';
import {
  getStudentPhotoUrl,
  getStudentRegisterNumber,
  SAMPLE_STUDENT_PHOTOS
} from '../../utils/studentDataHelpers';
export default function AdminStudentsPage({
  filteredStudentsSuperAdmin,
  isMergeMode,
  selectedStudentIds,
  setIsMergeMode,
  setSelectedStudentIds,
  handleToggleMergeMode,
  handleToggleSelectAll,
  handleToggleSelectStudent,
  handleStartMergeSelected,
  handleOpenMarksheet,
  handleOpenCertForStudent,
  handleOpenReceiptForStudent,
  handleOpenEventRegForStudent,
  handleOpenQuestionPaperForStudent,
  setViewingAdmissionStudent,
  studentSearch,
  setStudentSearch,
  studentBranchFilter,
  setStudentBranchFilter,
  studentCourseFilter,
  setStudentCourseFilter,
  studentPaymentFilter,
  setStudentPaymentFilter,
  setShowAddStudentModal,
  schoolsList = [],
  coursesList = [],
  usersList = []
}) {
  // Comprehensive list of all official courses across B★SEL
  // Comprehensive list of all 16 official courses across B★SEL
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
  // Strictly the 38 Tamil Nadu district names
  const allBranches = useMemo(() => [
    { value: 'All', label: 'All Branches' },
    ...getAllDistrictBranches()
  ], []);
  // Fee status options
  const feeStatusOptions = useMemo(() => [
    { value: 'All', label: 'All Fee Statuses' },
    { value: 'Paid', label: 'Fee Paid / Verified' },
    { value: 'Pending', label: 'Fee Pending' }
  ], []);
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
                    Monitoring all student enrollments across regional branches, fee status, and official B★SEL register numbers.
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1 items-center">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Search candidate, ID, phone..."
                    className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:border-sky-500 focus:ring-1 focus:ring-sky-100 outline-none bg-slate-50/50 hover:bg-white focus:bg-white transition"
                  />
                </div>
                {/* Branch Filter with reduced popup height */}
                <CompactSelect
                  value={studentBranchFilter}
                  onChange={setStudentBranchFilter}
                  options={allBranches}
                  placeholder="All Branches"
                  maxHeight="max-h-48"
                />
                {/* Course Filter with reduced popup height */}
                <CompactSelect
                  value={studentCourseFilter}
                  onChange={setStudentCourseFilter}
                  options={allCourses}
                  placeholder="All Courses"
                  maxHeight="max-h-48"
                />
                {/* Fee Status Filter with reduced popup height */}
                <CompactSelect
                  value={studentPaymentFilter}
                  onChange={setStudentPaymentFilter}
                  options={feeStatusOptions}
                  placeholder="All Fee Statuses"
                  maxHeight="max-h-48"
                />
              </div>
            </div>
            {/* Merge as PDF Selection Action Banner */}
            {isMergeMode && (
              <div className="bg-gradient-to-r from-[#081d3d] to-[#123068] text-white p-3.5 rounded-2xl border border-amber-400/40 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-150">
                <div className="flex items-center gap-3 flex-wrap">
                  <label className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl cursor-pointer transition select-none border border-white/10">
                    <input
                      type="checkbox"
                      checked={filteredStudentsSuperAdmin.length > 0 && filteredStudentsSuperAdmin.every(s => selectedStudentIds.includes(s.userId))}
                      onChange={handleToggleSelectAll}
                      className="w-4 h-4 rounded cursor-pointer accent-amber-400"
                    />
                    <span className="text-xs font-bold text-amber-300">
                      Select All ({filteredStudentsSuperAdmin.length})
                    </span>
                  </label>
                  <div className="text-xs font-medium text-slate-200">
                    <span className="font-black text-amber-400">{selectedStudentIds.length}</span> of {filteredStudentsSuperAdmin.length} candidate(s) selected
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMergeMode(false);
                      setSelectedStudentIds([]);
                    }}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={selectedStudentIds.length === 0}
                    onClick={handleStartMergeSelected}
                    className="px-4 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs transition flex items-center gap-1.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Download Merged PDF ({selectedStudentIds.length})</span>
                  </button>
                </div>
              </div>
            )}
                                    {/* Students Roster Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="w-full overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#081d3d] text-white uppercase text-[10px] tracking-wider font-black">
                    <tr>
                      {isMergeMode && (
                        <th className="py-3 px-3 w-12 text-center">
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={filteredStudentsSuperAdmin.length > 0 && filteredStudentsSuperAdmin.every(s => selectedStudentIds.includes(s.userId))}
                              onChange={handleToggleSelectAll}
                              className="w-4 h-4 rounded cursor-pointer accent-amber-400"
                              title="Select All Students"
                            />
                          </div>
                        </th>
                      )}
                      <th className="py-3 px-4">Student Details</th>
                      <th className="py-3 px-3">Parent & Contact</th>
                      <th className="py-3 px-3">Branch</th>
                      <th className="py-3 px-3">Course & Level</th>
                      <th className="py-3 px-3">Fee Status</th>
                      <th className="py-3 px-4 text-center">Documents</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredStudentsSuperAdmin.length === 0 ? (
                      <tr>
                        <td colSpan={isMergeMode ? 7 : 6} className="py-8 text-center text-slate-500">
                          No students matching your filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredStudentsSuperAdmin.map((student, idx) => {
                        const isSelected = selectedStudentIds.includes(student.userId);
                        return (
                        <tr
                          key={student.userId}
                          onClick={(e) => {
                            if (isMergeMode && !['BUTTON', 'A', 'INPUT', 'SVG', 'PATH'].includes(e.target.tagName)) {
                              handleToggleSelectStudent(student.userId);
                            }
                          }}
                          className={`transition ${isMergeMode ? 'cursor-pointer' : ''} ${
                            isSelected ? 'bg-amber-50/90 border-l-4 border-l-amber-500' : 'hover:bg-slate-50/80'
                          }`}
                        >
                          {isMergeMode && (
                            <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelectStudent(student.userId)}
                                className="w-4 h-4 rounded cursor-pointer accent-amber-500"
                                title={`Select ${student.studentName}`}
                              />
                            </td>
                          )}

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
                                <div className="font-bold text-slate-900 capitalize text-xs">{student.studentName || 'Student Name'}</div>
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
                              {student.branch || student.institution || 'Tenkasi'}
                            </span>
                          </td>

                          {/* Course & Level */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <div className="font-bold text-slate-900">{student.program || student.courseName || 'Abacus'}</div>
                            <div className="text-[10px] font-black text-amber-700 mt-0.5 uppercase tracking-wide">
                              {student.grade || student.studentClass || 'Level 1'}
                            </div>
                          </td>

                          {/* Fee Status */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            {(() => {
                              const isPaid = student.feePaymentType === 'Paid' || student.feePaymentType === 'Pay Now';
                              return (
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                  isPaid
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}>
                                  {isPaid ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-amber-600" />}
                                  <span>{student.feeAmount || '₹500'} • {isPaid ? 'PAID' : 'PENDING'}</span>
                                </span>
                              );
                            })()}
                          </td>

                          {/* Documents Actions (2 Columns, Increased Button Size) */}
                          <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
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
