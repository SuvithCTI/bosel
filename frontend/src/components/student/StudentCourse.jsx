import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  GraduationCap,
  Layers,
  CheckCircle2,
  Award,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText,
  Target,
  Star,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { getStoredCourses, DEFAULT_COURSES } from '../../data/coursesData';
import { PROGRAMS_DATA } from '../../data/programsData';

// Helper to resolve the course syllabus and curriculum structure
function resolveCourseSyllabus(courseNameQuery = '') {
  const query = String(courseNameQuery || '').toLowerCase().trim();
  const allStored =
    (typeof window !== 'undefined' ? getStoredCourses() : DEFAULT_COURSES) ||
    DEFAULT_COURSES;

  if (!query) {
    return allStored[0] || DEFAULT_COURSES[0];
  }

  // 1. Direct ID match
  const byId = allStored.find((c) => c.id && c.id.toLowerCase() === query);
  if (byId) return byId;

  // 2. Exact name match
  const byExactName = allStored.find((c) => {
    const n = String(c.name || '').toLowerCase();
    const fn = String(c.fullName || '').toLowerCase();
    return n === query || fn === query;
  });
  if (byExactName) return byExactName;

  // 3. Keyword matching table for stored courses
  const keywordMap = [
    { key: 'abacus', id: 'abacus' },
    { key: 'handwrit', id: 'handwriting' },
    { key: 'phonic', id: 'phonics' },
    { key: 'draw', id: 'drawing-art' },
    { key: 'art', id: 'drawing-art' },
    { key: 'paint', id: 'drawing-art' },
    { key: 'memory', id: 'memory-challenge' },
    { key: 'bharat', id: 'bharatanatyam' },
    { key: 'dance', id: 'bharatanatyam' },
    { key: 'office', id: 'ms-office' },
    { key: 'word', id: 'ms-office' },
    { key: 'excel', id: 'ms-office' },
    { key: 'html', id: 'html-basics' },
    { key: 'css', id: 'css-mastery' },
    { key: 'python', id: 'python-basics' },
    { key: 'comput', id: 'computer-fundamentals' },
    { key: 'photoshop', id: 'photoshop-basics' },
    { key: 'ai', id: 'ai-digital-skills' },
    { key: 'digital', id: 'ai-digital-skills' },
    { key: 'canva', id: 'canva-design' },
  ];

  for (const item of keywordMap) {
    if (query.includes(item.key)) {
      const match = allStored.find((c) => c.id === item.id);
      if (match) return match;
    }
  }

  // 4. Check in PROGRAMS_DATA for specific items (language, athletics, colour-management)
  const progMatch = PROGRAMS_DATA.find((p) => {
    const pn = String(p.name || '').toLowerCase();
    const pfn = String(p.fullName || '').toLowerCase();
    return (
      pn === query ||
      pfn === query ||
      query.includes(pn) ||
      pn.includes(query) ||
      (p.id && query.includes(p.id))
    );
  });

  if (progMatch) {
    return {
      id: progMatch.id,
      name: progMatch.name,
      fullName: progMatch.fullName,
      tagline: progMatch.tagline,
      description: progMatch.description,
      ageGroup: progMatch.ageGroup,
      levels: progMatch.levels,
      duration: progMatch.duration,
      outcomes: progMatch.outcomes,
      curriculum: (progMatch.curriculum || []).map((lvl) => {
        if (typeof lvl === 'string') {
          return {
            title: lvl,
            topics: [
              `Official Board syllabus competencies for ${lvl}`,
              `Structured practice drills and periodic assessments`,
            ],
          };
        }
        return lvl;
      }),
    };
  }

  // 5. Fallback: fuzzy substring in stored courses
  const fuzzy = allStored.find((c) => {
    const n = String(c.name || '').toLowerCase();
    const fn = String(c.fullName || '').toLowerCase();
    return (
      query.includes(n) ||
      n.includes(query) ||
      query.includes(fn) ||
      fn.includes(query)
    );
  });
  if (fuzzy) return fuzzy;

  // 6. Generic default course
  return allStored[0] || DEFAULT_COURSES[0];
}

