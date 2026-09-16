import { useEffect, useId, useMemo, useRef, useState } from "react";
import { simulate } from "@/lib/sim/agent-loop";
import { BASE_WORKLOAD, MAX_TURNS } from "./workloads";
import { fmtTokens } from "./format";

const INITIAL_TURNS = 30;
const MIN_TURNS = 2;

const prefix = BASE_WORKLOAD.toolsTokens + BASE_WORKLOAD.systemTokens + BASE_WORKLOAD.taskTokens;
const perTurn = BASE_WORKLOAD.assistantTokens + BASE_WORKLOAD.toolResultTokens;
const run = (turns: number) => simulate({ ...BASE_WORKLOAD, turns });

// The vertical axis is fixed to the longest loop, so a shorter loop visibly grows toward the
// ghost outline instead of rescaling to fill the box.
const full = run(MAX_TURNS);
const topTokens = full.requests[full.requests.length - 1].contextTokens;
const pctNum = (v: number) => (v / topTokens) * 100;
const pct = (v: number) => `${pctNum(v).toFixed(2)}%`;

// Ghost outline: a thin ribbon from the prefix (request 1) to the full 120-request height. It
// never depends on the current slider value, so it's computed once, outside the component.
const GHOST_HALF_THICK = 0.9; // % of chart height
const ghostTopAtStart = 100 - pctNum(prefix); // % from the top of the box, at x = 0%
const ghostTopAtEnd = 0; // % from the top of the box, at x = 100% (topTokens is the axis max)
const ghostPolygon = [
  `0% ${Math.max(0, ghostTopAtStart - GHOST_HALF_THICK).toFixed(2)}%`,
  `100% ${Math.max(0, ghostTopAtEnd - GHOST_HALF_THICK).toFixed(2)}%`,
  `100% ${Math.min(100, ghostTopAtEnd + GHOST_HALF_THICK).toFixed(2)}%`,
  `0% ${Math.min(100, ghostTopAtStart + GHOST_HALF_THICK).toFixed(2)}%`,
].join(", ");

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

  // The last bar's right edge, as a share of the fixed 120-slot width.
  const turnsPct = (turns / MAX_TURNS) * 100;
  // Above-left of the last bar: the ghost diagonal is lower there, so the label never sits on it.
  const labelLeft = turnsPct > 12;
  const showGhostLabel = turns < MAX_TURNS * 0.8;

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

      {showGhostLabel && <p className="lt-toplabel">{MAX_TURNS} requests</p>}

      <div
        className="lt-chart"
        role="img"
        aria-label={`${turns} requests. Each bar is the context one request sends; the last one sends ${fmtTokens(last.contextTokens)} tokens. The total area, ${fmtTokens(t.inputTokens)} input tokens, is what the loop sends in total.`}
      >
        <div className="lt-ghost" style={{ clipPath: `polygon(${ghostPolygon})` }} aria-hidden="true" />
        <div
          className="lt-bars"
          style={{ gridTemplateColumns: `repeat(${MAX_TURNS}, 1fr)` }}
          aria-hidden="true"
        >
          {result.requests.map((r, i) => {
            const fresh = i === 0 ? r.contextTokens : perTurn;
            return (
              <span className="lt-col" key={r.index}>
                <span className="lt-seg lt-seg-resent" style={{ height: pct(r.contextTokens - fresh) }} />
                <span className="lt-seg lt-seg-new" style={{ height: pct(fresh) }} />
              </span>
            );
          })}
        </div>
        <span
          className="lt-last-label"
          aria-hidden="true"
          style={{
            left: `${turnsPct.toFixed(2)}%`,
            transform: labelLeft ? "translateX(calc(-100% - 2px))" : "translateX(6px)",
            bottom: `max(min(calc(${pctNum(last.contextTokens).toFixed(2)}% + ${labelLeft ? 8 : 18}px), calc(100% - 14px)), 20px)`,
          }}
        >
          {fmtTokens(last.contextTokens)}
        </span>
      </div>
      <div className="lt-axis" aria-hidden="true">
        <span>request 1</span>
        <span>request →</span>
      </div>

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
