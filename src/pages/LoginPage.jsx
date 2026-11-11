import React, { useState, useEffect } from 'react';

import {
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';

import CertificateModal from '../components/CertificateModal';
import AdmissionModal from '../components/AdmissionModal';
import api from '../services/api';
import StudentDashboard from '../components/student/StudentDashboard';

import {
  validateLogin,
  getActiveSession,
  setActiveSession,
  clearActiveSession,
  isPhoneNumberRegistered,
} from '../utils/authStorage';

// -------------------------------------------------------
// Student profile storage
// -------------------------------------------------------
const getStudentStorageKey = (student) => {
  const id = student?.userId || student?.id;

  if (!id) {
    throw new Error('Unable to identify this student account.');
  }

  return `bsel_student_profile_${String(id).trim().toLowerCase()}`;
};

const loadSavedProfile = (student) => {
  try {
    const key = getStudentStorageKey(student);
    const saved = localStorage.getItem(key);

    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...student,
        ...parsed,

        // Preserve authenticated account identity & immutable official admission data
        id: student.id || student.userId,
        userId: student.userId || student.id,
        role: student.role || 'Student',

        // Registration & Admission official data
        registerNumber: student.registerNumber || parsed.registerNumber,
        registrationNo: student.registerNumber || parsed.registerNumber || parsed.registrationNo,
        registerNumbers: (Array.isArray(student.registerNumbers) && student.registerNumbers.length > 0)
          ? student.registerNumbers
          : (Array.isArray(parsed.registerNumbers) ? parsed.registerNumbers : []),
        date: student.date || parsed.date || parsed.enrolmentDate,
        enrolmentDate: student.enrolmentDate || parsed.enrolmentDate || student.date,
        branch: student.branch || parsed.branch,
        institution: student.institution || parsed.institution,
        studyCenter: student.studyCenter || parsed.studyCenter || student.branch,

        // Course details
        courseName: (student.selectedCourses && student.selectedCourses.length > 1)
          ? student.selectedCourses.map((c) => c.courseName || c.name).filter(Boolean).join(' & ')
          : (parsed.selectedCourses && parsed.selectedCourses.length > 1)
          ? parsed.selectedCourses.map((c) => c.courseName || c.name).filter(Boolean).join(' & ')
          : (student.courseName || parsed.courseName || student.course || parsed.course),
        course: (student.selectedCourses && student.selectedCourses.length > 1)
          ? student.selectedCourses.map((c) => c.courseName || c.name).filter(Boolean).join(' & ')
          : (parsed.selectedCourses && parsed.selectedCourses.length > 1)
          ? parsed.selectedCourses.map((c) => c.courseName || c.name).filter(Boolean).join(' & ')
          : (student.course || parsed.course || student.courseName || parsed.courseName),
        program: (student.selectedCourses && student.selectedCourses.length > 1)
          ? student.selectedCourses.map((c) => c.courseName || c.name).filter(Boolean).join(' & ')
          : (parsed.selectedCourses && parsed.selectedCourses.length > 1)
          ? parsed.selectedCourses.map((c) => c.courseName || c.name).filter(Boolean).join(' & ')
          : (student.program || parsed.program || student.courseName || parsed.courseName),
        courseLevel: (student.selectedCourses && student.selectedCourses.length > 1)
          ? student.selectedCourses.map((c) => `${c.courseName || c.name}: ${c.level || 'Level 1'}`).join(' | ')
          : (parsed.selectedCourses && parsed.selectedCourses.length > 1)
          ? parsed.selectedCourses.map((c) => `${c.courseName || c.name}: ${c.level || 'Level 1'}`).join(' | ')
          : (student.courseLevel || parsed.courseLevel || student.level || parsed.level),
        level: (student.selectedCourses && student.selectedCourses.length > 1)
          ? student.selectedCourses.map((c) => `${c.courseName || c.name}: ${c.level || 'Level 1'}`).join(' | ')
          : (parsed.selectedCourses && parsed.selectedCourses.length > 1)
          ? parsed.selectedCourses.map((c) => `${c.courseName || c.name}: ${c.level || 'Level 1'}`).join(' | ')
          : (student.level || parsed.level || student.courseLevel || parsed.courseLevel),
        courseDuration: student.courseDuration || parsed.courseDuration || student.duration || parsed.duration || '6 Months',
        duration: student.duration || parsed.duration || student.courseDuration || '6 Months',
        selectedCourses: (student.selectedCourses && student.selectedCourses.length > 0) ? student.selectedCourses : (parsed.selectedCourses || []),

        // Official student identity
        name: student.name || parsed.name || student.studentName,
        studentName: student.studentName || parsed.studentName || student.name,
        parentName: student.parentName || parsed.parentName || student.fatherName || parsed.fatherName,
        fatherName: student.fatherName || parsed.fatherName || student.parentName || parsed.parentName,
        dateOfBirth: student.dateOfBirth || parsed.dateOfBirth || student.dob || parsed.dob,
        dob: student.dob || parsed.dob || student.dateOfBirth || parsed.dateOfBirth,
        gender: student.gender || parsed.gender,
        aadhaarNumber: student.aadhaarNumber || parsed.aadhaarNumber || student.aadharNumber || parsed.aadharNumber,
        aadharNumber: student.aadharNumber || parsed.aadharNumber || student.aadhaarNumber || parsed.aadhaarNumber,
        studentClass: student.studentClass || parsed.studentClass,
        studentStage: student.studentStage || parsed.studentStage,
        feeAmount: student.feeAmount || parsed.feeAmount,
        paymentMode: student.paymentMode || parsed.paymentMode,
        receiptRefNo: student.receiptRefNo || parsed.receiptRefNo,
      };
    }
  } catch (error) {
    console.error(
      'Unable to load the saved student profile:',
      error
    );
  }

  return student;
};

