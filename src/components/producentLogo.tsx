import { useState } from "react";

export default function ProducentLogo() {
  const [src, setSrc] = useState<string>("");
  const [alt, setAlt] = useState<string>("");

  return (
    <div>
      <label htmlFor="src">Logo:</label>
      <input type="text" value={src} onChange={(e) => setSrc(e.target.value)} />
      <label htmlFor="alt">Alt:</label>
      <input type="text" value={alt} onChange={(e) => setAlt(e.target.value)} />
    </div>
  );
}
