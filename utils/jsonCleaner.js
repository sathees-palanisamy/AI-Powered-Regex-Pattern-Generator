export function cleanAndParseJson(text) {
  if (!text) {
    throw new Error("No text provided for JSON extraction");
  }

  // If already an object, return it
  if (typeof text === 'object' && text !== null) {
    return text;
  }

  if (typeof text !== 'string') {
    throw new Error(`Expected string or object, got: ${typeof text}`);
  }

  let cleaned = text.trim();

  // Remove markdown code blocks
  const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/g;
  cleaned = cleaned.replace(codeBlockRegex, '$1');

  // Remove common prefixes
  const prefixes = ['JSON:', 'Response:', 'Output:', 'Result:'];
  prefixes.forEach(prefix => {
    if (cleaned.startsWith(prefix)) {
      cleaned = cleaned.substring(prefix.length).trim();
    }
  });

  // Extract JSON object or array
  const jsonMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (!jsonMatch) {
    throw new Error(`No JSON found in: ${cleaned.substring(0, 100)}...`);
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (parseError) {
    // Final attempt: fix common JSON issues
    const fixedJson = jsonMatch[0]
      .replace(/(\w+):/g, '"$1":') // Wrap unquoted keys
      .replace(/'/g, '"') // Replace single quotes
      .replace(/,\s*([}\]])/g, '$1'); // Remove trailing commas

    try {
      return JSON.parse(fixedJson);
    } catch (finalError) {
      throw new Error(`Failed to parse JSON: ${finalError.message}. Content: ${jsonMatch[0].substring(0, 100)}`);
    }
  }
}

// Test function
export function testJsonParsing() {
  const testCases = [
    '```json\n{"rules": [{"rule": "test"}]}\n```',
    'JSON: {"rules": [{"rule": "test"}]}',
    '{"rules": [{"rule": "test"}]}',
    'Some text before {"rules": [{"rule": "test"}]} and after'
  ];

  testCases.forEach((test, i) => {
    try {
      const result = cleanAndParseJson(test);
      console.log(`✅ Test ${i + 1} passed:`, result);
    } catch (error) {
      console.log(`❌ Test ${i + 1} failed:`, error.message);
    }
  });
}