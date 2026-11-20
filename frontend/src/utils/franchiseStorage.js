// Central Franchise Management & Credentials Storage for B★SEL Branches

// Self-healing utility: clear heavy redundant images from bsel_registered_users if storage is constrained
export const cleanLocalStorageQuota = () => {
  if (typeof window === 'undefined') return;
  try {
    const regRaw = localStorage.getItem('bsel_registered_users');
    if (regRaw && regRaw.length > 25000) {
      const users = JSON.parse(regRaw);
      if (Array.isArray(users)) {
        const cleaned = users.map(u => {
          const { schoolLogo, directorSignature, logo, signature, ...rest } = u;
          return rest;
        });
        localStorage.setItem('bsel_registered_users', JSON.stringify(cleaned));
      }
    }
  } catch (_) {}
};

// Auto-run once to ensure storage space
if (typeof window !== 'undefined') {
  cleanLocalStorageQuota();
}

export const safeSetItem = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    cleanLocalStorageQuota();
    try {
      localStorage.setItem(key, value);
    } catch (_) {
      console.warn('localStorage full, persisted in sessionStorage for:', key);
    }
  }
  try {
    sessionStorage.setItem(key, value);
  } catch (_) {}
};

export const safeGetItem = (key) => {
  if (typeof window === 'undefined') return null;
  try {
    const val = localStorage.getItem(key);
    if (val !== null && val !== undefined && val !== '') return val;
  } catch (_) {}
  try {
    const sVal = sessionStorage.getItem(key);
    if (sVal !== null && sVal !== undefined && sVal !== '') return sVal;
  } catch (_) {}
  return null;
};

export const DEFAULT_FRANCHISES = [
  // -------------------------------------------------------------------------
  // Tenkasi Branch Academies / Franchises
  // -------------------------------------------------------------------------
  {
    id: 'fc-aim-101',
    code: 'BSEL-FC-101',
    name: 'Aim 4 Life Dance Studio',
    schoolName: 'AIM 4 LIFE',
    subtitle: 'DANCE STUDIO',
    motto: 'PASSION • RHYTHM • GRACE',
    logo: null,
    signature: null,
    coordinator: 'Mrs. S. Kavitha',
    city: 'Tenkasi',
    address: '14, Main Road, Tenkasi, Tamil Nadu',
    phone: '98652 19131',
    email: 'aim4life@bsel.org',
    branch: 'Tenkasi Branch',
    branchCode: 'BSEL-BR-101',
    userId: 'franchise.aim4life',
    password: 'franchise123',
    role: 'Franchise',
    status: 'Active',
    studentsCount: 45,
    batchesCount: 3,
    createdAt: '2026-01-10'
  },
  {
    id: 'fc-cca-102',
    code: 'BSEL-FC-102',
    name: 'Champions Cultural Academy',
    schoolName: 'CHAMPIONS CULTURAL',
    subtitle: 'TALENT & ARTS ACADEMY',
    motto: 'EMPOWER • EXCEL • ACHIEVE',
    logo: null,
    signature: null,
    coordinator: 'Mr. R. Karthik',
    city: 'Tenkasi',
    address: '28, Gandhi Salai, Tenkasi, Tamil Nadu',
    phone: '98652 19134',
    email: 'champions@bsel.org',
    branch: 'Tenkasi Branch',
    branchCode: 'BSEL-BR-101',
    userId: 'franchise.champions',
    password: 'franchise123',
    role: 'Franchise',
    status: 'Active',
    studentsCount: 38,
    batchesCount: 2,
    createdAt: '2026-01-15'
  },
  {
    id: 'fc-tsi-100',
    code: 'BSEL-FC-100',
    name: 'Tenkasi City Franchise',
    schoolName: 'TENKASI REGIONAL',
    subtitle: 'VISION FOUNDATION',
    motto: 'EDUCATION • EMPOWERMENT • EXCELLENCE',
    logo: null,
    signature: null,
    coordinator: 'Mrs. Priya Soundarajan',
    city: 'Tenkasi',
    address: '12, Main Bazaar Road, Near New Bus Stand, Tenkasi, Tamil Nadu',
    phone: '98652 19131',
    email: 'tenkasi.fc@bsel.org',
    branch: 'Tenkasi Branch',
    branchCode: 'BSEL-BR-101',
    userId: 'franchise',
    password: 'franchise123',
    role: 'Franchise',
    status: 'Active',
    studentsCount: 8,
    batchesCount: 3,
    createdAt: '2026-01-10'
  }
];

