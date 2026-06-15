import {
  CASE_TYPE_LABELS,
  DIMENSION_LABELS,
  type CaseStudy,
  type Exhibit,
  type GradeResult,
  type SimRun,
} from "@/lib/types";

// Converts any exhibit (table / bar / line / pie) into a simple header+rows
// table so the evidence prints reliably without depending on chart rendering.
function exhibitToTable(ex: Exhibit): {
  headers: string[];
  rows: (string | number)[][];
} {
  if (ex.kind === "table" && ex.columns) {
    return {
      headers: ex.columns.map((c) => c.label),
      rows: ex.data.map((row) => ex.columns!.map((c) => row[c.key] ?? "")),
    };
  }
  if (ex.kind === "pie") {
    const catKey = ex.categoryKey ?? "name";
    const valKey = ex.valueKey ?? "value";
    return {
      headers: ["Category", "Share (%)"],
      rows: ex.data.map((row) => [String(row[catKey] ?? ""), row[valKey] ?? ""]),
    };
  }
  const catKey = ex.categoryKey ?? "name";
  const series = ex.series ?? [];
  return {
    headers: [catKey, ...series.map((s) => s.label)],
    rows: ex.data.map((row) => [
      String(row[catKey] ?? ""),
      ...series.map((s) => row[s.key] ?? ""),
    ]),
  };
}

function ExhibitTable({ exhibit }: { exhibit: Exhibit }) {
  const { headers, rows } = exhibitToTable(exhibit);
  return (
    <div className="mb-4 break-inside-avoid">
      <p className="text-[13px] font-semibold text-black">{exhibit.title}</p>
      {exhibit.note && (
        <p className="mb-1 text-[10px] italic text-gray-600">{exhibit.note}</p>
      )}
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="border border-gray-400 bg-gray-100 px-2 py-1 text-left text-[10px] font-semibold text-black"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri}>
              {r.map((cell, ci) => (
                <td
                  key={ci}
                  className="border border-gray-400 px-2 py-1 text-[10px] text-black"
                >
                  {String(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RefBlock({ label, body }: { label: string; body?: string }) {
  if (!body) return null;
  return (
    <p className="mb-1 text-[11px] leading-snug text-black">
      <span className="font-semibold">{label}: </span>
      <span className="whitespace-pre-wrap">{body}</span>
    </p>
  );
}

function GradeBlock({ grade }: { grade: GradeResult }) {
  return (
    <div className="mt-1 border-l-2 border-gray-300 pl-2">
      <p className="text-[11px] font-semibold text-black">
        Interviewer score: {grade.score.toFixed(1)}/10 · {grade.caseyReadiness}
      </p>
      <RefBlock label="What worked" body={grade.whatWorked} />
      <RefBlock label="What was missing" body={grade.whatWasMissing} />
      <RefBlock
        label="What a BCG consultant would do"
        body={grade.whatABCGConsultantWouldDo}
      />
      <RefBlock label="Stronger answer" body={grade.betterAnswer} />
      <p className="text-[10px] text-gray-600">
        Communication — structure {grade.communicationReview.structure.toFixed(1)},
        precision {grade.communicationReview.precision.toFixed(1)}, prioritization{" "}
        {grade.communicationReview.prioritization.toFixed(1)}, judgment{" "}
        {grade.communicationReview.judgment.toFixed(1)}
      </p>
    </div>
  );
}

export function PrintableReport({
  run,
  caseStudy,
  exhibits,
}: {
  run: SimRun;
  caseStudy: CaseStudy;
  exhibits: Exhibit[];
}) {
  const questionsById = new Map(caseStudy.questions.map((q) => [q.id, q]));
  const finished = new Date(run.finishedAt || Date.now());

  return (
    <div className="hidden bg-white px-6 py-4 text-black print:block">
      {/* Header */}
      <div className="mb-3 border-b-2 border-black pb-2">
        <h1 className="text-lg font-bold">
          BCG Casey Simulator — Case Reference & Debrief
        </h1>
        <p className="text-[12px] text-gray-700">
          {caseStudy.title} · {CASE_TYPE_LABELS[caseStudy.type]} ·{" "}
          {run.mode === "hard" ? "Hard mode" : "Standard"} ·{" "}
          {run.track === "written" ? "Written track" : "Full track"}
        </p>
        <p className="text-[11px] text-gray-700">
          Completed {finished.toLocaleString()} · Overall score{" "}
          {run.overallScore.toFixed(1)}/10 · {run.readiness}
        </p>
      </div>

      {/* Case brief */}
      <section className="mb-4 break-inside-avoid">
        <h2 className="mb-1 text-[13px] font-bold uppercase tracking-wide">
          Case brief
        </h2>
        <p className="mb-1 text-[11px] text-black">
          <span className="font-semibold">Client: </span>
          {caseStudy.company}
        </p>
        <p className="mb-1 text-[11px] text-black">
          <span className="font-semibold">Objective: </span>
          {caseStudy.clientObjective}
        </p>
        <p className="text-[11px] text-black">
          <span className="font-semibold">Background: </span>
          {caseStudy.background}
        </p>
      </section>

      {/* Evidence */}
      <section className="mb-4">
        <h2 className="mb-2 text-[13px] font-bold uppercase tracking-wide">
          Evidence ({exhibits.length} exhibit{exhibits.length === 1 ? "" : "s"})
        </h2>
        {exhibits.map((ex) => (
          <ExhibitTable key={ex.id} exhibit={ex} />
        ))}
      </section>

      {/* Questions, answers, references */}
      <section>
        <h2 className="mb-2 text-[13px] font-bold uppercase tracking-wide">
          Questions, your answers & reference answers
        </h2>
        {run.answers.map((a, i) => {
          const q = questionsById.get(a.questionId);
          return (
            <div key={a.questionId} className="mb-3 break-inside-avoid">
              <p className="text-[12px] font-semibold text-black">
                Q{i + 1} · {DIMENSION_LABELS[a.dimension]}
                {a.skipped ? " · (skipped)" : ""}
                {a.timedOut ? " · (timed out)" : ""}
              </p>
              <p className="text-[11px] text-black">{a.prompt}</p>
              <p className="mt-1 text-[11px] text-black">
                <span className="font-semibold">Your answer: </span>
                <span className="whitespace-pre-wrap">
                  {a.userAnswer || "(no answer submitted)"}
                </span>
              </p>
              {q && (
                <>
                  <RefBlock label="Reference answer" body={q.modelAnswer} />
                  <RefBlock label="Grading rubric" body={q.rubric} />
                </>
              )}
              {a.grade && <GradeBlock grade={a.grade} />}
            </div>
          );
        })}

        {run.recommendationGrade && (
          <div className="mb-3 break-inside-avoid">
            <p className="text-[12px] font-semibold text-black">
              Final recommendation
            </p>
            <GradeBlock grade={run.recommendationGrade} />
          </div>
        )}
      </section>

      <p className="mt-4 border-t border-gray-300 pt-2 text-[9px] text-gray-500">
        Generated by the BCG Casey Simulator. Reference answers and rubrics are
        practice aids, not official BCG materials.
      </p>
    </div>
  );
}
