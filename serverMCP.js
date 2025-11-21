import express from "express";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import "dotenv/config";

const app = express();
app.use(express.json());

// Initialize MCP Client
const transport = new StdioClientTransport({
  command: "node",
  args: ["mcp/regexMcpServer.js"],
});

const client = new Client(
  {
    name: "regex-app-client",
    version: "1.0.0",
  },
  {
    capabilities: {},
  }
);

async function startMcpClient() {
  try {
    await client.connect(transport);
    console.log("✅ Connected to Regex MCP Server");
  } catch (error) {
    console.error("❌ Failed to connect to MCP Server:", error);
  }
}

startMcpClient();

app.post("/generate-pattern", async (req, res) => {
  try {
    const { description, samples } = req.body;

    if (!description || !samples) {
      return res.status(400).json({ 
        error: "Missing required fields: description and samples" 
      });
    }

    console.log("📤 Requesting regex generation from MCP server...");

    const result = await client.callTool({
      name: "generate_regex",
      arguments: {
        description,
        samples
      }
    });

    if (result.isError) {
      const errorText = result.content[0]?.text || "Unknown error from MCP server";
      console.error("❌ MCP Server Error:", errorText);
      return res.status(500).json({ error: errorText });
    }

    const content = JSON.parse(result.content[0].text);
    
    // Transform to match expected frontend format
    res.json({
      success: true,
      rules: content.rules,
      output: {
        pattern: content.pattern,
        explanation: content.explanation,
        tests: content.tests
      }
    });

  } catch (err) {
    console.error("Error in /generate-pattern:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Express API running on port ${PORT}`));
