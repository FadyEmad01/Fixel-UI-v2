# Component Folders + Example-Driven Usage

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every component its own registry folder (payload + metadata + examples), and make the docs "Usage" snippet come from the default example file instead of hand-typed markdown.

**Architecture:** `registry/fixel/components/<slug>/` holds `<slug>.tsx` (the only installable file), `meta.ts` (site-only metadata), and `examples/*.tsx` (registry-only usage files that import `../<slug>`). The generator reads the folder, rewrites that one import to `@/components/fixel/<slug>`, mirrors payload + examples into `src/features/components/generated/<slug>/`, and emits `examples.json` (source of truth for Usage) plus a nested lazy barrel keyed `slug -> example`. Illustrations stay flat.

**Tech Stack:** Next.js 16.4 App Router (RSC), React 19, Tailwind v4, `next/dynamic`, Shiki `CodeBlock`, `node:test`.

**Spec:** this document, plus `src/features/components/components/doc-page.tsx` (visual source of truth, unchanged).

## Global Constraints

- `doc-page.tsx` class strings, spacing, and breakpoints stay byte-identical.
- Install target stays `components/fixel/<slug>.tsx`; examples and `meta.ts` never install.
- Usage is the default example's source, rewritten to the consumer alias. No hand-typed snippet survives.
- Content hash covers the payload only, so editing an example does not bump "Updated".
- Auto-append order is Usage -> Installation -> Source; a section the article places is not appended.
- `biome.json` stays comment-free; scope Biome to changed paths (older files are CRLF).
- Turbopack cannot serialize plugin functions; no new remark/rehype functions.

## Review Focus

- A component folder without `examples/` fails `registry:check`, not the page.
- `meta.example` naming a missing file fails `registry:check`.
- Examples still resolve after the mirror copy (`../<slug>` inside `<slug>/examples/`).
- `<Examples />` renders every example with a live preview and its source; `<Usage />` renders the default one.
- The preview route renders the default example, not the first file alphabetically, when `meta.example` says otherwise.
- Illustrations keep working: same paths, same barrel, same tests.

---

## Task 1: Folder discovery, examples, nested barrel

**Files:**
- Modify: `scripts/registry/lib/registry.mts`
- Modify: `scripts/registry/generate.mts`
- Modify: `scripts/registry/lib/validate.mts`
- Test: `scripts/registry/lib/registry.test.mts`, `scripts/registry/lib/catalog.test.mts`

**Interfaces:**
- `Kind` gains `layout: "flat" | "folder"` (illustrations `flat`, components `folder`); `barrel` becomes `"named" | "examples"`.
- `ItemMeta` drops `usage`, gains `example?: string` (default example name).
- `ItemExample = { name; title; content; source }`; `RegistryItem` gains `examples: ItemExample[]` and `defaultExample?: string`; `demoContent` and `DEMO_EXTENSION` are removed.
- `discoverItems` reads `<slug>/<slug>.tsx`, `<slug>/meta.ts`, `<slug>/examples/*.tsx` for folder kinds.
- `renderBarrel` emits `{ "<slug>": { "<example>": dynamic(...) } }` for `barrel: "examples"`.
- Mirror: `generated/<slug>/<slug>.tsx`, `generated/<slug>/examples/<name>.tsx`, `examples.json`.
- `catalog.json` swaps `usage` for `defaultExample`.

- [ ] Update tests first: folder fixture, example rewrite, nested barrel, validation messages; watch them fail.
- [ ] Implement discovery + barrel + mirror + `examples.json` + catalog change.
- [ ] `pnpm test` (registry suites green) and `pnpm registry:generate`.

## Task 2: Docs Usage/Examples blocks

**Files:**
- Create: `src/features/components/lib/examples.ts`
- Create: `src/features/components/components/usage-block.tsx`, `examples-block.tsx`
- Modify: `src/features/components/components/component-doc.tsx`, `component-viewer.tsx`
- Modify: `src/features/components/lib/{items,toc,markdown}.ts`
- Test: `src/features/components/lib/toc.test.mts`

**Interfaces:**
- `componentExamples(slug)`, `defaultExample(slug)`, `usageSource(slug)` read `examples.json`.
- `ComponentItem` gains `defaultExample: string`, loses `usage`.
- `<Usage />` = `CodeBlock` of the default source; `<Examples />` = every example, preview above code.
- `mergeDefaultSections` understands `hasUsage`/`hasExamples`.
- `renderComponentMarkdown` expands `<Usage />` and `<Examples />` and appends missing sections.

- [ ] Extend TOC/markdown tests first; watch them fail.
- [ ] Implement the lib + blocks; auto-append order Usage -> Installation -> Source.
- [ ] Viewer renders `componentExamples[slug][defaultExample]`.

## Task 3: Migrate `folder-preview`

**Files:**
- Move: `registry/fixel/components/folder-preview.tsx` -> `registry/fixel/components/folder-preview/folder-preview.tsx`
- Move/replace: `folder-preview.meta.ts` -> `folder-preview/meta.ts`; delete `folder-preview.demo.tsx`
- Create: `folder-preview/examples/{basic,custom-colors,minimal}.tsx`
- Rewrite: `content/components/folder-preview.mdx`

- [ ] `git mv`, add examples, update meta (`example: "basic"`), delete the demo.
- [ ] Article: `<Usage />`, `## Examples` + `<Examples />`, props matching the new API.
- [ ] `pnpm registry:generate && pnpm registry:check`, commit `registry.json` + `public/r`.

## Verification

- [ ] `pnpm exec tsc --noEmit`
- [ ] `pnpm exec biome check` on changed paths
- [ ] `pnpm test`
- [ ] `pnpm registry:check`
- [ ] `pnpm build`
- [ ] Browser pass: catalog card -> detail (Usage + 3 examples) -> live preview (default example)
- [ ] Fresh-context review of the branch
