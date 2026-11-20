// Central Branch Authentication & Credentials Repository for B★SEL
// Format requested by Super Admin:
// Email: bsel+<districtname>@bsel.org (and accepts bsel+<districtname>, bsel<districtname>)
// Password: <districtname>+bsel (and accepts <districtname>bsel)

export const TAMIL_NADU_DISTRICTS = [
  'Ariyalur',
  'Chengalpattu',
  'Chennai',
  'Coimbatore',
  'Cuddalore',
  'Dharmapuri',
  'Dindigul',
  'Erode',
  'Kallakurichi',
  'Kanchipuram',
  'Kanyakumari',
  'Karur',
  'Krishnagiri',
  'Madurai',
  'Mayiladuthurai',
  'Nagapattinam',
  'Namakkal',
  'Nilgiris',
  'Perambalur',
  'Pudukkottai',
  'Ramanathapuram',
  'Ranipet',
  'Salem',
  'Sivaganga',
  'Tenkasi',
  'Thanjavur',
  'Theni',
  'Thoothukudi',
  'Tiruchirappalli (Trichy)',
  'Tirunelveli',
  'Tirupathur',
  'Tiruppur',
  'Tiruvallur',
  'Tiruvannamalai',
  'Tiruvarur',
  'Vellore',
  'Viluppuram',
  'Virudhunagar'
];

export const getDistrictSlug = (name = '') => {
  if (!name) return 'branch';
  const clean = String(name).toLowerCase().trim();

  // Direct District & City/Town mappings to 38 Tamil Nadu districts
  if (clean.includes('trichy') || clean.includes('tiruchirappalli')) return 'trichy';
  if (clean.includes('tuticorin') || clean.includes('thoothukudi')) return 'thoothukudi';
  if (clean.includes('madras') || clean.includes('chennai')) return 'chennai';
  if (clean.includes('coimbatore') || clean.includes('kovai')) return 'coimbatore';
  if (clean.includes('kanyakumari') || clean.includes('nagercoil')) return 'kanyakumari';
  if (clean.includes('panagudi') || clean.includes('tirunelveli') || clean.includes('nellai')) return 'tirunelveli';
  if (clean.includes('surandai') || clean.includes('tenkasi') || clean.includes('uthumalai') || clean.includes('veeranam') || clean.includes('amaravathi')) return 'tenkasi';
  if (clean.includes('madurai')) return 'madurai';
  if (clean.includes('salem')) return 'salem';
  if (clean.includes('erode')) return 'erode';
  if (clean.includes('thanjavur')) return 'thanjavur';
  if (clean.includes('vellore')) return 'vellore';
  if (clean.includes('dindigul')) return 'dindigul';
  if (clean.includes('virudhunagar')) return 'virudhunagar';
  if (clean.includes('ramanathapuram')) return 'ramanathapuram';
  if (clean.includes('sivaganga')) return 'sivaganga';
  if (clean.includes('theni')) return 'theni';
  if (clean.includes('cuddalore')) return 'cuddalore';
  if (clean.includes('dharmapuri')) return 'dharmapuri';
  if (clean.includes('krishnagiri')) return 'krishnagiri';
  if (clean.includes('kanchipuram')) return 'kanchipuram';
  if (clean.includes('tiruvallur')) return 'tiruvallur';
  if (clean.includes('tiruvannamalai')) return 'tiruvannamalai';
  if (clean.includes('namakkal')) return 'namakkal';
  if (clean.includes('karur')) return 'karur';
  if (clean.includes('nilgiris') || clean.includes('ooty')) return 'nilgiris';
  if (clean.includes('pudukkottai')) return 'pudukkottai';
  if (clean.includes('perambalur')) return 'perambalur';
  if (clean.includes('ariyalur')) return 'ariyalur';
  if (clean.includes('nagapattinam')) return 'nagapattinam';
  if (clean.includes('tiruvarur')) return 'tiruvarur';
  if (clean.includes('mayiladuthurai')) return 'mayiladuthurai';
  if (clean.includes('viluppuram')) return 'viluppuram';
  if (clean.includes('kallakurichi')) return 'kallakurichi';
  if (clean.includes('chengalpattu')) return 'chengalpattu';
  if (clean.includes('ranipet')) return 'ranipet';
  if (clean.includes('tirupathur')) return 'tirupathur';
  if (clean.includes('tiruppur')) return 'tiruppur';

  return clean
    .replace(/\s*(regional\s*)?(branch|centre|center|study centre|academy|school|matriculation|nursery|primary)\s*/gi, '')
    .replace(/[^a-z0-9]/g, '')
    .trim() || 'branch';
};

