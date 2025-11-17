export default function TestPattern({ testInput, setTestInput, testPattern, testResult }) {
  return (
    <div className="test-section">
      <h3>🧪 Test Your Pattern</h3>

      <div className="test-input-group">
        <input
          type="text"
          value={testInput}
          onChange={(e) => setTestInput(e.target.value)}
          placeholder="Enter text to test"
        />
        <button className="test-btn" onClick={testPattern}>
          Test
        </button>
      </div>

      {testResult && (
        <div className={`test-result ${testResult.isValid ? "valid" : "invalid"}`}>
          <strong>Input:</strong> "{testResult.input}" <br />
          <strong>Result:</strong> {testResult.message}
        </div>
      )}
    </div>
  );
}
