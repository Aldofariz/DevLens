## Context

The backend currently contains only a minimal Node.js scaffold with empty architecture folders. DevLens needs a full Express API that supports authenticated users, project workspaces, uploaded or linked documentation sources, document-grounded Gemini chat, and per-project notes.

The implementation must preserve the requested folder architecture: `config/`, `controllers/`, `routes/`, `services/`, and `utils/`. PostgreSQL is the source of truth through Prisma. Uploaded file binaries must live in external cloud storage; the database stores metadata, public URL references, and extracted text only.

## Goals / Non-Goals

**Goals:**

- Provide production-ready Express application composition with route mounting, protected APIs, CORS/cookie support, JSON parsing, and global error handling.
- Implement JWT authentication using bcrypt, HTTP-only cookies, secure cookie settings, and bearer-token fallback.
- Implement Prisma models for `User`, `Project`, `Source`, `Message`, and `Note`.
- Enforce project ownership before returning or mutating project-scoped data.
- Store uploaded file binaries in an external storage provider through `storageService`.
- Extract text from PDF, Markdown, image, and URL sources through `parserService`.
- Generate Gemini 1.5 Flash responses grounded strictly in saved project source text and recent chat history.
- Persist user and assistant messages per project.

**Non-Goals:**

- Build frontend pages or UI components.
- Store uploaded binary files in PostgreSQL.
- Implement multi-provider storage selection at runtime beyond a single configured provider behind `storageService`.
- Implement collaborative editing, streaming AI responses, billing, rate limiting, or background job queues in the initial version.

## Decisions

1. Use Prisma as the only database access layer.

   Prisma provides a typed schema, declarative relations, and `onDelete: Cascade` for project-owned records. Direct `pg` usage remains unnecessary for application queries even though PostgreSQL is the backing database.

   Alternative considered: raw `pg` queries. Rejected because it increases boilerplate and makes relation/cascade behavior less explicit for this scaffold.

2. Use JWT in an HTTP-only cookie, with bearer-token fallback.

   The cookie path supports browser clients securely, while returning the token in JSON and accepting `Authorization: Bearer <token>` keeps API clients flexible. Production sets `secure: true` when `NODE_ENV=production`, `httpOnly: true`, and `sameSite: "strict"`.

   Alternative considered: server-side sessions. Rejected because the request explicitly requires token-based JWT authentication.

3. Keep authorization checks in controllers/services at project boundaries.

   `authMiddleware` attaches `req.user.id`; controllers that operate on projects first load the project with `userId: req.user.id` before nested reads/writes. Nested operations use the verified project ID instead of trusting route parameters alone.

   Alternative considered: separate middleware per nested route. Useful later, but explicit controller checks keep the first implementation easy to audit.

4. Use a storage provider abstraction with Cloudinary as the default concrete target.

   `storageService` exposes upload and delete operations and returns a public URL plus provider identifier/public ID. Cloudinary is a practical default for PDFs and images, while the interface can later be adapted to Supabase Storage or S3.

   Alternative considered: local disk storage. Rejected because the requirement forbids storing file binaries in the database and calls for external cloud storage.

5. Extract source text before saving the source record.

   The source creation flow uploads files, extracts text, then persists `storageUrl`, `fileName`, `fileType`, and `textContent`. URL sources store the URL directly and scrape readable text at save time when possible.

   Alternative considered: extract on every AI request. Rejected because it would make chat latency and provider/network failures worse.

6. Keep Gemini grounding prompt construction in `geminiService`.

   `geminiService` gathers source context, recent messages, and the new user message, then sends one structured prompt to Gemini 1.5 Flash. It saves both the user message and assistant response after Gemini returns successfully.

   Alternative considered: let controllers build prompts. Rejected because prompt construction is domain logic and belongs in a service.

7. Use centralized async and error handling.

   Controllers are wrapped with `asyncWrapper`; thrown operational errors include HTTP status codes and reach `errorHandler`, which returns consistent JSON without leaking stack traces in production.

## Risks / Trade-offs

- Gemini may hallucinate despite prompt constraints -> Mitigate with a strict system prompt, source-only instruction, and tests that validate fallback wording when no source context exists.
- Large source documents may exceed Gemini context limits -> Mitigate initially by truncating context safely and document this as a future summarization/chunking improvement.
- Text extraction quality varies by file type -> Mitigate with parser-specific handling and explicit errors for unsupported or unreadable files.
- Cloud storage deletion can fail after database deletion -> Mitigate by deleting storage first when possible and logging cleanup failures for retry/manual follow-up.
- Cookie auth requires correct frontend CORS credentials configuration -> Mitigate by configuring Express CORS with credentials and documenting required client behavior.
- Cascade deletes depend on Prisma schema and database migration correctness -> Mitigate with Prisma relation tests and migration review before deployment.

## Migration Plan

1. Add environment variables and dependency packages.
2. Add Prisma schema and run `prisma generate`.
3. Create and apply the initial PostgreSQL migration.
4. Implement config, utilities, services, controllers, routes, and Express app entry point.
5. Run endpoint tests against a test database and mocked Gemini/storage services.
6. Deploy with production environment variables and run migrations before starting the app.

Rollback: revert the application deployment and, if no production data must be preserved, roll back the initial migration. If data exists, keep the schema in place and disable affected routes while fixing forward.

## Open Questions

- Which external storage provider should be used first: Cloudinary, Supabase Storage, or AWS S3?
- Should URL scraping accept only public HTTP(S) pages, or will private/authenticated URLs be supported later?
- Should image text extraction use Gemini Vision directly, OCR, or a hybrid path?
