"use client";

import { Eye, Layers } from "lucide-react";
import { useInView } from "motion/react";
import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { ComponentAuthor } from "../lib/items";

// -----------------------------------------------------------------------------
// Reusable layout components
// -----------------------------------------------------------------------------

type PageLayoutProps = {
  leftSidebar: ReactNode;
  rightSidebar: ReactNode;
  children: ReactNode;
};

export function PageLayout({
  leftSidebar,
  rightSidebar,
  children,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen">
      {/* Main Grid: 15px gutter, 25px outer margin */}
      <div className="flex flex-col lg:flex-row gap-[15px] px-[25px] pb-10 max-w-[1600px] mx-auto">
        {leftSidebar}
        <main className="flex-1 lg:max-w-[610px] mx-auto w-full mt-[150px]">
          {children}
        </main>
        {rightSidebar}
      </div>
    </div>
  );
}

type NavigationItem = {
  label: string;
  href: string;
  active?: boolean;
};

/**
 * Marks the heading the reader is currently looking at.
 *
 * The sidebar is a plain anchor list, so the active entry is whatever heading
 * last crossed the top of the viewport; the first entry stays active before
 * any heading arrives.
 */
function useActiveAnchor(items: NavigationItem[]): string | undefined {
  const [active, setActive] = useState<string | undefined>(items[0]?.href);
  const key = items.map((item) => item.href).join("|");

  useEffect(() => {
    const hrefs = key.split("|").filter(Boolean);

    function update() {
      let current = hrefs[0];

      for (const href of hrefs) {
        const element = document.getElementById(href.slice(1));
        if (element && element.getBoundingClientRect().top <= 160) {
          current = href;
        }
      }

      setActive(current);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [key]);

  return active;
}

export function TableOfContents({ items }: { items: NavigationItem[] }) {
  const activeHref = useActiveAnchor(items);

  return (
    <aside className="hidden lg:block w-[250px] shrink-0">
      <div className="sticky top-10 flex flex-col gap-6 justify-end h-[calc(100vh-80px)]">
        {/* Replace this placeholder with the real logo when available. */}
        <div className="size-8 bg-neutral-200/70 rounded-md flex items-center justify-center text-xs">
          <Layers size={16} />
        </div>

        <nav aria-label="Table of contents">
          <ul className="flex flex-col gap-3 text-sm text-[#999]">
            {items.map((item) => (
              <li key={`${item.href}-${item.label}`}>
                <a
                  href={item.href}
                  className={
                    item.active || item.href === activeHref
                      ? "text-black hover:text-black/80 transition-colors"
                      : "hover:text-black/80 transition-colors"
                  }
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

type HeroSectionProps = {
  title: string;
  description: string;
  author?: ComponentAuthor | null;
  videoSrc?: string;
  posterSrc?: string;
  actions?: ReactNode;
};

export function HeroSection({
  title,
  description,
  author,
  videoSrc,
  posterSrc,
  actions,
}: HeroSectionProps) {
  const textRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(textRef, {
    once: false,
    amount: 0.5,
  });

  return (
    <section className="relative flex flex-col gap-4 mb-12">
      <div className="flex items-center justify-between gap-4">
        <h1
          ref={textRef}
          className={`leading-[1.15] font-heading text-3xl lg:text-4xl font-medium tracking-tight chroma-text chroma-text-animate ${isInView ? "chroma-text-animate-once" : ""
            }`}
        >
          {title}
        </h1>

        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-[#999] text-sm md:text-base max-w-md">
          {description}
        </p>
        {author ? (
          <p className="text-xs text-muted-foreground">
            by{" "}
            {author.url ? (
              <a
                href={author.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-my-secondary underline-offset-2 hover:underline"
              >
                {author.name}
              </a>
            ) : (
              <span className="font-medium text-my-secondary">{author.name}</span>
            )}
          </p>
        ) : null}
      </div>

      <div className="h-full w-full p-2 rounded-2xl bg-my-primary/70">
        {videoSrc ? (
          <video
            src={videoSrc}
            aria-label="preview"
            muted
            loop
            playsInline
            autoPlay
            className="h-full w-full rounded-lg aspect-video"
          />
        ) : posterSrc ? (
          // biome-ignore lint/performance/noImgElement: component media is a static asset, not an optimizable remote image.
          <img
            src={posterSrc}
            alt=""
            className="h-full w-full rounded-lg aspect-video object-cover"
          />
        ) : null}
      </div>
    </section>
  );
}

type ArticleSectionProps = {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function ArticleSection({
  id,
  title,
  description,
  children,
}: ArticleSectionProps) {
  return (
    <section aria-labelledby={id}>
      <h2 className="text-xl font-medium mb-4 mt-12" id={id}>
        {title}
      </h2>
      <p className="text-[#999] mb-6 leading-relaxed">{description}</p>
      {children}
    </section>
  );
}

// -----------------------------------------------------------------------------
// Reusable right sidebar components
// -----------------------------------------------------------------------------

export function SidebarActions({
  previewHref,
  children,
}: {
  previewHref: string;
  children?: ReactNode;
}) {
  return (
    <div className=" flex flex-col gap-3">
      {children}
      <Button
        asChild
        className="bg-my-secondary text-sm font-medium text-white hover:bg-my-secondary/85 rounded-full h-11"
      >
        <Link href={previewHref} target="_blank" rel="noopener noreferrer">
          <Eye />
          Live Preview
        </Link>
      </Button>
    </div>
  );
}

export function MethodsSidebar({
  publishedAt,
  category,
  tags,
  previewHref,
  actions,
}: {
  publishedAt: string;
  category: string;
  tags: string[];
  previewHref: string;
  actions?: ReactNode;
}) {
  return (
    <aside className="hidden xl:flex w-[250px] shrink-0 flex-col justify-start">
      {/* top (150px) + bottom gap (20px) = fits exactly inside the viewport */}
      <div className="sticky top-[150px] flex flex-col h-[calc(100vh-170px)]">
        <div
          id="Resource-details"
          className="flex justify-between items-center mb-3 shrink-0"
        >
          <span className="text-sm">Resource details</span>
        </div>

        {/* flex-1 + min-h-0: takes all leftover space and can shrink/scroll */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
          <div className="border-b-2 border-primary/15 pb-4 mb-4">
            {/* Resource information date */}
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-muted-foreground">
                Published
              </span>
              <span className="text-[12px] text-muted-foreground font-medium">
                {publishedAt}
              </span>
            </div>
            {/* the type of the resource like UI / Component / block / etc */}
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-muted-foreground">
                Category
              </span>
              <span className="text-[12px] text-muted-foreground font-medium">
                {category}
              </span>
            </div>
          </div>
          {/* component tags */}
          <div>
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-sm bg-muted text-muted-foreground px-1.5 py-0.5 text-[12px] font-archivo font-medium capitalize text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* shrink-0 keeps the buttons from being squeezed */}
        <div className="shrink-0">
          <SidebarActions previewHref={previewHref}>{actions}</SidebarActions>
        </div>
      </div>
    </aside>
  );
}
