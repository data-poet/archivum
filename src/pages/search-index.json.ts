/**
 * search-index.json.ts — Static search index endpoint
 *
 * Generates a flat JSON array at build time containing every non-draft entry
 * across all collections. Consumed by /search at runtime via fetch().
 *
 * Collection keys are pulled dynamically from `content/config.ts` (the
 * `collections` export) — adding a new collection there makes it appear in
 * search automatically, no edits needed in this file.
 *
 * Each record shape:
 * {
 *   slug:        string   — full slug as returned by Astro (e.g. "draconic-faith/gods/bahamut")
 *   collection:  string   — collection key ("religions" | "races" | …)
 *   href:        string   — absolute path to the article
 *   title:       string
 *   type:        string   — entry type within collection
 *   description: string   — may be empty string
 *   tags:        string[]
 * }
 */

import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content';
import { collections as collectionConfig } from '../content/config';

type AnyEntry = CollectionEntry<CollectionKey>;

export const GET: APIRoute = async () => {
  const collectionKeys = Object.keys(collectionConfig);
  const records: object[] = [];

  for (const col of collectionKeys) {
    const entries = (await getCollection(col as any, ({ data }: any) => !data.draft)) as AnyEntry[];

    for (const entry of entries) {
      const data = entry.data as any;
      records.push({
        slug:        entry.slug,
        collection:  col,
        href:        `/${col}/${entry.slug}`,
        title:       data.title ?? '',
        type:        data.type  ?? '',
        description: data.description ?? '',
        tags:        data.tags  ?? [],
      });
    }
  }

  return new Response(JSON.stringify(records), {
    headers: { 'Content-Type': 'application/json' },
  });
};
