import { getCollectionRoute } from "@/lib/catalog/routes";
import type { CatalogItem } from "@/types/catalog";

import { BackButton } from "./back-button";

export async function CollectionDetailPage({ item }: { item: CatalogItem }) {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 md:px-6 lg:px-8">
      <BackButton className="mb-6 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground" />

      <article className="rounded-xl border border-border bg-card p-6">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {getCollectionRoute(item.kind)}
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
          {item.title}
        </h1>

        {item.description ? (
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            {item.description}
          </p>
        ) : null}
      </article>
    </main>
  );
}
