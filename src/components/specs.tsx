import type { SpecsBlock, SpecRow } from "../App";

interface Props {
  data: SpecsBlock["data"];
  onChange: (newData: SpecsBlock["data"]) => void;
}

export default function Specs({ data, onChange }: Props) {
  const handleFieldChange = (field: "src" | "alt", value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleAddRow = () => {
    const newRow: SpecRow = {
      id: Date.now(),
      label: "",
      value: "",
    };
    onChange({ ...data, rows: [...data.rows, newRow] });
  };

  const handleRowChange = (
    id: number,
    field: "label" | "value",
    value: string,
  ) => {
    const updatedRows = data.rows.map((row) =>
      row.id === id ? { ...row, [field]: value } : row,
    );
    onChange({ ...data, rows: updatedRows });
  };

  const handleRemoveRow = (id: number) => {
    const updatedRows = data.rows.filter((row) => row.id !== id);
    onChange({ ...data, rows: updatedRows });
  };

  return (
    <div className="specs-editor">
      <div className="form-group">
        <label>Link do zdjęcia / rysunku technicznego (src):</label>
        <input
          type="text"
          value={data.src}
          onChange={(e) => handleFieldChange("src", e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="form-group">
        <label>Tekst alternatywny zdjęcia (alt):</label>
        <input
          type="text"
          value={data.alt}
          onChange={(e) => handleFieldChange("alt", e.target.value)}
          placeholder="np. Rysunek techniczny..."
        />
      </div>

      <div className="specs-rows-list">
        <h4>Parametry techniczne ({data.rows.length})</h4>

        {data.rows.map((row, index) => (
          <div
            key={row.id}
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "8px",
              alignItems: "center",
            }}
          >
            <span style={{ minWidth: "25px" }}>#{index + 1}</span>
            <input
              type="text"
              placeholder="Nazwa parametru (np. Seria)"
              value={row.label}
              onChange={(e) => handleRowChange(row.id, "label", e.target.value)}
              style={{ flex: 1 }}
            />
            <input
              type="text"
              placeholder="Wartość (np. Cascade model 1)"
              value={row.value}
              onChange={(e) => handleRowChange(row.id, "value", e.target.value)}
              style={{ flex: 1 }}
            />
            {data.rows.length > 1 && (
              <button type="button" onClick={() => handleRemoveRow(row.id)}>
                ✕
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={handleAddRow} id="btn-specs-next">
          + Dodaj parametr
        </button>
      </div>
    </div>
  );
}
