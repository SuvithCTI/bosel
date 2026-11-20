/**
 * Strict validator to check whether an account belongs to a genuine student.
 * Excludes Super Admins, Branch Directors, Staff members, School Portal Logins, and Franchise Portal Logins.
 */
export const isStudentUser = (u) => {
  if (!u) return false;

  const role = String(u.role || '').trim().toLowerCase();
  const userId = String(u.userId || u.id || '').trim().toLowerCase();
  const name = String(u.studentName || u.name || '').trim().toLowerCase();
  const desig = String(u.designation || u.grade || '').toLowerCase();

  // 1. Explicit Non-student Roles
  if (
    role === 'super admin' ||
    role === 'branch head' ||
    role === 'branch director' ||
    role === 'staff' ||
    role === 'staff member' ||
    role === 'academic staff' ||
    role === 'faculty' ||
    role === 'school' ||
    role === 'school head' ||
    role === 'franchise' ||
    role === 'franchise head' ||
    role === 'academy head' ||
    role === 'admin'
  ) {
    return false;
  }

  // 2. Non-student User IDs
  if (
    userId === 'admin' ||
    userId.startsWith('staff') ||
    userId.startsWith('school.') ||
    userId.startsWith('franchise.') ||
    userId.startsWith('branch.') ||
    userId.startsWith('bsel+') ||
    userId.startsWith('bseltenkasi') ||
    userId.startsWith('bseltirunelveli')
  ) {
    return false;
  }

  // 3. Designation or Staff Grade Keywords
  if (
    desig.includes('staff') ||
    desig.includes('faculty') ||
    desig.includes('centre director') ||
    desig.includes('coordinator') ||
    desig.includes('administrator')
  ) {
    return false;
  }

  // 4. Staff / Portal Name Keywords
  if (
    name.includes('academic staff') ||
    name.includes('super admin') ||
    name.includes('centre director') ||
    name.includes('governing council') ||
    name.includes('branch administration')
  ) {
    return false;
  }

  return true;
};
