## ADDED Requirements

### Requirement: Note Listing
The system SHALL return notes belonging to an authenticated user's project.

#### Scenario: List project notes
- **WHEN** an authenticated user sends `GET /api/projects/:projectId/notes` for a project they own
- **THEN** the system returns the project's notes

### Requirement: Note Creation
The system SHALL allow an authenticated user to create a project note with optional title and content.

#### Scenario: Create note
- **WHEN** an authenticated user sends `POST /api/projects/:projectId/notes` with optional title and content for a project they own
- **THEN** the system creates and returns a note associated with that project

### Requirement: Note Update
The system SHALL allow an authenticated user to update the title or content of a note in their own project.

#### Scenario: Update note
- **WHEN** an authenticated user sends `PATCH /api/projects/:projectId/notes/:noteId` with title or content for a note in a project they own
- **THEN** the system updates and returns the note

#### Scenario: Reject update for note outside project
- **WHEN** an authenticated user attempts to update a note that is not in the specified owned project
- **THEN** the system rejects the request without mutating the note

### Requirement: Note Deletion
The system SHALL allow an authenticated user to delete a note in their own project.

#### Scenario: Delete note
- **WHEN** an authenticated user sends `DELETE /api/projects/:projectId/notes/:noteId` for a note in a project they own
- **THEN** the system deletes the note
