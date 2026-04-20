/**
 * MindCheck API Service
 * =====================
 * All backend calls go through this file.
 * Set REACT_APP_API_URL in your .env file to point to your backend.
 *
 * Example .env:
 *   REACT_APP_API_URL=http://localhost:5000/api
 */

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ── Helpers ─────────────────────────────────────────────────────────────────

async function request(path, options = {}) {
  const token = localStorage.getItem('mindcheck_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || 'API error');
  }

  // 204 No Content
  if (res.status === 204) return null;
  return res.json();
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export const authService = {
  /**
   * POST /auth/register
   * Body: { username, email, password }
   * Returns: { token, user }
   */
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  /**
   * POST /auth/login
   * Body: { email, password }
   * Returns: { token, user }
   */
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  /**
   * POST /auth/logout
   */
  logout: () => request('/auth/logout', { method: 'POST' }),

  /**
   * GET /auth/me
   * Returns: { user }
   */
  me: () => request('/auth/me'),
};

// ── Mood Entries ──────────────────────────────────────────────────────────────

export const entriesService = {
  /**
   * GET /entries
   * Query params: { start_date?, end_date?, limit? }
   * Returns: Entry[]
   *
   * Entry shape:
   * {
   *   id: string,
   *   user_id: string,
   *   mood: 1 | 2 | 3 | 4 | 5,         // 1=Terrible … 5=Great
   *   mood_label: string,                // e.g. "Great"
   *   note: string | null,
   *   tags: string[],
   *   created_at: ISO string,
   *   updated_at: ISO string,
   * }
   */
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/entries${qs ? `?${qs}` : ''}`);
  },

  /**
   * GET /entries/:id
   * Returns: Entry
   */
  getById: (id) => request(`/entries/${id}`),

  /**
   * POST /entries
   * Body: { mood, note?, tags? }
   * Returns: Entry
   */
  create: (data) => request('/entries', { method: 'POST', body: JSON.stringify(data) }),

  /**
   * PUT /entries/:id
   * Body: { mood?, note?, tags? }
   * Returns: Entry
   */
  update: (id, data) => request(`/entries/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  /**
   * DELETE /entries/:id
   * Returns: null
   */
  delete: (id) => request(`/entries/${id}`, { method: 'DELETE' }),

  /**
   * GET /entries/today
   * Returns: Entry | null  (today's entry if it exists)
   */
  getToday: () => request('/entries/today'),
};

// ── Trends / Analytics ────────────────────────────────────────────────────────

export const trendsService = {
  /**
   * GET /trends/weekly
   * Returns weekly mood summary:
   * { week_start, week_end, avg_mood, entries: Entry[], mood_distribution: { [1-5]: count } }
   */
  getWeekly: () => request('/trends/weekly'),

  /**
   * GET /trends/monthly
   * Returns: { month, avg_mood, entries: Entry[], mood_distribution: {...} }
   */
  getMonthly: () => request('/trends/monthly'),

  /**
   * GET /trends/streak
   * Returns: { current_streak: number, longest_streak: number }
   */
  getStreak: () => request('/trends/streak'),
};

// ── Prompts / Encouragement ───────────────────────────────────────────────────

export const promptsService = {
  /**
   * GET /prompts/daily
   * Returns: { prompt: string, category: string }
   */
  getDaily: () => request('/prompts/daily'),

  /**
   * GET /prompts/random
   * Returns: { prompt: string, category: string }
   */
  getRandom: () => request('/prompts/random'),
};

// ── User Settings ─────────────────────────────────────────────────────────────

export const settingsService = {
  /**
   * GET /settings
   * Returns: { reminder_time?, reminder_enabled, timezone, ... }
   */
  get: () => request('/settings'),

  /**
   * PUT /settings
   * Body: Partial settings object
   * Returns: Updated settings
   */
  update: (data) => request('/settings', { method: 'PUT', body: JSON.stringify(data) }),
};
