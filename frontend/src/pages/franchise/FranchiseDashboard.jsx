import React, { useState, useEffect, useRef } from 'react';
import {
  Building,
  School,
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
  Award,
  Sparkles
} from 'lucide-react';

import StaffStudentDetailsPage from '../staff/StaffStudentDetailsPage';
import StaffStudentMarksheetPage from '../staff/StaffStudentMarksheetPage';
import Certificate from '../../components/Certificate';
import OfficialMarksheetView from '../../components/OfficialMarksheetView';
import CertificateModal from '../../components/CertificateModal';
import MergedStudentPdfModal from '../../components/MergedStudentPdfModal';
import StudentAdmissionFormView from '../../components/StudentAdmissionFormView';
import Logo from '../../components/Logo';

import {
  getRegisteredUsers,
  getActiveSession,
  getCoursePrefix
} from '../../utils/authStorage';
import { isStudentUser } from '../../utils/studentValidator';
import { getStoredBatches } from '../../data/batchesData';
import { getStoredSchools, getSchoolBranding } from '../../utils/schoolStorage';
import { getStoredPayments } from '../../data/paymentsData';
import {
  getStudentPhotoUrl,
  getStudentRegisterNumber,
  getMarksheetSubjects
} from '../../utils/studentDataHelpers';
import {
  getStoredFranchises,
  updateStoredFranchise,
  getFranchiseBranding
} from '../../utils/franchiseStorage';

