// Central Staff Management & Credentials Storage for B★SEL Branches

export const DEFAULT_STAFF_MEMBERS = [
  {
    id: 'staff-tsi-101',
    userId: 'staff.tenkasi',
    password: 'staff123',
    name: 'R. Kaviya',
    studentName: 'R. Kaviya',
    role: 'Staff',
    designation: 'Senior Academic Instructor',
    branch: 'Tenkasi Branch',
    branchCode: 'BSEL-BR-101',
    email: 'kaviya@bsel.org',
    phone: '9865219132',
    status: 'Active',
    grade: 'Academic Staff',
    program: 'Abacus & Vedic Mathematics',
    institution: 'B★SEL Tenkasi Branch',
    address: 'Tenkasi, Tamil Nadu',
    createdAt: '2026-01-15'
  },
  {
    id: 'staff-gen-101',
    userId: 'staff',
    password: 'staff123',
    name: 'B★SEL Academic Staff',
    studentName: 'B★SEL Academic Staff',
    role: 'Staff',
    designation: 'Centre Coordinator',
    branch: 'Tenkasi Branch',
    branchCode: 'BSEL-BR-101',
    email: 'staff@bsel.org',
    phone: '9840123456',
    status: 'Active',
    grade: 'Academic Staff',
    program: 'Student Operations & Evaluation',
    institution: 'B★SEL Learning Center',
    address: 'Tenkasi, Tamil Nadu',
    createdAt: '2026-01-10'
  }
];

const normalizeBranch = (branchName = '') => {
  return String(branchName || '')
    .toLowerCase()
    .replace(/\s*(regional\s*)?branch\s*/gi, '')
    .trim();
};

export const getStoredStaff = (branchFilter = '') => {
  if (typeof window === 'undefined') return DEFAULT_STAFF_MEMBERS;
  try {
    const raw = localStorage.getItem('bsel_staff_members');
    let staffList = [];
    if (!raw) {
      staffList = DEFAULT_STAFF_MEMBERS;
      localStorage.setItem('bsel_staff_members', JSON.stringify(DEFAULT_STAFF_MEMBERS));
      syncStaffToRegisteredUsers(staffList);
    } else {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        staffList = parsed;
      } else {
        staffList = DEFAULT_STAFF_MEMBERS;
        localStorage.setItem('bsel_staff_members', JSON.stringify(DEFAULT_STAFF_MEMBERS));
        syncStaffToRegisteredUsers(staffList);
      }
    }

    if (!branchFilter) return staffList;

    const normFilter = normalizeBranch(branchFilter);
    return staffList.filter((s) => {
      const normStaffBranch = normalizeBranch(s.branch);
      return (
        normStaffBranch === normFilter ||
        normStaffBranch.includes(normFilter) ||
        normFilter.includes(normStaffBranch) ||
        s.branch === branchFilter
      );
    });
  } catch (err) {
    console.error('Error reading staff members:', err);
    return DEFAULT_STAFF_MEMBERS;
  }
};

export const syncStaffToRegisteredUsers = (staffList = []) => {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem('bsel_registered_users');
    let users = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(users)) users = [];

    staffList.forEach((staff) => {
      const staffUserData = {
        userId: staff.userId,
        email: staff.email || `${staff.userId.replace(/[^a-z0-9]/gi, '')}@bsel.org`,
        password: staff.password,
        name: staff.name,
        studentName: staff.name,
        role: 'Staff',
        designation: staff.designation || 'Academic Staff',
        branch: staff.branch || 'Tenkasi Branch',
        branchCode: staff.branchCode || 'BSEL-BR-101',
        phone: staff.phone || '9865219131',
        grade: staff.designation || 'Academic Staff',
        program: staff.program || 'Student Operations & Evaluation',
        institution: staff.institution || `B★SEL ${staff.branch || 'Branch'}`,
        address: staff.address || `${staff.branch || 'Tenkasi'}, Tamil Nadu`,
        status: staff.status || 'Active',
        enrolmentDate: staff.createdAt || new Date().toISOString()
      };

      const existingIndex = users.findIndex(
        (u) =>
          u.role === 'Staff' &&
          (String(u.userId || '').toLowerCase() === String(staff.userId).toLowerCase() ||
           (u.id && staff.id && u.id === staff.id))
      );

      if (existingIndex >= 0) {
        users[existingIndex] = { ...users[existingIndex], ...staffUserData };
      } else {
        users.push(staffUserData);
      }
    });

    localStorage.setItem('bsel_registered_users', JSON.stringify(users));
    window.dispatchEvent(new Event('bsel_users_updated'));
  } catch (err) {
    console.warn('Error syncing staff to registered users:', err);
  }
};

