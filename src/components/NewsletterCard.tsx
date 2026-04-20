import React, { useState } from "react";

interface NewsletterCardProps {
  labels: {
    title?: string;
    description?: string;
    placeholder: string;
    subscribe: string;
    subscribing: string;
    success: string;
    error: string;
    privacy?: string;
  };
}

export default function NewsletterCard({ labels }: NewsletterCardProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(json.error || labels.error);
      }
    } catch {
      setStatus("error");
      setErrorMessage(labels.error);
    }
  }

  if (status === "success") {
    return (
      <p style={{ fontSize: "13px", color: "var(--color-muted)" }}>{labels.success}</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={labels.placeholder}
        required
        style={{
          flex: "1",
          minWidth: "200px",
          padding: "6px 16px",
          borderRadius: "999px",
          border: "1px solid var(--color-border)",
          background: "transparent",
          fontSize: "13px",
          outline: "none",
          fontFamily: "var(--font-family-display)",
        }}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        style={{
          padding: "6px 16px",
          borderRadius: "999px",
          border: "1px solid var(--color-border)",
          background: "transparent",
          fontSize: "13px",
          fontWeight: 500,
          cursor: "pointer",
          whiteSpace: "nowrap",
          fontFamily: "var(--font-family-display)",
          transition: "background 150ms ease-in-out, color 150ms ease-in-out",
          opacity: status === "loading" ? 0.6 : 1,
        }}
        onMouseEnter={(e) => {
          const btn = e.currentTarget;
          const isDark = document.documentElement.classList.contains("dark");
          btn.style.background = isDark ? "var(--color-fg-dark)" : "var(--color-fg)";
          btn.style.color = isDark ? "var(--color-bg-dark)" : "var(--color-bg)";
        }}
        onMouseLeave={(e) => {
          const btn = e.currentTarget;
          btn.style.background = "transparent";
          btn.style.color = "";
        }}
      >
        {status === "loading" ? labels.subscribing : labels.subscribe}
      </button>

      {status === "error" && (
        <p style={{ width: "100%", fontSize: "12px", color: "#dc2626", marginTop: "4px" }}>
          {errorMessage || labels.error}
        </p>
      )}
    </form>
  );
}
