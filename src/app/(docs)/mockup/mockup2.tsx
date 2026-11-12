"use client";

/**
 * Throwaway component-docs mockup, inspired by the Planes component pages.
 * Drop this into the existing Next.js app in place of the original mockup.
 * The registry URL and related components are placeholders, as before.
 */

import { ArrowLeft, ArrowRight, Check, CodeXml, Copy, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const COMPONENT = {
  title: "Folder Preview",
  description:
    "A folder card that fans its documents open on hover. Ships three examples: the stack, a minimal single folder, and a colorable variant.",
};

// Placeholder only — replace with the real registry URL when the component ships.
const INSTALL_URL = "https://fixel-ui.example/registry/folder-preview.json";
const PACKAGE_MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const;
type PackageManager = (typeof PACKAGE_MANAGERS)[number];
const RUNNERS: Record<PackageManager, string> = {
  npm: "npx",
  pnpm: "pnpm dlx",
  yarn: "yarn dlx",
  bun: "bunx --bun",
};

const BASIC_SOURCE = `import { motion } from "motion/react";

export function FolderStack() {
  return (
    <motion.div initial="rest" animate="rest" whileHover="hover"
      className="flex h-56 w-80 items-end justify-center pb-10">
      {[0, 1, 2].map((index) => (
        <motion.div key={index}
          variants={{
            rest: { y: 0, rotate: 0 },
            hover: { y: -(8 + index * 10), rotate: (index - 1) * 6 },
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="-mx-6 h-44 w-44 rounded-2xl border bg-background p-4 shadow-lg"
        />
      ))}
    </motion.div>
  );
}`;

const MINIMAL_SOURCE = `import { motion, useReducedMotion } from "motion/react";

export function FloatingFolder() {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="relative"
    >
      <span className="absolute -top-3 left-4 h-6 w-16 rounded-t-lg border border-b-0 bg-background" />
      <div className="relative flex h-36 w-56 items-center justify-center rounded-xl border bg-background shadow-lg">
        Documents
      </div>
    </motion.div>
  );
}`;

const CUSTOM_COLORS_SOURCE = `"use client";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

const COLORS = { black: "bg-neutral-900", white: "bg-white", blue: "bg-blue-600" } as const;
type Color = keyof typeof COLORS;

export function ColorableFolder() {
  const [color, setColor] = useState<Color>("black");
  const reduceMotion = useReducedMotion();
  return (
    <div className="flex flex-col items-center gap-8">
      <motion.div key={color}
        initial={reduceMotion ? false : { scale: 0.9, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        className={COLORS[color] + " relative flex h-36 w-56 items-center justify-center rounded-xl shadow-lg"}>
        <span className={COLORS[color] + " absolute -top-3 left-4 h-6 w-16 rounded-t-lg"} />
        <span className={color === "white" ? "text-neutral-900" : "text-white"}>Documents</span>
      </motion.div>
      <div className="flex gap-2">
        {(Object.keys(COLORS) as Color[]).map((value) => (
          <button key={value} type="button" onClick={() => setColor(value)}
            aria-label={"Use " + value + " folder"} aria-pressed={color === value}
            className={COLORS[value] + " size-6 rounded-full"} />
        ))}
      </div>
    </div>
  );
}`;

const SOURCE_CODE = `"use client";
import { motion, type Variants } from "motion/react";

type FolderPreviewProps = {
  label?: string;
  size?: "sm" | "md" | "lg";
};

const stack: Variants = {
  rest: { y: 0, rotate: 0 },
  hover: (index: number) => ({
    y: -(8 + index * 10),
    rotate: (index - 1) * 6,
  }),
};

export function FolderPreview({ label = "Documents", size = "md" }: FolderPreviewProps) {
  const heights = { sm: "h-28", md: "h-36", lg: "h-44" } as const;
  return (
    <motion.div initial="rest" animate="rest" whileHover="hover"
      className="flex items-end justify-center pb-8">
      {Array.from({ length: 3 }).map((_, index) => (
        <motion.div key={index} custom={index} variants={stack}
          className={"-mx-6 w-56 " + heights[size] + " rounded-2xl border bg-background shadow-lg"}>
          <span className="p-4 text-sm text-muted-foreground">{label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}`;

function BasicDemo() {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial="rest"
      animate="rest"
      whileHover={reduceMotion ? undefined : "hover"}
      className="flex h-56 w-72 items-end justify-center pb-10 sm:w-80"
    >
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          variants={{
            rest: { y: 0, rotate: 0 },
            hover: { y: -(8 + index * 10), rotate: (index - 1) * 6 },
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="-mx-6 flex h-44 w-44 flex-col gap-2 rounded-2xl border border-border bg-background p-4 shadow-lg"
        >
          <span className="mt-2 block h-2 w-3/4 rounded-full bg-muted" />
          <span className="block h-1.5 w-full rounded-full bg-muted/80" />
          <span className="block h-1.5 w-2/3 rounded-full bg-muted/80" />
        </motion.div>
      ))}
    </motion.div>
  );
}

