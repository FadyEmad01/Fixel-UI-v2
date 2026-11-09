/**
 * The page as plain markdown.
 *
 * One function feeds both "Copy page" and `/components/<slug>/md`, so the two
 * can never drift. The article body is the authored MDX with its `<Install />`
 * and `<Source />` placeholders expanded; an article that authored neither gets
 * both sections appended, in the default order.
 */

type MarkdownFile = { path: string; content: string };

type MarkdownItem = {
  title: string;
  description: string;
  files: MarkdownFile[];
};

type MarkdownArticle = {
  body: string;
  hasInstall: boolean;
  hasSource: boolean;
};

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
    blocks.push(["```tsx", file.content.trimEnd(), "```"].join("\n"));
  }

  return blocks.join("\n\n");
}

export function renderComponentMarkdown(
  item: MarkdownItem,
  itemUrl: string,
  article: MarkdownArticle,
): string {
  const install = installSection(itemUrl);
  const source = sourceSection(item.files);

  // Place the sections where the author wrote the placeholders; anything they
  // did not place is appended so the export is always installable.
  let body = article.body.trim();
  const placedInstall = body.includes("<Install />");
  const placedSource = body.includes("<Source />");

  body = body.replace("<Install />", install).replace("<Source />", source);

  const blocks = [`# ${item.title}`, item.description, body];
  if (!placedInstall) blocks.push(install);
  if (!placedSource) blocks.push(source);

  return `${blocks.filter(Boolean).join("\n\n")}\n`;
}
