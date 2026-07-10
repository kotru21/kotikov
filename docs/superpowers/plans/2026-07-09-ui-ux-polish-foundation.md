# UI/UX Polish Wave 1 — Meaning and Accessibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Сделать русскоязычный recruiter path понятным, доступным и стабильным на первом рендере до визуальной и motion-полировки.

**Architecture:** Сохраняем текущую FSD-структуру и server-rendered `app/page.tsx`. Тексты остаются в `shared/config/content`, общие a11y-форматтеры — в `shared/lib`, responsive-варианты Skills выбираются CSS внутри одного стабильного DOM, а carousel controls используют native button-group semantics вместо неполного ARIA tabs pattern.

**Tech Stack:** Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS 4, Headless UI, Vitest 4, Testing Library, Bun 1.3.

**Depends on:** `docs/superpowers/specs/2026-07-09-ui-ux-polish-design.md`

---

## File map

**Create**

- `app/components/SkipLinks.tsx` — два переиспользуемых skip-link.
- `tests/app/SkipLinks.test.tsx` — контракты skip navigation.
- `src/shared/lib/a11y/externalLink.ts` — единый русский accessible label внешней ссылки.
- `src/shared/lib/a11y/index.ts` — публичный export a11y helpers.
- `tests/shared/externalLink.test.ts` — unit-контракт helper.
- `tests/widgets/ProjectCardDeck.test.tsx` — semantics mobile project carousel.
- `tests/widgets/SkillsWidget.test.tsx` — стабильная dual-render разметка.
- `tests/features/nyancatUi.test.tsx` — moving decorations stay outside keyboard order.

**Modify**

- `src/shared/config/content/header.ts`
- `tests/shared/content.test.ts`
- `app/layout.tsx`
- `app/page.tsx`
- `src/widgets/header/ui/HeaderNavigation.tsx`
- `tests/widgets/HeaderNavigation.test.tsx`
- `src/entities/project/ui/ProjectCard.tsx`
- `tests/entities/project/ProjectCard.test.tsx`
- `src/widgets/skills/ui/SkillsMarquee.tsx`
- `src/widgets/footer/ui/FooterSocial.tsx`
- `src/widgets/contacts/ui/ContactsView.tsx`
- `src/features/nyancat/ui/NyancatImage.tsx`
- `src/features/nyancat/ui/InteractionOverlay.tsx`
- `src/widgets/projects/ui/ProjectCardDeck.tsx`
- `src/widgets/projects/ui/useProjectDeck.ts`
- `src/widgets/timeline/ui/TimelineStepChips.tsx`
- `src/widgets/timeline/ui/TimelineView.tsx`
- `tests/widgets/TimelineStepChips.test.tsx`
- `tests/widgets/TimelineView.test.tsx`
- `src/widgets/skills/SkillsWidget.tsx`
- `src/widgets/skills/ui/SkillsMobileView.tsx`
- `src/widgets/skills/ui/SkillsDesktopView.tsx`
- `src/widgets/skills/ui/SkillsMarquee.tsx`
- `src/shared/styles/tailwind/base.css`

---

### Task 1: Make contact the primary recruiter action

**Files:**

- Modify: `tests/shared/content.test.ts`
- Modify: `src/shared/config/content/header.ts:1-16`
- Test: `tests/shared/content.test.ts`

- [ ] **Step 1: Write the failing content contract**

Add:

```ts
import { headerContent } from "@/shared/config/content";

it("makes contact the primary hero action", () => {
  expect(headerContent.buttons.primary).toEqual({
    text: "Связаться",
    href: "#contacts",
  });
  expect(headerContent.buttons.secondary).toEqual({
    text: "Смотреть проекты",
    href: "#projects",
  });
});
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run:

```powershell
bun test tests/shared/content.test.ts
```

Expected: FAIL because primary currently points to `#projects`.

- [ ] **Step 3: Swap the content roles without changing component APIs**

Replace `buttons` in `header.ts` with:

```ts
buttons: {
  primary: {
    text: "Связаться",
    href: "#contacts",
  },
  secondary: {
    text: "Смотреть проекты",
    href: "#projects",
  },
},
```

`HeaderHero.tsx` already renders `primary` as the solid `Button`; no client state is needed.

- [ ] **Step 4: Run focused and header tests**

