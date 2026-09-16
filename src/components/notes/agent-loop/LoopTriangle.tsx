import { useEffect, useId, useMemo, useRef, useState } from "react";
import { simulate } from "@/lib/sim/agent-loop";
import { BASE_WORKLOAD, MAX_TURNS } from "./workloads";
import { fmtTokens, scale } from "./format";

const W = 480;
const H = 240;
const PAD = { left: 6, right: 6, top: 30, bottom: 24 };
const INITIAL_TURNS = 30;
const MIN_TURNS = 2;

const prefix = BASE_WORKLOAD.toolsTokens + BASE_WORKLOAD.systemTokens + BASE_WORKLOAD.taskTokens;
const perTurn = BASE_WORKLOAD.assistantTokens + BASE_WORKLOAD.toolResultTokens;
const run = (turns: number) => simulate({ ...BASE_WORKLOAD, turns });

// Axes are fixed to the longest loop, so a longer loop visibly grows in both directions.
const full = run(MAX_TURNS);
const topTokens = full.requests[full.requests.length - 1].contextTokens;
const slot = (W - PAD.left - PAD.right) / MAX_TURNS;
const x = (i: number) => PAD.left + i * slot;
const y = scale(0, topTokens, H - PAD.bottom, PAD.top);

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function LoopTriangle() {
  const id = useId();
  const [turns, setTurns] = useState(INITIAL_TURNS);
  const [playing, setPlaying] = useState(false);
  const frame = useRef<number | null>(null);

  const result = useMemo(() => run(turns), [turns]);
  const half = useMemo(() => run(Math.max(1, Math.floor(turns / 2))), [turns]);
  const t = result.totals;
  const last = result.requests[result.requests.length - 1];
  const growth = t.inputTokens / Math.max(1, half.totals.inputTokens);

  useEffect(() => {
    if (!playing) return;
    if (prefersReducedMotion()) {
      setTurns(MAX_TURNS);
      setPlaying(false);
      return;
    }
    let start: number | null = null;
    const from = turns >= MAX_TURNS ? MIN_TURNS : turns;
    const step = (now: number) => {
      start ??= now;
      const next = Math.min(MAX_TURNS, from + Math.floor((now - start) / 40));
      setTurns(next);
      if (next < MAX_TURNS) frame.current = requestAnimationFrame(step);
      else setPlaying(false);
    };
    frame.current = requestAnimationFrame(step);
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
    // Starts once per press; `turns` is read only as the starting point.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const lastX = x(turns - 1) + slot;
  const labelRight = lastX > W * 0.6;
  const ghost = `${x(0)},${y(0)} ${x(0)},${y(prefix)} ${x(MAX_TURNS - 1) + slot},${y(topTokens)} ${x(MAX_TURNS - 1) + slot},${y(0)}`;

  return (
    <div data-alc-shots="15,30,60,120">
      <div className="alc-headline">
        <span className="alc-big">{fmtTokens(t.inputTokens)} input tokens</span>
        <span className="alc-delta bad">{(t.inputTokens / last.contextTokens).toFixed(1)}× the final context</span>
      </div>
      <p className="alc-sub">
        The last request sends <strong>{fmtTokens(last.contextTokens)}</strong>.
        {turns >= 4 && (
          <>
            {" "}
            Half the loop ({Math.floor(turns / 2)} requests) bills {fmtTokens(half.totals.inputTokens)}: twice the requests,{" "}
            <strong>{growth.toFixed(1)}×</strong> the tokens.
          </>
        )}
      </p>

      <svg
        className="alc-svg"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`${turns} requests. Each bar is the context one request sends; the last one sends ${fmtTokens(last.contextTokens)} tokens. The total area, ${fmtTokens(t.inputTokens)} input tokens, is what the loop sends in total.`}
      >
        <polygon className="alc-ghost" points={ghost} />
        {turns < MAX_TURNS * 0.8 && (
          <text className="alc-text" x={W - PAD.right} y={y(topTokens) - 8} textAnchor="end">
            {MAX_TURNS} requests
          </text>
        )}
        {result.requests.map((r, i) => {
          const fresh = i === 0 ? r.contextTokens : perTurn;
          const w = Math.max(0.6, slot - (slot > 3 ? 0.6 : 0));
          return (
            <g key={r.index}>
              <rect className="alc-fill-resent" x={x(i)} width={w} y={y(r.contextTokens - fresh)} height={y(0) - y(r.contextTokens - fresh)} />
              <rect className="alc-fill-new" x={x(i)} width={w} y={y(r.contextTokens)} height={y(r.contextTokens - fresh) - y(r.contextTokens)} />
            </g>
          );
        })}
        <text
          className="alc-text-strong"
          x={labelRight ? lastX - 4 : lastX + 6}
          y={Math.min(y(last.contextTokens) - 6, y(0) - 20)}
          textAnchor={labelRight ? "end" : "start"}
        >
          {fmtTokens(last.contextTokens)}
        </text>
        <line className="alc-axis" x1={PAD.left} x2={W - PAD.right} y1={y(0)} y2={y(0)} />
        <text className="alc-text" x={PAD.left} y={H - 6}>
          request 1
        </text>
        <text className="alc-text" x={W - PAD.right} y={H - 6} textAnchor="end">
          request →
        </text>
      </svg>

      <ul className="alc-legend">
        <li>
          <span className="alc-swatch" style={{ background: "var(--alc-new)" }} /> new this request
        </li>
        <li>
          <span className="alc-swatch" style={{ background: "var(--alc-resent)" }} /> sent again
        </li>
        <li>area = input tokens billed</li>
      </ul>

      <div className="alc-range">
        <label htmlFor={id}>requests</label>
        <input
          id={id}
          type="range"
          min={MIN_TURNS}
          max={MAX_TURNS}
          step={1}
          value={turns}
          onChange={(e) => {
            setPlaying(false);
            setTurns(Number(e.target.value));
          }}
        />
        <output htmlFor={id}>{turns}</output>
      </div>
      <div className="alc-seg" role="group" aria-label="Animation">
        <button type="button" aria-pressed={playing} onClick={() => setPlaying((p) => !p)}>
          {playing ? "❚❚ pause" : "▶ run the loop"}
        </button>
      </div>
    </div>
  );
}
