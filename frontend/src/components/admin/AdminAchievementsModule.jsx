import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  X, 
  Upload, 
  Trophy, 
  Award, 
  Medal, 
  AlertCircle,
  GraduationCap,
  Sparkles,
  Image as ImageIcon,
  School,
  MapPin
} from 'lucide-react';
import {
  getStoredCompetitionAchievements,
  addStoredCompetitionAchievement,
  updateStoredCompetitionAchievement,
  deleteStoredCompetitionAchievement
} from '../../data/competitionAchievementsData';
import {
  getStoredAchievements,
  addStoredAchievement,
  updateStoredAchievement,
  deleteStoredAchievement,
  PRESET_STUDENT_PHOTOS,
  resolveStudentPhoto
} from '../../data/achievementsData';
import {
  getStoredSchools,
  addStoredSchool,
  updateStoredSchool,
  deleteStoredSchool
} from '../../data/schoolsData';

const LEVEL_OPTIONS = [
  'International Level',
  'National Level',
  'District Level',
  'State Level',
  'Special Recognition'
];

const STUDENT_LEVEL_OPTIONS = [
  'International',
  'National',
  'State',
  'District'
];

function StudentPhotoCell({ photo, name, index = 0 }) {
  const resolved = resolveStudentPhoto(photo, index);
  const [imgSrc, setImgSrc] = useState(resolved);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(resolveStudentPhoto(photo, index));
    setHasError(false);
  }, [photo, index]);

  const initials = (name || 'S')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0].toUpperCase())
    .join('') || 'S';

  return (
    <div className="w-12 h-14 rounded-xl overflow-hidden border border-slate-300 bg-slate-100 shadow-xs relative flex items-center justify-center">
      {!hasError && imgSrc ? (
        <img
          src={imgSrc}
          alt=""
          className="w-full h-full object-cover object-top"
          onError={() => {
            const fallback = resolveStudentPhoto(null, index);
            if (imgSrc !== fallback) {
              setImgSrc(fallback);
            } else {
              setHasError(true);
            }
          }}
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-sky-600 to-indigo-800 flex items-center justify-center text-white font-black text-xs select-none">
          {initials}
        </div>
      )}
    </div>
  );
}

