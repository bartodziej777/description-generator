import type { headingWithText } from "../App";

interface Props {
  data: headingWithText["data"];
  onChange: (newData: headingWithText["data"]) => void;
}

export default function headingWithText({ data, onChange }: Props) {
  return (
    <div>
      <input
        type="text"
        placeholder="Wpisz treść nagłówka..."
        value={data.heading}
        onChange={(e) => onChange({ ...data, heading: e.target.value })}
      />
      <textarea
        placeholder="Wpisz treść opisu..."
        value={data.description}
        onChange={(e) => onChange({ ...data, description: e.target.value })}
      />
    </div>
  );
}
