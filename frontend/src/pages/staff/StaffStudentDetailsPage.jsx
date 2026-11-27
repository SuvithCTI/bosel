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
  Layers,
  Pencil,
  UserPlus,
  Ticket,
  FileSpreadsheet,
  Edit3,
  School,
  Paperclip
} from 'lucide-react';

import { exportPdfFromElement } from '../../utils/pdfExport';
import { getStoredCourses } from '../../data/coursesData';
import MergedStudentPdfModal from '../../components/MergedStudentPdfModal';
import AdmissionModal from '../../components/AdmissionModal';
import StudentAvatar from '../../components/StudentAvatar';
import EventRegisterModal from '../../components/EventRegisterModal';
import StudentQuestionPaperView from '../../components/StudentQuestionPaperView';
import { getCoursePrefix, getRegisteredUsers, getActiveSession } from '../../utils/authStorage';
import { isStudentUser } from '../../utils/studentValidator';
import { getCourseSubjectModules } from '../../components/OfficialMarksheetView';
import { getSavedMarksheet, getGrade } from '../../utils/marksheetStorage';
import {
  getStudentPhotoUrl,
  getStudentRegisterNumber,
  getStudentScopeKey,
  readStudentUploadedQuestions,
  resolveStudentGrade,
} from '../../utils/studentDataHelpers';
import CompactSelect from '../../components/CompactSelect';
import { ACADEMIC_STAGES, getAcademicStageFromAge } from '../../utils/academicStages';

// Initial default enquiries (empty - real student records created through portal)
export const DEFAULT_STUDENT_ENQUIRIES = [];

export const getStoredStudentEnquiries = () => {
  if (typeof window === 'undefined') return DEFAULT_STUDENT_ENQUIRIES;
  try {
    // Remove local storage of student enquiries
    localStorage.removeItem('bsel_student_enquiries');

    // Get registered genuine students from registration registry
    const registeredUsers = getRegisteredUsers().filter(isStudentUser);

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
        branchName: u.schoolName || u.franchiseName || u.branch || u.institution || 'Tenkasi Regional Branch',
        branch: u.branch || u.institution || 'Tenkasi Regional Branch',
        institution: u.institution || u.schoolName || u.franchiseName || u.branch || 'Tenkasi Regional Branch',
        schoolName: u.schoolName || (u.admissionCategory === 'school' || u.schoolId ? (u.institution || '') : ''),
        franchiseName: u.franchiseName || (u.admissionCategory === 'franchise' || u.franchiseId ? (u.institution || '') : ''),
        schoolId: u.schoolId || null,
        franchiseId: u.franchiseId || null,
        admissionCategory: u.admissionCategory || 'Branch',
        studentName: u.studentName || u.name || 'Student',
        name: u.studentName || u.name || 'Student',
        parentName: parent,
        fatherName: parent,
        courseName: u.program || u.courseName || 'Abacus Speed Arithmetic',
        program: u.program || u.courseName || 'Abacus Speed Arithmetic',
        grade: (Array.isArray(u.selectedCourses) && u.selectedCourses[0]?.level) || (Array.isArray(u.courses) && u.courses[0]?.level) || u.level || u.courseLevel || u.grade || ((u.program || u.courseName || '').match(/(?:Level|Lvl|L|Module|Stage)\s*(\d+)/i) ? `Level ${(u.program || u.courseName).match(/(?:Level|Lvl|L|Module|Stage)\s*(\d+)/i)[1]}` : 'Level 1'),
        level: (Array.isArray(u.selectedCourses) && u.selectedCourses[0]?.level) || (Array.isArray(u.courses) && u.courses[0]?.level) || u.level || u.courseLevel || u.grade || ((u.program || u.courseName || '').match(/(?:Level|Lvl|L|Module|Stage)\s*(\d+)/i) ? `Level ${(u.program || u.courseName).match(/(?:Level|Lvl|L|Module|Stage)\s*(\d+)/i)[1]}` : 'Level 1'),
        courseLevel: (Array.isArray(u.selectedCourses) && u.selectedCourses[0]?.level) || (Array.isArray(u.courses) && u.courses[0]?.level) || u.courseLevel || u.level || u.grade || ((u.program || u.courseName || '').match(/(?:Level|Lvl|L|Module|Stage)\s*(\d+)/i) ? `Level ${(u.program || u.courseName).match(/(?:Level|Lvl|L|Module|Stage)\s*(\d+)/i)[1]}` : 'Level 1'),
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
        feeStatus: u.feeStatus || (u.feePaymentType === 'Pay Later' ? 'Pending' : (u.feePaymentType === 'Rejected' ? 'Rejected' : (['Paid', 'Pay Now', 'Approved', 'Paid Online'].includes(u.feePaymentType) ? 'Paid' : 'Pending'))),
        feePaymentType: u.feePaymentType || (u.feePaymentType === 'Pay Later' ? 'Pay Later' : 'Pay Now'),
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
        studentPhoto: u.studentPhoto || u.photoUrl || u.photo_url || u.photo || null,
        photoUrl: u.photoUrl || u.studentPhoto || u.photo_url || u.photo || null,
        photo_url: u.photo_url || u.photoUrl || u.studentPhoto || u.photo || null,
        results: u.results || [],
        events: u.events || []
      };
    });

    return registeredEnquiries.length > 0 ? registeredEnquiries : DEFAULT_STUDENT_ENQUIRIES;
  } catch {
    return DEFAULT_STUDENT_ENQUIRIES;
  }
};

