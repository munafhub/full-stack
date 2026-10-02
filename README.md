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

Backend: `https://full-stack-production-0769.up.railway.app`

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
