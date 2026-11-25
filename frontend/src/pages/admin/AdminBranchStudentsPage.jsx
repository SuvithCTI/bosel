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
  School,
  Paperclip
} from 'lucide-react';
import CompactSelect from '../../components/CompactSelect';
import StudentAvatar from '../../components/StudentAvatar';
import { updateUserProfile } from '../../utils/authStorage';
import { isStudentUser } from '../../utils/studentValidator';
import { ACADEMIC_STAGES, getAcademicStageFromAge } from '../../utils/academicStages';
import {
  getStudentScopeKey,
  readStudentUploadedQuestions,
} from '../../utils/studentDataHelpers';

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

  // Category filter state (Branch, Academy, School)
  const [branchCategoryFilter, setBranchCategoryFilter] = useState('All');

  // Class filter state
  const [branchClassFilter, setBranchClassFilter] = useState('All');

  // Level filter state
  const [branchLevelFilter, setBranchLevelFilter] = useState('All');

  // Category options: Branch, Academy, School
  const categoryOptions = useMemo(() => [
    { value: 'All', label: 'All Categories' },
    { value: 'Branch', label: 'Branch' },
    { value: 'Academy', label: 'Academy' },
    { value: 'School', label: 'School' }
  ], []);

  // Official 14 courses for filtering
  const allCourses = useMemo(() => [
    { value: 'All', label: 'All Courses' },
    { value: 'ABACUS SPEED ARITHMETIC', label: 'ABACUS SPEED ARITHMETIC', keywords: ['abacus'] },
    { value: 'CALLIGRAPHY & HANDWRITING MASTERY', label: 'CALLIGRAPHY & HANDWRITING MASTERY', keywords: ['handwriting', 'calligraphy'] },
    { value: 'EARLY PHONICS & READING MASTERY', label: 'EARLY PHONICS & READING MASTERY', keywords: ['phonics', 'reading'] },
    { value: 'CREATIVE DRAWING & VISUAL ARTS', label: 'CREATIVE DRAWING & VISUAL ARTS', keywords: ['drawing', 'visual arts', 'art'] },
    { value: 'COGNITIVE MEMORY & RECALL MASTERY', label: 'COGNITIVE MEMORY & RECALL MASTERY', keywords: ['memory', 'cognitive'] },
    { value: 'CLASSICAL BHARATANATYAM DANCE', label: 'CLASSICAL BHARATANATYAM DANCE', keywords: ['bharatanatyam', 'dance'] },
    { value: 'MICROSOFT OFFICE PRODUCTIVITY SUITE', label: 'MICROSOFT OFFICE PRODUCTIVITY SUITE', keywords: ['office', 'ms office', 'word', 'excel'] },
    { value: 'HTML5 WEBPAGE ARCHITECTURE', label: 'HTML5 WEBPAGE ARCHITECTURE', keywords: ['html'] },
    { value: 'CSS3 STYLING, FLEXBOX, GRID & ANIMATIONS', label: 'CSS3 STYLING, FLEXBOX, GRID & ANIMATIONS', keywords: ['css'] },
    { value: 'PYTHON PROGRAMMING & LOGICAL THINKING', label: 'PYTHON PROGRAMMING & LOGICAL THINKING', keywords: ['python'] },
    { value: 'COMPUTER HARDWARE & DIGITAL LITERACY', label: 'COMPUTER HARDWARE & DIGITAL LITERACY', keywords: ['computer', 'hardware'] },
    { value: 'ADOBE PHOTOSHOP & DIGITAL IMAGING', label: 'ADOBE PHOTOSHOP & DIGITAL IMAGING', keywords: ['photoshop'] },
    { value: 'ARTIFICIAL INTELLIGENCE & PRODUCTIVITY', label: 'ARTIFICIAL INTELLIGENCE & PRODUCTIVITY', keywords: ['artificial intelligence', 'ai'] },
    { value: 'CANVA VISUAL DESIGN & BRANDING', label: 'CANVA VISUAL DESIGN & BRANDING', keywords: ['canva'] }
  ], []);

  // Class options: Clean class names only
  const classOptions = useMemo(() => [
    { value: 'All', label: 'All Classes' },
    ...ACADEMIC_STAGES.map((s) => ({
      value: s.className,
      label: s.className,
      stage: s.stage
    }))
  ], []);

  // Level options: Level 1 to Level 9
  const levelOptions = useMemo(() => [
    { value: 'All', label: 'All Levels' },
    { value: 'level_1', label: 'Level 1' },
    { value: 'level_2', label: 'Level 2' },
    { value: 'level_3', label: 'Level 3' },
    { value: 'level_4', label: 'Level 4' },
    { value: 'level_5', label: 'Level 5' },
    { value: 'level_6', label: 'Level 6' },
    { value: 'level_7', label: 'Level 7' },
    { value: 'level_8', label: 'Level 8' },
    { value: 'level_9', label: 'Level 9' }
  ], []);

  // Determine Class and Level Academic Category for any student
  const getStudentAcademicCategory = (student) => {
    if (!student) {
      return {
        className: 'Class 1',
        stage: 'SUB-JUNIOR (Class 1)',
        level: 'Level 1',
        levelNum: 1,
        classBadgeClass: 'bg-amber-50 text-amber-900 border-amber-300',
        levelBadgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300'
      };
    }

    const gradeStr = String(student.grade || student.level || '').trim();

    // 1. Detect Level from grade, level, or selectedCourses
    let level = '';
    let levelNum = null;
    const levelMatch = gradeStr.match(/Level\s*(\d+)/i) || String(student.level || '').match(/Level\s*(\d+)/i);
    if (levelMatch) {
      levelNum = parseInt(levelMatch[1], 10);
      level = `Level ${levelNum}`;
    } else {
      level = 'Level 1';
      levelNum = 1;
    }

    // 2. Match exact Academic Stage from ACADEMIC_STAGES
    let matchedStage = null;

    if (student.studentStage) {
      matchedStage = ACADEMIC_STAGES.find(s => s.stage === student.studentStage || s.label.toLowerCase() === student.studentStage.toLowerCase());
      if (!matchedStage) {
        const stLower = student.studentStage.toLowerCase();
        for (let i = 12; i >= 1; i--) {
          if (stLower.includes(`class ${i}`)) {
            matchedStage = ACADEMIC_STAGES.find(s => s.className === `Class ${i}`);
            if (matchedStage) break;
          }
        }
      }
    }

    if (!matchedStage && student.studentClass) {
      matchedStage = ACADEMIC_STAGES.find(s => s.className.toLowerCase() === student.studentClass.toLowerCase());
    }

    if (!matchedStage && gradeStr) {
      const gLower = gradeStr.toLowerCase();
      if (gLower.includes('12') || gLower.includes('12th')) {
        matchedStage = ACADEMIC_STAGES.find(s => s.className === 'Class 12');
      } else if (gLower.includes('11') || gLower.includes('11th')) {
        matchedStage = ACADEMIC_STAGES.find(s => s.className === 'Class 11');
      } else if (gLower.includes('10') || gLower.includes('10th')) {
        matchedStage = ACADEMIC_STAGES.find(s => s.className === 'Class 10');
      } else if (gLower.includes('9') || gLower.includes('9th')) {
        matchedStage = ACADEMIC_STAGES.find(s => s.className === 'Class 9');
      } else if (gLower.includes('8') || gLower.includes('8th')) {
        matchedStage = ACADEMIC_STAGES.find(s => s.className === 'Class 8');
      } else if (gLower.includes('7') || gLower.includes('7th')) {
        matchedStage = ACADEMIC_STAGES.find(s => s.className === 'Class 7');
      } else if (gLower.includes('6') || gLower.includes('6th')) {
        matchedStage = ACADEMIC_STAGES.find(s => s.className === 'Class 6');
      } else if (gLower.includes('5') || gLower.includes('5th')) {
        matchedStage = ACADEMIC_STAGES.find(s => s.className === 'Class 5');
      } else if (gLower.includes('4') || gLower.includes('4th')) {
        matchedStage = ACADEMIC_STAGES.find(s => s.className === 'Class 4');
      } else if (gLower.includes('3') || gLower.includes('3rd')) {
        matchedStage = ACADEMIC_STAGES.find(s => s.className === 'Class 3');
      } else if (gLower.includes('2') || gLower.includes('2nd')) {
        matchedStage = ACADEMIC_STAGES.find(s => s.className === 'Class 2');
      } else if (gLower.includes('1') || gLower.includes('1st')) {
        matchedStage = ACADEMIC_STAGES.find(s => s.className === 'Class 1');
      }
    }

    if (!matchedStage && student.age) {
      const ageStage = getAcademicStageFromAge(student.age);
      if (ageStage.stage) {
        matchedStage = ACADEMIC_STAGES.find(s => s.stage === ageStage.stage);
      }
    }

    if (!matchedStage) {
      matchedStage = ACADEMIC_STAGES[0]; // Fallback to SUB-JUNIOR (Class 1)
    }

    const className = matchedStage.className;
    const stage = matchedStage.stage;

    // 3. Class Badge Color Style
    let classBadgeClass = 'bg-blue-50 text-blue-900 border-blue-200';
    if (stage.includes('MASTER')) {
      classBadgeClass = 'bg-purple-100 text-purple-900 border-purple-300';
    } else if (stage.includes('SUPER SENIOR')) {
      classBadgeClass = 'bg-rose-50 text-rose-800 border-rose-300';
    } else if (stage.includes('SENIOR')) {
      classBadgeClass = 'bg-teal-50 text-teal-800 border-teal-300';
    } else if (stage.includes('JUNIOR') && !stage.includes('SUB')) {
      classBadgeClass = 'bg-blue-50 text-blue-800 border-blue-300';
    } else {
      classBadgeClass = 'bg-amber-50 text-amber-900 border-amber-300';
    }

    // 4. Level Badge Color Style
    let levelBadgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-300';
    if (levelNum === 1) levelBadgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-300';
    else if (levelNum === 2) levelBadgeClass = 'bg-sky-50 text-sky-800 border-sky-300';
    else if (levelNum === 3) levelBadgeClass = 'bg-indigo-50 text-indigo-800 border-indigo-300';
    else if (levelNum === 4) levelBadgeClass = 'bg-purple-50 text-purple-800 border-purple-300';
    else levelBadgeClass = 'bg-amber-50 text-amber-900 border-amber-300';

    return {
      className,
      stage,
      level,
      levelNum,
      classBadgeClass,
      levelBadgeClass
    };
  };

  const getStudentCategory = (student) => {
    if (!student) return 'Branch';

    const cat = String(student.admissionCategory || student.category || student.channel || '').trim().toLowerCase();

    // 1. Direct explicit category check (highest priority)
    if (cat === 'school') return 'School';
    if (cat === 'academy' || cat === 'franchise') return 'Academy';
    if (cat === 'branch' || cat === 'individual' || cat === 'direct') return 'Branch';

    // 2. ID-based check
    if (student.schoolId) return 'School';
    if (student.franchiseId) return 'Academy';

    // 3. Names and Institution checks
    const fName = String(student.franchiseName || '').trim().toLowerCase();
    if (fName && !fName.includes('regional branch') && !fName.endsWith(' branch')) {
      return 'Academy';
    }

    const sName = String(student.schoolName || '').trim().toLowerCase();
    const bName = String(student.branch || student.branchName || '').trim().toLowerCase();

    // If schoolName is just the branch name (e.g. "Tenkasi Branch" or "Tenkasi"), it's NOT a school
    const isSchoolNameJustBranch = sName && (
      sName === bName || 
      sName.includes('regional branch') || 
      sName.endsWith(' branch') ||
      (bName && (bName.includes(sName) || sName.includes(bName)))
    );

    if (sName && !isSchoolNameJustBranch) {
      if (sName.includes('school') || sName.includes('matric') || sName.includes('vidyalaya') || sName.includes('cbse') || sName.includes('higher secondary')) {
        return 'School';
      }
      if (sName.includes('academy') || sName.includes('studio') || sName.includes('tuition') || sName.includes('institute')) {
        return 'Academy';
      }
    }

    const inst = String(student.institution || '').trim().toLowerCase();
    const isInstJustBranch = inst && (
      inst === bName ||
      inst.includes('regional branch') ||
      inst.endsWith(' branch') ||
      (bName && (bName.includes(inst) || inst.includes(bName)))
    );

    if (inst && !isInstJustBranch) {
      if (inst.includes('school') || inst.includes('matric') || inst.includes('vidyalaya') || inst.includes('cbse') || inst.includes('higher secondary')) {
        return 'School';
      }
      if (inst.includes('academy') || inst.includes('franchise') || inst.includes('studio') || inst.includes('tuition') || inst.includes('institute') || inst.includes('center') || inst.includes('centre')) {
        return 'Academy';
      }
    }

    if (cat.includes('school')) return 'School';
    if (cat.includes('franchise') || cat.includes('academy')) return 'Academy';

    return 'Branch';
  };

  const getCategoryBadge = (student) => {
    const category = getStudentCategory(student);
    if (category === 'School') {
      return { label: 'School', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
    if (category === 'Academy') {
      return { label: 'Academy', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
    return { label: 'Branch', bg: 'bg-sky-50 text-sky-700 border-sky-200' };
  };

  // Filter students based on course, category, class, and level
  const filteredStudents = useMemo(() => {
    return (branchStudents || []).filter(isStudentUser).filter(student => {
      // Course filter (matches 14 official programs)
      if (branchCourseFilter && branchCourseFilter !== 'All') {
        const prog = (student.program || student.courseName || '').toLowerCase();
        const selectedCourse = allCourses.find(c => c.value === branchCourseFilter);
        const targetVal = branchCourseFilter.toLowerCase();
        const keywords = selectedCourse?.keywords || [];
        const matchesCourse =
          prog.includes(targetVal) ||
          keywords.some(kw => prog.includes(kw));

        if (!matchesCourse) return false;
      }

      // Category filter (Branch, Academy, School)
      if (branchCategoryFilter && branchCategoryFilter !== 'All') {
        const studentCat = getStudentCategory(student).toLowerCase();
        const targetCat = branchCategoryFilter.toLowerCase();
        if (targetCat === 'branch' || targetCat === 'individual') {
          if (studentCat !== 'branch' && studentCat !== 'individual') return false;
        } else if (targetCat === 'academy' || targetCat === 'franchise') {
          if (studentCat !== 'academy' && studentCat !== 'franchise') return false;
        } else if (studentCat !== targetCat) {
          return false;
        }
      }

      const acadCat = getStudentAcademicCategory(student);

      // Class filter (matches class alone)
      if (branchClassFilter && branchClassFilter !== 'All') {
        if (acadCat.className !== branchClassFilter) {
          const target = branchClassFilter.toLowerCase();
          const cur = (acadCat.className || '').toLowerCase();
          const matchesFallback =
            (target.includes('4') && cur.includes('4')) ||
            (target.includes('6') && cur.includes('6')) ||
            (target.includes('8') && (cur.includes('8') || cur.includes('9') || cur.includes('10'))) ||
            (target.includes('11') && (cur.includes('11') || cur.includes('12')));
          if (!matchesFallback) {
            return false;
          }
        }
      }

      // Level filter (Level 1 to Level 9)
      if (branchLevelFilter && branchLevelFilter !== 'All') {
        const lf = branchLevelFilter.toLowerCase();
        const targetNum = lf.replace('level_', '').replace('level ', '').trim();
        const targetStr = `level ${targetNum}`;
        const sLevelStr = String(acadCat.level || student.grade || student.level || '').toLowerCase();
        if (!sLevelStr.includes(targetStr)) return false;
      }

      return true;
    });
  }, [branchStudents, branchCourseFilter, branchCategoryFilter, branchClassFilter, branchLevelFilter]);

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
          <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:w-auto items-center">
            <button
              type="button"
              onClick={handleToggleMergeMode}
              className={`w-full sm:w-auto px-3 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-95 ${
                isMergeMode
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 ring-2 ring-amber-300 font-black'
                  : 'bg-[#0c234b] hover:bg-[#153a77] text-white border border-slate-700'
              }`}
            >
              <FileDown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{isMergeMode ? 'Close Merge' : 'Merge Qn Papers'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAddStudentModal(true)}
              className="w-full sm:w-auto px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span className="truncate">Register Student</span>
            </button>
          </div>
        </div>

        {/* Filters Row: Search (full width on mobile) + 2x2 grid of selects */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2 pt-1 items-center">
          {/* Search: Full width on mobile */}
          <div className="col-span-2 md:col-span-1 xl:col-span-1 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={branchStudentSearch}
              onChange={(e) => setBranchStudentSearch(e.target.value)}
              placeholder="Search candidate, ID, phone..."
              className="w-full pl-8 pr-2.5 py-2 text-xs border border-slate-200 rounded-lg focus:border-sky-500 focus:ring-1 focus:ring-sky-100 outline-none bg-slate-50/50 hover:bg-white focus:bg-white transition"
            />
          </div>

          {/* Category Filter */}
          <div className="col-span-1">
            <CompactSelect
              value={branchCategoryFilter}
              onChange={setBranchCategoryFilter}
              options={categoryOptions}
              placeholder="All Categories"
              maxHeight="max-h-56"
            />
          </div>

          {/* Class Filter */}
          <div className="col-span-1">
            <CompactSelect
              value={branchClassFilter}
              onChange={setBranchClassFilter}
              options={classOptions}
              placeholder="All Classes"
              maxHeight="max-h-56"
            />
          </div>

          {/* Level Filter */}
          <div className="col-span-1">
            <CompactSelect
              value={branchLevelFilter}
              onChange={setBranchLevelFilter}
              options={levelOptions}
              placeholder="All Levels"
              maxHeight="max-h-56"
            />
          </div>

          {/* Course Filter */}
          <div className="col-span-1 md:col-span-2 xl:col-span-1 flex items-center gap-1.5">
            <div className="flex-1 min-w-0">
              <CompactSelect
                value={branchCourseFilter}
                onChange={setBranchCourseFilter}
                options={allCourses}
                placeholder="All Courses"
                maxHeight="max-h-56"
              />
            </div>
            {(branchCategoryFilter !== 'All' || branchClassFilter !== 'All' || branchLevelFilter !== 'All' || branchCourseFilter !== 'All' || branchStudentSearch) && (
              <button
                type="button"
                onClick={() => {
                  setBranchStudentSearch('');
                  setBranchCategoryFilter('All');
                  setBranchClassFilter('All');
                  setBranchLevelFilter('All');
                  setBranchCourseFilter('All');
                }}
                className="px-2 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition flex items-center justify-center gap-1 cursor-pointer shrink-0"
                title="Reset all filters"
              >
                ✕ Clear
              </button>
            )}
          </div>
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
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={selectedStudentIds.length === 0}
              onClick={handleStartMergeSelected}
              className="flex-1 sm:flex-none justify-center px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs transition flex items-center gap-1.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
            >
              <FileDown className="w-3.5 h-3.5 shrink-0" />
              <span>
                <span className="hidden sm:inline">Download Merged Question Papers</span>
                <span className="sm:hidden">Download Merged</span> ({selectedStudentIds.length})
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Students Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        <div 
          className="w-full overflow-x-auto no-scrollbar admin-table-container"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <table className="w-full text-left text-xs min-w-[860px]">
            <thead className="bg-[#081d3d] text-white uppercase text-[10px] tracking-wider font-black">
              <tr>
                {isMergeMode && (
                  <th className="py-3 px-3 w-12 text-center sticky left-0 bg-[#081d3d] z-30 shadow-[2px_0_5px_rgba(0,0,0,0.15)]">
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
                <th className={`py-3 px-4 sticky ${isMergeMode ? 'left-12' : 'left-0'} bg-[#081d3d] z-20 shadow-[2px_0_5px_rgba(0,0,0,0.15)]`}>Student Details</th>
                {/* Mobile View: Event Reg & Question Paper appear immediately after Student Details */}
                <th className="sm:hidden py-3 px-2 text-center whitespace-nowrap">Event Reg</th>
                <th className="sm:hidden py-3 px-2 text-center whitespace-nowrap">Question Paper</th>
                <th className="py-3 px-3">Parent & Contact</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Class</th>
                <th className="py-3 px-3">Course & Level</th>
                {/* Desktop View: Event Registration & Question Paper appear at the end */}
                <th className="hidden sm:table-cell py-3 px-3 text-center whitespace-nowrap">Event Registration</th>
                <th className="hidden sm:table-cell py-3 px-3 text-center whitespace-nowrap">Question Paper</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={isMergeMode ? 8 : 7} className="py-8 text-center text-slate-500">
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
                            className="w-4 h-4 rounded cursor-pointer accent-amber-400"
                          />
                        </td>
                      )}

                      {/* Student Details (Sticky column for optimal mobile orientation) */}
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

                      {/* Mobile View: Event Registration Column (Position 2 on mobile) */}
                      <td className="sm:hidden py-3 px-2 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenEventRegForStudent?.(student)}
                          className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 hover:border-purple-300 font-bold rounded-lg text-xs transition cursor-pointer inline-flex items-center justify-center gap-1 shadow-xs whitespace-nowrap active:scale-95"
                          title="View Event Registration"
                        >
                          <Ticket className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span>Event</span>
                        </button>
                      </td>

                      {/* Mobile View: Question Paper Column (Position 3 on mobile) */}
                      <td className="sm:hidden py-3 px-2 text-center whitespace-nowrap">
                        {(() => {
                          const hasUploadedQ = Boolean(readStudentUploadedQuestions(getStudentScopeKey(student)));
                          return (
                            <div className="flex flex-col items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenQuestionPaperForStudent?.(student)}
                                className={`px-2.5 py-1.5 font-bold rounded-lg text-xs transition cursor-pointer inline-flex items-center justify-center gap-1 shadow-xs whitespace-nowrap active:scale-95 ${
                                  hasUploadedQ
                                    ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300'
                                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 hover:border-amber-300'
                                }`}
                                title="View Question Paper (Page 1) and Uploaded Questions"
                              >
                                <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                <span>Qn Paper</span>
                              </button>
                              {hasUploadedQ && (
                                <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded-full">
                                  <Paperclip className="w-2 h-2" /> Questions
                                </span>
                              )}
                            </div>
                          );
                        })()}
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
                        {(() => {
                          const badge = getCategoryBadge(student);
                          const school = (student.schoolName || student.institution || '').trim();
                          const hasSchoolName = school &&
                            !school.toLowerCase().includes('regional branch') &&
                            !school.toLowerCase().endsWith(' branch') &&
                            school.toLowerCase() !== (student.branch || '').toLowerCase();
                          return (
                            <div className="flex flex-col gap-1 items-start">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border shadow-2xs ${badge.bg}`}>
                                {badge.label}
                              </span>
                              {hasSchoolName && (
                                <div className="text-[10px] font-bold text-slate-600 truncate max-w-[150px] flex items-center gap-1 mt-0.5" title={school}>
                                  <School className="w-3 h-3 text-sky-600 shrink-0" />
                                  <span className="truncate">{school}</span>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </td>

                      {/* Class */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {(() => {
                          const acad = getStudentAcademicCategory(student);
                          return (
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border shadow-2xs ${acad.classBadgeClass}`}>
                              {acad.className}
                            </span>
                          );
                        })()}
                      </td>

                      {/* Course & Level */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {(() => {
                          const acad = getStudentAcademicCategory(student);
                          return (
                            <div>
                              <div className="font-bold text-slate-900">{student.program || student.courseName || 'Course'}</div>
                              <div className="text-[10px] font-black text-amber-700 mt-0.5 uppercase tracking-wide">
                                {acad.level}
                              </div>
                            </div>
                          );
                        })()}
                      </td>

                      {/* Desktop View: Event Registration Column */}
                      <td className="hidden sm:table-cell py-3 px-3 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenEventRegForStudent?.(student)}
                          className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 hover:border-purple-300 font-bold rounded-lg text-xs transition cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap active:scale-95"
                          title="View Event Registration"
                        >
                          <Ticket className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span>Event</span>
                        </button>
                      </td>

                      {/* Desktop View: Question Paper Column */}
                      <td className="hidden sm:table-cell py-3 px-3 text-center whitespace-nowrap">
                        {(() => {
                          const hasUploadedQ = Boolean(readStudentUploadedQuestions(getStudentScopeKey(student)));
                          return (
                            <div className="flex flex-col items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenQuestionPaperForStudent?.(student)}
                                className={`px-3 py-1.5 font-bold rounded-lg text-xs transition cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap active:scale-95 ${
                                  hasUploadedQ
                                    ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300'
                                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 hover:border-amber-300'
                                }`}
                                title="View Question Paper (Page 1) and Uploaded Questions"
                              >
                                <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                <span>Qn Paper</span>
                              </button>
                              {hasUploadedQ && (
                                <span className="inline-flex items-center gap-0.5 text-[9.5px] font-black text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded-full">
                                  <Paperclip className="w-2.5 h-2.5" /> Questions File
                                </span>
                              )}
                            </div>
                          );
                        })()}
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
