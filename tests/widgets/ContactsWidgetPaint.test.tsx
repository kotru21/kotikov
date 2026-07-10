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

const drawOnCanvas = vi.fn();
const initCanvas = vi.fn();
const checkCollisions = vi.fn();
let latestDraw:
  | ((x: number, y: number, prevX: number, prevY: number) => void)
  | undefined;

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
  useInteractiveCollision: () => ({ checkCollisions }),
  useInteractiveRegistry: () => ({
    registry: {},
    interactiveElementsRef: { current: [] },
  }),
}));

vi.mock("@/features/paw", () => ({
  ClearPaintButton: ({ onClick }: { onClick: () => void }) => (
    <button type="button" onClick={onClick}>
      Очистить рисунок
    </button>
  ),
  PaintDrawHint: () => <p>Проведи мышью — оставь след лапы</p>,
  PawCursorIcon: ({ className }: { className?: string }) => (
    <svg data-testid="paw-icon" className={className} />
  ),
  usePawAnimation: (onDraw: (x: number, y: number, prevX: number, prevY: number) => void) => {
    latestDraw = onDraw;
    return {
      pawPos: { x: 12, y: 12 },
      pawVelocity: { x: 1, y: 1 },
      isDrawing: true,
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

vi.mock("@/widgets/contacts/ui/ContactCanvas", () => {
  const MockContactCanvas = forwardRef((_props, ref) => {
    useImperativeHandle(ref, () => ({
      drawOnCanvas,
      initCanvas,
      checkCoverage: () => 0,
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
  it("draws, clears, and shows paw when paint is enabled", () => {
    motionState.reducedMotion = false;
    motionState.lowPerformance = false;
    motionState.isInView = true;
    motionState.isDocumentVisible = true;

    render(<ContactsWidget />);

    expect(screen.getByTestId("contact-canvas")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Очистить рисунок" })).toBeInTheDocument();

    latestDraw?.(10, 10, 0, 0);
    expect(drawOnCanvas).toHaveBeenCalled();
    expect(checkCollisions).toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Очистить рисунок" }));
    expect(initCanvas).toHaveBeenCalled();
  });
});
