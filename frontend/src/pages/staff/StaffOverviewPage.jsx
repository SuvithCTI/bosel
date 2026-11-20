import React from 'react';
import {
  Users,
  Clock,
  CheckCircle2,
  FileText,
  ClipboardList,
  Award,
  ArrowRight
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
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
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
