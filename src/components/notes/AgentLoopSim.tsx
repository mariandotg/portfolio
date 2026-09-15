import { useId, useMemo, useState, type ReactNode } from "react";
import {
  CACHE,
  COMPACTION_LIMITS,
  CONTEXT_EDITING_DEFAULTS,
  FACTS_AS_OF,
  MODELS,
  REPORTED_TOKEN_MULTIPLES,
  SOURCES,
  quadraticInputTokens,
  simulate,
  simulateMultiAgent,
} from "@/lib/sim/agent-loop";
import type { CacheMode, ModelId, SimulationError, SimulationResult, Totals, Workload } from "@/lib/sim/agent-loop";

export type Preset = "loop" | "caching" | "editing" | "compaction" | "subagents" | "playground";

interface Config {
  model: ModelId;
  toolsTokens: number;
  systemTokens: number;
  taskTokens: number;
  turns: number;
  assistantTokens: number;
  toolResultTokens: number;
  secondsBetweenRequests: number;
  cache: CacheMode;
  systemBreakpoint: boolean;
  editingOn: boolean;
  editTrigger: number;
  editKeep: number;
  editClearAtLeast: number;
  placeholderTokens: number;
  compactionOn: boolean;
  compactionTrigger: number;
  summaryTokens: number;
  subCount: number;
  subParallel: boolean;
  subTurns: number;
  resultTokens: number;
}

export const BASE_CONFIG: Config = {
  model: "sonnet-5",
  toolsTokens: 3_000,
  systemTokens: 2_000,
  taskTokens: 500,
  turns: 30,
  assistantTokens: 400,
  toolResultTokens: 3_000,
  secondsBetweenRequests: 20,
  cache: "off",
  systemBreakpoint: true,
  editingOn: false,
  editTrigger: CONTEXT_EDITING_DEFAULTS.trigger,
  editKeep: CONTEXT_EDITING_DEFAULTS.keep,
  editClearAtLeast: 0,
  placeholderTokens: 10,
  compactionOn: false,
  compactionTrigger: COMPACTION_LIMITS.defaultTrigger,
  summaryTokens: COMPACTION_LIMITS.exampleSummaryTokens,
  subCount: 4,
  subParallel: true,
  subTurns: 15,
  resultTokens: 1_500,
};

export const PRESETS: Record<Preset, Partial<Config>> = {
  loop: {},
  caching: { cache: "5m" },
  editing: { turns: 60, toolResultTokens: 4_000, cache: "5m", editingOn: true },
  compaction: { turns: 80, toolResultTokens: 5_000, cache: "5m", compactionOn: true },
  subagents: { cache: "5m", toolResultTokens: 4_000 },
  playground: { cache: "5m" },
};

type ControlKey =
  | "model"
  | "turns"
  | "prefix"
  | "assistant"
  | "toolResult"
  | "gap"
  | "cache"
  | "systemBreakpoint"
  | "editing"
  | "compaction";

const CONTROLS: Record<Exclude<Preset, "subagents">, ControlKey[]> = {
  loop: ["model", "turns", "toolResult"],
  caching: ["model", "turns", "cache", "gap"],
  editing: ["turns", "toolResult", "editing"],
  compaction: ["model", "turns", "toolResult", "compaction"],
  playground: ["model", "turns", "prefix", "assistant", "toolResult", "gap", "cache", "systemBreakpoint", "editing", "compaction"],
};

const TITLES: Record<Preset, string> = {
  loop: "The loop",
  caching: "Prompt caching",
  editing: "Context editing",
  compaction: "Compaction",
  subagents: "Subagents",
  playground: "Playground",
};

const MODEL_OPTIONS = (Object.keys(MODELS) as ModelId[]).map((id) => ({ value: id, label: MODELS[id].name.replace("Claude ", "") }));

