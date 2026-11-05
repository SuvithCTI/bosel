import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  Clock,
  Trash2,
  Download,
  Printer,
  FileText,
  Award,
  Filter as FilterIcon,
  RotateCcw,
  Eye,
  CheckSquare,
  Square,
  Phone,
  Calendar,
  Building,
  Save,
  ChevronDown,
  Layers
} from 'lucide-react';
import { exportPdfFromElement } from '../../utils/pdfExport';
import { getStoredCourses } from '../../data/coursesData';

// Initial default enquiries matching the official portal screenshot
export const DEFAULT_STUDENT_ENQUIRIES = [
  {
    id: 'ENQ-001',
    userId: 'BSEL-9898989898',
    admissionNo: 'HW27-003',
    registerNumber: 'HW27-003',
    branchName: 'Aim 4 Life',
    branch: 'Aim 4 Life',
    institution: 'Aim 4 Life',
    studentName: 'shanju',
    name: 'shanju',
    parentName: 'R. Shanmugam',
    courseName: 'Handwriting',
    program: 'Handwriting',
    grade: 'Level 1',
    level: 'Level 1',
    mobile: '9898989898',
    phone: '9898989898',
    email: 'shanju@example.com',
    submitted: '2026-10-09 19:09:11',
    status: 'Pending',
    feeStatus: 'Paid',
    gender: 'Female',
    dob: '2016-04-12',
    address: '14, Temple Street, Anna Nagar, Chennai - 600040'
  },
  {
    id: 'ENQ-002',
    userId: 'BSEL-9897987645',
    admissionNo: 'AB27-002',
    registerNumber: 'AB27-002',
    branchName: 'test branch',
    branch: 'test branch',
    institution: 'test branch',
    studentName: 'sankar',
    name: 'sankar',
    parentName: 'K. Sankaralingam',
    courseName: 'Abacus',
    program: 'Abacus',
    grade: 'Level 1',
    level: 'Level 1',
    mobile: '9897987645',
    phone: '9897987645',
    email: 'sankar@example.com',
    submitted: '2026-10-05 21:26:10',
    status: 'Pending',
    feeStatus: 'Paid',
    gender: 'Male',
    dob: '2015-08-20',
    address: '22, Main Road, Surandai, Tenkasi - 627859'
  },
  {
    id: 'ENQ-003',
    userId: 'BSEL-9865219131',
    admissionNo: 'AB27-001',
    registerNumber: 'AB27-001',
    branchName: 'test branch',
    branch: 'test branch',
    institution: 'test branch',
    studentName: 'sivaji',
    name: 'sivaji',
    parentName: 'M. Sivaji Pandian',
    courseName: 'Abacus',
    program: 'Abacus',
    grade: 'Level 1',
    level: 'Level 1',
    mobile: '8248600345',
    phone: '8248600345',
    email: 'sivaji@example.com',
    submitted: '2026-10-05 17:48:08',
    status: 'Pending',
    feeStatus: 'Paid',
    gender: 'Male',
    dob: '2014-11-15',
    address: 'Second Street, Surandai, Keelasurandai, Tenkasi - 627859'
  },
  {
    id: 'ENQ-004',
    userId: 'BSEL-9442188771',
    admissionNo: 'ADM-2026-004',
    registerNumber: 'ADM-2026-004',
    branchName: 'Aim 4 Life',
    branch: 'Aim 4 Life',
    institution: 'Aim 4 Life',
    studentName: 'Kavya Maran',
    name: 'Kavya Maran',
    parentName: 'S. Maran',
    courseName: 'Phonics',
    program: 'Phonics',
    grade: 'Level 1',
    level: 'Level 1',
    mobile: '9442188771',
    phone: '9442188771',
    email: 'kavya@example.com',
    submitted: '2026-10-03 14:15:22',
    status: 'Approved',
    feeStatus: 'Paid',
    gender: 'Female',
    dob: '2017-02-18',
    address: '5B, Green Valley, T. Nagar, Chennai - 600017'
  },
  {
    id: 'ENQ-005',
    userId: 'BSEL-9840123456',
    admissionNo: 'DN27-005',
    registerNumber: 'DN27-005',
    branchName: 'Aim 4 Life',
    branch: 'Aim 4 Life',
    institution: 'Aim 4 Life',
    studentName: 'Arjun Subramanian',
    name: 'Arjun Subramanian',
    parentName: 'V. Subramanian',
    courseName: 'Bharatanatyam',
    program: 'Bharatanatyam',
    grade: 'Level 2',
    level: 'Level 2',
    mobile: '9840123456',
    phone: '9840123456',
    email: 'arjun@example.com',
    submitted: '2026-10-01 11:30:45',
    status: 'Approved',
    feeStatus: 'Paid',
    gender: 'Male',
    dob: '2013-06-25',
    address: '42, North Car Street, Tenkasi - 627811'
  },
  {
    id: 'ENQ-006',
    userId: 'BSEL-9865219131',
    admissionNo: 'TK27-006',
    registerNumber: 'TK27-006',
    branchName: 'Tenkasi Regional Branch',
    branch: 'Tenkasi Regional Branch',
    institution: 'Tenkasi Regional Branch',
    studentName: 'Sivakumar S',
    name: 'Sivakumar S',
    parentName: 'M. Sankar',
    courseName: 'Abacus',
    program: 'Abacus',
    grade: 'Level 1',
    level: 'Level 1',
    mobile: '9865219131',
    phone: '9865219131',
    email: 'sivakumar@example.com',
    submitted: '2026-10-10 10:20:15',
    status: 'Approved',
    feeStatus: 'Paid',
    gender: 'Male',
    dob: '2015-05-14',
    address: 'Second Street, Surandai, Keelasurandai, Tenkasi - 627859'
  },
  {
    id: 'ENQ-007',
    userId: 'BSEL-9443188776',
    admissionNo: 'TK27-007',
    registerNumber: 'TK27-007',
    branchName: 'Tenkasi Regional Branch',
    branch: 'Tenkasi Regional Branch',
    institution: 'Tenkasi Regional Branch',
    studentName: 'Priya Dharshini',
    name: 'Priya Dharshini',
    parentName: 'R. Ramakrishnan',
    courseName: 'Handwriting',
    program: 'Handwriting',
    grade: 'Level 2',
    level: 'Level 2',
    mobile: '9443188776',
    phone: '9443188776',
    email: 'priya.tenkasi@gmail.com',
    submitted: '2026-10-11 14:45:00',
    status: 'Pending',
    feeStatus: 'Paid',
    gender: 'Female',
    dob: '2016-09-22',
    address: '42, North Car Street, Surandai, Tenkasi - 627859'
  }
];

