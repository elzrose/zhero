import { db } from './db.js';
import { hashPassword, verifyPassword, signToken, getAuthUser } from './auth.js';

// Helper to send JSON responses
export function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-auth-token',
  });
  res.end(JSON.stringify(data));
}

// Log audit action
export function logAudit(userId, userName, role, action, target, details = '') {
  try {
    const id = `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    db.prepare(`
      INSERT INTO audit_logs (id, user_id, user_name, role, action, target, details)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, userId, userName, role, action, target, details);
  } catch (err) {
    console.error('[Audit Log Error]', err.message);
  }
}

export async function handleApiRequest(req, res, pathname, query, body) {
  const authUser = getAuthUser(req);

  // --- 1. AUTHENTICATION ---
  if (pathname === '/api/auth/register' && req.method === 'POST') {
    const { email, password, name, role = 'student', institutionId = 'INST-01', batchId = 'BATCH-01', phone = '' } = body;
    if (!email || !password || !name) {
      return sendJson(res, 400, { error: 'Email, password, and name are required.' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (existing) {
      return sendJson(res, 409, { error: 'An account with this email already exists.' });
    }

    const { salt, hash } = hashPassword(password);
    const userId = `USR-${Date.now().toString(36).toUpperCase()}`;
    const cleanEmail = email.toLowerCase().trim();

    db.prepare(`
      INSERT INTO users (id, email, name, password_salt, password_hash, role, institution_id, batch_id, avatar)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(userId, cleanEmail, name, salt, hash, role, institutionId, batchId, name.slice(0, 2).toUpperCase());

    // If role is student, create student profile
    if (role === 'student') {
      const studentId = `STU-${Date.now().toString(36).toUpperCase()}`;
      db.prepare(`
        INSERT INTO students (id, user_id, institution_id, batch_id, name, email, target_career, assessment_status, readiness_score)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(studentId, userId, institutionId, batchId, name, cleanEmail, 'Full Stack Engineer', 'Not Started', 0);
    }

    logAudit(userId, name, role, 'REGISTER', cleanEmail, `New ${role} registered.`);

    const userRecord = db.prepare('SELECT id, email, name, role, institution_id, batch_id, avatar FROM users WHERE id = ?').get(userId);
    const token = signToken({ id: userId, email: cleanEmail, role, name });

    return sendJson(res, 201, { success: true, token, user: userRecord });
  }

  if (pathname === '/api/auth/login' && req.method === 'POST') {
    const { email, password } = body;
    if (!email || !password) {
      return sendJson(res, 400, { error: 'Email and password are required.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (!user) {
      return sendJson(res, 401, { error: 'Invalid email or password.' });
    }

    const isValid = verifyPassword(password, user.password_salt, user.password_hash);
    if (!isValid) {
      return sendJson(res, 401, { error: 'Invalid email or password.' });
    }

    // Update last login
    db.prepare('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);
    logAudit(user.id, user.name, user.role, 'LOGIN', user.email, 'User logged in successfully.');

    // Fetch linked student profile if student
    let studentProfile = null;
    if (user.role === 'student') {
      studentProfile = db.prepare('SELECT * FROM students WHERE user_id = ? OR email = ?').get(user.id, user.email);
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
    const { password_salt, password_hash, ...safeUser } = user;

    return sendJson(res, 200, { success: true, token, user: safeUser, student: studentProfile });
  }

  if (pathname === '/api/auth/me' && req.method === 'GET') {
    if (!authUser) {
      return sendJson(res, 401, { error: 'Unauthorized or token expired.' });
    }

    const user = db.prepare('SELECT id, email, name, role, institution_id, batch_id, avatar, created_at, last_login_at FROM users WHERE id = ?').get(authUser.id);
    if (!user) {
      return sendJson(res, 404, { error: 'User not found.' });
    }

    let studentProfile = null;
    let institutionProfile = null;

    if (user.role === 'student') {
      studentProfile = db.prepare('SELECT * FROM students WHERE user_id = ? OR email = ?').get(user.id, user.email);
    }
    if (user.institution_id) {
      institutionProfile = db.prepare('SELECT * FROM institutions WHERE id = ?').get(user.institution_id);
    }

    return sendJson(res, 200, { success: true, user, student: studentProfile, institution: institutionProfile });
  }

  // Demo Switch Role helper
  if (pathname === '/api/auth/switch-role' && req.method === 'POST') {
    const { targetRole = 'student' } = body;
    let user = null;
    if (targetRole === 'admin') {
      user = db.prepare("SELECT * FROM users WHERE role = 'admin' LIMIT 1").get();
    } else if (targetRole === 'tuition-centre') {
      user = db.prepare("SELECT * FROM users WHERE role = 'tuition-centre' LIMIT 1").get();
    } else {
      user = db.prepare("SELECT * FROM users WHERE role = 'student' LIMIT 1").get();
    }

    if (!user) return sendJson(res, 404, { error: 'Target role user not found.' });

    const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
    const { password_salt, password_hash, ...safeUser } = user;
    return sendJson(res, 200, { success: true, token, user: safeUser });
  }

  // --- 2. INSTITUTIONS ---
  if (pathname === '/api/institutions' && req.method === 'GET') {
    const rows = db.prepare('SELECT * FROM institutions ORDER BY created_at DESC').all();
    return sendJson(res, 200, { success: true, institutions: rows });
  }

  if (pathname === '/api/institutions' && req.method === 'POST') {
    const { name, location, plan = 'Growth (100 Seats)', allocated_seats = 100, email = '', phone = '' } = body;
    if (!name || !location) return sendJson(res, 400, { error: 'Name and location required.' });

    const id = `INST-${Date.now().toString(36).toUpperCase()}`;
    const joined_date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    db.prepare(`
      INSERT INTO institutions (id, name, location, plan, allocated_seats, used_seats, status, email, phone, joined_date)
      VALUES (?, ?, ?, ?, ?, 0, 'Approved', ?, ?, ?)
    `).run(id, name, location, plan, allocated_seats, email, phone, joined_date);

    logAudit(authUser?.id || 'SYS', authUser?.name || 'Admin', authUser?.role || 'admin', 'INSTITUTION_CREATED', name, `Allocated ${allocated_seats} seats.`);
    const created = db.prepare('SELECT * FROM institutions WHERE id = ?').get(id);
    return sendJson(res, 201, { success: true, institution: created });
  }

  if (pathname.startsWith('/api/institutions/') && req.method === 'PATCH') {
    const id = pathname.split('/')[3];
    const { status, plan, allocated_seats } = body;

    const current = db.prepare('SELECT * FROM institutions WHERE id = ?').get(id);
    if (!current) return sendJson(res, 404, { error: 'Institution not found.' });

    const newStatus = status || current.status;
    const newPlan = plan || current.plan;
    const newSeats = allocated_seats !== undefined ? allocated_seats : current.allocated_seats;

    db.prepare('UPDATE institutions SET status = ?, plan = ?, allocated_seats = ? WHERE id = ?')
      .run(newStatus, newPlan, newSeats, id);

    logAudit(authUser?.id || 'SYS', authUser?.name || 'Admin', authUser?.role || 'admin', 'INSTITUTION_UPDATED', current.name, `Status: ${newStatus}, Plan: ${newPlan}`);
    const updated = db.prepare('SELECT * FROM institutions WHERE id = ?').get(id);
    return sendJson(res, 200, { success: true, institution: updated });
  }

  // --- 3. BATCHES ---
  if (pathname === '/api/batches' && req.method === 'GET') {
    const institutionId = query.get('institution_id');
    let rows;
    if (institutionId) {
      rows = db.prepare('SELECT * FROM batches WHERE institution_id = ? ORDER BY created_at DESC').all(institutionId);
    } else {
      rows = db.prepare('SELECT * FROM batches ORDER BY created_at DESC').all();
    }
    return sendJson(res, 200, { success: true, batches: rows });
  }

  if (pathname === '/api/batches' && req.method === 'POST') {
    const { institution_id = 'INST-01', name, program, start_date = '', total_seats = 50 } = body;
    if (!name || !program) return sendJson(res, 400, { error: 'Batch name and program required.' });

    const id = `BATCH-${Date.now().toString(36).toUpperCase()}`;
    db.prepare(`
      INSERT INTO batches (id, institution_id, name, program, start_date, total_seats, enrolled_count, avg_readiness)
      VALUES (?, ?, ?, ?, ?, ?, 0, 0)
    `).run(id, institution_id, name, program, start_date, total_seats);

    logAudit(authUser?.id || 'SYS', authUser?.name || 'Tuition Admin', 'tuition-centre', 'BATCH_CREATED', name, `Batch in ${program}`);
    const batch = db.prepare('SELECT * FROM batches WHERE id = ?').get(id);
    return sendJson(res, 201, { success: true, batch });
  }

  // --- 4. STUDENTS ---
  if (pathname === '/api/students' && req.method === 'GET') {
    const institutionId = query.get('institution_id');
    const batchId = query.get('batch_id');

    let sql = 'SELECT * FROM students WHERE 1=1';
    const params = [];
    if (institutionId) {
      sql += ' AND institution_id = ?';
      params.push(institutionId);
    }
    if (batchId) {
      sql += ' AND batch_id = ?';
      params.push(batchId);
    }
    sql += ' ORDER BY last_active_at DESC';

    const rows = db.prepare(sql).all(...params);
    return sendJson(res, 200, { success: true, students: rows });
  }

  if (pathname === '/api/students' && req.method === 'POST') {
    const { name, email, institution_id = 'INST-01', batch_id = 'BATCH-01', target_career = 'Full Stack Engineer' } = body;
    if (!name || !email) return sendJson(res, 400, { error: 'Name and email are required.' });

    const cleanEmail = email.toLowerCase().trim();
    const existing = db.prepare('SELECT id FROM students WHERE email = ?').get(cleanEmail);
    if (existing) return sendJson(res, 409, { error: 'Student already enrolled with this email.' });

    const studentId = `STU-${Date.now().toString(36).toUpperCase()}`;
    db.prepare(`
      INSERT INTO students (id, institution_id, batch_id, name, email, target_career, assessment_status, readiness_score)
      VALUES (?, ?, ?, ?, ?, ?, 'Not Started', 0)
    `).run(studentId, institution_id, batch_id, name, cleanEmail, target_career);

    // Increment used_seats on institution
    db.prepare('UPDATE institutions SET used_seats = used_seats + 1 WHERE id = ?').run(institution_id);
    if (batch_id) {
      db.prepare('UPDATE batches SET enrolled_count = enrolled_count + 1 WHERE id = ?').run(batch_id);
    }

    logAudit(authUser?.id || 'SYS', authUser?.name || 'Tuition Admin', 'tuition-centre', 'STUDENT_ENROLLED', name, `Assigned to ${batch_id}`);
    const student = db.prepare('SELECT * FROM students WHERE id = ?').get(studentId);
    return sendJson(res, 201, { success: true, student });
  }

  if (pathname.startsWith('/api/students/') && req.method === 'PATCH') {
    const id = pathname.split('/')[3];
    const { target_career, assessment_status, readiness_score, assessment_results, active_roadmap, saved_careers } = body;

    const current = db.prepare('SELECT * FROM students WHERE id = ? OR user_id = ?').get(id, id);
    if (!current) return sendJson(res, 404, { error: 'Student not found.' });

    const updatedTargetCareer = target_career || current.target_career;
    const updatedStatus = assessment_status || current.assessment_status;
    const updatedReadiness = readiness_score !== undefined ? readiness_score : current.readiness_score;
    const updatedResults = assessment_results ? (typeof assessment_results === 'string' ? assessment_results : JSON.stringify(assessment_results)) : current.assessment_results;
    const updatedRoadmap = active_roadmap ? (typeof active_roadmap === 'string' ? active_roadmap : JSON.stringify(active_roadmap)) : current.active_roadmap;
    const updatedCareers = saved_careers ? (typeof saved_careers === 'string' ? saved_careers : JSON.stringify(saved_careers)) : current.saved_careers;

    db.prepare(`
      UPDATE students
      SET target_career = ?, assessment_status = ?, readiness_score = ?, assessment_results = ?, active_roadmap = ?, saved_careers = ?, last_active_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(updatedTargetCareer, updatedStatus, updatedReadiness, updatedResults, updatedRoadmap, updatedCareers, current.id);

    // Recalculate batch avg readiness
    if (current.batch_id) {
      const avgRow = db.prepare('SELECT AVG(readiness_score) as avgScore FROM students WHERE batch_id = ? AND readiness_score > 0').get(current.batch_id);
      if (avgRow && avgRow.avgScore) {
        db.prepare('UPDATE batches SET avg_readiness = ? WHERE id = ?').run(Math.round(avgRow.avgScore), current.batch_id);
      }
    }

    const updated = db.prepare('SELECT * FROM students WHERE id = ?').get(current.id);
    return sendJson(res, 200, { success: true, student: updated });
  }

  // --- 5. ASSESSMENTS ---
  if (pathname === '/api/assessments/submit' && req.method === 'POST') {
    const { studentId, email, answers, primaryCareer, readinessScore = 75, results } = body;

    let targetStudent = null;
    if (studentId) {
      targetStudent = db.prepare('SELECT * FROM students WHERE id = ? OR user_id = ?').get(studentId, studentId);
    } else if (email) {
      targetStudent = db.prepare('SELECT * FROM students WHERE email = ?').get(email.toLowerCase().trim());
    }

    if (targetStudent) {
      const resultsJson = JSON.stringify(results || { primaryCareer, readinessScore });
      db.prepare(`
        UPDATE students
        SET assessment_status = 'Completed', target_career = ?, readiness_score = ?, assessment_results = ?, last_active_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(primaryCareer || targetStudent.target_career, readinessScore, resultsJson, targetStudent.id);

      // Record AI Observability log
      const logId = `AI-LOG-${Date.now().toString(36).toUpperCase()}`;
      db.prepare(`
        INSERT INTO ai_logs (id, student_id, student_name, interaction_type, prompt_tokens, completion_tokens, latency_ms, model, evaluation_outcome, confidence_score)
        VALUES (?, ?, ?, 'Stage 2 Assessment', 520, 240, 780, 'gemini-2.5-flash', 'Pass', 0.95)
      `).run(logId, targetStudent.id, targetStudent.name);

      logAudit(targetStudent.user_id || targetStudent.id, targetStudent.name, 'student', 'ASSESSMENT_COMPLETED', primaryCareer || 'General Assessment', `Scored ${readinessScore}% readiness.`);
    }

    return sendJson(res, 200, { success: true, message: 'Assessment results saved in shared database.' });
  }

  // --- 6. COURSES ---
  if (pathname === '/api/courses' && req.method === 'GET') {
    const institutionId = query.get('institution_id');
    let rows;
    if (institutionId) {
      rows = db.prepare('SELECT * FROM courses WHERE institution_id = ? ORDER BY created_at DESC').all(institutionId);
    } else {
      rows = db.prepare('SELECT * FROM courses ORDER BY created_at DESC').all();
    }
    return sendJson(res, 200, { success: true, courses: rows });
  }

  if (pathname === '/api/courses' && req.method === 'POST') {
    const { institution_id = 'INST-01', title, category, duration, price, seats = 50, description = '' } = body;
    if (!title || !category) return sendJson(res, 400, { error: 'Title and category are required.' });

    const id = `CRS-${Date.now().toString(36).toUpperCase()}`;
    db.prepare(`
      INSERT INTO courses (id, institution_id, title, category, duration, price, seats, enrolled_count, rating, status, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0, 4.8, 'Active', ?)
    `).run(id, institution_id, title, category, duration || '8 Weeks', price || '₹9,999', seats, description);

    logAudit(authUser?.id || 'SYS', authUser?.name || 'Tuition Admin', 'tuition-centre', 'COURSE_CREATED', title, `Seats: ${seats}`);
    const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(id);
    return sendJson(res, 201, { success: true, course });
  }

  // --- 7. BOUNTIES ---
  if (pathname === '/api/bounties' && req.method === 'GET') {
    const rows = db.prepare('SELECT * FROM bounties ORDER BY created_at DESC').all();
    return sendJson(res, 200, { success: true, bounties: rows });
  }

  if (pathname === '/api/bounties' && req.method === 'POST') {
    const { company_name, title, category, reward, difficulty = 'Intermediate', deadline = '2026-12-31', description = '' } = body;
    if (!company_name || !title) return sendJson(res, 400, { error: 'Company and title required.' });

    const id = `BNT-${Date.now().toString(36).toUpperCase()}`;
    db.prepare(`
      INSERT INTO bounties (id, company_name, title, category, reward, difficulty, deadline, applicants_count, status, verification_status, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0, 'Active', 'Verified Partner', ?)
    `).run(id, company_name, title, category || 'Engineering', reward || '₹20,000', difficulty, deadline, description);

    logAudit(authUser?.id || 'SYS', authUser?.name || 'Admin', 'admin', 'BOUNTY_CREATED', title, `Company: ${company_name}`);
    const bounty = db.prepare('SELECT * FROM bounties WHERE id = ?').get(id);
    return sendJson(res, 201, { success: true, bounty });
  }

  // --- 8. STUDY ROOMS ---
  if (pathname === '/api/study-rooms' && req.method === 'GET') {
    const rows = db.prepare('SELECT * FROM study_rooms ORDER BY active_users DESC').all();
    const formatted = rows.map(r => ({
      ...r,
      messages: r.messages ? JSON.parse(r.messages) : [],
      shared_tasks: r.shared_tasks ? JSON.parse(r.shared_tasks) : [],
    }));
    return sendJson(res, 200, { success: true, study_rooms: formatted });
  }

  if (pathname === '/api/study-rooms' && req.method === 'POST') {
    const { name, topic, max_users = 25, created_by = 'Student' } = body;
    if (!name || !topic) return sendJson(res, 400, { error: 'Name and topic required.' });

    const id = `ROOM-${Date.now().toString(36).toUpperCase()}`;
    db.prepare(`
      INSERT INTO study_rooms (id, name, topic, active_users, max_users, created_by, messages, shared_tasks)
      VALUES (?, ?, ?, 1, ?, ?, '[]', '[]')
    `).run(id, name, topic, max_users, created_by);

    const room = db.prepare('SELECT * FROM study_rooms WHERE id = ?').get(id);
    return sendJson(res, 201, { success: true, study_room: room });
  }

  // --- 9. AI MONITORING & TELEMETRY ---
  if (pathname === '/api/ai-monitoring/logs' && req.method === 'GET') {
    const rows = db.prepare('SELECT * FROM ai_logs ORDER BY timestamp DESC LIMIT 50').all();
    return sendJson(res, 200, { success: true, logs: rows });
  }

  if (pathname === '/api/ai-monitoring/log' && req.method === 'POST') {
    const { student_id, student_name, interaction_type, prompt_tokens = 0, completion_tokens = 0, latency_ms = 0, model = 'gemini-2.5-flash', evaluation_outcome = 'Pass', confidence_score = 0.95 } = body;
    const id = `AI-LOG-${Date.now().toString(36).toUpperCase()}`;
    db.prepare(`
      INSERT INTO ai_logs (id, student_id, student_name, interaction_type, prompt_tokens, completion_tokens, latency_ms, model, evaluation_outcome, confidence_score)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, student_id, student_name, interaction_type, prompt_tokens, completion_tokens, latency_ms, model, evaluation_outcome, confidence_score);

    return sendJson(res, 201, { success: true, logId: id });
  }

  // --- 10. GLOBAL PLATFORM ANALYTICS ---
  if (pathname === '/api/analytics' && req.method === 'GET') {
    const totalStudents = db.prepare('SELECT COUNT(*) as count FROM students').get().count;
    const completedStudents = db.prepare("SELECT COUNT(*) as count FROM students WHERE assessment_status = 'Completed'").get().count;
    const avgReadiness = db.prepare('SELECT AVG(readiness_score) as avgScore FROM students WHERE readiness_score > 0').get().avgScore || 0;
    const totalInstitutions = db.prepare('SELECT COUNT(*) as count FROM institutions').get().count;
    const pendingInstitutions = db.prepare("SELECT COUNT(*) as count FROM institutions WHERE status = 'Pending Review'").get().count;
    const totalCourses = db.prepare('SELECT COUNT(*) as count FROM courses').get().count;
    const totalBounties = db.prepare('SELECT COUNT(*) as count FROM bounties').get().count;
    const totalAiInferences = db.prepare('SELECT COUNT(*) as count FROM ai_logs').get().count;

    const careerCounts = db.prepare(`
      SELECT target_career, COUNT(*) as count
      FROM students
      GROUP BY target_career
      ORDER BY count DESC
      LIMIT 5
    `).all();

    return sendJson(res, 200, {
      success: true,
      analytics: {
        totalStudents,
        completedStudents,
        completionRate: totalStudents > 0 ? Math.round((completedStudents / totalStudents) * 100) : 0,
        avgReadinessScore: Math.round(avgReadiness),
        totalInstitutions,
        pendingInstitutions,
        totalCourses,
        totalBounties,
        totalAiInferences,
        topCareers: careerCounts,
      }
    });
  }

  // --- 11. AUDIT LOGS ---
  if (pathname === '/api/audit-logs' && req.method === 'GET') {
    const rows = db.prepare('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 50').all();
    return sendJson(res, 200, { success: true, logs: rows });
  }

  // --- 404 Route Not Found ---
  return sendJson(res, 404, { error: `Endpoint ${pathname} not found` });
}
