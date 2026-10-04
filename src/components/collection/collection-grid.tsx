import type { CatalogItem } from "@/types/catalog";

import { CollectionCard } from "./collection-card";

export function CollectionGrid({ items }: { items: CatalogItem[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <CollectionCard key={item.id} item={item} />
      ))}
    </div>
  );
}
