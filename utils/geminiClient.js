// utils/geminiClient.js
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// Remove the problematic import - we'll use a different approach

export const gemini = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  apiKey: process.env.GEMINI_API_KEY,
  temperature: 0.1,
  maxOutputTokens: 1024,
});

// Simple wrapper function for Gemini calls
export const tracedGeminiInvoke = async (messages, metadata = {}) => {
  try {
    console.log("🤖 Calling Gemini...");
    const startTime = Date.now();
    
    const response = await gemini.invoke(messages);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`✅ Gemini call completed in ${duration}ms`);
    
    return {
      content: response.content,
      metadata: {
        ...metadata,
        model: "gemini-2.0-flash",
        duration: `${duration}ms`,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error("❌ Gemini call failed:", error);
    throw error;
  }
};

// Test function
export const testConnection = async () => {
  try {
    const response = await gemini.invoke("Hello");
    console.log("✓ Gemini connection successful");
    return true;
  } catch (error) {
    console.error("❌ Gemini connection failed:", error.message);
    return false;
  }
};

export default gemini;