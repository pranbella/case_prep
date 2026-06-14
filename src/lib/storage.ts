import type { Dimension, SimRun } from "@/lib/types";

const RUNS_KEY = "casey:runs";
const CURRENT_KEY = "casey:current"; // active run handoff between pages

export function loadRuns(): SimRun[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RUNS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SimRun[]) : [];
  } catch {
    return [];
  }
}

export function saveRun(run: SimRun): void {
  if (typeof window === "undefined") return;
  const runs = loadRuns();
  runs.push(run);
  window.localStorage.setItem(RUNS_KEY, JSON.stringify(runs));
}

export function clearRuns(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(RUNS_KEY);
}

// Handoff of the just-finished run to the results page.
export function setCurrentRun(run: SimRun): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(CURRENT_KEY, JSON.stringify(run));
}

export function getCurrentRun(): SimRun | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(CURRENT_KEY);
    return raw ? (JSON.parse(raw) as SimRun) : null;
  } catch {
    return null;
  }
}

export interface AnalyticsSummary {
  attempts: number;
  avgOverall: number;
  byDimension: Partial<Record<Dimension, number>>;
  trend: { date: number; score: number }[];
}

export function computeAnalytics(runs: SimRun[]): AnalyticsSummary {
  if (runs.length === 0) {
    return { attempts: 0, avgOverall: 0, byDimension: {}, trend: [] };
  }

  const avgOverall =
    runs.reduce((acc, r) => acc + r.overallScore, 0) / runs.length;

  const dims: Dimension[] = [
    "structuring",
    "data",
    "judgment",
    "quant",
    "recommendation",
  ];
  const byDimension: Partial<Record<Dimension, number>> = {};
  for (const d of dims) {
    const vals = runs
      .map((r) => r.dimensionScores[d])
      .filter((v): v is number => typeof v === "number");
    if (vals.length > 0) {
      byDimension[d] = vals.reduce((a, b) => a + b, 0) / vals.length;
    }
  }

  const trend = runs
    .slice()
    .sort((a, b) => a.finishedAt - b.finishedAt)
    .map((r) => ({ date: r.finishedAt, score: r.overallScore }));

  return { attempts: runs.length, avgOverall, byDimension, trend };
}
