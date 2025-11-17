export default function SampleList({ samples, updateSample, removeSample, addSample }) {
  return (
    <div className="form-group">
      <label>Sample Patterns:</label>

      {samples.map((sample, index) => (
        <div key={index} className="sample-input">
          <input
            type="text"
            value={sample}
            onChange={(e) => updateSample(index, e.target.value)}
            placeholder={`Sample pattern ${index + 1}`}
          />
          {samples.length > 1 && (
            <button className="remove-btn" type="button" onClick={() => removeSample(index)}>
              ✕
            </button>
          )}
        </div>
      ))}

      <button type="button" className="add-btn" onClick={addSample}>
        + Add Another Sample
      </button>
    </div>
  );
}
