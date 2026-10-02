import type { ReactNode } from "react";

interface PreviewFrameProps {
  children: ReactNode;
  className?: string;
}

export function PreviewFrame({ children, className }: PreviewFrameProps) {
  return (
    <section
      className={[
        "relative overflow-hidden rounded-2xl border border-border bg-muted/30",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex min-h-[420px] items-center justify-center p-10">
        {children}
      </div>
    </section>
  );
}
