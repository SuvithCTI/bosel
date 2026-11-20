import React, { useState } from 'react';
import {
  Building,
  Users,
  CreditCard,
  Clock,
  CheckCircle2,
  FileText,
  ClipboardList,
  Award,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  User,
  Key,
  Mail,
  Phone,
  Copy,
  Eye,
  EyeOff,
  Check,
  MapPin,
  Layers,
  GraduationCap
} from 'lucide-react';

export default function StaffOverviewPage({
  currentStaff = {},
  activeBranch,
  branchStudents = [],
  branchBatches = [],
  branchRevenueFormatted = '₹25,400',
  handleTabSelect,
  setActiveTab
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedKey, setCopiedKey] = useState('');

  const handleCopy = (text, key) => {
    if (!text) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(''), 2500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const staffName = currentStaff.name || currentStaff.studentName || 'R. Kaviya';
  const staffUserId = currentStaff.userId || 'staff.tenkasi';
  const staffPassword = currentStaff.password || 'staff123';
  const staffDesignation = currentStaff.designation || 'Senior Academic Instructor';
  const affiliationType = currentStaff.affiliationType || 'Branch';
  const staffEmail = currentStaff.email || 'staff@bsel.org';
  const staffPhone = currentStaff.phone || '9865219132';
  const assignedUnit = currentStaff.assignedUnit || currentStaff.institution || `${activeBranch || 'Tenkasi Branch'}`;
  const program = currentStaff.program || 'Student Operations & Marksheet Evaluation';

  const staffInitials = staffName
    ? staffName
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'ST';

  // Affiliation badge styling
  let affiliationBadgeStyle = 'bg-blue-50 text-blue-700 border-blue-200';
  let affiliationLabel = 'BRANCH STAFF';
  if (affiliationType === 'Franchise') {
    affiliationBadgeStyle = 'bg-purple-50 text-purple-700 border-purple-200';
    affiliationLabel = 'FRANCHISE STAFF';
  } else if (affiliationType === 'School') {
    affiliationBadgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    affiliationLabel = 'SCHOOL STAFF';
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-200">

      {/* =========================================================================
          TOP: LOGGED IN STAFF MEMBER PROFILE & LOGIN CREDENTIALS CARD
          ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Profile Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 via-white to-amber-50/40 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
            {/* Avatar with Initials */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#0c234b] text-amber-400 border-2 border-amber-400/40 font-black text-base sm:text-lg flex items-center justify-center shrink-0 shadow-sm">
              {staffInitials}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  STAFF FACULTY PROFILE
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[9px] font-black uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {currentStaff.status || 'Active'}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${affiliationBadgeStyle}`}>
                  {affiliationLabel}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-slate-950 truncate mt-0.5">
                {staffName}
              </h1>
              <p className="text-xs text-slate-600 font-semibold flex items-center gap-2 flex-wrap">
                <span>{staffDesignation}</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-slate-700">
                  <Building className="w-3 h-3 text-amber-500" />
                  {currentStaff.branch || activeBranch || 'Tenkasi Branch'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center shrink-0">
            <span className="text-xs text-slate-600 font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs">
              <UserCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Staff Portal Active</span>
            </span>
          </div>
        </div>

        {/* Credentials & Details Body */}
        <div className="p-4 sm:p-6 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Staff Login Credentials & Account Details
              </h3>
            </div>
            {copiedKey && (
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 animate-in fade-in">
                ✓ Copied to clipboard
              </span>
            )}
          </div>

          {/* Credentials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* User ID */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                User ID / Username
              </span>
              <div className="flex items-center justify-between gap-1">
                <code className="text-xs font-mono font-black text-[#0c234b] truncate">
                  {staffUserId}
                </code>
                <button
                  type="button"
                  onClick={() => handleCopy(staffUserId, 'userId')}
                  className="p-1 text-slate-400 hover:text-slate-800 rounded transition cursor-pointer"
                  title="Copy User ID"
                >
                  {copiedKey === 'userId' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Password */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Password
              </span>
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-mono font-black text-[#0c234b]">
                  {showPassword ? staffPassword : '••••••••••••'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-slate-400 hover:text-slate-800 rounded transition cursor-pointer"
                    title={showPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(staffPassword, 'password')}
                    className="p-1 text-slate-400 hover:text-slate-800 rounded transition cursor-pointer"
                    title="Copy Password"
                  >
                    {copiedKey === 'password' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Contact Mobile
              </span>
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {staffPhone}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(staffPhone, 'phone')}
                  className="p-1 text-slate-400 hover:text-slate-800 rounded transition cursor-pointer"
                  title="Copy Phone"
                >
                  {copiedKey === 'phone' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Email */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Official Email
              </span>
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {staffEmail}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(staffEmail, 'email')}
                  className="p-1 text-slate-400 hover:text-slate-800 rounded transition cursor-pointer"
                  title="Copy Email"
                >
                  {copiedKey === 'email' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Secondary Details Row: Affiliation, Assigned Unit & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="flex items-center gap-2.5 p-2.5 bg-slate-50/80 rounded-xl border border-slate-200 text-xs">
              <Building className="w-4 h-4 text-amber-500 shrink-0" />
              <div className="min-w-0">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Assigned Branch</span>
                <span className="font-bold text-slate-850 truncate block">
                  {currentStaff.branch || activeBranch || 'Tenkasi Branch'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 bg-slate-50/80 rounded-xl border border-slate-200 text-xs">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
              <div className="min-w-0">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Assigned Unit</span>
                <span className="font-bold text-slate-850 truncate block">
                  {assignedUnit}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 bg-slate-50/80 rounded-xl border border-slate-200 text-xs">
              <Layers className="w-4 h-4 text-amber-500 shrink-0" />
              <div className="min-w-0">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Program / Operations</span>
                <span className="font-bold text-slate-850 truncate block">
                  {program}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          METRICS & QUICK ACCESS BAR
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Branch Students</span>
            <span className="text-2xl font-black text-slate-950">{branchStudents.length}</span>
            <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">Enrolled for Marks & Records</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Batches</span>
            <span className="text-2xl font-black text-slate-950">{branchBatches.length}</span>
            <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">Assigned Class Batches</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Academic Session</span>
            <span className="text-2xl font-black text-emerald-600">Active</span>
            <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">2026 Academic Evaluation</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          STUDENT MARKSHEET QUICK ACCESS
          ========================================================================= */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0c234b] via-[#142f5c] to-[#1e3a68] rounded-2xl shadow-md">

        {/* Decorative Background */}
        <div className="absolute -right-10 -top-16 w-56 h-56 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute right-32 -bottom-20 w-48 h-48 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />

        <div className="relative p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">

          {/* Left Content */}
          <div className="flex items-start gap-4">

            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-400 flex items-center justify-center shrink-0 shadow-lg shadow-black/10">
              <ClipboardList className="w-6 h-6 sm:w-7 sm:h-7 text-[#0c234b]" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-white">
                  Student Marksheet Management
                </h2>

                <span className="px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-300/30 text-amber-300 text-[9px] font-black uppercase tracking-wider">
                  ACADEMIC RECORDS
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
                Search enrolled students, enter subject-wise marks, calculate
                results and manage official student marksheets for your branch.
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-3">

                <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-300 font-semibold">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  Student Search
                </span>

                <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-300 font-semibold">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  Subject-wise Marks
                </span>

                <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-300 font-semibold">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Official Results
                </span>

              </div>
            </div>

          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={() => handleTabSelect('staff_marksheet')}
            className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#0c234b] text-xs font-black shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
          >
            <ClipboardList className="w-4 h-4" />
            Manage Marksheets
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>
      </div>

    </div>
  );
}
