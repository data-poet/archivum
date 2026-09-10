/**
 * articleData.ts — Shared data-fetching for article ([...slug].astro) pages.
 *
 * religions/[...slug].astro and races/[...slug].astro each need the same
 * two things to render: the entry's own data and the set of valid slugs
 * across every collection (for WikiLink/RelLink dead-link checks). This was
 * duplicated ~15 lines per file; now it's one function both pages call.
 *
 * Also resolves every reference()-schema relation field on `data` back into
 * the { slug, label } shape infoboxes/RelLink expect (see resolveRelations()
 * below) — the config.ts schema itself only stores { collection, slug }.
 */

import { type CollectionEntry, type CollectionKey } from "astro:content";
import { getImage } from "astro:assets";
import { getRegistry } from "@/shared/content/contentRegistry";

type AnyEntry = CollectionEntry<CollectionKey>;

// A relation field resolved by Astro's reference() schema helper is exactly
// { collection, slug } — nothing else in the schema produces that shape
// (plain strings, string arrays, and image() results all fail this check),
// so it's a safe, unambiguous detector.
function isRelationRef(value: unknown): value is { collection: string; slug: string } {
  return !!value && typeof value === "object" && typeof (value as any).collection === "string" && typeof (value as any).slug === "string" && Object.keys(value as object).length === 2;
}

function toLegacyRel(ref: { collection: string; slug: string }, titleBySlug: Map<string, string>) {
  const slug = `${ref.collection}/${ref.slug}`;
  return { slug, label: titleBySlug.get(slug) ?? slug };
}

/**
 * Converts every reference()-resolved field on an entry's data into the
 * { slug: "collection/slug", label } shape RelLink.jsx and every infobox
 * component already expect. This is the one place that has to know about
 * reference()'s output shape — WikiLayout, [...slug].astro pages, and every
 * infobox keep working unmodified after the config.ts migration to
 * reference().
 */
function resolveRelations(data: Record<string, unknown>, titleBySlug: Map<string, string>) {
  const resolved: Record<string, unknown> = { ...data };

  for (const [key, value] of Object.entries(resolved)) {
    if (isRelationRef(value)) {
      resolved[key] = toLegacyRel(value, titleBySlug);
    } else if (Array.isArray(value) && value.length > 0 && value.every(isRelationRef)) {
      resolved[key] = value.map((v) => toLegacyRel(v, titleBySlug));
    }
  }

  return resolved;
}

export interface ArticleImage {
  src: string;
  caption?: string;
  alt?: string;
  type?: string;
  primary?: boolean;
}

export interface ArticleData {
  // entry.data, typed loosely — see the as-any note in each [...slug].astro
  // for why (discriminated-union narrowing doesn't survive Astro's compiled
  // sequence of per-type JSX blocks).
  data: any;
  validSlugs: Set<string>;
  // Pre-optimized images, ready to hand to MediaInfobox (a React component —
  // it can't use Astro's own <Image/>, so optimization has to happen here,
  // server-side, before the plain URL string gets passed down as a prop).
  images: ArticleImage[];
  // The image marked `primary`, falling back to the first one — used for
  // WikiLayout's og:image/twitter:image, so link previews get a real image.
  coverImage?: ArticleImage;
}

export async function getArticleData(entry: AnyEntry): Promise<ArticleData> {
  // contentRegistry keys everything as "/collection/slug" (matching
  // WikiLink/Ref's href convention) — validSlugs/RelLink expect the
  // leading-slash-less "collection/slug" shape instead, so strip it here
  // rather than re-scanning every collection a second time in this shape.
  const { validPaths, titleByPath } = await getRegistry();

  const validSlugs = new Set([...validPaths].map((path) => path.slice(1)));

  // titleByPath includes drafts (e.g. stub god pages created only to satisfy
  // a reference() target) — a relation pointing at an unwritten draft
  // should still show the entry's real title ("Asgorath") rather than its
  // raw slug, even though validSlugs above correctly keeps it non-clickable
  // since the page isn't built.
  const titleBySlug = new Map([...titleByPath].map(([path, title]) => [path.slice(1), title]));
  const data = resolveRelations(entry.data as Record<string, unknown>, titleBySlug) as any;

  // Each raw image's `src` is an imported ImageMetadata object (from the
  // content schema's image() validator) — optimize it to a capped width,
  // webp output, and pull out the final URL string MediaInfobox needs.
  const images: ArticleImage[] = await Promise.all(
    (data.images ?? []).map(async (img: any) => {
      const optimized = await getImage({ src: img.src, width: 800, format: "webp" });
      return { ...img, src: optimized.src };
    })
  );

  const coverImage = images.find((img) => img.primary) ?? images[0];

  return { data, validSlugs, images, coverImage };
}
