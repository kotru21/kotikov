# Stage S5 — Skills

Date: 2026-07-12
Pass: 2 (fixes)
Gate status: passed

## Scope paths

- `src/widgets/skills/**`
- `src/features/performance/**` (imported by skills: `useSceneMotionPolicy`, `usePerformanceSettings`, `useRafWhile`, `resolveSceneMotion` / `sceneMotion`)
- Related entity (type-only): `src/entities/skill/**` (`SkillData`)
- Related content: `src/shared/config/content/skill.ts` (`skillsData`, `skillGroups`, `skillsStackLine`)
- Related UI: `@/shared/ui` (`Section`, `SectionHeader`, `Button`, `BauhausGridPattern`)
- Related composition: `app/page.tsx` imports `SkillsWidget`
- **Absent (plan file map):** `src/features/skills-scroll/**` — does not exist; marquee scroll + arc math live in the widget; continuous-motion gating lives in `@/features/performance`

## Client boundary inventory

| File | `'use client'`? | Role |
|------|-----------------|------|
| `SkillsWidget.tsx` | no | Section shell; CSS dual mount of mobile/desktop islands |
| `SkillsDesktopView.tsx` | yes | Desktop motion policy + interaction provider + cursor nyancat + marquee |
| `SkillsMobileView.tsx` | yes | Mobile header/CTA + optional marquee rows + always-on grouped tags |
| `SkillsMarquee.tsx` | yes | Desktop header/CTA/marquee/tags composition |
| `SkillMarqueeRow.tsx` | yes | CSS marquee track + optional rAF arc lift |
| `SkillMarqueeCard.tsx` | yes | Decorative skill card; writes active element to interaction context |
| `SkillsCursorNyancat.tsx` | yes | Pointer-follow / jump cursor (desktop only) |
| `SkillsInteractionContext.tsx` | yes | Shared hover + mouse position for cards ↔ cursor |
| `SkillsGroupedTags.tsx` | no | Presentational tag grid (pulled into client via parents) |
| `skills/index.ts`, `skills/ui/index.ts` | no | Named-export barrels |
| `useSceneMotionPolicy.ts` | yes | reducedMotion × lowPerf × inView × visibility → `canRunContinuous` |
| `model/sceneMotion.ts` | no | Pure `resolveSceneMotion` |
| `usePerformanceSettings.ts` | yes | `matchMedia` + device heuristics |
| `useRafWhile.ts` | yes | Conditional rAF loop |

**Widget → layer imports (`src/widgets/skills`):**

| Widget file | Imports |
|-------------|---------|
| `SkillsWidget.tsx` | `@/shared/ui` |
| `SkillsDesktopView.tsx` | `@/features/performance`, `@/shared/ui` |
| `SkillsMobileView.tsx` | `@/features/performance`, `@/shared/config/content`, `@/shared/lib`, `@/shared/ui` |
| `SkillsMarquee.tsx` | `@/features/performance`, `@/shared/config/content`, `@/shared/lib`, `@/shared/ui` |
| `SkillMarqueeRow.tsx` | `@/entities/skill` (type), `@/features/performance` |
| `SkillMarqueeCard.tsx` | `@/entities/skill` (type) |
| `SkillsCursorNyancat.tsx` | `@/features/performance` |
| `SkillsGroupedTags.tsx` | `@/shared/config/content` |

**Motion / reduced-motion path (as implemented):**

1. `usePerformanceSettings()` → `reducedMotion` / `lowPerformance`
2. Desktop `SkillsMarquee` / Mobile view: `showMarquee = !reducedMotion && !lowPerformance` (hide tracks entirely)
3. `useSceneMotionPolicy(..., { dominantEffect: "marquee" })` → `canRunContinuous` also requires in-view + document visible
4. `SkillMarqueeRow` pauses CSS `animationPlayState` + stops arc rAF when `!isMotionActive`
5. Desktop `SkillsCursorNyancat` receives `isMotionActive={motion.canRunContinuous}` but is **always mounted** (see S5-01)

**Next.js (App Router):** Server `SkillsWidget` + client view islands is correct. Both islands are always present in the DOM (CSS `md:hidden` / `hidden md:block`), so both client trees hydrate on every viewport.

## Planned Pass 2 gate