export default function FranchiseDashboard({
  setActivePage,
  sessionUser,
  onLogout,
  onOpenCertificate: _onOpenCertificate,
  onBack,
  goBack
}) {
  let storedSession = null;
  try {
    const sRaw = sessionStorage.getItem('bsel_active_session') || localStorage.getItem('bsel_active_session');
    if (sRaw) storedSession = JSON.parse(sRaw);
  } catch (_) {}

  const activeUser = getActiveSession();
  const currentSession = (storedSession && (storedSession.role === 'School' || storedSession.role === 'Franchise' || storedSession.schoolId || storedSession.franchiseId)) 
    ? storedSession 
    : ((sessionUser && (sessionUser.role === 'School' || sessionUser.role === 'Franchise' || sessionUser.schoolId || sessionUser.franchiseId)) 
        ? sessionUser 
        : (activeUser || {}));

  const isSchool = currentSession.role === 'School' || Boolean(currentSession.schoolId) || Boolean(currentSession.schoolRole);

  const [franchisesList, setFranchisesList] = useState(() => getStoredFranchises());
  const [schoolsList, setSchoolsList] = useState(() => getStoredSchools());
  
  // Find current entity data (School or Franchise) and merge latest persisted branding
  let currentEntity = null;
  if (isSchool) {
    const matchedSchool = schoolsList.find(
      s => (currentSession.schoolId && s.id === currentSession.schoolId) ||
           (currentSession.id && s.id === currentSession.id) ||
           (currentSession.userId && s.userId === currentSession.userId) ||
           (currentSession.code && s.code === currentSession.code) ||
           (currentSession.name && s.name.trim().toLowerCase() === currentSession.name.trim().toLowerCase())
    ) || (currentSession.name ? {
      ...currentSession,
      id: currentSession.schoolId || currentSession.id || 'sch-dynamic',
      branch: currentSession.branch || 'Tenkasi Branch'
    } : (schoolsList[0] || {
      id: 'sch-stj-101',
      code: 'BSEL-SCH-101',
      name: "St. Joseph's Matric Higher Secondary School",
      schoolName: "ST. JOSEPH'S MATRIC",
      subtitle: 'TENKASI DISTRICT',
      motto: 'KNOWLEDGE • CHARACTER • SERVICE',
      coordinator: 'Mrs. Priya Soundarajan',
      city: 'Tenkasi',
      address: '15, Church Road, Near New Bus Stand, Tenkasi, Tamil Nadu',
      branch: 'Tenkasi Branch'
    }));
    const storedBranding = getSchoolBranding(matchedSchool.id) || {};
    currentEntity = {
      ...matchedSchool,
      branch: matchedSchool.branch || currentSession.branch || 'Tenkasi Branch',
      schoolName: storedBranding.schoolName || matchedSchool.schoolName || matchedSchool.name,
      subtitle: storedBranding.subtitle || matchedSchool.subtitle || 'TENKASI DISTRICT',
      motto: storedBranding.motto || matchedSchool.motto || 'KNOWLEDGE • CHARACTER • SERVICE',
      logo: storedBranding.logo !== undefined ? storedBranding.logo : matchedSchool.logo,
      signature: storedBranding.signature !== undefined ? storedBranding.signature : matchedSchool.signature
    };
  } else {
    const matchedFranchise = franchisesList.find(
      f => (currentSession.franchiseId && f.id === currentSession.franchiseId) ||
           (currentSession.id && f.id === currentSession.id) ||
           (currentSession.userId && f.userId === currentSession.userId) ||
           (currentSession.code && f.code === currentSession.code) ||
           (currentSession.name && f.name.trim().toLowerCase() === currentSession.name.trim().toLowerCase())
    ) || (currentSession.name ? {
      ...currentSession,
      id: currentSession.franchiseId || currentSession.id || 'fc-dynamic',
      branch: currentSession.branch || 'Tenkasi Branch'
    } : (franchisesList[0] || {
      id: 'fc-tsi-101',
      code: 'BSEL-FC-101',
      name: 'Tenkasi City Franchise',
      schoolName: 'TENKASI REGIONAL',
      subtitle: 'VISION FOUNDATION',
      motto: 'EDUCATION • EMPOWERMENT • EXCELLENCE',
      coordinator: 'Mrs. Priya Soundarajan',
      city: 'Tenkasi',
      address: '12, Main Bazaar Road, Near New Bus Stand, Tenkasi, Tamil Nadu',
      branch: 'Tenkasi Branch'
    }));
    const storedBranding = getFranchiseBranding(matchedFranchise.id) || {};
    currentEntity = {
      ...matchedFranchise,
      branch: matchedFranchise.branch || currentSession.branch || 'Tenkasi Branch',
      schoolName: storedBranding.schoolName || matchedFranchise.schoolName || matchedFranchise.name,
      subtitle: storedBranding.subtitle || matchedFranchise.subtitle || 'VISION FOUNDATION',
      motto: storedBranding.motto || matchedFranchise.motto || 'EDUCATION • EMPOWERMENT • EXCELLENCE',
      logo: storedBranding.logo !== undefined ? storedBranding.logo : matchedFranchise.logo,
      signature: storedBranding.signature !== undefined ? storedBranding.signature : matchedFranchise.signature
    };
  }

  const currentFranchise = currentEntity;

  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlTab = urlParams.get('tab');
      if (urlTab) return urlTab;
      const saved = sessionStorage.getItem('bsel_franchise_active_tab');
      if (saved && saved !== 'franchise_certificates' && saved !== 'franchise_branding') return saved;
    }
    return 'franchise_overview';
  });

  const [usersList, setUsersList] = useState(() => getRegisteredUsers());
  const [batchesList, setBatchesList] = useState(() => getStoredBatches());
  const [paymentsList, setPaymentsList] = useState(() => getStoredPayments());

  // Listen for franchise and school updates in real-time
  useEffect(() => {
    const handleUpdate = () => {
      setFranchisesList(getStoredFranchises());
      setSchoolsList(getStoredSchools());
    };
    window.addEventListener('bsel_franchises_updated', handleUpdate);
    window.addEventListener('bsel_franchise_branding_updated', handleUpdate);
    window.addEventListener('bsel_schools_updated', handleUpdate);
    window.addEventListener('bsel_school_branding_updated', handleUpdate);
    return () => {
      window.removeEventListener('bsel_franchises_updated', handleUpdate);
      window.removeEventListener('bsel_franchise_branding_updated', handleUpdate);
      window.removeEventListener('bsel_schools_updated', handleUpdate);
      window.removeEventListener('bsel_school_branding_updated', handleUpdate);
    };
  }, []);

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
    const t = setTimeout(updateHeaderHeight, 100);
    window.addEventListener('resize', updateHeaderHeight);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, []);

  const [tabHistory, setTabHistory] = useState([activeTab]);

  const handleTabSelect = (tabKey, updateUrl = true) => {
    if (tabKey === activeTab) return;
    setTabHistory((prev) => [...prev, tabKey]);
    setActiveTab(tabKey);
    sessionStorage.setItem('bsel_franchise_active_tab', tabKey);
    setMobileSidebarOpen(false);

    if (typeof window !== 'undefined' && updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set('page', 'franchise_portal');
      url.searchParams.set('tab', tabKey);
      window.history.pushState({ page: 'franchise_portal', tab: tabKey }, '', url.toString());
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackClick = () => {
    // Dismiss any active overlay / modal first
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
      sessionStorage.setItem('bsel_franchise_active_tab', prevTab);

      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('page', 'franchise_portal');
        url.searchParams.set('tab', prevTab);
        window.history.pushState({ page: 'franchise_portal', tab: prevTab }, '', url.toString());
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (activeTab !== 'franchise_overview') {
      setActiveTab('franchise_overview');
      sessionStorage.setItem('bsel_franchise_active_tab', 'franchise_overview');
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('page', 'franchise_portal');
        url.searchParams.set('tab', 'franchise_overview');
        window.history.pushState({ page: 'franchise_portal', tab: 'franchise_overview' }, '', url.toString());
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

  // Synchronize browser native Forward / Back buttons (popstate) with Franchise / School Dashboard tabs
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Ensure initial URL reflects current tab
    const params = new URLSearchParams(window.location.search);
    const initialTab = params.get('tab') || activeTab;
    const url = new URL(window.location.href);
    url.searchParams.set('page', 'franchise_portal');
    url.searchParams.set('tab', initialTab);
    window.history.replaceState({ page: 'franchise_portal', tab: initialTab }, '', url.toString());

    const handlePopState = (e) => {
      const searchParams = new URLSearchParams(window.location.search);
      const urlTab = searchParams.get('tab');
      if (urlTab && urlTab !== activeTab) {
        setActiveTab(urlTab);
        sessionStorage.setItem('bsel_franchise_active_tab', urlTab);
        setTabHistory((prev) => [...prev, urlTab]);
      } else if (!urlTab && activeTab !== 'franchise_overview') {
        setActiveTab('franchise_overview');
        sessionStorage.setItem('bsel_franchise_active_tab', 'franchise_overview');
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

  // Filter franchise/school students: strictly students belonging to this franchise or school
  const franchiseStudents = usersList
    .filter(isStudentUser)
    .filter(u => {
      if (isSchool) {
        const targetId = currentEntity.id;
        const targetName = (currentEntity.name || '').toLowerCase().trim();
        const studentSchoolId = u.schoolId;
        const studentInst = (u.institution || u.schoolName || '').toLowerCase().trim();
        const studentCat = (u.admissionCategory || '').toLowerCase();

        return (
          studentSchoolId === targetId ||
          studentInst === targetName ||
          (targetName && studentInst.includes(targetName)) ||
          (targetName && targetName.includes(studentInst) && studentCat === 'school')
        );
      } else {
        const targetId = currentEntity.id;
        const targetName = (currentEntity.name || '').toLowerCase().trim();
        const studentFranchiseId = u.franchiseId;
        const studentInst = (u.institution || u.franchiseName || u.schoolName || '').toLowerCase().trim();
        const studentCat = (u.admissionCategory || '').toLowerCase();

        return (
          studentFranchiseId === targetId ||
          studentInst === targetName ||
          (targetName && studentInst.includes(targetName)) ||
          (studentCat === 'franchise' || studentCat === 'academy')
        );
      }
    });

  // Filter franchise batches
  const franchiseBatches = batchesList.filter(b => {
    if (!b.branch) return true;
    const bBranch = (b.branch || '').toLowerCase();
    const target = (currentFranchise.branch || currentFranchise.name || 'tenkasi').toLowerCase().replace('branch', '').trim();
    return bBranch.includes(target) || target.includes(bBranch);
  });

  // Calculate franchise fee revenue formatted
  const franchisePayments = paymentsList.filter(p => {
    const student = usersList.find(u => u.userId === p.studentId);
    if (!student) return false;
    const sBranch = (student.branch || student.institution || '').toLowerCase();
    const target = (currentFranchise.branch || 'tenkasi').toLowerCase().replace('branch', '').trim();
    return sBranch.includes(target);
  });
  const franchiseRevenueNumber = franchisePayments.reduce((acc, p) => acc + (p.amountNum || 0), 0);
  const franchiseRevenueFormatted = `₹${(franchiseRevenueNumber || 18450).toLocaleString('en-IN')}`;

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

    const studentCertData = {
      studentId: student.id || student._id || student.admissionNo || regNo,
      admissionNo: student.admissionNo || regNo,
      studentName: student.studentName || 'Candidate Name',
      courseName: courseName,
      programPrefix: 'MINDSPARC',
      level: student.grade || student.level || 'Level 1',
      grade: student.results?.[0]?.rank || 'A+',
      duration: student.duration || '6 Months',
      registrationNo: regNo,
      certificateNo: certNo,
      centreName: currentFranchise.name || currentFranchise.branch || 'Franchise Learning Centre',
      centreCode: '101',
      centreAddress: currentFranchise.address || `${currentFranchise.city || 'Tenkasi'}, Tamil Nadu`,
      issueDate: student.enrolmentDate || '05-10-2026',
      certificateType: 'COMPLETION',
      studentPhoto: getStudentPhotoUrl(student) || student.studentPhoto || null,
      student: student,
      schoolName: currentFranchise.schoolName || currentFranchise.name,
      schoolSubtitle: currentFranchise.subtitle || 'VISION FOUNDATION',
      schoolMotto: currentFranchise.motto || 'EDUCATION • EMPOWERMENT • EXCELLENCE',
      schoolLogo: currentFranchise.logo || null,
      directorSignature: currentFranchise.signature || null
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
      issueDate: student.enrolmentDate || '05-10-2026',
      schoolName: currentFranchise.schoolName || currentFranchise.name,
      schoolSubtitle: currentFranchise.subtitle || 'VISION FOUNDATION',
      schoolMotto: currentFranchise.motto || 'EDUCATION • EMPOWERMENT • EXCELLENCE',
      schoolLogo: currentFranchise.logo || null,
      directorSignature: currentFranchise.signature || null
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
          TOP MASTER HEADER (MATCHING SUPER ADMIN EXACTLY)
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

            {/* Desktop-Only Logged-In Entity Indicator Badge (Displays Branch & School/Franchise Name) */}
            <div className="hidden lg:flex items-center gap-2 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl border border-white/20 backdrop-blur-xs transition min-w-0 shadow-xs">
              <div className="w-6 h-6 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                {isSchool ? <School className="w-3.5 h-3.5 text-amber-300" /> : <Building className="w-3.5 h-3.5 text-amber-300" />}
              </div>
              <div className="flex flex-col min-w-0 leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                  <span className="text-[9px] font-black uppercase tracking-wider text-amber-300 truncate">
                    {isSchool ? 'Logged In School' : 'Logged In Franchise'}
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-black text-white truncate max-w-[180px] xl:max-w-xs">
                  {currentFranchise.name}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* View Live Website Button (Icon on mobile, text on sm+) */}
            <button
              onClick={() => setActivePage('home')}
              className="text-xs font-black bg-white hover:bg-slate-100 text-[#0c234b] p-1.5 sm:px-3 sm:py-1.5 rounded-xl transition shadow-sm cursor-pointer flex items-center gap-1 sm:gap-1.5 active:scale-95 whitespace-nowrap shrink-0"
              title="Visit Live Website"
            >
              <Globe className="w-3.5 h-3.5 shrink-0 text-[#0c234b] sm:hidden" />
              <span className="hidden sm:inline">Website</span>
              <ArrowRight className="hidden sm:inline w-3.5 h-3.5 shrink-0" />
            </button>

            {/* Sign Out (Icon on mobile, text on sm+) */}
            <button
              onClick={onLogout}
              className="text-xs font-black bg-rose-600/90 hover:bg-rose-700 text-white p-1.5 sm:px-3 sm:py-1.5 rounded-xl transition shadow-sm cursor-pointer flex items-center gap-1 sm:gap-1.5 active:scale-95 whitespace-nowrap shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

        </div>

        {/* Mobile-Dedicated Active Status Sub-Bar (Matches Super Admin) */}
        <div className="lg:hidden bg-gradient-to-r from-[#051329] via-[#091e3d] to-[#0c2650] px-3 py-1.5 border-t border-amber-400/20 flex items-center justify-between gap-2 shadow-inner">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-5 h-5 rounded-md bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0">
              {isSchool ? <School className="w-3 h-3 text-amber-300" /> : <Building className="w-3 h-3 text-amber-300" />}
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300/90 shrink-0">
              {isSchool ? 'School Desk:' : 'Franchise Desk:'}
            </span>
            <span className="text-xs font-black text-white truncate">
              {currentFranchise.name}
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
            (MATCHING STAFF DASHBOARD EXACTLY)
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
                  {isSchool ? 'School Desks' : 'Franchise Desks'}
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
                {isSchool ? 'SCHOOL DESKS' : 'CENTRE DESKS'}
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                3 Modules
              </span>
            </div>

            {/* Vertical Nav List */}
            <nav className="space-y-1">
              <button
                type="button"
                onClick={() => handleTabSelect('franchise_overview')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition cursor-pointer text-left ${
                  activeTab === 'franchise_overview'
                    ? 'bg-[#0c234b] text-white shadow-sm ring-1 ring-amber-400/40'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                {isSchool ? (
                  <School className={`w-4 h-4 shrink-0 ${activeTab === 'franchise_overview' ? 'text-amber-400' : 'text-slate-500'}`} />
                ) : (
                  <Building className={`w-4 h-4 shrink-0 ${activeTab === 'franchise_overview' ? 'text-amber-400' : 'text-slate-500'}`} />
                )}
                <span className="truncate">{isSchool ? 'School Overview' : 'Centre Overview'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabSelect('franchise_student_details')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition cursor-pointer text-left ${
                  activeTab === 'franchise_student_details'
                    ? 'bg-[#0c234b] text-white shadow-sm ring-1 ring-amber-400/40'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                <FileText className={`w-4 h-4 shrink-0 ${activeTab === 'franchise_student_details' ? 'text-amber-400' : 'text-slate-500'}`} />
                <span className="truncate">Student Details</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabSelect('franchise_marksheet')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition cursor-pointer text-left ${
                  activeTab === 'franchise_marksheet'
                    ? 'bg-[#0c234b] text-white shadow-sm ring-1 ring-amber-400/40'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                <ClipboardList className={`w-4 h-4 shrink-0 ${activeTab === 'franchise_marksheet' ? 'text-amber-400' : 'text-slate-500'}`} />
                <span className="truncate">Student Marksheet</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* =========================================================================
            RIGHT MAIN CONTENT: TAB PANELS & WORKSPACE
            ========================================================================= */}
        <main className="flex-1 min-w-0 w-full lg:ml-72 xl:ml-80 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 space-y-5 bg-slate-100">
          
          {/* TAB 1: FRANCHISE OVERVIEW */}
          {activeTab === 'franchise_overview' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              
              {/* Franchise Banner */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0c234b] text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
                    {isSchool ? <School className="w-6 h-6" /> : <Building className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        {isSchool ? 'AFFILIATED PARTNER SCHOOL' : 'AUTHORIZED LEARNING CENTRE'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase">
                        {currentFranchise.city || 'Affiliated Centre'}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-950 mt-0.5">
                      {currentFranchise.name}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Coordinator / Principal: <strong>{currentFranchise.coordinator}</strong> • Affiliated with <strong>{currentFranchise.branch}</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Action Banners */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Enrolled Students Quick Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
                        Candidate Records
                      </span>
                    </div>
                    <h3 className="text-base font-black mt-2 text-slate-950">
                      Enrolled Student Management
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      View all registered learners, track admission applications, verify batch schedules, and manage course enrollments.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTabSelect('franchise_student_details')}
                    className="w-full sm:w-auto self-start px-4 py-2 bg-[#0c234b] hover:bg-[#153a78] text-white font-black rounded-xl text-xs flex items-center gap-2 transition cursor-pointer"
                  >
                    <span>View Students</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Student Marksheet Quick Card */}
                <div className="bg-[#0c234b] text-white p-5 rounded-2xl shadow-sm flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-400/30">
                        Academic Records
                      </span>
                    </div>
                    <h3 className="text-base font-black mt-2 text-white">
                      Student Marksheet Management
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Search enrolled students, record subject marks, calculate totals and print official marksheets for {currentFranchise.name}.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTabSelect('franchise_marksheet')}
                    className="w-full sm:w-auto self-start px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 transition cursor-pointer"
                  >
                    <span>Quick Mark</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: STUDENT DETAILS */}
          {activeTab === 'franchise_student_details' && (
            <StaffStudentDetailsPage
              activeBranch={currentFranchise.branch}
              branchStudents={franchiseStudents}
              portalType={isSchool ? 'school' : 'franchise'}
              entityName={currentFranchise.name}
              setViewingAdmissionStudent={setViewingAdmissionStudent}
              handleOpenMarksheet={handleOpenMarksheet}
              handleOpenCertForStudent={handleOpenCertForStudent}
              setViewingMergedPdfStudent={setViewingMergedPdfStudent}
              showToast={showToast}
              schoolsList={schoolsList}
            />
          )}

          {/* TAB 3: STUDENT MARKSHEET */}
          {activeTab === 'franchise_marksheet' && (
            <StaffStudentMarksheetPage
              activeBranch={currentFranchise.branch}
              branchStudents={franchiseStudents}
              portalType={isSchool ? 'school' : 'franchise'}
              entityName={currentFranchise.name}
              onBack={handleTabBack}
            />
          )}

        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR (MATCHING SUPER ADMIN) */}
      <nav 
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#081d3d] border-t-2 border-amber-400 text-white shadow-2xl"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="grid grid-cols-3 h-14 items-stretch select-none">
          <button
            type="button"
            onClick={() => handleTabSelect('franchise_overview')}
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition cursor-pointer ${
              activeTab === 'franchise_overview' ? 'text-amber-400 bg-white/10' : 'text-slate-300 hover:text-white'
            }`}
          >
            {isSchool ? <School className="w-4 h-4" /> : <Building className="w-4 h-4" />}
            <span>Overview</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSelect('franchise_student_details')}
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition cursor-pointer ${
              activeTab === 'franchise_student_details' ? 'text-amber-400 bg-white/10' : 'text-slate-300 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Students</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSelect('franchise_marksheet')}
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition cursor-pointer ${
              activeTab === 'franchise_marksheet' ? 'text-amber-400 bg-white/10' : 'text-slate-300 hover:text-white'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Marksheet</span>
          </button>
        </div>
      </nav>

      {/* ALL MODALS (OFFICIAL MARKSHEET, CERTIFICATE, MERGED PDF, ADMISSION) */}
      {selectedMarksheetStudent && (
        <OfficialMarksheetView
          student={selectedMarksheetStudent}
          onClose={() => setSelectedMarksheetStudent(null)}
          onDownloadPdf={() => {}}
        />
      )}

      {previewCertModalData && (
        <CertificateModal
          isOpen={Boolean(previewCertModalData)}
          initialData={previewCertModalData}
          certData={previewCertModalData}
          onClose={() => setPreviewCertModalData(null)}
        />
      )}

      {viewingMergedPdfStudent && (
        <MergedStudentPdfModal
          student={viewingMergedPdfStudent}
          onClose={() => setViewingMergedPdfStudent(null)}
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
