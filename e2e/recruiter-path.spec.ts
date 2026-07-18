import { expect, test } from "@playwright/test";

test("recruiter can understand the profile and reach contact", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "Kotikov" })).toBeVisible();
  const contactAction = page.getByRole("link", { name: /^Связаться/ }).first();
  await expect(contactAction).toHaveAttribute("href", "#contacts");

  await page.locator("#about").scrollIntoViewIfNeeded();
  await expect(page.locator("#about")).toBeVisible();
  await expect(page.locator("#about-heading")).toHaveText("Коротко обо мне");
  await expect(page.locator("#about pre code")).toContainText("export const kotikov");

  await page.locator("#projects").scrollIntoViewIfNeeded();
  await expect(page.locator("#projects")).toBeVisible();

  await contactAction.click();
  await expect(page).toHaveURL(/#contacts$/);
  await expect(page.locator("#contacts")).toBeVisible();
  await expect(page.locator("#contacts").getByRole("link", { name: /Написать:/ })).toBeVisible();
  await expect(page.locator("#contacts").getByRole("link", { name: /Telegram/ })).toBeVisible();

  const footer = page.getByRole("contentinfo");
  await footer.scrollIntoViewIfNeeded();
  await expect(footer.getByRole("heading", { name: "Kotikov", exact: true })).toBeVisible();
  await expect(footer.getByRole("link", { name: "Контакты" })).toHaveAttribute("href", "#contacts");
  await expect(
    footer.getByRole("link", { name: "GitHub (откроется в новой вкладке)" })
  ).toBeVisible();
  await expect(footer.getByText(/© 2026 Kotikov\./)).toBeVisible();
});
