/**
 * The page as plain markdown.
 *
 * One function feeds both "Copy page" and `/components/<slug>/md`, so the two
 * can never drift. The article body is the authored MDX with its `<Usage />`,
 * `<Examples />`, `<Install />`, and `<Source />` placeholders expanded; an
 * article that authored none of them gets every section appended, in the
 * default order.
 */

type MarkdownFile = { path: string; content: string };

type MarkdownItem = {
  title: string;
  description: string;
  files: MarkdownFile[];
};

type MarkdownArticle = {
  body: string;
  hasUsage: boolean;
  hasExamples: boolean;
  hasInstall: boolean;
  hasSource: boolean;
};

export type MarkdownExample = {
  name: string;
  title: string;
  source: string;
};

export type MarkdownExamples = {
  default: string;
  items: MarkdownExample[];
};

function codeBlock(source: string): string {
  return ["```tsx", source.trimEnd(), "```"].join("\n");
}

function usageSection(examples: MarkdownExamples): string {
  const example =
    examples.items.find((item) => item.name === examples.default) ??
    examples.items[0];

  return ["## Usage", codeBlock(example?.source ?? "")].join("\n\n");
}

function examplesSection(examples: MarkdownExamples): string {
  const blocks = ["## Examples"];

  for (const example of examples.items) {
    blocks.push(`### ${example.title}`);
    blocks.push(codeBlock(example.source));
  }

  return blocks.join("\n\n");
}

function installSection(itemUrl: string): string {
  return [
    "## Installation",
    ["```bash", `pnpm dlx shadcn@latest add ${itemUrl}`, "```"].join("\n"),
  ].join("\n\n");
}

function sourceSection(files: MarkdownFile[]): string {
  const blocks = ["## Source"];

  for (const file of files) {
    blocks.push(`### \`${file.path}\``);
    blocks.push(codeBlock(file.content));
  }

  return blocks.join("\n\n");
}

export function renderComponentMarkdown(
  item: MarkdownItem,
  itemUrl: string,
  article: MarkdownArticle,
  examples?: MarkdownExamples,
): string {
  const install = installSection(itemUrl);
  const source = sourceSection(item.files);

  // Place the sections where the author wrote the placeholders; anything they
  // did not place is appended so the export is always complete.
  let body = article.body.trim();
  const has = (name: string) => new RegExp(`<${name}\\s*\\/>`).test(body);
  const placedUsage = has("Usage") || has("Examples");
  const placedInstall = has("Install");
  const placedSource = has("Source");

  // A placeholder owns its heading: the authored `## Installation` above
  // `<Install />` is replaced together with the placeholder, so the export
  // never emits the same heading twice. A bare placeholder still gains one.
  const usage = examples ? usageSection(examples) : "";
  const exampleList = examples ? examplesSection(examples) : "";

  body = body
    .replace(/##[ \t]+Usage[ \t]*\n+[ \t]*<Usage\s*\/>/, usage)
    .replace(/##[ \t]+Examples[ \t]*\n+[ \t]*<Examples\s*\/>/, exampleList)
    .replace(/##[ \t]+Installation[ \t]*\n+[ \t]*<Install\s*\/>/, install)
    .replace(/##[ \t]+Source[ \t]*\n+[ \t]*<Source\s*\/>/, source);

  // Match the generator's `\s*` tolerance, so `<Usage/>` expands like
  // `<Usage />` instead of leaking raw JSX into the export.
  const expand = (name: string, replacement: string) =>
    body.replace(new RegExp(`<${name}\\s*\\/>`, "g"), () => replacement);

  body = expand("Usage", usage);
  body = expand("Examples", exampleList);
  body = expand("Install", install);
  body = expand("Source", source);

  const blocks = [`# ${item.title}`, item.description, body];
  if (!placedUsage && examples) blocks.push(usageSection(examples));
  if (!placedInstall) blocks.push(install);
  if (!placedSource) blocks.push(source);

  return `${blocks.filter(Boolean).join("\n\n")}\n`;
}
