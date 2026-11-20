import React from 'react';
import BranchStudentMarksheetPage from '../admin/BranchStudentMarksheetPage';

export default function StaffStudentMarksheetPage({
  activeBranch = 'Tenkasi Branch',
  branchStudents = [],
  portalType = null,
  entityName = null,
  entityId = null,
  title = null,
  subtitle = null,
  onBack
}) {
  return (
    <BranchStudentMarksheetPage
      activeBranch={activeBranch}
      branchStudents={branchStudents}
      portalType={portalType}
      entityName={entityName}
      entityId={entityId}
      title={title}
      subtitle={subtitle}
      onBack={onBack}
    />
  );
}
