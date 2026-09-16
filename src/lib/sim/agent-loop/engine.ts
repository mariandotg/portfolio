import { CACHE, COMPACTION_LIMITS, MODELS } from "./pricing";
import type {
  CacheMode,
  CompactionRecord,
  MultiAgentOptions,
  MultiAgentResult,
  RequestRecord,
  SimulationError,
  SimulationResult,
  Totals,
  Workload,
} from "./types";

type BlockKind = "tools" | "system" | "task" | "assistant" | "tool_result" | "summary";

interface Block {
  id: number;
  kind: BlockKind;
  tokens: number;
  /** Changes when server-side editing rewrites the block. */
  version: number;
}

interface CacheEntry {
  signature: string[];
  tokens: number;
  lastUse: number;
}

const signatureOf = (b: Block) => `${b.id}.${b.version}`;
const tokensOf = (blocks: Block[]) => blocks.reduce((n, b) => n + b.tokens, 0);
const ttlOf = (mode: CacheMode) => (mode === "1h" ? CACHE.ttl1hSeconds : CACHE.ttl5mSeconds);
const writeMultiplierOf = (mode: CacheMode) => (mode === "1h" ? CACHE.write1hMultiplier : CACHE.write5mMultiplier);

const isPrefixOf = (entry: CacheEntry, context: Block[]) =>
  entry.signature.length <= context.length && entry.signature.every((s, i) => s === signatureOf(context[i]));

interface CacheOutcome {
  read: number;
  write: number;
  uncached: number;
}

/**
 * One request against the prefix cache. It reads the longest live entry that prefixes the
 * context, refreshes every live entry it matches, and (when `write`) caches the whole context.
 */
function runCache(
  entries: CacheEntry[],
  context: Block[],
  now: number,
  w: Workload,
  write: boolean,
): CacheOutcome {
  const total = tokensOf(context);
  if (w.cache === "off") return { read: 0, write: 0, uncached: total };

  const ttl = ttlOf(w.cache);
  const minCacheable = MODELS[w.model].minCacheableTokens;
  for (let i = entries.length - 1; i >= 0; i--) {
    if (now - entries[i].lastUse > ttl) entries.splice(i, 1);
  }

  let read = 0;
  for (const entry of entries) {
    if (!isPrefixOf(entry, context)) continue;
    entry.lastUse = now;
    read = Math.max(read, entry.tokens);
  }

  let written = 0;
  if (write && total >= minCacheable) {
    written = total - read;
    const add = (blocks: Block[]) => {
      const signature = blocks.map(signatureOf);
      const key = signature.join("|");
      if (entries.some((e) => e.signature.join("|") === key)) return;
      entries.push({ signature, tokens: tokensOf(blocks), lastUse: now });
    };
    add(context);
    if (w.systemBreakpoint) {
      const systemPrefix = context.slice(0, 2);
      if (tokensOf(systemPrefix) >= minCacheable) add(systemPrefix);
    }
  }

  return { read, write: written, uncached: total - read - written };
}

function emptyTotals(): Totals {
  return {
    requests: 0,
    inputTokens: 0,
    cacheReadTokens: 0,
    cacheWriteTokens: 0,
    uncachedInputTokens: 0,
    outputTokens: 0,
    compactionInputTokens: 0,
    compactionOutputTokens: 0,
    costUsd: 0,
    peakContextTokens: 0,
    durationSeconds: 0,
  };
}

function totalsOf(requests: RequestRecord[], secondsBetweenRequests: number): Totals {
  const t = emptyTotals();
  for (const r of requests) {
    t.requests += 1;
    t.inputTokens += r.contextTokens + (r.compaction?.inputTokens ?? 0);
    t.cacheReadTokens += r.cacheReadTokens;
    t.cacheWriteTokens += r.cacheWriteTokens;
    t.uncachedInputTokens += r.uncachedInputTokens;
    t.outputTokens += r.outputTokens;
    t.compactionInputTokens += r.compaction?.inputTokens ?? 0;
    t.compactionOutputTokens += r.compaction?.outputTokens ?? 0;
    t.costUsd += r.costUsd;
    t.peakContextTokens = Math.max(t.peakContextTokens, r.contextTokens, r.compaction?.inputTokens ?? 0);
  }
  t.durationSeconds = t.requests * secondsBetweenRequests;
  return t;
}

function failed(error: SimulationError): SimulationResult {
  return { requests: [], totals: emptyTotals(), error };
}

