/** WCAG relative luminance for sRGB; supports #RGB / #RRGGBB only. */
export function relativeLuminanceFromCssColor(color: string): number | null {
  const hex = color.trim();
  const match = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(hex);
  if (match === null) return null;

  const raw = match[1];
  const isShort = raw.length === 3;
  const r = Number.parseInt(isShort ? raw[0] + raw[0] : raw.slice(0, 2), 16);
  const g = Number.parseInt(isShort ? raw[1] + raw[1] : raw.slice(2, 4), 16);
  const b = Number.parseInt(isShort ? raw[2] + raw[2] : raw.slice(4, 6), 16);

  const toLinear = (c: number): number => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export function preferDarkTextFromLuminance(luminance: number): boolean {
  return luminance >= 0.5;
}
