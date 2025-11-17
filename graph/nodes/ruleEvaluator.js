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
You are a Rule Evaluator.

Extract strict rules from the description and samples.
Return JSON only:
{
  "rules": [
    { "rule": "..." }
  ]
}`;

  console.log('state.description:', state.description);
  console.log('state.samples:', state.samples);

  // Create a proper content string from the state
  const userContent = `
Description: ${state.description}
Samples: ${JSON.stringify(state.samples)}
`;

  const res = await model.invoke([
    { role: "system", content: prompt },
    { role: "user", content: userContent }
  ]);

  console.log('res.content:', res.content);

  return {
    rulesJson: res.content
  };
};