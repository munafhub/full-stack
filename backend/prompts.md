# Week 2 AI Prompts

## Project goal
Build a CRUD REST API for one resource, model it with an ORM and a relationship, validate inputs, configure a backend linter, write AI-generated unit/API tests, and document prompts.

## Prompts used

1. Build a beginner-friendly CRUD REST API for Tasks using Express.js.
2. Use an ORM and SQLite database. Create a User model and a Task model with a one-to-many User -> Tasks relationship.
3. Add create, read, update and delete endpoints for Tasks.
4. Add input validation and return appropriate HTTP status codes for validation errors, missing resources, successful creation, successful updates and successful deletion.
5. Configure ESLint for the backend and make the code pass linting.
6. Generate automated tests for the REST API using Vitest and Supertest. Cover CRUD, validation, relationship behavior and 404 responses.
7. Review the generated tests and make sure they test actual API behavior rather than only implementation details.
8. Keep the code beginner-friendly and explain how each folder and file is used.

## Verification notes
- Tests are run with `npm test`.
- Lint is run with `npm run lint`.
- The API is manually testable with Postman, Thunder Client or curl.
- The User -> Task relationship is returned by Sequelize includes.

# Week 3 AI Prompts - JWT Authentication

## Project goal
Add JWT authentication to the existing Week 2 Tasks API while keeping the existing CRUD, ORM relationship, validation, tests and linting working.

## Prompts used

9. Add beginner-friendly JWT authentication to the existing Express Tasks API.
10. Add user registration and hash passwords securely with bcrypt before storing them.
11. Add a login endpoint that verifies the email and password and returns a JWT access token.
12. Add Express authentication middleware that reads a Bearer token, verifies the JWT, and returns 401 for missing or invalid tokens.
13. Protect the Task CRUD routes with JWT authentication while keeping the User -> Task Sequelize relationship.
14. Add API tests for registration, login, invalid login, missing JWT, protected CRUD operations, validation and 404 behavior.
15. Keep the implementation beginner-friendly and explain the authentication flow for a teacher/interview discussion.

## Verification notes
- `npm test` verifies authentication and Task API behavior.
- `npm run lint` checks the backend code.
- Postman can be used to register, login, copy the JWT, and call protected Task endpoints with `Authorization: Bearer <token>`.

# Week 3 Full-Stack Integration Prompts

16. Add at least one role-based authorization rule to the JWT-protected API.
17. Connect the Week 1 React frontend to the Week 2 backend and replace local todo state with API-backed CRUD.
18. Add login/register UI and send the JWT Bearer token with protected API requests.
19. Keep task data private to the authenticated user and explain the ownership check.
20. Write at least five API tests covering authentication, CRUD, authorization and error paths.
21. Add a happy-path integration test that runs register -> login -> create -> read -> update -> delete end-to-end.
22. Update the project documentation with setup, authentication and frontend-backend integration instructions.

## Week 3 verification checklist

- JWT registration/login works.
- Passwords are hashed with bcryptjs.
- Task CRUD requires a valid JWT.
- A normal user cannot access the admin-only users route (403).
- Users can only access their own tasks.
- At least 5 API tests cover auth, CRUD and errors.
- A separate integration test covers the full happy path.
- ESLint passes with `npm run lint`.
- Tests run with `npm test`.
