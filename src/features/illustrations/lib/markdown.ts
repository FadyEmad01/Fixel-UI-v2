import { usageSnippet } from "./install";
import { componentName, type Illustration } from "./items";

/**
 * The page as plain markdown.
 *
 * One function feeds both "Copy page" and `/illustration/<slug>/md`, so the two
 * can never drift. The source section repeats the files a consumer receives,
 * including the shared kit, because a reader pasting this into an assistant
 * needs the whole install.
 */
export function illustrationMarkdown(
  illustration: Illustration,
  install: string,
): string {
  const name = componentName(illustration.slug);
  const blocks: string[] = [];

  blocks.push(`# ${illustration.title}`);
  blocks.push(illustration.description);

  blocks.push("## Installation");
  blocks.push(
    ["```bash", `pnpm dlx shadcn@latest add ${install}`, "```"].join("\n"),
  );

  blocks.push("## Usage");
  blocks.push(
    ["```tsx", usageSnippet(illustration.slug, name), "```"].join("\n"),
  );

  blocks.push("## Source");

  for (const file of illustration.files) {
    blocks.push(`### \`${file.path}\``);
    blocks.push(["```tsx", file.content.trimEnd(), "```"].join("\n"));
  }

  return `${blocks.join("\n\n")}\n`;
}
