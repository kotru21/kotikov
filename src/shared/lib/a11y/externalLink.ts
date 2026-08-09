export function formatExternalLinkLabel(visibleName: string): string {
  return `${visibleName} (откроется в новой вкладке)`;
}

export function isHttpUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

function isSafeHashOrPath(url: string): boolean {
  if (url.startsWith("#")) return true;
  // Allow same-origin paths; reject protocol-relative URLs (`//evil.com`).
  return url.startsWith("/") && !url.startsWith("//");
}

function isSafeMailto(url: string): boolean {
  if (!/^mailto:/i.test(url)) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "mailto:" && parsed.pathname.length > 0;
  } catch {
    return false;
  }
}

/** Safe href schemes for static content links (blocks javascript:, data:, etc.). */
export function isSafeHref(url: string): boolean {
  const trimmed = url.trim();
  if (trimmed.length === 0) return false;
  if (isSafeHashOrPath(trimmed)) return true;
  if (isSafeMailto(trimmed)) return true;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
