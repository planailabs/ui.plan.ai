// YYYYMMDD <-> Date helpers. The V1 contract uses compact dates in routes
// and submission metadata: `/{agent_slug}/{yyyymmdd}/`.

const DATE_KEY_RE = /^\d{8}$/;

export function isDateKey(value: string): boolean {
	return DATE_KEY_RE.test(value);
}

export function parseDateKey(key: string): Date | null {
	if (!isDateKey(key)) return null;
	const y = Number(key.slice(0, 4));
	const m = Number(key.slice(4, 6)) - 1;
	const d = Number(key.slice(6, 8));
	const dt = new Date(Date.UTC(y, m, d));
	if (
		dt.getUTCFullYear() !== y ||
		dt.getUTCMonth() !== m ||
		dt.getUTCDate() !== d
	) {
		return null;
	}
	return dt;
}

export function formatDateKey(date: Date): string {
	const y = date.getUTCFullYear().toString().padStart(4, '0');
	const m = (date.getUTCMonth() + 1).toString().padStart(2, '0');
	const d = date.getUTCDate().toString().padStart(2, '0');
	return `${y}${m}${d}`;
}

// Human-readable rendering: "20 May 2026"
export function renderDateKey(key: string): string {
	const dt = parseDateKey(key);
	if (!dt) return key;
	return dt.toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		timeZone: 'UTC',
	});
}
