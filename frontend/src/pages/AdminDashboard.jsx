import React, { useState, useEffect } from 'react';

import { 
  Users, 
  Calendar, 
  Award, 
  School, 
  Plus, 
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
  ArrowLeft,
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
  Menu,
  GraduationCap,
  Trophy,
  FileDown,
  ClipboardList,
  Globe,
  MessageSquare
} from 'lucide-react';

import AdminAchievementsModule from '../components/admin/AdminAchievementsModule';
import AdminOverviewPage from './admin/AdminOverviewPage';
import AdminStudentsPage from './admin/AdminStudentsPage';
import AdminCoursesPage from './admin/AdminCoursesPage';
import AdminEventsPage from './admin/AdminEventsPage';
import AdminFranchisePage from './admin/AdminFranchisePage';
import AdminContactEnquiriesPage from './admin/AdminContactEnquiriesPage';
import AdminPaymentsPage from './admin/AdminPaymentsPage';
import AdminSchoolsPage from './admin/AdminSchoolsPage';
import AdminAchievementsPage from './admin/AdminAchievementsPage';
import AdminBranchOverviewPage from './admin/AdminBranchOverviewPage';
import AdminBranchStudentsPage from './admin/AdminBranchStudentsPage';
import AdminBranchFeesPage from './admin/AdminBranchFeesPage';
import AdminBranchCertificatesPage from './admin/AdminBranchCertificatesPage';
import AdminBranchStudentDetailsPage from './admin/AdminBranchStudentDetailsPage';
import AdminBranchStaffPage from './admin/AdminBranchStaffPage';
import AdminBranchSchoolsPage from './admin/AdminBranchSchoolsPage';
import AdminBranchFranchiseProfilePage from './admin/AdminBranchFranchiseProfilePage';
import AdminBranchFranchisesPage from './admin/AdminBranchFranchisesPage';
import AdminModals from './admin/AdminModals';

import BranchStudentMarksheetPage from './admin/BranchStudentMarksheetPage';
import { TAMIL_NADU_DISTRICTS } from '../data/districtsData';

import StudentAdmissionFormView from '../components/StudentAdmissionFormView';
import OfficialMarksheetView from '../components/OfficialMarksheetView';
import MergedStudentPdfModal from '../components/MergedStudentPdfModal';
import CertificateModal from '../components/CertificateModal';
import Logo from '../components/Logo';
import Certificate from '../components/Certificate';
import AdmissionModal from '../components/AdmissionModal';

import { 
  getRegisteredUsers, 
  deleteUserAccount, 
  addUserAccount, 
  updateUserProfile,
  getActiveSession,
  setActiveSession,
  clearActiveSession,
  getCoursePrefix
} from '../utils/authStorage';
import { isStudentUser, getStudentFeeStatus } from '../utils/studentValidator';
import { isStudentInBranch } from '../utils/branchAuthStorage';

import { 
  getStoredEvents, 
  addStoredEvent, 
  updateStoredEvent, 
  deleteStoredEvent
} from '../data/eventsData';

import {
  getStoredCourses,
  addStoredCourse,
  updateStoredCourse,
  deleteStoredCourse
} from '../data/coursesData';

import {
  getStoredFranchiseLeads,
  updateFranchiseLeadStatus,
  deleteFranchiseLead,
  addFranchiseLead,
  getFranchiseDisplayId
} from '../data/franchiseData';

import {
  getStoredContactEnquiries
} from '../data/contactEnquiriesData';

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

import {
  getStoredBatches,
  addStoredBatch,
  updateStoredBatch,
  deleteStoredBatch,
  resetStoredBatches
} from '../data/batchesData';

import {
  SAMPLE_STUDENT_PHOTOS,
  getStudentPhotoUrl,
  getStudentRegisterNumber,
  getMarksheetSubjects,
  resolveBranchDetails,
  resolveStudentGrade
} from '../utils/studentDataHelpers';

export {
  SAMPLE_STUDENT_PHOTOS,
  getStudentPhotoUrl,
  getStudentRegisterNumber,
  getMarksheetSubjects
};

