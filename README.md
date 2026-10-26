<div align="center">
  <img src="https://fixel-ui-v2.vercel.app/og-image.png" alt="Fixel UI" width="100%" />

  <h1>Fixel UI</h1>
  <p><strong>Wireframe UI, ready to build.</strong><br />Installable React illustrations and a curated shelf of interface resources.</p>

  <p>
    <a href="https://fixel-ui-v2.vercel.app/illustration">Browse illustrations</a> ·
    <a href="https://fixel-ui-v2.vercel.app/resources">Explore resources</a> ·
    <a href="CONTRIBUTING.md">Contribute</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16-111111?logo=nextdotjs&logoColor=white" alt="Next.js 16" />
    <img src="https://img.shields.io/badge/React-19-087ea4?logo=react&logoColor=white" alt="React 19" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
    <img src="https://img.shields.io/badge/shadcn%2Fui-registry-004BFF" alt="shadcn/ui registry" />
  </p>
</div>

## What’s inside

- **Illustrations** — coded wireframes of familiar interface patterns, published as installable shadcn registry items.
- **Resources** — a searchable, categorized collection of useful design and development links.
- **A focused preview** — open an illustration on its own page, then move through the catalog with previous and next controls.

## Add an illustration

Install an item into your React project with the shadcn CLI. This example adds the Button illustration and its declared dependencies:

```bash
pnpm dlx shadcn@latest add https://fixel-ui-v2.vercel.app/r/button.json
```

Replace `button` with another illustration slug from the [catalog](https://fixel-ui-v2.vercel.app/illustration).

```tsx
import { ButtonIllustration } from "@/components/illustrations/button";

export function Preview() {
  return <ButtonIllustration />;
}
```

## Run locally

This project uses pnpm. The `dev` command refreshes the local registry files before starting Next.js.

```bash
git clone https://github.com/FadyEmad01/Fixel-UI-v2.git
cd Fixel-UI-v2
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Generate registry data and start the development server. |
| `pnpm build` | Generate and build the shadcn registry, then build the site. |
| `pnpm start` | Serve a production build locally. |
| `pnpm lint` | Check formatting and lint rules with Biome. |
| `pnpm test` | Run the repository’s Node test suite. |
| `pnpm registry:generate` | Refresh the committed registry manifest and local generated files. |
| `pnpm registry:check` | Confirm `registry.json` matches the source items. |
| `pnpm resources:sync` | Refresh names, descriptions, and preview metadata for curated resources. |

## Contributing

Issues and pull requests are welcome. Read the [contribution guide](CONTRIBUTING.md) for the local setup, illustration and resource workflows, and checks to run before opening a PR.

## Project stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · shadcn registry · Biome
