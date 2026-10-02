import { defineCollection, defineConfig, s } from "velite";

const docs = defineCollection({
  name: "Doc",
  pattern: "docs/**/*.mdx",
  schema: s.object({
    id: s.string().min(1),
    title: s.string().min(1),
    description: s.string(),
    kind: s.enum([
      "component",
      "block",
      "illustration",
      "animation",
      "easing",
      "effect",
      "hook",
      "utility",
      "pattern",
      "template",
      "page",
    ]),
    tags: s.array(s.string()).default([]),
    status: s.enum(["draft", "published", "deprecated"]).default("draft"),
    metadata: s.metadata(),
    content: s.mdx({ minify: false }),
  }),
});

export default defineConfig({
  root: "content",
  strict: true,
  output: {
    data: ".velite",
    assets: "public/static",
    clean: true,
  },
  collections: { docs },
});
