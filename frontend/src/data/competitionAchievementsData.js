import globalImg from '../assets/programs/globallevel.jpg';
import nationalImg from '../assets/programs/nationallevel.jpg';
import districtImg from '../assets/programs/districtlevel.jpg';
import stateImg from '../assets/programs/statelevel.jpg';
import apjImg from '../assets/programs/apj.jpg';

export const INITIAL_COMPETITION_ACHIEVEMENTS = [
  {
    id: 'comp-1',
    code: '14.A',
    level: 'International Level',
    title: 'Thej International Abacus Competition',
    image: globalImg,
    description: 'Our academy and school students have participated in this global-level online competition and received awards.',
    highlights: '1st, 2nd, 3rd and Merit Awards',
    order: 1
  },
  {
    id: 'comp-2',
    code: '14.B',
    level: 'National Level',
    title: 'Redeemer Academy National Abacus Competition',
    image: nationalImg,
    description: 'Students have participated at the national level and achieved top positions and Merit Awards',
    highlights: 'Top positions and Merit Awards',
    order: 2
  },
  {
    id: 'comp-3',
    code: '14.C',
    level: 'District Level',
    title: 'G Max Arasi Abacus District Level Competition',
    image: districtImg,
    description: 'Our students have secured top places in the district-level competition.',
    highlights: '1st, 2nd and 3rd places, plus Merit Awards',
    order: 3
  },
  {
    id: 'comp-4',
    code: '14.D',
    level: 'State Level',
    title: 'G Max Arasi Abacus State Level Competition',
    image: stateImg,
    description: 'Students demonstrated speed, accuracy and mental arithmetic skills at the state-level competition.',
    highlights: '5 Schools - 180 Students participated',
    order: 4
  },
  {
    id: 'comp-5',
    code: '14.E',
    level: 'Special Recognition',
    title: 'APJ Abdul Kalam Awards',
    image: apjImg,
    description: 'Our students have received APJ Abdul Kalam Awards in recognition of their achievements and participation in academic and extracurricular activities.',
    highlights: 'Academic and extracurricular recognition',
    order: 5
  }
];

const STORAGE_KEY = 'bsel_competition_achievements_v1';

export const getStoredCompetitionAchievements = () => {
  if (typeof window === 'undefined') return INITIAL_COMPETITION_ACHIEVEMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_COMPETITION_ACHIEVEMENTS));
      return INITIAL_COMPETITION_ACHIEVEMENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_COMPETITION_ACHIEVEMENTS;
  } catch (err) {
    console.error('Error reading stored competition achievements:', err);
    return INITIAL_COMPETITION_ACHIEVEMENTS;
  }
};

export const saveStoredCompetitionAchievements = (items) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('bsel_competition_achievements_updated'));
  }
};

export const addStoredCompetitionAchievement = (data) => {
  const current = getStoredCompetitionAchievements();
  const newItem = {
    id: `comp-${Date.now()}`,
    code: data.code || `14.${String.fromCharCode(65 + current.length)}`,
    level: data.level || 'State Level',
    title: data.title || '',
    image: data.image || globalImg,
    description: data.description || '',
    highlights: data.highlights || '',
    order: Number(data.order) || current.length + 1
  };
  const updated = [...current, newItem];
  saveStoredCompetitionAchievements(updated);
  return newItem;
};

export const updateStoredCompetitionAchievement = (id, data) => {
  const current = getStoredCompetitionAchievements();
  const updated = current.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        ...data,
        image: data.image !== undefined ? data.image : item.image,
        order: Number(data.order ?? item.order)
      };
    }
    return item;
  });
  saveStoredCompetitionAchievements(updated);
  return updated;
};

export const deleteStoredCompetitionAchievement = (id) => {
  const current = getStoredCompetitionAchievements();
  const updated = current.filter((item) => item.id !== id);
  saveStoredCompetitionAchievements(updated);
  return updated;
};
