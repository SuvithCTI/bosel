import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  Users, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  GraduationCap, 
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  Lock,
  CreditCard,
  QrCode,
  Building2,
  ShieldCheck,
  Loader2,
  Printer,
  Ticket,
  Calendar,
  MapPin,
  School,
  Check
} from 'lucide-react';
import ProgramIcon from '../components/ProgramIcons';

// Images for 14 programs
import abacusImg from '../assets/programs/abacus.jpg';
import handwritingImg from '../assets/programs/handwriting.jpg';
import phonicsImg from '../assets/programs/phonics.jpg';
import drawingArtImg from '../assets/programs/drawing-art.jpg';
import memoryImg from '../assets/programs/memory.jpg';
import danceImg from '../assets/programs/dance.jpg';
import msofficeImg from '../assets/programs/msoffice.jpg';
import htmlImg from '../assets/programs/html.png';
import cssImg from '../assets/programs/css.png';
import pythonImg from '../assets/programs/python.png';
import computerImg from '../assets/programs/computer.png';
import photoshopImg from '../assets/programs/photoshop.png';
import aiImg from '../assets/programs/ai.jpg';
import canvaImg from '../assets/programs/canva.png';

// Comprehensive dataset for 14 programs across Skill Development and Digital & Technology
const ALL_PROGRAMS = [
  // -------------------------------------------------------------
  // SKILL DEVELOPMENT PROGRAMS (6)
  // -------------------------------------------------------------
  {
    id: 'abacus',
    category: 'skill',
    name: 'Abacus',
    fullName: 'ABACUS SPEED ARITHMETIC',
    tagline: 'Think Fast, Calculate Smart',
    fee: '₹450',
    feeAmount: 450,
    themeColor: 'from-emerald-500 to-teal-600',
    accentColor: 'text-emerald-700',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    image: abacusImg,
    ageGroup: '5 - 14 Years',
    levels: 'Level 1 to 9 (3 - 4 Months per Level)',
    duration: '3 - 4 Months per Level',
    description: 'Builds mental calculation, concentration and number skills through structured abacus practice, mental Anzan drills, and whole-brain cognitive training.',
    outcomes: [
      'Increases calculation speed by 5x to 10x through rapid mental math',
      'Enhances concentration, listening power, and spatial visualization',
      'Boosts visual memory, pattern recognition, and photographic recall',
      'Eliminates math phobia and instills lifelong academic confidence'
    ],
    curriculum: [
      {
        title: 'Level 1: Bead Fundamentals & Direct Operations',
        topics: [
          'Abacus structure, frame anatomy, and holding technique (pencil-finger grip)',
          'Direct addition and subtraction on 1-digit and 2-digit numbers without formulas',
          'Mental arithmetic (Anzan) foundation using finger visualization and bead counting'
        ]
      },
      {
        title: 'Level 2: Small Friend Concept (+5 and -5 Formulas)',
        topics: [
          'Complementary numbers to base 5 (Friends: 4 & 1, 3 & 2)',
          'Multi-digit speed drills combining direct manipulation with Base-5 rules',
          'Rapid oral dictation calculations up to 10 continuous rows'
        ]
      },
      {
        title: 'Level 3: Big Friend Concept (+10 and -10 Formulas)',
        topics: [
          'Base 10 complementary numbers (9&1, 8&2, 7&3, 6&4, 5&5)',
          'High-speed 2-digit continuous addition and subtraction',
          'Flash card reading and mental visualization speed checks'
        ]
      },
      {
        title: 'Level 4: Combination Formulas (Mixed Operations)',
        topics: [
          'Complex problems combining Small Friend (+5/-5) and Big Friend (+10/-10)',
          '3-digit multi-row calculations with strict accuracy metrics',
          'Timed competitive worksheets under simulated examination clocks'
        ]
      },
      {
        title: 'Level 5: Multiplication Fundamentals (2D x 1D & 3D x 1D)',
        topics: [
          'Multi-digit multiplication theory on the abacus frame',
          'Position values, decimal placement, and product distribution across rods',
          'Pure mental multiplication (2-digit by 1-digit) without the physical tool'
        ]
      },
      {
        title: 'Level 6: Division Principles & Decimals',
        topics: [
          'Multi-digit division mechanics on abacus rods (3D ÷ 1D and 4D ÷ 1D)',
          'Remainder calculation, quotient placement, and decimal arithmetic',
          'Dual-hand speed drills to activate left and right brain hemispheres'
        ]
      },
      {
        title: 'Level 7: Advanced Multiplication & Long Division (3D x 2D, 4D ÷ 2D)',
        topics: [
          'Advanced multi-digit multiplication of 3-digit by 2-digit numbers',
          'Multi-step long division, percentage conversions, and fractional calculations',
          'Targeted speed drills: solving 30 complex sums in under 3 minutes'
        ]
      },
      {
        title: 'Level 8: Higher Mental Arithmetic & Flash Anzan',
        topics: [
          'High-order mental arithmetic with negative numbers, fractions, and square roots',
          'Flash Anzan: numbers flashed on screen at rapid 0.5-second intervals',
          'Comprehensive state and national championship simulation exams'
        ]
      },
      {
        title: 'Level 9: Grand Master Level & Championship Mastery',
        topics: [
          'Mastery of multi-operation speed arithmetic without pencil or physical frame',
          'Lightning-fast multi-digit decimal multiplications and division',
          'Championship exam preparation and international competition benchmarking'
        ]
      }
    ]
  },
  {
    id: 'handwriting',
    category: 'skill',
    name: 'Handwriting',
    fullName: 'CALLIGRAPHY & HANDWRITING MASTERY',
    tagline: 'Write Neat, Write Confident',
    fee: '₹400',
    feeAmount: 400,
    themeColor: 'from-amber-500 to-orange-600',
    accentColor: 'text-amber-700',
    badgeColor: 'bg-amber-100 text-amber-800',
    image: handwritingImg,
    ageGroup: '5 - 16 Years',
    levels: '4 Structured Levels',
    duration: '3 Months per Level',
    description: 'Develops neat writing, proper letter formation, spacing and writing confidence for examination excellence and legible everyday penmanship.',
    outcomes: [
      'Mastery of correct pen/pencil grip, posture, and line alignment',
      'Fluid cursive connections, uniform slant, and consistent letter proportions',
      'Accelerates handwriting speed without sacrificing neatness and clarity',
      'Eliminates illegibility and boosts exam marks with spotless presentation'
    ],
    curriculum: [
      {
        title: 'Level 1: Letter Formation',
        topics: [
          'Pencil grip ergonomics, finger positioning, and posture alignment',
          'Basic strokes, curves, loops, and uppercase & lowercase print letter forms',
          'Four-line workbook practice and baseline control'
        ]
      },
      {
        title: 'Level 2: Word Joining',
        topics: [
          'Connecting lowercase letters with smooth ligature joins',
          'Two-letter and three-letter blend combinations and transitions',
          'Consistent letter height ratios, ascenders, and descenders'
        ]
      },
      {
        title: 'Level 3: Word Construction',
        topics: [
          'Multi-syllable word construction and capital-to-small letter transitions',
          'Uniform word slant (forward / vertical) and consistent spacing between letters',
          'Margin management, paragraph alignment, and ruled-to-unruled paper transition'
        ]
      },
      {
        title: 'Level 4: Cursive Flow, Spacing & Neatness',
        topics: [
          'Continuous cursive rhythm and natural fluid pen movement',
          'Uniform inter-word and inter-line spacing for clean readability',
          'Speed writing drills under timed examination conditions',
          'Final showcase: spotless essay presentation and calligraphy basics'
        ]
      }
    ]
  },
  {
    id: 'phonics',
    category: 'skill',
    name: 'Phonics',
    fullName: 'EARLY PHONICS & READING MASTERY',
    tagline: 'Listen, Blend, Read Better',
    fee: '₹450',
    feeAmount: 450,
    themeColor: 'from-rose-500 to-pink-600',
    accentColor: 'text-rose-700',
    badgeColor: 'bg-rose-100 text-rose-800',
    image: phonicsImg,
    ageGroup: '4 - 10 Years',
    levels: '4 Structured Levels',
    duration: '3 Months per Level',
    description: 'Builds pronunciation, blending, reading and early word-decoding skills systematically through multi-sensory phonetic instruction.',
    outcomes: [
      'Mastery of 42 core phonemes, consonant digraphs, and vowel diphthongs',
      'Effortless blending for reading unfamiliar 3-letter, 4-letter, and multi-syllable words',
      'Sharp auditory discrimination and accurate phonetic spelling without rote memory',
      'Builds expressive reading fluency, correct enunciation, and independent comprehension'
    ],
    curriculum: [
      {
        title: 'Level 1: Phonetic Word Formation',
        topics: [
          'The 42 core phoneme letter sounds and multi-sensory sound identification',
          'Consonant-Vowel-Consonant (CVC) 3-letter word blending and segmenting',
          'Short vowel sounds (/a/, /e/, /i/, /o/, /u/) and initial consonant blends'
        ]
      },
      {
        title: 'Level 2: Structural Sentence Syntax',
        topics: [
          'Long vowel digraphs (ai, ee, igh, oa, oo) and split digraphs (magic e)',
          'Essential sight words and structural sentence formation',
          'Punctuation awareness (capital letters, periods, questions) and decodable reader books'
        ]
      },
      {
        title: 'Level 3: Text Construction & Paragraphing',
        topics: [
          'Consonant blends (bl, cr, st, nd) and tricky diphthongs (oi, oy, ou, ow)',
          'Reading fluency with intonation, expression, and voice modulation',
          'Short paragraph comprehension, compound words, and reading aloud confidence'
        ]
      },
      {
        title: 'Level 4: High-Frequency Lexicon, Auditory Dictation & Spelling',
        topics: [
          'Advanced multi-syllable word decoding and syllabification rules',
          'High-frequency vocabulary expansion and contextual word usage',
          'Auditory dictation drills, spelling rules, silent letters, and public storytelling'
        ]
      }
    ]
  },
  {
    id: 'drawing-art',
    category: 'skill',
    name: 'Drawing',
    fullName: 'CREATIVE DRAWING & VISUAL ARTS',
    tagline: 'Imagine, Create, Express',
    fee: '₹400',
    feeAmount: 400,
    themeColor: 'from-sky-500 to-blue-600',
    accentColor: 'text-sky-700',
    badgeColor: 'bg-sky-100 text-sky-800',
    image: drawingArtImg,
    ageGroup: '4 - 15 Years',
    levels: '4 Structured Levels',
    duration: '3 Months per Level',
    description: 'Encourages creativity, observation and artistic expression through guided drawing activities, color grading, perspective, and shading.',
    outcomes: [
      'Sharpens visual observation and fine motor pencil control',
      'Teaches color harmony, tonal blending, and perspective techniques',
      'Explores versatile artistic mediums from oil pastels to watercolors and graphite',
      'Nurtures original creative imagination and exhibition-worthy artwork'
    ],
    curriculum: [
      {
        title: 'Level 1: Lines, Shapes & Basic Sketching',
        topics: [
          'Types of lines (straight, curved, zig-zag) and geometric shape construction',
          'Grip techniques for crayons and oil pastels with border neatness',
          'Basic flat color filling and simple object sketching (fruits, trees, cartoons)'
        ]
      },
      {
        title: 'Level 2: Object Drawing & Colour Gradation',
        topics: [
          'Freehand sketching of daily objects, vehicles, and animal outlines',
          'Primary and secondary color mixing with smooth 2-tone gradation shading',
          'Foreground and background composition balance on cartridge sheets'
        ]
      },
      {
        title: 'Level 3: Watercolor Washes & Perspective',
        topics: [
          'Wet-on-wet and wet-on-dry watercolor brush techniques',
          '1-point perspective drawing: roads, buildings, and tree lines',
          'Still life observation: identifying light direction, highlights, and cast shadows'
        ]
      },
      {
        title: 'Level 4: Pencil Shading, Textures & Final Artwork',
        topics: [
          'Graphite pencil grading (2B to 8B) for realistic shading and cross-hatching',
          'Surface textures (wood, water ripples, cloth folds, foliage)',
          'Complete themed artwork composition and solo exhibition portfolio'
        ]
      }
    ]
  },
  {
    id: 'memory-challenge',
    category: 'skill',
    name: 'Memory Challenge',
    fullName: 'COGNITIVE MEMORY & RECALL MASTERY',
    tagline: 'Remember More, Forget Less',
    fee: '₹450',
    feeAmount: 450,
    themeColor: 'from-indigo-500 to-violet-600',
    accentColor: 'text-indigo-700',
    badgeColor: 'bg-indigo-100 text-indigo-800',
    image: memoryImg,
    imagePosition: 'object-bottom',
    ageGroup: '6 - 16 Years',
    levels: '4 Cognitive Levels',
    duration: '3 Months per Level',
    description: 'Sharpens focus, recall techniques, pattern recognition and cognitive memory power through structured mnemonic and brain-training methodologies.',
    outcomes: [
      'Expands working memory capacity, photographic recall, and attention span',
      'Mastery of mnemonic peg systems, number-shape association, and memory palaces',
      'Accelerates study efficiency for school subjects, dates, vocabulary, and formulas',
      'Prepares students for competitive memory championships and scholastic olympiads'
    ],
    curriculum: [
      {
        title: 'Level 1: Concentration & Visual Memory',
        topics: [
          'Observation drills, focus endurance, and peripheral visual tracking',
          'Photographic recall of flash cards, patterns, and grid positions',
          'Sequential memory exercises for words, objects, and colors'
        ]
      },
      {
        title: 'Level 2: Association & Peg Systems',
        topics: [
          'Number-rhyme system (1-Sun, 2-Shoe) and number-shape peg system',
          'Linking technique: creating vivid mental stories to memorize lists',
          'Remembering historical dates, state capitals, and scientific classifications'
        ]
      },
      {
        title: 'Level 3: Mind Mapping & Journey Method',
        topics: [
          'Method of Loci (Memory Palace) technique: encoding facts in spatial rooms',
          'Mind mapping for complex academic chapters and fast exam revisions',
          'Memorizing long speeches, poems, and 50+ random words in forward & reverse order'
        ]
      },
      {
        title: 'Level 4: Rapid Recall & Championship Drills',
        topics: [
          'Major system fundamentals for memorizing 100-digit number strings',
          'Speed memorization of random playing card decks and calendar dates',
          'Cognitive stamina drills under pressure and championship simulation tests'
        ]
      }
    ]
  },
  {
    id: 'bharatanatyam',
    category: 'skill',
    name: 'Bharatanatyam',
    fullName: 'CLASSICAL BHARATANATYAM DANCE',
    tagline: 'Grace, Rhythm, Tradition',
    fee: '₹500',
    feeAmount: 500,
    themeColor: 'from-purple-500 to-indigo-600',
    accentColor: 'text-purple-700',
    badgeColor: 'bg-purple-100 text-purple-800',
    image: danceImg,
    ageGroup: '5 - 16 Years',
    levels: '4 Classical Levels',
    duration: '3 Months per Level',
    description: 'Introduces rhythm, expressions, basic movements and cultural dance discipline through traditional Bharatanatyam adavus and abhinaya.',
    outcomes: [
      'Develops graceful posture, physical stamina, flexibility, and stage presence',
      'Mastery of foundational Adavus, Asamyuta/Samyuta Hastas, and rhythmic footwork',
      'Teaches Tala counting, beat synchronization, and classical music appreciation',
      'Builds expressive storytelling abilities through facial Bhavas and Navarasas'
    ],
    curriculum: [
      {
        title: 'Level 1: Namaskaram & Foundational Adavus',
        topics: [
          'Bhoomi Namaskaram ritual and Dhyana Slokam recital',
          'Posture foundations: Aramandi (half-sit) and Muzhumandi (full-sit) positions',
          'Tatta Adavus (stepping on flat feet) and Natta Adavus (heel-toe coordination)'
        ]
      },
      {
        title: 'Level 2: Asamyuta & Samyuta Hastas',
        topics: [
          '28 Asamyuta Hastas (single-hand gestures) and 24 Samyuta Hastas (double-hand gestures)',
          'Kuditta Mettu Adavus, Sarikkal Adavus, and eye movements (Drishti Bheda)',
          'Neck movements (Griva Bheda) and head movements (Shiro Bheda)'
        ]
      },
      {
        title: 'Level 3: Jathis, Tala & Rhythmic Footwork',
        topics: [
          'Understanding Tala cycles: Adi Talam, Rupaka Talam, and beat counts',
          'Executing footwork across three speeds (Vilambita, Madhyama, Druta)',
          'Korvais (rhythmic dance patterns) and basic Alarippu movements'
        ]
      },
      {
        title: 'Level 4: Abhinaya, Bhavas & Stage Recital',
        topics: [
          'Facial expression techniques (Bhavas) and introduction to Navarasas',
          'Storytelling through hand gestures, lyric interpretation, and emotional conveyance',
          'Solo performance recital, stage presence, costume aesthetics, and certification routine'
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // DIGITAL & TECHNOLOGY PROGRAMS (8)
  // -------------------------------------------------------------
  {
    id: 'ms-office',
    category: 'digital',
    name: 'MS Office Master Course',
    fullName: 'MICROSOFT OFFICE PRODUCTIVITY SUITE',
    tagline: 'Create, Organize, Work Smarter',
    fee: '₹650',
    feeAmount: 650,
    themeColor: 'from-blue-600 to-indigo-700',
    accentColor: 'text-blue-700',
    badgeColor: 'bg-blue-100 text-blue-800',
    image: msofficeImg,
    ageGroup: '8+ Years & Adults',
    levels: '4 Modules',
    duration: '3 - 6 Months',
    description: 'Teaches document creation, spreadsheets, presentations and office productivity tools across Microsoft Word, Excel, PowerPoint, and Outlook.',
    outcomes: [
      'Mastery of professional formatting, mail merge, and automated reports in MS Word',
      'Advanced spreadsheet modeling with VLOOKUP, XLOOKUP, Pivot Tables, and Dashboards in MS Excel',
      'Engaging business and portfolio presentations with morph transitions in MS PowerPoint',
      'Efficient calendar scheduling, inbox organization, and professional communication in MS Outlook'
    ],
    curriculum: [
      {
        title: 'Module 1: MS Word Mastery (9 Levels)',
        topics: [
          'Basic Formatting (Typing, Navigation, Fonts, Alignment, Spacing)',
          'Page Layouts & Tables (Margins, Headers, Footers, Tables, PDF Export)',
          'Graphics & Objects (Images, Shapes, SmartArt, Text Wrapping, Symbols)',
          'Editing & Reviewing (Find & Replace, Spell Check, Track Changes, Password)',
          'References & Indexing (Table of Contents, Footnotes, Citations, Captions)',
          'Mail Merge Mastery (Data Sources, Letters, Envelopes & Labels, Filtering)',
          'Templates & Forms (Fillable Forms, Restricting Editing, Macros Basics)',
          'Professional Documents (Resume/CV, Project Reports, Newsletter Design)',
          'Capstone Project (Book/Manual Creation, Multi-level Indexing, Compilation)'
        ]
      },
      {
        title: 'Module 2: MS Excel Mastery (9 Levels)',
        topics: [
          'Data Entry & Basics (Rows, Columns, Cells, Formatting, Alignment)',
          'Basic Formulas (SUM, AVERAGE, COUNT, MIN, MAX, AutoFill, Cell References)',
          'Data Management (Sorting, Filtering, Find & Replace, Freeze Panes, Dropdowns)',
          'Charts & Visuals (Bar, Pie, Line Charts, Sparklines, Conditional Formatting)',
          'Logical Functions (IF, Nested IF, AND, OR, NOT, IFERROR, COUNTIF, SUMIF)',
          'Lookup & Reference (VLOOKUP, HLOOKUP, INDEX & MATCH, XLOOKUP, CHOOSE)',
          'Text & Date Functions (CONCATENATE, LEFT, RIGHT, MID, LEN, TRIM, TODAY, DATEDIF)',
          'Data Analysis (Pivot Tables, Pivot Charts, Slicers, What-If Analysis)',
          'Automation & Dashboard (Recording Macros, VBA Basics, Power Query, Live Dashboard)'
        ]
      },
      {
        title: 'Module 3: MS PowerPoint (4 Levels)',
        topics: [
          'Basics & Design (Slide Layouts, Themes, Text Formatting, Shapes & Backgrounds)',
          'Transitions & Animations (Slide Transitions, Object Animations, Audio/Video, SmartArt)',
          'Advanced Features (Slide Master, Action Buttons, Presenter View, Zoom/Morph Transitions)',
          'Professional Presentation (Storytelling with Slides, Interactive Decks, Public Delivery)'
        ]
      },
      {
        title: 'Module 4: MS Outlook (4 Levels)',
        topics: [
          'Email Basics (Interface Navigation, Compose, Attachments, Folders, Search)',
          'Organizing & Rules (Contacts, Categories, Flags, Spam Management, Auto-Reply)',
          'Calendar & Tasks (Scheduling Meetings, Calendar Sharing, To-Do Lists, Reminders)',
          'Professional Etiquette (Formal Email Writing, Multi-Account Sync, Archiving & Phishing Awareness)'
        ]
      }
    ]
  },
  {
    id: 'html-basics',
    category: 'digital',
    name: 'HTML Web Foundations',
    fullName: 'HTML5 WEBPAGE ARCHITECTURE',
    tagline: 'Build the Web from Scratch',
    fee: '₹500',
    feeAmount: 500,
    themeColor: 'from-orange-500 to-red-600',
    accentColor: 'text-orange-700',
    badgeColor: 'bg-orange-100 text-orange-800',
    image: htmlImg,
    ageGroup: '10+ Years & College',
    levels: '4 Structured Levels',
    duration: '3 Months',
    description: 'Introduces webpage structure, tags, elements, and foundational web designing concepts from basic document layouts to interactive HTML5 forms and portfolio projects.',
    outcomes: [
      'Understand HTML document architecture, DOCTYPE declarations, and tag semantics',
      'Construct structured data tables, embedded media players, and complex lists',
      'Build full-fledged interactive forms with validations and input controls',
      'Create modern semantic HTML5 layouts and deploy a personal portfolio website'
    ],
    curriculum: [
      {
        title: 'Level 1: HTML Foundations (Basic Tags)',
        topics: [
          'HTML Document Structure',
          'Headings & Paragraphs',
          'Text Formatting',
          'Basic Lists',
          'Images & Hyperlinks'
        ]
      },
      {
        title: 'Level 2: Data Representation (Tables & Media)',
        topics: [
          'HTML Tables',
          'Multimedia Integration',
          'Advanced Lists',
          'Div & Span Containers',
          'Special Characters & Entities'
        ]
      },
      {
        title: 'Level 3: Forms & User Input',
        topics: [
          'Form Structure',
          'Text Inputs',
          'Selection Controls',
          'Buttons & Textareas',
          'Form Attributes'
        ]
      },
      {
        title: 'Level 4: Semantic Layouts & Project',
        topics: [
          'Semantic HTML5 Tags',
          'Page Structure & Layout',
          'Meta Tags & SEO Basics',
          'HTML5 APIs & Storage',
          'Final Project (Portfolio Website)'
        ]
      }
    ]
  },
  {
    id: 'css-mastery',
    category: 'digital',
    name: 'CSS Master Course',
    fullName: 'CSS3 STYLING, FLEXBOX, GRID & ANIMATIONS',
    tagline: 'Style and Bring Webpages to Life',
    fee: '₹550',
    feeAmount: 550,
    themeColor: 'from-blue-500 to-cyan-600',
    accentColor: 'text-blue-700',
    badgeColor: 'bg-blue-100 text-blue-800',
    image: cssImg,
    ageGroup: '10+ Years, College & Adults',
    levels: '9 Levels (Foundation 1-4 & Advanced 5-9)',
    duration: '4 - 6 Months',
    description: 'Styles web pages with colors, layouts, fonts, responsive design, Flexbox, Grid, CSS animations, preprocessors, and modern UI clone development.',
    outcomes: [
      'Deep understanding of CSS box model, selectors, typography, and color theory',
      'Mastery of modern responsive layouts using CSS Flexbox and 2D CSS Grid',
      'Creation of fluid keyframe animations, 2D/3D transforms, and custom variables',
      'Experience with SASS, Tailwind CSS, BEM architecture, and responsive capstone clone'
    ],
    curriculum: [
      {
        title: 'Level 1: CSS Basics & Syntax (Foundation)',
        topics: [
          'Introduction to CSS',
          'Selectors (Tag, Class, ID)',
          'Colors & Backgrounds',
          'Text & Font Styling',
          'Basic Borders'
        ]
      },
      {
        title: 'Level 2: CSS Box Model',
        topics: [
          'Margin & Padding',
          'Width & Height',
          'Display Properties (Block, Inline)',
          'Styling Links & Lists',
          'Styling Tables'
        ]
      },
      {
        title: 'Level 3: Flexbox Layouts',
        topics: [
          'Introduction to Flexbox',
          'Flex Direction & Wrapping',
          'Justify Content & Align Items',
          'Building a Navbar',
          'Building a Card Layout'
        ]
      },
      {
        title: 'Level 4: Responsive & Projects',
        topics: [
          'Relative Units (%, vh, vw)',
          'Media Queries (Mobile First)',
          'Hover Effects',
          'Simple Transitions',
          'Final Project (Basic Portfolio)'
        ]
      },
      {
        title: 'Level 5: Advanced Selectors & Positioning (Advanced)',
        topics: [
          'Pseudo-classes & Pseudo-elements',
          'CSS Specificity & Cascade',
          'Positioning (Relative, Absolute, Fixed, Sticky)',
          'Z-Index & Stacking Context',
          'Overflow & Visibility'
        ]
      },
      {
        title: 'Level 6: CSS Grid Mastery',
        topics: [
          'Grid Container (Rows & Columns)',
          'Grid Template Areas',
          'Auto-fit & Minmax',
          'Grid vs Flexbox',
          'Complex Grid Layouts'
        ]
      },
      {
        title: 'Level 7: Animations & Variables',
        topics: [
          'CSS Variables (Custom Properties)',
          'CSS Transforms (2D & 3D)',
          'CSS Animations (@keyframes)',
          'Advanced Transitions',
          'Interactive UI Elements'
        ]
      },
      {
        title: 'Level 8: Pre-processors & Frameworks',
        topics: [
          'SASS/SCSS Basics (Variables & Nesting)',
          'Mixins & Functions in SASS',
          'Introduction to Tailwind CSS',
          'Introduction to Bootstrap',
          'Utility-first CSS concepts'
        ]
      },
      {
        title: 'Level 9: Industry Mastery & Capstone',
        topics: [
          'CSS Architecture (BEM Methodology)',
          'Performance Optimization',
          'Cross-browser Compatibility',
          'Building a Clone (e.g., Netflix/Amazon UI)',
          'Final Capstone Project (Fully Animated & Responsive Website)'
        ]
      }
    ]
  },
  {
    id: 'python-basics',
    category: 'digital',
    name: 'Python Basics',
    fullName: 'PYTHON PROGRAMMING & LOGICAL THINKING',
    tagline: 'Think Logically, Code Creatively',
    fee: '₹550',
    feeAmount: 550,
    themeColor: 'from-yellow-500 to-amber-600',
    accentColor: 'text-yellow-700',
    badgeColor: 'bg-yellow-100 text-yellow-800',
    image: pythonImg,
    ageGroup: '10+ Years & College',
    levels: '4 Structured Levels',
    duration: '3 Months',
    description: 'Develops logical thinking, problem-solving skills and foundational programming concepts using Python syntax, control flow, functions, and hands-on coding.',
    outcomes: [
      'Write clean Python syntax, handle variables, user input, and formatted print output',
      'Master decision making with If-Else and iterative logic with For & While loops',
      'Manipulate data structures: Lists, Tuples, Dictionaries, and Custom Functions',
      'Build interactive terminal applications, number guessing games, and automated solvers'
    ],
    curriculum: [
      {
        title: 'Level 1: Python Fundamentals & Syntax',
        topics: [
          'Python Setup & VS Code Environment',
          'Variables, Constants & Comments',
          'Basic Data Types (Int, Float, Str, Bool)',
          'User Input (input()) & Formatted Print Output',
          'Arithmetic, Assignment & Comparison Operators'
        ]
      },
      {
        title: 'Level 2: Control Structures & Logic',
        topics: [
          'Conditional Branching (if, elif, else)',
          'Logical Operators (and, or, not)',
          'For Loops & the range() Function',
          'While Loops & Iteration Control',
          'Loop Modifiers: break, continue & pass'
        ]
      },
      {
        title: 'Level 3: Data Collections & Functions',
        topics: [
          'Python Lists (Indexing, Slicing & Methods)',
          'Tuples & Sets (Immutability & Uniqueness)',
          'Dictionaries (Key-Value Pairs & Lookups)',
          'Defining Functions (def, parameters & return values)',
          'Variable Scope (Local vs Global) & Default Arguments'
        ]
      },
      {
        title: 'Level 4: Modules, File I/O & Mini Project',
        topics: [
          'String Manipulation & Built-in Methods',
          'Python Standard Library (math, random, datetime)',
          'Reading & Writing Text Files (.txt, .csv)',
          'Error Handling (try, except, finally)',
          'Final Project: Interactive Number Guessing Game & Smart Calculator'
        ]
      }
    ]
  },
  {
    id: 'computer-fundamentals',
    category: 'digital',
    name: 'Computer Fundamentals',
    fullName: 'COMPUTER HARDWARE & DIGITAL LITERACY',
    tagline: 'Learn Computers, Build Confidence',
    fee: '₹450',
    feeAmount: 450,
    themeColor: 'from-slate-600 to-gray-800',
    accentColor: 'text-slate-700',
    badgeColor: 'bg-slate-100 text-slate-800',
    image: computerImg,
    ageGroup: '6+ Years & Beginners',
    levels: '4 Structured Levels',
    duration: '3 Months',
    description: 'Builds fundamental digital literacy, safe computer usage and essential operating skills from hardware recognition to touch typing and cyber safety.',
    outcomes: [
      'Identify internal and external hardware components, storage drives, and ports',
      'Navigate operating system menus, window controls, and file directory trees',
      'Develop touch typing speed, posture ergonomics, and keyboard shortcuts',
      'Safely browse the internet, manage email communication, and prevent digital threats'
    ],
    curriculum: [
      {
        title: 'Level 1: Hardware & Operating System Foundations',
        topics: [
          'Parts of a Computer (CPU, Monitor, Keyboard, Mouse, Motherboard)',
          'Booting, Desktop Navigation, Taskbar & Start Menu',
          'Mouse Ergonomics: Click, Double-click, Right-click & Drag-drop',
          'Basic Keyboard Familiarity & Home Row Placement',
          'Storage Media (HDD, SSD, USB Flash Drives & SD Cards)'
        ]
      },
      {
        title: 'Level 2: Windows OS & File Management',
        topics: [
          'Windows File Explorer Navigation & Tree Structure',
          'Creating, Renaming, Moving & Deleting Folders',
          'Common File Extensions (.docx, .xlsx, .pdf, .jpg, .zip)',
          'Cut, Copy, Paste Shortcuts & Recycle Bin Recovery',
          'Built-in Utilities: MS Paint, Notepad, Calculator & Snipping Tool'
        ]
      },
      {
        title: 'Level 3: Internet, Web Browsers & Safe Exploration',
        topics: [
          'Introduction to Internet, URLs, and Web Browsers (Chrome / Edge)',
          'Effective Search Queries & Information Bookmarking',
          'Creating an Email Account, Composing & Attaching Files',
          'Downloading Files & Managing Downloads Safely',
          'Cyber Safety: Strong Passwords, Phishing Awareness & Safe Browsing'
        ]
      },
      {
        title: 'Level 4: Digital Tools & Speed Typing',
        topics: [
          'Touch Typing Speed Drills & Accuracy Milestones (WPM Building)',
          'Cloud Storage Introduction: Uploading & Sharing on Google Drive',
          'Hardware Connectivity: Printers, Scanners, Projectors & Wi-Fi',
          'Windows Settings, Display Customization & Software Installation',
          'Practical Digital Literacy Examination & Speed Certificate'
        ]
      }
    ]
  },
  {
    id: 'photoshop-basics',
    category: 'digital',
    name: 'Photoshop',
    fullName: 'ADOBE PHOTOSHOP & DIGITAL IMAGING',
    tagline: 'Design, Retouch, Create Visually',
    fee: '₹550',
    feeAmount: 550,
    themeColor: 'from-sky-600 to-blue-800',
    accentColor: 'text-sky-700',
    badgeColor: 'bg-sky-100 text-sky-800',
    image: photoshopImg,
    ageGroup: '10+ Years & Creative Minds',
    levels: '4 Creative Levels',
    duration: '3 Months',
    description: 'Explores image editing, graphic creation, retouching and creative digital visual design using industry-standard Photoshop tools and layer workflows.',
    outcomes: [
      'Master interface navigation, lasso selections, brush tools, and canvas setup',
      'Execute non-destructive edits with layers, clipping masks, and adjustment layers',
      'Retouch portraits with healing brushes, clone stamp, and content-aware tools',
      'Design stunning social media posters, YouTube thumbnails, and web graphics'
    ],
    curriculum: [
      {
        title: 'Level 1: Workspace & Essential Selection Tools',
        topics: [
          'Photoshop Interface, Canvas Setup, DPI & Aspect Ratios',
          'Selection Tools: Rectangular/Elliptical Marquee & Lasso Tools',
          'Object Selection, Quick Selection & Magic Wand',
          'Brush, Pencil, Eraser & Paint Bucket Fundamentals',
          'Crop Tool, Free Transform & Canvas Sizing'
        ]
      },
      {
        title: 'Level 2: Layers, Masks & Image Adjustments',
        topics: [
          'Layer Hierarchy, Grouping, Naming & Opacity Controls',
          'Non-Destructive Layer Masks & Clipping Masks',
          'Color Adjustments: Brightness/Contrast, Levels & Curves',
          'Hue/Saturation, Vibrance & Black & White Conversion',
          'Blending Modes (Multiply, Screen, Overlay & Soft Light)'
        ]
      },
      {
        title: 'Level 3: Photo Retouching & Typography',
        topics: [
          'Spot Healing Brush, Healing Brush & Patch Tool',
          'Clone Stamp Tool & Content-Aware Fill for Blemish Removal',
          'Text Tool, Typography Hierarchy & Character/Paragraph Panels',
          'Layer Styles: Drop Shadow, Stroke, Bevel & Emboss, Outer Glow',
          'Pen Tool Precision Paths & Converting Paths to Selections'
        ]
      },
      {
        title: 'Level 4: Creative Compositions & Exporting',
        topics: [
          'Photo Manipulation, Cutout Blending & Surreal Compositions',
          'Social Media Ad Banners & Instagram Story Design',
          'YouTube Thumbnail & Channel Banner Composition',
          'Color Models (RGB for Screen vs CMYK for Print)',
          'Final Capstone Project: Exporting for Web (.webp, .jpg, .png) & PDF'
        ]
      }
    ]
  },
  {
    id: 'ai-digital-skills',
    category: 'digital',
    name: 'AI & Digital Skills',
    fullName: 'ARTIFICIAL INTELLIGENCE & PRODUCTIVITY',
    tagline: 'Explore AI, Understand Tomorrow',
    fee: '₹500',
    feeAmount: 500,
    themeColor: 'from-violet-600 to-purple-800',
    accentColor: 'text-violet-700',
    badgeColor: 'bg-violet-100 text-violet-800',
    image: aiImg,
    ageGroup: '8+ Years & Students',
    levels: '4 Future-Ready Levels',
    duration: '3 Months',
    description: 'Introduces artificial intelligence concepts, prompt learning and smart digital tools to accelerate study, creative problem solving, and future readiness.',
    outcomes: [
      'Understand how AI and machine learning process patterns from real-world data',
      'Master structured prompt engineering for essay writing, coding, and brainstorming',
      'Leverage generative AI tools for visual art, speech synthesis, and research summarization',
      'Cultivate digital ethics, awareness of AI hallucinations, and critical media analysis'
    ],
    curriculum: [
      {
        title: 'Level 1: Discovering Artificial Intelligence',
        topics: [
          'What is AI? How Computers Learn from Data Patterns',
          'Daily AI Around Us: Voice Assistants, Recommendation Engines & GPS',
          'Introduction to Large Language Models & Conversational AI',
          'Comparing Human Intelligence with Artificial Intelligence',
          'Digital Privacy & Safe Exploration of AI Platforms'
        ]
      },
      {
        title: 'Level 2: Prompt Engineering & Smart Writing',
        topics: [
          'Anatomy of an Effective Prompt: Role, Context, Task & Output Format',
          'Brainstorming, Drafting Essays & Academic Summaries with AI',
          'Role-Playing Prompts for Exam Revision & Language Practice',
          'Iterative Prompt Refinement and Few-Shot Prompting Techniques',
          'Spotting AI Hallucinations & Cross-Verifying Facts with Reliable Sources'
        ]
      },
      {
        title: 'Level 3: Generative AI for Art, Audio & Study',
        topics: [
          'Generative AI for Images: Writing Visual Descriptors & Style Triggers',
          'Text-to-Speech & Voice Generation for Presentations',
          'AI-Assisted Flashcards, Study Quizzes & Mind Mapping',
          'Automating Research Summaries and Tabular Data Organization',
          'Creating a Multimodal Digital Story with AI Text & Visuals'
        ]
      },
      {
        title: 'Level 4: AI Ethics, Digital Safety & Future Skills',
        topics: [
          'Recognizing Deepfakes, Synthetic Media & Online Misinformation',
          'Intellectual Property, Plagiarism & Ethical Academic AI Usage',
          'Future Careers and How AI is Transforming Medicine, Space & Arts',
          'Assembling a Personal AI Productivity Toolkit for Daily Learning',
          'Final Capstone: Presentation on Responsible AI Innovation'
        ]
      }
    ]
  },
  {
    id: 'canva-design',
    category: 'digital',
    name: 'Canva Graphic Design',
    fullName: 'CANVA VISUAL DESIGN & BRANDING',
    tagline: 'Design Anything with Ease',
    fee: '₹450',
    feeAmount: 450,
    themeColor: 'from-teal-500 to-emerald-700',
    accentColor: 'text-teal-700',
    badgeColor: 'bg-teal-100 text-teal-800',
    image: canvaImg,
    ageGroup: '8+ Years & Creatives',
    levels: '4 Design Levels',
    duration: '3 Months',
    description: 'Enables easy graphic design for posters, presentations, social media and creative visuals using Canva’s powerful layout and branding capabilities.',
    outcomes: [
      'Navigate Canva templates, custom canvas sizing, and font hierarchy',
      'Design eye-catching social media posts, stories, YouTube thumbnails, and reels',
      'Create professional event flyers, student certificates, and school project reports',
      'Master animated slide decks, brand kits, and print-ready high-resolution PDF exports'
    ],
    curriculum: [
      {
        title: 'Level 1: Canva Workspace & Essential Tools',
        topics: [
          'Canva Dashboard, Pre-set Templates & Custom Canvas Dimensions',
          'Text Elements, Font Pairings, Alignment & Letter Spacing',
          'Color Palettes, Brand Colors & Applying Custom Hex Codes',
          'Uploading Photos, Positioning, Cropping & Layer Ordering',
          'Grouping, Locking & Smart Alignment Guides'
        ]
      },
      {
        title: 'Level 2: Visual Elements, Frames & Shapes',
        topics: [
          'Working with Shapes, Lines, Borders & Gradients',
          'Photo Frames, Computer/Phone Mockups & Image Masking',
          'Image Filters, Duotone Effects & Shadow Styling',
          'Grid Layouts, Spacing & Visual Balance Principles',
          'Transparency, Blur & Layer Blend Aesthetics'
        ]
      },
      {
        title: 'Level 3: Marketing & Social Media Design',
        topics: [
          'Instagram Square Posts, Carousel Decks & Story Graphics',
          'YouTube Thumbnails, Banners & Video Title Cards',
          'School Festival Posters, Event Invitations & Certificates',
          'Designing Business Cards, Tri-fold Brochures & Infographics',
          'Brand Kit Essentials: Color Palettes, Logo Placement & Typographic Rules'
        ]
      },
      {
        title: 'Level 4: Animated Presentations & Print Production',
        topics: [
          'Creating Animated Slide Presentations & Dynamic Transitions',
          'Designing Interactive Clickable PDFs with Hyperlinks',
          'Creating Short Social Media Video Reels & Audio Sync',
          'Print Production Setup: Bleed, Margin Guidelines & CMYK PDF Export',
          'Final Capstone: Complete Brand Identity Portfolio Presentation'
        ]
      }
    ]
  }
];


export default function ProgramsPage() {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'skill' | 'digital'

  // Programs categorized into two distinct sections
  const skillPrograms = ALL_PROGRAMS.filter(p => p.category === 'skill');
  const digitalPrograms = ALL_PROGRAMS.filter(p => p.category === 'digital');

  // Shared Card Renderer for both sections
  const renderProgramCard = (prog) => (
    <div
      key={prog.id}
      onClick={() => setSelectedProgram(prog)}
      className="relative p-[2px] sm:p-[3px] rounded-xl sm:rounded-3xl cursor-pointer group transition-all duration-300 hover:-translate-y-1.5 active:scale-[0.98] flex flex-col h-full"
      style={{
        background: 'linear-gradient(135deg, #f59e0b, #fef08a, #38bdf8, #ffffff, #fbbf24, #f59e0b)',
        backgroundSize: '300% 300%',
        animation: 'glitterBorder 4s ease infinite',
        boxShadow: '0 0 14px rgba(245, 158, 11, 0.25), 0 4px 14px rgba(0, 0, 0, 0.06)'
      }}
      title={`Click to view ${prog.name} syllabus & details`}
    >
      {/* Card Inner Content */}
      <div className="relative bg-white rounded-[10px] sm:rounded-[21px] overflow-hidden flex flex-col text-left h-full group-hover:bg-slate-50/70 transition-colors">
        {/* Course Photography Container */}
        <div className="relative aspect-[4/3] sm:aspect-[3/2] w-full overflow-hidden bg-slate-100">
          <img
            src={prog.image}
            alt={prog.name}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${prog.imagePosition || 'object-center'}`}
            loading="lazy"
          />
          {/* Age Group Badge over Photo */}
          <span className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 bg-slate-950/75 backdrop-blur-xs text-white text-[9px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md shadow-xs">
            {prog.ageGroup}
          </span>
        </div>

        {/* Program Card Body */}
        <div className="p-2.5 sm:p-5 flex-1 flex flex-col justify-between space-y-1 sm:space-y-3">
          <div>
            <div className="flex items-start justify-between gap-1">
              <h3 
                className="font-black text-xs sm:text-lg md:text-xl text-black font-heading group-hover:text-sky-700 transition leading-tight line-clamp-1"
              >
                {prog.name}
              </h3>
            </div>

            <p className="text-[11px] sm:text-sm text-slate-700 mt-0.5 sm:mt-1.5 leading-snug sm:leading-relaxed font-semibold line-clamp-2">
              {prog.tagline}
            </p>
          </div>

          {/* Footer Details */}
          <div className="pt-1.5 sm:pt-2 border-t border-slate-100 sm:border-slate-200 flex items-center justify-between text-[10px] sm:text-xs text-slate-900 font-bold">
            <span className="text-slate-600 truncate max-w-[65%] sm:max-w-none text-[10px] sm:text-xs">
              {prog.levels.includes('(') ? prog.levels.split('(')[0].trim() : prog.levels}
            </span>
            <span className="text-sky-700 text-[10px] sm:text-xs font-black shrink-0 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              <span>View</span>
              <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Right-side drawer registration state
  const [registeringProgram, setRegisteringProgram] = useState(null);
  const [regStep, setRegStep] = useState('form'); // 'form' | 'payment' | 'processing' | 'success'
  
  // Registration form fields
  const [regForm, setRegForm] = useState({
    studentName: '',
    dob: '',
    parentName: '',
    phone: '',
    email: '',
    schoolName: '',
    city: '',
    selectedLevel: 'Level 1'
  });

  // Payment method & details
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Lock background body scroll when either syllabus modal or registration drawer is open
  useEffect(() => {
    if (selectedProgram || registeringProgram) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProgram, registeringProgram]);
  
  // Confirmed registration receipt state
  const [confirmationData, setConfirmationData] = useState(null);

  // Open official admission form for a given program
  const handleOpenRegister = (program) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open_admission_modal', {
        detail: {
          program: program.name,
          fee: program.fee || '₹450'
        }
      }));
    }
  };

  const handleCloseRegister = () => {
    setRegisteringProgram(null);
    setRegStep('form');
  };

  // Step 1: Submit Registration Form -> Go to Payment Gateway
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setRegStep('payment');
  };

  // Step 2: Trigger Payment Gateway Processing
  const handleProcessPayment = () => {
    setRegStep('processing');
    const randomTxn = `TXN-UPI-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const randomRegNo = `BSEL-REG-${Math.floor(100000 + Math.random() * 900000)}`;
    const today = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    setTimeout(() => {
      const receipt = {
        registrationNo: randomRegNo,
        transactionId: randomTxn,
        studentName: regForm.studentName,
        parentName: regForm.parentName,
        phone: regForm.phone,
        email: regForm.email,
        schoolName: regForm.schoolName,
        city: regForm.city,
        programName: registeringProgram.name,
        level: regForm.selectedLevel,
        feePaid: registeringProgram.fee,
        date: today,
        paymentMethod: paymentMethod.toUpperCase()
      };

      setConfirmationData(receipt);

      // Persist in localStorage so it reflects across student profile
      try {
        const studentRecord = {
          studentName: regForm.studentName,
          courseName: registeringProgram.name,
          programPrefix: 'MINDSPARC',
          level: regForm.selectedLevel,
          grade: 'A',
          duration: registeringProgram.duration,
          registrationNo: randomRegNo,
          certificateNo: `BSEL/${registeringProgram.name.toUpperCase().replace(/\s+/g, '')}/L1/1001`,
          centreName: regForm.schoolName || 'B★SEL Training Center',
          centreCode: '546454',
          centreAddress: `${regForm.city || 'Chennai'}, Tamil Nadu`,
          issueDate: today,
          certificateType: 'CURRICULUM ENROLLMENT',
          transactionId: randomTxn,
          feePaid: registeringProgram.fee
        };
        localStorage.setItem('bsel_registered_student', JSON.stringify(studentRecord));
      } catch {
        // ignore
      }

      setRegStep('success');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-4 sm:py-8 md:py-12 relative overflow-x-hidden">
      <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-10 space-y-4 sm:space-y-8">
        
        {/* =========================================================================
            COMPACT PROGRAMS PAGE HEADER (NO HERO BG, REDUCED SIZE)
           ========================================================================= */}
        <div className="py-1.5 sm:py-3 text-center max-w-2xl mx-auto space-y-1 sm:space-y-1.5">
          {/* Title - Reduced Size with Elegant Typography */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-heading text-[#0F2B5C] tracking-tight leading-tight">
            <span>Academic & </span>
            <span className="italic font-serif text-amber-500">Skill Programs</span>
          </h1>

          {/* Description - Compact & Short */}
          <p className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed max-w-xl mx-auto px-2">
            Explore our 14 structured learning pathways across Skill Development and Digital Technology.
          </p>
        </div>

        {/* =========================================================================
            PROGRAMS SECTION (ALL 14 PROGRAMS WITH DIRECT REGISTER ACTION & SYLLABUS)
           ========================================================================= */}
        <div id="programs-grid-section" className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-6 md:p-8 shadow-sm border border-slate-200 text-slate-800 space-y-6 sm:space-y-12">
          {/* Main Section Header */}
          <div className="pb-3.5 sm:pb-6 border-b border-slate-100 flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
            <div>
              <span className="text-[10px] sm:text-xs font-extrabold text-sky-700 tracking-widest uppercase">
                Our Programs
              </span>
              <h2 className="text-base sm:text-lg md:text-xl font-black text-black font-heading tracking-tight mt-0.5">
                Explore Your Potential
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-2xl font-semibold">
                Discover 14 structured programs designed to develop cognitive speed, fine art mastery, rhythm, computer literacy, coding, and lifelong confidence.
              </p>
            </div>

            {/* Quick Navigation Anchor Links - 2 balanced columns on mobile */}
            <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
              <a
                href="#skill-development"
                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-full text-center text-xs sm:text-sm font-black bg-[#0F2B5C] hover:bg-[#163875] text-white transition shadow-xs cursor-pointer active:scale-95 flex items-center justify-center gap-1 sm:gap-1.5"
              >
                <span className="truncate">Skill Dev (6)</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400 rotate-90 shrink-0" />
              </a>
              <a
                href="#digital-technology"
                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-full text-center text-xs sm:text-sm font-black bg-slate-100 hover:bg-slate-200 text-slate-800 transition shadow-xs cursor-pointer active:scale-95 flex items-center justify-center gap-1 sm:gap-1.5 border border-slate-200"
              >
                <span className="truncate">Digital & Tech (8)</span>
                <ArrowRight className="w-3.5 h-3.5 text-sky-700 rotate-90 shrink-0" />
              </a>
            </div>
          </div>

          {/* Scoped CSS for Card Glitter Shimmer Border */}
          <style>{`
            @keyframes glitterBorder {
              0% {
                background-position: 0% 50%;
              }
              50% {
                background-position: 100% 50%;
              }
              100% {
                background-position: 0% 50%;
              }
            }
          `}</style>

          {/* =========================================================================
              PART 1: SKILL DEVELOPMENT PROGRAMS (6)
             ========================================================================= */}
          <div id="skill-development" className="scroll-mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 pb-2.5 sm:pb-3 mb-3.5 sm:mb-6 border-b border-amber-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] sm:text-xs font-black uppercase tracking-wider">
                    Category 1
                  </span>
                  <h3 className="text-base sm:text-2xl font-black text-slate-900 font-heading tracking-tight">
                    Skill Development <span className="text-amber-600 font-bold">({skillPrograms.length})</span>
                  </h3>
                </div>
                <p className="text-[11px] sm:text-sm text-slate-600 mt-0.5 sm:mt-1 font-medium">
                  Foundational cognitive speed, mental arithmetic, fine arts, reading fluency, and cultural dance.
                </p>
              </div>
            </div>

            {/* Grid of 6 Skill Programs - 2 Col on Mobile */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6 lg:gap-8">
              {skillPrograms.map(renderProgramCard)}
            </div>
          </div>

          {/* =========================================================================
              PART 2: DIGITAL & TECHNOLOGY PROGRAMS (8)
             ========================================================================= */}
          <div id="digital-technology" className="scroll-mt-6 pt-5 sm:pt-8 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 pb-2.5 sm:pb-3 mb-3.5 sm:mb-6 border-b border-sky-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-900 text-[10px] sm:text-xs font-black uppercase tracking-wider">
                    Category 2
                  </span>
                  <h3 className="text-base sm:text-2xl font-black text-slate-900 font-heading tracking-tight">
                    Digital & Technology <span className="text-sky-700 font-bold">({digitalPrograms.length})</span>
                  </h3>
                </div>
                <p className="text-[11px] sm:text-sm text-slate-600 mt-0.5 sm:mt-1 font-medium">
                  Essential modern computing, office productivity, web development, coding logic, and creative design tools.
                </p>
              </div>
            </div>

            {/* Grid of 8 Digital Programs - 2 Col on Mobile */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6 lg:gap-8">
              {digitalPrograms.map(renderProgramCard)}
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 pt-1 sm:pt-2">
          {/* Card 1: Mint / Green (Structured Syllabus) */}
          <div className="bg-[#F2FAF6] rounded-xl sm:rounded-2xl p-3 sm:p-4 border-2 border-[#86EFAC] shadow-xs flex flex-col justify-between h-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white border border-[#6EE7B7] text-[#059669] flex items-center justify-center shrink-0 shadow-xs">
                  <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                </div>
                <h4 className="text-xs sm:text-base font-black text-slate-900 font-heading tracking-tight">
                  Standardized Syllabus
                </h4>
              </div>

              <p className="text-[11px] sm:text-xs text-slate-700 leading-relaxed font-semibold">
                Step-by-step grade levels mapped to age cognitive abilities from foundation to mastery.
              </p>
            </div>

            <div className="pt-2 mt-2 sm:mt-3 border-t border-[#A7F3D0]/80 flex items-center justify-between text-[10px] sm:text-[11px]">
              <span className="text-[#047857] font-bold">Practical Training</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
            </div>
          </div>

          {/* Card 2: Warm Amber / Yellow (Recognized Certification) */}
          <div className="bg-[#FFFDF0] rounded-xl sm:rounded-2xl p-3 sm:p-4 border-2 border-[#FDE047] shadow-xs flex flex-col justify-between h-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white border border-[#FCD34D] text-[#D97706] flex items-center justify-center shrink-0 shadow-xs">
                  <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                </div>
                <h4 className="text-xs sm:text-base font-black text-slate-900 font-heading tracking-tight">
                  Recognized Certification
                </h4>
              </div>

              <p className="text-[11px] sm:text-xs text-slate-700 leading-relaxed font-semibold">
                Official certificates with verifiable QR codes issued upon completing level assessments.
              </p>
            </div>

            <div className="pt-2 mt-2 sm:mt-3 border-t border-[#FDE047]/80 flex items-center justify-between text-[10px] sm:text-[11px]">
              <span className="text-[#B45309] font-bold">Practical Training</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
            </div>
          </div>

          {/* Card 3: Rose / Pink (Expert Master Trainers) */}
          <div className="bg-[#FFF5F6] rounded-xl sm:rounded-2xl p-3 sm:p-4 border-2 border-[#FDA4AF] shadow-xs flex flex-col justify-between h-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white border border-[#FDA4AF] text-[#E11D48] flex items-center justify-center shrink-0 shadow-xs">
                  <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                </div>
                <h4 className="text-xs sm:text-base font-black text-slate-900 font-heading tracking-tight">
                  Expert Master Trainers
                </h4>
              </div>

              <p className="text-[11px] sm:text-xs text-slate-700 leading-relaxed font-semibold">
                Trained and certified instructors delivering engaging hands-on classroom experiences.
              </p>
            </div>

            <div className="pt-2 mt-2 sm:mt-3 border-t border-[#FDA4AF]/80 flex items-center justify-between text-[10px] sm:text-[11px]">
              <span className="text-[#BE123C] font-bold">Practical Training</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
            </div>
          </div>
        </div>

      </div>

      {/* =========================================================================
          DETAILED SYLLABUS MODAL (CENTER POPUP)
         ========================================================================= */}
      {selectedProgram && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4"
          onClick={() => setSelectedProgram(null)}
        >
          <div 
            className="relative bg-white rounded-2xl sm:rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh] sm:max-h-[90vh] my-auto overscroll-contain"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Banner */}
            <div className={`p-3.5 sm:p-6 bg-gradient-to-r ${selectedProgram.themeColor} text-white relative shrink-0`}>
              <button
                type="button"
                onClick={() => setSelectedProgram(null)}
                className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 bg-black/25 hover:bg-black/40 text-white rounded-full p-1.5 sm:p-2 transition cursor-pointer active:scale-95 z-10"
                aria-label="Close"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="flex items-center gap-2.5 sm:gap-4 pr-7 sm:pr-8">
                <img 
                  src={selectedProgram.image} 
                  alt={selectedProgram.name} 
                  className={`w-12 h-12 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-xl object-cover border-2 border-white/60 shadow-md shrink-0 ${selectedProgram.imagePosition || 'object-center'}`} 
                />
                <div className="min-w-0">
                  <h3 className="text-base sm:text-2xl md:text-3xl font-black font-heading text-white tracking-wide truncate">
                    {selectedProgram.name}
                  </h3>
                  <p className="text-white/95 text-[11px] sm:text-sm mt-0.5 font-semibold line-clamp-2">
                    {selectedProgram.tagline}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-3.5 sm:p-6 flex-1 overflow-y-auto overscroll-contain space-y-4 sm:space-y-5 text-slate-700">
              
              {/* Quick Facts */}
              <div className="grid grid-cols-3 gap-1 sm:gap-3 bg-slate-50 p-2 sm:p-3.5 rounded-xl border border-slate-300 text-center">
                <div className="flex flex-col items-center p-0.5 sm:p-1">
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-800 mb-0.5 sm:mb-1" />
                  <span className="text-[9px] sm:text-[11px] text-slate-600 uppercase font-black">Age Group</span>
                  <span className="text-xs sm:text-sm font-black text-slate-950 truncate max-w-full">{selectedProgram.ageGroup}</span>
                </div>
                <div className="flex flex-col items-center p-0.5 sm:p-1 border-x border-slate-300">
                  <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-800 mb-0.5 sm:mb-1" />
                  <span className="text-[9px] sm:text-[11px] text-slate-600 uppercase font-black">Levels</span>
                  <span className="text-xs sm:text-sm font-black text-slate-950 truncate max-w-full">{selectedProgram.levels}</span>
                </div>
                <div className="flex flex-col items-center p-0.5 sm:p-1">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-800 mb-0.5 sm:mb-1" />
                  <span className="text-[9px] sm:text-[11px] text-slate-600 uppercase font-black">Duration</span>
                  <span className="text-xs sm:text-sm font-black text-slate-950 truncate max-w-full">{selectedProgram.duration}</span>
                </div>
              </div>

              {/* About This Program */}
              <div>
                <h4 className="text-xs sm:text-sm font-black text-black uppercase tracking-wider mb-1 sm:mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-800 shrink-0" />
                  <span>About This Program</span>
                </h4>
                <p className="text-slate-800 text-xs sm:text-sm leading-relaxed font-semibold">
                  {selectedProgram.description}
                </p>
              </div>

              {/* Informative Syllabus Structure */}
              {selectedProgram.curriculum && selectedProgram.curriculum.length > 0 && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2 sm:mb-2.5">
                    <h4 className="text-xs sm:text-sm font-black text-black uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0F2B5C] shrink-0" />
                      <span>Syllabus Structure</span>
                    </h4>
                    <span className="text-[10px] sm:text-[11px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200 w-fit">
                      Step-by-Step Milestones
                    </span>
                  </div>

                  <div className="space-y-2 sm:space-y-2.5">
                    {selectedProgram.curriculum.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="bg-slate-50 hover:bg-slate-100/80 p-2.5 sm:p-3.5 rounded-xl border border-slate-200 transition text-left"
                      >
                        <div className="flex items-start gap-2 sm:gap-2.5">
                          <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#0F2B5C] text-white font-black text-[10px] sm:text-xs flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                            {idx + 1}
                          </span>
                          <div className="flex-1">
                            <h5 className="font-black text-xs sm:text-sm text-slate-950 leading-snug">
                              {typeof item === 'string' ? item : item.title}
                            </h5>
                            
                            {typeof item === 'object' && item.topics && (
                              <ul className="mt-1.5 sm:mt-2 space-y-1 pl-0.5 sm:pl-1">
                                {item.topics.map((topic, tIdx) => (
                                  <li key={tIdx} className="text-[11px] sm:text-xs text-slate-700 flex items-start gap-1.5 sm:gap-2 font-medium">
                                    <span className="text-sky-600 font-bold shrink-0 mt-0.5">•</span>
                                    <span>{typeof topic === 'string' ? topic.replace(/^(\d+[\.\)]\s*|Level\s+\d+:\s*)/i, '') : topic}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Outcomes */}
              {selectedProgram.outcomes && selectedProgram.outcomes.length > 0 && (
                <div className="pt-2 border-t border-slate-200">
                  <h4 className="text-xs sm:text-sm font-black text-black uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
                    <span>Key Learning Outcomes</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                    {selectedProgram.outcomes.map((outcome, oIdx) => (
                      <div key={oIdx} className="flex items-start gap-2 p-2 rounded-lg bg-emerald-50/60 border border-emerald-100 text-[11px] sm:text-xs text-slate-800 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fee & Enrollment Box (At the end of Details) */}
              <div className="pt-2 sm:pt-3 border-t border-slate-200">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4">
                  <span className="text-[9px] sm:text-[10px] uppercase font-black text-slate-500 tracking-wider block">
                    Course Fee & Official Kit
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 mt-1">
                    <span className="text-xl sm:text-3xl font-black text-emerald-700 font-heading">
                      {selectedProgram.fee}
                    </span>
                    <span className="text-[11px] sm:text-sm text-slate-600 font-medium">
                      (Includes student workbook kit, assessment fee & official certificate)
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-100 px-3.5 sm:px-6 py-2.5 sm:py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
              <span className="text-[11px] sm:text-xs text-slate-600 text-center sm:text-left font-medium hidden sm:block">
                Official Syllabus of Board of Skills and Educational Learning
              </span>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedProgram(null)}
                  className="flex-1 sm:flex-none px-4 py-2.5 sm:py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs sm:text-sm transition cursor-pointer shadow-xs active:scale-95 text-center min-h-[42px]"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const prog = selectedProgram;
                    setSelectedProgram(null);
                    handleOpenRegister(prog);
                  }}
                  className="flex-1 sm:flex-none px-4 py-2.5 sm:py-2 rounded-xl bg-[#0F2B5C] hover:bg-[#163875] text-white font-black text-xs sm:text-sm transition cursor-pointer shadow-sm active:scale-95 flex items-center justify-center gap-1.5 min-h-[42px]"
                >
                  <span>Proceed to Admission Form</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          RIGHT-SIDE SLIDE-OVER DRAWER: REGISTRATION & PAYMENT GATEWAY + DETAILS
         ========================================================================= */}
      {registeringProgram && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
            onClick={handleCloseRegister}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 overscroll-contain">
            <div 
              className="w-screen max-w-full sm:max-w-xl bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300 z-50 text-slate-800 h-full overscroll-contain"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Top Header Banner */}
              <div className={`p-3.5 sm:p-5 bg-gradient-to-r ${registeringProgram.themeColor} text-white relative shrink-0`}>
                <div className="flex items-center justify-between pr-8">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <img 
                      src={registeringProgram.image} 
                      alt={registeringProgram.name} 
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover border-2 border-white/60 shadow-md shrink-0 ${registeringProgram.imagePosition || 'object-center'}`} 
                    />
                    <div>
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white/80 block">
                        Online Enrollment
                      </span>
                      <h3 className="text-sm sm:text-xl font-black font-heading text-white truncate max-w-[200px] sm:max-w-[280px]">
                        {registeringProgram.name}
                      </h3>
                      <span className="text-[11px] sm:text-xs font-semibold text-white/90">
                        {registeringProgram.levels} • {registeringProgram.ageGroup}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCloseRegister}
                  className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 bg-black/25 hover:bg-black/40 text-white rounded-full p-1.5 transition cursor-pointer active:scale-95 z-10"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Stepper Tabs */}
                <div className="grid grid-cols-3 gap-1 sm:gap-2 mt-3 pt-2.5 border-t border-white/20 text-center text-[11px] sm:text-xs font-black">
                  <div className={`pb-1 border-b-2 ${regStep === 'form' ? 'border-amber-400 text-amber-300' : 'border-transparent text-white/70'}`}>
                    1. Candidate
                  </div>
                  <div className={`pb-1 border-b-2 ${regStep === 'payment' || regStep === 'processing' ? 'border-amber-400 text-amber-300' : 'border-transparent text-white/70'}`}>
                    2. Payment
                  </div>
                  <div className={`pb-1 border-b-2 ${regStep === 'success' ? 'border-amber-400 text-amber-300' : 'border-transparent text-white/70'}`}>
                    3. Receipt
                  </div>
                </div>
              </div>

              {/* Drawer Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto overscroll-contain p-3.5 sm:p-6 space-y-4 sm:space-y-5">
                
                {/* =========================================================================
                    STEP 1: REGISTRATION FORM & RIGHT-SIDE COURSE DETAILS
                   ========================================================================= */}
                {regStep === 'form' && (
                  <form onSubmit={handleFormSubmit} className="space-y-3.5 sm:space-y-4">
                    {/* Course Summary Card */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 sm:p-3.5 space-y-1.5 sm:space-y-2">
                      <div className="flex items-center justify-between text-[11px] sm:text-xs">
                        <span className="font-bold text-slate-600">Selected Discipline:</span>
                        <span className="font-black text-slate-900">{registeringProgram.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] sm:text-xs">
                        <span className="font-bold text-slate-600">Curriculum Structure:</span>
                        <span className="font-black text-slate-900">{registeringProgram.levels}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] sm:text-xs">
                        <span className="font-bold text-slate-600">Target Age Group:</span>
                        <span className="font-black text-slate-900">{registeringProgram.ageGroup}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] sm:text-xs pt-1.5 border-t border-slate-200">
                        <span className="font-black text-slate-800">Total Admission / Assessment Fee:</span>
                        <span className="font-black text-emerald-700 text-sm">{registeringProgram.fee}</span>
                      </div>
                    </div>

                    <div className="space-y-2.5 sm:space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-sky-700" />
                        <span>Candidate Information</span>
                      </h4>

                      <div>
                        <label className="block text-xs font-black text-slate-900 mb-1">
                          Student Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={regForm.studentName}
                          onChange={(e) => setRegForm({...regForm, studentName: e.target.value})}
                          className="w-full h-10 px-3 text-base sm:text-sm text-slate-950 font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                        <div>
                          <label className="block text-[11px] sm:text-xs font-black text-slate-900 mb-0.5 sm:mb-1 truncate">
                            Date of Birth *
                          </label>
                          <input
                            type="date"
                            required
                            value={regForm.dob}
                            onChange={(e) => setRegForm({...regForm, dob: e.target.value})}
                            className="w-full h-9 sm:h-10 px-2 sm:px-3 text-base sm:text-sm text-slate-950 font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] sm:text-xs font-black text-slate-900 mb-0.5 sm:mb-1 truncate">
                            Starting Level *
                          </label>
                          <select
                            value={regForm.selectedLevel}
                            onChange={(e) => setRegForm({...regForm, selectedLevel: e.target.value})}
                            className="w-full h-9 sm:h-10 px-2 sm:px-2.5 text-base sm:text-sm text-slate-950 font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white truncate"
                          >
                            {registeringProgram.curriculum.map((c, i) => (
                              <option key={i} value={typeof c === 'string' ? c.split(':')[0] : c.title.split(':')[0]}>
                                {typeof c === 'string' ? c.split(':')[0] : c.title.split(':')[0]}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                        <div>
                          <label className="block text-[11px] sm:text-xs font-black text-slate-900 mb-0.5 sm:mb-1 truncate">
                            Parent / Guardian *
                          </label>
                          <input
                            type="text"
                            required
                            value={regForm.parentName}
                            onChange={(e) => setRegForm({...regForm, parentName: e.target.value})}
                            className="w-full h-9 sm:h-10 px-2 sm:px-3 text-base sm:text-sm text-slate-950 font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] sm:text-xs font-black text-slate-900 mb-0.5 sm:mb-1 truncate">
                            WhatsApp / Mobile *
                          </label>
                          <input
                            type="tel"
                            required
                            value={regForm.phone}
                            onChange={(e) => setRegForm({...regForm, phone: e.target.value})}
                            className="w-full h-9 sm:h-10 px-2 sm:px-3 text-base sm:text-sm text-slate-950 font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                        <div>
                          <label className="block text-[11px] sm:text-xs font-black text-slate-900 mb-0.5 sm:mb-1 truncate">
                            School / Academy *
                          </label>
                          <input
                            type="text"
                            required
                            value={regForm.schoolName}
                            onChange={(e) => setRegForm({...regForm, schoolName: e.target.value})}
                            className="w-full h-9 sm:h-10 px-2 sm:px-3 text-base sm:text-sm text-slate-950 font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] sm:text-xs font-black text-slate-900 mb-0.5 sm:mb-1 truncate">
                            City / Town *
                          </label>
                          <input
                            type="text"
                            required
                            value={regForm.city}
                            onChange={(e) => setRegForm({...regForm, city: e.target.value})}
                            className="w-full h-9 sm:h-10 px-2 sm:px-3 text-base sm:text-sm text-slate-950 font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-900 mb-1">
                          Email Address (Optional)
                        </label>
                        <input
                          type="email"
                          value={regForm.email}
                          onChange={(e) => setRegForm({...regForm, email: e.target.value})}
                          className="w-full h-10 px-3 text-base sm:text-sm text-slate-950 font-semibold border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full bg-[#0F2B5C] hover:bg-[#163875] text-white py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer active:scale-[0.99] min-h-[46px]"
                      >
                        <Lock className="w-4 h-4 text-amber-400" />
                        <span>Proceed to Payment ({registeringProgram.fee})</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}

                {/* =========================================================================
                    STEP 2: PAYMENT GATEWAY INTERFACE
                   ========================================================================= */}
                {regStep === 'payment' && (
                  <div className="space-y-3.5 sm:space-y-4">
                    <button
                      type="button"
                      onClick={() => setRegStep('form')}
                      className="text-xs font-black text-sky-800 hover:text-sky-950 flex items-center gap-1 cursor-pointer mb-1 py-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Candidate Information</span>
                    </button>

                    {/* Order Summary Box */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 sm:p-4">
                      <div className="flex items-center justify-between pb-2 sm:pb-2.5 border-b border-slate-200">
                        <div>
                          <span className="text-[9px] sm:text-[10px] font-black uppercase text-slate-500 tracking-wider block">
                            Enrolling in Program
                          </span>
                          <h4 className="text-sm sm:text-base font-black text-slate-900">{registeringProgram.name}</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 block">Total Payable</span>
                          <span className="text-xl sm:text-2xl font-black text-emerald-700 font-heading">{registeringProgram.fee}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2.5 text-[11px] sm:text-xs">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Student Name:</span>
                          <strong className="text-slate-900 font-bold truncate block">{regForm.studentName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Selected Stage:</span>
                          <strong className="text-slate-900 font-bold">{regForm.selectedLevel}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Parent:</span>
                          <strong className="text-slate-900 font-bold">{regForm.parentName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Contact:</span>
                          <strong className="text-slate-900 font-bold">{regForm.phone}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method Selector */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
                        Select Payment Option
                      </label>
                      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('upi')}
                          className={`p-2 sm:p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-0.5 sm:gap-1 active:scale-95 ${
                            paymentMethod === 'upi'
                              ? 'border-sky-600 bg-sky-50 text-sky-900 ring-2 ring-sky-500/20 font-black'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" />
                          <span className="text-[11px] sm:text-xs font-bold">UPI / QR</span>
                          <span className="text-[8px] sm:text-[9px] text-emerald-700 font-black bg-emerald-100 px-1 rounded">Instant</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('card')}
                          className={`p-2 sm:p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-0.5 sm:gap-1 active:scale-95 ${
                            paymentMethod === 'card'
                              ? 'border-sky-600 bg-sky-50 text-sky-900 ring-2 ring-sky-500/20 font-black'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" />
                          <span className="text-[11px] sm:text-xs font-bold">Debit / Card</span>
                          <span className="text-[8px] sm:text-[9px] text-slate-500">RuPay/Visa</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('netbanking')}
                          className={`p-2 sm:p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-0.5 sm:gap-1 active:scale-95 ${
                            paymentMethod === 'netbanking'
                              ? 'border-sky-600 bg-sky-50 text-sky-900 ring-2 ring-sky-500/20 font-black'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" />
                          <span className="text-[11px] sm:text-xs font-bold">Net Banking</span>
                          <span className="text-[8px] sm:text-[9px] text-slate-500">All Banks</span>
                        </button>
                      </div>
                    </div>

                    {/* Method Details Input */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 sm:p-4">
                      {paymentMethod === 'upi' && (
                        <div className="space-y-3 text-center">
                          <div className="bg-white p-2.5 sm:p-3 rounded-xl border-2 border-slate-300 inline-block shadow-xs">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-slate-950 rounded-lg p-2 flex flex-col items-center justify-center text-white mx-auto">
                              <QrCode className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
                              <span className="text-[8px] sm:text-[9px] font-mono mt-1 text-slate-300">BSEL-{registeringProgram.id.toUpperCase()}</span>
                            </div>
                          </div>
                          <p className="text-[11px] sm:text-xs text-slate-600 font-semibold">
                            Scan with PhonePe, Google Pay, Paytm, or enter your VPA / UPI ID below:
                          </p>
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="w-full h-10 px-3 text-center font-mono text-base sm:text-sm border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                          />
                        </div>
                      )}

                      {paymentMethod === 'card' && (
                        <div className="space-y-2.5 sm:space-y-3">
                          <div>
                            <label className="block text-[11px] font-black text-slate-800 mb-1">Card Number</label>
                            <input
                              type="text"
                              maxLength="19"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              className="w-full h-10 px-3 font-mono text-base sm:text-sm border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-black text-slate-800 mb-1">Expiry (MM/YY)</label>
                              <input
                                type="text"
                                maxLength="5"
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                                className="w-full h-10 px-3 text-center font-mono text-base sm:text-sm border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-black text-slate-800 mb-1">CVV</label>
                              <input
                                type="password"
                                maxLength="3"
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value)}
                                className="w-full h-10 px-3 text-center font-mono text-base sm:text-sm border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[11px] font-black text-slate-800 mb-1">Cardholder Name</label>
                            <input
                              type="text"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                              className="w-full h-10 px-3 text-base sm:text-sm border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                            />
                          </div>
                        </div>
                      )}

                      {paymentMethod === 'netbanking' && (
                        <div className="space-y-3">
                          <label className="block text-[11px] font-black text-slate-800 mb-1">Select Bank</label>
                          <select
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                            className="w-full h-10 px-3 text-base sm:text-sm border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                          >
                            <option>HDFC Bank</option>
                            <option>State Bank of India (SBI)</option>
                            <option>ICICI Bank</option>
                            <option>Axis Bank</option>
                            <option>Punjab National Bank</option>
                            <option>Kotak Mahindra Bank</option>
                            <option>Canara Bank</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleProcessPayment}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white py-3 sm:py-3.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer min-h-[46px]"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-200" />
                        <span>Pay {registeringProgram.fee} & Complete Registration</span>
                      </button>
                      <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500 font-semibold mt-2 text-center">
                        <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>256-bit Encrypted SSL Gateway • Official B★SEL Receipt</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* =========================================================================
                    STEP 3: PROCESSING SIMULATION
                   ========================================================================= */}
                {regStep === 'processing' && (
                  <div className="py-12 sm:py-16 text-center space-y-3 sm:space-y-4">
                    <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-sky-700 animate-spin mx-auto" />
                    <div>
                      <h4 className="text-sm sm:text-base font-black text-slate-900">Processing Your Enrollment</h4>
                      <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                        Connecting to B★SEL Education Gateway. Please do not close this window or refresh the page...
                      </p>
                    </div>
                  </div>
                )}

                {/* =========================================================================
                    STEP 4: REGISTRATION RECEIPT & CONFIRMATION SLIP
                   ========================================================================= */}
                {regStep === 'success' && confirmationData && (
                  <div className="space-y-3.5 sm:space-y-4">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 sm:p-4 text-center space-y-1 sm:space-y-1.5">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                        <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
                      </div>
                      <h4 className="text-base sm:text-lg font-black text-emerald-950 font-heading">Enrollment Confirmed!</h4>
                      <p className="text-xs text-emerald-800 font-medium">
                        Student successfully registered in official B★SEL academic records.
                      </p>
                    </div>

                    {/* Printable Receipt Card */}
                    <div id="enrollment-receipt" className="bg-white border-2 border-slate-300 rounded-2xl p-3.5 sm:p-4 space-y-3 sm:space-y-3.5 shadow-sm">
                      <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b-2 border-slate-100">
                        <div>
                          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-sky-800 block">Board of Skills & Educational Learning</span>
                          <h5 className="text-xs sm:text-sm font-black text-slate-900">Official Enrollment Slip</h5>
                        </div>
                        <span className="text-[11px] sm:text-xs font-mono font-bold bg-sky-100 text-sky-900 px-2 py-0.5 rounded">
                          {confirmationData.registrationNo}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-500 text-[10px] block">Candidate Name:</span>
                          <strong className="text-slate-900 font-bold">{confirmationData.studentName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block">Program:</span>
                          <strong className="text-slate-900 font-bold">{confirmationData.programName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block">Starting Stage:</span>
                          <strong className="text-slate-900 font-bold">{confirmationData.level}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block">Parent / Guardian:</span>
                          <strong className="text-slate-900 font-bold">{confirmationData.parentName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block">Contact Number:</span>
                          <strong className="text-slate-900 font-bold">{confirmationData.phone}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block">Institution / City:</span>
                          <strong className="text-slate-900 font-bold truncate block">{confirmationData.schoolName}, {confirmationData.city}</strong>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Transaction Reference:</span>
                          <span className="font-mono font-bold text-slate-800 text-[10px] sm:text-[11px]">{confirmationData.transactionId}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block">Amount Paid:</span>
                          <span className="font-black text-emerald-700 text-sm sm:text-base">{confirmationData.feePaid}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="w-full sm:flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 py-2.5 sm:py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-300 min-h-[42px]"
                      >
                        <Printer className="w-4 h-4 text-slate-700" />
                        <span>Print Enrollment Slip</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCloseRegister}
                        className="w-full sm:flex-1 bg-[#0F2B5C] hover:bg-[#163875] text-white py-2.5 sm:py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer min-h-[42px]"
                      >
                        <span>Done & Close</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
