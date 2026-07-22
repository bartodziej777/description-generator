import type { headingWithFilm } from "../App";

interface Props {
  data: headingWithFilm["data"];
  onChange: (newData: headingWithFilm["data"]) => void;
}

export default function headingWithFilm({ data, onChange }: Props) {
  return (
    <div>
      <input
        type="text"
        placeholder="Wpisz treść nagłówka..."
        value={data.heading}
        onChange={(e) => onChange({ ...data, heading: e.target.value })}
      />
      <input
        type="text"
        placeholder="Wpisz link do filmu..."
        value={data.src}
        onChange={(e) => onChange({ ...data, src: e.target.value })}
      />
    </div>
  );
}
