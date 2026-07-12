# Stage S2 — Header

Date: 2026-07-12
Pass: 2 (fixes)
Gate status: passed

## Scope paths

- `src/widgets/header/**`
- `src/features/nyancat/**`
- `src/features/paw/**`
- Related (imported by header only): `src/features/scrolling/useNavMorph.ts`, `src/features/scrolling/navIslandStyle.ts` (via `@/features/scrolling` barrel)
- Related (imported by header): `@/features/interactive-elements`, `@/features/performance`, `@/features/theme/client` (cross-slice; deeper cleanup deferred unless needed for a header fix)

## Client boundary inventory

| File | `'use client'`? | Role |
|------|-----------------|------|
| `HeaderWidget.tsx` | yes | Composition root: paint + paw + motion policy + interactive registry — required client |
| `HeaderNavigation.tsx` | yes | Mobile dialog, nav morph, theme toggle — required client |
| `HeaderNyancat.tsx` | yes | Client wrapper around `FlyingNyancat` + injected keyframes |
| `HeaderHero.tsx` | no | Presentational; pulled into client graph via `HeaderWidget` (uses interactive-elements) |
| `HeaderBackground.tsx` | no | Presentational grid + optional paint overlay ref |
| `header/index.ts`, `header/ui/index.ts` | no | Barrels |
| `FlyingNyancat.tsx` | yes | Explosion + device + trail composition — required client |
| `NyancatImage.tsx` | yes | Pointer handlers + CSS animation — required client |
| `useExplosion.ts` | yes | RAF explosion loop — required client |
| `RainbowTrail.tsx`, `ExplosionPixels.tsx`, `InteractionOverlay.tsx` | no | Presentational; client via parent |
| `nyancat/lib/*`, `nyancat/types/*` | no | Pure constants/utils/types |
| `nyancat/index.ts` | no (re-exports client) | Mixed public barrel |
| `usePawAnimation.ts` | yes | Pointer + RAF paint cursor — required client |
| `PaintDrawHint.tsx` | yes | `useIsMobile` — required client |
| `ClearPaintButton.tsx`, `PawCursorIcon.tsx` | no | Presentational (contacts consumers primarily) |
| `paw/index.ts` | no | Public barrel (hook + contacts UI) |
| `useNavMorph.ts` (related) | yes | Scroll listener — required client |
| `navIslandStyle.ts` (related) | no | Pure style math |

**Widget → feature imports (`src/widgets/header`):**

| Widget file | Features |
|-------------|----------|
| `HeaderWidget.tsx` | `interactive-elements`, `paw`, `performance` |
| `HeaderNavigation.tsx` | `interactive-elements`, `performance`, `scrolling`, `theme/client` |
| `HeaderNyancat.tsx` | `nyancat` |
| `HeaderHero.tsx` | `interactive-elements` |
| `HeaderBackground.tsx` | (shared UI only) |

**Next.js (Context7 / App Router):** Client Components for interactivity / browser APIs; prefer thin client islands and pass Server Component UI as `children` when possible. Current header is one large client island from `app/page.tsx` (`<Header />`), so hero copy/nav chrome cannot stay RSC without a composition split. That split is optional cleanup, not a correctness bug.

## Planned Pass 2 gate

```bash
bun run lint
bun run typecheck
bun run test -- tests/widgets/HeaderWidget.test.tsx tests/widgets/HeaderNavigation.test.tsx tests/widgets/HeaderChrome.test.tsx tests/features/nyancatUi.test.tsx tests/features/pawUi.test.tsx
bun run test:e2e -- e2e/navigation.spec.ts e2e/recruiter-path.spec.ts
bun run test:visual -- e2e/visual/critical-states.spec.ts
```

## Findings

### S2-01

- severity: P1
- area: architecture
- where: `src/widgets/header/HeaderWidget.tsx` — client composition root
- problem: The whole header viewport (paint shell, paw handlers, motion policy, interactive registry, nav, hero, nyancat) is a single Client Component island imported from the server `app/page.tsx`.
- why: Next.js guidance prefers minimal client surfaces; this maximizes client JS for the LCP hero and blocks any RSC slotting of static hero chrome without a structural split.
- proposal: Extract thinner client islands (e.g. paint/paw shell, nav morph shell, nyancat) and keep presentational pieces importable as children/slots where safe — without changing markup/classes/behavior.
- ux_risk: low
- decision: fix

### S2-02

