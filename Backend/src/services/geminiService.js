const prisma = require("../config/db");
const { getGeminiModel } = require("../config/gemini");
const indexingService = require("./indexingService");

const fallbackAnswer = "I could not find that information in the provided documents.";
const maxContextCharacters = 60000;
const customSystemPromptPlaceholder = "WRITE HERE: paste your custom DevLens Gemini system prompt here.";

const formatHistory = (messages) =>
  messages
    .map((message) => `${message.role === "assistant" ? "AI" : "User"}: ${message.content}`)
    .join("\n");

const buildPrompt = ({ sourceContext, history, userMessage }) => `SYSTEM: You are DevLens AI. Answer questions ONLY based on the documents provided below.
If the answer cannot be found in the documents, say "${fallbackAnswer}"
Do not use any outside knowledge.

CUSTOM SYSTEM PROMPT:
${customSystemPromptPlaceholder}

--- DOCUMENT CONTEXT ---
${sourceContext || "No document context provided."}
--- END OF CONTEXT ---

--- CONVERSATION HISTORY ---
${history || "No previous messages."}
--- END OF HISTORY ---

User: ${userMessage}
AI:`;

const getRecentHistory = async (projectId) => {
  const messages = await prisma.message.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return messages.reverse();
};

const generateGroundedAnswer = async (projectId, userMessage) => {
  const retrievedContext = await indexingService.retrieveContext(projectId, userMessage);
  const sourceContext = indexingService.formatRetrievedContext(retrievedContext).slice(0, maxContextCharacters);
  const recentMessages = await getRecentHistory(projectId);
  const history = formatHistory(recentMessages);

  let assistantResponse = fallbackAnswer;

  if (retrievedContext.hasContext && sourceContext.trim()) {
    const prompt = buildPrompt({
      sourceContext,
      history,
      userMessage,
    });
    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    assistantResponse = result.response.text().trim() || fallbackAnswer;
  }

  const [userRecord, assistantRecord] = await prisma.$transaction([
    prisma.message.create({
      data: {
        projectId,
        role: "user",
        content: userMessage,
      },
    }),
    prisma.message.create({
      data: {
        projectId,
        role: "assistant",
        content: assistantResponse,
      },
    }),
  ]);

  return {
    message: assistantRecord,
    userMessage: userRecord,
    response: assistantResponse,
  };
};

module.exports = {
  fallbackAnswer,
  customSystemPromptPlaceholder,
  buildPrompt,
  formatHistory,
  generateGroundedAnswer,
};
