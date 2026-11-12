# B★SEL Academy Portal

A modern, full-stack educational academy management platform built for **B★SEL Academy**. Features student enrolment, automated marksheet and certificate generation, branch administration, real-time profile editing, cloud photo storage via **Amazon S3**, and relational data persistence using **Neon Serverless PostgreSQL**.

---

## 🌟 Key Features

- **Student Portal & Interactive Profiles**:
  - Direct student login via User ID or registered 10-digit mobile number.
  - Live profile editing with instant background sync to Neon PostgreSQL.
  - In-browser AI photo segmentation, webcam snapshot capture, and auto-upload to Amazon S3.
  - View course enrolment, exam schedules, seat allotments, and results.

- **Administrative Control (Super Admin & Branch Directors)**:
  - Role-based dashboards for Headquarters and Regional Branches (Tenkasi, Chennai, Coimbatore, etc.).
  - Complete student lifecycle management: registration, course assignment, updates, and record removal.
  - Course curriculum management, batch allocation, and event scheduling.
  - Franchise enquiry management and financial receipt tracking.

- **Automated Marksheets & Certificates**:
  - High-resolution, printable student marksheet and certificate rendering with QR verification codes.
  - Accurate signature placement, tabular score calculations, and downloadable PDF export.

- **Cloud Infrastructure**:
  - **Neon PostgreSQL**: Serverless relational database for persistent storage across 9 core tables (`users`, `students`, `courses`, `events`, `franchise_leads`, `payments`, `schools`, `batches`, `certificates`).
  - **Amazon S3**: High-performance object storage for student avatars, receipts, and project assets.

---

## 🛠️ Tech Stack

- **Frontend**:
  - React 19, Vite, React Router v7
  - Tailwind CSS, Lucide React, Framer Motion
  - MediaPipe Selfie Segmentation, HTML2Canvas, JSPDF
- **Backend**:
  - Node.js, Express.js
  - Neon Serverless PostgreSQL (`pg`)
  - AWS SDK for JavaScript v3 (`@aws-sdk/client-s3`)
  - Multer for file uploads and stream handling

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Installation
Clone the repository and install dependencies for both the frontend and backend:

```bash
# Clone the repository
git clone https://github.com/your-username/besel.git
cd besel

# Install frontend and backend dependencies
npm run install:all
```

Or install each separately:

```bash
# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Environment Configuration
Create a `.env` file in the root directory or inside `backend/` based on `.env.example`:

```bash
cp .env.example .env
```

Configure your environment variables:

```ini
PORT=5000
NODE_ENV=development

# 1. Neon PostgreSQL Database Connection String
DATABASE_URL=postgresql://[user]:[password]@[endpoint-id].neon.tech/[dbname]?sslmode=require

# 2. Amazon S3 Credentials
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=ap-southeast-2
AWS_BUCKET_NAME=your_s3_bucket_name
```

> **Security Note**: Never commit actual `.env` files with secret keys to git. The `.gitignore` is pre-configured to keep your credentials safe.

### 4. Running the Application

In development mode (from the root directory):

```bash
# Terminal 1: Run the backend API server (runs on http://localhost:5000)
npm run server:dev

# Terminal 2: Run the Vite frontend (runs on http://localhost:5173)
npm run dev

# Or run both together:
npm run dev:all
```

### 5. Production Build
To create an optimized production build of the frontend:

```bash
npm run build
npm run preview
```

---

## 📂 Project Structure

```
├── all-images/              # Consolidated project images and templates
├── backend/
│   ├── config/              # Neon DB and AWS S3 client configurations
│   ├── db/
│   │   ├── init.js          # Database schema migration & initialization
│   │   └── schema.sql       # PostgreSQL database table schemas
│   ├── routes/              # Express API endpoints (auth, students, courses, upload, etc.)
│   ├── uploads/             # Local upload fallback directory
│   ├── index.js             # Express server entry point
│   ├── package.json         # Backend dependencies & npm scripts
│   └── .env                 # Backend environment configuration
├── frontend/
│   ├── public/              # Public static assets
│   ├── src/
│   │   ├── components/      # Reusable UI components & modals (student, admin, certificates)
│   │   ├── pages/           # Main page views (Home, Login, AdminDashboard, Registration)
│   │   ├── services/        # Frontend API client and HTTP services
│   │   ├── utils/           # Auth storage, session management, and helper functions
│   │   ├── App.jsx          # Application router
│   │   └── main.jsx         # React DOM entry point
│   ├── index.html           # Vite HTML entry point
│   ├── vite.config.js       # Vite configuration & API proxy
│   └── package.json         # Frontend dependencies & npm scripts
├── .env                     # Root environment configuration
├── .gitignore               # Strict gitignore protecting secrets and artifacts
├── package.json             # Root helper scripts (dev, build, server, dev:all)
└── README.md                # Project documentation
```

---

## 🔒 Security Best Practices

- All database queries utilize parameterized SQL statements to eliminate SQL injection vulnerabilities.
- Database credentials and AWS keys are managed exclusively via environment variables and excluded from source control.
- Image uploads to S3 are validated for MIME type, sanitised, and assigned unique cryptographically safe identifiers.

---

## 📄 License
Private and Confidential. All rights reserved by **B★SEL Academy**.
