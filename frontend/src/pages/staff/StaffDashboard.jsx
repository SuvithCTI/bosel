import React, { useState, useEffect, useRef } from 'react';
import {
  Building,
  Users,
  FileText,
  ClipboardList,
  LogOut,
  Globe,
  Menu,
  X,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  User
} from 'lucide-react';

import StaffOverviewPage from './StaffOverviewPage';
import StaffStudentDetailsPage from './StaffStudentDetailsPage';
import StaffStudentMarksheetPage from './StaffStudentMarksheetPage';

import OfficialMarksheetView from '../../components/OfficialMarksheetView';
import CertificateModal from '../../components/CertificateModal';
import MergedStudentPdfModal from '../../components/MergedStudentPdfModal';
import StudentAdmissionFormView from '../../components/StudentAdmissionFormView';
import Logo from '../../components/Logo';

import {
  getRegisteredUsers,
  getActiveSession,
  setActiveSession,
  getCoursePrefix
} from '../../utils/authStorage';
import { getStoredStaff } from '../../utils/staffStorage';
import { isStudentUser } from '../../utils/studentValidator';
import { isStudentInBranch } from '../../utils/branchAuthStorage';
import { getStoredBatches } from '../../data/batchesData';
import { getStoredSchools } from '../../data/schoolsData';
import { getStoredPayments } from '../../data/paymentsData';
import {
  getStudentPhotoUrl,
  getStudentRegisterNumber,
  getMarksheetSubjects,
  resolveBranchDetails,
  resolveStudentGrade
} from '../../utils/studentDataHelpers';

