import assert from "node:assert/strict";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { extractHeadings } from "./mdx.mts";
import { discoverItems, KINDS, type Kind, renderBarrel } from "./registry.mts";
import { validateCatalog } from "./validate.mts";

/**
 * The component kind reuses the illustration pipeline: one installable file per
 * item, plus a registry-only demo that the site renders live. These tests pin
 * the parts that differ, because a demo leaking into an install is silent
 * breakage for every consumer.
 */

function componentsKind(): Kind {
  const kind = KINDS.find((candidate) => candidate.kind === "component");
  assert.ok(kind, "the registry must declare a component kind");
  return kind;
}

async function fixture(files: Record<string, string>): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "fixel-registry-"));

  for (const [path, content] of Object.entries(files)) {
    const file = join(root, path);
    await mkdir(join(file, ".."), { recursive: true });
    await writeFile(file, content, "utf8");
  }

  return root;
}

const ITEM = "export function Thing() { return null; }\n";
const DEMO =
  'import { Thing } from "./thing";\n\nexport default function Demo() { return <Thing />; }\n';
const META =
  'export default { title: "Thing", category: "UI", tags: ["Motion"], media: { poster: "/components/thing/poster.webp" } };\n';

test("headings come from markdown, never from fenced code", () => {
  const markdown = [
    "# Page title",
    "",
    "## Installation",
    "",
    "```tsx",
    "## not a heading",
    "```",
    "",
    "### Usage",
    "",
    "## Usage",
    "",
  ].join("\n");

  assert.deepEqual(extractHeadings(markdown), [
    { id: "installation", label: "Installation", depth: 2 },
    { id: "usage", label: "Usage", depth: 3 },
    { id: "usage-1", label: "Usage", depth: 2 },
  ]);
});

test("heading labels drop inline markdown so anchors match rehype-slug", () => {
  assert.deepEqual(extractHeadings("## **Bold** and `code`"), [
    { id: "bold-and-code", label: "Bold and code", depth: 2 },
  ]);
});

test("demo files are never installable items", async () => {
  const root = await fixture({
    "registry/fixel/components/thing.tsx": ITEM,
    "registry/fixel/components/thing.demo.tsx": DEMO,
    "registry/fixel/components/thing.meta.ts": META,
  });

  const items = await discoverItems(root);

  assert.deepEqual(
    items.map((item) => item.name),
    ["thing"],
  );
  assert.equal(items[0]?.target, "components/fixel/thing.tsx");
  assert.match(items[0]?.demoContent ?? "", /Demo/);
  assert.equal(items[0]?.meta.category, "UI");
  assert.deepEqual(items[0]?.meta.tags, ["Motion"]);
});

test("the component barrel lazy-loads each demo and skips items without one", () => {
  const kind = componentsKind();
  const barrel = renderBarrel(
    [
      {
        name: "thing",
        kind: kind.kind,
        section: kind.section,
        type: kind.type,
        title: "Thing",
        description: "",
        hidden: false,
        shared: false,
        path: "registry/fixel/components/thing.tsx",
        target: "components/fixel/thing.tsx",
        content: ITEM,
        demoContent: DEMO,
        meta: {},
        dependencies: [],
        registryDependencies: [],
      },
      {
        name: "bare",
        kind: kind.kind,
        section: kind.section,
        type: kind.type,
        title: "Bare",
        description: "",
        hidden: false,
        shared: false,
        path: "registry/fixel/components/bare.tsx",
        target: "components/fixel/bare.tsx",
        content: ITEM,
        meta: {},
        dependencies: [],
        registryDependencies: [],
      },
    ],
    kind,
  );

  assert.match(barrel, /import dynamic from "next\/dynamic"/);
  assert.match(
    barrel,
    /"thing": dynamic\(\(\) => import\("\.\/thing\.demo"\)\)/,
  );
  assert.ok(
    !barrel.includes("bare"),
    "an item with no demo cannot be previewed",
  );
});

test("validation names every missing piece", async () => {
  const root = await fixture({
    "registry/fixel/components/thing.tsx": ITEM,
    "registry/fixel/components/thing.meta.ts": META,
  });

  const items = await discoverItems(root);
  const issues = await validateCatalog(items, root);

  assert.ok(
    issues.some((issue) => issue.includes("thing.demo.tsx")),
    "a missing demo must be reported",
  );
  assert.ok(
    issues.some((issue) => issue.includes("content/components/thing.mdx")),
    "a missing article must be reported",
  );
  assert.ok(
    issues.some((issue) => issue.includes("components/thing/poster.webp")),
    "a missing poster must be reported",
  );
});

test("validation passes once demo, article, and poster exist", async () => {
  const root = await fixture({
    "registry/fixel/components/thing.tsx": ITEM,
    "registry/fixel/components/thing.demo.tsx": DEMO,
    "registry/fixel/components/thing.meta.ts": META,
    "content/components/thing.mdx": "## Usage\n",
    "public/components/thing/poster.webp": "binary",
  });

  const items = await discoverItems(root);

  assert.deepEqual(await validateCatalog(items, root), []);
});

test("validation reports a component with no category or tags", async () => {
  const root = await fixture({
    "registry/fixel/components/thing.tsx": ITEM,
    "registry/fixel/components/thing.demo.tsx": DEMO,
    "registry/fixel/components/thing.meta.ts":
      'export default { title: "Thing" };\n',
    "content/components/thing.mdx": "## Usage\n",
    "public/components/thing/poster.webp": "binary",
  });

  const issues = await validateCatalog(await discoverItems(root), root);

  assert.ok(issues.some((issue) => issue.includes("category")));
  assert.ok(issues.some((issue) => issue.includes("tag")));
});
