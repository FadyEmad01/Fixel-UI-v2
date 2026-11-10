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

test("an article with no placeholders still gets every default section", () => {
  const entries = mergeDefaultSections({
    headings: [],
    hasUsage: false,
    hasExamples: false,
    hasInstall: false,
    hasSource: false,
  });

  assert.deepEqual(
    entries.map((entry) => entry.id),
    ["usage", "installation", "source"],
  );
});

test("Examples is the usage section, so it is not appended twice", () => {
  const entries = mergeDefaultSections({
    headings: [{ id: "examples", label: "Examples", depth: 2 }],
    hasUsage: false,
    hasExamples: true,
    hasInstall: true,
    hasSource: true,
  });

  assert.deepEqual(
    entries.map((entry) => entry.id),
    ["examples"],
  );
});

test("authored Install and Source sections are never duplicated", () => {
  const entries = mergeDefaultSections({
    headings: [
      { id: "source", label: "Source", depth: 2 },
      { id: "installation", label: "Installation", depth: 2 },
    ],
    hasUsage: true,
    hasExamples: false,
    hasInstall: true,
    hasSource: true,
  });

  assert.deepEqual(
    entries.map((entry) => entry.id),
    ["source", "installation"],
  );
});

test("a component with only Source authored gains Usage and Installation", () => {
  const entries = mergeDefaultSections({
    headings: [{ id: "source", label: "Source", depth: 2 }],
    hasUsage: false,
    hasExamples: false,
    hasInstall: false,
    hasSource: true,
  });

  assert.deepEqual(
    entries.map((entry) => entry.id),
    ["source", "usage", "installation"],
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

const EXAMPLES = {
  default: "basic",
  items: [
    {
      name: "basic",
      title: "Basic",
      source: 'import Thing from "@/components/fixel/thing";\n\n<Thing />;',
    },
    {
      name: "custom",
      title: "Custom",
      source: 'import Thing from "@/components/fixel/thing";\n\n<Thing big />;',
    },
  ],
};

test("markdown expands the authored placeholders", () => {
  const markdown = renderComponentMarkdown(
    ITEM,
    "https://example.com/r/thing.json",
    {
      body: "## Usage\n\n<Usage />\n\n## Examples\n\n<Examples />\n\n## Installation\n\n<Install />\n\n## Source\n\n<Source />",
      hasUsage: true,
      hasExamples: true,
      hasInstall: true,
      hasSource: true,
    },
    EXAMPLES,
  );

  assert.match(markdown, /^# Thing\n\nDoes things\./);
  assert.match(
    markdown,
    /pnpm dlx shadcn@latest add https:\/\/example\.com\/r\/thing\.json/,
  );
  assert.match(
    markdown,
    /## Usage\n\n```tsx\nimport Thing from "@\/components\/fixel\/thing"/,
  );
  assert.match(markdown, /### Basic/);
  assert.match(markdown, /### Custom/);
  assert.match(markdown, /### `components\/fixel\/thing\.tsx`/);
  assert.equal(markdown.match(/## Installation/g)?.length, 1);
  assert.equal(markdown.match(/## Source/g)?.length, 1);
  assert.ok(!markdown.includes("<Usage />"));
  assert.ok(!markdown.includes("<Examples />"));
});

test("a placeholder without a space still expands exactly once", () => {
  const markdown = renderComponentMarkdown(
    ITEM,
    "https://example.com/r/thing.json",
    {
      body: "## Usage\n\n<Usage/>\n\n## Installation\n\n<Install/>\n\n## Source\n\n<Source/>",
      hasUsage: true,
      hasExamples: false,
      hasInstall: true,
      hasSource: true,
    },
    EXAMPLES,
  );

  assert.equal(markdown.match(/## Usage/g)?.length, 1);
  assert.equal(markdown.match(/## Installation/g)?.length, 1);
  assert.equal(markdown.match(/## Source/g)?.length, 1);
  assert.ok(!markdown.includes("<Usage/>"));
  assert.ok(!markdown.includes("<Install/>"));
  assert.ok(!markdown.includes("<Source/>"));
});

test("markdown appends missing sections in the default order", () => {
  const markdown = renderComponentMarkdown(
    ITEM,
    "https://example.com/r/thing.json",
    {
      body: "Just prose.",
      hasUsage: false,
      hasExamples: false,
      hasInstall: false,
      hasSource: false,
    },
    EXAMPLES,
  );

  assert.match(markdown, /Just prose\./);
  assert.match(markdown, /## Usage/);
  assert.match(markdown, /## Installation/);
  assert.match(markdown, /## Source/);
  assert.ok(
    markdown.indexOf("## Usage") < markdown.indexOf("## Installation"),
    "the default order is Usage then Installation",
  );
  assert.ok(
    markdown.indexOf("## Installation") < markdown.indexOf("## Source"),
    "the default order is Installation then Source",
  );
});

test("markdown without examples never invents a usage snippet", () => {
  const markdown = renderComponentMarkdown(
    ITEM,
    "https://example.com/r/thing.json",
    {
      body: "Just prose.",
      hasUsage: false,
      hasExamples: false,
      hasInstall: false,
      hasSource: false,
    },
  );

  assert.ok(!markdown.includes("## Usage"));
});
