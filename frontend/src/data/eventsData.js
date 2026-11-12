export const NOTIFICATIONS_EVENTS = [
  {
    sNo: '01',
    place: 'CHENNAI (TAMIL NADU)',
    eventName: 'Number Ninjas',
    category: 'Abacus',
    date: '15 Nov 2026',
    lastDate: '05 Nov 2026',
    fee: '₹450',
    venue: 'Kamarajar Arangam, T. Nagar, Chennai',
    eligibility: 'Age 5 to 14 (Level 1 to 8)',
    status: 'Registration Open',
    description: 'Abacus mental math competition to test calculation speed, accuracy, and concentration.'
  },
  {
    sNo: '02',
    place: 'COIMBATORE (TAMIL NADU)',
    eventName: 'Little Picassos',
    category: 'Drawing & Art',
    date: '28 Nov 2026',
    lastDate: '18 Nov 2026',
    fee: '₹400',
    venue: 'Codissia Trade Fair Complex, Hall B, Coimbatore',
    eligibility: 'Age 4 to 16 Years (Group A, B & C)',
    status: 'Registration Open',
    description: 'Drawing and painting competition to showcase imagination and artistic creativity.'
  },
  {
    sNo: '03',
    place: 'BENGALURU (KARNATAKA)',
    eventName: 'Penmanship Pride',
    category: 'Handwriting',
    date: '06 Dec 2026',
    lastDate: '26 Nov 2026',
    fee: '₹350',
    venue: 'Jnana Jyothi Auditorium, Central College Campus, Bengaluru',
    eligibility: 'Class 1 to Class 12',
    status: 'Registration Open',
    description: 'Handwriting competition focused on neatness, letter formation, and presentation.'
  },
  {
    sNo: '04',
    place: 'HYDERABAD (TELANGANA)',
    eventName: 'Voice of Tomorrow',
    category: 'Language Speaking',
    date: '15 Dec 2026',
    lastDate: '05 Dec 2026',
    fee: '₹450',
    venue: 'Ravindra Bharathi Auditorium, Lakdikapul, Hyderabad',
    eligibility: 'Age 5 to 16 Years',
    status: 'Registration Open',
    description: 'Language-speaking competition featuring storytelling, speeches, and public speaking.'
  },
  {
    sNo: '05',
    place: 'MADURAI (TAMIL NADU)',
    eventName: 'Rising Stars Sports Fest',
    category: 'Athletics',
    date: '22 Dec 2026',
    lastDate: '12 Dec 2026',
    fee: '₹400',
    venue: 'Race Course Stadium, Madurai',
    eligibility: 'Age 6 to 16 Years',
    status: 'Registration Open',
    description: 'Athletics competition featuring running races, physical activities, and teamwork.'
  },
  {
    sNo: '06',
    place: 'ONLINE (PAN-INDIA)',
    eventName: 'The Colour Quest',
    category: 'Colour Management',
    date: '28 Dec 2026',
    lastDate: '18 Dec 2026',
    fee: '₹350',
    venue: 'B★SEL Online Creative Assessment & Exhibition',
    eligibility: 'Age 4 to 14 Years',
    status: 'Registration Open',
    description: 'Colour management competition exploring colour mixing, matching, and creative expression.'
  }
];

export const getStoredEvents = () => {
  if (typeof window === 'undefined') return NOTIFICATIONS_EVENTS;
  try {
    const raw = localStorage.getItem('bsel_events_data');
    if (!raw) {
      localStorage.setItem('bsel_events_data', JSON.stringify(NOTIFICATIONS_EVENTS));
      return NOTIFICATIONS_EVENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : NOTIFICATIONS_EVENTS;
  } catch {
    return NOTIFICATIONS_EVENTS;
  }
};

export const saveStoredEvents = (events) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('bsel_events_data', JSON.stringify(events));
    window.dispatchEvent(new Event('bsel_events_updated'));
  }
};

export const addStoredEvent = (eventData) => {
  const events = getStoredEvents();
  const nextNumber = events.length + 1;
  const sNo = nextNumber < 10 ? `0${nextNumber}` : String(nextNumber);
  const newEvent = {
    sNo,
    place: eventData.place || 'CHENNAI (TAMIL NADU)',
    eventName: eventData.eventName || 'New State Competition',
    category: eventData.category || 'Abacus',
    date: eventData.date || '10 Jan 2027',
    lastDate: eventData.lastDate || '01 Jan 2027',
    fee: eventData.fee || '₹400',
    venue: eventData.venue || 'B★SEL Examination Hall, Chennai',
    eligibility: eventData.eligibility || 'Open to All Grades',
    status: eventData.status || 'Registration Open',
    description: eventData.description || 'State & National level skill assessment championship organized by B★SEL.'
  };
  const updated = [...events, newEvent];
  saveStoredEvents(updated);
  return updated;
};

export const updateStoredEvent = (sNo, updatedFields) => {
  const events = getStoredEvents();
  const updated = events.map(evt => evt.sNo === sNo ? { ...evt, ...updatedFields } : evt);
  saveStoredEvents(updated);
  return updated;
};

export const deleteStoredEvent = (sNo) => {
  const events = getStoredEvents();
  const filtered = events.filter(evt => evt.sNo !== sNo);
  saveStoredEvents(filtered);
  return filtered;
};

export const resetStoredEvents = () => {
  saveStoredEvents(NOTIFICATIONS_EVENTS);
  return NOTIFICATIONS_EVENTS;
};