```powershell
bun test tests/shared/content.test.ts tests/widgets/HeaderNavigation.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/shared/config/content/header.ts tests/shared/content.test.ts
git commit -m "feat: prioritize contact action in hero"
```

---

### Task 2: Expose project outcomes before expansion

**Files:**

- Modify: `src/entities/project/ui/ProjectCard.tsx:68-84`
- Modify: `tests/entities/project/ProjectCard.test.tsx`

- [ ] **Step 1: Write the failing content-visibility test**

Render the existing project factory/data and assert:

```tsx
expect(screen.getByText("Результат")).toBeInTheDocument();
expect(screen.getByText(project.details.outcome)).toBeInTheDocument();
```

- [ ] **Step 2: Run and confirm RED**

```powershell
bun test tests/entities/project/ProjectCard.test.tsx
```

Expected: FAIL because `details.outcome` is visible only after expansion.

- [ ] **Step 3: Add a concise outcome line to the closed card**

After `project.summary`, render:

```tsx
<p className="mt-3 max-w-[18rem] text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
  <span className="mr-2 font-mono text-xs font-bold uppercase tracking-[0.12em]">Результат</span>
  {project.details.outcome}
</p>
```

Keep the expanded «Задача → Решение → Результат + Стек» grid unchanged. Wave 1’s responsive layout task removes the magic deck height so the added line cannot clip.

- [ ] **Step 4: Run the focused test**

```powershell
bun test tests/entities/project/ProjectCard.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/entities/project/ui/ProjectCard.tsx tests/entities/project/ProjectCard.test.tsx
git commit -m "feat: surface project outcomes on cards"
```

---

### Task 3: Add explicit main-content and projects skip links

**Files:**

- Create: `app/components/SkipLinks.tsx`
- Create: `tests/app/SkipLinks.test.tsx`
- Modify: `app/layout.tsx:138-147`
- Modify: `app/page.tsx:11-24`

- [ ] **Step 1: Write the failing component test**

```tsx
import { render, screen } from "@testing-library/react";

import SkipLinks from "@/app/components/SkipLinks";

it("links to main content and projects", () => {
  render(<SkipLinks />);

  expect(screen.getByRole("link", { name: "К основному содержимому" })).toHaveAttribute(
    "href",
    "#main-content"
  );
  expect(screen.getByRole("link", { name: "К проектам" })).toHaveAttribute("href", "#projects");
});
```

- [ ] **Step 2: Run the focused test and confirm RED**

```powershell
bun test tests/app/SkipLinks.test.tsx
```

Expected: FAIL because `SkipLinks` does not exist.

- [ ] **Step 3: Implement the focused component**

```tsx
const skipLinkClassName =
  "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:z-100 focus:border-2 focus:border-black focus:bg-white focus:px-4 focus:py-2 focus:font-bold dark:focus:border-white dark:focus:bg-black dark:focus:text-white";

export default function SkipLinks(): React.JSX.Element {
  return (
    <nav aria-label="Быстрый переход">
      <a href="#main-content" className={`${skipLinkClassName} focus:left-4`}>
        К основному содержимому
      </a>
      <a href="#projects" className={`${skipLinkClassName} focus:left-56`}>
        К проектам
      </a>
    </nav>
  );
}
```

In `layout.tsx`, import and render `<SkipLinks />` where the current single anchor lives. In `page.tsx`, change:

```tsx
<main id="main-content" tabIndex={-1}>
```

The negative tab index lets the hash target receive programmatic focus without adding it to normal tab order.

- [ ] **Step 4: Run the test and build type-check**

```powershell
bun test tests/app/SkipLinks.test.tsx
bun run build
```

Expected: PASS and successful Next.js build.

- [ ] **Step 5: Commit**

```powershell
git add app/components/SkipLinks.tsx app/layout.tsx app/page.tsx tests/app/SkipLinks.test.tsx
git commit -m "feat: add accessible skip navigation"
```

---

### Task 4: Standardize Russian chrome and external-link announcements

**Files:**

- Create: `src/shared/lib/a11y/externalLink.ts`
- Create: `src/shared/lib/a11y/index.ts`
- Create: `tests/shared/externalLink.test.ts`
- Modify: `src/shared/lib/index.ts`
- Modify: `src/widgets/header/ui/HeaderNavigation.tsx:88-146,258-266`
- Modify: `tests/widgets/HeaderNavigation.test.tsx`
- Modify: `src/entities/project/ui/ProjectCard.tsx:106-124`
- Modify: `tests/entities/project/ProjectCard.test.tsx`
- Modify: `src/widgets/skills/ui/SkillsMarquee.tsx:47-58`
- Modify: `src/widgets/footer/ui/FooterSocial.tsx`
- Modify: `src/widgets/contacts/ui/ContactsView.tsx:129-157`

