# Tasks: Frontend-Backend Integration

## Phase 1: Global Setup
- [x] Create `frontend/src/utils/axiosInstance.js` with base URL and interceptors.
- [x] Configure `frontend/.env` with `VITE_API_URL`.
- [x] Configure `Backend/.env` with all required variables.
- [x] Update `Backend/app.js` with CORS and cookie-parser configuration.

## Phase 2: Auth Integration
- [x] Create `frontend/src/services/api/auth.js`.
- [x] Implement `frontend/src/contexts/AuthContext.jsx` with `/auth/me` check.
- [x] Add `GET /api/auth/me` to `Backend/controllers/authController.js` and `Backend/routes/authRoutes.js`.
- [x] Create `frontend/src/components/layout/ProtectedRoute.jsx`.
- [x] Wire up `LoginPage.jsx` and `RegisterPage.jsx` with `AuthContext`.

## Phase 3: Dashboard Integration
- [x] Create `frontend/src/services/api/projects.js`.
- [x] Implement data fetching and optimistic UI in `DashboardPage.jsx`.
- [x] Wire up Edit and Delete modals in Dashboard.

## Phase 4: Workspace Integration
- [x] Update `frontend/src/services/api/projects.js` with `getProject`.
- [x] Create `frontend/src/services/api/sources.js`, `messages.js`, and `notes.js`.
- [x] Implement parallel data loading in `WorkspacePage.jsx`.
- [x] Integrate Left Sidebar (Sources) with file upload and progress.
- [x] Integrate Center Panel (Chat) with optimistic UI, thinking indicator, and auto-scroll.
- [x] Implement Navbar project title editing and "New Project" button.
- [x] Integrate Right Sidebar (Notes) with debounced auto-save.

## Phase 5: Routing & Polishing
- [x] Configure `frontend/src/App.jsx` with all routes and providers.
- [x] Add loading skeletons for all data-fetching views.
- [x] Implement error handling and toasts across all service calls.
- [x] Verify light/dark mode persistence.