export const getDefaultCredentialsForDistrict = (districtName) => {
  const slug = getDistrictSlug(districtName);
  const prettyDistrict = TAMIL_NADU_DISTRICTS.find(d => getDistrictSlug(d) === slug) || 
    (typeof districtName === 'string' && districtName.trim() ? districtName.split(',')[0].trim() : 'Tenkasi');
  return {
    slug,
    district: prettyDistrict,
    branchName: prettyDistrict.includes('Branch') ? prettyDistrict : `${prettyDistrict} Branch`,
    email: `bsel${slug}@bsel.org`,
    password: `${slug}bsel`
  };
};

export const DEFAULT_TENKASI_BRANCH = {
  slug: 'tenkasi',
  district: 'Tenkasi',
  branchName: 'Tenkasi Branch',
  email: 'bseltenkasi@bsel.org',
  userId: 'bseltenkasi@bsel.org',
  password: 'tenkasibsel',
  code: 'BSEL-BR-101',
  branchCode: 'BSEL-BR-101',
  isCustomBranch: true,
  principal: 'Mrs. Thangam Sivaji',
  coordinator: 'Mr. S. Sivakumar',
  phone: '+91 98652 19131'
};

export const DEFAULT_TIRUNELVELI_BRANCH = {
  slug: 'tirunelveli',
  district: 'Tirunelveli',
  branchName: 'Tirunelveli Branch',
  email: 'bseltirunelveli@bsel.org',
  userId: 'bseltirunelveli@bsel.org',
  password: 'tirunelvelibsel',
  code: 'BSEL-BR-102',
  branchCode: 'BSEL-BR-102',
  isCustomBranch: true,
  principal: 'Dr. M. Arumugam',
  coordinator: 'Mrs. P. Vasanthi',
  phone: '+91 94431 88201'
};

export const getStoredBranchCredentials = () => {
  if (typeof window === 'undefined') return { tenkasi: DEFAULT_TENKASI_BRANCH, tirunelveli: DEFAULT_TIRUNELVELI_BRANCH };

  try {
    const raw = localStorage.getItem('bsel_branch_credentials');
    const existing = raw ? JSON.parse(raw) : {};

    const combined = { ...existing };

    // Always ensure the official Tenkasi Branch Admin exists and is marked as custom branch
    if (!combined['tenkasi'] || !combined['tenkasi'].isCustomBranch || !combined['tenkasi'].password) {
      combined['tenkasi'] = {
        ...DEFAULT_TENKASI_BRANCH,
        ...combined['tenkasi'],
        isCustomBranch: true,
        updatedAt: new Date().toISOString()
      };
    }

    // Always ensure the official Tirunelveli Branch Admin exists and is marked as custom branch
    if (!combined['tirunelveli'] || !combined['tirunelveli'].isCustomBranch || !combined['tirunelveli'].password) {
      combined['tirunelveli'] = {
        ...DEFAULT_TIRUNELVELI_BRANCH,
        ...combined['tirunelveli'],
        isCustomBranch: true,
        updatedAt: new Date().toISOString()
      };
    }

    localStorage.setItem('bsel_branch_credentials', JSON.stringify(combined));

    return combined;
  } catch (err) {
    console.error('Error reading branch credentials:', err);
    return { tenkasi: DEFAULT_TENKASI_BRANCH, tirunelveli: DEFAULT_TIRUNELVELI_BRANCH };
  }
};

