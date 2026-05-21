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
 *
 * @typedef {{ type?: string, url?: string, children?: MarkdownNode[] }} MarkdownNode
 */
function remarkBaseLinks(base = '/docs') {
	/** @param {MarkdownNode} node @param {(node: MarkdownNode) => void} fn */
	const walk = (node, fn) => {
		if (node.type === 'link') fn(node);
		if (Array.isArray(node.children)) node.children.forEach((c) => walk(c, fn));
	};
	return () => {
		/** @param {MarkdownNode} tree */
		return (tree) =>
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
	};
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
	redirects: {
		// Source key resolves relative to `base` ('/' → '/docs/'),
		// destination is NOT auto-prefixed — write the full path.
		'/': '/docs/start-here/welcome/',
	},
	integrations: [
		starlight({
			title: 'ui.plan.ai',
			description: 'An internal Supabase-backed platform and Agent API for Plan.ai agent-generated UI streams.',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			components: {
				// The default header title links to the docs root (/docs/).
				// Override so the logo points at the main site home (/) instead.
				SiteTitle: './src/components/SiteTitle.astro',
			},
			sidebar: [
				{ label: 'Start here', items: [{ autogenerate: { directory: 'start-here' } }] },
				{ label: 'Foundations', items: [{ autogenerate: { directory: 'foundations' } }] },
				{ label: 'Process', items: [{ autogenerate: { directory: 'process' } }] },
				{ label: 'V1 Plan', items: [{ autogenerate: { directory: 'v1-plan' } }] },
				{ label: 'V2 Plan', items: [{ autogenerate: { directory: 'v2-plan' } }] },
				{ label: 'V3 Plan', items: [{ autogenerate: { directory: 'v3-plan' } }] },
				{ label: 'Specifications', items: [{ autogenerate: { directory: 'specifications' } }] },
				{ label: 'API Reference', items: [{ autogenerate: { directory: 'api-reference' } }] },
				{ label: 'Reference', items: [{ autogenerate: { directory: 'reference' } }] },
				{ label: 'Roadmap & open questions', items: [{ autogenerate: { directory: 'roadmap-and-open-questions' } }] },
			],
		}),
	],
});
