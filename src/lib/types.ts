// Core domain types for the BCG Casey simulator.

export type CaseType =
  | "profitability"
  | "market-entry"
  | "growth"
  | "pricing"
  | "customer-satisfaction"
  | "operations"
  | "digital-transformation"
  | "sustainability";

export const CASE_TYPE_LABELS: Record<CaseType, string> = {
  profitability: "Profitability Decline",
  "market-entry": "Market Entry",
  growth: "Growth Strategy",
  pricing: "Pricing",
  "customer-satisfaction": "Customer Satisfaction",
  operations: "Operations Improvement",
  "digital-transformation": "Digital Transformation",
  sustainability: "Sustainability Strategy",
};

export type QuestionFormat = "single" | "multi" | "short-quant" | "long-text";

// The skill dimension a question maps to (used for analytics breakdown).
export type Dimension =
  | "structuring"
  | "data"
  | "judgment"
  | "quant"
  | "recommendation";

export const DIMENSION_LABELS: Record<Dimension, string> = {
  structuring: "Structuring",
  data: "Data Analysis",
  judgment: "Business Judgment",
  quant: "Quantitative",
  recommendation: "Recommendation",
};

export type ChartKind = "bar" | "line" | "pie" | "table";

export interface ChartSeries {
  key: string;
  label: string;
}

export interface Exhibit {
  id: string;
  kind: ChartKind;
  title: string;
  note?: string;
  // For bar/line/pie: array of row objects. For table: array of row objects.
  data: Record<string, string | number>[];
  // Category axis key (x axis / table first column).
  categoryKey?: string;
  // Series for bar/line; for pie use a single series with `valueKey`.
  series?: ChartSeries[];
  valueKey?: string;
  // Table column order + headers.
  columns?: { key: string; label: string; unit?: string }[];
  unit?: string;
  // Distractor exhibits are only surfaced in hard mode.
  hardModeOnly?: boolean;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  format: QuestionFormat;
  dimension: Dimension;
  prompt: string;
  // IDs of exhibits relevant to this question (shown alongside it).
  exhibitRefs: string[];
  options?: QuestionOption[];
  // For multi: number of selections required.
  selectCount?: number;
  // Base time limit in seconds (hard mode reduces this).
  timeLimitSec: number;
  charLimit?: number;
  // Grading guidance fed to Claude.
  rubric: string;
  modelAnswer: string;
  // For deterministic grading:
  correctOptionIds?: string[]; // single/multi
  expectedValue?: number; // short-quant
  tolerance?: number; // absolute tolerance for quant
  unitHint?: string; // e.g. "units", "$M", "%"
}

export interface CaseStudy {
  id: string;
  type: CaseType;
  title: string;
  company: string;
  clientObjective: string;
  background: string;
  exhibits: Exhibit[];
  questions: Question[];
}

export type DifficultyMode = "standard" | "hard";
export type FeedbackTiming = "immediate" | "end";

// "full" = mixed formats (real Casey). "written" = every answer is typed prose.
export type PracticeTrack = "full" | "written";

export interface SimSettings {
  mode: DifficultyMode;
  feedback: FeedbackTiming;
  caseType?: CaseType | "random";
  track?: PracticeTrack;
}

export interface CommunicationReview {
  structure: number;
  precision: number;
  prioritization: number;
  judgment: number;
}

export type CaseyReadiness =
  | "Strong pass"
  | "Pass"
  | "Borderline"
  | "Likely fail";

export interface GradeResult {
  score: number; // 0-10
  whatWorked: string;
  whatWasMissing: string;
  whatABCGConsultantWouldDo: string;
  betterAnswer: string;
  communicationReview: CommunicationReview;
  caseyReadiness: CaseyReadiness;
  // True if produced by deterministic/local fallback rather than Claude.
  offline?: boolean;
}

export interface AnswerRecord {
  questionId: string;
  dimension: Dimension;
  format: QuestionFormat;
  prompt: string;
  userAnswer: string;
  timedOut: boolean;
  skipped?: boolean;
  grade?: GradeResult;
}

export interface SimRun {
  id: string;
  startedAt: number;
  finishedAt: number;
  caseId: string;
  caseTitle: string;
  caseType: CaseType;
  mode: DifficultyMode;
  track: PracticeTrack;
  answers: AnswerRecord[];
  recommendationGrade?: GradeResult;
  overallScore: number; // 0-10 average
  dimensionScores: Partial<Record<Dimension, number>>;
  readiness: CaseyReadiness;
}
