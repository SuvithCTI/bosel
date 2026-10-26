import abacusImg from '../assets/programs/abacus.jpg';
import drawingArtImg from '../assets/programs/drawing-art.jpg';
import handwritingImg from '../assets/programs/handwriting.jpg';
import languageSpeakingImg from '../assets/programs/language-speaking.jpg';
import athleticsImg from '../assets/programs/athletics.jpg';
import colourManagementImg from '../assets/programs/colour-management.jpg';

export const PROGRAMS_DATA = [
  {
    id: 'abacus',
    name: 'Abacus',
    fullName: 'ABACUS',
    tagline: 'Improve mental math, concentration, and calculation speed.',
    shortDesc: 'Improve mental math, concentration, and calculation speed.',
    themeColor: 'from-emerald-500 to-teal-600',
    accentColor: 'text-emerald-700',
    bgLight: 'bg-emerald-50 border-emerald-200',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    iconType: 'abacus',
    image: abacusImg,
    ageGroup: '5 - 14 Years',
    levels: '8 Structured Levels',
    duration: '3 Months per Level',
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
    name: 'Drawing & Art',
    fullName: 'DRAWING & ART',
    tagline: 'Express creativity through imagination and artistic skills.',
    shortDesc: 'Express creativity through imagination and artistic skills.',
    themeColor: 'from-sky-500 to-blue-600',
    accentColor: 'text-sky-700',
    bgLight: 'bg-sky-50 border-sky-200',
    badgeColor: 'bg-sky-100 text-sky-800',
    iconType: 'drawing-art',
    image: drawingArtImg,
    ageGroup: '4 - 16 Years',
    levels: '6 Progressive Levels',
    duration: '3 Months per Level',
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
    name: 'Handwriting',
    fullName: 'HANDWRITING',
    tagline: 'Develop neat, clear, and confident handwriting.',
    shortDesc: 'Develop neat, clear, and confident handwriting.',
    themeColor: 'from-amber-500 to-orange-600',
    accentColor: 'text-amber-700',
    bgLight: 'bg-amber-50 border-amber-200',
    badgeColor: 'bg-amber-100 text-amber-800',
    iconType: 'handwriting',
    image: handwritingImg,
    ageGroup: '6 - 18 Years',
    levels: '3 Intensive Modules',
    duration: '30 Days Crash / 3 Months Regular',
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
    id: 'language-speaking',
    name: 'Language Speaking',
    fullName: 'LANGUAGE SPEAKING',
    tagline: 'Build communication skills and speaking confidence.',
    shortDesc: 'Build communication skills and speaking confidence.',
    themeColor: 'from-indigo-500 to-violet-600',
    accentColor: 'text-indigo-700',
    bgLight: 'bg-indigo-50 border-indigo-200',
    badgeColor: 'bg-indigo-100 text-indigo-800',
    iconType: 'language-speaking',
    image: languageSpeakingImg,
    ageGroup: '5 - 16 Years',
    levels: '4 Progressive Levels',
    duration: '3 Months per Level',
    description: 'Dynamic communication & public speaking program that trains children to speak fluently, clearly, and persuasively in English, overcoming stage fear and building charismatic social confidence.',
    outcomes: [
      'Overcomes stage fear and builds natural speaking fluency',
      'Enhances vocabulary, pronunciation, and grammatical precision',
      'Teaches body language, vocal modulation, and debate etiquette',
      'Prepares students for elocution, MUN, and leadership roles'
    ],
    curriculum: [
      'Level 1: Daily conversational fluency & storytelling',
      'Level 2: Vocal projection, tone modulation & public speaking basics',
      'Level 3: Impromptu speeches, JAM sessions & group discussions',
      'Level 4: Debate argumentation, stage presence & interview skills'
    ]
  },
  {
    id: 'athletics',
    name: 'Athletics',
    fullName: 'ATHLETICS',
    tagline: 'Improve fitness, discipline, and teamwork.',
    shortDesc: 'Improve fitness, discipline, and teamwork.',
    themeColor: 'from-orange-500 to-red-600',
    accentColor: 'text-orange-700',
    bgLight: 'bg-orange-50 border-orange-200',
    badgeColor: 'bg-orange-100 text-orange-800',
    iconType: 'athletics',
    image: athleticsImg,
    ageGroup: '5 - 17 Years',
    levels: '4 Physical Tiers',
    duration: 'Ongoing / 4 Months per Tier',
    description: 'Foundational athletics and physical fitness training covering sprinting drills, agility, endurance, jump mechanics, core stamina, and sportsmanship under certified athletic coaches.',
    outcomes: [
      'Develops cardiovascular stamina, muscle strength, and agility',
      'Instills discipline, perseverance, and goal-setting habits',
      'Fosters collaborative teamwork and healthy sportsmanship',
      'Builds fundamental motor skills for all school sports competitions'
    ],
    curriculum: [
      'Tier 1: Posture, warm-up routines, footwork & balance',
      'Tier 2: Speed sprints, relay transitions & coordination drills',
      'Tier 3: Long-distance pacing, hurdle jumps & core stamina',
      'Tier 4: Competitive track simulations, mental resilience & fitness'
    ]
  },
  {
    id: 'colour-management',
    name: 'Colour Management',
    fullName: 'COLOUR MANAGEMENT',
    tagline: 'Learn colour recognition, combinations, and creative expression.',
    shortDesc: 'Learn colour recognition, combinations, and creative expression.',
    themeColor: 'from-pink-500 to-rose-600',
    accentColor: 'text-pink-700',
    bgLight: 'bg-pink-50 border-pink-200',
    badgeColor: 'bg-pink-100 text-pink-800',
    iconType: 'colour-management',
    image: colourManagementImg,
    ageGroup: '4 - 15 Years',
    levels: '3 Creative Modules',
    duration: '2 Months per Module',
    description: 'Specialized color perception and design course exploring color psychology, primary and secondary harmony, color wheels, gradients, contrast palettes, and multi-medium color application.',
    outcomes: [
      'Mastery of color wheel, complementary tones, and warm/cool shades',
      'Enhances visual aesthetics and design sensibility',
      'Develops sharp color identification, mixing, and tinting skills',
      'Enables expressive creative output in design, crafting, and visual arts'
    ],
    curriculum: [
      'Module 1: Primary, secondary & tertiary color wheel fundamentals',
      'Module 2: Tints, shades, color mixing & harmonious contrast pairs',
      'Module 3: Mood psychology in colors & creative compositional palettes'
    ]
  }
];
