import React, { useState } from 'react';
import Certificate from '../components/Certificate';

export default function CertificatePage() {
  // Load initially from registered enrollment or default
  const [certData, setCertData] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('bsel_registered_student');
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            studentName: parsed.studentName || '',
            courseName: parsed.courseName || 'Abacus',
            programPrefix: parsed.programPrefix || 'MINDSPARC',
            level: parsed.level || 'Level 1',
            grade: parsed.grade || 'A',
            duration: parsed.duration || '6 Months',
            registrationNo: parsed.registrationNo || 'AB27-001',
            certificateNo: parsed.certificateNo || 'BSEL/ABACUS/L1/0007',
            centreName: parsed.centreName || 'test branch',
            centreCode: parsed.centreCode || '546454',
            centreAddress: parsed.centreAddress || 'second street, surandai,keelasurandai,tenkasi',
            issueDate: parsed.issueDate || '05-10-2026',
            certificateType: parsed.certificateType || 'COMPETITION',
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
      certificateNo: 'BSEL/ABACUS/L1/0007',
      centreName: 'test branch',
      centreCode: '546454',
      centreAddress: 'second street, surandai,keelasurandai,tenkasi',
      issueDate: '05-10-2026',
      certificateType: 'COMPETITION',
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
      {/* Clean Certificate Display */}
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
    </div>
  );
}