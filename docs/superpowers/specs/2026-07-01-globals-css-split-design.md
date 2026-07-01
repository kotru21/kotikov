# globals.css Split — Tailwind v4 Structure (B1 Hybrid)

**Date:** 2026-07-01  
**Status:** Approved for planning  
**Approach:** B (clean v4 structure) + B1 (colors stay in `tailwind.config.ts`)

## Problem

`app/globals.css` (~285 lines) mixes unrelated concerns:

- Tailwind entry and `@custom-variant dark`
- Runtime CSS variables for theme/nav island
- Base resets (`body`, cursor)
- Dead animation code (unused `@keyframes` + `.animate-*` classes)
- Duplicate keyframes vs `tailwind.config.ts`
- Feature-specific marquee animations
- Scrollbar and `prefers-reduced-motion` overrides
- Questionable global `will-change` on all animated elements

Tailwind v4 recommends `@theme` for design tokens and `@import` chains for organization. This project also uses `colors.ts` heavily in JavaScript (canvas, inline styles) — palette must remain in TypeScript.

## Goals

1. Thin `globals.css` entry with `@import` partials under `src/shared/styles/tailwind/`
2. Remove dead CSS and duplication
3. Move animations and `@custom-variant` into CSS partials
4. **Keep** `tailwind.config.ts` as source for colors/fonts via `colors.ts` import
5. Keep runtime theme vars (`--background`, `--nav-island-*`) separate from Tailwind tokens

## Non-Goals

- Removing `tailwind.config.ts` or `@config`
- Syncing `colors.ts` ↔ CSS via codegen (future work)
- Moving widget-specific inline styles (`HeaderNyancat`, `not-found`) in this pass
- Changing theme flash prevention (`themeInitScript.ts`, `ThemeProvider`)

## Target Structure

```
app/globals.css                              # entry only (~10 lines)
src/shared/styles/tailwind/
  ├── theme.css                              # @theme: animations + keyframes only
  ├── dark-mode.css                          # @custom-variant + runtime CSS vars
  ├── base.css                               # body, cursor, scroll
  ├── a11y.css                               # prefers-reduced-motion
  └── scrollbar.css                          # webkit scrollbar (optional)
tailwind.config.ts                           # unchanged role: content + colors.ts
src/shared/styles/colors.ts                  # unchanged: JS runtime palette
```

### `app/globals.css`

```css
@import "tailwindcss";
@config "../tailwind.config.ts";

@import "../src/shared/styles/tailwind/theme.css";
@import "../src/shared/styles/tailwind/dark-mode.css";
@import "../src/shared/styles/tailwind/base.css";
@import "../src/shared/styles/tailwind/a11y.css";
@import "../src/shared/styles/tailwind/scrollbar.css";
```

`@config` stays — B1 keeps `theme.extend` in TypeScript.

### `theme.css` — animations only

Per Tailwind v4 docs, define animations inside `@theme`:

```css
@theme {
  --animate-scroll-left: scroll-left-infinite linear infinite;
  --animate-scroll-right: scroll-right-infinite linear infinite;

  @keyframes scroll-left-infinite { /* from current globals.css */ }
  @keyframes scroll-right-infinite { /* from current globals.css */ }
}
```

Optionally migrate existing `tailwind.config.ts` keyframes (`fade-in-up`, `fade-in`, `slide-in-left`, `pulse-glow`) into `@theme` and remove them from `theme.extend` — they are currently unused in components but available as utilities if needed later.

**Remove from globals.css:**

- Manual `.animate-*` utility classes
- Unused keyframes: `shimmer`, `cardPulse`, `skillFloat`
- `.preserve-3d`, `.backface-hidden`
- Global `will-change` block on animated selectors

### `dark-mode.css` — two layers

**Layer A — Tailwind infrastructure:**

```css
@custom-variant dark {
  &:where(.dark, .dark *) { @slot; }
  @media (prefers-color-scheme: dark) {
    &:where(:not(.light, .light *)) { @slot; }
  }
}
```

**Layer B — runtime vars** (for `body` + `navIslandStyle.ts`, not Tailwind utilities):

- `:root` light values
- `@media (prefers-color-scheme: dark) { :root:not(.light) { ... } }`
- `.dark { ... }` explicit dark overrides

Must stay in sync with `themeInitScript.ts` and `ThemeProvider.applyChoice()`.

### `base.css`

- `body { background, color, font-family, overflow-x }`
- Interactive element cursor resets
- `html { scroll-behavior: smooth; scroll-padding-top: var(--nav-anchor-offset) }`

### `a11y.css`

Move `prefers-reduced-motion: reduce` block unchanged.

### `scrollbar.css`

Move webkit scrollbar rules; keep `.dark` selectors (class-based, not `@media`).

## Component Changes

### `SkillMarqueeRow.tsx`

Replace dynamic class construction (invisible to Tailwind scanner):

```tsx
// Before
className={`flex gap-6 animate-${animationDirection}`}

// After
className={direction === "left" ? "flex gap-6 animate-scroll-left" : "flex gap-6 animate-scroll-right"}
```

Apply same pattern to the second `className` in the file.

## `tailwind.config.ts` — B1 Hybrid

**Keep:**

- `content` paths
- `theme.extend.colors` from `colors.ts`
- `theme.extend.fontFamily`

**Remove after migration to `@theme`:**

- `theme.extend.animation` and `theme.extend.keyframes` (if moved to `theme.css`)

**Do not remove** `@config` directive from `globals.css`.

## Migration Steps

1. Create `src/shared/styles/tailwind/` partials; move CSS blocks per structure above
2. Add `@theme` animations in `theme.css`
3. Slim `globals.css` to import chain
4. Delete dead CSS (unused keyframes, manual `.animate-*`, `will-change` block, 3D utilities)
5. Update `SkillMarqueeRow` class names
6. Remove duplicate keyframes from `tailwind.config.ts` if moved to `@theme`
7. Run `bun run build` and `bun run test`
8. Manual smoke: skills marquee, dark/light toggle, nav island scroll, reduced-motion

## Testing

| Check | How |
|-------|-----|
| Build | `bun run build` — Tailwind must resolve all utilities |
| Unit tests | `bun run test` — no regressions |
| Marquee | Skills section animates left/right rows |
| Theme | No flash; nav island rgba vars work while scrolling |
| a11y | `prefers-reduced-motion: reduce` disables animations |
| Dead code | Grep confirms removed classes are not referenced |

## Risks

| Risk | Mitigation |
|------|------------|
| `@import` path resolution | Use paths relative to `globals.css`; verify in build |
| Dynamic `animate-*` missed by scanner | Explicit class names in `SkillMarqueeRow` |
| Runtime vars out of sync with theme JS | No changes to `ThemeProvider` / `themeInitScript` in this pass |
| Colors drift between `colors.ts` and CSS | Document in `theme.css` header: colors live in `tailwind.config.ts` only |

## Success Criteria

- `globals.css` ≤ 15 lines
- No duplicate keyframes between CSS partials and `tailwind.config.ts`
- No unused animation CSS in bundle
- `tailwind.config.ts` retains colors via `colors.ts`
- All existing tests pass; visual behavior unchanged
