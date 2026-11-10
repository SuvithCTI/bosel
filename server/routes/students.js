import express from 'express';
import db from '../config/db.js';
import { uploadToS3, isCloudStorageReady } from '../config/s3.js';

const router = express.Router();

/**
 * Helper to upload base64 image strings directly to Amazon S3
 */
async function processImage(imageSource, prefix = 'student') {
  if (!imageSource || typeof imageSource !== 'string') return imageSource;
  if (!imageSource.startsWith('data:')) return imageSource;
  if (!isCloudStorageReady()) return imageSource;

  try {
    const matches = imageSource.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return imageSource;
    const mimetype = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const ext = mimetype.includes('png') ? '.png' : '.jpg';
    const uploadResult = await uploadToS3({
      buffer,
      originalname: `${prefix}_${Date.now()}${ext}`,
      mimetype
    }, 'students');
    return uploadResult.url;
  } catch (err) {
    console.warn('[S3 Auto-upload warning]:', err.message);
    return imageSource;
  }
}

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

    return res.json({ success: true, students: [], message: 'Using local storage mode.' });
  } catch (error) {
    console.error('[Students GET Error]:', error);
    res.status(500).json({ success: false, message: 'Error retrieving students.' });
  }
});

/**
 * POST /api/students
 * Creates a new student record and syncs with users table & S3
 */
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const rawDigits = (data.phone || '').replace(/\D/g, '');
    const cleanMobile = rawDigits.length >= 10 ? rawDigits.slice(-10) : '9840123456';
    const userId = data.userId || `BSEL-${cleanMobile}`;
    const regNo = data.registerNumber || data.registrationNo || `REG-${Date.now().toString().slice(-6)}`;

    // Upload base64 photos to Amazon S3 if provided
    let photoUrl = data.photoUrl || data.studentPhoto || null;
    if (photoUrl && photoUrl.startsWith('data:')) {
      photoUrl = await processImage(photoUrl, `student_${userId}`);
    }

    let screenshotUrl = data.paymentScreenshot || null;
    if (screenshotUrl && screenshotUrl.startsWith('data:')) {
      screenshotUrl = await processImage(screenshotUrl, `receipt_${userId}`);
    }

    if (db.isDbConnected()) {
      // 1. Insert into students table
      const result = await db.query(`
        INSERT INTO students (
          user_id, register_number, student_name, parent_name, dob, age, gender,
          student_class, student_stage, phone, alternate_phone, email, photo_url,
          course_name, program, branch, institution, address, village, city, district,
          pincode, aadhar_number, fee_payment_type, fee_amount, payment_mode,
          receipt_ref_no, payment_screenshot, status, enrolment_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30)
        ON CONFLICT (user_id) DO UPDATE SET
          student_name = EXCLUDED.student_name,
          parent_name = EXCLUDED.parent_name,
          phone = EXCLUDED.phone,
          email = EXCLUDED.email,
          photo_url = COALESCE(EXCLUDED.photo_url, students.photo_url),
          course_name = EXCLUDED.course_name,
          program = EXCLUDED.program,
          branch = EXCLUDED.branch,
          address = EXCLUDED.address,
          city = EXCLUDED.city,
          district = EXCLUDED.district,
          pincode = EXCLUDED.pincode
        RETURNING *
      `, [
        userId,
        regNo,
        data.studentName || data.name || 'Student',
        data.parentName || '',
        data.dob || data.dateOfBirth || '',
        data.age ? String(data.age) : '',
        data.gender || 'Male',
        data.studentClass || '',
        data.studentStage || '',
        data.phone || cleanMobile,
        data.alternatePhone || '',
        data.email || '',
        photoUrl,
        data.courseName || data.program || 'Abacus Speed Arithmetic',
        data.courseName || data.program || 'Abacus Speed Arithmetic',
        data.branch || 'Tenkasi Regional Branch',
        data.institution || data.branch || 'Tenkasi Regional Branch',
        data.address || '',
        data.village || '',
        data.city || '',
        data.district || '',
        data.pincode || '',
        data.aadharNumber || data.aadhaarNumber || '',
        data.feePaymentType || 'Paid',
        data.feeAmount || '₹450',
        data.paymentMode || 'UPI / QR Code',
        data.receiptRefNo || `REC-${Date.now().toString().slice(-4)}`,
        screenshotUrl,
        'Confirmed',
        data.enrolmentDate || new Date().toISOString().split('T')[0]
      ]);

      // 2. Also upsert into users table for login authentication
      await db.query(`
        INSERT INTO users (
          user_id, password, student_name, name, parent_name, email, phone,
          grade, program, course_name, institution, branch, address, role,
          photo_url, student_photo, register_number, registration_no, enrolment_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        ON CONFLICT (user_id) DO UPDATE SET
          student_name = EXCLUDED.student_name,
          name = EXCLUDED.name,
          parent_name = EXCLUDED.parent_name,
          email = EXCLUDED.email,
          phone = EXCLUDED.phone,
          address = EXCLUDED.address,
          photo_url = COALESCE(EXCLUDED.photo_url, users.photo_url),
          student_photo = COALESCE(EXCLUDED.student_photo, users.student_photo),
          updated_at = CURRENT_TIMESTAMP
      `, [
        userId,
        cleanMobile,
        data.studentName || data.name || 'Student',
        data.studentName || data.name || 'Student',
        data.parentName || '',
        data.email || '',
        data.phone || cleanMobile,
        data.grade || data.level || 'Level 1',
        data.courseName || data.program || 'Abacus Speed Arithmetic',
        data.courseName || data.program || 'Abacus Speed Arithmetic',
        data.institution || data.branch || 'Tenkasi Regional Branch',
        data.branch || 'Tenkasi Regional Branch',
        data.address || '',
        'Student',
        photoUrl,
        photoUrl,
        regNo,
        regNo,
        data.enrolmentDate || new Date().toISOString().split('T')[0]
      ]);

      return res.status(201).json({ success: true, student: result.rows[0] });
    }

    return res.status(201).json({
      success: true,
      student: { ...data, userId, registerNumber: regNo, photoUrl }
    });
  } catch (error) {
    console.error('[Students POST Error]:', error);
    res.status(500).json({ success: false, message: error.message || 'Error creating student.' });
  }
});

