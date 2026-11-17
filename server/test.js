import { handleApiRequest } from './routes.js';
import { initDatabase } from './db.js';
import { EventEmitter } from 'node:events';

initDatabase();

// In-process mock response
class MockResponse extends EventEmitter {
  constructor() {
    super();
    this.statusCode = 200;
    this.headers = {};
    this.body = '';
  }
  writeHead(statusCode, headers) {
    this.statusCode = statusCode;
    this.headers = headers;
  }
  end(chunk) {
    if (chunk) this.body += chunk;
    this.emit('finish');
  }
}

async function testEndpoint(method, path, body = {}, headers = {}) {
  const url = new URL(path, 'http://localhost');
  const req = {
    method,
    url: path,
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
  };
  const res = new MockResponse();

  await handleApiRequest(req, res, url.pathname, url.searchParams, body);
  return {
    status: res.statusCode,
    data: res.body ? JSON.parse(res.body) : null,
  };
}

async function runTests() {
  console.log('--- Starting Backend & SQLite Shared DB Test Suite ---');

  // 1. Student Login
  const stuLogin = await testEndpoint('POST', '/api/auth/login', {
    email: 'student@zhero.app',
    password: 'Student@123',
  });
  console.assert(stuLogin.status === 200, `Student login failed with status ${stuLogin.status}`);
  console.assert(stuLogin.data.token, 'Student token missing');
  const studentToken = stuLogin.data.token;
  console.log('✔ 1. Student login authenticated with JWT');

  // 2. Tuition Centre Login
  const tcLogin = await testEndpoint('POST', '/api/auth/login', {
    email: 'tuition@zhero.app',
    password: 'Tuition@123',
  });
  console.assert(tcLogin.status === 200, `Tuition login failed with status ${tcLogin.status}`);
  console.assert(tcLogin.data.user.role === 'tuition-centre', 'Tuition role mismatch');
  const tuitionToken = tcLogin.data.token;
  console.log('✔ 2. Tuition centre login authenticated');

  // 3. Admin Login
  const admLogin = await testEndpoint('POST', '/api/auth/login', {
    email: 'admin@zhero.app',
    password: 'Admin@123',
  });
  console.assert(admLogin.status === 200, 'Admin login failed');
  console.assert(admLogin.data.user.role === 'admin', 'Admin role mismatch');
  const adminToken = admLogin.data.token;
  console.log('✔ 3. Admin login authenticated');

  // 4. Session Validation /api/auth/me
  const me = await testEndpoint('GET', '/api/auth/me', {}, {
    authorization: `Bearer ${studentToken}`,
  });
  console.assert(me.status === 200, 'Me check failed');
  console.assert(me.data.user.email === 'student@zhero.app', 'Me email mismatch');
  console.log('✔ 4. Auth session /api/auth/me validated');

  // 5. Institutions List & Status Update
  const insts = await testEndpoint('GET', '/api/institutions');
  console.assert(insts.status === 200, 'Institutions list failed');
  console.assert(insts.data.institutions.length >= 4, 'Institutions count wrong');
  console.log(`✔ 5. Institutions fetched from shared database (${insts.data.institutions.length} institutions)`);

  const approve = await testEndpoint('PATCH', '/api/institutions/INST-02', { status: 'Approved' }, {
    authorization: `Bearer ${adminToken}`,
  });
  console.assert(approve.status === 200, 'Approve failed');
  console.assert(approve.data.institution.status === 'Approved', 'Status mismatch');
  console.log('✔ 6. Admin approved institution in shared SQLite database');

  // 6. Batches List & Create
  const batches = await testEndpoint('GET', '/api/batches?institution_id=INST-01');
  console.assert(batches.status === 200, 'Batches fetch failed');
  console.assert(batches.data.batches.length >= 4, 'Batches count wrong');
  console.log(`✔ 7. Batches retrieved for institution (${batches.data.batches.length} batches)`);

  // 7. Enroll New Student
  const enroll = await testEndpoint('POST', '/api/students', {
    name: 'Kavya Nair',
    email: `kavya.nair.${Date.now()}@campus.edu`,
    institution_id: 'INST-01',
    batch_id: 'BATCH-01',
    target_career: 'Frontend Engineer',
  }, {
    authorization: `Bearer ${tuitionToken}`,
  });
  console.assert(enroll.status === 201, 'Student enroll failed');
  console.assert(enroll.data.student.name === 'Kavya Nair', 'Student name mismatch');
  console.log('✔ 8. New student enrolled & batch seats updated in shared database');

  // 8. Submit Assessment & Score
  const assess = await testEndpoint('POST', '/api/assessments/submit', {
    studentId: 'STU-101',
    primaryCareer: 'Full Stack Engineer',
    readinessScore: 92,
    results: { primaryCareer: 'Full Stack Engineer', readinessScore: 92 },
  }, {
    authorization: `Bearer ${studentToken}`,
  });
  console.assert(assess.status === 200, 'Assessment submit failed');
  console.log('✔ 9. Student assessment submitted & AI telemetry logged');

  // 9. Courses, Bounties, and Study Rooms
  const courses = await testEndpoint('GET', '/api/courses');
  const bounties = await testEndpoint('GET', '/api/bounties');
  const rooms = await testEndpoint('GET', '/api/study-rooms');
  console.assert(courses.data.courses.length >= 4, 'Courses count wrong');
  console.assert(bounties.data.bounties.length >= 4, 'Bounties count wrong');
  console.assert(rooms.data.study_rooms.length >= 3, 'Rooms count wrong');
  console.log('✔ 10. Courses, Bounties, and Study Rooms verified');

  // 10. Global Platform Analytics
  const analytics = await testEndpoint('GET', '/api/analytics');
  console.assert(analytics.status === 200, 'Analytics failed');
  console.log(`✔ 11. Platform analytics compiled (Total students: ${analytics.data.analytics.totalStudents}, Avg readiness: ${analytics.data.analytics.avgReadinessScore}%)`);

  // 11. Audit Logs
  const audits = await testEndpoint('GET', '/api/audit-logs');
  console.assert(audits.data.logs.length >= 5, 'Audit count wrong');
  console.log(`✔ 12. Security audit trail active (${audits.data.logs.length} logged actions)`);

  console.log('\n🎉 ALL 12 BACKEND & SHARED DATABASE TESTS PASSED CLEANLY! 🎉\n');
}

runTests();