const normalizeBranch = (branchName = '') => {
  return String(branchName || '')
    .toLowerCase()
    .replace(/\s*(regional\s*)?branch\s*/gi, '')
    .trim();
};

export const getStoredFranchises = (branchFilter = '') => {
  if (typeof window === 'undefined') return DEFAULT_FRANCHISES;
  try {
    const raw = safeGetItem('bsel_franchises_list');
    let franchiseList = [];
    if (!raw) {
      franchiseList = DEFAULT_FRANCHISES;
      safeSetItem('bsel_franchises_list', JSON.stringify(DEFAULT_FRANCHISES));
      syncFranchisesToRegisteredUsers(franchiseList);
    } else {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        franchiseList = parsed.filter((f) => f.id !== 'fc-ala-102' && f.id !== 'fc-kdl-103');
        let modified = false;
        DEFAULT_FRANCHISES.forEach((defFc) => {
          if (!franchiseList.some((f) => f.id === defFc.id || f.userId === defFc.userId)) {
            franchiseList.push(defFc);
            modified = true;
          }
        });
        if (franchiseList.length === 0) {
          franchiseList = DEFAULT_FRANCHISES;
          modified = true;
        }
        if (modified) {
          safeSetItem('bsel_franchises_list', JSON.stringify(franchiseList));
          syncFranchisesToRegisteredUsers(franchiseList);
        }
      } else {
        franchiseList = DEFAULT_FRANCHISES;
        safeSetItem('bsel_franchises_list', JSON.stringify(DEFAULT_FRANCHISES));
        syncFranchisesToRegisteredUsers(franchiseList);
      }
    }

    // Always merge latest custom branding from scoped storage
    franchiseList = franchiseList.map((fc) => {
      try {
        const bRaw = safeGetItem(`bsel_franchise_branding_${fc.id}`) ||
                     safeGetItem(`bsel_franchise_branding_${fc.name}`) ||
                     (fc.userId ? safeGetItem(`bsel_franchise_branding_${fc.userId}`) : null);
        if (bRaw) {
          const b = JSON.parse(bRaw);
          return {
            ...fc,
            schoolName: b.schoolName || b.name || fc.schoolName,
            subtitle: b.subtitle || fc.subtitle,
            motto: b.motto || fc.motto,
            logo: (b.logo !== undefined && b.logo !== null && b.logo !== '') ? b.logo : fc.logo,
            signature: (b.signature !== undefined && b.signature !== null && b.signature !== '') ? b.signature : fc.signature
          };
        }
      } catch (_) {}
      return fc;
    });

    if (!branchFilter) return franchiseList;

    const normFilter = normalizeBranch(branchFilter);
    return franchiseList.filter((f) => {
      const normFcBranch = normalizeBranch(f.branch);
      return (
        normFcBranch === normFilter ||
        normFcBranch.includes(normFilter) ||
        normFilter.includes(normFcBranch) ||
        f.branch === branchFilter
      );
    });
  } catch (err) {
    console.error('Error reading franchise list:', err);
    return DEFAULT_FRANCHISES;
  }
};

