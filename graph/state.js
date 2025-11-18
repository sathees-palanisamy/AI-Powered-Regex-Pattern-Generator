// graph/state.js
import { Annotation } from "@langchain/langgraph";
import { z } from "zod";

// Define the state schema
export const stateDefinition = {
  description: z.string().describe("User description of the regex pattern"),
  samples: z.array(z.string()).describe("Sample patterns for analysis"),
  rulesJson: z.string().describe("JSON string of extracted rules"),
  resultJson: z.string().describe("JSON string of final regex pattern result")
};

// Create annotation
export const StateAnnotation = Annotation.Root(stateDefinition);