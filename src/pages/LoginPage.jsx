import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Download, 
  Award, 
  LogOut, 
  Ticket,
  AlertCircle
} from 'lucide-react';
import Logo from '../components/Logo';
import CertificateModal from '../components/CertificateModal';
import { validateLogin, getActiveSession, setActiveSession, clearActiveSession } from '../utils/authStorage';

export default function LoginPage({ setActivePage }) {
  const [userId, setUserId] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bsel_remember_user');
      if (saved) return saved;
    }
    return 'admin';
  });
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const session = getActiveSession();
    return !!session && session.role !== 'Super Admin';
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const session = getActiveSession();
    return session && session.role !== 'Super Admin' ? session : null;
  });
  const [selectedCertForModal, setSelectedCertForModal] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Keep state in sync if session changes elsewhere
  useEffect(() => {
    const syncSession = () => {
      const session = getActiveSession();
      if (session && session.role !== 'Super Admin') {
        setCurrentUser(session);
        setIsLoggedIn(true);
      } else if (!session) {
        setCurrentUser(null);
        setIsLoggedIn(false);
      }
    };
    window.addEventListener('bsel_session_changed', syncSession);
    return () => window.removeEventListener('bsel_session_changed', syncSession);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!userId.trim()) {
      setErrorMessage('Please enter your User ID.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your Password.');
      return;
    }

    if (rememberMe && typeof window !== 'undefined') {
      localStorage.setItem('bsel_remember_user', userId);
    }

    const result = validateLogin(userId, password);
    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    if (result.user.role === 'Super Admin') {
      setActiveSession(result.user);
      setActivePage('admin');
      return;
    }

    const userData = {
      ...result.user,
      name: result.user.studentName || result.user.name,
      id: result.user.userId || result.user.id,
      course: result.user.program || result.user.course || 'Abacus Speed Math (Level 4) & Fine Arts',
      events: result.user.events || [],
      results: result.user.results || []
    };

    setActiveSession(userData);
    setCurrentUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    clearActiveSession();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUserId('');
    setPassword('');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 md:py-16 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* If user is ALREADY logged in, show their portal dashboard */}
        {isLoggedIn && currentUser ? (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Dashboard Header Bar */}
            <div className="bg-gradient-to-r from-[#0F2B5C] to-[#1E4D99] text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-amber-400">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] uppercase font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                      {currentUser.role} Portal
                    </span>
                    <span className="text-xs text-sky-200 font-mono">ID: {currentUser.id}</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black font-heading mt-1">
                    {currentUser.name}
                  </h2>
                  <p className="text-xs text-slate-200 mt-0.5">
                    {currentUser.institution}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="self-start md:self-auto px-4 py-2 bg-white/15 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 border border-white/20"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              {/* Active Courses */}
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700">Enrolled Program</span>
                  <h4 className="font-extrabold text-slate-900 text-sm md:text-base">{currentUser.course}</h4>
                </div>
                <span className="text-xs font-semibold px-3 py-1 bg-sky-200/70 text-sky-900 rounded-lg self-start sm:self-auto">
                  Active Session: 2026-2027
                </span>
              </div>

              {/* Student Profile Info (if available from admission enrolment) */}
              {(currentUser.parentName || currentUser.grade || currentUser.phone) && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-sky-700" />
                    <span>Enrolled Student Profile</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    {currentUser.grade && (
                      <div>
                        <span className="text-slate-500 block text-[10px]">Class / Grade</span>
                        <strong className="text-slate-900 font-bold">{currentUser.grade}</strong>
                      </div>
                    )}
                    {currentUser.parentName && (
                      <div>
                        <span className="text-slate-500 block text-[10px]">Parent's Name</span>
                        <strong className="text-slate-900 font-bold">{currentUser.parentName}</strong>
                      </div>
                    )}
                    {currentUser.phone && (
                      <div>
                        <span className="text-slate-500 block text-[10px]">Contact Mobile</span>
                        <strong className="text-slate-900 font-bold">{currentUser.phone}</strong>
                      </div>
                    )}
                    {currentUser.email && (
                      <div>
                        <span className="text-slate-500 block text-[10px]">Email Address</span>
                        <strong className="text-slate-900 font-bold truncate block">{currentUser.email}</strong>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Registered Events & Hall Tickets */}
              <div>
                <h3 className="text-base font-extrabold text-slate-900 font-heading mb-3 flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-sky-600" />
                  <span>Competition Hall Tickets</span>
                </h3>
                <div className="space-y-2.5">
                  {currentUser.events.map((evt, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-xs md:text-sm font-bold text-slate-900">{evt.name}</h4>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                          <span>Exam Date: <strong className="text-slate-700">{evt.date}</strong></span>
                          <span>•</span>
                          <span>Seat Allotment: <strong className="text-slate-700">{evt.seat}</strong></span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                          {evt.status}
                        </span>
                        <button 
                          onClick={() => alert(`Downloading Hall Ticket for ${evt.name}...`)}
                          className="px-3 py-1.5 bg-[#0F2B5C] hover:bg-sky-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                        >
                          <Download className="w-3 h-3" />
                          <span>Hall Slip</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Results & Scorecards */}
              <div>
                <h3 className="text-base font-extrabold text-slate-900 font-heading mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Certificates & Scorecards</span>
                </h3>
                <div className="space-y-2.5">
                  {currentUser.results.map((res, idx) => (
                    <div key={idx} className="bg-amber-50/50 border border-amber-200/80 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-xs md:text-sm font-bold text-slate-900">{res.exam}</h4>
                        <div className="text-[11px] text-slate-600 mt-0.5 flex items-center gap-2">
                          <span>Score: <strong className="text-emerald-700">{res.score}</strong></span>
                          <span>•</span>
                          <span>Rank: <strong className="text-amber-800 font-bold">{res.rank}</strong></span>
                          <span>•</span>
                          <span>Cert: <span className="font-mono text-slate-600">{res.certificateNo}</span></span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedCertForModal({
                          studentName: currentUser.name,
                          courseName: 'Abacus',
                          level: 'Level 4',
                          grade: 'A+',
                          certificateNo: res.certificateNo,
                          centreName: currentUser.institution
                        })}
                        className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-xs cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>View e-Certificate</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Back */}
              <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-xs">
                <button
                  onClick={() => setActivePage('home')}
                  className="text-sky-700 font-semibold hover:underline"
                >
                  ← Back to Home
                </button>
                <button
                  onClick={handleLogout}
                  className="text-rose-600 font-semibold hover:underline"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* =========================================================================
              CLEAN LOGIN PAGE (NO SIGNUP - STRICTLY USER ID & PASSWORD)
             ========================================================================= */
          <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0F2B5C] via-[#143B7A] to-[#1E4D99] text-white p-7 text-center space-y-2">
              <div className="flex justify-center mb-1">
                <Logo lightText={true} />
              </div>
              <h1 className="text-2xl font-black font-heading text-white">
                Login Portal
              </h1>
              <p className="text-xs text-slate-200">
                Enter your User ID and password to access your account
              </p>
            </div>

            <div className="p-7 space-y-5">
              {/* Error Alert */}
              {errorMessage && (
                <div className="bg-rose-50 border-2 border-rose-300 text-rose-900 rounded-xl p-3.5 text-xs flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <strong className="block font-black text-rose-950">Access Denied</strong>
                    <p className="leading-relaxed">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* User ID Field */}
                <div>
                  <label className="block text-xs font-black text-slate-950 uppercase tracking-wider mb-1.5">
                    User ID
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. BSEL-STU-482910"
                      value={userId}
                      onChange={(e) => {
                        setUserId(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      className="w-full pl-10 pr-4 py-2.5 text-base sm:text-sm font-semibold text-slate-950 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-black text-slate-950 uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('To retrieve your password, please check the credentials generated upon Admission Enquiry or contact our desk at +91 98401 23456.')}
                      className="text-[11px] text-sky-800 hover:underline font-bold"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your generated password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      className="w-full pl-10 pr-10 py-2.5 text-base sm:text-sm font-semibold text-slate-950 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900 cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between text-xs text-slate-900 font-semibold pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-sky-600 focus:ring-sky-500"
                    />
                    <span>Remember User ID</span>
                  </label>
                  <span className="text-slate-700 text-[11px] font-bold">256-Bit SSL</span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-[#0F2B5C] hover:bg-[#18458F] text-white py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
                >
                  <span>Log In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* No account link */}
              {setActivePage && (
                <div className="text-center pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActivePage('contact')}
                    className="text-xs text-sky-800 hover:text-sky-950 font-bold hover:underline"
                  >
                    Don't have login credentials? Submit Admission Enquiry →
                  </button>
                </div>
              )}

              {/* Assistance Footnote */}
              <div className="text-center pt-2 text-xs text-slate-500 border-t border-slate-100">
                <span>Need assistance? Helpline: </span>
                <strong className="text-slate-700">+91 98401 23456</strong>
              </div>
            </div>
          </div>
        )}

        {/* Certificate Modal */}
        {selectedCertForModal && (
          <CertificateModal
            isOpen={true}
            initialData={selectedCertForModal}
            onClose={() => setSelectedCertForModal(null)}
          />
        )}
      </div>
    </div>
  );
}
