"use client";

import { useEffect, useMemo, useState } from "react";
import { classNames } from "@/lib/format";
import { DIMENSION_LABELS, type Question } from "@/lib/types";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  // Called when the candidate commits an answer (manual submit, auto-submit, or timeout).
  onSubmit: (answer: string) => void;
  // Reports the current in-progress answer so the parent can capture it on timeout.
  onAnswerChange?: (answer: string) => void;
  disabled?: boolean;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onSubmit,
  onAnswerChange,
  disabled,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [text, setText] = useState("");

  // Reset local state when the question changes.
  useEffect(() => {
    setSelected([]);
    setText("");
  }, [question.id]);

  // Surface the current answer to the parent (used for timeout capture).
  useEffect(() => {
    if (!onAnswerChange) return;
    const current =
      question.format === "single" || question.format === "multi"
        ? selected.join(",")
        : text.trim();
    onAnswerChange(current);
  }, [selected, text, question.format, onAnswerChange]);

  const selectCount = question.selectCount ?? 1;

  const charLimit = question.charLimit ?? 600;
  const remainingChars = charLimit - text.length;

  const canSubmit = useMemo(() => {
    if (disabled) return false;
    if (question.format === "single") return selected.length === 1;
    if (question.format === "multi") return selected.length === selectCount;
    return text.trim().length > 0;
  }, [disabled, question.format, selected.length, selectCount, text]);

  function toggleOption(id: string) {
    if (disabled) return;
    if (question.format === "single") {
      // Single-select submits immediately, mirroring real Casey behavior.
      setSelected([id]);
      onSubmit(id);
      return;
    }
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= selectCount) return prev; // cap selections
      return [...prev, id];
    });
  }

  function handleSubmit() {
    if (!canSubmit) return;
    if (question.format === "single" || question.format === "multi") {
      onSubmit(selected.join(","));
    } else {
      onSubmit(text.trim());
    }
  }

  return (
    <div className="animate-slideIn space-y-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-400">
        <span className="rounded bg-ink-700 px-2 py-0.5">
          Q{questionNumber} / {totalQuestions}
        </span>
        <span className="rounded bg-bcg-dark/60 px-2 py-0.5 text-bcg-accent">
          {DIMENSION_LABELS[question.dimension]}
        </span>
        <span className="text-gray-500">{formatTypeLabel(question.format)}</span>
      </div>

      <div className="rounded-lg border border-ink-600 bg-ink-800 p-4">
        <div className="mb-1 flex items-center gap-2">
          <CaseyAvatar />
          <span className="text-xs font-semibold text-bcg-accent">Casey</span>
        </div>
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-gray-100">
          {question.prompt}
        </p>
        {question.format === "multi" && (
          <p className="mt-2 text-xs text-amber-400">
            Select exactly {selectCount}.
          </p>
        )}
        {question.format === "single" && (
          <p className="mt-2 text-xs text-amber-400">
            Selecting an option submits it immediately — choose carefully.
          </p>
        )}
      </div>

      {(question.format === "single" || question.format === "multi") &&
        question.options && (
          <div className="grid gap-2">
            {question.options.map((opt) => {
              const isSelected = selected.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => toggleOption(opt.id)}
                  disabled={disabled}
                  className={classNames(
                    "rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                    isSelected
                      ? "border-bcg-accent bg-bcg-dark/40 text-white"
                      : "border-ink-600 bg-ink-800 text-gray-200 hover:border-gray-500",
                    disabled && "cursor-not-allowed opacity-60"
                  )}
                >
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-gray-500 text-xs">
                    {isSelected ? "✓" : ""}
                  </span>
                  {opt.text}
                </button>
              );
            })}
          </div>
        )}

      {question.format === "short-quant" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="decimal"
              value={text}
              disabled={disabled}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder={`Enter your numeric answer${
                question.unitHint ? ` (${question.unitHint})` : ""
              }`}
              className="w-full rounded-lg border border-ink-600 bg-ink-800 px-4 py-3 font-mono text-gray-100 outline-none focus:border-bcg-accent"
            />
            {question.unitHint && (
              <span className="whitespace-nowrap text-sm text-gray-400">
                {question.unitHint}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Calculator allowed. Show only the final number.
          </p>
        </div>
      )}

      {question.format === "long-text" && question.options && question.options.length > 0 && (
        <div className="rounded-lg border border-ink-600 bg-ink-900 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Options to consider (write out and justify your choice)
          </p>
          <ul className="space-y-1 text-sm text-gray-300">
            {question.options.map((opt) => (
              <li key={opt.id} className="flex gap-2">
                <span className="text-gray-600">•</span>
                {opt.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      {question.format === "long-text" && (
        <div className="space-y-1">
          <textarea
            value={text}
            disabled={disabled}
            onChange={(e) =>
              e.target.value.length <= charLimit && setText(e.target.value)
            }
            rows={5}
            placeholder="Type a concise, structured answer (3-6 lines). Brevity is rewarded."
            className="w-full resize-none rounded-lg border border-ink-600 bg-ink-800 px-4 py-3 text-sm leading-relaxed text-gray-100 outline-none focus:border-bcg-accent"
          />
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">
              Aim for 3-6 tight lines. No generic frameworks.
            </span>
            <span
              className={classNames(
                remainingChars < 60 ? "text-amber-400" : "text-gray-500"
              )}
            >
              {remainingChars} characters left
            </span>
          </div>
        </div>
      )}

      {question.format !== "single" && (
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={classNames(
            "w-full rounded-lg px-4 py-3 text-sm font-semibold transition-colors",
            canSubmit
              ? "bg-bcg-green text-white hover:bg-bcg-accent"
              : "cursor-not-allowed bg-ink-700 text-gray-500"
          )}
        >
          Submit answer
        </button>
      )}
    </div>
  );
}

function formatTypeLabel(format: Question["format"]): string {
  switch (format) {
    case "single":
      return "Single select";
    case "multi":
      return "Multi select";
    case "short-quant":
      return "Quantitative";
    case "long-text":
      return "Written response";
  }
}

function CaseyAvatar() {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-bcg-green text-[10px] font-bold text-white">
      C
    </span>
  );
}
