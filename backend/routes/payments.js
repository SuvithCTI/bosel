import express from 'express';
import db from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { branch } = req.query;
    if (db.isDbConnected()) {
      let queryText = 'SELECT * FROM payments';
      const params = [];
      if (branch && branch !== 'all') {
        params.push(`%${branch.toLowerCase()}%`);
        queryText += ' WHERE LOWER(branch) LIKE $1';
      }
      queryText += ' ORDER BY id DESC';
      const result = await db.query(queryText, params);
      return res.json({ success: true, payments: result.rows });
    }
    return res.json({ success: true, payments: [], message: 'Local storage fallback' });
  } catch (err) {
    console.error('[Payments GET Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch payments.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const receiptNo = data.receiptNo || `RCPT-TXN-${Date.now().toString().slice(-5)}`;
    const cleanAmount = String(data.amount || '450').replace(/[^0-9.]/g, '');
    const amountNum = parseFloat(cleanAmount) || 450;

    if (db.isDbConnected()) {
      const result = await db.query(`
        INSERT INTO payments (receipt_no, payer_name, student_id, branch, sector, program, amount, amount_num, payment_mode, ref_no, date, status, verified_by, screenshot_url, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *
      `, [
        receiptNo,
        data.payerName,
        data.studentId || '',
        data.branch || 'Tenkasi Regional Branch',
        data.sector || 'Course Tuition',
        data.program || 'Abacus Speed Arithmetic',
        data.amount || `₹${amountNum}`,
        amountNum,
        data.paymentMode || 'UPI / QR Code',
        data.refNo || `UPI-${Date.now().toString().slice(-8)}`,
        data.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        data.status || 'Verified',
        data.verifiedBy || 'Finance Desk',
        data.screenshotUrl || null,
        data.notes || ''
      ]);
      return res.status(201).json({ success: true, payment: result.rows[0] });
    }
    return res.status(201).json({ success: true, payment: { ...data, receiptNo, amountNum } });
  } catch (err) {
    console.error('[Payments POST Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to record payment.' });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, verifiedBy } = req.body;
    if (db.isDbConnected()) {
      await db.query(`
        UPDATE payments 
        SET status = $1, verified_by = COALESCE($2, verified_by) 
        WHERE id = $3 OR receipt_no = $4
      `, [status, verifiedBy || null, parseInt(id, 10) || -1, id]);
    }
    return res.json({ success: true, status });
  } catch (err) {
    console.error('[Payments PATCH Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to update payment status.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (db.isDbConnected()) {
      await db.query('DELETE FROM payments WHERE id = $1 OR receipt_no = $2', [parseInt(id, 10) || -1, id]);
    }
    return res.json({ success: true, message: 'Payment deleted.' });
  } catch (err) {
    console.error('[Payments DELETE Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to delete payment.' });
  }
});

export default router;
