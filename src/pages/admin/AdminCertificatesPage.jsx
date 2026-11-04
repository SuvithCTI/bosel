import React from 'react';
import {
  Award,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import Certificate from '../../components/Certificate';

export default function AdminCertificatesPage({
  certData = {},
  setCertData,
  handleGenerateCertificate,
  verifyCertInput = '',
  setVerifyCertInput,
  verifyResult,
  setVerifyResult,
  handleVerifyCertificate
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
    centreName: certData?.centreName || 'Central Branch',
    centreCode: certData?.centreCode || '101',
    centreAddress: certData?.centreAddress || 'Main Campus',
    issueDate: certData?.issueDate || '01-01-2026',
    certificateType: certData?.certificateType || 'COMPETITION',
    studentPhoto: certData?.studentPhoto || null
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Certificate Editor Controls */}
      <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Official Certificate Generator & Verification Desk</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live vector certificate engine with Board seal, accredited badges, and dual authorized signatures.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            {handleGenerateCertificate && (
              <button
                type="button"
                onClick={handleGenerateCertificate}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Fullscreen Modal</span>
              </button>
            )}

            {/* Verification Lookup */}
            {handleVerifyCertificate && (
              <form onSubmit={handleVerifyCertificate} className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={verifyCertInput}
                  onChange={(e) => setVerifyCertInput?.(e.target.value)}
                  placeholder="Certificate or Reg No..."
                  className="px-3 py-1.5 text-xs border border-slate-300 rounded-xl outline-none font-medium focus:ring-1 focus:ring-[#0c234b]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#0c234b] text-white text-xs font-black rounded-xl hover:bg-[#163e7c] transition cursor-pointer shrink-0"
                >
                  Verify
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Live Form inputs to customize certificate parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
          <div>
            <label className="font-bold text-slate-600 block mb-1">Candidate Name</label>
            <input
              type="text"
              value={certData?.studentName || ''}
              onChange={(e) => setCertData?.(prev => ({ ...prev, studentName: e.target.value }))}
              placeholder="Candidate Name"
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none font-semibold"
            />
          </div>

          <div>
            <label className="font-bold text-slate-600 block mb-1">Course Title</label>
            <input
              type="text"
              value={certData?.courseName || ''}
              onChange={(e) => setCertData?.(prev => ({ ...prev, courseName: e.target.value }))}
              placeholder="Course Title"
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none font-semibold"
            />
          </div>

          <div>
            <label className="font-bold text-slate-600 block mb-1">Level / Grade</label>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={certData?.level || ''}
                onChange={(e) => setCertData?.(prev => ({ ...prev, level: e.target.value }))}
                placeholder="Level"
                className="w-1/2 px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none font-semibold"
              />
              <input
                type="text"
                value={certData?.grade || ''}
                onChange={(e) => setCertData?.(prev => ({ ...prev, grade: e.target.value }))}
                placeholder="Grade"
                className="w-1/2 px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-600 block mb-1">Registration No</label>
            <input
              type="text"
              value={certData?.registrationNo || ''}
              onChange={(e) => setCertData?.(prev => ({ ...prev, registrationNo: e.target.value }))}
              placeholder="Registration No"
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none font-mono font-bold"
            />
          </div>
        </div>

        {verifyResult && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>{verifyResult.candidateName}</strong> — {verifyResult.course} ({verifyResult.regNo}) • {verifyResult.status}</span>
            </div>
            <button onClick={() => setVerifyResult?.(null)} className="text-emerald-700 font-bold hover:underline cursor-pointer">Dismiss</button>
          </div>
        )}
      </div>

      {/* Live Certificate Preview Canvas */}
      <div className="flex justify-center overflow-x-auto py-2">
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
