import { resetStoredCourses } from '../../data/coursesData';
import React from 'react';
import {
  BookOpen,
  Plus,
  RefreshCw,
  Search,
  Edit3,
  Trash2
} from 'lucide-react';

export default function AdminCoursesPage({
  filteredCourses,
  courseCategoryFilter,
  setCourseCategoryFilter,
  courseSearch,
  setCourseSearch,
  setShowAddCourseModal,
  handleStartEditCourse,
  handleDeleteCourse,
  setCoursesList,
  showToast
}) {
  return (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Header & Add Button */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  <span>Master Courses & Curriculum Management</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Super Admin can add new courses, update duration, fee structures, outcomes, and syllabus levels.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Course</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Reset courses to official default syllabus?')) {
                      setCoursesList(resetStoredCourses());
                      showToast('Courses reset to default syllabus.');
                    }
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>
              </div>
            </div>

            {/* Category Filter & Search */}
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                {['All', 'Skill Development', 'Creative Arts', 'Languages', 'Digital & Technology'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCourseCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      courseCategoryFilter === cat
                        ? 'bg-[#0c234b] text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  placeholder="Filter courses..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl outline-none"
                />
              </div>
            </div>

            {/* Course Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4.5 flex flex-col justify-between hover:shadow-md transition">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                          Code: {course.code || 'BSEL'} • {course.category || 'Skill'}
                        </span>
                        <h3 className="text-base font-black text-slate-950 mt-0.5">{course.name}</h3>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[11px] font-black">
                        {course.fee || '₹450'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                      {course.shortDesc || course.description || course.tagline}
                    </p>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Age Group</span>
                        <span className="font-bold text-slate-800">{course.ageGroup || '5 - 15 Years'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Levels & Term</span>
                        <span className="font-bold text-slate-800">{course.levels || '6 Levels'}</span>
                      </div>
                    </div>

                    {/* Learning Outcomes Snippet */}
                    <div className="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] uppercase font-black text-slate-500 block mb-1">Key Outcomes:</span>
                      <ul className="text-[11px] text-slate-700 space-y-0.5 list-disc list-inside">
                        {(course.outcomes || []).slice(0, 2).map((outcome, idx) => (
                          <li key={idx} className="truncate">{outcome}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-sky-700">
                      {course.enrolledStudents || 12} enrolled
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleStartEditCourse(course)}
                        className="px-3 py-1 text-xs font-bold bg-slate-100 hover:bg-[#081d3d] text-slate-700 hover:text-white rounded-lg transition flex items-center gap-1 cursor-pointer shadow-2xs"
                        title="Edit course syllabus, fee, and outcomes"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Details</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteCourse(course.id, course.name)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Remove Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
  );
}
