/**
 * Escape a value for safe interpolation into an HTML string.
 *
 * The workbench renders rows by building HTML strings and assigning them to
 * `innerHTML`. Most interpolated fields are UUIDs or fixed enums, but some
 * (agent/channel names, media failure reasons, submission errors, request ids,
 * raw metadata) originate from agents or upstream systems and are not
 * trustworthy. Run every dynamic field through this before interpolation.
 */
export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
