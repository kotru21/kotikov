/** Split prose into sentence-sized comment lines for the About spec panel. */
export function toCommentLines(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}
