import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const root = process.cwd();

const domains = {
  ui: {
    registryType: "registry:component",
    kind: "component",
  },

  block: {
    registryType: "registry:block",
    kind: "block",
  },

  illustration: {
    registryType: "registry:component",
    kind: "illustration",
  },

  animation: {
    registryType: "registry:component",
    kind: "animation",
  },

  easing: {
    registryType: "registry:item",
    kind: "easing",
  },

  effect: {
    registryType: "registry:component",
    kind: "effect",
  },

  hook: {
    registryType: "registry:hook",
    kind: "hook",
  },

  utility: {
    registryType: "registry:lib",
    kind: "utility",
  },
};

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

function success(message) {
  console.log(`✓ ${message}`);
}

function isValidSlug(value) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function createFile(path, content) {
  mkdirSync(dirname(path), {
    recursive: true,
  });

  writeFileSync(path, content);
}

function updateDomainRegistry(domainRoot, resourceName) {
  const domainRegistryPath = join(domainRoot, "registry.json");
  const registry = existsSync(domainRegistryPath)
    ? JSON.parse(readFileSync(domainRegistryPath, "utf8"))
    : {
        $schema: "https://ui.shadcn.com/schema/registry.json",
      };
  const resourcePath = `${resourceName}/registry.json`;

  if (!Array.isArray(registry.include)) {
    registry.include = [];
  }

  delete registry.items;

  if (!registry.include.includes(resourcePath)) {
    registry.include.push(resourcePath);
  }

  createFile(domainRegistryPath, `${JSON.stringify(registry, null, 2)}\n`);
}

const [, , rawDomain, rawName] = process.argv;

if (!rawDomain || !rawName) {
  fail(
    "Usage: pnpm generate <domain> <name>\n\n" +
      "Example:\n" +
      "pnpm generate animation magnetic-button",
  );
}

const domain = rawDomain.trim().toLowerCase();
const name = rawName.trim().toLowerCase();

const domainConfig = domains[domain];

if (!domainConfig) {
  fail(
    `Unknown domain "${domain}".\n\n` +
      `Available domains:\n` +
      Object.keys(domains)
        .map((item) => `- ${item}`)
        .join("\n"),
  );
}

if (!isValidSlug(name)) {
  fail(`Invalid resource name "${name}". Use kebab-case.`);
}

const resourceDir = resolve(
  root,
  "registry",
  domain === "ui" ? "ui" : `${domain}s`,
  name,
);
const domainRoot = resolve(
  root,
  "registry",
  domain === "ui" ? "ui" : `${domain}s`,
);

if (existsSync(resourceDir)) {
  fail(`Resource "${domain}/${name}" already exists.`);
}

const registryPath = join(resourceDir, "registry.json");

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  items: [
    {
      name,
      type: domainConfig.registryType,
      title: name
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      description: `A ${name} resource.`,
      files: [
        {
          path:
            domain === "easing" || domain === "utility" || domain === "hook"
              ? `code/${name}.ts`
              : `code/${name}.tsx`,
          type: domainConfig.registryType,
        },
      ],
      meta: {
        kind: domainConfig.kind,
        tags: [],
        preview: {
          renderer: domain === "easing" ? "easing" : "react",
          source: name,
        },
        sections: [
          {
            type: "preview",
          },
          {
            type: "source",
          },
        ],
        status: "draft",
      },
    },
  ],
};

createFile(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
updateDomainRegistry(domainRoot, name);

const sourceExtension =
  domain === "hook" || domain === "easing" || domain === "utility"
    ? "ts"
    : "tsx";

const sourcePath = join(resourceDir, "code", `${name}.${sourceExtension}`);

const previewPath = join(resourceDir, "preview", `${name}-preview.tsx`);

const demoPath = join(resourceDir, "demo", "default.tsx");

const contentDomain = domain === "ui" ? "ui" : `${domain}s`;

const documentationPath = resolve(
  root,
  "content",
  "docs",
  contentDomain,
  `${name}.mdx`,
);

if (sourceExtension === "tsx") {
  createFile(
    sourcePath,
    `export function ${name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("")}() {
  return null;
}
`,
  );
} else {
  createFile(
    sourcePath,
    `export {};
`,
  );
}

createFile(
  previewPath,
  `import { ${name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")} } from "../code/${name}";

export function ${name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")}Preview() {
  return <${name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")} />;
}
`,
);

createFile(
  demoPath,
  `export default function Demo() {
  return null;
}
`,
);

createFile(
  documentationPath,
  `---
id: ${name}
---

# ${name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")}

TODO: Document this resource.
`,
);

success(`Generated ${domain}/${name}`);

console.log(`
Created:

registry/${domain === "ui" ? "ui" : `${domain}s`}/${name}/
├── registry.json
├── code/
├── preview/
└── demo/

content/docs/${contentDomain}/${name}.mdx
`);
