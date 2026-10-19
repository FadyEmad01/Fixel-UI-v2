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

export type CodeBlockProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
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
      className={cn(
        "w-max min-w-full *:flex *:flex-col focus-visible:outline-none",
        className,
      )}
    />
  );
}

export function CodeBlock({
  title,
  icon,
  allowCopy = true,
  viewportClassName,
  className,
  style,
  children,
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
        "fd-scroll-container max-h-[600px] overscroll-x-none overflow-auto py-3.5 text-[13px] leading-relaxed focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset focus-visible:outline-none",
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
      {children}
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
        <div className="flex h-10 items-center gap-2 pr-2.5 pl-4 text-muted-foreground">
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
      <div className={cn("p-1", title && "pt-0")}>
        <div className="overflow-hidden rounded-lg bg-background">
          {viewport}
        </div>
      </div>
    </figure>
  );
}
