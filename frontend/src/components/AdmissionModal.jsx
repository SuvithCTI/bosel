import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  GraduationCap, 
  CheckCircle2, 
  KeyRound, 
  Copy, 
  Check, 
  Lock, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck, 
  Eye, 
  EyeOff, 
  ChevronDown, 
  ChevronUp,
  Upload,
  Building2,
  School,
  MapPin,
  CreditCard,
  QrCode,
  User,
  Loader2,
  ExternalLink,
  Plus,
  BookOpen,
  Camera,
  RotateCcw,
  Crop,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { registerStudentAccount, generateRegisterNumber, isPhoneNumberRegistered } from '../utils/authStorage';
import { getStoredCourses } from '../data/coursesData';
import { replacePhotoBackground } from '../utils/photoSegmentation';
import { ACADEMIC_STAGES, getAcademicStageFromAge } from '../utils/academicStages';

const TAMIL_NADU_DISTRICTS = [
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
  'Tiruchirappalli (Trichy)',
  'Tirunelveli',
  'Tirupathur',
  'Tiruppur',
  'Tiruvallur',
  'Tiruvannamalai',
  'Tiruvarur',
  'Vellore',
  'Viluppuram',
  'Virudhunagar',
  'Other District / State'
];

// Offline instant lookup mapping for Tamil Nadu PIN codes (0ms response)
const TN_PIN_SPECIFIC = {
  '627811': { district: 'Tenkasi', city: 'Surandai', locality: 'Surandai' },
  '627808': { district: 'Tenkasi', city: 'Sankarankovil', locality: 'Sankarankovil' },
  '627859': { district: 'Tenkasi', city: 'Shencottai', locality: 'Shencottai' },
  '627802': { district: 'Tenkasi', city: 'Kadayanallur', locality: 'Kadayanallur' },
  '627814': { district: 'Tenkasi', city: 'Tenkasi', locality: 'Tenkasi Town' },
  '627803': { district: 'Tenkasi', city: 'Alangulam', locality: 'Alangulam' },
  '627805': { district: 'Tenkasi', city: 'Puliyangudi', locality: 'Puliyangudi' },
  '627807': { district: 'Tenkasi', city: 'Kuruvikulam', locality: 'Kuruvikulam' },
  '627851': { district: 'Tenkasi', city: 'Ayikudi', locality: 'Ayikudi' },
  '627861': { district: 'Tenkasi', city: 'Courtallam', locality: 'Courtallam' },
  '627812': { district: 'Tenkasi', city: 'Pavoorchatram', locality: 'Pavoorchatram' },
  '627813': { district: 'Tenkasi', city: 'Sivagiri', locality: 'Sivagiri' },
  '627809': { district: 'Tenkasi', city: 'Rayagiri', locality: 'Rayagiri' },
  '627806': { district: 'Tenkasi', city: 'Karivalamvandanallur', locality: 'Karivalam' },
  '627817': { district: 'Tenkasi', city: 'Veerakeralampudur', locality: 'VK Pudur' },
  '627860': { district: 'Tenkasi', city: 'Sambavar Vadagarai', locality: 'Sambavar' },
  '627852': { district: 'Tenkasi', city: 'Elathur', locality: 'Elathur' },
  '627855': { district: 'Tenkasi', city: 'Ilanji', locality: 'Ilanji' },
  '627857': { district: 'Tenkasi', city: 'Panpoli', locality: 'Panpoli' },
  '627858': { district: 'Tenkasi', city: 'Pudur', locality: 'Pudur' },
  '627001': { district: 'Tirunelveli', city: 'Tirunelveli', locality: 'Tirunelveli Town' },
  '627002': { district: 'Tirunelveli', city: 'Tirunelveli', locality: 'Tirunelveli Junction' },
  '627003': { district: 'Tirunelveli', city: 'Palayamkottai', locality: 'Palayamkottai' },
  '627005': { district: 'Tirunelveli', city: 'Palayamkottai', locality: 'Santhi Nagar' },
  '627007': { district: 'Tirunelveli', city: 'Tirunelveli', locality: 'Pettai' },
  '627011': { district: 'Tirunelveli', city: 'Tirunelveli', locality: 'Thatchanallur' },
  '627401': { district: 'Tirunelveli', city: 'Ambasamudram', locality: 'Ambasamudram' },
  '627105': { district: 'Tirunelveli', city: 'Vallioor', locality: 'Vallioor' },
  '627117': { district: 'Tirunelveli', city: 'Radhapuram', locality: 'Radhapuram' },
  '627111': { district: 'Tirunelveli', city: 'Panagudi', locality: 'Panagudi' },
  '627415': { district: 'Tirunelveli', city: 'Cheranmahadevi', locality: 'Cheranmahadevi' },
  '627108': { district: 'Tirunelveli', city: 'Nanguneri', locality: 'Nanguneri' },
  '628001': { district: 'Thoothukudi', city: 'Thoothukudi', locality: 'Tuticorin' },
  '628203': { district: 'Thoothukudi', city: 'Tiruchendur', locality: 'Tiruchendur' },
  '628501': { district: 'Thoothukudi', city: 'Kovilpatti', locality: 'Kovilpatti' },
  '629001': { district: 'Kanyakumari', city: 'Nagercoil', locality: 'Nagercoil' },
  '629702': { district: 'Kanyakumari', city: 'Kanyakumari', locality: 'Kanyakumari' },
  '625001': { district: 'Madurai', city: 'Madurai', locality: 'Madurai' },
  '641001': { district: 'Coimbatore', city: 'Coimbatore', locality: 'Coimbatore' },
  '642001': { district: 'Coimbatore', city: 'Pollachi', locality: 'Pollachi' },
  '636001': { district: 'Salem', city: 'Salem', locality: 'Salem' },
  '638001': { district: 'Erode', city: 'Erode', locality: 'Erode' },
  '620001': { district: 'Tiruchirappalli (Trichy)', city: 'Tiruchirappalli', locality: 'Trichy' },
  '600001': { district: 'Chennai', city: 'Chennai', locality: 'Chennai' }
};

const TN_PREFIX_DISTRICTS = {
  '600': { district: 'Chennai', city: 'Chennai' },
  '601': { district: 'Tiruvallur', city: 'Tiruvallur' },
  '602': { district: 'Tiruvallur', city: 'Poonamallee' },
  '603': { district: 'Chengalpattu', city: 'Chengalpattu' },
  '604': { district: 'Viluppuram', city: 'Tindivanam' },
  '605': { district: 'Viluppuram', city: 'Viluppuram' },
  '606': { district: 'Kallakurichi', city: 'Kallakurichi' },
  '607': { district: 'Cuddalore', city: 'Cuddalore' },
  '608': { district: 'Cuddalore', city: 'Chidambaram' },
  '609': { district: 'Mayiladuthurai', city: 'Mayiladuthurai' },
  '610': { district: 'Tiruvarur', city: 'Tiruvarur' },
  '611': { district: 'Nagapattinam', city: 'Nagapattinam' },
  '612': { district: 'Thanjavur', city: 'Kumbakonam' },
  '613': { district: 'Thanjavur', city: 'Thanjavur' },
  '614': { district: 'Thanjavur', city: 'Pattukkottai' },
  '620': { district: 'Tiruchirappalli (Trichy)', city: 'Tiruchirappalli' },
  '621': { district: 'Ariyalur', city: 'Ariyalur' },
  '622': { district: 'Pudukkottai', city: 'Pudukkottai' },
  '623': { district: 'Ramanathapuram', city: 'Ramanathapuram' },
  '624': { district: 'Dindigul', city: 'Dindigul' },
  '625': { district: 'Madurai', city: 'Madurai' },
  '626': { district: 'Virudhunagar', city: 'Virudhunagar' },
  '627': { district: 'Tenkasi', city: 'Tenkasi' },
  '628': { district: 'Thoothukudi', city: 'Thoothukudi' },
  '629': { district: 'Kanyakumari', city: 'Nagercoil' },
  '630': { district: 'Sivaganga', city: 'Karaikudi' },
  '631': { district: 'Ranipet', city: 'Ranipet' },
  '632': { district: 'Vellore', city: 'Vellore' },
  '635': { district: 'Krishnagiri', city: 'Krishnagiri' },
  '636': { district: 'Salem', city: 'Salem' },
  '637': { district: 'Namakkal', city: 'Namakkal' },
  '638': { district: 'Erode', city: 'Erode' },
  '639': { district: 'Karur', city: 'Karur' },
  '641': { district: 'Coimbatore', city: 'Coimbatore' },
  '642': { district: 'Coimbatore', city: 'Pollachi' },
  '643': { district: 'Nilgiris', city: 'Udhagamandalam (Ooty)' }
};

const lookupTamilNaduPincode = (pin) => {
  if (!pin || pin.length < 3) return null;
  if (TN_PIN_SPECIFIC[pin]) return TN_PIN_SPECIFIC[pin];
  if (pin.startsWith('6278') || pin.startsWith('6277') || pin.startsWith('6275')) {
    return { district: 'Tenkasi', city: 'Tenkasi', locality: 'Tenkasi' };
  }
  const prefix3 = pin.slice(0, 3);
  if (TN_PREFIX_DISTRICTS[prefix3]) {
    return TN_PREFIX_DISTRICTS[prefix3];
  }
  return null;
};

const BSEL_PROGRAMS = [
  'Abacus Speed Arithmetic',
  'Handwriting Excellence & Calligraphy',
  'Phonics & Early Literacy',
  'Drawing & Creative Fine Arts',
  'Memory Techniques & Brain Training',
  'Bharatanatyam & Classical Dance',
  'MS Office & Digital Productivity',
  'HTML & Web Structure',
  'CSS & Web Styling',
  'Python Programming Basics',
  'Computer Fundamentals & Typing',
  'Photoshop & Graphic Design',
  'AI & Future Technology Concepts',
  'Canva Digital Design & Marketing'
];

// Helper to extract available levels for a given course
const getLevelsForCourse = (courseName, coursesList = []) => {
  if (!courseName) return ['Level 1 (Foundation)', 'Level 2', 'Level 3'];
  const cleanName = courseName.toLowerCase();
  const matched = coursesList.find(
    c => (c.fullName && c.fullName.toLowerCase() === cleanName) ||
         (c.name && c.name.toLowerCase() === cleanName) ||
         cleanName.includes((c.name || '').toLowerCase())
  );

  if (matched && Array.isArray(matched.curriculum) && matched.curriculum.length > 0) {
    const titles = matched.curriculum
      .map(cur => (typeof cur === 'string' ? cur : cur.title))
      .filter(Boolean);
    if (titles.length > 0) return titles;
  }

  if (cleanName.includes('abacus')) {
    return [
      'Level 1: Bead Fundamentals & Direct Operations',
      'Level 2: Small Friend Concept (+5 and -5 Formulas)',
      'Level 3: Big Friend Concept (+10 and -10 Formulas)',
      'Level 4: Combination Formulas (Mixed Operations)',
      'Level 5: Multiplication Fundamentals (2D x 1D & 3D x 1D)',
      'Level 6: Division Principles & Decimals',
      'Level 7: Advanced Multiplication & Long Division',
      'Level 8: Negative Numbers & Square Roots',
      'Level 9: Grandmaster Speed & Decimal Power'
    ];
  }
  if (cleanName.includes('handwriting')) {
    return [
      'Level 1: Posture, Stroke & Print Basics',
      'Level 2: Cursive Rhythm, Spacing & Joining',
      'Level 3: Speed Writing & Exam Calligraphy'
    ];
  }
  if (cleanName.includes('phonics')) {
    return [
      'Level 1: 42 Core Phonemes & CVC Blending',
      'Level 2: Digraphs, Diphthongs & Sight Words',
      'Level 3: Reading Fluency & Expression',
      'Level 4: Advanced Syllabification & Lexicon'
    ];
  }
  if (cleanName.includes('drawing') || cleanName.includes('art')) {
    return [
      'Level 1: Shapes, Lines & Proportions',
      'Level 2: Colour Theory & Shading Techniques',
      'Level 3: Perspective, Landscapes & Portraits',
      'Level 4: Portfolio Art & Creative Exhibition'
    ];
  }
  if (cleanName.includes('python') || cleanName.includes('coding')) {
    return [
      'Level 1: Syntax, Variables & Control Flow',
      'Level 2: Functions, Data Structures & Logic',
      'Level 3: OOP, Projects & Algorithm Drills'
    ];
  }
  return [
    'Level 1 (Foundation)',
    'Level 2 (Intermediate)',
    'Level 3 (Advanced)',
    'Level 4 (Mastery)'
  ];
};

