// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

/**
 * Rewrites absolute markdown links so they include Astro's `base`.
 * Starlight does NOT auto-prefix `[label](/foo/)` body links with `base` —
 * without this, every internal absolute link breaks in production. Runs once
 * in the remark pipeline and covers all .md/.mdx body content.
 * Frontmatter fields (e.g. splash `hero.actions[].link`) are NOT touched —
 * those must be written with the full path explicitly.
 */
function remarkBaseLinks(base = '/docs') {
	const walk = (node, fn) => {
		if (node.type === 'link') fn(node);
		if (Array.isArray(node.children)) node.children.forEach((c) => walk(c, fn));
	};
	return () => (tree) =>
		walk(tree, (n) => {
			const url = n.url;
			if (
				typeof url === 'string' &&
				url.startsWith('/') &&
				!url.startsWith('//') &&
				!url.startsWith(base + '/') &&
				url !== base
			) {
				n.url = base + url;
			}
		});
}

// Served at /docs of the main app (ui.plan.ai/docs).
// `base` ensures all internal links/assets are prefixed with `/docs`.
// Build output stays at the default `dist/`; the root `build:docs` script
// copies it into `../public/docs/` so the main app serves it statically.
// (Setting `outDir` outside the project breaks Astro's image-asset cache.)
// https://astro.build/config
export default defineConfig({
	site: 'https://ui.plan.ai',
	base: '/docs',
	trailingSlash: 'always',
	build: { format: 'directory' },
	server: {
		port: 4322,
	},
	markdown: {
		remarkPlugins: [remarkBaseLinks()],
	},
	integrations: [
		starlight({
			title: 'ui.plan.ai',
			description: 'A static-interactive public stream where visitors watch agents build Plan.ai/UI itself, frame by frame.',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			sidebar: [
				{ label: 'Start here', items: [{ autogenerate: { directory: 'start-here' } }] },
				{ label: 'Foundations', items: [{ autogenerate: { directory: 'foundations' } }] },
				{ label: 'Process', items: [{ autogenerate: { directory: 'process' } }] },
				{ label: 'v1 Plan', items: [{ autogenerate: { directory: 'v1-plan' } }] },
				{ label: 'Specifications', items: [{ autogenerate: { directory: 'specifications' } }] },
				{ label: 'Reference', items: [{ autogenerate: { directory: 'reference' } }] },
				{ label: 'API Reference', items: [{ autogenerate: { directory: 'api-reference' } }] },
				{ label: 'Roadmap & open questions', items: [{ autogenerate: { directory: 'roadmap-and-open-questions' } }] },
				{ label: 'Archive', collapsed: true, items: [{ autogenerate: { directory: 'archive' } }] },
			],
		}),
	],
});
