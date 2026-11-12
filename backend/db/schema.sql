-- Neon PostgreSQL Database Schema for BSEL Academy Portal

-- 1. USERS & ADMIN ACCOUNTS
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  student_name VARCHAR(150),
  name VARCHAR(150),
  parent_name VARCHAR(150),
  email VARCHAR(150),
  phone VARCHAR(50),
  grade VARCHAR(100),
  program VARCHAR(200),
  course_name VARCHAR(200),
  institution VARCHAR(200),
  branch VARCHAR(150),
  branch_code VARCHAR(50),
  address TEXT,
  role VARCHAR(50) DEFAULT 'Student',
  register_number VARCHAR(100),
  registration_no VARCHAR(100),
  enrolment_date VARCHAR(50),
  events JSONB DEFAULT '[]'::jsonb,
  results JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. STUDENTS (OFFICIAL ADMISSION RECORDS)
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) UNIQUE NOT NULL,
  register_number VARCHAR(100) UNIQUE NOT NULL,
  student_name VARCHAR(150) NOT NULL,
  parent_name VARCHAR(150),
  dob VARCHAR(50),
  age VARCHAR(20),
  gender VARCHAR(20),
  student_class VARCHAR(50),
  student_stage VARCHAR(100),
  phone VARCHAR(50) NOT NULL,
  alternate_phone VARCHAR(50),
  email VARCHAR(150),
  photo_url TEXT,
  course_name VARCHAR(200),
  program VARCHAR(200),
  grade VARCHAR(100),
  selected_courses JSONB DEFAULT '[]'::jsonb,
  branch VARCHAR(150) NOT NULL,
  institution VARCHAR(200),
  address TEXT,
  village VARCHAR(100),
  city VARCHAR(100),
  district VARCHAR(100),
  pincode VARCHAR(20),
  aadhar_number VARCHAR(50),
  fee_payment_type VARCHAR(50) DEFAULT 'Pay Now',
  fee_amount VARCHAR(50) DEFAULT '₹450',
  payment_mode VARCHAR(50) DEFAULT 'UPI / QR Code',
  receipt_ref_no VARCHAR(100),
  payment_screenshot TEXT,
  status VARCHAR(50) DEFAULT 'Confirmed',
  enrolment_date VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. COURSES MASTER
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE,
  name VARCHAR(200) NOT NULL,
  full_name VARCHAR(250),
  category VARCHAR(100),
  duration VARCHAR(100),
  fee VARCHAR(50),
  levels JSONB DEFAULT '[]'::jsonb,
  age_group VARCHAR(100),
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. EVENTS & COMPETITIONS
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(250) NOT NULL,
  category VARCHAR(100),
  date VARCHAR(100),
  venue VARCHAR(200),
  fee VARCHAR(50),
  registration_deadline VARCHAR(100),
  eligibility VARCHAR(150),
  status VARCHAR(50) DEFAULT 'Upcoming',
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. FRANCHISE ENQUIRIES / LEADS
CREATE TABLE IF NOT EXISTS franchise_leads (
  id SERIAL PRIMARY KEY,
  ref_id VARCHAR(100) UNIQUE,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  city VARCHAR(100),
  district VARCHAR(100),
  state VARCHAR(100) DEFAULT 'Tamil Nadu',
  location_type VARCHAR(100),
  investment_range VARCHAR(100),
  experience TEXT,
  status VARCHAR(50) DEFAULT 'New',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. PAYMENTS & TRANSACTIONS
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  receipt_no VARCHAR(100) UNIQUE NOT NULL,
  payer_name VARCHAR(150) NOT NULL,
  student_id VARCHAR(100),
  branch VARCHAR(150),
  sector VARCHAR(100),
  program VARCHAR(200),
  amount VARCHAR(50) NOT NULL,
  amount_num NUMERIC(10, 2),
  payment_mode VARCHAR(50),
  ref_no VARCHAR(100),
  date VARCHAR(50),
  status VARCHAR(50) DEFAULT 'Verified',
  verified_by VARCHAR(100),
  screenshot_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. PARTNER SCHOOLS & CENTRES
CREATE TABLE IF NOT EXISTS schools (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(250) NOT NULL,
  branch_name VARCHAR(150),
  city VARCHAR(100),
  principal VARCHAR(150),
  coordinator VARCHAR(150),
  phone VARCHAR(50),
  students_count INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'Active Partner',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. BRANCH BATCHES & TIMINGS
CREATE TABLE IF NOT EXISTS batches (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  branch VARCHAR(150) NOT NULL,
  program VARCHAR(200) NOT NULL,
  days VARCHAR(100),
  start_time VARCHAR(50),
  end_time VARCHAR(50),
  room VARCHAR(100),
  capacity INT DEFAULT 30,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. CERTIFICATES DESK
CREATE TABLE IF NOT EXISTS certificates (
  id SERIAL PRIMARY KEY,
  certificate_no VARCHAR(100) UNIQUE NOT NULL,
  registration_no VARCHAR(100) NOT NULL,
  student_name VARCHAR(150) NOT NULL,
  course_name VARCHAR(200) NOT NULL,
  level VARCHAR(100),
  grade VARCHAR(50) DEFAULT 'A+',
  duration VARCHAR(100) DEFAULT '6 Months',
  issue_date VARCHAR(50),
  centre_name VARCHAR(200),
  certificate_type VARCHAR(50) DEFAULT 'COURSE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_branch ON students(branch);
CREATE INDEX IF NOT EXISTS idx_payments_receipt_no ON payments(receipt_no);
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id);


