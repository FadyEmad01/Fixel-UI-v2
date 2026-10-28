"use client";

import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlockShell } from "@/shared/components/code-block";
import { CopyButton } from "@/shared/components/code-block/copy-button";
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

type AnimationType = "translate" | "scale" | "rotate";

function useAnimationKey(duration: number, pauseDuration: number) {
  const [key, setKey] = React.useState(0);

  React.useEffect(() => {
    if (duration <= 0) return;
    const timer = setInterval(
      () => {
        setKey((prevKey) => prevKey + 1);
      },
      (duration + pauseDuration) * 1000,
    );

    return () => clearInterval(timer);
  }, [duration, pauseDuration]);

  return [key, setKey] as const;
}

function AnimatedSquare({
  points,
  duration,
  animationType,
  pauseDuration,
}: {
  points: [number, number, number, number];
  duration: number;
  animationType: AnimationType;
  pauseDuration: number;
}) {
  const [key] = useAnimationKey(duration, pauseDuration);

  const getAnimationStyle = () => {
    if (duration <= 0) return {};

    const baseStyle = {
      ["--bezier-coordinates" as string]: points.join(","),
      ["--animation-duration" as string]: `${duration}s`,
      ["--total-duration" as string]: `${duration + pauseDuration}s`,
    };

    const animationName = {
      rotate: "rotateSquare",
      scale: "scaleSquare",
      translate: "translateSquare",
    }[animationType];

    return {
      ...baseStyle,
      animationDelay: "0s",
      animationDuration: `${duration}s`,
      animationFillMode: "forwards",
      animationIterationCount: "1",
      animationName,
      animationTimingFunction: `cubic-bezier(${points.join(",")})`,
    };
  };

  const animationStyle = getAnimationStyle();

  return (
    <div
      className={`pointer-events-none flex w-full items-center ${animationType === "translate" ? "justify-start" : "justify-center"}`}
      key={`${key}-${duration}-${pauseDuration}-${animationType}`}
      style={animationType === "translate" ? animationStyle : undefined}
    >
      <div
        className="animated-square h-10 w-10 rounded-md bg-linear-to-tr from-primary to-primary/80 shadow-lg shadow-primary/10"
        style={animationType !== "translate" ? animationStyle : undefined}
      />
      <style jsx>{`
        @keyframes translateSquare {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(100% - 2.5rem));
          }
        }
        @keyframes scaleSquare {
          0% {
            transform: scale(0);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes rotateSquare {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
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
  const [animationType, setAnimationType] =
    React.useState<AnimationType>("translate");
  const pauseDuration = 1000;

  if (easing.slug !== lastSlug) {
    setLastSlug(easing.slug);
    setSelectedSlug(easing.slug);
  }

  const currentEasing =
    items.find((item) => item.slug === selectedSlug) ?? easing;
  const currentIndex = items.findIndex((item) => item.slug === selectedSlug);
  const activePosition = currentIndex < 0 ? 0 : currentIndex;

  const navigateBy = React.useCallback(
    (direction: -1 | 1) => {
      if (items.length < 2) return;
      const idx = Math.max(
        0,
        items.findIndex((item) => item.slug === selectedSlug),
      );
      const next = items[(idx + direction + items.length) % items.length];
      if (next) {
        setSelectedSlug(next.slug);
        window.history.replaceState(null, "", `/easing/${next.slug}`);
      }
    },
    [items, selectedSlug],
  );

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
      navigateBy(event.key === "ArrowLeft" ? -1 : 1);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items.length, navigateBy]);

  const dotStart = Math.max(
    0,
    Math.min(
      activePosition - Math.floor(DOT_WINDOW / 2),
      items.length - DOT_WINDOW,
    ),
  );
  const dots = items.slice(dotStart, dotStart + DOT_WINDOW);

  const [_key, setKey] = useAnimationKey(duration / 1000, pauseDuration / 1000);

  const cssCode = cssEaseCode(currentEasing.points);
  const motionCode = motionEaseCode(currentEasing.points);
  const gsapCode = gsapEaseCode(currentEasing.points);
  const rawCode = rawEaseCode(currentEasing.points);

  const handleSliderChangeEnd = (value: number[]) => {
    setDuration(value[0]);
  };

  const handleSliderChange = (value: number[]) => {
    setTempDuration(value[0]);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(event.target.value, 10);
    if (!Number.isNaN(value) && value >= 0 && value <= 5000) {
      setTempDuration(value);
    }
  };

  const handleInputBlur = () => {
    if (tempDuration >= 0 && tempDuration <= 5000) {
      setDuration(tempDuration);
    } else {
      setTempDuration(duration);
    }
  };

  return (
    <main className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background">
      <h1 className="sr-only">{currentEasing.name}</h1>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(var(--color-foreground)_1px,transparent_1px)] [background-size:18px_18px]"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10 sm:px-12">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="font-heading text-4xl font-semibold tracking-tight lg:text-5xl">
              {currentEasing.name}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {currentEasing.description}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {cubicBezierString(currentEasing.points)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-sm">Duration</span>
              <div className="flex items-center gap-3">
                <input
                  aria-label="Duration"
                  type="range"
                  min={0}
                  max={5000}
                  step={1}
                  value={tempDuration}
                  onChange={(e) => handleSliderChange([Number(e.target.value)])}
                  onMouseUp={() => handleSliderChangeEnd([tempDuration])}
                  onTouchEnd={() => handleSliderChangeEnd([tempDuration])}
                  className="w-[180px]"
                />
                <input
                  aria-label="Duration in milliseconds"
                  type="number"
                  className="w-[90px] rounded-md border px-2 py-1"
                  min={0}
                  max={5000}
                  value={tempDuration}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                />
                <span className="text-sm text-muted-foreground">ms</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm">Preview</span>
              <select
                value={animationType}
                onChange={(e) =>
                  setAnimationType(e.target.value as AnimationType)
                }
                className="h-9 rounded-md border px-3"
              >
                <option value="translate">Translate</option>
                <option value="scale">Scale</option>
                <option value="rotate">Rotate</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() => setKey((k) => k + 1)}
              className="mt-6 inline-flex items-center gap-2 rounded-md border px-3 py-2"
            >
              <RotateCcw className="size-4" />
              Replay
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border bg-card p-6">
            <div className="mb-4 text-sm font-medium">Easing Graph</div>
            <div className="flex h-[320px] items-center justify-center">
              <EasingCurveSvg
                points={currentEasing.points}
                animate
                showGrid
                width={280}
                height={280}
                duration={duration / 1000}
                pauseDuration={pauseDuration / 1000}
              />
            </div>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <div className="mb-4 text-sm font-medium">Animation Preview</div>
            <div className="flex h-[320px] w-full items-center justify-center">
              <div className="w-full max-w-md">
                <AnimatedSquare
                  points={currentEasing.points}
                  duration={duration / 1000}
                  animationType={animationType}
                  pauseDuration={pauseDuration / 1000}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="mb-4 text-sm font-medium">Code</div>
          <Tabs defaultValue="css">
            <TabsList>
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="motion">Motion</TabsTrigger>
              <TabsTrigger value="gsap">GSAP</TabsTrigger>
              <TabsTrigger value="raw">Raw</TabsTrigger>
            </TabsList>
            <TabsContent value="css" className="relative mt-4">
              <CodeBlockShell html={null} code={cssCode} allowCopy={false} />
              <div className="absolute top-2 right-2">
                <CopyButton getText={() => cssCode} />
              </div>
            </TabsContent>
            <TabsContent value="motion" className="relative mt-4">
              <CodeBlockShell html={null} code={motionCode} allowCopy={false} />
              <div className="absolute top-2 right-2">
                <CopyButton getText={() => motionCode} />
              </div>
            </TabsContent>
            <TabsContent value="gsap" className="relative mt-4">
              <CodeBlockShell html={null} code={gsapCode} allowCopy={false} />
              <div className="absolute top-2 right-2">
                <CopyButton getText={() => gsapCode} />
              </div>
            </TabsContent>
            <TabsContent value="raw" className="relative mt-4">
              <CodeBlockShell html={null} code={rawCode} allowCopy={false} />
              <div className="absolute top-2 right-2">
                <CopyButton getText={() => rawCode} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {items.length > 1 && (
        <nav
          aria-label="Easing navigation"
          className="relative mx-auto mb-6 flex items-center justify-between gap-3 rounded-full border border-border/60 bg-my-primary/70 px-2 py-1.5 shadow-sm backdrop-blur"
        >
          <button
            type="button"
            onClick={() => navigateBy(-1)}
            aria-label="Previous easing"
            className="inline-flex h-9 items-center justify-center rounded-full bg-my-bg px-7"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
          </button>
          <div className="flex items-center">
            {dots.map((item, offset) => {
              const index = dotStart + offset;
              const active = index === activePosition;
              return (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => {
                    setSelectedSlug(item.slug);
                    window.history.replaceState(
                      null,
                      "",
                      `/easing/${item.slug}`,
                    );
                  }}
                  aria-label={`Show easing ${index + 1}`}
                  aria-current={active ? "true" : undefined}
                  className="group flex size-5 items-center justify-center"
                >
                  <span
                    className={[
                      "size-1.5 rounded-full transition-all",
                      active ? "scale-125 bg-foreground" : "bg-foreground/20",
                    ].join(" ")}
                  />
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => navigateBy(1)}
            aria-label="Next easing"
            className="inline-flex h-9 items-center justify-center rounded-full bg-foreground px-7 text-background"
          >
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </nav>
      )}
    </main>
  );
}
