# Staged Code Review + Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Execute a UX-preserving staged code review of the kotikov portfolio (stages 0–10), producing local findings docs and applying only user-approved safe cleanups.

**Architecture:** Two-pass vertical slices top-to-bottom (theme/shell → header → about → projects → skills → timeline → contacts → footer → shared → closeout). Pass 1 writes findings only; Pass 2 implements `fix` items with tests-first when behavior contracts change, then runs the stage gate (`lint` + `typecheck` + slice unit + relevant e2e + visual).

**Tech Stack:** Next.js 16.2 App Router, React 19, TypeScript, Tailwind 4, Bun, Vitest, Playwright, FSD (`app` + `src/{entities,features,widgets,shared}`)

**Spec:** `docs/superpowers/specs/2026-07-12-code-review-staged-cleanup-design.md`  
**Docs policy:** Keep `docs/superpowers/**` local/untracked unless the user explicitly asks to commit. Do not create git commits unless the user explicitly asks.

---

## File map (artifacts + review surfaces)

### Local artifacts (create; do not commit unless asked)

| Path | Responsibility |
|------|----------------|
| `docs/superpowers/reviews/_finding-template.md` | Reusable finding block + stage header |
| `docs/superpowers/reviews/S0-kickoff.md` | Kickoff checklist completion log |
| `docs/superpowers/reviews/S1-theme-shell.md` … `S9-shared.md` | Per-stage findings + decisions |
| `docs/superpowers/reviews/S10-closeout.md` | Residual debt summary |

### Production surfaces by stage (inspect / may modify only after Pass 2 approval)

| Stage | Primary paths |
|------:|---------------|
| 1 | `src/features/theme/*`, `app/layout.tsx`, `app/globals.css`, `app/manifest.ts`, `app/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx`, `app/components/*`, `src/shared/styles/**` (theme-related only) |
| 2 | `src/widgets/header/**`, `src/features/nyancat/**`, `src/features/paw/**`, related `src/features/scrolling/**` / interactive-elements if imported by header |
| 3 | `src/widgets/about/**`, `src/shared/config/content/about.ts`, related entities/content |
| 4 | `src/widgets/projects/**`, `src/entities/project/**`, `src/shared/lib/deckTransform.ts` if used |
| 5 | `src/widgets/skills/**`, `src/features/skills-scroll/**`, `src/features/performance/**` if used by skills |
| 6 | `src/widgets/timeline/**`, `src/entities/timeline/**` |
| 7 | `src/widgets/contacts/**`, `src/entities/contact/**`, paw/canvas hooks under contacts |
| 8 | `src/widgets/footer/**`, `src/entities/footer/**` |
| 9 | Remaining `src/shared/**`, cross-cutting eslint/FSD issues deferred from earlier stages |
| — | Composition root always in scope for import checks: `app/page.tsx` |

---

### Task 0: Kickoff — findings template + stage log

**Files:**
- Create: `docs/superpowers/reviews/_finding-template.md`
- Create: `docs/superpowers/reviews/S0-kickoff.md`

- [ ] **Step 1: Create the findings template file**

Write exactly:

```markdown
# Stage S{N} — {slice-name}

Date:
Pass: 1 (findings) | 2 (fixes)
Gate status: not-run | passed | failed

## Scope paths

- `path/...`

## Findings

### S{N}-01

- severity: P2
- area: architecture
- where: `path/file.ts` — `symbol`
- problem:
- why:
- proposal:
- ux_risk: none
- decision: pending
```

- [ ] **Step 2: Create S0 kickoff log**

Write `docs/superpowers/reviews/S0-kickoff.md` with:

```markdown
# Stage S0 — Kickoff

- [x] Spec read: `docs/superpowers/specs/2026-07-12-code-review-staged-cleanup-design.md`
- [x] Template created: `docs/superpowers/reviews/_finding-template.md`
- [x] Stage gate defined: lint + typecheck + slice unit + relevant e2e + visual
- [x] Docs stay untracked unless user asks to commit
- [ ] Ready for Stage 1 Pass 1
```

- [ ] **Step 3: Confirm working tree policy**

Run:

```bash
git status -sb
```

Expected: `docs/superpowers/**` may appear as untracked; do **not** `git add` them unless the user asks.

- [ ] **Step 4: Mark kickoff ready**

