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
  Trash2,
  FileDown,
  Printer,
  Download
} from 'lucide-react';
import CompactSelect from '../../components/CompactSelect';
import StudentAvatar from '../../components/StudentAvatar';
import { updateUserProfile } from '../../utils/authStorage';

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
  handleDeleteStudent,
  // Merge as PDF props
  isMergeMode = false,
  setIsMergeMode = () => {},
  selectedStudentIds = [],
  handleToggleMergeMode = () => {},
  handleToggleSelectAll = () => {},
  handleToggleSelectStudent = () => {},
  handleStartMergeSelected = () => {},
  setViewingMergedPdfStudent = () => {},
  showToast = () => {}
}) {
  // Course filter state
  const [branchCourseFilter, setBranchCourseFilter] = useState('All');

  // Category filter state (Individual, Academy, Franchise)
  const [branchCategoryFilter, setBranchCategoryFilter] = useState('All');

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

  // Category options: Individual, Academy, Franchise
  const categoryOptions = useMemo(() => [
    { value: 'All', label: 'All Categories' },
    { value: 'Individual', label: 'Individual' },
    { value: 'Academy', label: 'Academy' },
    { value: 'Franchise', label: 'Franchise' }
  ], []);

  const getStudentCategory = (student) => {
    const cat = (student.admissionCategory || student.category || student.channel || '').toLowerCase();
    const inst = (student.institution || '').toLowerCase();
    const branch = (student.branch || '').toLowerCase();

    if (cat.includes('academy') || inst.includes('academy') || inst.includes('tuition')) {
      return 'Academy';
    }
    if (cat.includes('franchise') || cat.includes('branch') || branch.includes('regional branch') || branch.includes('franchise') || inst.includes('regional branch')) {
      return 'Franchise';
    }
    return 'Individual';
  };

  const getCategoryBadge = (student) => {
    const category = getStudentCategory(student);
    if (category === 'Academy') {
      return { label: 'Academy', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
    if (category === 'Franchise') {
      return { label: 'Franchise', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
    }
    return { label: 'Individual', bg: 'bg-sky-50 text-sky-700 border-sky-200' };
  };

  // Filter students based on course & category (search is handled upstream or fallback here)
  const filteredStudents = useMemo(() => {
    return (branchStudents || []).filter(student => {
      // Course filter
      if (branchCourseFilter && branchCourseFilter !== 'All') {
        const prog = (student.program || student.courseName || '').toLowerCase();
        if (!prog.includes(branchCourseFilter.toLowerCase())) return false;
      }

      // Category filter (Individual, Academy, Franchise)
      if (branchCategoryFilter && branchCategoryFilter !== 'All') {
        const studentCat = getStudentCategory(student);
        if (studentCat !== branchCategoryFilter) return false;
      }

      return true;
    });
  }, [branchStudents, branchCourseFilter, branchCategoryFilter]);

  // Handle select all for current view
  const onToggleSelectAll = () => {
    const visibleIds = filteredStudents.map(s => s.userId);
    const allSelected = visibleIds.length > 0 && visibleIds.every(id => selectedStudentIds.includes(id));
    if (allSelected) {
      visibleIds.forEach(id => {
        if (selectedStudentIds.includes(id)) {
          handleToggleSelectStudent(id);
        }
      });
    } else {
      visibleIds.forEach(id => {
        if (!selectedStudentIds.includes(id)) {
          handleToggleSelectStudent(id);
        }
      });
    }
  };

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
              Monitoring all student enrollments under <span className="font-bold text-sky-700">{activeBranch}</span> and official B★SEL register numbers.
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
            <button
              type="button"
              onClick={handleToggleMergeMode}
              className={`w-full sm:w-auto px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-95 ${
                isMergeMode
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 ring-2 ring-amber-300 font-black'
                  : 'bg-[#0c234b] hover:bg-[#153a77] text-white border border-slate-700'
              }`}
            >
              <FileDown className="w-3.5 h-3.5 text-amber-400" />
              <span>{isMergeMode ? 'Close Merge' : 'Merge as PDF'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAddStudentModal(true)}
              className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
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
              className="w-full pl-8 pr-2.5 py-2 text-xs border border-slate-200 rounded-lg focus:border-sky-500 focus:ring-1 focus:ring-sky-100 outline-none bg-slate-50/50 hover:bg-white focus:bg-white transition"
            />
          </div>

          {/* Category Filter: Individual, Academy, Franchise */}
          <CompactSelect
            value={branchCategoryFilter}
            onChange={setBranchCategoryFilter}
            options={categoryOptions}
            placeholder="All Categories"
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

      {/* Merge as PDF Selection Action Banner */}
      {isMergeMode && (
        <div className="bg-gradient-to-r from-[#081d3d] to-[#123068] text-white p-3.5 rounded-2xl border border-amber-400/40 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-3 flex-wrap">
            <label className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl cursor-pointer transition select-none border border-white/10">
              <input
                type="checkbox"
                checked={filteredStudents.length > 0 && filteredStudents.every(s => selectedStudentIds.includes(s.userId))}
                onChange={onToggleSelectAll}
                className="w-4 h-4 rounded cursor-pointer accent-amber-400"
              />
              <span className="text-xs font-bold text-amber-300">
                Select All ({filteredStudents.length})
              </span>
            </label>
            <div className="text-xs font-medium text-slate-200">
              <span className="font-black text-amber-400">{selectedStudentIds.length}</span> of {filteredStudents.length} candidate(s) selected
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => {
                setIsMergeMode(false);
              }}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={selectedStudentIds.length === 0}
              onClick={handleStartMergeSelected}
              className="px-4 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs transition flex items-center gap-1.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Download Merged PDF ({selectedStudentIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Students Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Mobile Horizontal Scroll Cue */}
        <div className="lg:hidden flex items-center justify-between px-3.5 py-2 bg-gradient-to-r from-sky-50 to-indigo-50/50 border-b border-sky-100 text-[11px] text-sky-900 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="text-sky-600 font-bold">⇄</span> Swipe table to view Event & Question Paper
          </span>
          <span className="text-[10px] font-bold bg-white text-sky-700 px-2 py-0.5 rounded-full border border-sky-200 shrink-0">
            {filteredStudents.length} Students
          </span>
        </div>

        <div className="w-full overflow-x-auto admin-table-container">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead className="bg-[#081d3d] text-white uppercase text-[10px] tracking-wider font-black">
              <tr>
                {isMergeMode && (
                  <th className="py-3 px-3 w-12 text-center">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={filteredStudents.length > 0 && filteredStudents.every(s => selectedStudentIds.includes(s.userId))}
                        onChange={onToggleSelectAll}
                        className="w-4 h-4 rounded cursor-pointer accent-amber-400"
                        title="Select All Students"
                      />
                    </div>
                  </th>
                )}
                <th className="py-3 px-4 sticky left-0 bg-[#081d3d] z-20 shadow-[2px_0_5px_rgba(0,0,0,0.15)]">Student Details</th>
                <th className="py-3 px-3">Parent & Contact</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Course & Level</th>
                <th className="py-3 px-3 text-center">Event Registration</th>
                <th className="py-3 px-3 text-center">Question Paper</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={isMergeMode ? 7 : 6} className="py-8 text-center text-slate-500">
                    No students currently enrolled matching your criteria under {activeBranch}.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, idx) => {
                  const isSelected = selectedStudentIds.includes(student.userId);
                  return (
                    <tr
                      key={student.userId || idx}
                      onClick={(e) => {
                        if (isMergeMode && !['BUTTON', 'A', 'INPUT', 'SVG', 'PATH'].includes(e.target.tagName)) {
                          handleToggleSelectStudent(student.userId);
                        }
                      }}
                      className={`hover:bg-slate-50/80 transition group ${isMergeMode ? 'cursor-pointer' : ''} ${
                        isSelected ? 'bg-amber-50/60 hover:bg-amber-50' : ''
                      }`}
                    >
                      {isMergeMode && (
                        <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectStudent(student.userId)}
                            className="w-4 h-4 rounded cursor-pointer accent-amber-400"
                          />
                        </td>
                      )}

                      {/* Student Details (Sticky column for optimal mobile orientation) */}
                      <td className="py-3 px-4 sticky left-0 bg-white z-10 shadow-[2px_0_6px_-2px_rgba(0,0,0,0.06)] group-hover:bg-slate-50 transition">
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
                                  className="text-slate-400 hover:text-sky-700 transition cursor-pointer"
                                  title="Edit Student"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                              )}
                              {handleDeleteStudent && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteStudent(student.userId, student.studentName)}
                                  className="text-slate-400 hover:text-rose-600 transition cursor-pointer"
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

                      {/* Category */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border shadow-2xs ${getCategoryBadge(student).bg}`}>
                          {getCategoryBadge(student).label}
                        </span>
                      </td>

                      {/* Course & Level */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{student.program || student.courseName || 'Course'}</div>
                        <div className="text-[10px] font-black text-amber-700 mt-0.5 uppercase tracking-wide">
                          {student.grade || student.studentClass || 'Level 1'}
                        </div>
                      </td>

                      {/* Event Registration Column */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="inline-flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEventRegForStudent?.(student)}
                            className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 hover:border-purple-300 font-bold rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap active:scale-95"
                            title="View Event Registration"
                          >
                            <Ticket className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                            <span>Event</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEventRegForStudent?.(student)}
                            className="p-1.5 bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-purple-700 border border-slate-200 hover:border-purple-300 rounded-lg transition cursor-pointer shadow-2xs active:scale-95"
                            title="Print Event Slip"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEventRegForStudent?.(student)}
                            className="p-1.5 bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-purple-700 border border-slate-200 hover:border-purple-300 rounded-lg transition cursor-pointer shadow-2xs active:scale-95"
                            title="Download Event Slip"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Question Paper Column */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="inline-flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenQuestionPaperForStudent?.(student)}
                            className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 hover:border-amber-300 font-bold rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap active:scale-95"
                            title="View Question Paper"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>Qn Paper</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenQuestionPaperForStudent?.(student)}
                            className="p-1.5 bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-800 border border-slate-200 hover:border-amber-300 rounded-lg transition cursor-pointer shadow-2xs active:scale-95"
                            title="Print Question Paper"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenQuestionPaperForStudent?.(student)}
                            className="p-1.5 bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-800 border border-slate-200 hover:border-amber-300 rounded-lg transition cursor-pointer shadow-2xs active:scale-95"
                            title="Download Question Paper PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
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
