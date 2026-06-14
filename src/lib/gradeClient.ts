import type { GradeRequestPayload } from "@/lib/grading";
import { evaluateObjective, offlineGrade, parseNumeric } from "@/lib/grading";
import { serializeExhibits } from "@/lib/serialize";
import type {
  CaseStudy,
  DifficultyMode,
  Exhibit,
  GradeResult,
  Question,
} from "@/lib/types";

interface GradeArgs {
  caseStudy: CaseStudy;
  question: Question;
  exhibits: Exhibit[];
  userAnswer: string;
  mode: DifficultyMode;
}

// Grades a single answer: tries the Claude API, falls back to offline grading
// (deterministic for MC/quant) if the API is unavailable.
export async function gradeAnswer({
  caseStudy,
  question,
  exhibits,
  userAnswer,
  mode,
}: GradeArgs): Promise<GradeResult> {
  const objective = evaluateObjective(question, userAnswer);
  const objectiveVerdict = objective?.verdict ?? writtenNumericVerdict(question, userAnswer);

  const payload: GradeRequestPayload = {
    caseTitle: caseStudy.title,
    caseType: caseStudy.type,
    clientObjective: caseStudy.clientObjective,
    questionPrompt: humanizeAnswerForPrompt(question, userAnswer),
    questionFormat: question.format,
    dimension: question.dimension,
    rubric: question.rubric,
    modelAnswer: question.modelAnswer,
    exhibitsContext: serializeExhibits(exhibits),
    userAnswer: renderUserAnswer(question, userAnswer),
    objectiveVerdict,
    mode,
  };

  try {
    const res = await fetch("/api/grade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      return offlineGrade(question, userAnswer);
    }
    const data = await res.json();
    if (data?.grade) return data.grade as GradeResult;
    return offlineGrade(question, userAnswer);
  } catch {
    return offlineGrade(question, userAnswer);
  }
}

interface FinalRecArgs {
  caseStudy: CaseStudy;
  exhibits: Exhibit[];
  userAnswer: string;
  mode: DifficultyMode;
}

export async function gradeFinalRecommendation({
  caseStudy,
  exhibits,
  userAnswer,
  mode,
}: FinalRecArgs): Promise<GradeResult> {
  const payload: GradeRequestPayload = {
    caseTitle: caseStudy.title,
    caseType: caseStudy.type,
    clientObjective: caseStudy.clientObjective,
    questionPrompt:
      "Deliver a final 60-second recommendation to the client: recommendation, supporting evidence, risks, and next steps.",
    questionFormat: "long-text",
    dimension: "recommendation",
    rubric:
      "Grade as a final synthesis: 1) a clear, decisive recommendation up front, 2) 2-3 pieces of supporting evidence from the case, 3) key risks acknowledged, 4) concrete next steps. Reward top-down structure and brevity; penalize hedging, rambling, or missing components.",
    modelAnswer:
      "Lead with the recommendation, back it with the strongest 2-3 data points, name the main risk and a mitigation, and close with clear next steps — all in under a minute.",
    exhibitsContext: serializeExhibits(exhibits),
    userAnswer,
    mode,
    isFinalRecommendation: true,
  };

  try {
    const res = await fetch("/api/grade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return offlineRecGrade(userAnswer);
    const data = await res.json();
    if (data?.grade) return data.grade as GradeResult;
    return offlineRecGrade(userAnswer);
  } catch {
    return offlineRecGrade(userAnswer);
  }
}

function offlineRecGrade(userAnswer: string): GradeResult {
  const len = userAnswer.trim().length;
  const score = len === 0 ? 0 : len < 80 ? 4 : len <= 900 ? 6 : 5;
  return {
    score,
    whatWorked:
      len === 0
        ? "No recommendation was submitted."
        : "Recommendation submitted. (Offline mode: connect the Claude API for detailed synthesis feedback.)",
    whatWasMissing:
      "Detailed evaluation requires the Claude API. Set ANTHROPIC_API_KEY to enable full grading.",
    whatABCGConsultantWouldDo:
      "Lead with the recommendation, support with the 2-3 strongest data points, name a key risk + mitigation, and end with next steps.",
    betterAnswer:
      "We recommend [decision]. The evidence: [data point 1], [data point 2]. The main risk is [risk], mitigated by [action]. Next steps: [step 1], [step 2].",
    communicationReview: {
      structure: score,
      precision: score,
      prioritization: score,
      judgment: score,
    },
    caseyReadiness:
      score >= 8
        ? "Strong pass"
        : score >= 6.5
        ? "Pass"
        : score >= 4.5
        ? "Borderline"
        : "Likely fail",
    offline: true,
  };
}

// For MC questions, translate selected option IDs into readable text so Claude
// (and the prompt) reference the actual option content.
function renderUserAnswer(question: Question, userAnswer: string): string {
  if (
    (question.format === "single" || question.format === "multi") &&
    question.options
  ) {
    const ids = userAnswer
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const texts = ids
      .map((id) => question.options?.find((o) => o.id === id)?.text)
      .filter(Boolean);
    return texts.length ? texts.map((t) => `- ${t}`).join("\n") : "(no selection)";
  }
  return userAnswer;
}

function humanizeAnswerForPrompt(question: Question, _userAnswer: string): string {
  return question.prompt;
}

// For written-track questions that were originally quantitative, extract the
// number from the prose answer and compare to the expected value so the grader
// has a deterministic correctness signal.
function writtenNumericVerdict(
  question: Question,
  userAnswer: string
): string | undefined {
  if (question.expectedValue === undefined) return undefined;
  const num = parseNumeric(userAnswer);
  if (num === null) {
    return `Expected numeric result ~${question.expectedValue}; no clear number found in the written answer.`;
  }
  const tol = question.tolerance ?? Math.abs(question.expectedValue) * 0.02;
  const within = Math.abs(num - question.expectedValue) <= tol;
  return within
    ? `Stated figure ${num} matches the expected ${question.expectedValue}.`
    : `Stated figure ${num} does NOT match the expected ${question.expectedValue}.`;
}
