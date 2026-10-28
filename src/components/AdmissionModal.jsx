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
  ShieldCheck, 
  Eye, 
  EyeOff, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { registerStudentAccount } from '../utils/authStorage';

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

export default function AdmissionModal({ isOpen, onClose, setActivePage }) {
  const [formData, setFormData] = useState({
    name: '',
    parentName: '',
    email: '',
    phone: '',
    grade: '',
    program: 'Abacus Speed Arithmetic',
    district: '',
    address: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [createdAccount, setCreatedAccount] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
  const [districtSearch, setDistrictSearch] = useState('');
  const [districtError, setDistrictError] = useState(false);
  const districtDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (districtDropdownRef.current && !districtDropdownRef.current.contains(event.target)) {
        setDistrictDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const filteredDistricts = TAMIL_NADU_DISTRICTS.filter((d) =>
    d.toLowerCase().includes(districtSearch.toLowerCase().trim())
  );

  const handleCopy = (text, fieldName) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2500);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.district) {
      setDistrictError(true);
      if (districtDropdownRef.current) {
        districtDropdownRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    setDistrictError(false);
    const account = registerStudentAccount(formData);
    setCreatedAccount(account);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setCreatedAccount(null);
    setDistrictError(false);
    setFormData({
      name: '',
      parentName: '',
      email: '',
      phone: '',
      grade: '',
      program: 'Abacus Speed Arithmetic',
      district: '',
      address: ''
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 select-none"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-2xl sm:rounded-3xl max-w-2xl sm:max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh] sm:max-h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#0F2B5C] via-[#143B7A] to-[#1E4D99] text-white p-4 sm:p-6 relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-1.5 transition cursor-pointer z-10 active:scale-95"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2 pr-8">
            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0">
              <GraduationCap className="w-4 h-4 text-slate-950" />
            </span>
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-amber-300">
              Student Enrolment
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-black font-heading text-white leading-tight">
            Admission Enquiry
          </h3>
          <p className="text-xs sm:text-sm text-sky-200 mt-1 leading-relaxed font-semibold">
            Please fill in the student and parent details below to enquire about admissions, course batches, and center locations.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1 text-slate-900">
          {submitted && createdAccount ? (
            <div className="border-2 border-emerald-500/40 rounded-2xl p-5 sm:p-7 space-y-5 bg-emerald-50/20">
              {/* Status Header */}
              <div className="text-center space-y-2">
                <div className="inline-flex p-3 rounded-2xl bg-emerald-100 text-emerald-700 mb-1">
                  <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <span className="inline-block text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full">
                  Enrolment & Admission Enquiry Registered
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                  Welcome to B★SEL Learning!
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 max-w-lg mx-auto font-medium">
                  Admission enquiry for <strong className="text-slate-900 font-extrabold">{createdAccount.studentName}</strong> has been logged. An official login account has been generated for accessing the student portal.
                </p>
              </div>

              {/* Exclusive Login Notice */}
              <div className="bg-amber-50 border-l-4 border-amber-500 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-900">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-black text-amber-950 text-xs sm:text-sm">Important: Exclusive Login Access</strong>
                  <span>You can <strong>ONLY log in using this specific User ID and Password</strong>. Please write them down or copy them now.</span>
                </div>
              </div>

              {/* Credentials Showcase Box */}
              <div className="bg-gradient-to-br from-[#0F2B5C] via-[#143B7A] to-[#1E4D99] rounded-2xl p-4 sm:p-5 text-white space-y-4 shadow-md">
                <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                    <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-300">
                      Your Official Portal Credentials
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(`User ID: ${createdAccount.userId}\nPassword: ${createdAccount.password}`, 'all')}
                    className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedField === 'all' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Copied Both!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Both</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* User ID Box */}
                  <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl p-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-200">
                        Assigned User ID
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(createdAccount.userId, 'id')}
                        className="text-[11px] font-bold text-amber-300 hover:text-white flex items-center gap-1 transition cursor-pointer"
                      >
                        {copiedField === 'id' ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-300">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="font-mono text-base sm:text-lg font-black text-white tracking-wider">
                      {createdAccount.userId}
                    </div>
                  </div>

                  {/* Password Box */}
                  <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl p-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-200">
                        Password (Phone Number)
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-white/70 hover:text-white transition cursor-pointer"
                          title={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopy(createdAccount.password, 'password')}
                          className="text-[11px] font-bold text-amber-300 hover:text-white flex items-center gap-1 transition cursor-pointer"
                        >
                          {copiedField === 'password' ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-300">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="font-mono text-base sm:text-lg font-black text-amber-300 tracking-wider">
                      {showPassword ? createdAccount.password : '••••••••'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                {setActivePage && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setActivePage('login');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full sm:flex-1 py-3 px-5 bg-[#0F2B5C] hover:bg-[#18458F] text-white text-xs sm:text-sm font-black rounded-xl transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>Proceed to Student Login Portal</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto py-3 px-5 border-2 border-slate-300 text-slate-800 hover:bg-slate-100 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer"
                >
                  Submit Another Enquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Student Name & Parent's Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-black mb-1">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-base sm:text-sm text-black font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-black mb-1">
                    Parent's Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-base sm:text-sm text-black font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Email ID & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-black mb-1">
                    Email ID *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-base sm:text-sm text-black font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-black mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-base sm:text-sm text-black font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Grade & Program */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-black mb-1">
                    Grade / Class (Upto 14 Years) *
                  </label>
                  <select
                    required
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-base sm:text-sm text-black font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                  >
                    <option value="">Select Grade / Class (Upto 14 Years)</option>
                    <option value="Kindergarten (Age 3 to 5)">Kindergarten (Pre-KG / LKG / UKG - Age 3 to 5 Years)</option>
                    <option value="Grade 1 (Age 5 to 6)">Grade 1 (Age 5 to 6 Years)</option>
                    <option value="Grade 2 (Age 6 to 7)">Grade 2 (Age 6 to 7 Years)</option>
                    <option value="Grade 3 (Age 7 to 8)">Grade 3 (Age 7 to 8 Years)</option>
                    <option value="Grade 4 (Age 8 to 9)">Grade 4 (Age 8 to 9 Years)</option>
                    <option value="Grade 5 (Age 9 to 10)">Grade 5 (Age 9 to 10 Years)</option>
                    <option value="Grade 6 (Age 10 to 11)">Grade 6 (Age 10 to 11 Years)</option>
                    <option value="Grade 7 (Age 11 to 12)">Grade 7 (Age 11 to 12 Years)</option>
                    <option value="Grade 8 (Age 12 to 13)">Grade 8 (Age 12 to 13 Years)</option>
                    <option value="Grade 9 (Age 13 to 14 - Upto 14 Yrs)">Grade 9 (Age 13 to 14 Years - Upto 14 Yrs)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-black mb-1">
                    Program *
                  </label>
                  <select
                    required
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-base sm:text-sm text-black font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                  >
                    <option value="Abacus Speed Arithmetic">Abacus Speed Arithmetic</option>
                    <option value="Drawing & Fine Arts">Drawing & Fine Arts</option>
                    <option value="Handwriting Improvement">Handwriting Improvement</option>
                    <option value="Bharatanatyam Classical Dance">Bharatanatyam Classical Dance</option>
                    <option value="Western Dance">Western Dance</option>
                    <option value="Phonics & Spoken English">Phonics & Spoken English</option>
                    <option value="Vedic Mathematics">Vedic Mathematics</option>
                  </select>
                </div>
              </div>

              {/* District Dropdown */}
              <div className="relative" ref={districtDropdownRef}>
                <label className="block text-xs font-black text-black mb-1">
                  District *
                </label>
                <button
                  type="button"
                  onClick={() => setDistrictDropdownOpen(!districtDropdownOpen)}
                  className={`w-full px-3.5 py-2.5 text-base sm:text-sm font-semibold rounded-xl border-2 transition flex items-center justify-between text-left cursor-pointer bg-white ${
                    districtError
                      ? 'border-rose-500 bg-rose-50/20'
                      : districtDropdownOpen
                      ? 'border-sky-500 ring-2 ring-sky-500/20'
                      : 'border-slate-300'
                  }`}
                >
                  <span className={formData.district ? 'text-black font-semibold' : 'text-slate-400'}>
                    {formData.district || 'Select District'}
                  </span>
                  {districtDropdownOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>

                {districtError && (
                  <p className="text-xs text-rose-600 font-bold mt-1">
                    Please select a district to proceed with enrolment.
                  </p>
                )}

                {districtDropdownOpen && (
                  <div className="absolute z-30 left-0 right-0 top-full mt-1 bg-white border-2 border-slate-300 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-2 border-b border-slate-200 bg-slate-50">
                      <input
                        type="text"
                        value={districtSearch}
                        onChange={(e) => setDistrictSearch(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs text-black font-semibold border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500 bg-white"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto p-1 divide-y divide-slate-100">
                      {filteredDistricts.length > 0 ? (
                        filteredDistricts.map((dist) => {
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
                              className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? 'bg-sky-50 text-sky-900 font-bold'
                                  : 'text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <span>{dist}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />}
                            </button>
                          );
                        })
                      ) : (
                        <div className="p-3 text-center text-xs text-slate-400">
                          No district matching "{districtSearch}"
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-black text-black mb-1">
                  Address *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-base sm:text-sm text-black font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0F2B5C] hover:bg-[#18458F] active:scale-[0.99] text-white py-3.5 rounded-xl font-black text-sm transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Admission Enquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}