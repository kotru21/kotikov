/**
 * Blocking inline script for <head>. Must stay in sync with applyChoice() in ThemeProvider.
 * Reads localStorage, then cookie (in-app browsers), then system preference.
 * Cookie is client-only persistence — no cookies() in root layout to keep static generation.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var r=document.documentElement;var c=null;try{c=localStorage.getItem('theme');}catch(e){}if(c!=='light'&&c!=='dark'){try{var m=document.cookie.match(/(?:^|; )theme=([^;]*)/);if(m)c=decodeURIComponent(m[1]);}catch(e){}}r.classList.remove('dark','light');if(c==='light'){r.classList.add('light');}else{var d=c==='dark'||((c===null||c==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches);r.classList.toggle('dark',d);}r.classList.add('theme-ready');}catch(e){try{document.documentElement.classList.add('theme-ready');}catch(e2){}}})();`;
