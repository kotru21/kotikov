import { expect, test } from "@playwright/test";

import { timelineData } from "../src/shared/config/content/timeline";

const timelineCount = String(timelineData.length);

test.describe("desktop projects", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("shows project cards with code links", async ({ page }) => {
    await page.goto("/#projects");

    const projects = page.locator("#projects");
    await expect(projects.getByRole("article")).toHaveCount(3);
    await expect(projects.getByRole("link", { name: /код/i })).toHaveCount(3);
    await expect(projects.getByRole("button", { name: "Подробнее" })).toHaveCount(0);
  });

  test("advances the editorial timeline rail", async ({ page }) => {
    await page.goto("/#experience");

    const nextStep = page.getByRole("button", { name: "Прокрутить к следующему этапу" });
    await expect(nextStep).toBeEnabled();
    await nextStep.click();

    await expect(
      page.getByRole("button", { name: "Прокрутить к предыдущему этапу" })
    ).toBeEnabled();
  });
});

test.describe("mobile projects and timeline", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("selects the next project in the deck", async ({ page }) => {
    await page.goto("/#projects");

    const projectControls = page.getByRole("group", { name: "Выбор проекта" }).getByRole("button");
    await expect(projectControls.first()).toHaveAttribute("aria-pressed", "true");

    const nextProject = projectControls.nth(1);
    await nextProject.click();
    await expect(nextProject).toHaveAttribute("aria-pressed", "true");
    await expect(projectControls.first()).toHaveAttribute("aria-pressed", "false");
  });

  test("advances timeline and updates the live counter", async ({ page }) => {
    await page.goto("/#experience");

    const counter = page.locator("#experience").locator("[aria-live='polite']");
    await expect(counter).toHaveText(`1 / ${timelineCount}`);

    await page.getByRole("button", { name: "Следующий этап" }).click();
    await expect(counter).toHaveText(`2 / ${timelineCount}`);
  });
});
