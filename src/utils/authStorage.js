// Local storage and authentication management for BSEL users

const DEFAULT_USERS = [
  {
    userId: 'admin',
    password: 'admin123',
    studentName: 'B★SEL Super Administrator',
    parentName: 'Governing Council',
    email: 'admin@besellearning.org',
    phone: '98400 12345',
    grade: 'Administrator',
    program: 'All Programs & Operations',
    institution: 'National Secretariat, Chennai',
    address: 'B★SEL Central Bhavan, Gandhi Salai, Chennai - 600017',
    role: 'Super Admin',
    enrolmentDate: '01 Jan 2026',
    events: [],
    results: []
  },
  {
    userId: 'BSEL-STU-784201',
    password: 'besel2026',
    studentName: 'Arjun Subramanian',
    parentName: 'K. Subramanian',
    email: 'arjun.subramanian@gmail.com',
    phone: '98401 23456',
    grade: 'Grade 4',
    program: 'Abacus Speed Arithmetic',
    institution: 'Vidya Mandir Senior Secondary School, Chennai',
    address: 'No. 18, 4th Cross Street, T. Nagar, Chennai - 600017',
    role: 'Student',
    enrolmentDate: '15 Jan 2026',
    events: [
      { name: '14th State Level Abacus Championship 2026', date: '15 Nov 2026', status: 'Hall Ticket Issued', seat: 'Hall A / Bench 14' },
      { name: 'Chitrakala State Art Olympiad', date: '06 Dec 2026', status: 'Registration Confirmed', seat: 'Hall B / Seat 22' }
    ],
    results: [
      { exam: 'South Zone Abacus Speed League', score: '98/100', rank: 'State 1st Rank', certificateNo: 'BSEL-CERT-2026-90412' }
    ]
  },
  {
    userId: 'SCH-COORD-101',
    password: 'school2026',
    studentName: 'Authorized School Coordinator',
    parentName: 'School Management',
    email: 'coordinator@vidyamandir.edu',
    phone: '98400 12345',
    grade: 'All Grades',
    program: 'All Institutional Programs',
    institution: 'Vidya Mandir Senior Secondary School, Chennai',
    address: 'Chennai, Tamil Nadu',
    role: 'School Coordinator',
    enrolmentDate: '01 Jan 2026',
    events: [],
    results: []
  }
];

export const getRegisteredUsers = () => {
  if (typeof window === 'undefined') return DEFAULT_USERS;
  try {
    const raw = localStorage.getItem('bsel_registered_users');
    let users = DEFAULT_USERS;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        users = parsed;
      }
    }
    // Always ensure Super Admin is present in the list
    if (!users.some(u => u.role === 'Super Admin' || u.userId.toLowerCase() === 'admin')) {
      users = [DEFAULT_USERS[0], ...users];
      try {
        localStorage.setItem('bsel_registered_users', JSON.stringify(users));
      } catch {
        // ignore
      }
    }
    return users;
  } catch {
    return DEFAULT_USERS;
  }
};

export const registerStudentAccount = (formData) => {
  const users = getRegisteredUsers();

  // Generate unique 6-digit User ID and secure memorable password
  let randomIdNum;
  let newUserId;
  do {
    randomIdNum = Math.floor(100000 + Math.random() * 900000);
    newUserId = `BSEL-STU-${randomIdNum}`;
  } while (users.some((u) => u.userId.toUpperCase() === newUserId.toUpperCase()));

  const randomPin = Math.floor(1000 + Math.random() * 9000);
  const newPassword = `Bsel@${randomPin}`;

  const progCode = (formData.program || 'SKILL')
    .replace(/[^A-Za-z]/g, '')
    .substring(0, 4)
    .toUpperCase();

  const matchGrade = formData.grade?.match(/Grade\s*(\d+)/i);
  const formattedLevel = matchGrade 
    ? `Grade ${matchGrade[1]}` 
    : (formData.grade?.includes('Kindergarten') ? 'Kindergarten' : (formData.grade || 'Level 1'));

  const newUser = {
    userId: newUserId,
    password: newPassword,
    studentName: formData.name.trim(),
    parentName: formData.parentName.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim(),
    grade: formData.grade,
    program: formData.program,
    address: formData.address.trim(),
    institution: formData.address ? `${formData.address.split(',')[0].trim()} Branch` : 'B★SEL Authorized Academy',
    role: 'Student',
    enrolmentDate: new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }),
    events: [
      {
        name: `Annual State ${formData.program || 'Skill'} Assessment 2026`,
        date: '28 Nov 2026',
        status: 'Enrolment Confirmed',
        seat: `Hall ${['A', 'B', 'C'][Math.floor(Math.random() * 3)]} / Seat ${Math.floor(10 + Math.random() * 80)}`
      }
    ],
    results: [
      {
        exam: `${formData.program || 'Skill'} Assessment Entry`,
        score: 'Enrolled & Verified',
        rank: 'Admitted',
        certificateNo: `BSEL-${progCode}-2026-${randomIdNum.toString().slice(-4)}`
      }
    ]
  };

  const updatedUsers = [newUser, ...users];
  try {
    localStorage.setItem('bsel_registered_users', JSON.stringify(updatedUsers));
    localStorage.setItem(
      'bsel_last_registered_creds',
      JSON.stringify({
        userId: newUserId,
        password: newPassword,
        studentName: newUser.studentName
      })
    );

    // Sync with certificate preview
    const certificateStudent = {
      studentName: newUser.studentName,
      courseName: newUser.program,
      level: formattedLevel,
      grade: 'A+',
      duration: '6 Months',
      registrationNo: newUserId,
      certificateNo: newUser.results[0].certificateNo,
      centreName: newUser.institution,
      centreCode: String(Math.floor(100000 + Math.random() * 900000)),
      centreAddress: newUser.address || 'Chennai, Tamil Nadu',
      issueDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
      certificateType: 'COURSE'
    };
    localStorage.setItem('bsel_registered_student', JSON.stringify(certificateStudent));
  } catch (err) {
    console.error('Error saving user to localStorage:', err);
  }

  return newUser;
};

