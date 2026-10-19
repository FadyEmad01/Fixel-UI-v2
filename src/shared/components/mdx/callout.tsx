import { AlertTriangle, Info, Lightbulb, OctagonAlert } from "lucide-react";
import type { ComponentType, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type CalloutType = "info" | "tip" | "warning" | "danger";

const calloutStyles: Record<
  CalloutType,
  {
    container: string;
    icon: ComponentType<{ className?: string }>;
  }
> = {
  info: {
    container: "border-sky-500/30 bg-sky-500/5 text-sky-900 dark:text-sky-200",
    icon: Info,
  },
  tip: {
    // `tip` doubles as the generic callout in the docs voice.
    container:
      "border-emerald-500/30 bg-emerald-500/5 text-emerald-900 dark:text-emerald-200",
    icon: Lightbulb,
  },
  warning: {
    container:
      "border-amber-500/40 bg-amber-500/5 text-amber-900 dark:text-amber-200",
    icon: AlertTriangle,
  },
  danger: {
    container: "border-red-500/40 bg-red-500/5 text-red-900 dark:text-red-200",
    icon: OctagonAlert,
  },
};

/** Callout box for notes, tips, and warnings inside MDX. */
export function Callout({
  type = "tip",
  title,
  children,
  className,
}: {
  type?: CalloutType;
  title?: string;
  children?: ReactNode;
  className?: string;
}) {
  const styles = calloutStyles[type] ?? calloutStyles.tip;
  const Icon = styles.icon;

  return (
    <div
      role="note"
      className={cn(
        "my-6 rounded-lg border border-s-2 px-4 py-3 text-sm",
        styles.container,
        className,
      )}
    >
      <div className="flex gap-2.5">
        <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <div className="min-w-0 flex-1 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          {title ? <p className="mb-1 font-medium">{title}</p> : null}
          {children}
        </div>
      </div>
    </div>
  );
}
