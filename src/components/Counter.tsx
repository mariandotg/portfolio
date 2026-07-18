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
      border: "1px solid hsl(var(--border))",
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
          border: "1px solid hsl(var(--border))",
          borderRadius: "4px",
          background: "transparent",
          cursor: "pointer",
          color: "hsl(var(--muted-foreground))",
          fontSize: "16px",
          lineHeight: 1,
          transition: "color 150ms, border-color 150ms",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "hsl(var(--foreground))"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "hsl(var(--muted-foreground))"; }}
      >−</button>

      <span style={{ color: "hsl(var(--muted-foreground))" }}>
        {label}: <span style={{ color: "hsl(var(--foreground))", fontWeight: 600 }}>{count}</span>
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
          border: "1px solid hsl(var(--border))",
          borderRadius: "4px",
          background: "transparent",
          cursor: "pointer",
          color: "hsl(var(--muted-foreground))",
          fontSize: "16px",
          lineHeight: 1,
          transition: "color 150ms, border-color 150ms",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "hsl(var(--foreground))"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "hsl(var(--muted-foreground))"; }}
      >+</button>
    </div>
  );
}
