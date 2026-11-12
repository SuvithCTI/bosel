/**
 * Academic Stages & Categories Configuration
 * Automatically determined based on student age / school class.
 */

export const ACADEMIC_STAGES = [
  {
    className: 'Class 1',
    stage: 'SUB-JUNIOR (Class 1)',
    label: 'At the SUB-JUNIOR (Class 1) stage',
    ageRange: 'Age ≤ 6 yrs'
  },
  {
    className: 'Class 2',
    stage: 'SUB-JUNIOR (Class 2)',
    label: 'At the SUB-JUNIOR (Class 2) stage',
    ageRange: 'Age 7 yrs'
  },
  {
    className: 'Class 3',
    stage: 'SUB-JUNIOR (Class 3)',
    label: 'At the SUB-JUNIOR (Class 3) stage',
    ageRange: 'Age 8 yrs'
  },
  {
    className: 'Classes 4 & 5',
    stage: 'JUNIOR (Class 4 & 5)',
    label: 'At the JUNIOR (Class 4 & 5) stage',
    ageRange: 'Age 9 – 10 yrs'
  },
  {
    className: 'Classes 6 & 7',
    stage: 'SENIOR (Class 6 & 7)',
    label: 'At the SENIOR (Class 6 & 7) stage',
    ageRange: 'Age 11 – 12 yrs'
  },
  {
    className: 'Classes 8, 9 & 10',
    stage: 'SUPER SENIOR (Class 8 to 10)',
    label: 'At the SUPER SENIOR (Class 8 to 10) stage',
    ageRange: 'Age 13 – 15 yrs'
  },
  {
    className: 'Classes 11 & 12',
    stage: 'MASTER (Class 11 & 12)',
    label: 'At the MASTER (Class 11 & 12) stage',
    ageRange: 'Age 16+ yrs'
  }
];

/**
 * Maps student age to standard Class and official Academic Stage
 * @param {number|string} ageInput 
 * @returns {{ className: string, stage: string, label: string }}
 */
export const getAcademicStageFromAge = (ageInput) => {
  const age = parseInt(ageInput, 10);
  if (isNaN(age) || age < 1) {
    return { className: '', stage: '', label: '' };
  }
  if (age <= 6) {
    return { 
      className: 'Class 1', 
      stage: 'SUB-JUNIOR (Class 1)',
      label: 'At the SUB-JUNIOR (Class 1) stage'
    };
  }
  if (age === 7) {
    return { 
      className: 'Class 2', 
      stage: 'SUB-JUNIOR (Class 2)',
      label: 'At the SUB-JUNIOR (Class 2) stage'
    };
  }
  if (age === 8) {
    return { 
      className: 'Class 3', 
      stage: 'SUB-JUNIOR (Class 3)',
      label: 'At the SUB-JUNIOR (Class 3) stage'
    };
  }
  if (age >= 9 && age <= 10) {
    return { 
      className: 'Classes 4 & 5', 
      stage: 'JUNIOR (Class 4 & 5)',
      label: 'At the JUNIOR (Class 4 & 5) stage'
    };
  }
  if (age >= 11 && age <= 12) {
    return { 
      className: 'Classes 6 & 7', 
      stage: 'SENIOR (Class 6 & 7)',
      label: 'At the SENIOR (Class 6 & 7) stage'
    };
  }
  if (age >= 13 && age <= 15) {
    return { 
      className: 'Classes 8, 9 & 10', 
      stage: 'SUPER SENIOR (Class 8 to 10)',
      label: 'At the SUPER SENIOR (Class 8 to 10) stage'
    };
  }
  return { 
    className: 'Classes 11 & 12', 
    stage: 'MASTER (Class 11 & 12)',
    label: 'At the MASTER (Class 11 & 12) stage'
  };
};
