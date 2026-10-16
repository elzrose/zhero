/**
 * Centralized API Client & Backend Connection Manager
 * Intelligently switches between live backend endpoints (if configured)
 * and the local persistent simulation store.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const ApiConfig = {
  baseUrl: API_BASE_URL,
  isLiveBackendConfigured: Boolean(API_BASE_URL),
  mode: API_BASE_URL ? 'LIVE_BACKEND' : 'MOCK_PERSISTENT_STORE',
};

export async function apiRequest(endpoint, options = {}) {
  if (!ApiConfig.isLiveBackendConfigured) {
    // Graceful indicator when running in hackathon local mode
    return null;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const session = localStorage.getItem('zhero_admin_session_v1');
  const token = session ? JSON.parse(session).token : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      throw new Error(`API Request failed with status ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[ZHERO API Client] Failed contacting live endpoint ${url}. Falling back to storage service.`, err);
    return null;
  }
}
