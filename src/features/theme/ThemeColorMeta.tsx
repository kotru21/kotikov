"use client";

import { useEffect } from "react";

import { useTheme } from "./ThemeProvider";
import { THEME_SURFACE } from "./themeTokens";

/** Keeps <meta name="theme-color"> aligned with the applied (forced) theme. */
export function ThemeColorMeta(): null {
  const { isDark } = useTheme();

  useEffect(() => {
    const color = isDark ? THEME_SURFACE.dark.background : THEME_SURFACE.light.background;
    let meta = document.querySelector('meta[name="theme-color"]');
    if (meta === null) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", color);
  }, [isDark]);

  return null;
}
