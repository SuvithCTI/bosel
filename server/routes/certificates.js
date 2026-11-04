import express from 'express';
import db from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    if (db.isDbConnected()) {
      let queryText = 'SELECT * FROM certificates';
      const params = [];
      if (search) {
        params.push(`%${search.toLowerCase()}%`);
        queryText += ' WHERE LOWER(certificate_no) LIKE $1 OR LOWER(student_name) LIKE $1 OR LOWER(registration_no) LIKE $1';
      }
      queryText += ' ORDER BY id DESC';
      const result = await db.query(queryText, params);
      return res.json({ success: true, certificates: result.rows });
    }
    return res.json({ success: true, certificates: [], message: 'Local storage fallback' });
  } catch (err) {
    console.error('[Certificates GET Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch certificates.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const certNo = data.certificateNo || `BSEL-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    if (db.isDbConnected()) {
      const result = await db.query(`
        INSERT INTO certificates (certificate_no, registration_no, student_name, course_name, level, grade, duration, issue_date, centre_name, certificate_type)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `, [
        certNo,
        data.registrationNo || `REG-${Date.now().toString().slice(-6)}`,
        data.studentName,
        data.courseName,
        data.level || 'Level 1',
        data.grade || 'A+',
        data.duration || '6 Months',
        data.issueDate || new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
        data.centreName || 'Tenkasi Regional Branch',
        data.certificateType || 'COURSE'
      ]);
      return res.status(201).json({ success: true, certificate: result.rows[0] });
    }
    return res.status(201).json({ success: true, certificate: { ...data, certificateNo: certNo } });
  } catch (err) {
    console.error('[Certificates POST Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to issue certificate.' });
  }
});

router.get('/verify/:certNo', async (req, res) => {
  try {
    const { certNo } = req.params;
    if (db.isDbConnected()) {
      const result = await db.query('SELECT * FROM certificates WHERE LOWER(certificate_no) = LOWER($1)', [certNo]);
      if (result.rows.length > 0) {
        return res.json({ success: true, verified: true, certificate: result.rows[0] });
      }
    }
    return res.status(404).json({ success: false, verified: false, message: 'Certificate not found.' });
  } catch (err) {
    console.error('[Certificates VERIFY Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to verify certificate.' });
  }
});

export default router;
