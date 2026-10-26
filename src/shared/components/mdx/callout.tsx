// // import { AlertTriangle, Info, Lightbulb, OctagonAlert } from "lucide-react";
// // import type { ComponentType, ReactNode } from "react";

// // import { cn } from "@/lib/utils";

// // export type CalloutType = "info" | "tip" | "warning" | "danger";

// // const calloutStyles: Record<
// //   CalloutType,
// //   {
// //     container: string;
// //     icon: ComponentType<{ className?: string }>;
// //   }
// // > = {
// //   info: {
// //     container: "border-sky-500/30 bg-sky-500/5 text-sky-900 dark:text-sky-200",
// //     icon: Info,
// //   },
// //   tip: {
// //     // `tip` doubles as the generic callout in the docs voice.
// //     container:
// //       "border-emerald-500/30 bg-emerald-500/5 text-emerald-900 dark:text-emerald-200",
// //     icon: Lightbulb,
// //   },
// //   warning: {
// //     container:
// //       "border-amber-500/40 bg-amber-500/5 text-amber-900 dark:text-amber-200",
// //     icon: AlertTriangle,
// //   },
// //   danger: {
// //     container: "border-red-500/40 bg-red-500/5 text-red-900 dark:text-red-200",
// //     icon: OctagonAlert,
// //   },
// // };

// // /** Callout box for notes, tips, and warnings inside MDX. */
// // export function Callout({
// //   type = "tip",
// //   title,
// //   children,
// //   className,
// // }: {
// //   type?: CalloutType;
// //   title?: string;
// //   children?: ReactNode;
// //   className?: string;
// // }) {
// //   const styles = calloutStyles[type] ?? calloutStyles.tip;
// //   const Icon = styles.icon;

// //   return (
// //     <div
// //       role="note"
// //       className={cn(
// //         "my-6 rounded-lg border border-s-2 px-4 py-3 text-sm",
// //         styles.container,
// //         className,
// //       )}
// //     >
// //       <div className="flex gap-2.5">
// //         <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
// //         <div className="min-w-0 flex-1 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
// //           {title ? <p className="mb-1 font-medium">{title}</p> : null}
// //           {children}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import {
//   AlertTriangle,
//   CheckCircle2,
//   Info,
//   Lightbulb,
//   OctagonAlert,
//   type LucideIcon,
// } from "lucide-react";
// import type { ReactNode } from "react";

// import { cn } from "@/lib/utils";

// export type CalloutType =
//   | "info"
//   | "tip"
//   | "idea"
//   | "warning"
//   | "warn"
//   | "danger"
//   | "error"
//   | "success";

// type CalloutStyle = {
//   container: string;
//   icon: LucideIcon;
//   iconClassName: string;
// };

// const calloutStyles: Record<CalloutType, CalloutStyle> = {
//   info: {
//     container: "border-sky-500/20 bg-sky-500/5",
//     icon: Info,
//     iconClassName: "text-sky-600 dark:text-sky-400",
//   },

//   tip: {
//     container: "border-emerald-500/20 bg-emerald-500/5",
//     icon: Lightbulb,
//     iconClassName: "text-emerald-600 dark:text-emerald-400",
//   },

//   idea: {
//     container: "border-emerald-500/20 bg-emerald-500/5",
//     icon: Lightbulb,
//     iconClassName: "text-emerald-600 dark:text-emerald-400",
//   },

//   warning: {
//     container: "border-amber-500/25 bg-amber-500/5",
//     icon: AlertTriangle,
//     iconClassName: "text-amber-600 dark:text-amber-400",
//   },

//   warn: {
//     container: "border-amber-500/25 bg-amber-500/5",
//     icon: AlertTriangle,
//     iconClassName: "text-amber-600 dark:text-amber-400",
//   },

//   danger: {
//     container: "border-red-500/20 bg-red-500/5",
//     icon: OctagonAlert,
//     iconClassName: "text-red-600 dark:text-red-400",
//   },

//   error: {
//     container: "border-red-500/20 bg-red-500/5",
//     icon: OctagonAlert,
//     iconClassName: "text-red-600 dark:text-red-400",
//   },

