# Component Platform — Architecture & Development Guide

> **Status:** Foundation / Initial Architecture
> **Purpose:** This document is the source of truth for the project's architecture, folder structure, tooling, content model, registry system, development workflow, testing strategy, and future integrations.

---

# 1. Project Vision

This project is a scalable frontend platform for building, documenting, previewing, and distributing reusable frontend resources.

The platform is not only a component library.

It can contain:

* UI components
* Blocks
* Coded illustrations
* Animations
* Easing curves
* Visual effects
* Hooks
* Utilities
* Patterns
* Templates
* Future resource types

Every resource should have:

* Production-ready source code
* A dedicated preview
* One or more demos
* Metadata
* Installation information
* Dependencies
* Optional API requirements
* Documentation
* Code examples
* Source-code viewing
* Optional interactive playgrounds

The architecture must allow the platform to grow from a small number of resources to hundreds of resources without requiring repeated changes to application-level logic.

---

# 2. Core Architectural Principles

## 2.1 Single Source of Truth

Production code must exist in one canonical location.

Documentation, previews, demos, and code explanations must reference or import that source rather than duplicating its implementation.

Bad:

```text
code/
preview/
    duplicated implementation
```

Good:

```text
code/
    canonical implementation

preview/
    imports canonical implementation

demo/
    imports canonical implementation
```

---

## 2.2 Separate Responsibilities

The system has several independent responsibilities.

### Registry

Responsible for:

* distributable source files
* installation metadata
* npm dependencies
* registry dependencies
* shadcn-compatible metadata

### Content / MDX

Responsible for:

* documentation
* explanations
* tutorials
* code explanations
* usage instructions
* educational content

### Catalog

Responsible for:

* discovering resources
* normalizing registry + documentation data
* filtering
* searching
* sorting
* collection-level queries

### Preview System

Responsible for:

* rendering resource previews
* supporting different renderer types
* fullscreen mode
* responsive preview containers
* interactive previews

### Detail Section System

Responsible for:

* deciding what sections appear on a resource details page
* composing resource-specific documentation layouts

### Code System

Responsible for:

* syntax highlighting
* code headers
* file names
* line numbers
* diff notation
* focused lines
* highlighted lines
* copy functionality
* code explanations
* code chunks

---

# 3. Important Taxonomy Rule

There are two different concepts:

## 3.1 Platform Content Type

This describes what the resource means to the user.

```ts
type CatalogKind =
  | "component"
  | "block"
  | "illustration"
  | "animation"
  | "easing"
  | "effect"
  | "hook"
  | "utility"
  | "pattern"
  | "template"
  | "page";
```

This value belongs to the platform.

Example:

```ts
kind: "illustration"
```

---

## 3.2 Registry Type

This describes how the resource is distributed through the shadcn registry system.

It must remain separate from `CatalogKind`.

Example:

```ts
registryType: "registry:component"
```

A coded illustration may technically be distributed as a registry component while still being:

```ts
kind: "illustration"
```

Never use the shadcn registry `type` as the platform's user-facing taxonomy.

---

# 4. Registry Architecture

The registry must be organized by domain.

Do not place every resource inside one `items/` directory.

Preferred structure:

```text
registry/
├── registry.json
│
├── ui/
│   ├── registry.json
│   └── ...
│
├── blocks/
│   ├── registry.json
│   └── ...
│
├── illustrations/
│   ├── registry.json
│   └── ...
│
├── animations/
│   ├── registry.json
│   └── ...
│
├── easings/
│   ├── registry.json
│   └── ...
│
├── effects/
│   ├── registry.json
│   └── ...
│
├── hooks/
│   ├── registry.json
│   └── ...
│
└── utilities/
    ├── registry.json
    └── ...
```

The root registry composes the individual domain registries.

Example:

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "fixel-ui",
  "homepage": "https://example.com",
  "include": [
    "ui/registry.json",
    "blocks/registry.json",
    "illustrations/registry.json",
    "animations/registry.json",
    "easings/registry.json",
    "effects/registry.json",
    "hooks/registry.json",
    "utilities/registry.json"
  ]
}
```

The source tree remains domain-oriented while the generated public registry can remain unified.

---

# 5. Item-Level Registry Structure

Every individual resource must be self-contained.

Example:

```text
registry/
└── blocks/
    └── hero-01/
        ├── registry.json
        │
        ├── code/
        │   ├── hero-01.tsx
        │   └── hero-01-content.tsx
        │
        ├── preview/
        │   └── hero-01-preview.tsx
        │
        └── demo/
            ├── default.tsx
            └── with-image.tsx
