import React from 'react';
import {
  TrendingUp,
  Users,
  CheckCircle2,
  BookOpen,
  Calendar,
  Building,
  CreditCard,
  Plus,
  ArrowRight,
  GraduationCap,
  Trophy,
  MapPin,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Award
} from 'lucide-react';

export default function AdminOverviewPage({
  totalStudentsCount,
  totalCoursesCount,
  totalEventsCount,
  totalFranchiseCount,
  totalRevenueFormatted,
  schoolsList = [],
  usersList = [],
  eventsList = [],
  franchiseList = [],
  setShowAddCourseModal,
  setShowAddEventModal,
  setActiveTab,
  setShowAddStudentModal
}) {
  const recentStudents = (usersList || []).slice(0, 5);
  const recentEvents = (eventsList || []).slice(0, 4);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header Banner & Quick Launchpad */}
      <div className="bg-gradient-to-r from-[#0c234b] via-[#102e61] to-[#163e7c] text-white p-5 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
              Live Super Admin Hub
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-white mt-1">
            Executive Central Command
          </h1>
          <p className="text-xs text-blue-200 mt-0.5">
            Real-time operations, admissions, and branch network across 38 Tamil Nadu districts.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowAddStudentModal(true)}
            className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Register Student</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddCourseModal(true)}
            className="px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-white/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Course</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddEventModal(true)}
            className="px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-white/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('franchise')}
            className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
          >
            <Building className="w-4 h-4 text-slate-950" />
            <span>Franchise Pipeline</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Students</span>
            <div className="text-2xl font-black text-slate-950 mt-1">{totalStudentsCount}</div>
            <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" /> Live in database
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-sky-100 text-[#0c234b] flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Master Courses</span>
            <div className="text-2xl font-black text-slate-950 mt-1">{totalCoursesCount}</div>
            <span className="text-[11px] font-bold text-sky-700 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3" /> Skill & Tech
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Competitions</span>
            <div className="text-2xl font-black text-slate-950 mt-1">{totalEventsCount}</div>
            <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3 h-3" /> State & National
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
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

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">District Branches</span>
            <div className="text-2xl font-black text-slate-950 mt-1">38</div>
            <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3" /> All TN Districts
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Building className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Two-Column Live Activity Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Student Admissions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h2 className="text-sm font-black text-slate-950 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>Recent Student Admissions</span>
              </h2>
              <button
                type="button"
                onClick={() => setActiveTab('students')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1 cursor-pointer"
              >
                <span>View All ({totalStudentsCount})</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {recentStudents.length > 0 ? (
                recentStudents.map((st, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 truncate">
                          {st.studentName || st.name}
                        </span>
                        <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-150">
                          {st.userId}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="truncate text-slate-700 font-semibold">{st.program || st.courseName || 'Abacus'}</span>
                        <span>•</span>
                        <span className="truncate flex items-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5 text-slate-400" />
                          {st.branch || st.district || 'Tamil Nadu'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {st.grade || 'Enrolled'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  No recent students found in the database.
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-2">
            <button
              type="button"
              onClick={() => setActiveTab('students')}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer border border-slate-200"
            >
              <span>Open Student Registrations Desk</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Upcoming Competitions & Events */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h2 className="text-sm font-black text-slate-950 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span>Upcoming State & National Events</span>
              </h2>
              <button
                type="button"
                onClick={() => setActiveTab('events')}
                className="text-xs font-bold text-amber-700 hover:text-amber-900 transition flex items-center gap-1 cursor-pointer"
              >
                <span>Manage Events ({totalEventsCount})</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {recentEvents.length > 0 ? (
                recentEvents.map((ev, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">
                        {ev.title}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1 text-slate-600">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {ev.date}
                        </span>
                        <span>•</span>
                        <span className="truncate flex items-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5 text-slate-400" />
                          {ev.location || 'Tamil Nadu'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-50 text-amber-800 border border-amber-200">
                        {ev.category || 'Championship'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  No upcoming events scheduled.
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-2">
            <button
              type="button"
              onClick={() => setActiveTab('events')}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer border border-slate-200"
            >
              <span>Open Competition Event Management</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
