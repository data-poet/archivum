import { getCollection, type CollectionEntry, type CollectionKey } from "astro:content";

export async function resolveWikiEntry(ref: {
  collection: string;
  slug: string;
}) {
  const entries = (await getCollection(ref.collection as any, ({ data }: any) => !data.draft)) as CollectionEntry<
    CollectionKey
  >[];

  return entries.find((entry) => entry.slug === ref.slug);
}