```

Another example:

```text
registry/
└── animations/
    └── magnetic-button/
        ├── registry.json
        │
        ├── code/
        │   └── magnetic-button.tsx
        │
        ├── preview/
        │   └── magnetic-button-preview.tsx
        │
        └── demo/
            ├── default.tsx
            └── playground.tsx
```

Another:

```text
registry/
└── easings/
    └── ease-out-expo/
        ├── registry.json
        │
        ├── code/
        │   └── ease-out-expo.ts
        │
        ├── preview/
        │   └── ease-out-expo-preview.tsx
        │
        └── demo/
            └── playground.tsx
```

---

# 6. Meaning of `code`, `preview`, and `demo`

## `code/`

Canonical production source.

This is the source that can be distributed to a user.

Do not put showcase-only code here.

---

## `preview/`

Optimized presentation of the resource for the platform.

Preview code must import and render the canonical source whenever possible.

Example:

```tsx
import { PortfolioCard } from "../code/portfolio-card";

export function PortfolioCardPreview() {
  return (
    <PortfolioCard
      image="/og-image.png"
    />
  );
}
```

The preview must not duplicate the component implementation.

---

## `demo/`

Examples of usage.

A resource may have multiple demos:

```text
demo/
├── default.tsx
├── dark.tsx
├── responsive.tsx
├── with-custom-content.tsx
└── playground.tsx
```

Demos are platform/showcase code and are not automatically distributed as production source.

---

# 7. Registry Metadata

Each registry item should contain standard registry fields plus platform-specific metadata.

Example:

```json
{
  "name": "magnetic-button",
  "type": "registry:component",
  "title": "Magnetic Button",
  "description": "A button with magnetic cursor interaction.",
  "dependencies": [
    "motion"
  ],
  "files": [
    {
      "path": "code/magnetic-button.tsx",
      "type": "registry:component"
    }
  ],
  "meta": {
    "kind": "animation",
    "tags": [
      "motion",
      "interaction",
      "button"
    ],
    "preview": {
      "renderer": "react",
      "source": "magnetic-button"
    }
  }
}
```

Platform-specific information belongs under `meta`.

Do not overload standard registry fields with application-specific meanings.

---

# 8. Catalog Data Model

The application should work with a normalized internal model instead of consuming raw registry data directly.

Example:

```ts
export interface CatalogItem {
  id: string;

  title: string;

  description: string;

  kind: CatalogKind;

  registryType: RegistryType;

  tags: string[];

  preview: PreviewConfig;

  sections: DetailSection[];

  dependencies: string[];

  registryDependencies: string[];

  status: "draft" | "published" | "deprecated";
}
```

The catalog adapter is responsible for transforming registry data and documentation data into this model.

---

# 9. Preview Architecture

Different resources require different visual renderers.

Do not assume every preview is a React component.

Supported renderer types should be extensible.

Initial renderer types:

```ts
type PreviewConfig =
  | {
      renderer: "react";
      source: string;
    }
  | {
      renderer: "image";
      src: string;
      alt: string;
    }
  | {
      renderer: "video";
      src: string;
      poster?: string;
    }
  | {
      renderer: "svg";
      source: string;
    }
  | {
      renderer: "easing";
      source: string;
    }
  | {
      renderer: "code";
      file: string;
      language: string;
    }
  | {
      renderer: "none";
    };
```

Future renderers may include:

```text
iframe
sandbox
canvas
three
webgl
chart
audio
playground
```

Do not introduce these until they are actually needed.

---

# 10. Preview Renderer Registry

Preview renderers should be registered centrally.

Example:

```text
src/
└── registry/
    └── preview/
        ├── renderers/
        │   ├── react-renderer.tsx
        │   ├── image-renderer.tsx
        │   ├── video-renderer.tsx
        │   ├── svg-renderer.tsx
        │   ├── easing-renderer.tsx
        │   └── code-renderer.tsx
        │
        └── registry.ts