export function simulate(w: Workload): SimulationResult {
  const model = MODELS[w.model];
  if (w.compaction) {
    if (!model.supportsCompaction) return failed({ kind: "compaction-unsupported", model: w.model });
    if (w.compaction.trigger < COMPACTION_LIMITS.minTrigger) {
      return failed({
        kind: "compaction-trigger-too-low",
        trigger: w.compaction.trigger,
        minimum: COMPACTION_LIMITS.minTrigger,
      });
    }
  }

  let nextId = 0;
  const makeBlock = (kind: BlockKind, tokens: number): Block => ({ id: nextId++, kind, tokens, version: 0 });

  // The client keeps the full history. Clearing and compaction are applied server-side per request.
  const history: Block[] = [
    makeBlock("tools", w.toolsTokens),
    makeBlock("system", w.systemTokens),
    makeBlock("task", w.taskTokens),
  ];
  const cleared = new Map<number, number>();
  let summary: { block: Block; fromIndex: number } | null = null;

  const promptBeforeClearing = (): Block[] => {
    const messages = summary ? [summary.block, ...history.slice(summary.fromIndex)] : history.slice(2);
    return [...history.slice(0, 2), ...messages];
  };
  const promptAfterClearing = (): Block[] =>
    promptBeforeClearing().map((b) =>
      cleared.has(b.id) ? { ...b, tokens: cleared.get(b.id)!, version: b.version + 1 } : b,
    );

  const entries: CacheEntry[] = [];
  const perInput = model.inputPerMTok / 1_000_000;
  const perOutput = model.outputPerMTok / 1_000_000;
  const writeMultiplier = writeMultiplierOf(w.cache);
  const requests: RequestRecord[] = [];
  let error: SimulationError | null = null;

  for (let index = 1; index <= w.turns; index++) {
    const now = (index - 1) * w.secondsBetweenRequests;
    const historyTokens = tokensOf(history);

    let clearedTokens = 0;
    const edit = w.contextEditing;
    if (edit && tokensOf(promptBeforeClearing()) > edit.trigger) {
      const results = promptBeforeClearing().filter((b) => b.kind === "tool_result");
      const eligible = results.slice(0, Math.max(0, results.length - edit.keep)).filter((b) => !cleared.has(b.id));
      const freed = eligible.reduce((n, b) => n + Math.max(0, b.tokens - edit.placeholderTokens), 0);
      if (eligible.length > 0 && freed >= edit.clearAtLeast) {
        for (const b of eligible) cleared.set(b.id, Math.min(b.tokens, edit.placeholderTokens));
        clearedTokens = freed;
      }
    }

    let context = promptAfterClearing();
    if (tokensOf(context) > model.contextWindow) {
      error = { kind: "overflow", atRequest: index, contextTokens: tokensOf(context), contextWindow: model.contextWindow };
      break;
    }

    let compaction: CompactionRecord | null = null;
    if (w.compaction && tokensOf(context) >= w.compaction.trigger) {
      const c = runCache(entries, context, now, w, false);
      compaction = {
        inputTokens: tokensOf(context),
        cacheReadTokens: c.read,
        uncachedInputTokens: c.uncached,
        outputTokens: w.compaction.summaryTokens,
        costUsd: (c.read * CACHE.readMultiplier + c.uncached) * perInput + w.compaction.summaryTokens * perOutput,
      };
      summary = { block: makeBlock("summary", w.compaction.summaryTokens), fromIndex: history.length };
      context = promptAfterClearing();
    }

    const c = runCache(entries, context, now, w, true);
    const costUsd =
      (c.read * CACHE.readMultiplier + c.write * writeMultiplier + c.uncached) * perInput +
      w.assistantTokens * perOutput +
      (compaction?.costUsd ?? 0);

    requests.push({
      index,
      startSeconds: now,
      historyTokens,
      contextTokens: tokensOf(context),
      cacheReadTokens: c.read,
      cacheWriteTokens: c.write,
      uncachedInputTokens: c.uncached,
      outputTokens: w.assistantTokens,
      clearedTokens,
      compaction,
      costUsd,
    });

    history.push(makeBlock("assistant", w.assistantTokens));
    if (index < w.turns) history.push(makeBlock("tool_result", w.toolResultTokens));
  }

  return { requests, totals: totalsOf(requests, w.secondsBetweenRequests), error };
}

/** Input tokens of the loop without any cache or edits: N·P + (A + R)·N(N−1)/2. */
export function quadraticInputTokens(w: Pick<Workload, "toolsTokens" | "systemTokens" | "taskTokens" | "turns" | "assistantTokens" | "toolResultTokens">): number {
  const prefix = w.toolsTokens + w.systemTokens + w.taskTokens;
  const perTurn = w.assistantTokens + w.toolResultTokens;
  return w.turns * prefix + (perTurn * w.turns * (w.turns - 1)) / 2;
}

function addTotals(a: Totals, b: Totals): Totals {
  return {
    requests: a.requests + b.requests,
    inputTokens: a.inputTokens + b.inputTokens,
    cacheReadTokens: a.cacheReadTokens + b.cacheReadTokens,
    cacheWriteTokens: a.cacheWriteTokens + b.cacheWriteTokens,
    uncachedInputTokens: a.uncachedInputTokens + b.uncachedInputTokens,
    outputTokens: a.outputTokens + b.outputTokens,
    compactionInputTokens: a.compactionInputTokens + b.compactionInputTokens,
    compactionOutputTokens: a.compactionOutputTokens + b.compactionOutputTokens,
    costUsd: a.costUsd + b.costUsd,
    peakContextTokens: a.peakContextTokens,
    durationSeconds: a.durationSeconds + b.durationSeconds,
  };
}

/**
 * A coordinator delegates to `count` subagents through Task calls. In parallel it dispatches all
 * of them in one turn; in sequence, one per turn. Each subagent runs `subagent` in its own context.
 */
export function simulateMultiAgent(coordinator: Workload, o: MultiAgentOptions): MultiAgentResult {
  const subagents = Array.from({ length: o.count }, () => simulate(o.subagent));
  const coord = simulate({
    ...coordinator,
    turns: o.parallel ? 2 : o.count + 1,
    toolResultTokens: o.parallel ? o.count * o.resultTokens : o.resultTokens,
  });
  const toolCallsPerSubagent = Math.max(0, o.subagent.turns - 1);
  const single = simulate({ ...o.subagent, turns: o.count * toolCallsPerSubagent + 1 });

  let totals = coord.totals;
  for (const s of subagents) totals = addTotals(totals, s.totals);
  const subDurations = subagents.map((s) => s.totals.durationSeconds);
  totals.durationSeconds =
    coord.totals.durationSeconds +
    (o.parallel ? Math.max(0, ...subDurations) : subDurations.reduce((n, d) => n + d, 0));

  const error = coord.error ?? subagents.find((s) => s.error)?.error ?? null;
  return { coordinator: coord, subagents, single, totals, error };
}
