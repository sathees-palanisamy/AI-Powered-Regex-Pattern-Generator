// graph/nodes/patternOptimizer.js
import { gemini } from "../../utils/geminiClient.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

// Helper function to clean and parse JSON
function parseRulesJson(rulesJson) {
  if (!rulesJson) {
    throw new Error("Empty rules JSON");
  }

  // Clean the JSON string first
  let cleaned = rulesJson.replace(/```json\s*/g, '')
                        .replace(/\s*```/g, '')
                        .trim();
  
  // Remove any non-JSON prefixes/suffixes
  cleaned = cleaned.replace(/^[^{[]*/, '')
                   .replace(/[^}\]]*$/, '')
                   .trim();

  try {
    const parsed = JSON.parse(cleaned);
    
    // Check for REDOS detection from previous step
    if (parsed.error === "REDOS detected") {
      return { error: "REDOS detected" };
    }
    
    return parsed;
  } catch (parseError) {
    console.error("Failed to parse rules JSON:", parseError.message);
    console.error("Raw content that failed:", rulesJson.substring(0, 200));
    throw new Error(`Invalid rules JSON: ${parseError.message}`);
  }
}

export async function patternOptimizer(state) {
  const { rulesJson } = state;
  
  const systemPrompt = `You are a REDOS-safe Pattern Optimizer.

Your rules:
- NEVER generate nested quantifiers: (.+)+, (.*)+, (a+)+
- NEVER generate patterns using catastrophic backtracking
- NEVER use unbounded .* or .+ unless anchored and safe
- ALWAYS prefer explicit character classes over dot-star
- ALWAYS return SAFE, LINEAR-TIME regex constructions
- If the user request requires an unsafe regex → return:
  { "error": "REDOS detected" }

Return PURE JSON only - no markdown, no explanations, no code blocks:

{
  "pattern": "safe-regex-pattern",
  "explanation": "clear explanation of the pattern",
  "tests": {
    "valid": ["example1", "example2"],
    "invalid": ["bad1", "bad2"]
  }
}`;

  try {
    console.log("⚡ Optimizing pattern from rules");
    
    // Parse and validate the rules from previous step
    const rules = parseRulesJson(rulesJson);
    
    // If previous step detected REDOS, propagate it
    if (rules.error === "REDOS detected") {
      return {
        resultJson: JSON.stringify({ error: "REDOS detected" })
      };
    }

    console.log("📋 Using rules:", rules);

    const response = await gemini.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(JSON.stringify(rules))
    ]);

    // Clean the response
    let cleanedResult = response.content.replace(/```json\s*/g, '')
                                      .replace(/\s*```/g, '')
                                      .trim();

    console.log("✅ Pattern optimization completed");

    // Return the state with resultJson updated
    return {
      resultJson: cleanedResult
    };
  } catch (error) {
    console.error("Error in pattern optimizer:", error);
    return {
      resultJson: JSON.stringify({ 
        error: "Pattern optimization failed",
        details: error.message 
      })
    };
  }
}