/**
 * grid.ts — Self-organizing grid column count for a row of boxes.
 *
 * Given a list of boxes (e.g. subtype tiles on a collection card), pick how
 * many columns to lay them out in. Priority order: try 5 columns, then 4,
 * then 3, then 2 — using the first value the box count divides evenly by.
 * Falls back to 3 if nothing matches (keeps a sane default for odd counts
 * like 7).
 *
 * Examples:
 *   10 boxes → divisible by 5 → 5 columns (2 rows of 5)
 *    8 boxes → divisible by 4 → 4 columns (2 rows of 4)
 *    9 boxes → divisible by 3 → 3 columns (3 rows of 3)
 *    6 boxes → divisible by 3 → 3 columns (priority: 5,4,3,2 — 3 wins over 2)
 *    2 boxes → divisible by 2 → 2 columns
 *    7 boxes → no match → fallback to 3
 */

const GRID_PRIORITY = [5, 4, 3, 2] as const;

// Tailwind needs literal class strings (no dynamic interpolation with JIT),
// so each possible column count maps to a fixed class here.
const GRID_COLS_CLASS: Record<number, string> = {
  5: 'grid-cols-2 md:grid-cols-5',
  4: 'grid-cols-2 md:grid-cols-4',
  3: 'grid-cols-2 md:grid-cols-3',
  2: 'grid-cols-2',
};

export function gridColsFor(boxCount: number): string {
  if (boxCount <= 0) return GRID_COLS_CLASS[3];

  const cols = GRID_PRIORITY.find((n) => boxCount % n === 0);
  return GRID_COLS_CLASS[cols ?? 3];
}
