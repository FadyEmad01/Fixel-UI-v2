// "use client";

// import Link from "next/link";
// import {
//   Fullscreen,
//   Monitor,
//   RotateCw,
//   Smartphone,
//   Tablet,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import {
//   ToggleGroup,
//   ToggleGroupItem,
// } from "@/components/ui/toggle-group";

// import type { PreviewViewport } from "./preview-types";

// interface PreviewToolbarProps {
//   viewport: PreviewViewport;
//   onViewportChange: (
//     viewport: PreviewViewport,
//   ) => void;
//   fullscreenHref: string;
//   onRefresh: () => void;
//   title?: string;
// }

// export function PreviewToolbar({
//   viewport,
//   onViewportChange,
//   fullscreenHref,
//   onRefresh,
//   title = "Preview",
// }: PreviewToolbarProps) {
//   return (
//     <div className="flex min-h-12 w-full items-center gap-2 border-b border-border bg-background/80 px-2 backdrop-blur-sm md:px-3">
//       <div className="flex items-center gap-1.5">
//         <div className="flex h-8 items-center rounded-lg border bg-background p-1 shadow-none">
//           <span className="px-2 text-xs font-medium">{title}</span>
//         </div>
//         <Separator orientation="vertical" className="mx-1 h-4" />
//       </div>

//       <div className="ml-auto flex items-center gap-1.5">
//         <ToggleGroup
//           type="single"
//           value={viewport}
//           onValueChange={(value) => {
//             if (value) {
//               onViewportChange(value as PreviewViewport);
//             }
//           }}
//           className="h-8 gap-1 rounded-lg border p-1"
//           aria-label="Preview viewport"
//         >
//           <ToggleGroupItem
//             value="desktop"
//             size="sm"
//             className="size-6 rounded-sm p-0"
//             aria-label="Desktop preview"
//             title="Desktop"
//           >
//             <Monitor />
//           </ToggleGroupItem>
//           <ToggleGroupItem
//             value="tablet"
//             size="sm"
//             className="size-6 rounded-sm p-0"
//             aria-label="Tablet preview"
//             title="Tablet"
//           >
//             <Tablet />
//           </ToggleGroupItem>
//           <ToggleGroupItem
//             value="mobile"
//             size="sm"
//             className="size-6 rounded-sm p-0"
//             aria-label="Mobile preview"
//             title="Mobile"
//           >
//             <Smartphone />
//           </ToggleGroupItem>
//         </ToggleGroup>
//         <Separator orientation="vertical" className="mx-1 h-4" />
//         <Button
//           asChild
//           size="icon-sm"
//           variant="ghost"
//           aria-label="Open preview in new tab"
//           title="Open in new tab"
//         >
//           <Link
//             href={fullscreenHref}
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Fullscreen />
//           </Link>
//         </Button>
//         <Separator orientation="vertical" className="mx-1 h-4" />
//         <Button
//           type="button"
//           size="icon-sm"
//           variant="ghost"
//           onClick={onRefresh}
//           aria-label="Refresh preview"
//           title="Refresh preview"
//         >
//           <RotateCw />
//         </Button>
//       </div>
//     </div>
//   );
// }

"use client";

import {
  Fullscreen,
  Monitor,
  RotateCw,
  Smartphone,
  Tablet,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import type { PreviewViewport } from "./preview-types";

interface PreviewToolbarProps {
  viewport: PreviewViewport;
  onViewportChange: (viewport: PreviewViewport) => void;
  fullscreenHref: string;
  onRefresh: () => void;
}

export function PreviewToolbar({
  viewport,
  onViewportChange,
  fullscreenHref,
  onRefresh,
}: PreviewToolbarProps) {
  return (
    <div className="absolute z-50 right-3 top-3">
      <div className="ml-auto flex items-center gap-1.5">
        <ToggleGroup
          type="single"
          value={viewport}
          onValueChange={(value) => {
            if (value) {
              onViewportChange(value as PreviewViewport);
            }
          }}
          className="h-8 gap-1 rounded-lg bg-white/70 backdrop-blur-[20px] p-1 border border-border"
          aria-label="Preview viewport"
        >
          <ToggleGroupItem
            value="desktop"
            size="sm"
            className="size-6 rounded-sm p-0"
            aria-label="Desktop preview"
            title="Desktop"
          >
            <Monitor />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="tablet"
            size="sm"
            className="size-6 rounded-sm p-0"
            aria-label="Tablet preview"
            title="Tablet"
          >
            <Tablet />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="mobile"
            size="sm"
            className="size-6 rounded-sm p-0"
            aria-label="Mobile preview"
            title="Mobile"
          >
            <Smartphone />
          </ToggleGroupItem>
          <Separator orientation="vertical" className="mx-1 h-4 my-auto" />
          <Button
            asChild
            size="icon-sm"
            variant="ghost"
            aria-label="Open preview in new tab"
            title="Open in new tab"
          >
            <Link
              href={fullscreenHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Fullscreen />
            </Link>
          </Button>
          <Separator orientation="vertical" className="mx-1 h-4 my-auto" />
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={onRefresh}
            aria-label="Refresh preview"
            title="Refresh preview"
          >
            <RotateCw />
          </Button>
        </ToggleGroup>
      </div>
    </div>
  );
}