```

The application should not dynamically import arbitrary paths from user-controlled metadata.

Only registered preview sources may be rendered.

This provides a safe and maintainable boundary between metadata and executable code.

---

# 11. Detail Page Architecture

Not every resource should have the same detail-page sections.

A component may need:

```text
Preview
Installation
Dependencies
Props
API
Source
Documentation
```

An easing may need:

```text
Preview
Formula
Parameters
Interactive Playground
Examples
Source
```

An animation may need:

```text
Preview
Motion Configuration
Timing
Easing
Accessibility
Reduced Motion
Source
```

Therefore the detail page must be composable.

---

# 12. Detail Section Registry

Create reusable sections:

```text
src/
└── registry/
    └── sections/
        ├── preview/
        ├── installation/
        ├── dependencies/
        ├── props/
        ├── api/
        ├── variants/
        ├── motion/
        ├── formula/
        ├── playground/
        ├── documentation/
        └── source/
```

Example:

```ts
type DetailSection =
  | {
      type: "preview";
    }
  | {
      type: "installation";
    }
  | {
      type: "dependencies";
    }
  | {
      type: "props";
    }
  | {
      type: "api";
    }
  | {
      type: "variants";
    }
  | {
      type: "motion";
    }
  | {
      type: "formula";
    }
  | {
      type: "playground";
    }
  | {
      type: "documentation";
    }
  | {
      type: "source";
    };
```

Each item decides which sections it uses.

---

# 13. Documentation Architecture

Documentation must be stored separately from registry source.

Preferred structure:

```text
content/
└── docs/
    ├── ui/
    ├── blocks/
    ├── illustrations/
    ├── animations/
    ├── easings/
    ├── effects/
    ├── hooks/
    └── utilities/
```

Example:

```text
content/
└── docs/
    └── animations/
        └── magnetic-button.mdx
```

The resource ID is the connection between the registry and its documentation:

```text
registry/animations/magnetic-button/
content/docs/animations/magnetic-button.mdx
```

Both use:

```text
id = magnetic-button
```

---

# 14. Velite Responsibilities

Velite is responsible for:

* discovering MDX documents
* validating frontmatter
* compiling MDX
* exposing typed content collections
* generating content data for Next.js

Documentation must not contain copies of canonical source files.

MDX should reference source code through reusable components.

Example:

```mdx
# Magnetic Button

This component uses a motion value to create a cursor-following effect.

<CodeChunk
  item="magnetic-button"
  file="magnetic-button.tsx"
  lines="15-35"
/>

<Preview
  item="magnetic-button"
/>
```

---

# 15. Documentation Components

The MDX system should expose reusable documentation components:

```text
CodeBlock
CodeChunk
Preview
Callout
PropsTable
FileTree
Step
Tabs
ComponentDemo
MotionDiagram
```

All MDX files should use the same shared documentation component system.

---

# 16. Code System

Use Shiki as the syntax-highlighting engine.

The application-level code viewer should be a reusable system.

Architecture:

```text
CodeBlock
├── CodeHeader
│   ├── Filename
│   ├── Language
│   ├── CopyButton
│   └── Optional Actions
│
└── CodeContent
    └── Shiki Output
```

The code viewer should support features such as:

* line numbers
* filename
* language
* copy
* highlighted lines
* focused lines
* diff notation
* word highlighting
* wrapping
* selected ranges

The code viewer should be independent from MDX.

MDX should consume it as a component.

---

# 17. CodeChunk

`CodeChunk` is a major documentation abstraction.

Example:

```mdx
<CodeChunk
  item="portfolio-card"
  file="portfolio-card.tsx"
  lines="20-42"
/>
```

The flow is:

```text
MDX
 ↓
CodeChunk
 ↓
Catalog / Registry lookup
 ↓
Source file
 ↓
Requested line range
 ↓
Shiki
 ↓
Rendered CodeBlock
```

This ensures documentation always references the actual source.

---

# 18. Collections Architecture

The platform should not rely on one giant `/collections` page.

The main information architecture is domain-based.

Routes:

```text
/collections
/collections/ui
/collections/blocks
/collections/illustrations
/collections/animations
/collections/easings
/collections/effects
/collections/hooks
/collections/utilities
```

The path selects the domain.

Query parameters filter within that domain.

Examples:

```text
/collections/ui?tag=motion
/collections/ui?tag=forms
/collections/blocks?section=hero
/collections/blocks?section=dashboard&tag=animation
/collections/animations?tag=scroll
```

The rule is:

```text
PATH
→ selects domain

