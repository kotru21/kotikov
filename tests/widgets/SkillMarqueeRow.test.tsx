import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { skillsData } from "@/shared/config/content";
import { SkillsInteractionProvider } from "@/widgets/skills/model/SkillsInteractionContext";
import { SkillMarqueeRow } from "@/widgets/skills/ui";

describe("SkillMarqueeRow", () => {
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

  it("pauses CSS and rAF motion while inactive", () => {
    render(
      <SkillsInteractionProvider>
        <SkillMarqueeRow skills={skillsData.slice(0, 2)} curved isMotionActive={false} />
      </SkillsInteractionProvider>
    );

    expect(screen.getByTestId("skill-marquee-track")).toHaveStyle({
      animationPlayState: "paused",
    });
    expect(requestAnimationFrame).not.toHaveBeenCalled();
  });
});
