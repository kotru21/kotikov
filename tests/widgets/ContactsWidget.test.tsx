/* eslint-disable @typescript-eslint/naming-convention -- vi.mock keys match component exports */
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ContactsWidget from "@/widgets/contacts/ContactsWidget";

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
  useInteractiveCollision: () => ({ checkCollisions: vi.fn() }),
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
  usePawAnimation: () => ({
    pawPos: { x: 0, y: 0 },
    pawVelocity: { x: 0, y: 0 },
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
  usePerformanceSettings: () => ({ reducedMotion: false, lowPerformance: false }),
  useSceneMotionPolicy: () => ({
    reducedMotion: false,
    lowPerformance: false,
    isInView: false,
    isDocumentVisible: false,
    dominantEffect: "paint",
    canRunContinuous: false,
  }),
}));

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

describe("ContactsWidget", () => {
  it("keeps contact links while paint is gated off for an inactive scene", () => {
    render(<ContactsWidget />);

    expect(screen.getByRole("link", { name: "Написать: inbox@ktkv.me" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "GitHub (откроется в новой вкладке)" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Telegram (откроется в новой вкладке)" })
    ).toBeInTheDocument();

    // Canvas + paint chrome stay mounted for stable section height (avoids scroll teleport);
    // paw interaction is gated via enablePaint / disabled clear button.
    expect(document.querySelector("canvas")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Очистить рисунок" })).toBeDisabled();
    expect(screen.queryByTestId("paw-icon")).not.toBeInTheDocument();
  });
});
