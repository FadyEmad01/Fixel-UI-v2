export function CollectionHeader({
  title,
  description,
  total,
}: {
  title: string;
  description: string;
  total: number;
}) {
  return (
    <header className="mb-8 flex flex-col gap-3 border-b border-border pb-6">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        Collection
      </p>

      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {title}
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
            {description}
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          {total} {total === 1 ? "item" : "items"}
        </p>
      </div>
    </header>
  );
}