```bash
bun run lint
bun run typecheck
bun run test -- tests/widgets/SkillsWidget.test.tsx tests/widgets/SkillsCoverage.test.tsx tests/widgets/SkillMarqueeRow.test.tsx tests/widgets/SkillsCursorNyancat.test.tsx tests/features/sceneMotion.test.ts tests/features/useSceneMotionPolicy.test.tsx
bun run test:e2e -- e2e/theme-and-motion.spec.ts
bun run test:visual -- e2e/visual/critical-states.spec.ts
```

Visual mapping for Stage 5: `skills reduced-motion 1440` inside `critical-states.spec.ts` (via `prepareStableVisual` → `reducedMotion: "reduce"`). No dedicated mobile skills reduced-motion baseline (see S5-11).

E2E mapping: `theme-and-motion` asserts `#skills` lists visible and zero `[data-motion-active="true"]` under reduced motion.

## Findings

### S5-01

- severity: P1
- area: a11y
- where: `src/widgets/skills/ui/SkillsDesktopView.tsx` — `SkillsCursorNyancat`; `SkillsCursorNyancat.tsx` — `shouldAnimate` / `isVisible`
- problem: Cursor nyancat is always mounted on desktop. Reduced motion / low performance only sets `isMotionActive=false` (rAF off). Mouse enter still flips `isVisible` → opacity 100 while `currentPos` stays at `(0,0)`, so a decorative cat can appear stuck at the container origin on hover. Marquee correctly unmounts via `showMarquee`; the cursor path does not.
- why: Prefers-reduced-motion users still get a non-essential animated/decorative character; pause semantics are inconsistent with the marquee gate. Also wastes listeners while motion is blocked.
- proposal: Gate mount (or visibility) the same way as marquee — e.g. only render `SkillsCursorNyancat` when `!reducedMotion && !lowPerformance` (and keep `isMotionActive` for in-view/tab pause). Characterize with a unit test that reduced-motion desktop does not show the cat image on mouseenter. Accept `ux_risk` if any intentional “static mascot” behavior was desired (none observed in code comments).
- ux_risk: low
- decision: fix
- notes: Mount `SkillsCursorNyancat` only when `useShowSkillsMarquee()`; keep `isMotionActive` for in-view/tab pause. Unit locks no cat/marquee under reduced motion.

### S5-02

- severity: P1
- area: perf
- where: `src/widgets/skills/SkillsWidget.tsx` — dual `data-skills-view` mounts; `SkillsDesktopView` / `SkillsMobileView`
- problem: Mobile and desktop client trees both hydrate on every load. Hidden desktop still runs `useSceneMotionPolicy`, interaction provider, and cursor listeners setup; hidden mobile still runs its own motion policy + one-shot IntersectionObserver for slide-in.
- why: Doubled continuous-motion observers and client JS for a viewport that is CSS-hidden; raises main-thread and memory cost on mobile especially (desktop island still present).
- proposal: Prefer a single client shell that picks mobile vs desktop via matchMedia/`useSyncExternalStore` (or CSS container + one policy root), **or** lazy-mount the off-viewport branch after layout. Keep markup/classes identical for the visible branch so snapshots stay green. Characterization tests already lock dual unique heading ids — update those if structure collapses to one heading.
- ux_risk: medium
- decision: fix
- notes: **Partial (intentional).** `SkillsViews` keeps CSS shells (`md:hidden` / `hidden md:block`); mode starts `"both"` for hydrate/CLS safety, then matchMedia mounts only the active tree. First paint still dual-mounts briefly.

### S5-03

- severity: P2
- area: code
- where: `src/widgets/skills/ui/SkillMarqueeCard.tsx` — `onMouseLeave` vs comment
- problem: Comment states the active element is intentionally **not** cleared on leave so the cat “remembers” the last card; implementation calls `setActiveElement(null)` on leave.
- why: Comment/code drift; jump targeting may flap when moving between cards or into gaps (null then re-set), contrary to documented intent.
- proposal: Choose one contract and lock it in a unit test: (A) remove the nulling to match the comment (behavior change for cursor targeting — note `ux_risk`), or (B) keep clear-on-leave and rewrite the comment. Prefer (B) for UX-neutral cleanup unless product wants remember-last-card.
- ux_risk: none for (B); medium for (A)
- decision: fix
- notes: Comment aligned with clear-on-leave (option B). Remember-last-card not restored.

### S5-04