// -------------------------------------------------------
// Normalize student information
// -------------------------------------------------------
const normalizeStudent = (user) => {
  const selectedList = Array.isArray(user.selectedCourses) && user.selectedCourses.length > 0
    ? user.selectedCourses
    : (Array.isArray(user.courses) ? user.courses : []);

  const studentCourse =
    selectedList.length > 1
      ? selectedList.map((c) => c.courseName || c.name).filter(Boolean).join(' & ')
      : (
          user.courseName ||
          user.program ||
          user.course ||
          (selectedList[0]?.courseName || '') ||
          'Abacus Speed Math (Level 4) & Fine Arts'
        );

  const studentLevel =
    selectedList.length > 1
      ? selectedList.map((c) => `${c.courseName || c.name}: ${c.level || 'Level 1'}`).join(' | ')
      : (
          user.courseLevel ||
          user.level ||
          user.grade ||
          selectedList[0]?.level ||
          'Level 1'
        );

  const student = {
    ...user,
    name: user.studentName || user.name || 'Student',
    studentName: user.studentName || user.name || 'Student',
    id: user.userId || user.id,
    userId: user.userId || user.id,

    course: studentCourse,
    courseName: studentCourse,
    program: studentCourse,
    courseLevel: studentLevel,
    level: studentLevel,
    courseDuration: user.courseDuration || user.duration || '6 Months',
    duration: user.duration || user.courseDuration || '6 Months',

    branch: user.branch || user.institution || user.studyCenter || 'Tenkasi',
    institution: user.institution || user.branch || user.studyCenter || 'Tenkasi',
    studyCenter: user.studyCenter || user.branch || user.institution || 'Tenkasi',

    parentName: user.parentName || user.fatherName || '',
    fatherName: user.parentName || user.fatherName || '',
    registerNumber: user.registerNumber || user.registrationNo || '',
    registrationNo: user.registerNumber || user.registrationNo || '',
    registerNumbers: Array.isArray(user.registerNumbers) ? user.registerNumbers : [],
    dob: user.dob || user.dateOfBirth || '',
    dateOfBirth: user.dob || user.dateOfBirth || '',
    date: user.date || user.enrolmentDate || '',
    studentClass: user.studentClass || '',
    studentStage: user.studentStage || '',
    gender: user.gender || 'Male',
    aadhaarNumber: user.aadhaarNumber || user.aadharNumber || '',
    aadharNumber: user.aadhaarNumber || user.aadharNumber || '',
    studentPhoto: user.studentPhoto || user.photoUrl || user.photoURL || user.profilePhoto || null,
    photoUrl: user.studentPhoto || user.photoUrl || user.photoURL || user.profilePhoto || null,
    feeAmount: user.feeAmount || '',
    paymentMode: user.paymentMode || '',
    receiptRefNo: user.receiptRefNo || '',
    selectedCourses: Array.isArray(user.selectedCourses) ? user.selectedCourses : (Array.isArray(user.courses) ? user.courses : []),

    events: Array.isArray(user.events) ? user.events : [],
    results: Array.isArray(user.results) ? user.results : [],
  };

  return loadSavedProfile(student);
};

