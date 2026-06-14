import type {
  CaseyReadiness,
  GradeResult,
  Question,
} from "@/lib/types";

export interface GradeRequestPayload {
  caseTitle: string;
  caseType: string;
  clientObjective: string;
  questionPrompt: string;
  questionFormat: Question["format"];
  dimension: string;
  rubric: string;
  modelAnswer: string;
  exhibitsContext: string;
  userAnswer: string;
  // Deterministic context (already evaluated server/client side where possible).
  objectiveVerdict?: string;
  mode: "standard" | "hard";
  isFinalRecommendation?: boolean;
}

const READINESS_VALUES: CaseyReadiness[] = [
  "Strong pass",
  "Pass",
  "Borderline",
  "Likely fail",
];

export function readinessFromScore(score: number): CaseyReadiness {
  if (score >= 8) return "Strong pass";
  if (score >= 6.5) return "Pass";
  if (score >= 4.5) return "Borderline";
  return "Likely fail";
}

// Deterministic check for selection / numeric questions. Returns the matched
// fraction (0..1) and a human-readable verdict, or null when not applicable.
export function evaluateObjective(
  question: Question,
  userAnswer: string
): { correctFraction: number; verdict: string } | null {
  if (question.format === "single" || question.format === "multi") {
    if (!question.correctOptionIds) return null;
    const chosen = new Set(
      userAnswer
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    );
    const correct = new Set(question.correctOptionIds);
    let hits = 0;
    chosen.forEach((c) => {
      if (correct.has(c)) hits += 1;
    });
    const wrong = [...chosen].filter((c) => !correct.has(c)).length;
    const fraction =
      correct.size === 0
        ? 0
        : Math.max(0, (hits - wrong) / correct.size);
    const verdict =
      hits === correct.size && wrong === 0
        ? "All correct options selected."
        : `Selected ${hits}/${correct.size} correct option(s)` +
          (wrong ? ` and ${wrong} incorrect.` : ".");
    return { correctFraction: Math.min(1, fraction), verdict };
  }

  if (question.format === "short-quant") {
    if (question.expectedValue === undefined) return null;
    const num = parseNumeric(userAnswer);
    if (num === null) {
      return { correctFraction: 0, verdict: "No numeric answer detected." };
    }
    const tol = question.tolerance ?? Math.abs(question.expectedValue) * 0.02;
    const within = Math.abs(num - question.expectedValue) <= tol;
    return {
      correctFraction: within ? 1 : 0,
      verdict: within
        ? `Numeric answer ${num} matches expected ${question.expectedValue}.`
        : `Numeric answer ${num} does not match expected ${question.expectedValue} (tolerance ${tol}).`,
    };
  }

  return null;
}

export function parseNumeric(raw: string): number | null {
  if (!raw) return null;
  // Strip currency, commas, %, spaces; capture first number-like token.
  const cleaned = raw.replace(/[, $%]/g, "");
  const match = cleaned.match(/-?\d+(\.\d+)?/);
  if (!match) return null;
  const val = parseFloat(match[0]);
  return Number.isFinite(val) ? val : null;
}

// Offline fallback grade so the simulator works without an API key.
export function offlineGrade(
  question: Question,
  userAnswer: string
): GradeResult {
  const objective = evaluateObjective(question, userAnswer);
  const blank = userAnswer.trim().length === 0;

  let score: number;
  if (objective) {
    score = Math.round(objective.correctFraction * 10);
  } else {
    // Heuristic for free text: reward concise, non-empty answers.
    const len = userAnswer.trim().length;
    if (blank) score = 0;
    else if (len < 40) score = 4;
    else if (len <= (question.charLimit ?? 500)) score = 6;
    else score = 5;
  }

  return {
    score,
    whatWorked: blank
      ? "No answer was submitted."
      : objective
      ? objective.verdict
      : "Answer submitted within the format. (Offline mode: detailed AI feedback unavailable.)",
    whatWasMissing:
      "Detailed evaluation requires the Claude API. Set ANTHROPIC_API_KEY to enable full grading.",
    whatABCGConsultantWouldDo: question.modelAnswer,
    betterAnswer: question.modelAnswer,
    communicationReview: {
      structure: score,
      precision: score,
      prioritization: score,
      judgment: score,
    },
    caseyReadiness: readinessFromScore(score),
    offline: true,
  };
}

// Parse + validate the JSON Claude returns, clamping/normalizing fields.
export function parseGradeResponse(raw: string): GradeResult {
  const jsonText = extractJson(raw);
  const obj = JSON.parse(jsonText);

  const clamp = (n: unknown): number => {
    const v = typeof n === "number" ? n : parseFloat(String(n));
    if (!Number.isFinite(v)) return 0;
    return Math.max(0, Math.min(10, Math.round(v * 10) / 10));
  };

  const score = clamp(obj.score);
  const readiness: CaseyReadiness = READINESS_VALUES.includes(obj.caseyReadiness)
    ? obj.caseyReadiness
    : readinessFromScore(score);

  const cr = obj.communicationReview ?? {};

  return {
    score,
    whatWorked: String(obj.whatWorked ?? ""),
    whatWasMissing: String(obj.whatWasMissing ?? ""),
    whatABCGConsultantWouldDo: String(obj.whatABCGConsultantWouldDo ?? ""),
    betterAnswer: String(obj.betterAnswer ?? ""),
    communicationReview: {
      structure: clamp(cr.structure),
      precision: clamp(cr.precision),
      prioritization: clamp(cr.prioritization),
      judgment: clamp(cr.judgment),
    },
    caseyReadiness: readiness,
  };
}

function extractJson(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    return raw.slice(start, end + 1);
  }
  return raw.trim();
}
