export default function DescriptionInput({ description, setDescription }) {
  return (
    <div className="form-group">
      <label>Pattern Description:</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the pattern..."
        rows="3"
      />
    </div>
  );
}
