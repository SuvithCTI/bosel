import React, { useState, useEffect } from 'react';

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

import ProgramModal from './components/ProgramModal';
import EventRegisterModal from './components/EventRegisterModal';
import CertificateModal from './components/CertificateModal';
import LegalModal from './components/LegalModal';
import FloatingActions from './components/FloatingActions';

import {
  getActiveSession,
  clearActiveSession,
} from './utils/authStorage';

export default function App() {
  // -------------------------------------------------------
  // Active page
  // -------------------------------------------------------
  const [activePage, setActivePage] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);

      if (params.get('page')) {
        return params.get('page');
      }

      if (window.location.hash) {
        return window.location.hash.replace('#', '');
      }
    }

    return 'home';
  });

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

      return (
        activePage === 'login' &&
        Boolean(session) &&
        session.role !== 'Super Admin' &&
        session.role !== 'Branch Head'
      );
    });

  // Hide the global website layout only on the admin dashboard
  // or while the student dashboard itself is open.
  const hideGlobalLayout =
    activePage === 'admin' ||
    (activePage === 'login' && isStudentDashboardOpen);

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
      if (!session || session.role === 'Super Admin' || session.role === 'Branch Head') {
        setIsStudentDashboardOpen(false);
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
        centreName: 'test branch',
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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-amber-400 selection:text-slate-950">

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
            onStudentDashboardChange={handleStudentDashboardChange}
          />
        )}

        {/* Admin Dashboard */}
        {activePage === 'admin' && (
          <AdminDashboard
            setActivePage={setActivePage}
            onLogout={() => {
              clearActiveSession();

              setSessionUser(null);
              setIsStudentDashboardOpen(false);
              setActivePage('login');

              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              });
            }}
            onOpenCertificate={handleOpenCertificate}
          />
        )}
      </main>

      {/* Global Footer */}
      {!hideGlobalLayout && (
        <Footer
          setActivePage={setActivePage}
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