import React, { useEffect, useState } from 'react';
import {
  UserRound,
  Phone,
  GraduationCap,
  Building2,
  Save,
  Pencil,
  X,
  CheckCircle2,
  ShieldCheck,
  CalendarDays,
  MapPin,
  IdCard,
  BookOpen,
  Camera,
  Clock,
  School,
  MapPinned,
  ImagePlus,
  Hash,
  CalendarClock,
  Lock,
  Receipt,
  CreditCard,
  Layers,
} from 'lucide-react';
import { generateRegisterNumber } from '../../utils/authStorage';

// Get profile information from the student object.
const getProfileValues = (student = {}) => {
  const rawList = Array.isArray(student.selectedCourses) && student.selectedCourses.length > 0
    ? student.selectedCourses
    : (Array.isArray(student.courses) && student.courses.length > 0 ? student.courses : []);

  // Ensure each course has its unique official register number
  const usedRegs = [];
  const selectedList = rawList.map((c, idx) => {
    let reg = c.registerNumber || c.registrationNo;
    if (!reg || reg === 'Not provided' || usedRegs.includes(reg) || (idx > 0 && reg === rawList[0]?.registerNumber)) {
      reg = generateRegisterNumber(c.courseName || c.name || 'Abacus', usedRegs);
    }
    usedRegs.push(reg);
    return {
      ...c,
      registerNumber: reg,
      registrationNo: reg,
    };
  });

  const allRegNumbers = selectedList.length > 0
    ? selectedList.map(c => c.registerNumber).filter(Boolean)
    : (Array.isArray(student.registerNumbers) && student.registerNumbers.length > 0
        ? student.registerNumbers
        : (student.registerNumber || student.registrationNo ? [student.registerNumber || student.registrationNo] : []));

  const derivedRegisterNumber = allRegNumbers.length > 0
    ? allRegNumbers.join(', ')
    : (student.registerNumber || student.registrationNo || '');

  const derivedCourseName = selectedList.length > 1
    ? selectedList.map(c => c.courseName || c.name).filter(Boolean).join(' & ')
    : (student.courseName || student.program || student.course || (selectedList[0]?.courseName || ''));

  const derivedCourseLevel = selectedList.length > 1
    ? selectedList.map(c => `${c.courseName || c.name}: ${c.level || 'Level 1'}`).join(' | ')
    : (student.courseLevel || student.level || student.grade || selectedList[0]?.level || 'Level 1');

  return {
    date: student.date || student.enrollmentDate || student.enrolmentDate || '',
    registerNumber: derivedRegisterNumber,
    registerNumbers: allRegNumbers,
    branch: student.branch || student.institution || student.studyCenter || 'Tenkasi',
    institution: student.institution || student.branch || student.studyCenter || 'Tenkasi',
    studyCenter: student.studyCenter || student.branch || student.institution || 'Tenkasi',
    courseName: derivedCourseName,
    courseLevel: derivedCourseLevel,
    courseDuration: student.courseDuration || student.duration || '6 Months',
    selectedCourses: selectedList,

    name: student.name || student.studentName || '',
    parentName: student.parentName || student.fatherName || '',
    fatherName: student.parentName || student.fatherName || '',
    dateOfBirth: student.dateOfBirth || student.dob || '',
    age: student.age ?? '',
    gender: student.gender || '',
    studentClass: student.studentClass || '',
    studentStage: student.studentStage || '',
    phone: student.phone || '',
    alternatePhone: student.alternatePhone || student.alternativePhone || '',

    address: student.address || '',
    village: student.village || '',
    city: student.city || '',
    district: student.district || '',
    pincode: student.pincode || student.pinCode || '',

    aadhaarNumber: student.aadhaarNumber || student.aadharNumber || '',

    feePaymentType: student.feePaymentType || 'Pay Now',
    feeAmount: student.feeAmount || '',
    paymentMode: student.paymentMode || '',
    receiptRefNo: student.receiptRefNo || '',

    studentPhoto:
      student.studentPhoto ||
      student.photoURL ||
      student.photoUrl ||
      student.profilePhoto ||
      student.photo ||
      '',
  };
};

const displayValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'Not provided';
  }

  return String(value);
};