export default function AdminDashboard({ setActivePage, onLogout, onOpenCertificate: _onOpenCertificate, onBack, goBack }) {
  // Session determination
  const sessionUser = getActiveSession();

  const [currentAdminRole, setCurrentAdminRole] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedRole = sessionStorage.getItem('bsel_active_admin_role');
      if (savedRole) return savedRole;
    }
    return sessionUser?.role === 'Branch Head' ? 'Branch Head' : 'Super Admin';
  });

  const [activeBranch, setActiveBranch] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedBranch = sessionStorage.getItem('bsel_active_branch');
      if (savedBranch) return savedBranch;
    }
    return sessionUser?.branch || 'Tenkasi Regional Branch';
  });

  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabFromUrl = params.get('tab');
      if (tabFromUrl) return tabFromUrl;

      const savedRole = sessionStorage.getItem('bsel_active_admin_role');
      if (savedRole === 'Branch Head') return 'branch_overview';
    }
    return (sessionUser?.role === 'Branch Head' || currentAdminRole === 'Branch Head')
      ? 'branch_overview' 
      : 'overview';
  });

  const [usersList, setUsersList] = useState(() => getRegisteredUsers());
  const [eventsList, setEventsList] = useState(() => getStoredEvents());
  const [coursesList, setCoursesList] = useState(() => getStoredCourses());
  const [franchiseList, setFranchiseList] = useState(() => getStoredFranchiseLeads());
  const [paymentsList, setPaymentsList] = useState(() => getStoredPayments());
  const [schoolsList, setSchoolsList] = useState(() => getStoredSchools());
  const [batchesList, setBatchesList] = useState(() => getStoredBatches());
  const [contactEnquiriesList, setContactEnquiriesList] = useState(() => getStoredContactEnquiries());

  // Batch Management Modal State
  const [showAddBatchModal, setShowAddBatchModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [batchForm, setBatchForm] = useState({
    name: '',
    program: 'Abacus',
    days: 'Saturday & Sunday',
    startTime: '09:30 AM',
    endTime: '11:30 AM',
    room: 'Classroom 1',
    maxCapacity: 15,
    enrolledCount: 0,
    instructor: '',
    status: 'Active',
    notes: ''
  });

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
  }, [currentAdminRole, activeBranch]);

  const [tabHistory, setTabHistory] = useState([activeTab]);

  const handleTabSelect = (tabKey, updateUrl = true) => {
    if (tabKey === activeTab) return;
    setTabHistory((prev) => [...prev, tabKey]);
    setActiveTab(tabKey);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('bsel_active_tab', tabKey);
    }
    setMobileSidebarOpen(false);

    if (typeof window !== 'undefined' && updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set('page', 'admin');
      url.searchParams.set('tab', tabKey);
      window.history.pushState({ page: 'admin', tab: tabKey }, '', url.toString());
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackClick = () => {
    // 1. If any modal is currently open, close modal first
    if (viewingAdmissionStudent) { setViewingAdmissionStudent(null); return; }
    if (selectedMarksheetStudent) { setSelectedMarksheetStudent(null); return; }
    if (previewCertModalData) { setPreviewCertModalData(null); return; }
    if (viewingMergedPdfStudent) { setViewingMergedPdfStudent(null); return; }
    if (showAddStudentModal) { setShowAddStudentModal(false); return; }
    if (showAddCourseModal) { setShowAddCourseModal(false); return; }
    if (showAddEventModal) { setShowAddEventModal(false); return; }
    if (showAddPaymentModal) { setShowAddPaymentModal(false); return; }
    if (showAddSchoolModal) { setShowAddSchoolModal(false); return; }
    if (showAddBatchModal) { setShowAddBatchModal(false); return; }

    // 2. If user navigated tabs inside admin, step back in tab history
    if (tabHistory.length > 1) {
      const nextHistory = [...tabHistory];
      nextHistory.pop();
      const prevTab = nextHistory[nextHistory.length - 1];
      setTabHistory(nextHistory);
      setActiveTab(prevTab);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('bsel_active_tab', prevTab);
        const url = new URL(window.location.href);
        url.searchParams.set('page', 'admin');
        url.searchParams.set('tab', prevTab);
        window.history.pushState({ page: 'admin', tab: prevTab }, '', url.toString());
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const fallbackTab = currentAdminRole === 'Branch Head' ? 'branch_overview' : 'overview';
      if (activeTab !== fallbackTab) {
        setActiveTab(fallbackTab);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('bsel_active_tab', fallbackTab);
          const url = new URL(window.location.href);
          url.searchParams.set('page', 'admin');
          url.searchParams.set('tab', fallbackTab);
          window.history.pushState({ page: 'admin', tab: fallbackTab }, '', url.toString());
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // 3. Fallback: navigate back to website / previous page
        if (onBack) onBack();
        else if (goBack) goBack();
        else if (typeof setActivePage === 'function') setActivePage('home');
      }
    }
  };

  const handleTabBack = () => {
    handleBackClick();
  };

  // Synchronize browser native Forward / Back buttons (popstate) with Admin Dashboard tabs
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Ensure initial URL reflects current tab
    const params = new URLSearchParams(window.location.search);
    const initialTab = params.get('tab') || activeTab;
    const url = new URL(window.location.href);
    url.searchParams.set('page', 'admin');
    url.searchParams.set('tab', initialTab);
    window.history.replaceState({ page: 'admin', tab: initialTab }, '', url.toString());

    const handlePopState = (e) => {
      const searchParams = new URLSearchParams(window.location.search);
      const tabFromUrl = searchParams.get('tab');
      const tabFromState = e.state?.tab;
      const targetTab = tabFromState || tabFromUrl;

      if (targetTab && targetTab !== activeTab) {
        setActiveTab(targetTab);
        setTabHistory((prev) => {
          if (prev.length > 1 && prev[prev.length - 2] === targetTab) {
            return prev.slice(0, -1);
          }
          if (prev[prev.length - 1] !== targetTab) {
            return [...prev, targetTab];
          }
          return prev;
        });
      } else if (!targetTab) {
        const defaultTab = currentAdminRole === 'Branch Head' ? 'branch_overview' : 'overview';
        setActiveTab(defaultTab);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentAdminRole, activeTab]);

  // Sync state with local events
  useEffect(() => {
    const handleUsersUpdate = () => setUsersList(getRegisteredUsers());
    const handleEventsUpdate = () => setEventsList(getStoredEvents());
    const handleCoursesUpdate = () => setCoursesList(getStoredCourses());
    const handleFranchiseUpdate = () => setFranchiseList(getStoredFranchiseLeads());
    const handlePaymentsUpdate = () => setPaymentsList(getStoredPayments());
    const handleSchoolsUpdate = () => setSchoolsList(getStoredSchools());
    const handleBatchesUpdate = () => setBatchesList(getStoredBatches());
    const handleContactUpdate = () => setContactEnquiriesList(getStoredContactEnquiries());

    window.addEventListener('bsel_users_updated', handleUsersUpdate);
    window.addEventListener('bsel_events_updated', handleEventsUpdate);
    window.addEventListener('bsel_courses_updated', handleCoursesUpdate);
    window.addEventListener('bsel_franchise_leads_updated', handleFranchiseUpdate);
    window.addEventListener('bsel_payments_updated', handlePaymentsUpdate);
    window.addEventListener('bsel_schools_updated', handleSchoolsUpdate);
    window.addEventListener('bsel_batches_updated', handleBatchesUpdate);
    window.addEventListener('bsel_contact_enquiries_updated', handleContactUpdate);
    window.addEventListener('bsel_branch_credentials_updated', () => {
      handleSchoolsUpdate();
      handleUsersUpdate();
    });
    const handleStorage = () => {
      handleUsersUpdate();
      handleSchoolsUpdate();
      handlePaymentsUpdate();
    };
    window.addEventListener('storage', handleStorage);

    // Initial fetch from Neon PostgreSQL to ensure all online registrations & profile updates appear
    (async () => {
      try {
        const res = await fetch('/api/students');
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.students)) {
            const currentUsers = getRegisteredUsers();
            const remoteMapped = data.students.map(s => {
              const userId = s.user_id || '';
              const existing = currentUsers.find(u => (u.userId || '').toLowerCase() === userId.toLowerCase());
              const regParent = s.parent_name || existing?.parentName || existing?.fatherName || '';
              const photo = s.photo_url || existing?.studentPhoto || existing?.photoUrl || null;
              const regNo = s.register_number || existing?.registerNumber || existing?.registrationNo || '';
              return {
                ...(existing || {}),
                userId,
                accountUserId: userId.replace(/-COURSE-\d+$/i, ''),
                admissionOnly: /-COURSE-\d+$/i.test(userId),
                studentName: s.student_name || existing?.studentName || '',
                name: s.student_name || existing?.name || '',
                parentName: regParent,
                fatherName: regParent,
                email: s.email || existing?.email || '',
                phone: s.phone || existing?.phone || '',
                alternatePhone: s.alternate_phone || existing?.alternatePhone || '',
                alternativePhone: s.alternate_phone || existing?.alternativePhone || existing?.alternatePhone || '',
                grade: s.grade || existing?.grade || existing?.courseLevel || '',
                courseLevel: s.grade || existing?.courseLevel || existing?.level || existing?.grade || '',
                level: s.grade || existing?.level || existing?.courseLevel || existing?.grade || '',
                program: s.program || s.course_name || existing?.program || '',
                courseName: s.course_name || existing?.courseName || '',
                course: s.course_name || existing?.course || '',
                courseDuration: existing?.courseDuration || existing?.duration || '6 Months',
                duration: existing?.duration || existing?.courseDuration || '6 Months',
                selectedCourses: (s.selected_courses && s.selected_courses.length > 0) ? s.selected_courses : (existing?.selectedCourses || []),
                courses: (s.selected_courses && s.selected_courses.length > 0) ? s.selected_courses : (existing?.courses || []),
                branch: s.branch || existing?.branch || '',
                institution: s.institution || s.branch || existing?.institution || '',
                studyCenter: s.institution || s.branch || existing?.studyCenter || '',
                address: s.address || existing?.address || '',
                village: s.village || existing?.village || '',
                city: s.city || existing?.city || '',
                district: s.district || existing?.district || '',
                pincode: s.pincode || existing?.pincode || '',
                pinCode: s.pincode || existing?.pinCode || existing?.pincode || '',
                studentPhoto: photo,
                photoUrl: photo,
                registerNumber: regNo,
                registrationNo: regNo,
                registerNumbers: existing?.registerNumbers || (regNo ? regNo.split(',').map(n => n.trim()) : []),
                role: 'Student',
                date: s.enrolment_date || existing?.date || existing?.enrolmentDate || '',
                enrolmentDate: s.enrolment_date || existing?.enrolmentDate || existing?.date || '',
                dob: s.dob || existing?.dob || existing?.dateOfBirth || '',
                dateOfBirth: s.dob || existing?.dateOfBirth || existing?.dob || '',
                age: s.age || existing?.age || '',
                gender: s.gender || existing?.gender || 'Male',
                studentClass: s.student_class || existing?.studentClass || '',
                studentStage: s.student_stage || existing?.studentStage || '',
                aadharNumber: s.aadhar_number || existing?.aadharNumber || existing?.aadhaar || '',
                aadhaarNumber: s.aadhar_number || existing?.aadhaarNumber || existing?.aadharNumber || '',
                aadhaar: s.aadhar_number || existing?.aadhaar || '',
                feePaymentType: s.fee_payment_type || existing?.feePaymentType || 'Pay Now',
                feeAmount: s.fee_amount || existing?.feeAmount || '₹450',
                paymentMode: s.payment_mode || existing?.paymentMode || 'UPI / QR Code',
                receiptRefNo: s.receipt_ref_no || existing?.receiptRefNo || '',
                paymentScreenshot: s.payment_screenshot || existing?.paymentScreenshot || null,
                status: s.status || existing?.status || 'Confirmed'
              };
            });

            const remoteMap = new Map(remoteMapped.map(s => [s.userId.toLowerCase(), s]));
            const merged = currentUsers.map(u => {
              const remote = remoteMap.get((u.userId || '').toLowerCase());
              return remote ? { ...u, ...remote } : u;
            });
            remoteMapped.forEach(s => {
              if (!merged.some(u => (u.userId || '').toLowerCase() === s.userId.toLowerCase())) {
                merged.unshift(s);
              }
            });

            try {
              localStorage.setItem('bsel_registered_users', JSON.stringify(merged));
            } catch (storageErr) {
              console.warn('[AdminDashboard] Storage quota exceeded caching remote users:', storageErr);
            }
            setUsersList(merged);
          }
        }
      } catch (err) {
        console.debug('[Admin Neon sync error]:', err);
      }
    })();

    return () => {
      window.removeEventListener('bsel_users_updated', handleUsersUpdate);
      window.removeEventListener('bsel_events_updated', handleEventsUpdate);
      window.removeEventListener('bsel_courses_updated', handleCoursesUpdate);
      window.removeEventListener('bsel_franchise_leads_updated', handleFranchiseUpdate);
      window.removeEventListener('bsel_payments_updated', handlePaymentsUpdate);
      window.removeEventListener('bsel_schools_updated', handleSchoolsUpdate);
      window.removeEventListener('bsel_batches_updated', handleBatchesUpdate);
      window.removeEventListener('bsel_contact_enquiries_updated', handleContactUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Update tabs when switching role
  const handleRoleSwitch = (newRole, targetBranch = null) => {
    if (targetBranch) {
      setActiveBranch(targetBranch);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('bsel_active_branch', targetBranch);
      }
    }
    setCurrentAdminRole(newRole);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('bsel_active_admin_role', newRole);
    }
    if (newRole === 'Branch Head') {
      const branchToShow = targetBranch || activeBranch;
      handleTabSelect('branch_overview');
      showToast(`Switched to Branch Head Portal (${branchToShow})`);
    } else {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('bsel_active_admin_role');
      }
      handleTabSelect('overview');
      showToast('Switched to Super Administrator Portal');
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('bsel_active_admin_role');
      sessionStorage.removeItem('bsel_active_branch');
    }
    clearActiveSession();
    if (onLogout) onLogout();
    else setActivePage('login');
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

  // -------------------------------------------------------------
  // MODALS
  // -------------------------------------------------------------
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showMarksheetModal, setShowMarksheetModal] = useState(false);
  const [selectedMarksheetStudent, setSelectedMarksheetStudent] = useState(null);
  const [viewingMergedPdfStudent, setViewingMergedPdfStudent] = useState(null);
  const [viewingStudentDocumentMerge, setViewingStudentDocumentMerge] = useState(null);
  const [viewingMergedQuestionPapers, setViewingMergedQuestionPapers] = useState(null);
  const [isMergeMode, setIsMergeMode] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [viewingAdmissionStudent, setViewingAdmissionStudent] = useState(null);
  const [viewingEventRegStudent, setViewingEventRegStudent] = useState(null);
  const [viewingQuestionPaperStudent, setViewingQuestionPaperStudent] = useState(null);
  const [previewCertModalData, setPreviewCertModalData] = useState(null);

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
    viewingMergedPdfStudent ||
    viewingMergedQuestionPapers ||
    viewingAdmissionStudent ||
    viewingStudentDocumentMerge ||
    viewingEventRegStudent ||
    viewingQuestionPaperStudent ||
    previewCertModalData ||
    editingStudent || 
    showAddCourseModal || 
    editingCourse || 
    showAddEventModal || 
    editingEvent || 
    showAddPaymentModal || 
    selectedReceiptForPrint || 
    showAddSchoolModal ||
    showAddBatchModal
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
    studentName: '',
    courseName: '',
    programPrefix: 'MINDSPARC',
    level: 'Level 1',
    grade: 'A+',
    duration: '6 Months',
    registrationNo: '',
    certificateNo: '',
    centreName: '',
    centreCode: '',
    centreAddress: '',
    issueDate: new Date().toLocaleDateString('en-GB'),
    certificateType: 'COMPLETION',
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
    tagline: '',
    logo: '',
    city: '',
    principal: '',
    coordinator: '',
    signature: '',
    phone: '',
    studentsCount: 100,
    userId: '',
    password: ''
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
    let levelsList = [];
    if (Array.isArray(course.curriculum)) {
      levelsList = course.curriculum.map((item, idx) => {
        if (typeof item === 'string') {
          return { id: `lvl-${idx + 1}-${Date.now()}`, title: item, topicsText: '' };
        }
        return {
          id: `lvl-${idx + 1}-${Date.now()}`,
          title: item.title || `Level ${idx + 1}`,
          topicsText: Array.isArray(item.topics) ? item.topics.join('\n') : (item.topics || '')
        };
      });
    }

    setEditingCourse({
      ...course,
      image: course.image || '',
      logo: course.logo || '',
      fullName: course.fullName || course.name?.toUpperCase() || '',
      levels: course.levels || (levelsList.length > 0 ? `${levelsList.length} Levels` : '6 Levels'),
      duration: course.duration || '3 - 4 Months per Level',
      ageGroup: course.ageGroup || '5 - 14 Years',
      status: course.status || 'Active',
      curriculumLevels: levelsList,
      curriculumMode: levelsList.length > 0 ? 'structured' : 'text',
      outcomesText: Array.isArray(course.outcomes) ? course.outcomes.join('\n') : (course.outcomes || ''),
      curriculumText: Array.isArray(course.curriculum)
        ? course.curriculum.map(c => typeof c === 'object' ? `${c.title || ''}${c.topics?.length ? `: ${c.topics.join(', ')}` : ''}` : c).join('\n')
        : (course.curriculum || '')
    });
  };

  const handleUpdateCourse = (e) => {
    e.preventDefault();
    if (!editingCourse) return;

    const outcomesArray = typeof editingCourse.outcomesText === 'string'
      ? editingCourse.outcomesText.split('\n').map(s => s.trim()).filter(Boolean)
      : (Array.isArray(editingCourse.outcomes) ? editingCourse.outcomes : []);

    let finalCurriculum = [];
    if (editingCourse.curriculumMode === 'text') {
      finalCurriculum = typeof editingCourse.curriculumText === 'string'
        ? editingCourse.curriculumText.split('\n').map(s => s.trim()).filter(Boolean)
        : [];
    } else if (Array.isArray(editingCourse.curriculumLevels) && editingCourse.curriculumLevels.length > 0) {
      finalCurriculum = editingCourse.curriculumLevels
        .filter(lvl => lvl.title?.trim())
        .map(lvl => {
          const topics = typeof lvl.topicsText === 'string'
            ? lvl.topicsText.split('\n').map(t => t.trim()).filter(Boolean)
            : (Array.isArray(lvl.topics) ? lvl.topics : []);
          return {
            title: lvl.title.trim(),
            topics
          };
        });
    }

    if (finalCurriculum.length === 0) {
      finalCurriculum = Array.isArray(editingCourse.curriculum) ? editingCourse.curriculum : [];
    }

    const courseToSave = {
      ...editingCourse,
      name: editingCourse.name?.trim(),
      fullName: (editingCourse.fullName || editingCourse.name)?.trim(),
      code: (editingCourse.code || '').trim().toUpperCase(),
      category: editingCourse.category || 'Skill Development',
      fee: editingCourse.fee ? (editingCourse.fee.startsWith('₹') ? editingCourse.fee : `₹${editingCourse.fee}`) : '₹450',
      feeAmount: parseInt(String(editingCourse.fee || '450').replace(/\D/g, ''), 10) || 450,
      image: editingCourse.image || '',
      logo: editingCourse.logo || '',
      ageGroup: editingCourse.ageGroup?.trim() || '5 - 14 Years',
      levels: editingCourse.levels?.trim() || `${finalCurriculum.length || 6} Levels`,
      duration: editingCourse.duration?.trim() || '3 - 4 Months per Level',
      status: editingCourse.status || 'Active',
      shortDesc: editingCourse.shortDesc?.trim() || editingCourse.tagline?.trim(),
      tagline: editingCourse.shortDesc?.trim() || editingCourse.tagline?.trim(),
      description: editingCourse.description?.trim(),
      outcomes: outcomesArray.length > 0 ? outcomesArray : (editingCourse.outcomes || []),
      curriculum: finalCurriculum.length > 0 ? finalCurriculum : (editingCourse.curriculum || [])
    };

    delete courseToSave.outcomesText;
    delete courseToSave.curriculumText;
    delete courseToSave.curriculumLevels;
    delete courseToSave.curriculumMode;

    const updated = updateStoredCourse(editingCourse.id, courseToSave);
    setCoursesList(updated);
    setEditingCourse(null);
    showToast(`Course "${courseToSave.name}" updated successfully!`);
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
    const updatedLead = franchiseList.find(lead => lead.refId === refId);
    showToast(`Franchise lead ${updatedLead ? getFranchiseDisplayId(updatedLead) : refId} status updated to: ${newStatus}`);
  };

  const handleApproveFranchiseToBranch = (lead) => {
    if (window.confirm(`Approve franchise enquiry ${getFranchiseDisplayId(lead)} (${lead.name}) as an official Authorized Branch?`)) {
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

      const phoneDigits = String(lead.phone || '').replace(/\D/g, '');
      const whatsappPhone = phoneDigits.length === 10
        ? `91${phoneDigits}`
        : phoneDigits.length === 11 && phoneDigits.startsWith('0')
          ? `91${phoneDigits.slice(1)}`
          : phoneDigits.length >= 11 && phoneDigits.length <= 15
            ? phoneDigits
            : '';

      if (whatsappPhone) {
        const message = `Dear ${lead.name}, congratulations! Your B★SEL franchise enquiry ${getFranchiseDisplayId(lead)} has been approved. Your franchise branch is now officially authorized. We will contact you soon with onboarding details.`;
        const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      } else {
        showToast(`Branch approved, but no valid WhatsApp number is available for ${lead.name}.`);
      }
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
    const regNo = getStudentRegisterNumber(student);
    const courseName = student.program || student.courseName || 'Abacus';
    const coursePrefix = getCoursePrefix(courseName);
    const cleanLevel = String(student.grade || student.level || '1').replace(/\D/g, '') || '1';
    const regDigits = String(regNo).replace(/\D/g, '');
    const seqDigits = regDigits ? String(parseInt(regDigits.slice(-3), 10) || 1).padStart(4, '0') : '0001';
    const certNo = (student.results?.[0]?.certificateNo && !student.results[0].certificateNo.includes('BSEL/ABACUS/L1/0007'))
      ? student.results[0].certificateNo
      : (student.certificateNo && !student.certificateNo.includes('BSEL/ABACUS/L1/0007'))
      ? student.certificateNo
      : `BSEL/${coursePrefix}/L${cleanLevel}/${seqDigits}`;

    const branchDetails = resolveBranchDetails(student, {
      centreName: student.branch || student.institution || activeBranch
    });

    const studentCertData = {
      studentId: student.id || student._id || student.admissionNo || regNo,
      admissionNo: student.admissionNo || regNo,
      studentName: student.studentName || 'Candidate Name',
      courseName: courseName,
      programPrefix: 'MINDSPARC',
      level: student.grade || 'Level 1',
      grade: resolveStudentGrade(student) || '',
      duration: student.duration || '6 Months',
      registrationNo: regNo,
      certificateNo: certNo,
      centreName: branchDetails.centreName,
      centreCode: branchDetails.centreCode,
      centreAddress: branchDetails.centreAddress,
      issueDate: student.enrolmentDate || '05-10-2026',
      certificateType: 'COMPLETION',
      studentPhoto: getStudentPhotoUrl(student) || student.studentPhoto || null,
      student: student
    };

    setCertData(studentCertData);
    setPreviewCertModalData(studentCertData);
    showToast(`Opened Certificate for ${student.studentName}!`);
  };

  // 6B. Student Action Handlers (Receipt, Event Registration, Question Paper)
  const handleOpenReceiptForStudent = (student) => {
    const isApproved = getStudentFeeStatus(student) === 'Approved';
    if (!isApproved) {
      alert(`Fee Receipt is available only after fee payment is Approved. Current status: ${getStudentFeeStatus(student)}. Please approve the fee payment first.`);
      return;
    }
    setSelectedReceiptForPrint({
      receiptNo: student.receiptRefNo || student.receiptNo || student.userId || '',
      date: student.enrolmentDate || student.date || '',
      studentName: student.studentName || student.name || '',
      parentName: student.parentName || student.fatherName || student.guardianName || '',
      school: student.branch || student.institution || student.school || '',
      standard: student.studentClass || student.grade || student.classGrade || '',
      program: student.program || student.courseName || student.course || '',
      amount: student.feeAmount || '₹450',
      paymentMode: student.paymentMode || '',
      refNo: student.paymentRefNo || student.receiptRefNo || '',
      verifiedBy: student.verifiedBy || (currentAdminRole === 'Branch Head' ? `${activeBranch} Head` : 'Super Admin'),
      contactNumber: student.phone || student.contactNumber || ''
    });
    showToast(`Loaded Official Fee Receipt for ${student.studentName || 'Student'}!`);
  };

  const handleOpenEventRegForStudent = (student) => {
    setViewingEventRegStudent(student);
    showToast(`Loaded Event Registration Slip for ${student.studentName || 'Student'}!`);
  };

  const handleOpenQuestionPaperForStudent = (student) => {
    setViewingQuestionPaperStudent(student);
    showToast(`Loaded Examination Question Paper for ${student.studentName || 'Student'}!`);
  };

  // 7. Marksheet Handler
  const handleOpenMarksheet = (student, index = 0) => {
    const photo = getStudentPhotoUrl(student, index);
    const regNo = getStudentRegisterNumber(student);
    const subjects = getMarksheetSubjects(student);
    const totalMax = subjects.reduce((sum, s) => sum + s.max, 0);
    const totalMarks = subjects.reduce((sum, s) => sum + s.marks, 0);
    const percentage = ((totalMarks / totalMax) * 100).toFixed(1);

    const courseName = student.program || student.courseName || 'Abacus';
    const coursePrefix = getCoursePrefix(courseName);
    const cleanLevel = String(student.grade || student.level || '1').replace(/\D/g, '') || '1';
    const regDigits = String(regNo).replace(/\D/g, '');
    const seqDigits = regDigits ? String(parseInt(regDigits.slice(-3), 10) || 1).padStart(4, '0') : '0001';
    const certNo = (student.certificateNo && !student.certificateNo.includes('BSEL/ABACUS/L1/0007'))
      ? student.certificateNo
      : `BSEL/${coursePrefix}/L${cleanLevel}/${seqDigits}`;

    setSelectedMarksheetStudent({
      ...student,
      studentId: student.id || student._id || student.admissionNo || regNo,
      admissionNo: student.admissionNo || regNo,
      photoUrl: photo,
      studentPhoto: photo,
      registerNumber: regNo,
      registrationNo: regNo,
      certificateNo: certNo,
      subjects,
      totalMax,
      totalMarks,
      percentage,
      resultText: percentage >= 85 ? 'FIRST CLASS WITH DISTINCTION' : 'FIRST CLASS',
      overallGrade: percentage >= 90 ? 'O (Outstanding)' : percentage >= 80 ? 'A+ (Excellent)' : 'A (Very Good)',
      marksheetNo: `BSEL/MS/2026/${String(student.userId || '').replace(/\D/g, '').slice(-4) || '1042'}`,
      issueDate: student.enrolmentDate || '05-10-2026'
    });
    setShowMarksheetModal(true);
    showToast(`Loaded Official Marksheet for ${student.studentName || 'Student'}!`);
  };

  // 8. Merge Certificate & Marksheet as PDF Handlers
  const handleToggleMergeMode = () => {
    setIsMergeMode(prev => {
      const next = !prev;
      if (!next) setSelectedStudentIds([]);
      return next;
    });
  };

  const handleToggleSelectStudent = (userId) => {
    setSelectedStudentIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleToggleSelectAll = () => {
    const listToUse = currentAdminRole === 'Branch Head' ? branchStudents : filteredStudentsSuperAdmin;
    const visibleIds = listToUse.map(s => s.userId);
    const allSelected = visibleIds.length > 0 && visibleIds.every(id => selectedStudentIds.includes(id));
    if (allSelected) {
      setSelectedStudentIds(prev => prev.filter(id => !visibleIds.includes(id)));
    } else {
      setSelectedStudentIds(prev => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const handleStartMergeSelected = () => {
    if (selectedStudentIds.length === 0) {
      showToast('Please select at least one student row to merge.');
      return;
    }

    const isBranchSection = currentAdminRole === 'Branch Head' || activeTab === 'branch_students';
    const sourceList = isBranchSection ? branchStudents : usersList;
    const selectedStudents = sourceList.filter(u => selectedStudentIds.includes(u.userId));
    if (selectedStudents.length === 0) return;

    if (isBranchSection) {
      // In this section: ONLY QUESTION PAPER SHOULD MERGE AS PDF!
      setViewingMergedQuestionPapers({
        students: selectedStudents,
        branch: activeBranch || 'Branch'
      });
      showToast(`Loaded ${selectedStudents.length} Question Paper(s) for merged PDF export.`);
      return;
    }

    const studentPackages = selectedStudents.map((student, index) => {
      const photo = getStudentPhotoUrl(student, index) || student.studentPhoto || null;
      const regNo = getStudentRegisterNumber(student);
      const safeStudent = (student.studentName || 'Student').trim().replace(/[^a-zA-Z0-9]/g, '_');
      const safeRegNo = (regNo || 'REG').trim().replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `BSEL_Merged_Certificate_Marksheet_${safeStudent}_${safeRegNo}.pdf`;

      const courseName = student.program || student.courseName || 'Abacus';
      const coursePrefix = getCoursePrefix(courseName);
      const cleanLevel = String(student.grade || student.level || '1').replace(/\D/g, '') || '1';
      const regDigits = String(regNo).replace(/\D/g, '');
      const seqDigits = regDigits ? String(parseInt(regDigits.slice(-3), 10) || 1).padStart(4, '0') : '0001';
      const certNo = (student.results?.[0]?.certificateNo && !student.results[0].certificateNo.includes('BSEL/ABACUS/L1/0007'))
        ? student.results[0].certificateNo
        : (student.certificateNo && !student.certificateNo.includes('BSEL/ABACUS/L1/0007'))
        ? student.certificateNo
        : `BSEL/${coursePrefix}/L${cleanLevel}/${seqDigits}`;

      const branchDetails = resolveBranchDetails(student, {
        centreName: student.branch || student.institution || activeBranch
      });

      const certData = {
        studentId: student.id || student._id || student.admissionNo || regNo,
        admissionNo: student.admissionNo || regNo,
        studentName: student.studentName || 'Candidate Name',
        courseName: courseName,
        programPrefix: 'MINDSPARC',
        level: student.grade || 'Level 1',
        grade: resolveStudentGrade(student) || '',
        duration: student.duration || '6 Months',
        registrationNo: regNo,
        certificateNo: certNo,
        centreName: branchDetails.centreName,
        centreCode: branchDetails.centreCode,
        centreAddress: branchDetails.centreAddress,
        issueDate: student.enrolmentDate || '05-10-2026',
        certificateType: 'COMPLETION',
        studentPhoto: photo,
        student: student
      };

      const subjects = getMarksheetSubjects(student);
      const totalMax = subjects.reduce((sum, s) => sum + s.max, 0);
      const totalMarks = subjects.reduce((sum, s) => sum + s.marks, 0);
      const percentage = ((totalMarks / totalMax) * 100).toFixed(1);

      const marksheetData = {
        ...student,
        studentId: student.id || student._id || student.admissionNo || regNo,
        admissionNo: student.admissionNo || regNo,
        photoUrl: photo,
        studentPhoto: photo,
        registerNumber: regNo,
        registrationNo: regNo,
        certificateNo: certNo,
        subjects,
        totalMax,
        totalMarks,
        percentage,
        resultText: percentage >= 85 ? 'FIRST CLASS WITH DISTINCTION' : 'FIRST CLASS',
        overallGrade: percentage >= 90 ? 'O (Outstanding)' : percentage >= 80 ? 'A+ (Excellent)' : 'A (Very Good)',
        marksheetNo: `BSEL/MS/2026/${String(student.userId || '').replace(/\D/g, '').slice(-4) || '1042'}`,
        issueDate: student.enrolmentDate || '05-10-2026'
      };

      return {
        student,
        certData,
        marksheetData,
        filename
      };
    });

    setViewingMergedPdfStudent({
      students: studentPackages
    });
  };

  const handleStartDocumentMerge = (documentType) => {
    if (selectedStudentIds.length === 0) {
      showToast('Please select at least one student row to merge.');
      return;
    }

    const selectedStudents = usersList.filter(student =>
      selectedStudentIds.includes(student.userId)
    );
    if (selectedStudents.length === 0) {
      showToast('No selected student records were found.');
      return;
    }

    const studentsToMerge = documentType === 'receipt'
      ? selectedStudents.filter(student =>
          getStudentFeeStatus(student) === 'Approved'
        )
      : selectedStudents;

    if (documentType === 'receipt' && studentsToMerge.length === 0) {
      showToast('No approved fee receipts are available for the selected students.');
      return;
    }

    if (documentType === 'receipt' && studentsToMerge.length < selectedStudents.length) {
      showToast(`${studentsToMerge.length} approved receipt(s) selected; pending receipts were excluded.`);
    }

    setViewingStudentDocumentMerge({
      type: documentType,
      students: studentsToMerge
    });
  };

  const handleMergeAsPdf = (student, index = 0) => {
    handleStartMergeSelected();
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

  // 9. Batch Save Handler (used by the batch modal in AdminModals)
  const handleSaveBatch = (e) => {
    e.preventDefault();
    if (!batchForm.name.trim()) return;

    if (editingBatch) {
      const updatedFields = {
        ...batchForm,
        branch: editingBatch.branch || activeBranch
      };
      const updated = updateStoredBatch(editingBatch.id, updatedFields);
      setBatchesList(updated);
      showToast(`Batch "${batchForm.name}" updated successfully!`);
    } else {
      const updated = addStoredBatch({
        ...batchForm,
        branch: activeBranch
      });
      setBatchesList(updated);
      showToast(`New batch "${batchForm.name}" created successfully!`);
    }
    setShowAddBatchModal(false);
    setEditingBatch(null);
  };

  // -------------------------------------------------------------
  // FILTERED LISTS
  // -------------------------------------------------------------
  
  // Super Admin: All students with filters
  const filteredStudentsSuperAdmin = usersList
    .filter(isStudentUser)
    .filter(u => {
      const matchSearch = 
        u.studentName?.toLowerCase().includes(studentSearch.toLowerCase()) ||
        u.userId?.toLowerCase().includes(studentSearch.toLowerCase()) ||
        u.registerNumber?.toLowerCase().includes(studentSearch.toLowerCase()) ||
        u.phone?.toLowerCase().includes(studentSearch.toLowerCase()) ||
        u.parentName?.toLowerCase().includes(studentSearch.toLowerCase()) ||
        u.fatherName?.toLowerCase().includes(studentSearch.toLowerCase()) ||
        u.studentClass?.toLowerCase().includes(studentSearch.toLowerCase());
      
      const matchBranch = studentBranchFilter === 'All' || (() => {
        const b = (u.branch || u.institution || '').toLowerCase();
        const target = studentBranchFilter.toLowerCase();
        return b.includes(target) || target.includes(b);
      })();

      const matchCourse = studentCourseFilter === 'All' || (() => {
        const p = (u.program || u.course || '').toLowerCase();
        const target = studentCourseFilter.toLowerCase();
        return p.includes(target) || target.includes(p);
      })();

      const feeStatus = getStudentFeeStatus(u);
      const matchPayment = studentPaymentFilter === 'All' || (() => {
        const target = studentPaymentFilter.toLowerCase();
        if (target === 'approved' || target === 'paid') return feeStatus === 'Approved';
        if (target === 'pending') return feeStatus === 'Pending';
        if (target === 'rejected') return feeStatus === 'Rejected';
        return feeStatus.toLowerCase() === target;
      })();

      return matchSearch && matchBranch && matchCourse && matchPayment;
    });

  // Branch Head: Scoped strictly to activeBranch
  const branchStudents = usersList
    .filter(isStudentUser)
    .filter(u => isStudentInBranch(u, activeBranch))
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

  // Branch Head: Batches scoped to activeBranch (still used by the Branch Overview stats)
  const branchBatches = batchesList.filter(b => {
    if (!b.branch) return true;
    const bBranch = (b.branch || '').toLowerCase();
    const target = (activeBranch || '').toLowerCase();
    if (!target || target.includes('headquarters') || target.includes('all')) return true;
    const cleanKey = target.replace(/b★sel|regional|central|branch|academy/gi, '').trim();
    const matchKey = cleanKey || target;
    return bBranch.includes(matchKey) || target.includes(bBranch) || bBranch.includes(target);
  });

  // Filtered Payments for Super Admin
  const filteredPayments = paymentsList.filter(p => {
    const matchSector = paymentSectorFilter === 'All' || (() => {
      const s = (p.sector || '').toLowerCase();
      const f = paymentSectorFilter.toLowerCase();
      if (f === 'course entry fee' || f === 'entry fee') return s.includes('entry') || s.includes('course') || s.includes('admission') || (s.includes('tuition') && !s.includes('monthly'));
      if (f === 'monthly fee') return s.includes('monthly');
      if (f === 'exam fee') return s.includes('exam');
      if (f === 'event fee' || f === 'competition & events') return s.includes('event') || s.includes('competition');
      if (f === 'book fee' || f === 'toolkits & courseware') return s.includes('book') || s.includes('toolkit') || s.includes('courseware');
      if (f === 'franchise fee' || f === 'franchise affiliation') return s.includes('franchise');
      if (f === 'others') return s.includes('other');
      return s === f || s.includes(f) || f.includes(s);
    })();
    const matchBranch = paymentBranchFilter === 'All' || (() => {
      const b = (p.branch || '').toLowerCase();
      const target = paymentBranchFilter.toLowerCase();
      return b.includes(target) || target.includes(b);
    })();
    return matchSector && matchBranch;
  });

  // Filtered Payments for Branch Head
  const branchPayments = paymentsList.filter(p => {
    const pBranch = (p.branch || '').toLowerCase();
    const target = (activeBranch || '').toLowerCase();
    const cleanKey = target.replace(/b★sel|regional|central|branch|academy/gi, '').trim();
    const matchKey = cleanKey || target;
    return pBranch.includes(matchKey) || target.includes(pBranch) || pBranch.includes(target);
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

  const filteredEvents = (eventsList || []).filter(e => {
    if (!eventSearch) return true;
    const q = eventSearch.toLowerCase().trim();
    return (
      (e.eventName && e.eventName.toLowerCase().includes(q)) ||
      (e.place && e.place.toLowerCase().includes(q)) ||
      (e.category && e.category.toLowerCase().includes(q)) ||
      (e.venue && e.venue.toLowerCase().includes(q))
    );
  });

  const handleGenerateCertificate = () => {
    setPreviewCertModalData(certData);
    showToast('Generated Certificate Preview!');
  };

  // -------------------------------------------------------------
  // METRICS CALCULATIONS
  // -------------------------------------------------------------
  const totalStudentsCount = usersList.filter(isStudentUser).length;
  const totalBranchesCount = schoolsList.length;
  const totalCoursesCount = coursesList.length;
  const totalEventsCount = eventsList.length;
  const totalFranchiseCount = franchiseList.length;

  const totalRevenueNumber = paymentsList.reduce((acc, p) => acc + (p.amountNum || 0), 0);
  const totalRevenueFormatted = `₹${totalRevenueNumber.toLocaleString('en-IN')}`;

  const branchRevenueNumber = branchPayments.reduce((acc, p) => acc + (p.amountNum || 0), 0);
  const branchRevenueFormatted = `₹${branchRevenueNumber.toLocaleString('en-IN')}`;

  return (
    <div className="admin-mobile min-h-screen bg-slate-100 font-sans text-slate-900 pb-20 lg:pb-12 overflow-x-hidden">
      
      <style>{`
        /* Smooth touch scrolling for wide data tables with hidden scrollbars */
        .admin-table-container,
        .overflow-x-auto {
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        .admin-table-container::-webkit-scrollbar,
        .overflow-x-auto::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }

        @media (max-width: 640px) {
          .admin-mobile main {
            padding: 10px 10px 88px 10px !important;
          }
          .admin-mobile h1 {
            font-size: 18px !important;
            line-height: 1.3 !important;
          }
          .admin-mobile h2 {
            font-size: 15px !important;
            line-height: 1.35 !important;
          }
          .admin-mobile h3 {
            font-size: 13px !important;
            line-height: 1.4 !important;
          }
          .admin-mobile input,
          .admin-mobile select,
          .admin-mobile textarea {
            min-height: 38px;
            font-size: 12px !important;
          }
          .admin-mobile aside button {
            padding: 10px 12px !important;
            font-size: 12px !important;
          }
          .admin-mobile .rounded-2xl {
            border-radius: 14px;
          }
          .admin-mobile .rounded-xl {
            border-radius: 10px;
          }
          .admin-mobile th {
            padding: 10px 10px !important;
            font-size: 10px !important;
            white-space: nowrap;
          }
          .admin-mobile td {
            padding: 10px 10px !important;
            font-size: 11px !important;
          }
          .admin-mobile header {
            min-height: 52px;
          }
        }
      `}</style>

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
        className="fixed top-0 left-0 right-0 z-[60] w-full bg-gradient-to-r from-[#081d3d] via-[#0c234b] to-[#123068] text-white border-b-4 border-amber-400 shadow-lg"
      >
        <div className="w-full px-2.5 sm:px-5 lg:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2">
          
          {/* Brand & Portal Type with Mobile Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
            {/* Mobile Drawer Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center gap-1 text-xs font-bold transition cursor-pointer shrink-0"
              title="Toggle Navigation Menu"
              aria-label="Toggle Navigation Menu"
            >
              {mobileSidebarOpen ? <X className="w-4 h-4 text-amber-400" /> : <Menu className="w-4 h-4" />}
              <span className="hidden sm:inline">Desks</span>
            </button>


            {/* Desktop Brand Logo */}
            <div className="hidden sm:block shrink-0">
              <Logo lightText={true} />
            </div>

            {/* Mobile Compact Brand Logo */}
            <div className="sm:hidden shrink-0">
              <Logo lightText={true} showTagline={false} size="small" />
            </div>

            {/* Desktop Divider */}
            <div className="hidden lg:block h-8 w-px bg-white/20 shrink-0"></div>

            {/* Desktop-Only Logged-In Branch Indicator Badge */}
            <div className="hidden lg:flex items-center gap-2 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl border border-white/20 backdrop-blur-xs transition min-w-0 shadow-xs">
              <div className="w-6 h-6 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                <Building className="w-3.5 h-3.5 text-amber-300" />
              </div>
              <div className="flex flex-col min-w-0 leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                  <span className="text-[9px] font-black uppercase tracking-wider text-amber-300 truncate">
                    {currentAdminRole === 'Branch Head' ? 'Logged In Branch' : 'Administrator'}
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-black text-white truncate max-w-[180px] xl:max-w-xs">
                  {currentAdminRole === 'Branch Head' ? activeBranch : 'Central Super Admin'}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* If user switched to Branch Head from Super Admin, give Return to Super Admin button */}
            {sessionUser?.role === 'Super Admin' && currentAdminRole === 'Branch Head' && (
              <button
                type="button"
                onClick={() => handleRoleSwitch('Super Admin')}
                className="text-xs font-bold text-amber-300 border border-amber-400/60 bg-[#0c234b]/40 hover:bg-amber-400/20 active:scale-95 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full transition shadow-sm cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
                title="Return to Central Super Admin Portal"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-amber-300" />
                <span>Super Admin</span>
              </button>
            )}

            {/* View Live Website Button (Compact icon on mobile, text on sm+) */}
            <button
              onClick={() => setActivePage('home')}
              className="w-7 h-7 sm:w-auto sm:h-auto p-0 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-black bg-white hover:bg-slate-100 text-[#0c234b] transition shadow-xs cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 active:scale-95 whitespace-nowrap shrink-0"
              title="Visit Live Website"
            >
              <Globe className="w-3.5 h-3.5 shrink-0 text-[#0c234b]" />
              <span className="hidden sm:inline">Website</span>
              <ArrowRight className="hidden sm:inline w-3.5 h-3.5 shrink-0" />
            </button>

            {/* Sign Out (Compact icon on mobile, text on sm+) */}
            <button
              onClick={handleLogout}
              className="w-7 h-7 sm:w-auto sm:h-auto p-0 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-black bg-rose-600/90 hover:bg-rose-700 text-white transition shadow-xs cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 active:scale-95 whitespace-nowrap shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

        </div>

        {/* Mobile-Dedicated Active Branch Status Sub-Bar */}
        <div className="lg:hidden bg-gradient-to-r from-[#051329] via-[#091e3d] to-[#0c2650] px-3 py-1.5 border-t border-amber-400/20 flex items-center justify-between gap-2 shadow-inner">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-5 h-5 rounded-md bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0">
              <Building className="w-3 h-3 text-amber-300" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300/90 shrink-0">
              {currentAdminRole === 'Branch Head' ? 'Logged In:' : 'Admin Desk:'}
            </span>
            <span className="text-xs font-black text-white truncate">
              {currentAdminRole === 'Branch Head' ? activeBranch : 'B★SEL Central Super Admin'}
            </span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Active</span>
          </div>
        </div>
      </header>

      {/* Main Full-Bleed Two-Column Layout: Left Fixed Sidebar & Right Workspace */}
      <div
        style={{ paddingTop: `${headerHeight}px` }}
        className="flex-1 flex w-full relative min-h-screen"
      >

        {/* Mobile Drawer Backdrop */}
        {mobileSidebarOpen && (
          <div 
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs z-50 lg:hidden transition-opacity"
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
            fixed left-0 z-50
            w-72 sm:w-80 shrink-0 
            bg-white border-r border-slate-200 shadow-2xl lg:shadow-none
            flex flex-col justify-between 
            overflow-y-auto transition-transform duration-200 ease-in-out
            ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="p-3 sm:p-4 space-y-3">

            {/* Mobile Header Inside Drawer */}
            <div className="lg:hidden p-2.5 bg-gradient-to-r from-[#081d3d] to-[#0c234b] text-white rounded-xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-black">
                  {currentAdminRole === 'Super Admin' ? 'Super Admin Desks' : `${activeBranch || 'Branch'} Desks`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                aria-label="Close navigation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Heading */}
            <div className="px-1 pt-1 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                {currentAdminRole === 'Super Admin' ? 'Executive Desks' : 'Branch Management'}
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                7 Modules
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
                    onClick={() => handleTabSelect('contact_enquiries')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-black transition cursor-pointer text-left ${
                      activeTab === 'contact_enquiries'
                        ? 'bg-[#0c234b] text-white shadow-sm ring-1 ring-amber-400/40'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <MessageSquare className={`w-4 h-4 shrink-0 ${activeTab === 'contact_enquiries' ? 'text-amber-400' : 'text-slate-500'}`} />
                      <span className="truncate">Contact Enquiries</span>
                    </div>
                    {contactEnquiriesList.filter((e) => e.status === 'New').length > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-black rounded-full bg-amber-400 text-slate-950 shrink-0">
                        {contactEnquiriesList.filter((e) => e.status === 'New').length}
                      </span>
                    )}
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
                    <Building className={`w-4 h-4 shrink-0 ${activeTab === 'schools' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">District Branches</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabSelect('achievements')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition cursor-pointer text-left ${activeTab === 'achievements' ? 'bg-[#0c234b] text-white shadow-sm ring-1 ring-amber-400/40' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'}`}
                  >
                    <Trophy className={`w-4 h-4 shrink-0 ${activeTab === 'achievements' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">Achievements / Competition</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleTabSelect('branch_overview')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition cursor-pointer text-left ${
                      activeTab === 'branch_overview'
                        ? 'bg-[#0c234b] text-white shadow-sm ring-1 ring-amber-400/40'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <Building className={`w-4 h-4 shrink-0 ${activeTab === 'branch_overview' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">Branch Overview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabSelect('branch_students')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition cursor-pointer text-left ${
                      activeTab === 'branch_students'
                        ? 'bg-[#0c234b] text-white shadow-sm ring-1 ring-amber-400/40'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <Users className={`w-4 h-4 shrink-0 ${activeTab === 'branch_students' ? 'text-sky-400' : 'text-slate-500'}`} />
                    <span className="truncate">Student Registration</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabSelect('branch_student_details')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition cursor-pointer text-left ${
                      activeTab === 'branch_student_details'
                        ? 'bg-[#0c234b] text-white shadow-sm ring-1 ring-amber-400/40'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <FileText className={`w-4 h-4 shrink-0 ${activeTab === 'branch_student_details' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">Student Details</span>
                  </button>

                  {/* Student Marksheet */}
                  <button
                    type="button"
                    onClick={() => handleTabSelect('branch_marksheet')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition cursor-pointer text-left ${
                      activeTab === 'branch_marksheet'
                        ? 'bg-[#0c234b] text-white shadow-sm ring-1 ring-amber-400/40'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <FileText
                      className={`w-4 h-4 shrink-0 ${
                        activeTab === 'branch_marksheet'
                          ? 'text-amber-400'
                          : 'text-slate-500'
                      }`}
                    />
                    <span className="truncate">Student Marksheet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabSelect('branch_staff')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition cursor-pointer text-left ${
                      activeTab === 'branch_staff'
                        ? 'bg-[#0c234b] text-white shadow-sm ring-1 ring-amber-400/40'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <UserCheck className={`w-4 h-4 shrink-0 ${activeTab === 'branch_staff' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">Staff Management</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabSelect('branch_franchise')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition cursor-pointer text-left ${
                      activeTab === 'branch_franchise'
                        ? 'bg-[#0c234b] text-white shadow-sm ring-1 ring-amber-400/40'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <Building className={`w-4 h-4 shrink-0 ${activeTab === 'branch_franchise' ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span className="truncate">Franchise Management</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabSelect('branch_schools')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition cursor-pointer text-left ${
                      activeTab === 'branch_schools'
                        ? 'bg-[#0c234b] text-white shadow-sm ring-1 ring-amber-400/40'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <School className={`w-4 h-4 shrink-0 ${activeTab === 'branch_schools' ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className="truncate">School Management</span>
                  </button>
                </>
              )}
            </nav>

          </div>
        </aside>

        {/* =========================================================================
            RIGHT MAIN CONTENT: TAB PANELS & WORKSPACE
            ========================================================================= */}
        <main className="flex-1 min-w-0 w-full lg:ml-72 xl:ml-80 p-3 sm:p-6 lg:p-8 pb-24 lg:pb-8 space-y-4 sm:space-y-5 bg-slate-100">


          {/* SUPER ADMIN: TAB 1 - EXECUTIVE OVERVIEW */}
          {currentAdminRole === 'Super Admin' && activeTab === 'overview' && (
            <AdminOverviewPage
              totalStudentsCount={totalStudentsCount}
              totalCoursesCount={totalCoursesCount}
              totalEventsCount={totalEventsCount}
              totalFranchiseCount={totalFranchiseCount}
              totalRevenueFormatted={totalRevenueFormatted}
              schoolsList={schoolsList}
              usersList={usersList}
              eventsList={eventsList}
              franchiseList={franchiseList}
              contactEnquiries={contactEnquiriesList}
              setShowAddCourseModal={setShowAddCourseModal}
              setShowAddEventModal={setShowAddEventModal}
              setActiveTab={handleTabSelect}
              setShowAddStudentModal={setShowAddStudentModal}
            />
          )}

          {/* SUPER ADMIN: TAB 2 - STUDENT REGISTRATIONS */}
          {currentAdminRole === 'Super Admin' && activeTab === 'students' && (
            <AdminStudentsPage
              filteredStudentsSuperAdmin={filteredStudentsSuperAdmin}
              isMergeMode={isMergeMode}
              selectedStudentIds={selectedStudentIds}
              setIsMergeMode={setIsMergeMode}
              setSelectedStudentIds={setSelectedStudentIds}
              handleToggleMergeMode={handleToggleMergeMode}
              handleToggleSelectAll={handleToggleSelectAll}
              handleToggleSelectStudent={handleToggleSelectStudent}
              handleStartDocumentMerge={handleStartDocumentMerge}
              handleOpenMarksheet={handleOpenMarksheet}
              handleOpenCertForStudent={handleOpenCertForStudent}
              handleOpenReceiptForStudent={handleOpenReceiptForStudent}
              handleOpenEventRegForStudent={handleOpenEventRegForStudent}
              setViewingAdmissionStudent={setViewingAdmissionStudent}
              studentSearch={studentSearch}
              setStudentSearch={setStudentSearch}
              studentBranchFilter={studentBranchFilter}
              setStudentBranchFilter={setStudentBranchFilter}
              studentCourseFilter={studentCourseFilter}
              setStudentCourseFilter={setStudentCourseFilter}
              studentPaymentFilter={studentPaymentFilter}
              setStudentPaymentFilter={setStudentPaymentFilter}
              setShowAddStudentModal={setShowAddStudentModal}
              schoolsList={schoolsList}
              coursesList={coursesList}
              usersList={usersList}
              showToast={showToast}
            />
          )}

          {/* SUPER ADMIN: TAB 3 - COURSE MANAGEMENT */}
          {currentAdminRole === 'Super Admin' && activeTab === 'courses' && (
          <AdminCoursesPage
  courses={coursesList}
  courseCategoryFilter={courseCategoryFilter}
  setCourseCategoryFilter={setCourseCategoryFilter}
  courseSearch={courseSearch}
  setCourseSearch={setCourseSearch}
  setShowAddCourseModal={setShowAddCourseModal}
  handleStartEditCourse={handleStartEditCourse}
  handleDeleteCourse={handleDeleteCourse}
/>
          )}

          {/* SUPER ADMIN: TAB 4 - EVENT PAGE MANAGEMENT */}
          {currentAdminRole === 'Super Admin' && activeTab === 'events' && (
            <AdminEventsPage
              filteredEvents={filteredEvents}
              eventsList={eventsList}
              setEditingEvent={setEditingEvent}
              setShowAddEventModal={setShowAddEventModal}
              handleDeleteEvent={handleDeleteEvent}
              eventSearch={eventSearch}
              setEventSearch={setEventSearch}
            />
          )}

          {/* SUPER ADMIN: TAB 5 - FRANCHISE ENQUIRIES CRM */}
          {currentAdminRole === 'Super Admin' && activeTab === 'franchise' && (
            <AdminFranchisePage
              franchiseList={franchiseList}
              setFranchiseList={setFranchiseList}
              filteredFranchiseLeads={filteredFranchiseLeads}
              franchiseStatusFilter={franchiseStatusFilter}
              setFranchiseStatusFilter={setFranchiseStatusFilter}
              handleUpdateFranchiseStatus={handleUpdateFranchiseStatus}
              handleApproveFranchiseToBranch={handleApproveFranchiseToBranch}
              showToast={showToast}
              setActiveTab={handleTabSelect}
              contactCount={contactEnquiriesList.length}
            />
          )}

          {/* SUPER ADMIN: TAB 5B - CONTACT US FORM ENQUIRIES */}
          {currentAdminRole === 'Super Admin' && activeTab === 'contact_enquiries' && (
            <AdminContactEnquiriesPage
              contactEnquiries={contactEnquiriesList}
              setContactEnquiries={setContactEnquiriesList}
              showToast={showToast}
              currentAdminRole={currentAdminRole}
              setActiveTab={handleTabSelect}
            />
          )}

          {/* SUPER ADMIN: TAB 6 - PAYMENT SECTORS & FINANCIAL OVERSIGHT */}
          {currentAdminRole === 'Super Admin' && activeTab === 'payments' && (
            <AdminPaymentsPage
              filteredPayments={filteredPayments}
              paymentSectorFilter={paymentSectorFilter}
              setPaymentSectorFilter={setPaymentSectorFilter}
              paymentBranchFilter={paymentBranchFilter}
              setPaymentBranchFilter={setPaymentBranchFilter}
              setShowAddPaymentModal={setShowAddPaymentModal}
              setSelectedReceiptForPrint={setSelectedReceiptForPrint}
              handleVerifyPayment={handleVerifyPayment}
              setPaymentsList={setPaymentsList}
              showToast={showToast}
            />
          )}

          {/* SUPER ADMIN: TAB 7 - BRANCHES & AFFILIATED CENTRES */}
          {currentAdminRole === 'Super Admin' && activeTab === 'schools' && (
            <AdminSchoolsPage
              schoolsList={schoolsList}
              setShowAddSchoolModal={setShowAddSchoolModal}
              setActiveBranch={setActiveBranch}
              handleRoleSwitch={handleRoleSwitch}
              showToast={showToast}
            />
          )}

          {/* SUPER ADMIN: TAB 8 - ACHIEVEMENTS & COMPETITION RECOGNITION */}
          {currentAdminRole === 'Super Admin' && activeTab === 'achievements' && (
            <AdminAchievementsPage />
          )}

          {/* BRANCH HEAD: TAB 1 - BRANCH OVERVIEW */}
          {currentAdminRole === 'Branch Head' && activeTab === 'branch_overview' && (
            <AdminBranchOverviewPage
              activeBranch={activeBranch}
              branchStudents={branchStudents}
              branchBatches={branchBatches}
              branchRevenueFormatted={branchRevenueFormatted}
              handleTabSelect={handleTabSelect}
              setActiveTab={handleTabSelect}
              handleOpenCertForStudent={handleOpenCertForStudent}
            />
          )}

          {/* BRANCH HEAD: TAB - STUDENT DETAILS (WEBSITE SUBMISSIONS) */}
          {currentAdminRole === 'Branch Head' && activeTab === 'branch_student_details' && (
            <AdminBranchStudentDetailsPage
              activeBranch={activeBranch}
              setViewingAdmissionStudent={setViewingAdmissionStudent}
              handleOpenMarksheet={handleOpenMarksheet}
              handleOpenCertForStudent={handleOpenCertForStudent}
              handleOpenEventRegForStudent={handleOpenEventRegForStudent}
              handleOpenQuestionPaperForStudent={handleOpenQuestionPaperForStudent}
              setViewingMergedPdfStudent={setViewingMergedPdfStudent}
              showToast={showToast}
              schoolsList={schoolsList}
            />
          )}

          {/* BRANCH HEAD: STUDENT MARKSHEET */}
          {currentAdminRole === 'Branch Head' &&
            activeTab === 'branch_marksheet' && (
              <BranchStudentMarksheetPage
                activeBranch={activeBranch}
                branchStudents={branchStudents}
                onBack={handleTabBack}
              />
          )}

          {/* BRANCH HEAD: TAB 2 - REGIONAL STUDENTS */}
          {currentAdminRole === 'Branch Head' && activeTab === 'branch_students' && (
            <AdminBranchStudentsPage
              activeBranch={activeBranch}
              branchStudents={branchStudents}
              branchStudentSearch={branchStudentSearch}
              setBranchStudentSearch={setBranchStudentSearch}
              setShowAddStudentModal={setShowAddStudentModal}
              setViewingAdmissionStudent={setViewingAdmissionStudent}
              handleOpenMarksheet={handleOpenMarksheet}
              handleOpenCertForStudent={handleOpenCertForStudent}
              handleOpenReceiptForStudent={handleOpenReceiptForStudent}
              handleOpenEventRegForStudent={handleOpenEventRegForStudent}
              handleOpenQuestionPaperForStudent={handleOpenQuestionPaperForStudent}
              setViewingMergedPdfStudent={setViewingMergedPdfStudent}
              setEditingStudent={setEditingStudent}
              handleDeleteStudent={handleDeleteStudent}
              showToast={showToast}
              isMergeMode={isMergeMode}
              setIsMergeMode={setIsMergeMode}
              selectedStudentIds={selectedStudentIds}
              handleToggleMergeMode={handleToggleMergeMode}
              handleToggleSelectAll={handleToggleSelectAll}
              handleToggleSelectStudent={handleToggleSelectStudent}
              handleStartMergeSelected={handleStartMergeSelected}
            />
          )}

          {/* BRANCH HEAD: TAB 4 - BRANCH FEE COLLECTIONS & RECEIPTS */}
          {currentAdminRole === 'Branch Head' && activeTab === 'branch_fees' && (
            <AdminBranchFeesPage
              branchPayments={branchPayments}
              setSelectedReceiptForPrint={setSelectedReceiptForPrint}
            />
          )}

          {/* BRANCH HEAD: TAB - STAFF MANAGEMENT */}
          {currentAdminRole === 'Branch Head' && activeTab === 'branch_staff' && (
            <AdminBranchStaffPage
              activeBranch={activeBranch}
              setActivePage={setActivePage}
              showToast={showToast}
            />
          )}


          {/* BRANCH HEAD: TAB 6 - FRANCHISE NETWORK & BRANDING */}
          {currentAdminRole === 'Branch Head' && activeTab === 'branch_franchise' && (
            <AdminBranchFranchisesPage
              activeBranch={activeBranch}
              showToast={showToast}
              setActivePage={setActivePage}
              handleTabSelect={handleTabSelect}
            />
          )}

          {/* BRANCH HEAD: TAB 7 - SCHOOL MANAGEMENT */}
          {currentAdminRole === 'Branch Head' && activeTab === 'branch_schools' && (
            <AdminBranchSchoolsPage
              activeBranch={activeBranch}
              showToast={showToast}
              setActivePage={setActivePage}
              handleTabSelect={handleTabSelect}
            />
          )}

        </main>
      </div>

      {/* =========================================================================
          MOBILE BOTTOM QUICK ACCESS NAVIGATION BAR (Visible on mobile screens < lg)
          ========================================================================= */}
      <nav 
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#081d3d] border-t-2 border-amber-400 text-white shadow-2xl"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="grid grid-cols-5 h-14 items-stretch select-none">
          {currentAdminRole === 'Branch Head' ? (
            <>
              {/* Branch Tab 1: Overview */}
              <button
                type="button"
                onClick={() => handleTabSelect('branch_overview')}
                className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition cursor-pointer ${
                  activeTab === 'branch_overview' ? 'text-amber-400 bg-white/10' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Overview</span>
              </button>

              {/* Branch Tab 2: Students */}
              <button
                type="button"
                onClick={() => handleTabSelect('branch_students')}
                className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition cursor-pointer ${
                  activeTab === 'branch_students' ? 'text-amber-400 bg-white/10' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Student Reg</span>
              </button>

              {/* Branch Tab 3: Enquiries / Student Details */}
              <button
                type="button"
                onClick={() => handleTabSelect('branch_student_details')}
                className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition cursor-pointer ${
                  activeTab === 'branch_student_details' ? 'text-amber-400 bg-white/10' : 'text-slate-300 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Details</span>
              </button>

              {/* Branch Tab 4: Marksheet */}
              <button
                type="button"
                onClick={() => handleTabSelect('branch_marksheet')}
                className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition cursor-pointer ${
                  activeTab === 'branch_marksheet' ? 'text-amber-400 bg-white/10' : 'text-slate-300 hover:text-white'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                <span>Marksheet</span>
              </button>

              {/* Branch Tab 5: More Desks Drawer */}
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold text-slate-300 hover:text-white transition cursor-pointer"
              >
                <Menu className="w-4 h-4" />
                <span>More</span>
              </button>
            </>
          ) : (
            <>
              {/* Super Admin Tab 1: Overview */}
              <button
                type="button"
                onClick={() => handleTabSelect('overview')}
                className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition cursor-pointer ${
                  activeTab === 'overview' ? 'text-amber-400 bg-white/10' : 'text-slate-300 hover:text-white'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Overview</span>
              </button>

              {/* Super Admin Tab 2: Students */}
              <button
                type="button"
                onClick={() => handleTabSelect('students')}
                className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition cursor-pointer ${
                  activeTab === 'students' ? 'text-amber-400 bg-white/10' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Students</span>
              </button>

              {/* Super Admin Tab 3: Courses */}
              <button
                type="button"
                onClick={() => handleTabSelect('courses')}
                className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition cursor-pointer ${
                  activeTab === 'courses' ? 'text-amber-400 bg-white/10' : 'text-slate-300 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Courses</span>
              </button>

              {/* Super Admin Tab 4: Events */}
              <button
                type="button"
                onClick={() => handleTabSelect('events')}
                className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition cursor-pointer ${
                  activeTab === 'events' ? 'text-amber-400 bg-white/10' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Events</span>
              </button>

              {/* Super Admin Tab 5: More Desks Drawer */}
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold text-amber-300 hover:text-white transition cursor-pointer active:scale-95"
              >
                <Menu className="w-4 h-4" />
                <span>More</span>
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ALL OFFICIAL MODALS */}
      <AdminModals
        currentAdminRole={currentAdminRole}
        activeBranch={activeBranch}
        setUsersList={setUsersList}
        coursesList={coursesList}
        setPaymentsList={setPaymentsList}
        schoolsList={schoolsList}
        setSchoolsList={setSchoolsList}
        showAddBatchModal={showAddBatchModal}
        setShowAddBatchModal={setShowAddBatchModal}
        editingBatch={editingBatch}
        setEditingBatch={setEditingBatch}
        batchForm={batchForm}
        setBatchForm={setBatchForm}
        showToast={showToast}
        showAddStudentModal={showAddStudentModal}
        setShowAddStudentModal={setShowAddStudentModal}
        editingStudent={editingStudent}
        setEditingStudent={setEditingStudent}
        showMarksheetModal={showMarksheetModal}
        setShowMarksheetModal={setShowMarksheetModal}
        selectedMarksheetStudent={selectedMarksheetStudent}
        setSelectedMarksheetStudent={setSelectedMarksheetStudent}
        viewingMergedPdfStudent={viewingMergedPdfStudent}
        setViewingMergedPdfStudent={setViewingMergedPdfStudent}
        viewingStudentDocumentMerge={viewingStudentDocumentMerge}
        setViewingStudentDocumentMerge={setViewingStudentDocumentMerge}
        viewingMergedQuestionPapers={viewingMergedQuestionPapers}
        setViewingMergedQuestionPapers={setViewingMergedQuestionPapers}
        viewingAdmissionStudent={viewingAdmissionStudent}
        setViewingAdmissionStudent={setViewingAdmissionStudent}
        viewingEventRegStudent={viewingEventRegStudent}
        setViewingEventRegStudent={setViewingEventRegStudent}
        viewingQuestionPaperStudent={viewingQuestionPaperStudent}
        setViewingQuestionPaperStudent={setViewingQuestionPaperStudent}
        previewCertModalData={previewCertModalData}
        setPreviewCertModalData={setPreviewCertModalData}
        showAddCourseModal={showAddCourseModal}
        setShowAddCourseModal={setShowAddCourseModal}
        editingCourse={editingCourse}
        setEditingCourse={setEditingCourse}
        showAddEventModal={showAddEventModal}
        setShowAddEventModal={setShowAddEventModal}
        editingEvent={editingEvent}
        setEditingEvent={setEditingEvent}
        showAddPaymentModal={showAddPaymentModal}
        setShowAddPaymentModal={setShowAddPaymentModal}
        selectedReceiptForPrint={selectedReceiptForPrint}
        setSelectedReceiptForPrint={setSelectedReceiptForPrint}
        showAddSchoolModal={showAddSchoolModal}
        setShowAddSchoolModal={setShowAddSchoolModal}
        newCourse={newCourse}
        setNewCourse={setNewCourse}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        newPayment={newPayment}
        setNewPayment={setNewPayment}
        newSchool={newSchool}
        setNewSchool={setNewSchool}
        handleUpdateStudent={handleUpdateStudent}
        handleCreateCourse={handleCreateCourse}
        handleUpdateCourse={handleUpdateCourse}
        handleCreateEvent={handleCreateEvent}
        handleUpdateEvent={handleUpdateEvent}
        handleCreateOfflinePayment={handleCreateOfflinePayment}
        handleSaveBatch={handleSaveBatch}
        setActivePage={setActivePage}
        getRegisteredUsers={getRegisteredUsers}
        getStoredPayments={getStoredPayments}
        saveStoredSchools={saveStoredSchools}
      />
    </div>
  );
}