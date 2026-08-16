import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { puzzleCells } from "@/shared/config/content";
import { GRID_STROKE } from "@/shared/ui";
import { PuzzleHome } from "@/widgets/puzzle";
import {
  PUZZLE_BOARD_REST_TRACKS,
  puzzleBoardTracks,
} from "@/widgets/puzzle/lib/puzzleBoardTracks";

const performanceState = vi.hoisted(() => ({
  reducedMotion: true,
  lowPerformance: false,
}));

vi.mock("@/features/performance/client", () => ({
  usePerformanceSettings: () => performanceState,
}));

vi.mock("@/features/device/client", () => ({
  useResponsiveViewMode: () => "both",
}));

function desktopBoard(): HTMLElement {
  const board = document.querySelector("[data-puzzle='desktop']");
  if (!(board instanceof HTMLElement)) {
    throw new Error("expected desktop puzzle board");
  }
  return board;
}

function desktopCell(href: string): HTMLElement {
  const link = desktopBoard().querySelector(`a[href='${href}']`);
  if (!(link instanceof HTMLElement)) {
    throw new Error(`expected desktop cell ${href}`);
  }
  return link;
}

function desktopLogo(): HTMLElement {
  const logo = desktopBoard().querySelector("[data-area='k']");
  if (!(logo instanceof HTMLElement)) {
    throw new Error("expected desktop K cell");
  }
  return logo;
}

function renderPuzzle(): void {
  render(<PuzzleHome />);
}

