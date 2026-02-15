import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  console.log("Counter");
  return (
    <div style={{ margin: "1rem 0", padding: "1rem", border: "1px solid #ccc", borderRadius: "4px" }}>
      <p style={{ margin: "0 0 0.5rem 0" }}>
        Count: <strong>{count}</strong>
      </p>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        Increment
      </button>
    </div>
  );
}
