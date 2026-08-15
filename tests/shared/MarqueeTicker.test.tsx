import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { GRID_SURFACE } from "@/shared/ui";
import { marqueeFillRepeat, MarqueeTicker } from "@/shared/ui/MarqueeTicker";

const motion = vi.hoisted(() => ({ reducedMotion: true }));

vi.mock("@/features/performance/client", () => ({
  usePerformanceSettings: () => ({ reducedMotion: motion.reducedMotion, lowPerformance: false }),
}));

function tickerShell(): HTMLElement {
  const mark = document.querySelector("[data-ticker-orientation]");
  if (!(mark instanceof HTMLElement)) {
    throw new Error("expected ticker shell");
  }
  return mark;
}

describe("MarqueeTicker", () => {
  it("renders phrases with a K mark when motion is reduced", () => {
    motion.reducedMotion = true;
    render(<MarqueeTicker text="SAST × DFIR" />);
    expect(screen.getByText("SAST")).toBeInTheDocument();
    expect(screen.getByText("DFIR")).toBeInTheDocument();
    expect(screen.getByText("SAST × DFIR")).toHaveClass("sr-only");
    expect(document.querySelectorAll("[data-ticker-mark='k']")).toHaveLength(1);
    expect(document.querySelector("[data-marquee='on']")).toBeNull();
    expect(tickerShell()).toHaveClass("whitespace-normal", "leading-tight");
    expect(tickerShell()).not.toHaveClass("whitespace-nowrap");
  });

  it("is a link when href is set", () => {
    motion.reducedMotion = true;
    render(<MarqueeTicker text="skills" href="#skills" />);
    expect(screen.getByRole("link", { name: "skills" })).toHaveAttribute("href", "#skills");
    expect(screen.getByRole("link", { name: "skills" })).toHaveClass(
      "hover:bg-primary-500",
      "hover:text-[#111]",
      "cursor-pointer"
    );
  });

  it("drops unsafe hrefs instead of rendering a link", () => {
    motion.reducedMotion = true;
    render(<MarqueeTicker text="skills" href="javascript:alert(1)" />);
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("uses a 50% inline scroll when motion is allowed", () => {
    motion.reducedMotion = false;
    render(<MarqueeTicker text="SAST × DFIR" />);
    const track = document.querySelector("[data-marquee='on']");
    expect(track).not.toBeNull();
    expect(track).toHaveAttribute("aria-hidden", "true");
    expect(track).toHaveClass("animate-ticker-x");
    expect(screen.getByText("SAST × DFIR")).toHaveClass("sr-only");
    expect(track?.children).toHaveLength(2);
    expect(track).toHaveAttribute("data-marquee-fill", "1");
    const copies = [...(track?.children ?? [])];
    expect(copies[0]?.querySelectorAll("[data-ticker-mark='k']")).toHaveLength(
      copies[1]?.querySelectorAll("[data-ticker-mark='k']").length ?? 0
    );
  });

  it("repeats identical units until one copy covers the shell", () => {
    expect(marqueeFillRepeat(1029, 907)).toBe(2);
    expect(marqueeFillRepeat(1920, 907)).toBe(3);
    expect(marqueeFillRepeat(871, 530)).toBe(2);
    expect(marqueeFillRepeat(871, 446)).toBe(2);
    expect(marqueeFillRepeat(1025, 1088)).toBe(1);
    expect(marqueeFillRepeat(0, 100)).toBe(1);
    expect(marqueeFillRepeat(100, 0)).toBe(1);
  });

  it("centers copy in a framed ticker shell with K marks between repeats", () => {
    motion.reducedMotion = false;
    render(<MarqueeTicker text="SAST × DFIR" />);
    const track = document.querySelector("[data-marquee='on']");
    expect(track).toHaveClass("flex", "h-full", "items-center", "animate-ticker-x");
    expect(track?.parentElement).toHaveClass(
      "flex",
      "h-full",
      "items-center",
      "overflow-hidden",
      "[padding-block:0.375rem]"
    );
    expect(track?.parentElement).not.toHaveClass("px-1", "py-1", "min-h-[2.1rem]");
    expect(track?.parentElement?.className).not.toContain("border-2");
    expect(track?.parentElement?.className).toContain(GRID_SURFACE);
    expect(document.querySelectorAll("[data-ticker-mark='k']")).toHaveLength(4);
    const mark = document.querySelector("[data-ticker-mark='k']");
    expect(mark).toHaveClass("[padding-inline:16px]");
    expect(mark).not.toHaveClass("h-[13px]", "w-[13px]");
    expect(mark?.querySelector("svg")).toHaveClass("h-[13px]", "w-[13px]");
    expect(track?.querySelector("span")).not.toHaveClass("gap-[1.25em]");
    expect(track?.querySelector("[class*='pr-[4em]']")).toBeNull();
  });

  it("scrolls vertical gutters along the block axis", () => {
    motion.reducedMotion = false;
    render(<MarqueeTicker orientation="vertical" text="SOC × AppSec" />);
    const shell = tickerShell();
    expect(shell).toHaveClass(
      "[writing-mode:vertical-rl]",
      "rotate-180",
      "[padding-block:0.375rem]"
    );
    expect(shell).not.toHaveClass("px-1", "py-1");
    expect(shell).toHaveAttribute("data-ticker-orientation", "vertical");
    const track = document.querySelector("[data-marquee='on']");
    expect(track).toHaveClass("animate-ticker-y");
    expect(track).not.toHaveClass("h-full");
    const mark = shell.querySelector("[data-ticker-mark='k']");
    expect(mark).toHaveClass("[padding-inline:16px]");
    expect(mark).not.toHaveClass("[writing-mode:horizontal-tb]");
    expect(mark?.querySelector("svg")).toHaveClass("[writing-mode:horizontal-tb]");
  });

  it("gives scroll marquees a non-zero duration", async () => {
    const { readFile } = await import("node:fs/promises");
    const css = await readFile("src/shared/styles/tailwind/theme.css", "utf8");
    expect(css).toMatch(/--animate-scroll-left:\s*scroll-left-infinite\s+40s\s+linear\s+infinite/);
    expect(css).toMatch(
      /--animate-scroll-right:\s*scroll-right-infinite\s+40s\s+linear\s+infinite/
    );
    expect(css).toMatch(/--animate-ticker-x:\s*ticker-x\s+40s\s+linear\s+infinite/);
    expect(css).toMatch(/--animate-ticker-y:\s*ticker-y\s+40s\s+linear\s+infinite/);
    expect(css).toMatch(/@keyframes ticker-x[\s\S]*translate3d\(-50%,\s*0,\s*0\)/);
    expect(css).toMatch(/@keyframes ticker-y[\s\S]*translate3d\(0,\s*-50%,\s*0\)/);
  });
});
