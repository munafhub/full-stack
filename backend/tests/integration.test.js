import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app.js';

describe('Happy path integration test', () => {
  it('registers -> logs in -> creates -> reads -> updates -> deletes a task', async () => {
    const email = `e2e-${Date.now()}@example.com`;
    const password = 'secret123';

    const register = await request(app).post('/api/auth/register').send({
      name: 'E2E User', email, password,
    });
    expect(register.status).toBe(201);

    const login = await request(app).post('/api/auth/login').send({ email, password });
    expect(login.status).toBe(200);
    const token = login.body.token;

    const create = await request(app).post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'End-to-end task', description: 'Happy path' });
    expect(create.status).toBe(201);

    const read = await request(app).get('/api/tasks').set('Authorization', `Bearer ${token}`);
    expect(read.status).toBe(200);
    expect(read.body[0].title).toBe('End-to-end task');

    const update = await request(app).put(`/api/tasks/${create.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ completed: true });
    expect(update.status).toBe(200);
    expect(update.body.completed).toBe(true);

    const remove = await request(app).delete(`/api/tasks/${create.body.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(remove.status).toBe(204);
  });
});
