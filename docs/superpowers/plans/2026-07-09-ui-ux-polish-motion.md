# UI/UX Polish Wave 2 — Visual and Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Унифицировать Bauhaus visual system и запускать непрерывные signature effects только в активной, видимой сцене.

**Architecture:** `features/performance` получает чистую motion policy, document-visibility hook, scene-level IntersectionObserver hook и reusable rAF lifecycle. Никакого глобального store: Header, Skills и Contacts владеют собственными scene refs, а тяжёлые эффекты получают boolean `isMotionActive`.

**Tech Stack:** React 19 hooks, Next.js 16, TypeScript 6, Tailwind CSS 4, CSS custom properties, IntersectionObserver, Page Visibility API, requestAnimationFrame, Vitest/Testing Library.

**Depends on:** завершённый Wave 1 и сохранённый production baseline.

---

## File map

**Create**

- `src/features/performance/model/sceneMotion.ts` — pure policy and types.
- `src/features/performance/useDocumentVisibility.ts` — Page Visibility subscription.
- `src/features/performance/useSceneIntersection.ts` — isolated IntersectionObserver lifecycle.
- `src/features/performance/useSceneMotionPolicy.ts` — settings composition.
- `src/features/performance/useRafWhile.ts` — cancellable rAF lifecycle.
- `tests/features/sceneMotion.test.ts`
- `tests/features/useDocumentVisibility.test.tsx`
- `tests/features/useSceneMotionPolicy.test.tsx`
- `tests/features/useRafWhile.test.tsx`
- `tests/widgets/SkillMarqueeRow.test.tsx`
- `tests/widgets/SkillsCursorNyancat.test.tsx`
- `tests/widgets/HeaderWidget.test.tsx`
- `tests/widgets/ContactsWidget.test.tsx`
- `tests/shared/Button.test.tsx`
- `tests/shared/Card.test.tsx`

**Modify**

- `src/features/performance/index.ts`
- `src/shared/styles/tailwind/dark-mode.css`
- `src/shared/styles/tailwind/a11y.css`
- `src/shared/ui/Button/Button.tsx`
- `src/shared/ui/Card/Card.tsx`
- `src/shared/ui/Section/Section.tsx`
- `src/shared/ui/SectionHeader/SectionHeader.tsx`
- `tests/shared/section.test.tsx`
- `src/widgets/skills/ui/SkillMarqueeRow.tsx`
- `src/widgets/skills/ui/SkillsMarquee.tsx`
- `src/widgets/skills/ui/SkillsMobileView.tsx`
- `src/widgets/skills/ui/SkillsDesktopView.tsx`
- `src/widgets/skills/ui/SkillsCursorNyancat.tsx`
- `src/widgets/header/HeaderWidget.tsx`
- `src/widgets/header/ui/HeaderNavigation.tsx`
- `src/widgets/header/ui/HeaderNyancat.tsx`
- `src/features/nyancat/ui/FlyingNyancat.tsx`
- `src/features/nyancat/types/index.ts`
- `src/features/nyancat/ui/NyancatImage.tsx`
- `src/features/nyancat/ui/InteractionOverlay.tsx`
- `src/features/nyancat/ui/RainbowTrail.tsx`
- `src/widgets/contacts/ContactsWidget.tsx`
- `src/widgets/contacts/ui/ContactsView.tsx`
- `src/shared/config/content/contact.ts`
- `tests/shared/content.test.ts`
- `src/widgets/about/ui/AboutView.tsx`
- `src/entities/project/ui/ProjectCard.tsx`
- `src/widgets/timeline/ui/TimelineEditorialCard.tsx`

---

### Task 1: Define the pure scene-motion policy

**Files:**

- Create: `src/features/performance/model/sceneMotion.ts`
- Create: `tests/features/sceneMotion.test.ts`
- Modify: `src/features/performance/index.ts`

- [ ] **Step 1: Write the failing truth-table tests**

```ts
import { resolveSceneMotion } from "@/features/performance";

const baseInput = {
  reducedMotion: false,
  lowPerformance: false,
  isInView: true,
  isDocumentVisible: true,
  dominantEffect: "marquee" as const,
};

it("allows the dominant continuous effect in an active scene", () => {
  expect(resolveSceneMotion(baseInput).canRunContinuous).toBe(true);
});

it.each([
  { reducedMotion: true },
  { lowPerformance: true },
  { isInView: false },
  { isDocumentVisible: false },
  { dominantEffect: "none" as const },
])("blocks continuous motion for %o", (override) => {
  expect(resolveSceneMotion({ ...baseInput, ...override }).canRunContinuous).toBe(false);
});
```

