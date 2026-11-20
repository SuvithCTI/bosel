// Official 38 Districts of Tamil Nadu (for Address & General District Lookups)
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
  'Tiruchirappalli',
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

// The strictly authorized B★SEL Branches: Tenkasi and Tirunelveli
export const AUTHORIZED_BRANCHES = [
  'Tenkasi',
  'Tirunelveli'
];

export const DISTRICT_BRANCH_OPTIONS = [
  { value: 'Tenkasi', label: 'Tenkasi Branch', district: 'Tenkasi' },
  { value: 'Tirunelveli', label: 'Tirunelveli Branch', district: 'Tirunelveli' }
];

// Function to return strictly the authorized branches
export const getAllDistrictBranches = () => {
  return DISTRICT_BRANCH_OPTIONS;
};
