"use client";

import type { ReactNode } from "react";
import { useId } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const ease = [0.76, 0, 0.24, 1] as const;

const bottomWallPath =
  "M134.447 55C134.447 56.5621 133.35 57.9763 131.577 59L76.1514 91C72.325 93.2091 66.1213 93.2091 62.2949 91L6.86914 59C5.09658 57.9764 4 56.5618 4 55V40C4 41.4644 4.96359 42.7991 6.54492 43.8037L6.87012 44L62.2949 76C66.1213 78.2091 72.325 78.2091 76.1514 76L131.577 44C133.35 42.9763 134.447 41.5621 134.447 40V55Z";

export interface IsometricBoxProps {
  children?: ReactNode;
  className?: string;
  boxClassName?: string;
  topFaceClassName?: string;
}

export function IsometricBox({
  children,
  className = "",
  boxClassName = "text-neutral-400 dark:text-neutral-600",
  topFaceClassName = "fill-neutral-100 dark:fill-neutral-800",
}: IsometricBoxProps) {
  const gradientId = `isometric-bottom-wall-${useId().replace(/:/g, "")}`;

  return (
    <motion.div
      className={cn("group relative h-[93px] w-[139px]", className)}
      initial="initial"
      whileHover="hover"
      transition={{ duration: 0.35, ease }}
      variants={{
        initial: { y: 0 },
        hover: { y: -10 },
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
        style={{
          transform: "rotateX(60deg) rotateZ(45deg) translateZ(5px)",
          transformStyle: "preserve-3d",
        }}
      >
        <div className="flex items-center justify-center">{children}</div>
      </div>

      <svg
        width="139"
        height="93"
        viewBox="0 0 139 93"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 z-10 overflow-visible"
        aria-hidden="true"
      >
        <path
          d="M63.3294 5.24609C66.6775 3.3131 72.1057 3.3131 75.4538 5.24609L130.459 37.0032C133.089 38.522 133.089 40.9844 130.459 42.5032L76.3198 73.7603C72.4935 75.9694 66.2897 75.9694 62.4634 73.7603L7.89154 42.2532C5.50007 40.8725 5.50007 38.6339 7.89154 37.2532L63.3294 5.24609Z"
          strokeWidth="1"
          className={cn(boxClassName, topFaceClassName)}
          stroke="currentColor"
        />
        <path
          d={bottomWallPath}
          stroke="currentColor"
          strokeWidth="1"
          fill="transparent"
          className={boxClassName}
        />
        <motion.path
          d={bottomWallPath}
          fill={`url(#${gradientId})`}
          stroke="none"
          variants={{
            initial: { opacity: 0 },
            hover: { opacity: 1 },
          }}
          transition={{ duration: 0.3, ease }}
        />
        <defs>
          <linearGradient
            id={gradientId}
            x1="69.2236"
            y1="40"
            x2="69.2236"
            y2="92.6569"
            gradientUnits="userSpaceOnUse"
          >
            <stop
              stopColor="currentColor"
              className="text-primary"
              stopOpacity="0.5"
            />
            <stop
              offset="0.53"
              stopColor="currentColor"
              className="text-primary"
            />
            <stop
              offset="1"
              stopColor="currentColor"
              className="text-primary"
              stopOpacity="0.5"
            />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

export function IsometricIllustration({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex flex-1 items-center justify-center p-6", className)}
    >
      <IsometricBox />
    </div>
  );
}

export default IsometricIllustration;
