const prisma = require("../config/db");
const asyncWrapper = require("../utils/asyncWrapper");
const { createError } = require("../utils/errorHandler");
const { getOwnedProject } = require("../utils/projectAccess");

const listNotes = asyncWrapper(async (req, res) => {
  await getOwnedProject(req.params.projectId, req.user.id);

  const notes = await prisma.note.findMany({
    where: { projectId: req.params.projectId },
    orderBy: { updatedAt: "desc" },
  });

  res.status(200).json({ notes });
});

const createNote = asyncWrapper(async (req, res) => {
  await getOwnedProject(req.params.projectId, req.user.id);

  const note = await prisma.note.create({
    data: {
      projectId: req.params.projectId,
      title: req.body && req.body.title ? String(req.body.title).trim() : null,
      content: req.body && req.body.content ? String(req.body.content) : null,
    },
  });

  res.status(201).json({ note });
});

const updateNote = asyncWrapper(async (req, res) => {
  await getOwnedProject(req.params.projectId, req.user.id);

  const existingNote = await prisma.note.findFirst({
    where: {
      id: req.params.noteId,
      projectId: req.params.projectId,
    },
  });

  if (!existingNote) {
    throw createError("Note not found", 404);
  }

  const data = {};
  const body = req.body || {};
  if (Object.prototype.hasOwnProperty.call(body, "title")) {
    data.title = body.title ? String(body.title).trim() : null;
  }
  if (Object.prototype.hasOwnProperty.call(body, "content")) {
    data.content = body.content ? String(body.content) : null;
  }

  const note = await prisma.note.update({
    where: { id: existingNote.id },
    data,
  });

  res.status(200).json({ note });
});

const deleteNote = asyncWrapper(async (req, res) => {
  await getOwnedProject(req.params.projectId, req.user.id);

  const existingNote = await prisma.note.findFirst({
    where: {
      id: req.params.noteId,
      projectId: req.params.projectId,
    },
  });

  if (!existingNote) {
    throw createError("Note not found", 404);
  }

  await prisma.note.delete({
    where: { id: existingNote.id },
  });

  res.status(204).send();
});

module.exports = {
  listNotes,
  createNote,
  updateNote,
  deleteNote,
};
