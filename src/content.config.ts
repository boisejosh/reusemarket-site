import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(['news', 'events', 'announcement']).default('news'),
    summary: z.string(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { news };