- severity: P2
- area: code
- where: `src/widgets/skills/ui/SkillsMarquee.tsx`; `SkillsMobileView.tsx`
- problem: Header block (`SectionHeader` + `skillsStackLine`), LinkedIn CTA, `showMarquee` gating, and grouped-tags placement are duplicated across desktop marquee and mobile view with only copy/layout deltas (CTA label/order, arc heights, one vs two rows).
- why: Drift risk on reduced-motion gating and recruiter-facing stack line; two places to update when motion policy changes.
- proposal: Extract a shared presentational `SkillsSectionChrome` (header + stack line + optional CTA slot) and a shared `useShowSkillsMarquee()` helper reading `usePerformanceSettings`. Keep mobile/desktop layout differences as props/slots — no copy unification unless approved (labels differ today).
- ux_risk: low
- decision: fix
- notes: Added `SkillsSectionIntro` + `useShowSkillsMarquee`. CTA labels/order remain view-specific.

### S5-05

- severity: P2
- area: architecture
- where: `src/widgets/skills/ui/SkillsMobileView.tsx` — `SkillsInteractionProvider`; `SkillMarqueeCard.tsx`
- problem: Mobile marquee wraps cards in `SkillsInteractionProvider`, and cards write `activeElement` on hover, but mobile never mounts `SkillsCursorNyancat` (or any other context consumer).
- why: Dead client context + hover handlers on touch-first UI; blurs the desktop-only interaction feature boundary.
- proposal: On mobile, either omit the provider and make `useSkillsInteraction` optional / no-op for cards, or split a dumb `SkillMarqueeCard` without hover side effects for mobile rows. No visual change if hover styles stay on the card.
- ux_risk: none
- decision: fix
- notes: Mobile no longer wraps provider; cards use `useSkillsInteractionOptional`.

### S5-06

- severity: P2
- area: perf
- where: `src/widgets/skills/ui/SkillsMarquee.tsx` — `skills={[...skillsData, ...skillsData]}`; `SkillMarqueeRow.tsx` — `totalCopies = 4`
- problem: Desktop already doubles `skillsData` before the row clones the array four times → up to 8× card DOM vs mobile’s 4× per row.
- why: Extra React nodes / layout work for the same seamless-loop CSS technique; arc rAF walks every `[data-skill-arc-item]`.
- proposal: Pass `skillsData` once (or a documented loop count prop) and let `SkillMarqueeRow` own duplication. Verify seamless scroll visually; characterize card count in unit test if stable.
- ux_risk: low
- decision: fix
- notes: Pass `skillsData` once; `speed` 60→30 so `-25%`/4-copy loop keeps prior visual velocity. Unit asserts 4 copies + `30s` duration.

### S5-07

- severity: P2
- area: a11y
- where: `src/features/performance/usePerformanceSettings.ts` — initial state; consumers `SkillsMarquee` / `SkillsMobileView` `showMarquee`
- problem: Hook initializes `reducedMotion: false` / `lowPerformance: false` and only reads `matchMedia` in `useEffect`. First client render can mount marquees (and, with S5-01, cursor) before the real preference applies.
- why: Brief animated content for prefers-reduced-motion users; undermines the Stage 5 reduced-motion contract that e2e/visual lock after settle.
- proposal: Initialize from `window.matchMedia` when `typeof window !== "undefined"` (lazy state initializer), or default `reducedMotion` conservatively to `true` until measured. Shared hook fix benefits other slices; keep Stage 5 gate as regression lock. Defer to Stage 9 only if treating as cross-cutting leftover — still in Stage 5 scope via skills import.
- ux_risk: low
- decision: fix
- notes: Lazy `readPerformanceSettings()` on client; SSR stays animated-default. CSS `[data-skills-decorative-motion]` hide under `prefers-reduced-motion` avoids RM flash without delaying non-RM marquee.

### S5-08

- severity: P2
- area: code
- where: `src/widgets/skills/ui/SkillsMobileView.tsx` — local `IntersectionObserver`; `useSceneMotionPolicy` → `useSceneIntersection`
- problem: Mobile creates a one-shot IntersectionObserver for slide-in `visible` state **and** a second observer inside scene motion policy (same default threshold `0.15`) on the same `rowsRef` subtree.
- why: Duplicate intersection work and two sources of “in view” truth; slide-in CSS still runs even when continuous motion is paused for other reasons.
- proposal: Derive slide-in from `motion.isInView` (exposed on `SceneMotionState`) or a shared intersection hook call; keep the existing cubic-bezier entrance styles unchanged.
- ux_risk: low
- decision: fix
- notes: One-shot latch from `motion.isInView`; entrance styles unchanged.

