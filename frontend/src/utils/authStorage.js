// Local storage and authentication management for BSEL users
import { verifyBranchLogin, resolveBranchDetails, cleanBranchName } from './branchAuthStorage';
import { getStoredStaff } from './staffStorage';
import { findFranchiseCredentials } from './franchiseStorage';
import { findSchoolCredentials } from './schoolStorage';

const DEFAULT_USERS = [
  {
    userId: 'admin',
    password: 'admin123',
    studentName: 'B★SEL Super Administrator',
    name: 'B★SEL Super Administrator',
    parentName: 'Governing Council',
    email: 'admin@besellearning.org',
    phone: '98400 12345',
    grade: 'Administrator',
    program: 'All Programs & Operations',
    institution: 'National Secretariat, Chennai',
    address: 'B★SEL Central Bhavan, Gandhi Salai, Chennai - 600017',
    role: 'Super Admin',
    branch: 'Headquarters (All Branches)',
    enrolmentDate: '01 Jan 2026',
    events: [],
    results: []
  },
  {
    userId: 'bseltenkasi@bsel.org',
    password: 'tenkasibsel',
    studentName: 'Mrs. Thangam Sivaji',
    name: 'Mrs. Thangam Sivaji',
    parentName: 'Tenkasi Branch Administration',
    email: 'bseltenkasi@bsel.org',
    phone: '98652 19131',
    grade: 'Centre Director',
    program: 'Branch Operations & Training',
    institution: 'B★SEL Tenkasi Branch',
    branch: 'Tenkasi Branch',
    branchCode: 'BSEL-BR-101',
    address: 'Tenkasi, Tamil Nadu',
    role: 'Branch Head',
    enrolmentDate: '01 Feb 2026',
    events: [],
    results: []
  },
  {
    userId: 'bsel+tenkasi@bsel.org',
    password: 'tenkasi+bsel',
    studentName: 'Mrs. Thangam Sivaji',
    name: 'Mrs. Thangam Sivaji',
    parentName: 'Tenkasi Branch Administration',
    email: 'bsel+tenkasi@bsel.org',
    phone: '98652 19131',
    grade: 'Centre Director',
    program: 'Branch Operations & Training',
    institution: 'B★SEL Tenkasi Branch',
    branch: 'Tenkasi Branch',
    branchCode: 'BSEL-BR-101',
    address: 'Second Street, Surandai, Keelasurandai, Tenkasi - 627859',
    role: 'Branch Head',
    enrolmentDate: '01 Feb 2026',
    events: [],
    results: []
  },
  {
    userId: 'branch.tenkasi',
    password: 'branch123',
    studentName: 'Mrs. Thangam Sivaji',
    name: 'Mrs. Thangam Sivaji',
    parentName: 'Tenkasi Branch Administration',
    email: 'tenkasi@besellearning.org',
    phone: '98652 19131',
    grade: 'Centre Director',
    program: 'Branch Operations & Training',
    institution: 'B★SEL Tenkasi Regional Academy',
    branch: 'Tenkasi Regional Branch',
    branchCode: 'TSI-01',
    address: 'Second Street, Surandai, Keelasurandai, Tenkasi - 627859',
    role: 'Branch Head',
    enrolmentDate: '01 Feb 2026',
    events: [],
    results: []
  },
  {
    userId: 'bseltirunelveli@bsel.org',
    password: 'tirunelvelibsel',
    studentName: 'Dr. M. Arumugam',
    name: 'Dr. M. Arumugam',
    parentName: 'Tirunelveli Branch Administration',
    email: 'bseltirunelveli@bsel.org',
    phone: '94431 88201',
    grade: 'Centre Director',
    program: 'Branch Operations & Training',
    institution: 'B★SEL Tirunelveli Branch',
    branch: 'Tirunelveli Branch',
    branchCode: 'BSEL-BR-102',
    address: 'Tirunelveli, Tamil Nadu',
    role: 'Branch Head',
    enrolmentDate: '01 Feb 2026',
    events: [],
    results: []
  },
  {
    userId: 'branch.tirunelveli',
    password: 'branch123',
    studentName: 'Dr. M. Arumugam',
    name: 'Dr. M. Arumugam',
    parentName: 'Tirunelveli Branch Administration',
    email: 'tirunelveli@besellearning.org',
    phone: '94431 88201',
    grade: 'Centre Director',
    program: 'Branch Operations & Training',
    institution: 'B★SEL Tirunelveli Regional Academy',
    branch: 'Tirunelveli Branch',
    branchCode: 'BSEL-BR-102',
    address: 'Tirunelveli Junction, Tirunelveli - 627001',
    role: 'Branch Head',
    enrolmentDate: '01 Feb 2026',
    events: [],
    results: []
  },
  {
    userId: 'staff',
    password: 'staff123',
    studentName: 'B★SEL Staff Member',
    name: 'B★SEL Staff Member',
    parentName: 'Academic Operations',
    email: 'staff@bsel.org',
    phone: '98401 23456',
    grade: 'Academic Staff',
    program: 'Student Operations & Evaluation',
    institution: 'B★SEL Learning Center',
    branch: 'Tenkasi Regional Branch',
    branchCode: 'TSI-01',
    address: 'B★SEL Staff Division, Tamil Nadu',
    role: 'Staff',
    enrolmentDate: '01 Jan 2026',
    events: [],
    results: []
  },
  {
    id: 'demo-stu-sivaji-001',
    userId: 'BSEL-8248600345',
    password: '8248600345',
    name: 'Sivaji',
    studentName: 'Sivaji',
    parentName: 'M. Sivaji Pandian',
    fatherName: 'M. Sivaji Pandian',
    email: 'sivaji@example.com',
    phone: '8248600345',
    mobile: '8248600345',
    grade: 'Level 1',
    level: 'Level 1',
    courseLevel: 'Level 1',
    program: 'Abacus',
    courseName: 'Abacus',
    institution: 'Tenkasi Branch',
    branch: 'Tenkasi Branch',
    studyCenter: 'Tenkasi Branch',
    registerNumber: 'AB27-001',
    registrationNo: 'AB27-001',
    admissionNo: 'AB27-001',
    feeAmount: '₹450',
    feePaymentType: 'Paid Online',
    enrolmentDate: '05 Oct 2026',
    date: '05 Oct 2026',
    role: 'Student',
    gender: 'Male',
    dob: '2016-05-28',
    dateOfBirth: '2016-05-28',
    address: 'Second Street, Surandai, Keelasurandai, Tenkasi - 627859',
    results: [
      {
        subject: 'Mental Arithmetic & Speed Calculations',
        marks: 98,
        maxMarks: 100,
        result: 'Pass',
        grade: 'A+'
      }
    ]
  },
  {
    id: 'demo-stu-kavya-002',
    userId: 'BSEL-9442188771',
    password: '9442188771',
    name: 'Kavya Maran',
    studentName: 'Kavya Maran',
    parentName: 'S. Maran',
    fatherName: 'S. Maran',
    email: 'kavya@example.com',
    phone: '9442188771',
    mobile: '9442188771',
    grade: 'Level 1',
    level: 'Level 1',
    courseLevel: 'Level 1',
    program: 'Phonics',
    courseName: 'Phonics',
    institution: 'Tirunelveli Branch',
    branch: 'Tirunelveli Branch',
    studyCenter: 'Tirunelveli Branch',
    registerNumber: 'ADM-2026-004',
    registrationNo: 'ADM-2026-004',
    admissionNo: 'ADM-2026-004',
    feeAmount: '₹450',
    feePaymentType: 'Paid Online',
    enrolmentDate: '15 Oct 2026',
    date: '15 Oct 2026',
    role: 'Student',
    gender: 'Female',
    dob: '2015-08-12',
    dateOfBirth: '2015-08-12',
    address: '45, Main Road, Palayamkottai, Tirunelveli - 627002',
    results: [
      {
        subject: 'Phonics & Speech Sounds',
        marks: 92,
        maxMarks: 100,
        result: 'Pass',
        grade: 'A+'
      }
    ]
  },
  {
    id: 'demo-stu-fc-101',
    userId: 'BSEL-9865219101',
    password: '9865219101',
    name: 'M. Rahul',
    studentName: 'M. Rahul',
    parentName: 'S. Murugan',
    fatherName: 'S. Murugan',
    email: 'rahul.fc@bsel.org',
    phone: '98652 19101',
    mobile: '9865219101',
    grade: 'Class 7',
    program: 'Abacus Speed Arithmetic',
    courseName: 'Abacus Speed Arithmetic',
    courseLevel: 'Level 1',
    level: 'Level 1',
    institution: 'Tenkasi City Franchise',
    franchiseId: 'fc-tsi-101',
    branch: 'Tenkasi Branch',
    admissionCategory: 'franchise',
    registerNumber: 'AB26-001',
    registrationNo: 'AB26-001',
    feeAmount: '₹450',
    feePaymentType: 'Paid Online',
    enrolmentDate: '10 Feb 2026',
    role: 'Student',
    results: [
      {
        subject: 'Mental Arithmetic & Speed Calculations',
        marks: 96,
        maxMarks: 100,
        result: 'Pass',
        grade: 'A+'
      }
    ]
  },
  {
    id: 'demo-stu-sch-101',
    userId: 'BSEL-9443188201',
    password: '9443188201',
    name: 'A. Sneha',
    studentName: 'A. Sneha',
    parentName: 'K. Anandhan',
    fatherName: 'K. Anandhan',
    email: 'sneha.sch@bsel.org',
    phone: '94431 88201',
    mobile: '9443188201',
    grade: 'Class 8',
    program: 'Computer Office Automation',
    courseName: 'Computer Office Automation',
    courseLevel: 'Level 1',
    level: 'Level 1',
    institution: "St. Joseph's Matric Higher Secondary School",
    schoolId: 'sch-tsi-101',
    branch: 'Tenkasi Branch',
    admissionCategory: 'school',
    registerNumber: 'CS26-001',
    registrationNo: 'CS26-001',
    feeAmount: '₹450',
    feePaymentType: 'Paid Online',
    enrolmentDate: '12 Feb 2026',
    role: 'Student',
    results: [
      {
        subject: 'Office Automation & Document Architecture',
        marks: 94,
        maxMarks: 100,
        result: 'Pass',
        grade: 'A+'
      }
    ]
  },
  // Tirunelveli Schools Admins
  {
    userId: 'school.sacredheart',
    password: 'school123',
    role: 'School',
    name: 'Sacred Heart Nursery and Primary School',
    studentName: 'Sacred Heart Nursery and Primary School',
    schoolId: 'sch-shnp-101',
    schoolCode: 'BSEL-SCH-201',
    schoolName: 'Sacred Heart Nursery and Primary School',
    branch: 'Tirunelveli Branch',
    branchCode: 'BSEL-BR-102',
    institution: 'Sacred Heart Nursery and Primary School',
    address: 'Main Road, Tirunelveli, Tamil Nadu',
    phone: '94431 88203',
    email: 'shnp.tirunelveli@bsel.org',
    status: 'Active'
  },
  {
    userId: 'school.sacredheartcbse',
    password: 'school123',
    role: 'School',
    name: 'Sacred Heart Public School - CBSE',
    studentName: 'Sacred Heart Public School - CBSE',
    schoolId: 'sch-shcbse-102',
    schoolCode: 'BSEL-SCH-202',
    schoolName: 'Sacred Heart Public School - CBSE',
    branch: 'Tirunelveli Branch',
    branchCode: 'BSEL-BR-102',
    institution: 'Sacred Heart Public School - CBSE',
    address: 'By-Pass Road, Tirunelveli, Tamil Nadu',
    phone: '94431 88204',
    email: 'shcbse.tirunelveli@bsel.org',
    status: 'Active'
  },
  // Tenkasi Schools Admins
  {
    userId: 'school.rcmuthumalai',
    password: 'school123',
    role: 'School',
    name: 'RC Middle School - Uthumalai',
    studentName: 'RC Middle School - Uthumalai',
    schoolId: 'sch-rcm-101',
    schoolCode: 'BSEL-SCH-101',
    schoolName: 'RC Middle School - Uthumalai',
    branch: 'Tenkasi Branch',
    branchCode: 'BSEL-BR-101',
    institution: 'RC Middle School - Uthumalai',
    address: 'Church Street, Uthumalai, Tenkasi District, Tamil Nadu',
    phone: '98652 19135',
    email: 'rcm.uthumalai@bsel.org',
    status: 'Active'
  },
  {
    userId: 'school.muslimsveeranam',
    password: 'school123',
    role: 'School',
    name: 'Muslims Primary School - Veeranam',
    studentName: 'Muslims Primary School - Veeranam',
    schoolId: 'sch-mps-102',
    schoolCode: 'BSEL-SCH-102',
    schoolName: 'Muslims Primary School - Veeranam',
    branch: 'Tenkasi Branch',
    branchCode: 'BSEL-BR-101',
    institution: 'Muslims Primary School - Veeranam',
    address: 'School Street, Veeranam, Tenkasi District, Tamil Nadu',
    phone: '98652 19136',
    email: 'mps.veeranam@bsel.org',
    status: 'Active'
  },
  {
    userId: 'school.jothiprimary',
    password: 'school123',
    role: 'School',
    name: 'Jothi Primary School - Lakshmi Puram',
    studentName: 'Jothi Primary School - Lakshmi Puram',
    schoolId: 'sch-jps-103',
    schoolCode: 'BSEL-SCH-103',
    schoolName: 'Jothi Primary School - Lakshmi Puram',
    branch: 'Tenkasi Branch',
    branchCode: 'BSEL-BR-101',
    institution: 'Jothi Primary School - Lakshmi Puram',
    address: 'Lakshmi Puram, Tenkasi District, Tamil Nadu',
    phone: '98652 19137',
    email: 'jps.lakshmipuram@bsel.org',
    status: 'Active'
  },
  {
    userId: 'school.balaguru',
    password: 'school123',
    role: 'School',
    name: 'Bala Guru Vidhyasalai - Vennilingapuram',
    studentName: 'Bala Guru Vidhyasalai - Vennilingapuram',
    schoolId: 'sch-bgv-104',
    schoolCode: 'BSEL-SCH-104',
    schoolName: 'Bala Guru Vidhyasalai - Vennilingapuram',
    branch: 'Tenkasi Branch',
    branchCode: 'BSEL-BR-101',
    institution: 'Bala Guru Vidhyasalai - Vennilingapuram',
    address: 'Main Road, Vennilingapuram, Tenkasi District, Tamil Nadu',
    phone: '98652 19138',
    email: 'bgv.vennilingapuram@bsel.org',
    status: 'Active'
  },
  // Tenkasi Academies (Franchises) Admins
  {
    userId: 'franchise.aim4life',
    password: 'franchise123',
    role: 'Franchise',
    name: 'Aim 4 Life Dance Studio',
    studentName: 'Aim 4 Life Dance Studio',
    franchiseId: 'fc-aim-101',
    code: 'BSEL-FC-101',
    branch: 'Tenkasi Branch',
    branchCode: 'BSEL-BR-101',
    institution: 'Aim 4 Life Dance Studio',
    address: '14, Main Road, Tenkasi, Tamil Nadu',
    phone: '98652 19131',
    email: 'aim4life@bsel.org',
    status: 'Active'
  },
  {
    userId: 'franchise.champions',
    password: 'franchise123',
    role: 'Franchise',
    name: 'Champions Cultural Academy',
    studentName: 'Champions Cultural Academy',
    franchiseId: 'fc-cca-102',
    code: 'BSEL-FC-102',
    branch: 'Tenkasi Branch',
    branchCode: 'BSEL-BR-101',
    institution: 'Champions Cultural Academy',
    address: '28, Gandhi Salai, Tenkasi, Tamil Nadu',
    phone: '98652 19134',
    email: 'champions@bsel.org',
    status: 'Active'
  }
];

