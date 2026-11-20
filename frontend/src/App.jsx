import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProgramsPage from './pages/ProgramsPage';
import EventsPage from './pages/EventsPage';
import AchievementsPage from './pages/AchievementsPage';
import FranchisePage from './pages/FranchisePage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import CertificatePage from './pages/CertificatePage';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/staff/StaffDashboard';
import FranchiseDashboard from './pages/franchise/FranchiseDashboard';

import ProgramModal from './components/ProgramModal';
import EventRegisterModal from './components/EventRegisterModal';
import CertificateModal from './components/CertificateModal';
import LegalModal from './components/LegalModal';
import FloatingActions from './components/FloatingActions';

import {
  getActiveSession,
  clearActiveSession,
} from './utils/authStorage';

// Helper to determine if an active session belongs to a student
const isStudentUser = (user) => {
  if (!user) return false;
  if (user.role === 'Super Admin' || user.role === 'Branch Head' || user.role === 'Staff' || user.role === 'Franchise' || user.role === 'School') return false;
  const uid = String(user.userId || user.id || '').toLowerCase();
  if (uid === 'admin' || uid === 'staff' || uid.startsWith('branch.') || uid.startsWith('sch-') || uid.startsWith('school')) return false;
  return true;
};

export default function App() {
  // -------------------------------------------------------
  // Active page
  // If a student is logged in, they are always restored to the student dashboard ('login')
  // -------------------------------------------------------
  const [activePage, setActivePageState] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlPage = params.get('page');

      // 1. Explicit ?page=... URL parameter always takes highest precedence
      if (urlPage) {
        return urlPage;
      }

      // If user directly opened or reloaded the root URL '/', default to 'home'
      if (window.location.pathname === '/' && !window.location.search && !window.location.hash) {
        return 'home';
      }

      const session = getActiveSession();

      // If a student account is currently active, default to student dashboard
      if (isStudentUser(session)) {
        return 'login';
      }

      if (session?.role === 'Staff') {
        return 'staff';
      }

      if (session?.role === 'Franchise' || session?.role === 'School') {
        return 'franchise_portal';
      }

      const savedPage = sessionStorage.getItem('bsel_current_page');
      if (savedPage && savedPage !== 'login') {
        return savedPage;
      }

      if (window.location.pathname.startsWith('/admin')) {
        return (session?.role === 'Super Admin' || session?.role === 'Branch Head') ? 'admin' : 'login';
      }

      if (window.location.pathname.startsWith('/staff')) {
        return session?.role === 'Staff' ? 'staff' : 'login';
      }

      if (window.location.pathname.startsWith('/franchise')) {
        return (session?.role === 'Franchise' || session?.role === 'School') ? 'franchise_portal' : 'login';
      }

      if (window.location.hash) {
        const cleanHash = window.location.hash.replace(/^#\/?/, '');
        if (cleanHash.startsWith('admin')) return (session?.role === 'Super Admin' || session?.role === 'Branch Head') ? 'admin' : 'login';
        if (cleanHash.startsWith('staff')) return session?.role === 'Staff' ? 'staff' : 'login';
        if (cleanHash.startsWith('franchise') || cleanHash.startsWith('school')) return (session?.role === 'Franchise' || session?.role === 'School') ? 'franchise_portal' : 'login';
        return cleanHash;
      }
    }

    return 'home';
  });

  // Navigation history stack for seamless Back button handling across the full website
  const [pageHistory, setPageHistory] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('bsel_page_history');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (_) {}
    }
    return ['home'];
  });

  const setActivePage = useCallback((nextPage, options = {}) => {
    const { replace = false } = options || {};

    setActivePageState((current) => {
      if (current === nextPage) return current;

      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        if (nextPage === 'home') {
          url.searchParams.delete('page');
        } else {
          url.searchParams.set('page', nextPage);
        }

        if (replace) {
          window.history.replaceState({ page: nextPage }, '', url.toString());
        } else {
          window.history.pushState({ page: nextPage }, '', url.toString());
        }

        setPageHistory((prev) => {
          const updated = replace ? [...prev.slice(0, -1), nextPage] : [...prev, nextPage];
          try {
            sessionStorage.setItem('bsel_page_history', JSON.stringify(updated.slice(-25)));
            sessionStorage.setItem('bsel_current_page', nextPage);
          } catch (_) {}
          return updated;
        });
      }

      return nextPage;
    });

    window.scrollTo(0, 0);
  }, []);

  const goBack = useCallback(() => {
    setPageHistory((prev) => {
      const session = getActiveSession();
      // Filter out any pages that the user is not authorized to see right now
      const isPageAllowed = (pg) => {
        if (pg === 'admin') return session && (session.role === 'Super Admin' || session.role === 'Branch Head');
        if (pg === 'staff') return session && session.role === 'Staff';
        if (pg === 'franchise_portal') return session && (session.role === 'Franchise' || session.role === 'School');
        return true;
      };

      if (prev.length > 1) {
        const nextStack = [...prev];
        nextStack.pop(); // remove current page

        // Find the last allowed page in history
        while (nextStack.length > 0 && !isPageAllowed(nextStack[nextStack.length - 1])) {
          nextStack.pop();
        }

        const targetPage = nextStack[nextStack.length - 1] || 'home';
        try {
          sessionStorage.setItem('bsel_page_history', JSON.stringify(nextStack));
          sessionStorage.setItem('bsel_current_page', targetPage);
        } catch (_) {}

        setActivePageState(targetPage);
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          if (targetPage === 'home') {
            url.searchParams.delete('page');
          } else {
            url.searchParams.set('page', targetPage);
          }
          window.history.pushState({ page: targetPage }, '', url.toString());
        }
        return nextStack.length > 0 ? nextStack : ['home'];
      } else {
        // Fallback to home
        setActivePageState('home');
        try {
          sessionStorage.setItem('bsel_current_page', 'home');
          sessionStorage.setItem('bsel_page_history', JSON.stringify(['home']));
        } catch (_) {}
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          url.searchParams.delete('page');
          window.history.pushState({ page: 'home' }, '', url.toString());
        }
        return ['home'];
      }
    });
    window.scrollTo(0, 0);
  }, []);

  // Synchronize browser forward/back buttons (popstate)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize history state on first mount if not present
    const params = new URLSearchParams(window.location.search);
    const currentPage = params.get('page') || activePage || 'home';
    const url = new URL(window.location.href);
    if (currentPage !== 'home') {
      url.searchParams.set('page', currentPage);
    } else {
      url.searchParams.delete('page');
    }
    window.history.replaceState({ page: currentPage }, '', url.toString());

    const handlePopState = (event) => {
      const pageFromState = event.state?.page;
      const searchParams = new URLSearchParams(window.location.search);
      const pageFromUrl = searchParams.get('page');
      const targetPage = pageFromState || pageFromUrl || 'home';

      setActivePageState(targetPage);
      setPageHistory((prev) => {
        if (prev.length > 1 && prev[prev.length - 2] === targetPage) {
          return prev.slice(0, -1);
        }
        return [...prev, targetPage];
      });
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [activePage]);

  // Track activePage in sessionStorage so refresh maintains the current view
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('bsel_current_page', activePage);
    }
  }, [activePage]);

  // -------------------------------------------------------
  // Authentication session
  // -------------------------------------------------------
  const [sessionUser, setSessionUser] = useState(() =>
    getActiveSession()
  );

  // -------------------------------------------------------
  // Student dashboard visibility
  // Updated by LoginPage.jsx
  // -------------------------------------------------------
  const [isStudentDashboardOpen, setIsStudentDashboardOpen] =
    useState(() => {
      const session = getActiveSession();
      return isStudentUser(session);
    });

  // Hide the global website layout on the admin dashboard,
  // staff dashboard, franchise dashboard, or on the login page (including student dashboard).
  const hideGlobalLayout =
    activePage === 'admin' ||
    activePage === 'staff' ||
    activePage === 'franchise_portal' ||
    activePage === 'login';

  // -------------------------------------------------------
  // Modal states
  // -------------------------------------------------------
  const [selectedProgram, setSelectedProgram] = useState(null);

  const [selectedEventForRegister, setSelectedEventForRegister] =
    useState(null);

  const [activeCertificateData, setActiveCertificateData] =
    useState(null);

  const [legalModalTab, setLegalModalTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);

      const page =
        params.get('page') ||
        window.location.hash.replace('#', '');

      if (page === 'privacy' || page === 'terms') {
        return page;
      }
    }

    return null;
  });

  // -------------------------------------------------------
  // Handle Privacy Policy and Terms pages
  // -------------------------------------------------------
  useEffect(() => {
    if (activePage === 'privacy') {
      setLegalModalTab('privacy');
      setActivePage('home');
    } else if (activePage === 'terms') {
      setLegalModalTab('terms');
      setActivePage('home');
    }
  }, [activePage]);

  // -------------------------------------------------------
  // Synchronize authentication changes
  // -------------------------------------------------------
  useEffect(() => {
    const handleSessionChange = () => {
      const session = getActiveSession();

      setSessionUser(session);

      // If the student session is cleared, restore the public layout.
      if (!isStudentUser(session)) {
        setIsStudentDashboardOpen(false);
      } else {
        // If a student session is activated, ensure dashboard opens immediately
        setIsStudentDashboardOpen(true);
        setActivePage('login');
      }
    };

    window.addEventListener(
      'bsel_session_changed',
      handleSessionChange
    );

    return () => {
      window.removeEventListener(
        'bsel_session_changed',
        handleSessionChange
      );
    };
  }, []);

  // -------------------------------------------------------
  // Route Guard: Protect authenticated dashboard pages
  // -------------------------------------------------------
  useEffect(() => {
    const session = getActiveSession();
    if (activePage === 'admin') {
      if (!session || (session.role !== 'Super Admin' && session.role !== 'Branch Head')) {
        setActivePage('login');
      }
    } else if (activePage === 'staff') {
      if (!session || session.role !== 'Staff') {
        setActivePage('login');
      }
    } else if (activePage === 'franchise_portal') {
      if (!session || (session.role !== 'Franchise' && session.role !== 'School')) {
        setActivePage('login');
      }
    }
  }, [activePage, sessionUser, setActivePage]);

  // -------------------------------------------------------
  // Universal Dashboard Sign Out Handler
  // -------------------------------------------------------
  const handleDashboardLogout = useCallback(() => {
    clearActiveSession();

    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('bsel_active_admin_role');
      sessionStorage.removeItem('bsel_active_branch');
      sessionStorage.removeItem('bsel_current_page');
      if (window.location.hash && (window.location.hash.includes('admin') || window.location.hash.includes('staff') || window.location.hash.includes('franchise') || window.location.hash.includes('school'))) {
        try {
          window.history.replaceState(null, '', window.location.pathname.replace(/\/admin|\/staff|\/franchise/gi, '') || '/');
        } catch (_) {}
      }
    }

    setSessionUser(null);
    setIsStudentDashboardOpen(false);
    setActivePage('login');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [setActivePage]);

  // -------------------------------------------------------
  // Program selection
  // -------------------------------------------------------
  const handleSelectProgram = (program) => {
    setSelectedProgram(program);
  };

  // -------------------------------------------------------
  // Event registration
  // -------------------------------------------------------
  const handleRegisterEvent = (event) => {
    setSelectedEventForRegister(event);
  };

  // -------------------------------------------------------
  // Open certificate modal
  // -------------------------------------------------------
  const handleOpenCertificate = (data) => {
    let studentData = data;

    if (
      (!studentData || !studentData.studentName) &&
      typeof window !== 'undefined'
    ) {
      try {
        const saved = localStorage.getItem(
          'bsel_registered_student'
        );

        if (saved) {
          studentData = JSON.parse(saved);
        }
      } catch {
        // Ignore invalid saved data.
      }
    }

    setActiveCertificateData(
      studentData || {
        studentName: '',
        courseName: 'Abacus',
        level: 'Level 1',
        grade: 'A',
        duration: '6 Months',
        registrationNo: 'AB27-001',
        certificateNo: 'BSEL/ABACUS/L1/0007',
        centreName: 'Tenkasi Branch',
        centreCode: '546454',
        centreAddress:
          'second street, surandai,keelasurandai,tenkasi',
        issueDate: '05-10-2026',
        certificateType: 'COMPETITION',
      }
    );
  };

  // -------------------------------------------------------
  // Handle student dashboard visibility
  // -------------------------------------------------------
  const handleStudentDashboardChange = (isOpen) => {
    setIsStudentDashboardOpen(Boolean(isOpen));
  };

  // -------------------------------------------------------
  // Main application layout
  // -------------------------------------------------------
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-amber-400 selection:text-slate-950 overflow-x-hidden">

      {/* Global Navbar */}
      {!hideGlobalLayout && (
        <Navbar
          activePage={activePage}
          setActivePage={setActivePage}
          sessionUser={sessionUser}
        />
      )}

      {/* Main Content */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            setActivePage={setActivePage}
            onSelectProgram={handleSelectProgram}
            onRegisterEvent={handleRegisterEvent}
          />
        )}

        {activePage === 'about' && (
          <AboutPage setActivePage={setActivePage} />
        )}

        {activePage === 'programs' && (
          <ProgramsPage setActivePage={setActivePage} />
        )}

        {activePage === 'events' && (
          <EventsPage onRegisterEvent={handleRegisterEvent} />
        )}

        {activePage === 'achievements' && (
          <AchievementsPage setActivePage={setActivePage} />
        )}

        {activePage === 'franchise' && (
          <FranchisePage setActivePage={setActivePage} />
        )}

        {activePage === 'certificate' && (
          <CertificatePage />
        )}

        {activePage === 'contact' && (
          <ContactPage setActivePage={setActivePage} />
        )}

        {/* Login Page / Student Dashboard */}
        {activePage === 'login' && (
          <LoginPage
            setActivePage={setActivePage}
            onBack={goBack}
            goBack={goBack}
            onStudentDashboardChange={handleStudentDashboardChange}
          />
        )}

        {/* Admin Dashboard */}
        {activePage === 'admin' && (
          <AdminDashboard
            setActivePage={setActivePage}
            onBack={goBack}
            goBack={goBack}
            onLogout={handleDashboardLogout}
            onOpenCertificate={handleOpenCertificate}
          />
        )}

        {/* Staff Dashboard */}
        {activePage === 'staff' && (
          <StaffDashboard
            setActivePage={setActivePage}
            onBack={goBack}
            goBack={goBack}
            sessionUser={sessionUser}
            onLogout={handleDashboardLogout}
            onOpenCertificate={handleOpenCertificate}
          />
        )}

        {/* Franchise Dashboard */}
        {activePage === 'franchise_portal' && (
          <FranchiseDashboard
            setActivePage={setActivePage}
            onBack={goBack}
            goBack={goBack}
            sessionUser={sessionUser}
            onLogout={handleDashboardLogout}
            onOpenCertificate={handleOpenCertificate}
          />
        )}
      </main>

      {/* Global Footer */}
      {!hideGlobalLayout && (
        <Footer
          setActivePage={setActivePage}
          handleNav={setActivePage}
          onOpenLegal={(tab) => setLegalModalTab(tab)}
        />
      )}

      {/* Floating Action Buttons */}
      {!hideGlobalLayout && (
        <FloatingActions setActivePage={setActivePage} />
      )}

      {/* Legal Documentation Modal */}
      <LegalModal
        isOpen={Boolean(legalModalTab)}
        initialTab={legalModalTab || 'privacy'}
        onClose={() => setLegalModalTab(null)}
      />

      {/* Program Details Modal */}
      {selectedProgram && (
        <ProgramModal
          program={selectedProgram}
          onClose={() => setSelectedProgram(null)}
        />
      )}

      {/* Event Registration Modal */}
      {selectedEventForRegister && (
        <EventRegisterModal
          event={selectedEventForRegister}
          onClose={() => setSelectedEventForRegister(null)}
        />
      )}

      {/* Standalone Certificate Modal */}
      {activeCertificateData && (
        <CertificateModal
          isOpen={true}
          initialData={activeCertificateData}
          onClose={() => setActiveCertificateData(null)}
        />
      )}
    </div>
  );
}