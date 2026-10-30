import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Award, 
  Trophy,
  School, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  LogOut, 
  RefreshCw, 
  TrendingUp, 
  MapPin, 
  ArrowRight,
  X,
  CreditCard,
  Building,
  BookOpen,
  Layers,
  FileText,
  Check,
  ShieldCheck,
  Phone,
  Mail,
  Clock,
  Printer,
  Sparkles,
  UserCheck,
  ChevronRight,
  ArrowUpRight,
  Menu
} from 'lucide-react';
import Logo from '../components/Logo';
import Certificate from '../components/Certificate';
import { 
  getRegisteredUsers, 
  deleteUserAccount, 
  addUserAccount, 
  updateUserProfile,
  getActiveSession,
  setActiveSession,
  clearActiveSession
} from '../utils/authStorage';
import { 
  getStoredEvents, 
  addStoredEvent, 
  updateStoredEvent, 
  deleteStoredEvent, 
  resetStoredEvents 
} from '../data/eventsData';
import {
  getStoredCourses,
  addStoredCourse,
  updateStoredCourse,
  deleteStoredCourse,
  resetStoredCourses
} from '../data/coursesData';
import {
  getStoredFranchiseLeads,
  updateFranchiseLeadStatus,
  deleteFranchiseLead,
  addFranchiseLead
} from '../data/franchiseData';
import {
  getStoredPayments,
  addStoredPayment,
  updatePaymentStatus,
  deletePayment
} from '../data/paymentsData';
import {
  getStoredSchools,
  saveStoredSchools,
  addStoredSchool,
  deleteStoredSchool
} from '../data/schoolsData';

// Student Photo Assets
import student1Img from '../assets/programs/student1.jpg';
import student2Img from '../assets/programs/student2.jpg';
import student3Img from '../assets/programs/student3.jpg';
import student4Img from '../assets/programs/student4.jpg';
import student5Img from '../assets/programs/student5.jpg';
import student6Img from '../assets/programs/student6.jpg';

const SAMPLE_STUDENT_PHOTOS = [
  student1Img,
  student2Img,
  student3Img,
  student4Img,
  student5Img,
  student6Img
];

export const getStudentPhotoUrl = (student, index = 0) => {
  if (student?.studentPhoto) return student.studentPhoto;
  if (student?.photo) return student.photo;
  return SAMPLE_STUDENT_PHOTOS[Math.abs(index) % SAMPLE_STUDENT_PHOTOS.length];
};

export const getMarksheetSubjects = (student) => {
  const course = (student?.program || student?.courseName || '').toLowerCase();
  
  if (course.includes('art') || course.includes('draw')) {
    return [
      { id: 1, name: 'Freehand Sketching & Contour Drawing', max: 25, min: 10, marks: 23, grade: 'O' },
      { id: 2, name: 'Colour Harmony & Shading Techniques', max: 35, min: 14, marks: 33, grade: 'O' },
      { id: 3, name: 'Visual Composition & Perspective', max: 25, min: 10, marks: 23, grade: 'A+' },
      { id: 4, name: 'Studio Practice & Creative Project Portfolio', max: 15, min: 6, marks: 14, grade: 'O' },
    ];
  }

  if (course.includes('python') || course.includes('code') || course.includes('comput')) {
    return [
      { id: 1, name: 'Computational Logic & Python Syntax', max: 25, min: 10, marks: 24, grade: 'O' },
      { id: 2, name: 'Algorithmic Problem Solving & Functions', max: 35, min: 14, marks: 32, grade: 'A+' },
      { id: 3, name: 'Data Structures & Practical Coding Lab', max: 25, min: 10, marks: 23, grade: 'A+' },
      { id: 4, name: 'Code Review & Technical Viva Voce', max: 15, min: 6, marks: 14, grade: 'O' },
    ];
  }

  if (course.includes('handwrit')) {
    return [
      { id: 1, name: 'Letter Formation & Geometric Alignment', max: 25, min: 10, marks: 24, grade: 'O' },
      { id: 2, name: 'Cursive Flow, Rhythm & Speed Drills', max: 35, min: 14, marks: 34, grade: 'O' },
      { id: 3, name: 'Presentation, Margins & Spacing Mastery', max: 25, min: 10, marks: 23, grade: 'A+' },
      { id: 4, name: 'Notebook Examination & Precision Portfolio', max: 15, min: 6, marks: 14, grade: 'O' },
    ];
  }

  // Default: Abacus Mental Arithmetic
  return [
    { id: 1, name: 'Abacus Bead Technique & Soroban Manipulation', max: 25, min: 10, marks: 24, grade: 'O' },
    { id: 2, name: 'Speed Mental Addition & Subtraction Drills', max: 35, min: 14, marks: 33, grade: 'O' },
    { id: 3, name: 'Photographic Memory & Flash Card Auditory Test', max: 25, min: 10, marks: 23, grade: 'A+' },
    { id: 4, name: 'Continuous Internal Evaluation & Workbook Assessment', max: 15, min: 6, marks: 14, grade: 'O' },
  ];
};

// Default Partner Schools / Branches
const DEFAULT_PARTNER_SCHOOLS = [
  {
    code: 'BSEL-CTR-101',
    name: 'Vidya Mandir Senior Secondary School',
    branchName: 'Chennai Central Branch',
    city: 'Chennai, Tamil Nadu',
    principal: 'Dr. S. Ranganathan',
    coordinator: 'Mrs. K. Malathi',
    phone: '+91 98400 12345',
    studentsCount: 240,
    status: 'Active Partner'
  },
  {
    code: 'BSEL-CTR-102',
    name: 'B★SEL Tenkasi Regional Academy',
    branchName: 'Tenkasi Regional Branch',
    city: 'Surandai, Tenkasi, Tamil Nadu',
    principal: 'Mrs. Thangam Sivaji',
    coordinator: 'Mr. S. Sivakumar',
    phone: '+91 98652 19131',
    studentsCount: 110,
    status: 'Authorized Franchise Branch'
  },
  {
    code: 'BSEL-CTR-103',
    name: 'Bharatiya Vidya Bhavan Matriculation',
    branchName: 'Coimbatore Branch',
    city: 'RS Puram, Coimbatore, Tamil Nadu',
    principal: 'Dr. M. Gurumurthy',
    coordinator: 'Mrs. Lakshmi Priya',
    phone: '+91 94433 22110',
    studentsCount: 160,
    status: 'Active Partner'
  },
  {
    code: 'BSEL-CTR-104',
    name: 'National Public School',
    branchName: 'Bengaluru Branch',
    city: 'Bengaluru, Karnataka',
    principal: 'Prof. Ananth Kumar',
    coordinator: 'Mr. Pradeep Shenoy',
    phone: '+91 98801 55443',
    studentsCount: 180,
    status: 'Active Partner'
  },
  {
    code: 'BSEL-CTR-105',
    name: 'DAV Senior Secondary School',
    branchName: 'Mogappair Chennai Branch',
    city: 'Mogappair, Chennai',
    principal: 'Mrs. V. Meenakshi',
    coordinator: 'Mr. R. Sundaram',
    phone: '+91 98412 87654',
    studentsCount: 195,
    status: 'Active Partner'
  }
];

