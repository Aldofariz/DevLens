const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "DevLens API",
    version: "1.0.0",
    description:
      "API documentation for DevLens, an AI-powered technical documentation simplifier backend.",
  },
  servers: [
    {
      url: process.env.BASE_URL || 'http://localhost:5000',
      description: "Local development server",
    },
  ],
  tags: [
    { name: "Health" },
    { name: "Auth" },
    { name: "Projects" },
    { name: "Sources" },
    { name: "Messages" },
    { name: "Notes" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "token",
      },
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Authentication required" },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          email: { type: "string", format: "email" },
          name: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Project: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          userId: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Source: {
        type: "object",
        properties: {
          id: { type: "string" },
          projectId: { type: "string" },
          fileName: { type: "string", nullable: true },
          fileType: { type: "string", nullable: true },
          storageUrl: { type: "string" },
          textContent: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Message: {
        type: "object",
        properties: {
          id: { type: "string" },
          projectId: { type: "string" },
          role: { type: "string", enum: ["user", "assistant"] },
          content: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Note: {
        type: "object",
        properties: {
          id: { type: "string" },
          projectId: { type: "string" },
          title: { type: "string", nullable: true },
          content: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
    },
    responses: {
      Unauthorized: {
        description: "Missing, invalid, or expired authentication token.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
          },
        },
      },
      NotFound: {
        description: "Requested resource was not found.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
          },
        },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Check API health",
        responses: {
          200: {
            description: "Service is healthy.",
          },
        },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", format: "password" },
                  name: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "User registered.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          409: { description: "Email is already registered." },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login and receive a JWT",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", format: "password" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful. JWT is returned and set as an HTTP-only cookie.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string" },
                    user: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          401: { description: "Invalid credentials." },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout and clear auth cookie",
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        responses: {
          200: { description: "Logged out successfully." },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/projects": {
      get: {
        tags: ["Projects"],
        summary: "List authenticated user's projects",
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        responses: {
          200: {
            description: "Projects returned.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    projects: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Project" },
                    },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
      post: {
        tags: ["Projects"],
        summary: "Create a project",
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: {
                  title: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Project created.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    project: { $ref: "#/components/schemas/Project" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/projects/{id}": {
      patch: {
        tags: ["Projects"],
        summary: "Update a project title",
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: { title: { type: "string" } },
              },
            },
          },
        },
        responses: {
          200: { description: "Project updated." },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
      delete: {
        tags: ["Projects"],
        summary: "Delete a project and cascade-delete nested data",
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          204: { description: "Project deleted." },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/api/projects/{projectId}/sources": {
      get: {
        tags: ["Sources"],
        summary: "List project sources",
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        parameters: [{ name: "projectId", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Sources returned." },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
      post: {
        tags: ["Sources"],
        summary: "Upload a source file or add a URL source",
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        parameters: [{ name: "projectId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  file: {
                    type: "string",
                    format: "binary",
                    description: "PDF, PNG, JPG, or Markdown file.",
                  },
                  url: {
                    type: "string",
                    format: "uri",
                    description: "External HTTP(S) documentation URL.",
                  },
                },
              },
            },
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  url: { type: "string", format: "uri" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Source created." },
          400: { description: "Unsupported file type or invalid URL." },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/projects/{projectId}/sources/{sourceId}": {
      delete: {
        tags: ["Sources"],
        summary: "Delete a project source",
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        parameters: [
          { name: "projectId", in: "path", required: true, schema: { type: "string" } },
          { name: "sourceId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          204: { description: "Source deleted." },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/api/projects/{projectId}/messages": {
      get: {
        tags: ["Messages"],
        summary: "Get project chat history",
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        parameters: [{ name: "projectId", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Messages returned." },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
      post: {
        tags: ["Messages"],
        summary: "Send a document-grounded AI chat message",
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        parameters: [{ name: "projectId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["content"],
                properties: { content: { type: "string" } },
              },
            },
          },
        },
        responses: {
          201: { description: "Assistant response returned and messages persisted." },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/projects/{projectId}/notes": {
      get: {
        tags: ["Notes"],
        summary: "List project notes",
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        parameters: [{ name: "projectId", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Notes returned." },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
      post: {
        tags: ["Notes"],
        summary: "Create a project note",
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        parameters: [{ name: "projectId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  content: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Note created." },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/projects/{projectId}/notes/{noteId}": {
      patch: {
        tags: ["Notes"],
        summary: "Update a project note",
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        parameters: [
          { name: "projectId", in: "path", required: true, schema: { type: "string" } },
          { name: "noteId", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string", nullable: true },
                  content: { type: "string", nullable: true },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Note updated." },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
      delete: {
        tags: ["Notes"],
        summary: "Delete a project note",
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        parameters: [
          { name: "projectId", in: "path", required: true, schema: { type: "string" } },
          { name: "noteId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          204: { description: "Note deleted." },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
  },
};

module.exports = swaggerDocument;
