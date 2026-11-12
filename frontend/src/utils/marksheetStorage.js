export const STORAGE_KEY = 'bsel_student_marksheets';

export const normalize = (value) => String(value || '').trim().toLowerCase();

export const readMarksheets = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

export const writeMarksheets = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getStudentCourse = (student) =>
  student?.program || student?.courseName || '';

// One marksheet per student + enrolled course
export const getStudentKey = (student) =>
  `${normalize(student?.userId)}__${normalize(getStudentCourse(student))}`;

// Every identifier a student object might carry
const getStudentIds = (student) =>
  [
    student?.userId,
    student?.id,
    student?.studentId,
    student?.registerNumber,
    student?.registrationNo,
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

  // 2. fallback: match by any id (userId / register number) + course
  const ids = getStudentIds(student);
  const course = normalize(getStudentCourse(student));

  const found = Object.values(all).find((entry) => {
    if (!entry || !Array.isArray(entry.subjects)) return false;

    const entryIds = [entry.studentId, entry.registerNumber]
      .map(normalize)
      .filter(Boolean);

    const idMatch = entryIds.some((id) => ids.includes(id));
    const courseMatch = !course || normalize(entry.course) === course;

    return idMatch && courseMatch;
  });

  return found || null;
};