// theme.ts — Light/dark theme detection + persistence, shared by every page's
// no-flash <head> script and SiteHeader's toggle button.
//
// Storage holds only an explicit user choice ('light' | 'dark'). No entry
// means "follow the OS" via prefers-color-scheme — same three-state shape
// (explicit small/large vs unset-means-default) as the font-size toggle in
// WikiLayout.astro.

export const THEME_STORAGE_KEY = "archivum:theme";

// Plain string, not a module — consumed via `<script is:inline set:html={...}>`
// in every page's <head>, which must run synchronously before first paint to
// avoid a light-mode flash. is:inline scripts can't use imports, so this is
// the one script body every page injects verbatim instead of each hand-writing
// its own copy.
export const NO_FLASH_THEME_SCRIPT = `
(function () {
  var stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
  var dark = stored === 'dark' || (stored !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (dark) document.documentElement.dataset.theme = 'dark';
})();
`;
