// Central Master Partner Schools & Branches Repository for B★SEL

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
  }
];

export const getStoredSchools = () => {
  if (typeof window === 'undefined') return DEFAULT_PARTNER_SCHOOLS;
  try {
    const raw = localStorage.getItem('bsel_partner_schools');
    if (!raw) {
      localStorage.setItem('bsel_partner_schools', JSON.stringify(DEFAULT_PARTNER_SCHOOLS));
      return DEFAULT_PARTNER_SCHOOLS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PARTNER_SCHOOLS;
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
  const updated = [schoolRecord, ...current];
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