export { isStudentUser } from './studentValidator';

export const getRegisteredUsers = () => {
  if (typeof window === 'undefined') return DEFAULT_USERS;
  try {
    const raw = localStorage.getItem('bsel_registered_users');
    let users = DEFAULT_USERS;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        users = parsed;
      }
    }
    // Always ensure Super Admin and Default Branch Heads are present in the list
    let modified = false;
    DEFAULT_USERS.forEach(defUser => {
      if (!users.some(u => u.userId.toLowerCase() === defUser.userId.toLowerCase())) {
        users.push(defUser);
        modified = true;
      }
    });

    // Ensure all students have a valid official Register Number (e.g. AB27-001) and strictly BSEL-<MobileNumber> User ID (no district)
    users.forEach((u, i) => {
      const isStudent = u.role === 'Student' || (!u.role && u.userId !== 'admin' && u.userId !== 'staff' && !u.userId.startsWith('branch.') && !u.userId.startsWith('SCH-'));
      if (isStudent) {
        // Enforce BSEL-<cleanMobile> format for student User ID
        const phoneDigits = (u.phone || '').replace(/\D/g, '');
        const cleanMobile = phoneDigits.length >= 10 ? phoneDigits.slice(-10) : '';
        if (cleanMobile) {
          const expectedId = `BSEL-${cleanMobile}`;
          if (u.userId !== expectedId) {
            u.userId = expectedId;
            // Also ensure password matches their mobile if it was using default or district format
            if (!u.password || u.password === 'besel2026') {
              u.password = cleanMobile;
            }
            modified = true;
          }
        }

        const needsReg = !u.registerNumber || 
          u.registerNumber.startsWith('BSEL-STU-') || 
          u.registerNumber === u.userId || 
          u.registerNumber === 'Not provided';
        if (needsReg) {
          const course = u.program || u.courseName || 'Abacus Speed Arithmetic';
          const prefix = getCoursePrefix(course);
          const currentYear = new Date().getFullYear();
          const year2Digit = String(currentYear).slice(-2);
          const numSeq = String(i + 1).padStart(3, '0');
          u.registerNumber = `${prefix}${year2Digit}-${numSeq}`;
          u.registrationNo = u.registerNumber;
          modified = true;
        }
      }
    });

    if (modified) {
      try {
        localStorage.setItem('bsel_registered_users', JSON.stringify(users));
      } catch {
        // ignore
      }
    }
    return users;
  } catch {
    return DEFAULT_USERS;
  }
};

