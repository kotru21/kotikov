import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { InteractionOverlay } from "@/features/nyancat/ui/InteractionOverlay";
import { NyancatImage } from "@/features/nyancat/ui/NyancatImage";

interface MovingWrapperCallbacks {
  onClick: ReturnType<typeof vi.fn>;
  onMouseEnter: ReturnType<typeof vi.fn>;
}

function expectPointerInteraction(wrapper: Element, callbacks: MovingWrapperCallbacks): void {
  fireEvent.click(wrapper);
  fireEvent.touchStart(wrapper);
  fireEvent.mouseEnter(wrapper);

  expect(callbacks.onClick).toHaveBeenCalledTimes(2);
  expect(callbacks.onMouseEnter).toHaveBeenCalledTimes(1);
}

function expectHiddenFromKeyboard(wrapper: Element): void {
  expect(wrapper).not.toHaveAttribute("role", "button");
  expect(wrapper).not.toHaveAttribute("tabindex", "0");
  expect(wrapper).toHaveAttribute("aria-hidden", "true");
}

function getMovingWrapper(container: HTMLElement): Element {
  const wrapper = container.firstElementChild;

  if (!wrapper) throw new Error("Expected a moving Nyancat wrapper");
  return wrapper;
}

describe("NyancatImage", () => {
  it("keeps pointer interaction without exposing the moving wrapper to keyboard users", () => {
    const callbacks = { onClick: vi.fn(), onMouseEnter: vi.fn() };
    const { container } = render(
      <NyancatImage
        size="small"
        animationName="fly"
        animationDuration="2s"
        animationDelay="0s"
        isMobile={false}
        {...callbacks}
      />
    );
    const wrapper = getMovingWrapper(container);

    expectHiddenFromKeyboard(wrapper);
    expectPointerInteraction(wrapper, callbacks);
  });
});

describe("InteractionOverlay", () => {
  it("keeps pointer interaction without exposing the moving wrapper to keyboard users", () => {
    const callbacks = { onClick: vi.fn(), onMouseEnter: vi.fn() };
    const { container } = render(
      <InteractionOverlay
        size="small"
        position={{ top: "10px", left: "20px" }}
        animationName="fly"
        animationDuration="2s"
        animationDelay="0s"
        isMobile={false}
        {...callbacks}
      />
    );
    const wrapper = getMovingWrapper(container);

    expectHiddenFromKeyboard(wrapper);
    expectPointerInteraction(wrapper, callbacks);
  });
});
