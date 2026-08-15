import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SIZE_CONFIG } from "@/features/nyancat";
import { SkillsInteractionProvider } from "@/widgets/skills/model/SkillsInteractionContext";
import SkillsCursorNyancat from "@/widgets/skills/ui/SkillsCursorNyancat";

function renderCursorCat(isMotionActive = true): {
  containerEl: HTMLElement;
  unmount: () => void;
} {
  const containerEl = document.createElement("section");
  document.body.appendChild(containerEl);
  const view = render(
    <SkillsInteractionProvider>
      <SkillsCursorNyancat containerRef={{ current: containerEl }} isMotionActive={isMotionActive} />
    </SkillsInteractionProvider>
  );
  return {
    containerEl,
    unmount: () => {
      view.unmount();
      containerEl.remove();
    },
  };
}

describe("SkillsCursorNyancat", () => {
  const requestAnimationFrame = vi.fn((callback: FrameRequestCallback): number => {
    void callback;
    return 1;
  });
  const cancelAnimationFrame = vi.fn();

  beforeEach(() => {
    requestAnimationFrame.mockClear();
    cancelAnimationFrame.mockClear();
    vi.stubGlobal("requestAnimationFrame", requestAnimationFrame);
    vi.stubGlobal("cancelAnimationFrame", cancelAnimationFrame);
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("does not schedule cursor animation before pointer entry", () => {
    const { containerEl, unmount } = renderCursorCat();

    expect(requestAnimationFrame).not.toHaveBeenCalled();

    act(() => {
      containerEl.dispatchEvent(new Event("mouseenter"));
    });
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);

    act(() => {
      containerEl.dispatchEvent(new Event("mouseleave"));
    });
    expect(cancelAnimationFrame).toHaveBeenCalled();

    unmount();
  });

  it("renders an attached rainbow trail behind the cat", () => {
    const { unmount } = renderCursorCat();

    expect(document.querySelectorAll("[data-nyancat-trail]")).toHaveLength(
      SIZE_CONFIG.medium.trailSegments
    );

    unmount();
  });

  it("explodes on click and tap, but not on hover", () => {
    const { unmount } = renderCursorCat();
    const cat = screen.getByTestId("skills-nyancat");

    fireEvent.mouseEnter(cat);
    expect(screen.getByTestId("skills-nyancat")).toBeInTheDocument();

    fireEvent.click(cat);
    expect(screen.queryByTestId("skills-nyancat")).not.toBeInTheDocument();
    expect(document.querySelectorAll("[data-nyancat-trail]")).toHaveLength(0);

    unmount();

    const second = renderCursorCat();
    fireEvent.touchEnd(screen.getByTestId("skills-nyancat"));
    expect(screen.queryByTestId("skills-nyancat")).not.toBeInTheDocument();
    second.unmount();
  });

  it("starts following after touch on the skills band", () => {
    const { containerEl, unmount } = renderCursorCat();

    act(() => {
      containerEl.dispatchEvent(new Event("touchstart"));
    });
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);

    unmount();
  });

  it("perches on a data-nyancat-perch article along its top edge", () => {
    const { containerEl, unmount } = renderCursorCat();
    const perch = document.createElement("article");
    perch.setAttribute("data-nyancat-perch", "");
    perch.textContent = "Development";
    containerEl.appendChild(perch);

    const origin = {
      left: 0,
      top: 0,
      right: 400,
      bottom: 400,
      width: 400,
      height: 400,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    };
    const ledge = {
      left: 200,
      top: 80,
      right: 380,
      bottom: 240,
      width: 180,
      height: 160,
      x: 200,
      y: 80,
      toJSON: () => ({}),
    };
    containerEl.getBoundingClientRect = (): DOMRect => origin as DOMRect;
    perch.getBoundingClientRect = (): DOMRect => ledge as DOMRect;

    act(() => {
      containerEl.dispatchEvent(new Event("mouseenter"));
      containerEl.dispatchEvent(
        new MouseEvent("mousemove", { clientX: 250, clientY: 120, bubbles: true })
      );
    });

    act(() => {
      for (const time of [0, 100, 250, 500, 600]) {
        const cb = requestAnimationFrame.mock.calls.at(-1)?.[0] as FrameRequestCallback | undefined;
        cb?.(time);
      }
    });

    const sprite = document.querySelector("[data-skills-decorative-motion]");
    if (!(sprite instanceof HTMLElement)) throw new Error("expected nyancat sprite");
    expect(sprite).toHaveClass("z-20");
    expect(sprite).not.toHaveClass("z-50");
    const match = /translate3d\(([-\d.]+)px,\s*([-\d.]+)px/.exec(sprite.style.transform);
    expect(match).toBeTruthy();
    expect(Number(match?.[1])).toBeCloseTo(225, 0);
    expect(Number(match?.[2])).toBeCloseTo(80 - SIZE_CONFIG.medium.height, 0);

    unmount();
  });
});
