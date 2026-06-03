import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const works = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/works" }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    category: z.array(z.string()),
    period: z.string(),
    role: z.string(),
    featured: z.boolean().default(false),
    order: z.number().optional(),
    coverImage: z.string().optional(),
    summary: z.string().optional(),
    kpis: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
          growth: z.string().optional(),
        }),
      )
      .default([]),
    tools: z.array(z.string()).default([]),
    partners: z.array(z.string()).default([]),
    media: z
      .array(
        z.object({
          type: z.enum(["image", "youtube"]),
          src: z.string(),
          caption: z.string().optional(),
          fit: z.enum(["cover", "contain", "original"]).optional(),
        }),
      )
      .default([]),
  }),
});

export const collections = { works };
