import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app.js';
import { User } from '../src/models/index.js';

const register = async (email = `user-${Date.now()}-${Math.random()}@example.com`) => {
  const password = 'secret123';
  const response = await request(app).post('/api/auth/register').send({
    name: 'Test User', email, password,
  });
  return { ...response.body, email, password };
};

const login = async (email, password) => {
  const response = await request(app).post('/api/auth/login').send({ email, password });
  return response.body.token;
};

describe('Week 3 API - JWT, RBAC and CRUD', () => {
  it('registers a user with a user role and no password in response', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: 'Ali Khan', email: 'register@example.com', password: 'secret123',
    });
    expect(response.status).toBe(201);
    expect(response.body.role).toBe('user');
    expect(response.body).not.toHaveProperty('passwordHash');
  });

  it('logs in and returns a JWT', async () => {
    await register('login@example.com');
    const response = await request(app).post('/api/auth/login').send({
      email: 'login@example.com', password: 'secret123',
    });
    expect(response.status).toBe(200);
    expect(response.body.token).toEqual(expect.any(String));
  });

  it('rejects invalid credentials', async () => {
    await register('invalid@example.com');
    const response = await request(app).post('/api/auth/login').send({
      email: 'invalid@example.com', password: 'wrong123',
    });
    expect(response.status).toBe(401);
  });

  it('rejects protected routes without a JWT', async () => {
    const response = await request(app).get('/api/tasks');
    expect(response.status).toBe(401);
  });

  it('creates and reads a task for the authenticated user', async () => {
    const user = await register('crud@example.com');
    const token = await login(user.email, user.password);
    const created = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'Learn Express' });
    expect(created.status).toBe(201);
    expect(created.body.User.id).toBe(user.id);

    const list = await request(app).get('/api/tasks').set('Authorization', `Bearer ${token}`);
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
  });

  it('updates and deletes a task', async () => {
    const user = await register('update-delete@example.com');
    const token = await login(user.email, user.password);
    const created = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'Old title' });

    const updated = await request(app).put(`/api/tasks/${created.body.id}`).set('Authorization', `Bearer ${token}`).send({ title: 'New title', completed: true });
    expect(updated.status).toBe(200);
    expect(updated.body.title).toBe('New title');
    expect(updated.body.completed).toBe(true);

    const deleted = await request(app).delete(`/api/tasks/${created.body.id}`).set('Authorization', `Bearer ${token}`);
    expect(deleted.status).toBe(204);
  });

  it('returns 400 for invalid task input', async () => {
    const user = await register('validation@example.com');
    const token = await login(user.email, user.password);
    const response = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: '' });
    expect(response.status).toBe(400);
  });

  it('returns 404 for a missing task', async () => {
    const user = await register('missing@example.com');
    const token = await login(user.email, user.password);
    const response = await request(app).get('/api/tasks/9999').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(404);
  });

  it('enforces role-based authorization on the users route', async () => {
    const user = await register('normal@example.com');
    const userToken = await login(user.email, user.password);
    const forbidden = await request(app).get('/api/users').set('Authorization', `Bearer ${userToken}`);
    expect(forbidden.status).toBe(403);

    const admin = await User.findOne({ where: { email: 'admin@example.com' } });
    if (!admin) {
      await User.create({ name: 'Admin', email: 'admin@example.com', passwordHash: 'unused', role: 'admin' });
    }
    // Give the test admin a known password by creating a temporary admin through the model.
    const adminUser = await User.findOne({ where: { email: 'admin@example.com' } });
    adminUser.passwordHash = await (await import('bcryptjs')).default.hash('admin123', 10);
    adminUser.role = 'admin';
    await adminUser.save();
    const adminToken = await login('admin@example.com', 'admin123');
    const allowed = await request(app).get('/api/users').set('Authorization', `Bearer ${adminToken}`);
    expect(allowed.status).toBe(200);
  });

  it('does not allow one user to access another user\'s tasks', async () => {
    const first = await register('first@example.com');
    const firstToken = await login(first.email, first.password);
    const created = await request(app).post('/api/tasks').set('Authorization', `Bearer ${firstToken}`).send({ title: 'Private task' });

    const second = await register('second@example.com');
    const secondToken = await login(second.email, second.password);
    const response = await request(app).get(`/api/tasks/${created.body.id}`).set('Authorization', `Bearer ${secondToken}`);
    expect(response.status).toBe(404);
  });
});
