import React, { useState, useEffect, useRef } from 'react';
import {
  Building2,
  Building,
  Plus,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Edit2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Users,
  Award,
  KeyRound,
  ShieldCheck,
  X,
  Save,
  Image as ImageIcon,
  PenTool
} from 'lucide-react';

import {
  getStoredFranchises,
  addStoredFranchise,
  updateStoredFranchise,
  deleteStoredFranchise,
  getFranchiseBranding
} from '../../utils/franchiseStorage';
import { setActiveSession, getActiveSession } from '../../utils/authStorage';
import FranchiseCertificateBrandingModal from '../../components/FranchiseCertificateBrandingModal';

export default function AdminBranchFranchisesPage({
  activeBranch = 'Tenkasi Branch',
  showToast = () => {},
  setActivePage = () => {},
  handleTabSelect
}) {
  const [franchises, setFranchises] = useState(() => getStoredFranchises(activeBranch));
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFranchise, setEditingFranchise] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [brandingModalFranchise, setBrandingModalFranchise] = useState(null);

  // Hidden file inputs for modal
  const modalLogoRef = useRef(null);
  const modalSignRef = useRef(null);

  // Form State for Add / Edit Franchise
  const [franchiseForm, setFranchiseForm] = useState({
    name: '',
    code: '',
    city: '',
    address: '',
    coordinator: '',
    phone: '',
    email: '',
    userId: '',
    password: '',
    schoolName: '',
    subtitle: 'VISION FOUNDATION',
    motto: 'EDUCATION • EMPOWERMENT • EXCELLENCE',
    logo: null,
    signature: null,
    studentsCount: 0
  });

  // Listen for storage updates
  useEffect(() => {
    const handleUpdate = () => {
      setFranchises(getStoredFranchises(activeBranch));
    };
    window.addEventListener('bsel_franchises_updated', handleUpdate);
    return () => window.removeEventListener('bsel_franchises_updated', handleUpdate);
  }, [activeBranch]);

  // Toggle password visibility
  const togglePasswordVisibility = (id) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Copy to clipboard
  const handleCopy = (text, label) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast(`Copied ${label} to clipboard!`);
    }
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    const nextNum = (franchises.length + 101);
    setEditingFranchise(null);
    setFranchiseForm({
      name: '',
      city: 'Tenkasi',
      address: '',
      coordinator: '',
      phone: '',
      email: '',
      userId: `franchise.fc${nextNum}`,
      password: 'franchise123',
      schoolName: '',
      subtitle: 'VISION FOUNDATION',
      motto: 'EDUCATION • EMPOWERMENT • EXCELLENCE',
      logo: null,
      signature: null,
      studentsCount: 0
    });
    setShowAddModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (f) => {
    setEditingFranchise(f);
    setFranchiseForm({
      name: f.name || '',
      city: f.city || '',
      address: f.address || '',
      coordinator: f.coordinator || '',
      phone: f.phone || '',
      email: f.email || '',
      userId: f.userId || '',
      password: f.password || 'franchise123',
      schoolName: f.schoolName || '',
      subtitle: f.subtitle || 'VISION FOUNDATION',
      motto: f.motto || 'EDUCATION • EMPOWERMENT • EXCELLENCE',
      logo: f.logo || null,
      signature: f.signature || null,
      studentsCount: f.studentsCount || 0
    });
    setShowAddModal(true);
  };

  // Handle Save Form
  const handleSaveFranchise = (e) => {
    e.preventDefault();
    if (!franchiseForm.name.trim()) {
      showToast('Please enter Franchise Name');
      return;
    }

    const payload = {
      ...franchiseForm,
      name: franchiseForm.name.trim(),
      branch: activeBranch,
      schoolName: (franchiseForm.schoolName || franchiseForm.name).slice(0, 16).toUpperCase(),
      subtitle: (franchiseForm.subtitle || 'VISION FOUNDATION').slice(0, 22).toUpperCase(),
      motto: (franchiseForm.motto || 'EDUCATION • EMPOWERMENT • EXCELLENCE').slice(0, 30).toUpperCase()
    };

    if (editingFranchise) {
      updateStoredFranchise(editingFranchise.id, payload);
      showToast(`Updated franchise ${payload.name}!`);
    } else {
      addStoredFranchise(payload);
      showToast(`Added new franchise ${payload.name}!`);
    }

    setFranchises(getStoredFranchises(activeBranch));
    setShowAddModal(false);
  };

  // Handle Delete
  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteStoredFranchise(id);
      setFranchises(getStoredFranchises(activeBranch));
      showToast(`Removed franchise ${name}`);
    }
  };

  // Direct Jump to Franchise Dashboard
  const handleGoToFranchiseDashboard = (franchise) => {
    // Preserve current admin session for seamless return to branch admin
    const currentActive = getActiveSession();
    if (currentActive && (currentActive.role === 'Branch Head' || currentActive.role === 'Super Admin')) {
      sessionStorage.setItem('bsel_admin_return_session', JSON.stringify(currentActive));
    }

    const b = getFranchiseBranding(franchise.id) || {};
    const sessionPayload = {
      ...franchise,
      role: 'Franchise',
      studentName: franchise.name,
      name: franchise.name,
      institution: franchise.name,
      branch: franchise.branch || activeBranch,
      franchiseId: franchise.id,
      schoolName: b.schoolName || franchise.schoolName || franchise.name,
      subtitle: b.subtitle || franchise.subtitle || 'VISION FOUNDATION',
      motto: b.motto || franchise.motto || 'EDUCATION • EMPOWERMENT • EXCELLENCE',
      logo: b.logo !== undefined ? b.logo : (franchise.logo || null),
      signature: b.signature !== undefined ? b.signature : (franchise.signature || null),
      directorSignature: b.signature !== undefined ? b.signature : (franchise.signature || null)
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

    setActiveSession(sessionPayload);
    showToast(`Opening Franchise Dashboard for ${franchise.name}...`);
    setActivePage('franchise_portal');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner & Header Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#0c234b] text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Regional Franchise Network
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                {activeBranch}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-950 mt-0.5">
              Authorized Franchise Management
            </h2>
            <p className="text-xs text-slate-500">
              Manage learning centre franchises, configure login credentials, and jump directly to each Franchise Dashboard.
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
            <span>Add New Franchise</span>
          </button>
        </div>
      </div>

      {/* Franchises Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-5">
        {franchises.map((fc) => (
          <div
            key={fc.id}
            className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-3 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-2.5 sm:gap-4 group"
          >
            {/* Top Info Header */}
            <div>
              <div className="flex items-start justify-between gap-1.5 sm:gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                  <h3 className="text-xs sm:text-base font-black text-slate-950 group-hover:text-blue-900 transition leading-snug line-clamp-2">
                    {fc.name}
                  </h3>
                </div>
                <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleDelete(fc.id, fc.name)}
                    className="p-1 sm:p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                    title="Delete Franchise"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              {/* Location & Coordinator */}
              <div className="mt-2 space-y-0.5 sm:space-y-1 text-[10px] sm:text-xs text-slate-600">
                <p className="flex items-center gap-1 sm:gap-1.5 text-slate-700 font-semibold truncate">
                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-600 shrink-0" />
                  <span className="truncate">{fc.address || `${fc.city}, Tamil Nadu`}</span>
                </p>
                <p className="flex items-center gap-1 sm:gap-1.5 truncate">
                  <span className="font-bold text-slate-500">Coordinator:</span>
                  <span className="font-bold text-slate-800 truncate">{fc.coordinator}</span>
                </p>
                {fc.phone && (
                  <p className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[11px] text-slate-500 truncate">
                    <Phone className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{fc.phone}</span>
                  </p>
                )}
              </div>

              {/* FRANCHISE LOGIN ACCESS BOX */}
              <div className="mt-2.5 sm:mt-3.5 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1.5 sm:gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase text-slate-500 flex items-center gap-1 truncate">
                    <KeyRound className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-500 shrink-0" />
                    <span className="truncate">Login Access</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(fc)}
                    className="text-[9px] sm:text-[10px] font-bold text-sky-700 hover:underline flex items-center gap-0.5 sm:gap-1 cursor-pointer shrink-0"
                  >
                    <Edit2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    Edit
                  </button>
                </div>

                {/* User ID */}
                <div className="flex items-center justify-between bg-white px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 text-[11px] sm:text-xs">
                  <span className="font-mono text-slate-800 font-bold truncate max-w-[120px] sm:max-w-[170px]">
                    {fc.userId}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(fc.userId, 'User ID')}
                    className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer shrink-0"
                    title="Copy User ID"
                  >
                    <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>

                {/* Password */}
                <div className="flex items-center justify-between bg-white px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 text-[11px] sm:text-xs">
                  <span className="font-mono text-slate-800 font-bold truncate">
                    {visiblePasswords[fc.id] ? fc.password : '••••••••••'}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400 shrink-0">
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(fc.id)}
                      className="hover:text-slate-700 p-0.5 cursor-pointer"
                      title={visiblePasswords[fc.id] ? "Hide password" : "Show password"}
                    >
                      {visiblePasswords[fc.id] ? <EyeOff className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(fc.password, 'Password')}
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
            <div className="space-y-1.5 sm:space-y-2 pt-2 border-t border-slate-100">
              {/* PRIMARY: Go to Franchise Dashboard Button */}
              <button
                type="button"
                onClick={() => handleGoToFranchiseDashboard(fc)}
                className="w-full py-1.5 sm:py-2.5 px-2 sm:px-4 bg-[#0c234b] hover:bg-[#163e7c] active:scale-98 text-white font-black text-[11px] sm:text-xs rounded-lg sm:rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer group-hover:bg-[#123068]"
              >
                <span className="truncate">Go to Franchise Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 group-hover:translate-x-1 transition-transform shrink-0" />
              </button>

              {/* SECONDARY: Customize Certificate Branding for this specific Franchise */}
              <button
                type="button"
                onClick={() => setBrandingModalFranchise(fc)}
                className="w-full py-1.5 sm:py-2 px-2 sm:px-3 bg-amber-50 hover:bg-amber-100/80 border border-amber-300 text-amber-950 font-bold text-[10px] sm:text-xs rounded-lg sm:rounded-xl transition flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 shrink-0" />
                <span className="truncate">Certificate Branding</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DEDICATED SEPARATE CERTIFICATE BRANDING MODAL (Stores details uniquely in that franchise) */}
      {brandingModalFranchise && (
        <FranchiseCertificateBrandingModal
          franchise={brandingModalFranchise}
          isOpen={Boolean(brandingModalFranchise)}
          onClose={() => setBrandingModalFranchise(null)}
          onSave={(updated) => {
            const fresh = getStoredFranchises(activeBranch);
            setFranchises(fresh);
            if (updated) {
              setBrandingModalFranchise(updated);
            }
          }}
          showToast={showToast}
        />
      )}

      {/* ADD / EDIT FRANCHISE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950">
                    {editingFranchise ? 'Edit Franchise Centre' : 'Add New Franchise Centre'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Set franchise credentials and affiliated centre details
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFranchise} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Franchise Name */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">
                    Franchise / Centre Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={franchiseForm.name}
                    onChange={(e) => setFranchiseForm({ ...franchiseForm, name: e.target.value })}
                    placeholder="e.g. Tenkasi City Franchise"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:bg-white focus:border-sky-500 outline-none"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    required
                    value={franchiseForm.city}
                    onChange={(e) => setFranchiseForm({ ...franchiseForm, city: e.target.value })}
                    placeholder="e.g. Tenkasi"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold focus:bg-white focus:border-sky-500 outline-none"
                  />
                </div>

                {/* Coordinator Name */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Coordinator / In-charge Name
                  </label>
                  <input
                    type="text"
                    value={franchiseForm.coordinator}
                    onChange={(e) => setFranchiseForm({ ...franchiseForm, coordinator: e.target.value })}
                    placeholder="e.g. Mrs. Priya Soundarajan"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold focus:bg-white focus:border-sky-500 outline-none"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Phone / Mobile
                  </label>
                  <input
                    type="tel"
                    value={franchiseForm.phone}
                    onChange={(e) => setFranchiseForm({ ...franchiseForm, phone: e.target.value })}
                    placeholder="e.g. 9865219131"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold focus:bg-white focus:border-sky-500 outline-none"
                  />
                </div>

                {/* Full Address */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">
                    Centre Address / Premises
                  </label>
                  <input
                    type="text"
                    value={franchiseForm.address}
                    onChange={(e) => setFranchiseForm({ ...franchiseForm, address: e.target.value })}
                    placeholder="e.g. 12, Main Bazaar Road, Tenkasi"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold focus:bg-white focus:border-sky-500 outline-none"
                  />
                </div>

                {/* Credentials Divider */}
                <div className="sm:col-span-2 pt-2 border-t border-slate-200">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-2">
                    <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                    Franchise Login Credentials
                  </h4>
                </div>

                {/* Login User ID */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Login User ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={franchiseForm.userId}
                    onChange={(e) => setFranchiseForm({ ...franchiseForm, userId: e.target.value.toLowerCase().trim() })}
                    placeholder="e.g. franchise.tenkasi"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold focus:bg-white focus:border-sky-500 outline-none lowercase"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Login Password *
                  </label>
                  <input
                    type="text"
                    required
                    value={franchiseForm.password}
                    onChange={(e) => setFranchiseForm({ ...franchiseForm, password: e.target.value })}
                    placeholder="e.g. franchise123"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold focus:bg-white focus:border-sky-500 outline-none"
                  />
                </div>

              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black transition cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingFranchise ? 'Update Franchise' : 'Save Franchise'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
