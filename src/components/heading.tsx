import type { HeadingBlock } from "../App";

interface Props {
  data: HeadingBlock["data"];
  onChange: (newData: HeadingBlock["data"]) => void;
}

export default function Heading({ data, onChange }: Props) {
  return (
    <div>
      <input
        type="text"
        placeholder="Wpisz treść nagłówka..."
        value={data.text}
        onChange={(e) => onChange({ text: e.target.value })}
      />
    </div>
  );
}