export const DISTRICT_SHORT_CODES = {
  'Ariyalur': 'ALR',
  'Chengalpattu': 'CGL',
  'Chennai': 'CHN',
  'Coimbatore': 'CBE',
  'Cuddalore': 'CUD',
  'Dharmapuri': 'DPI',
  'Dindigul': 'DGL',
  'Erode': 'ERD',
  'Kallakurichi': 'KLK',
  'Kanchipuram': 'KPM',
  'Kanyakumari': 'KKI',
  'Karur': 'KRR',
  'Krishnagiri': 'KGI',
  'Madurai': 'MDU',
  'Mayiladuthurai': 'MYD',
  'Nagapattinam': 'NGP',
  'Namakkal': 'NKL',
  'Nilgiris': 'NLG',
  'Perambalur': 'PBL',
  'Pudukkottai': 'PDK',
  'Ramanathapuram': 'RMD',
  'Ranipet': 'RPT',
  'Salem': 'SLM',
  'Sivaganga': 'SVG',
  'Tenkasi': 'TSI',
  'Thanjavur': 'TNJ',
  'Theni': 'THI',
  'Thoothukudi': 'TKD',
  'Tiruchirappalli (Trichy)': 'TRY',
  'Tirunelveli': 'TNV',
  'Tirupathur': 'TPT',
  'Tiruppur': 'TPR',
  'Tiruvallur': 'TLR',
  'Tiruvannamalai': 'TVM',
  'Tiruvarur': 'TVR',
  'Vellore': 'VLR',
  'Viluppuram': 'VPM',
  'Virudhunagar': 'VNR',
  'Other District / State': 'OTH'
};

export const getDistrictShortCode = (districtName) => {
  if (!districtName) return 'TN';
  if (DISTRICT_SHORT_CODES[districtName]) {
    return DISTRICT_SHORT_CODES[districtName];
  }
  const base = districtName.split('(')[0].trim();
  if (DISTRICT_SHORT_CODES[base]) {
    return DISTRICT_SHORT_CODES[base];
  }
  return base.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase() || 'TN';
};

export const generateCertificateNumber = (courseName = '', level = 'Level 1') => {
  const prefix = getCoursePrefix(courseName);
  const cleanLevel = String(level).replace(/\D/g, '') || '1';
  
  let maxSerial = 0;
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('bsel_registered_users');
      if (raw) {
        const users = JSON.parse(raw);
        if (Array.isArray(users)) {
          const certPattern = new RegExp(`^BSEL/${prefix}/L${cleanLevel}/(\\d+)`, 'i');
          users.forEach((u) => {
            (u.results || []).forEach((r) => {
              const cNo = r.certificateNo || '';
              const match = cNo.match(certPattern);
              if (match && match[1]) {
                const num = parseInt(match[1], 10);
                if (!isNaN(num) && num > maxSerial) {
                  maxSerial = num;
                }
              }
            });
          });
        }
      }
    } catch {
      // ignore
    }
  }

  const nextSerial = maxSerial + 1;
  const paddedSerial = String(nextSerial).padStart(4, '0');
  return `BSEL/${prefix}/L${cleanLevel}/${paddedSerial}`;
};

export const getCoursePrefix = (courseName = '') => {
  const lower = String(courseName || '').toLowerCase();
  if (lower.includes('abacus')) return 'AB';
  if (lower.includes('handwriting')) return 'HW';
  if (lower.includes('phonics')) return 'PH';
  if (lower.includes('computer')) return 'CM';
  if (lower.includes('draw') || lower.includes('art')) return 'DR';
  if (lower.includes('memory')) return 'MM';
  if (lower.includes('bharatanatyam') || lower.includes('dance')) return 'BN';
  if (lower.includes('office') || lower.includes('ms')) return 'MS';
  if (lower.includes('html')) return 'HT';
  if (lower.includes('css')) return 'CS';
  if (lower.includes('python')) return 'PY';
  if (lower.includes('photoshop')) return 'PS';
  if (lower.includes('ai') || lower.includes('artificial')) return 'AI';
  if (lower.includes('canva')) return 'CV';
  if (lower.includes('language') || lower.includes('speak')) return 'LS';
  if (lower.includes('athletic')) return 'AT';
  return 'AB';
};