- [ ] **Step 2: Run and confirm RED**

```powershell
bun test tests/features/sceneMotion.test.ts
```

- [ ] **Step 3: Implement the strict types and resolver**

```ts
export type DominantEffect = "paint" | "flying-nyancat" | "marquee" | "cursor-nyancat" | "none";

export interface SceneMotionInput {
  reducedMotion: boolean;
  lowPerformance: boolean;
  isInView: boolean;
  isDocumentVisible: boolean;
  dominantEffect: DominantEffect;
}

export interface SceneMotionState extends SceneMotionInput {
  canRunContinuous: boolean;
}

export function resolveSceneMotion(input: SceneMotionInput): SceneMotionState {
  const canRunContinuous =
    !input.reducedMotion &&
    !input.lowPerformance &&
    input.isInView &&
    input.isDocumentVisible &&
    input.dominantEffect !== "none";

  return { ...input, canRunContinuous };
}
```

Export the type and function from `src/features/performance/index.ts`.

- [ ] **Step 4: Run the test**

```powershell
bun test tests/features/sceneMotion.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/features/performance tests/features/sceneMotion.test.ts
git commit -m "feat: add scene motion policy"
```

---

### Task 2: Track document visibility and scene intersection

**Files:**

- Create: `src/features/performance/useDocumentVisibility.ts`
- Create: `src/features/performance/useSceneIntersection.ts`
- Create: `src/features/performance/useSceneMotionPolicy.ts`
- Create: `tests/features/useDocumentVisibility.test.tsx`
- Create: `tests/features/useSceneMotionPolicy.test.tsx`
- Modify: `src/features/performance/index.ts`

- [ ] **Step 1: Write the failing visibility-hook test**

Use a tiny probe:

```tsx
function VisibilityProbe(): React.JSX.Element {
  const isVisible = useDocumentVisibility();
  return <output>{String(isVisible)}</output>;
}

it("updates when document visibility changes", () => {
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    value: "hidden",
  });
  render(<VisibilityProbe />);
  expect(screen.getByText("false")).toBeInTheDocument();

  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    value: "visible",
  });
  fireEvent(document, new Event("visibilitychange"));
  expect(screen.getByText("true")).toBeInTheDocument();
});
```

- [ ] **Step 2: Implement `useDocumentVisibility`**

```ts
export function useDocumentVisibility(): boolean {
  const readVisibility = (): boolean =>
    typeof document === "undefined" || document.visibilityState !== "hidden";
  const [isVisible, setIsVisible] = useState(readVisibility);

  useEffect(() => {
    const handleVisibilityChange = (): void => setIsVisible(readVisibility());
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return isVisible;
}
```

- [ ] **Step 3: Write the failing scene-hook test**

Provide a deterministic `IntersectionObserver` mock whose callback can be invoked:

```tsx
function SceneProbe(): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const motion = useSceneMotionPolicy(ref, { dominantEffect: "marquee" });

  return (
    <div ref={ref}>
      <output>{String(motion.canRunContinuous)}</output>
    </div>
  );
}
```

Assert initial `false`, intersecting `true`, and hidden document `false`. Mock `usePerformanceSettings` with `reducedMotion: false` and `lowPerformance: false`.

- [ ] **Step 4: Implement the focused intersection hook**

```ts
export interface SceneIntersectionOptions {
  rootMargin?: string;
  threshold?: number | number[];
}

export function useSceneIntersection(
  sceneRef: React.RefObject<Element | null>,
  { rootMargin = "0px", threshold = 0.15 }: SceneIntersectionOptions
): boolean {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const scene = sceneRef.current;
    if (scene === null) return;

    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      rootMargin,
      threshold,
    });
    observer.observe(scene);
    return () => observer.disconnect();
  }, [rootMargin, sceneRef, threshold]);

  return isInView;
}
```

- [ ] **Step 5: Compose the short scene policy hook**