export const saveBranchCredentials = (slugOrDistrict, newEmail, newPassword) => {
  if (typeof window === 'undefined') return false;
  try {
    const all = getStoredBranchCredentials();
    const slug = all[slugOrDistrict] ? slugOrDistrict : getDistrictSlug(slugOrDistrict);
    const existing = all[slug] || getDefaultCredentialsForDistrict(slugOrDistrict);

    const updated = {
      ...existing,
      email: (newEmail || existing.email).trim().toLowerCase(),
      ...(existing.isCustomBranch ? { userId: (newEmail || existing.userId || existing.email).trim() } : {}),
      password: (newPassword || existing.password).trim(),
      updatedAt: new Date().toISOString()
    };

    all[slug] = updated;
    localStorage.setItem('bsel_branch_credentials', JSON.stringify(all));

    // Also sync to registered users list for seamless role management
    try {
      const rawUsers = localStorage.getItem('bsel_registered_users');
      let users = rawUsers ? JSON.parse(rawUsers) : [];
      const userIndex = users.findIndex(
        (u) => (u.role === 'Branch Head' || u.role === 'Branch Admin') &&
               (existing.isCustomBranch
                 ? String(u.userId || u.email || '').toLowerCase() === String(existing.userId || existing.email || '').toLowerCase()
                 : getDistrictSlug(u.branch) === slug || getDistrictSlug(u.district) === slug)
      );

      const branchUserData = {
        userId: updated.userId || updated.email,
        email: updated.email,
        password: updated.password,
        name: `${updated.branchName} Administrator`,
        studentName: `${updated.branchName} Administrator`,
        role: 'Branch Head',
        branch: updated.branchName,
        district: updated.district,
        branchCode: updated.branchCode || `${slug.toUpperCase().slice(0, 3)}-01`,
        institution: `B★SEL ${updated.branchName}`,
        address: `${updated.district}, Tamil Nadu`,
        phone: '9865219131',
        grade: 'Centre Director',
        program: 'Branch Operations & Training'
      };

      if (userIndex >= 0) {
        users[userIndex] = { ...users[userIndex], ...branchUserData };
      } else {
        users.push(branchUserData);
      }
      localStorage.setItem('bsel_registered_users', JSON.stringify(users));
    } catch {
      // non-fatal
    }

    window.dispatchEvent(new Event('bsel_branch_credentials_updated'));
    window.dispatchEvent(new Event('bsel_users_updated'));
    return true;
  } catch (err) {
    console.error('Error saving branch credentials:', err);
    return false;
  }
};

export const createBranchCredentials = (branch, userId, password) => {
  if (typeof window === 'undefined') {
    return { success: false, message: 'Branch credentials can only be saved in the browser.' };
  }

  const cleanUserId = String(userId || '').trim();
  const cleanPassword = String(password || '').trim();
  if (!cleanUserId || !cleanPassword) {
    return { success: false, message: 'Enter both a User ID and password.' };
  }

  try {
    const all = getStoredBranchCredentials();
    const duplicate = Object.values(all).some(
      (credentials) => String(credentials.userId || credentials.email || '').trim().toLowerCase() === cleanUserId.toLowerCase()
    );
    if (duplicate) {
      return { success: false, message: 'This User ID is already assigned to a branch.' };
    }
    if (verifyBranchLogin(cleanUserId, '__new_branch_validation__')) {
      return { success: false, message: 'This User ID conflicts with an existing branch login.' };
    }

    const userIdSlug = cleanUserId.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'branch';
    const keyBase = `custom-${userIdSlug}`;
    let slug = keyBase;
    let suffix = 2;
    while (all[slug]) {
      slug = `${keyBase}-${suffix}`;
      suffix += 1;
    }

    const branchName = branch.branchName || branch.name;
    const credentials = {
      slug,
      district: branch.city || branchName,
      branchName,
      email: cleanUserId.toLowerCase(),
      userId: cleanUserId,
      password: cleanPassword,
      code: branch.code,
      branchCode: branch.code,
      isCustomBranch: true,
      updatedAt: new Date().toISOString()
    };

    const usersRaw = localStorage.getItem('bsel_registered_users');
    const users = usersRaw ? JSON.parse(usersRaw) : [];
    if (!Array.isArray(users)) {
      return { success: false, message: 'Unable to save branch credentials because the registered-user data is invalid.' };
    }
    if (users.some((user) =>
      String(user.userId || user.email || '').trim().toLowerCase() === cleanUserId.toLowerCase()
    )) {
      return { success: false, message: 'This User ID is already assigned to an account.' };
    }

    all[slug] = credentials;
    localStorage.setItem('bsel_branch_credentials', JSON.stringify(all));
    users.push({
      userId: cleanUserId,
      email: cleanUserId.toLowerCase(),
      password: cleanPassword,
      name: `${branchName} Administrator`,
      studentName: `${branchName} Administrator`,
      role: 'Branch Head',
      branch: branchName,
      district: branch.city || branchName,
      branchCode: branch.code,
      institution: branch.name,
      address: branch.city || ''
    });
    localStorage.setItem('bsel_registered_users', JSON.stringify(users));

    window.dispatchEvent(new Event('bsel_branch_credentials_updated'));
    window.dispatchEvent(new Event('bsel_users_updated'));
    return { success: true };
  } catch (err) {
    console.error('Error creating branch credentials:', err);
    return { success: false, message: 'Unable to save branch credentials. Please try again.' };
  }
};

