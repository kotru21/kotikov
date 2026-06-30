# Experience Section Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the `#experience` timeline to four career stages (education → work → hackathons), replace dot tabs with labeled step chips, remove project cards/links, and extract carousel logic into a dedicated hook.

**Architecture:** Data shrinks to four sorted entries in `timeline.ts`. New modules `timelineTypeStyles.ts`, `TimelineStepChips.tsx`, and `useTimelineCarousel.ts` own type colors, chip navigation, and carousel state. `TimelineView` becomes a layout shell: full-width `SectionHeader`, `18rem` left column (year + chips + nav), right column slide content. TDD per layer; one commit per task.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Vitest + Testing Library, Bun.

**Design spec:** `docs/superpowers/specs/2026-06-30-experience-section-redesign-design.md`

---

## File map

| File | Action | Responsibility |
| ---- | ------ | -------------- |
| `src/shared/config/content/timeline.ts` | Modify | 4 entries, unified periods/descriptions |
| `tests/shared/content.test.ts` | Modify | Assert timeline data contract |
| `src/widgets/timeline/ui/timelineTypeStyles.ts` | Create | Eyebrow + active chip classes per type |
| `tests/widgets/timelineTypeStyles.test.ts` | Create | Class string assertions per type |
| `src/widgets/timeline/ui/TimelineStepChips.tsx` | Create | Tab chips `{year} · {type}`, scroll-snap mobile |
| `tests/widgets/TimelineStepChips.test.tsx` | Create | Render, click, ARIA |
| `src/widgets/timeline/hooks/useTimelineCarousel.ts` | Create | Index, swipe, keyboard, no wrap |
| `tests/widgets/useTimelineCarousel.test.ts` | Create | Hook behavior (no wrap, bounds) |
| `src/widgets/timeline/ui/TimelineSlideContent.tsx` | Modify | Type eyebrow, Skills-style pills, no GitHub |
| `src/widgets/timeline/ui/TimelineYearDisplay.tsx` | Modify | ~60% smaller year clamp |
| `src/widgets/timeline/ui/TimelineView.tsx` | Modify | New layout, hook, chips, `inert` slides |
| `tests/widgets/timelineUtils.test.ts` | Modify | Period fixtures `н.в.`, `июн`/`ноя` |

---

## Phase 1 — Timeline data

### Task 1: Trim timeline content to four entries

**Files:**
- Modify: `src/shared/config/content/timeline.ts`
- Test: `tests/shared/content.test.ts`

- [ ] **Step 1: Write the failing test**

Append to `tests/shared/content.test.ts` — add `timelineData` to the import from `@/shared/config/content` and add a new describe block:

```ts
import { timelineData } from "@/shared/config/content";

describe("timeline data", () => {
  it("contains exactly four non-project entries in chronological order", () => {
    expect(timelineData).toHaveLength(4);
    expect(timelineData.map((e) => e.id)).toEqual([1, 2, 4, 7]);
    expect(timelineData.every((e) => e.type !== "project")).toBe(true);
  });

  it("uses unified period strings", () => {
    expect(timelineData.map((e) => e.period)).toEqual([
      "2023",
      "2024 — н.в.",
      "июн 2025 — ноя 2025",
      "2026",
    ]);
  });

  it("has required fields on every entry", () => {
    for (const entry of timelineData) {
      expect(entry.title).toBeTruthy();
      expect(entry.company).toBeTruthy();
      expect(entry.description).toBeTruthy();
      expect(entry.technologies.length).toBeGreaterThanOrEqual(1);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test tests/shared/content.test.ts`

Expected: FAIL — length 7 instead of 4, periods mismatch, ids include 3/5/6.

- [ ] **Step 3: Replace timeline data**

Replace entire contents of `src/shared/config/content/timeline.ts`:

