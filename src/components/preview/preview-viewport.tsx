"use client";

import type { ReactNode } from "react";
import type { PreviewViewport as PreviewViewportType } from "./preview-types";

interface PreviewViewportProps {
  children: ReactNode;
  viewport: PreviewViewportType;
}

const viewportStyles: Record<PreviewViewportType, string> = {
  mobile: "max-w-[320px] w-full h-full",
  tablet: "max-w-[768px] w-full h-full",
  desktop: "w-full h-full",
};

export function PreviewViewport({ children, viewport }: PreviewViewportProps) {
  return (
    <div
      className={[
        "relative z-10 mx-auto overflow-auto rounded-xl bg-background",
        "transition-[width] duration-300 ease-out",
        viewportStyles[viewport],
      ].join(" ")}
    >
      {children}
    </div>
  );
}