export const deleteCustomBranch = (branch) => {
  if (typeof window === 'undefined') {
    return { success: false, message: 'Branches can only be deleted in the browser.' };
  }

  try {
    const credentials = getStoredBranchCredentials();
    const slug = branch.slug || Object.keys(credentials).find((key) =>
      credentials[key].code === branch.code || credentials[key].branchCode === branch.code
    );
    const branchCredentials = slug ? credentials[slug] : null;
    if (!branchCredentials?.isCustomBranch) {
      return { success: false, message: 'The selected custom branch could not be found.' };
    }

    const usersRaw = localStorage.getItem('bsel_registered_users');
    const users = usersRaw ? JSON.parse(usersRaw) : [];
    const schoolsRaw = localStorage.getItem('bsel_partner_schools');
    const schools = schoolsRaw ? JSON.parse(schoolsRaw) : [];
    if (!Array.isArray(users) || !Array.isArray(schools)) {
      return { success: false, message: 'Branch data is invalid and could not be safely deleted.' };
    }

    const branchUserId = String(branchCredentials.userId || branchCredentials.email || '').toLowerCase();
    const updatedUsers = users.filter((user) => {
      const isBranchUser = user.role === 'Branch Head' || user.role === 'Branch Admin';
      const matchesBranchCode = user.branchCode === branch.code;
      const matchesBranchLogin = String(user.userId || user.email || '').toLowerCase() === branchUserId;
      return !(isBranchUser && (matchesBranchCode || matchesBranchLogin));
    });
    const updatedSchools = schools.filter((school) =>
      school.code !== branch.code && school.branchName !== branch.branchName
    );
    const updatedCredentials = { ...credentials };
    delete updatedCredentials[slug];

    localStorage.setItem('bsel_branch_credentials', JSON.stringify(updatedCredentials));
    localStorage.setItem('bsel_registered_users', JSON.stringify(updatedUsers));
    localStorage.setItem('bsel_partner_schools', JSON.stringify(updatedSchools));
    window.dispatchEvent(new Event('bsel_branch_credentials_updated'));
    window.dispatchEvent(new Event('bsel_users_updated'));
    window.dispatchEvent(new Event('bsel_schools_updated'));
    window.dispatchEvent(new StorageEvent('storage', { key: 'bsel_partner_schools' }));
    return { success: true };
  } catch (err) {
    console.error('Error deleting custom branch:', err);
    return { success: false, message: 'Unable to delete the branch. Please try again.' };
  }
};

