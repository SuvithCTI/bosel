// Central Franchise Leads & Enquiries Repository for B★SEL
export const DEFAULT_FRANCHISE_LEADS = [
  {
    refId: 'BSEL-FRN-849201',
    name: 'S. Ramesh Kumar',
    phone: '98421 77889',
    email: 'ramesh.academy@gmail.com',
    city: 'Tirunelveli',
    district: 'Tirunelveli',
    state: 'Tamil Nadu',
    profession: 'Senior Math Educator & Tuition Centre Owner',
    experience: '8 Years teaching Abacus & Vedic Math',
    spaceAvailable: '1,400 sq ft Commercial Floor',
    investmentBudget: '₹3 - ₹5 Lakhs',
    launchTimeline: 'Immediate (Within 30 Days)',
    status: 'New Franchise Lead',
    date: '25 Jan 2026',
    notes: 'Inquired about abacus starter kits and faculty certification.',
    agreedToTerms: true
  },
  {
    refId: 'BSEL-FRN-734190',
    name: 'Mrs. Priya Soundarajan',
    phone: '97890 22334',
    email: 'priya.abacus@outlook.com',
    city: 'Salem',
    district: 'Salem',
    state: 'Tamil Nadu',
    profession: 'School Principal (Retd.)',
    experience: '15 Years in School Administration',
    spaceAvailable: '1,100 sq ft Independent Building',
    investmentBudget: '₹5 - ₹8 Lakhs',
    launchTimeline: '1 - 2 Months',
    status: 'Site Inspection Scheduled',
    date: '18 Jan 2026',
    notes: 'Premises approved in central Salem. Inspection on 5th Feb.',
    agreedToTerms: true
  },
  {
    refId: 'BSEL-FRN-912048',
    name: 'K. Vijay Anand',
    phone: '94431 55667',
    email: 'vijay.stem@gmail.com',
    city: 'Erode',
    district: 'Erode',
    state: 'Tamil Nadu',
    profession: 'Computer Science Lecturer',
    experience: '6 Years in Python & Robotics Education',
    spaceAvailable: '1,800 sq ft IT Park Suite',
    investmentBudget: '₹6 - ₹10 Lakhs',
    launchTimeline: 'Next Academic Quarter',
    status: 'In Discussion',
    date: '14 Jan 2026',
    notes: 'Wants to offer both Abacus and Python Coding tracks.',
    agreedToTerms: true
  },
  {
    refId: 'BSEL-FRN-620185',
    name: 'Mrs. Thangam Sivaji',
    phone: '98652 19131',
    email: 'tenkasi@besellearning.org',
    city: 'Surandai',
    district: 'Tenkasi',
    state: 'Tamil Nadu',
    profession: 'Educational Director',
    experience: '12 Years in Skill & Cognitive Learning',
    spaceAvailable: '2,000 sq ft Regional Campus',
    investmentBudget: '₹10+ Lakhs',
    launchTimeline: 'Active Regional Academy',
    status: 'Approved Franchise Branch',
    date: '01 Jan 2026',
    notes: 'Head branch for Tenkasi district. Centre Director: Mrs. Thangam Sivaji.',
    agreedToTerms: true
  },
  {
    refId: 'BSEL-FRN-519204',
    name: 'M. Arunachalam',
    phone: '98409 33221',
    email: 'arun.madurai@yahoo.com',
    city: 'Madurai',
    district: 'Madurai',
    state: 'Tamil Nadu',
    profession: 'Entrepreneur & Former Franchisee',
    experience: '4 Years managing After-School Activity Centers',
    spaceAvailable: '900 sq ft Near Bypass Road',
    investmentBudget: '₹3 - ₹4 Lakhs',
    launchTimeline: 'Within 60 Days',
    status: 'New Franchise Lead',
    date: '28 Jan 2026',
    notes: 'Requesting franchise brochure and fee structure details.',
    agreedToTerms: true
  }
];

export const getStoredFranchiseLeads = () => {
  if (typeof window === 'undefined') return DEFAULT_FRANCHISE_LEADS;
  try {
    const raw = localStorage.getItem('bsel_franchise_leads');
    if (!raw) {
      localStorage.setItem('bsel_franchise_leads', JSON.stringify(DEFAULT_FRANCHISE_LEADS));
      return DEFAULT_FRANCHISE_LEADS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_FRANCHISE_LEADS;
  } catch {
    return DEFAULT_FRANCHISE_LEADS;
  }
};

export const saveStoredFranchiseLeads = (leads) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('bsel_franchise_leads', JSON.stringify(leads));
      window.dispatchEvent(new Event('bsel_franchise_leads_updated'));
    } catch (err) {
      console.error('Error saving franchise leads:', err);
    }
  }
  return leads;
};

export const updateFranchiseLeadStatus = (refId, newStatus, newNotes) => {
  const leads = getStoredFranchiseLeads();
  const index = leads.findIndex(l => l.refId === refId);
  if (index === -1) return leads;

  leads[index] = {
    ...leads[index],
    status: newStatus,
    ...(newNotes !== undefined ? { notes: newNotes } : {})
  };

  saveStoredFranchiseLeads(leads);
  return leads;
};

export const deleteFranchiseLead = (refId) => {
  const leads = getStoredFranchiseLeads();
  const updated = leads.filter(l => l.refId !== refId);
  saveStoredFranchiseLeads(updated);
  return updated;
};

export const addFranchiseLead = (lead) => {
  const leads = getStoredFranchiseLeads();
  const refId = lead.refId || `BSEL-FRN-${Math.floor(100000 + Math.random() * 900000)}`;
  const newLead = {
    ...lead,
    refId,
    date: lead.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    status: lead.status || 'New Franchise Lead'
  };
  const updated = [newLead, ...leads];
  saveStoredFranchiseLeads(updated);
  return updated;
};
