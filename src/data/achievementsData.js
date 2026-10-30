// Central Local Storage Data Store for Student & Academy Achievements
import student1 from '../assets/programs/student1.jpg';
import student2 from '../assets/programs/student2.jpg';
import student3 from '../assets/programs/student3.jpg';
import student4 from '../assets/programs/student4.jpg';
import student5 from '../assets/programs/student5.jpg';
import student6 from '../assets/programs/student6.jpg';

export const INITIAL_STUDENT_ACHIEVEMENTS = [
  {
    id: 'ach-1',
    name: "Ram",
    school: "Sacred Heart Nursery & Primary School",
    achievement: "International Level Abacus Competition",
    level: "International",
    award: "International Achievement Award",
    description: "Recognized for exceptional mental arithmetic skills, accuracy, and concentration.",
    photo: student1,
    year: "2026",
    isDefault: true
  },
  {
    id: 'ach-2',
    name: "Rani",
    school: "RC Middle School",
    achievement: "National Level Abacus Competition",
    level: "National",
    award: "National Excellence Award",
    description: "Demonstrated outstanding calculation speed and problem-solving abilities.",
    photo: student2,
    year: "2026",
    isDefault: true
  },
  {
    id: 'ach-3',
    name: "Raji",
    school: "Amaravathi Matriculation School",
    achievement: "State Level Abacus Competition",
    level: "State",
    award: "State Level Achievement Award",
    description: "Showcased excellent numerical skills and dedication during the competition.",
    photo: student3,
    year: "2026",
    isDefault: true
  },
  {
    id: 'ach-4',
    name: "Sivaji",
    school: "B★SEL Tenkasi Regional Academy",
    achievement: "State Level Mental Arithmetic Challenge",
    level: "State",
    award: "First Class Distinction Trophy",
    description: "Mastered Level 1 Soroban speed drills with 98% accuracy in flash anzan.",
    photo: student4,
    year: "2026",
    isDefault: true
  }
];

const ACHIEVEMENTS_STORAGE_KEY = 'bsel_achievements_data';

export const getStoredAchievements = () => {
  if (typeof window === 'undefined') return INITIAL_STUDENT_ACHIEVEMENTS;
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(INITIAL_STUDENT_ACHIEVEMENTS));
      return INITIAL_STUDENT_ACHIEVEMENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_STUDENT_ACHIEVEMENTS;
  } catch (err) {
    console.error('Error reading stored achievements:', err);
    return INITIAL_STUDENT_ACHIEVEMENTS;
  }
};

export const saveStoredAchievements = (achievements) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(achievements));
    window.dispatchEvent(new Event('bsel_achievements_updated'));
  }
};

export const addStoredAchievement = (data) => {
  const current = getStoredAchievements();
  const newAch = {
    id: `ach-${Date.now()}`,
    name: data.name || "Student Achiever",
    school: data.school || "B★SEL Partner Academy",
    achievement: data.achievement || "Competition Excellence",
    level: data.level || "State",
    award: data.award || "Achievement Award",
    description: data.description || "Demonstrated outstanding dedication and skill excellence in competition.",
    photo: data.photo || student5,
    year: data.year || new Date().getFullYear().toString(),
    dateAdded: new Date().toISOString()
  };

  const updated = [newAch, ...current];
  saveStoredAchievements(updated);
  return updated;
};

export const deleteStoredAchievement = (id) => {
  const current = getStoredAchievements();
  const updated = current.filter(a => a.id !== id);
  saveStoredAchievements(updated);
  return updated;
};

export const resetStoredAchievements = () => {
  saveStoredAchievements(INITIAL_STUDENT_ACHIEVEMENTS);
  return INITIAL_STUDENT_ACHIEVEMENTS;
};
