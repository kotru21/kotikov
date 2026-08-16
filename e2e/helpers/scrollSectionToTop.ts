import type { Locator, Page } from "@playwright/test";

const PUZZLE_CLEARANCE_PX = 8;

/**
 * Puts a section at the viewport top.
 * Waits until the puzzle bottom has left the viewport so SiteFrame chrome can show.
 */
export async function scrollSectionToTop(page: Page, sectionId: string): Promise<void> {
  const section = page.locator(`#${sectionId}`);
  await section.waitFor();
  await section.evaluate((el, clearance) => {
    const scrolling = document.scrollingElement ?? document.documentElement;
    const top = el.getBoundingClientRect().top + scrolling.scrollTop + clearance;
    const html = document.documentElement;
    const previousBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    scrolling.scrollTop = top;
    html.style.scrollBehavior = previousBehavior;
  }, PUZZLE_CLEARANCE_PX);
  await page.waitForFunction(() => {
    const header = document.getElementById("header");
    if (header === null) return false;
    return header.getBoundingClientRect().bottom <= 0;
  });
}

/** Instant scroll — `html { scroll-behavior: smooth }` would otherwise race bounding boxes. */
export async function scrollLocatorInstant(
  locator: Locator,
  block: ScrollLogicalPosition = "center"
): Promise<void> {
  await locator.evaluate((el, align) => {
    const html = document.documentElement;
    const previousBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    el.scrollIntoView({ block: align });
    html.style.scrollBehavior = previousBehavior;
  }, block);
}