```ts
export interface UseSceneMotionPolicyOptions extends SceneIntersectionOptions {
  dominantEffect: DominantEffect;
}

export function useSceneMotionPolicy(
  sceneRef: React.RefObject<Element | null>,
  options: UseSceneMotionPolicyOptions
): SceneMotionState {
  const { reducedMotion, lowPerformance } = usePerformanceSettings();
  const isDocumentVisible = useDocumentVisibility();
  const isInView = useSceneIntersection(sceneRef, options);

  return resolveSceneMotion({
    reducedMotion,
    lowPerformance,
    isInView,
    isDocumentVisible,
    dominantEffect: options.dominantEffect,
  });
}
```

- [ ] **Step 6: Run both hook tests**

```powershell
bun test tests/features/useDocumentVisibility.test.tsx tests/features/useSceneMotionPolicy.test.tsx
```

Expected: PASS, including observer cleanup.

- [ ] **Step 7: Commit**

```powershell
git add src/features/performance tests/features
git commit -m "feat: track active motion scenes"
```

---

### Task 3: Add a reusable cancellable rAF lifecycle

**Files:**

- Create: `src/features/performance/useRafWhile.ts`
- Create: `tests/features/useRafWhile.test.tsx`
- Modify: `src/features/performance/index.ts`

- [ ] **Step 1: Write failing start/stop tests**

```tsx
function RafProbe({ active, onFrame }: { active: boolean; onFrame: (time: number) => void }): null {
  useRafWhile(active, onFrame);
  return null;
}

it("schedules frames only while active", () => {
  const onFrame = vi.fn();
  const { rerender, unmount } = render(<RafProbe active={false} onFrame={onFrame} />);
  expect(requestAnimationFrame).not.toHaveBeenCalled();

  rerender(<RafProbe active onFrame={onFrame} />);
  expect(requestAnimationFrame).toHaveBeenCalledTimes(1);

  rerender(<RafProbe active={false} onFrame={onFrame} />);
  expect(cancelAnimationFrame).toHaveBeenCalled();
  unmount();
});
```

- [ ] **Step 2: Run and confirm RED**

```powershell
bun test tests/features/useRafWhile.test.tsx
```

- [ ] **Step 3: Implement with a callback ref**

```ts
export function useRafWhile(active: boolean, onFrame: (time: number) => void): void {
  const callbackRef = useRef(onFrame);

  useEffect(() => {
    callbackRef.current = onFrame;
  }, [onFrame]);

  useEffect(() => {
    if (!active) return;

    let frameId = 0;
    const tick = (time: number): void => {
      callbackRef.current(time);
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [active]);
}
```

- [ ] **Step 4: Run and commit**

```powershell
bun test tests/features/useRafWhile.test.tsx
git add src/features/performance tests/features/useRafWhile.test.tsx
git commit -m "feat: add conditional animation frame hook"
```

---

### Task 4: Establish visual tokens and a non-destructive reduced-motion baseline

**Files:**

- Modify: `src/shared/styles/tailwind/dark-mode.css:13-41`
- Modify: `src/shared/styles/tailwind/a11y.css:1-18`
- Modify: `src/shared/ui/Button/Button.tsx:37-58`
- Modify: `src/shared/ui/Card/Card.tsx:24-47`
- Modify: `src/shared/ui/Section/Section.tsx:16-24`
- Modify: `src/shared/ui/SectionHeader/SectionHeader.tsx`
- Modify: `tests/shared/section.test.tsx`

- [ ] **Step 1: Add failing primitive-class assertions**

Extend `section.test.tsx`:

```tsx
expect(container.querySelector("section#about")).toHaveClass("py-[var(--section-space-standard)]");
expect(screen.getByRole("heading")).toHaveClass("text-balance");
```

Create focused `tests/shared/Button.test.tsx` and `tests/shared/Card.test.tsx`:

```tsx
expect(screen.getByRole("button")).toHaveClass("duration-[var(--motion-micro)]");
expect(container.firstChild).toHaveClass("shadow-[var(--shadow-hard-sm)]");
```

- [ ] **Step 2: Define tokens**

Add to `:root`:

```css
--shadow-hard-sm: 4px 4px 0 0 #111111;
--shadow-hard-lg: 8px 8px 0 0 #111111;
--motion-micro: 180ms;
--motion-component: 260ms;
--section-space-standard: clamp(5rem, 7vw, 6rem);
--section-space-dense: clamp(4rem, 6vw, 5rem);
--section-space-cta: clamp(5rem, 8vw, 7rem);
--z-content: 0;
--z-nav: 40;
--z-overlay: 50;
--z-dialog: 60;
```

