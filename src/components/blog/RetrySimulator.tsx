import { useState } from "react";

const AMOUNT = 100; // dollars per charge

export default function RetrySimulator() {
  const [idempotent, setIdempotent] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [charges, setCharges] = useState(0);

  function retry() {
    setAttempts((a) => a + 1);
    setCharges((c) => (idempotent ? 1 : c + 1));
  }

  function reset() {
    setAttempts(0);
    setCharges(0);
  }

  function toggle() {
    setIdempotent((v) => !v);
    reset();
  }

  const duplicated = charges > 1;
  const verdict =
    attempts === 0
      ? null
      : duplicated
        ? { text: `Double charge — customer billed ${charges}× ($${charges * AMOUNT})`, ok: false }
        : { text: `Safe — billed once ($${AMOUNT}) after ${attempts} attempt${attempts > 1 ? "s" : ""}`, ok: true };

  return (
    <div className="rsim">
      <div className="rsim-head">
        <span className="rsim-title">Payment retry simulator</span>
        <button
          type="button"
          className={`rsim-toggle${idempotent ? " on" : ""}`}
          onClick={toggle}
          aria-pressed={idempotent}
        >
          <span className="rsim-toggle-track"><span className="rsim-toggle-knob" /></span>
          Idempotency-Key: {idempotent ? "ON" : "OFF"}
        </button>
      </div>

      <div className="rsim-grid">
        <div className="rsim-stat">
          <span className="rsim-stat-num">{attempts}</span>
          <span className="rsim-stat-lbl">attempts</span>
        </div>
        <div className="rsim-arrow" aria-hidden="true">→</div>
        <div className={`rsim-stat${duplicated ? " bad" : charges === 1 ? " good" : ""}`}>
          <span className="rsim-stat-num">{charges}</span>
          <span className="rsim-stat-lbl">charges</span>
        </div>
      </div>

      <div className="rsim-coins" aria-hidden="true">
        {Array.from({ length: Math.max(charges, 1) }).map((_, i) => (
          <span key={i} className={`rsim-coin${i < charges ? "" : " ghost"}${duplicated && i > 0 ? " dup" : ""}`}>
            ${AMOUNT}
          </span>
        ))}
      </div>

      {verdict && (
        <div className={`rsim-verdict${verdict.ok ? " ok" : " err"}`}>
          {verdict.ok ? "✅" : "❌"} {verdict.text}
        </div>
      )}

      <div className="rsim-actions">
        <button type="button" className="rsim-btn primary" onClick={retry}>
          {attempts === 0 ? "Send POST /payments" : "Retry (connection dropped)"}
        </button>
        <button type="button" className="rsim-btn" onClick={reset} disabled={attempts === 0}>
          Reset
        </button>
      </div>
    </div>
  );
}
