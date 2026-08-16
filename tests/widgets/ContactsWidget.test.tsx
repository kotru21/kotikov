/* eslint-disable @typescript-eslint/naming-convention -- vi.mock keys match component exports */
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { sectionTitles } from "@/shared/config/content";
import ContactsWidget from "@/widgets/contacts/ContactsWidget";

const themeState = vi.hoisted(() => ({
  isDark: false,
}));

vi.mock("@/features/interactive-elements/client", async () => {
  const { MockInteractiveElement, MockInteractiveText } =
    await import("../helpers/mockInteractiveElement");
  return {
    InteractiveTextContext: ({ children }: { children: React.ReactNode }) => children,
    InteractiveElement: MockInteractiveElement,
    InteractiveText: MockInteractiveText,
    useInteractiveCollision: () => ({
      checkCollisions: vi.fn(),
      resyncAll: vi.fn(),
      clearAllContrast: vi.fn(),
    }),
    useInteractiveRegistry: () => ({
      registry: {},
      interactiveElementsRef: { current: [] },
    }),
  };
});

vi.mock("@/features/paw/client", () => ({
  ClearPaintButton: ({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) => (
    <button type="button" onClick={onClick} disabled={disabled}>
      Очистить рисунок
    </button>
  ),
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

vi.mock("@/features/theme/client", () => ({
  useTheme: () => ({ isDark: themeState.isDark }),
}));

vi.mock("@/features/performance/client", () => ({
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
    const section = document.getElementById("contacts");
    const heading = screen.getByRole("heading", {
      level: 2,
      name: sectionTitles.contacts,
    });

    expect(section).not.toBeNull();
    expect(section).not.toHaveClass("border-2");
    expect(section).toHaveClass("min-h-[20rem]");
    expect(heading).not.toHaveClass("sr-only", "max-md:sr-only");
    expect(heading).not.toHaveClass("border-2");
    expect(section?.querySelector("form, input, textarea")).toBeNull();

    expect(screen.getByRole("link", { name: /Email.*inbox@ktkv\.me/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /GitHub.*откроется в новой вкладке/ })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Telegram.*откроется в новой вкладке/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Habr.*откроется в новой вкладке/ })
    ).toBeInTheDocument();

    // Canvas + overlay clear control stay mounted for stable section height (avoids scroll teleport);
    // paw interaction is gated via enablePaint / disabled clear button.
    expect(document.querySelector("canvas")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Очистить рисунок" })).toBeDisabled();
  });
});
