const prisma = require("../config/db");
const { createError } = require("./errorHandler");

const getOwnedProject = async (projectId, userId) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
    },
  });

  if (!project) {
    throw createError("Project not found", 404);
  }

  return project;
};

module.exports = {
  getOwnedProject,
};