// Calculate age from the date of birth.
const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return '';

  const birthDate = new Date(`${dateOfBirth}T00:00:00`);

  if (Number.isNaN(birthDate.getTime())) return '';

  const today = new Date();

  if (birthDate > today) return '';

  let age = today.getFullYear() - birthDate.getFullYear();

  const birthdayNotReached =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate());

  if (birthdayNotReached) age--;

  return age >= 0 ? String(age) : '';
};

// Mask Aadhaar when the profile is not being edited.
const maskAadhaar = (value) => {
  if (!value) return 'Not provided';

  const digits = String(value).replace(/\D/g, '');

  if (digits.length !== 12) {
    return '•••• •••• ••••';
  }

  return `•••• •••• ${digits.slice(-4)}`;
};

function ProfileField({
  label,
  name,
  value,
  onChange,
  icon: Icon,
  type = 'text',
  readOnly = false,
  isLocked = false,
  options,
  placeholder,
  maxLength,
  inputMode,
}) {
  const isFieldDisabled = readOnly || isLocked;

  const fieldClass = `w-full min-w-0 rounded-xl border py-2.5 sm:py-3 text-xs sm:text-sm outline-none transition truncate ${
    Icon ? 'pl-9 sm:pl-10' : 'px-3 sm:px-4'
  } ${
    isLocked
      ? 'pr-3 sm:pr-4 border-slate-200 bg-slate-100/80 text-slate-700 cursor-not-allowed font-medium'
      : readOnly
      ? 'pr-3 sm:pr-4 border-slate-200 bg-slate-50 text-slate-600 cursor-default'
      : 'pr-3 sm:pr-4 border-slate-300 bg-white text-slate-900 focus:border-blue-800 focus:ring-2 focus:ring-blue-100'
  }`;

  return (
    <div className="min-w-0">
      <label
        htmlFor={name}
        className="mb-1 sm:mb-1.5 block text-[11px] sm:text-xs font-bold text-slate-700 truncate"
        title={label}
      >
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 sm:left-3.5 sm:h-4 sm:w-4 -translate-y-1/2 text-slate-400" />
        )}

        {options && !isFieldDisabled ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={fieldClass}
          >
            <option value="">Select {label.toLowerCase()}</option>

            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value ?? ''}
            onChange={onChange}
            readOnly={isFieldDisabled}
            placeholder={
              placeholder || `Enter ${label.toLowerCase()}`
            }
            maxLength={maxLength}
            inputMode={inputMode}
            className={fieldClass}
          />
        )}
      </div>
    </div>
  );
}

