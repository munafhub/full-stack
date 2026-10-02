// Production backend (Railway). Override with VITE_API_URL at build time (Vercel > Environment Variables).
const DEFAULT_BACKEND = 'https://full-stack-production-eb7e.up.railway.app';

// Accepts "https://host", "https://host/" or "https://host/api" and always returns ".../api".
export function buildApiUrl(rawUrl) {
  const base = String(rawUrl || DEFAULT_BACKEND).trim().replace(/\/+$/, '');
  return base.endsWith('/api') ? base : `${base}/api`;
}

const API_URL = buildApiUrl(import.meta.env?.VITE_API_URL);

function toErrorMessage(data, status) {
  if (Array.isArray(data?.details) && data.details.length > 0) {
    return data.details.map((item) => (item.field ? `${item.field}: ${item.message}` : item.message)).join(', ');
  }
  return data?.error || `Request failed (${status})`;
}

async function request(path, options = {}) {
  const token = localStorage.getItem('jwt');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error('Cannot reach the server. Check your internet connection and that the backend is running.');
  }
  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(toErrorMessage(data, response.status));
    error.status = response.status;
    throw error;
  }
  return data;
}

export const api = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  tasks: () => request('/tasks'),
  createTask: (body) => request('/tasks', { method: 'POST', body: JSON.stringify(body) }),
  updateTask: (id, body) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
};
