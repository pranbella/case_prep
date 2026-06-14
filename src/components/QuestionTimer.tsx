"use client";

import { useEffect, useRef, useState } from "react";
import { classNames, formatClock } from "@/lib/format";

interface QuestionTimerProps {
  // Unique key for the question; resets the timer when it changes.
  questionId: string;
  seconds: number;
  onExpire: () => void;
}

// Per-question countdown that auto-submits (via onExpire) when it hits zero.
export function QuestionTimer({ questionId, seconds, onExpire }: QuestionTimerProps) {
  const [remaining, setRemaining] = useState(seconds);
  const firedRef = useRef(false);

  useEffect(() => {
    setRemaining(seconds);
    firedRef.current = false;
  }, [questionId, seconds]);

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;
        if (next <= 0 && !firedRef.current) {
          firedRef.current = true;
          onExpire();
        }
        return Math.max(0, next);
      });
    }, 1000);
    return () => clearInterval(id);
  }, [questionId, onExpire]);

  const pct = Math.max(0, Math.min(100, (remaining / seconds) * 100));
  const urgent = remaining <= 15;

  return (
    <div className="flex items-center gap-3">
      <div
        className={classNames(
          "font-mono text-sm font-semibold tabular-nums",
          urgent ? "text-red-400 animate-pulseUrgent" : "text-gray-200"
        )}
      >
        {formatClock(remaining)}
      </div>
      <div className="h-1.5 w-28 overflow-hidden rounded-full bg-ink-600">
        <div
          className={classNames(
            "h-full transition-[width] duration-1000 ease-linear",
            urgent ? "bg-red-500" : "bg-bcg-accent"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