export const saveStoredStudentEnquiries = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('bsel_student_enquiries');
    window.dispatchEvent(new Event('bsel_enquiries_updated'));
  } catch (_) {}
};

// Resolve a student's photo (uploaded photo first, then stored fallbacks)
const getStudentPhotoSrc = (item) => {
  return item?.studentPhoto || item?.photoUrl || item?.photo_url || item?.photo || getStudentPhotoUrl(item) || null;
};

const getInitials = (name = '') => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return parts.slice(0, 2).map((p) => p[0].toUpperCase()).join('');
};

export default function StaffStudentDetailsPage({
  activeBranch = 'All branches',
  branchStudents = null,
  portalType = null,
  entityName = null,
  setViewingAdmissionStudent,
  handleOpenMarksheet,
  handleOpenCertForStudent,
  handleOpenEventRegForStudent,
  handleOpenQuestionPaperForStudent,
  setViewingMergedPdfStudent,
  showToast = () => {},
  schoolsList = []
}) {
  const session = useMemo(() => getActiveSession() || {}, []);
  const effectivePortalType = portalType || (session.role === 'School' || session.schoolId ? 'school' : (session.role === 'Franchise' || session.franchiseId ? 'franchise' : 'branch'));
  const [enquiries, setEnquiries] = useState(() => getStoredStudentEnquiries());
  const [courses, setCourses] = useState(() => getStoredCourses());
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [localMergedPdfData, setLocalMergedPdfData] = useState(null);
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [internalEventRegStudent, setInternalEventRegStudent] = useState(null);
  const [internalQuestionPaperStudent, setInternalQuestionPaperStudent] = useState(null);

  const handleOpenEvent = (student) => {
    if (handleOpenEventRegForStudent) {
      handleOpenEventRegForStudent(student);
    } else {
      setInternalEventRegStudent(student);
    }
  };

  const handleOpenQuestionPaper = (student) => {
    if (handleOpenQuestionPaperForStudent) {
      handleOpenQuestionPaperForStudent(student);
    } else {
      setInternalQuestionPaperStudent(student);
    }
  };

  // Category determination
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

  // Determine Class and Level Academic Category for any student
  const getStudentAcademicCategory = (student) => {
    if (!student) {
      return {
        className: 'Class 1',
        stage: 'SUB-JUNIOR (Class 1)',
        level: 'Level 1',
        levelNum: 1,
        classBadgeClass: 'bg-amber-50 text-amber-900 border-amber-300'
      };
    }

    const gradeStr = String(student.grade || student.level || '').trim();

    // 1. Detect Level from grade, level, courseLevel, selectedCourses, or embedded in courseName
    let level = '';
    let levelNum = null;
    const rawToCheck = [
      student.level,
      student.courseLevel,
      student.grade,
      Array.isArray(student.selectedCourses) ? student.selectedCourses.map(c => c?.level).join(' ') : '',
      student.courseName,
      student.program
    ].filter(Boolean).join(' ');

    const levelMatch = rawToCheck.match(/(?:Level|Lvl|L|Module|Stage)\s*(\d+)/i);
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
      matchedStage = ACADEMIC_STAGES.find(s => s.stage === student.studentStage || s.label?.toLowerCase() === student.studentStage?.toLowerCase());
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

    if (!matchedStage && (student.studentClass || student.standard || student.className)) {
      const cls = (student.studentClass || student.standard || student.className).toLowerCase();
      matchedStage = ACADEMIC_STAGES.find(s => s.className?.toLowerCase() === cls || s.stage?.toLowerCase().includes(cls));
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
      if (ageStage?.stage) {
        matchedStage = ACADEMIC_STAGES.find(s => s.stage === ageStage.stage);
      }
    }

    if (!matchedStage) {
      matchedStage = ACADEMIC_STAGES[0];
    }

    const className = matchedStage?.className || 'Class 1';
    const stage = matchedStage?.stage || '';

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

    return {
      className,
      stage,
      level,
      levelNum,
      classBadgeClass
    };
  };

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

  // Search & Pagination & 5-Filter Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [classFilter, setClassFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Category options: Branch, Academy, School
  const categoryOptions = useMemo(() => [
    { value: 'All', label: 'All Categories' },
    { value: 'Branch', label: 'Branch' },
    { value: 'Academy', label: 'Academy' },
    { value: 'School', label: 'School' }
  ], []);

  // Official courses for filtering
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

  // Class options
  const classOptions = useMemo(() => [
    { value: 'All', label: 'All Classes' },
    ...ACADEMIC_STAGES.map((s) => ({
      value: s.className,
      label: s.className,
      stage: s.stage
    }))
  ], []);

  // Level options
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

  // Normalize scoped branchStudents if passed from Franchise/School dashboard
  const normalizedBranchStudents = useMemo(() => {
    if (!Array.isArray(branchStudents)) return null;
    return branchStudents.filter(isStudentUser).map(u => {
      const parent = u.parentName || u.fatherName || '';
      const regNo = u.registerNumber || u.registrationNo || getStudentRegisterNumber(u);
      return {
        ...u,
        id: u.userId || u.id || regNo,
        userId: u.userId || u.id,
        admissionNo: regNo,
        registerNumber: regNo,
        registerNumbers: Array.isArray(u.registerNumbers) ? u.registerNumbers : (regNo ? regNo.split(',').map(s => s.trim()) : []),
        branchName: u.schoolName || u.franchiseName || u.institution || u.branch || activeBranch,
        branch: u.branch || u.institution || activeBranch,
        institution: u.institution || u.schoolName || u.franchiseName || u.branch || activeBranch,
        schoolName: u.schoolName || (u.admissionCategory === 'school' || u.schoolId ? (u.institution || '') : ''),
        franchiseName: u.franchiseName || (u.admissionCategory === 'franchise' || u.franchiseId ? (u.institution || '') : ''),
        schoolId: u.schoolId || null,
        franchiseId: u.franchiseId || null,
        admissionCategory: u.admissionCategory || 'Branch',
        studentName: u.studentName || u.name || 'Student',
        name: u.studentName || u.name || 'Student',
        parentName: parent,
        fatherName: parent,
        courseName: u.program || u.courseName || 'Abacus Speed Arithmetic',
        program: u.program || u.courseName || 'Abacus Speed Arithmetic',
        grade: (Array.isArray(u.selectedCourses) && u.selectedCourses[0]?.level) || (Array.isArray(u.courses) && u.courses[0]?.level) || u.level || u.courseLevel || u.grade || ((u.program || u.courseName || '').match(/(?:Level|Lvl|L|Module|Stage)\s*(\d+)/i) ? `Level ${(u.program || u.courseName).match(/(?:Level|Lvl|L|Module|Stage)\s*(\d+)/i)[1]}` : 'Level 1'),
        level: (Array.isArray(u.selectedCourses) && u.selectedCourses[0]?.level) || (Array.isArray(u.courses) && u.courses[0]?.level) || u.level || u.courseLevel || u.grade || ((u.program || u.courseName || '').match(/(?:Level|Lvl|L|Module|Stage)\s*(\d+)/i) ? `Level ${(u.program || u.courseName).match(/(?:Level|Lvl|L|Module|Stage)\s*(\d+)/i)[1]}` : 'Level 1'),
        courseLevel: (Array.isArray(u.selectedCourses) && u.selectedCourses[0]?.level) || (Array.isArray(u.courses) && u.courses[0]?.level) || u.courseLevel || u.level || u.grade || ((u.program || u.courseName || '').match(/(?:Level|Lvl|L|Module|Stage)\s*(\d+)/i) ? `Level ${(u.program || u.courseName).match(/(?:Level|Lvl|L|Module|Stage)\s*(\d+)/i)[1]}` : 'Level 1'),
        courseDuration: u.courseDuration || u.duration || '6 Months',
        duration: u.duration || u.courseDuration || '6 Months',
        selectedCourses: Array.isArray(u.selectedCourses) ? u.selectedCourses : (Array.isArray(u.courses) ? u.courses : []),
        courses: Array.isArray(u.selectedCourses) ? u.selectedCourses : (Array.isArray(u.courses) ? u.courses : []),
        mobile: u.phone || u.mobile || '',
        phone: u.phone || u.mobile || '',
        alternatePhone: u.alternatePhone || u.alternativePhone || '',
        email: u.email || '',
        submitted: u.enrolmentDate || u.date || new Date().toISOString().split('T')[0],
        date: u.date || u.enrolmentDate || new Date().toISOString().split('T')[0],
        enrolmentDate: u.enrolmentDate || u.date || '',
        status: u.status || 'Confirmed',
        feeStatus: u.feeStatus || (u.feePaymentType === 'Pay Later' ? 'Pending' : (u.feePaymentType === 'Rejected' ? 'Rejected' : (['Paid', 'Pay Now', 'Approved', 'Paid Online'].includes(u.feePaymentType) ? 'Paid' : 'Pending'))),
        feePaymentType: u.feePaymentType || (u.feePaymentType === 'Pay Later' ? 'Pay Later' : 'Pay Now'),
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
        studentPhoto: u.studentPhoto || u.photoUrl || u.photo_url || u.photo || null,
        photoUrl: u.photoUrl || u.studentPhoto || u.photo_url || u.photo || null,
        photo_url: u.photo_url || u.photoUrl || u.studentPhoto || u.photo || null,
        results: u.results || [],
        events: u.events || []
      };
    });
  }, [branchStudents, activeBranch]);

  // Filtered dataset
  const filteredRecords = useMemo(() => {
    const dataset = normalizedBranchStudents !== null ? normalizedBranchStudents : enquiries;
    return dataset.filter((item) => {
      // 1. Branch scoping if activeBranch is specific and no explicit branchStudents was supplied
      if (normalizedBranchStudents === null && activeBranch && activeBranch !== 'All branches') {
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
          (item.registerNumber || '').toLowerCase().includes(q) ||
          (item.userId || '').toLowerCase().includes(q) ||
          (item.studentName || item.name || '').toLowerCase().includes(q) ||
          (item.branchName || item.branch || '').toLowerCase().includes(q) ||
          (item.courseName || item.program || '').toLowerCase().includes(q) ||
          (item.mobile || item.phone || '').includes(q) ||
          (item.status || '').toLowerCase().includes(q);
        if (!matches) return false;
      }

      // 3. Category Filter (Branch, Academy, School)
      if (categoryFilter && categoryFilter !== 'All') {
        const itemCat = getStudentCategory(item).toLowerCase();
        const targetCat = categoryFilter.toLowerCase();
        if (targetCat === 'branch' || targetCat === 'individual') {
          if (itemCat !== 'branch' && itemCat !== 'individual') return false;
        } else if (targetCat === 'academy' || targetCat === 'franchise') {
          if (itemCat !== 'academy' && itemCat !== 'franchise') return false;
        } else if (itemCat !== targetCat) {
          return false;
        }
      }

      // 4. Class Filter
      if (classFilter !== 'All') {
        const itemClass = (item.standard || item.class || item.className || item.grade || '').toLowerCase();
        const targetClass = classFilter.toLowerCase();
        if (!itemClass.includes(targetClass)) return false;
      }

      // 5. Level Filter
      if (levelFilter !== 'All') {
        const itemLevel = (item.level || item.grade || item.courseLevel || '').toLowerCase();
        const targetLevel = levelFilter.toLowerCase().replace('_', ' ');
        if (!itemLevel.includes(targetLevel) && !itemLevel.includes(levelFilter.toLowerCase())) return false;
      }

      // 6. Course Filter
      if (courseFilter !== 'All') {
        const selectedCourseObj = allCourses.find((c) => c.value === courseFilter);
        const itemCourse = (item.courseName || item.program || '').toLowerCase();
        if (selectedCourseObj && selectedCourseObj.keywords) {
          const match = selectedCourseObj.keywords.some((kw) => itemCourse.includes(kw.toLowerCase()));
          if (!match && !itemCourse.includes(courseFilter.toLowerCase())) return false;
        } else if (!itemCourse.includes(courseFilter.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [enquiries, normalizedBranchStudents, activeBranch, searchQuery, categoryFilter, classFilter, levelFilter, courseFilter, allCourses]);

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
  const getRecordKey = (r) => r?.id || r?.admissionNo || r?.userId;

  const isAllSelected =
    filteredRecords.length > 0 &&
    filteredRecords.every((r) => selectedIds.includes(getRecordKey(r)));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      const allIds = filteredRecords.map(getRecordKey).filter(Boolean);
      setSelectedIds(allIds);
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

  // Edit opens the existing admission view if provided
  const handleEditStudent = (item) => {
    if (setViewingAdmissionStudent) {
      setViewingAdmissionStudent(item);
    } else {
      showToast(`Editing ${item.studentName || item.name || 'student'}`);
    }
  };

  // Delete a single row with confirmation
  const handleDeleteSingle = (item) => {
    const rowId = item.id || item.admissionNo;
    const label = item.studentName || item.name || 'this student';

    if (!window.confirm(`Delete the record for ${label}?`)) return;

    const updated = enquiries.filter((r) => (r.id || r.admissionNo) !== rowId);
    setEnquiries(updated);
    saveStoredStudentEnquiries(updated);
    setSelectedIds((prev) => prev.filter((id) => id !== rowId));
    showToast(`Removed record for ${label}.`);
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

  // Level selector per student (if manually updated)
  const handleLevelChange = (rowId, newLevel) => {
    setStudentLevels((prev) => ({ ...prev, [rowId]: newLevel }));
  };

  // Fixed student admission level resolution
  const getStudentCurrentLevel = (item) => {
    if (!item) return 'Level 1';
    const rowId = item.id || item.admissionNo || item.userId;

    // 1. If an admin explicitly overrode this row in local state
    if (studentLevels[rowId]) {
      return studentLevels[rowId];
    }

    // 2. Extract from selectedCourses array (from official student admission)
    let rawLevel = '';
    if (Array.isArray(item.selectedCourses) && item.selectedCourses.length > 0) {
      const prog = (item.courseName || item.program || '').toLowerCase();
      const matchedCourse = item.selectedCourses.find(c =>
        c && c.courseName && prog.includes(c.courseName.toLowerCase())
      ) || item.selectedCourses[0];

      if (matchedCourse && (matchedCourse.level || matchedCourse.grade)) {
        rawLevel = matchedCourse.level || matchedCourse.grade;
      }
    }

    // 3. Check direct student level fields
    if (!rawLevel) {
      rawLevel = item.level || item.courseLevel || item.grade || '';
    }

    // 4. Handle combined multi-course strings, e.g. "Abacus Speed Math: Level 4 | Fine Arts: Level 1"
    if (rawLevel && typeof rawLevel === 'string' && rawLevel.includes('|')) {
      const parts = rawLevel.split('|');
      const prog = (item.courseName || item.program || '').toLowerCase();
      const matchedPart = parts.find(p => prog.includes(p.split(':')[0]?.trim().toLowerCase())) || parts[0];
      if (matchedPart && matchedPart.includes(':')) {
        rawLevel = matchedPart.split(':')[1]?.trim() || rawLevel;
      }
    }

    // 5. If rawLevel is missing or generic "Level 1" / "Class 1", check if level is embedded in courseName or program, e.g. "Abacus Speed Math (Level 4) & Fine Arts"
    if (!rawLevel || rawLevel === 'Level 1' || String(rawLevel).toLowerCase().startsWith('class')) {
      const embeddedMatch = (item.courseName || item.program || '').match(/(?:Level|Lvl|L|Module|Stage)\s*(\d+)/i);
      if (embeddedMatch) {
        rawLevel = `Level ${embeddedMatch[1]}`;
      }
    }

    // 6. Check results or events
    if (!rawLevel || rawLevel === 'Level 1') {
      if (Array.isArray(item.results) && item.results[0]?.level) {
        rawLevel = item.results[0].level;
      } else if (Array.isArray(item.events) && item.events[0]?.level) {
        rawLevel = item.events[0].level;
      }
    }

    const available = getLevelsForProgram(item.courseName || item.program);

    if (rawLevel) {
      const cleanRaw = String(rawLevel).trim();

      // Direct exact match
      const exactMatch = available.find(
        (l) => l.value.toLowerCase() === cleanRaw.toLowerCase() ||
               l.label?.toLowerCase() === cleanRaw.toLowerCase() ||
               l.shortLabel?.toLowerCase() === cleanRaw.toLowerCase()
      );
      if (exactMatch) return exactMatch.value;

      // Extract number: e.g. "Level 4: Combination Formulas..." -> "Level 4"
      const numMatch = cleanRaw.match(/(?:Level|Lvl|L|Module|Stage)\s*(\d+)/i);
      if (numMatch) {
        const num = numMatch[1];
        const numLevelMatch = available.find((l) => {
          const lNum = String(l.value || l.shortLabel || l.label).match(/\d+/);
          return lNum && lNum[0] === num;
        });
        if (numLevelMatch) return numLevelMatch.value;
        return `Level ${num}`;
      }

      // Substring match
      const subMatch = available.find(
        (l) => cleanRaw.toLowerCase().includes(l.value.toLowerCase()) ||
               l.value.toLowerCase().includes(cleanRaw.toLowerCase())
      );
      if (subMatch) return subMatch.value;

      return cleanRaw;
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

      const photo = item.studentPhoto || item.photoUrl || item.photo_url || item.photo || getStudentPhotoUrl(item, index) || null;

      const safeStudent = (item.studentName || item.name || 'Student').trim().replace(/[^a-zA-Z0-9]/g, '_');
      const safeRegNo = (regNo || 'REG').trim().replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `BSEL_Merged_Certificate_Marksheet_${safeStudent}_${safeRegNo}.pdf`;

      // Check active franchise session for custom branding
      let fcBranding = null;
      if (typeof window !== 'undefined') {
        try {
          const sRaw = sessionStorage.getItem('bsel_active_session') || localStorage.getItem('bsel_active_session');
          if (sRaw) {
            const s = JSON.parse(sRaw);
            if (s && s.role === 'Franchise') {
              fcBranding = s;
            }
          }
        } catch (_) {}
      }

      const savedSheet = getSavedMarksheet(item);
      const hasSavedMarks = Boolean(
        savedSheet &&
        Array.isArray(savedSheet.subjects) &&
        savedSheet.subjects.length > 0 &&
        savedSheet.subjects.some((s) => s.marks !== null && s.marks !== undefined && s.marks !== '')
      );
      const resolvedGrade = resolveStudentGrade(item) || (hasSavedMarks ? savedSheet?.overallGrade : '') || item.results?.[0]?.rank || '';

      const certData = {
        studentName: item.studentName || item.name || 'Candidate Name',
        courseName: courseName,
        programPrefix: 'MINDSPARC',
        level: activeLvl,
        grade: resolvedGrade,
        duration: item.duration || '6 Months',
        registrationNo: regNo,
        certificateNo: certNo,
        centreName: item.branchName || item.branch || item.institution || activeBranch || 'Tenkasi Branch',
        centreCode: item.centreCode || '545454',
        centreAddress: item.address || 'Tenkasi, Tamil Nadu',
        issueDate: item.submitted ? item.submitted.split(' ')[0] : '05-10-2026',
        certificateType: 'COMPLETION',
        studentPhoto: photo,
        student: item,
        schoolName: fcBranding?.schoolName || item.schoolName,
        schoolSubtitle: fcBranding?.subtitle || item.schoolSubtitle,
        schoolMotto: fcBranding?.motto || item.schoolMotto,
        schoolLogo: fcBranding?.logo || item.schoolLogo,
        directorSignature: fcBranding?.signature || fcBranding?.directorSignature || item.directorSignature
      };

      const subjects = hasSavedMarks && savedSheet?.subjects?.length ? savedSheet.subjects : getCourseSubjectModules(courseName);
      const totalMax = 500;
      const totalMarks = hasSavedMarks ? (savedSheet?.totalMarks !== undefined ? savedSheet.totalMarks : subjects.reduce((sum, s) => sum + (s.marks || 0), 0)) : null;
      const percentage = hasSavedMarks && savedSheet?.percentage !== null && savedSheet?.percentage !== undefined
        ? String(savedSheet.percentage)
        : (hasSavedMarks && totalMarks !== null ? Math.round((totalMarks / totalMax) * 100) : null);
      const overallGrade = hasSavedMarks ? (savedSheet?.overallGrade || (totalMarks > 0 ? getGrade(Number(percentage) || 0) : 'D')) : '-';

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
        school: item.branchName || item.branch || item.institution || activeBranch || 'Tenkasi Branch',
        address: item.address || 'Tenkasi, Tamil Nadu',
        subjects,
        totalMax,
        totalMarks,
        percentage: percentage !== null ? String(percentage) : null,
        hasSavedMarks,
        resultText: hasSavedMarks ? (Number(percentage) >= 40 ? 'PASS' : 'FAIL') : 'PENDING',
        overallGrade,
        marksheetNo: `BSEL/MS/2026/${String(item.userId || item.id || '').replace(/\D/g, '').slice(-4) || '1042'}`,
        issueDate: item.submitted ? item.submitted.split(' ')[0] : '05-10-2026',
        schoolName: fcBranding?.schoolName || item.schoolName,
        schoolSubtitle: fcBranding?.subtitle || item.schoolSubtitle,
        schoolMotto: fcBranding?.motto || item.schoolMotto,
        schoolLogo: fcBranding?.logo || item.schoolLogo,
        directorSignature: fcBranding?.signature || fcBranding?.directorSignature || item.directorSignature
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
        autoDownload: true,
        downloadMode: 'merged'
      });
    } else {
      setLocalMergedPdfData({
        students: packages,
        autoDownload: true,
        downloadMode: 'merged'
      });
    }
  };

  const handleDownloadMarksheetsOnly = () => {
    const selected = getSelectedStudentObjects();
    const targetStudents = selected.length > 0 ? selected : paginatedRecords;

    if (targetStudents.length === 0) {
      alert('No student records found to download marksheets.');
      return;
    }

    const packages = buildStudentPackages(targetStudents);

    showToast(`Generating marksheet(s) PDF for ${packages.length} candidate(s)...`);

    const modalData = {
      students: packages,
      autoDownload: true,
      downloadMode: 'marksheet'
    };

    if (setViewingMergedPdfStudent) {
      setViewingMergedPdfStudent(modalData);
    } else {
      setLocalMergedPdfData(modalData);
    }
  };

  const handleDownloadCertificatesOnly = () => {
    const selected = getSelectedStudentObjects();
    const targetStudents = selected.length > 0 ? selected : paginatedRecords;

    if (targetStudents.length === 0) {
      alert('No student records found to download certificates.');
      return;
    }

    const packages = buildStudentPackages(targetStudents);

    showToast(`Generating certificate(s) PDF for ${packages.length} candidate(s)...`);

    const modalData = {
      students: packages,
      autoDownload: true,
      downloadMode: 'certificate'
    };

    if (setViewingMergedPdfStudent) {
      setViewingMergedPdfStudent(modalData);
    } else {
      setLocalMergedPdfData(modalData);
    }
  };

  const handleOpenMergedForStudent = (item) => {
    const packages = buildStudentPackages([item]);
    const modalData = {
      students: packages,
      autoDownload: false
    };

    if (setViewingMergedPdfStudent) {
      setViewingMergedPdfStudent(modalData);
    } else {
      setLocalMergedPdfData(modalData);
    }
    showToast(`Opening merged Certificate & Marksheet for ${item.studentName || item.name || 'Candidate'}...`);
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
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {!isSelectionMode ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowAdmissionModal(true)}
                  className="px-3.5 py-2 text-xs font-black rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-700 hover:to-teal-900 active:scale-95 text-white shadow-sm hover:shadow transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  title="Open Student Registration Form for School or Academy"
                >
                  <UserPlus className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
                  <span>Student Registration Form</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsSelectionMode(true)}
                  className="px-3.5 py-2 text-xs font-black rounded-xl bg-[#081d3d] hover:bg-[#0c2b5b] active:scale-95 text-white transition flex items-center gap-2 cursor-pointer shadow-xs"
                  title="Click to select specific student records or select all to merge and print"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>Merge</span>
                </button>

                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 whitespace-nowrap">
                  {effectivePortalType === 'school' ? 'School Record Desk' : (effectivePortalType === 'franchise' ? 'Academy Record Desk' : 'Staff Record Viewing Desk')}
                </span>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleToggleSelectAll}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs ${
                    isAllSelected
                      ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-400 font-black'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
                  }`}
                  title="Select or deselect all records"
                >
                  <CheckSquare className={`w-3.5 h-3.5 ${isAllSelected ? 'text-slate-950' : 'text-sky-600'}`} />
                  <span>{isAllSelected ? 'Deselect All' : `Select All (${filteredRecords.length})`}</span>
                </button>
                <button
                  type="button"
                  disabled={selectedIds.length === 0}
                  onClick={handleMergePrintCertificates}
                  className="px-3.5 py-2 text-xs font-black rounded-xl bg-[#081d3d] hover:bg-[#0c2b5b] active:scale-95 text-white transition flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Print merged Certificate + Marksheet for selected students"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-300" />
                  <span>Print Merged {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}</span>
                </button>
                {selectedIds.length > 0 && (
                  <>
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
                      title="Print merged Certificate + Marksheet for selected students"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-300" />
                      <span>Print Merged ({selectedIds.length})</span>
                    </button>
                    {/* Download Marksheet(s) Separately */}
                    <button
                      type="button"
                      onClick={handleDownloadMarksheetsOnly}
                      className="px-3.5 py-2 text-xs font-black rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 transition flex items-center gap-2 cursor-pointer shadow-xs"
                      title="Download Marksheet(s) separately as PDF for selected candidate(s)"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-950" />
                      <span>Marksheet ({selectedIds.length})</span>
                    </button>

                    {/* Download Certificate(s) Separately */}
                    <button
                      type="button"
                      onClick={handleDownloadCertificatesOnly}
                      className="px-3.5 py-2 text-xs font-black rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white transition flex items-center gap-2 cursor-pointer shadow-xs"
                      title="Download Certificate(s) separately as PDF for selected candidate(s)"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-200" />
                      <span>Certificate ({selectedIds.length})</span>
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

        {/* Search Bar & 5-Filter Controls Row */}
        <div className="flex flex-col gap-2 pt-0.5">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2 items-center">
            {/* Search */}
            <div className="col-span-2 md:col-span-1 xl:col-span-1 relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search candidate, ID, phone..."
                className="w-full pl-8 pr-7 py-2 text-xs border border-slate-200 rounded-lg focus:border-sky-500 focus:ring-1 focus:ring-sky-100 outline-none bg-slate-50/50 hover:bg-white focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs px-1 font-bold cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="col-span-1">
              <CompactSelect
                value={categoryFilter}
                onChange={(val) => {
                  setCategoryFilter(val);
                  setCurrentPage(1);
                }}
                options={categoryOptions}
                placeholder="All Categories"
                maxHeight="max-h-56"
              />
            </div>

            {/* Class Filter */}
            <div className="col-span-1">
              <CompactSelect
                value={classFilter}
                onChange={(val) => {
                  setClassFilter(val);
                  setCurrentPage(1);
                }}
                options={classOptions}
                placeholder="All Classes"
                maxHeight="max-h-56"
              />
            </div>

            {/* Level Filter */}
            <div className="col-span-1">
              <CompactSelect
                value={levelFilter}
                onChange={(val) => {
                  setLevelFilter(val);
                  setCurrentPage(1);
                }}
                options={levelOptions}
                placeholder="All Levels"
                maxHeight="max-h-56"
              />
            </div>

            {/* Course Filter */}
            <div className="col-span-1 md:col-span-2 xl:col-span-1">
              <CompactSelect
                value={courseFilter}
                onChange={(val) => {
                  setCourseFilter(val);
                  setCurrentPage(1);
                }}
                options={allCourses}
                placeholder="All Courses"
                maxHeight="max-h-56"
              />
            </div>
          </div>

          {/* Sub-row: Result count, Reset filters & Rows per page */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">Showing {filteredRecords.length} records</span>
              {(categoryFilter !== 'All' || classFilter !== 'All' || levelFilter !== 'All' || courseFilter !== 'All' || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('All');
                    setClassFilter('All');
                    setLevelFilter('All');
                    setCourseFilter('All');
                    setCurrentPage(1);
                  }}
                  className="text-xs font-bold text-sky-600 hover:text-sky-800 hover:underline cursor-pointer ml-1"
                >
                  Reset Filters
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(e.target.value === 'All' ? 'All' : Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-slate-50 hover:bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-800 outline-none cursor-pointer focus:ring-2 focus:ring-sky-100 transition"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value="All">All</option>
              </select>
            </div>
          </div>
        </div>

        {/* =========================================================================
            DATA TABLE
           ========================================================================= */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">

          <div 
            className="w-full overflow-x-auto no-scrollbar admin-table-container"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <table className="w-full text-left border-collapse text-xs min-w-[720px]">

              {/* Header */}
              <thead className="bg-[#081d3d] text-white border-b border-slate-200 text-[10px] font-black uppercase tracking-wider select-none">
                <tr>
                  {isSelectionMode && (
                    <th className="py-3 px-3.5 w-10 text-center">
                      <button
                        type="button"
                        onClick={handleToggleSelectAll}
                        className="cursor-pointer text-slate-300 hover:text-white"
                      >
                        {isAllSelected ? (
                          <CheckSquare className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                  )}
                  <th className="py-3 px-4">STUDENT DETAILS</th>
                  <th className="py-3 px-3">PARENT & CONTACT</th>
                  <th className="py-3 px-3">CATEGORY</th>
                  <th className="py-3 px-3">CLASS</th>
                  <th className="py-3 px-3">COURSE NAME</th>
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
                        <p className="text-xs text-slate-400">Try adjusting your filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedRecords.map((item, idx) => {
                    const rowId = item.id || item.admissionNo || item.userId;
                    const isSelected = selectedIds.includes(rowId);
                    const displayName = item.studentName || item.name || 'Student';
                    const phoneNo = item.mobile || item.phone || '';
                    const parentName = item.parentName || item.fatherName || 'Guardian';
                    const categoryBadge = getCategoryBadge(item);
                    const academicCat = getStudentAcademicCategory(item);
                    const institutionName = (item.schoolName || item.franchiseName || item.institution || '').trim();
                    const hasInstitutionName = institutionName &&
                      !institutionName.toLowerCase().includes('regional branch') &&
                      !institutionName.toLowerCase().endsWith(' branch') &&
                      institutionName.toLowerCase() !== (item.branch || '').toLowerCase();

                    return (
                      <tr
                        key={rowId}
                        className={`transition-colors hover:bg-slate-50/80 ${
                          isSelected ? 'bg-amber-50/60 hover:bg-amber-50' : 'bg-white'
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
                                <CheckSquare className="w-4 h-4 text-amber-500" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                        )}

                        {/* 2. STUDENT DETAILS */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <StudentAvatar
                              student={item}
                              index={idx}
                              className="w-9 h-9"
                              onClick={() => {
                                if (setViewingAdmissionStudent) {
                                  setViewingAdmissionStudent(item);
                                } else {
                                  handleEditStudent(item);
                                }
                              }}
                              title={`View Admission Form for ${displayName}`}
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900 capitalize text-xs">
                                  {displayName}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleEditStudent(item)}
                                  className="text-slate-400 hover:text-sky-700 transition cursor-pointer"
                                  title="Edit student"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSingle(item)}
                                  className="text-slate-400 hover:text-rose-600 transition cursor-pointer"
                                  title="Delete record"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                                <span className="font-bold text-sky-700">
                                  {item.admissionNo || item.registerNumber || item.userId}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 3. PARENT & CONTACT */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="text-slate-800 font-semibold">{parentName}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-emerald-600" />
                            <span>{phoneNo || '98400 00000'}</span>
                          </div>
                        </td>

                        {/* 4. CATEGORY */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="flex flex-col gap-1 items-start">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border shadow-2xs ${categoryBadge.bg}`}>
                              {categoryBadge.label}
                            </span>
                            {hasInstitutionName && (
                              <div className="text-[10px] font-bold text-slate-600 truncate max-w-[150px] flex items-center gap-1 mt-0.5" title={institutionName}>
                                <School className="w-3 h-3 text-sky-600 shrink-0" />
                                <span className="truncate">{institutionName}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 5. CLASS */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border shadow-2xs ${academicCat.classBadgeClass}`}>
                            {academicCat.className}
                          </span>
                        </td>

                        {/* 6. COURSE NAME */}
                        <td className="py-3 px-3 text-slate-800 font-bold whitespace-nowrap">
                          {item.courseName || item.program || 'Course'}
                        </td>

                        {/* 7. LEVEL DOCUMENTS (Fixed Admission Level + Merged + Separate Marksheet & Certificate) */}
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          {(() => {
                            const activeLvl = getStudentCurrentLevel(item);
                            return (
                              <div className="inline-flex items-center gap-1.5 justify-center">

                                {/* Fixed Student Admission Level Badge */}
                                <span
                                  className="px-2.5 py-1 text-xs font-black bg-slate-100 text-slate-800 border border-slate-300 rounded-lg shadow-2xs whitespace-nowrap select-none"
                                  title={`Official Admission Level: ${activeLvl}`}
                                >
                                  {activeLvl}
                                </span>

                                {/* Separate Marksheet Button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const enriched = { ...item, grade: activeLvl, level: activeLvl, courseLevel: activeLvl };
                                    if (handleOpenMarksheet) {
                                      handleOpenMarksheet(enriched);
                                    } else {
                                      const packages = buildStudentPackages([enriched]);
                                      const modalData = {
                                        students: packages,
                                        autoDownload: false,
                                        initialView: 'marksheet'
                                      };
                                      if (setViewingMergedPdfStudent) {
                                        setViewingMergedPdfStudent(modalData);
                                      } else {
                                        setLocalMergedPdfData(modalData);
                                      }
                                    }
                                  }}
                                  className="px-2.5 py-1 bg-[#0c234b] hover:bg-[#081d3d] active:scale-95 text-white text-[11px] font-black rounded-lg transition shadow-2xs inline-flex items-center gap-1 cursor-pointer"
                                  title="Print marksheet separately"
                                >
                                  <FileText className="w-3 h-3 text-amber-300" />
                                  <span>Marksheet</span>
                                </button>

                                {/* Separate Certificate Button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const enriched = { ...item, grade: activeLvl, level: activeLvl, courseLevel: activeLvl };
                                    if (handleOpenCertForStudent) {
                                      handleOpenCertForStudent(enriched);
                                    } else {
                                      const packages = buildStudentPackages([enriched]);
                                      const modalData = {
                                        students: packages,
                                        autoDownload: false,
                                        initialView: 'certificate'
                                      };
                                      if (setViewingMergedPdfStudent) {
                                        setViewingMergedPdfStudent(modalData);
                                      } else {
                                        setLocalMergedPdfData(modalData);
                                      }
                                    }
                                  }}
                                  className="px-2.5 py-1 bg-[#0c234b] hover:bg-[#081d3d] active:scale-95 text-white text-[11px] font-black rounded-lg transition shadow-2xs inline-flex items-center gap-1 cursor-pointer"
                                  title="Print certificate separately"
                                >
                                  <Award className="w-3 h-3 text-sky-400" />
                                  <span>Certificate</span>
                                </button>
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

      {/* Official Student Registration Form Modal */}
      {showAdmissionModal && (
        <AdmissionModal
          isOpen={showAdmissionModal}
          onClose={() => setShowAdmissionModal(false)}
          initialBranch={activeBranch ? String(activeBranch).replace(/\s*branch/gi, '').trim() : 'Tenkasi'}
          lockBranch={true}
          lockAdmissionCategory={true}
          initialAdmissionCategory={effectivePortalType === 'school' ? 'School' : (effectivePortalType === 'franchise' ? 'Franchise' : 'Branch')}
          initialInstitution={entityName || activeBranch}
          onSuccess={() => {
            setShowAdmissionModal(false);
            setEnquiries(getStoredStudentEnquiries());
            showToast('Student registered successfully!');
          }}
        />
      )}

      {/* Modal: Official Event Registration Slip */}
      {internalEventRegStudent && (
        <EventRegisterModal
          student={internalEventRegStudent}
          onClose={() => setInternalEventRegStudent(null)}
        />
      )}

      {/* Modal: Official Examination Question Paper */}
      {internalQuestionPaperStudent && (
        <StudentQuestionPaperView
          student={internalQuestionPaperStudent}
          onClose={() => setInternalQuestionPaperStudent(null)}
        />
      )}

    </div>
  );
}