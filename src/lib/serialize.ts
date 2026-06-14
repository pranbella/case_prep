import type { Exhibit } from "@/lib/types";

// Convert exhibits into a compact text block for the grading prompt.
export function serializeExhibits(exhibits: Exhibit[]): string {
  if (exhibits.length === 0) return "";
  return exhibits
    .map((ex) => {
      const header = `${ex.title}${ex.note ? ` — ${ex.note}` : ""}`;
      const rows = ex.data
        .map((row) =>
          Object.entries(row)
            .map(([k, v]) => `${k}=${v}`)
            .join(", ")
        )
        .join(" | ");
      return `${header}\n  ${rows}`;
    })
    .join("\n");
}
