/**
 * Academic Stages & Categories Configuration
 * Automatically determined based on student age / school class.
 * Separated by individual Class from Class 1 through Class 12.
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
    className: 'Class 4',
    stage: 'JUNIOR (Class 4)',
    label: 'At the JUNIOR (Class 4) stage',
    ageRange: 'Age 9 yrs'
  },
  {
    className: 'Class 5',
    stage: 'JUNIOR (Class 5)',
    label: 'At the JUNIOR (Class 5) stage',
    ageRange: 'Age 10 yrs'
  },
  {
    className: 'Class 6',
    stage: 'SENIOR (Class 6)',
    label: 'At the SENIOR (Class 6) stage',
    ageRange: 'Age 11 yrs'
  },
  {
    className: 'Class 7',
    stage: 'SENIOR (Class 7)',
    label: 'At the SENIOR (Class 7) stage',
    ageRange: 'Age 12 yrs'
  },
  {
    className: 'Class 8',
    stage: 'SUPER SENIOR (Class 8)',
    label: 'At the SUPER SENIOR (Class 8) stage',
    ageRange: 'Age 13 yrs'
  },
  {
    className: 'Class 9',
    stage: 'SUPER SENIOR (Class 9)',
    label: 'At the SUPER SENIOR (Class 9) stage',
    ageRange: 'Age 14 yrs'
  },
  {
    className: 'Class 10',
    stage: 'SUPER SENIOR (Class 10)',
    label: 'At the SUPER SENIOR (Class 10) stage',
    ageRange: 'Age 15 yrs'
  },
  {
    className: 'Class 11',
    stage: 'MASTER (Class 11)',
    label: 'At the MASTER (Class 11) stage',
    ageRange: 'Age 16 yrs'
  },
  {
    className: 'Class 12',
    stage: 'MASTER (Class 12)',
    label: 'At the MASTER (Class 12) stage',
    ageRange: 'Age 17+ yrs'
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
  if (age === 9) {
    return { 
      className: 'Class 4', 
      stage: 'JUNIOR (Class 4)',
      label: 'At the JUNIOR (Class 4) stage'
    };
  }
  if (age === 10) {
    return { 
      className: 'Class 5', 
      stage: 'JUNIOR (Class 5)',
      label: 'At the JUNIOR (Class 5) stage'
    };
  }
  if (age === 11) {
    return { 
      className: 'Class 6', 
      stage: 'SENIOR (Class 6)',
      label: 'At the SENIOR (Class 6) stage'
    };
  }
  if (age === 12) {
    return { 
      className: 'Class 7', 
      stage: 'SENIOR (Class 7)',
      label: 'At the SENIOR (Class 7) stage'
    };
  }
  if (age === 13) {
    return { 
      className: 'Class 8', 
      stage: 'SUPER SENIOR (Class 8)',
      label: 'At the SUPER SENIOR (Class 8) stage'
    };
  }
  if (age === 14) {
    return { 
      className: 'Class 9', 
      stage: 'SUPER SENIOR (Class 9)',
      label: 'At the SUPER SENIOR (Class 9) stage'
    };
  }
  if (age === 15) {
    return { 
      className: 'Class 10', 
      stage: 'SUPER SENIOR (Class 10)',
      label: 'At the SUPER SENIOR (Class 10) stage'
    };
  }
  if (age === 16) {
    return { 
      className: 'Class 11', 
      stage: 'MASTER (Class 11)',
      label: 'At the MASTER (Class 11) stage'
    };
  }
  return { 
    className: 'Class 12', 
    stage: 'MASTER (Class 12)',
    label: 'At the MASTER (Class 12) stage'
  };
};