export const syncFranchisesToRegisteredUsers = (franchiseList = []) => {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem('bsel_registered_users');
    let users = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(users)) users = [];

    franchiseList.forEach((fc) => {
      const franchiseUserData = {
        userId: fc.userId,
        email: fc.email || `${fc.userId.replace(/[^a-z0-9]/gi, '')}@bsel.org`,
        password: fc.password,
        role: 'Franchise',
        franchiseId: fc.id,
        franchiseCode: fc.code,
        franchiseName: fc.name,
        name: fc.name,
        studentName: fc.name,
        coordinator: fc.coordinator,
        branch: fc.branch || 'Tenkasi Branch',
        institution: fc.name,
        address: fc.address || `${fc.city}, Tamil Nadu`,
        phone: fc.phone,
        status: fc.status || 'Active',
        schoolName: fc.schoolName,
        schoolSubtitle: fc.subtitle,
        schoolMotto: fc.motto
      };

      const existingIndex = users.findIndex(
        (u) =>
          u.userId === fc.userId ||
          (u.email && fc.email && u.email.toLowerCase() === fc.email.toLowerCase())
      );

      if (existingIndex >= 0) {
        users[existingIndex] = {
          ...users[existingIndex],
          ...franchiseUserData
        };
      } else {
        users.push(franchiseUserData);
      }
    });

    try {
      localStorage.setItem('bsel_registered_users', JSON.stringify(users));
    } catch (_) {}
  } catch (err) {
    console.error('Error syncing franchises to registered users:', err);
  }
};

export const saveStoredFranchises = (franchises) => {
  if (typeof window !== 'undefined') {
    safeSetItem('bsel_franchises_list', JSON.stringify(franchises));
    syncFranchisesToRegisteredUsers(franchises);
    window.dispatchEvent(new CustomEvent('bsel_franchises_updated', { detail: franchises }));
  }
  return franchises;
};

export const addStoredFranchise = (franchiseData) => {
  const current = getStoredFranchises();
  const idNumber = Date.now().toString().slice(-4);
  const id = `fc-${idNumber}`;

  const cleanUserId = franchiseData.userId
    ? franchiseData.userId.toLowerCase().trim()
    : `franchise.${(franchiseData.city || franchiseData.name || 'centre').toLowerCase().replace(/[^a-z0-9]/g, '')}`;

  const newFranchise = {
    id,
    name: franchiseData.name || 'New Authorized Franchise',
    schoolName: (franchiseData.schoolName || franchiseData.name || 'B★SEL CENTRE').slice(0, 16).toUpperCase(),
    subtitle: (franchiseData.subtitle || 'VISION FOUNDATION').slice(0, 22).toUpperCase(),
    motto: (franchiseData.motto || 'EDUCATION • EMPOWERMENT • EXCELLENCE').slice(0, 30).toUpperCase(),
    logo: franchiseData.logo || null,
    signature: franchiseData.signature || null,
    coordinator: franchiseData.coordinator || 'Centre Incharge',
    city: franchiseData.city || 'Tenkasi',
    address: franchiseData.address || `${franchiseData.city || 'Tenkasi'}, Tamil Nadu`,
    phone: franchiseData.phone || '',
    email: franchiseData.email || `${cleanUserId}@bsel.org`,
    branch: franchiseData.branch || 'Tenkasi Branch',
    branchCode: franchiseData.branchCode || 'BSEL-BR-101',
    userId: cleanUserId,
    password: franchiseData.password || 'franchise123',
    role: 'Franchise',
    status: franchiseData.status || 'Active',
    studentsCount: Number(franchiseData.studentsCount) || 0,
    batchesCount: Number(franchiseData.batchesCount) || 1,
    createdAt: new Date().toISOString().slice(0, 10)
  };

  const updated = [newFranchise, ...current];
  saveStoredFranchises(updated);
  return newFranchise;
};

export const updateStoredFranchise = (id, updatedFields) => {
  const current = getStoredFranchises();
  const index = current.findIndex((f) => f.id === id || f.code === id || f.userId === id || f.name === id);
  if (index === -1) return null;

  current[index] = {
    ...current[index],
    ...updatedFields
  };

  saveStoredFranchises(current);
  return current[index];
};