export default function StaffDashboard({
  setActivePage,
  sessionUser,
  onLogout,
  onOpenCertificate: _onOpenCertificate,
  onBack,
  goBack
}) {
  const [currentStaff, setCurrentStaff] = useState(() => {
    const session = sessionUser || getActiveSession();
    const branch = session?.branch || 'Tenkasi Branch';
    const cleanBranch = branch.replace('Regional Branch', 'Branch').trim();
    const staffList = getStoredStaff(cleanBranch);

    if (session && session.role === 'Staff' && session.name && session.userId) {
      const matched = staffList.find(s => s.userId === session.userId || s.id === session.id);
      return { ...(matched || {}), ...session };
    }

    if (session?.userId) {
      const match = staffList.find(s => s.userId === session.userId || s.email === session.userId);
      if (match) return { ...match, ...session };
    }

    if (staffList.length > 0) {
      return { ...staffList[0], ...(session || {}) };
    }

    return session || {
      name: 'R. Kaviya',
      studentName: 'R. Kaviya',
      userId: 'staff.tenkasi',
      password: 'staff123',
      role: 'Staff',
      designation: 'Senior Academic Instructor',
      branch: 'Tenkasi Branch',
      email: 'kaviya@bsel.org',
      phone: '9865219132',
      affiliationType: 'Branch',
      assignedUnit: 'Tenkasi Branch',
      status: 'Active'
    };
  });

  const ALLOWED_STAFF_TABS = ['staff_overview', 'staff_student_details', 'staff_marksheet'];

  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabFromUrl = params.get('tab');
      if (tabFromUrl && ALLOWED_STAFF_TABS.includes(tabFromUrl)) return tabFromUrl;

      const saved = sessionStorage.getItem('bsel_staff_active_tab');
      if (saved && ALLOWED_STAFF_TABS.includes(saved)) return saved;
    }
    return 'staff_overview';
  });

  const [activeBranch, setActiveBranch] = useState(() => {
    const rawBranch = currentStaff.branch || sessionUser?.branch || getActiveSession()?.branch || 'Tenkasi Branch';
    return rawBranch.replace('Regional Branch', 'Branch').trim();
  });

  useEffect(() => {
    if (sessionUser) {
      const branch = sessionUser.branch || 'Tenkasi Branch';
      const cleanBranch = branch.replace('Regional Branch', 'Branch').trim();
      const staffList = getStoredStaff(cleanBranch);
      const matched = staffList.find(s => s.userId === sessionUser.userId || s.id === sessionUser.id);
      setCurrentStaff({ ...(matched || {}), ...sessionUser });
      setActiveBranch(cleanBranch);
    }
  }, [sessionUser]);

  const [usersList, setUsersList] = useState(() => getRegisteredUsers());
  const [batchesList, setBatchesList] = useState(() => getStoredBatches());
  const [schoolsList, setSchoolsList] = useState(() => getStoredSchools());
  const [paymentsList, setPaymentsList] = useState(() => getStoredPayments());

  // Modals state
  const [selectedMarksheetStudent, setSelectedMarksheetStudent] = useState(null);
  const [previewCertModalData, setPreviewCertModalData] = useState(null);
  const [viewingMergedPdfStudent, setViewingMergedPdfStudent] = useState(null);
  const [viewingAdmissionStudent, setViewingAdmissionStudent] = useState(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Mobile menu drawer
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Header height reference
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(68);

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

  const [tabHistory, setTabHistory] = useState([activeTab]);

  const handleTabSelect = (tabKey, updateUrl = true) => {
    if (tabKey === activeTab) return;
    setTabHistory((prev) => [...prev, tabKey]);
    setActiveTab(tabKey);
    sessionStorage.setItem('bsel_staff_active_tab', tabKey);
    setMobileSidebarOpen(false);

    if (typeof window !== 'undefined' && updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set('page', 'staff');
      url.searchParams.set('tab', tabKey);
      window.history.pushState({ page: 'staff', tab: tabKey }, '', url.toString());
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackClick = () => {
    if (viewingAdmissionStudent) { setViewingAdmissionStudent(null); return; }
    if (selectedMarksheetStudent) { setSelectedMarksheetStudent(null); return; }
    if (previewCertModalData) { setPreviewCertModalData(null); return; }
    if (viewingMergedPdfStudent) { setViewingMergedPdfStudent(null); return; }

    if (tabHistory.length > 1) {
      const nextHistory = [...tabHistory];
      nextHistory.pop();
      const prevTab = nextHistory[nextHistory.length - 1];
      setTabHistory(nextHistory);
      setActiveTab(prevTab);
      sessionStorage.setItem('bsel_staff_active_tab', prevTab);

      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('page', 'staff');
        url.searchParams.set('tab', prevTab);
        window.history.pushState({ page: 'staff', tab: prevTab }, '', url.toString());
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (onBack) onBack();
      else if (goBack) goBack();
      else setActivePage('home');
    }
  };

  const handleTabBack = () => {
    handleBackClick();
  };

  // Synchronize browser native Forward / Back buttons (popstate) with Staff Dashboard tabs
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Ensure initial URL reflects current tab
    const params = new URLSearchParams(window.location.search);
    const initialTab = params.get('tab') || activeTab;
    const url = new URL(window.location.href);
    url.searchParams.set('page', 'staff');
    url.searchParams.set('tab', initialTab);
    window.history.replaceState({ page: 'staff', tab: initialTab }, '', url.toString());

    const handlePopState = (e) => {
      const searchParams = new URLSearchParams(window.location.search);
      const tabFromUrl = searchParams.get('tab');
      const tabFromState = e.state?.tab;
      const targetTab = tabFromState || tabFromUrl;

      if (targetTab && targetTab !== activeTab) {
        setActiveTab(targetTab);
        sessionStorage.setItem('bsel_staff_active_tab', targetTab);
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
        setActiveTab('staff_overview');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeTab]);

  // Sync state with local events
  useEffect(() => {
    const handleUsersUpdate = () => setUsersList(getRegisteredUsers());
    const handleBatchesUpdate = () => setBatchesList(getStoredBatches());
    const handleSchoolsUpdate = () => setSchoolsList(getStoredSchools());
    const handlePaymentsUpdate = () => setPaymentsList(getStoredPayments());

    window.addEventListener('bsel_users_updated', handleUsersUpdate);
    window.addEventListener('bsel_batches_updated', handleBatchesUpdate);
    window.addEventListener('bsel_schools_updated', handleSchoolsUpdate);
    window.addEventListener('bsel_payments_updated', handlePaymentsUpdate);

    return () => {
      window.removeEventListener('bsel_users_updated', handleUsersUpdate);
      window.removeEventListener('bsel_batches_updated', handleBatchesUpdate);
      window.removeEventListener('bsel_schools_updated', handleSchoolsUpdate);
      window.removeEventListener('bsel_payments_updated', handlePaymentsUpdate);
    };
  }, []);

  // Filter branch students for activeBranch (matches Branch Admin logic)
  const branchStudents = usersList
    .filter(isStudentUser)
    .filter(u => isStudentInBranch(u, activeBranch));

  // Filter branch batches for activeBranch
  const branchBatches = batchesList.filter(b => {
    if (!b.branch) return true;
    const bBranch = (b.branch || '').toLowerCase();
    const target = (activeBranch || '').toLowerCase();
    if (!target || target.includes('headquarters') || target.includes('all')) return true;
    const cleanKey = target.replace(/b★sel|regional|central|branch|academy/gi, '').trim();
    const matchKey = cleanKey || target;
    return bBranch.includes(matchKey) || target.includes(bBranch) || bBranch.includes(target);
  });

  // Calculate branch fee revenue formatted (matches Branch Admin logic)
  const branchPayments = paymentsList.filter(p => {
    const student = usersList.find(u => u.userId === p.studentId);
    if (!student) return false;
    const sBranch = (student.branch || student.institution || '').toLowerCase();
    const target = (activeBranch || '').toLowerCase();
    const cleanKey = target.replace(/b★sel|regional|central|branch|academy/gi, '').trim();
    const matchKey = cleanKey || target;
    return sBranch.includes(matchKey) || target.includes(sBranch);
  });
  const branchRevenueNumber = branchPayments.reduce((acc, p) => acc + (p.amountNum || 0), 0);
  const branchRevenueFormatted = `₹${(branchRevenueNumber || 25400).toLocaleString('en-IN')}`;

  // Modal Handlers
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
      level: student.grade || student.level || 'Level 1',
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

    setPreviewCertModalData(studentCertData);
    showToast(`Opened Certificate for ${student.studentName || 'Student'}!`);
  };

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
    showToast(`Loaded Official Marksheet for ${student.studentName || 'Student'}!`);
  };

  return (
    <div className="admin-mobile min-h-screen bg-slate-100 font-sans text-slate-900 pb-20 lg:pb-12 overflow-x-hidden">

      <style>{`
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
        }
      `}</style>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#0c234b] text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-400 flex items-center gap-3 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          TOP MASTER HEADER (MATCHING BRANCH ADMIN)
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

            {/* Desktop-Only Logged-In Staff Indicator Badge */}
            <div className="hidden lg:flex items-center gap-2.5 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl border border-white/20 backdrop-blur-xs transition min-w-0 shadow-xs">
              <div className="w-7 h-7 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0 text-amber-300 font-black text-xs">
                {currentStaff.name ? currentStaff.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'ST'}
              </div>
              <div className="flex flex-col min-w-0 leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                  <span className="text-[9px] font-black uppercase tracking-wider text-amber-300 truncate">
                    LOGGED IN STAFF
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-black text-white truncate max-w-[180px] xl:max-w-xs">
                  {currentStaff.name || currentStaff.studentName || 'Academic Staff'}
                </span>
                <span className="text-[10px] text-slate-300 font-semibold truncate max-w-[180px] xl:max-w-xs">
                  {currentStaff.designation || 'Instructor'} • {activeBranch}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* View Live Website Button */}
            <button
              onClick={() => setActivePage('home')}
              className="w-7 h-7 sm:w-auto sm:h-auto p-0 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-black bg-white hover:bg-slate-100 text-[#0c234b] transition shadow-xs cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 active:scale-95 whitespace-nowrap shrink-0"
              title="Visit Live Website"
            >
              <Globe className="w-3.5 h-3.5 shrink-0 text-[#0c234b]" />
              <span className="hidden sm:inline">Website</span>
              <ArrowRight className="hidden sm:inline w-3.5 h-3.5 shrink-0" />
            </button>

            {/* Sign Out Button */}
            <button
              onClick={onLogout}
              className="w-7 h-7 sm:w-auto sm:h-auto p-0 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-black bg-rose-600/90 hover:bg-rose-700 text-white transition shadow-xs cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 active:scale-95 whitespace-nowrap shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

        </div>

        {/* Mobile-Dedicated Active Staff Status Sub-Bar */}
        <div className="lg:hidden bg-gradient-to-r from-[#051329] via-[#091e3d] to-[#0c2650] px-3 py-1.5 border-t border-amber-400/20 flex items-center justify-between gap-2 shadow-inner">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-5 h-5 rounded-md bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0">
              <UserCheck className="w-3 h-3 text-amber-300" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300/90 shrink-0">
              Staff:
            </span>
            <span className="text-xs font-black text-white truncate">
              {currentStaff.name || currentStaff.studentName || 'Academic Staff'}
            </span>
            <span className="text-[10px] text-slate-300 truncate hidden xs:inline">
              ({activeBranch})
            </span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Active</span>
          </div>
        </div>
      </header>

      {/* Main Full-Bleed Two-Column Layout */}
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
                  Staff Desks
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
                BRANCH MANAGEMENT
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                3 Modules
              </span>
            </div>

            {/* Vertical Nav List */}
            <nav className="space-y-1">
              <button
                type="button"
                onClick={() => handleTabSelect('staff_overview')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition cursor-pointer text-left ${
                  activeTab === 'staff_overview'
                    ? 'bg-[#0c234b] text-white shadow-sm ring-1 ring-amber-400/40'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                <Building className={`w-4 h-4 shrink-0 ${activeTab === 'staff_overview' ? 'text-amber-400' : 'text-slate-500'}`} />
                <span className="truncate">Branch Overview</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabSelect('staff_student_details')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition cursor-pointer text-left ${
                  activeTab === 'staff_student_details'
                    ? 'bg-[#0c234b] text-white shadow-sm ring-1 ring-amber-400/40'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                <FileText className={`w-4 h-4 shrink-0 ${activeTab === 'staff_student_details' ? 'text-amber-400' : 'text-slate-500'}`} />
                <span className="truncate">Student Details</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabSelect('staff_marksheet')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition cursor-pointer text-left ${
                  activeTab === 'staff_marksheet'
                    ? 'bg-[#0c234b] text-white shadow-sm ring-1 ring-amber-400/40'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                <FileText className={`w-4 h-4 shrink-0 ${activeTab === 'staff_marksheet' ? 'text-amber-400' : 'text-slate-500'}`} />
                <span className="truncate">Student Marksheet</span>
              </button>
            </nav>
          </div>

          {/* Sidebar Footer: Logged-in Staff Profile Summary */}
          <div className="p-3 border-t border-slate-200 bg-slate-50 mt-auto">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#0c234b] text-amber-400 border border-amber-400/30 flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                {currentStaff.name ? currentStaff.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'ST'}
              </div>
              <div className="min-w-0 flex-1 leading-tight">
                <span className="text-[9px] font-black uppercase tracking-wider text-amber-600 block">
                  Staff Account
                </span>
                <span className="text-xs font-black text-slate-900 truncate block">
                  {currentStaff.name || currentStaff.studentName || 'Academic Staff'}
                </span>
                <code className="text-[10px] font-mono text-slate-500 truncate block">
                  {currentStaff.userId || 'staff'}
                </code>
              </div>
            </div>
          </div>
        </aside>

        {/* =========================================================================
            RIGHT MAIN CONTENT: TAB PANELS & WORKSPACE
            ========================================================================= */}
        <main className="flex-1 min-w-0 w-full lg:ml-72 xl:ml-80 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 space-y-5 bg-slate-100">
          {(activeTab === 'staff_overview' || !ALLOWED_STAFF_TABS.includes(activeTab)) && (
            <StaffOverviewPage
              currentStaff={currentStaff}
              activeBranch={activeBranch}
              branchStudents={branchStudents}
              branchBatches={branchBatches}
              branchRevenueFormatted={branchRevenueFormatted}
              handleTabSelect={handleTabSelect}
              setActiveTab={handleTabSelect}
            />
          )}

          {activeTab === 'staff_student_details' && (
            <StaffStudentDetailsPage
              activeBranch={activeBranch}
              setViewingAdmissionStudent={setViewingAdmissionStudent}
              handleOpenMarksheet={handleOpenMarksheet}
              handleOpenCertForStudent={handleOpenCertForStudent}
              setViewingMergedPdfStudent={setViewingMergedPdfStudent}
              showToast={showToast}
              schoolsList={schoolsList}
            />
          )}

          {activeTab === 'staff_marksheet' && (
            <StaffStudentMarksheetPage
              activeBranch={activeBranch}
              branchStudents={branchStudents}
              onBack={handleTabBack}
            />
          )}
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0c234b]/95 backdrop-blur-md border-t border-white/10 px-3 py-2 text-white">
        <div className="grid grid-cols-3 gap-1 text-center">
          <button
            type="button"
            onClick={() => handleTabSelect('staff_overview')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-bold transition ${
              activeTab === 'staff_overview' ? 'text-amber-400 bg-white/10' : 'text-slate-300'
            }`}
          >
            <Building className="w-4 h-4 mb-0.5" />
            <span>Overview</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSelect('staff_student_details')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-bold transition ${
              activeTab === 'staff_student_details' ? 'text-amber-400 bg-white/10' : 'text-slate-300'
            }`}
          >
            <FileText className="w-4 h-4 mb-0.5" />
            <span>Students</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSelect('staff_marksheet')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-bold transition ${
              activeTab === 'staff_marksheet' ? 'text-amber-400 bg-white/10' : 'text-slate-300'
            }`}
          >
            <FileText className="w-4 h-4 mb-0.5" />
            <span>Marksheet</span>
          </button>
        </div>
      </nav>

      {/* MODALS */}
      {selectedMarksheetStudent && (
        <OfficialMarksheetView
          student={selectedMarksheetStudent}
          onClose={() => setSelectedMarksheetStudent(null)}
        />
      )}

      {previewCertModalData && (
        <CertificateModal
          isOpen={Boolean(previewCertModalData)}
          initialData={previewCertModalData}
          showControls={true}
          onClose={() => setPreviewCertModalData(null)}
        />
      )}

      {viewingMergedPdfStudent && (
        <MergedStudentPdfModal
          data={viewingMergedPdfStudent}
          onClose={() => setViewingMergedPdfStudent(null)}
          showToast={showToast}
        />
      )}

      {viewingAdmissionStudent && (
        <StudentAdmissionFormView
          student={viewingAdmissionStudent}
          onClose={() => setViewingAdmissionStudent(null)}
        />
      )}

    </div>
  );
}
