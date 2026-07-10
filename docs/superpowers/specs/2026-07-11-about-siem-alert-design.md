# Design: About section as SIEM-style alert shell

**Date:** 2026-07-11  
**Status:** Ready for planning  
**Scope:** Restyle the About panel only — MaxPatrol-inspired *structure*, Bauhaus/mint tokens

## Problem

The About section already carries InfoSec content (`about.ts`), but its default face is a decorative TypeScript code panel (`AboutSpecPanel`). For a SOC / AppSec audience, a SIEM-style alert chrome (metadata rows, severity badge, narrative, tagged principles) reads more on-role than a faux source file — without abandoning the existing code view as a secondary “Raw” face.

## Goals

- Present About as a **SIEM alert shell** (structure inspired by MaxPatrol-class alert detail), using the site’s existing Bauhaus hard borders and mint (`primary-500` / `#00ffb9`) tokens.
- Default face = Alert; Raw face = current `about.ts` code view.
- Preserve screen-reader narrative contract; no duplicate SR content.
- Micro-motion only; no layout shift (CLS).

## Non-goals

- Other page sections (Projects, Skills, Timeline, Contacts, Header)
- Real SIEM integration, live alerts, or MaxPatrol branding/assets
- Neon / cyberpunk / Matrix aesthetic (glow stacks, CRT scanlines, CRITICAL theater)
- Font family changes or new typefaces
- i18n / English copy
- Changing About section order, anchors, or `SectionHeader` role

## Decisions (locked)

| Topic | Choice |
| --- | --- |
| Goal | Restyle About as SIEM-style alert shell; Bauhaus/mint tokens |
| Visual fidelity | **A — structure only**: alert chrome, metadata table, narrative block, tagged list; no neon/cyber palette |
| Content map | **A**: `spec.fields` → metadata rows; `body` → narrative; `principles` → tagged list |
| Panel mode | **Hybrid C**: default **Alert** face; **Raw** tab = current `AboutSpecPanel` code view |
| Severity metaphor | **C — light**: badge label `Informational` (role flavor, not CRITICAL theater); alert id e.g. `ABOUT-KTKV` |
| Architecture approach | **1**: Alert shell over/replacing the default face of the About panel; keep `SectionHeader` light (eyebrow + title unchanged) |
| Components | `AboutView` shell unchanged; new `AboutAlertPanel`; reuse code view as Raw; client tab state |
| a11y | Preserve sr-only narrative contract; tabs/`aria` for Raw; no duplicate for SR |
| Motion | Micro 180–260ms; `prefers-reduced-motion` safe; no CLS |
| Content | Optionally extend `about.ts` with `alertId` + `severity` fields |
| Testing | Update About widget/panel tests |
| ui-ux-pro-max | Prefer SIEM **metadata chrome** over a cyber palette that would clash with Bauhaus |

## Architecture

Feature-Sliced layout stays the same. Only the About widget’s panel face changes.

```
src/shared/config/content/about.ts   → source of truth (+ optional alertId, severity)
src/widgets/about/
  AboutWidget.tsx                    → unchanged (renders AboutView)
  ui/AboutView.tsx                   → Section + SectionHeader + panel host (unchanged shell)
  ui/AboutAlertPanel.tsx             → NEW: client panel with Alert | Raw tabs
  ui/AboutSpecPanel.tsx              → keep as Raw face (current code view)
  ui/index.ts                        → export AboutAlertPanel
```

### Approach 1 (chosen)

- `AboutView` continues to own `#about`, spacing, background, and `SectionHeader` (`eyebrow="Обо мне"`, `title={aboutContent.title}`).
- Replace `<AboutSpecPanel />` in `AboutView` with `<AboutAlertPanel />`.
- `AboutAlertPanel` is a small client component that:
  1. Renders alert chrome (title bar, severity, id, tabs).
  2. Default tab **Alert**: metadata from `spec.fields`, narrative from `body`, tagged principles.
  3. Tab **Raw**: mounts existing `AboutSpecPanel` (or extracts its decorative code block) so the current code aesthetic remains available.