- severity: P1
- area: code
- where: `src/widgets/header/HeaderWidget.tsx` — `enablePaint` vs `usePawAnimation`
- problem: When `reducedMotion` is true, `enablePaint` is false (no overlay / no draw), but `usePawAnimation` still runs and can set `isDrawing`, which still applies `cursor: none` and `touchAction: none` on the header root.
- why: Reduced-motion users still get drawing-cursor / touch-action side effects without paint; on touch this can interfere with scrolling expectations tied to the motion preference path.
- proposal: Gate paw handlers / `isDrawing` styling on `enablePaint` (or pass a no-op/disabled mode into `usePawAnimation`) so reduced-motion leaves pointer/scroll behavior unchanged. Characterize with a unit test before changing.
- ux_risk: medium
- decision: fix

### S2-03

- severity: P2
- area: architecture
- where: `src/features/nyancat/index.ts` — public barrel
- problem: Single barrel re-exports Client Components/hooks (`FlyingNyancat`, `useExplosion`, `NyancatImage`) together with pure `lib/constants` / `lib/utils` / types.
- why: Same Server/Client audit problem as Stage 1 theme barrel; easy to pull client modules when only constants are needed.
- proposal: Split server-safe entry (constants/utils/types) from a client entry (components/hooks), mirror Stage 1 `theme/client` pattern; update `HeaderNyancat` import path only.
- ux_risk: none
- decision: fix

### S2-04

- severity: P2
- area: architecture
- where: `src/features/nyancat/ui/FlyingNyancat.tsx`, `src/features/nyancat/hooks/useExplosion.ts`, `src/features/paw/ui/PaintDrawHint.tsx`, `src/features/paw/usePawAnimation.ts`
- problem: Feature→feature coupling: nyancat → `device` + `performance`; paw → `device` + `interactive-elements` (plus header → many features).
- why: Allowed by current eslint boundaries, but increases blast radius across slices; FSD often prefers shared primitives for cross-feature hooks/UI wrappers.
- proposal: Document intentional couplings for paint/device/perf, or extract shared hooks/primitives in Stage 9; for Stage 2 only fix if a header fix needs a cleaner import edge.
- ux_risk: low
- decision: fix

### S2-05

- severity: P2
- area: code
- where: `src/widgets/header/ui/HeaderNavigation.tsx`
- problem: ~300-line module duplicates mobile/desktop logo + link rendering (paint-interactive vs island modes) and mixes morph math consumption, paint style reset, dialog menu, and CTA chrome.
- why: High change-amplification for nav/a11y tweaks; harder to review and test in isolation beyond the dialog cases already covered.
- proposal: Extract small presentational helpers (logo link, nav link list, island shell) inside the widget folder — same classes/props/behavior.
- ux_risk: low
- decision: fix

### S2-06

- severity: P2
- area: perf
- where: `src/features/paw/usePawAnimation.ts` — `useEffect` animate loop
- problem: The RAF effect depends on `state.mousePos` / `smoothMousePos` / `pawPos` and re-subscribes the animation loop on frequent pointer updates; the hook also returns rich cursor state that `HeaderWidget` mostly ignores (`isDrawing` + handlers only).
- why: Extra effect churn and retained complexity in a hot pointer path shared with contacts; regression risk is high if refactored casually.
- proposal: Stabilize the loop on refs (`isDrawing` + positions in refs) so the effect only starts/stops with drawing; keep public return shape stable for contacts/`CatPaw`. Add characterization tests first.
- ux_risk: medium
- decision: fix

### S2-07

- severity: P2
- area: code
- where: `src/features/nyancat/lib/constants.ts`, `src/features/nyancat/lib/utils.ts`
- problem: Dead config surface: `ANIMATION_FPS` / `ANIMATION_INTERVAL` unused; `SIZE_CONFIG` fields `hueStep`, `hueOffset`, `lightness`, `borderRadius`, `trailWidthStep` unused; trail helpers ignore `_index` / `_size` while still advertising those params.
- why: Misleading “source of truth” for trail/explosion visuals; bit-rot invites accidental behavior changes later.
- proposal: Delete unused constants/fields or wire them into real trail rendering; slim helper signatures to match actual use. No visual change if deletions only.
- ux_risk: none
- decision: fix

### S2-08

- severity: P3
- area: code
- where: `src/features/nyancat/ui/FlyingNyancat.tsx` — `InteractionOverlay` when `zIndex < 0`
- problem: Sole in-app consumer (`HeaderNyancat`) passes `zIndex={1}`, so the `InteractionOverlay` branch never mounts; default `zIndex = -5` is unused in production.
- why: Dead interaction path still maintained/tested; confuses which node owns pointer hit-testing for the header cat.
- proposal: Either remove the overlay branch and rely on `NyancatImage` handlers, or document/test the negative-zIndex contract explicitly if kept for future behind-content use.
- ux_risk: low
- decision: fix

### S2-09

