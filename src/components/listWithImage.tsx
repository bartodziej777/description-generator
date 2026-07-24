import type { ListItem, ListWithImageBlock } from "../App";

interface Props {
  data: ListWithImageBlock["data"];
  onChange: (newData: ListWithImageBlock["data"]) => void;
}

export default function ListWithImage({ data, onChange }: Props) {
  const handleFieldChange = (field: "src" | "alt" | "title", value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleAddItem = () => {
    const newItem: ListItem = {
      id: Date.now(),
      text: "",
    };
    onChange({ ...data, items: [...data.items, newItem] });
  };

  const handleItemChange = (id: number, value: string) => {
    const updatedItems = data.items.map((item) =>
      item.id === id ? { ...item, text: value } : item,
    );
    onChange({ ...data, items: updatedItems });
  };

  const handleRemoveItem = (id: number) => {
    const updatedItems = data.items.filter((item) => item.id !== id);
    onChange({ ...data, items: updatedItems });
  };

  return (
    <div className="image-with-list-editor">
      <div className="form-group">
        <label>Link do zdjęcia (src):</label>
        <input
          type="text"
          value={data.src}
          onChange={(e) => handleFieldChange("src", e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="form-group">
        <label>Tekst alternatywny (alt):</label>
        <input
          type="text"
          value={data.alt}
          onChange={(e) => handleFieldChange("alt", e.target.value)}
          placeholder="np. Szafka umywalkowa..."
        />
      </div>

      <div className="form-group">
        <label>Tytuł listy:</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => handleFieldChange("title", e.target.value)}
          placeholder="np. Zawartość zestawu"
        />
      </div>

      <div className="list-items-section">
        <h4>Elementy listy ({data.items.length})</h4>

        {data.items.map((item, index) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "8px",
              alignItems: "center",
            }}
          >
            <span>#{index + 1}</span>
            <input
              type="text"
              placeholder="Treść punktu..."
              value={item.text}
              onChange={(e) => handleItemChange(item.id, e.target.value)}
              style={{ flex: 1 }}
            />
            {data.items.length > 1 && (
              <button type="button" onClick={() => handleRemoveItem(item.id)}>
                ✕
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddItem}
          className="btn-listing-next"
        >
          + Dodaj punkt do listy
        </button>
      </div>
    </div>
  );
}