function SectionHeading({ icon: Icon, title, description, badge }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3 sm:mb-5">
      <div className="flex items-start gap-2.5 sm:gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-900 sm:h-10 sm:w-10">
          <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-extrabold text-blue-950 sm:text-lg">
              {title}
            </h3>
            {badge}
          </div>

          <p className="mt-0.5 text-xs leading-5 text-slate-500 sm:mt-1 sm:text-sm">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function ProfileSection({
  icon,
  title,
  description,
  badge,
  children,
  gridCols = 'grid-cols-1 sm:grid-cols-2',
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm sm:p-6">
      <SectionHeading
        icon={icon}
        title={title}
        description={description}
        badge={badge}
      />

      <div className={`grid ${gridCols} gap-3 sm:gap-5`}>
        {children}
      </div>
    </section>
  );
}

export default function StudentProfile({
  student,
  onUpdateStudent,
}) {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState(() =>
    getProfileValues(student)
  );

  useEffect(() => {
    setForm(getProfileValues(student));
  }, [student]);

  const studentId =
    student?.userId ||
    student?.id ||
    student?.studentId ||
    '';

  const registerNumber =
    form.registerNumber ||
    student?.registerNumber ||
    student?.registrationNo ||
    '';

  const allRegNumbers = Array.isArray(form.selectedCourses) && form.selectedCourses.length > 0
    ? form.selectedCourses.map((c) => c.registerNumber).filter(Boolean)
    : (Array.isArray(student?.registerNumbers) && student.registerNumbers.length > 0
        ? student.registerNumbers
        : (registerNumber ? registerNumber.split(',').map((s) => s.trim()).filter(Boolean) : []));

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => {
      const updated = {
        ...previous,
        [name]: value,
      };

      // Update age automatically when dateOfBirth changes
      if (name === 'dateOfBirth') {
        updated.age = calculateAge(value);
      }

      return updated;
    });

    setSaved(false);
    setError('');
  };

  // Convert selected photo into data URL
  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError('');
    setSaved(false);

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      event.target.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Please select a photo smaller than 2 MB.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setForm((previous) => ({
        ...previous,
        studentPhoto: String(reader.result || ''),
      }));
    };

    reader.onerror = () => {
      setError('Unable to read this photo. Please try another image.');
    };

    reader.readAsDataURL(file);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    setError('');
    setSaved(false);

    const phonePattern = /^[0-9+\-\s()]{7,20}$/;

    if (
      form.alternatePhone &&
      !phonePattern.test(form.alternatePhone)
    ) {
      setError('Please enter a valid alternative phone number.');
      return;
    }

    const pinDigits = String(form.pincode).replace(/\D/g, '');

    if (form.pincode && !/^\d{6}$/.test(pinDigits)) {
      setError('Please enter a valid 6-digit PIN code.');
      return;
    }

    if (typeof onUpdateStudent !== 'function') {
      setError(
        'Profile updates are not connected. Please contact the administrator.'
      );
      return;
    }

    // STRICT GUARANTEE: Keep all official admission and course fields locked
    // Only update student-managed contact and address fields
    const updatedStudent = {
      ...student,
      // Retain official admission & academic values
      date: student.date || form.date,
      enrolmentDate: student.enrolmentDate || student.date || form.date,
      enrollmentDate: student.enrollmentDate || student.date || form.date,
      registerNumber: student.registerNumber || form.registerNumber,
      registrationNo: student.registerNumber || student.registrationNo || form.registerNumber,
      registerNumbers: (Array.isArray(student.registerNumbers) && student.registerNumbers.length > 0)
        ? student.registerNumbers
        : allRegNumbers,
      courseName: student.courseName || form.courseName,
      program: student.program || student.courseName || form.courseName,
      course: student.course || student.courseName || form.courseName,
      courseLevel: student.courseLevel || form.courseLevel,
      level: student.level || student.courseLevel || form.courseLevel,
      courseDuration: student.courseDuration || form.courseDuration,
      duration: student.duration || student.courseDuration || form.courseDuration,
      branch: student.branch || form.branch,
      institution: student.institution || form.institution,
      studyCenter: student.studyCenter || form.studyCenter,
      selectedCourses: (form.selectedCourses && form.selectedCourses.length > 0)
        ? form.selectedCourses
        : (student.selectedCourses || []),
      name: student.name || form.name,
      studentName: student.studentName || student.name || form.name,
      parentName: student.parentName || student.fatherName || form.parentName,
      fatherName: student.fatherName || student.parentName || form.parentName,
      dateOfBirth: student.dateOfBirth || student.dob || form.dateOfBirth,
      dob: student.dob || student.dateOfBirth || form.dateOfBirth,
      age: student.age || form.age,
      gender: student.gender || form.gender,
      studentClass: student.studentClass || form.studentClass,
      studentStage: student.studentStage || form.studentStage,
      phone: student.phone || form.phone,
      aadhaarNumber: student.aadhaarNumber || student.aadharNumber || form.aadhaarNumber,
      aadharNumber: student.aadharNumber || student.aadhaarNumber || form.aadhaarNumber,
      feeAmount: student.feeAmount || form.feeAmount,
      paymentMode: student.paymentMode || form.paymentMode,
      receiptRefNo: student.receiptRefNo || form.receiptRefNo,

      // Apply permitted edits
      alternatePhone: form.alternatePhone.trim(),
      alternativePhone: form.alternatePhone.trim(),
      address: form.address.trim(),
      village: form.village.trim(),
      city: form.city.trim(),
      district: form.district.trim(),
      pincode: form.pincode.trim(),
      pinCode: form.pincode.trim(),
      studentPhoto: form.studentPhoto,
      photoUrl: form.studentPhoto,
    };

    setSaving(true);

    try {
      await onUpdateStudent(updatedStudent);

      setForm(getProfileValues(updatedStudent));
      setEditing(false);
      setSaved(true);
    } catch (saveError) {
      setError(
        saveError?.message ||
          'Unable to save your profile. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(getProfileValues(student));
    setEditing(false);
    setSaved(false);
    setError('');
  };

  return (
    <div className="space-y-5 sm:space-y-7">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-600 sm:text-xs">
            Student account
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-blue-950 sm:text-3xl">
            My Profile
          </h2>

          <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-500 sm:text-sm">
            View your official admission records, registered course details,
            and keep your contact information up to date.
          </p>
        </div>

        {!editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(true);
              setSaved(false);
              setError('');
            }}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-blue-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
          >
            <Pencil className="h-4 w-4" />
            Edit Profile
          </button>
        )}
      </div>

      {/* Student identity banner */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:rounded-3xl">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0F2B5C] to-[#1E4D99] p-4 text-white sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full border-[24px] border-white/5" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
            <div className="flex min-w-0 items-start sm:items-center gap-3.5 sm:gap-4">
              {/* Student photo */}
              <div className="relative h-16 w-16 shrink-0 sm:h-24 sm:w-24">
                {form.studentPhoto ? (
                  <img
                    src={form.studentPhoto}
                    alt="Student profile"
                    className="h-full w-full rounded-2xl border-2 border-white/30 bg-white object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-2xl bg-amber-400 text-2xl font-black text-blue-950 sm:text-3xl">
                    {(form.name || 'S')
                      .trim()
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}

                {editing && (
                  <label
                    htmlFor="studentPhotoUpload"
                    className="absolute -bottom-1.5 -right-1.5 flex h-7.5 w-7.5 cursor-pointer items-center justify-center rounded-xl border-2 border-white bg-amber-400 text-blue-950 shadow-md transition hover:bg-amber-300 sm:-bottom-2 sm:-right-2 sm:h-9 sm:w-9"
                    title="Upload student photo"
                  >
                    <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </label>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200 sm:text-xs">
                  Student Profile
                </p>

                <h3 className="mt-0.5 break-words text-lg font-black text-white sm:mt-1 sm:text-2xl">
                  {form.name || 'Student Name'}
                </h3>

                <p className="mt-0.5 break-all text-xs text-blue-100 sm:mt-1 sm:text-sm">
                  User ID: {displayValue(studentId)}
                </p>

                <div className="mt-2.5 flex flex-wrap items-center gap-1.5 sm:mt-3 sm:gap-2">
                  <div className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[9.5px] font-bold text-amber-200 sm:px-3 sm:py-1.5 sm:text-[10px]">
                    <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    Verified Student Record
                  </div>
                  {form.date && (
                    <span className="text-[10px] text-blue-200/90 font-medium sm:text-[11px]">
                      Admitted: {form.date}
                    </span>
                  )}
                </div>

                {editing && (
                  <p className="mt-2 text-[10px] leading-relaxed text-amber-200 font-semibold sm:mt-3 sm:text-[11px] sm:leading-5">
                    Note: Academic course details and core identity are locked. You can update your photo, alternative phone, and address below.
                  </p>
                )}
              </div>
            </div>

            {Array.isArray(form.selectedCourses) && form.selectedCourses.length > 1 ? (
              <div className="w-full rounded-xl border border-white/15 bg-white/10 p-3 sm:w-auto sm:min-w-80 backdrop-blur-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[10px] text-amber-300 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span>Enrolled Courses ({form.selectedCourses.length})</span>
                  </span>
                </div>

                <div className="mt-2.5 divide-y divide-white/10 space-y-2 sm:space-y-1.5">
                  {form.selectedCourses.map((c, idx) => (
                    <div
                      key={idx}
                      className="pt-2 first:pt-0 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
                    >
                      <div className="min-w-0">
                        <span className="text-[9px] font-black uppercase text-blue-200 tracking-wider block sm:hidden">
                          Course {idx + 1}
                        </span>
                        <p className="font-extrabold text-white text-xs leading-snug break-words sm:truncate sm:max-w-56">
                          {c.courseName || c.name}
                        </p>
                      </div>

                      <div className="self-start sm:self-center shrink-0">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-amber-400 text-blue-950 font-black text-[10px] shadow-2xs">
                          {c.level || 'Level 1'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 w-full sm:w-auto sm:min-w-64 sm:gap-3">
                <div className="rounded-xl border border-white/10 bg-white/10 p-2.5 sm:p-3">
                  <GraduationCap className="h-4 w-4 text-amber-300 sm:h-5 sm:w-5" />
                  <p className="mt-1.5 text-[9.5px] text-blue-100 font-medium sm:text-[10px]">
                    Enrolled Course
                  </p>
                  <p className="mt-0.5 break-words text-white text-xs font-bold sm:text-sm">
                    {displayValue(form.courseName)}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/10 p-2.5 sm:p-3">
                  <School className="h-4 w-4 text-amber-300 sm:h-5 sm:w-5" />
                  <p className="mt-1.5 text-[9.5px] text-blue-100 font-medium sm:text-[10px]">
                    Level / Grade
                  </p>
                  <p className="mt-0.5 break-words text-white text-xs font-bold sm:text-sm">
                    {displayValue(form.courseLevel)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {editing && (
            <input
              id="studentPhotoUpload"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="sr-only"
            />
          )}
        </div>

        {/* Quick details */}
        <div className="grid grid-cols-2 divide-y-0 divide-slate-100 sm:grid-cols-4 sm:divide-x">
          <div className="flex min-w-0 items-center gap-2.5 p-3 sm:gap-3 sm:p-5 border-b sm:border-b-0 border-r border-slate-100">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-900 sm:h-10 sm:w-10 sm:rounded-xl">
              <Hash className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="text-[9.5px] font-bold uppercase tracking-wide text-slate-500 sm:text-[10px]">
                {allRegNumbers.length > 1 ? 'Register Nos.' : 'Register No.'}
              </p>
              <p className="mt-0.5 truncate text-xs font-mono font-bold text-slate-800 sm:text-sm">
                {allRegNumbers.length > 0 ? allRegNumbers.join(' • ') : displayValue(registerNumber)}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-2.5 p-3 sm:gap-3 sm:p-5 border-b sm:border-b-0 border-slate-100">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-900 sm:h-10 sm:w-10 sm:rounded-xl">
              <Phone className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="text-[9.5px] font-bold uppercase tracking-wide text-slate-500 sm:text-[10px]">
                Phone Number
              </p>
              <p className="mt-0.5 truncate text-xs font-semibold text-slate-800 sm:text-sm">
                {displayValue(form.phone)}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-2.5 p-3 sm:gap-3 sm:p-5 border-r border-slate-100">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-900 sm:h-10 sm:w-10 sm:rounded-xl">
              <MapPin className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="text-[9.5px] font-bold uppercase tracking-wide text-slate-500 sm:text-[10px]">
                Branch / District
              </p>
              <p className="mt-0.5 truncate text-xs font-semibold text-slate-800 sm:text-sm">
                {displayValue(form.branch || form.district)}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-2.5 p-3 sm:gap-3 sm:p-5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-900 sm:h-10 sm:w-10 sm:rounded-xl">
              <CalendarDays className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="text-[9.5px] font-bold uppercase tracking-wide text-slate-500 sm:text-[10px]">
                Date of Birth
              </p>
              <p className="mt-0.5 truncate text-xs font-semibold text-slate-800 sm:text-sm">
                {displayValue(form.dateOfBirth)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback */}
      {saved && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-bold">
              Profile updated successfully
            </p>
            <p className="mt-1 text-xs">
              Your contact details and profile photo were saved successfully.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5 sm:space-y-6">
        {/* Section 1: Course & Admission Details (LOCKED) */}
        <ProfileSection
          icon={BookOpen}
          title="Official Admission & Course Details"
          description="Your registered course, branch, and academic record as enrolled during admission."
        >
          {/* Lock notice alert */}
          <div className="sm:col-span-2 flex items-start gap-2.5 rounded-xl border border-amber-200/90 bg-amber-50/80 p-3 text-xs text-amber-900">
            <Lock className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Official Academic Record:</strong> Enrolled courses, course levels, admission dates, and registration numbers are locked by B★SEL administration and cannot be changed from the student portal.
            </p>
          </div>

          <ProfileField
            label="Admission Date"
            name="date"
            value={form.date}
            icon={CalendarDays}
            readOnly
            isLocked
          />

          <ProfileField
            label="Course Duration"
            name="courseDuration"
            value={form.courseDuration || '6 Months'}
            icon={CalendarClock}
            readOnly
            isLocked
          />

          <ProfileField
            label="Branch / Centre"
            name="branch"
            value={form.branch}
            icon={Building2}
            readOnly
            isLocked
          />

          <ProfileField
            label="Study Center / Institution"
            name="studyCenter"
            value={form.studyCenter || form.branch}
            icon={School}
            readOnly
            isLocked
          />

          {Array.isArray(form.selectedCourses) && form.selectedCourses.length > 1 ? (
            <div className="sm:col-span-2 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-black uppercase tracking-wider text-blue-950 flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4 text-blue-900" />
                  <span>Enrolled Courses & Academic Registration ({form.selectedCourses.length})</span>
                </span>
                <span className="text-[11px] font-bold text-slate-500">
                  {form.selectedCourses.length} Enrolled Courses
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {form.selectedCourses.map((c, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-2.5 py-3 sm:flex-row sm:items-center sm:justify-between first:pt-1 last:pb-1"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-black text-slate-900">
                          {c.courseName || c.name}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-mono font-black text-amber-900 border border-amber-200">
                          <Hash className="h-3 w-3" />
                          {c.registerNumber || allRegNumbers[idx] || registerNumber}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {c.level || form.courseLevel || 'Level 1'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 self-start sm:self-center shrink-0">
                      <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-900 border border-blue-200">
                        {c.level || 'Level 1'}
                      </span>
                      {c.fee && (
                        <span className="font-mono text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          ₹{String(c.fee).replace(/\D/g, '')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <ProfileField
                label="Official Register No."
                name="registerNumber"
                value={registerNumber}
                icon={Hash}
                readOnly
                isLocked
              />

              <ProfileField
                label="Course Name"
                name="courseName"
                value={form.courseName}
                icon={BookOpen}
                readOnly
                isLocked
              />

              <ProfileField
                label="Course Level"
                name="courseLevel"
                value={form.courseLevel}
                icon={GraduationCap}
                readOnly
                isLocked
              />
            </>
          )}
        </ProfileSection>

        {/* Section 2: Admission Fees & Payment Record (LOCKED) */}
        {(form.feeAmount || form.paymentMode || form.receiptRefNo) && (
          <ProfileSection
            icon={Receipt}
            title="Admission Fees & Payment Record"
            description="Fee receipt and transaction verification recorded at the time of admission."
            gridCols="grid-cols-2"
            badge={
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10.5px] font-extrabold text-emerald-900 border border-emerald-300">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                Confirmed
              </span>
            }
          >
            <ProfileField
              label="Admission Fee Paid"
              name="feeAmount"
              value={form.feeAmount || '₹450'}
              icon={Receipt}
              readOnly
              isLocked
            />

            <ProfileField
              label="Payment Mode"
              name="paymentMode"
              value={form.paymentMode || 'UPI / QR Code'}
              icon={CreditCard}
              readOnly
              isLocked
            />

            <ProfileField
              label="Receipt / Reference No."
              name="receiptRefNo"
              value={form.receiptRefNo || 'TXN-CONFIRMED'}
              icon={Hash}
              readOnly
              isLocked
            />

            <ProfileField
              label="Payment Status"
              name="feePaymentType"
              value="Fee Paid & Confirmed"
              icon={CheckCircle2}
              readOnly
              isLocked
            />
          </ProfileSection>
        )}

        {/* Section 3: Personal Information (LOCKED OFFICIAL IDENTITY) */}
        <ProfileSection
          icon={UserRound}
          title="Personal Information"
          description="Candidate name, parent name, date of birth, age, gender, and student photograph."
          badge={
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10.5px] font-bold text-slate-700 border border-slate-300">
              <Lock className="h-2.5 w-2.5" />
              Identity Locked
            </span>
          }
        >
          <ProfileField
            label="Student Full Name"
            name="name"
            value={form.name}
            icon={UserRound}
            readOnly
            isLocked
          />

          <ProfileField
            label="Father / Mother Name"
            name="parentName"
            value={form.parentName}
            icon={UserRound}
            readOnly
            isLocked
          />

          <ProfileField
            label="Date of Birth"
            name="dateOfBirth"
            value={form.dateOfBirth}
            icon={CalendarDays}
            readOnly
            isLocked
          />

          <ProfileField
            label="Age"
            name="age"
            value={form.age}
            icon={Clock}
            readOnly
            isLocked
          />

          <ProfileField
            label="Gender"
            name="gender"
            value={form.gender}
            icon={UserRound}
            readOnly
            isLocked
          />

          {form.studentClass && (
            <ProfileField
              label="School / Class"
              name="studentClass"
              value={form.studentClass}
              icon={School}
              readOnly
              isLocked
            />
          )}

          {form.studentStage && (
            <ProfileField
              label="Academic Stage"
              name="studentStage"
              value={form.studentStage}
              icon={GraduationCap}
              readOnly
              isLocked
            />
          )}

          {/* Student Photo upload section */}
          {editing ? (
            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-bold text-slate-700">
                Student Photo (Update Permitted)
              </label>

              <div className="flex flex-col gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 sm:flex-row sm:items-center">
                {form.studentPhoto ? (
                  <img
                    src={form.studentPhoto}
                    alt="Student preview"
                    className="h-24 w-24 rounded-xl border border-slate-200 bg-white object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-900">
                    <ImagePlus className="h-8 w-8" />
                  </div>
                )}

                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800">
                    Upload new student photo
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    JPG, PNG, or supported image format. Maximum size: 2 MB.
                  </p>

                  <label
                    htmlFor="studentPhotoUpload"
                    className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-950 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-800"
                  >
                    <Camera className="h-4 w-4" />
                    Choose Photo
                  </label>

                  {form.studentPhoto && (
                    <button
                      type="button"
                      onClick={() =>
                        setForm((previous) => ({
                          ...previous,
                          studentPhoto: '',
                        }))
                      }
                      className="ml-2 mt-3 inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-50"
                    >
                      <X className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="sm:col-span-2 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:p-4">
              <Camera className="h-4 w-4 shrink-0 text-slate-400" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Student Photo
                </p>
                <p className="mt-0.5 text-xs font-semibold text-slate-800">
                  {form.studentPhoto ? 'Photo Uploaded & Verified' : 'Not provided'}
                </p>
              </div>
            </div>
          )}
        </ProfileSection>

        {/* Section 4: Contact details */}
        <ProfileSection
          icon={Phone}
          title="Contact Information"
          description="Primary login mobile number and alternative contact information."
        >
          <ProfileField
            label="Primary Phone Number (Login User ID)"
            name="phone"
            value={form.phone}
            icon={Phone}
            readOnly
            isLocked
          />

          <ProfileField
            label="Alternative Phone Number"
            name="alternatePhone"
            value={form.alternatePhone}
            onChange={handleChange}
            icon={Phone}
            type="tel"
            readOnly={!editing}
            placeholder="Enter alternative mobile number"
          />
        </ProfileSection>

        {/* Section 5: Address details */}
        <ProfileSection
          icon={MapPinned}
          title="Residential Address Information"
          description="Your residential address and postal details (editable when updating profile)."
        >
          <ProfileField
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            icon={MapPin}
            readOnly={!editing}
            placeholder="House number, street, or area"
          />

          <ProfileField
            label="Village / Area"
            name="village"
            value={form.village}
            onChange={handleChange}
            icon={MapPinned}
            readOnly={!editing}
            placeholder="Enter village or locality"
          />

          <ProfileField
            label="City / Town"
            name="city"
            value={form.city}
            onChange={handleChange}
            icon={Building2}
            readOnly={!editing}
            placeholder="Enter city or town"
          />

          <ProfileField
            label="District"
            name="district"
            value={form.district}
            onChange={handleChange}
            icon={MapPin}
            readOnly={!editing}
            placeholder="Enter district"
          />

          <ProfileField
            label="PIN Code"
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
            icon={Hash}
            readOnly={!editing}
            maxLength={6}
            inputMode="numeric"
            placeholder="6-digit PIN code"
          />
        </ProfileSection>

        {/* Section 6: Identity details (LOCKED) */}
        <ProfileSection
          icon={IdCard}
          title="Identity Information"
          description="Official Aadhaar record submitted during admission."
          badge={
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10.5px] font-bold text-slate-700 border border-slate-300">
              <Lock className="h-2.5 w-2.5" />
              Verified & Locked
            </span>
          }
        >
          <div className="min-w-0">
            <label
              htmlFor="maskedAadhaar"
              className="mb-1.5 block text-xs font-bold text-slate-700"
            >
              Aadhaar Number
            </label>

            <div className="relative">
              <IdCard className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                id="maskedAadhaar"
                value={maskAadhaar(form.aadhaarNumber)}
                readOnly
                className="w-full rounded-xl border border-slate-200 bg-slate-100/80 py-3 pl-10 pr-4 text-sm text-slate-700 font-mono outline-none cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-900" />

            <p className="text-xs leading-5 text-slate-600">
              Your official identity information was verified and recorded during your admission. For any legal changes, please submit an official request to your B★SEL branch coordinator.
            </p>
          </div>
        </ProfileSection>

        {/* Editing actions */}
        {editing && (
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
