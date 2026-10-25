/**
 * The install surfaces a visitor can copy from.
 *
 * Everything here is plain string building so the same command that renders on
 * the page is the one written into the markdown export.
 */

export const PACKAGE_MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const;

export type PackageManager = (typeof PACKAGE_MANAGERS)[number];

const RUNNERS: Record<PackageManager, string> = {
  pnpm: "pnpm dlx",
  npm: "npx",
  yarn: "yarn dlx",
  bun: "bunx --bun",
};

const ADDERS: Record<PackageManager, string> = {
  pnpm: "pnpm add",
  npm: "npm install",
  yarn: "yarn add",
  bun: "bun add",
};

/** Where `shadcn build` publishes the item, e.g. `https://site/r/kbd.json`. */
export function installUrl(site: URL, slug: string): string {
  return new URL(`/r/${slug}.json`, site).toString();
}

/** One `shadcn add` command per package manager. */
export function addCommands(target: string): Record<PackageManager, string> {
  return Object.fromEntries(
    PACKAGE_MANAGERS.map((pm) => [
      pm,
      `${RUNNERS[pm]} shadcn@latest add ${target}`,
    ]),
  ) as Record<PackageManager, string>;
}

/** One dependency-install command per package manager. */
export function dependencyCommands(
  packages: string[],
): Record<PackageManager, string> {
  const list = packages.join(" ");
  return Object.fromEntries(
    PACKAGE_MANAGERS.map((pm) => [pm, `${ADDERS[pm]} ${list}`]),
  ) as Record<PackageManager, string>;
}

/** The consumer import + JSX a visitor pastes after installing. */
export function usageSnippet(slug: string, componentName: string): string {
  return `import { ${componentName} } from "@/components/illustrations/${slug}";

<${componentName} />`;
}

/** v0 accepts a registry item URL and scaffolds the component from it. */
export function v0Url(itemUrl: string): string {
  return `https://v0.dev/chat/api/open?url=${encodeURIComponent(itemUrl)}`;
}

/** The question handed to an assistant, short enough to survive a URL. */
export function assistantPrompt(
  title: string,
  componentName: string,
  itemUrl: string,
): string {
  return `Add the "${title}" illustration from the Fixel UI registry to my React project. Install it with \`pnpm dlx shadcn@latest add ${itemUrl}\`, import \`${componentName}\`, and render it centered in a bordered preview panel.`;
}

export type Assistant = { id: string; label: string; href: string };

/** The assistants a visitor can hand the prompt to. */
export function assistantLinks(prompt: string): Assistant[] {
  const query = encodeURIComponent(prompt);
  return [
    {
      id: "chatgpt",
      label: "ChatGPT",
      href: `https://chatgpt.com/?q=${query}`,
    },
    { id: "claude", label: "Claude", href: `https://claude.ai/new?q=${query}` },
    { id: "scira", label: "Scira", href: `https://scira.ai/?q=${query}` },
  ];
}
