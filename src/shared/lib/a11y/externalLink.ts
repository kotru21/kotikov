export function formatExternalLinkLabel(visibleName: string): string {
  return `${visibleName} (откроется в новой вкладке)`;
}

export function isHttpUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

/** Safe href schemes for static content links (blocks javascript:, data:, etc.). */
export function isSafeHref(url: string): boolean {
  const trimmed = url.trim();
  if (trimmed.length === 0) return false;
  if (trimmed.startsWith("#") || trimmed.startsWith("/")) return true;
  if (/^mailto:/i.test(trimmed)) return true;
  return isHttpUrl(trimmed);
}