export function toWorkload(c: Config): Workload {
  return {
    model: c.model,
    toolsTokens: c.toolsTokens,
    systemTokens: c.systemTokens,
    taskTokens: c.taskTokens,
    turns: c.turns,
    assistantTokens: c.assistantTokens,
    toolResultTokens: c.toolResultTokens,
    secondsBetweenRequests: c.secondsBetweenRequests,
    cache: c.cache,
    systemBreakpoint: c.systemBreakpoint,
    contextEditing: c.editingOn
      ? { trigger: c.editTrigger, keep: c.editKeep, clearAtLeast: c.editClearAtLeast, placeholderTokens: c.placeholderTokens }
      : null,
    compaction:
      c.compactionOn && MODELS[c.model].supportsCompaction
        ? { trigger: c.compactionTrigger, summaryTokens: c.summaryTokens }
        : null,
  };
}

// ---------- formatting ----------

const fmtTokens = (n: number) =>
  n >= 1e6 ? `${(n / 1e6).toFixed(n >= 1e7 ? 1 : 2)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(n >= 1e4 ? 0 : 1)}k` : `${Math.round(n)}`;
const fmtUsd = (n: number) => (n >= 1 ? `$${n.toFixed(2)}` : n >= 0.01 ? `$${n.toFixed(3)}` : `$${n.toFixed(4)}`);
const fmtSeconds = (s: number) =>
  s < 60 ? `${Math.round(s)}s` : s < 3_600 ? `${Math.floor(s / 60)}m ${Math.round(s % 60)}s` : `${Math.floor(s / 3_600)}h ${Math.round((s % 3_600) / 60)}m`;
const fmtChange = (now: number, before: number) => {
  if (!before) return "—";
  const p = Math.round(((now - before) / before) * 100);
  return `${p > 0 ? "+" : p < 0 ? "−" : ""}${Math.abs(p)}%`;
};

function errorText(e: SimulationError): string {
  switch (e.kind) {
    case "overflow":
      return `Request ${e.atRequest} needs ${fmtTokens(e.contextTokens)} tokens, over the ${fmtTokens(e.contextWindow)} window. The run stops there.`;
    case "compaction-unsupported":
      return `Compaction isn't available on ${MODELS[e.model].name}.`;
    case "compaction-trigger-too-low":
      return `The compaction trigger must be at least ${fmtTokens(e.minimum)} tokens.`;
  }
}

// ---------- controls ----------

function Range(props: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format?: (n: number) => string;
  onChange: (n: number) => void;
  disabled?: boolean;
}) {
  const id = useId();
  const format = props.format ?? fmtTokens;
  return (
    <div className="als-field">
      <label htmlFor={id}>
        <span>{props.label}</span>
        <output htmlFor={id}>{format(props.value)}</output>
      </label>
      <input
        id={id}
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        disabled={props.disabled}
        onChange={(e) => props.onChange(Number(e.target.value))}
      />
    </div>
  );
}