function MinimalDemo() {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="relative"
    >
      <span className="absolute -top-3 left-4 h-6 w-16 rounded-t-lg border border-b-0 border-border bg-background" />
      <div className="relative flex h-36 w-56 items-center justify-center rounded-xl border border-border bg-background shadow-lg">
        <span className="text-sm text-muted-foreground">Documents</span>
      </div>
    </motion.div>
  );
}

const FOLDER_COLORS = {
  black: "bg-neutral-900",
  white: "bg-white",
  blue: "bg-blue-600",
} as const;
type FolderColor = keyof typeof FOLDER_COLORS;
function CustomColorsDemo() {
  const [color, setColor] = useState<FolderColor>("black");
  const reduceMotion = useReducedMotion();
  return (
    <div className="flex flex-col items-center gap-8">
      <motion.div
        key={color}
        initial={
          reduceMotion ? false : { scale: 0.9, opacity: 0.6, rotate: -2 }
        }
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={`relative flex h-36 w-56 items-center justify-center rounded-xl shadow-lg ${FOLDER_COLORS[color]}`}
      >
        <span
          className={`absolute -top-3 left-4 h-6 w-16 rounded-t-lg ${FOLDER_COLORS[color]}`}
        />
        <span
          className={`text-sm font-medium ${color === "white" ? "text-neutral-900" : "text-white/90"}`}
        >
          Documents
        </span>
      </motion.div>
      <div className="flex items-center gap-2 rounded-full border border-border bg-background/80 p-1.5 shadow-sm backdrop-blur">
        {(Object.keys(FOLDER_COLORS) as FolderColor[]).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setColor(value)}
            aria-label={`Use ${value} folder`}
            aria-pressed={color === value}
            className={`size-6 rounded-full border border-black/10 ${FOLDER_COLORS[value]} ${color === value ? "ring-2 ring-foreground/60 ring-offset-2 ring-offset-background" : "opacity-70 hover:opacity-100"}`}
          />
        ))}
      </div>
    </div>
  );
}

const EXAMPLES = [
  { name: "basic", title: "Basic", source: BASIC_SOURCE, Demo: BasicDemo },
  {
    name: "minimal",
    title: "Minimal",
    source: MINIMAL_SOURCE,
    Demo: MinimalDemo,
  },
  {
    name: "custom-colors",
    title: "Custom colors",
    source: CUSTOM_COLORS_SOURCE,
    Demo: CustomColorsDemo,
  },
];

const RELATED = [
  {
    title: "Gooey Navbar",
    category: "UI",
    description:
      "A playful navigation bar whose active pill melts between items.",
  },
  {
    title: "Matrix Orb",
    category: "UI",
    description:
      "A canvas orb of falling glyphs that reacts to pointer movement.",
  },
  {
    title: "Step Player",
    category: "UI",
    description: "A walkthrough player that advances through numbered steps.",
  },
];

function CopyButton({
  value,
  label = "Copy",
}: {
  value: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setFailed(false);
    } catch {
      setFailed(true);
      setCopied(false);
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setCopied(false);
      setFailed(false);
    }, 2000);
  }
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={
        copied
          ? "Copied"
          : failed
            ? "Copy failed; select the text instead"
            : label
      }
      title={
        copied
          ? "Copied"
          : failed
            ? "Copy failed; select the text instead"
            : label
      }
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-my-primary text-foreground/65 transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied" : failed ? "Copy failed" : ""}
      </span>
    </button>
  );
}

