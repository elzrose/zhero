import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'zhero.db');
export const db = new DatabaseSync(dbPath);

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON;');

// Initialize Tables
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('student', 'tuition-centre', 'admin')),
      institution_id TEXT,
      batch_id TEXT,
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login_at DATETIME
    );

    CREATE TABLE IF NOT EXISTS institutions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      plan TEXT NOT NULL DEFAULT 'Growth (100 Seats)',
      allocated_seats INTEGER NOT NULL DEFAULT 100,
      used_seats INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'Approved' CHECK(status IN ('Approved', 'Pending Review', 'Suspended')),
      email TEXT,
      phone TEXT,
      joined_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS batches (
      id TEXT PRIMARY KEY,
      institution_id TEXT NOT NULL,
      name TEXT NOT NULL,
      program TEXT NOT NULL,
      start_date TEXT,
      total_seats INTEGER NOT NULL DEFAULT 50,
      enrolled_count INTEGER NOT NULL DEFAULT 0,
      avg_readiness INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE,
      institution_id TEXT NOT NULL,
      batch_id TEXT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      target_career TEXT DEFAULT 'Full Stack Engineer',
      assessment_status TEXT DEFAULT 'Not Started' CHECK(assessment_status IN ('Not Started', 'In Progress', 'Completed')),
      readiness_score INTEGER DEFAULT 0,
      assessment_results TEXT,
      active_roadmap TEXT,
      saved_careers TEXT,
      attendance_rate INTEGER DEFAULT 90,
      last_active_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE,
      FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE SET NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      institution_id TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      duration TEXT NOT NULL,
      price TEXT NOT NULL,
      seats INTEGER DEFAULT 60,
      enrolled_count INTEGER DEFAULT 0,
      rating REAL DEFAULT 4.8,
      status TEXT DEFAULT 'Active' CHECK(status IN ('Active', 'Upcoming', 'Archived')),
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS bounties (
      id TEXT PRIMARY KEY,
      company_name TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      reward TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      deadline TEXT NOT NULL,
      applicants_count INTEGER DEFAULT 0,
      status TEXT DEFAULT 'Active' CHECK(status IN ('Active', 'Review Pending', 'Closed', 'Verified')),
      verification_status TEXT DEFAULT 'Verified Partner',
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS study_rooms (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      topic TEXT NOT NULL,
      active_users INTEGER DEFAULT 1,
      max_users INTEGER DEFAULT 25,
      created_by TEXT,
      messages TEXT,
      shared_tasks TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ai_logs (
      id TEXT PRIMARY KEY,
      student_id TEXT,
      student_name TEXT,
      interaction_type TEXT NOT NULL,
      prompt_tokens INTEGER DEFAULT 0,
      completion_tokens INTEGER DEFAULT 0,
      latency_ms INTEGER DEFAULT 0,
      model TEXT DEFAULT 'gemini-2.5-flash',
      evaluation_outcome TEXT,
      confidence_score REAL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      user_name TEXT,
      role TEXT,
      action TEXT NOT NULL,
      target TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      details TEXT
    );
  `);

  seedDefaultData();
}

import { hashPassword } from './auth.js';

function seedDefaultData() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount > 0) return; // already seeded

  console.log('[ZHERO DB] Seeding initial database records...');

  // 1. Seed Institutions
  const insertInst = db.prepare(`
    INSERT INTO institutions (id, name, location, plan, allocated_seats, used_seats, status, email, phone, joined_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertInst.run('INST-01', 'Apex Career Academy', 'Kochi, KL', 'Enterprise (200 Seats)', 200, 148, 'Approved', 'admin@apex.edu', '+91 484 2345678', '12 Oct 2026');
  insertInst.run('INST-02', 'Horizon STEM Institute', 'Trivandrum, KL', 'Growth (100 Seats)', 100, 35, 'Pending Review', 'contact@horizonstem.in', '+91 471 8765432', '15 Oct 2026');
  insertInst.run('INST-03', 'FutureMinds Coaching', 'Calicut, KL', 'Starter (50 Seats)', 50, 12, 'Pending Review', 'hello@futureminds.org', '+91 495 5432109', '16 Oct 2026');
  insertInst.run('INST-04', 'Vanguard Tech Learning', 'Ernakulam, KL', 'Enterprise (250 Seats)', 250, 195, 'Approved', 'info@vanguardtech.ac.in', '+91 484 9876543', '08 Oct 2026');

  // 2. Seed Batches
  const insertBatch = db.prepare(`
    INSERT INTO batches (id, institution_id, name, program, start_date, total_seats, enrolled_count, avg_readiness)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertBatch.run('BATCH-01', 'INST-01', '2026 Batch A', 'Full Stack & Cloud Architecture', '2026-08-01', 60, 48, 76);
  insertBatch.run('BATCH-02', 'INST-01', '2026 Batch B', 'Data Science & Machine Learning', '2026-08-15', 50, 42, 81);
  insertBatch.run('BATCH-03', 'INST-01', '2027 Foundation', 'Core CS & Software Engineering', '2026-09-01', 50, 38, 62);
  insertBatch.run('BATCH-04', 'INST-01', 'Weekend Upskilling', 'DevOps & Distributed Systems', '2026-09-10', 40, 20, 79);

  // 3. Seed Users
  const studentPw = hashPassword('Student@123');
  const tuitionPw = hashPassword('Tuition@123');
  const adminPw = hashPassword('Admin@123');

  const insertUser = db.prepare(`
    INSERT INTO users (id, email, name, password_salt, password_hash, role, institution_id, batch_id, avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run('USR-STU-01', 'student@zhero.app', 'Ananya Sharma', studentPw.salt, studentPw.hash, 'student', 'INST-01', 'BATCH-01', 'AS');
  insertUser.run('USR-STU-02', 'ananya.sharma@campus.edu', 'Ananya Sharma', studentPw.salt, studentPw.hash, 'student', 'INST-01', 'BATCH-01', 'AS');
  insertUser.run('USR-STU-03', 'rohit.menon@campus.edu', 'Rohit Menon', studentPw.salt, studentPw.hash, 'student', 'INST-01', 'BATCH-02', 'RM');
  insertUser.run('USR-STU-04', 'meera.joseph@campus.edu', 'Meera Joseph', studentPw.salt, studentPw.hash, 'student', 'INST-01', 'BATCH-01', 'MJ');
  insertUser.run('USR-STU-05', 'arjun.nair@campus.edu', 'Arjun Nair', studentPw.salt, studentPw.hash, 'student', 'INST-01', 'BATCH-03', 'AN');
  insertUser.run('USR-STU-06', 'sneha.patel@campus.edu', 'Sneha Patel', studentPw.salt, studentPw.hash, 'student', 'INST-01', 'BATCH-02', 'SP');

  insertUser.run('USR-TC-01', 'tuition@zhero.app', 'Apex Academy Admin', tuitionPw.salt, tuitionPw.hash, 'tuition-centre', 'INST-01', null, 'AA');
  insertUser.run('USR-TC-02', 'admin@apex.edu', 'Apex Academy Admin', tuitionPw.salt, tuitionPw.hash, 'tuition-centre', 'INST-01', null, 'AA');

  insertUser.run('USR-ADM-01', 'admin@zhero.app', 'Platform Administrator', adminPw.salt, adminPw.hash, 'admin', null, null, 'AD');

  // 4. Seed Students
  const insertStudent = db.prepare(`
    INSERT INTO students (id, user_id, institution_id, batch_id, name, email, target_career, assessment_status, readiness_score, assessment_results, active_roadmap, saved_careers, attendance_rate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertStudent.run(
    'STU-101', 'USR-STU-01', 'INST-01', 'BATCH-01', 'Ananya Sharma', 'student@zhero.app',
    'Full Stack Engineer', 'In Progress', 72,
    JSON.stringify({ primaryCareer: 'Full Stack Engineer', secondaryCareers: ['Cloud Solutions Architect', 'Frontend Engineer'], overallScore: 78 }),
    JSON.stringify({ careerId: 'full-stack-engineer', completedCount: 5, totalCount: 16 }),
    JSON.stringify(['full-stack-engineer', 'cloud-solutions']),
    95
  );

  insertStudent.run(
    'STU-102', 'USR-STU-03', 'INST-01', 'BATCH-02', 'Rohit Menon', 'rohit.menon@campus.edu',
    'Data Analyst', 'Completed', 86,
    JSON.stringify({ primaryCareer: 'Data Analyst', secondaryCareers: ['Business Intelligence Lead'], overallScore: 86 }),
    JSON.stringify({ careerId: 'data-analyst', completedCount: 14, totalCount: 16 }),
    JSON.stringify(['data-analyst']),
    92
  );

  insertStudent.run(
    'STU-103', 'USR-STU-04', 'INST-01', 'BATCH-01', 'Meera Joseph', 'meera.joseph@campus.edu',
    'AI / ML Specialist', 'Completed', 91,
    JSON.stringify({ primaryCareer: 'AI / ML Specialist', secondaryCareers: ['Data Scientist'], overallScore: 91 }),
    JSON.stringify({ careerId: 'ai-ml-specialist', completedCount: 15, totalCount: 16 }),
    JSON.stringify(['ai-ml-specialist']),
    98
  );

  insertStudent.run(
    'STU-104', 'USR-STU-05', 'INST-01', 'BATCH-03', 'Arjun Nair', 'arjun.nair@campus.edu',
    'Embedded Systems', 'Not Started', 0,
    null, null, JSON.stringify([]),
    84
  );

  insertStudent.run(
    'STU-105', 'USR-STU-06', 'INST-01', 'BATCH-02', 'Sneha Patel', 'sneha.patel@campus.edu',
    'Cloud Solutions', 'In Progress', 64,
    JSON.stringify({ primaryCareer: 'Cloud Solutions', secondaryCareers: ['DevOps Engineer'], overallScore: 64 }),
    JSON.stringify({ careerId: 'cloud-solutions', completedCount: 4, totalCount: 16 }),
    JSON.stringify(['cloud-solutions']),
    88
  );

  // 5. Seed Courses
  const insertCourse = db.prepare(`
    INSERT INTO courses (id, institution_id, title, category, duration, price, seats, enrolled_count, rating, status, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertCourse.run('CRS-01', 'INST-01', 'Full Stack Web Architecture', 'Software Engineering', '12 Weeks', '₹14,999', 60, 48, 4.9, 'Active', 'Master React 19, Node.js microservices, Docker containers, and modern CI/CD deployment pipelines.');
  insertCourse.run('CRS-02', 'INST-01', 'Applied Machine Learning & GenAI', 'AI & Data Science', '16 Weeks', '₹18,500', 50, 42, 4.8, 'Active', 'Hands-on neural networks, transformer architectures, vector embeddings, and real-world Gemini API integration.');
  insertCourse.run('CRS-03', 'INST-01', 'Cloud Solutions & DevOps Engineering', 'Cloud Infrastructure', '10 Weeks', '₹12,000', 40, 28, 4.7, 'Active', 'Architect fault-tolerant microservices across AWS, Kubernetes, Terraform, and automated GitOps workflows.');
  insertCourse.run('CRS-04', 'INST-01', 'Data Engineering Foundations', 'Data Architecture', '8 Weeks', '₹9,500', 40, 15, 4.6, 'Upcoming', 'Design resilient ETL pipelines using Apache Spark, Kafka streaming, and modern data warehouse schemas.');

  // 6. Seed Bounties
  const insertBounty = db.prepare(`
    INSERT INTO bounties (id, company_name, title, category, reward, difficulty, deadline, applicants_count, status, verification_status, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertBounty.run('BNT-01', 'Razorpay', 'Payment Webhook Idempotency Middleware', 'Backend Engineering', '₹35,000', 'Intermediate', '2026-12-15', 18, 'Active', 'Verified Partner', 'Implement zero-duplicate webhook event consumption with Redis distributed locks.');
  insertBounty.run('BNT-02', 'Freshworks', 'Interactive Multi-tenant Analytics Dashboard', 'Frontend / React', '₹28,000', 'Intermediate', '2026-12-20', 24, 'Active', 'Verified Partner', 'Build real-time metric visualization widgets with accessibility standards.');
  insertBounty.run('BNT-03', 'Postman', 'OpenAPI Schema Drift Detector CLI', 'Developer Tooling', '₹45,000', 'Advanced', '2026-12-30', 12, 'Active', 'Verified Partner', 'Construct a high-performance CLI detecting breaking changes in API specifications.');
  insertBounty.run('BNT-04', 'ZHERO Lab', 'Offline Spaced-Repetition Algorithm Module', 'Practice Challenge', '500 XP', 'Beginner', '2027-01-01', 86, 'Active', 'Verified Partner', 'Implement SM-2 memory retrieval formulas in client-side TypeScript.');

  // 7. Seed Study Rooms
  const insertRoom = db.prepare(`
    INSERT INTO study_rooms (id, name, topic, active_users, max_users, created_by, messages, shared_tasks)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertRoom.run('ROOM-01', 'Full Stack Sprint Lab', 'React 19 & Backend Architecture', 6, 25, 'Ananya Sharma', JSON.stringify([
    { id: 1, sender: 'Ananya Sharma', text: 'Working on phase 2 mastery gate today!', time: '10:15 AM' },
    { id: 2, sender: 'Rohit Menon', text: 'Let me know if you need help with the database schema.', time: '10:22 AM' }
  ]), JSON.stringify(['Implement DB connection', 'Pass verbal checkpoint', 'Review PR']));

  insertRoom.run('ROOM-02', 'Data Structures & Algorithms', 'Tree Traversal & Dynamic Programming', 4, 20, 'Rohit Menon', JSON.stringify([]), JSON.stringify(['Binary tree maximum path sum', 'LRU cache implementation']));
  insertRoom.run('ROOM-03', 'AI System Design Lounge', 'LLM Agent Orchestration & RAG', 8, 30, 'Meera Joseph', JSON.stringify([]), JSON.stringify(['Build vector index', 'Benchmark latency']));

  // 8. Seed AI Observability Logs
  const insertAiLog = db.prepare(`
    INSERT INTO ai_logs (id, student_id, student_name, interaction_type, prompt_tokens, completion_tokens, latency_ms, model, evaluation_outcome, confidence_score)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertAiLog.run('AI-LOG-01', 'STU-101', 'Ananya Sharma', 'Stage 2 Assessment', 480, 210, 840, 'gemini-2.5-flash', 'Pass', 0.94);
  insertAiLog.run('AI-LOG-02', 'STU-101', 'Ananya Sharma', 'Verbal Checkpoint', 320, 150, 620, 'gemini-2.5-flash', 'Pass with Distinction', 0.98);
  insertAiLog.run('AI-LOG-03', 'STU-103', 'Meera Joseph', 'Live AI Interview', 1250, 540, 1420, 'gemini-2.5-flash', 'Pass with Distinction', 0.96);
  insertAiLog.run('AI-LOG-04', 'STU-105', 'Sneha Patel', 'Stage 2 Assessment', 510, 180, 910, 'gemini-2.5-flash', 'Pass', 0.89);

  // 9. Seed Audit Logs
  const insertAudit = db.prepare(`
    INSERT INTO audit_logs (id, user_id, user_name, role, action, target, details)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertAudit.run('AUD-01', 'USR-ADM-01', 'Platform Administrator', 'admin', 'INSTITUTION_APPROVED', 'Apex Career Academy', 'Verified license for 200 seats.');
  insertAudit.run('AUD-02', 'USR-TC-01', 'Apex Academy Admin', 'tuition-centre', 'BATCH_CREATED', '2026 Batch A', 'Allocated 60 seats.');
  insertAudit.run('AUD-03', 'USR-STU-01', 'Ananya Sharma', 'student', 'ASSESSMENT_COMPLETED', 'Full Stack Assessment', 'Score: 78%. Target Career: Full Stack Engineer.');

  console.log('[ZHERO DB] Seeding completed successfully.');
}
