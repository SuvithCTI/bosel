

import React from 'react';

import {
  BookOpen,
  CalendarDays,
  MapPin,
  Ticket,
  Download,
  GraduationCap,
  CheckCircle2,
  FileText,
} from 'lucide-react';

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 sm:rounded-2xl sm:p-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-900 sm:h-10 sm:w-10 sm:rounded-xl">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>

      <p className="mt-2 text-[11px] font-medium text-slate-500 sm:mt-3 sm:text-xs">
        {label}
      </p>

      <p className="mt-1 break-words text-xs font-extrabold text-slate-900 sm:text-sm">
        {value || 'Not available'}
      </p>
    </div>
  );
}

export default function StudentCourse({
  student,
  onViewCertificate,
}) {
  const courseName =
    student?.program ||
    student?.course ||
    'Abacus Speed Math (Level 4) & Fine Arts';

  const events = Array.isArray(student?.events)
    ? student.events
    : [];

  const institution =
    student?.institution || 'Not specified';

  const level =
    student?.level || 'As per registration';

  const session =
    student?.academicSession || '2026–2027';

  const registrationStatus =
    student?.registrationStatus || 'Registered';

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
                <span className="inline-flex rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-300 sm:px-3 sm:text-[10px]">
                  Registered Program
                </span>

                <h3 className="mt-2 break-words text-lg font-black leading-snug text-white sm:mt-3 sm:text-2xl">
                  {courseName}
                </h3>

                <p className="mt-1.5 text-xs text-blue-100 sm:mt-2 sm:text-sm">
                  Academic session {session}
                </p>
              </div>
            </div>

            <span className="inline-flex w-fit shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-extrabold text-emerald-800 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs">
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {registrationStatus}
            </span>
          </div>
        </div>

        {/* COURSE INFORMATION */}

        <div className="p-4 sm:p-7">
          <h4 className="text-sm font-extrabold text-slate-900 sm:text-base">
            Course information
          </h4>

          <p className="mt-1.5 max-w-3xl text-xs leading-6 text-slate-600 sm:mt-2 sm:text-sm sm:leading-7">
            Your registered program is displayed here.
            Contact your registered institution for the official
            syllabus, class schedule, learning materials, and
            level-specific instructions.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:mt-6 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">

            <InfoCard
              icon={GraduationCap}
              label="Course / Level"
              value={level}
            />

            <InfoCard
              icon={CalendarDays}
              label="Academic Session"
              value={session}
            />

            <InfoCard
              icon={MapPin}
              label="Registered Institution"
              value={institution}
            />

            <InfoCard
              icon={FileText}
              label="Student ID"
              value={student?.id || student?.userId}
            />
          </div>
        </div>
      </section>

      {/* EXAMINATIONS AND HALL TICKETS */}

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-7">
        <div className="flex items-start gap-2.5 sm:gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-900 sm:h-11 sm:w-11 sm:rounded-xl">
            <Ticket className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-extrabold text-blue-950 sm:text-lg">
              Examinations & Hall Tickets
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm sm:leading-normal">
              Check your registered examinations and
              hall-ticket availability.
            </p>
          </div>
        </div>

        {events.length > 0 ? (
          <div className="mt-4 space-y-3 sm:mt-5">
            {events.map((event, index) => (
              <div
                key={event.id || `${event.name}-${index}`}
                className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:rounded-2xl sm:p-4"
              >
                <div className="min-w-0">
                  <h4 className="break-words text-xs font-extrabold text-slate-900 sm:text-sm">
                    {event.name || 'Registered Examination'}
                  </h4>

                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-2 text-[11px] text-slate-500 sm:gap-x-4 sm:text-xs">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />

                      {event.date || 'Date to be announced'}
                    </span>

                    {event.seat && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />

                        Seat: {event.seat}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[9px] font-bold text-blue-900 sm:px-3 sm:text-[10px]">
                    {event.status || 'Registered'}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleHallTicket(event)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-950 px-3 py-2 text-[11px] font-bold text-white transition hover:bg-blue-800 sm:gap-2 sm:rounded-xl sm:text-xs"
                  >
                    <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5" />

                    Hall Ticket
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-7 text-center sm:mt-5 sm:rounded-2xl sm:px-5 sm:py-8">
            <CalendarDays className="mx-auto h-7 w-7 text-slate-400 sm:h-8 sm:w-8" />

            <h4 className="mt-3 text-xs font-extrabold text-slate-800 sm:text-sm">
              No examinations available
            </h4>

            <p className="mx-auto mt-1 max-w-sm text-[11px] leading-5 text-slate-500 sm:text-xs">
              Examination schedules and hall-ticket details
              will appear here when they are available for
              your account.
            </p>
          </div>
        )}
      </section>


    </div>
  );
}
