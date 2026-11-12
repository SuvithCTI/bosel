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

  CheckSquare,

  Square,

  Phone,

  Calendar,

  Save,

  ChevronDown,

  Layers

} from 'lucide-react';

import { exportPdfFromElement } from '../../utils/pdfExport';

import { getStoredCourses } from '../../data/coursesData';

import MergedStudentPdfModal from '../../components/MergedStudentPdfModal';

import { getCoursePrefix, getRegisteredUsers } from '../../utils/authStorage';

import { getCourseSubjectModules } from '../../components/OfficialMarksheetView';

import { getStudentPhotoUrl, getStudentRegisterNumber } from '../../utils/studentDataHelpers';

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
    let parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) parsed = [];

    // Also get all registered students from official student registration
    const registeredUsers = getRegisteredUsers().filter(u => u.role !== 'Super Admin' && u.role !== 'Branch Head');

    // Map registered users to enquiry structure with 100% full detail fidelity
    const registeredEnquiries = registeredUsers.map(u => {
      const parent = u.parentName || u.fatherName || '';
      const regNo = u.registerNumber || u.registrationNo || getStudentRegisterNumber(u);
      return {
        id: u.userId,
        userId: u.userId,
        admissionNo: regNo,
        registerNumber: regNo,
        registerNumbers: Array.isArray(u.registerNumbers) ? u.registerNumbers : (regNo ? regNo.split(',').map(s => s.trim()) : []),
        branchName: u.branch || u.institution || 'Tenkasi Regional Branch',
        branch: u.branch || u.institution || 'Tenkasi Regional Branch',
        institution: u.institution || u.branch || 'Tenkasi Regional Branch',
        studentName: u.studentName || u.name || 'Student',
        name: u.studentName || u.name || 'Student',
        parentName: parent,
        fatherName: parent,
        courseName: u.program || u.courseName || 'Abacus Speed Arithmetic',
        program: u.program || u.courseName || 'Abacus Speed Arithmetic',
        grade: u.grade || u.level || u.courseLevel || 'Level 1',
        level: u.level || u.grade || u.courseLevel || 'Level 1',
        courseLevel: u.courseLevel || u.level || u.grade || 'Level 1',
        courseDuration: u.courseDuration || u.duration || '6 Months',
        duration: u.duration || u.courseDuration || '6 Months',
        selectedCourses: Array.isArray(u.selectedCourses) ? u.selectedCourses : (Array.isArray(u.courses) ? u.courses : []),
        courses: Array.isArray(u.selectedCourses) ? u.selectedCourses : (Array.isArray(u.courses) ? u.courses : []),
        mobile: u.phone || '',
        phone: u.phone || '',
        alternatePhone: u.alternatePhone || u.alternativePhone || '',
        email: u.email || '',
        submitted: u.enrolmentDate || u.date || new Date().toISOString().split('T')[0],
        date: u.date || u.enrolmentDate || new Date().toISOString().split('T')[0],
        enrolmentDate: u.enrolmentDate || u.date || '',
        status: u.status || 'Confirmed',
        feeStatus: (u.feePaymentType === 'Paid' || u.feePaymentType === 'Pay Now') ? 'Paid' : 'Pending',
        feePaymentType: u.feePaymentType || 'Pay Now',
        feeAmount: u.feeAmount || '₹450',
        paymentMode: u.paymentMode || 'UPI / QR Code',
        receiptRefNo: u.receiptRefNo || '',
        gender: u.gender || 'Male',
        dob: u.dob || u.dateOfBirth || '',
        dateOfBirth: u.dateOfBirth || u.dob || '',
        age: u.age !== undefined && u.age !== null ? String(u.age) : '',
        studentClass: u.studentClass || '',
        studentStage: u.studentStage || '',
        address: u.address || '',
        village: u.village || '',
        city: u.city || '',
        district: u.district || '',
        pincode: u.pincode || u.pinCode || '',
        aadharNumber: u.aadharNumber || u.aadhaarNumber || u.aadhaar || '',
        aadhaarNumber: u.aadhaarNumber || u.aadharNumber || u.aadhaar || '',
        aadhaar: u.aadharNumber || u.aadhaarNumber || u.aadhaar || '',
        studentPhoto: u.studentPhoto || u.photoUrl || null,
        photoUrl: u.photoUrl || u.studentPhoto || null,
        results: u.results || [],
        events: u.events || []
      };
    });

    // Merge registered enquiries on top so registered users ALWAYS take precedence
    const regIds = new Set(registeredEnquiries.map(r => (r.userId || r.id).toLowerCase()));
    const nonDuplicatedParsed = parsed.filter(p => !regIds.has((p.userId || p.id || '').toLowerCase()));
    const combined = [...registeredEnquiries, ...nonDuplicatedParsed];

    return combined.length > 0 ? combined : DEFAULT_STUDENT_ENQUIRIES;
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

  setViewingMergedPdfStudent,

  showToast = () => {},

  schoolsList = []

}) {

  const [enquiries, setEnquiries] = useState(() => getStoredStudentEnquiries());

  const [courses, setCourses] = useState(() => getStoredCourses());

  const [selectedIds, setSelectedIds] = useState([]);

  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const [localMergedPdfData, setLocalMergedPdfData] = useState(null);

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

// Search & Pagination

  const [searchQuery, setSearchQuery] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [currentPage, setCurrentPage] = useState(1);

  // Status edit tracker: { [enquiryId]: status }

  const [pendingStatusUpdates, setPendingStatusUpdates] = useState({});

  // Level selector tracker per student: { [enquiryId]: level }

  const [studentLevels, setStudentLevels] = useState({});

  // Sync with localStorage updates

  useEffect(() => {

    const handleUpdate = () => setEnquiries(getStoredStudentEnquiries());

    window.addEventListener('bsel_enquiries_updated', handleUpdate);
    window.addEventListener('bsel_users_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {

      window.removeEventListener('bsel_enquiries_updated', handleUpdate);
      window.removeEventListener('bsel_users_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);

    };

  }, []);

  // Filtered dataset

  const filteredRecords = useMemo(() => {

    return enquiries.filter((item) => {

      // 1. Branch scoping if activeBranch is specific

      if (activeBranch && activeBranch !== 'All branches') {

        const itemBranch = (item.branchName || item.branch || item.institution || '').toLowerCase();

        const target = activeBranch.toLowerCase();

        if (!itemBranch.includes(target) && !target.includes(itemBranch)) {

          return false;

        }

      }

      // 2. Search query filter

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

  }, [enquiries, activeBranch, searchQuery]);

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

  // Build authentic merged student packages (Page 1: Certificate, Page 2: Marksheet)

  const buildStudentPackages = (targetStudents) => {

    return targetStudents.map((item, index) => {

      const activeLvl = getStudentCurrentLevel(item);

      const regNo = item.admissionNo || item.registerNumber || getStudentRegisterNumber(item) || `REG-${index + 1}`;

      const courseName = item.courseName || item.program || 'Abacus';

      const coursePrefix = getCoursePrefix(courseName);

      const cleanLevel = String(activeLvl || '1').replace(/\D/g, '') || '1';

      const regDigits = String(regNo).replace(/\D/g, '');

      const seqDigits = regDigits ? String(parseInt(regDigits.slice(-3), 10) || (index + 1)).padStart(4, '0') : String(index + 1).padStart(4, '0');

      const certNo = (item.certificateNo && !item.certificateNo.includes('BSEL/ABACUS/L1/0007'))

        ? item.certificateNo

        : `BSEL/${coursePrefix}/L${cleanLevel}/${seqDigits}`;

      const photo = item.studentPhoto || item.photoUrl || getStudentPhotoUrl(item, index) || null;

      const safeStudent = (item.studentName || item.name || 'Student').trim().replace(/[^a-zA-Z0-9]/g, '_');

      const safeRegNo = (regNo || 'REG').trim().replace(/[^a-zA-Z0-9]/g, '_');

      const filename = `BSEL_Merged_Certificate_Marksheet_${safeStudent}_${safeRegNo}.pdf`;

      const certData = {

        studentName: item.studentName || item.name || 'Candidate Name',

        courseName: courseName,

        programPrefix: 'MINDSPARC',

        level: activeLvl,

        grade: item.results?.[0]?.rank || 'A',

        duration: item.duration || '6 Months',

        registrationNo: regNo,

        certificateNo: certNo,

        centreName: item.branchName || item.branch || item.institution || activeBranch || 'Test Branch',

        centreCode: item.centreCode || '545454',

        centreAddress: item.address || 'Tenkasi, Tamil Nadu',

        issueDate: item.submitted ? item.submitted.split(' ')[0] : '05-10-2026',

        certificateType: 'COMPLETION',

        studentPhoto: photo

      };

      const subjects = getCourseSubjectModules(courseName);

      const totalMax = subjects.reduce((sum, s) => sum + (s.max || 100), 0);

      const totalMarks = subjects.reduce((sum, s) => sum + (s.marks || 95), 0);

      const percentage = ((totalMarks / totalMax) * 100).toFixed(1);

      const marksheetData = {

        ...item,

        studentName: item.studentName || item.name || 'Candidate Name',

        courseName: courseName,

        photoUrl: photo,

        studentPhoto: photo,

        registerNumber: regNo,

        registrationNo: regNo,

        certificateNo: certNo,

        level: activeLvl,

        duration: item.duration || '6 Months',

        school: item.branchName || item.branch || item.institution || activeBranch || 'Test Branch',

        address: item.address || 'Tenkasi, Tamil Nadu',

        subjects,

        totalMax,

        totalMarks,

        percentage,

        resultText: percentage >= 85 ? 'FIRST CLASS WITH DISTINCTION' : 'FIRST CLASS',

        overallGrade: percentage >= 90 ? 'O (Outstanding)' : percentage >= 80 ? 'A+ (Excellent)' : 'A (Very Good)',

        marksheetNo: `BSEL/MS/2026/${String(item.userId || item.id || '').replace(/\D/g, '').slice(-4) || '1042'}`,

        issueDate: item.submitted ? item.submitted.split(' ')[0] : '05-10-2026'

      };

      return {

        student: item,

        certData,

        marksheetData,

        filename

      };

    });

  };

  const handleMergePrintCertificates = () => {

    const selected = getSelectedStudentObjects();

    const targetStudents = selected.length > 0 ? selected : paginatedRecords;

    if (targetStudents.length === 0) {

      alert('No student records found to generate certificates.');

      return;

    }

    const packages = buildStudentPackages(targetStudents);

    const modalData = {

      students: packages,

      autoDownload: false

    };

    showToast(`Opening merged certificates for ${packages.length} candidate(s)...`);

    if (setViewingMergedPdfStudent) {

      setViewingMergedPdfStudent(modalData);

    } else {

      setLocalMergedPdfData(modalData);

    }

  };

  const handleDownloadMergedPdf = () => {

    const selected = getSelectedStudentObjects();

    const targetStudents = selected.length > 0 ? selected : paginatedRecords;

    if (targetStudents.length === 0) {

      alert('No student records found to download merged PDF.');

      return;

    }

    const packages = buildStudentPackages(targetStudents);

    showToast(`Generating merged PDF for ${packages.length} candidate(s)...`);

    if (setViewingMergedPdfStudent) {

      setViewingMergedPdfStudent({

        students: packages,

        autoDownload: true

      });

    } else {

      setLocalMergedPdfData({

        students: packages,

        autoDownload: true

      });

    }

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

      </div>      {/* =========================================================================

          STUDENT ENQUIRIES & BATCH ACTIONS

         ========================================================================= */}

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">

        {/* Header & Primary Actions */}

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 pb-3 border-b border-slate-100">

          <div>

            <div className="flex items-center gap-2.5">

              <h2 className="text-xl sm:text-2xl font-black text-[#081d3d] font-heading tracking-tight">

                Student Enquiries

              </h2>

              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-sky-50 text-sky-700 border border-sky-200/80">

                {filteredRecords.length}

              </span>

            </div>

            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {isSelectionMode ? (
                selectedIds.length > 0 ? (
                  <span className="text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200 inline-block mt-0.5">
                    {selectedIds.length} candidate{selectedIds.length > 1 ? 's' : ''} selected
                  </span>
                ) : (
                  'Choose student records with the checkboxes in the table'
                )
              ) : (
                'Admissions, exam records, and official certificates'
              )}
            </p>
          </div>
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {!isSelectionMode ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsSelectionMode(true)}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Enable selection checkboxes to pick specific candidates"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-sky-600" />
                  <span>Select Records</span>
                </button>
                <button
                  type="button"
                  onClick={handleMergePrintCertificates}
                  className="px-3.5 py-2 text-xs font-black rounded-xl bg-[#081d3d] hover:bg-[#0c2b5b] active:scale-95 text-white transition flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-300" />
                  <span>Merge & Print All</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadMergedPdf}
                  className="px-3.5 py-2 text-xs font-black rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white transition flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-white" />
                  <span>Download Merged PDF</span>
                </button>
              </>
            ) : (
              <>
                {selectedIds.length > 0 && (
                  <>
                    <button
                      type="button"
                      onClick={handleApproveSelected}
                      className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>Approve ({selectedIds.length})</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteSelected}
                      className="px-3.5 py-2 text-xs font-bold rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>Delete ({selectedIds.length})</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleMergePrintCertificates}
                      className="px-3.5 py-2 text-xs font-black rounded-xl bg-[#081d3d] hover:bg-[#0c2b5b] active:scale-95 text-white transition flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-300" />
                      <span>Print Selected ({selectedIds.length})</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadMergedPdf}
                      className="px-3.5 py-2 text-xs font-black rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white transition flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5 text-white" />
                      <span>Download PDF ({selectedIds.length})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedIds([])}
                      className="px-2.5 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                    >
                      Clear
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsSelectionMode(false);
                    setSelectedIds([]);
                  }}
                  className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  Exit Selection
                </button>
              </>
            )}
          </div>
        </div>
        {/* Search Bar & Rows Per Page */}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-0.5">

          <div className="relative flex-1 max-w-md">

            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />

            <input

              type="text"

              value={searchQuery}

              onChange={(e) => {

                setSearchQuery(e.target.value);

                setCurrentPage(1);

              }}

              placeholder="Search records by name, course, branch, mobile..."

              className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-100 outline-none transition"

            />

            {searchQuery && (

              <button

                type="button"

                onClick={() => {

                  setSearchQuery('');

                  setCurrentPage(1);

                }}

                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs px-1 font-bold cursor-pointer"

              >

                ✕

              </button>

            )}

          </div>

          <div className="flex items-center justify-end gap-2 text-xs">

            <span className="font-semibold text-slate-500">Rows per page:</span>

            <select

              value={rowsPerPage}

              onChange={(e) => {

                setRowsPerPage(e.target.value === 'All' ? 'All' : Number(e.target.value));

                setCurrentPage(1);

              }}

              className="bg-slate-50 hover:bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none cursor-pointer focus:ring-2 focus:ring-sky-100 transition"

            >

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

          <div className="w-full overflow-hidden">

            <table className="w-full text-left border-collapse text-xs">

              {/* Header */}

              <thead className="bg-[#f8fafc] text-slate-500 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider select-none">

                <tr>

                  {isSelectionMode && (

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

                  )}

                  <th className="py-3 px-3">ADMISSION NO.</th>

                  <th className="py-3 px-3">BRANCH NAME</th>

                  <th className="py-3 px-3">STUDENT NAME</th>

                  <th className="py-3 px-3">COURSE NAME</th>

                  <th className="py-3 px-3">MOBILE</th>

                  <th className="py-3 px-3 text-center">LEVEL DOCUMENTS</th>

                </tr>

              </thead>

              {/* Body */}

              <tbody className="divide-y divide-slate-100 font-medium">

                {paginatedRecords.length === 0 ? (

                  <tr>

                    <td colSpan={isSelectionMode ? 7 : 6} className="py-12 text-center text-slate-400">

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

                        {/* 1. Checkbox (Only shown when selection mode is enabled) */}

                        {isSelectionMode && (

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

                        )}

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

      {/* Local Merged Certificate & Marksheet Modal Fallback */}

      {localMergedPdfData && !setViewingMergedPdfStudent && (

        <MergedStudentPdfModal

          data={localMergedPdfData}

          onClose={() => setLocalMergedPdfData(null)}

          showToast={showToast}

        />

      )}

    </div>

  );

}



