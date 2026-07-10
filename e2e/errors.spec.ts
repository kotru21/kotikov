import { expect, test } from "@playwright/test";

test("404 offers Russian recovery", async ({ page }) => {
  await page.goto("/no-such-route-wave-three");

  await expect(page.getByRole("heading", { name: "Страница не найдена" })).toBeVisible();
  await page.getByRole("link", { name: "На главную" }).click();
  await expect(page).toHaveURL("/");
});
