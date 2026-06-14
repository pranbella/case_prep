"use client";

import { useEffect, useRef, useState } from "react";
import { classNames, formatClock } from "@/lib/format";

interface GlobalTimerProps {
  totalSeconds: number;
  onExpire: () => void;
  onReminder?: (minutesLeft: number) => void;
  paused?: boolean;
}

// Always-visible assessment countdown. Fires onReminder roughly every 5 minutes.
export function GlobalTimer({
  totalSeconds,
  onExpire,
  onReminder,
  paused,
}: GlobalTimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const expiredRef = useRef(false);
  const lastReminderBucket = useRef<number>(Math.ceil(totalSeconds / 60));

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;

        const minutesLeft = Math.floor(next / 60);
        if (
          next > 0 &&
          minutesLeft > 0 &&
          minutesLeft % 5 === 0 &&
          next % 60 === 0 &&
          minutesLeft !== lastReminderBucket.current
        ) {
          lastReminderBucket.current = minutesLeft;
          onReminder?.(minutesLeft);
        }

        if (next <= 0 && !expiredRef.current) {
          expiredRef.current = true;
          onExpire();
        }
        return Math.max(0, next);
      });
    }, 1000);
    return () => clearInterval(id);
  }, [paused, onExpire, onReminder]);

  const urgent = remaining <= 300;
  const critical = remaining <= 60;

  return (
    <div
      className={classNames(
        "flex items-center gap-2 rounded-md px-3 py-1.5 font-mono text-sm font-semibold tabular-nums",
        critical
          ? "bg-red-600 text-white animate-pulseUrgent"
          : urgent
          ? "bg-amber-500/90 text-black"
          : "bg-ink-700 text-gray-100"
      )}
      aria-label="Assessment time remaining"
    >
      <span className="text-xs font-normal opacity-80">TOTAL</span>
      {formatClock(remaining)}
    </div>
  );
}