Check the final box in `S0-kickoff.md`. Stop and tell the user Stage 0 is done before starting Stage 1.

---

### Task 1A: Stage 1 Pass 1 — Theme + app shell findings

**Files:**
- Create: `docs/superpowers/reviews/S1-theme-shell.md`
- Read (do not modify yet): all Stage 1 paths in the file map

- [ ] **Step 1: Inventory client boundaries**

Run from repo root (PowerShell):

```powershell
rg -n "use client" src/features/theme app/layout.tsx app/error.tsx app/global-error.tsx app/not-found.tsx app/components
```

Record which files are client entry points vs pure modules.

- [ ] **Step 2: Review triad on Stage 1 files**

For each file under `src/features/theme/` and app shell paths, check:

1. FSD layer + import direction
2. Unnecessary client coupling / mixed responsibilities
3. Types/`any`/dead code
4. Test gaps vs `tests/features/theme.test.tsx` and `tests/app/*`

- [ ] **Step 3: Write findings file**

Create `docs/superpowers/reviews/S1-theme-shell.md` using the template. Every finding `decision: pending`. Include at least the scoped paths list and these planned gate commands for Pass 2:

- `bun run lint`
- `bun run typecheck`
- `bun run test -- tests/features/theme.test.tsx tests/app`
- `bun run test:e2e -- e2e/theme-and-motion.spec.ts e2e/errors.spec.ts`
- `bun run test:visual -- e2e/visual/critical-states.spec.ts`

(If visual filter by title is needed later, prefer full visual file for Stage 1 hero states.)

- [ ] **Step 4: Stop for user decisions**

Paste a short summary table (id / severity / one-line problem) in chat. Wait until the user sets each finding to `fix` / `defer` / `wontfix` (or gives a bulk rule). Do not edit production code in this task.

---

### Task 1B: Stage 1 Pass 2 — Apply approved Theme/shell fixes

**Files:**
- Modify: only paths listed in approved `fix` findings under Stage 1
- Modify: `docs/superpowers/reviews/S1-theme-shell.md` (decisions + gate status)
- Test: `tests/features/theme.test.tsx`, `tests/app/*`

**Playbook for each approved finding (repeat per `fix` id):**

- [ ] **Step 1: If the fix changes a testable contract, write/adjust the failing or characterizing test first**

Example pattern for pure theme logic (adapt to the real finding; do not invent APIs that do not exist — open `src/features/theme/themeLogic.ts` and mirror its real exports):

```ts
import { describe, expect, it } from "vitest";
// import { realExport } from "@/features/theme/themeLogic";

describe("themeLogic regression lock", () => {
  it("keeps the existing resolved theme contract stable", () => {
    // Call the real export with fixtures matching current behavior.
    // expect(...).toEqual(...currentObservedResult);
  });
});
```

Run:

```bash
bun run test -- tests/features/theme.test.tsx
```

Expected before intentional change: PASS (characterization) or FAIL (if writing a new expected after agreed fix).

- [ ] **Step 2: Implement the minimal UX-neutral fix for that finding only**

Rules:

- No CSS/class/copy/animation changes unless the finding is an approved P0 with `ux_risk` accepted
- Prefer extract/move inside `src/features/theme` or app shell
- Keep public exports in `src/features/theme/index.ts` stable unless the finding explicitly targets the public API

- [ ] **Step 3: Re-run slice unit tests**

```bash
bun run test -- tests/features/theme.test.tsx tests/app
```

Expected: PASS

- [ ] **Step 4: After all Stage 1 `fix` items are done, run full Stage 1 gate**

```bash
bun run lint
bun run typecheck
bun run test -- tests/features/theme.test.tsx tests/app
bun run test:e2e -- e2e/theme-and-motion.spec.ts e2e/errors.spec.ts
bun run test:visual -- e2e/visual/critical-states.spec.ts
```

Expected: all PASS. If visual fails without intentional UI change, treat as regression — revert or fix cause; do not update snapshots without user OK.

- [ ] **Step 5: Update `S1-theme-shell.md`**

Set each finding decision, set `Gate status: passed`, note deferred ids for Stage 9/10.

- [ ] **Step 6: Commit only if user asks**

If asked, commit **code/tests only** (never add `docs/superpowers/**` unless explicitly requested):

