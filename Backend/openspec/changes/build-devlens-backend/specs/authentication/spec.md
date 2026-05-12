## ADDED Requirements

### Requirement: User Registration
The system SHALL allow a new user to register with a unique email address and password, hash the password with bcrypt, and persist the user in PostgreSQL.

#### Scenario: Successful registration
- **WHEN** a client sends `POST /api/auth/register` with a valid unique email, password, and optional name
- **THEN** the system creates a user record with a hashed password and returns the created user without the password field

#### Scenario: Duplicate email registration
- **WHEN** a client sends `POST /api/auth/register` with an email that already exists
- **THEN** the system rejects the request with a conflict error and does not create another user

### Requirement: User Login
The system SHALL validate user credentials, generate a signed JWT, set it as an HTTP-only cookie, and return the token in the JSON response body.

#### Scenario: Successful login
- **WHEN** a client sends `POST /api/auth/login` with valid credentials
- **THEN** the system returns a JWT in the response body and sets an authentication cookie using `httpOnly`, `sameSite=strict`, and secure production settings

#### Scenario: Invalid login
- **WHEN** a client sends `POST /api/auth/login` with invalid credentials
- **THEN** the system rejects the request with an authentication error and does not set an authentication cookie

### Requirement: User Logout
The system SHALL clear the authentication cookie during logout.

#### Scenario: Successful logout
- **WHEN** an authenticated or unauthenticated client sends `POST /api/auth/logout`
- **THEN** the system clears the authentication cookie with `res.clearCookie()` and returns a successful response

### Requirement: Protected Route Authentication
The system SHALL protect all routes except registration and login by verifying a JWT from the auth cookie or bearer token fallback.

#### Scenario: Cookie token accepted
- **WHEN** a protected endpoint receives a valid JWT in the authentication cookie
- **THEN** the system verifies the JWT and attaches the decoded user ID to `req.user.id`

#### Scenario: Bearer token fallback accepted
- **WHEN** a protected endpoint receives no auth cookie but receives a valid `Authorization: Bearer <token>` header
- **THEN** the system verifies the JWT and attaches the decoded user ID to `req.user.id`

#### Scenario: Missing or invalid token rejected
- **WHEN** a protected endpoint receives no valid JWT
- **THEN** the system rejects the request with an unauthorized error