export const saveStaffMember = (staffData) => {
  if (typeof window === 'undefined') return { success: false, message: 'Browser required.' };
  try {
    const cleanUserId = String(staffData.userId || '').trim().toLowerCase();
    const cleanPassword = String(staffData.password || '').trim();
    const cleanName = String(staffData.name || '').trim();

    if (!cleanName) {
      return { success: false, message: 'Please enter staff full name.' };
    }
    if (!cleanUserId) {
      return { success: false, message: 'Please enter a valid User ID / Login username.' };
    }
    if (!cleanPassword) {
      return { success: false, message: 'Please enter a login password.' };
    }

    const currentAll = getStoredStaff();
    const isDuplicate = currentAll.some(
      (s) =>
        s.id !== staffData.id &&
        String(s.userId || '').toLowerCase() === cleanUserId
    );

    if (isDuplicate) {
      return { success: false, message: `User ID "${cleanUserId}" is already assigned to another staff member.` };
    }

    const newStaff = {
      id: staffData.id || `staff-${Date.now().toString(36)}`,
      userId: cleanUserId,
      password: cleanPassword,
      name: cleanName,
      studentName: cleanName,
      role: 'Staff',
      designation: staffData.designation || 'Academic Staff',
      branch: staffData.branch || 'Tenkasi Branch',
      branchCode: staffData.branchCode || 'BSEL-BR-101',
      email: (staffData.email || `${cleanUserId}@bsel.org`).trim().toLowerCase(),
      phone: (staffData.phone || '').trim(),
      status: staffData.status || 'Active',
      grade: staffData.designation || 'Academic Staff',
      program: staffData.program || 'Student Operations & Evaluation',
      institution: staffData.institution || `B★SEL ${staffData.branch || 'Branch'}`,
      address: staffData.address || `${staffData.branch || 'Tenkasi'}, Tamil Nadu`,
      createdAt: staffData.createdAt || new Date().toISOString().split('T')[0]
    };

    let updatedList;
    const existingIndex = currentAll.findIndex((s) => s.id === newStaff.id || s.userId === newStaff.userId);
    if (existingIndex >= 0) {
      updatedList = [...currentAll];
      updatedList[existingIndex] = newStaff;
    } else {
      updatedList = [newStaff, ...currentAll];
    }

    localStorage.setItem('bsel_staff_members', JSON.stringify(updatedList));
    syncStaffToRegisteredUsers(updatedList);

    window.dispatchEvent(new Event('bsel_staff_updated'));
    return { success: true, staff: newStaff };
  } catch (err) {
    console.error('Error saving staff member:', err);
    return { success: false, message: 'Unable to save staff member. Please try again.' };
  }
};

export const deleteStaffMember = (staffId) => {
  if (typeof window === 'undefined') return false;
  try {
    const current = getStoredStaff();
    const target = current.find((s) => s.id === staffId || s.userId === staffId);
    const filtered = current.filter((s) => s.id !== staffId && s.userId !== staffId);
    localStorage.setItem('bsel_staff_members', JSON.stringify(filtered));

    // Also remove from registered users
    if (target) {
      try {
        const raw = localStorage.getItem('bsel_registered_users');
        if (raw) {
          const users = JSON.parse(raw);
          if (Array.isArray(users)) {
            const filteredUsers = users.filter(
              (u) =>
                !(
                  u.role === 'Staff' &&
                  (String(u.userId).toLowerCase() === String(target.userId).toLowerCase() ||
                   String(u.id) === String(target.id))
                )
            );
            localStorage.setItem('bsel_registered_users', JSON.stringify(filteredUsers));
            window.dispatchEvent(new Event('bsel_users_updated'));
          }
        }
      } catch {
        // non-fatal
      }
    }

    window.dispatchEvent(new Event('bsel_staff_updated'));
    return true;
  } catch (err) {
    console.error('Error deleting staff member:', err);
    return false;
  }
};
