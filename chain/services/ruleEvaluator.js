import { gemini } from "../../utils/geminiClient.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export const evaluateRules = async (description, samples) => {
  const systemPrompt = `# SECURE RULE EVALUATOR - CRITICAL SECURITY CONSTRAINTS

## PRIMARY MISSION:
Analyze user input for regex security risks and extract SAFE structural rules.

## REDOS VULNERABILITY DETECTION - IMMEDIATE REJECTION TRIGGERS:
🔴 **ABSOLUTELY FORBIDDEN PATTERNS:**
- Nested quantifiers: (.+)+, (.*)*, (a+)+, (\\w+)*+
- Exponential backtracking: (.*a)*, (.+b)+, (a|ab)*
- Ambiguous alternations: (a|aa)*, (ab|a)+
- Unbounded repetitions: .*, .+, \\s*, \\S+ without anchors
- Complex nested structures: (a*)*, ((a|b)+)+

## SECURITY ASSESSMENT CRITERIA:
1. **Input Complexity**: Does description suggest variable-length patterns?
2. **Sample Analysis**: Do samples show exponential matching possibilities?
3. **Structural Risk**: Would any reasonable regex require backtracking?
4. **Anchoring**: Can pattern be safely anchored with ^ and $?

## SAFE RULE EXTRACTION GUIDELINES:
✅ **ALLOWED RULE TYPES:**
- Fixed positions: "Starts with 2 uppercase letters"
- Specific counts: "Contains exactly 6 digits" 
- Limited ranges: "Between 3-5 lowercase characters"
- Explicit character classes: "Uses only alphanumeric and hyphens"
- Ordered sequences: "Letters followed by digits followed by one letter"

## DECISION WORKFLOW:
1. **RISK DETECTED** → Return: {"error": "REDOS detected"}
2. **SAFE INPUT** → Extract precise structural rules

## OUTPUT FORMAT - STRICT JSON ONLY:
{
  "rules": [
    {"rule": "Clear structural description without regex"},
    {"rule": "Another specific constraint"}
  ]
}

## ZERO TOLERANCE POLICY:
- NO regex patterns in rules
- NO markdown, explanations, or code fences
- NO ambiguous or complex descriptions
- ONLY simple, verifiable structural rules

**IMMEDIATE REJECTION FOR ANY POTENTIAL SECURITY RISK.**`;

  const userPrompt = `## PATTERN ANALYSIS REQUEST

**Description:** ${description}

**Sample Patterns:**
${samples.map((s, i) => `${i + 1}. ${s}`).join('\n')}

**Sample Count:** ${samples.length}
**Analysis Required:** Security assessment + rule extraction

## CRITICAL REMINDER:
- REJECT if any risk of exponential backtracking
- REJECT if patterns suggest variable complexity
- EXTRACT only if 100% safe and deterministic`;

  try {
    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(userPrompt)
    ];

    const response = await gemini.invoke(messages);
    
    // Handle the response - it might be a string or object
    if (typeof response.content === 'string') {
      return response.content;
    } else if (response.content) {
      return JSON.stringify(response.content);
    } else {
      throw new Error("Empty response from AI");
    }
  } catch (error) {
    console.error("Error in rule evaluation:", error);
    throw new Error("Failed to evaluate rules: " + error.message);
  }
};