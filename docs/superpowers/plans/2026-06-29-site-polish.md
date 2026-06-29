# Полировка сайта kotikov — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: use superpowers:subagent-driven-development (рекомендуется) или superpowers:executing-plans для пошаговой реализации. Шаги отмечаются чекбоксами (`- [ ]`).

**Goal:** Ввести единый layout-контракт (`Section` / `SectionHeader`), мигрировать все виджеты, затем привести типографику и neobrutalist-правила к спецификации без смены характера сайта.

**Architecture:** Два примитива в `src/shared/ui` инкапсулируют вертикальные отступы (`py-24` / `py-16`), горизонтальный padding (`px-6 lg:px-8`) и `max-w-6xl mx-auto`. Виджеты заменяют сырые `<section>` на `Section` и дублирующие заголовки — на `SectionHeader`. Фаза 2 обновляет типо-классы, `ProjectCard`, `Button`, страницы ошибок и убирает ad-hoc цвета.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Vitest + Testing Library, Bun.

---

## Фаза 1 — Layout foundation

### Task 1: Примитив `Section` (TDD)

**Files:**
- Create: `src/shared/ui/Section/Section.tsx`
- Create: `src/shared/ui/Section/index.ts`
- Create: `tests/shared/section.test.tsx` (только describe `Section` на этом шаге)

- [ ] **Step 1: Написать падающие тесты для Section**

Создать `tests/shared/section.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Section } from "@/shared/ui";

describe("Section", () => {
  it("renders section with id and default spacing py-24", () => {
    const { container } = render(
      <Section id="about">
        <p>Content</p>
      </Section>
    );

    const section = container.querySelector("section#about");
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass("py-24");
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies compact spacing py-16", () => {
    const { container } = render(
      <Section id="skills" spacing="compact">
        <p>Skills</p>
      </Section>
    );

    expect(container.querySelector("section#skills")).toHaveClass("py-16");
  });

  it("applies container-x and container-max on inner wrapper", () => {
    const { container } = render(
      <Section id="projects">
        <p>Projects</p>
      </Section>
    );

    const inner = container.querySelector("section#projects > div");
    expect(inner).toHaveClass("px-6", "lg:px-8", "max-w-6xl", "mx-auto");
  });

  it("renders as footer when as=footer", () => {
    const { container } = render(
      <Section as="footer" backgroundClassName="bg-background-primary">
        <p>Footer</p>
      </Section>
    );

    expect(container.querySelector("footer")).toBeInTheDocument();
    expect(container.querySelector("section")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Запустить тесты — убедиться, что падают**

Run: `bun run test tests/shared/section.test.tsx`

Expected: FAIL — `Cannot find module '@/shared/ui'` или `Section is not exported` / component not defined.

- [ ] **Step 3: Реализовать Section**

Создать `src/shared/ui/Section/Section.tsx`:

```tsx
import React from "react";

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  /** default = py-24, compact = py-16; omit for footer (use className py-*) */
  spacing?: "default" | "compact";
  backgroundClassName?: string;
  className?: string;
  innerClassName?: string;
  as?: "section" | "footer";
  ref?: React.Ref<HTMLElement>;
}

const spacingClasses = {
  default: "py-24",
  compact: "py-16",
} as const;

const containerClasses = "px-6 lg:px-8 max-w-6xl mx-auto";

const Section: React.FC<SectionProps> = ({
  id,
  children,
  spacing = "default",
  backgroundClassName = "",
  className = "",
  innerClassName = "",
  as: Tag = "section",
  ref,
}) => {
  const rootClasses = [
    "relative transition-colors duration-300",
    spacing !== undefined ? spacingClasses[spacing] : "",
    backgroundClassName,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag ref={ref} id={id} className={rootClasses}>
      <div className={`${containerClasses} ${innerClassName}`.trim()}>{children}</div>
    </Tag>
  );
};

export default Section;
```

Создать `src/shared/ui/Section/index.ts`:

```ts
export { default as Section } from "./Section";
```

Временно добавить в `src/shared/ui/index.ts` (полный экспорт в Task 3):

```ts
export { Section } from "./Section";
```

- [ ] **Step 4: Запустить тесты — убедиться, что проходят**

Run: `bun run test tests/shared/section.test.tsx`

Expected: PASS — 4 tests passed.

- [ ] **Step 5: Commit**

```bash
git add -f tests/shared/section.test.tsx src/shared/ui/Section/Section.tsx src/shared/ui/Section/index.ts src/shared/ui/index.ts
git commit -m "feat(ui): add Section layout primitive with tests"
```

---

### Task 2: Примитив `SectionHeader` (TDD)

**Files:**
- Create: `src/shared/ui/SectionHeader/SectionHeader.tsx`
- Create: `src/shared/ui/SectionHeader/index.ts`
- Modify: `tests/shared/section.test.tsx` — добавить describe `SectionHeader`

- [ ] **Step 1: Написать падающие тесты для SectionHeader**

Добавить в `tests/shared/section.test.tsx`:

```tsx
import { Section, SectionHeader } from "@/shared/ui";

