"use client";

import { Button } from "@/components/ui/button";
// import { CodeBlock } from "@/components/code/code-block";
import { Copy, Eye, Layers } from "lucide-react";
import { useInView } from "motion/react";
import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";

// -----------------------------------------------------------------------------
// Page content: edit these arrays to update the navigation and method lists.
// -----------------------------------------------------------------------------

type NavigationItem = {
  label: string;
  href: string;
  active?: boolean;
};

const navigationItems: NavigationItem[] = [
  {
    label: "Gravity Mouse Trail",
    href: "#anchor1",
    active: true,
  },
  { label: "HTML Structure", href: "#anchor1" },
  { label: "Some CSS", href: "#anchor2" },
  { label: "Starting the animation", href: "#anchor3" },
  { label: "Triggering image creation", href: "#anchor4" },
  { label: "Inside createMedia()", href: "#anchor5" },
  { label: "Going further", href: "#anchor6" },
  { label: "Final code", href: "#anchor7" },
];

type MethodGroupData = {
  title: string;
  methods: string[];
};

const methodGroups: MethodGroupData[] = [
  {
    title: "Key JS Methods",
    methods: [
      "Array.prototype.forEach()",
      "Math.random()",
      "getBoundingClientRect()",
    ],
  },
  {
    title: "Key GSAP Methods",
    methods: ["gsap.fromTo()", "gsap.timeline()"],
  },
];

const codeSnippets = {
  html: `<section class="mwg_free_effect002">
    <div class="medias">
        <img src="./assets/medias/01.png" alt="">
        <img src="./assets/medias/02.png" alt="">
    </div>
</section>`,
  css: `.mwg_free_effect002 .medias img {
    width: 1px;
    height: 1px;
    visibility: hidden;
}`,
};

// -----------------------------------------------------------------------------
// Reusable icons
// -----------------------------------------------------------------------------

export function CopyIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

export function EyeIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}

export function InfoIcon() {
  return (
    <svg
      fill="none"
      height="16"
      viewBox="0 0 14 14"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="m6.61719 9.01914v-2.4m0-2.4h.006m5.99401 2.4c0 3.31371-2.6863 5.99996-6.00001 5.99996s-6.000002-2.68625-6.000002-5.99996 2.686292-5.999999 6.000002-5.999999 6.00001 2.686289 6.00001 5.999999z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// Reusable layout components
// -----------------------------------------------------------------------------

type PageLayoutProps = {
  leftSidebar: ReactNode;
  rightSidebar: ReactNode;
  children: ReactNode;
};

export function PageLayout({ leftSidebar, rightSidebar, children }: PageLayoutProps) {
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

export function TableOfContents() {
  return (
    <aside className="hidden lg:block w-[250px] shrink-0">
      <div className="sticky top-10 flex flex-col gap-6 justify-end h-[calc(100vh-80px)]">
        {/* Replace this placeholder with the real logo when available. */}
        <div className="size-8 bg-neutral-200/70 rounded-md flex items-center justify-center text-xs">
          <Layers size={16} />
        </div>

        <nav aria-label="Table of contents">
          <ul className="flex flex-col gap-3 text-sm text-[#999]">
            {navigationItems.map((item) => (
              <li key={`${item.href}-${item.label}`}>
                <a
                  href={item.href}
                  className={
                    item.active
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
  videoSrc: string;
};

export function HeroSection({ title, description, videoSrc }: HeroSectionProps) {
  const textRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(textRef, {
    once: false,
    amount: 0.5,
  });

  return (
    <section className="relative flex flex-col gap-4 mb-12">
      <h1
        ref={textRef}
        className={`leading-[1.15] font-heading text-3xl lg:text-4xl font-medium tracking-tight chroma-text chroma-text-animate ${isInView ? "chroma-text-animate-once" : ""
          }`}
      >
        {title}
      </h1>

      <p className="text-[#999] text-sm md:text-base max-w-md">{description}</p>

      <div className="h-full w-full p-2 rounded-2xl bg-neutral-200/70">
        <video
          src={videoSrc}
          aria-label="preview"
          muted
          loop
          playsInline
          autoPlay
          className="h-full w-full rounded-lg aspect-video"
        />
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


type ActionButtonVariant = "dark" | "light" | "icon";

type ActionButtonProps = {
  variant: ActionButtonVariant;
  label?: string;
  icon: ReactNode;
  trailing?: ReactNode;
  ariaLabel?: string;
};

const actionButtonClasses: Record<ActionButtonVariant, string> = {
  dark: "w-full bg-[#232323] hover:bg-[#323232] text-white py-4 rounded-xl flex items-center justify-between px-6 transition-colors border border-[#323232]",
  light:
    "flex-1 bg-white hover:bg-gray-200 text-black py-4 rounded-xl flex items-center justify-between px-6 transition-colors font-medium",
  icon: "w-14 bg-[#232323] border border-[#323232] rounded-xl flex items-center justify-center hover:bg-[#323232] transition-colors",
};


export function SidebarActions() {
  return (
    <div className=" flex flex-col gap-3">
      <Button asChild className="bg-my-secondary text-sm font-medium text-white hover:bg-my-secondary/85 rounded-full h-11">
        <Link href="/preview/ui/apple-folder" target="_blank" rel="noopener noreferrer">
          <Eye />
          Live Preview
        </Link>
      </Button>
    </div>
  );
}

export function MethodsSidebar() {
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
              <span className="text-[12px] text-muted-foreground">Published</span>
              <span className="text-[12px] text-muted-foreground font-medium">August 5, 2026</span>
            </div>
            {/* the type of the resource like UI / Component / block / etc */}
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-muted-foreground">Category</span>
              <span className="text-[12px] text-muted-foreground font-medium">UI</span>
            </div>
          </div>
          {/* component tags */}
          <div>
            <div className="flex flex-wrap gap-1 mt-2">
              <span className="rounded-sm dark:bg-muted bg-muted text-muted-foreground px-1.5 py-0.5 text-[12px] font-archivo font-medium capitalize text-muted-foreground">Mouse Trail</span>
              <span className="rounded-sm dark:bg-muted bg-muted text-muted-foreground px-1.5 py-0.5 text-[12px] font-archivo font-medium capitalize text-muted-foreground">Animation</span>
              <span className="rounded-sm dark:bg-muted bg-muted text-muted-foreground px-1.5 py-0.5 text-[12px] font-archivo font-medium capitalize text-muted-foreground">GSAP</span>
            </div>
          </div>
        </div>

        {/* shrink-0 keeps the buttons from being squeezed */}
        <div className="shrink-0">
          <SidebarActions />
        </div>
      </div>
    </aside>
  );
}