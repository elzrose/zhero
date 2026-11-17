/**
 * ZHERO Monorepo Unified API Client
 * Provides centralized network communications with the shared backend & SQLite database,
 * with resilient offline fallback to local browser storage.
 */

const isClient = typeof window !== 'undefined';
const isDev = isClient && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_BASE_URL = (isClient && window.__ZHERO_API_URL__) || (isDev ? 'http://localhost:5000' : '');

const TOKEN_KEY = 'zhero_auth_token';
const USER_KEY = 'zhero_current_user';

export function getStoredToken() {
  if (!isClient) return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredSession(token, user) {
  if (!isClient) return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredSession() {
  if (!isClient) return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser() {
  if (!isClient) return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getStoredToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error || `Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    // Return null on network error to allow seamless local fallback
    console.warn(`[ZHERO Shared API Client] Request to ${url} failed or server offline. Using fallback.`, err.message);
    return null;
  }
}

export const zheroApi = {
  // --- AUTHENTICATION ---
  async login(email, password) {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res && res.token) {
      setStoredSession(res.token, res.user);
    }
    return res;
  },

  async register(userData) {
    const res = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (res && res.token) {
      setStoredSession(res.token, res.user);
    }
    return res;
  },

  async getMe() {
    return await request('/api/auth/me', { method: 'GET' });
  },

  async switchRole(targetRole) {
    const res = await request('/api/auth/switch-role', {
      method: 'POST',
      body: JSON.stringify({ targetRole }),
    });
    if (res && res.token) {
      setStoredSession(res.token, res.user);
    }
    return res;
  },

  logout() {
    clearStoredSession();
  },

  // --- INSTITUTIONS ---
  async getInstitutions() {
    return await request('/api/institutions', { method: 'GET' });
  },

  async updateInstitutionStatus(id, status, plan = null) {
    return await request(`/api/institutions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, plan }),
    });
  },

  // --- BATCHES ---
  async getBatches(institutionId = 'INST-01') {
    return await request(`/api/batches?institution_id=${institutionId}`, { method: 'GET' });
  },

  async createBatch(batchData) {
    return await request('/api/batches', {
      method: 'POST',
      body: JSON.stringify(batchData),
    });
  },

  // --- STUDENTS ---
  async getStudents(institutionId = 'INST-01', batchId = '') {
    const query = batchId ? `?institution_id=${institutionId}&batch_id=${batchId}` : `?institution_id=${institutionId}`;
    return await request(`/api/students${query}`, { method: 'GET' });
  },

  async enrollStudent(studentData) {
    return await request('/api/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  },

  async updateStudent(id, updates) {
    return await request(`/api/students/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  // --- ASSESSMENTS ---
  async submitAssessment(data) {
    return await request('/api/assessments/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // --- COURSES ---
  async getCourses(institutionId = 'INST-01') {
    return await request(`/api/courses?institution_id=${institutionId}`, { method: 'GET' });
  },

  async createCourse(courseData) {
    return await request('/api/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  },

  // --- BOUNTIES ---
  async getBounties() {
    return await request('/api/bounties', { method: 'GET' });
  },

  async createBounty(bountyData) {
    return await request('/api/bounties', {
      method: 'POST',
      body: JSON.stringify(bountyData),
    });
  },

  // --- STUDY ROOMS ---
  async getStudyRooms() {
    return await request('/api/study-rooms', { method: 'GET' });
  },

  async createStudyRoom(roomData) {
    return await request('/api/study-rooms', {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
  },

  // --- AI OBSERVABILITY ---
  async getAiLogs() {
    return await request('/api/ai-monitoring/logs', { method: 'GET' });
  },

  async logAiTurn(telemetry) {
    return await request('/api/ai-monitoring/log', {
      method: 'POST',
      body: JSON.stringify(telemetry),
    });
  },

  // --- ANALYTICS ---
  async getAnalytics() {
    return await request('/api/analytics', { method: 'GET' });
  },

  // --- AUDIT LOGS ---
  async getAuditLogs() {
    return await request('/api/audit-logs', { method: 'GET' });
  },
};