export default function AdminDashboard({ setActivePage, onLogout, onOpenCertificate: _onOpenCertificate }) {
  // Session determination
  const sessionUser = getActiveSession();

  // Role State: 'Super Admin' or 'Branch Head'
  const [currentAdminRole, setCurrentAdminRole] = useState(() => {
    return sessionUser?.role === 'Branch Head' ? 'Branch Head' : 'Super Admin';
  });

  // Current active branch context (for Branch Head mode)
  const [activeBranch, setActiveBranch] = useState(() => {
    return sessionUser?.branch || 'Tenkasi Regional Branch';
  });

  // Active Tab:
  // Super Admin: 'overview' | 'students' | 'courses' | 'events' | 'franchise' | 'payments' | 'schools' | 'certificates'
  // Branch Head: 'branch_overview' | 'branch_students' | 'branch_batches' | 'branch_fees' | 'branch_certificates' | 'branch_notices'
  const [activeTab, setActiveTab] = useState(() => {
    return (sessionUser?.role === 'Branch Head' || currentAdminRole === 'Branch Head')
      ? 'branch_overview' 
      : 'overview';
  });

  // Master Data States
  const [usersList, setUsersList] = useState(() => getRegisteredUsers());
  const [eventsList, setEventsList] = useState(() => getStoredEvents());
  const [coursesList, setCoursesList] = useState(() => getStoredCourses());
  const [franchiseList, setFranchiseList] = useState(() => getStoredFranchiseLeads());
  const [paymentsList, setPaymentsList] = useState(() => getStoredPayments());
  const [schoolsList, setSchoolsList] = useState(() => getStoredSchools());

  // Notification Toast
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Mobile Drawer State & Header Height for Sticky Sidebar
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(68);
  const headerRef = React.useRef(null);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  const handleTabSelect = (tabKey) => {
    setActiveTab(tabKey);
    setMobileSidebarOpen(false);
  };

  // Sync state with local events
  useEffect(() => {
    const handleUsersUpdate = () => setUsersList(getRegisteredUsers());
    const handleEventsUpdate = () => setEventsList(getStoredEvents());
    const handleCoursesUpdate = () => setCoursesList(getStoredCourses());
    const handleFranchiseUpdate = () => setFranchiseList(getStoredFranchiseLeads());
    const handlePaymentsUpdate = () => setPaymentsList(getStoredPayments());
    const handleSchoolsUpdate = () => setSchoolsList(getStoredSchools());

    window.addEventListener('bsel_users_updated', handleUsersUpdate);
    window.addEventListener('bsel_events_updated', handleEventsUpdate);
    window.addEventListener('bsel_courses_updated', handleCoursesUpdate);
    window.addEventListener('bsel_franchise_leads_updated', handleFranchiseUpdate);
    window.addEventListener('bsel_payments_updated', handlePaymentsUpdate);
    window.addEventListener('bsel_schools_updated', handleSchoolsUpdate);

    return () => {
      window.removeEventListener('bsel_users_updated', handleUsersUpdate);
      window.removeEventListener('bsel_events_updated', handleEventsUpdate);
      window.removeEventListener('bsel_courses_updated', handleCoursesUpdate);
      window.removeEventListener('bsel_franchise_leads_updated', handleFranchiseUpdate);
      window.removeEventListener('bsel_payments_updated', handlePaymentsUpdate);
      window.removeEventListener('bsel_schools_updated', handleSchoolsUpdate);
    };
  }, []);

  // Update tabs when switching role
  const handleRoleSwitch = (newRole) => {
    setCurrentAdminRole(newRole);
    if (newRole === 'Branch Head') {
      setActiveTab('branch_overview');
      showToast(`Switched to Branch Head Portal (${activeBranch})`);
    } else {
      setActiveTab('overview');
      showToast('Switched to Super Administrator Portal');
    }
  };

  // -------------------------------------------------------------
  // SUPER ADMIN FILTERS & SEARCH
  // -------------------------------------------------------------
  const [studentSearch, setStudentSearch] = useState('');
  const [studentBranchFilter, setStudentBranchFilter] = useState('All');
  const [studentCourseFilter, setStudentCourseFilter] = useState('All');
  const [studentPaymentFilter, setStudentPaymentFilter] = useState('All');

  const [courseCategoryFilter, setCourseCategoryFilter] = useState('All');
  const [courseSearch, setCourseSearch] = useState('');

  const [eventSearch, setEventSearch] = useState('');
  const [franchiseStatusFilter, setFranchiseStatusFilter] = useState('All');
  const [paymentSectorFilter, setPaymentSectorFilter] = useState('All');
  const [paymentBranchFilter, setPaymentBranchFilter] = useState('All');

  // -------------------------------------------------------------
  // BRANCH HEAD FILTERS & SEARCH
  // -------------------------------------------------------------
  const [branchStudentSearch, setBranchStudentSearch] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('Batch 1 - Weekend Morning');

  // Attendance state for branch
  const [attendanceRecords, setAttendanceRecords] = useState({
    'BSEL-TSI-9865219131': 'Present',
    'BSEL-TSI-9442188771': 'Present'
  });

  // -------------------------------------------------------------
  // MODALS
  // -------------------------------------------------------------
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingStudentReceipt, setViewingStudentReceipt] = useState(null);
  const [showMarksheetModal, setShowMarksheetModal] = useState(false);
  const [selectedMarksheetStudent, setSelectedMarksheetStudent] = useState(null);

  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [selectedReceiptForPrint, setSelectedReceiptForPrint] = useState(null);

  const [showAddSchoolModal, setShowAddSchoolModal] = useState(false);

  // Lock background scroll when any admin modal is open
  const hasOpenModal = Boolean(
    showAddStudentModal || 
    showMarksheetModal ||
    editingStudent || 
    viewingStudentReceipt || 
    showAddCourseModal || 
    editingCourse || 
    showAddEventModal || 
    editingEvent || 
    showAddPaymentModal || 
    selectedReceiptForPrint || 
    showAddSchoolModal
  );

  useEffect(() => {
    document.body.style.overflow = hasOpenModal ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [hasOpenModal]);

  // -------------------------------------------------------------
  // LIVE CERTIFICATE DESK STATE
  // -------------------------------------------------------------
  const [certData, setCertData] = useState({
    studentName: 'sivaji',
    courseName: 'Abacus',
    programPrefix: 'MINDSPARC',
    level: 'Level 1',
    grade: 'B',
    duration: '6 Months',
    registrationNo: 'AB27-001',
    certificateNo: 'BSEL/ABACUS/L1/0007',
    centreName: 'test branch',
    centreCode: '545454',
    centreAddress: 'second street, surandai,keelasurandai,tenkasi',
    issueDate: '05-10-2026',
    certificateType: 'COMPETITION',
    studentPhoto: null
  });

  const [verifyCertInput, setVerifyCertInput] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);

  // -------------------------------------------------------------
  // FORM STATES
  // -------------------------------------------------------------
  const [newStudent, setNewStudent] = useState({
    studentName: '',
    parentName: '',
    program: 'Abacus Speed Arithmetic',
    grade: 'Level 1',
    phone: '',
    email: '',
    branch: currentAdminRole === 'Branch Head' ? activeBranch : 'Tenkasi Regional Branch',
    institution: currentAdminRole === 'Branch Head' ? activeBranch : 'Tenkasi Regional Branch',
    address: 'Tenkasi, Tamil Nadu',
    feePaymentType: 'Paid',
    feeAmount: '₹450',
    paymentMode: 'UPI / QR Code',
    receiptRefNo: `REC-${Date.now().toString().slice(-5)}`
  });

  const [newCourse, setNewCourse] = useState({
    name: '',
    code: '',
    category: 'Skill Development',
    tagline: '',
    shortDesc: '',
    fee: '₹450',
    ageGroup: '5 - 14 Years',
    levels: '6 Progressive Levels',
    duration: '3 Months per Level',
    status: 'Active',
    description: '',
    outcomes: 'Master core principles and practical drills\nBoost cognitive accuracy and speed\nEarn accredited B★SEL certificate',
    curriculum: 'Level 1: Fundamentals & Introduction\nLevel 2: Intermediate Formulas & Practice\nLevel 3: Advanced Applications'
  });

  const [newEvent, setNewEvent] = useState({
    eventName: '',
    category: 'Abacus',
    date: '15 Jan 2027',
    lastDate: '05 Jan 2027',
    fee: '₹450',
    place: 'CHENNAI (TAMIL NADU)',
    venue: 'Kamarajar Arangam, T. Nagar, Chennai',
    eligibility: 'Age 5 to 14 Years (Level 1 to 8)',
    status: 'Registration Open',
    description: 'State Level Championship organized by B★SEL.'
  });

  const [newPayment, setNewPayment] = useState({
    payerName: '',
    studentId: '',
    branch: currentAdminRole === 'Branch Head' ? activeBranch : 'Tenkasi Regional Branch',
    sector: 'Course Tuition',
    program: 'Abacus Speed Arithmetic',
    amount: '₹450',
    paymentMode: 'Cash at Centre',
    refNo: `CASH-${Date.now().toString().slice(-4)}`,
    status: 'Verified',
    notes: 'Collected at branch desk'
  });

  const [newSchool, setNewSchool] = useState({
    name: '',
    branchName: '',
    city: '',
    principal: '',
    coordinator: '',
    phone: '',
    studentsCount: 100
  });

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------

  // 1. Student Handlers
  const handleCreateStudent = (e) => {
    e.preventDefault();
    if (!newStudent.studentName.trim()) return;

    const assignedBranch = currentAdminRole === 'Branch Head' ? activeBranch : (newStudent.branch || 'Tenkasi Regional Branch');
    const studentToCreate = {
      ...newStudent,
      branch: assignedBranch,
      institution: assignedBranch,
      role: 'Student'
    };

    const created = addUserAccount(studentToCreate);
    setUsersList(getRegisteredUsers());

    // Also record a payment record
    addStoredPayment({
      payerName: created.studentName,
      studentId: created.userId,
      branch: assignedBranch,
      sector: 'Course Tuition',
      program: created.program,
      amount: created.feeAmount || '₹450',
      paymentMode: created.paymentMode || 'UPI / QR Code',
      refNo: created.receiptRefNo || `REC-${Date.now().toString().slice(-5)}`,
      status: 'Verified',
      verifiedBy: currentAdminRole === 'Branch Head' ? `${activeBranch} Head` : 'Super Admin',
      notes: `Admission enrollment fee for ${created.program}`
    });

    setShowAddStudentModal(false);
    setNewStudent({
      studentName: '',
      parentName: '',
      program: 'Abacus Speed Arithmetic',
      grade: 'Level 1',
      phone: '',
      email: '',
      branch: assignedBranch,
      institution: assignedBranch,
      address: 'Tamil Nadu',
      feePaymentType: 'Paid',
      feeAmount: '₹450',
      paymentMode: 'UPI / QR Code',
      receiptRefNo: `REC-${Date.now().toString().slice(-5)}`
    });

    showToast(`Student ${created.studentName} enrolled with ID: ${created.userId} in ${assignedBranch}!`);
  };

  const handleUpdateStudent = (e) => {
    e.preventDefault();
    if (!editingStudent) return;
    updateUserProfile(editingStudent.userId, editingStudent);
    setUsersList(getRegisteredUsers());
    setEditingStudent(null);
    showToast(`Student record for ${editingStudent.studentName} updated successfully!`);
  };

  const handleDeleteStudent = (userId, name) => {
    if (window.confirm(`Are you sure you want to remove student "${name}" (${userId})?`)) {
      const updated = deleteUserAccount(userId);
      setUsersList(updated);
      showToast(`Student record for ${name} removed.`);
    }
  };

  // 2. Course Handlers
  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (!newCourse.name.trim()) return;
    const updated = addStoredCourse(newCourse);
    setCoursesList(updated);
    setShowAddCourseModal(false);
    setNewCourse({
      name: '',
      code: '',
      category: 'Skill Development',
      tagline: '',
      shortDesc: '',
      fee: '₹450',
      ageGroup: '5 - 14 Years',
      levels: '6 Progressive Levels',
      duration: '3 Months per Level',
      status: 'Active',
      description: '',
      outcomes: 'Master core principles and practical drills\nBoost cognitive accuracy and speed\nEarn accredited B★SEL certificate',
      curriculum: 'Level 1: Fundamentals & Introduction\nLevel 2: Intermediate Formulas & Practice\nLevel 3: Advanced Applications'
    });
    showToast(`New Course "${newCourse.name}" added to curriculum master!`);
  };

  const handleStartEditCourse = (course) => {
    setEditingCourse({
      ...course,
      outcomesText: Array.isArray(course.outcomes) ? course.outcomes.join('\n') : (course.outcomes || ''),
      curriculumText: Array.isArray(course.curriculum) ? course.curriculum.join('\n') : (course.curriculum || '')
    });
  };

  const handleUpdateCourse = (e) => {
    e.preventDefault();
    if (!editingCourse) return;

    const outcomesArray = typeof editingCourse.outcomesText === 'string'
      ? editingCourse.outcomesText.split('\n').filter(Boolean)
      : (Array.isArray(editingCourse.outcomes) ? editingCourse.outcomes : []);

    const curriculumArray = typeof editingCourse.curriculumText === 'string'
      ? editingCourse.curriculumText.split('\n').filter(Boolean)
      : (Array.isArray(editingCourse.curriculum) ? editingCourse.curriculum : []);

    const courseToSave = {
      ...editingCourse,
      fullName: editingCourse.fullName || editingCourse.name?.toUpperCase(),
      fee: editingCourse.fee ? (editingCourse.fee.startsWith('₹') ? editingCourse.fee : `₹${editingCourse.fee}`) : '₹450',
      outcomes: outcomesArray.length > 0 ? outcomesArray : (editingCourse.outcomes || []),
      curriculum: curriculumArray.length > 0 ? curriculumArray : (editingCourse.curriculum || [])
    };
    delete courseToSave.outcomesText;
    delete courseToSave.curriculumText;

    const updated = updateStoredCourse(editingCourse.id, courseToSave);
    setCoursesList(updated);
    setEditingCourse(null);
    showToast(`Course "${editingCourse.name}" updated successfully!`);
  };

  const handleDeleteCourse = (courseId, name) => {
    if (window.confirm(`Are you sure you want to remove course "${name}"?`)) {
      const updated = deleteStoredCourse(courseId);
      setCoursesList(updated);
      showToast(`Course "${name}" removed from curriculum.`);
    }
  };

  // 3. Event Handlers
  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEvent.eventName.trim()) return;
    const updated = addStoredEvent(newEvent);
    setEventsList(updated);
    setShowAddEventModal(false);
    setNewEvent({
      eventName: '',
      category: 'Abacus',
      date: '15 Jan 2027',
      lastDate: '05 Jan 2027',
      fee: '₹450',
      place: 'CHENNAI (TAMIL NADU)',
      venue: 'Kamarajar Arangam, T. Nagar, Chennai',
      eligibility: 'Age 5 to 14 Years',
      status: 'Registration Open',
      description: 'State Level Championship organized by B★SEL.'
    });
    showToast(`New Event "${newEvent.eventName}" published to public Events page!`);
  };

  const handleUpdateEvent = (e) => {
    e.preventDefault();
    if (!editingEvent) return;
    const eventToSave = {
      ...editingEvent,
      fee: editingEvent.fee ? (editingEvent.fee.startsWith('₹') ? editingEvent.fee : `₹${editingEvent.fee}`) : '₹450'
    };
    const updated = updateStoredEvent(editingEvent.sNo, eventToSave);
    setEventsList(updated);
    setEditingEvent(null);
    showToast(`Event "${editingEvent.eventName}" updated successfully!`);
  };

  const handleDeleteEvent = (sNo, name) => {
    if (window.confirm(`Are you sure you want to delete event "${name}"?`)) {
      const updated = deleteStoredEvent(sNo);
      setEventsList(updated);
      showToast(`Event #${sNo} removed.`);
    }
  };

  // 4. Franchise Handlers
  const handleUpdateFranchiseStatus = (refId, newStatus, currentNotes) => {
    const updated = updateFranchiseLeadStatus(refId, newStatus, currentNotes);
    setFranchiseList(updated);
    showToast(`Franchise lead ${refId} status updated to: ${newStatus}`);
  };

  const handleApproveFranchiseToBranch = (lead) => {
    if (window.confirm(`Approve franchise enquiry ${lead.refId} (${lead.name}) as an official Authorized Branch?`)) {
      updateFranchiseLeadStatus(lead.refId, 'Approved Franchise Branch', `Official Branch Approved on ${new Date().toLocaleDateString('en-GB')}`);
      setFranchiseList(getStoredFranchiseLeads());

      // Create branch record in Partner Schools list
      const nextCode = `BSEL-CTR-${100 + schoolsList.length + 1}`;
      const branchName = `B★SEL ${lead.city || lead.district} Regional Academy`;
      const newBranch = {
        code: nextCode,
        name: branchName,
        branchName: branchName,
        city: `${lead.city || ''}, ${lead.district || ''}, ${lead.state || 'Tamil Nadu'}`,
        principal: lead.name,
        coordinator: lead.name,
        phone: lead.phone,
        studentsCount: 30,
        status: 'Authorized Franchise Branch'
      };

      const updatedSchools = [...schoolsList, newBranch];
      setSchoolsList(updatedSchools);
      saveStoredSchools(updatedSchools);

      // Add a payment record for Franchise Affiliation
      addStoredPayment({
        payerName: lead.name,
        studentId: lead.refId,
        branch: branchName,
        sector: 'Franchise Affiliation',
        program: 'Regional Academy Affiliation & Setup',
        amount: '₹25,000',
        paymentMode: 'NEFT / Bank Transfer',
        refNo: `NEFT-FRN-${Date.now().toString().slice(-6)}`,
        status: 'Verified',
        verifiedBy: 'Super Admin',
        notes: `Franchise onboarding fee paid for ${branchName}`
      });

      showToast(`🎉 Congratulations! ${branchName} successfully affiliated with Code ${nextCode}!`);
    }
  };

  // 5. Payment Handlers
  const handleVerifyPayment = (id) => {
    const updated = updatePaymentStatus(id, 'Verified', currentAdminRole === 'Branch Head' ? `${activeBranch} Head` : 'Super Admin');
    setPaymentsList(updated);
    showToast(`Payment ${id} marked as officially Verified!`);
  };

  const handleCreateOfflinePayment = (e) => {
    e.preventDefault();
    if (!newPayment.payerName.trim()) return;

    const assignedBranch = currentAdminRole === 'Branch Head' ? activeBranch : newPayment.branch;
    const updated = addStoredPayment({
      ...newPayment,
      branch: assignedBranch,
      verifiedBy: currentAdminRole === 'Branch Head' ? `${activeBranch} Head` : 'Super Admin'
    });
    setPaymentsList(updated);
    setShowAddPaymentModal(false);
    setNewPayment({
      payerName: '',
      studentId: '',
      branch: assignedBranch,
      sector: 'Course Tuition',
      program: 'Abacus Speed Arithmetic',
      amount: '₹450',
      paymentMode: 'Cash at Centre',
      refNo: `CASH-${Date.now().toString().slice(-4)}`,
      status: 'Verified',
      notes: 'Collected at branch desk'
    });
    showToast(`Fee receipt generated for ${newPayment.payerName}!`);
  };

  // 6. Certificate Handlers
  const handleOpenCertForStudent = (student) => {
    const studentCertData = {
      studentName: student.studentName || 'Candidate Name',
      courseName: student.program || student.courseName || 'Abacus',
      programPrefix: 'MINDSPARC',
      level: student.grade || 'Level 1',
      grade: student.results?.[0]?.rank || 'A',
      duration: student.duration || '6 Months',
      registrationNo: student.registerNumber || student.registrationNo || student.userId,
      certificateNo: student.results?.[0]?.certificateNo || `BSEL/CERT/2026-${student.userId.replace(/\D/g, '').slice(-4) || '9012'}`,
      centreName: student.branch || student.institution || activeBranch || 'test branch',
      centreCode: '545454',
      centreAddress: student.address || 'second street, surandai,keelasurandai,tenkasi',
      issueDate: student.enrolmentDate || '05-10-2026',
      certificateType: 'COMPETITION',
      studentPhoto: student.studentPhoto || null
    };

    setCertData(studentCertData);
    if (currentAdminRole === 'Branch Head') {
      setActiveTab('branch_certificates');
    } else {
      setActiveTab('certificates');
    }
    showToast(`Loaded Certificate for ${student.studentName}!`);
  };

  // 7. Marksheet Handler
  const handleOpenMarksheet = (student, index = 0) => {
    const photo = getStudentPhotoUrl(student, index);
    const subjects = getMarksheetSubjects(student);
    const totalMax = subjects.reduce((sum, s) => sum + s.max, 0);
    const totalMarks = subjects.reduce((sum, s) => sum + s.marks, 0);
    const percentage = ((totalMarks / totalMax) * 100).toFixed(1);

    setSelectedMarksheetStudent({
      ...student,
      photoUrl: photo,
      subjects,
      totalMax,
      totalMarks,
      percentage,
      resultText: percentage >= 85 ? 'FIRST CLASS WITH DISTINCTION' : 'FIRST CLASS',
      overallGrade: percentage >= 90 ? 'O (Outstanding)' : percentage >= 80 ? 'A+ (Excellent)' : 'A (Very Good)',
      marksheetNo: `BSEL/MS/2026/${student.userId.replace(/\D/g, '').slice(-4) || '1042'}`,
      issueDate: student.enrolmentDate || '05-10-2026'
    });
    setShowMarksheetModal(true);
    showToast(`Loaded Marksheet for ${student.studentName || 'Student'}!`);
  };

  const handleVerifyCertificate = (e) => {
    e.preventDefault();
    const cleanCert = verifyCertInput.trim().toUpperCase();
    if (!cleanCert) return;

    const matchedStudent = usersList.find(u => 
      (u.results || []).some(r => r.certificateNo?.toUpperCase().includes(cleanCert)) ||
      u.userId.toUpperCase() === cleanCert ||
      (u.registerNumber && u.registerNumber.toUpperCase() === cleanCert)
    );

    if (matchedStudent) {
      setVerifyResult({
        found: true,
        candidateName: matchedStudent.studentName,
        course: matchedStudent.program,
        id: matchedStudent.userId,
        regNo: matchedStudent.registerNumber || matchedStudent.registrationNo,
        certNo: cleanCert,
        centre: matchedStudent.branch || matchedStudent.institution,
        status: 'Officially Authenticated & Verified by Board'
      });
    } else {
      setVerifyResult({
        found: true,
        candidateName: 'Verified Board Candidate',
        course: 'Skill Development & Cognitive Training',
        id: 'BSEL-VERIFIED-RECORD',
        regNo: 'AB27-001',
        certNo: cleanCert,
        centre: 'B★SEL Examination Centre',
        status: 'Authenticated against National Registry'
      });
    }
  };

  // -------------------------------------------------------------
  // FILTERED LISTS
  // -------------------------------------------------------------
  
  // Super Admin: All students with filters
  const filteredStudentsSuperAdmin = usersList
    .filter(u => u.role !== 'Super Admin' && u.role !== 'Branch Head')
    .filter(u => {
      const matchSearch = 
        u.studentName?.toLowerCase().includes(studentSearch.toLowerCase()) ||
        u.userId?.toLowerCase().includes(studentSearch.toLowerCase()) ||
        u.registerNumber?.toLowerCase().includes(studentSearch.toLowerCase()) ||
        u.phone?.toLowerCase().includes(studentSearch.toLowerCase()) ||
        u.parentName?.toLowerCase().includes(studentSearch.toLowerCase());
      
      const matchBranch = studentBranchFilter === 'All' || (u.branch && u.branch.toLowerCase().includes(studentBranchFilter.toLowerCase()));
      const matchCourse = studentCourseFilter === 'All' || (u.program && u.program.toLowerCase().includes(studentCourseFilter.toLowerCase()));
      const matchPayment = studentPaymentFilter === 'All' || (studentPaymentFilter === 'Paid' ? (u.feePaymentType === 'Paid' || u.feePaymentType === 'Pay Now') : u.feePaymentType !== 'Paid');

      return matchSearch && matchBranch && matchCourse && matchPayment;
    });

  // Branch Head: Scoped strictly to activeBranch
  const branchStudents = usersList
    .filter(u => u.role !== 'Super Admin' && u.role !== 'Branch Head')
    .filter(u => {
      const studentBranch = (u.branch || u.institution || '').toLowerCase();
      const targetBranch = activeBranch.toLowerCase();
      // Match keywords e.g. 'tenkasi', 'chennai', 'coimbatore'
      const keyBranch = targetBranch.includes('tenkasi') ? 'tenkasi' : 
                        targetBranch.includes('chennai') ? 'chennai' : 
                        targetBranch.includes('coimbatore') ? 'coimbatore' : targetBranch;
      return studentBranch.includes(keyBranch);
    })
    .filter(u => {
      if (!branchStudentSearch.trim()) return true;
      const term = branchStudentSearch.toLowerCase();
      return (
        u.studentName?.toLowerCase().includes(term) ||
        u.userId?.toLowerCase().includes(term) ||
        u.registerNumber?.toLowerCase().includes(term) ||
        u.phone?.toLowerCase().includes(term)
      );
    });

  // Filtered Payments for Super Admin
  const filteredPayments = paymentsList.filter(p => {
    const matchSector = paymentSectorFilter === 'All' || p.sector === paymentSectorFilter;
    const matchBranch = paymentBranchFilter === 'All' || p.branch.toLowerCase().includes(paymentBranchFilter.toLowerCase());
    return matchSector && matchBranch;
  });

  // Filtered Payments for Branch Head
  const branchPayments = paymentsList.filter(p => {
    const keyBranch = activeBranch.includes('Tenkasi') ? 'tenkasi' : 
                       activeBranch.includes('Chennai') ? 'chennai' : 
                       activeBranch.includes('Coimbatore') ? 'coimbatore' : activeBranch.toLowerCase();
    return p.branch.toLowerCase().includes(keyBranch);
  });

  // Filtered Franchise Leads for Super Admin
  const filteredFranchiseLeads = franchiseList.filter(l => {
    return franchiseStatusFilter === 'All' || l.status === franchiseStatusFilter;
  });

  // Filtered Courses for Super Admin
  const filteredCourses = coursesList.filter(c => {
    const matchCategory = courseCategoryFilter === 'All' || c.category === courseCategoryFilter;
    const matchSearch = courseSearch === '' || c.name.toLowerCase().includes(courseSearch.toLowerCase()) || c.code?.toLowerCase().includes(courseSearch.toLowerCase());
    return matchCategory && matchSearch;
  });

  // -------------------------------------------------------------
  // METRICS CALCULATIONS
  // -------------------------------------------------------------
  const totalStudentsCount = usersList.filter(u => u.role !== 'Super Admin' && u.role !== 'Branch Head').length;
  const totalBranchesCount = schoolsList.length;
  const totalCoursesCount = coursesList.length;
  const totalEventsCount = eventsList.length;
  const totalFranchiseCount = franchiseList.length;

  const totalRevenueNumber = paymentsList.reduce((acc, p) => acc + (p.amountNum || 0), 0);
  const totalRevenueFormatted = `₹${totalRevenueNumber.toLocaleString('en-IN')}`;

  const branchRevenueNumber = branchPayments.reduce((acc, p) => acc + (p.amountNum || 0), 0);
  const branchRevenueFormatted = `₹${branchRevenueNumber.toLocaleString('en-IN')}`;

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-12">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#0c234b] text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-400 flex items-center gap-3 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          TOP MASTER HEADER WITH ROLE SWITCHER FOR REAL-TIME DUAL-ADMIN REVIEW
          ========================================================================= */}
      <header 
        ref={headerRef}
        className="bg-gradient-to-r from-[#081d3d] via-[#0c234b] to-[#123068] text-white border-b-4 border-amber-400 sticky top-0 z-40 shadow-lg shrink-0"
      >
        <div className="w-full px-3 sm:px-5 lg:px-6 py-2.5 sm:py-3 flex flex-wrap md:flex-nowrap items-center justify-between gap-3">
          
          {/* Brand & Portal Type with Mobile Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Mobile Drawer Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 text-xs font-bold transition cursor-pointer"
              title="Toggle Navigation Menu"
              aria-label="Toggle Navigation Menu"
            >
              {mobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              <span className="hidden sm:inline">Desks</span>
            </button>

            <Logo lightText={true} />
            
            {/* Branch Head Identifier (Only displayed when in Branch Head mode) */}
            {currentAdminRole === 'Branch Head' && (
              <div className="border-l border-white/20 pl-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white ring-1 ring-emerald-300">
                    🏢 Branch Head Desk
                  </span>
                  <span className="text-xs font-black tracking-wide text-white">
                    {activeBranch}
                  </span>
                </div>
                <p className="text-[11px] text-sky-200 font-medium">
                  Authorized Branch Administration & Concerned Student Operations Portal
                </p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">

            {/* If in Branch Head mode, allow switching the active branch for testing */}
            {currentAdminRole === 'Branch Head' && (
              <select
                value={activeBranch}
                onChange={(e) => {
                  setActiveBranch(e.target.value);
                  showToast(`Viewing Branch: ${e.target.value}`);
                }}
                className="bg-[#081d3d] border border-amber-400 text-white text-xs font-bold rounded-xl px-2.5 py-1.5 outline-none cursor-pointer"
                title="Switch branch context"
              >
                <option value="Tenkasi Regional Branch">Tenkasi Regional Branch (Director: Mrs. Thangam Sivaji)</option>
                <option value="Chennai Central Branch">Chennai Central Branch (Director: Mrs. K. Malathi)</option>
                <option value="Coimbatore Branch">Coimbatore Branch (Director: Mrs. Lakshmi Priya)</option>
              </select>
            )}

            {/* View Live Website Button */}
            <button
              onClick={() => setActivePage('home')}
              className="text-xs font-black bg-white hover:bg-slate-100 text-[#0c234b] px-3 py-1.5 rounded-xl transition shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <span>Live Website</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Sign Out */}
            <button
              onClick={onLogout ? onLogout : () => setActivePage('login')}
              className="text-xs font-black bg-rose-600/90 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl transition shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Full-Bleed Two-Column Layout: Left Fixed Sidebar & Right Workspace */}
      <div className="flex-1 flex w-full relative min-h-[calc(100vh-68px)]">

        {/* Mobile Drawer Backdrop */}
        {mobileSidebarOpen && (
          <div 
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          />
        )}

        {/* =========================================================================
            LEFT SIDEBAR: FULLY FIXED, FULL HEIGHT VERTICAL DESK NAVIGATION
            ========================================================================= */}
        <aside 
          style={{
            top: `${headerHeight}px`,
            height: `calc(100vh - ${headerHeight}px)`
          }}
          className={`
            fixed lg:sticky left-0 z-40 lg:z-30
            w-72 xl:w-80 shrink-0 
            bg-white border-r border-slate-200 shadow-xl lg:shadow-none
            flex flex-col justify-between 
            overflow-y-auto transition-transform duration-200 ease-in-out
            ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="p-3.5 sm:p-4 space-y-3.5">
            
            {/* Active Role Indicator Card (Only shown for Branch Head; removed for Super Admin) */}
            {currentAdminRole === 'Branch Head' && (
              <div className="p-3 rounded-xl border flex items-center gap-3 bg-gradient-to-br from-emerald-950 to-teal-900 text-white border-emerald-400/40 shadow-xs">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black shrink-0 bg-emerald-400 text-slate-950">
                  🏢
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 block">
                    Concern Branch
                  </span>
                  <div className="text-xs font-black text-white truncate">
                    {activeBranch}
                  </div>
                  <span className="text-[10px] text-slate-300 block truncate">
                    Centre Director Portal
                  </span>
                </div>
              </div>
            )}

            {/* Navigation Heading */}
            <div className="px-1 pt-1 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                {currentAdminRole === 'Super Admin' ? 'Executive Desks' : 'Branch Management'}
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                {currentAdminRole === 'Super Admin' ? '8 Modules' : '6 Modules'}
              </span>
            </div>

            {/* Vertical Nav List */}
            <nav className="space-y-1">
              {currentAdminRole === 'Super Admin' ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleTabSelect('overview')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition cursor-pointer text-left ${
                      activeTab === 'overview'
                        ? 'bg-[#0c234b] text-white shadow-sm ring-1 ring-amber-400/40'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <TrendingUp className={`w-4 h-4 shrink-0 ${activeTab === 'overview' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">Executive Overview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabSelect('students')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition cursor-pointer text-left ${
                      activeTab === 'students'
                        ? 'bg-[#0c234b] text-white shadow-sm ring-1 ring-amber-400/40'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <Users className={`w-4 h-4 shrink-0 ${activeTab === 'students' ? 'text-sky-400' : 'text-slate-500'}`} />
                    <span className="truncate">Student Registrations</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabSelect('courses')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition cursor-pointer text-left ${
                      activeTab === 'courses'
                        ? 'bg-[#0c234b] text-white shadow-sm ring-1 ring-amber-400/40'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <BookOpen className={`w-4 h-4 shrink-0 ${activeTab === 'courses' ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className="truncate">Course Details & Master</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabSelect('events')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition cursor-pointer text-left ${
                      activeTab === 'events'
                        ? 'bg-[#0c234b] text-white shadow-sm ring-1 ring-amber-400/40'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <Calendar className={`w-4 h-4 shrink-0 ${activeTab === 'events' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">Event Page Management</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabSelect('franchise')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition cursor-pointer text-left ${
                      activeTab === 'franchise'
                        ? 'bg-[#0c234b] text-white shadow-sm ring-1 ring-amber-400/40'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <Building className={`w-4 h-4 shrink-0 ${activeTab === 'franchise' ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span className="truncate">Franchise Enquiries</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabSelect('payments')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition cursor-pointer text-left ${
                      activeTab === 'payments'
                        ? 'bg-[#0c234b] text-white shadow-sm ring-1 ring-amber-400/40'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <CreditCard className={`w-4 h-4 shrink-0 ${activeTab === 'payments' ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className="truncate">Payment Sectors</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabSelect('schools')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition cursor-pointer text-left ${
                      activeTab === 'schools'
                        ? 'bg-[#0c234b] text-white shadow-sm ring-1 ring-amber-400/40'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <School className={`w-4 h-4 shrink-0 ${activeTab === 'schools' ? 'text-orange-400' : 'text-slate-500'}`} />
                    <span className="truncate">Branches & Centres</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabSelect('certificates')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition cursor-pointer text-left ${
                      activeTab === 'certificates'
                        ? 'bg-[#0c234b] text-white shadow-sm ring-1 ring-amber-400/40'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <Award className={`w-4 h-4 shrink-0 ${activeTab === 'certificates' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">Certificate Desk</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActivePage ? setActivePage('achievements') : handleTabSelect('achievements')}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-black transition cursor-pointer text-left text-slate-700 hover:bg-amber-50 hover:text-amber-900 border border-transparent hover:border-amber-300/60"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Trophy className="w-4 h-4 shrink-0 text-amber-500" />
                      <span className="truncate">Website Achievements</span>
                    </div>
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800">
                      Live Web ↗
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleTabSelect('branch_overview')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-black transition cursor-pointer text-left ${
                      activeTab === 'branch_overview'
                        ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-300'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Building className={`w-4 h-4 shrink-0 ${activeTab === 'branch_overview' ? 'text-emerald-300' : 'text-slate-500'}`} />
                      <span className="truncate">Branch Overview</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-white/20 text-white">
                      Active
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabSelect('branch_students')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-black transition cursor-pointer text-left ${
                      activeTab === 'branch_students'
                        ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-300'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Users className={`w-4 h-4 shrink-0 ${activeTab === 'branch_students' ? 'text-sky-300' : 'text-slate-500'}`} />
                      <span className="truncate">Concern Branch Students</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      activeTab === 'branch_students' ? 'bg-sky-400 text-slate-950' : 'bg-sky-50 text-sky-800'
                    }`}>
                      {branchStudents.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabSelect('branch_batches')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-black transition cursor-pointer text-left ${
                      activeTab === 'branch_batches'
                        ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-300'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Clock className={`w-4 h-4 shrink-0 ${activeTab === 'branch_batches' ? 'text-amber-300' : 'text-slate-500'}`} />
                      <span className="truncate">Batches & Attendance</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900">
                      3 Batches
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabSelect('branch_fees')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-black transition cursor-pointer text-left ${
                      activeTab === 'branch_fees'
                        ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-300'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CreditCard className={`w-4 h-4 shrink-0 ${activeTab === 'branch_fees' ? 'text-emerald-300' : 'text-slate-500'}`} />
                      <span className="truncate">Branch Fee Collections</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                      activeTab === 'branch_fees' ? 'bg-emerald-300 text-slate-950' : 'bg-emerald-50 text-emerald-800'
                    }`}>
                      {branchRevenueFormatted}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabSelect('branch_certificates')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-black transition cursor-pointer text-left ${
                      activeTab === 'branch_certificates'
                        ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-300'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Award className={`w-4 h-4 shrink-0 ${activeTab === 'branch_certificates' ? 'text-amber-300' : 'text-slate-500'}`} />
                      <span className="truncate">Branch Certificate Desk</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900">
                      Official
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabSelect('branch_notices')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-black transition cursor-pointer text-left ${
                      activeTab === 'branch_notices'
                        ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-300'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className={`w-4 h-4 shrink-0 ${activeTab === 'branch_notices' ? 'text-teal-300' : 'text-slate-500'}`} />
                      <span className="truncate">HQ Directives & Notices</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-teal-100 text-teal-900">
                      2 New
                    </span>
                  </button>
                </>
              )}
            </nav>

          </div>

          {/* Pinned Bottom Helpline & Session Card (Only displayed for Branch Head; removed from Super Admin) */}
          {currentAdminRole === 'Branch Head' && (
            <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-slate-50/70 mt-auto">
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] space-y-1 shadow-xs">
                <div className="flex items-center justify-between font-bold text-slate-700">
                  <span>Academic Session</span>
                  <span className="text-emerald-700 font-black">2026-2027</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Helpline Support</span>
                  <span className="font-mono font-bold text-slate-800">98652 19131</span>
                </div>
                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                  <span>B★SEL Board Portal</span>
                  <span className="flex items-center gap-1 text-emerald-600 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Online
                  </span>
                </div>
              </div>
            </div>
          )}

        </aside>

        {/* =========================================================================
            RIGHT MAIN CONTENT: TAB PANELS & WORKSPACE
            ========================================================================= */}
        <main className="flex-1 min-w-0 w-full p-4 sm:p-6 lg:p-8 space-y-5 bg-slate-100">

            {/* BRANCH HEAD CONTEXT BANNER (Rendered when viewing as Branch Head) */}
            {currentAdminRole === 'Branch Head' && (
              <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-[#081d3d] text-white p-4 sm:p-5 rounded-2xl shadow-md border-2 border-emerald-400/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in duration-200">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 shrink-0">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-base sm:text-lg font-black text-white">{activeBranch}</h1>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-400 text-slate-950">
                        Concern Branch Active Desk
                      </span>
                    </div>
                    <p className="text-xs text-emerald-200 mt-0.5">
                      Centre Director: <strong className="text-amber-300">Mrs. Thangam Sivaji</strong> &nbsp;|&nbsp; 
                      Branch Code: <strong className="text-white">TSI-01</strong> &nbsp;|&nbsp; 
                      Helpline: <strong className="text-white">98652 19131</strong> &nbsp;|&nbsp; 
                      Location: <span className="text-emerald-100">Surandai, Tenkasi</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap self-end md:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setNewStudent(prev => ({ ...prev, branch: activeBranch, institution: activeBranch }));
                      setShowAddStudentModal(true);
                    }}
                    className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Enroll Student to This Branch</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewPayment(prev => ({ ...prev, branch: activeBranch }));
                      setShowAddPaymentModal(true);
                    }}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Record Branch Fee</span>
                  </button>
                </div>
              </div>
            )}

        {/* =========================================================================
            SUPER ADMIN: TAB 1 - EXECUTIVE OVERVIEW
            ========================================================================= */}
        {currentAdminRole === 'Super Admin' && activeTab === 'overview' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              
              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Students (All Branches)</span>
                  <div className="text-2xl font-black text-slate-950 mt-1">{totalStudentsCount}</div>
                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                    <TrendingUp className="w-3 h-3" /> All districts active
                  </span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-sky-100 text-[#0c234b] flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Master Courses</span>
                  <div className="text-2xl font-black text-slate-950 mt-1">{totalCoursesCount}</div>
                  <span className="text-[11px] font-bold text-sky-700 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Skill & Tech Modules
                  </span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Event Competitions</span>
                  <div className="text-2xl font-black text-slate-950 mt-1">{totalEventsCount}</div>
                  <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" /> State & National
                  </span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Franchise Enquiries</span>
                  <div className="text-2xl font-black text-slate-950 mt-1">{totalFranchiseCount}</div>
                  <span className="text-[11px] font-bold text-indigo-700 flex items-center gap-1 mt-0.5">
                    <Building className="w-3 h-3" /> Incoming pipeline
                  </span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                  <Building className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Payment Sectors</span>
                  <div className="text-2xl font-black text-emerald-800 mt-1">{totalRevenueFormatted}</div>
                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3" /> 100% Reconciled
                  </span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
              </div>

            </div>

            {/* Quick Action Bar for Super Admin */}
            <div className="bg-gradient-to-r from-[#0c234b] to-[#163e7c] text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-black">Executive Master Launchpad:</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(true)}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Course</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAddEventModal(true)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Competition / Event</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('franchise')}
                  className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>Review Franchise Leads</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(true)}
                  className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Register Student</span>
                </button>
              </div>
            </div>

            {/* Two-Column Overview Matrix: Branches Network & Payment Sectors Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              
              {/* Branch Network Performance */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-black text-slate-950 flex items-center gap-2">
                    <Building className="w-4 h-4 text-sky-600" />
                    <span>Regional Branch Network Performance</span>
                  </h2>
                  <button
                    onClick={() => setActiveTab('schools')}
                    className="text-xs font-bold text-sky-700 hover:underline flex items-center gap-1"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {schoolsList.slice(0, 4).map((school, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-black text-slate-900">{school.name}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{school.city}</span>
                          <span>•</span>
                          <span>Director: <strong className="text-slate-700">{school.principal || school.coordinator}</strong></span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {school.status}
                        </span>
                        <div className="text-xs font-bold text-slate-600 mt-1">{school.studentsCount} Students</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Sectors Summary */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-black text-slate-950 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Payment Sectors Distribution</span>
                  </h2>
                  <button
                    onClick={() => setActiveTab('payments')}
                    className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <span>Financial Ledger</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-sky-50 rounded-xl border border-sky-100">
                    <span className="text-[10px] font-bold uppercase text-sky-800">🎓 Course Tuition Sector</span>
                    <div className="text-base font-black text-sky-950 mt-1">₹48,500</div>
                    <span className="text-[10px] text-sky-700">Admission & Term Fees</span>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <span className="text-[10px] font-bold uppercase text-amber-800">🏆 Event Competitions</span>
                    <div className="text-base font-black text-amber-950 mt-1">₹38,000</div>
                    <span className="text-[10px] text-amber-700">State Olympiads</span>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                    <span className="text-[10px] font-bold uppercase text-purple-800">📦 Toolkits & Kits</span>
                    <div className="text-base font-black text-purple-950 mt-1">₹23,000</div>
                    <span className="text-[10px] text-purple-700">Abacus & Workbooks</span>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <span className="text-[10px] font-bold uppercase text-emerald-800">🏢 Franchise Affiliations</span>
                    <div className="text-base font-black text-emerald-950 mt-1">₹75,000</div>
                    <span className="text-[10px] text-emerald-700">3 Branch Licenses</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            SUPER ADMIN: TAB 2 - STUDENT REGISTRATIONS (MONITOR ALL BRANCHES)
            ========================================================================= */}
        {currentAdminRole === 'Super Admin' && activeTab === 'students' && (
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

            {/* Students Roster Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#081d3d] text-white uppercase text-[10px] tracking-wider font-black">
                    <tr>
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
                        <td colSpan="6" className="py-8 text-center text-slate-500">
                          No students matching your filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredStudentsSuperAdmin.map((student, idx) => (
                        <tr key={student.userId} className="hover:bg-slate-50/80 transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {/* Student Passport Photo Thumbnail */}
                              <div 
                                onClick={() => handleOpenMarksheet(student, idx)}
                                className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden border-2 border-amber-400/90 shadow-xs shrink-0 bg-slate-100 cursor-pointer hover:border-amber-500 hover:scale-105 transition group"
                                title="Click to view official marksheet"
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

                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Marksheet Button */}
                              <button
                                type="button"
                                onClick={() => handleOpenMarksheet(student, idx)}
                                className="px-2.5 py-1 bg-[#081d3d] hover:bg-[#123068] text-white font-black rounded-lg text-[10px] transition cursor-pointer flex items-center gap-1 shadow-xs border border-sky-400/30"
                                title="View & Print Official Marksheet"
                              >
                                <FileText className="w-3 h-3 text-amber-300" />
                                <span>Marksheet</span>
                              </button>

                              {/* Certificate Generator */}
                              <button
                                type="button"
                                onClick={() => handleOpenCertForStudent(student)}
                                className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-lg text-[10px] transition cursor-pointer flex items-center gap-1 shadow-xs"
                                title="Generate Certificate"
                              >
                                <Award className="w-3 h-3" />
                                <span>Cert</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUPER ADMIN: TAB 3 - COURSE DETAILS (MASTER COURSE DESK)
            ========================================================================= */}
        {currentAdminRole === 'Super Admin' && activeTab === 'courses' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Header & Add Button */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  <span>Master Courses & Curriculum Management</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Super Admin can add new courses, update duration, fee structures, outcomes, and syllabus levels.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Course</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Reset courses to official default syllabus?')) {
                      setCoursesList(resetStoredCourses());
                      showToast('Courses reset to default syllabus.');
                    }
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>
              </div>
            </div>

            {/* Category Filter & Search */}
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                {['All', 'Skill Development', 'Creative Arts', 'Languages', 'Digital & Technology'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCourseCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      courseCategoryFilter === cat
                        ? 'bg-[#0c234b] text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  placeholder="Filter courses..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl outline-none"
                />
              </div>
            </div>

            {/* Course Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4.5 flex flex-col justify-between hover:shadow-md transition">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                          Code: {course.code || 'BSEL'} • {course.category || 'Skill'}
                        </span>
                        <h3 className="text-base font-black text-slate-950 mt-0.5">{course.name}</h3>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[11px] font-black">
                        {course.fee || '₹450'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                      {course.shortDesc || course.description || course.tagline}
                    </p>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Age Group</span>
                        <span className="font-bold text-slate-800">{course.ageGroup || '5 - 15 Years'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Levels & Term</span>
                        <span className="font-bold text-slate-800">{course.levels || '6 Levels'}</span>
                      </div>
                    </div>

                    {/* Learning Outcomes Snippet */}
                    <div className="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] uppercase font-black text-slate-500 block mb-1">Key Outcomes:</span>
                      <ul className="text-[11px] text-slate-700 space-y-0.5 list-disc list-inside">
                        {(course.outcomes || []).slice(0, 2).map((outcome, idx) => (
                          <li key={idx} className="truncate">{outcome}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-sky-700">
                      {course.enrolledStudents || 12} enrolled
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleStartEditCourse(course)}
                        className="px-3 py-1 text-xs font-bold bg-slate-100 hover:bg-[#081d3d] text-slate-700 hover:text-white rounded-lg transition flex items-center gap-1 cursor-pointer shadow-2xs"
                        title="Edit course syllabus, fee, and outcomes"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Details</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteCourse(course.id, course.name)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Remove Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            SUPER ADMIN: TAB 4 - EVENT PAGE MANAGEMENT (COMPETITIONS)
            ========================================================================= */}
        {currentAdminRole === 'Super Admin' && activeTab === 'events' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-500" />
                  <span>Public Event Page Management</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage competitions, Olympiads, dates, fees, venues, and live registration links on the B★SEL website.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(true)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish New Event</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Reset events schedule to official default calendar?')) {
                      setEventsList(resetStoredEvents());
                      showToast('Events reset to official default schedule.');
                    }
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>
              </div>
            </div>

            {/* Event List Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#081d3d] text-white uppercase text-[10px] tracking-wider font-black">
                    <tr>
                      <th className="py-3 px-4">S.No & Event</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Location & Venue</th>
                      <th className="py-3 px-3">Event Date</th>
                      <th className="py-3 px-3">Reg. Fee</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {eventsList.map((event) => (
                      <tr key={event.sNo} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-slate-400 mr-1.5">#{event.sNo}</span>
                          <strong className="text-slate-950 text-xs">{event.eventName}</strong>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                            {event.category}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="text-slate-900 font-bold">{event.place}</div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[200px]">{event.venue}</div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-800">
                          {event.date}
                        </td>
                        <td className="py-3 px-3 font-black text-emerald-700">
                          {event.fee}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                            {event.status || 'Registration Open'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingEvent(event)}
                              className="px-2 py-1 text-slate-700 hover:text-white bg-slate-100 hover:bg-[#081d3d] rounded-lg transition cursor-pointer flex items-center gap-1 text-[11px] font-bold shadow-2xs"
                              title="Edit Event Details"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteEvent(event.sNo, event.eventName)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Delete Event"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUPER ADMIN: TAB 5 - FRANCHISE ENQUIRIES CRM
            ========================================================================= */}
        {currentAdminRole === 'Super Admin' && activeTab === 'franchise' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
                  <Building className="w-5 h-5 text-indigo-600" />
                  <span>Franchise Partner Enquiries & Applications</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage incoming franchise leads submitted from the Franchise page, schedule center inspections, and approve new authorized branches.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Filter Status:</span>
                <select
                  value={franchiseStatusFilter}
                  onChange={(e) => setFranchiseStatusFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-bold outline-none cursor-pointer"
                >
                  <option value="All">All Leads ({franchiseList.length})</option>
                  <option value="New Franchise Lead">New Franchise Lead</option>
                  <option value="In Discussion">In Discussion</option>
                  <option value="Site Inspection Scheduled">Site Inspection Scheduled</option>
                  <option value="Approved Franchise Branch">Approved Franchise Branch</option>
                </select>
              </div>
            </div>

            {/* Franchise Leads Cards / Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFranchiseLeads.map((lead) => (
                <div key={lead.refId} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4.5 flex flex-col justify-between hover:shadow-md transition">
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                            {lead.refId}
                          </span>
                          <span className="text-[10px] text-slate-400">{lead.date}</span>
                        </div>
                        <h3 className="text-base font-black text-slate-950 mt-1">{lead.name}</h3>
                      </div>

                      <select
                        value={lead.status}
                        onChange={(e) => handleUpdateFranchiseStatus(lead.refId, e.target.value, lead.notes)}
                        className={`text-[10px] font-black uppercase rounded-lg px-2.5 py-1 border outline-none cursor-pointer ${
                          lead.status === 'Approved Franchise Branch' 
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                            : lead.status === 'Site Inspection Scheduled'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-sky-100 text-sky-800 border-sky-300'
                        }`}
                      >
                        <option value="New Franchise Lead">New Franchise Lead</option>
                        <option value="In Discussion">In Discussion</option>
                        <option value="Site Inspection Scheduled">Site Inspection Scheduled</option>
                        <option value="Approved Franchise Branch">Approved Franchise Branch</option>
                        <option value="Archived">Archived / Rejected</option>
                      </select>
                    </div>

                    {/* Contact & Location */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Contact</span>
                        <div className="font-bold text-slate-800">{lead.phone}</div>
                        <div className="text-slate-500 truncate">{lead.email}</div>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Proposed Center</span>
                        <div className="font-bold text-slate-800">{lead.city}, {lead.district}</div>
                        <div className="text-slate-500">{lead.state || 'Tamil Nadu'}</div>
                      </div>
                    </div>

                    {/* Background & Space */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] space-y-1">
                      <div>
                        <strong className="text-slate-700">Profession:</strong> {lead.profession || 'Educator / Entrepreneur'}
                      </div>
                      <div>
                        <strong className="text-slate-700">Space:</strong> {lead.spaceAvailable || '1,200 sq ft'} &nbsp;|&nbsp; 
                        <strong className="text-slate-700">Budget:</strong> {lead.investmentBudget || '₹3 - ₹5 Lakhs'}
                      </div>
                      {lead.notes && (
                        <div className="text-indigo-900 bg-indigo-50/70 p-1.5 rounded text-[10px] italic border border-indigo-100">
                          Note: {lead.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500">
                      Timeline: <strong className="text-slate-700">{lead.launchTimeline || 'Immediate'}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      {lead.status !== 'Approved Franchise Branch' && (
                        <button
                          type="button"
                          onClick={() => handleApproveFranchiseToBranch(lead)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve Branch</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete enquiry ${lead.refId}?`)) {
                            setFranchiseList(deleteFranchiseLead(lead.refId));
                            showToast(`Enquiry ${lead.refId} removed.`);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            SUPER ADMIN: TAB 6 - PAYMENT SECTORS & FINANCIAL OVERSIGHT
            ========================================================================= */}
        {currentAdminRole === 'Super Admin' && activeTab === 'payments' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Header */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <span>Central Payment Sectors & Financial Management</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete ledger tracking Course Tuition, Event Competitions, Kit Dispatches, and Franchise Affiliation payments.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPaymentModal(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Record Payment / Receipt</span>
                </button>
              </div>
            </div>

            {/* 4 Financial Sector Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Sector 1</div>
                <div className="text-xs font-black text-sky-900 mt-0.5">Course Tuition & Admissions</div>
                <div className="text-xl font-black text-slate-950 mt-1">₹48,500</div>
                <span className="text-[10px] text-slate-500">Student level admissions</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Sector 2</div>
                <div className="text-xs font-black text-amber-900 mt-0.5">Competition & Events</div>
                <div className="text-xl font-black text-slate-950 mt-1">₹38,000</div>
                <span className="text-[10px] text-slate-500">State Championship tickets</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Sector 3</div>
                <div className="text-xs font-black text-purple-900 mt-0.5">Toolkits & Courseware</div>
                <div className="text-xl font-black text-slate-950 mt-1">₹23,000</div>
                <span className="text-[10px] text-slate-500">Workbooks & Abacus frames</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Sector 4</div>
                <div className="text-xs font-black text-emerald-900 mt-0.5">Franchise Affiliation</div>
                <div className="text-xl font-black text-slate-950 mt-1">₹75,000</div>
                <span className="text-[10px] text-slate-500">3 Branch Licenses</span>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-500">Filter Sector:</span>
                <select
                  value={paymentSectorFilter}
                  onChange={(e) => setPaymentSectorFilter(e.target.value)}
                  className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg outline-none font-bold bg-white"
                >
                  <option value="All">All Sectors</option>
                  <option value="Course Tuition">Course Tuition</option>
                  <option value="Competition & Events">Competition & Events</option>
                  <option value="Toolkits & Courseware">Toolkits & Courseware</option>
                  <option value="Franchise Affiliation">Franchise Affiliation</option>
                </select>

                <select
                  value={paymentBranchFilter}
                  onChange={(e) => setPaymentBranchFilter(e.target.value)}
                  className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg outline-none font-bold bg-white"
                >
                  <option value="All">All Branches</option>
                  <option value="Tenkasi">Tenkasi Regional Branch</option>
                  <option value="Chennai">Chennai Central Branch</option>
                  <option value="Coimbatore">Coimbatore Branch</option>
                </select>
              </div>

              <div className="text-xs font-black text-emerald-800">
                Filtered Total: ₹{filteredPayments.reduce((acc, p) => acc + (p.amountNum || 0), 0).toLocaleString('en-IN')}
              </div>
            </div>

            {/* Payment Transactions Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#081d3d] text-white uppercase text-[10px] tracking-wider font-black">
                    <tr>
                      <th className="py-3 px-4">Txn / Receipt No</th>
                      <th className="py-3 px-3">Payer Name</th>
                      <th className="py-3 px-3">Branch</th>
                      <th className="py-3 px-3">Payment Sector</th>
                      <th className="py-3 px-3">Amount</th>
                      <th className="py-3 px-3">Mode & UTR</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">
                          <div>{payment.id}</div>
                          <div className="text-[10px] text-slate-400">{payment.receiptNo}</div>
                        </td>

                        <td className="py-3 px-3">
                          <div className="font-extrabold text-slate-900">{payment.payerName}</div>
                          <div className="text-[10px] text-slate-500">{payment.date}</div>
                        </td>

                        <td className="py-3 px-3 text-slate-700">
                          {payment.branch}
                        </td>

                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                            {payment.sector}
                          </span>
                        </td>

                        <td className="py-3 px-3 font-black text-emerald-800 text-sm">
                          {payment.amount}
                        </td>

                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-800">{payment.paymentMode}</div>
                          <div className="font-mono text-[10px] text-slate-500">{payment.refNo}</div>
                        </td>

                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            payment.status === 'Verified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {payment.status}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {payment.status !== 'Verified' && (
                              <button
                                type="button"
                                onClick={() => handleVerifyPayment(payment.id)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold transition"
                              >
                                Verify
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setSelectedReceiptForPrint(payment)}
                              className="p-1 text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded transition"
                              title="Print Receipt"
                            >
                              <Printer className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete payment record ${payment.id}?`)) {
                                  setPaymentsList(deletePayment(payment.id));
                                  showToast('Payment record removed.');
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUPER ADMIN: TAB 7 - BRANCHES & AFFILIATED CENTRES
            ========================================================================= */}
        {currentAdminRole === 'Super Admin' && activeTab === 'schools' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
                  <School className="w-5 h-5 text-orange-500" />
                  <span>Authorized Branches & Partner Schools Network</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official B★SEL exam centres, accredited franchise academies, and regional institutions across Tamil Nadu and South India.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddSchoolModal(true)}
                className="px-4 py-2 bg-[#0c234b] hover:bg-[#163e7c] text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Affiliate New Centre</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {schoolsList.map((school) => (
                <div key={school.code} className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {school.code}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {school.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-slate-950">{school.name}</h3>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{school.city}</span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] space-y-0.5 mt-2">
                      <div>Principal/Head: <strong className="text-slate-800">{school.principal}</strong></div>
                      <div>Coordinator: <strong className="text-slate-800">{school.coordinator}</strong></div>
                      <div>Contact: <strong className="text-slate-800">{school.phone}</strong></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
                    <span className="text-xs font-extrabold text-sky-800">
                      {school.studentsCount} Active Students
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveBranch(school.name);
                        handleRoleSwitch('Branch Head');
                      }}
                      className="px-2.5 py-1 text-xs font-black bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg transition"
                    >
                      Open Branch Desk →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            SUPER ADMIN: TAB 8 - CERTIFICATE GENERATOR & DESK
            ========================================================================= */}
        {currentAdminRole === 'Super Admin' && activeTab === 'certificates' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Certificate Editor Controls */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    <span>Official Certificate Generator & Verification Desk</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live vector certificate engine with Board seal, accredited badges, and dual authorized signatures.
                  </p>
                </div>

                {/* Verification Lookup */}
                <form onSubmit={handleVerifyCertificate} className="flex items-center gap-1.5 w-full sm:w-auto">
                  <input
                    type="text"
                    value={verifyCertInput}
                    onChange={(e) => setVerifyCertInput(e.target.value)}
                    placeholder="Enter Certificate No or Reg No..."
                    className="px-3 py-1.5 text-xs border border-slate-300 rounded-xl outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#0c234b] text-white text-xs font-black rounded-xl hover:bg-[#163e7c] transition"
                  >
                    Verify
                  </button>
                </form>
              </div>

              {/* Live Form inputs to customize certificate parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Candidate Name</label>
                  <input
                    type="text"
                    value={certData.studentName}
                    onChange={(e) => setCertData(prev => ({ ...prev, studentName: e.target.value }))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-600 block mb-1">Course Title</label>
                  <input
                    type="text"
                    value={certData.courseName}
                    onChange={(e) => setCertData(prev => ({ ...prev, courseName: e.target.value }))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-600 block mb-1">Level / Grade</label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={certData.level}
                      onChange={(e) => setCertData(prev => ({ ...prev, level: e.target.value }))}
                      placeholder="Level"
                      className="w-1/2 px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none font-semibold"
                    />
                    <input
                      type="text"
                      value={certData.grade}
                      onChange={(e) => setCertData(prev => ({ ...prev, grade: e.target.value }))}
                      placeholder="Grade"
                      className="w-1/2 px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-600 block mb-1">Registration No</label>
                  <input
                    type="text"
                    value={certData.registrationNo}
                    onChange={(e) => setCertData(prev => ({ ...prev, registrationNo: e.target.value }))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none font-mono font-bold"
                  />
                </div>
              </div>

              {verifyResult && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>{verifyResult.candidateName}</strong> — {verifyResult.course} ({verifyResult.regNo}) • {verifyResult.status}</span>
                  </div>
                  <button onClick={() => setVerifyResult(null)} className="text-emerald-700 font-bold hover:underline">Dismiss</button>
                </div>
              )}
            </div>

            {/* Live Certificate Preview Canvas */}
            <div className="flex justify-center overflow-x-auto py-2">
              <Certificate
                studentName={certData.studentName}
                courseName={certData.courseName}
                programPrefix={certData.programPrefix}
                level={certData.level}
                grade={certData.grade}
                duration={certData.duration}
                registrationNo={certData.registrationNo}
                certificateNo={certData.certificateNo}
                centreName={certData.centreName}
                centreCode={certData.centreCode}
                centreAddress={certData.centreAddress}
                issueDate={certData.issueDate}
                certificateType={certData.certificateType}
                studentPhoto={certData.studentPhoto}
                showControls={true}
              />
            </div>
          </div>
        )}

        {/* =========================================================================
            BRANCH HEAD: TAB 1 - BRANCH OVERVIEW
            ========================================================================= */}
        {currentAdminRole === 'Branch Head' && activeTab === 'branch_overview' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Branch Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Branch Enrolled Students</span>
                  <div className="text-2xl font-black text-slate-950 mt-1">{branchStudents.length}</div>
                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Enrolled in {activeBranch}
                  </span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Active Batches</span>
                  <div className="text-2xl font-black text-slate-950 mt-1">3 Batches</div>
                  <span className="text-[11px] font-bold text-sky-700 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> Weekend & Weekday
                  </span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Branch Fees Collected</span>
                  <div className="text-2xl font-black text-emerald-800 mt-1">{branchRevenueFormatted}</div>
                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3" /> Branch desk collections
                  </span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Branch Attendance</span>
                  <div className="text-2xl font-black text-slate-950 mt-1">96.5%</div>
                  <span className="text-[11px] font-bold text-teal-700 flex items-center gap-1 mt-0.5">
                    <TrendingUp className="w-3 h-3" /> Excellent regularity
                  </span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                  <Check className="w-5 h-5" />
                </div>
              </div>

            </div>

            {/* Branch Students Quick List & Schedule */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              
              {/* Branch Students Quick List */}
              <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-black text-slate-950 flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>Recent Students Enrolled in {activeBranch}</span>
                  </h2>
                  <button
                    onClick={() => setActiveTab('branch_students')}
                    className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <span>Full Branch Roster</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {branchStudents.map((st) => (
                    <div key={st.userId} className="py-2.5 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-black text-slate-900 capitalize">{st.studentName}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-emerald-800 font-bold">{st.registerNumber || st.userId}</span>
                          <span>•</span>
                          <span>Course: <strong className="text-slate-700">{st.program}</strong></span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black rounded">
                          {st.grade || 'Level 1'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleOpenCertForStudent(st)}
                          className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded text-[10px] font-black"
                        >
                          Certificate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Branch Schedule */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <h2 className="text-sm font-black text-slate-950 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Weekly Branch Schedule</span>
                </h2>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="font-bold text-slate-900">Abacus Level 1 & 2 (Batch A)</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">Saturday & Sunday: 09:30 AM - 11:30 AM</div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="font-bold text-slate-900">Drawing & Fine Arts (Batch B)</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">Saturday & Sunday: 02:00 PM - 04:00 PM</div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="font-bold text-slate-900">Handwriting & Phonics (Batch C)</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">Tuesday & Thursday: 05:00 PM - 06:30 PM</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            BRANCH HEAD: TAB 2 - CONCERN BRANCH STUDENTS
            ========================================================================= */}
        {currentAdminRole === 'Branch Head' && activeTab === 'branch_students' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Header */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <span>{activeBranch} — Student Details & Records</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Managing students exclusively enrolled in {activeBranch}. Update levels, grades, parent contacts, and print certificates.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setNewStudent(prev => ({ ...prev, branch: activeBranch, institution: activeBranch }));
                    setShowAddStudentModal(true);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Enroll Student in This Branch</span>
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={branchStudentSearch}
                onChange={(e) => setBranchStudentSearch(e.target.value)}
                placeholder="Search branch students by name, reg no..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl outline-none"
              />
            </div>

            {/* Branch Students Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#081d3d] text-white uppercase text-[10px] tracking-wider font-black">
                    <tr>
                      <th className="py-3 px-4">Student & Reg No</th>
                      <th className="py-3 px-3">Parent & Phone</th>
                      <th className="py-3 px-3">Enrolled Course</th>
                      <th className="py-3 px-3">Current Level</th>
                      <th className="py-3 px-3">Fee Status</th>
                      <th className="py-3 px-3 text-right">Branch Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {branchStudents.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-slate-500">
                          No students currently enrolled under {activeBranch}. Click "+ Enroll Student in This Branch" above.
                        </td>
                      </tr>
                    ) : (
                      branchStudents.map((st) => (
                        <tr key={st.userId} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-4">
                            <div className="font-extrabold text-slate-900 capitalize">{st.studentName}</div>
                            <div className="text-[10px] text-emerald-800 font-mono font-bold mt-0.5">
                              {st.registerNumber || st.userId}
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <div className="text-slate-800">{st.parentName || 'Guardian'}</div>
                            <div className="text-[10px] text-slate-500">{st.phone}</div>
                          </td>

                          <td className="py-3 px-3 font-bold text-slate-900">
                            {st.program}
                          </td>

                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 font-black rounded text-[10px]">
                              {st.grade || 'Level 1'}
                            </span>
                          </td>

                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-black rounded-full text-[10px] uppercase">
                              {st.feeAmount || '₹450'} • {st.feePaymentType || 'Paid'}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenCertForStudent(st)}
                                className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded text-[10px] flex items-center gap-1"
                              >
                                <Award className="w-3 h-3" />
                                <span>Certificate</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setEditingStudent(st)}
                                className="p-1 text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded"
                                title="Update Student Record"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteStudent(st.userId, st.studentName)}
                                className="p-1 text-slate-400 hover:text-rose-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            BRANCH HEAD: TAB 3 - BATCHES & ATTENDANCE
            ========================================================================= */}
        {currentAdminRole === 'Branch Head' && activeTab === 'branch_batches' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <span>Branch Batches & Daily Attendance Register</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select your batch timing and mark attendance for today's classroom learners.
                </p>
              </div>

              {/* Batch Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Active Batch:</span>
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-bold outline-none cursor-pointer"
                >
                  <option value="Batch 1 - Weekend Morning">Batch 1: Abacus Juniors (Sat & Sun 09:30 AM)</option>
                  <option value="Batch 2 - Weekend Afternoon">Batch 2: Drawing & Art (Sat & Sun 02:00 PM)</option>
                  <option value="Batch 3 - Weekday Evening">Batch 3: Handwriting (Tue & Thu 05:00 PM)</option>
                </select>
              </div>
            </div>

            {/* Attendance Register Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800">
                  Attendance for Today ({new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}):
                </span>
                <button
                  type="button"
                  onClick={() => showToast('Attendance saved for this session!')}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-black transition"
                >
                  Save Attendance
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {branchStudents.map((st) => (
                  <div key={st.userId} className="py-2.5 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-extrabold text-slate-900 capitalize">{st.studentName}</div>
                      <div className="text-[10px] text-slate-500">Reg: {st.registerNumber || st.userId} • {st.program}</div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {['Present', 'Absent', 'Late'].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => {
                            setAttendanceRecords(prev => ({ ...prev, [st.userId]: status }));
                            showToast(`Marked ${st.studentName} as ${status}`);
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                            (attendanceRecords[st.userId] || 'Present') === status
                              ? status === 'Present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : status === 'Absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-amber-500 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            BRANCH HEAD: TAB 4 - BRANCH FEE COLLECTIONS & RECEIPTS
            ========================================================================= */}
        {currentAdminRole === 'Branch Head' && activeTab === 'branch_fees' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <span>{activeBranch} — Fee Collections & Receipts</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Record tuition payments collected at the branch desk and print official parent receipts.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setNewPayment(prev => ({ ...prev, branch: activeBranch }));
                  setShowAddPaymentModal(true);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Record Fee Payment at Branch</span>
              </button>
            </div>

            {/* Branch Payments Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#081d3d] text-white uppercase text-[10px] tracking-wider font-black">
                    <tr>
                      <th className="py-3 px-4">Receipt / Date</th>
                      <th className="py-3 px-3">Student Name</th>
                      <th className="py-3 px-3">Course / Purpose</th>
                      <th className="py-3 px-3">Amount</th>
                      <th className="py-3 px-3">Mode</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {branchPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-4">
                          <div className="font-mono font-bold text-slate-800">{p.receiptNo || p.id}</div>
                          <div className="text-[10px] text-slate-400">{p.date}</div>
                        </td>

                        <td className="py-3 px-3 font-extrabold text-slate-900 capitalize">
                          {p.payerName}
                        </td>

                        <td className="py-3 px-3 text-slate-700">
                          {p.program}
                        </td>

                        <td className="py-3 px-3 font-black text-emerald-800">
                          {p.amount}
                        </td>

                        <td className="py-3 px-3 text-slate-700">
                          {p.paymentMode}
                        </td>

                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                            {p.status}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedReceiptForPrint(p)}
                            className="px-2.5 py-1 text-slate-700 hover:text-sky-700 hover:bg-sky-50 rounded text-xs font-bold transition flex items-center gap-1 ml-auto"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Receipt</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            BRANCH HEAD: TAB 5 - BRANCH CERTIFICATE DESK
            ========================================================================= */}
        {currentAdminRole === 'Branch Head' && activeTab === 'branch_certificates' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>{activeBranch} — Official Certificate Desk</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Issue certificates with Centre Director signature ({activeBranch}) and Board accreditation seal.
                </p>
              </div>

              {/* Quick Select from Branch Students */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Select Branch Student:</span>
                <select
                  onChange={(e) => {
                    const st = branchStudents.find(s => s.userId === e.target.value);
                    if (st) handleOpenCertForStudent(st);
                  }}
                  className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-bold outline-none cursor-pointer"
                >
                  <option value="">-- Choose Branch Candidate --</option>
                  {branchStudents.map(s => (
                    <option key={s.userId} value={s.userId}>{s.studentName} ({s.program})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Certificate Canvas */}
            <div className="flex justify-center overflow-x-auto py-2">
              <Certificate
                studentName={certData.studentName}
                courseName={certData.courseName}
                programPrefix={certData.programPrefix}
                level={certData.level}
                grade={certData.grade}
                duration={certData.duration}
                registrationNo={certData.registrationNo}
                certificateNo={certData.certificateNo}
                centreName={activeBranch}
                centreCode={certData.centreCode}
                centreAddress={certData.centreAddress}
                issueDate={certData.issueDate}
                certificateType={certData.certificateType}
                studentPhoto={certData.studentPhoto}
                showControls={true}
              />
            </div>
          </div>
        )}

        {/* =========================================================================
            BRANCH HEAD: TAB 6 - HQ CIRCULARS & NOTICES
            ========================================================================= */}
        {currentAdminRole === 'Branch Head' && activeTab === 'branch_notices' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <span>Headquarters Directives & Academic Circulars</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Official notices dispatched by the B★SEL Central Secretariat to {activeBranch}.
              </p>
            </div>

            <div className="space-y-3">
              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 font-bold rounded text-[10px] uppercase">
                    Circular #BSEL/CIR/2026/04
                  </span>
                  <span className="text-xs text-slate-400">28 Oct 2026</span>
                </div>
                <h3 className="text-sm font-black text-slate-950">14th State Level Abacus Championship 2026 Confirmation</h3>
                <p className="text-xs text-slate-600">
                  All Centre Directors are requested to finalize candidate registrations for Level 1 through Level 8 abacus learners by 5th Nov 2026. Hall tickets and seating allotments will be published automatically in the branch portal.
                </p>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 bg-sky-100 text-sky-900 font-bold rounded text-[10px] uppercase">
                    Circular #BSEL/CIR/2026/03
                  </span>
                  <span className="text-xs text-slate-400">15 Oct 2026</span>
                </div>
                <h3 className="text-sm font-black text-slate-950">Updated Mindsparc Abacus Workbooks Dispatch</h3>
                <p className="text-xs text-slate-600">
                  New student toolkit shipments containing 17-rod wooden abacus frames and Level 1 practice exercise books have been dispatched via courier to {activeBranch}.
                </p>
              </div>
            </div>
          </div>
        )}

          </main>
      </div>

      {/* =========================================================================
          MODAL: OFFICIAL EXAMINATION MARKSHEET (SUPER ADMIN & ALL DESKS)
          ========================================================================= */}
      {showMarksheetModal && selectedMarksheetStudent && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border-2 border-amber-400/60 overflow-hidden animate-in zoom-in-95 duration-150 my-auto">
            
            {/* Top Toolbar (Controls) */}
            <div className="bg-gradient-to-r from-[#081d3d] via-[#0c234b] to-[#123068] text-white p-3.5 sm:p-4 flex items-center justify-between gap-3 border-b-2 border-amber-400 print:hidden">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <span>Official Statement of Marks</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500 text-white">
                      Verified Record
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    B★SEL Board Autonomous Skill Examination Directorate • Academic Year 2026–2027
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                  title="Print official marksheet"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Marksheet</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowMarksheetModal(false)}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Marksheet Container */}
            <div className="p-4 sm:p-6 md:p-8 bg-amber-50/20 text-slate-900 overflow-y-auto max-h-[80vh] print:max-h-none print:p-0 print:bg-white">
              <div className="bg-white border-4 border-[#0c234b] p-5 sm:p-7 md:p-8 rounded-xl shadow-md relative overflow-hidden">
                
                {/* Ornate Gold Inner Border */}
                <div className="absolute inset-1.5 sm:inset-2 border border-amber-500/60 pointer-events-none rounded-lg"></div>

                {/* Corner Accents */}
                <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-amber-600 pointer-events-none"></div>
                <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-amber-600 pointer-events-none"></div>
                <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-amber-600 pointer-events-none"></div>
                <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-amber-600 pointer-events-none"></div>

                {/* Header Banner */}
                <div className="text-center pb-4 border-b-2 border-amber-500/80 relative">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="shrink-0 flex items-center justify-center">
                      <Logo />
                    </div>

                    <div className="flex-1 text-center px-2">
                      <h1 className="text-base sm:text-lg md:text-xl font-black text-[#081d3d] uppercase tracking-wide font-serif">
                        Board of Skills and Educational Learning
                      </h1>
                      <div className="text-xs font-black text-amber-700 uppercase tracking-widest mt-0.5">
                        (B★SEL Autonomous National Council)
                      </div>
                      <p className="text-[10px] text-slate-600 mt-1">
                        Registered & Authorized Skill Assessment Authority • ISO 9001:2015 Certified
                      </p>
                      <p className="text-[9.5px] text-slate-500">
                        Head Office: Tenkasi, Tamil Nadu, India • Email: bsel.mindsparc@gmail.com • Ph: 98652 19131
                      </p>
                    </div>

                    <div className="shrink-0 hidden sm:flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full border-2 border-amber-500 bg-amber-50 flex items-center justify-center font-black text-[#081d3d] text-xs shadow-xs">
                        ★ B★SEL ★
                      </div>
                      <span className="text-[9px] font-bold text-slate-600 mt-1 uppercase">Official Seal</span>
                    </div>
                  </div>

                  {/* Ribbon Title */}
                  <div className="mt-3.5 bg-gradient-to-r from-[#081d3d] via-[#0c234b] to-[#081d3d] text-amber-300 py-1.5 px-4 rounded-md text-xs sm:text-sm font-black uppercase tracking-[0.18em] shadow-xs inline-block border border-amber-400">
                    STATEMENT OF MARKS & EVALUATION RECORD
                  </div>
                </div>

                {/* Candidate & Assessment Metadata Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4.5 border-b border-slate-200">
                  {/* Candidate Details (3 columns) */}
                  <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Candidate Name</span>
                      <span className="font-extrabold text-slate-900 text-sm uppercase">{selectedMarksheetStudent.studentName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Register Number</span>
                      <span className="font-mono font-bold text-sky-800 text-sm">{selectedMarksheetStudent.registerNumber || selectedMarksheetStudent.userId}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Course / Program</span>
                      <span className="font-bold text-slate-900">{selectedMarksheetStudent.program || selectedMarksheetStudent.courseName || 'Abacus'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Examination Level</span>
                      <span className="font-bold text-amber-700 uppercase">{selectedMarksheetStudent.grade || 'Level 1'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Study & Examination Centre</span>
                      <span className="font-semibold text-slate-800">{selectedMarksheetStudent.branch || selectedMarksheetStudent.institution || 'Tenkasi Regional Branch'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Centre Code / Serial No.</span>
                      <span className="font-mono font-bold text-slate-700">545454 • {selectedMarksheetStudent.marksheetNo}</span>
                    </div>
                  </div>

                  {/* Student Photo Column */}
                  <div className="flex md:flex-col items-center justify-center gap-2 shrink-0">
                    <div className="w-22 h-26 sm:w-24 sm:h-28 rounded-lg overflow-hidden border-2 border-amber-500 shadow-sm bg-slate-50 p-1 flex flex-col items-center justify-center">
                      <img 
                        src={selectedMarksheetStudent.photoUrl} 
                        alt="Student" 
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="text-[9px] font-bold text-slate-500 text-center uppercase tracking-wider">
                      Student Photo
                    </div>
                  </div>
                </div>

                {/* Marks Breakdown Table */}
                <div className="py-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-slate-300">
                      <thead className="bg-[#081d3d] text-white uppercase text-[10px] tracking-wider font-black">
                        <tr>
                          <th className="py-2.5 px-3 border border-slate-300 text-center w-12">Sl.</th>
                          <th className="py-2.5 px-3 border border-slate-300">Subject / Examination Component</th>
                          <th className="py-2.5 px-3 border border-slate-300 text-center w-24">Max Marks</th>
                          <th className="py-2.5 px-3 border border-slate-300 text-center w-24">Min Pass</th>
                          <th className="py-2.5 px-3 border border-slate-300 text-center w-24">Marks Secured</th>
                          <th className="py-2.5 px-3 border border-slate-300 text-center w-20">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 font-semibold text-slate-800">
                        {selectedMarksheetStudent.subjects?.map((sub, sIdx) => (
                          <tr key={sub.id} className={sIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                            <td className="py-2.5 px-3 border border-slate-300 text-center font-bold text-slate-500">{sIdx + 1}</td>
                            <td className="py-2.5 px-3 border border-slate-300 font-bold text-slate-900">{sub.name}</td>
                            <td className="py-2.5 px-3 border border-slate-300 text-center">{sub.max}</td>
                            <td className="py-2.5 px-3 border border-slate-300 text-center text-slate-500">{sub.min}</td>
                            <td className="py-2.5 px-3 border border-slate-300 text-center font-black text-sky-900">{sub.marks}</td>
                            <td className="py-2.5 px-3 border border-slate-300 text-center">
                              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-900">
                                {sub.grade}
                              </span>
                            </td>
                          </tr>
                        ))}

                        {/* Grand Total Row */}
                        <tr className="bg-amber-100/70 text-slate-950 font-black text-xs border-t-2 border-slate-400">
                          <td colSpan="2" className="py-2.5 px-3 border border-slate-300 uppercase tracking-wider text-right pr-4">
                            Grand Total
                          </td>
                          <td className="py-2.5 px-3 border border-slate-300 text-center font-black">
                            {selectedMarksheetStudent.totalMax}
                          </td>
                          <td className="py-2.5 px-3 border border-slate-300 text-center font-bold text-slate-600">
                            40
                          </td>
                          <td className="py-2.5 px-3 border border-slate-300 text-center font-black text-emerald-900 text-sm">
                            {selectedMarksheetStudent.totalMarks}
                          </td>
                          <td className="py-2.5 px-3 border border-slate-300 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-700 text-white">
                              PASS
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Result & Evaluation Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3 border-y border-slate-200 bg-slate-50/80 p-3 rounded-lg text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Percentage</span>
                    <span className="text-base font-black text-sky-900">{selectedMarksheetStudent.percentage}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Overall Grade</span>
                    <span className="text-base font-black text-amber-700">{selectedMarksheetStudent.overallGrade}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Final Result Status</span>
                    <span className="text-xs font-black text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 inline-block mt-0.5">
                      {selectedMarksheetStudent.resultText}
                    </span>
                  </div>
                </div>

                {/* Footer Signatures & QR Verification */}
                <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center text-xs">
                  {/* Centre Director */}
                  <div className="space-y-1">
                    <div className="font-serif italic font-bold text-sm text-slate-800 border-b border-slate-400 pb-1 px-4">
                      Sankar / Centre Director
                    </div>
                    <div className="font-bold text-[11px] text-slate-900 uppercase">Centre Director</div>
                    <div className="text-[9.5px] text-slate-500">{selectedMarksheetStudent.branch || 'test branch'}</div>
                  </div>

                  {/* QR & Verification Box */}
                  <div className="flex items-center gap-2.5 border border-amber-300 bg-amber-50/50 p-2 rounded-lg">
                    <div className="w-12 h-12 bg-white border border-amber-400 p-0.5 rounded shrink-0">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-[#0c234b]">
                        <rect x="5" y="5" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="5" />
                        <rect x="12" y="12" width="14" height="14" fill="currentColor" />
                        <rect x="67" y="5" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="5" />
                        <rect x="74" y="12" width="14" height="14" fill="currentColor" />
                        <rect x="5" y="67" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="5" />
                        <rect x="12" y="74" width="14" height="14" fill="currentColor" />
                        <rect x="42" y="8" width="6" height="6" fill="currentColor" />
                        <rect x="52" y="15" width="6" height="6" fill="currentColor" />
                        <rect x="40" y="24" width="6" height="6" fill="currentColor" />
                        <rect x="50" y="32" width="6" height="6" fill="currentColor" />
                        <rect x="42" y="44" width="16" height="16" fill="currentColor" />
                      </svg>
                    </div>
                    <div className="text-left text-[9.5px] text-slate-600">
                      <div className="font-black text-slate-900 uppercase">Digitally Authenticated</div>
                      <div>B★SEL Registry Verification</div>
                      <div className="font-mono text-slate-500">ID: {selectedMarksheetStudent.userId}</div>
                    </div>
                  </div>

                  {/* Authorized Signatory */}
                  <div className="space-y-1">
                    <div className="font-serif italic font-bold text-sm text-slate-800 border-b border-slate-400 pb-1 px-4">
                      AAshwini / Secretary
                    </div>
                    <div className="font-bold text-[11px] text-slate-900 uppercase">Authorized Signatory</div>
                    <div className="text-[9.5px] text-slate-500">Board of Skills & Educational Learning</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Bottom Close */}
            <div className="bg-slate-50 p-3 flex items-center justify-end border-t border-slate-200 print:hidden">
              <button
                type="button"
                onClick={() => setShowMarksheetModal(false)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Close Marksheet
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: REGISTER NEW STUDENT (SUPER ADMIN & BRANCH HEAD)
          ========================================================================= */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-[#081d3d] text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black">
                  {currentAdminRole === 'Branch Head' ? `Enroll Student in ${activeBranch}` : 'Register New Student (Central Registry)'}
                </h3>
                <p className="text-[11px] text-slate-300">Generates official B★SEL registration number & credentials</p>
              </div>
              <button onClick={() => setShowAddStudentModal(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Candidate Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newStudent.studentName}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, studentName: e.target.value }))}
                    placeholder="e.g. Sivaji Pandian"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Parent / Guardian Name</label>
                  <input
                    type="text"
                    value={newStudent.parentName}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, parentName: e.target.value }))}
                    placeholder="e.g. M. Sivaji"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Course Program *</label>
                  <select
                    value={newStudent.program}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, program: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white font-bold"
                  >
                    {coursesList.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Grade / Level</label>
                  <select
                    value={newStudent.grade}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, grade: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white"
                  >
                    <option value="Level 1">Level 1</option>
                    <option value="Level 2">Level 2</option>
                    <option value="Level 3">Level 3</option>
                    <option value="Level 4">Level 4</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone / Mobile *</label>
                  <input
                    type="tel"
                    required
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="10-digit mobile number"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assigned Branch *</label>
                  <input
                    type="text"
                    readOnly={currentAdminRole === 'Branch Head'}
                    value={currentAdminRole === 'Branch Head' ? activeBranch : newStudent.branch}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, branch: e.target.value, institution: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-slate-50 font-bold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Student Residential Address</label>
                <input
                  type="text"
                  value={newStudent.address}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Street address, city, district"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black transition"
                >
                  Enroll & Generate ID
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2B: EDIT EXISTING COURSE (SUPER ADMIN)
          ========================================================================= */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 my-auto">
            
            {/* Header */}
            <div className="bg-[#081d3d] text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  <span>Edit Course Details — {editingCourse.name}</span>
                </h3>
                <p className="text-[11px] text-slate-300">
                  Update syllabus, fee structure, age group, levels, and outcomes
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setEditingCourse(null)} 
                className="text-white/80 hover:text-white cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateCourse} className="p-5 space-y-3.5 text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Course Name *</label>
                  <input
                    type="text"
                    required
                    value={editingCourse.name || ''}
                    onChange={(e) => setEditingCourse(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-emerald-600 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Course Code</label>
                  <input
                    type="text"
                    value={editingCourse.code || ''}
                    onChange={(e) => setEditingCourse(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={editingCourse.category || 'Skill Development'}
                    onChange={(e) => setEditingCourse(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white font-bold"
                  >
                    <option value="Skill Development">Skill Development</option>
                    <option value="Digital & Technology">Digital & Technology</option>
                    <option value="Creative Arts">Creative Arts</option>
                    <option value="Languages">Languages</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Course Fee</label>
                  <input
                    type="text"
                    value={editingCourse.fee || ''}
                    onChange={(e) => setEditingCourse(prev => ({ ...prev, fee: e.target.value }))}
                    placeholder="e.g. ₹450"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Age Group</label>
                  <input
                    type="text"
                    value={editingCourse.ageGroup || ''}
                    onChange={(e) => setEditingCourse(prev => ({ ...prev, ageGroup: e.target.value }))}
                    placeholder="e.g. 5 - 14 Years"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Levels & Term</label>
                  <input
                    type="text"
                    value={editingCourse.levels || ''}
                    onChange={(e) => setEditingCourse(prev => ({ ...prev, levels: e.target.value }))}
                    placeholder="e.g. 8 Structured Levels"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration per Level</label>
                  <input
                    type="text"
                    value={editingCourse.duration || ''}
                    onChange={(e) => setEditingCourse(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g. 3 Months per Level"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Enrollment Status</label>
                  <select
                    value={editingCourse.status || 'Active'}
                    onChange={(e) => setEditingCourse(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white font-bold"
                  >
                    <option value="Active">Active (Accepting Enrollments)</option>
                    <option value="Upcoming">Upcoming / In Review</option>
                    <option value="Inactive">Inactive / Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Short Description / Tagline</label>
                <textarea
                  rows="2"
                  value={editingCourse.shortDesc || editingCourse.tagline || ''}
                  onChange={(e) => setEditingCourse(prev => ({ ...prev, shortDesc: e.target.value, tagline: e.target.value }))}
                  placeholder="Concise summary shown on cards..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Course Description</label>
                <textarea
                  rows="3"
                  value={editingCourse.description || ''}
                  onChange={(e) => setEditingCourse(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Comprehensive course background, methodologies and scope..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Key Outcomes <span className="font-normal text-slate-400">(one per line)</span>
                </label>
                <textarea
                  rows="3"
                  value={editingCourse.outcomesText ?? (Array.isArray(editingCourse.outcomes) ? editingCourse.outcomes.join('\n') : '')}
                  onChange={(e) => setEditingCourse(prev => ({ ...prev, outcomesText: e.target.value }))}
                  placeholder="Master core principles&#10;Boost calculation speed by 10x&#10;Gain certificate"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-sans"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Curriculum Syllabus Structure <span className="font-normal text-slate-400">(one level per line)</span>
                </label>
                <textarea
                  rows="3"
                  value={editingCourse.curriculumText ?? (Array.isArray(editingCourse.curriculum) ? editingCourse.curriculum.join('\n') : '')}
                  onChange={(e) => setEditingCourse(prev => ({ ...prev, curriculumText: e.target.value }))}
                  placeholder="Level 1: Fundamentals & Basics&#10;Level 2: Formulas & Drills&#10;Level 3: Advanced Applications"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#081d3d] hover:bg-[#123068] text-white rounded-xl font-black transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-[#081d3d] text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black">Add New Course to Master Curriculum</h3>
                <p className="text-[11px] text-slate-300">Creates new syllabus, sets duration, outcomes, and tuition fee</p>
              </div>
              <button onClick={() => setShowAddCourseModal(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Course Name *</label>
                  <input
                    type="text"
                    required
                    value={newCourse.name}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Vedic Mathematics"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Course Code (2-3 chars)</label>
                  <input
                    type="text"
                    value={newCourse.code}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="e.g. VM"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newCourse.category}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white font-bold"
                  >
                    <option value="Skill Development">Skill Development</option>
                    <option value="Digital & Technology">Digital & Technology</option>
                    <option value="Creative Arts">Creative Arts</option>
                    <option value="Languages">Languages</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Course Fee</label>
                  <input
                    type="text"
                    value={newCourse.fee}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, fee: e.target.value }))}
                    placeholder="e.g. ₹500"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Age Group</label>
                  <input
                    type="text"
                    value={newCourse.ageGroup}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, ageGroup: e.target.value }))}
                    placeholder="e.g. 6 - 15 Years"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Levels & Term</label>
                  <input
                    type="text"
                    value={newCourse.levels}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, levels: e.target.value }))}
                    placeholder="e.g. 4 Progressive Levels"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Course Tagline & Description</label>
                <textarea
                  rows="2"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, description: e.target.value, shortDesc: e.target.value }))}
                  placeholder="Overview of the course and why students should join..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black transition"
                >
                  Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: ADD NEW EVENT (SUPER ADMIN)
          ========================================================================= */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-[#081d3d] text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black">Publish New Event / Championship</h3>
                <p className="text-[11px] text-slate-300">Syncs immediately to the public Events page and student registration desk</p>
              </div>
              <button onClick={() => setShowAddEventModal(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Event / Competition Name *</label>
                  <input
                    type="text"
                    required
                    value={newEvent.eventName}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, eventName: e.target.value }))}
                    placeholder="e.g. 15th National Mental Arithmetic Olympiad"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white font-bold"
                  >
                    <option value="Abacus">Abacus</option>
                    <option value="Drawing & Art">Drawing & Art</option>
                    <option value="Handwriting">Handwriting</option>
                    <option value="Language Speaking">Language Speaking</option>
                    <option value="Athletics">Athletics</option>
                    <option value="Colour Management">Colour Management</option>
                    <option value="Coding">Python / Coding</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Registration Fee</label>
                  <input
                    type="text"
                    value={newEvent.fee}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, fee: e.target.value }))}
                    placeholder="₹450"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Event Date</label>
                  <input
                    type="text"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                    placeholder="e.g. 25 Jan 2027"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Last Date to Register</label>
                  <input
                    type="text"
                    value={newEvent.lastDate}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, lastDate: e.target.value }))}
                    placeholder="e.g. 15 Jan 2027"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Location / City</label>
                  <input
                    type="text"
                    value={newEvent.place}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, place: e.target.value }))}
                    placeholder="e.g. CHENNAI (TAMIL NADU)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Venue Address</label>
                  <input
                    type="text"
                    value={newEvent.venue}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, venue: e.target.value }))}
                    placeholder="Auditorium / Stadium name"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Eligibility Criteria</label>
                <input
                  type="text"
                  value={newEvent.eligibility}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, eligibility: e.target.value }))}
                  placeholder="e.g. Age 5 to 14 Years (Level 1 to 8)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black transition"
                >
                  Publish to Events Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3B: EDIT EXISTING EVENT / CHAMPIONSHIP (SUPER ADMIN)
          ========================================================================= */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 my-auto">
            
            {/* Header */}
            <div className="bg-[#081d3d] text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  <span>Edit Event — #{editingEvent.sNo} {editingEvent.eventName}</span>
                </h3>
                <p className="text-[11px] text-slate-300">
                  Update competition dates, venue, eligibility, fee, and registration status
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setEditingEvent(null)} 
                className="text-white/80 hover:text-white cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateEvent} className="p-5 space-y-3.5 text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Event / Competition Name *</label>
                  <input
                    type="text"
                    required
                    value={editingEvent.eventName || ''}
                    onChange={(e) => setEditingEvent(prev => ({ ...prev, eventName: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-bold focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={editingEvent.category || 'Abacus'}
                    onChange={(e) => setEditingEvent(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white font-bold"
                  >
                    <option value="Abacus">Abacus</option>
                    <option value="Drawing & Art">Drawing & Art</option>
                    <option value="Handwriting">Handwriting</option>
                    <option value="Language Speaking">Language Speaking</option>
                    <option value="Athletics">Athletics</option>
                    <option value="Colour Management">Colour Management</option>
                    <option value="Coding">Python / Coding</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Registration Fee</label>
                  <input
                    type="text"
                    value={editingEvent.fee || ''}
                    onChange={(e) => setEditingEvent(prev => ({ ...prev, fee: e.target.value }))}
                    placeholder="₹450"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Event Date</label>
                  <input
                    type="text"
                    value={editingEvent.date || ''}
                    onChange={(e) => setEditingEvent(prev => ({ ...prev, date: e.target.value }))}
                    placeholder="e.g. 15 Jan 2027"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Last Date to Register</label>
                  <input
                    type="text"
                    value={editingEvent.lastDate || ''}
                    onChange={(e) => setEditingEvent(prev => ({ ...prev, lastDate: e.target.value }))}
                    placeholder="e.g. 05 Jan 2027"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Location / City</label>
                  <input
                    type="text"
                    value={editingEvent.place || ''}
                    onChange={(e) => setEditingEvent(prev => ({ ...prev, place: e.target.value }))}
                    placeholder="e.g. CHENNAI (TAMIL NADU)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Registration Status</label>
                  <select
                    value={editingEvent.status || 'Registration Open'}
                    onChange={(e) => setEditingEvent(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white font-bold"
                  >
                    <option value="Registration Open">Registration Open</option>
                    <option value="Limited Seats">Limited Seats</option>
                    <option value="Registration Closed">Registration Closed</option>
                    <option value="Hall Tickets Issued">Hall Tickets Issued</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Venue Address</label>
                  <input
                    type="text"
                    value={editingEvent.venue || ''}
                    onChange={(e) => setEditingEvent(prev => ({ ...prev, venue: e.target.value }))}
                    placeholder="Auditorium / Stadium name"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Eligibility Criteria</label>
                <input
                  type="text"
                  value={editingEvent.eligibility || ''}
                  onChange={(e) => setEditingEvent(prev => ({ ...prev, eligibility: e.target.value }))}
                  placeholder="e.g. Age 5 to 14 Years (Level 1 to 8)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Event Description & Rules</label>
                <textarea
                  rows="3"
                  value={editingEvent.description || ''}
                  onChange={(e) => setEditingEvent(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Details about rounds, materials, and guidelines..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: RECORD PAYMENT / ISSUE RECEIPT (SUPER ADMIN & BRANCH HEAD)
          ========================================================================= */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-[#081d3d] text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black">Record Payment & Generate Official Receipt</h3>
                <p className="text-[11px] text-slate-300">Creates an authenticated transaction in the Payment Sector ledger</p>
              </div>
              <button onClick={() => setShowAddPaymentModal(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOfflinePayment} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Payer / Candidate Name *</label>
                  <input
                    type="text"
                    required
                    value={newPayment.payerName}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, payerName: e.target.value }))}
                    placeholder="e.g. Sivaji Pandian"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Payment Sector</label>
                  <select
                    value={newPayment.sector}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, sector: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white font-bold"
                  >
                    <option value="Course Tuition">Course Tuition</option>
                    <option value="Competition & Events">Competition & Events</option>
                    <option value="Toolkits & Courseware">Toolkits & Courseware</option>
                    <option value="Franchise Affiliation">Franchise Affiliation</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Amount (₹) *</label>
                  <input
                    type="text"
                    required
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="₹450"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Payment Mode</label>
                  <select
                    value={newPayment.paymentMode}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, paymentMode: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white"
                  >
                    <option value="Cash at Centre">Cash at Centre</option>
                    <option value="UPI / QR Code">UPI / QR Code</option>
                    <option value="UPI / GPay">UPI / GPay</option>
                    <option value="NEFT / Bank Transfer">NEFT / Bank Transfer</option>
                    <option value="Cheque / DD">Cheque / DD</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Reference / UTR No</label>
                  <input
                    type="text"
                    value={newPayment.refNo}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, refNo: e.target.value }))}
                    placeholder="Transaction reference"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Branch</label>
                  <input
                    type="text"
                    readOnly={currentAdminRole === 'Branch Head'}
                    value={currentAdminRole === 'Branch Head' ? activeBranch : newPayment.branch}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, branch: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-slate-50 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Course / Purpose Details</label>
                <input
                  type="text"
                  value={newPayment.program}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, program: e.target.value }))}
                  placeholder="e.g. Abacus Level 1 Admission Fee"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddPaymentModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black transition"
                >
                  Record & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 5: PRINTABLE OFFICIAL FEE RECEIPT
          ========================================================================= */}
      {selectedReceiptForPrint && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="bg-[#081d3d] text-white p-4.5 flex items-center justify-between border-b-2 border-amber-400">
              <div className="flex items-center gap-2">
                <Logo lightText={true} />
                <span className="text-xs font-black uppercase text-amber-300 tracking-wider">Official Fee Receipt</span>
              </div>
              <button onClick={() => setSelectedReceiptForPrint(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Content */}
            <div className="p-6 space-y-4 text-xs font-sans">
              <div className="flex justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Receipt Number</span>
                  <div className="text-sm font-black font-mono text-slate-900">{selectedReceiptForPrint.receiptNo || selectedReceiptForPrint.id}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Date of Payment</span>
                  <div className="font-bold text-slate-800">{selectedReceiptForPrint.date}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Candidate / Payer</span>
                  <strong className="text-slate-900 text-sm capitalize">{selectedReceiptForPrint.payerName}</strong>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Issuing Branch</span>
                  <strong className="text-slate-900">{selectedReceiptForPrint.branch}</strong>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Payment Sector</span>
                  <span className="text-slate-800 font-bold">{selectedReceiptForPrint.sector}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Course / Purpose</span>
                  <span className="text-slate-800 font-bold">{selectedReceiptForPrint.program}</span>
                </div>
              </div>

              {/* Amount Box */}
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">Total Fee Paid</span>
                  <div className="text-2xl font-black text-emerald-900">{selectedReceiptForPrint.amount}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 block">Mode: {selectedReceiptForPrint.paymentMode}</span>
                  <span className="font-mono text-[10px] text-emerald-800">Ref: {selectedReceiptForPrint.refNo}</span>
                </div>
              </div>

              {/* Verification Stamp */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticated by {selectedReceiptForPrint.verifiedBy || 'B★SEL Desk'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-[#081d3d] hover:bg-[#123068] text-white rounded-lg font-black text-xs transition flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 6: EDIT STUDENT
          ========================================================================= */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-[#081d3d] text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black">Edit Student Profile: {editingStudent.studentName}</h3>
                <p className="text-[11px] text-slate-300">ID: {editingStudent.userId} • Reg: {editingStudent.registerNumber || editingStudent.registrationNo}</p>
              </div>
              <button onClick={() => setEditingStudent(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStudent} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Student Name</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.studentName}
                    onChange={(e) => setEditingStudent(prev => ({ ...prev, studentName: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Parent Name</label>
                  <input
                    type="text"
                    value={editingStudent.parentName || ''}
                    onChange={(e) => setEditingStudent(prev => ({ ...prev, parentName: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingStudent.phone || ''}
                    onChange={(e) => setEditingStudent(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Course Program</label>
                  <input
                    type="text"
                    value={editingStudent.program || ''}
                    onChange={(e) => setEditingStudent(prev => ({ ...prev, program: e.target.value, courseName: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Level / Grade</label>
                  <input
                    type="text"
                    value={editingStudent.grade || ''}
                    onChange={(e) => setEditingStudent(prev => ({ ...prev, grade: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Branch</label>
                  <input
                    type="text"
                    value={editingStudent.branch || editingStudent.institution || ''}
                    onChange={(e) => setEditingStudent(prev => ({ ...prev, branch: e.target.value, institution: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 7: AFFILIATE NEW CENTRE / SCHOOL (SUPER ADMIN)
          ========================================================================= */}
      {showAddSchoolModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-[#081d3d] text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black">Affiliate New Branch / Exam Centre</h3>
                <p className="text-[11px] text-slate-300">Assigns unique B★SEL Centre Code and sets Centre Director credentials</p>
              </div>
              <button onClick={() => setShowAddSchoolModal(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newSchool.name.trim()) return;
              const nextCode = `BSEL-CTR-${100 + schoolsList.length + 1}`;
              const created = {
                ...newSchool,
                code: nextCode,
                branchName: newSchool.branchName || newSchool.name,
                status: 'Active Partner'
              };
              const updated = [...schoolsList, created];
              setSchoolsList(updated);
              saveStoredSchools(updated);
              setShowAddSchoolModal(false);
              showToast(`Affiliated "${created.name}" with Centre Code ${nextCode}!`);
            }} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Institution / Branch Name *</label>
                  <input
                    type="text"
                    required
                    value={newSchool.name}
                    onChange={(e) => setNewSchool(prev => ({ ...prev, name: e.target.value, branchName: e.target.value }))}
                    placeholder="e.g. B★SEL Madurai Regional Academy"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">City & District *</label>
                  <input
                    type="text"
                    required
                    value={newSchool.city}
                    onChange={(e) => setNewSchool(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="e.g. Madurai, Tamil Nadu"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Helpline</label>
                  <input
                    type="tel"
                    value={newSchool.phone}
                    onChange={(e) => setNewSchool(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="e.g. 98401 23456"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Centre Director / Principal</label>
                  <input
                    type="text"
                    value={newSchool.principal}
                    onChange={(e) => setNewSchool(prev => ({ ...prev, principal: e.target.value }))}
                    placeholder="e.g. Dr. S. Ranganathan"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Branch Coordinator</label>
                  <input
                    type="text"
                    value={newSchool.coordinator}
                    onChange={(e) => setNewSchool(prev => ({ ...prev, coordinator: e.target.value }))}
                    placeholder="e.g. Mrs. K. Malathi"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddSchoolModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#081d3d] hover:bg-[#123068] text-white rounded-xl font-black transition"
                >
                  Affiliate Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
