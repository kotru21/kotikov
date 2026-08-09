import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SIZE_CONFIG } from "@/features/nyancat/lib/constants";
import type { Pixel } from "@/features/nyancat/types";
import { ExplosionPixels } from "@/features/nyancat/ui/ExplosionPixels";
import FlyingNyancat from "@/features/nyancat/ui/FlyingNyancat";
import { RainbowTrail } from "@/features/nyancat/ui/RainbowTrail";

const explode = vi.hoisted(() => vi.fn());
const isMobile = vi.hoisted(() => ({ value: false }));
const explosionState = vi.hoisted(() => ({
  isExploded: false,
  pixels: [] as Pixel[],
  explosionPosition: { x: 12, y: 34 },
}));

vi.mock("@/features/device/client", () => ({
  useIsMobile: () => isMobile.value,
}));

vi.mock("@/features/nyancat/hooks/useExplosion", () => ({
  useExplosion: () => ({
    isExploded: explosionState.isExploded,
    pixels: explosionState.pixels,
    explosionPosition: explosionState.explosionPosition,
    nyancatRef: { current: null },
    explode,
  }),
}));

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

describe("FlyingNyancat composition", () => {
  it("explodes on click and skips hover explode on mobile", () => {
    explode.mockClear();
    isMobile.value = false;
    explosionState.isExploded = false;

    const { rerender } = render(
      <FlyingNyancat
        size="small"
        position={{ top: "0", left: "0" }}
        animationName="nyancat-fly"
        animationDuration="18s"
        testId="fly-cat"
      />
    );

    fireEvent.mouseEnter(screen.getByTestId("fly-cat"));
    expect(explode).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId("fly-cat"));
    expect(explode).toHaveBeenCalledTimes(2);

    isMobile.value = true;
    explode.mockClear();
    rerender(
      <FlyingNyancat
        size="small"
        position={{ top: "0", left: "0" }}
        animationName="nyancat-fly"
        animationDuration="18s"
        testId="fly-cat"
      />
    );

    fireEvent.mouseEnter(screen.getByTestId("fly-cat"));
    expect(explode).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId("fly-cat"));
    expect(explode).toHaveBeenCalledTimes(1);
  });

  it("swaps the cat for explosion pixels after explode", () => {
    explosionState.isExploded = true;
    explosionState.pixels = [
      {
        id: 9,
        x: 0,
        y: 0,
        color: "#abc",
        velocityX: 0,
        velocityY: 0,
        size: 4,
        shape: "square",
        rotation: 0,
        rotationSpeed: 0,
        opacity: 1,
      },
    ];

    const { container } = render(
      <FlyingNyancat
        size="small"
        position={{ top: "0", left: "0" }}
        animationName="nyancat-fly"
        animationDuration="18s"
        testId="fly-cat"
      />
    );

    expect(screen.queryByTestId("fly-cat")).not.toBeInTheDocument();
    expect(container.querySelectorAll("div").length).toBeGreaterThan(0);
  });
});
