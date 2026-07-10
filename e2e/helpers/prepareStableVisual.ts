import type { Page } from "@playwright/test";

export async function prepareStableVisual(page: Page, theme: "light" | "dark"): Promise<void> {
  await page.addInitScript((selectedTheme) => {
    localStorage.setItem("theme", selectedTheme);
  }, theme);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/_vercel/**", (route) => route.abort());
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
      }
      canvas { visibility: hidden !important; }
    `,
  });
}
