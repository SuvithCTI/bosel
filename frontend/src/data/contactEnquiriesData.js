// Central Contact Us Enquiries Repository for B★SEL
export const DEFAULT_CONTACT_ENQUIRIES = [
  {
    refId: 'BSEL-ENQ-928104',
    name: 'K. Meenakshi Sundaram',
    email: 'meenakshi.edu@gmail.com',
    phone: '98421 66554',
    subject: 'School Tie-up & Faculty Training',
    message: 'We are looking to implement the B★SEL Abacus and Vedic Maths curriculum for 350 primary students in our matriculation school in Tenkasi for the upcoming academic year. Please send us the affiliation brochure and kit pricing.',
    date: '24 Feb 2026',
    time: '10:45 AM',
    status: 'New',
    replyNotes: ''
  },
  {
    refId: 'BSEL-ENQ-745219',
    name: 'Dr. Anandhakrishnan',
    email: 'anand.principal@tvs-school.org',
    phone: '94431 88990',
    subject: 'Upcoming State Olympiad & Hall Tickets',
    message: 'Inquiring about group student hall ticket distribution for the upcoming State Level Abacus Speed Arithmetic championship. Can our school coordinator collect the hall tickets in bulk?',
    date: '23 Feb 2026',
    time: '03:15 PM',
    status: 'In Review',
    replyNotes: 'Coordinator contacted via WhatsApp, shared bulk registration roster.'
  },
  {
    refId: 'BSEL-ENQ-631980',
    name: 'Sangeetha Murugan',
    email: 'sangeetha.parent@yahoo.com',
    phone: '97890 33445',
    subject: 'Course Details & Level Syllabus',
    message: 'My daughter completed Level 2 Abacus at our local learning center. We recently relocated to Madurai. Can she continue with Level 3 at the Madurai branch or online?',
    date: '21 Feb 2026',
    time: '11:20 AM',
    status: 'Resolved',
    replyNotes: 'Connected with Madurai branch head Mr. Srinivasan. Student transferred to Batch MDU-A3.'
  }
];

export const getStoredContactEnquiries = () => {
  if (typeof window === 'undefined') return DEFAULT_CONTACT_ENQUIRIES;
  try {
    const raw = localStorage.getItem('bsel_general_enquiries');
    if (!raw) {
      localStorage.setItem('bsel_general_enquiries', JSON.stringify(DEFAULT_CONTACT_ENQUIRIES));
      return DEFAULT_CONTACT_ENQUIRIES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_CONTACT_ENQUIRIES;
  } catch (err) {
    console.error('Failed to parse contact enquiries:', err);
    return DEFAULT_CONTACT_ENQUIRIES;
  }
};

export const saveStoredContactEnquiries = (list) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('bsel_general_enquiries', JSON.stringify(list));
    window.dispatchEvent(new Event('bsel_contact_enquiries_updated'));
  } catch (err) {
    console.error('Failed to save contact enquiries:', err);
  }
};

export const addStoredContactEnquiry = (enquiry) => {
  const current = getStoredContactEnquiries();
  const updated = [enquiry, ...current.filter((e) => e.refId !== enquiry.refId)];
  saveStoredContactEnquiries(updated);
  return updated;
};

export const updateContactEnquiryStatus = (refId, newStatus, replyNotes = null) => {
  const current = getStoredContactEnquiries();
  const updated = current.map((item) => {
    if (item.refId === refId) {
      return {
        ...item,
        status: newStatus,
        ...(replyNotes !== null ? { replyNotes } : {})
      };
    }
    return item;
  });
  saveStoredContactEnquiries(updated);
  return updated;
};

export const deleteContactEnquiry = (refId) => {
  const current = getStoredContactEnquiries();
  const updated = current.filter((item) => item.refId !== refId);
  saveStoredContactEnquiries(updated);
  return updated;
};
