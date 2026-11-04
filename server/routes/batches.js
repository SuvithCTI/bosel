import express from 'express';
import db from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { branch } = req.query;
    if (db.isDbConnected()) {
      let queryText = 'SELECT * FROM batches WHERE is_active = TRUE';
      const params = [];
      if (branch && branch !== 'all') {
        params.push(`%${branch.toLowerCase()}%`);
        queryText += ' AND LOWER(branch) LIKE $1';
      }
      queryText += ' ORDER BY id ASC';
      const result = await db.query(queryText, params);
      return res.json({ success: true, batches: result.rows });
    }
    return res.json({ success: true, batches: [], message: 'Local storage fallback' });
  } catch (err) {
    console.error('[Batches GET Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch batches.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    if (db.isDbConnected()) {
      const result = await db.query(`
        INSERT INTO batches (name, branch, program, days, start_time, end_time, room, capacity)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [
        data.name,
        data.branch || 'Tenkasi Regional Branch',
        data.program || 'Abacus Speed Arithmetic',
        data.days || 'Mon, Wed, Fri',
        data.startTime || '04:00 PM',
        data.endTime || '05:30 PM',
        data.room || 'Room 101',
        parseInt(data.capacity, 10) || 25
      ]);
      return res.status(201).json({ success: true, batch: result.rows[0] });
    }
    return res.status(201).json({ success: true, batch: data });
  } catch (err) {
    console.error('[Batches POST Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to create batch.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (db.isDbConnected()) {
      await db.query('DELETE FROM batches WHERE id = $1', [parseInt(id, 10)]);
    }
    return res.json({ success: true, message: 'Batch deleted.' });
  } catch (err) {
    console.error('[Batches DELETE Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to delete batch.' });
  }
});

export default router;
