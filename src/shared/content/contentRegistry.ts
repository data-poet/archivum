/**
 * contentRegistry.ts — Shared, build-memoized index of every content entry.
 *
 * WikiLink/Ref (per [[wikilink]] occurrence — hundreds per article) and
 * getArticleData (per page) each used to run their own full multi-collection
 * getCollection() scan to answer "does this href exist" / "what's its
 * title". At thousands of articles and links that's O(links × entries) of
 * redundant work, repeated independently by unrelated call sites. This
 * module computes that scan exactly once and hands every consumer the same
 * result.
 *
 * Memoization only applies in production builds (`astro build`), which
 * render the whole site in one sequential static pass — computing the
 * registry once at the start and reusing it for every page/link is safe
 * because nothing changes mid-build. In `astro dev`, getRegistry() always
 * recomputes fresh: a module-level cache has no way to know a content file
 * changed underneath it (Vite doesn't invalidate this module just because
 * an unrelated .mdx changed), and the working set an author is actively
 * viewing in dev is small enough that recomputing per call costs nothing.
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

export interface ContentRegistry {
  /** `/${collection}/${slug}` for every non-draft entry — existence checks. */
  validPaths: Set<string>;
  /** `/${collection}/${slug}` → title, including drafts, so a link to an
   *  unwritten stub still shows its real title instead of a raw slug. */
  titleByPath: Map<string, string>;
}

async function scanCollections(includeDrafts: boolean): Promise<AnyEntry[]> {
  const collectionKeys = Object.keys(collectionConfig);
  const filter = includeDrafts ? undefined : ({ data }: any) => !data.draft;

  const lists = await Promise.all(collectionKeys.map((key) => getCollection(key as any, filter as any)));
  return lists.flat() as AnyEntry[];
}

async function buildRegistry(): Promise<ContentRegistry> {
  const [liveEntries, allEntries] = await Promise.all([scanCollections(false), scanCollections(true)]);

  const validPaths = new Set(liveEntries.map((entry) => `/${entry.collection}/${entry.slug}`));

  const titleByPath = new Map(allEntries.map((entry) => [`/${entry.collection}/${entry.slug}`, (entry.data as { title?: string }).title ?? `/${entry.collection}/${entry.slug}`]));

  return { validPaths, titleByPath };
}

let cachedRegistry: Promise<ContentRegistry> | null = null;

export function getRegistry(): Promise<ContentRegistry> {
  if (import.meta.env.PROD) {
    if (!cachedRegistry) cachedRegistry = buildRegistry();
    return cachedRegistry;
  }

  return buildRegistry();
}

export async function resolveWikiTarget(href: string): Promise<WikiTarget> {
  const { validPaths, titleByPath } = await getRegistry();

  if (!validPaths.has(href)) {
    if (WARN_ON_DEAD_LINKS) {
      console.warn(`[wikilink] dead link target: ${href}`);
    }
    return { exists: false };
  }

  return { exists: true, title: titleByPath.get(href) };
}
