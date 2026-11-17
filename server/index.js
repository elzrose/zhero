import http from 'node:http';
import { URL } from 'node:url';
import { initDatabase } from './db.js';
import { handleApiRequest, sendJson } from './routes.js';

// Initialize SQLite database and seed initial data
initDatabase();

const PORT = process.env.PORT || 5000;

const server = http.createServer(async (req, res) => {
  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-auth-token',
    });
    res.end();
    return;
  }

  // Parse URL & Query
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.searchParams;

  // Root healthcheck
  if (pathname === '/' || pathname === '/health') {
    return sendJson(res, 200, {
      status: 'online',
      service: 'ZHERO Central API & Shared Database',
      timestamp: new Date().toISOString(),
      ports: {
        api: PORT,
        student: 3001,
        tuitionCentre: 3002,
        admin: 3003,
      },
    });
  }

  // Read request body if present
  let body = {};
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const raw = Buffer.concat(buffers).toString('utf8');
      if (raw) {
        body = JSON.parse(raw);
      }
    } catch (err) {
      return sendJson(res, 400, { error: 'Invalid JSON payload in request body' });
    }
  }

  try {
    await handleApiRequest(req, res, pathname, query, body);
  } catch (err) {
    console.error('[ZHERO API Unhandled Error]', err);
    sendJson(res, 500, { error: 'Internal Server Error', message: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`
=====================================================
  🚀 ZHERO Shared Backend & SQLite DB is LIVE!
  URL: http://localhost:${PORT}
  Database: server/data/zhero.db (Persistent SQLite)
=====================================================
  Test Credentials:
  - Student:        student@zhero.app   / Student@123
  - Tuition Centre: tuition@zhero.app   / Tuition@123
  - Admin:          admin@zhero.app     / Admin@123
=====================================================
  Endpoints:
  - Auth:         /api/auth/login, /api/auth/register, /api/auth/me
  - Institutions: /api/institutions
  - Batches:      /api/batches
  - Students:     /api/students
  - Courses:      /api/courses
  - Bounties:     /api/bounties
  - Study Rooms:  /api/study-rooms
  - Analytics:    /api/analytics
  - AI Logs:      /api/ai-monitoring/logs
  - Audit:        /api/audit-logs
=====================================================
`);
});

export default server;