```bash
git add src/features/theme app tests/features/theme.test.tsx tests/app
git commit -m "$(cat <<'EOF'
refactor: clean up theme and app shell without UX changes

EOF
)"
```

On Windows PowerShell without heredoc, use an equivalent non-interactive message form the user prefers, still only when asked.

---

### Task 2A: Stage 2 Pass 1 — Header findings

**Files:**
- Create: `docs/superpowers/reviews/S2-header.md`
- Read: `src/widgets/header/**`, `src/features/nyancat/**`, `src/features/paw/**`

- [ ] **Step 1: Map `'use client'` and widget → feature imports**

```powershell
rg -n "use client" src/widgets/header src/features/nyancat src/features/paw
rg -n "from \"@/features/" src/widgets/header
```

- [ ] **Step 2: Review triad**

Focus: HeaderWidget composition, HeaderNyancat boundary, paint/paw coupling, nav a11y without changing UX.

- [ ] **Step 3: Write `S2-header.md` with pending findings + planned gate**

```bash
bun run lint
bun run typecheck
bun run test -- tests/widgets/HeaderWidget.test.tsx tests/widgets/HeaderNavigation.test.tsx tests/widgets/HeaderChrome.test.tsx tests/features/nyancatUi.test.tsx tests/features/pawUi.test.tsx
bun run test:e2e -- e2e/navigation.spec.ts e2e/recruiter-path.spec.ts
bun run test:visual -- e2e/visual/critical-states.spec.ts
```

- [ ] **Step 4: Stop for user decisions**

---

### Task 2B: Stage 2 Pass 2 — Header fixes

**Files:**
- Modify: only approved header/nyancat/paw paths
- Test: header/nyancat/paw unit tests listed above

- [ ] **Step 1: For each `fix` finding, characterize with unit test if contract changes**
- [ ] **Step 2: Minimal fix, UX-neutral**
- [ ] **Step 3: Run Stage 2 unit subset**
- [ ] **Step 4: Run Stage 2 e2e + visual gate commands from Task 2A**
- [ ] **Step 5: Update `S2-header.md` gate status**
- [ ] **Step 6: Commit only if user asks (code/tests only)**

---

### Task 3A: Stage 3 Pass 1 — About findings

**Files:**
- Create: `docs/superpowers/reviews/S3-about.md`
- Read: `src/widgets/about/**`, `src/shared/config/content/about.ts`

- [ ] **Step 1: Review triad on AboutWidget / AboutView / AboutSpecPanel / content**
- [ ] **Step 2: Note missing dedicated visual coverage as a finding if relevant (`area: tests`, usually P3)**
- [ ] **Step 3: Write `S3-about.md` with pending findings**

Planned gate:

```bash
bun run lint
bun run typecheck
bun run test -- tests/widgets/AboutSpecPanel.test.tsx tests/shared/content.test.ts
bun run test:e2e -- e2e/recruiter-path.spec.ts
```

- [ ] **Step 4: Stop for user decisions**

---

### Task 3B: Stage 3 Pass 2 — About fixes

- [ ] **Step 1–N: Apply each `fix` with tests-first when contracts change**
- [ ] **Step final: Run Stage 3 gate; update `S3-about.md`; commit only if asked**

---

### Task 4A: Stage 4 Pass 1 — Projects findings

**Files:**
- Create: `docs/superpowers/reviews/S4-projects.md`
- Read: `src/widgets/projects/**`, `src/entities/project/**`, `src/shared/lib/deckTransform.ts`

- [ ] **Step 1: Review deck transform purity vs UI hooks (`useProjectDeck`, `ProjectCardDeck`, `ProjectsGrid`)**
- [ ] **Step 2: Check entity vs widget responsibilities for `ProjectCard`**
- [ ] **Step 3: Write `S4-projects.md`**

Planned gate:

```bash
bun run lint
bun run typecheck
bun run test -- tests/widgets/projects.test.tsx tests/widgets/ProjectsGrid.test.tsx tests/widgets/ProjectCardDeck.test.tsx tests/widgets/projectDeck.test.ts tests/widgets/useProjectDeck.test.ts tests/entities/project/ProjectCard.test.tsx tests/shared/deckTransform.test.ts
bun run test:e2e -- e2e/projects-and-timeline.spec.ts
bun run test:visual -- e2e/visual/critical-states.spec.ts
```

