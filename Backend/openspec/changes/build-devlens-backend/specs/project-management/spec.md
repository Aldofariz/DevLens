## ADDED Requirements

### Requirement: Project Listing
The system SHALL return only the authenticated user's projects.

#### Scenario: List owned projects
- **WHEN** an authenticated user sends `GET /api/projects`
- **THEN** the system returns all projects where `project.userId` equals `req.user.id`

### Requirement: Project Creation
The system SHALL allow an authenticated user to create a project with a title and generated unique ID.

#### Scenario: Create project
- **WHEN** an authenticated user sends `POST /api/projects` with a valid title
- **THEN** the system creates a project owned by that user and returns the project record

### Requirement: Project Title Update
The system SHALL allow an authenticated user to update the title of their own project.

#### Scenario: Update owned project title
- **WHEN** an authenticated user sends `PATCH /api/projects/:id` for a project they own with a new title
- **THEN** the system updates the project's title and returns the updated project as the single source of truth for workspace navigation

#### Scenario: Reject update for another user's project
- **WHEN** an authenticated user sends `PATCH /api/projects/:id` for a project they do not own
- **THEN** the system rejects the request without mutating the project

### Requirement: Project Deletion
The system SHALL allow an authenticated user to delete their own project and SHALL cascade-delete its sources, messages, and notes at the Prisma relation level.

#### Scenario: Delete owned project
- **WHEN** an authenticated user sends `DELETE /api/projects/:id` for a project they own
- **THEN** the system deletes the project and the database deletes associated sources, messages, and notes through cascade relations

#### Scenario: Reject deletion for another user's project
- **WHEN** an authenticated user sends `DELETE /api/projects/:id` for a project they do not own
- **THEN** the system rejects the request without deleting any project data

### Requirement: Project Ownership Enforcement
The system SHALL validate project ownership before returning or mutating any project-scoped resource.

#### Scenario: Nested resource ownership check
- **WHEN** an authenticated user accesses a nested project endpoint using `:projectId`
- **THEN** the system verifies that the project exists and `project.userId` equals `req.user.id` before processing the nested operation