### S5-09

- severity: P3
- area: architecture
- where: `src/entities/skill/**`; `src/shared/config/content/skill.ts`; widget imports
- problem: Entity exposes `SkillData` and a re-export of `skillsData` from shared content, but the widget imports data from `@/shared/config/content` and only the type from `@/entities/skill`. Entity data module is unused by the slice.
- why: Split source of truth / FSD noise; easy for future code to import the wrong path.
- proposal: Either (A) widgets import data+type from entity (entity owns skill model, content stays or moves), or (B) drop unused entity data re-export and keep type next to content / shared types. Prefer defer to Stage 9 if touching content ownership.
- ux_risk: none
- decision: fix
- notes: Option (B) — deleted unused `src/entities/skill/data/*`; type-only entity API remains.

### S5-10

- severity: P3
- area: types
- where: `src/widgets/skills/model/SkillsInteractionContext.tsx` — `setActiveElement: (video: HTMLElement | null)`
- problem: Parameter is named `video` though the value is a skill card element.
- why: Misleading contract for readers; leftover rename debt.
- proposal: Rename parameter to `element` (or omit the name in the interface). No runtime change.
- ux_risk: none
- decision: fix
- notes: Renamed to `element`.

### S5-11

- severity: P3
- area: tests
- where: `e2e/visual/critical-states.spec.ts` — `skills reduced-motion 1440`; unit suite under `tests/widgets/Skills*`
- problem: Visual gate locks desktop-width reduced-motion skills only. Unit coverage is split across Coverage/Widget/Row/Nyancat files; `SkillsWidget.test.tsx` mocks unused `@/features/device` `useIsMobile`; reduced-motion “no marquee track” is covered by e2e more than by a focused unit assert on `showMarquee`.
- why: Mobile reduced-motion layout regressions and dead mocks weaken the Stage 5 signal; plan lists the right unit files but gaps remain around gating.
- proposal: Add a unit assert that `SkillsDesktopView` / `SkillsMobileView` under mocked `reducedMotion: true` render grouped tags and zero `skill-marquee-track`; remove unused `useIsMobile` mock. Optional: mobile 375 reduced-motion visual — only if user wants a new baseline (`ux_risk` for snapshot churn).
- ux_risk: none (unit); medium (new visual baseline)
- decision: fix
- notes: Strengthened unit/e2e only — no new visual baselines. Removed unused device mock; added RM gating + copy-count tests + `usePerformanceSettings` unit.

### S5-12

- severity: P3
- area: code
- where: `src/features/performance/model/sceneMotion.ts` — `DominantEffect`; `SkillsDesktopView.tsx` — `dominantEffect: "marquee"`
- problem: `DominantEffect` includes `"cursor-nyancat"` but skills desktop drives both marquee and cursor from a single `"marquee"` policy. Resolver only special-cases `"none"` — other labels are documentation-only.
- why: Suggests per-effect policy that does not exist; future callers may assume cursor can be gated independently of marquee.
- proposal: Document that labels are telemetry/intent tags only, **or** plumb separate flags if independent gating is desired (would be a behavior design change — out of default cleanup). UX-neutral: JSDoc on `DominantEffect` + use `"marquee"` consistently in skills.
- ux_risk: none
- decision: fix
- notes: JSDoc on `DominantEffect`; skills keep `"marquee"` for both effects.

## Gate results (Pass 2)

- lint: pass (0 errors; pre-existing warnings only)
- typecheck: pass
- unit: pass (`Skills*` + `sceneMotion` + `useSceneMotionPolicy` + `usePerformanceSettings`)
- e2e: pass (`e2e/theme-and-motion.spec.ts`)
- visual: pass (`e2e/visual/critical-states.spec.ts`, no snapshot updates)

## Notes (not findings)

- `src/features/skills-scroll/**` from the plan file map is absent; no action required beyond documenting that performance + widget own the concern.
- Flat (`!curved`) marquee branch in `SkillMarqueeRow` is unused by production views but covered by `SkillsCoverage` — kept.
- Marquee cards correctly use `aria-hidden` with real content in `SkillsGroupedTags` lists; e2e reduced-motion asserts those lists.
