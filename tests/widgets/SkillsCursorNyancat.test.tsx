import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SkillsInteractionProvider } from "@/widgets/skills/model/SkillsInteractionContext";
import SkillsCursorNyancat from "@/widgets/skills/ui/SkillsCursorNyancat";

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
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("does not schedule cursor animation before pointer entry", () => {
    const container = document.createElement("section");
    document.body.appendChild(container);
    const ref = { current: container };

    render(
      <SkillsInteractionProvider>
        <SkillsCursorNyancat containerRef={ref} isMotionActive />
      </SkillsInteractionProvider>
    );

    expect(requestAnimationFrame).not.toHaveBeenCalled();

    act(() => {
      container.dispatchEvent(new Event("mouseenter"));
    });
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);

    act(() => {
      container.dispatchEvent(new Event("mouseleave"));
    });
    expect(cancelAnimationFrame).toHaveBeenCalled();

    container.remove();
  });
});
