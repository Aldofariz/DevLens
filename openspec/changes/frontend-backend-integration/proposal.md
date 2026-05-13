# Proposal: Frontend-Backend Integration for DevLens

## Problem Statement
The current DevLens project has a decoupled frontend (React.js) and backend (Express.js). To make the application functional, we need to establish a robust communication layer, implement authentication, and wire up all core features (Dashboard, Workspace, Sources, Chat, Notes) end-to-end.

## Goals
- Establish a global Axios instance with interceptors for authentication.
- Implement session persistence using HTTP-only cookies and `/auth/me` endpoint.
- Protect frontend routes and manage authentication state via `AuthContext`.
- Integrate Project, Source, Message, and Note services.
- Implement optimistic UI updates and robust error handling.
- Sync project state (like titles) across different views.

## Non-Goals
- Redesigning the existing UI components (unless necessary for integration).
- Implementing new features outside the current scope of integration.

## Proposed Solution
We will follow a systematic integration approach:
1. **Global Setup**: Configure Axios and environment variables.
2. **Auth Integration**: Wire up login, register, and session persistence.
3. **Dashboard Integration**: Connect project management features.
4. **Workspace Integration**: Implement multi-panel data loading and real-time interactions (Chat, Sources, Notes).
5. **Polishing**: Ensure smooth transitions, auto-saves, and error feedback.
