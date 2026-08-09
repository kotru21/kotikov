import { expect, test } from "@playwright/test";

test("header nyancat explodes on click", async ({ page }) => {
  await page.goto("/");

  const cat = page.getByTestId("header-nyancat");
  // Starts off-canvas on the flight path — DOM click, not pointer hit-testing.
  await expect(cat).toBeAttached();
  await cat.evaluate((el: HTMLElement) => {
    el.click();
  });
  await expect(cat).toHaveCount(0);
});
