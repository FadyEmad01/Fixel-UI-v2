"use client";

import { cn } from "cn";
import { Check, Copy } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Recover the copyable source from a rendered code viewport.
 *
 * Highlighted code emits one element per line (`[data-line]` or `.line`,
 * depending on the transformer); reading the lines keeps gutters, line
 * numbers, and copy affordances out of the copied text. Falls back to the
 * raw text content for unhighlighted blocks.
 */
export function getPreText(area: HTMLElement | null): string {
  if (!area) return "";

  const lines = Array.from(area.querySelectorAll("[data-line], .line"));
  if (lines.length > 0) {
    return lines
      .map((line) => line.textContent ?? "")
      .join("\n")
      .replace(/\n$/, "");
  }

  return (area.textContent ?? "").replace(/\n$/, "");
}

export function CopyButton({
  getText,
  className,
}: {
  getText: () => string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const onCopy = useCallback(async () => {
    const text = getText();
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard access denied (permissions or insecure context). Stay in
      // the idle state rather than reporting a copy that never happened.
      return;
    }

    setCopied(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  }, [getText]);

  return (
    <button
      type="button"
      aria-label={copied ? "Copied" : "Copy code"}
      onClick={onCopy}
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-md text-muted-foreground/70 transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      )}
    >
      {copied ? (
        <Check className="size-3.5 text-green-600" aria-hidden="true" />
      ) : (
        <Copy className="size-3.5" aria-hidden="true" />
      )}
    </button>
  );
}
