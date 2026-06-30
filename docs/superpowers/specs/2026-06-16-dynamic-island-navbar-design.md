# Dynamic Island Navbar — Design Spec

**Date:** 2026-06-16  
**Status:** Approved (brainstorming)  
**Scope:** Desktop (`lg+`) navbar morph on scroll

## Goal

On desktop, when the user scrolls the portfolio page, the full-width header navigation smoothly morphs into a centered floating "Dynamic Island" capsule at the top of the viewport — inspired by iOS Dynamic Island behavior. Mobile navigation remains unchanged.

## Decisions Summary

| Topic          | Choice                                                                                  |
| -------------- | --------------------------------------------------------------------------------------- |
| Island content | **B** — Mini-navbar: all links remain visible inside the capsule (compact font/spacing) |
| Hover behavior | **C** — Slight expansion (padding/gap ×1.15), stays centered capsule                    |
| Scroll morph   | **C** — Two-phase: light compression immediately, full island after ~100px              |
| Implementation | **Approach 1** — CSS custom properties driven by `useNavMorph` scroll hook              |

## Current State

- `HeaderNavigation` lives inside `HeaderWidget` (`#header`, `min-h-screen`).
- Header uses `position: absolute; inset-x: 0; top: 0`.
- On scroll, the navbar scrolls away with the hero — it is not persistent.
- Desktop layout: logo left, 6 nav links center, "Связаться" + theme toggle right.
- Mobile: burger menu via Headless UI Dialog — out of scope.
- No animation library (Framer Motion); existing pattern uses `requestAnimationFrame` in `useScrollParallax`.

## Architecture

### Scroll phases

```
scrollY = 0        → full-width bar (transparent, current layout)
scrollY 0–40px     → phase 1: padding compresses, blur begins
scrollY 40–120px   → phase 2: pill shape, glass background, centering
scrollY > 120px    → island locked (progress = 1)
scrollY → 0        → reverse morph
```

### Positioning

On `lg+`, change header to `position: fixed; top: 0; inset-x: 0; z-50` so the navbar persists across the entire single-page scroll. `fixed` is viewport-relative, so it works even though the component is rendered inside `HeaderWidget`.

Below `lg`, keep current `absolute` positioning and mobile burger menu.

### New hook: `useNavMorph`

**Location:** `src/features/scrolling/useNavMorph.ts`

**Returns:**

```ts
{
  progress: number; // 0..1 continuous morph value
  phase: 0 | 1 | 2; // discrete phase for debugging/tests
  isIsland: boolean; // progress >= 1 (or threshold ~0.95)
}
```

**Scroll mapping:**

- `0–40px` → progress `0 → 0.4` (phase 1)
- `40–120px` → progress `0.4 → 1.0` (phase 2)
- `> 120px` → progress `1.0`

**Implementation:**

- `window` scroll listener with `{ passive: true }`
- Coalesce updates via `requestAnimationFrame` (same pattern as `useScrollParallax`)
- Only active when `window.matchMedia('(min-width: 1024px)')` matches (Tailwind `lg`)

### Component changes: `HeaderNavigation`

Apply morph via CSS custom properties on the `<nav>` or a wrapper `<div>`:

```css
--nav-morph: 0.1;
--nav-radius: interpolate(0px → 9999px);
--nav-blur: interpolate(0px → 20px);
--nav-bg-opacity: interpolate(0 → 0.7);
--nav-padding-x: interpolate(32px → 16px);
--nav-padding-y: interpolate(24px → 8px);
--nav-top: interpolate(0px → 12px);
--nav-gap: interpolate(48px → 8px);
```

The nav container morphs from full-width flex layout to `width: fit-content; margin: 0 auto` as progress approaches 1.

Export hook from `src/features/scrolling/index.ts`.

## Visual Design

### Top state (progress = 0)

- Transparent background, no blur, no shadow
- Full-width: `p-6 lg:px-8`
- `border-radius: 0`
- Current typography: `text-sm/6`

### Island state (progress = 1)

