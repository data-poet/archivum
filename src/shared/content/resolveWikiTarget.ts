/**
 * resolveWikiTarget.ts — Shared target lookup for WikiLink.astro and Ref.astro.
 *
 * Both components need the same thing: given an href like
 * "/religions/draconic-faith/gods/bahamut", find the matching entry across
 * every collection in content/config.ts (not just its own collection) and
 * report whether it exists plus its title. Kept in one place so the two
 * components can't drift on what counts as a valid target.
 *
 * Recomputes the full entry list on every call rather than caching it, to
 * mirror Astro's own getCollection() semantics — content changes are picked
 * up on the next render without a manual invalidation path to maintain.
 */

import { getCollection, type CollectionEntry, type CollectionKey } from "astro:content";
import { collections as collectionConfig } from "@/content/config";

type AnyEntry = CollectionEntry<CollectionKey>;

// Flip to true to log every dead [[wikilink]]/WikiLink target hit during a
// build — off by default since the dashed dead-link styling already covers
// the common case, and the log gets noisy on a content tree with drafts.
export const WARN_ON_DEAD_LINKS = false;

export interface WikiTarget {
  exists: boolean;
  title?: string;
}

export async function resolveWikiTarget(href: string): Promise<WikiTarget> {
  const collectionKeys = Object.keys(collectionConfig);

  // Draft entries are excluded here — a link to a draft-only slug (e.g. a
  // stub page created just to satisfy a reference() relation) should render
  // as dead, since the page itself doesn't get built.
  const allEntries = (await Promise.all(collectionKeys.map((key) => getCollection(key as any, ({ data }: any) => !data.draft)))).flat() as AnyEntry[];

  const match = allEntries.find((entry) => `/${entry.collection}/${entry.slug}` === href);

  if (!match) {
    if (WARN_ON_DEAD_LINKS) {
      console.warn(`[wikilink] dead link target: ${href}`);
    }
    return { exists: false };
  }

  return { exists: true, title: (match.data as { title?: string }).title };
}
