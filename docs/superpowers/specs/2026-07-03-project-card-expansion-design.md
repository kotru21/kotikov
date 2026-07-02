# Project Card Bauhaus Expansion — Design Spec

**Date:** 2026-07-03  
**Status:** Approved (brainstorming)  
**Project:** Kotikov Portfolio — секция «Проекты»

---

## Summary

Добавить расширенное описание каждому из 3 проектов через интерактивное раскрытие карточки в стиле Bauhaus/neobrutalism. Пользователь нажимает «Подробнее» и видит модульную сетку из 4 ячеек: **задача → решение → результат + стек**.

### Decisions (brainstorming)

| Вопрос | Выбор |
|--------|-------|
| Тип раскрытия (desktop) | **C — Модульная Bauhaus-сетка** |
| Контент ячеек | **C — Задача → решение → результат + стек** |
| Поведение desktop | **C — Accordion в grid, карточка «выталкивает» соседние** |
| Поведение mobile | **B — Overlay + bottom sheet** |

---

## Goals

- Показать глубину каждого проекта без перехода на отдельную страницу
- Сохранить визуальный язык сайта: `rounded-none`, `border-2`, hard shadow, mint accent
- Минимизировать client JS — только там, где нужно состояние и modal
- Полная поддержка `prefers-reduced-motion` и keyboard a11y

## Non-Goals

- Отдельные страницы проектов (`/projects/[slug]`)
- Скриншоты внутри раскрытой зоны (поле `imageSrc` остаётся на будущее)
- Framer Motion / GSAP — только CSS transitions + существующий `usePerformanceSettings`
- Radix/shadcn Dialog — кастомный Bauhaus sheet достаточен

---

## Architecture

### Recommended approach: Wrapper + Sheet

```
ProjectCardExpandable (client)
├── ProjectCard (presentational — closed state + кнопки)
├── ProjectCardDetailGrid (shared — 4 Bauhaus cells)
└── ProjectDetailSheet (client — mobile overlay only)

ProjectsGrid (client — desktop accordion state)
ProjectCardDeck (existing — wraps ProjectCardExpandable)
```

**Почему не монолит:** `ProjectCard` остаётся переиспользуемым; deck и grid получают одинаковый expand API.

### Data model

```typescript
interface ProjectDetail {
  challenge: string;
  solution: string;
  outcome: string;
}

interface ProjectContent {
  // ...existing fields
  details: ProjectDetail;
  // stack[] — уже есть, используется в ячейке «Стек»
}
```

### Content (draft copy)

| Slug | challenge | solution | outcome |
|------|-----------|----------|---------|
| `file-manager-tauri` | Навигация по тысячам файлов без лагов UI | Виртуализированные списки и кастомные контролы | Unit + Integration + E2E покрытие, open source |
| `web-messenger` | Мгновенный обмен сообщениями между пользователями | Socket.IO для realtime, JWT auth, MongoDB для истории | Full-stack продукт с авторизацией и историей чатов |
| `tiktok-analyzer` | Быстрая интерпретация активности TikTok-аккаунтов | Структурированные data views для чатов | Инструмент для анализа и визуализации чат-активности |

---

## Visual Design

### Closed state (без изменений + кнопка)

Текущий `ProjectCard`: icon, period, eyebrow, title, role, summary, meta, «Код».  
**Добавить:** кнопка «Подробнее» в footer рядом с «Код».

### Expanded grid — 4 cells

| # | Label | Background | Text |
|---|-------|------------|------|
| 1 | Задача | `project.accentColor` | `details.challenge` — `text-neutral-950` |
| 2 | Решение | `bg-white` / `dark:bg-neutral-900` | `details.solution` |
| 3 | Результат | `bg-black` / `dark:bg-white` | `text-white` / `dark:text-black` — `details.outcome` |
| 4 | Стек | `bg-neutral-100` / `dark:bg-neutral-800` | Badge-теги из `stack[]` |

**Cell label:** `text-xs font-bold uppercase tracking-[0.12em]`

**Decorative circle:** absolute, top-right раскрытой зоны, `size-12`, `border-2 border-black`, `backgroundColor: accentColor`, `opacity-60`, scale animation on expand.

### Stack badges

Переиспользовать паттерн `Badge` или inline: `rounded-none border-2 border-black px-2 py-0.5 text-xs font-bold uppercase`.

### Button states

| State | Label | Style |
|-------|-------|-------|
| Collapsed | Подробнее | mint bg, border-2, shadow press |
| Expanded | Свернуть | neutral bg, same press pattern |

---

## Interaction Design

### Desktop (md+)

- Grid: `md:grid-cols-2 xl:grid-cols-3` (как сейчас)
- State: `expandedSlug: string | null` в `ProjectsGrid`
- При клике «Подробнее»: set slug; предыдущая карточка закрывается (accordion)
- Expanded card: `grid-row: span 2` (или `col-span-2` на xl при необходимости)
- Соседние карточки reflow через CSS Grid — без JS position calculation
- Hover press на закрытых карточках сохраняется; на expanded — disabled

### Mobile (< md)

