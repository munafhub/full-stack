import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { api, buildApiUrl } from '../api.js';

describe('buildApiUrl', () => {
  it('adds /api when the URL is just the backend domain', () => {
    expect(buildApiUrl('https://x.up.railway.app')).toBe('https://x.up.railway.app/api');
  });

  it('removes trailing slashes', () => {
    expect(buildApiUrl('https://x.up.railway.app/')).toBe('https://x.up.railway.app/api');
    expect(buildApiUrl('https://x.up.railway.app/api/')).toBe('https://x.up.railway.app/api');
  });

  it('does not double the /api suffix', () => {
    expect(buildApiUrl('https://x.up.railway.app/api')).toBe('https://x.up.railway.app/api');
  });

  it('falls back to the production backend when no URL is configured', () => {
    expect(buildApiUrl('')).toBe('https://full-stack-production-eb7e.up.railway.app/api');
    expect(buildApiUrl(undefined)).toBe('https://full-stack-production-eb7e.up.railway.app/api');
  });
});

describe('api requests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const jsonResponse = (status, body) => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  });

  it('calls POST /api/auth/login with a JSON body', async () => {
    fetch.mockResolvedValueOnce(jsonResponse(200, { token: 't', user: { id: 1 } }));

    const result = await api.login({ email: 'a@b.com', password: 'secret123' });

    const [url, options] = fetch.mock.calls[0];
    expect(url).toMatch(/\/api\/auth\/login$/);
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body)).toEqual({ email: 'a@b.com', password: 'secret123' });
    expect(result.token).toBe('t');
  });

  it('sends the stored JWT as a Bearer token', async () => {
    localStorage.setItem('jwt', 'my-token');
    fetch.mockResolvedValueOnce(jsonResponse(200, []));

    await api.tasks();

    expect(fetch.mock.calls[0][1].headers.Authorization).toBe('Bearer my-token');
  });

  it('returns null for 204 responses', async () => {
    fetch.mockResolvedValueOnce({ ok: true, status: 204 });
    expect(await api.deleteTask(1)).toBeNull();
  });

  it('exposes the backend error message and status', async () => {
    fetch.mockResolvedValueOnce(jsonResponse(401, { error: 'Invalid email or password' }));

    await expect(api.login({ email: 'a@b.com', password: 'bad' })).rejects.toMatchObject({
      message: 'Invalid email or password',
      status: 401,
    });
  });

  it('shows validation details returned by the backend', async () => {
    fetch.mockResolvedValueOnce(jsonResponse(400, {
      error: 'Validation failed',
      details: [{ field: 'password', message: 'Password must be at least 6 characters' }],
    }));

    await expect(api.register({ name: 'Al', email: 'a@b.com', password: '1' })).rejects.toThrow(
      'password: Password must be at least 6 characters',
    );
  });

  it('gives a friendly message when the server is unreachable', async () => {
    fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    await expect(api.tasks()).rejects.toThrow(/Cannot reach the server/);
  });
});
