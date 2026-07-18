/* eslint-disable @typescript-eslint/naming-convention -- vi.mock keys match component exports */
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InteractiveElement } from "@/features/interactive-elements";
import { colors } from "@/styles/colors";
import { HeaderPaintSurface } from "@/widgets/header/ui";

const navMorphState = vi.hoisted(() => ({
  progress: 0,
  phase: 0,
  isIsland: false,
}));

const themeState = vi.hoisted(() => ({
  isDark: false,
}));

const performanceSettings = vi.hoisted(() => ({
  reducedMotion: false,
  lowPerformance: false,
}));

const sampleContrast = vi.hoisted(() =>
  vi.fn(() => ({
    coverage: 0.9,
    luminance: 0.85,
    preferDarkText: true,
  }))
);

vi.mock("@/features/paw", () => ({
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

vi.mock("@/features/performance", () => ({
  usePerformanceSettings: () => ({
    reducedMotion: performanceSettings.reducedMotion,
    lowPerformance: performanceSettings.lowPerformance,
  }),
  useSceneMotionPolicy: () => ({
    reducedMotion: performanceSettings.reducedMotion,
    lowPerformance: performanceSettings.lowPerformance,
    isInView: true,
    isDocumentVisible: true,
    dominantEffect: "paint",
    canRunContinuous: false,
  }),
}));

vi.mock("@/features/scrolling", () => ({
  useNavMorph: () => ({
    progress: navMorphState.progress,
    phase: navMorphState.phase,
    isIsland: navMorphState.isIsland,
  }),
}));

vi.mock("@/features/theme/client", () => ({
  useTheme: () => ({ isDark: themeState.isDark }),
}));

vi.mock("@/widgets/header/ui/HeaderBackground", () => ({
  HeaderBackground: ({
    paintRef,
  }: {
    paintRef?: React.RefObject<{
      checkCoverage?: (rect: DOMRect) => number;
      sampleContrast: (rect: DOMRect) => {
        coverage: number;
        luminance: number;
        preferDarkText: boolean;
      };
      drawOnCanvas: (
        x: number,
        y: number,
        prevX: number,
        prevY: number
      ) => void;
    } | null>;
  }) => {
    if (paintRef) {
      paintRef.current = {
        checkCoverage: () => 1,
        sampleContrast,
        drawOnCanvas: vi.fn(),
      };
    }
    return null;
  },
}));

vi.mock("@/widgets/header/ui/HeaderNyancat", () => ({
  HeaderNyancat: () => null,
}));

describe("HeaderPaintSurface", () => {
  beforeEach(() => {
    navMorphState.progress = 0;
    navMorphState.phase = 0;
    navMorphState.isIsland = false;
    themeState.isDark = false;
    performanceSettings.reducedMotion = false;
    performanceSettings.lowPerformance = false;
    sampleContrast.mockClear();
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      () => new DOMRect(0, 0, 100, 40)
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("resyncs remounted interactive elements after island mode before restoring paint contrast", () => {
    navMorphState.progress = 0.5;
    navMorphState.phase = 2;

    function renderSurface(mode: string): React.JSX.Element {
      return (
        <HeaderPaintSurface
          navigation={
            <InteractiveElement key={`nav-${mode}`} data-testid={`nav-${mode}`}>
              Navigation
            </InteractiveElement>
          }
          hero={
            <InteractiveElement key={`hero-${mode}`} data-testid={`hero-${mode}`}>
              Hero
            </InteractiveElement>
          }
        />
      );
    }

    const { rerender } = render(
      renderSurface("island")
    );

    expect(screen.getByTestId("nav-island").style.color).toBe("");
    expect(screen.getByTestId("hero-island").style.color).toBe("");
    expect(sampleContrast).not.toHaveBeenCalled();

    navMorphState.progress = 0;
    navMorphState.phase = 0;
    rerender(renderSurface("paint"));

    expect(screen.getByTestId("nav-paint")).toHaveStyle({ color: colors.text.primary });
    expect(screen.getByTestId("hero-paint")).toHaveStyle({ color: colors.text.primary });
    expect(sampleContrast).toHaveBeenCalledTimes(2);

    themeState.isDark = true;
    rerender(renderSurface("paint"));

    expect(screen.getByTestId("nav-paint")).toHaveStyle({ color: colors.text.primary });
    expect(screen.getByTestId("hero-paint")).toHaveStyle({ color: colors.text.primary });
    expect(sampleContrast).toHaveBeenCalledTimes(4);
  });
});
