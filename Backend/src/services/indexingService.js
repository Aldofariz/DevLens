const prisma = require("../config/db");

const chunkSize = 2500;
const chunkOverlap = 250;
const maxRetrievedChunks = 8;
const maxRetrievedEntities = 12;

const stopWords = new Set([
  "about",
  "after",
  "again",
  "also",
  "because",
  "before",
  "being",
  "between",
  "could",
  "document",
  "each",
  "from",
  "have",
  "here",
  "into",
  "more",
  "only",
  "other",
  "should",
  "source",
  "than",
  "that",
  "their",
  "there",
  "these",
  "this",
  "through",
  "user",
  "were",
  "what",
  "when",
  "where",
  "which",
  "with",
  "would",
  "your",
]);

const normalize = (value = "") => value.toLowerCase().replace(/[^a-z0-9\s_-]/g, " ");

const getKeywords = (text, limit = 20) => {
  const counts = new Map();
  normalize(text)
    .split(/\s+/)
    .filter((word) => word.length >= 3 && !stopWords.has(word))
    .forEach((word) => counts.set(word, (counts.get(word) || 0) + 1));

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([word]) => word);
};

const chunkText = (text) => {
  const cleanText = String(text || "").trim();
  const chunks = [];
  let cursor = 0;

  while (cursor < cleanText.length) {
    const end = Math.min(cursor + chunkSize, cleanText.length);
    chunks.push(cleanText.slice(cursor, end).trim());
    if (end === cleanText.length) {
      break;
    }
    cursor = Math.max(end - chunkOverlap, cursor + 1);
  }

  return chunks.filter(Boolean);
};

const summarizeText = (text) => {
  const sentences = String(text || "")
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .filter((sentence) => sentence.trim().length > 40);

  return sentences.slice(0, 6).join(" ").slice(0, 2000).trim();
};

const inferEntityType = (name) => {
  if (/api|endpoint|route|http|post|get|patch|delete/i.test(name)) return "api";
  if (/jwt|auth|token|login|logout|register|password/i.test(name)) return "auth";
  if (/database|schema|model|postgres|prisma/i.test(name)) return "data-model";
  if (/service|controller|middleware|route|config/i.test(name)) return "component";
  return "concept";
};

const extractEntities = (text, source) => {
  const candidates = new Map();
  const keywordEntities = getKeywords(text, 35);
  const properNames = String(text || "").match(/\b[A-Z][A-Za-z0-9_-]{2,}(?:\s+[A-Z][A-Za-z0-9_-]{2,}){0,3}\b/g) || [];

  [...keywordEntities, ...properNames].forEach((rawName) => {
    const name = rawName.trim().replace(/\s+/g, " ");
    const key = name.toLowerCase();
    if (name.length < 3 || stopWords.has(key)) {
      return;
    }
    candidates.set(key, name);
  });

  return [...candidates.values()].slice(0, 30).map((name) => {
    const entityType = inferEntityType(name);
    const sourceName = source.fileName || source.storageUrl;
    return {
      name,
      entityType,
      keywords: getKeywords(`${name} ${entityType}`, 8),
      templateText: `Entity "${name}" appears in source "${sourceName}". It is indexed as ${entityType} context for retrieval. WRITE HERE: add custom non-AI entity template text if you want a different deterministic format.`,
    };
  });
};

const indexSource = async (source) => {
  const textContent = source.textContent || "";
  const chunks = chunkText(textContent);
  const entities = extractEntities(textContent, source);
  const summary = summarizeText(textContent);
  const operations = [
    prisma.sourceChunk.deleteMany({ where: { sourceId: source.id } }),
    prisma.sourceEntity.deleteMany({ where: { sourceId: source.id } }),
    prisma.sourceSummary.deleteMany({ where: { sourceId: source.id } }),
  ];

  if (chunks.length) {
    operations.push(prisma.sourceChunk.createMany({
      data: chunks.map((content, index) => ({
        sourceId: source.id,
        projectId: source.projectId,
        index,
        content,
        keywords: getKeywords(content),
      })),
    }));
  }

  if (entities.length) {
    operations.push(prisma.sourceEntity.createMany({
      data: entities.map((entity) => ({
        sourceId: source.id,
        projectId: source.projectId,
        name: entity.name,
        entityType: entity.entityType,
        templateText: entity.templateText,
        keywords: entity.keywords,
      })),
    }));
  }

  operations.push(
    prisma.sourceSummary.create({
      data: {
        sourceId: source.id,
        projectId: source.projectId,
        content: summary || `Source "${source.fileName || source.storageUrl}" has no extractive summary available.`,
      },
    })
  );

  await prisma.$transaction(operations);

  return {
    chunkCount: chunks.length,
    entityCount: entities.length,
  };
};

const scoreByKeywords = (queryKeywords, item) => {
  const haystack = new Set([...(item.keywords || []), ...getKeywords(`${item.name || ""} ${item.content || ""} ${item.templateText || ""}`, 30)]);
  return queryKeywords.reduce((score, keyword) => score + (haystack.has(keyword) ? 1 : 0), 0);
};

const retrieveContext = async (projectId, query) => {
  const queryKeywords = getKeywords(query, 20);
  const [chunks, entities, summaries] = await Promise.all([
    prisma.sourceChunk.findMany({ where: { projectId }, orderBy: { createdAt: "asc" } }),
    prisma.sourceEntity.findMany({ where: { projectId }, orderBy: { createdAt: "asc" } }),
    prisma.sourceSummary.findMany({ where: { projectId }, orderBy: { createdAt: "asc" } }),
  ]);

  const rankedChunks = chunks
    .map((chunk) => ({ ...chunk, score: scoreByKeywords(queryKeywords, chunk) }))
    .filter((chunk) => chunk.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, maxRetrievedChunks);

  const rankedEntities = entities
    .map((entity) => ({ ...entity, score: scoreByKeywords(queryKeywords, entity) }))
    .filter((entity) => entity.score > 0)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, maxRetrievedEntities);

  const fallbackChunks = rankedChunks.length ? rankedChunks : chunks.slice(0, Math.min(3, chunks.length));

  return {
    summaries,
    chunks: fallbackChunks,
    entities: rankedEntities,
    hasContext: summaries.length > 0 || fallbackChunks.length > 0 || rankedEntities.length > 0,
  };
};

const formatRetrievedContext = ({ summaries, chunks, entities }) => [
  "--- SOURCE SUMMARIES ---",
  summaries.map((summary) => summary.content).join("\n\n") || "No summaries available.",
  "--- RETRIEVED ENTITIES ---",
  entities.map((entity) => entity.templateText).join("\n") || "No matching entities found.",
  "--- RETRIEVED CHUNKS ---",
  chunks.map((chunk) => `Chunk ${chunk.index + 1}:\n${chunk.content}`).join("\n\n") || "No matching chunks found.",
].join("\n");

module.exports = {
  chunkText,
  getKeywords,
  indexSource,
  retrieveContext,
  formatRetrievedContext,
};