```ts
export const timelineData = [
  {
    id: 1,
    title: "ByChange Hackathon",
    company: "ByChange",
    period: "2023",
    description:
      "Фулстек-приложение для мониторинга здоровья: UI, работа с API и интеграция с бэкендом.",
    technologies: ["React", "API", "Node.js"],
    type: "hackathon" as const,
  },
  {
    id: 2,
    title: "Высшее образование",
    company: "БГУИР",
    period: "2024 — н.в.",
    description: "Обучение на факультете информационной безопасности БГУИР.",
    technologies: ["InfoSec", "Cryptography"],
    type: "education" as const,
  },
  {
    id: 4,
    title: "Frontend Developer",
    company: "Innowise",
    period: "июн 2025 — ноя 2025",
    description:
      "Разработка веб-приложений на React и TypeScript. Стажировка во фронтенд-команде Innowise.",
    technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Jest"],
    type: "work" as const,
  },
  {
    id: 7,
    title: "MTS Hackathon",
    company: "MTS",
    period: "2026",
    description:
      "Фулстек IaaS-платформа за сжатые сроки: API, UI, дашборды и интеграция с бэкендом.",
    technologies: ["React", "API", "Tailwind"],
    type: "hackathon" as const,
  },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test tests/shared/content.test.ts`

Expected: PASS (all describe blocks).

- [ ] **Step 5: Commit**

```bash
git add src/shared/config/content/timeline.ts tests/shared/content.test.ts
git commit -m "refactor(timeline): trim to four career stages with unified periods"
```

---

## Phase 2 — Type styles

### Task 2: `timelineTypeStyles` helpers

**Files:**
- Create: `src/widgets/timeline/ui/timelineTypeStyles.ts`
- Test: `tests/widgets/timelineTypeStyles.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/widgets/timelineTypeStyles.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import {
  getTimelineTypeChipClass,
  getTimelineTypeEyebrowClass,
} from "@/widgets/timeline/ui/timelineTypeStyles";

describe("timelineTypeStyles", () => {
  it("returns work eyebrow and active chip classes", () => {
    expect(getTimelineTypeEyebrowClass("work")).toContain("border-primary-500");
    expect(getTimelineTypeChipClass("work", true)).toContain("bg-primary-500");
  });

  it("returns education eyebrow and active chip classes", () => {
    expect(getTimelineTypeEyebrowClass("education")).toContain("bg-neutral-100");
    expect(getTimelineTypeChipClass("education", true)).toContain("bg-neutral-200");
  });

  it("returns hackathon eyebrow and active chip classes", () => {
    expect(getTimelineTypeEyebrowClass("hackathon")).toContain("bg-primary-100");
    expect(getTimelineTypeChipClass("hackathon", true)).toContain("bg-primary-100");
  });

  it("returns empty string for inactive chip accent", () => {
    expect(getTimelineTypeChipClass("work", false)).toBe("");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test tests/widgets/timelineTypeStyles.test.ts`

Expected: FAIL — module not found.

- [ ] **Step 3: Implement timelineTypeStyles**

Create `src/widgets/timeline/ui/timelineTypeStyles.ts`:

```ts
import type { TimelineItem } from "@/entities/timeline";

const eyebrowByType: Record<TimelineItem["type"], string> = {
  work: "border-l-4 border-primary-500 pl-3",
  education:
    "border-l-4 border-neutral-400 bg-neutral-100 pl-3 dark:border-neutral-500 dark:bg-neutral-800",
  hackathon:
    "border-l-4 border-primary-300 bg-primary-100 pl-3 dark:border-primary-700 dark:bg-primary-950",
  project: "border-l-4 border-neutral-400 pl-3",
};

const activeChipByType: Record<TimelineItem["type"], string> = {
  work: "bg-primary-500 text-white",
  education: "bg-neutral-200 text-text-primary dark:bg-neutral-700 dark:text-text-inverse",
  hackathon: "bg-primary-100 text-primary-950 dark:bg-primary-900 dark:text-primary-100",
  project: "bg-neutral-200 text-text-primary",
};

export function getTimelineTypeEyebrowClass(type: TimelineItem["type"]): string {
  return eyebrowByType[type];
}

export function getTimelineTypeChipClass(type: TimelineItem["type"], isActive: boolean): string {
  if (!isActive) return "";
  return activeChipByType[type];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test tests/widgets/timelineTypeStyles.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/widgets/timeline/ui/timelineTypeStyles.ts tests/widgets/timelineTypeStyles.test.ts
git commit -m "feat(timeline): add type-specific eyebrow and chip style helpers"
```

---

## Phase 3 — Step chips component

### Task 3: `TimelineStepChips`

