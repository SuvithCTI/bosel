// Central Master Regional Branches Repository for B★SEL

export const DEFAULT_SCHOOLS_SECTION_HEADER = {
  label: 'Our Branch Network',
  heading: 'District Branches & Centres',
  description: 'Official B★SEL District Branches, accredited franchise academies, and district examination centres across Tamil Nadu.'
};

export const DEFAULT_PARTNER_SCHOOLS = [
  {
    code: 'BSEL-BR-101',
    name: 'B★SEL Tenkasi Branch',
    branchName: 'Tenkasi Branch',
    city: 'Tenkasi, Tamil Nadu',
    address: 'Second Street, Surandai, Keelasurandai, Tenkasi - 627859',
    principal: 'Mrs. Thangam Sivaji',
    coordinator: 'Mr. S. Sivakumar',
    phone: '+91 98652 19131',
    studentsCount: 110,
    status: 'Authorized Franchise Branch'
  },
  {
    code: 'BSEL-BR-102',
    name: 'B★SEL Tirunelveli Branch',
    branchName: 'Tirunelveli Branch',
    city: 'Tirunelveli, Tamil Nadu',
    address: 'Tirunelveli Junction, Tirunelveli - 627001',
    principal: 'Dr. M. Arumugam',
    coordinator: 'Mrs. P. Vasanthi',
    phone: '+91 94431 88201',
    studentsCount: 85,
    status: 'Authorized Regional Branch'
  }
];

const BRANCH_DATA_CLEARED_KEY = 'bsel_branch_data_cleared_v1';

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
    if (Array.isArray(parsed)) {
      if (parsed.length === 0) {
        localStorage.setItem('bsel_partner_schools', JSON.stringify(DEFAULT_PARTNER_SCHOOLS));
        return DEFAULT_PARTNER_SCHOOLS;
      }
      // Ensure Tenkasi and Tirunelveli branches are present as default base branches
      let list = [...parsed];

      if (!list.some(s => (s.branchName || s.name || '').toLowerCase().includes('tenkasi'))) {
        list.unshift(DEFAULT_PARTNER_SCHOOLS[0]);
      }
      if (!list.some(s => (s.branchName || s.name || '').toLowerCase().includes('tirunelveli'))) {
        list.push(DEFAULT_PARTNER_SCHOOLS[1]);
      }

      let modified = false;
      const cleaned = list.map(s => {
        const item = { ...s };
        const bName = `${item.branchName || ''} ${item.name || ''}`.toLowerCase();
        if (bName.includes('tenkasi') && (!item.address || item.address.includes('Podanur'))) {
          item.address = 'Second Street, Surandai, Keelasurandai, Tenkasi - 627859';
          modified = true;
        } else if (bName.includes('tirunelveli') && (!item.address || item.address.includes('Podanur'))) {
          item.address = 'Tirunelveli Junction, Tirunelveli - 627001';
          modified = true;
        }
        if (item.city && item.city.toLowerCase().includes('surandai')) {
          modified = true;
          item.city = item.city.replace(/\bSurandai,?\s*/gi, '').trim() || 'Tenkasi, Tamil Nadu';
        }
        return item;
      });

      localStorage.setItem('bsel_partner_schools', JSON.stringify(cleaned));
      return cleaned;
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
