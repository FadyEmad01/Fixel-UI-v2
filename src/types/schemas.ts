import { z } from "zod";

export const previewConfigSchema = z.discriminatedUnion("renderer", [
  z.object({
    renderer: z.literal("react"),
    source: z.string().min(1),
  }),

  z.object({
    renderer: z.literal("image"),
    src: z.string().min(1),
    alt: z.string().min(1),
  }),

  z.object({
    renderer: z.literal("video"),
    src: z.string().min(1),
    poster: z.string().optional(),
  }),

  z.object({
    renderer: z.literal("svg"),
    source: z.string().min(1),
  }),

  z.object({
    renderer: z.literal("easing"),
    source: z.string().min(1),
  }),

  z.object({
    renderer: z.literal("code"),
    file: z.string().min(1),
    language: z.string().min(1),
  }),

  z.object({
    renderer: z.literal("none"),
  }),
]);

export const catalogItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),

  kind: z.enum([
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

  registryType: z.enum([
    "registry:ui",
    "registry:component",
    "registry:block",
    "registry:hook",
    "registry:lib",
    "registry:page",
    "registry:file",
    "registry:item",
  ]),

  tags: z.array(z.string()),

  preview: previewConfigSchema,

  sections: z.array(
    z.object({
      type: z.enum([
        "preview",
        "installation",
        "dependencies",
        "props",
        "api",
        "variants",
        "motion",
        "formula",
        "playground",
        "documentation",
        "source",
      ]),
    }),
  ),

  dependencies: z.array(z.string()),
  registryDependencies: z.array(z.string()),

  status: z.enum(["draft", "published", "deprecated"]),
});