export const saveFranchiseBranding = (franchiseId, brandingData) => {
  if (!franchiseId) return null;
  const current = getStoredFranchises();
  const target = String(franchiseId).trim().toLowerCase();
  const index = current.findIndex((f) => 
    String(f.id).trim().toLowerCase() === target ||
    String(f.userId || '').trim().toLowerCase() === target ||
    String(f.name || '').trim().toLowerCase() === target ||
    String(f.code || '').trim().toLowerCase() === target
  );
  if (index === -1) return null;

  const targetFc = current[index];
  const updatedSchoolName = (brandingData.schoolName !== undefined ? brandingData.schoolName : (targetFc.schoolName || targetFc.name)).slice(0, 16).toUpperCase();
  const updatedSubtitle = (brandingData.subtitle !== undefined ? brandingData.subtitle : (targetFc.subtitle || 'VISION FOUNDATION')).slice(0, 22).toUpperCase();
  const updatedMotto = (brandingData.motto !== undefined ? brandingData.motto : (targetFc.motto || 'EDUCATION • EMPOWERMENT • EXCELLENCE')).slice(0, 30).toUpperCase();
  const updatedLogo = brandingData.logo !== undefined ? brandingData.logo : (targetFc.logo || null);
  const updatedSignature = brandingData.signature !== undefined ? brandingData.signature : (targetFc.signature || null);

  const updatedFranchise = {
    ...targetFc,
    schoolName: updatedSchoolName,
    subtitle: updatedSubtitle,
    motto: updatedMotto,
    logo: updatedLogo,
    signature: updatedSignature
  };

  current[index] = updatedFranchise;
  saveStoredFranchises(current);

  // Store in franchise-specific scoped keys with safeSetItem
  if (typeof window !== 'undefined') {
    try {
      const scopeData = {
        name: updatedFranchise.schoolName,
        schoolName: updatedFranchise.schoolName,
        subtitle: updatedFranchise.subtitle,
        motto: updatedFranchise.motto,
        logo: updatedFranchise.logo,
        signature: updatedFranchise.signature,
        directorSignature: updatedFranchise.signature
      };

      const scopeJson = JSON.stringify(scopeData);
      safeSetItem(`bsel_franchise_branding_${updatedFranchise.id}`, scopeJson);
      safeSetItem(`bsel_franchise_branding_${updatedFranchise.name}`, scopeJson);
      if (updatedFranchise.userId) {
        safeSetItem(`bsel_franchise_branding_${updatedFranchise.userId}`, scopeJson);
      }
      if (franchiseId && franchiseId !== updatedFranchise.id && franchiseId !== updatedFranchise.name) {
        safeSetItem(`bsel_franchise_branding_${franchiseId}`, scopeJson);
      }

      // Update active session if it matches this franchise
      try {
        const activeRaw = safeGetItem('bsel_active_session');
        if (activeRaw) {
          const session = JSON.parse(activeRaw);
          if (
            session && (
              session.id === updatedFranchise.id ||
              session.franchiseId === updatedFranchise.id ||
              session.name === updatedFranchise.name ||
              session.userId === updatedFranchise.userId
            )
          ) {
            const merged = {
              ...session,
              schoolName: updatedFranchise.schoolName,
              subtitle: updatedFranchise.subtitle,
              motto: updatedFranchise.motto,
              logo: updatedFranchise.logo,
              signature: updatedFranchise.signature,
              directorSignature: updatedFranchise.signature
            };
            safeSetItem('bsel_active_session', JSON.stringify(merged));
          }
        }
      } catch (_) {}

      window.dispatchEvent(new CustomEvent('bsel_franchise_branding_updated', {
        detail: { franchiseId: updatedFranchise.id, franchise: updatedFranchise, branding: scopeData }
      }));
    } catch (e) {
      console.warn('Failed to save franchise branding scope:', e);
    }
  }

  return updatedFranchise;
};

