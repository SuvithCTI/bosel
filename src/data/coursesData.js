// Central Master Courses & Curriculum Repository for B★SEL
import abacusImg from '../assets/programs/abacus.jpg';
import drawingArtImg from '../assets/programs/drawing-art.jpg';
import handwritingImg from '../assets/programs/handwriting.jpg';
import phonicsImg from '../assets/programs/phonics.jpg';
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
import languageSpeakingImg from '../assets/programs/language-speaking.jpg';
import athleticsImg from '../assets/programs/athletics.jpg';
import colourManagementImg from '../assets/programs/colour-management.jpg';

export const DEFAULT_COURSES = [
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

// Augment each default course with code, status, and enrolled students if not present
DEFAULT_COURSES.forEach((course, idx) => {
  if (!course.code) {
    const slug = course.id.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase();
    course.code = slug || `C${idx + 1}`;
  }
  if (!course.status) course.status = 'Active';
  if (!course.shortDesc) course.shortDesc = course.tagline || course.description;
  if (!course.enrolledStudents) course.enrolledStudents = 40 + ((idx * 17) % 110);
});

export const getStoredCourses = () => {
  if (typeof window === 'undefined') return DEFAULT_COURSES;
  try {
    const raw = localStorage.getItem('bsel_courses_data');
    if (!raw) {
      localStorage.setItem('bsel_courses_data', JSON.stringify(DEFAULT_COURSES));
      return DEFAULT_COURSES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem('bsel_courses_data', JSON.stringify(DEFAULT_COURSES));
      return DEFAULT_COURSES;
    }

    // Merge in any default courses missing from parsed (retains user edits to existing ones)
    const existingIds = new Set(parsed.map(c => c.id));
    let hasChanges = false;
    const merged = [...parsed];
    for (const dc of DEFAULT_COURSES) {
      if (!existingIds.has(dc.id)) {
        merged.push(dc);
        hasChanges = true;
      }
    }
    if (hasChanges) {
      localStorage.setItem('bsel_courses_data', JSON.stringify(merged));
    }
    return merged;
  } catch (err) {
    console.error('Error reading stored courses:', err);
    return DEFAULT_COURSES;
  }
};

export const saveStoredCourses = (courses) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('bsel_courses_data', JSON.stringify(courses));
      window.dispatchEvent(new Event('bsel_courses_updated'));
      window.dispatchEvent(new StorageEvent('storage', { key: 'bsel_courses_data' }));
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

  const isDigital = (newCourse.category || '').toLowerCase().includes('digital') || 
                    (newCourse.category || '').toLowerCase().includes('tech') ||
                    (newCourse.category || '').toLowerCase().includes('computer');

  const courseRecord = {
    ...newCourse,
    id,
    code,
    category: newCourse.category || (isDigital ? 'digital' : 'skill'),
    fullName: newCourse.fullName || newCourse.name?.toUpperCase(),
    tagline: newCourse.tagline || newCourse.shortDesc || `${newCourse.name} Training & Excellence`,
    shortDesc: newCourse.shortDesc || newCourse.tagline || `${newCourse.name} Training & Excellence`,
    status: newCourse.status || 'Active',
    enrolledStudents: 0,
    fee: newCourse.fee ? (newCourse.fee.startsWith('₹') ? newCourse.fee : `₹${newCourse.fee}`) : '₹450',
    feeAmount: parseInt((newCourse.fee || '450').replace(/[^0-9]/g, '')) || 450,
    badgeColor: newCourse.badgeColor || (isDigital ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'),
    themeColor: newCourse.themeColor || (isDigital ? 'from-blue-600 to-indigo-700' : 'from-emerald-500 to-teal-600'),
    accentColor: newCourse.accentColor || (isDigital ? 'text-blue-700' : 'text-emerald-700'),
    outcomes: Array.isArray(newCourse.outcomes) ? newCourse.outcomes : (typeof newCourse.outcomes === 'string' ? newCourse.outcomes.split('\n').filter(Boolean) : [
      'Master core theoretical and practical principles',
      'Develop independent problem-solving skills',
      'Earn accredited B★SEL course completion certificate'
    ]),
    curriculum: Array.isArray(newCourse.curriculum) ? newCourse.curriculum : (typeof newCourse.curriculum === 'string' ? newCourse.curriculum.split('\n').filter(Boolean) : [
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
  if (index === -1) {
    const altIndex = courses.findIndex(c => 
      c.name?.toLowerCase() === updatedFields.name?.toLowerCase() ||
      c.code === updatedFields.code
    );
    if (altIndex !== -1) {
      courses[altIndex] = { ...courses[altIndex], ...updatedFields };
      saveStoredCourses(courses);
      return courses;
    }
    return courses;
  }

  const existingImage = courses[index].image;
  courses[index] = {
    ...courses[index],
    ...updatedFields,
    image: updatedFields.image || existingImage
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
