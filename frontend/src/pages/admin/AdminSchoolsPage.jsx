import React, { useState, useEffect, useMemo } from 'react';
import {
  School,
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
  ExternalLink
} from 'lucide-react';
import {
  TAMIL_NADU_DISTRICTS,
  getStoredBranchCredentials,
  saveBranchCredentials,
  resetBranchCredentialsToDefault,
  getDistrictSlug,
  getDefaultCredentialsForDistrict,
  getCredentialsForBranchOrSchool
} from '../../utils/branchAuthStorage';

export default function AdminSchoolsPage({
  schoolsList,
  setShowAddSchoolModal,
  setActiveBranch,
  handleRoleSwitch,
  showToast = () => {}
}) {
  const [credentialsMap, setCredentialsMap] = useState(() => getStoredBranchCredentials());
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null); // { slug, name, district, email, password }
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [searchDistrictQuery, setSearchDistrictQuery] = useState('');

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

  const handleDirectReset = (slug, districtName) => {
    resetBranchCredentialsToDefault(slug || districtName);
    setCredentialsMap(getStoredBranchCredentials());
    showToast(`Reset ${districtName} to default formula credentials.`);
  };

  // Filtered districts list for the 38 TN Districts manager modal
  const filteredDistricts = useMemo(() => {
    const q = searchDistrictQuery.toLowerCase().trim();
    return TAMIL_NADU_DISTRICTS.map((d) => {
      const slug = getDistrictSlug(d);
      const creds = credentialsMap[slug] || getDefaultCredentialsForDistrict(d);
      return {
        district: d,
        slug,
        creds
      };
    }).filter((item) => {
      if (!q) return true;
      return (
        item.district.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q) ||
        item.creds.email.toLowerCase().includes(q)
      );
    });
  }, [searchDistrictQuery, credentialsMap]);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
            <School className="w-5 h-5 text-orange-500" />
            <span>Authorized Branches & Partner Schools Network</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Super Admin sets official Branch Login credentials. Default Email: <code className="text-blue-700 font-bold bg-blue-50 px-1 py-0.5 rounded">bsel+districtname@bsel.org</code> | Default Password: <code className="text-amber-700 font-bold bg-amber-50 px-1 py-0.5 rounded">districtname+bsel</code>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* 38 Districts Credentials Manager Button */}
          <button
            type="button"
            onClick={() => setShowDistrictModal(true)}
            className="flex-1 lg:flex-none px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <KeyRound className="w-4 h-4 text-slate-950" />
            <span>District Branch Credentials (38 TN Districts)</span>
          </button>

          {/* Affiliate New Centre */}
          <button
            type="button"
            onClick={() => setShowAddSchoolModal(true)}
            className="flex-1 lg:flex-none px-3.5 py-2 bg-[#0c234b] hover:bg-[#163e7c] text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Affiliate New Centre</span>
          </button>
        </div>
      </div>

      {/* Network School/Branch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schoolsList.map((school) => {
          const creds = getCredentialsForBranchOrSchool(school);
          const emailKey = `email_${school.code}_${creds.slug}`;
          const passKey = `pass_${school.code}_${creds.slug}`;
          const isPassVisible = !!visiblePasswords[passKey];

          return (
            <div
              key={school.code}
              className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition relative group"
            >
              <div className="space-y-3">
                {/* Header & Status */}
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {school.code}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {school.status}
                  </span>
                </div>

                {/* Name & City */}
                <div>
                  <h3 className="text-sm font-black text-slate-950 leading-snug">{school.name}</h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{school.city}</span>
                  </div>
                </div>

                {/* Principal & Coordinator Info */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] space-y-0.5">
                  <div>Principal/Head: <strong className="text-slate-800">{school.principal}</strong></div>
                  <div>Coordinator: <strong className="text-slate-800">{school.coordinator}</strong></div>
                  <div>Contact: <strong className="text-slate-800">{school.phone}</strong></div>
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
                      onClick={() => handleOpenEditModal(school)}
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
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
                <span className="text-xs font-extrabold text-sky-800">
                  {school.studentsCount} Active Students
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setActiveBranch(school.name);
                    handleRoleSwitch('Branch Head');
                  }}
                  className="px-2.5 py-1 text-xs font-black bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg transition cursor-pointer"
                >
                  Open Branch Desk →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================================================
          MODAL 1: 38 TAMIL NADU DISTRICTS CREDENTIALS MANAGER
          ========================================================================= */}
      {showDistrictModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#0c234b] text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-black flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>38 Tamil Nadu District Branch Credentials Manager</span>
                </h3>
                <p className="text-xs text-blue-200/80 mt-0.5">
                  Super Admin control center: Only through these credentials can each branch log in. Default formula: <code className="text-amber-300 font-mono">bsel+districtname@bsel.org</code> / <code className="text-amber-300 font-mono">districtname+bsel</code>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDistrictModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Search Bar */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search district (e.g. Tenkasi, Chennai, Madurai)..."
                  value={searchDistrictQuery}
                  onChange={(e) => setSearchDistrictQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div className="text-xs font-bold text-slate-600">
                Showing <strong className="text-blue-900">{filteredDistricts.length}</strong> of 38 Districts
              </div>
            </div>

            {/* Districts Credentials Table */}
            <div className="overflow-y-auto p-4 space-y-2 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredDistricts.map(({ district, slug, creds }) => {
                  const emailKey = `modal_email_${slug}`;
                  const passKey = `modal_pass_${slug}`;
                  const isPassVisible = !!visiblePasswords[passKey];

                  return (
                    <div
                      key={slug}
                      className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-blue-300 shadow-xs hover:shadow-sm transition flex flex-col justify-between gap-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <h4 className="text-xs font-black text-slate-950">{district}</h4>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {slug.toUpperCase()} Regional Centre
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(district)}
                            className="px-2 py-1 text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition flex items-center gap-1 cursor-pointer"
                            title="Edit this district's login credentials"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDirectReset(slug, district)}
                            className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                            title="Reset to default formula credentials"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Credential rows */}
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                        {/* Email */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 truncate">
                            <Mail className="w-3 h-3 text-blue-600 shrink-0" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email:</span>
                            <span className="font-mono text-[11px] font-bold text-blue-900 truncate">
                              {creds.email}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(creds.email, emailKey)}
                            className="p-1 text-slate-400 hover:text-blue-700 rounded transition cursor-pointer shrink-0"
                            title="Copy email"
                          >
                            {copiedKey === emailKey ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>

                        {/* Password */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 truncate">
                            <KeyRound className="w-3 h-3 text-amber-500 shrink-0" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pass:</span>
                            <span className="font-mono text-[11px] font-bold text-amber-900">
                              {isPassVisible ? creds.password : '••••••••••••'}
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(passKey)}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded transition cursor-pointer"
                              title={isPassVisible ? 'Hide' : 'Show'}
                            >
                              {isPassVisible ? (
                                <EyeOff className="w-3 h-3" />
                              ) : (
                                <Eye className="w-3 h-3" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(creds.password, passKey)}
                              className="p-1 text-slate-400 hover:text-blue-700 rounded transition cursor-pointer"
                              title="Copy password"
                            >
                              {copiedKey === passKey ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>All 38 districts configured with secure standard formulas.</span>
              <button
                type="button"
                onClick={() => setShowDistrictModal(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: EDIT SPECIFIC BRANCH CREDENTIALS MODAL
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
                  <span>Branch Login Email</span>
                  <span className="text-[10px] text-slate-400 font-normal">Standard: bsel+district@bsel.org</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    placeholder="bsel+districtname@bsel.org"
                  />
                </div>
              </div>

              {/* Login Password */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-800 flex items-center justify-between">
                  <span>Branch Login Password</span>
                  <span className="text-[10px] text-slate-400 font-normal">Standard: district+bsel</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    placeholder="districtname+bsel"
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
                <span>Reset to formula default (bsel+{editingBranch.slug}@bsel.org / {editingBranch.slug}+bsel)</span>
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
