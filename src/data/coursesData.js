// Central Master Courses & Curriculum Repository for B★SEL
import abacusImg from '../assets/programs/abacus.jpg';
import drawingArtImg from '../assets/programs/drawing-art.jpg';
import handwritingImg from '../assets/programs/handwriting.jpg';
import phonicsImg from '../assets/programs/phonics.jpg';
import languageSpeakingImg from '../assets/programs/language-speaking.jpg';
import athleticsImg from '../assets/programs/athletics.jpg';
import colourManagementImg from '../assets/programs/colour-management.jpg';
import memoryImg from '../assets/programs/memory.jpg';
import danceImg from '../assets/programs/dance.jpg';
import msofficeImg from '../assets/programs/msoffice.jpg';
import htmlImg from '../assets/programs/html.png';
import cssImg from '../assets/programs/css.png';
import pythonImg from '../assets/programs/python.png';
import aiImg from '../assets/programs/ai.jpg';
import canvaImg from '../assets/programs/canva.png';
import computerImg from '../assets/programs/computer.png';
import photoshopImg from '../assets/programs/photoshop.png';

export const DEFAULT_COURSES = [
  {
    id: 'abacus',
    code: 'AB',
    name: 'Abacus',
    fullName: 'ABACUS SPEED ARITHMETIC',
    category: 'Skill Development',
    tagline: 'Improve mental math, concentration, and calculation speed.',
    shortDesc: 'Improve mental math, concentration, and calculation speed through whole-brain cognitive training.',
    fee: '₹450',
    feeAmount: 450,
    themeColor: 'from-emerald-500 to-teal-600',
    accentColor: 'text-emerald-700',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    image: abacusImg,
    ageGroup: '5 - 14 Years',
    levels: '8 Structured Levels',
    duration: '3 Months per Level',
    status: 'Active',
    enrolledStudents: 142,
    description: 'B★SEL Abacus program trains children to perform lightning-fast mental arithmetic calculations without pen and paper, boosting right-brain hemisphere development and photographic memory.',
    outcomes: [
      'Increases calculation speed by 5x to 10x',
      'Enhances concentration, listening skills and focus',
      'Boosts visual memory and spatial thinking',
      'Removes math phobia and instills lifelong confidence'
    ],
    curriculum: [
      'Level 1-2: Direct operations & bead manipulation basics',
      'Level 3-4: Small friend & big friend formula mastery',
      'Level 5-6: Double & triple-digit multiplication & division',
      'Level 7-8: Advanced mental calculation & flash anzan tests'
    ]
  },
  {
    id: 'drawing-art',
    code: 'DR',
    name: 'Drawing & Art',
    fullName: 'DRAWING & FINE ARTS',
    category: 'Creative Arts',
    tagline: 'Express creativity through imagination and artistic skills.',
    shortDesc: 'Express creativity through imagination, color theory, and fine arts.',
    fee: '₹400',
    feeAmount: 400,
    themeColor: 'from-sky-500 to-blue-600',
    accentColor: 'text-sky-700',
    badgeColor: 'bg-sky-100 text-sky-800',
    image: drawingArtImg,
    ageGroup: '4 - 16 Years',
    levels: '6 Progressive Levels',
    duration: '3 Months per Level',
    status: 'Active',
    enrolledStudents: 98,
    description: 'A comprehensive fine-arts curriculum nurturing natural creative flair, color harmony, perspective drawing, shading, and observational skills from basic sketching to fine canvas art.',
    outcomes: [
      'Sharpens observational ability and fine motor control',
      'Teaches color theory, light, shadow, and depth',
      'Encourages lateral thinking and original expression',
      'Prepares students for prestigious national art exhibitions'
    ],
    curriculum: [
      'Level 1: Shapes, lines, patterns & oil pastel coloring',
      'Level 2: Landscape, object drawing & color gradation',
      'Level 3: Water color washes, still life & perspective',
      'Level 4-6: Acrylics, human anatomy, portraits & creative concept'
    ]
  },
  {
    id: 'handwriting',
    code: 'HW',
    name: 'Handwriting',
    fullName: 'SCIENTIFIC HANDWRITING & CALLIGRAPHY',
    category: 'Skill Development',
    tagline: 'Develop neat, clear, and confident handwriting.',
    shortDesc: 'Scientific handwriting improvement focusing on ergonomics, posture, and cursive legibility.',
    fee: '₹350',
    feeAmount: 350,
    themeColor: 'from-amber-500 to-orange-600',
    accentColor: 'text-amber-700',
    badgeColor: 'bg-amber-100 text-amber-800',
    image: handwritingImg,
    ageGroup: '6 - 18 Years',
    levels: '3 Intensive Modules',
    duration: '30 Days Crash / 3 Months Regular',
    status: 'Active',
    enrolledStudents: 85,
    description: 'Scientific handwriting improvement program focusing on pencil grip, posture, uniform slant, letter sizing, baseline alignment, and speed writing for academic exams.',
    outcomes: [
      'Transforms messy, illegible handwriting into print & cursive beauty',
      'Improves exam scores through clean presentation',
      'Increases writing speed without losing neatness',
      'Builds posture ergonomics and writing endurance'
    ],
    curriculum: [
      'Module 1: Ergonomics, pencil grip, strokes and baseline alignment',
      'Module 2: Upper & lower case cursive connections and letter zoning',
      'Module 3: Speed enhancement drills and paragraph layout'
    ]
  },
  {
    id: 'phonics',
    code: 'PH',
    name: 'Phonics & English Reading',
    fullName: 'JOLLY PHONICS & EARLY LITERACY',
    category: 'Languages',
    tagline: 'Master pronunciation, phonemic awareness, and reading fluency.',
    shortDesc: 'Phonics system for early reading, correct pronunciation, and word blending.',
    fee: '₹400',
    feeAmount: 400,
    themeColor: 'from-purple-500 to-pink-600',
    accentColor: 'text-purple-700',
    badgeColor: 'bg-purple-100 text-purple-800',
    image: phonicsImg,
    ageGroup: '4 - 10 Years',
    levels: '4 Progressive Stages',
    duration: '3 Months per Stage',
    status: 'Active',
    enrolledStudents: 64,
    description: 'Structured 42 letter-sounds phonics methodology enabling young learners to decode unfamiliar words, spell accurately, and develop fluent English articulation.',
    outcomes: [
      'Mastery of 42 fundamental English letter sounds and actions',
      'Effortless blending for reading multi-syllable vocabulary',
      'Spelling accuracy without rote memorization',
      'Expressive reading comprehension and clear vocal diction'
    ],
    curriculum: [
      'Stage 1: 42 letter sounds & sound-action associations',
      'Stage 2: Blending 3-letter CVC words & tricky sight words',
      'Stage 3: Digraphs, diphthongs & alternative spellings',
      'Stage 4: Guided reading fluency, comprehension & expression'
    ]
  },
  {
    id: 'python-coding',
    code: 'PY',
    name: 'Python for Young Coders',
    fullName: 'PYTHON PROGRAMMING & LOGIC',
    category: 'Digital & Technology',
    tagline: 'Step into modern programming with Python syntax and algorithms.',
    shortDesc: 'Step into modern programming with Python syntax, loops, game logic, and problem solving.',
    fee: '₹650',
    feeAmount: 650,
    themeColor: 'from-blue-600 to-cyan-600',
    accentColor: 'text-blue-700',
    badgeColor: 'bg-blue-100 text-blue-800',
    image: pythonImg,
    ageGroup: '10 - 18 Years',
    levels: '4 Comprehensive Modules',
    duration: '4 Months',
    status: 'Active',
    enrolledStudents: 76,
    description: 'Hands-on coding journey teaching computational thinking, data types, condition logic, functions, and Turtle graphics game design for school students.',
    outcomes: [
      'Write clean, readable Python scripts independently',
      'Understand loops, arrays, dictionaries, and conditional logic',
      'Create 2D interactive arcade games using Turtle & Pygame',
      'Build computational algorithmic problem-solving instincts'
    ],
    curriculum: [
      'Module 1: Variables, Input/Output & Operators',
      'Module 2: Decision Trees, While/For Loops & Functions',
      'Module 3: Lists, Tuples, Dictionaries & String Manipulation',
      'Module 4: Turtle Graphics, Mini Games & Project Showcase'
    ]
  },
  {
    id: 'ai-prompt-engineering',
    code: 'AI',
    name: 'AI & Prompt Engineering',
    fullName: 'ARTIFICIAL INTELLIGENCE & PROMPT ENGINEERING',
    category: 'Digital & Technology',
    tagline: 'Master generative AI tools, prompt craft, and automation.',
    shortDesc: 'Master generative AI tools, prompt crafting, safe AI usage, and productivity automation.',
    fee: '₹750',
    feeAmount: 750,
    themeColor: 'from-indigo-600 to-violet-700',
    accentColor: 'text-indigo-700',
    badgeColor: 'bg-indigo-100 text-indigo-800',
    image: aiImg,
    ageGroup: '11 - 18 Years & Adults',
    levels: '3 Strategic Modules',
    duration: '2 Months',
    status: 'Active',
    enrolledStudents: 52,
    description: 'Empowers students with future-ready AI literacy: prompt design strategies, ChatGPT, Claude, visual generation, ethical AI guidelines, and academic research acceleration.',
    outcomes: [
      'Craft high-precision prompts for text, code, and creative tasks',
      'Use multimodal AI for school presentations and creative projects',
      'Understand AI ethics, hallucinations, and critical verification',
      'Automate repetitive study tasks and accelerate research'
    ],
    curriculum: [
      'Module 1: AI Foundations & Large Language Models Demystified',
      'Module 2: Prompt Engineering Frameworks & Chain-of-Thought',
      'Module 3: Multimodal Tools, Image Synthesis & Future Tech Ethics'
    ]
  },
  {
    id: 'canva-design',
    code: 'CV',
    name: 'Canva Graphic Design',
    fullName: 'DIGITAL GRAPHIC DESIGN & CANVA CREATIVE',
    category: 'Creative Arts',
    tagline: 'Create posters, logos, social media visuals, and presentations.',
    shortDesc: 'Create eye-catching posters, school projects, flyers, and digital presentations using Canva.',
    fee: '₹450',
    feeAmount: 450,
    themeColor: 'from-fuchsia-600 to-rose-600',
    accentColor: 'text-fuchsia-700',
    badgeColor: 'bg-fuchsia-100 text-fuchsia-800',
    image: canvaImg,
    ageGroup: '8 - 18 Years',
    levels: '3 Hands-on Levels',
    duration: '2 Months',
    status: 'Active',
    enrolledStudents: 49,
    description: 'Teaches design hierarchy, typography, color harmony, and brand kits through Canva, empowering students to create stunning visual presentations and posters.',
    outcomes: [
      'Understand visual layout, contrast, and balance',
      'Design school presentation decks, event flyers, and certificates',
      'Produce animated video clips and social graphics',
      'Master asset exports for both digital display and professional print'
    ],
    curriculum: [
      'Level 1: Canvas Layout, Elements, Typography & Color Harmony',
      'Level 2: Poster, Flyer, Brochure & Presentation Deck Design',
      'Level 3: Animations, Video Shorts & Print Production Rules'
    ]
  },
  {
    id: 'computer-fundamentals',
    code: 'CM',
    name: 'Computer Fundamentals & MS Office',
    fullName: 'COMPUTER HARDWARE, DIGITAL LITERACY & MS OFFICE',
    category: 'Digital & Technology',
    tagline: 'Learn computers from hardware to Word, Excel, and PowerPoint.',
    shortDesc: 'Hardware recognition, Windows navigation, touch typing, MS Word, Excel, and internet safety.',
    fee: '₹450',
    feeAmount: 450,
    themeColor: 'from-slate-600 to-gray-800',
    accentColor: 'text-slate-700',
    badgeColor: 'bg-slate-100 text-slate-800',
    image: computerImg,
    ageGroup: '6+ Years & Beginners',
    levels: '4 Structured Levels',
    duration: '3 Months',
    status: 'Active',
    enrolledStudents: 110,
    description: 'Builds fundamental digital literacy: hardware recognition, keyboard typing speed, file management, document drafting in Word, spreadsheets in Excel, and slides in PowerPoint.',
    outcomes: [
      'Touch typing speed with accurate posture ergonomics',
      'Create formatted documents, resumes, and reports in Word',
      'Calculate sums, formulas, and charts in Excel spreadsheets',
      'Design impactful slide presentations in PowerPoint'
    ],
    curriculum: [
      'Level 1: Hardware, Operating System, Touch Typing & Folders',
      'Level 2: MS Word Formatting, Tables & Document Publishing',
      'Level 3: MS Excel Formulas, Functions & Chart Visualizations',
      'Level 4: MS PowerPoint Slides, Internet Ethics & Cyber Safety'
    ]
  }
];

