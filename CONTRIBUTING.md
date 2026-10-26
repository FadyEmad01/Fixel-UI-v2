# Contributing to Fixel UI

Thanks for helping make the catalog more useful. Contributions can improve an illustration, add a resource, fix a bug, or make the site easier to use.

## Set up the project

Use the pnpm version declared in `package.json` (pnpm 10.29.2) and a Node.js release supported by Next.js 16.

```bash
git clone https://github.com/FadyEmad01/Fixel-UI-v2.git
cd Fixel-UI-v2
pnpm install
pnpm dev
```

The development command generates the local registry files before starting the site. Open [http://localhost:3000](http://localhost:3000).

## Add or update an illustration

1. Add `registry/fixel/illustrations/<slug>.tsx` with a short kebab-case slug.
2. Use this starter and replace `Example` with the illustration name:

   ```tsx
   import { cn } from "@/lib/utils";
   import { Card, CardPanel, Text } from "./kit";

   export function ExampleIllustration({ className }: { className?: string }) {
     return (
       <Card className={cn("max-w-50", className)}>
         <CardPanel className="flex items-center gap-2 p-3">
           <Text className="w-6" />
           <Text className="w-20" variant="secondary" />
         </CardPanel>
       </Card>
     );
   }

   export default ExampleIllustration;
   ```

   Keep both exports: the named export powers the catalog, and the default export supports v0's generated `Component` import.
3. Add the slug and display category to `src/features/illustrations/lib/categories.ts`. Every visible illustration needs one category. Add `<slug>.meta.ts` beside the component only when it needs a custom title, description, dependencies, hidden/shared behavior, or registry dependencies.
4. Use helpers from `./kit` when they fit. Add a primitive to `kit.tsx` only when it is useful to at least two illustrations; keep one-off visuals in the illustration file. An illustration that imports `./kit` automatically ships the shared file, so normal additions do not require changes to the registry generator.
5. Regenerate and build the registry:

   ```bash
   pnpm registry:generate
   pnpm registry:check
   pnpm registry:build
   ```

`registry.json` is committed and powers the catalog and installation metadata. Files under `src/features/illustrations/generated/` and `public/r/` are generated locally; do not edit or commit them.

## Add a resource

Edit `src/features/resources/data/resources.ts`, the hand-maintained source list. Add the URL and one or more categories:

```ts
{ url: "https://example.com/", categories: ["Tools"] },
```

Then refresh the metadata snapshot and review the result:

```bash
pnpm resources:sync
```

The sync reads metadata from the curated URLs and updates `src/features/resources/generated/resources.json`. Commit that generated snapshot with the source-list change. Keep the URL in the hand-maintained list; the site does not fetch arbitrary visitor-provided addresses.

## Open Graph images

The site and illustration pages use the static image at `public/og-image.png` for Open Graph and Twitter previews. Replace that file when updating the social image.

## Before opening a pull request

Run the checks that match your change:

```bash
pnpm lint
pnpm test
pnpm registry:check
pnpm build
```

For resource-only changes, run `pnpm resources:sync` and inspect the generated snapshot. For a new illustration, run both registry commands above. The full build also regenerates the registry and validates the Next.js app.

In your pull request, describe what changed and why. Include a screenshot for visible UI changes, and mention which commands you ran. Keep each PR focused so it is easy to review.

## Style notes

- Follow the existing TypeScript and Biome formatting in the touched area.
- Use the existing design tokens and shared components instead of introducing one-off styling conventions.
- Keep illustration components dependency-light; declare any external package they need in the registry source.
- Add or update tests when changing behavior in tested code paths.
- Only contribute code and assets that you have permission to share.
