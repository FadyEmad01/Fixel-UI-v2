import assert from "node:assert/strict";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { extractHeadings, parseFrontmatter } from "./mdx.mts";
import {
  buildManifest,
  discoverItems,
  KINDS,
  type Kind,
  renderBarrel,
  rewriteExampleImport,
} from "./registry.mts";
import { validateCatalog } from "./validate.mts";

/**
 * The component kind puts each item in its own folder: the payload, the
 * site-only metadata, and the example files that feed the docs. These tests pin
 * the parts that differ from a flat kind, because an example leaking into an
 * install (or a missing one going unnoticed) is silent breakage.
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

const ITEM = "export default function Thing() { return null; }\n";
const EXAMPLE =
  'import Thing from "../thing";\n\nexport default function Basic() { return <Thing />; }\n';
const META =
  'export default { title: "Thing", category: "UI", tags: ["Motion"], media: { poster: "/components/thing/poster.webp" }, example: "basic" };\n';
const ARTICLE =
  "---\ntitle: Thing\ndescription: A thing for the catalog.\n---\n\n## Usage\n";

function componentFixture(extra: Record<string, string> = {}) {
  return {
    "registry/fixel/components/thing/thing.tsx": ITEM,
    "registry/fixel/components/thing/meta.ts": META,
    "registry/fixel/components/thing/examples/basic.tsx": EXAMPLE,
    ...extra,
  };
}

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

test("frontmatter supplies flat values and leaves the body clean", () => {
  const parsed = parseFrontmatter(
    '---\ntitle: "Thing"\nappend: false\n---\n\n## Usage\n',
  );

  assert.deepEqual(parsed.data, { title: "Thing", append: false });
  assert.equal(parsed.body, "\n## Usage\n");
  assert.deepEqual(parseFrontmatter("## Usage\n"), {
    data: {},
    body: "## Usage\n",
  });
});

test("frontmatter rejects folded and empty values", () => {
  assert.throws(
    () => parseFrontmatter("---\ndescription: >\n  long\n---\n"),
    /single-line/,
  );
  assert.throws(() => parseFrontmatter("---\ntitle:\n---\n"), /single-line/);
});

test("a component's title and description come from its article", async () => {
  const root = await fixture(
    componentFixture({
      "registry/fixel/components/thing/meta.ts":
        'export default { category: "UI", tags: ["Motion"], media: { poster: "/components/thing/poster.webp" } };\n',
      "content/components/thing.mdx":
        "---\ntitle: From the article\ndescription: Written in MDX.\n---\n\n## Usage\n",
    }),
  );

  const item = (await discoverItems(root))[0];

  assert.equal(item?.title, "From the article");
  assert.equal(item?.description, "Written in MDX.");
});

test("a component folder is one item: payload, meta, and examples", async () => {
  const root = await fixture(componentFixture());

  const items = await discoverItems(root);

  assert.deepEqual(
    items.map((item) => item.name),
    ["thing"],
  );

  const item = items[0];
  assert.ok(item);
  assert.equal(
    item.path,
    "registry/fixel/components/thing/thing.tsx",
    "the payload is the installable file",
  );
  assert.equal(item.target, "components/fixel/thing.tsx");
  assert.equal(item.meta.category, "UI");
  assert.equal(item.defaultExample, "basic");
  assert.deepEqual(
    item.examples.map((example) => example.name),
    ["basic"],
  );
});

test("example imports are rewritten to the consumer alias, files are not", async () => {
  const root = await fixture(componentFixture());

  const item = (await discoverItems(root))[0];
  const example = item?.examples[0];

  assert.ok(example);
  assert.match(
    example.content,
    /from "\.\.\/thing"/,
    "the mirror copy keeps resolving",
  );
  assert.match(
    example.source,
    /from "@\/components\/fixel\/thing"/,
    "displayed code must be copy-pasteable",
  );
  assert.equal(example.title, "Basic");
});

test("every sibling import is rewritten, and regex characters in slugs are literal", () => {
  const source = [
    'import Thing from "../thing";',
    'import type { ThingProps } from "../thing";',
  ].join("\n");

  const rewritten = rewriteExampleImport(source, "thing", "@/components/fixel");

  assert.equal(
    rewritten.match(/from "@\/components\/fixel\/thing"/g)?.length,
    2,
    "a value import and a type import both move",
  );

  assert.equal(
    rewriteExampleImport(
      'import Thing from "../button.v2";',
      "button.v2",
      "@/components/fixel",
    ),
    'import Thing from "@/components/fixel/button.v2";',
  );

  assert.equal(
    rewriteExampleImport(
      'import Thing from "../a+b";',
      "a+b",
      "@/components/fixel",
    ),
    'import Thing from "@/components/fixel/a+b";',
    "a slug is not a regex",
  );
});

test("a component installs its payload, never meta or examples", async () => {
  const root = await fixture(componentFixture());
  const manifest = buildManifest(await discoverItems(root));

  const thing = manifest.items.find((item) => item.name === "thing");

  assert.deepEqual(
    thing?.files.map((file) => [file.path, file.target]),
    [
      [
        "registry/fixel/components/thing/thing.tsx",
        "components/fixel/thing.tsx",
      ],
    ],
  );
});

test("the default example falls back to the first file", async () => {
  const root = await fixture(
    componentFixture({
      "registry/fixel/components/thing/meta.ts":
        'export default { title: "Thing", category: "UI", tags: ["Motion"], media: { poster: "/components/thing/poster.webp" } };\n',
      "registry/fixel/components/thing/examples/custom.tsx": EXAMPLE,
    }),
  );

  const item = (await discoverItems(root))[0];

  assert.equal(item?.defaultExample, "basic", "alphabetical, deterministic");
});

test("meta.example wins over the first file", async () => {
  const root = await fixture(
    componentFixture({
      "registry/fixel/components/thing/meta.ts":
        'export default { title: "Thing", category: "UI", tags: ["Motion"], media: { poster: "/components/thing/poster.webp" }, example: "custom" };\n',
      "registry/fixel/components/thing/examples/custom.tsx": EXAMPLE,
    }),
  );

  const item = (await discoverItems(root))[0];

  assert.deepEqual(
    item?.examples.map((example) => example.name),
    ["basic", "custom"],
  );
  assert.equal(item?.defaultExample, "custom");
});

test("the component barrel nests examples under their slug", () => {
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
        path: "registry/fixel/components/thing/thing.tsx",
        target: "components/fixel/thing.tsx",
        content: ITEM,
        examples: [
          {
            name: "basic",
            title: "Basic",
            content: EXAMPLE,
            source: EXAMPLE,
          },
        ],
        defaultExample: "basic",
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
        path: "registry/fixel/components/bare/bare.tsx",
        target: "components/fixel/bare.tsx",
        content: ITEM,
        examples: [],
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
    /"thing": \{\s*"basic": dynamic\(\(\) => import\("\.\/thing\/examples\/basic"\)\),\s*\}/,
  );
  assert.ok(
    !barrel.includes("bare"),
    "an item with no examples cannot be previewed",
  );
});

test("validation names every missing piece", async () => {
  const root = await fixture({
    "registry/fixel/components/thing/thing.tsx": ITEM,
    "registry/fixel/components/thing/meta.ts": META,
  });

  const items = await discoverItems(root);
  const issues = await validateCatalog(items, root);

  assert.ok(
    issues.some((issue) => issue.includes("examples/")),
    "a missing example must be reported",
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

test("validation reports a default example that does not exist", async () => {
  const root = await fixture(
    componentFixture({
      "registry/fixel/components/thing/meta.ts":
        'export default { title: "Thing", category: "UI", tags: ["Motion"], media: { poster: "/components/thing/poster.webp" }, example: "missing" };\n',
      "content/components/thing.mdx": ARTICLE,
      "public/components/thing/poster.webp": "binary",
    }),
  );

  const issues = await validateCatalog(await discoverItems(root), root);

  assert.ok(issues.some((issue) => issue.includes('example "missing"')));
});

test("validation passes once examples, article, and poster exist", async () => {
  const root = await fixture(
    componentFixture({
      "content/components/thing.mdx": ARTICLE,
      "public/components/thing/poster.webp": "binary",
    }),
  );

  const items = await discoverItems(root);

  assert.deepEqual(await validateCatalog(items, root), []);
});

test("an author is optional, but its link must be http(s)", async () => {
  const valid = await fixture(
    componentFixture({
      "registry/fixel/components/thing/meta.ts":
        'export default { title: "Thing", category: "UI", tags: ["Motion"], media: { poster: "/components/thing/poster.webp" }, author: { name: "Fady Emad", url: "https://github.com/FadyEmad01" } };\n',
      "content/components/thing.mdx": ARTICLE,
      "public/components/thing/poster.webp": "binary",
    }),
  );

  const items = await discoverItems(valid);

  assert.deepEqual(items[0]?.meta.author, {
    name: "Fady Emad",
    url: "https://github.com/FadyEmad01",
  });
  assert.deepEqual(await validateCatalog(items, valid), []);

  const unsafe = await fixture(
    componentFixture({
      "registry/fixel/components/thing/meta.ts":
        'export default { title: "Thing", category: "UI", tags: ["Motion"], media: { poster: "/components/thing/poster.webp" }, author: { name: "Thing", url: "javascript:alert(1)" } };\n',
      "content/components/thing.mdx": ARTICLE,
      "public/components/thing/poster.webp": "binary",
    }),
  );

  const issues = await validateCatalog(await discoverItems(unsafe), unsafe);

  assert.ok(issues.some((issue) => issue.includes("author.url")));
});

test("validation reports a component with no category or tags", async () => {
  const root = await fixture({
    "registry/fixel/components/thing/thing.tsx": ITEM,
    "registry/fixel/components/thing/meta.ts":
      'export default { title: "Thing" };\n',
    "registry/fixel/components/thing/examples/basic.tsx": EXAMPLE,
    "content/components/thing.mdx": ARTICLE,
    "public/components/thing/poster.webp": "binary",
  });

  const issues = await validateCatalog(await discoverItems(root), root);

  assert.ok(issues.some((issue) => issue.includes("category")));
  assert.ok(issues.some((issue) => issue.includes("tag")));
});

test("validation rejects flat files and folders without a payload", async () => {
  const root = await fixture(
    componentFixture({
      "content/components/thing.mdx": ARTICLE,
      "public/components/thing/poster.webp": "binary",
      // The previous flat shape, which discovery now ignores.
      "registry/fixel/components/legacy.tsx": ITEM,
      // A folder that looks like an item but has no payload.
      "registry/fixel/components/empty/meta.ts": META,
    }),
  );

  const issues = await validateCatalog(await discoverItems(root), root);

  assert.ok(
    issues.some((issue) => issue.includes("legacy.tsx")),
    "a flat file must be reported",
  );
  assert.ok(
    issues.some((issue) => issue.includes("empty/empty.tsx")),
    "a folder without its payload must be reported",
  );
});
