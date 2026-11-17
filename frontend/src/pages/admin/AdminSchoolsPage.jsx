import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  Plus,
  MapPin,
  KeyRound,
  Copy,
  Check,
  Eye,
  EyeOff,
  Edit3,
  RotateCcw,
  ShieldCheck,
  Search,
  X,
  Lock,
  Mail,
  Building,
  LogIn,
  ArrowRight
} from 'lucide-react';
import {
  TAMIL_NADU_DISTRICTS,
  getStoredBranchCredentials,
  saveBranchCredentials,
  getDistrictSlug,
  getDefaultCredentialsForDistrict,
  getCredentialsForBranchOrSchool
} from '../../utils/branchAuthStorage';

export default function AdminSchoolsPage({
  schoolsList: _schoolsList,
  setShowAddSchoolModal,
  setActiveBranch,
  handleRoleSwitch,
  showToast = () => {}
}) {
  const [credentialsMap, setCredentialsMap] = useState(() => getStoredBranchCredentials());
  const [editingBranch, setEditingBranch] = useState(null);
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [branchSearch, setBranchSearch] = useState('');

  // Sync credentials on storage update events
  useEffect(() => {
    const handleUpdate = () => {
      setCredentialsMap(getStoredBranchCredentials());
    };
    window.addEventListener('bsel_branch_credentials_updated', handleUpdate);
    return () => window.removeEventListener('bsel_branch_credentials_updated', handleUpdate);
  }, []);

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

  const handleOpenEditModal = (schoolOrDistrict) => {
    const creds = getCredentialsForBranchOrSchool(schoolOrDistrict);
    setEditingBranch({
      slug: creds.slug,
      name: creds.branchName || creds.district,
      district: creds.district,
      originalEmail: creds.email,
      originalPassword: creds.password
    });
    setEditEmail(creds.email);
    setEditPassword(creds.password);
  };

  const handleSaveCredentials = (e) => {
    e?.preventDefault();
    if (!editingBranch) return;

    if (!editEmail.trim()) {
      alert('Email cannot be empty');
      return;
    }
    if (!editPassword.trim()) {
      alert('Password cannot be empty');
      return;
    }

    const success = saveBranchCredentials(editingBranch.slug, editEmail.trim(), editPassword.trim());
    if (success) {
      setCredentialsMap(getStoredBranchCredentials());
      showToast(`Credentials updated for ${editingBranch.name}!`);
      setEditingBranch(null);
    } else {
      alert('Failed to update credentials. Please try again.');
    }
  };

  const handleResetToFormula = () => {
    if (!editingBranch) return;
    const def = getDefaultCredentialsForDistrict(editingBranch.district || editingBranch.slug);
    setEditEmail(def.email);
    setEditPassword(def.password);
  };

  // Official 38 Tamil Nadu District Branches directly displayed on the page
  const all38DistrictBranches = useMemo(() => {
    return TAMIL_NADU_DISTRICTS.map((district, idx) => {
      const slug = getDistrictSlug(district);
      const creds = credentialsMap[slug] || getDefaultCredentialsForDistrict(district);
      const code = `BSEL-${slug.toUpperCase().slice(0, 3)}-${String(idx + 1).padStart(2, '0')}`;
      return {
        code,
        name: `B★SEL ${district} Branch`,
        branchName: `${district} Branch`,
        district,
        city: `${district}, Tamil Nadu`,
        principal: district === 'Tenkasi' ? 'Mrs. Thangam Sivaji' : `${district} Branch Director`,
        coordinator: district === 'Tenkasi' ? 'Mr. S. Sivakumar' : `${district} Branch Coordinator`,
        phone: district === 'Tenkasi' ? '+91 98652 19131' : '+91 98400 12345',
        studentsCount: district === 'Tenkasi' ? 110 : district === 'Chennai' ? 240 : district === 'Coimbatore' ? 190 : 120,
        status: district === 'Tenkasi' ? 'Authorized Franchise Branch' : 'Authorized Branch',
        slug,
        creds
      };
    });
  }, [credentialsMap]);

  const customBranches = useMemo(() => (
    Object.values(credentialsMap)
      .filter((credentials) => credentials.isCustomBranch)
      .map((credentials) => ({
        code: credentials.code || credentials.branchCode || credentials.slug,
        name: credentials.branchName,
        branchName: credentials.branchName,
        city: credentials.district,
        district: credentials.district,
        slug: credentials.slug,
        creds: credentials
      }))
  ), [credentialsMap]);

  const allBranches = useMemo(() => [...all38DistrictBranches, ...customBranches], [all38DistrictBranches, customBranches]);

  const filteredBranches = useMemo(() => {
    if (!branchSearch.trim()) return allBranches;
    const term = branchSearch.toLowerCase().trim();
    return allBranches.filter(
      (b) =>
        b.name?.toLowerCase().includes(term) ||
        b.branchName?.toLowerCase().includes(term) ||
        (b.district && b.district.toLowerCase().includes(term)) ||
        b.code?.toLowerCase().includes(term) ||
        (b.creds?.email && b.creds.email.toLowerCase().includes(term))
    );
  }, [allBranches, branchSearch]);

  const handleEnterBranchAdmin = (branch) => {
    const branchName = branch.branchName || `${branch.district} Branch`;
    if (setActiveBranch) {
      setActiveBranch(branchName);
    }
    if (handleRoleSwitch) {
      handleRoleSwitch('Branch Head', branchName);
    }
    showToast(`Directly accessed ${branch.name} Admin Portal`);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header Banner with Real-Time Search & Quick Branch Jump */}
      <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-500" />
            <span>Authorized District Branches Network</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Super Admin sets official Branch Login credentials and can directly jump to any Branch Admin portal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Real-time Branch Search */}
          <div className="relative flex-1 sm:w-56 lg:w-64 min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={branchSearch}
              onChange={(e) => setBranchSearch(e.target.value)}
              placeholder="Search branch (e.g. Tenkasi, Chennai)..."
              className="w-full text-xs font-semibold pl-8 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c234b]/20 focus:border-[#0c234b]"
            />
            {branchSearch && (
              <button
                type="button"
                onClick={() => setBranchSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Quick Jump Dropdown */}
          <div className="relative flex-1 sm:w-52 min-w-[180px]">
            <select
              value=""
              onChange={(e) => {
                if (!e.target.value) return;
                const found = allBranches.find(
                  (b) => b.district === e.target.value || b.branchName === e.target.value || b.name === e.target.value
                );
                if (found) handleEnterBranchAdmin(found);
              }}
              className="w-full text-xs font-black text-[#0c234b] bg-amber-50/90 border border-amber-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer shadow-xs"
            >
              <option value="">⚡ Direct Jump to Branch...</option>
              {allBranches.map((b) => (
                <option key={b.code} value={b.district || b.branchName || b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Add New Branch */}
          <button
            type="button"
            onClick={() => setShowAddSchoolModal(true)}
            className="px-4 py-2 bg-[#0c234b] hover:bg-[#163e7c] text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add New Branch</span>
          </button>
        </div>
      </div>

      {/* Network Branch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBranches.map((branch) => {
          const creds = getCredentialsForBranchOrSchool(branch);
          const emailKey = `email_${branch.code}_${creds.slug}`;
          const passKey = `pass_${branch.code}_${creds.slug}`;
          const isPassVisible = !!visiblePasswords[passKey];

          return (
            <div
              key={branch.code}
              className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between gap-3"
            >
              {/* Branch Name */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <h3 className="text-sm font-black text-slate-950 leading-snug">{branch.name}</h3>
                </div>
                <span className="font-mono text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                  {branch.code}
                </span>
              </div>

              {/* OFFICIAL BRANCH LOGIN CREDENTIALS BOX */}
              <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50/80 via-sky-50/40 to-white p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-blue-900">
                    <Lock className="w-3 h-3 text-blue-600" />
                    Branch Login Access
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(branch)}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 hover:text-blue-900 bg-blue-100/70 hover:bg-blue-200/80 px-2 py-0.5 rounded-md transition cursor-pointer"
                    title="Edit this branch's login email and password"
                  >
                    <Edit3 className="w-2.5 h-2.5" />
                    Edit
                  </button>
                </div>

                {/* Email row */}
                <div className="flex items-center justify-between gap-1.5 bg-white/90 px-2.5 py-1.5 rounded-lg border border-blue-100 text-xs">
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="font-mono text-[11px] font-semibold text-slate-800 truncate" title={creds.email}>
                      {creds.email}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(creds.email, emailKey)}
                    className="p-1 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded transition cursor-pointer shrink-0"
                    title="Copy email"
                  >
                    {copiedKey === emailKey ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Password row */}
                <div className="flex items-center justify-between gap-1.5 bg-white/90 px-2.5 py-1.5 rounded-lg border border-blue-100 text-xs">
                  <div className="flex items-center gap-1.5 truncate">
                    <KeyRound className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="font-mono text-[11px] font-semibold text-slate-800">
                      {isPassVisible ? creds.password : '••••••••••••'}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(passKey)}
                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition cursor-pointer"
                      title={isPassVisible ? 'Hide password' : 'Show password'}
                    >
                      {isPassVisible ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(creds.password, passKey)}
                      className="p-1 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded transition cursor-pointer"
                      title="Copy password"
                    >
                      {copiedKey === passKey ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* DIRECT BRANCH ACCESS BUTTON */}
              <button
                type="button"
                onClick={() => handleEnterBranchAdmin(branch)}
                className="w-full mt-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#0c234b] via-[#123068] to-[#1a448d] hover:from-[#123068] hover:to-[#2256ad] active:scale-[0.98] text-white text-xs font-black flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                title={`Directly login and open ${branch.name} Admin Portal`}
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Go to Branch Admin</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          );
        })}

        {filteredBranches.length === 0 && (
          <div className="col-span-full bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
            <Building className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-black text-slate-800">No branches found matching "{branchSearch}"</p>
            <button
              type="button"
              onClick={() => setBranchSearch('')}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Clear search filter
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          EDIT SPECIFIC BRANCH CREDENTIALS MODAL (Simple, focused dialog)
          ========================================================================= */}
      {editingBranch && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-4 bg-[#0c234b] text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>Edit Branch Credentials</span>
                </h3>
                <p className="text-[11px] text-blue-200/80 mt-0.5 truncate">
                  {editingBranch.name} ({editingBranch.district})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingBranch(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveCredentials} className="p-5 space-y-4">
              <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200/60 text-xs text-blue-900 space-y-1">
                <div className="font-black flex items-center gap-1.5 text-blue-950">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Super Admin Credentials Assignment
                </div>
                <p className="text-[11px] text-blue-800/90 leading-relaxed">
                  Only through this email and password can the branch log in to the official B★SEL Branch Admin desk.
                </p>
              </div>

              {/* Login Email */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-800 flex items-center justify-between">
                  <span>Branch Login User ID</span>
                  <span className="text-[10px] text-slate-400 font-normal">Standard: bseldistrict@bsel.org</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    placeholder="bseldistrictname@bsel.org"
                  />
                </div>
              </div>

              {/* Login Password */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-800 flex items-center justify-between">
                  <span>Branch Login Password</span>
                  <span className="text-[10px] text-slate-400 font-normal">Standard: districtbsel</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    placeholder="districtnamebsel"
                  />
                </div>
              </div>

              {/* Reset to Formula Button */}
              <button
                type="button"
                onClick={handleResetToFormula}
                className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to formula default (bsel{editingBranch.slug}@bsel.org / {editingBranch.slug}bsel)</span>
              </button>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingBranch(null)}
                  className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0c234b] hover:bg-[#163e7c] text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Save Credentials</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
