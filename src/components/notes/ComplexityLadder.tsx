import { useState } from "react";

type Model = "Haiku 4.5" | "Sonnet 5" | "Opus 5";

// Measured: Claude pricing page, USD per million tokens, 2026-09-14.
const PRICES: Record<Model, { input: number; output: number }> = {
  "Haiku 4.5": { input: 1, output: 5 },
  "Sonnet 5": { input: 2, output: 10 },
  "Opus 5": { input: 5, output: 25 },
};

const RUNGS = [
  { id: 1, name: "Single prompt", detail: "One call. Instructions in, answer out." },
  { id: 2, name: "+ Context", detail: "Criteria, examples, retrieved documents." },
  { id: 3, name: "+ Tools on a fixed path", detail: "A workflow. Your code runs the steps." },
  { id: 4, name: "Agent loop", detail: "The model picks the steps and decides when to stop." },
];

interface Task {
  id: string;
  label: string;
  rung: number;
  why: string;
  whyNotNext: string;
  model: Model;
  modelWhy: string;
  batch: boolean;
  modeWhy: string;
}

const TASKS: Task[] = [
  {
    id: "summary",
    label: "One-line summary of each release note",
    rung: 1,
    why: "Everything the model needs is already in the note.",
    whyNotNext: "Extra context would hand it documents it never uses.",
    model: "Haiku 4.5",
    modelWhy: "short, simple, repetitive.",
    batch: false,
    modeWhy: "it runs once, when the release ships.",
  },
  {
    id: "tickets",
    label: "Sort 40,000 archived tickets into 8 categories",
    rung: 2,
    why: "The model needs the category definitions and a few labeled examples. Nothing more.",
    whyNotNext: "Your code writes each label to the database. The model never has to act.",
    model: "Haiku 4.5",
    modelWhy: "classification into defined categories, at high volume.",
    batch: true,
    modeWhy: "the report is due Monday. Nobody waits on a single ticket.",
  },
  {
    id: "invoices",
    label: "Extract, validate and file every incoming invoice",
    rung: 3,
    why: "The same three steps for every invoice: extract fields, check the totals, file it in the ERP.",
    whyNotNext: "There is nothing to decide. A loop would let the model skip the validation step.",
    model: "Sonnet 5",
    modelWhy: "the default. The validation step measures the error rate before you try Haiku.",
    batch: false,
    modeWhy: "invoices arrive all day and accounting wants them filed in minutes.",
  },
  {
    id: "incident",
    label: "Find out why checkout latency spiked last night",
    rung: 4,
    why: "You can't write the steps down. Each query depends on what the last one found.",
    whyNotNext: "A workflow would need every possible investigation enumerated in advance.",
    model: "Opus 5",
    modelWhy: "deep reasoning, and a wrong conclusion is expensive.",
    batch: false,
    modeWhy: "a tool loop needs round trips. Batch requests run on their own.",
  },
];

const money = (n: number) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;

export default function ComplexityLadder() {
  const [taskId, setTaskId] = useState("tickets");
  const task = TASKS.find((t) => t.id === taskId) ?? TASKS[0];
  const price = PRICES[task.model];
  const factor = task.batch ? 0.5 : 1;
  const topRung = RUNGS.length;

  return (
    <div className="ladder">
      <span className="ladder-title">The complexity ladder</span>

      <div className="ladder-tasks" role="group" aria-label="Pick a task">
        {TASKS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`ladder-task${t.id === taskId ? " active" : ""}`}
            aria-pressed={t.id === taskId}
            onClick={() => setTaskId(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ol className="ladder-rungs" aria-label="Rungs, top to bottom">
        {[...RUNGS].reverse().map((r) => {
          const state = r.id < task.rung ? "below" : r.id === task.rung ? "needed" : "above";
          return (
            <li key={r.id} className={`ladder-rung ${state}`} aria-current={state === "needed" ? "step" : undefined}>
              <span className="ladder-rung-num">{r.id}</span>
              <span className="ladder-rung-text">
                <span className="ladder-rung-name">{r.name}</span>
                <span className="ladder-rung-detail">{r.detail}</span>
              </span>
              {state === "needed" && <span className="ladder-rung-tag">needed</span>}
              {state === "above" && <span className="ladder-rung-tag muted">not needed</span>}
            </li>
          );
        })}
      </ol>

      <dl className="ladder-facts">
        <div>
          <dt>Why this rung</dt>
          <dd>{task.why}</dd>
        </div>
        <div>
          <dt>{task.rung === topRung ? "Why not a workflow" : "Why not the next rung"}</dt>
          <dd>{task.whyNotNext}</dd>
        </div>
        <div>
          <dt>Model</dt>
          <dd>
            <strong>{task.model}</strong>: {task.modelWhy}
          </dd>
        </div>
        <div>
          <dt>Mode</dt>
          <dd>
            <strong>{task.batch ? "Batch API" : "Synchronous"}</strong>: {task.modeWhy}
          </dd>
        </div>
        <div>
          <dt>Price per million tokens (in / out)</dt>
          <dd className="ladder-mono">
            {money(price.input * factor)} / {money(price.output * factor)}
            {task.batch && " with the 50% batch discount"}
          </dd>
        </div>
      </dl>

      <p className="ladder-source">
        Prices: measured, Claude pricing page, 2026-09-14. Rung and model choices: my judgment.
      </p>
    </div>
  );
}