export const resetBranchCredentialsToDefault = (slugOrDistrict) => {
  const slug = getDistrictSlug(slugOrDistrict);
  const def = getDefaultCredentialsForDistrict(slugOrDistrict);
  return saveBranchCredentials(slug, def.email, def.password);
};

export const getCredentialsForBranchOrSchool = (item = '') => {
  const all = getStoredBranchCredentials();
  if (item && typeof item === 'object') {
    if (item.slug && all[item.slug]) return all[item.slug];
    if (item.code) {
      const byCode = Object.values(all).find((credentials) => credentials.code === item.code);
      if (byCode) return byCode;
    }
    const name = item.branchName || item.name || '';
    const byName = Object.values(all).find(
      (credentials) => credentials.isCustomBranch &&
        String(credentials.branchName || '').toLowerCase() === String(name).toLowerCase()
    );
    if (byName) return byName;
    const slug = getDistrictSlug(item.city || item.branchName || item.name || '');
    if (all[slug]) return all[slug];
    return getDefaultCredentialsForDistrict(item.city || item.branchName || item.name || 'Tenkasi');
  }
  const str = String(item || '');
  if (all[str]) return all[str];
  const slug = getDistrictSlug(str);
  if (all[slug]) return all[slug];
  return getDefaultCredentialsForDistrict(str);
};

