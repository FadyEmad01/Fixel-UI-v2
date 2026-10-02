// // import type { ReactNode } from "react";

// // interface PreviewFrameProps {
// //   children: ReactNode;
// //   className?: string;
// // }

// // export function PreviewFrame({ children, className }: PreviewFrameProps) {
// //   return (
// //     <section
// //       className={["relative overflow-hidden rounded-2xl bg-muted", className]
// //         .filter(Boolean)
// //         .join(" ")}
// //     >
// //       <div className="flex max-h-[520px] items-center justify-center p-10">
// //         {children}
// //       </div>
// //     </section>
// //   );
// // }

// "use client";

// import { useState } from "react";
// import type { ReactNode } from "react";

// import {
//   PreviewToolbar,
// } from "./preview-toolbar";

// import {
//   PreviewViewport,
// } from "./preview-viewport";

// import type {
//   PreviewViewport as PreviewViewportType,
// } from "./preview-types";

// interface PreviewFrameProps {
//   children: ReactNode;
//   className?: string;
//   fullscreenHref?: string;
//   defaultViewport?: PreviewViewportType;
// }

// export function PreviewFrame({
//   children,
//   className,
//   fullscreenHref = "/preview",
//   defaultViewport = "desktop",
// }: PreviewFrameProps) {
//   const [viewport, setViewport] =
//     useState<PreviewViewportType>(
//       defaultViewport,
//     );
//   const [refreshKey, setRefreshKey] = useState(0);

//   return (
//     <section
//       className={[
//         "relative overflow-hidden rounded-xl border bg-background",
//         className,
//       ]
//         .filter(Boolean)
//         .join(" ")}
//     >
//       <PreviewToolbar
//         viewport={viewport}
//         onViewportChange={setViewport}
//         fullscreenHref={fullscreenHref}
//         onRefresh={() => setRefreshKey((key) => key + 1)}
//       />

//       <div className="relative grid h-[520px] w-full overflow-hidden p-4 md:p-6">
//         <div className="absolute inset-0 [background-image:radial-gradient(#d4d4d4_1px,transparent_1px)] [background-size:20px_20px] dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]" />
//         <PreviewViewport
//           key={refreshKey}
//           viewport={viewport}
//         >
//           {children}
//         </PreviewViewport>
//       </div>
//     </section>
//   );
// }

"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import { PreviewToolbar } from "./preview-toolbar";

import { PreviewViewport } from "./preview-viewport";

import type { PreviewViewport as PreviewViewportType } from "./preview-types";

interface PreviewFrameProps {
  children: ReactNode;
  className?: string;
  fullscreenHref?: string;
  defaultViewport?: PreviewViewportType;
}

export function PreviewFrame({
  children,
  className,
  fullscreenHref = "/preview",
  defaultViewport = "desktop",
}: PreviewFrameProps) {
  const [viewport, setViewport] =
    useState<PreviewViewportType>(defaultViewport);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <section className={["relative", className].filter(Boolean).join(" ")}>
      <PreviewToolbar
        viewport={viewport}
        onViewportChange={setViewport}
        fullscreenHref={fullscreenHref}
        onRefresh={() => setRefreshKey((key) => key + 1)}
      />
      <PreviewViewport key={refreshKey} viewport={viewport}>
        {children}
      </PreviewViewport>
    </section>
  );
}
