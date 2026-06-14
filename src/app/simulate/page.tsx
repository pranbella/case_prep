"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ExhibitList } from "@/components/ExhibitRenderer";
import { FeedbackPanel } from "@/components/FeedbackPanel";
import { FinalRecommendation } from "@/components/FinalRecommendation";
import { GlobalTimer } from "@/components/GlobalTimer";
import { QuestionCard } from "@/components/QuestionCard";
import { QuestionTimer } from "@/components/QuestionTimer";
import { ToastStack, type ToastMessage } from "@/components/Toast";
import {
  buildRunQuestions,
  exhibitsForQuestion,
  pickCase,
  visibleExhibits,
} from "@/lib/caseEngine";
import { gradeAnswer, gradeFinalRecommendation } from "@/lib/gradeClient";
import { readinessFromScore } from "@/lib/grading";
import { saveRun, setCurrentRun } from "@/lib/storage";
import {
  CASE_TYPE_LABELS,
  type AnswerRecord,
  type CaseStudy,
  type CaseType,
  type DifficultyMode,
  type Dimension,
  type FeedbackTiming,
  type GradeResult,
  type PracticeTrack,
  type Question,
  type SimRun,
} from "@/lib/types";

const TOTAL_SECONDS = 30 * 60;

type Phase = "briefing" | "questions" | "feedback" | "final" | "grading";

