/**
 * sharedStyles.js — Bottom palette shared by every infobox (border, table
 * zebra stripes, label/value/link/dead-link text) — previously copy-pasted
 * hex-for-hex across all 9 infobox files. Uses CSS custom properties (the
 * same --color-* tokens global.css defines for :root / html[data-theme]),
 * so this one definition is already dark-mode-correct with no per-file
 * theme branching needed — the browser re-resolves var() live when the
 * theme attribute flips.
 *
 * Per-type colors (header gradient, badge accent/tint) are NOT here — those
 * live in each infobox file since they vary by type, and the badge's pastel
 * tint needs its own dark variant via categoryPalette.ts's `.cat-pill`
 * class (header gradients stay fixed across themes — see categoryPalette.ts
 * for why).
 */

export const sharedInfoboxStyles = {
  wrapper: {
    border: "1px solid rgb(var(--color-border))",
    borderRadius: "4px",
    backgroundColor: "rgb(var(--color-infobox))",
    fontSize: "0.85rem",
    fontFamily: '"Source Sans 3", sans-serif',
    overflow: "hidden",
    marginBottom: "1rem",
  },

  // Header text is deliberately a fixed light color, not a theme token —
  // it sits on a per-type gradient (see each infobox file) that itself
  // doesn't vary by theme, so the text over it shouldn't either.
  header: {
    color: "#fdfaf3",
    textAlign: "center",
    padding: "8px 12px",
    fontFamily: '"Libre Baskerville", Georgia, serif',
    fontWeight: 700,
    fontSize: "1rem",
    letterSpacing: "0.02em",
  },

  badge: {
    textAlign: "center",
    padding: "4px",
    borderTop: "1px solid rgb(var(--color-border))",
    borderBottom: "1px solid rgb(var(--color-border))",
    fontStyle: "italic",
    fontSize: "0.8rem",
    fontWeight: 600,
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  rowEven: { backgroundColor: "rgb(var(--color-infobox))" },
  rowOdd: { backgroundColor: "rgb(var(--color-surface-hover))" },

  label: {
    padding: "5px 10px",
    fontWeight: 600,
    color: "rgb(var(--color-text))",
    borderBottom: "1px solid rgb(var(--color-border))",
    whiteSpace: "nowrap",
    verticalAlign: "top",
    width: "45%",
  },

  value: {
    padding: "5px 10px",
    color: "rgb(var(--color-text-muted))",
    borderBottom: "1px solid rgb(var(--color-border))",
  },

  link: {
    color: "rgb(var(--color-accent))",
    textDecoration: "none",
    fontWeight: 600,
  },

  dead: {
    color: "rgb(var(--color-text-light))",
    borderBottom: "1px dashed rgb(var(--color-text-light))",
    cursor: "not-allowed",
    fontWeight: 600,
  },
};

/** Zebra-stripe background for table row `i` — shorthand for the common `rows.map` pattern. */
export function rowBg(i) {
  return i % 2 === 0 ? sharedInfoboxStyles.rowEven : sharedInfoboxStyles.rowOdd;
}
