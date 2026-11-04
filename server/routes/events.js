import express from 'express';
import db from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    if (db.isDbConnected()) {
      const result = await db.query('SELECT * FROM events ORDER BY id ASC');
      return res.json({ success: true, events: result.rows });
    }
    return res.json({ success: true, events: [], message: 'Local storage fallback' });
  } catch (err) {
    console.error('[Events GET Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch events.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    if (db.isDbConnected()) {
      const result = await db.query(`
        INSERT INTO events (title, category, date, venue, fee, registration_deadline, eligibility, status, description, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `, [
        data.title,
        data.category || 'Championship',
        data.date,
        data.venue,
        data.fee || '₹450',
        data.deadline || data.registrationDeadline || '',
        data.eligibility || 'Open to All',
        data.status || 'Upcoming',
        data.description || '',
        data.isActive !== false
      ]);
      return res.status(201).json({ success: true, event: result.rows[0] });
    }
    return res.status(201).json({ success: true, event: data });
  } catch (err) {
    console.error('[Events POST Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to create event.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (db.isDbConnected()) {
      await db.query('DELETE FROM events WHERE id = $1', [parseInt(id, 10)]);
    }
    return res.json({ success: true, message: 'Event deleted.' });
  } catch (err) {
    console.error('[Events DELETE Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to delete event.' });
  }
});

export default router;
