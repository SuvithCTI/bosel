import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../config/db.js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load server/.env as well as root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

export async function initializeDatabase() {
  const isConnected = await db.testConnection();
  if (!isConnected) {
    console.warn('[Neon DB Init] Skipping DB initialization: database not connected.');
    return false;
  }

  try {
    console.log('[Neon DB Init] Executing schema.sql to ensure all tables exist...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    await db.query(schemaSql);
    console.log('[Neon DB Init] Schema verified/created successfully.');

    // Seed default administrative users if users table is empty
    const usersCount = await db.query('SELECT COUNT(*) as count FROM users');
    if (parseInt(usersCount.rows[0].count, 10) === 0) {
      console.log('[Neon DB Init] Seeding default admin & branch accounts...');
      await db.query(`
        INSERT INTO users (user_id, password, student_name, name, parent_name, email, phone, grade, program, institution, address, role, branch, enrolment_date)
        VALUES 
        ('admin', 'admin123', 'B★SEL Super Administrator', 'B★SEL Super Administrator', 'Governing Council', 'admin@besellearning.org', '98400 12345', 'Administrator', 'All Programs & Operations', 'National Secretariat, Chennai', 'B★SEL Central Bhavan, Gandhi Salai, Chennai - 600017', 'Super Admin', 'Headquarters (All Branches)', '01 Jan 2026'),
        ('branch.tenkasi', 'branch123', 'Mrs. Thangam Sivaji', 'Mrs. Thangam Sivaji', 'Tenkasi Branch Administration', 'tenkasi@besellearning.org', '98652 19131', 'Centre Director', 'Branch Operations & Training', 'B★SEL Tenkasi Regional Academy', 'Second Street, Surandai, Keelasurandai, Tenkasi - 627859', 'Branch Head', 'Tenkasi Regional Branch', '01 Feb 2026'),
        ('branch.chennai', 'branch123', 'Mrs. K. Malathi', 'Mrs. K. Malathi', 'Chennai Branch Administration', 'chennai@besellearning.org', '98400 12345', 'Centre Director', 'Branch Operations & Training', 'Vidya Mandir Senior Secondary School, Chennai', 'T. Nagar, Chennai - 600017', 'Branch Head', 'Chennai Central Branch', '01 Feb 2026'),
        ('branch.coimbatore', 'branch123', 'Mrs. Lakshmi Priya', 'Mrs. Lakshmi Priya', 'Coimbatore Branch Administration', 'coimbatore@besellearning.org', '94433 22110', 'Centre Director', 'Branch Operations & Training', 'Bharatiya Vidya Bhavan Matriculation', 'RS Puram, Coimbatore - 641002', 'Branch Head', 'Coimbatore Branch', '01 Feb 2026')
      `);
      console.log('[Neon DB Init] Default admin accounts seeded.');
    }

    // Seed default partner schools if empty
    const schoolsCount = await db.query('SELECT COUNT(*) as count FROM schools');
    if (parseInt(schoolsCount.rows[0].count, 10) === 0) {
      console.log('[Neon DB Init] Seeding default partner schools...');
      await db.query(`
        INSERT INTO schools (code, name, branch_name, city, principal, coordinator, phone, students_count, status)
        VALUES
        ('BSEL-CTR-101', 'Vidya Mandir Senior Secondary School', 'Chennai Central Branch', 'Chennai, Tamil Nadu', 'Dr. S. Ranganathan', 'Mrs. K. Malathi', '+91 98400 12345', 240, 'Active Partner'),
        ('BSEL-CTR-102', 'B★SEL Tenkasi Regional Academy', 'Tenkasi Regional Branch', 'Surandai, Tenkasi, Tamil Nadu', 'Mrs. Thangam Sivaji', 'Mr. S. Sivakumar', '+91 98652 19131', 110, 'Authorized Franchise Branch'),
        ('BSEL-CTR-103', 'Bharatiya Vidya Bhavan Matriculation', 'Coimbatore Branch', 'RS Puram, Coimbatore, Tamil Nadu', 'Dr. M. Gurumurthy', 'Mrs. Lakshmi Priya', '+91 94433 22110', 160, 'Active Partner'),
        ('BSEL-CTR-104', 'National Public School', 'Bengaluru Branch', 'Bengaluru, Karnataka', 'Prof. Ananth Kumar', 'Mr. Pradeep Shenoy', '+91 98801 55443', 180, 'Active Partner'),
        ('BSEL-CTR-105', 'DAV Senior Secondary School', 'Mogappair Chennai Branch', 'Mogappair, Chennai', 'Mrs. V. Meenakshi', 'Mr. R. Sundaram', '+91 98412 87654', 195, 'Active Partner')
      `);
    }

    return true;
  } catch (err) {
    console.error('[Neon DB Init] Error during database initialization:', err);
    return false;
  }
}

// Allow direct CLI execution: node db/init.js
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initializeDatabase().then(() => {
    console.log('[Neon DB Init] Execution completed.');
    process.exit(0);
  });
}

export default initializeDatabase;
