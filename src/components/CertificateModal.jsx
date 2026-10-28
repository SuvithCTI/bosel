import React, { useState } from 'react';
import { X, Award, Edit3 } from 'lucide-react';
import Certificate from './Certificate';

export default function CertificateModal({
  isOpen = true,
  onClose,
  initialData = {}
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
        // ignore
      }
    }
    return '';
  });
  const [courseName, setCourseName] = useState(initialData.courseName || 'Abacus');
  const [level, setLevel] = useState(initialData.level || 'Level 1');
  const [grade, setGrade] = useState(initialData.grade || 'A');
  const duration = initialData.duration || '6 Months';
  const [registrationNo, setRegistrationNo] = useState(initialData.registrationNo || 'BSEL-REG-849201');
  const certificateNo = initialData.certificateNo || 'BSEL/ABACUS/L1/0007';
  const [centreName, setCentreName] = useState(initialData.centreName || 'test branch');
  const centreCode = initialData.centreCode || '546454';
  const centreAddress = initialData.centreAddress || 'second street, surandai,keelasurandai,tenkasi';
  const [issueDate, setIssueDate] = useState(initialData.issueDate || '05-10-2026');
  const [studentPhoto, setStudentPhoto] = useState(initialData.studentPhoto || null);
  const [certificateType, setCertificateType] = useState(initialData.certificateType || 'COMPETITION');

  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div 
        className="relative bg-slate-900 rounded-2xl max-w-5xl w-full shadow-2xl overflow-hidden border border-slate-700 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#0b2146] text-white px-3 sm:px-5 py-3 border-b border-amber-500/30">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 shrink-0 border border-amber-400/20">
                <Award className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-black text-sm sm:text-base font-heading text-white truncate">
                  Official B★SEL Certificate Preview
                </h3>
                <p className="text-[11px] text-slate-300 truncate">
                  Course: <span className="text-amber-300 font-semibold uppercase">{courseName}</span> {studentName && <>| Candidate: <span className="text-amber-300 font-semibold capitalize">{studentName}</span></>}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer active:scale-95 ${
                  isEditing 
                    ? 'bg-amber-400 text-slate-950' 
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">{isEditing ? 'Done' : 'Customize'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="bg-white/10 hover:bg-white/20 text-white rounded-lg p-1.5 transition cursor-pointer active:scale-95"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Customizable Form if user wants to tweak fields */}
        {isEditing && (
          <div className="bg-slate-800 p-3 sm:p-4 border-b border-slate-700 text-slate-200 text-xs animate-in slide-in-from-top-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Candidate Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs sm:text-sm focus:ring-1 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Course / Subject</label>
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs sm:text-sm focus:ring-1 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Level</label>
                <input
                  type="text"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs sm:text-sm focus:ring-1 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Grade</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs sm:text-sm focus:ring-1 focus:ring-amber-400 focus:outline-none"
                >
                  <option value="A+">A+ (Outstanding)</option>
                  <option value="A">A (Distinction)</option>
                  <option value="B">B (Merit)</option>
                  <option value="Passed">Passed</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Certificate Type</label>
                <select
                  value={certificateType}
                  onChange={(e) => setCertificateType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs sm:text-sm focus:ring-1 focus:ring-amber-400 focus:outline-none"
                >
                  <option value="COMPETITION">COMPETITION</option>
                  <option value="COMPLETION">COMPLETION</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Examination Centre</label>
                <input
                  type="text"
                  value={centreName}
                  onChange={(e) => setCentreName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs sm:text-sm focus:ring-1 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Reg No.</label>
                <input
                  type="text"
                  value={registrationNo}
                  onChange={(e) => setRegistrationNo(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs sm:text-sm focus:ring-1 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Date of Issue</label>
                <input
                  type="text"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs sm:text-sm focus:ring-1 focus:ring-amber-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Modal Scrollable Canvas Body */}
        <div className="p-2 sm:p-5 max-h-[76vh] overflow-y-auto flex justify-center bg-slate-950/60">
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

        {/* Modal Footer */}
        <div className="bg-slate-900 px-3 sm:px-5 py-2.5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-[11px] truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span>Digital ID: <span className="font-mono text-slate-200">{certificateNo}</span></span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition font-bold cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
