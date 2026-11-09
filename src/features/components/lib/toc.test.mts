import assert from "node:assert/strict";
import { test } from "node:test";

import { categorySlug, componentHref, previewHref } from "./href.ts";
import { renderComponentMarkdown } from "./markdown.ts";
import { mergeDefaultSections } from "./toc.ts";

/**
 * The pieces of the components docs that are pure string work.
 *
 * They are pinned here because three surfaces share them: the detail page TOC,
 * the "Copy page" action, and `/components/<slug>/md`. A drift between those is
 * invisible in the UI and only shows up in whatever a visitor pasted into an
 * assistant.
 */

test("categories become URL segments", () => {
  assert.equal(categorySlug("UI"), "ui");
  assert.equal(categorySlug("Text Effects"), "text-effects");
  assert.equal(categorySlug("  Inputs & Forms  "), "inputs-forms");
  assert.equal(categorySlug("Scroll/Linked"), "scroll-linked");
});

test("component and preview URLs follow the supplied mock", () => {
  assert.equal(componentHref("folder-preview"), "/components/folder-preview");
  assert.equal(
    previewHref("UI", "folder-preview"),
    "/preview/ui/folder-preview",
  );
});

test("an article with no Install or Source still gets both, in that order", () => {
  const entries = mergeDefaultSections({
    headings: [{ id: "usage", label: "Usage", depth: 2 }],
    hasInstall: false,
    hasSource: false,
  });

  assert.deepEqual(
    entries.map((entry) => entry.id),
    ["usage", "installation", "source"],
  );
});

test("authored Install and Source sections are never duplicated", () => {
  const entries = mergeDefaultSections({
    headings: [
      { id: "source", label: "Source", depth: 2 },
      { id: "installation", label: "Installation", depth: 2 },
    ],
    hasInstall: true,
    hasSource: true,
  });

  assert.deepEqual(
    entries.map((entry) => entry.id),
    ["source", "installation"],
  );
});

test("a component with only Source authored gains Installation", () => {
  const entries = mergeDefaultSections({
    headings: [{ id: "source", label: "Source", depth: 2 }],
    hasInstall: false,
    hasSource: true,
  });

  assert.deepEqual(
    entries.map((entry) => entry.id),
    ["source", "installation"],
  );
});

const ITEM = {
  slug: "thing",
  title: "Thing",
  description: "Does things.",
  files: [
    {
      path: "components/fixel/thing.tsx",
      content: "export default function Thing() { return null; }",
    },
  ],
};

test("markdown expands the authored placeholders", () => {
  const markdown = renderComponentMarkdown(
    ITEM,
    "https://example.com/r/thing.json",
    {
      body: "## Usage\n\nPut it somewhere.",
      hasInstall: true,
      hasSource: true,
    },
  );

  assert.match(markdown, /^# Thing\n\nDoes things\./);
  assert.match(
    markdown,
    /pnpm dlx shadcn@latest add https:\/\/example\.com\/r\/thing\.json/,
  );
  assert.match(markdown, /## Usage\n\nPut it somewhere\./);
  assert.match(markdown, /### `components\/fixel\/thing\.tsx`/);
  assert.equal(markdown.match(/## Installation/g)?.length, 1);
  assert.equal(markdown.match(/## Source/g)?.length, 1);
});

test("markdown appends both sections when the article authored neither", () => {
  const markdown = renderComponentMarkdown(
    ITEM,
    "https://example.com/r/thing.json",
    { body: "Just prose.", hasInstall: false, hasSource: false },
  );

  assert.match(markdown, /Just prose\./);
  assert.match(markdown, /## Installation/);
  assert.match(markdown, /## Source/);
  assert.ok(
    markdown.indexOf("## Installation") < markdown.indexOf("## Source"),
    "the default order is Installation then Source",
  );
});
