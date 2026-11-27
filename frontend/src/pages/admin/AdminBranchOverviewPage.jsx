import React from 'react';
import {
  TrendingUp,
  Building,
  Users,
  CreditCard,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Plus,
  ClipboardList,
  FileText,
  Award,
  UserCheck,
  KeyRound,
  School
} from 'lucide-react';

export default function AdminBranchOverviewPage({
  activeBranch,
  branchStudents,
  branchBatches,
  branchRevenueFormatted,
  handleTabSelect,
  setActiveTab,
  handleOpenCertForStudent
}) {
  return (
    <div className="space-y-3.5 sm:space-y-5 animate-in fade-in duration-200">
      {/* Student Marksheet Quick Access */}
      <div 
        onClick={() => handleTabSelect('branch_marksheet')}
        className="relative overflow-hidden bg-gradient-to-r from-[#0c234b] via-[#142f5c] to-[#1e3a68] rounded-2xl shadow-md p-3.5 sm:p-6 cursor-pointer sm:cursor-default transition hover:shadow-lg"
      >
        {/* Decorative Background */}
        <div className="absolute -right-10 -top-16 w-56 h-56 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute right-32 -bottom-20 w-48 h-48 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-5">

          {/* Content */}
          <div className="flex items-center sm:items-start gap-3 sm:gap-4 min-w-0">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-amber-400 flex items-center justify-center shrink-0 shadow-sm">
              <ClipboardList className="w-5 h-5 sm:w-7 sm:h-7 text-[#0c234b]" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between sm:justify-start gap-2">
                <h2 className="text-sm sm:text-lg font-black text-white truncate">
                  Student Marksheet Management
                </h2>

                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-300/30 text-amber-300 text-[9px] font-black uppercase tracking-wider">
                  Academic Records
                </span>

                <ArrowRight className="w-4 h-4 text-amber-400 sm:hidden shrink-0" />
              </div>

              <p className="hidden sm:block text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
                Search enrolled students, enter subject-wise marks, calculate
                results and manage official student marksheets for your branch.
              </p>

              <span className="sm:hidden text-[11px] text-slate-300 block truncate mt-0.5">
                Record subject marks & generate results
              </span>

              <div className="hidden sm:flex flex-wrap items-center gap-3 mt-3">
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
            onClick={(e) => { e.stopPropagation(); handleTabSelect('branch_marksheet'); }}
            className="hidden sm:flex w-full sm:w-auto shrink-0 items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#0c234b] text-xs font-black shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
          >
            <ClipboardList className="w-4 h-4" />
            Quick Mark
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* Staff Management Quick Banner */}
      <div 
        onClick={() => handleTabSelect('branch_staff')}
        className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-6 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-5 cursor-pointer sm:cursor-default"
      >
        <div className="flex items-center sm:items-start gap-3 sm:gap-4 min-w-0">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-sky-100 text-[#0c234b] flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5 sm:w-7 sm:h-7" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between sm:justify-start gap-2">
              <h2 className="text-sm sm:text-lg font-black text-slate-950 truncate">
                Branch Staff & Login Management
              </h2>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-sky-100 border border-sky-200 text-sky-800 text-[9px] font-black uppercase tracking-wider">
                Staff Credentials
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 sm:hidden shrink-0" />
            </div>
            <p className="hidden sm:block text-xs sm:text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
              Create, edit and manage login credentials for instructors and evaluation staff belonging to {activeBranch}.
            </p>
            <span className="sm:hidden text-[11px] text-slate-500 block truncate mt-0.5">
              Staff logins, instructors & portal access
            </span>
            <div className="hidden sm:flex flex-wrap items-center gap-3 mt-3">
              <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-600 font-semibold">
                <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                Staff User ID & Password
              </span>
              <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-600 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Staff Portal Access
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); handleTabSelect('branch_staff'); }}
          className="hidden sm:flex w-full sm:w-auto shrink-0 items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0c234b] hover:bg-[#163e7c] text-white text-xs font-black shadow-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
        >
          <UserCheck className="w-4 h-4 text-amber-400" />
          Manage Staff
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>

      {/* Franchise Management & School Management Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-4">
        {/* Franchise Management & Dashboard Access Card */}
        <div 
          onClick={() => handleTabSelect('branch_franchise')}
          className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between gap-3 sm:gap-4 cursor-pointer sm:cursor-default"
        >
          <div className="flex items-center sm:items-start gap-3 sm:gap-3.5 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between sm:justify-start gap-2">
                <h3 className="text-sm font-black text-slate-950 truncate">Franchise Management</h3>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-900 text-[9px] font-black uppercase">Franchise Portals</span>
                <ArrowRight className="w-4 h-4 text-indigo-600 sm:hidden shrink-0" />
              </div>
              <p className="hidden sm:block text-xs text-slate-500 mt-1 leading-relaxed">
                Add multiple franchises, manage login credentials, customize certificates, and jump directly into each Franchise Dashboard.
              </p>
              <span className="sm:hidden text-[11px] text-slate-500 block truncate mt-0.5">
                Credentials, branding & dashboards
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleTabSelect('branch_franchise'); }}
            className="hidden sm:flex w-full py-2.5 px-4 rounded-xl border border-indigo-300 hover:border-indigo-400 bg-indigo-50 hover:bg-indigo-100/70 text-indigo-950 text-xs font-black items-center justify-center gap-2 transition cursor-pointer"
          >
            <span>Manage Franchises & Portals</span>
            <ArrowRight className="w-3.5 h-3.5 text-indigo-700" />
          </button>
        </div>

        {/* School Management Card */}
        <div 
          onClick={() => handleTabSelect('branch_schools')}
          className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between gap-3 sm:gap-4 cursor-pointer sm:cursor-default"
        >
          <div className="flex items-center sm:items-start gap-3 sm:gap-3.5 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <School className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between sm:justify-start gap-2">
                <h3 className="text-sm font-black text-slate-950 truncate">School Management</h3>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase">Affiliations</span>
                <ArrowRight className="w-4 h-4 text-emerald-600 sm:hidden shrink-0" />
              </div>
              <p className="hidden sm:block text-xs text-slate-500 mt-1 leading-relaxed">
                Affiliate partner schools, manage school coordinators, and coordinate examination venues.
              </p>
              <span className="sm:hidden text-[11px] text-slate-500 block truncate mt-0.5">
                Partner schools, logins & portals
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleTabSelect('branch_schools'); }}
            className="hidden sm:flex w-full py-2.5 px-4 rounded-xl border border-emerald-200 hover:border-emerald-400 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-800 text-xs font-black items-center justify-center gap-2 transition cursor-pointer"
          >
            <span>Manage Partner Schools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
}