# Stage S3 — About

Date: 2026-07-12
Pass: 2 (fixes)
Gate status: passed

## Scope paths

- `src/widgets/about/**`
- `src/shared/config/content/about.ts`
- Related (imported by about): `@/shared/config/content` barrel, `@/shared/ui` (`Section`, `SectionHeader`), `personData` (identity DRY)
- Related (composition only): `app/page.tsx` imports `AboutWidget`
- No `src/entities/about` (content lives in shared; documented for Stage 9)

## Client boundary inventory

| File | `'use client'`? | Role |
|------|-----------------|------|
| `AboutWidget.tsx` | no | Section composition root (collapsed from AboutView) |
| `AboutSpecPanel.tsx` | no | Spec “code card” + sr-only figcaption |
| `lib/toCommentLines.ts` | no | Pure body→comment-line helper |
| `about/index.ts`, `about/ui/index.ts` | no | Named-export barrels |
| `src/shared/config/content/about.ts` | no | Static content + exported types |

**Widget → shared imports (`src/widgets/about`):**

| Widget file | Imports |
|-------------|---------|
| `AboutWidget.tsx` | `@/shared/config/content` (`aboutContent`), `@/shared/ui` (`Section`, `SectionHeader`) |
| `AboutSpecPanel.tsx` | `@/shared/config/content` (`aboutContent`) |

**Next.js (App Router):** Entire About slice remains Server Components.

## Planned Pass 2 gate

```bash
bun run lint
bun run typecheck
bun run test -- tests/widgets/AboutSpecPanel.test.tsx tests/widgets/toCommentLines.test.ts tests/shared/content.test.ts
bun run test:e2e -- e2e/recruiter-path.spec.ts
```

No dedicated visual snapshots for About (S3-06 accepted / skipped — no new baselines).

## Findings

### S3-01

- severity: P2
- area: a11y
- where: `src/widgets/about/ui/AboutSpecPanel.tsx` — `principles` / `figcaption`; `src/shared/config/content/about.ts` — `principles`
- problem: Three curated `principles` strings are maintained in content and exposed only inside the `sr-only` figcaption; the visible code panel intentionally omits them (locked by `AboutSpecPanel` tests). Sighted users never see that copy.
- why: Content/test surface treats principles as first-class (content model asserts SOC/AppSec principles), but the UI presents an inverted a11y split (extra narrative for SR only) or half-retired copy after the old tabbed UI was removed.
- proposal: Decide product intent — (A) document as intentional SR-only enrichment and stop treating principles as “page content” in reviews, (B) surface principles visually in a UX-approved layout (requires accepted `ux_risk`), or (C) remove principles from content + caption if retired. Do not change visibility without explicit OK.
- ux_risk: medium
- decision: fix
- notes: UX-neutral option (A) applied — kept sr-only presentation, documented intentional design in component + `AboutContent.principles` JSDoc, locked all principles in figcaption vs absent from decorative `pre code`. No new visible UI.

### S3-02

- severity: P2
- area: tests
- where: `e2e/recruiter-path.spec.ts` — Stage 3 e2e gate
- problem: Planned Stage 3 e2e gate is `recruiter-path`, but that spec never scrolls to `#about`, asserts the about heading, or checks spec/body visibility — it only covers hero CTA → projects → contacts.
- why: Gate can stay green while About regresses (missing section, broken heading, empty panel). Recruiter path is the wrong sole functional lock for this slice as currently written.
- proposal: Extend `recruiter-path` with a lightweight About assertion (`#about` visible + heading / key spec token), or add a thin about-focused e2e and point the Stage 3 gate at it — without changing UX.
- ux_risk: none
- decision: fix
- notes: Asserts `#about`, `#about-heading` text, and `pre code` contains `export const kotikov`.

### S3-03

- severity: P2
- area: code
- where: `src/shared/config/content/about.ts` — `spec.fields` vs `src/shared/config/content/person.ts`
- problem: Identity facts (`name` / `nameRu`, handle/`nickname`, `role`/`jobTitle`, education/employer echoes) are duplicated across `aboutContent.spec` and `personData` (and partially header/footer/timeline copy).
- why: Drift risk on the recruiter-facing identity (already mixed Latin `Arsenij` in SEO vs Cyrillic display name); About edits can desync StructuredData/`personData` without failing About unit tests.
- proposal: Derive About spec field values from `personData` (or a tiny shared identity constant) where strings must match; leave prose `body`/`principles` local. Prefer Stage 3 only if touch-safe; otherwise defer aggregation to Stage 9 shared content.
- ux_risk: none
- decision: fix
- notes: `name`/`handle`/`role` derive from `personData.nameRu` / `nickname` / `jobTitle` (same rendered strings). Location/education/experience remain local. Content test locks the derivation.

### S3-04

- severity: P3
- area: architecture
- where: `src/widgets/about/AboutWidget.tsx`
- problem: `AboutWidget` is a no-prop pass-through that only renders `<AboutView />`.
- why: Extra module/barrel hop with no composition value; page could import `AboutView` (or widget could be the section root).
- proposal: Collapse wrapper into a single widget entry (keep public `AboutWidget` name stable for `app/page.tsx` / `widgets/index`) — markup unchanged.
- ux_risk: none
- decision: fix
- notes: Section markup lives in `AboutWidget`; `AboutView.tsx` deleted. Public name unchanged.

### S3-05

