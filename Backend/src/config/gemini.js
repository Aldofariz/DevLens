require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const getGeminiModel = () => {
  if (!genAI) {
    const error = new Error("GEMINI_API_KEY is not configured");
    error.statusCode = 500;
    throw error;
  }

  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};

module.exports = {
  getGeminiModel,
};
