import { expect, test } from "@playwright/test";

test.describe("desktop navigation", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("keeps contact CTA available after scroll", async ({ page }) => {
    await page.goto("/");

    const contactCta = page
      .getByRole("navigation", { name: "Основная навигация" })
      .getByRole("link", { name: /^Связаться/ });
    await expect(contactCta).toBeVisible();

    await page.locator("#projects").scrollIntoViewIfNeeded();
    await expect(contactCta).toBeVisible();
    await expect(contactCta).toHaveAttribute("href", "#contacts");
  });
});

test.describe("mobile navigation", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("opens and closes the menu with focus return", async ({ page }) => {
    await page.goto("/");

    const openMenu = page.getByRole("button", { name: "Открыть меню" });
    await openMenu.click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(openMenu).toBeFocused();
  });
});
