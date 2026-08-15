import { expect, test } from "@playwright/test";

import { scrollSectionToTop } from "./helpers/scrollSectionToTop";

test.describe("desktop navigation", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("shows chrome contacts link after scroll", async ({ page }) => {
    await page.goto("/");
    await scrollSectionToTop(page, "projects");

    const contacts = page
      .getByRole("navigation", { name: "Основная навигация" })
      .getByRole("link", { name: "Контакты" });
    await expect(contacts).toBeVisible();
    await expect(contacts).toHaveAttribute("href", "#contacts");
  });

  test("keeps puzzle cells clickable after a short scroll", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      const scrolling = document.scrollingElement ?? document.documentElement;
      scrolling.scrollTop = Math.round(window.innerHeight * 0.2);
    });

    const puzzleAbout = page.locator("#header").getByRole("link", { name: "Обо мне" });
    await expect(puzzleAbout).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Основная навигация" })).toHaveCount(0);
    await puzzleAbout.click();
    await expect(page.locator("#about")).toBeInViewport();
  });
});

test.describe("mobile navigation", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("exposes right-rail contacts without a hamburger menu", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Открыть меню" })).toHaveCount(0);

    await scrollSectionToTop(page, "about");

    const contacts = page
      .getByRole("navigation", { name: "Основная навигация" })
      .getByRole("link", { name: "Контакты" });
    await expect(contacts).toBeVisible();
    await expect(contacts).toHaveAttribute("href", "#contacts");
  });
});