- [ ] **Step 1: Write the failing helper test**

```ts
import { formatExternalLinkLabel } from "@/shared/lib";

it("describes a new browser tab in Russian", () => {
  expect(formatExternalLinkLabel("Код")).toBe("Код (откроется в новой вкладке)");
});
```

- [ ] **Step 2: Run the unit test and confirm RED**

```powershell
bun test tests/shared/externalLink.test.ts
```

Expected: FAIL because the helper is not exported.

- [ ] **Step 3: Implement and export the helper**

```ts
// src/shared/lib/a11y/externalLink.ts
export function formatExternalLinkLabel(visibleName: string): string {
  return `${visibleName} (откроется в новой вкладке)`;
}
```

```ts
// src/shared/lib/a11y/index.ts
export { formatExternalLinkLabel } from "./externalLink";
```

```ts
// src/shared/lib/index.ts
export { formatExternalLinkLabel } from "./a11y";
export { isInteractiveTarget } from "./dom";
```

- [ ] **Step 4: Change the header tests to Russian accessible names**

Update expected names:

```ts
screen.getByRole("navigation", { name: "Основная навигация" });
screen.getByRole("button", { name: "Открыть меню" });
screen.getByRole("button", { name: "Закрыть меню" });
```

Run and confirm RED:

```powershell
bun test tests/widgets/HeaderNavigation.test.tsx
```

- [ ] **Step 5: Implement Russian header labels**

Use:

```tsx
<nav aria-label="Основная навигация" ...>
```

and replace the two sr-only strings with `Открыть меню` and `Закрыть меню`.

- [ ] **Step 6: Apply the external-link helper at every app-chrome link**

Examples:

```tsx
<a
  href={project.repoUrl}
  target="_blank"
  rel="noopener noreferrer"
  aria-label={formatExternalLinkLabel("Код")}
>
```

```tsx
<a
  href={project.liveUrl}
  target="_blank"
  rel="noopener noreferrer"
  aria-label={formatExternalLinkLabel("Демо")}
>
  <FiExternalLink aria-hidden="true" /> Демо
</a>
```

For contacts, treat only `http://` and `https://` URLs as new-tab links:

```tsx
const opensNewTab = contact.link?.startsWith("http") ?? false;

target={opensNewTab ? "_blank" : undefined}
rel={opensNewTab ? "noopener noreferrer" : undefined}
aria-label={
  opensNewTab ? formatExternalLinkLabel(contact.label) : `Написать: ${contact.value}`
}
```

Do not put `mailto:` in a forced new tab. Apply the helper to HTTP social links and desktop LinkedIn; keep visible copy unchanged.

- [ ] **Step 7: Run all affected tests**

```powershell
bun test tests/shared/externalLink.test.ts tests/widgets/HeaderNavigation.test.tsx tests/entities/project/ProjectCard.test.tsx
```

Expected: PASS.

- [ ] **Step 8: Commit**

```powershell
git add src/shared/lib src/widgets/header/ui/HeaderNavigation.tsx src/entities/project/ui/ProjectCard.tsx src/widgets/skills/ui/SkillsMarquee.tsx src/widgets/footer/ui/FooterSocial.tsx src/widgets/contacts/ui/ContactsView.tsx tests
git commit -m "fix: localize accessible interface labels"
```

---

### Task 5: Remove moving Nyancat targets from keyboard navigation

**Files:**

- Modify: `src/features/nyancat/ui/NyancatImage.tsx:33-64`
- Modify: `src/features/nyancat/ui/InteractionOverlay.tsx:31-55`
- Create: `tests/features/nyancatUi.test.tsx`

- [ ] **Step 1: Write a failing accessibility test**

```tsx
import { render } from "@testing-library/react";

import { NyancatImage } from "@/features/nyancat/ui/NyancatImage";

it("keeps the moving decoration out of keyboard order", () => {
  const { container } = render(
    <NyancatImage
      size="small"
      animationName="test-flight"
      animationDuration="10s"
      animationDelay="0s"
      isMobile={false}
      onMouseEnter={() => undefined}
      onClick={() => undefined}
    />
  );

  expect(container.querySelector('[tabindex="0"]')).toBeNull();
  expect(container.querySelector('[role="button"]')).toBeNull();
});
```