Override shadow colors in dark mode with white. Use these variables in Button/Card instead of repeated shadow literals. Keep current square geometry and 2 px border.

- [ ] **Step 3: Replace the global 0.01 ms rule**

`a11y.css` becomes:

```css
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  [data-motion-active="false"] {
    animation-play-state: paused !important;
  }

  [style*="backdrop-filter"] {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }
}
```

Component-level `motion-reduce:*` classes and scene policy now own transitions; do not globally force every animation to one frame.

- [ ] **Step 4: Normalize typography and rhythm**

Use `clamp()` for large headings and `text-balance` in `SectionHeader`. Keep body text at `text-base` or larger on mobile. Map standard/dense/cta to the three shared section-space variables rather than adding per-widget values.

- [ ] **Step 5: Run primitives, lint and build**

```powershell
bun test tests/shared/section.test.tsx tests/shared/Button.test.tsx tests/shared/Card.test.tsx
bun run lint
bun run build
```

Expected: PASS.

- [ ] **Step 6: Commit**

```powershell
git add src/shared/styles src/shared/ui tests/shared
git commit -m "refactor: unify portfolio visual tokens"
```

---

### Task 5: Gate Skills marquee and arc calculations by scene activity

**Files:**

- Create: `tests/widgets/SkillMarqueeRow.test.tsx`
- Modify: `src/widgets/skills/ui/SkillMarqueeRow.tsx:9-127`
- Modify: `src/widgets/skills/ui/SkillsMarquee.tsx`
- Modify: `src/widgets/skills/ui/SkillsMobileView.tsx`
- Modify: `src/widgets/skills/ui/SkillsDesktopView.tsx`

- [ ] **Step 1: Write the failing row test**

```tsx
it("pauses CSS and rAF motion while inactive", () => {
  render(<SkillMarqueeRow skills={skillsData.slice(0, 2)} curved isMotionActive={false} />);

  expect(screen.getByTestId("skill-marquee-track")).toHaveStyle({
    animationPlayState: "paused",
  });
  expect(requestAnimationFrame).not.toHaveBeenCalled();
});
```

- [ ] **Step 2: Add the explicit prop**

```ts
interface SkillMarqueeRowProps {
  speed?: number;
  direction?: "left" | "right";
  skills: SkillData[];
  curved?: boolean;
  arcHeight?: number;
  isMotionActive: boolean;
}
```

Set:

```tsx
data-testid="skill-marquee-track"
data-motion-active={isMotionActive}
style={{
  animationDuration: `${String(speed)}s`,
  animationPlayState: isMotionActive ? "running" : "paused",
  // existing values
}}
```

- [ ] **Step 3: Replace the recursive effect with `useRafWhile`**

Extract the arc calculation into a stable `updateArc` callback and call:

```ts
useRafWhile(curved && isMotionActive, updateArc);
```

Remove permanent `will-change-transform`; apply it only while `isMotionActive`.

- [ ] **Step 4: Compute policy in each visible Skills view**

Desktop:

```tsx
const motion = useSceneMotionPolicy(containerRef, { dominantEffect: "marquee" });
<SkillsMarquee isMotionActive={motion.canRunContinuous} />;
```

Mobile uses `rowsRef` and the same hook. Pass `isMotionActive` to every row. Keep grouped tags visible even when motion is disabled.

- [ ] **Step 5: Run tests**

```powershell
bun test tests/widgets/SkillMarqueeRow.test.tsx tests/widgets/SkillsWidget.test.tsx
```

Expected: inactive rows schedule no rAF and use paused CSS animation.

- [ ] **Step 6: Commit**

```powershell
git add src/widgets/skills tests/widgets
git commit -m "fix: pause skills motion outside active scene"
```

---

### Task 6: Run cursor Nyancat only during an active pointer interaction

**Files:**

- Create: `tests/widgets/SkillsCursorNyancat.test.tsx`
- Modify: `src/widgets/skills/ui/SkillsCursorNyancat.tsx:8-209`
- Modify: `src/widgets/skills/ui/SkillsDesktopView.tsx`

- [ ] **Step 1: Write the failing lifecycle test**

```tsx
it("does not schedule cursor animation before pointer entry", () => {
  const ref = { current: document.createElement("section") };
  render(<SkillsCursorNyancat containerRef={ref} isMotionActive />);
  expect(requestAnimationFrame).not.toHaveBeenCalled();
});
```

