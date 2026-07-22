import type { leftImageRightText } from "../App";

interface Props {
  data: leftImageRightText["data"];
  onChange: (newData: leftImageRightText["data"]) => void;
}

export default function leftImageRightText({ data, onChange }: Props) {
  return (
    <div>
      <input
        type="text"
        placeholder="Wpisz link do obrazu..."
        value={data.src}
        onChange={(e) => onChange({ ...data, src: e.target.value })}
      />
      <input
        type="text"
        placeholder="Wpisz tekst alternatywny obrazu..."
        value={data.alt}
        onChange={(e) => onChange({ ...data, alt: e.target.value })}
      />
      <input
        type="text"
        placeholder="Wpisz treść nagłówka..."
        value={data.heading}
        onChange={(e) => onChange({ ...data, heading: e.target.value })}
      />
      <input
        type="text"
        placeholder="Wpisz treść opisu..."
        value={data.content}
        onChange={(e) => onChange({ ...data, content: e.target.value })}
      />
    </div>
  );
}
