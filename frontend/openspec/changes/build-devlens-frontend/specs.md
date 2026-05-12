# Specifications: DevLens Frontend

## Routing
| Route | Component | Access | Description |
| :--- | :--- | :--- | :--- |
| `/` | Redirect to `/login` | Public | Home redirect |
| `/login` | `LoginPage` | Public | User authentication |
| `/register` | `LoginPage` (Register view) | Public | User registration |
| `/dashboard` | `DashboardPage` | Protected | Project management |
| `/workspace/:id` | `WorkspacePage` | Protected | Main workspace |

## API Endpoints (Axios Integration)
All requests to `BASE_URL` (configured in `axiosInstance`).

### Authentication
- `POST /auth/login`: `{ email, password }` -> `{ user, token }`
- `POST /auth/register`: `{ email, password, name }` -> `{ user, token }`
- `POST /auth/logout`: Log out user and clear session.

### Projects
- `GET /projects`: List all projects for user.
- `POST /projects`: `{ title }` -> Create new project.
- `PATCH /projects/:id`: `{ title }` -> Update project title.
- `DELETE /projects/:id`: Delete project.

### Sources
- `GET /projects/:id/sources`: List sources for a project.
- `POST /projects/:id/sources/upload`: Multi-part form data for file upload.
- `POST /projects/:id/sources/url`: `{ url }` -> Add source via URL.
- `DELETE /sources/:id`: Remove a source.

### Messages
- `GET /projects/:id/messages`: Chat history.
- `POST /projects/:id/messages`: `{ content }` -> Send message to AI.

### Notes
- `GET /projects/:id/notes`: List notes.
- `POST /projects/:id/notes`: Create new note.
- `PATCH /notes/:id`: `{ title, content }` -> Update note (autosave).
- `DELETE /notes/:id`: Delete note.

## Data Models (Frontend)
### Project
```typescript
interface Project {
  id: string;
  title: string;
  createdAt: string;
  sourceCount: number;
}
```

### Source
```typescript
interface Source {
  id: string;
  name: string;
  type: 'pdf' | 'md' | 'image' | 'link';
  createdAt: string;
}
```

### Message
```typescript
interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: string;
}
```

### Note
```typescript
interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}
```
