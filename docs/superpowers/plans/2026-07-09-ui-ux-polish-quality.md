# UI/UX Polish Wave 3 — Resilience and Regression Control Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Завершить Bauhaus error surfaces и защитить critical recruiter path автоматическими E2E, visual, coverage и production-performance проверками.

**Architecture:** Route-level errors сохраняют требования Next.js 16: `error.tsx` и `global-error.tsx` остаются Client Components, а `global-error` самостоятельно рендерит `<html>/<body>`. `not-found.tsx` становится Server Component с маленьким client-only BackButton. Playwright запускает Chromium против production `next start`; visual tests используют reduced motion и фиксированные viewport states.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Vitest V8 coverage, Playwright 1.61+, Chromium, GitHub Actions, Bun.

**Depends on:** завершённые Wave 1 and Wave 2.

---

## File map

**Create**

- `app/components/BauhausErrorMark.tsx`
- `app/components/BackButton.tsx`
- `tests/app/error.test.tsx`
- `tests/app/not-found.test.tsx`
- `playwright.config.ts`
- `e2e/helpers/prepareStableVisual.ts`
- `e2e/recruiter-path.spec.ts`
- `e2e/navigation.spec.ts`
- `e2e/projects-and-timeline.spec.ts`
- `e2e/theme-and-motion.spec.ts`
- `e2e/errors.spec.ts`
- `e2e/visual/critical-states.spec.ts`

**Modify**

- `app/error.tsx`
- `app/global-error.tsx`
- `app/not-found.tsx`
- `package.json`
- `bun.lock`
- `.gitignore`
- `vitest.config.ts`
- `.github/workflows/readme-versions.yml`

**Generated but not committed**

- `test-results/`
- `playwright-report/`
- `blob-report/`
- `coverage/`
- `lighthouse-reports/`

---

### Task 1: Replace emoji and moving error decorations with Bauhaus geometry

**Files:**

- Create: `app/components/BauhausErrorMark.tsx`
- Create: `app/components/BackButton.tsx`
- Create: `tests/app/error.test.tsx`
- Create: `tests/app/not-found.test.tsx`
- Modify: `app/error.tsx:1-53`
- Modify: `app/global-error.tsx:1-79`
- Modify: `app/not-found.tsx:1-235`

- [ ] **Step 1: Write the failing route-error test**

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import ErrorPage from "@/app/error";

it("offers retry and home recovery without emoji", () => {
  const reset = vi.fn();
  const error = new Error("test failure");
  const { container } = render(<ErrorPage error={error} reset={reset} />);

  fireEvent.click(screen.getByRole("button", { name: "Попробовать снова" }));
  expect(reset).toHaveBeenCalledOnce();
  expect(screen.getByRole("link", { name: "На главную" })).toHaveAttribute("href", "/");
  expect(container).not.toHaveTextContent("🚨");
  expect(screen.getByTestId("bauhaus-error-mark")).toBeInTheDocument();
});
```

Stub `console.error` in `beforeEach` and restore it in `afterEach`.

- [ ] **Step 2: Write the failing 404 test**

```tsx
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import NotFound from "@/app/not-found";

vi.mock("@/features/nyancat", () => ({
  FlyingNyancat: () => <div data-testid="flying-nyancat" />,
}));

it("renders a static Russian recovery surface", () => {
  render(<NotFound />);

  expect(screen.getByRole("heading", { name: "Страница не найдена" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "На главную" })).toHaveAttribute("href", "/");
  expect(screen.queryAllByTestId("flying-nyancat")).toHaveLength(0);
});
```

- [ ] **Step 3: Run and confirm RED**

```powershell
bun test tests/app/error.test.tsx tests/app/not-found.test.tsx
```

- [ ] **Step 4: Create a shared static mark**

```tsx
interface BauhausErrorMarkProps {
  code: "404" | "error";
}

export default function BauhausErrorMark({ code }: BauhausErrorMarkProps): React.JSX.Element {
  return (
    <div
      data-testid="bauhaus-error-mark"
      className="relative mx-auto mb-8 size-28"
      aria-hidden="true"
    >
      <span className="absolute inset-0 border-2 border-black bg-primary-500 dark:border-white" />
      <span className="absolute left-4 top-4 size-20 border-2 border-black bg-white dark:border-white dark:bg-black" />
      <span className="absolute bottom-2 right-2 bg-black px-2 py-1 font-mono text-xs font-bold uppercase text-white dark:bg-white dark:text-black">
        {code}
      </span>
    </div>
  );
}
```

- [ ] **Step 5: Make BackButton the only 404 client island**

```tsx
"use client";

import { Button } from "@/shared/ui";

