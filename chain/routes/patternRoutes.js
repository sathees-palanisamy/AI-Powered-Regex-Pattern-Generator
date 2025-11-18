import express from "express";
import { evaluateRules } from "../services/ruleEvaluator.js";
import { optimizePattern } from "../services/patternOptimizer.js";
import { extractJson } from "../../utils/jsonExtractor.js";

const router = express.Router();

router.post("/generate-pattern", async (req, res) => {
  try {
    const { description, samples } = req.body;

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

    // 1. Extract rules
    const ruleOutput = await evaluateRules(description, samples);
    const ruleJson = extractJson(ruleOutput);

    if (ruleJson.error === "REDOS detected") {
      return res.status(400).json({ 
        error: "Security risk detected: Pattern complexity could cause performance issues" 
      });
    }

    if (!ruleJson.rules || !Array.isArray(ruleJson.rules)) {
      return res.status(500).json({ 
        error: "Invalid rules format returned from AI" 
      });
    }

    // 2. Optimize pattern
    const patternOutput = await optimizePattern(ruleJson.rules);
    const patternJson = extractJson(patternOutput);

    if (patternJson.error === "REDOS detected") {
      return res.status(400).json({ 
        error: "Cannot generate safe regex pattern - complexity risk detected" 
      });
    }

    if (!patternJson.pattern || !patternJson.explanation) {
      return res.status(500).json({ 
        error: "Invalid pattern format returned from AI" 
      });
    }

    // Success response
    res.json({
      success: true,
      rules: ruleJson.rules,
      output: patternJson
    });

  } catch (err) {
    console.error("Error in /generate-pattern:", err);
    
    // Provide more specific error messages
    let errorMessage = err.message;
    let statusCode = 500;

    if (err.message.includes("JSON") || err.message.includes("parse")) {
      errorMessage = "AI response format error - please try again";
      statusCode = 502;
    } else if (err.message.includes("Failed to evaluate rules")) {
      errorMessage = "Rule evaluation failed - please check your input and try again";
    } else if (err.message.includes("Failed to optimize pattern")) {
      errorMessage = "Pattern generation failed - please try again";
    }

    res.status(statusCode).json({ 
      error: errorMessage 
    });
  }
});

export default router;