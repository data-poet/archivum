/**
 * categoryPalette.ts — Derives a dark-mode-safe variant of a category's
 * light-mode accent/tint colors, so a new content type only ever needs one
 * hand-picked light palette — the dark pairing is computed, not authored.
 *
 * Only for colors used as *foreground text or a pastel tint background*
 * (e.g. the religions/races quick-filter pills, a subtype tile's label).
 * Solid, saturated "header bar with white text" backgrounds (CollectionCard,
 * RecentEntries, the collection/type section headers) are deliberately left
 * alone — a color strong enough to carry white text already has enough
 * contrast in either theme, and varying it would make the same category
 * look like a different color depending on the visitor's theme.
 */

export interface CategoryPalette {
  color: string;
  bg: string;
}

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) return [0, 0, l * 100];

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h: number;
  switch (max) {
    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
    case g: h = ((b - r) / d + 2) / 6; break;
    default: h = ((r - g) / d + 4) / 6;
  }

  return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  const sN = s / 100;
  const lN = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sN * Math.min(lN, 1 - lN);
  const f = (n: number) => lN - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (n: number) => Math.round(f(n) * 255).toString(16).padStart(2, "0");
  return `#${toHex(0)}${toHex(8)}${toHex(4)}`;
}

/** Lightens (and caps saturation on) an accent color so it reads against a dark surface. */
export function darkAccent(hex: string): string {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(h, Math.min(s, 60), Math.max(l, 62));
}

/** Darkens a pastel tint into a muted dark surface, keeping its hue. */
export function darkTint(hex: string): string {
  const [h, s] = hexToHsl(hex);
  return hslToHex(h, Math.min(s, 35), 16);
}

/**
 * Both light and dark values for a {color, bg} pair, as a style-object of
 * CSS custom properties — pair with the `.cat-pill` class in global.css.
 * Plain object (not a CSS string) so it works as-is in both Astro's
 * `style={...}` and React/JSX's `style={...}` — both accept custom
 * property keys directly.
 */
export function categoryPaletteVars({ color, bg }: CategoryPalette): Record<string, string> {
  return {
    "--cat-fg-light": color,
    "--cat-fg-dark": darkAccent(color),
    "--cat-bg-light": bg,
    "--cat-bg-dark": darkTint(bg),
  };
}

/** Light/dark values for a foreground-only color (no paired tint) — pair with the `.cat-fg` class in global.css. */
export function categoryForegroundVars(color: string): Record<string, string> {
  return {
    "--cat-fg-light": color,
    "--cat-fg-dark": darkAccent(color),
  };
}
