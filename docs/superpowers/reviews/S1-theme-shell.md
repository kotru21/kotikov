# Stage S1 — Theme + app shell

Date: 2026-07-12
Pass: 2 (fixes)
Gate status: passed

## Scope paths

- `src/features/theme/*`
- `app/layout.tsx`
- `app/globals.css`
- `app/manifest.ts`
- `app/error.tsx`
- `app/global-error.tsx`
- `app/not-found.tsx`
- `app/components/*`
- `src/shared/styles/**` (theme-related: `colors.ts`, `tailwind/dark-mode.css`, `tailwind/theme.css`, related imports via `globals.css`)
- `app/styles/colors.ts`, `app/styles/colorExamples.ts` (app-shell style leftovers)

## Client boundary inventory

| File | `'use client'`? | Role |
|------|-----------------|------|
| `ThemeProvider.tsx` | yes | Context + `useSyncExternalStore` / layout effects — required client entry |
| `ThemeToggle.tsx` | yes | Interactive toggle — required client entry |
| `themeLogic.ts`, `themeCookie.ts`, `themeDomStore.ts`, `themeInitScript.ts`, `themeCriticalCss.ts`, `themeTokens.ts`, `themeConstants.ts` | no | Pure / DOM-helper modules (safe for server import of constants/CSS/script strings) |
| `useTheme.ts` | — | Removed (S1-01) |
| `client.ts` | yes (re-exports) | Client public entry: provider / hooks / toggle |
| `app/layout.tsx` | no | Server root layout; nests `ThemeProvider` correctly |
| `app/error.tsx` | yes | Required — Next.js error boundaries must be Client Components |
| `app/global-error.tsx` | yes | Required — same |
| `app/not-found.tsx` | no | Server Component; composes client `BackButton` |
| `app/components/BackButton.tsx` | yes | `history.back()` — required client |
| `app/components/SkipLinks.tsx` | no | Static links — correctly server |
| `app/components/BauhausErrorMark.tsx` | no | Presentational — correctly server |
| `app/components/StructuredData.tsx` | no | JSON-LD — correctly server |

**Next.js (Context7 / v16.2):** Server Components by default; Client Components for interactivity, state, browser APIs; `error.tsx` / `global-error.tsx` must be Client Components. Current Stage 1 client surface matches that guidance. Wrapping the tree with `ThemeProvider` while passing `children` preserves RSC slots for page content (correct pattern).

## Planned Pass 2 gate

```bash
bun run lint
bun run typecheck
bun run test -- tests/features/theme.test.tsx tests/app
bun run test:e2e -- e2e/theme-and-motion.spec.ts e2e/errors.spec.ts
bun run test:visual -- e2e/visual/critical-states.spec.ts
```

## Findings

### S1-01

- severity: P3
- area: code
- where: `src/features/theme/useTheme.ts` — dead re-export barrel
- problem: File only re-exports `ThemeProvider` / `useTheme` / `ThemeChoice` from `ThemeProvider.tsx`, but nothing imports it; public API already re-exports from `ThemeProvider` via `index.ts`.
- why: Dead module adds noise and a second accidental import path that can drift.
- proposal: Delete `useTheme.ts` (no public API change if consumers keep using `@/features/theme`).
- ux_risk: none
- decision: fix

### S1-02

- severity: P2
- area: architecture
- where: `src/features/theme/index.ts` — public barrel mixing client + server exports
- problem: Single barrel exports both Client Components (`ThemeProvider`, `ThemeToggle`, `useTheme`, `useHasMounted`) and server-safe constants/scripts (`THEME_CRITICAL_CSS`, `THEME_INIT_SCRIPT`, `THEME_SURFACE`, pure logic).
- why: Mixed barrels make Server/Client intent harder to audit and can encourage accidental client coupling when importing “just a constant” from the same entry as interactive UI (Next.js guidance: keep client surface minimal and explicit).
- proposal: Split public API into server-safe entry (e.g. keep pure exports on `index.ts` or `theme/server.ts`) and client entry (`theme/client.ts` or keep components as explicit named client modules), then update `layout.tsx` / `HeaderNavigation` imports without changing runtime behavior.
- ux_risk: none
- decision: fix

### S1-03

- severity: P3
- area: code
- where: `app/styles/colorExamples.ts` — unused examples module
- problem: Large example/demo module is never imported by app, features, widgets, or tests.
- why: Dead code in the app shell style area; risks bit-rot next to the real palette.
- proposal: Delete the file (or move to docs outside the runtime tree if examples are still desired).
- ux_risk: none
- decision: fix

### S1-04

- severity: P3
- area: code
- where: `app/styles/colors.ts` — legacy re-export shim
- problem: Thin re-export of `@/styles/colors` with no remaining importers (all call sites use `@/styles/colors` / shared path).
- why: Legacy compatibility shim without consumers; confuses “source of truth” for colors.
- proposal: Delete `app/styles/colors.ts` after confirming no dynamic/path imports; keep `src/shared/styles/colors.ts` as the only palette source.
- ux_risk: none
- decision: fix

### S1-05

- severity: P3
- area: code
- where: `app/components/StructuredData.tsx` — empty `{}` JSX nodes
- problem: Three empty `{}` expressions sit between `<script>` tags with no effect.
- why: Noise / leftover; slightly hurts readability of an SEO-critical component.
- proposal: Remove the empty expressions; leave JSON-LD payloads unchanged.
- ux_risk: none
- decision: fix

### S1-06

