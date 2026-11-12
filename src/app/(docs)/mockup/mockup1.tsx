"use client";

/**
 * THROWAWAY layout mockup for the redesigned component docs page.
 *
 * Rehearses the rare-ui-style anatomy with fixel's own design system:
 * a full-viewport stage canvas, floating glass control pills (install bar,
 * get-code, overflow actions), an easing-style code sheet without the display
 * area, an example switcher, and below-the-fold reserved text plus related
 * components. Everything here is fake and self-contained on purpose —
 * delete this file when the real page lands.
 */

import { cn } from "cn";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  CodeXml,
  ExternalLink,
  FileText,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockLine,
} from "@/components/ui/code-block";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";

// ---------------------------------------------------------------------------
// 1. Fake data
// ---------------------------------------------------------------------------

const FAKE_COMPONENT = {
  title: "Folder Preview",
  description:
    "A folder card that fans its documents open on hover. Ships three examples: the stack, a minimal single folder, and a colorable variant.",
  category: "UI",
};

const INSTALL_URL = "https://fixel-ui.example/registry/folder-preview.json";

const PACKAGE_MANAGERS = ["npm", "pnpm", "yarn", "bun"] as const;
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
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="flex h-52 items-end justify-center pb-8"
    >
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          variants={{
            rest: { y: 0, rotate: 0 },
            hover: { y: -(8 + index * 10), rotate: (index - 1) * 6 },
          }}
          className="-mx-6 h-44 w-40 rounded-2xl border border-border bg-background shadow-lg"
        />
      ))}
    </motion.div>
  );
}
`;

const MINIMAL_SOURCE = `import { motion, useReducedMotion } from "motion/react";

export function FloatingFolder() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="relative flex h-36 w-56 items-center justify-center rounded-xl border border-border bg-background shadow-lg"
    >
      <span className="font-archivo text-sm text-muted-foreground">
        Documents
      </span>
    </motion.div>
  );
}
`;

const CUSTOM_COLORS_SOURCE = `"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

const COLORS = {
  black: "bg-neutral-900",
  white: "bg-white",
  blue: "bg-blue-600",
} as const;

type Color = keyof typeof COLORS;

export function ColorableFolder() {
  const [color, setColor] = useState<Color>("black");
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div
        key={color}
        initial={reduceMotion ? false : { scale: 0.9, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={COLORS[color] + " flex h-36 w-56 items-center justify-center rounded-xl shadow-lg"}
      >
        <span className="font-archivo text-sm font-medium">Documents</span>
      </motion.div>

      <div className="flex items-center gap-2 rounded-full border border-border/60 bg-my-primary/70 p-1.5 backdrop-blur-[20px]">
        {(Object.keys(COLORS) as Color[]).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setColor(value)}
            aria-pressed={color === value}
            aria-label={"Use " + value + " folder"}
            className={COLORS[value] + " size-6 rounded-full"}
          />
        ))}
      </div>
    </div>
  );
}
`;

const SOURCE_CODE = `"use client";

import { motion, type Variants } from "motion/react";

type FolderPreviewProps = {
  /** Label rendered in the center of the card. */
  label?: string;
  /** Card height preset. */
  size?: "sm" | "md" | "lg";
};

const stack: Variants = {
  rest: { y: 0, rotate: 0 },
  hover: (index: number) => ({
    y: -(8 + index * 10),
    rotate: (index - 1) * 6,
  }),
};

