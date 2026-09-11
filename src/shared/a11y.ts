// a11y.ts — Shared keyboard-focus ring, used on every interactive element
// across the site so Tab-focus is always visible (mouse/touch clicks are
// unaffected, since `focus-visible` only activates for keyboard focus).
export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1";
