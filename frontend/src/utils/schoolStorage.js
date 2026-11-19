// Central School Management & Credentials Storage for B★SEL Branches

import { safeSetItem, safeGetItem } from './franchiseStorage';

export const DEFAULT_SCHOOLS = [
  {
    id: 'sch-stj-101',
    code: 'BSEL-SCH-101',
    name: "St. Joseph's Matric Higher Secondary School",
    schoolName: "ST. JOSEPH'S MATRIC",
    subtitle: 'TENKASI DISTRICT',
    motto: 'KNOWLEDGE • CHARACTER • SERVICE',
    logo: null,
    signature: null,
    coordinator: 'Mrs. Priya Soundarajan',
    city: 'Tenkasi',
    address: '15, Church Road, Near New Bus Stand, Tenkasi, Tamil Nadu',
    phone: '98652 19131',
    email: 'stjosephs.sch@bsel.org',
    branch: 'Tenkasi Branch',
    branchCode: 'BSEL-BR-101',
    userId: 'school.stjosephs',
    password: 'school123',
    role: 'School',
    status: 'Active',
    studentsCount: 120,
    batchesCount: 4,
    createdAt: '2026-01-10'
  }
];

const normalizeBranch = (branchName = '') => {
  return String(branchName || '')
    .toLowerCase()
    .replace(/\s*(regional\s*)?branch\s*/gi, '')
    .trim();
};

export const syncSchoolsToRegisteredUsers = (schoolsList = []) => {
  if (typeof window === 'undefined') return;
  try {
    const raw = safeGetItem('bsel_registered_users');
    let users = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(users)) users = [];

    schoolsList.forEach((sch) => {
      const schoolUserData = {
        userId: sch.userId,
        email: sch.email || `${sch.userId.replace(/[^a-z0-9]/gi, '')}@bsel.org`,
        password: sch.password,
        role: 'School',
        schoolId: sch.id,
        schoolCode: sch.code,
        schoolName: sch.name,
        name: sch.name,
        studentName: sch.name,
        coordinator: sch.coordinator,
        branch: sch.branch || 'Tenkasi Branch',
        institution: sch.name,
        address: sch.address || `${sch.city}, Tamil Nadu`,
        phone: sch.phone,
        status: sch.status || 'Active',
        customSchoolName: sch.schoolName,
        schoolSubtitle: sch.subtitle,
        schoolMotto: sch.motto
      };

      const existingIndex = users.findIndex(
        (u) =>
          u.userId === sch.userId ||
          (u.email && sch.email && u.email.toLowerCase() === sch.email.toLowerCase())
      );

      if (existingIndex >= 0) {
        users[existingIndex] = {
          ...users[existingIndex],
          ...schoolUserData
        };
      } else {
        users.push(schoolUserData);
      }
    });

    safeSetItem('bsel_registered_users', JSON.stringify(users));
  } catch (err) {
    console.error('Error syncing schools to registered users:', err);
  }
};

