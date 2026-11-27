import { getStudentScopeKey } from './studentDataHelpers';

const WORKSHEET_PREFIX = 'bsel_worksheets_';

// In-memory cache for ultra-fast access
const inMemoryCache = new Map();

/**
 * Returns the default 4-slot template
 */
export function getDefaultSlots() {
  return [
    { slot: 1, title: 'Practise Worksheet 1', file: null },
    { slot: 2, title: 'Practise Worksheet 2', file: null },
    { slot: 3, title: 'Practise Worksheet 3', file: null },
    { slot: 4, title: 'Practise Worksheet 4', file: null },
  ];
}

/**
 * Get all 4 worksheet slots for a student
 * @param {Object|string} studentOrKey 
 * @returns {Array} 4 slots with title and file info
 */
export function getStudentWorksheets(studentOrKey) {
  if (!studentOrKey) return getDefaultSlots();

  const scopeKey = typeof studentOrKey === 'string' && !studentOrKey.includes('{')
    ? studentOrKey.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_')
    : getStudentScopeKey(studentOrKey);

  if (!scopeKey) return getDefaultSlots();

  // Check in-memory cache first
  if (inMemoryCache.has(scopeKey)) {
    return inMemoryCache.get(scopeKey);
  }

  // Check localStorage
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(`${WORKSHEET_PREFIX}${scopeKey}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const defaults = getDefaultSlots();
          const merged = defaults.map((defSlot) => {
            const found = parsed.find((p) => Number(p.slot) === Number(defSlot.slot));
            return found ? { ...defSlot, ...found } : defSlot;
          });
          inMemoryCache.set(scopeKey, merged);
          return merged;
        }
      }
    }
  } catch (err) {
    console.warn('[WorksheetStorage] Error reading worksheets:', err);
  }

  const fresh = getDefaultSlots();
  inMemoryCache.set(scopeKey, fresh);
  return fresh;
}

/**
 * Save or update a single worksheet slot (1-4) for a student
 * @param {Object|string} studentOrKey 
 * @param {number} slotNumber (1, 2, 3, or 4)
 * @param {Object|null} fileData { name, url, size, type, uploadedAt, storage }
 */
export function saveStudentWorksheetSlot(studentOrKey, slotNumber, fileData) {
  const scopeKey = typeof studentOrKey === 'string' && !studentOrKey.includes('{')
    ? studentOrKey.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_')
    : getStudentScopeKey(studentOrKey);

  if (!scopeKey) return;

  const currentSlots = getStudentWorksheets(scopeKey);
  const updatedSlots = currentSlots.map((item) => {
    if (Number(item.slot) === Number(slotNumber)) {
      return {
        ...item,
        file: fileData || null,
        updatedAt: new Date().toISOString()
      };
    }
    return item;
  });

  inMemoryCache.set(scopeKey, updatedSlots);

  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${WORKSHEET_PREFIX}${scopeKey}`, JSON.stringify(updatedSlots));
      window.dispatchEvent(
        new CustomEvent('bsel_worksheets_updated', {
          detail: { scopeKey, slotNumber, fileData }
        })
      );
    }
  } catch (err) {
    console.warn('[WorksheetStorage] Error writing worksheet slot:', err);
  }

  return updatedSlots;
}

/**
 * Delete a worksheet from a slot
 */
export function deleteStudentWorksheetSlot(studentOrKey, slotNumber) {
  return saveStudentWorksheetSlot(studentOrKey, slotNumber, null);
}

/**
 * Check if a student has any uploaded worksheet files
 */
export function hasStudentWorksheets(studentOrKey) {
  const slots = getStudentWorksheets(studentOrKey);
  return slots.some((s) => s.file && s.file.url);
}

/**
 * Compute summary statistics for a list of students
 */
export function getBranchWorksheetStats(students = []) {
  let totalUploaded = 0;
  let fullCount = 0;
  let partialCount = 0;
  let emptyCount = 0;

  students.forEach((student) => {
    const slots = getStudentWorksheets(student);
    const uploadedInSlots = slots.filter((s) => s.file && s.file.url).length;

    totalUploaded += uploadedInSlots;
    if (uploadedInSlots === 4) {
      fullCount++;
    } else if (uploadedInSlots > 0) {
      partialCount++;
    } else {
      emptyCount++;
    }
  });

  return {
    totalStudents: students.length,
    totalWorksheets: totalUploaded,
    maxPossibleWorksheets: students.length * 4,
    studentsFull: fullCount,
    studentsPartial: partialCount,
    studentsEmpty: emptyCount
  };
}
