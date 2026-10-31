// Central Repository for Branch Available Batches & Class Timings

export const DEFAULT_BATCHES = [
  {
    id: 'batch-01',
    branch: 'Tenkasi Regional Branch',
    batchCode: 'TSI-B01',
    name: 'Abacus Juniors & Foundation (Batch A)',
    program: 'Abacus',
    days: 'Saturday & Sunday',
    startTime: '09:30 AM',
    endTime: '11:30 AM',
    room: 'Lab 1 / Ground Floor',
    maxCapacity: 15,
    enrolledCount: 8,
    instructor: 'Mrs. Thangam Sivaji',
    status: 'Active',
    notes: 'Focuses on direct finger operations and speed arithmetic.'
  },
  {
    id: 'batch-02',
    branch: 'Tenkasi Regional Branch',
    batchCode: 'TSI-B02',
    name: 'Drawing & Fine Arts (Batch B)',
    program: 'Drawing & Art',
    days: 'Saturday & Sunday',
    startTime: '02:00 PM',
    endTime: '04:00 PM',
    room: 'Art Studio / Room 2',
    maxCapacity: 18,
    enrolledCount: 12,
    instructor: 'Mr. R. Karthik',
    status: 'Active',
    notes: 'Watercolour shading, freehand sketching and canvas basics.'
  },
  {
    id: 'batch-03',
    branch: 'Tenkasi Regional Branch',
    batchCode: 'TSI-B03',
    name: 'Handwriting & Phonics (Batch C)',
    program: 'Handwriting',
    days: 'Tuesday & Thursday',
    startTime: '05:00 PM',
    endTime: '06:30 PM',
    room: 'Classroom Room 3',
    maxCapacity: 12,
    enrolledCount: 6,
    instructor: 'Mrs. S. Meena',
    status: 'Active',
    notes: 'Cursive writing fluency and sound-to-letter articulation.'
  }
];

const STORAGE_KEY = 'bsel_branch_batches_v1';

export const getStoredBatches = () => {
  if (typeof window === 'undefined') return DEFAULT_BATCHES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BATCHES));
      return DEFAULT_BATCHES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_BATCHES;
  } catch (err) {
    console.error('Error reading stored batches:', err);
    return DEFAULT_BATCHES;
  }
};

export const saveStoredBatches = (batches) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(batches));
    window.dispatchEvent(new Event('bsel_batches_updated'));
    window.dispatchEvent(new CustomEvent('bsel_batches_updated', { detail: batches }));
  } catch (err) {
    console.error('Error saving stored batches:', err);
  }
};

export const addStoredBatch = (batchData) => {
  const batches = getStoredBatches();
  const nextId = `batch-${Date.now().toString().slice(-4)}`;
  const newBatch = {
    id: nextId,
    branch: batchData.branch || 'Tenkasi Regional Branch',
    batchCode: batchData.batchCode || `BAT-${Date.now().toString().slice(-3)}`,
    name: batchData.name || 'New Weekend Batch',
    program: batchData.program || 'Abacus',
    days: batchData.days || 'Saturday & Sunday',
    startTime: batchData.startTime || '10:00 AM',
    endTime: batchData.endTime || '12:00 PM',
    room: batchData.room || 'Classroom 1',
    maxCapacity: Number(batchData.maxCapacity) || 15,
    enrolledCount: Number(batchData.enrolledCount) || 0,
    instructor: batchData.instructor || 'Centre Faculty',
    status: batchData.status || 'Active',
    notes: batchData.notes || ''
  };
  const updated = [newBatch, ...batches];
  saveStoredBatches(updated);
  return updated;
};

export const updateStoredBatch = (id, updatedFields) => {
  const batches = getStoredBatches();
  const updated = batches.map(b => 
    (String(b.id) === String(id) || (b.batchCode && String(b.batchCode) === String(id)))
      ? { ...b, ...updatedFields } 
      : b
  );
  saveStoredBatches(updated);
  return updated;
};

export const deleteStoredBatch = (id) => {
  const batches = getStoredBatches();
  const filtered = batches.filter(b => 
    String(b.id) !== String(id) && (!b.batchCode || String(b.batchCode) !== String(id))
  );
  saveStoredBatches(filtered);
  return filtered;
};

export const resetStoredBatches = () => {
  saveStoredBatches(DEFAULT_BATCHES);
  return DEFAULT_BATCHES;
};
