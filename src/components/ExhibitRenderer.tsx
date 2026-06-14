import type { Exhibit } from "@/lib/types";
import { ChartExhibit } from "./ChartExhibit";
import { TableExhibit } from "./TableExhibit";

export function ExhibitRenderer({ exhibit }: { exhibit: Exhibit }) {
  return (
    <figure className="rounded-lg border border-ink-600 bg-ink-800 p-4">
      <figcaption className="mb-3 text-sm font-semibold text-gray-100">
        {exhibit.title}
      </figcaption>
      {exhibit.kind === "table" ? (
        <TableExhibit exhibit={exhibit} />
      ) : (
        <ChartExhibit exhibit={exhibit} />
      )}
      {exhibit.note && (
        <p className="mt-3 text-xs italic text-gray-400">{exhibit.note}</p>
      )}
    </figure>
  );
}

export function ExhibitList({ exhibits }: { exhibits: Exhibit[] }) {
  if (exhibits.length === 0) return null;
  return (
    <div className="space-y-4">
      {exhibits.map((ex) => (
        <ExhibitRenderer key={ex.id} exhibit={ex} />
      ))}
    </div>
  );
}
