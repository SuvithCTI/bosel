import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  KeyRound,
  Copy,
  Check,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  Phone,
  Mail,
  Building,
  School,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  X,
  Lock,
  UserCheck,
  Award,
  RefreshCw,
  ArrowRight
} from 'lucide-react';

import {
  getStoredStaff,
  saveStaffMember,
  deleteStaffMember
} from '../../utils/staffStorage';
import { setActiveSession } from '../../utils/authStorage';

export default function AdminBranchStaffPage({
  activeBranch = 'Tenkasi Branch',
  setActivePage,
  showToast = () => {}
}) {
  const [staffList, setStaffList] = useState(() => getStoredStaff(activeBranch));
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    designation: 'Senior Academic Instructor',
    userId: '',
    password: '',
    phone: '',
    email: ''
  });
  const [formError, setFormError] = useState('');

  // Reload staff on branch change or external updates
  useEffect(() => {
    const reload = () => {
      setStaffList(getStoredStaff(activeBranch));
    };
    reload();
    window.addEventListener('bsel_staff_updated', reload);
    return () => window.removeEventListener('bsel_staff_updated', reload);
  }, [activeBranch]);

  const copyToClipboard = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`Copied: ${text}`);
    setTimeout(() => {
      setCopiedKey((curr) => (curr === key ? null : curr));
    }, 2000);
  };

  const togglePasswordVisibility = (key) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Open modal for new staff
  const handleOpenAddModal = () => {
    setEditingStaffId(null);
    const branchPrefix = activeBranch.toLowerCase().replace(/[^a-z0-9]/g, '').replace('branch', '') || 'branch';
    const randomSuffix = Math.floor(10 + Math.random() * 90);
    setFormData({
      name: '',
      designation: 'Senior Academic Instructor',
      userId: `staff.${branchPrefix}${randomSuffix}`,
      password: 'staff123',
      phone: '9865219131',
      email: '',
      affiliationType: 'Branch',
      assignedUnit: `Branch Staff — ${activeBranch}`
    });
    setFormError('');
    setShowModal(true);
  };

  // Open modal for editing existing staff
  const handleOpenEditModal = (staff) => {
    setEditingStaffId(staff.id);
    setFormData({
      name: staff.name || '',
      designation: staff.designation || 'Academic Staff',
      userId: staff.userId || '',
      password: staff.password || '',
      phone: staff.phone || '',
      email: staff.email || '',
      affiliationType: 'Branch',
      assignedUnit: `Branch Staff — ${activeBranch}`
    });
    setFormError('');
    setShowModal(true);
  };

  // Auto-generate suggested User ID based on staff name
  const handleGenerateUserId = () => {
    const branchClean = activeBranch.toLowerCase().replace(/[^a-z0-9]/g, '').replace('branch', '') || 'tenkasi';
    const nameClean = (formData.name || 'instructor').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8);
    const newUserId = `staff.${branchClean}.${nameClean || 'user'}`;
    setFormData((prev) => ({
      ...prev,
      userId: newUserId,
      email: prev.email || `${newUserId}@bsel.org`
    }));
  };

  // Quick generate password
  const handleGeneratePassword = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
    let rand = '';
    for (let i = 0; i < 4; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const branchClean = activeBranch.toLowerCase().replace(/[^a-z0-9]/g, '').replace('branch', '') || 'bsel';
    const newPass = `${branchClean}@${rand}`;
    setFormData((prev) => ({ ...prev, password: newPass }));
  };

  // Handle Save Staff
  const handleSubmitForm = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Please enter the staff member’s full name.');
      return;
    }
    if (!formData.userId.trim()) {
      setFormError('Please enter a valid User ID for login.');
      return;
    }
    if (!formData.password.trim()) {
      setFormError('Please enter a login password.');
      return;
    }

    const unitTitle = `Branch Staff — ${activeBranch}`;
    const payload = {
      id: editingStaffId || undefined,
      name: formData.name.trim(),
      designation: (formData.designation || 'Academic Staff').trim(),
      userId: formData.userId.trim().toLowerCase(),
      password: formData.password.trim(),
      phone: formData.phone.trim(),
      email: (formData.email.trim() || `${formData.userId.trim().toLowerCase()}@bsel.org`).toLowerCase(),
      branch: activeBranch,
      branchCode: 'BSEL-BR-101',
      assignedUnit: unitTitle,
      affiliationType: 'Branch',
      institution: activeBranch,
      status: 'Active'
    };

    const res = saveStaffMember(payload);
    if (!res.success) {
      setFormError(res.message || 'Unable to save staff member.');
      return;
    }

    setShowModal(false);
    showToast(editingStaffId ? `Updated ${payload.name}’s credentials!` : `Created login credentials for ${payload.name}!`);
    setStaffList(getStoredStaff(activeBranch));
  };

  // Handle Delete
  const handleDelete = (staff) => {
    if (!window.confirm(`Are you sure you want to delete staff account "${staff.name}" (${staff.userId})? They will no longer be able to log in.`)) {
      return;
    }
    const ok = deleteStaffMember(staff.id);
    if (ok) {
      showToast(`Deleted staff account ${staff.name}.`);
      setStaffList(getStoredStaff(activeBranch));
    }
  };

  // Direct switch to Staff Portal
  const handleSwitchToStaffPortal = (staff) => {
    try {
      const currentAdmin = getActiveSession();
      if (currentAdmin) {
        sessionStorage.setItem('bsel_admin_return_session', JSON.stringify(currentAdmin));
      }
      sessionStorage.setItem('bsel_admin_return_branch', activeBranch);
      sessionStorage.setItem('bsel_active_admin_role', 'Branch Head');
    } catch (_) {}

    const sessionData = {
      ...staff,
      userId: staff.userId,
      role: 'Staff',
      name: staff.name,
      studentName: staff.name,
      branch: activeBranch
    };
    sessionStorage.setItem('bsel_staff_active_tab', 'staff_overview');
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('page', 'staff');
        url.searchParams.set('tab', 'staff_overview');
        window.history.pushState(null, '', url.toString());
      } catch (_) {}
    }
    setActiveSession(sessionData);
    if (setActivePage) {
      setActivePage('staff');
    }
    showToast(`Logged in to Staff Portal as ${staff.name}`);
  };

  // Filter staff by search query
  const filteredStaff = useMemo(() => {
    if (!searchQuery.trim()) return staffList;
    const q = searchQuery.toLowerCase().trim();
    return staffList.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.userId?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.phone?.includes(q) ||
        s.designation?.toLowerCase().includes(q)
    );
  }, [staffList, searchQuery]);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#0c234b] text-amber-400 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
                <span>Branch Staff & Faculty Management</span>
                <span className="text-[10px] font-bold text-sky-800 bg-sky-100 border border-sky-200 px-2 py-0.5 rounded-full">
                  {activeBranch}
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Branch Administrator creates staff login credentials, instructors, and evaluation staff.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-56 lg:w-64 min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search staff name or ID..."
              className="w-full text-xs font-semibold pl-8 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c234b]/20 focus:border-[#0c234b]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Add Staff Button */}
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-[#0c234b] hover:bg-[#163e7c] text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap group"
          >
            <UserPlus className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Create Staff Login</span>
          </button>
        </div>
      </div>

      {/* Staff Grid Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
        {filteredStaff.map((staff) => {
          const passKey = `staff_pass_${staff.id || staff.userId}`;
          const isPassVisible = !!visiblePasswords[passKey];

          return (
            <div
              key={staff.id || staff.userId}
              className="bg-white p-2.5 sm:p-4.5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between gap-2 sm:gap-3 relative"
            >
              {/* Top Header */}
              <div className="flex items-start justify-between gap-1 sm:gap-2">
                <div className="flex items-start sm:items-center gap-1.5 sm:gap-2.5 min-w-0">
                  <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#0c234b] to-[#1e3a8a] text-amber-400 font-black text-[10px] sm:text-sm flex items-center justify-center shrink-0 shadow-xs mt-0.5 sm:mt-0">
                    {staff.name?.slice(0, 2).toUpperCase() || 'ST'}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-black text-slate-950 leading-tight sm:leading-snug line-clamp-1 sm:line-clamp-2" title={staff.name}>
                      {staff.name}
                    </h3>
                    <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap mt-0.5">
                      <span className="text-[9px] sm:text-[11px] font-bold text-sky-700 block truncate max-w-[80px] sm:max-w-none">
                        {staff.designation || 'Academic Staff'}
                      </span>
                      {staff.affiliationType === 'Franchise' || staff.institution?.includes('Franchise') ? (
                        <span className="inline-flex items-center gap-0.5 px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 text-[7.5px] sm:text-[9px] font-black uppercase">
                          <Building className="w-2.5 h-2.5" />
                          <span className="truncate">Franchise</span>
                        </span>
                      ) : staff.affiliationType === 'School' || staff.institution?.includes('School') || staff.institution?.includes('Matric') ? (
                        <span className="inline-flex items-center gap-0.5 px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[7.5px] sm:text-[9px] font-black uppercase">
                          <School className="w-2.5 h-2.5" />
                          <span className="truncate">School</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded bg-sky-50 border border-sky-200 text-sky-800 text-[7.5px] sm:text-[9px] font-black uppercase">
                          <span className="truncate">Branch Staff</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(staff)}
                    className="p-1 sm:p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Edit Staff Credentials"
                  >
                    <Edit3 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(staff)}
                    className="p-1 sm:p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete Staff Account"
                  >
                    <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-0.5 text-[9px] sm:text-[11px] text-slate-500 font-medium pt-1 border-t border-slate-100">
                {staff.phone && (
                  <span className="flex items-center gap-1 truncate">
                    <Phone className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{staff.phone}</span>
                  </span>
                )}
                {staff.email && (
                  <span className="flex items-center gap-1 truncate max-w-full sm:max-w-[200px]">
                    <Mail className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{staff.email}</span>
                  </span>
                )}
              </div>

              {/* Credentials Box */}
              <div className="bg-slate-50/80 border border-slate-200/90 rounded-lg sm:rounded-xl p-1.5 sm:p-3 space-y-1 sm:space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[8.5px] sm:text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-0.5 sm:gap-1 truncate">
                    <KeyRound className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-500 shrink-0" />
                    <span className="truncate">Credentials</span>
                  </span>
                  <span className="text-[7.5px] sm:text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded">
                    Active
                  </span>
                </div>

                {/* User ID */}
                <div className="space-y-0.5">
                  <span className="text-[8.5px] sm:text-[10px] font-bold text-slate-400 block">User ID / Username</span>
                  <div className="flex items-center justify-between bg-white px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 text-[10px] sm:text-xs">
                    <code className="font-mono font-bold text-slate-900 truncate">
                      {staff.userId}
                    </code>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(staff.userId, `uid_${staff.userId}`)}
                      className="text-slate-400 hover:text-slate-700 p-0.5 ml-1 cursor-pointer shrink-0"
                      title="Copy User ID"
                    >
                      {copiedKey === `uid_${staff.userId}` ? (
                        <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-0.5">
                  <span className="text-[8.5px] sm:text-[10px] font-bold text-slate-400 block">Password</span>
                  <div className="flex items-center justify-between bg-white px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 text-[10px] sm:text-xs">
                    <span className="font-mono font-bold text-slate-900 truncate">
                      {isPassVisible ? staff.password : '••••••••'}
                    </span>
                    <div className="flex items-center gap-0.5 sm:gap-1 ml-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(passKey)}
                        className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                        title={isPassVisible ? 'Hide Password' : 'Show Password'}
                      >
                        {isPassVisible ? (
                          <EyeOff className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        ) : (
                          <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(staff.password, `pass_${staff.userId}`)}
                        className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                        title="Copy Password"
                      >
                        {copiedKey === `pass_${staff.userId}` ? (
                          <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Open Staff Portal Action */}
              <button
                type="button"
                onClick={() => handleSwitchToStaffPortal(staff)}
                className="w-full py-1.5 sm:py-2 px-1.5 sm:px-3 rounded-lg sm:rounded-xl bg-[#0c234b] hover:bg-[#163e7c] text-white text-[10.5px] sm:text-xs font-black flex items-center justify-center gap-1 sm:gap-2 shadow-xs hover:shadow-md transition cursor-pointer group"
                title={`Open Staff Portal as ${staff.name}`}
              >
                <UserCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="sm:hidden">Staff Portal</span>
                <span className="hidden sm:inline">Go to Staff Portal</span>
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>
            </div>
          );
        })}

        {filteredStaff.length === 0 && (
          <div className="col-span-full bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-black text-slate-800">
              {searchQuery ? `No staff found matching "${searchQuery}"` : 'No staff members added for this branch yet.'}
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Branch Administrator can create staff login IDs and passwords so instructors can record student marks and view admission records.
            </p>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-[#0c234b] hover:bg-[#163e7c] text-white rounded-xl text-xs font-black transition inline-flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <UserPlus className="w-4 h-4 text-amber-400" />
              <span>Create First Staff Login</span>
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          MODAL: CREATE / EDIT STAFF MEMBER & CREDENTIALS
          ========================================================================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 my-auto max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#0c234b] text-white p-3.5 sm:p-4.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-white/10 text-amber-400 flex items-center justify-center shrink-0">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-black truncate">
                    {editingStaffId ? 'Edit Staff Credentials' : 'Create Staff Login Credentials'}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-300 truncate">
                    Assigned to {activeBranch}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmitForm} className="p-3.5 sm:p-5 space-y-2.5 sm:space-y-3.5 text-xs overflow-y-auto">
              {formError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold">
                  {formError}
                </div>
              )}

              {/* Staff Full Name */}
              <div>
                <label className="font-bold text-slate-700 block mb-0.5 sm:mb-1 text-[11px] sm:text-xs">
                  Staff Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. R. Kaviya, M. Sivakumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0c234b]/20 focus:border-[#0c234b] text-xs"
                />
              </div>

              {/* User ID & Password in 2-column mobile grid */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-0.5 sm:mb-1 text-[11px] sm:text-xs truncate">
                    Staff User ID *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. staff.tenkasi"
                      value={formData.userId}
                      onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                      className="w-full font-mono text-[11px] sm:text-xs font-bold pl-2.5 pr-6 sm:pr-8 py-1.5 sm:py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0c234b]/20 focus:border-[#0c234b]"
                    />
                    <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 absolute right-2 sm:right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-0.5 sm:mb-1 text-[11px] sm:text-xs truncate">
                    Login Password *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full font-mono text-[11px] sm:text-xs font-bold pl-2.5 pr-6 sm:pr-8 py-1.5 sm:py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0c234b]/20 focus:border-[#0c234b]"
                    />
                    <KeyRound className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 absolute right-2 sm:right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Phone & Email Grid (2-column on mobile) */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-0.5 sm:mb-1 text-[11px] sm:text-xs truncate">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="Mobile number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0c234b]/20 focus:border-[#0c234b] text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-0.5 sm:mb-1 text-[11px] sm:text-xs truncate">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="staff@bsel.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0c234b]/20 focus:border-[#0c234b] text-xs"
                  />
                </div>
              </div>

              {/* Branch Tag (Locked) */}
              <div className="bg-sky-50 border border-sky-200 p-2 sm:p-2.5 rounded-xl flex items-center justify-between">
                <span className="text-[10px] sm:text-[11px] font-bold text-sky-900 flex items-center gap-1 sm:gap-1.5 truncate">
                  <Building className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-700 shrink-0" />
                  <span className="truncate">Assigned Branch:</span>
                </span>
                <span className="text-[11px] sm:text-xs font-black text-[#0c234b] shrink-0">{activeBranch}</span>
              </div>

              {/* Assigned Unit / Department (Locked to Active Branch) */}
              <div>
                <label className="font-bold text-slate-700 block mb-0.5 sm:mb-1 text-[11px] sm:text-xs truncate flex items-center justify-between">
                  <span>Assigned Unit / Department</span>
                  <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" />
                    Locked to Branch
                  </span>
                </label>
                <div className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-700 text-xs flex items-center justify-between cursor-not-allowed select-none">
                  <span className="truncate">Branch Staff — {activeBranch}</span>
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-2.5 sm:pt-3 grid grid-cols-2 gap-2 sm:flex sm:items-center sm:justify-end sm:gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition cursor-pointer flex items-center justify-center text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#0c234b] hover:bg-[#163e7c] text-white font-black shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                >
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  <span>{editingStaffId ? 'Save Changes' : 'Create Staff Login'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