// -------------------------------------------------------
// Login Page
// -------------------------------------------------------
export default function LoginPage({
  setActivePage,
  onStudentDashboardChange,
}) {
  // User ID
  const [userId, setUserId] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bsel_remember_user') || '';
    }

    return '';
  });

  // Password and form state
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Restore an existing student session.
  const [currentUser, setCurrentUser] = useState(() => {
    const session = getActiveSession();

    if (!session || session.role === 'Super Admin' || session.role === 'Branch Head') {
      return null;
    }

    return normalizeStudent(session);
  });

  const [selectedCertForModal, setSelectedCertForModal] =
    useState(null);

  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const isLoggedIn = Boolean(currentUser);

  // Listen for open_admission_modal event
  useEffect(() => {
    const handleOpenAdmission = () => setIsAdmissionOpen(true);
    window.addEventListener('open_admission_modal', handleOpenAdmission);
    return () => window.removeEventListener('open_admission_modal', handleOpenAdmission);
  }, []);

  // -------------------------------------------------------
  // Notify App.jsx when the student dashboard is displayed.
  // Public pages are unaffected because App.jsx also checks
  // that the current page is "login".
  // -------------------------------------------------------
  useEffect(() => {
    onStudentDashboardChange?.(isLoggedIn);
  }, [isLoggedIn, onStudentDashboardChange]);

  // -------------------------------------------------------
  // Synchronize authentication changes
  // -------------------------------------------------------
  useEffect(() => {
    const syncSession = () => {
      const session = getActiveSession();

      if (session && session.role !== 'Super Admin' && session.role !== 'Branch Head') {
        setCurrentUser(normalizeStudent(session));
      } else {
        setCurrentUser(null);
      }
    };

    window.addEventListener(
      'bsel_session_changed',
      syncSession
    );

    return () => {
      window.removeEventListener(
        'bsel_session_changed',
        syncSession
      );
    };
  }, []);

  // -------------------------------------------------------
  // Login
  // -------------------------------------------------------
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (!userId.trim()) {
      setErrorMessage('Please enter your User ID.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Please enter your Password.');
      return;
    }

    let authUser = null;
    const localResult = validateLogin(userId.trim(), password);
    if (localResult.success) {
      authUser = localResult.user;
    }

    // Check Neon PostgreSQL for fresh credentials & cloud profile data
    try {
      const remoteRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId.trim(), password: password.trim() })
      });
      if (remoteRes.ok) {
        const remoteData = await remoteRes.json();
        if (remoteData && remoteData.user) {
          const u = remoteData.user;
          authUser = {
            ...(authUser || {}),
            ...u,
            userId: u.user_id || u.userId || authUser?.userId || userId.trim(),
            studentName: u.student_name || u.name || authUser?.studentName,
            name: u.student_name || u.name || authUser?.name,
            parentName: u.parent_name || authUser?.parentName,
            phone: u.phone || authUser?.phone,
            email: u.email || authUser?.email,
            address: u.address || authUser?.address,
            grade: u.grade || authUser?.grade,
            program: u.program || u.course_name || authUser?.program,
            courseName: u.course_name || u.program || authUser?.courseName,
            branch: u.branch || authUser?.branch,
            institution: u.institution || authUser?.institution,
            studentPhoto: u.photo_url || u.student_photo || authUser?.studentPhoto,
            photoUrl: u.photo_url || u.student_photo || authUser?.photoUrl,
            registerNumber: u.register_number || authUser?.registerNumber,
            registrationNo: u.registration_no || authUser?.registrationNo,
            role: u.role || authUser?.role || 'Student'
          };
        }
      }
    } catch (netErr) {
      console.debug('[Neon Auth offline fallback]:', netErr.message);
    }

    if (!authUser) {
      const cleanDigits = userId.replace(/\D/g, '');
      if (cleanDigits.length === 10 && !isPhoneNumberRegistered(cleanDigits) && !userId.toLowerCase().startsWith('admin') && !userId.toLowerCase().startsWith('branch')) {
        setErrorMessage(`Mobile number "${cleanDigits}" is not registered yet. Please click 'Submit Admission Enquiry' below to register.`);
        return;
      }
      setErrorMessage(
        localResult.message || 'Invalid User ID or password.'
      );
      return;
    }

    // Remember User ID if selected.
    if (rememberMe) {
      localStorage.setItem(
        'bsel_remember_user',
        userId.trim()
      );
    } else {
      localStorage.removeItem('bsel_remember_user');
    }

    // Keep the existing Super Admin navigation.
    if (authUser.role === 'Super Admin' || authUser.role === 'Branch Head') {
      setActiveSession(authUser);
      setActivePage('admin');
      return;
    }

    // Prepare the student dashboard.
    const student = normalizeStudent(authUser);

    setActiveSession(student);
    setCurrentUser(student);

    setPassword('');
    setErrorMessage('');
  };

  // -------------------------------------------------------
  // Update student profile
  // -------------------------------------------------------
  const handleUpdateStudent = async (updatedStudent) => {
    if (!currentUser) {
      throw new Error('Please log in to update your profile.');
    }

    const studentId = currentUser.userId || currentUser.id;

    if (!studentId) {
      throw new Error('Unable to identify the student account.');
    }

    // Preserve account identity, official registration, and course details
    const safeUpdatedStudent = {
      ...currentUser,
      ...updatedStudent,
      id: currentUser.id || studentId,
      userId: currentUser.userId || studentId,
      role: currentUser.role || 'Student',

      // Keep official admission fields completely untampered:
      registerNumber: currentUser.registerNumber || updatedStudent.registerNumber,
      registrationNo: currentUser.registerNumber || updatedStudent.registerNumber,
      course: currentUser.course || updatedStudent.course,
      courseName: currentUser.courseName || updatedStudent.courseName,
      program: currentUser.program || updatedStudent.program,
      courseLevel: currentUser.courseLevel || updatedStudent.courseLevel,
      level: currentUser.level || updatedStudent.level,
      courseDuration: currentUser.courseDuration || updatedStudent.courseDuration,
      duration: currentUser.duration || updatedStudent.duration,
      branch: currentUser.branch || updatedStudent.branch,
      institution: currentUser.institution || updatedStudent.institution,
      studyCenter: currentUser.studyCenter || updatedStudent.studyCenter,
      date: currentUser.date || updatedStudent.date,
      enrolmentDate: currentUser.enrolmentDate || updatedStudent.enrolmentDate,
      selectedCourses: currentUser.selectedCourses || updatedStudent.selectedCourses,
      name: currentUser.name || updatedStudent.name,
      studentName: currentUser.studentName || updatedStudent.studentName,
      parentName: currentUser.parentName || updatedStudent.parentName,
      fatherName: currentUser.fatherName || updatedStudent.fatherName,
      dob: currentUser.dob || updatedStudent.dob,
      dateOfBirth: currentUser.dateOfBirth || updatedStudent.dateOfBirth,
      gender: currentUser.gender || updatedStudent.gender,
      aadhaarNumber: currentUser.aadhaarNumber || updatedStudent.aadhaarNumber,
      aadharNumber: currentUser.aadhaarNumber || updatedStudent.aadhaarNumber,
      feeAmount: currentUser.feeAmount || updatedStudent.feeAmount,
      paymentMode: currentUser.paymentMode || updatedStudent.paymentMode,
      receiptRefNo: currentUser.receiptRefNo || updatedStudent.receiptRefNo,
    };

    const storageKey = getStudentStorageKey(safeUpdatedStudent);

    try {
      // 1. Save the editable profile locally for instant responsiveness
      localStorage.setItem(
        storageKey,
        JSON.stringify(safeUpdatedStudent)
      );

      // Also sync into bsel_registered_users
      try {
        const rawUsers = localStorage.getItem('bsel_registered_users');
        if (rawUsers) {
          const userList = JSON.parse(rawUsers);
          if (Array.isArray(userList)) {
            const updatedList = userList.map((u) => {
              if (
                (u.userId && u.userId.toLowerCase() === studentId.toLowerCase()) ||
                (u.phone && safeUpdatedStudent.phone && u.phone.replace(/\D/g, '') === safeUpdatedStudent.phone.replace(/\D/g, ''))
              ) {
                return { ...u, ...safeUpdatedStudent };
              }
              return u;
            });
            localStorage.setItem('bsel_registered_users', JSON.stringify(updatedList));
          }
        }
      } catch (listErr) {
        console.warn('Failed to sync student update into registered users list:', listErr);
      }

      // Update the authenticated session.
      setActiveSession(safeUpdatedStudent);

      // Refresh the dashboard.
      setCurrentUser(safeUpdatedStudent);

      // 2. Persist profile changes directly to Neon PostgreSQL & Amazon S3
      try {
        const savedRemote = await api.students.update(studentId, safeUpdatedStudent);
        if (savedRemote && savedRemote.photo_url) {
          safeUpdatedStudent.studentPhoto = savedRemote.photo_url;
          safeUpdatedStudent.photoUrl = savedRemote.photo_url;
          setActiveSession(safeUpdatedStudent);
          setCurrentUser({ ...safeUpdatedStudent });
        }
      } catch (dbErr) {
        console.warn('[Neon Profile Sync error]:', dbErr.message);
      }
    } catch {
      throw new Error(
        'Unable to save your profile in this browser. Please try again.'
      );
    }
  };

  // -------------------------------------------------------
  // Logout
  // -------------------------------------------------------
  const handleLogout = () => {
    clearActiveSession();

    setCurrentUser(null);
    setPassword('');
    setErrorMessage('');
    setSelectedCertForModal(null);

    // Preserve remembered User ID when enabled.
    if (!localStorage.getItem('bsel_remember_user')) {
      setUserId('');
    }

    // Notify App.jsx immediately.
    onStudentDashboardChange?.(false);
  };

  // =======================================================
  // LOGGED-IN STUDENT: DISPLAY DASHBOARD WITHOUT GLOBAL
  // NAVBAR, FOOTER, OR FLOATING ACTION BUTTONS.
  // =======================================================
  if (isLoggedIn && currentUser) {
    return (
      <>
        <StudentDashboard
          student={currentUser}
          onLogout={handleLogout}
          onUpdateStudent={handleUpdateStudent}
          onViewCertificate={setSelectedCertForModal}
        />

        {selectedCertForModal && (
          <CertificateModal
            isOpen={true}
            initialData={selectedCertForModal}
            onClose={() => setSelectedCertForModal(null)}
          />
        )}
      </>
    );
  }

  // =======================================================
  // LOGGED-OUT STUDENT: DISPLAY LOGIN FORM.
  // Distinct accent border for overall page container.
  // =======================================================
  return (
    <div className="w-full min-h-screen bg-[#0F2B5C] bg-gradient-to-b from-[#0F2B5C] via-[#0E2856] to-[#0A1D3D] px-4 sm:px-6 lg:px-10 py-6 sm:py-10 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Subtle theme ambient light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl lg:max-w-5xl relative z-10 my-auto">
        {/* Top Bar with Back Button */}
        <div className="mb-3 sm:mb-4 flex items-center justify-start">
          <button
            type="button"
            onClick={() => {
              if (setActivePage) {
                setActivePage('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                window.history.back();
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 active:scale-95 px-2.5 py-1 rounded-lg border border-white/20 backdrop-blur transition cursor-pointer shadow-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
        </div>

        {/* OVERALL PAGE CONTAINER: Framed with a distinct accent border in different color (amber/gold) */}
        <div className="w-full rounded-2xl sm:rounded-3xl border border-amber-400 p-6 sm:p-8 lg:p-10 relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-12 items-center">

            {/* LEFT COLUMN: Logo & Details */}
            <div className="md:col-span-5 flex flex-col items-center justify-center text-center py-2 sm:py-4">
              {/* Emblem Logo - Big, Clear & No Animation */}
              <div className="relative mb-3 flex items-center justify-center">
                <div className="absolute w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-blue-400/10 blur-2xl pointer-events-none" />
                <img
                  src="/bsel_crest_logo.png"
                  alt="B★SEL Official Emblem Logo"
                  className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
                  onError={(e) => {
                    e.currentTarget.src = '/bsel_logo.jpg';
                  }}
                />
              </div>

              {/* Brand Title */}
              <div className="font-extrabold tracking-wider flex items-center justify-center gap-1.5 font-heading text-2xl sm:text-3xl text-white">
                <span className="tracking-widest">B</span>
                <span className="text-amber-400 font-bold inline-block drop-shadow-sm text-[1.15em] -translate-y-[1px]">★</span>
                <span className="tracking-widest">SEL</span>
              </div>

              {/* Organization Tagline */}
              <p className="mt-1.5 text-sm sm:text-base font-semibold text-blue-100 max-w-[280px] leading-relaxed">
                Board of Skills and Educational Learning
              </p>
            </div>

            {/* RIGHT COLUMN: Form & Credentials */}
            <div className="md:col-span-7 flex flex-col justify-center space-y-3 max-w-md w-full mx-auto md:mx-0">
              {/* Header */}
              <div className="space-y-0.5">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Student Login Portal
                </h1>
                <p className="text-xs text-blue-100/85 font-normal">
                  Sign in to access your course, student profile, and notifications.
                </p>
              </div>

              {/* Login Error */}
              {errorMessage && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-rose-400/50 bg-rose-950/60 p-2.5 text-xs text-rose-200"
                >
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-400" />
                  <div>
                    <strong className="block font-bold text-rose-200 text-xs">
                      Login unsuccessful
                    </strong>
                    <p className="leading-relaxed text-rose-300 text-[11px]">
                      {errorMessage}
                    </p>
                  </div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
                {/* User ID */}
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label
                      htmlFor="student-user-id"
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-200"
                    >
                      User ID / Mobile Number
                    </label>
                    {(() => {
                      const clean = (userId || '').replace(/\D/g, '');
                      if (clean.length === 10) {
                        const exists = isPhoneNumberRegistered(clean);
                        return (
                          <span className={`text-[10.5px] font-bold ${exists ? 'text-emerald-300' : 'text-amber-300'}`}>
                            {exists ? '✓ Number already exists' : 'Number not registered'}
                          </span>
                        );
                      }
                      return null;
                    })()}
                  </div>
                  <div className="relative">
                    <input
                      id="student-user-id"
                      type="text"
                      required
                      autoComplete="username"
                      placeholder="e.g. BSEL-9840123456 or 10-digit mobile"
                      value={userId}
                      onChange={(event) => {
                        setUserId(event.target.value);
                        setErrorMessage('');
                      }}
                      className="w-full h-9 sm:h-10 rounded-lg bg-white border border-slate-300 px-3.5 pr-10 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40"
                    />
                    <div className="absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center text-slate-400 pointer-events-none">
                      <User className="h-4 w-4 text-slate-500" />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-1">
                    <label
                      htmlFor="student-password"
                      className="text-xs font-semibold uppercase tracking-wider text-slate-200"
                    >
                      Password
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      id="student-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setErrorMessage('');
                      }}
                      className="w-full h-9 sm:h-10 rounded-lg bg-white border border-slate-300 px-3.5 pr-10 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      className="absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center text-slate-400 hover:text-slate-700 transition cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember User ID */}
                <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-200 hover:text-amber-200 transition">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-300 bg-white text-blue-700 focus:ring-amber-400"
                  />
                  Remember User ID
                </label>

                {/* Quick Demo Credentials Box - Aligned grid & harmonized theme colors */}
                <div className="rounded-xl bg-white/[0.06] p-2.5 sm:p-3 border border-white/15 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white block uppercase text-[11px] tracking-wider">
                      Quick Demo Portals:
                    </span>
                    <span className="text-[10px] text-blue-200/70 font-medium">
                      Click to fill
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setUserId('admin');
                        setPassword('admin123');
                        setErrorMessage('');
                      }}
                      className="w-full py-1.5 px-1 sm:px-2 bg-blue-900/50 hover:bg-blue-800/70 border border-blue-400/40 text-blue-100 font-semibold rounded-lg text-[11px] sm:text-xs transition active:scale-95 cursor-pointer text-center flex flex-col items-center justify-center min-h-[36px]"
                    >
                      Super Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUserId('branch.admin');
                        setPassword('branch123');
                        setErrorMessage('');
                      }}
                      className="w-full py-1.5 px-1 sm:px-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 font-semibold rounded-lg text-xs transition active:scale-95 cursor-pointer text-center flex items-center justify-center min-h-[36px]"
                    >
                      Branch Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUserId('BSEL-9840123456');
                        setPassword('9840123456');
                        setErrorMessage('');
                      }}
                      className="w-full py-1.5 px-1 sm:px-2 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/50 text-sky-200 font-semibold rounded-lg text-[11px] sm:text-xs transition active:scale-95 cursor-pointer text-center flex flex-col items-center justify-center min-h-[36px]"
                    >
                      Student
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="flex w-full h-9 sm:h-10 items-center justify-center gap-1.5 rounded-lg bg-[#143B7A] hover:bg-[#1E4D99] border border-blue-300/30 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:shadow active:scale-[0.99] cursor-pointer"
                >
                  Log In
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>

              {/* Admission Enquiry Text Link */}
              <div className="pt-0.5 text-center">
                <button
                  type="button"
                  onClick={() => setIsAdmissionOpen(true)}
                  className="text-xs font-medium text-blue-100 hover:text-white hover:underline transition cursor-pointer"
                >
                  Don&apos;t have login credentials? Submit Admission Enquiry →
                </button>
              </div>

              {/* Help / Helpline */}
              <div className="border-t border-white/15 pt-2 text-center text-xs text-blue-100/80">
                Need assistance? Helpline:{' '}
                <a
                  href="tel:+919840123456"
                  className="font-bold text-white hover:text-amber-300 transition"
                >
                  +91 98401 23456
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admission Enquiry / Application Modal */}
      <AdmissionModal
        isOpen={isAdmissionOpen}
        onClose={() => setIsAdmissionOpen(false)}
        setActivePage={setActivePage}
      />
    </div>
  );
}