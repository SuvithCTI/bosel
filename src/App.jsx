import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProgramsPage from './pages/ProgramsPage';
import EventsPage from './pages/EventsPage';
import AchievementsPage from './pages/AchievementsPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import CertificatePage from './pages/CertificatePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import AdminDashboard from './pages/AdminDashboard';
import ProgramModal from './components/ProgramModal';
import EventRegisterModal from './components/EventRegisterModal';
import CertificateModal from './components/CertificateModal';
import FloatingActions from './components/FloatingActions';
import { getActiveSession, clearActiveSession } from './utils/authStorage';

export default function App() {
  const [activePage, setActivePage] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('page')) return params.get('page');
      if (window.location.hash) return window.location.hash.replace('#', '');
    }
    return 'home';
  });
  const [sessionUser, setSessionUser] = useState(() => getActiveSession());
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedEventForRegister, setSelectedEventForRegister] = useState(null);
  const [activeCertificateData, setActiveCertificateData] = useState(null);

  useEffect(() => {
    const handleSessionChange = () => {
      setSessionUser(getActiveSession());
    };
    window.addEventListener('bsel_session_changed', handleSessionChange);
    return () => window.removeEventListener('bsel_session_changed', handleSessionChange);
  }, []);

  const handleSelectProgram = (program) => {
    setSelectedProgram(program);
  };

  const handleRegisterEvent = (event) => {
    setSelectedEventForRegister(event);
  };

  const handleOpenCertificate = (data) => {
    let studentData = data;
    if ((!studentData || !studentData.studentName) && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('bsel_registered_student');
        if (saved) {
          studentData = JSON.parse(saved);
        }
      } catch {
        // ignore
      }
    }

    setActiveCertificateData(studentData || {
      studentName: '',
      courseName: 'Abacus',
      level: 'Level 1',
      grade: 'A',
      duration: '6 Months',
      registrationNo: 'BSEL-REG-849201',
      certificateNo: 'BSEL/ABACUS/L1/0007',
      centreName: 'test branch',
      centreCode: '546454',
      centreAddress: 'second street, surandai,keelasurandai,tenkasi',
      issueDate: '05-10-2026',
      certificateType: 'COMPETITION'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Global Navigation Bar (Hidden when inside Admin Dashboard) */}
      {activePage !== 'admin' && (
        <Navbar 
          activePage={activePage} 
          setActivePage={setActivePage} 
          sessionUser={sessionUser}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage 
            setActivePage={setActivePage}
            onSelectProgram={handleSelectProgram}
            onRegisterEvent={handleRegisterEvent}
          />
        )}

        {activePage === 'about' && (
          <AboutPage />
        )}

        {activePage === 'programs' && (
          <ProgramsPage />
        )}

        {activePage === 'events' && (
          <EventsPage 
            onRegisterEvent={handleRegisterEvent}
          />
        )}

        {activePage === 'achievements' && (
          <AchievementsPage />
        )}

        {activePage === 'certificate' && (
          <CertificatePage />
        )}

        {activePage === 'contact' && (
          <ContactPage setActivePage={setActivePage} />
        )}

        {activePage === 'login' && (
          <LoginPage setActivePage={setActivePage} />
        )}

        {activePage === 'privacy' && (
          <PrivacyPolicyPage setActivePage={setActivePage} />
        )}

        {activePage === 'terms' && (
          <TermsPage setActivePage={setActivePage} />
        )}

        {activePage === 'admin' && (
          <AdminDashboard 
            setActivePage={setActivePage} 
            onLogout={() => {
              clearActiveSession();
              setActivePage('login');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenCertificate={handleOpenCertificate}
          />
        )}
      </main>

      {/* Global Footer (Hidden when inside Admin Dashboard) */}
      {activePage !== 'admin' && (
        <Footer setActivePage={setActivePage} />
      )}

      {/* Floating Action Buttons: WhatsApp & Franchise Enquiry (Bottom Right) */}
      {activePage !== 'admin' && (
        <FloatingActions setActivePage={setActivePage} />
      )}

      {/* Program Details Modal */}
      {selectedProgram && (
        <ProgramModal
          program={selectedProgram}
          onClose={() => setSelectedProgram(null)}
        />
      )}

      {/* Event Registration & Hall Ticket / Certificate Modal */}
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
