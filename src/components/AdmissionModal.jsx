import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  GraduationCap, 
  Send, 
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
  Calendar,
  Building2,
  MapPin,
  CreditCard,
  QrCode,
  FileCheck2,
  Printer,
  Smartphone,
  PhoneCall,
  User,
  Image as ImageIcon,
  Loader2,
  ExternalLink,
  Sparkles,
  Trash2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { registerStudentAccount, generateRegisterNumber } from '../utils/authStorage';
import { getStoredCourses } from '../data/coursesData';
import { getStoredSchools } from '../data/schoolsData';

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

const BSEL_BRANCHES = [
  'Tenkasi Main Branch (Head Office)',
  'Chennai Central Branch',
  'Madurai Regional Centre',
  'Tirunelveli Skill Centre',
  'Coimbatore City Branch',
  'Salem Educational Centre',
  'Tiruchirappalli Branch',
  'Erode Learning Academy',
  'Thoothukudi Coastal Branch',
  'Online / Direct Distance Learning',
  'Other Authorized Study Centre'
];

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

export default function AdmissionModal({ 
  isOpen, 
  onClose, 
  setActivePage,
  initialProgram = null,
  initialFee = null
}) {
  const [coursesList, setCoursesList] = useState(() => getStoredCourses());
  const [schoolsList, setSchoolsList] = useState(() => getStoredSchools());

  useEffect(() => {
    const handleCourses = () => setCoursesList(getStoredCourses());
    const handleSchools = () => setSchoolsList(getStoredSchools());
    window.addEventListener('bsel_courses_updated', handleCourses);
    window.addEventListener('bsel_schools_updated', handleSchools);
    return () => {
      window.removeEventListener('bsel_courses_updated', handleCourses);
      window.removeEventListener('bsel_schools_updated', handleSchools);
    };
  }, []);

  const dynamicProgramNames = coursesList.map(c => c.fullName || c.name);
  const availablePrograms = dynamicProgramNames.length > 0 ? dynamicProgramNames : BSEL_PROGRAMS;

  const dynamicBranchNames = schoolsList.map(s => s.branchName || s.name);
  const availableBranches = dynamicBranchNames.length > 0 ? dynamicBranchNames : BSEL_BRANCHES;

  const initialCourse = initialProgram || availablePrograms[0] || 'Abacus Speed Arithmetic';
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], // 1. Date
    registerNumber: generateRegisterNumber(initialCourse), // 2. Register number [non-editable]
    branch: 'Tenkasi Main Branch (Head Office)', // 3. Branch
    courseName: initialCourse, // 4. Course Name [non-editable]
    studentName: '', // 7. Student name
    dob: '', // 8. Date of Birth
    age: '', // 9. Age
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
    feeAmount: initialFee || '₹450', // 16. Admission fee amount
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
  const [copiedField, setCopiedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
  const [districtSearch, setDistrictSearch] = useState('');
  const [districtError, setDistrictError] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const districtDropdownRef = useRef(null);
  const modalBodyRef = useRef(null);

  // Real-time Payment Gateway State
  const [paymentGatewayStatus, setPaymentGatewayStatus] = useState('idle'); // 'idle' | 'processing' | 'success'
  const [paymentGatewayTxn, setPaymentGatewayTxn] = useState('');
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
      setFormData(prev => ({
        ...prev,
        courseName: initialProgram,
        registerNumber: generateRegisterNumber(initialProgram),
        feeAmount: initialFee || prev.feeAmount || '₹450'
      }));
      setIsCourseLocked(true);
    }
  }, [initialProgram, initialFee, isOpen]);

  // Click outside listener for district dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (districtDropdownRef.current && !districtDropdownRef.current.contains(event.target)) {
        setDistrictDropdownOpen(false);
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

  if (!isOpen) return null;

  const filteredDistricts = TAMIL_NADU_DISTRICTS.filter((d) =>
    d.toLowerCase().includes(districtSearch.toLowerCase().trim())
  );

  // Auto calculate age from Date of Birth (Field 8 -> 9)
  const handleDobChange = (e) => {
    const dobVal = e.target.value;
    let computedAge = '';
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
      }
    }
    setFormData(prev => ({ ...prev, dob: dobVal, age: computedAge }));
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

  // Payment Screenshot Upload (Field 20)
  const handleScreenshotUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Payment screenshot size must be less than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          paymentScreenshot: reader.result,
          screenshotPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Aadhar Number formatting (Field 9: 12 numeric digits)
  const handleAadharChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 12);
    setFormData(prev => ({ ...prev, aadharNumber: digitsOnly }));
  };

  const handleCopy = (text, fieldName) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2500);
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

  const handleRemoveScreenshot = () => {
    setFormData(prev => ({
      ...prev,
      paymentScreenshot: null,
      screenshotPreview: null
    }));
  };

  const validateStep1 = () => {
    if (!formData.studentName.trim()) {
      alert('Please enter Student Full Name (Field 4).');
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
    if (!formData.phone.trim()) {
      alert('Please enter Mobile / WhatsApp number (Field 7).');
      return false;
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
    if (!formData.address.trim()) {
      alert('Please enter Residential Address (Field 11).');
      return false;
    }
    if (!formData.city.trim()) {
      alert('Please enter City / Town (Field 13).');
      return false;
    }
    if (!formData.district) {
      setDistrictError(true);
      alert('Please select District (Field 14).');
      if (districtDropdownRef.current) {
        districtDropdownRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }
    if (!formData.pincode.trim() || formData.pincode.length < 6) {
      alert('Please enter a valid 6-digit PIN Code (Field 15).');
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
    e.preventDefault();

    if (!validateStep1()) {
      setFormStep(1);
      modalBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (formStep === 1) {
      handleProceedToPayment();
      return;
    }

    if (formData.feePaymentType === 'Pay Now' && !formData.receiptRefNo.trim()) {
      alert('Please enter the Payment Reference / Receipt / Transaction Number (Field 19).');
      return;
    }

    if (!formData.declaration) {
      alert('Please check the Official Declaration box (Field 21) to confirm your admission.');
      return;
    }

    setPhotoError(false);
    setDistrictError(false);
    const account = registerStudentAccount({
      ...formData,
      name: formData.studentName,
      program: formData.courseName
    });
    setCreatedAccount(account);
    setSubmitted(true);
    modalBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormStep(1);
    setCreatedAccount(null);
    setDistrictError(false);
    setPhotoError(false);
    setPaymentGatewayStatus('idle');
    setPaymentGatewayTxn('');
    setCardDetails({ number: '', expiry: '', cvv: '', name: '' });
    setCopiedUpi(false);
    const resetCourse = initialProgram || 'Abacus Speed Arithmetic';
    setFormData({
      date: new Date().toISOString().split('T')[0],
      registerNumber: generateRegisterNumber(resetCourse),
      branch: 'Tenkasi Main Branch (Head Office)',
      courseName: resetCourse,
      studentName: '',
      dob: '',
      age: '',
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
      feeAmount: initialFee || '₹450',
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
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 select-none"
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

          {/* Form Step Progress Bar (hidden once admission is confirmed) */}
          {!submitted && (
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
            <div className="border-2 border-emerald-500/40 rounded-2xl p-4 sm:p-6 space-y-4 bg-emerald-50/20">
              {/* Status Header */}
              <div className="text-center space-y-1 sm:space-y-1.5">
                <div className="inline-flex p-2.5 rounded-2xl bg-emerald-100 text-emerald-700 mb-0.5">
                  <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <span className="inline-block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-3 py-0.5 rounded-full">
                  Admission Successfully Confirmed
                </span>
                <h4 className="text-lg sm:text-2xl font-black text-slate-900 font-heading">
                  Welcome, {createdAccount.studentName}!
                </h4>
                <p className="text-xs text-slate-700 max-w-lg mx-auto font-medium">
                  Candidate has been officially enrolled in <strong className="text-slate-900">{formData.courseName}</strong> at <strong className="text-slate-900">{formData.branch}</strong>.
                </p>
              </div>

              {/* Printable Official Slip Card */}
              <div id="admission-slip" className="bg-white border-2 border-slate-300 rounded-2xl p-3.5 sm:p-5 space-y-3 shadow-xs text-left">
                <div className="flex items-center justify-between pb-2.5 border-b-2 border-slate-100">
                  <div className="flex items-center gap-2.5">
                    {formData.photoPreview ? (
                      <img 
                        src={formData.photoPreview} 
                        alt={formData.studentName} 
                        className="w-12 h-12 rounded-xl object-cover border-2 border-sky-600 shrink-0" 
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-400 shrink-0">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-sky-800 block">Official Admission Slip</span>
                      <h5 className="text-sm font-black text-slate-900 leading-snug">{formData.studentName}</h5>
                      <span className="text-[10px] text-slate-600 font-bold">{formData.gender} • {formData.age} Years</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300 block">
                      Reg: {createdAccount.registerNumber || formData.registerNumber}
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-sky-100 text-sky-900 px-2 py-0.5 rounded block mt-1">
                      ID: {createdAccount.userId}
                    </span>
                    <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">Date: {formData.date}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Register Number:</span>
                    <strong className="text-amber-900 font-mono font-black truncate block">
                      {createdAccount.registerNumber || formData.registerNumber}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Course Enrolled:</span>
                    <strong className="text-slate-900 font-bold truncate block">{formData.courseName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Branch / Centre:</span>
                    <strong className="text-slate-900 font-bold truncate block">{formData.branch}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Contact Number:</span>
                    <strong className="text-slate-900 font-bold block">{formData.phone}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Aadhar Number:</span>
                    <strong className="text-slate-900 font-bold block font-mono">
                      {formData.aadharNumber ? `XXXX-XXXX-${formData.aadharNumber.slice(-4)}` : 'Verified'}
                    </strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 text-[10px] block">Residential Address:</span>
                    <strong className="text-slate-900 font-bold block text-[11px]">
                      {formData.address}, {formData.village && `${formData.village}, `}{formData.city}, {formData.district} - {formData.pincode}
                    </strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Fee Payment Status:</span>
                    <span className={`inline-flex items-center gap-1 font-black text-[11px] ${
                      formData.feePaymentType === 'Pay Now' ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      {formData.feePaymentType === 'Pay Now' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Paid ({formData.feeAmount}) via {formData.paymentMode}</span>
                        </>
                      ) : (
                        <span>Pay Later at Branch ({formData.feeAmount})</span>
                      )}
                    </span>
                    {formData.receiptRefNo && (
                      <span className="text-[10px] font-mono text-slate-600 block">Ref: {formData.receiptRefNo}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Portal Login Credentials Box */}
              <div className="bg-gradient-to-br from-[#0F2B5C] via-[#143B7A] to-[#1E4D99] rounded-2xl p-4 text-white space-y-3 shadow-md">
                <div className="flex items-center justify-between border-b border-white/15 pb-2">
                  <div className="flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                      Student Portal Credentials
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(`User ID: ${createdAccount.userId}\nPassword: ${createdAccount.password}`, 'all')}
                    className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white flex items-center gap-1 transition cursor-pointer"
                  >
                    {copiedField === 'all' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-300">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Login Info</span>
                      </>
                    )}
                  </button>
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
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full sm:flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 border border-slate-300 cursor-pointer min-h-[42px]"
                >
                  <Printer className="w-4 h-4 text-slate-700" />
                  <span>Print Admission Slip</span>
                </button>

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
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-2.5 sm:px-3 py-2 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none text-base sm:text-sm shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-black text-slate-800 mb-0.5 sm:mb-1 truncate">
                      2. Branch *
                    </label>
                    <select
                      required
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      className="w-full px-2 sm:px-3 py-2 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none text-base sm:text-sm shadow-2xs truncate"
                    >
                      {availableBranches.map((b, i) => (
                        <option key={i} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 3. Course Name [non - editable] */}
                <div>
                  <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                    <label className="block text-[11px] sm:text-xs font-black text-slate-800">
                      3. Course Name *
                    </label>
                    <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-600" />
                      <span>Non-editable</span>
                    </span>
                  </div>

                  {isCourseLocked ? (
                    <div className="w-full px-3 py-2 sm:py-2.5 bg-slate-100 border-2 border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-black text-xs sm:text-sm flex items-center justify-between shadow-inner">
                      <span className="truncate">{formData.courseName}</span>
                      <span className="text-[10px] text-slate-500 font-bold shrink-0">B★SEL Syllabus</span>
                    </div>
                  ) : (
                    <select
                      value={formData.courseName}
                      onChange={(e) => {
                        const newProg = e.target.value;
                        const matched = coursesList.find(c => c.fullName === newProg || c.name === newProg || c.id === newProg);
                        const newFee = matched ? (matched.fee || '₹450') : formData.feeAmount;
                        setFormData({ 
                          ...formData, 
                          courseName: newProg,
                          feeAmount: newFee,
                          registerNumber: generateRegisterNumber(newProg)
                        });
                      }}
                      className="w-full px-2.5 sm:px-3 py-2 bg-white border-2 border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-black text-base sm:text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none shadow-2xs"
                    >
                      {availablePrograms.map((prog, i) => (
                        <option key={i} value={prog}>{prog}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* SECTION 2: STUDENT PERSONAL DETAILS */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 space-y-2.5">
                <span className="text-[10px] sm:text-xs font-black uppercase text-sky-900 tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
                  <User className="w-3.5 h-3.5 text-sky-700" />
                  <span>Section 2: Candidate Personal Information</span>
                </span>

                {/* 4. Student Name */}
                <div>
                  <label className="block text-[11px] sm:text-xs font-black text-slate-800 mb-0.5 sm:mb-1">
                    4. Student Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none text-base sm:text-sm shadow-2xs"
                  />
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
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full px-2.5 sm:px-3 py-2 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-semibold text-center text-base sm:text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none shadow-2xs min-h-[42px]"
                    />
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

                {/* 7. Phone & 8. Alternate Phone (2-Col on Mobile) */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-black text-slate-800 mb-0.5 sm:mb-1 truncate">
                      7. Mobile / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-2.5 sm:px-3 py-2 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none text-base sm:text-sm shadow-2xs min-h-[42px]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-black text-slate-800 mb-0.5 sm:mb-1 truncate">
                      8. Alternate Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.alternatePhone}
                      onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                      className="w-full px-2.5 sm:px-3 py-2 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none text-base sm:text-sm shadow-2xs min-h-[42px]"
                    />
                  </div>
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
                    <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                      <label className="block text-[11px] sm:text-xs font-black text-slate-800 truncate">
                        10. Student Photo *
                      </label>
                      <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                        Compulsory
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className={`flex-1 flex items-center justify-center gap-1.5 px-2.5 py-2 bg-white border-2 rounded-lg sm:rounded-xl cursor-pointer hover:bg-slate-50 transition font-bold text-xs truncate shadow-2xs min-h-[42px] ${
                        photoError 
                          ? 'border-rose-500 bg-rose-50/20 text-rose-700 ring-2 ring-rose-400/20' 
                          : formData.photoPreview
                          ? 'border-emerald-500 bg-emerald-50/20 text-emerald-800'
                          : 'border-slate-300 text-slate-800'
                      }`}>
                        <Upload className={`w-3.5 h-3.5 shrink-0 ${photoError ? 'text-rose-600' : 'text-sky-700'}`} />
                        <span className="truncate">{formData.photoPreview ? 'Photo Uploaded ✓' : 'Upload Student Photo *'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          required={!formData.photoPreview}
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                      {formData.photoPreview && (
                        <img 
                          src={formData.photoPreview} 
                          alt="Student preview" 
                          className="w-10 h-10 rounded-lg object-cover border-2 border-emerald-600 shrink-0 shadow-xs" 
                        />
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
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 space-y-2.5">
                <span className="text-[10px] sm:text-xs font-black uppercase text-sky-900 tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-700" />
                  <span>Section 3: Address & Location Details</span>
                </span>

                {/* 11. Address */}
                <div>
                  <label className="block text-[11px] sm:text-xs font-black text-slate-800 mb-0.5 sm:mb-1">
                    11. Residential Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none text-base sm:text-sm shadow-2xs"
                  />
                </div>

                {/* 12. Village & 13. City (2-Col on Mobile) */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-black text-slate-800 mb-0.5 sm:mb-1 truncate">
                      12. Village / Locality
                    </label>
                    <input
                      type="text"
                      value={formData.village}
                      onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                      className="w-full px-2.5 sm:px-3 py-2 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none text-base sm:text-sm shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-black text-slate-800 mb-0.5 sm:mb-1 truncate">
                      13. City / Town *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-2.5 sm:px-3 py-2 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none text-base sm:text-sm shadow-2xs"
                    />
                  </div>
                </div>

                {/* 14. District & 15. PIN Code (2-Col on Mobile) */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  {/* 14. District Dropdown */}
                  <div className="relative" ref={districtDropdownRef}>
                    <label className="block text-[11px] sm:text-xs font-black text-slate-800 mb-0.5 sm:mb-1 truncate">
                      14. District *
                    </label>
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

                  {/* 15. PIN Code */}
                  <div>
                    <label className="block text-[11px] sm:text-xs font-black text-slate-800 mb-0.5 sm:mb-1 truncate">
                      15. PIN Code *
                    </label>
                    <input
                      type="text"
                      maxLength="6"
                      required
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                      className="w-full px-2.5 sm:px-3 py-2 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none text-base sm:text-sm shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* PAGE 1 BOTTOM ACTION BUTTON: PROCEED TO PAYMENT */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="w-full bg-[#0F2B5C] hover:bg-[#18458F] active:scale-[0.99] text-white py-3 sm:py-3.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer min-h-[46px]"
                >
                  <span>Proceed to Fee & Payment (Step 2 of 2)</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>
          ) : (
            /* =========================================================================
               PAGE 2: FEES, PAYMENT DETAILS, SCREENSHOT UPLOAD & DECLARATION
               ========================================================================= */
            <div className="space-y-3 sm:space-y-4 animate-in fade-in duration-200">
              {/* Candidate Summary Pill Card */}
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 flex items-center justify-between gap-3 text-left">
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
                      {formData.courseName} • {formData.branch}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setFormStep(1);
                    modalBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-2.5 py-1.5 bg-white border border-slate-300 hover:border-slate-400 rounded-lg text-slate-700 hover:text-slate-950 text-[11px] font-black transition cursor-pointer shrink-0 shadow-2xs"
                >
                  Edit Step 1
                </button>
              </div>

              {/* SECTION 4: ADMISSION FEE & REAL-TIME PAYMENT GATEWAY */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-[10px] sm:text-xs font-black uppercase text-sky-900 tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-sky-700" />
                    <span>Section 4: Fee & Real-Time Payment Gateway</span>
                  </span>

                  {/* Real-time Status Badge */}
                  {formData.feePaymentType === 'Pay Later' ? (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                      Pay at Branch
                    </span>
                  ) : paymentGatewayStatus === 'success' ? (
                    <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified in Real-Time ✓</span>
                    </span>
                  ) : null}
                </div>

                {/* 16. Fee Payment Option & 17. Fee Amount */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 items-center">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-black text-slate-800 mb-1">
                      16. Fee Payment Option *
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 bg-slate-200/80 p-1 rounded-lg">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, feePaymentType: 'Pay Now' });
                          if (formData.paymentMode === 'Cash at Branch') {
                            setFormData(prev => ({ ...prev, paymentMode: 'UPI / QR Code' }));
                          }
                        }}
                        className={`py-2 px-2.5 rounded-md text-xs font-black transition cursor-pointer text-center min-h-[38px] ${
                          formData.feePaymentType === 'Pay Now'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-700 hover:text-slate-950'
                        }`}
                      >
                        Pay Now
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ 
                            ...formData, 
                            feePaymentType: 'Pay Later',
                            receiptRefNo: 'CASH-PAY-LATER-AT-BRANCH'
                          });
                          setPaymentGatewayStatus('idle');
                        }}
                        className={`py-2 px-2.5 rounded-md text-xs font-black transition cursor-pointer text-center min-h-[38px] ${
                          formData.feePaymentType === 'Pay Later'
                            ? 'bg-[#0F2B5C] text-white shadow-xs'
                            : 'text-slate-700 hover:text-slate-950'
                        }`}
                      >
                        Pay Later
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-black text-slate-800 mb-1">
                      17. Total Amount Payable
                    </label>
                    <div className="px-3.5 py-2 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 font-black text-sm sm:text-base flex items-center justify-between shadow-2xs min-h-[40px]">
                      <span className="text-xs text-emerald-700 font-semibold">Payable:</span>
                      <span className="text-sm sm:text-base font-black">{formData.feeAmount}</span>
                    </div>
                  </div>
                </div>

                {/* When 'Pay Now' is selected: Interactive Real-Time Payment Methods */}
                {formData.feePaymentType === 'Pay Now' ? (
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

                    {/* 19. Ref / Receipt No & 20. Screenshot Upload */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 pt-1">
                      {/* 19. Receipt / Ref Number */}
                      <div>
                        <label className="block text-[11px] sm:text-xs font-black text-slate-800 mb-0.5 truncate">
                          19. Transaction / Ref No. *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.receiptRefNo}
                          onChange={(e) => setFormData({ ...formData, receiptRefNo: e.target.value })}
                          className="w-full px-2.5 sm:px-3 py-2 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-slate-950 font-mono font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none text-base sm:text-sm shadow-2xs"
                        />
                      </div>

                      {/* 20. Payment Screenshot Upload */}
                      <div>
                        <div className="flex items-center justify-between mb-0.5">
                          <label className="block text-[11px] sm:text-xs font-black text-slate-800 truncate">
                            20. Payment Screenshot
                          </label>
                          <span className="text-[10px] text-slate-500">
                            {paymentGatewayStatus === 'success' ? 'Optional (Verified)' : 'Recommended'}
                          </span>
                        </div>

                        {formData.screenshotPreview ? (
                          <div className="flex items-center justify-between gap-2 p-1.5 bg-emerald-50 border border-emerald-300 rounded-lg">
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={formData.screenshotPreview}
                                alt="Payment proof"
                                className="w-8 h-8 rounded object-cover border border-emerald-500 shrink-0"
                              />
                              <span className="text-[11px] text-emerald-900 font-bold truncate">Screenshot Attached ✓</span>
                            </div>
                            <button
                              type="button"
                              onClick={handleRemoveScreenshot}
                              className="p-1 hover:bg-rose-100 text-rose-600 rounded transition cursor-pointer"
                              title="Remove screenshot"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-slate-300 rounded-lg sm:rounded-xl cursor-pointer hover:bg-slate-50 transition text-slate-800 font-bold text-xs truncate shadow-2xs">
                            <Upload className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                            <span>Upload Payment Screenshot</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleScreenshotUpload}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-amber-900 text-xs font-semibold flex items-center gap-2 text-left">
                    <FileCheck2 className="w-5 h-5 text-amber-700 shrink-0" />
                    <span>
                      You have selected <strong>Pay Later</strong>. You can pay the admission fee of <strong>{formData.feeAmount}</strong> in cash directly at your assigned branch during batch orientation and document verification.
                    </span>
                  </div>
                )}
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
                    <strong>21. Declaration:</strong> I hereby declare that all the information furnished above is true and complete to the best of my knowledge. I agree to abide by the academic regulations and code of conduct of the Board of Skills and Educational Learning (B★SEL).
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
    </div>
  );
}
