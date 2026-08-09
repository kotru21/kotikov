import { expect, test } from "@playwright/test";

test("header nyancat explodes on click", async ({ page }) => {
  await page.goto("/");

  const cat = page.getByTestId("header-nyancat");
  await expect(cat).toBeVisible();

  await cat.click();
  await expect(cat).toHaveCount(0);
});
