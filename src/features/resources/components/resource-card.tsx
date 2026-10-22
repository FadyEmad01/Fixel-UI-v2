// "use client";

// import { MoveUpRight } from "lucide-react";
// import Link from "next/link";
// import * as React from "react";

// import type { Resource } from "../lib/types";
// import { Highlight } from "./highlight";

// /**
//  * One resource card.
//  *
//  * The card body is a stretched `<Link>` to `?url=…` (so it prefetches, opens
//  * the sheet, and works without JavaScript), with the external link as a
//  * sibling above it. Nested anchors are invalid, hence the overlay rather than a
//  * wrapping link.
//  */
// export function ResourceCard({
//   resource,
//   href,
//   query,
//   onOpen,
// }: {
//   resource: Resource;
//   href: string;
//   query: string;
//   onOpen: () => void;
// }) {
//   const [firstCategory, ...restCategories] = resource.categories;

//   return (
//     <article className="group relative min-w-0 rounded-xl">
//       <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
//         <CardMedia resource={resource} />
//       </div>

//       <div className="mt-3 flex items-start justify-between gap-3">
//         <div className="min-w-0">
//           <div className="flex items-center gap-1.5">
//             <SiteIcon icon={resource.icon} />
//             <p className="line-clamp-1 text-base font-medium text-foreground font-archivo">
//               @<Highlight text={resource.name} query={query} />
//             </p>
//           </div>

//           {resource.description ? (
//             <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
//               <Highlight text={resource.description} query={query} />
//             </p>
//           ) : null}
//         </div>

//         <div className="flex shrink-0 items-center gap-1">
//           {firstCategory ? (
//             <span className="rounded-sm bg-my-primary/70 px-1.5 py-0.5 font-archivo text-[10px] font-medium capitalize text-muted-foreground dark:bg-muted">
//               {firstCategory}
//             </span>
//           ) : null}

//           {restCategories.length > 0 ? (
//             <span className="rounded-sm bg-my-primary/70 px-1.5 py-0.5 font-archivo text-[10px] font-medium text-muted-foreground dark:bg-muted">
//               +{restCategories.length}
//             </span>
//           ) : null}

//           <a
//             href={resource.externalUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             aria-label={`Visit ${resource.name} (opens in a new tab)`}
//             className="relative z-10 inline-flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
//           >
//             <MoveUpRight className="size-3.5" aria-hidden="true" />
//           </a>
//         </div>
//       </div>

//       <Link
//         href={href}
//         scroll={false}
//         onClick={onOpen}
//         className="absolute inset-0 z-0 rounded-xl focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
//       >
//         <span className="sr-only">View {resource.name}</span>
//       </Link>
//     </article>
//   );
// }

// function CardMedia({ resource }: { resource: Resource }) {
//   const [failed, setFailed] = React.useState(false);

//   if (!resource.image || failed)
//     return <ResourceFallback name={resource.name} />;

//   return (
//     // The image is an arbitrary remote URL from the snapshot; `next/image`
//     // would need a fixed remotePatterns allowlist per host.
//     // biome-ignore lint/performance/noImgElement: metadata images come from arbitrary curated hosts.
//     <img
//       src={resource.image}
//       alt=""
//       loading="lazy"
//       decoding="async"
//       referrerPolicy="no-referrer"
//       onError={() => setFailed(true)}
//       className="size-full object-cover"
//     />
//   );
// }

// /**
//  * A site's own favicon, shown at text size.
//  *
//  * Many sites ship an SVG or a `.ico` that fails to decode; both cases just
//  * disappear rather than leaving a broken-image glyph.
//  */
// export function SiteIcon({ icon }: { icon: string | null }) {
//   const [failed, setFailed] = React.useState(false);

//   if (!icon || failed) return null;

//   return (
//     // biome-ignore lint/performance/noImgElement: favicons come from arbitrary curated hosts.
//     <img
//       src={icon}
//       alt=""
//       aria-hidden="true"
//       loading="lazy"
//       decoding="async"
//       referrerPolicy="no-referrer"
//       onError={() => setFailed(true)}
//       className="size-3.5 shrink-0 rounded-[3px] object-contain"
//     />
//   );
// }

