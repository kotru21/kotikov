import { expect, test } from "@playwright/test";

import { scrollSectionToTop } from "./helpers/scrollSectionToTop";

test.describe("mobile contacts paint well", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("hash #contacts lands on cells with a paint well below", async ({ page }) => {
    await page.goto("/");
    await scrollSectionToTop(page, "contacts");

    const section = page.locator("#contacts");
    await expect(section).toBeVisible();

    const email = section.getByRole("link", { name: /Email/ });
    await expect(email).toBeVisible();
    await expect(section.getByRole("link", { name: /Telegram/ })).toBeVisible();
    await expect(section.getByRole("link", { name: /GitHub/ })).toBeVisible();

    const well = section.locator("[data-contacts-paint-well]");
    await expect(well).toBeVisible();
    await expect(section.getByRole("button", { name: "Очистить рисунок" })).toBeVisible();

    const sectionBox = await section.boundingBox();
    const emailBox = await email.boundingBox();
    const wellBox = await well.boundingBox();
    expect(sectionBox).toBeTruthy();
    expect(emailBox).toBeTruthy();
    expect(wellBox).toBeTruthy();
    if (sectionBox === null || emailBox === null || wellBox === null) {
      return;
    }

    expect(emailBox.y - sectionBox.y).toBeLessThan(120);
    expect(wellBox.y).toBeGreaterThan(emailBox.y);
    expect(wellBox.height).toBeGreaterThanOrEqual(192);
  });

  test("paint stroke changes canvas pixels without blocking Email", async ({ page }) => {
    await page.goto("/");
    await scrollSectionToTop(page, "contacts");
    const section = page.locator("#contacts");
    const well = section.locator("[data-contacts-paint-well]");
    const canvas = section.locator("canvas");
    const email = section.getByRole("link", { name: /Email/ });

    await expect(well).toBeVisible();
    await expect(canvas).toBeVisible();
    await expect(section.getByRole("button", { name: "Очистить рисунок" })).toBeEnabled();
    await expect(email).toHaveAttribute("href", /mailto:/);

    const samplePixels = async (): Promise<number> =>
      canvas.evaluate((node) => {
        const surface = node as HTMLCanvasElement;
        const ctx = surface.getContext("2d");
        if (ctx === null || surface.width === 0 || surface.height === 0) {
          return 0;
        }
        const { data } = ctx.getImageData(0, 0, surface.width, surface.height);
        let sum = 0;
        for (const value of data) {
          sum += value;
        }
        return sum;
      });

    await expect.poll(samplePixels).not.toBe(0);
    const before = await samplePixels();

    const box = await canvas.boundingBox();
    expect(box).toBeTruthy();
    if (box === null) {
      return;
    }

    const x = box.x + Math.min(80, box.width * 0.35);
    const y = box.y + Math.min(80, box.height * 0.35);
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 48, y + 36, { steps: 8 });
    await page.mouse.up();

    await expect.poll(samplePixels).not.toBe(before);

    const emailHit = await email.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const top = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      return top !== null && (top === el || el.contains(top));
    });
    expect(emailHit).toBe(true);
  });
});
