# Project Card Bauhaus Expansion — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add expandable Bauhaus grid descriptions (challenge → solution → outcome + stack) to all 3 project cards, with desktop accordion grid and mobile overlay sheet.

**Architecture:** Extend `ProjectContent` with `details`. Build presentational `ProjectCardDetailGrid`, wrap cards in client `ProjectCardExpandable` (desktop inline expand + mobile `ProjectDetailSheet`), and manage desktop accordion state in `ProjectsGrid`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Vitest + Testing Library, existing `usePerformanceSettings` hook.

**Spec:** `docs/superpowers/specs/2026-07-03-project-card-expansion-design.md`

---

## File Map

| File                                                | Responsibility                                       |
| --------------------------------------------------- | ---------------------------------------------------- |
| `src/shared/config/content/projects.ts`             | `ProjectDetail` type + `details` copy for 3 projects |
| `src/entities/project/ui/ProjectCardDetailGrid.tsx` | 4 Bauhaus cells (presentational, server-safe)        |
| `src/entities/project/ui/ProjectCard.tsx`           | Add «Подробнее»/«Свернуть» button via props          |
| `src/entities/project/ui/ProjectDetailSheet.tsx`    | Mobile overlay + bottom sheet (client)               |
| `src/entities/project/ui/ProjectCardExpandable.tsx` | Orchestrates card + grid + sheet (client)            |
| `src/widgets/projects/ui/ProjectsGrid.tsx`          | Desktop grid + `expandedSlug` accordion (client)     |
| `src/widgets/projects/ui/ProjectsView.tsx`          | Wire `ProjectsGrid` + deck                           |
| `src/widgets/projects/ui/ProjectCardDeck.tsx`       | Use `ProjectCardExpandable` instead of `ProjectCard` |
| `src/entities/project/ui/index.ts`                  | Export new components                                |
| `src/entities/project/index.ts`                     | Re-export if needed                                  |

---

### Task 1: Extend project data model

**Files:**

- Modify: `src/shared/config/content/projects.ts`
- Test: `tests/shared/content.test.ts`

- [ ] **Step 1: Write the failing test**

Add inside the existing `"content model"` describe block in `tests/shared/content.test.ts`:

```typescript
it("includes project details for storytelling expand panels", () => {
  for (const project of projectsData) {
    expect(project.details.challenge.length).toBeGreaterThan(10);
    expect(project.details.solution.length).toBeGreaterThan(10);
    expect(project.details.outcome.length).toBeGreaterThan(10);
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test tests/shared/content.test.ts`
Expected: FAIL — `project.details` is undefined

- [ ] **Step 3: Add type and content**

In `src/shared/config/content/projects.ts`, add before `ProjectContent`:

```typescript
export interface ProjectDetail {
  challenge: string;
  solution: string;
  outcome: string;
}
```

Add `details: ProjectDetail` to `ProjectContent` interface.

Add `details` to each project:

```typescript
// file-manager-tauri
details: {
  challenge: "Навигация по тысячам файлов без лагов UI",
  solution: "Виртуализированные списки и кастомные контролы",
  outcome: "Unit + Integration + E2E покрытие, open source",
},

// web-messenger
details: {
  challenge: "Мгновенный обмен сообщениями между пользователями",
  solution: "Socket.IO для realtime, JWT auth, MongoDB для истории",
  outcome: "Full-stack продукт с авторизацией и историей чатов",
},

// tiktok-analyzer
details: {
  challenge: "Быстрая интерпретация активности TikTok-аккаунтов",
  solution: "Структурированные data views для чатов",
  outcome: "Инструмент для анализа и визуализации чат-активности",
},
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test tests/shared/content.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/shared/config/content/projects.ts tests/shared/content.test.ts
git commit -m "feat(projects): add details field for expandable card content"
```

---

### Task 2: ProjectCardDetailGrid component

**Files:**

- Create: `src/entities/project/ui/ProjectCardDetailGrid.tsx`
- Modify: `src/entities/project/ui/index.ts`
- Test: `tests/entities/project/ProjectCardDetailGrid.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `tests/entities/project/ProjectCardDetailGrid.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { projectsData } from "@/shared/config/content";
import { ProjectCardDetailGrid } from "@/entities/project/ui/ProjectCardDetailGrid";

