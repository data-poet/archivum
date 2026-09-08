/**
 * homeData.ts — Fetches everything the homepage needs to render.
 *
 * Pulls entries for every collection listed in homeCollections.ts, then
 * derives the two things the homepage displays from that same data:
 *   - totalArticles — count across all collections
 *   - recent        — the 5 most recently updated/published entries,
 *                      across every collection, newest first
 *
 * Kept as one function (rather than three separate fetches) since totals
 * and "recent" are both just different views over the same entries — no
 * reason to hit getCollection() more than once per collection.
 */

import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content';
import { HOME_COLLECTIONS, type HomeCollectionConfig } from './homeCollections';

type AnyEntry = CollectionEntry<CollectionKey>;

export interface HomeCollectionData extends HomeCollectionConfig {
  entries: AnyEntry[];
}

export type RecentEntry = AnyEntry & {
  collectionLabel: string;
  collectionHref: string;
  sortDate: Date;
};

export interface HomeData {
  collectionData: HomeCollectionData[];
  totalArticles: number;
  recent: RecentEntry[];
}

export async function getHomeData(): Promise<HomeData> {
  const collectionData: HomeCollectionData[] = await Promise.all(
    HOME_COLLECTIONS.map(async (collection) => {
      const entries = (await getCollection(
        collection.key as any,
        ({ data }: any) => !data.draft
      )) as AnyEntry[];

      return { ...collection, entries };
    })
  );

  const totalArticles = collectionData.reduce(
    (acc, collection) => acc + collection.entries.length,
    0
  );

  const recent = collectionData
    .flatMap((collection) =>
      collection.entries.map((entry) => ({
        ...entry,
        collectionLabel: collection.label,
        collectionHref: collection.href,
        sortDate: entry.data.updatedAt ?? entry.data.publishedAt ?? new Date(0),
      }))
    )
    .sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime())
    .slice(0, 5);

  return { collectionData, totalArticles, recent };
}
