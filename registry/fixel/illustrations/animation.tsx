"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { Card, CardPanel, Text } from "./kit";

export function AnimationIllustration({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={cn("flex max-w-50 flex-1 flex-col gap-2", className)}>
      <Card>
        <CardPanel className="flex flex-col gap-3 p-3">
          {/* Preview canvas */}
          <div className="relative flex h-16 items-center justify-center overflow-hidden rounded-lg bg-muted-foreground/5">
            <div className="absolute left-3 size-5 rounded-md bg-muted-foreground/10" />
            <div className="absolute right-3 size-5 rounded-md bg-muted-foreground/10" />
            <motion.div
              animate={
                reduceMotion
                  ? { x: 0, scale: 1 }
                  : { x: [-32, 32, -32], scale: [1, 0.72, 1] }
              }
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute size-5 rounded-md bg-primary"
            />
          </div>

          {/* Timeline */}
          <div className="flex flex-col gap-2 px-0.5">
            {/* Track 1 — active */}
            <div className="flex items-center gap-2">
              <div className="size-1.5 shrink-0 rounded-full bg-primary" />
              <div className="relative flex-1">
                <div className="h-[3px] w-full rounded-full bg-muted-foreground/15" />
                {/* Keyframe diamonds */}
                {["left-0", "left-1/2", "right-0"].map((pos, i) => (
                  <div
                    key={pos}
                    className={`absolute top-1/2 ${pos} size-1.5 -translate-y-1/2 rotate-45 ${
                      i === 1 ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                  />
                ))}
                {/* Playhead */}
                <motion.div
                  animate={
                    reduceMotion
                      ? { left: "50%" }
                      : { left: ["0%", "50%", "100%", "50%", "0%"] }
                  }
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-1/2 z-10 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card bg-primary shadow-[0_0_0_1px] shadow-primary"
                />
              </div>
            </div>

            {/* Track 2 */}
            <div className="flex items-center gap-2">
              <div className="size-1.5 shrink-0 rounded-full bg-muted-foreground/25" />
              <div className="relative flex-1">
                <div className="h-[3px] w-full rounded-full bg-muted-foreground/15" />
                {["left-0", "right-0"].map((pos) => (
                  <div
                    key={pos}
                    className={`absolute top-1/2 ${pos} size-1.5 -translate-y-1/2 rotate-45 bg-muted-foreground/25`}
                  />
                ))}
              </div>
            </div>

            {/* Track 3 */}
            <div className="flex items-center gap-2">
              <div className="size-1.5 shrink-0 rounded-full bg-muted-foreground/25" />
              <div className="relative flex-1">
                <div className="h-[3px] w-full rounded-full bg-muted-foreground/15" />
                {["left-[20%]", "left-[70%]"].map((pos) => (
                  <div
                    key={pos}
                    className={`absolute top-1/2 ${pos} size-1.5 -translate-y-1/2 rotate-45 bg-muted-foreground/25`}
                  />
                ))}
              </div>
            </div>

            {/* Footer labels */}
            <div className="flex gap-1.5 pt-0.5">
              <Text className="w-6" variant="secondary" />
              <Text className="w-4" variant="secondary" />
              <Text className="w-8" variant="secondary" />
            </div>
          </div>
        </CardPanel>
      </Card>
    </div>
  );
}

export default AnimationIllustration;