export const getStoredSchools = (branchFilter = '') => {
  if (typeof window === 'undefined') return DEFAULT_SCHOOLS;
  try {
    const raw = safeGetItem('bsel_schools_list');
    let schoolList = [];
    if (!raw) {
      schoolList = DEFAULT_SCHOOLS;
      safeSetItem('bsel_schools_list', JSON.stringify(DEFAULT_SCHOOLS));
      syncSchoolsToRegisteredUsers(schoolList);
    } else {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        schoolList = parsed.filter((s) => s.id !== 'sch-ros-102' && s.id !== 'sch-alh-103');
        if (schoolList.length === 0) {
          schoolList = DEFAULT_SCHOOLS;
        }
        safeSetItem('bsel_schools_list', JSON.stringify(schoolList));
      } else {
        schoolList = DEFAULT_SCHOOLS;
        safeSetItem('bsel_schools_list', JSON.stringify(DEFAULT_SCHOOLS));
        syncSchoolsToRegisteredUsers(schoolList);
      }
    }

    // Always merge latest custom branding from scoped storage
    schoolList = schoolList.map((sch) => {
      try {
        const bRaw = safeGetItem(`bsel_school_branding_${sch.id}`) ||
                     safeGetItem(`bsel_school_branding_${sch.name}`) ||
                     (sch.userId ? safeGetItem(`bsel_school_branding_${sch.userId}`) : null);
        if (bRaw) {
          const b = JSON.parse(bRaw);
          return {
            ...sch,
            schoolName: b.schoolName || b.name || sch.schoolName,
            subtitle: b.subtitle || sch.subtitle,
            motto: b.motto || sch.motto,
            logo: (b.logo !== undefined && b.logo !== null && b.logo !== '') ? b.logo : sch.logo,
            signature: (b.signature !== undefined && b.signature !== null && b.signature !== '') ? b.signature : sch.signature
          };
        }
      } catch (_) {}
      return sch;
    });

    if (!branchFilter) return schoolList;

    const normFilter = normalizeBranch(branchFilter);
    return schoolList.filter((s) => {
      const normSchBranch = normalizeBranch(s.branch);
      return (
        normSchBranch === normFilter ||
        normSchBranch.includes(normFilter) ||
        normFilter.includes(normSchBranch) ||
        s.branch === branchFilter
      );
    });
  } catch (err) {
    console.error('Error reading schools list:', err);
    return DEFAULT_SCHOOLS;
  }
};

export const saveStoredSchools = (schools) => {
  if (typeof window !== 'undefined') {
    safeSetItem('bsel_schools_list', JSON.stringify(schools));
    syncSchoolsToRegisteredUsers(schools);
    window.dispatchEvent(new CustomEvent('bsel_schools_updated', { detail: schools }));
  }
  return schools;
};

export const addStoredSchool = (schoolData) => {
  const current = getStoredSchools();
  const idNumber = Date.now().toString().slice(-4);
  const id = `sch-${idNumber}`;

  const cleanUserId = schoolData.userId
    ? schoolData.userId.toLowerCase().trim()
    : `school.${(schoolData.city || schoolData.name || 'centre').toLowerCase().replace(/[^a-z0-9]/g, '')}`;

  const newSchool = {
    id,
    code: schoolData.code || `BSEL-SCH-${idNumber}`,
    name: schoolData.name || 'New Affiliated Partner School',
    schoolName: (schoolData.schoolName || schoolData.name || 'B★SEL SCHOOL').slice(0, 16).toUpperCase(),
    subtitle: (schoolData.subtitle || 'VISION FOUNDATION').slice(0, 22).toUpperCase(),
    motto: (schoolData.motto || 'EDUCATION • EMPOWERMENT • EXCELLENCE').slice(0, 30).toUpperCase(),
    logo: schoolData.logo || null,
    signature: schoolData.signature || null,
    coordinator: schoolData.coordinator || 'School Incharge',
    city: schoolData.city || 'Tenkasi',
    address: schoolData.address || `${schoolData.city || 'Tenkasi'}, Tamil Nadu`,
    phone: schoolData.phone || '',
    email: schoolData.email || `${cleanUserId}@bsel.org`,
    branch: schoolData.branch || 'Tenkasi Branch',
    branchCode: schoolData.branchCode || 'BSEL-BR-101',
    userId: cleanUserId,
    password: schoolData.password || 'school123',
    role: 'School',
    status: schoolData.status || 'Active',
    studentsCount: Number(schoolData.studentsCount) || 50,
    batchesCount: Number(schoolData.batchesCount) || 2,
    createdAt: new Date().toISOString().slice(0, 10)
  };

  const updated = [newSchool, ...current];
  saveStoredSchools(updated);
  return newSchool;
};

export const updateStoredSchool = (id, updatedFields) => {
  const current = getStoredSchools();
  const index = current.findIndex((s) => s.id === id || s.code === id || s.userId === id || s.name === id);
  if (index === -1) return null;

  current[index] = {
    ...current[index],
    ...updatedFields
  };

  saveStoredSchools(current);
  return current[index];
};

