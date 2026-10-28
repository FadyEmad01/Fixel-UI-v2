import Link from "next/link";
import type { EasingSheetItem } from "../lib/types";
import { EasingCurveSvg } from "./easing-curve-svg";

export function EasingCard({
  item,
  onOpen,
}: {
  item: EasingSheetItem;
  onOpen: () => void;
}) {
  return (
    <article className="group relative min-w-0 rounded-xl">
      <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg bg-muted p-6">
        <div className="flex h-full w-full items-center justify-center transition-transform duration-300 ease-out group-hover:scale-[1.03]">
          <EasingCurveSvg
            points={item.points}
            animate={true}
            showGrid={true}
            showEndedCircle={false}
            width={140}
            height={140}
          />
        </div>
      </div>

      <div className="mt-3 min-w-0 px-0.5">
        <p className="line-clamp-1 font-archivo text-base font-medium text-foreground">
          {item.name}
        </p>
        <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
          {item.description}
        </p>
      </div>

      <Link
        href={item.href}
        scroll={false}
        onClick={onOpen}
        className="absolute inset-0 z-0 rounded-xl focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <span className="sr-only">View details for {item.name}</span>
      </Link>
    </article>
  );
}
