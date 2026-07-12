# Staged Code Review + Cleanup (UX-preserving)

Date: 2026-07-12  
Project: kotikov (Next.js 16 / React 19 / FSD portfolio)  
Status: design approved in chat; **do not commit this doc unless explicitly requested**

## Goal

Run a staged code review of the existing portfolio and apply safe cleanups **without changing functionality or appearance**.

## Decisions

| Topic | Choice |
|-------|--------|
| Outcome mode | Audit + staged refactor/cleanup (not findings-only) |
| Slice strategy | Vertical slices; each stage covers architecture + code/types + tests |
| Stage gate | `lint` + `typecheck` + slice unit tests + relevant e2e + visual snapshots |
| Baseline | Current `main` (theme WIP already committed) |
| Slice order | Top-to-bottom page order |
| Process | Two-pass per stage: findings → user approval → fixes + gate |
| Specs in git | Keep review/spec docs local and untracked by default (no commit noise) |

## Hard constraints

- Do not change visuals, copy, animations, gestures, or interactive behavior unless fixing an explicit user-approved bug (typically P0).
- Prefer extract / move / simplify inside a slice over public API churn.
- Follow Next.js 16 App Router guidance: Server Components by default; `'use client'` only for real interactivity / browser APIs.
- Out-of-slice issues are deferred to their target stage (no scope creep).

## Stages

| Stage | Slice | Focus |
|------:|-------|--------|
| 0 | Kickoff | Create local findings template file; freeze severity + stage gate + test mapping from this spec |
| 1 | Theme + app shell | `src/features/theme/*`, `app/layout`, critical CSS/init, globals |
| 2 | Header | Header widget + nyancat/paint/nav-related features |
| 3 | About | About widget + related content/entities |
| 4 | Projects | Projects widget, deck, project entity/card |
| 5 | Skills | Skills widget + scroll/motion-related features |
| 6 | Timeline | Timeline widget + entity |
| 7 | Contacts | Contacts widget + canvas/paw hooks |
| 8 | Footer | Footer widget + social |
| 9 | Shared leftovers | `src/shared/*`, cross-cutting FSD/eslint debt outside slices |
| 10 | Closeout | Summary report, residual risks, explicit wontfix/defer list |

## Two-pass workflow

### Pass 1 — Findings only

- Produce local `docs/superpowers/reviews/S{n}-{slice}.md` (untracked unless user asks to commit)
- No production code changes
- Every finding starts with `decision: pending`
- User marks each finding `fix` / `defer` / `wontfix` (or asks the agent to apply a bulk rule)

### Pass 2 — Approved fixes only

- Implement only findings marked `fix`
- Update finding decisions in the local stage review file
- Run the stage gate (below)
- Leave `defer` / `wontfix` for closeout

## Finding schema

Each finding uses:

- `id`: `S{stage}-{nn}` (example: `S1-03`)
- `severity`: `P0` | `P1` | `P2` | `P3`
- `area`: `architecture` | `code` | `types` | `tests` | `perf` | `a11y` | `security`
- `where`: path + symbol/area
- `problem`: 1–2 sentences
- `why`: risk / debt / FSD or Next.js boundary issue
- `proposal`: concrete UX-safe change
- `ux_risk`: `none` | `low` | `medium` (`medium` requires explicit user OK before `fix`)
- `decision`: `pending` | `fix` | `defer` | `wontfix`

### Severity

- **P0** — breaks behavior/build/tests, or clear user-facing bug
- **P1** — layer boundaries / oversized client bundles / fragile contracts with high regression risk
- **P2** — duplication, complexity, weak typing, test gaps without urgent risk
- **P3** — nits / optional cleanups

## Per-slice review triad

1. **Architecture / FSD**
   - Correct layer placement (`entities` / `features` / `widgets` / `shared` / `app`)
   - Import boundaries (eslint-plugin-boundaries)
   - Minimal `'use client'` surface
   - Public API via `index.ts` where applicable
2. **Code / types**
   - Duplication, oversized modules, mixed responsibilities
   - Strict TypeScript (no `any`), stable internal contracts
   - Dead code, unnecessary effects, hidden side effects
   - Cheap perf wins only when UX-neutral
3. **Tests**
   - Coverage gaps become findings (not always fixed immediately)
   - After `fix`, update/add tests for changed internals
   - Gate always runs existing relevant e2e + visual checks

## Stage gate (DoD)

A stage is done when:

1. All stage findings have a non-`pending` `decision`
2. For applied `fix` items: `bun run lint`, `bun run typecheck`, and slice unit tests pass
3. Relevant Playwright functional e2e for the slice pass
4. Relevant visual snapshots for affected screens/states pass
5. No intentional CSS/copy/behavior diffs except approved P0 bugfixes

### Test mapping

| Stage | Unit (guide) | E2E | Visual |
|------:|--------------|-----|--------|
| 1 Theme/shell | `tests/features/theme*`, `tests/app/*` | `theme-and-motion`, `errors` | hero light/dark |
| 2 Header | `Header*`, `nyancat*`, nav/morph | `navigation`, `recruiter-path` | hero, mobile menu |
| 3 About | `AboutSpecPanel*`, related content | `recruiter-path` | none dedicated; note gap as finding if needed |
| 4 Projects | `Project*`, `projectDeck*`, `useProjectDeck*` | `projects-and-timeline` | projects light |
| 5 Skills | `Skills*`, scene/motion related | `theme-and-motion` (reduced motion) | skills reduced-motion |
| 6 Timeline | `Timeline*`, timeline utils/carousel | `projects-and-timeline` | timeline |
| 7 Contacts | `Contact*`, `paw*`, canvas | `recruiter-path` | contacts |
| 8 Footer | `FooterSocial*` | `recruiter-path` | none / contacts-adjacent if needed |
| 9 Shared | `tests/shared/*`, cross-cutting | targeted by touched contracts | only if shared UI touched |
| 10 Closeout | full vitest + full e2e + full visual | all | all |

## Artifacts

- Process spec: `docs/superpowers/specs/2026-07-12-code-review-staged-cleanup-design.md` (this file)
- Stage findings: `docs/superpowers/reviews/S{n}-{slice}.md`
- Closeout: `docs/superpowers/reviews/S10-closeout.md`

Default: keep these docs untracked/local unless the user asks to commit them.

## Git workflow

- Work on a dedicated branch from current `main` (example: `chore/staged-code-review`) when Pass 2 starts producing code diffs
- Pass 1: local review markdown only (no repo noise)
- Pass 2: code + tests; review markdown stays local unless requested
- Default delivery: one PR with a stage checklist (or per-stage PRs if requested later)
- Create commits/PRs only when the user explicitly asks
- Do not commit `docs/superpowers/**` unless the user explicitly asks

## In scope

- FSD architecture, client boundaries, duplication, types, dead code, test hardening
- Perf / a11y / security only when fixes are UX-neutral (or approved P0)

## Out of scope

- Redesign, copy changes, new features, animation/gesture replacements
- Large framework migrations (unless blockers deferred explicitly)
- Dependency upgrades “for freshness” unrelated to the slice
- Visual snapshot rewrites without a real regression and user OK

## Success criteria

- Stages 0–10 closed
- UX/behavior preserved (stage gate green)
- Residual debt explicitly documented in closeout
