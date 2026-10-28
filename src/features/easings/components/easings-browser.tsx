"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";

import { easingsHref } from "../lib/href";
import { EasingCard } from "./easing-card";
import type { EasingSheetItem } from "../lib/types";
import { EasingSheet } from "./easing-sheet";

export function EasingsBrowser({
  easings: items,
  selectedSlug,
  selectedItem,
}: {
  easings: EasingSheetItem[];
  selectedSlug?: string;
  selectedItem: EasingSheetItem | null;
}) {
  const router = useRouter();
  const openedInSession = useRef(false);

  const handleClose = useCallback(() => {
    if (openedInSession.current) {
      openedInSession.current = false;
      router.back();
      return;
    }

    router.replace(easingsHref(), { scroll: false });
  }, [router]);

  const handleNavigate = useCallback(
    (nextSlug: string) => {
      router.replace(easingsHref(nextSlug), {
        scroll: false,
      });
    },
    [router],
  );

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <EasingCard
            key={item.slug}
            item={item}
            onOpen={() => {
              openedInSession.current = true;
            }}
          />
        ))}
      </div>

      <EasingSheet
        slug={selectedSlug ?? null}
        selectedItem={selectedItem}
        items={items}
        onClose={handleClose}
        onNavigate={handleNavigate}
      />
    </>
  );
}
