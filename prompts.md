# Week 2 and Week 3 AI Prompts

## Week 2 - REST API and CRUD

1. Build a beginner-friendly CRUD REST API for Tasks using Express.js.
2. Use Sequelize ORM and SQLite. Create a User model and a Task model with a one-to-many User -> Tasks relationship.
3. Add create, read, update and delete endpoints for Tasks.
4. Add Zod input validation and appropriate HTTP status codes.
5. Configure ESLint for the backend and make the code pass linting.
6. Generate API tests using Vitest and Supertest for CRUD, validation, relationships and 404 responses.
7. Review the generated tests so they verify actual API behavior.
8. Keep the code beginner-friendly and explain the purpose of each folder and file.

## Week 3 - JWT Authentication and Authorization

9. Add beginner-friendly JWT authentication to the existing Express Tasks API.
10. Add registration and hash passwords with bcryptjs before storing them.
11. Add a login endpoint that verifies credentials and returns a JWT access token.
12. Add authentication middleware that reads a Bearer token, verifies the JWT, and returns 401 for missing or invalid tokens.
13. Protect Task CRUD routes with JWT authentication while keeping the User -> Task relationship.
14. Add API tests for registration, login, invalid login, missing JWT, protected CRUD, validation and 404 behavior.
15. Keep the implementation beginner-friendly and explain the authentication flow for teacher/interview discussion.

## Week 3 - RBAC and Full-Stack Integration

16. Add at least one role-based authorization rule to the JWT-protected API.
17. Make the users route admin-only and return 403 for normal users.
18. Connect the Week 1 React frontend to the Week 2 backend and replace local task state with API-backed CRUD.
19. Add login/register UI and send the JWT Bearer token with protected API requests.
20. Keep task data private to the authenticated user.
21. Write at least five API tests covering authentication, authorization, CRUD and error paths.
22. Add a happy-path integration test covering register -> login -> create -> read -> update -> delete.
23. Update the project documentation with setup, authentication and frontend-backend integration instructions.

## Verification checklist

- JWT registration/login works.
- Passwords are hashed with bcryptjs.
- Task CRUD requires a valid JWT.
- A normal user cannot access the admin-only users route.
- Users can only access their own tasks.
- API tests cover auth, CRUD, authorization and errors.
- A separate integration test covers the full happy path.
- ESLint can be run with `npm run lint` inside `backend`.
- Backend tests can be run with `npm test` inside `backend`.
- Frontend tests can be run with `npm test` inside `frontend`.