export default function BackButton(): React.JSX.Element {
  return (
    <Button type="button" variant="outline" size="lg" onClick={() => history.back()}>
      Назад
    </Button>
  );
}
```

Remove `"use client"`, all four `FlyingNyancat` instances and `styled-jsx` keyframes from `not-found.tsx`. Render `BauhausErrorMark`, `<Button href="/">На главную</Button>`, `BackButton`, and the three useful section links.

- [ ] **Step 6: Refactor route error**

Use `BauhausErrorMark`, keep `reset`, and replace raw Error logging with digest-only structured metadata:

```ts
useEffect(() => {
  console.error("App Router error", { digest: error.digest ?? "unknown" });
}, [error.digest]);
```

Do not log `error.message`, stack, tokens, URLs or user content in production. Replace `window.location.href` with:

```tsx
<Button href="/" variant="secondary">
  На главную
</Button>
```

- [ ] **Step 7: Keep global-error isolated**

Do not import app modules. Preserve `"use client"`, `<html lang="ru">`, `<body>` and `reset`. Log only `error.digest` using the same structured shape. Replace `💥` with an inline `aria-hidden` SVG or three CSS rectangles. Add:

```tsx
<a href="/" style={criticalLinkStyle}>
  На главную
</a>
```

Use CSS pseudo/inline styles for hover/focus instead of React mouse state. Do not expose `error.message` in production.

- [ ] **Step 8: Run tests and build**

```powershell
bun test tests/app/error.test.tsx tests/app/not-found.test.tsx
bun run build
```

Expected: PASS; `not-found.tsx` compiles as a Server Component.

- [ ] **Step 9: Commit**

```powershell
git add app tests/app
git commit -m "fix: polish resilient error surfaces"
```

---

### Task 2: Install and configure Playwright and coverage

**Files:**

- Modify: `package.json`
- Modify: `bun.lock`
- Modify: `.gitignore`
- Modify: `vitest.config.ts`
- Create: `playwright.config.ts`

- [ ] **Step 1: Add current compatible dev dependencies**

```powershell
bun add --dev @playwright/test @vitest/coverage-v8
bunx playwright install chromium
```

Expected: package and lockfile update; Chromium installs locally.

- [ ] **Step 2: Add scripts**

Add to `package.json`:

```json
"test:coverage": "vitest run --coverage",
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui",
"test:visual": "playwright test e2e/visual",
"test:visual:update": "playwright test e2e/visual --update-snapshots"
```

- [ ] **Step 3: Configure V8 coverage**

Add to `vitest.config.ts`:

```ts
coverage: {
  provider: "v8",
  reporter: ["text", "lcov"],
  include: [
    "src/features/performance/**/*.{ts,tsx}",
    "src/widgets/**/*.{ts,tsx}",
    "app/error.tsx",
    "app/not-found.tsx",
  ],
  thresholds: {
    lines: 80,
    functions: 80,
    branches: 80,
    statements: 80,
  },
},
```

If the first run is below 80%, keep the thresholds and add focused unit/component tests to the named modules in `include` until the command passes. Do not lower the target.

- [ ] **Step 4: Configure Playwright against production start**

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  timeout: 60_000,
  expect: {
    timeout: 5_000,
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.01,
      scale: "css",
    },
  },
  use: {
    baseURL: "http://127.0.0.1:3000",
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  webServer: {
    command: "bun run start",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "chromium-mobile",
      use: { ...devices["Pixel 7"] },
      testIgnore: /visual/,
    },
  ],
});
```

Playwright 1.61 supports `webServer`, `trace: "on-first-retry"`, reduced-motion emulation and screenshot options used here.

- [ ] **Step 5: Ignore generated artifacts**

Append:

```gitignore
/test-results/
/playwright-report/
/blob-report/
/lighthouse-reports/
```

`/coverage` is already ignored.

- [ ] **Step 6: Validate configuration**

```powershell
bun run build
bun run test:coverage
bunx playwright test --list
```

Expected: build passes, coverage report prints, Playwright lists projects even before specs exist.

- [ ] **Step 7: Commit**

```powershell
git add package.json bun.lock .gitignore vitest.config.ts playwright.config.ts
git commit -m "test: configure browser and coverage suites"
```

---

### Task 3: Cover the recruiter path, navigation and content details

**Files:**

- Create: `e2e/recruiter-path.spec.ts`
- Create: `e2e/navigation.spec.ts`
- Create: `e2e/projects-and-timeline.spec.ts`

- [ ] **Step 1: Write the recruiter-path spec**

```ts
import { expect, test } from "@playwright/test";

test("recruiter can understand the profile and reach contact", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "Kotikov" })).toBeVisible();
  const contactAction = page.getByRole("link", { name: /^Связаться/ }).first();
  await expect(contactAction).toHaveAttribute("href", "#contacts");

  await page.locator("#projects").scrollIntoViewIfNeeded();
  await expect(page.locator("#projects")).toBeVisible();

  await contactAction.click();
  await expect(page).toHaveURL(/#contacts$/);
  await expect(page.locator("#contacts")).toBeVisible();
  await expect(page.locator("#contacts").getByRole("link", { name: /Написать:/ })).toBeVisible();
  await expect(page.locator("#contacts").getByRole("link", { name: /Telegram/ })).toBeVisible();
});
```