- [ ] **Step 2: Run and confirm RED**

```powershell
bun test tests/features/nyancatUi.test.tsx
```

Expected: FAIL because the moving image has `role="button"` and `tabIndex={0}`.

- [ ] **Step 3: Make pointer interaction decorative for assistive technology**

For both moving wrappers:

```tsx
<div
  aria-hidden="true"
  style={{ ...existingStyles }}
  onMouseEnter={onMouseEnter}
  onClick={onClick}
  onTouchStart={onClick}
/>
```

Remove `role`, `tabIndex`, `aria-label` and `onKeyDown`. Keep pointer/touch Easter-egg behavior. A future stable «Запустить Нянкота» control is outside Wave 1 scope.

- [ ] **Step 4: Run focused and header tests**

```powershell
bun test tests/features/nyancatUi.test.tsx tests/widgets/HeaderNavigation.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/features/nyancat/ui tests/features/nyancatUi.test.tsx
git commit -m "fix: remove moving nyancat keyboard targets"
```

---

### Task 6: Replace incomplete tabs semantics in project and timeline carousels

**Files:**

- Create: `tests/widgets/ProjectCardDeck.test.tsx`
- Modify: `src/widgets/projects/ui/ProjectCardDeck.tsx:23-122`
- Modify: `src/widgets/projects/ui/useProjectDeck.ts:13-60`
- Modify: `src/widgets/timeline/ui/TimelineStepChips.tsx:10-116`
- Modify: `src/widgets/timeline/ui/TimelineView.tsx:95-134`
- Modify: `tests/widgets/TimelineStepChips.test.tsx`
- Modify: `tests/widgets/TimelineView.test.tsx`

- [ ] **Step 1: Write the project deck semantics test**

Mock project expansion as existing project tests do, then assert:

```tsx
import { within } from "@testing-library/react";

const controls = screen.getByRole("group", { name: "Выбор проекта" });
expect(controls).not.toHaveAttribute("tabIndex");
expect(within(controls).getAllByRole("button", { name: /Выбрать проект/ })).toHaveLength(
  projectsData.length
);
expect(
  within(controls).getByRole("button", {
    name: `Выбрать проект ${projectsData[0].title}`,
  })
).toHaveAttribute("aria-pressed", "true");
expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
```

- [ ] **Step 2: Update timeline tests to the same native-button contract**

```tsx
expect(screen.getByRole("group", { name: "Этапы опыта" })).toBeInTheDocument();
expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
expect(screen.getAllByRole("button")[0]).toHaveAttribute("aria-pressed", "true");
```

- [ ] **Step 3: Run tests and confirm RED**

```powershell
bun test tests/widgets/ProjectCardDeck.test.tsx tests/widgets/TimelineStepChips.test.tsx tests/widgets/TimelineView.test.tsx
```

- [ ] **Step 4: Implement project controls as a button group**

Use:

```tsx
<div
  className="mt-3 flex items-center justify-center gap-1 px-1 py-2"
  role="group"
  aria-label="Выбор проекта"
  onKeyDown={handleKeyDown}
>
  {projects.map((project, index) => {
    const isSelected = index === activeIndex;

    return (
      <button
        key={project.slug}
        type="button"
        aria-pressed={isSelected}
        aria-label={`Выбрать проект ${project.title}`}
        onClick={() => goTo(index)}
        className="inline-flex min-h-11 min-w-11 items-center justify-center p-3 focus-visible:outline-2"
      >
        {/* existing visual indicator */}
      </button>
    );
  })}
</div>
```

Change the active slide from `tabpanel` to:

```tsx
role={isActive ? "group" : undefined}
aria-roledescription={isActive ? "слайд" : undefined}
aria-label={isActive ? `${index + 1} из ${projects.length}: ${project.title}` : undefined}
```

Generalize `handleKeyDown` to `React.KeyboardEvent` so bubbled events from buttons are accepted.

- [ ] **Step 5: Implement timeline controls as a button group**

Replace `role="tablist"` and container `tabIndex` with:

```tsx
role="group"
aria-label="Этапы опыта"
```