QUERY PARAMS
→ filters domain
```

---

# 19. Collection Configuration

Do not hardcode collection-specific metadata into individual pages.

Create a centralized config:

```ts
export const collectionConfig = {
  ui: {
    kind: "component",
    title: "UI",
    description: "Reusable UI components.",
  },

  blocks: {
    kind: "block",
    title: "Blocks",
    description: "Complete sections and layouts.",
  },

  illustrations: {
    kind: "illustration",
    title: "Illustrations",
    description: "Coded illustrations and graphics.",
  },

  animations: {
    kind: "animation",
    title: "Animations",
    description: "Reusable motion patterns.",
  },

  easings: {
    kind: "easing",
    title: "Easings",
    description: "Timing and easing utilities.",
  },

  effects: {
    kind: "effect",
    title: "Effects",
    description: "Reusable visual effects.",
  },

  hooks: {
    kind: "hook",
    title: "Hooks",
    description: "Reusable React hooks.",
  },

  utilities: {
    kind: "utility",
    title: "Utilities",
    description: "Reusable helpers and utilities.",
  },
} as const;
```

This config may eventually drive:

* navigation
* breadcrumbs
* titles
* descriptions
* filtering
* metadata
* SEO
* empty states

---

# 20. Collection UI

A collection card should be data-driven.

Example:

```tsx
<CollectionCard item={item} />
```

The card should not know anything about where the item came from.

It should only consume normalized catalog data.

The card may display:

* title
* description
* preview
* up to two visible tags
* `+N` for remaining tags
* optional type indicator
* optional featured state

The maximum number of visible tags is a UI rule and must not be stored in item metadata.

---

# 21. Catalog Layer

Create a catalog abstraction:

```text
src/
└── lib/
    └── catalog/
        ├── index.ts
        ├── filter.ts
        ├── sort.ts
        ├── search.ts
        └── normalize.ts
```

The catalog layer is the only application-level layer that should know how registry data and documentation data are combined.

Components should not read registry JSON directly.

Pages should not manually reconstruct item metadata.

---

# 22. Folder Structure

The target high-level architecture:

```text
project/
│
├── registry/
│   ├── registry.json
│   │
│   ├── ui/
│   │   ├── registry.json
│   │   └── ...
│   │
│   ├── blocks/
│   │   ├── registry.json
│   │   └── ...
│   │
│   ├── illustrations/
│   │   ├── registry.json
│   │   └── ...
│   │
│   ├── animations/
│   │   ├── registry.json
│   │   └── ...
│   │
│   ├── easings/
│   │   ├── registry.json
│   │   └── ...
│   │
│   ├── effects/
│   ├── hooks/
│   └── utilities/
│
├── content/
│   └── docs/
│       ├── ui/
│       ├── blocks/
│       ├── illustrations/
│       ├── animations/
│       ├── easings/
│       ├── effects/
│       ├── hooks/
│       └── utilities/
│
├── scripts/
│   └── generate.mjs
│
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   │
│   │   ├── collections/
│   │   │   ├── page.tsx
│   │   │   ├── ui/page.tsx
│   │   │   ├── blocks/page.tsx
│   │   │   ├── illustrations/page.tsx
│   │   │   ├── animations/page.tsx
│   │   │   ├── easings/page.tsx
│   │   │   ├── effects/page.tsx
│   │   │   ├── hooks/page.tsx
│   │   │   └── utilities/page.tsx
│   │   │
│   │   └── r/
│   │       ├── registry.json/
│   │       └── [name].json/
│   │
│   ├── components/
│   │   ├── collection/
│   │   ├── detail/
│   │   ├── preview/
│   │   ├── code/
│   │   └── mdx/
│   │
│   ├── config/
│   │   └── collections.ts
│   │
│   ├── registry/
│   │   ├── preview/
│   │   │   ├── renderers/
│   │   │   └── registry.ts
│   │   │
│   │   └── sections/
│   │       ├── preview/
│   │       ├── installation/
│   │       ├── dependencies/
│   │       ├── props/
│   │       ├── api/
│   │       ├── variants/
│   │       ├── motion/
│   │       ├── formula/
│   │       ├── playground/
│   │       ├── documentation/
│   │       ├── source/
│   │       └── registry.ts
│   │
│   ├── lib/
│   │   ├── catalog/
│   │   ├── registry/
│   │   └── code/
│   │
│   └── types/
│       ├── catalog.ts
│       ├── preview.ts
│       └── detail.ts
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── velite.config.ts
├── next.config.mjs
└── package.json
```

---

# 23. Scripts

Scripts must have clear responsibilities.

## Development

```bash
pnpm dev
```

Runs Next.js development mode and the Velite development integration.

---

## Generation

```bash
pnpm generate
```

Creates a new resource.

Examples:

```bash
pnpm generate ui button
pnpm generate block hero-01
pnpm generate illustration isometric-folder
pnpm generate animation magnetic-button
pnpm generate easing ease-out-expo
```

Generation must:

1. Validate the domain.
2. Validate the resource name.
3. Check for collisions.
4. Create the resource folder.
5. Create `registry.json`.
6. Create `code/`.
7. Create `preview/`.
8. Create `demo/`.
9. Create documentation.
10. Never overwrite an existing resource unless explicitly requested.

---

## Type checking

```bash
pnpm typecheck
```

Runs:

```bash
tsc --noEmit
```

---

## Linting

```bash
pnpm lint
```

---

## Formatting

```bash
pnpm format
pnpm format:check
```

---

## Unit tests

```bash
pnpm test
pnpm test:watch
```

---

## Registry validation

```bash
pnpm registry:validate
```

Validates registry structure before build.

---

## Registry build

```bash
pnpm registry:build
```

Builds the generated registry output.

---

## Registry verification

```bash
pnpm registry:verify
```

Runs:

```text
registry validation
        ↓
