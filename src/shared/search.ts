// search.ts — shared client-side search logic for /search and the Grafos
// landing page (/graph). Both fetch the same /search-index.json and need
// identical scoring/grouping; only the link target differs (article vs its
// graph), so that's the one thing callers parameterize via `hrefFor`.

import { COLLECTION_META, TYPE_LABELS } from '@/content/meta';
import { normalise } from '@/utils/text';
import { OPEN_CONTENT_LINKS_IN_NEW_TAB } from '@/shared/linkBehavior';

export interface SearchRecord {
  slug: string;
  collection: string;
  href: string;
  title: string;
  type: string;
  description: string;
  tags: string[];
}

export interface ScoredRecord extends SearchRecord {
  _score: number;
}

function score(record: SearchRecord, tokens: string[]): number {
  const title       = normalise(record.title);
  const description = normalise(record.description);
  const type        = normalise(TYPE_LABELS[record.type] ?? record.type);
  const tags        = record.tags.map(normalise).join(' ');

  let total = 0;
  for (const token of tokens) {
    if (title.includes(token))       total += 3;
    if (tags.includes(token))        total += 2;
    if (description.includes(token)) total += 1;
    if (type.includes(token))        total += 1;
  }
  return total;
}

// Split the query into exact tag filters (`tag:x` / `#x`) and free-text tokens.
// Filters AND together (each narrows further, like GitHub's `label:`) while the
// remaining words still fuzzy-score title/description/type/tags as before.
export function parseQuery(query: string): { tagFilters: string[]; textTokens: string[] } {
  const words = query.trim().split(/\s+/).filter(Boolean);
  const tagFilters: string[] = [];
  const textTokens: string[] = [];

  for (const word of words) {
    const match = word.match(/^(?:tag:|#)(.+)$/i);
    if (match) {
      tagFilters.push(normalise(match[1]));
    } else {
      textTokens.push(normalise(word));
    }
  }

  return { tagFilters, textTokens };
}

/** Filters/scores/sorts records for a query. Empty result means "nothing typed", not "no matches". */
export function searchRecords(records: SearchRecord[], query: string): ScoredRecord[] {
  const { tagFilters, textTokens } = parseQuery(query);
  if (!tagFilters.length && !textTokens.length) return [];

  const candidates = tagFilters.length
    ? records.filter((r) => {
        const recordTags = r.tags.map(normalise);
        return tagFilters.every((t) => recordTags.includes(t));
      })
    : records;

  // A tag-only query (no free text left to score) just lists every match,
  // alphabetically — there's nothing left to rank by relevance.
  return textTokens.length
    ? candidates
        .map((r) => ({ ...r, _score: score(r, textTokens) }))
        .filter((r) => r._score > 0)
        .sort((a, b) => b._score - a._score)
    : candidates
        .map((r) => ({ ...r, _score: 1 }))
        .sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
}

/** Groups scored results by collection and renders the same card/list markup used by /search and /graph. */
export function renderGroupedResults(scored: ScoredRecord[], hrefFor: (record: ScoredRecord) => string = (r) => r.href): string {
  const groups: Record<string, ScoredRecord[]> = {};
  for (const r of scored) {
    if (!groups[r.collection]) groups[r.collection] = [];
    groups[r.collection].push(r);
  }

  const target = OPEN_CONTENT_LINKS_IN_NEW_TAB ? ' target="_blank" rel="noopener noreferrer"' : '';

  let html = '';
  for (const [col, entries] of Object.entries(groups)) {
    const meta = COLLECTION_META[col] ?? { label: col, color: '#555' };
    html += `
      <details class="border border-border rounded overflow-hidden mb-6 group" open>
        <summary class="list-none cursor-pointer select-none">
          <div class="px-4 py-2 font-serif font-bold text-white text-base flex items-center gap-2"
               style="background-color: ${meta.color}">
            <span class="transition-transform group-open:rotate-90">▶</span>
            ${meta.label}
            <span class="font-sans font-normal text-xs opacity-80">(${entries.length})</span>
          </div>
        </summary>
        <ul class="divide-y divide-border bg-parchment-100">
          ${entries.map((e) => `
            <li>
              <a href="${hrefFor(e)}"${target}
                 class="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-5 py-3 hover:bg-parchment-200 transition-colors no-underline">
                <span class="font-serif font-bold text-accent">${e.title}</span>
                <span class="font-sans text-xs text-ink-light">${TYPE_LABELS[e.type] ?? e.type}</span>
                ${e.description
                  ? `<span class="font-sans text-xs text-ink-muted w-full sm:w-auto sm:ml-auto truncate sm:max-w-xs">${e.description}</span>`
                  : ''}
              </a>
            </li>
          `).join('')}
        </ul>
      </details>`;
  }

  return html;
}
