import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SIZE_CONFIG } from "@/features/nyancat/lib/constants";
import type { Pixel } from "@/features/nyancat/types";
import { ExplosionPixels } from "@/features/nyancat/ui/ExplosionPixels";
import { AttachedRainbowTrail, RainbowTrail } from "@/features/nyancat/ui/RainbowTrail";

describe("ExplosionPixels", () => {
  it("renders square, circle, and triangle particles", () => {
    const pixels: Pixel[] = [
      {
        id: 1,
        x: 1,
        y: 2,
        color: "#111",
        velocityX: 0,
        velocityY: 0,
        size: 4,
        shape: "square",
        rotation: 0,
        rotationSpeed: 0,
        opacity: 1,
      },
      {
        id: 2,
        x: 3,
        y: 4,
        color: "#222",
        velocityX: 0,
        velocityY: 0,
        size: 5,
        shape: "circle",
        rotation: 10,
        rotationSpeed: 0,
        opacity: 0.8,
      },
      {
        id: 3,
        x: 5,
        y: 6,
        color: "#333",
        velocityX: 0,
        velocityY: 0,
        size: 6,
        shape: "triangle",
        rotation: 20,
        rotationSpeed: 0,
        opacity: 0.5,
      },
    ];

    const { container } = render(
      <ExplosionPixels pixels={pixels} explosionPosition={{ x: 100, y: 200 }} />
    );
    const nodes = container.querySelectorAll("div");

    expect(nodes).toHaveLength(3);
    expect(nodes[1].className).toContain("rounded-full");
    expect(nodes[2].style.clipPath).toContain("polygon");
  });
});

describe("RainbowTrail", () => {
  it("renders one segment per size config entry and pauses when inactive", () => {
    const { container, rerender } = render(
      <RainbowTrail
        size="small"
        position={{ top: "10%", left: "20%" }}
        animationName="nyancat-fly"
        animationDuration="18s"
        animationDelay="0s"
        zIndex={2}
        isMotionActive
      />
    );

    expect(container.querySelectorAll("[data-motion-active='true']")).toHaveLength(
      SIZE_CONFIG.small.trailSegments
    );

    rerender(
      <RainbowTrail
        size="small"
        position={{ top: "10%", left: "20%" }}
        animationName="nyancat-fly"
        animationDuration="18s"
        animationDelay="0s"
        zIndex={2}
        isMotionActive={false}
      />
    );

    expect(container.querySelectorAll("[data-motion-active='false']")).toHaveLength(
      SIZE_CONFIG.small.trailSegments
    );
  });
});

describe("AttachedRainbowTrail", () => {
  it("renders cape segments without a flight animation", () => {
    const { container } = render(<AttachedRainbowTrail size="medium" isMotionActive />);

    const segments = container.querySelectorAll("[data-nyancat-trail]");
    expect(segments).toHaveLength(SIZE_CONFIG.medium.trailSegments);
    expect(segments[0]).toHaveAttribute("data-motion-active", "true");
    expect((segments[0] as HTMLElement).style.animation).toBe("");
  });
});
