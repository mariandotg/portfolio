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
    return <p className="text-[13px] text-muted-foreground">{labels.success}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={labels.placeholder}
        required
        className="flex-1 min-w-[200px] rounded-full border border-border bg-transparent px-4 py-1.5 text-[13px] font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="whitespace-nowrap rounded-full border border-border bg-transparent px-4 py-1.5 text-[13px] font-medium font-sans cursor-pointer transition-colors duration-150 ease-in-out hover:bg-foreground hover:text-background disabled:opacity-60"
      >
        {status === "loading" ? labels.subscribing : labels.subscribe}
      </button>

      {status === "error" && (
        <p className="w-full text-xs text-destructive mt-1">{errorMessage || labels.error}</p>
      )}
    </form>
  );
}
