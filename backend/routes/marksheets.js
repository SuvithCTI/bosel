import express from 'express';
import db from '../config/db.js';

const router = express.Router();

/**
 * GET /api/marksheets
 * Fetches all marksheets from Neon DB
 */
router.get('/', async (req, res) => {
  try {
    if (db.isDbConnected()) {
      const result = await db.query(
        'SELECT * FROM marksheets ORDER BY updated_at DESC'
      );
      
      const marksheetsMap = {};
      const marksheetsList = result.rows.map((row) => {
        const item = {
          studentKey: row.student_key,
          studentId: row.student_id,
          registerNumber: row.register_number,
          registrationNo: row.registration_no,
          admissionNo: row.admission_no,
          studentName: row.student_name,
          branch: row.branch,
          course: row.course,
          grade: row.grade,
          subjects: typeof row.subjects === 'string' ? JSON.parse(row.subjects) : (row.subjects || []),
          totalMarks: row.total_marks !== null ? Number(row.total_marks) : null,
          totalMaximum: row.total_maximum !== null ? Number(row.total_maximum) : 500,
          percentage: row.percentage,
          overallGrade: row.overall_grade,
          status: row.status,
          lastStage: row.last_stage,
          complete: row.complete,
          data: typeof row.data === 'string' ? JSON.parse(row.data) : (row.data || {}),
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          ...(typeof row.data === 'object' && row.data ? row.data : {})
        };
        marksheetsMap[row.student_key] = item;
        return item;
      });

      return res.json({
        success: true,
        marksheets: marksheetsMap,
        list: marksheetsList
      });
    }

    return res.json({ success: true, marksheets: {}, list: [] });
  } catch (err) {
    console.error('Error fetching marksheets:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/marksheets/:key
 * Fetches a single marksheet by student key, register number, or student ID
 */
router.get('/:key', async (req, res) => {
  try {
    const rawKey = decodeURIComponent(req.params.key || '').trim().toLowerCase();
    if (!rawKey) {
      return res.status(400).json({ success: false, message: 'Invalid marksheet key' });
    }

    if (db.isDbConnected()) {
      const query = `
        SELECT * FROM marksheets
        WHERE LOWER(student_key) = $1
           OR LOWER(register_number) = $1
           OR LOWER(registration_no) = $1
           OR LOWER(student_id) = $1
        LIMIT 1
      `;
      const result = await db.query(query, [rawKey]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Marksheet not found' });
      }

      const row = result.rows[0];
      const item = {
        studentKey: row.student_key,
        studentId: row.student_id,
        registerNumber: row.register_number,
        registrationNo: row.registration_no,
        admissionNo: row.admission_no,
        studentName: row.student_name,
        branch: row.branch,
        course: row.course,
        grade: row.grade,
        subjects: typeof row.subjects === 'string' ? JSON.parse(row.subjects) : (row.subjects || []),
        totalMarks: row.total_marks !== null ? Number(row.total_marks) : null,
        totalMaximum: row.total_maximum !== null ? Number(row.total_maximum) : 500,
        percentage: row.percentage,
        overallGrade: row.overall_grade,
        status: row.status,
        lastStage: row.last_stage,
        complete: row.complete,
        data: typeof row.data === 'string' ? JSON.parse(row.data) : (row.data || {}),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        ...(typeof row.data === 'object' && row.data ? row.data : {})
      };

      return res.json({ success: true, marksheet: item });
    }

    return res.status(404).json({ success: false, message: 'DB not connected' });
  } catch (err) {
    console.error('Error fetching marksheet:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/marksheets
 * Saves or updates a marksheet in Neon DB
 */
router.post('/', async (req, res) => {
  try {
    const payload = req.body || {};
    const studentKey = String(payload.studentKey || payload.key || '').trim().toLowerCase();
    
    if (!studentKey) {
      return res.status(400).json({ success: false, message: 'studentKey is required' });
    }

    const studentId = payload.studentId || payload.userId || payload.admissionNo || payload.registerNumber || '';
    const registerNumber = payload.registerNumber || payload.registrationNo || payload.admissionNo || '';
    const registrationNo = payload.registrationNo || payload.registerNumber || '';
    const admissionNo = payload.admissionNo || '';
    const studentName = payload.studentName || payload.name || '';
    const branch = payload.branch || '';
    const course = payload.course || payload.program || payload.courseName || '';
    const grade = payload.grade || payload.level || '';
    const subjects = Array.isArray(payload.subjects) ? payload.subjects : [];
    const totalMarks = payload.totalMarks !== undefined && payload.totalMarks !== null && !isNaN(Number(payload.totalMarks))
      ? Number(payload.totalMarks)
      : null;
    const totalMaximum = payload.totalMaximum !== undefined && payload.totalMaximum !== null && !isNaN(Number(payload.totalMaximum))
      ? Number(payload.totalMaximum)
      : 500;
    const percentage = payload.percentage !== undefined && payload.percentage !== null
      ? String(payload.percentage)
      : null;
    const overallGrade = payload.overallGrade || null;
    const status = payload.status || 'Complete';
    const lastStage = payload.lastStage || 'exam';
    const complete = Boolean(payload.complete);
    const data = payload;

    if (db.isDbConnected()) {
      const query = `
        INSERT INTO marksheets (
          student_key,
          student_id,
          register_number,
          registration_no,
          admission_no,
          student_name,
          branch,
          course,
          grade,
          subjects,
          total_marks,
          total_maximum,
          percentage,
          overall_grade,
          status,
          last_stage,
          complete,
          data,
          updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, CURRENT_TIMESTAMP
        )
        ON CONFLICT (student_key) DO UPDATE SET
          student_id = EXCLUDED.student_id,
          register_number = EXCLUDED.register_number,
          registration_no = EXCLUDED.registration_no,
          admission_no = EXCLUDED.admission_no,
          student_name = EXCLUDED.student_name,
          branch = EXCLUDED.branch,
          course = EXCLUDED.course,
          grade = EXCLUDED.grade,
          subjects = EXCLUDED.subjects,
          total_marks = EXCLUDED.total_marks,
          total_maximum = EXCLUDED.total_maximum,
          percentage = EXCLUDED.percentage,
          overall_grade = EXCLUDED.overall_grade,
          status = EXCLUDED.status,
          last_stage = EXCLUDED.last_stage,
          complete = EXCLUDED.complete,
          data = EXCLUDED.data,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *
      `;

      const values = [
        studentKey,
        studentId,
        registerNumber,
        registrationNo,
        admissionNo,
        studentName,
        branch,
        course,
        grade,
        JSON.stringify(subjects),
        totalMarks,
        totalMaximum,
        percentage,
        overallGrade,
        status,
        lastStage,
        complete,
        JSON.stringify(data)
      ];

      const result = await db.query(query, values);
      return res.json({ success: true, marksheet: result.rows[0] });
    }

    return res.json({ success: true, message: 'Saved to local mode (DB disconnected)' });
  } catch (err) {
    console.error('Error saving marksheet to DB:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * DELETE /api/marksheets/:key
 * Deletes a marksheet from Neon DB
 */
router.delete('/:key', async (req, res) => {
  try {
    const rawKey = decodeURIComponent(req.params.key || '').trim().toLowerCase();
    if (!rawKey) {
      return res.status(400).json({ success: false, message: 'Key required' });
    }

    if (db.isDbConnected()) {
      await db.query(
        'DELETE FROM marksheets WHERE LOWER(student_key) = $1 OR LOWER(register_number) = $1',
        [rawKey]
      );
      return res.json({ success: true, message: 'Marksheet deleted' });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('Error deleting marksheet:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
