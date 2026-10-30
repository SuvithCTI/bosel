import React, { useState, useEffect } from 'react';

import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
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
  // The normal public navbar and footer remain visible.
  // =======================================================
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 md:py-16">
      <div className="mx-auto max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

        {/* Login Header */}
        <div className="space-y-3 bg-gradient-to-r from-[#0F2B5C] via-[#143B7A] to-[#1E4D99] p-7 text-center text-white">
          <div className="mb-2 flex justify-center">
            <Logo lightText={true} />
          </div>

          <h1 className="text-2xl font-black">
            Student Login Portal
          </h1>

          <p className="text-xs leading-5 text-blue-100">
            Sign in to access your course, student profile, and notifications.
          </p>
        </div>

        <div className="space-y-5 p-6 sm:p-7">

          {/* Login Error */}
          {errorMessage && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-xl border-2 border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-900"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />

              <div>
                <strong className="mb-1 block font-black">
                  Login unsuccessful
                </strong>

                <p className="leading-relaxed">
                  {errorMessage}
                </p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* User ID */}
            <div>
              <label
                htmlFor="student-user-id"
                className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-900"
              >
                User ID
              </label>

              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

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
                  className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-base font-semibold text-slate-950 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100 sm:text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="student-password"
                  className="text-xs font-black uppercase tracking-wider text-slate-900"
                >
                  Password
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[11px] font-bold text-blue-800 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

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
                  className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-11 text-base font-semibold text-slate-950 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100 sm:text-sm"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-blue-950"
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
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
            <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) =>
                  setRememberMe(event.target.checked)
                }
                className="h-4 w-4 rounded border-slate-300 text-blue-800 focus:ring-blue-600"
              />

              Remember User ID
            </label>

            {/* Quick Demo Credentials Pill for Evaluators */}
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-xs">
              <span className="font-bold text-slate-700 block mb-1.5 uppercase text-[10px] tracking-wider">⚡ Quick Demo Portals:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setUserId('admin');
                    setPassword('admin123');
                    setErrorMessage('');
                  }}
                  className="px-2.5 py-1 bg-[#0F2B5C] text-white hover:bg-[#18458F] font-bold rounded-lg text-[11px] transition"
                >
                  👑 Super Admin
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserId('branch.tenkasi');
                    setPassword('branch123');
                    setErrorMessage('');
                  }}
                  className="px-2.5 py-1 bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold rounded-lg text-[11px] transition"
                >
                  🏢 Branch Head (Tenkasi)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserId('BSEL-STU-784201');
                    setPassword('besel2026');
                    setErrorMessage('');
                  }}
                  className="px-2.5 py-1 bg-slate-200 text-slate-800 hover:bg-slate-300 font-bold rounded-lg text-[11px] transition"
                >
                  🎓 Student
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F2B5C] py-3.5 text-sm font-extrabold text-white shadow-md transition hover:bg-[#18458F] hover:shadow-lg"
            >
              Log In
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Admission Enquiry */}
          {setActivePage && (
            <div className="border-t border-slate-100 pt-5 text-center">
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent('open_admission_modal')
                  );
                }}
                className="text-xs font-bold text-blue-800 hover:text-blue-950 hover:underline"
              >
                Don't have login credentials? Submit Admission Enquiry →
              </button>
            </div>
          )}

          {/* Help */}
          <div className="border-t border-slate-100 pt-4 text-center text-xs text-slate-500">
            Need assistance? Helpline:{' '}
            <a
              href="tel:+919840123456"
              className="font-extrabold text-slate-800 hover:text-blue-800"
            >
              +91 98401 23456
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}