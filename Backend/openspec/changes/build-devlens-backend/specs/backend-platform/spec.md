## ADDED Requirements

### Requirement: Express Application Composition
The system SHALL expose a Node.js Express application that mounts auth, project, source, message, and note routes under the required API paths.

#### Scenario: Routes mounted
- **WHEN** the application starts
- **THEN** it mounts `/api/auth`, `/api/projects`, `/api/projects/:projectId/sources`, `/api/projects/:projectId/messages`, and `/api/projects/:projectId/notes` routes

### Requirement: Folder Architecture
The system SHALL organize application code according to the requested `config/`, `controllers/`, `routes/`, `services/`, and `utils/` responsibilities.

#### Scenario: Files follow assigned responsibilities
- **WHEN** implementation files are added
- **THEN** config clients live in `config/`, route handlers live in `controllers/`, route definitions live in `routes/`, domain integrations live in `services/`, and shared middleware/helpers live in `utils/`

### Requirement: Prisma Schema
The system SHALL define Prisma models for `User`, `Project`, `Source`, `Message`, and `Note` using PostgreSQL and the required relations.

#### Scenario: Schema includes cascade relations
- **WHEN** Prisma migrations are generated
- **THEN** `Source`, `Message`, and `Note` relate to `Project` with `onDelete: Cascade`

### Requirement: Global Error Handling
The system SHALL use async controller wrappers and a global Express error handler.

#### Scenario: Async controller error
- **WHEN** an async controller throws an error
- **THEN** `asyncWrapper` passes the error to `errorHandler` and the API returns a consistent JSON error response

### Requirement: Environment Configuration
The system SHALL read required runtime configuration from environment variables.

#### Scenario: Required environment variables configured
- **WHEN** the application starts in a deployed environment
- **THEN** it uses `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `GEMINI_API_KEY`, storage-provider credentials, `NODE_ENV`, and `PORT` from environment variables
