"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { classNames } from "@/lib/format";
import {
  CASE_TYPE_LABELS,
  type CaseType,
  type DifficultyMode,
  type FeedbackTiming,
  type PracticeTrack,
} from "@/lib/types";
import { caseTypesAvailable } from "@/lib/caseEngine";

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<DifficultyMode>("standard");
  const [feedback, setFeedback] = useState<FeedbackTiming>("end");
  const [caseType, setCaseType] = useState<CaseType | "random">("random");
  const [track, setTrack] = useState<PracticeTrack>("full");

  const types = caseTypesAvailable();

  function start() {
    const params = new URLSearchParams({
      mode,
      feedback,
      caseType,
      track,
    });
    router.push(`/simulate?${params.toString()}`);
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <header className="mb-10 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-ink-600 bg-ink-800 px-3 py-1 text-xs text-gray-400">
          <span className="h-2 w-2 rounded-full bg-bcg-accent" />
          Casey Online Case · Simulation
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white">
          BCG Casey Simulator
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-gray-400">
          A realistic, timed, one-way case assessment: 8 questions plus a video
          final recommendation (9 total). No clarifying questions, no coaching
          mid-case — just like the real thing. Graded by an AI ex-BCG interviewer.
        </p>
      </header>

      <section className="space-y-6 rounded-xl border border-ink-600 bg-ink-800 p-6">
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Practice track
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <ModeCard
              active={track === "full"}
              onClick={() => setTrack("full")}
              title="Full Casey simulation"
              desc="Mixed formats: multiple choice, numeric entry, and written. 8 questions + a video final recommendation."
            />
            <ModeCard
              active={track === "written"}
              onClick={() => setTrack("written")}
              title="Written practice (all typed)"
              desc="Every question is answered in writing. Quant still appears, but you type out your reasoning and the final number."
            />
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Difficulty
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <ModeCard
              active={mode === "standard"}
              onClick={() => setMode("standard")}
              title="Standard"
              desc="30 minutes. Core exhibits, standard timers. The real Casey baseline."
            />
            <ModeCard
              active={mode === "hard"}
              onClick={() => setMode("hard")}
              title="Hard Mode"
              desc="More exhibits, ~30% less time per question, extra distractor data, tougher judgment calls."
              danger
            />
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Feedback timing
          </h2>
          {track === "written" ? (
            <div className="rounded-lg border border-bcg-accent/40 bg-bcg-dark/20 p-4 text-sm text-gray-300">
              Written practice grades every question{" "}
              <span className="font-semibold text-bcg-accent">immediately</span>{" "}
              after you submit it, so you get feedback as you go.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <ModeCard
                active={feedback === "end"}
                onClick={() => setFeedback("end")}
                title="End of case (max stress)"
                desc="No feedback until the very end. Closest to the real assessment."
              />
              <ModeCard
                active={feedback === "immediate"}
                onClick={() => setFeedback("immediate")}
                title="Immediate (study mode)"
                desc="See the interviewer's grade after each question."
              />
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Case type
          </h2>
          <div className="flex flex-wrap gap-2">
            <Chip
              active={caseType === "random"}
              onClick={() => setCaseType("random")}
              label="Random"
            />
            {types.map((t) => (
              <Chip
                key={t}
                active={caseType === t}
                onClick={() => setCaseType(t)}
                label={CASE_TYPE_LABELS[t]}
              />
            ))}
          </div>
        </div>

        <button
          onClick={start}
          className="w-full rounded-lg bg-bcg-green px-4 py-3.5 text-base font-semibold text-white transition-colors hover:bg-bcg-accent"
        >
          Begin simulation
        </button>
        <p className="text-center text-xs text-gray-500">
          The timer starts immediately and cannot be paused. You cannot revisit
          previous questions.
        </p>
      </section>

      <div className="mt-6 flex items-center justify-between text-sm">
        <Link href="/analytics" className="text-bcg-accent hover:underline">
          View my analytics →
        </Link>
        <span className="text-gray-600">
          {types.length} case types · 8 cases in the bank
        </span>
      </div>
    </main>
  );
}

function ModeCard({
  active,
  onClick,
  title,
  desc,
  danger,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  desc: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "rounded-lg border p-4 text-left transition-colors",
        active
          ? danger
            ? "border-red-500 bg-red-500/10"
            : "border-bcg-accent bg-bcg-dark/30"
          : "border-ink-600 bg-ink-900 hover:border-gray-500"
      )}
    >
      <p
        className={classNames(
          "font-semibold",
          active && danger ? "text-red-400" : "text-white"
        )}
      >
        {title}
      </p>
      <p className="mt-1 text-xs text-gray-400">{desc}</p>
    </button>
  );
}

function Chip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "rounded-full border px-3 py-1.5 text-sm transition-colors",
        active
          ? "border-bcg-accent bg-bcg-dark/40 text-white"
          : "border-ink-600 bg-ink-900 text-gray-300 hover:border-gray-500"
      )}
    >
      {label}
    </button>
  );
}
