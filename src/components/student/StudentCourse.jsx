
import React from 'react';
import {
  BookOpen,
  CalendarDays,
  MapPin,
  Ticket,
  Download,
  Award,
  GraduationCap,
  CheckCircle2,
  FileText,
} from 'lucide-react';

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-blue-50 text-blue-900">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>

      <p className="mt-2 sm:mt-3 text-[11px] sm:text-xs font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-xs sm:text-sm font-extrabold text-slate-900">
        {value || 'Not available'}
      </p>
    </div>
  );
}

export default function StudentCourse({ student, onViewCertificate }) {
  const courseName =
    student?.program ||
    student?.course ||
    'Abacus Speed Math (Level 4) & Fine Arts';

  const events = Array.isArray(student?.events) ? student.events : [];
  const results = Array.isArray(student?.results) ? student.results : [];

  const institution = student?.institution || 'Not specified';
  const level = student?.level || 'As per registration';
  const session = student?.academicSession || '2026–2027';
  const registrationStatus = student?.registrationStatus || 'Registered';

  const handleHallTicket = (event) => {
    if (event.hallTicketUrl) {
      window.open(event.hallTicketUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.alert(
        `A hall ticket has not been uploaded for "${event.name}" yet.`
      );
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Section heading */}
      <div>
        <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.16em] sm:tracking-[0.18em] text-amber-600">
          Learning overview
        </p>

        <h2 className="mt-1.5 sm:mt-2 text-xl sm:text-3xl font-black tracking-tight text-blue-950">
          My Course
        </h2>

        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-500">
          View your registered program, enrollment details, examinations, and
          available results.
        </p>
      </div>

      {/* Main course card */}
      <section className="overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0F2B5C] to-[#1E4D99] p-4 sm:p-8 text-white">
          <div className="absolute -right-8 -top-10 h-36 w-36 sm:h-44 sm:w-44 rounded-full border-[18px] sm:border-[24px] border-white/5" />

          <div className="relative flex flex-col gap-4 sm:gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-amber-400 text-blue-950 shadow-lg">
                <BookOpen className="h-5 w-5 sm:h-7 sm:w-7" />
              </div>

              <div className="min-w-0">
                <span className="inline-flex rounded-full bg-white/10 px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  Registered Program
                </span>

                <h3 className="mt-2 sm:mt-3 break-words text-lg sm:text-2xl font-black leading-snug">
                  {courseName}
                </h3>

                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-blue-100">
                  Academic session {session}
                </p>
              </div>
            </div>

            <span className="inline-flex w-fit shrink-0 items-center gap-1 sm:gap-1.5 rounded-full bg-emerald-100 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-extrabold text-emerald-800">
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {registrationStatus}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-7">
          <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
            Course information
          </h4>

          <p className="mt-1.5 sm:mt-2 max-w-3xl text-xs sm:text-sm leading-6 sm:leading-7 text-slate-600">
            Your registered program is displayed here. Contact your registered
            institution for the official syllabus, class schedule, learning
            materials, and level-specific instructions.
          </p>

          <div className="mt-4 sm:mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
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

      {/* Examination / hall tickets */}
      <section className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-7 shadow-sm">
        <div className="flex items-start gap-2.5 sm:gap-3">
          <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-blue-50 text-blue-900">
            <Ticket className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>

          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-extrabold text-blue-950">
              Examinations & Hall Tickets
            </h3>

            <p className="mt-1 text-xs sm:text-sm leading-5 sm:leading-normal text-slate-500">
              Check your registered examinations and hall-ticket availability.
            </p>
          </div>
        </div>

        {events.length > 0 ? (
          <div className="mt-4 sm:mt-5 space-y-3">
            {events.map((event, index) => (
              <div
                key={event.id || `${event.name}-${index}`}
                className="flex flex-col gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h4 className="break-words text-xs sm:text-sm font-extrabold text-slate-900">
                    {event.name || 'Registered Examination'}
                  </h4>

                  <div className="mt-2 flex flex-wrap gap-x-3 sm:gap-x-4 gap-y-2 text-[11px] sm:text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                      {event.date || 'Date to be announced'}
                    </span>

                    {event.seat && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                        Seat: {event.seat}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-blue-100 px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] font-bold text-blue-900">
                    {event.status || 'Registered'}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleHallTicket(event)}
                    className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-blue-950 px-3 py-2 text-[11px] sm:text-xs font-bold text-white transition hover:bg-blue-800"
                  >
                    <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    Hall Ticket
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 sm:mt-5 rounded-xl sm:rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 sm:px-5 py-7 sm:py-8 text-center">
            <CalendarDays className="mx-auto h-7 w-7 sm:h-8 sm:w-8 text-slate-400" />

            <h4 className="mt-3 text-xs sm:text-sm font-extrabold text-slate-800">
              No examinations available
            </h4>

            <p className="mx-auto mt-1 max-w-sm text-[11px] sm:text-xs leading-5 text-slate-500">
              Examination schedules and hall-ticket details will appear here
              when they are available for your account.
            </p>
          </div>
        )}
      </section>

      {/* Results and certificates */}
      <section className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-7 shadow-sm">
        <div className="flex items-start gap-2.5 sm:gap-3">
          <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-amber-50 text-amber-700">
            <Award className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>

          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-extrabold text-blue-950">
              Results & Certificates
            </h3>

            <p className="mt-1 text-xs sm:text-sm leading-5 sm:leading-normal text-slate-500">
              View published examination results and available certificates.
            </p>
          </div>
        </div>

        {results.length > 0 ? (
          <div className="mt-4 sm:mt-5 space-y-3">
            {results.map((result, index) => (
              <div
                key={result.id || `${result.exam}-${index}`}
                className="flex flex-col gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border border-amber-200 bg-amber-50/50 p-3 sm:p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h4 className="break-words text-xs sm:text-sm font-extrabold text-slate-900">
                    {result.exam || 'Examination Result'}
                  </h4>

                  <div className="mt-2 flex flex-wrap gap-x-3 sm:gap-x-4 gap-y-2 text-[11px] sm:text-xs text-slate-600">
                    <span>
                      Score:{' '}
                      <strong className="text-slate-900">
                        {result.score ?? 'Pending'}
                      </strong>
                    </span>

                    <span>
                      Rank:{' '}
                      <strong className="text-slate-900">
                        {result.rank ?? 'Pending'}
                      </strong>
                    </span>

                    {result.certificateNo && (
                      <span>
                        Certificate:{' '}
                        <strong className="break-all font-mono text-slate-800">
                          {result.certificateNo}
                        </strong>
                      </span>
                    )}
                  </div>
                </div>

                {result.certificateNo && (
                  <button
                    type="button"
                    onClick={() =>
                      onViewCertificate?.({
                        studentName: student?.name || student?.studentName,
                        courseName,
                        level,
                        grade: result.grade || 'A+',
                        registrationNo: student?.registerNumber || student?.registrationNo || student?.userId,
                        certificateNo: result.certificateNo,
                        centreName: institution,
                      })
                    }
                    className="inline-flex w-full sm:w-auto shrink-0 items-center justify-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-amber-400 px-3 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-xs font-extrabold text-slate-950 transition hover:bg-amber-500"
                  >
                    <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    View Certificate
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 sm:mt-5 rounded-xl sm:rounded-2xl border border-dashed border-amber-200 bg-amber-50/40 px-4 sm:px-5 py-7 sm:py-8 text-center">
            <Award className="mx-auto h-7 w-7 sm:h-8 sm:w-8 text-amber-500" />

            <h4 className="mt-3 text-xs sm:text-sm font-extrabold text-slate-800">
              Results not published yet
            </h4>

            <p className="mx-auto mt-1 max-w-sm text-[11px] sm:text-xs leading-5 text-slate-500">
              Your results and certificates will appear here after they are
              published for your registered examinations.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
