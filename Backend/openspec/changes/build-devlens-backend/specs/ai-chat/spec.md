## ADDED Requirements

### Requirement: Message History Retrieval
The system SHALL return persisted chat messages for an authenticated user's project ordered by creation time ascending.

#### Scenario: Retrieve project messages
- **WHEN** an authenticated user sends `GET /api/projects/:projectId/messages` for a project they own
- **THEN** the system returns all project messages ordered by `createdAt` ascending

### Requirement: Document-Grounded AI Response
The system SHALL answer user messages using Gemini 1.5 Flash with a prompt grounded strictly in the project's stored source text and recent conversation history.

#### Scenario: Send grounded message
- **WHEN** an authenticated user sends `POST /api/projects/:projectId/messages` with a message for a project they own
- **THEN** the system concatenates source `textContent`, includes recent conversation history, calls Gemini 1.5 Flash, saves the user message and assistant response, and returns the assistant response

#### Scenario: Missing document answer
- **WHEN** Gemini cannot find the answer in the provided project source context
- **THEN** the assistant response says `I could not find that information in the provided documents.`

### Requirement: Chat Persistence
The system SHALL persist both user and assistant messages for each project.

#### Scenario: Persist conversation turn
- **WHEN** the AI message endpoint successfully returns an assistant response
- **THEN** the system stores one `Message` with role `user` and one `Message` with role `assistant` for the project

### Requirement: Prompt Isolation
The system SHALL instruct Gemini not to use outside knowledge when answering project questions.

#### Scenario: Build prompt with source-only instruction
- **WHEN** the Gemini service builds a prompt for a user message
- **THEN** the prompt includes the DevLens AI system instruction, document context section, conversation history section, and the user's new message
