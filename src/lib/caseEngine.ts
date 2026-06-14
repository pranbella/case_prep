import { CASE_BANK } from "@/data/cases";
import type {
  CaseStudy,
  CaseType,
  DifficultyMode,
  Exhibit,
  PracticeTrack,
  Question,
  SimSettings,
} from "@/lib/types";

// Minimum time to type out a written answer.
const WRITTEN_MIN_SECONDS = 180;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickCase(settings: SimSettings): CaseStudy {
  let pool = CASE_BANK;
  if (settings.caseType && settings.caseType !== "random") {
    const filtered = CASE_BANK.filter((c) => c.type === settings.caseType);
    if (filtered.length > 0) pool = filtered;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

// Hard mode compresses time and surfaces distractor exhibits.
function hardenTimeLimit(base: number): number {
  return Math.max(30, Math.round(base * 0.7));
}

// Returns the exhibits that should be visible for a given mode.
export function visibleExhibits(
  caseStudy: CaseStudy,
  mode: DifficultyMode
): Exhibit[] {
  if (mode === "hard") return caseStudy.exhibits;
  return caseStudy.exhibits.filter((e) => !e.hardModeOnly);
}

export function exhibitsForQuestion(
  caseStudy: CaseStudy,
  question: Question,
  mode: DifficultyMode
): Exhibit[] {
  const visibleIds = new Set(visibleExhibits(caseStudy, mode).map((e) => e.id));
  return caseStudy.exhibits.filter(
    (e) => question.exhibitRefs.includes(e.id) && visibleIds.has(e.id)
  );
}

// Builds the runtime question list for the chosen mode + track. Question order
// is preserved (cases flow logically) but timers are adjusted and MC option
// order is shuffled to discourage memorization. In the "written" track every
// question becomes a typed long-text response (options are kept only as context).
export function buildRunQuestions(
  caseStudy: CaseStudy,
  mode: DifficultyMode,
  track: PracticeTrack = "full"
): Question[] {
  return caseStudy.questions.map((q) => {
    const next: Question = {
      ...q,
      timeLimitSec: mode === "hard" ? hardenTimeLimit(q.timeLimitSec) : q.timeLimitSec,
    };

    if (next.options && next.options.length > 0) {
      next.options = shuffle(next.options);
    }

    if (track === "written") {
      // Force a written response; keep options as on-screen context.
      const writtenTime = Math.max(next.timeLimitSec, WRITTEN_MIN_SECONDS);
      next.format = "long-text";
      next.charLimit = next.charLimit ?? 600;
      next.timeLimitSec =
        mode === "hard" ? hardenTimeLimit(writtenTime) : writtenTime;
    }

    return next;
  });
}

export const caseTypesAvailable = (): CaseType[] => {
  return Array.from(new Set(CASE_BANK.map((c) => c.type)));
};
