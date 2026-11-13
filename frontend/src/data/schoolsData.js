// Central Master Regional Branches Repository for B★SEL

export const DEFAULT_SCHOOLS_SECTION_HEADER = {
  label: 'Our Branch Network',
  heading: 'Regional Branches & Centres',
  description: 'Official B★SEL Regional Branches, accredited franchise academies, and district examination centres across Tamil Nadu.'
};

export const DEFAULT_PARTNER_SCHOOLS = [
  {
    code: 'BSEL-BR-101',
    name: 'B★SEL Tenkasi Regional Branch',
    branchName: 'Tenkasi Regional Branch',
    city: 'Surandai, Tenkasi, Tamil Nadu',
    principal: 'Mrs. Thangam Sivaji',
    coordinator: 'Mr. S. Sivakumar',
    phone: '+91 98652 19131',
    studentsCount: 110,
    status: 'Authorized Franchise Branch'
  },
  {
    code: 'BSEL-BR-102',
    name: 'B★SEL Tirunelveli Regional Branch',
    branchName: 'Tirunelveli Regional Branch',
    city: 'Tirunelveli, Tamil Nadu',
    principal: 'Dr. P. Muthukumar',
    coordinator: 'Mrs. S. Gandhimathi',
    phone: '+91 98652 19131',
    studentsCount: 140,
    status: 'Authorized Franchise Branch'
  },
  {
    code: 'BSEL-BR-103',
    name: 'B★SEL Chennai Central Branch',
    branchName: 'Chennai Central Branch',
    city: 'Chennai, Tamil Nadu',
    principal: 'Dr. S. Ranganathan',
    coordinator: 'Mrs. K. Malathi',
    phone: '+91 98400 12345',
    studentsCount: 240,
    status: 'Authorized Regional Branch'
  },
  {
    code: 'BSEL-BR-104',
    name: 'B★SEL Coimbatore Regional Branch',
    branchName: 'Coimbatore Regional Branch',
    city: 'RS Puram, Coimbatore, Tamil Nadu',
    principal: 'Dr. M. Gurumurthy',
    coordinator: 'Mrs. Lakshmi Priya',
    phone: '+91 94433 22110',
    studentsCount: 190,
    status: 'Authorized Regional Branch'
  },
  {
    code: 'BSEL-BR-105',
    name: 'B★SEL Madurai Regional Branch',
    branchName: 'Madurai Regional Branch',
    city: 'Madurai, Tamil Nadu',
    principal: 'Mr. K. Siraj',
    coordinator: 'Mrs. P. Shanthi',
    phone: '+91 98801 55443',
    studentsCount: 160,
    status: 'Authorized Regional Branch'
  },
  {
    code: 'BSEL-BR-106',
    name: 'B★SEL Salem Regional Branch',
    branchName: 'Salem Regional Branch',
    city: 'Salem, Tamil Nadu',
    principal: 'Mrs. D. Maria',
    coordinator: 'Mr. P. Paul',
    phone: '+91 98412 87654',
    studentsCount: 150,
    status: 'Authorized Regional Branch'
  },
  {
    code: 'BSEL-BR-107',
    name: 'B★SEL Erode Regional Branch',
    branchName: 'Erode Regional Branch',
    city: 'Erode, Tamil Nadu',
    principal: 'Mr. V. Sakthivel',
    coordinator: 'Mrs. M. Kavitha',
    phone: '+91 98427 65432',
    studentsCount: 125,
    status: 'Authorized Franchise Branch'
  },
  {
    code: 'BSEL-BR-108',
    name: 'B★SEL Tiruchirappalli (Trichy) Regional Branch',
    branchName: 'Trichy Regional Branch',
    city: 'Tiruchirappalli, Tamil Nadu',
    principal: 'Rev. Fr. Principal',
    coordinator: 'Mr. S. Albert',
    phone: '+91 98652 19131',
    studentsCount: 180,
    status: 'Authorized Regional Branch'
  }
];

export const getStoredSchoolsSectionHeader = () => {
  if (typeof window === 'undefined') return DEFAULT_SCHOOLS_SECTION_HEADER;
  try {
    const raw = localStorage.getItem('bsel_schools_section_header');
    if (!raw) return DEFAULT_SCHOOLS_SECTION_HEADER;
    return { ...DEFAULT_SCHOOLS_SECTION_HEADER, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SCHOOLS_SECTION_HEADER;
  }
};

export const saveStoredSchoolsSectionHeader = (headerInfo) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('bsel_schools_section_header', JSON.stringify(headerInfo));
      window.dispatchEvent(new Event('bsel_schools_updated'));
      window.dispatchEvent(new StorageEvent('storage', { key: 'bsel_schools_section_header' }));
    } catch (err) {
      console.error('Error saving schools section header:', err);
    }
  }
  return headerInfo;
};

export const getStoredSchools = () => {
  if (typeof window === 'undefined') return DEFAULT_PARTNER_SCHOOLS;
  try {
    const raw = localStorage.getItem('bsel_partner_schools');
    if (!raw) {
      localStorage.setItem('bsel_partner_schools', JSON.stringify(DEFAULT_PARTNER_SCHOOLS));
      return DEFAULT_PARTNER_SCHOOLS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Purge any non-branch school entries (e.g. RC Middle School, Muslims Committee School)
      const pureBranches = parsed.filter(s => {
        const name = (s.name || '').toLowerCase();
        return !name.includes('school') && !name.includes('nursery') && !name.includes('matriculation') && !name.includes('middle');
      });

      // If schools were purged or branches are missing, restore pure default branches
      if (pureBranches.length < DEFAULT_PARTNER_SCHOOLS.length) {
        localStorage.setItem('bsel_partner_schools', JSON.stringify(DEFAULT_PARTNER_SCHOOLS));
        return DEFAULT_PARTNER_SCHOOLS;
      }
      return pureBranches;
    }
    return DEFAULT_PARTNER_SCHOOLS;
  } catch {
    return DEFAULT_PARTNER_SCHOOLS;
  }
};

export const saveStoredSchools = (schools) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('bsel_partner_schools', JSON.stringify(schools));
      window.dispatchEvent(new Event('bsel_schools_updated'));
      window.dispatchEvent(new StorageEvent('storage', { key: 'bsel_partner_schools' }));
    } catch (err) {
      console.error('Error saving schools to localStorage:', err);
    }
  }
  return schools;
};

export const addStoredSchool = (newSchool) => {
  const current = getStoredSchools();
  const code = newSchool.code || `BSEL-CTR-${100 + current.length + 1}`;
  const schoolRecord = {
    ...newSchool,
    code,
    status: newSchool.status || 'Active Partner',
    studentsCount: Number(newSchool.studentsCount) || 100
  };
  const updated = [...current, schoolRecord];
  saveStoredSchools(updated);
  return updated;
};

export const updateStoredSchool = (schoolCode, updatedFields) => {
  const current = getStoredSchools();
  const updated = current.map(s => (s.code === schoolCode || s.name === schoolCode) ? { ...s, ...updatedFields } : s);
  saveStoredSchools(updated);
  return updated;
};

export const deleteStoredSchool = (schoolCode) => {
  const current = getStoredSchools();
  const filtered = current.filter(s => s.code !== schoolCode && s.name !== schoolCode);
  saveStoredSchools(filtered);
  return filtered;
};

export const resetStoredSchools = () => {
  saveStoredSchools(DEFAULT_PARTNER_SCHOOLS);
  saveStoredSchoolsSectionHeader(DEFAULT_SCHOOLS_SECTION_HEADER);
  return DEFAULT_PARTNER_SCHOOLS;
};
