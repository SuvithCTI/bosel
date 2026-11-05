import React from 'react';
import {
  Users,
  FileDown,
  Plus,
  Search,
  Phone,
  CheckCircle2,
  GraduationCap,
  FileText,
  Award,
  Receipt,
  Ticket,
  FileSpreadsheet
} from 'lucide-react';
import {
  getStudentPhotoUrl,
  getStudentRegisterNumber
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
  setShowAddStudentModal
}) {
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
                  {/* Merge as PDF button placed near Register New Student */}
                  <button
                    type="button"
                    onClick={handleToggleMergeMode}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer border ${
                      isMergeMode
                        ? 'bg-[#081d3d] text-white border-amber-400 ring-2 ring-amber-400/30'
                        : 'bg-white text-slate-800 hover:bg-slate-50 border-slate-300'
                    }`}
                    title="Select students to merge Certificate and Marksheet into PDF"
                  >
                    <FileDown className={`w-4 h-4 ${isMergeMode ? 'text-amber-300' : 'text-sky-600'}`} />
                    <span>Merge as PDF</span>
                    {selectedStudentIds.length > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 bg-amber-400 text-slate-950 rounded-full text-[10px] font-black">
                        {selectedStudentIds.length}
                      </span>
                    )}
                  </button>

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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Search candidate name, ID, phone..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-sky-600 outline-none"
                  />
                </div>

                {/* Branch Filter */}
                <select
                  value={studentBranchFilter}
                  onChange={(e) => setStudentBranchFilter(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-sky-600 outline-none cursor-pointer bg-white"
                >
                  <option value="All">All Branches</option>
                  <option value="Tenkasi">Tenkasi Regional Branch</option>
                  <option value="Chennai">Chennai Central Branch</option>
                  <option value="Coimbatore">Coimbatore Branch</option>
                </select>

                {/* Course Filter */}
                <select
                  value={studentCourseFilter}
                  onChange={(e) => setStudentCourseFilter(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-sky-600 outline-none cursor-pointer bg-white"
                >
                  <option value="All">All Courses</option>
                  <option value="Abacus">Abacus</option>
                  <option value="Drawing">Drawing & Art</option>
                  <option value="Handwriting">Handwriting</option>
                  <option value="Python">Python Coding</option>
                  <option value="AI">AI & Prompt</option>
                  <option value="Canva">Canva Design</option>
                </select>

                {/* Fee Status Filter */}
                <select
                  value={studentPaymentFilter}
                  onChange={(e) => setStudentPaymentFilter(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-sky-600 outline-none cursor-pointer bg-white"
                >
                  <option value="All">All Fee Statuses</option>
                  <option value="Paid">Fee Paid / Verified</option>
                  <option value="Pending">Fee Pending</option>
                </select>
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
              <div className="overflow-x-auto">
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
                      <th className="py-3 px-3">Concern Branch</th>
                      <th className="py-3 px-3">Course & Level</th>
                      <th className="py-3 px-3">Fee Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
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
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {/* Student Passport Photo Thumbnail */}
                              <div 
                                onClick={() => setViewingAdmissionStudent(student)}
                                className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden border-2 border-amber-400/90 shadow-xs shrink-0 bg-slate-100 cursor-pointer hover:border-amber-500 hover:scale-105 transition group"
                                title="Click to view official admission form"
                              >
                                <img
                                  src={getStudentPhotoUrl(student, idx)}
                                  alt={student.studentName}
                                  className="w-full h-full object-cover object-top"
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="font-extrabold text-slate-900 capitalize truncate">{student.studentName || 'Student Name'}</div>
                                <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                                  <span className="font-mono font-bold text-sky-800">{student.registerNumber || student.userId}</span>
                                  <span>•</span>
                                  <span>ID: {student.userId}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <div className="text-slate-800 font-semibold">{student.parentName || 'Guardian'}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                              <Phone className="w-3 h-3 text-emerald-600" />
                              <span>{student.phone || '98400 00000'}</span>
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black bg-blue-50 text-blue-900 border border-blue-200">
                              {student.branch || student.institution || 'Tenkasi Branch'}
                            </span>
                          </td>

                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">{student.program || student.courseName || 'Abacus'}</div>
                            <div className="text-[10px] font-black text-amber-700 mt-0.5 uppercase tracking-wide">
                              {student.grade || 'Level 1'}
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              student.feePaymentType === 'Paid' || student.feePaymentType === 'Pay Now'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{student.feeAmount || '₹450'} • {student.feePaymentType === 'Paid' ? 'Paid' : 'Pending'}</span>
                            </span>
                          </td>

                          <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5 flex-wrap sm:flex-nowrap">
                              {/* Admission Form Button */}
                              <button
                                type="button"
                                onClick={() => setViewingAdmissionStudent(student)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-lg text-[10px] transition cursor-pointer flex items-center gap-1 shadow-xs"
                                title="View & Print Official Admission Form"
                              >
                                <GraduationCap className="w-3 h-3 text-emerald-200" />
                                <span>Admission Form</span>
                              </button>

                              {/* Receipt Button */}
                              <button
                                type="button"
                                onClick={() => handleOpenReceiptForStudent ? handleOpenReceiptForStudent(student) : null}
                                className="px-2.5 py-1 bg-sky-700 hover:bg-sky-800 text-white font-black rounded-lg text-[10px] transition cursor-pointer flex items-center gap-1 shadow-xs"
                                title="View & Print Official Fee Receipt"
                              >
                                <Receipt className="w-3 h-3 text-sky-200" />
                                <span>Receipt</span>
                              </button>

                              {/* Event Registration Button */}
                              <button
                                type="button"
                                onClick={() => handleOpenEventRegForStudent ? handleOpenEventRegForStudent(student) : null}
                                className="px-2.5 py-1 bg-purple-700 hover:bg-purple-800 text-white font-black rounded-lg text-[10px] transition cursor-pointer flex items-center gap-1 shadow-xs"
                                title="View & Print Event Registration & Hall Ticket"
                              >
                                <Ticket className="w-3 h-3 text-purple-200" />
                                <span>Event Registration</span>
                              </button>

                              {/* Question Paper Button */}
                              <button
                                type="button"
                                onClick={() => handleOpenQuestionPaperForStudent ? handleOpenQuestionPaperForStudent(student) : null}
                                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-[10px] transition cursor-pointer flex items-center gap-1 shadow-xs"
                                title="View & Print Official Examination Question Paper"
                              >
                                <FileSpreadsheet className="w-3 h-3 text-slate-950" />
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
