// import Link from "next/link";

// import { collectionConfig } from "@/config/collections";

// export default function CollectionsPage() {
//   return (
//     <main className="mx-auto w-full max-w-7xl pt-62.5 px-4 pb-10 md:px-6 lg:px-8">
//       <header className="">
//         <h1 className="font-heading text-6xl lg:text-8xl font-semibold">
//           Collections
//         </h1>
//       </header>
//       <hr className="my-8" />
//       {/* <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
//         {Object.entries(collectionConfig).map(([key, config]) => (
//           <Link
//             key={key}
//             href={`/collections?type=${key}`}
//             className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-muted-foreground/50"
//           >
//             <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
//               {config.title}
//             </p>
//             <p className="mt-3 text-xl font-semibold text-foreground">
//               {config.title}
//             </p>
//             <p className="mt-2 text-sm text-muted-foreground">
//               {config.description}
//             </p>
//           </Link>
//         ))}
//       </div> */}
//       <div className="mx-auto w-full overflow-hidden">
//         <div className="scroll-fade-x scrollbar-none overflow-x-auto">
//           <div className="flex w-max gap-2.5">
//             {Object.entries(collectionConfig).map(([key, config]) => (
//               <div
//                 key={key}
//                 className="inline-flex items-center rounded-[8px] px-3.5 py-0.5 text-base font-medium tracking-wider capitalize bg-neutral-200/70 text-black/70 hover:bg-black hover:text-white"
//               >
//                 {config.title}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

import Link from "next/link";

import { CollectionCard } from "@/components/collection/collection-card";
import { collectionConfig } from "@/config/collections";
import { getCatalog } from "@/lib/catalog";

interface CollectionsPageProps {
  searchParams: Promise<{
    type?: string;
  }>;
}

export default async function CollectionsPage({
  searchParams,
}: CollectionsPageProps) {
  const { type } = await searchParams;

  const catalog = await getCatalog();

  const selectedCollection =
    type && type in collectionConfig
      ? collectionConfig[type as keyof typeof collectionConfig]
      : null;

  const filteredItems = selectedCollection
    ? catalog.filter((item) => item.kind === selectedCollection.kind)
    : catalog;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pt-62.5 pb-10 md:px-6 lg:px-8">
      <header>
        <h1 className="font-heading text-6xl font-semibold lg:text-8xl">
          Collections
        </h1>
      </header>

      <hr className="my-6 border-border" />

      {/* Collection filters */}
      <div className="mx-auto w-full overflow-hidden">
        <div className="scroll-fade-x scrollbar-none overflow-x-auto">
          <div className="flex w-max gap-2.5">
            {/* All */}
            <Link
              href="/collections"
              className={[
                "inline-flex shrink-0 items-center rounded-full px-3.5 py-1",
                "text-base font-medium tracking-wider capitalize",
                "transition-colors",
                !selectedCollection
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-foreground hover:text-background",
              ].join(" ")}
              scroll={false}
            >
              All
            </Link>

            {/* Collections */}
            {Object.entries(collectionConfig).map(([key, config]) => {
              const isActive = selectedCollection === config;

              return (
                <Link
                  key={key}
                  href={`/collections?type=${key}`}
                  className={[
                    "inline-flex shrink-0 items-center rounded-full px-3.5 py-1",
                    "text-base font-medium tracking-wider capitalize",
                    "transition-colors",
                    isActive
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:bg-foreground hover:text-background",
                  ].join(" ")}
                  scroll={false}
                >
                  {config.title}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results */}
      <section className="mt-10">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <CollectionCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-60 items-center justify-center rounded-xl border border-border bg-muted/30">
            <p className="text-sm text-muted-foreground">No resources found.</p>
          </div>
        )}
      </section>
    </main>
  );
}