//   success: {
//     container: "border-emerald-500/20 bg-emerald-500/5",
//     icon: CheckCircle2,
//     iconClassName: "text-emerald-600 dark:text-emerald-400",
//   },
// };

// type CalloutProps = {
//   type?: CalloutType;
//   title?: string;
//   children?: ReactNode;
//   className?: string;
// };

// /**
//  * Fumadocs-inspired callout for MDX documentation.
//  */
// export function Callout({
//   type = "tip",
//   title,
//   children,
//   className,
// }: CalloutProps) {
//   const styles = calloutStyles[type] ?? calloutStyles.tip;
//   const Icon = styles.icon;

//   return (
//     <div
//       role="note"
//       data-slot="callout"
//       data-callout-type={type}
//       className={cn(
//         "my-6 grid min-w-0",
//         "grid-cols-[auto_minmax(0,1fr)] items-start gap-3",
//         "rounded-xl border px-4 py-3.5",
//         "text-sm",
//         styles.container,
//         className,
//       )}
//     >
//       <Icon
//         aria-hidden="true"
//         className={cn(
//           "mt-0.5 size-4 shrink-0",
//           styles.iconClassName,
//         )}
//       />

//       <div
//         className={cn(
//           "min-w-0",
//           "[&>p:first-child]:mt-0",
//           "[&>p:last-child]:mb-0",
//           "[&>*:last-child]:mb-0",
//         )}
//       >
//         {title ? (
//           <p className="mb-1.5 font-semibold leading-6 text-foreground">
//             {title}
//           </p>
//         ) : null}

//         {children}
//       </div>
//     </div>
//   );
// }

import {
  AlertTriangle,
  Info,
  Lightbulb,
  OctagonAlert,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type CalloutType = "info" | "tip" | "warning" | "danger";

type CalloutStyle = {
  accent: string;
  icon: LucideIcon;
  iconColor: string;
};

const calloutStyles: Record<CalloutType, CalloutStyle> = {
  info: {
    accent: "bg-sky-600/50",
    icon: Info,
    iconColor: "text-sky-600 dark:text-sky-400",
  },

  tip: {
    accent: "bg-emerald-600/50",
    icon: Lightbulb,
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },

  warning: {
    accent: "bg-amber-600/50",
    icon: AlertTriangle,
    iconColor: "text-amber-600 dark:text-amber-400",
  },

  danger: {
    accent: "bg-red-600/50",
    icon: OctagonAlert,
    iconColor: "text-red-600 dark:text-red-400",
  },
};

type CalloutProps = {
  type?: CalloutType;
  title?: string;
  children?: ReactNode;
  className?: string;
};

/** Fumadocs-inspired callout for MDX documentation. */
export function Callout({
  type = "tip",
  title,
  children,
  className,
}: CalloutProps) {
  const styles = calloutStyles[type] ?? calloutStyles.tip;
  const Icon = styles.icon;

  return (
    <div
      role="note"
      data-slot="callout"
      data-callout-type={type}
      className={cn(
        "my-4 flex min-w-0 gap-2",
        "rounded-xl bg-background p-3 ps-1 ring-4 ring-my-primary/70",
        "text-sm text-card-foreground",
        className,
      )}
    >
      {/* Colored accent bar */}
      <div
        aria-hidden="true"
        className={cn("w-0.75 shrink-0 self-stretch rounded-sm", styles.accent)}
      />

      {/* Filled icon */}
      <Icon
        aria-hidden="true"
        className={cn("size-4 shrink-0 -me-0.5 mt-0.5", styles.iconColor)}
      />

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {title ? (
          <p className="my-0! font-medium leading-5 text-card-foreground">
            {title}
          </p>
        ) : null}

        <div
          className={cn(
            "min-w-0 flex-1 text-muted-foreground",
            "[&>p:first-child]:my-0",
            "[&>p:last-child]:my-0",
            "[&>ul]:my-0 [&>ol]:my-0",
            "[&>blockquote]:my-0 [&>pre]:my-0",
            "[&>div[data-slot=codeblock]]:my-0",
            "[&>*:empty]:hidden",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