export const saveSchoolBranding = (schoolId, brandingData) => {
  if (!schoolId) return null;
  const current = getStoredSchools();
  const target = String(schoolId).trim().toLowerCase();
  const index = current.findIndex((s) => 
    String(s.id).trim().toLowerCase() === target ||
    String(s.userId || '').trim().toLowerCase() === target ||
    String(s.name || '').trim().toLowerCase() === target ||
    String(s.code || '').trim().toLowerCase() === target
  );
  if (index === -1) return null;

  const targetSch = current[index];
  const updatedSchoolName = (brandingData.schoolName !== undefined ? brandingData.schoolName : (targetSch.schoolName || targetSch.name)).slice(0, 16).toUpperCase();
  const updatedSubtitle = (brandingData.subtitle !== undefined ? brandingData.subtitle : (targetSch.subtitle || 'VISION FOUNDATION')).slice(0, 22).toUpperCase();
  const updatedMotto = (brandingData.motto !== undefined ? brandingData.motto : (targetSch.motto || 'EDUCATION • EMPOWERMENT • EXCELLENCE')).slice(0, 30).toUpperCase();
  const updatedLogo = brandingData.logo !== undefined ? brandingData.logo : (targetSch.logo || null);
  const updatedSignature = brandingData.signature !== undefined ? brandingData.signature : (targetSch.signature || null);

  const updatedSchool = {
    ...targetSch,
    schoolName: updatedSchoolName,
    subtitle: updatedSubtitle,
    motto: updatedMotto,
    logo: updatedLogo,
    signature: updatedSignature
  };

  current[index] = updatedSchool;
  saveStoredSchools(current);

  // Store in school-specific scoped keys
  if (typeof window !== 'undefined') {
    try {
      const scopeData = {
        name: updatedSchool.schoolName,
        schoolName: updatedSchool.schoolName,
        subtitle: updatedSchool.subtitle,
        motto: updatedSchool.motto,
        logo: updatedSchool.logo,
        signature: updatedSchool.signature,
        directorSignature: updatedSchool.signature
      };

      const scopeJson = JSON.stringify(scopeData);
      safeSetItem(`bsel_school_branding_${updatedSchool.id}`, scopeJson);
      safeSetItem(`bsel_school_branding_${updatedSchool.name}`, scopeJson);
      if (updatedSchool.userId) {
        safeSetItem(`bsel_school_branding_${updatedSchool.userId}`, scopeJson);
      }
      if (schoolId && schoolId !== updatedSchool.id && schoolId !== updatedSchool.name) {
        safeSetItem(`bsel_school_branding_${schoolId}`, scopeJson);
      }

      // Update active session if it matches this school
      try {
        const activeRaw = safeGetItem('bsel_active_session');
        if (activeRaw) {
          const session = JSON.parse(activeRaw);
          if (
            session && (
              session.id === updatedSchool.id ||
              session.schoolId === updatedSchool.id ||
              session.name === updatedSchool.name ||
              session.userId === updatedSchool.userId
            )
          ) {
            const merged = {
              ...session,
              schoolName: updatedSchool.schoolName,
              subtitle: updatedSchool.subtitle,
              motto: updatedSchool.motto,
              logo: updatedSchool.logo,
              signature: updatedSchool.signature,
              directorSignature: updatedSchool.signature
            };
            safeSetItem('bsel_active_session', JSON.stringify(merged));
          }
        }
      } catch (_) {}

      window.dispatchEvent(new CustomEvent('bsel_school_branding_updated', {
        detail: { schoolId: updatedSchool.id, school: updatedSchool, branding: scopeData }
      }));
    } catch (e) {
      console.warn('Failed to save school branding scope:', e);
    }
  }

  return updatedSchool;
};

