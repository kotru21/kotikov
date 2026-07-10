import { expect, test } from "@playwright/test";

test("theme persists after reload", async ({ page }) => {
  await page.addInitScript(() => {
    // Seed light once; keep subsequent reloads free to restore the chosen theme.
    if (window.sessionStorage.getItem("e2e-theme-seeded") === "1") return;
    window.localStorage.setItem("theme", "light");
    window.document.cookie = "theme=light; path=/; SameSite=Lax";
    window.sessionStorage.setItem("e2e-theme-seeded", "1");
  });
  await page.goto("/");

  await page.getByRole("button", { name: "Включить тёмную тему" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);

  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("renders static skills content when motion is reduced", async ({ page }) => {
    await page.goto("/#skills");

    await expect(page.locator("#skills")).toBeVisible();
    await expect(page.locator("#skills").getByRole("list").first()).toBeVisible();
    await expect(page.locator('[data-motion-active="true"]')).toHaveCount(0);
  });
});
