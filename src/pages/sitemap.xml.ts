import { getAllPublicStreams } from '../data/v1Demo';

export const prerender = true;

const staticPaths = ['/', '/streams/'];

export function GET({ site }: { site?: URL }) {
	const origin = site ?? new URL('https://ui.plan.ai');
	const paths = [...staticPaths, ...getAllPublicStreams().map((stream) => stream.path)];
	const urls = paths
		.map((path) => {
			const loc = new URL(path, origin).toString();
			return `  <url><loc>${loc}</loc></url>`;
		})
		.join('\n');

	return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
		},
	});
}
