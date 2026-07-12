# Stage S4 — Projects

Date: 2026-07-12
Pass: 2 (fixes)
Gate status: passed

## Scope paths

- `src/widgets/projects/**`
- `src/entities/project/**`
- `src/shared/lib/deckTransform.ts`
- Related (imported by slice): `@/shared/config/content` (`projectsData` / `projectsSection` / `ProjectContent`), `@/shared/ui` (`Section`, `SectionHeader`), `@/shared/lib/gestures` (`SWIPE_THRESHOLD_PX`), `@/features/performance` (`usePerformanceSettings`), `@/shared/lib` (`formatExternalLinkLabel`)
- Related (composition only): `app/page.tsx` imports `ProjectsWidget`
- Related (shared consumer outside Stage 4 fixes): `src/widgets/timeline` also imports `deckTransform` (defer timeline-specific issues to Stage 6)

## Client boundary inventory

| File | `'use client'`? | Role |
|------|-----------------|------|
| `ProjectsWidget.tsx` | no | Section composition root (collapsed from ProjectsView) |
| `ProjectsGrid.tsx` | no | Desktop/tablet grid of `ProjectCard` |
| `ProjectCardDeck.tsx` | yes | Mobile carousel UI + focus/a11y + touch |
| `useProjectDeck.ts` | yes | Deck index / keyboard / swipe state |
| `projects/index.ts`, `projects/ui/index.ts` | no | Named-export barrels (no shared deck re-exports) |
| `entities/project/ui/ProjectCard.tsx` | no | Presentational card (pulled into client bundle via deck) |
| `entities/project/ui/ProjectCardPattern.tsx` | no | Decorative SVG patterns (`dots` / `chevrons` / `stripes`) |
| `entities/project/model/types.ts` | no | `ProjectItem` alias of shared `ProjectContent` |
| `shared/lib/deckTransform.ts` | no | Pure deck role/transform math (projects + timeline) |

**Widget → layer imports (`src/widgets/projects`):**

| Widget file | Imports |
|-------------|---------|
| `ProjectsWidget.tsx` | `@/shared/config/content` (`projectsSection`), `@/shared/ui` |
| `ProjectsGrid.tsx` | `@/entities/project`, `@/shared/config/content` |
| `ProjectCardDeck.tsx` | `@/entities/project`, `@/features/performance`, `@/shared/config/content`, `@/shared/lib/deckTransform` |
| `useProjectDeck.ts` | `@/shared/lib/gestures`, `@/shared/lib/deckTransform` |

**Next.js (App Router):** Server section shell + client deck island is the correct split. Grid stays server-capable; deck owns interactivity.

## Planned Pass 2 gate

```bash
bun run lint
bun run typecheck
bun run test -- tests/widgets/projects.test.tsx tests/widgets/ProjectsGrid.test.tsx tests/widgets/ProjectCardDeck.test.tsx tests/widgets/useProjectDeck.test.ts tests/entities/project/ProjectCard.test.tsx tests/shared/deckTransform.test.ts tests/shared/content.test.ts
bun run test:e2e -- e2e/projects-and-timeline.spec.ts
bun run test:visual -- e2e/visual/critical-states.spec.ts
```

Visual mapping for Stage 4: `projects light` (375 / 1440) inside `critical-states.spec.ts`. No projects-dark baseline (S4-10 accepted gap).

## Findings

### S4-01

