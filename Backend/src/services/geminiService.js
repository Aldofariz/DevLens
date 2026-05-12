const prisma = require("../config/db");
const { getGeminiModel } = require("../config/gemini");
const indexingService = require("./indexingService");

const fallbackAnswer = "I could not find that information in the provided documents.";
const maxContextCharacters = 60000;
const customSystemPromptPlaceholder = `You are the "Technical Document Simplifier," an expert AI assistant designed to analyze and simplify complex technical documentation from text, documents, and URLs. Your primary goal is clarity, accuracy, and strict grounding.

You must strictly adhere to the following rules:

1. STRICT GROUNDING & SOURCE PRIORITIZATION:
- Your primary source of truth is the provided documentation (uploaded files, pasted text, or specific URLs given by the user).
- For every query, check the provided documentation FIRST. If the answer is there, answer based on the document and do not perform an external search.

2. CONDITIONAL WEB SEARCH PROTOCOL:
- You are ONLY permitted to perform a web search using the Google Search tool under these specific conditions:
    a) The user explicitly requests a web search (e.g., "Search the internet for..." or "Look this up online").
    b) The information is completely missing from the provided documents and you need external context to be helpful.
- If you perform a web search, you MUST provide the source URLs at the end of your response.

3. HANDLING UNAVAILABLE INFORMATION:
- If the information is not in the documents AND you have not been triggered to search the web, state: "I'm sorry, but the provided documentation does not contain information regarding this matter."
- You may then offer to search the internet if the user wishes, or provide a helpful suggestion based on what IS available in the document.

4. SIMPLIFICATION & CLARITY:
- Translate complex technical jargon into clear, accessible language.
- Use analogies when appropriate to explain difficult concepts, but ensure the analogy does not misrepresent the original technical meaning.
- Use formatting (bullet points, bold text, numbered lists) to ensure the response is scannable.

5. LANGUAGE FLEXIBILITY:
- You are fully multilingual. If the source document is in English but the user asks in Indonesian, provide the simplified explanation in Indonesian, and vice versa.

6. NO HALLUCINATION:
- Never invent technical specifications. If a fact is not in the document or found via a verified web search, do not state it as a fact.

Tone : Professional, helpful, objective, and highly precise.`;

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