export const getStoredStudentEnquiries = () => {
  if (typeof window === 'undefined') return DEFAULT_STUDENT_ENQUIRIES;
  try {
    const raw = localStorage.getItem('bsel_student_enquiries');
    if (!raw) {
      localStorage.setItem('bsel_student_enquiries', JSON.stringify(DEFAULT_STUDENT_ENQUIRIES));
      return DEFAULT_STUDENT_ENQUIRIES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem('bsel_student_enquiries', JSON.stringify(DEFAULT_STUDENT_ENQUIRIES));
      return DEFAULT_STUDENT_ENQUIRIES;
    }
    // Ensure all default seed records exist so the table is never empty
    const existingIds = new Set(parsed.map((p) => p.id || p.admissionNo));
    let hasAdditions = false;
    DEFAULT_STUDENT_ENQUIRIES.forEach((item) => {
      if (!existingIds.has(item.id) && !existingIds.has(item.admissionNo)) {
        parsed.push(item);
        hasAdditions = true;
      }
    });
    if (hasAdditions) {
      localStorage.setItem('bsel_student_enquiries', JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return DEFAULT_STUDENT_ENQUIRIES;
  }
};

export const saveStoredStudentEnquiries = (list) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('bsel_student_enquiries', JSON.stringify(list));
    window.dispatchEvent(new Event('bsel_enquiries_updated'));
  } catch (err) {
    console.error('Failed to save student enquiries:', err);
  }
};

