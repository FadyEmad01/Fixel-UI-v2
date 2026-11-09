"use client";

import { cn } from "@/lib/utils";
import { CopyButton } from "@/shared/components/code-block";

/**
 * One copyable command line.
 *
 * Kept as a component (rather than a `CodeBlock`) because an install command is
 * a single line: highlighting it adds weight and the horizontal scroll needed
 * for a long registry URL would hide the copy button in a viewport.
 */
export function InstallCommand({
  command,
  className,
}: {
  command: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center overflow-hidden rounded-lg bg-muted py-2.5 pr-11 pl-4 font-mono text-[13px]",
        className,
      )}
    >
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap scrollbar-none">
        {command}
      </code>
      <div className="absolute top-1/2 right-2 -translate-y-1/2">
        <CopyButton getText={() => command} />
      </div>
    </div>
  );
}
