import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Container for a sequence of `<Step>` blocks. */
export function Steps({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <ol
      className={cn(
        "my-6 ms-1 space-y-6 border-s border-border ps-6 [counter-reset:step]",
        className,
      )}
    >
      {children}
    </ol>
  );
}

/** One step inside `<Steps>`. `title` is optional. */
export function Step({
  title,
  children,
  className,
}: {
  title?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <li className={cn("relative ps-8 [counter-increment:step]", className)}>
      <span
        aria-hidden="true"
        className="before:content-[counter(step)] absolute -start-[1.85rem] top-0 flex size-6 items-center justify-center rounded-full border bg-background text-xs font-medium text-muted-foreground"
      />
      {title ? (
        <p className="mt-0.5 mb-1 font-medium text-foreground">{title}</p>
      ) : null}
      <div className="text-sm text-muted-foreground [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {children}
      </div>
    </li>
  );
}
