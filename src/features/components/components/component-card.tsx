"use client";

import { useReducedMotion } from "motion/react";
import Link from "next/link";
import { useRef } from "react";

/**
 * One catalog tile: the component's own media, and nothing else.
 *
 * The poster is always rendered; a component that ships a clip plays it while
 * the tile is hovered or focused, and never under `prefers-reduced-motion`.
 * The whole tile is one link to the docs page.
 */

export type ComponentCardData = {
  slug: string;
  title: string;
  href: string;
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
      className="group relative min-w-0"
      onPointerEnter={play}
      onPointerLeave={stop}
      onFocus={play}
      onBlur={stop}
    >
      <div className="overflow-hidden rounded-2xl bg-neutral-200/70 p-2 transition-colors dark:bg-muted">
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
              className="aspect-video w-full rounded-lg bg-background object-cover"
            />
          ) : (
            // biome-ignore lint/performance/noImgElement: catalog media is a static asset, not an optimizable remote image.
            <img
              src={poster}
              alt=""
              loading="lazy"
              className="aspect-video w-full rounded-lg bg-background object-cover"
            />
          )
        ) : (
          <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-background">
            <span className="font-heading text-3xl font-semibold text-muted-foreground/50">
              {component.title.trim().charAt(0).toUpperCase() || "?"}
            </span>
          </div>
        )}
      </div>

      <Link
        href={component.href}
        className="absolute inset-0 rounded-2xl focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <span className="sr-only">View {component.title}</span>
      </Link>
    </article>
  );
}