// Helper to extract numeric level
function parseStudentLevel(courseEntry, student) {
  const directLevel =
    courseEntry?.level ||
    courseEntry?.grade ||
    student?.courseLevel ||
    student?.level ||
    student?.grade;

  if (directLevel && typeof directLevel === 'string') {
    const m = directLevel.match(/Level\s*(\d+)/i);
    if (m) return parseInt(m[1], 10);
    const num = parseInt(directLevel.replace(/\D/g, ''), 10);
    if (!isNaN(num) && num > 0) return num;
  }

  const nameToCheck =
    courseEntry?.courseName ||
    courseEntry?.name ||
    student?.courseName ||
    student?.program ||
    '';
  const m2 = nameToCheck.match(/Level\s*(\d+)/i);
  if (m2) return parseInt(m2[1], 10);

  return 1; // Default to Level 1
}

export default function StudentCourse({ student, onViewCertificate }) {
  // Normalize enrolled courses
  const selectedCourses = useMemo(() => {
    if (
      Array.isArray(student?.selectedCourses) &&
      student.selectedCourses.length > 0
    ) {
      return student.selectedCourses;
    }
    if (Array.isArray(student?.courses) && student.courses.length > 0) {
      return student.courses;
    }
    const singleName =
      student?.courseName ||
      student?.program ||
      student?.course ||
      'Abacus Speed Arithmetic';
    const singleLevel =
      student?.courseLevel || student?.level || student?.grade || 'Level 1';
    const singleReg =
      student?.registerNumber || student?.regNo || student?.admissionNo || '';
    return [
      {
        courseName: singleName,
        level: singleLevel,
        registerNumber: singleReg,
      },
    ];
  }, [student]);

  // Active selected course for syllabus inspection
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(0);

  const activeCourseEntry =
    selectedCourses[selectedCourseIndex] || selectedCourses[0] || {};
  const activeCourseName =
    activeCourseEntry.courseName ||
    activeCourseEntry.name ||
    'Abacus Speed Arithmetic';

  // Extract enrolled level
  const enrolledLevelNum = useMemo(
    () => parseStudentLevel(activeCourseEntry, student),
    [activeCourseEntry, student]
  );

  // Resolve syllabus data
  const syllabusData = useMemo(
    () => resolveCourseSyllabus(activeCourseName),
    [activeCourseName]
  );

  // State to toggle collapse/expand of levels (all open by default)
  const [collapsedLevels, setCollapsedLevels] = useState({});

  const toggleLevel = (levelIndex) => {
    setCollapsedLevels((prev) => ({
      ...prev,
      [levelIndex]: !prev[levelIndex],
    }));
  };

  const expandAll = () => setCollapsedLevels({});
  const collapseAll = () => {
    const all = {};
    (syllabusData.curriculum || []).forEach((_, idx) => {
      all[idx] = true;
    });
    setCollapsedLevels(all);
  };

  return (
    <div className="space-y-5 sm:space-y-7">
      {/* SECTION HEADING */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-600 sm:text-xs sm:tracking-[0.18em]">
            Curriculum & Learning Roadmap
          </p>
          <h2 className="mt-1 text-xl font-black tracking-tight text-blue-950 sm:text-3xl">
            My Enrolled Course & Syllabus
          </h2>
          <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
            View the official level-by-level syllabus structure, topics, and
            learning outcomes for your registered program.
          </p>
        </div>

        {onViewCertificate && (
          <button
            type="button"
            onClick={onViewCertificate}
            className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-blue-900 bg-blue-950 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-900 transition active:scale-95 cursor-pointer"
          >
            <Award className="h-4 w-4 text-amber-400" />
            <span>View Certificate</span>
          </button>
        )}
      </div>

      {/* MULTIPLE COURSES SELECTOR TABS (IF REGISTERED IN MORE THAN 1 COURSE) */}
      {selectedCourses.length > 1 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs">
          <p className="mb-2 text-[11px] font-black uppercase tracking-wider text-slate-500">
            Select Course to View Syllabus ({selectedCourses.length} Registered)
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedCourses.map((c, idx) => {
              const isSelected = selectedCourseIndex === idx;
              const cName = c.courseName || c.name || `Course ${idx + 1}`;
              const cLevel = c.level || 'Level 1';
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedCourseIndex(idx);
                    setCollapsedLevels({});
                  }}
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-extrabold transition cursor-pointer ${
                    isSelected
                      ? 'bg-blue-950 text-white shadow-md ring-2 ring-blue-900'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <BookOpen
                    className={`h-3.5 w-3.5 ${
                      isSelected ? 'text-amber-400' : 'text-slate-500'
                    }`}
                  />
                  <span>{cName}</span>
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                      isSelected
                        ? 'bg-blue-800 text-amber-300'
                        : 'bg-white text-slate-600'
                    }`}
                  >
                    {cLevel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* COURSE BANNER CARD */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:rounded-3xl">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0F2B5C] via-[#143B7A] to-[#1E4D99] p-5 text-white sm:p-8">
          <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full border-[20px] border-white/5 sm:h-52 sm:w-52 sm:border-[26px]" />
          <div className="pointer-events-none absolute bottom-0 right-1/3 h-32 w-32 rounded-full bg-amber-400/10 blur-xl" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-blue-950 shadow-lg sm:h-16 sm:w-16">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-white/15 backdrop-blur-xs px-2.5 py-0.5 text-[10.5px] font-black uppercase tracking-wider text-amber-300 border border-white/10">
                    <ShieldCheck className="h-3 w-3 text-amber-300" />
                    <span>Registered Course</span>
                  </span>
                  {activeCourseEntry.registerNumber && (
                    <span className="rounded-md bg-black/25 px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-slate-200 border border-white/10">
                      Reg: {activeCourseEntry.registerNumber}
                    </span>
                  )}
                </div>

                <h3 className="mt-2 text-xl font-black leading-tight text-white sm:text-3xl">
                  {syllabusData.fullName || activeCourseName}
                </h3>

                {syllabusData.tagline && (
                  <p className="mt-1 text-xs sm:text-sm font-semibold text-blue-100/90 italic">
                    "{syllabusData.tagline}"
                  </p>
                )}
              </div>
            </div>

            {/* Current Level Pill */}
            <div className="self-start sm:self-auto shrink-0 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-3 text-center sm:px-5 sm:py-3.5">
              <span className="block text-[10px] font-extrabold uppercase tracking-widest text-amber-300">
                Current Enrolled Level
              </span>
              <span className="mt-0.5 block text-lg font-black text-white sm:text-2xl">
                {activeCourseEntry.level || `Level ${enrolledLevelNum}`}
              </span>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-6 grid grid-cols-2 gap-2 border-t border-white/15 pt-4 sm:grid-cols-4 sm:gap-3">
            <div className="rounded-xl bg-white/10 p-2.5 backdrop-blur-xs">
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-blue-200">
                <Award className="h-3.5 w-3.5 text-amber-400" />
                Levels
              </span>
              <span className="mt-1 block text-xs font-black text-white sm:text-sm">
                {syllabusData.levels || 'Structured Levels'}
              </span>
            </div>

            <div className="rounded-xl bg-white/10 p-2.5 backdrop-blur-xs">
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-blue-200">
                <Clock className="h-3.5 w-3.5 text-emerald-400" />
                Duration
              </span>
              <span className="mt-1 block text-xs font-black text-white sm:text-sm">
                {syllabusData.duration || '3 Months / Level'}
              </span>
            </div>

            <div className="rounded-xl bg-white/10 p-2.5 backdrop-blur-xs">
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-blue-200">
                <GraduationCap className="h-3.5 w-3.5 text-sky-400" />
                Age Group
              </span>
              <span className="mt-1 block text-xs font-black text-white sm:text-sm">
                {syllabusData.ageGroup || 'All Age Groups'}
              </span>
            </div>

            <div className="rounded-xl bg-white/10 p-2.5 backdrop-blur-xs">
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-blue-200">
                <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
                Board Certification
              </span>
              <span className="mt-1 block text-xs font-black text-white sm:text-sm">
                B★SEL Certified
              </span>
            </div>
          </div>
        </div>

        {/* SYLLABUS CONTENT BODY */}
        <div className="p-4 sm:p-7 space-y-6 sm:space-y-8">
          {/* About Course Description */}
          {syllabusData.description && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
              <h4 className="flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wider text-blue-950 mb-2">
                <FileText className="h-4 w-4 text-blue-900" />
                <span>Program Overview</span>
              </h4>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-700 font-medium">
                {syllabusData.description}
              </p>
            </div>
          )}

          {/* OFFICIAL SYLLABUS BY LEVEL */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-950" />
                <div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    Official Course Syllabus & Level Roadmap
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                    Detailed curriculum topics prescribed by Board of Skills and
                    Educational Learning
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={expandAll}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Expand All
                </button>
                <button
                  type="button"
                  onClick={collapseAll}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Collapse All
                </button>
              </div>
            </div>

            {/* CURRICULUM LEVEL CARDS */}
            {Array.isArray(syllabusData.curriculum) &&
            syllabusData.curriculum.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {syllabusData.curriculum.map((levelItem, idx) => {
                  const levelNum = idx + 1;
                  const isCurrentEnrolled = levelNum === enrolledLevelNum;
                  const isCollapsed = Boolean(collapsedLevels[idx]);

                  const isObj =
                    typeof levelItem === 'object' && levelItem !== null;
                  const title = isObj
                    ? levelItem.title || `Level ${levelNum}`
                    : String(levelItem);
                  const topics =
                    isObj && Array.isArray(levelItem.topics)
                      ? levelItem.topics
                      : [];

                  return (
                    <div
                      key={idx}
                      className={`overflow-hidden rounded-2xl border transition-all ${
                        isCurrentEnrolled
                          ? 'border-amber-400 bg-gradient-to-b from-amber-50/50 via-white to-amber-50/20 shadow-md ring-2 ring-amber-400/50'
                          : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      {/* LEVEL HEADER BUTTON */}
                      <button
                        type="button"
                        onClick={() => toggleLevel(idx)}
                        className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left transition hover:bg-slate-50/60 cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Level Badge */}
                          <div
                            className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl font-mono text-xs sm:text-sm font-black shadow-xs ${
                              isCurrentEnrolled
                                ? 'bg-amber-500 text-slate-950 font-black'
                                : 'bg-blue-950 text-white'
                            }`}
                          >
                            L{levelNum}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <h5 className="text-xs sm:text-sm font-black text-slate-900 leading-snug break-words">
                                {title}
                              </h5>

                              {isCurrentEnrolled && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-900">
                                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                  <span>Your Enrolled Level</span>
                                </span>
                              )}
                            </div>

                            {topics.length > 0 && (
                              <p className="mt-0.5 text-[11px] text-slate-500">
                                {topics.length} Syllabus Modules / Topics
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pl-2 shrink-0">
                          <span className="text-slate-400">
                            {isCollapsed ? (
                              <ChevronDown className="h-5 w-5" />
                            ) : (
                              <ChevronUp className="h-5 w-5" />
                            )}
                          </span>
                        </div>
                      </button>

                      {/* LEVEL TOPICS LIST */}
                      {!isCollapsed && (
                        <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-3 sm:px-5 sm:py-4">
                          {topics.length > 0 ? (
                            <ul className="space-y-2">
                              {topics.map((topic, tIdx) => (
                                <li
                                  key={tIdx}
                                  className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium"
                                >
                                  <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-900">
                                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                                  </span>
                                  <span className="min-w-0 break-words">
                                    {topic}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-slate-500 italic">
                              Comprehensive level curriculum, structured
                              practice worksheets, and graded term evaluations.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500">
                Syllabus details for this course are being updated by the
                academic council.
              </p>
            )}
          </div>

          {/* LEARNING OUTCOMES & COMPETENCIES */}
          {Array.isArray(syllabusData.outcomes) &&
            syllabusData.outcomes.length > 0 && (
              <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/80 via-white to-blue-50/40 p-4 sm:p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-5 w-5 text-blue-900" />
                  <h4 className="text-sm sm:text-base font-black text-blue-950">
                    Key Learning Outcomes & Competencies
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  {syllabusData.outcomes.map((outcome, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 rounded-xl border border-blue-100 bg-white p-3 shadow-2xs"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                      <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                        {outcome}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </section>
    </div>
  );
}