- severity: P2
- area: tests
- where: `app/global-error.tsx`, `app/components/BauhausErrorMark.tsx`, `app/components/BackButton.tsx`
- problem: Stage 1 has unit coverage for `error.tsx`, `not-found.tsx`, and `SkipLinks`, but no unit tests for `global-error`, `BauhausErrorMark`, or `BackButton`.
- why: Critical recovery UI and shared error mark can regress without a cheap characterization lock; e2e `errors` helps but does not pin component contracts.
- proposal: Add focused unit tests (render + primary actions / mark `data-testid`) without changing markup/classes.
- ux_risk: none
- decision: fix

### S1-07

- severity: P2
- area: tests
- where: `app/global-error.tsx` — `criticalColors` vs `src/shared/styles/colors.ts` / `THEME_SURFACE`
- problem: `global-error` intentionally inlines hexes (cannot import app modules) that are documented as mirroring shared colors, but nothing asserts parity.
- why: Palette/theme cleanups can silently desync the critical fallback shell from the live theme.
- proposal: Add a pure parity test that imports shared `colors` / `THEME_SURFACE` and asserts equality against the same hex literals used in `global-error` (extract literals to a tiny shared-constant file only if needed; prefer test-only lock to avoid UX churn).
- ux_risk: none
- decision: fix

### S1-08

- severity: P2
- area: tests
- where: `src/shared/styles/tailwind/dark-mode.css` vs `THEME_SURFACE` / `colors.background.dark` / `colors.text.onDark`
- problem: Critical CSS is locked to `THEME_SURFACE` in unit tests, but `dark-mode.css` CSS variables (`--background` / `--foreground`) are duplicated as raw hex and are not asserted against the same source.
- why: Theme WIP already notes “keep in sync”; without a test, FOUC-critical CSS and Tailwind dark tokens can drift independently.
- proposal: Add a small unit test that reads/parses the dark-mode hexes (or shared exported constants if extracted) and asserts match with `THEME_SURFACE` — no visual change.
- ux_risk: none
- decision: fix

### S1-09

- severity: P3
- area: architecture
- where: `src/features/theme/ThemeToggle.tsx` — import `@/features/interactive-elements`
- problem: Theme toggle depends on another feature (`InteractiveElement`) for paint-exclusion / interaction wrapping, creating feature→feature coupling for a chrome control.
- why: Allowed by current eslint boundaries, but increases blast radius of interactive-elements changes into theme; FSD often prefers shared UI for cross-feature primitives.
- proposal: Either keep (document as intentional paint integration) or extract a shared button primitive used by ThemeToggle without changing classes/behavior; defer broader InteractiveElement moves to Stage 9 if out of slice.
- ux_risk: low
- decision: fix

### S1-10

- severity: P3
- area: code
- where: `src/features/theme/ThemeProvider.tsx` — `toggle`
- problem: `toggle` decides next theme via `document.documentElement.classList.contains("dark")` instead of the already-subscribed `isDark` snapshot.
- why: Two sources of truth (DOM class vs store snapshot) can diverge briefly during edge timing; using `isDark` is clearer and keeps commit path consistent.
- proposal: Implement `toggle` as `setChoice(isDark ? "light" : "dark")` with `isDark` from the store/context value (behavior should remain equivalent under normal operation).
- ux_risk: low
- decision: fix

### S1-11

- severity: P3
- area: code
- where: `src/features/theme/themeLogic.ts` — `persistChoice` / `applyChoice` defaults
- problem: `readChoice` / cookie helpers guard `window`/`document`, but `persistChoice` and default `applyChoice`/`commitThemeChoice` roots assume a browser environment.
- why: Safe today because only client callers use them; inconsistent defensive style makes future misuse (SSR call) a footgun.
- proposal: Add early no-op/guard returns mirroring `readChoice` / `writeThemeCookie`, without changing client behavior.
- ux_risk: none
- decision: fix

### S1-12

- severity: P3
- area: code
- where: `src/features/theme/index.ts`, `ThemeToggle.tsx`
- problem: Public barrel has a missing space in `buildThemeInitScript,THEME_INIT_SCRIPT`; `ThemeToggle` uses `React.FC` + default export while the rest of the feature prefers named exports.
- why: Minor consistency / formatting debt inside an otherwise clean public API.
- proposal: Format the export list; convert `ThemeToggle` to a named export (keep `index.ts` re-export shape stable for consumers).
- ux_risk: none
- decision: fix

### S1-13

- severity: P3
- area: architecture
- where: `src/features/index.ts` — root features barrel
- problem: Root `@/features` re-exports theme (and other slices) while eslint `no-restricted-imports` forbids importing `@/features` directly; no in-repo consumers found.
- why: Dead/forbidden barrel invites accidental use and duplicates slice public APIs.
- proposal: Delete or slim `src/features/index.ts` in Stage 9 if preferred; for Stage 1, at least stop re-exporting theme from the forbidden root (or defer whole file cleanup).
- ux_risk: none
- decision: fix

## Notes (not findings / observed OK)

- Blocking `THEME_INIT_SCRIPT` + `THEME_CRITICAL_CSS` in `layout` `<head>` is the right FOUC strategy; init-script parity tests are strong.
- `getServerThemeIsDarkSnapshot() === false` is acceptable with blocking init + `suppressHydrationWarning` + `useHasMounted` icon gating.
- `SkipLinks` correctly remains a Server Component.
- No `any` in Stage 1 theme/app-shell TS reviewed.
- Out-of-slice: `ScrollRestoration` inside layout belongs to scrolling/header stages if reviewed later.

## Pass 2 gate results (2026-07-12)

- lint: passed (warnings only, pre-existing)
- typecheck: passed
- unit (`tests/features/theme.test.tsx` + `tests/app`): passed (20)
- e2e (`theme-and-motion`, `errors`): passed (6)
- visual (`critical-states`): passed (14)
- snapshots: not updated
