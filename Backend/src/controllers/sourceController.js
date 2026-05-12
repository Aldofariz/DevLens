const prisma = require("../config/db");
const asyncWrapper = require("../utils/asyncWrapper");
const { createError } = require("../utils/errorHandler");
const { getOwnedProject } = require("../utils/projectAccess");
const storageService = require("../services/storageService");
const parserService = require("../services/parserService");
const indexingService = require("../services/indexingService");

const listSources = asyncWrapper(async (req, res) => {
  await getOwnedProject(req.params.projectId, req.user.id);

  const sources = await prisma.source.findMany({
    where: { projectId: req.params.projectId },
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({ sources });
});

const createFileSource = async (projectId, file) => {
  if (!parserService.isSupportedFile(file)) {
    throw createError("Unsupported source file type", 400);
  }

  let uploadedFile;

  try {
    uploadedFile = await storageService.uploadFile(file);
    const textContent = await parserService.extractTextFromFile(file);

    const source = await prisma.source.create({
      data: {
        projectId,
        fileName: file.originalname,
        fileType: file.mimetype,
        storageUrl: uploadedFile.storageUrl,
        textContent,
      },
    });

    const indexStats = await indexingService.indexSource(source);
    return { ...source, indexStats };
  } catch (error) {
    if (uploadedFile && uploadedFile.storageUrl) {
      await storageService.deleteFile(uploadedFile.storageUrl);
    }
    throw error;
  }
};

const createUrlSource = async (projectId, url) => {
  let parsedUrl;

  try {
    parsedUrl = new URL(url);
  } catch (_error) {
    throw createError("A valid URL is required", 400);
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw createError("Only HTTP and HTTPS URLs are supported", 400);
  }

  const textContent = await parserService.extractTextFromUrl(parsedUrl.toString());

  const source = await prisma.source.create({
    data: {
      projectId,
      fileName: parsedUrl.hostname,
      fileType: "url",
      storageUrl: parsedUrl.toString(),
      textContent,
    },
  });

  const indexStats = await indexingService.indexSource(source);
  return { ...source, indexStats };
};

const createSource = asyncWrapper(async (req, res) => {
  await getOwnedProject(req.params.projectId, req.user.id);

  if (req.file) {
    const source = await createFileSource(req.params.projectId, req.file);
    res.status(201).json({ source });
    return;
  }

  const { url } = req.body || {};

  if (url) {
    const source = await createUrlSource(req.params.projectId, url);
    res.status(201).json({ source });
    return;
  }

  throw createError("Upload a file or provide a URL", 400);
});

const deleteSource = asyncWrapper(async (req, res) => {
  await getOwnedProject(req.params.projectId, req.user.id);

  const source = await prisma.source.findFirst({
    where: {
      id: req.params.sourceId,
      projectId: req.params.projectId,
    },
  });

  if (!source) {
    throw createError("Source not found", 404);
  }

  if (source.fileType !== "url") {
    await storageService.deleteFile(source.storageUrl);
  }

  await prisma.source.delete({
    where: { id: source.id },
  });

  res.status(204).send();
});

module.exports = {
  listSources,
  createSource,
  deleteSource,
};
