import type { ContrastSample } from "@/shared/lib";
import { colors } from "@/styles/colors";

export function clearPaintInlineStyles(el: HTMLElement): void {
  el.style.removeProperty("color");
  el.style.removeProperty("background-color");
  el.style.removeProperty("border-color");
  el.style.removeProperty("box-shadow");
}

export function resolveContrastColors(
  el: HTMLElement,
  preferDarkText: boolean
): { color: string; bg: string; text: string } {
  const color =
    el.dataset.interactiveColor ??
    (preferDarkText ? colors.text.primary : colors.text.inverse);
  const bg =
    el.dataset.interactiveBg ??
    (preferDarkText ? colors.text.primary : colors.text.inverse);
  const text =
    el.dataset.interactiveText ??
    (preferDarkText ? colors.text.inverse : colors.text.primary);

  return { color, bg, text };
}

export function applyPaintContrast(
  el: HTMLElement,
  sample: ContrastSample,
  defaultThreshold: number
): void {
  if (el.dataset.drawExclude !== undefined) return;

  const threshold =
    el.dataset.interactiveThreshold !== undefined
      ? Number(el.dataset.interactiveThreshold)
      : defaultThreshold;

  if (sample.coverage <= threshold || sample.luminance === null) {
    clearPaintInlineStyles(el);
    return;
  }

  const { color, bg, text } = resolveContrastColors(el, sample.preferDarkText);
  const mode = el.dataset.interactiveMode;

  clearPaintInlineStyles(el);

  if (mode === "solid") {
    el.style.backgroundColor = bg;
    el.style.borderColor = bg;
    el.style.color = text;
    const shadow = el.dataset.interactiveShadow;
    if (shadow !== undefined && shadow !== "") {
      el.style.boxShadow = shadow;
    }
    return;
  }

  if (mode === "border") {
    el.style.borderColor = color;
    return;
  }

  el.style.color = color;
}
