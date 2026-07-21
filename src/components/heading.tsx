import { useState } from "react";

export default function Heading() {
  const [heading, setHeading] = useState<string>("");

  return (
    <div>
      <label htmlFor="heading">Heading:</label>
      <input
        type="text"
        value={heading}
        onChange={(e) => setHeading(e.target.value)}
      />
    </div>
  );
}
