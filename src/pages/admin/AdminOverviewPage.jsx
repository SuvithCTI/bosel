import React from 'react';
import {
  TrendingUp,
  Users,
  CheckCircle2,
  BookOpen,
  Calendar,
  Building,
  ShieldCheck,
  CreditCard,
  Sparkles,
  Plus,
  ArrowRight
} from 'lucide-react';

export default function AdminOverviewPage({
  totalStudentsCount,
  totalCoursesCount,
  totalEventsCount,
  totalFranchiseCount,
  totalRevenueFormatted,
  schoolsList,
  setShowAddCourseModal,
  setShowAddEventModal,
  setActiveTab,
  setShowAddStudentModal
}) {
  return (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              
              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Students (All Branches)</span>
                  <div className="text-2xl font-black text-slate-950 mt-1">{totalStudentsCount}</div>
                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                    <TrendingUp className="w-3 h-3" /> All districts active
                  </span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-sky-100 text-[#0c234b] flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Master Courses</span>
                  <div className="text-2xl font-black text-slate-950 mt-1">{totalCoursesCount}</div>
                  <span className="text-[11px] font-bold text-sky-700 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Skill & Tech Modules
                  </span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Event Competitions</span>
                  <div className="text-2xl font-black text-slate-950 mt-1">{totalEventsCount}</div>
                  <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" /> State & National
                  </span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Franchise Enquiries</span>
                  <div className="text-2xl font-black text-slate-950 mt-1">{totalFranchiseCount}</div>
                  <span className="text-[11px] font-bold text-indigo-700 flex items-center gap-1 mt-0.5">
                    <Building className="w-3 h-3" /> Incoming pipeline
                  </span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                  <Building className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Payment Sectors</span>
                  <div className="text-2xl font-black text-emerald-800 mt-1">{totalRevenueFormatted}</div>
                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3" /> 100% Reconciled
                  </span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
              </div>

            </div>

            {/* Quick Action Bar for Super Admin */}
            <div className="bg-gradient-to-r from-[#0c234b] to-[#163e7c] text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-black">Executive Master Launchpad:</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(true)}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Course</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAddEventModal(true)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Competition / Event</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('franchise')}
                  className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>Review Franchise Leads</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(true)}
                  className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Register Student</span>
                </button>
              </div>
            </div>

            {/* Two-Column Overview Matrix: Branches Network & Payment Sectors Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              
              {/* Branch Network Performance */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-black text-slate-950 flex items-center gap-2">
                    <Building className="w-4 h-4 text-sky-600" />
                    <span>Regional Branch Network Performance</span>
                  </h2>
                  <button
                    onClick={() => setActiveTab('schools')}
                    className="text-xs font-bold text-sky-700 hover:underline flex items-center gap-1"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {schoolsList.slice(0, 4).map((school, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-black text-slate-900">{school.name}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{school.city}</span>
                          <span>•</span>
                          <span>Director: <strong className="text-slate-700">{school.principal || school.coordinator}</strong></span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {school.status}
                        </span>
                        <div className="text-xs font-bold text-slate-600 mt-1">{school.studentsCount} Students</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Sectors Summary */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-black text-slate-950 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Payment Sectors Distribution</span>
                  </h2>
                  <button
                    onClick={() => setActiveTab('payments')}
                    className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <span>Financial Ledger</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-sky-50 rounded-xl border border-sky-100">
                    <span className="text-[10px] font-bold uppercase text-sky-800">🎓 Course Tuition Sector</span>
                    <div className="text-base font-black text-sky-950 mt-1">₹48,500</div>
                    <span className="text-[10px] text-sky-700">Admission & Term Fees</span>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <span className="text-[10px] font-bold uppercase text-amber-800">🏆 Event Competitions</span>
                    <div className="text-base font-black text-amber-950 mt-1">₹38,000</div>
                    <span className="text-[10px] text-amber-700">State Olympiads</span>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                    <span className="text-[10px] font-bold uppercase text-purple-800">📦 Toolkits & Kits</span>
                    <div className="text-base font-black text-purple-950 mt-1">₹23,000</div>
                    <span className="text-[10px] text-purple-700">Abacus & Workbooks</span>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <span className="text-[10px] font-bold uppercase text-emerald-800">🏢 Franchise Affiliations</span>
                    <div className="text-base font-black text-emerald-950 mt-1">₹75,000</div>
                    <span className="text-[10px] text-emerald-700">3 Branch Licenses</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
  );
}