Then dispatch `mouseenter` on the container and expect one scheduled frame; dispatch `mouseleave` and expect cancellation.

- [ ] **Step 2: Add `isMotionActive` and derive the local gate**

```ts
interface SkillsCursorNyancatProps {
  containerRef: React.RefObject<HTMLElement | null>;
  isMotionActive: boolean;
}

const shouldAnimate = isMotionActive && isVisible;
```

- [ ] **Step 3: Move physics into a stable frame callback**

Keep physics refs, but replace the mount-time recursive effect with:

```ts
const animate = useCallback(
  (time: number): void => {
    // existing position and jump calculations
    if (catRef.current !== null) {
      catRef.current.style.transform = `translate3d(${String(x)}px, ${String(y)}px, 0)`;
    }
  },
  [containerRef]
);

useRafWhile(shouldAnimate, animate);
```

Set `willChange` only when `shouldAnimate`; keep the image decorative with `alt=""`.

- [ ] **Step 4: Give marquee priority until pointer entry**

`SkillsDesktopView` passes the scene policy to both components. Marquee receives:

```tsx
isMotionActive={motion.canRunContinuous && !isPointerInside}
```

Cursor receives:

```tsx
isMotionActive={motion.canRunContinuous}
```

Lift `isPointerInside` to `SkillsDesktopView` with section `onPointerEnter/onPointerLeave`. This ensures one continuous signature effect in the scene.

- [ ] **Step 5: Run tests and commit**

```powershell
bun test tests/widgets/SkillsCursorNyancat.test.tsx tests/widgets/SkillMarqueeRow.test.tsx
git add src/widgets/skills tests/widgets
git commit -m "fix: coordinate skills signature motion"
```

---

### Task 7: Pause flying Nyancat and gate paint scenes

**Files:**

- Modify: `src/widgets/header/HeaderWidget.tsx:17-85`
- Modify: `src/widgets/header/ui/HeaderNavigation.tsx:88-157`
- Modify: `src/widgets/header/ui/HeaderNyancat.tsx`
- Modify: `src/features/nyancat/ui/FlyingNyancat.tsx`
- Modify: `src/features/nyancat/types/index.ts`
- Modify: `src/features/nyancat/ui/NyancatImage.tsx`
- Modify: `src/features/nyancat/ui/InteractionOverlay.tsx`
- Modify: `src/features/nyancat/ui/RainbowTrail.tsx`
- Modify: `src/widgets/contacts/ContactsWidget.tsx`
- Modify: `src/widgets/contacts/ui/ContactsView.tsx`
- Create: `tests/widgets/HeaderWidget.test.tsx`
- Create: `tests/widgets/ContactsWidget.test.tsx`

- [ ] **Step 1: Write failing scene-gate assertions**

Mock `useSceneMotionPolicy` as inactive and assert:

```tsx
expect(screen.queryByTestId("header-nyancat")).not.toHaveStyle({
  animationPlayState: "running",
});
```

For Contacts, assert `enablePaint={false}` while scene is inactive or document hidden, but contact links remain rendered.

- [ ] **Step 2: Give `FlyingNyancat` an explicit activity prop**

Extend its props:

```ts
isMotionActive?: boolean;
```

Default to `true` for finite consumers. Pass the value to image, overlay and rainbow trail and set each animated wrapper:

```tsx
data-motion-active={isMotionActive}
style={{
  animation: `${animationName} ${animationDuration} linear infinite`,
  animationDelay,
  animationPlayState: isMotionActive ? "running" : "paused",
}}
```

- [ ] **Step 3: Wire Header policy**

Add `headerRef` to the root and:

```ts
const motion = useSceneMotionPolicy(headerRef, {
  dominantEffect: showDecorations ? "flying-nyancat" : "paint",
});
```

Make the child contract explicit:

```tsx
interface HeaderNyancatProps {
  isMotionActive: boolean;
}

<HeaderNyancat isMotionActive={motion.canRunContinuous} />;
```

Forward that value to `FlyingNyancat`. Paint remains pointer-driven; when hidden/offscreen, CSS flight pauses.

Remove the permanent `willChange: "transform"` declarations from both navigation wrappers. Keep the existing transform updates and verify nav morph in `tests/features/useNavMorph.test.ts`; the browser should promote the layer only while it is actually changing.

