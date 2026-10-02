# Week 3 Backend - Tasks API

Express + Sequelize + SQLite backend with JWT authentication, RBAC and task ownership.

## Setup

```bash
cd backend
npm install
npm run db:reset
npm run lint
npm test
npm run dev
```

API: `http://localhost:4000`

The reset command creates an admin account:

- Email: `admin@example.com`
- Password: `Admin123`

## Authentication flow

1. `POST /api/auth/register` creates a normal `user` account and hashes the password with bcryptjs.
2. `POST /api/auth/login` verifies the password and returns a JWT.
3. Protected requests use `Authorization: Bearer <token>`.
4. JWT middleware verifies the token and puts the user information in `req.user`.
5. Task CRUD is scoped to the authenticated user's own tasks.

## RBAC rule

`GET /api/users` requires the `admin` role. A normal user receives `403 Forbidden`.

## API endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/tasks` (JWT)
- `GET /api/tasks/:id` (JWT)
- `POST /api/tasks` (JWT)
- `PUT /api/tasks/:id` (JWT)
- `DELETE /api/tasks/:id` (JWT)
- `GET /api/users` (JWT + admin role)
- `GET /api/health`

## Tests

```bash
npm test
```

The test suite covers registration, login, invalid credentials, missing JWTs, protected CRUD, validation errors, 404 errors, RBAC and task ownership. `tests/integration.test.js` also checks the complete happy path.
