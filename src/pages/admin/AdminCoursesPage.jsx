import { resetStoredCourses } from '../../data/coursesData';
import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  RefreshCw,
  Search,
  Edit3,
  Trash2,
  Layers,
  Eye,
  X,
  Sparkles,
  Clock,
  CheckCircle2,
  GraduationCap
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
  const [viewingCourse, setViewingCourse] = useState(null);

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
            Super Admin can add new courses, update cover images, levels & syllabus structure, fee, and learning outcomes.
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
        {filteredCourses.map((course) => {
          const curriculumLength = Array.isArray(course.curriculum) ? course.curriculum.length : 0;

          return (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4.5 flex flex-col justify-between hover:shadow-md transition overflow-hidden"
            >
              <div>
                {/* Course Cover Image Banner */}
                <div className="relative h-36 w-full -mt-4.5 -mx-4.5 mb-3.5 overflow-hidden rounded-t-2xl bg-slate-900 border-b border-slate-200">
                  {course.image ? (
                    <img
                      src={course.image}
                      alt={course.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0c234b] to-[#123975] text-white p-3 text-center">
                      <BookOpen className="w-8 h-8 text-amber-400 mb-1" />
                      <span className="text-xs font-black tracking-wide">{course.name}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-black/20 to-black/30 pointer-events-none" />

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono font-black uppercase tracking-wider border border-white/20">
                      {course.code || 'BSEL'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                      {course.category || 'Skill'}
                    </span>
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase shadow-xs ${
                      course.status === 'Inactive' ? 'bg-rose-500 text-white' : course.status === 'Upcoming' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600 text-white'
                    }`}>
                      {course.status || 'Active'}
                    </span>
                  </div>

                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
                    <span className="font-extrabold text-sm drop-shadow-sm truncate pr-2">
                      {course.name}
                    </span>
                    <span className="font-mono font-black text-amber-300 text-sm bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-xs shrink-0">
                      {course.fee || '₹450'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{course.fullName || course.name}</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-medium">
                      {course.tagline || course.shortDesc}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                  {course.description || course.shortDesc}
                </p>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Age Group</span>
                    <span className="font-bold text-slate-800">{course.ageGroup || '5 - 15 Years'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Levels & Term</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-blue-900 shrink-0" />
                      <span className="truncate">{course.levels || (curriculumLength ? `${curriculumLength} Levels` : '6 Levels')}</span>
                    </span>
                  </div>
                </div>

                {/* Learning Outcomes Snippet */}
                <div className="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-black text-slate-500 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Key Outcomes:</span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {(course.outcomes || []).length} Points
                    </span>
                  </div>
                  <ul className="text-[11px] text-slate-700 space-y-0.5 list-disc list-inside">
                    {(course.outcomes || []).slice(0, 2).map((outcome, idx) => (
                      <li key={idx} className="truncate">{outcome}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setViewingCourse(course)}
                  className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:text-blue-950 hover:bg-slate-100 rounded-lg transition flex items-center gap-1 cursor-pointer"
                  title="View full syllabus and details"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-900" />
                  <span>View Details</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleStartEditCourse(course)}
                    className="px-3 py-1 text-xs font-bold bg-[#081d3d] hover:bg-[#123068] text-white rounded-lg transition flex items-center gap-1 cursor-pointer shadow-2xs"
                    title="Edit full course, cover image, levels & fee"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Edit</span>
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
          );
        })}
      </div>

      {/* DETAIL / SYLLABUS PREVIEW MODAL */}
      {viewingCourse && (
        <div className="fixed inset-0 z-[150] bg-black/75 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 my-auto flex flex-col max-h-[90vh]">
            {/* Modal Header with Course Cover */}
            <div className="relative h-44 w-full bg-slate-900 shrink-0">
              {viewingCourse.image ? (
                <img src={viewingCourse.image} alt={viewingCourse.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#081d3d] to-[#123975] text-white">
                  <BookOpen className="w-12 h-12 text-amber-400 mb-2" />
                  <span className="text-base font-black">{viewingCourse.name}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-black/40 to-transparent" />
              
              <button
                type="button"
                onClick={() => setViewingCourse(null)}
                className="absolute top-3 right-3 text-white/80 hover:text-white bg-black/50 hover:bg-black/70 p-1.5 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3 text-white">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-mono text-[10px] font-black uppercase">
                      {viewingCourse.code || 'BSEL'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-900/80 backdrop-blur-xs text-[10px] font-bold">
                      {viewingCourse.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-[10px] font-black uppercase">
                      {viewingCourse.status || 'Active'}
                    </span>
                  </div>
                  <h3 className="text-lg font-black drop-shadow-sm">{viewingCourse.fullName || viewingCourse.name}</h3>
                </div>

                <div className="text-right shrink-0">
                  <span className="block text-[10px] text-slate-300 font-bold uppercase">Tuition Fee</span>
                  <span className="text-base font-mono font-black text-amber-400">{viewingCourse.fee || '₹450'}</span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="block text-[9.5px] uppercase font-bold text-slate-400">Age Group</span>
                  <span className="font-bold text-slate-800">{viewingCourse.ageGroup || '5 - 15 Years'}</span>
                </div>
                <div>
                  <span className="block text-[9.5px] uppercase font-bold text-slate-400">Duration</span>
                  <span className="font-bold text-slate-800">{viewingCourse.duration || '3 Months per Level'}</span>
                </div>
                <div>
                  <span className="block text-[9.5px] uppercase font-bold text-slate-400">Total Levels</span>
                  <span className="font-bold text-slate-800">{viewingCourse.levels || '6 Levels'}</span>
                </div>
                <div>
                  <span className="block text-[9.5px] uppercase font-bold text-slate-400">Enrolled Students</span>
                  <span className="font-bold text-emerald-700">{viewingCourse.enrolledStudents || 12} Students</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-bold text-slate-900 mb-1 uppercase text-[10px] tracking-wider text-slate-400">
                  Course Overview & Methodology
                </h4>
                <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                  {viewingCourse.description || viewingCourse.shortDesc || 'No extended description provided.'}
                </p>
              </div>

              {/* Outcomes */}
              {Array.isArray(viewingCourse.outcomes) && viewingCourse.outcomes.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-1.5 uppercase text-[10px] tracking-wider text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Learning Outcomes & Core Competencies</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {viewingCourse.outcomes.map((outcome, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-slate-800 font-medium">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Curriculum Levels */}
              <div>
                <h4 className="font-bold text-slate-900 mb-1.5 uppercase text-[10px] tracking-wider text-slate-400 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-blue-900" />
                  <span>Curriculum Syllabus by Level</span>
                </h4>
                
                {Array.isArray(viewingCourse.curriculum) && viewingCourse.curriculum.length > 0 ? (
                  <div className="space-y-2">
                    {viewingCourse.curriculum.map((lvl, idx) => {
                      const isObj = typeof lvl === 'object' && lvl !== null;
                      const title = isObj ? (lvl.title || `Level ${idx + 1}`) : lvl;
                      const topics = isObj && Array.isArray(lvl.topics) ? lvl.topics : [];

                      return (
                        <div key={idx} className="rounded-xl border border-slate-200 bg-white p-3 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-blue-900 text-white font-mono text-[10px] font-black">
                              L{idx + 1}
                            </span>
                            <span className="font-black text-slate-900 text-xs">{title}</span>
                          </div>
                          {topics.length > 0 && (
                            <ul className="pl-6 list-disc text-slate-600 space-y-0.5 text-[11px]">
                              {topics.map((t, tIdx) => (
                                <li key={tIdx}>{t}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-slate-500 italic p-3 bg-slate-50 rounded-xl border border-slate-200">
                    No structured levels configured. Click "Edit Course" to add levels.
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setViewingCourse(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-white transition cursor-pointer text-xs"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  const toEdit = viewingCourse;
                  setViewingCourse(null);
                  handleStartEditCourse(toEdit);
                }}
                className="px-4 py-2 bg-[#081d3d] hover:bg-[#123068] text-white rounded-xl font-black transition flex items-center gap-1.5 cursor-pointer text-xs shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span>Edit This Course</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
