export default function PatternCard({ generatedData }) {
  const { pattern, explanation, tests } = generatedData.output;

  return (
    <div className="pattern-card">
      <h3>Regex Pattern:</h3>
      <code className="regex-pattern">{pattern}</code>

      <h3>Explanation:</h3>
      <p>{explanation}</p>

      <h3>Extracted Rules:</h3>
      <ul>
        {generatedData.rules?.map((r, i) => (
          <li key={i}>{r.rule}</li>
        ))}
      </ul>

      <h3>Test Cases:</h3>
      <div className="test-cases">
        <div className="valid-cases">
          <h4>Valid:</h4>
          <ul>
            {tests.valid.map((v, i) => (
              <li key={i}>✅ {v}</li>
            ))}
          </ul>
        </div>

        <div className="invalid-cases">
          <h4>Invalid:</h4>
          <ul>
            {tests.invalid.map((v, i) => (
              <li key={i}>❌ {v}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