- severity: P2
- area: architecture
- where: `src/widgets/projects/ui/getDeckTransform.ts`; `src/widgets/projects/ui/index.ts`; `ProjectCardDeck.tsx` imports
- problem: Widget keeps a pure re-export shim that aliases shared `getCyclicDeckCardRole` as `getDeckCardRole`, and the ui barrel re-exports shared deck types/helpers. `ProjectCardDeck` already imports `DECK_MOTION_CLASS` from `@/shared/lib/deckTransform` while pulling role/transform from the local shim — mixed import paths. Timeline already imports shared directly.
- why: Extra public surface on the projects widget (`@/widgets/projects/ui`) for shared math invites drift and blurs “deck purity lives in shared” vs “projects-only API”. The shim adds no behavior.
- proposal: Delete `getDeckTransform.ts` (or shrink to a projects-only comment module if needed); import `@/shared/lib/deckTransform` consistently from deck/hook; stop re-exporting shared deck helpers from the widget ui barrel; update `projectDeck.test.ts` to assert shared (or drop the re-export smoke test). No UX change.
- ux_risk: none
- decision: fix
- notes: Deleted shim + dropped widget re-exports; deck/hook import shared directly. Removed `projectDeck.test.ts` (covered by `tests/shared/deckTransform.test.ts`).

### S4-02

- severity: P2
- area: code
- where: `src/widgets/projects/ui/useProjectDeck.ts` — `goNext` / `goPrev`; `src/shared/lib/deckTransform.ts` — `getWrappedIndex`
- problem: `goTo` no-ops when `count <= 0`, but `goNext` / `goPrev` call `getWrappedIndex(..., count)` which becomes `NaN` when `count === 0` (`n % 0`). `ProjectCardDeck` still invokes the hook before its empty-data `return null`.
- why: Empty or temporarily zero `count` can poison `activeIndex` and break aria-pressed / focus sync if data ever empties or tests mount the hook alone (partially covered: `goTo` zero-count only).
- proposal: Guard `goNext` / `goPrev` (and optionally `getWrappedIndex`) for `count <= 0`; add a characterization test locking current empty-deck behavior. No UX change for the live 3-item dataset.
- ux_risk: none
- decision: fix
- notes: `getWrappedIndex` returns `0` when `count <= 0`; `goNext`/`goPrev` early-return; unit test covers empty navigation.

### S4-03

- severity: P2
- area: code
- where: `src/shared/lib/deckTransform.ts` — `getCyclicDeckCardRole`
- problem: Cyclic role helper returns only `active` | `next` | else `prev` — it never emits `hidden`. With the current 3 projects that maps 1:1, but with `count > 3` every non-active/non-next card shares the same `prev` transform/opacity stack.
- why: Shared helper is the projects deck contract; data growth (or reuse) would visually pile cards without a test locking “only adjacent roles”. Linear/timeline path already has `hidden`.
- proposal: Either document + test the 3-card invariant, or teach cyclic roles to mark non-adjacent cards `hidden` (characterization first). Prefer UX-neutral docs/tests unless product wants distant cards hidden (then `ux_risk` rises).
- ux_risk: low
- decision: fix
- notes: Explicit `prevIndex` + `hidden` for non-adjacent. For `count === 3` roles are identical to before (one active/next/prev). Added 4-card characterization test.

### S4-04

- severity: P3
- area: architecture
- where: `src/widgets/projects/ProjectsWidget.tsx` → `ProjectsView.tsx`
- problem: `ProjectsWidget` is a no-prop pass-through that only renders `<ProjectsView />`.
- why: Extra module/barrel hop with no composition value (same pattern fixed in Stage 3 About).
- proposal: Collapse into a single widget entry; keep public `ProjectsWidget` name stable for `app/page.tsx` / `widgets` barrel — markup unchanged.
- ux_risk: none
- decision: fix
- notes: Section markup lives in `ProjectsWidget`; `ProjectsView.tsx` deleted. Public name unchanged.

### S4-05

- severity: P3
- area: architecture
- where: `src/entities/project/model/types.ts`; `src/shared/config/content/projects.ts`; entity UI vs content placement
- problem: Entity “model” is only `export type { ProjectContent as ProjectItem }`; canonical data/`ProjectContent` live under `shared/config/content`. Entity slice is effectively UI + type alias.
- why: Ownership is split (content edits in shared, card UI in entities). Acceptable for a static portfolio, but inconsistent with “entity owns domain” expectations and with About (content-only, no entity).
- proposal: Keep as-is for Stage 4 unless a fix needs a clearer home; optionally note for Stage 9 whether `projectsData` should move beside entity model. No runtime change.
- ux_risk: none
- decision: fix
- notes: Kept split; documented Stage 9 reconsideration on content + entity type modules.