export const verifyBranchLogin = (inputIdentifier, inputPassword) => {
  if (!inputIdentifier || !inputPassword) return null;
  const cleanId = String(inputIdentifier).trim().toLowerCase();
  const cleanPass = String(inputPassword).trim();

  const all = getStoredBranchCredentials();

  for (const slug of Object.keys(all)) {
    const creds = all[slug];
    const emailLower = (creds.email || '').toLowerCase();
    const storedUserId = String(creds.userId || creds.email || '').trim().toLowerCase();
    const slugKey = slug.toLowerCase();
    const districtLower = (creds.district || '').toLowerCase();

    if (creds.isCustomBranch) {
      const isTenkasi = slug === 'tenkasi' || creds.code === 'BSEL-BR-101' || creds.branchName?.toLowerCase().includes('tenkasi');
      const isTirunelveli = slug === 'tirunelveli' || creds.code === 'BSEL-BR-102' || creds.branchName?.toLowerCase().includes('tirunelveli');
      const isTenkasiId = cleanId === 'bseltenkasi@bsel.org' ||
        cleanId === 'bsel+tenkasi@bsel.org' ||
        cleanId === 'bseltenkasi' ||
        cleanId === 'bsel+tenkasi' ||
        cleanId === 'tenkasi@bsel.org' ||
        cleanId === 'tenkasi@besellearning.org' ||
        cleanId === 'branch.tenkasi' ||
        cleanId === 'branch-tenkasi' ||
        cleanId === 'tenkasi' ||
        cleanId.includes('tenkasi');
      const isTirunelveliId = cleanId === 'bseltirunelveli@bsel.org' ||
        cleanId === 'bsel+tirunelveli@bsel.org' ||
        cleanId === 'bseltirunelveli' ||
        cleanId === 'bsel+tirunelveli' ||
        cleanId === 'tirunelveli@bsel.org' ||
        cleanId === 'tirunelveli@besellearning.org' ||
        cleanId === 'branch.tirunelveli' ||
        cleanId === 'branch-tirunelveli' ||
        cleanId === 'tirunelveli' ||
        cleanId.includes('tirunelveli');

      const isCustomIdMatch = isTenkasi
        ? (cleanId === storedUserId || cleanId === emailLower || isTenkasiId)
        : isTirunelveli
        ? (cleanId === storedUserId || cleanId === emailLower || isTirunelveliId)
        : (cleanId === storedUserId || cleanId === emailLower);

      if (!isCustomIdMatch) continue;

      const isCustomPassMatch = isTenkasi
        ? (cleanPass === creds.password ||
           cleanPass === 'tenkasibsel' ||
           cleanPass === 'tenkasi+bsel' ||
           cleanPass === 'branch123' ||
           cleanPass === 'admin123' ||
           cleanPass === 'besel2026')
        : isTirunelveli
        ? (cleanPass === creds.password ||
           cleanPass === 'tirunelvelibsel' ||
           cleanPass === 'tirunelveli+bsel' ||
           cleanPass === 'branch123' ||
           cleanPass === 'admin123' ||
           cleanPass === 'besel2026')
        : cleanPass === creds.password;

      if (!isCustomPassMatch) {
        return {
          success: false,
          isBranch: true,
          message: `Incorrect password for ${creds.branchName}. Use "${isTirunelveli ? 'tirunelvelibsel' : 'tenkasibsel'}" or "branch123".`
        };
      }

      return {
        success: true,
        user: {
          userId: creds.userId || creds.email,
          email: creds.email,
          name: `${creds.branchName} Administrator`,
          studentName: `${creds.branchName} Administrator`,
          role: 'Branch Head',
          branch: creds.branchName,
          district: creds.district,
          institution: creds.branchName,
          branchCode: creds.branchCode || creds.code,
          address: creds.district
        }
      };
    }

    // Check identifier matches:
    // 1. Exact stored email: bsel+tenkasi@bsel.org
    // 2. bsel+<district> or bsel<district> or bsel.<district>
    // 3. branch.<district> or branch-<district>
    // 4. District name alone
    const isIdMatch =
      cleanId === emailLower ||
      cleanId === `bsel+${slugKey}` ||
      cleanId === `bsel+${slugKey}@bsel.org` ||
      cleanId === `bsel${slugKey}` ||
      cleanId === `bsel${slugKey}@bsel.org` ||
      cleanId === `bsel.${slugKey}` ||
      cleanId === `bsel.${slugKey}@bsel.org` ||
      cleanId === `branch.${slugKey}` ||
      cleanId === `branch-${slugKey}` ||
      cleanId === slugKey ||
      cleanId === districtLower;

    if (isIdMatch) {
      // Check password:
      // 1. Exact stored password
      // 2. Default pattern: <slug>+bsel or <slug>bsel
      // 3. Fallback emergency passwords
      const isPassMatch =
        cleanPass === creds.password ||
        cleanPass === `${slugKey}+bsel` ||
        cleanPass === `${slugKey}bsel` ||
        cleanPass === 'branch123' ||
        cleanPass === 'admin123' ||
        cleanPass === 'besel2026';

      if (isPassMatch) {
        return {
          success: true,
          user: {
            userId: creds.email,
            email: creds.email,
            name: `${creds.branchName} Administrator`,
            studentName: `${creds.branchName} Administrator`,
            role: 'Branch Head',
            branch: creds.branchName,
            district: creds.district,
            institution: `B★SEL ${creds.branchName}`,
            branchCode: `${slugKey.toUpperCase().slice(0, 3)}-01`,
            address: `${creds.district}, Tamil Nadu`
          }
        };
      } else {
        return {
          success: false,
          isBranch: true,
          message: `Incorrect password for ${creds.branchName}. Use "${slugKey}+bsel" or the credentials assigned by Super Administrator.`
        };
      }
    }
  }

  // Also support generic "branch.admin" with password "branch123"
  if ((cleanId === 'branch.admin' || cleanId === 'branch')) {
    if (cleanPass === 'branch123' || cleanPass === 'admin123' || cleanPass === 'tenkasi+bsel' || cleanPass === 'besel2026') {
      const def = all['tenkasi'] || getDefaultCredentialsForDistrict('Tenkasi');
      return {
        success: true,
        user: {
          userId: def.email,
          email: def.email,
          name: 'Tenkasi Regional Branch Administrator',
          studentName: 'Tenkasi Regional Branch Administrator',
          role: 'Branch Head',
          branch: 'Tenkasi Regional Branch',
          district: 'Tenkasi',
          institution: 'B★SEL Tenkasi Regional Academy',
          branchCode: 'TSI-01',
          address: 'Tenkasi, Tamil Nadu'
        }
      };
    } else {
      return {
        success: false,
        isBranch: true,
        message: 'Incorrect password for Branch Administrator.'
      };
    }
  }

  return null;
};
