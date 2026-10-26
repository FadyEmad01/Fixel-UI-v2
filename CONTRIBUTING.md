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

1. Add the component source under `registry/fixel/illustrations/`, using a short kebab-case filename such as `date-picker.tsx`.
2. Export a named component ending in `Illustration`, for example `DatePickerIllustration`. Keep it as a self-contained wireframe preview and use the shared primitives from `./kit` where they fit.
3. Add its slug and display category to `src/features/illustrations/lib/categories.ts`. Each visible illustration needs one category.
4. Regenerate the registry manifest:

   ```bash
   pnpm registry:generate
   ```

5. Check the manifest and build output:

   ```bash
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

Social images are rendered directly by Next.js from `opengraph-image.tsx` and `twitter-image.tsx` files. The illustration routes use the registry’s generated title and description metadata plus the category map. Keep the layout and those source values data-driven.

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