registry build
```

---

## Content build

```bash
pnpm content:build
```

Builds Velite content independently for debugging and verification.

---

## General code check

```bash
pnpm check
```

Runs:

```text
typecheck
lint
tests
```

---

## Full verification

```bash
pnpm verify
```

Runs:

```text
typecheck
lint
tests
registry validation
```

---

## Production build

```bash
pnpm build
```

The production build must fail if registry validation fails.

Conceptually:

```text
registry validation
        ↓
registry build
        ↓
Next production build
```

---

# 24. Package Script Philosophy

Keep scripts semantic.

Use:

```text
generate
validate
build
test
verify
```

Do not make developers memorize long chains of commands.

The CI should depend on high-level scripts such as:

```bash
pnpm verify
pnpm build
```

rather than duplicating implementation details.

---

# 25. Type Safety

TypeScript is required throughout the project.

Do not use `any` unless there is a documented reason.

Prefer:

```ts
unknown
```

over:

```ts
any
```

for untrusted external data.

Runtime data should be validated with schemas.

Recommended combination:

```text
TypeScript
→ compile-time safety

Zod
→ runtime validation

shadcn registry validation
→ registry-specific validation
```

---

# 26. Runtime Schema Validation

Use Zod for important internal contracts.

Examples:

* registry metadata
* preview configuration
* catalog items
* collection query parameters
* generator input

Example:

```ts
const previewConfigSchema = z.discriminatedUnion(
  "renderer",
  [
    z.object({
      renderer: z.literal("react"),
      source: z.string(),
    }),

    z.object({
      renderer: z.literal("image"),
      src: z.string(),
      alt: z.string(),
    }),

    z.object({
      renderer: z.literal("video"),
      src: z.string(),
      poster: z.string().optional(),
    }),

    z.object({
      renderer: z.literal("svg"),
      source: z.string(),
    }),

    z.object({
      renderer: z.literal("easing"),
      source: z.string(),
    }),

    z.object({
      renderer: z.literal("code"),
      file: z.string(),
      language: z.string(),
    }),

    z.object({
      renderer: z.literal("none"),
    }),
  ],
);
```

---

# 27. URL Query Architecture

Collection filtering is URL-driven.

Examples:

```text
/collections/ui
/collections/ui?tag=motion
/collections/blocks?section=hero
/collections/blocks?section=hero&tag=motion
/collections/animations?tag=scroll
```

The filter logic must be pure.

Example:

```ts
filterCatalog(items, query)
```

Do not place complex filter logic directly inside React components.

---

# 28. Search

Search should eventually operate over normalized catalog data.

Search should be able to consider:

* title
* description
* tags
* section
* type

Search implementation must remain separate from rendering.

---

# 29. Testing Strategy

## Unit Tests

Test:

* query parsing
* catalog filtering
* catalog sorting
* catalog normalization
* generator validation
* slug validation
* metadata schemas

## Integration Tests

Test:

* registry loading
* item lookup
* documentation lookup
* registry + MDX normalization
* preview renderer resolution

## E2E Tests

Test major user flows:

```text
Home
→ Collections
→ UI
→ Filter
→ Open item
→ Preview
→ Fullscreen
→ Code
→ Installation
```

Also test:

```text
Block
Illustration
Animation
Easing
```

at least once each.

---

# 30. CI

GitHub Actions should run on pull requests and pushes to the main development branches.

Minimum pipeline:

```text
Checkout
   ↓
