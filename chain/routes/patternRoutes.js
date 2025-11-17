import express from "express";
import { evaluateRules } from "../services/ruleEvaluator.js";
import { optimizePattern } from "../services/patternOptimizer.js";
import { extractJson } from "../../utils/jsonExtractor.js";

const router = express.Router();

router.post("/generate-pattern", async (req, res) => {
  try {
    const { description, samples } = req.body;

    if (!description || !samples) {
      return res.status(400).json({ error: "Missing description or samples" });
    }

    // 1. Extract rules
    const ruleOutput = await evaluateRules(description, samples);
    const ruleJson = extractJson(ruleOutput); 

    if (ruleJson.error === "REDOS detected") {
      return res.status(400).json({ error: "REDOS detected in input" });
    }

    // 2. Optimize pattern
    const patternOutput = await optimizePattern(ruleJson);
    const patternJson = extractJson(patternOutput);

    res.json({
      success: true,
      rules: ruleJson.rules,
      output: patternJson
    });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