Each chip becomes a plain button with:

```tsx
aria-pressed={isActive}
aria-controls={panelId}
```

The active panel becomes:

```tsx
role="group"
aria-roledescription="этап карьеры"
aria-label={`${activeIndex + 1} из ${timelineData.length}`}
```

Keep existing previous/next buttons, swipe logic and `aria-live` counter.

- [ ] **Step 6: Run focused tests**

```powershell
bun test tests/widgets/ProjectCardDeck.test.tsx tests/widgets/projectDeck.test.ts tests/widgets/TimelineStepChips.test.tsx tests/widgets/TimelineView.test.tsx tests/widgets/useTimelineCarousel.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit**

```powershell
git add src/widgets/projects src/widgets/timeline tests/widgets
git commit -m "fix: use native carousel control semantics"
```

---

### Task 7: Remove the Skills desktop-to-mobile hydration flash

**Files:**

- Create: `tests/widgets/SkillsWidget.test.tsx`
- Modify: `src/widgets/skills/SkillsWidget.tsx`
- Modify: `src/widgets/skills/ui/SkillsMobileView.tsx:13-122`
- Modify: `src/widgets/skills/ui/SkillsDesktopView.tsx:10-32`
- Modify: `src/widgets/skills/ui/SkillsMarquee.tsx:12-64`

- [ ] **Step 1: Write the failing stable-DOM test**

```tsx
import { render, screen } from "@testing-library/react";

import SkillsWidget from "@/widgets/skills/SkillsWidget";

it("server-renders both CSS responsive presentations under one skills landmark", () => {
  const { container } = render(<SkillsWidget />);

  expect(container.querySelectorAll("#skills")).toHaveLength(1);
  expect(container.querySelector('[data-skills-view="mobile"]')).toHaveClass("md:hidden");
  expect(container.querySelector('[data-skills-view="desktop"]')).toHaveClass("hidden", "md:block");
  expect(screen.getAllByText("Мои навыки")).toHaveLength(2);
});
```

Mock `IntersectionObserver` and `usePerformanceSettings` using the patterns already present in widget tests.

- [ ] **Step 2: Run and confirm RED**

```powershell
bun test tests/widgets/SkillsWidget.test.tsx
```

Expected: FAIL because `SkillsWidget` renders only one JS-selected view.

- [ ] **Step 3: Move the shared section landmark into SkillsWidget**

Implement the stable shell:

```tsx
import { Section } from "@/shared/ui";

const SkillsWidget: React.FC = () => (
  <Section
    id="skills"
    spacing="dense"
    backgroundClassName="bg-background-primary dark:bg-background-tertiary"
    className="overflow-x-clip"
    innerClassName="relative z-10 max-w-full"
    aria-label="Навыки"
  >
    <div data-skills-view="mobile" className="md:hidden">
      <SkillsMobileView headingId="skills-heading-mobile" />
    </div>
    <div data-skills-view="desktop" className="hidden md:block">
      <SkillsDesktopView headingId="skills-heading-desktop" />
    </div>
  </Section>
);
```

Add `headingId: string` props to both view components. Remove their nested `Section` wrappers and pass the ID into `SectionHeader`. Pass the desktop ID through `SkillsMarquee`.

- [ ] **Step 4: Ensure the hidden tree does not animate**

Wave 1 only establishes the DOM contract. Add:

```tsx
<div data-skills-view="mobile" className="md:hidden" aria-hidden={undefined}>
```

Do not add `aria-hidden` based on viewport JS. `display:none` removes the inactive tree from layout and the accessibility tree. Wave 2 will gate continuous loops by actual scene visibility.

- [ ] **Step 5: Run focused and full widget tests**

```powershell
bun test tests/widgets/SkillsWidget.test.tsx tests/widgets/home-order.test.tsx
```

Expected: PASS with exactly one `#skills`.

- [ ] **Step 6: Commit**

```powershell
git add src/widgets/skills tests/widgets/SkillsWidget.test.tsx
git commit -m "fix: stabilize responsive skills rendering"
```

---

### Task 8: Remove magic deck height and contain expanded project overflow

**Files:**

- Modify: `src/widgets/projects/ui/ProjectCardDeck.tsx:27-77`
- Modify: `src/shared/styles/tailwind/base.css:29-110`
- Modify: `tests/widgets/ProjectCardDeck.test.tsx`
- Modify: `tests/widgets/ProjectsGrid.test.tsx`

