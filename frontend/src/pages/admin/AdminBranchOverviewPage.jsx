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
  Award
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
    <div className="space-y-5 animate-in fade-in duration-200">

      {/* Branch Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Enrolled Students */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Branch Enrolled Students
            </span>

            <div className="text-2xl font-black text-slate-950 mt-1">
              {branchStudents.length}
            </div>

            <span className="text-[11px] font-bold text-sky-700 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3" />
              Enrolled in {activeBranch}
            </span>
          </div>

          <div className="w-11 h-11 rounded-xl bg-sky-100 text-[#0c234b] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Active Batches */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Active Batches
            </span>

            <div className="text-2xl font-black text-slate-950 mt-1">
              {branchBatches.length} Batches
            </div>

            <span className="text-[11px] font-bold text-sky-700 flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" />
              Scheduled class slots
            </span>
          </div>

          <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Branch Fees */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Branch Fees Collected
            </span>

            <div className="text-2xl font-black text-slate-950 mt-1">
              {branchRevenueFormatted}
            </div>

            <span className="text-[11px] font-bold text-sky-700 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3" />
              Branch desk collections
            </span>
          </div>

          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

      </div>


      {/* Student Marksheet Quick Access */}
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
                  Academic Records
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
            onClick={() => handleTabSelect('branch_marksheet')}
            className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#0c234b] text-xs font-black shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5"
          >
            <ClipboardList className="w-4 h-4" />
            Manage Marksheets
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>
      </div>


      {/* Branch Students Quick List & Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Branch Students Quick List */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">

          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-950 flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-600" />
              <span>Recent Students Enrolled in {activeBranch}</span>
            </h2>

            <button
              type="button"
              onClick={() => setActiveTab('branch_students')}
              className="text-xs font-bold text-sky-700 hover:underline flex items-center gap-1"
            >
              <span>Full Branch Roster</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">

            {branchStudents.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No students enrolled in this branch yet.
              </div>
            ) : (
              branchStudents.slice(0, 5).map((st) => (
                <div
                  key={st.userId}
                  className="py-2.5 flex items-center justify-between gap-3"
                >

                  <div className="min-w-0">
                    <div className="text-xs font-black text-slate-900 capitalize truncate">
                      {st.studentName}
                    </div>

                    <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-2 mt-0.5">
                      <span className="font-mono text-sky-900 font-bold">
                        {st.registerNumber || st.userId}
                      </span>

                      <span>•</span>

                      <span>
                        Course:{' '}
                        <strong className="text-slate-700">
                          {st.program}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">

                    <span className="px-2 py-0.5 bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-black rounded">
                      {st.grade || 'Level 1'}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleOpenCertForStudent(st)}
                      className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded text-[10px] font-black"
                    >
                      Certificate
                    </button>

                  </div>

                </div>
              ))
            )}

          </div>
        </div>


        {/* Weekly Branch Schedule */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">

          <div className="flex items-center justify-between">

            <h2 className="text-sm font-black text-slate-950 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Weekly Branch Schedule</span>
            </h2>

            <button
              type="button"
              onClick={() => setActiveTab('branch_batches')}
              className="text-xs font-bold text-sky-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Batches</span>
              <ArrowRight className="w-3 h-3" />
            </button>

          </div>

          <div className="space-y-2.5 text-xs">

            {branchBatches.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-xs">
                No active batches found for this branch.
              </div>
            ) : (
              branchBatches.slice(0, 4).map((b) => (
                <div
                  key={b.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between gap-2"
                >

                  <div>
                    <div className="font-bold text-slate-900">
                      {b.name}
                    </div>

                    <div className="text-slate-500 text-[11px] mt-0.5">
                      {b.days}:{' '}
                      <strong className="text-sky-950">
                        {b.startTime} - {b.endTime}
                      </strong>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-sky-100 text-sky-800 shrink-0">
                    {b.program}
                  </span>

                </div>
              ))
            )}

          </div>
        </div>

      </div>
    </div>
  );
}