- [ ] **Step 4: Stop for user decisions**

---

### Task 4B: Stage 4 Pass 2 — Projects fixes

- [ ] Apply approved fixes with unit characterization for deck math/hooks
- [ ] Run Stage 4 gate; update `S4-projects.md`; commit only if asked

---

### Task 5A: Stage 5 Pass 1 — Skills findings

**Files:**
- Create: `docs/superpowers/reviews/S5-skills.md`
- Read: `src/widgets/skills/**`, `src/features/skills-scroll/**`, `src/features/performance/**` (if imported)

- [ ] **Step 1: Separate motion policy / reduced-motion paths from presentational marquee UI**
- [ ] **Step 2: Review client boundaries for cursor nyancat vs static mobile view**
- [ ] **Step 3: Write `S5-skills.md`**

Planned gate:

```bash
bun run lint
bun run typecheck
bun run test -- tests/widgets/SkillsWidget.test.tsx tests/widgets/SkillsCoverage.test.tsx tests/widgets/SkillMarqueeRow.test.tsx tests/widgets/SkillsCursorNyancat.test.tsx tests/features/sceneMotion.test.ts tests/features/useSceneMotionPolicy.test.ts
bun run test:e2e -- e2e/theme-and-motion.spec.ts
bun run test:visual -- e2e/visual/critical-states.spec.ts
```

- [ ] **Step 4: Stop for user decisions**

---

### Task 5B: Stage 5 Pass 2 — Skills fixes

- [ ] Apply approved fixes; preserve reduced-motion behavior exactly
- [ ] Run Stage 5 gate; update `S5-skills.md`; commit only if asked

---

### Task 6A: Stage 6 Pass 1 — Timeline findings

**Files:**
- Create: `docs/superpowers/reviews/S6-timeline.md`
- Read: `src/widgets/timeline/**`, `src/entities/timeline/**`

- [ ] **Step 1: Review carousel hook purity vs view components**
- [ ] **Step 2: Check entity data (`timeline.ts`) stays framework-agnostic**
- [ ] **Step 3: Write `S6-timeline.md`**

Planned gate:

```bash
bun run lint
bun run typecheck
bun run test -- tests/widgets/TimelineView.test.tsx tests/widgets/TimelineEditorialRail.test.tsx tests/widgets/TimelineStepChips.test.tsx tests/widgets/useTimelineCarousel.test.ts tests/widgets/timelineUtils.test.ts tests/widgets/timelineTypeStyles.test.ts
bun run test:e2e -- e2e/projects-and-timeline.spec.ts
bun run test:visual -- e2e/visual/critical-states.spec.ts
```

- [ ] **Step 4: Stop for user decisions**

---

### Task 6B: Stage 6 Pass 2 — Timeline fixes

- [ ] Apply approved fixes; run Stage 6 gate; update `S6-timeline.md`; commit only if asked

---

### Task 7A: Stage 7 Pass 1 — Contacts findings

**Files:**
- Create: `docs/superpowers/reviews/S7-contacts.md`
- Read: `src/widgets/contacts/**`, `src/entities/contact/**`

- [ ] **Step 1: Review canvas hooks (`useContactDrawing`, `useContactCats`, `useContactLifecycle`) for lifecycle leaks / mixed concerns**
- [ ] **Step 2: Keep paint/paw behavior unchanged; findings must state `ux_risk` carefully**
- [ ] **Step 3: Write `S7-contacts.md`**

Planned gate:

```bash
bun run lint
bun run typecheck
bun run test -- tests/widgets/ContactsWidget.test.tsx tests/widgets/ContactsView.test.tsx tests/widgets/ContactCanvas.test.tsx tests/widgets/ContactsWidgetPaint.test.tsx tests/widgets/CatPaw.test.tsx tests/features/pawUi.test.tsx
bun run test:e2e -- e2e/recruiter-path.spec.ts
bun run test:visual -- e2e/visual/critical-states.spec.ts
```

- [ ] **Step 4: Stop for user decisions**

---

### Task 7B: Stage 7 Pass 2 — Contacts fixes

- [ ] Apply approved fixes with extreme care on canvas timers/listeners
- [ ] Run Stage 7 gate; update `S7-contacts.md`; commit only if asked

---

### Task 8A: Stage 8 Pass 1 — Footer findings

