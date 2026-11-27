import React, { useState, useEffect, useRef } from 'react';
import {
  School,
  Building,
  Plus,
  MapPin,
  Phone,
  Trash2,
  Edit2,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  ArrowRight,
  Sparkles,
  X,
  Save,
  Check
} from 'lucide-react';
import {
  getStoredSchools,
  addStoredSchool,
  updateStoredSchool,
  deleteStoredSchool,
  getSchoolBranding
} from '../../utils/schoolStorage';
import { setActiveSession, getActiveSession } from '../../utils/authStorage';
import SchoolCertificateBrandingModal from '../../components/SchoolCertificateBrandingModal';

export default function AdminBranchSchoolsPage({
  activeBranch = 'Tenkasi Branch',
  showToast = () => {},
  setActivePage = () => {},
  handleTabSelect = () => {}
}) {
  const [schools, setSchools] = useState(() => getStoredSchools(activeBranch));
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSchool, setEditingSchool] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [brandingModalSchool, setBrandingModalSchool] = useState(null);

  // Form State for Add / Edit
  const [schoolForm, setSchoolForm] = useState({
    name: '',
    coordinator: '',
    city: 'Tenkasi',
    address: '15, Church Road, Near New Bus Stand, Tenkasi, Tamil Nadu',
    phone: '98652 19131',
    email: '',
    userId: '',
    password: 'school123',
    schoolName: '',
    subtitle: 'TENKASI DISTRICT',
    motto: 'KNOWLEDGE • CHARACTER • SERVICE'
  });

  // Re-sync schools whenever updated in storage
  useEffect(() => {
    const handleUpdate = () => {
      setSchools(getStoredSchools(activeBranch));
    };
    window.addEventListener('bsel_schools_updated', handleUpdate);
    window.addEventListener('bsel_school_branding_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('bsel_schools_updated', handleUpdate);
      window.removeEventListener('bsel_school_branding_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [activeBranch]);

  // Copy to clipboard helper
  const handleCopy = (text, label) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    showToast(`Copied ${label} to clipboard!`);
  };

  // Toggle password visibility per card
  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Open Add School Modal
  const handleOpenAdd = () => {
    setEditingSchool(null);
    const idNumber = Date.now().toString().slice(-3);
    const cleanCity = activeBranch.replace(/\s*branch/gi, '').trim() || 'Tenkasi';
    setSchoolForm({
      name: '',
      coordinator: '',
      city: cleanCity,
      address: `${cleanCity}, Tamil Nadu`,
      phone: '',
      email: '',
      userId: `school.${cleanCity.toLowerCase().replace(/[^a-z0-9]/g, '')}${idNumber}`,
      password: 'school123',
      schoolName: '',
      subtitle: `${cleanCity.toUpperCase()} DISTRICT`,
      motto: 'KNOWLEDGE • CHARACTER • SERVICE'
    });
    setShowAddModal(true);
  };

  // Open Edit School Modal
  const handleOpenEdit = (sch) => {
    setEditingSchool(sch);
    setSchoolForm({
      name: sch.name || '',
      coordinator: sch.coordinator || '',
      city: sch.city || 'Tenkasi',
      address: sch.address || `${sch.city || 'Tenkasi'}, Tamil Nadu`,
      phone: sch.phone || '',
      email: sch.email || '',
      userId: sch.userId || '',
      password: sch.password || 'school123',
      schoolName: sch.schoolName || sch.name || '',
      subtitle: sch.subtitle || 'TENKASI DISTRICT',
      motto: sch.motto || 'KNOWLEDGE • CHARACTER • SERVICE'
    });
    setShowAddModal(true);
  };

  // Save Add / Edit School
  const handleSaveSchool = (e) => {
    e.preventDefault();
    if (!schoolForm.name.trim()) {
      showToast('Please enter the school or institution name.');
      return;
    }
    if (!schoolForm.userId.trim()) {
      showToast('Please enter a login User ID for this school.');
      return;
    }

    const payload = {
      ...schoolForm,
      name: schoolForm.name.trim(),
      branch: activeBranch,
      schoolName: (schoolForm.schoolName || schoolForm.name).slice(0, 16).toUpperCase(),
      subtitle: (schoolForm.subtitle || 'VISION FOUNDATION').slice(0, 22).toUpperCase(),
      motto: (schoolForm.motto || 'EDUCATION • EMPOWERMENT • EXCELLENCE').slice(0, 30).toUpperCase()
    };

    if (editingSchool) {
      updateStoredSchool(editingSchool.id, payload);
      showToast(`Updated school "${payload.name}"!`);
    } else {
      addStoredSchool(payload);
      showToast(`Added new school "${payload.name}"!`);
    }

    setSchools(getStoredSchools(activeBranch));
    setShowAddModal(false);
  };

  // Handle Delete School
  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteStoredSchool(id);
      setSchools(getStoredSchools(activeBranch));
      showToast(`Removed school "${name}"`);
    }
  };

  // Direct Jump to School Dashboard
  const handleGoToSchoolDashboard = (school) => {
    // Preserve current admin session for seamless return to branch admin
    const currentActive = getActiveSession();
    if (currentActive && (currentActive.role === 'Branch Head' || currentActive.role === 'Super Admin')) {
      sessionStorage.setItem('bsel_admin_return_session', JSON.stringify(currentActive));
    }

    const b = getSchoolBranding(school.id) || {};
    const sessionPayload = {
      ...school,
      role: 'School',
      schoolRole: 'School',
      studentName: school.name,
      name: school.name,
      institution: school.name,
      branch: school.branch || activeBranch,
      schoolId: school.id,
      franchiseId: school.id,
      schoolName: b.schoolName || school.schoolName || school.name,
      subtitle: b.subtitle || school.subtitle || 'VISION FOUNDATION',
      motto: b.motto || school.motto || 'EDUCATION • EMPOWERMENT • EXCELLENCE',
      logo: b.logo !== undefined ? b.logo : (school.logo || null),
      signature: b.signature !== undefined ? b.signature : (school.signature || null),
      directorSignature: b.signature !== undefined ? b.signature : (school.signature || null)
    };

    try {
      const currentAdmin = getActiveSession();
      if (currentAdmin) {
        sessionStorage.setItem('bsel_admin_return_session', JSON.stringify(currentAdmin));
      }
      sessionStorage.setItem('bsel_admin_return_branch', activeBranch);
      sessionStorage.setItem('bsel_active_admin_role', 'Branch Head');
      sessionStorage.setItem('bsel_active_session', JSON.stringify(sessionPayload));
      localStorage.setItem('bsel_active_session', JSON.stringify(sessionPayload));
    } catch (_) {}

    sessionStorage.setItem('bsel_franchise_active_tab', 'franchise_overview');
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('page', 'franchise_portal');
        url.searchParams.set('tab', 'franchise_overview');
        window.history.pushState(null, '', url.toString());
      } catch (_) {}
    }
    setActiveSession(sessionPayload);
    showToast(`Opening School Dashboard for ${school.name}...`);
    setActivePage('franchise_portal');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner & Header Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#0c234b] text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
            <School className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Affiliated Schools Network
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                {activeBranch}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-950 mt-0.5">
              Affiliated School Management
            </h2>
            <p className="text-xs text-slate-500">
              Manage affiliated schools, configure login credentials, and jump directly to each School Dashboard.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-[#0c234b] hover:bg-[#153a78] text-white text-xs font-black rounded-xl transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add New School</span>
          </button>
        </div>
      </div>

      {/* Schools Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-5">
        {schools.map((sch) => (
          <div
            key={sch.id}
            className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-2.5 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-2 sm:gap-4 group"
          >
            {/* Top Info Header */}
            <div>
              <div className="flex items-start justify-between gap-1 sm:gap-2">
                <div className="flex items-start gap-1.5 sm:gap-2 min-w-0">
                  <span className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0 mt-1 sm:mt-1.5"></span>
                  <h3 className="text-[11px] sm:text-base font-black text-slate-950 group-hover:text-blue-900 transition leading-tight sm:leading-snug line-clamp-2" title={sch.name}>
                    {sch.name}
                  </h3>
                </div>
                <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleDelete(sch.id, sch.name)}
                    className="p-1 sm:p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                    title="Delete School"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              {/* Location & Coordinator */}
              <div className="mt-1.5 sm:mt-2 space-y-0.5 sm:space-y-1 text-[9.5px] sm:text-xs text-slate-600">
                <p className="flex items-center gap-1 sm:gap-1.5 text-slate-700 font-semibold truncate">
                  <MapPin className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-sky-600 shrink-0" />
                  <span className="truncate">{sch.address || `${sch.city}, Tamil Nadu`}</span>
                </p>
                <p className="flex items-center gap-1 sm:gap-1.5 truncate">
                  <span className="font-bold text-slate-500">Coordinator:</span>
                  <span className="font-bold text-slate-800 truncate">{sch.coordinator || 'Centre Incharge'}</span>
                </p>
                {sch.phone && (
                  <p className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[11px] text-slate-500 truncate">
                    <Phone className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{sch.phone}</span>
                  </p>
                )}
              </div>

              {/* SCHOOL LOGIN ACCESS BOX */}
              <div className="mt-2 sm:mt-3.5 p-1.5 sm:p-3 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1 sm:gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[8.5px] sm:text-[10px] font-black uppercase text-slate-500 flex items-center gap-0.5 sm:gap-1 truncate">
                    <KeyRound className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-500 shrink-0" />
                    <span className="truncate">Login Access</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(sch)}
                    className="text-[8.5px] sm:text-[10px] font-bold text-sky-700 hover:underline flex items-center gap-0.5 sm:gap-1 cursor-pointer shrink-0"
                  >
                    <Edit2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    Edit
                  </button>
                </div>

                {/* User ID */}
                <div className="flex items-center justify-between bg-white px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 text-[10px] sm:text-xs">
                  <span className="font-mono text-slate-800 font-bold truncate">
                    {sch.userId}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(sch.userId, 'User ID')}
                    className="text-slate-400 hover:text-slate-700 p-0.5 ml-1 cursor-pointer shrink-0"
                    title="Copy User ID"
                  >
                    <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>

                {/* Password */}
                <div className="flex items-center justify-between bg-white px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 text-[10px] sm:text-xs">
                  <span className="font-mono text-slate-800 font-bold truncate">
                    {visiblePasswords[sch.id] ? sch.password : '••••••••'}
                  </span>
                  <div className="flex items-center gap-0.5 sm:gap-1 text-slate-400 ml-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(sch.id)}
                      className="hover:text-slate-700 p-0.5 cursor-pointer"
                      title={visiblePasswords[sch.id] ? "Hide password" : "Show password"}
                    >
                      {visiblePasswords[sch.id] ? <EyeOff className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(sch.password, 'Password')}
                      className="hover:text-slate-700 p-0.5 cursor-pointer"
                      title="Copy Password"
                    >
                      <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-1 sm:space-y-2 pt-1.5 sm:pt-2 border-t border-slate-100">
              {/* PRIMARY: Go to School Dashboard Button */}
              <button
                type="button"
                onClick={() => handleGoToSchoolDashboard(sch)}
                className="w-full py-1.5 sm:py-2.5 px-1.5 sm:px-4 bg-[#0c234b] hover:bg-[#163e7c] active:scale-98 text-white font-black text-[10.5px] sm:text-xs rounded-lg sm:rounded-xl shadow-sm transition flex items-center justify-center gap-1 sm:gap-2 cursor-pointer group-hover:bg-[#123068]"
              >
                <span className="sm:hidden">Go to Dashboard</span>
                <span className="hidden sm:inline">Go to School Dashboard</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 group-hover:translate-x-1 transition-transform shrink-0" />
              </button>

              {/* SECONDARY: Customize Certificate Branding for this specific School */}
              <button
                type="button"
                onClick={() => setBrandingModalSchool(sch)}
                className="w-full py-1.5 sm:py-2 px-1.5 sm:px-3 bg-amber-50 hover:bg-amber-100/80 border border-amber-300 text-amber-950 font-bold text-[9.5px] sm:text-xs rounded-lg sm:rounded-xl transition flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 shrink-0" />
                <span className="truncate">Certificate Branding</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DEDICATED SEPARATE CERTIFICATE BRANDING MODAL FOR SCHOOLS */}
      {brandingModalSchool && (
        <SchoolCertificateBrandingModal
          school={brandingModalSchool}
          isOpen={Boolean(brandingModalSchool)}
          onClose={() => setBrandingModalSchool(null)}
          onSave={(updated) => {
            const fresh = getStoredSchools(activeBranch);
            setSchools(fresh);
            if (updated) {
              setBrandingModalSchool(updated);
            }
          }}
          showToast={showToast}
        />
      )}

      {/* ADD / EDIT SCHOOL MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-3.5 sm:p-6 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2.5 sm:pb-3.5 border-b border-slate-100 mb-3 sm:mb-4">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
                  <School className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">
                    {editingSchool ? 'Edit Affiliated School' : 'Affiliate New School Centre'}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 truncate">
                    Set school credentials and affiliated centre details
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveSchool} className="space-y-3 sm:space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {/* School Name */}
                <div className="col-span-2">
                  <label className="font-bold text-slate-700 block mb-0.5 sm:mb-1 text-[11px] sm:text-xs">
                    School / Centre Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. St. Joseph's Matric Higher Secondary School"
                    value={schoolForm.name}
                    onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })}
                    className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0c234b]/20 focus:border-[#0c234b] text-xs"
                  />
                </div>

                {/* City / Town */}
                <div className="col-span-1">
                  <label className="font-bold text-slate-700 block mb-0.5 sm:mb-1 text-[11px] sm:text-xs truncate">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tenkasi"
                    value={schoolForm.city}
                    onChange={(e) => setSchoolForm({ ...schoolForm, city: e.target.value })}
                    className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0c234b]/20 focus:border-[#0c234b] text-xs"
                  />
                </div>

                {/* Phone / Mobile */}
                <div className="col-span-1">
                  <label className="font-bold text-slate-700 block mb-0.5 sm:mb-1 text-[11px] sm:text-xs truncate">
                    Phone / Mobile
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 98652 19131"
                    value={schoolForm.phone}
                    onChange={(e) => setSchoolForm({ ...schoolForm, phone: e.target.value })}
                    className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0c234b]/20 focus:border-[#0c234b] text-xs"
                  />
                </div>

                {/* Coordinator */}
                <div className="col-span-2">
                  <label className="font-bold text-slate-700 block mb-0.5 sm:mb-1 text-[11px] sm:text-xs truncate">
                    Coordinator / In-charge Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mrs. Priya Soundarajan"
                    value={schoolForm.coordinator}
                    onChange={(e) => setSchoolForm({ ...schoolForm, coordinator: e.target.value })}
                    className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0c234b]/20 focus:border-[#0c234b] text-xs"
                  />
                </div>

                {/* Address */}
                <div className="col-span-2">
                  <label className="font-bold text-slate-700 block mb-0.5 sm:mb-1 text-[11px] sm:text-xs">
                    Centre Address / Premises
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 15, Church Road, Tenkasi, Tamil Nadu"
                    value={schoolForm.address}
                    onChange={(e) => setSchoolForm({ ...schoolForm, address: e.target.value })}
                    className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0c234b]/20 focus:border-[#0c234b] text-xs"
                  />
                </div>

                {/* Login Credentials Box */}
                <div className="col-span-2 pt-1.5 sm:pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-black uppercase text-amber-600 flex items-center gap-1.5 mb-1.5 sm:mb-2">
                    <KeyRound className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500" />
                    School Login Credentials
                  </span>
                </div>

                {/* User ID */}
                <div className="col-span-1">
                  <label className="font-bold text-slate-700 block mb-0.5 sm:mb-1 text-[11px] sm:text-xs truncate">
                    Login User ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. school.stjosephs"
                    value={schoolForm.userId}
                    onChange={(e) => setSchoolForm({ ...schoolForm, userId: e.target.value.toLowerCase().trim() })}
                    className="w-full font-mono px-2.5 py-1.5 sm:px-3 sm:py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0c234b]/20 focus:border-[#0c234b] text-xs lowercase"
                  />
                </div>

                {/* Password */}
                <div className="col-span-1">
                  <label className="font-bold text-slate-700 block mb-0.5 sm:mb-1 text-[11px] sm:text-xs truncate">
                    Login Password *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. school123"
                    value={schoolForm.password}
                    onChange={(e) => setSchoolForm({ ...schoolForm, password: e.target.value })}
                    className="w-full font-mono px-2.5 py-1.5 sm:px-3 sm:py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0c234b]/20 focus:border-[#0c234b] text-xs"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:justify-end sm:gap-2.5 pt-3 sm:pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-full sm:w-auto px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-50 transition cursor-pointer flex items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingSchool ? 'Update School' : 'Affiliate School'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
