"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export type FolderPreviewProps = {
  /** The image the folder reveals. */
  image: { src: string; alt?: string };
  /** Caption under the folder. */
  label?: string;
  /** Extra classes for the outer wrapper. */
  className?: string;
};

/**
 * A folder tile that lifts its cover to reveal the image inside.
 *
 * Hover, focus, and click all open it; leaving or blurring closes it again.
 * The lift is skipped entirely under `prefers-reduced-motion`.
 */
export default function FolderPreview({
  image,
  label = "Folder",
  className,
}: FolderPreviewProps) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const lifted = open && !reduceMotion;

  return (
    <div
      className={cn(
        "flex w-full max-w-[320px] flex-col items-center gap-5",
        className,
      )}
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        aria-expanded={open}
        aria-label={`${open ? "Close" : "Open"} ${label}`}
        className="relative block aspect-4/3 w-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-4"
      >
        {/* Back panel and its tab: the part that stays put. */}
        <div className="absolute inset-x-0 top-5 bottom-0 rounded-2xl bg-amber-200/90 shadow-[0_24px_60px_-30px_rgba(120,53,15,0.6)] dark:bg-amber-300/70">
          <span className="absolute -top-5 left-6 h-6 w-24 rounded-t-xl bg-amber-200/90 dark:bg-amber-300/70" />
        </div>

        {/* The image, hidden behind the flap until the folder opens. */}
        <motion.div
          className="absolute inset-x-5 bottom-9 overflow-hidden rounded-lg bg-background shadow-lg ring-1 ring-black/5"
          animate={{
            y: lifted ? -52 : 0,
            rotate: lifted ? -1.5 : 0,
            scale: lifted ? 1.02 : 1,
          }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
          {/* biome-ignore lint/performance/noImgElement: an installable component cannot assume next/image. */}
          <img
            src={image.src}
            alt={image.alt ?? ""}
            className="aspect-16/10 w-full object-cover"
          />
        </motion.div>

        {/* Front flap: tilts back on its bottom edge to uncover the image. */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-[62%] origin-bottom rounded-t-lg rounded-b-2xl bg-linear-to-b from-amber-300 to-amber-400 shadow-[0_-8px_20px_-12px_rgba(120,53,15,0.5)]"
          style={{ transformPerspective: 800 }}
          animate={{ rotateX: lifted ? 34 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
        >
          <span className="absolute inset-x-5 top-4 h-px bg-white/40" />
        </motion.div>
      </button>

      <span className="font-archivo text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
        {label}
      </span>
    </div>
  );
}