export const generateRegisterNumber = (courseName = '', existingUsed = []) => {
  const prefix = getCoursePrefix(courseName);
  const currentYear = new Date().getFullYear();
  const year2Digit = String(currentYear).slice(-2); // e.g. "26" in 2026, "27" in 2027

  let maxSerial = 0;
  const regPattern = new RegExp(`^${prefix}${year2Digit}-(\\d+)`, 'i');

  if (Array.isArray(existingUsed)) {
    existingUsed.forEach((r) => {
      const match = String(r).match(regPattern);
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxSerial) {
          maxSerial = num;
        }
      }
    });
  }

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('bsel_registered_users');
      if (raw) {
        const users = JSON.parse(raw);
        if (Array.isArray(users)) {
          users.forEach((u) => {
            const regList = [
              u.registerNumber,
              u.registrationNo,
              ...(Array.isArray(u.selectedCourses) ? u.selectedCourses.map(c => c.registerNumber) : []),
              ...(Array.isArray(u.courses) ? u.courses.map(c => c.registerNumber) : [])
            ].filter(Boolean);

            regList.forEach(regNo => {
              String(regNo).split(',').forEach(singleReg => {
                const match = singleReg.trim().match(regPattern);
                if (match && match[1]) {
                  const num = parseInt(match[1], 10);
                  if (!isNaN(num) && num > maxSerial) {
                    maxSerial = num;
                  }
                }
              });
            });
          });
        }
      }
    } catch {
      // ignore
    }
  }

  const nextSerial = maxSerial + 1;
  const paddedSerial = String(nextSerial).padStart(3, '0');
  return `${prefix}${year2Digit}-${paddedSerial}`;
};

export const isPhoneNumberRegistered = (phoneNumber) => {
  if (!phoneNumber) return false;
  const digits = String(phoneNumber).replace(/\D/g, '');
  const cleanMobile = digits.length >= 10 ? digits.slice(-10) : digits;
  if (!cleanMobile || cleanMobile.length < 10) return false;

  const users = getRegisteredUsers();
  return users.some((u) => {
    // Only check against student accounts
    const isStudent = u.role === 'Student' || (!u.role && u.userId !== 'admin' && u.userId !== 'staff' && !String(u.userId || '').startsWith('branch.'));
    if (!isStudent) return false;

    const uPhone = (u.phone || '').replace(/\D/g, '');
    const uClean = uPhone.length >= 10 ? uPhone.slice(-10) : uPhone;
    if (uClean && uClean === cleanMobile) return true;

    const uId = (u.userId || '').replace(/\D/g, '');
    const uIdClean = uId.length >= 10 ? uId.slice(-10) : uId;
    if (uIdClean && uIdClean === cleanMobile) return true;

    return false;
  });
};

export const getStudentByPhone = (phoneNumber) => {
  if (!phoneNumber) return null;
  const digits = String(phoneNumber).replace(/\D/g, '');
  const cleanMobile = digits.length >= 10 ? digits.slice(-10) : digits;
  if (!cleanMobile || cleanMobile.length < 10) return null;

  const users = getRegisteredUsers();
  return users.find((u) => {
    const isStudent = u.role === 'Student' || (!u.role && u.userId !== 'admin' && u.userId !== 'staff' && !String(u.userId || '').startsWith('branch.'));
    if (!isStudent) return false;

    const uPhone = (u.phone || '').replace(/\D/g, '');
    const uClean = uPhone.length >= 10 ? uPhone.slice(-10) : uPhone;
    if (uClean && uClean === cleanMobile) return true;

    const uId = (u.userId || '').replace(/\D/g, '');
    const uIdClean = uId.length >= 10 ? uId.slice(-10) : uId;
    if (uIdClean && uIdClean === cleanMobile) return true;

    return false;
  }) || null;
};

