import { classNames } from "@/lib/format";
import {
  DIMENSION_LABELS,
  type Dimension,
  type SimRun,
} from "@/lib/types";
import { readinessColor, ScoreBadge } from "./FeedbackPanel";

const DIM_ORDER: Dimension[] = [
  "structuring",
  "data",
  "judgment",
  "quant",
  "recommendation",
];

export function Scorecard({ run }: { run: SimRun }) {
  return (
    <div className="space-y-5 rounded-lg border border-ink-600 bg-ink-800 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Assessment scorecard</h2>
          <p className="text-sm text-gray-400">
            {run.caseTitle} · {run.mode === "hard" ? "Hard mode" : "Standard"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ScoreBadge score={run.overallScore} />
          <span
            className={classNames(
              "rounded px-2.5 py-1 text-sm font-semibold",
              readinessColor(run.readiness)
            )}
          >
            {run.readiness}
          </span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {DIM_ORDER.map((dim) => {
          const score = run.dimensionScores[dim];
          return (
            <div
              key={dim}
              className="rounded-lg border border-ink-600 bg-ink-900 p-3 text-center"
            >
              <p className="text-xs text-gray-400">{DIMENSION_LABELS[dim]}</p>
              <p
                className={classNames(
                  "mt-1 font-mono text-xl font-bold",
                  score === undefined
                    ? "text-gray-600"
                    : score >= 6.5
                    ? "text-bcg-accent"
                    : score >= 4.5
                    ? "text-amber-400"
                    : "text-red-400"
                )}
              >
                {score === undefined ? "—" : score.toFixed(1)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
