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
    const b = getSchoolBranding(school.id) || {};
    const sessionPayload = {
      ...school,
      role: 'Franchise', // Uses the full student management & certificate desk portal
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
      sessionStorage.setItem('bsel_active_session', JSON.stringify(sessionPayload));
      localStorage.setItem('bsel_active_session', JSON.stringify(sessionPayload));
    } catch (_) {}

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
            <span>+ Add New School</span>
          </button>
        </div>
      </div>

      {/* Schools Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {schools.map((sch) => (
          <div
            key={sch.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
          >
            {/* Top Info Header */}
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                  <h3 className="text-base font-black text-slate-950 group-hover:text-blue-900 transition">
                    {sch.name}
                  </h3>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleDelete(sch.id, sch.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                    title="Delete School"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Location & Coordinator */}
              <div className="mt-2.5 space-y-1 text-xs text-slate-600">
                <p className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>{sch.address || `${sch.city}, Tamil Nadu`}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-500">Coordinator:</span>
                  <span className="font-bold text-slate-800">{sch.coordinator || 'Centre Incharge'}</span>
                </p>
                {sch.phone && (
                  <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{sch.phone}</span>
                  </p>
                )}
              </div>

              {/* SCHOOL LOGIN ACCESS BOX */}
              <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-1.5">
                    <KeyRound className="w-3 h-3 text-amber-500" />
                    School Login Access
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(sch)}
                    className="text-[10px] font-bold text-sky-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </button>
                </div>

                {/* User ID */}
                <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs">
                  <span className="font-mono text-slate-800 font-bold truncate max-w-[170px]">
                    {sch.userId}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(sch.userId, 'User ID')}
                    className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                    title="Copy User ID"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Password */}
                <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs">
                  <span className="font-mono text-slate-800 font-bold">
                    {visiblePasswords[sch.id] ? sch.password : '••••••••••'}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400">
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(sch.id)}
                      className="hover:text-slate-700 p-0.5 cursor-pointer"
                      title={visiblePasswords[sch.id] ? "Hide password" : "Show password"}
                    >
                      {visiblePasswords[sch.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(sch.password, 'Password')}
                      className="hover:text-slate-700 p-0.5 cursor-pointer"
                      title="Copy Password"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              {/* PRIMARY: Go to School Dashboard Button */}
              <button
                type="button"
                onClick={() => handleGoToSchoolDashboard(sch)}
                className="w-full py-2.5 px-4 bg-[#0c234b] hover:bg-[#163e7c] active:scale-98 text-white font-black text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer group-hover:bg-[#123068]"
              >
                <span>Go to School Dashboard</span>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* SECONDARY: Customize Certificate Branding for this specific School */}
              <button
                type="button"
                onClick={() => setBrandingModalSchool(sch)}
                className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100/80 border border-amber-300 text-amber-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Customize Certificate Branding</span>
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
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {editingSchool ? 'Edit Affiliated School' : 'Affiliate New School Centre'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Set school credentials and affiliated centre details
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveSchool} className="mt-4 space-y-3.5 text-xs">
              {/* School Name */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  School / Centre Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. St. Joseph's Matric Higher Secondary School"
                  value={schoolForm.name}
                  onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0c234b]/20 focus:border-[#0c234b]"
                />
              </div>

              {/* City / Town */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  City / Town *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tenkasi"
                  value={schoolForm.city}
                  onChange={(e) => setSchoolForm({ ...schoolForm, city: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0c234b]/20 focus:border-[#0c234b]"
                />
              </div>

              {/* Coordinator & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Coordinator / In-charge Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mrs. Priya Soundarajan"
                    value={schoolForm.coordinator}
                    onChange={(e) => setSchoolForm({ ...schoolForm, coordinator: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0c234b]/20 focus:border-[#0c234b]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Phone / Mobile
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 98652 19131"
                    value={schoolForm.phone}
                    onChange={(e) => setSchoolForm({ ...schoolForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0c234b]/20 focus:border-[#0c234b]"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Centre Address / Premises
                </label>
                <input
                  type="text"
                  placeholder="e.g. 15, Church Road, Near New Bus Stand, Tenkasi, Tamil Nadu"
                  value={schoolForm.address}
                  onChange={(e) => setSchoolForm({ ...schoolForm, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0c234b]/20 focus:border-[#0c234b]"
                />
              </div>

              {/* Login Credentials Box */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-black uppercase text-amber-600 flex items-center gap-1.5 mb-2">
                  <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                  School Login Credentials
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Login User ID *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. school.stjosephs"
                      value={schoolForm.userId}
                      onChange={(e) => setSchoolForm({ ...schoolForm, userId: e.target.value.toLowerCase().trim() })}
                      className="w-full font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0c234b]/20 focus:border-[#0c234b]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Login Password *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. school123"
                      value={schoolForm.password}
                      onChange={(e) => setSchoolForm({ ...schoolForm, password: e.target.value })}
                      className="w-full font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0c234b]/20 focus:border-[#0c234b]"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
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
