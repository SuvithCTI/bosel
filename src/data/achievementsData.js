// Central Local Storage Data Store for Student & Academy Achievements
import student1 from '../assets/programs/student1.jpg';
import student2 from '../assets/programs/student2.jpg';
import student3 from '../assets/programs/student3.jpg';
import student4 from '../assets/programs/student4.jpg';
import student5 from '../assets/programs/student5.jpg';
import student6 from '../assets/programs/student6.jpg';

export const PRESET_STUDENT_PHOTOS = [
  { id: 'student1', label: 'Student Photo 1', img: student1 },
  { id: 'student2', label: 'Student Photo 2', img: student2 },
  { id: 'student3', label: 'Student Photo 3', img: student3 },
  { id: 'student4', label: 'Student Photo 4', img: student4 },
  { id: 'student5', label: 'Student Photo 5', img: student5 },
  { id: 'student6', label: 'Student Photo 6', img: student6 },
];

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

const DEFAULT_PRESET_IMAGES = [student1, student2, student3, student4, student5, student6];

export const resolveStudentPhoto = (photo, index = 0) => {
  const fallback = DEFAULT_PRESET_IMAGES[Math.abs(index) % DEFAULT_PRESET_IMAGES.length];
  if (!photo || photo === 'undefined' || photo === 'null' || (typeof photo === 'string' && !photo.trim())) {
    return fallback;
  }
  if (typeof photo === 'string') {
    // If it's a data URL (uploaded file) or absolute http URL, use it
    if (photo.startsWith('data:image/') || photo.startsWith('http://') || photo.startsWith('https://')) {
      return photo;
    }
    // If it's an old relative Vite path or preset identifier from another machine/build
    if (photo.includes('student1')) return student1;
    if (photo.includes('student2')) return student2;
    if (photo.includes('student3')) return student3;
    if (photo.includes('student4')) return student4;
    if (photo.includes('student5')) return student5;
    if (photo.includes('student6')) return student6;
  }
  return photo || fallback;
};

export const getStoredAchievements = () => {
  if (typeof window === 'undefined') return INITIAL_STUDENT_ACHIEVEMENTS;
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(INITIAL_STUDENT_ACHIEVEMENTS));
      return INITIAL_STUDENT_ACHIEVEMENTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_STUDENT_ACHIEVEMENTS;
    return parsed.map((item, idx) => ({
      ...item,
      photo: resolveStudentPhoto(item.photo, idx)
    }));
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
    photo: data.photo || student1,
    year: data.year || new Date().getFullYear().toString(),
    dateAdded: new Date().toISOString()
  };

  const updated = [newAch, ...current];
  saveStoredAchievements(updated);
  return updated;
};

export const updateStoredAchievement = (id, updatedFields) => {
  const current = getStoredAchievements();
  const updated = current.map(item => item.id === id ? { ...item, ...updatedFields } : item);
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
