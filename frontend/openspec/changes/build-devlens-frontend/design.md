# Design: DevLens Frontend

## Tech Stack
- **Framework**: React.js (Vite)
- **Styling**: Vanilla CSS (Custom properties for themes)
- **Icons**: Lucide React
- **Typography**: Poppins (Google Fonts)
- **Routing**: React Router v6
- **API Client**: Axios
- **State Management**: React Context API (Auth, Theme)

## Design System
### Theme Tokens
#### Dark Mode (Default)
- `--bg-primary`: #0D0F14
- `--bg-secondary`: #13161E
- `--bg-elevated`: #1C2030
- `--accent`: #6C63FF
- `--text-primary`: #F0F2F8
- `--text-secondary`: #8B90A7
- `--border`: #2A2F42
- `--danger`: #E05A5AD

#### Light Mode
- `--bg-primary`: #EAF4FD
- `--bg-secondary`: #FFFFFF
- `--bg-elevated`: #D6ECFA
- `--accent`: #1A7FC1
- `--text-primary`: #0D2137
- `--text-secondary`: #4A7A9B
- `--border`: #B3D4EA
- `--danger`: #C0392B

### Layouts
- **LoginPage**: Centered glassmorphism card with gradient background and animated blur blobs.
- **DashboardPage**: Grid of project cards, top navbar, filter/search bar.
- **WorkspacePage**: Three-column layout (280px / 1fr / 260px) with top navbar.

## Components Architecture
### UI Components
- `Button`, `Input`, `Modal`, `Spinner`, `EmptyState`, `ThemeToggle`

### Layout Components
- `Navbar`, `Sidebar`, `PageContainer`

### Dashboard Components
- `ProjectCard`, `ProjectGrid`, `EditProjectModal`, `DeleteProjectModal`

### Workspace Components
- `SourceList`, `SourceItem`, `AddSourceModal`
- `ChatWindow`, `MessageBubble`, `ChatInput`
- `NoteList`, `NoteCard`, `NoteEditor`

## State & Data Flow
- **AuthContext**: Manages user session, login/logout, and persistent token.
- **ThemeContext**: Manages light/dark mode preference in localStorage.
- **Axios Instance**: Configured with baseURL and interceptors for 401 handling.
- **Hooks**: `useAuth`, `useTheme`, `useDebounce`.

## Animations
- **Transitions**: 0.2s ease for all interactive elements.
- **Modals**: Fade (opacity 0->1) + Scale (0.95->1).
- **Cards**: Hover lift (translateY -2px) + shadow intensification.
- **Chat**: New messages slide/fade in from bottom.
- **Skeleton**: Pulsing loading states for data fetching.
