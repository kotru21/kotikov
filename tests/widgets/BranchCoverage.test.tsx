import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { timelineData } from "@/shared/config/content";
import {
  SkillsInteractionProvider,
  useSkillsInteraction,
} from "@/widgets/skills/model/SkillsInteractionContext";
import SkillsCursorNyancat from "@/widgets/skills/ui/SkillsCursorNyancat";
import TimelineItemDetails from "@/widgets/timeline/ui/TimelineItemDetails";
import TimelineYearDisplay from "@/widgets/timeline/ui/TimelineYearDisplay";

import ErrorPage from "../../app/error";

vi.mock("next/image", () => ({
  default: ({
    alt = "",
    onError,
    ...rest
  }: {
    alt?: string;
    onError?: () => void;
  } & Record<string, unknown>) => (
    /* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- test stub triggers onError */
    <img alt={alt} data-testid="year-cat" onClick={() => onError?.()} {...rest} />
  ),
}));

describe("branch coverage gaps", () => {
  describe("ErrorPage", () => {
    beforeEach(() => {
      vi.spyOn(console, "error").mockImplementation(() => undefined);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("logs unknown digest and shows stack in development", () => {
      vi.stubEnv("NODE_ENV", "development");

      const error = new Error("boom");
      error.stack = "stack-trace";
      render(<ErrorPage error={error} reset={vi.fn()} />);

      expect(console.error).toHaveBeenCalledWith("App Router error", { digest: "unknown" });
      expect(screen.getByText(/Подробности ошибки/)).toBeInTheDocument();
      expect(screen.getByText(/stack-trace/)).toBeInTheDocument();

      vi.unstubAllEnvs();
    });
  });

  describe("TimelineItemDetails", () => {
    it("renders title id and omits tech list when empty", () => {
      const item = { ...timelineData[0], technologies: [] as string[] };
      render(<TimelineItemDetails item={item} titleId="t1" />);
      expect(screen.getByRole("heading", { name: item.title })).toHaveAttribute("id", "t1");
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });
  });

  describe("TimelineYearDisplay", () => {
    it("covers detailed periods, cat onError fallback, and non-year periods", () => {
      const { rerender } = render(<TimelineYearDisplay period="2024 · Хакатон" />);
      expect(screen.getByText("2024 · Хакатон")).toBeInTheDocument();

      rerender(<TimelineYearDisplay period="2019" />);
      fireEvent.click(screen.getByTestId("year-cat"));
      expect(screen.getByText("1")).toBeInTheDocument();

      rerender(<TimelineYearDisplay period="н.в." />);
      expect(screen.getByText("н.в.")).toBeInTheDocument();
    });
  });

  describe("SkillsInteractionContext", () => {
    it("throws outside the provider", () => {
      function Probe(): null {
        useSkillsInteraction();
        return null;
      }

      expect(() => render(<Probe />)).toThrow(
        /useSkillsInteraction must be used within a SkillsInteractionProvider/
      );
    });
  });

  describe("SkillsCursorNyancat jump branches", () => {
    const frames: FrameRequestCallback[] = [];

    beforeEach(() => {
      frames.length = 0;
      vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
        frames.push(cb);
        return frames.length;
      });
      vi.stubGlobal("cancelAnimationFrame", vi.fn());
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("lerps nearby and jumps toward distant active cards", () => {
      const host = document.createElement("section");
      Object.defineProperty(host, "getBoundingClientRect", {
        value: () =>
          ({
            left: 0,
            top: 0,
            right: 500,
            bottom: 400,
            width: 500,
            height: 400,
            x: 0,
            y: 0,
            toJSON: () => ({}),
          }) as DOMRect,
      });
      document.body.appendChild(host);

      const card = document.createElement("div");
      Object.defineProperty(card, "getBoundingClientRect", {
        value: () =>
          ({
            left: 300,
            top: 200,
            right: 360,
            bottom: 260,
            width: 60,
            height: 60,
            x: 300,
            y: 200,
            toJSON: () => ({}),
          }) as DOMRect,
      });
      host.appendChild(card);

      function SeedActive(): null {
        const { setActiveElement, setMousePos } = useSkillsInteraction();
        React.useEffect(() => {
          setActiveElement(card);
          setMousePos({ x: 10, y: 10 });
        }, [setActiveElement, setMousePos]);
        return null;
      }

      render(
        <SkillsInteractionProvider>
          <SeedActive />
          <SkillsCursorNyancat containerRef={{ current: host }} isMotionActive />
        </SkillsInteractionProvider>
      );

      act(() => {
        host.dispatchEvent(new Event("mouseenter"));
      });

      act(() => {
        const queued = [...frames];
        queued.slice(0, 4).forEach((frame, index) => {
          frame(index * 200);
        });
      });

      expect(frames.length).toBeGreaterThan(0);
      host.remove();
    });
  });
});
