/**
 * text.ts — Small text-normalisation helpers shared by client-side search UIs.
 */

/**
 * Lowercases and strips diacritics (accent-folds) a string, so searches
 * match regardless of accents — e.g. "panteao" matches "Panteão".
 * Used by both /search and the homepage tag-search widget; kept here once
 * so the two stay in sync instead of drifting apart.
 */
export function normalise(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
