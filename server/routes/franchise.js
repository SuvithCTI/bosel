import express from 'express';
import db from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    if (db.isDbConnected()) {
      const result = await db.query('SELECT * FROM franchise_leads ORDER BY id DESC');
      return res.json({ success: true, leads: result.rows });
    }
    return res.json({ success: true, leads: [], message: 'Local storage fallback' });
  } catch (err) {
    console.error('[Franchise GET Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch franchise leads.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const refId = data.refId || `BSEL-FRN-${Math.floor(100000 + Math.random() * 900000)}`;

    if (db.isDbConnected()) {
      const result = await db.query(`
        INSERT INTO franchise_leads (ref_id, name, email, phone, city, district, state, location_type, investment_range, experience, status, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `, [
        refId,
        data.name,
        data.email,
        data.phone,
        data.city || '',
        data.district || '',
        data.state || 'Tamil Nadu',
        data.locationType || 'Urban Commercial',
        data.investmentRange || '₹2 Lakhs - ₹5 Lakhs',
        data.experience || '',
        data.status || 'New',
        data.notes || ''
      ]);
      return res.status(201).json({ success: true, lead: result.rows[0] });
    }
    return res.status(201).json({ success: true, lead: { ...data, refId } });
  } catch (err) {
    console.error('[Franchise POST Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to create franchise enquiry.' });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (db.isDbConnected()) {
      await db.query('UPDATE franchise_leads SET status = $1 WHERE id = $2 OR ref_id = $3', [
        status,
        parseInt(id, 10) || -1,
        id
      ]);
    }
    return res.json({ success: true, status });
  } catch (err) {
    console.error('[Franchise PATCH Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to update lead status.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (db.isDbConnected()) {
      await db.query('DELETE FROM franchise_leads WHERE id = $1 OR ref_id = $2', [parseInt(id, 10) || -1, id]);
    }
    return res.json({ success: true, message: 'Lead deleted.' });
  } catch (err) {
    console.error('[Franchise DELETE Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to delete franchise lead.' });
  }
});

export default router;
