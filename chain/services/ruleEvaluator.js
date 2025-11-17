import { gemini } from "../../utils/geminiClient.js";

export const evaluateRules = async (description, samples) => {

  const systemPrompt = `
You are a SECURE Rule Evaluator.

Your job:
1. Analyze the description and the provided sample patterns.
2. Detect whether ANY of the inferred rules or possible regex patterns would require unsafe or REDOS-vulnerable structures.

A REDOS risk exists if ANY of the following would be needed:
- Nested quantifiers (e.g., (a+)+, (.*)+, (.+)+)
- Unbounded dot-star or plus-star patterns (e.g., .*, .+, (.*){m,})
- Catastrophic backtracking structures (e.g., (ab|a)+, (.*a.*)*, ambiguous overlapping alternations)
- Repetitive groups over ambiguous tokens
- Backtracking-heavy alternations with repetition

If ANY risk is detected:
Return EXACTLY the following JSON:
{
  "error": "REDOS detected"
}

Otherwise, extract the strict structural rules that the samples follow.
The rules must describe the fixed structure, not a regex. (Example: “Starts with 2 letters”, “Ends with 1 digit”.)

Return JSON ONLY in this format:
{
  "rules": [
    { "rule": "..." },
    { "rule": "..." }
  ]
}

DO NOT return explanations.
DO NOT return regex.
DO NOT return markdown.
DO NOT wrap output in code fences.
Return JSON ONLY.
`;

  const userPrompt = `
Description: ${description}

Samples:
${samples.map(s => "- " + s).join("\n")}
`;

  const response = await gemini.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]
  });

  return response.choices[0].message.content;
};
