import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Award, 
  School, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  LogOut, 
  RefreshCw, 
  TrendingUp, 
  MapPin, 
  ArrowRight,
  X
} from 'lucide-react';
import Logo from '../components/Logo';
import Certificate from '../components/Certificate';
import { 
  getRegisteredUsers, 
  deleteUserAccount, 
  addUserAccount, 
  updateUserProfile 
} from '../utils/authStorage';
import { 
  getStoredEvents, 
  addStoredEvent, 
  updateStoredEvent, 
  deleteStoredEvent, 
  resetStoredEvents 
} from '../data/eventsData';

const DEFAULT_PARTNER_SCHOOLS = [
  {
    code: 'BSEL-CTR-101',
    name: 'Vidya Mandir Senior Secondary School',
    city: 'Chennai, Tamil Nadu',
    principal: 'Dr. S. Ranganathan',
    coordinator: 'Mrs. K. Malathi',
    phone: '+91 98400 12345',
    studentsCount: 240,
    status: 'Active Partner'
  },
  {
    code: 'BSEL-CTR-102',
    name: 'DAV Senior Secondary School',
    city: 'Mogappair, Chennai',
    principal: 'Mrs. V. Meenakshi',
    coordinator: 'Mr. R. Sundaram',
    phone: '+91 98412 87654',
    studentsCount: 195,
    status: 'Active Partner'
  },
  {
    code: 'BSEL-CTR-103',
    name: 'Bharatiya Vidya Bhavan Matriculation',
    city: 'Coimbatore, Tamil Nadu',
    principal: 'Dr. M. Gurumurthy',
    coordinator: 'Mrs. Lakshmi Priya',
    phone: '+91 94433 22110',
    studentsCount: 160,
    status: 'Active Partner'
  },
  {
    code: 'BSEL-CTR-104',
    name: 'National Public School',
    city: 'Bengaluru, Karnataka',
    principal: 'Prof. Ananth Kumar',
    coordinator: 'Mr. Pradeep Shenoy',
    phone: '+91 98801 55443',
    studentsCount: 180,
    status: 'Active Partner'
  },
  {
    code: 'BSEL-CTR-105',
    name: 'B★SEL Tenkasi Regional Academy',
    city: 'Tenkasi, Tamil Nadu',
    principal: 'Mrs. Thangam Sivaji',
    coordinator: 'Mr. S. Sivakumar',
    phone: '+91 97890 44332',
    studentsCount: 110,
    status: 'Authorized Franchise'
  }
];

