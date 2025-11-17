import { useState } from "react";

export function useRegexGenerator() {
  const [description, setDescription] = useState("");
  const [samples, setSamples] = useState([""]);
  const [generatedData, setGeneratedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testInput, setTestInput] = useState("");
  const [testResult, setTestResult] = useState(null);
  const [error, setError] = useState("");

  const addSample = () => setSamples([...samples, ""]);

  const updateSample = (index, value) => {
    const updated = [...samples];
    updated[index] = value;
    setSamples(updated);
  };

  const removeSample = (index) => {
    if (samples.length > 1) {
      setSamples(samples.filter((_, i) => i !== index));
    }
  };

  const generatePattern = async () => {
    if (!description.trim()) return setError("Please enter a description");

    const validSamples = samples.filter((s) => s.trim() !== "");

    setLoading(true);
    setError("");
    setGeneratedData(null);
    setTestResult(null);

    try {
      const response = await fetch("/api/generate-pattern", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, samples: validSamples }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to generate pattern");

      setGeneratedData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testPattern = () => {
    if (!testInput.trim() || !generatedData?.output?.pattern) {
      return setTestResult(null);
    }

    try {
      const regex = new RegExp(generatedData.output.pattern);
      const isValid = regex.test(testInput.trim());

      setTestResult({
        input: testInput.trim(),
        isValid,
        message: isValid ? "✅ Pattern matches!" : "❌ Pattern does not match",
      });
    } catch {
      setTestResult({
        input: testInput.trim(),
        isValid: false,
        message: "❌ Invalid regex pattern",
      });
    }
  };

  const resetForm = () => {
    setDescription("");
    setSamples([""]);
    setGeneratedData(null);
    setTestInput("");
    setTestResult(null);
    setError("");
  };

  return {
    description, setDescription,
    samples, addSample, updateSample, removeSample,
    generatedData, loading, error,
    generatePattern,
    testInput, setTestInput, testPattern, testResult,
    resetForm,
  };
}