// /** Quiet letter tile for sites with no OG image (or one that fails to load). */
// export function ResourceFallback({ name }: { name: string }) {
//   return (
//     <div className="flex size-full items-center justify-center bg-gradient-to-br from-muted to-muted/40">
//       <span
//         aria-hidden="true"
//         className="font-heading text-3xl font-semibold text-muted-foreground/50"
//       >
//         {name.trim().charAt(0).toUpperCase() || "?"}
//       </span>
//     </div>
//   );
// }

"use client";

import { MoveUpRight } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import type { Resource } from "../lib/types";
import { Highlight } from "./highlight";

/**
 * One resource card.
 *
 * The card body is a stretched `<Link>` to `?url=…` (so it prefetches, opens
 * the sheet, and works without JavaScript), with the external link as a
 * sibling above it. Nested anchors are invalid, hence the overlay rather than a
 * wrapping link.
 */
export function ResourceCard({
  resource,
  href,
  query,
  onOpen,
}: {
  resource: Resource;
  href: string;
  query: string;
  onOpen: () => void;
}) {
  const [firstCategory, ...restCategories] = resource.categories;

  return (
    <article className="group relative min-w-0 rounded-xl">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
        <CardMedia resource={resource} />
      </div>

      <div className="mt-3 flex-col items-start justify-between gap-3 px-0.5">
        <div className="min-w-0 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <SiteIcon icon={resource.icon} />
            <p className="line-clamp-1 text-base font-medium text-foreground font-archivo">
              @<Highlight text={resource.name} query={query} />
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {firstCategory ? (
              <span className="rounded-sm bg-my-primary/70 px-1.5 py-0.5 font-archivo text-[10px] font-medium capitalize text-muted-foreground dark:bg-muted">
                {firstCategory}
              </span>
            ) : null}

            {restCategories.length > 0 ? (
              <span className="rounded-sm bg-my-primary/70 px-1.5 py-0.5 font-archivo text-[10px] font-medium text-muted-foreground dark:bg-muted">
                +{restCategories.length}
              </span>
            ) : null}

            <a
              href={resource.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${resource.name} (opens in a new tab)`}
              className="relative z-10 inline-flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <MoveUpRight className="size-3.5" aria-hidden="true" />
            </a>
          </div>

        </div>


        {resource.description ? (
          <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
            <Highlight text={resource.description} query={query} />
          </p>
        ) : null}
      </div>

      <Link
        href={href}
        scroll={false}
        onClick={onOpen}
        className="absolute inset-0 z-0 rounded-xl focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <span className="sr-only">View {resource.name}</span>
      </Link>
    </article>
  );
}

function CardMedia({ resource }: { resource: Resource }) {
  const [failed, setFailed] = React.useState(false);

  if (!resource.image || failed)
    return <ResourceFallback name={resource.name} />;

  return (
    // The image is an arbitrary remote URL from the snapshot; `next/image`
    // would need a fixed remotePatterns allowlist per host.
    // biome-ignore lint/performance/noImgElement: metadata images come from arbitrary curated hosts.
    <img
      src={resource.image}
      alt=""
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="size-full object-cover"
    />
  );
}

/**
 * A site's own favicon, shown at text size.
 *
 * Many sites ship an SVG or a `.ico` that fails to decode; both cases just
 * disappear rather than leaving a broken-image glyph.
 */
export function SiteIcon({ icon }: { icon: string | null }) {
  const [failed, setFailed] = React.useState(false);

  if (!icon || failed) return null;

  return (
    // biome-ignore lint/performance/noImgElement: favicons come from arbitrary curated hosts.
    <img
      src={icon}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="size-3.5 shrink-0 rounded-[3px] object-contain"
    />
  );
}

/** Quiet letter tile for sites with no OG image (or one that fails to load). */
export function ResourceFallback({ name }: { name: string }) {
  return (
    <div className="flex size-full items-center justify-center bg-gradient-to-br from-muted to-muted/40">
      <span
        aria-hidden="true"
        className="font-heading text-3xl font-semibold text-muted-foreground/50"
      >
        {name.trim().charAt(0).toUpperCase() || "?"}
      </span>
    </div>
  );
}
