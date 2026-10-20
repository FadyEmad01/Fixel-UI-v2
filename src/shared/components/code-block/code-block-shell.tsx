"use client";

import { cn } from "cn";
import {
  type ComponentProps,
  type CSSProperties,
  createContext,
  type HTMLAttributes,
  type ReactNode,
  use,
  useRef,
} from "react";

import { CopyButton, getPreText } from "./copy-button";

export const InCodeTabsContext = createContext(false);

export type CodeBlockProps = {
  /** Pre-highlighted HTML produced on the server by `highlight()`. `null`
   * falls back to plain text (unsupported language). */
  html: string | null;
  /** Raw source, used for the copy button so users always copy clean code. */
  code: string;
  /** Language tag shown in the header when there is no title. */
  label?: string;
} & Omit<HTMLAttributes<HTMLElement>, "title" | "children"> & {
    title?: ReactNode;
    icon?: ReactNode;
    allowCopy?: boolean | "true" | "false";
    viewportClassName?: string;
    "data-line-numbers"?: boolean;
    "data-line-numbers-start"?: number;
  };

export function Pre({ className, ...props }: ComponentProps<"pre">) {
  return (
    <pre
      {...props}
      className={cn("w-max min-w-full focus-visible:outline-none", className)}
    />
  );
}

export function CodeBlockShell({
  html,
  code,
  label,
  title,
  icon,
  allowCopy = true,
  viewportClassName,
  className,
  style,
  ...props
}: CodeBlockProps) {
  const inTabs = use(InCodeTabsContext);
  const areaRef = useRef<HTMLDivElement>(null);
  const copy = allowCopy !== false && allowCopy !== "false";

  // The scrollable code viewport deliberately keeps role="region" + tabIndex=0
  // (WCAG scrollable-region technique) — see the override in biome.json.
  const viewport = (
    <div
      ref={areaRef}
      role="region"
      tabIndex={0}
      data-slot="codeblock-viewport"
      className={cn(
        "max-h-[600px] overscroll-x-none overflow-auto text-[13px] leading-relaxed focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset focus-visible:outline-none",
        viewportClassName,
      )}
      style={
        {
          ...(!title && copy && !inTabs
            ? { "--padding-right": "calc(var(--spacing) * 10)" }
            : {}),
          counterSet: props["data-line-numbers"]
            ? `line ${Number(props["data-line-numbers-start"] ?? 1) - 1}`
            : undefined,
        } as CSSProperties
      }
    >
      {html ? (
        // Highlighted on the server. Safe: Shiki escapes all source text.
        <div
          className="[&_pre]:m-0 [&_pre]:w-max [&_pre]:min-w-full [&_pre]:bg-transparent [&_pre]:p-4 [&_pre]:text-[13px] [&_pre]:leading-6"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: server-generated, escaped by Shiki
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="m-0 w-max min-w-full bg-transparent p-4 text-[13px] leading-6">
          <code className="font-mono">{code}</code>
        </pre>
      )}
    </div>
  );

  if (inTabs) {
    return (
      <div
        {...props}
        dir="ltr"
        tabIndex={-1}
        className={cn("shiki not-prose text-sm", className)}
        style={style}
      >
        {viewport}
      </div>
    );
  }

  return (
    <figure
      {...props}
      dir="ltr"
      tabIndex={-1}
      data-slot="codeblock"
      className={cn(
        "shiki group not-prose relative my-6 overflow-hidden rounded-xl bg-accent text-sm",
        className,
      )}
      style={style}
    >
      {title ? (
        <div className="flex h-8 items-center gap-2 pr-2.5 pl-4 text-muted-foreground bg-my-primary/70">
          {icon && <div className="[&_svg]:size-3.5">{icon}</div>}
          <figcaption className="flex-1 truncate">{title}</figcaption>
          {copy && <CopyButton getText={() => getPreText(areaRef.current)} />}
        </div>
      ) : (
        copy && (
          <div className="absolute top-3 right-3 z-2">
            <CopyButton getText={() => getPreText(areaRef.current)} />
          </div>
        )
      )}
      <div className={cn("p-1 bg-my-primary/70", title && "pt-0")}>
        <div className="overflow-hidden rounded-lg bg-background">
          {viewport}
        </div>
      </div>
    </figure>
  );
}
