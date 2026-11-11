# Components Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/components` catalog to the docs site: media-tile cards, a docs page matching the supplied `doc-page.tsx` layout byte-for-byte, MDX-authored articles with heading-driven TOC, install/copy/v0 actions, and a full-bleed live preview route.

**Architecture:** Reuse the illustration registry pipeline. The generator becomes multi-kind: `registry/fixel/components/<slug>.tsx` is the installable file, `<slug>.demo.tsx` is a registry-only live-preview adapter, `<slug>.meta.ts` carries title/description/category/tags/media, `content/components/<slug>.mdx` carries the article, and `public/components/<slug>/` carries poster/video. All of it is mirrored into `src/features/components/generated/` and driven from the committed `registry.json`.

**Tech Stack:** Next.js 16.4 App Router, React 19, Tailwind v4, `@next/mdx`, Shiki, motion, `shadcn build`, `node:test`.

**Spec:** this document plus `src/features/components/components/doc-page.tsx` (visual source of truth).

## Global Constraints

- `src/features/components/components/doc-page.tsx` class strings, spacing, and breakpoints are byte-identical to the supplied file. Only mock data becomes props.
- Category and tags live in `<slug>.meta.ts`; no `categories.ts`.
- Install target is `components/fixel/<slug>.tsx`.
- MDX stays plain Markdown so the copied page is valid markdown.
- Dates come from the existing `contentHash` ledger; doc edits do not bump `updatedAt`.
- Live preview URL shape is `/preview/<category-slug>/<slug>` (from the supplied mock href).
- Turbopack cannot serialize plugin functions: remark/rehype plugins are package-name strings.
- `biome.json` must stay comment-free.

## Review Focus

- A component with only a poster and no video must render (hero and card) without an empty `<video>`.
- A category with no components must not render an empty chip row.
- An MDX file with no `<Install />`/`<Source />` must still get both sections and TOC entries.
- A slug present in the manifest but missing its demo/MDX/poster must fail `registry:check`, not crash the page.
- Live preview must 404 on a category that does not match the item, and must not ship every component into one bundle.

---

## Task 1: Multi-kind registry generator

**Files:**
- Modify: `scripts/registry/lib/registry.mts`
- Modify: `scripts/registry/generate.mts`
- Modify: `scripts/registry/check.mts`
- Test: `scripts/registry/lib/registry.test.mts`

**Interfaces:**
- `Kind` gains `mirrorDir: string`, `barrelName: string`, `slugTypeName: string`.
- `ItemMeta` gains `category?: string`, `tags?: string[]`, `media?: { poster: string; video?: string }`.
- `discoverItems` skips files ending in `.demo.tsx`.
- `renderBarrel(items, kind, componentExpr)` emits a lazy map keyed by slug.
- `resolveDates` unchanged.

- [ ] Add the `components` kind and demo-skip; run `pnpm test` (registry tests pass).
- [ ] Emit per-kind mirror, `metadata.json`, `media.json`, `docs.ts`, `toc.json`.
- [ ] Extend `check.mts` with demo/MDX/poster/category/tag validation.
- [ ] `pnpm registry:generate && pnpm registry:check` succeed with zero components.

## Task 2: Shared docs shell extraction

**Files:**
- Create: `src/shared/components/docs/docs-layout.tsx`, `install-tabs.tsx`, `install-command.tsx`, `source-explorer.tsx`, `page-actions.tsx`
- Create: `src/shared/lib/registry/install.ts`
- Modify: `src/features/illustrations/**` imports only.

- [ ] Move components verbatim; keep `usageSnippet` per feature.
- [ ] Illustrations build unchanged; `/illustration/<slug>` still renders.

## Task 3: Components data layer

**Files:**
- Create: `src/features/components/lib/{items,href,search,markdown,toc,install}.ts`
- Test: `src/features/components/lib/toc.test.mts`

**Interfaces:**
- `allComponents(): ComponentItem[]`, `getComponent(slug): ComponentItem | undefined`
- `ComponentItem = { slug, title, description, category, tags, media, href, previewHref, dependencies, uploadedAt, updatedAt, files }`
- `componentToc(slug): { id, label }[]`

- [ ] `toc.test.mts` pins heading extraction: skips fenced code, skips h1, slugs duplicates.
- [ ] `markdown.ts` includes install, usage, raw MDX body, source.

## Task 4: Catalog page and card

**Files:**
- Create: `src/app/(docs)/components/page.tsx`
- Create: `src/features/components/components/{components-page,components-browser,component-card,component-media}.tsx`

- [ ] Chips derived from meta, search, 3-col grid, Suspense reader.
- [ ] Poster always; video on hover/focus; `prefers-reduced-motion` never swaps.

## Task 5: Detail page on the supplied layout

**Files:**
- Modify: `src/features/components/components/doc-page.tsx` (props only)
- Create: `src/features/components/components/{component-doc,install-block,source-block}.tsx`
- Create: `src/app/(docs)/components/[slug]/page.tsx`

- [ ] `doc-page.tsx` keeps every class string; `navigationItems`/`methodGroups`/`codeSnippets` removed.
- [ ] Scroll-spy marks the active TOC item.
- [ ] `Install`/`Source` are MDX components; auto-appended when absent.

## Task 6: Live preview route

**Files:**
- Create: `src/app/(viewer)/preview/[category]/[slug]/page.tsx`
- Create: `src/features/components/components/component-viewer.tsx`

- [ ] Renders the mirrored demo lazily; prev/next; arrow keys; Esc returns to docs.
- [ ] Mismatched category 404s.

## Task 7: Markdown route

**Files:**
- Create: `src/app/(docs)/components/[slug]/md/route.ts`

- [ ] `text/plain`, SSG, same builder as Copy page.

## Task 8: Wiring and first component

**Files:**
- Modify: `src/components/site/layout/navbar-client.tsx`, `src/app/sitemap.ts`, `next.config.ts`
- Create: `registry/fixel/components/folder-preview.{tsx,meta.ts,demo.tsx}`
- Create: `content/components/folder-preview.mdx`
- Create: `public/components/folder-preview/preview.{webp,mp4}` (user-supplied media)

- [ ] Navbar link, sitemap entry, `rehype-slug` enabled.
- [ ] `pnpm registry:generate`, `registry:check`, `test`, `lint`, `build` all green.
- [ ] Browser pass: catalog → detail → live preview → md.