const parseCourseFee = (courseName, coursesList = []) => {
  if (!courseName) return 450;
  const cleanName = courseName.toLowerCase();
  const matched = coursesList.find(
    c => (c.fullName && c.fullName.toLowerCase() === cleanName) ||
         (c.name && c.name.toLowerCase() === cleanName) ||
         cleanName.includes((c.name || '').toLowerCase())
  );
  if (matched) {
    if (typeof matched.feeAmount === 'number' && !isNaN(matched.feeAmount)) {
      return matched.feeAmount;
    }
    if (matched.fee) {
      const num = parseInt(String(matched.fee).replace(/[^0-9]/g, ''), 10);
      if (!isNaN(num) && num > 0) return num;
    }
  }
  return 450;
};

export default function AdmissionModal({ 
  isOpen, 
  onClose, 
  setActivePage,
  initialProgram = null,
  initialFee = null,
  initialBranch = null,
  lockBranch = false,
  skipPayment = false,
  onSuccess = null
}) {
  const [coursesList, setCoursesList] = useState(() => getStoredCourses());

  useEffect(() => {
    const handleCourses = () => setCoursesList(getStoredCourses());
    window.addEventListener('bsel_courses_updated', handleCourses);
    return () => {
      window.removeEventListener('bsel_courses_updated', handleCourses);
    };
  }, []);

  const dynamicProgramNames = coursesList.map(c => c.fullName || c.name);
  const availablePrograms = dynamicProgramNames.length > 0 ? dynamicProgramNames : BSEL_PROGRAMS;

  // 2. Branch: every district name
  const availableBranches = initialBranch && !TAMIL_NADU_DISTRICTS.includes(initialBranch)
    ? [initialBranch, ...TAMIL_NADU_DISTRICTS]
    : TAMIL_NADU_DISTRICTS;

  const initialCourse = initialProgram || availablePrograms[0] || 'Abacus Speed Arithmetic';
  const defaultBranch = initialBranch || (availableBranches.includes('Tenkasi') ? 'Tenkasi' : availableBranches[0]);
  const initialLevel = getLevelsForCourse(initialCourse, coursesList)[0] || 'Level 1';
  const initialSingleFee = parseCourseFee(initialCourse, coursesList);
  const initialRegNumber = generateRegisterNumber(initialCourse);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], // 1. Date
    registerNumber: initialRegNumber, // 2. Register number [non-editable]
    branch: defaultBranch, // 3. Branch
    admissionCategory: 'Branch', // 'Branch' | 'Academy' | 'School'
    institution: defaultBranch, // School / Academy / Branch Name
    schoolName: defaultBranch,
    courseName: initialCourse, // 4. Course Name (kept for backward compat)
    selectedCourses: [
      {
        courseName: initialCourse,
        level: initialLevel,
        fee: initialSingleFee,
        registerNumber: initialRegNumber
      }
    ],
    studentName: '', // 7. Student name
    parentName: '', // Father / Guardian name
    fatherName: '',
    dob: '', // 8. Date of Birth
    age: '', // 9. Age
    studentClass: '', // Auto calculated from age
    studentStage: '', // Auto calculated stage
    gender: 'Male', // 9. Gender
    phone: '', // 11. Phone
    alternatePhone: '', // 11. Alternate ph
    studentPhoto: null, // 12. Student photo
    photoPreview: null,
    address: '', // 13. Address
    village: '', // 14. Village
    city: '', // 14. City
    district: 'Tenkasi', // 14. District
    pincode: '', // 14. Pin
    feePaymentType: 'Pay Now', // 15. Admission fee payment: pay now / later
    feeAmount: initialFee || `₹${initialSingleFee}`, // 16. Admission fee amount
    paymentMode: 'UPI / QR Code', // 17. Payment mode
    receiptRefNo: '', // 18. Receipt / Reference Num
    paymentScreenshot: null, // 19. Payment Screenshot (upload)
    screenshotPreview: null,
    aadharNumber: '', // 20. Aadhar Number
    declaration: false // 21. Declaration
  });

  const [isCourseLocked, setIsCourseLocked] = useState(Boolean(initialProgram));
  const [formStep, setFormStep] = useState(1); // Step 1: Candidate Details | Step 2: Fees, Payment & Declaration
  const [submitted, setSubmitted] = useState(false);
  const [createdAccount, setCreatedAccount] = useState(null);
  const [showPassword, setShowPassword] = useState(true);

  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
  const [districtSearch, setDistrictSearch] = useState('');
  const [districtError, setDistrictError] = useState(false);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const [branchSearch, setBranchSearch] = useState('');
  const [isOtherBranch, setIsOtherBranch] = useState(false);
  const [customBranchName, setCustomBranchName] = useState('');
  const branchDropdownRef = useRef(null);
  const [phoneError, setPhoneError] = useState('');
  const [photoError, setPhotoError] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeMessage, setPincodeMessage] = useState('');
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [cameraFacingMode, setCameraFacingMode] = useState('user'); // 'user' (front) | 'environment' (back)
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const districtDropdownRef = useRef(null);
  const slipRef = useRef(null);
  const modalBodyRef = useRef(null);

  // Photo Editor State
  const [isPhotoEditorOpen, setIsPhotoEditorOpen] = useState(false);
  const [editorBgColor, setEditorBgColor] = useState('original');
  const [originalPhotoSrc, setOriginalPhotoSrc] = useState(null);
  const [editorPreviewUrl, setEditorPreviewUrl] = useState(null);
  const [isProcessingBg, setIsProcessingBg] = useState(false);
  const editorImageRef = useRef(null);
  const [paymentGatewayStatus, setPaymentGatewayStatus] = useState('idle'); // 'idle' | 'processing' | 'success'
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  // Sync with initial props whenever modal opens or props change
  useEffect(() => {
    if (initialProgram) {
      const pLevels = getLevelsForCourse(initialProgram, coursesList);
      const pFee = parseCourseFee(initialProgram, coursesList);
      setFormData(prev => ({
        ...prev,
        courseName: initialProgram,
        registerNumber: generateRegisterNumber(initialProgram),
        feeAmount: initialFee || `₹${pFee}`,
        selectedCourses: [
          {
            courseName: initialProgram,
            level: pLevels[0] || 'Level 1',
            fee: pFee
          }
        ]
      }));
      setIsCourseLocked(true);
    } else {
      setIsCourseLocked(false);
    }
    if (initialBranch) {
      setFormData(prev => ({
        ...prev,
        branch: initialBranch
      }));
    }
    if (initialFee && !initialProgram) {
      setFormData(prev => ({
        ...prev,
        feeAmount: initialFee
      }));
    }
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        date: new Date().toISOString().split('T')[0],
        ...(skipPayment ? { admissionCategory: 'School' } : {})
      }));
    }
  }, [initialProgram, initialFee, initialBranch, isOpen, coursesList, skipPayment]);

  // Click outside listener for district and branch dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (districtDropdownRef.current && !districtDropdownRef.current.contains(event.target)) {
        setDistrictDropdownOpen(false);
      }
      if (branchDropdownRef.current && !branchDropdownRef.current.contains(event.target)) {
        setBranchDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setFormStep(1);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close camera whenever modal is closed
  useEffect(() => {
    if (!isOpen) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setIsCameraOpen(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredDistricts = TAMIL_NADU_DISTRICTS.filter((d) =>
    d.toLowerCase().includes(districtSearch.toLowerCase().trim())
  );

  const allBranchOptions = availableBranches.filter((b) => b !== 'Other');

  const filteredBranches = allBranchOptions.filter((b) => {
    const term = branchSearch.toLowerCase().trim();
    return b.toLowerCase().includes(term);
  });

  // Auto calculate age from Date of Birth & determine Academic Stage (Field 5 -> 6 & Category)
  const handleDobChange = (e) => {
    const dobVal = e.target.value;
    let computedAge = '';
    let autoClass = '';
    let autoStage = '';
    if (dobVal) {
      const birth = new Date(dobVal);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      if (age >= 0 && age <= 100) {
        computedAge = String(age);
        const stageInfo = getAcademicStageFromAge(age);
        autoClass = stageInfo.className;
        autoStage = stageInfo.stage;
      }
    }
    setFormData(prev => ({ 
      ...prev, 
      dob: dobVal, 
      age: computedAge,
      studentClass: autoClass || prev.studentClass,
      studentStage: autoStage || prev.studentStage
    }));
  };

  // Handle manual Age change and auto-set Academic Stage
  const handleAgeChange = (e) => {
    const ageVal = e.target.value;
    const stageInfo = getAcademicStageFromAge(ageVal);
    setFormData(prev => ({
      ...prev,
      age: ageVal,
      studentClass: stageInfo.className || prev.studentClass,
      studentStage: stageInfo.stage || prev.studentStage
    }));
  };

  // Handle manual override of Academic Stage
  const handleStageSelect = (selectedStage) => {
    const matched = ACADEMIC_STAGES.find(s => s.stage === selectedStage);
    if (matched) {
      setFormData(prev => ({
        ...prev,
        studentClass: matched.className,
        studentStage: matched.stage
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        studentStage: selectedStage
      }));
    }
  };

  // Camera Cleanup and Helpers
  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startCamera = async (mode = 'user') => {
    stopCameraStream();
    setCameraError('');
    setIsCameraOpen(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError(err.message || 'Unable to access camera. Please allow camera permissions or upload a photo.');
    }
  };

  const handleFlipCamera = () => {
    const nextMode = cameraFacingMode === 'user' ? 'environment' : 'user';
    setCameraFacingMode(nextMode);
    startCamera(nextMode);
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const vw = video.videoWidth || 640;
      const vh = video.videoHeight || 480;

      // Official 3.5 : 4.5 passport portrait proportion
      const passportAspect = 3.5 / 4.5;
      let cropW = Math.round(vh * passportAspect);
      let cropH = vh;
      if (cropW > vw) {
        cropW = vw;
        cropH = Math.round(vw / passportAspect);
      }
      const startX = Math.round((vw - cropW) / 2);
      const startY = Math.round((vh - cropH) / 2);

      const canvas = document.createElement('canvas');
      canvas.width = 420; // 3.5 * 120
      canvas.height = 540; // 4.5 * 120 (Standard passport resolution)
      const ctx = canvas.getContext('2d');

      if (cameraFacingMode === 'user') {
        // Mirror horizontally for natural selfie experience
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

      ctx.drawImage(video, startX, startY, cropW, cropH, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

      setFormData(prev => ({
        ...prev,
        studentPhoto: dataUrl,
        photoPreview: dataUrl
      }));
      setPhotoError(false);
      stopCameraStream();
      setIsCameraOpen(false);
    } catch (err) {
      console.error('Failed to capture photo from camera:', err);
      alert('Could not capture frame. Please try again or upload a photo.');
    }
  };

  const handleCloseCamera = () => {
    stopCameraStream();
    setIsCameraOpen(false);
    setCameraError('');
  };

  const handleOpenPhotoEditor = async () => {
    if (!formData.photoPreview) return;
    setOriginalPhotoSrc(formData.photoPreview);
    setEditorPreviewUrl(formData.photoPreview);
    setEditorBgColor('original');
    setIsPhotoEditorOpen(true);

    try {
      const framed = await replacePhotoBackground(formData.photoPreview, 'original');
      if (framed) {
        setEditorPreviewUrl(framed);
      }
    } catch (e) {
      console.warn('Initial passport framing notice:', e);
    }
  };

  const handleSelectBgColor = async (colorVal) => {
    setEditorBgColor(colorVal);

    const sourceImage = originalPhotoSrc || formData.photoPreview;
    if (!sourceImage) return;

    setIsProcessingBg(true);
    try {
      const updatedUrl = await replacePhotoBackground(sourceImage, colorVal);
      if (updatedUrl) {
        setEditorPreviewUrl(updatedUrl);
      }
    } catch (err) {
      console.error('Failed to change photo background:', err);
    } finally {
      setIsProcessingBg(false);
    }
  };

  const handleApplyPhotoEdits = () => {
    const finalPhoto = editorPreviewUrl || formData.photoPreview;
    if (finalPhoto) {
      setFormData(prev => ({
        ...prev,
        studentPhoto: finalPhoto,
        photoPreview: finalPhoto
      }));
      setPhotoError(false);
    }
    setIsPhotoEditorOpen(false);
  };

  // Student Photo Upload (Field 10 - Compulsory)
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Passport photo size must be less than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          studentPhoto: reader.result,
          photoPreview: reader.result
        }));
        setPhotoError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Aadhar Number formatting (Field 9: 12 numeric digits)
  const handleAadharChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 12);
    setFormData(prev => ({ ...prev, aadharNumber: digitsOnly }));
  };

  // Automatic Pincode Lookup (Field 11 -> Instant local lookup + https://api.postalpincode.in/pincode/<PIN>)
  const handlePincodeChange = async (e) => {
    const pin = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormData(prev => ({ ...prev, pincode: pin }));

    if (pin.length === 6) {
      // 1. Instant local offline lookup (0ms instantaneous auto-fill!)
      const localMatch = lookupTamilNaduPincode(pin);
      if (localMatch) {
        setFormData(prev => ({
          ...prev,
          pincode: pin,
          district: localMatch.district || prev.district,
          city: localMatch.city || prev.city,
          village: prev.village || localMatch.locality || localMatch.city || ''
        }));
        setDistrictError(false);
        setPincodeMessage(`✓ Auto-filled: ${localMatch.city}, ${localMatch.district}`);
      } else {
        setPincodeMessage('Connecting to postal database...');
      }

      // 2. Fetch live official India Post data to refine locality & villages
      setPincodeLoading(true);
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data[0]?.Status === 'Success' && Array.isArray(data[0]?.PostOffice) && data[0].PostOffice.length > 0) {
            const offices = data[0].PostOffice;
            const po = offices[0];
            const rawDistrict = (po.District || '').trim();
            const rawCity = (po.Block && po.Block !== 'NA' ? po.Block : po.Name || '').trim();

            // Extract unique place/area names covered by this PIN code
            const places = Array.from(new Set(offices.map(o => (o.Name || '').trim()).filter(Boolean)));
            setAvailablePlaces(places);

            // Match closest district from official list
            const matchedDistrict = TAMIL_NADU_DISTRICTS.find(d => 
              d.toLowerCase() === rawDistrict.toLowerCase() ||
              rawDistrict.toLowerCase().includes(d.toLowerCase()) ||
              d.toLowerCase().includes(rawDistrict.toLowerCase())
            ) || rawDistrict || localMatch?.district || 'Tenkasi';

            setFormData(prev => ({
              ...prev,
              city: rawCity || prev.city || localMatch?.city || '',
              district: matchedDistrict,
              village: prev.village || places[0] || ''
            }));
            setDistrictError(false);
            const placeCount = places.length;
            setPincodeMessage(`✓ Auto-filled: ${rawCity || matchedDistrict}, ${matchedDistrict} (${placeCount} place${placeCount > 1 ? 's' : ''} found)`);
            setTimeout(() => setPincodeMessage(''), 5000);
          } else if (!localMatch) {
            setAvailablePlaces([]);
            setPincodeMessage('PIN code verified. Please review City & District.');
            setTimeout(() => setPincodeMessage(''), 3000);
          }
        }
      } catch (err) {
        console.warn('Pincode fetch error:', err);
      } finally {
        setPincodeLoading(false);
      }
    } else {
      setAvailablePlaces([]);
      if (pin.length < 6) {
        setPincodeMessage('');
      }
    }
  };

  // Card details formatting
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardDetails(prev => ({ ...prev, number: formatted }));
  };

  const handleCardExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = raw.slice(0, 2) + '/' + raw.slice(2);
    }
    setCardDetails(prev => ({ ...prev, expiry: raw }));
  };

  const handleCopyUpi = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('bsel@okaxis');
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    }
  };

  // Real-time Gateway Payment Simulation
  const handleSimulateGatewayPayment = () => {
    setPaymentGatewayStatus('processing');
    const prefix = formData.paymentMode.includes('UPI') 
      ? 'UPI' 
      : formData.paymentMode.includes('Card') 
      ? 'CARD' 
      : 'NET';
    const generatedTxn = `TXN-${prefix}-${Math.floor(10000000 + Math.random() * 90000000)}`;

    setTimeout(() => {
      setPaymentGatewayStatus('success');
      setPaymentGatewayTxn(generatedTxn);
      setFormData(prev => ({
        ...prev,
        receiptRefNo: generatedTxn
      }));
    }, 1800);
  };

  // Multi-Course and Level Handlers
  const handleAddCourse = () => {
    if (isCourseLocked) return;
    const existingNames = (formData.selectedCourses || []).map(c => c.courseName);
    const nextProg = availablePrograms.find(p => !existingNames.includes(p)) || availablePrograms[0] || 'Abacus Speed Arithmetic';
    const nextLevels = getLevelsForCourse(nextProg, coursesList);
    const nextFee = parseCourseFee(nextProg, coursesList);

    const existingRegs = (formData.selectedCourses || []).map(c => c.registerNumber).filter(Boolean);
    const newReg = generateRegisterNumber(nextProg, existingRegs);

    const updatedCourses = [
      ...(formData.selectedCourses || []),
      {
        courseName: nextProg,
        level: nextLevels[0] || 'Level 1',
        fee: nextFee,
        registerNumber: newReg
      }
    ];

    const totalFee = updatedCourses.reduce((sum, c) => sum + (c.fee || 450), 0);
    const joinedNames = updatedCourses.map(c => c.courseName).join(' & ');
    const allRegs = updatedCourses.map(c => c.registerNumber).join(', ');

    setFormData(prev => ({
      ...prev,
      selectedCourses: updatedCourses,
      courseName: joinedNames,
      feeAmount: `₹${totalFee}`,
      registerNumber: allRegs
    }));
  };

  const handleRemoveCourse = (indexToRemove) => {
    if (isCourseLocked) return;
    if ((formData.selectedCourses || []).length <= 1) return;
    const updatedCourses = formData.selectedCourses.filter((_, idx) => idx !== indexToRemove);
    const totalFee = updatedCourses.reduce((sum, c) => sum + (c.fee || 450), 0);
    const joinedNames = updatedCourses.map(c => c.courseName).join(' & ');
    const allRegs = updatedCourses.map(c => c.registerNumber).join(', ');

    setFormData(prev => ({
      ...prev,
      selectedCourses: updatedCourses,
      courseName: joinedNames,
      feeAmount: `₹${totalFee}`,
      registerNumber: allRegs || generateRegisterNumber(updatedCourses[0]?.courseName || 'Abacus')
    }));
  };

  const handleCourseChangeAt = (index, newProg) => {
    if (isCourseLocked) return;
    const newLevels = getLevelsForCourse(newProg, coursesList);
    const newFee = parseCourseFee(newProg, coursesList);

    const otherRegs = (formData.selectedCourses || []).filter((_, idx) => idx !== index).map(c => c.registerNumber).filter(Boolean);
    const newReg = generateRegisterNumber(newProg, otherRegs);

    const updatedCourses = (formData.selectedCourses || []).map((c, idx) => {
      if (idx === index) {
        return {
          ...c,
          courseName: newProg,
          level: newLevels[0] || 'Level 1',
          fee: newFee,
          registerNumber: newReg
        };
      }
      return c;
    });

    const totalFee = updatedCourses.reduce((sum, c) => sum + (c.fee || 450), 0);
    const joinedNames = updatedCourses.map(c => c.courseName).join(' & ');
    const allRegs = updatedCourses.map(c => c.registerNumber).join(', ');

    setFormData(prev => ({
      ...prev,
      selectedCourses: updatedCourses,
      courseName: joinedNames,
      feeAmount: `₹${totalFee}`,
      registerNumber: allRegs
    }));
  };

  const handleLevelChangeAt = (index, newLevel) => {
    const updatedCourses = (formData.selectedCourses || []).map((c, idx) => {
      if (idx === index) {
        return {
          ...c,
          level: newLevel
        };
      }
      return c;
    });

    setFormData(prev => ({
      ...prev,
      selectedCourses: updatedCourses
    }));
  };

  const validateStep1 = () => {
    if (!formData.studentName.trim()) {
      alert('Please enter Student Full Name (Field 4).');
      return false;
    }
    if (!formData.branch?.trim()) {
      alert('Please select a Branch (Field 2).');
      return false;
    }
    if (skipPayment || formData.admissionCategory === 'School') {
      if (!formData.institution?.trim()) {
        alert('Please enter School Name.');
        return false;
      }
    } else {
      if (!formData.admissionCategory) {
        alert('Please select Admission Through (Branch or Academy).');
        return false;
      }
      if (formData.admissionCategory === 'Academy' && !formData.institution?.trim()) {
        alert('Please enter Academy Name.');
        return false;
      }
    }
    if (!formData.parentName.trim()) {
      alert('Please enter Father or Mother Name.');
      return false;
    }
    if (!formData.dob) {
      alert('Please select Student Date of Birth (Field 5).');
      return false;
    }
    if (!formData.age) {
      alert('Please enter Candidate Age (Field 6).');
      return false;
    }
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      alert('Please enter a valid 10-digit Mobile / WhatsApp number (Field 7).');
      return false;
    }
    if (isPhoneNumberRegistered(cleanPhone)) {
      setPhoneError('Mobile number already exists! An account has already been registered with this mobile number.');
      alert(`Mobile number ${cleanPhone} already exists! An account is already registered with this mobile number. Please log in or use a different phone number.`);
      return false;
    }
    if (formData.alternatePhone && formData.alternatePhone.trim()) {
      const cleanAlt = formData.alternatePhone.replace(/\D/g, '');
      if (cleanAlt.length !== 10) {
        alert('Please enter a valid 10-digit Alternate Phone number (Field 8).');
        return false;
      }
    }
    if (!formData.aadharNumber.trim() || formData.aadharNumber.length < 12) {
      alert('Please enter a valid 12-digit Aadhar Number (Field 9).');
      return false;
    }
    if (!formData.studentPhoto) {
      setPhotoError(true);
      alert('Student Passport Photo is compulsory (Field 10). Please upload a student photo before proceeding.');
      return false;
    }
    if (!formData.pincode.trim() || formData.pincode.length < 6) {
      alert('Please enter a valid 6-digit PIN Code (Field 11).');
      return false;
    }
    if (!formData.district) {
      setDistrictError(true);
      alert('Please select District (Field 12).');
      if (districtDropdownRef.current) {
        districtDropdownRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }
    if (!formData.city.trim()) {
      alert('Please enter City / Town (Field 13).');
      return false;
    }
    if (!formData.address.trim()) {
      alert('Please enter Residential Address (Field 15).');
      return false;
    }
    setPhotoError(false);
    setDistrictError(false);
    return true;
  };

  const handleProceedToPayment = () => {
    if (validateStep1()) {
      setFormStep(2);
      modalBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();

    if (!validateStep1()) {
      setFormStep(1);
      modalBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Branch Admin Direct Admission: skip payment step and directly generate credentials
    if (skipPayment) {
      const cleanPhone = formData.phone.replace(/\D/g, '');
      if (isPhoneNumberRegistered(cleanPhone)) {
        setPhoneError('Mobile number already exists! An account is already registered with this mobile number.');
        alert(`Mobile number ${cleanPhone} already exists! Please provide a different phone number.`);
        return;
      }

      setPhotoError(false);
      setDistrictError(false);
      const activeReceiptRef = `BRANCH-${formData.branch || 'ADMIN'}-${Math.floor(100000 + Math.random() * 900000)}`;

      try {
        const account = registerStudentAccount({
          ...formData,
          admissionCategory: 'School',
          institution: (formData.institution || '').trim(),
          schoolName: (formData.institution || '').trim(),
          feePaymentType: 'Paid at Branch',
          paymentMode: 'Direct Branch Registration',
          receiptRefNo: activeReceiptRef,
          declaration: true,
          name: formData.studentName,
          program: formData.courseName
        });
        setCreatedAccount(account);
        setShowPassword(true);
        setSubmitted(true);
        if (onSuccess) {
          try {
            onSuccess(account);
          } catch (err) {
            console.error('onSuccess error:', err);
          }
        }
        modalBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (regErr) {
        alert(regErr.message || 'Unable to register student account.');
        setPhoneError(regErr.message);
      }
      return;
    }

    if (formStep === 1) {
      handleProceedToPayment();
      return;
    }

    if (!formData.declaration) {
      alert('Please check the Official Declaration box to confirm your admission.');
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (isPhoneNumberRegistered(cleanPhone)) {
      setPhoneError('Mobile number already exists! An account is already registered with this mobile number.');
      alert(`Mobile number ${cleanPhone} already exists! Please log in using this number or provide a different phone number.`);
      setFormStep(1);
      return;
    }

    setPhotoError(false);
    setDistrictError(false);
    const activeReceiptRef = formData.receiptRefNo?.trim() || (formData.feePaymentType === 'Pay Now' 
      ? `TXN-${Math.floor(10000000 + Math.random() * 90000000)}` 
      : 'CASH-PAY-LATER-AT-BRANCH');

    try {
      const account = registerStudentAccount({
        ...formData,
        receiptRefNo: activeReceiptRef,
        name: formData.studentName,
        program: formData.courseName
      });
      setCreatedAccount(account);
      setShowPassword(true);
      setSubmitted(true);
      if (onSuccess) {
        try {
          onSuccess(account);
        } catch (err) {
          console.error('onSuccess error:', err);
        }
      }
      modalBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (regErr) {
      alert(regErr.message || 'Unable to register student account.');
      setPhoneError(regErr.message);
      setFormStep(1);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormStep(1);
    setCreatedAccount(null);
    setShowPassword(true);
    setDistrictError(false);
    setPhotoError(false);
    setPhoneError('');
    setPaymentGatewayStatus('idle');
    setPaymentGatewayTxn('');
    setCardDetails({ number: '', expiry: '', cvv: '', name: '' });
    setCopiedUpi(false);
    setIsOtherBranch(false);
    setCustomBranchName('');
    const resetCourse = initialProgram || 'Abacus Speed Arithmetic';
    const resetLevels = getLevelsForCourse(resetCourse, coursesList);
    const resetFee = parseCourseFee(resetCourse, coursesList);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      registerNumber: generateRegisterNumber(resetCourse),
      branch: initialBranch || 'Tenkasi',
      admissionCategory: 'Branch',
      institution: initialBranch || 'Tenkasi',
      schoolName: initialBranch || 'Tenkasi',
      courseName: resetCourse,
      selectedCourses: [
        {
          courseName: resetCourse,
          level: resetLevels[0] || 'Level 1',
          fee: resetFee
        }
      ],
      studentName: '',
      parentName: '',
      fatherName: '',
      dob: '',
      age: '',
      studentClass: '',
      studentStage: '',
      gender: 'Male',
      phone: '',
      alternatePhone: '',
      studentPhoto: null,
      photoPreview: null,
      address: '',
      village: '',
      city: '',
      district: 'Tenkasi',
      pincode: '',
      feePaymentType: 'Pay Now',
      feeAmount: initialFee || `₹${resetFee}`,
      paymentMode: 'UPI / QR Code',
      receiptRefNo: '',
      paymentScreenshot: null,
      screenshotPreview: null,
      aadharNumber: '',
      declaration: false
    });
    modalBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      className="fixed inset-0 z-[150] overflow-y-auto overscroll-contain bg-slate-950/80 backdrop-blur-xs flex items-start justify-center p-2 sm:p-4 select-none"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-2xl sm:rounded-3xl max-w-2xl sm:max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[94vh] sm:max-h-[92vh] my-auto overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#0F2B5C] via-[#143B7A] to-[#1E4D99] text-white p-3.5 sm:p-5 relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-1.5 transition cursor-pointer z-10 active:scale-95"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1 pr-8">
            <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-xs">
              <GraduationCap className="w-4 h-4 text-slate-950" />
            </span>
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-amber-300">
              Board of Skills & Educational Learning (B★SEL)
            </span>
          </div>

          <h3 className="text-lg sm:text-2xl font-black font-heading text-white leading-tight">
            Student Admission Form
          </h3>
          <p className="text-[11px] sm:text-xs text-sky-200 mt-0.5 leading-relaxed font-semibold">
            Official candidate enrollment and course admission registry.
          </p>

          {/* Form Step Progress Bar (hidden once admission is confirmed or if skipPayment is active) */}
          {!submitted && !skipPayment && (
            <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-white/20 text-center text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setFormStep(1);
                  modalBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`pb-1 border-b-2 flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  formStep === 1
                    ? 'border-amber-400 text-amber-300 font-black'
                    : 'border-transparent text-white/75 hover:text-white'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                  formStep === 1 ? 'bg-amber-400 text-slate-950 font-black' : 'bg-emerald-400 text-slate-950 font-black'
                }`}>
                  {formStep > 1 ? '✓' : '1'}
                </span>
                <span className="truncate">1. Candidate Details</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (validateStep1()) {
                    setFormStep(2);
                    modalBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className={`pb-1 border-b-2 flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  formStep === 2
                    ? 'border-amber-400 text-amber-300 font-black'
                    : 'border-transparent text-white/75 hover:text-white'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                  formStep === 2 ? 'bg-amber-400 text-slate-950 font-black' : 'bg-white/20 text-white font-bold'
                }`}>
                  2
                </span>
                <span className="truncate">2. Fees & Declaration</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div ref={modalBodyRef} className="p-3 sm:p-6 overflow-y-auto overscroll-contain flex-1 text-slate-900">
          {submitted && createdAccount ? (
            /* =========================================================================
               ADMISSION CONFIRMATION SLIP & CREDENTIALS
               ========================================================================= */
            <div className="border border-emerald-200/70 rounded-2xl p-4 sm:p-6 space-y-4 bg-emerald-50/15">
              {/* Status Header */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20 ring-8 ring-emerald-50 mb-3">
                  <Check className="w-7 h-7 sm:w-8 sm:h-8 stroke-[3]" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-[10.5px] sm:text-xs font-bold tracking-wide shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  ADMISSION SUCCESSFULLY CONFIRMED
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 font-heading tracking-tight mt-2.5">
                  Welcome, {createdAccount.studentName}!
                </h4>
                <p className="text-xs sm:text-[13px] text-slate-600 max-w-lg mx-auto mt-1 font-medium">
                  Candidate has been officially enrolled in <strong className="text-slate-900 font-bold">{formData.courseName}</strong> at <strong className="text-slate-900 font-bold">{formData.branch}</strong>.
                </p>
              </div>

              {/* Official Admission Slip Card */}
              <div id="admission-slip" ref={slipRef} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs text-left space-y-3.5">
                {/* Header Profile Section */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    {formData.photoPreview ? (
                      <img 
                        src={formData.photoPreview} 
                        alt={formData.studentName} 
                        className="w-13 h-13 rounded-xl object-cover ring-2 ring-sky-500/30 shadow-xs shrink-0" 
                      />
                    ) : (
                      <div className="w-13 h-13 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h5 className="text-base font-black text-slate-900 tracking-tight leading-snug">{formData.studentName}</h5>
                        <span className="text-[10px] font-semibold text-slate-500">({formData.gender}, {formData.age} yrs)</span>
                      </div>
                      {formData.studentStage && (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-900 font-extrabold text-[10.5px] rounded-md border border-amber-300">
                          <span>🎯</span>
                          <span>At the {formData.studentStage} stage</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-mono font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 block">
                      Reg: {createdAccount.registerNumber || formData.registerNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block mt-1">Date: {formData.date}</span>
                  </div>
                </div>

                {/* Enrolled Courses Summary */}
                <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-sky-700" />
                      <span>Enrolled Course</span>
                    </span>
                    <span className="font-mono font-black text-emerald-700 text-xs">
                      Fee: {formData.feeAmount}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {(formData.selectedCourses && formData.selectedCourses.length > 0 ? formData.selectedCourses : [{ courseName: formData.courseName, level: 'Level 1', fee: 450 }]).map((c, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center justify-between gap-2 shadow-2xs">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="font-extrabold text-slate-900 text-xs truncate">{c.courseName}</p>
                            {c.registerNumber && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-900 border border-amber-200 font-mono font-bold text-[10px]">
                                {c.registerNumber}
                              </span>
                            )}
                          </div>
                          <span className="inline-block mt-0.5 text-[10px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                            {c.level}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-700 shrink-0">₹{c.fee || 450}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Candidate & Centre Key Information */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-0.5">
                  <div className="bg-slate-50/70 p-2 rounded-lg border border-slate-100">
                    <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Branch / Centre</span>
                    <strong className="text-slate-900 font-extrabold block text-xs truncate mt-0.5">{formData.branch}</strong>
                  </div>

                  <div className="bg-slate-50/70 p-2 rounded-lg border border-slate-100">
                    <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Father / Mother</span>
                    <strong className="text-slate-900 font-extrabold block text-xs truncate mt-0.5">{formData.parentName || 'Not provided'}</strong>
                  </div>

                  <div className="bg-slate-50/70 p-2 rounded-lg border border-slate-100">
                    <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Contact Phone</span>
                    <strong className="text-slate-900 font-extrabold block text-xs mt-0.5">{formData.phone}</strong>
                  </div>

                  <div className="bg-slate-50/70 p-2 rounded-lg border border-slate-100 col-span-2 sm:col-span-1">
                    <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Payment Status</span>
                    <span className="inline-flex items-center gap-1 font-black text-[11px] mt-0.5 text-emerald-700">
                      ✓ Paid Online
                    </span>
                  </div>

                  <div className="col-span-2 sm:col-span-3 bg-slate-50/70 p-2 rounded-lg border border-slate-100">
                    <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Address</span>
                    <p className="text-slate-800 font-semibold text-[11px] mt-0.5 truncate">
                      {formData.address}, {formData.village && `${formData.village}, `}{formData.city}, {formData.district} - {formData.pincode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Portal Login Credentials Box */}
              <div className="bg-gradient-to-br from-[#0F2B5C] via-[#143B7A] to-[#1E4D99] rounded-2xl p-4 text-white space-y-3 shadow-md">
                <div className="flex items-center gap-1.5 border-b border-white/15 pb-2">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                    Student Portal Credentials
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-left">
                  <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl p-2.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-sky-200 block">User ID</span>
                    <span className="font-mono text-sm sm:text-base font-black text-white">{createdAccount.userId}</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl p-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-sky-200">Password</span>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-white/70 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    </div>
                    <span className="font-mono text-sm sm:text-base font-black text-amber-300">
                      {showPassword ? createdAccount.password : '••••••••'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                {setActivePage && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setActivePage('login');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full sm:flex-1 py-2.5 px-4 bg-[#0F2B5C] hover:bg-[#18458F] text-white text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer min-h-[42px]"
                  >
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>Proceed to Student Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto py-2.5 px-4 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl transition cursor-pointer min-h-[42px]"
                >
                  New Admission
                </button>
              </div>
            </div>
          ) : (
            /* =========================================================================
               OFFICIAL 21-FIELD ADMISSION FORM (MOBILE-FIRST 2-COL LAYOUT)
               ========================================================================= */
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 text-left">
              {formStep === 1 ? (
                /* =========================================================================
                   PAGE 1: CANDIDATE & ADMISSION DETAILS (SECTIONS 1, 2, 3)
                   ========================================================================= */
                <div className="space-y-3 sm:space-y-4 animate-in fade-in duration-200">
                  {/* SECTION 1: ADMISSION & COURSE DETAILS */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 space-y-2.5">
                <span className="text-[10px] sm:text-xs font-black uppercase text-sky-900 tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
                  <Building2 className="w-3.5 h-3.5 text-sky-700" />
                  <span>Section 1: Admission & Course Details</span>
                </span>

                {/* 1. Date & 2. Branch (2-Col on Mobile) */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-black text-slate-800 mb-0.5 sm:mb-1 truncate">
                      1. Date *
                    </label>
                    <input
                      type="date"
                      readOnly
                      tabIndex={-1}
                      value={formData.date || ''}
                      className="w-full px-2.5 sm:px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg sm:rounded-xl text-slate-700 font-bold focus:outline-none text-base sm:text-sm shadow-2xs cursor-not-allowed select-none pointer-events-none"
                    />
                  </div>

                  <div className="relative" ref={branchDropdownRef}>
                    <label className="block text-[11px] sm:text-xs font-black text-slate-800 mb-0.5 sm:mb-1 truncate">
                      2. Branch *
                    </label>

                    <button
                      type="button"
                      disabled={lockBranch}
                      onClick={() => !lockBranch && setBranchDropdownOpen(!branchDropdownOpen)}
                      className={`w-full px-2 sm:px-3 py-2 border rounded-lg sm:rounded-xl text-left text-base sm:text-sm font-semibold flex items-center justify-between shadow-2xs transition truncate min-h-[42px] ${
                        lockBranch 
                          ? 'bg-slate-100 cursor-not-allowed text-slate-700 font-bold border-slate-300' 
                          : branchDropdownOpen 
                          ? 'bg-white border-sky-500 ring-2 ring-sky-500/20 text-slate-950' 
                          : 'bg-white border-slate-300 hover:border-slate-400 text-slate-950'
                      }`}
                    >
                      <span className="truncate">
                        {formData.branch || 'Select Branch'}
                      </span>
                      {!lockBranch && (
                        branchDropdownOpen ? (
                          <ChevronUp className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-1" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-1" />
                        )
                      )}
                    </button>

                    {branchDropdownOpen && !lockBranch && (
                      <div className="absolute z-30 left-0 right-0 top-full mt-1 bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden animate-in fade-in duration-100">
                        <div className="p-1.5 border-b border-slate-200 bg-slate-50">
                          <input
                            type="text"
                            placeholder="Search district or branch..."
                            value={branchSearch}
                            onChange={(e) => setBranchSearch(e.target.value)}
                            className="w-full px-2 py-1 text-xs text-slate-950 font-semibold border border-slate-300 rounded-md focus:outline-none focus:border-sky-500 bg-white"
                            autoFocus
                          />
                        </div>
                        <div className="max-h-48 overflow-y-auto p-1 divide-y divide-slate-100">
                          {filteredBranches.map((b) => {
                            const isSelected = formData.branch === b;
                            return (
                              <button
                                key={b}
                                type="button"
                                onClick={() => {
                                  setIsOtherBranch(false);
                                  setCustomBranchName('');
                                  setFormData(prev => ({ 
                                    ...prev, 
                                    branch: b,
                                    institution: prev.admissionCategory === 'Branch' ? b : prev.institution,
                                    schoolName: prev.admissionCategory === 'Branch' ? b : prev.schoolName,
                                    district: (!prev.district || prev.district === prev.branch || prev.district === 'Tenkasi') ? b : prev.district
                                  }));
                                  setBranchDropdownOpen(false);
                                  setBranchSearch('');
                                }}
                                className={`w-full text-left px-2.5 py-1.5 text-xs font-semibold rounded-md transition flex items-center justify-between cursor-pointer ${
                                  isSelected ? 'bg-sky-50 text-sky-900 font-bold' : 'text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                <span className="truncate">
                                  {b}
                                </span>
                                {isSelected && <Check className="w-3 h-3 text-sky-600 shrink-0" />}
                              </button>
                            );
                          })}
                          {filteredBranches.length === 0 && (
                            <div className="p-2.5 text-center text-xs text-slate-500">
                              No matching option found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Category of Admission under Branch */}
                {formData.branch && (
                  skipPayment ? (
                    /* In Branch Admin: Admission Through is FIXED to School */
                    <div className="pt-0.5 space-y-2 animate-in fade-in duration-150">
                      <div>
                        <label className="block text-[11px] sm:text-xs font-black text-slate-800 mb-1 flex items-center gap-1.5">
                          <School className="w-3.5 h-3.5 text-sky-700" />
                          <span>Admission Through <span className="text-rose-600">*</span></span>
                        </label>
                        <div className="w-full py-2 px-3 rounded-xl border border-sky-500 bg-sky-50 text-sky-950 font-bold text-xs flex items-center gap-2 shadow-2xs">
                          <School className="w-4 h-4 text-sky-600 shrink-0" />
                          <span>School</span>
                        </div>
                      </div>

                      {/* School Name Manual Entry */}
                      <div className="pt-0.5 animate-in fade-in duration-150">
                        <label className="block text-[11px] sm:text-xs font-black text-slate-800 mb-0.5 sm:mb-1 flex items-center gap-1.5">
                          <School className="w-3.5 h-3.5 text-sky-700" />
                          <span>School Name <span className="text-rose-600">*</span></span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Enter student's School Name..."
                          value={formData.institution || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              institution: val,
                              schoolName: val,
                              admissionCategory: 'School'
                            }));
                          }}
                          className="w-full px-2.5 sm:px-3 py-2 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none text-base sm:text-sm shadow-2xs placeholder:text-slate-400 placeholder:font-normal"
                          autoFocus
                        />
                      </div>
                    </div>
                  ) : (
                    /* Regular / Website: Branch or Academy selection */
                    <div className="pt-0.5 space-y-2 animate-in fade-in duration-150">
                      <div>
                        <label className="block text-[11px] sm:text-xs font-black text-slate-800 mb-1 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5 text-sky-700" />
                            <span>Admission Through <span className="text-rose-600">*</span></span>
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400">
                            Select category
                          </span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'Branch', label: 'Branch', icon: Building2 },
                            { id: 'Academy', label: 'Academy', icon: GraduationCap }
                          ].map(({ id, label, icon: Icon }) => {
                            const isSelected = formData.admissionCategory === id;
                            return (
                              <button
                                key={id}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    admissionCategory: id,
                                    institution: id === 'Branch' ? prev.branch : (prev.admissionCategory === id ? prev.institution : ''),
                                    schoolName: id === 'Branch' ? prev.branch : (prev.admissionCategory === id ? prev.schoolName : '')
                                  }));
                                }}
                                className={`py-2 px-2 sm:px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-sky-600 border-sky-600 text-white shadow-xs scale-[1.01]'
                                    : 'bg-white border-slate-300 text-slate-700 hover:border-sky-300 hover:bg-sky-50/50'
                                }`}
                              >
                                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-sky-600'}`} />
                                <span>{label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* If Academy is selected: enter Academy Name */}
                      {formData.admissionCategory === 'Academy' && (
                        <div className="pt-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                          <label className="block text-[11px] sm:text-xs font-black text-slate-800 mb-0.5 sm:mb-1 flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5 text-sky-700" />
                            <span>Academy Name <span className="text-rose-600">*</span></span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Enter Academy Name..."
                            value={formData.institution || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormData(prev => ({
                                ...prev,
                                institution: val,
                                schoolName: val
                              }));
                            }}
                            className="w-full px-2.5 sm:px-3 py-2 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none text-base sm:text-sm shadow-2xs placeholder:text-slate-400 placeholder:font-normal"
                            autoFocus
                          />
                        </div>
                      )}
                    </div>
                  )
                )}

                {/* 3. Multi-Course & Level Selection Desk */}
                <div className="space-y-2 pt-1 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-[11px] sm:text-xs font-black text-slate-800 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-sky-700" />
                        <span>3. Enrolled Courses & Levels *</span>
                      </label>
                      <span className="text-[10px] text-slate-500 font-semibold block">
                        Students can enroll in multiple courses and choose their starting level.
                      </span>
                    </div>

                    {!isCourseLocked && (
                      <button
                        type="button"
                        onClick={handleAddCourse}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white text-[10px] sm:text-[11px] font-black rounded-lg transition shadow-xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Course</span>
                      </button>
                    )}
                  </div>

                  {/* Course Cards List */}
                  <div className="space-y-2">
                    {(formData.selectedCourses || []).map((courseEntry, idx) => {
                      const availableLevels = getLevelsForCourse(courseEntry.courseName, coursesList);
                      return (
                        <div 
                          key={idx} 
                          className="p-2.5 sm:p-3 bg-white border-2 border-slate-200 hover:border-sky-300 rounded-xl space-y-2 transition shadow-2xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1">
                              <span className="w-4 h-4 rounded-full bg-sky-100 text-sky-900 flex items-center justify-center font-mono font-black text-[9px]">
                                {idx + 1}
                              </span>
                              <span>Course #{idx + 1}</span>
                            </span>

                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                Fee: ₹{courseEntry.fee || 450}
                              </span>

                              {!isCourseLocked && (formData.selectedCourses || []).length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCourse(idx)}
                                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                                  title="Remove this course"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {/* Course Select */}
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                                Select Course *
                              </label>
                              {isCourseLocked ? (
                                <input
                                  type="text"
                                  readOnly
                                  value={courseEntry.courseName}
                                  className="w-full px-2.5 py-1.5 bg-slate-100 border border-slate-300 rounded-lg text-slate-900 font-bold text-xs cursor-default select-none focus:outline-none"
                                />
                              ) : (
                                <select
                                  value={courseEntry.courseName}
                                  onChange={(e) => handleCourseChangeAt(idx, e.target.value)}
                                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-950 font-bold text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                >
                                  {availablePrograms.map((prog, i) => (
                                    <option key={i} value={prog}>{prog}</option>
                                  ))}
                                </select>
                              )}
                            </div>

                            {/* Level Select */}
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                                Select Level *
                              </label>
                              <select
                                value={courseEntry.level}
                                onChange={(e) => handleLevelChangeAt(idx, e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-950 font-bold text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                              >
                                {availableLevels.map((lvl, lvlIdx) => (
                                  <option key={lvlIdx} value={lvl}>{lvl}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary Footer */}
                  <div className="flex items-center justify-between p-2 bg-sky-50 border border-sky-200 rounded-lg text-xs">
                    <span className="font-bold text-sky-950 text-[11px]">
                      Selected: <strong>{(formData.selectedCourses || []).length} Course{((formData.selectedCourses || []).length > 1 ? 's' : '')}</strong>
                    </span>
                    <span className="font-black text-sky-950 text-xs">
                      Total Fee: <span className="text-emerald-700 font-mono text-sm">{formData.feeAmount}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: STUDENT PERSONAL DETAILS */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 space-y-2.5">
                <span className="text-[10px] sm:text-xs font-black uppercase text-sky-900 tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
                  <User className="w-3.5 h-3.5 text-sky-700" />
                  <span>Section 2: Candidate Personal Information</span>
                </span>

                {/* 4. Student Name & Father or Mother Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-black text-slate-800 mb-0.5 sm:mb-1">
                      4. Student Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Student full name"
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none text-base sm:text-sm shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-black text-slate-800 mb-0.5 sm:mb-1">
                      Father or Mother Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Father or Mother full name"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value, fatherName: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none text-base sm:text-sm shadow-2xs"
                    />
                  </div>
                </div>

                {/* 5. Date of Birth & 6. Age (2-Col on Mobile) */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-black text-slate-800 mb-0.5 sm:mb-1 truncate">
                      5. Date of Birth *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dob}
                      onChange={handleDobChange}
                      className="w-full px-2.5 sm:px-3 py-2 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none text-base sm:text-sm shadow-2xs min-h-[42px]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-black text-slate-800 mb-0.5 sm:mb-1 truncate">
                      6. Age *
                    </label>
                    <input
                      type="number"
                      min="3"
                      max="80"
                      required
                      placeholder="Age in yrs"
                      value={formData.age}
                      onChange={handleAgeChange}
                      className="w-full px-2.5 sm:px-3 py-2 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-semibold text-center text-base sm:text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none shadow-2xs min-h-[42px]"
                    />
                  </div>
                </div>

                {/* Academic Category & Stage */}
                <div className="p-3 bg-gradient-to-br from-amber-50/90 to-sky-50/80 border-2 border-amber-300/80 rounded-xl space-y-2 shadow-2xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-600 mb-0.5">
                        School Class
                      </span>
                      <input
                        type="text"
                        readOnly
                        value={formData.studentClass || (formData.age ? 'Calculating...' : 'Pending DOB / Age')}
                        placeholder="e.g. Class 1"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold text-xs"
                      />
                    </div>

                    <div>
                      <span className="block text-[10px] font-bold text-slate-600 mb-0.5">
                        Stage Category (Selectable)
                      </span>
                      <select
                        value={formData.studentStage}
                        onChange={(e) => handleStageSelect(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border-2 border-amber-400 rounded-lg text-slate-900 font-black text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      >
                        <option value="">-- Select Stage --</option>
                        {ACADEMIC_STAGES.map((s) => (
                          <option key={s.stage} value={s.stage}>
                            {s.label} ({s.ageRange})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Gender (3 Segmented Buttons - 100% Mobile Optimized, No Clipping) */}
                <div>
                  <label className="block text-[11px] sm:text-xs font-black text-slate-800 mb-1">
                    Gender *
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2 bg-slate-200/70 p-1 rounded-lg">
                    {['Male', 'Female', 'Other'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setFormData({ ...formData, gender: g })}
                        className={`py-1.5 px-2 rounded-md text-xs font-black transition cursor-pointer text-center min-h-[36px] ${
                          formData.gender === g
                            ? 'bg-[#0F2B5C] text-white shadow-xs'
                            : 'bg-white/80 hover:bg-white text-slate-700'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 7. Phone & 8. Alternate Phone (2-Col on Mobile - strictly 10 digits) */}
                <div className="space-y-1.5">
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                        <label className="block text-[11px] sm:text-xs font-black text-slate-800 truncate">
                          7. Mobile / WhatsApp *
                        </label>
                      </div>
                      <input
                        type="tel"
                        required
                        maxLength="10"
                        placeholder="10-digit number"
                        value={formData.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setFormData({ ...formData, phone: val });
                          if (val.length === 10) {
                            if (isPhoneNumberRegistered(val)) {
                              setPhoneError('Mobile number already exists! An account is already registered with this number.');
                            } else {
                              setPhoneError('');
                            }
                          } else {
                            setPhoneError('');
                          }
                        }}
                        onBlur={() => {
                          const clean = formData.phone.replace(/\D/g, '');
                          if (clean.length === 10 && isPhoneNumberRegistered(clean)) {
                            setPhoneError('Mobile number already exists! An account is already registered with this number.');
                          }
                        }}
                        className={`w-full px-2.5 sm:px-3 py-2 bg-white border ${
                          phoneError ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-300 focus:ring-sky-500'
                        } rounded-lg sm:rounded-xl text-slate-950 font-semibold focus:ring-2 focus:outline-none text-base sm:text-sm shadow-2xs min-h-[42px]`}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] sm:text-xs font-black text-slate-800 mb-0.5 sm:mb-1 truncate">
                        8. Alternate Phone
                      </label>
                      <input
                        type="tel"
                        maxLength="10"
                        placeholder="10-digit number"
                        value={formData.alternatePhone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setFormData({ ...formData, alternatePhone: val });
                        }}
                        className="w-full px-2.5 sm:px-3 py-2 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none text-base sm:text-sm shadow-2xs min-h-[42px]"
                      />
                    </div>
                  </div>

                  {phoneError && (
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-semibold flex items-start gap-2 shadow-xs animate-in fade-in duration-200">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-rose-900">{phoneError}</p>
                        <p className="text-[11px] text-rose-700 mt-0.5">
                          Please log in with this mobile number, or enter a different number for a new admission.
                        </p>
                        {setActivePage && (
                          <button
                            type="button"
                            onClick={() => {
                              onClose?.();
                              setActivePage('login');
                              if (typeof window !== 'undefined') {
                                localStorage.setItem('bsel_remember_user', formData.phone);
                              }
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="mt-1.5 inline-flex items-center gap-1 font-bold text-blue-900 bg-white border border-blue-200 px-2.5 py-1 rounded-lg hover:bg-blue-50 text-[11px] transition shadow-2xs cursor-pointer"
                          >
                            <span>Proceed to Student Login</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 9. Aadhar Number & 10. Student Photo Upload */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 items-start">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-black text-slate-800 mb-0.5 sm:mb-1 truncate">
                      9. Aadhar Number *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength="12"
                      placeholder="12-digit Aadhar Number"
                      value={formData.aadharNumber}
                      onChange={handleAadharChange}
                      className="w-full px-2.5 sm:px-3 py-2 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-mono font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none text-base sm:text-sm shadow-2xs min-h-[42px]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-black text-slate-800 mb-0.5 sm:mb-1 truncate">
                      10. Student Photo *
                    </label>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        {/* File Upload Option */}
                        <label className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-white border-2 rounded-lg sm:rounded-xl cursor-pointer hover:bg-slate-50 transition font-bold text-[11px] truncate shadow-2xs min-h-[42px] ${
                          photoError 
                            ? 'border-rose-500 bg-rose-50/20 text-rose-700 ring-2 ring-rose-400/20' 
                            : formData.photoPreview
                            ? 'border-emerald-500 bg-emerald-50/20 text-emerald-800'
                            : 'border-slate-300 text-slate-800'
                        }`}>
                          <Upload className={`w-3.5 h-3.5 shrink-0 ${photoError ? 'text-rose-600' : 'text-sky-700'}`} />
                          <span className="truncate">{formData.photoPreview ? 'Change File' : 'Upload Photo'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>

                        {/* Camera Capture Button (Opens Popup) */}
                        <button
                          type="button"
                          onClick={() => startCamera(cameraFacingMode)}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-[#0F2B5C] hover:bg-[#18458F] text-white rounded-lg sm:rounded-xl transition font-black text-[11px] truncate shadow-2xs min-h-[42px] cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">Take Photo</span>
                        </button>

                        {/* Photo Preview Thumbnail & Edit Button */}
                        {formData.photoPreview && (
                          <div className="relative group shrink-0">
                            <img 
                              src={formData.photoPreview} 
                              alt="Student preview" 
                              className="w-10 h-10 rounded-lg object-cover border-2 border-emerald-600 shadow-xs cursor-pointer hover:opacity-80 transition" 
                              onClick={handleOpenPhotoEditor}
                              title="Click to Edit Photo"
                            />
                            <button
                              type="button"
                              onClick={handleOpenPhotoEditor}
                              className="absolute -bottom-1 -right-1 p-0.5 bg-sky-600 hover:bg-sky-700 text-white rounded-full shadow-xs cursor-pointer border border-white"
                              title="Edit Photo"
                            >
                              <Crop className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {formData.photoPreview && (
                        <div className="flex items-center justify-between text-[10px] text-emerald-700 font-bold px-1">
                          <div className="flex items-center gap-1.5">
                            <span>✓ Photo Attached</span>
                            <button
                              type="button"
                              onClick={handleOpenPhotoEditor}
                              className="text-sky-700 hover:text-sky-900 font-black flex items-center gap-0.5 underline cursor-pointer"
                            >
                              <Crop className="w-2.5 h-2.5" />
                              <span>Edit Photo</span>
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, studentPhoto: null, photoPreview: null }))}
                            className="text-rose-600 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>

                    {photoError && (
                      <p className="text-[10px] text-rose-600 font-bold mt-1">
                        Student photo is compulsory *
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 3: ADDRESS DETAILS */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
                <span className="text-[10px] sm:text-xs font-black uppercase text-sky-900 tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-700" />
                  <span>Section 3: Address & Location Details</span>
                </span>

                {/* 11. PIN Code (FIRST - AUTO-FILLS DISTRICT & CITY) */}
                <div className="bg-sky-50/70 p-2.5 sm:p-3 rounded-xl border border-sky-200">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] sm:text-xs font-black text-sky-950">
                      11. PIN Code *
                    </label>
                    {pincodeLoading && (
                      <span className="text-[10px] text-sky-700 font-bold flex items-center gap-1 animate-pulse">
                        <Loader2 className="w-2.5 h-2.5 animate-spin" />
                        <span>Locating...</span>
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength="6"
                      required
                      placeholder="e.g. 627811"
                      value={formData.pincode}
                      onChange={handlePincodeChange}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-black text-base sm:text-sm tracking-wider focus:ring-2 focus:ring-sky-500 focus:outline-none shadow-2xs font-mono"
                    />
                    {pincodeLoading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
                      </div>
                    )}
                  </div>
                  {pincodeMessage && (
                    <p className={`text-[11px] font-bold mt-1.5 ${pincodeMessage.includes('✓') ? 'text-emerald-700' : 'text-slate-600'}`}>
                      {pincodeMessage}
                    </p>
                  )}

                  {/* Places found for this PIN code */}
                  {availablePlaces.length > 0 && (
                    <div className="mt-2 p-2 bg-white border border-sky-200 rounded-lg space-y-1">
                      <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-500 block">
                        Select your Village / Locality ({availablePlaces.length} places in PIN {formData.pincode}):
                      </span>
                      <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                        {availablePlaces.map((pl, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, village: pl }))}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer border ${
                              formData.village === pl
                                ? 'bg-sky-600 text-white border-sky-600 shadow-2xs font-bold'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-sky-50 hover:border-sky-300'
                            }`}
                            title="Click to select this Village / Locality"
                          >
                            {pl}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 12. District & 13. City / Town (2-Col on Mobile) */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  {/* 12. District Dropdown */}
                  <div className="relative" ref={districtDropdownRef}>
                    <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                      <label className="block text-[11px] sm:text-xs font-black text-slate-800 truncate">
                        12. District *
                      </label>
                      {formData.district && formData.pincode?.length === 6 && (
                        <span className="text-[9.5px] font-bold text-emerald-700">Auto-filled</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setDistrictDropdownOpen(!districtDropdownOpen)}
                      className={`w-full px-2.5 sm:px-3 py-2 text-base sm:text-sm font-semibold rounded-lg sm:rounded-xl border transition flex items-center justify-between text-left cursor-pointer bg-white shadow-2xs ${
                        districtError
                          ? 'border-rose-500 bg-rose-50/20'
                          : districtDropdownOpen
                          ? 'border-sky-500 ring-2 ring-sky-500/20'
                          : 'border-slate-300'
                      }`}
                    >
                      <span className="truncate text-slate-950">{formData.district || 'Select District'}</span>
                      {districtDropdownOpen ? (
                        <ChevronUp className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      )}
                    </button>

                    {districtDropdownOpen && (
                      <div className="absolute z-30 left-0 right-0 bottom-full sm:bottom-auto sm:top-full mb-1 sm:mb-0 sm:mt-1 bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden animate-in fade-in duration-100">
                        <div className="p-1.5 border-b border-slate-200 bg-slate-50">
                          <input
                            type="text"
                            value={districtSearch}
                            onChange={(e) => setDistrictSearch(e.target.value)}
                            className="w-full px-2 py-1 text-xs text-slate-950 font-semibold border border-slate-300 rounded-md focus:outline-none focus:border-sky-500 bg-white"
                            autoFocus
                          />
                        </div>
                        <div className="max-h-40 overflow-y-auto p-1 divide-y divide-slate-100">
                          {filteredDistricts.map((dist) => {
                            const isSelected = formData.district === dist;
                            return (
                              <button
                                key={dist}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, district: dist });
                                  setDistrictError(false);
                                  setDistrictDropdownOpen(false);
                                }}
                                className={`w-full text-left px-2.5 py-1.5 text-xs font-semibold rounded-md transition flex items-center justify-between cursor-pointer ${
                                  isSelected ? 'bg-sky-50 text-sky-900 font-bold' : 'text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                <span>{dist}</span>
                                {isSelected && <Check className="w-3 h-3 text-sky-600 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 13. City / Town */}
                  <div>
                    <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                      <label className="block text-[11px] sm:text-xs font-black text-slate-800 truncate">
                        13. City / Town *
                      </label>
                      {formData.city && formData.pincode?.length === 6 && (
                        <span className="text-[9.5px] font-bold text-emerald-700">Auto-filled</span>
                      )}
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Surandai / Tenkasi"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-2.5 sm:px-3 py-2 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none text-base sm:text-sm shadow-2xs"
                    />
                  </div>
                </div>

                {/* 14. Village / Locality & 15. Residential Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-black text-slate-800 mb-0.5 sm:mb-1 truncate">
                      14. Village / Locality
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Main Road / Street"
                      value={formData.village}
                      onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                      className="w-full px-2.5 sm:px-3 py-2 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none text-base sm:text-sm shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-black text-slate-800 mb-0.5 sm:mb-1">
                      15. Residential Address *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Door No, Building, Street Name"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none text-base sm:text-sm shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* PAGE 1 BOTTOM ACTION BUTTON: PROCEED TO PAYMENT OR DIRECT REGISTER */}
              <div className="pt-2">
                {skipPayment ? (
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white py-3 sm:py-3.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer min-h-[46px]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>Register Student & Get Login Credentials</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleProceedToPayment}
                    className="w-full bg-[#0F2B5C] hover:bg-[#18458F] active:scale-[0.99] text-white py-3 sm:py-3.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer min-h-[46px]"
                  >
                    <span>Proceed to Fee & Payment (Step 2 of 2)</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* =========================================================================
               PAGE 2: FEES, PAYMENT DETAILS, SCREENSHOT UPLOAD & DECLARATION
               ========================================================================= */
            <div className="space-y-3 sm:space-y-4 animate-in fade-in duration-200">
              {/* Candidate Summary Pill Card */}
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-2.5 min-w-0">
                  {formData.photoPreview ? (
                    <img 
                      src={formData.photoPreview} 
                      alt={formData.studentName} 
                      className="w-11 h-11 rounded-xl object-cover border-2 border-sky-600 shrink-0 shadow-xs" 
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-800 shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="text-[9px] font-black uppercase tracking-wider text-sky-800 block">
                      Candidate Enrolling
                    </span>
                    <h5 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                      {formData.studentName || 'Student'}
                    </h5>
                    <span className="text-[10px] text-slate-600 font-semibold truncate block">
                      {formData.branch}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex flex-wrap gap-1 max-w-[340px]">
                    {(formData.selectedCourses || []).map((c, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-800 border border-slate-200 shadow-2xs">
                        {c.courseName}: <strong className="text-amber-800">{c.level}</strong>
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setFormStep(1);
                      modalBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-2.5 py-1.5 bg-white border border-slate-300 hover:border-slate-400 rounded-lg text-slate-700 hover:text-slate-950 text-[11px] font-black transition cursor-pointer shrink-0 shadow-2xs ml-auto sm:ml-0"
                  >
                    Edit Step 1
                  </button>
                </div>
              </div>

              {/* SECTION 4: ADMISSION FEE & REAL-TIME PAYMENT GATEWAY */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-[10px] sm:text-xs font-black uppercase text-sky-900 tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-sky-700" />
                    <span>Section 4: Fee & Real-Time Payment Gateway</span>
                  </span>

                  {/* Real-time Status Badge */}
                  {paymentGatewayStatus === 'success' && (
                    <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified in Real-Time ✓</span>
                    </span>
                  )}
                </div>

                {/* 16. Fee Payment Option & 17. Fee Amount */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 items-center">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-black text-slate-800 mb-1">
                      16. Fee Payment Option *
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 font-black text-xs min-h-[38px]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Pay Now (Online UPI / QR Code / Net Banking)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-black text-slate-800 mb-1">
                      17. Total Amount Payable
                    </label>
                    <div className="px-3.5 py-2 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 font-black text-sm sm:text-base flex items-center justify-between shadow-2xs min-h-[38px]">
                      <span className="text-xs text-emerald-700 font-semibold">Payable:</span>
                      <span className="text-sm sm:text-base font-black">{formData.feeAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Interactive Real-Time Payment Methods */}
                <div className="space-y-3 pt-1 border-t border-slate-200 animate-in fade-in duration-200">
                    {/* 18. Payment Mode Selector Tabs */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[11px] sm:text-xs font-black text-slate-800">
                          18. Select Instant Payment Method *
                        </label>
                        <span className="text-[10px] font-semibold text-slate-500">Fast & Real-Time</span>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, paymentMode: 'UPI / QR Code' })}
                          className={`p-2 rounded-xl border text-xs font-black transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                            formData.paymentMode === 'UPI / QR Code'
                              ? 'border-sky-600 bg-sky-50/90 text-sky-950 shadow-xs ring-1 ring-sky-500'
                              : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <QrCode className="w-4 h-4 text-sky-700" />
                          <span className="text-[11px] leading-tight">UPI / QR Code</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, paymentMode: 'Debit / Credit Card' })}
                          className={`p-2 rounded-xl border text-xs font-black transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                            formData.paymentMode === 'Debit / Credit Card'
                              ? 'border-sky-600 bg-sky-50/90 text-sky-950 shadow-xs ring-1 ring-sky-500'
                              : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <CreditCard className="w-4 h-4 text-sky-700" />
                          <span className="text-[11px] leading-tight">Cards (ATM)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, paymentMode: 'Net Banking (IMPS/NEFT)' })}
                          className={`p-2 rounded-xl border text-xs font-black transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                            formData.paymentMode === 'Net Banking (IMPS/NEFT)'
                              ? 'border-sky-600 bg-sky-50/90 text-sky-950 shadow-xs ring-1 ring-sky-500'
                              : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <Building2 className="w-4 h-4 text-sky-700" />
                          <span className="text-[11px] leading-tight">Net Banking</span>
                        </button>
                      </div>
                    </div>

                    {/* METHOD 1: REAL-TIME UPI & DYNAMIC SCANNABLE QR CODE */}
                    {formData.paymentMode === 'UPI / QR Code' && (
                      <div className="bg-white border-2 border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
                        <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4">
                          {/* Live Dynamic Scannable QR Code */}
                          <div className="bg-white p-2 rounded-xl border-2 border-slate-300 shadow-md shrink-0 text-center relative group">
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(`upi://pay?pa=bsel@okaxis&pn=BSEL%20Educational%20Board&am=${formData.feeAmount.replace(/\D/g, '') || '450'}&cu=INR&tn=Admission%20Fee%20for%20${encodeURIComponent(formData.studentName || 'Student')}`)}`}
                              alt="BSEL UPI QR Code"
                              className="w-28 h-28 sm:w-32 sm:h-32 rounded-lg object-contain mx-auto"
                            />
                            <span className="text-[9px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full mt-1.5 inline-block border border-emerald-200">
                              Scan & Pay {formData.feeAmount}
                            </span>
                          </div>

                          {/* UPI Instructions & Instant Mobile Action */}
                          <div className="flex-1 space-y-2 text-center sm:text-left min-w-0">
                            <div>
                              <h5 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                                Instant Real-Time UPI Payment
                              </h5>
                              <p className="text-[11px] text-slate-600 font-medium">
                                Point your camera or scan with GPay, PhonePe, Paytm, CRED or BHIM.
                              </p>
                            </div>

                            {/* Supported UPI Apps Pills */}
                            <div className="flex items-center justify-center sm:justify-start gap-1 flex-wrap">
                              {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI', 'Cred'].map((app) => (
                                <span key={app} className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-bold text-slate-800">
                                  {app}
                                </span>
                              ))}
                            </div>

                            {/* Official VPA with 1-Click Copy */}
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <span className="text-[9px] font-bold text-slate-500 uppercase block">Official B★SEL UPI ID</span>
                                <span className="font-mono text-xs font-black text-slate-900 truncate block">bsel@okaxis</span>
                              </div>
                              <button
                                type="button"
                                onClick={handleCopyUpi}
                                className={`px-2.5 py-1 rounded-md text-[10px] font-black transition flex items-center gap-1 cursor-pointer shrink-0 ${
                                  copiedUpi 
                                    ? 'bg-emerald-600 text-white' 
                                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                {copiedUpi ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedUpi ? 'Copied! ✓' : 'Copy UPI ID'}</span>
                              </button>
                            </div>

                            {/* Mobile Instant UPI Intent Button */}
                            <a
                              href={`upi://pay?pa=bsel@okaxis&pn=BSEL%20Educational%20Board&am=${formData.feeAmount.replace(/\D/g, '') || '450'}&cu=INR&tn=Admission%20Fee%20for%20${encodeURIComponent(formData.studentName || 'Student')}`}
                              className="inline-flex sm:hidden items-center justify-center gap-1.5 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-lg shadow-xs transition active:scale-95 min-h-[44px]"
                            >
                              <span>Open in Installed UPI App</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* METHOD 2: DEBIT / CREDIT CARD GATEWAY */}
                    {formData.paymentMode === 'Debit / Credit Card' && (
                      <div className="bg-white border-2 border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
                        {/* Interactive Card Mock Graphic */}
                        <div className="bg-gradient-to-r from-[#0F2B5C] via-[#143B7A] to-[#1E4D99] rounded-xl p-3 sm:p-4 text-white shadow-md space-y-2.5 max-w-sm mx-auto">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">B★SEL Student Pay Card</span>
                            <span className="text-xs font-black italic tracking-widest text-white/90">RuPay • VISA</span>
                          </div>
                          <div className="font-mono text-sm sm:text-base tracking-widest font-black text-amber-100">
                            {cardDetails.number || '•••• •••• •••• ••••'}
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <div>
                              <span className="text-white/60 uppercase block text-[8px]">Cardholder</span>
                              <span className="font-bold truncate max-w-[150px] block">{cardDetails.name || formData.studentName || 'Student Name'}</span>
                            </div>
                            <div>
                              <span className="text-white/60 uppercase block text-[8px]">Expires</span>
                              <span className="font-mono font-bold">{cardDetails.expiry || 'MM/YY'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Card Inputs */}
                        <div className="space-y-2.5 text-left">
                          <div>
                            <label className="block text-[11px] font-black text-slate-800 mb-0.5">Card Number *</label>
                            <input
                              type="text"
                              maxLength="19"
                              placeholder="4532 8920 1829 4829"
                              value={cardDetails.number}
                              onChange={handleCardNumberChange}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-950 font-mono text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-black text-slate-800 mb-0.5">Expiry (MM/YY) *</label>
                              <input
                                type="text"
                                maxLength="5"
                                placeholder="12/28"
                                value={cardDetails.expiry}
                                onChange={handleCardExpiryChange}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-950 font-mono text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-black text-slate-800 mb-0.5">CVV *</label>
                              <input
                                type="password"
                                maxLength="3"
                                placeholder="•••"
                                value={cardDetails.cvv}
                                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-950 font-mono text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-black text-slate-800 mb-0.5">Name on Card *</label>
                            <input
                              type="text"
                              placeholder="Full Name as on card"
                              value={cardDetails.name}
                              onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-950 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={handleSimulateGatewayPayment}
                            disabled={paymentGatewayStatus === 'processing'}
                            className="w-full py-2.5 bg-[#0F2B5C] hover:bg-[#18458F] active:scale-95 disabled:bg-slate-300 text-white text-xs font-black rounded-xl transition flex items-center justify-center gap-2 shadow-md cursor-pointer mt-1"
                          >
                            {paymentGatewayStatus === 'processing' ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Authorizing Card Payment...</span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-3.5 h-3.5 text-amber-400" />
                                <span>Authorize & Pay {formData.feeAmount} Securely</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* METHOD 3: NET BANKING */}
                    {formData.paymentMode === 'Net Banking (IMPS/NEFT)' && (
                      <div className="bg-white border-2 border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
                        <label className="block text-xs font-black text-slate-800 text-left">Select Your Bank</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Canara Bank'].map((bank) => (
                            <button
                              key={bank}
                              type="button"
                              onClick={() => setSelectedBank(bank)}
                              className={`p-2.5 rounded-xl border text-xs font-black transition text-left cursor-pointer active:scale-95 ${
                                selectedBank === bank
                                  ? 'border-sky-600 bg-sky-100/70 text-sky-950 ring-1 ring-sky-500'
                                  : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800'
                              }`}
                            >
                              {bank}
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={handleSimulateGatewayPayment}
                          disabled={paymentGatewayStatus === 'processing'}
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:bg-slate-300 text-white text-xs font-black rounded-xl transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
                        >
                          {paymentGatewayStatus === 'processing' ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Connecting to {selectedBank}...</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5 text-white" />
                              <span>Proceed to {selectedBank} & Pay {formData.feeAmount}</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* REAL-TIME PAYMENT SUCCESS CONFIRMATION BANNER */}
                    {paymentGatewayStatus === 'success' && (
                      <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-3 sm:p-4 text-emerald-950 space-y-2 animate-in fade-in duration-300 shadow-sm text-left">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                              <Check className="w-4 h-4" />
                            </div>
                            <div>
                              <h5 className="text-xs sm:text-sm font-black text-emerald-900 leading-tight">
                                Real-Time Payment Verified Successfully!
                              </h5>
                              <span className="text-[10px] text-emerald-700 font-bold">
                                Bank Authorization Complete • Fee Paid: {formData.feeAmount}
                              </span>
                            </div>
                          </div>
                          <span className="text-[9px] uppercase font-black tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                            Approved
                          </span>
                        </div>

                        <div className="bg-white/80 rounded-lg p-2 text-xs grid grid-cols-2 gap-2 border border-emerald-200 font-mono">
                          <div>
                            <span className="text-[9px] text-slate-500 uppercase block font-sans font-bold">Transaction ID</span>
                            <span className="font-black text-slate-900 text-[11px] truncate block">{formData.receiptRefNo}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-500 uppercase block font-sans font-bold">Timestamp</span>
                            <span className="font-bold text-slate-800 text-[11px]">Just Now (Real-Time)</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
              </div>

              {/* 21. DECLARATION CHECKBOX */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 text-left">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={formData.declaration}
                    onChange={(e) => setFormData({ ...formData, declaration: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded text-[#0F2B5C] border-slate-300 focus:ring-sky-500 cursor-pointer shrink-0"
                  />
                  <span className="text-[11px] sm:text-xs text-slate-800 font-semibold leading-relaxed">
                    I hereby declare that all the information furnished above is true and complete to the best of my knowledge. I agree to abide by the academic regulations and code of conduct of the Board of Skills and Educational Learning (B★SEL).
                  </span>
                </label>
              </div>

              {/* PAGE 2 BOTTOM ACTION BUTTONS: BACK & SUBMIT */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setFormStep(1);
                    modalBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto py-3 px-4 border-2 border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[46px]"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-600" />
                  <span>Back to Candidate Details</span>
                </button>

                <button
                  type="submit"
                  className="w-full sm:flex-1 bg-[#0F2B5C] hover:bg-[#18458F] active:scale-[0.99] text-white py-3 sm:py-3.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer min-h-[46px]"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Submit Admission Form & Enrol Candidate</span>
                </button>
              </div>
            </div>
          )}
        </form>
          )}
        </div>
      </div>

      {/* =========================================================================
          CAMERA POPUP MODAL (LIGHTBOX MODAL)
          ========================================================================= */}
      {isCameraOpen && (
        <div 
          className="fixed inset-0 z-[160] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-200"
          onClick={handleCloseCamera}
        >
          <div 
            className="bg-slate-900 border-2 border-slate-700 w-full max-w-md rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Popup Header */}
            <div className="bg-[#081d3d] text-white px-4 py-3 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                  <Camera className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white">Capture Student Photo</h4>
                  <p className="text-[10px] text-slate-400">Position candidate within the frame</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseCamera}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Popup Body */}
            <div className="p-4 space-y-3">
              {cameraError ? (
                <div className="p-4 bg-rose-950/80 border border-rose-500/50 rounded-xl text-rose-200 text-xs text-center space-y-2">
                  <p className="font-semibold">{cameraError}</p>
                  <button
                    type="button"
                    onClick={() => startCamera(cameraFacingMode)}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition cursor-pointer"
                  >
                    Retry Camera Access
                  </button>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-4/3 flex items-center justify-center border-2 border-slate-700 shadow-inner">
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    autoPlay
                    className={`w-full h-full object-cover ${cameraFacingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                  />
                  {/* Passport Photo Outline Guide */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-44 h-56 border-2 border-dashed border-amber-400/70 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
                  </div>
                  <span className="absolute bottom-2 bg-black/60 backdrop-blur-xs text-[10px] text-amber-300 font-bold px-2 py-0.5 rounded-full pointer-events-none">
                    Passport Photo Alignment
                  </span>
                </div>
              )}

              {/* Popup Controls */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCapturePhoto}
                  disabled={Boolean(cameraError)}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-50 text-white font-black text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-emerald-200" />
                  <span>Take Photo & Save</span>
                </button>

                <button
                  type="button"
                  onClick={handleFlipCamera}
                  className="px-3.5 py-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
                  title="Switch Front/Back Camera"
                >
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Flip</span>
                </button>

                <button
                  type="button"
                  onClick={handleCloseCamera}
                  className="px-3.5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer border border-slate-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PHOTO EDITOR POPUP MODAL (BACKGROUND COLOUR CHANGE)
          ========================================================================= */}
      {isPhotoEditorOpen && formData.photoPreview && (
        <div 
          className="fixed inset-0 z-[160] bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-200"
          onClick={() => setIsPhotoEditorOpen(false)}
        >
          <div 
            className="bg-slate-900 border-2 border-slate-700 w-full max-w-md rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#081d3d] text-white px-4 py-3 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold">
                  <Crop className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white">Change Photo Background</h4>
                  <p className="text-[10px] text-slate-400">Select standard passport background colour</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPhotoEditorOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview Workspace (Correct 3.5 : 4.5 Passport Proportion) */}
            <div className="p-4 space-y-3.5">
              <div className="flex justify-center">
                <div 
                  className="relative w-48 sm:w-56 aspect-[3.5/4.5] rounded-2xl overflow-hidden flex items-center justify-center border-2 border-slate-700 shadow-xl transition-colors duration-200"
                  style={{
                    backgroundColor: editorBgColor === 'original' ? '#020617' : editorBgColor
                  }}
                >
                  {/* Photo Element (Passport Fit: Consistent size & scale) */}
                  <img
                    ref={editorImageRef}
                    src={editorPreviewUrl || originalPhotoSrc || formData.photoPreview}
                    alt="Passport photo preview"
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover transition-all duration-200"
                  />

                  {/* Processing Overlay */}
                  {isProcessingBg && (
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-white z-10 animate-fade-in">
                      <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                      <span className="text-xs font-bold tracking-wide">
                        Replacing background with {editorBgColor === '#ffffff' ? 'White' : editorBgColor === '#38bdf8' ? 'Blue' : 'Grey'}...
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Background Color Selector: Only Blue, White, Grey */}
              <div className="space-y-2.5 bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 text-white text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                    Choose Background Colour:
                  </span>
                  <span className="text-[10px] font-mono text-amber-300 font-bold">
                    {editorBgColor === 'original' ? 'Original' : editorBgColor === '#ffffff' ? 'White' : editorBgColor === '#38bdf8' ? 'Blue' : editorBgColor === '#94a3b8' ? 'Grey' : editorBgColor}
                  </span>
                </div>

                {/* Swatches: Only Original, White, Blue, Grey */}
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[
                    { label: 'Original', value: 'original', bgClass: 'bg-slate-700 text-slate-200 border-slate-500' },
                    { label: 'White', value: '#ffffff', bgClass: 'bg-white border-slate-300 text-slate-900 font-black' },
                    { label: 'Blue', value: '#38bdf8', bgClass: 'bg-[#38bdf8] border-sky-400 text-slate-950 font-black' },
                    { label: 'Grey', value: '#94a3b8', bgClass: 'bg-[#94a3b8] border-slate-400 text-slate-950 font-black' }
                  ].map((swatch) => (
                    <button
                      key={swatch.value}
                      type="button"
                      disabled={isProcessingBg}
                      onClick={() => handleSelectBgColor(swatch.value)}
                      className={`h-11 rounded-xl border-2 flex flex-col items-center justify-center transition cursor-pointer relative ${swatch.bgClass} ${
                        editorBgColor === swatch.value 
                          ? 'ring-2 ring-amber-400 scale-105 shadow-md border-amber-400 font-black' 
                          : 'hover:scale-100 opacity-90'
                      } ${isProcessingBg ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title={swatch.label}
                    >
                      <span className="text-xs font-black truncate px-1">{swatch.label}</span>
                      {editorBgColor === swatch.value && (
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center text-[10px] font-black shadow-xs">
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  disabled={isProcessingBg}
                  onClick={handleApplyPhotoEdits}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>Apply Background Colour</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPhotoEditorOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer border border-slate-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
