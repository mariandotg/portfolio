import { useState } from "react";

interface AlertBoxProps {
  type?: "info" | "warning" | "success" | "error";
  title?: string;
  children: React.ReactNode;
}

export default function AlertBox({ type = "info", title, children }: AlertBoxProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const colors = {
    info: { bg: "#e3f2fd", border: "#2196f3", text: "#0d47a1" },
    warning: { bg: "#fff3e0", border: "#ff9800", text: "#e65100" },
    success: { bg: "#e8f5e9", border: "#4caf50", text: "#1b5e20" },
    error: { bg: "#ffebee", border: "#f44336", text: "#b71c1c" },
  };

  const color = colors[type];

  return (
    <div
      style={{
        backgroundColor: color.bg,
        border: `2px solid ${color.border}`,
        borderRadius: "8px",
        padding: "1rem",
        marginBottom: "1rem",
        position: "relative",
      }}
    >
      <button
        type="button"
        onClick={() => setIsVisible(false)}
        style={{
          position: "absolute",
          top: "0.5rem",
          right: "0.5rem",
          background: "none",
          border: "none",
          fontSize: "1.5rem",
          cursor: "pointer",
          color: color.text,
          lineHeight: 1,
        }}
        aria-label="Close"
      >
        ×
      </button>
      {title && (
        <h4 style={{ margin: "0 0 0.5rem 0", color: color.text }}>
          {title}
        </h4>
      )}
      <div style={{ color: color.text }}>{children}</div>
    </div>
  );
}
