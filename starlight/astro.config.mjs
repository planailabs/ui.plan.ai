// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// Served at /docs of the main app (ui.plan.ai/docs).
// `base` ensures all internal links/assets are prefixed with `/docs`.
// Build output stays at the default `dist/`; the root `build:docs` script
// copies it into `../public/docs/` so the main app serves it statically.
// (Setting `outDir` outside the project breaks Astro's image-asset cache.)
// https://astro.build/config
export default defineConfig({
	site: 'https://ui.plan.ai',
	base: '/docs',
	server: {
		port: 4322,
	},
	integrations: [
		starlight({
			title: 'My Docs',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			sidebar: [
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Example Guide', slug: 'guides/example' },
					],
				},
				{
					label: 'Reference',
					items: [{ autogenerate: { directory: 'reference' } }],
				},
			],
		}),
	],
});
