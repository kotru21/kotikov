import { THEME_COOKIE_NAME, THEME_STORAGE_KEY, type ThemeChoice } from "./themeConstants";
import { readThemeCookie } from "./themeCookie";

export function isPersistedThemeChoice(value: string | null | undefined): value is "light" | "dark" {
  return value === "light" || value === "dark";
}

/** Invalid / missing / "system" → system (same as readThemeCookie null). */
export function normalizeThemeChoice(raw: string | null | undefined): ThemeChoice {
  return isPersistedThemeChoice(raw) ? raw : "system";
}

export function systemPrefersDark(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function resolveIsDark(choice: ThemeChoice, prefersDark = systemPrefersDark()): boolean {
  if (choice === "light") return false;
  if (choice === "dark") return true;
  return prefersDark;
}

export function applyChoice(choice: ThemeChoice, root: HTMLElement = document.documentElement): boolean {
  root.classList.remove("dark", "light");

  if (choice === "light") {
    root.classList.add("light");
    return false;
  }

  const dark = resolveIsDark(choice);
  root.classList.toggle("dark", dark);
  return dark;
}

function readLocalStorageTheme(): string | null {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function readChoice(): ThemeChoice {
  if (typeof window === "undefined") return "system";

  const stored = readLocalStorageTheme();
  if (isPersistedThemeChoice(stored)) return stored;

  const fromCookie = readThemeCookie();
  if (fromCookie !== null) return fromCookie;

  return "system";
}

export function persistChoice(choice: ThemeChoice): void {
  try {
    if (choice === "system") {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      window.localStorage.setItem(THEME_STORAGE_KEY, choice);
    }
  } catch {
    // Private mode / Safari quota — cookie still written by caller.
  }
}

/** Cookie name safe for use inside a RegExp character context in the init script. */
export function escapeForRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export { THEME_COOKIE_NAME, THEME_STORAGE_KEY };