- [ ] **Step 1: Add failing layout-contract assertions**

```tsx
const deck = screen.getByRole("region", { name: "Избранные проекты" });
expect(deck.querySelector('[style*="28rem"]')).toBeNull();
```

Add a `data-testid="projects-grid-shell"` assertion to the existing grid test:

```tsx
expect(screen.getByTestId("projects-grid-shell")).toHaveClass("max-w-full");
```

- [ ] **Step 2: Run and confirm RED**

```powershell
bun test tests/widgets/ProjectCardDeck.test.tsx tests/widgets/ProjectsGrid.test.tsx
```

- [ ] **Step 3: Let CSS grid size the deck from the active card**

Add `role="region"` and `aria-label="Избранные проекты"` to the outer carousel. Replace absolute stacking for the active card container with a single-cell grid:

```tsx
<div className="relative mx-auto grid w-full max-w-md">
  {projects.map((project, index) => (
    <div
      key={project.slug}
      className={`col-start-1 row-start-1 origin-center ${motionClass}`}
      aria-hidden={!isActive}
      {...(!isActive ? { inert: true } : {})}
      style={{ zIndex, transform, opacity }}
    >
      {/* existing card */}
    </div>
  ))}
</div>
```

The grid track follows the tallest rendered card, so 200% text zoom and longer Russian copy do not clip.

- [ ] **Step 4: Contain desktop expansion without clipping the detail panel**

In `base.css`, replace page-width growth with a bounded shell:

```css
.projects-grid-shell {
  max-inline-size: 100%;
  min-inline-size: 0;
}

.projects-grid-row {
  max-inline-size: 100%;
  min-inline-size: 0;
}
```

Remove the rule that sets `width: calc(100% + var(--project-detail-w))` and negative margin. Keep the detail grid inside the available row columns. If the detail needs two columns, change its internal grid rather than document width.

- [ ] **Step 5: Run project regression tests**

```powershell
bun test tests/widgets/ProjectCardDeck.test.tsx tests/widgets/ProjectsGrid.test.tsx tests/entities/project/ProjectCardExpandable.test.tsx tests/entities/project/ProjectDetailSheet.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit**

```powershell
git add src/widgets/projects src/shared/styles/tailwind/base.css tests/widgets
git commit -m "fix: prevent project layout overflow"
```

---

### Task 9: Verify Wave 1 and record the production baseline

**Files:**

- Modify only if failures require scoped fixes from Tasks 1–7.

- [ ] **Step 1: Run formatting, lint, tests and build**

```powershell
bun run format:check
bun run lint
bun run test
bun run build
```

Expected: all commands exit 0.

- [ ] **Step 2: Run a manual keyboard pass**

Verify:

1. First Tab reveals «К основному содержимому».
2. Second skip-link reaches projects.
3. Mobile menu opens, traps focus, closes with Escape and restores focus.
4. Moving Nyancat never receives focus.
5. Project and timeline buttons are reachable and announce active state.
6. «Связаться» is the solid hero CTA and nav CTA.

- [ ] **Step 3: Record baseline CWV before Wave 2**

Build and start:

```powershell
bun run build
bun run start
```

In another terminal run Lighthouse mobile with 4× CPU and simulated Slow 4G. Record LCP, INP/TBT proxy and CLS in the implementation PR description. Do not commit generated reports.

- [ ] **Step 4: Check the target viewports manually**

Verify 375, 768, 1024 and 1440 px in light/dark:

- no desktop Skills flash;
- no horizontal page scrollbar;
- project content survives 200% text zoom;
- contact links remain at least 44×44 CSS px.

- [ ] **Step 5: Leave generated baseline artifacts untracked**

Do not commit Lighthouse output. If verification exposes a product defect, return to the responsible task above, add a failing regression test, implement the fix, rerun that task’s checks, and use that task’s commit scope.

---

## Wave 1 completion gate

- Contact is primary in hero and persistent in navigation.
- All app chrome and accessible names are Russian.
- External tabs are announced.
- Two skip-links work.
- Moving Nyancat elements are absent from keyboard order.
- Project/timeline controls use coherent native semantics.
- Skills has one stable SSR landmark and no JS-selected first paint.
- Project layouts do not create document-level overflow or fixed-height clipping.
- Full Vitest, lint, format check and production build pass.