function Choice<T extends string>(props: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="als-field" role="group" aria-label={props.label}>
      <span className="als-field-label">{props.label}</span>
      <div className="als-choice">
        {props.options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={o.value === props.value}
            className={o.value === props.value ? "active" : ""}
            onClick={() => props.onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Switch(props: { label: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      className={`als-switch${props.checked ? " on" : ""}`}
      aria-pressed={props.checked}
      disabled={props.disabled}
      onClick={() => props.onChange(!props.checked)}
    >
      <span className="als-switch-track">
        <span className="als-switch-knob" />
      </span>
      {props.label}
    </button>
  );
}

// ---------- charts ----------

function StackedBars({ result, contextWindow, showHistory }: { result: SimulationResult; contextWindow: number; showHistory: boolean }) {
  const rs = result.requests;
  if (rs.length === 0) return null;
  const W = 640;
  const H = 220;
  const padL = 46;
  const padR = 10;
  const padT = 14;
  const padB = 24;
  const maxY = Math.max(
    1,
    ...rs.map((r) => Math.max(r.contextTokens, r.compaction?.inputTokens ?? 0, showHistory ? r.historyTokens : 0)),
  );
  const showWindow = contextWindow <= maxY * 1.5;
  const top = showWindow ? Math.max(maxY, contextWindow) : maxY;
  const y = (v: number) => padT + (H - padT - padB) * (1 - v / top);
  const slot = (W - padL - padR) / rs.length;
  const gap = slot > 5 ? 1 : 0;
  const x = (i: number) => padL + i * slot;
  const historyPoints = rs.map((r, i) => `${x(i) + slot / 2},${y(r.historyTokens)}`).join(" ");
  const compactions = rs.filter((r) => r.compaction).length;

  return (
    <svg
      className="als-chart"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`Context sent on each of ${rs.length} requests. Largest: ${fmtTokens(result.totals.peakContextTokens)} tokens.${compactions ? ` ${compactions} compactions.` : ""}`}
    >
      <line className="als-axis" x1={padL} x2={W - padR} y1={y(0)} y2={y(0)} />
      <text className="als-axis-label" x={padL - 6} y={y(top) + 4} textAnchor="end">
        {fmtTokens(top)}
      </text>
      <text className="als-axis-label" x={padL - 6} y={y(0)} textAnchor="end">
        0
      </text>
      <text className="als-axis-label" x={x(0) + slot / 2} y={H - 6} textAnchor="middle">
        1
      </text>
      <text className="als-axis-label" x={x(rs.length - 1) + slot / 2} y={H - 6} textAnchor="middle">
        {rs.length}
      </text>
      {showWindow && (
        <>
          <line className="als-window" x1={padL} x2={W - padR} y1={y(contextWindow)} y2={y(contextWindow)} />
          <text className="als-axis-label" x={W - padR} y={y(contextWindow) - 4} textAnchor="end">
            context window
          </text>
        </>
      )}
      {rs.map((r, i) => {
        const w = Math.max(0.5, slot - gap);
        const readTop = y(r.cacheReadTokens);
        const writeTop = y(r.cacheReadTokens + r.cacheWriteTokens);
        const uncachedTop = y(r.contextTokens);
        return (
          <g key={r.index}>
            <rect className="als-read" x={x(i)} width={w} y={readTop} height={y(0) - readTop} />
            <rect className="als-write" x={x(i)} width={w} y={writeTop} height={readTop - writeTop} />
            <rect className="als-uncached" x={x(i)} width={w} y={uncachedTop} height={writeTop - uncachedTop} />
            {r.compaction && <rect className="als-compaction" x={x(i)} width={w} y={y(r.compaction.inputTokens)} height={3} />}
          </g>
        );
      })}
      {showHistory && <polyline className="als-history" points={historyPoints} />}
    </svg>
  );
}

function Legend({ showHistory, showCompaction }: { showHistory: boolean; showCompaction: boolean }) {
  return (
    <ul className="als-legend">
      <li>
        <span className="als-swatch als-read" /> cache read (0.1×)
      </li>
      <li>
        <span className="als-swatch als-write" /> cache write ({CACHE.write5mMultiplier}× / {CACHE.write1hMultiplier}×)
      </li>
      <li>
        <span className="als-swatch als-uncached" /> uncached input (1×)
      </li>
      {showCompaction && (
        <li>
          <span className="als-swatch als-compaction" /> compaction read
        </li>
      )}
      {showHistory && (
        <li>
          <span className="als-swatch als-history-swatch" /> full client history
        </li>
      )}
    </ul>
  );
}

function CumulativeChart({ result }: { result: SimulationResult }) {
  const rs = result.requests;
  if (rs.length < 2) return null;
  const W = 640;
  const H = 160;
  const padL = 46;
  const padR = 10;
  const padT = 14;
  const padB = 24;
  let running = 0;
  const cumulative = rs.map((r) => (running += r.contextTokens));
  const top = Math.max(1, cumulative[cumulative.length - 1]);
  const x = (i: number) => padL + (i / (rs.length - 1)) * (W - padL - padR);
  const y = (v: number) => padT + (H - padT - padB) * (1 - v / top);
  const line = (values: number[]) => values.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  return (
    <svg
      className="als-chart"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`Cumulative input tokens reach ${fmtTokens(top)} after ${rs.length} requests, while the context itself ends at ${fmtTokens(rs[rs.length - 1].contextTokens)}.`}
    >
      <line className="als-axis" x1={padL} x2={W - padR} y1={y(0)} y2={y(0)} />
      <text className="als-axis-label" x={padL - 6} y={y(top) + 4} textAnchor="end">
        {fmtTokens(top)}
      </text>
      <text className="als-axis-label" x={padL - 6} y={y(0)} textAnchor="end">
        0
      </text>
      <polyline className="als-line-cumulative" points={line(cumulative)} />
      <polyline className="als-line-context" points={line(rs.map((r) => r.contextTokens))} />
      <text className="als-axis-label" x={W - padR} y={y(top) + 14} textAnchor="end">
        input billed, cumulative
      </text>
      <text className="als-axis-label" x={W - padR} y={y(rs[rs.length - 1].contextTokens) - 6} textAnchor="end">
        context size
      </text>
    </svg>
  );
}

// ---------- stats ----------

function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="als-stat">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function StatsRow({ totals }: { totals: Totals }) {
  return (
    <dl className="als-stats">
      <Stat label="Requests" value={totals.requests} />
      <Stat label="Input tokens billed" value={fmtTokens(totals.inputTokens)} />
      <Stat label="Cost" value={fmtUsd(totals.costUsd)} />
      <Stat label="Peak context" value={fmtTokens(totals.peakContextTokens)} />
    </dl>
  );
}

function Source({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

function Footnotes({ preset, model }: { preset: Preset; model: ModelId }) {
  const m = MODELS[model];
  return (
    <div className="als-notes">
      <p>
        <span className="als-tag">documented</span> {m.name}: ${m.inputPerMTok} / ${m.outputPerMTok} per million input / output tokens,{" "}
        {m.contextWindow.toLocaleString("en-US")}-token window, as of {FACTS_AS_OF} (<Source href={SOURCES.pricing}>pricing</Source>,{" "}
        <Source href={SOURCES.models}>models</Source>).
        {(preset === "caching" || preset === "playground") && (
          <>
            {" "}
            Cache reads cost {CACHE.readMultiplier}× base input; writes cost {CACHE.write5mMultiplier}× (5 min) or {CACHE.write1hMultiplier}× (1 h).
            The lifetime counts from the start of the request, and prefixes under {m.minCacheableTokens.toLocaleString("en-US")} tokens aren't cached on{" "}
            {m.name} (<Source href={SOURCES.caching}>prompt caching</Source>).
          </>
        )}
        {(preset === "editing" || preset === "playground") && (
          <>
            {" "}
            <code>clear_tool_uses_20250919</code> defaults to a {fmtTokens(CONTEXT_EDITING_DEFAULTS.trigger)} trigger and keeps the last{" "}
            {CONTEXT_EDITING_DEFAULTS.keep} tool uses; clearing invalidates the cached prefix (<Source href={SOURCES.contextEditing}>context editing</Source>).
          </>
        )}
        {(preset === "compaction" || preset === "playground") && (
          <>
            {" "}
            <code>compact_20260112</code> defaults to {fmtTokens(COMPACTION_LIMITS.defaultTrigger)} (minimum {fmtTokens(COMPACTION_LIMITS.minTrigger)}), bills
            the compaction iteration, and isn't available on Haiku 4.5 (<Source href={SOURCES.compaction}>compaction</Source>).
          </>
        )}
        {preset === "subagents" && (
          <>
            {" "}
            Anthropic reports that agents use about {REPORTED_TOKEN_MULTIPLES.agent}× the tokens of a chat, and its multi-agent Research system about{" "}
            {REPORTED_TOKEN_MULTIPLES.multiAgent}× (<Source href={SOURCES.multiAgent}>source</Source>). Those figures are cited, not simulated.
          </>
        )}
      </p>
      <p>
        <span className="als-tag muted">assumption</span> Every slider is a workload you choose.
        {(preset === "editing" || preset === "playground") &&
          " Undocumented, modeled here: a clearing step keeps the cache valid up to the first cleared block, and a cleared result leaves a 10-token placeholder."}
        {(preset === "compaction" || preset === "playground") &&
          " Undocumented, modeled here: the compaction pass reads the cache like a normal request, and the summary size is yours to set."}
      </p>
    </div>
  );
}

// ---------- views ----------

function comparisonOf(preset: Preset, w: Workload): { label: string; workload: Workload } | null {
  switch (preset) {
    case "caching":
      return { label: "without cache", workload: { ...w, cache: "off" } };
    case "editing":
      return { label: "without context editing", workload: { ...w, contextEditing: null } };
    case "compaction":
      return { label: "without compaction", workload: { ...w, compaction: null } };
    case "playground":
      return { label: "with no cache, editing or compaction", workload: { ...w, cache: "off", contextEditing: null, compaction: null } };
    default:
      return null;
  }
}

function LoopView({ preset }: { preset: Exclude<Preset, "subagents"> }) {
  const [c, setC] = useState<Config>(() => ({ ...BASE_CONFIG, ...PRESETS[preset] }));
  const set = <K extends keyof Config>(key: K, value: Config[K]) => setC((prev) => ({ ...prev, [key]: value }));
  const w = useMemo(() => toWorkload(c), [c]);
  const result = useMemo(() => simulate(w), [w]);
  const comparison = useMemo(() => {
    const cmp = comparisonOf(preset, w);
    return cmp ? { label: cmp.label, result: simulate(cmp.workload) } : null;
  }, [preset, w]);
  const model = MODELS[c.model];
  const has = (k: ControlKey) => CONTROLS[preset].includes(k);
  const t = result.totals;
  const showHistory = preset === "editing" || preset === "compaction" || preset === "playground";
  const prefix = c.toolsTokens + c.systemTokens + c.taskTokens;
  const lastContext = result.requests.at(-1)?.contextTokens ?? 0;

  return (
    <div className="als">
      <div className="als-head">
        <span className="als-title">{TITLES[preset]}</span>
        <span className="als-tag">calculated</span>
      </div>

      <div className="als-controls">
        {has("model") && <Choice label="Model" value={c.model} options={MODEL_OPTIONS} onChange={(v) => set("model", v)} />}
        {has("turns") && (
          <Range label="Requests in the loop" value={c.turns} min={1} max={120} step={1} format={String} onChange={(v) => set("turns", v)} />
        )}
        {has("prefix") && (
          <>
            <Range label="Tool definitions" value={c.toolsTokens} min={0} max={20_000} step={500} onChange={(v) => set("toolsTokens", v)} />
            <Range label="System prompt" value={c.systemTokens} min={0} max={20_000} step={500} onChange={(v) => set("systemTokens", v)} />
            <Range label="Task message" value={c.taskTokens} min={0} max={10_000} step={100} onChange={(v) => set("taskTokens", v)} />
          </>
        )}
        {has("assistant") && (
          <Range label="Output per request" value={c.assistantTokens} min={50} max={4_000} step={50} onChange={(v) => set("assistantTokens", v)} />
        )}
        {has("toolResult") && (
          <Range label="Tool result per call" value={c.toolResultTokens} min={0} max={20_000} step={250} onChange={(v) => set("toolResultTokens", v)} />
        )}
        {has("gap") && (
          <Range
            label="Time between requests"
            value={c.secondsBetweenRequests}
            min={5}
            max={900}
            step={5}
            format={fmtSeconds}
            onChange={(v) => set("secondsBetweenRequests", v)}
          />
        )}
        {has("cache") && (
          <Choice
            label="Prompt cache"
            value={c.cache}
            options={[
              { value: "off", label: "off" },
              { value: "5m", label: "5 min" },
              { value: "1h", label: "1 hour" },
            ]}
            onChange={(v) => set("cache", v)}
          />
        )}
        {has("systemBreakpoint") && (
          <Switch label="Breakpoint after the system prompt" checked={c.systemBreakpoint} onChange={(v) => set("systemBreakpoint", v)} />
        )}
        {has("editing") && (
          <fieldset className="als-group">
            <Switch label="Context editing" checked={c.editingOn} onChange={(v) => set("editingOn", v)} />
            <Range label="Trigger" value={c.editTrigger} min={10_000} max={200_000} step={5_000} disabled={!c.editingOn} onChange={(v) => set("editTrigger", v)} />
            <Range label="Keep last tool results" value={c.editKeep} min={0} max={10} step={1} format={String} disabled={!c.editingOn} onChange={(v) => set("editKeep", v)} />
            <Range label="Clear at least" value={c.editClearAtLeast} min={0} max={60_000} step={1_000} disabled={!c.editingOn} onChange={(v) => set("editClearAtLeast", v)} />
          </fieldset>
        )}
        {has("compaction") && (
          <fieldset className="als-group">
            <Switch
              label={model.supportsCompaction ? "Compaction" : "Compaction (not on Haiku 4.5)"}
              checked={c.compactionOn && model.supportsCompaction}
              disabled={!model.supportsCompaction}
              onChange={(v) => set("compactionOn", v)}
            />
            <Range
              label="Trigger"
              value={c.compactionTrigger}
              min={COMPACTION_LIMITS.minTrigger}
              max={400_000}
              step={10_000}
              disabled={!c.compactionOn || !model.supportsCompaction}
              onChange={(v) => set("compactionTrigger", v)}
            />
            <Range
              label="Summary size"
              value={c.summaryTokens}
              min={500}
              max={20_000}
              step={500}
              disabled={!c.compactionOn || !model.supportsCompaction}
              onChange={(v) => set("summaryTokens", v)}
            />
          </fieldset>
        )}
      </div>

      {result.error && (
        <p className="als-error" role="status">
          {errorText(result.error)}
        </p>
      )}

      <StackedBars result={result} contextWindow={model.contextWindow} showHistory={showHistory} />
      <Legend showHistory={showHistory} showCompaction={preset === "compaction" || preset === "playground"} />
      {preset === "loop" && <CumulativeChart result={result} />}

      <StatsRow totals={t} />

      {preset === "loop" && !result.error && t.requests > 0 && (
        <p className="als-formula">
          N·P + (A+R)·N(N−1)/2 = {c.turns}·{fmtTokens(prefix)} + {fmtTokens(c.assistantTokens + c.toolResultTokens)}·{(c.turns * (c.turns - 1)) / 2} ={" "}
          <strong>{fmtTokens(quadraticInputTokens(w))}</strong> input tokens, for a final context of {fmtTokens(lastContext)} (
          {(t.inputTokens / Math.max(1, lastContext)).toFixed(1)}×).
        </p>
      )}

      {comparison && (
        <p className="als-compare-line" aria-live="polite">
          {comparison.result.error ? (
            <>The run {comparison.label} stops early: {errorText(comparison.result.error)}</>
          ) : (
            <>
              Compared {comparison.label}: cost {fmtUsd(comparison.result.totals.costUsd)} → {fmtUsd(t.costUsd)} (
              <strong>{fmtChange(t.costUsd, comparison.result.totals.costUsd)}</strong>), peak context{" "}
              {fmtTokens(comparison.result.totals.peakContextTokens)} → {fmtTokens(t.peakContextTokens)}.
            </>
          )}
        </p>
      )}

      <Footnotes preset={preset} model={c.model} />
    </div>
  );
}

function Column({ title, totals, error, extra }: { title: string; totals: Totals; error: SimulationError | null; extra?: ReactNode }) {
  return (
    <div className="als-column">
      <h4>{title}</h4>
      {error ? (
        <p className="als-error">{errorText(error)}</p>
      ) : (
        <dl>
          <Stat label="Input tokens billed" value={fmtTokens(totals.inputTokens)} />
          <Stat label="Cost" value={fmtUsd(totals.costUsd)} />
          <Stat label="Peak context" value={fmtTokens(totals.peakContextTokens)} />
          <Stat label="Wall-clock time" value={fmtSeconds(totals.durationSeconds)} />
        </dl>
      )}
      {extra}
    </div>
  );
}

function SubagentView() {
  const [c, setC] = useState<Config>(() => ({ ...BASE_CONFIG, ...PRESETS.subagents }));
  const set = <K extends keyof Config>(key: K, value: Config[K]) => setC((prev) => ({ ...prev, [key]: value }));
  const w = useMemo(() => toWorkload(c), [c]);
  const r = useMemo(
    () =>
      simulateMultiAgent(w, {
        count: c.subCount,
        parallel: c.subParallel,
        subagent: { ...w, turns: c.subTurns },
        resultTokens: c.resultTokens,
      }),
    [w, c.subCount, c.subParallel, c.subTurns, c.resultTokens],
  );
  const chat = useMemo(() => simulate({ ...w, turns: 1 }), [w]);
  const subPeak = Math.max(0, ...r.subagents.map((s) => s.totals.peakContextTokens));
  const peaks = [
    { label: "One agent", value: r.single.totals.peakContextTokens, overflow: Boolean(r.single.error) },
    { label: "Coordinator", value: r.coordinator.totals.peakContextTokens, overflow: Boolean(r.coordinator.error) },
    { label: "Each subagent", value: subPeak, overflow: r.subagents.some((s) => s.error) },
  ];
  const maxPeak = Math.max(1, ...peaks.map((p) => p.value), MODELS[c.model].contextWindow * (peaks.some((p) => p.overflow) ? 1 : 0));
  const chatTokens = Math.max(1, chat.totals.inputTokens);

  return (
    <div className="als">
      <div className="als-head">
        <span className="als-title">{TITLES.subagents}</span>
        <span className="als-tag">calculated</span>
      </div>

      <div className="als-controls">
        <Choice label="Model" value={c.model} options={MODEL_OPTIONS} onChange={(v) => set("model", v)} />
        <Range label="Subagents" value={c.subCount} min={1} max={10} step={1} format={String} onChange={(v) => set("subCount", v)} />
        <Choice
          label="Dispatch"
          value={c.subParallel ? "parallel" : "sequential"}
          options={[
            { value: "parallel", label: "parallel" },
            { value: "sequential", label: "sequential" },
          ]}
          onChange={(v) => set("subParallel", v === "parallel")}
        />
        <Range label="Requests per subagent" value={c.subTurns} min={2} max={40} step={1} format={String} onChange={(v) => set("subTurns", v)} />
        <Range label="Tool result per call" value={c.toolResultTokens} min={0} max={20_000} step={250} onChange={(v) => set("toolResultTokens", v)} />
        <Range label="Summary each subagent returns" value={c.resultTokens} min={100} max={10_000} step={100} onChange={(v) => set("resultTokens", v)} />
      </div>

      <div className="als-compare">
        <Column title="One agent, one context" totals={r.single.totals} error={r.single.error} />
        <Column
          title={`Coordinator + ${c.subCount} subagent${c.subCount > 1 ? "s" : ""}`}
          totals={r.totals}
          error={r.error}
          extra={
            !r.error && (
              <p className="als-column-note">
                {fmtTokens(r.coordinator.totals.inputTokens)} coordinator + {fmtTokens(r.totals.inputTokens - r.coordinator.totals.inputTokens)} subagents
              </p>
            )
          }
        />
      </div>

      <ul className="als-bars" aria-label="Peak context per agent">
        {peaks.map((p) => (
          <li key={p.label}>
            <span className="als-bars-label">{p.label}</span>
            <span className="als-bars-track">
              <span className={`als-bars-fill${p.overflow ? " overflow" : ""}`} style={{ width: `${(Math.min(p.value || maxPeak, maxPeak) / maxPeak) * 100}%` }} />
            </span>
            <span className="als-bars-value">{p.overflow ? "overflow" : fmtTokens(p.value)}</span>
          </li>
        ))}
      </ul>

      {!r.error && !r.single.error && (
        <p className="als-compare-line">
          Against a single call with the same prompt ({fmtTokens(chatTokens)} input tokens), one agent bills{" "}
          <strong>{(r.single.totals.inputTokens / chatTokens).toFixed(0)}×</strong> and the team bills{" "}
          <strong>{(r.totals.inputTokens / chatTokens).toFixed(0)}×</strong>.
        </p>
      )}

      <Footnotes preset="subagents" model={c.model} />
    </div>
  );
}

export default function AgentLoopSim({ preset }: { preset: Preset }) {
  return preset === "subagents" ? <SubagentView /> : <LoopView preset={preset} />;
}