export function FolderPreview({
  label = "Documents",
  size = "md",
}: FolderPreviewProps) {
  const heights = { sm: "h-28", md: "h-36", lg: "h-44" } as const;

  return (
    <motion.div
      initial="rest"
      animate="rest"
      whileHover="hover"
      className="flex items-end justify-center pb-8"
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <motion.div
          key={index}
          custom={index}
          variants={stack}
          className={
            "-mx-6 w-56 " + heights[size] +
            " rounded-2xl border border-border bg-background shadow-lg"
          }
        >
          <span className="p-4 font-archivo text-sm text-muted-foreground">
            {label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}
`;

const RELATED = [
  {
    title: "Gooey Navbar",
    description:
      "A playful navigation bar whose active pill melts between items with a gooey SVG filter.",
    category: "ui",
    gradient: "linear-gradient(135deg, #d8c9a8 0%, #b8a67e 100%)",
  },
  {
    title: "Matrix Orb",
    description:
      "A canvas orb of falling glyphs that reacts to pointer velocity and settles when idle.",
    category: "ui",
    gradient: "linear-gradient(135deg, #9aa8b8 0%, #6e7c8c 100%)",
  },
  {
    title: "Step Player",
    description:
      "A walkthrough player that advances through numbered steps with springy progress.",
    category: "ui",
    gradient: "linear-gradient(135deg, #c8a8a8 0%, #a87e7e 100%)",
  },
];

// ---------------------------------------------------------------------------
// 2. Fake demos (stand-ins for the generated example barrel)
// ---------------------------------------------------------------------------

function BasicDemo() {
  return (
    <motion.div
      initial="rest"
      animate="rest"
      whileHover="hover"
      className="flex h-56 w-80 items-end justify-center pb-10"
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
      <span className="absolute -top-3 left-4 h-6 w-16 rounded-t-lg border border-border border-b-0 bg-background" />
      <div className="relative flex h-36 w-56 items-center justify-center rounded-xl border border-border bg-background shadow-lg">
        <span className="font-archivo text-sm text-muted-foreground">
          Documents
        </span>
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
        className={cn(
          "relative flex h-36 w-56 items-center justify-center rounded-xl shadow-lg",
          FOLDER_COLORS[color],
        )}
      >
        <span
          className={cn(
            "absolute -top-3 left-4 h-6 w-16 rounded-t-lg",
            FOLDER_COLORS[color],
          )}
        />
        <span
          className={cn(
            "font-archivo text-sm font-medium",
            color === "white" ? "text-neutral-900" : "text-white/90",
          )}
        >
          Documents
        </span>
      </motion.div>

      <div className="flex items-center gap-2 rounded-full border border-border/60 bg-my-primary/70 p-1.5 shadow-sm backdrop-blur-[20px]">
        {(Object.keys(FOLDER_COLORS) as FolderColor[]).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setColor(value)}
            aria-label={`Use ${value} folder`}
            aria-pressed={color === value}
            className={cn(
              "size-6 rounded-full transition",
              FOLDER_COLORS[value],
              color === value
                ? "ring-2 ring-foreground/60 ring-offset-2 ring-offset-card"
                : "opacity-70 hover:opacity-100",
            )}
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

// ---------------------------------------------------------------------------
// 3. Floating controls
// ---------------------------------------------------------------------------

const EASE = [0.22, 1, 0.36, 1] as const;

function InstallBar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pm, setPm] = useState<PackageManager>("pnpm");
  // The width animation needs overflow-hidden, which would clip the package
  // manager menu that hangs below the bar, so the clip lifts once settled.
  const [clip, setClip] = useState(true);
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (rootRef.current?.contains(event.target as Node)) return;
      setMenuOpen(false);
      setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (menuOpen) {
        setMenuOpen(false);
        return;
      }
      setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, menuOpen]);

  const command = `${RUNNERS[pm]} shadcn add ${INSTALL_URL}`;
  const prefix = command.slice(0, command.length - INSTALL_URL.length);

  return (
    <div
      ref={rootRef}
      className="relative flex items-center rounded-full border border-border/60 bg-my-primary/70 p-1.5 shadow-sm backdrop-blur-[20px]"
    >
      <button
        type="button"
        onClick={() => {
          setMenuOpen(false);
          setOpen((value) => !value);
        }}
        aria-expanded={open}
        aria-label={open ? "Close install command" : "Show install command"}
        className="inline-flex h-9 shrink-0 items-center justify-center rounded-full bg-my-bg px-4 font-archivo text-xs font-medium text-foreground transition hover:bg-my-bg/70 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        {open ? <X className="size-4" aria-hidden="true" /> : "Install"}
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            onAnimationStart={() => setClip(true)}
            onAnimationComplete={() => setClip(false)}
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    width: { duration: 0.3, ease: EASE },
                    opacity: { duration: 0.2 },
                  }
            }
            className={clip ? "overflow-hidden" : "overflow-visible"}
          >
            <div className="flex w-max items-center gap-2 pl-2 pr-1">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((value) => !value)}
                  aria-expanded={menuOpen}
                  aria-label="Change package manager"
                  className="inline-flex h-9 items-center gap-1 rounded-full bg-my-bg px-3 font-archivo text-xs font-medium text-foreground transition hover:bg-my-bg/70 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {pm}
                  <ChevronDown
                    className="size-3 opacity-45"
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence>
                  {menuOpen ? (
                    <motion.ul
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.12, ease: "easeOut" }}
                      className="absolute end-0 top-full z-50 mt-1.5 flex flex-col gap-0.5 rounded-xl border border-border/60 bg-my-bg p-1 shadow-lg backdrop-blur-[20px]"
                    >
                      {PACKAGE_MANAGERS.map((manager) => (
                        <li key={manager}>
                          <button
                            type="button"
                            onClick={() => {
                              setPm(manager);
                              setMenuOpen(false);
                            }}
                            className={cn(
                              "w-full rounded-lg px-3 py-1.5 text-left font-archivo text-xs font-medium transition",
                              pm === manager
                                ? "text-foreground"
                                : "text-muted-foreground hover:text-foreground",
                            )}
                          >
                            {manager}
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  ) : null}
                </AnimatePresence>
              </div>

              <span aria-hidden="true" className="h-4 w-px bg-foreground/15" />

              <code className="max-w-[34vw] truncate font-mono text-xs tracking-tight text-muted-foreground sm:max-w-[300px]">
                {prefix}
                <span className="font-semibold text-foreground">
                  {INSTALL_URL}
                </span>
              </code>

              <CodeBlockCopyButton
                value={command}
                aria-label="Copy install command"
                className="size-8 rounded-full"
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function PageActionsCluster({ onGetCode }: { onGetCode: () => void }) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-border/60 bg-my-primary/70 p-1.5 shadow-sm backdrop-blur-[20px]">
      <button
        type="button"
        onClick={onGetCode}
        aria-label="Get code"
        title="Get code"
        className="inline-flex size-9 items-center justify-center rounded-full bg-my-bg text-foreground transition hover:bg-my-bg/70 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <CodeXml className="size-4" aria-hidden="true" />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="More page actions"
            title="More page actions"
            className="inline-flex size-9 items-center justify-center rounded-full bg-my-bg text-foreground transition hover:bg-my-bg/70 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <ChevronDown className="size-4" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem>
            <FileText aria-hidden="true" />
            View as Markdown
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ExternalLink aria-hidden="true" />
            Open in v0
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <ChevronDown aria-hidden="true" />
            More actions (fake)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. The code sheet (easing-sheet style, minus the display area)
// ---------------------------------------------------------------------------

const SHEET_CLASSES = [
  "data-[side=right]:inset-y-3 data-[side=right]:right-3",
  "data-[side=right]:h-auto",
  "data-[side=right]:w-[calc(100%_-_1.5rem)]",
  "data-[side=right]:max-w-[400px] data-[side=right]:sm:max-w-[400px]",
  "data-[side=right]:border-0",
  "flex flex-col gap-0 overflow-hidden rounded-[26px]",
  "bg-my-primary/90 p-3",
  "backdrop-blur-[20px] backdrop-saturate-150",
].join(" ");

const LINE_TAB_CLASSES =
  "h-auto rounded-none px-0 py-1 text-sm font-normal text-muted-foreground after:hidden data-[state=active]:text-black data-[state=active]:underline underline-offset-2 dark:data-[state=active]:text-foreground";

function CodeSheet({
  open,
  onOpenChange,
  title,
  description,
  exampleSource,
  sourceCode,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  exampleSource: string;
  sourceCode: string;
}) {
  const [tab, setTab] = useState("example");
  const exampleLines = useHighlightedCode(exampleSource, "tsx");
  const sourceLines = useHighlightedCode(sourceCode, "tsx");
  const activeCode = tab === "example" ? exampleSource : sourceCode;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className={SHEET_CLASSES}
      >
        <SheetClose asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close code"
            title="Close (Esc)"
            className="absolute top-5.5 right-6 z-20 size-9 rounded-full border-none bg-my-primary text-foreground opacity-100 backdrop-blur-2xl transition hover:bg-my-primary/70 hover:text-[#211f1c] focus-visible:ring-1 focus-visible:ring-my-bg"
          >
            <X aria-hidden="true" />
          </Button>
        </SheetClose>

        <div className="flex min-h-0 flex-1 flex-col">
          <section
            aria-label="Component code"
            className="scroll-fade scroll-fade-20 scrollbar-none no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain focus-visible:ring-2 focus-visible:ring-[#211f1c]/20 focus-visible:ring-inset focus-visible:outline-none"
          >
            <div className="flex flex-col gap-4 px-1.5 pb-2">
              <SheetHeader className="space-y-1.5 p-0 text-left">
                <SheetTitle className="font-heading text-[26px] leading-[1.1] font-semibold tracking-[-0.02em] text-[#211f1c] chroma-text chroma-text-animate-once">
                  {title}
                </SheetTitle>
                <SheetDescription className="text-[13px] leading-[1.7] text-[#45423d]">
                  {description}
                </SheetDescription>
              </SheetHeader>

              <Tabs value={tab} onValueChange={setTab} className="w-full">
                <div className="flex items-center justify-between gap-2">
                  <TabsList
                    variant="line"
                    className="h-auto w-auto justify-start gap-2.5 bg-transparent p-0"
                  >
                    <TabsTrigger value="example" className={LINE_TAB_CLASSES}>
                      Example
                    </TabsTrigger>
                    <TabsTrigger value="source" className={LINE_TAB_CLASSES}>
                      Source
                    </TabsTrigger>
                  </TabsList>
                  <CodeBlockCopyButton
                    value={activeCode}
                    aria-label="Copy code"
                  />
                </div>

                <TabsContent value="example" className="relative mt-0">
                  <CodeBlock className="rounded-lg border-none bg-muted">
                    <CodeBlockContent wrap className="rounded-lg p-3">
                      {exampleLines.map((line, index) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: code lines have no stable identity.
                        <CodeBlockLine key={index}>{line}</CodeBlockLine>
                      ))}
                    </CodeBlockContent>
                  </CodeBlock>
                </TabsContent>

                <TabsContent value="source" className="relative mt-0">
                  <CodeBlock className="rounded-lg border-none bg-muted">
                    <CodeBlockContent wrap className="rounded-lg p-3">
                      {sourceLines.map((line, index) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: code lines have no stable identity.
                        <CodeBlockLine key={index}>{line}</CodeBlockLine>
                      ))}
                    </CodeBlockContent>
                  </CodeBlock>
                </TabsContent>
              </Tabs>
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// 5. Below the fold
// ---------------------------------------------------------------------------

function RelatedCard({ component }: { component: (typeof RELATED)[number] }) {
  return (
    <article className="group relative min-w-0 rounded-xl">
      <div
        className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg"
        style={{ background: component.gradient }}
      >
        <span className="font-heading text-3xl font-semibold text-white/80">
          {component.title.charAt(0)}
        </span>
        <span className="absolute right-2 top-2 rounded-md bg-background/85 px-2 py-1 font-archivo text-[10px] text-muted-foreground backdrop-blur">
          {component.category}
        </span>
      </div>

      <div className="mt-3 min-w-0 px-0.5">
        <p className="line-clamp-1 font-archivo text-base font-medium text-foreground">
          {component.title}
        </p>
        <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
          {component.description}
        </p>
      </div>

      <Link
        href="/components"
        className="absolute inset-0 z-0 rounded-xl focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <span className="sr-only">View {component.title}</span>
      </Link>
    </article>
  );
}

// ---------------------------------------------------------------------------
// 6. The page
// ---------------------------------------------------------------------------

export default function MockupPage() {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [codeOpen, setCodeOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const example = EXAMPLES[exampleIndex];
  const Demo = example.Demo;

  // Arrow keys walk the examples, ignoring keys typed into real inputs.
  useEffect(() => {
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
      setExampleIndex((index) =>
        event.key === "ArrowRight"
          ? (index + 1) % EXAMPLES.length
          : (index - 1 + EXAMPLES.length) % EXAMPLES.length,
      );
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const previous =
    EXAMPLES[(exampleIndex - 1 + EXAMPLES.length) % EXAMPLES.length];

  return (
    <main className="w-full">
      <h1 className="sr-only">{FAKE_COMPONENT.title}</h1>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        Example {exampleIndex + 1} of {EXAMPLES.length}: {example.name}
      </p>

      {/* The stage: full viewport under the floating navbar */}
      <section
        aria-label="Component playground"
        className="flex min-h-[100dvh] w-full p-2 sm:p-3"
      >
        <div className="relative flex min-h-[calc(100dvh-1rem)] w-full flex-1 flex-col overflow-hidden rounded-[26px] bg-card shadow-sm sm:min-h-[calc(100dvh-1.5rem)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(var(--color-foreground)_1px,transparent_1px)] [background-size:18px_18px]"
          />

          <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full border border-border/60 bg-my-primary/70 px-3.5 py-1.5 font-archivo text-xs font-medium text-foreground shadow-sm backdrop-blur-[20px]">
            <span className="truncate">{FAKE_COMPONENT.title}</span>
            <span className="text-muted-foreground">
              {FAKE_COMPONENT.category}
            </span>
          </div>

          <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-20">
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

          <div className="absolute right-5 top-5 z-20 flex items-center gap-2">
            <InstallBar />
            <PageActionsCluster onGetCode={() => setCodeOpen(true)} />
          </div>

          {EXAMPLES.length > 1 ? (
            <nav
              aria-label="Example navigation"
              className="absolute inset-x-0 bottom-6 z-20 mx-auto flex w-fit items-center gap-2 rounded-full border border-border/60 bg-my-primary/70 px-2 py-1.5 shadow-sm backdrop-blur"
            >
              <button
                type="button"
                onClick={() =>
                  setExampleIndex(
                    (index) => (index - 1 + EXAMPLES.length) % EXAMPLES.length,
                  )
                }
                disabled={EXAMPLES.length < 2}
                aria-label={`Previous example: ${previous.title}`}
                title="Previous example (←)"
                className="inline-flex h-9 shrink-0 items-center justify-center rounded-full bg-my-bg px-4 text-foreground transition hover:bg-my-bg/70 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-40"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
              </button>

              <div className="flex min-w-0 items-center gap-2 px-2">
                <span className="truncate font-archivo text-xs font-medium">
                  {example.name}
                </span>
                <span className="font-archivo text-[11px] text-muted-foreground">
                  {exampleIndex + 1}/{EXAMPLES.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setExampleIndex((index) => (index + 1) % EXAMPLES.length)
                }
                disabled={EXAMPLES.length < 2}
                aria-label="Next example"
                title="Next example (→)"
                className="inline-flex h-9 shrink-0 items-center justify-center rounded-full bg-foreground px-4 text-background transition hover:bg-foreground/85 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-40"
              >
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </nav>
          ) : null}
        </div>
      </section>

      {/* Reserved spot for the article text (built later) */}
      <section className="mx-auto w-full max-w-[610px] px-6 pb-8 pt-20">
        <h2 className="text-xl font-medium">{FAKE_COMPONENT.title}</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Reserved block — the component article (description, usage notes,
          props) lands here later. Until then the page is the stage above.
        </p>
      </section>

      {/* Related components, max 3 */}
      <section className="mx-auto w-full max-w-[1100px] px-6 pb-24">
        <h2 className="text-xl font-medium">Related components</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RELATED.map((component) => (
            <RelatedCard key={component.title} component={component} />
          ))}
        </div>
      </section>

      <CodeSheet
        open={codeOpen}
        onOpenChange={setCodeOpen}
        title={FAKE_COMPONENT.title}
        description={FAKE_COMPONENT.description}
        exampleSource={example.source}
        sourceCode={SOURCE_CODE}
      />
    </main>
  );
}