function CodePanel({ code }: { code: string }) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-muted">
      <div className="absolute right-2 top-2 z-10">
        <CopyButton value={code} label="Copy code" />
      </div>
      <pre className="overflow-x-auto px-4 py-4 pr-14 font-mono text-xs leading-6 text-foreground/80">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function InstallSection() {
  const [pm, setPm] = useState<PackageManager>("pnpm");
  const command = `${RUNNERS[pm]} shadcn add ${INSTALL_URL}`;
  return (
    <section id="installation" className="scroll-mt-32">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-heading text-xl font-semibold tracking-tight">
          Installation
        </h2>
        <span className="font-archivo text-xs text-muted-foreground">
          Placeholder registry URL
        </span>
      </div>
      <div className="overflow-hidden rounded-xl bg-my-primary p-3">
        <div
          role="group"
          aria-label="Package manager"
          className="flex flex-wrap items-center gap-1 border-b border-border pb-3"
        >
          {PACKAGE_MANAGERS.map((manager) => (
            <button
              key={manager}
              type="button"
              onClick={() => setPm(manager)}
              aria-pressed={pm === manager}
              className={`rounded-lg px-3 py-1.5 font-archivo text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${pm === manager ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >
              {manager}
            </button>
          ))}
        </div>
        <div className="relative mt-3 flex items-center overflow-hidden rounded-lg bg-muted py-2.5 pl-4 pr-12 font-mono text-[13px]">
          <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap">
            {command}
          </code>
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <CopyButton value={command} label="Copy install command" />
          </div>
        </div>
      </div>
    </section>
  );
}

function CodeSheet({
  open,
  onOpenChange,
  exampleSource,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exampleSource: string;
}) {
  const [tab, setTab] = useState<"example" | "source">("example");
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="data-[side=right]:inset-y-3 data-[side=right]:right-3 data-[side=right]:h-auto data-[side=right]:w-[calc(100%_-_1.5rem)] data-[side=right]:max-w-[400px] data-[side=right]:sm:max-w-[400px] data-[side=right]:border-0 flex flex-col gap-0 overflow-hidden rounded-[26px] bg-my-primary/90 p-3 backdrop-blur-[20px] backdrop-saturate-150"
      >
        <SheetClose asChild>
          <button
            type="button"
            aria-label="Close code"
            title="Close (Esc)"
            className="absolute right-6 top-5.5 z-20 inline-flex size-9 items-center justify-center rounded-full bg-my-primary text-foreground transition hover:bg-my-primary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-4" />
          </button>
        </SheetClose>
        <section
          aria-label="Component code"
          tabIndex={0}
          className="scroll-fade scroll-fade-20 scrollbar-none min-h-0 flex-1 overflow-y-auto overscroll-contain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-foreground/20"
        >
          <div className="flex flex-col gap-4 px-1.5 pb-2 pt-1">
            <SheetHeader className="space-y-1.5 p-0 pr-10 text-left">
              <SheetTitle className="font-heading text-[26px] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground chroma-text chroma-text-animate-once">
                {COMPONENT.title}
              </SheetTitle>
              <SheetDescription className="font-archivo text-xs tracking-wide text-foreground/65">
                Fixel UI component
              </SheetDescription>
            </SheetHeader>
            <p className="text-[13px] leading-[1.7] text-foreground/80">
              {COMPONENT.description}
            </p>
            <div
              role="group"
              aria-label="Code view"
              className="flex items-center gap-2.5"
            >
              {(["example", "source"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={tab === value}
                  onClick={() => setTab(value)}
                  className={`py-1 font-archivo text-sm capitalize underline-offset-2 transition-colors ${tab === value ? "text-foreground underline" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {value}
                </button>
              ))}
            </div>
            <CodePanel code={tab === "example" ? exampleSource : SOURCE_CODE} />
          </div>
        </section>
      </SheetContent>
    </Sheet>
  );
}

export default function MockupPage() {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [codeOpen, setCodeOpen] = useState(false);
  const [usageTab, setUsageTab] = useState<"example" | "source">("example");
  const reduceMotion = useReducedMotion();
  const example = EXAMPLES[exampleIndex];
  const Demo = example.Demo;
  const previous =
    EXAMPLES[(exampleIndex - 1 + EXAMPLES.length) % EXAMPLES.length];
  const next = EXAMPLES[(exampleIndex + 1) % EXAMPLES.length];

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        codeOpen ||
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      )
        return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.closest(
            'input, textarea, select, button, a, [role="tab"], [contenteditable]:not([contenteditable="false"])',
          ))
      )
        return;
      event.preventDefault();
      setExampleIndex(
        (index) =>
          (index + (event.key === "ArrowRight" ? 1 : -1) + EXAMPLES.length) %
          EXAMPLES.length,
      );
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [codeOpen]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-32 text-foreground md:px-6 lg:px-8">
      {/* Keep the Planes-inspired centered heading and preview, using the
          exact Fixel catalog and viewer spacing, typography and surfaces. */}
      <section
        id="preview"
        aria-label="Component playground"
        className="scroll-mt-32"
      >
        <div className="flex flex-col items-center text-center">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <h1 className="font-heading text-5xl font-semibold leading-[1.1] tracking-tight chroma-text chroma-text-animate-once lg:text-7xl">
              {COMPONENT.title}
            </h1>
            <span className="rounded-md bg-foreground/[0.055] px-2 py-1 font-archivo text-[10px] font-medium tracking-[0.08em] text-foreground/65">
              UI
            </span>
          </div>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {COMPONENT.description}
          </p>
        </div>
        <hr className="my-6 border-primary/15" />

        <div className="relative flex min-h-[60vh] flex-col overflow-hidden rounded-[26px] bg-my-bg">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(var(--color-foreground)_1px,transparent_1px)] [background-size:18px_18px]"
          />
          <div className="relative flex min-h-[360px] flex-1 items-center justify-center px-6 py-12 sm:px-12">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={example.name}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <Demo />
              </motion.div>
            </AnimatePresence>
          </div>
          <p className="sr-only" aria-live="polite" aria-atomic="true">
            Example {exampleIndex + 1} of {EXAMPLES.length}: {example.title}
          </p>
          <nav
            aria-label="Example navigation"
            className="relative mx-auto mb-6 flex items-center justify-between gap-3 rounded-full border border-border/60 bg-my-primary/70 px-2 py-1.5 shadow-sm backdrop-blur"
          >
            <button
              type="button"
              onClick={() =>
                setExampleIndex(
                  (index) => (index - 1 + EXAMPLES.length) % EXAMPLES.length,
                )
              }
              aria-label={`Previous example: ${previous.title}`}
              title="Previous example (←)"
              className="inline-flex h-9 shrink-0 items-center justify-center rounded-full bg-my-bg px-7 text-foreground transition hover:bg-my-bg/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 dark:bg-muted"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
            </button>
            <div className="flex items-center">
              {EXAMPLES.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setExampleIndex(index)}
                  aria-label={`Show example ${index + 1}: ${item.title}`}
                  aria-current={index === exampleIndex ? "true" : undefined}
                  className="group flex size-5 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  <span
                    className={`size-1.5 rounded-full transition-all ${index === exampleIndex ? "scale-125 bg-foreground" : "bg-foreground/20 group-hover:bg-foreground/45"}`}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setExampleIndex((index) => (index + 1) % EXAMPLES.length)
              }
              aria-label={`Next example: ${next.title}`}
              title="Next example (→)"
              className="inline-flex h-9 shrink-0 items-center justify-center rounded-full bg-foreground px-7 text-background transition hover:bg-foreground/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </nav>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 px-0.5">
          <div className="font-archivo text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{example.title}</span>
            <span className="ml-2">
              {exampleIndex + 1} / {EXAMPLES.length}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setCodeOpen(true)}
            className="inline-flex h-9 items-center gap-2 rounded-full bg-my-primary px-4 font-archivo text-xs font-medium text-foreground shadow-sm transition hover:bg-my-primary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <CodeXml className="size-4" aria-hidden="true" />
            Get code
          </button>
        </div>
      </section>

      {/* The reference's catalog container and card spacing frame the more
          documentation-oriented flow retained from the previous version. */}
      <div className="mx-auto w-full max-w-[820px] space-y-16 py-20">
        <InstallSection />
        <section id="usage" className="scroll-mt-32">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="font-heading text-xl font-semibold tracking-tight">
              Usage
            </h2>
            <div
              role="group"
              aria-label="Code view"
              className="flex items-center gap-2.5"
            >
              {(["example", "source"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setUsageTab(value)}
                  aria-pressed={usageTab === value}
                  className={`py-1 font-archivo text-sm capitalize underline-offset-2 transition-colors ${usageTab === value ? "text-foreground underline" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
          <CodePanel
            code={usageTab === "example" ? example.source : SOURCE_CODE}
          />
        </section>
        <section aria-labelledby="about-heading">
          <h2
            id="about-heading"
            className="mb-4 font-heading text-xl font-semibold tracking-tight"
          >
            About this component
          </h2>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            {COMPONENT.description} Detailed usage notes and props will be added
            here later.
          </p>
        </section>
      </div>

      <section
        id="related"
        aria-labelledby="related-heading"
        className="scroll-mt-32 pb-16"
      >
        <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-primary/15 pb-6">
          <h2
            id="related-heading"
            className="font-heading text-2xl font-semibold tracking-tight"
          >
            Related components
          </h2>
          <Link
            href="/components"
            className="font-archivo text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            All components
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {RELATED.map((item) => (
            <article
              key={item.title}
              className="group relative min-w-0 rounded-xl"
            >
              <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg bg-muted p-6">
                <span
                  aria-hidden="true"
                  className="font-heading text-3xl font-semibold text-muted-foreground/50"
                >
                  {item.title.charAt(0)}
                </span>
                <span className="absolute right-2 top-2 rounded-md bg-background/85 px-2 py-1 font-archivo text-[10px] text-muted-foreground backdrop-blur">
                  {item.category}
                </span>
              </div>
              <div className="mt-3 min-w-0 px-0.5">
                <p className="line-clamp-1 font-archivo text-base font-medium text-foreground">
                  {item.title}
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <Link
                href="/components"
                className="absolute inset-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <span className="sr-only">View {item.title}</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
      <CodeSheet
        open={codeOpen}
        onOpenChange={setCodeOpen}
        exampleSource={example.source}
      />
    </main>
  );
}