describe("PuzzleHome", () => {
  beforeEach(() => {
    performanceState.reducedMotion = true;
    performanceState.lowPerformance = false;
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("exposes header id and four section links in desktop tab order", () => {
    renderPuzzle();
    expect(document.querySelector("header#header")).not.toBeNull();
    const heading = screen.getByRole("heading", { level: 1, name: "Kotikov" });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass("sr-only");
    expect(screen.getAllByRole("heading", { level: 1, name: "Kotikov" })).toHaveLength(1);
    const links = screen
      .getAllByRole("link")
      .filter(
        (el) =>
          el.closest("[data-puzzle='mobile']") === null &&
          puzzleCells.some((c) => c.href === el.getAttribute("href") && el.textContent === c.label)
      );
    expect(links.map((l) => l.getAttribute("href"))).toEqual([
      "#about",
      "#contacts",
      "#projects",
      "#experience",
    ]);
  });

  it("links the skills ticker to #skills", () => {
    renderPuzzle();
    expect(screen.getAllByRole("link", { name: /OWASP/ }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /OWASP/ })[0]).toHaveAttribute("href", "#skills");
  });

  it("frames tickers with overlaying strokes and K marks between phrases", () => {
    renderPuzzle();
    const desktop = document.querySelector(".max-md\\:hidden");
    const topTicker = desktop?.querySelector("[data-ticker-orientation='horizontal']");
    const sideTickers = desktop?.querySelectorAll("[data-ticker-orientation='vertical']");
    const leftTicker = sideTickers?.[0];
    const rightTicker = sideTickers?.[1];
    const desktopClasses = desktop?.className.split(/\s+/) ?? [];
    expect(desktopClasses).not.toContain("gap-[2px]");
    expect(desktopClasses).toContain("h-dvh");
    expect(desktopClasses).toContain("max-h-dvh");
    expect(desktopClasses).toContain("overflow-hidden");
    expect(desktopClasses).not.toContain("min-h-dvh");
    const header = document.querySelector("header#header");
    const headerClasses = header?.className.split(/\s+/) ?? [];
    expect(headerClasses).toContain("h-dvh");
    expect(headerClasses).toContain("max-h-dvh");
    expect(headerClasses).toContain("overflow-hidden");
    expect(headerClasses).not.toContain("min-h-dvh");
    expect(headerClasses).not.toContain("h-svh");
    expect(desktop?.children).toHaveLength(5);
    expect(desktop?.querySelectorAll("[data-puzzle-corner]")).toHaveLength(0);
    expect(topTicker).toHaveClass("col-span-full", "border-2", "z-[4]");
    expect(leftTicker).toHaveClass("row-span-full", "border-2", "z-[1]");
    expect(rightTicker).toHaveClass("row-span-full", "border-2", "z-[3]");
    expect(
      desktop?.querySelector("[data-ticker-orientation='horizontal'][href='#skills']")
    ).toHaveClass("col-span-full", "border-2", "z-[2]");
    expect(desktopBoard()).toHaveClass("-m-[2px]");
    expect(desktopCell("#about")).toHaveClass("border-x-2", "border-t-2");
    expect(desktopCell("#about")).not.toHaveClass("border-2");
    expect(desktopCell("#about")).not.toHaveClass("-m-[2px]");
    expect(desktopCell("#about")).not.toHaveClass("border-b-2");
    expect(desktopCell("#contacts")).toHaveClass("border-y-2", "border-r-2");
    expect(desktopCell("#contacts")).not.toHaveClass("border-2");
    expect(desktopCell("#contacts")).not.toHaveClass("-m-[2px]");
    expect(desktopCell("#contacts")).not.toHaveClass("border-l-2");
    expect(desktopCell("#projects")).toHaveClass("border-y-2", "border-l-2");
    expect(desktopCell("#projects")).not.toHaveClass("border-2");
    expect(desktopCell("#projects")).not.toHaveClass("-m-[2px]");
    expect(desktopCell("#projects")).not.toHaveClass("border-r-2");
    expect(desktopCell("#experience")).toHaveClass("border-x-2", "border-b-2");
    expect(desktopCell("#experience")).not.toHaveClass("border-2");
    expect(desktopCell("#experience")).not.toHaveClass("-m-[2px]");
    expect(desktopCell("#experience")).not.toHaveClass("border-t-2");
    expect(topTicker?.className).toContain("[padding-block:0.375rem]");
    expect(leftTicker?.className).toContain("[padding-block:0.375rem]");
    const tickerMarks = document.querySelectorAll("[data-ticker-mark='k']");
    expect(tickerMarks.length).toBeGreaterThan(0);
    tickerMarks.forEach((mark) => {
      expect(mark).toHaveClass("[padding-inline:16px]");
    });
    expect(screen.getAllByText(/ × /).every((node) => node.classList.contains("sr-only"))).toBe(
      true
    );
  });

  it("keeps a single Kotikov h1 on the puzzle for mobile and desktop", () => {
    renderPuzzle();
    const heading = screen.getByRole("heading", { level: 1, name: "Kotikov" });
    expect(heading).toHaveClass("sr-only");
    expect(heading.closest("header#header")).not.toBeNull();
    expect(heading.closest(".max-md\\:hidden")).toBeNull();
  });

  it("does not expose a theme toggle on the puzzle", () => {
    renderPuzzle();
    expect(screen.queryByRole("button", { name: /тему/i })).not.toBeInTheDocument();
  });

  it("stacks mobile rows as Обо мне, Проекты, Опыт, Контакты", () => {
    renderPuzzle();
    const mobile = document.querySelector("[data-puzzle='mobile']");
    expect(mobile).not.toBeNull();
    if (!(mobile instanceof HTMLElement)) {
      throw new Error("expected mobile puzzle");
    }
    const labels = [...mobile.querySelectorAll("a")].map((el) => el.textContent);
    expect(labels).toEqual(["Обо мне", "Проекты", "Опыт", "Контакты"]);
    const mobileShell = mobile.parentElement;
    expect(mobileShell).toHaveClass("flex", "h-dvh", "max-h-dvh", "overflow-hidden");
    expect(mobileShell?.className.split(/\s+/)).not.toContain("min-h-dvh");
    const mobileTickers = mobileShell?.querySelectorAll(":scope > [data-ticker-orientation]");
    expect(mobileTickers?.length).toBe(2);
    mobileTickers?.forEach((ticker) => {
      expect(ticker).toHaveClass("flex-none");
      expect(ticker).not.toHaveClass("h-full");
    });
    expect([...mobile.querySelectorAll("a")].every((cell) => cell.classList.contains("flex-1"))).toBe(
      true
    );
  });

  it("resizes desktop grid tracks on mouse hover and restores on leave", () => {
    performanceState.reducedMotion = false;
    renderPuzzle();
    const board = desktopBoard();
    expect(board).toHaveAttribute("data-hover", "rest");
    expect(board).toHaveStyle({
      gridTemplateColumns: PUZZLE_BOARD_REST_TRACKS.columns,
      gridTemplateRows: PUZZLE_BOARD_REST_TRACKS.rows,
    });

    fireEvent.pointerEnter(desktopCell("#about"), { pointerType: "mouse" });
    const aboutTracks = puzzleBoardTracks("about");
    expect(board).toHaveAttribute("data-hover", "about");
    expect(board).toHaveStyle({
      gridTemplateColumns: aboutTracks.columns,
      gridTemplateRows: aboutTracks.rows,
    });

    fireEvent.pointerLeave(desktopCell("#about"), { pointerType: "mouse" });
    expect(board).toHaveAttribute("data-hover", "rest");
    expect(board).toHaveStyle({
      gridTemplateColumns: PUZZLE_BOARD_REST_TRACKS.columns,
      gridTemplateRows: PUZZLE_BOARD_REST_TRACKS.rows,
    });
  });

  it("grows the center tracks when hovering the K mark and restores on leave", () => {
    performanceState.reducedMotion = false;
    renderPuzzle();
    const board = desktopBoard();
    const logo = desktopLogo();
    expect(logo.querySelector("a")).toBeNull();

    fireEvent.pointerEnter(logo, { pointerType: "mouse" });
    const kTracks = puzzleBoardTracks("k");
    expect(board).toHaveAttribute("data-hover", "k");
    expect(board).toHaveStyle({
      gridTemplateColumns: kTracks.columns,
      gridTemplateRows: kTracks.rows,
    });

    fireEvent.pointerLeave(logo, { pointerType: "mouse" });
    expect(board).toHaveAttribute("data-hover", "rest");
    expect(board).toHaveStyle({
      gridTemplateColumns: PUZZLE_BOARD_REST_TRACKS.columns,
      gridTemplateRows: PUZZLE_BOARD_REST_TRACKS.rows,
    });

    fireEvent.pointerEnter(logo, { pointerType: "touch" });
    expect(board).toHaveAttribute("data-hover", "rest");
  });

  it("does not resize the desktop board under reduced motion", () => {
    renderPuzzle();
    const board = desktopBoard();
    fireEvent.pointerEnter(desktopCell("#contacts"), { pointerType: "mouse" });
    expect(board).toHaveAttribute("data-hover", "rest");
    fireEvent.pointerEnter(desktopLogo(), { pointerType: "mouse" });
    expect(board).toHaveAttribute("data-hover", "rest");
    expect(board).toHaveStyle({
      gridTemplateColumns: PUZZLE_BOARD_REST_TRACKS.columns,
      gridTemplateRows: PUZZLE_BOARD_REST_TRACKS.rows,
    });
  });

  it("does not apply hover resize on the mobile stack", () => {
    performanceState.reducedMotion = false;
    renderPuzzle();
    const mobile = document.querySelector("[data-puzzle='mobile']");
    expect(mobile).not.toHaveAttribute("data-hover");
    const mobileAbout = mobile?.querySelector("a[href='#about']");
    if (!(mobileAbout instanceof HTMLElement)) {
      throw new Error("expected mobile about cell");
    }
    fireEvent.pointerEnter(mobileAbout, { pointerType: "mouse" });
    expect(desktopBoard()).toHaveAttribute("data-hover", "rest");
  });

  it("keeps teal on the K at rest and hover-fills the section cells", () => {
    renderPuzzle();
    const about = desktopCell("#about");
    expect(about).toHaveClass("hover:bg-primary-500", "hover:text-[#111]", "bg-background-primary");
    expect(about).not.toHaveClass("bg-primary-500");

    const logo = desktopLogo();
    expect(logo).toHaveClass("bg-primary-500", "text-[#111]", "z-10", "m-0", "border-2");
    expect(logo).toHaveAttribute("data-area", "k");
    expect(logo).not.toHaveClass("-m-[2px]");
    expect(logo.className).toContain(GRID_STROKE);
    expect(logo.querySelector("a")).toBeNull();
    expect(logo).toHaveClass("items-center", "justify-center");
    expect(logo).not.toHaveClass("flex-col");
    expect(logo).not.toHaveClass("gap-2");
    expect(within(logo).queryByRole("button", { name: /тему/i })).not.toBeInTheDocument();

    const skillsTicker = document.querySelector(
      "[data-ticker-orientation='horizontal'][href='#skills']"
    );
    expect(skillsTicker).toHaveClass("hover:bg-primary-500", "hover:text-[#111]");
  });
});