**Files:**
- Create: `docs/superpowers/reviews/S8-footer.md`
- Read: `src/widgets/footer/**`, `src/entities/footer/**`

- [ ] **Step 1: Review FooterSocial / navigation / content boundaries**
- [ ] **Step 2: Write `S8-footer.md`**

Planned gate:

```bash
bun run lint
bun run typecheck
bun run test -- tests/widgets/FooterSocial.test.tsx
bun run test:e2e -- e2e/recruiter-path.spec.ts
```

- [ ] **Step 3: Stop for user decisions**

---

### Task 8B: Stage 8 Pass 2 — Footer fixes

- [ ] Apply approved fixes; run Stage 8 gate; update `S8-footer.md`; commit only if asked

---

### Task 9A: Stage 9 Pass 1 — Shared leftovers findings

**Files:**
- Create: `docs/superpowers/reviews/S9-shared.md`
- Read: `src/shared/config/**`, `src/shared/lib/**`, `src/shared/styles/**`, `src/shared/ui/**`
- Also collect every `decision: defer` from `S1`–`S8` that targets shared/cross-cutting debt

- [ ] **Step 1: Aggregate deferred cross-cutting findings into S9 ids (new ids, link back to origin)**
- [ ] **Step 2: Review shared UI primitives and lib helpers for duplication / boundary leaks**
- [ ] **Step 3: Write `S9-shared.md` with pending decisions**

Planned gate (adjust unit list to touched files):

```bash
bun run lint
bun run typecheck
bun run test -- tests/shared
bun run test:e2e -- e2e/recruiter-path.spec.ts
```

If shared UI visuals changed (should be rare): also run `bun run test:visual -- e2e/visual/critical-states.spec.ts`.

- [ ] **Step 4: Stop for user decisions**

---

### Task 9B: Stage 9 Pass 2 — Shared fixes

- [ ] Apply approved shared fixes; run Stage 9 gate; update `S9-shared.md`; commit only if asked

---

### Task 10: Stage 10 — Closeout

**Files:**
- Create: `docs/superpowers/reviews/S10-closeout.md`

- [ ] **Step 1: Run full verification suite**

```bash
bun run lint
bun run typecheck
bun run test
bun run test:e2e
bun run test:visual
```

Expected: all PASS.

- [ ] **Step 2: Write closeout report**

Include:

- Counts of `fix` / `defer` / `wontfix` across S1–S9
- Remaining risks (explicit)
- Intentionally untouched areas
- Confirmation that UX/behavior were preserved

Template:

```markdown
# Stage S10 — Closeout

## Totals
- fix:
- defer:
- wontfix:

## Full gate
- lint:
- typecheck:
- unit:
- e2e:
- visual:

## Residual risks
- ...

## Explicitly out of scope leftovers
- ...
```

- [ ] **Step 3: Present closeout summary to the user**
- [ ] **Step 4: Commit/PR only if the user asks**

---

## Global execution rules (every task)

1. **Hard UX freeze:** no intentional visual/copy/animation/gesture changes unless approved P0 with accepted `ux_risk`.
2. **Out-of-slice:** create a `defer` finding pointing at the target stage; do not fix now.
3. **No doc commits** unless explicitly requested.
4. **No code commits** unless explicitly requested.
5. **Snapshot updates** require explicit user OK.
6. Prefer Context7 Next.js docs when judging Server vs Client Component boundaries.

---

## Self-review (plan vs spec)

| Spec requirement | Plan coverage |
|------------------|---------------|
| Mode B audit + cleanup | Tasks 1B–9B |
| Vertical slices + triad | Tasks 1A–9A |
| Gate lint/typecheck/unit/e2e/visual | Each Pass 2 + Task 10 |
| Top-to-bottom order | Task order 1→8 then shared/closeout |
| Two-pass + user approval gates | A tasks stop; B tasks after decisions |
| Local docs / no commit noise | Docs policy + commit steps gated on user ask |
| Stages 0–10 | Tasks 0–10 |
| Finding schema / severity | Task 0 template + Pass 1 files |
| Out of scope redesign/migrations | Global execution rules |

No TBD/TODO placeholders remain in executable steps. Pass 2 code samples are intentionally characterization-oriented because concrete fixes are discovery-driven from Pass 1 findings.
