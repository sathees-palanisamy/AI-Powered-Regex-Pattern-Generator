export function extractJson(text) {
  if (!text) {
    throw new Error("No text provided for JSON extraction");
  }

  // If text is already an object, return it
  if (typeof text === 'object' && text !== null) {
    return text;
  }

  // If text is a string, process it
  if (typeof text === 'string') {
    let cleanedText = text.trim();
    
    // Remove markdown code blocks
    cleanedText = cleanedText.replace(/```json\s*|\s*```/g, '');
    
    // Remove any leading/trailing non-JSON characters
    cleanedText = cleanedText.replace(/^[^{[]*/, '').replace(/[^}\]]*$/, '');
    
    // Try to extract JSON object or array
    const jsonMatch = cleanedText.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    
    if (!jsonMatch) {
      throw new Error("No JSON object found in response: " + cleanedText.substring(0, 100));
    }
    
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      throw new Error(`Failed to parse JSON: ${parseError.message}. Content: ${jsonMatch[0].substring(0, 100)}`);
    }
  }
  
  throw new Error(`Unsupported text type: ${typeof text}`);
}