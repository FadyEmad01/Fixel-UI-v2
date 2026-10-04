"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { getCatalogItemHref } from "@/lib/catalog/routes";
import type { CatalogItem } from "@/types/catalog";

interface CollectionCardProps {
  item: CatalogItem;
}

export function CollectionCard({ item }: CollectionCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (item.preview.renderer !== "video") {
      return;
    }

    const video = videoRef.current;

    if (!video) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          video.play().catch((error) => {
            if (error?.name !== "AbortError") {
              console.debug("Video play failed:", error);
            }
          });
        } else {
          video.pause();
        }
      },
      {
        threshold: 0.3,
      },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [item.preview.renderer]);

  const href = getCatalogItemHref(item);

  const firstTag = item.tags[0];
  const remainingTags = Math.max(item.tags.length - 1, 0);

  return (
    <Link href={href} className="group block min-w-0">
      <article className="relative rounded-xl bg-[#f8f8f7] p-[5%] transition-colors">
        <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
          <CollectionCardPreview item={item} videoRef={videoRef} />
        </div>

        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="line-clamp-1 text-sm font-medium text-foreground">
              {item.title}
            </p>

            {item.description ? (
              <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
                {item.description}
              </p>
            ) : null}
          </div>

          {firstTag ? (
            <div className="flex shrink-0 items-center gap-1 font-heading">
              <span className="rounded-sm bg-neutral-200/70 px-1.5 py-0.5 text-[10px] font-medium capitalize text-muted-foreground">
                {firstTag}
              </span>

              {remainingTags > 0 ? (
                <span className="rounded-sm bg-neutral-200/70 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  +{remainingTags}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </article>
    </Link>
  );
}

interface CollectionCardPreviewProps {
  item: CatalogItem;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

function CollectionCardPreview({ item, videoRef }: CollectionCardPreviewProps) {
  switch (item.preview.renderer) {
    case "image":
      return (
        <Image
          src={item.preview.src}
          alt={item.preview.alt}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />
      );

    case "video":
      return (
        <video
          ref={videoRef}
          src={item.preview.src}
          poster={item.preview.poster}
          muted
          loop
          playsInline
          preload={item.preview.poster ? "none" : "metadata"}
          className="h-full w-full object-cover transition-transform duration-500 ease-out"
        />
      );

    default:
      return (
        <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
          Preview unavailable
        </div>
      );
  }
}
