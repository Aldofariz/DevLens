const prisma = require("../config/db");
const asyncWrapper = require("../utils/asyncWrapper");
const { createError } = require("../utils/errorHandler");
const { getOwnedProject } = require("../utils/projectAccess");
const geminiService = require("../services/geminiService");

const getMessages = asyncWrapper(async (req, res) => {
  await getOwnedProject(req.params.projectId, req.user.id);

  const messages = await prisma.message.findMany({
    where: { projectId: req.params.projectId },
    orderBy: { createdAt: "asc" },
  });

  res.status(200).json({ messages });
});

const sendMessage = asyncWrapper(async (req, res) => {
  const { content: rawContent } = req.body || {};
  const content = rawContent && String(rawContent).trim();

  if (!content) {
    throw createError("Message content is required", 400);
  }

  await getOwnedProject(req.params.projectId, req.user.id);

  const result = await geminiService.generateGroundedAnswer(req.params.projectId, content);

  res.status(201).json({
    response: result.response,
    message: result.message,
  });
});

module.exports = {
  getMessages,
  sendMessage,
};