/**
 * PUT /api/students/:id
 * Updates an existing student record in Neon PostgreSQL and uploads new photo to Amazon S3
 */
const updateStudentHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Process base64 photo if present to Amazon S3
    let photoUrl = data.photoUrl || data.studentPhoto;
    if (photoUrl && typeof photoUrl === 'string' && photoUrl.startsWith('data:')) {
      photoUrl = await processImage(photoUrl, `profile_${id}`);
    }

    if (db.isDbConnected()) {
      const studentName = (data.studentName || data.name || '').trim();
      const parentName = (data.parentName || '').trim();
      const phone = (data.phone || '').trim();
      const email = (data.email || '').trim();
      const dob = data.dob || data.dateOfBirth || '';
      const age = data.age ? String(data.age) : '';
      const gender = data.gender || '';
      const studentClass = data.studentClass || '';
      const address = (data.address || '').trim();
      const village = (data.village || '').trim();
      const city = (data.city || '').trim();
      const district = (data.district || '').trim();
      const pincode = (data.pincode || data.pinCode || '').trim();
      const aadharNumber = (data.aadharNumber || data.aadhaarNumber || '').trim();
      const courseName = (data.courseName || data.program || data.course || '').trim();
      const grade = (data.grade || data.level || data.courseLevel || '').trim();
      const branch = (data.branch || data.institution || '').trim();

      // Check if student exists in students table
      const existing = await db.query(
        'SELECT * FROM students WHERE id::text = $1 OR LOWER(user_id) = LOWER($1) OR LOWER(register_number) = LOWER($1)',
        [id]
      );

      let savedStudent;
      if (existing.rows.length > 0) {
        const updateRes = await db.query(`
          UPDATE students SET
            student_name = COALESCE(NULLIF($1, ''), student_name),
            parent_name = COALESCE(NULLIF($2, ''), parent_name),
            phone = COALESCE(NULLIF($3, ''), phone),
            alternate_phone = COALESCE(NULLIF($4, ''), alternate_phone),
            email = COALESCE(NULLIF($5, ''), email),
            dob = COALESCE(NULLIF($6, ''), dob),
            age = COALESCE(NULLIF($7, ''), age),
            gender = COALESCE(NULLIF($8, ''), gender),
            student_class = COALESCE(NULLIF($9, ''), student_class),
            address = COALESCE(NULLIF($10, ''), address),
            village = COALESCE(NULLIF($11, ''), village),
            city = COALESCE(NULLIF($12, ''), city),
            district = COALESCE(NULLIF($13, ''), district),
            pincode = COALESCE(NULLIF($14, ''), pincode),
            aadhar_number = COALESCE(NULLIF($15, ''), aadhar_number),
            course_name = COALESCE(NULLIF($16, ''), course_name),
            program = COALESCE(NULLIF($16, ''), program),
            grade = COALESCE(NULLIF($17, ''), grade),
            branch = COALESCE(NULLIF($18, ''), branch),
            institution = COALESCE(NULLIF($18, ''), institution),
            photo_url = COALESCE(NULLIF($19, ''), photo_url)
          WHERE id::text = $20 OR LOWER(user_id) = LOWER($20) OR LOWER(register_number) = LOWER($20)
          RETURNING *
        `, [
          studentName, parentName, phone, data.alternatePhone || '', email,
          dob, age, gender, studentClass, address, village, city, district,
          pincode, aadharNumber, courseName, grade, branch, photoUrl || '',
          id
        ]);
        savedStudent = updateRes.rows[0];
      } else {
        // Upsert if not existing
        const rawDigits = phone.replace(/\D/g, '');
        const cleanMobile = rawDigits.length >= 10 ? rawDigits.slice(-10) : '9840123456';
        const userId = data.userId || (id.startsWith('BSEL-') ? id : `BSEL-${cleanMobile}`);
        const regNo = data.registerNumber || data.registrationNo || `REG-${Date.now().toString().slice(-6)}`;

        const insertRes = await db.query(`
          INSERT INTO students (
            user_id, register_number, student_name, parent_name, dob, age, gender,
            student_class, phone, alternate_phone, email, photo_url, course_name,
            program, grade, branch, institution, address, village, city, district,
            pincode, aadhar_number, fee_payment_type, fee_amount, status, enrolment_date
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)
          RETURNING *
        `, [
          userId, regNo, studentName || 'Student', parentName, dob, age, gender || 'Male',
          studentClass, phone || cleanMobile, data.alternatePhone || '', email, photoUrl || null,
          courseName || 'Abacus Speed Arithmetic', courseName || 'Abacus Speed Arithmetic',
          grade || 'Level 1', branch || 'Tenkasi Regional Branch', branch || 'Tenkasi Regional Branch',
          address, village, city, district, pincode, aadharNumber, data.feePaymentType || 'Paid',
          data.feeAmount || '₹450', 'Confirmed', data.enrolmentDate || new Date().toISOString().split('T')[0]
        ]);
        savedStudent = insertRes.rows[0];
      }

      // Also sync to users table in Neon so login credentials & profile remain updated
      const targetUserId = (savedStudent.user_id || id).toLowerCase();
      const existingUser = await db.query('SELECT * FROM users WHERE LOWER(user_id) = $1 OR phone = $2', [targetUserId, savedStudent.phone]);
      if (existingUser.rows.length > 0) {
        await db.query(`
          UPDATE users SET
            student_name = COALESCE(NULLIF($1, ''), student_name),
            name = COALESCE(NULLIF($1, ''), name),
            parent_name = COALESCE(NULLIF($2, ''), parent_name),
            phone = COALESCE(NULLIF($3, ''), phone),
            email = COALESCE(NULLIF($4, ''), email),
            address = COALESCE(NULLIF($5, ''), address),
            program = COALESCE(NULLIF($6, ''), program),
            course_name = COALESCE(NULLIF($6, ''), course_name),
            grade = COALESCE(NULLIF($7, ''), grade),
            branch = COALESCE(NULLIF($8, ''), branch),
            institution = COALESCE(NULLIF($8, ''), institution),
            photo_url = COALESCE(NULLIF($9, ''), photo_url),
            student_photo = COALESCE(NULLIF($9, ''), student_photo),
            updated_at = CURRENT_TIMESTAMP
          WHERE LOWER(user_id) = $10 OR phone = $3
        `, [
          studentName, parentName, phone, email, address,
          courseName, grade, branch, photoUrl || '', targetUserId
        ]);
      } else {
        await db.query(`
          INSERT INTO users (
            user_id, password, student_name, name, parent_name, email, phone,
            grade, program, course_name, institution, branch, address, role,
            photo_url, student_photo, register_number, registration_no, enrolment_date
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        `, [
          savedStudent.user_id, savedStudent.phone ? savedStudent.phone.replace(/\D/g, '').slice(-10) : '123456',
          studentName, studentName, parentName, email, phone,
          grade, courseName, courseName, branch, branch, address, 'Student',
          photoUrl || null, photoUrl || null, savedStudent.register_number, savedStudent.register_number,
          savedStudent.enrolment_date || new Date().toISOString().split('T')[0]
        ]);
      }

      return res.json({ success: true, student: savedStudent, message: 'Profile successfully updated in Neon PostgreSQL.' });
    }

    return res.json({ success: true, student: data, message: 'Updated in local fallback mode.' });
  } catch (error) {
    console.error('[Students PUT Error]:', error);
    res.status(500).json({ success: false, message: error.message || 'Error updating student profile in database.' });
  }
};

router.put('/:id', updateStudentHandler);
router.patch('/:id', updateStudentHandler);

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
