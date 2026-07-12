import { THEME_COOKIE_NAME, THEME_STORAGE_KEY } from "./themeConstants";
import { escapeForRegExp } from "./themeLogic";

/**
 * Blocking inline script for <head>.
 * Generated from THEME_STORAGE_KEY / THEME_COOKIE_NAME so it cannot drift from ThemeProvider.
 * Semantics must match readChoice() + applyChoice() in themeLogic.ts:
 * localStorage → cookie → system; invalid cookie values treated as system (not forced light).
 */
export function buildThemeInitScript(
  storageKey: string = THEME_STORAGE_KEY,
  cookieName: string = THEME_COOKIE_NAME
): string {
  const cookiePattern = `(?:^|; )${escapeForRegExp(cookieName)}=([^;]*)`;

  return `(function(){try{var r=document.documentElement;var c=null;try{c=localStorage.getItem(${JSON.stringify(storageKey)});}catch(e){}if(c!=='light'&&c!=='dark'){try{var m=document.cookie.match(/${cookiePattern}/);if(m)c=decodeURIComponent(m[1]);}catch(e){}}if(c!=='light'&&c!=='dark')c=null;r.classList.remove('dark','light');if(c==='light'){r.classList.add('light');}else{var d=c==='dark'||((c===null||c==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches);r.classList.toggle('dark',d);}r.classList.add('theme-ready');}catch(e){try{document.documentElement.classList.add('theme-ready');}catch(e2){}}})();`;
}

export const THEME_INIT_SCRIPT = buildThemeInitScript();
