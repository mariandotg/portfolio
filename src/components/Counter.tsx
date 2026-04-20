import { useState } from "react";

interface CounterProps {
  label?: string;
  initialValue?: number;
}

export default function Counter({ label = "Count", initialValue = 0 }: CounterProps) {
  const [count, setCount] = useState(initialValue);

  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "12px",
      padding: "8px 12px",
      border: "1px solid var(--color-border)",
      borderRadius: "6px",
      fontFamily: "var(--font-family-mono)",
      fontSize: "13px",
    }}>
      <button
        type="button"
        onClick={() => setCount((c) => c - 1)}
        style={{
          width: "24px",
          height: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid var(--color-border)",
          borderRadius: "4px",
          background: "transparent",
          cursor: "pointer",
          color: "var(--color-muted)",
          fontSize: "16px",
          lineHeight: 1,
          transition: "color 150ms, border-color 150ms",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-fg)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-muted)"; }}
      >−</button>

      <span style={{ color: "var(--color-muted)" }}>
        {label}: <span style={{ color: "var(--color-fg)", fontWeight: 600 }}>{count}</span>
      </span>

      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        style={{
          width: "24px",
          height: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid var(--color-border)",
          borderRadius: "4px",
          background: "transparent",
          cursor: "pointer",
          color: "var(--color-muted)",
          fontSize: "16px",
          lineHeight: 1,
          transition: "color 150ms, border-color 150ms",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-fg)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-muted)"; }}
      >+</button>
    </div>
  );
}
