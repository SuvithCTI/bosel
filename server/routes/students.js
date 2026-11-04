import express from 'express';
import db from '../config/db.js';

const router = express.Router();

/**
 * GET /api/students
 * Fetches all students with optional filtering by branch and search
 */
router.get('/', async (req, res) => {
  try {
    const { branch, search } = req.query;

    if (db.isDbConnected()) {
      let queryText = 'SELECT * FROM students WHERE 1=1';
      const params = [];

      if (branch && branch !== 'all') {
        params.push(`%${branch.toLowerCase()}%`);
        queryText += ` AND LOWER(branch) LIKE $${params.length}`;
      }

      if (search) {
        params.push(`%${search.toLowerCase()}%`);
        queryText += ` AND (LOWER(student_name) LIKE $${params.length} OR LOWER(user_id) LIKE $${params.length} OR register_number LIKE $${params.length} OR phone LIKE $${params.length})`;
      }

      queryText += ' ORDER BY id DESC';

      const result = await db.query(queryText, params);
      return res.json({ success: true, students: result.rows });
    }

    // Fallback response
    return res.json({ success: true, students: [], message: 'Using local storage mode.' });
  } catch (error) {
    console.error('[Students GET Error]:', error);
    res.status(500).json({ success: false, message: 'Error retrieving students.' });
  }
});

/**
 * POST /api/students
 * Creates a new student record
 */
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const rawDigits = (data.phone || '').replace(/\D/g, '');
    const cleanMobile = rawDigits.length >= 10 ? rawDigits.slice(-10) : '9840123456';
    const userId = data.userId || `BSEL-${cleanMobile}`;
    const regNo = data.registerNumber || `REG-${Date.now().toString().slice(-6)}`;

    if (db.isDbConnected()) {
      const result = await db.query(`
        INSERT INTO students (
          user_id, register_number, student_name, parent_name, dob, age, gender,
          student_class, student_stage, phone, email, photo_url, course_name,
          program, branch, address, city, district, pincode, fee_payment_type,
          fee_amount, payment_mode, receipt_ref_no, status, enrolment_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
        RETURNING *
      `, [
        userId,
        regNo,
        data.studentName || 'Student',
        data.parentName || '',
        data.dob || '',
        data.age || '',
        data.gender || 'Male',
        data.studentClass || '',
        data.studentStage || '',
        cleanMobile,
        data.email || '',
        data.photoUrl || data.studentPhoto || null,
        data.courseName || data.program || 'Abacus Speed Arithmetic',
        data.courseName || data.program || 'Abacus Speed Arithmetic',
        data.branch || 'Tenkasi Regional Branch',
        data.address || '',
        data.city || '',
        data.district || '',
        data.pincode || '',
        data.feePaymentType || 'Paid',
        data.feeAmount || '₹450',
        data.paymentMode || 'UPI / QR Code',
        data.receiptRefNo || `REC-${Date.now().toString().slice(-4)}`,
        'Confirmed',
        data.enrolmentDate || new Date().toISOString().split('T')[0]
      ]);

      return res.status(201).json({ success: true, student: result.rows[0] });
    }

    return res.status(201).json({
      success: true,
      student: { ...data, userId, registerNumber: regNo }
    });
  } catch (error) {
    console.error('[Students POST Error]:', error);
    res.status(500).json({ success: false, message: error.message || 'Error creating student.' });
  }
});

/**
 * DELETE /api/students/:id
 * Deletes student record by id or userId
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (db.isDbConnected()) {
      if (/^\d+$/.test(id)) {
        await db.query('DELETE FROM students WHERE id = $1', [parseInt(id, 10)]);
      } else {
        await db.query('DELETE FROM students WHERE LOWER(user_id) = LOWER($1)', [id]);
        await db.query('DELETE FROM users WHERE LOWER(user_id) = LOWER($1)', [id]);
      }
    }

    return res.json({ success: true, message: `Student ${id} removed.` });
  } catch (error) {
    console.error('[Students DELETE Error]:', error);
    res.status(500).json({ success: false, message: 'Error deleting student.' });
  }
});

export default router;
