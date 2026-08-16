import { expect, test } from "@playwright/test";

import { projectsData } from "../src/shared/config/content/projects";
import { timelineData } from "../src/shared/config/content/timeline";
import { scrollSectionToTop } from "./helpers/scrollSectionToTop";

test.describe("desktop projects", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("shows every project card in the editorial grid", async ({ page }) => {
    await page.goto("/");
    await scrollSectionToTop(page, "projects");

    const projects = page.locator("#projects");
    await expect(projects.getByRole("article")).toHaveCount(projectsData.length);
    await Promise.all(
      projectsData.map((project) =>
        expect(projects.getByRole("heading", { name: project.title })).toBeVisible()
      )
    );
    await expect(projects.getByRole("link", { name: /код/i })).toHaveCount(projectsData.length);
    await expect(projects.getByRole("button", { name: "Подробнее" })).toHaveCount(0);
    await expect(projects.getByRole("button", { name: "Следующий проект" })).toHaveCount(0);
  });

  test("section border hugs the last card row without chrome padding inside the box", async ({
    page,
  }) => {
    await page.goto("/");
    await scrollSectionToTop(page, "projects");

    const metrics = await page.locator("#projects").evaluate((section) => {
      const articles = [...section.querySelectorAll("article")];
      const sectionBox = section.getBoundingClientRect();
      const lastBottom = Math.max(
        ...articles.map((article) => article.getBoundingClientRect().bottom)
      );
      const style = getComputedStyle(section);
      return {
        paddingBottom: style.paddingBottom,
        gapBelowCards: sectionBox.bottom - lastBottom,
      };
    });

    expect(parseFloat(metrics.paddingBottom)).toBe(0);
    expect(metrics.gapBelowCards).toBeLessThan(8);
  });

  test("advances the editorial timeline rail", async ({ page }) => {
    await page.goto("/");
    await scrollSectionToTop(page, "experience");

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

  test("advances the project slider with chevrons", async ({ page }) => {
    await page.goto("/");
    await scrollSectionToTop(page, "projects");

    const projects = page.locator("#projects");
    const first = projectsData[0];
    const second = projectsData[1];

    await expect(projects.getByRole("heading", { name: first.title })).toBeVisible();
    await expect(projects.getByRole("heading", { name: second.title })).toBeHidden();
    await expect(projects.getByRole("article")).toHaveCount(1);

    const articleMetrics = await projects.getByRole("article").evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        height: el.getBoundingClientRect().height,
        writingMode: style.writingMode,
        flexDirection: style.flexDirection,
      };
    });
    expect(articleMetrics.writingMode).toBe("horizontal-tb");
    expect(articleMetrics.flexDirection).toBe("column");
    expect(articleMetrics.height).toBeLessThan(900);

    const deck = projects.getByTestId("projects-deck");
    const beforeHeight = await deck.evaluate((el) => el.getBoundingClientRect().height);

    const nextProject = projects.getByRole("button", { name: "Следующий проект" });
    await expect(nextProject).toBeEnabled();
    await nextProject.click();

    await expect(projects.getByRole("heading", { name: second.title })).toBeVisible();
    await expect(projects.getByRole("button", { name: "Предыдущий проект" })).toBeEnabled();

    const afterHeight = await deck.evaluate((el) => el.getBoundingClientRect().height);
    expect(Math.abs(afterHeight - beforeHeight)).toBeLessThan(2);
  });

  test("shows one timeline stage with chevrons", async ({ page }) => {
    await page.goto("/");
    await scrollSectionToTop(page, "experience");

    const experience = page.locator("#experience");
    const first = timelineData[0];
    const second = timelineData[1];

    await expect(experience.getByRole("heading", { name: first.title })).toBeVisible();
    await expect(experience.getByRole("heading", { name: second.title })).toBeHidden();

    const nextStep = experience.getByRole("button", { name: "Прокрутить к следующему этапу" });
    await expect(nextStep).toBeEnabled();

    const deck = experience.getByTestId("timeline-deck");
    const beforeHeight = await deck.evaluate((el) => el.getBoundingClientRect().height);

    await nextStep.click();

    await expect(experience.getByRole("heading", { name: second.title })).toBeVisible();
    await expect(
      experience.getByRole("button", { name: "Прокрутить к предыдущему этапу" })
    ).toBeEnabled();

    const afterHeight = await deck.evaluate((el) => el.getBoundingClientRect().height);
    expect(Math.abs(afterHeight - beforeHeight)).toBeLessThan(2);
  });
});