**Files:**
- Create: `src/widgets/timeline/ui/TimelineStepChips.tsx`
- Test: `tests/widgets/TimelineStepChips.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `tests/widgets/TimelineStepChips.test.tsx`:

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { TimelineItem } from "@/entities/timeline";
import TimelineStepChips from "@/widgets/timeline/ui/TimelineStepChips";

const items: TimelineItem[] = [
  {
    id: 1,
    title: "ByChange Hackathon",
    company: "ByChange",
    period: "2023",
    description: "desc",
    technologies: ["React"],
    type: "hackathon",
  },
  {
    id: 2,
    title: "Высшее образование",
    company: "БГУИР",
    period: "2024 — н.в.",
    description: "desc",
    technologies: ["InfoSec"],
    type: "education",
  },
  {
    id: 4,
    title: "Frontend Developer",
    company: "Innowise",
    period: "июн 2025 — ноя 2025",
    description: "desc",
    technologies: ["React"],
    type: "work",
  },
  {
    id: 7,
    title: "MTS Hackathon",
    company: "MTS",
    period: "2026",
    description: "desc",
    technologies: ["React"],
    type: "hackathon",
  },
];

describe("TimelineStepChips", () => {
  it("renders four chips with year and type labels", () => {
    render(
      <TimelineStepChips
        items={items}
        activeIndex={0}
        panelId="timeline-panel-1"
        reducedMotion={false}
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "2023 · Хакатон" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "2024 · Обучение" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "2025 · Работа" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "2026 · Хакатон" })).toBeInTheDocument();
  });

  it("marks the active chip with aria-selected", () => {
    render(
      <TimelineStepChips
        items={items}
        activeIndex={2}
        panelId="timeline-panel-4"
        reducedMotion={false}
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByRole("tab", { name: "2025 · Работа" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("tab", { name: "2023 · Хакатон" })).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });

  it("calls onSelect with index when a chip is clicked", () => {
    const onSelect = vi.fn();

    render(
      <TimelineStepChips
        items={items}
        activeIndex={0}
        panelId="timeline-panel-1"
        reducedMotion={false}
        onSelect={onSelect}
      />
    );

    fireEvent.click(screen.getByRole("tab", { name: "2026 · Хакатон" }));
    expect(onSelect).toHaveBeenCalledWith(3);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test tests/widgets/TimelineStepChips.test.tsx`

Expected: FAIL — component not found.

- [ ] **Step 3: Implement TimelineStepChips**

Create `src/widgets/timeline/ui/TimelineStepChips.tsx`:

