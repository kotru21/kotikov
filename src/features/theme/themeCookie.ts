import { THEME_COOKIE_MAX_AGE_SECONDS, THEME_COOKIE_NAME, type ThemeChoice } from "./themeConstants";

export function readThemeCookie(): ThemeChoice | null {
  if (typeof document === "undefined") return null;

  const match = new RegExp(`(?:^|; )${THEME_COOKIE_NAME}=([^;]*)`).exec(document.cookie);
  if (match?.[1] === undefined) return null;

  const value = decodeURIComponent(match[1]);
  return value === "light" || value === "dark" ? value : null;
}

export function writeThemeCookie(choice: ThemeChoice): void {
  if (typeof document === "undefined") return;

  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  if (choice === "system") {
    document.cookie = `${THEME_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax${secure}`;
    return;
  }

  document.cookie = `${THEME_COOKIE_NAME}=${choice}; path=/; max-age=${String(THEME_COOKIE_MAX_AGE_SECONDS)}; SameSite=Lax${secure}`;
}
