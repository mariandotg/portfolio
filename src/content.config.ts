import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    bannerSeed: z.string().optional(),
    draft: z.boolean().default(false),
    collection: z.enum(['engineering-notes', 'building-in-public']),
    series: z.string().optional(),
    seriesOrder: z.number().optional(),
  }),
});

const series = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/series" }),
  schema: z.object({
    title: z.object({ en: z.string(), es: z.string() }),
    description: z.object({ en: z.string(), es: z.string() }),
    collection: z.enum(['engineering-notes', 'building-in-public']),
    status: z.enum(['ongoing', 'complete']).default('ongoing'),
    order: z.number().default(99),
    /**
     * Pisa la base del banner. Sin esto se usa `/series/<id>`, y los archivos son
     * `<base>-card.webp` y `<base>-hero.webp`. Va sin sufijo ni extensión.
     */
    bannerImage: z.string().optional(),
    rootLevel: z.boolean().default(false),
  }),
});

const work = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/work" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    client: z.string().optional(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    featured: z.boolean().default(false),
    url: z.string().optional(),
    repo: z.string().optional(),
    order: z.number().default(99),
    challenge: z.string().optional(),
    approach: z.string().optional(),
    outcome: z.string().optional(),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/testimonials" }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    company: z.string(),
    quote: z.string(),
    image: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog, work, testimonials, series };
