import Certificate from '../../components/Certificate';
import React from 'react';
import {
  Award
} from 'lucide-react';

export default function AdminBranchCertificatesPage({
  activeBranch = 'Branch Centre',
  branchStudents = [],
  certData = {},
  handleOpenCertForStudent
}) {
  const safeCert = {
    studentName: certData?.studentName || 'Candidate Name',
    courseName: certData?.courseName || 'Course Name',
    programPrefix: certData?.programPrefix || 'MINDSPARC',
    level: certData?.level || 'Level 1',
    grade: certData?.grade || 'A',
    duration: certData?.duration || '6 Months',
    registrationNo: certData?.registrationNo || 'REG-001',
    certificateNo: certData?.certificateNo || 'BSEL/CERT/001',
    centreName: activeBranch || certData?.centreName || 'Branch Centre',
    centreCode: certData?.centreCode || '101',
    centreAddress: certData?.centreAddress || 'Branch Address',
    issueDate: certData?.issueDate || '01-01-2026',
    certificateType: certData?.certificateType || 'COMPLETION',
    studentPhoto: certData?.studentPhoto || null
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="bg-white p-3.5 sm:p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-950 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500 shrink-0" />
            <span>{activeBranch} — Official Certificate Desk</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Issue certificates with Centre Director signature ({activeBranch}) and Board accreditation seal.
          </p>
        </div>

        {/* Quick Select from Branch Students */}
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Select Branch Student:</span>
          <select
            onChange={(e) => {
              const st = (branchStudents || []).find(s => s.userId === e.target.value);
              if (st && handleOpenCertForStudent) handleOpenCertForStudent(st);
            }}
            className="w-full sm:w-auto px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-bold outline-none cursor-pointer hover:border-sky-400 focus:border-sky-500 transition"
          >
            <option value="">-- Choose Branch Candidate --</option>
            {(branchStudents || []).map(s => (
              <option key={s.userId} value={s.userId}>{s.studentName} ({s.program})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Certificate Canvas */}
      <div className="flex justify-center overflow-x-auto py-2 w-full">
        <Certificate
          studentName={safeCert.studentName}
          courseName={safeCert.courseName}
          programPrefix={safeCert.programPrefix}
          level={safeCert.level}
          grade={safeCert.grade}
          duration={safeCert.duration}
          registrationNo={safeCert.registrationNo}
          certificateNo={safeCert.certificateNo}
          centreName={safeCert.centreName}
          centreCode={safeCert.centreCode}
          centreAddress={safeCert.centreAddress}
          issueDate={safeCert.issueDate}
          certificateType={safeCert.certificateType}
          studentPhoto={safeCert.studentPhoto}
          showControls={true}
        />
      </div>
    </div>
  );
}