describe("ProjectCardDetailGrid", () => {
  const project = projectsData[0];

  it("renders four storytelling cells and stack tags", () => {
    render(
      <ProjectCardDetailGrid
        project={project}
        id="project-details-file-manager-tauri"
        isVisible
        reducedMotion
      />
    );

    expect(screen.getByRole("region", { name: /подробности проекта/i })).toBeInTheDocument();
    expect(screen.getByText("Задача")).toBeInTheDocument();
    expect(screen.getByText(project.details.challenge)).toBeInTheDocument();
    expect(screen.getByText("Решение")).toBeInTheDocument();
    expect(screen.getByText(project.details.solution)).toBeInTheDocument();
    expect(screen.getByText("Результат")).toBeInTheDocument();
    expect(screen.getByText(project.details.outcome)).toBeInTheDocument();
    expect(screen.getByText("Стек")).toBeInTheDocument();
    expect(screen.getByText("Tauri")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test tests/entities/project/ProjectCardDetailGrid.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: Implement ProjectCardDetailGrid**

Create `src/entities/project/ui/ProjectCardDetailGrid.tsx`:

```tsx
import React from "react";

import type { ProjectItem } from "../model/types";

interface ProjectCardDetailGridProps {
  project: ProjectItem;
  id: string;
  isVisible: boolean;
  reducedMotion?: boolean;
}

const motionCellClass = (index: number, isVisible: boolean, reducedMotion: boolean): string => {
  if (reducedMotion) return "opacity-100 translate-y-0";
  if (!isVisible) return "opacity-0 -translate-y-1";
  const delays = ["delay-0", "delay-75", "delay-150", "delay-200"];
  return `opacity-100 translate-y-0 transition-[opacity,transform] duration-300 ease-out ${delays[index] ?? ""}`;
};

const ProjectCardDetailGrid: React.FC<ProjectCardDetailGridProps> = ({
  project,
  id,
  isVisible,
  reducedMotion = false,
}) => {
  const transitionClass = reducedMotion
    ? ""
    : "transition-[opacity,transform] duration-300 ease-out";

  return (
    <section
      id={id}
      aria-label="Подробности проекта"
      aria-hidden={!isVisible}
      className={`relative border-t-2 border-black dark:border-white ${transitionClass} ${
        isVisible ? "max-h-[32rem] opacity-100" : "max-h-0 overflow-hidden opacity-0"
      }`}
    >
      <div
        aria-hidden="true"
        className={`absolute right-3 top-3 size-12 rounded-full border-2 border-black dark:border-white ${
          reducedMotion ? "scale-100 opacity-60" : "duration-400 transition-transform ease-out"
        } ${isVisible ? "scale-100 opacity-60" : "scale-0 opacity-0"}`}
        style={{ backgroundColor: project.accentColor }}
      />

      <dl className="relative z-10">
        <div
          className={`border-b-2 border-black px-4 py-3 dark:border-white ${motionCellClass(0, isVisible, reducedMotion)}`}
          style={{ backgroundColor: project.accentColor }}
        >
          <dt className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-950">Задача</dt>
          <dd className="mt-1 text-sm font-medium leading-relaxed text-neutral-950">
            {project.details.challenge}
          </dd>
        </div>

        <div
          className={`border-b-2 border-black bg-white px-4 py-3 dark:border-white dark:bg-neutral-900 ${motionCellClass(1, isVisible, reducedMotion)}`}
        >
          <dt className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-700 dark:text-neutral-300">
            Решение
          </dt>
          <dd className="mt-1 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
            {project.details.solution}
          </dd>
        </div>

        <div
          className={`border-b-2 border-black bg-black px-4 py-3 dark:border-white dark:bg-white ${motionCellClass(2, isVisible, reducedMotion)}`}
        >
          <dt className="text-xs font-bold uppercase tracking-[0.12em] text-white dark:text-black">
            Результат
          </dt>
          <dd className="mt-1 text-sm leading-relaxed text-white dark:text-black">
            {project.details.outcome}
          </dd>
        </div>

        <div
          className={`bg-neutral-100 px-4 py-3 dark:bg-neutral-800 ${motionCellClass(3, isVisible, reducedMotion)}`}
        >
          <dt className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-700 dark:text-neutral-300">
            Стек
          </dt>
          <dd className="mt-2 flex flex-wrap gap-1.5">
            {project.stack.map((item) => (
              <span
                key={item}
                className="rounded-none border-2 border-black bg-white px-2 py-0.5 text-xs font-bold uppercase text-neutral-900 dark:border-white dark:bg-neutral-900 dark:text-white"
              >
                {item}
              </span>
            ))}
          </dd>
        </div>
      </dl>
    </section>
  );
};

export default ProjectCardDetailGrid;
export { ProjectCardDetailGrid };
```

Update `src/entities/project/ui/index.ts`:

```typescript
export { default as ProjectCard } from "./ProjectCard";
export { ProjectCardDetailGrid } from "./ProjectCardDetailGrid";
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test tests/entities/project/ProjectCardDetailGrid.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/entities/project/ui/ProjectCardDetailGrid.tsx src/entities/project/ui/index.ts tests/entities/project/ProjectCardDetailGrid.test.tsx
git commit -m "feat(projects): add Bauhaus detail grid component"
```

---

### Task 3: Add expand toggle to ProjectCard

**Files:**

- Modify: `src/entities/project/ui/ProjectCard.tsx`
- Test: `tests/entities/project/ProjectCard.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `tests/entities/project/ProjectCard.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ProjectCard } from "@/entities/project";
import { projectsData } from "@/shared/config/content";

describe("ProjectCard", () => {
  it("renders details toggle with aria attributes", async () => {
    const user = userEvent.setup();
    const onToggleDetails = vi.fn();

    render(
      <ProjectCard
        project={projectsData[0]}
        detailsToggle={{
          isExpanded: false,
          controlsId: "details-panel-test",
          onToggle: onToggleDetails,
        }}
      />
    );

    const toggle = screen.getByRole("button", { name: /подробнее/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveAttribute("aria-controls", "details-panel-test");

    await user.click(toggle);
    expect(onToggleDetails).toHaveBeenCalledOnce();
  });

  it("shows collapse label when expanded", () => {
    render(
      <ProjectCard
        project={projectsData[0]}
        detailsToggle={{
          isExpanded: true,
          controlsId: "details-panel-test",
          onToggle: vi.fn(),
        }}
      />
    );

    expect(screen.getByRole("button", { name: /свернуть/i })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });
});
```

Note: if `@testing-library/user-event` is missing, install: `bun add -d @testing-library/user-event`

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test tests/entities/project/ProjectCard.test.tsx`
Expected: FAIL — `detailsToggle` prop does not exist

- [ ] **Step 3: Update ProjectCard**

Add to `ProjectCard.tsx`:

```typescript
interface ProjectCardDetailsToggle {
  isExpanded: boolean;
  controlsId: string;
  onToggle: () => void;
}

interface ProjectCardProps {
  project: ProjectItem;
  isStacked?: boolean;
  detailsToggle?: ProjectCardDetailsToggle;
  disableHover?: boolean;
}
```

Update shadow/hover: when `disableHover` is true, skip hover translate classes.

In footer actions div, before GitHub link:

```tsx
{
  detailsToggle ? (
    <button
      type="button"
      onClick={detailsToggle.onToggle}
      aria-expanded={detailsToggle.isExpanded}
      aria-controls={detailsToggle.controlsId}
      className="inline-flex min-h-11 cursor-pointer items-center rounded-none border-2 border-black px-3 py-1.5 text-xs font-bold uppercase text-neutral-950 transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 dark:border-white dark:text-white"
      style={detailsToggle.isExpanded ? undefined : { backgroundColor: project.accentColor }}
    >
      {detailsToggle.isExpanded ? "Свернуть" : "Подробнее"}
    </button>
  ) : null;
}
```

Place toggle inside the flex gap with GitHub link; order: «Подробнее» then «Код».

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test tests/entities/project/ProjectCard.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/entities/project/ui/ProjectCard.tsx tests/entities/project/ProjectCard.test.tsx
git commit -m "feat(projects): add expandable details toggle to project card"
```

---

### Task 4: ProjectDetailSheet (mobile overlay)

**Files:**

- Create: `src/entities/project/ui/ProjectDetailSheet.tsx`
- Modify: `src/entities/project/ui/index.ts`
- Test: `tests/entities/project/ProjectDetailSheet.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `tests/entities/project/ProjectDetailSheet.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { projectsData } from "@/shared/config/content";
import { ProjectDetailSheet } from "@/entities/project/ui/ProjectDetailSheet";

describe("ProjectDetailSheet", () => {
  it("calls onClose when escape is pressed", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const project = projectsData[1];

    render(<ProjectDetailSheet project={project} isOpen onClose={onClose} reducedMotion />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when overlay is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<ProjectDetailSheet project={projectsData[1]} isOpen onClose={onClose} reducedMotion />);

    await user.click(screen.getByTestId("project-detail-overlay"));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test tests/entities/project/ProjectDetailSheet.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: Implement ProjectDetailSheet**

Create `src/entities/project/ui/ProjectDetailSheet.tsx`:

```tsx
"use client";

import React, { useEffect, useId, useRef } from "react";
import { FiX } from "react-icons/fi";
import { createPortal } from "react-dom";

import type { ProjectItem } from "../model/types";
import ProjectCardDetailGrid from "./ProjectCardDetailGrid";

interface ProjectDetailSheetProps {
  project: ProjectItem;
  isOpen: boolean;
  onClose: () => void;
  reducedMotion?: boolean;
}

const ProjectDetailSheet: React.FC<ProjectDetailSheetProps> = ({
  project,
  isOpen,
  onClose,
  reducedMotion = false,
}) => {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const detailsId = `project-sheet-details-${project.slug}`;

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  const overlayMotion = reducedMotion ? "" : "transition-opacity duration-350 ease-out";
  const sheetMotion = reducedMotion
    ? "translate-y-0"
    : "transition-transform duration-400 ease-out translate-y-0";

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-end bg-black/85 ${overlayMotion}`}
      data-testid="project-detail-overlay"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`max-h-[90vh] w-full overflow-y-auto rounded-none border-2 border-black bg-white shadow-[4px_4px_0px_0px_#00ffb9] dark:border-white dark:bg-neutral-900 ${sheetMotion}`}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div className="flex items-center justify-between border-b-2 border-black bg-black px-4 py-3 dark:border-white">
          <h2 id={titleId} className="text-sm font-bold uppercase tracking-[0.08em] text-white">
            {project.title}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Закрыть подробности проекта"
            onClick={onClose}
            className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-none border-2 border-white text-white transition-colors duration-200 hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          >
            <FiX className="size-5" aria-hidden="true" />
          </button>
        </div>

        <ProjectCardDetailGrid
          project={project}
          id={detailsId}
          isVisible
          reducedMotion={reducedMotion}
        />
      </div>
    </div>,
    document.body
  );
};

export default ProjectDetailSheet;
export { ProjectDetailSheet };
```

Update `src/entities/project/ui/index.ts` to export `ProjectDetailSheet`.

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test tests/entities/project/ProjectDetailSheet.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/entities/project/ui/ProjectDetailSheet.tsx src/entities/project/ui/index.ts tests/entities/project/ProjectDetailSheet.test.tsx
git commit -m "feat(projects): add mobile detail sheet overlay"
```

---

### Task 5: ProjectCardExpandable wrapper

**Files:**

- Create: `src/entities/project/ui/ProjectCardExpandable.tsx`
- Test: `tests/entities/project/ProjectCardExpandable.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `tests/entities/project/ProjectCardExpandable.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { projectsData } from "@/shared/config/content";
import { ProjectCardExpandable } from "@/entities/project/ui/ProjectCardExpandable";

vi.mock("@/features/performance", () => ({
  usePerformanceSettings: () => ({ reducedMotion: true, lowPerformance: false }),
}));

describe("ProjectCardExpandable", () => {
  beforeEach(() => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: query.includes("min-width: 768px") ? true : false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  it("toggles inline details on desktop", async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn();

    render(
      <ProjectCardExpandable
        project={projectsData[0]}
        layout="desktop"
        isExpanded={false}
        onExpandedChange={onExpandedChange}
      />
    );

    await user.click(screen.getByRole("button", { name: /подробнее/i }));
    expect(onExpandedChange).toHaveBeenCalledWith(projectsData[0].slug);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test tests/entities/project/ProjectCardExpandable.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implement ProjectCardExpandable**

Create `src/entities/project/ui/ProjectCardExpandable.tsx`:

```tsx
"use client";

import React, { useId, useRef, useState } from "react";

import { usePerformanceSettings } from "@/features/performance";

import type { ProjectItem } from "../model/types";
import ProjectCard from "./ProjectCard";
import ProjectCardDetailGrid from "./ProjectCardDetailGrid";
import ProjectDetailSheet from "./ProjectDetailSheet";

interface ProjectCardExpandableProps {
  project: ProjectItem;
  layout: "desktop" | "mobile";
  isExpanded: boolean;
  onExpandedChange: (slug: string | null) => void;
  isStacked?: boolean;
}

const ProjectCardExpandable: React.FC<ProjectCardExpandableProps> = ({
  project,
  layout,
  isExpanded,
  onExpandedChange,
  isStacked = false,
}) => {
  const { reducedMotion } = usePerformanceSettings();
  const detailsId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleToggle = (): void => {
    if (layout === "mobile") {
      setIsSheetOpen((open) => !open);
      return;
    }

    onExpandedChange(isExpanded ? null : project.slug);
  };

  const handleSheetClose = (): void => {
    setIsSheetOpen(false);
    toggleRef.current?.focus();
  };

  const showInlineDetails = layout === "desktop" && isExpanded;

  return (
    <>
      <div className={`flex flex-col ${showInlineDetails ? "row-span-2" : ""}`}>
        <ProjectCard
          project={project}
          isStacked={isStacked}
          disableHover={showInlineDetails}
          detailsToggle={{
            isExpanded: layout === "desktop" ? isExpanded : isSheetOpen,
            controlsId: detailsId,
            onToggle: handleToggle,
          }}
        />
        {layout === "desktop" ? (
          <ProjectCardDetailGrid
            project={project}
            id={detailsId}
            isVisible={showInlineDetails}
            reducedMotion={reducedMotion}
          />
        ) : null}
      </div>

      {layout === "mobile" ? (
        <ProjectDetailSheet
          project={project}
          isOpen={isSheetOpen}
          onClose={handleSheetClose}
          reducedMotion={reducedMotion}
        />
      ) : null}
    </>
  );
};

export default ProjectCardExpandable;
export { ProjectCardExpandable };
```

Export from `src/entities/project/ui/index.ts`.

Note: Pass `toggleRef` to ProjectCard if focus restore needed — optional enhancement in Task 7 if button ref forwarding is added.

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test tests/entities/project/ProjectCardExpandable.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/entities/project/ui/ProjectCardExpandable.tsx src/entities/project/ui/index.ts tests/entities/project/ProjectCardExpandable.test.tsx
git commit -m "feat(projects): add expandable project card wrapper"
```

---

### Task 6: ProjectsGrid with accordion state

**Files:**

- Create: `src/widgets/projects/ui/ProjectsGrid.tsx`
- Modify: `src/widgets/projects/ui/ProjectsView.tsx`

- [ ] **Step 1: Create ProjectsGrid**

Create `src/widgets/projects/ui/ProjectsGrid.tsx`:

```tsx
"use client";

import React, { useState } from "react";

import { ProjectCardExpandable } from "@/entities/project/ui/ProjectCardExpandable";
import { projectsData } from "@/shared/config/content";

const ProjectsGrid: React.FC = () => {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  return (
    <div className="hidden auto-rows-min gap-5 md:grid md:grid-cols-2 md:gap-6 xl:grid-cols-3">
      {projectsData.map((project) => (
        <ProjectCardExpandable
          key={project.slug}
          project={project}
          layout="desktop"
          isExpanded={expandedSlug === project.slug}
          onExpandedChange={setExpandedSlug}
        />
      ))}
    </div>
  );
};

export default ProjectsGrid;
```

- [ ] **Step 2: Update ProjectsView**

Replace desktop grid block in `src/widgets/projects/ui/ProjectsView.tsx`:

```tsx
import ProjectsGrid from "./ProjectsGrid";

// ...

<div className="md:hidden">
  <ProjectCardDeck />
</div>

<ProjectsGrid />
```

Remove old `hidden gap-5 md:grid...` block and unused `ProjectCard` / `projectsData` imports.

- [ ] **Step 3: Run build to verify no type errors**

Run: `bun run build`
Expected: successful build

- [ ] **Step 4: Commit**

```bash
git add src/widgets/projects/ui/ProjectsGrid.tsx src/widgets/projects/ui/ProjectsView.tsx
git commit -m "feat(projects): add desktop accordion grid for expanded cards"
```

---

### Task 7: Wire mobile deck

**Files:**

- Modify: `src/widgets/projects/ui/ProjectCardDeck.tsx`
- Test: `tests/widgets/projects.test.tsx`

- [ ] **Step 1: Update ProjectCardDeck**

Replace `<ProjectCard project={project} isStacked={!isActive} />` with:

```tsx
<ProjectCardExpandable
  project={project}
  layout="mobile"
  isExpanded={false}
  onExpandedChange={() => {}}
  isStacked={!isActive}
/>
```

Add import for `ProjectCardExpandable`.

- [ ] **Step 2: Update integration test**

In `tests/widgets/projects.test.tsx`, update expectations:

```tsx
it("renders the heading and action buttons per project", () => {
  render(<ProjectsWidget />);
  expect(screen.getByRole("heading", { name: /избранные/i })).toBeInTheDocument();
  expect(screen.getAllByRole("link", { name: /код/i })).toHaveLength(4);
  expect(screen.getAllByRole("button", { name: /подробнее/i }).length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByText("File Manager")).toHaveLength(2);
});
```

- [ ] **Step 3: Run all tests**

Run: `bun run test`
Expected: all PASS

- [ ] **Step 4: Commit**

```bash
git add src/widgets/projects/ui/ProjectCardDeck.tsx tests/widgets/projects.test.tsx
git commit -m "feat(projects): wire mobile deck to detail sheet"
```

---

### Task 8: Manual verification + pre-delivery checklist

- [ ] **Step 1: Run dev server and verify desktop**

Run: `bun run dev`

Check at `http://localhost:3000/#projects`:

- Click «Подробнее» on File Manager → 4 cells appear, accordion closes others
- Click «Свернуть» → cells hide
- Hover press works on collapsed cards only
- Dark mode: borders visible, contrast OK

- [ ] **Step 2: Verify mobile (375px)**

In DevTools responsive mode:

- Swipe deck works when sheet closed
- «Подробнее» opens bottom sheet overlay
- Escape / overlay click / ✕ closes sheet
- No horizontal scroll

- [ ] **Step 3: Verify reduced motion**

Enable `prefers-reduced-motion: reduce` in DevTools → animations instant

- [ ] **Step 4: Run lint**

Run: `bun run lint`
Expected: no errors

- [ ] **Step 5: Final commit if any fixes**

```bash
git add -A
git commit -m "fix(projects): address review findings from manual QA"
```

---

## Spec Coverage Check

| Spec requirement                     | Task          |
| ------------------------------------ | ------------- |
| `ProjectDetail` data model           | Task 1        |
| 4 Bauhaus cells                      | Task 2        |
| «Подробнее» button                   | Task 3        |
| Mobile overlay sheet                 | Task 4        |
| Desktop accordion                    | Tasks 5–6     |
| Mobile deck integration              | Task 7        |
| a11y (aria-expanded, dialog, Escape) | Tasks 3–4     |
| reduced motion                       | Tasks 2, 4, 5 |
| Pre-delivery checklist               | Task 8        |

## Self-Review Notes

- `@testing-library/user-event` may need install in Task 3 if not present — check `package.json` first
- `ProjectCard` `detailsToggle` prop uses `project.detailsToggle` in step 3 code — fix to destructure from props: `detailsToggle` not `project.detailsToggle`
- Desktop grid uses `auto-rows-min` + `row-span-2` on wrapper for accordion push effect
- `toggleRef` in Expandable is declared but wire to ProjectCard only if focus restore needed in Task 7 polish
