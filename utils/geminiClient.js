import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const gemini = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash", // Use 'model' instead of 'modelName'
  apiKey: process.env.GEMINI_API_KEY,
  temperature: 0.1,
  maxOutputTokens: 1024,
});