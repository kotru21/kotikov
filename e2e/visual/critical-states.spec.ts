import { expect, test } from "@playwright/test";

import { prepareStableVisual } from "../helpers/prepareStableVisual";

async function stabilizeAfterNavigate(page: import("@playwright/test").Page): Promise<void> {
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

for (const theme of ["light", "dark"] as const) {
  for (const width of [375, 1440] as const) {
    test(`hero ${theme} ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: width === 375 ? 812 : 900 });
      await prepareStableVisual(page, theme);
      await expect(page.locator("#header")).toHaveScreenshot(`hero-${theme}-${width}.png`);
    });
  }
}

for (const width of [375, 1440] as const) {
  test(`expanded project light ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 375 ? 812 : 900 });
    await prepareStableVisual(page, "light");
    await page.locator("#projects").scrollIntoViewIfNeeded();
    await page.locator("#projects").getByRole("button", { name: "Подробнее" }).first().click();

    const projectDetails = page.getByRole("region", { name: "Подробности проекта" });
    await expect(projectDetails).toBeVisible();
    await expect(page.locator("#projects")).toHaveScreenshot(`project-expanded-light-${width}.png`);
  });
}

test("skills reduced-motion 1440", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await prepareStableVisual(page, "light");
  await page.locator("#skills").scrollIntoViewIfNeeded();
  await expect(page.locator("#skills")).toHaveScreenshot("skills-reduced-motion-1440.png");
});

for (const width of [375, 1024] as const) {
  test(`timeline ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 375 ? 812 : 900 });
    await prepareStableVisual(page, "light");
    await page.locator("#experience").scrollIntoViewIfNeeded();
    await expect(page.locator("#experience")).toHaveScreenshot(`timeline-light-${width}.png`);
  });
}

for (const width of [375, 1440] as const) {
  test(`contacts ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 375 ? 812 : 900 });
    await prepareStableVisual(page, "light");
    await page.locator("#contacts").scrollIntoViewIfNeeded();
    await expect(page.locator("#contacts")).toHaveScreenshot(`contacts-light-${width}.png`);
  });
}

test("mobile menu 375", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await prepareStableVisual(page, "light");
  await page.getByRole("button", { name: "Открыть меню" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveScreenshot("mobile-menu-light-375.png");
});

for (const width of [375, 1440] as const) {
  test(`404 ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 375 ? 812 : 900 });
    await page.addInitScript(() => {
      localStorage.setItem("theme", "light");
    });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.route("**/_vercel/**", (route) => route.abort());
    await page.goto("/no-such-route-wave-three");
    await stabilizeAfterNavigate(page);
    const recovery = page.getByRole("heading", { name: "Страница не найдена" }).locator("..");
    await expect(recovery).toBeVisible();
    await expect(recovery).toHaveScreenshot(`not-found-light-${width}.png`);
  });
}
