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
  Award,
  Sparkles,
  ArrowLeft
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
  getCoursePrefix,
  setActiveSession
} from '../../utils/authStorage';
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
  onOpenCertificate: _onOpenCertificate
}) {
  const currentSession = sessionUser || getActiveSession() || {};
  const isSchool = currentSession.role === 'School' || Boolean(currentSession.schoolId);

  const [franchisesList, setFranchisesList] = useState(() => getStoredFranchises());
  const [schoolsList, setSchoolsList] = useState(() => getStoredSchools());
  
  // Find current entity data (School or Franchise) and merge latest persisted branding
  let currentEntity = null;
  if (isSchool) {
    const matchedSchool = schoolsList.find(
      s => s.userId === currentSession.userId || s.id === currentSession.schoolId || s.id === currentSession.franchiseId || s.name === currentSession.name
    ) || schoolsList[0] || {
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
    };
    const storedBranding = getSchoolBranding(matchedSchool.id) || {};
    currentEntity = {
      ...matchedSchool,
      schoolName: storedBranding.schoolName || matchedSchool.schoolName || matchedSchool.name,
      subtitle: storedBranding.subtitle || matchedSchool.subtitle || 'TENKASI DISTRICT',
      motto: storedBranding.motto || matchedSchool.motto || 'KNOWLEDGE • CHARACTER • SERVICE',
      logo: storedBranding.logo !== undefined ? storedBranding.logo : matchedSchool.logo,
      signature: storedBranding.signature !== undefined ? storedBranding.signature : matchedSchool.signature
    };
  } else {
    const matchedFranchise = franchisesList.find(
      f => f.userId === currentSession.userId || f.id === currentSession.franchiseId || f.name === currentSession.name
    ) || franchisesList[0] || {
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
    };
    const storedBranding = getFranchiseBranding(matchedFranchise.id) || {};
    currentEntity = {
      ...matchedFranchise,
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
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  const handleTabSelect = (tabKey) => {
    setActiveTab(tabKey);
    sessionStorage.setItem('bsel_franchise_active_tab', tabKey);
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    .filter(u => u.role !== 'Super Admin' && u.role !== 'Branch Head' && u.role !== 'Staff' && u.role !== 'Franchise' && u.role !== 'School')
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
          TOP MASTER HEADER (MATCHING STAFF DASHBOARD EXACTLY)
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

            {/* Desktop-Only Logged-In Entity Indicator Badge */}
            <div className="hidden lg:flex items-center gap-2.5 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl border border-white/20 backdrop-blur-xs transition min-w-0 shadow-xs">
              <div className="w-7 h-7 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                {isSchool ? <School className="w-4 h-4 text-amber-300" /> : <Building className="w-4 h-4 text-amber-300" />}
              </div>
              <div className="flex flex-col min-w-0 leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                  <span className="text-[9px] font-black uppercase tracking-wider text-amber-300 truncate">
                    {isSchool ? 'LOGGED IN SCHOOL' : 'LOGGED IN FRANCHISE'}
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-black text-white truncate max-w-[200px] xl:max-w-xs">
                  {currentFranchise.name}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Quick Switch to Branch Admin Button (if user has branch admin privileges) */}
            <button
              onClick={() => {
                const session = getActiveSession() || {};
                sessionStorage.setItem('bsel_active_admin_role', 'Branch Head');
                sessionStorage.setItem('bsel_active_branch', currentFranchise.branch || 'Tenkasi Branch');
                setActivePage('admin');
              }}
              className="text-xs font-black bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 p-1.5 sm:px-3 sm:py-1.5 rounded-xl transition shadow-sm cursor-pointer flex items-center gap-1.5 active:scale-95 whitespace-nowrap shrink-0"
              title="Return to Branch Admin"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Branch Admin</span>
            </button>

            {/* View Live Website Button */}
            <button
              onClick={() => setActivePage('home')}
              className="text-xs font-black bg-white hover:bg-slate-100 text-[#0c234b] p-1.5 sm:px-3 sm:py-1.5 rounded-xl transition shadow-sm cursor-pointer flex items-center gap-1 sm:gap-1.5 active:scale-95 whitespace-nowrap shrink-0"
              title="Visit Live Website"
            >
              <Globe className="w-3.5 h-3.5 shrink-0 text-[#0c234b] sm:hidden" />
              <span className="hidden sm:inline">Website</span>
              <ArrowRight className="hidden sm:inline w-3.5 h-3.5 shrink-0" />
            </button>

            {/* Sign Out Button */}
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

        {/* Mobile-Dedicated Active Franchise Status Sub-Bar */}
        <div className="lg:hidden bg-gradient-to-r from-[#051329] via-[#091e3d] to-[#0c2650] px-3 py-1.5 border-t border-amber-400/20 flex items-center justify-between gap-2 shadow-inner">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-5 h-5 rounded-md bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0">
              {isSchool ? <School className="w-3 h-3 text-amber-300" /> : <Building className="w-3 h-3 text-amber-300" />}
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300/90 shrink-0">
              {isSchool ? 'School:' : 'Franchise:'}
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
        <main className="flex-1 min-w-0 w-full lg:ml-72 xl:ml-80 p-4 sm:p-6 lg:p-8 space-y-5 bg-slate-100">
          
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

              {/* Entity Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* Enrolled Students */}
                <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      {isSchool ? 'SCHOOL ENROLLED STUDENTS' : 'FRANCHISE ENROLLED STUDENTS'}
                    </span>
                    <div className="text-2xl font-black text-slate-950 mt-1">
                      {franchiseStudents.length}
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      Active Enrolled Learners
                    </span>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>

                {/* Active Batches */}
                <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      ACTIVE BATCHES
                    </span>
                    <div className="text-2xl font-black text-slate-950 mt-1">
                      {franchiseBatches.length || currentFranchise.batchesCount || 3} Batches
                    </div>
                    <span className="text-[11px] font-bold text-sky-700 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      Scheduled Class Slots
                    </span>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                </div>

                {/* Fee Collections */}
                <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      {isSchool ? 'SCHOOL FEES COLLECTED' : 'FRANCHISE FEES COLLECTED'}
                    </span>
                    <div className="text-2xl font-black text-slate-950 mt-1">
                      {franchiseRevenueFormatted}
                    </div>
                    <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      {isSchool ? 'School Partner Collections' : 'Franchise Center Collections'}
                    </span>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Award className="w-5 h-5" />
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
              onBack={() => handleTabSelect('franchise_overview')}
            />
          )}

        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR (MATCHING STAFF DASHBOARD) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0c234b]/95 backdrop-blur-md border-t border-white/10 px-3 py-2 text-white">
        <div className="grid grid-cols-3 gap-2 text-center">
          <button
            type="button"
            onClick={() => handleTabSelect('franchise_overview')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg text-[10px] font-bold transition ${
              activeTab === 'franchise_overview' ? 'text-amber-400 bg-white/10' : 'text-slate-300'
            }`}
          >
            <Building className="w-4 h-4 mb-0.5" />
            <span>Home</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSelect('franchise_student_details')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg text-[10px] font-bold transition ${
              activeTab === 'franchise_student_details' ? 'text-amber-400 bg-white/10' : 'text-slate-300'
            }`}
          >
            <FileText className="w-4 h-4 mb-0.5" />
            <span>Students</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSelect('franchise_marksheet')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg text-[10px] font-bold transition ${
              activeTab === 'franchise_marksheet' ? 'text-amber-400 bg-white/10' : 'text-slate-300'
            }`}
          >
            <ClipboardList className="w-4 h-4 mb-0.5" />
            <span>Marks</span>
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
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setViewingAdmissionStudent(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <StudentAdmissionFormView
              student={viewingAdmissionStudent}
              onClose={() => setViewingAdmissionStudent(null)}
            />
          </div>
        </div>
      )}

    </div>
  );
}
