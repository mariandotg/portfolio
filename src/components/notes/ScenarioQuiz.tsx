import { useState } from "react";

export interface QuizOption {
  id: string;
  text: string;
  /** Short name for the trap or the right move, shown after answering. */
  label: string;
  why: string;
  correct?: boolean;
}

export interface ScenarioQuizProps {
  scenario: string;
  question?: string;
  options: QuizOption[];
  note?: string;
}

export default function ScenarioQuiz({
  scenario,
  question = "What does the architect do?",
  options,
  note,
}: ScenarioQuizProps) {
  const [picked, setPicked] = useState<string | null>(null);
  const answered = picked !== null;
  const pickedOption = options.find((o) => o.id === picked);

  return (
    <div className="quiz">
      <div className="quiz-head">
        <span className="quiz-title">Scenario</span>
        {answered && (
          <button type="button" className="quiz-reset" onClick={() => setPicked(null)}>
            Try again
          </button>
        )}
      </div>

      <p className="quiz-scenario">{scenario}</p>
      <p className="quiz-question">{question}</p>

      <ul className="quiz-options">
        {options.map((o) => {
          const state = !answered ? "" : o.correct ? " correct" : o.id === picked ? " wrong" : " dim";
          return (
            <li key={o.id}>
              <button
                type="button"
                className={`quiz-option${state}`}
                onClick={() => setPicked(o.id)}
                disabled={answered}
                aria-pressed={o.id === picked}
              >
                <span className="quiz-option-id">{o.id}</span>
                <span>{o.text}</span>
              </button>
              {answered && (
                <p className="quiz-why">
                  <span className={`quiz-label${o.correct ? " ok" : ""}`}>{o.label}</span> {o.why}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <div aria-live="polite">
        {pickedOption && (
          <p className={`quiz-verdict ${pickedOption.correct ? "ok" : "err"}`}>
            {pickedOption.correct ? "✅ Right call." : "❌ That's the trap. The explanations are under each option."}
          </p>
        )}
      </div>

      {note && <p className="quiz-note">{note}</p>}
    </div>
  );
}
