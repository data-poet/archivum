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
import type { ImageMetadata } from "astro";
import { collections as collectionConfig } from "@/content/config";
import { COLLECTION_RELATIONS } from "@/content/relations";

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
  /** `/${collection}/${slug}` → entry `type`, including drafts — used by the relation lint below. */
  typeByPath: Map<string, string>;
  /** `/${collection}/${slug}` → raw cover image, for entries that have one — see resolveCoverImage(). */
  imageByPath: Map<string, ImageMetadata>;
}

/** First image marked `primary`, else the first image, else none — same rule articleData.ts uses. */
function resolveCoverImage(data: unknown): ImageMetadata | undefined {
  const images = (data as { images?: { src: ImageMetadata; primary?: boolean }[] }).images;
  if (!images?.length) return undefined;
  return (images.find((img) => img.primary) ?? images[0]).src;
}

async function scanCollections(includeDrafts: boolean): Promise<AnyEntry[]> {
  const collectionKeys = Object.keys(collectionConfig);
  const filter = includeDrafts ? undefined : ({ data }: any) => !data.draft;

  const lists = await Promise.all(collectionKeys.map((key) => getCollection(key as any, filter as any)));
  return lists.flat() as AnyEntry[];
}

/**
 * Checks every reference field declared in `COLLECTION_RELATIONS` against the actual `type`
 * of its target entry (e.g. a god's `pantheonRef` must point at a `pantheon`, not a `church`).
 * `reference()` alone only proves the slug exists, not that it's the right kind of entry —
 * this is the only place that catches a relation pointed at the wrong type.
 */
function validateRelations(allEntries: AnyEntry[], typeByPath: Map<string, string>): void {
  const violations: string[] = [];

  for (const entry of allEntries) {
    const rules = COLLECTION_RELATIONS[entry.collection]?.filter((rule) => rule.type === (entry.data as { type?: string }).type) ?? [];
    if (rules.length === 0) continue;

    const entryPath = `/${entry.collection}/${entry.slug}`;
    const data = entry.data as Record<string, unknown>;

    for (const rule of rules) {
      const value = data[rule.field];
      if (value == null) continue;

      const refs = Array.isArray(value) ? value : [value];
      for (const ref of refs) {
        const ref_ = ref as { collection: string; slug: string };
        const targetPath = `/${ref_.collection}/${ref_.slug}`;
        const targetType = typeByPath.get(targetPath);

        if (targetType === undefined) {
          violations.push(`${entryPath}.${rule.field} → ${targetPath} does not exist`);
        } else if (!rule.targetTypes.includes(targetType)) {
          violations.push(`${entryPath}.${rule.field} → ${targetPath} is type "${targetType}", expected one of [${rule.targetTypes.join(", ")}]`);
        }
      }
    }
  }

  if (violations.length > 0) {
    throw new Error(`Invalid content relations:\n${violations.join("\n")}`);
  }
}

async function buildRegistry(): Promise<ContentRegistry> {
  const [liveEntries, allEntries] = await Promise.all([scanCollections(false), scanCollections(true)]);

  const validPaths = new Set(liveEntries.map((entry) => `/${entry.collection}/${entry.slug}`));

  const titleByPath = new Map(allEntries.map((entry) => [`/${entry.collection}/${entry.slug}`, (entry.data as { title?: string }).title ?? `/${entry.collection}/${entry.slug}`]));

  const typeByPath = new Map(allEntries.map((entry) => [`/${entry.collection}/${entry.slug}`, (entry.data as { type: string }).type]));

  const imageByPath = new Map(
    allEntries
      .map((entry) => [`/${entry.collection}/${entry.slug}`, resolveCoverImage(entry.data)] as const)
      .filter((pair) => pair[1] !== undefined) as [string, ImageMetadata][]
  );

  validateRelations(allEntries, typeByPath);

  return { validPaths, titleByPath, typeByPath, imageByPath };
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
