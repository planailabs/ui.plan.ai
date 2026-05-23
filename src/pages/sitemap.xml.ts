import { getAllPublicStreams } from '../data/v1Demo';

export const prerender = true;

const staticPaths = ['/', '/streams/'];
const escapeXml = (value: string) =>
	value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');

export function GET({ site }: { site?: URL }) {
	const origin = site ?? new URL('https://ui.plan.ai');
	const streamUrls = getAllPublicStreams().map((stream) => ({
		path: stream.path,
		lastmod: stream.frames
			.map((frame) => frame.submittedAt)
			.sort()
			.at(-1),
	}));
	const urls = [
		...staticPaths.map((path) => ({ path, lastmod: undefined })),
		...streamUrls,
	]
		.map(({ path, lastmod }) => {
			const loc = escapeXml(new URL(path, origin).toString());
			const lastmodTag = lastmod ? `<lastmod>${escapeXml(lastmod.slice(0, 10))}</lastmod>` : '';
			return `  <url><loc>${loc}</loc>${lastmodTag}</url>`;
		})
		.join('\n');

	return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
		},
	});
}