- Centered capsule: `width: fit-content; margin: 0 auto`
- `border-radius: 9999px`
- Glass effect:
  - Light: `bg-white/70 backdrop-blur-xl border border-black/8`
  - Dark: `bg-black/50 backdrop-blur-xl border border-white/10`
- Shadow: `shadow-lg shadow-black/10`
- Top offset: `12px` from viewport top
- Compact: `text-xs`, `gap-2`, `px-4 py-2`

### Interpolation curve (phase 1 → 2)

| Property      | progress 0 | progress 0.4 | progress 1 |
| ------------- | ---------- | ------------ | ---------- |
| border-radius | 0          | 8px          | 9999px     |
| backdrop-blur | 0          | 8px          | 20px       |
| bg opacity    | 0          | 0.4          | 0.7        |
| padding-y     | 24px       | 16px         | 8px        |
| padding-x     | 32px       | 20px         | 16px       |
| top offset    | 0          | 8px          | 12px       |
| link gap      | 48px       | 16px         | 8px        |

Use `ease-out` feel via CSS `transition` on properties that change on hover only; scroll-driven properties update every frame without CSS transition (avoid lag).

### Hover (progress > 0.8 only)

- Multiply padding and gap by `1.15`
- Slightly stronger shadow
- `transition: 200ms ease-out`
- Capsule stays centered — does not expand to full-width

### Active section indicator (optional, post-MVP)

- `useActiveSection` with Intersection Observer on `#header`, `#about`, `#projects`, `#skills`, `#experience`, `#contacts`
- `rootMargin: -40% 0px -40% 0px`
- Active link: primary color + `●` prefix
- Not required for initial implementation

## Accessibility

- Preserve `nav` + `aria-label="Global"`
- Keep native `<a>` links for keyboard focus
- Hover expansion does not affect tab order
- `prefers-reduced-motion: reduce`:
  - Binary switch at 60px threshold (no intermediate frames)
  - Replace `backdrop-blur` with solid background (`bg-white` / `bg-black`)

## Performance

- Passive scroll listener + rAF batching
- Single element receives CSS custom properties — minimal React re-renders
- `will-change: transform, border-radius` only when `0 < progress < 1`
- Disable morph calculations below `lg` breakpoint

## Testing

### Unit tests (`useNavMorph.test.ts`)

| scrollY | Expected progress | Expected phase |
| ------- | ----------------- | -------------- |
| 0       | 0                 | 0              |
| 20      | 0.2               | 1              |
| 60      | 0.6               | 2              |
| 120     | 1.0               | 2              |
| 200     | 1.0               | 2              |

Mock `window.scrollY` and `matchMedia`.

### Manual QA

- [ ] Morph forward on scroll, reverse on scroll to top
- [ ] Hover expansion on island state
- [ ] Dark mode glass appearance
- [ ] `prefers-reduced-motion` fallback
- [ ] Mobile `< lg` — no regression on burger menu
- [ ] Nav links still anchor to correct sections while fixed
- [ ] Theme toggle works in island state
- [ ] Paw drawing interaction (`data-draw-allow`) still works on nav links

## Files to Change

| File                                         | Action                                        |
| -------------------------------------------- | --------------------------------------------- |
| `src/features/scrolling/useNavMorph.ts`      | Create                                        |
| `src/features/scrolling/useNavMorph.test.ts` | Create                                        |
| `src/features/scrolling/index.ts`            | Export new hook                               |
| `src/widgets/header/ui/HeaderNavigation.tsx` | Morph styles, fixed positioning on lg+        |
| `app/globals.css`                            | Reduced-motion fallback utilities (if needed) |

## Out of Scope

- Mobile dynamic island
- Framer Motion or new animation dependencies
- Moving `HeaderNavigation` to root layout (fixed positioning makes this unnecessary)
- Active section indicator (optional follow-up)

## References

- Brainstorming visual companion: option B selected
- Existing scroll pattern: `src/features/scrolling/useScrollParallax.ts`
- Navigation config: `src/shared/config/content/navigation.ts`
