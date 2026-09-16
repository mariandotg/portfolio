// The workloads every visual in "The Quadratic Loop" computes. The prose quotes numbers from these.
import { COMPACTION_LIMITS, CONTEXT_EDITING_DEFAULTS } from "@/lib/sim/agent-loop";
import type { Workload } from "@/lib/sim/agent-loop";

export const BASE_WORKLOAD: Workload = {
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
  contextEditing: null,
  compaction: null,
};

/** Longest loop the hero slider allows. Its axes are fixed to this size. */
export const MAX_TURNS = 120;

/** Seconds between request starts: a fast tool, and one just past the 5-minute cache lifetime. */
export const FAST_TOOL_SECONDS = 20;
export const SLOW_TOOL_SECONDS = 305;

export const EDITING_WORKLOAD: Workload = { ...BASE_WORKLOAD, turns: 60, toolResultTokens: 4_000, cache: "5m" };
export const editingWith = (clearAtLeast: number): Workload => ({
  ...EDITING_WORKLOAD,
  contextEditing: {
    trigger: CONTEXT_EDITING_DEFAULTS.trigger,
    keep: CONTEXT_EDITING_DEFAULTS.keep,
    clearAtLeast,
    placeholderTokens: 10,
  },
});
export const BATCHED_CLEAR_AT_LEAST = 20_000;

export const COMPACTION_WORKLOAD: Workload = { ...BASE_WORKLOAD, turns: 80, toolResultTokens: 5_000, cache: "5m" };
export const compactionWith = (trigger: number = COMPACTION_LIMITS.defaultTrigger): Workload => ({
  ...COMPACTION_WORKLOAD,
  compaction: { trigger, summaryTokens: COMPACTION_LIMITS.exampleSummaryTokens },
});

export const SUBAGENT_WORKLOAD: Workload = { ...BASE_WORKLOAD, cache: "5m", toolResultTokens: 4_000 };
export const SUBAGENTS = { count: 4, parallel: true, turnsEach: 15, resultTokens: 1_500 } as const;
