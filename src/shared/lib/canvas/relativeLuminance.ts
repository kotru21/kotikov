/** WCAG relative luminance for sRGB; supports #RGB / #RRGGBB only. */
export function relativeLuminanceFromCssColor(color: string): number | null {
  const hex = color.trim();
  const match = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(hex);
  if (match === null) return null;

  let r = 0;
  let g = 0;
  let b = 0;
  const raw = match[1];
  if (raw.length === 3) {
    r = Number.parseInt(raw[0] + raw[0], 16);
    g = Number.parseInt(raw[1] + raw[1], 16);
    b = Number.parseInt(raw[2] + raw[2], 16);
  } else {
    r = Number.parseInt(raw.slice(0, 2), 16);
    g = Number.parseInt(raw.slice(2, 4), 16);
    b = Number.parseInt(raw.slice(4, 6), 16);
  }

  const toLinear = (c: number): number => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export function preferDarkTextFromLuminance(luminance: number): boolean {
  return luminance >= 0.5;
}
