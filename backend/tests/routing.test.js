import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app.js';

const VERCEL = 'https://full-stack-teal-seven.vercel.app';

describe('Deployment compatibility (routing + CORS)', () => {
  it('serves a health check at /api/health and /health', async () => {
    expect((await request(app).get('/api/health')).body).toEqual({ status: 'ok' });
    expect((await request(app).get('/health')).body).toEqual({ status: 'ok' });
  });

  it('answers on the root URL', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('works with and without the /api prefix (register + login)', async () => {
    const body = { name: 'Alias User', email: 'alias@example.com', password: 'secret123' };

    const registered = await request(app).post('/auth/register').send(body);
    expect(registered.status).toBe(201);

    const loggedIn = await request(app).post('/auth/login').send({ email: body.email, password: body.password });
    expect(loggedIn.status).toBe(200);
    expect(loggedIn.body.token).toEqual(expect.any(String));

    const viaApi = await request(app).post('/api/auth/login').send({ email: body.email, password: body.password });
    expect(viaApi.status).toBe(200);

    const tasks = await request(app).get('/tasks').set('Authorization', `Bearer ${loggedIn.body.token}`);
    expect(tasks.status).toBe(200);
  });

  it('still returns a JSON 404 for unknown routes', async () => {
    const response = await request(app).get('/api/does-not-exist');
    expect(response.status).toBe(404);
    expect(response.body.error).toContain('not found');
  });

  it('allows the deployed Vercel frontend through CORS', async () => {
    const response = await request(app).options('/api/auth/login').set('Origin', VERCEL);
    expect(response.status).toBe(204);
    expect(response.headers['access-control-allow-origin']).toBe(VERCEL);
    expect(response.headers['access-control-allow-headers']).toContain('Authorization');
  });

  it('adds CORS headers to normal responses too', async () => {
    const response = await request(app).get('/api/health').set('Origin', 'http://localhost:5173');
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173');
  });

  it('does not reflect unknown origins', async () => {
    const response = await request(app).get('/api/health').set('Origin', 'https://evil.example.com');
    expect(response.headers['access-control-allow-origin']).toBeUndefined();
  });
});
