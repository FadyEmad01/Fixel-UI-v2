import Link from "next/link";

import { type IllustrationSlug, illustrations } from "../generated";

/**
 * One catalog card: the illustration itself as the card art, with the body a
 * stretched link so the whole card is one hit target.
 */
export function IllustrationCard({
  slug,
  title,
  description,
  href,
}: {
  slug: string;
  title: string;
  description: string;
  href: string;
}) {
  const Preview = illustrations[slug as IllustrationSlug];

  return (
    <article className="group relative min-w-0 rounded-xl">
      <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg bg-muted p-6">
        {Preview ? (
          <div className="flex h-full w-full items-center justify-center transition-transform duration-300 ease-out group-hover:scale-[1.03]">
            <Preview />
          </div>
        ) : (
          <span
            aria-hidden="true"
            className="font-heading text-3xl font-semibold text-muted-foreground/50"
          >
            {title.trim().charAt(0).toUpperCase() || "?"}
          </span>
        )}
      </div>

      <div className="mt-3 min-w-0 px-0.5">
        <p className="line-clamp-1 font-archivo text-base font-medium text-foreground">
          {title}
        </p>
        <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>

      <Link
        href={href}
        className="absolute inset-0 z-0 rounded-xl focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <span className="sr-only">View {title}</span>
      </Link>
    </article>
  );
}
