## ADDED Requirements

### Requirement: Source Listing
The system SHALL list sources belonging to an authenticated user's project.

#### Scenario: List project sources
- **WHEN** an authenticated user sends `GET /api/projects/:projectId/sources` for a project they own
- **THEN** the system returns the project's source records

### Requirement: File Source Upload
The system SHALL accept PDF, PNG, JPG, and Markdown file uploads, upload binaries to external cloud storage, extract plain text, and store only metadata, public URL, and extracted text in the database.

#### Scenario: Upload supported file source
- **WHEN** an authenticated user sends `POST /api/projects/:projectId/sources` as `multipart/form-data` with a supported file for a project they own
- **THEN** the system uploads the file to external storage, extracts text content, and creates a `Source` record with `storageUrl`, `fileName`, `fileType`, and `textContent`

#### Scenario: Reject unsupported file source
- **WHEN** an authenticated user uploads a file whose type is not PDF, PNG, JPG, or Markdown
- **THEN** the system rejects the request and does not create a `Source` record

### Requirement: URL Source Creation
The system SHALL allow a user to add an external HTTP(S) URL as a source and store the URL as the source reference.

#### Scenario: Add URL source
- **WHEN** an authenticated user sends `POST /api/projects/:projectId/sources` with a valid external URL for a project they own
- **THEN** the system stores the URL in `storageUrl` and stores extracted readable text when available

### Requirement: Source Text Extraction
The system SHALL extract plain text from supported sources for AI context injection.

#### Scenario: Extract PDF text
- **WHEN** a PDF file source is uploaded
- **THEN** the parser service extracts text using PDF parsing and stores it in `Source.textContent`

#### Scenario: Extract Markdown text
- **WHEN** a Markdown file source is uploaded
- **THEN** the parser service reads or converts the Markdown to plain text and stores it in `Source.textContent`

#### Scenario: Extract image text
- **WHEN** a PNG or JPG file source is uploaded
- **THEN** the parser service extracts text from the image using Gemini Vision or an equivalent configured image-text path and stores it in `Source.textContent`

### Requirement: Source Deletion
The system SHALL delete a source belonging to an authenticated user's project and remove the associated external storage object when applicable.

#### Scenario: Delete source
- **WHEN** an authenticated user sends `DELETE /api/projects/:projectId/sources/:sourceId` for a source in a project they own
- **THEN** the system deletes the source record and requests deletion from external storage when the source represents an uploaded file
