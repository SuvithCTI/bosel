export const STORAGE_KEY = 'bsel_student_marksheets';

export const normalize = (value) => String(value || '').trim().toLowerCase();

export const readMarksheets = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
};

export const writeMarksheets = (data) => {
  const safeData = data && typeof data === 'object' && !Array.isArray(data) ? data : {};
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeData));
  } catch (err) {
    console.warn('writeMarksheets quota exceeded, performing storage cleanup:', err);
    try {
      // 1. Remove obsolete or redundant photo keys to free space
      if (typeof localStorage !== 'undefined') {
        const toRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && (k.startsWith('bsel_photo_') || k.startsWith('bsel_temp_'))) {
            toRemove.push(k);
          }
        }
        toRemove.forEach((k) => {
          try {
            localStorage.removeItem(k);
          } catch {
            // ignore
          }
        });
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safeData));
    } catch {
      try {
        // 2. Fallback: keep only the most recent 50 marksheets
        const entries = Object.entries(safeData);
        const trimmed = Object.fromEntries(entries.slice(-50));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      } catch (fallbackErr) {
        console.error('writeMarksheets emergency fallback failed:', fallbackErr);
      }
    }
  }
};

export const getStudentCourse = (student) =>
  student?.program || student?.courseName || '';

// One marksheet per student + enrolled course
export const getStudentKey = (student) =>
  `${normalize(student?.userId || student?.admissionNo || student?.registerNumber)}__${normalize(getStudentCourse(student))}`;

// Every identifier a student object might carry
const getStudentIds = (student) =>
  [
    student?.userId,
    student?.id,
    student?.studentId,
    student?.registerNumber,
    student?.registrationNo,
    student?.admissionNo,
    student?.phone,
    student?.mobile,
  ]
    .map(normalize)
    .filter(Boolean);

export const getGrade = (percentage) => {
  if (percentage >= 95) return 'A+';
  if (percentage >= 85) return 'A';
  if (percentage >= 75) return 'B+';
  if (percentage >= 65) return 'B';
  if (percentage >= 50) return 'C';
  return 'D';
};

// Returns the saved marksheet for this student's enrolled course, or null
export const getSavedMarksheet = (student) => {
  if (!student) return null;

  const all = readMarksheets();

  // 1. exact key
  const direct = all[getStudentKey(student)];
  if (direct && Array.isArray(direct.subjects)) return direct;

  // 2. fallback: match by any id (userId / register number / admission number / phone) + course
  const ids = getStudentIds(student);
  const course = normalize(getStudentCourse(student));
  const studentName = normalize(student?.studentName || student?.name);

  const found = Object.values(all).find((entry) => {
    if (!entry || !Array.isArray(entry.subjects)) return false;

    const entryIds = [
      entry.studentId,
      entry.registerNumber,
      entry.registrationNo,
      entry.admissionNo,
      entry.userId,
      entry.id,
      entry.phone,
      entry.mobile
    ]
      .map(normalize)
      .filter(Boolean);

    const idMatch = ids.some((id) => entryIds.includes(id));
    const entryCourse = normalize(entry.course || entry.program || entry.courseName);
    const courseMatch = !course || !entryCourse || entryCourse === course || entryCourse.includes(course) || course.includes(entryCourse);

    const nameMatch = studentName && (
      studentName === normalize(entry.studentName) ||
      studentName === normalize(entry.name)
    );

    return (idMatch || nameMatch) && courseMatch;
  });

  return found || null;
};

// Save helper that stores marksheet and dispatches global update events
export const saveStudentMarksheet = (student, marksheet) => {
  try {
    const all = readMarksheets();
    const primaryKey = getStudentKey(student);
    all[primaryKey] = marksheet;

    // Also store secondary keys for faster direct lookup
    if (student?.admissionNo) {
      all[`${normalize(student.admissionNo)}__${normalize(getStudentCourse(student))}`] = marksheet;
    }
    if (student?.registerNumber) {
      all[`${normalize(student.registerNumber)}__${normalize(getStudentCourse(student))}`] = marksheet;
    }

    writeMarksheets(all);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('bsel_marksheets_updated'));
      window.dispatchEvent(new Event('bsel_users_updated'));
    }
    return true;
  } catch (err) {
    console.error('saveStudentMarksheet error:', err);
    return false;
  }
};