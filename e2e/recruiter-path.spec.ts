import { expect, test } from "@playwright/test";

test("recruiter can understand the profile and reach contact", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("#header")).toBeVisible();
  await expect(page.locator("h1")).toHaveText("Kotikov");
  const contactAction = page.locator("#header").getByRole("link", { name: "Контакты" });
  await expect(contactAction).toHaveAttribute("href", "#contacts");

  await page.locator("#about").scrollIntoViewIfNeeded();
  await expect(page.locator("#about")).toBeVisible();
  await expect(page.locator("#about-heading")).toHaveText(/Коротко обо мне/);
  await expect(page.locator("#about")).toContainText("Арсений Котиков");
  await expect(page.locator("#about")).toContainText("SOC / AppSec");
  await expect(page.locator("#about pre code")).toHaveCount(0);
  await expect(page.getByText(/проведи мышью|закрась сетку|след лапы/i)).toHaveCount(0);

  await page.locator("#projects").scrollIntoViewIfNeeded();
  await expect(page.locator("#projects")).toBeVisible();

  await contactAction.click();
  await expect(page).toHaveURL(/#contacts$/);
  await expect(page.locator("#contacts")).toBeVisible();
  await expect(page.locator("#contacts").getByRole("link", { name: /Email/ })).toBeVisible();
  await expect(page.locator("#contacts").getByRole("link", { name: /Telegram/ })).toBeVisible();
  await expect(page.getByText(/проведи мышью|закрась сетку|след лапы/i)).toHaveCount(0);
  await expect(page.locator("#contacts").getByRole("button", { name: "Очистить рисунок" })).toBeVisible();

  const footer = page.getByRole("contentinfo");
  await footer.scrollIntoViewIfNeeded();
  await expect(footer.getByText("Kotikov © 2026")).toBeVisible();
  await expect(footer.getByRole("heading")).toHaveCount(0);
  await expect(footer.getByRole("link")).toHaveCount(0);
});
