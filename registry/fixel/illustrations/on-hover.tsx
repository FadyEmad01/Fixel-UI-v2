"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { Bar, Card, CardPanel, Text } from "./kit";

export function OnHoverIllustration({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "relative flex max-w-50 flex-1 items-center justify-center p-6",
        className,
      )}
    >
      {/* Target Element (The Card that gets "hovered") */}
      <motion.div
        animate={
          reduceMotion
            ? { y: 0, scale: 1 }
            : {
                y: [0, 0, -6, -6, 0, 0],
                scale: [1, 1, 1.03, 1.03, 1, 1],
              }
        }
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          // These times dictate WHEN the animation happens (matches cursor arrival)
          times: [0, 0.35, 0.45, 0.55, 0.65, 1],
        }}
        className="relative z-0 w-full"
      >
        <Card className="w-full" withGradient={false}>
          <CardPanel className="flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-2">
              <Text className="w-[80%]" variant="main" />
              <Text className="w-[60%]" variant="secondary" />
            </div>
            <Bar className="w-full" variant="primary" />
          </CardPanel>
        </Card>
      </motion.div>

      {/* Cursor Element */}
      <motion.div
        className="pointer-events-none absolute z-10"
        animate={
          reduceMotion
            ? { x: 70, y: 70, opacity: 0 }
            : {
                x: [70, 70, 15, 15, 70, 70], // Moves from bottom-right to the card's button
                y: [70, 70, 20, 20, 70, 70],
                opacity: [0, 1, 1, 1, 1, 0], // Fades in, does the action, fades out
              }
        }
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          // Coordinates exactly with the Card's reaction
          times: [0, 0.1, 0.4, 0.6, 0.9, 1],
        }}
      >
        {/* Hand pointer. The negative margin puts the fingertip on the motion
            origin, so the keyframes still land it on the button. */}
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 32 32"
          className="-mt-2 -ml-3 size-8 overflow-visible fill-card stroke-foreground drop-shadow-sm"
          strokeWidth={0.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11.3,20.4c-0.3-0.4-0.6-1.1-1.2-2c-0.3-0.5-1.2-1.5-1.5-1.9c-0.2-0.4-0.2-0.6-0.1-1c0.1-0.6,0.7-1.1,1.4-1.1c0.5,0,1,0.4,1.4,0.7c0.2,0.2,0.5,0.6,0.7,0.8c0.2,0.2,0.2,0.3,0.4,0.5c0.2,0.3,0.3,0.5,0.2,0.1c-0.1-0.5-0.2-1.3-0.4-2.1c-0.1-0.6-0.2-0.7-0.3-1.1c-0.1-0.5-0.2-0.8-0.3-1.3c-0.1-0.3-0.2-1.1-0.3-1.5c-0.1-0.5-0.1-1.4,0.3-1.8c0.3-0.3,0.9-0.4,1.3-0.2c0.5,0.3,0.8,1,0.9,1.3c0.2,0.5,0.4,1.2,0.5,2c0.2,1,0.5,2.5,0.5,2.8c0-0.4-0.1-1.1,0-1.5c0.1-0.3,0.3-0.7,0.7-0.8c0.3-0.1,0.6-0.1,0.9-0.1c0.3,0.1,0.6,0.3,0.8,0.5c0.4,0.6,0.4,1.9,0.4,1.8c0.1-0.4,0.1-1.2,0.3-1.6c0.1-0.2,0.5-0.4,0.7-0.5c0.3-0.1,0.7-0.1,1,0c0.2,0,0.6,0.3,0.7,0.5c0.2,0.3,0.3,1.3,0.4,1.7c0,0.1,0.1-0.4,0.3-0.7c0.4-0.6,1.8-0.8,1.9,0.6c0,0.7,0,0.6,0,1.1c0,0.5,0,0.8,0,1.2c0,0.4-0.1,1.3-0.2,1.7c-0.1,0.3-0.4,1-0.7,1.4c0,0-1.1,1.2-1.2,1.8c-0.1,0.6-0.1,0.6-0.1,1c0,0.4,0.1,0.9,0.1,0.9s-0.8,0.1-1.2,0c-0.4-0.1-0.9-0.8-1-1.1c-0.2-0.3-0.5-0.3-0.7,0c-0.2,0.4-0.7,1.1-1.1,1.1c-0.7,0.1-2.1,0-3.1,0c0,0,0.2-1-0.2-1.4c-0.3-0.3-0.8-0.8-1.1-1.1L11.3,20.4z" />
          <line x1="19.6" y1="20.7" x2="19.6" y2="17.3" />
          <line x1="17.6" y1="20.7" x2="17.5" y2="17.3" />
          <line x1="15.6" y1="17.3" x2="15.6" y2="20.7" />
        </svg>
      </motion.div>
    </div>
  );
}

export default OnHoverIllustration;