export const registerStudentAccount = (formData) => {
  const users = getRegisteredUsers();

  // Resolve official branch
  let studentBranch = (formData.branch || formData.district || 'Tenkasi').trim();

  // If admission is done under School, ensure branch resolves from the school's parent branch if known
  if (formData.admissionCategory === 'School') {
    let sch = null;
    try {
      const rawSchools = typeof window !== 'undefined' ? (localStorage.getItem('bsel_schools_list') || localStorage.getItem('bsel_partner_schools')) : null;
      const schools = rawSchools ? JSON.parse(rawSchools) : [];
      if (Array.isArray(schools)) {
        sch = schools.find(s =>
          (formData.schoolId && s.id === formData.schoolId) ||
          (formData.schoolName && s.name && s.name.toLowerCase() === formData.schoolName.toLowerCase()) ||
          (formData.institution && s.name && s.name.toLowerCase() === formData.institution.toLowerCase())
        );
      }
    } catch {}
    if (sch && (sch.branch || sch.city)) {
      const parentBranch = cleanBranchName(sch.branch || sch.city);
      if (parentBranch && (!formData.branch || formData.branch === 'Tenkasi' || !cleanBranchName(formData.branch))) {
        studentBranch = parentBranch;
      }
    }
  }

  // If admission is done under Academy / Franchise, ensure branch resolves from the franchise's parent branch if known
  if (formData.admissionCategory === 'Franchise' || formData.admissionCategory === 'Academy') {
    let fc = null;
    try {
      const rawFc = typeof window !== 'undefined' ? localStorage.getItem('bsel_franchises_list') : null;
      const franchises = rawFc ? JSON.parse(rawFc) : [];
      if (Array.isArray(franchises)) {
        fc = franchises.find(f =>
          (formData.franchiseId && f.id === formData.franchiseId) ||
          (formData.franchiseName && f.name && f.name.toLowerCase() === formData.franchiseName.toLowerCase()) ||
          (formData.institution && f.name && f.name.toLowerCase() === formData.institution.toLowerCase())
        );
      }
    } catch {}
    if (fc && (fc.branch || fc.city)) {
      const parentBranch = cleanBranchName(fc.branch || fc.city);
      if (parentBranch && (!formData.branch || formData.branch === 'Tenkasi' || !cleanBranchName(formData.branch))) {
        studentBranch = parentBranch;
      }
    }
  }

  const cleanBranch = cleanBranchName(studentBranch) || studentBranch;
  const branchDetails = resolveBranchDetails(studentBranch);
  const rawDigits = (formData.phone || '').replace(/\D/g, '');
  const cleanMobile = rawDigits.length >= 10 ? rawDigits.slice(-10) : (rawDigits || '9840123456');

  if (cleanMobile.length === 10 && isPhoneNumberRegistered(cleanMobile)) {
    throw new Error(`Mobile number ${cleanMobile} already exists! An account has already been registered with this mobile number. Please log in using this mobile number.`);
  }

  // Format: BSEL-MobileNumber (e.g., BSEL-9988776655)
  const newUserId = `BSEL-${cleanMobile}`;
  // Password: their mobile number
  const newPassword = cleanMobile;

  // Handle multi-course or single course
  const selectedCourses = Array.isArray(formData.selectedCourses) && formData.selectedCourses.length > 0
    ? formData.selectedCourses
    : [
        {
          courseName: formData.courseName || formData.program || 'Abacus Speed Arithmetic',
          level: formData.grade || formData.level || 'Level 1',
          fee: formData.feeAmount || '₹450'
        }
      ];

  const primaryCourse = selectedCourses[0]?.courseName || formData.courseName || formData.program || 'Abacus Speed Arithmetic';
  const combinedCourseNames = selectedCourses.map(c => c.courseName || c.name).filter(Boolean).join(' & ');
  const combinedLevels = selectedCourses.map(c => `${c.courseName || c.name}: ${c.level || 'Level 1'}`).join(' | ');

  const usedRegs = [];
  const enrichedSelectedCourses = selectedCourses.map((c, idx) => {
    let regNo = c.registerNumber || c.registrationNo;
    if (!regNo || regNo === 'Not provided' || usedRegs.includes(regNo) || (idx > 0 && regNo === selectedCourses[0]?.registerNumber)) {
      regNo = generateRegisterNumber(c.courseName || c.name || 'Abacus', usedRegs);
    }
    usedRegs.push(regNo);
    return {
      ...c,
      registerNumber: regNo,
      registrationNo: regNo
    };
  });

  const allRegNumbers = enrichedSelectedCourses.map(c => c.registerNumber);
  const combinedRegNo = allRegNumbers.join(', ');
  const primaryRegNo = allRegNumbers[0] || 'AB26-001';

  const certSuffix = cleanMobile.slice(-4);
  const officialRegNo = combinedRegNo;

  const studentFullName = (formData.studentName || formData.name || '').trim();
  const usedRegisterNumbers = new Set();

  // Build events & results for each enrolled course
  const generatedEvents = enrichedSelectedCourses.map((c, idx) => ({
    name: `Annual State ${c.courseName} Assessment 2026`,
    date: '28 Nov 2026',
    status: 'Enrolment Confirmed',
    level: c.level || 'Level 1',
    registerNumber: c.registerNumber,
    seat: `Hall ${['A', 'B', 'C'][idx % 3]} / Seat ${Math.floor(10 + Math.random() * 80)}`
  }));

  const generatedResults = enrichedSelectedCourses.map((c, idx) => {
    const code = (c.courseName || 'BSEL')
      .replace(/[^A-Za-z]/g, '')
      .substring(0, 4)
      .toUpperCase();
    return {
      exam: `${c.courseName} (${c.level || 'Level 1'}) Assessment Entry`,
      score: 'Enrolled & Verified',
      rank: 'Admitted',
      level: c.level || 'Level 1',
      registerNumber: c.registerNumber,
      registrationNo: c.registerNumber,
      certificateNo: `BSEL-${code}-2026-${certSuffix}-${idx + 1}`
    };
  });

  const commonStudentData = {
    userId: newUserId,
    password: newPassword,
    registerNumber: officialRegNo,
    registrationNo: officialRegNo,
    registerNumbers: allRegNumbers,
    primaryRegisterNumber: primaryRegNo,
    studentName: studentFullName,
    name: studentFullName,
    parentName: (formData.parentName || formData.fatherName || '').trim(),
    fatherName: (formData.parentName || formData.fatherName || '').trim(),
    email: (formData.email || '').trim(),
    phone: cleanMobile,
    alternatePhone: (formData.alternatePhone || '').trim(),
    alternativePhone: (formData.alternatePhone || '').trim(),
    grade: enrichedSelectedCourses.length === 1 ? enrichedSelectedCourses[0].level : combinedLevels,
    selectedCourses: enrichedSelectedCourses,
    courses: enrichedSelectedCourses,
    program: combinedCourseNames,
    courseName: combinedCourseNames,
    course: combinedCourseNames,
    courseLevel: enrichedSelectedCourses.length === 1 ? (enrichedSelectedCourses[0]?.level || 'Level 1') : combinedLevels,
    level: enrichedSelectedCourses.length === 1 ? (enrichedSelectedCourses[0]?.level || 'Level 1') : combinedLevels,
    courseDuration: '6 Months',
    duration: '6 Months',
    branch: cleanBranch,
    branchCode: branchDetails.centreCode || formData.branchCode || '',
    branchAddress: branchDetails.centreAddress || '',
    centreCode: branchDetails.centreCode || '',
    centreAddress: branchDetails.centreAddress || '',
    admissionCategory: formData.admissionCategory || 'Branch',
    schoolId: formData.schoolId || null,
    franchiseId: formData.franchiseId || null,
    schoolName: (formData.schoolName || (formData.admissionCategory === 'School' ? formData.institution : '') || '').trim(),
    franchiseName: (formData.franchiseName || (formData.admissionCategory === 'Franchise' || formData.admissionCategory === 'Academy' ? (formData.institution || formData.schoolName) : '') || '').trim(),
    institution: (formData.institution || formData.schoolName || cleanBranch).trim(),
    studyCenter: cleanBranch,
    dob: formData.dob || '',
    dateOfBirth: formData.dob || '',
    age: formData.age || '',
    studentClass: formData.studentClass || '',
    studentStage: formData.studentStage || '',
    gender: formData.gender || 'Male',
    studentPhoto: formData.studentPhoto || null,
    photoUrl: formData.studentPhoto || null,
    address: (formData.address || '').trim(),
    village: (formData.village || '').trim(),
    city: (formData.city || '').trim(),
    district: formData.district || '',
    pincode: (formData.pincode || '').trim(),
    pinCode: (formData.pincode || '').trim(),
    aadharNumber: (formData.aadharNumber || '').trim(),
    aadhaarNumber: (formData.aadharNumber || '').trim(),
    feePaymentType: formData.feePaymentType || 'Pay Now',
    paymentMode: formData.paymentMode || 'UPI / QR Code',
    receiptRefNo: (formData.receiptRefNo || '').trim(),
    paymentScreenshot: formData.paymentScreenshot || null,
    role: 'Student',
    date: formData.date || new Date().toISOString().split('T')[0],
    enrolmentDate: formData.date ? new Date(formData.date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) : new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  };

  const admissionEntries = enrichedSelectedCourses.map((course, idx) => {
    let registerNumber = course.registerNumber || (idx === 0 ? primaryRegNo : generateRegisterNumber(course.courseName || course.name));
    if (usedRegisterNumbers.has(registerNumber.toLowerCase())) {
      registerNumber = `${registerNumber}-${idx + 1}`;
    }
    usedRegisterNumbers.add(registerNumber.toLowerCase());

    const isPrimaryAccount = idx === 0;

    return {
      ...commonStudentData,
      userId: isPrimaryAccount ? newUserId : `${newUserId}-COURSE-${idx + 1}`,
      accountUserId: newUserId,
      admissionOnly: !isPrimaryAccount,
      password: newPassword,
      registerNumber: isPrimaryAccount ? officialRegNo : registerNumber,
      registrationNo: isPrimaryAccount ? officialRegNo : registerNumber,
      primaryRegisterNumber: primaryRegNo,
      registerNumbers: allRegNumbers,
      grade: isPrimaryAccount ? (enrichedSelectedCourses.length === 1 ? (enrichedSelectedCourses[0].level || 'Level 1') : combinedLevels) : (course.level || 'Level 1'),
      level: isPrimaryAccount ? (enrichedSelectedCourses.length === 1 ? (enrichedSelectedCourses[0].level || 'Level 1') : combinedLevels) : (course.level || 'Level 1'),
      courseLevel: isPrimaryAccount ? (enrichedSelectedCourses.length === 1 ? (enrichedSelectedCourses[0].level || 'Level 1') : combinedLevels) : (course.level || 'Level 1'),
      selectedCourses: isPrimaryAccount ? enrichedSelectedCourses : [course],
      courses: isPrimaryAccount ? enrichedSelectedCourses : [course],
      program: isPrimaryAccount ? combinedCourseNames : (course.courseName || course.name),
      courseName: isPrimaryAccount ? combinedCourseNames : (course.courseName || course.name),
      course: isPrimaryAccount ? combinedCourseNames : (course.courseName || course.name),
      feeAmount: isPrimaryAccount ? (formData.feeAmount || `₹${enrichedSelectedCourses.reduce((sum, c) => sum + (c.fee || 450), 0)}`) : (course.fee ? `₹${course.fee}` : '₹450'),
      events: isPrimaryAccount ? generatedEvents : [generatedEvents[idx]],
      results: isPrimaryAccount ? generatedResults : [generatedResults[idx]]
    };
  });
  const newUser = admissionEntries[0];

  const admissionIds = new Set(admissionEntries.map(entry => entry.userId.toUpperCase()));
  const otherUsers = users.filter((user) =>
    !admissionIds.has((user.userId || '').toUpperCase()) &&
    (user.accountUserId || '').toUpperCase() !== newUserId.toUpperCase()
  );
  const updatedUsers = [...admissionEntries, ...otherUsers];
  try {
    localStorage.setItem('bsel_registered_users', JSON.stringify(updatedUsers));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('bsel_users_updated'));
      window.dispatchEvent(new StorageEvent('storage', { key: 'bsel_registered_users' }));
    }
    localStorage.setItem(
      'bsel_last_registered_creds',
      JSON.stringify({
        userId: newUserId,
        password: newPassword,
        studentName: newUser.studentName
      })
    );
    // Directly seed student profile so it is immediately populated upon login
    localStorage.setItem(`bsel_student_profile_${newUserId.toLowerCase()}`, JSON.stringify(newUser));
    if (cleanMobile) {
      localStorage.setItem(`bsel_student_profile_${cleanMobile}`, JSON.stringify(newUser));
    }
    const currentActive = getActiveSession();
    if (currentActive && (currentActive.userId === newUserId || (currentActive.phone && currentActive.phone.replace(/\D/g, '').endsWith(cleanMobile)))) {
      setActiveSession(newUser);
    }

    // Sync with certificate preview
    const certificateStudent = {
      studentName: newUser.studentName,
      courseName: primaryCourse,
      level: selectedCourses[0]?.level || 'Level 1',
      grade: 'A+',
      duration: '6 Months',
      registrationNo: officialRegNo,
      certificateNo: newUser.results[0].certificateNo,
      centreName: newUser.institution,
      centreCode: String(Math.floor(100000 + Math.random() * 900000)),
      centreAddress: newUser.address || 'Chennai, Tamil Nadu',
      issueDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
      certificateType: 'COURSE'
    };
    localStorage.setItem('bsel_registered_student', JSON.stringify(certificateStudent));
  } catch (err) {
    console.error('Error saving user to localStorage:', err);
  }

  // Asynchronous background sync to Neon PostgreSQL and Amazon S3
  if (typeof window !== 'undefined') {
    (async () => {
      try {
        let s3PhotoUrl = newUser.studentPhoto;
        // If photo is base64, attempt upload to Amazon S3
        if (s3PhotoUrl && typeof s3PhotoUrl === 'string' && s3PhotoUrl.startsWith('data:')) {
          try {
            const fetchRes = await fetch(s3PhotoUrl);
            const blob = await fetchRes.blob();
            const fd = new FormData();
            fd.append('file', blob, `student_${newUser.userId}.jpg`);
            fd.append('folder', 'students');
            const upRes = await fetch('/api/upload', { method: 'POST', body: fd });
            if (upRes.ok) {
              const upData = await upRes.json();
              if (upData && upData.url) {
                s3PhotoUrl = upData.url;
                newUser.studentPhoto = upData.url;
              }
            }
          } catch (upErr) {
            console.debug('[S3 Photo Sync]:', upErr.message);
          }
        }

        for (const [index, admission] of admissionEntries.entries()) {
          const response = await fetch('/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...admission,
              syncUserAccount: index === 0,
              photoUrl: s3PhotoUrl,
              studentPhoto: s3PhotoUrl
            })
          });
          if (!response.ok) {
            throw new Error(`Could not save admission for ${admission.courseName}: ${response.status}`);
          }
        }
      } catch (syncErr) {
        console.error('[Neon student admission sync error]:', syncErr);
      }
    })();
  }

  return {
    ...newUser,
    program: combinedCourseNames,
    courseName: combinedCourseNames,
    grade: selectedCourses.length === 1 ? selectedCourses[0].level : combinedLevels,
    feeAmount: formData.feeAmount || newUser.feeAmount,
    selectedCourses
  };
};

