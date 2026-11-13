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

export const getStoredBranchCredentials = () => {
  if (typeof window === 'undefined') {
    const initial = {};
    TAMIL_NADU_DISTRICTS.forEach((d) => {
      const creds = getDefaultCredentialsForDistrict(d);
      initial[creds.slug] = creds;
    });
    return initial;
  }

  try {
    const raw = localStorage.getItem('bsel_branch_credentials');
    const existing = raw ? JSON.parse(raw) : {};

    // Ensure all 38 districts exist with defaults (without '+')
    let modified = false;
    const combined = { ...existing };

    TAMIL_NADU_DISTRICTS.forEach((d) => {
      const defaultCreds = getDefaultCredentialsForDistrict(d);
      const curr = combined[defaultCreds.slug];
      if (!curr) {
        combined[defaultCreds.slug] = defaultCreds;
        modified = true;
      } else {
        // Automatically sanitize and remove any '+' from email or password
        let changed = false;
        let newEmail = curr.email || defaultCreds.email;
        let newPass = curr.password || defaultCreds.password;
        if (newEmail.includes('+')) {
          newEmail = newEmail.replace(/\+/g, '');
          changed = true;
        }
        if (newPass.includes('+')) {
          newPass = newPass.replace(/\+/g, '');
          changed = true;
        }
        if (changed) {
          combined[defaultCreds.slug] = {
            ...curr,
            email: newEmail,
            password: newPass
          };
          modified = true;
        }
      }
    });

    if (modified) {
      localStorage.setItem('bsel_branch_credentials', JSON.stringify(combined));
    }
    return combined;
  } catch (err) {
    console.error('Error reading branch credentials:', err);
    const initial = {};
    TAMIL_NADU_DISTRICTS.forEach((d) => {
      const creds = getDefaultCredentialsForDistrict(d);
      initial[creds.slug] = creds;
    });
    return initial;
  }
};

export const saveBranchCredentials = (slugOrDistrict, newEmail, newPassword) => {
  if (typeof window === 'undefined') return false;
  try {
    const slug = getDistrictSlug(slugOrDistrict);
    const all = getStoredBranchCredentials();
    const existing = all[slug] || getDefaultCredentialsForDistrict(slugOrDistrict);

    const updated = {
      ...existing,
      email: (newEmail || existing.email).trim().toLowerCase(),
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
               (getDistrictSlug(u.branch) === slug || getDistrictSlug(u.district) === slug)
      );

      const branchUserData = {
        userId: updated.email,
        email: updated.email,
        password: updated.password,
        name: `${updated.branchName} Administrator`,
        studentName: `${updated.branchName} Administrator`,
        role: 'Branch Head',
        branch: updated.branchName,
        district: updated.district,
        branchCode: `${slug.toUpperCase().slice(0, 3)}-01`,
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

export const resetBranchCredentialsToDefault = (slugOrDistrict) => {
  const slug = getDistrictSlug(slugOrDistrict);
  const def = getDefaultCredentialsForDistrict(slugOrDistrict);
  return saveBranchCredentials(slug, def.email, def.password);
};

export const getCredentialsForBranchOrSchool = (item = '') => {
  const all = getStoredBranchCredentials();
  if (item && typeof item === 'object') {
    if (item.code && all[item.code]) return all[item.code];
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
    const slugKey = slug.toLowerCase();
    const districtLower = (creds.district || '').toLowerCase();

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
