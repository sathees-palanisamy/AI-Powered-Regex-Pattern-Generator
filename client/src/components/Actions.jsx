export default function Actions({ generatePattern, resetForm, loading }) {
  return (
    <div className="actions">
      <button className="generate-btn" onClick={generatePattern} disabled={loading}>
        {loading ? "Generating..." : "Generate Regex Pattern"}
      </button>

      <button className="reset-btn" onClick={resetForm}>
        Reset
      </button>
    </div>
  );
}
