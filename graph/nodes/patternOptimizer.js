// graph/nodes/patternOptimizer.js
import { tracedGeminiInvoke } from "../../utils/geminiClient.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

// Helper function to clean and parse JSON
function parseRulesJson(rulesJson) {
  if (!rulesJson) {
    throw new Error("Empty rules JSON received");
  }

  console.log("🧹 Cleaning rules JSON...");
  
  let cleaned = rulesJson.replace(/```json\s*/g, '')
                        .replace(/\s*```/g, '')
                        .trim();
  
  cleaned = cleaned.replace(/^[^{[]*/, '')
                   .replace(/[^}\]]*$/, '')
                   .trim();

  console.log("📐 Rules JSON length:", cleaned.length);

  try {
    const parsed = JSON.parse(cleaned);
    
    if (parsed.error === "REDOS detected") {
      console.log("🛑 REDOS detected in rules, propagating error");
      return { error: "REDOS detected", source: "rule_evaluator" };
    }
    
    console.log("✅ Successfully parsed rules JSON");
    console.log("📋 Rules count:", parsed.rules?.length || 0);
    
    return parsed;
  } catch (parseError) {
    console.error("❌ Failed to parse rules JSON:", parseError.message);
    
    const errorDetails = {
      message: parseError.message,
      rulesJsonLength: rulesJson.length,
      cleanedLength: cleaned.length,
      preview: cleaned.substring(0, 300),
      errorType: "JSON_PARSE_ERROR"
    };
    
    throw new Error(`Invalid rules JSON: ${JSON.stringify(errorDetails)}`);
  }
}

// Security validation for generated patterns
function validatePatternSecurity(pattern, rules) {
  console.log("🛡️ Validating pattern security...");
  
  const securityIssues = [];
  const redosIndicators = [
    { pattern: /\(\.[*+]\)[*+]/, name: "nested_dot_quantifiers" },
    { pattern: /\([^)]*[*+]\)[*+]/, name: "nested_quantifiers" },
    { pattern: /\.\*.*\.\*/, name: "multiple_unbounded_dots" },
    { pattern: /\\?\.\[\*\+]/, name: "dot_with_quantifier" },
    { pattern: /\(\??\.\*\)[*+?]/, name: "nested_dot_star" },
    { pattern: /\(\??\.\+\)[*+?]/, name: "nested_dot_plus" }
  ];

  // Check for security issues
  redosIndicators.forEach(indicator => {
    if (indicator.pattern.test(pattern)) {
      securityIssues.push({
        type: "REDOS_RISK",
        pattern: indicator.name,
        description: `Unsafe regex construct detected: ${indicator.name}`,
        severity: "HIGH"
      });
    }
  });

  // Check pattern complexity
  const complexityScore = pattern.length * (pattern.split('|').length + pattern.split('*').length + pattern.split('+').length);
  if (complexityScore > 1000) {
    securityIssues.push({
      type: "HIGH_COMPLEXITY",
      score: complexityScore,
      description: "Pattern complexity score exceeds safe threshold",
      severity: "MEDIUM"
    });
  }

  if (securityIssues.length > 0) {
    console.log("🚨 Security issues detected:", securityIssues);
    return {
      safe: false,
      issues: securityIssues,
      recommendation: "Pattern rejected due to security concerns"
    };
  }

  console.log("✅ Pattern security validation passed");
  return {
    safe: true,
    complexityScore,
    issues: []
  };
}

