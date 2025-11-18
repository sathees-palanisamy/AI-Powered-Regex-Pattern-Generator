// server.js - Main server file
import "dotenv/config";
import express from "express";
import compiledGraph from "./graph/regexGraph.js";

// Initialize LangSmith (automatically picks up env vars)
console.log("🔍 LangSmith Tracing:", process.env.LANGSMITH_TRACING === "true");

const app = express();

app.use(express.json());

// Add request tracing middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

app.post("/generate-pattern", async (req, res) => {
  // Generate a unique trace ID for this request
  const traceId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    const { description, samples } = req.body;

    // Validate input
    if (!description || !samples) {
      return res.status(400).json({ 
        error: "Missing required fields: description and samples" 
      });
    }

    if (!Array.isArray(samples)) {
      return res.status(400).json({ 
        error: "Samples must be an array" 
      });
    }

    console.log('📥 Received request:', { 
      description: description.substring(0, 100), 
      sampleCount: samples.length,
      traceId 
    });

    // Use the invoke method on the compiled graph with tracing
    const result = await compiledGraph.invoke({
      description: description || "",
      samples: samples || [],
      rulesJson: "",
      resultJson: ""
    }, {
      configurable: {
        thread_id: traceId,
      },
    });

    console.log('✅ Graph execution completed for trace:', traceId);

    // Parse the results
    let rules = [];
    let output = {};
    
    try { 
      if (result.rulesJson) {
        const cleanedRules = result.rulesJson.replace(/```json\s*/g, '').replace(/\s*```/g, '').trim();
        const parsedRules = JSON.parse(cleanedRules);
        rules = parsedRules.rules || parsedRules;
        console.log('✅ Rules parsed successfully:', rules.length, 'rules');
      }
    } catch (e) {
      console.error('❌ Error parsing rulesJson:', e.message);
    }
    
    try { 
      if (result.resultJson) {
        const cleanedResult = result.resultJson.replace(/```json\s*/g, '').replace(/\s*```/g, '').trim();
        output = JSON.parse(cleanedResult);
        console.log('✅ Output parsed successfully');
      }
    } catch (e) {
      console.error('❌ Error parsing resultJson:', e.message);
    }

    // Check for errors
    if (output.error === "REDOS detected" || (rules && rules.error === "REDOS detected")) {
      return res.status(400).json({ 
        error: "Security risk detected: Pattern complexity could cause performance issues",
        code: "REDOS_DETECTED",
        traceId
      });
    }

    if (!output.pattern) {
      return res.status(500).json({ 
        error: "Failed to generate pattern",
        details: output.error || "Unknown error during pattern generation",
        traceId
      });
    }

    res.json({ 
      success: true,
      rules: Array.isArray(rules) ? rules : [],
      output,
      traceId // Include trace ID in response for debugging
    });

  } catch (err) {
    console.error('💥 Server error for trace', traceId, ':', err);
    res.status(500).json({ 
      error: "Internal server error",
      traceId,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API running on port ${PORT} with LangSmith tracing`));