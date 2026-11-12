import express from 'express';
import db from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    if (db.isDbConnected()) {
      const result = await db.query('SELECT * FROM schools ORDER BY id ASC');
      return res.json({ success: true, schools: result.rows });
    }
    return res.json({ success: true, schools: [], message: 'Local storage fallback' });
  } catch (err) {
    console.error('[Schools GET Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch schools.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const code = data.code || `BSEL-CTR-${Math.floor(100 + Math.random() * 900)}`;

    if (db.isDbConnected()) {
      const result = await db.query(`
        INSERT INTO schools (code, name, branch_name, city, principal, coordinator, phone, students_count, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
        code,
        data.name,
        data.branchName || 'Tenkasi Regional Branch',
        data.city || 'Tamil Nadu',
        data.principal || '',
        data.coordinator || '',
        data.phone || '',
        parseInt(data.studentsCount, 10) || 50,
        data.status || 'Active Partner'
      ]);
      return res.status(201).json({ success: true, school: result.rows[0] });
    }
    return res.status(201).json({ success: true, school: { ...data, code } });
  } catch (err) {
    console.error('[Schools POST Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to create school.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (db.isDbConnected()) {
      await db.query('DELETE FROM schools WHERE id = $1 OR code = $2', [parseInt(id, 10) || -1, id]);
    }
    return res.json({ success: true, message: 'School deleted.' });
  } catch (err) {
    console.error('[Schools DELETE Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to delete school.' });
  }
});

export default router;
