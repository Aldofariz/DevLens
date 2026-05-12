## Why

DevLens needs a production-ready backend foundation for authenticated users to manage documentation projects, attach source material, ask document-grounded AI questions, and keep project notes. The current backend is only a scaffold, so defining the contract first keeps the implementation focused and testable.

## What Changes

- Build a Node.js and Express.js API organized strictly through `config/`, `controllers/`, `routes/`, `services/`, and `utils/`.
- Add JWT authentication with bcrypt password hashing, HTTP-only auth cookies, bearer-token fallback, and logout cookie clearing.
- Add per-user project management APIs for dashboard and workspace navigation.
- Add source management APIs for uploaded files and URLs, with external cloud storage for file binaries and database persistence of public URLs plus extracted text.
- Add Gemini 1.5 Flash-backed chat APIs that answer strictly from the project's stored source text and persisted recent conversation history.
- Add per-project notes CRUD APIs.
- Add Prisma models for users, projects, sources, messages, and notes using PostgreSQL with cascade deletion for project-owned records.
- Add shared async and error-handling utilities so controller failures flow through one global Express error handler.

## Capabilities

### New Capabilities

- `authentication`: User registration, login, logout, JWT cookie issuance, JWT verification, and protected-route identity attachment.
- `project-management`: Authenticated CRUD operations for user-owned projects with single-source-of-truth project titles and cascading project deletion.
- `source-management`: Project-scoped source listing, creation from uploaded files or URLs, external file storage, text extraction, and source deletion.
- `ai-chat`: Project-scoped persisted chat history and Gemini responses grounded only in project source documents.
- `notes-management`: Project-scoped CRUD operations for personal notes.
- `backend-platform`: Express application composition, Prisma database access, global error handling, environment configuration, and route protection conventions.

### Modified Capabilities

None.

## Impact

- Adds Prisma schema and generated client usage for PostgreSQL persistence.
- Adds Express routes under `/api/auth` and `/api/projects`.
- Adds dependencies for password hashing, cookie parsing, multipart uploads, cloud storage integration, document parsing, and Gemini API access.
- Requires environment variables: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `GEMINI_API_KEY`, storage-provider credentials, `NODE_ENV`, and `PORT`.
- Establishes ownership checks so authenticated users can access only their own projects and nested project resources.
