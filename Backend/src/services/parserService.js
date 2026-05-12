const { PDFParse } = require("pdf-parse");
const cheerio = require("cheerio");
const { getGeminiModel } = require("../config/gemini");
const { createError } = require("../utils/errorHandler");

const supportedMimeTypes = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "text/markdown",
  "text/x-markdown",
  "text/plain",
]);

const supportedExtensions = new Set([".pdf", ".png", ".jpg", ".jpeg", ".md", ".markdown"]);

const getExtension = (fileName = "") => {
  const index = fileName.lastIndexOf(".");
  return index >= 0 ? fileName.slice(index).toLowerCase() : "";
};

const isSupportedFile = (file) => {
  const extension = getExtension(file.originalname);
  return supportedMimeTypes.has(file.mimetype) || supportedExtensions.has(extension);
};

const normalizeText = (value = "") => value.replace(/\s+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();

const stripMarkdown = (markdown) =>
  markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~>#-]/g, " ");

const extractPdfText = async (buffer) => {
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return normalizeText(result.text);
  } finally {
    await parser.destroy();
  }
};

const extractImageText = async (file) => {
  const model = getGeminiModel();
  const result = await model.generateContent([
    {
      inlineData: {
        data: file.buffer.toString("base64"),
        mimeType: file.mimetype,
      },
    },
    "Extract all readable technical documentation text from this image. Return plain text only.",
  ]);

  return normalizeText(result.response.text());
};

const extractMarkdownText = (buffer) => normalizeText(stripMarkdown(buffer.toString("utf8")));

const extractTextFromFile = async (file) => {
  const extension = getExtension(file.originalname);

  if (file.mimetype === "application/pdf" || extension === ".pdf") {
    return extractPdfText(file.buffer);
  }

  if (file.mimetype === "image/png" || file.mimetype === "image/jpeg" || [".png", ".jpg", ".jpeg"].includes(extension)) {
    return extractImageText(file);
  }

  if ([".md", ".markdown"].includes(extension) || file.mimetype === "text/markdown" || file.mimetype === "text/x-markdown" || file.mimetype === "text/plain") {
    return extractMarkdownText(file.buffer);
  }

  throw createError("Unsupported source file type", 400);
};

const extractTextFromUrl = async (url) => {
  const parsedUrl = new URL(url);
  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw createError("Only HTTP and HTTPS URLs are supported", 400);
  }

  const response = await fetch(url, {
    headers: {
      "user-agent": "DevLensBot/1.0",
    },
  });

  if (!response.ok) {
    throw createError("Unable to fetch source URL", 400);
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  $("script, style, noscript, svg").remove();

  return normalizeText($("body").text() || $.root().text());
};

module.exports = {
  extractTextFromFile,
  extractTextFromUrl,
  isSupportedFile,
  getExtension,
  normalizeText,
};
