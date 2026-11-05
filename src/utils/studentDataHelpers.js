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
                 course.includes('art') || course.includes('draw') ? 'DR' :
                 course.includes('html') ? 'HT' :
                 course.includes('css') ? 'CS' :
                 course.includes('python') ? 'PY' :
                 course.includes('office') || course.includes('ms') ? 'MS' :
                 course.includes('canva') ? 'CV' :
                 course.includes('photo') ? 'PS' :
                 course.includes('dance') || course.includes('bharatanatyam') ? 'BN' :
                 course.includes('memory') ? 'MM' :
                 course.includes('comput') ? 'CM' :
                 course.includes('ai') ? 'AI' : 'AB';
  const digits = String(student.userId || '').replace(/\D/g, '').slice(-3) || '001';
  return `${prefix}26-${digits}`;
};

export const getMarksheetSubjects = (student) => {
  const course = (student?.program || student?.courseName || '').toLowerCase();
  
  if (course.includes('html')) {
    return [
      { id: 1, name: 'HTML5 Semantic Structure & Tags', max: 100, assessment: 100, practical: 100, marks: 96, pct: '96%' },
      { id: 2, name: 'Forms, Input Validation & Tables', max: 100, assessment: 100, practical: 100, marks: 98, pct: '98%' },
      { id: 3, name: 'Hyperlinks, Layouts & Media Tags', max: 100, assessment: 100, practical: 100, marks: 94, pct: '94%' },
      { id: 4, name: 'Responsive Architecture & Web DOM', max: 100, assessment: 100, practical: 100, marks: 97, pct: '97%' },
      { id: 5, name: 'Live Web Project & Viva Voce', max: 100, assessment: 100, practical: 100, marks: 95, pct: '95%' }
    ];
  }

  if (course.includes('css')) {
    return [
      { id: 1, name: 'CSS Syntax, Selectors & Cascade', max: 100, assessment: 100, practical: 100, marks: 96, pct: '96%' },
      { id: 2, name: 'Box Model, Margins & Padding', max: 100, assessment: 100, practical: 100, marks: 98, pct: '98%' },
      { id: 3, name: 'Flexbox & CSS Grid Page Layouts', max: 100, assessment: 100, practical: 100, marks: 94, pct: '94%' },
      { id: 4, name: 'Media Queries & Responsive UI', max: 100, assessment: 100, practical: 100, marks: 97, pct: '97%' },
      { id: 5, name: 'Web Styling Portfolio & Viva', max: 100, assessment: 100, practical: 100, marks: 95, pct: '95%' }
    ];
  }

  if (course.includes('art') || course.includes('draw')) {
    return [
      { id: 1, name: 'Freehand Sketching & Line Contour', max: 100, assessment: 100, practical: 100, marks: 96, pct: '96%' },
      { id: 2, name: 'Colour Theory & Shading Gradients', max: 100, assessment: 100, practical: 100, marks: 98, pct: '98%' },
      { id: 3, name: 'Thematic Creative Composition', max: 100, assessment: 100, practical: 100, marks: 94, pct: '94%' },
      { id: 4, name: 'Object, Perspective & Still Life', max: 100, assessment: 100, practical: 100, marks: 97, pct: '97%' },
      { id: 5, name: 'Art Portfolio & Viva Voce', max: 100, assessment: 100, practical: 100, marks: 95, pct: '95%' }
    ];
  }

  if (course.includes('python')) {
    return [
      { id: 1, name: 'Python Syntax & Data Types', max: 100, assessment: 100, practical: 100, marks: 96, pct: '96%' },
      { id: 2, name: 'Control Flow & Conditional Logic', max: 100, assessment: 100, practical: 100, marks: 98, pct: '98%' },
      { id: 3, name: 'Functions, Loops & String Handling', max: 100, assessment: 100, practical: 100, marks: 94, pct: '94%' },
      { id: 4, name: 'Data Structures & Problem Solving', max: 100, assessment: 100, practical: 100, marks: 97, pct: '97%' },
      { id: 5, name: 'Python Code Project & Viva Voce', max: 100, assessment: 100, practical: 100, marks: 95, pct: '95%' }
    ];
  }

  if (course.includes('comput')) {
    return [
      { id: 1, name: 'Computer Architecture & Hardware', max: 100, assessment: 100, practical: 100, marks: 96, pct: '96%' },
      { id: 2, name: 'Operating Systems & File Handling', max: 100, assessment: 100, practical: 100, marks: 98, pct: '98%' },
      { id: 3, name: 'Internet Security & Cyber Safety', max: 100, assessment: 100, practical: 100, marks: 94, pct: '94%' },
      { id: 4, name: 'Keyboarding & Speed Typing Drills', max: 100, assessment: 100, practical: 100, marks: 97, pct: '97%' },
      { id: 5, name: 'IT Application Lab & Viva Voce', max: 100, assessment: 100, practical: 100, marks: 95, pct: '95%' }
    ];
  }

  if (course.includes('office') || course.includes('ms')) {
    return [
      { id: 1, name: 'MS Word Document Formatting', max: 100, assessment: 100, practical: 100, marks: 96, pct: '96%' },
      { id: 2, name: 'MS Excel Formulas & Data Charts', max: 100, assessment: 100, practical: 100, marks: 98, pct: '98%' },
      { id: 3, name: 'MS PowerPoint Slide Design', max: 100, assessment: 100, practical: 100, marks: 94, pct: '94%' },
      { id: 4, name: 'Office Automation & Productivity', max: 100, assessment: 100, practical: 100, marks: 97, pct: '97%' },
      { id: 5, name: 'Applied Office Project & Viva', max: 100, assessment: 100, practical: 100, marks: 95, pct: '95%' }
    ];
  }

  if (course.includes('handwrit') || course.includes('calligraph')) {
    return [
      { id: 1, name: 'Basic Letter Formation & Slant', max: 100, assessment: 100, practical: 100, marks: 96, pct: '96%' },
      { id: 2, name: 'Cursive Flow & Ligature Joins', max: 100, assessment: 100, practical: 100, marks: 98, pct: '98%' },
      { id: 3, name: 'Word Spacing & Line Proportions', max: 100, assessment: 100, practical: 100, marks: 94, pct: '94%' },
      { id: 4, name: 'Speed Transcription Under Clock', max: 100, assessment: 100, practical: 100, marks: 97, pct: '97%' },
      { id: 5, name: 'Spotless Notebook Presentation', max: 100, assessment: 100, practical: 100, marks: 95, pct: '95%' }
    ];
  }

  // Default: Abacus Speed Arithmetic
  return [
    { id: 1, name: 'Abacus Operations & Bead Technique', max: 100, assessment: 100, practical: 100, marks: 96, pct: '96%' },
    { id: 2, name: 'Small Friend & Big Friend Formulas', max: 100, assessment: 100, practical: 100, marks: 98, pct: '98%' },
    { id: 3, name: 'Mental Arithmetic & Visual Anzan', max: 100, assessment: 100, practical: 100, marks: 94, pct: '94%' },
    { id: 4, name: 'Rapid Multi-Row Calculation Drills', max: 100, assessment: 100, practical: 100, marks: 97, pct: '97%' },
    { id: 5, name: 'Speed Arithmetic Accuracy & Viva', max: 100, assessment: 100, practical: 100, marks: 95, pct: '95%' }
  ];
};
