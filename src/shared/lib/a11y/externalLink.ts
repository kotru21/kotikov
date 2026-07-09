export function formatExternalLinkLabel(visibleName: string): string {
  return `${visibleName} (откроется в новой вкладке)`;
}

export function isHttpUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}
