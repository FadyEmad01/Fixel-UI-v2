import { notFound } from "next/navigation";

import { CollectionDetailPage } from "@/components/collection/collection-detail-page";
import { getCatalog } from "@/lib/catalog";

interface CollectionDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CollectionDetailRoute({
  params,
}: CollectionDetailPageProps) {
  const { slug } = await params;
  const catalog = await getCatalog();
  const item = catalog.find((catalogItem) => catalogItem.id === slug);

  if (!item) {
    notFound();
  }

  return <CollectionDetailPage item={item} />;
}
