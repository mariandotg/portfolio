// Documented values only. Each constant cites its source page; all verified 2026-09-15.

export type ModelId = "haiku-4-5" | "sonnet-5" | "opus-5";

export interface ModelSpec {
  id: ModelId;
  name: string;
  /** USD per million base input tokens. */
  inputPerMTok: number;
  /** USD per million output tokens. */
  outputPerMTok: number;
  /** Shorter prefixes are not cached, and no error is returned. */
  minCacheableTokens: number;
  contextWindow: number;
  supportsCompaction: boolean;
}

export const FACTS_AS_OF = "2026-09-15";

export const SOURCES = {
  pricing: "https://platform.claude.com/docs/en/about-claude/pricing",
  caching: "https://platform.claude.com/docs/en/build-with-claude/prompt-caching",
  models: "https://platform.claude.com/docs/en/about-claude/models/overview",
  contextEditing: "https://platform.claude.com/docs/en/build-with-claude/context-editing",
  compaction: "https://platform.claude.com/docs/en/build-with-claude/compaction",
  multiAgent: "https://www.anthropic.com/engineering/multi-agent-research-system",
} as const;

export const MODELS: Record<ModelId, ModelSpec> = {
  "haiku-4-5": {
    id: "haiku-4-5",
    name: "Claude Haiku 4.5",
    inputPerMTok: 1,
    outputPerMTok: 5,
    minCacheableTokens: 4_096,
    contextWindow: 200_000,
    supportsCompaction: false,
  },
  "sonnet-5": {
    id: "sonnet-5",
    name: "Claude Sonnet 5",
    inputPerMTok: 2,
    outputPerMTok: 10,
    minCacheableTokens: 1_024,
    contextWindow: 1_000_000,
    supportsCompaction: true,
  },
  "opus-5": {
    id: "opus-5",
    name: "Claude Opus 5",
    inputPerMTok: 5,
    outputPerMTok: 25,
    minCacheableTokens: 512,
    contextWindow: 1_000_000,
    supportsCompaction: true,
  },
};

export const CACHE = {
  readMultiplier: 0.1,
  write5mMultiplier: 1.25,
  write1hMultiplier: 2,
  /** Lifetime is measured from the start of the request that writes or reads the entry. */
  ttl5mSeconds: 300,
  ttl1hSeconds: 3_600,
} as const;

/** clear_tool_uses_20250919 defaults. */
export const CONTEXT_EDITING_DEFAULTS = {
  trigger: 100_000,
  keep: 3,
} as const;

/** compact_20260112 limits. The summary size is not documented; 3,500 is the docs' usage example. */
export const COMPACTION_LIMITS = {
  defaultTrigger: 150_000,
  minTrigger: 50_000,
  exampleSummaryTokens: 3_500,
} as const;

/** Reported by Anthropic for its Research system, relative to chat. Cited, not derived. */
export const REPORTED_TOKEN_MULTIPLES = {
  agent: 4,
  multiAgent: 15,
} as const;