// Enhanced pattern optimization with comprehensive logging
export async function patternOptimizer(state) {
  const { rulesJson } = state;
  
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

## OUTPUT REQUIREMENTS:
Return PURE JSON only - no markdown, no explanations, no code blocks:

{
  "pattern": "safe-regex-pattern",
  "explanation": "Clear technical explanation including safety features",
  "tests": {
    "valid": ["matching_example_1", "matching_example_2", "matching_example_3"],
    "invalid": ["non_matching_1", "non_matching_2", "non_matching_3"]
  }
}

## FINAL SAFETY VERIFICATION:
Every generated pattern MUST be provably safe against REDOS attacks. When in doubt, REJECT.`;

  try {
    console.log("⚡ Starting pattern optimization...");
    console.log("📥 Input rules JSON length:", rulesJson?.length || 0);

    // Step 1: Parse and validate input rules
    const rules = parseRulesJson(rulesJson);
    
    // If previous step detected REDOS, propagate it
    if (rules.error === "REDOS detected") {
      console.log("🛑 Propagating REDOS detection from previous step");
      return {
        resultJson: JSON.stringify({ 
          error: "REDOS detected",
          source: "rule_evaluator",
          timestamp: new Date().toISOString()
        })
      };
    }

    console.log("📋 Rules to process:", JSON.stringify(rules, null, 2));
    
    // Step 2: Generate pattern using Gemini
    const userPrompt = `## PATTERN GENERATION REQUEST

**Structural Rules to Convert:**
\`\`\`json
${JSON.stringify(rules, null, 2)}
\`\`\`

**Generation Instructions:**
1. Analyze each rule for safety implications
2. Design most efficient SAFE regex pattern
3. Generate comprehensive test cases (3-5 valid, 3-5 invalid)
4. Provide clear technical explanation including safety features

**Security Priority:** Reject if ANY doubt about pattern safety.`;

    console.log("🤖 Calling Gemini for pattern generation...");
    
    const startTime = Date.now();
    const response = await tracedGeminiInvoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(userPrompt)
    ], {
      step: "pattern_generation",
      rule_count: rules.rules?.length || rules.length || 0
    });

    const generationTime = Date.now() - startTime;
    console.log(`⏱️ Pattern generation completed in ${generationTime}ms`);

    // Step 3: Clean and parse the response
    let cleanedResult = response.content.replace(/```json\s*/g, '')
                                      .replace(/\s*```/g, '')
                                      .trim();

    console.log("🧹 Cleaned result length:", cleanedResult.length);
    
    let patternJson;
    try {
      patternJson = JSON.parse(cleanedResult);
      console.log("✅ Successfully parsed pattern JSON");
    } catch (parseError) {
      console.error("❌ Failed to parse pattern JSON:", parseError.message);
      
      // Try to extract JSON from malformed response
      const jsonMatch = cleanedResult.match(/(\{[\s\S]*\})/);
      if (jsonMatch) {
        try {
          patternJson = JSON.parse(jsonMatch[0]);
          console.log("✅ Recovered pattern JSON from malformed response");
        } catch (recoveryError) {
          throw new Error(`Failed to parse pattern JSON after recovery attempt: ${recoveryError.message}`);
        }
      } else {
        throw new Error(`No valid JSON found in response: ${cleanedResult.substring(0, 300)}`);
      }
    }

    // Step 4: Security validation
    if (patternJson.pattern) {
      const securityCheck = validatePatternSecurity(patternJson.pattern, rules);
      
      if (!securityCheck.safe) {
        console.log("🚨 Pattern rejected due to security issues");
        return {
          resultJson: JSON.stringify({
            error: "REDOS detected",
            issues: securityCheck.issues,
            source: "pattern_optimizer",
            timestamp: new Date().toISOString()
          })
        };
      }

      // Add security metadata to pattern
      patternJson.security = {
        validated: true,
        complexityScore: securityCheck.complexityScore,
        safetyLevel: "verified_safe",
        validationTimestamp: new Date().toISOString()
      };
    }

    // Step 5: Add performance metadata
    patternJson.metadata = {
      generationTime: `${generationTime}ms`,
      ruleCount: rules.rules?.length || rules.length || 0,
      patternLength: patternJson.pattern?.length || 0,
      timestamp: new Date().toISOString(),
      model: "gemini-2.0-flash"
    };

    console.log("🎉 Pattern optimization completed successfully");
    console.log("📊 Final pattern:", patternJson.pattern);
    console.log("🧪 Test cases:", {
      valid: patternJson.tests?.valid?.length || 0,
      invalid: patternJson.tests?.invalid?.length || 0
    });

    return {
      resultJson: JSON.stringify(patternJson)
    };

  } catch (error) {
    console.error("💥 Error in pattern optimizer:", error);
    
    const errorResponse = {
      error: "Pattern optimization failed",
      details: error.message,
      step: "pattern_optimization",
      timestamp: new Date().toISOString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };

    return {
      resultJson: JSON.stringify(errorResponse)
    };
  }
}

// Export for LangGraph
export default patternOptimizer;