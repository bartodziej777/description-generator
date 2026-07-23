import type { faq, faqItem } from "../App";

interface Props {
  data: faq["data"];
  onChange: (newData: faq["data"]) => void;
}

export default function Faq({ data, onChange }: Props) {
  const handleHeadingChange = (heading: string) => {
    onChange({ ...data, heading });
  };

  const handleAddItem = () => {
    const newItem: faqItem = {
      id: Date.now(),
      question: "",
      answer: "",
    };
    onChange({
      ...data,
      items: [...data.items, newItem],
    });
  };

  const handleItemChange = (
    id: number,
    field: "question" | "answer",
    value: string,
  ) => {
    const updatedItems = data.items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item,
    );
    onChange({ ...data, items: updatedItems });
  };

  const handleRemoveItem = (id: number) => {
    const updatedItems = data.items.filter((item) => item.id !== id);
    onChange({ ...data, items: updatedItems });
  };

  return (
    <div className="faq-editor">
      <div className="form-group">
        <label>Nagłówek sekcji FAQ:</label>
        <input
          type="text"
          value={data.heading}
          onChange={(e) => handleHeadingChange(e.target.value)}
          placeholder="np. Najczęściej zadawane pytania"
        />
      </div>

      <div className="faq-items-list">
        <h4>Pytania i Odpowiedzi ({data.items.length})</h4>

        {data.items.map((item, index) => (
          <div key={item.id} className="faq-item-box">
            <div className="faq-question-header">
              <strong>Pytanie #{index + 1}</strong>
              {data.items.length > 1 && (
                <button type="button" onClick={() => handleRemoveItem(item.id)}>
                  ✕ Usuń pytanie
                </button>
              )}
            </div>

            <input
              type="text"
              placeholder="Treść pytania..."
              value={item.question}
              onChange={(e) =>
                handleItemChange(item.id, "question", e.target.value)
              }
            />

            <input
              placeholder="Treść odpowiedzi..."
              value={item.answer}
              onChange={(e) =>
                handleItemChange(item.id, "answer", e.target.value)
              }
              type="text"
            />
          </div>
        ))}

        <button type="button" id="btn-faq-next" onClick={handleAddItem}>
          + Dodaj kolejne pytanie
        </button>
      </div>
    </div>
  );
}
