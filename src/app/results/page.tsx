"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FeedbackPanel } from "@/components/FeedbackPanel";
import { PrintableReport } from "@/components/PrintableReport";
import { Scorecard } from "@/components/Scorecard";
import { CASE_BANK } from "@/data/cases";
import { visibleExhibits } from "@/lib/caseEngine";
import { getCurrentRun } from "@/lib/storage";
import { DIMENSION_LABELS, type SimRun } from "@/lib/types";

export default function ResultsPage() {
  const [run, setRun] = useState<SimRun | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setRun(getCurrentRun());
    setLoaded(true);
  }, []);

  const caseStudy = useMemo(
    () => (run ? CASE_BANK.find((c) => c.id === run.caseId) ?? null : null),
    [run]
  );
  const reportExhibits = useMemo(
    () => (caseStudy && run ? visibleExhibits(caseStudy, run.mode) : []),
    [caseStudy, run]
  );

  if (!loaded) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 text-center text-gray-400">
        Loading results...
      </main>
    );
  }

  if (!run) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-lg text-white">No recent assessment found.</p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-lg bg-bcg-green px-5 py-2.5 font-semibold text-white hover:bg-bcg-accent"
        >
          Start a new simulation
        </Link>
      </main>
    );
  }

  return (
    <>
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-8 print:hidden">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-white">Your Casey debrief</h1>
        <div className="flex items-center gap-3">
          {caseStudy && (
            <button
              onClick={() => window.print()}
              className="rounded-lg border border-ink-600 px-3 py-1.5 text-sm font-semibold text-gray-200 hover:border-gray-500"
              title="Includes the case evidence, your answers, feedback, and reference answers. Choose 'Save as PDF' in the print dialog."
            >
              Download PDF
            </button>
          )}
          <Link href="/" className="text-sm text-bcg-accent hover:underline">
            New simulation →
          </Link>
        </div>
      </div>

      <Scorecard run={run} />

      {run.recommendationGrade && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
            Final recommendation
          </h2>
          <FeedbackPanel grade={run.recommendationGrade} />
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
          Question-by-question
        </h2>
        {run.answers.map((a, i) => (
          <div key={a.questionId} className="space-y-2">
            <div className="rounded-lg border border-ink-600 bg-ink-900 p-4">
              <div className="mb-1 flex items-center gap-2 text-xs text-gray-400">
                <span className="rounded bg-ink-700 px-2 py-0.5">Q{i + 1}</span>
                <span className="rounded bg-bcg-dark/60 px-2 py-0.5 text-bcg-accent">
                  {DIMENSION_LABELS[a.dimension]}
                </span>
                {a.timedOut && (
                  <span className="rounded bg-red-600/80 px-2 py-0.5 text-white">
                    Timed out
                  </span>
                )}
                {a.skipped && (
                  <span className="rounded bg-amber-500/80 px-2 py-0.5 text-black">
                    Skipped
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-200">{a.prompt}</p>
              <p className="mt-2 text-xs text-gray-500">Your answer:</p>
              <p className="whitespace-pre-wrap text-sm text-gray-300">
                {a.userAnswer || "(no answer submitted)"}
              </p>
            </div>
            {a.grade && <FeedbackPanel grade={a.grade} />}
          </div>
        ))}
      </section>

      <div className="flex flex-wrap gap-3 pt-2">
        <Link
          href="/"
          className="rounded-lg bg-bcg-green px-5 py-2.5 font-semibold text-white hover:bg-bcg-accent"
        >
          Run another case
        </Link>
        <Link
          href="/analytics"
          className="rounded-lg border border-ink-600 px-5 py-2.5 font-semibold text-gray-200 hover:border-gray-500"
        >
          View analytics
        </Link>
      </div>
    </main>
    {caseStudy && (
      <PrintableReport run={run} caseStudy={caseStudy} exhibits={reportExhibits} />
    )}
    </>
  );
}
