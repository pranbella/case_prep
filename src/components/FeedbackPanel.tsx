import { classNames } from "@/lib/format";
import type { CaseyReadiness, GradeResult } from "@/lib/types";

export function readinessColor(r: CaseyReadiness): string {
  switch (r) {
    case "Strong pass":
      return "bg-emerald-600 text-white";
    case "Pass":
      return "bg-green-600/80 text-white";
    case "Borderline":
      return "bg-amber-500 text-black";
    case "Likely fail":
      return "bg-red-600 text-white";
  }
}

function scoreColor(score: number): string {
  if (score >= 8) return "text-emerald-400";
  if (score >= 6.5) return "text-green-400";
  if (score >= 4.5) return "text-amber-400";
  return "text-red-400";
}

export function ScoreBadge({ score }: { score: number }) {
  return (
    <span className={classNames("font-mono text-2xl font-bold", scoreColor(score))}>
      {score.toFixed(1)}
      <span className="text-sm text-gray-500">/10</span>
    </span>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  if (!body) return null;
  return (
    <div>
      <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
        {title}
      </h4>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-200">
        {body}
      </p>
    </div>
  );
}

function CommBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-0.5 flex justify-between text-xs text-gray-400">
        <span>{label}</span>
        <span className="font-mono">{value.toFixed(1)}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-ink-600">
        <div
          className={classNames(
            "h-full",
            value >= 6.5 ? "bg-bcg-accent" : value >= 4.5 ? "bg-amber-400" : "bg-red-500"
          )}
          style={{ width: `${value * 10}%` }}
        />
      </div>
    </div>
  );
}

export function FeedbackPanel({
  grade,
  title,
}: {
  grade: GradeResult;
  title?: string;
}) {
  const cr = grade.communicationReview;
  return (
    <div className="space-y-4 rounded-lg border border-ink-600 bg-ink-800 p-5">
      <div className="flex items-center justify-between">
        <div>
          {title && (
            <p className="text-xs uppercase tracking-wide text-gray-500">{title}</p>
          )}
          <p className="text-sm text-gray-400">Interviewer score</p>
        </div>
        <ScoreBadge score={grade.score} />
      </div>

      {grade.offline && (
        <p className="rounded bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
          Offline grading mode — add an ANTHROPIC_API_KEY for full ex-BCG feedback.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-400">Casey readiness:</span>
        <span
          className={classNames(
            "rounded px-2 py-0.5 text-xs font-semibold",
            readinessColor(grade.caseyReadiness)
          )}
        >
          {grade.caseyReadiness}
        </span>
      </div>

      <div className="grid gap-4">
        <Section title="What worked" body={grade.whatWorked} />
        <Section title="What was missing" body={grade.whatWasMissing} />
        <Section
          title="What a BCG consultant would do"
          body={grade.whatABCGConsultantWouldDo}
        />
        <Section title="Stronger answer" body={grade.betterAnswer} />
      </div>

      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Communication review
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <CommBar label="Structure" value={cr.structure} />
          <CommBar label="Precision" value={cr.precision} />
          <CommBar label="Prioritization" value={cr.prioritization} />
          <CommBar label="Judgment" value={cr.judgment} />
        </div>
      </div>
    </div>
  );
}
