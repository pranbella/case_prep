"use client";

import { useEffect } from "react";

export interface ToastMessage {
  id: number;
  text: string;
  tone?: "info" | "warn" | "danger";
}

export function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}) {
  useEffect(() => {
    const id = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(id);
  }, [toast.id, onDismiss]);

  const tone =
    toast.tone === "danger"
      ? "border-red-500/60 bg-red-600/90"
      : toast.tone === "warn"
      ? "border-amber-500/60 bg-amber-500/90 text-black"
      : "border-ink-600 bg-ink-700";

  return (
    <div
      className={`animate-slideIn pointer-events-auto rounded-lg border px-4 py-2.5 text-sm font-medium text-white shadow-lg ${tone}`}
    >
      {toast.text}
    </div>
  );
}
