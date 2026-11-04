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
  Plus
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
              
              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Branch Enrolled Students</span>
                  <div className="text-2xl font-black text-slate-950 mt-1">{branchStudents.length}</div>
                  <span className="text-[11px] font-bold text-sky-700 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Enrolled in {activeBranch}
                  </span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-sky-100 text-[#0c234b] flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Active Batches</span>
                  <div className="text-2xl font-black text-slate-950 mt-1">{branchBatches.length} Batches</div>
                  <span className="text-[11px] font-bold text-sky-700 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> Scheduled class slots
                  </span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Branch Fees Collected</span>
                  <div className="text-2xl font-black text-slate-950 mt-1">{branchRevenueFormatted}</div>
                  <span className="text-[11px] font-bold text-sky-700 flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3" /> Branch desk collections
                  </span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
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
                    onClick={() => setActiveTab('branch_students')}
                    className="text-xs font-bold text-sky-700 hover:underline flex items-center gap-1"
                  >
                    <span>Full Branch Roster</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {branchStudents.map((st) => (
                    <div key={st.userId} className="py-2.5 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-black text-slate-900 capitalize">{st.studentName}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-sky-900 font-bold">{st.registerNumber || st.userId}</span>
                          <span>•</span>
                          <span>Course: <strong className="text-slate-700">{st.program}</strong></span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
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
                  ))}
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
                      <div key={b.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-slate-900">{b.name}</div>
                          <div className="text-slate-500 text-[11px] mt-0.5">
                            {b.days}: <strong className="text-sky-950">{b.startTime} - {b.endTime}</strong>
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
