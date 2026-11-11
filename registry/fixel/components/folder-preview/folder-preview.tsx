"use client";

import { motion, type Transition } from "motion/react";
import { type CSSProperties, useId } from "react";

const SVG_WIDTH = 940;
const SVG_HEIGHT = 790;

const DEFAULT_TRANSITION: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 20,
};

const DEFAULT_COLORS = {
  back: {
    from: "#57ADDB",
    to: "#098DD6",
  },
  front: {
    from: "#73D7FF",
    to: "#6BCBF3",
  },
  frame: "#FFFFFF",
  highlight: "#FFFFFF",
  highlightOpacity: 0.1,
  label: "#4B5563",
};

const DEFAULT_IMAGE_PANEL = {
  width: "95%",
  height: "55%",
  borderWidth: 4,
  borderRadius: 8,
  initialY: "10%",
  hoverY: "-80%",
  initialScale: 0.8,
  hoverScale: 0.9,
};

const DEFAULT_ANIMATION = {
  enabled: true,
  hoverScale: 1.05,
  transition: DEFAULT_TRANSITION,
};

type GradientColors = {
  from?: string;
  to?: string;
};

export type FolderPreviewProps = {
  image: {
    src: string;
    alt?: string;
  };

  label?: string;
  showLabel?: boolean;

  width?: CSSProperties["width"];

  colors?: {
    back?: GradientColors;
    front?: GradientColors;
    frame?: string;
    highlight?: string;
    highlightOpacity?: number;
    label?: string;
  };

  imagePanel?: {
    width?: CSSProperties["width"];
    height?: CSSProperties["height"];
    borderWidth?: number;
    borderRadius?: CSSProperties["borderRadius"];
    initialY?: string | number;
    hoverY?: string | number;
    initialScale?: number;
    hoverScale?: number;
  };

  animation?: {
    enabled?: boolean;
    hoverScale?: number;
    transition?: Transition;
  };

  className?: string;
  imageClassName?: string;
  labelClassName?: string;
};

export default function FolderPreview({
  image,
  label = "Portfolio 2024",
  showLabel = true,
  width = 320,
  colors,
  imagePanel,
  animation,
  className = "",
  imageClassName = "",
  labelClassName = "",
}: FolderPreviewProps) {
  // Unique IDs prevent SVG gradient collisions when multiple instances render.
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  const backGradientId = `${id}-back-gradient`;
  const frontGradientId = `${id}-front-gradient`;

  const resolvedColors = {
    back: {
      ...DEFAULT_COLORS.back,
      ...colors?.back,
    },
    front: {
      ...DEFAULT_COLORS.front,
      ...colors?.front,
    },
    frame: colors?.frame ?? DEFAULT_COLORS.frame,
    highlight: colors?.highlight ?? DEFAULT_COLORS.highlight,
    highlightOpacity:
      colors?.highlightOpacity ?? DEFAULT_COLORS.highlightOpacity,
    label: colors?.label ?? DEFAULT_COLORS.label,
  };

  const panel = {
    ...DEFAULT_IMAGE_PANEL,
    ...imagePanel,
  };

  const motionConfig = {
    ...DEFAULT_ANIMATION,
    ...animation,
  };

  return (
    <motion.div
      className={`inline-flex flex-col items-center gap-4 ${className}`}
      initial="initial"
      whileHover={motionConfig.enabled ? "hover" : undefined}
    >
      {/* Folder */}
      <motion.div
        className="relative shrink-0"
        style={{
          width,
          aspectRatio: `${SVG_WIDTH} / ${SVG_HEIGHT}`,
        }}
        variants={{
          initial: { scale: 1 },
          hover: { scale: motionConfig.hoverScale },
        }}
        transition={motionConfig.transition}
      >
        {/* Back shape */}
        <svg
          className="absolute inset-0 z-0 h-full w-full"
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id={backGradientId}
              x1="470"
              y1="0"
              x2="470"
              y2="838"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={resolvedColors.back.from} />
              <stop offset="0.229272" stopColor={resolvedColors.back.to} />
            </linearGradient>
          </defs>

          <path
            d="M115.2 790H824.8C865.124 790 885.286 790 900.687 782.152C914.235 775.25 925.25 764.235 932.152 750.687C940 735.286 940 715.124 940 674.8V189.2C940 148.876 940 128.714 932.152 113.313C925.25 99.765 914.235 88.7504 900.687 81.8475C885.286 74 865.124 74 824.8 74H435.5C414 74 386.5 72 359.5 51.5C332.5 31 355.5 48.5 327 26.5C298.5 4.5 283.966 0 259 0H115.2C74.8762 0 54.7143 3.33786e-06 39.3127 7.84753C25.765 14.7504 14.7504 25.765 7.84753 39.3127C0 54.7143 0 74.8762 0 115.2V674.8C0 715.124 0 735.286 7.84753 750.687C14.7504 764.235 25.765 775.25 39.3127 782.152C54.7143 790 74.8762 790 115.2 790Z"
            fill={`url(#${backGradientId})`}
          />
        </svg>

        {/* Preview image */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 top-0 z-10 overflow-hidden shadow-xl"
          style={{
            width: panel.width,
            height: panel.height,
            borderWidth: panel.borderWidth,
            borderStyle: "solid",
            borderColor: resolvedColors.frame,
            borderRadius: panel.borderRadius,
          }}
          variants={{
            initial: {
              y: panel.initialY,
              opacity: 1,
              scale: panel.initialScale,
            },
            hover: {
              y: panel.hoverY,
              opacity: 1,
              scale: panel.hoverScale,
            },
          }}
          transition={motionConfig.transition}
        >
          {/* biome-ignore lint/performance/noImgElement: an installable component cannot assume next/image. */}
          <img
            src={image.src}
            alt={image.alt ?? ""}
            className={`h-full w-full object-cover ${imageClassName}`}
            draggable={false}
            loading="lazy"
            decoding="async"
          />
        </motion.div>

        {/* Front shape */}
        <svg
          className="pointer-events-none absolute inset-0 z-20 h-full w-full"
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id={frontGradientId}
              x1="470"
              y1="134"
              x2="470"
              y2="790"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={resolvedColors.front.from} />
              <stop offset="1" stopColor={resolvedColors.front.to} />
            </linearGradient>
          </defs>

          <rect
            y="134"
            width="940"
            height="656"
            rx="72"
            fill={`url(#${frontGradientId})`}
          />

          <rect
            y="692"
            width="940"
            height="18"
            fill={resolvedColors.highlight}
            fillOpacity={resolvedColors.highlightOpacity}
          />

          <rect
            y="729"
            width="940"
            height="18"
            fill={resolvedColors.highlight}
            fillOpacity={resolvedColors.highlightOpacity}
          />
        </svg>
      </motion.div>

      {/* Label */}
      {showLabel && label && (
        <motion.div
          className={`w-full text-center ${labelClassName}`}
          style={{ color: resolvedColors.label }}
          variants={{
            initial: { opacity: 0.6, y: 0 },
            hover: { opacity: 1, y: 5 },
          }}
          transition={motionConfig.transition}
        >
          <span className="text-lg font-bold tracking-wide uppercase">
            {label}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
