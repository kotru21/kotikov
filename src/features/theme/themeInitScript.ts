/**
 * Theme init for next/script beforeInteractive. Must stay in sync with applyChoice() in ThemeProvider.
 * CSS dark-mode.css provides prefers-color-scheme fallback before this script runs.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var c=localStorage.getItem('theme');var r=document.documentElement;r.classList.remove('dark','light');if(c==='light'){r.classList.add('light');}else{var d=c==='dark'||((c===null||c==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches);r.classList.toggle('dark',d);}}catch(e){}})();`;
