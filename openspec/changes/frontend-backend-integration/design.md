# Design: Frontend-Backend Integration

## Technical Architecture

### 1. Global Integration Setup
- **Axios Instance**: `src/utils/axiosInstance.js` will serve as the single source for API calls, with `baseURL` from environment variables and `withCredentials: true`. A response interceptor will handle `401 Unauthorized` errors by redirecting to `/login`.
- **Environment Variables**:
    - Frontend: `VITE_API_URL`
    - Backend: `PORT`, `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `GEMINI_API_KEY`, `CLIENT_URL`, `NODE_ENV`.
- **Backend CORS**: Configured in `app.js` to allow the frontend origin with credentials.

### 2. Authentication Flow
- **AuthContext**: Manages `user` state and `loading` status.
- **Session Persistence**: On mount, the frontend calls `/auth/me` to verify the session via the HTTP-only cookie.
- **Login/Register**: Services call the backend API, update `AuthContext` state, and navigate to the dashboard.
- **Protected Routes**: A `ProtectedRoute` component wraps authenticated views, ensuring only logged-in users can access them.

### 3. Data Integration Strategy
- **Dashboard**: Fetches all projects on mount. Uses optimistic UI for create/edit/delete operations.
- **Workspace**:
    - URL-based project ID (`/workspace/:id`).
    - Parallel data loading for Project, Sources, Messages, and Notes using `Promise.all`.
- **Chat**:
    - Optimistic UI for user messages.
    - "Thinking" indicator (pulsing dots) for pending AI responses.
    - Auto-scroll to bottom on new messages.
- **Notes**:
    - Debounced auto-save (500ms delay) on title or content changes.

### 4. API Contracts
- **Auth**: `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`.
- **Projects**: `GET /projects`, `POST /projects`, `PATCH /projects/:id`, `DELETE /projects/:id`.
- **Sources**: `GET /projects/:id/sources`, `POST /projects/:id/sources` (Multipart), `DELETE /projects/:id/sources/:sourceId`.
- **Messages**: `GET /projects/:id/messages`, `POST /projects/:id/messages`.
- **Notes**: `GET /projects/:id/notes`, `POST /projects/:id/notes`, `PATCH /projects/:id/notes/:noteId`, `DELETE /projects/:id/notes/:noteId`.

## Error Handling
- Global `401` handling in Axios.
- Local error toasts using `react-hot-toast` for API failures.
- Optimistic update reverts on failure.
