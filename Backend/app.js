require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");

const authRoutes = require("./src/routes/authRoutes");
const projectRoutes = require("./src/routes/projectRoutes");
const sourceRoutes = require("./src/routes/sourceRoutes");
const messageRoutes = require("./src/routes/messageRoutes");
const noteRoutes = require("./src/routes/noteRoutes");
const swaggerDocument = require("./src/docs/swagger");
const errorHandler = require("./src/utils/errorHandler");

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "devlens-backend" });
});

app.get("/api-docs.json", (_req, res) => {
  res.status(200).json(swaggerDocument);
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/projects/:projectId/sources", sourceRoutes);
app.use("/api/projects/:projectId/messages", messageRoutes);
app.use("/api/projects/:projectId/notes", noteRoutes);

app.use((_req, _res, next) => {
  const error = new Error("Route not found");
  error.statusCode = 404;
  next(error);
});

app.use(errorHandler);

module.exports = app;