### S4-06

- severity: P3
- area: architecture
- where: `src/entities/project/ui/ProjectCard.tsx` — `isStacked`, `wideOnTablet`
- problem: Entity card API encodes widget layout modes (deck inactive stack shadow; grid last-card tablet span) instead of remaining a dumb presentational card driven only by `className` / content.
- why: Couples entity to projects widget presentation variants; harder to reuse the card without knowing deck/grid rules.
- proposal: Prefer leaving props as-is (stable UX). Optional cleanup: push layout class decisions up to `ProjectsGrid` / `ProjectCardDeck` and keep entity free of layout mode flags — only if class output stays identical.
- ux_risk: low
- decision: fix
- notes: Kept props (UX-safe); JSDoc documents intentional widget layout modes. No class churn.

### S4-07

- severity: P3
- area: code
- where: `src/widgets/projects/ui/ProjectsView.tsx` — `SectionHeader` eyebrow/title/description
- problem: Section chrome copy is hardcoded in the view while item data lives in `projects.ts` content config.
- why: Drift risk vs nav label (“Проекты”) and future i18n/content edits; other slices keep section copy near content modules.
- proposal: Move section header strings next to `projectsData` (e.g. `projectsSection` export) and import from the widget — rendered text unchanged.
- ux_risk: none
- decision: fix
- notes: Added `projectsSection` (+ type) in `projects.ts`; widget reads it. Content test locks strings.

### S4-08

- severity: P3
- area: code
- where: projects widget + entity UI modules — `React.FC` + default exports
- problem: Slice modules use `React.FC` and default exports while Stage 1/3 cleanups preferred named function exports.
- why: Inconsistent module style; default exports complicate renames and mixed test import paths (`ProjectsWidget` named barrel vs default `ProjectCardDeck` / `ProjectsGrid`).
- proposal: Prefer named function exports inside the slice; keep public barrel `ProjectsWidget` / `ProjectCard` names stable.
- ux_risk: none
- decision: fix
- notes: Named `ProjectsWidget` / `ProjectsGrid` / `ProjectCardDeck` / `ProjectCard` / `ProjectCardPattern` / `useProjectDeck`; barrels updated.

### S4-09

- severity: P3
- area: code
- where: `src/entities/project/ui/ProjectCardPattern.tsx`; `ProjectCardPattern` union in `projects.ts`
- problem: Pattern renderer implements `waves` and `scatter`, but `projectsData` only uses `chevrons` | `stripes` | `dots`.
- why: Dead branches increase maintenance cost; unused union members look like supported product options.
- proposal: Keep if reserved for future cards; otherwise remove unused variants + union members (or add a tiny test that every `projectsData.cardPattern` has a branch). No visual change if live patterns stay.
- ux_risk: none
- decision: fix
- notes: Removed `waves` / `scatter` from union + renderer. Live patterns unchanged; content test asserts allowed patterns.

### S4-10

- severity: P3
- area: tests
- where: `e2e/visual/critical-states.spec.ts` — `projects light` only
- problem: Spec/test mapping locks projects light snapshots (375/1440); there is no projects-dark visual baseline despite strong dark card/border treatment.
- why: Dark regressions in projects rely on incidental full-page checks or manual review; Stage 4 gate already runs the full visual file so light stays locked.
- proposal: Accept gap for now (document in closeout), or add projects-dark snapshots later with explicit user OK for new baselines — out of Pass 2 default unless requested.
- ux_risk: none
- decision: fix
- notes: Accepted gap — no new dark baselines (avoids unrelated snapshot churn). Residual for closeout if needed.

