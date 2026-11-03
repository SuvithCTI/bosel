import React, { useState, useEffect } from 'react';

import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';

import Logo from '../components/Logo';
import CertificateModal from '../components/CertificateModal';
import StudentDashboard from '../components/student/StudentDashboard';

import {
  validateLogin,
  getActiveSession,
  setActiveSession,
  clearActiveSession,
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
      return {
        ...student,
        ...JSON.parse(saved),

        // Preserve authenticated account identity.
        id: student.id || student.userId,
        userId: student.userId || student.id,
        role: student.role,
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
  const student = {
    ...user,
    name: user.studentName || user.name || 'Student',
    id: user.userId || user.id,
    userId: user.userId || user.id,

    course:
      user.program ||
      user.course ||
      'Abacus Speed Math (Level 4) & Fine Arts',

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

  const [errorMessage, setErrorMessage] = useState('');

  const isLoggedIn = Boolean(currentUser);

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
  const handleSubmit = (event) => {
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

    const result = validateLogin(userId.trim(), password);

    if (!result.success) {
      setErrorMessage(
        result.message || 'Invalid User ID or password.'
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
    if (result.user.role === 'Super Admin' || result.user.role === 'Branch Head') {
      setActiveSession(result.user);
      setActivePage('admin');
      return;
    }

    // Prepare the student dashboard.
    const student = normalizeStudent(result.user);

    setActiveSession(student);
    setCurrentUser(student);

    setPassword('');
    setErrorMessage('');
  };

  // -------------------------------------------------------
  // Update student profile
  // -------------------------------------------------------
  const handleUpdateStudent = (updatedStudent) => {
    if (!currentUser) {
      throw new Error('Please log in to update your profile.');
    }

    const studentId = currentUser.userId || currentUser.id;

    if (!studentId) {
      throw new Error('Unable to identify the student account.');
    }

    // Preserve account identity and role.
    const safeUpdatedStudent = {
      ...currentUser,
      ...updatedStudent,

      id: currentUser.id || studentId,
      userId: currentUser.userId || studentId,
      role: currentUser.role,
    };

    const storageKey = getStudentStorageKey(safeUpdatedStudent);

    const editableProfile = {
      name: safeUpdatedStudent.name,
      studentName:
        safeUpdatedStudent.studentName ||
        safeUpdatedStudent.name,

      parentName: safeUpdatedStudent.parentName || '',
      phone: safeUpdatedStudent.phone || '',
      email: safeUpdatedStudent.email || '',
      grade: safeUpdatedStudent.grade || '',
      institution: safeUpdatedStudent.institution || '',
    };

    try {
      // Save the editable profile locally.
      localStorage.setItem(
        storageKey,
        JSON.stringify(editableProfile)
      );

      // Update the authenticated session.
      setActiveSession(safeUpdatedStudent);

      // Refresh the dashboard.
      setCurrentUser(safeUpdatedStudent);
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

  // -------------------------------------------------------
  // Forgot password
  // -------------------------------------------------------
  const handleForgotPassword = () => {
    window.alert(
      'Your password is your registered 10-digit mobile number. ' +
        'Your User ID follows the format BSEL-District-MobileNumber ' +
        '(example: BSEL-CBE-9876543211). ' +
        'For assistance, contact +91 98401 23456.'
    );
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
                  <label
                    htmlFor="student-user-id"
                    className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-200"
                  >
                    User ID
                  </label>
                  <div className="relative">
                    <input
                      id="student-user-id"
                      type="text"
                      required
                      autoComplete="username"
                      placeholder="Enter your User ID"
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
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <label
                      htmlFor="student-password"
                      className="text-xs font-semibold uppercase tracking-wider text-slate-200"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs font-medium text-sky-300 hover:text-white hover:underline transition cursor-pointer"
                    >
                      Forgot Password?
                    </button>
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
                        setUserId('BSEL-STU-784201');
                        setPassword('besel2026');
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
              {setActivePage && (
                <div className="pt-0.5 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      window.dispatchEvent(
                        new CustomEvent('open_admission_modal')
                      );
                    }}
                    className="text-xs font-medium text-blue-100 hover:text-white hover:underline transition cursor-pointer"
                  >
                    Don't have login credentials? Submit Admission Enquiry →
                  </button>
                </div>
              )}

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
    </div>
  );

}