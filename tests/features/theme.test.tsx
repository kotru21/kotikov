import { act, render, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeProvider, ThemeToggle, useTheme } from "@/features/theme";

const wrapper = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
  <ThemeProvider>{children}</ThemeProvider>
);

beforeEach(() => {
  localStorage.clear();
  document.cookie = "theme=; path=/; max-age=0; SameSite=Lax";
  document.documentElement.classList.remove("dark", "light", "theme-ready");
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

describe("useTheme", () => {
  it("toggles to dark, applies the .dark class, and persists the choice", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.isDark).toBe(false);

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isDark).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(document.cookie).toContain("theme=dark");
  });

  it("reads theme from cookie when localStorage is empty", () => {
    document.cookie = "theme=dark; path=/; SameSite=Lax";

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.choice).toBe("dark");
    expect(result.current.isDark).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("keeps all ThemeToggle instances in sync", () => {
    const { getAllByRole } = render(
      <ThemeProvider>
        <ThemeToggle />
        <ThemeToggle />
        <ThemeToggle />
      </ThemeProvider>
    );

    const buttons = getAllByRole("button", { name: "Включить тёмную тему" });
    expect(buttons).toHaveLength(3);

    act(() => {
      buttons[0]?.click();
    });

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(getAllByRole("button", { name: "Включить светлую тему" })).toHaveLength(3);
  });

  it("reacts to system theme changes while choice is system", () => {
    let changeHandler: (() => void) | undefined;
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: (_event: string, handler: () => void) => {
        changeHandler = handler;
      },
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.choice).toBe("system");
    expect(result.current.isDark).toBe(false);

    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    act(() => {
      changeHandler?.();
    });

    expect(result.current.isDark).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
