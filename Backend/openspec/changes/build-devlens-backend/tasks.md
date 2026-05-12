## 1. Project Setup

- [x] 1.1 Add required dependencies for Express middleware, bcrypt, cookies, JWT, Prisma, multipart uploads, Cloudinary-compatible storage, PDF parsing, Markdown parsing, HTML scraping, and Gemini API access.
- [x] 1.2 Add `.env.example` documenting `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `GEMINI_API_KEY`, storage-provider credentials, `NODE_ENV`, and `PORT`.
- [x] 1.3 Create `app.js` and wire `main.js` to load environment variables, initialize Express, mount routes, register `errorHandler`, and start the server.

## 2. Database Layer

- [x] 2.1 Add `prisma/schema.prisma` with PostgreSQL datasource and `User`, `Project`, `Source`, `Message`, and `Note` models.
- [x] 2.2 Configure cascade deletion from `Project` to `Source`, `Message`, and `Note` in the Prisma schema.
- [x] 2.3 Add `config/db.js` as a Prisma client singleton.
- [x] 2.4 Run Prisma generate and create the initial migration.

## 3. Shared Utilities And Configuration

- [x] 3.1 Add `utils/asyncWrapper.js` for async controller error forwarding.
- [x] 3.2 Add `utils/errorHandler.js` for consistent JSON error responses and production-safe error details.
- [x] 3.3 Add `utils/authMiddleware.js` to verify JWTs from cookies or bearer headers and attach `req.user.id`.
- [x] 3.4 Add `config/gemini.js` to initialize the Gemini client from `GEMINI_API_KEY`.

## 4. Authentication

- [x] 4.1 Add `controllers/authController.js` with register, login, and logout handlers using `asyncWrapper`.
- [x] 4.2 Hash passwords with bcrypt during registration and omit passwords from API responses.
- [x] 4.3 Validate login credentials, sign JWTs, set HTTP-only SameSite Strict cookies, and return the token in JSON.
- [x] 4.4 Clear the auth cookie on logout.
- [x] 4.5 Add `routes/authRoutes.js` for `POST /api/auth/register`, `POST /api/auth/login`, and `POST /api/auth/logout`.

## 5. Project Management

- [x] 5.1 Add project ownership lookup helpers or controller logic that validates `project.userId === req.user.id`.
- [x] 5.2 Add `controllers/projectController.js` for listing, creating, updating, and deleting authenticated user projects.
- [x] 5.3 Ensure project delete relies on Prisma cascade behavior for sources, messages, and notes.
- [x] 5.4 Add `routes/projectRoutes.js` and protect all project routes with `authMiddleware`.

## 6. Source Management

- [x] 6.1 Add multipart upload handling for supported document file types.
- [x] 6.2 Add `services/storageService.js` to upload files to external cloud storage, return public URLs, and delete stored objects.
- [x] 6.3 Add `services/parserService.js` to extract text from PDF, Markdown, image files, and external URLs.
- [x] 6.4 Add `controllers/sourceController.js` for listing, creating, and deleting project sources after ownership validation.
- [x] 6.5 Add `routes/sourceRoutes.js` for `/api/projects/:projectId/sources` endpoints and protect them with `authMiddleware`.

## 7. AI Chat

- [x] 7.1 Add `services/geminiService.js` to fetch source text, fetch recent message history, build the source-only DevLens prompt, and call Gemini 1.5 Flash.
- [x] 7.2 Add fallback behavior instructing Gemini to return `I could not find that information in the provided documents.` when context lacks the answer.
- [x] 7.3 Add `controllers/messageController.js` for retrieving ordered history and sending a message that persists both roles.
- [x] 7.4 Add `routes/messageRoutes.js` for `/api/projects/:projectId/messages` endpoints and protect them with `authMiddleware`.

## 8. Notes

- [x] 8.1 Add `controllers/noteController.js` for list, create, update, and delete note handlers with project ownership checks.
- [x] 8.2 Add `routes/noteRoutes.js` for `/api/projects/:projectId/notes` endpoints and protect them with `authMiddleware`.

## 9. Verification

- [x] 9.1 Add or run automated checks for auth registration, login, logout, and protected-route rejection.
- [x] 9.2 Add or run checks for project ownership enforcement across projects, sources, messages, and notes.
- [x] 9.3 Add or run checks for cascade project deletion.
- [x] 9.4 Add or run checks with mocked storage, parser, and Gemini services for source upload and AI chat flows.
- [x] 9.5 Run Prisma validation/generation and the available Node test or smoke-test command.
