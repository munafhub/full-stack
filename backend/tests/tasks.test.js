import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app.js';

async function registerUser(overrides = {}) {
  const user = {
    name: 'Ali Khan',
    email: `ali-${Date.now()}-${Math.random()}@example.com`,
    password: 'secret123',
    ...overrides,
  };

  const response = await request(app).post('/api/auth/register').send(user);
  return { ...response.body, password: user.password };
}

async function loginUser(email, password) {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email, password });
  return response.body.token;
}

describe('Tasks REST API with JWT authentication', () => {
  it('registers a user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Ali Khan',
        email: 'register@example.com',
        password: 'secret123',
      });

    expect(response.status).toBe(201);
    expect(response.body.email).toBe('register@example.com');
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).not.toHaveProperty('passwordHash');
  });

  it('logs in and returns a JWT', async () => {
    await registerUser({ email: 'login@example.com' });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@example.com', password: 'secret123' });

    expect(response.status).toBe(200);
    expect(response.body.token).toEqual(expect.any(String));
  });

  it('rejects an invalid login', async () => {
    await registerUser({ email: 'wrong-password@example.com' });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'wrong-password@example.com', password: 'wrong123' });

    expect(response.status).toBe(401);
  });

  it('protects task routes when no JWT is provided', async () => {
    const response = await request(app).get('/api/tasks');
    expect(response.status).toBe(401);
  });

  it('creates a task linked to the authenticated user', async () => {
    const user = await registerUser({ email: 'task@example.com' });
    const token = await loginUser(user.email, user.password);

    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Learn REST APIs', userId: user.id });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Learn REST APIs');
    expect(response.body.User.id).toBe(user.id);
  });

  it('rejects invalid task input with 400', async () => {
    const user = await registerUser({ email: 'validation@example.com' });
    const token = await loginUser(user.email, user.password);

    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '', userId: 'not-a-number' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation failed');
  });

  it('returns 404 when a task does not exist', async () => {
    const user = await registerUser({ email: 'not-found@example.com' });
    const token = await loginUser(user.email, user.password);

    const response = await request(app)
      .get('/api/tasks/999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it('updates a task', async () => {
    const user = await registerUser({ email: 'update@example.com' });
    const token = await loginUser(user.email, user.password);
    const created = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Old title', userId: user.id });

    const response = await request(app)
      .put(`/api/tasks/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New title', completed: true });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('New title');
    expect(response.body.completed).toBe(true);
  });

  it('deletes a task with 204', async () => {
    const user = await registerUser({ email: 'delete@example.com' });
    const token = await loginUser(user.email, user.password);
    const created = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Delete me', userId: user.id });

    const response = await request(app)
      .delete(`/api/tasks/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(204);

    const getResponse = await request(app)
      .get(`/api/tasks/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(getResponse.status).toBe(404);
  });
});
