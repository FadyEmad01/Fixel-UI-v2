import {
  type CollectionRouteKey,
  collectionConfig,
} from "@/config/collections";
import { getCatalog } from "@/lib/catalog";

import { CollectionEmpty } from "./collection-empty";
import { CollectionGrid } from "./collection-grid";
import { CollectionHeader } from "./collection-header";

export async function CollectionPage({
  collectionKey,
}: {
  collectionKey: CollectionRouteKey;
}) {
  const config = collectionConfig[collectionKey];
  const items = (await getCatalog()).filter(
    (item) => item.kind === config.kind,
  );

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 lg:px-8">
      <CollectionHeader
        title={config.title}
        description={config.description}
        total={items.length}
      />

      {items.length > 0 ? (
        <CollectionGrid items={items} />
      ) : (
        <CollectionEmpty
          title="No items found"
          description={`There are no ${config.title.toLowerCase()} resources in this collection yet.`}
        />
      )}
    </main>
  );
}
