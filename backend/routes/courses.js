import express from 'express';
import db from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    if (db.isDbConnected()) {
      const result = await db.query('SELECT * FROM courses ORDER BY id ASC');
      return res.json({ success: true, courses: result.rows });
    }
    return res.json({ success: true, courses: [], message: 'Local storage fallback' });
  } catch (err) {
    console.error('[Courses GET Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch courses.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    if (db.isDbConnected()) {
      const result = await db.query(`
        INSERT INTO courses (code, name, full_name, category, duration, fee, levels, description, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
        data.code || `CRS-${Date.now().toString().slice(-4)}`,
        data.name,
        data.fullName || data.name,
        data.category || 'Skill Development',
        data.duration || '6 Months',
        data.fee || '₹450',
        JSON.stringify(data.levels || []),
        data.description || '',
        data.isActive !== false
      ]);
      return res.status(201).json({ success: true, course: result.rows[0] });
    }
    return res.status(201).json({ success: true, course: data });
  } catch (err) {
    console.error('[Courses POST Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to create course.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (db.isDbConnected()) {
      await db.query('DELETE FROM courses WHERE id = $1 OR code = $2', [parseInt(id, 10) || -1, id]);
    }
    return res.json({ success: true, message: 'Course deleted.' });
  } catch (err) {
    console.error('[Courses DELETE Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to delete course.' });
  }
});

export default router;