- severity: P3
- area: architecture
- where: `src/widgets/header/ui/HeaderNyancat.tsx` — `buildNyancatKeyframes`
- problem: Header-specific flight/bank keyframe math and `dangerouslySetInnerHTML` `<style>` live in the widget, while motion consumption is `FlyingNyancat` in the feature.
- why: Splits animation contract across layers; harder to reuse/test keyframe purity next to nyancat utils.
- proposal: Move pure `buildNyancatKeyframes` (and constants) into `features/nyancat/lib`; keep widget as thin wiring. Static string remains XSS-safe.
- ux_risk: none
- decision: fix

### S2-10

- severity: P3
- area: types
- where: `src/features/nyancat/types/index.ts` — `FlyingNyancatProps.size`
- problem: `size` is a duplicated string union (`"small" | "medium" | "large" | "xlarge"`) instead of `NyancatSize` from `lib/constants`.
- why: Drift risk if sizes change; weakens the single source of truth already used by utils.
- proposal: Type `size: NyancatSize` (and re-export type from public API).
- ux_risk: none
- decision: fix

### S2-11

- severity: P2
- area: tests
- where: `tests/widgets/HeaderNavigation.test.tsx` — `vi.mock("@/features/theme")`
- problem: Production `HeaderNavigation` imports `ThemeToggle` from `@/features/theme/client` (Stage 1 split), but the test still mocks `@/features/theme`.
- why: Mock no longer intercepts the real import path; ThemeToggle coverage in nav tests is accidental/uncontrolled after the barrel split.
- proposal: Mock `@/features/theme/client` (same stub button) so the navigation suite stays hermetic.
- ux_risk: none
- decision: fix

### S2-12

- severity: P2
- area: tests
- where: `useExplosion`, `FlyingNyancat`, `HeaderNyancat`, `usePawAnimation`
- problem: Unit coverage is thin: `nyancatUi` only locks pointer/`aria-hidden` on `NyancatImage` + `InteractionOverlay`; header widget tests mock away paw/background/hero; no direct tests for explosion RAF lifecycle, keyframe wiring, or paw pointer contracts.
- why: Stage 2 gate can stay green while high-risk interactive internals regress; contacts tests mock paw rather than locking the shared hook.
- proposal: Add focused characterization tests (explosion cancel on unmount; reduced-motion prune; paw mouse vs touch drawing gates; HeaderNyancat paused `data-motion-active`) without changing UX.
- ux_risk: none
- decision: fix

### S2-13

- severity: P3
- area: architecture
- where: `src/features/paw/index.ts` — public API mix
- problem: Paw public API exports contacts-oriented UI (`PaintDrawHint`, `ClearPaintButton`, `PawCursorIcon`) beside the shared `usePawAnimation` hook used by header + contacts.
- why: Header stage “owns” paw per plan, but most UI is Stage 7 surface area; blurs feature cohesion and review ownership.
- proposal: Keep hook as the Stage 2/shared paint API; optionally nest contacts UI under a clearer subpath or document Stage 7 ownership — no runtime change.
- ux_risk: none
- decision: fix

### S2-14

- severity: P3
- area: code
- where: header + paw default exports / `React.FC`
- problem: Header/paw modules prefer `React.FC` + default exports while Stage 1 theme cleanup moved toward named exports and simpler function components.
- why: Inconsistent module style across slices; default exports complicate barrel renames and test imports.
- proposal: Prefer named function exports inside the slice where touch-safe; keep public barrel names stable for consumers.
- ux_risk: none
- decision: fix

## Notes (not findings / observed OK)

- No `any` in reviewed header / nyancat / paw TypeScript.
- `HeaderBackground` / `HeaderHero` correctly omit `'use client'` (client boundary comes from parent).
- Nav morph pure math (`computeNavMorph`, `computeNavIslandStyle`) is already unit-tested under `tests/features/useNavMorph.test.ts` — good related coverage for header island chrome.
- Header nyancat keyframes string is static module-scope (not user input) — `dangerouslySetInnerHTML` is not an injection vector here.
- Out-of-slice: deeper `interactive-elements` / `performance` internals, contacts paint canvas lifecycle, skills cursor nyancat — defer to their stages.

## Pass 2 gate results (2026-07-12)

- lint: passed (warnings only, pre-existing / style injection)
- typecheck: passed
- unit (`HeaderWidget`, `HeaderNavigation`, `HeaderChrome`, `HeaderNyancat`, `nyancatUi`, `pawUi`): passed (22)
- e2e (`navigation`, `recruiter-path`): passed (6) against `next start` production server
- visual (`critical-states`): passed (14); snapshots not updated
- Note: turbopack `next dev` intermittently failed to hydrate client bundles under Playwright during this pass; Stage 2 e2e/visual were verified on `bun run build` + `bun run start`.
