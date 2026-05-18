import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// Custom frontmatter keys used across the source docs (folder-7 → folder-8).
// Keep optional so Starlight's own pages (e.g. 404) still validate.
const extras = z.object({
	stability: z.enum(['stable', 'working', 'experimental']).optional(),
	last_synced_with: z.string().optional(),
	sources: z.array(z.string()).optional(),
});

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema({ extend: extras }) }),
};
