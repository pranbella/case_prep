import type { Exhibit } from "@/lib/types";

export function TableExhibit({ exhibit }: { exhibit: Exhibit }) {
  const columns =
    exhibit.columns ??
    Object.keys(exhibit.data[0] ?? {}).map((key) => ({ key, label: key }));

  return (
    <div className="overflow-x-auto rounded-md border border-ink-600">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-ink-700 text-left">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-3 py-2 font-semibold text-gray-200 whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {exhibit.data.map((row, i) => {
            const isTotal = String(row[columns[0].key])
              .toLowerCase()
              .includes("operating profit");
            return (
              <tr
                key={i}
                className={`border-t border-ink-600 ${
                  isTotal ? "bg-bcg-dark/40 font-semibold text-bcg-accent" : ""
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-3 py-2 text-gray-100 whitespace-nowrap"
                  >
                    {String(row[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
