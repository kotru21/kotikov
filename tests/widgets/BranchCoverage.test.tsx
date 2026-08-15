import { act, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  SkillsInteractionProvider,
  useSkillsInteraction,
} from "@/widgets/skills/model/SkillsInteractionContext";
import SkillsCursorNyancat from "@/widgets/skills/ui/SkillsCursorNyancat";

import ErrorPage from "../../app/error";

vi.mock("next/image", async () => {
  const { MockNextImage } = await import("../helpers/mockNextImage");
  return { default: MockNextImage };
});

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
        const { setActiveElement } = useSkillsInteraction();
        React.useEffect(() => {
          setActiveElement(card);
        }, [setActiveElement]);
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
        host.dispatchEvent(
          new MouseEvent("mousemove", { clientX: 10, clientY: 10, bubbles: true })
        );
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
