import React from 'react';
import {
  BookOpen,
  GraduationCap,
} from 'lucide-react';

export default function StudentCourse({
  student,
  onViewCertificate,
}) {
  const selectedCourses = Array.isArray(student?.selectedCourses) && student.selectedCourses.length > 0
    ? student.selectedCourses
    : (Array.isArray(student?.courses) ? student.courses : []);

  const courseName = selectedCourses.length > 1
    ? selectedCourses.map(c => c.courseName || c.name).filter(Boolean).join(' & ')
    : (
        student?.courseName ||
        student?.program ||
        student?.course ||
        'Abacus Speed Math (Level 4) & Fine Arts'
      );

  const events = Array.isArray(student?.events)
    ? student.events
    : [];
  const results = Array.isArray(student?.results)
    ? student.results
    : [];

  const handleHallTicket = (event) => {
    if (event.hallTicketUrl) {
      window.open(
        event.hallTicketUrl,
        '_blank',
        'noopener,noreferrer'
      );
    } else {
      window.alert(
        `A hall ticket has not been uploaded for "${
          event.name || 'this examination'
        }" yet.`
      );
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">

      {/* SECTION HEADING */}

      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-600 sm:text-xs sm:tracking-[0.18em]">
          Learning overview
        </p>

        <h2 className="mt-1.5 text-xl font-black tracking-tight text-blue-950 sm:mt-2 sm:text-3xl">
          My Course
        </h2>

        <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:mt-2 sm:text-sm sm:leading-6">
          View your registered program, enrollment details,
          and examination schedules.
        </p>
      </div>

      {/* MAIN COURSE CARD */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:rounded-3xl">

        {/* COURSE BANNER */}

        <div className="relative overflow-hidden bg-gradient-to-br from-[#0F2B5C] to-[#1E4D99] p-4 text-white sm:p-8">
          <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full border-[18px] border-white/5 sm:h-44 sm:w-44 sm:border-[24px]" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-5">

            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-blue-950 shadow-lg sm:h-14 sm:w-14 sm:rounded-2xl">
                <BookOpen className="h-5 w-5 sm:h-7 sm:w-7" />
              </div>

              <div className="min-w-0">
                

                <h3 className="mt-2 break-words text-lg font-black leading-snug text-white sm:mt-3 sm:text-2xl">
                  {courseName}
                </h3>

              </div>
            </div>

            
          </div>
        </div>

        <div className="p-4 sm:p-7">
          {selectedCourses.length > 1 && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 sm:p-5">
              <h5 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-900" />
                <span>All Enrolled Courses ({selectedCourses.length})</span>
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedCourses.map((c, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs transition hover:border-blue-200"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="shrink-0 whitespace-nowrap rounded-md border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-900">
                          Course {idx + 1}
                        </span>
                        {c.registerNumber && (
                          <span className="shrink-0 whitespace-nowrap rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10.5px] font-bold text-slate-700">
                            #{c.registerNumber}
                          </span>
                        )}
                      </div>

                      <p className="mt-2 font-black text-slate-900 text-sm sm:text-base leading-snug">
                        {c.courseName || c.name}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center">
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200/80 bg-blue-50/80 px-2.5 py-1 text-[11px] font-bold text-blue-950">
                        <GraduationCap className="h-3.5 w-3.5 shrink-0 text-blue-700" />
                        <span className="break-words">{c.level || 'Level 1'}</span>
                      </span>
                    </div>
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
