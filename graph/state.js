const { Annotation } = require("@langchain/langgraph");
const { z } = require("zod");

module.exports = Annotation.Root({
  description: z.string(),
  samples: z.array(z.any()),
  rulesJson: z.string(),
  resultJson: z.string()
});