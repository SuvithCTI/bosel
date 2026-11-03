// Central Master Partner Schools & Branches Repository for B★SEL

export const DEFAULT_SCHOOLS_SECTION_HEADER = {
  label: 'Our School Community',
  heading: 'Growing Together',
  description: 'Celebrating the schools and educational communities involved in our learning activities and student recognition programs.'
};

export const DEFAULT_PARTNER_SCHOOLS = [
  {
    code: 'BSEL-CTR-101',
    name: 'RC Middle School',
    branchName: 'Uthumalai Regional Centre',
    city: 'Uthumalai, Tamil Nadu',
    principal: 'Rev. Fr. Principal',
    coordinator: 'Mr. S. Albert',
    phone: '+91 98652 19131',
    studentsCount: 420,
    status: 'Active Partner'
  },
  {
    code: 'BSEL-CTR-102',
    name: 'Sacred Heart Nursery & Primary School',
    branchName: 'Panagudi Study Centre',
    city: 'Panagudi, Tamil Nadu',
    principal: 'Sr. Mary Superior',
    coordinator: 'Mrs. A. Rosy',
    phone: '+91 98400 12345',
    studentsCount: 170,
    status: 'Active Partner'
  },
  {
    code: 'BSEL-CTR-103',
    name: 'Amaravathi Matriculation School',
    branchName: 'Amaravathi Centre',
    city: 'Tamil Nadu',
    principal: 'Dr. K. Amaravathi',
    coordinator: 'Mr. V. Raman',
    phone: '+91 94433 22110',
    studentsCount: 190,
    status: 'Active Partner'
  },
  {
    code: 'BSEL-CTR-104',
    name: 'Muslims Committee School',
    branchName: 'Veeranam Centre',
    city: 'Veeranam, Tamil Nadu',
    principal: 'Janab M. Hameed',
    coordinator: 'Mr. K. Siraj',
    phone: '+91 98801 55443',
    studentsCount: 120,
    status: 'Active Partner'
  },
  {
    code: 'BSEL-CTR-105',
    name: 'St. Maries Nursery and Primary School',
    branchName: 'Tuticorin Coastal Centre',
    city: 'Tuticorin, Tamil Nadu',
    principal: 'Mrs. D. Maria',
    coordinator: 'Mr. P. Paul',
    phone: '+91 98412 87654',
    studentsCount: 160,
    status: 'Active Partner'
  },
  {
    code: 'BSEL-CTR-106',
    name: 'B★SEL Tenkasi Regional Academy',
    branchName: 'Tenkasi Regional Branch',
    city: 'Surandai, Tenkasi, Tamil Nadu',
    principal: 'Mrs. Thangam Sivaji',
    coordinator: 'Mr. S. Sivakumar',
    phone: '+91 98652 19131',
    studentsCount: 110,
    status: 'Authorized Franchise Branch'
  },
  {
    code: 'BSEL-CTR-107',
    name: 'B★SEL Tirunelveli Regional Academy',
    branchName: 'Tirunelveli Regional Branch',
    city: 'Tirunelveli, Tirunelveli, Tamil Nadu',
    principal: 'Dr. P. Muthukumar',
    coordinator: 'Mrs. S. Gandhimathi',
    phone: '+91 98652 19131',
    studentsCount: 140,
    status: 'Authorized Franchise Branch'
  },
  {
    code: 'BSEL-CTR-108',
    name: 'B★SEL Erode Regional Academy',
    branchName: 'Erode Regional Branch',
    city: 'Erode, Erode, Tamil Nadu',
    principal: 'Mr. V. Sakthivel',
    coordinator: 'Mrs. M. Kavitha',
    phone: '+91 98427 65432',
    studentsCount: 125,
    status: 'Authorized Franchise Branch'
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
      // Ensure all 8 default schools exist if fewer are present initially
      if (parsed.length < DEFAULT_PARTNER_SCHOOLS.length) {
        const existingNames = new Set(parsed.map(s => (s.name || '').toLowerCase().trim()));
        const missing = DEFAULT_PARTNER_SCHOOLS.filter(s => !existingNames.has((s.name || '').toLowerCase().trim()));
        if (missing.length > 0) {
          const merged = [...parsed, ...missing];
          localStorage.setItem('bsel_partner_schools', JSON.stringify(merged));
          return merged;
        }
      }
      return parsed;
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
