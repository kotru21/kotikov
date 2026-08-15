import { expect, test } from "@playwright/test";

test("skills nyancat lives in the skills band, not the puzzle", async ({ page }) => {
  await page.goto("/");
  await page.locator("#skills").scrollIntoViewIfNeeded();

  await expect(page.locator("#header img[src='/nyancat.svg']")).toHaveCount(0);
  await expect(page.locator("#skills img[src='/nyancat.svg']")).toHaveCount(1);
});

test("skills nyancat explodes on click", async ({ page }) => {
  await page.goto("/");
  await page.locator("#skills").scrollIntoViewIfNeeded();

  const cat = page.getByTestId("skills-nyancat");
  // Cursor-follow sprite may be opacity-0 until pointer entry — DOM click, not hit-testing.
  await expect(cat).toBeAttached();
  await cat.evaluate((el: HTMLElement) => {
    el.click();
  });
  await expect(cat).toHaveCount(0);
});

test("skills nyancat perches on the Development group article", async ({ page }) => {
  await page.goto("/");
  await page.locator("#skills").scrollIntoViewIfNeeded();

  const card = page.locator("#skills article").filter({ hasText: "Development" });
  const cat = page.getByTestId("skills-nyancat");
  await expect(cat).toBeAttached();
  await card.hover();

  await expect(async () => {
    const catBox = await cat.boundingBox();
    const cardBox = await card.boundingBox();
    expect(catBox).toBeTruthy();
    expect(cardBox).toBeTruthy();
    if (catBox === null || cardBox === null) return;
    const feetY = catBox.y + catBox.height;
    expect(Math.abs(feetY - cardBox.y)).toBeLessThan(20);
    expect(catBox.x + catBox.width / 2).toBeGreaterThan(cardBox.x);
    expect(catBox.x).toBeLessThan(cardBox.x + cardBox.width);
  }).toPass({ timeout: 3_000 });
});