describe("SectionHeader", () => {
  it("renders eyebrow, title, optional description", () => {
    render(
      <SectionHeader
        eyebrow="Обо мне"
        title="Заголовок"
        description="Описание секции"
      />
    );

    expect(screen.getByText("Обо мне")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Заголовок" })).toBeInTheDocument();
    expect(screen.getByText("Описание секции")).toBeInTheDocument();
  });

  it("applies header-gap mb-12 lg:mb-16", () => {
    const { container } = render(
      <SectionHeader eyebrow="Проекты" title="Избранные работы" />
    );

    expect(container.querySelector("header")).toHaveClass("mb-12", "lg:mb-16");
  });

  it("centers content when align=center", () => {
    const { container } = render(
      <SectionHeader
        align="center"
        eyebrow="Контакты"
        title="Напишите мне"
        description="Описание"
      />
    );

    const header = container.querySelector("header");
    expect(header).toHaveClass("text-center");

    const description = screen.getByText("Описание");
    expect(description).toHaveClass("mx-auto", "max-w-xl");
  });

  it("renders ReactNode eyebrow for custom badges", () => {
    render(
      <SectionHeader
        eyebrow={<span data-testid="custom-eyebrow">Badge</span>}
        title="Контакты"
      />
    );

    expect(screen.getByTestId("custom-eyebrow")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Запустить тесты — убедиться, что падают**

Run: `bun run test tests/shared/section.test.tsx`

Expected: FAIL — `SectionHeader` is not exported / not defined (4 новых теста).

- [ ] **Step 3: Реализовать SectionHeader (Phase 1 — структура)**

Создать `src/shared/ui/SectionHeader/SectionHeader.tsx`:

```tsx
import React from "react";

interface SectionHeaderProps {
  eyebrow: React.ReactNode;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}) => {
  const alignClasses = align === "center" ? "text-center" : "text-left";
  const descriptionAlignClasses =
    align === "center" ? "mx-auto max-w-xl" : "max-w-2xl";

  return (
    <header className={`mb-12 lg:mb-16 ${alignClasses} ${className}`.trim()}>
      <p className="text-primary-950 dark:text-primary-300 mb-3 text-sm font-bold tracking-[0.24em] uppercase">
        {eyebrow}
      </p>
      <h2 className="text-text-primary dark:text-text-inverse text-4xl font-black tracking-tight uppercase sm:text-5xl">
        {title}
      </h2>
      {description !== undefined ? (
        <p
          className={`text-text-secondary mt-4 text-lg leading-8 font-medium dark:text-neutral-400 ${descriptionAlignClasses}`}
        >
          {description}
        </p>
      ) : null}
    </header>
  );
};

export default SectionHeader;
```

Создать `src/shared/ui/SectionHeader/index.ts`:

```ts
export { default as SectionHeader } from "./SectionHeader";
```

Временно в `src/shared/ui/index.ts`:

```ts
export { SectionHeader } from "./SectionHeader";
```

- [ ] **Step 4: Запустить тесты — убедиться, что проходят**

Run: `bun run test tests/shared/section.test.tsx`

Expected: PASS — 8 tests passed.

- [ ] **Step 5: Commit**

```bash
git add -f tests/shared/section.test.tsx src/shared/ui/SectionHeader/SectionHeader.tsx src/shared/ui/SectionHeader/index.ts src/shared/ui/index.ts
git commit -m "feat(ui): add SectionHeader primitive with tests"
```

---

### Task 3: Экспорты shared/ui

**Files:**
- Modify: `src/shared/ui/index.ts`

- [ ] **Step 1: Проверить текущие экспорты**

Run: `grep -n "Section" src/shared/ui/index.ts`

Expected: строки с `Section` и `SectionHeader` уже присутствуют после Task 1–2.

- [ ] **Step 2: Зафиксировать финальный блок экспортов**

Убедиться, что `src/shared/ui/index.ts` содержит:

```ts
export { Badge } from "./Badge";
export { default as BauhausGridPattern } from "./BauhausGridPattern";
export { Button } from "./Button";
export { Card } from "./Card";
export type { GridPaintOverlayRef } from "./GridPaintOverlay";
export { GridPaintOverlay } from "./GridPaintOverlay";
export { default as Logo } from "./Logo";
export { Section } from "./Section";
export { SectionHeader } from "./SectionHeader";

// Shared utilities for canvas painting & coverage
export { useCanvasLifecycle } from "./hooks/useCanvasLifecycle";
export { computeCoverage } from "./lib/computeCoverage";
export { sampleBrushStroke } from "./lib/sampleBrushPixels";
```

- [ ] **Step 3: Запустить полный test suite**

Run: `bun run test`

Expected: PASS — все существующие тесты + 8 section tests.

- [ ] **Step 4: Проверить импорт из виджета (smoke)**

Run: `bun run build`

Expected: build succeeds без ошибок unresolved imports.

- [ ] **Step 5: Commit (если index.ts менялся)**

```bash
git add src/shared/ui/index.ts
git commit -m "chore(ui): export Section and SectionHeader from shared barrel"
```

Пропустить commit, если файл уже закоммичен в Task 2 без изменений.

---

### Task 4: Миграция AboutView

**Files:**
- Modify: `src/widgets/about/ui/AboutView.tsx`

- [ ] **Step 1: Запустить baseline-тесты**

Run: `bun run test`

Expected: PASS (фиксируем baseline перед миграцией).

- [ ] **Step 2: Заменить разметку на Section + SectionHeader**

Полное содержимое `src/widgets/about/ui/AboutView.tsx`:

```tsx
import React from "react";

import { aboutContent } from "@/shared/config/content";
import { Section, SectionHeader } from "@/shared/ui";

const AboutView: React.FC = () => {
  return (
    <Section
      id="about"
      backgroundClassName="bg-background-primary dark:bg-background-tertiary"
    >
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <SectionHeader
            eyebrow="Обо мне"
            title={aboutContent.title}
            description={aboutContent.body}
          />
        </div>
        <ul className="grid content-start gap-4">
          {aboutContent.principles.map((principle) => (
            <li
              key={principle}
              className="text-text-primary dark:text-text-inverse border-2 border-black bg-white px-5 py-4 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
            >
              {principle}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
};

export default AboutView;
```

Примечание: `description` в `SectionHeader` заменяет отдельный body-параграф; классы description из Phase 1 достаточны до Task 12.

- [ ] **Step 3: Запустить тесты**

Run: `bun run test`

Expected: PASS.

- [ ] **Step 4: Визуальная проверка About**

Run: `bun run dev` — открыть `/#about`, проверить `py-24`, `max-w-6xl`, gap `gap-12 lg:gap-16`.

- [ ] **Step 5: Commit**

```bash
git add src/widgets/about/ui/AboutView.tsx
git commit -m "refactor(about): migrate to Section and SectionHeader"
```

---

### Task 5: Миграция ProjectsView + брейкпоинт md

**Files:**
- Modify: `src/widgets/projects/ui/ProjectsView.tsx`
- Test: `tests/widgets/projects.test.tsx` (обновить только при падении)

- [ ] **Step 1: Запустить projects-тест**

Run: `bun run test tests/widgets/projects.test.tsx`

Expected: PASS.

- [ ] **Step 2: Мигрировать ProjectsView**

Полное содержимое `src/widgets/projects/ui/ProjectsView.tsx`:

```tsx
import React from "react";

import { ProjectCard } from "@/entities/project";
import { projectsData } from "@/shared/config/content";
import { Section, SectionHeader } from "@/shared/ui";

import ProjectCardDeck from "./ProjectCardDeck";

const ProjectsView: React.FC = () => {
  return (
    <Section
      id="projects"
      backgroundClassName="bg-neutral-100 dark:bg-background-tertiary"
    >
      <SectionHeader
        eyebrow="Проекты"
        title="Избранные работы"
        description="Несколько проектов, которые показывают, как я думаю о продукте, интерфейсе и реализации."
      />

      <div className="md:hidden">
        <ProjectCardDeck />
      </div>

      <div className="hidden gap-5 md:grid md:grid-cols-2 md:gap-6 xl:grid-cols-3">
        {projectsData.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </Section>
  );
};

export default ProjectsView;
```

Ключевые изменения: `dark:bg-[#0a0a0a]` → `dark:bg-background-tertiary`; `max-w-7xl` убран (даёт `Section`); `sm:` → `md:` для deck/grid.

- [ ] **Step 3: Запустить projects-тест**

Run: `bun run test tests/widgets/projects.test.tsx`

Expected: PASS — heading «Избранные работы» и 4 ссылки «Код» на месте.

- [ ] **Step 4: Запустить полный test suite**

Run: `bun run test`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/widgets/projects/ui/ProjectsView.tsx
git commit -m "refactor(projects): Section layout and md deck/grid breakpoint"
```

---

### Task 6: Миграция SkillsDesktopView

**Files:**
- Modify: `src/widgets/skills/ui/SkillsDesktopView.tsx`

- [ ] **Step 1: Запустить тесты**

Run: `bun run test`

Expected: PASS.

- [ ] **Step 2: Обернуть в Section compact**

Полное содержимое `src/widgets/skills/ui/SkillsDesktopView.tsx`:

```tsx
"use client";

import React, { useRef } from "react";

import { BauhausGridPattern, Section } from "@/shared/ui";

import { SkillsInteractionProvider } from "../model/SkillsInteractionContext";
import { SkillsCursorNyancat, SkillsMarquee } from ".";

const SkillsDesktopView: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);

  return (
    <SkillsInteractionProvider>
      <Section
        ref={containerRef}
        id="skills"
        spacing="compact"
        backgroundClassName="bg-background-primary dark:bg-background-tertiary"
        className="overflow-x-clip"
        innerClassName="relative z-10 max-w-full"
      >
        <SkillsCursorNyancat containerRef={containerRef} />
        <BauhausGridPattern className="text-black dark:text-white" opacity={0.03} />
        <SkillsMarquee />
      </Section>
    </SkillsInteractionProvider>
  );
};

export default SkillsDesktopView;
```

- [ ] **Step 3: Запустить тесты**

Run: `bun run test`

Expected: PASS.

- [ ] **Step 4: Проверить Skills desktop в браузере**

Run: `bun run dev` — viewport ≥1024px, секция `#skills`: `py-16`, marquee без заголовка.

- [ ] **Step 5: Commit**

```bash
git add src/widgets/skills/ui/SkillsDesktopView.tsx
git commit -m "refactor(skills): migrate desktop view to Section compact"
```

---

### Task 7: Миграция SkillsMobileView (layout only)

**Files:**
- Modify: `src/widgets/skills/ui/SkillsMobileView.tsx`

- [ ] **Step 1: Запустить тесты**

Run: `bun run test`

Expected: PASS.

- [ ] **Step 2: Обернуть в Section compact (заголовок — Phase 2)**

Заменить внешний `<section id="skills" …>` на `Section`; убрать `py-12`, оставить внутренний заголовок без изменений:

```tsx
import { Section } from "@/shared/ui";

// ... остальные импорты без изменений

return (
  <Section
    id="skills"
    spacing="compact"
    backgroundClassName="bg-background-primary dark:bg-background-tertiary"
    className="overflow-x-hidden"
    innerClassName=""
  >
    {/* Заголовок — без изменений до Task 15 */}
    <div className="px-4 pb-8 text-center">
      {/* ... существующий h2 block ... */}
    </div>
    {/* ... остальной JSX без изменений ... */}
  </Section>
);
```

Удалить дублирующие `bg-background-primary`, `py-12`, `transition-colors` с бывшего `<section>`.

- [ ] **Step 3: Запустить тесты**

Run: `bun run test`

Expected: PASS.

- [ ] **Step 4: Проверить mobile Skills**

Viewport 375px: `py-16`, `px-6` от Section inner.

- [ ] **Step 5: Commit**

```bash
git add src/widgets/skills/ui/SkillsMobileView.tsx
git commit -m "refactor(skills): migrate mobile view to Section compact"
```

---

### Task 8: Миграция TimelineView

**Files:**
- Modify: `src/widgets/timeline/ui/TimelineView.tsx`

- [ ] **Step 1: Запустить тесты**

Run: `bun run test`

Expected: PASS.

- [ ] **Step 2: Мигрировать на Section**

Изменения:
1. Импорт `{ BauhausGridPattern, Section, SectionHeader } from "@/shared/ui"`.
2. `alignedContentBandClass` → `"mx-auto w-full max-w-5xl"` (убрать `px-4`).
3. Заменить корневой `<section id="experience" …>`:

```tsx
return (
  <Section
    id="experience"
    backgroundClassName="bg-background-primary dark:bg-background-tertiary"
    className="overflow-x-hidden"
    innerClassName="relative z-10"
  >
    <BauhausGridPattern className="text-black dark:text-white" opacity={0.03} />

    <div
      className={`${alignedContentBandClass} flex flex-col gap-8 md:grid md:grid-cols-[22rem_minmax(0,1fr)] md:items-stretch md:gap-6 lg:grid-cols-[26rem_minmax(0,1fr)] lg:gap-8`}
      aria-roledescription="carousel"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex w-full flex-col items-center gap-4 md:items-stretch">
        <div className="w-full max-w-[26rem] md:max-w-none">
          <SectionHeader
            eyebrow="Опыт"
            title="Мой путь"
            description="Образование, работа, хакатоны и личные проекты."
          />
        </div>
        {/* ... остальной carousel JSX без изменений ... */}
      </div>
      {/* ... panel column ... */}
    </div>
  </Section>
);
```

Удалить старые `<p>Опыт</p>`, `<h2>`, description `<p>` — их заменяет `SectionHeader`. H2-классы обновятся в Task 15.

- [ ] **Step 3: Запустить тесты**

Run: `bun run test`

Expected: PASS.

- [ ] **Step 4: Проверить Experience**

`/#experience`: `py-24`, carousel band `max-w-5xl`, без лишнего `px-4`.

- [ ] **Step 5: Commit**

```bash
git add src/widgets/timeline/ui/TimelineView.tsx
git commit -m "refactor(timeline): migrate Experience section to Section layout"
```

---

### Task 9: Миграция ContactsView

**Files:**
- Modify: `src/widgets/contacts/ui/ContactsView.tsx`

- [ ] **Step 1: Запустить тесты**

Run: `bun run test`

Expected: PASS.

- [ ] **Step 2: Мигрировать на Section + SectionHeader**

Заменить корневой `<section id="contacts" …>` на:

```tsx
<Section
  id="contacts"
  className="flex min-h-[70vh] items-center justify-center overflow-hidden md:min-h-[60vh]"
  innerClassName="relative z-10"
  style={{
    cursor: isDrawing ? "none" : undefined,
    touchAction: isDrawing ? "none" : "pan-y",
  }}
  onPointerEnter={onPointerEnter}
  onPointerMove={onPointerMove}
  onPointerLeave={onPointerLeave}
  onPointerDown={onPointerDown}
  onPointerUp={onPointerUp}
  onPointerCancel={onPointerCancel}
>
```

Для pointer handlers и `style` на корне: расширить `SectionProps` в `Section.tsx`:

```tsx
interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  // ... existing props; omit children/className/id conflicts handled explicitly
}
```

Либо передать handlers через spread на корневой `Tag` в `Section.tsx`:

```tsx
const Section: React.FC<SectionProps> = ({ id, children, spacing = "default", ...rest }) => {
  const { backgroundClassName = "", className = "", innerClassName = "", as: Tag = "section", ref, ...nativeProps } = rest;
  // apply nativeProps to <Tag>
};
```

Рефакторинг `Section` для `...HTMLAttributes<HTMLElement>` (без `children` duplicate). После расширения Section — Contacts inner content:

```tsx
<SectionHeader
  align="center"
  eyebrow={
    <InteractiveElement
      as="p"
      data-draw-allow
      data-interactive-mode="solid"
      data-interactive-bg={colors.primary[500]}
      data-interactive-text="black"
      data-interactive-threshold="0.12"
      className="text-text-primary dark:text-text-inverse inline-block border-2 border-black border-l-4 border-l-primary-500 bg-background-primary px-3 py-1 text-sm font-bold tracking-[0.24em] uppercase dark:border-white dark:border-l-primary-400 dark:bg-background-tertiary"
    >
      <InteractiveText text="Контакты" />
    </InteractiveElement>
  }
  title="Напишите мне"
  description="Открыт к интересным задачам и сотрудничеству. Лучший способ — почта или Telegram."
/>
```

Для `title` с `InteractiveText` — передать `title` как строку в SectionHeader, обернуть визуально:

```tsx
<h2 className="...">
  <InteractiveText text="Напишите мне" />
</h2>
```

Поскольку `SectionHeader` принимает `title: string`, добавить опциональный `titleSlot?: React.ReactNode` **или** обернуть title в Contacts вне SectionHeader. **Решение плана:** расширить `SectionHeader`:

```tsx
interface SectionHeaderProps {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  // ...
}
```

Обновить тест: `getByRole("heading", { name: "Заголовок" })` — оставить string title в тестах; для Contacts передать JSX title.

Удалить обёртки `container mx-auto px-4` и `max-w-6xl` — даёт `Section`. Сохранить `max-w-4xl` grid контактов.

Description в Contacts с `InteractiveElement` — передать как `description` ReactNode; обновить `SectionHeader` рендер `{description}` без оборачивания в `<p>` если node уже paragraph. **Решение:** `description?: React.ReactNode` и рендер:

```tsx
{description !== undefined && description !== null ? (
  <div className={`mt-4 text-lg ... ${descriptionAlignClasses}`}>{description}</div>
) : null}
```

Обновить тесты SectionHeader: string description остаётся в `<div>` или conditional `<p>` only for string — проще всегда `<div className="mt-4 ...">`.

Убрать `mb-10 text-center` wrapper — `SectionHeader align="center"` даёт `mb-12 lg:mb-16`.

Absolute children (`ContactCanvas`, gradient, `CatPaw`) — **вне** `Section`, как siblings в fragment:

```tsx
<>
  {enablePaint ? <ContactCanvas ref={canvasRef} /> : (
    <div className="pointer-events-none absolute inset-0 h-full w-full" style={{ background: CONTACTS_GRADIENT }} />
  )}
  {showPaw && isDrawing ? <CatPaw ... /> : null}
  <Section id="contacts" className="... relative" ...>
    ...
  </Section>
</>
```

Section root needs `relative` for absolute canvas behind. Wrap in fragment with relative parent or keep canvas inside Section before inner wrapper — spec: gradient absolute children. Структура:

```tsx
<Section id="contacts" className="relative flex min-h-[70vh] ... overflow-hidden md:min-h-[60vh]" innerClassName="relative z-10">
  {enablePaint ? <ContactCanvas /> : <div className="pointer-events-none absolute inset-0" style={...} />}
  {showPaw && ...}
  <SectionHeader ... />
  <div className="mx-auto grid max-w-4xl ...">...</div>
</Section>
```

Canvas absolute `inset-0` позиционируется относительно Section root (`relative`).

- [ ] **Step 3: Обновить SectionHeader types + tests**

В `SectionHeader.tsx`: `title: React.ReactNode`, `description?: React.ReactNode`, description wrapper `<div>`.

В `tests/shared/section.test.tsx` — тесты остаются со string props.

Run: `bun run test tests/shared/section.test.tsx`

Expected: PASS.

- [ ] **Step 4: Запустить полный test suite**

Run: `bun run test`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/shared/ui/Section/Section.tsx src/shared/ui/SectionHeader/SectionHeader.tsx src/widgets/contacts/ui/ContactsView.tsx tests/shared/section.test.tsx
git commit -m "refactor(contacts): Section layout with centered SectionHeader"
```

---

### Task 10: Миграция FooterWidget

**Files:**
- Modify: `src/widgets/footer/FooterWidget.tsx`

- [ ] **Step 1: Запустить тесты**

Run: `bun run test`

Expected: PASS.

- [ ] **Step 2: Мигрировать на Section as="footer"**

Полное содержимое `src/widgets/footer/FooterWidget.tsx`:

```tsx
import React from "react";

import { footerInfo, footerSocialLinks, navigation } from "@/shared/config/content";
import { Section } from "@/shared/ui";

import { FooterBottom, FooterInfo, FooterNavigation, FooterSocial } from "./ui";

const FooterWidget: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Section
      as="footer"
      spacing={undefined}
      backgroundClassName="bg-background-primary dark:bg-background-tertiary"
      className="border-t-4 border-black py-16 dark:border-white"
    >
      <div className="absolute top-0 left-0 h-1 w-full bg-linear-to-r from-transparent via-black/20 to-transparent dark:via-white/20" />

      <div className="grid gap-8 text-center md:grid-cols-3 md:text-left">
        <FooterInfo title={footerInfo.title} description={footerInfo.description} />
        <FooterNavigation title="Быстрые ссылки" links={navigation} />
        <FooterSocial title="Связаться со мной" socialLinks={footerSocialLinks} />
      </div>

      <FooterBottom year={currentYear} />
    </Section>
  );
};

export default FooterWidget;
```

Обновить `Section.tsx`: если `spacing` передан как `undefined` явно, не применять default — изменить сигнатуру:

```tsx
spacing?: "default" | "compact" | undefined;
// в компоненте:
const appliedSpacing = spacing === undefined && Tag === "footer" ? "" : spacingClasses[spacing ?? "default"];
```

Для footer: передать prop `spacing={undefined}` и в Section: `const spacingKey = spacing ?? (as === "footer" ? null : "default");` — при `null` не добавлять py-*.

Итоговая логика Section spacing:

```tsx
interface SectionProps {
  spacing?: "default" | "compact" | "none";
}
// footer: spacing="none"
```

Использовать `spacing="none"` для footer вместо undefined:

```tsx
<Section as="footer" spacing="none" className="border-t-4 border-black py-16 dark:border-white" ...>
```

В `Section.tsx` добавить `none: ""` в spacingClasses и default остаётся `"default"`.

- [ ] **Step 3: Запустить тесты**

Run: `bun run test`

Expected: PASS.

- [ ] **Step 4: Проверить Footer**

`py-16`, `px-6 lg:px-8`, `max-w-6xl`, border-top.

- [ ] **Step 5: Commit**

```bash
git add src/shared/ui/Section/Section.tsx src/widgets/footer/FooterWidget.tsx
git commit -m "refactor(footer): migrate to Section footer with py-16"
```

---

### Task 11: Верификация Фазы 1

**Files:** none (verification only)

- [ ] **Step 1: Полный test suite**

Run: `bun run test`

Expected: PASS — все тесты green.

- [ ] **Step 2: Lint**

Run: `bun run lint`

Expected: exit 0 или только pre-existing warnings.

- [ ] **Step 3: Production build**

Run: `bun run build`

Expected: build completed successfully.

- [ ] **Step 4: Ручной чеклист §5.2 (layout)**

Проверить 375px / 768px / 1280px × light/dark для About, Projects, Skills, Experience, Contacts, Footer:
- vertical padding `py-24` (Skills `py-16`)
- content `max-w-6xl`, horizontal `px-6` / `lg:px-8`
- header gap `mb-12` / `lg:mb-16`
- Projects deck <768px, grid ≥768px

- [ ] **Step 5: Commit checkpoint (опционально)**

Если были fixups:

```bash
git add -A
git commit -m "chore: phase 1 layout foundation verification fixes"
```

---

## Фаза 2 — Typography & brutalist polish

### Task 12: Типографика SectionHeader (§3.1)

**Files:**
- Modify: `src/shared/ui/SectionHeader/SectionHeader.tsx`
- Modify: `tests/shared/section.test.tsx`

- [ ] **Step 1: Добавить тест на H2-классы**

В `describe("SectionHeader")` добавить:

```tsx
it("applies H2 typography scale from design spec", () => {
  render(<SectionHeader eyebrow="Test" title="Title" />);
  const h2 = screen.getByRole("heading", { level: 2 });
  expect(h2).toHaveClass("text-4xl", "sm:text-5xl", "font-black", "tracking-tight", "uppercase");
});
```

- [ ] **Step 2: Запустить — убедиться PASS (уже есть в Phase 1)**

Run: `bun run test tests/shared/section.test.tsx`

Expected: PASS (тест документирует контракт).

- [ ] **Step 3: Обновить классы eyebrow и description по §3.1**

В `SectionHeader.tsx`:

```tsx
<p className="text-sm font-bold tracking-[0.24em] uppercase text-primary-950 dark:text-primary-300 mb-3">
  {eyebrow}
</p>
<h2 className="text-4xl sm:text-5xl font-black tracking-tight uppercase text-text-primary dark:text-text-inverse">
  {title}
</h2>
{description !== undefined && description !== null ? (
  <div
    className={`mt-4 max-w-2xl text-lg leading-8 font-medium text-text-secondary dark:text-neutral-400 ${descriptionAlignClasses}`}
  >
    {description}
  </div>
) : null}
```

Для Contacts title/description с белым текстом на градиенте — в `ContactsView` передать `className` на SectionHeader:

```tsx
<SectionHeader
  align="center"
  className="[&_h2]:text-white [&_h2]:drop-shadow-sm [&_.description]:text-neutral-100/90"
  ...
/>
```

Добавить `description` wrapper class `description` или использовать `headerClassName` / data-attribute. **Проще:** prop `tone?: "default" | "on-gradient"`:

```tsx
const titleClasses =
  tone === "on-gradient"
    ? "text-4xl sm:text-5xl font-black tracking-tight uppercase text-white drop-shadow-sm"
    : "text-4xl sm:text-5xl font-black tracking-tight uppercase text-text-primary dark:text-text-inverse";
```

Contacts: `tone="on-gradient"`.

- [ ] **Step 4: Запустить тесты**

Run: `bun run test`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/shared/ui/SectionHeader/SectionHeader.tsx src/widgets/contacts/ui/ContactsView.tsx tests/shared/section.test.tsx
git commit -m "feat(ui): apply SectionHeader typography scale from spec"
```

---

### Task 13: ProjectCard brutalist pills

**Files:**
- Modify: `src/entities/project/ui/ProjectCard.tsx`

- [ ] **Step 1: Запустить projects test (baseline)**

Run: `bun run test tests/widgets/projects.test.tsx`

Expected: PASS.

- [ ] **Step 2: Обновить pills и icon container**

В `ProjectCard.tsx`:

Icon container (строка ~27–32):

```tsx
<div
  className="flex size-11 shrink-0 items-center justify-center rounded-none border-2 border-black text-neutral-950 dark:border-white"
  style={{ backgroundColor: project.accentColor }}
>
```

GitHub pill (~53–60):

```tsx
<a
  href={project.repoUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-1.5 rounded-none border-2 border-black bg-neutral-100 px-3 py-1.5 text-xs font-bold text-neutral-900 uppercase transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 dark:border-white dark:bg-black dark:text-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
>
```

Live pill (~62–70):

```tsx
<a
  href={project.liveUrl}
  ...
  className="inline-flex items-center gap-1.5 rounded-none border-2 border-black px-3 py-1.5 text-xs font-bold text-neutral-950 uppercase transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 dark:border-white"
  style={{ backgroundColor: project.accentColor }}
>
```

Muted text (~33): `dark:text-neutral-500` → `dark:text-neutral-400`.

- [ ] **Step 3: Запустить projects test**

Run: `bun run test tests/widgets/projects.test.tsx`

Expected: PASS.

- [ ] **Step 4: Полный test suite**

Run: `bun run test`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/entities/project/ui/ProjectCard.tsx
git commit -m "style(project-card): brutalist pills and rounded-none icon"
```

---

### Task 14: Дифференциация Button primary/secondary

**Files:**
- Modify: `src/shared/ui/Button/Button.tsx`

- [ ] **Step 1: Запустить тесты**

Run: `bun run test`

Expected: PASS.

- [ ] **Step 2: Обновить variantClasses**

В `Button.tsx` заменить `variantClasses`:

```tsx
const variantClasses = {
  primary:
    "bg-primary-500 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
  secondary:
    "bg-white text-black dark:bg-black dark:text-white shadow-[4px_4px_0px_0px_var(--accent-shadow)] dark:shadow-[4px_4px_0px_0px_var(--accent-shadow)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--accent-shadow)] dark:hover:shadow-[2px_2px_0px_0px_var(--accent-shadow)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
  outline:
    "bg-transparent text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black shadow-none hover:shadow-none",
};
```

- [ ] **Step 3: Проверить hero CTA**

Run: `bun run dev` — hero кнопки с `shadowColor={colors.primary[500]}` на secondary должны сохранить mint-тень через CSS variable.

- [ ] **Step 4: Полный test suite**

Run: `bun run test`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/shared/ui/Button/Button.tsx
git commit -m "style(button): differentiate primary and secondary variants"
```

---

### Task 15: H2 шкала Timeline + SectionHeader Skills mobile

**Files:**
- Modify: `src/widgets/timeline/ui/TimelineView.tsx` (если остались кастомные H2 — убрать)
- Modify: `src/widgets/skills/ui/SkillsMobileView.tsx`

- [ ] **Step 1: Запустить тесты**

Run: `bun run test`

Expected: PASS.

- [ ] **Step 2: SkillsMobileView — SectionHeader**

Заменить блок заголовка (`px-4 pb-8 text-center` + h2) на:

```tsx
<SectionHeader
  align="center"
  eyebrow="Навыки"
  title="Мои навыки"
  description="Технологии и инструменты, которыми я владею"
/>
<p className="mx-auto -mt-8 mb-8 max-w-sm text-center text-base font-semibold text-text-secondary dark:text-neutral-300">
  React, JavaScript, Node.js, фреймворк Next.js
</p>
```

Удалить `id="skills-heading"` с h2 — перенести на SectionHeader h2: добавить `titleId?: string` prop в SectionHeader для `id` на h2 (`titleId="skills-heading"`).

В `SectionHeader.tsx`:

```tsx
interface SectionHeaderProps {
  titleId?: string;
  // ...
}
<h2 id={titleId} className="...">
```

SkillsMobileView: `titleId="skills-heading"`, Section сохраняет `aria-labelledby="skills-heading"`.

- [ ] **Step 3: Timeline — убедиться H2 только через SectionHeader**

Проверить отсутствие `text-3xl md:text-4xl` в TimelineView.

- [ ] **Step 4: Запустить тесты**

Run: `bun run test`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/shared/ui/SectionHeader/SectionHeader.tsx src/widgets/skills/ui/SkillsMobileView.tsx src/widgets/timeline/ui/TimelineView.tsx
git commit -m "refactor(sections): unify H2 scale in Skills mobile and Timeline"
```

---

### Task 16: Токенизация not-found.tsx

**Files:**
- Modify: `app/not-found.tsx`

- [ ] **Step 1: Запустить тесты**

Run: `bun run test`

Expected: PASS.

- [ ] **Step 2: Заменить gray-* и inline color на токены**

Изменения в `app/not-found.tsx`:

```tsx
// Удалить import { colors } from "@/styles/colors"; если больше не нужен

// 404 block:
<div className="mb-8 text-8xl font-bold text-primary-600 md:text-9xl dark:text-primary-400">
  404
</div>

// h1:
<h1 className="mb-4 text-3xl font-bold text-text-primary md:text-4xl dark:text-text-inverse">
  Страница не найдена
</h1>

// description:
<p className="mb-8 text-lg leading-relaxed text-text-secondary md:text-xl dark:text-neutral-300">

// border section:
<div className="mt-12 border-t border-border-primary pt-8 dark:border-border-secondary">

// muted text:
<p className="mb-4 text-sm text-text-muted dark:text-neutral-400">
```

Если `border-border-primary` не существует в Tailwind config — использовать `border-black/20 dark:border-white/20` как семантический эквивалент.

- [ ] **Step 3: Grep — нет gray-* в not-found**

Run: `rg "gray-" app/not-found.tsx`

Expected: no matches.

- [ ] **Step 4: Полный test suite + build**

Run: `bun run test && bun run build`

Expected: PASS / build success.

- [ ] **Step 5: Commit**

```bash
git add app/not-found.tsx
git commit -m "style(not-found): replace gray utilities with design tokens"
```

---

### Task 17: Токенизация error.tsx

**Files:**
- Modify: `app/error.tsx`

- [ ] **Step 1: Запустить тесты**

Run: `bun run test`

Expected: PASS.

- [ ] **Step 2: Убрать inline styles**

Полное содержимое `app/error.tsx`:

```tsx
"use client";

import { useEffect } from "react";

import { Button, Card } from "@/shared/ui";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps): React.JSX.Element {
  useEffect(() => {
    console.error("App Router Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-primary">
      <Card variant="bgNone" padding="lg" className="mx-auto max-w-md text-center">
        <div className="mb-6 text-6xl">🚨</div>
        <h2 className="text-text-primary mb-4 text-2xl font-bold">Произошла ошибка</h2>
        <p className="text-text-secondary mb-6">
          Что-то пошло не так при загрузке страницы. Попробуйте еще раз.
        </p>
        <div className="space-y-4">
          <Button onClick={reset} variant="primary">
            Попробовать снова
          </Button>
          <Button
            onClick={() => {
              window.location.href = "/";
            }}
            variant="secondary"
          >
            На главную
          </Button>
          {process.env.NODE_ENV === "development" && (
            <details className="mt-4">
              <summary className="text-text-muted cursor-pointer text-sm hover:opacity-80">
                Подробности ошибки (dev)
              </summary>
              <pre className="bg-background-secondary text-text-tertiary mt-2 overflow-auto rounded-none border-2 border-black p-4 text-left text-xs dark:border-white">
                {error.message}
                {"\n"}
                {error.stack}
              </pre>
            </details>
          )}
        </div>
      </Card>
    </div>
  );
}
```

- [ ] **Step 3: Grep — нет style={{ в error.tsx**

Run: `rg "style=\{\{" app/error.tsx`

Expected: no matches.

- [ ] **Step 4: Build**

Run: `bun run build`

Expected: success.

- [ ] **Step 5: Commit**

```bash
git add app/error.tsx
git commit -m "style(error): tokenize colors and use Card padding lg"
```

---

### Task 18: global-error.tsx — комментарий-ссылка на colors.ts

**Files:**
- Modify: `app/global-error.tsx`

- [ ] **Step 1: Прочитать colors.ts для hex-значений**

Run: `rg "500:|900:|primary" src/shared/styles/colors.ts | head -20`

Expected: `primary.500` = `#00ffb9`, `neutral.900` = `#111111`, etc.

- [ ] **Step 2: Добавить комментарий и синхронизировать hex**

В `app/global-error.tsx` над `criticalColors`:

```tsx
// Inline colors only — Next.js global-error cannot import app modules.
// Values mirror src/shared/styles/colors.ts:
// primary.500 = #00ffb9, primary.600 = #00d99d, neutral.900 = #111111
const criticalColors = {
  background: "#000000",
  text: {
    primary: "#ffffff",
    secondary: "#e5e5e5",
    muted: "#737373",
  },
  error: "#dc2626",
  errorLight: "#fee2e2",
  button: {
    bg: "#00ffb9", // colors.primary[500]
    hover: "#00d99d", // colors.primary[600]
    text: "#111111", // colors.neutral[900]
  },
};
```

- [ ] **Step 3: Запустить тесты**

Run: `bun run test`

Expected: PASS.

- [ ] **Step 4: Build**

Run: `bun run build`

Expected: success.

- [ ] **Step 5: Commit**

```bash
git add app/global-error.tsx
git commit -m "docs(global-error): align criticalColors comment with colors.ts"
```

---

### Task 19: Аудит тёмной темы (grep fixes)

**Files:**
- Modify: затронутые файлы из §1.3 и §3.5 по результатам grep

- [ ] **Step 1: Grep ad-hoc цветов**

Run:

```bash
rg "gray-|dark:bg-\[#|style=\{\{" src/widgets src/entities/project app/not-found.tsx app/error.tsx src/shared/ui/Section src/shared/ui/SectionHeader
```

Expected: список оставшихся вхождений (целевой результат — пусто или только допустимые `neutral-*` в body text).

- [ ] **Step 2: Исправить найденные вхождения**

По таблице §3.5:
- `ProjectsView` — уже `dark:bg-background-tertiary` (Task 5)
- `not-found` / `error` — Tasks 16–17
- `ProjectCard` muted — Task 13
- Прочие `neutral-*` без семантики → `text-text-secondary` / `text-text-muted`

- [ ] **Step 3: Повторный grep**

Run тот же `rg` из Step 1.

Expected: no matches для `gray-`, `#[0-9a-f]{6}` в className (кроме rgba в shadow).

- [ ] **Step 4: Полный test suite**

Run: `bun run test`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "style: dark mode token audit for polished sections"
```

---

### Task 20: Финальная верификация

**Files:** none

- [ ] **Step 1: Полный test suite**

Run: `bun run test`

Expected: PASS — включая 8+ тестов `tests/shared/section.test.tsx`.

- [ ] **Step 2: Lint + format check**

Run: `bun run lint && bun run format:check`

Expected: exit 0.

- [ ] **Step 3: Production build**

Run: `bun run build`

Expected: success.

- [ ] **Step 4: Ручной чеклист §5.2 + критерии §6**

Пройти все 7 пунктов чеклиста на 3 брейкпоинта × 2 темы. Подтвердить:
- primary ≠ secondary кнопки
- ProjectCard `rounded-none` pills
- нет `max-w-7xl` на секциях
- H2 единого размера (кроме hero)

Run: `rg "max-w-7xl" src/widgets`

Expected: no matches.

- [ ] **Step 5: Commit checkpoint**

```bash
git add -f docs/superpowers/plans/2026-06-29-site-polish.md
git commit -m "chore: site polish phase 2 complete"
```

Только если остались незакоммиченные fixups; иначе пропустить.

---

## Self-Review

### 1. Spec coverage

| Требование спеки | Task |
|------------------|------|
| Section primitive §2.3 | Task 1 |
| SectionHeader §2.4 | Task 2, 12, 15 |
| Exports §2.3 | Task 3 |
| About migration §2.5 | Task 4 |
| Projects + md breakpoint §2.2, §2.5 | Task 5 |
| Skills desktop/mobile §2.5 | Task 6, 7, 15 |
| Timeline/Experience §2.5 | Task 8, 15 |
| Contacts §2.5 | Task 9, 12 |
| Footer §2.5 | Task 10 |
| Typography §3.1 | Task 12, 15 |
| ProjectCard §3.3.1 | Task 13 |
| Button §3.3.2 | Task 14 |
| Card padding error pages §3.3.3 | Task 17 |
| not-found §3.3.4 | Task 16 |
| error §3.3.4 | Task 17 |
| global-error §3.3.4 | Task 18 |
| Dark audit §3.5 | Task 19 |
| Vitest §5.1 | Task 1, 2 |
| Manual checklist §5.2 | Task 11, 20 |
| Acceptance §6 | Task 20 |

Пробелов нет. Hero/Header вне скоупа — не включены.

### 2. Placeholder scan

План не содержит TBD/TODO. Все шаги с кодом имеют полные блоки или явные файлы. Task 9 включает расширение Section/SectionHeader — конкретные сигнатуры указаны.

### 3. Type consistency

- `Section.spacing`: `"default" | "compact" | "none"` — footer использует `"none"`.
- `SectionHeader.eyebrow/title/description`: `React.ReactNode` после Task 9.
- `SectionHeader.titleId` добавлен в Task 15 для a11y Skills.
- `Section.ref` для SkillsDesktopView nyancat container.

---

## Execution Handoff

**План сохранён в `docs/superpowers/plans/2026-06-29-site-polish.md`. Два варианта исполнения:**

**1. Subagent-Driven (рекомендуется)** — отдельный субагент на каждый Task, ревью между задачами.

**2. Inline Execution** — выполнение в текущей сессии через superpowers:executing-plans с чекпоинтами после Task 11 и Task 20.

**Какой подход выбираем?**