export const getStoredCourses = () => {
  if (typeof window === 'undefined') return DEFAULT_COURSES;
  try {
    const raw = localStorage.getItem('bsel_courses_data');
    if (!raw) {
      localStorage.setItem('bsel_courses_data', JSON.stringify(DEFAULT_COURSES));
      return DEFAULT_COURSES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_COURSES;
  } catch {
    return DEFAULT_COURSES;
  }
};

export const saveStoredCourses = (courses) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('bsel_courses_data', JSON.stringify(courses));
      window.dispatchEvent(new Event('bsel_courses_updated'));
    } catch (err) {
      console.error('Error saving courses to localStorage:', err);
    }
  }
  return courses;
};

export const addStoredCourse = (newCourse) => {
  const courses = getStoredCourses();
  const slug = (newCourse.name || 'course')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const id = newCourse.id || slug || `course-${Date.now()}`;
  const code = newCourse.code || slug.slice(0, 3).toUpperCase();

  const courseRecord = {
    ...newCourse,
    id,
    code,
    fullName: newCourse.fullName || newCourse.name?.toUpperCase(),
    status: newCourse.status || 'Active',
    enrolledStudents: 0,
    fee: newCourse.fee ? (newCourse.fee.startsWith('₹') ? newCourse.fee : `₹${newCourse.fee}`) : '₹450',
    badgeColor: newCourse.badgeColor || 'bg-blue-100 text-blue-800',
    themeColor: newCourse.themeColor || 'from-blue-600 to-indigo-700',
    accentColor: newCourse.accentColor || 'text-blue-700',
    outcomes: Array.isArray(newCourse.outcomes) ? newCourse.outcomes : (newCourse.outcomes ? newCourse.outcomes.split('\n').filter(Boolean) : [
      'Master core theoretical and practical principles',
      'Develop independent problem-solving skills',
      'Earn accredited B★SEL course completion certificate'
    ]),
    curriculum: Array.isArray(newCourse.curriculum) ? newCourse.curriculum : (newCourse.curriculum ? newCourse.curriculum.split('\n').filter(Boolean) : [
      'Level 1: Foundational Concepts & Basics',
      'Level 2: Intermediate Techniques & Practice',
      'Level 3: Advanced Applications & Assessment'
    ])
  };

  const updated = [courseRecord, ...courses];
  saveStoredCourses(updated);
  return updated;
};

export const updateStoredCourse = (courseId, updatedFields) => {
  const courses = getStoredCourses();
  const index = courses.findIndex(c => c.id === courseId);
  if (index === -1) return courses;

  courses[index] = {
    ...courses[index],
    ...updatedFields
  };

  saveStoredCourses(courses);
  return courses;
};

export const deleteStoredCourse = (courseId) => {
  const courses = getStoredCourses();
  const updated = courses.filter(c => c.id !== courseId);
  saveStoredCourses(updated);
  return updated;
};

export const resetStoredCourses = () => {
  saveStoredCourses(DEFAULT_COURSES);
  return DEFAULT_COURSES;
};
