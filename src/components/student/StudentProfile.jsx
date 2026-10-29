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
} from 'lucide-react';

// Get profile information from the student object.
const getProfileValues = (student = {}) => ({
  date: student.date || student.enrollmentDate || '',
  branch: student.branch || '',
  studyCenter: student.studyCenter || student.centerName || '',
  courseName: student.courseName || student.program || student.course || '',
  courseLevel: student.courseLevel || student.level || '',
  courseDuration: student.courseDuration || student.duration || '',

  name: student.name || student.studentName || '',
  dateOfBirth: student.dateOfBirth || student.dob || '',
  age: student.age ?? '',
  gender: student.gender || '',
  phone: student.phone || '',
  alternatePhone: student.alternatePhone || student.alternativePhone || '',

  address: student.address || '',
  village: student.village || '',
  city: student.city || '',
  district: student.district || '',
  pincode: student.pincode || student.pinCode || '',

  aadhaarNumber:
    student.aadhaarNumber || student.aadharNumber || '',

  studentPhoto:
    student.studentPhoto ||
    student.photoURL ||
    student.photoUrl ||
    student.profilePhoto ||
    student.photo ||
    '',
});

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
  options,
  placeholder,
  maxLength,
  inputMode,
}) {
  const fieldClass = `w-full min-w-0 rounded-xl border bg-white py-3 text-sm outline-none transition ${
    Icon ? 'pl-10' : 'px-4'
  } pr-4 ${
    readOnly
      ? 'cursor-default border-slate-200 bg-slate-50 text-slate-600'
      : 'border-slate-200 text-slate-900 focus:border-blue-800 focus:ring-2 focus:ring-blue-100'
  }`;

  return (
    <div className="min-w-0">
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-bold text-slate-700"
      >
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        )}

        {options && !readOnly ? (
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
            readOnly={readOnly}
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

function SectionHeading({ icon: Icon, title, description }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-900">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <h3 className="text-base font-extrabold text-blue-950 sm:text-lg">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}

function ProfileSection({
  icon,
  title,
  description,
  children,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <SectionHeading
        icon={icon}
        title={title}
        description={description}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        {children}
      </div>
    </section>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:p-4">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-slate-800">
          {displayValue(value)}
        </p>
      </div>
    </div>
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
    student?.id ||
    student?.userId ||
    student?.studentId ||
    '';

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => {
      const updated = {
        ...previous,
        [name]: value,
      };

      // Update age automatically when the date of birth changes.
      if (name === 'dateOfBirth') {
        updated.age = calculateAge(value);
      }

      return updated;
    });

    setSaved(false);
    setError('');
  };

  // Convert the selected photo into a previewable data URL.
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

    // Keep uploads reasonably small for a profile image.
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

    if (!form.name.trim()) {
      setError('Please enter the student name.');
      return;
    }

    if (
      form.dateOfBirth &&
      !calculateAge(form.dateOfBirth)
    ) {
      setError('Please enter a valid date of birth.');
      return;
    }

    if (form.age !== '' && Number(form.age) < 0) {
      setError('Please enter a valid age.');
      return;
    }

    const phonePattern = /^[0-9+\-\s()]{7,20}$/;

    if (form.phone && !phonePattern.test(form.phone)) {
      setError('Please enter a valid phone number.');
      return;
    }

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

    const aadhaarDigits = String(form.aadhaarNumber).replace(
      /\D/g,
      ''
    );

    if (
      form.aadhaarNumber &&
      !/^\d{12}$/.test(aadhaarDigits)
    ) {
      setError('Aadhaar number must contain exactly 12 digits.');
      return;
    }

    if (typeof onUpdateStudent !== 'function') {
      setError(
        'Profile updates are not connected. Please contact the administrator.'
      );
      return;
    }

    const updatedStudent = {
      ...student,
      ...form,

      name: form.name.trim(),
      studentName: form.name.trim(),

      date: form.date,
      enrollmentDate: form.date,

      courseName: form.courseName.trim(),
      program: form.courseName.trim(),
      course: form.courseName.trim(),

      courseLevel: form.courseLevel,
      level: form.courseLevel,

      courseDuration: form.courseDuration.trim(),
      duration: form.courseDuration.trim(),

      dateOfBirth: form.dateOfBirth,
      dob: form.dateOfBirth,
      age: form.age === '' ? '' : Number(form.age),

      phone: form.phone.trim(),
      alternatePhone: form.alternatePhone.trim(),
      alternativePhone: form.alternatePhone.trim(),

      address: form.address.trim(),
      village: form.village.trim(),
      city: form.city.trim(),
      district: form.district.trim(),
      pincode: form.pincode.trim(),
      pinCode: form.pincode.trim(),

      aadhaarNumber: aadhaarDigits,
      aadharNumber: aadhaarDigits,

      studentPhoto: form.studentPhoto,
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

  const readOnlyField = (label, name, value, icon) => (
    <ProfileField
      label={label}
      name={name}
      value={displayValue(value)}
      icon={icon}
      readOnly
    />
  );

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
            Manage your course, personal details, contact information,
            address, and identity details in one place.
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
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0F2B5C] to-[#1E4D99] p-5 text-white sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full border-[24px] border-white/5" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              {/* Student photo */}
              <div className="relative h-20 w-20 shrink-0 sm:h-24 sm:w-24">
                {form.studentPhoto ? (
                  <img
                    src={form.studentPhoto}
                    alt="Student profile"
                    className="h-full w-full rounded-2xl border-2 border-white/30 bg-white object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-2xl bg-amber-400 text-3xl font-black text-blue-950">
                    {(form.name || 'S')
                      .trim()
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}

                {editing && (
                  <label
                    htmlFor="studentPhotoUpload"
                    className="absolute -bottom-2 -right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border-2 border-white bg-amber-400 text-blue-950 shadow-md transition hover:bg-amber-300"
                    title="Upload student photo"
                  >
                    <Camera className="h-4 w-4" />
                  </label>
                )}
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  Student profile
                </p>

                <h3 className="mt-1 break-words text-xl text-white font-black sm:text-2xl">
                  {form.name || 'Student Name'}
                </h3>

                <p className="mt-1 break-all text-xs text-blue-100 sm:text-sm">
                  Student ID: {displayValue(studentId)}
                </p>

                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold text-amber-200">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Student Account
                </div>

                {editing && (
                  <p className="mt-3 text-[11px] leading-5 text-blue-100">
                    Select the camera icon to upload a photo (maximum 2 MB).
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-64">
              <div className="rounded-xl border border-white/10 bg-white/10 p-3">
                <GraduationCap className="h-5 w-5 text-amber-300" />
                <p className="mt-2 text-[10px] text-blue-100">
                  Course
                </p>
                <p className="mt-1 break-words text-sm font-bold">
                  {displayValue(form.courseName)}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/10 p-3">
                <School className="h-5 w-5 text-amber-300" />
                <p className="mt-2 text-[10px] text-blue-100">
                  Course Level
                </p>
                <p className="mt-1 break-words text-sm font-bold">
                  {displayValue(form.courseLevel)}
                </p>
              </div>
            </div>
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
        <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="flex min-w-0 items-center gap-3 p-4 sm:p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-900">
              <Phone className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                Phone Number
              </p>
              <p className="mt-1 break-words text-xs font-semibold text-slate-800 sm:text-sm">
                {displayValue(form.phone)}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-3 p-4 sm:p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-900">
              <MapPin className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                District
              </p>
              <p className="mt-1 break-words text-xs font-semibold text-slate-800 sm:text-sm">
                {displayValue(form.district)}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-3 p-4 sm:p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-900">
              <CalendarDays className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                Date of Birth
              </p>
              <p className="mt-1 break-words text-xs font-semibold text-slate-800 sm:text-sm">
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
              Your profile changes were submitted successfully.
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
        {/* Course details */}
        <ProfileSection
          icon={BookOpen}
          title="Course Details"
          description="Your registered course, branch, study center, and course schedule."
        >
          <ProfileField
            label="Date"
            name="date"
            value={form.date}
            onChange={handleChange}
            icon={CalendarDays}
            type={editing ? 'date' : 'text'}
            readOnly={!editing}
          />

          <ProfileField
            label="Branch"
            name="branch"
            value={form.branch}
            onChange={handleChange}
            icon={Building2}
            readOnly={!editing}
          />

          <ProfileField
            label="Study Center"
            name="studyCenter"
            value={form.studyCenter}
            onChange={handleChange}
            icon={School}
            readOnly={!editing}
          />

          <ProfileField
            label="Course Name"
            name="courseName"
            value={form.courseName}
            onChange={handleChange}
            icon={BookOpen}
            readOnly={!editing}
          />

          <ProfileField
            label="Course Level"
            name="courseLevel"
            value={form.courseLevel}
            onChange={handleChange}
            icon={GraduationCap}
            options={[
              'Beginner',
              'Level 1',
              'Level 2',
              'Level 3',
              'Level 4',
              'Level 5',
              'Intermediate',
              'Advanced',
            ]}
            readOnly={!editing}
          />

          <ProfileField
            label="Course Duration"
            name="courseDuration"
            value={form.courseDuration}
            onChange={handleChange}
            icon={CalendarClock}
            readOnly={!editing}
            placeholder="e.g. 3 months"
          />
        </ProfileSection>

        {/* Personal details */}
        <ProfileSection
          icon={UserRound}
          title="Personal Information"
          description="Your name, date of birth, age, gender, and photo."
        >
          <ProfileField
            label="Student Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            icon={UserRound}
            readOnly={!editing}
          />

          <ProfileField
            label="Date of Birth"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
            icon={CalendarDays}
            type={editing ? 'date' : 'text'}
            readOnly={!editing}
          />

          <ProfileField
            label="Age"
            name="age"
            value={form.age}
            onChange={handleChange}
            icon={Clock}
            type="number"
            readOnly={!editing || Boolean(form.dateOfBirth)}
            placeholder="Age"
          />

          <ProfileField
            label="Gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            icon={UserRound}
            options={['Male', 'Female', 'Other', 'Prefer not to say']}
            readOnly={!editing}
          />

          {editing ? (
            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-bold text-slate-700">
                Student Photo
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
                    Upload student photo
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    JPG, PNG, or another supported image format. Maximum size: 2 MB.
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
            <div className="sm:col-span-2">
              <DetailItem
                icon={Camera}
                label="Student Photo"
                value={form.studentPhoto ? 'Photo uploaded' : 'Not provided'}
              />
            </div>
          )}
        </ProfileSection>

        {/* Contact details */}
        <ProfileSection
          icon={Phone}
          title="Contact Information"
          description="Your primary and alternative contact numbers."
        >
          <ProfileField
            label="Phone Number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            icon={Phone}
            type="tel"
            readOnly={!editing}
          />

          <ProfileField
            label="Alternative Phone Number"
            name="alternatePhone"
            value={form.alternatePhone}
            onChange={handleChange}
            icon={Phone}
            type="tel"
            readOnly={!editing}
          />
        </ProfileSection>

        {/* Address details */}
        <ProfileSection
          icon={MapPinned}
          title="Address Information"
          description="Your residential address and location details."
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
            label="Village"
            name="village"
            value={form.village}
            onChange={handleChange}
            icon={MapPinned}
            readOnly={!editing}
          />

          <ProfileField
            label="City / Town"
            name="city"
            value={form.city}
            onChange={handleChange}
            icon={Building2}
            readOnly={!editing}
          />

          <ProfileField
            label="District"
            name="district"
            value={form.district}
            onChange={handleChange}
            icon={MapPin}
            readOnly={!editing}
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
          />
        </ProfileSection>

        {/* Identity details */}
        <ProfileSection
          icon={IdCard}
          title="Identity Information"
          description="Your Aadhaar number. It is masked when you are not editing your profile."
        >
          {editing ? (
            <ProfileField
              label="Aadhaar Number"
              name="aadhaarNumber"
              value={form.aadhaarNumber}
              onChange={(event) => {
                const value = event.target.value
                  .replace(/\D/g, '')
                  .slice(0, 12);

                handleChange({
                  target: {
                    name: 'aadhaarNumber',
                    value,
                  },
                });
              }}
              icon={IdCard}
              type="text"
              maxLength={12}
              inputMode="numeric"
              placeholder="Enter 12-digit Aadhaar number"
            />
          ) : (
            <div className="min-w-0">
              <label
                htmlFor="maskedAadhaar"
                className="mb-2 block text-xs font-bold text-slate-700"
              >
                Aadhaar Number
              </label>

              <div className="relative">
                <IdCard className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="maskedAadhaar"
                  value={maskAadhaar(form.aadhaarNumber)}
                  readOnly
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-600 outline-none"
                />
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-900" />

            <p className="text-xs leading-5 text-slate-600">
              Keep your identity information secure. Only collect and store
              Aadhaar details when necessary, with appropriate consent and
              access controls.
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
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
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

      {/* Security note */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-900" />

          <div>
            <h4 className="text-sm font-extrabold text-blue-950">
              Profile and information security
            </h4>

            <p className="mt-2 text-xs leading-6 text-slate-600 sm:text-sm">
              Your profile changes are sent to the application's profile
              update handler. Ensure that your backend or database saves
              the updated fields and photo, and restrict access to sensitive
              information such as Aadhaar numbers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}