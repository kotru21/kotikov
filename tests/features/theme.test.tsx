import { act, render, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  applyChoice,
  buildThemeInitScript,
  normalizeThemeChoice,
  readChoice,
  resolveIsDark,
  THEME_COOKIE_NAME,
  THEME_CRITICAL_CSS,
  THEME_INIT_SCRIPT,
  THEME_STORAGE_KEY,
  THEME_SURFACE,
} from "@/features/theme";
import { ThemeProvider, ThemeToggle, useTheme } from "@/features/theme/client";

const wrapper = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
  <ThemeProvider>{children}</ThemeProvider>
);

function stubMatchMedia(matches: boolean): void {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

beforeEach(() => {
  localStorage.clear();
  document.cookie = `${THEME_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
  document.documentElement.classList.remove("dark", "light", "theme-ready");
  stubMatchMedia(false);
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
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(document.cookie).toContain(`${THEME_COOKIE_NAME}=dark`);
  });

  it("reads theme from cookie when localStorage is empty", () => {
    document.cookie = `${THEME_COOKIE_NAME}=dark; path=/; SameSite=Lax`;

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

    stubMatchMedia(true);

    act(() => {
      changeHandler?.();
    });

    expect(result.current.isDark).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("survives localStorage throws when persisting", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });

    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setChoice("dark");
    });

    expect(result.current.isDark).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.cookie).toContain(`${THEME_COOKIE_NAME}=dark`);

    setItem.mockRestore();
  });
});

describe("theme init script parity with applyChoice/readChoice", () => {
  function runInitScript(script: string = THEME_INIT_SCRIPT): void {
    // eslint-disable-next-line no-new-func, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-implied-eval -- intentional: exercise generated init script
    new Function(script)();
  }

  it("is generated from THEME_STORAGE_KEY and THEME_COOKIE_NAME", () => {
    expect(THEME_INIT_SCRIPT).toContain(JSON.stringify(THEME_STORAGE_KEY));
    expect(THEME_INIT_SCRIPT).toContain(THEME_COOKIE_NAME);
    expect(buildThemeInitScript("custom-key", "custom-cookie")).toContain('"custom-key"');
    expect(buildThemeInitScript("custom-key", "custom-cookie")).toContain("custom-cookie");
  });

  it("matches applyChoice for localStorage dark", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
    stubMatchMedia(false);

    runInitScript();
    const scriptIsDark = document.documentElement.classList.contains("dark");

    document.documentElement.classList.remove("dark", "light", "theme-ready");
    const choice = readChoice();
    const appliedIsDark = applyChoice(choice);

    expect(choice).toBe("dark");
    expect(scriptIsDark).toBe(true);
    expect(appliedIsDark).toBe(true);
    expect(resolveIsDark(choice, false)).toBe(true);
  });

  it("matches applyChoice for localStorage light (overrides system dark)", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    stubMatchMedia(true);

    runInitScript();
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    document.documentElement.classList.remove("dark", "light", "theme-ready");
    const choice = readChoice();
    expect(choice).toBe("light");
    expect(applyChoice(choice)).toBe(false);
  });

  it("matches applyChoice for cookie when localStorage is empty", () => {
    document.cookie = `${THEME_COOKIE_NAME}=dark; path=/; SameSite=Lax`;
    stubMatchMedia(false);

    runInitScript();
    const scriptIsDark = document.documentElement.classList.contains("dark");

    document.documentElement.classList.remove("dark", "light", "theme-ready");
    const choice = readChoice();
    expect(choice).toBe("dark");
    expect(scriptIsDark).toBe(applyChoice(choice));
  });

  it("treats invalid cookie as system (not forced light) — parity with readChoice", () => {
    document.cookie = `${THEME_COOKIE_NAME}=bogus; path=/; SameSite=Lax`;
    stubMatchMedia(true);

    runInitScript();
    const scriptIsDark = document.documentElement.classList.contains("dark");
    expect(document.documentElement.classList.contains("light")).toBe(false);

    document.documentElement.classList.remove("dark", "light", "theme-ready");
    const choice = readChoice();
    expect(choice).toBe("system");
    expect(normalizeThemeChoice("bogus")).toBe("system");
    expect(applyChoice(choice)).toBe(true);
    expect(scriptIsDark).toBe(true);
  });

  it("treats invalid cookie as system when prefers light", () => {
    document.cookie = `${THEME_COOKIE_NAME}=nope; path=/; SameSite=Lax`;
    stubMatchMedia(false);

    runInitScript();
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    document.documentElement.classList.remove("dark", "light", "theme-ready");
    expect(readChoice()).toBe("system");
    expect(applyChoice("system")).toBe(false);
  });
});

describe("theme surface tokens", () => {
  it("embeds THEME_SURFACE hexes in critical CSS", () => {
    expect(THEME_CRITICAL_CSS).toContain(THEME_SURFACE.light.background);
    expect(THEME_CRITICAL_CSS).toContain(THEME_SURFACE.dark.background);
    expect(THEME_CRITICAL_CSS).toContain(THEME_SURFACE.light.foreground);
    expect(THEME_CRITICAL_CSS).toContain(THEME_SURFACE.dark.foreground);
  });

  it("keeps dark-mode.css canvas vars aligned with THEME_SURFACE", async () => {
    const { readFile } = await import("node:fs/promises");
    const css = await readFile("src/shared/styles/tailwind/dark-mode.css", "utf8");

    function firstHex(pattern: RegExp): string | undefined {
      return pattern.exec(css)?.[1];
    }

    const rootBackground = firstHex(/:root\s*\{[^}]*--background:\s*(#[0-9a-fA-F]{6})/);
    const rootForeground = firstHex(/:root\s*\{[^}]*--foreground:\s*(#[0-9a-fA-F]{6})/);
    const darkBackground = firstHex(/\.dark\s*\{[^}]*--background:\s*(#[0-9a-fA-F]{6})/);
    const darkForeground = firstHex(/\.dark\s*\{[^}]*--foreground:\s*(#[0-9a-fA-F]{6})/);
    const systemDarkBackground = firstHex(
      /@media\s*\(\s*prefers-color-scheme:\s*dark\s*\)\s*\{\s*:root:not\(\.light\)\s*\{[^}]*--background:\s*(#[0-9a-fA-F]{6})/
    );
    const systemDarkForeground = firstHex(
      /@media\s*\(\s*prefers-color-scheme:\s*dark\s*\)\s*\{\s*:root:not\(\.light\)\s*\{[^}]*--foreground:\s*(#[0-9a-fA-F]{6})/
    );

    expect(rootBackground).toBe(THEME_SURFACE.light.background);
    expect(rootForeground).toBe(THEME_SURFACE.light.foreground);
    expect(darkBackground).toBe(THEME_SURFACE.dark.background);
    expect(darkForeground).toBe(THEME_SURFACE.dark.foreground);
    expect(systemDarkBackground).toBe(THEME_SURFACE.dark.background);
    expect(systemDarkForeground).toBe(THEME_SURFACE.dark.foreground);
  });
});