- `ProjectCardDeck` → `ProjectCardExpandable` внутри active panel
- «Подробнее» открывает `ProjectDetailSheet`:
  - Overlay: `fixed inset-0 z-50 bg-black/85`
  - Sheet: slide from bottom, `border-2 border-black`, shadow `4px 4px 0 #00ffb9` (mint)
  - Header: title + кнопка закрытия (FiX icon, не emoji)
  - Body: `ProjectCardDetailGrid` — те же 4 ячейки
- Закрытие: ✕ button, Escape, click overlay
- Deck swipe/keyboard **не блокируется** — sheet поверх, deck остаётся под overlay

### Animation timing

| Element | Property | Duration | Easing |
|---------|----------|----------|--------|
| Grid cells | opacity, transform | 300ms | ease-out, stagger 80ms |
| Card row span | grid-row | 450ms | cubic-bezier(0.22, 1, 0.36, 1) |
| Decorative circle | transform scale | 400ms | cubic-bezier(0.34, 1.56, 0.64, 1), delay 150ms |
| Overlay | opacity | 350ms | ease-out |
| Sheet | translateY | 400ms | ease-out |

**Reduced motion:** `usePerformanceSettings().reducedMotion` → instant show/hide, no transform/scale.

---

## Accessibility (UI/UX Pro Max + web guidelines)

| Rule | Implementation |
|------|----------------|
| `focus-visible` rings | `focus-visible:ring-2 focus-visible:ring-primary-400` на всех кнопках |
| Never `outline-none` alone | Всегда с ring replacement |
| Touch targets ≥ 44px | `min-h-11 min-w-11` на «Подробнее» и close |
| `cursor-pointer` | На всех clickable |
| Keyboard | Escape закрывает sheet; Tab trap внутри dialog |
| ARIA | `aria-expanded`, `aria-controls` на toggle; sheet: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` |
| Focus restore | Return focus to «Подробнее» on close |
| Semantic content | `<dl>` / `<dt>`/`<dd>` или headings + paragraphs в ячейках |
| Contrast | Black text on mint (#2cffc7) — проверить WCAG; при fail использовать `text-neutral-950` bold |
| Reduced motion | HIGH severity — обязательно через hook + CSS |
| Transform perf | Animate `transform`/`opacity`, not `width`/`height`/`top` |
| Max 1–2 animated elements | Cells stagger + один circle — в пределах нормы |

---

## File Changes

| File | Action |
|------|--------|
| `src/shared/config/content/projects.ts` | Add `ProjectDetail`, `details` field + copy |
| `src/entities/project/model/types.ts` | Re-export if needed |
| `src/entities/project/ui/ProjectCard.tsx` | Add «Подробнее» slot/props |
| `src/entities/project/ui/ProjectCardDetailGrid.tsx` | **Create** — 4 cells |
| `src/entities/project/ui/ProjectCardExpandable.tsx` | **Create** — client wrapper |
| `src/entities/project/ui/ProjectDetailSheet.tsx` | **Create** — mobile modal |
| `src/widgets/projects/ui/ProjectsGrid.tsx` | **Create** — desktop accordion |
| `src/widgets/projects/ui/ProjectsView.tsx` | Use ProjectsGrid + deck update |
| `src/entities/project/index.ts` | Export new components |
| `tests/shared/content.test.ts` | Assert `details` fields |
| `tests/entities/project/ProjectCardDetailGrid.test.tsx` | **Create** |
| `tests/entities/project/ProjectCardExpandable.test.tsx` | **Create** |

---

## Testing Plan

1. **Content:** каждый проект имеет `details.challenge/solution/outcome` (non-empty)
2. **ProjectCardDetailGrid:** рендерит 4 ячейки с правильными labels и stack tags
3. **Accordion:** открытие B закрывает A (`expandedSlug` single)
4. **a11y:** toggle имеет `aria-expanded="true"` when open
5. **Sheet:** Escape вызывает onClose (mock)
6. **Reduced motion:** при `reducedMotion=true` нет transition classes

---

## Pre-Delivery Checklist (UI/UX Pro Max)

- [ ] No emoji icons (Lucide FiX for close)
- [ ] `cursor-pointer` on clickable
- [ ] Hover/press transitions 150–300ms
- [ ] Light + dark mode contrast verified
- [ ] Borders visible in both modes
- [ ] Responsive: 375, 768, 1024, 1440
- [ ] No horizontal scroll on mobile sheet
- [ ] `prefers-reduced-motion` respected
- [ ] Focus states visible

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Grid accordion layout jump (CLS) | Reserve min-height on expanded row; use `grid-row span` not height animation |
| Mint text contrast | Bold dark text; test with contrast checker |
| Client bundle size | Single small client wrapper; sheet lazy if needed |
| Deck + sheet z-index conflict | Sheet z-50; deck max z-30 |

---

## References

- Existing: `ProjectCard.tsx`, `ProjectCardDeck.tsx`, `deckTransform.ts`
- Colors: `src/shared/styles/colors.ts` (Bauhaus mint `#00ffb9`)
- Performance hook: `usePerformanceSettings.ts`
