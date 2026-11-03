import student1Img from '../assets/programs/student1.jpg';
import student2Img from '../assets/programs/student2.jpg';
import student3Img from '../assets/programs/student3.jpg';
import student4Img from '../assets/programs/student4.jpg';
import student5Img from '../assets/programs/student5.jpg';
import student6Img from '../assets/programs/student6.jpg';

export const SAMPLE_STUDENT_PHOTOS = [
  student1Img,
  student2Img,
  student3Img,
  student4Img,
  student5Img,
  student6Img
];

export const getStudentPhotoUrl = (student, index = 0) => {
  if (student?.studentPhoto) return student.studentPhoto;
  if (student?.photo) return student.photo;
  return SAMPLE_STUDENT_PHOTOS[Math.abs(index) % SAMPLE_STUDENT_PHOTOS.length];
};

export const getStudentRegisterNumber = (student) => {
  if (!student) return 'AB26-001';
  if (student.registerNumber && student.registerNumber !== 'Not provided' && !student.registerNumber.startsWith('BSEL-STU-')) {
    return student.registerNumber;
  }
  if (student.registrationNo && student.registrationNo !== 'Not provided' && !student.registrationNo.startsWith('BSEL-STU-')) {
    return student.registrationNo;
  }
  const course = (student.program || student.courseName || 'Abacus Speed Arithmetic').toLowerCase();
  const prefix = course.includes('abacus') ? 'AB' :
                 course.includes('handwriting') ? 'HW' :
                 course.includes('phonics') ? 'PH' :
                 course.includes('vedic') ? 'VM' :
                 course.includes('calligraphy') ? 'CG' :
                 course.includes('art') ? 'AD' :
                 course.includes('python') ? 'PY' : 'BC';
  const digits = String(student.userId || '').replace(/\D/g, '').slice(-3) || '001';
  return `${prefix}26-${digits}`;
};

export const getMarksheetSubjects = (student) => {
  const course = (student?.program || student?.courseName || '').toLowerCase();
  
  if (course.includes('art') || course.includes('draw')) {
    return [
      { id: 1, name: 'Freehand Sketching & Contour Drawing', max: 25, min: 10, marks: 23, grade: 'O' },
      { id: 2, name: 'Colour Harmony & Shading Techniques', max: 35, min: 14, marks: 33, grade: 'O' },
      { id: 3, name: 'Visual Composition & Perspective', max: 25, min: 10, marks: 23, grade: 'A+' },
      { id: 4, name: 'Studio Practice & Creative Project Portfolio', max: 15, min: 6, marks: 14, grade: 'O' },
    ];
  }

  if (course.includes('python') || course.includes('code') || course.includes('comput')) {
    return [
      { id: 1, name: 'Computational Logic & Python Syntax', max: 25, min: 10, marks: 24, grade: 'O' },
      { id: 2, name: 'Algorithmic Problem Solving & Functions', max: 35, min: 14, marks: 32, grade: 'A+' },
      { id: 3, name: 'Data Structures & Practical Coding Lab', max: 25, min: 10, marks: 23, grade: 'A+' },
      { id: 4, name: 'Code Review & Technical Viva Voce', max: 15, min: 6, marks: 14, grade: 'O' },
    ];
  }

  if (course.includes('handwrit')) {
    return [
      { id: 1, name: 'Letter Formation & Geometric Alignment', max: 25, min: 10, marks: 24, grade: 'O' },
      { id: 2, name: 'Cursive Flow, Rhythm & Speed Drills', max: 35, min: 14, marks: 34, grade: 'O' },
      { id: 3, name: 'Presentation, Margins & Spacing Mastery', max: 25, min: 10, marks: 23, grade: 'A+' },
      { id: 4, name: 'Notebook Examination & Precision Portfolio', max: 15, min: 6, marks: 14, grade: 'O' },
    ];
  }

  // Default: Abacus Mental Arithmetic
  return [
    { id: 1, name: 'Abacus Bead Technique & Soroban Manipulation', max: 25, min: 10, marks: 24, grade: 'O' },
    { id: 2, name: 'Speed Mental Addition & Subtraction Drills', max: 35, min: 14, marks: 33, grade: 'O' },
    { id: 3, name: 'Photographic Memory & Flash Card Auditory Test', max: 25, min: 10, marks: 23, grade: 'A+' },
    { id: 4, name: 'Continuous Internal Evaluation & Workbook Assessment', max: 15, min: 6, marks: 14, grade: 'O' },
  ];
};
