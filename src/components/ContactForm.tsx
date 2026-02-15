import { useState, useRef } from "react";

interface ContactFormProps {
  labels: {
    name: string;
    email: string;
    projectType: string;
    budget: string;
    message: string;
    submit: string;
    sending: string;
    success: string;
    error: string;
  };
  projectTypes: string[];
  budgetRanges: string[];
}

export default function ContactForm({
  labels,
  projectTypes,
  budgetRanges,
}: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const inputClass =
    "px-4 py-2.5 rounded-[var(--radius-sm)] border border-[var(--color-light-subtle)] dark:border-[var(--color-dark-subtle)] bg-white dark:bg-[#0f0f0f] text-[var(--color-light-headlines)] dark:text-[var(--color-dark-headlines)] placeholder-[var(--color-light-text)] dark:placeholder-[var(--color-dark-text)] focus:outline-none focus:border-[var(--color-primary)] transition-colors";

  const labelClass =
    "text-sm font-medium text-[var(--color-light-headlines)] dark:text-[var(--color-dark-headlines)]";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      project_type: (form.elements.namedItem("project_type") as HTMLSelectElement).value,
      budget: (form.elements.namedItem("budget") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
      _honeypot: (form.elements.namedItem("_honeypot") as HTMLInputElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setStatus("success");
        formRef.current?.reset();
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
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
    >
      {/* Honeypot — hidden from humans, filled by bots */}
      <div style={{ display: "none" }} aria-hidden="true">
        <input type="text" name="_honeypot" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className={labelClass}>{labels.name}</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className={labelClass}>{labels.email}</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="project_type" className={labelClass}>{labels.projectType}</label>
        <select
          id="project_type"
          name="project_type"
          className={inputClass}
        >
          {projectTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="budget" className={labelClass}>{labels.budget}</label>
        <select
          id="budget"
          name="budget"
          className={inputClass}
        >
          {budgetRanges.map((range) => (
            <option key={range} value={range}>{range}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className={labelClass}>{labels.message}</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className={`${inputClass} resize-y`}
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading" || status === "success"}
        className="px-6 py-3 rounded-[var(--radius-sm)] bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? labels.sending : labels.submit}
      </button>

      {status === "success" && (
        <p className="text-sm text-green-600 dark:text-green-400">{labels.success}</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">{errorMessage || labels.error}</p>
      )}
    </form>
  );
}
