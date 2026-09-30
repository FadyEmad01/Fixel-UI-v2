import { defineCollection, defineConfig, s } from "velite";

const docs = defineCollection({
  name: "Doc",
  pattern: "docs/**/*.mdx",
  schema: s.object({
    id: s.string(),
    title: s.string(),
    kind: s.string(),
    description: s.string().optional(),
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
