import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { timelineData } from "@/shared/config/content";
import { TimelineView } from "@/widgets/timeline/ui";

vi.mock("@/features/performance", () => ({
  usePerformanceSettings: () => ({ reducedMotion: true, lowPerformance: false }),
}));

function stubMatchMedia(isMobile: boolean): void {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: query.includes("max-width") ? isMobile : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  );
}

describe("TimelineView mobile a11y", () => {
  beforeEach(() => {
    stubMatchMedia(true);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders native controls before the labelled active panel", async () => {
    const { container } = render(<TimelineView />);

    await act(async () => {
      await Promise.resolve();
    });

    const mobileSection = container.querySelector('[data-testid="timeline-mobile"]');

    expect(mobileSection).toBeTruthy();
    expect(container.querySelector('#experience [style*="linear-gradient(to right"]')).toBeNull();

    const controls = mobileSection?.querySelector('[role="group"][aria-label="Этапы опыта"]');
    const activePanel = mobileSection?.querySelector(
      '[role="group"][aria-roledescription="этап карьеры"]'
    );

    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    expect(controls).toBeTruthy();
    expect(activePanel).toHaveAttribute("aria-label", `1 из ${String(timelineData.length)}`);

    const controlsIndex = Array.from(mobileSection?.children ?? []).findIndex((child) =>
      child.contains(controls ?? null)
    );
    const activePanelIndex = Array.from(mobileSection?.children ?? []).findIndex((child) =>
      child.contains(activePanel ?? null)
    );

    expect(controlsIndex).toBeGreaterThanOrEqual(0);
    expect(activePanelIndex).toBeGreaterThan(controlsIndex);
  });

  it("marks inactive slides with inert", async () => {
    render(<TimelineView />);

    await act(async () => {
      await Promise.resolve();
    });

    const activePanel = screen.getByRole("group", {
      name: `1 из ${String(timelineData.length)}`,
    });
    const slides = activePanel.querySelectorAll(":scope > div");
    const inactiveSlides = Array.from(slides).filter(
      (slide) => slide.getAttribute("aria-hidden") === "true"
    );

    expect(inactiveSlides.length).toBeGreaterThan(0);
    for (const slide of inactiveSlides) {
      expect(slide).toHaveAttribute("inert");
    }
  });

  it("updates keyboard focus, panel label, and live counter together", async () => {
    render(<TimelineView />);

    await act(async () => {
      await Promise.resolve();
    });

    const chips = screen.getAllByRole("button", { name: /\d{4} · / });
    const firstChip = chips[0];
    const secondChip = chips[1];

    firstChip.focus();
    fireEvent.keyDown(firstChip, { key: "ArrowRight" });

    expect(secondChip).toHaveFocus();
    expect(
      screen.getByRole("group", { name: `2 из ${String(timelineData.length)}` })
    ).toBeInTheDocument();
    expect(screen.getByText(`2 / ${String(timelineData.length)}`)).toBeInTheDocument();
  });
});

describe("TimelineView responsive shells", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps CSS shells and mounts desktop rail after matchMedia sync", async () => {
    stubMatchMedia(false);
    const { container } = render(<TimelineView />);

    await act(async () => {
      await Promise.resolve();
    });

    const mobileShell = container.querySelector('[data-timeline-view="mobile"]');
    const desktopShell = container.querySelector('[data-timeline-view="desktop"]');

    expect(mobileShell).toHaveClass("md:hidden");
    expect(desktopShell).toHaveClass("hidden", "md:block");
    expect(container.querySelector('[data-testid="timeline-mobile"]')).toBeNull();
    expect(screen.getByRole("region", { name: /Лента этапов опыта/i })).toBeInTheDocument();
  });
});