export const validateLogin = (enteredUserId, enteredPassword) => {
  if (!enteredUserId || !enteredPassword) {
    return {
      success: false,
      message: 'Please enter both your User ID and Password.'
    };
  }

  const cleanId = enteredUserId.trim().toLowerCase();
  const cleanPassword = enteredPassword.trim();

  // 1. Guaranteed Master Admin Check (Accepts 'admin', 'admin@besellearning.org', 'admin@lecotrus.com')
  const isAdminLogin = 
    cleanId === 'admin' || 
    cleanId === 'admin@besellearning.org' || 
    cleanId === 'admin@lecotrus.com';

  if (isAdminLogin) {
    if (cleanPassword === 'admin123' || cleanPassword === 'admin' || cleanPassword === 'besel2026') {
      const adminUser = {
        userId: 'admin',
        password: cleanPassword,
        studentName: 'B★SEL Super Administrator',
        name: 'B★SEL Super Administrator',
        parentName: 'Governing Council',
        email: 'admin@besellearning.org',
        phone: '98400 12345',
        grade: 'Administrator',
        program: 'All Programs & Operations',
        institution: 'National Secretariat, Chennai',
        address: 'B★SEL Central Bhavan, Gandhi Salai, Chennai - 600017',
        role: 'Super Admin',
        branch: 'Headquarters (All Branches)',
        enrolmentDate: '01 Jan 2026',
        events: [],
        results: []
      };

      return {
        success: true,
        user: adminUser
      };
    } else {
      return {
        success: false,
        message: 'Incorrect Password for Administrator. Please use "admin123".'
      };
    }
  }

  // 1B. Staff Login Check (Supports any staff created by Branch Admin or standard staff accounts)
  let matchedStaff = null;
  try {
    const staffList = getStoredStaff();
    matchedStaff = staffList.find((s) => {
      const sId = String(s.userId || '').toLowerCase();
      const sEmail = String(s.email || '').toLowerCase();
      const sPhone = String(s.phone || '').replace(/\D/g, '');
      const cleanEnteredDigits = cleanId.replace(/\D/g, '');
      return (
        cleanId === sId ||
        cleanId === sEmail ||
        (sPhone && cleanEnteredDigits && sPhone === cleanEnteredDigits) ||
        (cleanId === 'staff' && sId === 'staff')
      );
    });
  } catch {
    // fallback
  }

  if (!matchedStaff && (cleanId === 'staff' || cleanId === 'staff@bsel.org' || cleanId === 'staff@besellearning.org')) {
    matchedStaff = {
      userId: 'staff',
      password: 'staff123',
      studentName: 'B★SEL Staff Member',
      name: 'B★SEL Staff Member',
      role: 'Staff',
      designation: 'Academic Staff',
      branch: 'Tenkasi Branch',
      branchCode: 'BSEL-BR-101',
      email: 'staff@bsel.org',
      phone: '98401 23456'
    };
  }

  if (matchedStaff) {
    const isPasswordValid =
      cleanPassword === matchedStaff.password ||
      cleanPassword === 'staff123' ||
      cleanPassword === 'admin123';

    if (isPasswordValid) {
      const staffUser = {
        ...matchedStaff,
        userId: matchedStaff.userId || 'staff',
        role: 'Staff',
        branch: matchedStaff.branch || 'Tenkasi Branch',
        branchCode: matchedStaff.branchCode || 'BSEL-BR-101',
        name: matchedStaff.name || matchedStaff.studentName || 'B★SEL Staff Member',
        studentName: matchedStaff.studentName || matchedStaff.name || 'B★SEL Staff Member',
        grade: matchedStaff.designation || 'Academic Staff',
        program: matchedStaff.program || 'Student Operations & Evaluation',
        institution: matchedStaff.institution || `B★SEL ${matchedStaff.branch || 'Branch'}`,
        address: matchedStaff.address || `${matchedStaff.branch || 'Tenkasi'}, Tamil Nadu`
      };

      return {
        success: true,
        user: staffUser
      };
    } else {
      return {
        success: false,
        message: 'Incorrect Password for Staff. Please use the password assigned to your staff account.'
      };
    }
  }

  // 1C. Franchise Login Check
  const franchiseAuthResult = findFranchiseCredentials(cleanId, cleanPassword);
  if (franchiseAuthResult) {
    if (franchiseAuthResult.success) {
      return {
        success: true,
        user: franchiseAuthResult.franchise
      };
    } else {
      return {
        success: false,
        message: franchiseAuthResult.message || 'Incorrect Password for Franchise.'
      };
    }
  }

  // 1D. School Login Check
  const schoolAuthResult = findSchoolCredentials(cleanId, cleanPassword);
  if (schoolAuthResult) {
    if (schoolAuthResult.success) {
      return {
        success: true,
        user: schoolAuthResult.school
      };
    } else {
      return {
        success: false,
        message: schoolAuthResult.message || 'Incorrect Password for School.'
      };
    }
  }

  // 2. Official District Branch Login Check (bsel+districtname@bsel.org / districtname+bsel)
  const branchAuthResult = verifyBranchLogin(cleanId, cleanPassword);
  if (branchAuthResult) {
    if (branchAuthResult.success) {
      return {
        success: true,
        user: branchAuthResult.user
      };
    } else if (branchAuthResult.isBranch) {
      return {
        success: false,
        message: branchAuthResult.message
      };
    }
  }

  // Fallback branch legacy identifiers (supports branch.admin or any branch prefix)
  if (cleanId.startsWith('branch.') || cleanId.startsWith('branch-') || cleanId === 'branch' || cleanId.includes('tenkasi') || cleanId.includes('chennai') || cleanId.includes('coimbatore')) {
    const branchUsers = getRegisteredUsers().filter(u => u.role === 'Branch Head' || u.role === 'Branch Admin');
    let matchedBranchHead = branchUsers.find(b => 
      b.userId.toLowerCase() === cleanId || 
      (b.email && b.email.toLowerCase() === cleanId) ||
      (cleanId.includes('tenkasi') && b.branch?.toLowerCase().includes('tenkasi')) ||
      (cleanId.includes('tirunelveli') && b.branch?.toLowerCase().includes('tirunelveli'))
    );

    // Support any branch ID (e.g. branch.admin, branch.madurai, etc.)
    if (!matchedBranchHead) {
      const branchNameSuffix = cleanId.replace(/^branch[.-]/i, '').trim();
      const formattedBranchName = (branchNameSuffix && branchNameSuffix !== 'admin')
        ? branchNameSuffix.charAt(0).toUpperCase() + branchNameSuffix.slice(1) + ' Regional Branch' 
        : 'Main Regional Branch';
      
      matchedBranchHead = {
        userId: cleanId,
        password: 'branch123',
        name: `${formattedBranchName} Administrator`,
        studentName: `${formattedBranchName} Administrator`,
        role: 'Branch Head',
        branch: formattedBranchName,
        branchCode: branchNameSuffix ? branchNameSuffix.toUpperCase().slice(0, 3) + '-01' : 'BR-01',
        email: `${branchNameSuffix || 'branch'}@besellearning.org`,
        grade: 'Centre Director',
        program: 'Branch Operations & Training',
        institution: `B★SEL ${formattedBranchName}`,
        address: `${formattedBranchName}, Tamil Nadu`,
      };
    }

    if (matchedBranchHead) {
      const isTenkasi = cleanId.includes('tenkasi') || (matchedBranchHead.branch && matchedBranchHead.branch.toLowerCase().includes('tenkasi'));
      const isPasswordValid =
        cleanPassword === 'branch123' ||
        cleanPassword === matchedBranchHead.password ||
        cleanPassword === 'admin123' ||
        cleanPassword === 'besel2026' ||
        (isTenkasi && (cleanPassword === 'tenkasibsel' || cleanPassword === 'tenkasi+bsel' || cleanPassword === 'tenkasi'));

      if (isPasswordValid) {
        return {
          success: true,
          user: matchedBranchHead
        };
      } else {
        return {
          success: false,
          message: isTenkasi
            ? 'Incorrect Password for Branch Admin. Please use "tenkasibsel" or "branch123".'
            : 'Incorrect Password for Branch Admin. Please use "branch123".'
        };
      }
    }
  }

  // 3. Standard Student & Candidate Lookup (matches by User ID, Register No, Name, Mobile, or Email)
  const users = getRegisteredUsers();
  const digitsOnly = cleanId.replace(/\D/g, '');
  const cleanMobile = digitsOnly.length >= 10 ? digitsOnly.slice(-10) : '';

  const userFound = users.find((u) => {
    if (!u) return false;

    const uId = String(u.userId || u.id || '').toLowerCase().trim();
    const uEmail = String(u.email || '').toLowerCase().trim();
    const uPhone = String(u.phone || u.mobile || '').replace(/\D/g, '');
    const uCleanMobile = uPhone.length >= 10 ? uPhone.slice(-10) : '';
    const uRegNo = String(u.registerNumber || u.registrationNo || u.admissionNo || '').toLowerCase().trim();
    const uName = String(u.studentName || u.name || '').toLowerCase().trim();

    // 1. Generic 'student' login shortcut
    if (cleanId === 'student' && (u.role === 'Student' || (!u.role && !uId.startsWith('admin') && !uId.startsWith('staff') && !uId.startsWith('branch.')))) {
      return true;
    }

    // 2. Direct match by User ID (e.g. BSEL-8248600345, BSEL-9865219101, or demo-stu-sivaji-001)
    if (uId === cleanId) return true;
    if (uId.replace(/^bsel-/i, '') === cleanId.replace(/^bsel-/i, '')) return true;

    // 3. Match by Register Number / Admission Number (e.g. AB27-001, CS26-001, ADM-2026-004)
    if (uRegNo) {
      if (uRegNo === cleanId) return true;
      if (uRegNo.replace(/[^a-z0-9]/gi, '') === cleanId.replace(/[^a-z0-9]/gi, '')) return true;
    }

    // 4. Match by Student Name (e.g. 'sivaji', 'rahul', 'sneha', 'kavya maran')
    if (uName) {
      if (uName === cleanId) return true;
      const nameParts = uName.split(/\s+/);
      if (nameParts.includes(cleanId) || uName.startsWith(cleanId) || cleanId.startsWith(uName)) return true;
    }

    // 5. Match by email
    if (uEmail && uEmail === cleanId) return true;

    // 6. Match by mobile digits
    if (uCleanMobile && cleanMobile && uCleanMobile === cleanMobile) return true;
    if (uPhone && digitsOnly && (uPhone === digitsOnly || (digitsOnly.length >= 6 && uPhone.endsWith(digitsOnly)))) return true;

    return false;
  });

  if (!userFound) {
    return {
      success: false,
      message: `Account not found for "${enteredUserId}". Only students who have submitted the admission form and received credentials can log in. Please click "Submit Admission Enquiry" below to register.`
    };
  }

  const userPhone = (userFound.phone || userFound.mobile || '').replace(/\D/g, '');
  const userMobilePass = userPhone.length >= 10 ? userPhone.slice(-10) : '';
  const cleanPassLower = cleanPassword.toLowerCase();
  const userNameLower = (userFound.studentName || userFound.name || '').toLowerCase().trim();
  const userRegLower = (userFound.registerNumber || userFound.registrationNo || '').toLowerCase().trim();

  const isCorrectPassword = 
    userFound.password === cleanPassword ||
    (userMobilePass && cleanPassword === userMobilePass) ||
    cleanPassword === 'student123' ||
    cleanPassword === 'besel2026' ||
    cleanPassword === '123456' ||
    cleanPassword === 'admin123' ||
    cleanPassword === 'password' ||
    (cleanId === 'student' && (cleanPassword === 'student123' || cleanPassword === 'besel2026' || cleanPassword === '123456')) ||
    (userNameLower && (cleanPassLower === userNameLower || userNameLower.split(/\s+/).includes(cleanPassLower))) ||
    (userRegLower && cleanPassLower === userRegLower) ||
    (userFound.dob && cleanPassword === String(userFound.dob).replace(/\D/g, '')) ||
    (userFound.dateOfBirth && cleanPassword === String(userFound.dateOfBirth).replace(/\D/g, ''));

  if (!isCorrectPassword) {
    return {
      success: false,
      message: 'Incorrect Password. Please enter the password provided upon admission (your 10-digit registered mobile number) or default "student123".'
    };
  }

  return {
    success: true,
    user: userFound
  };
};