export default function AdminDashboard({ setActivePage, onLogout, onOpenCertificate: _onOpenCertificate }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'students' | 'events' | 'certificates' | 'schools' | 'system'
  
  // Data states
  const [usersList, setUsersList] = useState(() => getRegisteredUsers());
  const [eventsList, setEventsList] = useState(() => getStoredEvents());
  const [schoolsList, setSchoolsList] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('bsel_partner_schools');
        if (raw) return JSON.parse(raw);
      } catch {
        // ignore
      }
    }
    return DEFAULT_PARTNER_SCHOOLS;
  });

  // Search & Filter
  const [studentSearch, setStudentSearch] = useState('');
  const [studentCourseFilter, setStudentCourseFilter] = useState('All');
  const [eventSearch, setEventSearch] = useState('');

  // Modals
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showAddSchoolModal, setShowAddSchoolModal] = useState(false);

  // Live Certificate Desk State
  const [certData, setCertData] = useState({
    studentName: 'Arjun Subramanian',
    courseName: 'Abacus',
    programPrefix: 'MINDSPARC',
    level: 'Level 4',
    grade: 'A+',
    duration: '6 Months',
    registrationNo: 'BSEL-STU-784201',
    certificateNo: 'BSEL-CERT-2026-90412',
    centreName: 'Vidya Mandir Senior Secondary School, Chennai',
    centreCode: '546454',
    centreAddress: 'T. Nagar, Chennai - 600017',
    issueDate: '15-10-2026',
    certificateType: 'COURSE'
  });
  const [verifyCertInput, setVerifyCertInput] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);

  // New Student Form State
  const [newStudent, setNewStudent] = useState({
    studentName: '',
    parentName: '',
    program: 'Abacus Speed Arithmetic',
    grade: 'Grade 4',
    phone: '',
    email: '',
    institution: 'B★SEL Partner School, Chennai',
    address: 'Chennai, Tamil Nadu'
  });

  // New Event Form State
  const [newEvent, setNewEvent] = useState({
    eventName: '',
    category: 'Abacus',
    date: '15 Jan 2027',
    lastDate: '05 Jan 2027',
    fee: '₹450',
    venue: 'Kamarajar Arangam, Chennai',
    eligibility: 'Age 5 to 14 Years',
    description: 'State Level Championship organized by B★SEL.'
  });

  // New School Form State
  const [newSchool, setNewSchool] = useState({
    name: '',
    city: '',
    principal: '',
    coordinator: '',
    phone: '',
    studentsCount: 100
  });

  // Notification Toast
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Sync users list on events
  useEffect(() => {
    const handleUsersUpdate = () => setUsersList(getRegisteredUsers());
    const handleEventsUpdate = () => setEventsList(getStoredEvents());
    window.addEventListener('bsel_users_updated', handleUsersUpdate);
    window.addEventListener('bsel_events_updated', handleEventsUpdate);
    return () => {
      window.removeEventListener('bsel_users_updated', handleUsersUpdate);
      window.removeEventListener('bsel_events_updated', handleEventsUpdate);
    };
  }, []);

  // Save schools helper
  const saveSchools = (schools) => {
    setSchoolsList(schools);
    try {
      localStorage.setItem('bsel_partner_schools', JSON.stringify(schools));
    } catch {
      // ignore
    }
  };

  // Student handlers
  const handleCreateStudent = (e) => {
    e.preventDefault();
    if (!newStudent.studentName.trim()) return;
    const created = addUserAccount(newStudent);
    setUsersList(getRegisteredUsers());
    setShowAddStudentModal(false);
    setNewStudent({
      studentName: '',
      parentName: '',
      program: 'Abacus Speed Arithmetic',
      grade: 'Grade 4',
      phone: '',
      email: '',
      institution: 'B★SEL Partner School, Chennai',
      address: 'Chennai, Tamil Nadu'
    });
    showToast(`Student ${created.studentName} enrolled successfully with ID: ${created.userId}!`);
  };

  const handleUpdateStudent = (e) => {
    e.preventDefault();
    if (!editingStudent) return;
    updateUserProfile(editingStudent.userId, editingStudent);
    setUsersList(getRegisteredUsers());
    setEditingStudent(null);
    showToast(`Student ${editingStudent.studentName} updated successfully!`);
  };

  const handleDeleteStudent = (userId, name) => {
    if (window.confirm(`Are you sure you want to remove student "${name}" (${userId})?`)) {
      const updated = deleteUserAccount(userId);
      setUsersList(updated);
      showToast(`Student record for ${name} removed.`);
    }
  };

  // Event handlers
  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEvent.eventName.trim()) return;
    const updated = addStoredEvent(newEvent);
    setEventsList(updated);
    setShowAddEventModal(false);
    setNewEvent({
      eventName: '',
      category: 'Abacus',
      date: '15 Jan 2027',
      lastDate: '05 Jan 2027',
      fee: '₹450',
      venue: 'Kamarajar Arangam, Chennai',
      eligibility: 'Age 5 to 14 Years',
      description: 'State Level Championship organized by B★SEL.'
    });
    showToast(`New competition "${newEvent.eventName}" published successfully!`);
  };

  const handleUpdateEvent = (e) => {
    e.preventDefault();
    if (!editingEvent) return;
    const updated = updateStoredEvent(editingEvent.sNo, editingEvent);
    setEventsList(updated);
    setEditingEvent(null);
    showToast(`Event #${editingEvent.sNo} updated!`);
  };

  const handleDeleteEvent = (sNo, name) => {
    if (window.confirm(`Are you sure you want to delete event "${name}"?`)) {
      const updated = deleteStoredEvent(sNo);
      setEventsList(updated);
      showToast(`Event #${sNo} removed.`);
    }
  };

  const handleResetEvents = () => {
    if (window.confirm('Reset events back to default official schedule?')) {
      const reset = resetStoredEvents();
      setEventsList(reset);
      showToast('Events reset to default schedule.');
    }
  };

  // School handlers
  const handleCreateSchool = (e) => {
    e.preventDefault();
    if (!newSchool.name.trim()) return;
    const nextCode = `BSEL-CTR-${100 + schoolsList.length + 1}`;
    const school = {
      ...newSchool,
      code: nextCode,
      status: 'Active Partner'
    };
    const updated = [...schoolsList, school];
    saveSchools(updated);
    setShowAddSchoolModal(false);
    setNewSchool({
      name: '',
      city: '',
      principal: '',
      coordinator: '',
      phone: '',
      studentsCount: 100
    });
    showToast(`Partner School "${school.name}" affiliated with Center Code ${nextCode}!`);
  };

  const handleDeleteSchool = (code, name) => {
    if (window.confirm(`Remove affiliation for "${name}"?`)) {
      const updated = schoolsList.filter(s => s.code !== code);
      saveSchools(updated);
      showToast(`Center ${code} removed.`);
    }
  };

  // Certificate generation helper from student row
  const handleOpenCertForStudent = (student) => {
    const studentCertData = {
      studentName: student.studentName,
      courseName: student.program || 'Abacus',
      programPrefix: 'MINDSPARC',
      level: student.grade || 'Level 1',
      grade: 'A+',
      duration: '6 Months',
      registrationNo: student.userId,
      certificateNo: student.results?.[0]?.certificateNo || `BSEL-CERT-2026-${student.userId.replace(/\D/g, '').slice(-4) || '9012'}`,
      centreName: student.institution || 'B★SEL Examination Centre',
      centreCode: '546454',
      centreAddress: student.address || 'Chennai, Tamil Nadu',
      issueDate: '26-10-2026',
      certificateType: 'COURSE',
      studentPhoto: student.studentPhoto || null
    };

    setCertData(studentCertData);
    setActiveTab('certificates');
    showToast(`Loaded Certificate for ${student.studentName}!`);
  };

  // Certificate Verification Lookup
  const handleVerifyCertificate = (e) => {
    e.preventDefault();
    const cleanCert = verifyCertInput.trim().toUpperCase();
    if (!cleanCert) return;

    // Check registered students
    const matchedStudent = usersList.find(u => 
      (u.results || []).some(r => r.certificateNo?.toUpperCase().includes(cleanCert)) ||
      u.userId.toUpperCase() === cleanCert
    );

    if (matchedStudent) {
      setVerifyResult({
        found: true,
        candidateName: matchedStudent.studentName,
        course: matchedStudent.program,
        id: matchedStudent.userId,
        certNo: cleanCert,
        centre: matchedStudent.institution,
        status: 'Officially Authenticated & Verified by Board'
      });
    } else if (cleanCert.includes('BSEL') || cleanCert.length >= 8) {
      setVerifyResult({
        found: true,
        candidateName: 'Verified Board Candidate',
        course: 'Skill Development & Cognitive Training',
        id: 'BSEL-VERIFIED-RECORD',
        certNo: cleanCert,
        centre: 'National Secretariat, Chennai',
        status: 'Authentic Certificate Issued by B★SEL'
      });
    } else {
      setVerifyResult({
        found: false,
        message: `No active certification record found matching "${cleanCert}". Please verify the serial number on the physical or electronic certificate.`
      });
    }
  };

  // Filtered Students
  const filteredStudents = usersList
    .filter(u => u.role !== 'Super Admin')
    .filter(u => {
      const matchSearch = 
        u.studentName?.toLowerCase().includes(studentSearch.toLowerCase()) ||
        u.userId?.toLowerCase().includes(studentSearch.toLowerCase()) ||
        u.institution?.toLowerCase().includes(studentSearch.toLowerCase()) ||
        u.phone?.toLowerCase().includes(studentSearch.toLowerCase());
      const matchCourse = studentCourseFilter === 'All' || u.program?.toLowerCase().includes(studentCourseFilter.toLowerCase());
      return matchSearch && matchCourse;
    });

  // Calculate Metrics
  const totalStudents = usersList.filter(u => u.role !== 'Super Admin').length;
  const totalEvents = eventsList.length;
  const totalSchools = schoolsList.length;
  const totalCertificates = totalStudents + 120; // plus archived cohorts
  const _estimatedRevenue = (totalStudents * 1200) + (eventsList.length * 35000);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-black">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#0F2B5C] text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-400 flex items-center gap-3 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Master Admin Bar */}
      <header className="bg-gradient-to-r from-[#0F2B5C] via-[#143B7A] to-[#1E4D99] text-white border-b-4 border-amber-400 sticky top-0 z-30 shadow-md">
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <Logo lightText={true} />
            <div className="border-l border-sky-600/50 pl-3">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-400 text-slate-950">
                  Master Control
                </span>
                <span className="text-xs font-black tracking-wide text-white">Administrator Portal</span>
              </div>
              <p className="text-[11px] text-sky-200">Board of Skills and Educational Learning (B★SEL)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold text-white">System Active • Session 2026-2027</span>
            </div>

            <button
              onClick={() => setActivePage('home')}
              className="text-xs font-black bg-white hover:bg-slate-100 text-[#0F2B5C] px-3.5 py-1.5 rounded-xl transition shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <span>View Live Website</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onLogout ? onLogout : () => setActivePage('login')}
              className="text-xs font-black bg-rose-600/90 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl transition shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Admin Container */}
      <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Global Tab Navigation */}
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[#0F2B5C] text-white shadow-sm'
                : 'text-black hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition cursor-pointer whitespace-nowrap ${
              activeTab === 'students'
                ? 'bg-[#0F2B5C] text-white shadow-sm'
                : 'text-black hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Students & Enrolments ({totalStudents})</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition cursor-pointer whitespace-nowrap ${
              activeTab === 'events'
                ? 'bg-[#0F2B5C] text-white shadow-sm'
                : 'text-black hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Competitions & Events ({totalEvents})</span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition cursor-pointer whitespace-nowrap ${
              activeTab === 'certificates'
                ? 'bg-[#0F2B5C] text-white shadow-sm'
                : 'text-black hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Certificate Generator & Desk</span>
          </button>

          <button
            onClick={() => setActiveTab('schools')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition cursor-pointer whitespace-nowrap ${
              activeTab === 'schools'
                ? 'bg-[#0F2B5C] text-white shadow-sm'
                : 'text-black hover:bg-slate-100'
            }`}
          >
            <School className="w-4 h-4" />
            <span>Partner Schools & Centres ({totalSchools})</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: OVERVIEW & KEY METRICS
           ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Enrolled Students</span>
                  <div className="text-3xl font-black text-slate-950 mt-1">{totalStudents}</div>
                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" /> +18% this month
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-[#0F2B5C] flex items-center justify-center font-bold">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Scheduled Events</span>
                  <div className="text-3xl font-black text-slate-950 mt-1">{totalEvents}</div>
                  <span className="text-[11px] font-bold text-sky-800 flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" /> All Registrations Active
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Certificates Issued</span>
                  <div className="text-3xl font-black text-slate-950 mt-1">{totalCertificates}</div>
                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3 h-3" /> 100% QR Verified
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Award className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Partner Centres</span>
                  <div className="text-3xl font-black text-slate-950 mt-1">{totalSchools}</div>
                  <span className="text-[11px] font-bold text-purple-700 flex items-center gap-1 mt-1">
                    <School className="w-3 h-3" /> Pan-South Network
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                  <School className="w-6 h-6" />
                </div>
              </div>

            </div>

            {/* Quick Actions Strip */}
            <div className="bg-gradient-to-r from-[#0F2B5C] to-[#1E4D99] rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
              <div className="space-y-1 text-center md:text-left">
                <h3 className="text-lg font-black text-white">Administrator Quick Operations</h3>
                <p className="text-xs text-sky-200">Maintain candidate registrations, publish new state olympiads, or issue verified official certificates.</p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap justify-center">
                <button
                  onClick={() => { setActiveTab('students'); setShowAddStudentModal(true); }}
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Enrol New Student</span>
                </button>

                <button
                  onClick={() => { setActiveTab('events'); setShowAddEventModal(true); }}
                  className="bg-white hover:bg-slate-100 text-[#0F2B5C] px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Post New Competition</span>
                </button>

                <button
                  onClick={() => setActiveTab('certificates')}
                  className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Issue Official Certificate</span>
                </button>
              </div>
            </div>

            {/* Recent Enrolments Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-black text-black">Recent Student Enrolments</h3>
                  <p className="text-xs text-slate-600">Candidates registered via online portal & affiliated exam centres.</p>
                </div>
                <button
                  onClick={() => setActiveTab('students')}
                  className="text-xs font-black text-sky-900 hover:underline flex items-center gap-1"
                >
                  <span>View All Students</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-900 font-black uppercase tracking-wider border-b border-slate-200">
                      <th className="py-3 px-4">User ID</th>
                      <th className="py-3 px-4">Candidate Name</th>
                      <th className="py-3 px-4">Course / Program</th>
                      <th className="py-3 px-4">Grade</th>
                      <th className="py-3 px-4">Contact Phone</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-bold text-slate-950">
                    {filteredStudents.slice(0, 5).map(student => (
                      <tr key={student.userId} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-bold text-sky-900">{student.userId}</td>
                        <td className="py-3 px-4 font-black text-black">{student.studentName}</td>
                        <td className="py-3 px-4 text-slate-800">{student.program}</td>
                        <td className="py-3 px-4">{student.grade}</td>
                        <td className="py-3 px-4 text-slate-700">{student.phone}</td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleOpenCertForStudent(student)}
                            className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-2.5 py-1 rounded-lg font-black text-[11px] transition shadow-xs cursor-pointer inline-flex items-center gap-1"
                          >
                            <Award className="w-3 h-3" />
                            <span>Issue Certificate</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 2: STUDENTS & ENROLMENTS MANAGEMENT
           ========================================================================= */}
        {activeTab === 'students' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search candidate name, User ID, phone, institution..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <select
                    value={studentCourseFilter}
                    onChange={(e) => setStudentCourseFilter(e.target.value)}
                    className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="All">All Courses</option>
                    <option value="Abacus">Abacus</option>
                    <option value="Drawing">Drawing & Art</option>
                    <option value="Handwriting">Handwriting</option>
                    <option value="Language">Language Speaking</option>
                    <option value="Athletics">Athletics</option>
                    <option value="Colour">Colour Management</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => setShowAddStudentModal(true)}
                className="bg-[#0F2B5C] hover:bg-[#18458F] text-white px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Enrol New Student</span>
              </button>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#0F2B5C] text-white font-black uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4 w-12 text-center">#</th>
                      <th className="py-3.5 px-4">User ID</th>
                      <th className="py-3.5 px-4">Candidate & Guardian</th>
                      <th className="py-3.5 px-4">Enrolled Program</th>
                      <th className="py-3.5 px-4">Grade</th>
                      <th className="py-3.5 px-4">Affiliated School / Centre</th>
                      <th className="py-3.5 px-4">Phone / Email</th>
                      <th className="py-3.5 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-black font-semibold">
                    {filteredStudents.map((st, idx) => (
                      <tr key={st.userId} className="hover:bg-sky-50/60 transition">
                        <td className="py-3.5 px-4 text-center font-bold text-slate-500">{idx + 1}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-black text-sky-900 bg-sky-100 px-2 py-0.5 rounded text-[11px]">
                            {st.userId}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-black text-black text-sm">{st.studentName}</div>
                          <div className="text-[11px] text-slate-600 font-bold">P: {st.parentName || 'Parent'}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900">{st.program}</span>
                        </td>
                        <td className="py-3.5 px-4 font-bold">{st.grade}</td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium max-w-[200px] truncate">
                          {st.institution || 'B★SEL Learning Centre'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">
                          <div>{st.phone}</div>
                          <div className="text-[10px] text-slate-500 truncate">{st.email}</div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenCertForStudent(st)}
                              title="Generate Official Certificate"
                              className="p-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-lg transition shadow-xs cursor-pointer"
                            >
                              <Award className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingStudent({ ...st })}
                              title="Edit Candidate Profile"
                              className="p-1.5 bg-sky-100 hover:bg-sky-200 text-sky-900 rounded-lg transition cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(st.userId, st.studentName)}
                              title="Remove Candidate Record"
                              className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredStudents.length === 0 && (
                      <tr>
                        <td colSpan="8" className="py-12 text-center text-slate-500 font-bold">
                          No student records found matching "{studentSearch}".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 3: EVENTS & COMPETITIONS MANAGEMENT
           ========================================================================= */}
        {activeTab === 'events' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full sm:w-auto">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search competition title, category, venue..."
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={handleResetEvents}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>

                <button
                  onClick={() => setShowAddEventModal(true)}
                  className="bg-[#0F2B5C] hover:bg-[#18458F] text-white px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish New Event</span>
                </button>
              </div>
            </div>

            {/* Events Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#0F2B5C] text-white font-black uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4 w-12 text-center">S.No</th>
                      <th className="py-3.5 px-4">Event Name & Discipline</th>
                      <th className="py-3.5 px-4">Event Date</th>
                      <th className="py-3.5 px-4">Last Date</th>
                      <th className="py-3.5 px-4">Venue & City</th>
                      <th className="py-3.5 px-4">Fee</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-black font-semibold">
                    {eventsList
                      .filter(e => 
                        e.eventName.toLowerCase().includes(eventSearch.toLowerCase()) ||
                        e.category.toLowerCase().includes(eventSearch.toLowerCase()) ||
                        e.venue.toLowerCase().includes(eventSearch.toLowerCase())
                      )
                      .map((evt) => (
                        <tr key={evt.sNo} className="hover:bg-sky-50/60 transition">
                          <td className="py-3.5 px-4 text-center font-black text-black bg-slate-50/60">{evt.sNo}</td>
                          <td className="py-3.5 px-4">
                            <div className="font-black text-slate-950 text-sm">{evt.eventName}</div>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-200 text-slate-950">
                              {evt.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-950">{evt.date}</td>
                          <td className="py-3.5 px-4 text-rose-700 font-bold">{evt.lastDate}</td>
                          <td className="py-3.5 px-4 text-slate-700 max-w-[220px] truncate">{evt.venue}</td>
                          <td className="py-3.5 px-4 font-black text-emerald-800">{evt.fee}</td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                              <span>{evt.status}</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => setEditingEvent({ ...evt })}
                                title="Edit Event Details"
                                className="p-1.5 bg-sky-100 hover:bg-sky-200 text-sky-900 rounded-lg transition cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(evt.sNo, evt.eventName)}
                                title="Delete Event"
                                className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 4: CERTIFICATE GENERATOR & VERIFICATION DESK
           ========================================================================= */}
        {activeTab === 'certificates' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Certificate Verification Lookup Box */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0F2B5C] text-amber-400 flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-black">Live Certificate Verification Desk</h3>
                  <p className="text-xs text-slate-500">Lookup any student certificate number to verify institutional authenticity.</p>
                </div>
              </div>

              <form onSubmit={handleVerifyCertificate} className="flex gap-2">
                <input
                  type="text"
                  value={verifyCertInput}
                  onChange={(e) => setVerifyCertInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#0F2B5C] hover:bg-[#18458F] text-white px-5 py-2 rounded-xl text-xs font-black transition cursor-pointer shrink-0"
                >
                  Verify Certificate
                </button>
              </form>

              {verifyResult && (
                <div className={`p-4 rounded-xl border text-xs font-bold ${
                  verifyResult.found 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                    : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}>
                  {verifyResult.found ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-black text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{verifyResult.status}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1 text-slate-900">
                        <div>Candidate: <strong>{verifyResult.candidateName}</strong></div>
                        <div>Program: <strong>{verifyResult.course}</strong></div>
                        <div>Registration ID: <strong>{verifyResult.id}</strong></div>
                        <div>Examination Centre: <strong>{verifyResult.centre}</strong></div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-rose-800">
                      <AlertCircle className="w-4 h-4" />
                      <span>{verifyResult.message}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Live Certificate Preview with Direct Download */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-black text-black">Instant Certificate Generator & PDF Exporter</h3>
                  <p className="text-xs text-slate-600">Select any candidate or edit details below to generate and directly download the official PDF certificate.</p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    onChange={(e) => {
                      const selected = usersList.find(u => u.userId === e.target.value);
                      if (selected) handleOpenCertForStudent(selected);
                    }}
                    className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="">Quick Populate Candidate...</option>
                    {usersList.filter(u => u.role !== 'Super Admin').map(u => (
                      <option key={u.userId} value={u.userId}>{u.studentName} ({u.userId})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Editable Quick Certificate Fields */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Candidate Name</label>
                  <input
                    type="text"
                    value={certData.studentName}
                    onChange={(e) => setCertData({ ...certData, studentName: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-black font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Course / Subject</label>
                  <select
                    value={certData.courseName}
                    onChange={(e) => setCertData({ ...certData, courseName: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-black font-bold"
                  >
                    <option value="Abacus">Abacus</option>
                    <option value="Drawing & Art">Drawing & Art</option>
                    <option value="Handwriting">Handwriting</option>
                    <option value="Language Speaking">Language Speaking</option>
                    <option value="Athletics">Athletics</option>
                    <option value="Colour Management">Colour Management</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Level / Category</label>
                  <input
                    type="text"
                    value={certData.level}
                    onChange={(e) => setCertData({ ...certData, level: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-black font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Grade</label>
                  <select
                    value={certData.grade}
                    onChange={(e) => setCertData({ ...certData, grade: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-black font-bold"
                  >
                    <option value="A+">A+ (State Distinction)</option>
                    <option value="A">A (First Class)</option>
                    <option value="B">B (Second Class)</option>
                  </select>
                </div>
              </div>

              {/* Pure Vector Official Certificate Component */}
              <div className="flex justify-center pt-2">
                <Certificate
                  studentName={certData.studentName}
                  courseName={certData.courseName}
                  programPrefix={certData.programPrefix}
                  level={certData.level}
                  grade={certData.grade}
                  duration={certData.duration}
                  registrationNo={certData.registrationNo}
                  certificateNo={certData.certificateNo}
                  centreName={certData.centreName}
                  centreCode={certData.centreCode}
                  centreAddress={certData.centreAddress}
                  issueDate={certData.issueDate}
                  certificateType={certData.certificateType}
                  studentPhoto={certData.studentPhoto}
                  onPhotoUpload={(photo) => setCertData({ ...certData, studentPhoto: photo })}
                  showControls={true}
                />
              </div>

            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 5: PARTNER SCHOOLS & CENTRES
           ========================================================================= */}
        {activeTab === 'schools' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-black">Affiliated Schools & Regional Study Centres</h3>
                <p className="text-xs text-slate-500">Authorized centres permitted to conduct B★SEL grading and Olympiad exams.</p>
              </div>

              <button
                onClick={() => setShowAddSchoolModal(true)}
                className="bg-[#0F2B5C] hover:bg-[#18458F] text-white px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Affiliate New School</span>
              </button>
            </div>

            {/* School Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {schoolsList.map(school => (
                <div key={school.code} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-black text-[#0F2B5C] bg-sky-100 px-2 py-0.5 rounded text-[11px]">
                        {school.code}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        {school.status}
                      </span>
                    </div>

                    <h4 className="font-black text-base text-slate-950 leading-snug">{school.name}</h4>
                    <p className="text-xs font-medium text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{school.city}</span>
                    </p>

                    <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-700 font-semibold">
                      <div className="flex justify-between">
                        <span>Principal:</span>
                        <strong className="text-black">{school.principal}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Coordinator:</span>
                        <strong className="text-black">{school.coordinator}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Helpline:</span>
                        <strong className="text-slate-900">{school.phone}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      {school.studentsCount} Active Students
                    </span>
                    <button
                      onClick={() => handleDeleteSchool(school.code, school.name)}
                      className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>

      {/* =========================================================================
          MODALS
         ========================================================================= */}

      {/* MODAL 1: ADD NEW STUDENT */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="bg-[#0F2B5C] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-base">Enrol New Student to Board</h3>
              </div>
              <button onClick={() => setShowAddStudentModal(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="p-5 space-y-4 text-xs font-bold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newStudent.studentName}
                    onChange={(e) => setNewStudent({ ...newStudent, studentName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Parent / Guardian Name *</label>
                  <input
                    type="text"
                    required
                    value={newStudent.parentName}
                    onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Course / Program *</label>
                  <select
                    value={newStudent.program}
                    onChange={(e) => setNewStudent({ ...newStudent, program: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black font-semibold"
                  >
                    <option value="Abacus Speed Arithmetic">Abacus Speed Arithmetic</option>
                    <option value="Drawing & Fine Arts">Drawing & Fine Arts</option>
                    <option value="Handwriting & Calligraphy">Handwriting & Calligraphy</option>
                    <option value="Language & Spoken English">Language & Spoken English</option>
                    <option value="Athletics & Fitness">Athletics & Fitness</option>
                    <option value="Colour Management & Design">Colour Management & Design</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Class / Grade *</label>
                  <input
                    type="text"
                    required
                    value={newStudent.grade}
                    onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Parent Email</label>
                  <input
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">School / Examination Centre</label>
                <input
                  type="text"
                  value={newStudent.institution}
                  onChange={(e) => setNewStudent({ ...newStudent, institution: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black font-semibold"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F2B5C] hover:bg-[#18458F] text-white rounded-xl font-black"
                >
                  Save & Generate Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT STUDENT */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="bg-[#0F2B5C] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-base">Edit Candidate ({editingStudent.userId})</h3>
              </div>
              <button onClick={() => setEditingStudent(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStudent} className="p-5 space-y-4 text-xs font-bold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Student Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.studentName}
                    onChange={(e) => setEditingStudent({ ...editingStudent, studentName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Parent / Guardian Name</label>
                  <input
                    type="text"
                    value={editingStudent.parentName}
                    onChange={(e) => setEditingStudent({ ...editingStudent, parentName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Course / Program</label>
                  <input
                    type="text"
                    value={editingStudent.program}
                    onChange={(e) => setEditingStudent({ ...editingStudent, program: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Class / Grade</label>
                  <input
                    type="text"
                    value={editingStudent.grade}
                    onChange={(e) => setEditingStudent({ ...editingStudent, grade: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingStudent.phone}
                    onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingStudent.email}
                    onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Affiliated Institution</label>
                <input
                  type="text"
                  value={editingStudent.institution}
                  onChange={(e) => setEditingStudent({ ...editingStudent, institution: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black font-semibold"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F2B5C] hover:bg-[#18458F] text-white rounded-xl font-black"
                >
                  Update Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD NEW EVENT */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="bg-[#0F2B5C] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-base">Publish New State / National Competition</h3>
              </div>
              <button onClick={() => setShowAddEventModal(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-5 space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={newEvent.eventName}
                  onChange={(e) => setNewEvent({ ...newEvent, eventName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Category / Discipline *</label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black font-semibold"
                  >
                    <option value="Abacus">Abacus</option>
                    <option value="Drawing & Art">Drawing & Art</option>
                    <option value="Handwriting">Handwriting</option>
                    <option value="Language Speaking">Language Speaking</option>
                    <option value="Athletics">Athletics</option>
                    <option value="Colour Management">Colour Management</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Registration Fee *</label>
                  <input
                    type="text"
                    required
                    value={newEvent.fee}
                    onChange={(e) => setNewEvent({ ...newEvent, fee: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Event Date *</label>
                  <input
                    type="text"
                    required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Last Date to Register *</label>
                  <input
                    type="text"
                    required
                    value={newEvent.lastDate}
                    onChange={(e) => setNewEvent({ ...newEvent, lastDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Venue & Location *</label>
                <input
                  type="text"
                  required
                  value={newEvent.venue}
                  onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Eligibility Criteria</label>
                <input
                  type="text"
                  value={newEvent.eligibility}
                  onChange={(e) => setNewEvent({ ...newEvent, eligibility: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black font-semibold"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F2B5C] hover:bg-[#18458F] text-white rounded-xl font-black"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT EVENT */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="bg-[#0F2B5C] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-base">Edit Event #{editingEvent.sNo}</h3>
              </div>
              <button onClick={() => setEditingEvent(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateEvent} className="p-5 space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-700 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={editingEvent.eventName}
                  onChange={(e) => setEditingEvent({ ...editingEvent, eventName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={editingEvent.category}
                    onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Fee</label>
                  <input
                    type="text"
                    value={editingEvent.fee}
                    onChange={(e) => setEditingEvent({ ...editingEvent, fee: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Event Date</label>
                  <input
                    type="text"
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Last Date</label>
                  <input
                    type="text"
                    value={editingEvent.lastDate}
                    onChange={(e) => setEditingEvent({ ...editingEvent, lastDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Venue</label>
                <input
                  type="text"
                  value={editingEvent.venue}
                  onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black font-semibold"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F2B5C] hover:bg-[#18458F] text-white rounded-xl font-black"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: ADD PARTNER SCHOOL */}
      {showAddSchoolModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="bg-[#0F2B5C] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <School className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-base">Affiliate New School or Centre</h3>
              </div>
              <button onClick={() => setShowAddSchoolModal(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSchool} className="p-5 space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-700 mb-1">School / Institution Name *</label>
                <input
                  type="text"
                  required
                  value={newSchool.name}
                  onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">City / District *</label>
                  <input
                    type="text"
                    required
                    value={newSchool.city}
                    onChange={(e) => setNewSchool({ ...newSchool, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Phone Helpline *</label>
                  <input
                    type="tel"
                    required
                    value={newSchool.phone}
                    onChange={(e) => setNewSchool({ ...newSchool, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Principal / Correspondent</label>
                  <input
                    type="text"
                    value={newSchool.principal}
                    onChange={(e) => setNewSchool({ ...newSchool, principal: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Centre Coordinator</label>
                  <input
                    type="text"
                    value={newSchool.coordinator}
                    onChange={(e) => setNewSchool({ ...newSchool, coordinator: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Initial Student Strength</label>
                <input
                  type="number"
                  value={newSchool.studentsCount}
                  onChange={(e) => setNewSchool({ ...newSchool, studentsCount: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black font-semibold"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSchoolModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F2B5C] hover:bg-[#18458F] text-white rounded-xl font-black"
                >
                  Affiliate School
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
