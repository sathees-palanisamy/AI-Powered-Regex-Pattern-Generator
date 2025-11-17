import { gemini } from "../../utils/geminiClient.js";

export const optimizePattern = async (rules) => {

  const systemPrompt = `
You are a REDOS-safe Pattern Optimizer.

Your rules:
- NEVER generate nested quantifiers: (.+)+, (.*)+, (a+)+
- NEVER generate patterns using catastrophic backtracking
- NEVER use unbounded .* or .+ unless anchored and safe
- ALWAYS prefer explicit character classes over dot-star
- ALWAYS return SAFE, LINEAR-TIME regex constructions
- If the user request requires an unsafe regex → return:
  { "error": "REDOS detected" }

Return JSON only:
{
  "pattern": "",
  "explanation": "",
  "tests": {
    "valid": [],
    "invalid": []
  }
}
`;

  const response = await gemini.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: JSON.stringify(rules) }
    ]
  });

  return response.choices[0].message.content;
};