function SimulateInner() {
  const router = useRouter();
  const params = useSearchParams();

  const mode = (params.get("mode") as DifficultyMode) || "standard";
  const caseTypeParam = (params.get("caseType") as CaseType | "random") || "random";
  const track = (params.get("track") as PracticeTrack) || "full";
  // Written practice always grades each question immediately after submission.
  const feedbackTiming: FeedbackTiming =
    track === "written"
      ? "immediate"
      : (params.get("feedback") as FeedbackTiming) || "end";

  // Choose the case once, on mount.
  const caseStudy = useMemo<CaseStudy>(
    () => pickCase({ mode, feedback: feedbackTiming, caseType: caseTypeParam, track }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const questions = useMemo<Question[]>(
    () => buildRunQuestions(caseStudy, mode, track),
    [caseStudy, mode, track]
  );

  // Total includes the final recommendation as the last "question" (e.g., Q9 of 9).
  const totalSteps = questions.length + 1;

  const [phase, setPhase] = useState<Phase>("briefing");
  const [qIndex, setQIndex] = useState(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [lastGrade, setLastGrade] = useState<GradeResult | null>(null);
  const [globalPaused, setGlobalPaused] = useState(false);
  // Count of answers graded so far (for the silent end-of-case progress indicator).
  const [gradedCount, setGradedCount] = useState(0);

  const startedAtRef = useRef<number>(Date.now());
  // Mirrors qIndex so navigation callbacks always read the current index
  // (avoids stale-closure bugs when advancing from background-graded answers).
  const qIndexRef = useRef(0);
  useEffect(() => {
    qIndexRef.current = qIndex;
  }, [qIndex]);
  const answersRef = useRef<AnswerRecord[]>([]);
  const gradePromisesRef = useRef<Promise<void>[]>([]);
  const currentAnswerRef = useRef<string>("");
  const submitGuardRef = useRef<number>(-1);
  const finalizedRef = useRef(false);

  const pushToast = useCallback((text: string, tone?: ToastMessage["tone"]) => {
    setToasts((prev) => [...prev, { id: Date.now() + Math.random(), text, tone }]);
  }, []);
  const dismissToast = useCallback(
    (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id)),
    []
  );

  const briefingExhibits = useMemo(
    () => visibleExhibits(caseStudy, mode),
    [caseStudy, mode]
  );

  const currentQuestion = questions[qIndex];
  const currentExhibits = useMemo(
    () =>
      currentQuestion
        ? exhibitsForQuestion(caseStudy, currentQuestion, mode)
        : [],
    [caseStudy, currentQuestion, mode]
  );

  // ---- Grading orchestration ----
  const gradeAndStore = useCallback(
    async (question: Question, answer: string, timedOut: boolean) => {
      const exhibits = exhibitsForQuestion(caseStudy, question, mode);
      const record: AnswerRecord = {
        questionId: question.id,
        dimension: question.dimension,
        format: question.format,
        prompt: question.prompt,
        userAnswer: answer,
        timedOut,
      };
      answersRef.current.push(record);

      const p = gradeAnswer({ caseStudy, question, exhibits, userAnswer: answer, mode })
        .then((grade) => {
          record.grade = grade;
          setGradedCount((c) => c + 1);
          if (feedbackTiming === "immediate") setLastGrade(grade);
        })
        .catch(() => {
          /* offlineGrade already handles failure inside gradeAnswer */
        });

      if (feedbackTiming === "immediate") {
        await p;
      } else {
        gradePromisesRef.current.push(p);
      }
    },
    [caseStudy, mode, feedbackTiming]
  );

  const advanceAfterSubmit = useCallback(() => {
    if (feedbackTiming === "immediate") {
      setGlobalPaused(true);
      setPhase("feedback");
    } else {
      goToNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedbackTiming]);

  const goToNext = useCallback(() => {
    setLastGrade(null);
    setGlobalPaused(false);
    const cur = qIndexRef.current;
    if (cur + 1 >= questions.length) {
      setPhase("final");
    } else {
      qIndexRef.current = cur + 1;
      setQIndex(cur + 1);
      setPhase("questions");
    }
  }, [questions.length]);

  // Skip the current question: records a zero with a "skipped" flag and advances.
  const handleSkip = useCallback(() => {
    if (submitGuardRef.current === qIndex) return;
    submitGuardRef.current = qIndex;
    currentAnswerRef.current = "";
    const q = questions[qIndex];
    const skipGrade: GradeResult = {
      score: 0,
      whatWorked: "Question skipped — no answer was given.",
      whatWasMissing:
        "You skipped this question. In the real Casey assessment you cannot skip.",
      whatABCGConsultantWouldDo: q.modelAnswer,
      betterAnswer: q.modelAnswer,
      communicationReview: { structure: 0, precision: 0, prioritization: 0, judgment: 0 },
      caseyReadiness: "Likely fail",
    };
    answersRef.current.push({
      questionId: q.id,
      dimension: q.dimension,
      format: q.format,
      prompt: q.prompt,
      userAnswer: "",
      timedOut: false,
      skipped: true,
      grade: skipGrade,
    });
    setGradedCount((c) => c + 1);
    pushToast("Question skipped.", "info");
    goToNext();
  }, [qIndex, questions, goToNext, pushToast]);

  const submitAnswer = useCallback(
    async (answer: string, timedOut: boolean) => {
      if (submitGuardRef.current === qIndex) return; // prevent double submit
      submitGuardRef.current = qIndex;
      currentAnswerRef.current = "";
      const q = questions[qIndex];
      if (feedbackTiming === "immediate") {
        setGlobalPaused(true);
        setPhase("feedback");
        await gradeAndStore(q, answer, timedOut);
      } else {
        await gradeAndStore(q, answer, timedOut);
        advanceAfterSubmit();
      }
    },
    [qIndex, questions, gradeAndStore, feedbackTiming, advanceAfterSubmit]
  );

  // Fill any unanswered questions as timed-out (used when the global clock ends).
  const finalizeRemainingAsTimeout = useCallback(() => {
    const answeredIds = new Set(answersRef.current.map((a) => a.questionId));
    for (let i = qIndex; i < questions.length; i++) {
      const q = questions[i];
      if (answeredIds.has(q.id)) continue;
      void gradeAndStore(q, "", true);
    }
  }, [qIndex, questions, gradeAndStore]);

  const handleGlobalExpire = useCallback(() => {
    if (finalizedRef.current) return;
    if (phase === "questions" || phase === "feedback") {
      pushToast("Time's up on the case. Moving to your final recommendation.", "danger");
      finalizeRemainingAsTimeout();
      setGlobalPaused(true);
      setLastGrade(null);
      setPhase("final");
    }
  }, [phase, finalizeRemainingAsTimeout, pushToast]);

  const handleReminder = useCallback(
    (minutesLeft: number) => {
      pushToast(`${minutesLeft} minutes remaining.`, minutesLeft <= 5 ? "warn" : "info");
    },
    [pushToast]
  );

  // ---- Final recommendation ----
  const completeRun = useCallback(
    async (recAnswer: string) => {
      setPhase("grading");
      // Wait for any in-flight question grades.
      await Promise.allSettled(gradePromisesRef.current);

      const recGrade = await gradeFinalRecommendation({
        caseStudy,
        exhibits: visibleExhibits(caseStudy, mode),
        userAnswer: recAnswer,
        mode,
      });

      const answers = answersRef.current;
      const recordWithRec: AnswerRecord = {
        questionId: "final-recommendation",
        dimension: "recommendation",
        format: "long-text",
        prompt: "Final 60-second recommendation",
        userAnswer: recAnswer,
        timedOut: false,
        grade: recGrade,
      };

      const allGraded = [...answers, recordWithRec].filter((a) => a.grade);
      const overall =
        allGraded.length > 0
          ? allGraded.reduce((acc, a) => acc + (a.grade?.score ?? 0), 0) /
            allGraded.length
          : 0;

      const dimensionScores = computeDimensionScores([...answers, recordWithRec]);

      const run: SimRun = {
        id: `run-${startedAtRef.current}`,
        startedAt: startedAtRef.current,
        finishedAt: Date.now(),
        caseId: caseStudy.id,
        caseTitle: caseStudy.title,
        caseType: caseStudy.type,
        mode,
        track,
        answers,
        recommendationGrade: recGrade,
        overallScore: Math.round(overall * 10) / 10,
        dimensionScores,
        readiness: readinessFromScore(overall),
      };

      saveRun(run);
      setCurrentRun(run);
      router.push("/results");
    },
    [caseStudy, mode, track, router]
  );

  // ---- Render ----
  if (phase === "grading") {
    return (
      <CenteredMessage
        title="Scoring your assessment"
        subtitle={`Your ex-BCG interviewer is reviewing every answer... (${gradedCount}/${questions.length} questions graded)`}
        spinner
      />
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between gap-3 rounded-lg border border-ink-600 bg-ink-800 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            {caseStudy.title}
          </p>
          <p className="text-xs text-gray-400">
            {CASE_TYPE_LABELS[caseStudy.type]} ·{" "}
            {mode === "hard" ? (
              <span className="text-red-400">Hard mode</span>
            ) : (
              "Standard"
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {phase !== "briefing" && feedbackTiming === "end" && (
            <span
              className="flex items-center gap-1.5 rounded-md bg-ink-700 px-2.5 py-1.5 text-xs font-medium text-gray-300"
              title="Your answers are being graded in the background. Scores appear at the end."
            >
              <span className="h-2 w-2 rounded-full bg-bcg-accent" />
              Graded {gradedCount}/{questions.length}
            </span>
          )}
          {phase !== "briefing" && (
            <GlobalTimer
              totalSeconds={TOTAL_SECONDS}
              onExpire={handleGlobalExpire}
              onReminder={handleReminder}
              paused={globalPaused}
            />
          )}
        </div>
      </div>

      {phase === "briefing" && (
        <Briefing
          caseStudy={caseStudy}
          exhibits={briefingExhibits}
          onStart={() => {
            startedAtRef.current = Date.now();
            setPhase("questions");
          }}
        />
      )}

      {phase === "questions" && currentQuestion && (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-ink-600 bg-ink-800 px-4 py-2">
              <span className="text-xs uppercase tracking-wide text-gray-400">
                Question timer
              </span>
              <QuestionTimer
                questionId={currentQuestion.id}
                seconds={currentQuestion.timeLimitSec}
                onExpire={() => {
                  pushToast("Question time expired — answer auto-submitted.", "warn");
                  void submitAnswer(currentAnswerRef.current, true);
                }}
              />
            </div>
            <QuestionCard
              question={currentQuestion}
              questionNumber={qIndex + 1}
              totalQuestions={totalSteps}
              onAnswerChange={(a) => (currentAnswerRef.current = a)}
              onSubmit={(a) => void submitAnswer(a, false)}
            />
            <button
              onClick={handleSkip}
              className="w-full rounded-lg border border-ink-600 px-4 py-2 text-sm text-gray-400 transition-colors hover:border-gray-500 hover:text-gray-200"
            >
              Skip this question (practice only — scores 0)
            </button>
          </div>
          <div className="space-y-4">
            <ContextHeader hasExhibits={currentExhibits.length > 0} />
            <ExhibitList exhibits={currentExhibits} />
          </div>
        </div>
      )}

      {phase === "feedback" && (
        <div className="mx-auto max-w-2xl space-y-4">
          {lastGrade ? (
            <FeedbackPanel grade={lastGrade} title="Question feedback" />
          ) : (
            <CenteredMessage title="Grading your answer..." spinner />
          )}
          {lastGrade && (
            <button
              onClick={goToNext}
              className="w-full rounded-lg bg-bcg-green px-4 py-3 font-semibold text-white hover:bg-bcg-accent"
            >
              {qIndex + 1 >= questions.length
                ? "Continue to final recommendation"
                : "Next question"}
            </button>
          )}
        </div>
      )}

      {phase === "final" && (
        <FinalRecommendation
          onComplete={(ans) => void completeRun(ans)}
          questionNumber={totalSteps}
          totalQuestions={totalSteps}
        />
      )}
    </main>
  );
}

function Briefing({
  caseStudy,
  exhibits,
  onStart,
}: {
  caseStudy: CaseStudy;
  exhibits: CaseStudy["exhibits"];
  onStart: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-ink-600 bg-ink-800 p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-bcg-accent">
          Client objective
        </p>
        <p className="mt-2 text-lg leading-relaxed text-white">
          {caseStudy.clientObjective}
        </p>
        <hr className="my-4 border-ink-600" />
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Background
        </p>
        <p className="mt-2 text-sm leading-relaxed text-gray-300">
          {caseStudy.background}
        </p>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Exhibits ({exhibits.length})
        </h3>
        <ExhibitList exhibits={exhibits} />
      </div>

      <div className="sticky bottom-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-center">
        <p className="mb-3 text-sm text-amber-200">
          Once you begin, the 30-minute clock starts and cannot be paused. You
          cannot go back to previous questions or ask Casey anything.
        </p>
        <button
          onClick={onStart}
          className="rounded-lg bg-bcg-green px-6 py-3 font-semibold text-white hover:bg-bcg-accent"
        >
          I understand — start the clock
        </button>
      </div>
    </div>
  );
}

function ContextHeader({ hasExhibits }: { hasExhibits: boolean }) {
  return (
    <div className="rounded-lg border border-ink-600 bg-ink-800 px-4 py-2 text-xs text-gray-400">
      {hasExhibits
        ? "Relevant exhibits for this question:"
        : "No exhibit for this question — reason from the brief."}
    </div>
  );
}

function CenteredMessage({
  title,
  subtitle,
  spinner,
}: {
  title: string;
  subtitle?: string;
  spinner?: boolean;
}) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
      {spinner && (
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-600 border-t-bcg-accent" />
      )}
      <p className="text-lg font-semibold text-white">{title}</p>
      {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
    </div>
  );
}

function computeDimensionScores(
  answers: AnswerRecord[]
): Partial<Record<Dimension, number>> {
  const buckets: Record<string, number[]> = {};
  for (const a of answers) {
    if (!a.grade) continue;
    (buckets[a.dimension] ??= []).push(a.grade.score);
  }
  const out: Partial<Record<Dimension, number>> = {};
  for (const [dim, vals] of Object.entries(buckets)) {
    if (vals.length > 0) {
      out[dim as Dimension] =
        Math.round((vals.reduce((x, y) => x + y, 0) / vals.length) * 10) / 10;
    }
  }
  return out;
}

export default function SimulatePage() {
  return (
    <Suspense
      fallback={
        <CenteredMessage title="Loading simulation..." spinner />
      }
    >
      <SimulateInner />
    </Suspense>
  );
}