export const validateLogin = (enteredUserId, enteredPassword) => {
  if (!enteredUserId || !enteredPassword) {
    return {
      success: false,
      message: 'Please enter both your User ID and Password.'
    };
  }

  const cleanId = enteredUserId.trim().toLowerCase();
  const cleanPassword = enteredPassword.trim();

  // 1. Guaranteed Master Admin Check (Accepts 'admin', 'admin@besellearning.org', 'admin@lecotrus.com')
  const isAdminLogin = 
    cleanId === 'admin' || 
    cleanId === 'admin@besellearning.org' || 
    cleanId === 'admin@lecotrus.com';

  if (isAdminLogin) {
    if (cleanPassword === 'admin123' || cleanPassword === 'admin' || cleanPassword === 'besel2026') {
      const adminUser = {
        userId: 'admin',
        password: cleanPassword,
        studentName: 'B★SEL Super Administrator',
        parentName: 'Governing Council',
        email: 'admin@besellearning.org',
        phone: '98400 12345',
        grade: 'Administrator',
        program: 'All Programs & Operations',
        institution: 'National Secretariat, Chennai',
        address: 'B★SEL Central Bhavan, Gandhi Salai, Chennai - 600017',
        role: 'Super Admin',
        enrolmentDate: '01 Jan 2026',
        events: [],
        results: []
      };

      return {
        success: true,
        user: adminUser
      };
    } else {
      return {
        success: false,
        message: 'Incorrect Password for Administrator. Please use "admin123".'
      };
    }
  }

  // 2. Standard User Lookup (matches by userId OR email)
  const users = getRegisteredUsers();
  const userFound = users.find((u) => 
    u.userId.toLowerCase() === cleanId || 
    (u.email && u.email.toLowerCase() === cleanId)
  );

  if (!userFound) {
    return {
      success: false,
      message: `Invalid User ID "${enteredUserId}". No account was found with this ID or email. Please check the ID or submit the Admission Enquiry form to obtain login credentials.`
    };
  }

  if (userFound.password !== cleanPassword) {
    return {
      success: false,
      message: 'Incorrect Password. Please enter the exact password generated during admission enquiry.'
    };
  }

  return {
    success: true,
    user: userFound
  };
};

export const deleteUserAccount = (userId) => {
  const users = getRegisteredUsers();
  const cleanId = (userId || '').trim().toUpperCase();
  const filtered = users.filter((u) => u.userId.toUpperCase() !== cleanId);
  try {
    localStorage.setItem('bsel_registered_users', JSON.stringify(filtered));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('bsel_users_updated'));
    }
  } catch (err) {
    console.error('Error deleting user:', err);
  }
  return filtered;
};

export const addUserAccount = (userData) => {
  const users = getRegisteredUsers();
  const newUser = {
    userId: userData.userId || `BSEL-STU-${Math.floor(100000 + Math.random() * 900000)}`,
    password: userData.password || 'besel2026',
    studentName: userData.studentName || 'Student Name',
    parentName: userData.parentName || 'Guardian',
    email: userData.email || 'student@besellearning.org',
    phone: userData.phone || '98400 00000',
    grade: userData.grade || 'Grade 4',
    program: userData.program || 'Abacus Speed Arithmetic',
    institution: userData.institution || 'B★SEL Partner School, Chennai',
    address: userData.address || 'Chennai, Tamil Nadu',
    role: userData.role || 'Student',
    enrolmentDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    events: userData.events || [],
    results: userData.results || [
      {
        exam: `${userData.program || 'Skill'} Assessment Entry`,
        score: 'Enrolled & Verified',
        rank: 'Admitted',
        certificateNo: `BSEL-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`
      }
    ]
  };

  const updated = [newUser, ...users];
  try {
    localStorage.setItem('bsel_registered_users', JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('bsel_users_updated'));
    }
  } catch (err) {
    console.error('Error adding user:', err);
  }
  return newUser;
};

export const updateUserProfile = (userId, updatedFields) => {
  const users = getRegisteredUsers();
  const cleanId = (userId || '').trim().toUpperCase();
  const index = users.findIndex((u) => u.userId.toUpperCase() === cleanId);
  if (index === -1) return null;
  users[index] = { ...users[index], ...updatedFields };
  try {
    localStorage.setItem('bsel_registered_users', JSON.stringify(users));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('bsel_users_updated'));
    }
  } catch (err) {
    console.error('Error updating user profile:', err);
  }
  return users[index];
};

export const getLastRegisteredCreds = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('bsel_last_registered_creds');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getActiveSession = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('bsel_session_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setActiveSession = (user) => {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem('bsel_session_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('bsel_session_user');
    }
    window.dispatchEvent(new Event('bsel_session_changed'));
  } catch (err) {
    console.error('Error setting session:', err);
  }
};

export const clearActiveSession = () => {
  setActiveSession(null);
};
