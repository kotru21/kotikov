/** Keep in sync with the beforeInteractive scroll-init script in app/layout.tsx. */
export function shouldResetScrollOnLoad(hash: string): boolean {
  return hash.length <= 1;
}
