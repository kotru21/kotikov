/* eslint-disable @typescript-eslint/naming-convention -- vi.mock keys match component exports */
import { fireEvent, render, screen } from "@testing-library/react";
import { forwardRef, useImperativeHandle } from "react";
import { describe, expect, it, vi } from "vitest";

import ContactsWidget from "@/widgets/contacts/ContactsWidget";

const motionState = vi.hoisted(() => ({
  reducedMotion: false,
  lowPerformance: false,
  isInView: true,
  isDocumentVisible: true,
}));

const pawHandlers = vi.hoisted(() => ({
  handlePointerEnter: vi.fn(),
  handlePointerMove: vi.fn(),
  handlePointerLeave: vi.fn(),
  handlePointerDown: vi.fn(),
  handlePointerUp: vi.fn(),
  handlePointerCancel: vi.fn(),
}));

const pawMock = vi.hoisted(() => ({
  latestEnabled: undefined as boolean | undefined,
  latestDraw: undefined as
    | ((x: number, y: number, prevX: number, prevY: number) => void)
    | undefined,
  isDrawing: true,
}));

const themeState = vi.hoisted(() => ({
  isDark: false,
}));

const drawOnCanvas = vi.fn();
const initCanvas = vi.fn();
const clearDrawing = vi.fn();
const checkCollisions = vi.fn();
const resyncAll = vi.fn();

vi.mock("@/features/interactive-elements", () => ({
  InteractiveTextContext: ({ children }: { children: React.ReactNode }) => children,
  InteractiveElement: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href?: string;
  } & Record<string, unknown>) => {
    if (typeof href === "string") {
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    }
    return <div {...props}>{children}</div>;
  },
  InteractiveText: ({ text }: { text: string }) => text,
  useInteractiveCollision: () => ({ checkCollisions, resyncAll }),
  useInteractiveRegistry: () => ({
    registry: {},
    interactiveElementsRef: { current: [] },
  }),
}));

vi.mock("@/features/paw", () => ({
  ClearPaintButton: ({
    onClick,
    disabled,
  }: {
    onClick: () => void;
    disabled?: boolean;
  }) => (
    <button type="button" onClick={onClick} disabled={disabled}>
      Очистить рисунок
    </button>
  ),
  PaintDrawHint: () => <p>Проведи мышью — оставь след лапы</p>,
  PawCursorIcon: ({ className }: { className?: string }) => (
    <svg data-testid="paw-icon" className={className} />
  ),
  usePawAnimation: (
    onDraw: (x: number, y: number, prevX: number, prevY: number) => void,
    options?: { enabled?: boolean }
  ) => {
    pawMock.latestDraw = onDraw;
    pawMock.latestEnabled = options?.enabled;
    return {
      pawPos: { x: 12, y: 12 },
      pawVelocity: { x: 1, y: 1 },
      isDrawing: pawMock.isDrawing && (options?.enabled ?? true),
      handlers: pawHandlers,
    };
  },
}));

vi.mock("@/features/performance", () => ({
  usePerformanceSettings: () => ({
    reducedMotion: motionState.reducedMotion,
    lowPerformance: motionState.lowPerformance,
  }),
  useSceneMotionPolicy: () => ({
    reducedMotion: motionState.reducedMotion,
    lowPerformance: motionState.lowPerformance,
    isInView: motionState.isInView,
    isDocumentVisible: motionState.isDocumentVisible,
    dominantEffect: "paint",
    canRunContinuous: true,
  }),
}));

vi.mock("@/features/theme/client", () => ({
  useTheme: () => ({
    isDark: themeState.isDark,
  }),
}));

vi.mock("@/widgets/contacts/ui/ContactCanvas", () => {
  const MockContactCanvas = forwardRef((_props, ref) => {
    useImperativeHandle(ref, () => ({
      drawOnCanvas,
      initCanvas,
      clearDrawing,
      checkCoverage: () => 0,
      sampleContrast: () => ({
        coverage: 0,
        luminance: null,
        preferDarkText: false,
      }),
    }));
    return <canvas data-testid="contact-canvas" />;
  });
  MockContactCanvas.displayName = "MockContactCanvas";

  return {
    __esModule: true,
    default: MockContactCanvas,
  };
});

class IntersectionObserverMock {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly thresholds = [0];
  readonly disconnect = vi.fn();
  readonly observe = vi.fn();
  readonly takeRecords = vi.fn((): IntersectionObserverEntry[] => []);
  readonly unobserve = vi.fn();
}

vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);

describe("ContactsWidget paint-enabled path", () => {
  it("draws and resyncs on theme change and clear when paint is enabled", () => {
    motionState.reducedMotion = false;
    motionState.lowPerformance = false;
    motionState.isInView = true;
    motionState.isDocumentVisible = true;
    pawMock.isDrawing = true;
    themeState.isDark = false;

    const { rerender } = render(<ContactsWidget />);

    expect(pawMock.latestEnabled).toBe(true);
    expect(screen.getByTestId("contact-canvas")).toBeInTheDocument();
    expect(screen.getByText(/проведи мышью/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Очистить рисунок" })).toBeInTheDocument();
    expect(screen.queryByTestId("paw-icon")).not.toBeInTheDocument();
    expect(document.getElementById("contacts")).toHaveStyle({ touchAction: "none" });
    expect(resyncAll).toHaveBeenCalledTimes(1);

    pawMock.latestDraw?.(10, 10, 0, 0);
    expect(drawOnCanvas).toHaveBeenCalled();
    expect(checkCollisions).toHaveBeenCalled();

    themeState.isDark = true;
    rerender(<ContactsWidget />);
    expect(resyncAll).toHaveBeenCalledTimes(2);

    fireEvent.click(screen.getByRole("button", { name: "Очистить рисунок" }));
    expect(clearDrawing).toHaveBeenCalled();
    expect(resyncAll).toHaveBeenCalledTimes(3);
    expect(initCanvas).not.toHaveBeenCalled();
  });

  it("disables paw animation under reduced motion so touchAction stays pan-y", () => {
    motionState.reducedMotion = true;
    motionState.lowPerformance = false;
    motionState.isInView = true;
    motionState.isDocumentVisible = true;
    pawMock.isDrawing = true;

    render(<ContactsWidget />);

    expect(pawMock.latestEnabled).toBe(false);
    expect(screen.queryByTestId("contact-canvas")).not.toBeInTheDocument();
    expect(document.getElementById("contacts")).toHaveStyle({ touchAction: "pan-y" });
    expect(screen.queryByTestId("paw-icon")).not.toBeInTheDocument();
  });

  it("keeps the canvas mounted when the section leaves the viewport", () => {
    motionState.reducedMotion = false;
    motionState.lowPerformance = false;
    motionState.isInView = true;
    motionState.isDocumentVisible = true;
    pawMock.isDrawing = true;

    const { rerender } = render(<ContactsWidget />);
    expect(screen.getByTestId("contact-canvas")).toBeInTheDocument();

    motionState.isInView = false;
    rerender(<ContactsWidget />);

    expect(pawMock.latestEnabled).toBe(false);
    expect(screen.getByTestId("contact-canvas")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Очистить рисунок" })).toBeDisabled();
  });
});