- [ ] **Step 4: Wire Contacts policy**

Add a root ref through `ContactsView`/`Section`. Compute:

```ts
const motion = useSceneMotionPolicy(sectionRef, { dominantEffect: "paint" });
const enablePaint = !motion.reducedMotion && motion.isInView && motion.isDocumentVisible;
```

Do not remove contact cards when inactive. `usePawAnimation` remains event-driven and only draws when `enablePaint`.

- [ ] **Step 5: Run regressions**

```powershell
bun test tests/widgets/HeaderWidget.test.tsx tests/widgets/HeaderNavigation.test.tsx tests/widgets/ContactsWidget.test.tsx tests/features/pawUi.test.tsx tests/features/nyancatUi.test.tsx tests/features/useNavMorph.test.ts
```

- [ ] **Step 6: Commit**

```powershell
git add src/widgets/header src/widgets/contacts src/features/nyancat tests
git commit -m "fix: pause offscreen portfolio effects"
```

---

### Task 8: Polish contact hierarchy and verify visual parity

**Files:**

- Modify: `src/shared/config/content/contact.ts:6-25`
- Modify: `tests/shared/content.test.ts`
- Modify: `src/widgets/contacts/ui/ContactsView.tsx:78-167`
- Modify: `src/widgets/header/ui/HeaderHero.tsx:17-72`
- Modify: `src/shared/ui/SectionHeader/SectionHeader.tsx`

- [ ] **Step 1: Write the contact-order contract**

```ts
expect(contactsData.map(({ label }) => label)).toEqual(["Email", "Telegram", "GitHub"]);
```

- [ ] **Step 2: Reorder data and preserve card semantics**

Move Telegram before GitHub in `contact.ts`. Keep Email as the large card. Give Telegram the visually stronger second slot and GitHub the supporting slot; all remain real links without client state.

- [ ] **Step 3: Apply the approved visual hierarchy**

Hero:

```tsx
<h1 className="text-[clamp(3rem,10vw,7rem)] leading-[0.88] font-black tracking-[-0.06em] uppercase">
```

Contacts:

- keep body text contrast at 4.5:1;
- keep CTA cards above canvas with stable z-index tokens;
- use the shared hard-shadow variables;
- avoid hover scale or width changes.

About and proof:

- set `AboutView` to `spacing="dense"` so proof follows Hero without a second oversized pause;
- preserve `AboutSpecPanel` screen-reader fallback and existing tests;
- keep the proof copy within `max-w-[75ch]`.

Readable evidence:

- update project summary/outcome and timeline responsibility copy to `text-base` on mobile;
- allow `text-sm` only for metadata, periods and labels;
- keep paragraph line length between 65 and 75 characters through `max-w-[70ch]`;
- use Heroicons for generic arrows/external-link controls touched in this wave, while keeping official GitHub/LinkedIn/Telegram brand icons from `react-icons`.

- [ ] **Step 4: Run tests, lint and build**

```powershell
bun test tests/shared/content.test.ts tests/shared/section.test.tsx
bun run format:check
bun run lint
bun run test
bun run build
```

Expected: all pass.

- [ ] **Step 5: Manual visual and runtime pass**

At 375, 768, 1024 and 1440 px verify:

- light/dark typography and borders;
- reduced-motion still looks intentional;
- Windows Forced Colors keeps focus outlines, borders and action labels visible;
- hidden tab pauses marquee and flying Nyancat;
- leaving Skills viewport stops rAF;
- pointer entry pauses marquee while cursor Nyancat runs;
- contacts remain usable without paint.

- [ ] **Step 6: Commit**

```powershell
git add src/shared/config/content/contact.ts src/widgets/contacts src/widgets/header src/shared/ui tests
git commit -m "feat: polish recruiter conversion scenes"
```

---

## Wave 2 completion gate

- Visual tokens replace duplicated shadow, duration and z-index literals in touched primitives.
- Reduced motion is component/scene-designed, not globally forced to 0.01 ms.
- Scene motion truth table and hooks are unit-tested.
- Marquee, curved arc and cursor Nyancat schedule no frames outside their active state.
- Flying Nyancat pauses offscreen and when the tab is hidden.
- Header and Contacts preserve content and CTA when paint is disabled.
- Email and Telegram lead the contact hierarchy.
- Light, dark, reduced-motion and all four target viewports pass manual review.
- Full test, lint, format and build commands pass.