- Tab state is local React state (`useState<"alert" | "raw">`); no URL sync required for this scope.

### Why not other approaches

- Full replacement without Raw would drop the existing code-panel craft that already matches Bauhaus mono styling.
- Dual always-visible panels would fight the “one composition” About block and risk duplicate SR content.
- A real SIEM embed is out of scope and would fight the static content model.

## Content mapping

| Source (`aboutContent`) | Alert face | Raw face |
| --- | --- | --- |
| `spec.fields[]` `{ key, value }` | Metadata rows (key column mono/muted, value column primary text) | Existing object fields in code block |
| `body` | Narrative block (mint left border accent) | Existing JSDoc-style comment lines |
| `principles[]` `{ type, text }` | Tagged list (`type` as hard-border tag + text) | Existing `> type: text` lines |
| `spec.fileName` / `exportName` | Optional chrome hint on tab bar (e.g. `about.ts`); not a second narrative | File tab label + export as today |
| `alertId` (optional, default `ABOUT-KTKV`) | Title-bar id | Not required in Raw |
| `severity` (optional, default `Informational`) | Title-bar badge | Not required in Raw |

### Optional content fields

Extend `about.ts` with explicit chrome fields so copy stays data-driven:

```ts
// Conceptual shape — exact typing in implementation plan
alertId: "ABOUT-KTKV",
severity: "Informational",
```

If omitted at first, the panel may hardcode the same defaults; preferred path is to add them to `aboutContent` and assert them in `tests/shared/content.test.ts`.

**Alert title bar subject line:** derive from existing fields — e.g. `{name} · {role}` from `spec.fields` (`Арсений Котиков · SOC / AppSec`). Do not invent a separate headline string unless content later adds one.

## Visual design

### Tokens (existing only)

- Borders: hard black/white Bauhaus (`border-2`, `border-black` / `dark:border-white`)
- Accent: mint `primary-500` (`#00ffb9`) for active tab, status dot, narrative left rule, selected principle tag fill
- Surfaces: white / black panel backgrounds consistent with current About code panel and site dark mode
- Shadow: optional hard offset (`shadow-[4px_4px_0_…]`) matching other Bauhaus chrome — not soft glow

### Fidelity A — what “SIEM structure” means here

Include:

1. **Title bar** — “Alert” label + subject + `Informational` badge + `ABOUT-KTKV`
2. **Tab strip** — Alert | Raw
3. **Metadata table** — key/value rows from `spec.fields`
4. **Narrative** — `body` prose
5. **Principles** — tagged list

Exclude:

- Neon gradients, scanlines, terminal green-on-black as the primary look
- Fake CRITICAL / HIGH severity theater
- Fake timestamps, IOC tables, MITRE matrices, or operator action buttons
- New fonts

### ui-ux-pro-max note

Prefer **metadata chrome** (table rows, severity badge, alert id, tab strip) as the SIEM signal. Do not introduce a cyber palette that clashes with Bauhaus + mint. Mint remains the single accent; black/white remain structure.

## Component responsibilities

### `AboutView` (unchanged shell)

- `Section` + `SectionHeader` only.
- Hosts `AboutAlertPanel` instead of bare `AboutSpecPanel`.

### `AboutAlertPanel` (new, client)

- Owns tab state and alert chrome.
- Alert face: semantic structure suitable for sighted users (table or definition list for metadata; prose for narrative; list for principles).
- Raw face: render `AboutSpecPanel` (preferred reuse) so Raw stays pixel-faithful to today’s panel.
- Max width remains `max-w-[75ch]` to match current About panel.

### `AboutSpecPanel` (Raw)

- Keep current decorative code view and its `figure` / `figcaption.sr-only` / `aria-hidden` decorative block contract when used standalone.
- When mounted under Raw, coordinate a11y with the parent so narrative is not announced twice (see Accessibility).

## Accessibility

Locked contract:

