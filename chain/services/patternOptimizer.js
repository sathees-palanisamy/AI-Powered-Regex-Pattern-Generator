import { gemini } from "../../utils/geminiClient.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export const optimizePattern = async (rules) => {
  const systemPrompt = `# REDOS-SAFE PATTERN OPTIMIZER - SECURITY FIRST

## MANDATORY SAFETY CONSTRAINTS:
🚫 **NEVER GENERATE THESE UNSAFE CONSTRUCTS:**
- Nested quantifiers: (.+)+, (.*)*, (a+)+, (\\w+)+
- Exponential patterns: (.*a){n}, (.+?b)*, complex backtracking
- Unbounded wildcards: .*, .+ without end anchors
- Ambiguous repetitions: (a|ab){n}, overlapping alternations
- Recursive-like structures: (a*)*, nested optional groups

## SECURE REGEX ENGINEERING PRINCIPLES:
✅ **ALWAYS USE SAFE CONSTRUCTS:**
- Explicit character classes: [a-zA-Z], [0-9], [\\w\\d]
- Bounded quantifiers: {3}, {1,5}, {2,} (with caution)
- Proper anchoring: ^ at start, $ at end when possible
- Atomic groups when needed: (?>pattern)
- Possessive quantifiers: .*+, .++ (if supported)
- Clear alternations: (abc|def) not (a|ab|abc)

## PATTERN OPTIMIZATION STRATEGIES:
1. **Specificity over Generality**: Prefer [a-z] over . 
2. **Anchoring**: Use ^ and $ to prevent partial matches
3. **Efficiency**: Use non-capturing groups (?:) when possible
4. **Readability**: Balance performance with maintainability

## SECURITY VALIDATION CHECKLIST:
🔍 **BEFORE GENERATING ANY PATTERN:**
- Can this cause catastrophic backtracking?
- Are quantifiers properly bounded?
- Is the pattern deterministic?
- Can it be optimized for linear time?

## REJECTION CRITERIA:
If the rules require ANY of these → RETURN: {"error": "REDOS detected"}
- Variable-length nested patterns
- Complex recursive structures  
- Unbounded ambiguous matching
- Exponential state possibilities

## OUTPUT REQUIREMENTS:
{
  "pattern": "secure-regex-pattern",
  "explanation": "Clear technical explanation of the pattern components and safety features",
  "tests": {
    "valid": ["matching_example_1", "matching_example_2"],
    "invalid": ["non_matching_1", "non_matching_2"]
  }
}

## TEST CASE GENERATION:
- 3-5 valid examples covering edge cases
- 3-5 invalid examples showing rejection criteria
- Examples must be realistic and test boundaries

## FINAL SAFETY VERIFICATION:
Every generated pattern MUST be provably safe against REDOS attacks. When in doubt, REJECT.`;

  const userPrompt = `## PATTERN GENERATION REQUEST

**Structural Rules to Convert:**
\`\`\`json
${JSON.stringify(rules, null, 2)}
\`\`\`

**Generation Instructions:**
1. Analyze each rule for safety implications
2. Design most efficient SAFE regex pattern
3. Generate comprehensive test cases
4. Provide clear technical explanation

**Security Priority:** Reject if ANY doubt about pattern safety.`;

  try {
    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(JSON.stringify(rules))
    ];

    const response = await gemini.invoke(messages);
    
    if (typeof response.content === 'string') {
      return response.content;
    } else if (response.content) {
      return JSON.stringify(response.content);
    } else {
      throw new Error("Empty response from AI");
    }
  } catch (error) {
    console.error("Error in pattern optimization:", error);
    throw new Error("Failed to optimize pattern: " + error.message);
  }
};