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
  Award,
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
  const results = Array.isArray(student?.results)
    ? student.results
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
                

                <h3 className="mt-2 break-words text-lg font-black leading-snug text-white sm:mt-3 sm:text-2xl">
                  {courseName}
                </h3>

                <p className="mt-1.5 text-xs text-blue-100 sm:mt-2 sm:text-sm">
                  Academic session {session}
                </p>
              </div>
            </div>

            
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
    </div>
  );
}
