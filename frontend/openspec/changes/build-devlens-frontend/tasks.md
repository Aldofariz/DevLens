# Tasks: Build DevLens Frontend

## Phase 1: Foundation & Design System
- [x] Initialize project folder structure as defined in the spec.
- [x] Configure `index.css` with CSS variables for light/dark themes and global styles.
- [x] Set up `ThemeContext` and `AuthContext`.
- [x] Configure `axiosInstance` with interceptors.
- [x] Set up React Router with protected routes.

## Phase 2: Core UI Components
- [x] Implement base components: `Button`, `Input`, `Modal`, `ThemeToggle`.
- [x] Implement layout wrappers: `Navbar`, `PageContainer`.

## Phase 3: Login & Register
- [x] Build `LoginPage` with glassmorphism card and gradient background.
- [x] Implement toggle between Login and Register forms.
- [x] Integrate with `AuthContext` for login/registration logic.

## Phase 4: Dashboard
- [x] Build `DashboardPage` layout and navbar.
- [x] Implement `ProjectGrid` and `ProjectCard`.
- [x] Implement "Create Project" functionality and card.
- [x] Implement `EditProjectModal` and `DeleteProjectModal`.
- [x] Implement filter and search bar.

## Phase 5: Workspace - Layout & Sources
- [x] Build `WorkspacePage` 3-column layout.
- [x] Implement `SourceList` and `SourceItem` in the left sidebar.
- [x] Implement `AddSourceModal` with Upload and URL tabs.

## Phase 6: Workspace - AI Chat
- [x] Implement `ChatWindow` and `MessageBubble` in the center panel.
- [x] Build `ChatInput` with multi-line support and auto-grow.
- [x] Implement AI loading states and message streaming (simulated or real).

## Phase 7: Workspace - Notes
- [x] Implement `NoteList` and `NoteCard` in the right sidebar.
- [x] Implement `NoteEditor` with inline editing and debounce auto-save.

## Phase 8: Polish & Animations
- [x] Add page transitions and entrance animations for cards/messages.
- [x] Implement skeleton screens for loading states.
- [x] Add toast notifications for user actions.
- [x] Final responsive design check and dark/light mode refinement.
