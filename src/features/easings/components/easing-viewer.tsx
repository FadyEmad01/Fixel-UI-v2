"use client";

import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Search,
  SearchX,
} from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import Link from "next/link";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockLine,
} from "@/components/ui/code-block";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import { cn } from "@/lib/utils";
import type { Easing } from "../lib/types";
import {
  cssEaseCode,
  cubicBezierString,
  gsapEaseCode,
  motionEaseCode,
  rawEaseCode,
} from "../lib/codegen";
import { EasingCurveSvg } from "./easing-curve-svg";

const DOT_WINDOW = 7;

type Points = [number, number, number, number];
type EaseFilter = "all" | "in" | "out" | "in-out";

const navLinks = [
  { title: "Home", href: "/" },
  { title: "Projects", href: "/#project" },
  { title: "Showcase", href: "/showcase" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
];

function inferDirection(points: Points): EaseFilter {
  const [x1, y1, x2, y2] = points;
  if (x1 === y1 && x2 === y2) return "all";
  if (y1 >= x1 && y2 >= x2) return "out";
  if (y1 <= x1 && y2 <= x2) return "in";
  return "in-out";
}

function MiniCurve({ points, active }: { points: Points; active: boolean }) {
  const [x1, y1, x2, y2] = points;
  const x = (value: number) => 3 + value * 26;
  const y = (value: number) => 21 - value * 18;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 24"
      className={cn(
        "h-6 w-8 shrink-0 overflow-visible",
        active ? "text-my-secondary" : "text-muted-foreground/60",
      )}
      fill="none"
    >
      <path
        d={`M3 21 C ${x(x1)} ${y(y1)}, ${x(x2)} ${y(y2)}, 29 3`}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PreviewMenuIcon({
  open,
  points,
  duration,
}: {
  open: boolean;
  points: Points;
  duration: number;
}) {
  const transition = {
    type: "tween",
    duration: Math.max(duration * 0.45, 0),
    ease: points,
  } as const;

  return (
    <svg
      aria-hidden="true"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <motion.line
        x1="4"
        x2="20"
        y1="9"
        y2="9"
        initial={false}
        animate={{ rotate: open ? 45 : 0, y: open ? 3 : 0 }}
        transition={transition}
        style={{ transformOrigin: "12px 12px" }}
      />
      <motion.line
        x1="4"
        x2="20"
        y1="15"
        y2="15"
        initial={false}
        animate={{ rotate: open ? -45 : 0, y: open ? -3 : 0 }}
        transition={transition}
        style={{ transformOrigin: "12px 12px" }}
      />
    </svg>
  );
}

function NavbarPreview({
  points,
  duration,
  replayKey,
  isOpen,
  onOpen,
}: {
  points: Points;
  duration: number;
  replayKey: number;
  isOpen: boolean;
  onOpen: () => void;
}) {
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState({ width: 520, height: 320 });
  const [activeLink, setActiveLink] = React.useState("Home");

  React.useEffect(() => {
    const node = canvasRef.current;
    if (!node) return;

    const update = () => {
      const rect = node.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const openWidth = Math.max(160, Math.min(480, size.width - 32));
  const openHeight = Math.max(180, size.height - 64);
  const scale = duration / 0.75;

  const menuVariants = React.useMemo<Variants>(
    () => ({
      open: {
        width: openWidth,
        height: openHeight,
        y: -16,
        transition: { duration, type: "tween", ease: points },
      },
      closed: {
        width: 160,
        height: 40,
        y: 0,
      },
    }),
    [duration, openHeight, openWidth, points],
  );

  const contentVariants = React.useMemo<Variants>(
    () => ({
      open: {
        opacity: 1,
        transition: { duration: 0.3 * scale, delay: 0.3 * scale },
      },
      closed: { opacity: 0, transition: { duration: 0.2 * scale } },
    }),
    [scale],
  );

  const linkVariants = React.useMemo<Variants>(
    () => ({
      open: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
          delay: (0.4 + i * 0.1) * scale,
          duration: 0.5 * scale,
          ease: points,
          type: "tween",
        },
      }),
      closed: {
        opacity: 0,
        y: 20,
        transition: { duration: 0.3 * scale, ease: points, type: "tween" },
      },
    }),
    [points, scale],
  );

  return (
    <div
      ref={canvasRef}
      className="relative h-full min-h-[320px] w-full overflow-hidden rounded-md bg-[#e8e8e4] text-neutral-900"
    >
      {/* <div aria-hidden="true" className="pointer-events-none absolute inset-0 p-5">
        <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
          <span>Fady Emad</span>
          <span>Portfolio © 2026</span>
        </div>
        <div className="mt-9">
          <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
            Independent developer
          </p>
          <h3 className="mt-3 text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-neutral-900">
            Creative
            <br />
            developer.
          </h3>
          <p className="mt-4 max-w-[190px] text-xs leading-relaxed text-neutral-500">
            Building expressive interfaces with motion, detail, and a little
            personality.
          </p>
        </div>
        <div className="absolute right-6 top-16 flex size-24 items-center justify-center rounded-full border border-neutral-400/50">
          <div className="size-3 rounded-full bg-orange-500" />
        </div>
        <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between border-t border-neutral-400/30 pt-3 text-[10px] uppercase tracking-[0.18em] text-neutral-500">
          <span>Selected work</span>
          <span>2026</span>
        </div>
      </div> */}

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-black"
        initial={false}
        animate={{ opacity: isOpen ? 0.16 : 0 }}
        transition={{ duration: Math.max(duration * 0.4, 0) }}
      />

      <motion.div
        key={replayKey}
        variants={menuVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        style={{ x: "-50%", maxWidth: "calc(100% - 32px)" }}
        className="absolute bottom-5 left-1/2 z-10 flex flex-col overflow-hidden rounded-lg border border-black/5 bg-neutral-200/80 py-1.5 pl-3 pr-2 text-sm font-medium text-black shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl"
      >
        <div className="flex h-7 w-full shrink-0 items-center justify-between gap-x-4">
          <span className="cursor-default whitespace-nowrap">
            Menu
          </span>
          <button
            type="button"
            onClick={onOpen}
            disabled={isOpen}
            aria-expanded={isOpen}
            aria-controls="navbar-preview-links"
            aria-label={isOpen ? "Preview menu is open" : "Open preview menu"}
            className="flex size-7 cursor-pointer items-center justify-center rounded-md outline-none transition-colors hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-orange-500 disabled:cursor-default disabled:hover:bg-transparent"
          >
            <PreviewMenuIcon open={isOpen} points={points} duration={duration} />
          </button>
        </div>

        <motion.div
          variants={contentVariants}
          aria-hidden={!isOpen}
          style={{ pointerEvents: isOpen ? "auto" : "none" }}
          className="flex min-h-0 w-full flex-1 flex-col"
        >
          <div
            id="navbar-preview-links"
            className="mt-4 flex min-h-0 flex-1 flex-col overflow-y-auto px-2 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {/* <div className="flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.div key={link.title} custom={i} variants={linkVariants}>
                  <a
                    href={link.href}
                    tabIndex={isOpen ? 0 : -1}
                    onClick={(event) => {
                      event.preventDefault();
                      setActiveLink(link.title);
                      onToggle();
                    }}
                    className="group flex items-center justify-between text-[clamp(1.35rem,4vh,2rem)] font-normal leading-none tracking-[-0.04em] text-black transition-colors duration-300 hover:text-black/50"
                  >
                    <span>{link.title}</span>
                    <span className="text-[10px] font-medium tracking-normal text-neutral-500">
                      {activeLink === link.title}
                    </span>
                  </a>
                </motion.div>
              ))}
            </div> */}

            {/* <motion.div
              variants={linkVariants}
              custom={navLinks.length}
              className="mt-auto flex shrink-0 flex-wrap items-end justify-between gap-3 border-t border-black/10 pt-3"
            >
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-[0.18em] text-black/50">
                  Get in touch
                </span>
                <a
                  href="mailto:fadyemad933@gmail.com"
                  tabIndex={isOpen ? 0 : -1}
                  className="text-xs hover:text-black/50"
                >
                  fadyemad933@gmail.com
                </a>
              </div>
              <div className="flex gap-3 text-xs">
                <a
                  href="https://www.linkedin.com/in/fady-emad-sabry"
                  target="_blank"
                  rel="noreferrer"
                  tabIndex={isOpen ? 0 : -1}
                  className="hover:text-black/50"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com/FadyEmad01"
                  target="_blank"
                  rel="noreferrer"
                  tabIndex={isOpen ? 0 : -1}
                  className="hover:text-black/50"
                >
                  GitHub
                </a>
              </div>
            </motion.div> */}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function EasingViewer({
  easing,
  items,
}: {
  easing: Easing;
  items: Easing[];
}) {
  const [selectedSlug, setSelectedSlug] = React.useState(easing.slug);
  const [lastSlug, setLastSlug] = React.useState(easing.slug);
  const [duration, setDuration] = React.useState(1000);
  const [tempDuration, setTempDuration] = React.useState(1000);
  const [durationDraft, setDurationDraft] = React.useState("1000");
  const [filter, setFilter] = React.useState<EaseFilter>("all");
  const [query, setQuery] = React.useState("");
  const [hoveredSlug, setHoveredSlug] = React.useState<string | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [replayKey, setReplayKey] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState("css");
  const reducedMotion = useReducedMotion();

  if (easing.slug !== lastSlug) {
    setLastSlug(easing.slug);
    setSelectedSlug(easing.slug);
  }

  const currentEasing =
    items.find((item) => item.slug === selectedSlug) ?? easing;
  const currentIndex = items.findIndex((item) => item.slug === selectedSlug);
  const activePosition = currentIndex < 0 ? 0 : currentIndex;
  const effectiveDuration = reducedMotion ? 0 : duration / 1000;
  const hoveredEasing = items.find((item) => item.slug === hoveredSlug);
  const graphEasing = hoveredEasing ?? currentEasing;
  const phase = isOpen ? "open" : "closed";

  const selectEasing = React.useCallback((slug: string) => {
    setSelectedSlug(slug);
    setHoveredSlug(null);
    window.history.replaceState(null, "", `/easing/${slug}`);
  }, []);

  const navigateBy = React.useCallback(
    (direction: -1 | 1) => {
      if (items.length < 2) return;
      const idx = Math.max(
        0,
        items.findIndex((item) => item.slug === selectedSlug),
      );
      const next = items[(idx + direction + items.length) % items.length];
      if (next) selectEasing(next.slug);
    },
    [items, selectEasing, selectedSlug],
  );

  const handleReplay = React.useCallback(() => {
    setIsOpen(true);
    setReplayKey((key) => key + 1);
  }, []);

  React.useEffect(() => {
    handleReplay();
  }, [currentEasing.slug, duration, handleReplay]);

  React.useEffect(() => {
    if (items.length < 2) return;

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

      if (event.key.toLowerCase() === "r") {
        event.preventDefault();
        handleReplay();
        return;
      }

      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      if (
        target instanceof HTMLElement &&
        target.closest('[role="tablist"], [role="slider"]')
      ) {
        return;
      }

      event.preventDefault();
      navigateBy(event.key === "ArrowLeft" ? -1 : 1);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleReplay, items.length, navigateBy]);

  const commitDuration = React.useCallback((value: number) => {
    if (!Number.isFinite(value)) return;
    const next = Math.min(5000, Math.max(0, Math.round(value)));
    setDuration(next);
    setTempDuration(next);
    setDurationDraft(String(next));
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesQuery = `${item.name} ${item.slug}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesFilter =
      filter === "all" || inferDirection(item.points) === filter;
    return matchesQuery && matchesFilter;
  });

  const dotStart = Math.max(
    0,
    Math.min(
      activePosition - Math.floor(DOT_WINDOW / 2),
      items.length - DOT_WINDOW,
    ),
  );
  const dots = items.slice(dotStart, dotStart + DOT_WINDOW);
  const previous = items[(activePosition - 1 + items.length) % items.length];
  const next = items[(activePosition + 1) % items.length];

  const cssCode = cssEaseCode(currentEasing.points);
  const motionCode = motionEaseCode(currentEasing.points);
  const gsapCode = gsapEaseCode(currentEasing.points);
  const rawCode = rawEaseCode(currentEasing.points);

  const codeTabs = [
    { value: "css", label: "CSS", code: cssCode },
    { value: "motion", label: "Motion", code: motionCode },
    { value: "gsap", label: "GSAP", code: gsapCode },
    { value: "raw", label: "Raw", code: rawCode },
  ];

  const cssLines = useHighlightedCode(cssCode, "css");
  const motionLines = useHighlightedCode(motionCode, "javascript");
  const gsapLines = useHighlightedCode(gsapCode, "javascript");
  const rawLines = useHighlightedCode(rawCode, "css");

  const codeLines: Record<string, React.ReactNode[]> = {
    css: cssLines,
    motion: motionLines,
    gsap: gsapLines,
    raw: rawLines,
  };
  const activeCode =
    codeTabs.find((tab) => tab.value === activeTab)?.code ?? cssCode;

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(var(--color-foreground)_1px,transparent_1px)] [background-size:18px_18px]"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-8 sm:px-8 lg:px-10">
        <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="flex flex-col gap-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="-ml-2 w-fit text-muted-foreground"
            >
              <Link href="/easing">
                <ArrowLeft data-icon="inline-start" aria-hidden="true" />
                Easings
              </Link>
            </Button>
            <p className="font-archivo text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Motion tool
            </p>
            <h1 className="font-heading text-4xl font-semibold leading-[1.1] tracking-tight chroma-text chroma-text-animate-once sm:text-5xl">
              Ease Visualizer
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              Preview your curve on a real expanding navbar. Tune the timing,
              replay the motion, and copy the easing.
            </p>
          </div>
          <Badge
            variant="outline"
            className="h-auto gap-2 rounded-full border-border/60 bg-my-primary/70 px-3 py-1.5 text-xs font-normal text-muted-foreground backdrop-blur"
          >
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-my-secondary"
            />
            {items.length} cubic-bézier curves
          </Badge>
        </header>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="flex min-w-0 flex-col gap-5">
            <div className="rounded-[20px] border border-border/60 bg-my-primary/70 p-3 shadow-sm backdrop-blur">
              <div className="grid gap-3 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                <div className="flex flex-col rounded-[16px] bg-my-bg p-5">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="truncate font-archivo font-medium text-foreground">
                      {graphEasing.name}
                    </span>
                    <span className="font-mono text-muted-foreground">t → v</span>
                  </div>
                  <div className="flex h-[300px] items-center justify-center">
                    <EasingCurveSvg
                      key={`${graphEasing.slug}-${duration}-${phase}-${replayKey}`}
                      points={graphEasing.points}
                      animate={!reducedMotion}
                      showGrid
                      width={250}
                      height={250}
                      duration={effectiveDuration}
                      direction="normal"
                      autoPlay={false}
                    />
                  </div>
                  <p className="truncate text-center font-mono text-[11px] text-muted-foreground">
                    {cubicBezierString(graphEasing.points)}
                  </p>
                </div>

                <div className="flex flex-col rounded-[16px] p-3">
                  <div className="mb-3 flex items-center justify-between gap-3 text-xs">
                    <span className="font-medium text-foreground">
                      UI preview
                    </span>
                    <Badge
                      variant="outline"
                      className="border-border/60 text-[10px] font-normal uppercase tracking-[0.16em] text-muted-foreground"
                    >
                      Navbar
                    </Badge>
                  </div>
                  <div className="h-[320px]">
                    <NavbarPreview
                      points={currentEasing.points}
                      duration={effectiveDuration}
                      replayKey={replayKey}
                      isOpen={isOpen}
                      onOpen={() => setIsOpen(true)}
                    />
                  </div>
                </div>
              </div>

              <Separator className="my-3" />

              <div className="flex flex-wrap items-center gap-2 px-1 pb-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleReplay}
                >
                  <RotateCcw data-icon="inline-start" aria-hidden="true" />
                  Replay
                  <Kbd className="ml-1">R</Kbd>
                </Button>

                <span className="ml-auto font-mono text-xs text-muted-foreground">
                  {(duration / 1000).toFixed(2)}s
                </span>
              </div>
            </div>

            <div className="rounded-[20px] border border-border/60 bg-my-primary/70 p-5 backdrop-blur">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h2 className="font-heading text-lg font-semibold tracking-tight">
                    Code
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Drop this curve into your navbar transition.
                  </p>
                </div>
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex items-center justify-between gap-2">
                  <TabsList
                    variant="line"
                    className="h-auto w-auto justify-start gap-3 bg-transparent p-0"
                  >
                    {codeTabs.map((tab) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="h-auto flex-none px-0 py-1 text-sm font-normal"
                      >
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <CodeBlockCopyButton value={activeCode} />
                </div>
                {codeTabs.map((tab) => (
                  <TabsContent key={tab.value} value={tab.value} className="mt-3">
                    <CodeBlock className="border-none bg-my-bg">
                      <CodeBlockContent wrap className="p-3">
                        {codeLines[tab.value].map((line, index) => (
                          <CodeBlockLine key={index}>{line}</CodeBlockLine>
                        ))}
                      </CodeBlockContent>
                    </CodeBlock>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </section>

          <aside className="flex h-fit flex-col rounded-[20px] border border-border/60 bg-my-primary/70 p-4 backdrop-blur">
            <h2 className="font-heading text-lg font-semibold tracking-tight">
              Customize
            </h2>

            <Badge
              variant="outline"
              className="mt-4 h-auto w-full justify-start gap-2 rounded-lg border-transparent bg-my-bg px-3 py-2 text-sm font-medium text-foreground"
            >
              <span
                aria-hidden="true"
                className="size-2 shrink-0 rounded-full bg-my-secondary"
              />
              <span className="truncate">{currentEasing.name}</span>
            </Badge>

            <InputGroup className="mt-3 h-9">
              <InputGroupAddon>
                <Search aria-hidden="true" />
              </InputGroupAddon>
              <InputGroupInput
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search curves"
                aria-label="Search easing curves"
              />
            </InputGroup>

            <ToggleGroup
              type="single"
              value={filter}
              onValueChange={(value) => {
                if (value) setFilter(value as EaseFilter);
              }}
              variant="outline"
              size="sm"
              spacing={0}
              className="mt-3 w-full rounded-lg"
            >
              {(
                [
                  ["all", "All"],
                  ["in", "In"],
                  ["out", "Out"],
                  ["in-out", "In-out"],
                ] as const
              ).map(([value, label]) => (
                <ToggleGroupItem
                  key={value}
                  value={value}
                  className="flex-1 text-xs"
                >
                  {label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            <ScrollArea className="mt-3 h-[360px]" type="auto">
              <div className="flex flex-col gap-1 pr-2">
                {filteredItems.map((item) => {
                  const active = item.slug === currentEasing.slug;
                  return (
                    <Button
                      key={item.slug}
                      type="button"
                      variant="ghost"
                      onClick={() => selectEasing(item.slug)}
                      onMouseEnter={() => setHoveredSlug(item.slug)}
                      onMouseLeave={() => setHoveredSlug(null)}
                      onFocus={() => setHoveredSlug(item.slug)}
                      onBlur={() => setHoveredSlug(null)}
                      aria-current={active ? "true" : undefined}
                      className={cn(
                        "h-auto w-full justify-start gap-3 rounded-lg px-2 py-2 text-sm font-normal",
                        active
                          ? "bg-my-bg text-foreground"
                          : "text-muted-foreground hover:bg-my-bg/70 hover:text-foreground",
                      )}
                    >
                      <MiniCurve points={item.points} active={active} />
                      <span className="flex-1 truncate text-left">
                        {item.name}
                      </span>
                      {active && (
                        <span
                          aria-hidden="true"
                          className="size-1.5 shrink-0 rounded-full bg-my-secondary"
                        />
                      )}
                    </Button>
                  );
                })}
                {filteredItems.length === 0 && (
                  <Empty className="border-none px-2 py-10">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <SearchX aria-hidden="true" />
                      </EmptyMedia>
                      <EmptyTitle>No curves found</EmptyTitle>
                      <EmptyDescription>
                        Try another search or filter.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
              </div>
            </ScrollArea>

            <p className="mt-2 text-[11px] text-muted-foreground">
              Hover previews the graph. Click applies the curve.
            </p>

            <Separator className="my-4" />

            <div className="flex items-center justify-between gap-3">
              <Label
                htmlFor="easing-duration"
                className="text-xs text-muted-foreground"
              >
                Duration
              </Label>
              <div className="flex items-center gap-1.5">
                <Input
                  id="easing-duration"
                  type="number"
                  min={0}
                  max={5000}
                  value={durationDraft}
                  onChange={(event) => setDurationDraft(event.target.value)}
                  onBlur={() => {
                    const value = Number.parseInt(durationDraft, 10);
                    if (Number.isNaN(value)) {
                      setDurationDraft(String(duration));
                    } else {
                      commitDuration(value);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") event.currentTarget.blur();
                  }}
                  className="h-8 w-20 text-right font-mono text-xs"
                />
                <span className="text-xs text-muted-foreground">ms</span>
              </div>
            </div>
            <Slider
              aria-label="Duration"
              className="mt-4"
              min={0}
              max={5000}
              step={1}
              value={[tempDuration]}
              onValueChange={([value]) => {
                setTempDuration(value);
                setDurationDraft(String(value));
              }}
              onValueCommit={([value]) => commitDuration(value)}
            />
            <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground">
              <span>0ms</span>
              <span>5000ms</span>
            </div>

            {reducedMotion && (
              <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
                Reduced motion is on. Previews update instantly.
              </p>
            )}
          </aside>
        </div>

        {items.length > 1 && previous && next && (
          <nav
            aria-label="Easing navigation"
            className="mx-auto flex items-center justify-between gap-3 rounded-full border border-border/60 bg-my-primary/70 px-2 py-1.5 shadow-sm backdrop-blur"
          >
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigateBy(-1)}
              aria-label={`Previous easing: ${previous.name}`}
              title="Previous easing (←)"
              className="h-9 rounded-full px-7"
            >
              <ArrowLeft aria-hidden="true" />
            </Button>

            <div className="flex items-center">
              {dots.map((item, offset) => {
                const index = dotStart + offset;
                const active = index === activePosition;
                return (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => selectEasing(item.slug)}
                    aria-label={`Show easing ${index + 1}: ${item.name}`}
                    aria-current={active ? "true" : undefined}
                    className="group flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    <span
                      className={cn(
                        "size-1.5 rounded-full transition-all duration-200",
                        active
                          ? "scale-125 bg-foreground"
                          : "bg-foreground/20 group-hover:bg-foreground/45",
                      )}
                    />
                  </button>
                );
              })}
            </div>

            <Button
              type="button"
              onClick={() => navigateBy(1)}
              aria-label={`Next easing: ${next.name}`}
              title="Next easing (→)"
              className="h-9 rounded-full px-7"
            >
              <ArrowRight aria-hidden="true" />
            </Button>
          </nav>
        )}
      </div>
    </main>
  );
}
