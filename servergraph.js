import "dotenv/config";
import express from "express";
import compiledGraph from "./graph/regexGraph.js";

const app = express();

app.use(express.json());

app.post("/generate-pattern", async (req, res) => {
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
      sampleCount: samples.length 
    });

    // Use the invoke method on the compiled graph
    const result = await compiledGraph.invoke({
      description: description || "",
      samples: samples || [],
      rulesJson: "",
      resultJson: ""
    });

    console.log('✅ Graph execution completed');
    console.log('📊 Rules JSON length:', result.rulesJson?.length);
    console.log('📊 Result JSON length:', result.resultJson?.length);

    // Parse the results using our cleaner
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
      console.log('📝 Raw rulesJson:', result.rulesJson);
    }
    
    try { 
      if (result.resultJson) {
        const cleanedResult = result.resultJson.replace(/```json\s*/g, '').replace(/\s*```/g, '').trim();
        output = JSON.parse(cleanedResult);
        console.log('✅ Output parsed successfully');
      }
    } catch (e) {
      console.error('❌ Error parsing resultJson:', e.message);
      console.log('📝 Raw resultJson:', result.resultJson);
    }

    // Check for errors
    if (output.error === "REDOS detected" || (rules && rules.error === "REDOS detected")) {
      return res.status(400).json({ 
        error: "Security risk detected: Pattern complexity could cause performance issues",
        code: "REDOS_DETECTED"
      });
    }

    if (!output.pattern) {
      return res.status(500).json({ 
        error: "Failed to generate pattern",
        details: output.error || "Unknown error during pattern generation"
      });
    }

    res.json({ 
      success: true,
      rules: Array.isArray(rules) ? rules : [],
      output
    });

  } catch (err) {
    console.error('💥 Server error:', err);
    res.status(500).json({ 
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API running on port ${PORT}`));