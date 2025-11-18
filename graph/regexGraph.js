// graph/regexGraph.js
import { StateGraph, START, END } from "@langchain/langgraph";
import { stateDefinition } from "./state.js";
import { ruleEvaluator } from "./nodes/ruleEvaluator.js";
import { patternOptimizer } from "./nodes/patternOptimizer.js";

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