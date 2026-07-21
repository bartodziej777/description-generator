import type { ProducentLogoBlock } from "../App";

interface Props {
  data: ProducentLogoBlock["data"];
  onChange: (newData: ProducentLogoBlock["data"]) => void;
}

export default function ProducentLogo({ data, onChange }: Props) {
  return (
    <div>
      <input
        type="text"
        placeholder="Link do obrazka (src)..."
        value={data.src}
        onChange={(e) => onChange({ ...data, src: e.target.value })}
      />
      <input
        type="text"
        placeholder="Tekst alternatywny (alt)..."
        value={data.alt}
        onChange={(e) => onChange({ ...data, alt: e.target.value })}
      />
    </div>
  );
}
