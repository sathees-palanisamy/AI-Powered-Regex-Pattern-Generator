import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { evaluateRules } from "../chain/services/ruleEvaluator.js";
import { optimizePattern } from "../chain/services/patternOptimizer.js";
import { extractJson } from "../utils/jsonExtractor.js";

// Create server instance
const server = new McpServer({
  name: "regex-generator",
  version: "1.0.0",
});

// Register tool
server.tool(
  "generate_regex",
  {
    description: z.string().describe("Description of the pattern to match"),
samples: z.array(z.coerce.string()).describe("Examples of strings that should match"),
  },
  async ({ description, samples }) => {
    try {
      // 1. Extract rules
      const safeSamples = Array.isArray(samples) ? samples.map((s) => String(s)) : [];
      const ruleOutput = await evaluateRules(description, safeSamples);
      const ruleJson = extractJson(ruleOutput);

      if (ruleJson.error === "REDOS detected") {
        return {
          content: [{ type: "text", text: "Error: Security risk detected: Pattern complexity could cause performance issues" }],
          isError: true,
        };
      }

      // 2. Optimize pattern
     const patternOutput = await optimizePattern(ruleJson.rules);
      const patternJson = extractJson(patternOutput);

      if (patternJson.error === "REDOS detected") {
        return {
          content: [{ type: "text", text: "Error: Cannot generate safe regex pattern - complexity risk detected" }],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              rules: ruleJson.rules,
              pattern: patternJson.pattern,
              explanation: patternJson.explanation,
              tests: patternJson.tests
            }, null, 2)
          }
        ]
      };

    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
        isError: true,
      };
    }
  }
);

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Regex MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