- [ ] **Step 2: Write desktop/mobile navigation tests**

Desktop verifies the persistent contact CTA after scroll. Mobile uses the Russian menu labels:

```ts
await page.setViewportSize({ width: 375, height: 812 });
await page.goto("/");
await page.getByRole("button", { name: "Открыть меню" }).click();
await expect(page.getByRole("dialog")).toBeVisible();
await page.keyboard.press("Escape");
await expect(page.getByRole("dialog")).toBeHidden();
await expect(page.getByRole("button", { name: "Открыть меню" })).toBeFocused();
```

- [ ] **Step 3: Write project and timeline specs**

Desktop:

```ts
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto("/#projects");
await page.locator("#projects").getByRole("button", { name: "Подробнее" }).first().click();
await expect(page.locator("#projects").getByText("Задача", { exact: true })).toBeVisible();
```

Mobile selects the next project button and verifies `aria-pressed`. Timeline uses «Следующий этап» and verifies the live counter changes.

- [ ] **Step 4: Build and run only these specs**

```powershell
bun run build
bunx playwright test e2e/recruiter-path.spec.ts e2e/navigation.spec.ts e2e/projects-and-timeline.spec.ts
```

Expected: PASS in desktop and mobile projects. If a behavior fails, fix the product code; do not weaken accessible locators.

- [ ] **Step 5: Commit**

```powershell
git add e2e
git commit -m "test: cover critical recruiter journey"
```

---

### Task 4: Cover theme, reduced motion and error recovery

**Files:**

- Create: `e2e/theme-and-motion.spec.ts`
- Create: `e2e/errors.spec.ts`

- [ ] **Step 1: Write theme persistence**

```ts
test("theme persists after reload", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("theme", "light");
  });
  await page.goto("/");
  await page.getByRole("button", { name: /тёмн.*тем/i }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
});
```

Use the actual accessible label from `ThemeToggle` if its copy differs; do not use CSS-only selectors for the action.

- [ ] **Step 2: Write reduced-motion lifecycle**

```ts
test.use({ reducedMotion: "reduce" });

test("renders static skills content when motion is reduced", async ({ page }) => {
  await page.goto("/#skills");
  await expect(page.locator("#skills")).toBeVisible();
  await expect(page.locator("#skills").getByRole("list").first()).toBeVisible();
  await expect(page.locator('[data-motion-active="true"]')).toHaveCount(0);
});
```

- [ ] **Step 3: Write 404 recovery**

```ts
test("404 offers Russian recovery", async ({ page }) => {
  await page.goto("/no-such-route-wave-three");
  await expect(page.getByRole("heading", { name: "Страница не найдена" })).toBeVisible();
  await page.getByRole("link", { name: "На главную" }).click();
  await expect(page).toHaveURL("/");
});
```

Route error recovery remains covered at component level because adding a production-only throw route is outside scope.

- [ ] **Step 4: Run specs**

```powershell
bun run build
bunx playwright test e2e/theme-and-motion.spec.ts e2e/errors.spec.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add e2e/theme-and-motion.spec.ts e2e/errors.spec.ts
git commit -m "test: cover themes motion and recovery"
```

---

### Task 5: Add stable critical-state visual regression

**Files:**

- Create: `e2e/helpers/prepareStableVisual.ts`
- Create: `e2e/visual/critical-states.spec.ts`
- Create after Linux run: `e2e/visual/critical-states.spec.ts-snapshots/*.png`

- [ ] **Step 1: Implement deterministic visual preparation**

```ts
import type { Page } from "@playwright/test";

export async function prepareStableVisual(page: Page, theme: "light" | "dark"): Promise<void> {
  await page.addInitScript((selectedTheme) => {
    localStorage.setItem("theme", selectedTheme);
  }, theme);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/_vercel/**", (route) => route.abort());
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
      }
      canvas { visibility: hidden !important; }
    `,
  });
}
```

- [ ] **Step 2: Add the minimal screenshot matrix**

Use locator screenshots, not full-page screenshots:

```ts
import { expect, test } from "@playwright/test";

import { prepareStableVisual } from "../helpers/prepareStableVisual";

