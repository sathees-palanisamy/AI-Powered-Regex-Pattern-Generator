import { StateGraph, START, END } from "@langchain/langgraph";
import { stateDefinition } from "./state.js";
import { evaluateRules } from "../chain/services/ruleEvaluator.js";
import { optimizePattern } from "../chain/services/patternOptimizer.js";

// Node: Rule Evaluator
async function ruleEvaluator(state) {
  const { description, samples } = state;
  
  try {
    console.log("🔍 Evaluating rules for:", description.substring(0, 50));
    
    const rulesJson = await evaluateRules(description, samples);

    return {
      rulesJson
    };
  } catch (error) {
    console.error("Error in rule evaluator:", error);
    return {
      rulesJson: JSON.stringify({ error: "Rule evaluation failed" })
    };
  }
}

// Node: Pattern Optimizer
async function patternOptimizer(state) {
  const { rulesJson } = state;
  
  try {
    console.log("⚡ Starting pattern optimization...");
    
    const result = await optimizePattern(rulesJson);

    return {
      resultJson: JSON.stringify(result)
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

// Create the graph
const workflow = new StateGraph({
  channels: stateDefinition
})
  .addNode("ruleEvaluator", ruleEvaluator)
  .addNode("patternOptimizer", patternOptimizer)
  .addEdge(START, "ruleEvaluator")
  .addEdge("ruleEvaluator", "patternOptimizer")
  .addEdge("patternOptimizer", END);

// Compile the graph
const compiledGraph = workflow.compile();

// Export as default
export default compiledGraph;

// Also export the workflow for debugging
export { workflow };