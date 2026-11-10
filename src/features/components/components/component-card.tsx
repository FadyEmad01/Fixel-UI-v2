"use client";

import { useReducedMotion } from "motion/react";
import Link from "next/link";
import { useRef } from "react";

/**
 * One catalog tile: the component's media, its category, and the title and
 * description that make the grid scannable.
 *
 * The poster is always rendered; a component that ships a clip plays it while
 * the tile is hovered or focused, and never under `prefers-reduced-motion`.
 * The whole tile is one link to the docs page.
 */

export type ComponentCardData = {
  slug: string;
  title: string;
  description: string;
  href: string;
  category: string;
  media: { poster: string; video?: string } | null;
};

export function ComponentCard({ component }: { component: ComponentCardData }) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const video = component.media?.video;
  const poster = component.media?.poster;
  const canPlay = Boolean(video) && !reduceMotion;

  function play() {
    const node = videoRef.current;
    if (!canPlay || !node) return;

    node.currentTime = 0;
    // Autoplay can be refused (battery saver, browser policy); the poster stays.
    void node.play().catch(() => {});
  }

  function stop() {
    const node = videoRef.current;
    if (!node) return;

    node.pause();
    node.currentTime = 0;
  }

  return (
    <article
      className="group relative min-w-0 rounded-xl"
      onPointerEnter={play}
      onPointerLeave={stop}
      onFocus={play}
      onBlur={stop}
    >
      <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg bg-muted">
        {poster ? (
          video ? (
            <video
              ref={videoRef}
              src={video}
              poster={poster}
              muted
              loop
              playsInline
              preload="none"
              className="h-full w-full scale-[1.03] object-cover transition-transform duration-300 ease-out"
            />
          ) : (
            // biome-ignore lint/performance/noImgElement: catalog media is a static asset, not an optimizable remote image.
            <img
              src={poster}
              alt=""
              loading="lazy"
              className="h-full w-full scale-[1.03] object-cover transition-transform duration-300 ease-out"
            />
          )
        ) : (
          <span
            aria-hidden="true"
            className="font-heading text-3xl font-semibold text-muted-foreground/50"
          >
            {component.title.trim().charAt(0).toUpperCase() || "?"}
          </span>
        )}

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
        href={component.href}
        className="absolute inset-0 z-0 rounded-xl focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <span className="sr-only">View {component.title}</span>
      </Link>
    </article>
  );
}
