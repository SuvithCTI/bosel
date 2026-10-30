
import React, { useState, useEffect } from 'react';
import { X, Award, Edit3 } from 'lucide-react';
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

  const [isEditing, setIsEditing] = useState(false);

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

  const fieldClass =
    'h-8 w-full rounded-md border border-slate-700 bg-slate-900 px-2 text-xs text-white outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400';

  const labelClass =
    'mb-0.5 block text-[9px] font-bold uppercase leading-3 tracking-wide text-slate-400';

  const renderField = (label, control) => (
    <div className="min-w-0" key={label}>
      <label className={labelClass}>{label}</label>
      {control}
    </div>
  );

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
              onClick={() => setIsEditing((previous) => !previous)}
              aria-expanded={isEditing}
              className={`flex h-8 items-center justify-center gap-1 rounded-lg px-2.5 text-xs font-bold transition active:scale-95 sm:px-3 ${
                isEditing
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" />

              <span>{isEditing ? 'Done' : 'Customize'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20 active:scale-95"
              aria-label="Close certificate preview"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        {/* COMPACT EDITING PANEL */}
        {isEditing && (
          <div className="shrink-0 border-b border-slate-700 bg-slate-800 px-3 py-2 text-slate-200 animate-in slide-in-from-top-2 sm:px-4 sm:py-2.5">
            <div className="grid grid-cols-2 gap-x-2.5 gap-y-2 sm:grid-cols-4 sm:gap-x-3 sm:gap-y-2">
              {renderField(
                'Candidate Name',
                <input
                  type="text"
                  value={studentName}
                  onChange={(event) => setStudentName(event.target.value)}
                  className={fieldClass}
                  placeholder="Candidate name"
                />
              )}

              {renderField(
                'Course / Subject',
                <input
                  type="text"
                  value={courseName}
                  onChange={(event) => setCourseName(event.target.value)}
                  className={fieldClass}
                  placeholder="Course name"
                />
              )}

              {renderField(
                'Level',
                <input
                  type="text"
                  value={level}
                  onChange={(event) => setLevel(event.target.value)}
                  className={fieldClass}
                  placeholder="Level"
                />
              )}

              {renderField(
                'Grade',
                <select
                  value={grade}
                  onChange={(event) => setGrade(event.target.value)}
                  className={fieldClass}
                >
                  <option value="A+">A+ (Outstanding)</option>
                  <option value="A">A (Distinction)</option>
                  <option value="B">B (Merit)</option>
                  <option value="Passed">Passed</option>
                </select>
              )}

              {renderField(
                'Certificate Type',
                <select
                  value={certificateType}
                  onChange={(event) =>
                    setCertificateType(event.target.value)
                  }
                  className={fieldClass}
                >
                  <option value="COMPETITION">COMPETITION</option>
                  <option value="COMPLETION">COMPLETION</option>
                </select>
              )}

              {renderField(
                'Examination Centre',
                <input
                  type="text"
                  value={centreName}
                  onChange={(event) => setCentreName(event.target.value)}
                  className={fieldClass}
                  placeholder="Centre name"
                />
              )}

              {renderField(
                'Reg No.',
                <input
                  type="text"
                  value={registrationNo}
                  onChange={(event) =>
                    setRegistrationNo(event.target.value)
                  }
                  className={fieldClass}
                  placeholder="Registration number"
                />
              )}

              {renderField(
                'Date of Issue',
                <input
                  type="text"
                  value={issueDate}
                  onChange={(event) => setIssueDate(event.target.value)}
                  className={fieldClass}
                  placeholder="DD-MM-YYYY"
                />
              )}
            </div>

            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-md bg-amber-400 px-3 py-1 text-[10px] font-extrabold text-slate-950 transition hover:bg-amber-300"
              >
                Done Editing
              </button>
            </div>
          </div>
        )}

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
              onPhotoUpload={(photo) => setStudentPhoto(photo)}
              showControls={true}
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
