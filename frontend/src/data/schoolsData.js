// Central Master Regional Branches Repository for B★SEL

export const DEFAULT_SCHOOLS_SECTION_HEADER = {
  label: 'Our Branch Network',
  heading: 'District Branches & Centres',
  description: 'Official B★SEL District Branches, accredited franchise academies, and district examination centres across Tamil Nadu.'
};

export const DEFAULT_PARTNER_SCHOOLS = [];

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
    if (!localStorage.getItem(BRANCH_DATA_CLEARED_KEY)) {
      localStorage.setItem('bsel_partner_schools', JSON.stringify(DEFAULT_PARTNER_SCHOOLS));
      localStorage.setItem(BRANCH_DATA_CLEARED_KEY, 'true');
      return DEFAULT_PARTNER_SCHOOLS;
    }

    const raw = localStorage.getItem('bsel_partner_schools');
    if (!raw) {
      return DEFAULT_PARTNER_SCHOOLS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
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
