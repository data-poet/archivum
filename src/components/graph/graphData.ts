// graphData.ts — resolves the mention graph for one article: itself as the
// center node, plus every distinct [[wikilink]] target in its body as a
// neighbor. Neighbors that don't exist yet still get a node (title guessed
// from the slug) so the graph shows what's unwritten, not just what's real.

import { getImage } from "astro:assets";
import type { CollectionEntry, CollectionKey } from "astro:content";
import type { ImageMetadata } from "astro";
import { getRegistry } from "@/shared/content/contentRegistry";
import { extractMentionHrefs } from "@/shared/content/wikilinks";

const THUMBNAIL_SIZE = 128;

export interface GraphNode {
  href: string;
  title: string;
  image?: string;
  exists: boolean;
}

export interface GraphData {
  center: GraphNode;
  neighbors: GraphNode[];
}

// "characters/dragons/ptaris" -> "Ptaris" — only used when there's no real
// entry (draft or otherwise) to pull an actual title from.
function labelFromHref(href: string): string {
  const last = href.split("/").filter(Boolean).pop() ?? href;
  return last
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function optimizeThumbnail(raw: ImageMetadata | undefined) {
  if (!raw) return undefined;
  const optimized = await getImage({ src: raw, width: THUMBNAIL_SIZE, height: THUMBNAIL_SIZE, format: "webp" });
  return optimized.src;
}

export async function getGraphData(entry: CollectionEntry<CollectionKey>): Promise<GraphData> {
  const { validPaths, titleByPath, imageByPath } = await getRegistry();

  const centerHref = `/${entry.collection}/${entry.slug}`;

  const center: GraphNode = {
    href: centerHref,
    title: (entry.data as { title: string }).title,
    image: await optimizeThumbnail(imageByPath.get(centerHref)),
    exists: true,
  };

  const mentionHrefs = extractMentionHrefs(entry.body).filter((href) => href !== centerHref);

  const neighbors: GraphNode[] = await Promise.all(
    mentionHrefs.map(async (href) => ({
      href,
      title: titleByPath.get(href) ?? labelFromHref(href),
      image: await optimizeThumbnail(imageByPath.get(href)),
      exists: validPaths.has(href),
    }))
  );

  return { center, neighbors };
}
