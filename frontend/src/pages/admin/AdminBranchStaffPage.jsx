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
  ArrowRight,
  ClipboardList
} from 'lucide-react';

import {
  getStoredStaff,
  saveStaffMember,
  deleteStaffMember
} from '../../utils/staffStorage';
import { setActiveSession } from '../../utils/authStorage';
import BranchStudentMarksheetPage from './BranchStudentMarksheetPage';

export default function AdminBranchStaffPage({
  activeBranch = 'Tenkasi Branch',
  setActivePage,
  showToast = () => {}
}) {
  const [staffList, setStaffList] = useState(() => getStoredStaff(activeBranch));
  const [activeSubTab, setActiveSubTab] = useState('staff'); // 'staff' | 'marksheet'
  const [selectedStaffForMarksheet, setSelectedStaffForMarksheet] = useState(null);
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
      assignedUnit: activeBranch
    });
    setFormError('');
    setShowModal(true);
  };

  // Open modal for editing existing staff
  const handleOpenEditModal = (staff) => {
    setEditingStaffId(staff.id);
    const aff = staff.affiliationType || (staff.institution?.includes('Franchise') ? 'Franchise' : (staff.institution?.includes('School') || staff.institution?.includes('Matric') ? 'School' : 'Branch'));
    setFormData({
      name: staff.name || '',
      designation: staff.designation || 'Academic Staff',
      userId: staff.userId || '',
      password: staff.password || '',
      phone: staff.phone || '',
      email: staff.email || '',
      affiliationType: aff,
      assignedUnit: staff.assignedUnit || staff.institution || activeBranch
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

    const assignedUnit = formData.assignedUnit || (formData.affiliationType === 'Franchise' ? 'Tenkasi City Franchise' : (formData.affiliationType === 'School' ? "St. Joseph's Matric Higher Secondary School" : activeBranch));
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
      assignedUnit: assignedUnit,
      affiliationType: formData.affiliationType || 'Branch',
      institution: assignedUnit,
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
    const sessionData = {
      ...staff,
      userId: staff.userId,
      role: 'Staff',
      name: staff.name,
      studentName: staff.name,
      branch: activeBranch
    };
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

  if (activeSubTab === 'marksheet' || selectedStaffForMarksheet) {
    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        <BranchStudentMarksheetPage
          activeBranch={activeBranch}
          portalType="staff"
          entityName={selectedStaffForMarksheet ? `${selectedStaffForMarksheet.name} (${selectedStaffForMarksheet.designation || 'Staff'})` : 'Staff Management'}
          entityId={selectedStaffForMarksheet?.id}
          title={selectedStaffForMarksheet ? `${selectedStaffForMarksheet.name} Marksheet` : 'Staff Student Marksheet'}
          subtitle="Weekly revision tests and final exam evaluation"
          onBack={() => {
            setSelectedStaffForMarksheet(null);
            setActiveSubTab('staff');
          }}
        />
      </div>
    );
  }

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
          {/* Sub-tab navigation */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => { setSelectedStaffForMarksheet(null); setActiveSubTab('staff'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'staff' && !selectedStaffForMarksheet
                  ? 'bg-white text-[#0c234b] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Staff Faculty</span>
            </button>
            <button
              type="button"
              onClick={() => { setSelectedStaffForMarksheet(null); setActiveSubTab('marksheet'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'marksheet'
                  ? 'bg-[#0c234b] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5 text-amber-400" />
              <span>Student Marksheet</span>
            </button>
          </div>

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((staff) => {
          const passKey = `staff_pass_${staff.id || staff.userId}`;
          const isPassVisible = !!visiblePasswords[passKey];

          return (
            <div
              key={staff.id || staff.userId}
              className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between gap-3 relative"
            >
              {/* Top Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0c234b] to-[#1e3a8a] text-amber-400 font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                    {staff.name?.slice(0, 2).toUpperCase() || 'ST'}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-black text-slate-950 truncate leading-snug">
                      {staff.name}
                    </h3>
                    <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                      <span className="text-[11px] font-bold text-sky-700 block truncate">
                        {staff.designation || 'Academic Staff'}
                      </span>
                      {staff.affiliationType === 'Franchise' || staff.institution?.includes('Franchise') ? (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 text-[9px] font-black uppercase">
                          <Building className="w-2.5 h-2.5" />
                          Franchise Staff
                        </span>
                      ) : staff.affiliationType === 'School' || staff.institution?.includes('School') || staff.institution?.includes('Matric') ? (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[9px] font-black uppercase">
                          <School className="w-2.5 h-2.5" />
                          School Staff
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-sky-50 border border-sky-200 text-sky-800 text-[9px] font-black uppercase">
                          Branch Staff
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(staff)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Edit Staff Credentials"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(staff)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete Staff Account"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-medium pt-0.5 border-t border-slate-100">
                {staff.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{staff.phone}</span>
                  </span>
                )}
                {staff.email && (
                  <span className="flex items-center gap-1 truncate max-w-[200px]">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span className="truncate">{staff.email}</span>
                  </span>
                )}
              </div>

              {/* Credentials Box */}
              <div className="bg-slate-50/80 border border-slate-200/90 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <KeyRound className="w-3 h-3 text-amber-500" />
                    <span>Staff Login Credentials</span>
                  </span>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    Active
                  </span>
                </div>

                {/* User ID */}
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400">User ID / Username</span>
                  <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs">
                    <code className="font-mono font-bold text-slate-900 truncate">
                      {staff.userId}
                    </code>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(staff.userId, `uid_${staff.userId}`)}
                      className="text-slate-400 hover:text-slate-700 p-0.5 ml-2 cursor-pointer"
                      title="Copy User ID"
                    >
                      {copiedKey === `uid_${staff.userId}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400">Password</span>
                  <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs">
                    <span className="font-mono font-bold text-slate-900">
                      {isPassVisible ? staff.password : '••••••••••••'}
                    </span>
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(passKey)}
                        className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                        title={isPassVisible ? 'Hide Password' : 'Show Password'}
                      >
                        {isPassVisible ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(staff.password, `pass_${staff.userId}`)}
                        className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                        title="Copy Password"
                      >
                        {copiedKey === `pass_${staff.userId}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
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
                className="w-full py-2 px-3 rounded-xl bg-[#0c234b] hover:bg-[#163e7c] text-white text-xs font-black flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition cursor-pointer group"
                title={`Open Staff Portal as ${staff.name}`}
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Go to Staff Portal</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Direct Open Student Marksheet for Staff */}
              <button
                type="button"
                onClick={() => setSelectedStaffForMarksheet(staff)}
                className="w-full py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                title={`Enter student marks for ${staff.name}`}
              >
                <ClipboardList className="w-3.5 h-3.5 text-sky-600" />
                <span>Student Marksheet</span>
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#0c234b] text-white p-4.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 text-amber-400 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black">
                    {editingStaffId ? 'Edit Staff Credentials' : 'Create Staff Login Credentials'}
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Assigned to {activeBranch}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmitForm} className="p-5 space-y-3.5 text-xs">
              {formError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold">
                  {formError}
                </div>
              )}

              {/* Staff Full Name */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Staff Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. R. Kaviya, M. Sivakumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0c234b]/20 focus:border-[#0c234b]"
                />
              </div>

              {/* User ID / Login Username */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Staff User ID / Username *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. staff.tenkasi.kaviya"
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    className="w-full font-mono text-xs font-bold pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0c234b]/20 focus:border-[#0c234b]"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Staff uses this User ID on the Login screen.</p>
              </div>

              {/* Password */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Staff Login Password *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter or generate password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full font-mono text-xs font-bold pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0c234b]/20 focus:border-[#0c234b]"
                  />
                  <KeyRound className="w-3.5 h-3.5 text-amber-500 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Phone & Email Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0c234b]/20 focus:border-[#0c234b]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="staff@bsel.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0c234b]/20 focus:border-[#0c234b]"
                  />
                </div>
              </div>

              {/* Branch Tag (Locked) */}
              <div className="bg-sky-50 border border-sky-200 p-2.5 rounded-xl flex items-center justify-between">
                <span className="text-[11px] font-bold text-sky-900 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-sky-700" />
                  <span>Assigned Branch:</span>
                </span>
                <span className="text-xs font-black text-[#0c234b]">{activeBranch}</span>
              </div>

              {/* Assigned Unit / Category */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Assigned Unit / Department
                </label>
                <select
                  value={formData.affiliationType || 'Branch'}
                  onChange={(e) => {
                    const aff = e.target.value;
                    let unitName = activeBranch;
                    if (aff === 'Franchise') unitName = 'Tenkasi City Franchise';
                    if (aff === 'School') unitName = "St. Joseph's Matric Higher Secondary School";
                    setFormData({
                      ...formData,
                      affiliationType: aff,
                      assignedUnit: unitName
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0c234b]/20 focus:border-[#0c234b]"
                >
                  <option value="Branch">Branch Staff — {activeBranch}</option>
                  <option value="Franchise">Franchise Staff — Tenkasi City Franchise</option>
                  <option value="School">School Staff — St. Joseph's Matric Higher Secondary School</option>
                </select>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0c234b] hover:bg-[#163e7c] text-white font-black shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-amber-400" />
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
