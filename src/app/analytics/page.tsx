"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { readinessColor } from "@/components/FeedbackPanel";
import { classNames } from "@/lib/format";
import { readinessFromScore } from "@/lib/grading";
import {
  type AnalyticsSummary,
  clearRuns,
  computeAnalytics,
  loadRuns,
} from "@/lib/storage";
import { DIMENSION_LABELS, type Dimension, type SimRun } from "@/lib/types";

const DIM_ORDER: Dimension[] = [
  "structuring",
  "data",
  "judgment",
  "quant",
  "recommendation",
];

export default function AnalyticsPage() {
  const [runs, setRuns] = useState<SimRun[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    const r = loadRuns();
    setRuns(r);
    setSummary(computeAnalytics(r));
  }, []);

  function handleClear() {
    if (confirm("Delete all saved attempts? This cannot be undone.")) {
      clearRuns();
      setRuns([]);
      setSummary(computeAnalytics([]));
    }
  }

  const trendData =
    summary?.trend.map((t, i) => ({
      attempt: `#${i + 1}`,
      score: Math.round(t.score * 10) / 10,
    })) ?? [];

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Performance analytics</h1>
        <Link href="/" className="text-sm text-bcg-accent hover:underline">
          ← Back
        </Link>
      </div>

      {!summary || summary.attempts === 0 ? (
        <div className="rounded-xl border border-ink-600 bg-ink-800 p-10 text-center">
          <p className="text-lg text-white">No attempts yet.</p>
          <p className="mt-1 text-sm text-gray-400">
            Complete a simulation to start tracking your progress.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-lg bg-bcg-green px-5 py-2.5 font-semibold text-white hover:bg-bcg-accent"
          >
            Start a simulation
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Attempts" value={String(summary.attempts)} />
            <StatCard
              label="Average score"
              value={summary.avgOverall.toFixed(1)}
              suffix="/10"
            />
            <div className="rounded-lg border border-ink-600 bg-ink-800 p-4">
              <p className="text-xs text-gray-400">Current readiness</p>
              <span
                className={classNames(
                  "mt-2 inline-block rounded px-2.5 py-1 text-sm font-semibold",
                  readinessColor(readinessFromScore(summary.avgOverall))
                )}
              >
                {readinessFromScore(summary.avgOverall)}
              </span>
            </div>
          </div>

          <section className="rounded-xl border border-ink-600 bg-ink-800 p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
              Average by skill dimension
            </h2>
            <div className="space-y-3">
              {DIM_ORDER.map((dim) => {
                const val = summary.byDimension[dim];
                return (
                  <div key={dim}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-gray-300">{DIMENSION_LABELS[dim]}</span>
                      <span className="font-mono text-gray-400">
                        {val === undefined ? "—" : val.toFixed(1)}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-ink-600">
                      <div
                        className={classNames(
                          "h-full",
                          (val ?? 0) >= 6.5
                            ? "bg-bcg-accent"
                            : (val ?? 0) >= 4.5
                            ? "bg-amber-400"
                            : "bg-red-500"
                        )}
                        style={{ width: `${(val ?? 0) * 10}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {trendData.length > 1 && (
            <section className="rounded-xl border border-ink-600 bg-ink-800 p-5">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
                Score trend
              </h2>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={trendData} margin={{ top: 8, right: 12, left: -12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27303f" />
                  <XAxis dataKey="attempt" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                  <YAxis domain={[0, 10]} tick={{ fill: "#9ca3af", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#11161f",
                      border: "1px solid #27303f",
                      borderRadius: 8,
                      color: "#f3f4f6",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#21b07e"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </section>
          )}

          <section className="rounded-xl border border-ink-600 bg-ink-800 p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
              History
            </h2>
            <div className="space-y-2">
              {runs
                .slice()
                .reverse()
                .map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between rounded-lg border border-ink-600 bg-ink-900 px-4 py-2.5 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-gray-200">{r.caseTitle}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(r.finishedAt).toLocaleString()} ·{" "}
                        {r.mode === "hard" ? "Hard" : "Standard"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-gray-200">
                        {r.overallScore.toFixed(1)}
                      </span>
                      <span
                        className={classNames(
                          "rounded px-2 py-0.5 text-xs font-semibold",
                          readinessColor(r.readiness)
                        )}
                      >
                        {r.readiness}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
            <button
              onClick={handleClear}
              className="mt-4 text-xs text-red-400 hover:underline"
            >
              Clear all history
            </button>
          </section>
        </>
      )}
    </main>
  );
}

function StatCard({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-lg border border-ink-600 bg-ink-800 p-4">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-1 font-mono text-2xl font-bold text-white">
        {value}
        {suffix && <span className="text-sm text-gray-500">{suffix}</span>}
      </p>
    </div>
  );
}
