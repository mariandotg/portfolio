import assert from "node:assert/strict";
import { test } from "node:test";
import { quadraticInputTokens, simulate, simulateMultiAgent } from "./engine";
import type { Workload } from "./types";

const workload = (over: Partial<Workload> = {}): Workload => ({
  model: "sonnet-5",
  toolsTokens: 2_000,
  systemTokens: 2_000,
  taskTokens: 1_000,
  turns: 3,
  assistantTokens: 1_000,
  toolResultTokens: 1_000,
  secondsBetweenRequests: 10,
  cache: "off",
  systemBreakpoint: false,
  contextEditing: null,
  compaction: null,
  ...over,
});

function random(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const int = (r: () => number, min: number, max: number) => min + Math.floor(r() * (max - min + 1));

test("caching follows the docs' three-request table: read the previous prefix, write the delta", () => {
  const { requests } = simulate(workload({ cache: "5m" }));
  assert.deepEqual(
    requests.map((r) => [r.cacheReadTokens, r.cacheWriteTokens, r.uncachedInputTokens]),
    [
      [0, 5_000, 0],
      [5_000, 2_000, 0],
      [7_000, 2_000, 0],
    ],
  );
});

test("without cache, total input equals N·P + (A + R)·N(N−1)/2 for 200 random loops", () => {
  const r = random(42);
  for (let i = 0; i < 200; i++) {
    const w = workload({
      model: "opus-5",
      toolsTokens: int(r, 0, 8_000),
      systemTokens: int(r, 0, 8_000),
      taskTokens: int(r, 0, 4_000),
      turns: int(r, 1, 80),
      assistantTokens: int(r, 0, 2_000),
      toolResultTokens: int(r, 0, 10_000),
    });
    const { requests, error } = simulate(w);
    assert.equal(error, null);
    const sent = requests.reduce((n, q) => n + q.contextTokens, 0);
    assert.equal(sent, quadraticInputTokens(w));
  }
});

test("read + write + uncached equals the context on every request, in every mode", () => {
  const r = random(7);
  const caches = ["off", "5m", "1h"] as const;
  const models = ["haiku-4-5", "sonnet-5", "opus-5"] as const;
  for (let i = 0; i < 300; i++) {
    const model = models[int(r, 0, 2)];
    const w = workload({
      model,
      toolsTokens: int(r, 0, 6_000),
      systemTokens: int(r, 0, 6_000),
      taskTokens: int(r, 0, 3_000),
      turns: int(r, 1, 60),
      assistantTokens: int(r, 0, 2_000),
      toolResultTokens: int(r, 0, 8_000),
      secondsBetweenRequests: int(r, 1, 700),
      cache: caches[int(r, 0, 2)],
      systemBreakpoint: r() < 0.5,
      contextEditing:
        r() < 0.5 ? { trigger: int(r, 5_000, 120_000), keep: int(r, 0, 5), clearAtLeast: int(r, 0, 20_000), placeholderTokens: int(r, 0, 50) } : null,
      compaction: model !== "haiku-4-5" && r() < 0.5 ? { trigger: int(r, 50_000, 200_000), summaryTokens: int(r, 500, 8_000) } : null,
    });
    for (const q of simulate(w).requests) {
      assert.equal(q.cacheReadTokens + q.cacheWriteTokens + q.uncachedInputTokens, q.contextTokens);
      if (q.compaction) assert.equal(q.compaction.cacheReadTokens + q.compaction.uncachedInputTokens, q.compaction.inputTokens);
    }
  }
});

test("a prefix under the model's minimum cacheable length is not cached", () => {
  const haiku = simulate(workload({ model: "haiku-4-5", toolsTokens: 1_000, systemTokens: 1_000, taskTokens: 1_000, turns: 1, cache: "5m" }));
  assert.deepEqual([haiku.requests[0].cacheReadTokens, haiku.requests[0].cacheWriteTokens], [0, 0]);
  const opus = simulate(workload({ model: "opus-5", toolsTokens: 200, systemTokens: 200, taskTokens: 200, turns: 1, cache: "5m" }));
  assert.equal(opus.requests[0].cacheWriteTokens, 600);
});

test("a gap longer than the TTL expires the cache", () => {
  const expired = simulate(workload({ cache: "5m", secondsBetweenRequests: 301 }));
  assert.deepEqual([expired.requests[1].cacheReadTokens, expired.requests[1].cacheWriteTokens], [0, 7_000]);
  const atLimit = simulate(workload({ cache: "5m", secondsBetweenRequests: 300 }));
  assert.equal(atLimit.requests[1].cacheReadTokens, 5_000);
  const hour = simulate(workload({ cache: "1h", secondsBetweenRequests: 301 }));
  assert.equal(hour.requests[1].cacheReadTokens, 5_000);
});

test("context editing keeps the last `keep` results and respects clearAtLeast", () => {
  const edit = { trigger: 6_000, keep: 1, clearAtLeast: 0, placeholderTokens: 10 };
  const eager = simulate(workload({ turns: 6, contextEditing: edit })).requests;
  assert.equal(eager[1].clearedTokens, 0);
  assert.equal(eager[2].clearedTokens, 990);
  assert.equal(eager[2].contextTokens, 9_000 - 990);

  const batched = simulate(workload({ turns: 6, contextEditing: { ...edit, clearAtLeast: 2_000 } })).requests;
  assert.deepEqual(
    batched.map((q) => q.clearedTokens),
    [0, 0, 0, 0, 2_970, 0],
  );

  const neverTriggers = simulate(workload({ turns: 6, contextEditing: { ...edit, trigger: 1_000_000 } })).requests;
  assert.ok(neverTriggers.every((q) => q.clearedTokens === 0));
});

test("clearing invalidates the cache from the first cleared block onward", () => {
  const edit = { trigger: 6_000, keep: 1, clearAtLeast: 0, placeholderTokens: 10 };
  const q = simulate(workload({ turns: 3, cache: "5m", contextEditing: edit })).requests[2];
  assert.deepEqual([q.cacheReadTokens, q.cacheWriteTokens], [5_000, 9_000 - 990 - 5_000]);
});

test("compaction replaces the history with the summary and is billed", () => {
  assert.equal(simulate(workload({ model: "haiku-4-5", compaction: { trigger: 150_000, summaryTokens: 3_500 } })).error?.kind, "compaction-unsupported");
  assert.equal(simulate(workload({ compaction: { trigger: 40_000, summaryTokens: 3_500 } })).error?.kind, "compaction-trigger-too-low");

  const w = workload({
    turns: 12,
    assistantTokens: 5_000,
    toolResultTokens: 5_000,
    cache: "5m",
    systemBreakpoint: true,
    compaction: { trigger: 50_000, summaryTokens: 3_500 },
  });
  const { requests } = simulate(w);
  const q = requests[5];
  assert.ok(q.compaction);
  assert.equal(q.compaction.inputTokens, 55_000);
  assert.equal(q.compaction.cacheReadTokens, 45_000);
  assert.equal(q.contextTokens, 4_000 + 3_500);
  assert.deepEqual([q.cacheReadTokens, q.cacheWriteTokens], [4_000, 3_500]);
  assert.ok(q.compaction.costUsd > 0 && q.costUsd > q.compaction.costUsd);
  assert.equal(requests[6].contextTokens, 7_500 + 10_000);
});

test("Haiku 4.5 stops at its 200K window", () => {
  const { requests, error } = simulate(workload({ model: "haiku-4-5", assistantTokens: 10_000, toolResultTokens: 10_000, turns: 20 }));
  assert.deepEqual(error, { kind: "overflow", atRequest: 11, contextTokens: 205_000, contextWindow: 200_000 });
  assert.equal(requests.length, 10);
});

test("hand-computed cost of a three-turn loop on Sonnet 5 without cache", () => {
  const { totals } = simulate(workload({ toolsTokens: 0, systemTokens: 0, taskTokens: 1_000, assistantTokens: 100, toolResultTokens: 900 }));
  assert.equal(totals.inputTokens, 6_000);
  assert.ok(Math.abs(totals.costUsd - (6_000 * 2 + 300 * 10) / 1_000_000) < 1e-12);
});

test("subagents: parallel time is the slowest subagent, and the coordinator stays small", () => {
  const coordinator = workload({ secondsBetweenRequests: 10 });
  const subagent = workload({ turns: 5, toolResultTokens: 8_000, secondsBetweenRequests: 10 });
  const parallel = simulateMultiAgent(coordinator, { count: 3, parallel: true, subagent, resultTokens: 1_000 });
  assert.equal(parallel.totals.durationSeconds, 20 + 50);
  assert.ok(parallel.totals.peakContextTokens < parallel.single.totals.peakContextTokens);

  const sequential = simulateMultiAgent(coordinator, { count: 3, parallel: false, subagent, resultTokens: 1_000 });
  assert.equal(sequential.totals.durationSeconds, 40 + 150);
  assert.equal(sequential.single.requests.length, 3 * 4 + 1);
});
