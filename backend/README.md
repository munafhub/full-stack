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

API: `https://full-stack-production-eb7e.up.railway.app` (all routes work with or without the `/api` prefix)

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

## Deploying on Railway

Set these in Railway > your service > Variables:

| Variable | Value |
| --- | --- |
| `JWT_SECRET` | a long random string (required) |
| `FRONTEND_ORIGIN` | `https://full-stack-teal-seven.vercel.app` (comma separate for more than one) |
| `SQLITE_PATH` | `/data/tasks.sqlite` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | optional, creates an admin account on startup |

**Keep your data:** Railway's disk is wiped on every redeploy. Add a **Volume** to the service and mount it at `/data`
so `SQLITE_PATH=/data/tasks.sqlite` survives redeploys. Alternative: add a Railway PostgreSQL database, run
`npm install pg pg-hstore` in `backend/`, commit, and set `DATABASE_URL` (and `DATABASE_SSL=true` if needed).

Health check: `GET /api/health` -> `{"status":"ok"}`.