1. **Screen readers get the narrative once** — body + principles (and metadata keys/values as appropriate), not twice via Alert face + Raw `figcaption`.
2. **Preserve the existing sr-only narrative intent** currently implemented as `figcaption.sr-only` on `AboutSpecPanel`.
3. **Tabs** use proper tab semantics: `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, associated `role="tabpanel"`, keyboard support (arrow keys and/or standard tab focus — pick one pattern in the plan and test it).
4. **No duplicate for SR:**
   - Preferred: single sr-only summary on the panel host (or Alert face uses real readable text and Raw’s decorative code stays `aria-hidden` without a second `figcaption` when nested).
   - Explicit rule: when Raw is active, do not expose a second full copy of `body` + principles to AT if Alert already did (or vice versa). Implementation may (a) lift the sr-only caption to `AboutAlertPanel` and strip/suppress it inside nested `AboutSpecPanel`, or (b) keep caption only on Raw and make Alert face the sole visible+accessible text when Alert is selected — choose one in the plan; both must satisfy “announce once.”
5. Decorative chrome (status dot, hard borders) is `aria-hidden` where it adds no meaning beyond the text labels.

## Motion

- Tab / face switch: opacity or similar micro-transition **180–260ms**.
- Honor `prefers-reduced-motion: reduce` → instant swap (`motion-reduce:transition-none` or equivalent).
- **No CLS:** both faces share the same outer chrome width; avoid height collapse that shoves `SectionHeader` or following sections. Prefer min-height on the panel body equal to the taller face, or accept natural height change only inside the panel without shifting siblings via absolute tricks that clip content. Absolute cross-fade of both faces is allowed only if the container height is reserved to the max of both.

## Testing

Update / extend:

| File | Expectation |
| --- | --- |
| `tests/widgets/AboutSpecPanel.test.tsx` | Keep Raw/code a11y contract (sr-only + `aria-hidden` decorative block), adjusting if caption ownership moves to the parent |
| `tests/widgets/WidgetShells.test.tsx` (`AboutWidget`) | Still finds about heading; optionally assert Alert chrome / tab labels |
| New or extended panel tests | Default tab is Alert; switching to Raw shows code export name; severity/id visible; no duplicate sr-only narrative when both faces exist in the tree |
| `tests/shared/content.test.ts` | If `alertId` / `severity` are added, assert defaults (`ABOUT-KTKV`, `Informational`) |

## Out of scope (explicit)

- Restyling Projects, Skills, Experience, Contacts, or global theme
- Live SIEM data, auth, or MaxPatrol product UI cloning beyond structural metaphor
- Neon/cyber visual language, CRITICAL severity theater
- Font changes, i18n, new About copy rewrite (content pivot already landed; this is chrome)
- URL-synced tab state, shareable deep links to Raw

## Implementation sketch (for the plan — not code yet)

1. Optionally add `alertId` + `severity` to `about.ts` and content tests.
2. Add `AboutAlertPanel` client component with Alert chrome + tabs.
3. Wire Alert face to `spec.fields` / `body` / `principles`.
4. Mount existing `AboutSpecPanel` as Raw; resolve single SR narrative ownership.
5. Swap `AboutView` child from `AboutSpecPanel` to `AboutAlertPanel`.
6. Export from `ui/index.ts`.
7. Update widget/panel tests; run About-related Vitest suite.
8. Visual check light + dark, reduced-motion, mobile width.

## Success criteria

- Sighted users see an Informational alert shell by default with metadata, narrative, and tagged principles in Bauhaus/mint.
- Raw tab restores the current `about.ts` code panel.
- AT users hear the about narrative once.
- No neon/CRITICAL aesthetic; no font or i18n changes; no other sections touched.
- Tests cover Alert default, Raw reuse, and a11y contract.

## Self-review

- No TBD/TODO placeholders remain; optional content fields have explicit defaults.
- No contradictions: Hybrid C + Approach 1 + Fidelity A + Severity Informational are aligned.
- Scope is a single About-panel implementation plan.
- Ambiguities resolved: subject line from `name` + `role`; SR duplication handled by a single-ownership rule; motion bounds and CLS constraints stated; out-of-scope list explicit.
