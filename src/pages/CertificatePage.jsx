import React, { useState } from 'react';
import Certificate from '../components/Certificate';
import OfficialMarksheetView from '../components/OfficialMarksheetView';
import { Award, FileText } from 'lucide-react';
import { getCoursePrefix } from '../utils/authStorage';

export default function CertificatePage() {
  const [activeTab, setActiveTab] = useState('certificate'); // 'certificate' | 'marksheet'

  // Load initially from registered enrollment or default
  const [certData, setCertData] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('bsel_registered_student');
        if (saved) {
          const parsed = JSON.parse(saved);
          const cName = parsed.courseName || parsed.program || 'Abacus';
          const prefix = getCoursePrefix(cName);
          const cleanLvl = String(parsed.level || '1').replace(/\D/g, '') || '1';
          const regDigits = String(parsed.registrationNo || '').replace(/\D/g, '');
          const seq = regDigits ? String(parseInt(regDigits.slice(-3), 10) || 1).padStart(4, '0') : '0001';

          let resolvedCertNo = parsed.certificateNo;
          if (!resolvedCertNo || resolvedCertNo === 'BSEL/ABACUS/L1/0007' || (prefix !== 'AB' && resolvedCertNo.includes('ABACUS'))) {
            resolvedCertNo = `BSEL/${prefix}/L${cleanLvl}/${seq}`;
          }

          return {
            studentName: parsed.studentName || '',
            courseName: cName,
            programPrefix: parsed.programPrefix || 'MINDSPARC',
            level: parsed.level || 'Level 1',
            grade: parsed.grade || 'A',
            duration: parsed.duration || '6 Months',
            registrationNo: parsed.registrationNo || `${prefix}26-${seq.slice(-3)}`,
            certificateNo: resolvedCertNo,
            centreName: parsed.centreName || 'test branch',
            centreCode: parsed.centreCode || '546454',
            centreAddress: parsed.centreAddress || 'second street, surandai,keelasurandai,tenkasi',
            issueDate: parsed.issueDate || '05-10-2026',
            certificateType: parsed.certificateType || 'COMPLETION',
            studentPhoto: parsed.studentPhoto || null
          };
        }
      } catch {
        // ignore
      }
    }

    return {
      studentName: '',
      courseName: 'Abacus',
      programPrefix: 'MINDSPARC',
      level: 'Level 1',
      grade: 'A',
      duration: '6 Months',
      registrationNo: 'AB27-001',
      certificateNo: 'BSEL/AB/L1/0001',
      centreName: 'test branch',
      centreCode: '546454',
      centreAddress: 'second street, surandai,keelasurandai,tenkasi',
      issueDate: '05-10-2026',
      certificateType: 'COMPLETION',
      studentPhoto: null
    };
  });

  const handleUpdatePhoto = (photoUrl) => {
    setCertData(prev => {
      const updated = { ...prev, studentPhoto: photoUrl };
      try {
        localStorage.setItem('bsel_registered_student', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6 sm:py-8 px-3 sm:px-6 flex flex-col items-center">
      {/* Top Segmented Document Selector */}
      <div className="mb-4 bg-slate-900/90 p-1.5 rounded-2xl flex items-center gap-1.5 shadow-xl border border-slate-700 select-none print:hidden">
        <button
          type="button"
          onClick={() => setActiveTab('certificate')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeTab === 'certificate'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Certificate of Completion (Landscape)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('marksheet')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeTab === 'marksheet'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Official Marksheet / Grade Card (Portrait)</span>
        </button>
      </div>

      {/* Main Document Display */}
      {activeTab === 'certificate' ? (
        <div className="w-full max-w-5xl flex justify-center">
          <Certificate
            studentName={certData.studentName}
            courseName={certData.courseName}
            programPrefix={certData.programPrefix}
            level={certData.level}
            grade={certData.grade}
            duration={certData.duration}
            registrationNo={certData.registrationNo}
            certificateNo={certData.certificateNo}
            centreName={certData.centreName}
            centreCode={certData.centreCode}
            centreAddress={certData.centreAddress}
            issueDate={certData.issueDate}
            certificateType={certData.certificateType}
            studentPhoto={certData.studentPhoto}
            onPhotoUpload={handleUpdatePhoto}
            showControls={true}
          />
        </div>
      ) : (
        <div className="w-full max-w-2xl flex justify-center">
          <OfficialMarksheetView
            student={certData}
            standalone={false}
            defaultShowMarks={true}
            onClose={() => setActiveTab('certificate')}
          />
        </div>
      )}
    </div>
  );
}