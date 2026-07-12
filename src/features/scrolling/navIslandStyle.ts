import type { CSSProperties } from "react";

import { lerp } from "./useNavMorph";

export interface NavIslandPreset {
  widthFrom: number;
  widthTo: number;
  /** When set, island uses this width at progress 0 instead of `${widthFrom}vw`. */
  startWidth?: string;
  paddingXFrom: number;
  paddingXTo: number;
  paddingYFrom: number;
  paddingYTo: number;
  topOffsetFrom: number;
  topOffsetTo: number;
  accentBarHeightFrom: number;
  accentBarHeightTo: number;
  fontSizeFrom?: number;
  fontSizeTo?: number;
  linkGapFrom?: number;
  linkGapTo?: number;
  actionGapFrom?: number;
  actionGapTo?: number;
}

export interface NavIslandComputedStyle {
  islandStyle: CSSProperties;
  topOffset: number;
  accentBarHeight: number;
  linkGap: number;
  borderAlpha: number;
  fontSize: number;
  actionGap: number;
}

export const DESKTOP_NAV_ISLAND_PRESET: NavIslandPreset = {
  widthFrom: 100,
  widthTo: 58,
  paddingXFrom: 32,
  paddingXTo: 16,
  paddingYFrom: 24,
  paddingYTo: 10,
  topOffsetFrom: 0,
  topOffsetTo: 12,
  accentBarHeightFrom: 0,
  accentBarHeightTo: 32,
  fontSizeFrom: 14,
  fontSizeTo: 12,
  linkGapFrom: 48,
  linkGapTo: 12,
  actionGapFrom: 16,
  actionGapTo: 10,
};

export const MOBILE_NAV_ISLAND_PRESET: NavIslandPreset = {
  startWidth: "100%",
  widthFrom: 100,
  widthTo: 85,
  paddingXFrom: 0,
  paddingXTo: 12,
  paddingYFrom: 0,
  paddingYTo: 8,
  topOffsetFrom: 0,
  topOffsetTo: 8,
  accentBarHeightFrom: 0,
  accentBarHeightTo: 24,
};

const px = (value: number): string => `${String(value)}px`;

export function computeNavIslandStyle(
  preset: NavIslandPreset,
  progress: number
): NavIslandComputedStyle {
  const scrollBlend = Math.min(1, progress * 1.6);
  const islandPaddingX = lerp(preset.paddingXFrom, preset.paddingXTo, progress);
  const islandPaddingY = lerp(preset.paddingYFrom, preset.paddingYTo, progress);
  const bgOpacity = lerp(0, 1, scrollBlend);
  const topOffset = lerp(preset.topOffsetFrom, preset.topOffsetTo, progress);
  const borderAlpha = lerp(0, 1, scrollBlend);
  const shadowOffset = lerp(0, 4, scrollBlend);
  const accentBarHeight = lerp(preset.accentBarHeightFrom, preset.accentBarHeightTo, scrollBlend);
  // Floor with max-content so logo + nowrap links + CTA stay inside the bordered
  // island when the lerped vw target is narrower than intrinsic content width.
  const islandWidth =
    progress === 0 && preset.startWidth !== undefined
      ? preset.startWidth
      : `max(${String(lerp(preset.widthFrom, preset.widthTo, progress))}vw, max-content)`;
  const linkGap = lerp(preset.linkGapFrom ?? 0, preset.linkGapTo ?? 0, progress);
  const fontSize = lerp(preset.fontSizeFrom ?? 14, preset.fontSizeTo ?? 14, progress);
  const actionGap = lerp(preset.actionGapFrom ?? 16, preset.actionGapTo ?? 10, progress);

  const islandStyle: CSSProperties = {
    width: islandWidth,
    maxWidth: "100%",
    marginInline: "auto",
    borderRadius: 0,
    paddingInline: px(islandPaddingX),
    paddingBlock: px(islandPaddingY),
    ...(preset.linkGapFrom !== undefined ? { gap: px(linkGap) } : {}),
    ...(preset.fontSizeFrom !== undefined ? { fontSize: px(fontSize) } : {}),
    backgroundColor:
      bgOpacity > 0 ? `rgb(var(--nav-island-bg) / ${String(bgOpacity)})` : "transparent",
    borderWidth: borderAlpha > 0 ? 2 : 0,
    borderStyle: "solid",
    borderColor:
      borderAlpha > 0
        ? `rgb(var(--nav-island-border-rgb) / calc(var(--nav-island-border-alpha) * ${String(borderAlpha)}))`
        : "transparent",
    boxShadow:
      shadowOffset > 0
        ? `${px(shadowOffset)} ${px(shadowOffset)} 0 0 rgb(var(--nav-shadow-rgb) / ${String(scrollBlend)})`
        : undefined,
    willChange: "transform, width, padding, box-shadow, border-color",
  };

  return {
    islandStyle,
    topOffset,
    accentBarHeight,
    linkGap,
    borderAlpha,
    fontSize,
    actionGap,
  };
}