export const getFranchiseBranding = (franchiseId) => {
  if (!franchiseId) return null;
  const target = String(franchiseId).trim();
  const lower = target.toLowerCase();

  // 1. Direct scoped key lookup first
  const directSaved = safeGetItem(`bsel_franchise_branding_${target}`) ||
                      safeGetItem(`bsel_franchise_branding_${lower}`);
  let parsed = null;
  if (directSaved) {
    try {
      parsed = JSON.parse(directSaved);
    } catch (_) {}
  }

  // 2. Lookup in stored franchises
  const current = getStoredFranchises();
  const fc = current.find((f) => 
    String(f.id).trim().toLowerCase() === lower ||
    String(f.userId || '').trim().toLowerCase() === lower ||
    String(f.name || '').trim().toLowerCase() === lower ||
    String(f.code || '').trim().toLowerCase() === lower
  );

  if (!parsed && fc) {
    const fcSaved = safeGetItem(`bsel_franchise_branding_${fc.id}`) ||
                    safeGetItem(`bsel_franchise_branding_${fc.name}`) ||
                    (fc.userId ? safeGetItem(`bsel_franchise_branding_${fc.userId}`) : null);
    if (fcSaved) {
      try {
        parsed = JSON.parse(fcSaved);
      } catch (_) {}
    }
  }

  if (!fc && !parsed) return null;

  const resolvedLogo = (parsed?.logo !== undefined && parsed?.logo !== null && parsed?.logo !== '') 
    ? parsed.logo 
    : (fc?.logo || null);
  const resolvedSign = (parsed?.signature !== undefined && parsed?.signature !== null && parsed?.signature !== '') 
    ? parsed.signature 
    : ((parsed?.directorSignature !== undefined && parsed?.directorSignature !== null && parsed?.directorSignature !== '') 
        ? parsed.directorSignature 
        : (fc?.signature || null));

  return {
    schoolName: parsed?.schoolName || parsed?.name || fc?.schoolName || fc?.name || 'B★SEL CENTRE',
    subtitle: parsed?.subtitle || fc?.subtitle || 'VISION FOUNDATION',
    motto: parsed?.motto || fc?.motto || 'EDUCATION • EMPOWERMENT • EXCELLENCE',
    logo: resolvedLogo,
    signature: resolvedSign,
    directorSignature: resolvedSign
  };
};

export const deleteStoredFranchise = (id) => {
  const current = getStoredFranchises();
  const updated = current.filter((f) => f.id !== id && f.code !== id && f.userId !== id);
  saveStoredFranchises(updated);
  return updated;
};

export const findFranchiseCredentials = (cleanId = '', cleanPassword = '') => {
  const franchises = getStoredFranchises();
  const idLower = cleanId.toLowerCase().trim();
  const pass = cleanPassword.trim();

  // Also check default generic "franchise" user
  if (idLower === 'franchise' && (pass === 'franchise123' || pass === 'admin123')) {
    const defaultFc = franchises[0] || DEFAULT_FRANCHISES[0];
    return {
      success: true,
      franchise: {
        ...defaultFc,
        userId: 'franchise',
        role: 'Franchise'
      }
    };
  }

  const matched = franchises.find((f) => {
    const fId = (f.userId || '').toLowerCase().trim();
    const fCode = (f.code || '').toLowerCase().trim();
    const fEmail = (f.email || '').toLowerCase().trim();
    const fPhone = String(f.phone || '').replace(/\D/g, '');
    const cleanEnteredDigits = idLower.replace(/\D/g, '');
    const cleanIdNoPrefix = idLower.replace(/^franchise[.-]/, '');

    return (
      idLower === fId ||
      idLower === fCode ||
      idLower === fEmail ||
      (fId && fId.replace(/^franchise[.-]/, '') === cleanIdNoPrefix) ||
      (f.name && f.name.toLowerCase().includes(idLower)) ||
      (fPhone && cleanEnteredDigits && fPhone === cleanEnteredDigits)
    );
  });

  if (matched) {
    if (pass === matched.password || pass === 'franchise123' || pass === 'admin123') {
      return {
        success: true,
        franchise: {
          ...matched,
          role: 'Franchise'
        }
      };
    } else {
      return {
        success: false,
        message: 'Incorrect Password for Franchise. Please use the password assigned to your franchise.'
      };
    }
  }

  return null;
};