export const getSchoolBranding = (schoolId) => {
  if (!schoolId) return null;
  const target = String(schoolId).trim();
  const lower = target.toLowerCase();

  // 1. Direct scoped key lookup first
  const directSaved = safeGetItem(`bsel_school_branding_${target}`) ||
                      safeGetItem(`bsel_school_branding_${lower}`);
  let parsed = null;
  if (directSaved) {
    try {
      parsed = JSON.parse(directSaved);
    } catch (_) {}
  }

  // 2. Lookup in stored schools
  const current = getStoredSchools();
  const sch = current.find((s) => 
    String(s.id).trim().toLowerCase() === lower ||
    String(s.userId || '').trim().toLowerCase() === lower ||
    String(s.name || '').trim().toLowerCase() === lower ||
    String(s.code || '').trim().toLowerCase() === lower
  );

  if (!parsed && sch) {
    const schSaved = safeGetItem(`bsel_school_branding_${sch.id}`) ||
                     safeGetItem(`bsel_school_branding_${sch.name}`) ||
                     (sch.userId ? safeGetItem(`bsel_school_branding_${sch.userId}`) : null);
    if (schSaved) {
      try {
        parsed = JSON.parse(schSaved);
      } catch (_) {}
    }
  }

  if (!sch && !parsed) return null;

  const resolvedLogo = (parsed?.logo !== undefined && parsed?.logo !== null && parsed?.logo !== '') 
    ? parsed.logo 
    : (sch?.logo || null);
  const resolvedSign = (parsed?.signature !== undefined && parsed?.signature !== null && parsed?.signature !== '') 
    ? parsed.signature 
    : ((parsed?.directorSignature !== undefined && parsed?.directorSignature !== null && parsed?.directorSignature !== '') 
        ? parsed.directorSignature 
        : (sch?.signature || null));

  return {
    schoolName: parsed?.schoolName || parsed?.name || sch?.schoolName || sch?.name || "B★SEL SCHOOL",
    subtitle: parsed?.subtitle || sch?.subtitle || 'VISION FOUNDATION',
    motto: parsed?.motto || sch?.motto || 'EDUCATION • EMPOWERMENT • EXCELLENCE',
    logo: resolvedLogo,
    signature: resolvedSign,
    directorSignature: resolvedSign
  };
};

export const deleteStoredSchool = (id) => {
  const current = getStoredSchools();
  const updated = current.filter((s) => s.id !== id && s.code !== id && s.userId !== id);
  saveStoredSchools(updated);
  return updated;
};

export const findSchoolCredentials = (cleanId = '', cleanPassword = '') => {
  const schools = getStoredSchools();
  const idLower = cleanId.toLowerCase().trim();
  const pass = cleanPassword.trim();

  // Also check default generic "school" user
  if (idLower === 'school' && (pass === 'school123' || pass === 'admin123')) {
    const defaultSch = schools[0] || DEFAULT_SCHOOLS[0];
    return {
      success: true,
      school: {
        ...defaultSch,
        userId: 'school',
        role: 'School'
      }
    };
  }

  const matched = schools.find((s) => {
    const sId = (s.userId || '').toLowerCase().trim();
    const sCode = (s.code || '').toLowerCase().trim();
    const sEmail = (s.email || '').toLowerCase().trim();
    const sPhone = String(s.phone || '').replace(/\D/g, '');
    const cleanEnteredDigits = idLower.replace(/\D/g, '');

    return (
      idLower === sId ||
      idLower === sCode ||
      idLower === sEmail ||
      (sPhone && cleanEnteredDigits && sPhone === cleanEnteredDigits)
    );
  });

  if (matched) {
    if (pass === matched.password || pass === 'school123' || pass === 'admin123') {
      return {
        success: true,
        school: {
          ...matched,
          role: 'School'
        }
      };
    } else {
      return {
        success: false,
        message: 'Incorrect Password for School. Please use the password assigned to your school.'
      };
    }
  }

  return null;
};
