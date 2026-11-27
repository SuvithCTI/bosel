
import React, { useState, useEffect } from 'react';
import { X, Award, ExternalLink } from 'lucide-react';
import Certificate, { buildVerificationUrl, getStudentVerificationMeta } from './Certificate';
import { getCoursePrefix, getActiveSession } from '../utils/authStorage';
import { resolveBranchDetails } from '../utils/branchAuthStorage';
import { resolveStudentGrade } from '../utils/studentDataHelpers';

export default function CertificateModal({
  isOpen = true,
  onClose,
  initialData = {},
  certData = null,
  showControls = true,
}) {
  const data = certData || initialData || {};
  const sessionUser = getActiveSession();
  const effectiveShowControls = showControls !== false;
  const [studentName, setStudentName] = useState(() => {
    if (data.studentName) return data.studentName;

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
    data.courseName || 'Abacus'
  );

  const [level, setLevel] = useState(
    data.level || 'Level 1'
  );

  const [grade, setGrade] = useState(() => {
    return resolveStudentGrade(data?.student || data, data?.grade) || '';
  });

  const duration = data.duration || '6 Months';

  const [registrationNo, setRegistrationNo] = useState(() => {
    if (data.registrationNo) {
      return data.registrationNo;
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

  const coursePrefix = getCoursePrefix(courseName);
  const cleanLvlDigits = String(level).replace(/\D/g, '') || '1';
  const regDigits = String(registrationNo).replace(/\D/g, '');
  const seqDigits = regDigits ? String(parseInt(regDigits.slice(-3), 10) || 1).padStart(4, '0') : '0001';

  const certificateNo =
    (data.certificateNo && !data.certificateNo.includes('BSEL/ABACUS/L1/0007'))
      ? data.certificateNo
      : `BSEL/${coursePrefix}/L${cleanLvlDigits}/${seqDigits}`;

  const initialBranch = resolveBranchDetails(data?.student || data, {
    centreName: data?.centreName,
    centreCode: data?.centreCode,
    centreAddress: data?.centreAddress
  });

  const [centreName, setCentreName] = useState(
    data.centreName && data.centreName !== 'Tenkasi Branch' ? data.centreName : initialBranch.centreName
  );

  const centreCode = (data.centreCode && data.centreCode !== '545454' && data.centreCode !== '546454')
    ? data.centreCode
    : initialBranch.centreCode;

  const centreAddress = (data.centreAddress && data.centreAddress !== 'Podanur' && !data.centreAddress.includes('Coimbatore / 641023'))
    ? data.centreAddress
    : initialBranch.centreAddress;

  const [issueDate, setIssueDate] = useState(
    data.issueDate || '05-10-2026'
  );

  const [studentPhoto, setStudentPhoto] = useState(
    data.studentPhoto ||
    data.photoUrl ||
    data.photo_url ||
    data.photo ||
    data.student?.studentPhoto ||
    data.student?.photoUrl ||
    data.student?.photo_url ||
    data.student?.photo ||
    null
  );

  const [certificateType, setCertificateType] = useState(
    data.certificateType || 'COMPLETION'
  );

  // Sync state whenever data prop changes
  useEffect(() => {
    const d = certData || initialData || {};
    if (d.studentName) setStudentName(d.studentName);
    if (d.courseName) setCourseName(d.courseName);
    if (d.level) setLevel(d.level);
    const resolvedG = resolveStudentGrade(d?.student || d, d?.grade);
    setGrade(resolvedG || '');
    if (d.registrationNo) setRegistrationNo(d.registrationNo);
    if (d.centreName) setCentreName(d.centreName);
    if (d.issueDate) setIssueDate(d.issueDate);
    const incomingPhoto =
      d.studentPhoto ||
      d.photoUrl ||
      d.photo_url ||
      d.photo ||
      d.student?.studentPhoto ||
      d.student?.photoUrl ||
      d.student?.photo_url ||
      d.student?.photo;
    if (incomingPhoto !== undefined) setStudentPhoto(incomingPhoto);
    if (d.certificateType) setCertificateType(d.certificateType);
  }, [certData, initialData]);

  // Listen for real-time marksheet updates
  useEffect(() => {
    const handleMarksUpdate = () => {
      const d = certData || initialData || {};
      const resolvedG = resolveStudentGrade(d?.student || d, d?.grade);
      setGrade(resolvedG || '');
    };
    window.addEventListener('bsel_marksheets_updated', handleMarksUpdate);
    window.addEventListener('bsel_users_updated', handleMarksUpdate);
    window.addEventListener('storage', handleMarksUpdate);
    return () => {
      window.removeEventListener('bsel_marksheets_updated', handleMarksUpdate);
      window.removeEventListener('bsel_users_updated', handleMarksUpdate);
      window.removeEventListener('storage', handleMarksUpdate);
    };
  }, [certData, initialData]);

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
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain bg-slate-950/60 p-2 sm:p-3">
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
              showControls={effectiveShowControls}
              showUploadPhoto={false}
              studentId={data?.studentId || data?.admissionNo || data?.id || registrationNo}
              admissionNo={data?.admissionNo || data?.registerNumber || registrationNo}
              student={data?.student || data}
              schoolName={data?.schoolName}
              schoolSubtitle={data?.schoolSubtitle}
              schoolMotto={data?.schoolMotto}
              schoolLogo={data?.schoolLogo}
              directorSignature={data?.directorSignature || data?.signature}
            />
          </div>
        </div>

        {/* FIXED FOOTER */}
        <div className="flex shrink-0 flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-400 sm:px-5">
          <div className="flex max-w-full items-center gap-1.5 text-[10px] sm:text-[11px] self-start sm:self-auto">
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />

            <span className="truncate">
              Digital ID:{' '}
              <span className="font-mono text-slate-200">
                {certificateNo}
              </span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const meta = getStudentVerificationMeta(studentName, registrationNo, certificateNo, data?.student || data, grade, studentPhoto);
                  const targetUrl = buildVerificationUrl({
                    certificateNo,
                    studentName,
                    courseName,
                    level,
                    grade,
                    registrationNo,
                    centreName,
                    centreCode,
                    issueDate,
                    duration,
                    centreAddress,
                    parentName: meta.parent,
                    score: meta.score,
                    vid: meta.vid,
                    sec: meta.sec,
                    photoKey: meta.photoKey,
                  }, true);
                  window.open(targetUrl, '_blank');
                }
              }}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 px-2 sm:px-3 py-1.5 font-bold text-slate-950 text-[11px] sm:text-xs shadow transition active:scale-95 cursor-pointer truncate text-center"
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Verify Online</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center rounded-lg bg-slate-800 px-3 py-1.5 font-bold text-white transition hover:bg-slate-700 text-[11px] sm:text-xs cursor-pointer text-center"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
