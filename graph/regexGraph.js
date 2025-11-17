// regexGraph.js
const { StateGraph, START, END } = require("@langchain/langgraph");
const stateDefinition = require("./state");
const ruleEvaluator = require("./nodes/ruleEvaluator");
const patternOptimizer = require("./nodes/patternOptimizer");

const graph = new StateGraph(stateDefinition)
  .addNode("ruleEvaluator", ruleEvaluator)
  .addNode("patternOptimizer", patternOptimizer)
  .addEdge(START, "ruleEvaluator")
  .addEdge("ruleEvaluator", "patternOptimizer")
  .addEdge("patternOptimizer", END);

const compiledGraph = graph.compile();

// Export the compiled graph properly
module.exports = compiledGraph;