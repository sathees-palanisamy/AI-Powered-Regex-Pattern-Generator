const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0,
  apiKey: process.env.GOOGLE_API_KEY,
  apiVersion: "v1beta",
  baseUrl: "https://generativelanguage.googleapis.com",
  authMode: "api-key"      
});

module.exports = async (state) => {
  const prompt = `
You are a Pattern Optimizer.

Convert rules into:
- optimized pattern
- explanation
- test cases

Return JSON only:
{
  "pattern": "",
  "explanation": "",
  "tests": {
    "valid": [],
    "invalid": []
  }
}`;

  console.log('state.rulesJson:', state.rulesJson);

  const res = await model.invoke([
    { role: "system", content: prompt },
    { role: "user", content: state.rulesJson }
  ]);

  console.log('res.content:', res.content);

  return {
    resultJson: res.content
  };
};