Install dependencies
   ↓
Typecheck
   ↓
Lint
   ↓
Registry validation
   ↓
Unit tests
   ↓
Production build
```

Optional later:

```text
E2E
Visual regression
Accessibility tests
Bundle-size checks
Lighthouse checks
```

Do not overbuild CI before the project requires it.

---

# 31. Performance Rules

The application should use Server Components by default.

Use Client Components only for:

* interactive previews
* animations requiring browser APIs
* fullscreen controls
* playgrounds
* interactive filters
* client-side code interactions

Do not make the entire collections page a Client Component just because a card preview is interactive.

Prefer:

```text
Server page
 ├── Server collection data
 ├── Server filtering
 └── Client preview only where required
```

---

# 32. Accessibility Rules

Interactive resources must respect:

* keyboard navigation
* focus visibility
* semantic buttons
* reduced motion preferences
* readable contrast
* screen-reader labels

Animated demos must provide a reduced-motion fallback when appropriate.

Documentation must remain readable without JavaScript-dependent visual effects.

---

# 33. Demo Isolation

Demos may contain experimentation.

Production source must remain clean.

Do not put platform-only experimentation into:

```text
code/
```

Put it into:

```text
demo/
```

or a dedicated playground.

---

# 34. Preview Isolation

Preview components belong to the platform.

They are not automatically part of the distributed package unless intentionally included.

Preview implementation may:

* provide mock data
* control animation
* resize the component
* provide background variants
* show multiple states

but must ultimately render the canonical resource.

---

# 35. Installation Information

Installation data should be derived from registry metadata whenever possible.

Do not maintain a second manual dependency list in MDX if the registry already defines the dependency.

The details page may display:

```text
Installation
Dependencies
Registry Dependencies
Manual Installation
Environment Variables
API Requirements
```

But the underlying source should remain centralized.

---

# 36. API Requirements

Some blocks may require external data.

Metadata may support:

```ts
interface ApiRequirement {
  name: string;
  method:
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE";
  path: string;
  description?: string;
}
```

A resource may additionally specify:

```text
environment variables
authentication requirements
mock data requirements
external services
```

The platform should not assume that every resource is self-contained.

---

# 37. Future Integration Boundary

The core project must not depend on future integrations.

Future integrations include:

```text
MCP
Open in v0
GitHub automation
analytics
external publishing
```

These should consume the stable registry rather than define it.

---

# 38. MCP

MCP is not part of the initial foundation.

Do not build the architecture around MCP.

The future model is:

```text
Stable Registry
      ↓
MCP integration
```

MCP should be implemented only after:

* registry format is stable
* item endpoints are stable
* registry generation is stable
* installation flow is stable

---

# 39. Open in v0

Open in v0 is also a future integration.

Do not add it to the architecture initially.

Later:

```text
Detail Page
    ↓
Open in v0 button
    ↓
Public registry item URL
```

The item URL must be stable before this integration is added.

---

# 40. Generated Registry Output

Source registry files and generated registry output must remain conceptually separate.

Source:

```text
registry/
```

Generated:

```text
public/r/
```

Do not manually edit generated registry files.

Generated files should be reproducible.

If generated output is committed to the repository, it must be treated as build output rather than hand-maintained source.

---

# 41. Naming Conventions

Use kebab-case for:

* resource directories
* registry names
* routes
* file names

Examples:

```text
portfolio-card
hero-01
magnetic-button
ease-out-expo
isometric-folder
```

Do not use inconsistent names such as:

```text
PortfolioCard
portfolio_card
portfolioCard
```

within resource identifiers.

React component exports may use PascalCase.

---

# 42. Resource Creation Contract

Every generated resource should eventually satisfy this structure:

```text
<domain>/
└── <resource-name>/
    ├── registry.json
    ├── code/
    ├── preview/
    └── demo/
