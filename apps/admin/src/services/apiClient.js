/**
 * Centralized API Client & Backend Connection Manager
 * Intelligently connects to the shared ZHERO SQLite backend service
 * and provides seamless fallback to local persistent storage.
 */

const isDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const API_BASE_URL = import.meta.env.VITE_API_URL || (isDev ? 'http://localhost:5000' : '');

export const ApiConfig = {
  baseUrl: API_BASE_URL,
  isLiveBackendConfigured: Boolean(API_BASE_URL),
  mode: API_BASE_URL ? 'LIVE_SHARED_SQLITE_BACKEND' : 'MOCK_PERSISTENT_STORE',
};

export async function apiRequest(endpoint, options = {}) {
  if (!ApiConfig.isLiveBackendConfigured) {
    return null;
  }

  // Normalize endpoint alias for backend routes
  const normalizedEndpoint = endpoint
    .replace('/api/v1/auth/admin/login', '/api/auth/login')
    .replace('/api/v1/auth/login', '/api/auth/login')
    .replace('/api/v1/admin/institutions', '/api/institutions')
    .replace('/api/v1/admin/analytics', '/api/analytics')
    .replace('/api/v1/admin/audit-logs', '/api/audit-logs')
    .replace('/api/v1/admin/ai-monitoring', '/api/ai-monitoring/logs')
    .replace('/api/v1/admin/courses', '/api/courses')
    .replace('/api/v1/admin/bounties', '/api/bounties');

  const url = `${API_BASE_URL}${normalizedEndpoint}`;
  const session = localStorage.getItem('zhero_admin_session_v1');
  let token = null;
  try {
    token = session ? JSON.parse(session).token : localStorage.getItem('zhero_auth_token');
  } catch {}

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn(`[ZHERO Admin API Client] Endpoint ${url} unreachable. Using local storage fallback.`, err.message);
    return null;
  }
}