for (const theme of ["light", "dark"] as const) {
  test(`hero ${theme}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await prepareStableVisual(page, theme);
    await expect(page.locator("#header")).toHaveScreenshot(`hero-${theme}-1440.png`);
  });
}

test("mobile contacts", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await prepareStableVisual(page, "light");
  await page.locator("#contacts").scrollIntoViewIfNeeded();
  await expect(page.locator("#contacts")).toHaveScreenshot("contacts-light-375.png");
});
```

Add stable shots for:

- hero: 375 and 1440, light/dark;
- expanded project: 375 and 1440, light;
- skills: 1440 reduced-motion;
- timeline: 375 and 1024;
- contacts: 375 and 1440;
- mobile menu: 375;
- 404: 375 and 1440.

Keep total baselines at or below 16 images.

- [ ] **Step 3: Generate baselines in Linux CI or a Linux container**

```bash
bun run build
bun run test:visual:update
```

Do not commit Windows-generated snapshots over Linux baselines. Review every image before adding it.

- [ ] **Step 4: Verify zero-diff run**

```bash
bun run test:visual
```

Expected: PASS with `maxDiffPixelRatio: 0.01`.

- [ ] **Step 5: Commit reviewed baselines**

```bash
git add e2e/helpers e2e/visual
git commit -m "test: add critical visual regression coverage"
```

---

### Task 6: Run browser tests in CI

**Files:**

- Modify: `.github/workflows/readme-versions.yml:28-35`

- [ ] **Step 1: Add Chromium installation after dependency install**

```yaml
- name: Install Playwright Chromium
  run: bunx playwright install --with-deps chromium
```

- [ ] **Step 2: Add E2E after the existing production build**

```yaml
- name: End-to-end and visual tests
  run: bun run test:e2e
```

`playwright.config.ts` starts `bun run start` and reuses the build created by the existing Build step.

- [ ] **Step 3: Add coverage to the test step**

Replace:

```yaml
- name: Test
  run: bun run test
```

with:

```yaml
- name: Test with coverage
  run: bun run test:coverage
```

- [ ] **Step 4: Validate workflow locally**

```powershell
bun install --frozen-lockfile
bun run lint
bun run test:coverage
bun run build
bun run test:e2e
```

Expected: same sequence exits 0.

- [ ] **Step 5: Commit**

```powershell
git add .github/workflows/readme-versions.yml
git commit -m "test: run browser regression suite in ci"
```

---

### Task 7: Measure final production performance and close the polish

**Files:**

- No committed generated reports.
- Modify product code only for measured regressions attributable to Waves 1–3.

- [ ] **Step 1: Start the production build**

```powershell
bun run build
bun run start
```

- [ ] **Step 2: Capture the final Lighthouse report**

In another PowerShell terminal:

```powershell
New-Item -ItemType Directory -Force "lighthouse-reports" | Out-Null

bunx lighthouse http://127.0.0.1:3000 `
  --only-categories=performance `
  --form-factor=mobile `
  --throttling-method=simulate `
  --screenEmulation.mobile=true `
  --output=json `
  --output=html `
  --output-path=./lighthouse-reports/final `
  --chrome-flags="--headless=new --no-sandbox"
```

Compare against the Wave 1 baseline under identical conditions.

- [ ] **Step 3: Validate performance budgets**

Acceptance:

- LCP ≤ 2.5 s;
- CLS ≤ 0.1;
- interaction trace shows no persistent main-thread task from hidden/offscreen effects;
- INP is confirmed from Vercel Speed Insights after deployment; local Lighthouse TBT is only a lab proxy.

- [ ] **Step 4: Record runtime traces**

In Chrome Performance:

1. Record Skills with marquee active.
2. Move pointer into Skills and verify marquee pauses while cursor Nyancat runs.
3. Scroll Skills offscreen and verify rAF stops.
4. Hide the tab and verify CSS animations pause.
5. Draw in Header and Contacts and verify scroll remains available outside active drawing.

- [ ] **Step 5: Run the complete quality gate**

```powershell
bun run format:check
bun run lint
bun run test:coverage
bun run build
bun run test:e2e
```

Expected: all exit 0.

- [ ] **Step 6: Keep reports untracked and route defects back to their task**

Do not commit Lighthouse output and do not create an empty commit. If measurement exposes a regression, return to the task that owns the affected component, add a failing regression test there, implement the measured fix, rerun the complete quality gate, and commit using that task’s exact file scope.

---

## Wave 3 completion gate

- Error, global-error and 404 use Russian Bauhaus recovery UI without emoji.
- 404 no longer mounts four perpetual FlyingNyancat animations.
- Playwright covers recruiter path, navigation, project/timeline details, theme, reduced motion and 404.
- Visual suite contains no more than 16 reviewed stable screenshots.
- CI runs coverage, production build and Chromium E2E/visual checks.
- Touched critical modules meet 80% coverage; critical paths are fully covered.
- Final Lighthouse uses the same profile as baseline.
- Offscreen and hidden-tab effects show no continuous work in runtime traces.
- Full format, lint, coverage, build and E2E commands pass.
