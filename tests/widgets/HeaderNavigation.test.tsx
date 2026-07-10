import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type * as ScrollingFeature from "@/features/scrolling";
import { HeaderNavigation } from "@/widgets/header/ui";

const navigation = [
  { name: "Главная", href: "#header" },
  { name: "Проекты", href: "#projects" },
  { name: "Контакты", href: "#contacts" },
];

const performanceSettings = vi.hoisted(() => ({
  reducedMotion: false,
  lowPerformance: false,
}));

const navMorphState = vi.hoisted(() => ({
  progress: 0,
  phase: 0,
  isIsland: false,
}));

vi.mock("@/features/performance", () => ({
  usePerformanceSettings: () => ({
    reducedMotion: performanceSettings.reducedMotion,
    lowPerformance: performanceSettings.lowPerformance,
  }),
}));

vi.mock("@/features/scrolling", async () => {
  const actual = await vi.importActual<typeof ScrollingFeature>("@/features/scrolling");

  return {
    ...actual,
    useNavMorph: () => ({
      progress: navMorphState.progress,
      phase: navMorphState.phase,
      isIsland: navMorphState.isIsland,
    }),
  };
});

vi.mock("@/features/theme", () => {
  function themeToggleMock(): React.JSX.Element {
    return <button type="button">Theme</button>;
  }

  return {
    ThemeToggle: themeToggleMock,
  };
});

describe("HeaderNavigation mobile menu", () => {
  beforeEach(() => {
    performanceSettings.reducedMotion = false;
    performanceSettings.lowPerformance = false;
    navMorphState.progress = 0;
    navMorphState.phase = 0;
    navMorphState.isIsland = false;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("opens the dialog when the burger button is clicked", () => {
    render(<HeaderNavigation navigation={navigation} />);

    expect(screen.getByRole("navigation", { name: "Основная навигация" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Открыть меню" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Закрыть меню" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Проекты" })).toBeInTheDocument();
  });

  it("closes the dialog when a navigation link is clicked", async () => {
    render(<HeaderNavigation navigation={navigation} />);

    fireEvent.click(screen.getByRole("button", { name: "Открыть меню" }));
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("link", { name: "Проекты" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("closes the dialog when the contacts link is clicked", async () => {
    render(<HeaderNavigation navigation={navigation} />);

    fireEvent.click(screen.getByRole("button", { name: "Открыть меню" }));
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("link", { name: /Связаться/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("omits animated menu panel classes when reduced motion is enabled", () => {
    performanceSettings.reducedMotion = true;

    render(<HeaderNavigation navigation={navigation} />);

    fireEvent.click(screen.getByRole("button", { name: "Открыть меню" }));

    const dialog = screen.getByRole("dialog");
    expect(dialog.className).not.toContain("group/mobile-panel");
  });

  it("switches to island chrome when morph progress leaves paint mode", () => {
    navMorphState.progress = 0.8;
    navMorphState.isIsland = true;

    render(<HeaderNavigation navigation={navigation} />);

    const nav = screen.getByRole("navigation", { name: "Основная навигация" });
    expect(nav.querySelectorAll('[data-island="true"]').length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Главная" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Связаться/i })).toBeInTheDocument();
  });
});
