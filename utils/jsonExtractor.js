export function extractJson(text) {
  // Remove fenced code blocks ```json ... ```
  text = text.replace(/```[\s\S]*?```/g, (block) =>
    block.replace(/```[a-zA-Z]*\n?|```/g, "")
  ).trim();

  // Extract the first JSON object
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON object found in response");

  return JSON.parse(match[0]);
}