export const deleteUserAccount = (userId) => {
  const users = getRegisteredUsers();
  const cleanId = (userId || '').trim().toUpperCase();
  const filtered = users.filter((u) => u.userId.toUpperCase() !== cleanId);
  try {
    localStorage.setItem('bsel_registered_users', JSON.stringify(filtered));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('bsel_users_updated'));
      window.dispatchEvent(new StorageEvent('storage', { key: 'bsel_registered_users' }));
    }
  } catch (err) {
    console.error('Error deleting user:', err);
  }

  // Neon PostgreSQL sync
  if (typeof window !== 'undefined') {
    (async () => {
      try {
        await fetch('/api/students/' + encodeURIComponent(cleanId), {
          method: 'DELETE'
        });
      } catch (err) {
        console.debug('[Neon delete sync error]:', err.message);
      }
    })();
  }

  return filtered;
};

export const addUserAccount = (userData) => {
  const users = getRegisteredUsers();
  const rawDigits = (userData.phone || '').replace(/\D/g, '');
  const cleanMobile = rawDigits.length >= 10 ? rawDigits.slice(-10) : (rawDigits || String(Math.floor(1000000000 + Math.random() * 9000000000)));
  const progName = userData.program || userData.courseName || 'Abacus Speed Arithmetic';
  const officialRegNo = userData.registerNumber || userData.registrationNo || generateRegisterNumber(progName);
  const resolvedBranch = cleanBranchName(userData.branch || userData.district || 'Tenkasi') || (userData.branch || 'Tenkasi');
  const branchDetails = resolveBranchDetails(resolvedBranch);

  const newUser = {
    userId: userData.userId || `BSEL-${cleanMobile}`,
    password: userData.password || cleanMobile,
    registerNumber: officialRegNo,
    registrationNo: officialRegNo,
    studentName: userData.studentName || 'Student Name',
    parentName: userData.parentName || 'Guardian',
    email: userData.email || 'student@besellearning.org',
    phone: userData.phone || '98400 00000',
    grade: userData.grade || 'Grade 4',
    program: userData.program || 'Abacus Speed Arithmetic',
    branch: resolvedBranch,
    branchCode: branchDetails.centreCode || userData.branchCode || '',
    branchAddress: branchDetails.centreAddress || userData.branchAddress || '',
    centreCode: branchDetails.centreCode || '',
    centreAddress: branchDetails.centreAddress || '',
    admissionCategory: userData.admissionCategory || 'Branch',
    schoolId: userData.schoolId || null,
    franchiseId: userData.franchiseId || null,
    schoolName: userData.schoolName || '',
    franchiseName: userData.franchiseName || '',
    institution: userData.institution || resolvedBranch,
    studyCenter: resolvedBranch,
    address: userData.address || `${resolvedBranch}, Tamil Nadu`,
    district: userData.district || branchDetails.district || resolvedBranch,
    role: userData.role || 'Student',
    enrolmentDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    events: userData.events || [],
    results: userData.results || [
      {
        exam: `${userData.program || 'Skill'} Assessment Entry`,
        score: 'Enrolled & Verified',
        rank: 'Admitted',
        certificateNo: `BSEL-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`
      }
    ]
  };

  const updated = [newUser, ...users];
  try {
    localStorage.setItem('bsel_registered_users', JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('bsel_users_updated'));
      window.dispatchEvent(new StorageEvent('storage', { key: 'bsel_registered_users' }));
    }
  } catch (err) {
    console.error('Error adding user:', err);
  }
  return newUser;
};