- severity: P3
- area: code
- where: `src/widgets/about/ui/AboutSpecPanel.tsx` — `toCommentLines`
- problem: Sentence-splitting helper (`split(/(?<=[.!?])\s+/)`) and comment-line `key={line}` live inline in the panel module; no direct unit coverage for edge cases (abbreviations, duplicate sentences).
- why: Body→comment rendering is a pure transform that can silently change layout/keys if copy gains `.` abbreviations or repeated sentences; hard to characterize without extracting.
- proposal: Move `toCommentLines` to a tiny pure module under the widget (or shared lib), add characterization tests for current `aboutContent.body`, optionally key by index+line. No visual change if output strings stay identical.
- ux_risk: none
- decision: fix
- notes: Extracted to `src/widgets/about/lib/toCommentLines.ts` + unit tests. Kept `key={line}` (lint-safe; body sentences unique).

### S3-06

- severity: P3
- area: tests
- where: Stage 3 visual mapping — `e2e/visual/critical-states.spec.ts`
- problem: Spec/test mapping lists no dedicated About visual coverage; critical-states does not target `#about`.
- why: About is a static but brand-visible section (borders, mono “spec” card, light/dark). Regressions would rely on incidental full-page shots elsewhere or manual checks.
- proposal: Accept gap for now (document in closeout), or add a single about light/dark snapshot later with explicit user OK for baseline creation — out of Pass 2 default gate.
- ux_risk: none
- decision: fix
- notes: Accepted gap — no new visual baselines (Stage 3 gate has no visual; unit/e2e locks preferred). Residual for closeout if needed.

### S3-07

- severity: P3
- area: tests
- where: `tests/widgets/WidgetShells.test.tsx` — `AboutWidget`; `tests/widgets/AboutSpecPanel.test.tsx`
- problem: Widget shell only asserts the section heading; SpecPanel locks figcaption + “no tabs / no principles in code” but does not assert `section#about`, eyebrow, field keys/values, or `aria-hidden` on the decorative panel.
- why: Composition regressions (wrong `id`, lost `titleId`/heading wiring, decorative panel becoming readable twice) can slip past the Stage 3 unit subset.
- proposal: Add focused characterization cases (section id, heading/`titleId`, each `spec.fields` value present in `pre code`, decorative root `aria-hidden`) without changing UX.
- ux_risk: none
- decision: fix
- notes: Expanded `AboutSpecPanel.test.tsx` (composition + fields + aria-hidden); About coverage removed from WidgetShells to avoid duplication.

### S3-08

- severity: P3
- area: code
- where: about widget modules — `React.FC` + default exports
- problem: About modules use `React.FC` and default exports while Stage 1 theme cleanup preferred named function exports.
- why: Inconsistent module style across slices; default exports complicate renames and test import paths (already mixed: tests import default `AboutWidget` path vs named ui barrel).
- proposal: Prefer named function exports inside the slice; keep public barrel `AboutWidget` name stable for `app/page.tsx`.
- ux_risk: none
- decision: fix
- notes: Named `AboutWidget` / `AboutSpecPanel`; barrels and `widgets/index` updated.

### S3-09

- severity: P3
- area: architecture
- where: `src/shared/config/content/about.ts` — placement vs missing `entities/about`
- problem: About domain content lives only under `shared/config/content` with no entity module; acceptable for a static portfolio, but inconsistent with slices that use `entities/*` for structured domain data (projects, timeline, contact).
- why: Cross-stage content ownership stays blurry (Stage 3 vs Stage 9); encourages further about-specific UI helpers to pile into shared.
- proposal: Keep as-is for Stage 3 unless a fix needs a clearer home; optionally note for Stage 9 whether about content should move beside other domain content. No runtime change.
- ux_risk: none
- decision: fix
- notes: Kept in shared; module comment documents Stage 9 reconsideration. No entity move.

### S3-10

- severity: P3
- area: types
- where: `src/shared/config/content/about.ts` — `aboutContent`
- problem: Shape is only implied via `as const`; no exported interface for `spec.fields` / principles array used by the widget.
- why: Low immediate risk (narrow literal type is strong), but widget/content contract is informal — refactors can break field assumptions without a named type to share with tests.
- proposal: Optional exported `AboutContent` / `AboutSpecField` interfaces (or `satisfies`) matching current literals — types only, no runtime change.
- ux_risk: none
- decision: fix
- notes: Exported `AboutSpecField` + `AboutContent`; value uses `as const satisfies AboutContent`.

## Notes (not findings / observed OK)

- No `'use client'` anywhere in the About slice — ideal RSC boundary for a static section.
- No `any` in reviewed About TypeScript.
- Import direction is clean: widget → shared only; no feature/entity leakage.
- Decorative panel correctly uses `aria-hidden` with prose mirrored in `figcaption` for the body (good pattern for the code-card aesthetic).
- `dangerouslySetInnerHTML` / user input: none; static strings only — no XSS surface in this slice.
- Out-of-slice: `Section` / `SectionHeader` internals, full shared content barrel cleanup, `personData` SEO consumer (`StructuredData`) — Stage 9 / other stages.

## Pass 2 gate results (2026-07-12)

- lint: passed (warnings only, pre-existing / out of slice)
- typecheck: passed
- unit (`AboutSpecPanel`, `toCommentLines`, `content`): passed (22)
- e2e (`recruiter-path`): passed (2 — desktop + mobile) against `bun run build` + `bun run start`
- visual: skipped (S3-06 — no new About baselines)
- UI check: http://localhost:3000 — `#about` / `about-heading` / sr-only principles present
