import { Fragment } from "react";

/**
 * Wraps every case-insensitive occurrence of the query in the text.
 *
 * Splitting on a capture group keeps the original casing, so "Figma" stays
 * "Figma" while matching a typed "fig". Repeated fragments get an occurrence
 * suffix so keys stay stable without leaning on the array index.
 */
export function Highlight({ text, query }: { text: string; query: string }) {
  const term = query.trim();
  if (!term) return <>{text}</>;

  const pattern = new RegExp(`(${escapeRegExp(term)})`, "gi");
  const parts = text.split(pattern);
  if (parts.length === 1) return <>{text}</>;

  const occurrences = new Map<string, number>();
  const segments = parts.map((part) => {
    const count = occurrences.get(part) ?? 0;
    occurrences.set(part, count + 1);
    return { key: `${part}::${count}`, part };
  });

  return (
    <>
      {segments.map(({ key, part }) =>
        part.toLowerCase() === term.toLowerCase() ? (
          <mark
            key={key}
            className="rounded-[2px] bg-my-secondary text-my-bg"
          >
            {part}
          </mark>
        ) : (
          <Fragment key={key}>{part}</Fragment>
        ),
      )}
    </>
  );
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