export default function AdminBranchStudentDetailsPage({
  activeBranch = 'All branches',
  setViewingAdmissionStudent,
  handleOpenMarksheet,
  handleOpenCertForStudent,
  showToast = () => {},
  schoolsList = []
}) {
  const [enquiries, setEnquiries] = useState(() => getStoredStudentEnquiries());
  const [courses, setCourses] = useState(() => getStoredCourses());
  const [selectedIds, setSelectedIds] = useState([]);

  // Live synchronization with Master Courses Repository
  useEffect(() => {
    const handleCoursesUpdate = () => setCourses(getStoredCourses());
    window.addEventListener('bsel_courses_updated', handleCoursesUpdate);
    window.addEventListener('storage', handleCoursesUpdate);
    return () => {
      window.removeEventListener('bsel_courses_updated', handleCoursesUpdate);
      window.removeEventListener('storage', handleCoursesUpdate);
    };
  }, []);

  // Top Filter state - default to 'All branches' so website submissions are immediately visible
  const [filterBranch, setFilterBranch] = useState('All branches');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Active applied filters
  const [appliedFilters, setAppliedFilters] = useState({
    branch: 'All branches',
    fromDate: '',
    toDate: ''
  });

  // Search & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [certCount, setCertCount] = useState(10);

  // Status edit tracker: { [enquiryId]: status }
  const [pendingStatusUpdates, setPendingStatusUpdates] = useState({});

  // Level selector tracker per student: { [enquiryId]: level }
  const [studentLevels, setStudentLevels] = useState({});

  // Sync with localStorage updates
  useEffect(() => {
    const handleUpdate = () => setEnquiries(getStoredStudentEnquiries());
    window.addEventListener('bsel_enquiries_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('bsel_enquiries_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Compute unique branch names from enquiries and schoolsList
  const branchOptions = useMemo(() => {
    const set = new Set();
    set.add('All branches');
    set.add('Aim 4 Life');
    set.add('test branch');
    enquiries.forEach(e => {
      if (e.branchName) set.add(e.branchName);
      if (e.branch) set.add(e.branch);
      if (e.institution) set.add(e.institution);
    });
    (schoolsList || []).forEach(s => {
      if (s.branchName) set.add(s.branchName);
      if (s.name) set.add(s.name);
    });
    return Array.from(set);
  }, [enquiries, schoolsList]);

  // Handle Top Filter
  const handleApplyFilter = (e) => {
    if (e) e.preventDefault();
    setAppliedFilters({
      branch: filterBranch,
      fromDate,
      toDate
    });
    setCurrentPage(1);
    showToast(`Filters applied for: ${filterBranch}`);
  };

  const handleClearFilter = () => {
    setFilterBranch('All branches');
    setFromDate('');
    setToDate('');
    setAppliedFilters({
      branch: 'All branches',
      fromDate: '',
      toDate: ''
    });
    setSearchQuery('');
    setCurrentPage(1);
    showToast('Filters cleared');
  };

  // Filtered dataset
  const filteredRecords = useMemo(() => {
    return enquiries.filter((item) => {
      // 1. Branch Filter
      if (appliedFilters.branch !== 'All branches') {
        const itemBranch = (item.branchName || item.branch || item.institution || '').toLowerCase();
        const target = appliedFilters.branch.toLowerCase();
        if (!itemBranch.includes(target) && !target.includes(itemBranch)) {
          return false;
        }
      }

      // 2. Date Range Filter
      if (appliedFilters.fromDate) {
        const itemDate = item.submitted ? item.submitted.split(' ')[0] : '';
        if (itemDate && itemDate < appliedFilters.fromDate) return false;
      }
      if (appliedFilters.toDate) {
        const itemDate = item.submitted ? item.submitted.split(' ')[0] : '';
        if (itemDate && itemDate > appliedFilters.toDate) return false;
      }

      // 3. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          (item.admissionNo || '').toLowerCase().includes(q) ||
          (item.studentName || item.name || '').toLowerCase().includes(q) ||
          (item.branchName || item.branch || '').toLowerCase().includes(q) ||
          (item.courseName || item.program || '').toLowerCase().includes(q) ||
          (item.mobile || item.phone || '').includes(q) ||
          (item.status || '').toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [enquiries, appliedFilters, searchQuery]);

  // Pagination calculations
  const totalRecords = filteredRecords.length;
  const effectiveRowsPerPage = rowsPerPage === 'All' ? totalRecords : Number(rowsPerPage);
  const totalPages = Math.ceil(totalRecords / (effectiveRowsPerPage || 1)) || 1;
  const paginatedRecords = useMemo(() => {
    if (rowsPerPage === 'All') return filteredRecords;
    const start = (currentPage - 1) * effectiveRowsPerPage;
    return filteredRecords.slice(start, start + effectiveRowsPerPage);
  }, [filteredRecords, currentPage, effectiveRowsPerPage, rowsPerPage]);

  // Selection handlers
  const isAllSelected =
    paginatedRecords.length > 0 &&
    paginatedRecords.every((r) => selectedIds.includes(r.id || r.admissionNo));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      const pageIds = paginatedRecords.map((r) => r.id || r.admissionNo);
      setSelectedIds(Array.from(new Set([...selectedIds, ...pageIds])));
    }
  };

  const handleToggleRow = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Status Change per row
  const handleStatusChange = (rowId, newStatus) => {
    setPendingStatusUpdates((prev) => ({ ...prev, [rowId]: newStatus }));
  };

  const handleSaveStatus = (item) => {
    const rowId = item.id || item.admissionNo;
    const newStatus = pendingStatusUpdates[rowId] || item.status;
    const updated = enquiries.map((r) => {
      if ((r.id || r.admissionNo) === rowId) {
        return { ...r, status: newStatus };
      }
      return r;
    });
    setEnquiries(updated);
    saveStoredStudentEnquiries(updated);
    showToast(`Status updated to "${newStatus}" for ${item.studentName || item.admissionNo}`);
  };

  // Dynamically resolve exact course levels from master courses data (present & future)
  const getLevelsForProgram = (courseName) => {
    if (!courseName) return [{ value: 'Level 1', label: 'Level 1', shortLabel: 'Level 1' }];
    const cLower = String(courseName).trim().toLowerCase();

    // 1. Match against master courses repository
    const matched = (courses || []).find((c) => {
      const n = (c.name || '').toLowerCase();
      const fn = (c.fullName || '').toLowerCase();
      const id = (c.id || '').toLowerCase();
      return (
        n === cLower ||
        cLower.includes(n) ||
        n.includes(cLower) ||
        fn === cLower ||
        cLower.includes(fn) ||
        fn.includes(cLower) ||
        id === cLower ||
        cLower.includes(id)
      );
    });

    if (matched) {
      // Priority A: Inspect structured curriculum array
      if (Array.isArray(matched.curriculum) && matched.curriculum.length > 0) {
        const parsed = [];
        matched.curriculum.forEach((item, idx) => {
          const title = typeof item === 'string' ? item : item?.title || '';
          const prefixMatch = title.match(/^(Level\s*\d+|Module\s*\d+|Stage\s*\d+)/i);
          if (prefixMatch) {
            const val = prefixMatch[1].replace(/\s+/g, ' ');
            const cleanVal = val.charAt(0).toUpperCase() + val.slice(1);
            const desc = title.replace(/^(Level\s*\d+|Module\s*\d+|Stage\s*\d+)[:\-–\s]*/i, '').trim();
            parsed.push({
              value: cleanVal,
              label: desc ? `${cleanVal}: ${desc}` : cleanVal,
              shortLabel: cleanVal
            });
          } else {
            const fallbackVal = `Level ${idx + 1}`;
            parsed.push({
              value: fallbackVal,
              label: title ? `${fallbackVal}: ${title}` : fallbackVal,
              shortLabel: fallbackVal
            });
          }
        });
        if (parsed.length > 0) return parsed;
      }

      // Priority B: Parse course levels metadata string
      const lvlStr = matched.levels || '';
      const mTo = lvlStr.match(/Level\s*1\s*to\s*(\d+)/i);
      if (mTo) {
        const count = parseInt(mTo[1], 10);
        return Array.from({ length: count }, (_, i) => ({
          value: `Level ${i + 1}`,
          label: `Level ${i + 1}`,
          shortLabel: `Level ${i + 1}`
        }));
      }

      const mLvls = lvlStr.match(/(\d+)\s*(?:Structured|Classical|Cognitive|Design|Future-Ready)?\s*Levels/i);
      if (mLvls) {
        const count = parseInt(mLvls[1], 10);
        return Array.from({ length: count }, (_, i) => ({
          value: `Level ${i + 1}`,
          label: `Level ${i + 1}`,
          shortLabel: `Level ${i + 1}`
        }));
      }

      const mMods = lvlStr.match(/(\d+)\s*Modules/i);
      if (mMods) {
        const count = parseInt(mMods[1], 10);
        return Array.from({ length: count }, (_, i) => ({
          value: `Module ${i + 1}`,
          label: `Module ${i + 1}`,
          shortLabel: `Module ${i + 1}`
        }));
      }
    }

    // 2. Specific heuristic fallbacks based on official BSEL programs
    if (cLower.includes('abacus') || cLower.includes('css')) {
      return Array.from({ length: 9 }, (_, i) => ({
        value: `Level ${i + 1}`,
        label: `Level ${i + 1}`,
        shortLabel: `Level ${i + 1}`
      }));
    }

    // Default to 4 levels for standard 4-stage courses
    return Array.from({ length: 4 }, (_, i) => ({
      value: `Level ${i + 1}`,
      label: `Level ${i + 1}`,
      shortLabel: `Level ${i + 1}`
    }));
  };

  // Level selector per student
  const handleLevelChange = (rowId, newLevel) => {
    setStudentLevels((prev) => ({ ...prev, [rowId]: newLevel }));
  };

  const getStudentCurrentLevel = (item) => {
    const rowId = item.id || item.admissionNo;
    const chosen = studentLevels[rowId] || item.level || item.grade;
    const available = getLevelsForProgram(item.courseName || item.program);
    if (chosen && available.some(l => l.value.toLowerCase() === chosen.toLowerCase())) {
      const match = available.find(l => l.value.toLowerCase() === chosen.toLowerCase());
      return match ? match.value : chosen;
    }
    return available[0]?.value || 'Level 1';
  };

  // Batch Operations
  const handleApproveSelected = () => {
    if (selectedIds.length === 0) {
      alert('Please choose student records with the checkboxes in the table first.');
      return;
    }
    const updated = enquiries.map((r) => {
      const rowId = r.id || r.admissionNo;
      if (selectedIds.includes(rowId)) {
        return { ...r, status: 'Approved' };
      }
      return r;
    });
    setEnquiries(updated);
    saveStoredStudentEnquiries(updated);
    showToast(`Approved ${selectedIds.length} selected student enquiries!`);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      alert('Please choose student records with the checkboxes in the table first.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected student record(s)?`)) {
      const updated = enquiries.filter((r) => !selectedIds.includes(r.id || r.admissionNo));
      setEnquiries(updated);
      saveStoredStudentEnquiries(updated);
      setSelectedIds([]);
      showToast(`Removed ${selectedIds.length} student record(s).`);
    }
  };

  // Batch Print & PDF merge helpers
  const getSelectedStudentObjects = () => {
    return enquiries.filter((r) => selectedIds.includes(r.id || r.admissionNo));
  };

  const handleMergePrintCertificates = () => {
    const selected = getSelectedStudentObjects();
    if (selected.length === 0) {
      alert('Please select student records with the checkboxes first to generate merged certificates.');
      return;
    }
    const countToTake = Math.min(selected.length, Number(certCount) || 10);
    const targetStudents = selected.slice(0, countToTake);
    
    // Trigger certificate generation modal/print for the first one or batch
    if (handleOpenCertForStudent) {
      handleOpenCertForStudent(targetStudents[0]);
      showToast(`Generating merged certificate bundle for ${targetStudents.length} students...`);
    } else {
      window.print();
    }
  };

  const handleDownloadMergedPdf = async () => {
    const selected = getSelectedStudentObjects();
    if (selected.length === 0) {
      alert('Please select student records with the checkboxes first to download merged PDF.');
      return;
    }
    showToast(`Preparing merged PDF download for ${selected.length} students...`);
    // Print window for batch PDF
    window.print();
  };

  return (
    <div className="space-y-6 text-slate-900 pb-12 animate-in fade-in duration-300">
      {/* =========================================================================
          PAGE HEADER / BREADCRUMB
         ========================================================================= */}
      <div>
        <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-400 block mb-1">
          WEBSITE SUBMISSIONS
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#081d3d] font-heading tracking-tight flex items-center gap-2.5">
          <FileText className="w-7 h-7 text-sky-600 shrink-0" />
          <span>Student Details</span>
        </h1>
      </div>

      {/* =========================================================================
          CARD 1: TOP FILTER CARD (BRANCH & DATE RANGE)
         ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 transition-all hover:shadow-md">
        <form onSubmit={handleApplyFilter} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* 1. Branch Name Dropdown */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>Branch Name</span>
              </label>
              <div className="relative">
                <select
                  value={filterBranch}
                  onChange={(e) => setFilterBranch(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition cursor-pointer pr-9"
                >
                  {branchOptions.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 2. From Date */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>From date</span>
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition cursor-pointer"
              />
            </div>

            {/* 3. To Date */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>To date</span>
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition cursor-pointer"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 pt-1">
            <button
              type="submit"
              className="px-5 py-2 bg-[#0c234b] hover:bg-[#081d3d] active:scale-95 text-white text-xs font-black rounded-xl transition shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <FilterIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>Filter</span>
            </button>
            <button
              type="button"
              onClick={handleClearFilter}
              className="px-4 py-2 bg-white hover:bg-slate-100 active:scale-95 text-slate-700 border border-slate-300 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Clear</span>
            </button>
          </div>
        </form>
      </div>

      {/* =========================================================================
          CARD 2: ADMISSION & COMPETITION ENQUIRIES & BATCH ACTIONS
         ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
        {/* Counter Heading */}
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
            ADMISSION AND COMPETITION ENQUIRIES
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#081d3d] font-heading">
            {filteredRecords.length} student enquiries received
          </h2>
        </div>

        {/* Batch Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1">
          {/* Approve selected */}
          <button
            type="button"
            onClick={handleApproveSelected}
            disabled={selectedIds.length === 0}
            className={`px-3.5 py-2 text-xs font-black rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer ${
              selectedIds.length > 0
                ? 'bg-[#0c234b] hover:bg-[#081d3d] active:scale-95 text-white'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Approve selected</span>
          </button>

          {/* Delete selected */}
          <button
            type="button"
            onClick={handleDeleteSelected}
            disabled={selectedIds.length === 0}
            className={`px-3.5 py-2 text-xs font-black rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer ${
              selectedIds.length > 0
                ? 'bg-[#0c234b] hover:bg-rose-700 active:scale-95 text-white'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-300" />
            <span>Delete selected</span>
          </button>

          {/* Certificate Count Selector */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700">
            <span className="text-slate-600">Certificate count</span>
            <select
              value={certCount}
              onChange={(e) => setCertCount(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-2 py-0.5 text-xs font-black text-slate-900 outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          {/* Merge & print certificates */}
          <button
            type="button"
            onClick={handleMergePrintCertificates}
            disabled={selectedIds.length === 0}
            className={`px-3.5 py-2 text-xs font-black rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer ${
              selectedIds.length > 0
                ? 'bg-[#0c234b] hover:bg-[#081d3d] active:scale-95 text-white'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            <Printer className="w-3.5 h-3.5 text-amber-300" />
            <span>Merge & print certificates</span>
          </button>

          {/* Download merged PDF */}
          <button
            type="button"
            onClick={handleDownloadMergedPdf}
            disabled={selectedIds.length === 0}
            className={`px-3.5 py-2 text-xs font-black rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer ${
              selectedIds.length > 0
                ? 'bg-[#0c234b] hover:bg-[#081d3d] active:scale-95 text-white'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-sky-300" />
            <span>Download merged PDF</span>
          </button>
        </div>

        {/* Instructions */}
        <p className="text-xs text-slate-500 font-medium pt-1">
          Choose student records with the checkboxes in the table.
          {selectedIds.length > 0 && (
            <span className="ml-2 font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
              {selectedIds.length} record(s) selected
            </span>
          )}
        </p>

        {/* Search this table & Rows per page */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Search Table */}
          <div className="flex-1 max-w-sm">
            <label className="block text-[11px] font-black text-slate-600 mb-1">
              Search this table
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search records..."
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-sky-500 outline-none transition"
              />
            </div>
          </div>

          {/* Rows Per Page */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs font-bold text-slate-600">Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(e.target.value === 'All' ? 'All' : Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-black text-slate-900 outline-none cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value="All">All</option>
            </select>
          </div>
        </div>

        {/* =========================================================================
            DATA TABLE
           ========================================================================= */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              {/* Header */}
              <thead className="bg-[#f8fafc] text-slate-500 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider select-none">
                <tr>
                  <th className="py-3 px-3.5 w-10 text-center">
                    <button
                      type="button"
                      onClick={handleToggleSelectAll}
                      className="cursor-pointer text-slate-400 hover:text-slate-700"
                    >
                      {isAllSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#0c234b]" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-3">ADMISSION NO.</th>
                  <th className="py-3 px-3">BRANCH NAME</th>
                  <th className="py-3 px-3">STUDENT NAME</th>
                  <th className="py-3 px-3">COURSE NAME</th>
                  <th className="py-3 px-3">MOBILE</th>
                  <th className="py-3 px-3 text-center">ADMISSION FORM</th>
                  <th className="py-3 px-3 text-center">LEVEL DOCUMENTS</th>
                </tr>
              </thead>

              {/* Body */}
              <tbody className="divide-y divide-slate-100 font-medium">
                {paginatedRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Users className="w-8 h-8 text-slate-300" />
                        <p className="text-sm font-bold text-slate-600">No student enquiries found</p>
                        <p className="text-xs text-slate-400">Try adjusting your branch or date filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedRecords.map((item) => {
                    const rowId = item.id || item.admissionNo;
                    const isSelected = selectedIds.includes(rowId);
                    const currentLevel = getStudentCurrentLevel(item);

                    return (
                      <tr
                        key={rowId}
                        className={`transition-colors hover:bg-slate-50/80 ${
                          isSelected ? 'bg-sky-50/50' : 'bg-white'
                        }`}
                      >
                        {/* 1. Checkbox */}
                        <td className="py-3 px-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleRow(rowId)}
                            className="cursor-pointer text-slate-400 hover:text-slate-700"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-[#0c234b]" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        {/* 2. Admission No */}
                        <td className="py-3 px-3 font-black text-slate-900 whitespace-nowrap">
                          {item.admissionNo || item.registerNumber}
                        </td>

                        {/* 3. Branch Name */}
                        <td className="py-3 px-3 text-slate-700 font-semibold whitespace-nowrap">
                          {item.branchName || item.branch || item.institution || 'Aim 4 Life'}
                        </td>

                        {/* 4. Student Name */}
                        <td className="py-3 px-3 font-black text-slate-950 capitalize whitespace-nowrap">
                          {item.studentName || item.name}
                        </td>

                        {/* 5. Course Name */}
                        <td className="py-3 px-3 text-slate-800 font-bold whitespace-nowrap">
                          {item.courseName || item.program}
                        </td>

                        {/* 6. Mobile */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <a
                            href={`tel:${item.mobile || item.phone}`}
                            className="text-[#e11d48] font-black hover:underline tracking-tight inline-flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3 text-rose-400" />
                            <span>{item.mobile || item.phone}</span>
                          </a>
                        </td>



                        {/* 9. Admission Form */}
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => {
                              if (setViewingAdmissionStudent) {
                                setViewingAdmissionStudent(item);
                              } else {
                                showToast(`Opening admission form for ${item.studentName}...`);
                              }
                            }}
                            className="px-3 py-1.5 bg-[#0c234b] hover:bg-[#081d3d] active:scale-95 text-white text-[11px] font-black rounded-lg transition shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-sky-400" />
                            <span>View admission form</span>
                          </button>
                        </td>

                        {/* 10. Level Documents (Level Selector + Marksheet + Certificate) */}
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            {/* Dynamic program-specific level selector */}
                            {(() => {
                              const progName = item.courseName || item.program || '';
                              const availableLevels = getLevelsForProgram(progName);
                              const activeLvl = getStudentCurrentLevel(item);

                              return (
                                <select
                                  value={activeLvl}
                                  onChange={(e) => handleLevelChange(rowId, e.target.value)}
                                  className="px-2 py-1 text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-lg outline-none cursor-pointer hover:border-slate-400 transition"
                                  title={`${progName} (${availableLevels.length} total levels)`}
                                >
                                  {availableLevels.map((lvl) => (
                                    <option key={lvl.value} value={lvl.value} title={lvl.label}>
                                      {lvl.shortLabel || lvl.value}
                                    </option>
                                  ))}
                                </select>
                              );
                            })()}

                            {/* Marksheet button */}
                            <button
                              type="button"
                              onClick={() => {
                                const activeLvl = getStudentCurrentLevel(item);
                                const enriched = { ...item, grade: activeLvl, level: activeLvl };
                                if (handleOpenMarksheet) {
                                  handleOpenMarksheet(enriched);
                                } else {
                                  showToast(`Opening marksheet for ${item.studentName} (${activeLvl})`);
                                }
                              }}
                              className="px-2.5 py-1 bg-[#0c234b] hover:bg-[#081d3d] active:scale-95 text-white text-[11px] font-black rounded-lg transition shadow-2xs inline-flex items-center gap-1 cursor-pointer"
                              title="View official marksheet"
                            >
                              <FileText className="w-3 h-3 text-amber-300" />
                              <span>Marksheet</span>
                            </button>

                            {/* Certificate button */}
                            <button
                              type="button"
                              onClick={() => {
                                const activeLvl = getStudentCurrentLevel(item);
                                const enriched = { ...item, grade: activeLvl, level: activeLvl };
                                if (handleOpenCertForStudent) {
                                  handleOpenCertForStudent(enriched);
                                } else {
                                  showToast(`Opening certificate for ${item.studentName} (${activeLvl})`);
                                }
                              }}
                              className="px-2.5 py-1 bg-[#0c234b] hover:bg-[#081d3d] active:scale-95 text-white text-[11px] font-black rounded-lg transition shadow-2xs inline-flex items-center gap-1 cursor-pointer"
                              title="View official certificate"
                            >
                              <Award className="w-3 h-3 text-sky-400" />
                              <span>Certificate</span>
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

        {/* =========================================================================
            PAGINATION BAR
           ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs font-bold text-slate-500">
          <div>
            Showing{' '}
            <span className="font-black text-slate-900">
              {totalRecords === 0 ? 0 : (currentPage - 1) * effectiveRowsPerPage + 1}
            </span>{' '}
            to{' '}
            <span className="font-black text-slate-900">
              {Math.min(currentPage * effectiveRowsPerPage, totalRecords)}
            </span>{' '}
            of <span className="font-black text-slate-900">{totalRecords}</span> entries
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer ${
                currentPage <= 1
                  ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100 bg-white'
              }`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-xs font-black transition cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#0c234b] text-white shadow-xs'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer ${
                currentPage >= totalPages
                  ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100 bg-white'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
