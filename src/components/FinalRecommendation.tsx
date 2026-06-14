"use client";

import { useEffect, useRef, useState } from "react";
import { classNames, formatClock } from "@/lib/format";

type Phase = "intro" | "prep" | "present" | "done";

interface FinalRecommendationProps {
  onComplete: (typedAnswer: string) => void;
  questionNumber?: number;
  totalQuestions?: number;
}

const PREP_SECONDS = 60;
const PRESENT_SECONDS = 60;

// Typed-only final recommendation: 60s to prepare, then 60s to present in writing.
export function FinalRecommendation({
  onComplete,
  questionNumber,
  totalQuestions,
}: FinalRecommendationProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [remaining, setRemaining] = useState(PREP_SECONDS);
  const [answer, setAnswer] = useState("");
  const submittedRef = useRef(false);

  // Drive the countdown for prep and present phases.
  useEffect(() => {
    if (phase !== "prep" && phase !== "present") return;
    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          if (phase === "prep") {
            setRemaining(PRESENT_SECONDS);
            setPhase("present");
          } else {
            finish();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function beginPrep() {
    setRemaining(PREP_SECONDS);
    setPhase("prep");
  }

  function finish() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setPhase("done");
    onComplete(answer.trim());
  }

  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-2xl space-y-6 rounded-xl border border-ink-600 bg-ink-800 p-8 text-center">
        {questionNumber && totalQuestions && (
          <p className="text-xs uppercase tracking-wide text-bcg-accent">
            Question {questionNumber} of {totalQuestions} · Final recommendation
          </p>
        )}
        <h2 className="text-2xl font-bold text-white">Final Recommendation</h2>
        <p className="text-gray-300">
          This is the closing synthesis. You will get{" "}
          <span className="font-semibold text-bcg-accent">60 seconds to prepare</span>,
          then{" "}
          <span className="font-semibold text-bcg-accent">60 seconds to present</span>{" "}
          in writing. Cover your <strong>recommendation</strong>,{" "}
          <strong>supporting evidence</strong>, <strong>risks</strong>, and{" "}
          <strong>next steps</strong>.
        </p>

        <button
          onClick={beginPrep}
          className="rounded-lg bg-bcg-green px-6 py-3 font-semibold text-white hover:bg-bcg-accent"
        >
          Start — 60 seconds to prepare
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div
        className={classNames(
          "flex items-center justify-between rounded-xl border p-4",
          phase === "prep"
            ? "border-amber-500/50 bg-amber-500/10"
            : "border-red-500/50 bg-red-500/10"
        )}
      >
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">
            {phase === "prep" ? "Preparing" : "Presenting now"}
          </p>
          <p className="text-lg font-semibold text-white">
            {phase === "prep"
              ? "Plan your 60-second recommendation"
              : "Write your recommendation"}
          </p>
        </div>
        <div
          className={classNames(
            "font-mono text-3xl font-bold tabular-nums",
            remaining <= 10 ? "animate-pulseUrgent text-red-400" : "text-white"
          )}
        >
          {formatClock(remaining)}
        </div>
      </div>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={6}
        placeholder="Type your structured recommendation: Recommendation -> Evidence -> Risks -> Next steps."
        className="w-full resize-none rounded-lg border border-ink-600 bg-ink-800 px-4 py-3 text-sm leading-relaxed text-gray-100 outline-none focus:border-bcg-accent"
      />

      <button
        onClick={finish}
        className="w-full rounded-lg bg-bcg-green px-4 py-3 font-semibold text-white hover:bg-bcg-accent"
      >
        {phase === "prep" ? "Skip prep — present now" : "Submit recommendation"}
      </button>
    </div>
  );
}
