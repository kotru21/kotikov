import { THEME_SURFACE } from "./themeTokens";

const lightBg = THEME_SURFACE.light.background;
const lightFg = THEME_SURFACE.light.foreground;
const darkBg = THEME_SURFACE.dark.background;
const darkFg = THEME_SURFACE.dark.foreground;

/** Inline in <head> before stylesheet. Hexes come from THEME_SURFACE (aligned with dark-mode.css). */
export const THEME_CRITICAL_CSS = `html{background-color:${lightBg};color:${lightFg}}html.dark{background-color:${darkBg};color:${darkFg}}html.light{background-color:${lightBg};color:${lightFg}}@media (prefers-color-scheme:dark){html:not(.light){background-color:${darkBg};color:${darkFg}}}html:not(.theme-ready) *,html:not(.theme-ready) *::before,html:not(.theme-ready) *::after{transition-duration:0s!important;animation-duration:0s!important}`;