export default function AdminAchievementsModule({ showToast = () => {} }) {
  // Active Section Switcher: 'schools' | 'students' | 'competitions'
  const [activeSection, setActiveSection] = useState('schools');

  // ---------------------------------------------------------------------------
  // COMPETITION ACHIEVEMENTS STATE
  // ---------------------------------------------------------------------------
  const [competitions, setCompetitions] = useState(() => getStoredCompetitionAchievements());
  const [compSearchTerm, setCompSearchTerm] = useState('');
  const [compRowsPerPage, setCompRowsPerPage] = useState('10');

  // Competition Modals
  const [isCompModalOpen, setIsCompModalOpen] = useState(false);
  const [editingCompItem, setEditingCompItem] = useState(null);
  const [deleteConfirmCompItem, setDeleteConfirmCompItem] = useState(null);

  // Competition Form State
  const [compFormData, setCompFormData] = useState({
    code: '',
    level: 'International Level',
    title: '',
    image: null,
    description: '',
    highlights: '',
    order: 1
  });

  // ---------------------------------------------------------------------------
  // STUDENT ACHIEVERS STATE
  // ---------------------------------------------------------------------------
  const [students, setStudents] = useState(() => getStoredAchievements());
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [studentRowsPerPage, setStudentRowsPerPage] = useState('10');

  // Student Modals
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteConfirmStudent, setDeleteConfirmStudent] = useState(null);

  // Student Form State
  const [studentFormData, setStudentFormData] = useState({
    name: '',
    school: '',
    achievement: '',
    level: 'International',
    award: '',
    year: '2026',
    description: '',
    photo: ''
  });

  // ---------------------------------------------------------------------------
  // SCHOOL COMMUNITY ("GROWING TOGETHER") STATE
  // ---------------------------------------------------------------------------
  const [schools, setSchools] = useState(() => getStoredSchools());
  const [schoolSearchTerm, setSchoolSearchTerm] = useState('');
  const [schoolRowsPerPage, setSchoolRowsPerPage] = useState('10');

  // School Modals
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState(null);
  const [deleteConfirmSchool, setDeleteConfirmSchool] = useState(null);

  // School Form State
  const [schoolFormData, setSchoolFormData] = useState({
    code: '',
    name: '',
    city: '',
    branchName: '',
    principal: '',
    coordinator: '',
    phone: '',
    status: 'Active Partner'
  });

  // Sync on local storage events
  useEffect(() => {
    const handleCompUpdate = () => {
      setCompetitions(getStoredCompetitionAchievements());
    };
    const handleStudentUpdate = () => {
      setStudents(getStoredAchievements());
    };
    const handleSchoolsUpdate = () => {
      setSchools(getStoredSchools());
    };

    window.addEventListener('bsel_competition_achievements_updated', handleCompUpdate);
    window.addEventListener('bsel_achievements_updated', handleStudentUpdate);
    window.addEventListener('bsel_schools_updated', handleSchoolsUpdate);
    window.addEventListener('storage', handleCompUpdate);
    window.addEventListener('storage', handleStudentUpdate);
    window.addEventListener('storage', handleSchoolsUpdate);

    return () => {
      window.removeEventListener('bsel_competition_achievements_updated', handleCompUpdate);
      window.removeEventListener('bsel_achievements_updated', handleStudentUpdate);
      window.removeEventListener('bsel_schools_updated', handleSchoolsUpdate);
      window.removeEventListener('storage', handleCompUpdate);
      window.removeEventListener('storage', handleStudentUpdate);
      window.removeEventListener('storage', handleSchoolsUpdate);
    };
  }, []);

  // ---------------------------------------------------------------------------
  // COMPETITION HELPERS
  // ---------------------------------------------------------------------------
  const filteredCompetitions = useMemo(() => {
    const term = compSearchTerm.toLowerCase().trim();
    const sorted = [...competitions].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    if (!term) return sorted;
    return sorted.filter((item) => 
      (item.code || '').toLowerCase().includes(term) ||
      (item.level || '').toLowerCase().includes(term) ||
      (item.title || '').toLowerCase().includes(term) ||
      (item.description || '').toLowerCase().includes(term) ||
      (item.highlights || '').toLowerCase().includes(term)
    );
  }, [competitions, compSearchTerm]);

  const displayedCompetitions = useMemo(() => {
    if (compRowsPerPage === 'All') return filteredCompetitions;
    const limit = parseInt(compRowsPerPage, 10) || 10;
    return filteredCompetitions.slice(0, limit);
  }, [filteredCompetitions, compRowsPerPage]);

  const handleOpenAddCompModal = () => {
    setEditingCompItem(null);
    const nextOrder = competitions.length + 1;
    const nextLetter = String.fromCharCode(65 + (competitions.length % 26));
    setCompFormData({
      code: `14.${nextLetter}`,
      level: 'International Level',
      title: '',
      image: null,
      description: '',
      highlights: '',
      order: nextOrder
    });
    setIsCompModalOpen(true);
  };

  const handleOpenEditCompModal = (item) => {
    setEditingCompItem(item);
    setCompFormData({
      code: item.code || '',
      level: item.level || 'International Level',
      title: item.title || '',
      image: item.image || null,
      description: item.description || '',
      highlights: item.highlights || '',
      order: item.order || 1
    });
    setIsCompModalOpen(true);
  };

  const handleCompImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast?.('Please choose an image under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setCompFormData(prev => ({ ...prev, image: event.target?.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveComp = (e) => {
    e.preventDefault();
    if (!compFormData.title.trim()) {
      showToast?.('Please enter competition or award title');
      return;
    }

    if (editingCompItem) {
      updateStoredCompetitionAchievement(editingCompItem.id, compFormData);
      showToast?.('Competition record updated live on website!');
    } else {
      addStoredCompetitionAchievement(compFormData);
      showToast?.('Competition record added live to website!');
    }

    setIsCompModalOpen(false);
    setEditingCompItem(null);
  };

  const handleDeleteComp = () => {
    if (deleteConfirmCompItem) {
      deleteStoredCompetitionAchievement(deleteConfirmCompItem.id);
      showToast?.('Competition achievement removed from website.');
      setDeleteConfirmCompItem(null);
    }
  };

  // ---------------------------------------------------------------------------
  // STUDENT ACHIEVER HELPERS
  // ---------------------------------------------------------------------------
  const filteredStudents = useMemo(() => {
    const term = studentSearchTerm.toLowerCase().trim();
    if (!term) return students;
    return students.filter((item) => 
      (item.name || '').toLowerCase().includes(term) ||
      (item.school || '').toLowerCase().includes(term) ||
      (item.achievement || '').toLowerCase().includes(term) ||
      (item.level || '').toLowerCase().includes(term) ||
      (item.award || '').toLowerCase().includes(term) ||
      (item.year || '').toLowerCase().includes(term) ||
      (item.description || '').toLowerCase().includes(term)
    );
  }, [students, studentSearchTerm]);

  const displayedStudents = useMemo(() => {
    if (studentRowsPerPage === 'All') return filteredStudents;
    const limit = parseInt(studentRowsPerPage, 10) || 10;
    return filteredStudents.slice(0, limit);
  }, [filteredStudents, studentRowsPerPage]);

  const handleOpenAddStudentModal = () => {
    setEditingStudent(null);
    const defaultPhoto = PRESET_STUDENT_PHOTOS?.[0]?.img || null;
    setStudentFormData({
      name: '',
      school: '',
      achievement: '',
      level: 'International',
      award: '',
      year: new Date().getFullYear().toString(),
      description: '',
      photo: defaultPhoto
    });
    setIsStudentModalOpen(true);
  };

  const handleOpenEditStudentModal = (student) => {
    setEditingStudent(student);
    setStudentFormData({
      name: student.name || '',
      school: student.school || '',
      achievement: student.achievement || '',
      level: student.level || 'International',
      award: student.award || '',
      year: student.year || '2026',
      description: student.description || '',
      photo: resolveStudentPhoto(student.photo)
    });
    setIsStudentModalOpen(true);
  };

  const handleStudentPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast?.('Please choose an image under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setStudentFormData(prev => ({ ...prev, photo: event.target?.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveStudent = (e) => {
    e.preventDefault();
    if (!studentFormData.name.trim()) {
      showToast?.('Please enter student name');
      return;
    }
    if (!studentFormData.achievement.trim()) {
      showToast?.('Please enter achievement title');
      return;
    }

    if (editingStudent) {
      updateStoredAchievement(editingStudent.id, {
        name: studentFormData.name.trim(),
        school: studentFormData.school.trim() || 'B★SEL Academy',
        achievement: studentFormData.achievement.trim(),
        level: studentFormData.level || 'State',
        award: studentFormData.award.trim() || 'Achievement Award',
        year: studentFormData.year.trim() || '2026',
        description: studentFormData.description.trim() || 'Recognized for outstanding performance in competition.',
        photo: resolveStudentPhoto(studentFormData.photo)
      });
      showToast?.(`Achievement for "${studentFormData.name.trim()}" updated live on website!`);
    } else {
      addStoredAchievement({
        name: studentFormData.name.trim(),
        school: studentFormData.school.trim() || 'B★SEL Academy',
        achievement: studentFormData.achievement.trim(),
        level: studentFormData.level || 'State',
        award: studentFormData.award.trim() || 'Achievement Award',
        year: studentFormData.year.trim() || '2026',
        description: studentFormData.description.trim() || 'Recognized for outstanding performance in competition.',
        photo: resolveStudentPhoto(studentFormData.photo)
      });
      showToast?.(`Achievement for "${studentFormData.name.trim()}" published live to website!`);
    }

    setIsStudentModalOpen(false);
    setEditingStudent(null);
  };

  const handleDeleteStudent = () => {
    if (deleteConfirmStudent) {
      deleteStoredAchievement(deleteConfirmStudent.id);
      showToast?.(`Achievement for "${deleteConfirmStudent.name}" removed from website.`);
      setDeleteConfirmStudent(null);
    }
  };

  // ---------------------------------------------------------------------------
  // SCHOOL COMMUNITY ("GROWING TOGETHER") HELPERS
  // ---------------------------------------------------------------------------
  const filteredSchools = useMemo(() => {
    const term = schoolSearchTerm.toLowerCase().trim();
    if (!term) return schools;
    return schools.filter((item) => 
      (item.name || '').toLowerCase().includes(term) ||
      (item.city || '').toLowerCase().includes(term) ||
      (item.branchName || '').toLowerCase().includes(term) ||
      (item.code || '').toLowerCase().includes(term) ||
      (item.principal || '').toLowerCase().includes(term)
    );
  }, [schools, schoolSearchTerm]);

  const displayedSchools = useMemo(() => {
    if (schoolRowsPerPage === 'All') return filteredSchools;
    const limit = parseInt(schoolRowsPerPage, 10) || 10;
    return filteredSchools.slice(0, limit);
  }, [filteredSchools, schoolRowsPerPage]);

  const handleOpenAddSchoolModal = () => {
    setEditingSchool(null);
    const nextCode = `BSEL-CTR-${100 + schools.length + 1}`;
    setSchoolFormData({
      code: nextCode,
      name: '',
      city: '',
      branchName: '',
      principal: '',
      coordinator: '',
      phone: '',
      status: 'Active Partner'
    });
    setIsSchoolModalOpen(true);
  };

  const handleOpenEditSchoolModal = (school) => {
    setEditingSchool(school);
    setSchoolFormData({
      code: school.code || '',
      name: school.name || '',
      city: school.city || '',
      branchName: school.branchName || '',
      principal: school.principal || '',
      coordinator: school.coordinator || '',
      phone: school.phone || '',
      status: school.status || 'Active Partner'
    });
    setIsSchoolModalOpen(true);
  };

  const handleSaveSchool = (e) => {
    e.preventDefault();
    if (!schoolFormData.name.trim()) {
      showToast?.('Please enter institution or school name');
      return;
    }
    if (!schoolFormData.city.trim()) {
      showToast?.('Please enter city / location');
      return;
    }

    if (editingSchool) {
      updateStoredSchool(editingSchool.code, {
        name: schoolFormData.name.trim(),
        city: schoolFormData.city.trim(),
        branchName: schoolFormData.branchName.trim() || schoolFormData.name.trim(),
        principal: schoolFormData.principal.trim(),
        coordinator: schoolFormData.coordinator.trim(),
        phone: schoolFormData.phone.trim(),
        status: schoolFormData.status
      });
      showToast?.(`School "${schoolFormData.name.trim()}" updated live on website!`);
    } else {
      addStoredSchool({
        code: schoolFormData.code || `BSEL-CTR-${100 + schools.length + 1}`,
        name: schoolFormData.name.trim(),
        city: schoolFormData.city.trim(),
        branchName: schoolFormData.branchName.trim() || schoolFormData.name.trim(),
        principal: schoolFormData.principal.trim(),
        coordinator: schoolFormData.coordinator.trim(),
        phone: schoolFormData.phone.trim(),
        status: schoolFormData.status
      });
      showToast?.(`School "${schoolFormData.name.trim()}" added live to website!`);
    }

    setIsSchoolModalOpen(false);
    setEditingSchool(null);
  };

  const handleDeleteSchool = () => {
    if (deleteConfirmSchool) {
      deleteStoredSchool(deleteConfirmSchool.code);
      showToast?.(`School "${deleteConfirmSchool.name}" removed from website.`);
      setDeleteConfirmSchool(null);
    }
  };

  // Render Level Badges
  const renderCompLevelBadge = (level = '') => {
    const l = level.toLowerCase();
    if (l.includes('international')) {
      return (
        <span className="inline-flex items-center gap-1.5 font-bold text-slate-700 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shrink-0 shadow-2xs"></span>
          <span>{level}</span>
        </span>
      );
    }
    if (l.includes('national')) {
      return (
        <span className="inline-flex items-center gap-1.5 font-bold text-slate-700 text-xs">
          <span className="text-[10px] font-black uppercase text-sky-800 bg-sky-100 px-1.5 py-0.5 rounded border border-sky-200">IN</span>
          <span>{level}</span>
        </span>
      );
    }
    if (l.includes('district')) {
      return (
        <span className="inline-flex items-center gap-1.5 font-bold text-slate-700 text-xs">
          <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>{level}</span>
        </span>
      );
    }
    if (l.includes('state')) {
      return (
        <span className="inline-flex items-center gap-1.5 font-bold text-slate-700 text-xs">
          <Medal className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <span>{level}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 font-bold text-slate-700 text-xs">
        <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>{level}</span>
      </span>
    );
  };

  const renderStudentLevelBadge = (level = '') => {
    const l = (level || '').toLowerCase();
    if (l.includes('international')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200">
          <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0"></span>
          International
        </span>
      );
    }
    if (l.includes('national')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
          National
        </span>
      );
    }
    if (l.includes('state')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
          <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0"></span>
          State
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
        <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
        District
      </span>
    );
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* =========================================================================
          MODULE HEADER CARD (Standard Admin Dashboard Header Layout)
          ========================================================================= */}
      <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500 shrink-0" />
            <span>Achievements & Public Content Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Super Admin portal to manage participating schools, young achievers, and competition awards displayed live on the website.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {activeSection === 'schools' && (
            <button
              type="button"
              onClick={handleOpenAddSchoolModal}
              className="px-4 py-2 bg-[#0c234b] hover:bg-[#163e7c] text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Add Participating School</span>
            </button>
          )}

          {activeSection === 'students' && (
            <button
              type="button"
              onClick={handleOpenAddStudentModal}
              className="px-4 py-2 bg-[#0c234b] hover:bg-[#163e7c] text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Add Student Achiever</span>
            </button>
          )}

          {activeSection === 'competitions' && (
            <button
              type="button"
              onClick={handleOpenAddCompModal}
              className="px-4 py-2 bg-[#0c234b] hover:bg-[#163e7c] text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Add Competition Record</span>
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          TAB NAVIGATION PILLS (Matching Admin Dashboard style)
          ========================================================================= */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1.5 flex-wrap">
        <button
          type="button"
          onClick={() => setActiveSection('schools')}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
            activeSection === 'schools'
              ? 'bg-[#0c234b] text-white shadow-sm ring-1 ring-amber-400/30'
              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
          }`}
        >
          <School className={`w-4 h-4 ${activeSection === 'schools' ? 'text-amber-400' : 'text-slate-500'}`} />
          <span>School Community (Growing Together)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('students')}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
            activeSection === 'students'
              ? 'bg-[#0c234b] text-white shadow-sm ring-1 ring-amber-400/30'
              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className={`w-4 h-4 ${activeSection === 'students' ? 'text-amber-400' : 'text-slate-500'}`} />
          <span>Student Achievers</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('competitions')}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
            activeSection === 'competitions'
              ? 'bg-[#0c234b] text-white shadow-sm ring-1 ring-amber-400/30'
              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
          }`}
        >
          <Trophy className={`w-4 h-4 ${activeSection === 'competitions' ? 'text-amber-400' : 'text-slate-500'}`} />
          <span>Competitions & Awards</span>
        </button>
      </div>

      {/* =========================================================================
          VIEW 1: SCHOOL COMMUNITY ("GROWING TOGETHER") SECTION
          ========================================================================= */}
      {activeSection === 'schools' && (
        <div className="space-y-4">
          {/* Section Info & Filter Card */}
          <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
            {/* Search & Filter row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-0.5">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={schoolSearchTerm}
                  onChange={(e) => setSchoolSearchTerm(e.target.value)}
                  placeholder="Search participating schools, location, code..."
                  className="w-full pl-9 pr-8 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:border-[#0c234b] text-slate-800"
                />
                {schoolSearchTerm && (
                  <button
                    type="button"
                    onClick={() => setSchoolSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Rows per page:</span>
                <select
                  value={schoolRowsPerPage}
                  onChange={(e) => setSchoolRowsPerPage(e.target.value)}
                  className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-xl bg-white text-slate-700 font-bold outline-none cursor-pointer"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="All">All</option>
                </select>
              </div>
            </div>
          </div>

          {/* School Community Table Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4 w-20 text-center">NO.</th>
                    <th className="py-3 px-4 min-w-[220px]">SCHOOL / INSTITUTION NAME</th>
                    <th className="py-3 px-4 w-52">CITY & DISTRICT / LOCATION</th>
                    <th className="py-3 px-4 w-48">CENTRE / BRANCH TYPE</th>
                    <th className="py-3 px-4 w-32">CODE</th>
                    <th className="py-3 px-4 w-24 text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedSchools.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                        No participating schools found matching &ldquo;{schoolSearchTerm}&rdquo;
                      </td>
                    </tr>
                  ) : (
                    displayedSchools.map((school, index) => {
                      const actualIndex = schools.findIndex(s => s.code === school.code);
                      const displayNum = String((actualIndex !== -1 ? actualIndex : index) + 1).padStart(2, '0');
                      return (
                        <tr key={school.code || index} className="hover:bg-slate-50/70 transition">
                          {/* NUMBER BADGE */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <div className="inline-flex w-9 h-9 rounded-xl bg-blue-950 text-amber-400 font-black text-xs items-center justify-center shadow-xs">
                              {displayNum}
                            </div>
                          </td>

                          {/* SCHOOL NAME */}
                          <td className="py-3.5 px-4">
                            <div className="font-black text-slate-950 text-sm">{school.name}</div>
                            {school.branchName && school.branchName !== school.name && (
                              <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                                {school.branchName}
                              </div>
                            )}
                          </td>

                          {/* LOCATION */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span>{school.city || school.location || 'Tamil Nadu'}</span>
                            </div>
                          </td>

                          {/* STATUS */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold bg-blue-50 text-blue-900 border border-blue-200">
                              {school.status || 'Active Partner'}
                            </span>
                          </td>

                          {/* CODE */}
                          <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-slate-500 font-bold">
                            {school.code || '-'}
                          </td>

                          {/* ACTIONS */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditSchoolModal(school)}
                                className="p-1.5 rounded-lg bg-[#0c234b] text-white hover:bg-[#163e7c] transition cursor-pointer shadow-xs"
                                title="Edit school details"
                                aria-label="Edit school"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmSchool(school)}
                                className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition cursor-pointer shadow-xs"
                                title="Delete school from website"
                                aria-label="Delete school"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3.5 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 px-4 gap-2">
              <span>Showing {displayedSchools.length} of {filteredSchools.length} participating school community records</span>
              <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                Public website updates automatically in real-time
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: STUDENT ACHIEVERS SECTION
          ========================================================================= */}
      {activeSection === 'students' && (
        <div className="space-y-4">
          <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={studentSearchTerm}
                onChange={(e) => setStudentSearchTerm(e.target.value)}
                placeholder="Search by student name, school, achievement..."
                className="w-full pl-9 pr-8 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:border-[#0c234b] text-slate-800"
              />
              {studentSearchTerm && (
                <button
                  type="button"
                  onClick={() => setStudentSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Rows per page:</span>
              <select
                value={studentRowsPerPage}
                onChange={(e) => setStudentRowsPerPage(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-xl bg-white text-slate-700 font-bold outline-none cursor-pointer"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="All">All</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4 w-24">PHOTO</th>
                    <th className="py-3 px-4 w-44">STUDENT NAME</th>
                    <th className="py-3 px-4 w-36">LEVEL</th>
                    <th className="py-3 px-4 min-w-[200px]">ACHIEVEMENT & AWARD</th>
                    <th className="py-3 px-4 w-52">SCHOOL / ACADEMY</th>
                    <th className="py-3 px-4 min-w-[220px]">DESCRIPTION</th>
                    <th className="py-3 px-4 w-24 text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                        No student achiever records found matching &ldquo;{studentSearchTerm}&rdquo;
                      </td>
                    </tr>
                  ) : (
                    displayedStudents.map((student, idx) => (
                      <tr key={student.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <StudentPhotoCell
                            photo={student.photo}
                            name={student.name}
                            index={idx}
                          />
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-black text-slate-950 text-sm">{student.name}</div>
                          <span className="inline-block mt-0.5 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            Year: {student.year || '2026'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {renderStudentLevelBadge(student.level)}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-blue-950 leading-snug">
                            {student.achievement}
                          </div>
                          {student.award && (
                            <div className="text-[11px] text-amber-700 font-semibold mt-1">
                              🏆 {student.award}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-slate-700 font-semibold leading-relaxed">
                          {student.school}
                        </td>

                        <td className="py-3.5 px-4 text-slate-600 leading-relaxed text-[11.5px]">
                          {student.description}
                        </td>

                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditStudentModal(student)}
                              className="p-1.5 rounded-lg bg-[#0c234b] text-white hover:bg-[#163e7c] transition cursor-pointer shadow-xs"
                              title="Edit student achiever & photo"
                              aria-label="Edit student achiever"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmStudent(student)}
                              className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition cursor-pointer shadow-xs"
                              title="Delete student achiever"
                              aria-label="Delete student achiever"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3.5 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 px-4 gap-2">
              <span>Showing {displayedStudents.length} of {filteredStudents.length} student records</span>
              <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                Public website updates automatically in real-time
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: COMPETITIONS TABLE
          ========================================================================= */}
      {activeSection === 'competitions' && (
        <div className="space-y-4">
          <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={compSearchTerm}
                onChange={(e) => setCompSearchTerm(e.target.value)}
                placeholder="Search records..."
                className="w-full pl-9 pr-8 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:border-[#0c234b] text-slate-800"
              />
              {compSearchTerm && (
                <button
                  type="button"
                  onClick={() => setCompSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Rows per page:</span>
              <select
                value={compRowsPerPage}
                onChange={(e) => setCompRowsPerPage(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-xl bg-white text-slate-700 font-bold outline-none cursor-pointer"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="All">All</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4 w-16">CODE</th>
                    <th className="py-3 px-4 w-40">LEVEL</th>
                    <th className="py-3 px-4 w-60">COMPETITION / AWARD</th>
                    <th className="py-3 px-4 w-28">IMAGE</th>
                    <th className="py-3 px-4 min-w-[220px]">DESCRIPTION</th>
                    <th className="py-3 px-4 w-52">HIGHLIGHTS</th>
                    <th className="py-3 px-4 w-16 text-center">ORDER</th>
                    <th className="py-3 px-4 w-24 text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedCompetitions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                        No achievement records found matching &ldquo;{compSearchTerm}&rdquo;
                      </td>
                    </tr>
                  ) : (
                    displayedCompetitions.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-600 whitespace-nowrap">
                          {item.code || '-'}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {renderCompLevelBadge(item.level)}
                        </td>
                        <td className="py-3.5 px-4 font-black text-slate-950 leading-snug">
                          {item.title}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {item.image ? (
                            <div className="w-14 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-xs flex items-center justify-center">
                              <img
                                src={item.image}
                                alt=""
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs font-medium">
                              No image
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 leading-relaxed text-[11.5px]">
                          {item.description}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 font-semibold text-xs">
                          {item.highlights}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-600">
                          {item.order}
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditCompModal(item)}
                              className="p-1.5 rounded-lg bg-[#0c234b] text-white hover:bg-[#163e7c] transition cursor-pointer shadow-xs"
                              title="Edit achievement"
                              aria-label="Edit achievement"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmCompItem(item)}
                              className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition cursor-pointer shadow-xs"
                              title="Delete achievement"
                              aria-label="Delete achievement"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3.5 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 px-4 gap-2">
              <span>Showing {displayedCompetitions.length} of {filteredCompetitions.length} entries</span>
              <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                Public website updates automatically in real-time
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD / EDIT PARTICIPATING SCHOOL
          ========================================================================= */}
      {isSchoolModalOpen && (
        <div className="fixed inset-0 z-[150] bg-black/75 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 my-auto">
            <div className="bg-[#0c234b] text-white p-4.5 flex items-center justify-between border-b border-amber-400/40">
              <div className="flex items-center gap-2">
                <School className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    {editingSchool ? 'Edit Participating School' : 'Add Participating School'}
                  </h3>
                  <p className="text-[11px] text-amber-300 font-medium">
                    Changes reflect immediately in the &quot;Growing Together&quot; section on the website
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSchoolModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSchool} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  School / Institution Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={schoolFormData.name}
                  onChange={(e) => setSchoolFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. RC Middle School"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none font-bold text-slate-900 focus:border-[#0c234b]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  City & State / Location <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={schoolFormData.city}
                  onChange={(e) => setSchoolFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="e.g. Uthumalai, Tamil Nadu"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none font-semibold text-slate-800 focus:border-[#0c234b]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Branch / Study Centre Name
                  </label>
                  <input
                    type="text"
                    value={schoolFormData.branchName}
                    onChange={(e) => setSchoolFormData(prev => ({ ...prev, branchName: e.target.value }))}
                    placeholder="e.g. Uthumalai Regional Centre"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none text-slate-800 focus:border-[#0c234b]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Partnership Status
                  </label>
                  <select
                    value={schoolFormData.status}
                    onChange={(e) => setSchoolFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl outline-none font-bold text-slate-800 bg-white focus:border-[#0c234b]"
                  >
                    <option value="Active Partner">Active Partner</option>
                    <option value="Authorized Franchise Branch">Authorized Franchise Branch</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSchoolModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0c234b] hover:bg-[#163e7c] text-white rounded-xl font-bold transition cursor-pointer shadow-sm"
                >
                  {editingSchool ? 'Save & Update Website' : 'Add to Website'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: DELETE SCHOOL CONFIRMATION
          ========================================================================= */}
      {deleteConfirmSchool && (
        <div className="fixed inset-0 z-[150] bg-black/75 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white max-w-sm w-full rounded-2xl shadow-xl p-5 border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2.5 text-rose-600 mb-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h4 className="font-black text-sm">Remove School from Website?</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to remove <span className="font-bold text-slate-900">&quot;{deleteConfirmSchool.name}&quot;</span> from the public website?
            </p>
            <div className="flex items-center justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setDeleteConfirmSchool(null)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSchool}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs transition cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD / EDIT STUDENT ACHIEVER
          ========================================================================= */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-[150] bg-black/75 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 my-auto">
            <div className="bg-[#0c234b] text-white p-4.5 flex items-center justify-between border-b border-amber-400/40">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    {editingStudent ? 'Edit Student Achiever' : 'Add New Student Achiever'}
                  </h3>
                  <p className="text-[11px] text-amber-300 font-medium">
                    Changes reflect live on the website immediately
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsStudentModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="p-5 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <label className="block font-bold text-slate-800 mb-2">
                  Student Photo / Image
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative w-20 h-24 rounded-xl border-2 border-amber-400 overflow-hidden bg-slate-900 shrink-0 shadow-sm">
                    {studentFormData.photo ? (
                      <img
                        src={studentFormData.photo}
                        alt="Preview"
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-[10px] p-1 text-center">
                        <ImageIcon className="w-6 h-6 mb-1 text-slate-500" />
                        No photo
                      </div>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <label className="w-full px-3 py-2 border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl font-bold text-xs cursor-pointer flex items-center justify-center gap-2 bg-white transition hover:bg-amber-50/50">
                      <Upload className="w-4 h-4 text-amber-600" />
                      <span className="text-slate-800">Upload New Photo</span>
                      <span className="text-[10px] text-slate-400 font-normal">(JPG, PNG max 2MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleStudentPhotoUpload}
                        className="hidden"
                      />
                    </label>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Or select default photo:
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {(PRESET_STUDENT_PHOTOS || []).map((preset, idx) => (
                          <button
                            type="button"
                            key={preset.id}
                            onClick={() => setStudentFormData(prev => ({ ...prev, photo: preset.img }))}
                            className={`w-7 h-7 rounded-full overflow-hidden border-2 transition cursor-pointer ${
                              studentFormData.photo === preset.img ? 'border-amber-500 ring-2 ring-amber-400/40' : 'border-slate-300 opacity-70 hover:opacity-100'
                            }`}
                            title={preset.label}
                          >
                            <img src={preset.img} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover object-top" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Student Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={studentFormData.name}
                    onChange={(e) => setStudentFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Ram"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none font-semibold text-slate-800 focus:border-[#0c234b]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    School / Centre / Academy <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={studentFormData.school}
                    onChange={(e) => setStudentFormData(prev => ({ ...prev, school: e.target.value }))}
                    placeholder="e.g. Sacred Heart Nursery & Primary School"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none text-slate-800 font-medium focus:border-[#0c234b]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Achievement Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={studentFormData.achievement}
                  onChange={(e) => setStudentFormData(prev => ({ ...prev, achievement: e.target.value }))}
                  placeholder="e.g. International Level Abacus Competition"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none font-semibold text-slate-800 focus:border-[#0c234b]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Level <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={studentFormData.level}
                    onChange={(e) => setStudentFormData(prev => ({ ...prev, level: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl outline-none font-semibold text-slate-800 bg-white focus:border-[#0c234b]"
                  >
                    {STUDENT_LEVEL_OPTIONS.map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl} Level</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Award / Recognition
                  </label>
                  <input
                    type="text"
                    value={studentFormData.award}
                    onChange={(e) => setStudentFormData(prev => ({ ...prev, award: e.target.value }))}
                    placeholder="e.g. International Achievement Award"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none text-slate-800 focus:border-[#0c234b]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    value={studentFormData.year}
                    onChange={(e) => setStudentFormData(prev => ({ ...prev, year: e.target.value }))}
                    placeholder="2026"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none font-semibold text-slate-800 focus:border-[#0c234b]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Description / Performance Highlights
                </label>
                <textarea
                  rows={2}
                  value={studentFormData.description}
                  onChange={(e) => setStudentFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g. Recognized for exceptional mental arithmetic skills, accuracy, and concentration."
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none text-slate-800 leading-relaxed resize-none focus:border-[#0c234b]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsStudentModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0c234b] hover:bg-[#163e7c] text-white rounded-xl font-bold transition cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{editingStudent ? 'Save & Update Website' : 'Publish to Website'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: DELETE STUDENT ACHIEVER CONFIRMATION
          ========================================================================= */}
      {deleteConfirmStudent && (
        <div className="fixed inset-0 z-[150] bg-black/75 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white max-w-sm w-full rounded-2xl shadow-xl p-5 border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2.5 text-rose-600 mb-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h4 className="font-black text-sm">Delete Student Achiever?</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to remove <span className="font-bold text-slate-900">&quot;{deleteConfirmStudent.name}&quot;</span> from the public website?
            </p>
            <div className="flex items-center justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setDeleteConfirmStudent(null)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteStudent}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs transition cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD / EDIT COMPETITION ACHIEVEMENT
          ========================================================================= */}
      {isCompModalOpen && (
        <div className="fixed inset-0 z-[150] bg-black/75 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 my-auto">
            <div className="bg-[#0c234b] text-white p-4.5 flex items-center justify-between border-b border-amber-400/40">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm sm:text-base">
                  {editingCompItem ? 'Edit Achievement Record' : 'Add New Achievement Record'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCompModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveComp} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={compFormData.code}
                    onChange={(e) => setCompFormData(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="e.g. 14.A"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none font-semibold text-slate-800 focus:border-[#0c234b]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Level <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={compFormData.level}
                    onChange={(e) => setCompFormData(prev => ({ ...prev, level: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl outline-none font-semibold text-slate-800 bg-white focus:border-[#0c234b]"
                  >
                    {LEVEL_OPTIONS.map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Display Order <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={compFormData.order}
                    onChange={(e) => setCompFormData(prev => ({ ...prev, order: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none font-semibold text-slate-800 focus:border-[#0c234b]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Competition / Award Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={compFormData.title}
                  onChange={(e) => setCompFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Thej International Abacus Competition"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none font-semibold text-slate-800 focus:border-[#0c234b]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Highlights
                </label>
                <input
                  type="text"
                  value={compFormData.highlights}
                  onChange={(e) => setCompFormData(prev => ({ ...prev, highlights: e.target.value }))}
                  placeholder="e.g. 1st, 2nd, 3rd and Merit Awards"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none text-slate-800 focus:border-[#0c234b]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={compFormData.description}
                  onChange={(e) => setCompFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter full achievement / competition details..."
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none text-slate-800 leading-relaxed resize-none focus:border-[#0c234b]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Competition Trophy / Badge Image
                </label>
                <div className="flex items-center gap-3">
                  {compFormData.image ? (
                    <div className="relative w-16 h-12 rounded-xl border border-slate-300 overflow-hidden bg-slate-100 shrink-0 shadow-xs">
                      <img
                        src={compFormData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setCompFormData(prev => ({ ...prev, image: null }))}
                        className="absolute top-0.5 right-0.5 bg-rose-600 text-white p-0.5 rounded-full hover:bg-rose-700"
                        title="Remove image"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-12 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-[10px] shrink-0">
                      No Image
                    </div>
                  )}

                  <label className="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs cursor-pointer inline-flex items-center gap-1.5 transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCompImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCompModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0c234b] hover:bg-[#163e7c] text-white rounded-xl font-bold transition cursor-pointer shadow-sm"
                >
                  {editingCompItem ? 'Save Changes' : 'Create Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: DELETE COMPETITION CONFIRMATION
          ========================================================================= */}
      {deleteConfirmCompItem && (
        <div className="fixed inset-0 z-[150] bg-black/75 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white max-w-sm w-full rounded-2xl shadow-xl p-5 border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2.5 text-rose-600 mb-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h4 className="font-black text-sm">Delete Achievement?</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-slate-800">&quot;{deleteConfirmCompItem.title}&quot;</span>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setDeleteConfirmCompItem(null)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteComp}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs transition cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
