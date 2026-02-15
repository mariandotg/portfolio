import { useState } from "react";

interface NewsletterCardProps {
  labels: {
    title: string;
    description: string;
    placeholder: string;
    subscribe: string;
    subscribing: string;
    success: string;
    error: string;
    privacy: string;
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

  return (
    <div className="p-6 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-primary)_20%,transparent)]">
      <h3 className="font-semibold text-[var(--color-light-headlines)] dark:text-[var(--color-dark-headlines)] mb-1">
        {labels.title}
      </h3>
      <p className="text-sm text-[var(--color-light-text)] dark:text-[var(--color-dark-text)] mb-4">
        {labels.description}
      </p>

      {status === "success" ? (
        <p className="text-sm text-green-600 dark:text-green-400">{labels.success}</p>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={labels.placeholder}
              required
              className="flex-1 px-4 py-2 rounded-[var(--radius-sm)] border border-[var(--color-light-subtle)] dark:border-[var(--color-dark-subtle)] bg-white dark:bg-[#0f0f0f] text-[var(--color-light-headlines)] dark:text-[var(--color-dark-headlines)] placeholder-[var(--color-light-text)] dark:placeholder-[var(--color-dark-text)] focus:outline-none focus:border-[var(--color-primary)] transition-colors text-sm"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {status === "loading" ? labels.subscribing : labels.subscribe}
            </button>
          </form>

          {status === "error" && (
            <p className="mt-2 text-xs text-red-600 dark:text-red-400">
              {errorMessage || labels.error}
            </p>
          )}

          <p className="mt-2 text-xs text-[var(--color-light-text)] dark:text-[var(--color-dark-text)]">
            {labels.privacy}
          </p>
        </>
      )}
    </div>
  );
}