```

Documentation should exist at:

```text
content/docs/<domain>/<resource-name>.mdx
```

A resource is considered complete only when:

* registry metadata is valid
* source code exists
* preview exists if required
* documentation exists if required
* generated registry is valid
* typecheck passes
* tests pass where applicable

---

# 43. Development Phases

## Phase 1 — Foundation

Implement:

* project structure
* types
* Zod schemas
* registry structure
* generator
* scripts
* registry validation
* basic CI

---

## Phase 2 — First Resource

Use the portfolio card as the first real resource.

It must prove:

```text
registry
+
source code
+
preview
+
demo
+
documentation
+
detail page
+
code viewer
```

---

## Phase 3 — Content Platform

Implement:

* Velite
* MDX
* documentation components
* CodeBlock
* CodeChunk
* Shiki

---

## Phase 4 — Collections

Implement:

```text
UI
Blocks
Illustrations
Animations
Easings
Effects
Hooks
Utilities
```

with:

* filtering
* search
* tags
* sections
* responsive collection cards

---

## Phase 5 — Detail Platform

Implement:

* dynamic section registry
* preview renderer registry
* fullscreen preview
* source viewer
* installation
* dependencies
* API requirements
* props
* animation information
* formulas
* playgrounds

---

## Phase 6 — Registry Production

Verify:

* public registry
* registry JSON endpoints
* install flow
* dependency resolution
* local registry testing
* production build

---

## Phase 7 — External Integrations

Only after the core is stable:

```text
MCP
Open in v0
```

---

# 44. Architectural Anti-Patterns

Do not:

* store every resource inside one giant folder
* duplicate source code inside previews
* duplicate source code inside MDX
* make every page a Client Component
* use `type` for both platform taxonomy and registry type
* hardcode filtering into cards
* hardcode item-specific logic into generic collection pages
* dynamically import arbitrary preview paths from metadata
* manually maintain generated registry output
* add MCP before the registry API is stable
* add Open in v0 before public registry endpoints are stable
* introduce a monorepo before the project actually needs one
* introduce excessive abstraction before multiple real use cases exist

---

# 45. Definition of a Good Architecture

The architecture is considered successful when adding a new resource looks approximately like:

```text
pnpm generate animation magnetic-button
```

Then the developer edits:

```text
registry/animations/magnetic-button/
├── code/
├── preview/
├── demo/
└── registry.json

content/docs/animations/magnetic-button.mdx
```

and does not need to modify:

```text
collection page
detail page
global preview logic
global filtering logic
navigation
code viewer
installation UI
```

unless the new resource introduces a genuinely new capability.

That is the main scalability test.

---

# 46. First Resource

The first resource should be the provided portfolio-card / SVG + Motion demo.

Its purpose is not only to become a published resource.

It is the architecture test case.

It should verify:

```text
React component
SVG
Motion
preview
demo
MDX
code extraction
Shiki
installation
dependencies
collections
detail page
fullscreen
registry generation
CI
```

If the first resource requires special-case logic throughout the application, the architecture should be reconsidered before adding many resources.

---

# 47. Implementation Priority

Build in this order:

```text
1. Types
2. Schemas
3. Registry structure
4. Generator
5. Scripts
6. Registry validation
7. First resource
8. Catalog adapter
9. Velite
10. MDX
11. Shiki / CodeBlock
12. Preview system
13. Collection system
14. Detail system
15. Tests
16. CI
17. Production registry
18. MCP
19. Open in v0
```

Do not skip foundational validation in order to build visual features faster.

---

# 48. Final Architecture

The platform can be understood as:

```text
                         PLATFORM
                            │
              ┌─────────────┴─────────────┐
              │                           │
          COLLECTIONS                   DOCS
              │                           │
      ┌───────┼────────┐           ┌──────┼──────┐
      │       │        │           │             │
      UI    Blocks  Animations    MDX         Code
      │       │        │
      └───────┴────────┘
               │
            CATALOG
               │
      ┌────────┼────────┐
      │        │        │
   Registry  Preview   Sections
      │        │        │
    Source   Renderer  Detail UI
      │
      ▼
 shadcn distribution

Future:

Registry
   ├── MCP
   └── Open in v0
```

The central idea is:

> **The registry is the source/distribution layer, the catalog is the application layer, MDX is the documentation layer, preview renderers are the visualization layer, and detail sections are the composition layer.**

That separation is the foundation for scaling the project without turning every new resource into a special case.