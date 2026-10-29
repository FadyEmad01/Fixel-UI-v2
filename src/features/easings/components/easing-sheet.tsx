"use client";

import { ArrowLeft, ArrowRight, Eye, X } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlockShell } from "@/shared/components/code-block";
import { CopyButton } from "@/shared/components/code-block/copy-button";
import {
  cssEaseCode,
  cubicBezierString,
  gsapEaseCode,
  motionEaseCode,
  rawEaseCode,
} from "../lib/codegen";
import type { EasingSheetItem } from "../lib/types";
import { EasingCurveSvg } from "./easing-curve-svg";
import { CodeBlock, CodeBlockContent, CodeBlockCopyButton, CodeBlockLine } from "@/components/ui/code-block";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";

const DOT_WINDOW = 7;

export function EasingSheet({
  slug,
  selectedItem,
  items,
  onClose,
  onNavigate,
}: {
  slug: string | null;
  selectedItem: EasingSheetItem | null;
  items: EasingSheetItem[];
  onClose: () => void;
  onNavigate: (slug: string) => void;
}) {
  const [selectedSlug, setSelectedSlug] = React.useState<string | null>(slug);
  const [lastSlugProp, setLastSlugProp] = React.useState(slug);
  const [activeTab, setActiveTab] = React.useState("raw");

  if (slug !== lastSlugProp) {
    setLastSlugProp(slug);
    if (slug) setSelectedSlug(slug);
  }

  const availableItems = React.useMemo(() => {
    const seen = new Set<string>();
    const result: EasingSheetItem[] = [];

    for (const item of items) {
      if (seen.has(item.slug)) continue;
      seen.add(item.slug);
      result.push(item);
    }

    if (selectedItem && !seen.has(selectedItem.slug)) {
      result.unshift(selectedItem);
    }

    return result;
  }, [items, selectedItem]);

  const activeIndex = availableItems.findIndex(
    (item) => item.slug === selectedSlug,
  );
  const activePosition = activeIndex < 0 ? 0 : activeIndex;
  const easing =
    availableItems.find((item) => item.slug === selectedSlug) ?? selectedItem;

  const navigate = React.useCallback(
    (direction: -1 | 1) => {
      const count = availableItems.length;
      if (count < 2) return;

      const index = Math.max(
        0,
        availableItems.findIndex((item) => item.slug === selectedSlug),
      );
      const next = availableItems[(index + direction + count) % count];
      if (!next) return;

      setSelectedSlug(next.slug);
      onNavigate(next.slug);
    },
    [availableItems, selectedSlug, onNavigate],
  );

  React.useEffect(() => {
    if (!slug || availableItems.length < 2) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      ) {
        return;
      }

      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

      const target = event.target;
      if (target instanceof HTMLElement) {
        if (target.isContentEditable) return;
        if (
          target.closest(
            'input, textarea, select, [contenteditable]:not([contenteditable="false"])',
          )
        ) {
          return;
        }
      }

      event.preventDefault();
      navigate(event.key === "ArrowLeft" ? -1 : 1);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slug, availableItems.length, navigate]);

  const dotStart = Math.max(
    0,
    Math.min(
      activePosition - Math.floor(DOT_WINDOW / 2),
      availableItems.length - DOT_WINDOW,
    ),
  );
  const dotItems = availableItems.slice(dotStart, dotStart + DOT_WINDOW);
  const positionLabel = availableItems.length
    ? `Easing ${activePosition + 1} of ${availableItems.length}`
    : "Easing";

  const cssCode = easing ? cssEaseCode(easing.points) : "";
  const motionCode = easing ? motionEaseCode(easing.points) : "";
  const gsapCode = easing ? gsapEaseCode(easing.points) : "";
  const rawCode = easing ? rawEaseCode(easing.points) : "";

  const cssLines = useHighlightedCode(cssCode, "css");
  const motionLines = useHighlightedCode(motionCode, "javascript");
  const gsapLines = useHighlightedCode(gsapCode, "javascript");
  const rawLines = useHighlightedCode(rawCode, "css");

  return (
    <Sheet
      open={Boolean(slug)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent
        side="right"
        showCloseButton={false}
        className={[
          "data-[side=right]:inset-y-3 data-[side=right]:right-3",
          "data-[side=right]:h-auto",
          "data-[side=right]:w-[calc(100%_-_1.5rem)]",
          "data-[side=right]:max-w-[400px] data-[side=right]:sm:max-w-[400px]",
          "data-[side=right]:border-0",
          "flex flex-col gap-0 overflow-hidden rounded-[26px]",
          "bg-my-primary/90 p-3",
          "backdrop-blur-[20px] backdrop-saturate-150",
        ].join(" ")}
      >
        <SheetClose asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close easing"
            title="Close (Esc)"
            className="absolute top-5.5 right-6 z-20 size-9 rounded-full border-none bg-my-primary text-foreground opacity-100 backdrop-blur-2xl transition hover:bg-my-primary/70 hover:text-[#211f1c] focus-visible:ring-1 focus-visible:ring-my-bg"
          >
            <X aria-hidden="true" />
          </Button>
        </SheetClose>

        <div className="flex min-h-0 flex-1 flex-col">
          {easing ? (
            <div className="flex min-h-0 flex-1 flex-col gap-4">
              <div className="relative aspect-video max-h-[38dvh] w-full shrink-0 overflow-hidden rounded-[20px] bg-my-bg p-7">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:16px_16px]"
                />
                <div className="relative flex size-full items-center justify-center">
                  <EasingCurveSvg
                    points={easing.points}
                    animate={true}
                    showGrid
                    width={140}
                    height={140}
                  />
                </div>
              </div>

              <section
                aria-label="Easing details"
                className="scroll-fade scroll-fade-20 scrollbar-none no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain focus-visible:ring-2 focus-visible:ring-[#211f1c]/20 focus-visible:ring-inset focus-visible:outline-none"
              >
                <div className="flex flex-col gap-4 px-1.5 pb-2">
                  <SheetHeader className="space-y-1.5 p-0 text-left">
                    <SheetTitle className="font-heading text-[26px] leading-[1.1] font-semibold tracking-[-0.02em] text-[#211f1c] chroma-text chroma-text-animate-once">
                      {easing.name}
                    </SheetTitle>
                  </SheetHeader>

                  <p className="text-[13px] leading-[1.7] text-[#45423d]">
                    {easing.description}
                  </p>

                  <div className="flex flex-col gap-2">
                    <Tabs
                      defaultValue="raw"
                      className="w-full"
                      onValueChange={(value) => {
                        setActiveTab(value);
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <TabsList
                          variant="line"
                          className="h-auto w-auto justify-start gap-2.5 bg-transparent p-0"
                        >
                          <TabsTrigger
                            value="raw"
                            className="h-auto rounded-none px-0 py-1 text-sm font-normal text-muted-foreground after:hidden data-[state=active]:text-black data-[state=active]:underline underline-offset-2 dark:data-[state=active]:text-foreground"
                          >
                            Raw
                          </TabsTrigger>
                          <TabsTrigger
                            value="css"
                            className="h-auto rounded-none px-0 py-1 text-sm font-normal text-muted-foreground after:hidden data-[state=active]:text-black data-[state=active]:underline underline-offset-2 dark:data-[state=active]:text-foreground"
                          >
                            CSS
                          </TabsTrigger>
                          <TabsTrigger
                            value="motion"
                            className="h-auto rounded-none px-0 py-1 text-sm font-normal text-muted-foreground after:hidden data-[state=active]:text-black data-[state=active]:underline underline-offset-2 dark:data-[state=active]:text-foreground"
                          >
                            Motion
                          </TabsTrigger>
                          <TabsTrigger
                            value="gsap"
                            className="h-auto rounded-none px-0 py-1 text-sm font-normal text-muted-foreground after:hidden data-[state=active]:text-black data-[state=active]:underline underline-offset-2 dark:data-[state=active]:text-foreground"
                          >
                            GSAP
                          </TabsTrigger>
                        </TabsList>
                        <div className="flex items-center">
                          <CodeBlockCopyButton
                            value={
                              activeTab === "raw"
                                ? rawCode
                                : activeTab === "css"
                                  ? cssCode
                                  : activeTab === "motion"
                                    ? motionCode
                                    : gsapCode
                            }
                          />
                        </div>
                      </div>
                      <TabsContent value="raw" className="relative mt-0">
                        <CodeBlock className="rounded-lg bg-muted border-none">
                          <CodeBlockContent wrap className="rounded-lg p-3">
                            {rawLines.map((line, index) => (
                              <CodeBlockLine key={index}>{line}</CodeBlockLine>
                            ))}
                          </CodeBlockContent>
                        </CodeBlock>
                      </TabsContent>
                      <TabsContent value="css" className="relative mt-0">
                        <CodeBlock className="rounded-lg bg-muted border-none">
                          <CodeBlockContent wrap className="rounded-lg p-3">
                            {cssLines.map((line, index) => (
                              <CodeBlockLine key={index}>{line}</CodeBlockLine>
                            ))}
                          </CodeBlockContent>
                        </CodeBlock>
                      </TabsContent>
                      <TabsContent value="motion" className="relative mt-0">
                        <CodeBlock className="rounded-lg bg-muted border-none">
                          <CodeBlockContent wrap className="rounded-lg p-3">
                            {motionLines.map((line, index) => (
                              <CodeBlockLine key={index}>{line}</CodeBlockLine>
                            ))}
                          </CodeBlockContent>
                        </CodeBlock>
                      </TabsContent>
                      <TabsContent value="gsap" className="relative mt-0">
                        <CodeBlock className="rounded-lg bg-muted border-none">
                          <CodeBlockContent wrap className="rounded-lg p-3">
                            {gsapLines.map((line, index) => (
                              <CodeBlockLine key={index}>{line}</CodeBlockLine>
                            ))}
                          </CodeBlockContent>
                        </CodeBlock>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </section>

              <div className="shrink-0 px-1">
                <Button
                  asChild
                  className="h-11 w-full rounded-full bg-my-secondary text-sm font-medium text-my-primary hover:bg-my-secondary/85"
                >
                  <Link
                    href={easing.viewerHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View full
                    <Eye aria-hidden="true" data-icon="inline-end" />
                  </Link>
                </Button>
              </div>
            </div>
          ) : null}

          <p className="sr-only" aria-live="polite" aria-atomic="true">
            {positionLabel}
            {easing ? `: ${easing.name}` : ""}
          </p>

          <nav
            aria-label="Easing navigation"
            className="flex shrink-0 items-center justify-between gap-2 px-0.5 pt-3 pb-0.5"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              disabled={availableItems.length < 2}
              aria-label="Previous easing"
              title="Previous easing (←)"
              className="size-10 shrink-0 rounded-full bg-my-primary px-8 text-[#211f1c] shadow-sm hover:bg-white/85 hover:text-[#211f1c] disabled:opacity-40"
            >
              <ArrowLeft aria-hidden="true" />
            </Button>

            {dotItems.length > 0 ? (
              <div className="flex min-w-0 items-center justify-center">
                {dotItems.map((item, offset) => {
                  const index = dotStart + offset;
                  const active = index === activePosition;

                  return (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={() => {
                        setSelectedSlug(item.slug);
                        onNavigate(item.slug);
                      }}
                      aria-label={`Show easing ${index + 1}: ${item.name}`}
                      aria-current={active ? "true" : undefined}
                      className="group flex size-5 shrink-0 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-[#211f1c]/30 focus-visible:outline-none"
                    >
                      <span
                        className={[
                          "size-1.5 rounded-full transition-all duration-200",
                          active
                            ? "scale-125 bg-[#211f1c]"
                            : "bg-[#211f1c]/20 group-hover:bg-[#211f1c]/45",
                        ].join(" ")}
                      />
                    </button>
                  );
                })}
              </div>
            ) : null}

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => navigate(1)}
              disabled={availableItems.length < 2}
              aria-label="Next easing"
              title="Next easing (→)"
              className="size-10 shrink-0 rounded-full bg-[#211f1c] px-8 text-white shadow-sm hover:bg-[#211f1c]/85 hover:text-white disabled:opacity-40"
            >
              <ArrowRight aria-hidden="true" />
            </Button>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}