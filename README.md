# Week 3 Full-Stack Tasks Project

This project combines the Week 1 React To-Do frontend with the Week 2 Express/Sequelize Tasks API and adds JWT authentication, role-based authorization, task ownership, API tests, and an end-to-end integration test.

## Requirements completed

- JWT authentication: register, login, password hashing, protected routes.
- Role-based authorization: `GET /api/users` is admin-only.
- Week 1 React frontend connected to the backend for full Task CRUD.
- JWT is stored by the frontend and sent as `Authorization: Bearer <token>`.
- Tasks are private to the authenticated user.
- API tests cover authentication, authorization, CRUD, validation and error paths.
- A separate happy-path integration test covers register -> login -> create -> read -> update -> delete.
- `prompts.md` documents the AI prompts used for Weeks 2 and 3.

## Project structure

```text
week3-final/
├── backend/
│   ├── src/
│   ├── tests/
│   ├── package.json
│   ├── .env.example
│   └── ...
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
├── README.md
└── prompts.md
```

## Run the backend

```bash
cd backend
npm install
npm run db:reset
npm test
npm run lint
npm run dev
```

Backend: `https://full-stack-production-eb7e.up.railway.app`

The reset command creates an admin account:

```text
Email: admin@example.com
Password: Admin123
```

## Run the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm test
npm run dev
```

Frontend: `http://localhost:5173`

## Authentication flow

1. Register a normal user with `POST /api/auth/register`.
2. Log in with `POST /api/auth/login`.
3. The API returns a JWT containing the user id, email and role.
4. The frontend stores the token and sends it with protected requests.
5. The backend verifies the JWT before allowing Task CRUD.
6. Task routes only return tasks belonging to the authenticated user.
7. `GET /api/users` additionally requires the `admin` role.

## Useful verification

In the browser DevTools Network tab, inspect a Task request and check for:

```text
Authorization: Bearer <JWT>
```

A request without a valid token should return `401`. A normal user requesting `GET /api/users` should return `403`.

## Deployment

- **Backend (Railway)**, root directory `backend`. Variables: `JWT_SECRET`, `FRONTEND_ORIGIN`, `SQLITE_PATH=/data/tasks.sqlite`
  plus a Volume mounted at `/data` (see `backend/README.md`).
- **Frontend (Vercel)**, root directory `frontend`. Variable: `VITE_API_URL=https://full-stack-production-eb7e.up.railway.app`.
  Vite reads this at build time, so **redeploy** after changing it. The `/api` suffix is added automatically.
- Live URLs: frontend `https://full-stack-teal-seven.vercel.app`, backend `https://full-stack-production-eb7e.up.railway.app`.

## Troubleshooting

- `Route POST /auth/login not found`: the frontend was calling the backend without `/api`. Fixed in `frontend/src/api.js`
  (adds `/api` automatically) and the backend now also answers without the prefix.
- Browser says CORS / "Cannot reach the server": make sure `FRONTEND_ORIGIN` matches your Vercel URL exactly.
- Users or tasks disappear after a redeploy: attach a Railway Volume (see above) or use PostgreSQL.

