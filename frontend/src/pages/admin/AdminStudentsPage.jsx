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
  Receipt
} from 'lucide-react';
import StudentAvatar from '../../components/StudentAvatar';
import { updateUserProfile } from '../../utils/authStorage';
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
  handleStartDocumentMerge,
  handleOpenMarksheet,
  handleOpenCertForStudent,
  handleOpenReceiptForStudent,
  handleOpenEventRegForStudent,
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
    { value: 'Paid', label: 'Approved' },
    { value: 'Pending', label: 'Pending' }
  ], []);
  return (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Header & Filter Controls */}
            <div className="bg-white p-3.5 sm:p-4.5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-950 flex items-center gap-2">
                    <Users className="w-5 h-5 text-sky-600 shrink-0" />
                    <span>Central Student Registration Monitor</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Monitoring all student enrollments across regional branches, fee status, and official B★SEL register numbers.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setShowAddStudentModal(true)}
                    className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4 shrink-0" />
                    <span className="truncate">Register Student</span>
                  </button>
                  {!isMergeMode ? (
                    <button
                      type="button"
                      onClick={handleToggleMergeMode}
                      className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-[#081d3d] hover:bg-[#123068] text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
                    >
                      <FileDown className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="truncate">Merge PDFs</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleToggleMergeMode}
                      className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
                    >
                      <span className="truncate">Close Merge</span>
                    </button>
                  )}
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
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
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
                  onClick={() => handleStartDocumentMerge?.('admission')}
                  className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition flex items-center gap-1.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Admission Form PDF</span>
                  </button>
                  <button
                  type="button"
                  disabled={selectedStudentIds.length === 0}
                  onClick={() => handleStartDocumentMerge?.('receipt')}
                  className="px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-xl text-xs transition flex items-center gap-1.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Receipt PDF</span>
                  </button>
                </div>
              </div>
            )}
            {/* Students Roster (Simple Mobile Cards on Mobile, Full Table on Desktop) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              
              {/* MOBILE VIEW (lg:hidden): Clean, Simple Vertical Card List (No horizontal swipe) */}
              <div className="lg:hidden divide-y divide-slate-100">
                <div className="flex items-center justify-between px-3.5 py-2.5 bg-gradient-to-r from-sky-50 to-indigo-50/50 border-b border-sky-100 text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                    Student Candidates
                  </span>
                  <span className="text-[10px] font-black bg-white text-sky-800 px-2.5 py-0.5 rounded-full border border-sky-200 shadow-2xs">
                    {filteredStudentsSuperAdmin.length} Enrolled
                  </span>
                </div>

                {filteredStudentsSuperAdmin.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500">
                    No students matching your filter criteria.
                  </div>
                ) : (
                  filteredStudentsSuperAdmin.map((student, idx) => {
                    const isSelected = selectedStudentIds.includes(student.userId);
                    const isPaid = student.feePaymentType === 'Paid' || student.feePaymentType === 'Pay Now' || student.feePaymentType === 'Approved';
                    const formattedFee = student.feeAmount 
                      ? (String(student.feeAmount).trim().startsWith('₹') ? String(student.feeAmount).trim() : `₹${String(student.feeAmount).trim()}`)
                      : '₹450';

                    return (
                      <div
                        key={student.userId || idx}
                        onClick={() => {
                          if (isMergeMode) {
                            handleToggleSelectStudent(student.userId);
                          }
                        }}
                        className={`p-3 transition border-b border-slate-100 last:border-b-0 ${
                          isMergeMode ? 'cursor-pointer' : ''
                        } ${
                          isSelected ? 'bg-amber-50/90 border-l-4 border-l-amber-500' : 'hover:bg-slate-50/80'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2.5">
                          {/* Left: Avatar + Details */}
                          <div className="flex items-start gap-2.5 min-w-0 flex-1">
                            {isMergeMode && (
                              <div onClick={(e) => e.stopPropagation()} className="shrink-0 mt-1">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleToggleSelectStudent(student.userId)}
                                  className="w-4 h-4 rounded cursor-pointer accent-amber-500"
                                />
                              </div>
                            )}

                            <StudentAvatar
                              student={student}
                              index={idx}
                              className="w-10 h-10 shrink-0 mt-0.5"
                              onClick={() => setViewingAdmissionStudent(student)}
                              title={`View Admission Form for ${student.studentName || 'Student'}`}
                            />

                            <div className="min-w-0 flex-1 space-y-0.5">
                              {/* Row 1: Student Name + Reg Badge + Branch */}
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-slate-950 text-xs capitalize">
                                  {student.studentName || 'Student Name'}
                                </span>
                                <span className="font-mono text-[9.5px] font-black text-sky-800 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200 shrink-0">
                                  {student.registerNumber || student.userId}
                                </span>
                                <span className="text-[10px] font-semibold text-slate-500 shrink-0">
                                  • {student.branch || student.institution || 'Tamil Nadu'}
                                </span>
                              </div>

                              {/* Row 2: Course Name (Full course name, no cutoff) */}
                              <div className="text-[11px] font-semibold text-slate-800 leading-snug break-words">
                                {student.program || student.courseName || 'Abacus'}
                              </div>

                              {/* Row 3: Phone Number (Fully Visible) */}
                              {student.phone && (
                                <div className="text-[10.5px] text-slate-600 flex items-center gap-1 pt-0.5">
                                  <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                                  <span className="font-medium text-slate-800 tracking-wide select-all">{student.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right: Stacked Matching Action Buttons */}
                          <div className="flex flex-col gap-1.5 shrink-0 w-24 pt-0.5" onClick={(e) => e.stopPropagation()}>
                            {/* Admission Form Button */}
                            <button
                              type="button"
                              onClick={() => setViewingAdmissionStudent(student)}
                              className="w-full py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-black rounded-lg text-[10.5px] transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs active:scale-95"
                              title="View Admission Form"
                            >
                              <GraduationCap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>Admission</span>
                            </button>

                            {/* Fee Receipt / Pay Button */}
                            {isPaid ? (
                              <button
                                type="button"
                                onClick={() => handleOpenReceiptForStudent?.(student)}
                                className="w-full py-1.5 px-2 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-black rounded-lg text-[10.5px] transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs active:scale-95"
                                title="View Official Fee Receipt"
                              >
                                <Receipt className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                                <span>Receipt</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  const newReceipt = `RCP-DESK-${Math.floor(100000 + Math.random() * 900000)}`;
                                  updateUserProfile(student.userId, { 
                                    feePaymentType: 'Approved',
                                    receiptRefNo: (student.receiptRefNo && !student.receiptRefNo.includes('PAY-LATER')) ? student.receiptRefNo : newReceipt
                                  });
                                }}
                                className="w-full py-1.5 px-2 bg-amber-50 hover:bg-emerald-100 text-amber-800 hover:text-emerald-900 border border-amber-300 hover:border-emerald-300 font-black rounded-lg text-[10.5px] transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs active:scale-95"
                                title="Approve Fee Payment"
                              >
                                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                <span>Pay Later</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* DESKTOP VIEW (hidden lg:block): Full Wide Roster Table */}
              <div className="hidden lg:block w-full overflow-x-auto admin-table-container">
                <table className="w-full text-left text-xs min-w-[760px]">
                  <thead className="bg-[#081d3d] text-white uppercase text-[10px] tracking-wider font-black">
                    <tr>
                      {isMergeMode && (
                        <th className="py-3 px-3 w-12 text-center sticky left-0 bg-[#081d3d] z-30 shadow-[2px_0_5px_rgba(0,0,0,0.15)]">
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
                      <th className={`py-3 px-4 sticky ${isMergeMode ? 'left-12' : 'left-0'} bg-[#081d3d] z-20 shadow-[2px_0_5px_rgba(0,0,0,0.15)]`}>Student Details</th>
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
                          className={`transition group ${isMergeMode ? 'cursor-pointer' : ''} ${
                            isSelected ? 'bg-amber-50/90 border-l-4 border-l-amber-500' : 'hover:bg-slate-50/80'
                          }`}
                        >
                          {isMergeMode && (
                            <td
                              className={`py-3 px-3 text-center sticky left-0 z-20 transition ${
                                isSelected ? 'bg-amber-50/90' : 'bg-white'
                              } group-hover:bg-slate-50`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelectStudent(student.userId)}
                                className="w-4 h-4 rounded cursor-pointer accent-amber-500"
                                title={`Select ${student.studentName}`}
                              />
                            </td>
                          )}

                          {/* Student Details (Sticky) */}
                          <td
                            className={`py-3 px-4 sticky ${
                              isMergeMode ? 'left-12' : 'left-0'
                            } z-10 shadow-[2px_0_6px_-2px_rgba(0,0,0,0.06)] transition ${
                              isSelected ? 'bg-amber-50/90' : 'bg-white'
                            } group-hover:bg-slate-50`}
                          >
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
                              const isPaid = student.feePaymentType === 'Paid' || student.feePaymentType === 'Pay Now' || student.feePaymentType === 'Approved';
                              const formattedFee = student.feeAmount 
                                ? (String(student.feeAmount).trim().startsWith('₹') ? String(student.feeAmount).trim() : `₹${String(student.feeAmount).trim()}`)
                                : '₹450';
                              return (
                                <div className="flex flex-col items-start gap-1">
                                  {isPaid ? (
                                    <span
                                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs select-none"
                                      title="Fee Verified & Approved"
                                    >
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      <span>{formattedFee} • APPROVED</span>
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newReceipt = `RCP-DESK-${Math.floor(100000 + Math.random() * 900000)}`;
                                        updateUserProfile(student.userId, { 
                                          feePaymentType: 'Approved',
                                          receiptRefNo: (student.receiptRefNo && !student.receiptRefNo.includes('PAY-LATER')) ? student.receiptRefNo : newReceipt
                                        });
                                      }}
                                      title="Click to Approve Fee Payment (Pay Later)"
                                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase transition cursor-pointer bg-amber-50 text-amber-700 border border-amber-300 hover:bg-emerald-100 hover:text-emerald-800 hover:border-emerald-300 shadow-2xs group"
                                    >
                                      <Clock className="w-3 h-3 text-amber-600 group-hover:text-emerald-700" />
                                      <span>{formattedFee} • PENDING</span>
                                      <span className="text-[9px] font-bold text-amber-800 group-hover:text-emerald-800 ml-0.5 underline">Approve</span>
                                    </button>
                                  )}

                                  {/* Fee Receipt Under Fee Status (Only if Approved) */}
                                  {isPaid && (
                                    <button
                                      type="button"
                                      onClick={() => handleOpenReceiptForStudent?.(student)}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-50 hover:bg-sky-100 text-sky-800 hover:text-sky-950 border border-sky-200 hover:border-sky-300 font-bold rounded text-[10.5px] transition cursor-pointer shadow-2xs"
                                      title="View Official Fee Receipt"
                                    >
                                      <Receipt className="w-3 h-3 text-sky-600 shrink-0" />
                                      <span>Fee Receipt</span>
                                    </button>
                                  )}
                                </div>
                              );
                            })()}
                          </td>

                          {/* Documents */}
                          <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setViewingAdmissionStudent(student)}
                                className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 hover:border-emerald-300 font-bold rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap"
                                title="View Admission Form"
                              >
                                <GraduationCap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>Admission</span>
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
