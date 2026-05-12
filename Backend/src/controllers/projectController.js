const prisma = require("../config/db");
const asyncWrapper = require("../utils/asyncWrapper");
const { createError } = require("../utils/errorHandler");
const { getOwnedProject } = require("../utils/projectAccess");

const listProjects = asyncWrapper(async (req, res) => {
  const projects = await prisma.project.findMany({
    where: { userId: req.user.id },
    orderBy: { updatedAt: "desc" },
  });

  res.status(200).json({ projects });
});

const createProject = asyncWrapper(async (req, res) => {
  const { title: rawTitle } = req.body || {};
  const title = rawTitle && String(rawTitle).trim();

  if (!title) {
    throw createError("Project title is required", 400);
  }

  const project = await prisma.project.create({
    data: {
      title,
      userId: req.user.id,
    },
  });

  res.status(201).json({ project });
});

const updateProject = asyncWrapper(async (req, res) => {
  const { title: rawTitle } = req.body || {};
  const title = rawTitle && String(rawTitle).trim();

  if (!title) {
    throw createError("Project title is required", 400);
  }

  await getOwnedProject(req.params.id, req.user.id);

  const project = await prisma.project.update({
    where: { id: req.params.id },
    data: { title },
  });

  res.status(200).json({ project });
});

const deleteProject = asyncWrapper(async (req, res) => {
  await getOwnedProject(req.params.id, req.user.id);

  await prisma.project.delete({
    where: { id: req.params.id },
  });

  res.status(204).send();
});

module.exports = {
  listProjects,
  createProject,
  updateProject,
  deleteProject,
};