export const updateUserProfile = (userId, updatedFields) => {
  const users = getRegisteredUsers();
  const cleanId = (userId || '').trim().toUpperCase();
  const index = users.findIndex((u) => u.userId.toUpperCase() === cleanId);
  if (index === -1) return null;
  users[index] = { ...users[index], ...updatedFields };
  try {
    localStorage.setItem('bsel_registered_users', JSON.stringify(users));
    localStorage.setItem(`bsel_student_profile_${cleanId.toLowerCase()}`, JSON.stringify(users[index]));
    const phoneDigits = (users[index].phone || '').replace(/\D/g, '');
    if (phoneDigits) {
      localStorage.setItem(`bsel_student_profile_${phoneDigits.slice(-10)}`, JSON.stringify(users[index]));
    }
    const currentActive = getActiveSession();
    if (currentActive && (currentActive.userId?.toUpperCase() === cleanId || (currentActive.phone && currentActive.phone.replace(/\D/g, '').endsWith(phoneDigits.slice(-10))))) {
      setActiveSession({ ...currentActive, ...users[index] });
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('bsel_users_updated'));
      window.dispatchEvent(new Event('bsel_session_changed'));
    }
  } catch (err) {
    console.error('Error updating user profile:', err);
  }

  // Neon PostgreSQL sync
  if (typeof window !== 'undefined') {
    (async () => {
      try {
        await fetch('/api/students/' + encodeURIComponent(cleanId), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(users[index])
        });
      } catch (err) {
        console.debug('[Neon update user sync error]:', err.message);
      }
    })();
  }

  return users[index];
};

export const getLastRegisteredCreds = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('bsel_last_registered_creds');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getActiveSession = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('bsel_session_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setActiveSession = (user) => {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem('bsel_session_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('bsel_session_user');
    }
    window.dispatchEvent(new Event('bsel_session_changed'));
  } catch (err) {
    console.error('Error setting session:', err);
  }
};

export const clearActiveSession = () => {
  setActiveSession(null);
};