### S4-11

- severity: P3
- area: tests
- where: `e2e/projects-and-timeline.spec.ts` — mobile deck; `useProjectDeck.test.ts` covers swipe in unit only
- problem: Mobile e2e advances the deck via control buttons only; swipe / keyboard paths are unit-tested but not end-to-end.
- why: Gesture wiring regressions (touch handlers detached from stack) can pass unit + button e2e while real mobile swipe breaks.
- proposal: Optional thin Playwright swipe (or keyboard on focused control) assertion; keep button path as primary. UX-neutral test-only change.
- ux_risk: none
- decision: fix
- notes: Added mobile e2e keyboard ArrowRight path (counter + aria-pressed). Swipe remains unit-covered.

### S4-12

- severity: P3
- area: tests
- where: `tests/widgets/projects.test.tsx` — code-link count `4`
- problem: Widget shell expects exactly 4 “Код” links because JSDOM exposes the active (non-inert) deck card plus the full desktop grid (3), without documenting that coupling to `aria-hidden` / `inert`.
- why: Fragile characterization — changing inert/a11y on inactive slides or mount strategy flips the count without a clear failure message.
- proposal: Comment the invariant and/or assert via roles (carousel region + grid testid) instead of a magic `4`; optionally split mobile/desktop with viewport mocks if the suite gains them.
- ux_risk: none
- decision: fix
- notes: Asserts carousel (1 link) + grid (`projectsData.length`) separately with documented inert/JSDOM invariant.

### S4-13

- severity: P3
- area: a11y
- where: `ProjectsWidget.tsx` — always mounts `ProjectCardDeck` and `ProjectsGrid`
- problem: Both mobile deck and desktop grid render all projects into the DOM; visibility is CSS-only (`md:hidden` / `hidden md:grid`).
- why: Duplicate articles/links in HTML; usually hidden from AT via `display: none`, but doubles markup and can confuse future a11y audits or “unique name” link queries if CSS fails.
- proposal: Accept as responsive dual-mount (common pattern), or defer a single-tree responsive approach (higher `ux_risk`). Document intentional dual mount if kept.
- ux_risk: low
- decision: fix
- notes: Kept CSS dual tree (layout-safe). Documented intentional dual-mount on `ProjectsWidget`.

## Notes (not findings / observed OK)

- Deck purity vs hooks vs UI is mostly clean: math in `shared/lib/deckTransform`, state/gestures in `useProjectDeck`, presentation/a11y in `ProjectCardDeck`.
- Client surface is appropriately narrow (`ProjectCardDeck` + hook only).
- No `any` in reviewed projects/entity TypeScript.
- Import direction is valid FSD: widget → entity / feature / shared; entity → shared only.
- External links use `rel="noopener noreferrer"` and `formatExternalLinkLabel` for accessible names.
- Inactive deck slides use `aria-hidden` + `inert` + overlay “show project” controls; live counter uses `aria-live="polite"`.
- `accentColor` / pattern SVGs are static trusted content (inline styles) — no user-input XSS surface in this slice.
- Out-of-slice: timeline’s use of `getLinearDeckCardRole` / shared motion class (Stage 6); shared content barrel / `Section` internals (Stage 9); performance feature internals (other stages).

## Pass 2 gate results (2026-07-12)

- lint: passed (warnings only, pre-existing / out of slice)
- typecheck: passed
- unit (`projects`, `ProjectsGrid`, `ProjectCardDeck`, `useProjectDeck`, `ProjectCard`, `deckTransform`, `content`): passed (37)
- e2e (`projects-and-timeline`): passed (10 — desktop + mobile, including keyboard deck advance)
- visual (`critical-states`): passed (14) — no snapshot updates
- UI check: http://localhost:3000/#projects — section chrome, deck, CodeAnalyzer card present
