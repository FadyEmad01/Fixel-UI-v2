"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { resourceHost } from "../lib/url";

/**
 * A curated site's preview image with its Plaiceholder blur underneath.
 *
 * The source is an arbitrary remote host, so `next/image` would need a
 * per-host `remotePatterns` allowlist. A plain `<img>` with the stored LQIP as
 * a blurred CSS background gives the same blur-up without that config, and the
 * placeholder itself is generated at sync time rather than at request time.
 */
export function ResourceImage({
  image,
  blurDataUrl,
  name,
  icon,
  url,
  alt = "",
  loading = "lazy",
  className,
}: {
  image: string | null;
  blurDataUrl: string | null;
  /** Used by the letter tile when there is no usable image. */
  name: string;
  icon: string | null;
  url: string;
  alt?: string;
  loading?: "eager" | "lazy";
  className?: string;
}) {
  const [state, setState] = React.useState({
    image,
    failed: false,
    loaded: false,
  });

  // The same component position can be reused for another resource before its
  // image settles, so start over when the source changes.
  if (state.image !== image) {
    setState({ image, failed: false, loaded: false });
  }

  // Server-rendered markup starts hidden, and a cached image can finish before
  // hydration attaches `onLoad` — settle those on ref instead of staying at 0.
  const imgRef = React.useCallback((node: HTMLImageElement | null) => {
    if (!node?.complete) return;
    const loaded = node.naturalWidth > 0;
    setState((current) =>
      current.loaded === loaded && current.failed === !loaded
        ? current
        : { ...current, loaded, failed: !loaded },
    );
  }, []);

  if (!image || state.failed) {
    return (
      <ResourceFallback
        key={`${icon ?? ""}|${url}`}
        name={name}
        icon={icon}
        url={url}
      />
    );
  }

  // Without a blur there is nothing to reveal, so skip the fade instead of
  // showing an empty box until the image decodes.
  const fading = Boolean(blurDataUrl);

  return (
    <span className={cn("relative block size-full overflow-hidden", className)}>
      {blurDataUrl ? (
        <span
          aria-hidden="true"
          className="absolute inset-0 scale-110 bg-cover bg-center blur-2xl"
          style={{ backgroundImage: `url("${blurDataUrl}")` }}
        />
      ) : null}

      {/* biome-ignore lint/performance/noImgElement: preview images come from arbitrary curated hosts. */}
      <img
        ref={imgRef}
        src={image}
        alt={alt}
        loading={loading}
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setState((current) => ({ ...current, loaded: true }))}
        onError={() => setState((current) => ({ ...current, failed: true }))}
        className={cn(
          "relative size-full object-cover",
          fading &&
            "transition-opacity duration-500 ease-out motion-reduce:transition-none",
          fading && !state.loaded ? "opacity-0" : "opacity-100",
        )}
      />
    </span>
  );
}

/** Site favicon, then a quiet letter tile when no preview image is usable. */
export function ResourceFallback({
  name,
  icon,
  url,
}: {
  name: string;
  icon: string | null;
  url: string;
}) {
  const host = resourceHost(url);
  const [mode, setMode] = React.useState<"icon" | "google" | "initial">(() =>
    icon ? "icon" : host ? "google" : "initial",
  );

  return (
    <div className="flex size-full items-center justify-center bg-gradient-to-br from-muted to-muted/40">
      {mode === "initial" ? (
        <span
          aria-hidden="true"
          className="font-heading text-3xl font-semibold text-muted-foreground/50"
        >
          {name.trim().charAt(0).toUpperCase() || "?"}
        </span>
      ) : (
        // biome-ignore lint/performance/noImgElement: favicons come from arbitrary curated hosts.
        <img
          src={
            mode === "icon" && icon
              ? icon
              : `https://www.google.com/s2/favicons?domain=${host}&sz=32`
          }
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="size-8 rounded-md object-contain"
          onError={() =>
            setMode(mode === "icon" && host ? "google" : "initial")
          }
        />
      )}
    </div>
  );
}
