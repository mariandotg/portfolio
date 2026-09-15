import type { ModelId } from "./pricing";

export type CacheMode = "off" | "5m" | "1h";

export interface ContextEditingOptions {
  /** Prompt tokens (before clearing) above which clearing activates. */
  trigger: number;
  /** Most recent tool results left intact. */
  keep: number;
  /** A clearing step applies only if it frees at least this many new tokens. 0 always applies. */
  clearAtLeast: number;
  /** Tokens left in place of a cleared result. Not documented: an assumption. */
  placeholderTokens: number;
}

export interface CompactionOptions {
  /** Prompt tokens at which the summary replaces the history. */
  trigger: number;
  /** Size of the summary. Not documented: an assumption. */
  summaryTokens: number;
}

export interface Workload {
  model: ModelId;
  toolsTokens: number;
  systemTokens: number;
  /** The first user message. Compaction drops it with the rest of the history. */
  taskTokens: number;
  /** Requests in the loop. Every request but the last ends in a tool call. */
  turns: number;
  /** Output of each request (the tool_use block, or the final answer). */
  assistantTokens: number;
  toolResultTokens: number;
  /** Generation time plus tool latency, measured between request starts. */
  secondsBetweenRequests: number;
  cache: CacheMode;
  /** Extra cache breakpoint at the end of the system prompt, as the compaction docs recommend. */
  systemBreakpoint: boolean;
  contextEditing: ContextEditingOptions | null;
  compaction: CompactionOptions | null;
}

export interface CompactionRecord {
  inputTokens: number;
  cacheReadTokens: number;
  uncachedInputTokens: number;
  outputTokens: number;
  costUsd: number;
}

export interface RequestRecord {
  /** 1-based. */
  index: number;
  startSeconds: number;
  /** Full client-side history before server-side edits. */
  historyTokens: number;
  /** Tokens the model reads in the message iteration, after clearing and compaction. */
  contextTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  uncachedInputTokens: number;
  outputTokens: number;
  /** New tokens freed by context editing on this request. */
  clearedTokens: number;
  compaction: CompactionRecord | null;
  /** Message iteration plus compaction iteration. */
  costUsd: number;
}

export interface Totals {
  requests: number;
  /** Every input token processed, compaction iterations included. */
  inputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  uncachedInputTokens: number;
  outputTokens: number;
  compactionInputTokens: number;
  compactionOutputTokens: number;
  costUsd: number;
  peakContextTokens: number;
  durationSeconds: number;
}

export type SimulationError =
  | { kind: "overflow"; atRequest: number; contextTokens: number; contextWindow: number }
  | { kind: "compaction-unsupported"; model: ModelId }
  | { kind: "compaction-trigger-too-low"; trigger: number; minimum: number };

export interface SimulationResult {
  requests: RequestRecord[];
  totals: Totals;
  /** Set when the run cannot start or stops early. */
  error: SimulationError | null;
}

export interface MultiAgentOptions {
  count: number;
  parallel: boolean;
  /** What each subagent runs, in its own context. */
  subagent: Workload;
  /** Tokens each subagent returns to the coordinator. */
  resultTokens: number;
}

export interface MultiAgentResult {
  coordinator: SimulationResult;
  subagents: SimulationResult[];
  /** One agent doing every subagent's tool calls in a single context. */
  single: SimulationResult;
  /** Coordinator plus subagents. peakContextTokens is the coordinator's. */
  totals: Totals;
  error: SimulationError | null;
}
