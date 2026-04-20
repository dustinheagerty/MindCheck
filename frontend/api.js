/**
 * MindCheck API Service
 * =====================
 * Set REACT_APP_API_URL in your .env to point to your backend.
 *   REACT_APP_API_URL=http://localhost:5000/api
 */

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('mindcheck_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    // Backend returns { error: "..." }
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || body.message || res.statusText);
  }

  if (res.status === 204) return null;
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authService = {
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login:    (data) => request('/auth/login',    { method: 'POST', body: JSON.stringify(data) }),
  logout:   ()     => request('/auth/logout',   { method: 'POST' }),
  me:       ()     => request('/auth/me'),
};

// ── Entries ───────────────────────────────────────────────────────────────────
export const entriesService = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/entries${qs ? `?${qs}` : ''}`);
  },
  getToday: ()         => request('/entries/today'),
  getById:  (id)       => request(`/entries/${id}`),
  create:   (data)     => request('/entries',       { method: 'POST',   body: JSON.stringify(data) }),
  update:   (id, data) => request(`/entries/${id}`, { method: 'PUT',    body: JSON.stringify(data) }),
  delete:   (id)       => request(`/entries/${id}`, { method: 'DELETE' }),
};

// ── Trends ────────────────────────────────────────────────────────────────────
export const trendsService = {
  getWeekly:  () => request('/trends/weekly'),
  getMonthly: () => request('/trends/monthly'),
  getStreak:  () => request('/trends/streak'),
};

// ── Prompts ───────────────────────────────────────────────────────────────────
export const promptsService = {
  getDaily:  () => request('/prompts/daily'),
  getRandom: () => request('/prompts/random'),
};

// ── Settings ──────────────────────────────────────────────────────────────────
export const settingsService = {
  get:    ()     => request('/settings'),
  update: (data) => request('/settings', { method: 'PUT', body: JSON.stringify(data) }),
};
