import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

import { Callout } from "./callout";
import { isExternalHref } from "./link-utils";
import { MdxPre } from "./mdx-pre";
import { Step, Steps } from "./steps";
import { TypeTable } from "./type-table";

/* -------------------------------------------------------------------------- */
/* Prose element overrides                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Styles for raw HTML elements emitted by MDX.
 *
 * These are intentionally explicit Tailwind classes rather than a typography
 * plugin so the docs keep Fixel's own type rhythm and colour tokens.
 */

function Heading({
  as: Tag,
  className,
  ...props
}: ComponentProps<"h2"> & {
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}) {
  return (
    <Tag
      className={cn(
        "scroll-m-20 font-semibold tracking-tight text-foreground font-heading",
        Tag === "h1" &&
          "mt-8 mb-4 text-3xl chroma-text chroma-text-animate-once",
        Tag === "h2" && "mt-10 mb-3 border-b pb-2 text-2xl",
        Tag === "h3" && "mt-8 mb-2 text-xl",
        Tag === "h4" && "mt-6 mb-2 text-lg",
        Tag === "h5" && "mt-6 mb-2 text-base",
        Tag === "h6" &&
          "mt-4 mb-2 text-sm font-medium tracking-wider text-muted-foreground uppercase",
        className,
      )}
      {...props}
    />
  );
}

const baseComponents: MDXComponents = {
  h1: (props) => <Heading as="h1" {...props} />,
  h2: (props) => <Heading as="h2" {...props} />,
  h3: (props) => <Heading as="h3" {...props} />,
  h4: (props) => <Heading as="h4" {...props} />,
  h5: (props) => <Heading as="h5" {...props} />,
  h6: (props) => <Heading as="h6" {...props} />,

  p: ({ className, ...props }) => (
    <p
      className={cn("my-4 leading-7 text-muted-foreground", className)}
      {...props}
    />
  ),

  // Internal links go through `next/link` (client-side navigation);
  // absolute/protocol-relative URLs keep the plain anchor.
  a: ({ className, href, ...props }) => {
    const classes = cn(
      "font-medium text-my-secondary underline transition-colors hover:text-my-secondary/70",
      className,
    );

    if (href && !isExternalHref(href)) {
      return <Link href={href} className={classes} {...props} />;
    }

    return <a {...props} href={href} className={classes} />;
  },

  ul: ({ className, ...props }) => (
    <ul
      className={cn(
        "my-4 ms-6 list-disc space-y-2 text-muted-foreground",
        className,
      )}
      {...props}
    />
  ),

  ol: ({ className, ...props }) => (
    <ol
      className={cn(
        "my-4 ms-6 list-decimal space-y-2 text-muted-foreground",
        className,
      )}
      {...props}
    />
  ),

  li: ({ className, ...props }) => (
    <li className={cn("leading-7 [&>p]:my-0", className)} {...props} />
  ),

  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "my-6 border-s-2 border-border ps-4 text-muted-foreground italic",
        className,
      )}
      {...props}
    />
  ),

  hr: ({ className, ...props }) => (
    <hr className={cn("my-8 border-1 border-primary/10", className)} {...props} />
  ),

  strong: ({ className, ...props }) => (
    <strong
      className={cn("font-semibold text-foreground", className)}
      {...props}
    />
  ),

  // Tables — remark-gfm
  table: ({ className, ...props }) => (
    <div
      role="region"
      aria-label="Scrollable table"
      tabIndex={0}
      className={cn(
        "my-7 block w-full min-w-0 max-w-full",
        "overflow-x-auto overflow-y-hidden overscroll-x-contain",
        "rounded-xl border border-my-primary/70",
        "[-webkit-overflow-scrolling:touch]",
        "focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring/50",
        "focus-visible:ring-inset",
      )}
    >
      <table
        {...props}
        className={cn(
          "w-max min-w-full border-collapse text-start text-sm bg-my-primary/70",
          className,
        )}
      />
    </div>
  ),

  thead: ({ className, ...props }) => (
    <thead {...props} className={cn("bg-my-primary/70", className)} />
  ),

  tbody: ({ className, ...props }) => (
    <tbody
      {...props}
      className={cn("[&_tr:last-child>td]:border-b-0", className)}
    />
  ),

  th: ({ className, ...props }) => (
    <th
      {...props}
      className={cn(
        "whitespace-nowrap",
        "border-b border-border/70 px-4 py-3",
        "text-start font-semibold text-foreground",
        className,
      )}
    />
  ),

  td: ({ className, ...props }) => (
    <td
      {...props}
      className={cn(
        "border-b border-border/60 px-4 py-3",
        "align-top text-muted-foreground",
        "[overflow-wrap:anywhere]",
        className,
      )}
    />
  ),

  tr: ({ className, ...props }) => (
    <tr
      {...props}
      className={cn(
        "transition-colors",
        "even:bg-muted/20 hover:bg-muted/30",
        "[&:last-child>td]:border-b-0",
        "motion-reduce:transition-none",
        className,
      )}
    />
  ),

  // Inline code gets the pill treatment. A fenced block's <code> carries a
  // `language-…` class and lives inside `CodeBlock`, where the pill would be
  // wrong, so it keeps only the font.
  code: ({ className, ...props }) =>
    /(^|\s)language-/.test(className ?? "") ? (
      <code {...props} className={cn("font-mono", className)} />
    ) : (
      <code
        {...props}
        className={cn(
          "rounded bg-my-primary/70 dark:bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground",
          className,
        )}
      />
    ),

  // Fenced code is intercepted by `MdxPre`, which extracts the raw source
  // and hands it to the server-rendered Shiki `CodeBlock`.
  pre: (props: ComponentProps<"pre">) => <MdxPre {...props} />,

  // Native images keep Markdown's standard syntax and arbitrary dimensions.
  img: ({ className, alt, loading, decoding, ...props }) => (
    // biome-ignore lint/performance/noImgElement: Markdown images do not necessarily include dimensions required by next/image.
    <img
      {...props}
      alt={alt ?? ""}
      loading={loading ?? "lazy"}
      decoding={decoding ?? "async"}
      className={cn(
        "my-7 block h-auto max-w-full rounded-xl border border-border/40 ring-4 ring-my-primary/70",
        className,
      )}
    />
  ),

  // Shared authoring blocks available in every MDX file.
  Steps,
  Step,
  Callout,
  TypeTable,
};

/**
 * The shared MDX component map.
 *
 * This file must not import feature-specific blocks (component previews,
 * easing playgrounds). Those are supplied at the feature boundary via the
 * `components` prop, which keeps the shared layer free of feature
 * dependencies.
 */
export function getBaseMdxComponents(overrides?: MDXComponents): MDXComponents {
  return { ...baseComponents, ...overrides };
}
