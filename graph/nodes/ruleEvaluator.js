// graph/nodes/ruleEvaluator.js
import { tracedGeminiInvoke } from "../../utils/geminiClient.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

// Helper function to clean JSON response
function cleanJsonResponse(text) {
  if (!text) return text;
  
  let cleaned = text.replace(/```json\s*/g, '')
                   .replace(/\s*```/g, '')
                   .trim();
  
  cleaned = cleaned.replace(/^[^{[]*/, '')
                   .replace(/[^}\]]*$/, '')
                   .trim();
  
  return cleaned;
}

export async function ruleEvaluator(state) {
  const { description, samples } = state;
  
  const systemPrompt = `You are a SECURE Rule Evaluator.

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
The rules must describe the fixed structure, not a regex. (Example: "Starts with 2 letters", "Ends with 1 digit".)

Return JSON ONLY in this format:
{
  "rules": [
    { "rule": "..." },
    { "rule": "..." }
  ]
}

IMPORTANT: Return PURE JSON only. No markdown code blocks, no explanations, no additional text.`;

  const userPrompt = `Description: ${description}

Samples:
${samples.map(s => "- " + s).join("\n")}`;

  try {
    console.log("🔍 Evaluating rules for:", description.substring(0, 50));
    
    const response = await tracedGeminiInvoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(userPrompt)
    ], {
      step: "rule_evaluation",
      description_length: description.length,
      sample_count: samples.length
    });

    // Clean the response before returning
    const cleanedResponse = cleanJsonResponse(response.content);
    console.log("✅ Cleaned rules response:", cleanedResponse);

    return {
      rulesJson: cleanedResponse
    };
  } catch (error) {
    console.error("Error in rule evaluator:", error);
    return {
      rulesJson: JSON.stringify({ error: "Rule evaluation failed" })
    };
  }
}

export default ruleEvaluator;