```tsx
"use client";

import React, { useEffect, useRef } from "react";

import type { TimelineItem } from "@/entities/timeline";

import { getTimelineTypeChipClass } from "./timelineTypeStyles";
import { extractYear, getTypeLabel } from "./timelineUtils";

interface TimelineStepChipsProps {
  items: TimelineItem[];
  activeIndex: number;
  panelId: string;
  reducedMotion: boolean;
  onSelect: (index: number) => void;
}

const baseChipClass =
  "min-h-11 shrink-0 border-2 border-black bg-white px-3 py-2 text-xs font-bold text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-white dark:bg-black dark:text-text-inverse";

const inactiveChipClass = "";

const activeChipShellClass =
  "shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#fff]";

const chipMotionClass = "transition-[box-shadow,background-color] duration-200";

const TimelineStepChips: React.FC<TimelineStepChipsProps> = ({
  items,
  activeIndex,
  panelId,
  reducedMotion,
  onSelect,
}) => {
  const tablistRef = useRef<HTMLDivElement>(null);
  const motionClass = reducedMotion ? "duration-0" : chipMotionClass;

  useEffect(() => {
    const tablist = tablistRef.current;
    if (tablist === null) return;

    const activeTab = tablist.querySelector<HTMLElement>(`[data-timeline-chip-index="${activeIndex}"]`);
    activeTab?.scrollIntoView({
      inline: "nearest",
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [activeIndex, reducedMotion]);

  return (
    <div
      ref={tablistRef}
      role="tablist"
      aria-label="Этапы опыта"
      className="flex gap-2 overflow-x-auto [scrollbar-width:none] snap-x snap-mandatory [-ms-overflow-style:none] md:flex-col md:overflow-visible md:snap-none [&::-webkit-scrollbar]:hidden"
    >
      {items.map((entry, index) => {
        const isActive = index === activeIndex;
        const tabId = `timeline-tab-${String(entry.id)}`;
        const label = `${extractYear(entry.period)} · ${getTypeLabel(entry.type)}`;
        const typeAccent = getTimelineTypeChipClass(entry.type, isActive);

        return (
          <button
            key={entry.id}
            id={tabId}
            type="button"
            role="tab"
            data-timeline-chip-index={index}
            aria-selected={isActive}
            aria-controls={panelId}
            aria-label={label}
            onClick={() => {
              onSelect(index);
            }}
            className={`snap-center md:snap-align-none ${baseChipClass} ${motionClass} md:w-full ${
              isActive ? `${activeChipShellClass} ${typeAccent}` : inactiveChipClass
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default TimelineStepChips;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test tests/widgets/TimelineStepChips.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/widgets/timeline/ui/TimelineStepChips.tsx tests/widgets/TimelineStepChips.test.tsx
git commit -m "feat(timeline): add labeled step chips with mobile scroll-snap"
```

---

## Phase 4 — Carousel hook

### Task 4: `useTimelineCarousel` (no wrap)

**Files:**
- Create: `src/widgets/timeline/hooks/useTimelineCarousel.ts`
- Test: `tests/widgets/useTimelineCarousel.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/widgets/useTimelineCarousel.test.ts`:

```ts
import { act, renderHook } from "@testing-library/react";
import type { KeyboardEvent } from "react";
import { describe, expect, it } from "vitest";

import { useTimelineCarousel } from "@/widgets/timeline/hooks/useTimelineCarousel";

describe("useTimelineCarousel", () => {
  it("starts at index 0 with correct canGo flags", () => {
    const { result } = renderHook(() => useTimelineCarousel({ itemCount: 4 }));

    expect(result.current.activeIndex).toBe(0);
    expect(result.current.canGoPrev).toBe(false);
    expect(result.current.canGoNext).toBe(true);
  });

  it("does not wrap past the last slide", () => {
    const { result } = renderHook(() => useTimelineCarousel({ itemCount: 4 }));

    act(() => {
      result.current.goTo(3);
    });
    expect(result.current.activeIndex).toBe(3);
    expect(result.current.canGoNext).toBe(false);

    act(() => {
      result.current.goNext();
    });
    expect(result.current.activeIndex).toBe(3);
  });

  it("does not wrap before the first slide", () => {
    const { result } = renderHook(() => useTimelineCarousel({ itemCount: 4 }));

    act(() => {
      result.current.goPrev();
    });
    expect(result.current.activeIndex).toBe(0);
    expect(result.current.canGoPrev).toBe(false);
  });

  it("clamps goTo to valid range", () => {
    const { result } = renderHook(() => useTimelineCarousel({ itemCount: 4 }));

    act(() => {
      result.current.goTo(99);
    });
    expect(result.current.activeIndex).toBe(3);

    act(() => {
      result.current.goTo(-1);
    });
    expect(result.current.activeIndex).toBe(0);
  });

  it("handles ArrowRight and Home keyboard events", () => {
    const { result } = renderHook(() => useTimelineCarousel({ itemCount: 4 }));

    act(() => {
      result.current.handleKeyDown({
        key: "ArrowRight",
        preventDefault: () => {},
      } as KeyboardEvent);
    });
    expect(result.current.activeIndex).toBe(1);

    act(() => {
      result.current.handleKeyDown({
        key: "Home",
        preventDefault: () => {},
      } as KeyboardEvent);
    });
    expect(result.current.activeIndex).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test tests/widgets/useTimelineCarousel.test.ts`

Expected: FAIL — module not found.

- [ ] **Step 3: Implement useTimelineCarousel**

Create `src/widgets/timeline/hooks/useTimelineCarousel.ts`:

```ts
"use client";

import { useCallback, useRef, useState } from "react";

import { SWIPE_THRESHOLD_PX } from "@/shared/lib/gestures";

interface UseTimelineCarouselOptions {
  itemCount: number;
}

interface UseTimelineCarouselReturn {
  activeIndex: number;
  goTo: (index: number) => void;
  goPrev: () => void;
  goNext: () => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  handleTouchStart: (event: React.TouchEvent) => void;
  handleTouchEnd: (event: React.TouchEvent) => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

export function useTimelineCarousel({
  itemCount,
}: UseTimelineCarouselOptions): UseTimelineCarouselReturn {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartXRef = useRef<number | null>(null);
  const lastIndex = Math.max(0, itemCount - 1);

  const goTo = useCallback(
    (index: number): void => {
      if (itemCount <= 0) return;
      setActiveIndex(Math.max(0, Math.min(lastIndex, index)));
    },
    [itemCount, lastIndex]
  );

  const goPrev = useCallback((): void => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  const goNext = useCallback((): void => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent): void => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      } else if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goTo(lastIndex);
      }
    },
    [goPrev, goNext, goTo, lastIndex]
  );

  const handleTouchStart = useCallback((event: React.TouchEvent): void => {
    if (event.touches.length === 0) return;
    touchStartXRef.current = event.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (event: React.TouchEvent): void => {
      const startX = touchStartXRef.current;
      touchStartXRef.current = null;
      if (startX === null) return;
      if (event.changedTouches.length === 0) return;

      const delta = event.changedTouches[0].clientX - startX;
      if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;

      if (delta > 0) {
        goPrev();
      } else {
        goNext();
      }
    },
    [goPrev, goNext]
  );

  return {
    activeIndex,
    goTo,
    goPrev,
    goNext,
    handleKeyDown,
    handleTouchStart,
    handleTouchEnd,
    canGoPrev: activeIndex > 0,
    canGoNext: activeIndex < lastIndex,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test tests/widgets/useTimelineCarousel.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/widgets/timeline/hooks/useTimelineCarousel.ts tests/widgets/useTimelineCarousel.test.ts
git commit -m "feat(timeline): extract non-wrapping carousel hook with swipe and keyboard"
```

---

## Phase 5 — Slide content

### Task 5: Redesign `TimelineSlideContent`

**Files:**
- Modify: `src/widgets/timeline/ui/TimelineSlideContent.tsx`

- [ ] **Step 1: Replace slide content markup**

Replace entire contents of `src/widgets/timeline/ui/TimelineSlideContent.tsx`:

```tsx
import React from "react";

import type { TimelineItem } from "@/entities/timeline";

import { getTimelineTypeEyebrowClass } from "./timelineTypeStyles";
import { getTypeLabel } from "./timelineUtils";

interface TimelineSlideContentProps {
  item: TimelineItem;
}

const techPillClass =
  "text-text-primary bg-background-primary border border-black px-2 py-1 text-xs font-bold dark:border-white dark:bg-neutral-900 dark:text-text-inverse";

const TimelineSlideContent: React.FC<TimelineSlideContentProps> = ({ item }) => {
  return (
    <div className="w-full px-2 md:pl-8 md:pr-0" aria-live="polite">
      <p
        className={`text-xs font-bold uppercase tracking-[0.22em] ${getTimelineTypeEyebrowClass(item.type)}`}
      >
        {getTypeLabel(item.type)}
      </p>
      <h3 className="text-text-primary mt-2 text-3xl font-black uppercase tracking-tight md:text-4xl dark:text-text-inverse">
        {item.title}
      </h3>
      <p className="text-primary-950 mt-1 text-sm font-bold dark:text-primary-300">
        {item.company}
      </p>
      <p className="text-text-secondary mt-4 text-sm font-medium leading-relaxed md:text-base dark:text-neutral-300">
        {item.description}
      </p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {item.technologies.map((tech) => (
          <li key={tech} className={techPillClass}>
            {tech}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TimelineSlideContent;
```

- [ ] **Step 2: Verify build and lint**

Run: `bun run lint`
Run: `bun run test`

Expected: PASS (no regressions; `FiExternalLink` import removed).

- [ ] **Step 3: Commit**

```bash
git add src/widgets/timeline/ui/TimelineSlideContent.tsx
git commit -m "refactor(timeline): typography-only slide content with type-colored eyebrow"
```

---

## Phase 6 — View assembly and year display

### Task 6: `TimelineView` layout + smaller year

**Files:**
- Modify: `src/widgets/timeline/ui/TimelineView.tsx`
- Modify: `src/widgets/timeline/ui/TimelineYearDisplay.tsx`

- [ ] **Step 1: Shrink year display clamp**

In `src/widgets/timeline/ui/TimelineYearDisplay.tsx`, change `digitClass`:

```ts
const digitClass =
  "text-[clamp(2.25rem,12vw,4.5rem)] font-black leading-none text-black/10 tabular-nums select-none dark:text-white/10";
```

- [ ] **Step 2: Rewrite TimelineView**

Replace entire contents of `src/widgets/timeline/ui/TimelineView.tsx`:

```tsx
"use client";

import React, { useMemo } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import type { TimelineItem } from "@/entities/timeline";
import { usePerformanceSettings } from "@/features/performance";
import { timelineData as rawTimelineData } from "@/shared/config/content";
import { BauhausGridPattern, Section, SectionHeader } from "@/shared/ui";

import { useTimelineCarousel } from "../hooks/useTimelineCarousel";
import TimelineSlideContent from "./TimelineSlideContent";
import TimelineStepChips from "./TimelineStepChips";
import { parsePeriodStart } from "./timelineUtils";
import TimelineYearDisplay from "./TimelineYearDisplay";

const navButtonClass =
  "text-text-primary dark:text-text-inverse flex size-11 shrink-0 items-center justify-center border-2 border-black bg-white transition-opacity disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-white dark:bg-black";

const alignedContentBandClass = "mx-auto w-full max-w-5xl";

const TimelineView: React.FC = () => {
  const { reducedMotion } = usePerformanceSettings();

  const timelineData = useMemo(
    () =>
      [...rawTimelineData].sort((a, b) => {
        const byPeriod = parsePeriodStart(a.period) - parsePeriodStart(b.period);
        return byPeriod !== 0 ? byPeriod : a.id - b.id;
      }),
    []
  );

  const {
    activeIndex,
    goTo,
    goPrev,
    goNext,
    handleKeyDown,
    handleTouchStart,
    handleTouchEnd,
    canGoPrev,
    canGoNext,
  } = useTimelineCarousel({ itemCount: timelineData.length });

  const activeItem = timelineData[activeIndex] as TimelineItem;
  const panelId = `timeline-panel-${String(activeItem.id)}`;

  return (
    <Section
      id="experience"
      backgroundClassName="bg-background-primary dark:bg-background-tertiary"
      className="overflow-x-hidden"
      innerClassName="relative z-10"
    >
      <BauhausGridPattern className="text-black dark:text-white" opacity={0.03} />

      <div className={`${alignedContentBandClass} flex flex-col gap-8`}>
        <SectionHeader
          eyebrow="Опыт"
          title="Мой путь"
          description="Образование, работа и хакатоны"
        />

        <div
          className="flex flex-col gap-6 md:grid md:grid-cols-[18rem_minmax(0,1fr)] md:items-stretch md:gap-6"
          aria-roledescription="carousel"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <aside className="flex flex-col items-center gap-4 md:items-stretch">
            <div className="flex w-full justify-center md:justify-start">
              <TimelineYearDisplay period={activeItem.period} />
            </div>

            <div
              className="w-full outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              tabIndex={0}
              onKeyDown={handleKeyDown}
            >
              <TimelineStepChips
                items={timelineData}
                activeIndex={activeIndex}
                panelId={panelId}
                reducedMotion={reducedMotion}
                onSelect={goTo}
              />
            </div>

            <div className="flex w-full items-center justify-center gap-2 md:justify-start">
              <button
                type="button"
                onClick={goPrev}
                disabled={!canGoPrev}
                aria-label="Предыдущий этап"
                className={navButtonClass}
              >
                <FiChevronLeft className="size-5" aria-hidden="true" />
              </button>

              <p
                className="text-text-secondary min-w-[3rem] text-center text-xs font-bold tracking-[0.2em] uppercase dark:text-neutral-400"
                aria-live="polite"
              >
                {activeIndex + 1} / {timelineData.length}
              </p>

              <button
                type="button"
                onClick={goNext}
                disabled={!canGoNext}
                aria-label="Следующий этап"
                className={navButtonClass}
              >
                <FiChevronRight className="size-5" aria-hidden="true" />
              </button>
            </div>
          </aside>

          <main className="flex min-h-0 min-w-0 flex-col justify-center md:h-full">
            <div
              id={panelId}
              role="tabpanel"
              aria-labelledby={`timeline-tab-${String(activeItem.id)}`}
              className="grid w-full md:relative [&>*]:col-start-1 [&>*]:row-start-1"
            >
              {timelineData.map((entry, index) => {
                const isActive = index === activeIndex;

                return (
                  <div
                    key={entry.id}
                    inert={isActive ? undefined : true}
                    className={
                      isActive
                        ? "col-start-1 row-start-1"
                        : "pointer-events-none invisible col-start-1 row-start-1 opacity-0"
                    }
                    aria-hidden={!isActive}
                  >
                    <TimelineSlideContent item={entry} />
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </Section>
  );
};

export default TimelineView;
```

- [ ] **Step 3: Run full test suite and home-order regression**

Run: `bun run test`
Run: `bun run lint`

Expected: PASS — including `tests/widgets/home-order.test.tsx` (`#experience` anchor intact).

- [ ] **Step 4: Commit**

```bash
git add src/widgets/timeline/ui/TimelineView.tsx src/widgets/timeline/ui/TimelineYearDisplay.tsx
git commit -m "feat(timeline): full-width header, step chips layout, smaller decade-cat year"
```

---

## Phase 7 — Utils test fixtures

### Task 7: Update `timelineUtils` period tests

**Files:**
- Modify: `tests/widgets/timelineUtils.test.ts`

- [ ] **Step 1: Write the failing test (update fixtures)**

Replace entire contents of `tests/widgets/timelineUtils.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { extractYear, parsePeriodStart } from "@/widgets/timeline/ui/timelineUtils";

describe("timelineUtils", () => {
  it("extractYear returns the first 4-digit year from a period", () => {
    expect(extractYear("2023")).toBe("2023");
    expect(extractYear("2024 — н.в.")).toBe("2024");
    expect(extractYear("июн 2025 — ноя 2025")).toBe("2025");
  });

  it("parsePeriodStart sorts months within the same year", () => {
    expect(parsePeriodStart("2025")).toBe(2025 * 12);
    expect(parsePeriodStart("июн 2025 — ноя 2025")).toBe(2025 * 12 + 6);
    expect(parsePeriodStart("2025")).toBeLessThan(parsePeriodStart("июн 2025 — ноя 2025"));
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

Run: `bun run test tests/widgets/timelineUtils.test.ts`

Expected: PASS — `parsePeriodStart` already matches prefix `"июн"`; no source change required.

- [ ] **Step 3: Run full suite**

Run: `bun run test`

Expected: PASS (all tests).

- [ ] **Step 4: Commit**

```bash
git add tests/widgets/timelineUtils.test.ts
git commit -m "test(timeline): align period fixtures with unified copy"
```

---

## Manual QA checklist (post-implementation)

Run dev server: `bun run dev` → `http://localhost:3000/#experience`

- [ ] Trajectory readable in ~10–15 s: four chips show year + type
- [ ] No wrap on first/last slide; arrows disabled at edges
- [ ] Swipe left/right on mobile viewport
- [ ] Chips horizontal scroll + snap on `< md`; vertical stack on `md+`
- [ ] Tab key skips hidden slide content (`inert` on inactive panels)
- [ ] Decade-cat year ~60% smaller, positioned higher in left column
- [ ] Dark mode: type colors and chip contrast
- [ ] `prefers-reduced-motion`: no chip transition animation
- [ ] Keyboard on tablist wrapper: ArrowLeft/Right, Home, End

---

## Self-review

### Spec coverage

| Spec section | Task |
| ------------ | ---- |
| §1.1 Remove projects (ids 3,5,6) | Task 1 |
| §1.2 Unified periods | Task 1 |
| §1.3 Short descriptions | Task 1 |
| §1.4 SectionHeader description | Task 6 |
| §1.5 No Projects cross-links | Task 5 |
| §2.1 DOM structure | Task 6 |
| §2.2 Grid `18rem` | Task 6 |
| §2.3 Mobile/desktop order | Task 6 |
| §2.4 Carousel behavior | Task 4, 6 |
| §2.5 Step chips | Task 3 |
| §3.1 Type colors | Task 2 |
| §3.2 Slide typography | Task 5 |
| §3.3 Chip states | Task 3 |
| §3.4 Nav arrows `size-11` | Task 6 |
| §3.5 Smaller year | Task 6 |
| §3.6 Reduced motion | Task 3, 6 |
| §5.1 content.test.ts | Task 1 |
| §5.2 timelineTypeStyles.test.ts | Task 2 |
| §5.3 TimelineStepChips.test.tsx | Task 3 |
| §5.4 timelineUtils.test.ts | Task 7 |
| §5.5 Manual QA | Checklist above |

No gaps found.

### Placeholder scan

No TBD, TODO, or "similar to Task N" references. Every code step includes full file contents or explicit line replacements.

### Type consistency

- `useTimelineCarousel({ itemCount })` return shape matches spec §4.3.
- `getTimelineTypeEyebrowClass` / `getTimelineTypeChipClass` signatures used consistently in Tasks 2, 3, 5.
- `TimelineStepChips` props: `items`, `activeIndex`, `panelId`, `reducedMotion`, `onSelect` — stable across Tasks 3 and 6.

---

## Execution handoff

**Plan complete and saved to `docs/superpowers/plans/2026-06-30-experience-section-redesign.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
