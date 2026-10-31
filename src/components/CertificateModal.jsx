
import React, { useState, useEffect } from 'react';
import { X, Award } from 'lucide-react';
import Certificate from './Certificate';

export default function CertificateModal({
  isOpen = true,
  onClose,
  initialData = {},
}) {
  const [studentName, setStudentName] = useState(() => {
    if (initialData.studentName) return initialData.studentName;

    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('bsel_registered_student');

        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.studentName) return parsed.studentName;
        }
      } catch {
        // Ignore invalid localStorage data.
      }
    }

    return '';
  });

  const [courseName, setCourseName] = useState(
    initialData.courseName || 'Abacus'
  );

  const [level, setLevel] = useState(
    initialData.level || 'Level 1'
  );

  const [grade, setGrade] = useState(
    initialData.grade || 'A'
  );

  const duration = initialData.duration || '6 Months';

  const [registrationNo, setRegistrationNo] = useState(() => {
    if (initialData.registrationNo) {
      return initialData.registrationNo;
    }

    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('bsel_registered_student');

        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.registrationNo) {
            return parsed.registrationNo;
          }
        }
      } catch {
       
      }
    }

    return 'AB27-001';
  });

  const certificateNo =
    initialData.certificateNo || 'BSEL/ABACUS/L1/0007';

  const [centreName, setCentreName] = useState(
    initialData.centreName || 'test branch'
  );

  const centreCode = initialData.centreCode || '546454';

  const centreAddress =
    initialData.centreAddress ||
    'second street, surandai,keelasurandai,tenkasi';

  const [issueDate, setIssueDate] = useState(
    initialData.issueDate || '05-10-2026'
  );

  const [studentPhoto, setStudentPhoto] = useState(
    initialData.studentPhoto || null
  );

  const [certificateType, setCertificateType] = useState(
    initialData.certificateType || 'COMPETITION'
  );

  // Lock background scrolling while the modal is open.
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-slate-950/85 p-2 backdrop-blur-sm sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Official BSEL Certificate Preview"
        className="relative flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl animate-in fade-in zoom-in-95 duration-200 sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* FIXED HEADER */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-amber-500/30 bg-[#0b2146] px-3 py-2 sm:px-5 sm:py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-400/20 bg-amber-400/10 text-amber-400 sm:h-9 sm:w-9">
              <Award className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-xs font-black text-white sm:text-base">
                Official B★SEL Certificate Preview
              </h3>

              <p className="truncate text-[9px] text-slate-300 sm:text-[11px]">
                Course:{' '}
                <span className="font-semibold uppercase text-amber-300">
                  {courseName}
                </span>

                {studentName && (
                  <>
                    {' '}
                    | Candidate:{' '}
                    <span className="font-semibold capitalize text-amber-300">
                      {studentName}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20 active:scale-95 cursor-pointer"
              aria-label="Close certificate preview"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        {/* SCROLLABLE CERTIFICATE PREVIEW */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-slate-950/60 p-2 sm:p-3">
          <div className="flex min-h-full items-start justify-center">
            <Certificate
              studentName={studentName}
              courseName={courseName}
              level={level}
              grade={grade}
              duration={duration}
              registrationNo={registrationNo}
              certificateNo={certificateNo}
              centreName={centreName}
              centreCode={centreCode}
              centreAddress={centreAddress}
              issueDate={issueDate}
              studentPhoto={studentPhoto}
              certificateType={certificateType}
              showControls={true}
              showUploadPhoto={false}
            />
          </div>
        </div>

        {/* FIXED FOOTER */}
        <div className="flex shrink-0 flex-col items-center justify-between gap-2 border-t border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-400 sm:flex-row sm:px-5">
          <div className="flex max-w-full items-center gap-1.5 text-[10px] sm:text-[11px]">
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />

            <span className="truncate">
              Digital ID:{' '}
              <span className="font-mono text-slate-200">
                {certificateNo}
              </span>
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg bg-slate-800 px-4 py-1.5 font-bold text-white transition hover:bg-slate-700 sm:w-auto"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
