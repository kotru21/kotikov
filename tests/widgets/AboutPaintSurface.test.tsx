/* eslint-disable @typescript-eslint/naming-convention -- vi.mock keys match component exports */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AboutPaintSurface } from "@/widgets/about/ui/AboutPaintSurface";

const motionState = vi.hoisted(() => ({
  reducedMotion: false,
  isInView: true,
  isDocumentVisible: true,
}));

const themeState = vi.hoisted(() => ({
  isDark: false,
}));

const resyncAll = vi.fn();
const clearAllContrast = vi.fn();

vi.mock("@/features/interactive-elements/client", () => ({
  InteractiveTextContext: ({ children }: { children: React.ReactNode }) => children,
  useInteractiveCollision: () => ({
    checkCollisions: vi.fn(),
    resyncAll,
    clearAllContrast,
  }),
  useInteractiveRegistry: () => ({
    registry: {},
    interactiveElementsRef: { current: [] },
  }),
}));

vi.mock("@/features/paw/client", () => ({
  usePawAnimation: () => ({
    isDrawing: false,
    handlers: {
      handlePointerEnter: vi.fn(),
      handlePointerMove: vi.fn(),
      handlePointerLeave: vi.fn(),
      handlePointerDown: vi.fn(),
      handlePointerUp: vi.fn(),
      handlePointerCancel: vi.fn(),
    },
  }),
}));

vi.mock("@/features/performance/client", () => ({
  useSceneMotionPolicy: () => ({
    reducedMotion: motionState.reducedMotion,
    isInView: motionState.isInView,
    isDocumentVisible: motionState.isDocumentVisible,
    dominantEffect: "paint",
    canRunContinuous: true,
  }),
}));

vi.mock("@/features/theme/client", () => ({
  useTheme: () => ({ isDark: themeState.isDark }),
}));

vi.mock("@/shared/ui/GridPaintOverlay", () => ({
  GridPaintOverlay: () => <canvas data-testid="about-paint" />,
}));

describe("AboutPaintSurface theme resync", () => {
  it("resyncs paint contrast when the theme changes", () => {
    motionState.reducedMotion = false;
    motionState.isInView = true;
    motionState.isDocumentVisible = true;
    themeState.isDark = false;
    resyncAll.mockClear();
    clearAllContrast.mockClear();

    const { rerender } = render(
      <AboutPaintSurface>
        <p>about</p>
      </AboutPaintSurface>
    );

    expect(resyncAll).toHaveBeenCalledTimes(1);

    themeState.isDark = true;
    rerender(
      <AboutPaintSurface>
        <p>about</p>
      </AboutPaintSurface>
    );
    expect(resyncAll).toHaveBeenCalledTimes(2);
  });

  it("clears contrast when paint is disabled", () => {
    motionState.reducedMotion = true;
    motionState.isInView = true;
    motionState.isDocumentVisible = true;
    themeState.isDark = false;
    resyncAll.mockClear();
    clearAllContrast.mockClear();

    render(
      <AboutPaintSurface>
        <p>about</p>
      </AboutPaintSurface>
    );

    expect(clearAllContrast).toHaveBeenCalled();
    expect(resyncAll).not.toHaveBeenCalled();
  });
});
